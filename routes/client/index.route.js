const productRoutes = require("./product.route.js")
const homeRoutes = require("./home.route.js")
const categoryMiddleware = require("../../middlewares/client/category.middleware.js")
const searchRoutes = require("./search.route.js")
const cartMiddleware = require("../../middlewares/client/cart.middleware.js")
const cartRoute = require("./cart.route.js")
const checkoutRoute = require("./checkout.route.js")
const userRoute = require("./user.route.js")
const userMiddleware = require("../../middlewares/client/user.middleware.js")
const settingMiddleware = require("../../middlewares/client/setting.middleware.js")
const chatRoute = require("./chat.route.js")


//Tách riêng các thằng routes này ra để dễ quản lý
module.exports = (app)=>{ //Lệnh này là exports trong express
    app.use(categoryMiddleware.category)

    app.use(cartMiddleware.cartId)

    app.use(userMiddleware.infoUser)

    app.use(settingMiddleware.settingGeneral)

    app.use('/', homeRoutes)

    app.use("/cart", cartRoute)

    app.use("/checkout", checkoutRoute)
    
    app.use("/products", productRoutes)
    
    app.use("/search", searchRoutes)

    app.use("/user", userRoute)

    app.use("/chat", chatRoute)
}