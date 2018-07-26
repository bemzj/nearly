
// pages/personal/personal.js
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
    loginType:1,
    useIntro:{},
    newLength: 0,
    title: '近享多', //标题
    disabled: true, //是否禁用
    timeCount: '立即获取',
    phone: '',//输入的手机号码
    name: '',//输入的姓名
    code: '',//输入的验证码
    elseCode: '123456',//收到的验证码
    tipStatus1: false,//弹窗状态1
    tipStatus2: false,//弹窗状态2
    popText1: ''//弹窗文本
  },
  getCode() {
    var _this = this;

    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (_this.data.phone == '') {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (!myreg.test(_this.data.phone)) {
      wx.showToast({
        title: '手机格式错误！',
        icon: 'none',
        mask: true
      })
    } else {
      var timeCount = 60;
      _this.setData({
        disabled: false,
        timeCount: '60s后重新获取'
      });
      var url = config.route;
      var data = {
        phone: _this.data.phone
      }
      network.GET(url + api.getCode, {
        params: data,
        success: function (res) {
          console.log(res);
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
            timeCount:'重新获取'
          });
        }
      }, 1000);
    }


  },
  getPhone: function (event) {
    var _this = this;
    _this.setData({
      'phone': event.detail.value
    });
  },
  register: function (e) {
    var _this = this;
    var data = e.detail.value;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var _this = this;

    if (data.phone == '') {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (!myreg.test(_this.data.phone)) {
      wx.showToast({
        title: '手机格式错误！',
        icon: 'none',
        mask: true
      })
    } else if (data.code == '') {
      wx.showToast({
        title: '验证码不能为空！',
        icon: 'none',
        mask: true
      })
    }else if (data.name == '') {
      wx.showToast({
        title: '姓名不能为空！',
        icon: 'none',
        mask: true
      })
    } else {
      var url = config.route;
      var mydata = {
        code: data.code,
        phone: _this.data.phone,
        nickname:data.name,
        uid: app.globalData.code
      }
      network.GET(url + api.register, {
        params: mydata,
        success: function (res) {
          console.log(res);
          if(res.data.status==1)
          {
            wx.getStorage({
              key: 'userInfo',
              success: function (res) {
                var useIntro = res.data;
                res.data.phone = _this.data.phone;
                res.data.nickname=data.name;
                _this.setData({
                  useIntro: useIntro,
                  loginType: 1
                })
                wx.setStorage({
                  key: 'userInfo',
                  data: useIntro,
                })
              }
            });
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true
            });
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true
            });
          }
          
        }
      });
      // _this.setData({
      //   'tipStatus1': !_this.data.tipStatus1,
      //   'popText1': ''
      // });
    }
  },
  //关闭弹窗
  closeTip: function () {
    var _this = this;
    _this.setData({
      'tipStatus1': !_this.data.tipStatus1
    })
  },
  comfirmPop: function () {
    var _this = this;
    _this.setData({
      'tipStatus2': !_this.data.tipStatus2
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var url = config.route;
    var data = {
      uid: app.globalData.code,
    }
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (!res.data) {
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
                if (!res.data.data.create_time)
                {
                  _this.setData({
                    useIntro: res.data.data,
                    loginType:0
                  });
                }else{
                  _this.setData({
                    useIntro: res.data.data
                  });
                }
                
              }
            },
            fail: function () {
              //失败后的逻辑  
            },
          })
        } else {
          if (!res.data.create_time) {
            _this.setData({
              useIntro: res.data,
              loginType: 0
            });
          } else {
            _this.setData({
              useIntro: res.data
            });
          }
        }
      },
      fail: function () {
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
              if (!res.data.create_time) {
                _this.setData({
                  useIntro: res.data,
                  loginType: 0
                });
              } else {
                _this.setData({
                  useIntro: res.data
                });
              }
            }
            //拿到解密后的数据，进行代码逻辑
          },
          fail: function () {
            //失败后的逻辑  
          },
        })
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
  //申请成为商家
  applyToShop:function(){
    var _this = this;
    var url = config.route;
    var data = {
      uid: app.globalData.code,
    }
    network.GET(url + api.hasApply, {
      params: data,
      success: function (res) {
        if (res.data.status==1)
        {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          });
        }else{
          wx.navigateTo({
            url: '../shopApply/shopApply',
          })
        }
      }
    });
  }
})