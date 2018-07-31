// pages/address/address.js
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
    region:[],
    regionAddress:[],
    details:'',
    street:'',
    popStatus:false,
    addresses:[],
    addrIndex:-1,
    tipStatus2:false,
    popText2:'',
    delOrEdie:0,
    lat:0,  //经度
    long:0, //纬度
    addlat:0,
    addlong:0,
    addStreet:'' ,//添加的街道
    addDetails:'',//添加的详细地址
    editId:'',//修改的id
    editData:{}, //编辑数据
    edItIndex:-1,//修改的数据
    delId:-1 //删除地址
  },
  //删除地址
  delect:function(e){
    console.log();
    var _this = this;
    _this.setData({
      delOrEdie:1,
      delId:e.currentTarget.dataset.addid,
      addrIndex: e.target.dataset.index,
      tipStatus2:true,
      popText2:'确认删除该地址？'
    });
  },
  //取消弹窗
  closePop:function(){
    var _this = this;
    _this.setData({
      tipStatus2: false,
      popText2: ''
    });
  },
  //确定删除或者修改
  comfirmPop:function(){
    var _this = this;
    if (_this.data.delOrEdie==1)
    {
      //服务器地址
      var url = config.route;
      //数据
      var mydata = {
        id: _this.data.delId
      }
      console.log(mydata);
      //修改地址
      network.GET(url + api.delAddress, {
        params: mydata,
        success: function (res) {
          console.log(res);
          var msg = res.data.msg;
          if (res.data.status == 1) {
            var addData = {
              uid: app.globalData.code,
            }
            //获取地址
            network.GET(url + api.getAddress, {
              params: addData,
              success: function (res) {
                _this.setData({
                  addresses: res.data.address,
                  tipStatus2: false,
                  popText2: '',
                  popStatus: false
                });
                wx.showToast({
                  title: msg,
                  icon: 'none',
                  mask: true
                })
              }
            });
          } else {
            _this.setData({
              tipStatus2: false,
              popText2: '',
              popStatus: false
            });
            wx.showToast({
              title: msg,
              icon: 'none',
              mask: true
            })
          }

        }
      });
    } else if (_this.data.delOrEdie == 2)
    {
      var mydataAfter = _this.data.editData;
      var mydataBefore = _this.data.addresses[_this.data.edItIndex];
      var addStatus = false;
      //检测地址没有变化
      if (mydataAfter.addinfo != mydataBefore.addinfo){
        addStatus = true;
      } else if (mydataAfter.area != mydataBefore.area) {
        addStatus = true;
      } else if (mydataAfter.city != mydataBefore.city) {
        addStatus = true;
      } else if (mydataAfter.province != mydataBefore.province) {
        addStatus = true;
      } else if (mydataAfter.street != mydataBefore.street) {
        addStatus = true;
      }
      if(addStatus)
      {
        //服务器地址
        var url = config.route;
        //数据
        var mydata = {
          uid: app.globalData.code,
          id: _this.data.editId,
          data:mydataAfter
        }
        //修改地址
        network.GET(url + api.postAddress, {
          params: mydata,
          success: function (res) {
            console.log(res);
            var msg = res.data.msg;
            if(res.data.status==1)
            {
              var addData = {
                uid: app.globalData.code,
              }
              //获取地址
              network.GET(url + api.getAddress, {
                params: addData,
                success: function (res) {
                  _this.setData({
                    addresses: res.data.address,
                    tipStatus2: false,
                    popText2: '',
                    popStatus: false
                  });
                  wx.showToast({
                    title: msg,
                    icon: 'none',
                    mask: true
                  })
                }
              });
            }else{
              _this.setData({
                tipStatus2: false,
                popText2: '',
                popStatus: false
              });
              wx.showToast({
                title: msg,
                icon: 'none',
                mask: true
              })
            }
            
          }
        });
      }else{
        wx.showToast({
          title: '地址没有发生变化',
          icon: 'none',
          mask: true
        })
      }
    }
    
  },
  //改变省市区
  bindRegionChange:function(e){
    var _this = this;
    
    _this.setData({
      region: e.detail.value
    });
  },
  // 编辑
  edit:function(e){
    var _this = this;   
    var regions = _this.data.addresses[e.target.dataset.index];
    var reg = [];
    reg.push(regions.province);
    reg.push(regions.city);
    reg.push(regions.area);
    _this.setData({
      delOrEdie:2,
      editId:e.currentTarget.dataset.addid,
      edItIndex:e.target.dataset.index,
      popStatus:true,
      region: reg,
      street: regions.street,
      details: regions.addinfo,
      addrIndex: e.target.dataset.index
    });
  },
  //取消修改
  cancel:function(){
    var _this = this;
    _this.setData({
      popStatus: false,
      region: [],
      details: '',
      addrIndex:-1
    });
  },
  //确定修改
  comfrimAddress:function(e){
    var _this = this;
    console.log(e);
    if (_this.data.delOrEdie==2)
    {
      if (e.detail.value.street == '') {
        wx.showToast({
          title: '街道不能为空',
          icon: 'none',
          mask: true
        })
      } else if (e.detail.value.addinfo == '')
      {
        wx.showToast({
          title: '详细地址不能为空',
          icon: 'none',
          mask: true
        })
      }else{
        var data = e.detail.value;
        var addr = e.detail.value.province + e.detail.value.city + e.detail.value.area + e.detail.value.street + e.detail.value.addinfo;
        qqmapsdk.geocoder({
          address: addr,
          success: function (res) {
            data.lat = res.result.location.lat;
            data.long = res.result.location.lng;
            _this.setData({
              tipStatus2: true,
              popText2: '确认修改该地址？',
              editData: data
            });
          },
          fail: function (res) {
            wx.showToast({
              title: '网络错误，请退出重试！',
              icon: 'none',
              mask: true
            });
          }
        });
      }
      
    } else if (_this.data.delOrEdie == 3)
    {
      //新增地址
      if (e.detail.value.province == '') {
        wx.showToast({
          title: '省市区不能为空',
          icon: 'none',
          mask: true
        })
      } else if (e.detail.value.city == '') {
        wx.showToast({
          title: '省市区不能为空',
          icon: 'none',
          mask: true
        })
      } else if (e.detail.value.area == '') {
        wx.showToast({
          title: '省市区不能为空',
          icon: 'none',
          mask: true
        })
      } else if (e.detail.value.street== '') {
        wx.showToast({
          title: '街道不能为空',
          icon: 'none',
          mask: true
        })
      } else if (e.detail.value.addinfo == '') {
        wx.showToast({
          title: '详细地址不能为空',
          icon: 'none',
          mask: true
        })
      } else{
        var data = e.detail.value;
        var addr = e.detail.value.province + e.detail.value.city + e.detail.value.area + e.detail.value.street + e.detail.value.addinfo;
        qqmapsdk.geocoder({
          address: addr,
          success: function (res) {
            data.lat = res.result.location.lat;
            data.long = res.result.location.lng;
            
            // data = JSON.parse(data);
            console.log(data);
            //服务器地址
            var url = config.route;
            //数据
            var mydata = {
              uid: app.globalData.code,
              data: data
            }
            //添加地址
            network.GET(url + api.postAddress, {
              params: mydata,
              success: function (res) {
                var msg = res.data.msg;
                if (res.data.status == 1)
                {
                  //数据
                  var data = {
                    uid: app.globalData.code,
                  }
                  network.GET(url + api.getAddress, {
                    params: data,
                    success: function (res) {
                      console.log(res.data.address);
                      _this.setData({
                        addresses: res.data.address,
                        popStatus: false
                      });
                      wx.showToast({
                        title: msg,
                        icon: 'none',
                        mask: true
                      })
                    }
                  });
                }else{
                  wx.showToast({
                    title: msg,
                    icon: 'none',
                    mask: true
                  })
                }
              }
            });
          },
          fail: function (res) {
            wx.showToast({
              title: '网络错误，请退出重试！',
              icon: 'none',
              mask: true
            });
          }
        }); 
      }
    }
  },
  //详细地址
  detailsInput:function(e){
    var _this = this;
    _this.setData({
      details: e.detail.value
    });
  },
  //街道
  streetInput: function (e) {
    var _this = this;
    _this.setData({
      street: e.detail.value
    });
  },
  //添加地址
  add:function(){
    var _this = this;
    _this.setData({
      popStatus: true,
      region: _this.data.regionAddress,
      details: '',
      street:'',
      delOrEdie:3
    });
    //判断是否地址授权
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.userLocation']);
        if (!res.authSetting['scope.userLocation']) {
          wx.openSetting({
            success: (res) => {
              if (!res.authSetting["scope.userLocation"])
              {

              }else{
                //地址
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
                        console.log(res);
                        var addr = [];
                        addr[0] = res.result.address_component.province;
                        addr[1] = res.result.address_component.city;
                        addr[2] = res.result.address_component.district;
                        _this.setData({
                          regionAddress: addr,
                          region: addr,
                          street: res.result.address_component.street,
                          details: res.result.address_component.street_number,
                          lat: res.result.ad_info.location.lat,
                          long: res.result.ad_info.location.lng
                        });
                      },
                      fail: function (res) {

                      }
                    });
                  }
                });
              }
            }
          })
        }else{
          _this.setData({
            region: _this.data.regionAddress,
            details: _this.data.addDetails,
            street: _this.data.addStreet,
            lat: _this.data.addlat,
            long: _this.data.addlong
          });
        }
      }
    })
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
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //服务器地址
    var url = config.route;
    //数据
    var data = {
      uid: app.globalData.code,
    }
    //获取地址
    network.GET(url + api.getAddress, {
      params: data,
      success: function (res) {
        wx.hideLoading();
        _this.setData({
          addresses:res.data.address
        })
      }
    });
    qqmapsdk = new QQMapWX({
      key: 'Z3BBZ-C563U-MDPVI-BSXTL-ZB2W5-ZRBHU'
    });
    //地址
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
            var addr = [];
            addr[0] = res.result.address_component.province;
            addr[1] = res.result.address_component.city;
            addr[2] = res.result.address_component.district;
            _this.setData({
              regionAddress: addr,
              addStreet: res.result.address_component.street,
              addDetails: res.result.address_component.street_number,
              addlat: res.result.ad_info.location.lat,
              addlong: res.result.ad_info.location.lng
            });
          },
          fail: function (res) { 

          }
        });
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
  
  }
})