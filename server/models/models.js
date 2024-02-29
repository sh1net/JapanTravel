//Не точная схема, может редактироваться

const sequelize = require('../db')
const {DataTypes} = require('sequelize')//позволяет описать типы данных

const User=sequelize.define('user',{
    id:{type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    email:{type:DataTypes.STRING,unique:true},
    password: {type: DataTypes.STRING},
    role:{type:DataTypes.STRING,defaultValue:"USER"}
})

const Basket=sequelize.define('basket',{
    id:{type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
})

const BasketTour=sequelize.define('basket_tour',{
    id:{type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
})

const Tour=sequelize.define('tour',{
    id:{type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    name:{type: DataTypes.STRING,unique:true,allowNull:false},
    rating:{type: DataTypes.INTEGER,allowNull:false},
    price:{type: DataTypes.INTEGER,defaultValue:0},
    img:{type: DataTypes.STRING,unique:true,allowNull:false},
})

const Hotel=sequelize.define('hotel',{
    id:{type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    name:{type: DataTypes.STRING,allowNull:false},
    img:{type: DataTypes.STRING,unique:true,allowNull:false},
    description:{type: DataTypes.STRING,unique:true,allowNull:false},
})

const Rating=sequelize.define('rating',{
    id:{type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    rate:{type:DataTypes.INTEGER,allowNull:false}
})

const Reviews = sequelize.define('reviews',{
    id:{type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    description:{type: DataTypes.STRING,allowNull:false}
})

const TourInfo=sequelize.define('tour_info',{
    id:{type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    title:{type: DataTypes.STRING,allowNull:false},
    description:{type: DataTypes.STRING,allowNull:false}
})

const TourBasketTour = sequelize.define('tour_basket_tour',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true}
})

User.hasOne(Basket)// у пользователя одна корзина
Basket.belongsTo(User)

User.hasMany(Rating)//у пользователя много отзывов и тд
Rating.belongsTo(User)

Basket.hasMany(BasketTour)
BasketTour.belongsTo(Basket)

Tour.belongsToMany(BasketTour,{through: TourBasketTour})
BasketTour.belongsToMany(Tour,{through: TourBasketTour})

TourInfo.hasOne(Hotel)
Hotel.belongsTo(TourInfo)

Hotel.hasMany(TourInfo)
TourInfo.belongsTo(Hotel)

Tour.hasMany(Rating)
Rating.belongsTo(Tour)

User.hasMany(Reviews)
Reviews.belongsTo(User)

TourInfo.hasMany(Reviews)
Reviews.belongsTo(TourInfo)


Tour.hasMany(TourInfo, {as:'info'})
TourInfo.belongsTo(Tour)

module.exports = {
    User,
    Basket,
    BasketTour, 
    Tour, 
    TourInfo, 
    Hotel, 
    Rating,
    Reviews,
    TourBasketTour
}