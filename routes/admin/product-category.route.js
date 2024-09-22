const express = require('express')
const router = express.Router()

const multer  = require('multer'); //Thư viện để upload ảnh
const upload = multer() 

const controller = require("../../controllers/admin/product-category.controller")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")
const validate = require("../../validate/admin/product-category.validate.js")

//Tranh chủ
router.get('/', controller.index)

//Tạo danh mục
router.get('/create', controller.create)
router.post('/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost)
    
module.exports = router