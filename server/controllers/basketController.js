const ApiError = require('../error/ApiError');
const { UserBasket, BasketToursPanel, BasketTour, UserBasketsHotels, UserBasketTour } = require("../models/models");
const jwt = require('jsonwebtoken');

class BasketController {

    async removeHotelFromBasket(req, res, next) {
        try {
            const {basket_id} = req.params;
            await UserBasketsHotels.destroy({where:{
                id:basket_id
            }})
            return res.json('Отель удален из корзины')
            
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async removeAllHotels (req,res,next) {
        try{
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;

            await UserBasketsHotels.destroy({where:{
                userId:id,
                status:false
            }})
            return res.json('Все Отели были удалены')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async removeTourFromBasket(req,res,next){
        try {
            const {basket_id} = req.params;
            await UserBasketTour.destroy({where:{
                id:basket_id
            }})
            return res.json('Тур удален из корзины')
            
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async removeAllTours(req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;

            await UserBasketTour.destroy({where:{
                userId:id,
                status:false
            }})
            return res.json('Все Отели были удалены')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async fetchPayedHotels (req,res,next) {
        try{
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;

            const hotels = await UserBasketsHotels.findAll({where:{
                userId:id,
                status:true
            }})
            return res.json(hotels)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async fetchPayedTours (req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;

            const tours = await UserBasketTour.findAll({where:{
                userId:id,
                status:true
            }})
            return res.json(tours)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new BasketController();
