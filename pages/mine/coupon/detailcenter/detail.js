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
    let that = this;
    let url = api.elcouponDetail;
    let id = options.id
    util.request(url,{voucherId:id},'POST').then(res=>{
      if(res.errcode===1){
        let data = res.data;
        that.setData({
          detail: data
        })
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true
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
  addCoupon: function (e) {
      let id = e.currentTarget.dataset.id;
      let num = e.currentTarget.dataset.num;
      let data = {};
      let sceneId = wx.getStorageSync('GUIDE');
      if(num==='0'){
        wx.showToast({
          title: '您来晚了，优惠券已被领光！',
          icon: 'none',
          duration: 1500,
          mask: true
        });
        return false;
      }
      if(sceneId==''){
        data = {
          voucherId: id
        }
      }else{
        data = {
          voucherId: id,
          sceneId: sceneId
        }
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
        });
      })
  }
})