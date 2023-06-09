import {initState} from './state'
import { compileToFunction } from './compiler/index.js';
import { callHook, mountComponent } from './lifecycle';
import { mergeOptions } from './util/index';
import { nextTick } from './util/next-tick';
// 在原型上增加一个init方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
        console.log(options);
        const vm = this
        vm.$options = mergeOptions(vm.constructor.options,options) // 用户传递的属性 data,watch       
        console.log(vm.$options,'!!!!!!!');
        // Attention:这里注意不要写成:
        // vm.$options = mergeOptions(Vue.options,options) 
        // 因为有这样一种情况（子类调用）
        // A extends Vue    A继承了Vue
        // let a = new A
        // a._init     这样调用才保证options这里是A而不是Vue

        callHook(vm,'beforeCreate')

        // 初始化状态
        initState(vm) 

        callHook(vm,'created')


        // 如果用户传入了el属性 需要将页面渲染出来 
        // 实现挂载流程
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

        // 渲染当前组件 挂载这个组件
        mountComponent(vm,el)
    }
    // 用户调用的nexttick
    Vue.prototype.$nextTick = nextTick
}