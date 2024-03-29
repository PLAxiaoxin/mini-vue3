import { getDep } from './effect';
import { ReactiveFlags, reactive, readonly } from './reactive';
import { isObject, extend } from '@guide-mini-vue/shared';

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

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key ${key} 是 readonly 类型无法修改`);
    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
