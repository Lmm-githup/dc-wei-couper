// pages/service/index/index.js
function isInArr(txt,arr){
  let n = true;
  for (const key in arr) {
    if(arr[key]===txt){
      n = true;
      break;
    }else{
      n = false;
    }
  }
  return n;
}
const api = require("../../../config/api.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    tagList: [],
    checkIdList:[],
    showalert:  '',
    name: '点我选择药品',
    medicine: {
      name: '点我选择药品',
      type: '点我选择提醒方式',
      per: '点我选择服药频率'
    },
    remind: {},
    remindHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getTag();
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
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
    try {
      const medicine = wx.getStorageSync('medicine')
      if (medicine) {
        this.setData({
          showalert: "action",
          medicine: medicine
        })
      }
    } catch (e) {
      console.log(e)
    }
    this.medicineReminder();
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
  goH5Page: function () {
    let url = '../../H5page/H5page?url=';
    let title = '药师咨询'
    util.request(api.setting,{},'POST').then(res=>{
      if(res.errcode===1){
        wx.navigateTo({
          url: url + res.data.h5_link_apothecary
        });
      }
    })
  },
  goYszx: function () {
    wx.navigateTo({
      url: '../yszx/yszx',
    })
  },
  getTag: function () {
    let that = this;
    util.request(api.tagList,{},'POST').then(res => {
      let list = [];
      res.data.forEach(element => {
        if(isInArr(element.id,res.tag_ids)){
          element.classN = 'action'
        }else{
          element.classN = ''
        }
        list.push(element)
      });
      that.setData({
        tagList: list,
        checkIdList: res.tag_ids
      })
    })
  },
  showAlert: function () {
    this.setData({
      showalert: "action"
    })
  },
  escAlert: function () {
    this.setData({
      showalert: ''
    })
  },
  trueTag: function (e) {
    let tag_id = e.currentTarget.dataset.id;
    let type = 1;
    let txt = '';
    let that = this;
    if(isInArr(tag_id,this.data.checkIdList)){
      type = -1; //id在数组内，就取消关注
      txt = "您确定取消此标签关注吗？"
    }else{
      type = 1; //id不在数组内，就添加关注
      txt = "您确定关注此标签吗？"
    }
    tag_id = parseInt(tag_id);
    wx.showModal({
      title: '提示',
      content: txt,
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        if(result.confirm){
          wx.showLoading({
            mask: true,
          });
          util.request(api.trueTag,{tag_id: tag_id,type: type},"POST").then(res=>{
            if(res.errcode===1){
              wx.hideLoading();
              that.getTag()
            }
          })
        }
      }
    });
  },
  goCheck: function() {
    wx.navigateTo({
      url: '../HealthCheck/HealthCheck',
    });
  },
  chooseMedicine: function () {
    wx.navigateTo({
      url: '../../mine/remind/medicine/medicine'
    });
  },
  chooseType: function () {
    wx.navigateTo({
      url: '../../mine/remind/type/type'
    });
  },
  choosePer: function () {
    wx.navigateTo({
      url: '../../mine/remind/per/per'
    });
  },
  medicineReminder: function () {
    let that = this;
    util.request(api.medicineReminder,{},'POST').then(res=>{
      if(res.errcode===1){
        that.setData({
          remind: res.data,
          remindHidden: false
        })
      }else{
        that.setData({
          remind: res.data,
          remindHidden: true
        })
        console.log('用药提醒',res)
      }
    })
  }
})