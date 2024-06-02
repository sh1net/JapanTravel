const ApiError = require('../error/ApiError')
const { Hotel, HotelInfo, HotelDates, UserBasketsHotels, HotelReviews, User, CombineTourBasket, CombinedTours } = require('../models/models')
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
            const { hotelId, date_in, date_out, rooms, hotelCount, price } = req.body; // Принимаем значения
            const massRooms = rooms // Получаем двумерный массив комнат
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken; // Получаем user id
    
            const countArr = hotelCount.split(',').map(str => parseInt(str)); // Массив билетов
            const count = countArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0); // Сумма билетов
    
            if (!hotelId) {
                return res.json('ID отеля не указан');
            }
            if (date_in >= date_out) {
                return res.json('Не указаны даты');
            }
            if (!rooms) {
                return res.json('Номера не указаны');
            }
            const totalBeds = massRooms.reduce((acc, room) => acc + room[1], 0);
            if (parseInt(count) !== totalBeds) {
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
                const hasMatchingRooms = userBasketRooms.some((room) => 
                    massRooms.some(([roomNumber, beds]) => 
                        roomNumber === room[0] && beds === room[1]
                    )
                );
    
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
    
    async isDataCorrect(req, res, next) {
        try {
            const { hotelId, date_in, date_out, count } = req.body;
            const data = {
                count: 0,
                isOk: false
            };
    
            const userBasketHotel = await UserBasketsHotels.findAll({
                where: {
                    hotelId: hotelId,
                    status: true,
                    date_in: { [Op.lt]: date_out },
                    date_out: { [Op.gt]: date_in },
                }
            });

            const userCombine = await CombinedTours.findAll({
                where: {
                    hotelId: hotelId,
                }
            })
            const combineIds = userCombine.map(item => item.id)
            const userBasketCombine = await CombineTourBasket.findAll({
                where: {
                    combinedTourId: {[Op.in]:combineIds},
                    status: true,
                    date_in: { [Op.lt]: date_out },
                    date_out: { [Op.gt]: date_in },
                }
            }) 
    
            const hotel = await HotelInfo.findOne({
                where: {
                    hotelId: hotelId
                }
            });
    
            const freeRooms = hotel.freerooms;
            let availableRooms = [...freeRooms];
    
            if (userBasketHotel && userBasketHotel.length > 0) {
                const bookedRooms = new Set(userBasketHotel.reduce((acc, booking) => {
                    acc.push(...booking.rooms.map(room => room[0]));
                    return acc;
                }, []));
                let bookedRooms_2
                if(userBasketCombine && userBasketCombine.length>0){
                    bookedRooms_2 = new Set(userBasketCombine.reduce((acc,booking) => {
                        acc.push(...booking.rooms.map(room => room[0]))
                    }))
                }
                availableRooms = availableRooms.filter(room => !bookedRooms.has(room[0]) && (bookedRooms_2 ? !bookedRooms_2.has(room[0]): true));
                if (availableRooms.length >= parseInt(count)) {
                    data.rooms = availableRooms;
                    data.count = availableRooms.length;
                    data.isOk = true;
                } else {
                    data.isOk = false;
                }
            } else if (freeRooms.length >= parseInt(count)) {
                data.count = freeRooms.length;
                data.rooms = availableRooms;
                data.isOk = true;
            }
            
            return res.json(data);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }
     
    async payCartElem (req,res,next){
        try{   
            const maleNames = [
                "Александр", "Михаил", "Дмитрий", "Иван", "Алексей",
                "Сергей", "Николай", "Владимир", "Андрей", "Виктор"
            ];
            const femaleNames = [
                "Анна", "Мария", "Елена", "Ольга", "Наталья",
                "Екатерина", "Ирина", "Татьяна", "Юлия", "Светлана"
            ];
            const allNames = [...maleNames, ...femaleNames];
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const {hotelId, fullName, phoneNumber, pasportNumber, taxi, guide, help, basketId, price} = req.body;
            let taxist = []
            let guider = []
            let helper = []
            if(!fullName || !phoneNumber || !pasportNumber){
                return next(ApiError.badRequest('Заполните все данные'))
            }
            if(taxi && taxi.length>0){
                const randomIndex = Math.floor(Math.random() * allNames.length);
                taxist[0]=allNames[randomIndex]
                taxist[1]=taxi
            }
            if(guide && guide.length>0){
                const randomIndex = Math.floor(Math.random() * allNames.length);
                guider[0]=allNames[randomIndex]
                guider[1]=guide
            }
            if(help && help.length>0){
                const randomIndex = Math.floor(Math.random() * allNames.length);
                helper[0]=allNames[randomIndex]
                helper[1]=help
            }
            const user_basket = await UserBasketsHotels.findOne({where:{
                id:basketId,
                userId:id,
                status: false,
                hotelId:hotelId
            }})
            if(user_basket){
                await user_basket.update({status:true, fullName:fullName.split(','), phoneNumber, pasportNumber, taxi:taxist, guide:guider, helper:helper,price })
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

            const reviews = await HotelReviews.findAll({where:{
                hotelInfoId:id,
                status:true
            }})
            
            let rateSum =0
            let count
            if(reviews && reviews.length>0){
                for(let i=0;i<reviews.length;i++){
                    rateSum +=reviews[i].rate
                    count = i
                }   
                rateSum /=(count+1);
            }

            const hotel = await Hotel.findOne({ where: { id }, include: [{ model: HotelInfo, as: 'info' }] })
            if (!hotel) {
                return next(ApiError.badRequest("Отель не найден"))
            } else {
                if(rateSum>=0){
                    hotel.update({rating:parseInt(rateSum)})
                }
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
            console.log({description, rate, hotelId})
            const hotel = await HotelInfo.findOne({where:{id:hotelId}})
            if(!hotel){
                return res.json('что-то пошло не так')
            }
            const isPayed = await UserBasketsHotels.findAll({where:{
                userId:id,
                status:true,
                hotelId:hotelId
            }})
            if(isPayed && isPayed.length>0){
                const isReview = await HotelReviews.findAll({where:{
                    userId:id, 
                    hotelInfoId:hotelId,
                }})
                if(isReview && isReview.length>0){
                    return next(ApiError.badRequest('Отзыв уже был оставлен'))
                }else{
                    const review = await HotelReviews.create({description,rate,userId:id, hotelInfoId:hotelId, status:false})
                    if(!review){
                        return res.json('Не получилось оставить отзыв')
                    }
                    return res.json('Ваш отзыв отправлен на рассмотрение')
                }
            }else{
                return next(ApiError.badRequest('Товар не был куплен'))
            }
        }catch(e){
            return res.json('Ошибка сервера')
        }
    }

    async getHotelReviews (req,res,next){
        try{
            const {hotelId} = req.params
            const reviews = await HotelReviews.findAll({where:{
                hotelInfoId:hotelId,
                status:true,
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

    async updateReview (req,res,next){
        try{
            const {userId, reviewId} = req.body
            const review = await HotelReviews.findOne({where:{
                userId:userId,
                id:reviewId
            }})
            if(review){
                 review.update({userId:userId,id:reviewId,status:true})
            }
            return res.json(review)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new HotelController()
