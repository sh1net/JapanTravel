const Router = require('express')
const router = new Router()
const hotelController = require('../controllers/hotelController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',hotelController.create)
router.get('/basket', hotelController.getAllHotelBaskets);
router.get('/',hotelController.getAll)
router.get('/:id',hotelController.getOne)
router.post('/addToBasket',authMiddleware, hotelController.addToCart)
router.patch('/payBasketElem', authMiddleware, hotelController.payCartElem)
router.post('/isDataCorrect', hotelController.isDataCorrect)
router.post('/review',hotelController.createReview)
router.get('/reviews/:hotelId',hotelController.getHotelReviews)
router.patch('/reviewUpdate',hotelController.updateReview)
router.delete('/dropHotel/:hotel_id',hotelController.delete)
router.patch('/reviewAccept',hotelController.updateAcceptReview)
router.delete('/reviewCancel/:reviewId', hotelController.delReview)
router.patch('/updateHotel',hotelController.update)


module.exports = router