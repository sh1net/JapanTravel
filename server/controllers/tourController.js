const ApiError = require('../error/ApiError')
const path = require('path')
const uuid = require('uuid')
const { Tour, TourInfo, UserBasketTour, UserBasket } = require('../models/models')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')
const Sequelize = require('sequelize')

class TourController {
    async create(req, res, next) {
        try {
            const { name, rating, price, info, city } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const tour = await Tour.create({ name, price, rating, img: fileName, city })
            const tourInfo = await TourInfo.create({
                title: name,
                description: info,
                tourId: tour.id,
            })
            return res.json(tour)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        try {
            const tours = await Tour.findAndCountAll()
            return res.json(tours)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const tour = await Tour.findOne({
                where: { id },
                include: [{ model: TourInfo, as: 'info' }]
            })
            return res.json(tour)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const data = req.body
            const { img } = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const tour = await Tour.findByPk(data.id)
            if (!tour) {
                return res.json('Тур не найден')
            }
            const tour_info = await TourInfo.findOne({ where: { tourId: tour.id } })
            await tour.update({
                name: data.name,
                rating: data.rating,
                info: data.info,
                price: data.price,
                img: fileName
            })
            await tour_info.update({
                title: tour.name,
                description: tour.info,
                hotelId: data.hotelId,
                date: data.date,
                count: data.count
            })
            return res.json({ tour, tour_info });
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async addTourToCart (req,res,next) {
        try{
            const {count,date, tourId} = req.body
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const newDate = `${date.split(' ')[0]} 12:00:00`
            const tour = await TourInfo.findOne({where:{
                tourId:tourId
            }})        
            let freeCount = tour.freeCount
            const tour_main = await Tour.findOne({where:{
                id:tourId
            }})

            const tourPrice = count * tour_main.price

            //Ищем купленные туры на дату
            const userBasket = await UserBasketTour.findAll({where:{
                userId:id,
                tourId:tourId,
                status:true,
                date: {[Op.eq] : newDate}
            }})

            //Если не нашло купленные
            if(!userBasket || userBasket.length<1){
                //Ищем в корзине туры
                const userBasketTour = await UserBasketTour.findOne({where:{
                    userId:id,
                    tourId:tourId,
                    status:false,
                    date:{[Op.eq] : newDate}
                }})
                //Если не нашло
                if(!userBasketTour){
                    await UserBasketTour.create({count, date:newDate, tourId, userId:id, price:tourPrice})
                    return res.json('Тур успешно добавлен в корзину')
                } 
                //Если нашло и их больше чем 1 
                if(userBasketTour.length>1){
                    const userBasketCount_2 = userBasketTour.reduce((acc, booking) => {
                    acc=booking.count;
                    return acc;
                }, []);
                }
                //Если нашло но он 1
                else{
                    freeCount -= userBasketTour.count
                }
                //Если остались билеты
                if(freeCount-parseInt(count)>=0){
                    await userBasketTour.update({count:userBasketTour.count+parseInt(count)})   
                    return res.json(`Количество билетов увеличено на ${count}`)
                }
                //Если не осталось      
                else{
                    return res.json('Все возможные билеты были добавлены')
                }    
            }
            //Если нашло купленные
            const userBasketCount = userBasket.reduce((acc, booking) => {
                acc=booking.count;
                return acc;
            }, []);
            freeCount -= userBasketCount
            const userBasketTour = await UserBasketTour.findOne({where:{
                userId:id,
                tourId:tourId,
                status:false,
                date:{[Op.eq] : newDate}
            }})
            if(userBasketTour){
                const userBasketCount_3 = userBasketTour.reduce((acc, booking) => {
                    acc=booking.count;
                    return acc;
                }, []);
                freeCount -= userBasketCount_3
                if(freeCount - parseInt(count)){
                    await userBasketTour.update({count:userBasketTour.count+parseInt(count)})   
                    return res.json(`Количество билетов увеличено на ${count}`)
                }
                else{
                    return res.json('Все возможные билеты были добавлены')
                }
            }else{
                if(freeCount-parseInt(count)>=0)
                {
                    await UserBasketTour.create({count, date:newDate, tourId, userId:id, price:tourPrice})
                    return res.json()
                }
                else{
                    return res.json('Нет билетов на данную дату')
                }
                    
            }
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async payTour (req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const {tourId} = req.body

            const tour = await UserBasketTour.findOne({where:{
                userId:id,
                tourId:tourId,
                status:false
            }})
            if(tour){
                await tour.update({status:true})
            }
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async toursInBasket (req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;

            const tours = await UserBasketTour.findAll({where:{
                userId:id,
                status:false,
            }})

            return res.json(tours)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new TourController()
