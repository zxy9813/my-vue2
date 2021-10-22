let id = 0;
class Dep{
    constructor(){
        this.id = id++
        this.subs =[];
    }
    depend(){
        debugger
        this.subs.push(Dep.target); // 观察者模式
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