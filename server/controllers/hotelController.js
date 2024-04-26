const ApiError = require('../error/ApiError')
const { Hotel, HotelInfo, HotelDates, UserBasketsHotels } = require('../models/models')
const path = require('path')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')
const internal = require('stream')

class HotelController {
    async create(req, res, next) {
        try {
            const { name, description, city, rating, price } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            
            const hotel = await Hotel.create({
                name,
                img: fileName,
                city,
                rating,
                price,
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

    async addToCart(req,res,next){
        try {
            const { hotelId, date_in, date_out, rooms, count } = req.body;
            console.log('Received request body:', req.body);       
            const massRooms = rooms.split(',').map(Number)
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const hotel = await HotelInfo.findOne({where:{
                hotelId:hotelId
            }});
            const hotel_1 = await Hotel.findOne({where:{
                id:hotelId
            }})
            const price = hotel_1.price*parseInt(count)
            const freeRooms = hotel.freerooms;
            let isDataCorrect = false
            if (!hotel) {
                return res.json('Отель не найден');
            }
              
            if (!(count >= 1 && count <= 100)) {
                return res.json('Количество должно быть от 1 до 100');
            }
              
            if (!hotelId) {
                return res.json('ID отеля не указан');
            }
            if(date_in >= date_out){
                return res.json('Не указаны даты')
            }
              
            if (!rooms) {
                return res.json('Номера не указаны');
            }
              
            if (parseInt(count) !== massRooms.length) {
                return res.json('Количество номеров не совпадает с указанным числом');
            }
              
            isDataCorrect = true;
              
            const userBasketHotel = await UserBasketsHotels.findAll({where:{
                hotelId:hotelId,
                status:true,
                date_in: { [Op.lt]: date_out },
                date_out: { [Op.gt]: date_in },
            }})

            const userBasket = await UserBasketsHotels.findAll({where:{
                hotelId:hotelId,
                status:false,
                date_in: { [Op.lt]: date_out },
                date_out: { [Op.gt]: date_in },
                userId:id,
            }})
           
            if (userBasket && userBasket.length > 0) {
                // Массив номеров из корзины пользователя
                const userBasketRooms = userBasket.reduce((acc, booking) => {
                  acc.push(...booking.rooms);
                  return acc;
                }, []);
              
                // Проверяем, есть ли совпадение между номерами из корзины пользователя и номерами, введёнными пользователем
                const hasMatchingRooms = userBasketRooms.some((room) => massRooms.includes(room));
              
                if (hasMatchingRooms) {
                    return next(ApiError.badRequest('Номера уже были добавлены'))
                }
              }


            let availableRooms
            if(userBasketHotel && userBasketHotel.length>0){
                const bookedRooms = userBasketHotel.reduce((acc, booking) => {
                    acc.push(...booking.rooms);
                    return acc;
                }, []);
            
                availableRooms = freeRooms.filter(room => !bookedRooms.includes(room));

                let areRoomsAvailable = massRooms.every(room => availableRooms.includes(room));
                if(areRoomsAvailable){
                    const addToBasket = await UserBasketsHotels.create({
                        hotelId:hotelId,
                        date_in:date_in,
                        date_out:date_out,
                        count:count,
                        rooms:massRooms,
                        price:price,
                        userId:id
                    })
                    return res.json(addToBasket)
                }
                else{
                    return next(ApiError.badRequest('Недоступно'))
                }
                
            }else{
                if(isDataCorrect){
                    const addToBasket = await UserBasketsHotels.create({
                        hotelId:hotelId,
                        date_in:date_in,
                        date_out:date_out,
                        count:count,
                        rooms:massRooms,
                        price:price,
                        userId:id
                    })
                    return res.json(addToBasket)
                }else{
                    return  res.json('Что-то пошло не так')
                }
                
            }
        } catch (e) {
            // Обработка ошибок
            return next(ApiError.badRequest(e.message));
        }

    }

    async isDataCorrect(req, res, next) {
        try {
            const { hotelId, date_in, date_out, count } = req.body;
            const data = {
                rooms:[],
                count:0,
                isOk:false
            }
            const userBasketHotel = await UserBasketsHotels.findAll({where:{
                hotelId:hotelId,
                status:true,
                date_in: { [Op.lt]: date_out },
                date_out: { [Op.gt]: date_in },
            }})
            const hotel = await HotelInfo.findOne({
                where: {
                    hotelId: hotelId
                }
            });
            const freeRooms = hotel.freerooms;
            let availableRooms
            if(userBasketHotel && userBasketHotel.length>0){
                const bookedRooms = userBasketHotel.reduce((acc, booking) => {
                    acc.push(...booking.rooms);
                    return acc;
                }, []);
            
                availableRooms = freeRooms.filter(room => !bookedRooms.includes(room));
                if(availableRooms && availableRooms.length>=parseInt(count)){
                    data.rooms = availableRooms
                    data.count = availableRooms.length
                    data.isOk = true
                }else{
                    data.isOk = false
                }
            }
            else if(freeRooms.length>=parseInt(count)){
                data.rooms = freeRooms
                data.count = freeRooms.length
                data.isOk = true
            }
            return res.json(data)
            
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }
    

    async payCartElem (req,res,next){
        try{    
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const {basket_id} = req.body;
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
}

module.exports = new HotelController()
