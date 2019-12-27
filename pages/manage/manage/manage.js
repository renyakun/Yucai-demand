// pages/manage/manage/manage.js
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  navigateTo,
  pageScrollTo,
  switchTab
} from '../../../utils/WeChatfction';
const app = getApp();

Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    demandflag: true,
    TabCur: 1,
    scrollLeft: 0,
    scrollTop: 0,
    tablist: app.globalData.tablist,
    recruitlist: app.globalData.recruitlist,
    spin: false,
    accepflag: true,
    //invitaflag: true,
    sendflag: true,
    cancelflag: true,
    plflag: false,
    timerval: [0],
    demandlist: [],
    manageflag: true,
    sionlflag: true,
  },

  //tab切换
  tabSelect(e) {
    pageScrollTo(0, 500);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
    })
  },

  //详情跳转
  cardel(e) {
    let cur = e.currentTarget.dataset.cur;
    let id = e.currentTarget.dataset.id;
    let demandId = this.data.demandId;
    if (id != undefined) {
      if (cur == 2) {
        let userid = e.currentTarget.dataset.userid;
        console.log(id, cur, userid, demandId)
        navigateTo('/pages/manage/carddetails/carddetails?id=' + id + '&cur=' + cur + '&userid=' + userid + '&demandId=' + demandId)
      } else if (cur == 1) {
        console.log(id, cur, demandId)
        navigateTo('/pages/manage/carddetails/carddetails?id=' + id + '&cur=' + cur + '&demandId=' + demandId)
      }
    } else {
      showToast('即将上线，敬请期待!', 'none', 1000)
    }



  },

  //获取已报名列表
  acceptlist(token, demandId) {
    wx.request({
      url: url + '/technology/acceptBusinessCards',
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        let acceptlist = res.data.data;
        let acceptlen = 'tablist[0].len'
        console.log('已报名acceptlist:', acceptlist, acceptlist.length, '需求id:', demandId)
        if (res.data.success) {
          if (acceptlist.length != 0) {
            this.setData({
              acceptlist: acceptlist,
              accepflag: true,
              demandflag: false,
              [acceptlen]: acceptlist.length
            })
          } else {
            this.setData({
              demandflag: false,
              accepflag: false,
              [acceptlen]: 0
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //获取待面试列表
  sendlist(token, demandId) {
    wx.request({
      url: url + '/invitation/mySendInvitation',
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        let sendlist = res.data.data;
        let sendlen = 'tablist[1].len'
        console.log('待面试sendlist：', sendlist, sendlist.length, '需求id:', demandId)
        if (res.data.success) {
          if (sendlist.length != 0) {
            this.setData({
              sendlist: sendlist,
              sendflag: true,
              demandflag: false,
              [sendlen]: sendlist.length
            })
          } else {
            this.setData({
              demandflag: false,
              sendflag: false,
              [sendlen]: 0
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //获取已取消列表
  cancellist(token, demandId) {
    wx.request({
      url: url + '/invitation/cancelInvitation',
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        let cancellist = res.data.data;
        let cancellen = 'tablist[2].len'
        console.log('已取消cancellist:', cancellist, cancellist.length, '需求id:', demandId)
        if (res.data.success) {
          if (cancellist.length != 0) {
            this.setData({
              cancellist: cancellist,
              cancelflag: true,
              demandflag: false,
              [cancellen]: cancellist.length
            })
          } else {
            this.setData({
              demandflag: false,
              cancelflag: false,
              [cancellen]: 0
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //获取已录取列表
  admission(token, demandId) {
    wx.request({
      url: url + '/employment/alreadyAdmission',
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        console.log(res.data.data)
        let sionlist = res.data.data;
        let sionlistlen = 'recruitlist[0].len'
        console.log('已录取admission:', sionlist, sionlist.length, '需求id:', demandId)
        if (res.data.success) {
          if (sionlist.length != 0) {
            this.setData({
              sionlist: sionlist,
              sionlflag: true,
              demandflag: false,
              [sionlistlen]: sionlist.length
            })
          } else {
            this.setData({
              demandflag: false,
              sionlflag: false,
              [sionlistlen]: 0
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //获取需求列表
  demandlist(token) {
    wx.request({
      url: url + '/demand/getMyDemands',
      data: {
        accessToken: token,
      },
      success: res => {
        console.log('需求列表:', res.data.data)
        let demandlist = res.data.data;
        if (res.data.success) {
          if (demandlist.length != 0) {
            this.setData({
              demandlist: demandlist,
              demand: demandlist[0],
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
  },

  //获取招聘列表
  demand1(token, demandId, website, list, len, dataflag, demandflag, txt) {
    console.log(token, demandId, website, list, len, dataflag, demandflag, txt)
    wx.request({
      url: url + website,
      data: {
        accessToken: token,
        demandId: demandId
      },
      success: res => {
        console.log(txt, res.data.data, res.data.data.length, '需求id:', demandId)
        if (res.data.success) {
          if (res.data.data.length != 0) {
            this.setData({
              [list]: res.data.data,
              [dataflag]: true,
              [demandflag]: false,
              [len]: res.data.data.length
            })
          } else {
            this.setData({
              [demandflag]: false,
              [dataflag]: false,
              [len]: 0
            })
          }
        } else {
          showToast(res.data.msg, 'none', 1000)
        }
      }
    })
  },

  //获取招聘进度列表
  post(token, demandId) {
    let demandflag = 'demandflag';

    let acceptlist = 'acceptlist';
    let acceptxt = '已报名acceptlist:';
    let acceptlen = 'tablist[0].len';
    let acceptwebsite = '/technology/acceptBusinessCards';
    let dataflag1 = 'accepflag';

    let sendlist = 'sendlist';
    let sendtxt = '待面试sendlist:';
    let sendlen = 'tablist[1].len';
    let sendwebsite = '/invitation/mySendInvitation';
    let dataflag2 = 'sendflag';

    let cancellist = 'cancellist';
    let canceltxt = '已取消cancellist:';
    let cancellen = 'tablist[2].len';
    let cancelwebsite = '/invitation/cancelInvitation';
    let dataflag3 = 'cancelflag';

    this.demand1(token, demandId, acceptwebsite, acceptlist, acceptlen, dataflag1, demandflag, acceptxt);
    this.demand1(token, demandId, sendwebsite, sendlist, sendlen, dataflag2, demandflag, sendtxt);
    this.demand1(token, demandId, cancelwebsite, cancellist, cancellen, dataflag3, demandflag, canceltxt);
  },

  //获取用工管理列表
  recruit(token, demandId) {
    let demandflag = 'demandflag';

    let sionlist = 'sionlist';
    let siontxt = '已录取admission:';
    let sionlen = 'recruitlist[0].len';
    let sionwebsite = '/employment/alreadyAdmission';
    let dataflag4 = 'accepflag';

    this.demand1(token, demandId, sionwebsite, sionlist, sionlen, dataflag4, demandflag, siontxt);
  },


  //打开选择需求
  tapjump() {
    this.setData({
      modalName: 'showModal',
      demandflag: true,
    })
  },

  //选择需求
  confirm(e) {
    this.hideModal();
    console.log('需求id:', e.currentTarget.dataset.demandid);
    let demandId = e.currentTarget.dataset.demandid;
    if (demandId != undefined) {
      let token = wx.getStorageSync('accessToken') || [];
      let managetxt = this.data.managetxt;
      this.setData({
        demandId: demandId,
      })
      if (managetxt == '用工管理') {
        this.recruit(token, demandId);
      } else if (managetxt == '招聘进度') {
        this.post(token, demandId);
      }
    } else {
      showToast('您还没有发布过职位需求!', 'none', 1000)
    }

  },

  //取消选择
  cancel() {
    this.hideModal();
    let token = wx.getStorageSync('accessToken') || [];
    let demand = this.data.demand;
    console.log('职位需求:', demand)
    if (demand != undefined) {
      let demandId = demand.demandId;
      let managetxt = this.data.managetxt;
      this.setData({
        demandId: demandId,
      })
      if (managetxt == '用工管理') {
        this.recruit(token, demandId);
      } else if (managetxt == '招聘进度') {
        this.post(token, demandId);
      }
    } else {
      console.log('您还没有发布过职位需求!', demand)
      showToast('您还没有发布过职位需求!', 'none', 1000)
    }
  },

  //关闭模拟框
  hideModal() {
    let TabCurs = this.data.TabCur;
    this.setData({
      modalName: null,
      demandflag: false,
      TabCur: TabCurs
    })
    pageScrollTo(0, 500);
  },

  //切换需求
  pichange(e) {
    let val = e.detail.value;
    console.log(val)
    this.setData({
      demand: this.data.demandlist[val]
    })
  },

  //刷新
  btnspin() {
    pageScrollTo(0, 500);
    let spin = this.data.spin;
    this.setData({
      spin: true,
      demandflag: true,
    })
    let token = wx.getStorageSync('accessToken') || [];
    setTimeout(() => {
      let demand = this.data.demand;
      if (demand != undefined) {
        let demandId = demand.demandId;
        let managetxt = this.data.managetxt;
        this.setData({
          demandId: demandId,
        })
        if (managetxt == '用工管理') {
          this.recruit(token, demandId);
        } else if (managetxt == '招聘进度') {
          this.post(token, demandId);
        }
        setTimeout(() => {
          this.setData({
            spin: false
          })
        }, 3900)

      } else {
        this.setData({
          spin: false,
          demandflag: false,
        })
        showToast('您还没有发布过职位需求!', 'none', 1000)
      }

    }, 1000)

  },

  ready() {
    setTimeout(() => {
      let token = wx.getStorageSync('accessToken') || [];
      let demand = this.data.demand;
      if (demand != undefined) {
        let demandId = demand.demandId;
        let managetxt = this.data.managetxt;
        this.setData({
          demandId: demandId,
        })
        if (managetxt == '用工管理') {
          this.recruit(token, demandId);
        } else if (managetxt == '招聘进度') {
          this.post(token, demandId);
        }
      }

    }, 1000)
  },

  nodata() {
    let acceptlen = 'tablist[0].len';
    let sendlen = 'tablist[1].len';
    let cancellen = 'tablist[2].len';
    let sionlistlen = 'recruitlist[0].len';
    setTimeout(() => {
      this.setData({
        accepflag: false,
        [acceptlen]: 0,
        sendflag: false,
        [sendlen]: 0,
        cancelflag: false,
        [cancellen]: 0,
        sionlflag: false,
        [sionlistlen]: 0
      })
    }, 1000)
  },

  load() {
    setTimeout(() => {
      this.setData({
        demandflag: false,
      })
      let loadflag = this.data.loadflag;
      if (!loadflag) {
        console.log('没有数据', loadflag)
        this.nodata()
      } else {
        console.log('有数据', loadflag)
        this.ready()
      }
    }, 500)
  },

  onLoad(options) {
    let token = wx.getStorageSync('accessToken') || [];
    this.demandlist(token);
    this.setData({
      managetxt: options.managetxt
    })
    if (options.managetxt == '用工管理') {

      this.setData({
        manageflag: false,
      })

      this.load()

    } else if (options.managetxt == '招聘进度') {

      this.setData({
        manageflag: true,
      })

      if (options.demandId != undefined && options.id != undefined) {

        console.log(options.demandId, options.id)
        setTimeout(() => {
          let demandlist = this.data.demandlist;
          let demands = demandlist.filter(function(elem, index, arr) {
            return elem.demandId == options.demandId
          });
          let demand = demands[0];
          console.log(demand)
          let demandId = demand.demandId;
          this.post(token, demandId);
          this.setData({
            demand: demand,
            demandId: demandId,
            TabCur: options.id,
          })
        }, 800)

      } else if (options.demandId == undefined && options.id == undefined) {

        console.log(options.demandId, options.id)
        this.load()

      } else if (options.id != undefined && options.demandId == undefined) {

        console.log(options.id)
        this.setData({
          TabCur: options.id,
        })
        this.load()

      } else if (options.id == undefined && options.demandId != undefined) {

        console.log(options.demandId)
        setTimeout(() => {
          let demandlist = this.data.demandlist;
          let demands = demandlist.filter(function(elem, index, arr) {
            return elem.demandId == options.demandId
          });
          let demand = demands[0];
          console.log(demand)
          let demandId = demand.demandId;
          this.post(token, demandId);
          this.setData({
            demand: demand,
            demandId: demandId,
          })
        }, 800)

      }
    }




  },

  onReady: function() {
    // setTimeout(() => {
    //   console.log(this.data.sionlflag)
    // }, 3000)

  },

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {
    this.btnspin()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})