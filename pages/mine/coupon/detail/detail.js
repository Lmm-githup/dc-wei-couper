// pages/mine/coupon/detail/detail.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    shareHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = '';
    let url = '';
    if(options.id){
      id = options.id
      url = api.couponDetail
    }
    if(options.share){
      this.setData({
        shareHidden: false
      })
      id = wx.getStorageSync('voucherId');
      url = api.elcouponDetail
    }
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    util.request(url,{voucherId:id},'POST').then(res=>{
      console.log(res);
      wx.hideLoading();
      if(res.errcode===1){
        let data = res.data;
        if(options.id){
          data.description_text = data.description_text.split("<br />");
          that.setData({
            detail: data
          })
        }else{
          that.setData({
            sharecou: data
          })
        }
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
          success: function(){
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 2500);
          }
        });
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
  addCoupon: function () {
      let data = {};
      data = {
        voucherId: wx.getStorageSync('voucherId'),
        sceneId: wx.getStorageSync('sceneId'),
        voucherScode: wx.getStorageSync('voucherScode')
      }
      wx.showLoading({
        mask: true
      });
      util.request(api.chooseCoupon,data,'POST').then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
          success: (result)=>{
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/mine/index/index'
              });
            }, 2500);
          }
        });
      })
  }
})