// pages/user/user.js
//获取应用实例
const app = getApp()
const {
  url
} = require('../../utils/url.js');
import {
  showToast,
  pagesurl,
  showModal,
  navigateTo,
  showLoading,
  pageScrollTo
} from '../../utils/WeChatfction';
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scrollTop: 0,
    notice: '暂无消息',
    atteslist: app.globalData.atteslist,
    tablist: app.globalData.tablist,
    recruitlist: app.globalData.recruitlist,
    managetxt :'合作进度',
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
      showToast('您已企业认证！正在为您跳转认证信息', 'none', 800)
      setTimeout(() => {
        pagesurl('certification', '认证信息', 2)
      }, 1000)
    } else {
      pagesurl(name, title)
    }
  },

  //公司主页
  companyjump() {
    //showToast('即将上线，敬请期待!', 'none', 1000);
    let token = wx.getStorageSync('accessToken') || [];
    this.homepage(token)
  },

  //官方客服
  serjump() {
    showToast('即将上线，敬请期待!', 'none', 1000)
  },

  //建议留言
  editjump() {
    showToast('即将上线，敬请期待!', 'none', 1000)
  },

  //关于我们
  aboutjump() {
    //navigateTo('/pages/classify/about/about')
    showToast('即将上线，敬请期待!', 'none', 1000)
  },

  //需求方跳转
  paegswitch() {
    pageScrollTo(0, 1000);
    //showToast('即将上线，敬请期待!', 'none', 1000)
    wx.navigateToMiniProgram({
      appId: 'wxbe95cfd0acd54a9d',
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

  cordjump() {
    navigateTo('/pages/record/record/record');
  },


  //招聘进度跳转
  mangsjump(e) {
    let id = e.currentTarget.dataset.id;
    let managetxt =this.data.managetxt;
    navigateTo('/pages/manage/manage/manage?id=' + id +'&managetxt=' + managetxt);
  },

  managejump() {
    let managetxt = this.data.managetxt;
    navigateTo('/pages/manage/manage/manage?managetxt=' + managetxt);
  },

  //用工管理
  recruitjump() {
    let managetxt = '用工管理';
    navigateTo('/pages/manage/manage/manage?managetxt=' + managetxt);
  },

  recruitsjump(e){
    let id = e.currentTarget.dataset.id;
    let managetxt = '用工管理';
    navigateTo('/pages/manage/manage/manage?id=' + id + '&managetxt=' + managetxt);
  },


  //获取状态值
  token(website, tokentxt, token) {
    wx.request({
      url: url + website,
      data: {
        accessToken: token,
      },
      success: res => {
        //console.log(res)
        wx.setStorageSync(tokentxt, res);
        //wx.setStorageSync('mobile', res.data.data.mobile);
      }
    })
  },

  //获取公司主页
  homepage(token) {
    wx.request({
      url: url + '/company/getCompanyHomepage',
      data: {
        accessToken: token,
      },
      success: res => {
        console.log(res)
        if (res.data.success) {
          if (res.data.data.length != 0) {
            navigateTo('/pages/company/details/details?cur=2');
          }
        } else {
          showToast('您还没有设置公司主页!', 'none', 800);
          setTimeout(() => {
            navigateTo('/pages/company/details/details?cur=1');
          }, 1000)
        }
      }
    })
  },

  onLoad: function() {
    let token = wx.getStorageSync('accessToken') || '';
    this.token('/user/UserCertification', 'token', token);
    this.token('/company/companyCertification', 'tokenmsg', token);

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
    }, 100);

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
    wx.stopPullDownRefresh();
  },
})