export function patch(oldVnode, vnode) {
    if (!oldVnode) {
        // 通过当前的虚拟节点 创建元素并返回
        return createElm(vnode);
    }else {
        // 递归创建真实节点 替换掉老的节点
        const isRealElement = oldVnode.nodeType;
        if (isRealElement) {
            const oldElm = oldVnode;
            const parentElm = oldVnode.parentNode;

            let el = createElm(vnode)
            parentElm.insertBefore(el, oldElm.nextSibling) // 新的插到旧的下面去
            parentElm.removeChild(oldElm)

            return el;
        }
    }
    
}
function createComponent(vnode) {
    console.log(vnode,666);
    let i = vnode.data;
    if ((i = i.hook) && (i = i.init)) {
        i(vnode);
    }
    // 执行完毕后
    if(vnode.componentInstance) {
        return true;
    }
}
function createElm(vnode) { // 根据虚拟节点 常见真实的节点
    // return document.createElement('div')
    const {tag,data,key,children,text} = vnode;
    // 是标签就创建标签
    if (typeof tag === 'string'){
        // 组件没有孩子 需要一层判断
        if (createComponent(vnode)) {
            // 这里应该返回的是真实的dom元素
            return vnode.componentInstance.$el;
        }
        vnode.el = document.createElement(tag)
        updateProperties(vnode)
        children.forEach(child=>{
            vnode.el.appendChild(createElm(child)) // 递归创建儿子节点 将儿子节点扔到父节点中
        })
    }else {
        // 虚拟dom上映射真实dom 方便后续操作
        vnode.el = document.createTextNode(text)
    }
    
    return vnode.el
}

function updateProperties(vnode) {
    let newProps = vnode.data || {};
    let el = vnode.el;
    for(let key in newProps){
        if(key === 'style'){
            for(let styleName in newProps.style){
                el.style[styleName] = newProps.style[styleName];
            }
        }else if(key === 'class'){
            el.className = newProps.class;
        }else {
            el.setAttribute(key,newProps[key])
        }
    }
}