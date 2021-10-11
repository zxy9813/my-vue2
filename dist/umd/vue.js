(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * 
   * @param {*} data 当前数据是不是对象
   * @returns 
   */
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  /**
   * 定义一个不可枚举的属性
   * @param {*} data 
   * @param {*} key 
   * @param {*} value 
   */

  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  // 重写数组的7个方法 push  shift unshift pop reverse sort splice
  // slice不会改变原数组
  var oldArrayMethods = Array.prototype; // value.__protp__ = arrayMethods
  // arrayMethods.__proto__ = oldArrayMethods

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log('用户调用了push'); // AOP切片编程

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); // 调用原生的数组方法
      // push unshift 添加的元素可能还是一个对象

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // 3个 新增的属性 splice 有删除 新增的功能 arr.splice(0,1,{name:1})
          inserted = args.slice(2);
      }

      if (inserted) ob.observerArray(inserted);
      return result;
    };
  });

  // 但Object.defineProperty 不能兼容ie8及以下 所以vue2无法兼容ie8

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 如果是数组，会对索引也添加set和get，最好对数组再进行特殊处理
      // value.__ob__ = this // 给每一个监控过的对象都加一个属性
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // 不要对索引进行观测，影响性能
        // 如果数组里放的是对象，再监控
        // push shift 劫持
        value.__proto__ = arrayMethods;
        this.observerArray(value);
      } else {
        // vue如果数据的层次过多 需要第一的去解析对象中的和属性，依次增加set和get方法
        // vue3 的proxy 不用递归也不用加set和get
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        // [{}]
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      } // 遍历对象用

    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); // [name,age,address] ,对象中属性组成的数组

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        }); // for ( let i = 0; i < keys.length; i++ ) {
        //     let key = keys[i]; // 取第i个属性
        //     let value = data[key]; // 取第i个值
        //     defineReactive(data,key,value) // 把这个key value变成响应式
        // }
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); // 是不是对象 递归实现深度检测 

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        console.log('值发生变化了');
        observe(newValue); // 如果用户将一个值重新赋值成对象，需要劫持时做响应式

        value = newValue;
      }
    });
  } // 是不是对象


  function observe(data) {
    var isObj = isObject(data); // 不是对象

    if (!isObj) {
      return;
    } // 是对象 需要观测数据 


    return new Observer(data);
  }

  function initState(vm) {
    // vue的数据来源 属性 方法 数据 计算属性 watch ,也是vue的初始化流程
    var opts = vm.$options; // console.log(opts);

    if (opts.props) ;

    if (opts.method) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    // 数据初始化
    var data = vm.$options.data; // 用户传递的data

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // data可能是个函数（返回值是对象），也可能是对象，只需要对象

    console.log(data); // 数据劫持 用户改变数据时 希望可以得到通知 -> 刷新页面
    // MVVM模式 数据驱动视图变化
    // Object.defineProperty() 给属性添加get和set方法

    observe(data); // 响应式
  }

  // ast语法树 是用对象来描述js语法的  虚拟dom  用对象来描述dom节点的
  function compileToFunction(template) {
    console.log(template, '---');
    return function render() {};
  } // 结点

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      console.log(options);
      var vm = this;
      vm.$options = options; // 用户传递的属性 data,watch
      // 初始化状态

      initState(vm); // 如果用户传入了el属性 需要将页面渲染出来 
      // 实现挂在流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 返回一个dom元素
      // 默认会先查找有没有render  没有render会用template 没有template用el中的内容

      if (!options.render) {
        // 对模版进行编译
        var template = options.template; // 取出模版

        if (!template && el) {
          template = el.outerHTML; // 整个div  
        }

        console.log(template);
        var render = compileToFunction(template);
        options.render = render; // 需要把template 转换成render函数  vue1.0用的正则 vue2.0虚拟dom
      } // options.render

    };
  }

  function Vue(options) {
    this._init(options);
  } // 通过文件引入的方式，给vue原型挂载方法


  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
