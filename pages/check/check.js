var images = require("../../data/Post_data.js")
var videos = require("../../data/Video_data.js")
const APP_ID = 'wx18e21e713bbcc342'; //输入小程序appid  
const APP_SECRET = '26c587ff952331daac5480ee61572df9'; //输入小程序
var app = getApp().globalData.userInfo

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false, //初始文本框不显示内容

    iamgePage: 0,
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



  // // 下拉刷新
  // onPullDownRefresh: function () {
  //   console.log("下拉加载中。。。")
  //   wx.showNavigationBarLoading();
  //   this.onLoad()
  //   wx.hideNavigationBarLoading();
  //   wx.stopPullDownRefresh();
  // },

  // //上拉加载更多
  // onReachBottom: function () {
  //   console.log("上拉加载中。。。")
  //   var _this = this;
  //   // 显示加载图标
  //   wx.showLoading({
  //     title: '加载中',
  //   })

  //   // 图片
  //   if (_this.data.currentTab == 0) {
  //     // 页数+1
  //     _this.data.imgPage += 1;
  //     console.log("当前页：" + _this.data.imgPage)
  //     wx.request({
  //       url: 'https://videos.taouu.cn/home/stream',
  //       data: {
  //         "wx_id": "%",
  //         'page': imgPage,
  //         "page_size": "20",
  //         "label": "%",
  //         "is_like_inverted": false,
  //         "is_time_inverted": true,
  //         "is_user_id_filter": true,
  //         "select_type": "image",
  //         "select_check": "通过审核"
  //       },
  //       method: 'GET',
  //       header: {},
  //       success: function (res) {
  //         console.log(res)
  //         _this.setData({
  //           "imagesList": res.data.info,
  //           "imgPage": imgPage
  //         })
  //       }
  //     })
  //   } 

  //   wx.hideLoading();
  // },

  // 获取视频列表数据
  getImagesList() {
    let that = this;
    // wx.request({
    //   url: 'https://videos.taouu.cn/home/stream',
    //   data: {
    //     "wx_id": "%",
    //     'page':0,
    //     "page_size": "20",
    //     "label":"%",
    //     "is_like_inverted": false,
    //     "is_time_inverted": true,
    //     "is_user_id_filter":true,
    //     "select_type":"all",
    //     "select_check":"all"
    //   },
    //   method: 'GET',
    //   header: {},
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       "imagesList": res.data.info,
    //       "imgPage": 0
    //     })
    //   }
    // })

    that.setData({
      imagesList: images.homeIndex,
      iamgePage: 0
    })


  },

  // 获取视频列表数据
  getVideosList() {
    let that = this;
    // wx.request({
    //   url: 'https://videos.taouu.cn/home/stream',
    //   data: {
    //     "wx_id": "%",
    //     'page': 0,
    //     "page_size": "20",
    //     "label": "%",
    //     "is_like_inverted": false,
    //     "is_time_inverted": true,
    //     "is_user_id_filter": true,
    //     "select_type": "all",
    //     "select_check": "all"
    //   },
    //   method: 'GET',
    //   header: {},
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       "posts": res.data.info,
    //       "imgPage": 0
    //     })
    //   }
    // })

    that.setData({
      videosList: videos.homeIndex,
      videoPage: 0
    })

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
    } else if (e.currentTarget.dataset.type == "video"){
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
        } else if (e.currentTarget.dataset.type == "video"){
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
    var index = null
    var imageList = that.data.videosList
    for (var i = 0; i < imageList.length; i++) {
      if (imageList[i].collectionId == e.currentTarget.dataset.collectionid) {
        imageList.splice(i, 1)
        that.setData({
          videosList: imageList
        })
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