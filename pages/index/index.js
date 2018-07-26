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
    newLength: 0,
    web:"",
    street:"",
    banners:[],
    shopLimit:5,
    increment:5,
    shopList: [],
    typeList:[],
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
  getMap:function(e){
    qqmapsdk.geocoder({
      address: e.currentTarget.dataset.address,
      success: function (res) {
        console.log(res);
        wx.openLocation({
            latitude: res.result.location.lat,
            longitude: res.result.location.lng,
            scale:15,
            success:function(res){

            }
          }
        )
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误，请退出重试！',
          icon: 'none',
          mask: true
        });
      }
    });
    
  },
  getUser:function(e){
    var _this = this;
    var url = config.route;
    var data = {
      uid: app.globalData.code,
    }
    network.GET(url + api.getUserStatus, {
      params: data,
      success: function (res) {
        if (res.data.data.avatarurl=="")
        {
          if (e.detail.errMsg == 'getUserInfo:ok') {
            // 把用户信息存入缓存
            wx.setStorage({
              key: "userInfo",
              data: e.detail.userInfo
            });
            _this.setData({
              userInfo: e.detail.userInfo,
              tipStatus2: false
            });
            var url = config.route + api.getUserInfo;
            var data = {
              userinfo: e.detail.userInfo,
              uid: app.globalData.code,
            };
            network.GET(url, {
              params: data,
              success: function (res) {
                //拿到解密后的数据，进行代码逻辑
              },
              fail: function () {
                //失败后的逻辑  
              },
            })
          }
        }else{
          wx.setStorage({
            key: "userInfo",
            data: res.data.data
          });
          _this.setData({
            tipStatus2: false
          });
          
        }
        //拿到解密后的数据，进行代码逻辑
      },
      fail: function () {
        //失败后的逻辑  
      },
    })
    
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
  onLoad:function(){
    var _this = this;
    var url = config.route;
    _this.setData({
      web: config.route,
    });
    //授权登录
    setTimeout(function () {    
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {        
          var url = config.route;
          var data = {
            uid: app.globalData.code,
          }
          network.GET(url + api.getUserStatus, {
            params: data,
            success: function (res) {
              wx.setStorage({
                key: "userInfo",
                data: res.data.data
              });
              _this.setData({
                tipStatus2: false
              })
            }
          });
        },
        fail: function (e) {
          console.log(1);
          _this.setData({
            tipStatus2: true,
            popText1: '授权登录'
          });
        }
      })
    }, 500);
    //获取banner图
    
    network.GET(url + api.getIndexBanner, {
      params: {},
      success: function (res) {
        var pics = res.data.pics;
        _this.setData({
          banners: pics
        });
        //拿到解密后的数据，进行代码逻辑
      },
      fail: function () {
        //失败后的逻辑  
      },
    });
    var all = {
      id:-1,
      name:"全部",
      pid:0,
      status:1,
      pic:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAABiCAMAAAABWj3xAAAA3lBMVEWZmZkAAACZmZmZmZmZmZmZmZmZmZmZmZmbm5ucnJyenp6ZmZn///////+ZmZmampqZmZmZmZn+/v719fX+/v79/f2qqqr9/f34+Pj9/f3z8/P8/Pz39/fo6Ojo6OjIyMi+vr7v7+/s7Oz7+/v////7+/v////5+fnu7u79/f3X19f7+/v5+fn/////oVz/yaL/6Nb/0a//+/f/vIr/x5//4cv/qWr/5dH/vo7/uof/tYH/7uL/y6X/1bb//Pr/8+n/38j/r3T/6tv/2Lv/qWn/+fP/0K3/3cX/wpX/toHkM+RaAAAALXRSTlMCAAwGEycfLQQKEBnv+SAdJBbmqJq1K9i9sJqLhHNHPTYiGFr72tPCkXpaOV52TBlWAAADfElEQVR42uzW0WrDMAxA0VurD3JwXoJLCSmFJFAonf7/97Y0Yevqde8WvX9wsLDErogqKx0ULr1d+0tqrZradOmvN4X/aMA4dFZl3TACr2gw5Ype67k2T/AnDZiTVV2agZIGMVv15QjPNGgO5qBDA79pEF3IvmwRHmmgDqZxLSsbapPN5qYPhR+aTpX/jY+lSb9pIG7GcSkLrDTQseJNXdaOChtNBnPVIGw0DZXeja/qgt5pIGdz1llgoWk8mbNOUe80Cb05qw/CDpBwNGcdgwBobBzt67XURF1prrbaUrvRwt7ctQ/OaeKTJm/aJzt2k8MgCAZh+ERD/SPGCkIwVnv/CzVuqGAX1mRINDw72L2rL5nLyWkHld3Tq0es3GylZ0BFTHuLwAKgHyckwkzTItICNlkZNa0TkQZDgYgBS+K0apfWgoSaVovI40daAZKcdkZOy2n/y2ln5LRrpu1P9n3THhhukjaLiAOsQWCyIKGmYRGBFwAz9vD8k4KaBqkaTxVYGSnbL0ktSz4gVBtIJm8jhzlderoHVv32z4GImaZEQAO7VUGBh5gmP+yaSwqEMBBET/RmkPkwgyEYEO9/JEEkaLtSqIBNv2XtHr1IEeph6KG32Yc2iItWgmSzH22QFy3eNnvRBnk95unjaqEmItSuEGqhdp5Qu8bxyXat5qSNdFZjgMFmHSKkarnsLf5wOGXJiJCqkVMZvytjmViYtllSmsUHggNC7Y6E2h2pav4GulXN36y6qvkbw8/d3FGKwyAQBmDWRFM1dXRlJQRC8tDSUvD+19tBzRRyA+e/wcc/ah86IRqTXcpv/irtJkZ+iyf0j3F+60KNpg1wW/IC2s6wa2aV1VYa3iNhZ/Wy3fdQbpEfpI0QM6NEGMXQVvOMPRi92vNR5hFpZSLVltlkU2UekVZrc2xGMrpaWqGV05aWzCJLKiftpGFtQaVXZpBXUgFLq7RWm3WJwUzG5GwtjT7vUGxy6/yenDdZZHjSiHbajtjx232PxykjGtmUl/va6e/J33WXXpGs0cgWwHk5fd7Lc37kbvKYn8v7M0nvIDQZ0chmsDjESTl1FikRhpWZJiMa2bQwwQLqvJcdxXt0gQ1G6CojGtkqbgzWAqiOAmBtGCusyIh2xQljxs5ijCDYlUY2xA1ai86i9VBgpCHaVYcZOsoNQ65vGH/68h85g+wIgBecAQAAAABJRU5ErkJggg=="
    }
    //获取分类
    network.GET(url + api.getIndexType, {
      params: {},
      success: function (res) {
        var typelist = res.data.cates;
        typelist.push(all);
        _this.setData({
          typeList: typelist
        });
        //拿到解密后的数据，进行代码逻辑
      },
      fail: function () {
        //失败后的逻辑  
      },
    });
    //获取店家
    network.GET(url + api.getIndexShop, {
      params: {},
      success: function (res) {
        _this.setData({
          shopList: res.data.shop
        });
      },
      fail: function () {
        //失败后的逻辑  
      },
    });
  },
  onShow:function(){
    // 实例化API核心类
    var _this = this;
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
    //获取消息数
    if (app.globalData.code == null)
    {
      setTimeout(function () {
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
      }, 800);
    }else{
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
    }
    
    
    
  },
  //分类
  typeNav:function(e){
    wx.redirectTo({
      url: '../type/type?id=' + e.currentTarget.dataset.id
    })
  },
  //查看更多
  lookMore:function(e){
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    
    setTimeout(function () {
      wx.hideLoading(); 
      _this.setData({
        shopLimit: _this.data.shopLimit + _this.data.increment
      });
    }, 2000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res.data);
        if(!res.data)
        {
          network.GET(url + api.getUserStatus, {
            params: data,
            success: function (res) {
              if (res.data.data.avatarurl == "") {
                wx.showToast({
                  title: '请您授权登录，否则无法享受更多权力！',
                  icon: 'none',
                  mask: true
                });
              } else {
                wx.setStorage({
                  key: "userInfo",
                  data: res.data.data
                });
              }
              //拿到解密后的数据，进行代码逻辑
            },
            fail: function () {
              //失败后的逻辑  
            },
          })
        }
      }
    });
  }
})
