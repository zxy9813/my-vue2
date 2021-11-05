import {nextTick} from '../util/next-tick'
let queue = [];
let has = {};
function flushSchedularQueue() {
    queue.forEach((watcher=>watcher.run()))
    queue = []; //  让下一次可以继续使用
    has = {};
}

export function queueWatcher(watcher) {
    const id = watcher.id
    if (has[id] == null) {
        has[id] = true;

        // 宏任务和微任务 （vue里面使用Vue.nextTick)
        // Vue.nextTick = promise/mutationObserver/ setImmediate/setTimeout
        queue.push(watcher)
   
        nextTick(flushSchedularQueue, 0);
    }
}