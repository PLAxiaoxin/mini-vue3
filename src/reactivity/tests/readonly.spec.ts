import { readonly, isReadonly } from "./../reactive";

describe("readonly", () => {
  it("happy path", () => {
    const obj = { foo: 1 };
    const wrapped = readonly(obj);
    expect(wrapped).not.toBe(obj);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(obj)).toBe(false);
    expect(obj.foo).toBe(1);
  });

  it("set 被调用", () => {
    const user = readonly({ age: 1 });
    console.warn = jest.fn();
    user.age = 2;
    expect(console.warn).toBeCalled();
  });
});
