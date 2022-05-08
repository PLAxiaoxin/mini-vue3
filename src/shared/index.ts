export * from "./toDisplayString";

export const extend = Object.assign;

export const isObject = (val) =>{
  return val !== null && typeof val === "object";
} 

export const isString = (val) =>{
  return typeof val === 'string';
}

export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal);
};

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

export const camelize = (str:string)=>{
  return str.replace(/-(\w)/g, (_, c:string)=>{
    return c ? c.toLocaleUpperCase() : "";
  })
}

export const capitalize = (str: string) =>{
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
}

export const toHandlerKey = (str: string)=>{
  return str ? "on" + capitalize(str) : "";
}

export const EMPTY_OBJ = {};
