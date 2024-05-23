const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const combinedTourController = require('../controllers/combinedTourController')

router.post('/',combinedTourController.create)
router.get('/',combinedTourController.getAll)
router.get('/:id',combinedTourController.getOne)

module.exports = router