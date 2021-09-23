import {isObject} from '../util/index'
// 把data中的数据 都重新定义
// 但Object.defineProperty 不能兼容ie8及以下 所以vue2无法兼容ie8

class Observer{
    constructor(value) {
        // vue如果数据的层次过多 需要第一的去解析对象中的和属性，依次增加set和get方法
        // vue3 的proxy 不用递归也不用加set和get
        this.walk(value)
    }

    walk(data) {
        let keys = Object.keys(data) // [name,age,address]
        for ( i = 0; i < keys.length; i++ ) {
            let key = keys[i];
            let value = data[key];
            defineReactive(data,key,value)
        }
    }
}

export function observe(data) {
    let isObj = isObject(data)
    // 不是对象
    if(!isObj) {
        return
    }
    // 是对象 需要观测数据 
    return new Observer(data)
    
}