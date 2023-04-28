module.exports = (req, res, next) => {
    res.locals.old = req.flash('old')[0] || {}
    res.locals.errors = req.flash('errors') || []
    next()
}