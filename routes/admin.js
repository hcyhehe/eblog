const express = require('express')
const router = express.Router()
const upload = require('../commons/upload')
const check = require('../middlewares/check')
const admin = require('../controllers/bg/admin')
const category = require('../controllers/bg/category')
const anounce = require('../controllers/bg/anounce')
const art = require('../controllers/bg/article')


router.post('/upload', upload.upload)

router.post('/login', check.verifyClient, admin.login)

router.get('/category/list', check.verifyClient, category.list)
router.post('/category/add', check.verifyClient, category.add)
router.post('/category/edit', check.verifyClient, category.edit)
router.post('/category/del', check.verifyClient, category.del)

router.get('/anounce/info', check.verifyClient, anounce.info)
router.post('/anounce/edit', check.verifyClient, anounce.edit)

router.get('/art/list', check.verifyClient, art.list)
router.post('/art/add', check.verifyClient, art.add)
router.get('/art/info', check.verifyClient, art.info)
router.post('/art/edit', check.verifyClient, art.edit)
router.post('/art/del', check.verifyClient, art.del)


module.exports = router
