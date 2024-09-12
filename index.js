const express = require('express');
const app = express();

// Tải biến môi trường
require('dotenv').config();

// Nhập và cấu hình cơ sở dữ liệu
const database = require("./config/database.js");
database.connect(); // Kết nối với cơ sở dữ liệu

// Nhập cấu hình
const systemConfig = require("./config/system.js");

// Nhập các route
const routeAdmin = require("./routes/admin/index.route.js");
const route = require("./routes/client/index.route.js");

// Import body-parser middleware để phân tích body của request
var bodyParser = require('body-parser');

/***********  Cấu hình middleware  **************/ 
// Ghi đè phương thức để hỗ trợ PUT, DELETE, PATCH trong form
const methodOverride = require('method-override');
app.use(methodOverride('_method'));//Muốn sử dụng thư viện này phải gọi cái này đầu tiên ngay sau khi app được khởi tạo chứ k được đặt sau các tiến trình phía dưới dòng này


// Cấu hình Pug làm engine template
app.set('views', './views');
app.set('view engine', 'pug');

// Static files: thiết lập folder public là file tĩnh để công khai ra bên ngoài
app.use(express.static('public'));

// Middleware để xử lý dữ liệu URL-encoded từ các form HTML
// extended: false nghĩa là chỉ cho phép xử lý dữ liệu dạng chuỗi hoặc mảng đơn giản
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware để xử lý dữ liệu JSON được gửi trong body của request
// Dữ liệu JSON thường được sử dụng khi gửi dữ liệu từ API hoặc AJAX
app.use(bodyParser.json());

//App local variable (Khai báo biến prefixAdmin toàn cục để dùng trong mọi file pug được luôn)
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Định nghĩa các route
routeAdmin(app);
route(app);

// Khởi động server, ta đang lưu PORT trong file .env
const port = process.env.PORT || 3000; // Mặc định là cổng 3000 nếu không được chỉ định trong môi trường


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})