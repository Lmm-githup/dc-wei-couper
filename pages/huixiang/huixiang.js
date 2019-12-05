const api = require("../../config/api.js");
const util = require("../../utils/util.js");
let x = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    nowpage: 1,
    page: 1,
    // lists: ["https://cfwws.oldguanjia.com/Public/uploads/commodity/9/商品详情图片18759.jpg","https://cfwws.oldguanjia.com/Public/uploads/commodity/5/商品详情图片97513.jpg","https://cfwws.oldguanjia.com/Public/uploads/commodity/9/商品详情图片80019.jpg"]
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // util.request(api.setting,{},"POST").then(res=>{
    //   if(res.errcode===1){
    //     that.setData({
    //       url: res.data.h5_mall_enjoyment
    //     })
    //   }
    // })
    util.request(api.huixBanner,{type: 'huixiang'},"POST").then(res=>{
      if(res.errcode==1){
        let imgarr = [];
        for (const key in res.data) {
          imgarr.push(res.data[key].thumb);
        }
        that.setData({
          list: res.data,
          imgarr: imgarr,
          page: res.data.length
        })
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
  // imgLoad: function (e) {
  //   let width = e.detail.width;
  //   let height = e.detail.height;
  //   const res = wx.getSystemInfoSync()
  //   let that =this;
  //   let scwidth = res.windowWidth;
  //   let imgheight = scwidth/width*height;
  //   console.log(width,height,scwidth,imgheight)
  //   that.setData({
  //     imgheight: imgheight,
  //     imgwidth: scwidth
  //   })
  // },
  showimg: function(e) {
    let url = e.currentTarget.dataset.url;
    let imgarr = this.data.imgarr;
    wx.previewImage({
      current: url,
      urls: imgarr
    });
  },
  pageChange: function(e){
    let nowpage = e.detail.current;
    this.setData({
      nowpage: nowpage + 1
    })
  }
})