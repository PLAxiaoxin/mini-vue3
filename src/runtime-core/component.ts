/*
 * @Author: your name
 * @Date: 2022-04-10 16:24:49
 * @LastEditTime: 2022-04-10 16:41:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mini-vue3/src/runtime-core/component.ts
 */
 export function createComponentInstance(vnode){
   const component = {
     vnode,
     type: vnode.type
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
   if(!Component.render){
     instance.render = Component.render;
   }
 }
