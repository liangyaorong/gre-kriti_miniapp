//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0
  },

  goToIndex:function(){
    wx.switchTab({
      url: '/pages/home/home',
    });
    console.log("openId", app.globalData.openId)

  },

  getOpenId: function () {
    var that = this;
    wx.login({
      success: function (res) {

        // 改成服务器调接口
        wx.request({
          //获取openid接口  
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: 'wx18e21e713bbcc342',
            secret: '26c587ff952331daac5480ee61572df9',
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (res) {
            app.globalData.openId = res.data.openid
            app.globalData.sessionKey = res.data.session_key
            that.setData({
              openid: res.data.openid,
              session_key: res.data.session_key
            })
            console.log(that.data)
          }
        })
      }
    })
  },


  onLoad:function(){
    this.getOpenId();
  },


  onShow:function(){

  },
  onReady: function(){
    var that = this;
    setTimeout(function(){
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(that.data.angle !== angle){
        that.setData({
          angle: angle
        });
      }
    });
  },
});