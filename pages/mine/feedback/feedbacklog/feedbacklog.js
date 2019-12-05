// pages/mine/feedback/feedbacklog/feedbacklog.js
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(1);
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
    this.setData({
      list: []
    })
    this.getList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page;
    this.getList(page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getList: function(page){
    let that = this;
    util.request(api.feedbackList,{page:page},'POST').then(res=>{
      if(res.errcode===1){
        let list = that.data.list;
        res.data.forEach(element => {
          list.push(element);
        });
        that.setData({
          list: list,
          page: page + 1
        })
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
        });
      }
    })
  },
  goDetail: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../feedbackdetail/feedbackdetail?id=' + id
    });
  }
})