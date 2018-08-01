
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
    loginType:-1,
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
    popText1: '',//弹窗文本,
    browse:0,
    logo:""
  },
  //获取验证码
  getCode() {
    var _this = this;
    //手机格式
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    //手机规则验证
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
      //60s后获取
      var timeCount = 60;
      _this.setData({
        disabled: false,
        timeCount: '60s后重新获取'
      });
      var url = config.route;
      var data = {
        phone: _this.data.phone
      }
      //请求获取验证码
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
    //表单获取
    var data = e.detail.value;
    //手机格式
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    //验证
    if (data.phone == '') {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (!myreg.test(data.phone)) {
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
        phone: data.phone,
        nickname:data.name,
        uid: app.globalData.code
      }
      console.log(mydata);
      network.GET(url + api.register, {
        params: mydata,
        success: function (res) {
          console.log(res);
          if(res.data.status==1)
          {
            //数据
            var newdata = {
              uid: app.globalData.code,
            }
            //获取用户信息
            network.GET(url + api.getUserStatus, {
              params: newdata,
              success: function (resource) {
                app.globalData.userInfo = resource.data.data;
                _this.setData({
                  useIntro: app.globalData.userInfo,
                  loginType:1
                })
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  mask: true
                });
              },
              fail:function(){
                wx.showToast({
                  title: "网络错误",
                  icon: 'none',
                  mask: true
                });
              }
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
    _this.setData({
      logo: app.globalData.logo
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
    //如果还没注册
    // if (!app.globalData.userInfo.create_time)
    // {
    //   _this.setData({
    //     loginType:0
    //   });
    // }else{
      if(app.globalData.userInfo.type==0)
      {
        _this.setData({
          loginType: 1,
        });
      }else{
        //获取门店浏览量
        network.GET(url + api.getBrowser, {
          params: data,
          success: function (res) {
            if (!res.data.user.browse)
            {
              _this.setData({
                browse:0
              })
            }else{
              _this.setData({
                browse: res.data.user.browse
              })
            }
          }
        });
        _this.setData({
          loginType: 2
        });
      }
    // }
    _this.setData({
      useIntro: app.globalData.userInfo
    });
    console.log(app.globalData.userInfo);
    
    
    //我的消息
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
        console.log(res);
        if (res.data.status==1)
        {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          });
        } else if (res.data.status == 2){
          app.globalData.userInfo = res.data.user;
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          });
          setTimeout(function(){
            _this.setData({
              useIntro: res.data.user,
              loginType: 2
            });
          },2000);
        } else if (res.data.status == 3){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          });
          setTimeout(function(){
            wx.navigateTo({
              url: '../shopApply/shopApply',
            })
          },2000);
          
        }else{
          wx.navigateTo({
            url: '../shopApply/shopApply',
          })
        }
      }
    });
  }
})