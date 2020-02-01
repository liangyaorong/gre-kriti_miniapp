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
    maxVideoUploadLen: 1,  //限制上传数量
    upVideoPathLen: 0,

    //上传图片
    upImgArr: [], //存图片
    maxImageUploadLen: 9,  //限制上传数量
    upImagePathLen: 0,

    // 控制是否显示上传按钮
    upVideoFilesBtn: true,
    upImageFilesBtn: true,

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


  uploadFiles(e) {
    let that = this;
    upFiles.upFilesFun(
      that, 
      uploadUrl, 
      filesPath, 
      formatData
    )
  },


  // 初始化加载
  onLoad: function (options) {
    this.setData({
      currentTab: options.index
    })
  },


  //顶部tab切换
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

})