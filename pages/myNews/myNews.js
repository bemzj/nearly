//获取应用实例
const app = getApp()
const {
  api,
  config
} = require('../../utils/config.js')
const network = require("../../utils/network.js")
// pages/myNews/myNews.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      newLength:0,
      newStatus:false,
      newDetails:[],
      newBox:[],
      newHeight:0
  },
  lookMore:function(e){
    var _this = this;
    var box = _this.data.newBox;
    box[e.currentTarget.dataset.index].isread = 0;
    if (e.currentTarget.dataset.read==1)
    {
      var url = config.route;
      var data = {
        id: e.currentTarget.dataset.readid,
      }
      network.GET(url + api.getRead, {
        params: data,
        success: function (res) {
          if(res.data.status==1)
          {
            var len = _this.data.newLength;
            len--;
            _this.setData({
              newBox: box,
              newLength: len
            })
          }else{
            wx.showToast({
              title: '网络错误！',
              icon: 'none',
              mask: true
            });
          }
        }
      });
    }
    _this.setData({
      newStatus: true,     
      newDetails: _this.data.newBox[e.currentTarget.dataset.index]
    })
  },
  closePop:function(){
    var _this = this;
    _this.setData({
      newStatus: false
    })
  },
  return:function(){
    wx.navigateBack();
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
    //设置没有消息的高度
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var winH = wx.getSystemInfoSync().windowHeight;
    wx.createSelectorQuery().select('#getH').boundingClientRect(function (rect) {
      _this.setData({
        newHeight: winH - rect.height-1
      });
    }).exec()
    
    var url = config.route;
    var data = {
      uid: app.globalData.code,
    }
    network.GET(url + api.getNews, {
      params: data,
      success: function (res) {
        var len = 0;
        var msg = res.data.message;
        for (var i = 0; i < msg.length;i++)
        {
          if (msg[i].isread==1)
          {
            len++;
          }
        }
        wx.hideLoading();
        _this.setData({
          newBox: res.data.message,
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
  
  }
})