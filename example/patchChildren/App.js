import { h } from "../../lib/guide-mini-vue.esm.js";

import ArrayToText from "./ArrayToText.js";
import TextToText from "./TextToText.js";
import TextToArray from "./TextToArray.js";
import ArrayToArray from "./ArrayToArray.js";

export default {
	name: "App",
	setup(){
		
	},
	render(){
		return h("div", { tId: 1},[
			h("p", {}, "主页"),
			// 老的是 Array, 新的的节点是 Text
			// h(ArrayToText)
			// 老的是 Text, 新的的节点是 Text
			// h(TextToText)
			// 老的是 Text, 新的的节点是 Array
			h(TextToArray)
			// 老的是 Array, 新的的节点是 Array
			// h(ArrayToArray)
		])
	}
}