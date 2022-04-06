import { ref } from "../ref";
import { effect } from "../effect";

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
});
