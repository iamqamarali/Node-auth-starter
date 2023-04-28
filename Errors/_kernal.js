const BadRequestError = require('./BadRequestError')
const UnauthenticatedError = require('./UnauthenticatedError')
const UnauthorizedError = require('./UnauthorizedError')
const InternalServerError = require('./InternalServerError')
const UnprocessableEntityError = require('./UnprocessableEntityError')
const PageNotFoundError = require('./PageNotFoundError')

const errors = [
    BadRequestError,
    UnauthenticatedError,
    UnauthorizedError,
    InternalServerError,
    UnprocessableEntityError,
    PageNotFoundError
]


module.exports = (err, req, res, next)=>{
    for(let error of errors){
        if(err instanceof error){
            if(err.handle){
                err.handle(req, res, next)
                return 
            }else{
                res.status(err.statusCode)
                res.render('error/default', {
                    layout: false,

                    message: err.message
                }, )
                return 
            }
        }
    }

    next(err);
}