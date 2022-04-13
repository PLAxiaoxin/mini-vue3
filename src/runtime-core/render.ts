import { isObject } from './../shared/index';
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container){
  // patch 
  patch(vnode, container)
}


function patch(vnode, container){
  // 判断是不是 element
  if(typeof vnode.type === "string"){
    processElement(vnode, container)
  } else if(isObject(vnode.type)){
    // 处理组件
    processComponent(vnode, container)
  }
}

function processElement(vnode, container){
  mountElement(vnode, container)
}

function mountElement(vnode, container){
 // 创建节点，创建属性，挂载节点
 const el = document.createElement(vnode.type);
 let { children } = vnode;
 if(typeof children === "string"){
  el.textContent = children;
 } else if(Array.isArray(children)){
  mountChildren(children, el);
 }
 // props
 const { props } = vnode;
 
 for( const key in props){
   let val = props[key];
   el.setAttribute(key, val);
 }
 container.append(el);
}

function mountChildren(vnode, container){
  vnode.forEach(v => {
    patch(v, container);
  });
}


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
