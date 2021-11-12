import { ASSETS_TYPE } from "./const";

export default function initAssetRegisters(Vue) {
    ASSETS_TYPE.forEach(type=>{
        Vue[type] = function (id, definition) {
            if (type === 'component') {
                // 注册全局组件
                // 调用extend
                // 子组件可能也有component方法 希望extend的调用永远是父类所以
                definition = this.options._base.extend(definition)
            }else if (type === 'filter') {

            }else if (type === 'directive') {

            }
            this.options[type+'s'][id] = definition
        }
    })
}