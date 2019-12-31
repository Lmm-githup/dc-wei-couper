Page({
  data:{},
  onLoad: function(){
  },
  goDetail: function(){
    wx.navigateToMiniProgram({
      // appId:'wxfba1f2a0082ea7c9',
      appId: 'wx9ac6a4ae3519cff4',//德成的微商城
      // appId: 'wxc886aa55acc9989a',//这是康百家的
      path:'pages/index/index',
      extraData:{},
      envVersion:'trial',
      success: (result)=>{
        console.log("送药到家成功,",result)
      },
      fail: (err)=>{
        console.log("送药到家错误,",err)
      },
      complete: ()=>{}
    });
  }
})