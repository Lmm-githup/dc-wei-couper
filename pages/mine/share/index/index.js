// pages/mine/share/index/index.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageUI: {
      banner: '',
      con: ''
    },
    alert: '',
    wxCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    util.request(api.setting,{},"POST").then(res=>{
      that.setData({
        pageUI: {
          banner: res.data.invite_home_toppic,
          con: res.data.invite_home_midpic
        },
        wxCode: wx.getStorageSync('userInfo').wxacode 
      })
    })
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
  onShareAppMessage: function (res) {
    let url = '/pages/auth/authorize/authorize';
    let user = wx.getStorageSync('userInfo');
    let id = user.memberId;
    let name = user.name;
    if (res.from === 'button') {
      url = url + '?inviter=' + id
    }
    return {
      title: name + '邀请您进入微会员',
      path: url,
    }
  },
  goPaper: function(){
    wx.navigateTo({
      url: '../downImg/downImg'
    });
  },
  goShare: function(){
    wx.navigateTo({
      url: '../sharepage/sharepage?id=false'
    });
  },
  showAlert: function(){
    this.setData({
      alert: 'action'
    })
  },
  hiddenAlert: function(){
    this.setData({
      alert: ''
    })
  }
})