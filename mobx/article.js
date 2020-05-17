import { configure, observable, action } from 'mobx-miniprogram';
import { url } from "../utils/url.js";
import { app } from "./app.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const article = observable({

  // 数据字段
  articles: new Array(),
  byArticles:new Object(),

  // actions
  fetchArticles: action(function () {
    app.startRetrieveRequest();
    const thiz = this;
    wx.request({
      url: url.fetchArticles(),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("fetch articles res", res);
        thiz.convertArticlesToPlainStructure(res.data.data);
      },
      complete() {
        app.finishRetrieveRequest();
      }
    })
  }),
  convertArticlesToPlainStructure:action(function(data){
    let articles=new Array();
    let byArticles=new Object();
    data.forEach(article=>{
      articles.push(article.uid);
      if(!byArticles[article.uid]){
        byArticles[article.uid]={
          ...article,
          photo: `data:image/jpeg;base64,${article.photo.photo}`
        }
      }
    });
    this.articles=articles;
    this.byArticles=byArticles;
  })

})
