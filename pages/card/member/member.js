// pages/card/member/member.js
const util = require("../../../utils/util.js");
const api = require("../../../config/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    self:{
      img: ''
    },
    list: [],
    isself: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      self: wx.getStorageSync('userInfo')
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
    let that = this;
    util.request(api.myCard,{},"POST").then(res=>{
      if(res.errcode===1){
        let data = res.data;
        var x;
        for (x in data) {
          data[x].isshow = false
          data[x].ischange = false
          if(data[x].current_member ==1){
            data[x].isshow = true
            data[x].ischange = true
          }
        }
        that.setData({
          list: res.data
        })
      }
    })
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
    if(e.currentTarget.dataset.fid){
      url = url + '?mid=' + e.currentTarget.dataset.mid;
      url = url + '&fid=' + e.currentTarget.dataset.fid
    }
    if(e.currentTarget.dataset.ischange){
      url = url + '&ischange=' + e.currentTarget.dataset.ischange
    }
    wx.navigateTo({
      url: url
    });
  }
})