//app.js
var starscore = require("./templates/starscore/starscore.js");
App({
  onLaunch: function () {
  },

  //全局变量
  globalData: {
    openId: "",
    nickName: "",
    avatarUrl: "",
    phoneNumber:"",
    sessionKey:"",
    isAdmin:"",
    showVideoOnly:"true"
  }
})
