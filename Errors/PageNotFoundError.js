class PageNotFoundError extends Error {

    constructor(message = 'Page Not Found') {
        super(message)
        this.message = message
        
        this.statusCode = 404
    }

    handle(req, res){
        return res.status(this.statusCode).render('error/404', {
            title : 'Page Not Found'
        })
    }
    

}


module.exports = PageNotFoundError