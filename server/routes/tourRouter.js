const Router = require('express')
const router = new Router()
const tourController = require('../controllers/tourController')

router.post('/',tourController.create)
router.get('/basket', tourController.toursInBasket)
router.get('/acceptReviews', tourController.getNotAcceptReviews)
router.get('/',tourController.getAll)
router.get('/:id',tourController.getOne)
router.patch('/updateTour',tourController.update)
router.patch('/payTour',tourController.payTour )
router.post('/addToCart',tourController.addTourToCart)
router.delete('/dropTour/:tour_id',tourController.delete)
router.post('/isDataCorrect',tourController.isDataCorrect)
router.patch('/updateReview',tourController.updateAcceptReview)
router.delete('/dropReview/:reviewId',tourController.delReview)

module.exports = router