var images = require("../../data/Post_data.js")
var videos = require("../../data/Video_data.js")

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remind:"加载中",

    agree: false,

    toHome: false

  },


  selected() {

    this.setData({
      agree: !this.data.agree
    })
  },

  onGotUserInfo: function(e) {
    var that = this
  
    if (that.data.agree) {

      console.log("openId:", app.globalData.openId)
      console.log("nickName:", e.detail.userInfo.nickName)
      console.log("wx_head_url:", e.detail.userInfo.avatarUrl)
      wx.request({
        //获取openid接口  
        url: 'https://shipin.gre-kriti.com/login/useradd',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          wx_open_id: app.globalData.openId,
          phone: '',
          wx_name: e.detail.userInfo.nickName,
          wx_head_url: e.detail.userInfo.avatarUrl
        },
        method: 'POST',
        success: function(res) {
          if (res.statusCode == 200) {
            console.log(res)
            app.globalData.nickName = e.detail.userInfo.nickName
            app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
          }
        }
      })

      if (that.data.toHome) {
        wx.switchTab({
          url: '/pages/home/home',
        });
      } else {
        wx.navigateBack({
          delta: 1 //跳转的级数
        })
      }
    }
  },

  getOpenId: function () {
    var that = this;
    wx.login({
      success: function (res) {
        console.log("code", res.code)
        wx.request({
          //获取openid接口  
          url: 'https://shipin.gre-kriti.com/login/regist',
          data: {
            js_code: res.code,
          },
          method: 'GET',
          success: function (res) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options.tohome) {
      that.data.toHome = true
    }
    if (app.globalData.openId == '') {
      this.getOpenId()
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})