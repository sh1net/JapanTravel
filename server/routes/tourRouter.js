const Router = require('express')
const router = new Router()
const tourController = require('../controllers/tourController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',checkRole('ADMIN'),tourController.create)
router.get('/',tourController.getAll)
router.get('/:id',checkRole('USER'),tourController.getOne)


module.exports = router