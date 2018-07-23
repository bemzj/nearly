// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [
      {
        src: '../../img/list.png',
        type: '美食',
        name: '点都德1',
        number: 3200,
        fire: 4,
        address: '广州市天河区新港东路中洲中心北塔负1楼',
        nowPay: 99,
        prePay: 100,
        payName: '世界杯99元超值套餐'
      },
      {
        src: '../../img/list.png',
        type: '美食',
        name: '点都德2',
        number: 3200,
        fire: 4,
        address: '广州市天河区新港东路中洲中心北塔负1楼',
        nowPay: 99,
        prePay: 100,
        payName: '世界杯99元超值套餐'
      },
      {
        src: '../../img/list.png',
        type: '美食',
        name: '点都德2',
        number: 3200,
        fire: 4,
        address: '广州市天河区新港东路中洲中心北塔负1楼',
        nowPay: 99,
        prePay: 100,
        payName: '世界杯99元超值套餐'
      },
      {
        src: '../../img/list.png',
        type: '美食',
        name: '点都德2',
        number: 3200,
        fire: 4,
        address: '广州市天河区新港东路中洲中心北塔负1楼',
        nowPay: 99,
        prePay: 100,
        payName: '世界杯99元超值套餐'
      },
      {
        src: '../../img/list.png',
        type: '美食',
        name: '点都德2',
        number: 3200,
        fire: 4,
        address: '广州市天河区新港东路中洲中心北塔负1楼',
        nowPay: 99,
        prePay: 100,
        payName: '世界杯99元超值套餐'
      }
    ],
    firstType:[
      "全部分类", "美食", "超市", "休闲娱乐", "丽人", "KTV", "运动健身","亲子"
    ],
    secondeType: [
      "全部", "快餐小吃", "面包甜点", "中餐", "茶餐厅", "火锅", "西餐", "日韩料理"
    ],
    kliometer:[1,2,3,4,5,6,7,8],
    firstIndex:0,
    secondIndex:0,
    kiloIndex:0,
    down:false,
    allDown:false,
    kiloDown:false,
    downStatus:0
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
  //打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //第一类点击
  firstClick:function(e){
    var _this = this;
    _this.setData({
      firstIndex: e.currentTarget.dataset.index
    });
  },
  //第二类点击
  secondClick:function(e){
    var _this = this;
    _this.setData({
      secondIndex: e.currentTarget.dataset.index,
      downStatus: 0,
      down: false,
      allDown: false,
      kiloDown: false,
      klioDown: false
    });
  },
  //选择公路
  selectKilo:function(e){
    var _this = this;
    _this.setData({
      kiloIndex: e.currentTarget.dataset.index,
      downStatus: 0,
      down: false,
      allDown: false,
      kiloDown: false,
      klioDown: false
    });
  },
  //全部
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
  //公里选择
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