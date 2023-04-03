import { Dep } from './effect';
import { hasChanged, isObject } from '@guide-mini-vue/shared';
import { reactive } from './reactive';

class RefImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
  public __v_isRef = true;
  constructor(value) {
    this._rawValue = value;
    this._value = covert(value);
    this.dep = new Dep();
  }

  get value() {
    this.dep.depend();
    return this._value;
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      // 必须先修改，再通知
      this._rawValue = newVal;
      this._value = covert(newVal);
      this.dep.notice();
    }
  }
}

function covert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWhitRef) {
  return new Proxy(objectWhitRef, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      // 对象的当前值为ref，set的值不是ref时，直接赋值
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
