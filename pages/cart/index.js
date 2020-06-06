// pages/cart/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { user } from "../../mobx/user.js";
import { cart } from "../../mobx/cart.js";
import { order } from "../../mobx/order.js";
import { showToast } from "../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isManagement:false,
    ingot:0,
    cerdit:0,
    activityBitmap:new Object(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['phone','userInfo'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: order,
      fields: [],
      actions: ['placeOrder']
    });
    this.storeBindings = createStoreBindings(this, {
      store: cart,
      fields: ['cartProducts', 'byCartProducts', 'cartTotal', 'isSelectAll', 'byActivityRules'],
      actions: ['fetchCart', 'changeCartProductNumber', 'check', "selectAll", 'deleteCartItem']
    });
  },
  //删除购物车内容
  _delete: function () {
    this.deleteCartItem()
      .then(()=>{
        showToast("删除成功");
        this.storeBindings.updateStoreBindings();
        this.calculateAmount();
      })
      .catch(err=>{
        showToast(err.error);
      })
  },
  _check: function (e) {
    this.check(e.currentTarget.dataset.target);
    this.storeBindings.updateStoreBindings();
    this.calculateAmount();
  },
  //管理
  manage:function(){
    const {isManagement}=this.data
    this.setData({
      isManagement: !isManagement
    })
  },
  //全选
  _selectAll: function () {
    const { isSelectAll}=this.data
    this.selectAll(!isSelectAll);
    this.storeBindings.updateStoreBindings();
    this.calculateAmount();
  },
  //数量改变事件
  numberChange: function (e) {
    const { detail } = e;
    const { number, option } = detail;
    const {userInfo,byCartProducts}=this.data;
    console.log("detail",detail)
    this.changeCartProductNumber({uid:option,number,customer:{uid:17},product:{uid:byCartProducts[option].product.uid}})
      .then(() => {
        this.storeBindings.updateStoreBindings();
        this.calculateAmount();
      })
      .catch(err=>{
        showToast(err.error);
      })
  },
  //结算
  _placeOrder:function(){
    const { cartProducts, userInfo, byCartProducts, byActivityRules, activityBitmap} = this.data;
    let products = new Array();
    cartProducts.filter(uid=>{
      return byCartProducts[uid].checked;
    }).forEach((uid, index) => {
      let activityRuleId = null;
      byCartProducts[uid].product.activityRules.forEach(ruleId => {
        const activityId = byActivityRules[ruleId].activity.uid;
        if (activityBitmap[activityId] && activityBitmap[activityId][ruleId]) {
          if (activityBitmap[activityId][ruleId].indexOf(uid) != -1) {
            activityRuleId = ruleId;
          }
        }
      })
      let orderProduct = { product: { uid: byCartProducts[uid].product.uid }, number: byCartProducts[uid].number };
      if (activityRuleId != null) {
        orderProduct = { ...orderProduct, activityRule: { uid: activityRuleId } };
      }
      products.push(orderProduct);
    })
    let order = {
      customer: { uid: userInfo.uid },
      products,
    }
    console.log("order", order);
    this.placeOrder(order)
      .then(res=>{
        wx.navigateTo({
          url: `../order/cartOrderPreview/index?orderId=${res.uid}`,
        })
      })
      .catch(err => {
        showToast(err.error);
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.fetchCart(17);
    if(this.data.phone.length==0){
      //未登录，跳转至登录页面
      wx.redirectTo({
        url: '../login/index',
      })
    } else {
      this.fetchCart(this.data.userInfo.uid);
    }
  }, 
  calculateAmount: function () {
    const { cartProducts, userInfo, byCartProducts, byActivityRules, number } = this.data
    var activityBitmap = new Object(); //用于记录已参与的活动
    var customerType = userInfo.customerType;
    var ingot = 0;
    var credit = 0;
    cartProducts.filter(function(uid){
      return byCartProducts[uid].checked;
    }).forEach(function (key, index) {
      //遍历该产品所参与的活动，产品所参与的活动已按照优先级降序排序
      //即产品优先参与优先级高的活动，每个产品一次只能参与一个活动
      //积分不参与折扣
      const rule = byCartProducts[key].product.activityRules;
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
        for (var j = 0; j < byCartProducts[key].number; j++) {
          activityBitmap[activityId][rule[i]].push(key);
        }
        break;
      }
      //若这个产品的所有优惠规则不适用
      //即不参加活动
      if (!isOneOfRuleApplicable) {
        ingot += byCartProducts[key].product.price.ingot * byCartProducts[key].number;
        credit += byCartProducts[key].product.price.credit * byCartProducts[key].number;
      }
    })
    //计算总价
    for (var activityId in activityBitmap) {
      for (var ruleId in activityBitmap[activityId]) {
        const activityRule1 = byActivityRules[ruleId].activityRule1;
        const activityRule2 = byActivityRules[ruleId].activityRule2;
        let ruleIngot = 0;
        let ruleCredit = 0;
        activityBitmap[activityId][ruleId].forEach(function (key) {
          ruleIngot += byCartProducts[key].product.price.ingot;
          ruleCredit += byCartProducts[key].product.price.credit;
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