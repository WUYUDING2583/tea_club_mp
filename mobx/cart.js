import { configure, observable, action } from 'mobx-miniprogram';
import { get,post,_delete } from "../utils/request.js";
import { url } from "../utils/url.js";
import { app as appActions} from "./app.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const cart = observable({

  // 数据字段
  cartProducts: new Array(),
  byCartProducts:new Object(),
  byActivityRules:new Object(),

  // 计算属性
  get cartTotal() {
    let total=0;
    this.cartProducts.forEach(uid=>{
      total+=this.byCartProducts[uid].number;
    })
    return total;
  },
  get isSelectAll(){
    let isAll=true;
    if(this.cartProducts.length==0){
      return false;
    }
    this.cartProducts.forEach(uid => {
      if(!this.byCartProducts[uid].checked){
        isAll=false;
      }
    })
    return isAll;
  },

  // actions
  deleteCartItem:action(function(){
    let deleteCartItem=new Array();
    this.cartProducts.forEach(uid=>{
      if(this.byCartProducts[uid].checked){
        deleteCartItem.push({uid,customer:{uid:this.byCartProducts[uid].customer.uid}});
      }
    });
    const thiz=this;
    return new Promise((resolve,reject)=>{
      _delete(url.deleteCartItem(),deleteCartItem)
        .then(res=>{
          thiz.convertCartToPlainStructure(res);
          resolve();
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  }),
  selectAll:action(function(isAll){
    let byCartProducts=new Object();
    this.cartProducts.forEach((uid)=>{
      if(!byCartProducts[uid]){
        byCartProducts[uid]={
          ...this.byCartProducts[uid],
          checked: isAll
        }
      }
    });
    this.byCartProducts=byCartProducts;
  }),
  check:action(function(uid){
    this.byCartProducts={
      ...this.byCartProducts,
      [uid]:{
        ...this.byCartProducts[uid],
        checked: !this.byCartProducts[uid].checked
      }
    }
  }),
  changeCartProductNumber:action(function(cartProduct){
    return new Promise((resolve,reject)=>{
      post(url.changeCartProductNumber(),cartProduct)
        .then(res=>{
          this.updateCartItemNumber(cartProduct);
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  }),
  updateCartItemNumber: action(function (cartProduct){
    this.byCartProducts = { ...this.byCartProducts, [cartProduct.uid]: { ...this.byCartProducts[cartProduct.uid],number:cartProduct.number}}
  }),
  fetchCart:action(function(userId){
    return new Promise((resolve,reject)=>{
      get(url.fetchCart(userId))
      .then(res=>{
        this.convertCartToPlainStructure(res);
        resolve(res);
      })
      .catch(err=>{
        console.log(err);
        reject(err);
      })
    })
    
  }),
  convertCartToPlainStructure:action(function(data){
    let cartProducts=new Array();
    let byCartProducts=new Object();
    let byActivityRules=new Object();
    data.forEach(item=>{
      cartProducts.push(item.uid);
      let activityRules=new Array();
      item.product.activityRules.sort((a, b) => {//优先级数字越小等级越高
        return a.activity.priority - b.activity.priority;
      })
      item.product.activityRules.forEach(item=>{
        activityRules.push(item.uid);
        if(!byActivityRules[item.uid]){
          byActivityRules[item.uid]=item;
        }
      })
      item.product.activityRules=activityRules;
      if(!byCartProducts[item.uid]){
        byCartProducts[item.uid] = { ...item, photo: `data:image/jpeg;base64,${item.product.photos[0].photo}`, checked:false};
      }
    });
    this.cartProducts=cartProducts;
    this.byCartProducts=byCartProducts;
    this.byActivityRules=byActivityRules;
  }),
  setCartProducts:action(function(data){
    this.cartProducts=data;
  }),
  addToCart: action(function (params) {
    appActions.startUpdateRequest();
    const thiz=this;
    return new Promise((resolve,reject)=>{
      post(url.addToCart(),params,false)
        .then(res=>{
          appActions.finishUpdateRequest();
          // thiz.setCartProducts(res);
          resolve();
        })
        .catch(err=>{
          console.log(err);
          appActions.finishUpdateRequest();
          reject(err);
        })
    })
  })

})
