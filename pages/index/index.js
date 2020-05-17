import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  user
} from '../../mobx/user';
import {
  url
} from "../../utils/url.js";
import {app as appActions} from "../../mobx/app.js";
import {product} from "../../mobx/product.js";
import {box} from "../../mobx/box.js";
import {cart} from "../../mobx/cart.js";

const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 1,
    drawerVisible: false,
    bottomModalVisible: false,
    scrollLeft: 0
  },
  onLoad: function() {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo'],
      actions: ['setUserInfo', 'setPhoneNumber'],
    }); 
    this.storeBindings = createStoreBindings(this, {
      store: appActions,
      fields: ['retrieveRequestQuantity', 'updateRequestQuantity','swiperList'],
      actions: ['fetchSwiperList'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: product,
      fields: ['byProducts', 'hotProducts'],
      actions: ['fetchHotProducts'],
    }); 
    this.storeBindings = createStoreBindings(this, {
      store: box,
      fields: ['hotBoxes'],
      actions: ['fetchHotBoxes'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: cart,
      fields: ['cartTotal'],
    });
    const thiz=this;

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

    // //获取走马灯展示
    this.fetchSwiperList();
    //获取热销产品
    this.fetchHotProducts();
    //获取热门包厢
    this.fetchHotBoxes();
  },
  //用户确定登录
  getPhoneNumber(e) {
    //发送到后台解密
    // console.log("login")
    // const thiz = this;
    // wx.request({
    //   url: url.decryptPhoneNumber(e.detail.encryptedData),
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success(res) { //后台传回包含用户电话号码的用户信息
    //     console.log("success res", res);
    //     if (res.statusCode == 200) {
    //       thiz.setUserInfo(res.data);
    //       thiz.setPhoneNumber(res.data.contact);
    //     } else { //若解析失败贼只获取用户微信信息
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log("user info", res.userInfo);
    //           thiz.setUserInfo(res.userInfo);
    //         }
    //       })
    //     }
    //   },
    //   fail(res) { //若解析失败贼只获取用户微信信息
    //     console.log("fail res", res);
    //     wx.getUserInfo({
    //       success: res => {
    //         console.log("user info", res.userInfo);
    //         thiz.setUserInfo(res.userInfo);
    //       }
    //     })
    //   }
    // })
  },
  getUserInfo:function(e){
    this.setUserInfo(e.detail.userInfo);
    this.setData({
      bottomModalVisible: false
    })
  },
  hideBottomModal() {
    this.setData({
      bottomModalVisible: false
    })
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  showDrawer() {
    this.setData({
      drawerVisible: true
    })
  },
  hideDrawer() {
    this.setData({
      drawerVisible: false
    })
  },
  request() {
    // 测试request
    wx.request({
      url: url.test(), //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
      },
      complete: function() {
        console.log("request complete")
      }
    })
  }
})