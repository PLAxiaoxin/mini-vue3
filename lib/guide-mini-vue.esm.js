const extend = Object.assign;
const isObject = val => val !== null && typeof val === "object";
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toLocaleUpperCase() : "";
    });
};
const capitalize = (str) => {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : "";
};

let targetMap = new Map(); // 依赖存储
class Dep {
    constructor() {
        this.subscribe = new Set();
    }
    depend() {
        return;
    }
    notice() {
        this.subscribe.forEach((effect) => {
            if (effect.scheduler) {
                effect.scheduler();
            }
            else {
                effect.run();
            }
        });
    }
}
function getDep(target, key) {
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

/*
 * @Author: your name
 * @Date: 2022-04-09 23:18:56
 * @LastEditTime: 2022-04-10 20:39:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mini-vue3/src/reactivity/baseHandlers.ts
 */
// 缓存第一次创建的
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallowReadonly = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key);
        // 判断是否是 reactive
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
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
const mutableHndlers = {
    get,
    set
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key ${key} 是 readonly 类型无法修改`);
        return true;
    }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

function reactive(raw) {
    return createActiveObject(raw, mutableHndlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function createActiveObject(raw, baseHandlrs) {
    // if(!isObject(raw)){
    //   return raw;
    // }
    return new Proxy(raw, baseHandlrs);
}

function emit(instance, event, ...agrs) {
    console.log("emit", event, instance);
    const { props } = instance;
    // TPP
    // 先去实现一个特定行为 -》重构成通用行为
    // add -> Add
    // add-foo AddFoo
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...agrs);
}

function initProps(instance, rwaProps) {
    instance.props = rwaProps || {};
    // TODO
    // attrs
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // setupState props
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { }
    };
    //  以下写法儿，可以实现传参
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    //  TODO
    initProps(instance, instance.vnode.props);
    // initSlots()
    // 处理有状态的组件
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    //  ctx
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO
    // function 那就是组件的render函数
    // Object 就把对象注入组件上下文
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    //  if(Component.render){
    instance.render = Component.render;
    //  }
}

function render(vnode, container) {
    // patch 
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断是不是 element
    const { shapeFlag } = vnode;
    if (shapeFlag & 1 /* ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        // 处理组件
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    // 创建节点，创建属性，挂载节点
    const el = (vnode.el = document.createElement(vnode.type));
    let { children, shapeFlag } = vnode;
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
        mountChildren(children, el);
    }
    // props
    const { props } = vnode;
    for (const key in props) {
        let val = props[key];
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLocaleLowerCase();
            el.addEventListener(event, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.forEach(v => {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    // 创建组件实例
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
    // 这里可以确认element 都处理完成
    vnode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    //  children
    if (typeof vnode.children === "string") {
        // vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN 这和下面的写法是一个意思
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(vnode.children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === "string" ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先生产vnde
            // component -> vnode   -> 
            // 所有逻辑操作都会基于vnode 去处理
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
