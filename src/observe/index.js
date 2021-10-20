import {isObject,def} from '../util/index'
import {arrayMethods} from './array.js'
// 把data中的数据 都重新定义
// 但Object.defineProperty 不能兼容ie8及以下 所以vue2无法兼容ie8

class Observer{
    constructor(value) {
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
    observe(value) // 是不是对象 递归实现深度检测 
    Object.defineProperty(data,key,{
        configurable:true,
        enumerable:true,
        get() {
            return value;
        },
        set(newValue) {
            if( newValue === value) return;
            console.log('值发生变化了');
            observe(newValue) // 如果用户将一个值重新赋值成对象，需要劫持时做响应式
            value = newValue
        }
    })
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