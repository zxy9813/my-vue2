import { mergeOptions } from "../util/index";
export default function initExtend(Vue) {
    let cid = 0;
    Vue.extend =function (extendOptions) {

        const Sub = function VueComponent(options) {
            this._init(options)
        }
        // 让子类也拥有父类的方法
        Sub.cid = cid++;
        Sub.prototype = Object.create(this.prototype); // JS 原生问题
        Sub.prototype.constructor = Sub; // 必须来这么一下 否则使用object.create后 Sub类的实例的构造函数会指向父类
        Sub.options = mergeOptions(
            this.options,
            extendOptions
        )

        return Sub;
    }
}