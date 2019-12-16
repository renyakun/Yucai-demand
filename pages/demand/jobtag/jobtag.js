// pages/demand/jobtag/jobtag.js
const app = getApp();
const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  navigateTo,
  switchTab,
  relunique,
  relremovetag,
  randomColor,
  tagunique
} from '../../../utils/WeChatfction';

Page({
  data: {
    InputBottom: 0,
    tagflag: true,
    txtput: 0,
    taglist: app.globalData.taglist,
    jobtag: [],
    tagnum: 0
  },

  //开启模态框
  custom(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  //关闭模态框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  //标签管理
  jobtab(e) {
    let jobtag = this.data.jobtag;
    let taglist = this.data.taglist;
    let jobitem = e.currentTarget.dataset.target;
    jobtag.unshift(jobitem);
    let jobtags = relunique(jobtag);
    let len = jobtags.length;
    if (len > 5) {
      showToast('最多选择5个!', 'none', 1000)
    } else if (len <= 5) {
      this.setData({
        jobtag: jobtags,
        tagnum: len,
        taglist: taglist
      })
      console.log(jobtags)
    }

  },

  //删除已选择的tag
  tagdel(e) {
    let jobtag = this.data.jobtag;
    let jobitem = e.currentTarget.dataset.target;
    relremovetag(jobtag, jobitem);
    let jobtags = relunique(jobtag);
    let len = jobtags.length;
    this.setData({
      jobtag: jobtags,
      tagnum: len
    })
    console.log(jobtags)
  },

  //字数管理
  textareaBInput(e) {
    let val = e.detail.value;
    let len = val.length;
    this.setData({
      txtput: len,
      val: val
    })
    if (len > 19) {
      showToast('输入值字数最大为20！', 'none', 1000)
    }
  },

  //添加标签
  addtag() {
    let val = this.data.val;
    let taglist = this.data.taglist;
    console.log(val)
    if (val != '') {
      let jobitem = {};
      jobitem.color = randomColor();
      jobitem.title = val;
      taglist.push(jobitem);
      let taglists = tagunique(taglist);
      this.setData({
        taglist: taglists,
        val: ''
      })
      this.hideModal()
    } else {
      showToast('请输入标签！', 'none', 1000)
    }

  },

  //保存
  btnadd() {
    let jobtag = this.data.jobtag;
    wx.setStorageSync('jobtag', jobtag);
    let cur = this.data.cur;
    let demandId = this.data.demandId;
    console.log(cur, demandId);
    if (cur != undefined && demandId != undefined) {
      navigateTo('/pages/demand/modify/modify?demandId=' + demandId + '&&cur=' + cur)
    } else {
      switchTab('/pages/index/index')
    }
  },



  onLoad: function(options) {
    console.log(options)
    this.setData({
      cur: options.cur,
      demandId: options.demandId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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