// request.js
export const get=(url,needLoading=true)=>{
  if(needLoading){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete(res) {
        wx.hideLoading();
        console.log(`request ${url} res`, res.data);
        if (res.data.data.status == 404) {
          showToast("404,资源不存在");
          reject("404,资源不存在");
        }
        if(res.data.code!=200){
          showToast(res.data.error);
          reject(res.data);
        }
        resolve(res.data.data);
      }
    })
  })

}

export const post = (url, params={},needLoading = true) => {
  if (needLoading) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method:"POST",
      data: params,
      complete(res) {
        wx.hideLoading();
        console.log(`request ${url} res`, res.data);
        if (res.data.data == null && res.data.code != 200){
          if (res.data.code != 500700 && res.data.code != 500600){
            console.log("show toast err in post");
            showToast(res.data.error);
          }
          reject(res.data);
          return;
        }
        if (res.data.data.status&&res.data.data.status == 404) {
          showToast("404,资源不存在");
          reject("404,资源不存在");
          return;
        }
        resolve(res.data.data);
      }
    })
  })

}

export const _delete = (url, params={}, needLoading = true) => {
  if (needLoading) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "DELETE",
      data: params,
      complete(res) {
        wx.hideLoading();
        console.log(`request ${url} res`, res.data);
        if (res.data.data == null && res.data.code != 200) {
          if (res.data.code != 500700 && res.data.code != 500600) {
            console.log("show toast err in post");
            showToast(res.data.error);
          }
          reject(res.data);
          return;
        }
        if (res.data.data.status && res.data.data.status == 404) {
          showToast("404,资源不存在");
          reject("404,资源不存在");
          return;
        }
        resolve(res.data.data);
      }
    })
  })

}


export const put = (url, params={}, needLoading = true) => {
  if (needLoading) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "PUT",
      data: params,
      complete(res) {
          wx.hideLoading();
        console.log(`request ${url} res`, res.data);
        if (res.data.data == null && res.data.code != 200) {
          if (res.data.code != 500700 && res.data.code != 500600) {
            console.log("show toast err in post");
            showToast(res.data.error);
          }
          reject(res.data);
          return;
        }
        if (res.data.data.status && res.data.data.status == 404) {
          showToast("404,资源不存在");
          reject("404,资源不存在");
          return;
        }
        resolve(res.data.data);
      }
    })
  })

}

// 添加请求toast提示
export const showToast = title => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 1500,
    mask: true
  });
}
