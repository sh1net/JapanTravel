const ApiError = require("../error/ApiError")
require('dotenv').config()
const bcrypt = require('bcrypt')
const {User,BasketTour,Tour,Basket} = require('../models/models')
const jwt = require('jsonwebtoken')

const generateJwt = (id,email,role) =>{
    return jwt.sign(
        {id,email,role},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}

class UserController{
    async registration(req,res,next){
        const {email,password,role} = req.body
        if(!email || !password){
            return next(ApiError.badRequest('Неккоректный email или password'))
        }
        const candidate = await User.findOne({where:{email}})
        if(candidate){
            return next(ApiError.badRequest('Пользователь уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email,role,password:hashPassword})
        const basket = await Basket.create({uesrId:user.id})
        const token = generateJwt(user.id,user.email,user.role)
            return res.json({token})
    }
    async login(req,res,next){
        try{
            const{email,password} = req.body
            const user = await User.findOne({
                where:{
                    email
                }
            })
            if(!user){
                return next(ApiError.badRequest("Пользователь с таким email не существует"))
            }
            let isPassValid = bcrypt.compareSync(password,user.password)

            if(!isPassValid){
                return next(ApiError.badRequest("Неверный пароль"))
            }
            const token = generateJwt(user.id,user.email,user.role)
            return res.json({token})
        }
        catch(e){
            return next(ApiError.badRequest("Внутренняя ошибка сервера"))
        }
    }
    async check(req,res,next){
       const token = generateJwt(req.user.id,req.user.email,req.user.role)
       return res.json({token})
    }

    async delete(req,res,next){
        try{
            const id = req.params
            if(!id){
                return next(ApiError.badRequest(`Не найден пользователь с id: ${id}`))
            }
            if(id){
                await User.delete({where:{id}})
                return res.json({message:'Пользователь удален'})
            }
        }
        catch(e){
            return next(ApiError.badRequest('Ошибка сервера'))
        }
    }
    
    async getAll(req,res,next){
        try{
            const users = await User.findAll()
            const unHash = users.map((user)=>{
                const{password,...unHash} = user.dataValues
                return unHash
            })
            return res.json(unHash)
        }
        catch(e){
            return ApiError.badRequest("Не найдены пользователи")
        }
    }

    async AddToBasket(req,res,next){
        try {
            const { userId, tourId } = req.body;
    
            // Проверка наличия обязательных параметров в запросе
            if (!userId || !tourId) {
                return next(ApiError.badRequest('Не указан userId или tourId'));
            }
    
            // Находим пользователя и тур
            const user = await User.findByPk(userId);
            const tour = await Tour.findByPk(tourId);
    
            // Проверка существования пользователя и тура
            if (!user || !tour) {
                return next(ApiError.notFound('Пользователь или тур не найден'));
            }
    
            // Находим корзину пользователя или создаем новую
            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                basket = await Basket.create({ userId });
            }
    
            // Создаем запись в таблице BasketTour
            const tour_basket = await BasketTour.create({ basketId: basket.id, tourId });
    
            return res.json(tour_basket);
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }

    async userBasket(req,res,next){
        try{
            
        }
        catch(e){
            return next(ApiError.badRequest("Ошибка сервера"))
        }
    }
    
}


module.exports = new UserController()