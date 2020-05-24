// pages/box/boxList/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { shop } from '../../../mobx/shop';
import { box } from '../../../mobx/box';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.shopId=26;
    this.setData({
      shopId:options.shopId
    })
    this.storeBindings = createStoreBindings(this, {
      store: shop,
      fields: [ 'byShops'],
      actions: [],
    });
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['boxes','byBoxes'],
      actions: ['fetchShopBoxes'],
    });

    this.fetchShopBoxes(options.shopId)
  },
  selectBox:function(e){
    wx.navigateTo({
      url: `../boxDetail/index?boxId=${e.currentTarget.dataset.target}&shopId=${this.data.shopId}`,
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