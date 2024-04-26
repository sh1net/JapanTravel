const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController') 
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware,userController.check)
router.post('/checkPassword', authMiddleware, userController.CheckPassword)
router.get('/profile', authMiddleware,userController.getUserInfo )
router.delete('/delete:id',userController.delete )
router.patch('/update', userController.UpdateUser)

module.exports = router