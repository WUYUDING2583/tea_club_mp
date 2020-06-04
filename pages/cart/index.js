// pages/cart/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { user } from "../../mobx/user.js";
import { cart } from "../../mobx/cart.js";

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
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['phone','userInfo'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: cart,
      fields: ['cartProducts', 'byCartProducts','cartTotal'],
      actions: ['fetchCart']
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.fetchCart(17);
    // if(this.data.phone.length==0){
    //   //未登录，跳转至登录页面
    //   wx.redirectTo({
    //     url: '../login/index',
    //   })
    // } else {
    //   this.fetchCart(this.data.userInfo.uid);
    // }
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
    this.storeBindings.destroyStoreBindings();

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