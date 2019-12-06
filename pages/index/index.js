//index.js
const app = getApp();
const {
  url
} = require('../../utils/url.js');

import {
  showToast,
  showModal,
  pageScrollTo,
  switchTab,
  relunique,
  relremovetag,
  relstradd,
  setBarTitle
} from '../../utils/WeChatfction';

Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    proList: null,
    TabCur: 1,
    tablist: [{
      id: 1,
      nav: '招聘'
    }, {
      id: 2,
      nav: '房产'
    }],
    jobName: '',
    jobType: '',
    jobNumber: '',
    jobRequire: '',
    label: '',
    salary: '',
    ageRequire: '',
    city: '',
    address: '',
    deadline: '',
    releaseType: '',
    mobile: '',
    check: true,
    ind: null,
    jobind: null,
    ageind: null,
    cityind: null,
    deadind: null,
    citypicker: ['广东省', '广州市', '海珠区'],
    jobpicker: ['普工', '合同工', '暑假工', '学生工'],
    agepicker: ['18~30', '20~40', '18~40', '30~50'],
    taglist: [{
      color: '#e54d42',
      title: '五险一金'
    }, {
      color: '#1cbbb4',
      title: '包底'
    }, {
      color: '#fbbd08',
      title: '包吃'
    }, {
      color: '#39b54a',
      title: '年底双薪'
    }, {
      color: '#9c26b0',
      title: '加班补助'
    }, {
      color: '#0081ff',
      title: '周末双休'
    }],
    jobtag: [],
    tagflag: true,
    txtput: 0
  },

  //tab跳转
  tabSelect(e) {
    let TabCurs = e.currentTarget.dataset.id
    if (TabCurs == 1) {
      this.setData({
        TabCur: TabCurs,
      })
    } else {
      showToast('即将上线，敬请期待!', 'none', 3000)
    }
  },

  jobPicker(e) {
    this.setData({
      jobind: e.detail.value
    })
  },
  agePicker(e) {
    this.setData({
      ageind: e.detail.value
    })
  },
  cityPicker(e) {
    this.setData({
      citypicker: e.detail.value
    })
  },
  deadPicker(e) {
    this.setData({
      deadind: e.detail.value
    })
  },

  //获取认证状态值
  relradio(e) {
    let tokenmsg = wx.getStorageSync('tokenmsg') || [];
    let val = e.detail.value;
    if (val == "企业" && tokenmsg.data.msg == "您还未进行企业认证") {
      wx.showModal({
        title: '提示',
        content: '您还未进行企业认证,请先认证',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/classify/authentication/authentication?title=' + '企业入驻',
            })
          } else if (res.cancel) {
            // this.setData({
            //   check: true,
            // })
          }
        }
      })
    }
  },

  //标签管理
  jobtab(e) {
    let jobtag = this.data.jobtag;
    let taglist = this.data.taglist;
    let jobitem = e.currentTarget.dataset.target;
    if (taglist.length === 1) {
      this.setData({
        tagflag: false,
      })
    }
    relremovetag(taglist, jobitem);
    jobtag.unshift(jobitem);
    let jobtags = relunique(jobtag);
    this.setData({
      jobtag: jobtags,
      taglist: taglist
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
      showToast('输入值字数最大为500！', 'none', 3000)
    }
  },


  // 判定输入为非空字符
  formSubmit(e) {
    let accessToken = wx.getStorageSync('accessToken') || [];
    let jobName = e.detail.value.jobName;
    let jobType = this.data.jobpicker[e.detail.value.jobType];
    let jobNumber = e.detail.value.jobNumber;
    let jobRequire = e.detail.value.jobRequire;
    let salary = e.detail.value.salary;
    let ageRequire = this.data.agepicker[e.detail.value.ageRequire];
    let city = e.detail.value.city[0] + e.detail.value.city[1] + e.detail.value.city[2];
    let address = e.detail.value.address;
    let deadline = e.detail.value.deadline;
    let releaseType = e.detail.value.releaseType;
    let mobile = e.detail.value.mobile;
    let jobtag = this.data.jobtag;
    let label = relstradd(jobtag);
    if (jobName == "" || jobType == undefined || jobNumber == "" || salary == "" || ageRequire == undefined || city == undefined || deadline == undefined || mobile == "" || address == "") {
      showToast('请输入完整信息！', 'none', 3000)
    } else {
      console.log(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city + address, mobile, releaseType);
      wx.request({
        url: url + '/demand/add',
        method: 'post',
        data: {
          jobName: jobName,
          jobType: jobType,
          jobNumber: jobNumber,
          jobRequire: jobRequire,
          label: label,
          salary: salary,
          ageRequire: ageRequire,
          city: city + address,
          deadline: deadline,
          releaseType: releaseType,
          mobile: mobile,
          accessToken: accessToken,
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res.data)
          if (res.data.success) {
            showToast(res.data.data, 'success', 3000);
            setTimeout(() => {
              switchTab('/pages/user/user/user');
            }, 3000)
            this.reset();
          } else {
            showModal(res.data.msg, 'RealName', '实名认证')
          }
        }
      })
    }
  },

  formReset() {
    console.log('form发生了reset事件')
  },

  reset() {
    this.setData({
      jobName: '',
      jobType: '',
      jobNumber: '',
      jobRequire: '',
      label: '',
      salary: '',
      ageRequire: '',
      city: '',
      address: '',
      deadline: '',
      releaseType: '',
      mobile: '',
      check: true,
    })
  },

  onLoad: function(options) {
    // let mobile = wx.getStorageSync('mobile') || {};
    // console.log(mobile);
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

  },


  onReachBottom: function() {

  },


  onShareAppMessage: function() {

  }
})