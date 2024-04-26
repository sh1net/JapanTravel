const ApiError = require('../error/ApiError')
const path = require('path')
const uuid = require('uuid')
const { Tour, TourInfo, UserBasketTour } = require('../models/models')
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

            const tour = await TourInfo.findOne({where:{
                tourId:tourId
            }})

            if(!tour){
                return res.json('Тур не найден')
            }

            const tour_main = await Tour.findOne({where:{
                id:tourId
            }})

            const tourPrice = count * tour_main.price

            await UserBasketTour.create({count, date, tourId, userId:id, price:tourPrice})
            return res.json('Тур успешно добавлен в корзину')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async checkData (req,res,next){
        try{
            const {date, tourId, count} = req.body;
            let freeCount = 0

            const userBasket = await UserBasketTour.findAll({where:{
                tourId:tourId,
                status:true,
                date:{[Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%Y-%m-%d'), {
                        [Op.eq]: date.substring(0, 10) // Получаем подстроку с датой без времени
                    })
                ]}
            }})
            if(!userBasket && userBasket.length<0){
                const userBasketHotel = await UserBasketTour.findAll({where:{
                    tourId:tourId,
                    status:false,
                    date:{[Op.eq] : date}
                }})
                return res.json(userBasketHotel)
            }
            
            const userBasketCount = userBasket.reduce((acc, booking) => {
                acc+=booking.count;
                return acc;
              }, []);

            const tour = await TourInfo.findOne({where:{
                tourId:tourId
            }})

            if(!tour){
                return res.json('Тур не найден')
            }
            freeCount = tour.freeCount - userBasketCount
            return res.json(freeCount)

        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new TourController()
