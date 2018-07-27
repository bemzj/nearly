// pages/myCard/myCard.js
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
    myAddress:'',
    index:0,
    autoHeight:false,
    address:[
      '广东省广州市天河区车陂街道1',
      '广东省广州市天河区车陂街道2',
      '广东省广州市天河区车陂街道3'
    ],
    hasVip:-1,
    userIntro:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //服务器地址
    var url = config.route;
    //数据
    var data = {
      uid: app.globalData.code,
    }
    network.GET(url + api.getCardIntro, {
      params: data,
      success: function (res) {
        console.log(res);
      }
    });
  },
  setHeight:function(){
    var _this = this;
    _this.setData({
      autoHeight:!_this.data.autoHeight
    });
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
    //判断是否为会员
    if (app.globalData.userInfo.status==0)
    {
      _this.setData({
        userIntro: app.globalData.userInfo,
        hasVip: 0
      });
    }else{
      _this.setData({
        userIntro: app.globalData.userInfo,
        hasVip: 1
      });
    }
    
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