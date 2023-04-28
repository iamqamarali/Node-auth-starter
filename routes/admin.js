const { Router } = require('express')
const DashboardController = require('../controllers/Admin/DashboardController.js')
const PostsController = require('../controllers/Admin/PostsController.js')
const UsersController = require('../controllers/Admin/UsersController.js')
const auth = require('../middlewares/auth.js')
const role = require('../middlewares/role.js')
const {Roles} = require('../Models/User.js')
const Multer = require('multer')


const router = Router()
const multer = Multer({})


// set admin as layout for all admin routes
router.use((req, res, next)=>{
    res.locals.layout = 'admin',
    next();
})


router.get('/', auth, role([Roles.admin]), DashboardController.dashboard)

// users
router.get('/users', auth, role([Roles.admin]), UsersController.index)
router.get('/users/create', auth , role([Roles.admin]), UsersController.create)
router.post('/users', auth , role([Roles.admin]), multer.single('avatar') , UsersController.store)
router.get('/users/edit/:user', auth , role([Roles.admin]), UsersController.edit)
router.post('/users/edit/:user', auth , role([Roles.admin]), UsersController.update)
router.post('/users/delete/:user', auth , role([Roles.admin]), UsersController.delete)


// posts
router.get('/posts', auth, role([Roles.admin]), PostsController.index)
router.post('/posts', auth, role([Roles.admin]), multer.single('image'), PostsController.store)
router.get('/posts/create', auth, role([Roles.admin]), PostsController.create)



module.exports = router