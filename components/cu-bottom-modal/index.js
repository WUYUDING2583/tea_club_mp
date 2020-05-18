// components/cu-bottom-modal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    },
    hideModal:{
      type:Function,
      value:()=>{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModal:function(){
      this.triggerEvent('hideModal', {})
    }
  }
})
