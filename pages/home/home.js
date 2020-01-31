// var request = require('../../utils/request.js')

var json = require("../../data/Post_data.js")

Page({

  // data中的属性可以在wxml中直接使用，如data: {"image":"XXX"},可以直接用 {{image}}调用
  data: {},

  /* 生命周期函数--监听页面加载 */
  onLoad: function(options) {
    var _this = this
    console.log(_this.data)
    // wx.request({
    //   url: "https://www.naturebyte.com/home/refresh?",
    //   data: {
    //     "user_id": "2088",
    //     "page_rank": "0",
    //     "page_num": "20"
    //   },
    //   method: 'GET',
    //   header: {},
    //   success: function(res) {
    //     console.log(res)
    //     _this.setData({
    //       "posts": res.data.posts,
    //       "page": 0
    //     })
    //   }
    // })
    _this.setData({
          "posts": json.homeIndex,
          "page": 0
        })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.onLoad()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  //上拉加载更多
  onReachBottom: function() {
    var _this = this;
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1
    _this.data.page += 1;
    console.log("当前页："+ _this.data.page)
    wx.request({
      url: "https://www.naturebyte.com/home/refresh?",
      data: {
        "user_id": "2088",
        "page_rank": _this.data.page,
        "page_num": "20"
      },
      method: 'GET',
      header: {},
      success: function (res) {
        console.log(res)
        _this.setData({
          "posts": _this.data.posts.concat(res.data.posts),
          "page": _this.data.page
        })
      }
    })
    wx.hideLoading();
  },

  // 跳转子页面 详情页面. 
  // 参数通过？后跟的字段传，如  ...?id=0
  // 目标页面通过onLoad: function (option) { var id = option.id}来读
  btn: function (e) {
    // var id = e.currentTarget.dataset.id
    var id = 2
    wx.navigateTo({
      url: '../../pages/home-details/home-details?id=' + id,
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
  }


})