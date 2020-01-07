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
    sendflag: true,
    cancelflag: true,
    plflag: false,
    timerval: [0],
    demandlist: [],
    manageflag: true,
    sionlflag: true,
    evalflag: true,
    page: 2,
    acceptlist: [],
    sendlist: [],
    cancellist: [],
    sionlist: [],
    alreadylist: [],
    evallist: [],
  },

  touchmove() {
    return false;
  },

  //tab切换
  tabSelect(e) {
    pageScrollTo(0, 500);
    let id = e.currentTarget.dataset.id;
    this.setData({
      TabCur: id,
      scrollLeft: (id - 1) * 60,
    })
    setTimeout(() => {
      this.setData({
        demandflag: true
      })
    }, 100)
    //this.readys(1, id)
    this.load(1, id)
  },

  //详情跳转
  cardel(e) {
    let cur = e.currentTarget.dataset.cur;
    let id = e.currentTarget.dataset.id;
    let demandId = this.data.demandId;
    let manageflag = this.data.manageflag;
    let userid = e.currentTarget.dataset.userid;
    let realName = e.currentTarget.dataset.realname;
    if (manageflag) {
      if (cur == 1) {
        console.log(id, cur, userid, demandId)
        navigateTo('/pages/manage/carddetails/carddetails?id=' + id + '&cur=' + cur + '&userid=' + userid + '&demandId=' + demandId)
      } else if (cur == 2) {
        console.log(id, cur, userid, demandId)
        navigateTo('/pages/manage/carddetails/carddetails?id=' + id + '&cur=' + cur + '&userid=' + userid + '&demandId=' + demandId)
      }
    } else {
      if (cur == 1) {
        console.log(id, userid, demandId)
        navigateTo('/pages/manage/carddetails/carddetails?id=' + id + '&userid=' + userid + '&cur=3&demandId=' + demandId)
      } else if (cur == 2) {
        console.log(id, userid, demandId)
        navigateTo('/pages/manage/carddetails/carddetails?id=' + id + '&userid=' + userid + '&cur=4&demandId=' + demandId)
      }
    }
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
  demand(token, demandId, website, list, len, dataflag, txt, page) {
    wx.request({
      url: url + website,
      data: {
        accessToken: token,
        demandId: demandId,
        page: page,
      },
      success: res => {
        if (page <= 1) {
          console.log(txt, res.data.data, res.data.data.length, '需求id:', demandId, 'page:', page);
          let demand = res.data.data;
          if (res.data.success) {
            if (demand.length != 0) {
              this.setData({
                [list]: demand,
                [dataflag]: true,
                demandflag: false,
                [len]: demand.length
              })
            } else {
              this.setData({
                demandflag: false,
                [dataflag]: false,
                [len]: 0
              })
            }
          } else {
            showToast(res.data.msg, 'none', 1000)
          }
        } else {
          let demands = res.data.data;
          console.log(txt, demands, demands.length, '需求id:', demandId, 'page:', page);
          let demand = [];
          switch (list) {
            case 'acceptlist':
              demand = this.data.acceptlist;
              break;
            case 'sendlist':
              demand = this.data.sendlist;
              break;
            case 'cancellist':
              demand = this.data.cancellist;
              break;
            case 'sionlist':
              demand = this.data.sionlist;
              break;
            case 'alreadylist':
              demand = this.data.alreadylist;
              break;
            case 'evallist':
              demand = this.data.evallist;
              break;
            default:
              demand = [];
          }
          console.log('加载数据', txt, demand)
          if (demands.length != 0) {
            if (res.data.success) {
              if (demands.length != 0) {
                showToast('加载数据中...', 'none', 800);
                demand.push(...demands)
                this.setData({
                  [list]: demand,
                  [dataflag]: true,
                  demandflag: false,
                  [len]: demand.length + demands.length
                })
              } else {
                this.setData({
                  demandflag: false,
                  [dataflag]: false,
                  [len]: demand.length
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

  //获取招聘进度列表
  post(token, demandId, page, id) {
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

    if (id == 1) {
      this.demand(token, demandId, acceptwebsite, acceptlist, acceptlen, dataflag1, acceptxt, page);
    } else if (id == 2) {
      this.demand(token, demandId, sendwebsite, sendlist, sendlen, dataflag2, sendtxt, page);
    } else if (id == 3) {
      this.demand(token, demandId, cancelwebsite, cancellist, cancellen, dataflag3, canceltxt, page);
    }
  },

  //获取用工管理列表
  recruit(token, demandId, page, id) {
    let sionlist = 'sionlist';
    let siontxt = '已录取admission:';
    let sionlen = 'recruitlist[0].len';
    let sionwebsite = '/employment/alreadyAdmission';
    let dataflag4 = 'sionflag';

    let alreadylist = 'alreadylist';
    let alreadytxt = '已完成alreadylist:';
    let alreadylen = 'recruitlist[1].len';
    let alreadywebsite = '/employment/alreadyFinish';
    let dataflag5 = 'alreadyflag';

    let evallist = 'evallist';
    let evaltxt = '已评价evallist:';
    let evallen = 'recruitlist[2].len';
    let evalwebsite = '/evaluation/alreadyEvaluationUser';
    let dataflag6 = 'evalflag';

    if (id == 1) {
      this.demand(token, demandId, sionwebsite, sionlist, sionlen, dataflag4, siontxt, page);
    } else if (id == 2) {
      this.demand(token, demandId, alreadywebsite, alreadylist, alreadylen, dataflag5, alreadytxt, page);
    } else if (id == 3) {
      this.demand(token, demandId, evalwebsite, evallist, evallen, dataflag6, evaltxt, page);
    }
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
    let page = 1;
    let id = this.data.TabCur;
    if (demandId != undefined) {
      let token = wx.getStorageSync('accessToken') || [];
      let managetxt = this.data.managetxt;
      this.setData({
        demandId: demandId,
      })
      if (managetxt == '用工管理') {
        this.recruit(token, demandId, page, id);
      } else if (managetxt == '合作进度') {
        this.post(token, demandId, page, id);
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
    let page = 1;
    let id = this.data.TabCur;
    console.log('职位需求:', demand)
    console.log('page為:', page)
    if (demand != undefined) {
      let demandId = demand.demandId;
      let managetxt = this.data.managetxt;
      this.setData({
        demandId: demandId,
      })
      if (managetxt == '用工管理') {
        this.recruit(token, demandId, page, id);
      } else if (managetxt == '合作进度') {
        this.post(token, demandId, page, id);
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
    let page = 1;
    let id = this.data.TabCur;
    this.setData({
      spin: true,
      demandflag: true,
      page: 2
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
          this.recruit(token, demandId, page, id);
        } else if (managetxt == '合作进度') {
          this.post(token, demandId, page, id);
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

  readys(page, id) {
    setTimeout(() => {
      let token = wx.getStorageSync('accessToken') || '';
      let demand = this.data.demand;
      if (demand != undefined) {
        let demandId = demand.demandId;
        let managetxt = this.data.managetxt;
        this.setData({
          demandId: demandId,
        })
        if (managetxt == '用工管理') {
          this.recruit(token, demandId, page, id);
        } else if (managetxt == '合作进度') {
          this.post(token, demandId, page, id);
        }
      }
    }, 1000)
  },

  nodata() {
    let acceptlen = 'tablist[0].len';
    let sendlen = 'tablist[1].len';
    let cancellen = 'tablist[2].len';
    let sionlistlen = 'recruitlist[0].len';
    let alreadylen = 'recruitlist[1].len';
    let evallen = 'recruitlist[2].len';
    setTimeout(() => {
      this.setData({
        accepflag: false,
        [acceptlen]: 0,
        sendflag: false,
        [sendlen]: 0,
        cancelflag: false,
        [cancellen]: 0,
        sionlflag: false,
        [sionlistlen]: 0,
        alreadyflag: false,
        [alreadylen]: 0,
        evalflag: false,
        [evallen]: 0
      })
    }, 1000)
  },

  load(page, id) {
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
        this.readys(page, id)
      }
    }, 500)
  },

  //获取招聘进度列表
  switching(options, page, token) {
    if (options.demandId != undefined && options.id != undefined) {

      console.log(options.demandId, options.id, page)
      setTimeout(() => {
        let demandlist = this.data.demandlist;
        let demands = demandlist.filter(function(elem, index, arr) {
          return elem.demandId == options.demandId
        });
        let demand = demands[0];
        console.log(demand)
        let demandId = demand.demandId;
        this.post(token, demandId, page, options.id);
        this.setData({
          demand: demand,
          demandId: demandId,
          TabCur: options.id,
        })
      }, 800)

    } else if (options.demandId == undefined && options.id == undefined) {

      console.log(options.demandId, options.id, page)
      let id=1;
      this.load(page, id)

    } else if (options.id != undefined && options.demandId == undefined) {

      console.log(options.id, page)
      this.setData({
        TabCur: options.id,
      })
      this.load(page, options.id)

    } else if (options.id == undefined && options.demandId != undefined) {

      console.log(options.demandId, page)
      setTimeout(() => {
        let demandlist = this.data.demandlist;
        let demands = demandlist.filter(function(elem, index, arr) {
          return elem.demandId == options.demandId
        });
        let demand = demands[0];
        console.log(demand)
        let demandId = demand.demandId;
        let id = 1;
        this.post(token, demandId, page,id);
        this.setData({
          demand: demand,
          demandId: demandId,
        })
      }, 800)

    }
  },

  //获取用工管理列表
  changeing(options, page, token) {
    if (options.id != undefined && options.demandId != undefined) {
      console.log(options.demandId, options.id, page)
      setTimeout(() => {
        let demandlist = this.data.demandlist;
        let demands = demandlist.filter(function(elem, index, arr) {
          return elem.demandId == options.demandId
        });
        let demand = demands[0];
        console.log(demand)
        let demandId = demand.demandId;
        this.recruit(token, demandId, page, options.id);
        this.setData({
          demand: demand,
          demandId: demandId,
          TabCur: options.id,
        })
      }, 800)

    } else if (options.id != undefined && options.demandId == undefined) {
      console.log(options.id, options.demandId,page)
      this.setData({
        TabCur: options.id,
      })
      this.load(page, options.id)
    } else if (options.demandId == undefined && options.id == undefined) {

      console.log(options.demandId, options.id, page)
      let id = 1;
      this.load(page, id)

    }
  },

  onLoad(options) {
    let token = wx.getStorageSync('accessToken') || '';
    let page = this.data.page - 1;
    this.demandlist(token);
    console.log(options)
    this.setData({
      managetxt: options.managetxt
    })
    if (options.managetxt == '用工管理') {
      this.setData({
        manageflag: false,
      })
      this.changeing(options, page, token)

    } else if (options.managetxt == '合作进度') {
      this.setData({
        manageflag: true,
      })
      this.switching(options, page, token)
    }




  },

  onReady: function() {},

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {
    this.btnspin()
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {
    let page = this.data.page++;
    let id = this.data.TabCur;
    this.readys(page, id)
  },

  onShareAppMessage: function() {

  }
})