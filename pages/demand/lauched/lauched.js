// pages/user/lauched/lauched.js
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  showLoading,
} from '../../../utils/WeChatfction';
Page({
  data: {
    demandflag: true,
    loadflag: true
  },

  //关闭职位
  deldemand(e) {
    let token = wx.getStorageSync('accessToken') || [];
    let carditem = e.currentTarget.dataset.item;
    let cardlist = this.data.cardlist;
    cardlist = cardlist.filter(i => {
      return i.demandId !== carditem.demandId
    })
    showLoading();
    setTimeout(() => {
      this.setData({
        cardlist: cardlist,
      })
    }, 3000)
    wx.request({
      url: url + '/demand/delMyDemand',
      data: {
        accessToken: token,
        demandId: carditem.demandId
      },
      success: res => {
        console.log(res)
        if (res.data.success) {
          showToast(res.data.data, 'success', 3000)
        } else {
          showToast(res.data.msg, 'none', 3000)
        }
      }
    })
  },

  //需求详情
  demanditem(e) {
    let demandId = e.currentTarget.dataset.id;
    //console.log(demandId)
    showLoading();
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/demand/details/details?demandId=' + demandId,
      })
    }, 3000)
  },

  //邀约投递
  deliver(e){
    let name = e.currentTarget.dataset.name;
    let demandId = e.currentTarget.dataset.demandid;
    console.log(name,demandId )
    showLoading();
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/demand/invite/invite?name=' + name + '&demandId=' + demandId,
      })
    }, 3000)
  },


  //回到首页
  tapind() {
    setTimeout(() => {
      switchTab('/pages/user/user/user')
    }, 3000)
  },



  

  onLoad: function(options) {},

  onReady: function() {
    let token = wx.getStorageSync('accessToken') || [];
    setTimeout(() => {
      this.setData({
        demandflag: false,
      })
    }, 3000)
    setTimeout(() => {
      wx.request({
        url: url + '/demand/getMyDemands',
        data: {
          accessToken: token,
        },
        success: res => {
          console.log(res.data.data)
          if (res.data.success) {
            if (res.data.data.length != 0) {
              this.setData({
                cardlist: res.data.data,
                loadflag: true
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

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
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