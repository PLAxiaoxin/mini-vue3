import { h } from "../../lib/guide-mini-vue.esm.js";
export const App = {
  // render
  render(){
    return h("div", {
      id: "id",
      class: [ "red", "hard"]
    },[
      h("p", {
        class: "p1"
      }, "hi p1"),
      h("p", {
        class: "p2"
      },"hi p2")
    ]);
  },
  setup(){
    // composition api
    return {
      msg: "mini vue"
    }
  }
}
