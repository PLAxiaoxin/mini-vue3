export function transform(root,options){
	const context = createTransformContext(root, options);
	// 1. 深度优先遍历
	traverseNode(root, context);
	// 2. 修改text content

}

function createTransformContext(root, options){
	const context = {
		root,
		nodeTransforms: options.nodeTransforms || []
	}

	return context;
}

function traverseNode(node: any, context){
	console.log(node);
	const nodeTransforms = context.nodeTransforms;
	for(let i = 0; i < nodeTransforms.length; i++){
		let tansform = nodeTransforms[i];
		tansform(node);
	}

	traverseChildren(node, context);
}

function traverseChildren(node, context){
	const children = node.children;
	if(children){
		for( let i = 0; i < children.length; i++){
			const node = children[i];
			traverseNode(node, context);
		}
	}
}