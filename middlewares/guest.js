const auth = require('../helpers/auth')

module.exports = async function(req, res, next){
    let loggedIn = await auth.check(req, res)
    if(!loggedIn){
        next();
    }else{
        res.redirect('/')
    }
}