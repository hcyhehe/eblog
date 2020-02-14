const express = require('express')
const router = express.Router()
const upload = require('../commons/upload')
const check = require('../middlewares/check')
const admin = require('../controllers/bg/admin')
const category = require('../controllers/bg/category')
const tag = require('../controllers/bg/tag')
const anounce = require('../controllers/bg/anounce')


router.post('/upload', check.verifyClient, upload.upload)

router.post('/login', check.verifyClient, admin.login)

router.get('/category/list', check.verifyClient, category.list)
router.post('/category/add', check.verifyClient, category.add)
router.post('/category/edit', check.verifyClient, category.edit)
router.post('/category/del', check.verifyClient, category.del)

router.get('/tag/list', check.verifyClient, tag.list)
router.post('/tag/add', check.verifyClient, tag.add)
router.post('/tag/edit', check.verifyClient, tag.edit)
router.post('/tag/del', check.verifyClient, tag.del)

router.get('/anounce/info', check.verifyClient, anounce.info)
router.post('/anounce/edit', check.verifyClient, anounce.edit)


module.exports = router
