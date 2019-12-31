// pages/tidings/tidings/tidings.js
const app = getApp();
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  navigateTo,
} from '../../../utils/WeChatfction';
Page({
  data: {
    newslist: app.globalData.newslist,
  },

  //跳转评论详情
  cussjump(e) {
    let id = e.currentTarget.dataset.id;
    console.log(id)
    if (id == 1) {
      navigateTo('/pages/tidings/discuss/discuss')
    } else {
      showToast('即将上线，敬请期待!', 'none', 1000)
    }
  },

  onLoad: function(options) {
   
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
    wx.stopPullDownRefresh();
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