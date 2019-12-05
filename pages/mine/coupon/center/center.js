const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
Page({
  data: {
    navList: [
      {
        title: '保健食品',
        type: '保健食品',
        action: 'action',
        page:1,
        data: []
      },
      {
        title: '参茸',
        type: '参茸',
        action: '',
        page:1,
        data: []
      },
      {
        title: '药品',
        type: '药品',
        action: '',
        page:1,
        data: []
      },
      {
        title: '健康便利品',
        type: '健康便利品',
        action: '',
        page:1,
        data: []
      },
      {
        title: '其他',
        type: '其他',
        page:1,
        action: '',
        data: []
      }
    ],
    tiptxt: ''
  },

  onLoad: function(options) {
		let that = this;
		wx.getSystemInfo({
		  success: (result)=>{
		    let h = 750/result.windowWidth*result.windowHeight;
		    that.setData({
		      scrollHeight: h - 118
		    })
		  }
		});
    util.request(api.setting,{},'POST').then(res=>{
      if(res.errcode===1){
        let data = [];
        res.data.Siebel_voucherProdType.forEach((element,key) => {
          let ac = '';
          if(key==0){
            ac = 'action'
          }
          data.push({
            title: element,
            type: element,
            page:1,
            action: ac,
            data: []
          })
        });
        that.setData({
          navList: data
        })
        this.getList(0,1);
      }
    })
  },
	navChange: function (e) {
		let setdata = e.currentTarget.dataset;
		let index = setdata.index;
		let navlist = this.data.navList;
		let that = this;
		that.setData({
			tiptxt: ''
		})
		navlist.forEach((el,i) => {
			if(i==index){
				el.action = 'action';
			}else{
				el.action = ''
			}
		});
		that.setData({
			navList: navlist
		})
		if(navlist[index].data.length==0){
			that.getList(index,1);
		}
	},
	getList: function (index,page) {
		let data = this.data.navList;
		let type = data[index].type;
		let that = this;
		that.setData({
			tiptxt: '加载中...'
		})
		util.request(api.couponCenter,{type: type,page: page},'POST').then(res=>{
			if(res.errcode===1){
				res.data.forEach(element => {
					data[index].data.push(element)
				});
				data[index].page = page + 1;
				that.setData({
					navList: data
				})
				console.log(data);
				that.setData({
					tiptxt: ''
				})
			}else{
				// wx.showModal({
				//   title: '提示',
				//   content: res.errmsg,
				//   showCancel: false
				// });
				that.setData({
					tiptxt: res.errmsg
				})
			}
		})
	},
	goTop: function (e) {
		let index = e.currentTarget.dataset.index;
		let type = e.currentTarget.dataset.type;
		let that = this;
		let data = that.data.navList;
		data[index].data = [];
		that.setData({
			navList: data
		})
		that.getList(index,1);
	},
	goBottom: function (e) {
		let index = e.currentTarget.dataset.index;
		let type = e.currentTarget.dataset.type;
		let page = this.data.navList[index].page;
		let that = this;
		that.getList(index,page);
	},
	goDetail: function(e){
		// wx.navigateTo({
		//   url: '../detail/detail'
		// });
		let id = e.currentTarget.dataset.id;
		let data = {};
		let sceneId = wx.getStorageSync('GUIDE');
		if(sceneId==''){
			data = {
				voucherId: id
			}
		}else{
			data = {
				voucherId: id,
				sceneId: sceneId
			}
		}
		wx.showLoading({
			mask: true
		});
		util.request(api.chooseCoupon,data,'POST').then(res=>{
			wx.hideLoading();
			wx.showToast({
				title: res.errmsg,
				icon: 'none',
				duration: 2500,
				mask: true,
			});
		})
	},
	goDetailPage: function(e){
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '../detailcenter/detail?id=' + id
		});
	},
	tabMine: function(){
		wx.redirectTo({
			url: '/pages/mine/coupon/mine/mine'
		})
	}
})
