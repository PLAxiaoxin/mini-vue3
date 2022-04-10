import { createComponentInstance, setupComponent } from "./component";

/*
 * @Author: your name
 * @Date: 2022-04-10 16:16:55
 * @LastEditTime: 2022-04-10 16:47:24
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mini-vue3/src/runtime-core/render.ts
 */
export function render(vnode, container){
  // patch 
  // 
  patch(vnode, container)
}


function patch(vnode, container){
  // 判断是不是 element
  // 处理组件
  processComponent(vnode, container)
}

function processComponent(vnode, container){
  // 挂载组件
  mountComponent(vnode,container);
}

function mountComponent(vnode){
  // 创建组件实例
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance,container);
}

function setupRenderEffect(instance,container){
  const subTree = instance.render();
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)
}
