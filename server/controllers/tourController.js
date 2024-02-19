const ApiError = require('../error/ApiError')
const path = require('path')
const uuid = require('uuid')
const {Tour} = require('../models/models')
class TourController{
    async create(req,res,next){
        try{
            const {name, rating,price, hotelId, reviewId} = req.body//делаем из тела запроса
            const {photo} = req.files
            let fileName = uuid.v4() + '.jpg'
            photo.mv(path.resolve(__dirname, '..','static', fileName))

            const tour = await Tour.create({name,price,rating,hotelId,reviewId,photo:fileName})
            
            return res.json(tour)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req,res){

    }
    async getOne(req,res){

    }
}


module.exports = new TourController()