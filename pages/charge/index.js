// pages/charge/index.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { user } from "../../mobx/user.js";
import { showToast } from "../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkbox: [{
      value: 50,
      name: '50元',
      checked: false,
    }, {
      value: 100,
      name: '100元',
      checked: false,
    }, {
      value: 200,
      name: '200元',
      checked: false,
    }, {
      value: 500,
      name: '500元',
      checked: false,
    }, {
      name: "自定义",
      checked: false,
      value: -1,

    }],

  },
  _charge: function () {
    const { charge, userInfo } = this.data;
    const thiz = this;
    this.charge(charge, userInfo.uid)
      .then(res => {
        showToast("充值成功");
      })
      .catch(err => {

      })
  },
  chargeInput: function (e) {
    let items = this.data.checkbox;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].name == "自定义") {
        items[i].value = e.detail.value;
      }
    }
    this.setData({
      charge: e.detail.value,
      checkbox: items
    })
  },
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    this.setData({
      charge: values
    })
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = true;
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      checkbox: items
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: user,
      fields: ['userInfo', 'byAddresses'],
      actions: ['charge', 'pay']
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.storeBindings.destroyStoreBindings();

  },

})