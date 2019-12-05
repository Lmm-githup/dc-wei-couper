const api = require('../config/api.js');
function uploadImg(){
  return new Promise(function(resole,reject){
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        const imgpath = result.tempFilePaths[0];
        wx.uploadFile({
          url: api.uploadImg,
          filePath: imgpath,
          header: {
            // 'Content-Type':'application/x-www-form-urlencoded',
            // 'Content-Type': 'application/json',
            'openid': wx.getStorageSync('openid'),
            "token": wx.getStorageSync('token')
          },
          name: 'image',
          success: (res)=>{
            resole(JSON.parse(res.data));
          }
        });
      },
      fail: (result)=>{
        console.log(result);
        reject(result);
      }
    });
  })
}
module.exports = {
  uploadImg
}