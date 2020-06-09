// pages/searchResult/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { search } from "../../mobx/search.js";
import { article } from "../../mobx/article.js";
import { shop } from "../../mobx/shop.js";
import { showToast } from "../../utils/request.js";

var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    value:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      value:options.value
    })
    this.storeBindings = createStoreBindings(this, {
      store: search,
      fields: ['searchArticles','bySearchArticles','searchProducts','bySearchProducts','searchBoxes','bySearchBoxes'],
      actions:['search']
    });
    this.storeBindings = createStoreBindings(this, {
      store: article,
      fields: [],
      actions:['fetchArticle']
    });
    this.storeBindings = createStoreBindings(this, {
      store: shop,
      fields: [],
      actions: ['getShop']
    }); 

  },

  _search:function(e){
    const { value } = e.detail;
    this.search(value)
      .catch(err => {
        showToast(err.error);
      })
  },

  navigateToArticleDetail:function(e){
    const uid=e.currentTarget.dataset.target;
    this.fetchArticle(uid)
      .then(res=>{
        wx.navigateTo({
          url: `../article/articleDetail/index?uid=${uid}`,
        })
      })
      .catch(err=>{
        showToast(err.error);
      })
  },

  navigateToProductDetail: function (e) {
    const uid = e.currentTarget.dataset.target;
    wx.navigateTo({
      url: `../product/productDetail/index?uid=${uid}`,
    })
  },

  navigateToBoxDetail: function (e) {
    const { bySearchBoxes } = this.data;
    const boxId = e.currentTarget.dataset.target;
    const shopId=bySearchBoxes[boxId].shop.uid;
    this.getShop(shopId)
      .then(res => {
        wx.navigateTo({
          url: `../box/boxDetail/index?boxId=${boxId}&shopId=${shopId}`,
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()

  },

})