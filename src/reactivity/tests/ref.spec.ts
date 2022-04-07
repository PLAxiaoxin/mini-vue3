import { ref, isRef, unRef, proxyRefs } from "../ref";
import { effect } from "../effect";
import { reactive } from "../reactive";

describe("ref", () => {
  it("happy path", () => {
    const foo = ref(1);
    expect(foo.value).toBe(1);
  });

  it("响应式 以及 避免重复收集依赖", () => {
    const a = ref(1);
    let duumy;
    let count = 0;
    effect(() => {
      count++;
      duumy = a.value;
    });

    expect(duumy).toBe(1);
    expect(count).toBe(1);
    a.value = 2;
    expect(duumy).toBe(2);
    expect(count).toBe(2);

    //  相同的值，不去收集依赖
    a.value = 2;
    expect(duumy).toBe(2);
    expect(count).toBe(2);
  });

  it("接收对象", () => {
    const a = ref({
      count: 1
    });

    let dummy;

    effect(() => {
      dummy = a.value.count;
    });

    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    const a = ref(1);
    const b = reactive({ a: 1 });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(b)).toBe(false);
  });

  it("unRef", () => {
    const a = ref(1);
    const b = reactive({ a: 1 });
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });

  it("proxyRefs", () => {
    const user = {
      a: ref(1),
      name: "zhangsan"
    };

    let proxyUser = proxyRefs(user);
    expect(user.a.value).toBe(1);
    expect(proxyUser.a).toBe(1);
    expect(proxyUser.name).toBe("zhangsan");

    // 改变代理对象的值会影响原对象
    proxyUser.a = 20;
    expect(proxyUser.a).toBe(20);
    expect(user.a.value).toBe(20);
  });
});
