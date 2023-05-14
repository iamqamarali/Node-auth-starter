const InternalServerError = require('../../Errors/InternalServerError')
const mongoose = require('mongoose')

module.exports = (req, res, next) => {
    if(mongoose.connection.readyState == 1){
        next()
    }else{
        next(new InternalServerError("Database connection failed"))
    }
}