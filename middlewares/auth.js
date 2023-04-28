const UnauthenticatedError = require('../Errors/UnauthenticatedError')
const auth = require('../helpers/auth')

module.exports = async function(req, res, next){
    let bool = await auth.check(req, res)
    if(bool){
        next();
    }else{
        next(new UnauthenticatedError('You must be logged in to access this page'))
    }
}