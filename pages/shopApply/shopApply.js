// pages/shopApply/shopApply.js
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
    disabled:true,
    timeCount: "获取验证码"
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
  formSubmit:function(e){
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
    }
  },
  getCode:function(e){
    console.log(e);
    var _this = this;
    if (_this.data.disabled == true)
    {
      var timeCount = 60;
      _this.setData({
        timeCount:'60s秒后重发',
        disabled:false
      })
      var time = setInterval(function(){
        timeCount--;
        if (timeCount==-1)
        {
          clearInterval(time);
          _this.setData({
            timeCount: '重新获取',
            disabled: true
          })
        }else{
          _this.setData({
            timeCount: timeCount + 's秒后重发',
          })
        }
      },1000);
    }
  },
  selectImg:function(){
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0]);
        var intro = _this.data.intro;
        intro.url = tempFilePaths[0];
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  cancel:function(){
    wx.navigateBack({
      
    })
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