import { configure, observable, action } from 'mobx-miniprogram'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const cart = observable({

  // 数据字段
  cartProducts: new Array(),

  // 计算属性
  get cartTotal() {
    let total=0;
    this.cartProducts.forEach(product=>{
      total+=product.number;
    })
    return total;
  },

  // actions
  update: action(function () {
    const sum = this.sum
    this.numA = this.numB
    this.numB = sum
  })

})
