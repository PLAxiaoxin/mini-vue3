import { publicInstanceProxyHandlers } from './componentPublicInstance';
 export function createComponentInstance(vnode){
   const component = {
     vnode,
     type: vnode.type,
     setupState: {}
   }

   return component;
 }

 export function setupComponent(instance){
  //  TODO
  // initProps()
  // initSlots()

  // 处理有状态的组件
  setupStatefulComponent(instance);
 }

 function setupStatefulComponent(instance){
   const  Component = instance.type;
  //  ctx
  instance.proxy = new Proxy({a: instance}, publicInstanceProxyHandlers)
  const { setup } = Component;

  if(setup){
    const setupResult = setup();
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
