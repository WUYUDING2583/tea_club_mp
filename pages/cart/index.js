// pages/cart/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { user } from "../../mobx/user.js";
import { cart } from "../../mobx/cart.js";
import { showToast } from "../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isManagement:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['phone','userInfo'],
    });
    this.storeBindings = createStoreBindings(this, {
      store: cart,
      fields: ['cartProducts', 'byCartProducts', 'cartTotal','isSelectAll'],
      actions: ['fetchCart', 'changeCartProductNumber', 'check',"selectAll",'deleteCartItem']
    });
  },
  //删除购物车内容
  _delete:function(){
    this.deleteCartItem()
      .then(()=>{
        showToast("删除成功")
      })
      .catch(err=>{
        showToast(err.error);
      })
  },
  _check:function(e){
    this.check(e.currentTarget.dataset.target);
  },
  //管理
  manage:function(){
    const {isManagement}=this.data
    this.setData({
      isManagement: !isManagement
    })
  },
  //全选
  _selectAll:function(){
    const { isSelectAll}=this.data
    this.selectAll(!isSelectAll)
  },
  //数量改变事件
  numberChange: function (e) {
    const { detail } = e;
    const { number, option } = detail;
    const {userInfo,byCartProducts}=this.data;
    console.log("detail",detail)
    this.changeCartProductNumber({uid:option,number,customer:{uid:17},product:{uid:byCartProducts[option].product.uid}})
      .catch(err=>{
        showToast(err.error);
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.fetchCart(17);
    // if(this.data.phone.length==0){
    //   //未登录，跳转至登录页面
    //   wx.redirectTo({
    //     url: '../login/index',
    //   })
    // } else {
    //   this.fetchCart(this.data.userInfo.uid);
    // }
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