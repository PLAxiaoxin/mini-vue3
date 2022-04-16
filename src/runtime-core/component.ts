import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { publicInstanceProxyHandlers } from './componentPublicInstance';
 export function createComponentInstance(vnode){
   const component = {
     vnode,
     type: vnode.type,
     setupState: {},
     props: {},
     emit: ()=>{}
   }
  //  以下写法儿，可以实现传参
   component.emit = emit.bind(null, component) as any;
   return component;
 }

 export function setupComponent(instance){
  //  TODO
  initProps(instance, instance.vnode.props)
  // initSlots()

  // 处理有状态的组件
  setupStatefulComponent(instance);
 }

 function setupStatefulComponent(instance){
   const  Component = instance.type;
  //  ctx
  instance.proxy = new Proxy({_: instance}, publicInstanceProxyHandlers)
  const { setup } = Component;

  if(setup){
    const setupResult = setup(shallowReadonly(instance.props),{
      emit: instance.emit
    });
    handleSetupResult(instance,setupResult);
  }
 }

 function handleSetupResult(instance,setupResult){
  // TODO
  // function 那就是组件的render函数
  // Object 就把对象注入组件上下文

  if(typeof setupResult === "object"){
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance)
 }


 function finishComponentSetup(instance){
   const Component = instance.type;
  //  if(Component.render){
     instance.render = Component.render;
  //  }
 }
