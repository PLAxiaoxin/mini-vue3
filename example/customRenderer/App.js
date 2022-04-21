import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  name: "app",
  render(){
    return h("rect", {
      x: this.x,
      y: this.y
    });
  },
  setup(){
    return {
	x: 100,
	y: 100
    }
  }
}
