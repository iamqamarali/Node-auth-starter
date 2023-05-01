
const { Router } = require('express')
const { check } = require('express-validator')
const router = Router()
const AuthController = require('../controllers/AuthController')

const {unique} = require('../customValidators/validators')
const User = require('../Models/User')
const GuestMiddleware = require('../middlewares/guest')

router.get('/logout', AuthController.logout);


router.get('/login',GuestMiddleware, AuthController.loginForm)
router.post('/login',GuestMiddleware, AuthController.login)

router.get('/signup', GuestMiddleware, AuthController.signUpForm)
router.post(
    '/signup', 
    GuestMiddleware,
    
    check('first_name', 'First name is required').notEmpty().escape(),
    check('last_name').isLength({min:3})
                        .withMessage("minimum length of last name should be 3")
                        .escape(),
    check('email', 'Please provide a valid email address')
                .isEmail()
                .bail() 
                .custom(unique(User, 'email')),
    check('password', 'Password should be at least 6 characters long').isLength({ min: 6 }),
    check('confirm_password', 'Password and confirm password should match')
        .custom((value, {req})=>{
            if(value !== req.body.password){
                throw new Error('Password and confirm password should match')
            }
            return true
        }),

    AuthController.signup
)

module.exports = router
