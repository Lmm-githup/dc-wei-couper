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
  valChange: function (e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    })
  },
  formSubmit: function(res) {
    let data = res.detail.value;
    let that = this;
    if(data.code===""){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(data.phone===""){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(!check.isValidPhone(that.data.phone)){
      wx.showToast({
        title: '手机号格式有误',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(data.code!==this.data.code){
      wx.showToast({
        title: '验证码输入有误',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    util.request(api.login,res,"POST").then(res=>{})
  },
  sendsms: function(phone,fn) {
    let newphone = phone.toString();
    let that = this;
    util.request(api.sendsms,{phone: newphone},'POST').then(res=>{
      if(res.errcode===1){
        that.setData({
          code: res.data.code
        })
        wx.showToast({
          title: '验证码发送成功！请注意查收！',
          icon: 'none',
          duration: 2500,
          mask: true,
        });
        fn();
      }
    })
  },
  getPhoneCode: function(){
    let phone = this.data.phone;
    if(check.isValidPhone(phone)){
      this.sendsms(phone,function() {
        let that = this;
        let s = 30;
        that.setData({
          codetxt: '30s后重新获取',
          noclick: 'noclick'
        })
        var int =  setInterval(function(){
          if(s>0){
            s = s - 1;
            that.setData({
              codetxt: s + 's后重新获取'
            })
          }else{
            s = 30;
            clearInterval(int)
            that.setData({
              codetxt: '获取验证码',
              noclick: ''
            })
          }
        },1000)
      });
    }else{
      wx.showToast({
        title: '手机号格式有误！请重新输入！',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
  }
})