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
  //打开地图导航
  getMap: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.address,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            setTimeout(function () {
              wx.openLocation({
                latitude: e.currentTarget.dataset.lat,
                longitude: e.currentTarget.dataset.long,
                scale: 15,
                success: function (res) {

                }
              });
            }, 1000);
          }
        })
      }
    })

  },
  //授权登录
  getUser:function(e){
    var _this = this;
    //服务器地址
    var url = config.route;
    //数据
    var data = {
      uid: app.globalData.code,
    }
    //用户授权获取
    if (e.detail.errMsg == 'getUserInfo:ok') {
      //设置用户信息数据
      var data = {
        userinfo: e.detail.userInfo,
        uid: app.globalData.code,
      };
      //记录信息
      network.GET(url + api.getUserInfo, {
        params: data,
        success: function (res) {
          //拿到解密后的数据，进行代码逻辑
          if(res.data.status==1)
          {
            var data = {
              uid: app.globalData.code,
            }
            //获取用户信息
            network.GET(url + api.getUserStatus, {
              params: data,
              success: function (res) {
                app.globalData.userInfo = res.data.data;
                console.log(app.globalData.userInfo);
                _this.setData({
                  tipStatus2: false,
                  popText1: ''
                });
                wx.showToast({
                  title: '授权成功！',
                  icon: 'none',
                  duration: 2000
                });
              },
              fail:function(){
                wx.showToast({
                  title: '网络错误！',
                  icon: 'none',
                  duration: 2000
                });
              }
            });
            
          }else{
            wx.showToast({
              title: '授权失败，请关闭授权再重新授权！',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function () {
          //失败后的逻辑  
          wx.showToast({
            title: '授权失败，请关闭授权再重新授权！',
            icon: 'none',
            duration: 2000
          });
        },
      })
    }
  },
  //获取定位
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
    //页面加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    //服务器地址
    var url = config.route;
    _this.setData({
      web: config.route,
    });
    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: url+api.getUserCode,
            data: {
              code: res.code
            },
            //获取用户id成功
            success: function (data) {
              app.globalData.code = data.data.id;
              //数据
              var data = {
                uid: app.globalData.code,
              }
              //获取店家
              network.GET(url + api.getIndexShop, {
                params: data,
                success: function (res) {
                  _this.setData({
                    shopList: res.data.shop
                  });
                },
                fail: function () {
                  //失败后的逻辑  
                },
              });
              //获取用户信息
              network.GET(url + api.getUserStatus, {
                params: data,
                success: function (res) {
                  if (res.data.data.avatarurl == "") {
                    wx.hideLoading();
                    _this.setData({
                      tipStatus2: true,
                      popText1: '授权登录'
                    });
                  } else {
                    app.globalData.userInfo = res.data.data;
                    wx.hideLoading();
                  }
                }
              });
            },
            //获取用户id失败
            fail:function(data){
              wx.showToast({
                title: '获取用户信息失败，请退出重新登录',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else {
          wx.showToast({
            title: '请退出重新登录',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
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
    
  },
  onShow:function(){  
    var _this = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'Z3BBZ-C563U-MDPVI-BSXTL-ZB2W5-ZRBHU'
    });
    //获取当前位置（在授权的情况下）
    wx.getLocation({
      type: 'wgs84',
      //用户
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        //根据获取经纬度解析位置
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          //解析成功
          success: function (res) {
            _this.setData({
              street: res.result.address_component.street
            });
          },
          //解析失败
          fail: function (res) {
            _this.setData({
              street: ""
            });
          }
        });
      },
      //授权失败
      fail:function(res){
        _this.setData({
          street: ""
        })
      }
    });
    //服务器地址
    var url = config.route;    
    //获取消息数
    if (app.globalData.code == null)
    {
      setTimeout(function () {
        
        var data = {
          uid: app.globalData.code,
        }
        //获取消息
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
    
  },
  //增加浏览次数
  addBrowse:function(e){
    //服务器地址
    var url = config.route;
    var data = {
      uid: app.globalData.code,
      id: e.currentTarget.dataset.shopid
    }
    network.GET(url + api.addBrowse, {
      params: data,
      success: function (res) {
      }
    });
  },
  //点击收藏
  collect:function(e){
    var _this = this;
    var shopList = _this.data.shopList;
    var msg;
    if (shopList[e.currentTarget.dataset.index].collect==0)
    {
      shopList[e.currentTarget.dataset.index].collect = 1;
      msg = "收藏成功";
    }else{
      shopList[e.currentTarget.dataset.index].collect = 0;
      msg = "取消收藏";
    }
    var url = config.route;
    var data = {
      uid: app.globalData.code,
      id: e.currentTarget.dataset.shopid
    }
    network.GET(url + api.collect, {
      params: data,
      success: function (res) {
        if(res.data.status==1)
        {
          _this.setData({
            shopList:shopList
          });
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: "收藏失败",
            icon: 'none',
            duration: 2000
          });
        }
        
      }
    });
  }
})
