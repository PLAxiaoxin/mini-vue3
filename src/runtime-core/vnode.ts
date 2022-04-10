/*
 * @Author: your name
 * @Date: 2022-04-10 15:55:00
 * @LastEditTime: 2022-04-10 16:13:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mini-vue3/src/runtime-core/vnode.ts
 */
export function createVNode(type, props?, children?){
  const  vnode = {
    type,
    props,
    children
  }
  return vnode;
}
