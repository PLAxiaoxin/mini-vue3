import { h, createTextVnode } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "app",
  // render
  render(){
    const app = h("div", {}, "App");
    // 单个 vnode
    // const foo = h(Foo, {}, [h("p", {}, "123"),h("p", {}, "456")]);
    // 多个vnode
    // const foo = h(Foo, {}, [h("p", {}, "123"),h("p", {}, "456")]);
    // 指定位置的vnode  使用 object key 
    const foo = h(Foo, {}, {
      header: ({age}) => [h("p", {}, "header" + age),
      createTextVnode("你好")],
      footer: ()=> h("p", {}, "footer")
    });
    return h("div", {},[app, foo]
    );
  },
  setup(){
    // composition api
    return {}
  }
}
