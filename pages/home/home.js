// var request = require('../../utils/request.js')

var images = require("../../data/Post_data.js")
var videos = require("../../data/Video_data.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {

    addflag: true, //判断是否显示搜索框右侧部分
    addimg: '../../images/add.png',
    searchstr: '',

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
    //轮播图数据
    swiperList: [],
    //视频列表数据
    videosList: [],
    imagesList: [],

    //头图数据
    headerImageUrl: 'https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=109e35ebacec08fa320d1bf538875608/95eef01f3a292df507633d41b0315c6035a873c6.jpg',
  },

  // 获取视频列表数据
  getImagesList() {
    let that = this;

    wx.request({
      url: 'https://videos.taouu.cn/home/stream',
      data: {
        "wx_open_id": "all",
        'page': 0,
        "page_size": "20",
        "label": "all",
        "is_like_inverted": false,
        "is_time_inverted": true,
        "is_user_id_filter": false,
        "select_type": "picture",
        "select_check": "all"
      },
      method: 'GET',
      header: {},
      success: function(res) {
        console.log(res)
        that.setData({
          "imagesList": res.data,
          "imgPage": 0
        })
      }
    })

    // that.setData({
    //   imagesList: images.homeIndex,
    //   iamgePage: 0
    // })

  },

  // 获取视频列表数据
  getVideosList() {
    let that = this;
    wx.request({
      url: 'https://videos.taouu.cn/home/stream',
      data: {
        "wx_open_id": "all",
        'page': 0,
        "page_size": "20",
        "label": "%",
        "is_like_inverted": false,
        "is_time_inverted": true,
        "is_user_id_filter": false,
        "select_type": "video",
        "select_check": "all"
      },
      method: 'GET',
      header: {},
      success: function(res) {
        console.log(res)
        that.setData({
          "videosList": res.data,
          "videoPage": 0
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getImagesList();
    // this.getVideosList();
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    console.log("下拉加载中。。。")
    wx.showNavigationBarLoading();
    this.onLoad()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

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

  watch: function(e) {
    console.log('浏览+1')
  },

  sortByTime: function(e) {
    console.log('按时间排序')
  },
  sortByLike: function(e) {
    console.log('按点赞倒排')
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