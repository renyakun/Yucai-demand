// pages/tidings/discuss/discuss.js
const {
  url
} = require('../../../utils/url.js');

import {
  showToast,
  navigateTo,
  selstar,
} from '../../../utils/WeChatfction';

Page({
  data: {
    TabCur: 1,
    tablist: [{
      id: 1,
      nav: '评价',
      num: 0
    }, {
      id: 2,
      nav: '晒图',
      num: 0
    }],
    star: 0,
    badge: 9,
    txtput: 0,
    isCard: true,
    animationData: {},
    loadflag: false,
    demandflag: true,
  },

  //tab切换
  tabSelect(e) {
    let TabCurs = e.currentTarget.dataset.id;
    if (TabCurs == 2) {
      showToast('即将上线，敬请期待!', 'none', 3000)
    } else {
      this.setData({
        TabCur: TabCurs,
      })
    }
  },

  //图片切换
  tapimg() {
    let isCard = this.data.isCard;
    this.setData({
      isCard: !isCard
    })
  },

  //跳转回复
  tapcal(e) {
    let id = e.currentTarget.dataset.target.id;
    let name = e.currentTarget.dataset.target.evaluationName;
    console.log(e.currentTarget.dataset.target);
    //navigateTo('/pages/tidings/reply/reply?id=' + id + '&name=' + name)
    wx.navigateTo({
      url: '/pages/tidings/reply/reply?id=' + id + '&name=' + name,
    })
    //navigateTo('/pages/tidings/reply/reply')
    // let modalName = e.currentTarget.dataset.target;
    // this.setData({
    //   modalName: modalName
    // })
  },

  //动画
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
    }, 1000)
  },


  //关闭详情
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  //字数管理
  textareaBInput(e) {
    console.log(e.detail.value);
    let val = e.detail.value;
    let len = val.length;
    this.setData({
      txtput: len,
    })
    if (len > 499) {
      showToast('输入值字数最大为500！', 'none', 1000)
    }
  },

  onLoad: function(options) {},

  onReady: function() {
    setTimeout(() => {
      this.setData({
        demandflag: false,
      })
    }, 500)
    // let token = wx.getStorageSync('accessToken') || [];
    // wx.request({
    //   url: url + '/invitation/myAcceptEvaluation',
    //   data: {
    //     accessToken: token,
    //   },
    //   success: res => {
    //     if (res.data.success) {
    //       console.log(res.data.data)
    //       let data = res.data.data;
    //       if (data.length != 0) {
    //         let stars = Math.round(selstar(data) / data.length);
    //         //console.log(stars)
    //         this.setData({
    //           cusslist: data,
    //           loadflag: true,
    //           star: stars
    //         })
    //       } else {
    //         this.setData({
    //           loadflag: false
    //         })
    //       }
    //     } else {
    //       showToast(res.data.msg, 'none', 1000)
    //     }
    //   }
    // })
  },

  onShow: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    this.onReady()
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})