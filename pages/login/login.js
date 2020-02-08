var images = require("../../data/Post_data.js")
var videos = require("../../data/Video_data.js")
const APP_ID = 'wx18e21e713bbcc342';//输入小程序appid  
const APP_SECRET = '26c587ff952331daac5480ee61572df9';//输入小程序
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  onGotUserInfo: function (e) {
    var that = this
    console.log("openId:", app.globalData.openId)
    console.log("nickName:", e.detail.userInfo.nickName)
    console.log("wx_head_url:", e.detail.userInfo.avatarUrl)


    wx.request({
      //获取openid接口  
      url: 'https://videos.taouu.cn/login/useradd',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wx_open_id: app.globalData.openId,
        phone: '',
        wx_name: e.detail.userInfo.nickName,
        wx_head_url: e.detail.userInfo.avatarUrl
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        app.globalData.nickName = e.detail.userInfo.nickName
        app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
      }
    })
    this.goHome();
  },

  goHome: function () {
    wx.switchTab({
      url: '/pages/home/home',
    });
    console.log("openId", app.globalData.openId)
  },

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})