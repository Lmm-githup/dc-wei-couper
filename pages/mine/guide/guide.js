const api = require("../../../config/api.js");
const util = require("../../../utils/util.js");
var settimeout = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    isshow: false,
    tip: '',
    tipbottom: '',
    userInfo: {red_chat: 0}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    let isshow = true;
    if(wx.getStorageSync('userInfo').tiernum>2){
      isshow = true
    }else{
      isshow = false
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    util.request(api.guideInfo,{guideId: id},"POST").then(res=>{
      wx.hideLoading();
      if(res.errcode===1){
        that.setData({
          user: res.data,
          isshow: isshow,
          tip: wx.getStorageSync("setting").tip_health_guide,
          tipbottom: wx.getStorageSync("setting").tip_health_guide_bottom,
          userInfo: wx.getStorageSync("userInfo")
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
		// 开启导购反馈和找药轮询
		// this.dataLeep();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
		// clearInterval(settimeout);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
		// clearInterval(settimeout);
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
	// 实时信息轮询
	dataLeep: function() {
	  let that = this;
	  settimeout = setInterval(function(){
		  util.request(api.memberinfo,{},"POST").then(res=>{
				that.setData({
				  userInfo: res.userinfo,
				})
		  })
	  },3500)
	},
  callPhone: function(e){
    if(this.data.user.tip_health_state == 1){
      wx.showModal({
        title: '提示',
        content: this.data.user.tip_health_phone_chat,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            
          }
        }
      });
      return false;
    }
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  goH5: function(){
    let tip = wx.getStorageSync('userInfo').chat_tip;
    if(this.data.user.tip_health_state == 1){
      wx.showModal({
        title: '提示',
        content: this.data.user.tip_health_phone_chat,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            
          }
        }
      });
      return false;
    }
    if(tip!=''){
      wx.showToast({
        title: tip,
        icon: 'none',
        duration: 1500,
        mask: true
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/H5page/H5page?url=' + 'dgChart'
    });
  }
})