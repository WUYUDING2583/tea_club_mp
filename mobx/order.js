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
  orders_unpay: new Array(),
  byOrders_unpay: new Object(),
  orders_pyaed: new Array(),
  byOrders_payed: new Object(),
  orders_shipped: new Array(),
  byOrders_shipped: new Object(),
  

  // 计算属性
  get sum() {
    return this.numA + this.numB
  },

  // actions
  fetchAll:action(function(page,userId){
    return new Promise((resolve,reject)=>{
      get(url.fetchAll(page,userId))
        .then(res=>{
          this.convertAllOrdersToPlainStructure(res);
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  }),
  convertAllOrdersToPlainStructure:action(function(data){
    let ordersAll=new Array();
    let byOrdersAll=new Object();
    data.forEach(order=>{
      if (this.ordersAll.indexOf(order.uid)==-1){
        ordersAll.push(order.uid);
      }
      order.products.forEach((item) => {
        item.product.photo = `data:image/jpeg;base64,${item.product.photos[0].photo}`;
      })
      if (!byOrdersAll[order.uid]){
        byOrdersAll[order.uid]=order;
      }
    });
    this.ordersAll=this.ordersAll.concat(ordersAll);
    this.byOrdersAll={...this.byOrdersAll,...byOrdersAll};
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
          resolve(res)
        })
        .catch(err=>{
          reject(err)
        })
    })
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
