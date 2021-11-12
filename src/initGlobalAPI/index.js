import initMixin from "./mixin";
import initAssetRegisters from './assets';
import {ASSETS_TYPE} from './const'
import initExtend from "./extend";
export function initGlobalAPI(Vue) {
    // 全局api不在实例上 放在一个对象里整合了所有全局内容
    Vue.options = {};
    initMixin(Vue)
    


    ASSETS_TYPE.forEach( type=> {
        Vue.options[type+'s'] = {}
    });
    Vue.options._base = Vue;

    initExtend(Vue)
    initAssetRegisters(Vue)


    
    // 生命周期的合并策略   [beforeCreate,beforeCreate]
    // Vue.mixin({
    //     b:{m:1},
    //     c:1,
    //     beforeCreate(){
    //         console.log('mixin 1');
    //     }
    // })
    // Vue.mixin({
    //     b:{n:2},
    //     d:2,
    //     beforeCreate(){
    //         console.log('mixin 2');
    //     }
    // })
    // console.log(Vue.options,'****');
}