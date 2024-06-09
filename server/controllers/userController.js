const ApiError = require("../error/ApiError")
require('dotenv').config()
const uuid = require('uuid')
const path = require('path')
const bcrypt = require('bcrypt')
const {User, Reviews, TourInfo, HotelReviews, CombinedTourReviews, Tour, UserBasketTour} = require('../models/models')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const generateJwt = (id) =>{
    return jwt.sign(
        {id},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}

class UserController{
    async registration(req,res,next){
        try{
            const {email,password} = req.body
            if(!email || !password){
                return next(ApiError.badRequest('Неккоректная почта или пароль'))
            }
            if(password.length<8 && password!=='admin'){
                return next(ApiError.badRequest('Слишком короткий пароль (мин.8)'))
            }
            const candidate = await User.findOne({where:{email}})
            if(candidate){
                return next(ApiError.badRequest('Пользователь уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email,role:"User",password:hashPassword})
            const token = generateJwt(user.id)
            return res.json({token})
        }
        catch(e){
            return next(ApiError.badRequest(e.message))
        }
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
            const token = generateJwt(user.id)
            return res.json({token,role:user.role})
        }
        catch(e){
            return next(ApiError.badRequest("Внутренняя ошибка сервера"))
        }
    }
    async check(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const {id} = decodedToken;
            const user = await User.findByPk(id);
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
            return res.json({token});
        } catch (e) {
            return next(ApiError.badRequest('Неверный токен или истек срок его действия'));
        }
    }

    async getUserInfo(req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const {id} = decodedToken
            const user = await User.findByPk(id)
            if(!user){
                return next(ApiError.badRequest("Пользователь не найден"))
            }
            return res.json(user)
        }
        catch(e){
            return next(ApiError.badRequest("Ошибка в коде"))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.badRequest(`Не найден пользователь с id: ${id}`));
            }
            await User.destroy({ where: { id } });
            return res.json({ message: 'Пользователь удален' });
        } catch (e) {
            return next(ApiError.internal('Ошибка сервера'));
        }
    } 

    async CheckPassword(req,res,next){
        try{
            const {oldPassword} = req.body
            const token = req.headers.authorization.split(' ')[1];//Нахождение user
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const user = await User.findOne({
                where:{
                    id: id
                }
            })
            const isPassValid = bcrypt.compareSync(oldPassword,user.password)
            return res.json(isPassValid)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async UpdateUser(req, res, next) {
        try {
            const { nickname, email, newPassword } = req.body;
    
            let fileName = ''; // Работа с картинкой
            if (req.files && req.files.img) {
                const { img } = req.files;
                fileName = uuid.v4() + '.jpg';
                img.mv(path.resolve(__dirname, '..', 'static', fileName));
            }
    
            const token = req.headers.authorization.split(' ')[1]; // Нахождение user
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const user = await User.findByPk(id);
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
    
            if (fileName) {
                if(user.img === 'user_default_photo.jpg'){
                    await user.update({ img: fileName });
                }else{
                    const filePath = path.resolve(__dirname, '..', 'static', user.img);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Ошибка при удалении файла ${filePath}:`, err);
                        }
                    });
                    await user.update({ img: fileName });
                }
            }
    
            if (newPassword) {
                if(newPassword.length>7){
                    const hashNewPassword = await bcrypt.hash(newPassword, 5);
                    await user.update({ password: hashNewPassword });
                }else{
                    return next(ApiError.badRequest('Новый пороль слишком короткий (мин.8)'))
                }
            }
    
            if (email) {
                const email_1 = await User.findOne({ where: { email: email } });
                if (email_1 && email_1.id != id) {
                    return next(ApiError.badRequest('Пользователь с такой почтой уже существует'));
                }
                await user.update({ email });
            }
    
            if (nickname) {
                await user.update({ nickname });
            }
    
            return res.json('Успешно обновлен');
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }    
    
    async createReview (req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Нахождение user
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const {description, rate, tourId} = req.body
            const tour = await TourInfo.findOne({where:{tourId:tourId}})
            if(!tour){
                return res.json('Тур не найден')
            }
            const isPayed = await UserBasketTour.findAndCountAll({where:{
                userId:id,
                status:true,
                tourId:tourId
            }})
            if(isPayed && isPayed.count>0){
                const isReview = await Reviews.findAndCountAll({where:{
                    userId:id, 
                    tourInfoId:tourId,
                }})
                if(isReview && isReview.count>=isPayed.count){
                    return next(ApiError.badRequest('Отзыв уже был оставлен'))
                }else{
                    const review = await Reviews.create({description,rate,userId:id, tourInfoId:tour.id, status:false})
                    if(!review){
                        return res.json('Не получилось оставить отзыв')
                    }
                    return res.json('Ваш отзыв отправлен на рассмотрение')
                }
                
            }else{
                return next(ApiError.badRequest('Товар не был куплен'))
            }
            
        }catch(e){
            return res.json('Ошибка сервера')
        }
    }

    async updateReview (req,res,next){
        try{
            const {userId, reviewId} = req.body
            const review = await Reviews.findOne({where:{
                userId:userId,
                id:reviewId
            }})
            if(review){
                 review.update({userId:userId,id:reviewId,status:true})
            }
            return res.json(review)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async getTourReviews (req,res,next){
        try{
            const {tourId} = req.params

            const tour = await TourInfo.findOne({where:{
                tourId:tourId
            }})
            const reviews = await Reviews.findAll({where:{
                tourInfoId:tour.id,
                status:true,
            }})
            const usersPromises = reviews.map(async (result) => {
                const user = await User.findOne({ where: { id: result.userId } });
                return { nickname: user.nickname, img: user.img };
            });
            const users = await Promise.all(usersPromises);
             
            if(!reviews || reviews.length<1){
                return res.json('Нет отзывов')
            }
            const formattedReviews = reviews.map((review, index) => {
                return { ...review.toJSON(), user: users[index] };
            });
    
            return res.json(formattedReviews);
        }catch(e){
            return res.json('На сервере нет отзывов')
        }
    }

    async getUserReviews(req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const reviews = await Reviews.findAll({
                where:{
                    userId:id,
                    status:true
                }
            })

            const hotelReviews = await HotelReviews.findAll({where:{
                userId:id,
                status:true
            }})

            const comboReviews = await CombinedTourReviews.findAll({where:{
                userId:id,
                status:true
            }})
            if((!reviews || reviews.length<1)&&(!hotelReviews || hotelReviews.length<0)&&(!comboReviews || comboReviews.length<0)){
                return res.json('Нет отзывов')
            }

            const allReviews = [
                ...reviews.map(review => ({ ...review.toJSON() })),
                ...hotelReviews.map(hotelReview => ({ ...hotelReview.toJSON() })),
                ...comboReviews.map(comboReview => ({ ...comboReview.toJSON() }))
              ];
            return res.json(allReviews)
        }catch(e){
            return res.json('На сервере нет отзывов')
        }
    }

    async delUserReview(req,res,next){
        try{
            const formReviews = req.params
            const newForm = JSON.parse(formReviews.formReviews)
            console.log(newForm)
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;

            if(newForm.tourId){
                await Reviews.destroy({
                    where:{
                        id:newForm.reviewId,
                        tourInfoId:newForm.tourId,
                        userId:id,
                        status:true
                    }
                })
            }

            if(newForm.hotelId){
                await HotelReviews.destroy({
                    where:{
                        id:newForm.reviewId,
                        hotelInfoId:newForm.hotelId,
                        userId:id,
                        status:true
                    }
                })
            }

            if(newForm.combinedTourId){
                await CombinedTourReviews.destroy({
                    where:{
                        id:newForm.reviewId,
                        combinedTourId:newForm.combinedTourId,
                        userId:id,
                        status:true
                    }
                })
            }

            return res.json('Отзыв удален')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }
           
}


module.exports = new UserController()