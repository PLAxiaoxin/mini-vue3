import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode"

export function render(vnode, container){
  // patch 
  patch(vnode, container, null);
}


function patch(vnode, container, parentComponent){
  const { shapeFlag, type } = vnode; 
  switch (type) {
    case Fragment:
      // Fragment 只渲染 所有的children
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container)
     break;
    default:
      if(shapeFlag & ShapeFlags.ELEMENT){
        // 渲染 element
        processElement(vnode, container, parentComponent)
      } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
        // 处理组件
        processComponent(vnode, container, parentComponent)
      }
      break;
  }
}

function processText(vnode, container){
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}

function processFragment(vnode, container, parentComponent){
  console.log(vnode);
  mountChildren(vnode, container, parentComponent)
}

function processElement(vnode, container, parentComponent){
  mountElement(vnode, container, parentComponent)
}

function mountElement(vnode, container, parentComponent){
 // 创建节点，创建属性，挂载节点
 const el = (vnode.el = document.createElement(vnode.type));
 let { children, shapeFlag } = vnode;
 if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
  el.textContent = children;
 } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
  mountChildren(vnode, el, parentComponent);
 }
 // props
 const { props } = vnode;
 
 for( const key in props){
   let val = props[key];
   const isOn = (key: string) => /^on[A-Z]/.test(key);
   if(isOn(key)){
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, val);
   } else {
    el.setAttribute(key, val);
   }
 }
 container.append(el);
}

function mountChildren(vnode, container, parentComponent){
  vnode.children.forEach(v => {
    patch(v, container, parentComponent);
  });
}


function processComponent(vnode, container, parentComponent){
  // 挂载组件
  mountComponent(vnode, container, parentComponent);
}

function mountComponent(vnode,container, parentComponent){
  // 创建组件实例
  const instance = createComponentInstance(vnode, parentComponent);
  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(instance, vnode, container){
  const { proxy } = instance; 
  const subTree = instance.render.call(proxy);
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container, instance)

  // 这里可以确认element 都处理完成
  vnode.el = subTree.el;
}
// 
