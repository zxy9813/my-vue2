import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: 'src/index.js', // 入口  两种写法 src/    ./src/
    output: {
        file:'./dist/umd/vue.js', // 出口   两种写法 dist/    ./dist/
        name: 'Vue', // 全局变量
        format: 'umd', // 模块规范
        sourcemap: true // es6 -> es5 找到es6的报错而不是es5
    },
    plugins:[
        babel({
            exclude:'/node_modules/**' // 排除node_modules下所有文件
        }),
        process.env.ENV === 'development'?serve({
            open: true,
            openPage: '/public/index.html', // 默认打开html的路径      // 只有一种写法 /public ???
            port: 3001,
            contentBase: '' // 静态文件路径，默认为空，即当前文件夹，就能找到public
        }):null
    ]
    

}