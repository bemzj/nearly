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
    address:[],
    addLength:0,
    hasVip:-1,
    userIntro:{},
    vip:{},
    web:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
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
        var vip = res.data.vip;
        // vip.desc = app.convertHtmlToText(vip.desc);
        _this.setData({
          web: config.route,
          vip: vip
        });
        console.log(_this.data.vip);
      }
    });
  },
  setHeight:function(){
    var _this = this;
    var addLength = 0;
    if (_this.data.addLength==0)
    {
      if (_this.data.address.length >= 2) {
        addLength = 60 * _this.data.address.length;
      }
    }else{
      addLength = 0;
    }
    
    _this.setData({
      addLength: addLength,
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
    if (app.globalData.userInfo.status==1)
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
    //服务器地址
    var url = config.route;
    //数据
    var data = {
      uid: app.globalData.code,
    }
    //获取地址
    network.GET(url + api.getAddress, {
      params: data,
      success: function (res) {
        console.log(res.data.address);
        _this.setData({
          address: res.data.address
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