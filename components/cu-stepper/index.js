// components/cu-stepper/index.js
import {showToast} from "../../utils/request.js";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    number:{
      type:Number,
      value:0
    },
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
    },
    option:{
      type:[Number,String],
      value:0
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
    add:function(){
      const {number,max,step,option}=this.data;
      console.log("max",max)
      if(number<max){
        this.setData({
          number: number + step
        })
        var changeDetail = { number: number + step,option } // detail对象，提供给事件监听函数
        var changeOption = {} // 触发事件的选项
        this.triggerEvent('change', changeDetail, changeOption)
      }else{
        showToast("不能再多咯");
      }
      
    },
    minus:function(){
      const { number,min,step,option } = this.data;
      if(number>min){
        this.setData({
          number: number - step
        })
        var changeDetail = { number: number - step,option } // detail对象，提供给事件监听函数
        var changeOption = {} // 触发事件的选项
        this.triggerEvent('change', changeDetail, changeOption)
      } else {
        showToast("不能再少咯");
      }
    }
  }
})
