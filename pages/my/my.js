var images = require("../../data/Post_data.js")
var videos = require("../../data/Video_data.js")
const APP_ID = 'wx18e21e713bbcc342';//输入小程序appid  
const APP_SECRET = '26c587ff952331daac5480ee61572df9';//输入小程序


Page({

  /**
    * 页面的初始数据
    */
  data: {
    // 顶部菜单切换
    navbar: ['图片', '视频'],

    // 默认选中菜单
    currentTab: "0",

    //被点击的首页导航的菜单索引
    currentIndexNav: '0',
    //首页导航数据
    navList: ['全部', '现场', '花絮', '幕后', '精彩', '模特'],
    //轮播图数据
    swiperList: [],
    //视频列表数据
    videosList: [],
    imagesList: [],
    nickName: "",
    avatarUrl: ""
  },

  onGotUserInfo: function (e) {
       var that = this
    that.setData({
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl
              })
    wx.navigateTo({
      url: '../../pages/my/my',
    })
    // console.log(e.detail.errMsg)
    // console.log()
    // console.log(e.detail.rawData)
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

  onLoad: function() {
    // 2.获取轮播图数据
    this.getSwiperList();
    this.getVideosList();
    this.getImagesList();
    this.getOpenId();
    console.log(this.data)

  },
  

  // 获取轮播图数据
  getSwiperList() {
    let that = this;
    wx.request({
      url: 'https://easy-mock.com/mock/5c1dfd98e8bfa547414a5278/bili/swiperList',
      success(res) {
        // console.log(res);
        that.setData({
          swiperList: res.data.data.swiperList
        })
      }
    })
  },

  // 获取视频列表数据
  getImagesList() {
    let that = this;
    // wx.request({
    //   url: 'https://easy-mock.com/mock/5c1dfd98e8bfa547414a5278/bili/videosList',
    //   success(res) {

    //     if (res.data.code === 0) {
    //       that.setData({
    //         videosList: res.data.data.videosList
    //       })
    //     }
    //     console.log(res.data.data.videosList)
    //   }
    // })
    that.setData({
      imagesList: images.homeIndex
    })

  },

  // 获取视频列表数据
  getVideosList() {
    let that = this;
    // wx.request({
    //   url: 'https://easy-mock.com/mock/5c1dfd98e8bfa547414a5278/bili/videosList',
    //   success(res) {

    //     if (res.data.code === 0) {
    //       that.setData({
    //         videosList: res.data.data.videosList
    //       })
    //     }
    //     console.log(res.data.data.videosList)
    //   }
    // })
    that.setData({
      videoList: videos.homeIndex
    })

  },


  //顶部tab切换
  navbarTap: function (e) {
    console.log("data")
    console.log(e)
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  //点击首页导航按钮
  activeNav(e) {
    //console.log(123);
    this.setData({
      currentIndexNav: e.target.dataset.index
    })
  },
  // 图片预览
  previewImg: function (e) {
    var scr = e.currentTarget.dataset.scr;
    wx.previewImage({
      current: scr,     //当前图片地址
      urls: [scr],               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})