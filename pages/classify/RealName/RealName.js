// pages/classify/RealName/RealName.js

const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  navigateTo,
} from '../../../utils/WeChatfction';
Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    proList: null,
    realName: '',
    mobile: '',
    idCard: '',
  },
  // 判定输入为非空字符
  formSubmit(e) {
    let token = wx.getStorageSync('accessToken') || [];
    let unionld = wx.getStorageSync('unionId') || {};
    console.log(unionld);
    let realName = e.detail.value.realName;
    let mobile = e.detail.value.mobile;
    let idCard = e.detail.value.idCard;
    let code = e.detail.value.code;
    if (realName == "" || mobile == "" || idCard == "") {
      showToast('请输入完整信息！', 'loading', 3000)
    } else {
      //console.log(e.detail.value);
      //let tokendata = e.detail.value;
      //console.log(tokendata);
      wx.request({
        url: url+'/user/UserCertification/add',
        method: 'post',
        data: {
          realName: realName,
          mobile: mobile,
          idCard: idCard,
          avatar: unionld.avatarUrl,
          nickname: unionld.nickname,
          accessToken: token,
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res)
          if (res.data.success) {
            showToast(res.data.data, 'success', 3000);
            navigateTo('/pages/classify/certification/certification?title=认证信息&&cur=1');
          } else {
            showToast(res.data.msg, 'none', 3000)
          }
        }
      })
    }
  },

  //姓名判断
  username(e) {
    let user = e.detail.value;
    if (user.length === 5) {
      let checkeduser = this.checkusername(user)
      // this.setData({
      //   disabcode: checkedNum,
      // })
      console.log(user)
    } else {
      // this.setData({
      //   disabcode: false,
      // })
      //console.log(user)
    }
  },

  //中文判断
  checkusername(datauser) {
    let str = /^[\u4e00-\u9fa5]{2,5}$/;
    if (str.test(datauser)) {
      return true
    } else {
      showToast('请输入中文', 'none',3000)
      return false
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