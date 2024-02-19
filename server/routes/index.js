const Router = require('express')
const router = new Router()

const tourRouter = require('./tourRouter')
const userRouter = require('./userRouter')
const hotelRouter = require('./hotelRouter')



router.use('/user',userRouter)
router.use('/tour',tourRouter)
router.use('/hotel',hotelRouter)


module.exports = router