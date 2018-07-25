//app.js
App({
  onLaunch: function () {
    var _this = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      // success: res => {
      //   // 发送 res.code 到后台换取 openId, sessionKey, unionId
      // }
      success:function(res){
        if(res.code){
          wx.request({
            url:'https://jing.hengdikeji.com/index/wechat/index',
            data:{
              code:res.code
            },
            success:function(data){
              _this.globalData.code = data.data.id;
            }
          })
        }else{
          console.log('登陆失败!'+res.errMsg)
        }
      }
    })
  },
  globalData: {
    code:null,
    userInfo: null
  }
})