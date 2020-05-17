import {
  configure,
  observable,
  action
} from 'mobx-miniprogram';
import {
  app
} from "./app.js";
import {url} from "../utils/url.js";

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
    app.startRetrieveRequest();
    const thiz = this;
    wx.request({
      url: url.fetchHotProducts(),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("hot product res",res);
        thiz.convertProductsToPlainStructure(res.data.data);
      },
      complete() {
        app.finishRetrieveRequest();
      }
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