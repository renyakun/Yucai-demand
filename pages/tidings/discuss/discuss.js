// pages/tidings/discuss/discuss.js
const {
  url
} = require('../../../utils/url.js');

import {
  showToast,
  navigateTo,
} from '../../../utils/WeChatfction';
Page({
  data: {
    TabCur: 1,
    tablist: [{
      id: 1,
      nav: '评价',
      num: 23
    }, {
      id: 2,
      nav: '晒图',
      num: 0
    }],
    star: 5,
    badge: 9,
    txtput: 0,
    isCard: true,
    animationData: {},
    loadflag: true
  },

  tabSelect(e) {
    let TabCurs = e.currentTarget.dataset.id;
    this.setData({
      TabCur: TabCurs,
    })
  },

  tapimg() {
    let isCard = this.data.isCard;
    this.setData({
      isCard: !isCard
    })
  },

  tapcal(e) {
    let id = e.currentTarget.dataset.target;
    console.log(e);
    wx.navigateTo({
      url: '/pages/tidings/reply/reply?id=' + id,
    })
  },

  scale() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation;
    animation.scale(2, 2).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(() => {
      animation.scale(1, 1).step()
      this.setData({
        animationData: animation.export()
      })
    }, 3000)
  },

  onLoad: function(options) {
  },

  onReady: function() {
    let token = wx.getStorageSync('accessToken') || [];
    wx.request({
      url: url + '/invitation/myAcceptEvaluation',
      data: {
        accessToken: token,
      },
      success: res => {
        //console.log(res)
        if (res.data.success) {
          console.log(res.data.data)
          let data = res.data.data;
          let num = 'tablist[0].num';
          if (data.length != 0) {
            this.setData({
              [num]: data.length,
              cusslist: data,
              loadflag: true
            })
          } else {
            this.setData({
              loadflag: false
            })
          }
        } else {
          showToast(res.data.msg, 'none', 3000)
        }
      }
    })
  },

  onShow: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    this.onReady()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})