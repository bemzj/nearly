// pages/atyApply/atyApply.js
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
    sid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //服务器
    var url = config.route;
    //数据
    var data = {
      uid: app.globalData.code,
    }
    //判断是否有门店
    network.GET(url + api.getShopMsg, {
      params: data,
      success: function (res) {
        if (res.data.status==1)
        {
          _this.setData({
            sid: res.data.shop.id
          });
        }else{
          wx.showToast({
            title: '网络错误！',
            icon: 'none',
            mask: true
          });
        }
      },
      fail:function(){
        wx.showToast({
          title: '网络错误！',
          icon: 'none',
          mask: true
        });
      }
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
  submit:function(e){
    if (e.detail.value.title=="")
    {
      wx.showToast({
        title: '门店活动主题不能为空！',
        icon: 'none',
        mask: true
      });
    } else if (e.detail.value.title.length >15) {
      wx.showToast({
        title: '字数限制为15个！',
        icon: 'none',
        mask: true
      });
    } else if (e.detail.value.o_price == "") {
      wx.showToast({
        title: '原价不能为空！',
        icon: 'none',
        mask: true
      });
    } else if (e.detail.value.price == "") {
      wx.showToast({
        title: '现价不能为空！',
        icon: 'none',
        mask: true
      });
    } else if (e.detail.value.content == "") {
      wx.showToast({
        title: '门店活动内容不能为空！',
        icon: 'none',
        mask: true
      });
    }  else if (e.detail.value.content.length>120)
    {
      wx.showToast({
        title: '字数限制为120个！',
        icon: 'none',
        mask: true
      });
    }else{
      var url = config.route;
      //数据
      var data = e.detail.value;
      //判断是否有门店
      network.GET(url + api.applyActivity, {
        params: data,
        success: function (res) {
          if (res.data.status==1)
          {
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              });
            },1500);
          }
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          });
        },
        fail:function(){
          wx.showToast({
            title:"网络错误",
            icon: 'none',
            mask: true
          });
        }
      });   
    }
  }
})