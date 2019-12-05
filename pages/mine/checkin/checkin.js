// pages/mine/checkin/checkin.js
const api = require("../../../config/api.js");
const util = require("../../../utils/util.js");
var onetap = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],
    days: 0,
    dayArr: [],
    ischick: 'action',
    checkTxt: '今日签到',
    detail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.showPage();
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
  showPage: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    util.request(api.signinInfo,{},'POST').then(res => {
      wx.hideLoading();
      if(res.errcode===1){
        let data = res.data;
        data.tip_description = data.tip_description.split("<br />");
        that.setData({
          detail: data
        })
        if(res.data.todayState===0){//还未签到
          that.setData({
            ischick: '',
            checkTxt: '今日签到'
          })
		  onetap = false
        }else{
          that.setData({
            ischick: 'action',
            checkTxt: '今日已签到',
            days: res.data.signDays
          })
		  onetap = true;
        }
        let days = res.data.signDays;
        let arr = [];
        for(let i = 1;i<8;i++){
          if(i<days){
            arr.push('check')
          }else if(i==days){
            arr.push('doday')
          }else{
            arr.push('')
          }
        }
        that.setData({
          dayArr: arr
        })
      }else{
		  onetap = false;
	  }
    }).catch(e=>{
		onetap = false;
	})
  },
  goCheck: function() {
    let that = this;
	if(onetap){
		return false;
	}
    wx.showLoading({
      title: '签到中...',
      mask: true
    });
    util.request(api.signin,{},'POST').then(res => {
      wx.hideLoading();
      if(res.errcode===1){
        wx.showToast({
          title: '签到成功!',
          icon: 'none',
          duration: 2500,
          mask: true,
          success: function(){
            that.showPage();
          }
        });
		onetap = true
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
        });
		onetap = false;
      }
    }).catch(e=>{
		onetap = false;
	})
  }
})