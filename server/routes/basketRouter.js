const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController') 
const authMiddleware = require('../middleware/authMiddleware')

router.get('/hHistory',authMiddleware, basketController.fetchPayedHotels)
router.delete('/dropHotel/:basket_id', basketController.removeHotelFromBasket);
router.delete('/dropHotels', basketController.removeAllHotels);

module.exports = router