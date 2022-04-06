import { extend } from "../shared";

let activeEffect: any = null; // 存储当前的effect
let targetMap = new Map(); // 依赖存储
let shouldTrack: boolean = false; // 判断是否要收集yilai

class Reactive {
  private _fn: any;
  public scheduler: Function | undefined;
  onStop?: () => void;
  deps = []; // 获取存储 activeEffect 的 dep
  active = true; // 判断stop状态，禁止多次调用stop
  constructor(fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    // stop 没执行时，直接执行
    if (!this.active) {
      return this._fn();
    }

    //  stop 开启了，那就禁止收集依赖。然后再恢复之前的功能；重置 shouldTrack
    shouldTrack = true;
    activeEffect = this;
    const result = this._fn();
    //  reset
    shouldTrack = false;
    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.subscribe.delete(effect);
  });
  effect.length = 0;
}

class Dep {
  private subscribe = new Set();

  depend() {
    if (!isTracking()) return;
    if (this.subscribe.has(activeEffect)) return;
    this.subscribe.add(activeEffect);
    activeEffect.deps.push(this);
  }

  notice() {
    this.subscribe.forEach((effect: any) => {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    });
  }
}

export function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

export function effect(fn, options: any = {}) {
  const _effect = new Reactive(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}
