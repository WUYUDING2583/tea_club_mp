import {configure,observable,action} from 'mobx-miniprogram';
import { get } from "../utils/request.js";
import { url } from "../utils/url.js";

// 不允许在动作外部修改状态
configure({
  enforceActions: 'observed'
});

export const product = observable({

  // 数据字段
  products: new Array(),
  byProducts:new Object(),
  hotProducts: new Array(),
  productTypes:new Array(),
  byProductTypes:new Object(),
  byProductPhotos:new Object(),
  byActivityRules:new Object(),
  byActivities:new Object(),


  // actions
  fetchProduct:action(function(uid){
    get(url.fetchProduct(uid))
      .then(res => {
        this.convertProductToPlainStructure(res);
      })
  }),
  convertProductToPlainStructure:action(function(data){
    let byProductPhotos=new Object();
    let photos=new Array();
    let productDetails=new Array();
    data.photos.forEach(item=>{
      photos.push(item.uid);
      if(!byProductPhotos[item.uid]){
        byProductPhotos[item.uid] = `data:image/jpeg;base64,${item.photo}`
      }
    });
    data.productDetails.forEach(item=>{
      productDetails.push(item.uid);
      if (!byProductPhotos[item.uid]) {
        byProductPhotos[item.uid] = `data:image/jpeg;base64,${item.photo}`
      }
    })
    let activityRules = new Array();
    let byActivityRules = new Object();
    data.activityRules.forEach(rule=>{
      activityRules.push(rule.uid);
      byActivityRules[rule.uid]=rule;
    })
    //活动规则按优先级高低排序
    activityRules.sort((a, b) => {//优先级数字越小等级越高
      return byActivityRules[a].activity.priority - byActivityRules[b].activity.priority;
    })
    // let byActivities=new Object();
    // byActivities[data.activity.uid]=data.activity;
    let byProducts=this.byProducts;
    this.byProducts = { ...byProducts, [data.uid]: { ...byProducts[data.uid], ...data, photos, productDetails, activityRules} };
    this.byProductPhotos=byProductPhotos;
    this.byActivityRules=byActivityRules;
  }),
  fetchProducts:action(function(){
    return new Promise((resolve,reject)=>{
      get(url.fetchProducts())
        .then(res=>{
          const productTypes=this.convertProductsToPlainStructure(res);
          resolve(productTypes);
        })
    })
  }),
  fetchBoxProduct: action(function () {
    return new Promise((resolve, reject) => {
      get(url.fetchBoxProduct())
        .then(res => {
          const productTypes = this.convertProductsToPlainStructure(res);
          resolve(productTypes);
        })
    })

  }),
  convertProductsToPlainStructure:action(function(data){
    let products=new Array();
    let byProducts=new Object();
    let productTypes=new Array();
    let byProductTypes = new Object();
    let byActivityRules = new Object();
    data.forEach(item=>{
      products.push(item.uid);
      if(productTypes.indexOf(item.type.uid)==-1){
        productTypes.push(item.type.uid);
      }
      if(!byProductTypes[item.type.uid]){
        byProductTypes[item.type.uid]=new Object();
        byProductTypes[item.type.uid].products=new Array();
      }
      byProductTypes[item.type.uid] = { ...item.type,products: byProductTypes[item.type.uid].products.concat([item.uid])};

      let activityRules = new Array();
      if (item.activityRules){
        item.activityRules.forEach(rule => {
          activityRules.push(rule.uid);
          if (!byActivityRules[rule.uid]) {
            byActivityRules[rule.uid] = rule;
          }
        })
        //活动规则按优先级高低排序
        activityRules.sort((a, b) => {//优先级数字越小等级越高
          return byActivityRules[a].activity.priority - byActivityRules[b].activity.priority;
        })
      }
      if(!byProducts[item.uid]){
        byProducts[item.uid] = { ...item,photo:`data:image/jpeg;base64,${item.photos[0].photo}`,activityRules};
      }
    });
    this.products=products;
    this.byProducts=byProducts;
    this.productTypes=productTypes;
    this.byProductTypes=byProductTypes;
    this.byActivityRules=byActivityRules;
    return productTypes;
  }),
  fetchHotProducts: action(function() {
    get(url.fetchHotProducts())
    .then((res)=>{
      this.convertHotProductsToPlainStructure(res);
    })
  }),
  convertHotProductsToPlainStructure:action(function(data){
    let hotProducts=new Array();
    data.forEach(item=>{
      hotProducts.push({
        ...item.product, sales: item.sales, photo: `data:image/jpeg;base64,${item.product.photos[0].photo}` });
    });
    this.hotProducts=hotProducts;
  })

})