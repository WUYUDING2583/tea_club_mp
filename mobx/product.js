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
  hotProducts: new Array(),


  // actions
  fetchHotProducts: action(function() {
    get(url.fetchHotProducts())
    .then((res)=>{
      this.convertProductsToPlainStructure(res);
    })
  }),
  convertProductsToPlainStructure:action(function(data){
    let hotProducts=new Array();
    data.forEach(item=>{
      hotProducts.push({
        ...item.product, sales: item.sales, photo: `data:image/jpeg;base64,${item.product.photos[0].photo}` });
    });
    this.hotProducts=hotProducts;
  })

})