const ApiError = require('../error/ApiError')
const {Hotel} = require('../models/models')
const path = require('path')
const uuid = require('uuid')
class HotelController{
    async create(req,res,next){
        try{
            const {name, description} = req.body//делаем из тела запроса
            const {img} = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..','static', fileName))

            const hotel = await Hotel.create({name,description,img:fileName})
            
            return res.json(hotel)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req,res){
        const hotels = await Hotel.findAll()
        return hotels

    }
    async getOne(req,res){

    }
}


module.exports = new HotelController()