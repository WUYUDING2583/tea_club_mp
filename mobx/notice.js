import { configure, observable, action } from 'mobx-miniprogram';
import { get, post, _delete } from "../utils/request.js";
import { url } from "../utils/url.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const notice = observable({

  // 数据字段
  notifications: new Array(),
  byNotifications: new Object(),

  // 计算属性
  get unreadNotificationNumber() {
    return this.notifications.filter(item=>!item.isRead).length;
  },

  // actions
  fetchUnreadNotifications: action(function (userId) {
    return new Promise((resolve, reject) => {
      get(url.fetchUnreadNotifications(userId))
        .then(res => {
          this.convertNotificationsToPlainStructure(res);
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })

  }),
  fetchNotifications:action(function(userId,page){
    return new Promise((resolve,reject)=>{
      get(url.fetchNotifications(userId,page))
        .then(res=>{
          this.convertNotificationsToPlainStructure(res);
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  }),
  convertNotificationsToPlainStructure:action(function(data){
    let notifications=new Array();
    let byNotifications=new Object();
    data.forEach((item)=>{
      notifications.push(item.uid);
      if(!byNotifications[item.uid]){
        byNotifications[item.uid]=item;
      }
    });
    this.notifications=notifications;
    this.byNotifications=byNotifications;
  }),

})
