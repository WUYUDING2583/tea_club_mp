// pages/article/articleList/index.js
import {createStoreBindings} from 'mobx-miniprogram-bindings';
import { article } from "../../../mobx/article.js";
import { app as appActions } from "../../../mobx/app.js";

const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ColorList: app.globalData.ColorList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: article,
      fields: ['articles','byArticles'],
      actions: ['fetchArticles'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: appActions,
      fields: ['retrieveRequestQuantity', 'updateRequestQuantity'],
    });

    //获取文章列表
    this.fetchArticles()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      this.storeBindings.destroyStoreBindings();
  },

})