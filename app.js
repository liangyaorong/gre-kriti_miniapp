//app.js
var starscore = require("./templates/starscore/starscore.js");
App({
  onLaunch: function () {
    // console.log("openId:", 'oIbH25TtKyhTVAGbT1Y-2MddmaZE')
    // console.log("nickName:", '旺仔（蜜柑1¼）')
    // console.log("wx_head_url:", 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLCMow1p6R8RUlSak4Nr0KKxcPhP1f0aZXoMPOVGibKlGaL3arXanEdOON8iamuwxibyVCZEl31IBhSA/132')
    // wx.request({
    //   //获取openid接口  
    //   url: 'https://shipin.gre-kriti.com/login/useradd',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   data: {
    //     wx_open_id: 'oIbH25TtKyhTVAGbT1Y-2MddmaZE',
    //     phone: '',
    //     wx_name: '旺仔（蜜柑1¼）',
    //     wx_head_url: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLCMow1p6R8RUlSak4Nr0KKxcPhP1f0aZXoMPOVGibKlGaL3arXanEdOON8iamuwxibyVCZEl31IBhSA/132'
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     console.log("测试", res)
    //   }
    // })
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
