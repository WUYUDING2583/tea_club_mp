// pages/article/articleDetail/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { activity } from "../../../mobx/activity.js";
import { article } from "../../../mobx/article.js";
import { app as appActions } from "../../../mobx/app.js";
import { user } from "../../../mobx/user.js";
import { balance } from "../../../mobx/balance.js";

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
      store: activity,
      fields: ['readingActivity', 'byActivities'],
      actions: ['fetchReadingActivity'],
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

    const thiz=this;
    //获取阅读活动
    this.fetchReadingActivity()

  },
  startKeepTime: function () {
    this.storeBindings.updateStoreBindings();
    const thiz=this;
    const { userInfo, readingActivity}=this.data;
    let isApplicable=false;
    if (readingActivity != null) {
      if(userInfo.uid){
        readingActivity.activityApplyForCustomerTypes.forEach(function(item){
          if(item.uid==userInfo.customerType.uid){
            isApplicable=true;
          }
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
        if(readingActivity.activityRule2.currency=="ingot"){
          amount = { ingot: readingActivity.activityRule2.number,credit:0}
        } else {
          amount = { credit: readingActivity.activityRule2.number, ingot: 0 }
        }
        thiz.activityPresentMoney(userInfo.uid,amount)
      }, readingActivity.activityRule1*1000)
    }
  },

  onReady:function(){
    this.startKeepTime();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();
  },

})