import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe("happy path", () => {
  //  it.skip 任务拆分
  it("effect", () => {
    const user = reactive({ age: 10 });
    let nextAge;

    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("effect runner", () => {
    // 1. effect 传入两个参数的时候，第一次不调用scheduler。
    // 2. 第一次执行 effect 的第一个函数。
    // 3. 第二次触发 effect时，不执行第一个函数，只执行scheduler
    // 4. 只有执行 effect 第一个参数返回的函数才会改变
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });

  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ foo: 1 });
    const runner = effect(() => {
      dummy = obj.foo;
    });
    obj.foo = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.foo++;
    expect(dummy).toBe(2);
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop 调用stop 之后的回调", () => {
    let dummy;
    const obj = reactive({ foo: 1 });
    const onStop = jest.fn();
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop
      }
    );
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
