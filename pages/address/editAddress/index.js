// pages/address/editAddress/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { user } from '../../../mobx/user';
import { app as appActions } from "../../../mobx/app.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:"",
    region: ['浙江省', '杭州市', '西湖区'],
    detail:"",
    isDefaultAddress:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo', 'phone'],
      actions: ['saveAddress'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: appActions,
      fields: ['retrieveRequestQuantity'],
    }); 

  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  nameInput:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  detailInput: function (e) {
    this.setData({
      detail: e.detail.value
    })
  },
  isDefaultChange:function(e){
    this.setData({
      isDefaultAddress:e.detail.value
    })
  },
  save:function(){
    const { userInfo, name, phone, region, detail, isDefaultAddress}=this.data;
    const params = { name, phone, detail, isDefaultAddress,province:region[0],city:region[1],district:region[2],customer:{uid:userInfo.uid}};
    this.saveAddress(params);
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
    this.storeBindings.destroyStoreBindings()

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