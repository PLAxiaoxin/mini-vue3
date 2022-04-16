export const extend = Object.assign;
export const isObject = val => val !== null && typeof val === "object";
export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal);
};
export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
