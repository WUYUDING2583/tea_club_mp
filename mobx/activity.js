import { configure, observable, action } from 'mobx-miniprogram'
import {url} from "../utils/url.js";
import { get } from "../utils/request.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const activity = observable({

  // 数据字段
  activities: new Array(),
  byActivities: new Object(),
  readingActivityRule:new Array(),
  byActivityRules:new Object(),

 

  // actions

  //获取文章详情和参与活动内容
  fetchReadingActivity: action(function () {
    return new Promise((resolve,reject)=>{
      get(url.fetchReadingActivity())
        .then(res=>{
          const data=this.convertReadingActivityToPlainStructure(res);
          resolve(data);
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  }),
  convertReadingActivityToPlainStructure: action(function (data) {
    let activityRules=new Array();
    let byActivityRules=new Object();
    data.activityRules.forEach(item=>{
      activityRules.push(item.uid);
      if(!byActivityRules[item.uid]){
        byActivityRules[item.uid]=item;
      }
    })
    this.readingActivityRule = activityRules;
    this.byActivityRules=byActivityRules;
    return { activityRules, byActivityRules};
  })

})
