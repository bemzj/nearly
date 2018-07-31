// pages/myDoor/myDoor.js
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
    typeOne:[],
    toIndex:0,
    typeTwo: [],
    ttIndex: 0,
    region: ['', '', ''],
    currentRegion:[],
    intro:{
      uid:"",
      name:"",
      pic:"",
      cid:"",
      province:"",
      city:"",
      area:"",
      phone:"",
      addinfo:"",
    },
    hasShop:-1,
    firstType:[],
    secondType:[],
    secondId:[],
    timeCount: '获取验证码',
    disabled:true
  },
  //名字输入
  nameInput:function(e){
    var _this = this;
    var intro = _this.data.intro;
    intro.name = e.detail.value;
    _this.setData({
      intro: intro
    })
  },
  //手机输入
  phoneInput: function (e) {
    var _this = this;
    var intro = _this.data.intro;
    intro.phone = e.detail.value;
    _this.setData({
      intro: intro
    })
  },
  //详细地址输入
  detailsInput: function (e) {
    var _this = this;
    var intro = _this.data.intro;
    intro.addinfo = e.detail.value;
    _this.setData({
      intro: intro
    })
  },
  //店铺类型第一类选择
  changeOne:function(e){
    var _this = this;
    var intro = _this.data.intro;
    intro.cid = _this.data.secondId[e.detail.value][0];
    _this.setData({
      toIndex:e.detail.value,
      typeTwo: _this.data.secondType[e.detail.value],
      intro: intro
    })
  },
   //店铺类型第二类选择
  changeTwo: function (e) {
    var _this = this;
    var intro = _this.data.intro;
    intro.cid = _this.data.secondId[_this.data.toIndex][e.detail.value];
    _this.setData({
      ttIndex: e.detail.value,
      intro: intro
    })
  },
  //省市区切换
  bindRegionChange: function (e) {
    var _this = this;
    var intro = _this.data.intro;
    intro.province = e.detail.value[0];
    intro.city = e.detail.value[1],
    intro.area = e.detail.value[2]
    _this.setData({
      region: e.detail.value,
      intro: intro
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var intro = _this.data.intro;
    intro.uid = app.globalData.code;
    _this.setData({
      intro: intro
    });
    // 实例化API核心类
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
    //服务器
    var url = config.route;
    //数据
    var data = {
      uid: app.globalData.code,
    }
    wx.showLoading({
      title: '加载中',
    })
    //判断是否有门店
    network.GET(url + api.getShopMsg, {
      params: data,
      success: function (res) {
        var myRes = res;
        //获取分类
        network.GET(url + api.getTypes, {
          params: data,
          success: function (res) {
            wx.hideLoading();
            //处理分类
            var all = res.data.cates;
            var firstType = [];
            var secondType = [];
            var secondId = [];
            for (var i = 0; i < all.length; i++) {
              firstType.push(all[i].name);
              var arr = [];
              var arrId = [];
              for (var j = 0; j < all[i].son.length; j++) {
                arr.push(all[i].son[j].name);
                arrId.push(all[i].son[j].id);
              }
              secondType.push(arr);
              secondId.push(arrId);
            }
            console.log(secondType);
            console.log(secondId);
            if (myRes.data.status == 0) { 
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
                      var obj = _this.data.region;
                      obj[0] = res.result.address_component.province;
                      obj[1] = res.result.address_component.city;
                      obj[2] = res.result.address_component.district;
                      var intro = _this.data.intro;
                      intro.province = obj[0];
                      intro.city = obj[1];
                      intro.area = obj[2];
                      _this.setData({
                        region: obj,
                        currentRegion: obj,
                        intro: intro
                      })
                    },
                    fail: function (res) { }
                  });
                }
              });
              var intro = _this.data.intro;
              intro.cid = secondId[0][0];
              _this.setData({
                intro: intro,
                typeOne: firstType,
                firstType: firstType,
                secondType: secondType,
                secondId: secondId,
                typeTwo: secondType[0],
                hasShop: 0
              });
            } else {
              var intro = myRes.data.shop;
              var x = -1;
              var y = -1;
              var xys = true;
              for (var i = 0; i < secondId.length;i++)
              {
                if (xys)
                {
                  for (var j = 0; j < secondId[i].length; j++) {
                    if (intro.cid == secondId[i][j]) {
                      x = i;
                      y = j;
                      break;
                    }
                  }
                }else{
                  break;
                }        
              }
              var region = [];
              region.push(intro.province);
              region.push(intro.city);
              region.push(intro.area);
              _this.setData({
                intro: myRes.data.shop,
                hasShop: 1,
                region: region,
                typeOne: firstType,
                toIndex:x,
                ttIndex:y,
                firstType: firstType,
                secondType: secondType,
                secondId: secondId,
                typeTwo: secondType[x]
              });
            }
          },
          fail:function(){
            wx.hideLoading();
            wx.showToast({
              title: '网络错误，获取分类失败！',
              icon: 'none',
              mask: true,
              duration: 2000
            });
            setTimeout(function(){
              wx.navigateBack({
                
              })
            },2000);
          }
        });
        
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，获取分类失败！',
          icon: 'none',
          mask: true,
          duration: 2000
        });
        setTimeout(function () {
          wx.navigateBack({

          })
        }, 2000);
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
  //获取验证码
  getCode() {
    var _this = this;
    //手机格式
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    //手机规则验证
    if (_this.data.intro.phone == '') {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (!myreg.test(_this.data.intro.phone)) {
      wx.showToast({
        title: '手机格式错误！',
        icon: 'none',
        mask: true
      })
    } else {
      //60s后获取
      var timeCount = 60;
      _this.setData({
        disabled: false,
        timeCount: '60s后重新获取'
      });
      var url = config.route;
      var data = {
        phone: _this.data.intro.phone
      }
      //请求获取验证码
      network.GET(url + api.getCode, {
        params: data,
        success: function (res) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          });
        }
      });

      var time = setInterval(function () {
        timeCount--;
        _this.setData({
          disabled: false,
          timeCount: timeCount + 's后重新获取'
        });
        if (timeCount == 0) {
          clearInterval(time);
          _this.setData({
            disabled: true,
            timeCount: '重新获取'
          });
        }
      }, 1000);
    }
  },
  //选择图片
  selectImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: function (res){
            if (res.width / res.height==25/21)
            {
              var intro = _this.data.intro;
              var url = config.route;
              //数据
              var data = {
                uid: app.globalData.code,
              }
              wx.uploadFile({
                url: url + api.uploadPic, //仅为示例，非真实的接口地址
                filePath: tempFilePaths[0],
                name: 'pic',
                formData: {},
                success: function (res) {
                  var data = JSON.parse(res.data);
                  if (data.status == 1) {
                    intro.pic = data.msg;
                    _this.setData({
                      intro: intro
                    });
                  } else {
                    wx.showToast({
                      title: '上传图片失败',
                      icon: 'none',
                      mask: true
                    })
                  }
                  //do something
                }
              })
            }else{
              wx.showToast({
                title: '上传正确的图片尺寸',
                icon: 'none',
                mask: true
              })
            }
          },
          fail:function(){
            wx.showToast({
              title: '上传正确的图片尺寸',
              icon: 'none',
              mask: true
            })
          }
        });
        
      }
    })
  },
  //取消
  cansel:function(){
    wx.navigateBack({});
  },
  //编辑
  edit:function(){
    var _this = this;
    var data = _this.data.intro;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    
    if (data.name == "") {
      wx.showToast({
        title: '姓名不能为空！',
        icon: 'none',
        mask: true
      });
    } else if (data.phone == "") {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (!myreg.test(data.phone)) {
      wx.showToast({
        title: '手机格式不正确！',
        icon: 'none',
        mask: true
      })
    } else if (data.province == "") {
      wx.showToast({
        title: '省市区不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (data.addinfo == "") {
      wx.showToast({
        title: '详细地址不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (data.pic == "") {
      wx.showToast({
        title: '店面图片不能为空！',
        icon: 'none',
        mask: true
      })
    } else {
      //服务器地址
      let mydata = data;
      mydata.cid = _this.data.secondId[_this.data.toIndex][_this.data.ttIndex];
      var addresses = mydata.province+mydata.city + mydata.area + mydata.addinfo;
      qqmapsdk.geocoder({
        address: addresses,
        success: function (res) {
          mydata.lat = res.result.location.lat;
          mydata.long = res.result.location.lng;
          var url = config.route;
          network.GET(url + api.setShopMsg, {
            params: mydata,
            success: function (res) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask: true
              });
            }
          });
        },
        fail: function (res) {
          wx.showToast({
            title: '地址解析错误！',
            icon: 'none',
            mask: true
          })
        }
      });
      
    }
  },
  //提交
  submitForm:function(e){
    var _this = this;
    var data = _this.data.intro;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (data.name=="")
    {
      wx.showToast({
        title: '姓名不能为空！',
        icon: 'none',
        mask: true
      });
    } else if (data.phone==""){
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (!myreg.test(data.phone)) {
      wx.showToast({
        title: '手机格式不正确！',
        icon: 'none',
        mask: true
      })
    } else if (data.province == ""){
      wx.showToast({
        title: '省市区不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (data.addinfo == "") {
      wx.showToast({
        title: '详细地址不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (data.pic == "") {
      wx.showToast({
        title: '店面图片不能为空！',
        icon: 'none',
        mask: true
      })
    }else{
      //服务器地址
      var url = config.route;
      let mydata = data;
      mydata.cid = _this.data.secondId[_this.data.toIndex][_this.data.ttIndex];
      var addresses = mydata.province + mydata.city + mydata.area + mydata.addinfo;
      qqmapsdk.geocoder({
        address: addresses,
        success: function (res) {
          mydata.lat = res.result.location.lat;
          mydata.long = res.result.location.lng;
          var url = config.route;
          network.GET(url + api.setShopMsg, {
            params: mydata,
            success: function (res) {
              setTimeout(function(){
                if (res.data.status == 1) {
                  wx.navigateBack({});
                }
              },1500);
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask: true
              });
            }
          });
        },
        fail: function (res) {
          wx.showToast({
            title: '地址解析错误！',
            icon: 'none',
            mask: true
          })
        }
      });
    }
  },
  returnBack:function(){
    wx.navigateBack({})
  }
})