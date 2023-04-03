import { getCurrentInstance } from "./component";

export function provide(key, val){
  const currentInstance: any = getCurrentInstance();
  if(currentInstance){
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent.provides;

    // init 
    if(provides === parentProvides){
      // 通过原型链继承父组件的 provides，实现如果当前组件有对应的provide 就是用自己的。没有就用父组件的
      provides = currentInstance.provides = Object.create(parentProvides);
    } 
    provides[key] = val;
  }
}

export function inject(key, defaultVal){
  const currentInstance: any = getCurrentInstance();
  if(currentInstance){
    const parentProvides = currentInstance.parent.provides;
    if(key in parentProvides){
      return parentProvides[key];
    } else if(defaultVal){
      // inject 支持参数为函数
      if(typeof defaultVal === "function"){
        return defaultVal();
      }
      return defaultVal;
    }
  }
}
