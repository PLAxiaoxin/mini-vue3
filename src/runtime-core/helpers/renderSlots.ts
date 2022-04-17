import { createVNode } from "../vnode";

export function renderSlots (slots, name, props){
  //  return vnode
  const slot = slots[name];
  if(slot){
    if(typeof slot === "function"){
      return createVNode("div", {}, slot(props));
    }
  }
}
