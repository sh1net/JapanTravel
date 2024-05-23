const ApiError = require('../error/ApiError')
const { Hotel, HotelInfo, HotelDates, UserBasketsHotels, HotelReviews, User } = require('../models/models')
const path = require('path')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')
const internal = require('stream')

class HotelController {
    async create(req, res, next) {
        try {
            const { name, description, city, price, coordinates } = req.body
            const { img } = req.files

            const location = coordinates.split(',')
            const fileNames = [];
            
            // Перебираем все файлы изображений в req.files
            for (let i = 0; i < img.length; i++) {
                const fileName = uuid.v4() + '.jpg'; // Генерируем уникальное имя для файла
                fileNames.push(fileName); // Добавляем имя файла в массив
    
                // Перемещаем файл в указанную директорию
                await img[i].mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            const hotel = await Hotel.create({
                name,
                img: fileNames,
                city,
                price,
                location:location
            })

            const hotelInfo = await HotelInfo.create({
                title: name,
                description: description,
                hotelId:hotel.id
            })
            return res.json(hotel)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addToCart(req, res, next) {
        try {
            const { hotelId, date_in, date_out, rooms, hotelCount, price } = req.body;//Принимаем значения
            const massRooms = rooms.split(',').map(Number);//Получаем массив комнат
    
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;//Получаем user id
            
            const countArr = hotelCount.split(',').map(str => parseInt(str)); //Массив билетов
            const count = countArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);//Сумма билетов
            
            if (!hotelId) {
                return res.json('ID отеля не указан');
            }
            if (date_in >= date_out) {
                return res.json('Не указаны даты');
            }
            if (!rooms) {
                return res.json('Номера не указаны');
            }
            if (parseInt(count) !== massRooms.length) {
                return res.json('Количество номеров не совпадает с указанным числом');
            }           
    
            const userBasket = await UserBasketsHotels.findAll({
                where: {
                    hotelId: hotelId,
                    status: false,
                    date_in: { [Op.lt]: date_out },
                    date_out: { [Op.gt]: date_in },
                    userId: id,
                }
            });
    
            if (userBasket && userBasket.length > 0) {
                const userBasketRooms = userBasket.reduce((acc, booking) => {
                    acc.push(...booking.rooms);
                    return acc;
                }, []);
    
                const hasMatchingRooms = userBasketRooms.some((room) => massRooms.includes(room));
    
                if (hasMatchingRooms) {
                    return next(ApiError.badRequest('Номера уже были добавлены'));
                }
            }
            
            // Создание записи в базе данных
            const addToBasket = await UserBasketsHotels.create({
                hotelId: hotelId,
                date_in: date_in,
                date_out: date_out,
                count: countArr,
                rooms: massRooms,
                price: price,
                userId: id
            });
            return res.json(addToBasket);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }
    

    async isDataCorrect(req,res,next) {
        try {
            const {hotelId, date_in, date_out, count} = req.body
            const data = {
                rooms: [],
                count: 0,
                isOk: false
            };
            console.log({hotelId, date_in, date_out, count})
            const userBasketHotel = await UserBasketsHotels.findAll({
                where: {
                    hotelId: hotelId,
                    status: true,
                    date_in: { [Op.lt]: date_out },
                    date_out: { [Op.gt]: date_in },
                }
            });
            const hotel = await HotelInfo.findOne({
                where: {
                    hotelId: hotelId
                }
            });
            const freeRooms = hotel.freerooms;
            let availableRooms;
            if (userBasketHotel && userBasketHotel.length > 0) {
                const bookedRooms = userBasketHotel.reduce((acc, booking) => {
                    acc.push(...booking.rooms);
                    return acc;
                }, []);
    
                availableRooms = freeRooms.filter(room => !bookedRooms.includes(room));
                if (availableRooms && availableRooms.length >= parseInt(count)) {
                    data.rooms = availableRooms;
                    data.count = availableRooms.length;
                    data.isOk = true;
                } else {
                    data.isOk = false;
                }
            } else if (freeRooms.length >= parseInt(count)) {
                data.rooms = freeRooms;
                data.count = freeRooms.length;
                data.isOk = true;
            }
            return res.json(data);
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    
    

    async payCartElem (req,res,next){
        try{    
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const {basket_id, fullName, phoneNumber, pasportNumber, taxi, guide, help} = req.body;
            console.log(id,basket_id)
            const user_basket = await UserBasketsHotels.findOne({where:{
                userId:id,
                status: false,
                id:basket_id
            }})
            if(user_basket){
                await user_basket.update({status:true})
            }
            else{
                return res.json('Такая корзина не найдена')
            }
            return res.json('Оплата прошла успешно')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAllHotelBaskets(req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const hotels = await UserBasketsHotels.findAll({where:{
                userId:id,
                status:false
            }})
            return res.json(hotels)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const hotels = await Hotel.findAndCountAll()
            return res.json(hotels)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const hotel = await Hotel.findOne({ where: { id }, include: [{ model: HotelInfo, as: 'info' }] })
            if (!hotel) {
                return next(ApiError.badRequest("Отель не найден"))
            } else {
                return res.json(hotel)
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async createReview (req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Нахождение user
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const {description, rate, hotelId} = req.body
            const hotel = await HotelInfo.findOne({where:{id:hotelId}})
            if(!hotel){
                return res.json('что-то пошло не так')
            }
            const review = await HotelReviews.create({description,rate,userId:id, hotelInfoId:hotelId})
            if(!review){
                return res.json('Не получилось оставить отзыв')
            }
            return res.json('Ваш отзыв оставлен успешно')
        }catch(e){
            return res.json('Ошибка сервера')
        }
    }

    async getHotelReviews (req,res,next){
        try{
            const {hotelId} = req.params
            const reviews = await HotelReviews.findAll({where:{
                hotelInfoId:hotelId
            }})
            const usersPromises = reviews.map(async (result) => {
                const user = await User.findOne({ where: { id: result.userId } });
                return { nickname: user.nickname, img: user.img };
            });
            const users = await Promise.all(usersPromises);
             
            if(!reviews || reviews.length<1){
                return res.json('Нет отзывов')
            }
            const formattedReviews = reviews.map((review, index) => {
                return { ...review.toJSON(), user: users[index] };
            });
    
            return res.json(formattedReviews);
        }catch(e){
            return res.json('На сервере нет отзывов')
        }
    }

    async updateReviews (req,res,next){
        try{
            const {id} = req.body
            const reviews = await HotelReviews.findAll({where:{
                hotelInfoId:id
            }})
            
            let rateSum =0
            let count
            for(let i=0;i<reviews.length;i++){
                rateSum +=reviews[i].rate
                count = i
            }   
            rateSum /=(count+1);

            const hotel = await Hotel.findOne({where:{
                id:id
            }})
            if(hotel){
                hotel.update({rating:parseInt(rateSum)})
            }
            return res.json(hotel.rating)
        }catch(e){
            return res.json('Увы')
        }
    }
}

module.exports = new HotelController()
