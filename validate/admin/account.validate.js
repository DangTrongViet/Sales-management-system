module.exports.createPost = (req, res, next)=>{
    if(!req.body.title){
        req.flash('error', 'Vui lòng nhập sản phẩm!');
        res.redirect("back")
        return;
    }
    if(req.body.title.length < 8){
        req.flash('error', 'Vui lòng nhập ít nhất 8 lý tự!');
        res.redirect("back")
        return;
    }
    next(); //Midleware Để nhảy đến bước kế tiếp là: controller.createPost
}