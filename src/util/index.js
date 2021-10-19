/**
 * 
 * @param {*} data 当前数据是不是对象
 * @returns 
 */
export function isObject(data) {
    return typeof data === 'object' && data !== null
}
/**
 * 定义一个不可枚举的属性
 * @param {*} data 
 * @param {*} key 
 * @param {*} value 
 */

export function def(data,key,value) {
    Object.defineProperty(data,key,{
        enumerable:false,
        configurable:false,
        value
    })
}
// 取值实现代理效果
export function proxy(vm,source,key) {
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newValue){
            vm[source][key] = newValue;
        }
    })
}