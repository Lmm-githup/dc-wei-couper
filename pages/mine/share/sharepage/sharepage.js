// pages/mine/share/sharepage/sharepage.js
const user = require('../../../../utils/user.js');
const util = require("../../../../utils/util.js");
const api = require("../../../../config/api.js");
const check = require("../../../../utils/check.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false, //初始状态为true
    userInfo: {},
    openid: '',
    unionid: '',
    noclick: '',
    code: 0,
    codetxt: '获取验证码',
    phone: '',
    pageUI:{
      coupon: '',
      coutxt: '',
      href: '',
      hreftxt: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.drawUI();
    this.setFormData();
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
  setFormData: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      openid: wx.getStorageSync('openid'),
      unionid: wx.getStorageSync('unionid')
    })
  },
  drawUI: function () {
    let that = this;
    util.request(api.setting,{},"POST").then(res=>{
      that.setData({
        pageUI: {
          coupon: res.data.invite_register_midpic,
          coutxt: res.data.invite_register_content,
          href: res.data.h5_user_terms
        }
      })
    })
  },
  goUrl: function(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../../../H5page/H5page?url=' + url
    });
  },
  subForm: function (e) {
    let that = this;
    let data = e.detail.value;
    if(!check.isValidPhone(data.phone)){
      wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none',
        duration: 2500,
        mask: true
      });
      return false;
    }
    if(data.code!==this.data.code){
      wx.showToast({
        title: '验证码输入有误',
        icon: 'none',
        duration: 2500,
        mask: true
      });
      return false;
    }
    wx.showLoading({
      title: '正在注册',
      mask: true
    })
    data.inviter = wx.getStorageSync('inviter');
    util.request(api.register,data,"POST").then(res=>{
      wx.removeStorageSync('inviter');
      wx.hideLoading();
      if(res.errcode===1){
        wx.setStorageSync('token', res.userinfo.token);
        wx.showToast({
          title: '您已经注册成功！',
          icon: 'none',
          duration: 2500,
          mask: true,
          success: (result)=>{
            setTimeout(function(){
              wx.switchTab({
                url: '/pages/mine/index/index'
              });   
            },2500)
          }
        });
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
        });
      }
    })
  },
  sendsms: function(phone,fn) {
    let newphone = phone.toString();
    let that = this;
    wx.showLoading({
      title: '请稍等...',
      mask: true
    });
    util.request(api.sendsms,{phone: newphone},'POST').then(res=>{
      wx.hideLoading();
      if(res.errcode===1){
        that.setData({
          code: res.data.code.toString()
        })
        wx.showToast({
          title: '验证码发送成功，请注意查收！',
          icon: 'none',
          duration: 2500,
          mask: true
        });
        fn();
      }
    })
  },
  printPhone: function (e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    })
  },
  getPhoneCode: function () {
    let phone = this.data.phone;
    let that = this;
    if(check.isValidPhone(phone)){
      this.sendsms(phone,function() {
        let s = 60;
        that.setData({
          codetxt: '60s后重新获取',
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
        title: '手机号格式错误，请重新输入',
        icon: 'none',
        duration: 2500,
        mask: true
      });
      return false;
    }
  }
})