// pages/login/index.js
import {createStoreBindings} from 'mobx-miniprogram-bindings'
import { user } from "../../mobx/user.js";
import { app as appActions } from "../../mobx/app.js";
import {get} from "../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottomModalVisible:false,
    phone:"",
    verifyCode:"",
    time:5,
    countDown:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo'],
      actions: ['setUserInfo', 'setPhoneNumber','getVerifyCode','login'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: appActions,
      fields: ['retrieveRequestQuantity','updateRequestQuantity'],
      actions: ['startRetrieveRequest', 'startUpdateRequest', 'finishRetrieveRequest','finishUpdateRequest'],
    }); 
  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  verifyCodeInput: function (e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },

  //获取验证码
  _getVerifyCode:function(){
    //校验手机号
    var phoneRegex = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(phoneRegex.test(this.data.phone)){
      this.getVerifyCode(this.data.phone)
      .then((res)=>{
        this.setData({
          countDown:true,
        })
        const thiz=this;
        var timer=setInterval(function(){
          const time = thiz.data.time;
          thiz.setData({
            time: time - 1
          })
          if(time<=0){
            clearInterval(timer);
            thiz.setData({
              time:5,
              countDown:false
            })
          }
        },1000)
      })
    }else{
     wx.showToast({
       title: '手机号格式错误',
       icon: 'none',
       duration: 2500,
       mask: true,
     })
    }
    
  },
  //点击登录
  _login:function(){
    const {phone,verifyCode}=this.data;
    console.log("login",phone,verifyCode);
    this.login(phone,verifyCode);
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
    this.storeBindings.destroyStoreBindings()

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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