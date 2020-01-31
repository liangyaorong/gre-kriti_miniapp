//JS
var app = getApp()
var util = require('../../utils/util.js');
var upFiles = require('../../utils/upFiles.js');



Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部菜单切换
    navbar: ['视频', '图片'],

    // 默认选中菜单
    currentTab: "0",

    //上传视频模块
    upVideoArr: [], //存视频
    upFilesBtn: true,
    maxUploadLen: 1,  //限制上传数量

    //上传图片
    upImgArr: [], //存图片
    upFilesBtn: true,
    maxUploadLen: 9,  //限制上传数量
  },


  // 选择图片或者视频
  uploadFiles(e) {
    var that = this,
      type = e.currentTarget.dataset.type,
      maxUploadLen = that.data.maxUploadLen;
    if (type == 'image') {
      upFiles.chooseImage(that, maxUploadLen);
    } else if (type == 'video') {
      upFiles.chooseVideo(that, maxUploadLen);
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
              upImgArr: upImgArr
            })
          } else if (delType == 'video') {
            upVideoArr.splice(delNum, 1)
            that.setData({
              upVideoArr: upVideoArr
            })
          }

          let upFilesArr = upFiles.getPathArr(that);
          if (upFilesArr.length < that.data.maxUploadLen) {
            that.setData({
              upFilesBtn: true,
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 初始化加载
  onLoad: function(options) {
    this.setData({
      currentTab: options.index
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



})