// pages/order/reservationList/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { order } from "../../../mobx/order.js";
import { user } from "../../../mobx/user.js";
import { showToast } from "../../../utils/request.js";

var common = require("../../../utils/util.js");
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    tab: 0,//0 待付款订单，1 待进行，2 已完成，3 退款
    page_unpay: 0,
    page_payed: 0,
    page_complete: 0,
    page_refund: 0,
    isBottom: false,
    operationOrderId: null,
    errMsg: "",
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo',],
      actions: ['pay', 'charge']
    });
    this.storeBindings = createStoreBindings(this, {
      store: order,
      fields: ['reservationsUnpay', 'byReservationsUnpay', 'reservationsPayed', 'byReservationsPayed', 'reservationsComplete', 'byReservationsComplete', 'reservationsRefund', 'byReservationsRefund'],
      actions: ['fetchUnpayReservations', 'resetReservations', 'fetchPayedReservations', 'fetchCompleteReservations', 'fetchRefundReservations', 'cancelOrder', 'removeOrder','reservationRefund']
    });

  },
  tab_slide: function (e) {//滑动切换tab 
    var that = this;
    that.setData({
      tab: e.detail.current,
      page_unpay: 0,
      page_payed: 0,
      page_complete: 0,
      page_refund: 0,
      isBottom: false,
      operationOrderId: null,
    });
    this.resetReservations();
    this.fetchReservations(e.detail.current, true);
  },
  tab_click: function (e) {//点击tab切换
    var that = this;
    if (that.data.tab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current,
        page_unpay: 0,
        page_payed: 0,
        page_complete: 0,
        page_refund: 0,
        isBottom: false,
        operationOrderId: null,
      })
      that.resetReservations();
      that.fetchReservations(e.target.dataset.current, true);
    }
  },
  scrollToBottom: function () {
    const { tab, isBottom } = this.data;
    if (!isBottom) {
      this.fetchReservations(tab, false);
    }
  },
  fetchReservations: function (tab, isPageZero = false) {
    const { page_payed, page_complete, page_unpay,
      page_refund, userInfo } = this.data;
    let currentPage = 0;
    switch (tab) {
      case 0:
      case "0":
        currentPage = isPageZero ? 0 : page_unpay + 1;
        this.fetchUnpayReservations(currentPage, userInfo.uid)
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
      case 1:
      case "1":
        currentPage = isPageZero ? 0 : page_payed + 1;
        this.fetchPayedReservations(currentPage, userInfo.uid)
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
      case 2:
      case "2":
        currentPage = isPageZero ? 0 : page_shipped + 1;
        this.fetchCompleteReservations(currentPage, userInfo.uid)
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
      case 3:
      case "3":
        currentPage = isPageZero ? 0 : page_refund + 1;
        this.fetchRefundReservations(currentPage, userInfo.uid)
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
    }
  },


  showOrderModal: function (e) {
    this.setData({
      modalName: e.currentTarget.dataset.modal,
      operationOrderId: e.currentTarget.dataset.target
    });
  },


  hideModal: function () {
    this.setData({
      modalName: "",
      operationOrderId: null,
    });
  },


  _cancelOrder: function (e) {
    const { operationOrderId } = this.data;
    this.setData({
      modalName: "",
      operationOrderId: null
    });
    this.cancelOrder(operationOrderId)
      .then(res => {
        showToast("取消订单成功");
      })
      .catch(err => {
        showToast(err.error);
      })
  },


  _pay: function (e) {
    const { userInfo } = this.data;
    const thiz=this;
    this.pay(userInfo.uid, e.currentTarget.dataset.target)
      .then(res => {
        this.removeOrder(e.currentTarget.dataset.target);
        this.storeBindings.updateStoreBindings();
        showToast("付款成功");
      })
      .catch(err => {
        if (err.code == 500700) {
          this.setData({
            modalName: "errModal",
            errMsg: err.error
          })
        } else {
          showToast(err.error)
        }
      })

  },


  showModal: function (e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
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

  showModal: function (e) {
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


  _refund: function () {
    const { userInfo, operationOrderId ,byReservationsPayed} = this.data;
    this.setData({
      modalName: "",
      operationOrderId: null,
    });
    //订单内的预约时间段已按照时间升序排列
    if (byReservationsPayed[operationOrderId].reservations[0].reservationTime - new Date().getTime()<1000*60*120){
      showToast("已超过可取消预约时间，无法取消此订单");
      return;
    }
    this.reservationRefund(operationOrderId)
      .then(res => {
        showToast("退款成功");
      })
      .catch(err => {
        showToast(err.error);
      })
  },

  showShopAddress:function(e){
    this.setData({
      modalName:"shopAddressModal",
      shopAddress:e.currentTarget.dataset.target
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const {page_unpay,userInfo}=this.data;
    this.fetchUnpayReservations(page_unpay, userInfo.uid);

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