var user = require('../../../utils/user.js');
var util  = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
var appOptions = {};
// 取出链接中特定的参数值opentype
function getQueryString(name,str) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  // var r = window.location.search.substr(1).match(reg);
	var r = str.match(reg);
  if (r != null) {
    return unescape(r[2]); 
  } else { 
    return null;
  }
}
// 将连接中的参数转成对象
function parseQueryString(url) {
		var obj = {};
		var keyvalue = [];
		var key = "",
				value = "";
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		for (var i in paraString) {
				keyvalue = paraString[i].split("=");
				key = keyvalue[0];
				value = keyvalue[1];
				obj[key] = value;
		}
		return obj;
}
// 扫码判断链接
function checkScan(that){
	wx.showLoading({
		title: '加载中...'
	});
  wx.scanCode({
    onlyFromCamera: false,
    success: (res)=>{
			wx.hideLoading();
      console.log(res.path);
      if(res.path == undefined){
        wx.showModal({
          title: '提示',
          content: '二维码解析失败，请重试！',
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if(result.confirm){
              checkScan(that)
            }
          }
        });
        return false;
			}else{
				// 截取链接中的参数
				csOptions(res.path,that)
			}
    },
    fail: (err)=>{
			console.log(err);
			wx.showToast({
				title: err.errMsg
			})
		}
  });
}
// 处理识别的参数信息（url为路径链接）
function csOptions(url,that){
	let options = parseQueryString(url);
	let type = 0;
	if(Object.keys(options).length==0){//如果连接中的参数属性的长度是0的话
	  type = 0;
	}
	app.globalData.firstdata.data = JSON.stringify(options);//把全局的识别参数赋值
	if(options.scene){//如果有场景值
	  const sc = decodeURIComponent(options.scene)
	  // sid=123&vid=123&ivt=123
	  if(getQueryString('ivt',sc)!=null){
	    wx.setStorageSync('inviter', getQueryString('ivt',sc));
			appOptions.inviter = getQueryString('ivt',sc)
	    type = 3;
	  }
	  if(getQueryString('inviter',sc)!=null){
	    wx.setStorageSync('inviter', getQueryString('inviter',sc));
			appOptions.inviter = getQueryString('inviter',sc)
	    type = 3;
	  }
		if(getQueryString('sid',sc)!=null){
		  wx.setStorageSync('sceneId', getQueryString('sid',sc));
			appOptions.sceneId = getQueryString('sid',sc)
		  type = 1;
		}
		if(getQueryString('sno',sc)!=null){
		  wx.setStorageSync('storeNo', getQueryString('sno',sc));
			appOptions.storeNo = getQueryString('sno',sc);
		  type = 4;
		}
	} 
	if(options.sceneId){//如果有scenid
	  wx.setStorageSync('sceneId', options.sceneId);
		appOptions.sceneId = options.sceneId;
	  if(options.voucherId){
	    wx.setStorageSync('voucherId', options.voucherId);
	    wx.setStorageSync('voucherScode', options.voucherScode);
			appOptions.voucherId = options.voucherId;
			appOptions.voucherScode = options.voucherScode;
	    type = 2
	  }else{
	    type = 1
	  }
	} 
	if(options.sid){
	  wx.setStorageSync('sceneId', options.sid);
		appOptions.sceneId = options.sid;
	  if(options.vid){
	    wx.setStorageSync('voucherId', options.vid);
	    wx.setStorageSync('voucherScode', options.vsc);
			appOptions.voucherId = options.vid;
			appOptions.voucherScode = options.vsc;
	    type = 2
	  }else{
	    type = 1
	  }
	} 
	if(options.inviter){
	  type = 3;
	  wx.setStorageSync('inviter', options.inviter);
		appOptions.inviter = options.inviter;
	} 
	if(options.ivt){
	  type = 3;
	  wx.setStorageSync('inviter', options.ivt);
		appOptions.inviter = options.ivt;
	} 
	if(options.storeNo){
	  type = 4;
	  wx.setStorageSync('storeNo', options.storeNo);
		appOptions.storeNo = options.storeNo;
	} 
	if(options.sno){
	  type = 4;
	  wx.setStorageSync('storeNo', options.sno);
		appOptions.storeNo = options.sno;
	}
	console.log("type is ",type)
	that.setData({
	  openType: type
	})
	that.setType(false,type);
}



Page({
  data: {
    // check:'block',
    checked: true,
    pageShow: true,
    // 0表示无参数 1表示绑定导购 2表示优惠券 3表示 分享有礼 4表示办卡门店
    openType: 0,
		alert: 'none'
  },
  // check:function(){
  //  this.setData({
  //    check:'none'
  //  })
  // },
	showAlert: function(){
    var that = this
    if(that.data.checked){
      that.setData({
        alert: 'flex'
      })
    }else{
      wx.showModal({
        title: '服务协议',
        content: '请阅读并同意服务协议！',
        showCancel: false
      })
    }
	},
	exitAlert: function(){
		this.setData({
			alert: 'none'
		})
	},
  onLoad: function(options){
    // console.log(options)
    let that = this;
    let type = 0;
    let onequery = app.globalData.query; // 微信启动时获取的参数(没有参数就是空{})
    app.globalData.query = 0; // 微信启动时获取的参数-只解析一次 通过app.globalData.query判断
    if(onequery!==0){//如果启动的时候有参数
      if(Object.keys(onequery).length!=0){//并且参数属性长度不为0(如果没有参数就是一个空｛｝)
        options = onequery;
      }
    }
    if(Object.keys(options).length==0){//参数属性长度为0的话type = 0说明是没有任何参数
      type = 0;
    }
		app.globalData.firstdata.data = JSON.stringify(options);//首次进入小程序的参数
    console.log(app.globalData.firstdata.data)//我是门店进入的我的参数是{storeNo:"123"}
    // console.log(options)
    if(options.scene){//此时这里应该不会出现场景值
      const sc = decodeURIComponent(options.scene)//进行解码
      // sid=123&vid=123&ivt=123
      if(getQueryString('ivt',sc)!=null){
        wx.setStorageSync('inviter', getQueryString('ivt',sc));
				appOptions.inviter = getQueryString('ivt',sc)
        type = 3;
      }
      if(getQueryString('inviter',sc)!=null){
        wx.setStorageSync('inviter', getQueryString('inviter',sc));
				appOptions.inviter = getQueryString('inviter',sc)
        type = 3;
      }
			if(getQueryString('sid',sc)!=null){
			  wx.setStorageSync('sceneId', getQueryString('sid',sc));
				appOptions.sceneId = getQueryString('sid',sc)
			  type = 1;
			}
			if(getQueryString('sno',sc)!=null){
			  wx.setStorageSync('storeNo', getQueryString('sno',sc));
				appOptions.storeNo = getQueryString('sno',sc);
			  type = 4;
			}
    } 
    if(options.sceneId){//若是是分享券里进来的｛"scenId":"123","voucherId":"456","voucherScode":"789"｝
      wx.setStorageSync('sceneId', options.sceneId);//就储存scenid
			appOptions.sceneId = options.sceneId;//appOptions对象里面页添加scenid
      if(options.voucherId){//如果有voucherid的话
        wx.setStorageSync('voucherId', options.voucherId);//就储存voucherid
        wx.setStorageSync('voucherScode', options.voucherScode);//就储存voucherScode
        appOptions.voucherId = options.voucherId; //appOptions对象里面页添加voucherId
        appOptions.voucherScode = options.voucherScode//appOptions对象里面页添加voucherScode
        type = 2
      }else{
        type = 1
      }
    } 
    if(options.sid){
      wx.setStorageSync('sceneId', options.sid);
			appOptions.sceneId = options.sid;
      if(options.vid){
        wx.setStorageSync('voucherId', options.vid);
        wx.setStorageSync('voucherScode', options.vsc);
				appOptions.voucherId = options.vid;
				appOptions.voucherScode = options.vsc;
        type = 2
      }else{
        type = 1
      }
    } 
    if(options.inviter){//测试分享
      type = 3;
      wx.setStorageSync('inviter', options.inviter);
			appOptions.inviter = options.inviter;
    } 
    if(options.ivt){
      type = 3;
      wx.setStorageSync('inviter', options.ivt);
			appOptions.inviter = options.ivt;
    } 
    if(options.storeNo){//门店进入的type是4
      type = 4;
      wx.setStorageSync('storeNo', options.storeNo);
			appOptions.storeNo = options.storeNo;
    } 
    if(options.sno){
      type = 4;
      wx.setStorageSync('storeNo', options.sno);
			appOptions.storeNo = options.sno;
    }
    console.log("type is ",type)
    that.setData({
      openType: type//把type存到该页面栈中
    })
    // 判断登录状态就是判断是否有token，如果登录跳转主页，如未登录，显示组件
    user.checkLogin().then(res => {
      if(res){//这里是已经登录过的状态就直接跳转主页面
        that.setType(true,that.data.openType);//直接跳转首页
				let data = appOptions;
				data.openid = wx.getStorageSync('openid');//获取openid
				data.unionid = wx.getStorageSync('unionid');//获取unionid
				util.request(api.queryoauth,data,'GET').then(r=>{//查询会员的情况
					console.log('登陆状态下调用queryoauth上传参数',r);
				}).catch(e=>{
					console.log('登陆状态下调用queryoauth上传参数',e);
				})
      }
    }).catch(() => {
      // 非登录状态-显示按钮
      console.log("---------------我是checkLogin没有验证成功---------------")
      this.setData({
        pageShow: false
      })
      wx.setNavigationBarTitle({
        title: '微信授权'
      });
    });
  },
  onReady: function () {
  },

  getUserInfo: function(res){
    let that = this;
		that.exitAlert();
    // console.log(res)
    if(!res.detail.userInfo){//如果没有用户的信息就返回false
      return false;
    }
    wx.showLoading({
      title: '正在授权...',
      mask: true
    });
    wx.setStorageSync('userInfo', res.detail.userInfo);//把用户信息存到本地
    // console.log(res.detail.userInfo)//这里的nickName是大写
    // 调用微信登录获取code换取openid
    user.loginByWeixin(res.detail).then(res => {
			let data = appOptions;
			data.openid = res.data.openId;//这里获取到了openid
			data.unionid = res.data.unionId;//这里获取到了unionid
      // let data = {
      //   openid: res.data.openId,
      //   unionid: res.data.unionId
      // }
      // 获得openid后，请求接口，判断是否是会员
      util.request(api.queryoauth,data,'GET').then(r=>{
        wx.hideLoading();
        console.log(r)
        if(r.errcode===1){//用户是会员
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
					}
          wx.setStorageSync('token', r.userinfo.token);//判断用户是否存在会得到token
          wx.setStorageSync('GUIDE', r.userinfo.GUIDE_ID);
          that.setType(true,that.data.openType);//用户存在直接跳转首页
        } else if (r.errcode === 0) { // 用户不是会员
					if((app.globalData.scene==1011)||(app.globalData.scene==1047)){//如果场景值是1011和1047的话
						wx.showModal({
							title: '提示',
							content: '未能识别导购门店等信息，请选择继续注册还是重新扫码获取？',
							cancelText: '继续注册',
							confirmText: '重新扫码',
							success:function(res){
								if(res.confirm){
									checkScan(that)//重新扫码
								}else if (res.cancel) {
									that.setType(false,that.data.openType);//跳转到绑定用户手机让他成为会员
								}
							}
						})
					}else{
						that.setType(false,that.data.openType);//就让他跳转到获取手机号成为会员的页面
					}
        }else{
          console.log(r);//返回求情接口参数失败的信息
          wx.hideLoading();
          wx.showToast({
            title: r.errmsg,
            icon: 'none',
            duration: 200,
            mask: true
          });
        }
      }).catch(err=>{//返回请求接口promise的是失败信息
        console.log(err);
        wx.showToast({
          title: err.errmsg,
          icon: 'none',
          duration: 200,
          mask: true
        });
      })
    }).catch(err=>{//返回微信登录promise的失败信息
      console.log(err);
      wx.showToast({
        title: err.errmsg,
        icon: 'none',
        duration: 200,
        mask: true
      });
    })
  },
  setType: function(status,type){
    // 会员存在
    if(status){
      switch (type) {
        case 0://无参数
          wx.switchTab({
            url: "/pages/mine/index/index"
          });
          break;
        case 1: //表示绑定导购
          app.globalData.enterType = 1;
          wx.showLoading({
            title: '处理中...',
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result)=>{
              setTimeout(() => {
                wx.switchTab({
                  url: "/pages/mine/index/index",
                  success: function(){
                    wx.hideLoading();
                  }
                });
              }, 1500);
            }
          });
          break
        case 2: //表示优惠券
          app.globalData.enterType = 2;
          wx.showLoading({
            title: '处理中...',
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result)=>{
              setTimeout(() => {
                wx.switchTab({
                  url: "/pages/mine/index/index",
                  success: function(){
                    wx.hideLoading();
                  }
                });
              }, 1500);
            }
          });
          break
        case 3: //表示分享有礼
          app.globalData.enterType = 3;
          wx.showLoading({
            title: '您已经是会员了！',
            icon: 'none',
            duration: 1500,
            mask: true,
            success: ()=>{
              setTimeout(() => {
                wx.switchTab({
                  url: "/pages/mine/index/index"
                });
              }, 1500);
            },
          });
          break
        case 4: //门店导入
          wx.switchTab({
            url: "/pages/mine/index/index"
          });
          break;
        default:
          break;
      }
    }else{
      // 会员不存在
      switch (type) {
        case 0://无参数
          wx.navigateTo({
            url: '../loginType/loginType'
          });
          break;
        case 1: //表示绑定导购
          app.globalData.enterType = 1;
          wx.navigateTo({
            url: '../loginType/loginType'
          });
          break
        case 2: //表示优惠券
          app.globalData.enterType = 2;
          wx.navigateTo({
            url: "../loginType/loginType"
          });
          break
        case 3: //表示分享有礼
          // wx.navigateTo({
          //   url: "../../mine/share/sharepage/sharepage"
          // });
          app.globalData.enterType = 3;
          wx.navigateTo({
            url: "../loginType/loginType"
          });
          break
        case 4: //表示办卡门店
          app.globalData.enterType = 4;
          wx.navigateTo({
            url: "../loginType/loginType"
          });
          break
        default:
          break;
      }
    }
  },
  agreementBtn: function () {
    this.setData({
      checked: !this.data.checked
    })
  },
  // 跳转协议内容
  agreementContent: function () {
    wx.navigateTo({
      url: '../agreementContent/agreementContent',
    })
  }
})