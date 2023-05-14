const { validationResult, matchedData } = require('express-validator');
const User = require('../Models/User');
const { checkSchema } = require('express-validator')
const { exists } = require('../customValidators/validators')
const UnprocessableEntityError = require('../Errors/UnprocessableEntityError')
const auth = require('../helpers/auth')
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt');

const AuthController = {

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    loginForm: (req, res) => {
        res.render('auth/login', { title: 'Login page' })
    },


    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    login: async (req, res, next) => {
        // validate data
        await checkSchema({
            email : {
                errorMessage: 'Please enter a valid email address',
                isEmail: { bail: true },
                custom: { options: exists(User, 'email') }
            },
            password: {
                isLength: {
                    options: { min: 6 }
                },
                errorMessage : "Password must be at least 6 characters long"
            }
        }).run(req)


        let result = validationResult(req)
        if(!result.isEmpty()){
            return next(new UnprocessableEntityError('', result.array()));
        }

        let { email, password } = matchedData(req)
        let user = await User.findOne({email: email})

        // if password doesnt match send error

        bcrypt.compare(password, user.password, function(err, result) {
            if(err){
                return next(new UnprocessableEntityError(null, err));
            }
            if(!result){
                let errors = [{ 
                    field :  password ,
                    msg:"Password doesn't match"
                }]
                return next(new UnprocessableEntityError('', errors));    
            }
            // create JTW for user 
            auth.login(user, res)

            // send response
            res.redirect('/dashboard')
        });
        
    },


    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    signUpForm(req, res){
        res.render('auth/signup', { title: 'Sign up page' })
    },


    /**
     * 
     * @param {*} req 
     * @param {*} res  
     */
    signup: (req, res, next) => {
        let result = validationResult(req)

        if(!result.isEmpty()){
            throw new UnprocessableEntityError('', result.array());
        }

        let user = new User({
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10),
            avatar : faker.image.avatar(),
            roles: ['admin', 'user']
        })
        user.save().then((user) => {
            res.redirect('/login/posts')
        })

    },


    /**
     * 
     * logout employee
     */
    logout(req, res){
        auth.logout(res)
        res.redirect('/login')    
    }

}


module.exports = AuthController