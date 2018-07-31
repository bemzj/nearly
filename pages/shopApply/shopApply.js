// pages/shopApply/shopApply.js
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
    intro:{
      name:"",
      phone:"",
      code:"",
      idcard:"",
      url:""
    },
    uid:'',
    disabled:true,
    timeCount: "获取验证码"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      uid: app.globalData.code
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  formSubmit:function(e){
    console.log(e.detail.value);
    var _this  = this;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
    if (e.detail.value.name=="")
    {
      wx.showToast({
        title: '姓名不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (e.detail.value.phone == "") {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (!myreg.test(e.detail.value.phone)){
      wx.showToast({
        title: '手机格式不正确！',
        icon: 'none',
        mask: true
      })
    } else if (e.detail.value.code == "") {
      wx.showToast({
        title: '验证码不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (e.detail.value.idcard == "") {
      wx.showToast({
        title: '法人身份证不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (!reg.test(e.detail.value.idcard)) {
      wx.showToast({
        title: '法人身份证格式不正确！',
        icon: 'none',
        mask: true
      })
    } else if (_this.data.intro.url=="") {
      wx.showToast({
        title: '请上传营业执照',
        icon: 'none',
        mask: true
      })
    }else{
      //服务器地址
      var url = config.route;
      //注册商家
      wx.showLoading({
        title: '资料提交中',
      })
      network.GET(url + api.applyShop, {
        params: e.detail.value,
        success: function (res) {
          if (res.data.status==1)
          {
            wx.hideLoading();
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              mask: true,
              duration: 2000
            })
            setTimeout(function(){
              wx.navigateBack({});
            },2500);
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true,
              duration:2000
            })
          }
          
        }
      });
    }
  },
  //监听输入框输入
  phoneInput:function(e){
    var _this = this;
    var intro = _this.data.intro;
    intro.phone = e.detail.value;
    _this.setData({
      intro: intro
    });
  },
  getCode:function(e){
    
    var _this = this;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (_this.data.disabled == true)
    {
      if (_this.data.intro.phone == "") {
        wx.showToast({
          title: '手机号码不能为空！',
          icon: 'none',
          mask: true
        })
      } else if (!myreg.test(_this.data.intro.phone)) {
        wx.showToast({
          title: '手机格式不正确！',
          icon: 'none',
          mask: true
        })
      } else{
        var url = config.route;
        var data = {
          phone: _this.data.intro.phone
        }
        //请求获取验证码
        network.GET(url + api.getCode, {
          params: data,
          success: function (res) {
            console.log();
            if (res.data.status==1)
            {
              var timeCount = 60;
              _this.setData({
                timeCount: '60s秒后重发',
                disabled: false
              })
              var time = setInterval(function () {
                timeCount--;
                if (timeCount == -1) {
                  clearInterval(time);
                  _this.setData({
                    timeCount: '重新获取',
                    disabled: true
                  })
                } else {
                  _this.setData({
                    timeCount: timeCount + 's秒后重发',
                  })
                }
              }, 1000);
            }
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true
            });
          }
        });
        
      }
    }
  },
  //选择图片
  selectImg:function(){
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(res);
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
            var data = JSON.parse(res.data)
            console.log(data);
            if (data.status==1)
            {
              intro.url = data.msg;
              _this.setData({
                intro: intro
              });
            }else{
              wx.showToast({
                title: '上传图片失败',
                icon: 'none',
                mask: true
              })
            }
           
            //do something
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  cancel:function(){
    wx.navigateBack({});
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