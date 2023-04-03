import { generate } from "./codegen";
import { baseParse } from "./parse";
import { transform } from "./transform";
import { transformExpression } from "./transforms/transformExpression";
import { transformElement } from "./transforms/transformsElement";
import { transformText } from "./transforms/transformText";

export function baseCompile(template){
	const ast:any = baseParse(template);
	transform(ast,{
		nodeTransforms: [transformExpression, transformElement, transformText]
	});
	return generate(ast);
}