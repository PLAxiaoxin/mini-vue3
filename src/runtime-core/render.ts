import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container){
  // patch 
  // 
  patch(vnode, container)
}


function patch(vnode, container){
  // 判断是不是 element
  processElement() 
  // 处理组件
  processComponent(vnode, container)
}

function processElement(){}
function processComponent(vnode, container){
  // 挂载组件
  mountComponent(vnode,container);
}

function mountComponent(vnode,container){
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
