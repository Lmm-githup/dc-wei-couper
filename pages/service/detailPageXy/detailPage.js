import * as echarts from '../../../config/ec-canvas/echarts';
function setOption(chart,data) {
  var option = {
    backgroundColor: "rgba(0,0,0,0)",
    series: [{
      type: 'gauge',
      radius: '90%',
      startAngle: 170,
      endAngle: 10,
      splitLine: {
        show: false
      },
      axisTick:{
        show: false
      },
      axisLabel: {
        show: false
      },
      detail: {
        show: false
      },
      pointer:{
        width: 5
      },
      title:{
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          width: 15,
          shadowBlur: 0,
          // 上面收缩压
          color: [
                  [0.45,'#6fcb8a'],
                  [0.7,'#52a651'],
                  [1,'#f6ad5e']
                ]
        }
      },
      data: [{
        value: data.systolic,
      }]

    },
    {
      type: 'gauge',
      radius: '90%',
      startAngle: 350,
      endAngle: 190,
      splitLine: {
        show: false
      },
      axisTick:{
        show: false
      },
      axisLabel: {
        show: false
      },
      detail: {
        show: false
      },
      pointer:{
        width: 5
      },
      title:{
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          width: 15,
          shadowBlur: 0,
          // 下面舒张压
          color: [
                  [0.5,'#6fcb8a'],
                  [0.75,'#52a651'],
                  [1,'#f6ad5e']
                ]
        }
      },
      data: [{
        value: data.diastolic,
      }]

    },
    ]
  };
  chart.setOption(option);
}
function setLineOption(chart,dataX,dataY) {
  var option = {
    xAxis: {
      type: 'category',
      data: dataX
    },
    yAxis: {
        type: 'value'
    },
    series: dataY
  };
  chart.setOption(option);
}
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
const color = ['#6fcb8a','#52a651','#f6ad5e','#e45239'];
const xycolor = [
                  [0.47,'#6fcb8a'],
                  [0.72,'#52a651'],
                  [1,'#f6ad5e']
                ];
const bminuil = 'Kg/m²';
var mid = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    ecline: {
      lazyLoad: true
    },
    type: '',
    user:{},
    headerdate: '',
    listData:[],
    topData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: wx.getStorageSync('userInfo')
    })
    if(options.mid){
      mid = options.mid
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let onda = {type:'bp',page:1};
    this.oneComponent = this.selectComponent('#mychart-dom-gauge');  
    this.twoComponent = this.selectComponent('#mychart-dom-line');  
    if(mid!=''){
      onda.MEM_ID = mid
    }
    util.request(api.hFx,onda,'POST').then(res=>{
      if(res.errcode!=1){
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2000,
          mask: true
        });
        return false;
      }
      // 从家庭卡成员进入，获取成员的头像和昵称
      if(mid!=''){
        that.setData({
          user: {
            name: res.member_info.name,
            headimgurl: res.member_info.headimgurl
          }
        })
      }
      let data = {
        systolic: parseFloat(res.report.systolic)/200*100,
        diastolic: parseFloat(res.report.systolic)/120*100,
        type: res.report.type
      };
      if(data.systolic>100){
        data.systolic=100
      }
      if(data.diastolic>100){
        data.diastolic=100
      }
      that.setData({
        topData: res.report
      })
      that.oneComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setOption(chart,data);
        that.chart = chart;
        return chart;
      });
      // 绘制下方折线图
      let dataX = res.chart_data.xdata;
      let dataY = [];
      res.chart_data.ydata.forEach((el,li) => {
        dataY[li] = el;
        dataY[li].type = 'line';
      });
      that.twoComponent.init((canvas, width, height) => {
        const chartLine = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setLineOption(chartLine,dataX,dataY);
        that.chartLine = chartLine;
        return chartLine;
      });
      // 修改图例
      let tu = {};
      let arr = Object.keys(res.report_range);
      let length = arr.length;
      arr.forEach((el,li) => {
        tu[li] = {
          txt: el,
          color: color[li]
        }
      });
      that.setData({
        tuli: tu,
        dataList: res.data
      })
    })
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
  ininChartOne: function(data) {
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
          width: width,
          height: height
      });
      setOption(chart, data)
      this.chart = chart;
      return chart;
    });
  }
})