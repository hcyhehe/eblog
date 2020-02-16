const express = require('express')
const router = express.Router()
const check = require('../middlewares/check')
const front = require('../controllers/front/front')


router.get('/', front.home)
router.get('/article', front.article)
router.get('/*.html', front.baiduCheck)


module.exports = router
