var images = require("../../data/Post_data.js")
var videos = require("../../data/Video_data.js")
var query = require('../../utils/query.js');

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showVideoOnly: app.globalData.showVideoOnly,


    inputShowed: false,  //初始文本框不显示内容

    imagePage: 0,
    videoPage: 0,

    // 顶部菜单切换
    navbar: ['图片', '视频'],

    // 默认选中菜单
    currentTab: "1",

    //被点击的首页导航的菜单索引
    currentIndexNav: '0',
    //首页导航数据
    navList: ['全部', '护肤美妆', '学习工作', '生活趣味', '防疫妙招'],

    //视频列表数据
    videosList: [],
    imagesList: [],

    nickName: '',
    avatarUrl: '',
    isAdmin: '',
    phone: ''
  },


  goCheck() {
    wx.navigateTo({
      url: '/pages/check/check',
    });
  },

  reflash() {
    var that = this
    if (that.data.currentTab == '0') {
      this.getImagesList();
    } else {
      this.getVideosList();
    }
  },

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    console.log("我的页面data", this.data)
    this.reflash();
  },


  getOpenId: function () {
    var that = this;
    wx.login({
      success: function (res) {
        console.log("code", res.code)
        wx.request({
          //获取openid接口  
          url: 'https://videos.taouu.cn/login/regist',
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




  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })

    if (that.data.currentTab == 0) {
      console.log("当前页：" + that.data.imagePage)
      query.queryImage(
        that, 
        app.globalData.openId, 
        that.data.imagePage + 1, 
        "all", 
        false, 
        true, 
        true, 
        'all'
        )
    } else {
      console.log("当前页：" + that.data.videoPage)
      query.queryVideo(
        that, 
        app.globalData.openId, 
        that.data.videoPage + 1, 
        "all", 
        false, 
        true, 
        true, 
        'all'
        )
    }
    wx.hideLoading();
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    console.log("下拉加载中。。。")
    wx.showNavigationBarLoading();

    if (that.data.currentTab == '0') {
      this.getImagesList();
    } else {
      this.getVideosList();
    }

    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  // 获取视频列表数据
  
  getImagesList() {
    let that = this;
    query.queryImage(that, app.globalData.openId, 0, "all", false, true, true, 'all')
  },

  // 获取视频列表数据
  getVideosList() {
    let that = this;
    query.queryVideo(that, app.globalData.openId,  0, "all", false, true, true, 'all')
  },


  //顶部tab切换
  navbarTap: function (e) {
    // console.log("data")
    var curIdx = e.currentTarget.dataset.idx
    console.log(curIdx)

    this.setData({
      currentTab: curIdx
    })

    if (curIdx == 0) {
      this.getImagesList();
    } else {
      this.getVideosList();
    }
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
    var scrlist = e.currentTarget.dataset.scrlist;
    wx.previewImage({
      current: scr,
      //当前图片地址
      urls: scrlist,
      //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  watch: function (e) {
    var that = this

    // 暂停其他视频
    if (e.currentTarget.dataset.type == "video") {
      for (var i = 0; i < that.data.videosList.length; i++) {
        if (that.data.videosList[i].collectionId != e.currentTarget.dataset.collectionid) {
          wx.createVideoContext(that.data.videosList[i].collectionId.toString()).pause();
          console.log("停了", that.data.videosList[i].collectionId.toString())
        }
      }
    }
  },

  // 使文本框进入可编辑状态
  showInput: function () {
    this.setData({
      inputShowed: true   //设置文本框可以输入内容
    });
  },
  // 取消搜索
  hideInput: function () {
    this.setData({
      inputShowed: false
    });
  },

  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
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

    // 没登陆的，先转跳登陆页面
    if (app.globalData.openId == '') {
      this.getOpenId()
    }
    if (app.globalData.nickName == '' || app.globalData.avatarUrl == '') {
      wx.navigateTo({
        url: '/pages/login/login',
      });
    }

    var that = this
    that.setData({
      nickName: app.globalData.nickName,
      avatarUrl: app.globalData.avatarUrl,
      isAdmin: app.globalData.isAdmin,
      phone: app.globalData.phoneNumber
    })

    if (this.data.currentTab == '0') {
      this.getImagesList();
    } else {
      this.getVideosList();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      videosList:[]
    })

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