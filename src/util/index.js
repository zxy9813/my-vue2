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