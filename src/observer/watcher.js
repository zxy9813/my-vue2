import {pushTarget,popTarget} from './dep'
let id = 0;
class Watcher{
    constructor(vm,exprOrFn,callback,options){ // 固定顺序
        this.vm = vm;
        this.getter = exprOrFn;
        this.callback = callback;
        this.options = options;
        this.id = id++;
        this.get()
    }
    get(){
        pushTarget(this); // 把watcher存起来 Dep.target
        this.getter(); // 渲染watcher的执行
        popTarget(); // 移除watcher
    }
    update(){
        this.get()
    }
}
export default Watcher