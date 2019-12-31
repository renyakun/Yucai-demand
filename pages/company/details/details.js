// pages/company/details/details.js
const app = getApp();
const {
  url
} = require('../../../utils/url.js');

import {
  showToast,
  navigateTo,
  switchTab,
  pageScrollTo,
  imgunique
} from '../../../utils/WeChatfction';

Page({
  data: {
    InputBottom: 0,
    cur: 1,
    companyNick: '',
    address: '',
    introduction: '',
    culture: '',
    intput: 0,
    culput: 0,
    imgList: [],
    listimg: [],
  },

  //字数管理
  intput(e) {
    //console.log(e.detail.value);
    let len = e.detail.value.length;
    let cur = this.data.cur;
    if (cur == 1) {
      this.setData({
        intput: len,
      })
    } else if (cur == 2) {
      this.setData({
        intxt: len,
      })
    }
    if (len > 499) {
      showToast('输入值字数最大为500！', 'none', 1000)
    }
  },

  culput(e) {
    //console.log(e.detail.value);
    let len = e.detail.value.length;
    let cur = this.data.cur;
    if (cur == 1) {
      this.setData({
        culput: len,
      })
    } else if (cur == 2) {
      this.setData({
        cultxt: len,
      })
    }
    if (len > 499) {
      showToast('输入值字数最大为500！', 'none', 1000)
    }
  },

  //图片路径转base64
  getFileSystemManager(url, num) {
    wx.getFileSystemManager().readFile({
      filePath: url, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        let base64 = 'data:image/png;base64,' + res.data;
        if (num == 1) {
          wx.setStorageSync('oneImage', base64)
          this.setData({
            oneImage: base64
          })
        } else if (num == 2) {
          wx.setStorageSync('twoImage', base64)
          this.setData({
            twoImage: base64
          })
        } else if (num == 3) {
          wx.setStorageSync('threeImage', base64)
          this.setData({
            threeImage: base64
          })
        } else if (num == 4) {
          wx.setStorageSync('fourImage', base64)
          this.setData({
            fourImage: base64
          })
        } else if (num == 5) {
          wx.setStorageSync('fiveImage', base64)
          this.setData({
            fiveImage: base64
          })
        }
      }
    })
  },

  //获取图片
  ChooseImage(e) {
    let type = e.currentTarget.dataset.target;
    wx.chooseImage({
      count: 5, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {

        if (type == 'imgList') {

          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFilePaths)
            })
          } else {
            this.setData({
              imgList: res.tempFilePaths
            })
          }
          let imgList = this.data.imgList;
          this.getFileSystemManager(imgList[0], 1);
          this.getFileSystemManager(imgList[1], 2);
          this.getFileSystemManager(imgList[2], 3);
          this.getFileSystemManager(imgList[3], 4);
          this.getFileSystemManager(imgList[4], 5);

        } else if (type == 'listimg') {

          if (this.data.listimg.length != 0) {
            this.setData({
              listimg: this.data.listimg.concat(res.tempFilePaths)
            })
          } else {
            this.setData({
              listimg: res.tempFilePaths
            })
          }
          let listimg = this.data.listimg;
          this.getFileSystemManager(listimg[0], 1);
          this.getFileSystemManager(listimg[1], 2);
          this.getFileSystemManager(listimg[2], 3);
          this.getFileSystemManager(listimg[3], 4);
          this.getFileSystemManager(listimg[4], 5);

        }

      }
    });
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

  //删除图片
  DelImg(e) {
    let type = e.currentTarget.dataset.target;
    wx.showModal({
      //title: '召唤师',
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          if (type == 'imgList') {
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
            })
          } else if (type == 'listimg') {
            this.data.listimg.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              listimg: this.data.listimg,
            })
          }
        }
      }
    })
  },

  // 判定输入为非空字符
  formSubmit(e) {
    //console.log(e.detail.target.dataset.target);
    let website = e.detail.target.dataset.target;
    let token = wx.getStorageSync('accessToken') || [];
    let companyNick = e.detail.value.companyNick;
    let address = e.detail.value.address;
    let introduction = e.detail.value.introduction;
    let culture = e.detail.value.culture;

    let oneImage = this.data.oneImage;
    let twoImage = this.data.twoImage;
    let threeImage = this.data.threeImage;
    let fourImage = this.data.fourImage;
    let fiveImage = this.data.fiveImage;
    
    console.log(oneImage, twoImage, threeImage, fourImage, fiveImage);
    console.log(companyNick, address, introduction, culture);

    if (companyNick == "" || address == "" || introduction == "" || culture == "") {
      showToast('请输入完整信息！', 'none', 1000)
    } else {
      wx.request({
        url: url + website,
        method: 'post',
        data: {
          companyNick: companyNick,
          address: address,
          introduction: introduction,
          culture: culture,
          oneImage: oneImage,
          twoImage: twoImage,
          threeImage: threeImage,
          fourImage: fourImage,
          fiveImage: fiveImage,
          accessToken: token,
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res)
          if (res.data.success) {
            showToast(res.data.data, 'success', 800);
            setTimeout(() => {
              this.setData({
                cur: 2
              })
              pageScrollTo(0, 1000)
            }, 1000)
          } else {
            showToast(res.data.msg, 'none', 1000)
          }
        }
      })
    }
  },


  //获取公司主页
  homepage(token) {
    wx.request({
      url: url + '/company/getCompanyHomepage',
      data: {
        accessToken: token,
      },
      success: res => {
        console.log(res.data.data)
        let details = res.data.data;
        let detailslen = res.data.data.length;
        let listimg = this.data.listimg;

        let oneImage = details.oneImage;
        let twoImage = details.twoImage;
        let threeImage = details.threeImage;
        let fourImage = details.fourImage;
        let fiveImage = details.fiveImage;

        // let oneImage = wx.getStorageSync('oneImage') || '';
        // let twoImage = wx.getStorageSync('twoImage') || '';
        // let threeImage = wx.getStorageSync('threeImage') || '';
        // let fourImage = wx.getStorageSync('fourImage') || '';
        // let fiveImage = wx.getStorageSync('fiveImage') || '';

        listimg.push(oneImage, twoImage, threeImage, fourImage, fiveImage);
        let listimgs = imgunique(listimg);
        console.log(listimgs);
        if (res.data.success) {
          if (detailslen != 0) {

            this.setData({
              details: details,
              intxt: details.introduction.length,
              cultxt: details.culture.length,
              listimg: listimgs
            })
          }
        } else {
          showToast(res.data.msg, 'none', 800);
        }
      }
    })
  },

  onLoad: function(options) {
    this.setData({
      cur: options.cur
    })
  },

  onReady: function() {

    let token = wx.getStorageSync('accessToken') || [];
    this.homepage(token);

  },

  onShow: function() {

  },

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