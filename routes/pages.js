
const { Router } = require('express')
const PagesController = require('../controllers/PagesController')
const authMiddleware = require('../middlewares/auth')

const router = Router()

router.get('/', PagesController.home)
router.get('/posts', PagesController.allPosts)
router.get('/posts/:post', PagesController.singlePost)

// comments
router.post('/posts/:post/comments',  PagesController.createComment)


module.exports = router