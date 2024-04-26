const ApiError = require("../error/ApiError")
require('dotenv').config()
const uuid = require('uuid')
const path = require('path')
const bcrypt = require('bcrypt')
const {User, Basket, UserBasket} = require('../models/models')
const jwt = require('jsonwebtoken')

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
                return next(ApiError.badRequest('Неккоректный email или password'))
            }
            const candidate = await User.findOne({where:{email}})
            if(candidate){
                return next(ApiError.badRequest('Пользователь уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email,role:"ADMIN",password:hashPassword})
            const basket = await UserBasket.create({userId:user.id})
            const token = generateJwt(user.id)
            return res.json({token})
        }
        catch(e){
            return next(ApiError.badRequest('Внутренняя ошибка сервера'))
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
            return res.json({token})
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
                await user.update({ img: fileName });
            }
    
            if (newPassword) {
                const hashNewPassword = await bcrypt.hash(newPassword, 5);
                await user.update({ password: hashNewPassword });
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
    
            return res.json(user);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }    
    
           
}


module.exports = new UserController()