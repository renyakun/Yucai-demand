// pages/demand/details/details.js
const app = getApp();
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  switchTab,
  navigateTo,
  showLoading,
} from '../../../utils/WeChatfction';

Page({
  data: {
    demandflag: true
  },

  //修改跳转
  jumpedit(e) {
    let cur = e.currentTarget.dataset.cur;
    let demandId = e.currentTarget.dataset.id;
    navigateTo('/pages/demand/modify/modify?cur=' + cur + '&&demandId=' + demandId)
  },

  onLoad: function(options) {
    this.setData({
      demandId: options.demandId
    })
  },

  onReady: function() {

    let token = wx.getStorageSync('accessToken') || [];
    let demandId = this.data.demandId;
    wx.request({
      url: url + '/demand/getDemandById',
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        //console.log(res.data.data)
        let label = res.data.data.label.split(",");
        let address = res.data.data.city;
        let jobType = res.data.data.jobType;
        let len = res.data.data.jobRequire.length;
        let id = res.data.data.id;
        this.setData({
          demandlist: res.data.data,
          label: label,
          txtput: len,
          id: id,
          demandflag: false,
        })
      }
    })
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
    this.setData({
      demandflag: true,
    })
    this.onReady()
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