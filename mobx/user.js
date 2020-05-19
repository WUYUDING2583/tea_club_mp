import {
  configure,
  observable,
  action
} from 'mobx-miniprogram'
import { get,post } from "../utils/request.js";
import { url } from "../utils/url.js";
import {app} from "./app.js";

// 不允许在动作外部修改状态
configure({
  enforceActions: 'observed'
});

export const user = observable({

  // 数据字段
  userInfo: new Object(),
  phoneNumber:"",

  // actions
  setUserInfo: action(function(userInfo) {
   this.userInfo=userInfo;
  }),
  setPhoneNumber: action(function (phoneNumber){
    this.phoneNumber = phoneNumber;
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
    app.startUpdateRequest();
    return new Promise((resolve,reject)=>{
      get(url.getVerifyCode(phone),false)
        .then((res)=>{
          app.finishUpdateRequest();
          return resolve();
        })
    })
  }),
  //用户登录//15868859587
  login:action(function(phone,verifyCode){
    app.startRetrieveRequest();
    post(url.login(phone,verifyCode),{},false)
      .then((res)=>{
        app.finishRetrieveRequest();//TODO 登录成功
        wx.navigateBack({
          
        });
        resolve();
      })
      .catch((err)=>{
        app.finishRetrieveRequest();
        console.log(err);
        if(err.code==500204){
          //未注册用户,跳转到注册页面
          wx.redirectTo({
            url: '../register/index',
          })
        }
      })
  }),

})