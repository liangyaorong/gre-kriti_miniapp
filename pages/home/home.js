// var request = require('../../utils/request.js')

var images = require("../../data/Post_data.js")
var videos = require("../../data/Video_data.js")
var query = require('../../utils/query.js');

var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {

    addflag: true, //判断是否显示搜索框右侧部分
    addimg: '../../images/add.png',
    searchstr: '',

    inputShowed: false, //初始文本框不显示内容

    imagePage: 0,
    videoPage: 0,

    // 顶部菜单切换
    currentTab: "0",
    navbar: ['图片', '视频'],

    //分类导航
    currentIndexNav: '0',
    navList: ['全部', '现场', '花絮', '幕后', '精彩', '模特'],

    //视频列表数据
    videosList: [],
    imagesList: [],

    // 按时间倒排
    timeReverse: true,

    // 按点赞倒排
    likeReverse: false,

    //头图数据
    headerImageUrl: 'https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=109e35ebacec08fa320d1bf538875608/95eef01f3a292df507633d41b0315c6035a873c6.jpg',
  },


  reflash() {
    var that = this
    if (that.data.currentTab == '0') {
      this.getImagesList();
    } else {
      this.getVideosList();
    }
  },

  //上拉加载更多
  onReachBottom: function() {
    let that = this;
    var label = that.data.navList[that.data.currentIndexNav];
    if (that.data.currentIndexNav == 0) {
      label = 'all'
    }
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })

    if (that.data.currentTab == 0) {
      query.queryImage(that,
        app.globalData.openId,
        that.data.imagePage + 1,
        label,
        that.data.likeReverse,
        that.data.timeReverse,
        false,
        'passed'
      )
    } else {
      query.queryVideo(
        app.globalData.openId,
        app.globalData.openId,
        that.data.videoPage + 1,
        label,
        that.data.likeReverse,
        that.data.timeReverse,
        false,
        'passed'
      )
    }
    wx.hideLoading();
  },


  // 获取视频列表数据
  getImagesList() {
    let that = this;
    var label = that.data.navList[that.data.currentIndexNav];
    if (that.data.currentIndexNav == 0) {
      label = 'all'
    }
    query.queryImage(
      that,
      app.globalData.openId,
      0,
      label,
      that.data.likeReverse,
      that.data.timeReverse,
      false,
      'passed'
    )
  },

  // 获取视频列表数据
  getVideosList() {
    let that = this;
    var label = that.data.navList[that.data.currentIndexNav];
    if (that.data.currentIndexNav == 0) {
      label = 'all'
    }
    query.queryVideo(
      that,
      app.globalData.openId,
      0,
      label,
      that.data.likeReverse,
      that.data.timeReverse,
      false,
      'passed'
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getImagesList();
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    var that = this
    console.log("下拉加载中。。。")
    wx.showNavigationBarLoading();

    this.reflash();

    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },





  //顶部tab切换
  navbarTap: function(e) {
    // console.log("data")
    var curIdx = e.currentTarget.dataset.idx
    console.log(curIdx)

    this.setData({
      currentTab: curIdx
    })

    this.reflash();
  },

  //点击首页导航按钮
  activeNav(e) {
    var that = this
    this.setData({
      currentIndexNav: e.target.dataset.index
    })
    this.reflash();


  },

  // 图片预览
  previewImg(e) {
    this.watch(e);

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
              // app.globalData.phoneNumber = res.data.user.phone
              // app.globalData.isAdmin = res.data.user.isAdmin
              app.globalData.phoneNumber = ''
              app.globalData.isAdmin = true
            }
          }
        })
      }
    })
  },



  watch: function(e) {
    var that = this

    console.log('浏览+1', e.currentTarget.dataset.collectionid)
    wx.request({
      url: 'https://videos.taouu.cn/collection/addplay',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wx_open_id: app.globalData.openId,
        id: e.currentTarget.dataset.collectionid,
      },
      method: 'POST',
      success: function (res) {
        console.log("播放成功", res)
      }
    })

    var itemList = []
    if (e.currentTarget.dataset.type == "image") {
      itemList = that.data.imagesList
    } else if (e.currentTarget.dataset.type == "video") {
      itemList = that.data.videosList
    }
    for (var i = 0; i < itemList.length; i++) {
      if (itemList[i].collectionId == e.currentTarget.dataset.collectionid) {
        itemList[i].playCount += 1
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



  like: function (e) {
    var that = this

    console.log("点赞openid", app.globalData.openId)
    console.log("点赞id", e.currentTarget.dataset.collectionid)
    console.log('类型', e.currentTarget.dataset.type)

    wx.request({  
      url: 'https://videos.taouu.cn/collection/addlike',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wx_open_id: app.globalData.openId,
        id: e.currentTarget.dataset.collectionid,
      },
      method: 'POST',
      success: function (res) {
        console.log("点赞成功", res)
      }
    })

    var itemList = []
    if (e.currentTarget.dataset.type == "image") {
      itemList = that.data.imagesList
    } else if (e.currentTarget.dataset.type == "video") {
      itemList = that.data.videosList
    }
    for (var i = 0; i < itemList.length; i++) {
      if (itemList[i].collectionId == e.currentTarget.dataset.collectionid) {
        itemList[i].isCurrentUserLiked = true
        itemList[i].likeCount += 1
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

  sortByTime: function(e) {
    console.log('按时间排序')
    var that = this
    that.setData ({
      timeReverse: true,
      likeReverse: false
    })
    this.reflash();
  },

  sortByLike: function(e) {
    console.log('按点赞倒排')
    var that = this
    that.setData({
      timeReverse: false,
      likeReverse: true
    })
    this.reflash();
  },

  //搜索框输入时触发
  searchList(ev) {
    let e = ev.detail;
    this.setData({
      searchstr: e.detail.value
    })
  },
  //搜索回调
  endsearchList(e) {
    console.log('查询数据')
    console.log(this.data.searchstr)

  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: ''
    })
  },
  //清空搜索框
  activity_clear(e) {
    this.setData({
      searchstr: ''
    })
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
    var that = this
    // 点赞必须先拿到openid
    if (app.globalData.openId == '') {
      this.getOpenId()
    }
    // this.reflash();

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