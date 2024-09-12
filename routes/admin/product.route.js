const express = require('express')
const router = express.Router()

const controller = require("../../controllers/admin/product.controller.js")

router.get('/', controller.index) //gửi chuỗi này về file index.route.js và nó sẽ lấy: chuỗi bên đó + chuỗi bên này gửi qua

router.patch('/change-status/:status/:id', controller.changeStatus)//Node ký hiệu ":" để truyền data động, tức ta nhập gì trên url nso sẽ lấy cái status và gán vào status này. id cũng vậy
                                                                   // Sử dụng URL với dynamic parameters, Với cách này, dữ liệu như status và id sẽ được truyền qua URL
                                                                   // ta nhận giá trị như status và id từ: req.params
router.patch('/change-multi', controller.changeMulti) //Gửi dữ liệu status và id qua body của request, không phải qua URL. Điều này thường được dùng khi dữ liệu cần truyền phức tạp hoặc có nhiều giá trị
                                                      //ta nhận giá trị như status và id từ: req.body

router.delete('/delete/:id', controller.deleteItem)    

//Thùng rác
router.get("/trash", controller.trash)

router.patch('/trash/:require/:id', controller.requireTrash);

module.exports = router