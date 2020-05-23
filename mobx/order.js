import { configure, observable, action } from 'mobx-miniprogram';
import { get, post,showToast } from "../utils/request.js";
import { url } from "../utils/url.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const order = observable({

  // 数据字段
  orders: new Array(),
  byOrders: new Object(),

  // 计算属性
  get sum() {
    return this.numA + this.numB
  },

  // actions
  placeOrder: action(function (order) {
    const thiz=this;
    return new Promise((resolve,reject)=>{
      post(url.placeOrder(),order)
        .then(res=>{
          showToast("下单成功");
          thiz.setOrder(res);
          if (res.status.status == "unpay") {
            //跳转到订单详情
            wx.redirectTo({
              url: `../orderDetail/index?orderId=${res.uid}`,
            })
          } else {
            //返回首页
            let pages = getCurrentPages();
            setTimeout(function () {
              wx.navigateBack({
                delta: pages.length,
              })
            }, 2500)
          }
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
    this.byOrders={...this.byOrders,[order.uid]:order};
  }),
  fetchOrder:action(function(orderId){
    get(url.fetchOrder(orderId))
      .then(res=>{
        this.setOrder(res);
      })
      .catch(err=>{
        console.log(err);
      })
  })

})
