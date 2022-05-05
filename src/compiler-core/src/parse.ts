import { NodeTypes } from "./ast";

const enum TagType{
	Start,
	End
}

export function baseParse(content: string){
	const context = createParserContext(content);
	return createRoot(parseChildren(context, []));
}

function parseChildren(context, ancestors){
	const nodes:any = [];
	
	while(!isEnd(context, ancestors)){
		let node;
		let s = context.source;
		if(s.startsWith("{{")){
			node = parseInterPolation(context)
		} else if(s[0] === "<"){
			if(/[a-z]/i.test(s[1])){
				node = parseElement(context, ancestors);
			}
		}

		if(!node){
			node = parseText(context);
		}
		nodes.push(node);
	}

	return nodes;
}

function isEnd(context, ancestors){
	// 解析结束的条件
	// 1. soure 有值
	// 2. 遇到结束标签

	let s = context.source;
	for( let i = ancestors.length - 1; i >= 0; i--){
		const tag = ancestors[i].tag;
		if(startsWithEndTagOpen(s, tag)){
			return true;
		}
	}
	return !s;
}

function parseText(context){
	let endIndex = context.source.length;
	let endTokens = ["<","{{"];
	for(let i = 0; i < endTokens.length; i++){
		let index = context.source.indexOf(endTokens[i]);
		if(index !== -1 && endIndex > index){
			endIndex = index;
		}
	}
	
	// 1. 获取content
	let content = parseTextData(context, endIndex);
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

function parseElement(context, ancestors){
	const element: any = parseTag(context, TagType.Start);
	ancestors.push(element);
	element.children = parseChildren(context, ancestors);
	ancestors.pop();
	if(startsWithEndTagOpen(context.source, element.tag)){
		parseTag(context, TagType.End);
	} else {
		throw new Error(`缺少结束标签: ${element.tag}`);
	}
	
	return element;
}

function startsWithEndTagOpen(source, tag){
	return source.startsWith("</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase();
}

function parseTag(context, type: TagType){
	// \/? 匹配斜杠可有可无
	const match:any = /^<\/?([a-z]*)/i.exec(context.source);
	// 解析tag
	const tag = match[1];
	advanceBy(context,match[0].length);
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

	advanceBy(context, closeDelimiter.length);
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