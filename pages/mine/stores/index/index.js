// pages/mine/stores/index/index.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: {
      longitude: 0,
      latitude: 0,
      iconPath: "https://app.fjxzj.com/weimob/mapicon.png"
    },
    markers:[],
    list: [],
		page: 1,
		loadtip: ''
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
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        wx.getLocation({
          type: 'gcj02',
          success(res) {
            let data = that.data.map
            data.longitude = res.longitude
            data.latitude = res.latitude
            let markers = that.data.markers
            markers[0] = data
            that.setData({
              map: data,
              markers: markers
            })
            util.request(api.storeList,{longitude:data.longitude,latitude:data.latitude},'POST').then(res=>{
              if(res.errcode === 1){
                that.setData({
                  list: res.data,
									page: 2
                })
              }
            })
          }
        })
      }
    })
  },
	getList: function(page){
		let that = this;
		that.setData({
			loadtip: '加载中...'
		})
		util.request(api.storeList,{longitude:that.data.map.longitude,latitude:that.data.map.latitude,page:page},'POST').then(res=>{
		  if(res.errcode === 1){
				let list = that.data.list;
				if(page==1){
					list = res.data;
				}else{
					res.data.forEach(el => {
					  list.push(el);
					});
				}
		    that.setData({
		      list: list,
					page: page + 1
		    })
		  }else{
				that.setData({
					loadtip: res.errmsg
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
		let that = this;
		that.getList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
		let that = this;
		that.getList(that.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  phoneCall: function (e) {
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  goThere: function (e) {
    let eData = e.currentTarget.dataset;
    let data = {
      latitude: parseFloat(eData.lat),
      longitude: parseFloat(eData.long),
      name: eData.name,
      address: eData.address
    }
    wx.openLocation(data);
  },
  goDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  }
})