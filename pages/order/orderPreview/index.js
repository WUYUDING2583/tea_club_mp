// pages/order/orderPreview/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { product } from "../../../mobx/product.js";
import { user } from "../../../mobx/user.js";
import { shop } from "../../../mobx/shop.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ps:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   productId: options.productId,
    //   number:options.number,
    //   deliveryMode:options.deliveryMode,
    //   shopId:options.shopId
    // }); 
    this.setData({
      productId: 1,
      number: 1,
      deliveryMode: 'selfPcik',
      shopId: 26
    });
    this.storeBindings = createStoreBindings(this, {
      store: product,
      fields: ['byProductPhotos','byProducts'],
      actions: ['fetchProduct'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: shop,
      fields: ['byShops'],
    });
  },
  psInput:function(e){
    this.setData({
      ps: e.detail.value
    })
  },

  //数量改变事件
  numberChange:function(e){
    const { detail } = e;
    const { number } = detail;
    this.setData({
      number
    })
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