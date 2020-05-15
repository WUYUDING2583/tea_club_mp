import {
  configure,
  observable,
  action
} from 'mobx-miniprogram'

// 不允许在动作外部修改状态
configure({
  enforceActions: 'observed'
});

export const user = observable({

  // 数据字段
  userInfo: new Object(),
  token:"",

  // actions
  setUserInfo: action(function(userInfo) {
   this.userInfo=userInfo;
  }),
  setToken:action(function(token){
    this.token=token;
  })

})