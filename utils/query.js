var util = require('util.js');


var queryImage = (
  that,
  openid,
  page,
  label,
  is_like_inverted,
  is_time_inverted,
  is_user_id_filter,
  select_check
) => {
  console.log("函数内当前页", page)

  wx.request({
    url: 'https://videos.taouu.cn/home/stream',
    data: {
      "wx_open_id": openid,
      'page': page,
      "page_size": "5",
      "label": label,
      "is_like_inverted": is_like_inverted,
      "is_time_inverted": is_time_inverted,
      "is_user_id_filter": is_user_id_filter,
      "select_type": "picture",
      "select_check": select_check
    },
    method: 'GET',
    header: {},
    success: function(res) {
      console.log(res)
      if (page == 0) {
        that.setData({
          imagesList: []
        })
      }

      if (res.data.length > 0) {
        that.setData({
          imagesList: that.data.imagesList.concat(res.data),
          imagePage: page
        })
      }
    }
  })
}

var queryVideo = (
  that,
  openid,
  page,
  label,
  is_like_inverted,
  is_time_inverted,
  is_user_id_filter,
  select_check
) => {
  console.log("函数内当前页", page)

  wx.request({
    url: 'https://videos.taouu.cn/home/stream',
    data: {
      "wx_open_id": openid,
      'page': page,
      "page_size": "5",
      "label": label,
      "is_like_inverted": is_like_inverted,
      "is_time_inverted": is_time_inverted,
      "is_user_id_filter": is_user_id_filter,
      "select_type": "video",
      "select_check": select_check
    },
    method: 'GET',
    header: {},
    success: function(res) {
      console.log(res)

      if (page == 0) {
        that.setData({
          videosList: []
        })
      }

      if (res.data.length > 0) {
        that.setData({
          videosList: that.data.videosList.concat(res.data),
          videoPage: page
        })
      }
    }
  })
}






module.exports = {
  queryImage,
  queryVideo
}