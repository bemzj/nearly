// pages/myCollect/myCollect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:[
      {
          src:'../../img/list.png',
          type:'美食',
          name:'点都德1',
          number:3200,
          fire:4,
          address:'广州市天河区新港东路中洲中心北塔负1楼',
          nowPay:99,
          prePay:100,
          payName:'世界杯99元超值套餐'
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
    flag: 0,
    text: '',
    shopIndex:-1,
    deleteIndex:-1,
    tipStatus:false,
    popText:''
  },
  //打电话
  callPhone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //删除店铺
  deleteShop:function(e){
    var _this = this;
    
    _this.setData({
      deleteIndex: e.currentTarget.dataset.index,
      shopIndex: -1,
      tipStatus:true,
      popText:'确定删除该收藏？'
    });
  },
  closePop:function(e){
    var _this = this;
    _this.setData({
      deleteIndex: -1,
      shopIndex: -1,
      tipStatus: false,
      popText: ''
    });
  },
  comfirmPop:function(e){
    var _this = this;
    var list = _this.data.shopList;
    list.splice(_this.data.deleteIndex, 1);
    _this.setData({
      shopList:list,
      deleteIndex: -1,
      tipStatus: false,
      popText: ''
    });
    wx.showToast({
      title: '删除成功！',
      icon: 'none',
      mask: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  handletouchmove: function (event) {
    var _this = this;
    if (this.data.flag !== 0) {
      return
    }
    let currentX = event.touches[0].pageX;
    let currentY = event.touches[0].pageY;
    let tx = currentX - this.data.lastX;
    let ty = currentY - this.data.lastY;
    let text = "";
    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0) {
        if (_this.data.shopIndex != event.currentTarget.dataset.index)
        {
          _this.setData({
            shopIndex: event.currentTarget.dataset.index
          });
        }
        
        this.data.flag = 1
      }
      else if (tx > 0) {
        if (_this.data.shopIndex != -1 && _this.data.shopIndex == event.currentTarget.dataset.index)
        {
          _this.setData({
            shopIndex: -1
          });
        }
        this.data.flag = 2
      }

    }
    //上下方向滑动
    else {
      if (ty < 0) {
        this.data.flag = 3

      }
      else if (ty > 0) {
        this.data.flag = 4
      }

    }

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX;
    this.data.lastY = currentY;
    this.setData({
      text: text,
    });
  },

  handletouchstart: function (event) {
    
    this.data.lastX = event.touches[0].pageX;
    this.data.lastY = event.touches[0].pageY;
  },
  handletouchend: function (event) {
    this.data.flag = 0
    this.setData({
      text: "没有滑动",
    });
  },
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