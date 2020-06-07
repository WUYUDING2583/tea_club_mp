// pages/order/orderList/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
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
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    tab:0,//0 所有类型订单，1 待付款订单，2 代发货订单，3 待收货订单，4 退款/售后
    page_all:0,
    page_unpay:0,
    page_payed:0,
    page_shipped:0,
    page_refund:0,
    isBottom:false,
    operationOrderId:null,
    errMsg:"",
    modalName: "",
    charge: 0,
    checkbox: [{
      value: 50,
      name: '50元',
      checked: false,
    }, {
      value: 100,
      name: '100元',
      checked: false,
    }, {
      value: 200,
      name: '200元',
      checked: false,
    }, {
      value: 500,
      name: '500元',
      checked: false,
    }, {
      name: "自定义",
      checked: false,
      value: -1,

    }],
    RefundReason: app.globalData.RefundReason,
    refundIndex:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo',],
      actions: ['pay','charge']
    });
    this.storeBindings = createStoreBindings(this, {
      store: order,
      fields: ['ordersAll','byOrdersAll','ordersUnpay','byOrdersUnpay','ordersPayed','byOrdersPayed','ordersShipped','byOrdersShipped','ordersRefund','byOrdersRefund'],
      actions: ['fetchAll', 'resetOrderList', 'fetchPayed', 'fetchUnpay', 'fetchShipped', 'cancelOrder', 'removeOrder','fetchRefund','refund']
    });

  },
  fetchOrders: function (tab,isPageZero=false) {
    const { page_all, page_payed, page_shipped, page_unpay,
      page_refund, userInfo } = this.data;
    let currentPage=0;
    switch(tab){
      case 1:
      case "1":
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
      case "2":
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
      case "3":
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
      case 4:
      case "4":
        currentPage = isPageZero ? 0 : page_refund + 1;
        this.fetchRefund(currentPage, userInfo.uid)
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
                  page_refund: page_refund + 1
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
      page_refund: 0,
    });
    this.resetOrderList();
    this.fetchOrders(e.detail.current,true);
  },
  tab_click: function (e) {//点击tab切换
    var that = this;
    if (that.data.tab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current,
        isBottom: false,
        page_all: 0,
        page_unpay: 0,
        page_payed: 0,
        page_shipped: 0,
        page_refund: 0,
      })
      that.resetOrderList();
      that.fetchOrders(e.target.dataset.current, true);
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
      operationOrderId: null,
      trackInfo:""
    });
  },
  showOrderModal: function (e) {
    this.setData({
      modalName: e.currentTarget.dataset.modal,
      operationOrderId: e.currentTarget.dataset.target
    });
    if (e.currentTarget.dataset.modal == "trackInfoModal") {
      let trackInfo="";
      const {byOrdersShipped}=this.data;
      if (byOrdersShipped[e.currentTarget.dataset.target].trackInfo.companyName==null){
        trackInfo += `配送人联系方式：${byOrdersShipped[e.currentTarget.dataset.target].trackInfo.phone}\n`;
        trackInfo += `配送人信息：${byOrdersShipped[e.currentTarget.dataset.target].trackInfo.description}`
      } else {
        trackInfo += `物流公司：${byOrdersShipped[e.currentTarget.dataset.target].trackInfo.companyName}\n`;
        trackInfo += `物流单号：${byOrdersShipped[e.currentTarget.dataset.target].trackInfo.trackingId}`;
      }
      this.setData({
        trackInfo
      })
    }
    
  },
  chargeInput: function (e) {
    let items = this.data.checkbox;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].name == "自定义") {
        items[i].value = e.detail.value;
      }
    }
    this.setData({
      charge: e.detail.value,
      checkbox: items
    })
  },
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    this.setData({
      charge: values
    })
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = true;
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      checkbox: items
    })
  },
  showModal:function(e){
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  _charge: function () {
    const { charge, userInfo } = this.data;
    const thiz = this;
    this.charge(charge, userInfo.uid)
      .then(res => {
        showToast("充值成功");
        this.setData({
          modalName: ""
        })
      })
      .catch(err => {
        showToast(err.error);
      })
  },
  _cancelOrder:function(e){
    const { operationOrderId } = this.data;
    this.setData({
      modalName: "",
      operationOrderId: null
    });
    this.cancelOrder(operationOrderId)
      .then(res=>{
        showToast("取消订单成功");
      })
      .catch(err=>{
        showToast(err.error);
      })
  },
  _pay:function(e){
    const {userInfo}=this.data;
    this.pay(userInfo.uid, e.currentTarget.dataset.target)
      .then(res=>{
        this.removeOrder(e.currentTarget.dataset.target);
        showToast("付款成功");
      })
      .catch(err=>{
        if (err.code == 500700) {
          this.setData({
            modalName: "errModal",
            errMsg: err.error
          })
        }else{
          showToast(err.error)
        }
      })
    
  },

  _refund:function(){
    const { refundIndex, RefundReason, userInfo, operationOrderId } = this.data;
    this.setData({
      modalName: "",
      operationOrderId: null,
      refundIndex:null,
    });
    if(refundIndex==null){
      showToast("请选择退款理由");
      return;
    }
    this.refund(operationOrderId,RefundReason[refundIndex])
      .then(res=>{
        showToast("申请退款成功，等待系统管理员审核");
      })
      .catch(err=>{
        showToast(err.error);
      })
  },

  _showTrackInfo:function(e){
    e.currentTarget.dataset.target
  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      refundIndex: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const { page_all, userInfo } = this.data; 
    this.fetchAll(page_all,userInfo.uid);
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