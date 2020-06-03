import { configure, observable, action } from 'mobx-miniprogram';
import { get, post } from "../utils/request.js";
import { url } from "../utils/url.js";
var common=require("../utils/util.js");

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
  getShop:action(function(shopId){
    get(url.getShop(shopId))
      .then(res=>{
        this.convertShopToPlainStructure(res);
      })
      .catch(err=>{
        console.log(err);
      })
  }),
  convertShopToPlainStructure:action(function(shop){
    const openHours = shop.openHours;
    if (openHours) {
      const dayOfWeek = new Date().getDay() + "";
      let todayOpenHour = new Object();
      openHours.forEach(item => {
        if (item.date.indexOf(dayOfWeek) != -1) {
          const { startTime, endTime } = item;
          const today = common.getNDayTimeString();
          todayOpenHour = { ...item, startTime: common.timeStringConvertToTimeStamp(today + startTime), endTime: common.timeStringConvertToTimeStamp(today + endTime) };
        }
      })
      shop.todayOpenHour = todayOpenHour;
        this.byShops[shop.uid] = { ...shop, photo: shop.photos.length > 0 ? `data:image/jpeg;base64,${shop.photos[0].photo}` : null };
        this.shops=this.shops.concat([shop.uid]);
    }
  }),
  getShopList:action(function(){
    get(url.getShopList())
      .then(res=>{
        this.convertShopsToPlainStructure(res);
      })
      .catch(err=>{
        console.log(err)
      })
  }),
  getShopNameList: action(function () {
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
      const openHours = shop.openHours;
      if(openHours){
        const dayOfWeek = new Date().getDay() + "";
        let todayOpenHour = new Object();
        openHours.forEach(item => {
          if (item.date.indexOf(dayOfWeek) != -1) {
            const { startTime, endTime } = item;
            const today = common.getNDayTimeString();
            todayOpenHour = { ...item, startTime: common.timeStringConvertToTimeStamp(today + startTime), endTime: common.timeStringConvertToTimeStamp(today + endTime) };
          }
        })
        shop.todayOpenHour = todayOpenHour;
      }
      if(!byShops[shop.uid]){
        byShops[shop.uid] = { ...shop, photo: shop.photos.length>0?`data:image/jpeg;base64,${shop.photos[0].photo}`:null};
      }
    });
    this.shops=shops;
    this.byShops=byShops;
  })

})
