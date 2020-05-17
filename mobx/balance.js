import { configure, observable, action } from 'mobx-miniprogram';
import {app} from "./app.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const balance = observable({

  // 数据字段
  ingot: 0,
  credit: 0,

  // 计算属性
  

  // actions
  addIngot: action(function (userId,ingot) {
    app.startRetrieveRequest();
    const thiz = this;
    wx.request({
      url: url.addIngot(userId,ingot),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("add ingot res", res);
        thiz.ingot+=res.data.data;
      },
      complete() {
        app.finishRetrieveRequest();
      }
    })
  }),
  addCredit: action(function (userId, credit) {
    app.startRetrieveRequest();
    const thiz = this;
    wx.request({
      url: url.addCredit(userId, credit),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("add credit res", res);
        thiz.credit += res.data.data;
      },
      complete() {
        app.finishRetrieveRequest();
      }
    })
  })

})
