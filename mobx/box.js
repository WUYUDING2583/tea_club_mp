import { configure, observable, action } from 'mobx-miniprogram';
import {app} from "./app.js";
import {url} from "../utils/url.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const box = observable({

  // 数据字段
  hotBoxes: new Array(),
  boxes: new Array(),

  // actions
  fetchHotBoxes: action(function () {
    app.startRetrieveRequest();
    const thiz = this;
    wx.request({
      url: url.fetchHotBoxes(),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("hot box res", res);
        thiz.convertBoxesToPlainStructure(res.data.data);
      },
      complete() {
        app.finishRetrieveRequest();
      }
    })
  }),
  convertBoxesToPlainStructure:action(function(data){
    let hotBoxes = new Array();
    data.forEach(item => {
      hotBoxes.push({
        ...item.box, number: item.number, photo: `data:image/jpeg;base64,${item.box.photos[0].photo}`
      });
    });
    this.hotBoxes = hotBoxes;
  })

})
