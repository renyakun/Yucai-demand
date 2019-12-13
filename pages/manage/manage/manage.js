// pages/manage/manage/manage.js
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  navigateTo,
  switchTab,
  makePhoneCall,
  showLoading,
  pageScrollTo
} from '../../../utils/WeChatfction';

const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    demandflag: true,
    TabCur: 1,
    scrollLeft: 0,
    scrollTop: 0,
    tablist: app.globalData.tablist,
    spin: false,
    accepflag: true,
    //invitaflag: true,
    sendflag: true,
    cancelflag: true,
    plflag: true,
    timerval: [0],
    demandlist: []
  },

  //tab切换
  tabSelect(e) {
    pageScrollTo(0, 500);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
    })
  },

  //详情跳转
  cardel(e) {
    let id = e.currentTarget.dataset.id;
    navigateTo('/pages/manage/carddetails/carddetails?id=' + id)
  },

  //获取已报名列表
  acceptlist(token, demandId) {
    wx.request({
      url: url + '/technology/acceptBusinessCards',
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        let acceptlist = res.data.data;
        let acceptlen = 'tablist[0].len'
        console.log('已报名acceptlist:', acceptlist, acceptlist.length)
        if (res.data.success) {
          if (acceptlist.length != 0) {
            this.setData({
              acceptlist: acceptlist,
              accepflag: true,
              demandflag: false,
              [acceptlen]: acceptlist.length
            })
          } else {
            this.setData({
              accepflag: false,
              [acceptlen]: 0
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //获取我邀请的列表
  invitalist(token, demandId) {
    wx.request({
      url: url + '/technology/invitationBusinessCards',
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        let invitalist = res.data.data;
        console.log('我邀请的', invitalist)
        if (res.data.success) {
          if (invitalist.length != 0) {
            this.setData({
              invitalist: invitalist,
              invitaflag: true,
              demandflag: false
            })
          } else {
            this.setData({
              invitaflag: false,
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //获取待面试列表
  sendlist(token, demandId) {
    wx.request({
      url: url + '/invitation/mySendInvitation',
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        let sendlist = res.data.data;
        let sendlen = 'tablist[1].len'
        console.log('待面试sendlist：', sendlist, sendlist.length)
        if (res.data.success) {
          if (sendlist.length != 0) {
            this.setData({
              sendlist: sendlist,
              sendflag: true,
              demandflag: false,
              [sendlen]: sendlist.length
            })
          } else {
            this.setData({
              sendflag: false,
              [sendlen]: 0
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //获取已取消列表
  cancellist(token, demandId) {
    wx.request({
      url: url + '/invitation/cancelInvitation',
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        let cancellist = res.data.data;
        let cancellen = 'tablist[3].len'
        console.log('已取消cancellist:', cancellist, cancellist.length)
        if (res.data.success) {
          if (cancellist.length != 0) {
            this.setData({
              cancellist: cancellist,
              cancelflag: true,
              demandflag: false,
              [cancellen]: cancellist.length
            })
          } else {
            this.setData({
              cancelflag: false,
              [cancellen]: 0
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //获取需求列表
  demandlist(token) {
    wx.request({
      url: url + '/demand/getMyDemands',
      data: {
        accessToken: token,
      },
      success: res => {
        console.log(res.data.data)
        let demandlist = res.data.data;
        if (res.data.success) {
          if (demandlist.length != 0) {
            this.setData({
              demandlist: demandlist,
              demand: demandlist[0],
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


  //获取列表
  request(token, demandId) {
    //this.invitalist(token, demandId);
    this.acceptlist(token, demandId);
    this.sendlist(token, demandId);
    this.cancellist(token, demandId);
  },


  //事件列表
  tapjump() {
    this.setData({
      modalName: 'showModal',
      demandflag: true,
    })
  },

  //选择需求
  confirm(e) {
    this.hideModal();
    console.log(e.currentTarget.dataset.demandid);
    let token = wx.getStorageSync('accessToken') || [];
    let demandId = e.currentTarget.dataset.demandid;
    this.request(token, demandId);
  },

  //取消选择
  cancel() {
    this.hideModal();
    let demandId = this.data.demand.demandId;
    let token = wx.getStorageSync('accessToken') || [];
    this.request(token, demandId);
  },

  //关闭模拟框
  hideModal() {
    this.setData({
      modalName: null,
      demandflag: false,
      TabCur: 1
    })
    pageScrollTo(0, 500);
  },

  //切换需求
  pichange(e) {
    let val = e.detail.value;
    console.log(val)
    this.setData({
      demand: this.data.demandlist[val]
    })
  },

  //刷新
  btnspin() {
    pageScrollTo(0, 500);
    let spin = this.data.spin;
    this.setData({
      spin: true,
      demandflag: true,
    })
    let token = wx.getStorageSync('accessToken') || [];
    setTimeout(() => {
      let demandId = this.data.demand.demandId;
      this.request(token, demandId);
    }, 1000)
    setTimeout(() => {
      this.setData({
        spin: false
      })
    }, 3900)

  },

  onLoad(options) {
    let token = wx.getStorageSync('accessToken') || [];
    this.demandlist(token);
    setTimeout(() => {
      this.setData({
        demandflag: false
      })
    }, 500)
    if (options.id != undefined) {
      console.log(options.id)
      this.setData({
        TabCur: options.id,
      })
    } else if (options.demandId != undefined) {
      console.log(options.demandId)
      setTimeout(() => {
        let demandlist = this.data.demandlist;
        let demands = demandlist.filter(function(elem, index, arr) {
          return elem.demandId == options.demandId
        });
        let demand = demands[0];
        console.log(demand)
        this.setData({
          demand: demand
        })
      }, 800)
    } else if (options.demandId == undefined && options.id == undefined) {
      this.onReady()
    }
  },

  onReady: function() {
    let token = wx.getStorageSync('accessToken') || [];
    setTimeout(() => {
      let demandId = this.data.demand.demandId;
      this.request(token, demandId);
    }, 1000)

  },

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {
    this.btnspin()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})