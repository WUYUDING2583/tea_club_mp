import { configure, observable, action } from 'mobx-miniprogram';
import { get,post } from "../utils/request.js";
import { url } from "../utils/url.js";
import { app as appActions} from "./app.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const cart = observable({

  // 数据字段
  cartProducts: new Array(),
  byCartProducts:new Object(),

  // 计算属性
  get cartTotal() {
    let total=0;
    this.cartProducts.forEach(uid=>{
      total+=this.byCartProducts[uid].number;
    })
    return total;
  },

  // actions
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
    data.forEach(item=>{
      cartProducts.push(item.uid);
      if(!byCartProducts[item.uid]){
        byCartProducts[item.uid]=item;
      }
    });
    this.cartProducts=cartProducts;
    this.byCartProducts=byCartProducts;
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
