const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
var dateTimePicker = require('../../../utils/picker.js');
function getXQ(dateStr){
  var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
  return(weekDay[myDate.getDay()]); 
}
function getNowTime(){
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var week = getXQ((year + '-' + month + '-' + day));
  if(day<10){
    day = '0' + day
  }
  if(month<10){
    month = '0' + month
  }
  if(hour<10){
    hour = '0' + hour
  }
  if(minute<10){
    minute = '0' + minute
  }
  if(second<10){
    second = '0' + second
  }
  return year + '年' + month + '月' + day + '日 ' + week + ' ' + hour + ':' + minute + ':' + second;
}
function getNowTimeType(){
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var week = getXQ((year + '-' + month + '-' + day));
  return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
}
function getAge(birthday)
{
    //出生时间 毫秒
    var birthDayTime = new Date(birthday).getTime(); 
    //当前时间 毫秒
    var nowTime = new Date().getTime(); 
    //一年毫秒数(365 * 86400000 = 31536000000)
    return Math.ceil((nowTime-birthDayTime)/31536000000);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headIMG:'',
    realtime: '',
    timetxt: '',
    bmi:{
      title: 'BMI检测',
      form:{},
      hidden: false
    },
    glu:{
      title: '血糖检测',
      form:{
        type: 'fasting'
      },
      hidden: true
    },
    gluIsDis: false,
    bp:{
      title: '血压检测',
      form:{},
      hidden: true
    },
    //调动组件代码
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
    //调动组件代码结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    let bmi = this.data.bmi;
    let glu = this.data.glu;
    let bp = this.data.bp;
    let title = '';
    let user = wx.getStorageSync('userInfo');
    let age = 0;
    if(user.birth==''){
      age = 0
    }else{
      age = getAge(user.birth)
    }
    this.setData({
      userInfo: user,
      age: age,
      timetxt: getNowTime(),
      realtime: getNowTimeType()
    })
    if(type=="bmi"){
      bmi.hidden = false;
      glu.hidden = true;
      bp.hidden = true;
      title = "BMI检测"
    }
    if(type=="glu"){
      glu.hidden = false;
      bmi.hidden = true;
      bp.hidden = true;
      title = "血糖检测"
    }
    if(type=="bp"){
      glu.hidden = true;
      bmi.hidden = true;
      bp.hidden = false;
      title = "血压检测"
    }
    this.setData({
      bmi: bmi,
      glu: glu,
      bp: bp,
      type: type
    })
    wx.setNavigationBarTitle({
      title: title
    });

    // 调动组件代码
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
    // 调动组件代码结束
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeHeight: function (e) {
    let bmi = this.data.bmi;
    bmi.form.height = e.detail.value;
    this.setData({
      bmi: bmi
    })
  },
  changeWeight: function (e) {
    let bmi = this.data.bmi;
    bmi.form.weight = e.detail.value;
    this.setData({
      bmi: bmi
    })
  },
  ssyChange: function (e) {
    let bp = this.data.bp;
    bp.form.systolic = e.detail.value;
    this.setData({
      bp: bp
    })
  },
  szyChange: function (e) {
    let bp = this.data.bp;
    bp.form.diastolic = e.detail.value;
    this.setData({
      bp: bp
    })
  },
  bindTimeChange: function (e) {
    console.log(e.detail.value);
  },
  fastingChange: function (e) {
    let glu = this.data.glu;
    glu.form.fasting = e.detail.value;
    this.setData({
      glu: glu
    })
  },
  twohoursChange: function (e) {
    let glu = this.data.glu;
    glu.form.twohours = e.detail.value;
    this.setData({
      glu: glu
    })
  },
  radioChange: function(e){
    console.log(e);
    if(e.detail.value==='fasting'){
      this.setData({
        gluIsDis: false
      })
    }
    if(e.detail.value==='twohours'){
      this.setData({
        gluIsDis: true
      })
    }
  },
  formSub: function (){
    let type = this.data.type;
    let datetime = this.data.realtime;
    let data = {}
    if(type=="bmi"){
      data = this.data.bmi.form
    }
    if(type=="bp"){
      data = this.data.bp.form
    }
    if(type=="glu"){
      data = this.data.glu.form;
      if(this.data.gluIsDis){//gluIsDis属性是血糖检测，选择的饭前/饭后
        delete data.fasting
      }else{
        delete data.twohours
      }
    }
    data.datetime = datetime;
    data.type = type;
    wx.showLoading({
      title: '数据正在提交',
      mask: true
    });
    util.request(api.monitorSave,data,'POST').then(res=>{
      wx.hideLoading();
      wx.showToast({
        title: res.errmsg,
        icon: 'none',
        duration: 2000,
        mask: true,
        success: (result)=>{
         setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          });
         },2000) 
        }
      });
    }).catch(err=>{
      wx.hideLoading();
    })
  },

  // 组件代码开始
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
   const that=this;
    console.log("打印时间", this.data.dateTimeArray);
    
    this.setData({ dateTime: e.detail.value });
 
    console.log("打印时间", this.data.dateTime);
 
    var aaa1 = that.data.dateTime[0];
    var aaa2 = that.data.dateTime[1];
    var aaa3 = that.data.dateTime[2];
    var aaa4 = that.data.dateTime[3];
    var aaa5 = that.data.dateTime[4];
    var aaa6 = that.data.dateTime[5];
 
 
    var time1 = that.data.dateTimeArray[0][aaa1];
    var time2 = that.data.dateTimeArray[1][aaa2];
    var time3 = that.data.dateTimeArray[2][aaa3];
    var time4 = that.data.dateTimeArray[3][aaa4];
    var time5 = that.data.dateTimeArray[4][aaa5];
    var time6 = that.data.dateTimeArray[5][aaa6];
    var time = time1 + '/' + time2 + '/' + time3 + ' ' + time4 + ':' + time5 + ':' + time6;
    var timetxt = time1 + '年' + time2 + '月' + time3 + '日 ' + getXQ(time1+'-'+time2+'-'+time3) + ' ' + time4 + ':' + time5 + ':' + time6;
    console.log(time);
    that.setData({
      realtime: time,
      timetxt: timetxt
    })
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
 
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
 
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
 
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
 
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  }

  // 组件代码结束
})