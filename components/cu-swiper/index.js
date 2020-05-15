// components/cu-swiper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperList:Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    cardCur: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // cardSwiper
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
  }
})
