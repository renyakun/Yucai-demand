//app.js

const {
  url
} = require('utils/url.js');
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.checkSession({
      success(res) {
        //session_key 未过期，并且在本生命周期一直有效
        //console.log(res)
        console.log("处于登录态");
      },
      fail(res) {
        //console.log(res)
        // session_key 已经失效，需要重新执行登录流程
        console.log("需要重新登录");
        wx.login() //重新登录
      }
    })

    // 登录
    wx.login({
      success: res => {
        //wx.setStorageSync('code', res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //console.log('获取用户登录凭证：' + res.code);
          //发起网络请求
          let appid = 'wxef80070bd7008e35';
          let secret = '5798f7522788d663b49c7da765bcb371';
          wx.request({
            url: url + '/user/wx/login',
            method: 'POST',
            data: {
              code: res.code,
              appid: appid,
              secret: secret
            },
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              console.log(res)
              wx.setStorageSync('accessToken', res.data.data.accessToken)
            },
            fail: res => {
              console.log(res);
              console.log('is failed')
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('unionId', res.userInfo)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //获取地理位置
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success() {
    //           wx.chooseLocation({
    //             success(res) {
    //               console.log(res.address)
    //               console.log(this.globalData)
    //               this.globalData.address = res.address;
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })


  },
  globalData: {
    userInfo: null,
    //招聘进度
    tablist: [{
      id: 1,
      icon: 'edit',
      color: '#0081ff',
      flag: '已报名',
      len: 0
    }, {
      id: 2,
      icon: 'form',
      color: '#0081ff',
      flag: '待面试',
      len: 0
    }, {
      id: 3,
      icon: 'backdelete',
      color: '#0081ff',
      flag: '已取消',
      len: 0
    }],
    recruitlist: [{
      id: 1,
      icon: 'backdelete',
      color: '#0081ff',
      flag: '已录取',
      len: 0
    }, {
      id: 2,
      icon: 'backdelete',
      color: '#0081ff',
      flag: '已入职',
      len: 0
    }, {
      id: 3,
      icon: 'backdelete',
      color: '#0081ff',
      flag: '已支付',
      len: 0
    }],
    navList: [{
        id: 1,
        icon: 'cartfill',
        name: "已推送",
        num: 25,
      },
      {
        id: 2,
        icon: 'upstagefill',
        name: "店铺关注",
        num: 75,
      },
      {
        id: 3,
        icon: 'clothesfill',
        name: "足迹",
        num: 12,
      }
    ],
    atteslist: [{
      icon: 'profilefill',
      name: 'certification',
      color: 'cyan',
      badge: 0,
      title: '认证信息',
    }, {
      icon: 'vipcard',
      color: 'orange',
      name: 'authentication',
      badge: 0,
      title: '企业认证'
    }],
    demandlist: [{
      icon: 'repeal',
      name: 'lauched',
      color: 'blue',
      badge: 0,
      title: '已发布',
    }],
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
    newslist: [{
        id: 1,
        name: '评论消息通知',
        icon: 'message',
      }
      // , {
      //   id: 2,
      //   name: '面试邀请通知',
      //   icon: 'message',
      // }, {
      //   id: 3,
      //   name: '评论消息通知',
      //   icon: 'message',
      // }
      //  {
      //   id: 3,
      //   icon: 'squarecheck',
      //   color: '#0081ff',
      //   flag: '已录取',
      //   len: 0
      // },
    ],
  }
})