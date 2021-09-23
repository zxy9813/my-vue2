/**
 * 
 * @param {*} data 当前数据是不是对象
 * @returns 
 */
export function isObject(data) {
    return typeof data === 'object' && data !== null
}