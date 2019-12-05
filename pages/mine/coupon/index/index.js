// pages/mine/coupon/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navAC:['action',''],
    hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: (result)=>{
        let h = 750/result.windowWidth*result.windowHeight;
        that.setData({
          scrollHeight: h - 118
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
  tabNav: function (e) {
    // navAC:['action',''],
    // hidden: false
    let that = this;
    let index = e.currentTarget.dataset.index;
    if(index==='0'){
      that.setData({
        navAC: ['action',''],
        hidden: false
      })
    }else{
      that.setData({
        navAC: ['','action'],
        hidden: true
      })
    }
  }
})