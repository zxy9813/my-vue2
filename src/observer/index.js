import {isObject,def} from '../util/index'
import {arrayMethods} from './array.js'
import Dep from './dep'
// 把data中的数据 都重新定义
// 但Object.defineProperty 不能兼容ie8及以下 所以vue2无法兼容ie8

class Observer{
    constructor(value) {
        this.dep = new Dep();
        // 如果是数组，会对索引也添加set和get，最好对数组再进行特殊处理
        // value.__ob__ = this // 给每一个监控过的对象都加一个属性
        def(value,'__ob__',this)
        if(Array.isArray(value)) {
            // 不要对索引进行观测，影响性能
            // 如果数组里放的是对象，再监控


            // push shift 劫持

            value.__proto__ = arrayMethods
            this.observerArray(value)
        }else {
            // vue如果数据的层次过多 需要第一的去解析对象中的和属性，依次增加set和get方法
            // vue3 的proxy 不用递归也不用加set和get
            this.walk(value)
        }
        

        
    }
    observerArray(value) { // [{}]
        for(let i = 0; i < value.length; i++) {
            observe(value[i])
        }
    }
    // 遍历对象用
    walk(data) {
        let keys = Object.keys(data) // [name,age,address] ,对象中属性组成的数组
        keys.forEach((key)=>{
            defineReactive(data,key,data[key])
        })

        // for ( let i = 0; i < keys.length; i++ ) {
        //     let key = keys[i]; // 取第i个属性
        //     let value = data[key]; // 取第i个值
        //     defineReactive(data,key,value) // 把这个key value变成响应式
        // }
    }
}

function defineReactive(data,key,value) {
    let dep = new Dep();
    let childOb = observe(value) // 是不是对象 递归实现深度检测 
    Object.defineProperty(data,key,{
        configurable:true,
        enumerable:true,
        get() {
            // {{}}的值一开始走两次取值的原因是：JSON.stringfy会对内容进行一次取汁
            if (Dep.target) { // 如果当前有watcher
                dep.depend(); // 意味着我要将watcher存起来
                if (childOb) { // ******数组的依赖收集******
                    childOb.dep.depend(); // 收集了数组的相关依赖
                    // 如果数组中还有数组
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            
            console.log('取值');
            return value;
            
        },
        set(newValue) {
            if( newValue === value) return;
            console.log('设置值');
            observe(newValue) // 如果用户将一个值重新赋值成对象，需要劫持时做响应式
            value = newValue
            dep.notify(); // 通知依赖的watcher进行更新操作
        }
    })
}
function dependArray(value) {
    for(let i = 0; i < value.length; i++){
        let current = value[i]; // 将数组中的每一个都取出来 数据变化后 去更新视图
        // 数组中的数组的依赖收集
        current.__ob__ && current.__ob__.dep.depend();
        if(Array.isArray(current)) {
            dependArray(current)
        }
    }
}
// 是不是对象
export function observe(data) {
    let isObj = isObject(data)
    // 不是对象
    if(!isObj) {
        return
    }
    // 是对象 需要观测数据 
    return new Observer(data)
    
}