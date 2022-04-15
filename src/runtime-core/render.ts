import { ShapeFlags } from '../shared/ShapeFlags';
import { isObject } from './../shared/index';
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container){
  // patch 
  patch(vnode, container)
}


function patch(vnode, container){
  // 判断是不是 element
  const { shapeFlag } = vnode;
  if(shapeFlag & ShapeFlags.ELEMENT){
    processElement(vnode, container)
  } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
    // 处理组件
    processComponent(vnode, container)
  }
}

function processElement(vnode, container){
  mountElement(vnode, container)
}

function mountElement(vnode, container){
 // 创建节点，创建属性，挂载节点
 const el = (vnode.el = document.createElement(vnode.type));
 let { children, shapeFlag } = vnode;
 if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
  el.textContent = children;
 } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
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
  setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(instance, vnode, container){
  const { proxy } = instance; 
  const subTree = instance.render.call(proxy);
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)

  // 这里可以确认element 都处理完成
  vnode.el = subTree.el;
}
