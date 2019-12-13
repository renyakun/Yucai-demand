// pages/demand/modify/modify.js
const app = getApp();
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  pageScrollTosel,
  switchTab,
  navigateTo,
  showLoading,
  relunique,
  relremovetag,
  relstradd,
} from '../../../utils/WeChatfction';
Page({
  data: {
    InputBottom: 0,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    proList: null,
    TabCur: 1,
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
    taglist: app.globalData.taglist,
    jobtag: [],
    tagflag: false,
    txtput: 0,
    demandflag: true,
    switchflag: false
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

  //标签跳转
  tagjump() {
    let cur = this.data.cur;
    let demandId = this.data.demandId;
    navigateTo('/pages/demand/jobtag/jobtag?cur=' + cur + '&&demandId=' + demandId)
  },


  formSubmit(e) {
    let token = wx.getStorageSync('accessToken') || [];
    let demandlist = this.data.demandlist;
    let cur = this.data.cur;
    //if (cur == 1) {
    let jobName = e.detail.value.jobName;
    let jobType = this.data.jobpicker[e.detail.value.jobType];
    let jobNumber = e.detail.value.jobNumber;
    let jobRequire = e.detail.value.jobRequire;
    let salary = demandlist.salary;
    let ageRequire = demandlist.ageRequire;
    let city = demandlist.city;
    let address = e.detail.value.address;
    let deadline = demandlist.deadline;
    let mobile = demandlist.mobile;
    let jobtag = this.data.jobtag;
    let label = relstradd(jobtag);
    let id = this.data.id;
    //} 
    // else if (cur == 2) {
    //   let jobName = demandlist.jobName;
    //   let jobType = demandlist.jobType;
    //   let jobNumber = demandlist.jobNumber;
    //   let jobRequire = demandlist.jobRequire;
    //   let salary = e.detail.value.salary;
    //   let ageRequire = this.data.agepicker[e.detail.value.ageRequire];
    //   let city = demandlist.city;
    //   let address = e.detail.value.address;
    //   let deadline = e.detail.value.deadline;
    //   let mobile = demandlist.mobile;
    //   let label = demandlist.label;
    //   let id = this.data.id;
    // }

    console.log(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city, mobile);
    if (jobName == "" || jobType == undefined || jobNumber == "" || salary == "" || ageRequire == undefined || city == undefined || deadline == undefined || mobile == "" || address == "") {
      showToast('请输入完整信息！', 'none', 1000)
    } else {
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(() => {
        wx.hideLoading()
        console.log(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city, mobile, );
        wx.request({
          url: url + '/demand/updateMyDemand',
          method: 'post',
          data: {
            jobName: jobName,
            jobType: jobType,
            jobNumber: jobNumber,
            jobRequire: jobRequire,
            label: label,
            salary: salary,
            ageRequire: ageRequire,
            city: city,
            deadline: deadline,
            mobile: mobile,
            id: id,
            accessToken: token,
          },
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            console.log(res)
            if (res.data.success) {
              showToast(res.data.data, 'success', 1000)
              setTimeout(() => {
                // this.setData({
                //   TabCur: 1,
                //   title: '需求详情'
                // })
                let demandId = this.data.demandId;
                navigateTo('/pages/demand/details/details?demandId=' + demandId);
              }, 500)
              // setTimeout(() => {
              //   this.onReady()
              // }, 1000)
            } else {
              showToast(res.data.msg, 'none', 1000)
            }
          }
        })
      }, 1000)


    }
  },



  onLoad: function(options) {
    //console.log(options)
    this.setData({
      cur: options.cur,
      demandId: options.demandId
    })
    let jobtag = wx.getStorageSync('jobtag') || [];
    let tagflag = this.data.tagflag;
    console.log(jobtag, tagflag)
    if (jobtag != []) {
      this.setData({
        jobtag: jobtag,
        tagflag: true
      })
    } else {
      this.setData({
        tagflag: false
      })
    }
  },

  onReady: function() {

    console.log(this.data.demandId)
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      //wx.removeStorage('jobtag');
      let jobtag = [];
      wx.setStorageSync('jobtag', jobtag)
      let token = wx.getStorageSync('accessToken') || [];
      let demandId = this.data.demandId;
      wx.request({
        url: url + '/demand/getDemandById',
        data: {
          accessToken: token,
          demandId: demandId
        },
        success: res => {
          //console.log(res.data.data)
          let label = res.data.data.label.split(",");
          let address = res.data.data.city;
          let jobType = res.data.data.jobType;
          let ageRequire = res.data.data.ageRequire;
          let deadline = res.data.data.deadline;
          let len = res.data.data.jobRequire.length;
          let id = res.data.data.id;
          wx.hideLoading();
          this.setData({
            demandlist: res.data.data,
            label: label,
            txtput: len,
            id: id,
            jobType: jobType,
            ageRequire: ageRequire,
            deadline: deadline
          })
        }
      })
    }, 500)

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