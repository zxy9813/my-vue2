import {pushTarget,popTarget} from './dep'
let id = 0;
class Watcher{
    constructor(vm,exprOrFn,callback,options){ // 固定顺序
        this.vm = vm;
        this.getter = exprOrFn; // 将传来的函数放到getter属性上
        this.callback = callback;
        this.options = options;
        this.id = id++;
        this.depsId = new Set(); // es6中的集合（不能放重复项）
        this.deps = []
        this.get()
    }
    addDep(dep){ // watcher里不能放重复的dep，反之同理
        let id = dep.id;
        if(!this.depsId.has(id)){
            this.depsId.add(id);
            this.deps.push(dep);
            dep.addSub(this);
        }
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

// 在模版中取值时  会进行依赖收集  在更改数据时会进行对应的watcher 调用更新操作
export default Watcher