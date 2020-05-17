import { configure, observable, action } from 'mobx-miniprogram'
import {url} from "../utils/url.js";
import {app} from "./app.js";

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
    app.startRetrieveRequest();
    let thiz = this;
    return new Promise(function(resolve,reject){
      wx.request({
        url: url.fetchReadingActivity(),
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log("fetch reading activity res", res);
          thiz.convertReadingActivityToPlainStructure(res.data.data);
          resolve(thiz.readingActivity);
        },
        complete() {
          app.finishRetrieveRequest();
        }
      })
    })
  }),
  convertReadingActivityToPlainStructure: action(function (data) {
    // let readingActivity=this.readingActivities;
    // let byActivities=this.byActivities;
    // if (readingActivities.indexOf(data.uid)==-1){
    //   readingActivities.push(data.uid);
    // }
    // byActivities[data.uid]=data;
    this.readingActivity = data;
    // this.byActivities=byActivities;
  })

})
