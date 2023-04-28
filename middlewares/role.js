const UnauthorizedError = require('../Errors/UnauthorizedError');
const auth = require('../helpers/auth');

module.exports = function(roles){
    return function(req, res, next){
        if(auth.user && auth.user.hasAnyRole(roles)){
            next();
        }else{
            throw new UnauthorizedError('You are not authorized to access this resource');
        }
    }
}