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
  

  // 计算属性
  get sum() {
    return this.numA + this.numB
  },

  // actions
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
      if (this.orders.indexOf(order.uid)==-1){
        orders.push(order.uid);
      }
      order.products.forEach((item) => {
        item.product.photo = `data:image/jpeg;base64,${item.product.photos[0].photo}`;
      })
      if (!byOrders[order.uid]){
        byOrders[order.uid]=order;
      }
    });
    switch(status){
      case 'all':
        this.ordersAll = this.ordersAll.concat(orders);
        this.byOrdersAll = { ...this.byOrdersAll, ...byOrders };
        break;
      case 'unpay':
        this.ordersUnpay = this.ordersUnpay.concat(orders);
        this.byOrdersUnpay = { ...this.byOrdersUnpay, ...byOrders };
        break;
      case 'payed':
        this.ordersPayed = this.ordersPayed.concat(orders);
        this.byOrdersPayed = { ...this.byOrdersPayed, ...byOrders };
        break;
      case 'shipped':
        this.ordersShipped = this.ordersShipped.concat(orders);
        this.byOrdersShipped = { ...this.byOrdersShipped, ...byOrders };
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
