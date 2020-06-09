import { configure, observable, action } from 'mobx-miniprogram';
import { get, post, _delete,put } from "../utils/request.js";
import { url } from "../utils/url.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const notice = observable({

  // 数据字段
  notifications: new Array(),
  byNotifications: new Object(),

  // 计算属性
  get unreadNotificationNumber() {
    return this.notifications.filter(item=>!this.byNotifications[item].read).length;
  },

  // actions
  clearUnRead:action(function(userId){
    return new Promise((resolve,reject)=>{
      put(url.clearUnRead(userId),{})
        .then(res=>{
          this.setAllRead();
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(err);
        })
    })
  }),
  setAllRead:action(function(){
    let byNotifications=new Object();
    this.notifications.forEach(uid=>{
      if(!byNotifications[uid]){
        byNotifications[uid]={...this.byNotifications[uid],read:true}
      }
    });
    this.byNotifications=byNotifications;
  }),
  readNotification:action(function(noticeId){
    return new Promise((resolve,reject)=>{
      put(url.readNotification(noticeId),{})
        .then(res=>{
          this.setNotificationRead(noticeId);
          resolve(res);
        })
        .catch(err=>{
          console.log(err);
          reject(res);
        })
    })
  }),
  setNotificationRead:action(function(noticeId){
    this.byNotifications={
      ...this.byNotifications,
      [noticeId]:{...this.byNotifications[noticeId],read:true}
    }
  }),
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
    const thiz=this;
    notifications=notifications.filter(uid=>{
      let isRepeat=false;
      thiz.otifications.forEach(item=>{
        if(uid==item){
          isRepeat=true
        }
      });
      return !isRepeat;
    })
    this.notifications=this.notifications.concat(notifications);
    this.byNotifications={...this.byNotifications,...byNotifications};
  }),

})
