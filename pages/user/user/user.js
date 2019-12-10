// pages/user/user.js
//获取应用实例
const app = getApp()
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  pagesurl,
  showModal,
  navigateTo,
  showLoading,
  pageScrollTo
} from '../../../utils/WeChatfction';
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scrollTop: 0,
    notice: '暂无消息',
    navList: [{
        id: 1,
        icon: 'cartfill',
        name: "已推送",
        num: 25,
      },
      {
        id: 2,
        icon: 'upstagefill',
        name: "店铺关注",
        num: 75,
      },
      {
        id: 3,
        icon: 'clothesfill',
        name: "足迹",
        num: 12,
      },
    ],
    atteslist: [{
      icon: 'profilefill',
      name: 'certification',
      color: 'cyan',
      badge: 0,
      title: '认证信息',
    }, {
      icon: 'vipcard',
      color: 'orange',
      name: 'authentication',
      badge: 0,
      title: '企业认证'
    }],
    demandlist: [{
      icon: 'repeal',
      name: 'lauched',
      color: 'blue',
      badge: 0,
      title: '已发布',
    }],
  },

  //认证跳转
  attesjump(e) {
    let token = wx.getStorageSync('token') || {};
    let tokenflag = token.data.success;
    let tokenmsg = wx.getStorageSync('tokenmsg') || {};
    let msg = tokenmsg.data.msg;
    let name = e.currentTarget.dataset.target.name;
    let title = e.currentTarget.dataset.target.title;
    console.log(token.data, tokenmsg.data)
    //pagesurl('RealName', '实名认证')
    if (name == "certification" && tokenflag) {
      pagesurl(name, title, 1)
    } else if (name == "certification" && !tokenflag) {
      showModal('请先实名认证', 'RealName', '实名认证')
    } else if (tokenflag && name == "authentication" && msg == "您还未进行企业认证") {
      pagesurl(name, title)
    } else if (tokenflag && name == "authentication" && msg == "您还未进行实名认证，请先实名认证再企业认证") {
      showModal(tokenmsg.data.msg, 'RealName', '实名认证')
    } else if (name == "authentication" && msg == "成功") {
      showToast('您已企业认证！正在为您跳转认证信息', 'none', 2000)
      setTimeout(() => {
        pagesurl('certification', '认证信息', 2)
      }, 2500)
    } else if (name == "whole") {
      navigateTo('/pages/classify / home / home');
    } else {
      pagesurl(name, title)
    }
  },


  //官方客服
  serjump() {
    showToast('即将上线，敬请期待!', 'none', 3000)
  },

  //建议留言
  editjump() {
    showToast('即将上线，敬请期待!', 'none', 3000)
  },

  //关于我们
  friendjump() {
    //navigateTo('/pages/classify/about/about')
    showToast('即将上线，敬请期待!', 'none', 3000)
  },

  //需求方跳转
  paegswitch() {
    pageScrollTo(0, 500)
    wx.navigateToMiniProgram({
      appId: 'wx884ebfcbccc0468b',
      path: 'pages/user/user/user',
      envVersion: 'trial',
      success(res) {
        // 打开成功
        console.log(res, '打开成功')
      },
      fail(res) {
        console.log(res, '打开失败')
      }
    })
  },

  demandjump(e) {
    navigateTo('/pages/demand/lauched/lauched');
  },
  phmejump(e) {
    navigateTo('/pages/technology/phmecard/phmecard');
  },
  cordjump() {
    navigateTo('/pages/record/record/record');
  },
  managejump() {
    navigateTo('/pages/manage/manage/manage');
  },

  //获取状态值
  token(website, tokentxt) {
    wx.hideLoading();
    let accessToken = wx.getStorageSync('accessToken') || [];
    wx.request({
      url: url + website,
      data: {
        accessToken: accessToken,
      },
      success: res => {
        wx.hideLoading()
        //console.log(res)
        wx.setStorageSync(tokentxt, res);
        //wx.setStorageSync('mobile', res.data.data.mobile);
      }
    })
  },

  onLoad: function() {
    wx.showLoading({
      title: '加载中',
    });

    //获取微信信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    //获取名片状态值
    setTimeout(() => {
      wx.hideLoading();
      let accessToken = wx.getStorageSync('accessToken') || [];
      this.token('/user/UserCertification', 'token')
      this.token('/company/companyCertification', 'tokenmsg')
    }, 1000);

  },

  onReady: function() {

  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow: function() {
    //this.onLoad()
  },

  //下拉刷新
  onPullDownRefresh: function() {
    this.onLoad()
  },
})