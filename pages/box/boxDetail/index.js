// pages/box/boxDetail/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { shop } from '../../../mobx/shop';
import { box } from '../../../mobx/box';
import { user } from '../../../mobx/user';

var common=require("../../../utils/util.js");
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    boxId:null,
    shopId:null,
    day:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      boxId:options.boxId,
      shopId:options.shopId,
    })
    this.storeBindings = createStoreBindings(this, {
      store: shop,
      fields: ['byShops'],
      actions: [],
    });
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['boxes', 'byBoxes','byReservations'],
      actions: ['fetchShopBoxes','fetchReservations'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['phone'],
      actions: [],
    });
  },
  navigateToReserve:function(){
    const {shopId,boxId,phone}=this.data;
    if(phone.length==0){
      //未登录
      wx.navigateTo({
        url: '../../login/index',
      })
    }else{
      wx.navigateTo({
        url: `../boxSlot/index?boxId=${boxId}&shopId=${shopId}`,
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