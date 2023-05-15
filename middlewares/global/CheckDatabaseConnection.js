const InternalServerError = require('../../Errors/InternalServerError')
const mongoose = require('mongoose')

module.exports = (req, res, next) => {
    if(mongoose.connection.readyState >= 1){
        next()
    }else{
        setTimeout(() => {
            if(mongoose.connection.readyState >= 1){
                next()
            }else{
                next(new InternalServerError("Booting up please try again in 10 seconds"))
            }
        }, 8000)
    }
}
