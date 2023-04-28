const { checkSchema, validationResult, matchedData } = require('express-validator');
const UnprocessableEntityError = require('../../Errors/UnprocessableEntityError');
const InternalServerError = require('../../Errors/InternalServerError');
const User = require('../../Models/User')
const {Roles} = require('../../Models/User')
const { unique } = require('../../customValidators/validators')


const UsersController = {

    /**
     * Show Home Screen 
     */
    index : async (req, res) => {
        let page = 1;
        if(req.query.page && req.query.page > 1){
            page = req.query.page
        }
        page--;
        let perPage = 10
        let users = await User.find({})
                            .skip(page * perPage)
                            .limit(perPage)
                            .sort({createdAt: -1})
                            .exec()

        users= users.map(o => o.toObject({virtuals: true}));
    
        res.render('admin/users', { title: 'Posts', users: users })
    },

    /**
     * 
     * create method
    */
    create(req, res) {
        let roles = Array.from(Object.values(Roles));
        res.render('admin/users/create', { 
            title: 'Create User',
            roles: roles,
        })
    },
    


    /**
     * store method
     */
    store : async (req, res, next) => {
        await checkSchema({
            first_name: {
                in: ['body'],
                isLength: {
                    errorMessage: 'First Name must be at least 3 chars long',
                    options: { min: 3 }
                },
                escape: true
            },
            last_name: {
                in: ['body'],
                isLength: {
                    errorMessage: 'Last Name must be at least 3 chars long',
                    options: { min: 3 }
                },
                escape: true
            },
            email: {
                isEmail: true,
                errorMessage: 'Invalid email',
                custom: {
                    options: unique(User, 'email'),
                    errorMessage: 'Email already exists'
                }
            },
            password: {
                isLength: {
                    errorMessage: 'Password must be at least 6 chars long',
                    options: { min: 6 }
                },
            },
            confirm_password: {
                equals: {
                    options: req.body.password,
                    errorMessage: 'Passwords do not match'
                }
            },
            roles:{
                errorMessage: 'Invalid role',
                isIn:{
                    options: Roles
                }
            }
        }).run(req);


        let result = validationResult(req)
        if(!result.isEmpty()){
            return next(new UnprocessableEntityError('', result.array()));
        }

        let validatedData = matchedData(req)
        let user = new User(validatedData)
        user.save();

        res.redirect('/dashboard/users')
    },



    /**
     * 
     * edit
     */
    edit : async (req, res, next) => {
        let user_id = req.params.user

        const user = await User.findById(user_id)

        res.render('/admin/users/edit', {
            title: 'Edit User',
            user: user
        })
    },


    /**
     * 
     * update
     */
    update : async (req, res, next) => {

    },

    /**
     * 
     * delete
     */
    delete : async (req, res, next) => {
        let user_id = req.params.user
        User.findByIdAndDelete(user_id, (err, user) => {
            if(err){
                return next(new InternalServerError());
            }
            res.redirect('back')
        })

    }



}



module.exports = UsersController;
