// pages/user/lauched/lauched.js
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  showLoading,
  navigateTo
} from '../../../utils/WeChatfction';
Page({
  data: {
    demandflag: true,
    loadflag: true,
    page: 2,
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
    }, 1000)
    wx.request({
      url: url + '/demand/delMyDemand',
      data: {
        accessToken: token,
        demandId: carditem.demandId
      },
      success: res => {
        console.log(res)
        if (res.data.success) {
          showToast(res.data.data, 'success', 1000)
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //需求详情
  demanditem(e) {
    let demandId = e.currentTarget.dataset.id;
    //console.log(demandId)
    navigateTo('/pages/demand/details/details?demandId=' + demandId, )
  },

  //招聘进度
  demandIdjump(e) {
    let demandId = e.currentTarget.dataset.id;
    let managetxt = '合作进度';
    navigateTo('/pages/manage/manage/manage?demandId=' + demandId + '&managetxt=' + managetxt)
  },

  //邀约投递
  deliver(e) {
    let name = e.currentTarget.dataset.name;
    let demandId = e.currentTarget.dataset.demandid;
    console.log(name, demandId)
    showLoading();
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/demand/invite/invite?name=' + name + '&demandId=' + demandId,
      })
    }, 1000)
  },

  //回到首页
  tapind() {
    setTimeout(() => {
      switchTab('/pages/user/user/user')
    }, 1000)
  },

  //获取已发布列表
  demand(token, website, list, dataflag, txt, page) {
    console.log(token, website, list, dataflag, txt, page)
    wx.request({
      url: url + website,
      data: {
        accessToken: token,
        page: page,
      },
      success: res => {
        if (page <= 1) {
          let demand = res.data.data;
          console.log(txt, demand, demand.length, 'page:', page);
          if (res.data.success) {
            if (demand.length != 0) {
              this.setData({
                [list]: demand,
                [dataflag]: true,
                demandflag: false,
                loadflag: true,
              })
            } else {
              this.setData({
                demandflag: false,
                [dataflag]: false,
                loadflag: false,
              })
            }
          } else {
            showToast(res.data.msg, 'none', 1000)
          }
        } else {
          let demands = res.data.data;
          console.log(txt, demands, demands.length, 'page:', page);
          let demand = this.data.cardlist;
          console.log('加载数据', txt, demand)
          if (demands.length != 0) {
            if (res.data.success) {
              if (demands.length != 0) {
                showToast('加载数据中...', 'none', 500);
                demand.push(...demands)
                this.setData({
                  [list]: demand,
                  [dataflag]: true,
                  demandflag: false,
                })
              } else {
                this.setData({
                  demandflag: false,
                  [dataflag]: false,
                })
              }
            } else {
              showToast(res.data.msg, 'none', 1000)
            }
          } else {
            //showToast('我也是有底线的', 'none', 1000)
          }


        }

      }
    })
  },

  //获取已发布列表
  request(page) {
    let token = wx.getStorageSync('accessToken') || [];
    let cardlist = 'cardlist';
    let cardtxt = '已发布列表cardlist:';
    let cardwebsite = '/demand/getMyDemands';
    let dataflag = 'cardflag';
    setTimeout(() => {
      this.demand(token, cardwebsite, cardlist, dataflag, cardtxt, page);
    }, 500)
  },


  onLoad: function(options) {
    let page = this.data.page - 1;
    this.request(page)
  },

  onReady: function() {

  },

  listouch(e) {
    this.ListTouchStart(e);
    this.ListTouchMove(e);
    this.ListTouchEnd(e);
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
      page: 2,
      admission: [],
      demandflag: true,
    })
    let page = this.data.page - 1;
    this.request(page)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let page = this.data.page++;
    this.request(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})