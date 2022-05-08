import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root,options = {}){
	const context = createTransformContext(root, options);
	// 1. 深度优先遍历
	traverseNode(root, context);
	// 2. 修改text content
	createCodegenNode(root);
	// root.codegenNode

	root.helpers = [...context.helpers.keys()];
}

function createCodegenNode(root){
	const child = root.children[0];
	if(child.type === NodeTypes.ELEMENT){
		root.codegenNode = child.codegenNode;
	} else {
		root.codegenNode = root.children[0];
	}
}

function createTransformContext(root, options){
	const context = {
		root,
		nodeTransforms: options.nodeTransforms || [],
		helpers: new Map(),
		helper(key){
			context.helpers.set(key, 1);
		}
	}

	return context;
}

function traverseNode(node: any, context){
	const nodeTransforms = context.nodeTransforms;
	// 进入的时候收集函数
	const exitFns:any = [];
	for(let i = 0; i < nodeTransforms.length; i++){
		let tansform = nodeTransforms[i];
		const onExit = tansform(node, context);
		if(onExit) exitFns.push(onExit);
	}

	switch (node.type) {
		case NodeTypes.INTERPOLATION:
			context.helper(TO_DISPLAY_STRING);
			break;
		case NodeTypes.ROOT:
		case NodeTypes.ELEMENT:
			traverseChildren(node, context);
		default:
			break;
	}

	// 退出的时候，实行先进的先执行，后进的后执行
	let i = exitFns.length;
	while(i--){
		exitFns[i]();
	}
}

function traverseChildren(node, context){
	const children = node.children;
	for( let i = 0; i < children.length; i++){
		const node = children[i];
		traverseNode(node, context);
	}
}