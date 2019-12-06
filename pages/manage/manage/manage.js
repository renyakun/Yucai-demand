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
    tablist: [{
      id: 1,
      flag: '待沟通',
    }, {
      id: 2,
      flag: '已邀约',
    }, {
      id: 3,
      flag: '面试安排',
    }, {
      id: 4,
      flag: '已入职',
    }],
    ctionList: [{
      icon: 'home',
      color: 'black',
      txtcolor: 'black',
      title: '回首页',
      name: 'home'
    }, {
      icon: 'phone',
      color: 'blue',
      title: '电话',
      txtcolor: 'blue',
      name: 'phone'
    }, {
      icon: '',
      color: '',
      txtcolor: '',
      title: '邀请面试',
      name: 'Invitation'
    }],
    accepflag: true,
    invitaflag: true,
    sendflag: true,
    plflag: false,
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
    showLoading();
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/manage/carddetails/carddetails?id=' + id
      })
    }, 3500);
  },

  //获取待沟通列表
  acceptlist(token) {
    wx.request({
      url: url + '/technology/acceptBusinessCards',
      data: {
        accessToken: token
      },
      success: res => {
        let acceptlist = res.data.data;
        console.log(acceptlist)
        if (res.data.success) {
          if (acceptlist.length != 0) {
            this.setData({
              acceptlist: acceptlist,
              accepflag: true
            })
          } else {
            this.setData({
              accepflag: false,
            })
          }
        } else {
          showToast(res.data.msg, 'none', 3000)
        }
      }
    })
  },

  //获取已邀约列表
  invitalist(token) {
    wx.request({
      url: url + '/technology/invitationBusinessCards',
      data: {
        accessToken: token
      },
      success: res => {
        let invitalist = res.data.data;
        console.log(invitalist)
        if (res.data.success) {
          if (invitalist.length != 0) {
            this.setData({
              invitalist: invitalist,
              invitaflag: true
            })
          } else {
            this.setData({
              invitaflag: false,
            })
          }
        } else {
          showToast(res.data.msg, 'none', 3000)
        }
      }
    })
  },

  //获取面试安排列表
  sendlist(token) {
    wx.request({
      url: url + '/invitation/mySendInvitation',
      data: {
        accessToken: token
      },
      success: res => {
        let sendlist = res.data.data;
        console.log(sendlist)
        if (res.data.success) {
          if (sendlist.length != 0) {
            this.setData({
              sendlist: sendlist,
              sendflag: true
            })
          } else {
            this.setData({
              sendflag: false,
            })
          }
        } else {
          showToast(res.data.msg, 'none', 3000)
        }
      }
    })
  },



  onLoad(options) {
  },

  onReady: function() {
    setTimeout(() => {
      this.setData({
        demandflag: false,
      })
    }, 3000)
    let token = wx.getStorageSync('accessToken') || [];
    this.acceptlist(token);
    this.invitalist(token);
    this.sendlist(token);
  },

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {
    this.setData({
      demandflag: true,
    })
    this.onReady()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})