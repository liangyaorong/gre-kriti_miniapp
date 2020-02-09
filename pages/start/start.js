//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0
  },

  goHome: function() {
    wx.switchTab({
      url: '/pages/home/home',
    });
    console.log("openId", app.globalData.openId)
  },

  goLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login?tohome=true',
    });
  },

  enter: function () {
    if (app.globalData.nickName == '' || app.globalData.avatarUrl == '') {
      this.goLogin();
    } else {
      this.goHome();
    }
  },

  getOpenId: function() {
    var that = this;
    wx.login({
      success: function(res) {
        console.log("code", res.code)
        wx.request({
          //获取openid接口  
          url: 'https://videos.taouu.cn/login/regist',
          data: {
            js_code: res.code,
          },
          method: 'GET',
          success: function(res) {
            console.log(res)
            app.globalData.openId = res.data.openid
            app.globalData.sessionKey = res.data.session_key
            if (res.data.user == null) {
              app.globalData.nickName = ''
              app.globalData.avatarUrl = ''
              app.globalData.phoneNumber = ''
              app.globalData.isAdmin = false
            } else {
              app.globalData.nickName = res.data.user.wxName
              app.globalData.avatarUrl = res.data.user.wxHeadUrl
              app.globalData.phoneNumber = res.data.user.phone
              app.globalData.isAdmin = res.data.user.isAdmin
            }
          }
        })
      }
    })
  },


  onLoad: function() {
    this.getOpenId();
  },


  onShow: function() {

  },
  onReady: function() {
    var that = this;
    setTimeout(function() {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },
});