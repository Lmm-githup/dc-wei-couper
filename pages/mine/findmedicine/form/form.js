// pages/mine/findmedicine/form/form.js
const util = require("../../../../utils/util.js");
const check = require("../../../../utils/check.js");
const api = require("../../../../config/api.js");
const uploadimg = require("../../../../utils/upimg.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgshow: true,
    imageurl: '',
    userphone: '',
    username: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userphone: wx.getStorageSync('userInfo').phone,
      username: wx.getStorageSync('userInfo').name
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
  uploadImg: function(){
    let that = this;
    wx.showLoading({
      title: '图片正在上传',
      mask: true
    });
    uploadimg.uploadImg().then(res=>{
      wx.hideLoading();
      const url = res.data.filepath;
      that.setData({
        imgshow: false,
        imageurl: url
      })
    }).catch(err=>{
      console.log(err);
      wx.hideLoading();
    });
  },
  formSub: function (e) {
    let data = e.detail.value;
    let that = this;
    if(data.drugName==''){
      wx.showToast({
        title: '请输入药品名',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(data.specification==''){
      wx.showToast({
        title: '请输入药品规格',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(data.manufacturer==''){
      wx.showToast({
        title: '请输入生产企业',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(data.amount==''){
      wx.showToast({
        title: '请输入盒数',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }else{
      data.amount = parseInt(data.amount);
    }
    if(data.phone!=''){
      if(!check.isValidPhone(data.phone)){
        wx.showToast({
          title: '手机格式有误',
          icon: 'none',
          duration: 2500,
          mask: true
        });
        return false;
      }
    }
    wx.showLoading({
      title: '申请提交中...',
      mask: true,
    });
    util.request(api.medicateForm,data,'POST').then(res=>{
      wx.hideLoading();
      if(res.errcode===1){
        that.setData({
          reset: ''
        })
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
          success: function(){
            setTimeout(() => {
              wx.hideLoading();
              wx.navigateTo({
                url: '../searchlog/searchlog'
              });
            }, 2500);
          }
        });
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 1500,
          mask: true
        });
      }
    }).catch(err=>{
      wx.hideLoading();
      console.error('找药申请,',err);
    })
  }
})