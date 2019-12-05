// pages/auth/loginByPhone/loginByPhone.js
var util = require("../../../utils/util.js")
var check = require("../../../utils/check.js");
var api = require("../../../config/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codetxt: '获取验证码',
    noclick: '',
    phone: 1,
    code: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit: function(res) {
    let phone = res.detail.value.phone;
    util.request(api.demoPhoneLogin,{phone:phone},"POST").then(r=>{
      if(r.errcode==1){
        wx.setStorageSync('token', r.userinfo.token);
        wx.setStorageSync('userInfo', r.userinfo);
        wx.setStorageSync('openid', r.userinfo.openid);
        wx.setStorageSync('GUIDE', r.userinfo.GUIDE_ID);
        wx.setStorageSync('GUIDE', r.userinfo.GUIDE_ID);
        wx.switchTab({
          url: "/pages/mine/index/index"
        });
      }else{
        wx.showToast({
          title: r.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
        });
      }
    })
  }
})