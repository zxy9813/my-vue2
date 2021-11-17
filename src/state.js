import {observe} from './observer/index'
import { proxy } from './util/index'
export function initState(vm) {
    // vue的数据来源 属性 方法 数据 计算属性 watch ,也是vue的初始化流程
    const opts = vm.$options
    // console.log(opts);
    if (opts.props) {
        initProps(vm)
    }
    if (opts.method) {
        initMethods(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}
function initProps(){}
function initMethods(){}
function initData(vm){
    // 数据初始化
    let data = vm.$options.data; // 用户传递的data
    data = vm._data = typeof data === 'function' ? data.call(vm):data // data可能是个函数（返回值是对象），也可能是对象，只需要对象
    // console.log(data);
    // 数据劫持 用户改变数据时 希望可以得到通知 -> 刷新页面
    // MVVM模式 数据驱动视图变化
    // Object.defineProperty() 给属性添加get和set方法

    for(let key in data){
        proxy(vm,'_data',key)
    }

    observe(data) // 响应式
}
function initComputed(){}
function initWatch(){}