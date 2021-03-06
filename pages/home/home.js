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

    nav_class:"nav_class_0",
    currentPlayVideoIndex: 0,
    isActive: true,


    showVideoOnly: app.globalData.showVideoOnly,

    addflag: true, //判断是否显示搜索框右侧部分
    addimg: '../../images/add.png',
    searchstr: '',

    inputShowed: false, //初始文本框不显示内容

    imagePage: 0,
    videoPage: 0,

    // 顶部菜单切换
    currentTab: "1",
    navbar: ['图片', '视频'],

    //分类导航
    currentIndexNav: '0',
    navList: ['全部', '护肤美妆', '学习工作', '生活趣味', '防疫妙招'],

    //视频列表数据
    videosList: [],
    imagesList: [],

    // 按时间倒排
    timeReverse: true,

    // 按点赞倒排
    likeReverse: false,

    // 搜索模式，上拉无效
    searchMode: false,

    //头图数据
    headerImageUrl: "",

  },


  reflash() {
    var that = this
    that.setData({
      searchMode: false
    })
    if (that.data.currentTab == '0') {
      this.getImagesList();
    } else {
      this.getVideosList();
    }
  },

  //上拉加载更多
  onReachBottom: function() {
    let that = this;

    if (!that.data.searchMode) {
      var label = that.data.navList[that.data.currentIndexNav];
      if (that.data.currentIndexNav == 0) {
        label = 'all'
      }
      // 显示加载图标
      wx.showLoading({
        title: '加载中',
      })

      if (that.data.currentTab == 0) {
        query.queryImage(
          that,
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
          that,
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
    }
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
    this.getStartPic()
    this.reflash();
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
      currentIndexNav: e.target.dataset.index,
      nav_class: "nav_class" + e.target.dataset.index
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

  // 图片预览
  previewOneImg(e) {

    var scr = e.currentTarget.dataset.scr;
    var scrlist = [scr]
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



  getOpenId: function() {
    var that = this;
    wx.login({
      success: function(res) {
        console.log("code", res.code)
        wx.request({
          //获取openid接口  
          url: 'https://shipin.gre-kriti.com/login/regist',
          data: {
            js_code: res.code,
          },
          method: 'GET',
          success: function(res) {
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



  watch: function(e) {
    var that = this

    // 暂停其他视频
    if (e.currentTarget.dataset.type == "video") {
      for (var i = 0; i < that.data.videosList.length; i++) {
        if (that.data.videosList[i].collectionId != e.currentTarget.dataset.collectionid) {
          wx.createVideoContext(that.data.videosList[i].collectionId.toString()).pause();
        }
      }
    }


    if (e.currentTarget.dataset.watched == false) {
      console.log('浏览+1')
      wx.request({
        url: 'https://shipin.gre-kriti.com/collection/addplay',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          wx_open_id: app.globalData.openId,
          id: e.currentTarget.dataset.collectionid,
        },
        method: 'POST',
        success: function(res) {
          console.log("播放成功", res)

          var itemList = []
          if (e.currentTarget.dataset.type == "image") {
            itemList = that.data.imagesList
          } else if (e.currentTarget.dataset.type == "video") {
            itemList = that.data.videosList
          }

          var i = e.currentTarget.dataset.idx
          if (itemList[i].isCurrentUserPlayed == false) {
            itemList[i].playCount += 1
            itemList[i].isCurrentUserPlayed = true
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
          }
        }
      })
    }
  },



  like: function(e) {
    var that = this
    wx.request({
      url: 'https://shipin.gre-kriti.com/collection/addlike',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wx_open_id: app.globalData.openId,
        id: e.currentTarget.dataset.collectionid,
      },
      method: 'POST',
      success: function(res) {
        console.log("点赞成功", res.statusCode)
        if (res.statusCode == 200) {
          var itemList = []
          if (e.currentTarget.dataset.type == "image") {
            itemList = that.data.imagesList
          } else if (e.currentTarget.dataset.type == "video") {
            itemList = that.data.videosList
          }

          var i = e.currentTarget.dataset.idx
          if (itemList[i].isCurrentUserLiked == false) {
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
          }
        }
      }
    })



  },

  sortByTime: function(e) {
    console.log('按时间排序')
    var that = this
    that.setData({
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
    var that = this
    that.setData({
      searchMode: true
    })

    console.log('查询数据')
    console.log(that.data.searchstr)


    wx.request({
      //获取openid接口  
      url: 'https://shipin.gre-kriti.com/collection/get',
      data: {
        collection_id: that.data.searchstr,
        wx_open_id: app.globalData.openId
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        if (res.data == '' || res.statusCode == 500) {
          wx.showModal({
            title: '温馨提示',
            content: '您搜索的内容暂未通过审核'
          })
        } else {
          if (res.data.type == "picture") {
            that.setData({
              imagesList: [res.data],
              currentTab: 0
            })
          } else if (res.data.type == "video") {
            that.setData({
              videosList: [res.data],
              currentTab: 1
            })
          }
        }
      }
    })

  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: '',
      searchMode: false
    })

  },
  //清空搜索框
  activity_clear(e) {
    this.setData({
      searchstr: ''
    })
  },


  getStartPic() {
    var that = this

    wx.request({
      url: 'https://shipin.gre-kriti.com/login/getstartpic',
      data: {
        sart_pic: false,
        head_pic: true
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          headerImageUrl: res.data
        })
      }
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