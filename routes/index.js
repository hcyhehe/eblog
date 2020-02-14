const express = require('express')
const router = express.Router()
const check = require('../middlewares/check')
const front = require('../controllers/front')
const admin = require('../controllers/admin')


router.get('/', front.home)
router.get('/article', front.article)


module.exports = router
