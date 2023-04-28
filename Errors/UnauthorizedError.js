class UnauthorizedError extends Error {
    constructor(message = 'Unauthenticated') {
        super(message)
        this.message = message
        this.statusCode = 403
    }


}


module.exports = UnauthorizedError