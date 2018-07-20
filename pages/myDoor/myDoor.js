// pages/myDoor/myDoor.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeOne:[
      '餐饮1',
      '餐饮2',
      '餐饮3',
      '餐饮4',
      '餐饮5',
    ],
    toIndex:0,
    typeTwo: [
      '餐饮11',
      '餐饮22',
      '餐饮33',
      '餐饮44',
      '餐饮55',
    ],
    ttIndex: 0,
    region: ['', '', ''],
    currentRegion:[]
  },
  changeOne:function(e){
    var _this = this;
    _this.setData({
      toIndex:e.detail.value
    })
  },
  changeTwo: function (e) {
    var _this = this;
    _this.setData({
      ttIndex: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    var _this = this;
    _this.setData({
      region: e.detail.value
    })
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
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'Z3BBZ-C563U-MDPVI-BSXTL-ZB2W5-ZRBHU'
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res);
            var obj = _this.data.region;
            obj[0] = res.result.address_component.province;
            obj[1] = res.result.address_component.city;
            obj[2] = res.result.address_component.district;
            _this.setData({
              region: obj,
              currentRegion: obj
            })
          },
          fail: function (res) { }
        });
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