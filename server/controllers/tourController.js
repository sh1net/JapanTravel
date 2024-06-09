const ApiError = require('../error/ApiError')
const path = require('path')
const uuid = require('uuid')
const { Tour, TourInfo, UserBasketTour, UserBasket, Reviews, CombinedTours, TourCombinedTours, CombineTourBasket, User, CombinedTourReviews, HotelReviews } = require('../models/models')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')
const Sequelize = require('sequelize')
const fs = require('fs')

class TourController {
    async create(req, res, next) {
        try {
            const { name, price, info, city, coordinates } = req.body
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest('Все поля должны быть заполнены'));
            }
            const { img } = req.files
            if (!name || !price || !info || !city || !coordinates || !img ) {
                return next(ApiError.badRequest('Все поля должны быть заполнены'));
            }
            let imgArr = [img]
            if(imgArr.length<0){
                return next(ApiError.badRequest('Картинок минимум 2'));
            }
            const location = coordinates.split(',')
            const fileNames = [];

            // Перебираем все файлы изображений в req.files
            for (let i = 0; i < img.length; i++) {
                const fileName = uuid.v4() + '.jpg'; // Генерируем уникальное имя для файла
                fileNames.push(fileName); // Добавляем имя файла в массив
    
                // Перемещаем файл в указанную директорию
                await img[i].mv(path.resolve(__dirname, '..', 'static', fileName));
            }
    
            const tour = await Tour.create({ name, price, img: fileNames, city, location:location })
            const tourInfo = await TourInfo.create({
                title: name,
                description: info,
                tourId: tour.id,
            })
            if(tour && tourInfo){
                return res.json('Успешно создан')
            }
            
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const data = req.body
            const oldImages = data.oldImgs.split(',')
            if (!data.name || !data.price || !data.info || !data.city || !data.coordinates ) {
                return next(ApiError.badRequest('Все поля должны быть заполнены'));
            }
            let fileName;
            let fileNames = [];
            if (req.files && req.files.img) {
                const { img } = req.files;
                if (Array.isArray(img)) {
                    for (let i = 0; i < img.length; i++) {
                        fileName = uuid.v4() + '.jpg';
                        fileNames.push(fileName);
                        await img[i].mv(path.resolve(__dirname, '..', 'static', fileName));
                    }
                } else {
                    fileName = uuid.v4() + '.jpg';
                    fileNames.push(fileName);
                    await img.mv(path.resolve(__dirname, '..', 'static', fileName));
                }
            }
            
            const tour = await Tour.findByPk(data.id)
            if (!tour) {
                return res.json('Тур не найден')
            }
            const updatedImages = tour.img.filter((image) => oldImages.includes(image));
            if(fileNames && fileNames.length>0){
                fileNames.map(item => updatedImages.push(item))
            }
            if(updatedImages.length<2){
                return next(ApiError.badRequest('Выберите больше изображений'))
            }
            
            const tour_info = await TourInfo.findOne({ where: { tourId: tour.id } })

            await tour.update({
                name: data.name,
                info: data.info,
                price: parseInt(data.price),
                img: updatedImages,
                location:data.coordinates.split(','),
                city:data.city
            })
            await tour_info.update({
                title: tour.name,
                description: data.info,
                tourId: data.tourId,
            })
            return res.json('Успешно обновлено');
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { tour_id } = req.params;
            const tour = await Tour.findOne({where:{id:tour_id}})
            const imgs = tour?.img
            if(imgs && Array.isArray(imgs)) {
                imgs.forEach(image => {
                    const filePath = path.resolve(__dirname, '..', 'static', image);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Ошибка при удалении файла ${filePath}:`, err);
                        }
                    });
                });
            }
            const data = await TourCombinedTours.findAll({where:{
                tourId:tour_id
            }})
            const tourInfo = await TourInfo.findOne({where:{
                tourId:tour_id
            }})

            const basketTour = await UserBasketTour.findAll({where:{
                status:true,
                tourId:tour_id
            }})
            if (data && data.length > 0) {
                await Promise.all(data.map(async item => {
                    await CombineTourBasket.destroy({ where: { combinedTourId: item.combinedTourId } });
                    await CombinedTourReviews.destroy({ where: { id: item.combinedTourId } });
                }));
            }
            if (basketTour && basketTour.length > 0) {
                await Promise.all(basketTour.map(item => item.update({ tourId: null })));
                console.log(basketTour)
            }
            await UserBasketTour.destroy({where:{tourId:tour_id}})
            await Reviews.destroy({where:{tourInfoId:tourInfo.id}})
            await TourInfo.destroy({where:{tourId:tour_id}}) 
            await TourCombinedTours.destroy({where:{tourId:tour_id}})
            await Tour.destroy({where: { id: tour_id }});                     
            return res.json('Успешно');
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
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

            const tourInfo = await TourInfo.findOne({where:{
                tourId:id
            }})
            const reviews = await Reviews.findAll({where:{
                tourInfoId:tourInfo.id,
                status:true
            }})
            
            let rateSum = 0
            let count
           if(reviews && reviews.length>0){
                for(let i=0;i<reviews.length;i++){
                    rateSum +=reviews[i].rate
                    count = i
                }   
                rateSum /=(count+1);
           }

            const tour = await Tour.findOne({
                where: { id },
                include: [{ model: TourInfo, as: 'info' }]
            })
            tour.update({rating:parseInt(rateSum)})
            return res.json(tour)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addTourToCart (req,res,next) {
        try{
            //После вызова isDataCorrect передаем сюда массив детей и родителей, дату, тур айди и вычесленную стоимость
            const {tourCount,date, tourId, price} = req.body
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const newDate = `${date.split(' ')[0]} 12:00:00`
            const tour = await TourInfo.findOne({where:{
                tourId:tourId
            }})        
            let freeCount = tour.freeCount
            const countArr = tourCount.split(',').map(str => parseInt(str));
            const count = countArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            //Ищем в корзине пользователя
            const userBasketTour = await UserBasketTour.findOne({where:{
                userId:id,
                tourId:tourId,
                status:false,
                date:{[Op.eq] : newDate}
            }})
            if(userBasketTour){
                //Если нашло в корзине пользователя
                freeCount = freeCount-count-userBasketTour.count.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                if(freeCount>=0){
                    const dbArr = userBasketTour.count
                    const sumArrays = (arr1, arr2) => arr1.map((num, idx) => num + arr2[idx]);
                    const result = sumArrays(countArr, dbArr);
                    const price_2 = parseInt(price) + parseInt(userBasketTour.price)
                    await userBasketTour.update({count:result,price:parseInt(price_2)})  
                    return res.json('Успешно')
                }
            }else{
                //Если не нашло в корзине пользователя
                freeCount -= count
                if(freeCount>=0){
                    await UserBasketTour.create({count:countArr,date:newDate,tourId,userId:id, price:parseInt(price)})
                    return res.json('Успешно')
                }
            }
            return res.json('Не нашло нигде')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async isDataCorrect (req,res,next) {
        try{
            const {date, tourId} = req.body
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const newDate = `${date.split(' ')[0]} 12:00:00`
            if(!date || date.length<0){
                return next(ApiError.badRequest('Введите дату'))
            }
            
            const data = {
                count:0,
                isOk:false
            }

            const tour = await TourInfo.findOne({where:{
                tourId:tourId
            }})        
            let freeCount = tour.freeCount

            const basketPayedTours = await UserBasketTour.findAll({where:{
                date: {[Op.eq] : newDate},
                tourId:tourId,
                status:true
            }})

            if(basketPayedTours){
                const payedCount = basketPayedTours.reduce((acc, booking) => {
                    acc=booking.count.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                    return acc;
                }, []);
                freeCount -= payedCount
            }

            const basketUserTours = await UserBasketTour.findOne({where:{
                date: {[Op.eq] : newDate},
                tourId:tourId,
                userId:id,
                status:false
            }})
            if(basketUserTours){
                freeCount = freeCount-basketUserTours.count.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            }
            if(freeCount>0){
                data.count = freeCount
                data.isOk = true
            }else{
                data.count=0
                data.isOk = false
            }
            return res.json(data)


        }catch(e){
            console.error('Error:', e.message);
            return next(ApiError.badRequest(e.message))
        }
    }

    async payTour (req,res,next){
        try{
            const maleNames = [
                "Александр", "Михаил", "Дмитрий", "Иван", "Алексей",
                "Сергей", "Николай", "Владимир", "Андрей", "Виктор"
            ];
            const femaleNames = [
                "Анна", "Мария", "Елена", "Ольга", "Наталья",
                "Екатерина", "Ирина", "Татьяна", "Юлия", "Светлана"
            ];
            const allNames = [...maleNames, ...femaleNames];

            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            const {tourId, fullName, phoneNumber, pasportNumber, taxi, guide, help, basketId, price, name} = req.body
            let taxist = []
            let guider = []
            let helper = []

            if(!fullName || !phoneNumber || !pasportNumber){
                return next(ApiError.badRequest('Заполните все данные'))
            }
            if(taxi && taxi.length>0){
                const randomIndex = Math.floor(Math.random() * allNames.length);
                taxist[0]=allNames[randomIndex]
                taxist[1]=taxi
            }
            if(guide && guide.length>0){
                const randomIndex = Math.floor(Math.random() * allNames.length);
                guider[0]=allNames[randomIndex]
                guider[1]=guide
            }
            if(help && help.length>0){
                const randomIndex = Math.floor(Math.random() * allNames.length);
                helper[0]=allNames[randomIndex]
                helper[1]=help
            }
            const tour = await UserBasketTour.findOne({where:{
                id:basketId,
                userId:id,
                tourId:tourId,
                status:false
            }})
            if(tour){
                await tour.update({status:true, fullName:fullName.split(','), phoneNumber, pasportNumber, taxi:taxist, guide:guider, helper:helper, price, name })
            }
            return res.json('Успешно оплачено')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async toursInBasket (req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;

            const tours = await UserBasketTour.findAll({where:{
                userId:id,
                status:false,
            }})

            return res.json(tours)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async getNotAcceptReviews(req,res,next){
        try{
            const reviews = await Reviews.findAll({where:{status:false}})

            const hotelReviews = await HotelReviews.findAll({where:{status:false}})

            const comboTourReviews = await CombinedTourReviews.findAll({where:{status:false}})

            const usersPromises = [
                Promise.all(reviews.map(async (result) => {
                    const user = await User.findOne({ where: { id: result.userId } });
                    return { ...result.toJSON(), user: { nickname: user.nickname, img: user.img } };
                })),
                Promise.all(hotelReviews.map(async (result) => {
                    const user = await User.findOne({ where: { id: result.userId } });
                    return { ...result.toJSON(), user: { nickname: user.nickname, img: user.img } };
                })),
                Promise.all(comboTourReviews.map(async (result) => {
                    const user = await User.findOne({ where: { id: result.userId } });
                    return { ...result.toJSON(), user: { nickname: user.nickname, img: user.img } };
                })),
            ];
            const [formattedTourReviews, formattedHotelReviews, formattedComboTourReviews] = await Promise.all(usersPromises);
    
            const review = {
                tourReviews: formattedTourReviews,
                hotelReviews: formattedHotelReviews,
                comboReviews: formattedComboTourReviews,
            };
    
            return res.json(review)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async updateAcceptReview(req,res,next){
        try{
            const {reviewId} = req.body
            const review = await Reviews.findByPk(reviewId)
            if(review){
                review.update({status:true})
                return res.json('Отзыв одобрен')
            }
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async delReview(req,res,next){
        try{
            const {reviewId} = req.params
            await Reviews.destroy({where:{id:reviewId}})
            return res.json('Отзыв удален')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new TourController()
