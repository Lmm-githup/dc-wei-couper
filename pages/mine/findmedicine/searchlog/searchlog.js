// pages/mine/findmedicine/searchlog/searchlog.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    util.request(api.medicateFormLog,{},"POST").then(res=>{
      if(res.errcode==1){
        that.setData({
          list: res.data
        })
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
          success: function(){
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 2500);
          }
        });
      }
    })
    util.request(api.read_state,{type:'feedback'},'POST').then(res=>{
      if(res.errcode==1){
        console.log('消掉小红点')
      }else{
        console.error(res.errmsg)
      }
    }).catch(err=>{
      console.error(err);
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
  goDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/findmedicine/searchlogdetail/searchlogdetail?id=' + id
    });
  }
})