(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  } // 取值实现代理效果

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {};
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal); // res.__proto__ = parentVal
    // 先在自身上找 找不到再用父级的

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }

    return res;
  }

  strats.components = mergeAssets;

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  function mergeOptions$1(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      // 如果已经合并过了就不需要再次合并了
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } // 默认的合并策略 但是有些属性 需要有特殊的合并方式：生命周期合并


    function mergeField(key) {
      // 合并两个生命周期
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        // 子（新）覆盖父（旧）的
        // data:{}  data:123   -> data:123
        options[key] = child[key];
      }
    }

    return options;
  }
  function isReservedTag(tagName) {
    var str = 'div,p,input,span,button';
    var obj = {};
    str.split(',').forEach(function (tag) {
      obj[tag] = true;
    });
    return obj[tagName];
  }

  // 重写数组的7个方法 push  shift unshift pop reverse sort splice
  // slice不会改变原数组
  var oldArrayMethods = Array.prototype; // value.__protp__ = arrayMethods
  // arrayMethods.__proto__ = oldArrayMethods

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // console.log('用户调用了push'); // AOP切片编程
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
      ob.dep.notify();
      return result;
    };
  });

  // watcher 和 dep 是多对多的关系
  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher); // 观察者模式
      }
    }, {
      key: "depend",
      value: function depend() {
        // 让这个watcher 记住我当前的dep
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  var stack = []; // 21-10-21  目前可以做到保留和移除watcher的功能

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  // 但Object.defineProperty 不能兼容ie8及以下 所以vue2无法兼容ie8

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.dep = new Dep(); // 如果是数组，会对索引也添加set和get，最好对数组再进行特殊处理
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
    var dep = new Dep();
    var childOb = observe(value); // 是不是对象 递归实现深度检测 

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        // {{}}的值一开始走两次取值的原因是：JSON.stringfy会对内容进行一次取汁
        if (Dep.target) {
          // 如果当前有watcher
          dep.depend(); // 意味着我要将watcher存起来

          if (childOb) {
            // ******数组的依赖收集******
            childOb.dep.depend(); // 收集了数组的相关依赖
            // 如果数组中还有数组

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        console.log('取值');
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        console.log('设置值');
        observe(newValue); // 如果用户将一个值重新赋值成对象，需要劫持时做响应式

        value = newValue;
        dep.notify(); // 通知依赖的watcher进行更新操作
      }
    });
  }

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i]; // 将数组中的每一个都取出来 数据变化后 去更新视图
      // 数组中的数组的依赖收集

      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
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
    // console.log(data);
    // 数据劫持 用户改变数据时 希望可以得到通知 -> 刷新页面
    // MVVM模式 数据驱动视图变化
    // Object.defineProperty() 给属性添加get和set方法

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data); // 响应式
  }

  // ast语法树 是用对象来描述js语法的  虚拟dom  用对象来描述dom节点的
  // ?: 匹配不捕获
  // arguments[0] 匹配到的标签 arguments[1] 匹配到的标签名字
  // let r  = '<ab:cd>'.match(startTagOpen)
  // console.log(r);  ['<ab:cd','ab:cd']
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa 两个斜杠：字符串一层正则一层

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:dasda> 命名空间标签

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的</div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的 可以是双引号、单引号或者为空
  //console.log(`  aa=123`.match(attribute));

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的> 包含自闭合 <div />

  function parseHTML(html) {
    var root = null; // ast语法树的树根

    var currentParent; // 标识当前父亲是谁

    var stack = [];
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tagName, attrs) {
      // 遇到开始标签 就创建一个ast元素
      // console.log('开始标签', tagName, '属性是:', attrs);
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 把当前元素标记成父ast树

      stack.push(element);
    }

    function chars(text) {
      // console.log('文本是', text);
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    }

    function end(tagName) {
      // console.log('结束标签：', tagName);
      var element = stack.pop(); // 拿到的是ast对象
      // TODO: 是不是同一个 如 <div><p></a></p></div>
      // 要表示当前这个p是属于这个div的儿子的

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element); // 实现了一个树的父子关系
      }
    } // 不停的解析html


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        // 如果当前索引为0 肯定是一个标签 开始标签 结束标签
        var startTagMatch = parseStartTag(); // 通过这个方法获取到匹配的结果 tagName,attrs

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); // 1解析开始标签
          // console.log(666,startTagMatch);

          continue; // 如果开始标签匹配完毕后 继续下一次 匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); // 2解析结束标签

          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text); // 3解析文本
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        }; // console.log('-----',start);

        advance(start[0].length); // <div 将标签删除
        // console.log(html);

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 将属性进行解析
          advance(attr[0].length); // 将属性去掉

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          // 去掉开始标签的 >
          advance(_end[0].length);
          return match;
        } // console.log(match,html);

      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配花括号{{}}

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type == 1) {
      // 元素标签
      return generate(node);
    } else {
      // 文字标签
      var text = node.text; // a {{name}} b {{age}} c
      // _v("a"+_s(name)+"b"+_s(age)+"c")
      // 这里使用正则匹配，exec可以全取到，match只能取到name、age

      var tokens = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      } // 最后多余的字符串


      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      // [{name:'id',value:'app'}]
      var attr = attrs[i];

      if (attr.name == 'style') {
        (function () {
          // style="color:red;fontSize:14px" => style:{color:'red}.id:name
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    // 1）解析html字符串 将html字符串 -> ast语法树
    var root = parseHTML(template); // 需要将ast语法树转成render函数 就是字符串拼接 （模版引擎）

    var code = generate(root); // 核心思路就是将模版转化成下面这段字符串
    // <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树 再次转化成js的语法
    // _c("div",{id:app},_c("p",undefined,_v('hello'+_s(name))),_v('hello'))
    // 所有模版引擎的实现 都需要 new Function + with
    // with为了拿到data中的数据
    // function () {
    //     with(this){  this为vm实例 vm.render
    //         return _c("div",{id:"app",style:{"color":"red","background-color":" blue"}},_v("hello"),_c("p",undefined,_v("123"+_s(address))))
    //     }
    // }

    var renderFn = new Function("with(this){ return ".concat(code, "}"));
    console.log(root, '---'); // vue的render 他返回的是虚拟dom

    return renderFn;
  } // 结点

  var callbacks = []; // [flushSchedularQueue.userNextTick]

  var waiting = false;

  function flushCallback() {
    // console.log(callbacks);
    callbacks.forEach(function (cb) {
      return cb();
    });
    waiting = false;
    callbacks = [];
  }

  function nextTick(cb) {
    // 多次调用nextTick  如果没有刷新的时候  就先把他放到数组中，
    // 刷新后 更改waiting
    callbacks.push(cb);

    if (waiting === false) {
      // 当前是否已经等待
      setTimeout(flushCallback, 0);
      waiting = true;
    }
  }

  var queue = [];
  var has = {};

  function flushSchedularQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    queue = []; //  让下一次可以继续使用

    has = {};
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      has[id] = true; // 宏任务和微任务 （vue里面使用Vue.nextTick)
      // Vue.nextTick = promise/mutationObserver/ setImmediate/setTimeout

      queue.push(watcher);
      nextTick(flushSchedularQueue);
    }
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      // 固定顺序
      this.vm = vm;
      this.getter = exprOrFn; // 将传来的函数放到getter属性上

      this.callback = callback;
      this.options = options;
      this.id = id++;
      this.depsId = new Set(); // es6中的集合（不能放重复项）

      this.deps = [];
      this.get();
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        // watcher里不能放重复的dep，反之同理
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); // 把watcher存起来 Dep.target

        this.getter(); // 渲染watcher的执行

        popTarget(); // 移除watcher
      }
    }, {
      key: "update",
      value: function update() {
        // this.get()
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }(); // 在模版中取值时  会进行依赖收集  在更改数据时会进行对应的watcher 调用更新操作

  function patch(oldVnode, vnode) {
    if (!oldVnode) {
      // 通过当前的虚拟节点 创建元素并返回
      return createElm(vnode);
    } else {
      // 递归创建真实节点 替换掉老的节点
      var isRealElement = oldVnode.nodeType;

      if (isRealElement) {
        var oldElm = oldVnode;
        var parentElm = oldVnode.parentNode;
        var el = createElm(vnode);
        parentElm.insertBefore(el, oldElm.nextSibling); // 新的插到旧的下面去

        parentElm.removeChild(oldElm);
        return el;
      } else {
        // 1.标签不一致,直接替换
        if (oldVnode.tag !== vnode.tag) {
          oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
        } // 2.文本


        if (!oldVnode.tag) {
          oldVnode.el.textContent = vnode.text;
        } // 3.标签一致且不是文本 对比属性


        vnode.el = oldVnode.el;

        updateProperties(vnode, oldVnode.data);
      }
    }
  }

  function createComponent$1(vnode) {
    var i = vnode.data;

    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    } // 执行完毕后


    if (vnode.componentInstance) {
      return true;
    }
  }

  function createElm(vnode) {
    // 根据虚拟节点 常见真实的节点
    // return document.createElement('div')
    var tag = vnode.tag;
        vnode.data;
        vnode.key;
        var children = vnode.children,
        text = vnode.text; // 是标签就创建标签

    if (typeof tag === 'string') {
      // 组件没有孩子 需要一层判断
      if (createComponent$1(vnode)) {
        // 这里应该返回的是真实的dom元素
        return vnode.componentInstance.$el;
      }

      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child)); // 递归创建儿子节点 将儿子节点扔到父节点中
      });
    } else {
      // 虚拟dom上映射真实dom 方便后续操作
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    console.log(el, newProps, oldProps);
    var el = vnode.el; // 如果老的属性有 新的属性没有 就在真实dom上将这个属性删掉

    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {}; // mergeOptions

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        el.style[key] = '';
      }
    }

    for (var _key in oldProps) {
      if (!newProps[_key]) {
        el.removeAttribute(_key);
      }
    }

    console.log(el, newProps, oldProps);

    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          // 新增样式
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // 拿到render返回的虚拟节点 生成真实节点
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    vm.$options;
    vm.$el = el; // 真实的dom元素
    // Watcher 就是用来渲染的
    // vm._render 通过解析的render方法 渲染出虚拟dom
    // vm._update 通过虚拟dom 创建真实的dom

    callHook(vm, 'beforeMount'); // 渲染页面

    var updateComponent = function updateComponent() {
      // 无论是渲染还是更新都会调用此方法
      console.log('调用了update'); // 返回的是虚拟dom

      vm._update(vm._render());
    }; // 渲染watcher  每个组件都有一个watcher
    // 每次数据变化后 都会重新执行updateComponent方法


    new Watcher(vm, updateComponent, function () {}, true); // true表示他是一个渲染watcher

    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook]; // [fn,fn,fn]

    if (handlers) {
      // 找到对应的钩子依次执行
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm); // 保证传来的beforeCreate中的调用的this指向实例
      }
    }
  }

  function initMixin$1(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      console.log(options);
      var vm = this;
      vm.$options = mergeOptions$1(vm.constructor.options, options); // 用户传递的属性 data,watch       

      console.log(vm.$options, '!!!!!!!'); // Attention:这里注意不要写成:
      // vm.$options = mergeOptions(Vue.options,options) 
      // 因为有这样一种情况（子类调用）
      // A extends Vue    A继承了Vue
      // let a = new A
      // a._init     这样调用才保证options这里是A而不是Vue

      callHook(vm, 'beforeCreate'); // 初始化状态

      initState(vm);
      callHook(vm, 'created'); // 如果用户传入了el属性 需要将页面渲染出来 
      // 实现挂载流程

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
        console.log('render:', render);
        options.render = render; // 需要把template 转换成render函数  vue1.0用的正则 vue2.0虚拟dom
      } // options.render
      // 渲染当前组件 挂载这个组件


      mountComponent(vm, el);
    }; // 用户调用的nexttick


    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    // ast => render => 调用render时走到这里
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      // 如果是标签
      return vnode(tag, data, key, children, undefined);
    } else {
      // 如果是组件
      var Ctor = vm.$options.components[tag]; // 找到了子组件的构造函数

      return createComponent(vm, tag, data, key, children, Ctor);
    }
  }

  function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor); // Vue.extend()
    }

    data.hook = {
      init: function init(vnode) {
        // 当前组件的实例就是componentInstance
        var child = vnode.componentInstance = new Ctor({
          _isComponent: true
        }); // 组件的挂载 vm.$el

        child.$mount(); // return child;
      }
    };
    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, {
      Ctor: Ctor,
      children: children
    }); // 组件内的不叫孩子叫插槽
  }

  function createTextNode(vm, text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text, componentOptions) {
    // !!!!!!!!
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  } // 虚拟节点 就是通过_c _v 实现用对象来描述dom的操作（对象）
  // 1）将template 转成ast树 -> 生成render方法 -> 生成虚拟dom -> 真实的dom
  // 页面更新的话 重新生成虚拟dom 和上次做对比 -> 更新dom
  // {
  //     tag:'div',
  //     key:undefined,
  //     data:{},
  //     children:[],
  //     text:undefined
  // }

  function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringfy
    Vue.prototype._c = function () {
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments))); // tag,data,children1,children
    };

    Vue.prototype._v = function (text) {
      return createTextNode(this, text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; //    console.log(render,this._s(),this);
      //    render()是不行的 render中with(this){内部this指向的是window} 必须绑定

      var vnode = render.call(vm); // 去实例上取值

      return vnode;
    };
  }

  function initMixin(Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
  }

  var ASSETS_TYPE = ['component', 'filter', 'directive'];

  function initAssetRegisters(Vue) {
    ASSETS_TYPE.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (type === 'component') {
          // 注册全局组件
          // 调用extend
          // 子组件可能也有component方法 希望extend的调用永远是父类所以
          definition = this.options._base.extend(definition);
        }

        this.options[type + 's'][id] = definition;
      };
    });
  }

  function initExtend(Vue) {
    var cid = 0;

    Vue.extend = function (extendOptions) {
      var Sub = function VueComponent(options) {
        this._init(options);
      }; // 让子类也拥有父类的方法


      Sub.cid = cid++;
      Sub.prototype = Object.create(this.prototype); // JS 原生问题

      Sub.prototype.constructor = Sub; // 必须来这么一下 否则使用object.create后 Sub类的实例的构造函数会指向父类

      Sub.options = mergeOptions$1(this.options, extendOptions);
      return Sub;
    };
  }

  function initGlobalAPI(Vue) {
    // 全局api不在实例上 放在一个对象里整合了所有全局内容
    Vue.options = {};
    initMixin(Vue);
    ASSETS_TYPE.forEach(function (type) {
      Vue.options[type + 's'] = {};
    });
    Vue.options._base = Vue;
    initExtend(Vue);
    initAssetRegisters(Vue); // 生命周期的合并策略   [beforeCreate,beforeCreate]
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

  function Vue(options) {
    // 进行Vue的初始化操作
    this._init(options);
  } // 通过文件引入的方式，给vue原型挂载方法


  initMixin$1(Vue); // 给原型上添加一个_init方法

  renderMixin(Vue);
  lifecycleMixin(Vue); // 初始化全局api

  initGlobalAPI(Vue); // demo 比对两个vnode

  var vm1 = new Vue({
    data: {
      name: 'kitty'
    }
  });
  var render1 = compileToFunction('<div id="aaa" a="q" style="background-color:red;">hello {{name}}</div>');
  var vnode1 = render1.call(vm1);
  var el = createElm(vnode1);
  document.body.appendChild(el);
  console.log('第一个实例', render1, vnode1);
  var vm2 = new Vue({
    data: {
      name: 'motor'
    }
  });
  var render2 = compileToFunction('<div id="ccc" b="p" style="color:blue">hello {{name}}<span>!</span></div>');
  var vnode2 = render2.call(vm2);
  console.log('第二个实例', render2, vnode2);
  setTimeout(function () {
    patch(vnode1, vnode2);
  }, 3000); // 1.diff算法的特点是 平级比对，我们正常操作dom元素，很少涉及到父变成子 子变成父 这里时间复杂度O(n^3)

  return Vue;

}));
//# sourceMappingURL=vue.js.map
