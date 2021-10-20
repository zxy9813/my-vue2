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

export function mergeOptions(parent,child) {
    console.log(11,parent,22,child);
    const options = {}

    for (let key in parent) {
        mergeField(key)
    }
    for (let key in child) {
        // 如果已经合并过了就不需要再次合并了
        debugger
        if(!parent.hasOwnProperty(key)){
            mergeField(key)
        }
    }
    console.log(options);
    function mergeField(key) {
        if(typeof parent[key] === 'object' && typeof child[key] === 'object'){
            options[key] = {
                ...parent[key],
                ...child[key]
            }
        }else if (child[key] == null) {
            options[key] = parent[key];
        }else {
            // 子（新）覆盖父（旧）的
            // data:{}  data:123   -> data:123
            options[key] = child[key]
        }
        
    }
    return options
}