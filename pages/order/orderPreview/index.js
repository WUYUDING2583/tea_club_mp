// pages/order/orderPreview/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { product } from "../../../mobx/product.js";
import { user } from "../../../mobx/user.js";
import { shop } from "../../../mobx/shop.js";
import { order } from "../../../mobx/order.js";
import { showToast } from "../../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ps:"",
    showModal: false,
    countDown:15,
    ruleId:null,
    ingot:0,
    credit:0,
    addressId:null,
    errMsg:"",
    modalName:"",
    errModal:false,
    charge:0,
    deliveryMode:"delivery",
    isCart:true,
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
    console.log(options);
    const isCart = options.isCart ? options.isCart:true;
    this.setData({
      orderId:options.orderId,
      isCart
    }); 
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo', 'byAddresses'],
      actions: ['charge', 'payCart','getUserInfoByPhone','payCart']
    });
    this.storeBindings = createStoreBindings(this, {
      store: shop,
      fields: ['byShops'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: order,
      fields: ['byOrders'],
      actions: ['fetchOrder'],
    });

    this.fetchOrder(options.orderId);
    // this.getUserInfoByPhone("15868859587");
    const thiz=this;
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
  },
  _charge:function(){
    const {charge,userInfo}=this.data;
    const thiz=this;
    this.charge(charge,userInfo.uid)
      .then(res=>{
        showToast("充值成功");
        this.setData({
          modalName:""
        })
      })
      .catch(err=>{

      })
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
  psInput:function(e){
    this.setData({
      ps: e.detail.value
    })
  },
  //选择地址
  selectAddress:function(){
    wx.navigateTo({
      url: '../../address/addressList/index?select=true',
    })
  },

  _payCart:function(){
    const { byOrders, orderId,  addressId,  ps, deliveryMode ,shopId,isCart,userInfo} = this.data;
    if(addressId==null&&deliveryMode=="delivery"){
      showToast("请选择收货地址");
      return;
    }
    let order = {
      uid:orderId,
      buyerPs:ps,
      deliverMode: deliveryMode,
      customer:{uid:userInfo.uid}
    }
    if (deliveryMode=="selfPick"){
      order = { ...order,  placeOrderWay: { uid: shopId }}
    }else{
      order = { ...order,  address: { uid: addressId }};
    }
    console.log("order", order);
    this.payCart(order,isCart)
      .then(res=>{
        wx.redirectTo({
          url: `../orderResult/index?orderId=${this.data.orderId}`,
        })
      })
      .catch(err=>{
        if(err.code==500700){
          this.setData({
            modalName:"errModal",
            errMsg:err.error
          })
        } else {
          showToast(err.error)
        }
      })
  },
  hideModal:function(){
    this.setData({
      modalName:""
    })  
  },
  showModal:function(e){
    this.setData({
     modalName:e.currentTarget.dataset.target
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const {userInfo}=this.data;
    if (userInfo.address){
      this.setData({
        addressId: userInfo.address
      })
    }
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();

  },

})