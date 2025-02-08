const express = require('express')
const router = express.Router()

const controller = require("../../controllers/admin/setting.controller.js")

//Trang chính
router.get('/general', controller.general) 

module.exports = router

