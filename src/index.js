import {initMixin} from './init.js'
function Vue(options) {
    this._init(options)
}
// 通过文件引入的方式，给vue原型挂载方法
initMixin(Vue)
export default Vue