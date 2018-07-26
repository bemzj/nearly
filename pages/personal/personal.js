
// pages/personal/personal.js
//获取应用实例
const app = getApp()
const {
  api,
  config
} = require('../../utils/config.js')
const network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginType:0,
    useIntro:{},
    newLength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        _this.setData({
          useIntro: res.data
        });
      }
    });
    var url = config.route;
    var data = {
      uid: app.globalData.code,
    }
    network.GET(url + api.getNews, {
      params: data,
      success: function (res) {
        var len = 0;
        var msg = res.data.message;
        for (var i = 0; i < msg.length; i++) {
          if (msg[i].isread == 1) {
            len++;
          }
        }
        _this.setData({
          newLength: len
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //申请成为商家
  applyToShop:function(){
    var _this = this;
    var url = config.route;
    var data = {
      uid: app.globalData.code,
    }
    network.GET(url + api.hasApply, {
      params: data,
      success: function (res) {
        if (res.data.status==1)
        {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          });
        }else{
          wx.navigateTo({
            url: '../shopApply/shopApply',
          })
        }
      }
    });
  }
})