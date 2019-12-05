// pages/mine/paycode/paycode.js
const api = require("../../../config/api.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode:'',
    barcode:'',
		qrtxt: '',
    userInfo: {},
    lv: 'lv2',
    ercodeani: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let timev = new Date().getTime();
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    util.request(api.memberinfo,{},"POST").then(res=>{
      let lv = res.userinfo.tiernum;
      let gwhidden = true;
      let fjObj = {};
      let jfnow = parseInt(res.userinfo.RANK_POINTS);
      if(jfnow<300){
        fjObj.name = '银卡会员'
        fjObj.num = 300 - jfnow
        fjObj.lv = 2
        if(res.userinfo.tiernum>1){
          fjObj.name = '金卡会员'
          fjObj.num = 1000 - jfnow
          fjObj.lv = 3
        }
      }else if((jfnow>=300)&&(jfnow<1000)){
        fjObj.name = '金卡会员'
        fjObj.num = 1000 - jfnow
        fjObj.lv = 3
        if(res.userinfo.tiernum>2){
          fjObj.name = '铂金会员'
          fjObj.num = 2000 - jfnow
          fjObj.lv = 4
        }
      }else if((jfnow>=1000)&&(jfnow<2000)){
        fjObj.name = '铂金会员'
        fjObj.num = 2000 - jfnow
        fjObj.lv = 4
        if(res.userinfo.tiernum>3){
          fjObj.name = '钻石会员'
          fjObj.lv = 5
          fjObj.num = 7000 - jfnow
        }
      }else{
        fjObj.name = '钻石会员'
        fjObj.num = 7000 - jfnow
        fjObj.lv = 5
      }
      if(res.userinfo.GUIDE_ID==''){
        gwhidden = true
      }else{
        gwhidden = false
      }
      wx.setStorageSync('GUIDE', res.userinfo.GUIDE_ID);
      that.setData({
        userInfo: res.userinfo,
        lv: 'lv'+lv,
        gwhidden: gwhidden,
        fjObj: fjObj
      })
      wx.setStorageSync('userInfo', res.userinfo);
    })
    util.request(api.setting,{},'POST').then(res=>{
      if(res.errcode===1){
        that.setData({
          setting: res.data
        })
        wx.setStorageSync('setting', res.data);
      }
    })
    util.request(api.qrcode,{},"POST").then(res=>{
      if(res.errcode===1){
        that.setData({
          qrcode: res.data.qrcode_path + '?v=' + timev,
          barcode: res.data.barcode_path + '?v=' + timev,
		  qrtxt: res.data.member_code_value
          // lv: 'lv' + that.data.userInfo.tiernum
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
  goShare: function () {
    wx.navigateTo({
      url: '../share/index/index'
    });
  },
  goFz: function () {
    let cn = 'ac';
    if(this.data.ercodeani == 'ac'){
      cn = ''
    }else{
      cn = 'ac'
    }
    this.setData({
      ercodeani: cn
    })
  }
})