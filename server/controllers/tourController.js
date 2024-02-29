const ApiError = require('../error/ApiError')
const path = require('path')
const uuid = require('uuid')
const {Tour,TourInfo} = require('../models/models')
class TourController{
    async create(req,res,next){
        try{
            const {name, rating,price,info} = req.body//делаем из тела запроса
            const {img} = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..','static', fileName))

            const tour = await Tour.create({name,price,rating,img:fileName})

            if(info){
                info = JSON.parse(info)
                info.forEach(i=>
                    TourInfo.create({
                       title: i.title,
                       description: i.description,
                       tourId: tour.id
                    })
                )
            }
            
            return res.json(tour)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req,res){
        const {hotelId,limit,page} = req.query
        let tours
        if(!hotelId){
            tours = await Tour.findAndCountAll()
        }
        if(hotelId){
            tours = await Tour.findAndCountAll({where:{hotelId}})
        }
        return res.json(tours)

    }
    async getOne(req,res){
        const {id} = req.params
        const tour = await Tour.findOne(
            {
                where:{id},
                include:[{model:TourInfo, as: 'info'}]
            }
        )
        return res.json(tour)
    }
}


module.exports = new TourController()