Page({
  data:{},
  onLoad: function(){
  },
  goDetail: function(){
    wx.navigateToMiniProgram({
      // appId:'wxfba1f2a0082ea7c9',
      appId: 'wxc886aa55acc9989a',
      path:'pages/index/index',
      extraData:{},
      envVersion:'release',
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