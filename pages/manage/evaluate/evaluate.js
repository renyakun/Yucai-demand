// pages/manage/evaluate/evaluate.js
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  navigateTo
} from '../../../utils/WeChatfction';
Page({
  data: {
    star: 0,
    txtput: 0,
    message: '',
    InputBottom: 0,
  },
  onChange(e) {
    const index = e.detail.index;
    this.setData({
      star: index
    })
  },
  formSubmit(e) {
    let token = wx.getStorageSync('accessToken') || [];
    let star = this.data.star;
    let message = e.detail.value.message;
    let id = this.data.id;
    let demandId = this.data.demandId;
    let managetxt = '用工管理';
    if (message == "" || star == 0) {
      showToast('请输入完整信息！', 'none', 1000)
    } else {
      console.log(id, star, message);
      wx.request({
        url: url + '/evaluation/evaluationUser',
        method: 'post',
        data: {
          star: star,
          message: message,
          id: id,
          accessToken: token,
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res)
          if (res.data.success) {
            showToast(res.data.data, 'success', 1000);
            setTimeout(() => {
              navigateTo('/pages/manage/manage/manage?id=3&demandId=' + demandId + '&managetxt=' + managetxt);
            }, 3500)
          } else {
            showToast(res.data.msg, 'none', 1000)
          }
        },
      })
    }
  },
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
  onLoad: function (options) {
    this.setData({
      id: options.id,
      realName: options.realName,
      demandId: options.demandId
    })

    console.log(options);
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})