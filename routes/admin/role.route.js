const express = require('express')
const router = express.Router()

const controller = require("../../controllers/admin/role.controller.js")

//Trang chính
router.get('/', controller.index) 

//Tạo nhóm quyền
router.get('/create', controller.create) 
router.post('/create', controller.createPost) 

module.exports = router

