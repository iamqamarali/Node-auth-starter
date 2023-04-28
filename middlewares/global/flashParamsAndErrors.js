module.exports = (req, res, next) => {
    res.locals = Object.assign(res.locals, {
        old: req.flash('old')[0],
        errors: req.flash('errors')[0],
    })
    next()
}