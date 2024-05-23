const Router = require('express')
const router = new Router()
const tourController = require('../controllers/tourController')

router.post('/',tourController.create)
router.get('/basket', tourController.toursInBasket)
router.get('/',tourController.getAll)
router.get('/:id',tourController.getOne)
router.patch('/',tourController.update)
router.patch('/payTour',tourController.payTour )
router.post('/addToCart',tourController.addTourToCart)
router.patch('/reviews',tourController.updateReviews)
router.delete('/dropTour/:tour_id',tourController.delete)
router.post('/isDataCorrect',tourController.isDataCorrect)



module.exports = router