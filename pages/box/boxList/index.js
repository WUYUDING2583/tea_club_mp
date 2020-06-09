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
      actions: ['getShop'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['boxes','byBoxes'],
      actions: ['fetchShopBoxes'],
    });

    this.fetchShopBoxes(options.shopId);
    this.getShop(options.shopId);
  },
  selectBox:function(e){
    wx.navigateTo({
      url: `../boxDetail/index?boxId=${e.currentTarget.dataset.target}&shopId=${this.data.shopId}`,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()

  },

})