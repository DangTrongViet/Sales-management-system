const productRoutes = require("./product.route.js")
const homeRoutes = require("./home.route.js")
const categoryMiddleware = require("../../middlewares/client/category.middleware.js")
const searchRoutes = require("./search.route.js")
const cartMiddleware = require("../../middlewares/client/cart.middleware.js")
const cartRoute = require("./cart.route.js")
const checkoutRoute = require("./checkout.route.js")
const userRoute = require("./user.route.js")

//Tách riêng các thằng routes này ra để dễ quản lý
module.exports = (app)=>{ //Lệnh này là exports trong express
    app.use(categoryMiddleware.category)

    app.use(cartMiddleware.cartId)

    app.use('/', homeRoutes)

    app.use("/cart", cartRoute)

    app.use("/checkout", checkoutRoute)
    
    app.use("/products", productRoutes)
    
    app.use("/search", searchRoutes)

    app.use("/user", userRoute)
}