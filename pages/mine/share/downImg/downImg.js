// pages/mine/share/downImg/downImg.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimg: '',
    nickname: '',
    ercode: '',
    toptxt: '',
    couponImg: '',
    bottom: '',
    src: 'https://app.fjxzj.com/wxscrm/wx-wei-page/paper.php'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let openid = wx.getStorageSync('openid');
    let token = wx.getStorageSync('token')
    let url = this.data.src + '?token=' + token + '&openid=' + openid;
    this.setData({
      src: url
    })
    util.request(api.setting,{},"POST").then(res=>{
      that.setData({
        toptxt: res.data.invite_playbill_title,
        couponImg: res.data.invite_playbill_midpic,
        bottom: res.data.invite_playbill_content,
        nickname: wx.getStorageSync("userInfo").nickname,
        ercode: wx.getStorageSync("userInfo").wxacode,
        headimg: wx.getStorageSync("userInfo").headimgurl
      })
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
    let inviter = wx.getStorageSync('userInfo').memberId;
    let name = wx.getStorageSync('userInfo').nickname;
    return {
      title: name + '邀请您加入微会员',
      // path: '/pages/auth/authorize/authorize' + inviter
      path: '/pages/auth/authorize/authorize?inviter=' + inviter
    }
  }
})