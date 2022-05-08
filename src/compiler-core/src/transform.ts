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
	root.codegenNode = root.children[0];
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
	for(let i = 0; i < nodeTransforms.length; i++){
		let tansform = nodeTransforms[i];
		tansform(node);
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
}

function traverseChildren(node, context){
	const children = node.children;
	for( let i = 0; i < children.length; i++){
		const node = children[i];
		traverseNode(node, context);
	}
}