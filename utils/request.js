// request.js
import {app} from "../mobx/app.js";

export const get=(url)=>{
  app.startRetrieveRequest();
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete(res) {
        app.finishRetrieveRequest();
        console.log(`request ${url} res`, res.data);
        if(res.data.code!=200){
          showToast(res.data.error);
          reject(res.data);
        }
        resolve(res.data.data);
      }
    })
  })

}

// 添加请求toast提示
const showToast = title => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2500,
    mask: true
  });
}
