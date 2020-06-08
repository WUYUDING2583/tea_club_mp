// pages/notice/notificationList/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { notice } from "../../../mobx/notice.js";
import { user } from "../../../mobx/user.js";
import { showToast } from "../../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo'],
      actions: []
    });
    this.storeBindings = createStoreBindings(this, {
      store: notice,
      fields: ['notifications','byNotifications'],
      actions: ['fetchNotifications']
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const {userInfo,page}=this.data;
    this.setData({
      userInfo:{uid:17}
    })
    this.fetchNotifications(17, page)
      .catch(err => {
        showToast(err.error);
      })
    // this.fetchNotifications(userInfo.uid,page)
    //   .catch(err=>{
    //     showToast(err.error);
    //   })
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