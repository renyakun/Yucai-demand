// pages/demand/modify/modify.js
const app = getApp();
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  navigateTo,
  showLoading,
  relstradd,
} from '../../../utils/WeChatfction';
Page({
  data: {
    InputBottom: 0,
    jobName: '',
    jobType: '',
    jobNumber: '',
    jobRequire: '',
    label: '',
    salary: '',
    ageRequire: '',
    city: '',
    deadline: '',
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

  //修改
  request(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city, id, mobile, token) {
    setTimeout(() => {
      wx.hideLoading()
      console.log('岗位描述:', jobName, jobType, jobNumber, jobRequire, label);
      console.log('薪资设置:', salary, ageRequire, deadline, city);
      console.log('必需字段:', mobile, id);
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
          deadline: deadline,
          city: city,
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
            showToast(res.data.data, 'success', 500)
            setTimeout(() => {
              let demandId = this.data.demandId;
              navigateTo('/pages/demand/details/details?demandId=' + demandId);
            }, 800)
          } else {
            showToast('请输入完整信息', 'none', 1000)
          }
        }
      })
    }, 1000)
  },

  formSubmit(e) {
    let token = wx.getStorageSync('accessToken') || [];
    let demandlist = this.data.demandlist;
    let cur = this.data.cur;
    let jobName = demandlist.jobName;
    let jobType = demandlist.jobType;
    let jobNumber = demandlist.jobNumber;
    let jobRequire = demandlist.jobRequire;
    let label = demandlist.label;
    let salary = demandlist.salary;
    let ageRequire = demandlist.ageRequire;
    let deadline = demandlist.deadline;
    let city = demandlist.city;
    let mobile = demandlist.mobile;
    let id = demandlist.id;
    if (cur == 1) {
      let jobName = e.detail.value.jobName;

      let jobNumber = e.detail.value.jobNumber;
      let jobRequire = e.detail.value.jobRequire;
      let label = relstradd(this.data.jobtag);
      let jobind = this.data.jobind;
      if (jobind != null) {
        let jobType = this.data.jobpicker[e.detail.value.jobType];
        console.log('1', jobType);
        // console.log('岗位描述:', jobName, jobType, jobNumber, jobRequire, label);
        //console.log('薪资设置:', salary, ageRequire, deadline, city);
        // console.log('必需字段:', mobile, id);
        this.request(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city, id, mobile, token)
      } else {
        let jobType = demandlist.jobType;
        console.log('2', jobType);
        // console.log('岗位描述:', jobName, jobType, jobNumber, jobRequire, label);
        //console.log('薪资设置:', salary, ageRequire, deadline, city);
        // console.log('必需字段:', mobile, id);
        this.request(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city, id, mobile, token)
      }
      
    } else if (cur == 2) {

      let salary = e.detail.value.salary;
      let city = e.detail.value.city;
      let ageind = this.data.ageind;
      let deadind = this.data.deadind;

      if (ageind != null && deadind != null) {
        let ageRequire = this.data.agepicker[ageind];
        let deadline = e.detail.value.deadline;
        // console.log('1', ageRequire);
        // console.log('1', deadline);
        // console.log('岗位描述:', jobName, jobType, jobNumber, jobRequire, label);
        // console.log('薪资设置:', salary, ageRequire, deadline, city);
        // console.log('必需字段:', mobile, id);
        this.request(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city, id, mobile, token)
      } else if (ageind == null && deadind != null) {
        let ageRequire = demandlist.ageRequire;
        let deadline = e.detail.value.deadline;
        // console.log('2', ageRequire);
        // console.log('1', deadline);
        // console.log('岗位描述:', jobName, jobType, jobNumber, jobRequire, label);
        // console.log('薪资设置:', salary, ageRequire, deadline, city);
        // console.log('必需字段:', mobile, id);
        this.request(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city, id, mobile, token)
      } else if (ageind != null && deadind == null) {
        let ageRequire = this.data.agepicker[ageind];
        let deadline = demandlist.deadline;
        // console.log('1', ageRequire);
        // console.log('2', deadline);
        // console.log('岗位描述:', jobName, jobType, jobNumber, jobRequire, label);
        // console.log('薪资设置:', salary, ageRequire, deadline, city);
        // console.log('必需字段:', mobile, id);
        this.request(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city, id, mobile, token)
      } else if (ageind == null && deadind == null) {
        let ageRequire = demandlist.ageRequire;
        let deadline = demandlist.deadline;
        // console.log('2', ageRequire);
        // console.log('2', deadline);
        // console.log('岗位描述:', jobName, jobType, jobNumber, jobRequire, label);
        // console.log('薪资设置:', salary, ageRequire, deadline, city);
        // console.log('必需字段:', mobile, id);
        this.request(jobName, jobType, jobNumber, jobRequire, label, salary, ageRequire, deadline, city, id, mobile, token)
      }

    }
  },

  onLoad: function(options) {
    this.setData({
      jobtag: []
    })
    console.log(this.data.jobtag)
    this.setData({
      cur: options.cur,
      demandId: options.demandId
    })
    setTimeout(() => {
      let jobtag = wx.getStorageSync('jobtag') || [];
      let tagflag = this.data.tagflag;
      console.log(jobtag, tagflag)
      if (jobtag.length != 0) {
        this.setData({
          jobtag: jobtag,
          tagflag: true
        })
      } else {
        this.setData({
          tagflag: false
        })
      }
    }, 500)
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
          console.log(res.data.data)
          //let label = res.data.data.label.split(",");
          let len = res.data.data.jobRequire.length;
          let id = res.data.data.id;
          wx.hideLoading();
          this.setData({
            demandlist: res.data.data,
            ageRequire: res.data.data.ageRequire,
            txtput: len,
            id: id,
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
    wx.stopPullDownRefresh();
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