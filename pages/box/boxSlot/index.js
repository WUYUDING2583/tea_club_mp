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
    modalName:"",
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
  confirm: function () {
    const { selectedSlot, byBoxes, boxId, userInfo } = this.data;
    const { price, duration } = byBoxes[boxId];
    if(selectedSlot.length==0){
      showToast("请选择预约时间段");
      return;
    }
    const reservations = selectedSlot.map(reservationTime => ({ reservationTime, box:{uid:boxId} }));
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
    const thiz = this;
    this.reserve(order)
      .then(res => {
        console.log("in then")
        wx.navigateTo({
          url: `../../order/reservePreview/index?orderId=${res.uid}`,
        })
      })
      .catch(err => {
        console.log("in catch")
        if (err.code == 500600) {
          this.setData({
            modalName: "err",
            errorMsg: err.error,
            selectedSlot: new Array()
          });
          this.fetchReservations(boxId, common.getNDaysTimeStamp(this.data.day), common.getNDaysTimeStamp(this.data.day + 1))
            .then(res=>{
              this.getSlotDisplay();
            })
        } else {
          showToast(err.error);
        }
      });
    this.setData({
      modalName: ""
    })
  },
  hideModal:function(){
    this.setData({
      modalName:""
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
  getSlotDisplay: function () {
    this.storeBindings.updateStoreBindings();
    let slot = new Array();
    const { day, byShops, shopId, byBoxes, boxId, selectedSlot } = this.data
    const { todayOpenHour } = byShops[shopId];
    try{
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
    }catch(err){
      console.log(err);
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()
    this.setData({
      selectedSlot:new Array()
    });
  },

})