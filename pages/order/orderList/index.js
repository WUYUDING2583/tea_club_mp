// pages/order/orderList/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { product } from "../../../mobx/product.js";
import { order } from "../../../mobx/order.js";
import { user } from "../../../mobx/user.js";
import { showToast } from "../../../utils/request.js";

var common=require("../../../utils/util.js");

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
      fields: ['ordersAll','byOrdersAll'],
      actions: ['fetchAll']
    });

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
    }
  },
  fetchAll:function(page){
    const {userInfo}=this.data;
    this.fetchAll(page,userInfo.uid)
      .then(res=>{

      })
      .catch(err=>{
        showToast(err.error)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const { page_all, userInfo } = this.data; 
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
    console.log("on reach bottom");
    const {tab,page_all,page_payed,page_shipped,page_unpay,userInfo}=this.data;
    // let currentPage=page_all;
    // switch(tab){
    //   case 1:
    //     currentPage=page_unpay;
    //     break;
    //   case 2:
    //     currentPage=page_payed;
    //     break;
    //   case 3:
    //     currentPage=page_shipped;
    //     break;
    //   default:
    //     currentPage=page_all;
    // }
    this.fetchAll(page_all+1,17)
      .then((res)=>{
        if(res.length==0){
          //没有了
          this.setData({
            isBottom:true,
          })
        }else{
          this.setData({
            page_all:page_all+1
          })
        }
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})