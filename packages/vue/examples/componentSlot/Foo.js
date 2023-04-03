import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  setup(){
    return {}
  },
  render(){
    const foo = h("p", {}, "foo");
    // 获取foo 组件里面的children
    // 支持传入多个 renderSlots
    // 具名slots
    // 1. 获取渲染的元素
    // 2. 获取渲染的位置
    // 作用域插槽
    console.log(this.$slots);
    const age = 18;
    return h("div",{},[renderSlots(this.$slots,"header",{age}), foo, renderSlots(this.$slots,"footer")]);
  }
}

