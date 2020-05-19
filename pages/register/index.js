// pages/register/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { user } from "../../mobx/user.js";
import { showToast } from "../../utils/request.js";
import { app as appActions } from "../../mobx/app.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    verifyCode:"",
    name:"",
    id:"",
    countDown:false,
    time:5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo'],
      actions: ['getVerifyCode', 'register'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: appActions,
      fields: ['retrieveRequestQuantity', 'updateRequestQuantity']
    }); 

  },
  //注册
  _register:function(){
    const {phone,verifyCode,name,id}=this.data;
    if(phone.length==0||verifyCode.length==0||name.length==0||id.length==0){
      showToast("信息不能为空！");
      return;
    }
    var phoneRegex = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneRegex.test(phone)){
      showToast("手机号码格式错误");
      return;
    }
    var idRegex = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    if(!idRegex.test(id)){
      showToast("身份证格式错误");
      return;
    }
    const gender=this.data.userInfo.gender;
    const params = { contact: phone, name, identityId:id,gender};
    this.register(verifyCode,params);
  },

  //获取验证码
  _getVerifyCode: function () {
    //校验手机号
    var phoneRegex = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (phoneRegex.test(this.data.phone)) {
      this.getVerifyCode(this.data.phone)
        .then((res) => {
          this.setData({
            countDown: true,
          })
          const thiz = this;
          var timer = setInterval(function () {
            const time = thiz.data.time;
            thiz.setData({
              time: time - 1
            })
            if (time <= 0) {
              clearInterval(timer);
              thiz.setData({
                time: 5,
                countDown: false
              })
            }
          }, 1000)
        })
    } else {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 2500,
        mask: true,
      })
    }

  },

  phoneInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  verifyCodeInput: function (e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  idInput: function (e) {
    this.setData({
      id: e.detail.value
    })
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