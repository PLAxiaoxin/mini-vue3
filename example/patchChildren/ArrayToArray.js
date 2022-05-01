// 老的是 Array 
// 新的是 Array
import { h, ref } from "../../lib/guide-mini-vue.esm.js";

// 1. 左侧对比
// (a, b) c
// (a, b) d, e
// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C"),
// ];

// const nextChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "D"}, "D"),
// 	h("p", {key: "E"}, "E"),
// ];

// 2.右侧对比
// a (b, c)
// d, e (b, c)

// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C"),
// ];

// const nextChildren = [
// 	h("p", {key: "D"}, "D"),
// 	h("p", {key: "E"}, "E"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C"),
// ];

// 3.新的比老的长
// 创建新的
// (a b)
// (a b) c
// 左侧
// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B")
// ];

// const nextChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C"),
// 	h("p", {key: "D"}, "D")
// ];

// 右侧
// (a b)
// c (a b)
// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B")
// ];

// const nextChildren = [
// 	h("p", {key: "D"}, "D"),
// 	h("p", {key: "C"}, "C"),
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// ];

// 4.老的比新的长
// 删除老的
// (a b) c d
// (a b)
// 左侧
// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C"),
// 	h("p", {key: "D"}, "D")
// ];

// const nextChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B")
// ];

// 右侧
// a (b c)
//  (b c)
// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C")
// ];

// const nextChildren = [
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C")
// ];

// 5. 对比中间部分
// 分三步
// 1. 删除老的 （在老的里面存在，在新的里面不存在）
// 2. 删除新的 （在老的里面不存在，在新的里面存在）
// 3. 移动    （新的，老的里面都有，但是位置改变了）通过最长递增子序列去优化

// 5.1 
// a b (c, d) f g
// a b (e, c) f g 
// D 节点在新的里面没有 - 需要删除
// C 节点的 props 改变了，需要更新
// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C", id: "c-prev"}, "C"),
// 	h("p", {key: "D"}, "D"),
// 	h("p", {key: "F"}, "F"),
// 	h("p", {key: "G"}, "G"),
// ];

// const nextChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "E"}, "E"),
// 	h("p", {key: "C", id: "c-next"}, "C"),
// 	h("p", {key: "F"}, "F"),
// 	h("p", {key: "G"}, "G"),
// ];

// 5.1.1
// a b (c, e, d) f g
// a b (e, c) f g 
// 中间部分，老的比新的多直接删除（优化删除逻辑）
// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C", id: "c-prev"}, "C"),
// 	h("p", {key: "E"}, "E"),
// 	h("p", {key: "D"}, "D"),
// 	h("p", {key: "F"}, "F"),
// 	h("p", {key: "G"}, "G"),
// ];

// const nextChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "E"}, "E"),
// 	h("p", {key: "C", id: "c-next"}, "C"),
// 	h("p", {key: "F"}, "F"),
// 	h("p", {key: "G"}, "G"),
// ];


// 2
// 移动（节点存在于新的和老的里面， 但位置变了）
// a,b,(c,d,e),f,g
// a,b,(e,c,d),f,g
// 最长递增子序列为 [c,d] -> [1,2];

// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C"),
// 	h("p", {key: "D"}, "D"),
// 	h("p", {key: "E"}, "E"),
// 	h("p", {key: "F"}, "F"),
// 	h("p", {key: "G"}, "G"),
// ];

// const nextChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C"),
// 	h("p", {key: "D"}, "D"),
//  h("p", {key: "E"}, "E"),
// 	h("p", {key: "F"}, "F"),
// 	h("p", {key: "G"}, "G"),
// ];


// 3 创建新的节点
// a,b,(c,e),f,g
// a,b,(e,c,d),f,g
// d  节点在老的节点里面不存在，需要创建
// const prevChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "C"}, "C"),
// 	h("p", {key: "E"}, "E"),
// 	h("p", {key: "F"}, "F"),
// 	h("p", {key: "G"}, "G"),
// ];

// const nextChildren = [
// 	h("p", {key: "A"}, "A"),
// 	h("p", {key: "B"}, "B"),
// 	h("p", {key: "E"}, "E"),
// 	h("p", {key: "C"}, "C"),
// 	h("p", {key: "D"}, "D"),
// 	h("p", {key: "F"}, "F"),
// 	h("p", {key: "G"}, "G"),
// ];


// 3 综合例子
// a,b,(c,d,e,z),f,g
// a,b,(d,c,y,e),f,g
// 移动 c,d,E
// 删除 z
// 创建 y
const prevChildren = [
	h("p", {key: "A"}, "A"),
	h("p", {key: "B"}, "B"),
	h("p", {key: "C"}, "C"),
	h("p", {key: "D"}, "D"),
	h("p", {key: "E"}, "E"),
	h("p", {key: "Z"}, "Z"),
	h("p", {key: "F"}, "F"),
	h("p", {key: "G"}, "G"),
];

const nextChildren = [
	h("p", {key: "A"}, "A"),
	h("p", {key: "B"}, "B"),
	h("p", {key: "D"}, "D"),
	h("p", {key: "C", id: "next-c"}, "C"),
	h("p", {key: "Y"}, "Y"),
	h("p", {key: "E"}, "E"),
	h("p", {key: "F"}, "F"),
	h("p", {key: "G"}, "G"),
];

export default {
	name: "ArrayToArray",
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

