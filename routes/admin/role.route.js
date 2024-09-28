const express = require('express')
const router = express.Router()

const controller = require("../../controllers/admin/role.controller.js")

//Trang chính
router.get('/', controller.index) 

//Tạo nhóm quyền
router.get('/create', controller.create) 
router.post('/create', controller.createPost) 

//Chi tiết, sửa, xóa
router.get('/detail/:id', controller.detail) 
router.get('/edit/:id', controller.edit) 

module.exports = router

