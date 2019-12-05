// pages/mine/remind/medicine/medicine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  qrMedicine: function () {
    let data = wx.getStorageSync('medicine');
    if(!data){
      data = {
        name: '点我选择药品',
        type: '点我选择提醒方式',
        per: '点我选择服药频率'
      }
    }
    data.name = '氨加黄敏胶囊';
    wx.setStorage({
      key: 'medicine',
      data: data
    });
    wx.navigateBack({
      delta: 1
    });
  }
})