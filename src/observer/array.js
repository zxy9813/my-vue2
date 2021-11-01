// 重写数组的7个方法 push  shift unshift pop reverse sort splice
// slice不会改变原数组

let oldArrayMethods = Array.prototype

// value.__protp__ = arrayMethods
// arrayMethods.__proto__ = oldArrayMethods
export const arrayMethods = Object.create(oldArrayMethods)

const methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'reverse',
    'sort',
    'splice',
]

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        console.log('用户调用了push'); // AOP切片编程
        const result = oldArrayMethods[method].apply(this,args) // 调用原生的数组方法
        // push unshift 添加的元素可能还是一个对象
        let inserted;
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;  
                break;
            case 'splice': // 3个 新增的属性 splice 有删除 新增的功能 arr.splice(0,1,{name:1})
                inserted = args.slice(2)
            default:
                break;
        }

        if(inserted) ob.observerArray(inserted)

        ob.dep.notify()

        return result
    }
})