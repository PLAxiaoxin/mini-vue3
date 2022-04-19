import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "app",
  // render
  render(){
    return h("div", {},[h("p", {},"currentInstance demo"), h(Foo)]);
  },
  setup(){
    const instance = getCurrentInstance();
    console.log("App", instance);
    // composition api
    return {}
  }
}
