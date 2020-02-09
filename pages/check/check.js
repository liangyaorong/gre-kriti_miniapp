var images = require("../../data/Post_data.js")
var videos = require("../../data/Video_data.js")
var query = require('../../utils/query.js');

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false, //初始文本框不显示内容

    imagePage: 0,
    videoPage: 0,

    // 顶部菜单切换
    navbar: ['图片', '视频'],

    // 默认选中菜单
    currentTab: "0",

    //被点击的首页导航的菜单索引
    currentIndexNav: '0',
    //首页导航数据
    navList: ['全部', '现场', '花絮', '幕后', '精彩', '模特'],

    //视频列表数据
    videosList: [],
    imagesList: [],

    nickName: "",

    avatarUrl: ""


  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getImagesList();

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

  onReachBottom: function () {
    let that = this;
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })

    if (that.data.currentTab == 0) {
      console.log("当前页：" + that.data.imagePage)
      query.queryImage(that,
        app.globalData.openId,
        that.data.imagePage + 1,
        "all",
        false,
        true,
        false,
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
        false,
        'all'
      )
    }
    wx.hideLoading();
  },

  // 获取视频列表数据
  getImagesList() {
    let that = this;
    query.queryImage(that, "all", 0, "all", false, true, false, 'all')
  },

  // 获取视频列表数据
  getVideosList() {
    let that = this;
    query.queryVideo(that, "all", 0, "all", false, true, false, 'all')
  },



  //顶部tab切换
  navbarTap: function(e) {
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
  previewImg: function(e) {
    var scr = e.currentTarget.dataset.scr;
    var scrlist = e.currentTarget.dataset.scrlist;
    wx.previewImage({
      current: scr,
      //当前图片地址
      urls: scrlist,
      //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  pass: function(e) {
    console.log('审核通过', e.currentTarget.dataset.collectionid)
    console.log('类型', e.currentTarget.dataset.type)

    var that = this
    var itemList = []
    if (e.currentTarget.dataset.type == "image") {
      itemList = that.data.imagesList
    } else if (e.currentTarget.dataset.type == "video") {
      itemList = that.data.videosList
    }
    for (var i = 0; i < itemList.length; i++) {
      if (itemList[i].collectionId == e.currentTarget.dataset.collectionid) {
        itemList.splice(i, 1)
        if (e.currentTarget.dataset.type == "image") {
          console.log("item", itemList)
          that.setData({
            imagesList: itemList
          })
        } else if (e.currentTarget.dataset.type == "video") {
          that.setData({
            videosList: itemList
          })
        }
        break
      }
    }
  },

  notPass: function(e) {
    console.log('审核不通过', e.currentTarget.dataset.collectionid)
    var that = this
    var itemList = []
    if (e.currentTarget.dataset.type == "image") {
      itemList = that.data.imagesList
    } else if (e.currentTarget.dataset.type == "video") {
      itemList = that.data.videosList
    }
    for (var i = 0; i < itemList.length; i++) {
      if (itemList[i].collectionId == e.currentTarget.dataset.collectionid) {
        itemList.splice(i, 1)
        if (e.currentTarget.dataset.type == "image") {
          console.log("item", itemList)
          that.setData({
            imagesList: itemList
          })
        } else if (e.currentTarget.dataset.type == "video") {
          that.setData({
            videosList: itemList
          })
        }
        break
      }
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getImagesList();
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