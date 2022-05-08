import { ShapeFlags } from "../shared/ShapeFlags";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");
export { createVNode as createElementVNode };

export function createVNode(type, props?, children?){
  const  vnode = {
    type,
    props,
    children,
    component: null,
    key: props && props.key,
    shapeFlag: getShapeFlag(type),
    el: null
  }
  //  children
  if(typeof vnode.children === "string"){
    // vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN 这和下面的写法是一个意思
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if(Array.isArray(vnode.children)){
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }

  // 组件 + object 类型组合就是 slots 类型
  if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
    if(typeof children === "object"){
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}

function getShapeFlag(type){ 
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}


export function createTextVnode(text: string){
  return createVNode(Text, {}, text);
}
