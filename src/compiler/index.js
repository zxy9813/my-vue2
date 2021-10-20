import {parseHTML} from './parser-html'
import { generate } from './generate'

export function compileToFunction(template) {
    // 1）解析html字符串 将html字符串 -> ast语法树
    let root = parseHTML(template)
    // 需要将ast语法树转成render函数 就是字符串拼接 （模版引擎）
    let code  = generate(root)
    // 核心思路就是将模版转化成下面这段字符串
    // <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树 再次转化成js的语法
    // _c("div",{id:app},_c("p",undefined,_v('hello'+_s(name))),_v('hello'))


    // 所有模版引擎的实现 都需要 new Function + with
    // with为了拿到data中的数据
    // function () {
    //     with(this){  this为vm实例 vm.render
    //         return _c("div",{id:"app",style:{"color":"red","background-color":" blue"}},_v("hello"),_c("p",undefined,_v("123"+_s(address))))
    //     }
    // }
    let renderFn = new Function(`with(this){ return ${code}}`)
    console.log(root,'---');

    // vue的render 他返回的是虚拟dom
    return renderFn;
}

// 结点
{/* <div id="app">
    <p>hello</p>
</div>

// 语法
let root = {
    tag:'div',
    attrs:[{name:'id',value:'app'}],
    parent:null,
    type:1, // 元素
    children:[{
        tag:'p',
        attrs:[],
        parent:root,
        type:1, // 元素
        children:[{
            text:'hello',
            type:3, // 文本
        }]
    }]
} */}