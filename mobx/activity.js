import { configure, observable, action } from 'mobx-miniprogram'
import {url} from "../utils/url.js";
import { get } from "../utils/request.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const activity = observable({

  // 数据字段
  activities: [],
  byActivities: {},
  readingActivity:{},

 

  // actions

  //获取文章详情和参与活动内容
  fetchReadingActivity: action(function () {
    return new Promise((resolve,reject)=>{
      get(url.fetchReadingActivity())
        .then(res=>{
          this.convertReadingActivityToPlainStructure(res);
          return resolve(res);
        })
    })
  }),
  convertReadingActivityToPlainStructure: action(function (data) {
    this.readingActivity = data;
  })

})
