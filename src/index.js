import {initMixin} from './init.js'
import {renderMixin} from './render'
import {lifecycleMixin} from './lifecycle'
import {initGlobalAPI} from './initGlobalAPI/index'
import { compileToFunction } from './compiler/index.js'
import { createElm, patch } from './vdom/patch.js'
function Vue(options) {
    // 进行Vue的初始化操作
    this._init(options)
}
// 通过文件引入的方式，给vue原型挂载方法
initMixin(Vue) // 给原型上添加一个_init方法
renderMixin(Vue)
lifecycleMixin(Vue)

// 初始化全局api
initGlobalAPI(Vue)



// demo 比对两个vnode
// let vm1 = new Vue ({
//     data:{
//         name:'kitty'
//     }
// })
// let render1 = compileToFunction(`<div b="111">
// <div key="a" style="background-color:red;">A</div>
// <div key="b" style="background-color:blue;">B</div>
// <div key="c" style="background-color:yellow;">C</div>
// </div>`);
// let vnode1 = render1.call(vm1)

// let el = createElm(vnode1)
// document.body.appendChild(el)
// console.log('第一个实例',render1,vnode1);

// let vm2 = new Vue ({
//     data:{
//         name:'motor'
//     }
// })
// let render2 = compileToFunction(`<div c="666">
// <div key="c" style="background-color:yellow;">C<p>xixixi</p></div>
// <div key="a" style="background-color:red;">A</div>
// <div key="b" style="background-color:blue;">B<p>hhahaha</p></div>
// </div>`);
// let vnode2 = render2.call(vm2)
// console.log('第二个实例',render2,vnode2);

// setTimeout(() => {
//     patch(vnode1,vnode2)
// }, 3000);


// 1.diff算法的特点是 平级比对，我们正常操作dom元素，很少涉及到父变成子 子变成父 这里时间复杂度O(n^3)

export default Vue