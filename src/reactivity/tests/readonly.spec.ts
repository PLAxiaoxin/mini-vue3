import { readonly, isReadonly, isProxy } from "./../reactive";

describe("readonly", () => {
  it("happy path", () => {
    const obj = { foo: 1 };
    const wrapped = readonly(obj);
    expect(wrapped).not.toBe(obj);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(obj)).toBe(false);
    expect(isProxy(wrapped)).toBe(true);
    expect(obj.foo).toBe(1);
  });

  it("set 被调用", () => {
    const user = readonly({ age: 1 });
    console.warn = jest.fn();
    user.age = 2;
    expect(console.warn).toBeCalled();
  });

  it("Readonly 嵌套对象转换", () => {
    const obj = { foo: 1, baz: { c: 2 } };
    const wrapped = readonly(obj);
    expect(isReadonly(wrapped.baz)).toBe(true);
    expect(isReadonly(obj.baz)).toBe(false);
  });
});
