const Router = require('express')
const router = new Router()
const hotelController = require('../controllers/hotelController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',hotelController.create)
router.get('/basket', hotelController.getAllHotelBaskets);
router.get('/',hotelController.getAll)
router.get('/:id',hotelController.getOne)
router.post('/addToBasket',authMiddleware, hotelController.addToCart)
router.patch('/payBasketElem', authMiddleware, hotelController.payCartElem)
router.post('/isDataCorrect', hotelController.isDataCorrect)


module.exports = router