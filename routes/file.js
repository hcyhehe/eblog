const express = require('express')
const router = express.Router()
const upload = require('../commons/upload')

//file
router.get('/upload/*', upload.public)  //公共访问文件路径


module.exports = router
