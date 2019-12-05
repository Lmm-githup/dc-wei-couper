// pages/mine/information/changePhone/changePhone.js
const api = require("../../../../config/api.js");
const check = require("../../../../utils/check.js");
const util = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: 0,
    codetxt: '获取验证码',
    noclick: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   phone: options.phone
    // })
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
    console.log(that.data,res)
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
    wx.showLoading({
      title: '请稍等...',
      mask: true
    });
    util.request(api.changePhone,{newPhone:data.phone},"POST").then(res=>{
      wx.hideLoading();
      wx.showToast({
        title: res.errmsg,
        icon: 'none',
        duration: 2500,
        mask: true,
        success: (result)=>{
          if(res.errcode===1){
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              });
            },2500)
          }
        }
      });
    })
  },
  sendsms: function(phone,fn) {
    let newphone = phone.toString();
    let that = this;
    wx.showLoading({
      title: '请稍等...',
      mask: true
    });
    util.request(api.sendsms,{phone: newphone,ctype: 'changephone'},'POST').then(res=>{
      wx.hideLoading();
      if(res.errcode===1){
        that.setData({
          code: res.data.code.toString()
        })
        wx.showToast({
          title: '验证码发送成功，请注意查收！',
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
    let that = this;
    if(check.isValidPhone(phone)){
      this.sendsms(phone,function() {
        let s = 180;
        that.setData({
          codetxt: '180s后重新获取',
          noclick: 'noclick'
        })
        var int =  setInterval(function(){
          if(s>0){
            s = s - 1;
            that.setData({
              codetxt: s + 's后重新获取'
            })
          }else{
            s = 180;
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
        title: '手机号格式错误，请重新输入!',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
  }
})