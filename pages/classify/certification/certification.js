// pages/classify/certification/certification.js

const {
  url
} = require('../../../utils/url.js');
import {
  showToast,
  showModal,
  navigateTo,
  pageScrollTo,
  imgunique
} from '../../../utils/WeChatfction';

Page({

  data: {
    TabCur: 1,
    tokendata: {},
    enterprise: {},
    demandflag: true,
    listimg:[],
    newobj:{}
  },

  ViewImage(e) {
    let type = e.currentTarget.dataset.target;
    let url = e.currentTarget.dataset.url;
    console.log(e)
    if (type == 'imgList') {
      wx.previewImage({
        urls: this.data.imgList,
        current: url
      });
    } else if (type == 'listimg') {
      wx.previewImage({
        urls: this.data.listimg,
        current: url
      });
    }

  },

  request(token) {
    setTimeout(() => {
      wx.request({
        url: url + '/user/UserCertification',
        data: {
          accessToken: token,
        },
        success: res => {
          wx.setStorageSync('token', res);
          if (res.data.success) {
            this.setData({
              tokendata: res.data.data,
              demandflag: false,
            })
          }
        }
      })
      wx.request({
        url: url + '/company/companyCertification',
        data: {
          accessToken: token,
        },
        success: res => {
          wx.setStorageSync('tokenmsg', res)
          if (res.data.success) {
            this.setData({
              enterprise: res.data.data,
              demandflag: false,
            })
          }
        }
      })
    }, 500)
  },

  //获取公司主页
  homepage(token) {
    wx.request({
      url: url + '/company/getCompanyHomepage',
      data: {
        accessToken: token,
      },
      success: res => {
        console.log(typeof(res.data.data))
        let details = res.data.data;
        let detailslen = res.data.data.length;
        let listimg = this.data.listimg;
        let oneImage = wx.getStorageSync('oneImage') || '';
        let twoImage = wx.getStorageSync('twoImage') || '';
        let threeImage = wx.getStorageSync('threeImage') || '';
        let fourImage = wx.getStorageSync('fourImage') || '';
        let fiveImage = wx.getStorageSync('fiveImage') || '';
        //console.log(oneImage, twoImage, threeImage, fourImage, fiveImage)
        listimg.push(oneImage, twoImage, threeImage, fourImage, fiveImage);
        let listimgs = imgunique(listimg);
        //console.log(listimgs);
        if (res.data.success) {
          if (detailslen != 0) {
            this.setData({
              details: details,
              detailsflag: false,
              listimg: listimgs
            })
          }
        } else {
          let details = {};
          this.setData({
            details: details,
            detailsflag: true
          })
        }
      }
    })
  },

  onLoad: function(options) {
    this.setData({
      title: options.title,
      TabCur: options.cur,
    })
    let tokendata = this.data.tokendata;
    if (tokendata=={}){
      showModal('您还未进行实名认证,请先实名认证', 'RealName', '实名认证')
    }
  },



  onReady: function() {
    let token = wx.getStorageSync('accessToken') || [];
    this.request(token);
    this.homepage(token);
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