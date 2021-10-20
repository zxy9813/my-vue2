import { mergeOptions } from "../util/index";

export function initGlobalAPI(Vue) {
    // 全局api不在实例上 放在一个对象里整合了所有全局内容
    Vue.options = {};
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options,mixin)
    }
    
    // 生命周期的合并策略   [beforeCreate,beforeCreate]
    Vue.mixin({
        b:{m:1},
        c:1,
        beforeCreate(){

        }
    })
    Vue.mixin({
        b:{n:2},
        d:2,
        beforeCreate(){

        }
    })
    console.log(Vue.options,'****');
}