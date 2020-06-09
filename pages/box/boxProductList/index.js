// pages/box/boxProductList/index.js
//用于客户扫描包厢二维码跳转此门店的商品列表并选择商品下单页面
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { user } from '../../../mobx/shop';
import { box } from '../../../mobx/box';
import { product } from '../../../mobx/product';

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
    if(!options.boxId){
      wx.navigateBack({
        delta: 1,
      })
    }
    this.setData({
      boxId:options.boxId
    })
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo'],
      actions: [],
    });
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['byBoxes'],
      actions: ['fetchBox'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: product,
      fields: ['products','byProducts'],
      actions: ['fetchProducts'],
    });

    this.fetchProducts();
    // this.fetchBox(options.boxId);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()

  },

})