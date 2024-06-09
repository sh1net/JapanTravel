

const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const combinedTourController = require('../controllers/combinedTourController')

router.post('/',combinedTourController.create)
router.get('/basket',combinedTourController.ComboInBasket)
router.get('/',combinedTourController.getAll)
router.get('/:id',combinedTourController.getOne)
router.post('/createReview',combinedTourController.createReview)
router.get('/reviews/:comboTourId', combinedTourController.getReviews)
router.post('/isDataCorrect',combinedTourController.checkFree)
router.post('/combBasket',combinedTourController.addToCart)
router.patch('/payCombo', combinedTourController.payCombo)
router.patch('/reviewUpdate',combinedTourController.updateReview)
router.patch('/acceptReview',combinedTourController.updateAcceptReview)
router.delete('/reviewCancel/:reviewId',combinedTourController.delReview)
router.delete('/:comboTourId',combinedTourController.delete)

module.exports = router