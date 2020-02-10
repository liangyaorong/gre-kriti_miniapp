//JS
var app = getApp()
var util = require('../../utils/util.js');
var upFiles = require('../../utils/upFiles.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showVideoOnly: app.globalData.showVideoOnly,


    // 默认选中菜单
    currentTab: "1",
    // 顶部菜单切换
    navbar: ['图片', '视频'],


    //被点击的首页导航的菜单索引
    currentIndexNav: '0',
    //首页导航数据
    navList: ['全部', '现场', '花絮', '幕后', '精彩', '模特'],

    //上传视频模块
    upVideoArr: [], //存视频
    maxVideoUploadLen: 1, //限制上传数量
    upVideoPathLen: 0,

    //上传图片
    upImgArr: [], //存图片
    maxImageUploadLen: 9, //限制上传数量
    upImagePathLen: 0,
    upImageIndex:0,

    // 控制是否显示上传按钮
    upVideoFilesBtn: true,
    upImageFilesBtn: true,

  },

  bindFormSubmitPics(e) {
    var that = this;
    var curIndex = that.data.upImageIndex;
    upFiles.multiPicSubmit(that, app.globalData.openId, 0, e.detail.value.textarea, new Date())

  },


  bindFormSubmitVideos: function(e) {
    let that = this;
    console.log('图片路径', that.data.upVideoArr[0].tempFilePath)
    console.log('文字', e.detail.value.textarea)
    console.log('标签', that.data.navList[that.data.currentIndexNav])


    wx.showLoading({
      title: '发表中',
    })

    const uploadTask = wx.uploadFile({
      url: 'https://videos.taouu.cn/collection/add',
      filePath: that.data.upVideoArr[0].tempFilePath,
      name: 'file',
      formData: {
        'wx_open_id': app.globalData.openId,
        'type': 'video',
        'create_time': util.formatTime(new Date()),
        'index': 0,
        'post': e.detail.value.textarea,
        'label': that.data.navList[that.data.currentIndexNav],
        'collection_gid': app.globalData.openId + util.time(new Date())
      },

      success: function(res) {
        console.log('success', res)
      },
      fail: function(res) {
        wx.hideLoading()
        // wx.switchTab({
        //   url: '../../pages/my/my'
        // })
      },
      complete: function(res) {
        console.log("上传完成！")
        wx.hideLoading()
   
        wx.switchTab({
          url: '../../pages/my/my'
        })

      }
    })

    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

    that.setData({
      upVideoArr: [], //存视频
      upVideoPathLen: 0,
      currentIndexNav: 0,
      upVideoFilesBtn: true
    })
  },

  // 选择图片或者视频
  chooseFiles(e) {
    var that = this,
      type = e.currentTarget.dataset.type,
      maxUploadLen = that.data.maxUploadLen;
    if (type == 'image') {
      upFiles.chooseImage(that, that.data.maxImageUploadLen);
    } else if (type == 'video') {
      upFiles.chooseVideo(that, that.data.maxVideoUploadLen);
    }

  },


  // 删除上传图片 或者视频
  delFile(e) {
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '您确认要删除这个视频吗？',
      success(res) {
        if (res.confirm) {
          let delNum = e.currentTarget.dataset.index,
            delType = e.currentTarget.dataset.type,
            upImgArr = that.data.upImgArr,
            upVideoArr = that.data.upVideoArr;
          if (delType == 'image') {
            upImgArr.splice(delNum, 1)
            that.setData({
              upImgArr: upImgArr,
              upImagePathLen: upImgArr.length
            })
            if (upImgArr.length < that.data.maxImageUploadLen) {
              that.setData({
                upImageFilesBtn: true,
              })
            }
          } else if (delType == 'video') {
            upVideoArr.splice(delNum, 1)
            that.setData({
              upVideoArr: upVideoArr,
              upVideoPathLen: upVideoArr.length

            })
            if (upVideoArr.length < that.data.maxVideoUploadLen) {
              that.setData({
                upVideoFilesBtn: true,
              })
            }

          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 初始化加载
  onLoad: function(options) {
    if (app.globalData.openId == '' ) {
      this.getOpenId()
    }
    if (app.globalData.nickName == '' || app.globalData.avatarUrl == '') {
      this.goLogin();
    }
  },

  goLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    });
    console.log("openId", app.globalData.openId)
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


  //视频tab切换
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  //标签tab切换
  activeNav(e) {
    //console.log(123);
    this.setData({
      currentIndexNav: e.target.dataset.index
    })
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
        url: '/pages/login/login?id=0',
      });
    }

    var that = this
    that.setData({
      nickName: app.globalData.nickName,
      avatarUrl: app.globalData.avatarUrl,
      isAdmin: app.globalData.isAdmin,
      phone: app.globalData.phoneNumber
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
  }
})

