
export const enum ShapeFlags {
  ELEMENT = 1, // 0001
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, // 0100
  ARRAY_CHILDREN = 1 << 3, // 1000
  SLOT_CHILDREN = 1 << 4
} 

// 2..toString("2") 查询二进制
// const ShapeFlags = {
//   element: 0,
//   stateful_component: 0,
//   text_children: 0,
//   array_children: 0,
// }

// vnode-> stateful_component
// 1. 可以设置 修改
// ShapeFlags.stateful_component = 1
// ShapeFlags.array_children = 1


// 2.查找
// if(ShapeFlags.element)
// if(SHapeFlags.stateful_component)

// 不够高效 -> 位运算的方式
// 0000
// 0001 -> element
// 0010 -> stateful_component
// 0100 -> text_children
// 1000 -> array_children

// 1010
// | 两位为0，才为0; 0000 | 0001 = 0001
// & 两位为1，才为1; 0001 & 0001 = 0001; 0010 & 0001 = 0000;
