// watcher 和 dep 是多对多的关系
let id = 0;
class Dep{
    constructor(){
        this.id = id++
        this.subs =[];
    }
    addSub(watcher){
        this.subs.push(watcher); // 观察者模式
    }
    depend(){
        // 让这个watcher 记住我当前的dep
        Dep.target.addDep(this)
    }
    notify(){
        this.subs.forEach((watcher)=>{
            watcher.update()
        })
    }
}
let stack = [];
// 21-10-21  目前可以做到保留和移除watcher的功能
export function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
    
}
export function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length-1];
}
export default Dep;