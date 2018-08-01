// pages/search/search.js
const app = getApp()
const {
  api,
  config
} = require('../../utils/config.js')
const network = require("../../utils/network.js")
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newLength: 0,
    typeName:"全部",
    shopList: [],
    firstType:[],
    secondeType: [],
    kliometer:[],
    firstIndex:0,
    secondIndex:0,
    kiloIndex:0,
    nextStatus:true,
    down:false,
    allDown:false,
    kiloDown:false,
    downStatus:0,
    allType:[],
    fid:-1,
    sid:-1,
    page:0,
    page_size:5,
    lat:'',
    lng:'',
    cid:''
  },
  closeType:function(){
    var _this = this;
    _this.setData({
      downStatus: 0,
      down: false,
      allDown: false,
      kiloDown: false,
      klioDown:false
    })
  },
  //全部分类点击
  allClick:function(e){
    var _this = this;
    if (_this.data.firstIndex!=-1)
    {
      var mydata;
      mydata = {
        uid: app.globalData.code,
        distance: _this.data.kliometer[_this.data.kiloIndex].mileage * 2000,
        page:0,
        page_size: _this.data.page_size,
        location: _this.data.lat + ',' + _this.data.lng,
      }
      console.log(mydata)
      //服务器地址
      var url = config.route;
      network.GET(url + api.getIndexShop, {
        params: mydata,
        success: function (res) {
          _this.setData({
            shopList: res.data.shop
          });
        },
        fail: function () {
          //失败后的逻辑  
        },
      });
      
    }
    _this.setData({
      downStatus: 0,
      down: false,
      allDown: false,
      kiloDown: false,
      klioDown: false,
      firstIndex: -1,
      cid:-1,
      secondeType: [],
      typeName:"全部"
    });
  },
  //打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //第一类点击
  firstClick:function(e){
    var _this = this;
    //服务器地址
    var url = config.route;
    //点击其他第一类
    if (e.currentTarget.dataset.index != _this.data.firstIndex)
    {
      var topid = e.currentTarget.dataset.topid;
      console.log(topid);
      var mydata = {
        uid: app.globalData.code,
        distance: _this.data.kliometer[_this.data.kiloIndex],
        cid: topid,
        page: 0,
        page_size: _this.data.page_size,
        location: _this.data.lat + ',' + _this.data.lng,
      }
      network.GET(url + api.getIndexShop, {
        params: mydata,
        success: function (res) {
          _this.setData({
            shopList: res.data.shop
          });
        },
        fail: function () {
          //失败后的逻辑  
        },
      });
      _this.setData({
        firstIndex: e.currentTarget.dataset.index,
        secondIndex:0,
        cid: topid,
        fid: topid,
        secondeType: _this.data.allType[e.currentTarget.dataset.index].son,
        typeName: _this.data.allType[e.currentTarget.dataset.index].name
      });
    }
    
  },
  //第二类点击
  secondClick:function(e){
    var _this = this; 
    var topid = e.currentTarget.dataset.topid;
    var tname;
    if(topid ==-1)
    {
      topid = _this.data.fid;
      tname = _this.data.allType[_this.data.firstIndex].name;
    }else{
      tname = _this.data.allType[_this.data.firstIndex].son[e.currentTarget.dataset.index].name;
    }
    console.log(topid);
    //服务器地址
    var url = config.route;
    var mydata = {
      uid: app.globalData.code,
      distance: _this.data.kliometer[_this.data.kiloIndex],
      cid: topid,
      page:0,
      page_size: _this.data.page_size,
      location: _this.data.lat + ',' + _this.data.lng,
    }
    network.GET(url + api.getIndexShop, {
      params: mydata,
      success: function (res) {
        _this.setData({
          shopList: res.data.shop
        });
      },
      fail: function () {
        //失败后的逻辑  
      },
    });
    _this.setData({
      secondIndex: e.currentTarget.dataset.index,
      downStatus: 0,
      down: false,
      cid: topid,
      allDown: false,
      kiloDown: false,
      klioDown: false,
      typeName: tname
    });
  },
  //选择公路
  selectKilo:function(e){
    var _this = this;
    var topid = _this.data.cid;
    var mydata;
    
    if (_this.data.cid==-1)
    {
      mydata = {
        uid: app.globalData.code,
        distance: _this.data.kliometer[e.currentTarget.dataset.index].mileage*2000,
        page: 0,
        page_size: _this.data.page_size,
        location: _this.data.lat + ',' + _this.data.lng,
      }
    }else{
      mydata = {
        uid: app.globalData.code,
        distance: _this.data.kliometer[e.currentTarget.dataset.index].mileage * 2000,
        cid: topid,
        page: 0,
        page_size: _this.data.page_size,
        location: _this.data.lat + ',' + _this.data.lng,
      }
    }
    console.log(mydata);
    //服务器地址
    var url = config.route;
    network.GET(url + api.getIndexShop, {
      params: mydata,
      success: function (res) {
        _this.setData({
          shopList: res.data.shop
        });
      },
      fail: function () {
        //失败后的逻辑  
      },
    });
    _this.setData({
      kiloIndex: e.currentTarget.dataset.index,
      downStatus: 0,
      down: false,
      allDown: false,
      kiloDown: false,
      klioDown: false
    });
  },
  //全部的效果 上浮和下拉 效果
  allType:function(){
    var _this = this;
    var downStatus = _this.data.downStatus;
    var down = _this.data.down;
    var allDown = _this.data.allDown
    if (downStatus==1)
    {
      if (allDown==true)
      {
        down = false;
      }else{
        down = true;
      }
    }else{
      down = true;
    }
    _this.setData({
      down: down,
      downStatus:1,
      allDown: !_this.data.allDown,
      kiloDown: false
    })
  },
  //公里选择 上浮和下拉 效果
  allklio:function(){
    var _this = this;
    var downStatus = _this.data.downStatus;
    var down = _this.data.down;
    var kiloDown = _this.data.kiloDown
    if (downStatus == 2) {
      if (kiloDown == true) {
        down = false;
      } else {
        down = true;
      }
    } else {
      down = true;
    }
    _this.setData({
      down: down,
      allDown: false,
      downStatus: 2,
      kiloDown: !_this.data.kiloDown,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'Z3BBZ-C563U-MDPVI-BSXTL-ZB2W5-ZRBHU'
    });
    //服务器地址
    var url = config.route;
    //数据
    var data = {
      uid: app.globalData.code,
    }
    //获取分类
    network.GET(url + api.getTypes, {
      params: data,
      success: function (res) {
        var alltype = res.data.cates;
        console.log(alltype);
        //增加二级分类的类型
        for (var i = 0; i < alltype.length;i++)
        {
          var all = {
            id: -1,
            name: "全部",
            pic: "",
            pid: -1,
            sort: -1,
            status: 1
          };
          alltype[i].son.splice(0, 0, all);
        }
        //设置所有类型的参数+第一类数据
        _this.setData({
          allType: alltype,
          firstType: res.data.cates,
        });
        //获取公里数
        network.GET(url + api.getMile, {
          params: data,
          success: function (res) {
            //设置公里数数据
            _this.setData({
              kliometer: res.data.mileage
            });
            //公里数数据
            var kilo = res.data.mileage[0].mileage * 2000
            console.log(kilo);
            wx.getLocation({
              type: 'wgs84',
              //用户
              success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                var speed = res.speed;
                var accuracy = res.accuracy;
                //设置当前经纬度
                _this.setData({
                  lat:latitude,
                  lng:longitude
                });
                //判断从首页的全部以及直接点击导航的情况下
                if (JSON.stringify(options) == "{}" | options.id == -1) {
                  var mydata = {
                    uid: app.globalData.code,
                    distance: kilo,
                    page:0,
                    page_size: _this.data.page_size,
                    location: latitude + ',' + longitude,
                  }
                  console.log(mydata);
                  network.GET(url + api.getIndexShop, {
                    params: mydata,
                    success: function (res) {
                      wx.hideLoading();
                      
                      _this.setData({
                        shopList: res.data.shop,
                      });
                    },
                    fail: function () {
                      //失败后的逻辑  
                    },
                  });
                  _this.setData({
                    firstIndex: -1, //设置第一分类选项的情况
                    secondIndex: -1, //设置第二分类的情况
                    secondeType: [], //第二类数据为空
                    cid:-1, //当前cid的情况
                    fid:-1 //当前cid的情况
                  });
                } else {
                  var mydata = {
                    uid: app.globalData.code,
                    distance: kilo,
                    page: 0,
                    page_size: _this.data.page_size,
                    location: latitude + ',' + longitude,
                    cid: options.tid,
                  } 
                  network.GET(url + api.getIndexShop, {
                    params: mydata,
                    success: function (res) {
                      console.log(res);
                      wx.hideLoading();
                      _this.setData({
                        shopList: res.data.shop
                      });
                    },
                    fail: function () {
                      //失败后的逻辑  
                    },
                  });
                  _this.setData({
                    typeName: _this.data.allType[options.id].name,
                    firstIndex: options.id,
                    secondIndex: 0,
                    secondeType: _this.data.allType[options.id].son,
                    cid: options.tid,
                    fid: options.tid
                  });
                }
              },
              //授权失败
              fail: function (res) {
                wx.showToast({
                  title: '没有授权地址位置，会影响服务质量',
                  icon: 'none',
                  duration: 4000
                })
                _this.setData({
                  street: ""
                })
              }
            });  
          } 
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
    var _this = this;
    //服务器地址
    var url = config.route;
    //数据
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
  //跳转到搜索页面
  toSearch:function(){
    wx.navigateTo({
      url: '../search/search',
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
  }
})