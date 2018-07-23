// pages/exchangeIntro/exchangeIntro.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person :{
      head:'../../img/head.png',
      name:'Raven',
      phone:'13032232233',
      sex:'女'
    },
    sexBox:['男','女'],
    popStatus:false,
    phoneStatus:false,
    nameStatus:false,
    sexStatus:false,
    tipStatus2:false,//弹窗
    popText1:'',
    exchangeName:'',
    exchangePhone:'',
    exchangeSex:'',
    useIntro:{}
  },
  //取消
  closePop:function(){
    var _this = this;
    _this.setData({
      popStatus: false,
      phoneStatus: false,
      nameStatus: false,
      sexStatus: false
    });
  },
  //显示修改名字弹窗
  nameShow:function(){
    var _this = this;
    _this.setData({
      popStatus: true,
      nameStatus: true,
      exchangeName: _this.data.person.name
    });
  },
  //获取数据
  nameInput:function(e){
    var _this = this;
    _this.setData({
      exchangeName: e.detail.value
    });
  },
  //确定姓名
  comfrimName:function(){ 
    var _this = this;
    var myPerson = _this.data.person;
    myPerson.name = _this.data.exchangeName;
    if (_this.data.exchangeName.length==0)
    {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        mask: true
      });
    }else{
      _this.setData({
        person: myPerson,
        tipStatus2: true,
        popText1: '修改姓名成功！',
        popStatus: false,
        phoneStatus: false,
        nameStatus: false,
        sexStatus: false
      });
    }
    
  },
  //获取数据
  phoneInput: function (e) {
    var _this = this;
    _this.setData({
      exchangePhone: e.detail.value
    });
  },
  //显示修改手机弹窗
  phoneShow: function () {
    var _this = this;
    _this.setData({
      popStatus: true,
      phoneStatus: true,
      exchangePhone: _this.data.person.name
    });
  },
  //确定手机
  comfrimPhone:function(){
   var _this = this;
   var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
   if(_this.data.exchangePhone.length==0)
   {
     wx.showToast({
       title: '手机号码不能为空！',
       icon: 'none',
       mask: true
     });
   } else if (!myreg.test(_this.data.exchangePhone))
   {
     wx.showToast({
       title: '手机格式不正确！',
       icon: 'none',
       mask: true
     });
   }else{
     var myPerson = _this.data.person;
     myPerson.phone = _this.data.exchangePhone;
     _this.setData({
       person: myPerson,
       tipStatus2:true,
       popText1:'修改手机成功！',
       popStatus: false,
       phoneStatus: false,
       nameStatus: false,
       sexStatus: false
     });
   }
   
   
 },
 //关闭弹窗
 comfirmPop:function(){
   var _this =this;
   _this.setData({
     tipStatus2: false,
     popText1: ''
    });
 },
 //显示性别修改
 sexShow:function(){
   var _this = this;
   _this.setData({
     popStatus: true,
     sexStatus: true,
     exchangeSex: _this.data.person.sex
   });
 },
 //选择性别
 selectSex:function(e){
   var _this = this;
   _this.setData({
     exchangeSex: e.currentTarget.dataset.sex
   });
 },
  //性别提交
 comfrimSex:function(){
   var _this = this;
   var myPerson = _this.data.person;
   myPerson.sex = _this.data.exchangeSex;
   _this.setData({
     person: myPerson,
     tipStatus2: true,
     popText1: '修改性别成功！',
     popStatus: false,
     phoneStatus: false,
     nameStatus: false,
     sexStatus: false
   });
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
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var sex; 
        if (res.data.gender==1)
        {
          sex = "男";
        } else if (res.data.gender == 2){
          sex = "女"
        }else{
          sex = ""
        }
        var person;
        person = {
          head: res.data.avatarUrl,
          name: res.data.nickName,
          phone:'',
          sex:sex
        }
        _this.setData({
          person: person
        });
        console.log(_this.data.useIntro);
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