const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

// Tài khoản mà sẽ upload ảnh lên
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});

//Xử lý đẩy ảnh lên cloud
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadToClouddinary = async(buffer) => {
  let result = await streamUpload(buffer);
  return result.url
}

module.exports.upload = async(req, res, next)=>{
    if(req.file){
      const result = await uploadToClouddinary(req.file.buffer);
      //console.log("result", result)
      req.body[req.file.fieldname] = result
    } 
    next();
}