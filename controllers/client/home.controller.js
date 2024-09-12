
module.exports.index =  (req, res)=>{ //Cái này là cú pháp đặt tên hàm trong Nodejs, cụ thẻ ở đây ta đặt tên hàm là "index"
    res.render("client/pages/home/index.pug", {
        pageTitle: "Tranh chủ"
    })
};
