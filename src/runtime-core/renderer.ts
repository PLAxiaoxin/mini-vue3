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
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options;
  function render(vnode, container){
    // patch 
    patch(null,vnode, container, null, null);
  }

  // n1 老的节点， n2 新的节点
  function patch(n1, n2, container, parentComponent, anchor){
    const { shapeFlag, type } = n2; 
    switch (type) {
      case Fragment:
        // Fragment 只渲染 所有的children
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, container)
      break;
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){
          // 渲染 element
          processElement(n1, n2, container, parentComponent, anchor)
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
          // 处理组件
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break;
    }
  }

  function processText(n1, n2, container){
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(n1, n2, container, parentComponent, anchor){
    mountChildren(n2.children, container, parentComponent, anchor)
  }

  function processElement(n1, n2, container, parentComponent, anchor){
    if(!n1){
      mountElement(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor){
    // props
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    // 因为在下次再过来时，n2 会变成n1
    const el = (n2.el = n1.el);
    patchProps(el, oldProps, newProps);
    // children
    patchChildren(n1, n2, el, parentComponent, anchor);
  }

  function patchChildren(n1, n2, container, parentComponent, anchor){
    const prevShapeFlag = n1.shapeFlag;
    const { shapeFlag } = n2;
    const c1 = n1.children;
    const c2 = n2.children;
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
      if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
        // 1. 把老的 children 清空
        unmountChilren(n1.children);
      } 

      if(c1 !== c2){
        hostSetElementText(container, c2);
      }
    } else {
      if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        //  array to array  diff 算法
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor){
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length -1;
    let e2 = l2 -1;

    function isSomeVNodeType(n1, n2){
      return n1.type === n2.type && n1.key == n2.key;
    }

    // 左侧对比
    while(i <= e1 && i <= e2){
      const n1 = c1[i];
      const n2 = c2[i];
      
      if(isSomeVNodeType(n1, n2)){
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }

    // 右侧对比
    while(i <= e1 && i <= e2){
      const n1 = c1[e1];
      const n2 = c2[e2];
      console.log(n1, n2);
      if(isSomeVNodeType(n1, n2)){
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    // 新的比老的长 创建
    if(i > e1){
      if(i <= e2){
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        while(i <= e2){
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if(i > e2){
      while(i <= e1){
        hostRemove(c1[i].el);
        // 这里取不到 parent 导致无法删除子节点
        i++;
      }
    } else{
      // 乱序处理
    }
  }

  function unmountChilren(children){
    for( let i = 0; i < children.length; i++){
      const el = children[i].el;
      // remove
      hostRemove(el);
    }
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

  function mountElement(vnode, container, parentComponent, anchor){
    // 创建节点，创建属性，挂载节点
    const el = (vnode.el = hostCreateEleemnt(vnode.type));
    let { children, shapeFlag } = vnode;
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
      el.textContent = children;
    } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
      mountChildren(vnode.children, el, parentComponent, anchor);
    }
    // props
    const { props } = vnode;
    
    for( const key in props){
      let val = props[key];
      hostPatchProp(el, key, null, val);
    }
    //  container.append(el);
    hostInsert(el, container, anchor);
  }

  function mountChildren(children, container, parentComponent, anchor){
    children.forEach(v => {
      patch(null, v, container, parentComponent, anchor);
    });
  }


  function processComponent(n1,n2, container, parentComponent,anchor){
    // 挂载组件
    mountComponent(n2, container, parentComponent,anchor);
  }

  function mountComponent(vnode,container, parentComponent, anchor){
    // 创建组件实例
    const instance = createComponentInstance(vnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container, anchor);
  }

  function setupRenderEffect(instance, vnode, container, anchor){
    effect(()=>{
      if(!instance.isMounted){
        console.log("init");
        const { proxy } = instance; 
        const subTree = (instance.subTree = instance.render.call(proxy));
        // vnode -> patch
        // vnode -> element -> mountElement
        patch(null,subTree, container, instance, anchor);

        // 这里可以确认element 都处理完成
        vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update", instance);
        const { proxy } = instance; 
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        // 更新存储的 subTree
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance, anchor);
      }
    })
    
  }

  return {
    createApp: createAppAPI(render)
  }
}
