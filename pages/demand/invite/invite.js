// pages/demand/invite/invite.js
const app = getApp();
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  seluser,
  navigateTo
} from '../../../utils/WeChatfction';

Page({
  data: {
    demandflag: true,
    loadflag: true
  },

  //邀约投递
  invitation(userIds) {
    let token = wx.getStorageSync('accessToken') || [];
    let demandId = this.data.demandId;
    wx.request({
      url: url + '/technology/invitationSendBusinessCard',
      method: 'post',
      data: {
        accessToken: token,
        demandId: demandId,
        userIds: userIds
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.success) {
          showToast(res.data.data, 'success', 1000)
          setTimeout(()=>{
            navigateTo('/pages/demand/lauched/lauched')
          },1000)
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //一键邀约投递
  invite(e) {
    //console.log(e);
    let token = wx.getStorageSync('accessToken') || [];
    let itemlist = e.currentTarget.dataset.item;
    //console.log(demandId, itemlist);
    let userIds = seluser(itemlist);
    this.invitation(userIds);
  },

  //名片详情
  invitemodal(e) {
    let modalName = e.currentTarget.dataset.target;
    let item = e.currentTarget.dataset.item;
    //console.log(item)
    this.setData({
      modalName: modalName,
      inviteitem: item
    })
  },

  //关闭详情
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  //单个名片邀约投递
  tapjump(e){
    let userId = e.currentTarget.dataset.userid;
    //console.log(userId)
    let userIds =[] ;
    userIds.push(userId);
    this.invitation(userIds);
  },

  onLoad: function(options) {
    //console.log(options.name)
    let token = wx.getStorageSync('accessToken') || [];
    setTimeout(() => {
      wx.request({
        url: url + '/technology/recommendBusinessCards',
        data: {
          accessToken: token,
          jobName: options.name
        },
        success: res => {
          console.log(res.data.data)
          if (res.data.success) {
            if (res.data.data.length != 0) {
              this.setData({
                invitelist: res.data.data,
                loadflag: true,
                demandId: options.demandId,
                demandflag: false,
              })
            } else {
              this.setData({
                loadflag: false,
                demandflag: false,
              })
            }
          } else {
            showToast(res.data.msg, 'none', 1000)
          }
        }
      })
    }, 500)
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