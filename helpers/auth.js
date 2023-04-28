const JWT = require('jsonwebtoken')
const User = require('../Models/User')

const config = {
    cookie_name : 'user_cookie',
    cookie_max_age : 3 * 24 * 60 * 60, // 3 days  
    
    jwt_secret_key :  "jwt-secret-private-key",
}

const auth = {

    user : null,

    /**
     * 
     * verify if user is logged in
     */
    check : async function(req, res){

        if(res.locals.user){
            return true
        }

        // inital state of request and response user
        res.locals.auth = auth
        res.locals.user = null

        // get token from cookies
        let token = req.cookies[config.cookie_name]

        if(!token){
            return false;
        }

        let decodedToken = null;
        try{
            decodedToken = JWT.verify(token, config.jwt_secret_key)
            let user = await User.findById(decodedToken.user_id)
            if(user){

                this.user = user                
                // add user to request object

                // add user to global response variables
                res.locals.user = user.toObject({virtuals: true})
                return true;
            }
        }catch(err){
            // if token is invalid            
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
    }



}

module.exports = auth;