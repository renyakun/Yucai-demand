// pages/classify/authentication/authentication.js
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  pagesurl,
} from '../../../utils/WeChatfction';

Page({
  data: {
    InputBottom: 0,
    companyNick: '',
    idNumber: '',
    legalName: '',
    mobile: ''
  },


  //判断
  formSubmit(e) {
    let accessToken = wx.getStorageSync('accessToken') || [];
    let companyNick = e.detail.value.companyNick;
    let idNumber = e.detail.value.idNumber;
    let legalName = e.detail.value.legalName;
    let code = e.detail.value.code;
    let mobile = e.detail.value.mobile;
    if (legalName == "" || idNumber == "" || companyNick == "" || mobile == "") {
      showToast('请输入完整信息！', 'loading', 1000)
    } else {
      //console.log(e.detail.value);
        wx.request({
          url: url + '/company/companyCertification/add',
          method: 'post',
          data: {
            companyNick: companyNick,
            idNumber: idNumber,
            legalName: legalName,
            mobile: mobile,
            accessToken: accessToken,
          },
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            console.log(res)
            if (res.data.success) {
              showToast(res.data.data, 'success', 800)
              setTimeout(() => {
                pagesurl('certification', '认证信息', 2)
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
      title: options.title
    })
  },


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