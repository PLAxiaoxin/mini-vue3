import { reactive } from "../reactive";
import { computed } from "../computed";
import { vi } from "vitest";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({ age: 1 });
    const age = computed(() => {
      return user.age;
    });

    expect(age.value).toBe(1);
  });

  it("computed 懒执行", () => {
    const user = reactive({ age: 1 });
    const getter = vi.fn(() => {
      return user.age;
    });

    let cUser = computed(getter);

    // 断言getter 在 cuser 没有调用是不执行
    expect(getter).not.toHaveBeenCalled();
    expect(cUser.value).toBe(1);
    // 断言 getter 是不是只调用一次
    expect(getter).toHaveBeenCalledTimes(1);
    // get 操作时，getter还是只调用一次
    cUser.value;
    expect(getter).toHaveBeenCalledTimes(1);
    user.age = 2;
    expect(getter).toHaveBeenCalledTimes(1);
    expect(cUser.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
    cUser.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
