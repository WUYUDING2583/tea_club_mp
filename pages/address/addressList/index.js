// pages/address/addressList/index.js
import {createStoreBindings} from 'mobx-miniprogram-bindings'
import {user} from '../../../mobx/user';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const select=options.select=="true"?true:false;
    this.setData({
      select
    })
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo', 'phone','byAddresses'],
      actions: ['setUserInfo', 'setPhoneNumber', 'getUserInfoByPhone'],
    }); 
  },
  //选择地址
  selectAddress:function(e){
    const {select}=this.data;
    console.log(typeof select)
    if(select){
      let pages=getCurrentPages();
      let prePage=pages[pages.length-2];
      prePage.setData({
        addressId: e.currentTarget.dataset.target
      })
      wx.navigateBack({
        delta: 1,
      })
    }
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
    this.storeBindings.destroyStoreBindings()
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