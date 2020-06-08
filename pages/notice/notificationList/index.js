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
    page:0,
    modalName: "",
    noticeId: null,
    isBottom:false
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
      actions: ['fetchNotifications', 'readNotification','clearUnRead']
    });

  },

  scrollToBottom:function(){
    const { page, isBottom,userInfo}=this.data;
    if(!isBottom){
      this.fetchNotifications(userInfo.uid,page+1)
        .then(res=>{
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
        .catch(err=>{
          showToast(err.error);
        })
    }
  },

  _clearUnRead:function(){
    const {userInfo,notifications,byNotifications}=this.data;
    const unreadNotice=notifications.filter(uid=>!byNotifications[uid].read);
    if(unreadNotice.length>0){
      this.clearUnRead(userInfo.uid)
        .catch(err => {
          showToast(err.error);
        })
    }else{
      wx.showToast({
        title: '全都是已读的哦',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    }
  },

  _readNotification:function(e){
    this.setData({
      modalName:"noticeModal",
      noticeId: e.currentTarget.dataset.target
    });
    this.readNotification(e.currentTarget.dataset.target)
      .catch(err=>{
        showToast(err.error);
      })
  },

  hideModal:function(){
    this.setData({
      modalName:"",
      noticeId:null
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const {userInfo,page}=this.data;
    this.fetchNotifications(userInfo.uid,page)
      .catch(err=>{
        showToast(err.error);
      })
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