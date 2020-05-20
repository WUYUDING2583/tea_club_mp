import { configure, observable, action } from 'mobx-miniprogram';
import { get, post } from "../utils/request.js";
import { url } from "../utils/url.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const shop = observable({

  // 数据字段
  shops: new Array(),
  byShops: new Object(),

  // 计算属性
  get shopNameList() {
    var shopNameList=new Array();
    this.shops.forEach(uid=>{
      shopNameList.push(this.byShops[uid].name);
    })
    return shopNameList;
  },

  // actions
  getShopList: action(function () {
    get(url.getShopNameList())
      .then((res)=>{
        this.convertShopsToPlainStructure(res);
      })
      .catch(err=>{
        console.log(err);
      })
  }),
  convertShopsToPlainStructure:action(function(data){
    let shops=new Array();
    let byShops=new Object();
    data.forEach(shop=>{
      shops.push(shop.uid);
      if(!byShops[shop.uid]){
        byShops[shop.uid]=shop;
      }
    });
    this.shops=shops;
    this.byShops=byShops;
  })

})
