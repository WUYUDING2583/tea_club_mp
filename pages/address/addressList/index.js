// pages/address/addressList/index.js
import {createStoreBindings} from 'mobx-miniprogram-bindings'
import { user } from '../../../mobx/user';
import { shop } from '../../../mobx/shop';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:false,
    pageTitle:"我的收货地址"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const select=options.select=="true"?true:false;
    this.setData({
      select,
      pageTitle: select?"选择收货地址":"我的收货地址"
    })
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo', 'phone','byAddresses'],
      actions: ['setUserInfo', 'setPhoneNumber', 'getUserInfoByPhone'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: shop,
      fields: ['shops', 'byShops', 'shopNameList'],
      actions: ['getShopNameList']
    });
    if (select) {
      this.getShopNameList();
    }
  },
  shopPickerChange(e) {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    prePage.setData({
      deliveryMode: "selfPick",
      shopId: this.data.shops[e.detail.value],
      addressId:null
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  //编辑地址
  editAddress:function(e){
    wx.navigateTo({
      url: `../editAddress/index?addressId=${e.currentTarget.dataset.target}`,
    })
  },
  //选择地址
  selectAddress:function(e){
    const {select}=this.data;
    if(select){
      let pages=getCurrentPages();
      let prePage=pages[pages.length-2];
      prePage.setData({
        deliveryMode: "delivery",
        addressId: e.currentTarget.dataset.target,
        shopId:null
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()
  },

})