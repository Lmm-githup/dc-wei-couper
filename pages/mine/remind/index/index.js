// pages/mine/remind/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showalert:  '',
    name: '点我选择药品',
    medicine: {
      name: '点我选择药品',
      type: '点我选择提醒方式',
      per: '点我选择服药频率'
    }
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
    try {
      const medicine = wx.getStorageSync('medicine')
      if (medicine) {
        this.setData({
          showalert: "action",
          medicine: medicine
        })
      }
    } catch (e) {
      console.log(e)
    }
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
  showAlert: function () {
    this.setData({
      showalert: "action"
    })
  },
  escAlert: function () {
    this.setData({
      showalert: ''
    })
  },
  chooseMedicine: function () {
    wx.navigateTo({
      url: '../medicine/medicine'
    });
  },
  chooseType: function () {
    wx.navigateTo({
      url: '../type/type'
    });
  },
  choosePer: function () {
    wx.navigateTo({
      url: '../per/per'
    });
  }
})