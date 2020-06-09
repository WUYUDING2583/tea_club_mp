// pages/order/orderDetail/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { product } from "../../../mobx/product.js";
import { order } from "../../../mobx/order.js";
import { user } from "../../../mobx/user.js";
import { showToast } from "../../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,
    countDown:15,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("orderId",options.orderId);
    this.storeBindings = createStoreBindings(this, {
      store: product,
      fields: ['byProductPhotos', 'byProducts', 'byActivityRules'],
      actions: ['fetchProduct'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: order,
      fields: ['orders', 'byOrders'],
      actions: ['fetchOrder', 'fetchLatestUnpayOrder','cancelOrder']
    });
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo', ],
      actions: ['pay']
    });

    // this.fetchOrder(options.orderId);
    const thiz=this;
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      })
      this.fetchOrder(options.orderId)
        .then(res=>{
          if(res.status.status=="unpay"){
            const { orderTime } = res;
            let timer = setInterval(function () {
              const { countDown } = thiz.data;
              if (countDown == 1) {
                clearInterval(timer);
                thiz.setData({ countDown: 15 });
                //返回首页
                let pages = getCurrentPages();
                wx.navigateBack({
                  delta: pages.length,
                })
              }
              thiz.setData({
                countDown: countDown - 1
              })
            }, 1000 * 60);
          }
        })
    }
  },
  _cancelOrder:function(){
    const {orderId}=this.data;
    this.cancelOrder(orderId)
      .then((res)=>{
        showToast("订单取消成功");
        setTimeout(function(){
          let pages=getCurrentPages();
          wx.navigateBack({
            delta: pages.length,
          })
        },1500)
      })
  },
  hideModal:function(){
    this.setData({
      modalName: ""
    })
  },
  _charge:function(){
    const thiz=this;
    wx.navigateTo({
      url: '../../charge/index',
      success: function(res) {
        thiz.setData({
          modalName:""
        })
      },
    })
  },
  _pay:function(){
    const {userInfo,orderId}=this.data;
    this.pay(userInfo.uid,orderId)
      .then(()=>{
        showToast("付款成功");
        setTimeout(function(){
          let pages=getCurrentPages();
          wx.navigateBack({
            delta: pages.length,
          })
        },1500)
      })
      .catch(err=>{
        if (err.code == 500700) {
          this.setData({
            modalName: "errModal",
            errMsg: err.error
          })
        }
      })
  },
  showCancelModal:function(){
    console.log("asf")
    this.setData({
      modalName: "cancelOrder"
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.fetchLatestUnpayOrder(this.data.userInfo.uid);
    const thiz=this;
    this.fetchLatestUnpayOrder(this.data.userInfo.uid)
      .then(res=>{
        this.setData({
          orderId:res.uid
        })
        const { orderTime } = res;
        let timer = setInterval(function () {
          const { countDown } = thiz.data;
          if (countDown == 1) {
            clearInterval(timer);
            thiz.setData({ countDown: 15 });
            //返回首页
            let pages = getCurrentPages();
            wx.navigateBack({
              delta: pages.length,
            })
          }
          thiz.setData({
            countDown: countDown - 1
          })
        }, 1000 * 60);
      })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();

  },


})