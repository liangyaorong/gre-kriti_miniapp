// var request = require('../../utils/request.js')

var images = require("../../data/Post_data.js")
var videos = require("../../data/Video_data.js")


// Page({

//   // data中的属性可以在wxml中直接使用，如data: {"image":"XXX"},可以直接用 {{image}}调用
//   data: {},

//   /* 生命周期函数--监听页面加载 */
//   onLoad: function(options) {
//     var _this = this
//     console.log(_this.data)
//     // wx.request({
//     //   url: "https://www.naturebyte.com/home/refresh?",
//     //   data: {
//     //     "user_id": "2088",
//     //     "page_rank": "0",
//     //     "page_num": "20"
//     //   },
//     //   method: 'GET',
//     //   header: {},
//     //   success: function(res) {
//     //     console.log(res)
//     //     _this.setData({
//     //       "posts": res.data.posts,
//     //       "page": 0
//     //     })
//     //   }
//     // })
//     _this.setData({
//           "posts": json.homeIndex,
//           "page": 0
//         })
//   },

//   // 下拉刷新
//   onPullDownRefresh: function() {
//     wx.showNavigationBarLoading();
//     this.onLoad()
//     wx.hideNavigationBarLoading();
//     wx.stopPullDownRefresh();
//   },

//   //上拉加载更多
//   onReachBottom: function() {
//     var _this = this;
//     // 显示加载图标
//     wx.showLoading({
//       title: '加载中',
//     })
//     // 页数+1
//     _this.data.page += 1;
//     console.log("当前页："+ _this.data.page)
//     wx.request({
//       url: "https://www.naturebyte.com/home/refresh?",
//       data: {
//         "user_id": "2088",
//         "page_rank": _this.data.page,
//         "page_num": "20"
//       },
//       method: 'GET',
//       header: {},
//       success: function (res) {
//         console.log(res)
//         _this.setData({
//           "posts": _this.data.posts.concat(res.data.posts),
//           "page": _this.data.page
//         })
//       }
//     })
//     wx.hideLoading();
//   },

//   // 跳转子页面 详情页面. 
//   // 参数通过？后跟的字段传，如  ...?id=0
//   // 目标页面通过onLoad: function (option) { var id = option.id}来读
//   btn: function (e) {
//     // var id = e.currentTarget.dataset.id
//     var id = 2
//     wx.navigateTo({
//       url: '../../pages/home-details/home-details?id=' + id,
//     })
//   },

//   // 图片预览
//   previewImg: function (e) {
//     var scr = e.currentTarget.dataset.scr;
//     wx.previewImage({
//       current: scr,     //当前图片地址
//       urls: [scr],               //所有要预览的图片的地址集合 数组形式
//       success: function (res) { },
//       fail: function (res) { },
//       complete: function (res) { },
//     })
//   }


// })

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
    //头图数据
    headerImageUrl:'',
    //视频列表数据
    videosList: [],
    imagesList: [],
  },

  // 获取轮播图数据
  getHeaderImageUrl() {
    let that = this;
    // wx.request({
    //   url: 'https://easy-mock.com/mock/5c1dfd98e8bfa547414a5278/bili/swiperList',
    //   success(res) {
    //     // console.log(res);
    //     that.setData({
    //       swiperList: res.data.data.swiperList
    //     })
    //   }
    // })
    that.setData({
      headerImageUrl: 'https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=109e35ebacec08fa320d1bf538875608/95eef01f3a292df507633d41b0315c6035a873c6.jpg'
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
  navbarTap: function(e) {
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
  previewImg: function(e) {
    var scr = e.currentTarget.dataset.scr;
    wx.previewImage({
      current: scr,
         //当前图片地址
      urls: [scr],
              //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  watch: function(e) {
    console.log('浏览+1')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 2.获取轮播图数据
    this.getHeaderImageUrl();
    this.getVideosList();
    this.getImagesList();
    console.log(this.data)

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})