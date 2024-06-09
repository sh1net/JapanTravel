const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    nickname: { type: DataTypes.STRING, allowNull: true, defaultValue: "User" },
    img: { type: DataTypes.STRING, defaultValue:'user_default_photo.jpg' },
    role: { type: DataTypes.STRING, defaultValue: "USER" }
});

const UserBasket = sequelize.define('user_basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const UserBasketTour = sequelize.define('basket_tour', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, defaultValue:'' },
    date: { type: DataTypes.DATE, allowNull: false },
    price:{ type: DataTypes.INTEGER, defaultValue:0},
    status:{type: DataTypes.BOOLEAN, defaultValue:false},
    count: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
    fullName:{type: DataTypes.ARRAY(DataTypes.STRING),allowNull:true},
    phoneNumber:{type:DataTypes.STRING,allowNull:true},
    pasportNumber:{type:DataTypes.STRING,allowNull:true},
    taxi:{type:DataTypes.ARRAY(DataTypes.STRING), defaultValue:null},
    guide:{type: DataTypes.ARRAY(DataTypes.STRING), defaultValue:null},
    helper:{type:DataTypes.ARRAY(DataTypes.STRING),defaultValue:null},
});

const Tour = sequelize.define('tour', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    city: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.ARRAY(DataTypes.STRING), unique: true, allowNull: false },
    location: {type:DataTypes.ARRAY(DataTypes.FLOAT), defaultValue: [34.967132, 135.772666]}
});

const TourInfo = sequelize.define('tour_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING(100000), allowNull: false },
    freeCount: {type:DataTypes.INTEGER,defaultValue:20},
});
const Hotel = sequelize.define('hotel', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0},
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.ARRAY(DataTypes.STRING), unique: true, allowNull: false },
    location: {type:DataTypes.ARRAY(DataTypes.FLOAT), defaultValue: [34.967132, 135.772666]}
});
let array = [];
for (let i = 0; i < 100; i++) {
    let roomNumber = i + 1;
    let beds = Math.floor(Math.random() * 4) + 1; // Random number of beds between 1 and 4
    array[i] = [roomNumber, beds];
}
const HotelInfo = sequelize.define('hotel_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING(100000), allowNull: false },
    freerooms: { type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.INTEGER)), defaultValue: array },
})

const UserBasketsHotels = sequelize.define('user_basket_hotel', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, defaultValue:'' },
    date_in: {type: DataTypes.DATE, allowNull:false},
    date_out: {type: DataTypes.DATE, allowNull:false},
    count: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
    rooms: {type:DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.INTEGER)),allowNull:false},
    status:{type: DataTypes.BOOLEAN, defaultValue:false},
    price: {type: DataTypes.INTEGER, allowNull:false},
    fullName:{type: DataTypes.ARRAY(DataTypes.STRING),allowNull:true},
    phoneNumber:{type:DataTypes.STRING,allowNull:true},
    pasportNumber:{type:DataTypes.STRING,allowNull:true},
    taxi:{type:DataTypes.ARRAY(DataTypes.STRING), defaultValue:null},
    guide:{type: DataTypes.ARRAY(DataTypes.STRING), defaultValue:null},
    helper:{type:DataTypes.ARRAY(DataTypes.STRING),defaultValue:null},
})

const Reviews = sequelize.define('reviews', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.STRING, allowNull: false },
    rate:{type:DataTypes.INTEGER,allowNull:false},
    status:{type: DataTypes.BOOLEAN, defaultValue:false},
});

const HotelReviews = sequelize.define('hotel_reviews',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.STRING, allowNull: false },
    rate:{type:DataTypes.INTEGER,allowNull:false},
    status:{type: DataTypes.BOOLEAN, defaultValue:false},
})

const CombinedTours = sequelize.define('combined_tours', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: { type: DataTypes.INTEGER, defaultValue: 0},
})

const TourCombinedTours = sequelize.define('TourCombinedTours', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const CombinedTourReviews = sequelize.define('combined_tours_reviews',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.STRING, allowNull: false },
    rate:{type:DataTypes.INTEGER,allowNull:false},
    status:{type: DataTypes.BOOLEAN, defaultValue:false},
})

const CombineTourBasket = sequelize.define('combined_tours_basket',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hotelName: { type: DataTypes.STRING, unique: false, defaultValue:'' },
    tourNames: { type:DataTypes.ARRAY(DataTypes.STRING), unique: false, defaultValue:[] },
    date_in: {type: DataTypes.DATE, allowNull:false},
    date_out: {type: DataTypes.DATE, allowNull:false},
    date: { type: DataTypes.ARRAY(DataTypes.DATE), allowNull: false },
    count: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
    rooms: {type:DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.INTEGER)),allowNull:false},
    status:{type: DataTypes.BOOLEAN, defaultValue:false},
    price: {type: DataTypes.INTEGER, allowNull:false},
    fullName:{type: DataTypes.ARRAY(DataTypes.STRING),allowNull:true},
    phoneNumber:{type:DataTypes.STRING,allowNull:true},
    pasportNumber:{type:DataTypes.STRING,allowNull:true},
    taxi:{type:DataTypes.ARRAY(DataTypes.STRING), defaultValue:null},
    guide:{type: DataTypes.ARRAY(DataTypes.STRING), defaultValue:null},
    helper:{type:DataTypes.ARRAY(DataTypes.STRING),defaultValue:null},
})


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

User.hasMany(CombineTourBasket)
CombineTourBasket.belongsTo(User)


CombinedTours.hasMany(CombineTourBasket)
CombineTourBasket.belongsTo(CombinedTours)

//Отзывы к местам
User.hasMany(Reviews);
Reviews.belongsTo(User);

TourInfo.hasMany(Reviews);
Reviews.belongsTo(TourInfo);

//Отзывы к отелям
User.hasMany(HotelReviews);
HotelReviews.belongsTo(User);

HotelInfo.hasMany(HotelReviews);
HotelReviews.belongsTo(HotelInfo);

// Связи "многие ко многим" между Tour и CombinedTour
Tour.belongsToMany(CombinedTours, { through: 'TourCombinedTours' });
CombinedTours.belongsToMany(Tour, { through: 'TourCombinedTours' });

Hotel.hasMany(CombinedTours)
CombinedTours.belongsTo(Hotel)

//Отзывы к комбо турам
User.hasMany(CombinedTourReviews);
CombinedTourReviews.belongsTo(User);

CombinedTours.hasMany(CombinedTourReviews);
CombinedTourReviews.belongsTo(CombinedTours);

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
    Reviews,
    HotelReviews,
    UserBasketsHotels,
    UserBasketTour,
    CombinedTours,
    TourCombinedTours,
    CombinedTourReviews,
    CombineTourBasket
};
