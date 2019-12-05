/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);//说明session_key未过期
      },
      fail: function () {
        reject(false);//说明session_key已过期需要wx.login重新登录
        console.log("----我是checkSession但是我过期了但是我重新登录了-----")
        wx.login({
          success: function (res) {
            if (res.code) {
              resolve(true);
            } else {
              reject(false);
            }
          },
          fail: function (err) {
            reject(false);
          }
        });
      }
    })
  });
}

/**
 * 版本字符串比较
 */
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({  
      success: function (res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {

  return new Promise(function (resolve, reject) {
    return login().then((res) => {
      //登录远程服务器,获取openID和unionid
      util.request(api.getOpenId, { code: res.code }, 'GET').then(res => {
        if (res.errcode === 1) {
          //存储用户信息
          console.log('wx.login获取',res)
          wx.setStorageSync('session_key', res.userinfo.session_key);
          userInfo.session_key = res.userinfo.session_key
          util.request(api.getOpenIdElese,userInfo,"POST").then(sr=>{
            if(sr.errcode===1){
              wx.setStorageSync('unionid', sr.data.unionId);
              wx.setStorageSync('openid', sr.data.openId);
              resolve(sr);
            }else{
              reject(sr);
            }
          }).catch(res=>{
            reject(res);
          })
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      checkSession().then(() => {
				if(wx.getStorageSync('token')==''){
					reject(false);
				}else{
					resolve(true);
				}
      }).catch(() => {
        console.log("----我有token但是checkSession我验证失败-----")
        reject(false);
      });
    } else {
      console.log("------我没有token所以我需要在微信授权的页面-------")
      reject(false);
    }
  });
}

module.exports = {
  loginByWeixin,
  checkLogin,
  compareVersion
};