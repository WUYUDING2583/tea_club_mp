import {
  configure,
  observable,
  action
} from 'mobx-miniprogram'
import { get,post } from "../utils/request.js";
import { url } from "../utils/url.js";
import {app as appActions} from "./app.js";

// 不允许在动作外部修改状态
configure({
  enforceActions: 'observed'
});

const app=getApp();

export const user = observable({

  // 数据字段
  userInfo: new Object(),
  phone:"",

  // actions
  setUserInfo: action(function(userInfo) {
   this.userInfo={...this.userInfo,...userInfo};
  }),
  setPhoneNumber: action(function (phoneNumber){
    this.phone = phoneNumber;
  }),
  getUserInfo:action(function(){
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setUserInfo(res.userInfo);
            }
          })
        } else {
          this.setData({
            bottomModalVisible: true
          });
        }
      }
    });
  }),
  //获取短信验证码
  getVerifyCode:action(function(phone){
    appActions.startUpdateRequest();
    return new Promise((resolve,reject)=>{
      get(url.getVerifyCode(phone),false)
        .then((res)=>{
          appActions.finishUpdateRequest();
          return resolve();
        })
    })
  }),
  //用户登录
  login:action(function(phone,verifyCode){
    appActions.startRetrieveRequest();
    post(url.login(phone,verifyCode),{},false)
      .then((res)=>{
        appActions.finishRetrieveRequest();
        //注册成功，将phone存入storage
        wx.setStorageSync('phone', phone);
        this.setPhoneNumber(phone);
        this.setUserInfo(res);
        wx.navigateBack({
          delta: 1,
        })
      })
      .catch((err)=>{
        appActions.finishRetrieveRequest();
        console.log(err);
        if(err.code==500204){
          //未注册用户,跳转到注册页面
          wx.redirectTo({
            url: '../register/index',
          })
        }
      })
  }),
  //用户注册
  register:action(function(verifyCode,params){
    appActions.startRetrieveRequest();
    const thiz=this;
    post(url.register(params.contact,verifyCode),params,false)
      .then((res)=>{
        console.log("register",res);
        appActions.finishRetrieveRequest();
        //注册成功，将phone存入storage
        wx.setStorageSync('phone', params.contact);
        thiz.setPhoneNumber(params.contact);
        thiz.setUserInfo(res);
        wx.navigateBack({
          delta: 1,
        })
      })
      .catch(err => {
        appActions.finishRetrieveRequest();
      })
  }),
  //根据手机号获取用户信息
  getUserInfoByPhone:action(function(phone){
    // const thiz=
    get(url.getUserInfoByPhone(phone))
      .then((res)=>{
        this.setUserInfo(res);
        this.setPhoneNumber(phone);
      })
      .catch(err=>{
        console.log(err);
      })
  })

})