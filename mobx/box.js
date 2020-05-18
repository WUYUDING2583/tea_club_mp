import { configure, observable, action } from 'mobx-miniprogram';
import {url} from "../utils/url.js";
import { get } from "../utils/request.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const box = observable({

  // 数据字段
  hotBoxes: new Array(),
  boxes: new Array(),

  // actions
  fetchHotBoxes: action(function () {
    get(url.fetchHotBoxes())
    .then(res=>{
      this.convertBoxesToPlainStructure(res);
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
