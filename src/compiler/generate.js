const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g  // 匹配花括号{{}}
function genChildren(el) {
    let children  = el.children
    if(children && children.length>0){
        return `${children.map((c)=>gen(c)).join(',')}`
    }else {
        return false;
    }
}

function gen(node) {
    if(node.type == 1){
        // 元素标签
        return generate(node)
    }else{
        // 文字标签
        let text = node.text; // a {{name}} b {{age}} c
        // _v("a"+_s(name)+"b"+_s(age)+"c")
        // 这里使用正则匹配，exec可以全取到，match只能取到name、age
        let tokens = [];
        let match,index;
        let lastIndex = defaultTagRE.lastIndex = 0
        while(match = defaultTagRE.exec(text)){
            index = match.index;
            if(index > lastIndex){
                tokens.push(JSON.stringify(text.slice(lastIndex,index)))
            }
            tokens.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length
            
        }
        // 最后多余的字符串
        if(lastIndex < text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`
    }
}

function genProps(attrs) {
    let str = ''
    for(let i = 0; i < attrs.length; i++){ // [{name:'id',value:'app'}]
        let attr = attrs[i];
        if(attr.name == 'style'){
            // style="color:red;fontSize:14px" => style:{color:'red}.id:name
            let obj = {};
            attr.value.split(';').forEach((item)=>{
                let [key,value] = item.split(':')
                obj[key] = value;
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`
}

export function generate(el) {
    let children = genChildren(el)
    let code = `_c("${el.tag}",${el.attrs.length?genProps(el.attrs):'undefined'}${children?`,${children}`:''})`
    return code
}