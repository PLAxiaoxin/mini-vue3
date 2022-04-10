import { render } from "./render";
import { createVNode } from "./vnode";

/*
 * @Author: your name
 * @Date: 2022-04-10 15:25:40
 * @LastEditTime: 2022-04-10 16:17:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mini-vue3/src/runtime-core/createApp.ts
 */
export function createApp(rootComponent:any){
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



