import { createVNode, Fragment } from "../vnode";

export function renderSlots (slots, name, props){
  //  return vnode
  const slot = slots[name];
  if(slot){
    if(typeof slot === "function"){
      // 只需要渲染 children
      return createVNode(Fragment, {}, slot(props));
    }
  }
}
