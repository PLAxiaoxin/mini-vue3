import { effect } from '../reactivity/effect';
import { EMPTY_OBJ } from '../shared';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from './createApp';
import { Fragment, Text } from "./vnode"

export function createRenderer(options){
  const { 
    createElement: hostCreateEleemnt, 
    patchProp: hostPatchProp, 
    insert: hostInsert 
  } = options;
  function render(vnode, container){
    // patch 
    patch(null,vnode, container, null);
  }

  // n1 老的节点， n2 新的节点
  function patch(n1, n2, container, parentComponent){
    const { shapeFlag, type } = n2; 
    switch (type) {
      case Fragment:
        // Fragment 只渲染 所有的children
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container)
      break;
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){
          // 渲染 element
          processElement(n1, n2, container, parentComponent)
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
          // 处理组件
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }
  }

  function processText(n1, n2, container){
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(n1, n2, container, parentComponent){
    mountChildren(n2, container, parentComponent)
  }

  function processElement(n1, n2, container, parentComponent){
    if(!n1){
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function patchElement(n1, n2, container){
    console.log(n1, n2, "patchElement");
    // TODO 
    // props
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    // 因为在下次再过来时，n2 会变成n1
    const el = (n2.el = n1.el);
    patchProps(el, oldProps, newProps);
    // children
    // patchChildren()
  }

  function patchProps(el, oldProps, newProps){
    if(oldProps !== newProps){
      for (const key in newProps) {
        const prevProps = oldProps[key];
        const nextProps = newProps[key];
  
        if(prevProps !== nextProps){
          hostPatchProp(el, key, prevProps, nextProps);
        }
      }
  
      // 旧key 不在新props中，就删除
      if(oldProps !== EMPTY_OBJ){
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  function mountElement(vnode, container, parentComponent){
    // 创建节点，创建属性，挂载节点
    const el = (vnode.el = hostCreateEleemnt(vnode.type));
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
      hostPatchProp(el, key, null, val);
    }
    //  container.append(el);
    hostInsert(el, container);
  }

  function mountChildren(vnode, container, parentComponent){
    vnode.children.forEach(v => {
      patch(null, v, container, parentComponent);
    });
  }


  function processComponent(n1,n2, container, parentComponent){
    // 挂载组件
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(vnode,container, parentComponent){
    // 创建组件实例
    const instance = createComponentInstance(vnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
  }

  function setupRenderEffect(instance, vnode, container){
    effect(()=>{
      if(!instance.isMounted){
        console.log("init");
        const { proxy } = instance; 
        const subTree = (instance.subTree = instance.render.call(proxy));
        // vnode -> patch
        // vnode -> element -> mountElement
        patch(null,subTree, container, instance);

        // 这里可以确认element 都处理完成
        vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance; 
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        // 更新存储的 subTree
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance);
      }
    })
    
  }

  return {
    createApp: createAppAPI(render)
  }
}
