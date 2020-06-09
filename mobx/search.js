import { configure, observable, action } from 'mobx-miniprogram';
import {get} from "../utils/request.js";
import {url} from "../utils/url.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const search = observable({

  // 数据字段
  searchArticles: new Array(),
  bySearchArticles: new Object(),
  searchBoxes:new Array(),
  bySearchBoxes:new Object(),
  searchProducts:new Array(),
  bySearchProducts:new Object(),

  // actions
  search: action(function (value) {
    return new Promise((resolve, reject) => {
      get(url.search(value))
        .then((res) => {
          this.convertSearchResultToPlainStructure(res);
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  }),
  convertSearchResultToPlainStructure:action(function(data){
    let searchArticles=new Array();
    let bySearchArticles= new Object();
    let searchBoxes= new Array();
    let bySearchBoxes= new Object();
    let searchProducts= new Array();
    let bySearchProducts= new Object();
    data.articles.forEach(item=>{
      searchArticles.push(item.uid);
      if(!bySearchArticles[item.uid]){
        const photo = `data:image/jpeg;base64,${item.photo.photo}`;
        bySearchArticles[item.uid]={...item,photo};
      }
    });
    data.products.forEach(item => {
      searchProducts.push(item.uid);
      if (!bySearchProducts[item.uid]) {
        const photo = `data:image/jpeg;base64,${item.photos[0].photo}`;
        bySearchProducts[item.uid] = { ...item, photo,photos:null };
      }
    });
    data.boxes.forEach(item => {
      searchBoxes.push(item.uid);
      if (!bySearchBoxes[item.uid]) {
        const photo = `data:image/jpeg;base64,${item.photos[0].photo}`;
        bySearchBoxes[item.uid] = { ...item, photo, photos: null };
      }
    });
    this.searchArticles=searchArticles;
    this.searchBoxes=searchBoxes;
    this.searchProducts=searchProducts;
    this.bySearchArticles=bySearchArticles;
    this.bySearchBoxes=bySearchBoxes;
    this.bySearchProducts=bySearchProducts;
  })

})
