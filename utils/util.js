var api = require('../config/api.js');
var app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封装request请求
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        // 'Content-Type': 'application/json',
        'Content-Type':'application/x-www-form-urlencoded',
        'openid': wx.getStorageSync('openid'),
        "token": wx.getStorageSync('token')
      },
      success: function (res) {

        if (res.statusCode == 200) {

          if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('openid');
              wx.removeStorageSync('unionid');
              wx.removeStorageSync('session_key');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.navigateTo({
              url: '/pages/auth/login/login'
            });
          } else if(res.data.errno == 402){
              wx.showModal({
                title: '提示',
                content: res.data.errmsg,
                showCancel: false
              });
          } else if(res.data.errcode== -9){
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('openid');
              wx.removeStorageSync('unionid');
              wx.removeStorageSync('token');
              wx.removeStorageSync('session_key');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.showModal({
              title: '提示',
              content: res.data.errmsg,
              showCancel: false,
              success: (result) => {
                if(result.confirm){
                  wx.navigateTo({
                    url: '/pages/auth/authorize/authorize'
                  });
                }
              }
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

module.exports = {
  formatTime: formatTime,
  request: request
}
