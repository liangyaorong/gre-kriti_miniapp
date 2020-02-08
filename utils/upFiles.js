var util = require('util.js');


var chooseImage = (t, count) => {
  wx.chooseImage({
    count: count,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      var imgArr = t.data.upImgArr || [];
      let arr = res.tempFiles;
      arr.map(function(v, i) {
        v['progress'] = 0;
        imgArr.push(v)
      })

      if (imgArr.length >= count) {
        // 超出部分截断
        var newImgArr = imgArr
        if (imgArr.length > count) {
          newImgArr = imgArr.slice(0, count)
        }
        t.setData({
          upImageFilesBtn: false,
          upImgArr: newImgArr,
          upImagePathLen: newImgArr.length
        })

      } else {
        t.setData({
          upImgArr: imgArr,
          upImagePathLen: imgArr.length
        })
      }

      console.log("当前图片路径列表：", imgArr)

    },
  });
}

var chooseVideo = (t, count) => {
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 30,
    compressed: true,
    camera: 'back',
    success: function(res) {
      let videoArr = t.data.upVideoArr || [];
      let videoInfo = {};
      videoInfo['tempFilePath'] = res.tempFilePath;
      videoInfo['size'] = res.size;
      videoInfo['height'] = res.height;
      videoInfo['width'] = res.width;
      videoInfo['thumbTempFilePath'] = res.thumbTempFilePath;
      videoInfo['progress'] = 0;
      videoArr.push(videoInfo)

      if (videoArr.length >= count) {
        // 超出部分截断
        var newVideoArr = videoArr
        if (videoArr.length > count) {
          newVideoArr = videoArr.slice(0, count - 1)
        }
        t.setData({
          upVideoFilesBtn: false,
          upVideoArr: newVideoArr,
          upVideoPathLen: newVideoArr.length

        })

      } else {
        t.setData({
          upVideoArr: videoArr,
          upVideoPathLen: videoArr.length

        })
      }
      console.log("当前视频路径列表：", videoArr)

    }
  })
}

// 获取 图片数组 和 视频数组 以及合并数组
var getPathArr = t => {
  let imgarr = t.data.upImgArr || [];
  let upVideoArr = t.data.upVideoArr || [];
  let imgPathArr = [];
  let videoPathArr = [];
  imgarr.map(function(v, i) {
    imgPathArr.push(v.path)
  })
  upVideoArr.map(function(v, i) {
    videoPathArr.push(v.tempFilePath)
  })
  let filesPathsArr = imgPathArr.concat(videoPathArr);
  return filesPathsArr;
}


var multiPicSubmit = (that, openId, uploadIndex, post, dataTime) => {
  console.log("上传index", uploadIndex)
  console.log('上传图片数量', that.data.upImgArr.length)
  console.log('当前图片路径', that.data.upImgArr[uploadIndex].path)
  console.log('文字', post)
  console.log('标签', that.data.navList[that.data.currentIndexNav])
  console.log('时间', util.time(dataTime))

  if (uploadIndex == 0) {
    wx.showLoading({
      title: '发表中',
    })
  }
  const uploadTask = wx.uploadFile({
    url: 'https://videos.taouu.cn/collection/add',
    filePath: that.data.upImgArr[uploadIndex].path,
    name: 'file',
    formData: {
      'wx_open_id': openId,
      'type': 'picture',
      'create_time': util.formatTime(dataTime),
      'index': uploadIndex,
      'post': post,
      'label': that.data.navList[that.data.currentIndexNav],
      'collection_gid': openId + util.time(dataTime)
    },

    success: function(res) {
      console.log('success', res)
    },
    fail: function(res) {
      console.log('fail', res)
    },
    complete: function(res) {
      console.log("当前index", uploadIndex)
      console.log("一共的index数", that.data.upImgArr.length - 1)
      console.log("是否继续上传", uploadIndex >= that.data.upImgArr.length - 1)


      if (uploadIndex >= that.data.upImgArr.length - 1) {
        console.log("上传完成！")
        wx.hideLoading()
        that.setData({
          upImgArr: [],
          upImagePathLen: 0,
          currentIndexNav: 0
        })
        wx.switchTab({
          url: '../../pages/my/my'
        })
      } else {
        multiPicSubmit(that, openId, uploadIndex + 1, post, dataTime)
      }
    }
  })

  uploadTask.onProgressUpdate((res) => {
    console.log('上传进度', res.progress)
    console.log('已经上传的数据长度', res.totalBytesSent)
    console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
  })


}

module.exports = {
  chooseImage,
  chooseVideo,
  getPathArr,
  multiPicSubmit
}