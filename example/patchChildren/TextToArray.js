// 老的是 Text 
// 新的是 Array
import { h, ref } from "../../lib/guide-mini-vue.esm.js";

const nextChildren = [h("div", {}, "A"),h("div", {}, "B")];
const prevChildren = "oldChildren";

export default {
	name: "TextToArray",
	setup(){
		const isChange = ref(false);
		window.isChange = isChange;

		return {
			isChange
		}
	},

	render(){
		const self = this;
		return self.isChange === true
			? h("div", {}, nextChildren)
			: h("div", {}, prevChildren)
	}
}

