import { createElement, createTextNode } from "./vdom/create-element"

export function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringfy
    Vue.prototype._c = function () {
        return createElement(this,...arguments) // tag,data,children1,children
    }
    Vue.prototype._v = function (text) {
        return createTextNode(this,text)
    }
    Vue.prototype._s = function (val) {
        return val == null? '':(typeof val == 'object'? JSON.stringify(val):val)
    }

    Vue.prototype._render = function () {
       const vm = this
       
       const {render} = vm.$options
    //    console.log(render,this._s(),this);
    //    render()是不行的 render中with(this){内部this指向的是window} 必须绑定
       let vnode = render.call(vm) // 去实例上取值
       return vnode
    }
}