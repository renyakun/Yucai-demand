//显示消息提示框
function showToast(tit, icon, timer) {
  wx.showToast({
    title: tit,
    icon: icon,
    duration: timer
  })
};

//页面跳转
function pagesurl(name, title, cur) {
  wx.navigateTo({
    url: '/pages/classify/' + name + '/' + name + '?title=' + title + '&&cur=' + cur,
  });
};

//数组选择
function fiflet(arr, value) {
  for (var i = 0, vlen = arr.length; i < vlen; i++) {
    if (arr[i] == value) {
      return i;
    }
  }
  return -1;
};

//显示模态对话框
function showModal(msg, name, title) {
  wx.showModal({
    title: '提示',
    content: msg,
    success(res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '/pages/classify/' + name + '/' + name + '?title=' + title,
        })
      } else if (res.cancel) {}
    }
  })
};

//显示 loading 提示框
function showLoading() {
  wx.showLoading({
    title: '加载中',
  });
  setTimeout(() => {
    wx.hideLoading()
  }, 500);
};

//应用页面跳转
function navigateTo(url) {
  wx.navigateTo({
    url: url,
  });
};

//tab页面跳转
function switchTab(url) {
  wx.switchTab({
    url: url,
  });
};

//页面返回
function navigateBack() {
  setTimeout(() => {
    wx.navigateBack({
      delta: 1
    })
  }, 3500)
};

//页面滚动
function pageScrollTo(gap, time) {
  wx.pageScrollTo({
    scrollTop: gap,
    duration: time
  })
};

//页面指定位置滚动
function pageScrollTosel(cls, time) {
  wx.pageScrollTo({
    selector: cls,
    duration: time
  })
};


//数组tag去重
function relunique(ary) {
  let newAry = [];
  for (var i = 0; i < ary.length; i++) {
    var flag = true;
    for (var j = 0; j < newAry.length; j++) {
      if (ary[i].title == newAry[j].title) {
        flag = false;
      };
    };
    if (flag) {
      newAry.push(ary[i]);
    };
  };
  return newAry;
};

//随机生成颜色
function randomColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return "rgb(" + r + "," + g + "," + b + ")";
}

//数组tag添加去重
function tagunique(ary) {
  let newAry = [];
  for (var i = 0; i < ary.length; i++) {
    var flag = true;
    for (var j = 0; j < newAry.length; j++) {
      if (ary[i].title == newAry[j].title) {
        flag = false;
      };
    };
    if (flag) {
      newAry.push(ary[i]);
    } else {
      console.log('已经添加过了')
      wx.showToast({
        title: '已经添加过了',
        icon: 'none',
        duration: 3000
      })
    };
  };
  return newAry;
};

//数组查找指定元素
function seaunique(ary) {
  let newAry = [];
  for (let i = 0; i < ary.length; i++) {
    if (newAry.indexOf(ary[i]) === -1) {
      newAry.push(ary[i]);
    }
  }
  return newAry;
};

//删除数组内指定标签
function relremovetag(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].color == val.color) {
      arr.splice(i, 1);
      break;
    }
  }
};

//删除数组内指定元素
function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
};

function relstradd(arr) {
  let str = "";
  for (var i = 0; i < arr.length; i++) {
    str = str + arr[i].title + ",";
  }
  return str.substring(0, str.length - 1);
};

//联系电话
function makePhoneCall(mobile) {
  wx.makePhoneCall({
    phoneNumber: mobile,
    success: (res) => {
      console.log(res)
    },
    fail: (res) => {
      console.log(res)
    }
  })
};

//星级处理
function selstar(item) {
  let star = [];
  for (let i in item) {
    star.push(item[i].star);
  }
  let stars = star.reduce((a, b) => {
    return a + b
  })
  return stars;
};


//userids处理
function seluser(item) {
  let userIds = [];
  for (let i in item) {
    userIds.push(item[i].userId);
  }
  return userIds;
};


//数组图片去重
function imgunique(ary) {
  let newAry = [];
  for (var i = 0; i < ary.length; i++) {
    var flag = true;
    for (var j = 0; j < newAry.length; j++) {
      if (ary[i] == newAry[j]) {
        flag = false;
      };
    };
    if (flag) {
      if (ary[i] != null) {
        newAry.push(ary[i]);
      }
    };
  };
  return newAry;
};


export {
  showToast,
  pagesurl,
  fiflet,
  showModal,
  navigateTo,
  switchTab,
  navigateBack,
  showLoading,
  pageScrollTo,
  pageScrollTosel,
  relunique,
  seaunique,
  relremovetag,
  removeByValue,
  relstradd,
  makePhoneCall,
  selstar,
  seluser,
  randomColor,
  tagunique,
  imgunique,
};






// let unionId = wx.getStorageSync('unionId') || {};
// let img = 'imgList[0]'
// this.setData({
//   img: unionId.avatarUrl
// })