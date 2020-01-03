// pages/tidings/discuss/discuss.js
const {
  url
} = require('../../../utils/url.js');

import {
  showToast,
  navigateTo,
  selstar,
} from '../../../utils/WeChatfction';

Page({
  data: {
    TabCur: 1,
    tablist: [{
      id: 1,
      nav: '评价',
      num: 0
    }, {
      id: 2,
      nav: '晒图',
      num: 0
    }],
    star: 0,
    badge: 9,
    txtput: 0,
    isCard: true,
    animationData: {},
    loadflag: false,
    demandflag: true,
    page: 2,
  },

  //tab切换
  tabSelect(e) {
    let TabCurs = e.currentTarget.dataset.id;
    if (TabCurs == 2) {
      showToast('即将上线，敬请期待!', 'none', 3000)
    } else {
      this.setData({
        TabCur: TabCurs,
      })
    }
  },

  //图片切换
  tapimg() {
    let isCard = this.data.isCard;
    this.setData({
      isCard: !isCard
    })
  },

  //动画
  scale() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation;
    animation.scale(2, 2).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(() => {
      animation.scale(1, 1).step()
      this.setData({
        animationData: animation.export()
      })
    }, 1000)
  },

  //打开回复
  replyModal(e) {
    console.log(e.currentTarget.dataset.modal, e.currentTarget.dataset.replyid);
    let modalName = e.currentTarget.dataset.modal;
    let replyid = e.currentTarget.dataset.replyid;
    this.setData({
      modalName: modalName,
      replyid: replyid
    })
  },

  formSubmit(e) {
    let token = wx.getStorageSync('accessToken') || [];
    let id = this.data.replyid;
    let replyMessage = e.detail.value.replyMessage;
    if (replyMessage == "") {
      showToast('请输入完整信息！', 'none', 1000)
    } else {
      console.log(id, replyMessage);
      wx.request({
        url: url + '/evaluation/replyEvaluation',
        method: 'post',
        data: {
          accessToken: token,
          id: id,
          replyMessage: replyMessage
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res)
          this.hideModal();
          if (res.data.success) {
            showToast(res.data.data, 'success', 800);
            this.onLoad()
          } else {
            showToast(res.data.msg, 'none', 800);
          }
        }
      })
    }
  },


  //关闭详情
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  //字数管理
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

  //获取消息列表
  demand(token, website, list, txt, page) {
    console.log(token, website, list, txt, page)
    wx.request({
      url: url + website,
      data: {
        accessToken: token,
        page: page,
      },
      success: res => {
        console.log(res)
        if (page <= 1) {
          let demand = res.data.data;
          console.log(txt, demand, demand.length, 'page:', page);
          if (res.data.success) {
            if (demand.length != 0) {
              let stars = Math.round(selstar(demand) / demand.length);
              console.log(selstar(demand), demand.length, stars);
              this.setData({
                [list]: demand,
                evalflag: true,
                demandflag: false,
                star: stars
              })
            } else {
              this.setData({
                demandflag: false,
                evalflag: false,
              })
            }
          } else {
            showToast(res.data.msg, 'none', 1000)
          }
        } else {
          let demands = res.data.data;
          console.log(txt, demands, demands.length, 'page:', page);
          let demand = this.data.evaldemand;
          console.log('加载数据', txt, demand)
          if (demands.length != 0) {
            if (res.data.success) {
              if (demands.length != 0) {
                showToast('加载数据中...', 'none', 500);
                demand.push(...demands)
                let stars = Math.round(selstar(demand) / demand.length);
                console.log(selstar(demand), demand.length, stars);
                console.log(stars)
                this.setData({
                  [list]: demand,
                  evalflag: true,
                  demandflag: false,
                  loadplay: false,
                  star: stars
                })
              } else {
                this.setData({
                  demandflag: false,
                  evalflag: false,
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
          }


        }

      }
    })
  },

  //获取已录取列表
  request(page) {
    let token = wx.getStorageSync('accessToken') || [];
    let evaldemand = 'evaldemand';
    let evaltxt = '评价消息evaldemand:';
    let evalwebsite = '/evaluation/myAcceptEvaluation';
    setTimeout(() => {
      this.demand(token, evalwebsite, evaldemand, evaltxt, page);
    }, 500)
  },

  onLoad: function(options) {
    let page = this.data.page - 1;
    this.request(page)
  },

  onReady: function() {

  },

  onShow: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    this.onLoad()
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {
    let page = this.data.page++;
    this.request(page)
  },

  onShareAppMessage: function() {

  }
})