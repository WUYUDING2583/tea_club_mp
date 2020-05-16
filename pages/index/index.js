import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  user
} from '../../mobx/user';
import {
  url
} from "../../utils/url.js";

const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 1,
    drawerVisible: false,
    bottomModalVisible: false,
    scrollLeft: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }],
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      badge: 120,
      name: 'VR'
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 1,
      name: '录像'
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '图像'
    }],
  },
  onLoad: function() {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo'],
      actions: ['setUserInfo', 'setPhoneNumber'],
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

    //获取走马灯展示
    wx.request({
      url: url.swiper(), 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        thiz.handleSwiperList(res.data.data);
      }
    })
  },
  //处理获取后台返回的走马灯数据
  handleSwiperList:function(data){
    let swiperList=new Array();
    data.forEach(item=>{
      const url = `data:image/jpeg;base64,${item.photo}`;
      let type="";
      for(var key in item){
        if(key!="photo"&&item[key]!=0){
          type=key.substring(0,key.length-2);
        }
      }
      swiperList.push({uid:item.uid,type,url});
    });
    this.setData({
      swiperList
    })
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