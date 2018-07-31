// pages/myCollect/myCollect.js
//获取应用实例
const app = getApp()
const {
  api,
  config
} = require('../../utils/config.js')
const network = require("../../utils/network.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:[],
    flag: 0,
    text: '',
    shopIndex:-1,
    deleteIndex:-1,
    tipStatus:false,
    popText:'',
    shopId:-1
  },
  //打电话
  callPhone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //删除店铺
  deleteShop:function(e){
    var _this = this;
    _this.setData({
      deleteIndex: e.currentTarget.dataset.index,
      shopIndex: -1,
      shopId: e.currentTarget.dataset.shopid,
      tipStatus:true,
      popText:'确定删除该收藏？'
    });
  },
  closePop:function(e){
    var _this = this;
    _this.setData({
      deleteIndex: -1,
      shopIndex: -1,
      shopId:-1,
      tipStatus: false,
      popText: ''
    });
  },
  comfirmPop:function(e){
    var _this = this;
    var shopId = _this.data.shopId;
    var url = config.route;
    var data = {
      id: shopId,
    }
    console.log(data);
    network.GET(url + api.delCollect, {
      params: data,
      success: function (res) {
        console.log(res);
        if (res.data.status==1)
        {
          var list = _this.data.shopList;
          list.splice(_this.data.deleteIndex, 1);
          _this.setData({
            shopList: list,
            deleteIndex: -1,
            tipStatus: false,
            popText: '',
            shopId: -1
          });
          wx.showToast({
            title: '删除成功！',
            icon: 'none',
            mask: true
          });
        }else{
          wx.showToast({
            title: '删除失败！',
            icon: 'none',
            mask: true
          });
          _this.setData({
            deleteIndex: -1,
            tipStatus: false,
            popText: '',
            shopId: -1
          });
        }
        
      },
      fail: function () {
        //失败后的逻辑  
        wx.showToast({
          title: '删除失败！',
          icon: 'none',
          mask: true
        });
      },
    });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  handletouchmove: function (event) {
    var _this = this;
    if (this.data.flag !== 0) {
      return
    }
    let currentX = event.touches[0].pageX;
    let currentY = event.touches[0].pageY;
    let tx = currentX - this.data.lastX;
    let ty = currentY - this.data.lastY;
    let text = "";
    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0) {
        if (_this.data.shopIndex != event.currentTarget.dataset.index)
        {
          _this.setData({
            shopIndex: event.currentTarget.dataset.index
          });
        }
        
        this.data.flag = 1
      }
      else if (tx > 0) {
        if (_this.data.shopIndex != -1 && _this.data.shopIndex == event.currentTarget.dataset.index)
        {
          _this.setData({
            shopIndex: -1
          });
        }
        this.data.flag = 2
      }

    }
    //上下方向滑动
    else {
      if (ty < 0) {
        this.data.flag = 3

      }
      else if (ty > 0) {
        this.data.flag = 4
      }

    }

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX;
    this.data.lastY = currentY;
    this.setData({
      text: text,
    });
  },

  handletouchstart: function (event) {
    
    this.data.lastX = event.touches[0].pageX;
    this.data.lastY = event.touches[0].pageY;
  },
  handletouchend: function (event) {
    this.data.flag = 0
    this.setData({
      text: "没有滑动",
    });
  },
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'Z3BBZ-C563U-MDPVI-BSXTL-ZB2W5-ZRBHU'
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var url = config.route;
    var data = {
      uid: app.globalData.code,
    }
    network.GET(url + api.getCollect, {
      params: data,
      success: function (res) {
        wx.hideLoading();
        _this.setData({
          shopList:res.data.row
        })
      },
      fail: function () {
        //失败后的逻辑  
      },
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
  
  },
  //导航
  getMap: function (e) {
    qqmapsdk.geocoder({
      address: e.currentTarget.dataset.address,
      success: function (res) {
        console.log(res);
        wx.openLocation({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          scale: 15,
          success: function (res) {

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
})