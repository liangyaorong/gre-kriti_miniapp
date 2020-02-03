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

  bindFormSubmitPics: function (e) {
    let that = this;
    console.log('图片路径', that.data.upImgArr[0].path)
    console.log('文字', e.detail.value.textarea)

    const uploadTask = wx.uploadFile({
      url: 'https://videos.taouu.cn/uploadFile',
      filePath: that.data.upImgArr[0].path,
      name: 'file',
      formData: {
        'owner_id': 334,
        'category': "花絮",
        'type': 'video',
        'text': e.detail.value.textarea
      },

      success: function (res) {
        console.log('success', res)
      },
      fail: function (res) {
        console.log('fail', res)
      },
      complete: function (res) {
        console.log("上传完成！")
      }
    })

    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
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


  uploadFiles(e) {
    
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