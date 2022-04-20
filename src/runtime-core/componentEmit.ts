import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance, event, ...agrs){
  const { props } = instance;

  // TPP
  // 先去实现一个特定行为 -》重构成通用行为
  // add -> Add
  // add-foo AddFoo
  
  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...agrs);
}
