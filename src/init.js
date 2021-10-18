import {initState} from './state'
import { compileToFunction } from '../compiler/index.js';
// 在原型上增加一个init方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
        console.log(options);
        const vm = this
        vm.$options = options // 用户传递的属性 data,watch

        // 初始化状态
        initState(vm) 




        // 如果用户传入了el属性 需要将页面渲染出来 
        // 实现挂在流程
        if(vm.$options.el) {
            vm.$mount(vm.$options.el)
        }

    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options
        el = document.querySelector(el); // 返回一个dom元素

        // 默认会先查找有没有render  没有render会用template 没有template用el中的内容

        if(!options.render) {
            // 对模版进行编译
            let template = options.template; // 取出模版
            if(!template && el) {
                template = el.outerHTML // 整个div  
            }
            console.log(template);
            const render = compileToFunction(template);
            console.log('render:',render);
            options.render = render
            // 需要把template 转换成render函数  vue1.0用的正则 vue2.0虚拟dom
        }
        // options.render
    }
}