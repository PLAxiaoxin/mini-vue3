import { h } from '../../dist/guide-mini-vue.esm.js';
import { Foo } from './Foo.js';

window.self = null;
export const App = {
  name: 'app',
  // render
  render() {
    window.self = this;
    return h(
      'div',
      {
        id: 'id',
        class: ['red', 'hard'],
        // onClick(){
        //   console.log("click");
        // },
        // onMousedown(){
        //   console.log("mousedown");
        // }
      },
      // Array
      // [
      //   h("p", {
      //     class: "p1"
      //   }, "hi p1"),
      //   h("p", {
      //     class: "p2"
      //   },"hi p2")
      // ]
      // string
      // "hi " + this.msg
      [h('div', {}, 'hi ' + this.msg)],
    );
  },
  setup() {
    // composition api
    return {
      msg: 'mini vue',
    };
  },
};
