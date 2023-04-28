
const { Router } = require('express')
const pagesRouter  = require('./pages')
const authRouter = require('./auth')
const adminRouter = require('./admin')
const checkAuthentication = require('../middlewares/global/checkAuthentication')
const FlashParamsAndErrors = require('../middlewares/global/flashParamsAndErrors')
const PageNotFoundError = require('../Errors/PageNotFoundError')

const router = Router()

// global middlewares
router.use(checkAuthentication)
router.use(FlashParamsAndErrors)


// all routes
router.use('/dashboard' , adminRouter)

router.use(pagesRouter)
router.use(authRouter)



router.get('*', (req, res) => {
    throw new PageNotFoundError()
})

module.exports = router
