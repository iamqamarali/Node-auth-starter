const JWT = require('jsonwebtoken')
const User = require('../Models/User')

const config = {
    cookie_name : 'user_cookie',
    cookie_max_age : 3 * 24 * 60 * 60, // 3 days  
    
    jwt_secret_key :  process.env.JWT_SECRET_KEY,
}

const auth = {

    user : null,


    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    verifyToken : function(token){

        return JWT.verify(token, config.jwt_secret_key)
    },

    /**
     * 
     */
    getUser : async function(decodedToken){
        this.user = await User.findById(decodedToken.user_id)
        return this.user
    },


    /**
     * verify if user is logged in
     * @param {*} req 
     * @param {*} res 
     * @returns Boolean
     */
    check : async function(req, res){

        if(res.locals.user){
            return true
        }

        // inital state of request and response user
        res.locals.auth = auth
        res.locals.user = null
        req.user = null

        // get token from cookies
        let token = req.cookies[config.cookie_name]

        if(!token){
            return false;
        }

        let decodedToken = null;
        try{
            decodedToken = this.verifyToken(token)
            let user = await this.getUser(decodedToken)
            if(user){

                // add user to global response variables
                res.locals.user = user.toObject({virtuals: true})
                req.user = user
                return true;
            }
        }catch(err){
            // if token is invalid just return false
        }

        return false;
    },


    /**
     * 
     * login user
     */
    login : async function(user, res){
        let payload = {user_id: user._id}
        let token = JWT.sign(payload, config.jwt_secret_key , { 
            expiresIn :  config.cookie_max_age
        })

        // set cookie
        res.cookie(config.cookie_name, token, { maxAge: 3 * 24 * 60 * 60 * 1000 } )
    },



    /**
     * @param {*} res 
     */
    logout : function(res){
        res.cookie(config.cookie_name, '', {maxAge: 1})
    }

}

module.exports = auth;