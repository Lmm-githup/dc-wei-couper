const util = require("../../../../utils/util.js");
const api = require("../../../../config/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: true,
    height: 0,
    formShow: '',
    list: [],
    page: 1,
    acId: 0,
    form: {
      orderId: '',
      orderNum: '',
      drugEval: 0,
      serviceAttitude: 0,
      comments: ''
    },
    ykpj: {
      re: [0,1,2,3,4],
      ac: [],
      txt: 0
    },
    fwpj: {
      re: [0,1,2,3,4],
      ac: [],
      txt: 0
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: (result)=>{
        let h = 750/result.windowWidth*result.windowHeight;
        that.setData({
          height: h
        })
      }
    });
    that.getList(1);
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
  OrderP: function(e){
    let index = e.target.dataset.index + 1;
    let arr = [];
    let data = this.data.ykpj;
    let form = this.data.form;
    form.drugEval = index;
    for (let i = 0; i < index; i++) {
      arr[i] = i
    }
    data.ac = arr;
    this.setData({
      ykpj: data,
      form: form
    })
  },
  FwP: function(e){
    let index = e.target.dataset.index + 1;
    let arr = [];
    let data = this.data.fwpj;
    let form = this.data.form;
    form.serviceAttitude = index;
    for (let i = 0; i < index; i++) {
      arr[i] = i
    }
    data.ac = arr;
    this.setData({
      fwpj: data,
      form: form
    })
  },
  bzInput: function(e) {
    let txt = e.detail.value;
    let form = this.data.form;
    form.comments = txt;
    this.setData({
      form: form
    })
  },
  showForm: function(e){
    let id = e.currentTarget.dataset.id;
    let num = e.currentTarget.dataset.num
    let form = this.data.form;
    form.orderId = id;
    form.orderNum = num;
    this.setData({
      formShow: "action",
      form: form
    })
  },
  escForm: function(){
    this.setData({
      formShow: ""
    })
  },
  submitForm: function(){
    let that = this;
    let data = that.data.form;
    wx.showLoading({
      title: '订单评价上传中...',
      mask: true
    });
    util.request(api.subOrder,data,"POST").then(res=>{
      wx.hideLoading();
      if(res.errcode===1){
        that.escForm();
        wx.navigateTo({
          url: '../submit/submit'
        });
      }
    }).catch(res=>{
      wx.hideLoading();
    })
  },
  getList: function(page) {
    let that = this;
    util.request(api.myOrder,{page:page,page_size:10},'POST').then(res=>{
      if((page==1)&&(res.errcode!=1)){
        that.setData({
          tips: false
        })
      }
      if(res.errcode===1){
        let arr = that.data.list;
        res.data.forEach(element => {
          arr.push(element)
        });
        that.setData({
          list: arr,
          page: page + 1,
          tips: true
        })
        if(page===1){
          wx.stopPullDownRefresh()
        }
      }
    })
  }
})