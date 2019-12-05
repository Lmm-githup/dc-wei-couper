// pages/mine/paycode/paycode.js
const api = require("../../../config/api.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode:'',
    barcode:'',
    userInfo: {},
    lv: 'lv2',
    isaddshow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if(wx.getStorageSync('userInfo').family_card=='Self'){
      that.setData({
        isaddshow: true
      })
    }else{
      that.setData({
        isaddshow: false
      })
    }
    util.request(api.qrcode,{},"POST").then(res=>{
      if(res.errcode===1){
        that.setData({
          qrcode: res.data.family_qrcode,
          barcode: res.data.family_barcode,
          lv: 'lv' + that.data.userInfo.tiernum
        })
      }
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
  onShareAppMessage: function () {

  },
  goInfo: function (e) {
    let url = '../info/info'
    wx.navigateTo({
      url: url
    });
  },
  goMember: function(){
    wx.navigateTo({
      url: '../member/member'
    });
  }
})