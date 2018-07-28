// pages/search/search.js
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
    allList:[],
    shopList: [],
    startIndex:0,
    increment:3
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
  //按钮搜索
  submitBtn:function(e){
    console.log(e);
    var _this = this;
    wx.showLoading({
      title: '搜索中',
    })
    _this.setData({
      startIndex: 0
    });
    var url = config.route;
    //数据
    var data = {
      uid: app.globalData.code,
      keyword: e.detail.value.keyword
    }
    //获取店家
    network.GET(url + api.getIndexShop, {
      params: data,
      success: function (res) {
        wx.hideLoading();
        if (res.data.shop.length == 0) {
          wx.showToast({
            title: "暂无结果",
            icon: 'none',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: "搜索成功",
            icon: 'none',
            duration: 2000
          });
        }
        var shop = res.data.shop.slice(_this.data.startIndex, _this.data.startIndex + _this.data.increment);
        _this.setData({
          allList: res.data.shop,
          startIndex: _this.data.startIndex + _this.data.increment,
          shopList: shop
        });
      },
      fail: function () {
        //失败后的逻辑  
      },
    });
  },
  //手机软键盘搜索
  phoneSearch:function(e){
    var _this = this;
    wx.showLoading({
      title: '搜索中',
    })
    _this.setData({
      startIndex: 0
    });
    var url = config.route;
    //数据
    var data = {
      uid: app.globalData.code,
      keyword: e.detail.value
    }
    //获取店家
    network.GET(url + api.getIndexShop, {
      params: data,
      success: function (res) {
        wx.hideLoading();
        if (res.data.shop.length==0)
        {
          wx.showToast({
            title: "暂无结果",
            icon: 'none',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: "搜索成功",
            icon: 'none',
            duration: 2000
          });
        }
        var shop = res.data.shop.slice(_this.data.startIndex, _this.data.startIndex +_this.data.increment);
        _this.setData({
          allList: res.data.shop,
          startIndex: _this.data.startIndex + _this.data.increment,
          shopList: shop
        });
      },
      fail: function () {
        //失败后的逻辑  
      },
    });
  },
  //打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //增加浏览次数
  addBrowse: function (e) {
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
  collect: function (e) {
    var _this = this;
    var shopList = _this.data.shopList;
    var msg;
    if (shopList[e.currentTarget.dataset.index].collect == 0) {
      shopList[e.currentTarget.dataset.index].collect = 1;
      msg = "收藏成功";
    } else {
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
        if (res.data.status == 1) {
          _this.setData({
            shopList: shopList
          });
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: "收藏失败",
            icon: 'none',
            duration: 2000
          });
        }

      }
    });
  },
  //打开地图导航
  getMap: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.address,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            setTimeout(function(){
              wx.openLocation({
                latitude: e.currentTarget.dataset.lat,
                longitude: e.currentTarget.dataset.long,
                scale: 15,
                success: function (res) {

                }
              });
            },1000);
          }
        })
      }
    })
    
  },
  //换一批
  exchangeshop:function(){
    var _this = this;
    wx.showToast({
      title: "搜索成功",
      icon: 'none',
      duration: 2000
    });
    var shop = _this.data.allList.slice(_this.data.startIndex, _this.data.startIndex+_this.data.increment);
    _this.setData({
      startIndex: _this.data.startIndex + _this.data.increment,
      shopList: shop
    });
  }
})