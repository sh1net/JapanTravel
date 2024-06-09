const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController') 
const authMiddleware = require('../middleware/authMiddleware')

router.get('/hHistory',authMiddleware, basketController.fetchPayedHotels)
router.get('/tHistory',authMiddleware, basketController.fetchPayedTours)
router.get('/cHistory', basketController.fetchPayedCombo)
router.delete('/dropHotel/:basket_id', basketController.removeHotelFromBasket);
router.delete('/dropTour/:basket_id',basketController.removeTourFromBasket);
router.delete('/dropCombo/:basket_id',basketController.removeComboFromBasket)
router.delete('/dropHotels', basketController.removeAllHotels);
router.delete('/dropTours', basketController.removeAllTours);
router.delete('/dropCombos',basketController.removeAllCombs)


module.exports = router