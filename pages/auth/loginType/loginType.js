var user = require('../../../utils/user.js');
var app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var btnisuse = true;

Page({
  data:{
    sceneId: '',
    voucherId: '',
    voucherScode: '',
    demoHidden: true,
		alert: 'none',
    // checked:false
  },
  onLoad: function(){
    try {
      let sceneId = wx.getStorageSync('sceneId')
      if (sceneId) {
        this.setData({
          sceneId: sceneId
        })
      }
    } catch (e) {
      this.setData({
        sceneId: false
      })
    };
    try {
      let voucherId = wx.getStorageSync('voucherId')
      if (voucherId) {
        this.setData({
          voucherId: voucherId
        })
      }
    } catch (e) {
      this.setData({
        voucherId: false
      })
    }
    this.isDemoHidden();
  },
  isDemoHidden: function(){//获取等级值域
    util.request(api.setting,{},"POST").then(res=>{//测试号登录
      // console.log(res)
      if(res.errcode===1){
        let status = true;
        if(res.data.mini_review_login=='1'){
          status = true
        }else{
          status = false
        }
        this.setData({
          demoHidden: !status
        })
      }
    })
  },


  loginByWx: function(res) {
		this.exitAlert()
    console.log(res.detail.encryptedData)
    if(res.detail.encryptedData==undefined){//获取手机失败
      let tiplog = res.detail.errMsg;
      // 把失败信息在服务器打印
      util.request(api.writeLog,{phoneErr: tiplog},"POST").then(log=>{
        console.log(log.errmsg);
      })
      wx.showToast({
        title: '获取手机号失败，请重新点击',icon: 'none',duration: 2000,mask: true
      });
      return false;
    }
		if(!btnisuse){
			return false;
		}
		btnisuse = false;
    let data = {
      encryptedData: res.detail.encryptedData,
      iv: res.detail.iv,
      session_key: wx.getStorageSync('session_key')//在我要登录页面就的loginByWeixin里储存了session_key
    }
    let that = this;
    wx.showLoading({
      title: '正在绑定..',
      mask: true
    });
    util.request(api.getPhoneNumber,data,'POST').then(res=>{//获取手机号
      if(res.errcode!=1){
				btnisuse = true;
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2000,
          mask: true
        });
        return false;
      }
      // 获取手机号码之后，调用接口进行绑定
      let sexs = '';//获取到性别
      if(wx.getStorageSync('userInfo').gender){
        if(wx.getStorageSync('userInfo').gender==1){
          sexs = '男'
        }
        if(wx.getStorageSync('userInfo').gender==2){
          sexs = '女'
        }
        if(wx.getStorageSync('userInfo').gender==0){
          sexs = ''
        }
      }
      let name_d = wx.getStorageSync('userInfo').nickName;//获取到名字
      if (name_d.replace(/[ ]/g, '') == '') {
        name_d = '无'
      }
      let data = {
        phone: res.data.phoneNumber,//获取到手机号
        openid: wx.getStorageSync('openid'),//获取到openid在我要登录的loginByWeixin已经储存
        unionid: wx.getStorageSync('unionid'),//获取到unionid在我要登录的loginByWeixin已经储存
        name: name_d,//获取到名字
        nickName: name_d,//获取到名字
        headimgurl: wx.getStorageSync('userInfo').avatarUrl,//在用户信息中获取到头像
        sex: sexs,//获取到性别
        registered_type: 0
      }
      let tis = "";
      if(app.globalData.enterType===1){//绑定的type
        app.globalData.enterType = 0;
        data.sceneId = wx.getStorageSync('sceneId');
        data.registered_type = 1;
        tis = '手机绑定成功！导购员绑定成功！'
      }else if(app.globalData.enterType===4){
        app.globalData.enterType = 0;
        data.storeNo = wx.getStorageSync('storeNo');
        data.registered_type = 4;
        tis = "手机绑定成功！门店绑定成功！"
      }else if(app.globalData.enterType===3){
        app.globalData.enterType = 0;
        data.inviter = wx.getStorageSync('inviter');
        data.registered_type = 3;
        tis = "您已绑定成功，并获取相应的奖励！"
      }else{
        if((app.globalData.scene==1011)||(app.globalData.scene==1047))
        data.registered_type = 2;//扫小程序码和二维码
        tis = "手机绑定成功！"
      }
      util.request(api.register,data,"POST").then(r=>{//绑定手机号
        wx.hideLoading();
				btnisuse = true;
				console.log(data);
        wx.removeStorageSync('storeNo');
        if(r.errcode===1){//绑定手机号会员成功
					// 用来打印用户注册时的数据
					app.globalData.firstdata.phone = data.phone;//把绑定手机号放到app.js里
					let logdata = JSON.stringify(app.globalData.firstdata);
					util.request(api.writeLog,{registerLog: logdata},"POST").then(log=>{//打印信息
					  console.log(log.errmsg);
					})// 用来打印用户注册时的数据结束
          wx.setStorageSync('token', r.userinfo.token);//存储token
          // 判断注册的用户的类型-pending_guide
          if(r.pending_guide==0){
            wx.removeStorageSync('sceneId');
          }else if(r.pending_guide==1){
            app.globalData.enterType = 1;
          }
					if(r.userinfo.token==''){
						wx.showModal({
						  title: '提示',
						  content: "token为空，请重新登录",
						  showCancel: false,
						  success: (result) => {
						    if(result.confirm){
						      wx.navigateTo({
						        url: '/pages/auth/authorize/authorize'
						      });
						    }
						  }
						});
					}else{
            wx.switchTab({
              url: '/pages/mine/index/index'//改为直接跳转至首页
            });
						// wx.showModal({
						//   title: '提示',
						//   // content: tis,
						//   content: r.errmsg,
						//   showCancel: false,
						//   confirmText: '确定',
						//   success: (result) => {
						//     if(result.confirm){
						//       wx.switchTab({
						//         url: '/pages/mine/index/index'
						//       });
						//     }
						//   }
						// });
					}
        }else{
          wx.showToast({
            title: r.errmsg,
            icon: 'none',
            duration: 2500,
            mask: true
          });
        }
      }).catch(err=>{
        console.error(err);
				btnisuse = true;
      })
     }).catch(err=>{
			console.error(err);
			btnisuse = true;
		})
  },
  // loginByphone: function(){
  //   wx.navigateTo({
  //     url: '../loginByPhone/loginByPhone'
  //   });
  // },
	// showAlert: function(){
  //   let that = this
    // if(that.data.checked){
      // that.setData({
      //   alert: 'flex'
      // })
    // }else{
      // wx.showModal({
      //   title: '服务协议',
      //   content: '请阅读并同意服务协议！',
      //   showCancel:false
      // })
    // }
	// }, 
	exitAlert: function(){
		this.setData({
			alert: 'none'
		})
	},
  loginByDemophone: function(){
    // wx.navigateTo({
    //   url: '/pages/auth/loginByDemoPhone/loginByPhone'
    // });
    let phone = 18363955992;
    util.request(api.demoPhoneLogin,{phone:phone},"POST").then(r=>{
      if(r.errcode==1){
        wx.setStorageSync('token', r.userinfo.token);
        wx.setStorageSync('userInfo', r.userinfo);
        wx.setStorageSync('openid', r.userinfo.openid);
        wx.setStorageSync('GUIDE', r.userinfo.GUIDE_ID);
        wx.setStorageSync('GUIDE', r.userinfo.GUIDE_ID);
        wx.switchTab({
          url: "/pages/mine/index/index"
        });
      }else{
        wx.showToast({
          title: r.errmsg,
          icon: 'none',
          duration: 2500,
          mask: true,
        });
      }
    })
  },
  // agreementBtn:function(){
  //   this.setData({
  //     checked:!this.data.checked
  //   })
  // },
  // 跳转协议内容
  // agreementContent:function(){
  //   wx.navigateTo({
  //     url: '../agreementContent/agreementContent',
  //   })
  // }
})