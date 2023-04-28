class ServerError extends Error {

    constructor(message = 'Internal Server error') {
        super(message)
        this.message = message
        
        this.statusCode = 500
    }
    

}


module.exports = ServerError