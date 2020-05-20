// components/cu-stepper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    max:{
      type:Number,
      value:Infinity
    },
    min:{
      type:Number,
      value:-Infinity
    },
    step:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    number:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    add:function(){
      const {number,max,step}=this.data;
      console.log("max",max)
      if(number<max){
        this.setData({
          number: number + step
        })
        var changeDetail = { number: number + step } // detail对象，提供给事件监听函数
        var changeOption = {} // 触发事件的选项
        this.triggerEvent('change', changeDetail, changeOption)
      }
      
    },
    minus:function(){
      const { number,min,step } = this.data;
      if(number>min){
        this.setData({
          number: number - step
        })
        var changeDetail = { number: number - step } // detail对象，提供给事件监听函数
        var changeOption = {} // 触发事件的选项
        this.triggerEvent('change', changeDetail, changeOption)
      }
    }
  }
})
