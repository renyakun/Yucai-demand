// pages/classify/certification/certification.js

const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  showModal,
  navigateTo,
  pageScrollTo,
} from '../../../utils/WeChatfction';

Page({

  data: {
    TabCur: 1,
    tokendata: {},
    enterprise: {},
    demandflag: true
  },

  onLoad: function(options) {
    this.setData({
      title: options.title,
      TabCur: options.cur,
    })
    let tokendata = this.data.tokendata;
    if (tokendata=={}){
      showModal('您还未进行实名认证,请先实名认证', 'RealName', '实名认证')
    }
  },

  onReady: function() {
    setTimeout(() => {
      let token = wx.getStorageSync('accessToken') || [];
      wx.request({
        url: url + '/user/UserCertification',
        data: {
          accessToken: token,
        },
        success: res => {
          wx.setStorageSync('token', res);
          if (res.data.success) {
            this.setData({
              tokendata: res.data.data,
              demandflag: false,
            })
          }
        }
      })
      wx.request({
        url: url + '/company/companyCertification',
        data: {
          accessToken: token,
        },
        success: res => {
          wx.setStorageSync('tokenmsg', res)
          if (res.data.success) {
            this.setData({
              enterprise: res.data.data,
              demandflag: false,
            })
          }
        }
      })
    }, 3000)
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
    this.onReady()
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