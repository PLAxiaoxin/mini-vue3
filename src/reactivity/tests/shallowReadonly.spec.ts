import { shallowReadonly, isReadonly } from "../reactive";

describe("shallowReadonly", () => {
  it("对象只有外层是只读", () => {
    const props = shallowReadonly({ n: { a: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  });

  it("set 被调用", () => {
    const user = shallowReadonly({ age: 1 });
    console.warn = jest.fn();
    user.age = 2;
    expect(console.warn).toBeCalled();
  });
});
