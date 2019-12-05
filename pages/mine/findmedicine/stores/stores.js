// pages/mine/findmedicine/stores/stores.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    let data = {};
    data.PROD_NUM = id;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        data.longitude = res.longitude
        data.latitude = res.latitude
        that.setData({
          data: data
        })
        wx.showLoading({
          title: '门店加载中',
          mask: true
        });
        util.request(api.medicateStore,data,'POST').then(r=>{
          wx.hideLoading();
          if(r.errcode===1){
            that.setData({
              list: r.data
            })
          }else{
            wx.showToast({
              title: r.errmsg,
              icon: 'none',
              duration: 2500,
              mask: true,
              success: function() {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 2500);
              }
            });
          }
        })
      }
    });
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
  phoneCall: function (e) {
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  goThere: function (e) {
    let eData = e.currentTarget.dataset;
    let data = {
      latitude: parseFloat(eData.lat),
      longitude: parseFloat(eData.long),
      name: eData.name,
      address: eData.address
    }
    wx.openLocation(data);
  },
  goDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/mine/stores/detail/detail?id=' + id
    });
  },
  searchInput: function(e){
    let keyword = e.detail.value;
    let data = this.data.data;
    data.keyword = keyword;
    util.request(api.medicateStore,data,'POST').then(r=>{
      if(r.errcode===1){
        that.setData({
          list: r.data
        })
      }else{
        wx.showToast({
          title: r.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true
        });
      }
    })
  }
})