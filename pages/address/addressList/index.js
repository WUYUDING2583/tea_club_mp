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
      pageTitle:"选择收货地址"
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

    this.getShopNameList();
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
  //选择地址
  selectAddress:function(e){
    const {select}=this.data;
    console.log(typeof select)
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