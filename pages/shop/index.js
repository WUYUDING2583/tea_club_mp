// pages/shop/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { shop } from '../../mobx/shop';
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
      store: shop,
      fields: ['shops', 'byShops'],
      actions: ['getShopList'],
    });
    this.getShopList();

  },
  selectShop:function(e){
    wx.navigateTo({
      url: `../box/boxList/index?shopId=${e.currentTarget.dataset.target}`,
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()

  },
})