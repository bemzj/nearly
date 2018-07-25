//index.js
//获取应用实例
const app = getApp()
const {
  api,
  config
} = require('../../utils/config.js')
const network = require("../../utils/network.js")
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
    tipStatus2: false,//弹窗
    popText1: '',
  },
  //打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  getMap:function(){
    wx.openLocation({
        latitude: 23.11985,
        longitude: 113.395889,
        scale:15,
        success:function(res){

        }
      }
    )
  },
  onLoad: function () {
    var _this  = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        _this.setData({
          tipStatus2: false
        })
      },
      fail:function(e){
        _this.setData({
          tipStatus2: true,
          popText1: '授权登录'
        });
      }
    })    
  },
  getUser:function(e){
    console.log(e.detail.errMsg);
    if (e.detail.errMsg == 'getUserInfo:ok') {
      // 把用户信息存入缓存
      wx.setStorage({
        key: "userInfo",
        data: e.detail.userInfo
      });
      this.setData({
        userInfo: e.detail.userInfo,
        tipStatus2: false
      })
      // console.log(app.global.userInfo);
      // setTimeout(function () {
      //   //把用户的昵称头像传到后台保存
      //   wx.request({
      //     url: config.route + api.SmallUserInfo,
      //     data: {
      //       nickname: app.globalData.userInfo.nickName,
      //       avatarurl: app.globalData.userInfo.avatarUrl,
      //       id: app.globalData.id,
      //       token: config.token,
      //     },
      //     success: function (res) {
      //       // console.log('login:' + res.data.id);
      //     }
      //   })
      // }, 500)
      // 获取用户信息
      wx.getSetting({
        success: function (res) {
          wx.getUserInfo({
            
            success: function (res) {
              // wx.request({
              //   url: 'https://jing.hengdikeji.com/index/wechat/getUserInfo',
              //   data: {
              //     code: res.userInfo
              //   }
              // })
              var _this = this;
              var url = config.route + api.getUserInfo;
              var data = {
                userinfo: res.userInfo,
              };
              network.GET(url, {
                params: data,
                success: function (res) {
                  // if (res.data.length > 0) {
                  //   _this.setData({
                  //     cardList: res.data
                  //   });
                  // } else {
                  //   _this.setData({
                  //     cardList: []
                  //   });
                  // }
                  console.log(res);
                  //拿到解密后的数据，进行代码逻辑
                },
                fail: function () {
                  //失败后的逻辑  
                },
              })
            }

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
