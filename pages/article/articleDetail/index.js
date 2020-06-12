// pages/article/articleDetail/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { activity } from "../../../mobx/activity.js";
import { article } from "../../../mobx/article.js";
import { app as appActions } from "../../../mobx/app.js";
import { user } from "../../../mobx/user.js";
import { balance } from "../../../mobx/balance.js";
import { showToast } from "../../../utils/request.js";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId: null,
    StatusBar: app.globalData.StatusBar,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      articleId: options.uid
    });
    this.storeBindings = createStoreBindings(this, {
      store: article,
      fields: ['byArticles'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: appActions,
      fields: ['retrieveRequestQuantity', 'updateRequestQuantity'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo', 'phoneNumber'],
      actions: ['activityPresentMoney'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: balance,
      fields: ['credit', 'ingot'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: activity,
      fields: ['readingActivityRule', 'byActivities', 'byActivityRules'],
      actions: ['fetchReadingActivity'],
    });


  },
  startKeepTime: function (data) {
    this.storeBindings.updateStoreBindings();
    const thiz=this;
    const { userInfo}=this.data;
    const { byActivityRules, activityRules}=data
    console.log("byActivityRules", byActivityRules)
    console.log("activityRules", activityRules)
    let isApplicable=false;
    if (activityRules.length>0) {
      if(userInfo.uid){
        console.log("start loop")
        activityRules.forEach((uid)=>{
          byActivityRules[uid].activityApplyForCustomerTypes.forEach(item=>{
            if (userInfo.customerType.uid ==item.uid) {
              isApplicable = uid;
            }
          })
        })
      }else{
        console.log("未登录")
      }
    }
    console.log("isApplicable", isApplicable);
    if(isApplicable){
      setTimeout(function(){
        console.log("add");
        let amount=new Object();
        if(byActivityRules[isApplicable].activityRule2.currency=="ingot"){
          amount = { ingot: byActivityRules[isApplicable].activityRule2.number,credit:0}
        } else {
          amount = { credit: byActivityRules[isApplicable].activityRule2.number, ingot: 0 }
        }
        thiz.activityPresentMoney(userInfo.uid,amount)
      }, byActivityRules[isApplicable].activityRule1*1000)
    }
  },

  onReady: function () {
    const thiz = this;
    //获取阅读活动
    this.fetchReadingActivity()
      .then(res => {
        thiz.startKeepTime(res);
      })
      .catch(err => {
        console.log(err);
        showToast(err.error);
      })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();
  },

})