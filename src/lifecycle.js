import Watcher from "./observe/watcher";
import {patch} from './vdom/patch'
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        // 拿到render返回的虚拟节点 生成真实节点
        const vm = this;
        vm.$el = patch(vm.$el,vnode)
    }
}

export function mountComponent(vm,el) {
    const options = vm.$options;
    vm.$el = el // 真实的dom元素

    // Watcher 就是用来渲染的
    // vm._render 通过解析的render方法 渲染出虚拟dom
    // vm._update 通过虚拟dom 创建真实的dom

    // 渲染页面
    let updateComponent = () =>{ // 无论是渲染还是更新都会调用此方法
        // 返回的是虚拟dom
        vm._update(vm._render());
    }
    // 渲染watcher  每个组件都有一个watcher
    // 每次数据变化后 都会重新执行updateComponent方法
    new Watcher(vm,updateComponent,()=>{},true) // true表示他是一个渲染watcher
}