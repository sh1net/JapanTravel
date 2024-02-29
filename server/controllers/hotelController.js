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
        return res.json(hotels)

    }
    async getOne(req,res,next){
        try{
            const {id} = req.params
            const hotel = await Hotel.findOne({
                where:{
                    id
                }
            })
            if(!hotel){
                return next(ApiError.badRequest("Отель не найден"))
            }
            else{
                return res.json(hotel)
            }
            
        }
        catch(e){
            return next(ApiError.badRequest("Ошибка сервера"))
        }
    }
}


module.exports = new HotelController()