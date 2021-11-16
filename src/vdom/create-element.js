import { isObject, isReservedTag } from "../util/index";

export function createElement(vm,tag,data={},...children) {
    // ast => render => 调用render时走到这里
    let key = data.key;
    if(key){
        delete data.key
    }
    if (isReservedTag(tag)){
        // 如果是标签
        return vnode(tag,data,key,children,undefined)
    }else {
        // 如果是组件
        let Ctor = vm.$options.components[tag];
        // 找到了子组件的构造函数
        return createComponent(vm,tag,data,key,children,Ctor)
    }
    
}
function createComponent(vm,tag,data,key,children,Ctor) {
    if(isObject(Ctor)){
        Ctor = vm.$options._base.extend(Ctor); // Vue.extend()
    }
    data.hook = {
        init (vnode) {
            // 当前组件的实例就是componentInstance
            let child = vnode.componentInstance = new Ctor({_isComponent: true});
            // 组件的挂载 vm.$el
            child.$mount();
            // return child;
        }
    }

    return vnode(`vue-component-${Ctor.cid}-${tag}`,data,key,undefined,{Ctor,children}); // 组件内的不叫孩子叫插槽
}
export function createTextNode(vm,text) {
    return vnode(undefined,undefined,undefined,undefined,text)
}

function vnode(tag,data,key,children,text,componentOptions) {
    // !!!!!!!!
    return {
        tag,
        data,
        key,
        children,
        text,
        componentOptions
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