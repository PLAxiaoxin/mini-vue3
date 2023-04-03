import { ReactiveEffect } from "./effect";

class ComputedImlp {
  private _getter: any;
  private _value: any;
  private _dirty: boolean = true;
  constructor(getter: Function) {
    this._getter = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._getter.run();
    }
    return this._value;
  }
}

export function computed(getter: Function) {
  return new ComputedImlp(getter);
}
