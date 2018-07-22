//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    street:"",
    banners:[
      '../../img/indexBanner.png',
      '../../img/indexBanner.png',
      '../../img/indexBanner.png'
    ],
    shopList: [
      {
        src: '../../img/list.png',
        type: '美食',
        name: '点都德1',
        number: 3200,
        fire: 4,
        address: '广州市天河区新港东路中洲中心北塔负1楼',
        nowPay: 99,
        prePay: 100,
        payName: '世界杯99元超值套餐'
      },
      {
        src: '../../img/list.png',
        type: '美食',
        name: '点都德2',
        number: 3200,
        fire: 4,
        address: '广州市天河区新港东路中洲中心北塔负1楼',
        nowPay: 99,
        prePay: 100,
        payName: '世界杯99元超值套餐'
      }
    ],
    typeList:[
      {
        name:'餐饮'
      },
      {
        name: '甜点饮品'
      },
      {
        name: '蔬菜水果'
      },
      {
        name: 'KTV'
      },
      {
        name: '电影'
      },
      {
        name: '全部'
      }
    ],
    swiperHeight: '350rpx',
    swiper: {
      autoplay: 'true',
      interval: 5000,
      duration: 300,
      circular: 'true',
    },
  },
  //打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getLocation:function(){
    var _this = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userLocation"]==false)
        {
          wx.openSetting({
            success: (res) => {
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
                      _this.setData({
                        street: res.result.address_component.street
                      })
                      console.log(res.result.address_component.street);
                    },
                    fail: function (res) { }
                  });
                },
                fail: function (res) {
                  _this.setData({
                    street: ""
                  })
                }
              });
            }
          })
        }
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow:function(){
    var _this = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'Z3BBZ-C563U-MDPVI-BSXTL-ZB2W5-ZRBHU'
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
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
            _this.setData({
              street: res.result.address_component.street
            })
            console.log(res.result.address_component.street);
          },
          fail: function (res) { }
        });
      },
      fail:function(res){
        _this.setData({
          street: ""
        })
      }
    });
  }
})
