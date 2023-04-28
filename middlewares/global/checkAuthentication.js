const auth = require('../../helpers/auth')

module.exports = async (req, res, next)=>{
    let bool = await auth.check(req, res)
    next();
}