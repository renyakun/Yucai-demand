// pages/demand/invite/invite.js
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  showLoading,
} from '../../../utils/WeChatfction';

function select(item) {
  let userIds = [];
  for (let i in item) {
    //console.log(item[i].userId);
    userIds.push(item[i].userId);
  }
  return userIds;
};

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
          showToast(res.data.data, 'success', 3000)
        } else {
          showToast(res.data.msg, 'none', 3000)
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
    let userIds = select(itemlist);
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
      this.setData({
        demandflag: false,
      })
    }, 3000)
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
                demandId: options.demandId
              })
            } else {
              this.setData({
                loadflag: false
              })
            }
          } else {
            showToast(res.data.msg, 'none', 3000)
          }
        }
      })
    }, 3100)
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