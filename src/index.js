import {initMixin} from './init.js'
import {renderMixin} from './render'
import {lifecycleMixin} from './lifecycle'
function Vue(options) {
    // 进行Vue的初始化操作
    this._init(options)
}
// 通过文件引入的方式，给vue原型挂载方法
initMixin(Vue) // 给原型上添加一个_init方法
renderMixin(Vue)
lifecycleMixin(Vue)
export default Vue