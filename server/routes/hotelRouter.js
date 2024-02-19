const Router = require('express')
const router = new Router()
const hotelController = require('../controllers/hotelController')

router.post('/',hotelController.create)
router.get('/',hotelController.getAll)


module.exports = router