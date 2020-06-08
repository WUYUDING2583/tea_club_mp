import { configure, observable, action } from 'mobx-miniprogram';
import { get, post,showToast } from "../utils/request.js";
import { url } from "../utils/url.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const order = observable({

  // 数据字段
  orders: new Array(),
  byOrders: new Object(),
  ordersAll:new Array(),
  byOrdersAll: new Object(),
  ordersUnpay: new Array(),
  byOrdersUnpay: new Object(),
  ordersPayed: new Array(),
  byOrdersPayed: new Object(),
  ordersShipped: new Array(),
  byOrdersShipped: new Object(),
  ordersRefund:new Array(),
  byOrdersRefund:new Object(),
  reservationsUnpay:new Array(),
  byReservationsUnpay:new Object(),
  reservationsPayed:new Array(),
  byReservationsPayed:new Object(),
  reservationsComplete:new Array(),
  byReservationsComplete:new Object(),
  reservationsRefund:new Array(),
  byReservationsRefund:new Object(),
  

  // 计算属性
  get sum() {
    return this.numA + this.numB
  },

  // actions
  fetchRefundReservations: action(function (page, userId) {
    return new Promise((resolve, reject) => {
      get(url.fetchRefundReservations(page, userId))
        .then(res => {
          this.convertStatusReservationsToPlainStructure(res, 'refund');
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  }),
  fetchCompleteReservations: action(function (page, userId) {
    return new Promise((resolve, reject) => {
      get(url.fetchCompleteReservations(page, userId))
        .then(res => {
          this.convertStatusReservationsToPlainStructure(res, 'complete');
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  }),
  fetchPayedReservations: action(function (page, userId) {
    return new Promise((resolve, reject) => {
      get(url.fetchPayedReservations(page, userId))
        .then(res => {
          this.convertStatusReservationsToPlainStructure(res, 'payed');
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  }),
  fetchUnpayReservations:action(function(page,userId){
    return new Promise((resolve, reject) => {
      get(url.fetchUnpayReservations(page, userId))
        .then(res => {
          this.convertStatusReservationsToPlainStructure(res, 'unpay');
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  }),
  resetReservations:action(function(){
    this.reservationsUnpay= new Array();
    this.byReservationsUnpay= new Object();
    this.reservationsPayed=new Array();
    this.byReservationsPayed=new Object();
    this.reservationsComplete=new Array();
    this.byReservationsComplete=new Object();
    this.reservationsRefund=new Array();
    this.byReservationsRefund=new Object();
  }),
  convertStatusReservationsToPlainStructure: action(function (data, status) {
    let reservations = new Array();
    let byReservations = new Object();
    data.forEach(reservation => {
      reservations.push(reservation.uid);
      reservation.reservations.forEach((item) => {
        reservation.photo = `data:image/jpeg;base64,${item.box.photos[0].photo}`;
      })
      if (!byReservations[reservation.uid]) {
        byReservations[reservation.uid] = reservation;
      }
    });
    const thiz = this;
    switch (status) {
      case 'unpay':
        reservations = reservations.filter(uid => {
          let noRepeat = true;
          thiz.reservationsUnpay.forEach(item => {
            if (uid == item) {
              noRepeat = false;
            }
          })
          return noRepeat;
        })
        this.reservationsUnpay = this.reservationsUnpay.concat(reservations);
        this.byReservationsUnpay = { ...this.byReservationsUnpay, ...byReservations };
        break;
      case 'complete':
        reservations = reservations.filter(uid => {
          let noRepeat = true;
          thiz.reservationsComplete.forEach(item => {
            if (uid == item) {
              noRepeat = false;
            }
          })
          return noRepeat;
        })
        this.reservationsComplete = this.reservationsComplete.concat(reservations);
        this.byReservationsComplete = { ...this.byReservationsComplete, ...byReservations };
        break;
      case 'payed':
        reservations = reservations.filter(uid => {
          let noRepeat = true;
          thiz.reservationsPayed.forEach(item => {
            if (uid == item) {
              noRepeat = false;
            }
          })
          return noRepeat;
        })
        this.reservationsPayed = this.reservationsPayed.concat(reservations);
        this.byReservationsPayed = { ...this.byReservationsPayed, ...byReservations };
        break;
      case 'refund':
        reservations = reservations.filter(uid => {
          let noRepeat = true;
          thiz.reservationsRefund.forEach(item => {
            if (uid == item) {
              noRepeat = false;
            }
          })
          return noRepeat;
        })
        this.reservationsRefund = this.reservationsRefund.concat(reservations);
        this.byReservationsRefund = { ...this.reservationsRefund, ...byReservations };
        break;
    }
  }),
  fetchUnpay: action(function (page, userId) {
    return new Promise((resolve, reject) => {
      get(url.fetchUnpay(page, userId))
        .then(res => {
          this.convertStatusOrdersToPlainStructure(res,'unpay');
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })

  }),
  fetchRefund:action(function(page,userId){
    return new Promise((resolve, reject) => {
      get(url.fetchRefund(page, userId))
        .then(res => {
          this.convertStatusOrdersToPlainStructure(res, 'refund');
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  }),
  fetchPayed: action(function (page, userId) {
    return new Promise((resolve, reject) => {
      get(url.fetchPayed(page, userId))
        .then(res => {
          this.convertStatusOrdersToPlainStructure(res,'payed');
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })

  }),
  fetchShipped: action(function (page, userId) {
    return new Promise((resolve, reject) => {
      get(url.fetchShipped(page, userId))
        .then(res => {
          this.convertStatusOrdersToPlainStructure(res,'shipped');
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })

  }),
  resetOrderList:action(function(){
    this.ordersAll=new Array();
    this.byOrdersAll=new Object();
    this.ordersUnpay=new Array();
    this.byOrdersUnpay=new Object();
    this.ordersPayed= new Array();
    this.byOrdersPayed=new Object();
    this.ordersShipped=new Array();
    this.byOrdersShipped=new Object();
  }),
  fetchAll:action(function(page,userId){
    return new Promise((resolve,reject)=>{
      get(url.fetchAll(page,userId))
        .then(res=>{
          this.convertStatusOrdersToPlainStructure(res,'all');
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  }),
  convertStatusOrdersToPlainStructure:action(function(data,status){
    let orders=new Array();
    let byOrders=new Object();
    data.forEach(order=>{
      orders.push(order.uid);
      order.products.forEach((item) => {
        item.product.photo = `data:image/jpeg;base64,${item.product.photos[0].photo}`;
      })
      if (!byOrders[order.uid]){
        byOrders[order.uid]=order;
      }
    });
    const thiz=this;
    switch(status){
      case 'all':
        orders =orders.filter(uid=>{
          let noRepeat=true;
          thiz.ordersAll.forEach(item=>{
            if(uid==item){
              noRepeat=false;
            }
          })
          return noRepeat;
        })
        this.ordersAll = this.ordersAll.concat(orders);
        this.byOrdersAll = { ...this.byOrdersAll, ...byOrders };
        break;
      case 'unpay':
        orders =orders.filter(uid => {
          let noRepeat = true;
          thiz.ordersUnpay.forEach(item => {
            if (uid == item) {
              noRepeat = false;
            }
          })
          return noRepeat;
        })
        this.ordersUnpay = this.ordersUnpay.concat(orders);
        this.byOrdersUnpay = { ...this.byOrdersUnpay, ...byOrders };
        break;
      case 'payed':
        orders =orders.filter(uid => {
          let noRepeat = true;
          thiz.ordersPayed.forEach(item => {
            if (uid == item) {
              noRepeat = false;
            }
          })
          return noRepeat;
        })
        this.ordersPayed = this.ordersPayed.concat(orders);
        this.byOrdersPayed = { ...this.byOrdersPayed, ...byOrders };
        break;
      case 'shipped':
        orders=orders.filter(uid => {
          let noRepeat = true;
          thiz.ordersShipped.forEach(item => {
            if (uid == item) {
              noRepeat = false;
            }
          })
          return noRepeat;
        })
        this.ordersShipped = this.ordersShipped.concat(orders);
        this.byOrdersShipped = { ...this.byOrdersShipped, ...byOrders };
        break;
      case 'refund':
        orders =orders.filter(uid => {
          let noRepeat = true;
          thiz.ordersRefund.forEach(item => {
            if (uid == item) {
              noRepeat = false;
            }
          })
          return noRepeat;
        })
        this.ordersRefund = this.ordersRefund.concat(orders);
        this.byOrdersRefund = { ...this.byOrdersRefund, ...byOrders };
        break;
    }
  }),
  reserve:action(function(order){
    return new Promise((resolve,reject)=>{
      post(url.reserve(),order)
        .then((res)=>{
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(err)
        })
    })
  }),
  refund: action(function (orderId, refundReason) {
    return new Promise((resolve, reject) => {
      post(url.refund(orderId), refundReason)
        .then(res => {
          this.removeOrder(orderId);
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }),
  cancelOrder:action(function(orderId){
    return new Promise((resolve,reject)=>{
      post(url.cancelOrder(orderId),{})
        .then(res=>{
          this.removeOrder(orderId);
          resolve(res)
        })
        .catch(err=>{
          reject(err)
        })
    })
  }),
  removeOrder:action(function(orderId){
    this.orders = this.orders.filter((uid) => uid != orderId);
    this.ordersAll = this.ordersAll.filter((uid) => uid != orderId);
    this.ordersUnpay = this.ordersUnpay.filter((uid) => uid != orderId);
    this.ordersPayed = this.ordersPayed.filter((uid) => uid != orderId);
    this.ordersShipped = this.ordersShipped.filter((uid) => uid != orderId);
    this.reservationsUnpay = this.reservationsUnpay.filter((uid) => uid != orderId);
    this.reservationsPayed = this.reservationsPayed.filter((uid) => uid != orderId);
    this.reservationsComplete = this.reservationsComplete.filter((uid) => uid != orderId);
  }),
  fetchLatestUnpayOrder:action(function(userId){
    return new Promise((resolve,reject)=>{
      get(url.fetchLatestUnpayOrder(userId))
      .then(res=>{
          this.setOrder(res);
          resolve(res);
        })
        .catch(err=>{
          console.log(err)
        })
    })
  }), 
  placeProductOrder: action(function (order) {
    const thiz = this;
    return new Promise((resolve, reject) => {
      post(url.placeProductOrder(), order)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          if (err.code == 500700) {
            //余额不足
            reject(err);
          }
        })
    })
  }),
  placeOrder: action(function (order) {
    const thiz=this;
    return new Promise((resolve,reject)=>{
      post(url.placeOrder(),order)
        .then(res=>{
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          if(err.code==500700){
            //余额不足
            reject(err);
          }
        })
    })
  }),
  setOrder:action(function(order){
    this.orders=this.orders.concat(order.uid);
    order.products.forEach((item)=>{
      item.product.photo =`data:image/jpeg;base64,${item.product.photos[0].photo}`;
    })
    this.byOrders={...this.byOrders,[order.uid]:order};
  }),
  fetchOrder:action(function(orderId){
    return new Promise((resolve,reject)=>{
      get(url.fetchOrder(orderId))
        .then(res=>{
          this.setOrder(res);
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  })

})
