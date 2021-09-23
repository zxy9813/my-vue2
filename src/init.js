import {initState} from './state'
// 在原型上增加一个init方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
        console.log(options);
        const vm = this
        vm.$options = options // 用户传递的属性 data,watch

        // 初始化状态
        initState(vm) 
    }
}