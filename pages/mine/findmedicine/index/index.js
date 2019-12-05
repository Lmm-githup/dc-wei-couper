// pages/mine/findmedicine/index/index.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimg: 'https://app.fjxzj.com/weimob/findM.png',
    logList: [],
    keyword: ''
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
    let that = this;
    util.request(api.medicineLog,{},"POST").then(res=>{
      if(res.errcode === 1){
        that.setData({
          logList: res.data
        })
      }
    })
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
  inputKeyWord: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  goFind: function() {
    let that = this;
    if(that.data.keyword==""){
      wx.showToast({
        title: '请输入关键字',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    wx.navigateTo({
      url: '../find/find?keyword='+that.data.keyword
    });
  },
  tagSearch: function(e) {
    let txt = e.currentTarget.dataset.txt;
    wx.navigateTo({
      url: '../find/find?keyword='+txt,
    });
  },
  goScan: function(){
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode','barCode','datamatrix','pdf417'],
      success: (result)=>{
        wx.navigateTo({
          url: '../find/find?scan_str='+result.result
        });
      }
    });
  }
})