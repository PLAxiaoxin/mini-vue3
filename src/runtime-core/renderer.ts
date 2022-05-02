import { effect } from '../reactivity/effect';
import { EMPTY_OBJ } from '../shared';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from "./component";
import { shouldUpdateComponent } from './componentUpdateUtils';
import { createAppAPI } from './createApp';
import { queueJobs } from './scheduler';
import { Fragment, Text } from "./vnode"

export function createRenderer(options){
  console.log('createRenderer ------ 创建renderer渲染器对象')
  const { 
    createElement: hostCreateEleemnt, 
    patchProp: hostPatchProp, 
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options;

  function render(vnode, container){
    console.log('render ----- 调用render,触发patch')
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
    console.log('processFragment ------ 处理Fragment节点');
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
      // 老的比新的长
      while(i <= e1){
        hostRemove(c1[i].el);
        // 这里取不到 parent 导致无法删除子节点
        i++;
      }
    } else{
      // 中间乱序处理
      let s1 = i;
      let s2 = i;
      
      const toBePatched = e2 - s2 + 1;
      let patched = 0;
      let moved = false;
      let maxNewIndexSoFar = 0;

      const keyToNewIndexMap = new Map();
      const  newIndexToOldIndexMap = Array(toBePatched);
      for( let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;

      for( let i = s2; i <= e2; i++){
        const nextChild = c2[i];
        keyToNewIndexMap.set(nextChild.key, i);
      }

      for( let i = s1; i <= e1; i++){
        const prveChild = c1[i];
        let newIndex;

        if(patched >= toBePatched){
          hostRemove(prveChild.el);
          continue;
        }

        if(prveChild.key != null){
          newIndex = keyToNewIndexMap.get(prveChild.key);
        } else {
           for (let j = s2; j <= e2; j++) {
             if(isSomeVNodeType(prveChild, c2[j])){
               newIndex = j;
               break;
             }
           }
        }
        if(newIndex === undefined){
          hostRemove(prveChild.el);
        } else {
          if(newIndex >= maxNewIndexSoFar){
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }

          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          patch(prveChild, c2[newIndex], container, parentComponent, null);
          patched++;
        }
      }

      // 获取最长递增子序列
      const increasingNewIndexSequence =  moved 
        ? getSequence(newIndexToOldIndexMap) 
        : [];
      let j = increasingNewIndexSequence.length - 1;
      for(let i = toBePatched -1; i >= 0; i--){
        const nextIndex = i + s2;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;

        // 新节点在老的里面不存在，就创建新的
        if(newIndexToOldIndexMap[i] === 0){
          patch(null, nextChild, container, parentComponent, anchor);
        }else if(moved){
          if( j < 0 || i !== increasingNewIndexSequence[j]){
            hostInsert(nextChild.el,container,anchor);
            console.log("移动位置");
          } else {
            j--;
          }
        }
      }
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
    console.log('processComponent ----- 处理组件类型节点')
    // 挂载组件
    if(!n1){
      mountComponent(n2, container, parentComponent,anchor);
    } else {
      updateComponent(n1, n2);
    }
  }

  function updateComponent(n1, n2){
    const instance = (n2.component = n1.component);
    if(shouldUpdateComponent(n1, n2)){
      instance.next = n2;
      instance.update();
    } else{
      n2.el = n1.el;
      instance.vnode = n2;
    }
  }

  function mountComponent(initialVNode,container, parentComponent, anchor){
    // 创建组件实例
    const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent));
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }

  function setupRenderEffect(instance, vnode, container, anchor){
    instance.update = effect(()=>{
      if(!instance.isMounted){
        console.log("init", instance);
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
        const { next, vnode} = instance;
        if(next){
          next.el = vnode.el;
          updateComponentPrvRender(instance, next);
        }
        const { proxy } = instance; 
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        // 更新存储的 subTree
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance, anchor);
      }
    },{
      scheduler(){
        console.log("update - scheduler");
        queueJobs(instance.update);
      }
    })
    
  }

  return {
    createApp: createAppAPI(render)
  }
}

function updateComponentPrvRender(instance, nextVNode){
  instance.vnode = nextVNode;
  instance.next = null;
  // 更新实例对象的props
  instance.props = nextVNode.props;
}

function getSequence(arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}