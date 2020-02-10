//app.js
var starscore = require("./templates/starscore/starscore.js");
App({
  onLaunch: function () {
    var that = this
    that.globalData.showVideoOnly = true
    console.log(that)
  },

  //全局变量
  globalData: {
    openId: "",
    nickName: "",
    avatarUrl: "",
    phoneNumber:"",
    sessionKey:"",
    isAdmin:"",
    showVideoOnly:""
  }
})
