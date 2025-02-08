
//1. [GET] admin/settings/general
module.exports.general = async (req, res)=>{
    res.render("admin/pages/settings/general.pug", {
        pageTitle: "Cài đặt chung",
    })
}

//[POST] admin/settings/general
module.exports.generalPatch = async(req, res)=>{
    res.send("oke")
}