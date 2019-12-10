// pages/tidings/reply/reply.js
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  navigateTo,
} from '../../../utils/WeChatfction';
Page({
  data: {
    txtput: 0,
  },

  formSubmit(e) {
    let accessToken = wx.getStorageSync('accessToken') || [];
    let replyMessage = e.detail.value.replyMessage;
    let id = this.data.id;
    if (replyMessage == "") {
      showToast('请输入完整信息！', 'none', 1000)
    } else {
      console.log(replyMessage);
      wx.request({
        url: url + '/invitation/replyEvaluation',
        method: 'post',
        data: {
          id: id,
          replyMessage: replyMessage,
          accessToken: accessToken,
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res)
          if (res.data.success) {
            showToast(res.data.data, 'success', 1000);
            setTimeout(() => {
              navigateTo('/pages/tidings/discuss/discuss?flag=true');
            }, 1000)
          } else {
            showToast(res.data.msg, 'none', 1000)
          }
        }
      })
    }
  },

  onLoad: function(options) {
    this.setData({
      id: options.id,
      name: options.name,
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