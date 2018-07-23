// pages/address/address.js
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
    addresses:[
      {
        provice:'广东省',
        city:'广州市',
        area:'天河区',
        street:'车陂街道',
        details:'车陂大街301号'
      },
      {
        provice: '广东省',
        city: '广州市',
        area: '天河区',
        street: '车陂街道',
        details: '车陂大街302号'
      },
      {
        provice: '广东省',
        city: '广州市',
        area: '天河区',
        street: '车陂街道',
        details: '车陂大街303号'
      }
    ],
    addrIndex:-1,
    tipStatus2:false,
    popText2:'',
    delOrEdie:0
  },
  //删除地址
  delect:function(e){
    var _this = this;
    _this.setData({
      delOrEdie:1,
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
  //确定删除
  comfirmPop:function(){
    var _this = this;
    if (_this.data.delOrEdie==1)
    {
      var addr = _this.data.addresses;
      addr.splice(_this.data.addrIndex, 1);
      _this.setData({
        addresses: addr,
        tipStatus2: false,
        popText2: ''
      });
    } else if (_this.data.delOrEdie == 2)
    {
      console.log(1);
      var addr = _this.data.addresses;
      addr[_this.data.addrIndex].provice = _this.data.region[0];
      addr[_this.data.addrIndex].city = _this.data.region[1];
      addr[_this.data.addrIndex].area = _this.data.region[2];
      addr[_this.data.addrIndex].details = _this.data.details;
      _this.setData({
        addresses: addr,
        tipStatus2: false,
        popText2:'',
        popStatus:false
      });
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
    reg.push(regions.provice);
    reg.push(regions.city);
    reg.push(regions.area);
    _this.setData({
      delOrEdie:2,
      popStatus:true,
      region: reg,
      details: regions.details,
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
  comfrimAddress:function(){
    var _this = this;
    if (_this.data.delOrEdie==2)
    {
      _this.setData({
        tipStatus2: true,
        popText2: '确认修改该地址？'
      });
    } else if (_this.data.delOrEdie == 3)
    {
      if (_this.data.details.length==0)
      {
        wx.showToast({
          title: '详细地址不能为空',
          icon: 'none',
          mask: true
        })
      }else{
        console.log(_this.data.region);
        var addr = {};
        var addrBox = _this.data.addresses;
        addr.provice = _this.data.region[0];
        addr.city = _this.data.region[1];
        addr.area = _this.data.region[2];
        addr.details = _this.data.details;
        addr.street = _this.data.street;
        addrBox.push(addr);
        _this.setData({
          addresses: addrBox,
          popStatus:false
        });
        wx.showToast({
          title: '新增地址成功',
          icon: 'none',
          mask: true
        })
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
    qqmapsdk = new QQMapWX({
      key: 'Z3BBZ-C563U-MDPVI-BSXTL-ZB2W5-ZRBHU'
    });


    // 调用接口
    qqmapsdk.geocoder({
      address: '广东省广州市天河区车陂街道车陂大街301号',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    });

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
            addr[0] = res.result.ad_info.province;
            addr[1] = res.result.ad_info.city;
            addr[2] = res.result.ad_info.district;
            _this.setData({
              regionAddress: addr
            })
            console.log(addr);
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