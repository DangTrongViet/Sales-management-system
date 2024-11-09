const productRoutes = require("./product.route.js")
const homeRoutes = require("./home.route.js")
const categoryMiddleware = require("../../middlewares/client/category.middleware.js")

//Tách riêng các thằng routes này ra để dễ quản lý
module.exports = (app)=>{ //Lệnh này là exports trong express
    app.use(categoryMiddleware.category)
    app.use('/', homeRoutes)//Thay chữ get -> use, nói chung get cũng vẫn chạy được thôi nhưng k cần thiết
    app.use("/products", productRoutes)
}