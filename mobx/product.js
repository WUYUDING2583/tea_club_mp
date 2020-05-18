import {configure,observable,action} from 'mobx-miniprogram';
import {url} from "../utils/url.js";
import { get } from "../utils/request.js";

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


  // actions
  fetchProducts:action(function(){
    return new Promise((resolve,reject)=>{
      get(url.fetchProducts())
        .then(res=>{
          const productTypes=this.convertProductsToPlainStructure(res);
          resolve(productTypes);
        })
    })
  }),
  convertProductsToPlainStructure:action(function(data){
    let products=new Array();
    let byProducts=new Object();
    let productTypes=new Array();
    let byProductTypes=new Object();
    data.forEach(item=>{
      products.push(item.uid);
      if(productTypes.indexOf(item.type.uid)==-1){
        productTypes.push(item.type.uid);
      }
      if(!byProductTypes[item.type.uid]){
        byProductTypes[item.type.uid]=new Object();
        byProductTypes[item.type.uid].products=new Array();
      }
      byProductTypes[item.type.uid] = { ...item.type, products: byProductTypes[item.type.uid].products.concat([item.uid])};
      if(!byProducts[item.uid]){
        byProducts[item.uid] = { ...item, photo:`data:image/jpeg;base64,${item.photos[0].photo}`};
      }
    });
    this.products=products;
    this.byProducts=byProducts;
    this.productTypes=productTypes;
    this.byProductTypes=byProductTypes;
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