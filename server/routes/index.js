const Router = require('express')
const router = new Router()

const tourRouter = require('./tourRouter')
const userRouter = require('./userRouter')
const hotelRouter = require('./hotelRouter')
const basketRouter = require('./basketRouter')
const combinedTourRouter = require('./combinedTourRouter')



router.use('/user',userRouter)
router.use('/tour',tourRouter)
router.use('/hotel',hotelRouter)
router.use('/basket',basketRouter)
router.use('/combtour',combinedTourRouter)


module.exports = router