/*
 * @Author: your name
 * @Date: 2022-04-09 23:18:56
 * @LastEditTime: 2022-04-10 20:39:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mini-vue3/src/reactivity/baseHandlers.ts
 */
import { getDep } from "./effect";
import { ReactiveFlags, reactive, readonly } from "./reactive";
import { isObject, extend } from "../shared";

// 缓存第一次创建的
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, shallowReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);

    // 判断是否是 reactive
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    // 只处理最外层的对象
    if (shallowReadonly) {
      return res;
    }

    // 对象嵌套转换
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    // 是reactive 才进行收集
    if (!isReadonly) {
      // TODO  收集依赖
      const dep = getDep(target, key);
      dep.depend();
    }

    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    const dep = getDep(target, key);
    // TODO 触发依赖
    dep.notice();
    return res;
  };
}

export const mutableHndlers = {
  get,
  set
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key ${key} 是 readonly 类型无法修改`);
    return true;
  }
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});
