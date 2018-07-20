//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
