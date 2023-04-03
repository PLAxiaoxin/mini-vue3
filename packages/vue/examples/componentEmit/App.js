import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

window.self = null;
export const App = {
  name: "app",
  // render
  render(){
    window.self = this;
    return h("div", {
      id: "id",
      class: [ "red", "hard"],
    },
    [h(Foo,{
      onAdd(a,b){
        console.log("onAdd", a, b);
      },
      // add-foo addFoo
      onAddFoo(){
        console.log("onAddFoo")
      }
    })]

    );
  },
  setup(){
    // composition api
    return {
      msg: "mini vue"
    }
  }
}
