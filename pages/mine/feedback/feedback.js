// pages/mine/findmedicine/find/find.js
const api = require("../../../config/api.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagList:[],
    num:0,
    phone: '',
    form: {
      feedback_type: '',
      comments: ''
    },
    system:{},
    tiptxt:''
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
    let that = this;
    let phone = wx.getStorageSync("userInfo").phone;
    phone = phone.replace(/^(\d{3})\d{4}(\d{4})$/,"$1****$2");
    that.getSystemSetting();
    util.request(api.feedbackType,{},"POST").then(res=>{
      if(res.errcode==1){
        let arr = res.data;
        arr.forEach((el,index) => {
          el.class = ''
        });
        that.setData({
          tagList: arr,
          phone: phone,
          tiptxt: wx.getStorageSync('setting').feedback_tip_reward
        })
      }
    })
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
  goPhone: function(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  comChange: function(e){
    let form = this.data.form;
    form.comments = e.detail.value;
    this.setData({
      num: e.detail.cursor,
      form: form
    })
  },
  chooseType: function(e){
    let index = e.currentTarget.dataset.index;
    let tagList = this.data.tagList;
    let form = this.data.form;
    tagList.forEach((el,i) => {
      if(i===index){
        el.class = 'action'
        form.feedback_type = el.name
      }else{
        el.class = ''
      }
    });
    this.setData({
      tagList: tagList,
      form: form
    })
  },
  getSystemSetting: function() {
    let that = this;
    util.request(api.setting,{},'POST').then(res=>{
      that.setData({
        system: res.data
      })
    })
  },
  formSub: function(){
    let data = this.data.form;
    let that = this;
    if(data.feedback_type==''){
      wx.showToast({
        title: '请您先选择反馈类型',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(data.comments==''){
      wx.showToast({
        title: '请填写您宝贵的意见！',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    wx.showLoading({
      title:'反馈提交中..',
      mask: true
    });
    util.request(api.subFeedback,data,"POST").then(res=>{
      if(res.errcode===1){
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
          success: (result)=>{
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/mine/index/index',
                success: (result)=>{
                  wx.hideLoading();
                },
              });
            }, 2500);
          }
        });
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
  goLog: function(){
    wx.navigateTo({
      url: './feedbacklog/feedbacklog'
    });
  }
}) 