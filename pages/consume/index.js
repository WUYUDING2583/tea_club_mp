// pages/consume/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { user } from "../../mobx/user.js";
import { app as appActions } from "../../mobx/app.js";
import { showToast } from "../../utils/request.js";

var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    page:0,
    isBottom:false,
    refresh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo','bills','byBills'],
      actions: ['fetchBills','getUserInfoByPhone'],
    });

  },


  refresh: function () {
    const { userInfo } = this.data;
    this.setData({
      refresh: true
    })
    this.fetchBills(userInfo.uid, 0)
      .then(res=>{
        this.setData({
          refresh:false
        })
      })
      .catch(err => {
        showToast(err.error);
      })
    this.setData({
      page:0
    })

  },


  scrollToBottom: function () {
    console.log("scrollToBottom")
    const { page, isBottom, userInfo } = this.data;
    if (!isBottom) {
      this.fetchBills(userInfo.uid, page + 1)
        .then(res => {
          if (res.length == 0) {
            //没有了
            showToast("没有更多了...");
            this.setData({
              isBottom: true,
            })
          } else {
            this.setData({
              page: page + 1
            })
          }
        })
        .catch(err => {
          showToast(err.error);
        })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const { userInfo,page } = this.data;
    if(userInfo.uid){
      this.getUserInfoByPhone(userInfo.contact)
        .catch(err => {
          showToast(err.error);
        })
      this.fetchBills(userInfo.uid,page)
        .catch(err => {
          showToast(err.error);
        })
    }else{
      wx.navigateTo({
        url: '../login/index',
      })
    }
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()

  },

})