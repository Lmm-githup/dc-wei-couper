// pages/mine/findmedicine/find/find.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mList: [],
    logList: [],
    noHideen: true,
    type: '',
    page: 1,
    sTxt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '查询中...',
      mask: true
    });
    if(options.keyword){
      this.setData({
        type: 'keyword',
        sTxt: options.keyword
      })
      this.search("keyword",options.keyword,1)
    }else{
      this.setData({
        type: 'scan_str',
        sTxt: options.scan_str
      })
      this.search("scan_str",options.scan_str,1)
    }
    util.request(api.medicineLog,{},"POST").then(res=>{
      if(res.errcode === 1){
        that.setData({
          logList: res.data
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
    let phone = wx.getStorageSync('setting').kefu_telephone;
    this.setData({
      kfphone: phone
    })
    try {
      let keyword = wx.getStorageSync('search');
      if(keyword){
        wx.removeStorageSync('search');
        this.setData({
          mList:[]
        })
        this.search("keyword",keyword,1)
      }
    } catch (error) {
      
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
    let type = this.data.type;
    let page = this.data.page;
    let txt = this.data.sTxt;
    this.search(type,txt,page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goForm: function(){
    wx.navigateTo({
      url: '../form/form'
    });
  },
  goStores: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../stores/stores?id=' + id
    });
  },
  goYszx: function(){
    wx.navigateTo({
      url: '/pages/service/yszx/yszx'
    })
  },
  goDetail:  function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  },
  goPhone: function() {
    let phone = this.data.kfphone
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  search: function(type,txt,page){
    let data = {page: page};
    let that = this;
    if(type==="keyword"){
      data.keyword = txt;
    }else{
      data.scan_str = txt;
    }
    util.request(api.findMedicine,data,"POST").then(res=>{
      wx.hideLoading();
      if(res.errcode === 1){
        let arr = that.data.mList;
        res.data.forEach(el => {
          arr.push(el);
        });
        that.setData({
          mList: arr,
          noHideen: true,
          page: page + 1
        })
      }else{
        if(page==1){
          that.setData({
            noHideen: false
          })
        }
      }
    }).catch(err=>{
      wx.hideLoading();
    })
  }
}) 