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
    loadflag: true,
    loadplay: false,
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
    let managetxt = '招聘进度';
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

  //获取已发布列表 page:1
  getMyDemands1(token, page) {
    wx.request({
      url: url + '/demand/getMyDemands',
      data: {
        accessToken: token,
        page: page
      },
      success: res => {
        console.log('已发布列表:', res.data.data)
        let demand = res.data.data;
        if (res.data.success) {
          if (res.data.data.length != 0) {
            setTimeout(() => {
              this.setData({
                cardlist: demand,
                cardflag: true,
                demandflag: false,
                loadflag: true,
              })
            }, 500)
          } else {
            this.setData({
              cardflag: false,
              demandflag: true,
              loadflag: false,
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)

        }

      }
    })
  },

  //获取已发布列表 page++
  getMyDemands2(token, page) {
    wx.request({
      url: url + '/demand/getMyDemands',
      data: {
        accessToken: token,
        page: page
      },
      success: res => {
        let demands = res.data.data;
        console.log('已发布列表:,page++', demands, page)
        let demand = this.data.cardlist;
        console.log('已录取列表:,page:1', demand)
        if (res.data.data.length != 0) {
          if (res.data.success) {
            if (res.data.data.length != 0) {
              showToast('加载数据中...', 'none', 800);
              demand.push(...demands)
              setTimeout(() => {
                this.setData({
                  cardlist: demand,
                  cardflag: true,
                  demandflag: false,
                  loadflag: true,
                  loadplay: false,
                })
              }, 1000)
            } else {
              this.setData({
                cardflag: false,
                demandflag: true
              })
            }
          } else {
            showToast(res.data.msg, 'none', 1000)
          }
        } else {
          this.setData({
            tiptxt: '我也是有底线的',
            loadplay: true,
          })
          showToast('我也是有底线的', 'none', 1000)
        }
      }
    })
  },

  //获取已发布列表
  request(page) {
    let token = wx.getStorageSync('accessToken') || [];
    if (page <= 1) {
      this.getMyDemands1(token, page)
    } else {
      this.getMyDemands2(token, page)
    }
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