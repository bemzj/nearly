
//获取应用实例
const app = getApp()
const {
  api,
  config
} = require('../../utils/config.js');
const network = require("../../utils/network.js");
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
    
    if (_this.data.exchangeName.length==0)
    {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        mask: true
      });
    } else if (_this.data.exchangeName == _this.data.person.name) {
        wx.showToast({
          title: '姓名没有变化',
          icon: 'none',
          mask: true
        });
    }else{
      var myPerson = _this.data.person;
      myPerson.name = _this.data.exchangeName;
      var url = config.route;
      var data = {
        uid: app.globalData.code,
        nickname: _this.data.exchangeName
      }
      network.GET(url + api.exchangeName, {
        params: data,
        success: function (res) {
          console.log(res);
          // 拿到解密后的数据，进行代码逻辑
          if (res.data.status == 1) {
            var useIntro = _this.data.useIntro;
            useIntro.nickname = _this.data.exchangeName;
            app.globalData.userInfo = useIntro;
            _this.setData({
              useIntro: useIntro,
              person: myPerson,
              tipStatus2: true,
              popText1: res.data.msg,
              popStatus: false,
              phoneStatus: false,
              nameStatus: false,
              sexStatus: false
            });
          } else {
            _this.setData({
              tipStatus2: true,
              popText1: "修改失败",
              popStatus: false,
              phoneStatus: false,
              nameStatus: false,
              sexStatus: false
            });
          }

        },
        fail: function () {
          //失败后的逻辑  
        },
      })
      
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
      exchangePhone: _this.data.person.phone
    });
  },
  //确定手机
  comfrimPhone:function(){
   var _this = this;
   var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
   console.log(_this.data.exchangePhone);
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
   } else if (_this.data.exchangePhone == _this.data.person.phone){
     wx.showToast({
       title: '手机号码没有变化！',
       icon: 'none',
       mask: true
     });
   }else{
     var myPerson = _this.data.person;
     myPerson.phone = _this.data.exchangePhone;
     var url = config.route;
     var data = {
       uid: app.globalData.code,
       phone: _this.data.exchangePhone
     }
     network.GET(url + api.exchangePhone, {
       params: data,
       success: function (res) {
         //拿到解密后的数据，进行代码逻辑
         if (res.data.status == 1)
         {
           var useIntro = _this.data.useIntro;
           useIntro.phone = _this.data.exchangePhone;
           app.globalData.userInfo = useIntro;
           _this.setData({
             useIntro: useIntro,
             person: myPerson,
             tipStatus2: true,
             popText1: res.data.msg,
             popStatus: false,
             phoneStatus: false,
             nameStatus: false,
             sexStatus: false
           });
         }else{
           _this.setData({
             tipStatus2: true,
             popText1: "修改失败",
             popStatus: false,
             phoneStatus: false,
             nameStatus: false,
             sexStatus: false
           });
         }

       },
       fail: function () {
         //失败后的逻辑  
       },
     })
     
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
   var url = config.route;
   var sexIndex = 0;
   if (myPerson.sex=='女')
   {
     sexIndex = 2;
   }else{
     sexIndex = 1;
   }
   var data = {
     uid: app.globalData.code,
     sex: sexIndex
   }
   var useIntro = _this.data.useIntro;
   if (useIntro.sex == sexIndex)
   {
     wx.showToast({
       title: '性别没有变化',
       icon: 'none',
       mask: true
     });
   }else{
     network.GET(url + api.exchangeSex, {
       params: data,
       success: function (res) {
         if (res.data.status == 1) {

           useIntro.sex = sexIndex;
           app.globalData.userInfo = useIntro;
           _this.setData({
             person: myPerson,
             useIntro: useIntro,
             tipStatus2: true,
             popText1: res.data.msg,
             popStatus: false,
             phoneStatus: false,
             nameStatus: false,
             sexStatus: false
           });
         } else {
           _this.setData({
             tipStatus2: true,
             popText1: "修改失败",
             popStatus: false,
             phoneStatus: false,
             nameStatus: false,
             sexStatus: false
           });
         }
       }
     });
   }
   
   
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
    var intro = app.globalData.userInfo;
    var sex;
    if (intro.sex == 1) {
      sex = "男";
    } else if (intro.sex == 2) {
      sex = "女"
    } else {
      sex = ""
    }
    var person;
    person = {
      head: intro.avatarurl,
      name: intro.nickname,
      phone: intro.phone,
      sex: sex
    }
    _this.setData({
      person: person,
      useIntro: intro
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