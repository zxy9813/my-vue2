class Watcher{
    constructor(vm,exprOrFn,callback,options){ // 固定顺序
        this.vm = vm;
        this.getter = exprOrFn;
        this.callback = callback;
        this.options = options;
        this.get()
    }
    get(){
        this.getter()
    }
}
export default Watcher