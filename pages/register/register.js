// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      title:'近享多', //标题
      disabled: true, //是否禁用
      timeCount:'立即获取',
      phone:'',//输入的手机号码
      name:'',//输入的姓名
      code:'',//输入的验证码
      elseCode:'123456',//收到的验证码
      tipStatus1:false,//弹窗状态1
      tipStatus2: false,//弹窗状态2
      popText1:''//弹窗文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  getCode(){
    var _this = this;
    
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (_this.data.phone=='')
    {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        mask:true
      })
    }else if (!myreg.test(_this.data.phone)) {
      wx.showToast({
        title: '手机格式错误！',
        icon:'none',
        mask: true
      })
    } else {
      var timeCount = 60;
      _this.setData({
        disabled: false,
        timeCount: '60s后重新获取'
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
            timeCount: timeCount + '重新获取'
          });
        }
      }, 1000);
    }

   
  },
  getPhone: function (event){
    var _this = this;
    _this.setData({
      'phone': event.detail.value
    });
  },
  register :function (e) {
    var _this = this;  
    var data = e.detail.value;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var _this = this;
    _this.setData({
      'tipStatus1': !_this.data.tipStatus1,
      'popText1': ''
    });
    if (data.phone == '')
    {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        mask: true
      })
    } else if (!myreg.test(_this.data.phone)){
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
    } else if (data.code != _this.data.elseCode) {
      wx.showToast({
        title: '验证码不正确！',
        icon: 'none',
        mask: true
      })
    } else if (data.name == '') {
      wx.showToast({
        title: '姓名不能为空！',
        icon: 'none',
        mask: true
      })
    } else{
      wx.navigateBack({
        delta:1
      })
    }
  },
  //关闭弹窗
  closeTip:function(){
    var _this =this;
    _this.setData({
      'tipStatus1': !_this.data.tipStatus1
    })
  },
  comfirmPop:function(){
    var _this = this;
    _this.setData({
      'tipStatus2': !_this.data.tipStatus2
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
  
  }
})