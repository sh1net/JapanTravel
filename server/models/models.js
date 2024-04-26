const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    nickname: { type: DataTypes.STRING, allowNull: true, defaultValue: "User" },
    img: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, defaultValue: "USER" }
});

const UserBasket = sequelize.define('user_basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const UserBasketTour = sequelize.define('basket_tour', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    count: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    price:{ type: DataTypes.INTEGER, defaultValue:0},
    status:{type: DataTypes.BOOLEAN, defaultValue:false},
});

const Tour = sequelize.define('tour', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const TourInfo = sequelize.define('tour_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING(100000), allowNull: false },
    freeCount: {type:DataTypes.INTEGER,defaultValue:20}
});
const Hotel = sequelize.define('hotel', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
});
let array = []
for(let i = 0; i<100;i++){
    array[i]=i+1;
}
const HotelInfo = sequelize.define('hotel_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING(100000), allowNull: false },
    freerooms:{type:DataTypes.ARRAY(DataTypes.INTEGER), defaultValue:array},
})

const UserBasketsHotels = sequelize.define('user_basket_hotel', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date_in: {type: DataTypes.DATE, allowNull:false},
    date_out: {type: DataTypes.DATE, allowNull:false},
    count: {type: DataTypes.INTEGER, allowNull:false},
    rooms: {type:DataTypes.ARRAY(DataTypes.INTEGER),allowNull:false},
    status:{type: DataTypes.BOOLEAN, defaultValue:false},
    price: {type: DataTypes.INTEGER, allowNull:false},
})

const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false }
});

const Reviews = sequelize.define('reviews', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.STRING, allowNull: false }
});


// Описываем ассоциации
User.hasOne(UserBasket);
UserBasket.belongsTo(User);

Hotel.hasMany(UserBasketsHotels);
UserBasketsHotels.belongsTo(Hotel)

Tour.hasMany(UserBasketTour)
UserBasketTour.belongsTo(Tour)

User.hasMany(UserBasketsHotels)
UserBasketsHotels.belongsTo(User)

User.hasMany(UserBasketTour)
UserBasketTour.belongsTo(User)

Tour.hasMany(Rating);
Rating.belongsTo(Tour);

User.hasMany(Reviews);
Reviews.belongsTo(User);

TourInfo.hasMany(Reviews);
Reviews.belongsTo(TourInfo);

Tour.hasMany(TourInfo, { as: 'info' });
TourInfo.belongsTo(Tour);

Hotel.hasMany(HotelInfo, { as: 'info' })
HotelInfo.belongsTo(Hotel)

module.exports = {
    User,
    UserBasket,
    Tour,
    TourInfo,
    Hotel,
    HotelInfo,
    Rating,
    Reviews,
    UserBasketsHotels,
    UserBasketTour
};
