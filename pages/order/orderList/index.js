// pages/order/orderList/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { product } from "../../../mobx/product.js";
import { order } from "../../../mobx/order.js";
import { user } from "../../../mobx/user.js";
import { showToast } from "../../../utils/request.js";

var common=require("../../../utils/util.js");
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:0,//0 所有类型订单，1 待付款订单，2 代发货订单，3 待收货订单
    page_all:0,
    page_unpay:0,
    page_payed:0,
    page_shipped:0,
    isBottom:false,
    modalName:"",
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo',],
      actions: ['pay']
    });
    this.storeBindings = createStoreBindings(this, {
      store: order,
      fields: ['ordersAll','byOrdersAll','ordersUnpay','byOrdersUnpay','ordersPayed','byOrdersPayed','ordersShipped','byOrdersShipped'],
      actions: ['fetchAll', 'resetOrderList', 'fetchPayed', 'fetchUnpay', 'fetchShipped','cancelOrder']
    });

  },
  fetchOrders: function (tab,isPageZero=false) {
    const { page_all, page_payed, page_shipped, page_unpay, userInfo } = this.data;
    let currentPage=0;
    switch(tab){
      case 1:
        currentPage = isPageZero ? 0 : page_unpay + 1;
        this.fetchUnpay(currentPage,userInfo.uid)
          .then((res) => {
            if (res.length == 0) {
              //没有了
              showToast("没有更多了...");
              this.setData({
                isBottom: true,
              })
            } else {
              if (!isPageZero) {
                this.setData({
                  page_unpay: page_unpay + 1
                })
              }
            }
          })
        break;
      case 2:
        currentPage = isPageZero ? 0 : page_payed + 1;
        this.fetchPayed(currentPage, userInfo.uid)
          .then((res) => {
            if (res.length == 0) {
              //没有了
              showToast("没有更多了...");
              this.setData({
                isBottom: true,
              })
            } else {
              if (!isPageZero) {
                this.setData({
                  page_payed: page_payed + 1
                })
              }
            }
          })
        break;
      case 3:
        currentPage = isPageZero ? 0 : page_shipped + 1;
        this.fetchShipped(currentPage, userInfo.uid)
          .then((res) => {
            if (res.length == 0) {
              //没有了
              showToast("没有更多了...");
              this.setData({
                isBottom: true,
              })
            } else {
              if (!isPageZero) {
                this.setData({
                  page_shipped: page_shipped + 1
                })
              }
            }
          })
        break;
      default:
        currentPage = isPageZero ? 0 : page_all + 1;
        this.fetchAll(currentPage, userInfo.uid)
          .then((res) => {
            if (res.length == 0) {
              //没有了
              showToast("没有更多了...");
              this.setData({
                isBottom: true,
              })
            } else {
              if (!isPageZero) {
                this.setData({
                  page_all: page_all + 1
                })
              }
            }
          })
    }
  },
  tab_slide: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ 
      tab: e.detail.current,
      isBottom:false,
      page_all: 0,
      page_unpay: 0,
      page_payed: 0,
      page_shipped: 0,
    });
    this.resetOrderList();
    this.fetchOrders(e.detail.current,true);
  },
  tab_click: function (e) {//点击tab切换
    var that = this;
    if (that.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current,
        isBottom: false,
        page_all: 0,
        page_unpay: 0,
        page_payed: 0,
        page_shipped: 0,
      })
      this.resetOrderList();
      this.fetchOrders(e.detail.current, true);
    }
  },
  scrollToBottom:function(){
    console.log("scrollToBottom");
    const { tab, isBottom } = this.data;
    if (!isBottom) {
      this.fetchOrders(tab, false);
    }
  },
  hideModal:function(){
    this.setData({
      modalName: "",
      cancelOrderId: null
    });
  },
  showCancelModal: function (e) {
    this.setData({
      modalName: "cancelOrderModal",
      cancelOrderId: e.currentTarget.dataset.target
    });
    
  },
  _cancelOrder:function(e){
    const { cancelOrderId } = this.data;
    this.setData({
      modalName: "",
      cancelOrderId: null
    });
    this.cancelOrder(cancelOrderId)
      .then(res=>{
        showToast("取消订单成功");
      })
      .catch(err=>{
        showToast(err.error);
      })
  },
  _pay:function(e){
    e.currentTarget.dataset.target
  },
  _refund:function(e){
    e.currentTarget.dataset.target
  },
  _showTrackInfo:function(e){
    e.currentTarget.dataset.target
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const { page_all, userInfo } = this.data; 
    this.setData({
      userInfo:{...userInfo,uid:17}
    })
    this.fetchAll(page_all, 17);
    // this.fetchAll(page_all,userInfo.uid);
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
    this.storeBindings.destroyStoreBindings();

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