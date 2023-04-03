import { createVNode } from "./vnode";

export function createAppAPI(render){
  return function createApp(rootComponent:any){
    return {
      mount(rootContainer:any){ 
        // 先生产vnde
        // component -> vnode   -> 
        // 所有逻辑操作都会基于vnode 去处理
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer); 
      }
    }
  }
}




