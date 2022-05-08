import { isString } from "../../shared";
import { NodeTypes } from "./ast";
import { CREATE_ELEMENT_VNODE, helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers";

export function generate(ast){
	const context = createCodegenContext();
	const { push } = context;

	genFunctionPreamble(ast, context);

	const functionName = "render";
	const args = ["_ctx", "_cache"];
	const signature = args.join(",");
	push(`function ${functionName}(${signature}){`)
	push("return ");
	genNode(ast.codegenNode, context);
	push("}");

	return{
		code: context.code
	}
}

function genFunctionPreamble(ast, context){
	const { push } = context;
	const VueBinging = "Vue";
	const aliasHelper = (s)=> `${helperMapName[s]}:_${helperMapName[s]}`; 
	if(ast.helpers.length > 0){
		push(`const { ${ast.helpers.map(aliasHelper).join(", ")}} = ${VueBinging}`);
	}
	push("\n");
	push("return ");
}

function genNode(node, context){
	switch (node.type) {
		case NodeTypes.TEXT:
			genText(node, context);
			break;
	  case NodeTypes.INTERPOLATION:
			genInterpolation(node, context);
			break;
		case NodeTypes.SIMPLE_EXPRESSION:
			genExpression(node, context);
			break;
		case NodeTypes.ELEMENT:
			genElement(node, context);
			break;
		case NodeTypes.COMPOUND_EXPRESSION:
			genCompoundExpression(node, context);
		default:
			break;
	}
}

function genText(node, context){
	const { push } = context;
			push(`'${node.content}'`);
}

function genInterpolation(node, context){
	const { push, helper } = context;
	push(`${helper(TO_DISPLAY_STRING)}(`);
	genNode(node.content, context);
	push(")");
}

function genExpression(node, context){
	const { push } = context;
	push(`${node.content}`);
}

function genElement(node, context){
	const { push, helper } = context;
	let { tag, children, props } = node;
	push(`${helper(CREATE_ELEMENT_VNODE)}(`);
	genNodeList(genNullable([tag, props, children]), context);
	push(")");
}

function genNullable(args){
	return args.map((arg)=> arg || "null")
}

function genNodeList(nodes, context){
	const { push } = context;
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if(isString(node)){
			push(node);
		} else {
			genNode(node, context);
		}
		if(i < nodes.length -1){
			push(", ")
		}
	}
}

function genCompoundExpression(node, context){
	let { push } = context;
	let children = node.children;
	for (let i = 0; i < children.length; i++) {
		let child = children[i];
		if(isString(child)){
			push(child);
		} else {
			genNode(child, context);
		}
		
	}
}

function createCodegenContext(){
	const context = {
		code: "",
		push(source){
			context.code += source;
		},
		helper(key){
			return `_${helperMapName[key]}`
		}
	}

	return context;
}