import { reactive, isReactive, isProxy } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isProxy(observed)).toBe(true);
  });

  it("reactive 深层次遍历", () => {
    const obj = reactive({
      baz: { a: 1 },
      arr: [{ b: 1 }]
    });

    expect(isReactive(obj.baz)).toBe(true);
    expect(isReactive(obj.arr)).toBe(true);
    expect(isReactive(obj.arr[0])).toBe(true);
  });
});
