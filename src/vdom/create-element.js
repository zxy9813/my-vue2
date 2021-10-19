export function createElement(tag,data={},...children) {
    let key = data.key;
    if(key){
        delete data.key
    }
    return vnode(tag,data,key,children,undefined)
}
export function createTextNode(text) {
    return vnode(undefined,undefined,undefined,undefined,text)
}

function vnode(tag,data,key,children,text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}
// 虚拟节点 就是通过_c _v 实现用对象来描述dom的操作（对象）

// 1）将template 转成ast树 -> 生成render方法 -> 生成虚拟dom -> 真实的dom
// 页面更新的话 重新生成虚拟dom 和上次做对比 -> 更新dom

// {
//     tag:'div',
//     key:undefined,
//     data:{},
//     children:[],
//     text:undefined
// }