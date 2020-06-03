// pages/box/boxSlot/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { shop } from '../../../mobx/shop';
import { box } from '../../../mobx/box';
import { user } from '../../../mobx/user.js';
import { order } from '../../../mobx/order.js';
import { showToast } from "../../../utils/request.js";

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
    selectedSlot:new Array(),
    showModal:false,
    reservations:new Array(),
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
      store: user,
      fields: ['userInfo'],
      actions: [],
    });
    this.storeBindings = createStoreBindings(this, {
      store: order,
      fields: [],
      actions: ['reserve'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['boxes', 'byBoxes', 'byReservations'],
      actions: ['fetchShopBoxes', 'fetchReservations'],
    });
    this.fetchReservations(options.boxId, common.getNDaysTimeStamp(this.data.day), common.getNDaysTimeStamp(this.data.day + 1));

  },
  confirmReserve:function(){
    const { selectedSlot, byBoxes, boxId ,userInfo} = this.data;
    const { price, duration } = byBoxes[boxId];
    const reservations = selectedSlot.map(reservationTime => ({ reservationTime,boxId }));
    let ingot = 0;
    let credit = 0;
    reservations.forEach(reservation => {
      ingot += price.ingot;
      credit += price.credit;
    })
    const order = {
      customer: { uid: userInfo.uid },
      reservations,
    }
    this.reserve(order);
  },
  confirm:function(){
    const {selectedSlot,byBoxes,boxId}=this.data;
    const { price, duration}=byBoxes[boxId];
    const reservations = selectedSlot.map(startTime => ({ startTime, endTime: startTime + duration * 1000 * 60, boxId }));
    let ingot = 0;
    let credit = 0;
    let amountDisplay = "";
    reservations.forEach(reservation => {
      ingot += price.ingot;
      credit += price.credit;
    })
    if (ingot != 0) {
      amountDisplay += `${ingot}元宝 `;
    }
    if (credit != 0) {
      amountDisplay += `${credit}积分`;
    }
    this.setData({
      showModal:true,
      totalAmount: amountDisplay,
      reservations: reservations
    })
  },
  hideModal:function(){
    this.setData({
      showModal:false
    })
  },
  backawrdDay:function(){
    const { boxId,day } = this.data;
    const tomorrow = day + 1;
    this.setData({ day: tomorrow });
    this.fetchReservations(boxId, common.getNDaysTimeStamp(tomorrow), common.getNDaysTimeStamp(tomorrow + 1))
      .then(()=>{
        this.getSlotDisplay()
      })
  },
  forwardDay:function(){
    const { boxId ,day} = this.data;
    const yesterday = day - 1;
    this.setData({ day: yesterday });
    this.fetchReservations(boxId, common.getNDaysTimeStamp(yesterday), common.getNDaysTimeStamp(yesterday + 1))
      .then(() => {
        this.getSlotDisplay()
      })

  },


  _selectSlot:function(e){
    const time = new Date().getTime();
    const { starttime, endtime,target }=e.currentTarget.dataset;
    if (time > endtime) {
      showToast("该时间段无法预约");
      return;
    }
    if(target){
      showToast("该时间段已被预约");
      return;
    }
    let selectedSlot = new Array();
    if (this.data.selectedSlot.indexOf(starttime) == -1) {
      selectedSlot = this.data.selectedSlot.concat([starttime]);
    } else {
      selectedSlot = this.data.selectedSlot.filter(time => time != starttime);
    }
    this.setData({
      selectedSlot
    })
    this.getSlotDisplay();
    
  },
  getSlotDisplay:function(){
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getSlotDisplay();
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
    this.setData({
      selectedSlot:new Array()
    });
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