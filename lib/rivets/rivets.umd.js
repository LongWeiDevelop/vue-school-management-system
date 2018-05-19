(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.rivets = factory());
}(this, (function () { 'use strict';

const OPTIONS = [
  'prefix',
  'templateDelimiters',
  'rootInterface',
  'preloadData',
  'handler'
];

const EXTENSIONS = [
  'binders',
  'formatters',
  'adapters'
];

const PRIMITIVE = 0;
const KEYPATH = 1;
const TEXT = 0;
const BINDING = 1;

const QUOTED_STR = /^'.*'$|^".*"$/;

// Parser and tokenizer for getting the type and value from a string.
function parseType(string) {
  let type = PRIMITIVE;
  let value = string;

  if (QUOTED_STR.test(string)) {
    value = string.slice(1, -1);
  } else if (string === 'true') {
    value = true;
  } else if (string === 'false') {
    value = false;
  } else if (string === 'null') {
    value = null;
  } else if (string === 'undefined') {
    value = undefined;
  } else if (!isNaN(string)) {
    value = Number(string);
  } else {
    type = KEYPATH;
  }

  return {type: type, value: value}
}

// Template parser and tokenizer for mustache-style text content bindings.
// Parses the template and returns a set of tokens, separating static portions
// of text from binding declarations.
function parseTemplate(template, delimiters) {
  var tokens;
  let length = template.length;
  let index = 0;
  let lastIndex = 0;
  let open = delimiters[0], close = delimiters[1];

  while (lastIndex < length) {
    index = template.indexOf(open, lastIndex);

    if (index < 0) {
      if (tokens) {
        tokens.push({
          type: TEXT,
          value: template.slice(lastIndex)
        });
      }

      break
    } else {
      tokens || (tokens = []);
      if (index > 0 && lastIndex < index) {
        tokens.push({
          type: TEXT,
          value: template.slice(lastIndex, index)
        });
      }

      lastIndex = index + open.length;
      index = template.indexOf(close, lastIndex);

      if (index < 0) {
        let substring = template.slice(lastIndex - close.length);
        let lastToken = tokens[tokens.length - 1];

        if (lastToken && lastToken.type === TEXT) {
          lastToken.value += substring;
        } else {
          tokens.push({
            type: TEXT,
            value: substring
          });
        }

        break
      }

      let value = template.slice(lastIndex, index).trim();

      tokens.push({
        type: BINDING,
        value: value
      });

      lastIndex = index + close.length;
    }
  }

  return tokens
}

const rivets$1 = {
  // Global binders.
  binders: {},

  // Global formatters.
  formatters: {},

  // Global sightglass adapters.
  adapters: {},

  // Default attribute prefix.
  _prefix: 'rv',

  _fullPrefix: 'rv-',

  get prefix () {
    return this._prefix
  },

  set prefix (value) {
    this._prefix = value;
    this._fullPrefix = value + '-';
  },

  parseTemplate: parseTemplate,

  parseType: parseType,

  // Default template delimiters.
  templateDelimiters: ['{', '}'],

  // Default sightglass root interface.
  rootInterface: '.',

  // Preload data by default.
  preloadData: true,

  // Default event handler.
  handler: function(context, ev, binding) {
    this.call(context, ev, binding.view.models,binding);
  },

  // Sets the attribute on the element. If no binder above is matched it will fall
  // back to using this binder.
  fallbackBinder: function(el, value) {
    if (value != null) {
      el.setAttribute(this.type, value);
    } else {
      el.removeAttribute(this.type);
    }  
  },

  // Merges an object literal into the corresponding global options.
  configure: function(options) {
    if (!options) {
      return
    }
    Object.keys(options).forEach(option => {
      let value = options[option];

      if (EXTENSIONS.indexOf(option) > -1) {
        Object.keys(value).forEach(key => {
          this[option][key] = value[key];
        });
      } else {
        this[option] = value;
      }
    });
  }
};
window.rivets = rivets$1;

// Check if a value is an object than can be observed.
function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

// Error thrower.
function error(message) {
  throw new Error('[Observer] ' + message)
}

var adapters;
var interfaces;
var rootInterface;

// Constructs a new keypath observer and kicks things off.
function Observer(obj, keypath, callback) {
  this.keypath = keypath;
  this.callback = callback;
  this.objectPath = [];
  this.parse();
  this.obj = this.getRootObject(obj);

  if (isObject(this.target = this.realize())) {
    this.set(true, this.key, this.target, this.callback);
  }
}

Observer.updateOptions = function(options) {
  adapters = options.adapters;
  interfaces = Object.keys(adapters);
  rootInterface = options.rootInterface;
};

// Tokenizes the provided keypath string into interface + path tokens for the
// observer to work with.
Observer.tokenize = function(keypath, root) {
  var tokens = [];
  var current = {i: root, path: ''};
  var index, chr;

  for (index = 0; index < keypath.length; index++) {
    chr = keypath.charAt(index);

    if (!!~interfaces.indexOf(chr)) {
      tokens.push(current);
      current = {i: chr, path: ''};
    } else {
      current.path += chr;
    }
  }

  tokens.push(current);
  return tokens
};

// Parses the keypath using the interfaces defined on the view. Sets variables
// for the tokenized keypath as well as the end key.
Observer.prototype.parse = function() {
  var path, root;

  if (!interfaces.length) {
    error('Must define at least one adapter interface.');
  }

  if (!!~interfaces.indexOf(this.keypath[0])) {
    root = this.keypath[0];
    path = this.keypath.substr(1);
  } else {
    root = rootInterface;
    path = this.keypath;
  }

  this.tokens = Observer.tokenize(path, root);
  this.key = this.tokens.pop();
};

// Realizes the full keypath, attaching observers for every key and correcting
// old observers to any changed objects in the keypath.
Observer.prototype.realize = function() {
  var current = this.obj;
  var unreached = -1;
  var prev;
  var token;

  for (let index = 0; index < this.tokens.length; index++) {
    token = this.tokens[index];
    if (isObject(current)) {
      if (typeof this.objectPath[index] !== 'undefined') {
        if (current !== (prev = this.objectPath[index])) {
          this.set(false, token, prev, this);
          this.set(true, token, current, this);
          this.objectPath[index] = current;
        }
      } else {
        this.set(true, token, current, this);
        this.objectPath[index] = current;
      }

      current = this.get(token, current);
    } else {
      if (unreached === -1) {
        unreached = index;
      }

      if (prev = this.objectPath[index]) {
        this.set(false, token, prev, this);
      }
    }
  }

  if (unreached !== -1) {
    this.objectPath.splice(unreached);
  }

  return current
};

// Updates the keypath. This is called when any intermediary key is changed.
Observer.prototype.sync = function() {
  var next, oldValue, newValue;

  if ((next = this.realize()) !== this.target) {
    if (isObject(this.target)) {
      this.set(false, this.key, this.target, this.callback);
    }

    if (isObject(next)) {
      this.set(true, this.key, next, this.callback);
    }

    oldValue = this.value();
    this.target = next;
    newValue = this.value();
    if (newValue !== oldValue || newValue instanceof Function) this.callback.sync();
  } else if (next instanceof Array) {
    this.callback.sync();
  }
};

// Reads the current end value of the observed keypath. Returns undefined if
// the full keypath is unreachable.
Observer.prototype.value = function() {
  if (isObject(this.target)) {
    return this.get(this.key, this.target)
  }
};

// Sets the current end value of the observed keypath. Calling setValue when
// the full keypath is unreachable is a no-op.
Observer.prototype.setValue = function(value) {
  if (isObject(this.target)) {
    adapters[this.key.i].set(this.target, this.key.path, value);
  }
};

// Gets the provided key on an object.
Observer.prototype.get = function(key, obj) {
  return adapters[key.i].get(obj, key.path)
};

// Observes or unobserves a callback on the object using the provided key.
Observer.prototype.set = function(active, key, obj, callback) {
  var action = active ? 'observe' : 'unobserve';
  adapters[key.i][action](obj, key.path, callback);
};


// Unobserves the entire keypath.
Observer.prototype.unobserve = function() {
  var obj;
  var token;

  for (let index = 0; index < this.tokens.length; index++) {
    token = this.tokens[index];
    if (obj = this.objectPath[index]) {
      this.set(false, token, obj, this);
    }
  }

  if (isObject(this.target)) {
    this.set(false, this.key, this.target, this.callback);
  }
};
// traverse the scope chain to find the scope which has the root property
// if the property is not found in chain, returns the root scope
Observer.prototype.getRootObject = function (obj) {
  var rootProp, current;
  if (!obj.$parent) {
    return obj;
  }

  if (this.tokens.length) {
    rootProp = this.tokens[0].path;
  } else {
    rootProp = this.key.path;
  }

  current = obj;
  while (current.$parent && (current[rootProp] === undefined)) {
    current = current.$parent;
  }

  return current;
};

function getInputValue(el) {
  let results = [];
  if (el.type === 'checkbox') {
    return el.checked
  } else if (el.type === 'select-multiple') {

    el.options.forEach(option => {
      if (option.selected) {
        results.push(option.value);
      }
    });

    return results
  } else {
    return el.value
  }
}

const FORMATTER_ARGS =  /[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g;
const FORMATTER_SPLIT = /\s+/;

// A single binding between a model attribute and a DOM element.
class Binding {
  // All information about the binding is passed into the constructor; the
  // containing view, the DOM node, the type of binding, the model object and the
  // keypath at which to listen for changes.
  constructor(view, el, type, keypath, binder, arg, formatters) {
    this.view = view;
    this.el = el;
    this.type = type;
    this.keypath = keypath;
    this.binder = binder;
    this.arg = arg;
    this.formatters = formatters;
    this.formatterObservers = {};
    this.model = undefined;
  }

  // Observes the object keypath
  observe(obj, keypath) {
    return new Observer(obj, keypath, this)
  }

  parseTarget() {
    if (this.keypath) {
      let token = parseType(this.keypath);

      if (token.type === 0) {
        this.value = token.value;
      } else {
        this.observer = this.observe(this.view.models, this.keypath);
        this.model = this.observer.target;
      }
    } else {
      this.value = undefined;
    }
  }

  parseFormatterArguments(args, formatterIndex) {
    return args
      .map(parseType)
      .map(({type, value}, ai) => {
        if (type === 0) {
          return value
        } else {
          if (!this.formatterObservers[formatterIndex]) {
            this.formatterObservers[formatterIndex] = {};
          }

          let observer = this.formatterObservers[formatterIndex][ai];

          if (!observer) {
            observer = this.observe(this.view.models, value);
            this.formatterObservers[formatterIndex][ai] = observer;
          }

          return observer.value()
        }
      })
  }

  // Applies all the current formatters to the supplied value and returns the
  // formatted value.
  formattedValue(value) {
    return this.formatters.reduce((result, declaration, index) => {
      let args = declaration.match(FORMATTER_ARGS);
      let id = args.shift();
      let formatter = this.view.options.formatters[id];

      const processedArgs = this.parseFormatterArguments(args, index);

      if (formatter && (formatter.read instanceof Function)) {
        result = formatter.read(result, ...processedArgs);
      } else if (formatter instanceof Function) {
        result = formatter(result, ...processedArgs);
      }
      return result
    }, value)
  }

  // Returns an event handler for the binding around the supplied function.
  eventHandler(fn) {
    let binding = this;
    let handler = binding.view.options.handler;

    return function(ev) {
      handler.call(fn, this, ev, binding);
    }
  }

  // Sets the value for the binding. This Basically just runs the binding routine
  // with the supplied value formatted.
  set(value) {
    if ((value instanceof Function) && !this.binder.function) {
      value = this.formattedValue(value.call(this.model));
    } else {
      value = this.formattedValue(value);
    }

    let routineFn = this.binder.routine || this.binder;

    if (routineFn instanceof Function) {
      routineFn.call(this, this.el, value);
    }
  }

  // Syncs up the view binding with the model.
  sync() {
    if (this.observer) {
      this.model = this.observer.target;
      this.set(this.observer.value());
    } else {
        this.set(this.value);
    }
  }

  // Publishes the value currently set on the input element back to the model.
  publish() {
    if (this.observer) {
      var value = this.formatters.reduceRight((result, declaration, index) => {
        const args = declaration.split(FORMATTER_SPLIT);
        const id = args.shift();
        const formatter = this.view.options.formatters[id];
        const processedArgs = this.parseFormatterArguments(args, index);

        if (formatter && formatter.publish) {
          result = formatter.publish(result, ...processedArgs);
        }
        return result
      }, this.getValue(this.el));

      this.observer.setValue(value);
    }
  }

  // Subscribes to the model for changes at the specified keypath. Bi-directional
  // routines will also listen for changes on the element to propagate them back
  // to the model.
  bind() {
    this.parseTarget();

    if (this.binder.hasOwnProperty('bind')) {
      this.binder.bind.call(this, this.el);
    }

    if (this.view.options.preloadData) {
      this.sync();
    }
  }

  // Unsubscribes from the model and the element.
  unbind() {
    if (this.binder.unbind) {
      this.binder.unbind.call(this, this.el);
    }

    if (this.observer) {
      this.observer.unobserve();
    }

    Object.keys(this.formatterObservers).forEach(fi => {
      let args = this.formatterObservers[fi];

      Object.keys(args).forEach(ai => {
        args[ai].unobserve();
      });
    });

    this.formatterObservers = {};
  }

  // Updates the binding's model from what is currently set on the view. Unbinds
  // the old model first and then re-binds with the new model.
  update(models = {}) {
    if (this.observer) {
      this.model = this.observer.target;
    }

    if (this.binder.update) {
      this.binder.update.call(this, models);
    }
  }

  // Returns elements value
  getValue(el) {
    if (this.binder && this.binder.getValue) {
      return this.binder.getValue.call(this, el)
    } else {
      return getInputValue(el)
    }
  }
}

const textBinder = {
  routine: (node, value) => {
    node.data = (value != null) ? value : '';
  }
};

const DECLARATION_SPLIT = /((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g;

const parseNode = (view, node) => {
  let block = false;

  if (node.nodeType === 3) {
    let tokens = parseTemplate(node.data, rivets$1.templateDelimiters);

    if (tokens) {
      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let text = document.createTextNode(token.value);
        node.parentNode.insertBefore(text, node);

        if (token.type === 1) {
          view.buildBinding(text, null, token.value, textBinder, null);
        }
      }

      node.parentNode.removeChild(node);
    }
    block = true;
  } else if (node.nodeType === 1) {
    block = view.traverse(node);
  }

  if (!block) {
    for (let i = 0; i < node.childNodes.length; i++) {
      parseNode(view, node.childNodes[i]);
    }
  }
};

const bindingComparator = (a, b) => {
  let aPriority = a.binder ? (a.binder.priority || 0) : 0;
  let bPriority = b.binder ? (b.binder.priority || 0) : 0;
  return bPriority - aPriority
};

const trimStr = (str) => {
  return str.trim()
};

// A collection of bindings built from a set of parent nodes.
class View {
  // The DOM elements and the model objects for binding are passed into the
  // constructor along with any local options that should be used throughout the
  // context of the view and it's bindings.
  constructor(els, models, options) {
    if (els.jquery || els instanceof Array) {
      this.els = els;
    } else {
      this.els = [els];
    }

    this.models = models;
    this.options = options;

    this.build();
  }


  buildBinding(node, type, declaration, binder, arg) {
    let pipes = declaration.match(DECLARATION_SPLIT).map(trimStr);

    let keypath = pipes.shift();

    this.bindings.push(new Binding(this, node, type, keypath, binder, arg, pipes));
  }

  // Parses the DOM tree and builds `Binding` instances for every matched
  // binding declaration.
  build() {
    this.bindings = [];

    let elements = this.els, i, len;
    for (i = 0, len = elements.length; i < len; i++) {
      parseNode(this, elements[i]);
    }

    this.bindings.sort(bindingComparator);
  }

  traverse(node) {
    let bindingPrefix = rivets$1._fullPrefix;
    let block = node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE';
    let attributes = node.attributes;
    let bindInfos = [];
    let starBinders = this.options.starBinders;
    var type, binder, identifier, arg;


    for (let i = 0, len = attributes.length; i < len; i++) {
      let attribute = attributes[i];
      if (attribute.name.indexOf(bindingPrefix) === 0) {
        type = attribute.name.slice(bindingPrefix.length);
        binder = this.options.binders[type];
        arg = undefined;

        if (!binder) {
          for (let k = 0; k < starBinders.length; k++) {
            identifier = starBinders[k];
            if (type.slice(0, identifier.length - 1) === identifier.slice(0, -1)) {
              binder = this.options.binders[identifier];
              arg = type.slice(identifier.length - 1);
              break
            }
          }
        }

        if (!binder) {
          binder = rivets$1.fallbackBinder;
        }

        if (binder.block) {
          this.buildBinding(node, type, attribute.value, binder, arg);
          node.removeAttribute(attribute.name);
          return true;
        }

        bindInfos.push({attr: attribute, binder: binder, type: type, arg: arg});
      }
    }

    for (let i = 0; i < bindInfos.length; i++) {
      let bindInfo = bindInfos[i];
      this.buildBinding(node, bindInfo.type, bindInfo.attr.value, bindInfo.binder, bindInfo.arg);
      node.removeAttribute(bindInfo.attr.name);
    }

    return block
  }

  // Binds all of the current bindings for this view.
  bind() {
    this.bindings.forEach(binding => {
      binding.bind();
    });
  }

  // Unbinds all of the current bindings for this view.
  unbind() {
    this.bindings.forEach(binding => {
      binding.unbind();
    });
  }

  // Syncs up the view with the model by running the routines on all bindings.
  sync() {
    this.bindings.forEach(binding => {
      binding.sync();
    });
  }

  // Publishes the input values from the view back to the model (reverse sync).
  publish() {
    this.bindings.forEach(binding => {
      if (binding.binder && binding.binder.publishes) {
        binding.publish();
      }
    });
  }

  // Updates the view's models along with any affected bindings.
  update(models = {}) {
    Object.keys(models).forEach(key => {
      this.models[key] = models[key];
    });

    this.bindings.forEach(binding => {
      if (binding.update) {
        binding.update(models);
      }
    });
  }
}

// The default `.` adapter that comes with Rivets.js. Allows subscribing to
// properties on plain objects, implemented in ES5 natives using
// `Object.defineProperty`.

const ARRAY_METHODS = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice'
];

const adapter = {
  counter: 0,
  weakmap: {},

  weakReference: function(obj) {
    if (!obj.hasOwnProperty('__rv')) {
      let id = this.counter++;

      Object.defineProperty(obj, '__rv', {
        value: id
      });
    }

    if (!this.weakmap[obj.__rv]) {
      this.weakmap[obj.__rv] = {
        callbacks: {}
      };
    }

    return this.weakmap[obj.__rv]
  },

  cleanupWeakReference: function(ref, id) {
    if (!Object.keys(ref.callbacks).length) {
      if (!(ref.pointers && Object.keys(ref.pointers).length)) {
        delete this.weakmap[id];
      }
    }
  },

  stubFunction: function(obj, fn) {
    let original = obj[fn];
    let map = this.weakReference(obj);
    let weakmap = this.weakmap;

    obj[fn] = (...args) => {
      let response = original.apply(obj, args);

      Object.keys(map.pointers).forEach(r => {
        let k = map.pointers[r];

        if (weakmap[r]) {
          if (weakmap[r].callbacks[k] instanceof Array) {
            weakmap[r].callbacks[k].forEach(callback => {
              callback.sync();
            });
          }
        }
      });

      return response
    };
  },

  observeMutations: function(obj, ref, keypath) {
    if (obj instanceof Array) {
      let map = this.weakReference(obj);

      if (!map.pointers) {
        map.pointers = {};

        ARRAY_METHODS.forEach(fn => {
          this.stubFunction(obj, fn);
        });
      }

      if (!map.pointers[ref]) {
        map.pointers[ref] = [];
      }

      if (map.pointers[ref].indexOf(keypath) === -1) {
        map.pointers[ref].push(keypath);
      }
    }
  },

  unobserveMutations: function(obj, ref, keypath) {
    if ((obj instanceof Array) && (obj.__rv != null)) {
      let map = this.weakmap[obj.__rv];

      if (map) {
        let pointers = map.pointers[ref];

        if (pointers) {
          let idx = pointers.indexOf(keypath);

          if (idx > -1) {
            pointers.splice(idx, 1);
          }

          if (!pointers.length) {
            delete map.pointers[ref];
          }

          this.cleanupWeakReference(map, obj.__rv);
        }
      }
    }
  },

  observe: function(obj, keypath, callback) {
    var value;
    let callbacks = this.weakReference(obj).callbacks;

    if (!callbacks[keypath]) {
      callbacks[keypath] = [];
      let desc = Object.getOwnPropertyDescriptor(obj, keypath);

      if (!desc || !(desc.get || desc.set || !desc.configurable)) {
        value = obj[keypath];

        Object.defineProperty(obj, keypath, {
          enumerable: true,

          get: () => {
            return value
          },

          set: newValue => {
            if (newValue !== value) {
              this.unobserveMutations(value, obj.__rv, keypath);
              value = newValue;
              let map = this.weakmap[obj.__rv];

              if (map) {
                let callbacks = map.callbacks[keypath];

                if (callbacks) {
                  callbacks.forEach(cb => {
                      cb.sync();
                  });
                }

                this.observeMutations(newValue, obj.__rv, keypath);
              }
            }
          }
        });
      }
    }

    if (callbacks[keypath].indexOf(callback) === -1) {
      callbacks[keypath].push(callback);
    }

    this.observeMutations(obj[keypath], obj.__rv, keypath);
  },

  unobserve: function(obj, keypath, callback) {
    let map = this.weakmap[obj.__rv];

    if (map) {
      let callbacks = map.callbacks[keypath];

      if (callbacks) {
        let idx = callbacks.indexOf(callback);

        if (idx > -1) {
          callbacks.splice(idx, 1);

          if (!callbacks.length) {
            delete map.callbacks[keypath];
            this.unobserveMutations(obj[keypath], obj.__rv, keypath);
          }
        }

        this.cleanupWeakReference(map, obj.__rv);
      }
    }
  },

  get: function(obj, keypath) {
    return obj[keypath]
  },

  set: (obj, keypath, value) => {
    obj[keypath] = value;
  }
};

const getString = (value) => {
  return value != null ? value.toString() : undefined
};

const times = (n, cb) => {
  for (let i = 0; i < n; i++) cb();
};

function createView(binding, data, anchorEl) {
  let template = binding.el.cloneNode(true);
  let view = new View(template, data, binding.view.options);
  view.bind();
  binding.marker.parentNode.insertBefore(template, anchorEl);
  return view
}

const binders = {
  // Binds an event handler on the element.
  'on-*': {
    function: true,
    priority: 1000,

    unbind: function(el) {
      if (this.handler) {
        el.removeEventListener(this.arg, this.handler);
      }
    },

    routine: function(el, value) {
      if (this.handler) {
        el.removeEventListener(this.arg, this.handler);
      }

      this.handler = this.eventHandler(value);
      el.addEventListener(this.arg, this.handler);
    }
  },

  // Appends bound instances of the element in place for each item in the array.
  'each-*': {
    block: true,

    priority: 4000,

    bind: function(el) {
      if (!this.marker) {
        this.marker = document.createComment(` rivets: ${this.type} `);
        this.iterated = [];

        el.parentNode.insertBefore(this.marker, el);
        el.parentNode.removeChild(el);
      } else {
        this.iterated.forEach(view => {
          view.bind();
        });
      }
    },

    unbind: function(el) {
      if (this.iterated) {
        this.iterated.forEach(view => {
          view.unbind();
        });
      }
    },

    routine: function(el, collection) {
      let modelName = this.arg;
      collection = collection || [];
      let indexProp = el.getAttribute('index-property') || '$index';

      collection.forEach((model, index) => {
        let data = {$parent: this.view.models};
        data[indexProp] = index;
        data[modelName] = model;
        let view = this.iterated[index];

        if (!view) {

          let previous = this.marker;

          if (this.iterated.length) {
            previous = this.iterated[this.iterated.length - 1].els[0];
          }

          view = createView(this, data, previous.nextSibling);
          this.iterated.push(view);
        } else {
          if (view.models[modelName] !== model) {
            // search for a view that matches the model
            let matchIndex, nextView;
            for (let nextIndex = index + 1; nextIndex < this.iterated.length; nextIndex++) {
              nextView = this.iterated[nextIndex];
              if (nextView.models[modelName] === model) {
                matchIndex = nextIndex;
                break
              }
            }
            if (matchIndex !== undefined) {
              // model is in other position
              // todo: consider avoiding the splice here by setting a flag
              // profile performance before implementing such change
              this.iterated.splice(matchIndex, 1);
              this.marker.parentNode.insertBefore(nextView.els[0], view.els[0]);
              nextView.models[indexProp] = index;
            } else {
              //new model
              nextView = createView(this, data, view.els[0]);
            }
            this.iterated.splice(index, 0, nextView);
          } else {
            view.models[indexProp] = index;
          }
        }
      });

      if (this.iterated.length > collection.length) {
        times(this.iterated.length - collection.length, () => {
          let view = this.iterated.pop();
          view.unbind();
          this.marker.parentNode.removeChild(view.els[0]);
        });
      }

      if (el.nodeName === 'OPTION') {
        this.view.bindings.forEach(binding => {
          if (binding.el === this.marker.parentNode && binding.type === 'value') {
            binding.sync();
          }
        });
      }
    },

    update: function(models) {
      let data = {};

      //todo: add test and fix if necessary

      Object.keys(models).forEach(key => {
        if (key !== this.arg) {
          data[key] = models[key];
        }
      });

      this.iterated.forEach(view => {
        view.update(data);
      });
    }
  },

  // Adds or removes the class from the element when value is true or false.
  'class-*': function(el, value) {
    let elClass = ` ${el.className} `;

    if (!value === (elClass.indexOf(` ${this.arg} `) > -1)) {
      if (value) {
        el.className = `${el.className} ${this.arg}`;
      } else {
        el.className = elClass.replace(` ${this.arg} `, ' ').trim();
      }
    }
  },

  // Sets the element's text value.
  text: (el, value) => {
    el.textContent = value != null ? value : '';
  },

  // Sets the element's HTML content.
  html: (el, value) => {
    el.innerHTML = value != null ? value : '';
  },

  // Shows the element when value is true.
  show: (el, value) => {
    el.style.display = value ? '' : 'none';
  },

  // Hides the element when value is true (negated version of `show` binder).
  hide: (el, value) => {
    el.style.display = value ? 'none' : '';
  },

  // Enables the element when value is true.
  enabled: (el, value) => {
    el.disabled = !value;
  },

  // Disables the element when value is true (negated version of `enabled` binder).
  disabled: (el, value) => {
    el.disabled = !!value;
  },

  // Checks a checkbox or radio input when the value is true. Also sets the model
  // property when the input is checked or unchecked (two-way binder).
  checked: {
    publishes: true,
    priority: 2000,

    bind: function(el) {
      var self = this;
      if (!this.callback) {
        this.callback = function () {
          self.publish();
        };
      }
      el.addEventListener('change', this.callback);
    },

    unbind: function(el) {
      el.removeEventListener('change', this.callback);
    },

    routine: function(el, value) {
      if (el.type === 'radio') {
        el.checked = getString(el.value) === getString(value);
      } else {
        el.checked = !!value;
      }
    }
  },

  // Sets the element's value. Also sets the model property when the input changes
  // (two-way binder).
  value: {
    publishes: true,
    priority: 3000,

    bind: function(el) {
      this.isRadio = el.tagName === 'INPUT' && el.type === 'radio';
      if (!this.isRadio) {
        this.event = el.getAttribute('event-name') || (el.tagName === 'SELECT' ? 'change' : 'input');

        var self = this;
        if (!this.callback) {
          this.callback = function () {
            self.publish();
          };
        }

        el.addEventListener(this.event, this.callback);
      }
    },

    unbind: function(el) {
      if (!this.isRadio) {
        el.removeEventListener(this.event, this.callback);
      }
    },

    routine: function(el, value) {
      if (this.isRadio) {
        el.setAttribute('value', value);
      } else {
        if (el.type === 'select-multiple') {
          if (value instanceof Array) {
            for (let i = 0; i < el.length; i++) {
              let option = el[i];
              option.selected = value.indexOf(option.value) > -1;
            }
          }
        } else if (getString(value) !== getString(el.value)) {
          el.value = value != null ? value : '';
        }
      }
    }
  },

  // Inserts and binds the element and it's child nodes into the DOM when true.
  if: {
    block: true,
    priority: 4000,

    bind: function(el) {
      if (!this.marker) {
        this.marker = document.createComment(' rivets: ' + this.type + ' ' + this.keypath + ' ');
        this.attached = false;

        el.parentNode.insertBefore(this.marker, el);
        el.parentNode.removeChild(el);
      } else if (this.bound === false && this.nested) {
        this.nested.bind();
      }
      this.bound = true;
    },

    unbind: function() {
      if (this.nested) {
        this.nested.unbind();
        this.bound = false;
      }
    },

    routine: function(el, value) {
      if (!!value !== this.attached) {
        if (value) {

          if (!this.nested) {
            this.nested = new View(el, this.view.models, this.view.options);
            this.nested.bind();
          }

          this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
          this.attached = true;
        } else {
          el.parentNode.removeChild(el);
          this.attached = false;
        }
      }
    },

    update: function(models) {
      if (this.nested) {
        this.nested.update(models);
      }
    }
  }
};

// Returns the public interface.

rivets$1.binders = binders;
rivets$1.adapters['.'] = adapter;

// Binds some data to a template / element. Returns a Rivets.View instance.
rivets$1.bind = (el, models, options) => {
  let viewOptions = {};
  models = models || {};
  options = options || {};

  EXTENSIONS.forEach(extensionType => {
    viewOptions[extensionType] = Object.create(null);

    if (options[extensionType]) {
      Object.keys(options[extensionType]).forEach(key => {
        viewOptions[extensionType][key] = options[extensionType][key];
      });
    }

    Object.keys(rivets$1[extensionType]).forEach(key => {
      if (!viewOptions[extensionType][key]) {
        viewOptions[extensionType][key] = rivets$1[extensionType][key];
      }
    });
  });

  OPTIONS.forEach(option => {
    let value = options[option];
    viewOptions[option] = value != null ? value : rivets$1[option];
  });

  viewOptions.starBinders = Object.keys(viewOptions.binders).filter(function (key) {
    return key.indexOf('*') > 0
  });

  Observer.updateOptions(viewOptions);

  let view = new View(el, models, viewOptions);
  view.bind();
  return view
};

rivets$1.formatters.negate = rivets$1.formatters.not = function (value) {
  return !value;
};

return rivets$1;

})));
