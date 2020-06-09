import { configure, observable, action } from 'mobx-miniprogram';
import {url} from "../utils/url.js";
import { get } from "../utils/request.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const article = observable({

  // 数据字段
  articles: new Array(),
  byArticles:new Object(),

  // actions
  fetchArticle:action(function(articleId){
    return new Promise((resolve,reject)=>{
      get(url.fetchArticle(articleId))
        .then(res=>{
          this.convertArticleToPlainStructure(res);
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  }),
  convertArticleToPlainStructure:action(function(data){
    if(this.articles.indexOf(data.uid)==-1){
      this.articles=this.articles.concat([data.uid]);
    }
    this.byArticles = { ...this.byArticles, [data.uid]: { ...data, photo: `data:image/jpeg;base64,${data.photo.photo}`}}
  }),
  fetchArticles: action(function () {
    get(url.fetchArticles())
    .then((res)=>{
      this.convertArticlesToPlainStructure(res);
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
