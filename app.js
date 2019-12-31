var user = require('./utils/user.js');
var api = require("./config/api.js");
var util = require("./utils/util.js");
App({
  onLaunch: function (options) {
    const updateManager = wx.getUpdateManager();
    wx.getUpdateManager().onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    // 先判断版本号
    const version = wx.getSystemInfoSync().SDKVersion;
    if (user.compareVersion(version, '2.0.0') < 0) {
      wx.showModal({
        title: '提示',
        content: '您当前的微信版本过低，可能会导致部分功能无法正常使用，请升级到最新微信版本后重试。'
      })
    }
    // 判断版本号结束
    const op = options;
    console.log(op);
    let data = {
      path: op.path,//前台切入页
      scene: op.scene,//场景值
      query: JSON.stringify(op.query),//携带参数
      shareTicket: op.shareTicket,//群发票据
      referrerInfo: op.referrerInfo//从另一个小程序公众号或app进入的返回值
    };
		this.globalData.firstdata.path = op.path;//首次进入页面的路径
    util.request(api.scanlog,data,'POST').then(res=>{
      console.log(res.errmsg);
    })
    this.globalData.scene = op.scene;//把场景值存起来
    this.globalData.query  = op.query;//小程序启动获取的参数
    switch (op.scene) {
      case 1011:
        // 扫描二维码
        this.globalData.gzhHidden = true;
        break;
      case 1047:
        // 扫描小程序码
        this.globalData.gzhHidden = false;
        break;
      case 1089:
        // 顶部菜单 最近使用
        this.globalData.gzhHidden = true;
        break;
      case 1038:
        // 从小程序返回
        this.globalData.gzhHidden = true;
        break;
      default:
        this.globalData.gzhHidden = true;
        break;
    }
  },
  onShow: function (options) {
    user.checkLogin().then(res => {
      this.globalData.hasLogin = true;
    }).catch(() => {
      this.globalData.hasLogin = false;
    });
  },
  globalData: {
    hasLogin: false,
    gzhHidden: true,
    enterType: 0,
    scene: 0,
    // 小程序启动时获取的参数
    query: 0,
		// 用来打印用户注册时的数据
		firstdata: {
			path: '',// 首次进入的页面路径
			data: '',// 识别的参数
			phone: ''// 用户注册的phone
		}
  }
})