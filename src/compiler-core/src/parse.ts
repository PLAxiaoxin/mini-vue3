import { NodeTypes } from "./ast";

const enum TagType{
	Start,
	End
}

export function baseParse(content: string){
	const context = createParserContext(content);
	return createRoot(parseChildren(context));
}

function parseChildren(context){
	const nodes:any = [];
	let node;
	let s = context.source;
	if(s.startsWith("{{")){
		node = parseInterPolation(context)
	} else if(s[0] === "<"){
		if(/[a-z]/i.test(s[1])){
			console.log("parse element");
			node = parseElement(context);
		}
	}

	if(!node){
		node = parseText(context);
	}
	nodes.push(node);
	return nodes;
}

function parseText(context){
	// 1. 获取content
	let content = parseTextData(context, context.source.length);
	return {
		type: NodeTypes.TEXT,
		content
	}
}

function parseTextData(context, length){
	const content = context.source.slice(0, length);
	advanceBy(context, length);
	return content;
}

function parseElement(context){
	const element = parseTag(context, TagType.Start);
	parseTag(context, TagType.End);
	console.log(context.source);
	return element;
}

function parseTag(context, type: TagType){
	// \/? 匹配斜杠可有可无
	const match:any = /^<\/?([a-z]*)/i.exec(context.source);
	// 解析tag
	let tag = match[1];
	advanceBy(context,match[0].length);
	// 删除处理完的代码
	advanceBy(context, 1);
	if(type === TagType.End) return;
	return {
		type: NodeTypes.ELEMENT,
		tag
	}
}

function parseInterPolation(context){
	const openDelimiter = "{{";
	const closeDelimiter = "}}";

	const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);

	advanceBy(context, openDelimiter.length);
	
	const rawContentLength = closeIndex - openDelimiter.length;
	
	const rawcontent = parseTextData(context, rawContentLength);
	const content = rawcontent.trim();

	advanceBy(context, rawContentLength + closeDelimiter.length);
	return {
		type: NodeTypes.INTERPOLATION,
		content: {
			type: NodeTypes.SIMPLE_EXPRESSION,
			content: content
		}
	}
}

function advanceBy(context: any, length: number){
	context.source = context.source.slice(length)
}

function createRoot(children){
	return {
		children
	}
}

function createParserContext(content: string): any{
	return {
		source: content
	}
}