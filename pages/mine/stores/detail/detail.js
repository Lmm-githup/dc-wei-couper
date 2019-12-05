// pages/mine/stores/detail/detail.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: {
      longitude: 0,
      latitude: 0,
      iconPath: "https://app.fjxzj.com/weimob/mapicon.png",
      detail: {}
    },
    markers:[],
    mapheihgt: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    util.request(api.storeDetail,{ORG_ID:id},"POST").then(res=>{
      console.log(res);
      if(res.errcode===1){
        let data = that.data.map
        console.log(res.data)
        data.longitude = parseFloat(res.data.LONGITUDE)
        data.latitude = parseFloat(res.data.LAT)
        let markers = that.data.markers
        markers[0] = data
        that.setData({
          map: data,
          markers: markers,
          detail: res.data
        })
      }
    });
    wx.getSystemInfo({
      success: (result)=>{
        let h = 750/result.windowWidth*result.windowHeight;
        that.setData({
          mapheihgt: h - 256
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
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  goThere: function () {
    let that = this;
    wx.openLocation({
      latitude: that.data.map.latitude,
      longitude: that.data.map.longitude,
      name: that.data.detail.ORG_NAME,
      address: that.data.detail.ADDR,
      scale: 18
    })
  }
})