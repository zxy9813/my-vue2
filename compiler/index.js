// ast语法树 是用对象来描述js语法的  虚拟dom  用对象来描述dom节点的
// ?: 匹配不捕获

// arguments[0] 匹配到的标签 arguments[1] 匹配到的标签名字
// let r  = '<ab:cd>'.match(startTagOpen)
// console.log(r);  ['<ab:cd','ab:cd']
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa 两个斜杠：字符串一层正则一层
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:dasda> 命名空间标签
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)// 匹配标签结尾的</div>

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的 可以是双引号、单引号或者为空
//console.log(`  aa=123`.match(attribute));

const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的> 包含自闭合 <div />
const defaultTagRE = /\{\{((?:.|\r?\n)+?\}\}/g  

export function compileToFunction(template) {

    console.log(template,'---');
    return function render() {
        
    }
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