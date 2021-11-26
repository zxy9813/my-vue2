import Watcher from "./observer/watcher";
import {patch} from './vdom/patch'
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        // 拿到render返回的虚拟节点 生成真实节点
        const vm = this;
        const prevVnode = vm._vnode; // 保存上一次渲染的虚拟节点 为了实现比对
        vm._vnode = vnode;
        if (!prevVnode){
            vm.$el = patch(vm.$el,vnode);
        }else {
            vm.$el = patch(prevVnode,vnode);
        }
    }
}

export function mountComponent(vm,el) {
    const options = vm.$options;
    vm.$el = el // 真实的dom元素

    // Watcher 就是用来渲染的
    // vm._render 通过解析的render方法 渲染出虚拟dom
    // vm._update 通过虚拟dom 创建真实的dom
    callHook(vm,'beforeMount')
    // 渲染页面
    let updateComponent = () =>{ // 无论是渲染还是更新都会调用此方法
        console.log('调用了update');
        // 返回的是虚拟dom
        vm._update(vm._render());
    }
    // 渲染watcher  每个组件都有一个watcher
    // 每次数据变化后 都会重新执行updateComponent方法
    new Watcher(vm,updateComponent,()=>{},true) // true表示他是一个渲染watcher
    callHook(vm,'mounted')
}

export function callHook(vm,hook) {
    const handlers = vm.$options[hook] // [fn,fn,fn]
    if(handlers) { // 找到对应的钩子依次执行
        for(let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm); // 保证传来的beforeCreate中的调用的this指向实例
        }
    }
}