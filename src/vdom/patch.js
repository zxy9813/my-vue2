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
        }else {
            // 1.标签不一致,直接替换
            if (oldVnode.tag !== vnode.tag) {
                
                
                oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
                
            }
            // 2.文本
            if (!oldVnode.tag) {
                if (oldVnode.text !== vnode.text) {
                    oldVnode.el.textContent = vnode.text;
                }
                
            }
            // 3.标签一致且不是文本 对比属性
            let el = vnode.el = oldVnode.el;
            updateProperties(vnode,oldVnode.data);

            let newChildren = vnode.children || [];
            let oldChildren = oldVnode.children || [];
            
            if (newChildren.length > 0 && oldChildren.length > 0) {
                // 最重要的部分 两个都有孩子 核心方法updateChildren
                updateChildren(el, oldChildren, newChildren);
                
            }else if (newChildren.length > 0) {
                // 新的有孩子 老的没孩子 直接把新孩子插入到dom中
                for (let i = 0; i < newChildren.length; i++) {
                    el.appendChild(createElm(newChildren[i]))
                }
            }else if (oldChildren.length > 0) {
                // 新的没孩子 老的有孩子 把老孩子置空
                el.innerHTML = '';
            }
            
            
        }
    }
    // 递归创建真实节点 替换掉老的节点
}
function isSameVnode(oldVnode,newVnode) {
    return (oldVnode.tag == newVnode.tag) && (oldVnode.key === newVnode.key)
}
function updateChildren(parent, oldChildren, newChildren) {
    // vue采用双指针的方式

    // vue在内部比对的过程中做了很多优化策略

    //？？？？不先删旧节点多余的？
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[0];
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex];


    let newStartIndex = 0;
    let newStartVnode = newChildren[0];
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];

    
    const makeIndexByKey = (children) => {
        let map = {};
        children.forEach((item,index)=>{
            // console.log('key',child);
            if (item.key) {
                map[item.key] = index; // 根据key创建一个映射表
            }
        })
        return map;
    }
    let map = makeIndexByKey(oldChildren);

    // 在比对的过程中 新老虚拟节点有一方循环完毕就结束
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 在老指针移动过程中可能会碰到undefined
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex];

        }else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex];
        }else
        if (isSameVnode(oldStartVnode, newStartVnode)){
        // 如果是同一个节点 就需要比对这个元素的属性
        // 优化向后插入的情况 ABCD->ABCDE
            patch(oldStartVnode,newStartVnode);
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
            
        }else if (isSameVnode(oldEndVnode, newEndVnode)){
        // 优化向前插入的情况 ABCD->EABCD 
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        }else if (isSameVnode(oldStartVnode, newEndVnode)){
        // 优化头移尾的问题 ABCD->BCDA
            patch(oldStartVnode,newEndVnode);
            parent.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        }else if (isSameVnode(oldEndVnode, newStartVnode)){
        // 优化尾移头的问题 ABCD->DABC
            patch(oldEndVnode,newStartVnode);
            parent.insertBefore(oldEndVnode.el,oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];
        }else {
            // 乱序 暴力比对
            // 先根据老节点的key 做一个映射表，拿新的虚拟节点去映射表中查找，如果可以查找到，则进行移动操作
            // 移到老偷指针前面的位置 如果找不到直接将元素插入即可
            let moveIndex = map[newStartVnode.key];
            if (!moveIndex){
                parent.insertBefore(createElm(newStartVnode),oldStartVnode.el);
                
            } else {
                
                
                let moveVnode = oldChildren[moveIndex];
                console.log('!!!!',oldChildren,moveIndex,moveVnode);
                debugger
                oldChildren[moveIndex] = undefined; // 占位 防止移动后塌陷
                parent.insertBefore(moveVnode.el,oldStartVnode.el); // insertbefore如果是当前现有的节点，是移动的效果而不是拷贝
                
                patch(moveVnode,newStartVnode); // 比对子元素是否一致
                
            }
            newStartVnode = newChildren[++newStartIndex];
            
        }
        
    }

    if (newStartIndex <= newEndIndex) {
        // 可能向后插入 也有可能向前插入 insertbefore
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            let el = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
            parent.insertBefore(createElm(newChildren[i]), el); // 第二个参数为null等价于appendchild
              
        }
    }
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            let child = oldChildren[i];
            if (child != undefined){
                parent.removeChild(child.el);

            }
        }
    }
}
function createComponent(vnode) {
    let i = vnode.data;
    if ((i = i.hook) && (i = i.init)) {
        i(vnode);
    }
    // 执行完毕后
    if(vnode.componentInstance) {
        return true;
    }
}
export function createElm(vnode) { // 根据虚拟节点 常见真实的节点
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

function updateProperties(vnode, oldProps = {}) {
    let newProps = vnode.data || {};
    console.log(el,newProps,oldProps);
    let el = vnode.el;
    // 如果老的属性有 新的属性没有 就在真实dom上将这个属性删掉

    let newStyle = newProps.style || {};
    let oldStyle = oldProps.style || {};

    // mergeOptions
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = '';
        }
    }
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }

    for(let key in newProps){
        if(key === 'style'){
            for(let styleName in newProps.style){
                // 新增样式
                el.style[styleName] = newProps.style[styleName];
            }
        }else if(key === 'class'){
            el.className = newProps.class;
        }else {
            debugger
            el.setAttribute(key,newProps[key])
        }
    }
}