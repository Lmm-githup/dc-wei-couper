//index.js
//获取应用实例setStorageSync
const app = getApp();
const api = require("../../../config/api.js");
const util = require("../../../utils/util.js");
var settimeout = null;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      red_feedback_reply:0,
      red_apply_medicine:0,
      red_chat: 0
    },
		guideMes: {red_chat: 0},
    lv: 'lv2',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    setting: {},
    gzhHidden: true,
    tipwidth: 0,
    gwhidden: true,
    elstips: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goCheckin: function() {
    wx.navigateTo({
      url: '../checkin/checkin'
    });
  },
  goShare: function(){
    wx.navigateTo({
      url: '../share/index/index'
    })
  },
  democlick: function(){
    wx.openOfflinePayView()
  },
  onLoad: function(){
    // 邀请有礼动画
    this.animationTip();
  },
  animationTip: function(){
    let that = this;
    let width = wx.getSystemInfoSync().windowWidth-100;
    let x = width;
    setInterval(() => {
      x = x - 1;
      if(x == (-width)){
        x = width;
        that.setData({
          aniTip: 0
        })
      }
      that.setData({
        tipwidth: x
      })
    }, 20);
  },
  // 判断是否关注关联的公众号
  isGz: function() {
    let data = {
      unionid: wx.getStorageSync('unionid')
    }
    let that = this;
    util.request(api.isGz,data,'POST').then(res=>{
      if(res.errcode==1){
        if(res.attention.follow=='1'){
          that.setData({
            gzhHidden: true
          })
        }else if(res.attention.follow=='0'){
          that.isGzErcode();
        }else{
					wx.showToast({
						title: '获取公众号信息失败,请重新扫码！'
					})
				}
      }else{
        that.isGzErcode();
      }
    }).catch(err=>{
      console.log(err);
			wx.showToast({
				title: '获取公众号信息失败,请重新扫码！'
			})
    })
  },
  // 根据是否是扫码进入小程序来判断公众号组件的显示
  isGzErcode: function () {
    let gzhHidden = true;
    let that = this;
    if(app.globalData.gzhHidden){
      that.setData({
        gzhHidden: gzhHidden
      })
    }else{
      gzhHidden = false
      that.setData({
        gzhHidden: gzhHidden
      })
    }
  },
	getGuide: function () {
		let that = this;
    let url = `https://sms.fjxzj.com/wxscrm/chat/json_tips/${that.data.userInfo.memberId}.json`
    // console.log(url)
		// let url =  'https://sms.fjxzj.com/wxscrm/chat/json_tips/1-2ORO9F.json'
		wx.request({
			url: url,
			success: (res) => {
				// console.log(res.data);
				let gwhidden = true;
				if(that.data.userInfo.GUIDE_ID==''){
				  gwhidden = true
				}else{
				  if(res.data.red_chat==1){
				    gwhidden = true
				  }else{
				    gwhidden = false
				  }
				}
				that.setData({
					gwhidden: gwhidden,
					guideMes: res.data
				})
			}
		})
	},
  dataLeep: function() {
		let that = this;
		that.getGuide();
		if(this.data.userInfo.tiernum > 2){
			settimeout = setInterval(function(){
				that.getGuide();
			},3500)
		}
  },
  onShow: function () {
    let that = this;
    util.request(api.memberinfo,{},"POST").then(res=>{
      let lv = res.userinfo.tiernum;
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
      wx.setStorageSync('GUIDE', res.userinfo.GUIDE_ID);
      that.setData({
        userInfo: res.userinfo,
        lv: 'lv'+lv,
        fjObj: fjObj
      })
      wx.setStorageSync('userInfo', res.userinfo);
      if(res.userinfo.family_card==='Pending'){
        that.isOpenCard(res.userinfo.familyCardNum,res.userinfo.family_invitation_name)
      }
      setTimeout(() => {
        that.guideCoupon(app.globalData.enterType);
      }, 2000);
			// 开启导购反馈和找药轮询
			that.dataLeep();
    })
    // 获取等级值域
    util.request(api.setting,{},'POST').then(res=>{
      if(res.errcode===1){
        that.setData({
          setting: res.data,
          elstips: res.data.tip_invite_gift
        })
        wx.setStorageSync('setting', res.data);
      }
    })
    this.isGz();
  },
	onHide: function () {
		if(this.data.userInfo.titiernum > 2){
			clearInterval(settimeout);
		}
	},
	onUnload: function () {
		if(this.data.userInfo.titiernum > 2){
			clearInterval(settimeout);
		}
	},
  // 判断绑定逻辑
  guideCoupon: function (type) {
    let Guid = this.data.userInfo.GUIDE_ID;
    let that = this;
    switch (type) {
      case 1://绑定导购
        let sceneId = wx.getStorageSync('sceneId');
        wx.removeStorageSync('sceneId');
        if(Guid===''){
          wx.showModal({
            title: '提示',
            content: '您要绑定导购吗？',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
              if(result.confirm){
                that.addGuide(sceneId).then(res=>{
                  wx.showModal({
                    title: '提示',
                    content: res.errmsg,
                    showCancel: true,
                    cancelText: '取消',
                    cancelColor: '#000000',
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                    success: (result) => {
                      if(result.confirm){
                        if(res.errcode==1){
                          wx.setStorageSync('GUIDE', sceneId);
                          that.goGuide()
                        }
                      }
                    }
                  });
                }).catch(err=>{
                  wx.showToast({
                    title: err.errmsg,
                    icon: 'none',
                    duration: 1500,
                    mask: true
                  });
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '您已经绑定导购员，不能重复绑定！',
            icon: 'none',
            duration: 2500,
            mask: true
          });
        }
        break;
      case 2://优惠券
        wx.showModal({
          title: '提示',
          content: '您有优惠券待领取！',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '领取',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              wx.navigateTo({
                url: '../coupon/detail/detail?share=share'
              });
            }else{
              wx.removeStorageSync('sceneId');
              wx.removeStorageSync('voucherId');
              wx.removeStorageSync('voucherScode');
            }
          }
        });
        break;
      default:
        break;
    }
    app.globalData.enterType = 0;
  },
  // 绑定接口对接
  addGuide: function(gid){
    return new Promise((resolve,reject)=>{
      let data = {
        sceneId: gid,
        openid: wx.getStorageSync('openid'),
        unionid: wx.getStorageSync('unionid'),
        phone: wx.getStorageSync('userInfo').phone,
        nickname: wx.getStorageSync('userInfo').name,
        memberId: wx.getStorageSync('userInfo').memberId
      }
      util.request(api.addGuide,data,'POST').then(res=>{
        if(res.errcode===1){
          resolve(res)
        }else{
          reject(res)
        }
      }).catch(err=>{
        reject(err)
      })
    })
  },
  // 判断分享优惠券逻辑
  ifCoupon: function(){
    try {
      let voucherId = wx.getStorageSync('voucherId');
      if(voucherId){
        wx.removeStorageSync('voucherId');
        return voucherId
      }else{
        return ''
      }
    } catch (error) {
      
    }
  },
  goIntegral: function(e){
    let type = e.currentTarget.dataset.type;
    console.log(type)
    wx.navigateTo({
      url: '../../mine/integral/integral?type=' + type
    });
  },
  isOpenCard: function(familyId,name) {
    // util.request(api.CardDetail,{familyCardNum: familyId},'POST').then(res=>{
    //   if(res.errcode===1){
    //   }else{
    //     wx.showToast({
    //       title: res.errmsg,
    //       icon: 'none',
    //       duration: 2500,
    //       mask: true
    //     });
    //   }
    // }).catch(res=>{
    //   console.log(res);
    //   wx.showToast({
    //     title: '家庭卡请求失败！',
    //     icon: 'none',
    //     duration: 2500,
    //     mask: true
    //   });
    // })
    wx.showModal({
      title: '提示',
      content: name + '邀请你加入家庭卡',
      showCancel: true,
      cancelText: '拒绝',
      cancelColor: '#000000',
      confirmText: '前往绑定',
      confirmColor: '#3CC51F',
      success: (result) => {
        let status = ''
        if(result.confirm){
          status = 'Y'
        }else if (result.cancel){
          status = 'N'
        }
        util.request(api.BindCard,{familyCardNum: familyId,status: status},'POST').then(r=>{
          wx.showToast({
            title: r.errmsg,
            icon: 'none',
            duration: 2500,
            mask: true,
            success: function(){
              if(status == 'Y'){
                setTimeout(() => {
                  wx.navigateTo({
                    url: '../../card/index/index'
                  });
                }, 2500);
              }
            }
          });
        })
      }
    });
  },
  goGuide: function(){
    let guide = wx.getStorageSync('GUIDE');
    let that = this;
    if(guide===''){
      wx.showModal({
        title: '提示',
        content: '您还没有绑定专属导购，去扫描一下他的二维码吧！',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '去扫码',
        success: (result) => {
          if(result.confirm){
            that.showScanCode()
          }
        }
      });
    }else{
      wx.navigateTo({
        url: '../guide/guide?id='+ guide
      })
    }
  },
  showScanCode: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    setTimeout(() => {
      wx.hideLoading();
      wx.scanCode({
        onlyFromCamera: false,
        // scanType: ['qrCode','barCode','datamatrix','pdf417'],
        success: (result)=>{
          console.log('扫码的返回，',result)
          if(result.path){
            wx.navigateTo({
              url: '/' + result.path
            });
          }else{
            let url = result.result
            url = '/pages/auth/authorize/authorize?' + url
            wx.navigateTo({
              url: url
            });
          }
        },
        fail: (err)=>{
          console.log('扫码错误，',err)
        }
      });
    }, 500);
  },
  goCoupon:function(){
    wx.navigateTo({
      url: '../coupon/mine/mine'
    });
  },
  goOrder: function(){
    wx.navigateTo({
      url: '../order/index/index'
    });
  },
  goWxCode: function () {
    wx.navigateTo({
      url: '../wxcode/wxcode'
    })
  },
  goRemind: function(){
    wx.navigateTo({
      url: '../../mine/remind/index/index'
    });
  },
  goInformation: function(){
    wx.navigateTo({
      url: '../information/personal/personal'
    });
  },
  goStores: function() {
    wx.navigateTo({
      url: '../stores/index/index',
    });
  },
  goPayCode: function(){
    wx.navigateTo({
      url: '../paycode/paycode'
    });
  },
  goShop: function(){
    // wx.navigateTo({
    //   url: '../integralshop/index/index'
    // });
    wx.navigateToMiniProgram({
      // appId:'wxfba1f2a0082ea7c9',
      // appId: 'wxc886aa55acc9989a',
      appId:'wx9ac6a4ae3519cff4',
      path:'pages/integral-mall/index/index',
      extraData:{},
      envVersion: 'trial',
      success: (result)=>{
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  goFind: function() {
    wx.navigateTo({
      url: '../findmedicine/index/index'
    })
  },
  goFeedback: function () {
    wx.navigateTo({
      url: '../feedback/feedback'
    });
  },
  goCard: function(){
    if(this.data.userInfo.FAMILY_CARD_STATUS==="停用"){
      wx.showModal({
        title: '提示',
        content: '您的家庭卡已停用！',
        showCancel: false,
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F'
      });
      return false;
    }
    if(this.data.userInfo.family_card==="None"){
      wx.showModal({
        title: '提示',
        content: '您还没有开通家庭卡，需要现在开通吗',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.showLoading({
              title: '正在开通',
              mask: true
            });
            util.request(api.openCard,{},'POST').then(res=>{
              wx.hideLoading();
              if(res.errcode===1){
                wx.navigateTo({
                  url: '../../card/index/index'
                });
              }else{
                wx.showToast({
                  title: res.errmsg,
                  icon: 'none',
                  duration: 2500,
                  mask: true
                });
              }
            })
          }
        }
      });
    }else if(this.data.userInfo.family_card==="Family"){
      wx.navigateTo({
        url: '../../card/index/index'
      });
    }else if(this.data.userInfo.family_card==="Self"){
      wx.navigateTo({
        url: '../../card/index/index'
      });
    }
  },
  hvyr: function() {
    wx.navigateTo({ 
      url: '../interests/interests'
    });
  },
  goFindMList: function () {
    wx.navigateTo({
      url: '/pages/mine/findmedicine/searchlog/searchlog'
    });
  },
  goFeedbackList: function () {
    wx.navigateTo({
      url: '/pages/mine/feedback/feedbacklog/feedbacklog'
    });
  },
  goGuideDetail: function () {
    let tip = wx.getStorageSync('userInfo').chat_tip;
    if(this.data.userInfo.tip_health_state == 1){
      wx.showModal({
        title: '提示',
        content: this.data.user.tip_health_phone_chat,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            
          }
        }
      });
      return false;
    }
    if(tip!=''){
      wx.showToast({
        title: tip,
        icon: 'none',
        duration: 1500,
        mask: true
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/H5page/H5page?url=' + 'dgChart'
    });
  }
})
