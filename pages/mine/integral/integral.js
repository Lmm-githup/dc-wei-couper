// pages/mine/integral/integral.js
const api = require("../../../config/api.js");
const util = require("../../../utils/util.js");
var bol = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maintype: 1,
    // scrollHeight: 0,
    jifNUM: 0,
    addList: [],
    reduceList: [],
    allList: [],
    addPage: 1,
    reducePage: 1,
    allPage: 1,
    add: {
      ts: '上拉加载更多数据',
    },
    reduce: {
      ts: '上拉加载更多数据',
    },
    all: {
      ts: '上拉加载更多数据',
    },
    type: "all",
    // typeshow: ['action','','']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    let that = this;
    let jf = wx.getStorageSync('userInfo');
    this.setData({
      maintype: type == "xw"? 2 : 1,
      jifNUM: type == "xw"? jf.BEHAIV_POINTS : jf.SALES_POINTS
    })
    console.log(this.data.maintype)
    console.log(this.data.jifNUM)
    let titletxt = type == "xw"? "行为积分" : "消费积分"
    wx.setNavigationBarTitle({title: titletxt});
    // wx.getSystemInfo({
    //   success: (result)=>{
    //     let h = 750/result.windowWidth*result.windowHeight;
    //     that.setData({
    //       scrollHeight: h - 286
    //     })
    //   }
    // });
    that.getList(1,"all");
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
    let type = this.data.type;
    if(type === 'add'){
      this.setData({
        addList: [],
        add: {
          ts: '数据加载中',
          hidden: false
        }
      })
    }else if(type === 'reduce'){
      this.setData({
        reduceList: [],
        reduce: {
          ts: '数据加载中',
          hidden: false
        }
      })
    }else{
      this.setData({
        allList: [],
        all: {
          ts: '数据加载中',
          hidden: false
        }
      })
    }
    this.getList(1,type);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(bol)
    if (bol) {
      bol = false;
      if (this.data.type === 'add') {
        this.getAddList()
      } else if (this.data.type === 'reduce') {
        this.getReduceList()
      } else {
        this.getAllList()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tabNav: function(e) {
    // 点击页面回到原来的位置
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    let type = e.currentTarget.dataset.type;
    if(type==='add'){//如果是收入
      this.setData({
        // typeshow: ['','action',''],
        type: 'add'
      })
      if(this.data.addList.length==0){
        this.getList(1,'add')
      }
    }else if(type==="reduce"){//如果是支出
      this.setData({
        // typeshow: ['','','action'],
        type: 'reduce'
      })
      if(this.data.reduceList.length==0){
        this.getList(1,'reduce')
      }
    }else{//如果是全部
      this.setData({
        // typeshow: ['action','',''],
        type: 'all'
      })
      if(this.data.allList.length==0){
        this.getList(1,'all')
      }
    }
  },

  getList: function(page,type) {
    let that = this;
    let num = 10;
    let maintype = that.data.maintype;
    if(type=="add"){
      util.request(api.myintegraladd,{page:page,page_size: num,type:maintype},"POST").then(res => {
        if(res.errcode===1){
          let addlist = that.data.addList;
          res.data.forEach(element => {
            addlist.push(element)
          });
          that.setData({
            addList: addlist,
            addPage: page + 1,
            add: {
              ts: res.errmsg,
            }
          })
        }else{
          that.setData({
            add: {
              ts: res.errmsg,
            }
          })
        }
        bol = true
        if(page==1){
          wx.stopPullDownRefresh();
        }
      })
    }else if(type === 'reduce'){
      util.request(api.myintegralreduce,{page:page,page_size: num,type:maintype},"POST").then(res => {
        if(res.errcode===1){
          let reducelist = that.data.reduceList;
          res.data.forEach(element => {
            reducelist.push(element)
          });
          that.setData({
            reduceList: reducelist,
            reducePage: page + 1,
            reduce: {
              ts: res.errmsg,
              hidden: false
            }
          })
        }else{
          that.setData({
            reduce: {
              ts: res.errmsg,
              hidden: false
            }
          })
        }
        bol = true
        if(page==1){
          wx.stopPullDownRefresh();
        }
      })
    }else{
      util.request(api.myintegralall,{page:page,page_size: num,type:maintype},"POST").then(res=>{
        // console.log(res)
        if(res.errcode===1){
          let alllist = that.data.allList;//获取页面的该页面的数据
          res.data.forEach(element => {
            alllist.push(element)//推到alllist中去
          });
          that.setData({
            allList: alllist,
            allPage: page + 1,
            all: {
              ts: res.errmsg,
              hidden: false
            }
          })
        }else{
          that.setData({
            all: {
              ts: res.errmsg,
              hidden: false
            }
          })
        }
        bol = true
        if(page==1){
          wx.stopPullDownRefresh();
        }
      })
    }
  },



  getAddList: function(){
    let page = this.data.addPage;
    this.setData({
      add: {
        ts: '数据加载中...',
      }
    })
    this.getList(page,'add');
  },
  getReduceList: function(){
    let page = this.data.reducePage;
    // console.log(page)
    this.setData({
      reduce: {
        ts: '数据加载中...',
      }
    })
    this.getList(page,'reduce');
  },


  getAllList: function(){
    let page = this.data.allPage;
    // console.log(page)
    this.setData({
      all: {
        ts: '数据加载中...',
      }
    })
    this.getList(page,'all');
  }
})