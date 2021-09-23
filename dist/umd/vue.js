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

  // 但Object.defineProperty 不能兼容ie8及以下 所以vue2无法兼容ie8

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue如果数据的层次过多 需要第一的去解析对象中的和属性，依次增加set和get方法
      // vue3 的proxy 不用递归也不用加set和get
      this.walk(value);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); // [name,age,address]

        for (i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = data[key];
          defineReactive(data, key, value);
        }
      }
    }]);

    return Observer;
  }();

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

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      console.log(options);
      var vm = this;
      vm.$options = options; // 用户传递的属性 data,watch
      // 初始化状态

      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  } // 通过文件引入的方式，给vue原型挂载方法


  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
