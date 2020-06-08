// pages/address/editAddress/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { user } from '../../../mobx/user';
import { app as appActions } from "../../../mobx/app.js";
import { showToast } from '../../../utils/request';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:"",
    region: ['浙江省', '杭州市', '西湖区'],
    detail:"",
    isDefaultAddress:false,
    addressId:null,
    modalName:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.addressId){
      this.setData({
        addressId: options.addressId
      })
    }
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo','byAddresses'],
      actions: ['saveAddress', 'fetchAddress','deleteAddress'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: appActions,
      fields: ['retrieveRequestQuantity'],
    }); 


  },

  showModal:function(){
    this.setData({
      modalName:"deleteModal"
    })
  },

  hideModal:function(){
    this.setData({
      modalName:""
    })
  },

  _deleteAddress:function(){
    const {addressId}=this.data;
    this.hideModal();
    this.deleteAddress(addressId)
      .then(res=>{
        wx.navigateBack({
          delta: 1,
        })
      })
      .catch(err=>{
        showToast(err.error);
      })
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
    const { userInfo, name, phone, region, detail, isDefaultAddress,addressId}=this.data;
    const params = { uid:addressId,name, phone, detail, isDefaultAddress,province:region[0],city:region[1],district:region[2],customer:{uid:userInfo.uid}};
    this.saveAddress(params);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const {addressId,byAddresses}=this.data;
    if(addressId){
      this.fetchAddress(addressId)
        .then(() => {
          this.setData({
            name:byAddresses[addressId].name,
            phone: byAddresses[addressId].phone,
            region: [byAddresses[addressId].province, byAddresses[addressId].city, byAddresses[addressId].district],
            detail: byAddresses[addressId].detail,
            isDefaultAddress: byAddresses[addressId].isDefaultAddress,
          })
        })
        .catch(err => {
          showToast(err.error);
        })
    }
    
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