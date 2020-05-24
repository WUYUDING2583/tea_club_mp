// pages/box/boxSlot/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { shop } from '../../../mobx/shop';
import { box } from '../../../mobx/box';

var common=require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxId: null,
    shopId: null,
    day: 0,
    slot: new Array(),
    selectedSlot: new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      boxId: options.boxId,
      shopId: options.shopId,
    })
    this.storeBindings = createStoreBindings(this, {
      store: shop,
      fields: ['byShops'],
      actions: [],
    });
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['boxes', 'byBoxes', 'byReservations'],
      actions: ['fetchShopBoxes', 'fetchReservations'],
    });
    this.fetchReservations(options.boxId, common.getNDaysTimeStamp(this.data.day), common.getNDaysTimeStamp(this.data.day + 1));

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let slot = new Array();
    const { day, byShops, shopId, byBoxes, boxId, selectedSlot } = this.data
    const { todayOpenHour } = byShops[shopId];
    const startTime = todayOpenHour.startTime + day * 1000 * 60 * 60 * 24;
    const endTime = todayOpenHour.endTime + day * 1000 * 60 * 60 * 24;
    const duration = byBoxes[boxId].duration * 1000 * 60;
    const slotNum = Math.floor((endTime - startTime) / duration);
    for (let i = 0; i < slotNum; i++) {
      const filterResult = byBoxes[boxId].reservations.filter(reservationTime => {
        if (reservationTime == (startTime + i * duration)) {
          return true;
        }
        return false;
      });
      let isReserved = false;
      if (filterResult.length != 0) {
        isReserved = true;
      }
      let isClickReserve = false;
      if (selectedSlot.indexOf(startTime + i * duration) != -1) {
        isClickReserve = true;
      }
      slot.push({ isReserved, startTime: startTime + i * duration, endTime: startTime + (i + 1) * duration, isClickReserve })
    }
    this.setData({
      slot
    })
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