const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const { CombinedTours, Tour, Hotel, TourCombinedTours, TourInfo, HotelInfo, CombinedTourReviews, User, HotelReviews, UserBasketsHotels, UserBasketTour, CombineTourBasket } = require('../models/models')
const {Op} = require('sequelize')

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

            const reviews = await CombinedTourReviews.findAll({where:{
                combinedTourId:id,
                status:true
            }})
            
            let rateSum =0
            let count
            if(reviews && reviews.length>0){
                for(let i=0;i<reviews.length;i++){
                    rateSum +=reviews[i].rate
                    count = i
                }   
                rateSum /=(count+1);
            }

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
            combinedTours.update({rating:parseInt(rateSum)})
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

    async addToCart(req,res,next){
        try{
            const {comboId, countArr, date, date_in, date_out, price, rooms} = req.body
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            console.log({comboId, countArr, date, date_in, date_out, price, rooms})
            const newDateArray = date.map(dateStr => {
                const date = new Date(dateStr)
                date.setHours(12,0,0)
                return date
            })
            
            const massRooms = rooms
            const count = countArr.split(',').map(str => parseInt(str));
            
            const comboTour = await CombineTourBasket.create({date_in,date_out,date:newDateArray,count,rooms:massRooms,status:false,price,userId:id,combinedTourId:comboId })
            if(comboTour){
                return res.json('Успешно')
            }
            return res.json('что-то пошло не так')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async checkFree(req,res,next){
        try{
            const {date_in, date_out, dateOfTours, tourIds, hotelId, count, comboTourId} = req.body
            const tourArr = tourIds.split(',')
            const token = req.headers.authorization.split(' ')[1]; // Нахождение user
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;
            
            const data = {
                count: 0,
                isOk: false,
                isToursOk:false,
                tourCounts:[],
            };

            let datesOfTours
            if(dateOfTours){
                datesOfTours = dateOfTours.split(',')
            }

            const userBasketHotel = await UserBasketsHotels.findAll({
                where: {
                    hotelId: hotelId,
                    status: true,
                    date_in: { [Op.lt]: date_out },
                    date_out: { [Op.gt]: date_in },
                }
            });

            const userCombine = await CombinedTours.findAll({
                where: {
                    hotelId: hotelId,
                }
            })
            const combineIds = userCombine.map(item => item.id)
            const userBasketCombine = await CombineTourBasket.findAll({
                where: {
                    combinedTourId: {[Op.in]:combineIds},
                    status: true,
                    date_in: { [Op.lt]: date_out },
                    date_out: { [Op.gt]: date_in },
                }
            }) 
            const hotel = await HotelInfo.findOne({
                where: {
                    hotelId: hotelId
                }
            });
    
            const freeRooms = hotel.freerooms;
            let availableRooms = [...freeRooms];
    
            if (userBasketHotel && userBasketHotel.length > 0) {
                const bookedRooms = new Set(userBasketHotel.reduce((acc, booking) => {
                    acc.push(...booking.rooms.map(room => room[0]));
                    return acc;
                }, []));
                console.log('bookedRooms:', bookedRooms); // Лог bookedRooms
                let bookedRooms_2 = new Set();
                if (userBasketCombine && userBasketCombine.length > 0) {
                    bookedRooms_2 = new Set(userBasketCombine.reduce((acc, booking) => {
                        if (Array.isArray(booking.rooms)) {
                            acc.push(...booking.rooms.map(room => room[0]));
                        }
                        return acc;
                    }, []));
                }
                console.log('bookedRooms_2:', bookedRooms_2); // Лог bookedRooms_2
                availableRooms = availableRooms.filter(room => !bookedRooms.has(room[0]));
                if(bookedRooms_2){
                    availableRooms = availableRooms.filter(room => !bookedRooms_2.has(room[0]))
                }
                
                if (availableRooms.length >= parseInt(count)) {
                    data.rooms = availableRooms;
                    data.count = availableRooms.length;
                    data.isOk = true;
                } else {
                    data.isOk = false;
                }
            } else if (freeRooms.length >= parseInt(count)) {
                data.count = freeRooms.length;
                data.rooms = availableRooms;
                data.isOk = true;
            }

            if(data.isOk && datesOfTours && datesOfTours.length>0){
                const toursInComb = await TourCombinedTours.findAll({where:{
                    tourId:{[Op.in] :tourArr},
                    combinedTourId:comboTourId
                }})
                const newDateArray = datesOfTours.map(dateStr => {
                    const date = new Date(dateStr)
                    date.setHours(12,0,0)
                    return date
                })
                const tour = await TourInfo.findAll({where:{
                    tourId:{[Op.in]:tourArr}
                }})        
                let freeCount = tour.map(tour => tour.freeCount)
                const basketPayedTours = await UserBasketTour.findAll({where:{
                    date: {[Op.in] : newDateArray},
                    tourId:{[Op.in]:tourArr},
                    status:true
                }})
                if (basketPayedTours && basketPayedTours.length > 0) {
                    basketPayedTours.forEach(payedTour => {
                        const tourId = payedTour.tourId;
                        const payedCount = payedTour.count.reduce((sum, currentValue) => sum + currentValue, 0);
                        const tourIndex = tour.findIndex(t => t.tourId === tourId);
                        if (tourIndex !== -1) {
                            freeCount[tourIndex] -= payedCount;
                        }
                    });
                }
                //ДОДЕЛАТЬ ПРОВЕРКУ НА НАЛИЧИЕ ТУРОВ В ТАБЛИЦЕ КОМБО ТУРОВ
                const basketUserTours = await UserBasketTour.findAll({where:{
                    date: {[Op.in] : newDateArray},
                    tourId:{[Op.in]:tourArr},
                    userId:id,
                    status:false
                }})
                let payedCount = [];
                if (Array.isArray(basketUserTours)) {
                    payedCount = basketUserTours.map((item) => {
                        const tourId = item.tourId;
                        const count = item.count.reduce((sum, currentValue) => sum + currentValue, 0);
                        const tourIndex = tour.findIndex(t => t.tourId === tourId);
                        return { tourId, count, tourIndex };
                    });
                } else if (basketUserTours) {
                    const tourId = basketUserTours.tourId;
                    const count = basketUserTours.count.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                    const tourIndex = tour.findIndex(t => t.tourId === tourId);
                    payedCount.push({ tourId, count, tourIndex });
                }
                payedCount.forEach(payed => {
                    freeCount[payed.tourIndex] -= payed.count;
                });
                if(freeCount.every(count => count > 0)){
                    data.tourCounts = freeCount
                    data.isToursOk = true
                }else{
                    data.tourCounts=[]
                    data.isToursOk = false
                }
                return res.json(data)

            }
            return res.json(data);
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async ComboInBasket(req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Получаем токен пользователя
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;

            const combo = await CombineTourBasket.findAll({where:{
                userId:id,
                status:false
            }})

            return res.json(combo)
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async payCombo(req,res,next){
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
            const {comboTourId, fullName, phoneNumber, pasportNumber, taxi, guide, help, basketId, price} = req.body;
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
            const user_basket = await CombineTourBasket.findOne({where:{
                id:basketId,
                userId:id,
                status: false,
                combinedTourId:comboTourId
            }})
            if(user_basket){
                await user_basket.update({status:true, fullName:fullName.split(','), phoneNumber, pasportNumber, taxi:taxist, guide:guider, helper:helper, price })
            }
            else{
                return res.json('Такая корзина не найдена')
            }
            return res.json('Оплата прошла успешно')
        }catch(e){
            return next(ApiError.badRequest(e.message))
        }
    }

    async createReview(req,res,next){
        try{
            const token = req.headers.authorization.split(' ')[1]; // Нахождение user
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { id } = decodedToken;

            const {description, rate, comboTourId} = req.body
            const comboTour = await CombinedTours.findOne({where:{id:comboTourId}})
            if(!comboTour){
                return res.json('что-то пошло не так')
            }

            const isPayed = await CombineTourBasket.findAll({where:{
                userId:id,
                status:true,
                combinedTourId:comboTourId
            }})
            if(isPayed && isPayed.length>0){
                const isReview = await CombinedTourReviews.findAll({where:{
                    userId:id, 
                    combinedTourId:comboTourId,
                }})
                if(isReview && isReview.length>0){
                    return next(ApiError.badRequest('Отзыв уже был оставлен'))
                }else{
                    const review = await CombinedTourReviews.create({description,rate,userId:id, combinedTourId:comboTourId, status:false})
                    if(!review){
                        return res.json('Не получилось оставить отзыв')
                    }
                    return res.json('Ваш отзыв отправлен на рассмотрение')
                }
                
            }else{
                return next(ApiError.badRequest('Товар не был куплен'))
            }
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    //при подгрузке данных
    async getReviews(req,res,next){
        try{
            const {comboTourId} = req.params
            const reviews = await CombinedTourReviews.findAll({where:{
                combinedTourId:comboTourId,
                status:true
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
            return next(ApiError.badRequest(e.message))
        }
    }

    async updateReview (req,res,next){
        try{
            const {userId, reviewId} = req.body
            const review = await CombinedTourReviews.findOne({where:{
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
}

module.exports = new CombinedTourController()