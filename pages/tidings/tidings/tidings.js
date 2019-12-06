// pages/tidings/tidings/tidings.js
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  navigateTo,
} from '../../../utils/WeChatfction';
Page({
  data: {
    newslist: [{
      id: 1,
      img: '../../../images/icon/notice.png',
      con: '评价消息通知',
      tit: '暂无消息',
      notice: '2018年世界杯,将于6月14日至7月15日举行;2018年世界杯,将于6月14日至7月15日举行;',
      icon: 'infofill',
      timer: '',
      badge: 6,

    }, {
      id: 2,
      img: '../../../images/icon/see.png',
      con: '今日暂无查看',
      tit: '暂无劳务查看',
      notice: '2018年世界杯,将于6月14日至7月15日举行;2018年世界杯,将于6月14日至7月15日举行;',
      icon: '',
      timer: '',
      badge: 7,
    }, {
      id: 3,
      img: '../../../images/icon/subscribe.png',
      con: '订阅消息',
      tit: '暂无订阅消息',
      notice: '2018年世界杯,将于6月14日至7月15日举行;2018年世界杯,将于6月14日至7月15日举行;',
      icon: 'infofill',
      timer: '',
      badge: 8,
    }, {
      id: 4,
      img: '../../../images/YuCai.jpg',
      con: '御材劳务官方助手',
      tit: '暂无消息',
      notice: '2018年世界杯,将于6月14日至7月15日举行;2018年世界杯,将于6月14日至7月15日举行;',
      icon: '',
      timer: '22:20',
      badge: 9,
    }]
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  cussjump() {
    navigateTo('/pages/tidings/discuss/discuss')
  },
  emptytap() {
    let badge = 'newslist[0].badge';
    let notice = 'newslist[0].notice';
    this.setData({
      [notice]: '',
      [badge]: 0
    })
    let token = wx.getStorageSync('accessToken') || [];
    wx.request({
      url: url + '/invitation/delMyAcceptEvaluations',
      data: {
        accessToken: token,
      },
      success: res => {
        //console.log(res)
        if (res.data.success) {
          showToast(res.data.data, 'success', 3000)
        } else {
          showToast(res.data.msg, 'none', 3000)
        }
      }
    })
  },
  onLoad: function(options) {
    let token = wx.getStorageSync('accessToken') || [];
    wx.request({
      url: url + '/invitation/myAcceptEvaluation',
      data: {
        accessToken: token,
      },
      success: res => {
        //console.log(res)
        if (res.data.success) {
          if (res.data.data.length != 0) {
            let data = res.data.data;
            let badge = 'newslist[0].badge';
            let notice = 'newslist[0].notice';
            let timer = 'newslist[0].timer';
            this.setData({
              [badge]: data.length,
              [notice]: data[0].evaluationName + ' : ' + data[0].message,
              [timer]: data[0].createTime
            })
          }
          console.log(res.data.data)
        } else {
          showToast(res.data.msg, 'none', 3000)
        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})