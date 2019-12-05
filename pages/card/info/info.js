// pages/card/info/info.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gx: [],
    gxkey: 0,
    btntxt: '',
    fid:'',
    shareShow: '',
    pershow: false,
    jf: {
      check: false,
      val: 'N'
    },
    yhq: {
      check: false,
      val: 'N'
    },
    form:{
      POINT_FLG: 'Y'
    },
    MEM_ID: '',
    mshow: 'block',
    // 提交按钮
    issubshow: true,
    // 普通表单是否可动
    disabled: false,
    // 积分选择是否可动
    jfdisabled: false,
    escHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    util.request(api.setting,{},'POST').then(res=>{
      if(res.errcode===1){
        let form = that.data.form;
        let gx = res.data.Siebel_ship;
        if(!options.mid){
          form.SHIP = gx[0];
        }
        that.setData({
          gx: gx,
          form: form
        })
      }
    })
    if(options.mid){
      let form = this.data.form;
      form.familyRowId = options.fid;
      that.getMeInfo(options.mid)
      that.setData({
        btntxt: '修改',
        mainurl: api.editCard,
        fid: options.fid,
        pershow: true,
        MEM_ID: options.mid,
        escHidden: false
      })
      console.log('ischange.',options.ischange)
      if(options.ischange){
        that.setData({
          issubshow: true,
          disabled: true,
          jfdisabled: false
        })
      }else{
        that.setData({
          issubshow: false,
          disabled: true,
          jfdisabled: true
        })
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      util.request(api.CardDetail,{FAMILY_ID: options.fid},'POST').then(res=>{
        wx.hideLoading();
        if(res.errcode===1){
          that.setData({
            form: res.data
          })
        }
      })
    }else{
      that.setData({
        btntxt: '添加',
        mainurl: api.addCard,
        escHidden: true
      })
    }
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        title: '',
        path: "pages/auth/authorize/authorize",
        imageUrl:''
      }
    }
  },
  showAlert(){
    this.setData({
      shareShow: 'action'
    })
  },
  hiddenAlert(){
    this.setData({
      shareShow: ''
    })
  },
  gxChange: function (e) {
    let gx = e.detail.value;
    let data = this.data.form;
    data.SHIP = this.data.gx[gx];
    this.setData({
      form: data
    })
  },
  nameChange: function (e) {
    let val = e.detail.value;
    let data = this.data.form;
    data.NAME = val;
    this.setData({
      form: data
    })
  },
  phoneChange: function (e) {
    let val = e.detail.value;
    let data = this.data.form;
    data.PHONE = val;
    this.setData({
      form: data
    })
  },
  changeCheck: function(e) {
    let data = this.data.form;
    console.log(e.currentTarget.dataset.disabled)
    if(e.currentTarget.dataset.disabled){
      return false
    }
    if(e.currentTarget.dataset.type==='jf'){
      if(data.POINT_FLG=='Y'){
        data.POINT_FLG = 'N'
      }else{
        data.POINT_FLG = 'Y'
      }
    }
    this.setData({
      form: data
    })
  },
  formSubmit: function(e){
    let data = e.detail.value;
    let url = this.data.mainurl;
    let that = this;
    if(this.data.fid!=''){
      data.familyRowId = this.data.fid;
    }
    if(data.name==''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(data.phone==''){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(data.ship==''){
      wx.showToast({
        title: '请填写与卡主人的关系',
        icon: 'none',
        duration: 2500,
        mask: true,
      });
      return false;
    }
    if(data.pointsPermission==''){
      data.pointsPermission = 'N';
      return false;
    }
    data.voucherPermission = 'N';
    util.request(url,data,'POST').then(res=>{
      if(res.errcode===1){
        if(that.data.fid!=''){
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
        }else{
          wx.showModal({
            title: '提示',
            content: '家庭卡成员添加成功！快告诉他吧！',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
              if(result.confirm){
                that.showAlert();
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        }
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
  getMeInfo: function(mid) {
    let that = this;
    util.request(api.medicineReminder,{MEM_ID: mid},'POST').then(res=>{
      if(res.errcode==1){
        that.setData({
          mInfo: {
            show: 'block',
            data: res.data
          }
        })
      }else{
        that.setData({
          mInfo: {
            show: 'none',
            data: []
          }
        })
      }
    })
  },
  goFx: function(e){
    let type = e.currentTarget.dataset.type;
    let mid = e.currentTarget.dataset.mid;
    let url = '';
    if(type=='bmi'){
      url = '/pages/service/detailPage/detailPage'
    }else if(type=='glu'){
      url = '/pages/service/detailPageXt/detailPage'
    }else if(type=='bp'){
      url = '/pages/service/detailPageXy/detailPage'
    }
    url = url + '?mid=' + mid
    wx.navigateTo({
      url: url
    });
  },
  deletPer: function() {
    let form = this.data.form;
    let data = {
      cardNum: form.CARD_NUM,
      priMemId: form.PRIMARY_ID,
      memId: form.MEM_ID
    }
    wx.showModal({
      title: '提示',
      content: '您确定退出家庭卡吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '退出',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          util.request(api.cardExit,data,'POST').then(res=>{
            wx.showToast({
              title: res.errmsg,
              icon: 'none',
              duration: 2000,
              mask: true,
              success: ()=>{
                if(res.errcode===1){
                  setTimeout(() => {
                    wx.switchTab({
                      url: '/pages/mine/index/index'
                    });
                  }, 2000);
                }
              }
            });
          }).catch(res=>{
            console.log(res);
          })
        }
      }
    });
  }
})