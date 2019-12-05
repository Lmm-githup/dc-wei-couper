var user = require('../../../utils/user.js');
var util  = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
// 将链接中的参数提取出来
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
// 扫码判断链接
function checkScan(str){
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
          content: '请扫描正确的二维码',
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if(result.confirm){
              checkScan(str)
            }
          }
        });
        return false;
			}else{
				if(res.path.indexOf(str) == -1){
					wx.showModal({
						title: '提示',
						content: '请扫描正确的二维码',
						showCancel: false,
						confirmText: '确定',
						success: (result) => {
							if(result.confirm){
								checkScan(str)
							}
						}
					});
				}else{
					if(res.path.indexOf('?') != -1){
						// 截取链接中的参数
						let cs = res.path.slice(res.path.indexOf('?'));
						wx.reLaunch({
							url: '/pages/auth/authorizeNew/authorize' + cs
						})
						console.error('/pages/auth/authorizeNew/authorize' + cs)
					}
				}
			}
    },
    fail: (err)=>{
			console.log(err);
			wx.showToast('无法打开摄像头进行扫码！')
		}
  });
}
// 将对象拼接成字符串
function Obj2Url(url,obj){
  let cj = '?';
  for (const key in obj) {
    cj = cj + key + '=' + obj[key] + '&'
  }
  cj = cj.slice(0,(cj.length-1))
  return url + cj
}
Page({
  data: {
    pageShow: true
  },
  onLoad: function(options){
    // 微信启动时获取的参数
    // let onequery = app.globalData.query;
    // 微信启动时获取的参数-只解析一次 通过app.globalData.query判断
    // app.globalData.query=0;
    // if(onequery!==0){
    //   if(Object.keys(onequery).length!=0){
    //     options = onequery;
    //   }
    // }
    if(Object.keys(options).length==0){
      // 如果解析的参数为空，则重新进入扫码
      wx.showModal({
        title: '提示',
        content: '二维码解析失败，请重新扫码',
        showCancel: false,
        confirmText: '扫一扫',
        success: (result) => {
          if(result.confirm){
            // checkScan("pages/auth/guideenter")
            checkScan("pages/auth/authorize/authorize")
          }
        }
      });
      return false;
    }else{
      let url = Obj2Url('/pages/auth/authorizeNew/authorize',options);
			console.error('this is demo',url)
      wx.reLaunch({
        url: url
      })
    }
  }
})