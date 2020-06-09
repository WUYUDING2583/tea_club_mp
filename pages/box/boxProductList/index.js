// pages/box/boxProductList/index.js
//用于客户扫描包厢二维码跳转此门店的商品列表并选择商品下单页面
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { user } from '../../../mobx/user';
import { box } from '../../../mobx/box';
import { product } from '../../../mobx/product';
import { order } from '../../../mobx/order';
import {showToast} from "../../../utils/request.js"

var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,
    anmiaton:"",
    selectProducts:new Object(),
    selectProductNumber:0,
    modalName:"",
    ingot:0,
    credit:0,
    activityBitmap:new Object()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.boxId=4;
    if(!options.boxId){
      wx.navigateBack({
        delta: 1,
      })
    }
    this.setData({
      boxId:options.boxId
    })
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo'],
      actions: ['getUserInfoByPhone'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['byBoxes'],
      actions: ['fetchBox'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: product,
      fields: ['products', 'byProducts', 'productTypes', 'byProductTypes','byActivityRules'],
      actions: ['fetchBoxProduct'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: order,
      fields: [],
      actions: ['placeOrder'],
    });
    
    if (app.globalData.Phone.length==0){
      wx.navigateTo({
        url: '../../login/index',
      })
    }
    this.getUserInfoByPhone(app.globalData.Phone);

    this.fetchBoxProduct()
      .then((data) => {
        let list = new Array();
        data.forEach(item => {
          list.push({});
        });
        this.setData({
          list
        })
      });
    this.fetchBox(options.boxId);
  },


  add:function(e) {
    const productId = e.currentTarget.dataset.target;
    let selectProducts = this.data.selectProducts;
    if(!selectProducts[productId]){
      selectProducts[productId]=1;
    }else{
      selectProducts[productId]=selectProducts[productId]+1;
    }
    this.setData({
      selectProducts
    })
    this.getSelectProductNumber();
    this.calculateAmount();
  },

  getSelectProductNumber: function (){
    const { selectProducts}=this.data;
    let selectProductNumber = 0;
    for (let key in selectProducts) {
      selectProductNumber += selectProducts[key];
    }
    this.setData({
      selectProductNumber
    })
  },

  tabSelect:function(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain:function(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + i);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (i - 1) * 50,
          TabCur: i
        })
        return false
      }
    }
  },

  showModal:function(e){
    const {modalName}=this.data;
    if(modalName!=""){
      this.hideModal()
    }else{
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }
  },

  hideModal:function(){
    this.setData({
      modalName:""
    })
  },


  //stepper数量改变事件
  numberChange: function (e) {
    const { detail } = e;
    const { number, option } = detail;
    const {selectProducts} = this.data;
    if(number==0){
      delete selectProducts[option];
      this.setData({
        selectProducts
      })
    }else{
      this.setData({
        selectProducts: { ...selectProducts, [option]: number }
      })
    }
    this.getSelectProductNumber();
    this.calculateAmount();
  },

  clearCart:function(){
    this.setData({
      selectProducts:new Object()
    })
    this.getSelectProductNumber();
    this.calculateAmount();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()

  },

  _placeOrder:function(){
    const { byProducts, userInfo, selectProducts, byActivityRules, activityBitmap ,boxId} = this.data;
    let products = new Array();
    for(let uid in selectProducts){
      let activityRuleId = null;
      byProducts[uid].activityRules.forEach(ruleId => {
        const activityId = byActivityRules[ruleId].activity.uid;
        if (activityBitmap[activityId] && activityBitmap[activityId][ruleId]) {
          if (activityBitmap[activityId][ruleId].indexOf(uid) != -1) {
            activityRuleId = ruleId;
          }
        }
      })
      let orderProduct = { product: { uid}, number: selectProducts[uid] };
      if (activityRuleId != null) {
        orderProduct = { ...orderProduct, activityRule: { uid: activityRuleId } };
      }
      products.push(orderProduct);
    }
    if (products.length == 0) {
      showToast("请选择商品");
      return;
    }
    let order = {
      customer: { uid: userInfo.uid },
      products,
      boxOrder:{uid:boxId}
    }
    console.log("order", order);
    this.placeOrder(order)
      .then(res => {
        wx.navigateTo({
          url: `../../order/orderPreview/index?orderId=${res.uid}`,
        })
      })
      .catch(err => {
        showToast(err.error);
      })
  },

  calculateAmount: function () {
    const { byProducts, userInfo, selectProducts, byActivityRules } = this.data
    var activityBitmap = new Object(); //用于记录已参与的活动
    var customerType = userInfo.customerType;
    var ingot = 0;
    var credit = 0;
    for(let key in selectProducts) {
      //遍历该产品所参与的活动，产品所参与的活动已按照优先级降序排序
      //即产品优先参与优先级高的活动，每个产品一次只能参与一个活动
      //积分不参与折扣
      const rule = byProducts[key].activityRules;
      var isOneOfRuleApplicable = false;
      for (var i = 0; i < rule.length; i++) {
        const activityId = byActivityRules[rule[i]].activity.uid;
        const activityApplyForCustomerTypes = byActivityRules[rule[i]].activityApplyForCustomerTypes;
        //判断用户的vip等级能否参与此活动
        var isApplicable = false;
        activityApplyForCustomerTypes.forEach(function (type) {
          if (type.uid == customerType.uid) {
            isApplicable = true;
          }
        });
        //vip等级不够则继续判断该产品下一个参与的活动
        if (!isApplicable) {
          continue;
        }
        //判断是否与已有活动互斥
        var isMutex = false;
        for (var activityKey in activityBitmap) {
          if (byActivityRules[rule[i]].activity.mutexActivities.filter(function (item) { return item.uid == activityKey }).length > 0) {
            isMutex = true;
          }
        }
        //互斥则继续判断该产品下一个参与的活动
        if (isMutex) {
          continue;
        }
        //否则将其记录在bitmap中并结束遍历
        isOneOfRuleApplicable = true;
        if (!activityBitmap[activityId] || !activityBitmap[activityId][rule[i]]) {
          activityBitmap[activityId] = new Object();
          activityBitmap[activityId][rule[i]] = new Array();

        }
        for (var j = 0; j < selectProducts[key]; j++) {
          activityBitmap[activityId][rule[i]].push(key);
        }
        break;
      }
      //若这个产品的所有优惠规则不适用
      //即不参加活动
      if (!isOneOfRuleApplicable) {
        ingot += byProducts[key].price.ingot * selectProducts[key];
        credit += byProducts[key].price.credit * selectProducts[key];
      }
    }
    //计算总价
    for (var activityId in activityBitmap) {
      for (var ruleId in activityBitmap[activityId]) {
        const activityRule1 = byActivityRules[ruleId].activityRule1;
        const activityRule2 = byActivityRules[ruleId].activityRule2;
        let ruleIngot = 0;
        let ruleCredit = 0;
        activityBitmap[activityId][ruleId].forEach(function (key) {
          ruleIngot += byProducts[key].price.ingot;
          ruleCredit += byProducts[key].price.credit;
        });
        if (activityRule2 == null) {
          //折扣
          ingot += ruleIngot * (100 - activityRule1) / 100;
          credit += ruleCredit;
        } else {
          //购物满xx赠/减xx积分/元宝
          if (ruleIngot > activityRule1) {//满足条件
            if (activityRule2.operation == "minus") {//满减元宝,满赠在后台处理
              // if (activityRule2.currency == "ingot") {
              ruleIngot -= activityRule2.number;
              // } else {
              //     ruleCredit -= activityRule2.number;
              // }
            }
          }
          ingot += ruleIngot;
          credit += ruleCredit;
        }
      }
    }
    this.setData({
      ingot,
      credit,
      activityBitmap
    })
  },

})