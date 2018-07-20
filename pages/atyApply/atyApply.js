// pages/atyApply/atyApply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
  
  },
  submit:function(e){
    console.log(e);
    if (e.detail.value.content=="")
    {
      wx.showToast({
        title: '门店活动主题不能为空！',
        icon: 'none',
        mask: true
      });
    } else if (e.detail.value.title == "")
    {
      wx.showToast({
        title: '门店活动内容不能为空！',
        icon: 'none',
        mask: true
      });
    }else{
      wx.navigateBack({
        delta: 1
      });
    }
  }
})