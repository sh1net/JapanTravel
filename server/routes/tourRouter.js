const Router = require('express')
const router = new Router()
const tourController = require('../controllers/tourController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',tourController.create)
router.get('/',tourController.getAll)
router.get('/:id',tourController.getOne)
router.patch('/',tourController.update)
router.post('/addToCart',tourController.addTourToCart)
router.post('/isCorrect',tourController.checkData)


module.exports = router