import { ShapeFlags } from "../shared/ShapeFlags";

export function createVNode(type, props?, children?){
  const  vnode = {
    type,
    props,
    children,
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
  return vnode;
}

function getShapeFlag(type){ 
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}
