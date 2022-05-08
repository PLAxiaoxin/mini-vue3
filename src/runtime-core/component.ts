import { shallowReadonly } from '../reactivity/reactive';
import { proxyRefs } from '../reactivity/ref';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { publicInstanceProxyHandlers } from './componentPublicInstance';
import { initSlots } from './componentSlot';
 export function createComponentInstance(vnode, parent){
   const component = {
     vnode,
     type: vnode.type,
     setupState: {},
     props: {},
     slots:{},
     next: null,
     provides: parent ? parent.provides : {},
     parent,
     isMounted: false,
     subTree: {},
     emit: ()=>{}
   }
  //  以下写法儿，可以实现默认传参
   component.emit = emit.bind(null, component) as any;
   return component;
 }

 export function setupComponent(instance){
  //  TODO
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  // 处理有状态的组件
  setupStatefulComponent(instance);
 }

 function setupStatefulComponent(instance){
   const  Component = instance.type;
  //  ctx
  instance.proxy = new Proxy({_: instance}, publicInstanceProxyHandlers)
  const { setup } = Component;

  if(setup){
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props),{
      emit: instance.emit
    });
    setCurrentInstance(null);
    handleSetupResult(instance,setupResult);
  }
 }

 function handleSetupResult(instance,setupResult){
  // TODO
  // function 那就是组件的render函数
  // Object 就把对象注入组件上下文

  if(typeof setupResult === "object"){
    instance.setupState = proxyRefs(setupResult);
  }

  finishComponentSetup(instance)
 }


 function finishComponentSetup(instance){
  const Component = instance.type;
   if(compiler && !Component.render){
      if(Component.template){
        Component.render = compiler(Component.template);
      }
   }
   
   // template
   instance.render = Component.render;
 }

 let currentInstance = null;
 export function getCurrentInstance(){
  return currentInstance;
 }


 export function setCurrentInstance(instance){
  currentInstance = instance;
 }

 let compiler;
 export function registerRuntimeCompiler(_compiler){
  compiler = _compiler;
 }
