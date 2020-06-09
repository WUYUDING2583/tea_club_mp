// pages/order/reservePreview/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { shop } from '../../../mobx/shop';
import { box } from '../../../mobx/box';
import { user } from '../../../mobx/user.js';
import { order } from '../../../mobx/order.js';
import { showToast } from "../../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,
    boxId:null,
    countDown: 15,
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
    // options.orderId = 233; 
    this.setData({
      orderId:options.orderId,
    })
    this.storeBindings = createStoreBindings(this, {
      store: order,
      fields: ['byOrders'],
      actions: ['fetchOrder'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo'],
      actions: ['pay','charge'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['byBoxes'],
      actions: ['fetchBox'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['byBoxes'],
      actions: [],
    });
    this.storeBindings.updateStoreBindings()
    this.fetchOrder(options.orderId)
      .then(res=>{
        this.setData({
          boxId:res.reservations[0].box.uid
        })
        this.fetchBox(res.reservations[0].box.uid)

      })
      .catch(err=>{

      })
    const thiz=this;
    var timer = setInterval(function () {
      const countDown = thiz.data.countDown;
      thiz.setData({
        countDown: countDown - 1
      })
      if (countDown <= 0) {
        clearInterval(countDown);
        thiz.setData({
          countDown: 15,
        })
      }
    }, 1000*60)

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
  //提交订单
  _pay:function(){
    // this.setData({
    //   modalName: "errModal",
    //   errMsg:"asdfasf"
    // })
    this.pay(this.data.userInfo.uid,this.data.orderId)
      .then(res=>{
        showToast("预约成功");
        setTimeout(function(){
          let page=getCurrentPages()
          wx.navigateBack({
            delta: page.length,
          })
        }, 2500)
      })
      .catch(err=>{
        console.log(err);
        if(err.code==500700){
          this.setData({
            modalName:"errModal",
            errMsg:err.error
          })
        }else{
          showToast(err.error);
        }
      })
  },
  _charge: function () {
    const { charge, userInfo } = this.data;
    const thiz = this;
    this.charge(charge, userInfo.uid)
      .then(res => {
        showToast("充值成功");
        this.setData({
          modalName:""
        })
      })
      .catch(err => {
        showToast(err.error);
      })
  },
  chargeInput:function(e){
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
  showModal:function(e){
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal:function(){
    this.setData({
      modalName:"",
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()

  },

})