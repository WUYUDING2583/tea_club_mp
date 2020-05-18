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
    });
    this.storeBindings = createStoreBindings(this, {
      store: balance,
      fields: ['credit', 'ingot'],
      actions: ['addIngot','addCredit'],
    });

    const thiz=this;
    //获取阅读活动
    this.fetchReadingActivity()
      .then((data)=> {
        console.log("after",data);
        thiz.setData({
          readingActivity:data
        })
        thiz.startKeepTime();
      });

  },
  startKeepTime:function(){
    let isApplicable=false;
    if (this.data.readingActivity != null) {
      if(this.data.phoneNumber.length>0){
        this.data.readingActivity.activityApplyForCustomerTypes.forEach(function(item){
          if(item.uid==this.data.userInfo.customerType.uid){
            isApplicable=true;
          }
        })
      }else{
        console.log("未登录")
      }
    }
    if(isApplicable){
      let timer=setTimeout(function(){
        if(this.data.readingActivity.activityRule2.currency=="ingot"){
          this.addIngot(this.data.userInfo.uid, this.data.readingActivity.activityRule2.number);
        }else{
          this.addCredit(this.data.userInfo.uid, this.data.readingActivity.activityRule2.number);
        }
      }, this.data.readingActivity.activityRule1)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})