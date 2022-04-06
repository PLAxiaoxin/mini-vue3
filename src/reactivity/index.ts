import { reactive } from "./reactive";
import { effect } from "./effect";
let user = { age: 1 };
let obj = reactive(user);
obj.age++;
effect(() => {
  console.log(obj.age);
});
