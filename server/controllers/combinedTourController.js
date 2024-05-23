const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const { CombinedTours, Tour, Hotel, TourCombinedTours, TourInfo, HotelInfo } = require('../models/models')

class CombinedTourController {
    async create(req,res,next){
        try{
            const {tourId,hotelId} = req.body
            if(!tourId || !hotelId){
                return next(ApiError.badRequest('Неверно заполнены данные'))
            }
            const tourIds = tourId.split(',').map(id => parseInt(id.trim(), 10));
            if(tourIds.length<1){
                return next(ApiError.badRequest('Туров должно быть больше 1'))
            }
            
            const tour = await Tour.findAll({where:{id:tourIds}})
            const hotel = await Hotel.findOne({where:{id:hotelId}})
            if(!hotel || !tour){
                return res.json('Не найдены объекты')
            }
            const combinedHotel = await CombinedTours.create({hotelId})

            const tourCombinedToursData = tourIds.map(tourId => ({
                tourId,
                combinedTourId: combinedHotel.id
            }));
    
            await TourCombinedTours.bulkCreate(tourCombinedToursData);

            return res.json('Успешно создан')
        }catch(e){
            return next(ApiError.badRequest('Что-то пошло не так'))
        }
    }

    async getAll(req,res,next){
        try{
            const combinedTours = await CombinedTours.findAll({
                include: [
                    {
                        model: Tour,
                        through: {
                            attributes: [] // Не включаем атрибуты из таблицы связи
                        },
                        as: 'tours' // Псевдоним для связанных туров
                    },
                    {
                        model: Hotel,
                        as: 'hotel' // Псевдоним для связанного отеля
                    }
                ]
            });
    
            // Формируем данные в нужном формате
            const formattedData = combinedTours.map(ct => ({
                id:ct.id,
                rating:ct.rating,
                hotel: {
                    id: ct.hotel.id,
                    name: ct.hotel.name,
                    city: ct.hotel.city,
                    rating: ct.hotel.rating,
                    price: ct.hotel.price,
                    img: ct.hotel.img,
                    location: ct.hotel.location,
                    createdAt: ct.hotel.createdAt,
                    updatedAt: ct.hotel.updatedAt
                },
                tours: ct.tours.map(t => ({
                    id: t.id,
                    name: t.name,
                    rating: t.rating,
                    city: t.city,
                    price: t.price,
                    img: t.img,
                    location: t.location,
                    createdAt: t.createdAt,
                    updatedAt: t.updatedAt
                }))
            }));
    
            return res.json({data:formattedData,count:formattedData.length});
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req,res,next){
        try{
            const {id} = req.params
            const combinedTours = await CombinedTours.findOne({
                where: { id },
                include: [
                    {
                        model: Tour,
                        through: {
                            attributes: [] // Не включаем атрибуты из таблицы связи
                        },
                        as: 'tours', // Псевдоним для связанных туров
                        include: [{ model: TourInfo, as: 'info' }]
                    },
                    {
                        model: Hotel,
                        as: 'hotel',
                        include: [{ model: HotelInfo, as: 'info' }]
                    }
                ]
            });
            return res.json(combinedTours);
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    //админ панель
    async updateCombinedTour(req,res,next){
        try{

        }catch(e){
            return res.json(e.message)
        }
    }

    async createReview(req,res,next){
        try{

        }catch(e){
            return res.json(e.message)
        }
    }

    //при подгрузке данных
    async updateReviews(req,res,next){
        try{

        }catch(e){
            return res.json(e.message)
        }
    }
}

module.exports = new CombinedTourController()