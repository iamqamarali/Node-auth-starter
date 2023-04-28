class UnprocessableEntityError extends Error {

    constructor(message, errors) {
        message = message || 'Unprocessable Entity'
        super(message)
        this.message = message;

        this.statusCode = 422
        this.errors = errors || []
    }

    handle(req, res, next){
        // if request accept html
        if(req.accepts('html')){
            req.flash('old', req.body)
            req.flash('errors', this.errors)
            res.redirect('back')
            
            return
        }

        // if doesn't accept html send json errors
        res.status(this.statusCode).json({ 
            errors: this.errors
        })
    }

}


module.exports = UnprocessableEntityError