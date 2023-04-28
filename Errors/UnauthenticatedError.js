class UnauthenticatedError extends Error {
    constructor(message) {
        
        message = message || 'Unauthenticated'
        super(message)
        this.message = message
        
        this.statusCode = 401
    }

    handle(req, res, next){
        res.redirect('/login')
    }

}


module.exports = UnauthenticatedError