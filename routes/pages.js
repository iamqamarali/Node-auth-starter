
const { Router } = require('express')
const PagesController = require('../controllers/PagesController')

const router = Router()

router.get('/', PagesController.home)
router.get('/posts', PagesController.allPosts)
router.get('/posts/:post', PagesController.singlePost)



module.exports = router