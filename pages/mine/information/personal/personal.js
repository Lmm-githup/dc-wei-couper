// pages/mine/information/personal/personal.js
const check = require("../../../../utils/check.js");
const util = require("../../../../utils/util.js");
const api = require("../../../../config/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['男','女'],
    index: 0,
    date: '2019-01-01',
    userInfo: {}
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
    this.getUserInfo();
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

  getUserInfo: function () {
    let that = this;
    util.request(api.memberinfo,{},'POST').then(res=>{
      let user = res.userinfo
      wx.setStorageSync('userInfo', user);
      if(!(user.birth)){
        user.birth = "请输入生日"
      }
      if(!(user.sex)){
        user.sex = "请输入性别"
      }
      if(!(user.email)){
        user.email = ""
      }
      if(!(user.idNum)){
        user.idNum = ""
      }
      that.setData({
        userInfo: user
      });
    })
  },

  sexChange: function(e){
    let user = this.data.userInfo;
    user.sex = this.data.sex[e.detail.value]
    this.setData({
      userInfo: user
    })
  },

  idNumChange: function(e){
    let user = this.data.userInfo;
    user.idNum = e.detail.value;
    this.setData({
      userInfo: user
    })
  },

  emailChange: function(e){
    let user = this.data.userInfo;
    user.email = e.detail.value;
    this.setData({
      userInfo: user
    })
  },

  bindDateChange: function(e){
    let user = this.data.userInfo;
    user.birth = e.detail.value;
    this.setData({
      userInfo: user
    })
  },

  goChangePhone: function(e){
    const phone =this.data.userInfo.phone;
    wx.navigateTo({
      url: '../changePhone/changePhone?phone='+phone
    });
  },

  submitForm: function(e){
    let data = e.detail.value;
    let that = this;
    if(!check.isValidCode(data.idNum)){
      wx.showToast({
        title: '身份证号填写有误！',
        icon: 'none',
        image: '',
        duration: 2500,
        mask: true
      });
      return false;
    }
    if(!check.isValidMail(data.email)){
      wx.showToast({
        title: '邮箱填写有误！',
        icon: 'none',
        image: '',
        duration: 2500,
        mask: true
      });
      return false;
    }
    if(!check.isValidDate(data.birth)){
      delete data.birth
    }
    if(data.sex=='请输入性别'){
      delete data.sex
    }
    util.request(api.changePer,data,"POST").then(res=>{
      wx.showToast({
        title: res.errmsg,
        icon: 'none',
        duration: 2500,
        mask: true,
        success: (result)=>{
          setTimeout(function(){
            if(res.errcode===1){
              wx.switchTab({
                url: '/pages/mine/index/index'
              });
            }
          },2500)
        }
      });
      that.getUserInfo();
    })

  }

})