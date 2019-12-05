// pages/mine/share/downimgpage/downimgpage.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let url = options.url
    wx.getImageInfo({
      src: url,
      success: function (sres) {
        wx.showLoading({
          title: '图片下载中...',
          mask: true
        });
        that.setData({
          url: sres.path
        })
        wx.saveImageToPhotosAlbum({
          filePath: sres.path,
          success: function (fres) {
            wx.hideLoading();
            wx.showModal({
              title: '图片下载成功',
              content: '快去朋友圈分享给大家吧！',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '确定',
              confirmColor: '#3CC51F'
            });
          },
          fail: (err)=>{
            console.error(err);
            wx.showToast({
              title: err,
              icon: 'none',
              image: '',
              duration: 1500,
              mask: true
            });
          },
        })
      },
      fail: (err)=>{
        console.error(err);
        wx.showToast({
          title: err,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        });
      },
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

  }
})