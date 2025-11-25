var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a2, _b, _c2, _d2;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
/**
* @vue/shared v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return (val) => set2.has(val);
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el2) => {
  const i = arr.indexOf(el2);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject$1(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toNumber = (val) => {
  const n = isString(val) ? Number(val) : NaN;
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props) return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length) return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b) return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject$1(a);
  bValidType = isObject$1(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const isRef$1 = (val) => {
  return !!(val && val.__v_isRef === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$1(val) && !isArray(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a3;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a3 = v.description) != null ? _a3 : i})` : v
  );
};
/**
* @vue/reactivity v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      this.onStop && this.onStop();
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4
      );
    }
  }
  resetScheduling();
}
function getDepFromReactive(object, key) {
  const depsMap = targetMap.get(object);
  return depsMap && depsMap.get(key);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value, _isShallow = false) {
  if (!_isShallow && !isShallow(value) && !isReadonly(value)) {
    value = toRaw(value);
  }
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value, _isShallow = false) {
  if (!_isShallow && !isShallow(value) && !isReadonly(value)) {
    value = toRaw(value);
  }
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add(value) {
      return add.call(this, value, true);
    },
    set(key, value) {
      return set.call(this, key, value, true);
    },
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function trackRefValue(ref2) {
  var _a3;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a3 = ref2.dep) != null ? _a3 : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      )
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal, oldVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel
    );
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue;
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
function toValue$1(source) {
  return isFunction(source) ? source() : unref(source);
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this.dep = void 0;
    this.__v_isRef = true;
    const { get: get2, set: set2 } = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    );
    this._get = get2;
    this._set = set2;
  }
  get value() {
    return this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
function toRefs(object) {
  const ret = isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this.__v_isRef = true;
    this.__v_isReadonly = true;
  }
  get value() {
    return this._getter();
  }
}
function toRef$1(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if (isFunction(source)) {
    return new GetterRefImpl(source);
  } else if (isObject$1(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
/**
* @vue/runtime-core v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a3, _b2;
          return (_b2 = (_a3 = a.toString) == null ? void 0 : _a3.call(a)) != null ? _b2 : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close2 = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close2] : [open + close2];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      pauseTracking();
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id2) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id2 || middleJobId === id2 && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.active !== false) cb();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre) return -1;
    if (b.pre && !a.pre) return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false) ;
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id2) {
  currentScopeId = id2;
}
function popScopeId() {
  currentScopeId = null;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getComponentPublicInstance(currentRenderingInstance);
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const leaveCbKey = Symbol("_leaveCb");
const enterCbKey$1 = Symbol("_enterCb");
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionPropsValidators = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: TransitionHookValidator,
  onEnter: TransitionHookValidator,
  onAfterEnter: TransitionHookValidator,
  onEnterCancelled: TransitionHookValidator,
  // leave
  onBeforeLeave: TransitionHookValidator,
  onLeave: TransitionHookValidator,
  onAfterLeave: TransitionHookValidator,
  onLeaveCancelled: TransitionHookValidator,
  // appear
  onBeforeAppear: TransitionHookValidator,
  onAppear: TransitionHookValidator,
  onAfterAppear: TransitionHookValidator,
  onAppearCancelled: TransitionHookValidator
};
const recursiveGetSubtree = (instance) => {
  const subTree = instance.subTree;
  return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
};
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: BaseTransitionPropsValidators,
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      let enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance,
        // #11061, ensure enterHooks is fresh after clone
        (hooks) => enterHooks = hooks
      );
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(innerChild, oldInnerChild) && recursiveGetSubtree(instance).type !== Comment) {
        const leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in" && innerChild.type !== Comment) {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.effect.dirty = true;
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el2, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            );
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el2[leaveCbKey] = () => {
              earlyRemove();
              el2[leaveCbKey] = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance, postClone) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(
      hook,
      instance,
      9,
      args
    );
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1)) done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el2) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el2[leaveCbKey]) {
        el2[leaveCbKey](
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
        leavingVNode.el[leaveCbKey]();
      }
      callHook2(hook, [el2]);
    },
    enter(el2) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el2[enterCbKey$1] = (cancelled) => {
        if (called) return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el2]);
        } else {
          callHook2(afterHook, [el2]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el2[enterCbKey$1] = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el2, done]);
      } else {
        done();
      }
    },
    leave(el2, remove2) {
      const key2 = String(vnode.key);
      if (el2[enterCbKey$1]) {
        el2[enterCbKey$1](
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el2]);
      let called = false;
      const done = el2[leaveCbKey] = (cancelled) => {
        if (called) return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el2]);
        } else {
          callHook2(onAfterLeave, [el2]);
        }
        el2[leaveCbKey] = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el2, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      const hooks2 = resolveTransitionHooks(
        vnode2,
        props,
        state,
        instance,
        postClone
      );
      if (postClone) postClone(hooks2);
      return hooks2;
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  if (!isKeepAlive(vnode)) {
    return vnode;
  }
  const { shapeFlag, children } = vnode;
  if (children) {
    if (shapeFlag & 16) {
      return children[0];
    }
    if (shapeFlag & 32 && isFunction(children.default)) {
      return children.default();
    }
  }
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128) keyedFragmentCount++;
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key)
      );
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset2 = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset2();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached);
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function createSlots(slots, dynamicSlots) {
  for (let i = 0; i < dynamicSlots.length; i++) {
    const slot = dynamicSlots[i];
    if (isArray(slot)) {
      for (let j2 = 0; j2 < slot.length; j2++) {
        slots[slot[j2].name] = slot[j2].fn;
      }
    } else if (slot) {
      slots[slot.name] = slot.key ? (...args) => {
        const res = slot.fn(...args);
        if (res) res.key = slot.key;
        return res;
      } : slot.fn;
    }
  }
  return slots;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    if (name !== "default") props.name = name;
    return createVNode("slot", props, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: (props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`) + // #7256 force differentiate fallback content from actual content
      (!validSlotContent && fallback ? "_fb" : "")
    },
    validSlotContent || (fallback ? fallback() : []),
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child)) return true;
    if (child.type === Comment) return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
function toHandlers(obj, preserveCaseIfNecessary) {
  const ret = {};
  for (const key in obj) {
    ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render: render2,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data)) ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render2 && instance.render === NOOP) {
    instance.render = render2;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$1(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to2, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to2, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to2, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to2[key] = strat ? strat(to2[key], from[key]) : from[key];
    }
  }
  return to2;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to2, from) {
  if (!from) {
    return to2;
  }
  if (!to2) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to2) ? to2.call(this, this) : to2,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to2, from) {
  return mergeObjectOptions(normalizeInject(to2), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to2, from) {
  return to2 ? [...new Set([].concat(to2, from))] : from;
}
function mergeObjectOptions(to2, from) {
  return to2 ? extend(/* @__PURE__ */ Object.create(null), to2, from) : from;
}
function mergeEmitsOrPropsOptions(to2, from) {
  if (to2) {
    if (isArray(to2) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to2, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to2),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to2, from) {
  if (!to2) return from;
  if (!from) return to2;
  const merged = extend(/* @__PURE__ */ Object.create(null), to2);
  for (const key in from) {
    merged[key] = mergeAsArray(to2[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render2, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render2(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getComponentPublicInstance(vnode.component);
        }
      },
      unmount() {
        if (isMounted) {
          render2(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp);
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset2 = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset2();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$1(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || key !== "_") {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref3) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (hasOwn(setupState, ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                ref3.value = [refValue];
                if (rawRef.k) refs[rawRef.k] = ref3.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (hasOwn(setupState, ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          ref3.value = value;
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const TeleportEndKey = Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target = select(targetSelector);
      return target;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  name: "Teleport",
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
    const {
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      o: { insert, querySelector, createText, createComment }
    } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = prepareAnchor(target, n2, createText, insert);
      if (target) {
        if (namespace === "svg" || isTargetSVG(target)) {
          namespace = "svg";
        } else if (namespace === "mathml" || isTargetMathML(target)) {
          namespace = "mathml";
        }
      }
      const mount2 = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(
            children,
            container2,
            anchor2,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      };
      if (disabled) {
        mount2(container, mainAnchor);
      } else if (target) {
        mount2(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      n2.targetStart = n1.targetStart;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      if (namespace === "svg" || isTargetSVG(target)) {
        namespace = "svg";
      } else if (namespace === "mathml" || isTargetMathML(target)) {
        namespace = "mathml";
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          currentContainer,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          currentContainer,
          currentAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          false
        );
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(
            n2,
            container,
            mainAnchor,
            internals,
            1
          );
        } else {
          if (n2.props && n1.props && n2.props.to !== n1.props.to) {
            n2.props.to = n1.props.to;
          }
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(
            n2.props,
            querySelector
          );
          if (nextTarget) {
            moveTeleport(
              n2,
              nextTarget,
              null,
              internals,
              0
            );
          }
        } else if (wasDisabled) {
          moveTeleport(
            n2,
            target,
            targetAnchor,
            internals,
            1
          );
        }
      }
    }
    updateCssVars(n2);
  },
  remove(vnode, parentComponent, parentSuspense, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const {
      shapeFlag,
      children,
      anchor,
      targetStart,
      targetAnchor,
      target,
      props
    } = vnode;
    if (target) {
      hostRemove(targetStart);
      hostRemove(targetAnchor);
    }
    doRemove && hostRemove(anchor);
    if (shapeFlag & 16) {
      const shouldRemove = doRemove || !isTeleportDisabled(props);
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        unmount(
          child,
          parentComponent,
          parentSuspense,
          shouldRemove,
          !!child.dynamicChildren
        );
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el: el2, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el2, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(
          children[i],
          container,
          parentAnchor,
          2
        );
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
  o: { nextSibling, parentNode, querySelector, insert, createText }
}, hydrateChildren) {
  const target = vnode.target = resolveTarget(
    vnode.props,
    querySelector
  );
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(
          nextSibling(node),
          vnode,
          parentNode(node),
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
        vnode.targetStart = targetNode;
        vnode.targetAnchor = targetNode && nextSibling(targetNode);
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          if (targetAnchor && targetAnchor.nodeType === 8) {
            if (targetAnchor.data === "teleport start anchor") {
              vnode.targetStart = targetAnchor;
            } else if (targetAnchor.data === "teleport anchor") {
              vnode.targetAnchor = targetAnchor;
              target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
              break;
            }
          }
          targetAnchor = nextSibling(targetAnchor);
        }
        if (!vnode.targetAnchor) {
          prepareAnchor(target, vnode, createText, insert);
        }
        hydrateChildren(
          targetNode && nextSibling(targetNode),
          vnode,
          target,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      }
    }
    updateCssVars(vnode);
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
function updateCssVars(vnode) {
  const ctx = vnode.ctx;
  if (ctx && ctx.ut) {
    let node = vnode.children[0].el;
    while (node && node !== vnode.targetAnchor) {
      if (node.nodeType === 1) node.setAttribute("data-v-owner", ctx.uid);
      node = node.nextSibling;
    }
    ctx.ut();
  }
}
function prepareAnchor(target, vnode, createText, insert) {
  const targetStart = vnode.targetStart = createText("");
  const targetAnchor = vnode.targetAnchor = createText("");
  targetStart[TeleportEndKey] = targetAnchor;
  if (target) {
    insert(targetStart, target);
    insert(targetAnchor, target);
  }
  return targetAnchor;
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el2 = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el2, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el: el2, anchor }, container, nextSibling) => {
    let next;
    while (el2 && el2 !== anchor) {
      next = hostNextSibling(el2);
      hostInsert(el2, container, nextSibling);
      el2 = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el: el2, anchor }) => {
    let next;
    while (el2 && el2 !== anchor) {
      next = hostNextSibling(el2);
      hostRemove(el2);
      el2 = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el2;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el2 = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el2, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el2,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el2, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el2, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el2, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el2);
    }
    hostInsert(el2, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el2);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el2, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el2, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el2, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el2,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el2 = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el2, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el2,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el2,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el2, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el2, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el2, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el2, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el2, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el2, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el2, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el2,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el2, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el2, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.effect.dirty = true;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el: el2, props } = initialVNode;
        const { bm, m, parent: parent2 } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent2, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el2 && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el2,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent2, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent2 && isAsyncWrapper(parent2.vnode) && parent2.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu: bu2, u, parent: parent2, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu2) {
          invokeArrayFns(bu2);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent2, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent2, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect2 = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      NOOP,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => {
      if (effect2.dirty) {
        effect2.run();
      }
    };
    update.i = instance;
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j2;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j2 = s2; j2 <= e2; j2++) {
            if (newIndexToOldIndexMap[j2 - s2] === 0 && isSameVNodeType(prevChild, c2[j2])) {
              newIndex = j2;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j2 = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j2 < 0 || i !== increasingNewIndexSequence[j2]) {
            move(nextChild, container, anchor, 2);
          } else {
            j2--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el: el2, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el2, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el2);
        hostInsert(el2, container, anchor);
        queuePostRenderEffect(() => transition.enter(el2), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el2, container, anchor);
        const performLeave = () => {
          leave(el2, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el2, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el2, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      setRef(ref3, null, parentSuspense, vnode, true);
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el: el2, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el2, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el2);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el2, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el2 = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el2 && el2[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el2;
  };
  let isFlushing2 = false;
  const render2 = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing2) {
      isFlushing2 = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing2 = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  return {
    render: render2,
    hydrate,
    createApp: createAppAPI(render2, hydrate)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j2, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j2 = result[result.length - 1];
      if (arr[j2] < arrI) {
        p2[i] = j2;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++) hooks[i].active = false;
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watchEffect(effect2, options) {
  return doWatch(effect2, null, options);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance) job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  if (ssrCleanup) ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset2 = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset2();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render: render2,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render2.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render22 = Component;
      if (false) ;
      result = normalizeVNode(
        render22.length > 1 ? render22(
          false ? shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render22(
          false ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent: parent2 }, el2) {
  while (parent2) {
    const root = parent2.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.el = vnode.el;
    }
    if (root === vnode) {
      (vnode = parent2.vnode).el = el2;
      parent2 = parent2.parent;
    } else {
      break;
    }
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent2, suspense) {
  const type = vnode.type;
  const appContext = (parent2 ? parent2.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent: parent2,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent2 ? parent2.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent2 ? parent2.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set2) => set2(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset2 = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    resetTracking();
    reset2();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    const reset2 = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset2();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$1(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.4.38";
/**
* @vue/runtime-dom v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent2, anchor) => {
    parent2.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent2 = child.parentNode;
    if (parent2) {
      parent2.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el2 = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el2.setAttribute("multiple", props.multiple);
    }
    return el2;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el2, text) => {
    el2.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el2, id2) {
    el2.setAttribute(id2, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent2, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent2.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent2.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent2.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent2.firstChild,
      // last
      anchor ? anchor.previousSibling : parent2.lastChild
    ];
  }
};
const TRANSITION = "transition";
const ANIMATION = "animation";
const vtcKey = Symbol("_vtc");
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = Transition.props = /* @__PURE__ */ extend(
  {},
  BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
);
const callHook = (hook, args = []) => {
  if (isArray(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const {
    name = "v",
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;
  const finishEnter = (el2, isAppear, done) => {
    removeTransitionClass(el2, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el2, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el2, done) => {
    el2._isLeaving = false;
    removeTransitionClass(el2, leaveFromClass);
    removeTransitionClass(el2, leaveToClass);
    removeTransitionClass(el2, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el2, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el2, isAppear, done);
      callHook(hook, [el2, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el2, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el2, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el2, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el2) {
      callHook(onBeforeEnter, [el2]);
      addTransitionClass(el2, enterFromClass);
      addTransitionClass(el2, enterActiveClass);
    },
    onBeforeAppear(el2) {
      callHook(onBeforeAppear, [el2]);
      addTransitionClass(el2, appearFromClass);
      addTransitionClass(el2, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el2, done) {
      el2._isLeaving = true;
      const resolve2 = () => finishLeave(el2, done);
      addTransitionClass(el2, leaveFromClass);
      addTransitionClass(el2, leaveActiveClass);
      forceReflow();
      nextFrame(() => {
        if (!el2._isLeaving) {
          return;
        }
        removeTransitionClass(el2, leaveFromClass);
        addTransitionClass(el2, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el2, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el2, resolve2]);
    },
    onEnterCancelled(el2) {
      finishEnter(el2, false);
      callHook(onEnterCancelled, [el2]);
    },
    onAppearCancelled(el2) {
      finishEnter(el2, true);
      callHook(onAppearCancelled, [el2]);
    },
    onLeaveCancelled(el2) {
      finishLeave(el2);
      callHook(onLeaveCancelled, [el2]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$1(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el2, cls) {
  cls.split(/\s+/).forEach((c) => c && el2.classList.add(c));
  (el2[vtcKey] || (el2[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el2, cls) {
  cls.split(/\s+/).forEach((c) => c && el2.classList.remove(c));
  const _vtc = el2[vtcKey];
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el2[vtcKey] = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el2, expectedType, explicitTimeout, resolve2) {
  const id2 = el2._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id2 === el2._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el2, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el2.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el2 && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el2.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el2, expectedType) {
  const styles = window.getComputedStyle(el2);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
    getStyleProperties(`${TRANSITION}Property`).toString()
  );
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  if (s === "auto") return 0;
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
function patchClass(el2, value, isSVG) {
  const transitionClasses = el2[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el2.removeAttribute("class");
  } else if (isSVG) {
    el2.setAttribute("class", value);
  } else {
    el2.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const vShow = {
  beforeMount(el2, { value }, { transition }) {
    el2[vShowOriginalDisplay] = el2.style.display === "none" ? "" : el2.style.display;
    if (transition && value) {
      transition.beforeEnter(el2);
    } else {
      setDisplay(el2, value);
    }
  },
  mounted(el2, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el2);
    }
  },
  updated(el2, { value, oldValue }, { transition }) {
    if (!value === !oldValue) return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el2);
        setDisplay(el2, true);
        transition.enter(el2);
      } else {
        transition.leave(el2, () => {
          setDisplay(el2, false);
        });
      }
    } else {
      setDisplay(el2, value);
    }
  },
  beforeUnmount(el2, { value }) {
    setDisplay(el2, value);
  }
};
function setDisplay(el2, value) {
  el2.style.display = value ? el2[vShowOriginalDisplay] : "none";
  el2[vShowHidden] = !value;
}
const CSS_VAR_TEXT = Symbol("");
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el2, prev, next) {
  const style = el2.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el2.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el2) {
    el2[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el2[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el2, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el2.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el2.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el2.removeAttribute(key);
    } else {
      el2.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el2, key, value, parentComponent) {
  if (key === "innerHTML" || key === "textContent") {
    if (value == null) return;
    el2[key] = value;
    return;
  }
  const tag = el2.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el2.getAttribute("value") || "" : el2.value;
    const newValue = value == null ? "" : String(value);
    if (oldValue !== newValue || !("_value" in el2)) {
      el2.value = newValue;
    }
    if (value == null) {
      el2.removeAttribute(key);
    }
    el2._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el2[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el2[key] = value;
  } catch (e) {
  }
  needRemove && el2.removeAttribute(key);
}
function addEventListener(el2, event, handler, options) {
  el2.addEventListener(event, handler, options);
}
function removeEventListener(el2, event, handler, options) {
  el2.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el2, rawName, prevValue, nextValue, instance = null) {
  const invokers = el2[veiKey] || (el2[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el2, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el2, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el2, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el2, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el2, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el2, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el2, key, nextValue, isSVG)) {
    patchDOMProp(el2, key, nextValue);
    if (!el2.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el2, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else {
    if (key === "true-value") {
      el2._trueValue = nextValue;
    } else if (key === "false-value") {
      el2._falseValue = nextValue;
    }
    patchAttr(el2, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el2, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el2 && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el2.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el2.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el2.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el2;
}
const positionMap = /* @__PURE__ */ new WeakMap();
const newPositionMap = /* @__PURE__ */ new WeakMap();
const moveCbKey = Symbol("_moveCb");
const enterCbKey = Symbol("_enterCb");
const TransitionGroupImpl = {
  name: "TransitionGroup",
  props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
    tag: String,
    moveClass: String
  }),
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevChildren;
    let children;
    onUpdated(() => {
      if (!prevChildren.length) {
        return;
      }
      const moveClass = props.moveClass || `${props.name || "v"}-move`;
      if (!hasCSSTransform(
        prevChildren[0].el,
        instance.vnode.el,
        moveClass
      )) {
        return;
      }
      prevChildren.forEach(callPendingCbs);
      prevChildren.forEach(recordPosition);
      const movedChildren = prevChildren.filter(applyTranslation);
      forceReflow();
      movedChildren.forEach((c) => {
        const el2 = c.el;
        const style = el2.style;
        addTransitionClass(el2, moveClass);
        style.transform = style.webkitTransform = style.transitionDuration = "";
        const cb = el2[moveCbKey] = (e) => {
          if (e && e.target !== el2) {
            return;
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el2.removeEventListener("transitionend", cb);
            el2[moveCbKey] = null;
            removeTransitionClass(el2, moveClass);
          }
        };
        el2.addEventListener("transitionend", cb);
      });
    });
    return () => {
      const rawProps = toRaw(props);
      const cssTransitionProps = resolveTransitionProps(rawProps);
      let tag = rawProps.tag || Fragment;
      prevChildren = [];
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.el && child.el instanceof Element) {
            prevChildren.push(child);
            setTransitionHooks(
              child,
              resolveTransitionHooks(
                child,
                cssTransitionProps,
                state,
                instance
              )
            );
            positionMap.set(
              child,
              child.el.getBoundingClientRect()
            );
          }
        }
      }
      children = slots.default ? getTransitionRawChildren(slots.default()) : [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key != null) {
          setTransitionHooks(
            child,
            resolveTransitionHooks(child, cssTransitionProps, state, instance)
          );
        }
      }
      return createVNode(tag, null, children);
    };
  }
};
const removeMode = (props) => delete props.mode;
/* @__PURE__ */ removeMode(TransitionGroupImpl.props);
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
  const el2 = c.el;
  if (el2[moveCbKey]) {
    el2[moveCbKey]();
  }
  if (el2[enterCbKey]) {
    el2[enterCbKey]();
  }
}
function recordPosition(c) {
  newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
  const oldPos = positionMap.get(c);
  const newPos = newPositionMap.get(c);
  const dx = oldPos.left - newPos.left;
  const dy = oldPos.top - newPos.top;
  if (dx || dy) {
    const s = c.el.style;
    s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
    s.transitionDuration = "0s";
    return c;
  }
}
function hasCSSTransform(el2, root, moveClass) {
  const clone = el2.cloneNode();
  const _vtc = el2[vtcKey];
  if (_vtc) {
    _vtc.forEach((cls) => {
      cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
    });
  }
  moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
  clone.style.display = "none";
  const container = root.nodeType === 1 ? root : root.parentNode;
  container.appendChild(clone);
  const { hasTransform } = getTransitionInfo(clone);
  container.removeChild(clone);
  return hasTransform;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const assignKey = Symbol("_assign");
const vModelText = {
  created(el2, { modifiers: { lazy, trim, number } }, vnode) {
    el2[assignKey] = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el2, lazy ? "change" : "input", (e) => {
      if (e.target.composing) return;
      let domValue = el2.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = looseToNumber(domValue);
      }
      el2[assignKey](domValue);
    });
    if (trim) {
      addEventListener(el2, "change", () => {
        el2.value = el2.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el2, "compositionstart", onCompositionStart);
      addEventListener(el2, "compositionend", onCompositionEnd);
      addEventListener(el2, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el2, { value }) {
    el2.value = value == null ? "" : value;
  },
  beforeUpdate(el2, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
    el2[assignKey] = getModelAssigner(vnode);
    if (el2.composing) return;
    const elValue = (number || el2.type === "number") && !/^0\d/.test(el2.value) ? looseToNumber(el2.value) : el2.value;
    const newValue = value == null ? "" : value;
    if (elValue === newValue) {
      return;
    }
    if (document.activeElement === el2 && el2.type !== "range") {
      if (lazy && value === oldValue) {
        return;
      }
      if (trim && el2.value.trim() === newValue) {
        return;
      }
    }
    el2.value = newValue;
  }
};
const vModelRadio = {
  created(el2, { value }, vnode) {
    el2.checked = looseEqual(value, vnode.props.value);
    el2[assignKey] = getModelAssigner(vnode);
    addEventListener(el2, "change", () => {
      el2[assignKey](getValue(el2));
    });
  },
  beforeUpdate(el2, { value, oldValue }, vnode) {
    el2[assignKey] = getModelAssigner(vnode);
    if (value !== oldValue) {
      el2.checked = looseEqual(value, vnode.props.value);
    }
  }
};
const vModelSelect = {
  // <select multiple> value need to be deep traversed
  deep: true,
  created(el2, { value, modifiers: { number } }, vnode) {
    const isSetModel = isSet(value);
    addEventListener(el2, "change", () => {
      const selectedVal = Array.prototype.filter.call(el2.options, (o) => o.selected).map(
        (o) => number ? looseToNumber(getValue(o)) : getValue(o)
      );
      el2[assignKey](
        el2.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
      );
      el2._assigning = true;
      nextTick(() => {
        el2._assigning = false;
      });
    });
    el2[assignKey] = getModelAssigner(vnode);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el2, { value, modifiers: { number } }) {
    setSelected(el2, value);
  },
  beforeUpdate(el2, _binding, vnode) {
    el2[assignKey] = getModelAssigner(vnode);
  },
  updated(el2, { value, modifiers: { number } }) {
    if (!el2._assigning) {
      setSelected(el2, value);
    }
  }
};
function setSelected(el2, value, number) {
  const isMultiple = el2.multiple;
  const isArrayValue = isArray(value);
  if (isMultiple && !isArrayValue && !isSet(value)) {
    return;
  }
  for (let i = 0, l = el2.options.length; i < l; i++) {
    const option = el2.options[i];
    const optionValue = getValue(option);
    if (isMultiple) {
      if (isArrayValue) {
        const optionType = typeof optionValue;
        if (optionType === "string" || optionType === "number") {
          option.selected = value.some((v) => String(v) === String(optionValue));
        } else {
          option.selected = looseIndexOf(value, optionValue) > -1;
        }
      } else {
        option.selected = value.has(optionValue);
      }
    } else if (looseEqual(getValue(option), value)) {
      if (el2.selectedIndex !== i) el2.selectedIndex = i;
      return;
    }
  }
  if (!isMultiple && el2.selectedIndex !== -1) {
    el2.selectedIndex = -1;
  }
}
function getValue(el2) {
  return "_value" in el2 ? el2._value : el2.value;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers)) return;
    }
    return fn(event, ...args);
  });
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  const cache = fn._withKeys || (fn._withKeys = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return fn(event);
    }
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const render = (...args) => {
  ensureRenderer().render(...args);
};
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount: mount2 } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount2(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
var isVue2 = false;
/*!
 * pinia v2.2.2
 * (c) 2024 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop$1 = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id2, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id2];
  let store;
  function setup() {
    if (!initialState && true) {
      {
        pinia.state.value[id2] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id2]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id2);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id2, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = { deep: true };
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop$1
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = action(prop, key);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
// @__NO_SIDE_EFFECTS__
function defineStore(idOrOptions, setup, setupOptions) {
  let id2;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id2 = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id2 = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    pinia || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id2)) {
      if (isSetupStore) {
        createSetupStore(id2, setup, options, pinia);
      } else {
        createOptionsStore(id2, options, pinia);
      }
    }
    const store = pinia._s.get(id2);
    return store;
  }
  useStore.$id = id2;
  return useStore;
}
const Te = {
  props: {
    color: {
      type: String,
      default: () => "default"
    }
  }
}, K = {
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    }
  }
}, O = (e, s) => {
  const t = e.__vccOpts || e;
  for (const [i, o] of s)
    t[i] = o;
  return t;
}, nn = {
  name: "vu-badge",
  mixins: [Te, K],
  emits: ["close", "selected", "update:modelValue"],
  props: {
    value: {
      type: Boolean,
      default: () => {
      }
    },
    text: {
      type: String,
      default: () => ""
    },
    icon: {
      type: String,
      default: () => ""
    },
    selectable: {
      type: Boolean,
      default: () => false
    },
    togglable: {
      type: Boolean,
      default: () => true
    },
    closable: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      isSelected: false
    };
  },
  computed: {
    classes() {
      return [
        "vu-badge",
        `badge-root badge badge-${this.color}`,
        {
          "badge-closable": this.closable,
          "badge-selectable": this.selectable,
          disabled: this.disabled,
          "badge-selected": this.isSelected || this.value
        }
      ];
    },
    iconClasses() {
      return `fonticon fonticon-${this.icon} badge-icon`;
    },
    showContent() {
      return typeof this.$slots.default == "function" || this.text;
    }
  },
  methods: {
    onClickOutside() {
      this.selectable && this.value === void 0 && this.togglable && (this.isSelected = false);
    },
    selectBadge() {
      this.selectable && (this.value === void 0 && (this.isSelected = this.togglable ? !this.isSelected : true), this.$emit("selected", this.isSelected), this.$emit("update:modelValue", this.isSelected));
    }
  }
}, ln = {
  key: 1,
  class: "badge-content"
};
function on(e, s, t, i, o, n) {
  const r = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("span", {
    class: normalizeClass(n.classes),
    onClick: s[1] || (s[1] = (d) => n.selectBadge(d))
  }, [
    t.icon ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass(n.iconClasses)
    }, null, 2)) : createCommentVNode("", true),
    n.showContent ? (openBlock(), createElementBlock("span", ln, [
      renderSlot(e.$slots, "default", {}, () => [
        createTextVNode(toDisplayString(t.text), 1)
      ], true)
    ])) : createCommentVNode("", true),
    t.closable ? (openBlock(), createElementBlock("span", {
      key: 2,
      class: "fonticon fonticon-cancel",
      onClick: s[0] || (s[0] = (d) => e.$emit("close"))
    })) : createCommentVNode("", true)
  ], 2)), [
    [r, {
      handler: n.onClickOutside,
      events: ["click"]
    }]
  ]);
}
const _t = /* @__PURE__ */ O(nn, [["render", on], ["__scopeId", "data-v-db9e2215"]]), rn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _t
}, Symbol.toStringTag, { value: "Module" })), an = /^on[^a-z]/, un = (e) => an.test(e), ce = (e, s) => {
  const t = {};
  for (const i in e)
    un(i) && (t[s ? i[2].toLowerCase() + i.slice(3) : i] = e[i]);
  return t;
}, dn = {
  name: "vu-icon",
  mixins: [Te],
  data: () => ({
    getListenersFromAttrs: ce
  }),
  props: {
    icon: {
      required: true,
      type: String
    },
    withinText: {
      default: true,
      type: Boolean
    }
  }
};
function cn(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("span", mergeProps({
    class: ["vu-icon fonticon", [t.withinText ? "fonticon-within-text" : "", `fonticon-${t.icon}`, `${e.color}`]]
  }, toHandlers(e.getListenersFromAttrs(e.$attrs), true)), null, 16);
}
const H = /* @__PURE__ */ O(dn, [["render", cn], ["__scopeId", "data-v-18e6ed40"]]), hn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: H
}, Symbol.toStringTag, { value: "Module" }));
var le, oe;
function dt() {
  throw new Error("setTimeout has not been defined");
}
function ct() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? le = setTimeout : le = dt;
  } catch {
    le = dt;
  }
  try {
    typeof clearTimeout == "function" ? oe = clearTimeout : oe = ct;
  } catch {
    oe = ct;
  }
})();
function Je(e) {
  return getCurrentScope() ? (onScopeDispose(e), true) : false;
}
function J(e) {
  return typeof e == "function" ? e() : unref(e);
}
const us = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const pn = Object.prototype.toString, gn = (e) => pn.call(e) === "[object Object]", vn = () => +Date.now(), de = () => {
}, yn = /* @__PURE__ */ bn();
function bn() {
  var e, s;
  return us && ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || ((s = window == null ? void 0 : window.navigator) == null ? void 0 : s.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function _n(e, s) {
  function t(...i) {
    return new Promise((o, n) => {
      Promise.resolve(e(() => s.apply(this, i), { fn: s, thisArg: this, args: i })).then(o).catch(n);
    });
  }
  return t;
}
function wn(e, s = {}) {
  let t, i, o = de;
  const n = (d) => {
    clearTimeout(d), o(), o = de;
  };
  return (d) => {
    const u = J(e), f = J(s.maxWait);
    return t && n(t), u <= 0 || f !== void 0 && f <= 0 ? (i && (n(i), i = null), Promise.resolve(d())) : new Promise((c, h2) => {
      o = s.rejectOnCancel ? h2 : c, f && !i && (i = setTimeout(() => {
        t && n(t), i = null, c(d());
      }, f)), t = setTimeout(() => {
        i && n(i), i = null, c(d());
      }, u);
    });
  };
}
function kn(e) {
  return getCurrentInstance();
}
function jt(e, s = 200, t = {}) {
  return _n(
    wn(s, t),
    e
  );
}
function wt(e, s = true, t) {
  kn() ? onMounted(e, t) : s ? e() : nextTick(e);
}
function Sn(e, s = {}) {
  var t;
  const i = ref((t = s.initialValue) != null ? t : null);
  return watch(
    e,
    () => i.value = vn(),
    s
  ), i;
}
function Cn(e, s, t) {
  return watch(
    e,
    (i, o, n) => {
      i && s(i, o, n);
    },
    t
  );
}
function j(e) {
  var s;
  const t = J(e);
  return (s = t == null ? void 0 : t.$el) != null ? s : t;
}
const ve = us ? window : void 0;
function q(...e) {
  let s, t, i, o;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([t, i, o] = e, s = ve) : [s, t, i, o] = e, !s)
    return de;
  Array.isArray(t) || (t = [t]), Array.isArray(i) || (i = [i]);
  const n = [], r = () => {
    n.forEach((c) => c()), n.length = 0;
  }, d = (c, h2, v, k) => (c.addEventListener(h2, v, k), () => c.removeEventListener(h2, v, k)), u = watch(
    () => [j(s), J(o)],
    ([c, h2]) => {
      if (r(), !c)
        return;
      const v = gn(h2) ? { ...h2 } : h2;
      n.push(
        ...t.flatMap((k) => i.map((w) => d(c, k, w, v)))
      );
    },
    { immediate: true, flush: "post" }
  ), f = () => {
    u(), r();
  };
  return Je(f), f;
}
let Rt = false;
function In(e, s, t = {}) {
  const { window: i = ve, ignore: o = [], capture: n = true, detectIframe: r = false } = t;
  if (!i)
    return de;
  yn && !Rt && (Rt = true, Array.from(i.document.body.children).forEach((v) => v.addEventListener("click", de)), i.document.documentElement.addEventListener("click", de));
  let d = true;
  const u = (v) => o.some((k) => {
    if (typeof k == "string")
      return Array.from(i.document.querySelectorAll(k)).some((w) => w === v.target || v.composedPath().includes(w));
    {
      const w = j(k);
      return w && (v.target === w || v.composedPath().includes(w));
    }
  }), c = [
    q(i, "click", (v) => {
      const k = j(e);
      if (!(!k || k === v.target || v.composedPath().includes(k))) {
        if (v.detail === 0 && (d = !u(v)), !d) {
          d = true;
          return;
        }
        s(v);
      }
    }, { passive: true, capture: n }),
    q(i, "pointerdown", (v) => {
      const k = j(e);
      d = !u(v) && !!(k && !v.composedPath().includes(k));
    }, { passive: true }),
    r && q(i, "blur", (v) => {
      setTimeout(() => {
        var k;
        const w = j(e);
        ((k = i.document.activeElement) == null ? void 0 : k.tagName) === "IFRAME" && !(w != null && w.contains(i.document.activeElement)) && s(v);
      }, 0);
    })
  ].filter(Boolean);
  return () => c.forEach((v) => v());
}
function Bn(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (s) => s.key === e : Array.isArray(e) ? (s) => e.includes(s.key) : () => true;
}
function He(...e) {
  let s, t, i = {};
  e.length === 3 ? (s = e[0], t = e[1], i = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (s = true, t = e[0], i = e[1]) : (s = e[0], t = e[1]) : (s = true, t = e[0]);
  const {
    target: o = ve,
    eventName: n = "keydown",
    passive: r = false,
    dedupe: d = false
  } = i, u = Bn(s);
  return q(o, n, (c) => {
    c.repeat && J(d) || u(c) && t(c);
  }, r);
}
function On() {
  const e = ref(false);
  return getCurrentInstance() && onMounted(() => {
    e.value = true;
  }), e;
}
function kt(e) {
  const s = On();
  return computed(() => (s.value, !!e()));
}
function Vn(e, s = {}) {
  const { window: t = ve } = s, i = kt(() => t && "matchMedia" in t && typeof t.matchMedia == "function");
  let o;
  const n = ref(false), r = (f) => {
    n.value = f.matches;
  }, d = () => {
    o && ("removeEventListener" in o ? o.removeEventListener("change", r) : o.removeListener(r));
  }, u = watchEffect(() => {
    i.value && (d(), o = t.matchMedia(J(e)), "addEventListener" in o ? o.addEventListener("change", r) : o.addListener(r), n.value = o.matches);
  });
  return Je(() => {
    u(), d(), o = void 0;
  }), n;
}
function $n(e, s, t = {}) {
  const { window: i = ve, ...o } = t;
  let n;
  const r = kt(() => i && "MutationObserver" in i), d = () => {
    n && (n.disconnect(), n = void 0);
  }, u = watch(
    () => j(e),
    (h2) => {
      d(), r.value && i && h2 && (n = new MutationObserver(s), n.observe(h2, o));
    },
    { immediate: true }
  ), f = () => n == null ? void 0 : n.takeRecords(), c = () => {
    d(), u();
  };
  return Je(c), {
    isSupported: r,
    stop: c,
    takeRecords: f
  };
}
function ds(e, s, t = {}) {
  const { window: i = ve, ...o } = t;
  let n;
  const r = kt(() => i && "ResizeObserver" in i), d = () => {
    n && (n.disconnect(), n = void 0);
  }, u = computed(() => Array.isArray(e) ? e.map((h2) => j(h2)) : [j(e)]), f = watch(
    u,
    (h2) => {
      if (d(), r.value && i) {
        n = new ResizeObserver(s);
        for (const v of h2)
          v && n.observe(v, o);
      }
    },
    { immediate: true, flush: "post", deep: true }
  ), c = () => {
    d(), f();
  };
  return Je(c), {
    isSupported: r,
    stop: c
  };
}
function xn(e, s = {}) {
  const {
    reset: t = true,
    windowResize: i = true,
    windowScroll: o = true,
    immediate: n = true
  } = s, r = ref(0), d = ref(0), u = ref(0), f = ref(0), c = ref(0), h2 = ref(0), v = ref(0), k = ref(0);
  function w() {
    const T = j(e);
    if (!T) {
      t && (r.value = 0, d.value = 0, u.value = 0, f.value = 0, c.value = 0, h2.value = 0, v.value = 0, k.value = 0);
      return;
    }
    const D = T.getBoundingClientRect();
    r.value = D.height, d.value = D.bottom, u.value = D.left, f.value = D.right, c.value = D.top, h2.value = D.width, v.value = D.x, k.value = D.y;
  }
  return ds(e, w), watch(() => j(e), (T) => !T && w()), $n(e, w, {
    attributeFilter: ["style", "class"]
  }), o && q("scroll", w, { capture: true, passive: true }), i && q("resize", w, { passive: true }), wt(() => {
    n && w();
  }), {
    height: r,
    bottom: d,
    left: u,
    right: f,
    top: c,
    width: h2,
    x: v,
    y: k,
    update: w
  };
}
function Mn(e, s = { width: 0, height: 0 }, t = {}) {
  const { window: i = ve, box: o = "content-box" } = t, n = computed(() => {
    var h2, v;
    return (v = (h2 = j(e)) == null ? void 0 : h2.namespaceURI) == null ? void 0 : v.includes("svg");
  }), r = ref(s.width), d = ref(s.height), { stop: u } = ds(
    e,
    ([h2]) => {
      const v = o === "border-box" ? h2.borderBoxSize : o === "content-box" ? h2.contentBoxSize : h2.devicePixelContentBoxSize;
      if (i && n.value) {
        const k = j(e);
        if (k) {
          const w = i.getComputedStyle(k);
          r.value = Number.parseFloat(w.width), d.value = Number.parseFloat(w.height);
        }
      } else if (v) {
        const k = Array.isArray(v) ? v : [v];
        r.value = k.reduce((w, { inlineSize: T }) => w + T, 0), d.value = k.reduce((w, { blockSize: T }) => w + T, 0);
      } else
        r.value = h2.contentRect.width, d.value = h2.contentRect.height;
    },
    t
  );
  wt(() => {
    const h2 = j(e);
    h2 && (r.value = "offsetWidth" in h2 ? h2.offsetWidth : s.width, d.value = "offsetHeight" in h2 ? h2.offsetHeight : s.height);
  });
  const f = watch(
    () => j(e),
    (h2) => {
      r.value = h2 ? s.width : 0, d.value = h2 ? s.height : 0;
    }
  );
  function c() {
    u(), f();
  }
  return {
    width: r,
    height: d,
    stop: c
  };
}
function Pn(e = {}) {
  const {
    window: s = ve,
    initialWidth: t = Number.POSITIVE_INFINITY,
    initialHeight: i = Number.POSITIVE_INFINITY,
    listenOrientation: o = true,
    includeScrollbar: n = true
  } = e, r = ref(t), d = ref(i), u = () => {
    s && (n ? (r.value = s.innerWidth, d.value = s.innerHeight) : (r.value = s.document.documentElement.clientWidth, d.value = s.document.documentElement.clientHeight));
  };
  if (u(), wt(u), q("resize", u, { passive: true }), o) {
    const f = Vn("(orientation: portrait)");
    watch(f, () => u());
  }
  return { width: r, height: d };
}
const Ae = {
  props: {
    show: { type: [Boolean, Object], default: false }
  },
  emits: ["update:show"],
  data() {
    return {
      innerShow: false
    };
  },
  watch: {
    show: {
      immediate: true,
      handler(e) {
        this.innerShow = !!e;
      }
    },
    innerShow(e) {
      !!e !== this.show && this.$emit("update:show", e);
    }
  }
}, St = (e) => {
  const s = typeof e;
  return s === "boolean" || s === "string" ? true : e.nodeType === Node.ELEMENT_NODE;
}, Ct = {
  name: "detachable",
  props: {
    attach: {
      default: () => false,
      validator: St
    },
    contentClass: {
      type: [String, Object],
      default: ""
    },
    contentStyle: {
      type: [String, Object],
      default: () => ""
    }
  },
  data: () => ({
    hasDetached: false,
    // the final value of renderTo
    target: null
  }),
  inject: {
    vuDebug: {
      default: true
    }
  },
  watch: {
    attach() {
      this.hasDetached = false, this.initDetach();
    }
  },
  mounted() {
    this.initDetach();
  },
  methods: {
    initDetach() {
      if (this._isDestroyed || this.hasDetached || this.attach === "" || this.attach === true || this.attach === "attach")
        return;
      let e;
      if (this.attach ? typeof this.attach == "string" ? e = document.querySelector(this.attach) : e = this.attach : e = document.body, !e) {
        this.vuDebug && console.warn(`Unable to locate target ${this.attach}`, this);
        return;
      }
      this.vuDebug && e.tagName.toLowerCase() !== "body" && window.getComputedStyle(e).position !== "relative" && console.warn(`target (${e.tagName.toLowerCase()}${e.id && ` #${e.id}`}${e.className && ` .${e.className}`}) element should have a relative position`), this.target = e, this.hasDetached = true;
    }
  }
}, It = (e, s, t, i = { width: 0, x: 0, y: 0 }, { scrollTop: o = 0, scrollLeft: n = 0 } = {}, r = false, d = { left: 2, right: 2, top: 0, bottom: 0 }, u = { x: 0, y: 0 }) => {
  let f = s.y - i.y + o + (u.y || 0), c = s.x - i.x + n + (u.x || 0);
  isNaN(s.width) && (s.width = 0), isNaN(s.height) && (s.height = 0), /-right/.test(e) ? c += s.width - t.width : /^(top|bottom)$/.test(e) && (c += s.width / 2 - t.width / 2), /^bottom/.test(e) ? f += s.height : /^(left|right)(-top|-bottom)?$/.test(e) ? (c -= t.width, /^(right|right-\w{3,6})$/.test(e) && (c += s.width + t.width), /(-top|-bottom)/.test(e) ? /-bottom/.test(e) && (f += s.height - t.height) : f += s.height / 2 - t.height / 2) : f -= t.height;
  let h2 = 0, v = 0;
  const k = s.width / 2;
  if (r) {
    const w = d.left, T = i.width - t.width - d.right, D = Math.max(w, Math.min(c, T));
    h2 = c - D, c = D;
  }
  return {
    left: c,
    top: f,
    shiftX: h2,
    shiftY: v,
    offset: k
  };
}, Ln = {
  name: "vu-tooltip",
  mixins: [Ae],
  data: () => ({
    setPosition: It
  }),
  props: {
    type: {
      type: String,
      default: () => "tooltip"
    },
    side: {
      type: String,
      default: () => "top"
    },
    arrow: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: () => ""
    },
    animated: {
      type: Boolean,
      default: true
    },
    contentClass: {
      type: String,
      required: false,
      default: ""
    },
    prerender: {
      type: Boolean,
      required: false
    }
  }
}, Tn = ["innerHTML"];
function An(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    ref: "content",
    class: normalizeClass([`${t.side} ${t.type} ${t.type}-root`, { "without-arrow": !t.arrow }, { prerender: t.prerender }])
  }, [
    createVNode(Transition, {
      name: t.animated ? "fade" : ""
    }, {
      default: withCtx(() => [
        e.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass([`${t.type}-wrapper`])
        }, [
          renderSlot(e.$slots, "arrow", { side: t.side }, () => [
            t.arrow ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(`${t.type}-arrow`)
            }, null, 2)) : createCommentVNode("", true)
          ], true),
          renderSlot(e.$slots, "title", { side: t.side }, void 0, true),
          createBaseVNode("div", {
            ref: "body",
            class: normalizeClass(`${t.type}-body`)
          }, [
            t.text ? (openBlock(), createElementBlock("span", {
              key: 0,
              innerHTML: t.text
            }, null, 8, Tn)) : renderSlot(e.$slots, "default", {
              key: 1,
              side: t.side
            }, void 0, true)
          ], 2)
        ], 2)) : createCommentVNode("", true)
      ]),
      _: 3
    }, 8, ["name"])
  ], 2);
}
const Bt = /* @__PURE__ */ O(Ln, [["render", An], ["__scopeId", "data-v-6aee5d0c"]]), Fn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Bt
}, Symbol.toStringTag, { value: "Module" })), Dn = function(s, t) {
  let i, o;
  return function(...r) {
    const d = this, u = +/* @__PURE__ */ new Date();
    i && u < i + t ? (clearTimeout(o), o = setTimeout(() => {
      i = u, s.apply(d, r);
    }, t)) : (i = u, s.apply(d, r));
  };
}, zn = ["top", "top-right", "right-bottom", "right", "right-top", "bottom-right", "bottom", "bottom-left", "left-top", "left", "left-bottom", "top-left"], Nn = (e, s, t, i) => {
  const o = t.indexOf(e), n = t[(o + 1) % t.length];
  return i.includes(n) ? s : n;
}, En = ({ intersectionRatio: e }) => e < 1, jn = {
  name: "vu-popover",
  mixins: [Ae, Ct],
  expose: ["updatePosition", "toggle"],
  emits: ["unpositionable"],
  components: { VuTooltip: Bt },
  props: {
    type: {
      type: String,
      default: "popover"
    },
    side: {
      type: String,
      default: "bottom"
    },
    arrow: {
      type: Boolean,
      default: false
    },
    shift: {
      type: Boolean,
      default: false
    },
    offsets: {
      type: Object,
      default: void 0
    },
    animated: {
      type: Boolean,
      default: true
    },
    overlay: {
      type: Boolean,
      default: false
    },
    click: {
      type: Boolean,
      default: true
    },
    hover: {
      type: Boolean,
      default: false
    },
    hoverImmediate: {
      type: Boolean,
      default: false
    },
    hoverDelay: {
      type: Number,
      default: 500
    },
    title: {
      type: String,
      default: () => ""
    },
    persistent: {
      type: Boolean,
      default: false
    },
    positions: {
      type: Array,
      required: false,
      default: () => zn
    },
    getNextPosition: {
      type: Function,
      required: false,
      default: Nn
    },
    checkPosition: {
      type: Function,
      required: false,
      default: En
    },
    syncWidth: {
      type: Boolean,
      default: false
    },
    ignoreEscapeKey: {
      type: Boolean,
      default: false
    },
    ignoreClickOutside: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    open: false,
    width: 0,
    resizeObs: null,
    debounce: function() {
    },
    useDebounceFn: jt,
    intersectionObs: null,
    setPositionBound: null,
    shifted: false,
    positioned: false,
    fadeTimeout: void 0,
    positionAttempts: [],
    scrollableAncestors: [],
    // put in positionable
    innerSide: "",
    keyboardListener: function() {
    }
  }),
  watch: {
    innerShow: {
      immediate: true,
      async handler(e) {
        e ? (this.fadeTimeout && (this.fadeTimeout = void 0), await new Promise((s) => setTimeout(s, 10)), this.positioned = false, this.open = true, this.positionAttempts = [], await this.$nextTick(), this.setPositionBound(), this.intersectionObs.observe(this.$refs.tooltip.$el), this.resizeObs || (this.resizeObs = new ResizeObserver(async () => {
          this.setPositionBound(true);
        })), this.listenScrolls()) : (this.$refs.tooltip && (this.intersectionObs.unobserve(this.$refs.tooltip.$el), this.resizeObs.disconnect()), this.stopScrollListening(), this.animated ? this.fadeTimeout = setTimeout(() => {
          this.open = false;
        }, 500) : this.open = false);
      }
    },
    innerSide: {
      handler() {
        this.updatePosition();
      }
    },
    attach() {
      this.innerShow && this.updatePosition();
    },
    open: {
      handler(e) {
        this.target && (e && !this.ignoreEscapeKey ? this.keyboardListener = q(this.target, "keydown", () => {
          this.innerShow = false;
        }) : this.keyboardListener());
      }
    },
    hover: {
      immediate: true,
      handler: function() {
        this.attachHover();
      }
    },
    hoverImmediate() {
      this.attachHover();
    },
    hoverDelay() {
      this.attachHover();
    }
  },
  created() {
    this.setPositionBound = Dn(this.setPosition.bind(this), 1);
  },
  async mounted() {
    await this.$nextTick();
    let e = 0;
    const s = 5;
    for (; e < s && this.$refs.activator === void 0 && this.$refs.tooltip === void 0; )
      e++, await this.$nextTick();
    const { target: t, positionAttempts: i } = this;
    this.intersectionObs = new IntersectionObserver(([{ boundingClientRect: o, rootBounds: n, intersectionRatio: r, intersectionRect: d }]) => {
      if (this.$refs.tooltip && this.intersectionObs.unobserve(this.$refs.tooltip.$el), this.checkPosition({ intersectionRatio: r, elementRect: o, targetRect: n, intersectionRect: d, positionAttempts: i })) {
        const u = this.getNextPosition(this.innerSide || this.side, this.side, this.positions, this.positionAttempts);
        if (this.positionAttempts.length > this.positions.length) {
          this.$emit("unpositionable"), this.positioned = true, this.positionAttempts = [];
          return;
        }
        this.innerSide = u, this.positionAttempts.push(this.innerSide);
      } else
        this.positioned = true, this.positionAttempts = [], this.resizeObs.observe(this.$refs.tooltip.$el), this.resizeObs.observe(this.target);
    }, { root: t !== document.body ? t : void 0 });
  },
  beforeUnmount() {
    try {
      this.innerShow = false, this.stopScrollListening(), this.intersectionObs.disconnect(), this.resizeObs.disconnect();
    } catch {
    }
  },
  methods: {
    listenScrolls() {
      const e = [];
      let s = this.$refs.activator.parentElement;
      for (; s && (this.target.contains(s) || s === this.target); ) {
        const { overflow: t } = window.getComputedStyle(s), i = t.split(" ");
        ["auto", "scroll"].some((o) => i.includes(o)) && e.push(s), s = s.parentElement;
      }
      this.scrollableAncestors = e, this.scrollableAncestors.forEach((t) => t.addEventListener("scroll", this.setPositionBound));
    },
    stopScrollListening() {
      this.scrollableAncestors.forEach((e) => e.removeEventListener("scroll", this.setPositionBound));
    },
    updatePosition() {
      var e;
      this.setPositionBound(), this.intersectionObs.observe((e = this.$refs.tooltip) == null ? void 0 : e.$el);
    },
    async setPosition(e) {
      var d;
      e && await this.$nextTick();
      let s = this.$refs.activator.getBoundingClientRect();
      const t = (d = this.$refs.tooltip) == null ? void 0 : d.$el;
      if (!t)
        return;
      let i = t.getBoundingClientRect();
      this.syncWidth && i.width !== s.width && (this.width = s.width, await this.$nextTick(), s = this.$refs.activator.getBoundingClientRect(), i = this.$refs.tooltip.$el.getBoundingClientRect());
      const o = this.target.getBoundingClientRect(), n = this.offsets && this.offsets[this.innerSide || this.side] || {};
      this.positionAttempts.push(this.innerSide || this.side);
      const r = It(
        this.innerSide || this.side,
        s,
        i,
        o,
        this.target,
        this.shift,
        { left: 0, right: 0 },
        n
      );
      this.shifted = r.shiftX, t.style.top = `${r.top}px`, t.style.left = `${r.left}px`, this.overlay && (this.$refs.overlay.style.top = `${this.target === document.body ? document.scrollingElement.scrollTop : this.target.scrollTop}px`);
    },
    onClickOutside(e, s = false) {
      if (this.ignoreClickOutside || !this.innerShow)
        return;
      const { target: t } = e;
      s && e.preventDefault(), !(this.$refs.tooltip && (t === this.$refs.tooltip.$el || this.$refs.tooltip.$el.contains(t))) && (this.innerShow = false);
    },
    onHover(e) {
      this.debounce(e).then((s) => {
        this.openedByClick || (s === "mouseenter" ? this.innerShow = true : (this.innerShow = false, this.openedByClick = false));
      }).catch(() => {
      });
    },
    attachHover() {
      this.hover && !this.hoverImmediate ? this.debounce = jt(({ type: e }) => e, this.hoverDelay, { rejectOnCancel: true }) : this.debounce = function() {
      };
    },
    onClick() {
      this.toggle(), this.hover && this.innerShow ? this.openedByClick = true : this.openedByClick = false;
    },
    toggle(e = void 0) {
      e !== void 0 ? this.innerShow = e : this.innerShow = !this.innerShow;
    }
  }
};
function Rn(e, s, t, i, o, n) {
  const r = resolveComponent("VuTooltip"), d = resolveDirective("click-outside");
  return openBlock(), createElementBlock(Fragment, null, [
    withDirectives((openBlock(), createElementBlock("span", mergeProps({
      ref: "activator",
      class: "vu-popover__activator",
      onClick: s[0] || (s[0] = (u) => t.click && n.onClick(true))
    }, e.$attrs, {
      onMouseenter: s[1] || (s[1] = (u) => t.hover && n.onHover(u)),
      onMouseleave: s[2] || (s[2] = (u) => t.hover && n.onHover(u))
    }), [
      renderSlot(e.$slots, "default", {}, void 0, true)
    ], 16)), [
      [d, { handler: n.onClickOutside, innerShow: e.innerShow }]
    ]),
    e.open || t.persistent ? withDirectives((openBlock(), createBlock(Teleport, {
      key: 0,
      to: e.target
    }, [
      createVNode(Transition, {
        name: t.animated ? "fade" : ""
      }, {
        default: withCtx(() => [
          e.innerShow && t.overlay ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "mask popover-mask",
            ref: "overlay",
            onWheel: s[3] || (s[3] = withModifiers((...u) => n.onClickOutside && n.onClickOutside(...u), ["prevent"])),
            onTouchstart: s[4] || (s[4] = (u) => n.onClickOutside(u, true))
          }, null, 544)) : createCommentVNode("", true)
        ]),
        _: 1
      }, 8, ["name"]),
      createVNode(Transition, {
        appear: "",
        name: t.animated ? "fade" : ""
      }, {
        default: withCtx(() => [
          withDirectives(createVNode(r, {
            ref: "tooltip",
            arrow: t.arrow,
            prerender: !e.positioned,
            type: t.type,
            show: true,
            side: e.innerSide || t.side,
            class: normalizeClass(e.contentClass),
            style: normalizeStyle([e.width ? `width: ${e.width}px` : {}, e.contentStyle]),
            "onUpdate:show": s[5] || (s[5] = (u) => e.open = false),
            onMouseenter: s[6] || (s[6] = (u) => t.hover && n.onHover(u)),
            onMouseleave: s[7] || (s[7] = (u) => t.hover && n.onHover(u))
          }, {
            arrow: withCtx(({ side: u }) => [
              renderSlot(e.$slots, "arrow", {
                side: e.innerSide || u,
                shift: e.shifted
              }, void 0, true)
            ]),
            title: withCtx(({ side: u }) => [
              renderSlot(e.$slots, "title", {
                side: e.innerSide || u
              }, () => [
                t.title ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createTextVNode(toDisplayString(t.title), 1)
                ], 64)) : createCommentVNode("", true)
              ], true)
            ]),
            default: withCtx(() => [
              renderSlot(e.$slots, "body", {}, void 0, true)
            ]),
            _: 3
          }, 8, ["arrow", "prerender", "type", "side", "class", "style"]), [
            [vShow, e.innerShow || e.show]
          ])
        ]),
        _: 3
      }, 8, ["name"])
    ], 8, ["to"])), [
      [vShow, e.open]
    ]) : createCommentVNode("", true)
  ], 64);
}
const re = /* @__PURE__ */ O(jn, [["render", Rn], ["__scopeId", "data-v-c9825986"]]), Un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: re
}, Symbol.toStringTag, { value: "Module" })), Hn = {
  name: "vu-status-bar",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    constrained: Boolean
  },
  data() {
    return {
      overflows: false,
      ellipsis: false,
      intObs: null,
      intObs2: null,
      visibleAmount: 0
    };
  },
  mounted() {
    this.watchSize();
  },
  computed: {
    visibleItems() {
      return this.items.slice(0, this.visibleAmount);
    },
    hiddenItems() {
      return this.overflows ? this.items.slice(this.visibleAmount) : [];
    }
  },
  watch: {
    items: {
      immediate: true,
      // eslint-disable-next-line object-shorthand, func-names
      handler: function(e) {
        this.visibleAmount = e.length, this.ellipsis = false, this.overflows = false, this.$el && this.$nextTick(() => this.watchSize());
      }
    }
  },
  methods: {
    watchSize() {
      this.intObs = new IntersectionObserver(this.intersects, {
        root: this.$refs.container,
        threshold: 1
      }), this.intObs.observe(this.$refs.inner), this.intObs2 = new IntersectionObserver(this.intersects2, {
        root: this.$refs.inner,
        threshold: 1
      });
    },
    async intersects() {
      this.intObs.disconnect(), this.ellipsis = true;
      const e = this.$refs.inner.querySelectorAll(".vu-badge");
      await this.$nextTick(), e.forEach((s) => {
        this.intObs2.observe(s);
      });
    },
    intersects2(e) {
      const s = e.filter((i) => i.intersectionRatio < 1);
      let { length: t } = s;
      if (t) {
        const i = this.$refs.inner.getBoundingClientRect(), { right: o } = i, n = s.shift();
        n && o - n.target.getBoundingClientRect().left - 22 < 0 && (t += 1), this.visibleAmount -= t, this.overflows = true;
      }
      this.intObs2.disconnect();
    },
    units(e) {
      return this.ellipsis ? e > 99 ? "99+" : `${e}` : `${e}`;
    },
    destroyed() {
      this.intObs1 && delete this.intObs1, this.intObs2 && delete this.intObs2;
    }
  },
  components: { VuBadge: _t, VuPopover: re, VuIcon: H }
}, qn = {
  class: "status-bar__inner",
  ref: "inner"
};
function Wn(e, s, t, i, o, n) {
  const r = resolveComponent("VuBadge"), d = resolveComponent("VuIcon"), u = resolveComponent("VuPopover"), f = resolveDirective("tooltip");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-status-bar", { "status-bar--constrained": t.constrained }]),
    ref: "container"
  }, [
    createBaseVNode("div", qn, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(n.visibleItems, (c) => withDirectives((openBlock(), createBlock(r, {
        key: c.id,
        icon: c.icon,
        text: c.text || c.amount && n.units(c.amount) || "",
        color: c.color || "copy-grey",
        value: c.value,
        togglable: false,
        style: normalizeStyle([c.amount && c.icon ? "min-width: 45px" : ""])
      }, null, 8, ["icon", "text", "color", "value", "style"])), [
        [
          f,
          c.tooltip || c.text || c.amount || "",
          void 0,
          { hover: true }
        ]
      ])), 128)),
      o.overflows ? (openBlock(), createBlock(u, {
        key: 0,
        type: "tooltip",
        "content-class": "vu-status-bar",
        shift: "",
        arrow: ""
      }, {
        default: withCtx(() => [
          createVNode(d, {
            icon: "menu-dot",
            style: { transform: "rotate(90deg)" }
          })
        ]),
        body: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(n.hiddenItems, (c) => (openBlock(), createBlock(r, {
            key: c.id,
            icon: c.icon,
            text: c.text || `${c.amount}` || "",
            color: c.color || "copy-grey",
            value: c.value,
            togglable: false
          }, null, 8, ["icon", "text", "color", "value"]))), 128))
        ]),
        _: 1
      })) : createCommentVNode("", true)
    ], 512)
  ], 2);
}
const Ot = /* @__PURE__ */ O(Hn, [["render", Wn], ["__scopeId", "data-v-71ee9873"]]), Kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ot
}, Symbol.toStringTag, { value: "Module" })), Gn = {
  name: "vu-lazy",
  props: {
    height: {
      type: [Number, String],
      default: () => "10px"
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["intersect"],
  data: () => ({
    observer: null,
    intersected: false
  }),
  mounted() {
    "IntersectionObserver" in window ? (this.observer = new IntersectionObserver((e) => {
      e[0].isIntersecting && (this.intersected = true, this.observer.disconnect(), this.$emit("intersect"));
    }, this.options), this.observer.observe(this.$el)) : (this.intersected = true, this.$emit("intersect"));
  },
  beforeUnmount() {
    "IntersectionObserver" in window && this.observer && this.observer.disconnect(), delete this.observer;
  }
};
function Yn(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    style: normalizeStyle(e.intersected ? "" : `min-height: ${t.height}${typeof t.height == "number" && "px" || ""}`)
  }, [
    e.intersected ? renderSlot(e.$slots, "default", { key: 0 }) : renderSlot(e.$slots, "placeholder", { key: 1 })
  ], 4);
}
const Vt = /* @__PURE__ */ O(Gn, [["render", Yn]]), Xn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Vt
}, Symbol.toStringTag, { value: "Module" })), Jn = {
  name: "vu-image",
  components: { VuLazy: Vt },
  props: {
    lazy: {
      type: Boolean,
      required: false
    },
    src: {
      type: [URL, String],
      required: true
    },
    height: [Number, String],
    maxHeight: [Number, String],
    maxWidth: [Number, String],
    minHeight: [Number, String],
    minWidth: [Number, String],
    width: [Number, String],
    contain: Boolean,
    aspectRatio: String
  },
  emits: ["load", "error"],
  data: () => ({
    image: void 0,
    calculatedAspectRatio: void 0,
    naturalWidth: void 0,
    isLoading: true,
    hasError: false
  }),
  inject: {
    vuDebug: {
      default: false
    }
  },
  computed: {
    computedAspectRatio() {
      return Number(this.aspectRatio || this.calculatedAspectRatio);
    },
    imageSizerStyle() {
      return this.computedAspectRatio ? { paddingBottom: `${1 / this.computedAspectRatio * 100}%` } : void 0;
    },
    imageStyle() {
      return [
        Number.isNaN(this.width) ? "" : { width: `${this.width}px` },
        Number.isNaN(this.height) ? "" : { height: `${this.height}px` },
        Number.isNaN(this.minHeight) ? "" : { minHeight: `${this.minHeight}px` },
        Number.isNaN(this.maxHeight) ? "" : { maxHeight: `${this.maxHeight}px` },
        Number.isNaN(this.minWidth) ? "" : { minWidth: `${this.minWidth}px` },
        Number.isNaN(this.maxWidth) ? "" : { maxWidth: `${this.maxWidth}px` }
      ];
    },
    imageClasses() {
      return `vu-image__image--${this.contain ? "contain" : "cover"}`;
    }
  },
  watch: {
    src() {
      this.isLoading ? this.loadImage() : this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.lazy || this.loadImage();
    },
    loadImage() {
      const e = new Image();
      this.image = e, this.isLoading = true, e.onload = () => {
        e.decode ? e.decode().catch((s) => {
          this.vuDebug && console.warn(
            `Failed to decode image, trying to render anyway

src: ${this.src}` + (s.message ? `
Original error: ${s.message}` : ""),
            this
          );
        }).then(this.onLoad) : this.onLoad();
      }, e.onerror = this.onError, e.src = this.src, this.aspectRatio || this.pollForSize(e);
    },
    pollForSize(e, s = 100) {
      const t = () => {
        const { naturalHeight: i, naturalWidth: o } = e;
        i || o ? (this.naturalWidth = o, this.calculatedAspectRatio = o / i, this.image = null) : !e.complete && this.isLoading && !this.hasError && s != null && setTimeout(t, s);
      };
      t();
    },
    onLoad() {
      this.isLoading = false, this.$emit("load", this.src);
    },
    onError() {
      this.hasError = true, this.$emit("error", this.src);
    }
  }
}, Qn = (e) => (pushScopeId("data-v-485690ee"), e = e(), popScopeId(), e), Zn = /* @__PURE__ */ Qn(() => /* @__PURE__ */ createBaseVNode("div", { class: "vu-image__fill" }, null, -1));
function ei(e, s, t, i, o, n) {
  const r = resolveComponent("VuLazy");
  return openBlock(), createElementBlock("div", {
    class: "vu-image",
    style: normalizeStyle(n.imageStyle)
  }, [
    createBaseVNode("div", {
      class: "vu-image__sizer",
      style: normalizeStyle(n.imageSizerStyle)
    }, null, 4),
    t.lazy ? (openBlock(), createBlock(r, {
      key: 0,
      height: t.height || t.maxHeight || t.minHeight || 10,
      onIntersect: s[0] || (s[0] = (d) => n.loadImage())
    }, {
      default: withCtx(() => [
        createBaseVNode("div", {
          class: normalizeClass(["vu-image__image", n.imageClasses]),
          style: normalizeStyle([[e.isLoading ? "" : { backgroundImage: `url(${t.src})` }], { "background-position": "center center" }])
        }, null, 6)
      ]),
      _: 1
    }, 8, ["height"])) : (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(["vu-image__image", n.imageClasses]),
      style: normalizeStyle([[e.isLoading ? "" : { backgroundImage: `url(${t.src})` }], { "background-position": "center center" }])
    }, null, 6)),
    Zn,
    renderSlot(e.$slots, "default", {}, void 0, true)
  ], 4);
}
const Fe = /* @__PURE__ */ O(Jn, [["render", ei], ["__scopeId", "data-v-485690ee"]]), ti = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Fe
}, Symbol.toStringTag, { value: "Module" })), Qe = Symbol("vuIsMobileOrTablet"), cs = Symbol("vuIsIOS"), si = Symbol("vuAlertDialogConfirmButtonLabel"), ni = Symbol("vuAlertDialogCloseButtonLabel"), ii = Symbol("vuAlertDialogRiskyButtonLabel"), li = Symbol("vuAlertDialogCloseButtonAltLabel"), oi = Symbol("vuDropdownMenuOverlay"), ri = Symbol("vuTimelineDividerAncestorDepth"), ai = Symbol("vuTimelineDividerStickyContainer");
function ye() {
  return window ? ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (e) => (e ^ (window.crypto || window.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16)) : (void 0)();
}
function hs(e, s = true) {
  let t = s;
  return J(e).forEach((o) => {
    !o.text && !o.label && (!o.class || !o.class.includes("divider")) && (t = false), o.items && (t = hs(o.items, t));
  }), t;
}
ref();
const ui = {
  name: "vu-dropdownmenu-items",
  components: { VuIcon: H },
  emits: ["update:responsive", "update:position", "click-item", "update:selected"],
  props: {
    target: {
      type: HTMLElement,
      required: false
    },
    items: {
      type: Array,
      required: true,
      validator: hs
    },
    selected: {
      type: Array,
      required: true
    },
    zIndex: {
      type: Number,
      default: 1e3
    },
    responsive: {
      type: Boolean,
      default: false
    },
    dividedResponsiveItems: {
      type: Boolean,
      default: false
    },
    disableResponsive: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    stack: [],
    left: false,
    uuid: ye,
    root: false,
    parent: {}
  }),
  computed: {
    classes() {
      return {
        "open-left": this.left,
        "responsive-menu": this.responsive
      };
    },
    _items() {
      return this.stack[this.stack.length - 1] || this.items;
    },
    _parent() {
      return (this.stack[this.stack.length - 2] || this.items).find((e) => JSON.stringify(e.items) === JSON.stringify(this._items));
    }
  },
  async mounted() {
    var i;
    if (this.disableResponsive)
      return;
    await this.$nextTick();
    const e = {
      root: this.target,
      threshold: 1
    }, s = ((i = this.target) == null ? void 0 : i.getBoundingClientRect()) || { right: window.right, left: 0 }, t = new IntersectionObserver(async ([o]) => {
      t.unobserve(this.$el);
      const n = o.target.getBoundingClientRect();
      s.right < n.right && !this.left ? (this.left = true, await this.$nextTick(), t.observe(this.$el)) : s.left > n.left && this.left && (this.$emit("update:responsive", true), this.$emit("update:position"));
    }, e);
    await this.$nextTick(), t.observe(this.$el);
  },
  methods: {
    toggleSelected(e) {
      const s = this.selected.slice(0);
      return e.selected || this.selected.includes(e) ? s.splice(this.selected.indexOf(e), 1) : s.push(e), s;
    },
    onItemClick(e) {
      !e.disabled && (e.selectable || e.selected || this.selected.includes(e)) && this.$emit("update:selected", this.toggleSelected(e)), this.$emit("click-item", e);
    },
    onNextItemClick(e) {
      this.responsive && this.stack.push(e.items);
    },
    onBackItemClick() {
      this.stack.pop();
    }
  }
}, di = (e) => (pushScopeId("data-v-c023c529"), e = e(), popScopeId(), e), ci = { class: "dropdown-menu-wrap" }, hi = {
  key: 0,
  class: "item item-back"
}, fi = { class: "item-text" }, mi = ["onClick"], pi = { class: "item-text" }, gi = ["onClick"], vi = /* @__PURE__ */ di(() => /* @__PURE__ */ createBaseVNode("span", { class: "divider" }, null, -1)), yi = {
  key: 0,
  class: "item-text"
};
function bi(e, s, t, i, o, n) {
  const r = resolveComponent("VuIcon"), d = resolveComponent("vu-dropdownmenu-items", true);
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["dropdown-menu dropdown-menu-root dropdown-root", n.classes]),
    style: normalizeStyle([{ zIndex: t.zIndex }]),
    ref: "self"
  }, [
    createBaseVNode("ul", ci, [
      t.responsive && e.stack.length ? (openBlock(), createElementBlock("li", hi, [
        createVNode(r, {
          icon: "left-open",
          class: "back-item",
          onClick: withModifiers(n.onBackItemClick, ["stop"])
        }, null, 8, ["onClick"]),
        createBaseVNode("span", fi, toDisplayString(n._parent.text), 1)
      ])) : createCommentVNode("", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(n._items, (u) => (openBlock(), createElementBlock(Fragment, null, [
        !u.class || !u.class.includes("header") && !u.class.includes("divider") ? (openBlock(), createElementBlock("li", {
          key: u.text || u.label,
          class: normalizeClass(["item", [{
            "item-submenu": u.items,
            selectable: !u.disabled && u.selectable || u.selected || t.selected.includes(u),
            selected: u.selected || t.selected.includes(u),
            hidden: u.hidden,
            disabled: u.disabled,
            "hide-responsive-divider": !t.dividedResponsiveItems
          }, u.class]]),
          onClick: withModifiers((f) => u.items && t.responsive && !t.dividedResponsiveItems ? n.onNextItemClick(u) : n.onItemClick(u), ["stop"])
        }, [
          renderSlot(e.$slots, "default", { item: u }, () => [
            u.fonticon ? (openBlock(), createBlock(r, {
              key: 0,
              icon: u.fonticon,
              withinText: false
            }, null, 8, ["icon"])) : createCommentVNode("", true),
            createBaseVNode("span", pi, toDisplayString(u.text || u.label), 1)
          ], true),
          u.items ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "next-icon",
            onClick: withModifiers((f) => n.onNextItemClick(u), ["stop"])
          }, [
            vi,
            createVNode(r, { icon: "right-open" })
          ], 8, gi)) : createCommentVNode("", true),
          !t.responsive && u.items ? (openBlock(), createBlock(d, {
            key: 1,
            target: t.target,
            items: u.items,
            selected: t.selected,
            "z-index": t.zIndex + 1,
            onClickItem: n.onItemClick,
            "onUpdate:selected": s[0] || (s[0] = (f) => e.$emit("update:selected", f)),
            "onUpdate:responsive": s[1] || (s[1] = (f) => e.$emit("update:responsive", f)),
            "onUpdate:position": s[2] || (s[2] = () => {
              var h2;
              const { left: f, top: c } = (h2 = e.$refs.self) == null ? void 0 : h2.getBoundingClientRect();
              e.$emit("update:position", { x: f, y: c });
            })
          }, null, 8, ["target", "items", "selected", "z-index", "onClickItem"])) : createCommentVNode("", true)
        ], 10, mi)) : (openBlock(), createElementBlock("li", {
          key: u.text || u.label || e.uuid(),
          class: normalizeClass(u.class)
        }, [
          u.class !== "divider" ? (openBlock(), createElementBlock("span", yi, toDisplayString(u.text || u.label), 1)) : createCommentVNode("", true)
        ], 2))
      ], 64))), 256))
    ])
  ], 6);
}
const Ze = /* @__PURE__ */ O(ui, [["render", bi], ["__scopeId", "data-v-c023c529"]]), _i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ze
}, Symbol.toStringTag, { value: "Module" })), fs = ["top", "top-right", "bottom-right", "bottom", "bottom-left", "top-left"], ms = ({ intersectionRatio: e, elementRect: s, targetRect: t }) => e < 1 && (s.top < t.top || s.bottom > t.bottom), ps = (e, s, t, i) => {
  if (i.length === 1) {
    const o = i[0];
    return o.includes("top") ? o.replace("top", "bottom") : o.replace("bottom", "top");
  } else
    i.length > 1 && i.push(...fs);
  return s;
}, wi = inject(oi, false);
function gs(e, s = true) {
  let t = s;
  return e.forEach((i) => {
    !i.text && !i.label && (!i.class || !i.class.includes("divider")) && (t = false), i.items && (t = gs(i.items, t));
  }), t;
}
const ki = {
  components: { VuDropdownmenuItems: Ze, VuPopover: re },
  name: "vu-dropdownmenu",
  mixins: [Ae, Ct],
  emits: ["close", "click-item"],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      required: true,
      validator: gs
    },
    dividedResponsiveItems: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      required: false,
      default: "bottom-left"
    },
    arrow: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: () => 1e3
    },
    responsive: {
      type: Boolean,
      default: false
    },
    shift: {
      type: Boolean,
      default: false
    },
    closeOnClick: {
      type: Boolean,
      default: true
    },
    positions: {
      type: Array,
      required: false,
      default: () => fs
    },
    getNextPosition: {
      type: Function,
      required: false,
      default: ps
    },
    checkPosition: {
      type: Function,
      required: false,
      default: ms
    },
    ignoreEscapeKey: {
      type: Boolean,
      default: false
    },
    ignoreClickOutside: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    innerResponsive: false
  }),
  computed: {
    isResponsive: {
      get() {
        return this.innerResponsive || this.responsive;
      },
      set(e) {
        this.innerResponsive = e;
      }
    }
  },
  watch: {
    async items() {
      this.innerShow && (await this.$nextTick(), this.$refs.popover.updatePosition());
    }
  },
  methods: {
    handleClick(e) {
      e.handler && e.handler(e), this.$emit("click-item", e), this.updateShow(false);
    },
    updateShow(e) {
      e ? this.isResponsive = false : this.closeOnClick && (this.innerShow = false, this.$emit("close"));
    }
  }
}, Ce = /* @__PURE__ */ Object.assign(ki, {
  setup(e) {
    return (s, t) => (openBlock(), createBlock(re, {
      ref: "popover",
      show: s.innerShow,
      "onUpdate:show": [
        t[1] || (t[1] = (i) => s.innerShow = i),
        s.updateShow
      ],
      shift: e.shift || e.responsive,
      type: "dropdownmenu popover",
      attach: s.target,
      side: e.position,
      overlay: e.overlay || unref(wi),
      animated: false,
      "check-position": unref(ms),
      "get-next-position": unref(ps),
      "ignore-click-outside": e.ignoreClickOutside,
      arrow: false,
      ignoreEscapeKey: e.ignoreEscapeKey
    }, {
      body: withCtx(() => [
        createVNode(Ze, {
          responsive: s.isResponsive,
          "onUpdate:responsive": t[0] || (t[0] = (i) => s.isResponsive = i),
          "divided-responsive-items": e.dividedResponsiveItems,
          target: s.target,
          items: e.items,
          selected: e.value,
          onClickItem: s.handleClick
        }, null, 8, ["responsive", "divided-responsive-items", "target", "items", "selected", "onClickItem"])
      ]),
      default: withCtx(() => [
        renderSlot(s.$slots, "default", { active: s.innerShow })
      ]),
      _: 3
    }, 8, ["show", "shift", "attach", "side", "overlay", "check-position", "get-next-position", "ignore-click-outside", "ignoreEscapeKey", "onUpdate:show"]));
  }
}), Si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ce
}, Symbol.toStringTag, { value: "Module" })), $t = {
  props: {
    active: {
      type: Boolean,
      default: () => false
    }
  }
}, Ci = {
  props: {
    size: {
      type: String,
      default: () => ""
    }
  }
}, Ii = {
  name: "vu-icon-btn",
  mixins: [$t, K, Te, Ci],
  components: { VuIcon: H },
  props: {
    icon: {
      required: true,
      type: String
    },
    disableChevronResize: {
      default: false,
      type: Boolean
    },
    noActive: {
      default: false,
      type: Boolean
    },
    noHover: {
      default: false,
      type: Boolean
    }
  }
};
function Bi(e, s, t, i, o, n) {
  const r = resolveComponent("VuIcon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-icon-btn", [e.color, e.size, { active: e.active && !t.noActive, "no-active": t.noActive, "no-hover": t.noHover, disabled: e.disabled }]]),
    onClickCapture: s[0] || (s[0] = (d) => {
      this.disabled && d.stopPropagation();
    })
  }, [
    createVNode(r, {
      icon: t.icon,
      color: e.color,
      class: normalizeClass({ "chevron-menu-icon": t.icon === "chevron-down" && t.disableChevronResize, disabled: e.disabled })
    }, null, 8, ["icon", "color", "class"])
  ], 34);
}
const U = /* @__PURE__ */ O(Ii, [["render", Bi], ["__scopeId", "data-v-5e3ae391"]]), Oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: U
}, Symbol.toStringTag, { value: "Module" })), Vi = {
  name: "vu-tile",
  inject: ["vuCollectionActions", "vuCollectionLazyImages", "lang", "vuTileEmphasizeText", "vuDateFormatWeekday", "vuDateFormatShort"],
  emits: ["click-action"],
  props: {
    /* eslint-disable vue/require-default-prop */
    id: {
      type: String
    },
    src: String,
    type: String,
    title: String,
    text: String,
    author: String,
    date: Date,
    customMetaData: String,
    status: Array,
    active: Boolean,
    actions: Array || String,
    selected: Boolean,
    selectable: Boolean,
    thumbnail: Boolean,
    hideStatusBar: Boolean
  },
  computed: {
    classes() {
      return {
        "tile--selectable": this.selectable || this.selected,
        "tile--selected": this.selected,
        "tile--active": this.active,
        "tile--thumbnail": this.thumbnail
      };
    },
    _actions() {
      return this.actions || this.vuCollectionActions;
    },
    contentClasses() {
      const e = "tile__content";
      return this.thumbnail ? this.meta ? `${e}__title--2rows` : `${e}__title--3rows` : this.meta && this.text ? this.vuTileEmphasizeText ? [
        `${e}__title--1row`,
        `${e}__text--2rows`
      ] : [
        `${e}__title--2row`,
        `${e}__text--1row`
      ] : (this.meta ? !this.text : this.text) ? [`${e}__title--3rows`, `${e}__text--1row`] : `${e}__title--4rows`;
    },
    meta() {
      return this.customMetaData || `${this.author || ""}${this.author && this.date ? " | " : ""}${this.dateFormat}`;
    },
    dateFormatOptions() {
      const e = {
        weekday: this.vuDateFormatShort ? "short" : "long",
        month: this.vuDateFormatShort ? "short" : "long",
        day: "numeric",
        year: "numeric"
      };
      return this.vuDateFormatWeekday || delete e.weekday, e;
    },
    dateFormat() {
      return this.date ? this.date.toLocaleDateString(this.lang, this.dateFormatOptions) : "";
    }
  },
  data() {
    return {
      started: false
    };
  },
  mounted() {
  },
  watch: {},
  methods: {},
  components: { VuImage: Fe, VuIcon: H, VuIcon: H, VuDropdownmenu: Ce, VuStatusBar: Ot, VuIconBtn: U }
}, $i = { class: "tile-wrap" }, xi = {
  key: 0,
  class: "tile__thumb"
}, Mi = {
  key: 1,
  class: "tile__image"
}, Pi = { class: "tile__title" }, Li = { class: "inner" }, Ti = {
  key: 0,
  class: "tile__meta"
}, Ai = { class: "inner" }, Fi = {
  key: 1,
  class: "tile__text"
}, Di = { class: "inner" }, zi = {
  key: 2,
  class: "tile__action-icon"
};
function Ni(e, s, t, i, o, n) {
  const r = resolveComponent("VuImage"), d = resolveComponent("VuIcon"), u = resolveComponent("vuIconBtn"), f = resolveComponent("VuDropdownmenu"), c = resolveComponent("VuIconBtn"), h2 = resolveComponent("VuStatusBar");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-tile", n.classes])
  }, [
    createBaseVNode("div", $i, [
      t.active ? (openBlock(), createElementBlock("div", xi)) : createCommentVNode("", true),
      t.src ? (openBlock(), createElementBlock("div", Mi, [
        createVNode(r, {
          src: t.src,
          width: "80",
          height: "60",
          contain: "",
          "aspect-ratio": "1",
          lazy: n.vuCollectionLazyImages
        }, null, 8, ["src", "lazy"]),
        t.src && (t.selectable || t.selected) ? (openBlock(), createBlock(d, {
          key: 0,
          icon: "check",
          class: "tile__check"
        })) : createCommentVNode("", true)
      ])) : createCommentVNode("", true),
      createBaseVNode("div", {
        class: normalizeClass(["tile__content", n.contentClasses])
      }, [
        createBaseVNode("div", Pi, [
          t.type ? (openBlock(), createBlock(d, {
            key: 0,
            icon: t.type
          }, null, 8, ["icon"])) : createCommentVNode("", true),
          createBaseVNode("span", Li, toDisplayString(t.title), 1)
        ]),
        n.meta ? (openBlock(), createElementBlock("div", Ti, [
          createBaseVNode("span", Ai, toDisplayString(n.meta), 1)
        ])) : createCommentVNode("", true),
        t.text ? (openBlock(), createElementBlock("div", Fi, [
          createBaseVNode("span", Di, toDisplayString(t.text), 1)
        ])) : createCommentVNode("", true)
      ], 2),
      n._actions ? (openBlock(), createElementBlock("div", zi, [
        n._actions.length > 1 ? (openBlock(), createBlock(f, {
          key: 0,
          items: n._actions,
          onClickItem: s[0] || (s[0] = (v) => e.$emit("click-action", { item: v, id: t.id }))
        }, {
          default: withCtx((v) => [
            createVNode(u, {
              icon: "chevron-down",
              class: normalizeClass(v)
            }, null, 8, ["class"])
          ]),
          _: 1
        }, 8, ["items"])) : (openBlock(), createBlock(c, {
          key: 1,
          icon: n._actions[0].fonticon,
          onClick: s[1] || (s[1] = (v) => e.$emit("click-action", { item: v, id: t.id }))
        }, null, 8, ["icon"]))
      ])) : createCommentVNode("", true)
    ]),
    t.hideStatusBar ? createCommentVNode("", true) : (openBlock(), createBlock(h2, {
      key: 0,
      status: t.status
    }, null, 8, ["status"]))
  ], 2);
}
const vs = /* @__PURE__ */ O(Vi, [["render", Ni], ["__scopeId", "data-v-32fc46b9"]]), Ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: vs
}, Symbol.toStringTag, { value: "Module" })), ji = {
  name: "vu-thumbnail",
  inject: ["vuCollectionLazyImages"],
  props: {
    /* eslint-disable vue/require-default-prop */
    id: {
      type: String,
      required: true
    },
    src: String,
    type: String,
    active: Boolean,
    actions: Array,
    title: String,
    text: String,
    selected: Boolean,
    selectable: Boolean,
    author: String,
    date: Date,
    customMetaData: String,
    status: Array,
    hideStatusBar: Boolean
  },
  data: () => ({
    getListenersFromAttrs: ce
  }),
  computed: {
    classes() {
      return {
        "thumbnail--selectable": this.selectable || this.selected,
        "thumbnail--selected": this.selected,
        "thumbnail--active": this.active
      };
    }
  },
  components: { VuImage: Fe, VuIcon: H, VuTile: vs, VuStatusBar: Ot }
}, Ri = {
  class: "thumbnail-wrap",
  style: { position: "relative" }
}, Ui = {
  key: 0,
  class: "thumbnail__thumb"
}, Hi = { class: "thumbnail__content" };
function qi(e, s, t, i, o, n) {
  const r = resolveComponent("VuImage"), d = resolveComponent("VuIcon"), u = resolveComponent("VuTile"), f = resolveComponent("VuStatusBar");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-thumbnail item", n.classes])
  }, [
    createBaseVNode("div", Ri, [
      createVNode(r, {
        src: t.src,
        lazy: n.vuCollectionLazyImages,
        "aspect-ratio": "200/150",
        contain: ""
      }, null, 8, ["src", "lazy"]),
      t.active ? (openBlock(), createElementBlock("div", Ui)) : createCommentVNode("", true),
      t.selectable || t.selected ? (openBlock(), createBlock(d, {
        key: 1,
        icon: "check",
        class: "thumbnail__check"
      })) : createCommentVNode("", true),
      createVNode(u, {
        thumbnail: "",
        title: t.title,
        type: t.type,
        author: t.author,
        date: t.date,
        actions: t.actions,
        "custom-meta-data": t.customMetaData,
        "hide-status-bar": "",
        onClickAction: e.getListenersFromAttrs(e.$attrs).onClickAction
      }, null, 8, ["title", "type", "author", "date", "actions", "custom-meta-data", "onClickAction"]),
      createBaseVNode("div", Hi, toDisplayString(t.text), 1),
      t.hideStatusBar ? createCommentVNode("", true) : (openBlock(), createBlock(f, {
        key: 2,
        status: t.status
      }, null, 8, ["status"]))
    ])
  ], 2);
}
const Wi = /* @__PURE__ */ O(ji, [["render", qi], ["__scopeId", "data-v-86120de9"]]), Ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Wi
}, Symbol.toStringTag, { value: "Module" })), Ie = {
  props: {
    loading: {
      type: Boolean,
      default: () => false
    }
  }
}, Gi = {
  name: "vu-accordion",
  mixins: [Ie],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    items: {
      type: Number,
      default: () => 0
    },
    open: {
      type: Boolean,
      default: () => false
    },
    filled: {
      type: Boolean,
      default: () => false
    },
    divided: {
      type: Boolean,
      default: () => false
    },
    outlined: {
      type: Boolean,
      default: () => false
    },
    separated: {
      type: Boolean,
      default: () => false
    },
    animated: {
      type: Boolean,
      default: () => false
    },
    exclusive: {
      type: Boolean,
      default: () => false
    },
    keepRendered: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ["update:modelValue"],
  data: () => ({
    guid: ye
  }),
  created() {
    if (this.open && !this.exclusive) {
      let e = this.items;
      const s = [];
      for (; e; )
        s.push(e--);
      this.$emit("update:modelValue", s);
    }
  },
  computed: {
    value() {
      return this.modelValue;
    }
  },
  methods: {
    toggle(e) {
      if (this.value.includes(e)) {
        const s = this.value.slice();
        s.splice(s.indexOf(e), 1), this.$emit("update:modelValue", s);
      } else
        this.exclusive ? this.$emit("update:modelValue", [e]) : this.$emit("update:modelValue", [e].concat(this.value || []));
    }
  }
}, Yi = { class: "accordion-container" }, Xi = ["onClick"], Ji = /* @__PURE__ */ createBaseVNode("i", { class: "caret-left" }, null, -1), Qi = {
  key: 0,
  class: "content-wrapper"
};
function Zi(e, s, t, i, o, n) {
  const r = resolveDirective("mask");
  return withDirectives((openBlock(), createElementBlock("div", Yi, [
    createBaseVNode("div", {
      class: normalizeClass(["accordion accordion-root", {
        filled: t.filled,
        "filled-separate": t.separated,
        divided: t.divided,
        styled: t.outlined,
        animated: t.animated
      }])
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(t.items, (d) => (openBlock(), createElementBlock("div", {
        key: `${e.guid}-accordion-${d}`,
        class: normalizeClass(["accordion-item", { active: n.value.includes(d) }])
      }, [
        createBaseVNode("div", {
          onClick: (u) => n.toggle(d),
          class: "accordion-title"
        }, [
          Ji,
          renderSlot(e.$slots, "title-" + d)
        ], 8, Xi),
        t.keepRendered || n.value.includes(d) ? withDirectives((openBlock(), createElementBlock("div", Qi, [
          createBaseVNode("div", {
            class: normalizeClass(["content", { "accordion-animated-content": t.animated }])
          }, [
            renderSlot(e.$slots, "item-" + d)
          ], 2)
        ], 512)), [
          [vShow, n.value.includes(d)]
        ]) : createCommentVNode("", true)
      ], 2))), 128))
    ], 2)
  ])), [
    [r, e.loading]
  ]);
}
const el = /* @__PURE__ */ O(Gi, [["render", Zi]]), tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: el
}, Symbol.toStringTag, { value: "Module" })), ys = (e, ...s) => Object.fromEntries(
  s.filter((t) => t in e).map((t) => [t, e[t]])
), sl = (e, ...s) => Object.fromEntries(
  s.filter(({ key: t }) => t in e).map(({ key: t, newName: i = t }) => [i, e[t]])
), nl = (e) => (pushScopeId("data-v-e6da51b4"), e = e(), popScopeId(), e), il = { class: "vu-alert-dialog-content" }, ll = /* @__PURE__ */ nl(() => /* @__PURE__ */ createBaseVNode("hr", null, null, -1)), ol = [
  ll
], rl = { class: "vu-alert-dialog-body" }, al = ["src"], ul = {
  key: 3,
  class: "vu-alert-dialog-title"
}, dl = {
  key: 4,
  class: "vu-alert-dialog-text"
}, cl = { class: "vu-alert-dialog-buttons" }, hl = {
  name: "vu-alert-dialog"
}, fl = /* @__PURE__ */ defineComponent({
  ...hl,
  props: {
    title: {},
    text: {},
    icon: {},
    svg: {},
    svgUrl: {},
    img: {},
    iconCircle: { type: Boolean },
    iconColor: {},
    animate: { type: Boolean },
    animationDuration: {},
    noOverlay: { type: Boolean },
    emitCancelOnClickOutside: { type: Boolean },
    emitCancelOnCloseButtonClick: { type: Boolean },
    showRiskyButton: { type: Boolean },
    showConfirmButton: { type: Boolean },
    showCloseButton: { type: Boolean },
    riskyButtonLabel: {},
    confirmButtonLabel: {},
    closeButtonLabel: {},
    _show: { type: Boolean },
    lazy: { type: Boolean },
    src: {},
    height: {},
    maxHeight: {},
    maxWidth: {},
    minHeight: {},
    minWidth: {},
    width: {},
    contain: { type: Boolean },
    aspectRatio: {}
  },
  emits: ["close", "confirm", "cancel"],
  setup(e, { emit: s }) {
    const t = e, i = s, o = inject(Qe), n = computed(() => ys(t, "height", "maxHeight", "maxWidth", "minHeight", "minWidth", "width", "contain", "aspectRatio")), r = inject(si, "Confirm"), d = inject(ni, "Close"), u = inject(li, "Cancel"), f = inject(ii, "Proceed");
    return (c, h2) => {
      const v = resolveComponent("vu-icon"), k = resolveComponent("vu-btn");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["vu-alert-dialog vu-alert-dialog-root", {
          "vu-alert-dialog--desktop": !unref(o)
        }])
      }, [
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            !c.noOverlay && !(c.animate && !c._show) ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "vu-overlay",
              onClick: h2[0] || (h2[0] = (w) => c.emitCancelOnClickOutside ? i("cancel") : i("close"))
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createBaseVNode("div", {
          class: normalizeClass(["vu-alert-dialog-wrap", { "vu-alert-dialog--disposed": c.animate && !c._show }])
        }, [
          createBaseVNode("div", il, [
            createBaseVNode("div", {
              class: "vu-alert-dialog-drag-handle",
              onClick: h2[1] || (h2[1] = (w) => c.emitCancelOnClickOutside ? i("cancel") : i("close"))
            }, ol),
            createBaseVNode("div", rl, [
              renderSlot(c.$slots, "alert-content", {}, () => [
                c.img || c.src ? (openBlock(), createBlock(Fe, mergeProps({
                  key: 0,
                  class: "vu-alert-dialog-image"
                }, n.value, {
                  src: c.img || c.src
                }), null, 16, ["src"])) : c.svgUrl ? (openBlock(), createElementBlock("img", {
                  key: 1,
                  src: c.svgUrl,
                  style: { height: "120px !important" }
                }, null, 8, al)) : c.icon || c.svg ? (openBlock(), createElementBlock("div", {
                  key: 2,
                  class: normalizeClass(["vu-alert-dialog-icon-wrap", [{ "vu-alert-dialog-icon-circle": c.iconCircle }, c.iconColor ? `vu-alert-dialog-icon-${c.iconColor}` : ""]])
                }, [
                  c.svg ? (openBlock(), createBlock(resolveDynamicComponent(c.svg), { key: 1 })) : (openBlock(), createBlock(v, {
                    key: 0,
                    icon: c.icon,
                    "within-text": false
                  }, null, 8, ["icon"]))
                ], 2)) : createCommentVNode("", true),
                c.title ? (openBlock(), createElementBlock("div", ul, toDisplayString(c.title), 1)) : createCommentVNode("", true),
                c.text ? (openBlock(), createElementBlock("div", dl, toDisplayString(c.text), 1)) : createCommentVNode("", true)
              ], true),
              renderSlot(c.$slots, "alert-buttons", {}, () => [
                createBaseVNode("div", cl, [
                  c.showConfirmButton ? (openBlock(), createBlock(k, {
                    key: 0,
                    color: "primary",
                    onClick: h2[2] || (h2[2] = (w) => i("confirm"))
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(c.confirmButtonLabel || unref(r)), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  c.showRiskyButton ? (openBlock(), createBlock(k, {
                    key: 1,
                    color: "error",
                    onClick: h2[3] || (h2[3] = (w) => i("confirm"))
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(c.riskyButtonLabel || unref(f)), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  c.showCloseButton ? (openBlock(), createBlock(k, {
                    key: 2,
                    onClick: h2[4] || (h2[4] = (w) => c.emitCancelOnCloseButtonClick ? i("cancel") : i("close"))
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(c.closeButtonLabel || c.showRiskyButton && unref(u) || unref(d)), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ])
              ], true)
            ])
          ])
        ], 2)
      ], 2);
    };
  }
}), xt = /* @__PURE__ */ O(fl, [["__scopeId", "data-v-e6da51b4"]]), ml = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xt
}, Symbol.toStringTag, { value: "Module" })), pl = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 128"
}, gl = /* @__PURE__ */ createBaseVNode("path", { d: "M125.26 34.87 93.13 2.74C91.42 1.03 89.15 0 86.73 0H41.28c-2.42 0-4.69 1.03-6.4 2.74L2.74 34.87C1.03 36.58 0 38.85 0 41.27v45.45c0 2.42 1.03 4.69 2.74 6.4l32.13 32.13c1.71 1.71 3.98 2.74 6.4 2.74h45.45c2.42 0 4.69-1.03 6.4-2.74l32.13-32.13c1.71-1.71 2.74-3.98 2.74-6.4V41.27c0-2.42-1.03-4.69-2.74-6.4Zm-24.3 49.37-16.72 16.72L64 80.58l-20.24 20.38-16.72-16.72L47.42 64 27.04 43.76l16.72-16.72L64 47.42l20.24-20.38 16.72 16.72L80.58 64z" }, null, -1), vl = [
  gl
];
function yl(e, s) {
  return openBlock(), createElementBlock("svg", pl, [...vl]);
}
const bl = { render: yl }, _l = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 128"
}, wl = /* @__PURE__ */ createBaseVNode("path", { d: "M64 0C28.65 0 0 28.65 0 64s28.65 64 64 64 64-28.65 64-64S99.35 0 64 0m9.14 109.71H54.85V47.02h18.29zM64 36.57c-5.05 0-9.14-4.09-9.14-9.14s4.09-9.14 9.14-9.14 9.14 4.09 9.14 9.14-4.09 9.14-9.14 9.14" }, null, -1), kl = [
  wl
];
function Sl(e, s) {
  return openBlock(), createElementBlock("svg", _l, [...kl]);
}
const Cl = { render: Sl }, Il = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 128"
}, Bl = /* @__PURE__ */ createBaseVNode("path", { d: "M64 0C28.65 0 0 28.65 0 64s28.65 64 64 64 64-28.65 64-64S99.35 0 64 0m9.14 111.02H54.85V92.73h18.29zm13.33-43.89c-5.83 4.34-12.1 7.15-13.32 15.15H54.86c.81-11.79 6.46-17.35 11.89-21.55 5.29-4.2 9.8-7.31 9.8-14.63 0-8.27-4.31-12.15-11.49-12.15-9.76 0-13.84 8.01-13.98 17.63H31.23c.41-19.38 13.12-33.57 32.91-33.57 25.62 0 33.7 15.82 33.7 26.25 0 13.15-5.53 18.38-11.36 22.86Z" }, null, -1), Ol = [
  Bl
];
function Vl(e, s) {
  return openBlock(), createElementBlock("svg", Il, [...Ol]);
}
const $l = { render: Vl }, xl = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 112.85"
}, Ml = /* @__PURE__ */ createBaseVNode("path", { d: "M128 105.8c0-1.18-.26-2.39-.91-3.53L70.14 3.53C68.78 1.18 66.38 0 64 0s-4.78 1.17-6.14 3.53L.91 102.27c-.66 1.14-.91 2.35-.91 3.53 0 3.69 2.93 7.05 7.05 7.05h113.89c4.12 0 7.05-3.36 7.05-7.05Zm-54.86-7.84c0 1.44-1.17 2.61-2.61 2.61H57.47c-1.44 0-2.61-1.17-2.61-2.61V84.9c0-1.44 1.17-2.61 2.61-2.61h13.06c1.44 0 2.61 1.17 2.61 2.61zm-1.3-26.12H56.17l-1.31-37.88c0-3.61 2.92-6.53 6.53-6.53h5.22c3.61 0 6.53 2.92 6.53 6.53l-1.31 37.88Z" }, null, -1), Pl = [
  Ml
];
function Ll(e, s) {
  return openBlock(), createElementBlock("svg", xl, [...Pl]);
}
const Ut = { render: Ll };
let bs = {
  show: () => new Promise((e) => e),
  hide: () => {
  },
  information: () => new Promise((e) => e),
  confirm: () => new Promise((e) => e),
  warning: () => new Promise((e) => e),
  confirmWithRisk: () => new Promise((e) => e),
  error: () => new Promise((e) => e),
  _alerts: shallowReactive([])
};
function Tl(e) {
  const s = shallowReactive([]), t = markRaw({
    _alerts: s,
    show(i) {
      return this.hide(), new Promise((o, n) => {
        const r = {
          id: ye(),
          component: xt,
          bind: reactive({
            height: 120,
            ...i,
            contain: true,
            _show: true
          }),
          on: {
            close: () => {
              this.hide(r), o();
            },
            confirm: () => {
              this.hide(r), o();
            },
            cancel: () => {
              this.hide(r), n();
            }
          }
        };
        this._alerts.push(shallowReactive(r));
      });
    },
    hide(i) {
      if (i) {
        const o = this._alerts.find((n) => n.id === i.id);
        if (!o)
          return;
        o.bind._show = false, setTimeout(() => {
          const n = this._alerts.findIndex((r) => r.id === i.id);
          n > -1 && this._alerts.splice(n, 1);
        }, o.bind.animationDuration);
      } else
        this._alerts.forEach((o) => {
          o._show = false;
        }), this._alerts.splice(0, this._alerts.length);
    },
    information(i) {
      return this.show({
        showCloseButton: true,
        iconColor: "cyan",
        iconCircle: true,
        icon: "info",
        svg: Cl,
        animate: true,
        animationDuration: 300,
        ...i
      });
    },
    confirm(i) {
      return this.show({
        showCloseButton: true,
        showConfirmButton: true,
        iconColor: "cyan",
        iconCircle: true,
        icon: "help",
        svg: $l,
        animate: true,
        animationDuration: 300,
        ...i,
        emitCancelOnClickOutside: true,
        emitCancelOnCloseButtonClick: true
      });
    },
    warning(i) {
      return this.show({
        iconColor: "orange",
        icon: "attention",
        svg: Ut,
        iconCircle: true,
        showCloseButton: true,
        animate: true,
        animationDuration: 300,
        ...i
      });
    },
    confirmWithRisk(i) {
      return this.show({
        iconColor: "orange",
        icon: "attention",
        svg: Ut,
        iconCircle: true,
        showRiskyButton: true,
        showCloseButton: true,
        animate: true,
        animationDuration: 300,
        ...i,
        emitCancelOnClickOutside: true,
        emitCancelOnCloseButtonClick: true
      });
    },
    error(i) {
      return this.show({
        iconColor: "red",
        iconCircle: true,
        icon: "error",
        svg: bl,
        showCloseButton: true,
        animate: true,
        animationDuration: 300,
        ...i
      });
    }
  });
  return bs = t, e.provide("vuAlertDialogAPI", t), e.config.globalProperties.$vuAlertDialog = t, t;
}
const Al = {
  name: "vu-alert-dialog-container",
  components: {
    VuAlertDialog: xt
  },
  data: () => ({
    _alerts: {
      type: Object
    }
  }),
  created() {
    this._alerts = bs._alerts;
  }
};
function Fl(e, s, t, i, o, n) {
  return openBlock(true), createElementBlock(Fragment, null, renderList(e._alerts, (r) => (openBlock(), createBlock(resolveDynamicComponent(r.component), mergeProps({
    key: r.id
  }, r.bind, {
    modelValue: r.value,
    "onUpdate:modelValue": (d) => r.value = d
  }, toHandlers(r.on)), null, 16, ["modelValue", "onUpdate:modelValue"]))), 128);
}
const Dl = /* @__PURE__ */ O(Al, [["render", Fl]]), zl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dl
}, Symbol.toStringTag, { value: "Module" })), Q = {
  props: {
    modelValue: {
      type: [Object, String, Number, Array, Boolean, Date],
      default: () => ""
    },
    label: {
      type: String,
      default: () => ""
    },
    type: {
      type: String,
      default: () => "text"
    },
    helper: {
      type: String,
      default: () => ""
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(e) {
        this.$emit("update:modelValue", e);
      }
    }
  }
}, Nl = {
  name: "vu-btn",
  mixins: [Ie, $t, Te, Q, K],
  props: {
    large: {
      type: Boolean,
      default: () => false
    },
    small: {
      type: Boolean,
      default: () => false
    },
    block: {
      type: Boolean,
      default: () => false
    },
    icon: {
      type: String,
      required: false
    }
  },
  data: () => ({
    getListenersFromAttrs: ce
    // tooltip: {},
  }),
  components: { VuIcon: H },
  computed: {
    classes() {
      return [
        `btn btn-${this.color}`,
        {
          "btn-sm": this.small,
          "btn-lg": this.large,
          "btn-block": this.block,
          active: this.active
        }
      ];
    }
  }
}, El = ["disabled"];
function jl(e, s, t, i, o, n) {
  const r = resolveComponent("VuIcon"), d = resolveDirective("mask");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    type: "button",
    disabled: e.disabled
  }, toHandlers(e.getListenersFromAttrs(e.$attrs), true), { class: n.classes }), [
    t.icon ? (openBlock(), createBlock(r, {
      key: 0,
      icon: t.icon,
      color: "inherit"
    }, null, 8, ["icon"])) : createCommentVNode("", true),
    renderSlot(e.$slots, "default", {}, void 0, true)
  ], 16, El)), [
    [d, e.loading]
  ]);
}
const ae = /* @__PURE__ */ O(Nl, [["render", jl], ["__scopeId", "data-v-e48c0881"]]), Rl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ae
}, Symbol.toStringTag, { value: "Module" })), Ul = { class: "vu-btn-dropdown flex flex-nowrap" }, Hl = {
  key: 1,
  class: "caret text-grey-7"
}, ql = {
  name: "vu-btn-dropdown",
  components: { VuDropdownMenu: Ce, VuBtn: ae, VuIcon: H, VuIconBtn: U }
}, Wl = /* @__PURE__ */ defineComponent({
  ...ql,
  props: {
    value: {},
    attach: {},
    position: {},
    shift: { type: Boolean },
    dividedResponsiveItems: { type: Boolean },
    color: {},
    icon: {},
    label: {},
    options: {},
    chevronDown: { type: Boolean }
  },
  emits: ["click", "click-item"],
  setup(e, { emit: s }) {
    const t = e, i = s;
    return (o, n) => (openBlock(), createElementBlock("div", Ul, [
      createVNode(ae, {
        icon: t.icon,
        color: t.color,
        class: "flex-basis-auto",
        style: normalizeStyle(t.options && "border-top-right-radius:0;border-bottom-right-radius:0"),
        onClick: n[0] || (n[0] = (r) => i("click", r))
      }, {
        default: withCtx(() => [
          renderSlot(o.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(o.label), 1)
          ], true)
        ]),
        _: 3
      }, 8, ["icon", "color", "style"]),
      t.options ? (openBlock(), createBlock(Ce, mergeProps({ key: 0 }, { ...t, items: o.options }, {
        class: "flex-basis-[38px] ml-[2px]",
        style: { display: "flex" },
        onClickItem: n[1] || (n[1] = (r) => i("click-item", r))
      }), {
        default: withCtx(({ active: r }) => [
          createVNode(ae, {
            color: o.color,
            class: "dropdown_btn",
            active: r
          }, {
            default: withCtx(() => [
              o.chevronDown ? (openBlock(), createBlock(H, {
                key: 0,
                icon: "chevron-down"
              })) : (openBlock(), createElementBlock("span", Hl))
            ]),
            _: 2
          }, 1032, ["color", "active"])
        ]),
        _: 1
      }, 16)) : createCommentVNode("", true)
    ]));
  }
}), Kl = /* @__PURE__ */ O(Wl, [["__scopeId", "data-v-2532dc63"]]), Gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Kl
}, Symbol.toStringTag, { value: "Module" })), Yl = {
  name: "vu-btn-grp",
  mixins: [Ie],
  props: {
    color: {
      type: String,
      default: () => "default"
    }
  }
}, Xl = { class: "btn-grp" };
function Jl(e, s, t, i, o, n) {
  const r = resolveDirective("mask");
  return withDirectives((openBlock(), createElementBlock("div", Xl, [
    renderSlot(e.$slots, "default")
  ])), [
    [r, e.loading]
  ]);
}
const Ql = /* @__PURE__ */ O(Yl, [["render", Jl]]), Zl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ql
}, Symbol.toStringTag, { value: "Module" })), eo = {
  name: "vu-carousel-slide",
  props: { title: { type: String, default: "" } },
  emits: ["slideclick", "slide-click"],
  data() {
    return {
      width: null,
      id: "",
      carousel: void 0,
      guid: ye
    };
  },
  created() {
    this.id = this.guid(), this.carousel = this.$parent;
  },
  mounted() {
    this.$isServer || this.$el.addEventListener("dragstart", (e) => e.preventDefault()), this.$el.addEventListener(
      this.carousel.isTouch ? "touchend" : "mouseup",
      this.onTouchEnd
    );
  },
  computed: {
    activeSlides() {
      const { currentPage: e = 0, breakpointSlidesPerPage: s, children: t } = this.carousel, i = [], o = t.filter(
        (r) => r.$el && r.$el.className.indexOf("vu-slide") >= 0
      ).map((r) => r._uid || r.id);
      let n = 0;
      for (; n < s; ) {
        const r = o[e * s + n];
        i.push(r), n++;
      }
      return i;
    },
    /**
     * `isActive` describes whether a slide is visible
     * @return {Boolean}
     */
    isActive() {
      return this.activeSlides.indexOf(this._uid) >= 0;
    },
    /**
     * `isCenter` describes whether a slide is in the center of all visible slides
     * if perPage is an even number, we quit
     * @return {Boolean}
     */
    isCenter() {
      const { breakpointSlidesPerPage: e } = this.carousel;
      return e % 2 === 0 || !this.isActive ? false : this.activeSlides.indexOf(this._uid) === Math.floor(e / 2);
    },
    /**
     * `isAdjustableHeight` describes if the carousel adjusts its height to the active slide(s)
     * @return {Boolean}
     */
    isAdjustableHeight() {
      const { adjustableHeight: e } = this.carousel;
      return e;
    }
  },
  methods: {
    onTouchEnd(e) {
      const s = this.carousel.isTouch && e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].clientX : e.clientX, t = this.carousel.dragStartX - s;
      (this.carousel.minSwipeDistance === 0 || Math.abs(t) < this.carousel.minSwipeDistance) && (this.$emit("slideclick", { ...e.currentTarget.dataset }), this.$emit("slide-click", { ...e.currentTarget.dataset }));
    }
  }
}, to$1 = ["aria-hidden"];
function so(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-slide", {
      "vu-slide-active": n.isActive,
      "vu-slide-center": n.isCenter,
      "vu-slide-adjustableHeight": n.isAdjustableHeight
    }]),
    tabindex: "-1",
    "aria-hidden": !n.isActive,
    role: "tabpanel"
  }, [
    renderSlot(e.$slots, "default")
  ], 10, to$1);
}
const no = /* @__PURE__ */ O(eo, [["render", so]]), io = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: no
}, Symbol.toStringTag, { value: "Module" })), lo = {
  props: {
    /**
     * Flag to enable autoplay
     */
    autoplay: {
      type: Boolean,
      default: false
    },
    /**
     * Time elapsed before advancing slide
     */
    autoplayTimeout: {
      type: Number,
      default: 3e3
    },
    /**
     * Flag to pause autoplay on hover
     */
    autoplayHoverPause: {
      type: Boolean,
      default: true
    },
    /**
     * Autoplay direction. User can insert backward to make autoplay move from right to left
     */
    autoplayDirection: {
      type: String,
      default: "forward"
    }
  },
  data() {
    return {
      autoplayInterval: null
    };
  },
  destroyed() {
    this.$isServer || (this.$el.removeEventListener("mouseenter", this.pauseAutoplay), this.$el.removeEventListener("mouseleave", this.startAutoplay));
  },
  methods: {
    pauseAutoplay() {
      this.autoplayInterval && (this.autoplayInterval = clearInterval(this.autoplayInterval));
    },
    startAutoplay() {
      this.autoplay && (this.autoplayInterval = setInterval(
        this.autoplayAdvancePage,
        this.autoplayTimeout
      ));
    },
    restartAutoplay() {
      this.pauseAutoplay(), this.startAutoplay();
    },
    autoplayAdvancePage() {
      this.advancePage(this.autoplayDirection);
    }
  },
  mounted() {
    !this.$isServer && this.autoplayHoverPause && (this.$el.addEventListener("mouseenter", this.pauseAutoplay), this.$el.addEventListener("mouseleave", this.startAutoplay)), this.startAutoplay();
  }
}, oo = (e, s, t) => {
  let i;
  return () => {
    const n = () => {
      i = null, e.apply(void 0);
    };
    clearTimeout(i), i = setTimeout(n, s);
  };
}, lt = {
  onwebkittransitionend: "webkitTransitionEnd",
  onmoztransitionend: "transitionend",
  onotransitionend: "oTransitionEnd otransitionend",
  ontransitionend: "transitionend"
}, Ht = () => {
  const e = Object.keys(lt).find((s) => s in window);
  return e ? lt[e] : lt.ontransitionend;
}, ro = {
  name: "vu-carousel",
  emits: ["pageChange", "page-change", "update:modelValue", "navigation-click", "pagination-click", "transitionStart", "transition-start", "transitionEnd", "transition-end", "mounted"],
  beforeUpdate() {
    this.computeCarouselWidth();
  },
  data() {
    return {
      browserWidth: null,
      carouselWidth: 0,
      currentPage: 0,
      dragging: false,
      dragMomentum: 0,
      dragOffset: 0,
      dragStartY: 0,
      dragStartX: 0,
      isTouch: typeof window < "u" && "ontouchstart" in window,
      offset: 0,
      refreshRate: 16,
      slideCount: 0,
      transitionstart: "transitionstart",
      transitionend: "transitionend",
      currentHeight: "auto"
    };
  },
  mixins: [lo],
  // use `provide` to avoid `Slide` being nested with other components
  provide() {
    return {
      carousel: this
    };
  },
  props: {
    /**
       *  Adjust the height of the carousel for the current slide
       */
    adjustableHeight: {
      type: Boolean,
      default: false
    },
    /**
       * Slide transition easing for adjustableHeight
       * Any valid CSS transition easing accepted
       */
    adjustableHeightEasing: {
      type: String,
      default: ""
    },
    /**
       *  Center images when the size is less than the container width
       */
    centerMode: {
      type: Boolean,
      default: false
    },
    /**
       * Slide transition easing
       * Any valid CSS transition easing accepted
       */
    easing: {
      type: String,
      validator(e) {
        return ["ease", "linear", "ease-in", "ease-out", "ease-in-out"].indexOf(e) !== -1 || e.includes("cubic-bezier");
      },
      default: "ease"
    },
    /**
       * Flag to make the carousel loop around when it reaches the end
       */
    loop: {
      type: Boolean,
      default: false
    },
    /**
       * Minimum distance for the swipe to trigger
       * a slide advance
       */
    minSwipeDistance: {
      type: Number,
      default: 8
    },
    /**
       * Flag to toggle mouse dragging
       */
    mouseDrag: {
      type: Boolean,
      default: true
    },
    /**
       * Flag to toggle touch dragging
       */
    touchDrag: {
      type: Boolean,
      default: true
    },
    /**
       * Flag to render pagination component
       */
    pagination: {
      type: Boolean,
      default: true
    },
    /**
       * Maximum number of slides displayed on each page
       */
    perPage: {
      type: Number,
      default: 1
    },
    /**
       * Configure the number of visible slides with a particular browser width.
       * This will be an array of arrays, ex. [[320, 2], [1199, 4]]
       * Formatted as [x, y] where x=browser width, and y=number of slides displayed.
       * ex. [1199, 4] means if (window <= 1199) then show 4 slides per page
       */
    // eslint-disable-next-line vue/require-default-prop
    perPageCustom: {
      type: Array
    },
    /**
       * Resistance coefficient to dragging on the edge of the carousel
       * This dictates the effect of the pull as you move towards the boundaries
       */
    resistanceCoef: {
      type: Number,
      default: 20
    },
    /**
       * Scroll per page, not per item
       */
    scrollPerPage: {
      type: Boolean,
      default: false
    },
    /**
       *  Space padding option adds left and right padding style (in pixels) onto vu-carousel-inner.
       */
    spacePadding: {
      type: Number,
      default: 0
    },
    /**
       *  Specify by how much should the space padding value be multiplied of, to re-arange the final slide padding.
       */
    spacePaddingMaxOffsetFactor: {
      type: Number,
      default: 0
    },
    /**
       * Slide transition speed
       * Number of milliseconds accepted
       */
    speed: {
      type: Number,
      default: 500
    },
    /**
       * Name (tag) of slide component
       * Overwrite when extending slide component
       */
    tagName: {
      type: String,
      default: "slide"
    },
    /**
       * Support for v-model functionality
       */
    modelValue: {
      type: Number,
      default: 0
    },
    /**
       * Support Max pagination dot amount
       */
    maxPaginationDotCount: {
      type: Number,
      default: -1
    }
  },
  watch: {
    value(e) {
      e !== this.currentPage && (this.goToPage(e), this.render());
    },
    currentPage(e) {
      this.$emit("pageChange", e), this.$emit("page-change", e), this.$emit("update:modelValue", e);
    },
    autoplay(e) {
      e === false ? this.pauseAutoplay() : this.restartAutoplay();
    }
  },
  computed: {
    children() {
      return this.$slots && this.$slots.default() && this.$slots.default().filter((e) => e.tag && e.tag.match(
        `^vue-component-\\d+-${this.tagName}$`
      ) !== null) || [];
    },
    /**
       * Given a viewport width, find the number of slides to display
       * @param  {Number} width Current viewport width in pixels
       * @return {Number} Number of slides to display
       */
    breakpointSlidesPerPage() {
      if (!this.perPageCustom)
        return this.perPage;
      const e = this.perPageCustom, s = this.browserWidth, i = e.sort(
        (n, r) => n[0] > r[0] ? -1 : 1
      ).filter((n) => s >= n[0]);
      return i[0] && i[0][1] || this.perPage;
    },
    /**
       * @return {Boolean} Can the slider move forward?
       */
    canAdvanceForward() {
      return this.loop || this.offset < this.maxOffset;
    },
    /**
       * @return {Boolean} Can the slider move backward?
       */
    canAdvanceBackward() {
      return this.loop || this.currentPage > 0;
    },
    /**
       * Number of slides to display per page in the current context.
       * This is constant unless responsive perPage option is set.
       * @return {Number} The number of slides per page to display
       */
    currentPerPage() {
      return !this.perPageCustom || this.$isServer ? this.perPage : this.breakpointSlidesPerPage;
    },
    /**
       * The horizontal distance the inner wrapper is offset while navigating.
       * @return {Number} Pixel value of offset to apply
       */
    currentOffset() {
      return this.isCenterModeEnabled ? 0 : (this.offset + this.dragOffset) * -1;
    },
    isHidden() {
      return this.carouselWidth <= 0;
    },
    /**
       * Maximum offset the carousel can slide
       * Considering the spacePadding
       * @return {Number}
       */
    maxOffset() {
      return Math.max(
        this.slideWidth * (this.slideCount - this.currentPerPage) - this.spacePadding * this.spacePaddingMaxOffsetFactor,
        0
      );
    },
    /**
       * Calculate the number of pages of slides
       * @return {Number} Number of pages
       */
    pageCount() {
      return this.scrollPerPage ? Math.ceil(this.slideCount / this.currentPerPage) : this.slideCount - this.currentPerPage + 1;
    },
    /**
       * Calculate the width of each slide
       * @return {Number} Slide width
       */
    slideWidth() {
      const e = this.carouselWidth - this.spacePadding * 2, s = this.currentPerPage;
      return e / s;
    },
    /**
       * @return {Boolean} Is navigation required?
       */
    isNavigationRequired() {
      return this.slideCount > this.currentPerPage;
    },
    /**
       * @return {Boolean} Center images when have less than min currentPerPage value
       */
    isCenterModeEnabled() {
      return this.centerMode && !this.isNavigationRequired;
    },
    transitionStyle() {
      const e = `${this.speed / 1e3}s`, s = `${e} ${this.easing} transform`;
      return this.adjustableHeight ? `${s}, height ${e} ${this.adjustableHeightEasing || this.easing}` : s;
    },
    padding() {
      const e = this.spacePadding;
      return e > 0 ? e : false;
    }
  },
  methods: {
    /**
       * @return {Number} The index of the next page
       * */
    getNextPage() {
      return this.currentPage < this.pageCount - 1 ? this.currentPage + 1 : this.loop ? 0 : this.currentPage;
    },
    /**
       * @return {Number} The index of the previous page
       * */
    getPreviousPage() {
      return this.currentPage > 0 ? this.currentPage - 1 : this.loop ? this.pageCount - 1 : this.currentPage;
    },
    /**
       * Increase/decrease the current page value
       * @param  {String} direction (Optional) The direction to advance
       */
    advancePage(e) {
      e === "backward" && this.canAdvanceBackward ? this.goToPage(this.getPreviousPage(), "navigation") : (!e || e !== "backward") && this.canAdvanceForward && this.goToPage(this.getNextPage(), "navigation");
    },
    goToLastSlide() {
      this.dragging = true, setTimeout(() => {
        this.dragging = false;
      }, this.refreshRate), this.$nextTick(() => {
        this.goToPage(this.pageCount);
      });
    },
    /**
       * A mutation observer is used to detect changes to the containing node
       * in order to keep the magnet container in sync with the height its reference node.
       */
    attachMutationObserver() {
      const e = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      if (e) {
        let s = {
          attributes: true,
          data: true
        };
        if (this.adjustableHeight && (s = {
          ...s,
          childList: true,
          subtree: true,
          characterData: true
        }), this.mutationObserver = new e(() => {
          this.$nextTick(() => {
            this.computeCarouselWidth(), this.computeCarouselHeight();
          });
        }), this.$parent.$el) {
          const t = this.$el.getElementsByClassName(
            "vu-carousel-inner"
          );
          for (let i = 0; i < t.length; i++)
            this.mutationObserver.observe(t[i], s);
        }
      }
    },
    handleNavigation(e) {
      this.advancePage(e), this.pauseAutoplay(), this.$emit("navigation-click", e);
    },
    /**
       * Stop listening to mutation changes
       */
    detachMutationObserver() {
      this.mutationObserver && this.mutationObserver.disconnect();
    },
    /**
       * Get the current browser viewport width
       * @return {Number} Browser"s width in pixels
       */
    getBrowserWidth() {
      return this.browserWidth = window.innerWidth, this.browserWidth;
    },
    /**
       * Get the width of the carousel DOM element
       * @return {Number} Width of the carousel in pixels
       */
    getCarouselWidth() {
      const e = this.$el.getElementsByClassName(
        "vu-carousel-inner"
      );
      for (let s = 0; s < e.length; s++)
        e[s].clientWidth > 0 && (this.carouselWidth = e[s].clientWidth || 0);
      return this.carouselWidth;
    },
    /**
       * Get the maximum height of the carousel active slides
       * @return {String} The carousel height
       */
    getCarouselHeight() {
      if (!this.adjustableHeight)
        return "auto";
      const e = this.currentPerPage * (this.currentPage + 1) - 1, s = [...Array(this.currentPerPage)].map((t, i) => this.getSlide(e + i)).reduce(
        (t, i) => Math.max(t, i && i.$el.clientHeight || 0),
        0
      );
      return this.currentHeight = s === 0 ? "auto" : `${s}px`, this.currentHeight;
    },
    /**
       * Filter slot contents to slide instances and return length
       * @return {Number} The number of slides
       */
    getSlideCount() {
      return this.children.length;
    },
    /**
       * Gets the slide at the specified index
       * @return {Object} The slide at the specified index
       */
    getSlide(e) {
      return this.children[e];
    },
    /**
       * Set the current page to a specific value
       * This function will only apply the change if the value is within the carousel bounds
       * for carousel scrolling per page.
       * @param  {Number} page The value of the new page number
       * @param  {string|undefined} advanceType An optional value describing the type of page advance
       */
    goToPage(e, s) {
      e >= 0 && e <= this.pageCount && (this.offset = this.scrollPerPage ? Math.min(this.slideWidth * this.currentPerPage * e, this.maxOffset) : this.slideWidth * e, this.autoplay && !this.autoplayHoverPause && this.restartAutoplay(), this.currentPage = e, s === "pagination" && (this.pauseAutoplay(), this.$emit("pagination-click", e)));
    },
    /**
       * Trigger actions when mouse is pressed
       * @param  {Object} e The event object
       */
    /* istanbul ignore next */
    onStart(e) {
      e.button !== 2 && (document.addEventListener(this.isTouch ? "touchend" : "mouseup", this.onEnd, true), document.addEventListener(this.isTouch ? "touchmove" : "mousemove", this.onDrag, true), this.startTime = e.timeStamp, this.dragging = true, this.dragStartX = this.isTouch ? e.touches[0].clientX : e.clientX, this.dragStartY = this.isTouch ? e.touches[0].clientY : e.clientY);
    },
    /**
       * Trigger actions when mouse is released
       * @param  {Object} e The event object
       */
    onEnd(e) {
      this.autoplay && !this.autoplayHoverPause && this.restartAutoplay(), this.pauseAutoplay();
      const s = this.isTouch ? e.changedTouches[0].clientX : e.clientX, t = this.dragStartX - s;
      if (this.dragMomentum = t / (e.timeStamp - this.startTime), this.minSwipeDistance !== 0 && Math.abs(t) >= this.minSwipeDistance) {
        const i = this.scrollPerPage ? this.slideWidth * this.currentPerPage : this.slideWidth;
        this.dragOffset += Math.sign(t) * (i / 2);
      }
      this.offset += this.dragOffset, this.dragOffset = 0, this.dragging = false, this.render(), document.removeEventListener(this.isTouch ? "touchend" : "mouseup", this.onEnd, true), document.removeEventListener(this.isTouch ? "touchmove" : "mousemove", this.onDrag, true);
    },
    /**
       * Trigger actions when mouse is pressed and then moved (mouse drag)
       * @param  {Object} e The event object
       */
    onDrag(e) {
      const s = this.isTouch ? e.touches[0].clientX : e.clientX, t = this.isTouch ? e.touches[0].clientY : e.clientY, i = this.dragStartX - s, o = this.dragStartY - t;
      if (this.isTouch && Math.abs(i) < Math.abs(o))
        return;
      e.stopImmediatePropagation(), this.dragOffset = i;
      const n = this.offset + this.dragOffset;
      n < 0 ? this.dragOffset = -Math.sqrt(-this.resistanceCoef * this.dragOffset) : n > this.maxOffset && (this.dragOffset = Math.sqrt(this.resistanceCoef * this.dragOffset));
    },
    onResize() {
      this.computeCarouselWidth(), this.computeCarouselHeight(), this.dragging = true, this.render(), setTimeout(() => {
        this.dragging = false;
      }, this.refreshRate);
    },
    render() {
      this.offset += Math.max(-this.currentPerPage + 1, Math.min(
        Math.round(this.dragMomentum),
        this.currentPerPage - 1
      )) * this.slideWidth;
      const e = this.scrollPerPage ? this.slideWidth * this.currentPerPage : this.slideWidth, s = e * Math.floor(this.slideCount / (this.currentPerPage - 1)), t = s + this.slideWidth * (this.slideCount % this.currentPerPage);
      this.offset > (s + t) / 2 ? this.offset = t : this.offset = e * Math.round(this.offset / e), this.offset = Math.max(0, Math.min(this.offset, this.maxOffset)), this.currentPage = this.scrollPerPage ? Math.round(this.offset / this.slideWidth / this.currentPerPage) : Math.round(this.offset / this.slideWidth);
    },
    /**
       * Re-compute the width of the carousel and its slides
       */
    computeCarouselWidth() {
      this.getSlideCount(), this.getBrowserWidth(), this.getCarouselWidth(), this.setCurrentPageInBounds();
    },
    /**
       * Re-compute the height of the carousel and its slides
       */
    computeCarouselHeight() {
      this.getCarouselHeight();
    },
    /**
       * When the current page exceeds the carousel bounds, reset it to the maximum allowed
       */
    setCurrentPageInBounds() {
      if (!this.canAdvanceForward && this.scrollPerPage) {
        const e = this.pageCount - 1;
        this.currentPage = e >= 0 ? e : 0, this.offset = Math.max(0, Math.min(this.offset, this.maxOffset));
      }
    },
    handleTransitionStart() {
      this.$emit("transitionStart"), this.$emit("transition-start");
    },
    handleTransitionEnd() {
      this.$emit("transitionEnd"), this.$emit("transition-end");
    }
  },
  mounted() {
    window.addEventListener(
      "resize",
      oo(this.onResize, this.refreshRate)
    ), (this.isTouch && this.touchDrag || this.mouseDrag) && this.$refs["vu-carousel-wrapper"].addEventListener(
      this.isTouch ? "touchstart" : "mousedown",
      this.onStart
    ), this.attachMutationObserver(), this.computeCarouselWidth(), this.computeCarouselHeight(), this.transitionstart = Ht(), this.$refs["vu-carousel-inner"].addEventListener(this.transitionstart, this.handleTransitionStart), this.transitionend = Ht(), this.$refs["vu-carousel-inner"].addEventListener(this.transitionend, this.handleTransitionEnd), this.$emit("mounted"), this.autoplayDirection === "backward" && this.goToLastSlide();
  },
  beforeUnmount() {
    this.detachMutationObserver(), window.removeEventListener("resize", this.getBrowserWidth), this.$refs["vu-carousel-inner"].removeEventListener(
      this.transitionstart,
      this.handleTransitionStart
    ), this.$refs["vu-carousel-inner"].removeEventListener(
      this.transitionend,
      this.handleTransitionEnd
    ), this.$refs["vu-carousel-wrapper"].removeEventListener(
      this.isTouch ? "touchstart" : "mousedown",
      this.onStart
    );
  }
}, ao = { class: "vu-carousel" }, uo = {
  class: "vu-carousel-wrapper",
  ref: "vu-carousel-wrapper"
}, co = {
  key: 0,
  class: "carousel-indicators"
}, ho = ["onClick"];
function fo(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", ao, [
    createBaseVNode("div", uo, [
      createBaseVNode("div", {
        ref: "vu-carousel-inner",
        class: normalizeClass([
          "vu-carousel-inner",
          { "vu-carousel-inner--center": n.isCenterModeEnabled }
        ]),
        style: normalizeStyle({
          transform: `translate(${n.currentOffset}px, 0)`,
          transition: o.dragging ? "none" : n.transitionStyle,
          "ms-flex-preferred-size": `${n.slideWidth}px`,
          "webkit-flex-basis": `${n.slideWidth}px`,
          "flex-basis": `${n.slideWidth}px`,
          visibility: n.slideWidth ? "visible" : "hidden",
          height: `${o.currentHeight}`,
          "padding-left": `${n.padding}px`,
          "padding-right": `${n.padding}px`
        })
      }, [
        renderSlot(e.$slots, "default")
      ], 6)
    ], 512),
    t.pagination && n.pageCount > 1 ? (openBlock(), createElementBlock("ol", co, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(n.pageCount, (r, d) => (openBlock(), createElementBlock("li", {
        key: `carousel-pagination_${d}`,
        class: normalizeClass(["indicator", { active: d === o.currentPage }]),
        onClick: (u) => n.goToPage(d, "pagination")
      }, null, 10, ho))), 128))
    ])) : createCommentVNode("", true)
  ]);
}
const mo = /* @__PURE__ */ O(ro, [["render", fo]]), po = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: mo
}, Symbol.toStringTag, { value: "Module" })), Z = {
  exposes: ["validate"],
  props: {
    rules: {
      type: [Array],
      default: () => [() => true]
    },
    required: {
      type: Boolean,
      default: () => false
    },
    success: {
      type: Boolean,
      default: () => false
    },
    lazyValidation: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    errorBucket: [],
    valid: true,
    localRules: []
  }),
  inject: {
    vuDebug: {
      default: false
    }
  },
  watch: {
    value(e) {
      this.lazyValidation || (this.valid = this.validate(e));
    }
  },
  computed: {
    classes() {
      return {
        "has-error": !this.valid,
        "has-success": this.success && this.valid
      };
    },
    hasError() {
      return this.errorBucket.length > 0;
    },
    hasSuccess() {
      return this.errorBucket.length === 0;
    },
    isValid() {
      if (!this.required)
        return true;
      switch (typeof this.value) {
        case "string":
        case "array":
        case "number":
        case "date":
          return this.value.length !== 0;
        default:
          return true;
      }
    }
  },
  methods: {
    validate(e, s) {
      const t = [];
      let i = 0;
      const o = e || this.value, n = [...this.localRules, ...this.rules];
      for (let r = 0; r < n.length; r++) {
        const d = n[r], u = typeof d == "function" ? d(o) : d;
        typeof u == "string" ? (t.push(u), i += 1) : typeof u == "boolean" && !u ? i += 1 : typeof u != "boolean" && this.vuDebug && console.error(`Rules should return a string or boolean, received '${typeof u}' instead`, this);
      }
      return s && (this.errorBucket = t), this.valid = i === 0 && this.isValid, this.valid;
    }
  }
}, go = {
  data: () => ({
    inputs: []
  }),
  exposes: ["validate"],
  provide() {
    return {
      inputs: this.inputs
    };
  },
  methods: {
    validate(e) {
      return this.inputs.map((s) => s.validate(void 0, e)).reduce((s, t) => s && t, true);
    }
  }
}, ee = {
  inject: {
    inputs: {
      default: () => ""
    }
  },
  created() {
    typeof this.inputs == "object" && this.inputs.push(this);
  },
  beforeUnmount() {
    typeof this.inputs == "object" && this.inputs.splice(this.inputs.indexOf(this), 1);
  }
}, qt = [...Array(256).keys()].map((e) => e.toString(16).padStart(2, "0")), be = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128, [...e.entries()].map(([s, t]) => [4, 6, 8, 10].includes(s) ? `-${qt[t]}` : qt[t]).join("");
}, vo = {
  name: "vu-checkbox",
  mixins: [Q, Z, ee, K],
  emits: ["update:modelValue"],
  inheritAttrs: false,
  props: {
    dense: {
      type: Boolean,
      default: () => false
    },
    switch: {
      type: Boolean,
      required: false
    },
    type: {
      type: String,
      default: () => "checkbox"
    }
  },
  data: () => ({ uid: be() }),
  computed: {
    internalClasses() {
      return {
        "toggle-switch": this.type === "switch",
        "toggle-primary": ["checkbox", "radio", "dense"].includes(this.type)
      };
    }
  },
  methods: {
    input(e) {
      if (this.options.length > 1 && this.type !== "radio") {
        if (e.target.checked)
          return this.$emit("update:modelValue", [e.target.value].concat(this.value));
        const s = JSON.parse(JSON.stringify(this.value));
        return s.splice(this.value.indexOf(e.target.value), 1), this.$emit("update:modelValue", s);
      }
      return this.$emit("update:modelValue", e.target.checked ? e.target.value : null);
    },
    isChecked(e) {
      return Array.isArray(this.value) ? this.value.includes(e) : this.type === "radio" ? this.value === e : !!this.value;
    }
  }
}, yo = {
  key: 0,
  class: "control-label"
}, bo = {
  key: 0,
  class: "label-field-required"
}, _o = ["type", "id", "value", "disabled", "checked"], wo = ["innerHTML", "for"], ko = {
  key: 1,
  class: "form-control-helper-text"
};
function So(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["form-group", { dense: t.dense }])
  }, [
    e.label.length ? (openBlock(), createElementBlock("label", yo, [
      createTextVNode(toDisplayString(e.label), 1),
      e.required ? (openBlock(), createElementBlock("span", bo, " *")) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.options, (r, d) => (openBlock(), createElementBlock("div", {
      key: `${e.uid}-${r.value}-${d}`,
      class: normalizeClass(["toggle", n.internalClasses])
    }, [
      (openBlock(), createElementBlock("input", {
        type: t.type === "radio" ? "radio" : "checkbox",
        id: `${e.uid}-${r.value}-${d}`,
        value: r.value,
        disabled: e.disabled || r.disabled,
        checked: n.isChecked(r.value),
        key: n.isChecked(r.value),
        onClick: s[0] || (s[0] = withModifiers((...u) => n.input && n.input(...u), ["prevent"]))
      }, null, 8, _o)),
      createBaseVNode("label", {
        class: "control-label",
        innerHTML: r.label,
        for: `${e.uid}-${r.value}-${d}`
      }, null, 8, wo),
      renderSlot(e.$slots, "prepend-icon", { item: r }, void 0, true)
    ], 2))), 128)),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.errorBucket, (r, d) => (openBlock(), createElementBlock("span", {
      key: `${d}-error-${r}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, toDisplayString(r), 1))), 128)),
    e.helper.length ? (openBlock(), createElementBlock("span", ko, toDisplayString(e.helper), 1)) : createCommentVNode("", true)
  ], 2);
}
const _s = /* @__PURE__ */ O(vo, [["render", So], ["__scopeId", "data-v-689207c6"]]), Co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _s
}, Symbol.toStringTag, { value: "Module" }));
function Io(e, s = {}) {
  const {
    onVisibleChange: t = de,
    onShow: i = de,
    onHide: o = de,
    attach: n,
    target: r
  } = s, d = computed(() => j(e)), u = computed(() => j(n)), f = computed(() => j(r)), c = ref(true), h2 = ref(false), v = ref({ x: 0, y: 0 }), k = () => h2.value = true, w = () => {
    const A = !h2.value;
    h2.value = false, A && o();
  }, T = Mn(d, { width: 0, height: 0 }, { box: "border-box" }), D = xn(u), Be = computed(() => n !== document.body), G = Pn({
    includeScrollbar: false
  }), ne = computed(() => Math.max(D.top.value, 0)), E = computed(() => Math.min(D.right.value, G.width.value)), P = computed(() => {
    let [A, Y, Ve, $e] = [
      `${v.value.x}px`,
      `${v.value.y}px`,
      null,
      null
    ];
    const st = v.value.x + T.width.value > E.value, nt = v.value.y + T.height.value > G.height.value;
    if (st && (A = `${D.right.value - (Be.value ? 0 : v.value.x) - T.width.value}px`), nt)
      if (D.height.value - v.value.y > 0) {
        const Xs = G.height.value - v.value.y;
        v.value.y - ne.value < Xs ? [Y, $e] = [`${ne.value}px`, null] : [Y, $e] = [null, `${G.height.value - G.height.value}px`];
      } else
        [Y, $e] = [null, `${G.height.value - v.value.y}px`];
    return {
      left: A,
      top: Y,
      right: Ve,
      bottom: $e
    };
  });
  function De() {
    var Ve;
    const A = [];
    let Y = (Ve = J(f)) == null ? void 0 : Ve.parentElement;
    for (; Y; ) {
      const { overflow: $e } = window.getComputedStyle(Y), st = $e.split(" ");
      ["auto", "scroll"].some((nt) => st.includes(nt)) && A.push(Y), Y = Y.parentElement;
    }
    return A;
  }
  watch(c, w), watch(h2, t);
  const Ue = [watchEffect(
    () => {
      const A = d.value;
      if (A) {
        A.style.position = "fixed", A.style.visibility = h2.value ? "visible" : "hidden";
        for (const [Y, Ve] of Object.entries(P.value))
          A.style.setProperty(Y, Ve);
      }
    },
    { flush: "post" }
  )], _e = [], Oe = [], Ks = () => {
    c.value = false, nextTick(() => {
      Ue.concat(_e, Oe).forEach((A) => A());
    });
  }, zt = (A) => {
    i(), c.value && (A.preventDefault(), v.value = {
      x: A.clientX,
      y: A.clientY
    }, k(), A.stopPropagation());
  }, Gs = watchEffect(() => {
    if (_e.forEach((A) => A()), _e.splice(0, _e.length), h2.value && (_e.push(
      q("scroll", w),
      q("click", w),
      q("contextmenu", w, { capture: true })
    ), J(u) && _e.push(q(J(u), "scroll", w)), J(f))) {
      const A = De();
      _e.push(...A.map((Y) => q(Y, "scroll", w)));
    }
  }), Ys = watchEffect(() => {
    Oe.forEach((A) => A()), Oe.splice(0, Oe.length), f ? Oe.push(q(J(f) || document.body, "contextmenu", zt)) : Oe.push(q("contextmenu", zt));
  });
  return Ue.push(Gs, Ys), {
    visible: h2,
    position: v,
    enabled: c,
    hide: w,
    show: k,
    stop: Ks
  };
}
const Bo = {
  name: "vu-contextual-dropdown"
}, Oo = /* @__PURE__ */ defineComponent({
  ...Bo,
  props: {
    /**
     * The area where the right-click will be listened to.
     * @default document.body
     */
    target: {
      type: Object,
      // [Boolean, String, Element],
      default: void 0
    },
    /**
     * Selected items.
     */
    value: {
      type: Array,
      default: () => []
    },
    /**
     * List of items to render.
     */
    items: {
      type: Array,
      required: true
    },
    /**
     * In responsive-mode, separates sub-menu open icon with item text.
     * Useful when an item with a sub-menu is selectable.
     */
    dividedResponsiveItems: {
      type: Boolean,
      default: false
    },
    /**
     * Allows to tweak z-Index value.
     */
    zIndex: {
      type: Number,
      default: () => 1e3
    },
    /**
     * Should the menu close on item click.
     */
    closeOnClick: {
      type: Boolean,
      default: true
    },
    /**
     * Prevents menu to position itself horizontally outside these boundaries.
     * @default document.body
     */
    attach: {
      type: [Boolean, String, Element, Object],
      default: void 0
    }
  },
  emits: ["close", "click-item"],
  setup(e, { expose: s, emit: t }) {
    const i = e, o = t, n = ref(false), r = ref(), d = computed(() => j(i.target)), u = computed(() => j(i.attach)), f = computed(() => (u == null ? void 0 : u.value) || document.body);
    function c() {
      n.value = false;
    }
    function h2() {
      o("close", void 0);
    }
    const { position: v, visible: k, show: w, hide: T, stop: D } = Io(r, {
      attach: f,
      target: d,
      onShow: c,
      onHide: h2
    });
    function Be(G) {
      G.handler && G.handler(G), o("click-item", G), i.closeOnClick && (T(), n.value = false);
    }
    return s({
      show: w,
      hide: T,
      stop: D
    }), (G, ne) => (openBlock(), createBlock(Teleport, {
      to: f.value,
      disabled: !f.value
    }, [
      unref(k) ? (openBlock(), createBlock(Ze, mergeProps({
        key: 0,
        ref_key: "menu",
        ref: r,
        responsive: n.value,
        "onUpdate:responsive": ne[0] || (ne[0] = (E) => n.value = E),
        position: unref(v),
        "onUpdate:position": ne[1] || (ne[1] = (E) => isRef(v) ? v.value = E : null),
        "divided-responsive-items": e.dividedResponsiveItems
      }, {
        items: e.items,
        zIndex: e.zIndex
      }, {
        target: f.value,
        selected: e.value,
        onClickItem: Be
      }), null, 16, ["responsive", "position", "divided-responsive-items", "target", "selected"])) : createCommentVNode("", true)
    ], 8, ["to", "disabled"]));
  }
}), Vo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Oo
}, Symbol.toStringTag, { value: "Module" })), Mt = (e) => e instanceof Date && !Number.isNaN(e.getTime()), $o = (e) => e % 4 === 0 && e % 100 !== 0 || e % 400 === 0, xo = (e, s) => [31, $o(e) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][s], Wt = (e, s) => e.getTime() === s.getTime(), Mo = (e) => {
  let s;
  if (Mt(e))
    s = e;
  else if (e && typeof e == "string")
    try {
      s = new Date(Date.parse(e));
    } catch {
    }
  return s;
}, et = {
  emits: ["update:modelValue", "boundary-change"],
  props: {
    modelValue: {
      type: [null, Date, Array],
      default: null
    },
    min: {
      type: [Number, Date],
      default: () => -22089888e5
      // 1900-01-01Z00:00:00.000Z
    },
    max: {
      type: [Number, Date],
      default: () => 4102444799999
      // 2099-12-31T23:59:59.999Z
    }
  },
  data: () => ({
    getListenersFromAttrs: ce
  }),
  watch: {
    min: {
      handler(e) {
        this.checkBoundary(e, "min");
      },
      immediate: true
    },
    max: {
      handler(e) {
        this.checkBoundary(e, "max");
      },
      immediate: true
    }
  },
  methods: {
    setBoundary(e, s) {
      return [
        s === "min" ? this.value[0] < e : this.value[0] > e,
        s === "min" ? this.value[1] < e : this.value[1] > e
      ].map((i, o) => i ? e : this.value[o]);
    },
    anyOutOfRange(e, s) {
      return this.value.some((t) => s === "min" ? t < e : t > e);
    },
    checkBoundary(e, s) {
      if (!this.value)
        return;
      const t = this.getListenersFromAttrs(this.$attrs)["boundary-change"] ? "boundary-change" : "update:modelValue";
      (Array.isArray(this.value) && this.anyOutOfRange(e, s) || ["min"].includes(s) && this.value < e || ["max"].includes(s) && this.value > e) && (Mt(e) ? this.$emit(t, t === "update:modelValue" ? new Date(e) : { boundary: s, value: new Date(e) }) : this.$emit(t, t === "update:modelValue" ? this.setBoundary(e, s) : { boundary: s, value: e }));
    }
  }
}, Po = {
  name: "vu-datepicker-table-date",
  mixins: [et],
  emits: ["select"],
  props: {
    date: {
      type: Date
    },
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    },
    unselectableDaysOfWeek: {
      type: Array[Number],
      default: () => []
    },
    firstDay: {
      type: Number,
      default: () => 0
    },
    showWeekNumber: {
      type: Boolean,
      required: false
    },
    isRTL: {
      type: Boolean,
      required: false
    },
    // i18n
    weekdaysLabels: {
      type: Array,
      required: true
    },
    weekdaysShortLabels: {
      type: Array,
      required: true
    }
  },
  methods: {
    renderTable(e) {
      return h("table", {
        class: "datepicker-table",
        attrs: { cellspacing: "0", cellpadding: "0" }
      }, [
        this.renderHead(),
        this.renderBody(e)
      ]);
    },
    renderHead() {
      const e = [];
      for (let s = 0; s < 7; s++) {
        const t = h("th", {
          attrs: { scope: "col", cellspacing: "0", cellpadding: "0" }
        }, [
          h("abbr", {
            attrs: {
              title: this.renderDayName(s)
            }
          }, this.renderDayName(s, true))
        ]);
        e.push(t);
      }
      return h("thead", {}, e);
    },
    renderBody(e) {
      return h("tbody", {}, e);
    },
    renderWeek(e, s, t) {
      const i = new Date(t, 0, 1), o = Math.ceil(((new Date(t, s, e) - i) / 864e5 + i.getDay() + 1) / 7), n = `datepicker${this.week}`;
      return h("td", { class: n }, o);
    },
    renderDayName(e, s) {
      let t = e + this.firstDay;
      for (; t >= 7; )
        t -= 7;
      return s ? this.weekdaysShortLabels[t] : this.weekdaysLabels[t];
    },
    renderDay(e, s, t, i, o, n, r) {
      const d = [];
      return r ? h("td", { class: "is-empty" }) : (n && d.push("is-disabled"), o && d.push("is-today"), i && d.push("is-selected"), h("td", {
        class: d.join(" "),
        attrs: {
          "data-day": e
        }
      }, [
        h("button", {
          class: "datepicker-button datepicker-name",
          type: "button",
          "data-year": t,
          "data-month": s,
          "data-day": e,
          onClick: this.onSelect
        }, e)
      ]));
    },
    renderRow(e) {
      return h("tr", {}, e);
    },
    onSelect(e) {
      const s = e.target.getAttribute("data-year"), t = e.target.getAttribute("data-month"), i = e.target.getAttribute("data-day");
      this.$emit("select", new Date(s, t, i));
    }
  },
  render() {
    const e = /* @__PURE__ */ new Date();
    e.setHours(0, 0, 0, 0);
    const s = xo(this.year, this.month);
    let t = new Date(this.year, this.month, 1).getDay();
    const i = [];
    let o = [], n, r;
    for (this.firstDay > 0 && (t -= this.firstDay, t < 0 && (t += 7)), n = s + t, r = n; r > 7; )
      r -= 7;
    n += 7 - r;
    for (let d = 0, u = 0; d < n; d++) {
      const f = new Date(this.year, this.month, 1 + (d - t)), c = Date.parse(this.min), h2 = Date.parse(this.max), v = c && f < c || h2 && f > h2 || this.unselectableDaysOfWeek && this.unselectableDaysOfWeek.indexOf(f.getDay()) > -1, k = Mt(this.date) ? Wt(f, this.date) : false, w = Wt(f, e), T = d < t || d >= s + t;
      o.push(this.renderDay(1 + (d - t), this.month, this.year, k, w, v, T)), ++u === 7 && (this.showWeekNumber && o.unshift(this.renderWeek(d - t, this.month, this.year)), i.push(this.renderRow(o, this.isRTL)), o = [], u = 0);
    }
    return this.renderTable(i);
  }
}, Lo = {
  name: "vu-datepicker",
  mixins: [Ae, et],
  components: {
    "vu-datepicker-table-date": Po
  },
  props: {
    className: { type: String, default: "" },
    modelValue: {
      type: [String, Date],
      default: () => ""
    },
    unselectableDaysOfWeek: {
      type: Array[Number],
      default: () => []
    },
    yearRange: {
      type: Number,
      default: () => 10
    },
    firstDay: {
      type: Number,
      default: () => 1
    },
    // i18n
    previousMonthLabel: {
      type: String,
      default: () => "Next Month"
    },
    nextMonthLabel: {
      type: String,
      default: () => "Previous Month"
    },
    monthsLabels: {
      type: Array,
      default: () => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    weekdaysLabels: {
      type: Array,
      default: () => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    weekdaysShortLabels: {
      type: Array,
      default: () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },
    showWeekNumber: {
      type: Boolean,
      required: false
    },
    isRTL: {
      type: Boolean,
      required: false
    }
  },
  emits: ["update:modelValue"],
  data: () => ({
    left: 0,
    top: 38,
    month: 0,
    year: 0
  }),
  computed: {
    date: {
      get() {
        return this.modelValue;
      },
      set(e) {
        return this.$emit("update:modelValue", e);
      }
    },
    isEmpty() {
      return this.value === null || this.value === "" || this.value === void 0;
    },
    currentMonth() {
      return this.monthsLabels[this.month];
    },
    minYear() {
      return new Date(this.min).getFullYear();
    },
    minMonth() {
      return new Date(this.min).getMonth();
    },
    maxYear() {
      return new Date(this.max).getFullYear();
    },
    maxMonth() {
      return new Date(this.max).getMonth();
    },
    hasPrevMonth() {
      return !(this.year === this.minYear && (this.month === 0 || this.minMonth >= this.month));
    },
    hasNextMonth() {
      return !(this.year === this.maxYear && (this.month === 11 || this.maxMonth <= this.month));
    },
    selectableMonths() {
      return this.monthsLabels.map((e, s) => {
        const t = this.year === this.minYear && s < this.minMonth || this.year === this.maxYear && s > this.maxMonth;
        return {
          value: s,
          label: e,
          disabled: t
        };
      });
    },
    selectableYears() {
      const e = Math.max(this.year - this.yearRange, this.minYear), s = Math.min(this.year + 1 + this.yearRange, this.maxYear + 1);
      return Array(s - e).fill({}).map((i, o) => ({ value: e + o }));
    }
  },
  watch: {
    innerShow(e) {
      e && this.setCurrent();
    },
    value() {
      this.innerShow && this.setCurrent();
    },
    month(e) {
      e > 11 ? (this.year++, this.month = 0) : e < 0 && (this.month = 11, this.year--);
    }
  },
  methods: {
    setCurrent() {
      const e = Mo(this.date) || /* @__PURE__ */ new Date();
      this.month = e.getMonth(), this.year = e.getFullYear();
    },
    onSelect(e) {
      this.month = e.getMonth(), this.year = e.getFullYear(), this.date = e;
    }
  }
}, To = { class: "datepicker-calendar" }, Ao = { class: "datepicker-title" }, Fo = { class: "datepicker-label" }, Do = ["disabled", "value"], zo = { class: "datepicker-label" }, No = ["disabled", "value"];
function Eo(e, s, t, i, o, n) {
  const r = resolveComponent("vu-datepicker-table-date");
  return e.innerShow ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: normalizeClass(["datepicker datepicker-root", t.className])
  }, [
    createBaseVNode("div", To, [
      createBaseVNode("div", Ao, [
        createBaseVNode("div", Fo, [
          createTextVNode(toDisplayString(n.currentMonth) + " ", 1),
          withDirectives(createBaseVNode("select", {
            class: "datepicker-select datepicker-select-month",
            "onUpdate:modelValue": s[0] || (s[0] = (d) => e.month = d)
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(n.selectableMonths, (d) => (openBlock(), createElementBlock("option", {
              key: d.value,
              disabled: d.disabled,
              value: d.value
            }, toDisplayString(d.label), 9, Do))), 128))
          ], 512), [
            [vModelSelect, e.month]
          ])
        ]),
        createBaseVNode("div", zo, [
          createTextVNode(toDisplayString(e.year) + " ", 1),
          withDirectives(createBaseVNode("select", {
            class: "datepicker-select datepicker-select-year",
            "onUpdate:modelValue": s[1] || (s[1] = (d) => e.year = d)
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(n.selectableYears, (d) => (openBlock(), createElementBlock("option", {
              key: d.value,
              disabled: d.disabled,
              value: d.value
            }, toDisplayString(d.value), 9, No))), 128))
          ], 512), [
            [vModelSelect, e.year]
          ])
        ]),
        createBaseVNode("button", {
          class: normalizeClass(["datepicker-prev", { "is-disabled": !n.hasPrevMonth }]),
          type: "button",
          onClick: s[2] || (s[2] = (d) => n.hasPrevMonth && e.month--)
        }, toDisplayString(t.previousMonthLabel), 3),
        createBaseVNode("button", {
          class: normalizeClass(["datepicker-next", { "is-disabled": !n.hasNextMonth }]),
          type: "button",
          onClick: s[3] || (s[3] = (d) => n.hasNextMonth && e.month++)
        }, toDisplayString(t.nextMonthLabel), 3)
      ]),
      createVNode(r, {
        date: n.date,
        year: e.year,
        month: e.month,
        min: e.min,
        max: e.max,
        "first-day": t.firstDay,
        "unselectable-days-of-week": t.unselectableDaysOfWeek,
        "months-labels": t.monthsLabels,
        "show-week-number": t.showWeekNumber,
        "is-r-t-l": t.isRTL,
        "weekdays-labels": t.weekdaysLabels,
        "weekdays-short-labels": t.weekdaysShortLabels,
        onSelect: s[4] || (s[4] = (d) => n.onSelect(d))
      }, null, 8, ["date", "year", "month", "min", "max", "first-day", "unselectable-days-of-week", "months-labels", "show-week-number", "is-r-t-l", "weekdays-labels", "weekdays-short-labels"])
    ])
  ], 2)) : createCommentVNode("", true);
}
const ws = /* @__PURE__ */ O(Lo, [["render", Eo]]), jo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ws
}, Symbol.toStringTag, { value: "Module" })), Ro = {
  name: "vu-facets-bar",
  emits: ["update:modelValue"],
  components: { VuDropdownMenu: Ce, VuIconBtn: U, VuPopover: re, VuBtn: ae, VuIcon: H },
  props: {
    modelValue: {
      type: Object,
      default: () => {
      }
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    uuidv4: be,
    labelsTruncated: false,
    activeLabelTruncated: false,
    startIndex: 0,
    hiddenFacets: 0,
    visibleFacets: 0,
    intxObs: void 0,
    intxObs2: void 0,
    intxObs3: void 0,
    resizeObs: void 0,
    activeFacetVsLongestFacet: 0
  }),
  mounted() {
    this.intxObs = new IntersectionObserver(this.intersects, {
      root: this.$refs.container,
      threshold: 1
    }), this.intxObs2 = new IntersectionObserver(this.intersectsStep2, {
      root: this.$refs.container,
      threshold: 1
    }), this.intxObs3 = new IntersectionObserver(this.intersectsStep3, {
      root: this.$refs.container,
      threshold: 1
    }), this.resizeObs = new ResizeObserver(() => {
      this.hiddenFacets = 0, this.labelsTruncated = false, this.activeLabelTruncated = false, this.intxObs.observe();
    }), this.intxObs.observe(this.$refs.inner);
  },
  beforeUnmount() {
    this.intxObs && this.intxObs.disconnect(), this.intxObs2 && this.intxObs.disconnect(), this.intxObs3 && this.intxObs.disconnect(), this.resizeObs && this.resizeObs.disconnect(), delete this.intxObs, delete this.intxObs2, delete this.intxObs3, delete this.resizeObs;
  },
  computed: {
    activeIndex() {
      return this.items.indexOf(this.modelValue);
    },
    visibleItems() {
      return this.hiddenFacets ? this.items.slice(this.startIndex, this.startIndex + this.visibleFacets) : this.items;
    },
    showPrepend() {
      return false;
    }
  },
  watch: {
    modelValue(e) {
      if (this.hiddenFacets) {
        const s = this.items.indexOf(e);
        let t = 0;
        s > this.visibleFacets - 1 && (t = s - this.visibleFacets + 2), this.startIndex = Math.min(t, this.items.length - this.visibleFacets);
      }
    },
    items(e, s) {
      (e.length !== s.length || e.any((t, i) => t.text !== s[i].text)) && (this.labelsTruncated = false, this.activeLabelTruncated = false, this.intxObs.observe());
    }
  },
  methods: {
    async intersects(e) {
      if (this.intxObs.unobserve(this.$refs.inner), e && e[0] && e[0].intersectionRatio < 1) {
        const s = this.$refs.inner.querySelectorAll(".facet"), t = this.$refs.inner.querySelector(".facet.facet--selected"), { width: i = 0 } = t || {}, o = Array.from(s).reduce((n, r) => Math.max(n.width, r));
        this.activeFacetVsLongestFacet = o - i, this.labelsTruncated = true, await this.$nextTick(), this.intxObs2.observe(this.$refs.inner);
      }
    },
    async intersectsStep2(e) {
      this.intxObs2.unobserve(this.$refs.inner), e && e[0] && e[0].intersectionRatio < 1 && (this.activeLabelTruncated = true, this.activeFacetVsLongestFacet = 0, await this.$nextTick(), this.$refs.inner.querySelectorAll(".facet").forEach((t) => {
        this.intxObs3.observe(t);
      }));
    },
    // eslint-disable-next-line no-unused-vars
    async intersectsStep3(e) {
      e.forEach((s) => this.intxObs3.unobserve(s.target)), this.hiddenFacets = e.filter((s) => s.intersectionRatio < 1).length, this.hiddenFacets > 0 && (this.visibleFacets = this.items.length - this.hiddenFacets);
    }
  }
}, Uo = {
  class: "vu-facets-bar",
  ref: "container"
}, Ho = {
  class: "facets-bar__inner",
  ref: "inner"
};
function qo(e, s, t, i, o, n) {
  const r = resolveComponent("VuIcon"), d = resolveComponent("VuPopover"), u = resolveComponent("VuBtn"), f = resolveComponent("VuIconBtn"), c = resolveComponent("VuDropdownMenu");
  return openBlock(), createElementBlock("div", Uo, [
    createBaseVNode("div", Ho, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(n.visibleItems, (h2) => (openBlock(), createBlock(u, {
        key: `${e.uuidv4()}`,
        class: normalizeClass([
          "facet",
          {
            default: h2 !== t.modelValue,
            "facet--selected": h2 === t.modelValue,
            "facet--unselected": h2 !== t.modelValue,
            "facet--icon-only": e.labelsTruncated && !(!e.activeLabelTruncated && h2 === t.modelValue)
          }
        ]),
        onClick: (v) => e.$emit("update:modelValue", h2)
      }, {
        default: withCtx(() => [
          !e.labelsTruncated || !e.activeLabelTruncated && h2 === t.modelValue ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            h2.icon ? (openBlock(), createBlock(r, {
              key: 0,
              icon: h2.icon,
              active: h2 === t.modelValue
            }, null, 8, ["icon", "active"])) : createCommentVNode("", true),
            createBaseVNode("span", null, toDisplayString(h2.text), 1)
          ], 64)) : (openBlock(), createBlock(d, {
            key: 1,
            type: "tooltip",
            arrow: ""
          }, {
            default: withCtx(() => [
              h2.icon ? (openBlock(), createBlock(r, {
                key: 0,
                icon: h2.icon
              }, null, 8, ["icon"])) : createCommentVNode("", true)
            ]),
            body: withCtx(() => [
              createTextVNode(toDisplayString(h2.text), 1)
            ]),
            _: 2
          }, 1024))
        ]),
        _: 2
      }, 1032, ["class", "onClick"]))), 128)),
      e.labelsTruncated && !e.activeLabelTruncated ? (openBlock(), createElementBlock("div", {
        key: 0,
        style: normalizeStyle([{ visibility: "hidden" }, { width: `${e.activeFacetVsLongestFacet}+px` }])
      }, null, 4)) : createCommentVNode("", true),
      e.visibleFacets ? (openBlock(), createBlock(c, {
        key: 1,
        shift: true,
        class: "vu-facets-bar__dropdownmenu",
        items: t.items,
        model: t.modelValue,
        "onUpdate:modelValue": s[0] || (s[0] = (h2) => e.$emit("update:modelValue", h2)),
        onClickItem: s[1] || (s[1] = (h2) => e.$emit("update:modelValue", h2))
      }, {
        default: withCtx(() => [
          createVNode(f, { icon: "menu-dot" })
        ]),
        _: 1
      }, 8, ["items", "model"])) : createCommentVNode("", true)
    ], 512)
  ], 512);
}
const Wo = /* @__PURE__ */ O(Ro, [["render", qo], ["__scopeId", "data-v-4fb7a361"]]), Ko = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Wo
}, Symbol.toStringTag, { value: "Module" })), Go = {
  name: "vu-form",
  mixins: [go]
};
function Yo(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("form", {
    novalidate: "novalidate",
    class: "form form-root",
    onSubmit: withModifiers(() => {
    }, ["prevent"])
  }, [
    renderSlot(e.$slots, "default")
  ], 32);
}
const ks = /* @__PURE__ */ O(Go, [["render", Yo]]), Xo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ks
}, Symbol.toStringTag, { value: "Module" })), Jo = {
  props: {
    elevated: {
      type: Boolean,
      default: false
    }
  }
}, Ss = {
  props: {
    clearable: {
      type: Boolean,
      default: () => false
    }
  }
}, ot = {
  offline: "status-empty",
  online: "status-ok",
  busy: "status-noway",
  away: "status-clock"
}, Qo = {
  name: "vu-user-picture",
  inject: [
    "vuUserPictureSrcUrl"
  ],
  props: {
    size: {
      type: String,
      default: "medium",
      validator: (e) => ["tiny", "small", "medium", "medium-1", "big", "bigger", "large", "extra-large"].includes(e)
    },
    circle: {
      type: Boolean,
      default: true
    },
    clickable: {
      type: Boolean,
      default: false
    },
    gutter: {
      type: Boolean,
      default: false
    },
    hoverable: {
      type: Boolean,
      default: false
    },
    inheritBackground: {
      type: Boolean,
      default: true
    },
    // eslint-disable-next-line vue/require-default-prop
    presence: {
      type: String,
      required: false,
      validator: (e) => e ? ot[e] !== void 0 : true
    },
    src: {
      type: String,
      required: false,
      default: void 0
    },
    id: {
      type: String,
      required: false,
      default: void 0
    }
  },
  data: () => ({
    presenceStates: ot,
    hovered: false
  }),
  watch: {
    hoverable: {
      // eslint-disable-next-line object-shorthand, func-names
      handler: function(e) {
        !e && this.hovered && (this.hovered = false);
      }
    }
  },
  computed: {
    fonticon() {
      return this.presence && ot[this.presence];
    },
    _src() {
      return this.vuUserPictureSrcUrl && this.id && !this.src ? `${this.vuUserPictureSrcUrl}/${this.id}` : this.src;
    }
  }
}, Zo = {
  key: 0,
  class: "vu-user-picture__hover-mask"
}, er = {
  key: 1,
  class: "vu-presence"
};
function tr(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-user-picture", [t.size ? `vu-user-picture--${t.size}` : "", {
      "vu-user-picture--gutter": t.gutter,
      "vu-user-picture--circle": t.circle,
      "vu-user-picture--clickable": t.clickable,
      "vu-user-picture--bg-inherit": t.inheritBackground
    }]]),
    onMouseover: s[0] || (s[0] = () => {
      t.hoverable && (e.hovered = true);
    }),
    onMouseleave: s[1] || (s[1] = () => {
      t.hoverable && (e.hovered = false);
    })
  }, [
    createBaseVNode("div", {
      class: "vu-user-picture-wrap",
      style: normalizeStyle([t.presence ? { background: "inherit" } : ""])
    }, [
      createBaseVNode("div", {
        class: "vu-user-picture__image",
        style: normalizeStyle({ "background-image": `url(${n._src})` })
      }, null, 4),
      e.hovered ? (openBlock(), createElementBlock("div", Zo)) : createCommentVNode("", true),
      t.size !== "tiny" ? (openBlock(), createElementBlock("div", er, [
        createBaseVNode("div", {
          class: normalizeClass(`vu-presence__indicator vu-presence__indicator--${t.presence}`)
        }, null, 2)
      ])) : createCommentVNode("", true)
    ], 4)
  ], 34);
}
const Le = /* @__PURE__ */ O(Qo, [["render", tr], ["__scopeId", "data-v-a9791afa"]]), sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Le
}, Symbol.toStringTag, { value: "Module" })), nr = {
  name: "vu-select-options",
  props: {
    options: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      required: false
    },
    user: {
      type: Boolean,
      required: false
    },
    selected: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    keyIndex: {
      type: Number,
      default: () => -1
    }
  },
  expose: ["focus"],
  emits: ["click-item", "select-keydown", "change"],
  data: () => ({
    uid: be
  }),
  methods: {
    focus() {
      var e;
      (e = this.$refs.nativeSelect) == null || e.focus();
    }
  },
  components: { VuIcon: H, VuUserPicture: Le }
}, ir = ["label", "selected"], lr = ["value", "selected", "disabled"], or = { class: "option__text" }, rr = ["disabled", "onClick"], ar = {
  key: 0,
  class: "flex items-center"
}, ur = { class: "option__text" }, dr = { class: "option__text" };
function cr(e, s, t, i, o, n) {
  const r = resolveComponent("VuUserPicture"), d = resolveComponent("VuIcon");
  return openBlock(), createElementBlock("ul", {
    class: normalizeClass(["vu-select-options", { "select-options--multiple": t.multiple, "select-options--single": !t.multiple, "select-options--user": t.user }])
  }, [
    createBaseVNode("select", {
      ref: "nativeSelect",
      class: "select-hidden",
      onKeydown: s[0] || (s[0] = (u) => e.$emit("select-keydown", u)),
      onChange: s[1] || (s[1] = () => {
        const u = e.$refs.nativeSelect.value;
        u === "__placeholder__" ? e.$emit("change", void 0) : e.$emit("change", u);
      })
    }, [
      createBaseVNode("option", {
        value: "__placeholder__",
        label: t.placeholder,
        selected: t.selected[0] === void 0 || t.selected === ""
      }, null, 8, ir),
      (openBlock(true), createElementBlock(Fragment, null, renderList(t.options, (u) => (openBlock(), createElementBlock("option", {
        key: `${e.uid}-${u.value || u.label}`,
        value: u.value || u.label,
        selected: u.selected || t.selected.includes(u),
        disabled: u.disabled
      }, toDisplayString(u.label), 9, lr))), 128))
    ], 544),
    !t.multiple && t.placeholder ? (openBlock(), createElementBlock("li", {
      key: 0,
      class: normalizeClass([{ "option--selected": t.selected[0].value === void 0 }, "option__placeholder"]),
      onClick: s[2] || (s[2] = (u) => e.$emit("click-item", { value: "" }))
    }, [
      createBaseVNode("span", or, toDisplayString(t.placeholder), 1)
    ], 2)) : createCommentVNode("", true),
    (openBlock(true), createElementBlock(Fragment, null, renderList(t.options, (u, f) => (openBlock(), createElementBlock("li", {
      key: `${u.id || e.uid()}`,
      class: normalizeClass({
        "option--selected": u.selected || t.selected.includes(u),
        "option--keyboard": f === t.keyIndex
      }),
      disabled: u.disabled,
      onClick: (c) => !u.disabled && e.$emit("click-item", u)
    }, [
      t.user ? (openBlock(), createElementBlock("div", ar, [
        createVNode(r, {
          size: "small",
          id: u.value,
          src: u.src
        }, null, 8, ["id", "src"]),
        createBaseVNode("span", ur, toDisplayString(u.text || u.label), 1)
      ])) : renderSlot(e.$slots, "default", {
        key: 1,
        item: u
      }, () => [
        u.fonticon ? (openBlock(), createBlock(d, {
          key: 0,
          icon: u.fonticon
        }, null, 8, ["icon"])) : createCommentVNode("", true),
        createBaseVNode("span", dr, toDisplayString(u.text || u.label), 1)
      ], true)
    ], 10, rr))), 128))
  ], 2);
}
const Pt = /* @__PURE__ */ O(nr, [["render", cr], ["__scopeId", "data-v-6c956d64"]]), hr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pt
}, Symbol.toStringTag, { value: "Module" })), fr = {
  name: "vu-spinner",
  props: {
    mask: {
      type: Boolean,
      default: () => false
    },
    text: {
      type: String,
      default: () => ""
    }
  }
}, mr = { class: "mask-wrapper" }, pr = { class: "mask-content" }, gr = /* @__PURE__ */ createStaticVNode('<div class="spinner spinning fade in"><span class="spinner-bar"></span><span class="spinner-bar spinner-bar1"></span><span class="spinner-bar spinner-bar2"></span><span class="spinner-bar spinner-bar3"></span></div>', 1), vr = {
  key: 0,
  class: "text"
};
function yr(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass({ mask: t.mask })
  }, [
    createBaseVNode("div", mr, [
      createBaseVNode("div", pr, [
        gr,
        t.text.length ? (openBlock(), createElementBlock("span", vr, toDisplayString(t.text), 1)) : createCommentVNode("", true)
      ])
    ])
  ], 2);
}
const Lt = /* @__PURE__ */ O(fr, [["render", yr]]), br = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Lt
}, Symbol.toStringTag, { value: "Module" }));
function _r() {
  return window ? navigator.userAgent.toLowerCase().indexOf("firefox") >= 0 : false;
}
const wr = {
  name: "vu-scroller",
  exposes: ["stopLoading", "stopLoadingBefore"],
  props: {
    reverse: {
      type: Boolean,
      default: false
    },
    infinite: {
      type: Boolean,
      default: false
    },
    showLoading: {
      type: Boolean,
      default: false
    },
    // alias for infinite
    dataAfter: {
      type: Boolean,
      default: false
    },
    dataBefore: {
      type: Boolean,
      default: false
    },
    infiniteMargin: {
      type: Number,
      default: 200
    },
    infiniteHeight: {
      type: String,
      default: "50px"
    },
    infiniteBeforeHeight: {
      type: String,
      default: "50px"
    },
    loadingText: {
      type: String,
      default: ""
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    alwaysShow: {
      type: Boolean,
      default: false
    },
    // Allows to configure timeout for innerScroll to happen.
    // The new content needs to be rerender to not endlessly loop on the intersection.
    updateSleep: {
      type: Number,
      default: 15
    },
    noIntersectionRoot: {
      type: Boolean,
      default: false
    }
  },
  emits: ["loading-before", "loading", "mounted"],
  data() {
    return {
      lazyKeyIndex: 0,
      lazyKeyIndex2: 0,
      wait: false,
      waitBefore: false,
      firefox: false
    };
  },
  computed: {
    rootMargin() {
      return Array(4).fill(`${this.infiniteMargin}px`).join(" ");
    },
    options() {
      const e = {}, { rootMargin: s } = this;
      return this.noIntersectionRoot || (e.root = this.$refs["scroll-container"]), {
        ...e,
        rootMargin: s
      };
    }
  },
  mounted() {
    this.firefox = _r(), this.$emit("mounted");
  },
  methods: {
    stopLoading(e) {
      e ? (this.lazyKeyIndex2 += 1, this.sleep()) : (this.lazyKeyIndex += 1, this.sleep());
    },
    async sleep() {
      this.wait = true, this.waitBefore = true, await setTimeout(() => {
      }, this.updateSleep), this.wait = false, this.waitBefore = false;
    }
  },
  components: { VuSpinner: Lt, VuLazy: Vt }
}, kr = { class: "vu-scroll-container__inner" };
function Sr(e, s, t, i, o, n) {
  const r = resolveComponent("VuSpinner"), d = resolveComponent("VuLazy"), u = resolveComponent("vu-spinner");
  return openBlock(), createElementBlock("div", {
    ref: "scroll-container",
    class: normalizeClass([{
      "vu-scroll-container--reverse": t.reverse,
      "vu-scroll-container--horizontal": t.horizontal,
      "vu-scroll-container--always-show": t.alwaysShow,
      firefox: o.firefox
    }, "vu-scroll-container"])
  }, [
    createBaseVNode("div", kr, [
      t.dataBefore && !o.waitBefore ? (openBlock(), createBlock(d, {
        key: `lazy-key-${o.lazyKeyIndex2}`,
        onIntersect: s[0] || (s[0] = (f) => {
          e.$emit("loading-before"), e.$emit("loading", true);
        }),
        options: n.options,
        height: t.infiniteBeforeHeight || t.infiniteHeight,
        class: "vu-scroll__lazy vu-scroll__lazy-top"
      }, {
        default: withCtx(() => [
          renderSlot(e.$slots, "loadingBefore", {}, () => [
            createVNode(r, { text: t.loadingText }, null, 8, ["text"])
          ], true)
        ]),
        _: 3
      }, 8, ["options", "height"])) : createCommentVNode("", true),
      renderSlot(e.$slots, "default", {}, void 0, true),
      (t.infinite || t.dataAfter) && !o.wait ? (openBlock(), createBlock(d, {
        key: `lazy-key-${o.lazyKeyIndex}`,
        onIntersect: s[1] || (s[1] = (f) => e.$emit("loading")),
        options: n.options,
        height: t.infiniteHeight,
        style: { "min-width": "30px" },
        class: "vu-scroll__lazy vu-scroll__lazy-bottom"
      }, {
        default: withCtx(() => [
          renderSlot(e.$slots, "loading", {}, () => [
            createVNode(r, { text: t.loadingText }, null, 8, ["text"])
          ], true)
        ]),
        _: 3
      }, 8, ["options", "height"])) : t.showLoading ? renderSlot(e.$slots, "loading", { key: 2 }, () => [
        createVNode(u, { text: t.loadingText }, null, 8, ["text"])
      ], true) : createCommentVNode("", true)
    ])
  ], 2);
}
const Re = /* @__PURE__ */ O(wr, [["render", Sr], ["__scopeId", "data-v-5fcafbaf"]]), Cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Re
}, Symbol.toStringTag, { value: "Module" })), Ir = {
  name: "vu-select",
  inheritAttrs: false,
  mixins: [Q, Ss, K, Z, ee],
  props: {
    autocomplete: {
      type: Boolean,
      default: () => false
    },
    hidePlaceholderOption: {
      type: Boolean,
      default: () => false
    },
    grouped: {
      type: Boolean,
      default: () => false
    },
    maxVisible: {
      type: Number,
      default: () => 5
    },
    dropdownZIndex: {
      type: Number,
      default: 1020
    },
    // detachable props
    attach: {
      default: () => true,
      validator: St
    },
    contentClass: {
      type: [String, Object],
      default: ""
    },
    contentStyle: {
      type: [String, Object],
      default: () => ""
    }
    // end detachable
  },
  emits: ["update:modelValue"],
  inject: {
    isIos: {
      from: Qe
    }
  },
  data: () => ({
    open: false,
    focused: false,
    search: "",
    uid: be()
  }),
  watch: {
    value() {
      this.search = this.selected.label;
    },
    open(e) {
      e && this.focus();
    }
  },
  created() {
    this.search = this.value && this.selected.label || this.value;
  },
  computed: {
    hasSomeEnabledOptions() {
      return this.enabledOptions.length > 0;
    },
    firstEnabledOption() {
      return this.enabledOptions.slice(0)[0];
    },
    lastEnabledOption() {
      return this.enabledOptions.slice(-1)[0];
    },
    enabledOptions() {
      return (this.autocomplete && this.search ? this.options : this.innerOptions).filter((s) => !s.disabled);
    },
    innerOptions() {
      return this.autocomplete ? this.options.filter((e) => e.label.toLowerCase().includes(this.search.toLowerCase()) || e.value.toLowerCase().includes(this.search.toLowerCase())) : this.options;
    },
    selected() {
      return this.options.find((e) => e.value === this.value) || {
        label: this.placeholder
      };
    },
    willDetach() {
      return this.attach === false || this.attach !== "" && typeof this.attach === String;
    },
    groupedOptions() {
      return this.grouped ? this.options.reduce((e, s) => (e[s.group] || (e[s.group] = []), e[s.group].push(s), e), {}) : null;
    },
    internMaxVisible() {
      return this.maxVisible > this.options.length ? this.options.length : this.maxVisible;
    }
  },
  methods: {
    stop(e) {
      e.preventDefault(), e.stopPropagation();
    },
    innerSelectKeydown(e) {
      switch (e.code) {
        case "Space":
        case "Enter":
        case "NumpadEnter":
          this.open = !this.open, this.stop(e);
          break;
        case "Escape":
          this.open = false, this.stop(e);
          break;
        case "ArrowUp":
          this.browse(void 0, e);
          break;
        case "ArrowDown":
          this.open ? this.browse(true, e) : (this.open = true, this.stop(e));
          break;
      }
    },
    focus() {
      var e, s;
      this.focused = true, !(this.autocomplete || this.isIos) && (this.willDetach ? setTimeout(() => {
        var t, i;
        (i = (t = this.$refs) == null ? void 0 : t.selectOptions) == null || i.focus();
      }, 50) : (s = (e = this.$refs) == null ? void 0 : e.nativeSelect) == null || s.focus());
    },
    blur() {
      this.focused = false;
    },
    async browse(e, s) {
      this.grouped || (!e && this.selected === this.firstEnabledOption ? (this.value = this.hidePlaceholderOption ? this.lastEnabledOption.value : void 0, this.stop(s), this.scrollIntoView()) : e && this.selected === this.lastEnabledOption ? (this.value = this.hidePlaceholderOption ? this.firstEnabledOption.value : void 0, this.stop(s), this.scrollIntoView()) : this.modelValue || (this.value = e ? this.firstEnabledOption.value : this.lastEnabledOption.value, this.stop(s), this.scrollIntoView()));
    },
    scrollIntoView() {
      this.$nextTick(() => {
        var t;
        const e = this.$refs && this.$refs.dropdown;
        let s;
        if (e && (s = (t = this.$refs) == null ? void 0 : t.dropdown.querySelector("ul li.result-option-selected")), s) {
          const i = s.offsetTop + s.clientHeight;
          (i > e.scrollTop + e.clientHeight || i < e.scrollTop) && this.$refs.dropdown.scrollTo({ top: s.offsetTop });
        }
      });
    }
  },
  components: { VuIconBtn: U, VuPopover: re, VuSelectOptions: Pt, VuScroller: Re }
}, Br = {
  key: 0,
  class: "control-label"
}, Or = {
  key: 0,
  class: "label-field-required"
}, Vr = ["disabled", "placeholder"], $r = {
  key: 2,
  class: "select-handle"
}, xr = ["disabled"], Mr = ["label"], Pr = ["value", "selected", "disabled"], Lr = {
  key: 4,
  class: "select-handle"
}, Tr = {
  key: 5,
  class: "select-choices form-control"
}, Ar = { class: "select-choice" }, Fr = { class: "select-results" }, Dr = ["onClick"], zr = { class: "result-group-label" }, Nr = { class: "result-group-sub" }, Er = ["onClick"], jr = {
  key: 1,
  class: "form-control-helper-text"
};
function Rr(e, s, t, i, o, n) {
  const r = resolveComponent("VuIconBtn"), d = resolveComponent("VuSelectOptions"), u = resolveComponent("VuScroller"), f = resolveComponent("VuPopover"), c = resolveDirective("click-outside");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["form-group", e.classes])
  }, [
    e.label.length ? (openBlock(), createElementBlock("label", Br, [
      createTextVNode(toDisplayString(e.label), 1),
      e.required ? (openBlock(), createElementBlock("span", Or, " *")) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    withDirectives((openBlock(), createElementBlock("div", {
      onClick: s[10] || (s[10] = (h2) => {
        e.open = !e.open && !e.disabled, e.search = e.value && n.selected.label || e.value;
      }),
      class: normalizeClass([
        "vu-select",
        "select",
        {
          "select-placeholder": !t.autocomplete,
          "select-no-placeholder-option": t.hidePlaceholderOption,
          "select-not-chosen": !t.autocomplete && !e.value,
          "dropdown-visible": e.open,
          "select-disabled": e.disabled,
          "select-autocomplete": t.autocomplete,
          "select-clearable": e.clearable,
          "select-focus": e.focused && !e.disabled
        }
      ])
    }, [
      t.autocomplete ? withDirectives((openBlock(), createElementBlock("input", {
        key: 0,
        ref: "innerInput",
        disabled: e.disabled,
        placeholder: n.selected.label,
        class: "form-control",
        "onUpdate:modelValue": s[0] || (s[0] = (h2) => e.search = h2)
      }, null, 8, Vr)), [
        [vModelText, e.search]
      ]) : createCommentVNode("", true),
      e.value && (t.autocomplete || e.clearable) ? (openBlock(), createBlock(r, {
        key: 1,
        icon: "clear",
        class: normalizeClass(["select__clear-icon", { "select--has-handle": t.autocomplete }]),
        onClick: s[1] || (s[1] = (h2) => {
          var v, k;
          e.$emit("update:modelValue", ""), (k = (v = e.$refs) == null ? void 0 : v.innerInput) == null || k.focus(), e.search = "";
        })
      }, null, 8, ["class"])) : createCommentVNode("", true),
      t.autocomplete ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", $r)),
      !t.autocomplete && !n.willDetach ? (openBlock(), createElementBlock("select", {
        key: 3,
        class: "form-control select-hidden",
        disabled: e.disabled,
        ref: "nativeSelect",
        onFocus: s[2] || (s[2] = (h2) => e.focused = true),
        onBlur: s[3] || (s[3] = (h2) => n.blur()),
        onChange: s[4] || (s[4] = () => {
          const h2 = e.$refs.nativeSelect.value;
          h2 === "__placeholder__" ? e.value = void 0 : e.value = h2, n.scrollIntoView();
        }),
        onKeydown: s[5] || (s[5] = (h2) => n.innerSelectKeydown(h2))
      }, [
        createBaseVNode("option", {
          value: "__placeholder__",
          label: e.placeholder
        }, null, 8, Mr),
        (openBlock(true), createElementBlock(Fragment, null, renderList(n.innerOptions, (h2) => (openBlock(), createElementBlock("option", {
          key: `${e.uid}-${h2.value || h2.label}`,
          value: h2.value || h2.label,
          selected: h2.value === e.value,
          disabled: h2.disabled
        }, toDisplayString(h2.label), 9, Pr))), 128))
      ], 40, xr)) : createCommentVNode("", true),
      t.autocomplete ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", Lr)),
      t.autocomplete ? createCommentVNode("", true) : (openBlock(), createElementBlock("ul", Tr, [
        createBaseVNode("li", Ar, toDisplayString(n.selected.label), 1)
      ])),
      t.attach && e.open ? (openBlock(), createElementBlock("div", {
        key: 6,
        class: "select-dropdown",
        ref: "dropdown",
        style: normalizeStyle(`height: ${38 * (n.innerOptions.length + (!t.autocomplete && !t.hidePlaceholderOption ? 1 : 0))}px; max-height: ${38 * (n.internMaxVisible + 1)}px;`)
      }, [
        createBaseVNode("ul", Fr, [
          !t.autocomplete && !t.hidePlaceholderOption ? (openBlock(), createElementBlock("li", {
            key: 0,
            class: normalizeClass(["result-option result-option-placeholder", { "result-option-selected": !e.modelValue }]),
            onClick: s[6] || (s[6] = (h2) => {
              e.$emit("update:modelValue", ""), e.search = "";
            })
          }, toDisplayString(e.placeholder), 3)) : createCommentVNode("", true),
          t.grouped ? (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(n.groupedOptions, (h2, v) => (openBlock(), createElementBlock("li", {
            key: `${e.uid}-${h2.group}`,
            class: "result-group"
          }, [
            createBaseVNode("span", zr, toDisplayString(v), 1),
            createBaseVNode("ul", Nr, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(h2, (k) => (openBlock(), createElementBlock("li", {
                key: `${e.uid}-${k.value}`,
                class: normalizeClass([{
                  "result-option-disabled": k.disabled,
                  "result-option-selected": k.value === e.value
                }, "result-option"]),
                onClick: (w) => k.disabled ? null : e.$emit("update:modelValue", k.value)
              }, toDisplayString(k.label), 11, Er))), 128))
            ])
          ]))), 128)) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(n.innerOptions, (h2) => (openBlock(), createElementBlock("li", {
            key: `${e.uid}-${h2.value || h2.label}`,
            class: normalizeClass([{
              "result-option-disabled": h2.disabled,
              "result-option-selected": h2.value === e.value
            }, "result-option"]),
            onClick: (v) => {
              h2.disabled || e.$emit("update:modelValue", h2.value), e.search = h2.label;
            }
          }, toDisplayString(h2.label), 11, Dr))), 128))
        ])
      ], 4)) : n.willDetach && e.open ? (openBlock(), createBlock(f, {
        key: 7,
        attach: t.attach,
        type: "vu-select-dropdown",
        show: e.open,
        positions: ["bottom-left", "top-left"],
        side: "bottom-left",
        "sync-width": true,
        animated: false,
        "content-class": t.contentClass,
        offsets: { "bottom-left": { y: 3 }, "top-left": { y: -43 } },
        "content-style": [{ zIndex: t.dropdownZIndex }, "position: absolute;", t.contentStyle],
        "onUpdate:show": s[9] || (s[9] = (h2) => {
          e.open = h2;
        })
      }, {
        body: withCtx(() => [
          createVNode(u, { "always-show": "" }, {
            default: withCtx(() => [
              createVNode(d, mergeProps({ ref: "selectOptions" }, { options: n.innerOptions, selected: [n.selected], placeholder: e.placeholder }, {
                onChange: s[7] || (s[7] = (h2) => e.value = h2),
                onSelectKeydown: n.innerSelectKeydown,
                onClickItem: s[8] || (s[8] = (h2) => {
                  this.focus(), e.$emit("update:modelValue", h2.value);
                })
              }), null, 16, ["onSelectKeydown"])
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["attach", "show", "content-class", "content-style"])) : createCommentVNode("", true)
    ], 2)), [
      [c, {
        events: ["click"],
        handler: function() {
          e.open = false, e.search = e.value && n.selected.label || e.value;
        }
      }]
    ]),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.errorBucket, (h2, v) => (openBlock(), createElementBlock("span", {
      key: `${v}-error-${h2}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, toDisplayString(h2), 1))), 128)),
    e.helper.length ? (openBlock(), createElementBlock("span", jr, toDisplayString(e.helper), 1)) : createCommentVNode("", true)
  ], 2);
}
const Cs = /* @__PURE__ */ O(Ir, [["render", Rr], ["__scopeId", "data-v-aeb6d997"]]), Ur = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cs
}, Symbol.toStringTag, { value: "Module" })), Hr = {
  name: "vu-grid-view",
  mixins: [Ie, Jo],
  props: {
    value: {
      type: [Object, Array],
      default: () => []
    },
    items: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    rich: {
      type: Boolean,
      default: true
    },
    selectable: {
      type: Boolean,
      default: false
    },
    allSelectable: {
      type: Boolean,
      default: true
    },
    serverItemsLength: {
      type: Number,
      default: 0
    },
    rowsPerPage: {
      type: Number,
      default: 5
    },
    topPagination: {
      type: Boolean,
      default: false
    },
    whiteBackground: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Function,
      default(e, s) {
        return this.isAscending ? e[this.sortKey] < s[this.sortKey] ? -1 : e[this.sortKey] > s[this.sortKey] ? 1 : 0 : e[this.sortKey] > s[this.sortKey] ? -1 : e[this.sortKey] < s[this.sortKey] ? 1 : 0;
      }
    },
    itemPerPageOptions: {
      type: Array,
      default: () => [10, 20, 50]
    },
    labels: {
      type: Object,
      default: () => ({
        previousLabel: "Previous",
        nextLabel: "Next"
      })
    }
  },
  emits: ["cellClick", "update:modelValue", "update:rowsPerPage", "pageUp", "pageDown"],
  data() {
    return {
      sortKey: "",
      isAscending: void 0,
      startRow: 0,
      selectedCellItem: "",
      selectedCellProperty: ""
    };
  },
  computed: {
    hasSelected() {
      return this.value.length > 0;
    },
    sortedItems() {
      const e = this.startRow + this.rowsPerPage;
      return this.sortKey ? [...this.items].sort(this.sort.bind(this)).slice(this.startRow, e) : this.items.slice(this.startRow, e);
    },
    itemMax() {
      const e = this.startRow + this.rowsPerPage;
      return e > this.items.length ? this.items.length : e;
    }
  },
  methods: {
    isEqual(e, s) {
      return e === s;
    },
    selectAll() {
      this.value.length === this.items.length ? this.$emit("update:modelValue", []) : this.$emit("update:modelValue", this.items);
    },
    selectItem(e) {
      const s = this.value.includes(e), t = [...this.value];
      if (s) {
        const i = t.indexOf(e);
        t.splice(i, 1);
      } else
        t.push(e);
      this.$emit("update:modelValue", t);
    },
    updateRows(e) {
      this.$emit("update:rowsPerPage", e);
    },
    scrollHorizontal(e) {
      const s = e.currentTarget;
      s.offsetWidth !== s.scrollWidth && (e.preventDefault(), e.deltaX && (s.scrollLeft -= Math.round(e.deltaX / 4)), e.deltaY && (s.scrollLeft += Math.round(e.deltaY / 4)));
    },
    sortBy(e) {
      this.sortKey === e ? this.isAscending = !this.isAscending : (this.sortKey = e, this.isAscending = true);
    },
    pageUp() {
      this.startRow += this.rowsPerPage, this.$emit("pageUp");
    },
    pageDown() {
      this.startRow -= this.rowsPerPage, this.$emit("pageDown");
    }
  },
  components: { VuCheckbox: _s, VuIconBtn: U, VuSelect: Cs, VuBtn: ae }
}, qr = {
  key: 0,
  class: "grid-view__table__header-intersection"
}, Wr = { class: "grid-view__table__body" }, Kr = ["onClick"], Gr = {
  key: 0,
  class: "grid-view__table__row__header"
}, Yr = ["onClick"], Xr = { style: { "margin-right": "5px" } };
function Jr(e, s, t, i, o, n) {
  const r = resolveComponent("VuCheckbox"), d = resolveComponent("VuIconBtn"), u = resolveComponent("VuSelect"), f = resolveComponent("VuBtn"), c = resolveDirective("mask");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-grid-view", { elevated: e.elevated, "vu-grid-view--rich": t.rich }, e.classes]),
    onWheel: s[0] || (s[0] = (...h2) => n.scrollHorizontal && n.scrollHorizontal(...h2))
  }, [
    createBaseVNode("div", {
      class: "grid-view__container",
      style: normalizeStyle(`height: ${(t.dense ? 24 : 38) + (t.dense ? 24 : 38) * (n.sortedItems.length < t.rowsPerPage ? n.sortedItems.length : t.rowsPerPage)}px;`)
    }, [
      createBaseVNode("table", {
        class: normalizeClass([
          "grid-view__table",
          { dense: t.dense, "grid-view__table--has-selection": n.hasSelected }
        ])
      }, [
        createBaseVNode("thead", null, [
          createBaseVNode("tr", null, [
            t.selectable ? (openBlock(), createElementBlock("th", qr, [
              t.allSelectable ? (openBlock(), createBlock(r, {
                key: 0,
                dense: "",
                class: "grid-view__table__checkbox",
                value: t.value.length === t.items.length && t.items.length,
                options: [{}],
                onInput: n.selectAll
              }, null, 8, ["value", "onInput"])) : createCommentVNode("", true)
            ])) : createCommentVNode("", true),
            (openBlock(true), createElementBlock(Fragment, null, renderList(t.headers, (h2, v) => (openBlock(), createElementBlock("th", {
              key: `header_${h2.property}_${v}`
            }, [
              createTextVNode(toDisplayString(h2.label) + " ", 1),
              h2.sortable !== false ? (openBlock(), createBlock(d, {
                key: 0,
                class: "icon-smaller",
                icon: h2.property === o.sortKey && o.isAscending ? "expand-up" : "expand-down",
                active: h2.property === o.sortKey,
                onClick: (k) => n.sortBy(h2.property)
              }, null, 8, ["icon", "active", "onClick"])) : createCommentVNode("", true)
            ]))), 128))
          ])
        ]),
        createBaseVNode("tbody", Wr, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(n.sortedItems, (h2, v) => (openBlock(), createElementBlock("tr", {
            class: normalizeClass({ dense: t.dense, selected: t.value.includes(h2) }),
            key: `line_${v}`,
            onClick: (k) => n.selectItem(h2)
          }, [
            t.selectable ? (openBlock(), createElementBlock("td", Gr, [
              createVNode(r, {
                dense: "",
                class: "grid-view__table__body__checkbox",
                onInput: (k) => n.selectItem(h2),
                value: t.value.includes(h2),
                options: [{}]
              }, null, 8, ["onInput", "value"])
            ])) : createCommentVNode("", true),
            (openBlock(true), createElementBlock(Fragment, null, renderList(t.headers, (k) => (openBlock(), createElementBlock("td", {
              key: `${k.property}_${h2[k.property]}`,
              class: normalizeClass([
                n.isEqual(h2, o.selectedCellItem) && n.isEqual(k.property, o.selectedCellProperty) ? "selected" : ""
              ]),
              onClick: () => {
                o.selectedCellItem = h2, o.selectedCellProperty = k.property, e.$emit("cellClick", { item: h2, header: k, property: e.property });
              }
            }, [
              renderSlot(e.$slots, k.property, normalizeProps(guardReactiveProps(h2)), () => [
                createTextVNode(toDisplayString(h2[k.property]), 1)
              ], true)
            ], 10, Yr))), 128))
          ], 10, Kr))), 128))
        ])
      ], 2)
    ], 4),
    createBaseVNode("div", {
      class: normalizeClass(["grid-view__pagination", { "grid-view__pagination--top": t.topPagination }])
    }, [
      renderSlot(e.$slots, "pagination", {}, () => [
        createVNode(u, {
          options: t.itemPerPageOptions.map((h2) => ({ value: h2, label: h2 })),
          rules: [(h2) => h2.length > 0],
          "hide-placeholder-option": true,
          value: t.rowsPerPage,
          onInput: n.updateRows
        }, null, 8, ["options", "rules", "value", "onInput"]),
        createBaseVNode("div", Xr, toDisplayString(o.startRow + 1) + "-" + toDisplayString(n.itemMax) + " / " + toDisplayString(t.serverItemsLength || t.items.length), 1),
        createVNode(f, {
          disabled: o.startRow === 0,
          onClick: n.pageDown
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(t.labels.previousLabel), 1)
          ]),
          _: 1
        }, 8, ["disabled", "onClick"]),
        createVNode(f, {
          disabled: o.startRow + t.rowsPerPage >= (t.serverItemsLength || t.items.length),
          onClick: n.pageUp
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(t.labels.nextLabel), 1)
          ]),
          _: 1
        }, 8, ["disabled", "onClick"])
      ], true)
    ], 2)
  ], 34)), [
    [c, e.loading]
  ]);
}
const Qr = /* @__PURE__ */ O(Hr, [["render", Jr], ["__scopeId", "data-v-01dc774b"]]), Zr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Qr
}, Symbol.toStringTag, { value: "Module" })), ea = {
  name: "vu-icon-link",
  components: { VuIcon: H },
  mixins: [$t],
  props: {
    label: {
      type: String,
      default: () => ""
    },
    icon: {
      type: String,
      default: () => ""
    }
  },
  data: () => ({
    pressed: false
  })
}, ta = { class: "icon-link__link" };
function sa(e, s, t, i, o, n) {
  const r = resolveComponent("VuIcon");
  return openBlock(), createElementBlock("a", {
    class: normalizeClass(["vu-icon-link", { active: e.active }])
  }, [
    t.icon ? (openBlock(), createBlock(r, {
      key: 0,
      icon: t.icon,
      active: e.active
    }, null, 8, ["icon", "active"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      createTextVNode(" ")
    ], 64)),
    createBaseVNode("span", ta, [
      renderSlot(e.$slots, "default", {}, () => [
        createTextVNode(toDisplayString(t.label), 1)
      ], true)
    ])
  ], 2);
}
const Tt = /* @__PURE__ */ O(ea, [["render", sa], ["__scopeId", "data-v-fc65c3e7"]]), na = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tt
}, Symbol.toStringTag, { value: "Module" })), ia = {
  name: "vu-input-date",
  mixins: [Q, et, Ss, Z, ee, K],
  emits: ["update:modelValue"],
  components: { VuDatepicker: ws },
  props: {
    modelValue: {
      type: Date,
      default: () => null
    },
    contentClass: {
      type: String,
      default: () => ""
    },
    contentStyle: {
      type: [String, Object],
      default: () => ""
    },
    unselectableDaysOfWeek: {
      type: Array[Number],
      default: () => []
    },
    yearRange: {
      type: Number,
      default: () => 10
    },
    firstDay: {
      type: Number,
      default: () => 1
    },
    // input
    placeholder: {
      type: String,
      default: () => "Select a value"
    },
    // i18n
    dateFormatLocale: {
      type: String,
      default: () => "en"
    },
    dateFormatOptions: {
      type: Object,
      default: () => ({
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit"
      })
    },
    hideOnSelect: {
      type: Boolean,
      default: () => true
    },
    previousMonthLabel: {
      type: String,
      required: false,
      default: void 0
    },
    nextMonthLabel: {
      type: String,
      required: false,
      default: void 0
    },
    monthsLabels: {
      type: Array,
      required: false,
      default: () => {
      }
    },
    weekdaysLabels: {
      type: Array,
      required: false,
      default: () => {
      }
    },
    weekdaysShortLabels: {
      type: Array,
      required: false,
      default: () => {
      }
    },
    showWeekNumber: {
      type: Boolean,
      required: false
    },
    isRTL: {
      type: Boolean,
      required: false
    }
  },
  data: () => ({
    open: false,
    stringifedValue: ""
  }),
  computed: {
    date: {
      get() {
        return this.modelValue;
      },
      set(e) {
        this.$emit("update:modelValue", e);
      }
    },
    isEmpty() {
      return this.value === null || this.value === "" || this.value === void 0;
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler() {
        this.date ? this.stringifedValue = new Intl.DateTimeFormat(this.dateFormatLocale, this.dateFormatOptions).format(this.date) : this.stringifedValue = "";
      }
    }
  },
  methods: {
    click() {
      this.date = "";
    },
    handleSelect(e) {
      this.date = e, this.hideOnSelect && (this.open = false);
    }
  }
}, la = {
  key: 0,
  class: "control-label"
}, oa = {
  key: 0,
  class: "label-field-required"
}, ra = {
  ref: "activator",
  class: "input-date"
}, aa = ["value", "placeholder", "disabled"], ua = {
  key: 1,
  class: "form-control-helper-text"
};
function da(e, s, t, i, o, n) {
  const r = resolveComponent("VuDatepicker"), d = resolveDirective("click-outside");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["form-group", e.classes])
  }, [
    e.label.length ? (openBlock(), createElementBlock("label", la, [
      createTextVNode(toDisplayString(e.label), 1),
      e.required ? (openBlock(), createElementBlock("span", oa, " * ")) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    withDirectives((openBlock(), createElementBlock("div", ra, [
      createBaseVNode("input", {
        ref: "input",
        value: e.stringifedValue,
        placeholder: t.placeholder,
        disabled: e.disabled,
        readonly: "",
        type: "text",
        class: normalizeClass(["form-control input-date", { filled: !n.isEmpty }]),
        onClick: s[0] || (s[0] = (u) => {
          e.open = true;
        })
      }, null, 10, aa),
      e.clearable ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: "input-date-reset fonticon fonticon-clear",
        onClick: s[1] || (s[1] = (u) => n.click())
      })) : createCommentVNode("", true),
      createVNode(r, {
        style: normalizeStyle([{ position: "absolute", top: "38px" }, t.contentStyle]),
        class: normalizeClass(t.contentClass),
        modelValue: e.value,
        "onUpdate:modelValue": [
          s[2] || (s[2] = (u) => e.value = u),
          n.handleSelect
        ],
        show: e.open,
        min: e.min,
        max: e.max,
        "unselectable-days-of-week": t.unselectableDaysOfWeek,
        "year-range": t.yearRange,
        "first-day": t.firstDay,
        "show-week-number": t.showWeekNumber,
        "is-r-t-l": t.isRTL,
        "previous-month-label": t.previousMonthLabel,
        "next-month-label": t.nextMonthLabel,
        "months-labels": t.monthsLabels,
        "weekdays-labels": t.weekdaysLabels,
        "weekdays-short-labels": t.weekdaysShortLabels,
        onBoundaryChange: s[3] || (s[3] = (u) => n.date = u.value)
      }, null, 8, ["style", "class", "modelValue", "show", "min", "max", "unselectable-days-of-week", "year-range", "first-day", "show-week-number", "is-r-t-l", "previous-month-label", "next-month-label", "months-labels", "weekdays-labels", "weekdays-short-labels", "onUpdate:modelValue"])
    ])), [
      [d, function() {
        e.open = false;
      }]
    ]),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.errorBucket, (u, f) => (openBlock(), createElementBlock("span", {
      key: `${f}-error-${u}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, toDisplayString(u), 1))), 128)),
    e.helper.length ? (openBlock(), createElementBlock("span", ua, toDisplayString(e.helper), 1)) : createCommentVNode("", true)
  ], 2);
}
const ca = /* @__PURE__ */ O(ia, [["render", da], ["__scopeId", "data-v-bcad46d4"]]), ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ca
}, Symbol.toStringTag, { value: "Module" })), fa = {
  name: "vu-input-number",
  inheritAttrs: false,
  mixins: [Q, Z, ee, K],
  props: {
    step: {
      type: Number,
      default: () => 0.1
    },
    decimal: {
      type: Number,
      default: () => 2
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER
    },
    showButtons: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:modelValue"],
  methods: {
    input(e, s) {
      if (s && e === "" && this.value !== "") {
        this.$refs.input.value = this.value;
        return;
      }
      if (e === "" && s === "-" || s === "." || s === ",")
        return;
      let t = e !== "" ? this.parseValue(this.fixed(e)) : void 0;
      this.$emit("update:modelValue", t), this.$refs.input.value = this.value;
    },
    decrement() {
      let e = parseFloat(this.value);
      e = Number.isNaN(e) ? this.max : e, this.input(e - this.step);
    },
    increment() {
      let e = parseFloat(this.value);
      e = Number.isNaN(e) ? this.min : e, this.input(e + this.step);
    },
    parseValue(e) {
      const s = parseFloat(e);
      return s > this.max ? this.max : s < this.min ? this.min : s;
    },
    fixed(e) {
      return Math.round(e * 10 ** this.decimal) / 10 ** this.decimal;
    }
  }
}, ma = {
  key: 0,
  class: "control-label"
}, pa = {
  key: 0,
  class: "label-field-required"
}, ga = { class: "input-number" }, va = ["disabled"], ya = ["value", "placeholder", "disabled", "min", "max", "step"], ba = ["disabled"], _a = {
  key: 1,
  class: "form-control-helper-text"
};
function wa(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-number form-group", { ...e.classes, "vu-number--no-buttons": !t.showButtons }])
  }, [
    e.label.length ? (openBlock(), createElementBlock("label", ma, [
      createTextVNode(toDisplayString(e.label), 1),
      e.required ? (openBlock(), createElementBlock("span", pa, " *")) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    createBaseVNode("div", ga, [
      t.showButtons ? (openBlock(), createElementBlock("button", {
        key: 0,
        type: "button",
        disabled: e.disabled,
        class: "input-number-button input-number-button-left btn btn-default",
        onClick: s[0] || (s[0] = (...r) => n.decrement && n.decrement(...r))
      }, null, 8, va)) : createCommentVNode("", true),
      createBaseVNode("input", mergeProps(e.$attrs, {
        ref: "input",
        value: e.value,
        placeholder: e.placeholder,
        disabled: e.disabled,
        min: t.min,
        max: t.max,
        step: t.step,
        type: "number",
        class: "form-control",
        onKeypress: [
          s[1] || (s[1] = withKeys((...r) => n.increment && n.increment(...r), ["up"])),
          s[2] || (s[2] = withKeys((...r) => n.decrement && n.decrement(...r), ["down"]))
        ],
        onInput: s[3] || (s[3] = (r) => n.input(r.target.value, r.data))
      }), null, 16, ya),
      t.showButtons ? (openBlock(), createElementBlock("button", {
        key: 1,
        type: "button",
        disabled: e.disabled,
        class: "input-number-button input-number-button-right btn btn-default",
        onClick: s[4] || (s[4] = (...r) => n.increment && n.increment(...r))
      }, null, 8, ba)) : createCommentVNode("", true)
    ]),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.errorBucket, (r, d) => (openBlock(), createElementBlock("span", {
      key: `${d}-error-${r}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, toDisplayString(r), 1))), 128)),
    e.helper.length ? (openBlock(), createElementBlock("span", _a, toDisplayString(e.helper), 1)) : createCommentVNode("", true)
  ], 2);
}
const ka = /* @__PURE__ */ O(fa, [["render", wa], ["__scopeId", "data-v-9ec5f27e"]]), Sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ka
}, Symbol.toStringTag, { value: "Module" })), Ca = {
  name: "vu-input",
  inheritAttrs: false,
  inject: {
    vuInputComposition: {
      default: false
    }
  },
  mixins: [Q, Z, K, ee],
  emits: ["update:modelValue"]
}, Ia = {
  key: 0,
  class: "control-label"
}, Ba = {
  key: 0,
  class: "label-field-required"
}, Oa = ["value", "placeholder", "disabled", "type"], Va = {
  key: 1,
  class: "form-control-helper-text"
};
function $a(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["form-group", e.classes])
  }, [
    e.label.length ? (openBlock(), createElementBlock("label", Ia, [
      createTextVNode(toDisplayString(e.label), 1),
      e.required ? (openBlock(), createElementBlock("span", Ba, " *")) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    createBaseVNode("input", mergeProps(e.$attrs, {
      value: e.value,
      placeholder: e.placeholder,
      disabled: e.disabled,
      type: e.type,
      class: "form-control",
      onInput: s[0] || (s[0] = ({ target: r }) => {
        n.vuInputComposition || (r.composing = false), e.$emit("update:modelValue", r.value);
      })
    }), null, 16, Oa),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.errorBucket, (r, d) => (openBlock(), createElementBlock("span", {
      key: `${d}-error-${r}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, toDisplayString(r), 1))), 128)),
    e.helper.length ? (openBlock(), createElementBlock("span", Va, toDisplayString(e.helper), 1)) : createCommentVNode("", true)
  ], 2);
}
const Is = /* @__PURE__ */ O(Ca, [["render", $a], ["__scopeId", "data-v-5ebc6ce9"]]), xa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Is
}, Symbol.toStringTag, { value: "Module" })), Bs = (e) => typeof e != "string" ? "" : e.charAt(0).toUpperCase() + e.slice(1), Ma = {
  name: "vu-lightbox-bar",
  emits: ["close", "click-comment", "click-download", "click-information", "click-share", "media-type-drag-start", "media-type-drag", "media-type-drag-end", "click-compass"],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    showCloseIcon: { default: () => true },
    // eslint-disable-next-line vue/require-prop-types
    showCompass: { default: () => true },
    label: {
      type: String,
      default: () => ""
    },
    type: {
      type: Object,
      default: () => {
      }
    },
    items: {
      type: Array,
      default: () => []
    },
    customItems: {
      type: Array,
      default: () => []
    },
    subItems: {
      type: Array,
      default: () => []
    },
    rightItems: {
      type: Array,
      default: () => []
    },
    responsive: {
      type: Boolean,
      default: () => false
    },
    widget: {
      type: Boolean,
      default: () => false
    },
    moreActionsLabel: {
      type: String,
      default: () => "More"
    },
    disableCompass: {
      type: Boolean,
      required: true
    },
    closeLabel: {
      type: String,
      default: () => "Close"
    },
    dropdownOverlay: Boolean,
    /* eslint-disable vue/require-default-prop */
    onMediaTypeDragStart: Function,
    onMediaTypeDrag: Function,
    onMediaTypeDragEnd: Function
  },
  data: () => ({
    getListenersFromAttrs: ce,
    capitalize: Bs,
    uid: be()
  }),
  computed: {
    menuIcon() {
      return this.responsive ? "menu-dot" : "chevron-down";
    },
    hasLeftToDividerContent() {
      return this.items.length > 0 && this.items.some((e) => !e.hidden) || this._dropdownMenuItems.length > 0 || this.$slots["lightbox-bar__special-actions"];
    },
    hasRightToDividerContent() {
      return this.showCloseIcon || this.rightItems && this.rightItems.length > 0 && this.rightItems.some((e) => !e.hidden);
    },
    hasDragEvent() {
      return this.onMediaTypeDragStart || this.onMediaTypeDrag || this.onMediaTypeDragEnd;
    },
    _items() {
      return this.actionsMergeSubs(this.items, this.customItems);
    },
    dropdownMenuListeners() {
      const e = this.getListenersFromAttrs(this.$attrs);
      if (e.close) {
        const s = { ...e };
        return delete s.close, s;
      }
      return e;
    },
    _dropdownMenuItems() {
      if (this.responsive) {
        const e = this._items.filter(({ nonResponsive: s, hidden: t }) => !s && !t);
        return this.subItems && this.subItems.length > 0 && e.push({
          name: "more-actions",
          label: this.moreActionsLabel,
          items: this.subItems
        }), e;
      }
      return this.subItems;
    }
  },
  methods: {
    icon(e) {
      return e.icon ? `${e.icon}` : `${e.fonticon}`;
    },
    actionClick(e, s = "primary-action") {
      e.disabled || (e.handler && e.handler(e), this.$emit(`click-${e.name.toLowerCase()}`, e, { type: s }));
    },
    actionsMergeSubs(e, s) {
      const t = s.filter(({ name: n }) => e.find(({ name: r }) => n === r)), i = s.filter(({ name: n }) => !t.find(({ name: r }) => n === r));
      e.forEach(({ name: n, items: r }) => {
        const d = t.find(({ name: u }) => u === n);
        if (d) {
          const { items: u } = d;
          u && (Array.isArray(r) || (r = []), r.push(...u));
        }
      });
      let o = [...e, ...i];
      return o = o.map((n) => {
        if (n.text === void 0) {
          const r = this.capitalize(n.name);
          n.text = r;
        }
        return n;
      }), o;
    },
    selectedItemsArray(e) {
      return this.customItems ? this.getSelectedItems(e) : [];
    },
    getSelectedItems(e) {
      let s = [];
      return Array.isArray(e) && e.forEach((t) => {
        if (t.items) {
          const i = this.getSelectedItems(t);
          s = [s, ...i];
        }
      }), s.filter((t) => t.selected);
    }
  },
  components: { VuIconBtn: U, VuDropdownMenu: Ce }
}, Os = (e) => (pushScopeId("data-v-5e131de1"), e = e(), popScopeId(), e), Pa = { class: "lightbox-bar__left" }, La = /* @__PURE__ */ Os(() => /* @__PURE__ */ createBaseVNode("div", { class: "lightbox-bar__compass-active" }, null, -1)), Ta = [
  La
], Aa = { class: "lightbox-bar-menu-item lightbox-bar-menu-item--no-cursor" }, Fa = ["draggable"], Da = { class: "lightbox-bar__title" }, za = { class: "lightbox-bar__right" }, Na = { class: "lightbox-bar__menu" }, Ea = {
  key: 2,
  class: "lightbox-bar__divider"
}, ja = /* @__PURE__ */ Os(() => /* @__PURE__ */ createBaseVNode("hr", { class: "divider divider--vertical" }, null, -1)), Ra = [
  ja
];
function Ua(e, s, t, i, o, n) {
  const r = resolveComponent("VuIconBtn"), d = resolveComponent("VuDropdownMenu"), u = resolveDirective("tooltip");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-lightbox-bar", {
      "lightbox-bar--responsive": t.responsive,
      "lightbox-bar--widget-header": t.widget
    }])
  }, [
    createBaseVNode("div", Pa, [
      t.showCompass && !t.widget ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["lightbox-bar__compass", { "lightbox-bar__compass--disabled": t.disableCompass }]),
        onClick: s[0] || (s[0] = (f) => e.$emit("click-compass"))
      }, Ta, 2)) : createCommentVNode("", true),
      renderSlot(e.$slots, "lightbox-bar__object-type", {}, () => [
        createBaseVNode("div", Aa, [
          createBaseVNode("div", {
            class: "lightbox-bar__media-type",
            style: normalizeStyle({ "background-color": t.type.backgroundColor }),
            onDragstart: s[1] || (s[1] = (f) => e.$emit("media-type-drag-start", f)),
            onDrag: s[2] || (s[2] = (f) => e.$emit("media-type-drag", f)),
            onDragend: s[3] || (s[3] = (f) => e.$emit("media-type-drag-end", f)),
            draggable: n.hasDragEvent ? "true" : "false"
          }, [
            createBaseVNode("span", {
              class: normalizeClass(`fonticon fonticon-${t.type.icon}`)
            }, null, 2)
          ], 44, Fa)
        ])
      ], true),
      createBaseVNode("div", Da, [
        renderSlot(e.$slots, "lightbox-bar__title", {}, () => [
          createBaseVNode("span", null, toDisplayString(t.label), 1)
        ], true)
      ])
    ]),
    createBaseVNode("div", za, [
      createBaseVNode("div", Na, [
        t.responsive ? createCommentVNode("", true) : (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(n._items, (f, c) => (openBlock(), createElementBlock(Fragment, {
          key: `${e.uid}-${c}-rm`
        }, [
          f.items && !f.hidden ? (openBlock(), createBlock(d, mergeProps({
            "v-model": n.selectedItemsArray(n._items),
            key: `lightbox-dropdownmenu_${e.uid}-${c}`,
            items: f.items,
            shift: true,
            disabled: f.disabled
          }, { overlay: t.dropdownOverlay }, { class: "lightbox-bar-dropdown-wrap" }, toHandlers(n.dropdownMenuListeners)), {
            default: withCtx(({ active: h2 }) => [
              withDirectives(createVNode(r, {
                icon: n.icon(f),
                active: f.selected || h2,
                disabled: f.disabled,
                color: t.widget ? "default" : "secondary",
                class: "lightbox-bar-menu-item",
                onClick: () => n.actionClick(f)
              }, null, 8, ["icon", "active", "disabled", "color", "onClick"]), [
                [
                  u,
                  `${f.label || e.capitalize(f.name)}`,
                  void 0,
                  {
                    body: true,
                    bottom: true
                  }
                ]
              ])
            ]),
            _: 2
          }, 1040, ["v-model", "items", "disabled"])) : f.hidden ? createCommentVNode("", true) : withDirectives((openBlock(), createBlock(r, {
            key: 1,
            icon: n.icon(f),
            active: f.selected,
            disabled: f.disabled,
            color: t.widget ? "default" : "secondary",
            class: "lightbox-bar-menu-item",
            onClick: () => n.actionClick(f)
          }, null, 8, ["icon", "active", "disabled", "color", "onClick"])), [
            [
              u,
              `${f.label || e.capitalize(f.name)}`,
              void 0,
              {
                body: true,
                bottom: true
              }
            ]
          ])
        ], 64))), 128)),
        n._dropdownMenuItems.length > 0 ? (openBlock(), createBlock(d, mergeProps({
          key: 1,
          "v-model": n.selectedItemsArray(n._dropdownMenuItems),
          class: "lightbox-bar-dropdown-wrap",
          "prevent-dropup": true,
          items: n._dropdownMenuItems,
          position: "bottom-left",
          shift: true
        }, { overlay: t.dropdownOverlay }, toHandlers(n.dropdownMenuListeners)), {
          default: withCtx(({ active: f }) => [
            withDirectives(createVNode(r, {
              icon: n.menuIcon,
              active: f,
              color: t.widget ? "default" : "secondary",
              class: normalizeClass(["lightbox-bar-menu-item", t.responsive ? "" : "chevron-menu-icon"])
            }, null, 8, ["icon", "active", "color", "class"]), [
              [
                u,
                `${t.moreActionsLabel}`,
                void 0,
                {
                  body: true,
                  bottom: true
                }
              ]
            ])
          ]),
          _: 1
        }, 16, ["v-model", "items"])) : createCommentVNode("", true),
        renderSlot(e.$slots, "lightbox-bar__special-actions", {}, void 0, true),
        n.hasLeftToDividerContent && n.hasRightToDividerContent ? (openBlock(), createElementBlock("div", Ea, Ra)) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(t.rightItems, (f, c) => (openBlock(), createElementBlock(Fragment, null, [
          f.hidden ? createCommentVNode("", true) : withDirectives((openBlock(), createBlock(r, {
            key: `${e.uid}-sa-${c}`,
            class: "lightbox-bar-menu-item",
            color: t.widget ? "default" : "secondary",
            icon: n.icon(f),
            active: f.selected,
            disabled: f.disabled,
            onClick: (h2) => n.actionClick(f, "side-action")
          }, null, 8, ["color", "icon", "active", "disabled", "onClick"])), [
            [
              u,
              `${f.label || e.capitalize(f.name)}`,
              void 0,
              {
                body: true,
                bottom: true
              }
            ]
          ])
        ], 64))), 256)),
        t.showCloseIcon ? withDirectives((openBlock(), createBlock(r, {
          key: 3,
          class: "lightbox-bar-menu-item",
          color: t.widget ? "default" : "secondary",
          icon: "close",
          onClick: s[4] || (s[4] = (f) => e.$emit("close", false))
        }, null, 8, ["color"])), [
          [
            u,
            t.closeLabel,
            void 0,
            {
              body: true,
              bottom: true
            }
          ]
        ]) : createCommentVNode("", true)
      ])
    ])
  ], 2);
}
const Vs = /* @__PURE__ */ O(Ma, [["render", Ua], ["__scopeId", "data-v-5e131de1"]]), Ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Vs
}, Symbol.toStringTag, { value: "Module" })), Kt = {
  picture: {
    id: 1,
    icon: "picture",
    backgroundColor: "#70036b"
    // $violet-dv-1
  },
  audio: {
    id: 2,
    icon: "sound",
    backgroundColor: "#70036b"
    // $violet-dv-1
  },
  video: {
    id: 3,
    icon: "video",
    backgroundColor: "#70036b"
    // $violet-dv-1
  },
  "3dmodel": {
    id: 4,
    icon: "3d-object",
    backgroundColor: "#70036b"
    // $violet-dv-1
  },
  document: {
    id: 5,
    icon: "doc",
    backgroundColor: "#70036b"
    // $violet-dv-1
  }
}, Gt = [
  {
    name: "comment",
    fonticon: "topbar-comment",
    disabled: false,
    hidden: false
  },
  {
    name: "share",
    fonticon: "share-alt",
    disabled: false,
    hidden: false
  },
  {
    name: "download",
    fonticon: "download",
    disabled: false,
    hidden: false
  },
  {
    name: "information",
    fonticon: "topbar-info",
    disabled: false,
    hidden: false
  }
], Yt = [
  {
    name: "previous",
    fonticon: "chevron-left",
    selected: false,
    disabled: false,
    hidden: false
  },
  {
    name: "next",
    fonticon: "chevron-right",
    selected: false,
    disabled: false,
    hidden: false
  }
], qa = {
  name: "vu-lightbox",
  components: { VuLightboxBar: Vs, VuIconBtn: U, VuIconBtn: U },
  data() {
    return {
      panelStates: [],
      openCompass: false,
      compassAlreadyOpened: false,
      compassPath: "webapps/i3DXCompassStandalone/i3DXCompassStandalone.html",
      resizeObserver: {},
      transforms: {
        responsive: false,
        left: {},
        center: {},
        right: {}
      },
      capitalize: Bs,
      customItems: [],
      getListenersFromAttrs: ce,
      uid: be()
    };
  },
  emits: ["close", "click-comment", "click-information", "click-share", "click-download", "media-type-drag-start", "media-type-drag", "media-type-drag-end", "click-compass"],
  props: {
    title: {
      type: String,
      default: () => ""
    },
    // eslint-disable-next-line vue/require-default-prop
    userId: {
      type: String,
      required: false
    },
    panels: {
      type: Array,
      required: false,
      default: () => [{}]
    },
    widget: {
      type: Boolean,
      default: () => false
    },
    objectType: {
      type: [String, Object],
      default: () => "picture",
      validator: (e) => !!Kt[e] || e && e.icon && e.backgroundColor
    },
    primaryActions: {
      type: [Array, String],
      default: () => Gt
    },
    customActions: {
      type: Boolean,
      default: () => false
    },
    menuActions: {
      type: Array,
      required: false,
      default: () => []
    },
    sideActions: {
      type: Array,
      default: () => Yt
    },
    customSideActions: {
      type: Boolean,
      default: () => false
    },
    noObjectType: {
      type: Boolean,
      default: () => false
    },
    disableCompass: {
      type: Boolean,
      default: () => false
    },
    zIndex: {
      type: Number,
      default: () => 100
    },
    moreActionsLabel: {
      type: String,
      default: () => "More"
    },
    closeLabel: {
      type: String,
      default: () => "Close"
    },
    noAnimation: {
      type: Boolean,
      default: () => false
    },
    fasterAnimation: {
      type: Boolean,
      default: () => false
    },
    hideCloseIcon: {
      type: Boolean,
      default: () => false
    },
    dropdownOverlay: Boolean,
    /* eslint-disable vue/prop-name-casing, vue/require-default-prop */
    onClose: Function,
    "onClick-comment": Function,
    "onClick-download": Function,
    "onClick-information": Function,
    "onClick-share": Function,
    "onMedia-type-drag-start": Function,
    "onMedia-type-drag": Function,
    "onMedia-type-drag-end": Function
  },
  created() {
    this.panels.find(({ show: e }) => e !== void 0) || (this.panelStates = this.panels.map((e) => ({ ...e, show: false })));
  },
  computed: {
    typeInfo() {
      return typeof this.objectType == "object" ? this.objectType : Kt[this.objectType];
    },
    compassIframeUrl() {
      return `${this.serviceUrl || ""}/${this.compassPath}${this.userId ? `#userId:${this.userId}` : ""}`;
    },
    listeners() {
      return ce(this.$attrs, true);
    },
    listenersFromProps() {
      return this.getListenersFromAttrs(this.$props, true);
    },
    _panels() {
      return this.panelStates.length > 0 ? this.panelStates : this.panels;
    },
    showRightPanel() {
      return this._panels.find(({ show: e }) => e);
    },
    noCompass() {
      return this.widget;
    },
    _primaryActions() {
      const e = this.primaryActions, s = Gt;
      if (this.widget) {
        const t = e.find(({ name: o }) => o === "information"), i = e.find(({ name: o }) => o === "comment");
        t && !t.fonticon && (s.find(({ name: o }) => o === "information").fonticon = "info"), i && !i.fonticon && (s.find(({ name: o }) => o === "comment").fonticon = "comment");
      }
      return this.actionsMerge(e, s, this.customActions);
    },
    _sideActions() {
      return this.actionsMerge(this.sideActions, Yt, this.customSideActions);
    }
  },
  mounted() {
    this.onResize();
    const e = new ResizeObserver(() => {
      this.onResize();
    });
    e.observe(this.$refs.lightbox), this.resizeObserver = e;
    const s = this;
    !this.noCompass && window && window.require && window.require(["DS/UWPClientCode/Data/Utils", "DS/UWPClientCode/PublicAPI"], (t, i) => {
      this.getCompassUrl = () => {
        t.getServiceUrl({
          serviceName: "3DCompass",
          onComplete: (o) => {
            s.serviceUrl = o;
          },
          onFailure: () => {
            UWA && UWA.debug && console.error("Lightbox Compass failed to retrieve 3DCompass service url");
          },
          scope: s
        });
      }, this.userId ? this.getCompassUrl() : i.getCurrentUser().then(
        ({ login: o }) => {
          s.userId = o, this.getCompassUrl();
        },
        // eslint-disable-next-line comma-dangle
        () => this.getCompassUrl()
      );
    });
  },
  watch: {
    openCompass() {
      this.onResize();
    },
    showRightPanel() {
      this.onResize();
    }
  },
  methods: {
    addCustomAction(e) {
      const s = this.customItems.find(({ name: t }) => t === e.name);
      s ? this.customItems[this.customItems.indexOf(s)] = e : this.customItems.push(e);
    },
    clearCustomActions() {
      this.customItems = [];
    },
    showPanel(e, s = true) {
      if (!this.panelStates.length)
        return;
      s && this.hideAllPanels(e);
      const t = this.panelStates.find(({ name: i }) => e === i);
      t.show = true;
    },
    hidePanel(e) {
      if (!this.panelStates.length)
        return;
      const s = this.panelStates.find(({ name: t }) => e === t);
      s.show = false;
    },
    // eslint-disable-next-line no-unused-vars
    hideAllPanels(e = "") {
      this.panelStates.length && this.panelStates.filter(({ name: s }) => s !== e).forEach((s) => {
        s.show = false;
      });
    },
    actionsMerge(e, s, t) {
      let i = e;
      return t || (i = e.slice(0, s.length).filter(({ name: o }) => s.find(({ name: n }) => o === n)), i = i.map((o) => ({
        // If component user messes up order \o/
        ...s.find(({ name: n }) => o.name === n),
        ...o
      }))), i = i.map((o) => {
        if (o.text === void 0) {
          const n = this.capitalize(o.name);
          o.text = n;
        }
        return o;
      }), i;
    },
    onResize() {
      const { clientWidth: e } = this.$refs.lightbox;
      let s;
      if (e > 639) {
        const t = Math.min(e * 0.125 + 240, 480);
        s = {
          responsive: false,
          left: {
            width: `${t}px`
          },
          center: {
            "margin-left": this.openCompass ? `${t}px` : 0,
            "margin-right": this.showRightPanel ? `${t}px` : 0
          },
          right: {
            width: `${t}px`
          }
        };
      } else
        s = { responsive: true, center: {}, right: {} };
      this.transforms = s;
    }
  },
  beforeUnmount() {
    this.resizeObserver && this.resizeObserver.disconnect(), delete this.resizeObserver;
  }
}, Wa = (e) => (pushScopeId("data-v-482bad5e"), e = e(), popScopeId(), e), Ka = ["data-id"], Ga = /* @__PURE__ */ Wa(() => /* @__PURE__ */ createBaseVNode("div", { class: "lightbox__overlay" }, null, -1)), Ya = ["src"], Xa = {
  key: 0,
  class: "panel__header"
}, Ja = { class: "panel__title" }, Qa = { class: "panel__title__text" };
function Za(e, s, t, i, o, n) {
  const r = resolveComponent("VuLightboxBar"), d = resolveComponent("VuIconBtn");
  return openBlock(), createElementBlock("div", null, [
    renderSlot(e.$slots, "lightbox-activator", {}, void 0, true),
    createBaseVNode("div", {
      ref: "lightbox",
      class: normalizeClass(["vu-lightbox", {
        "lightbox--responsive": o.transforms.responsive,
        "lightbox--widget-header": t.widget,
        "vu-lightbox--appear-faster": !t.widget && !t.noAnimation && t.fasterAnimation,
        "vu-lightbox--appear-fast": !t.widget && !t.noAnimation && !t.fasterAnimation
      }]),
      style: normalizeStyle({
        zIndex: t.zIndex
      }),
      "data-id": o.uid
    }, [
      createVNode(r, mergeProps({
        label: t.title,
        "show-compass": !n.noCompass,
        class: { "lightbox-bar--compass-open": o.openCompass },
        type: n.typeInfo,
        items: n._primaryActions,
        "sub-items": t.menuActions,
        "right-items": n._sideActions,
        responsive: o.transforms.responsive
      }, toHandlers({ ...n.listeners, ...n.listenersFromProps }), { disableCompass: t.disableCompass, customItems: o.customItems, dropdownOverlay: t.dropdownOverlay, widget: t.widget, moreActionsLabel: t.moreActionsLabel, closeLabel: t.closeLabel }, {
        onClickCompass: s[0] || (s[0] = () => {
          t.disableCompass || (o.openCompass = !o.openCompass, o.compassAlreadyOpened = true), e.$emit("click-compass", o.openCompass);
        })
      }), {
        "lightbox-bar__object-type": withCtx((u) => [
          renderSlot(e.$slots, "lightbox-bar__object-type", normalizeProps(guardReactiveProps(u)), void 0, true)
        ]),
        "lightbox-bar__title": withCtx((u) => [
          renderSlot(e.$slots, "lightbox-bar__title", normalizeProps(guardReactiveProps(u)), void 0, true)
        ]),
        "lightbox-bar__special-actions": withCtx(() => [
          renderSlot(e.$slots, "lightbox-bar__special-actions", {}, void 0, true)
        ]),
        _: 3
      }, 16, ["label", "show-compass", "class", "type", "items", "sub-items", "right-items", "responsive"]),
      Ga,
      createBaseVNode("div", {
        class: "lightbox__content",
        ref: "content",
        style: normalizeStyle(o.transforms.center || {})
      }, [
        renderSlot(e.$slots, "lightbox-content", {}, void 0, true)
      ], 4),
      !n.noCompass && o.compassAlreadyOpened ? withDirectives((openBlock(), createElementBlock("div", {
        key: 0,
        class: "vu-panel lightbox__panel lightbox__panel--left column",
        style: normalizeStyle(o.transforms.left || {})
      }, [
        createBaseVNode("iframe", {
          class: "compass",
          src: n.compassIframeUrl
        }, null, 8, Ya),
        o.transforms.responsive ? (openBlock(), createBlock(d, {
          key: 0,
          icon: "close",
          style: { position: "absolute", right: "0", top: "0", zindex: "21" },
          onClick: s[1] || (s[1] = (u) => o.openCompass = false)
        })) : createCommentVNode("", true)
      ], 4)), [
        [vShow, o.openCompass]
      ]) : createCommentVNode("", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(n._panels, ({ name: u, show: f, showClose: c = false, showEdit: h2, classes: v = [], title: k }, w) => withDirectives((openBlock(), createElementBlock("div", {
        key: `${o.uid}-${w}`,
        class: normalizeClass(["vu-panel lightbox__panel column", [...v, "lightbox__panel--right", { "panel--responsive": o.transforms.responsive }]]),
        style: normalizeStyle(o.transforms.right)
      }, [
        k ? (openBlock(), createElementBlock("div", Xa, [
          createBaseVNode("span", Ja, [
            createBaseVNode("span", Qa, toDisplayString(k), 1),
            h2 ? (openBlock(), createBlock(d, {
              key: 0,
              class: "panel__edit__icon",
              icon: "pencil",
              onClick: (T) => e.$emit(`panel-edit-${u}`)
            }, null, 8, ["onClick"])) : createCommentVNode("", true)
          ]),
          c ? (openBlock(), createBlock(d, {
            key: 0,
            class: "panel__close_icon",
            icon: "close",
            onClick: (T) => e.$emit(`close-panel-${u}`)
          }, null, 8, ["onClick"])) : createCommentVNode("", true)
        ])) : o.transforms.responsive || c ? (openBlock(), createBlock(d, {
          key: 1,
          class: "panel__close_icon",
          icon: "close",
          onClick: (T) => e.$emit(`close-panel-${u}`)
        }, null, 8, ["onClick"])) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: normalizeClass([`vu-dynamic-panel-wrap-${u}`, "panel__content"])
        }, [
          renderSlot(e.$slots, `lightbox-panel-${u}`, {}, void 0, true)
        ], 2)
      ], 6)), [
        [vShow, f]
      ])), 128))
    ], 14, Ka)
  ]);
}
const eu = /* @__PURE__ */ O(qa, [["render", Za], ["__scopeId", "data-v-482bad5e"]]), tu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: eu
}, Symbol.toStringTag, { value: "Module" })), su = {
  name: "vu-media-upload-droppable",
  props: {
    isOver: {
      type: Boolean
    },
    validDrop: {
      type: Boolean
    }
  },
  emits: ["drop"],
  inject: {
    vuMediaUploadDropText: {
      default: "Drop your files to upload"
    }
  },
  computed: {
    classes() {
      return {
        "vu-media-upload-droppable--valid": this.validDrop
      };
    }
  },
  mounted() {
  },
  beforeUnmount() {
  },
  methods: {},
  components: { VuIcon: H }
}, nu = { class: "vu-media-upload-droppable__icon" }, iu = { class: "vu-media-upload-droppable__label" };
function lu(e, s, t, i, o, n) {
  const r = resolveComponent("VuIcon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-media-upload-droppable", n.classes]),
    onDrop: s[0] || (s[0] = withModifiers((d) => e.$emit("drop", d), ["prevent", "stop"]))
  }, [
    renderSlot(e.$slots, "drop-main", {}, () => [
      createBaseVNode("div", nu, [
        createVNode(r, {
          icon: "up",
          color: "none"
        })
      ])
    ]),
    renderSlot(e.$slots, "drop-alt", {}, () => [
      createBaseVNode("span", iu, toDisplayString(n.vuMediaUploadDropText), 1)
    ])
  ], 34);
}
const $s = /* @__PURE__ */ O(su, [["render", lu]]), ou = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $s
}, Symbol.toStringTag, { value: "Module" })), ru = {
  name: "vu-media-upload-empty",
  components: { VuIcon: H, VuBtn: ae, VuIconLink: Tt },
  props: {
    rich: {
      // default: true,
      type: Boolean
    }
  },
  emits: ["browse"],
  inject: {
    vuMediaUploadPlaceholderLong: {
      default: "Drag & Drop files here"
    },
    vuMediaUploadPlaceholder: {
      default: "Drag & Drop or"
    },
    vuMediaUploadOR: {
      default: "or"
    },
    vuMediaUploadBrowse: {
      default: "Browse Files"
    }
  }
}, au = { class: "vu-media-upload-empty" }, uu = { class: "vu-media-upload-empty__OR" }, du = { key: 1 };
function cu(e, s, t, i, o, n) {
  const r = resolveComponent("VuIcon"), d = resolveComponent("VuBtn"), u = resolveComponent("VuIconLink");
  return openBlock(), createElementBlock("div", au, [
    createVNode(r, { icon: "drag-drop" }),
    t.rich ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      createBaseVNode("span", null, toDisplayString(n.vuMediaUploadPlaceholderLong), 1),
      createBaseVNode("span", uu, toDisplayString(n.vuMediaUploadOR), 1),
      createVNode(d, {
        onClick: s[0] || (s[0] = (f) => e.$emit("browse")),
        color: "primary"
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(n.vuMediaUploadBrowse), 1)
        ]),
        _: 1
      })
    ], 64)) : (openBlock(), createElementBlock("div", du, [
      createTextVNode(toDisplayString(n.vuMediaUploadPlaceholder), 1),
      createVNode(u, {
        onClick: s[1] || (s[1] = (f) => e.$emit("browse"))
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(n.vuMediaUploadBrowse), 1)
        ]),
        _: 1
      })
    ]))
  ]);
}
const xs = /* @__PURE__ */ O(ru, [["render", cu], ["__scopeId", "data-v-4e3fec0a"]]), hu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xs
}, Symbol.toStringTag, { value: "Module" })), fu = {
  name: "vu-media-upload-error",
  inject: {
    vuMediaUploadRetry: {
      default: "Retry"
    }
  },
  emits: ["retry"],
  props: {
    icon: {
      type: String,
      default: "attention"
    },
    // eslint-disable-next-line vue/require-prop-types
    errorBucket: {
      default: () => []
    }
  },
  components: { VuIconBtn: U, VuBtn: ae }
}, mu = { class: "vu-media-upload-error" };
function pu(e, s, t, i, o, n) {
  const r = resolveComponent("VuIconBtn"), d = resolveComponent("VuBtn");
  return openBlock(), createElementBlock("div", mu, [
    createVNode(r, {
      icon: t.icon,
      class: "vu-media-upload-error__icon"
    }, null, 8, ["icon"]),
    (openBlock(true), createElementBlock(Fragment, null, renderList(t.errorBucket, (u, f) => (openBlock(), createElementBlock("span", {
      class: "vu-media-upload-error__error_label",
      key: f
    }, toDisplayString(u), 1))), 128)),
    createVNode(d, {
      onClick: s[0] || (s[0] = (u) => e.$emit("retry")),
      class: "vu-media-upload-error__retry",
      small: ""
    }, {
      default: withCtx(() => [
        createTextVNode(toDisplayString(n.vuMediaUploadRetry), 1)
      ]),
      _: 1
    })
  ]);
}
const Ms = /* @__PURE__ */ O(fu, [["render", pu], ["__scopeId", "data-v-ba65e06d"]]), gu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ms
}, Symbol.toStringTag, { value: "Module" })), vu = {
  name: "vu-progress-circular",
  mixins: [Te],
  data() {
    return {
      progressAngle: this.value / this.total * 100 * 3.6,
      intervalId: null,
      completedView: this.value >= this.total
    };
  },
  props: {
    value: {
      default: 0,
      type: Number
    },
    total: {
      default: 100,
      type: Number
    },
    radius: {
      default: 60,
      type: Number
    },
    noHatch: {
      default: false,
      type: Boolean
    },
    unfilledColor: {
      type: String,
      default: "#d1d4d4"
      // $grey-4
    },
    color: {
      type: String,
      default: () => "default",
      validator(e) {
        return ["default", "success", "warning", "error"].includes(e);
      }
    },
    hexColor: {
      type: String,
      required: false,
      default: ""
    },
    speedModifier: {
      type: Number,
      default: 1
    }
  },
  watch: {
    total() {
      this.animateProgress();
    },
    value() {
      this.animateProgress();
    }
  },
  computed: {
    radiusPx() {
      return `${this.radius}px`;
    },
    formattedCompletedCount() {
      return this.value < this.total ? this.value : this.total;
    },
    progressPercentage() {
      return this.value / this.total * 100;
    },
    renderHatch() {
      return !this.noHatch && this.value < this.total;
    }
  },
  methods: {
    updateAngle(e) {
      this.completedView = false;
      const s = Math.abs(this.progressAngle - e);
      Math.round(this.progressAngle) < Math.round(e) ? s <= this.speedModifier ? this.progressAngle = e : this.progressAngle += this.speedModifier : Math.round(this.progressAngle) > Math.round(e) ? s <= this.speedModifier ? this.progressAngle = e : this.progressAngle -= this.speedModifier : (clearInterval(this.intervalId), this.value >= this.total && (this.completedView = true));
    },
    animateProgress() {
      this.intervalId && clearInterval(this.intervalId);
      const e = this.progressPercentage * 3.6;
      this.intervalId = setInterval(this.updateAngle.bind(this, e), 5);
    }
  },
  beforeUnmount() {
    this.intervalId && clearInterval(this.intervalId);
  }
}, yu = { class: "vu-progress-circular" }, bu = { class: "vu-progress-circular__content" };
function _u(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", yu, [
    createBaseVNode("div", {
      class: normalizeClass(["vu-progress-circular__circle", t.hexColor ? "" : `vu-progress-circular--${t.color}`]),
      style: normalizeStyle({
        background: `conic-gradient( currentcolor ${o.progressAngle}deg, ${t.unfilledColor} ${o.progressAngle}deg)`,
        width: n.radiusPx,
        height: n.radiusPx,
        color: t.hexColor !== void 0 && t.hexColor,
        "-webkit-mask": `radial-gradient(${t.radius * (2 / 5)}px, #0000 98%, #000)`
      })
    }, [
      n.renderHatch ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["vu-progress-circular__hatch-container", { "vu-progress-circular__hatch-clip": o.progressAngle < 180 }])
      }, [
        createBaseVNode("div", {
          class: "vu-progress-circular__hatch",
          style: normalizeStyle(`transform: rotate(${o.progressAngle}deg)`)
        }, null, 4)
      ], 2)) : createCommentVNode("", true)
    ], 6),
    createBaseVNode("div", bu, [
      o.completedView && this.$slots.complete ? renderSlot(e.$slots, "complete", { key: 0 }, void 0, true) : renderSlot(e.$slots, "default", { key: 1 }, () => [
        createVNode(Transition, {
          name: "fade",
          mode: "out-in"
        }, {
          default: withCtx(() => [
            createBaseVNode("div", {
              key: "uncomplete-view",
              style: normalizeStyle({ fontSize: `${t.radius / 5}px` })
            }, toDisplayString(Math.round(o.progressAngle / 360 * 100)) + "% ", 5)
          ]),
          _: 1
        })
      ], true)
    ])
  ]);
}
const Ps = /* @__PURE__ */ O(vu, [["render", _u], ["__scopeId", "data-v-f8e9018e"]]), wu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ps
}, Symbol.toStringTag, { value: "Module" })), ku = {
  name: "vu-media-upload-loading",
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  inject: {
    vuMediaUploadAbortButton: {
      default: "Abort"
    }
  },
  emits: ["upload-abort"],
  components: { VuProgressCircular: Ps, VuBtn: ae }
}, Su = { class: "vu-media-upload-loading" };
function Cu(e, s, t, i, o, n) {
  const r = resolveComponent("VuProgressCircular"), d = resolveComponent("VuBtn");
  return openBlock(), createElementBlock("div", Su, [
    createVNode(r, { value: t.progress }, null, 8, ["value"]),
    createVNode(d, {
      color: "default",
      onClick: s[0] || (s[0] = (u) => e.$emit("upload-abort")),
      small: "",
      class: "vu-media-upload-loading__abort"
    }, {
      default: withCtx(() => [
        createTextVNode(toDisplayString(n.vuMediaUploadAbortButton), 1)
      ]),
      _: 1
    })
  ]);
}
const Ls = /* @__PURE__ */ O(ku, [["render", Cu], ["__scopeId", "data-v-beb3b627"]]), Iu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ls
}, Symbol.toStringTag, { value: "Module" })), Bu = {
  name: "vu-media-upload-preview",
  computed: {
    videoSizer() {
      var i;
      const [e, s] = (i = this.displayRatio) == null ? void 0 : i.replace(",", "").split("/"), t = Number(e) / Number(s);
      return t ? { paddingBottom: `${1 / t * 100}%` } : void 0;
    }
  },
  props: {
    deleteIcon: {
      type: String,
      default: () => "trash"
    },
    src: {
      type: String,
      required: true
    },
    isVideo: {
      type: Boolean
    },
    videoControls: {
      type: Boolean,
      required: false
    },
    displayRatio: {
      type: String,
      default: () => "16 / 9"
    }
  },
  emits: ["delete"],
  components: { VuImage: Fe, VuIconBtn: U }
}, Ou = ["src", "controls"];
function Vu(e, s, t, i, o, n) {
  const r = resolveComponent("VuIconBtn"), d = resolveComponent("VuImage"), u = resolveComponent("vu-spinner");
  return openBlock(), createElementBlock(Fragment, null, [
    t.isVideo ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: "vu-media-upload-preview__video-container",
      style: normalizeStyle(n.videoSizer)
    }, [
      createBaseVNode("video", {
        class: "vu-media-upload-preview",
        src: t.src,
        controls: t.videoControls
      }, null, 8, Ou)
    ], 4)) : t.isVideo ? e.loading ? (openBlock(), createBlock(u, { key: 2 })) : createCommentVNode("", true) : (openBlock(), createBlock(d, {
      key: 1,
      class: "vu-media-upload-preview",
      "aspect-ratio": t.displayRatio,
      src: t.src,
      contain: "",
      style: { height: "100%" }
    }, {
      default: withCtx(() => [
        createBaseVNode("div", {
          class: "vu-media-upload-preview__delete-icon",
          onClick: s[0] || (s[0] = (f) => e.$emit("delete"))
        }, [
          createVNode(r, { icon: t.deleteIcon }, null, 8, ["icon"])
        ])
      ]),
      _: 1
    }, 8, ["aspect-ratio", "src"])),
    t.isVideo ? (openBlock(), createElementBlock("div", {
      key: 3,
      class: "vu-media-upload-preview__delete-icon",
      onClick: s[1] || (s[1] = (f) => e.$emit("delete"))
    }, [
      createVNode(r, { icon: t.deleteIcon }, null, 8, ["icon"])
    ])) : createCommentVNode("", true)
  ], 64);
}
const Ts = /* @__PURE__ */ O(Bu, [["render", Vu], ["__scopeId", "data-v-8449cad3"]]), $u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ts
}, Symbol.toStringTag, { value: "Module" })), xu = {
  empty: "empty",
  loading: "loading",
  error: "error",
  complete: "complete"
}, Mu = {
  name: "vu-media-upload",
  mixins: [Q, K, Ie, Z, ee],
  props: {
    icon: {
      type: String,
      default: () => ""
    },
    mediaUrl: {
      type: String,
      default: () => ""
    },
    video: {
      type: Boolean,
      default: false
    },
    videoControls: {
      type: Boolean,
      default: true
    },
    uploadProgress: {
      type: Number,
      required: false,
      default: void 0
    },
    fileMaxSize: {
      type: Number,
      default: () => 1 / 0
    },
    displayRatio: {
      type: String,
      default: () => "16 / 9"
    },
    showLabel: {
      type: Boolean
    },
    multiple: {
      type: Boolean
    },
    allowLoadingDrop: {
      type: Boolean
    },
    allowErrorDrop: {
      type: Boolean
    },
    skipTypeCheck: {
      type: Boolean,
      required: false
    },
    noDragNDrop: {
      type: Boolean,
      required: false
    },
    acceptVideo: Boolean,
    acceptImage: {
      type: Boolean,
      default: true
    },
    state: {
      type: String,
      default: ""
    }
  },
  inject: {
    vuMediaUploadSizeExcess: {
      default: "File exceeds maximum size."
    },
    vuMediaUploadShouldBeImage: {
      default: "Please select an image."
    },
    vuMediaUploadShouldBeVideo: {
      default: "Please select a video."
    }
  },
  data() {
    return {
      states: xu,
      innerState: "empty",
      innerVideo: false,
      allowDrop: false,
      dragged: false,
      error: ""
    };
  },
  created() {
    this.localRules = [this.checkVideoType, this.checkImgType, this.checkFileSize];
  },
  emits: ["update:state", "upload-abort", "select", "delete", "retry"],
  computed: {
    preview() {
      return {
        src: this.mediaUrl,
        isVideo: this.video || this.innerVideo,
        displayRatio: this.displayRatio,
        videoControls: this.videoControls
      };
    },
    hasLabel() {
      return this.showLabel && !this.multiple;
    },
    wrapStyle() {
      return {
        "aspect-ratio": this.displayRatio
      };
    },
    status: {
      get() {
        return this.state || this.innerState;
      },
      set(e) {
        this.$emit("update:state", e), this.innerState = e;
      }
    }
  },
  watch: {
    hasError(e) {
      e && (this.status = this.states.error);
    }
  },
  methods: {
    selectFiles(e) {
      this.multiple && e.length > 1 ? (this.status = this.states.loading, this.$emit("select", e)) : this.skipTypeCheck ? (this.status = this.states.loading, this.$emit("select", e)) : this.validate(e[0]) && (this.status = this.states.loading, this.$emit("select", e));
    },
    dragOver() {
      this.noDragNDrop || this.state !== this.states.complete && (this.state === this.states.loading && !this.allowLoadingDrop || this.state === this.states.error && !this.allowErrorDrop || (this.allowDrop = true, this.dragged = true));
    },
    dragLeave(e) {
      e.currentTarget.contains(e.relatedTarget) || (this.dragged = false, this.allowDrop = false);
    },
    onFileDrop(e) {
      this.dragged = false, this.allowDrop = false, this.status = this.states.loading, this.selectFiles(e.dataTransfer.files);
    },
    checkFileSize({ size: e }) {
      return this.fileMaxSize && e / 1024 / 1024 >= this.fileMaxSize ? this.vuMediaUploadSizeExcess : true;
    },
    /* 3 checks disablable with skipTypeCheck */
    checkImgType({ type: e }) {
      if (this.acceptImage) {
        const s = /image\/(jpg|jpeg|png|webp)$/i.test(e);
        if (s && (this.innerVideo = false), !this.acceptVideo)
          return s || this.vuMediaUploadShouldBeImage;
      }
      return true;
    },
    checkVideoType({ type: e }) {
      if (this.acceptVideo) {
        const s = /video\/(mp4|avi)$/i.test(e);
        if (this.innerVideo = s, !this.acceptImage)
          return s || this.vuMediaUploadShouldBeVideo;
      }
      return true;
    },
    checkVideoAndImgType({ type: e }) {
      return this.acceptVideo && this.acceptImage ? /video\/(mp4|avi)$/i.test(e) && /image\/(jpg|jpeg|png|webp)$/i.test(e) || this.vuMediaUploadTypeUnexpected : true;
    },
    onRetry() {
      this.errorBucket = [], this.status = this.states.empty, this.$emit("retry", this.$refs["upload-input"].value);
    }
  },
  components: { VuIcon: H, VuMediaUploadDroppable: $s, VuMediaUploadLoading: Ls, VuMediaUploadError: Ms, VuMediaUploadEmpty: xs, VuMediaUploadPreview: Ts }
}, Pu = {
  key: 0,
  class: "control-label"
}, Lu = {
  key: 0,
  class: "label-field-required"
}, Tu = ["multiple"];
function Au(e, s, t, i, o, n) {
  const r = resolveComponent("VuIcon"), d = resolveComponent("VuMediaUploadDroppable"), u = resolveComponent("VuMediaUploadEmpty"), f = resolveComponent("VuMediaUploadLoading"), c = resolveComponent("VuMediaUploadError"), h2 = resolveComponent("vuMediaUploadPreview");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-media-upload", [{ "has-error": o.error, "vu-media-upload--border": !n.hasLabel, "vu-media-upload--inner-flex": n.hasLabel }]]),
    style: normalizeStyle(n.hasLabel ? {} : n.wrapStyle)
  }, [
    n.hasLabel ? (openBlock(), createElementBlock("label", Pu, [
      t.icon ? (openBlock(), createBlock(r, {
        key: 0,
        icon: t.icon
      }, null, 8, ["icon"])) : createCommentVNode("", true),
      renderSlot(e.$slots, "label", {}, () => [
        createTextVNode(toDisplayString(e.label), 1),
        e.required ? (openBlock(), createElementBlock("span", Lu, " *")) : createCommentVNode("", true)
      ], true)
    ])) : createCommentVNode("", true),
    createBaseVNode("input", {
      ref: "upload-input",
      type: "file",
      name: "upload",
      style: { display: "none" },
      onChange: s[0] || (s[0] = (v) => n.selectFiles(e.$refs["upload-input"].files)),
      multiple: t.multiple
    }, null, 40, Tu),
    createBaseVNode("div", {
      class: normalizeClass(["vu-media-upload__inner", { "vu-media-upload--border": n.hasLabel, "full-height": !n.hasLabel }]),
      ref: "inner",
      style: normalizeStyle(n.hasLabel ? n.wrapStyle : ""),
      onDragover: s[4] || (s[4] = withModifiers((v) => n.dragOver(), ["prevent"])),
      onDragenter: s[5] || (s[5] = withModifiers((v) => n.dragOver(), ["prevent"])),
      onDragleave: s[6] || (s[6] = (...v) => n.dragLeave && n.dragLeave(...v)),
      onDragend: s[7] || (s[7] = (...v) => n.dragLeave && n.dragLeave(...v))
    }, [
      o.dragged ? (openBlock(), createBlock(d, {
        key: 0,
        "valid-drop": o.allowDrop,
        onDrop: n.onFileDrop
      }, {
        "drop-icon": withCtx(() => [
          renderSlot(e.$slots, "drop-icon", {}, void 0, true)
        ]),
        "drop-label": withCtx(() => [
          renderSlot(e.$slots, "drop-label", {}, void 0, true)
        ]),
        _: 3
      }, 8, ["valid-drop", "onDrop"])) : createCommentVNode("", true),
      n.status === o.states.empty ? renderSlot(e.$slots, "empty", {
        key: 1,
        input: e.$refs["upload-input"]
      }, () => [
        createVNode(u, {
          onBrowse: s[1] || (s[1] = (v) => {
            e.$refs["upload-input"].value = "", e.$refs["upload-input"].click();
          })
        })
      ], true) : n.status === o.states.loading ? renderSlot(e.$slots, "loading", { key: 2 }, () => [
        createVNode(f, {
          progress: t.uploadProgress,
          onUploadAbort: s[2] || (s[2] = (v) => e.$emit("upload-abort"))
        }, null, 8, ["progress"])
      ], true) : n.status === o.states.error ? renderSlot(e.$slots, "error", { key: 3 }, () => [
        createVNode(c, mergeProps({ onRetry: n.onRetry }, { errorBucket: e.errorBucket }), null, 16, ["onRetry"])
      ], true) : n.status === o.states.complete ? renderSlot(e.$slots, "preview", { key: 4 }, () => [
        createVNode(h2, mergeProps(n.preview, {
          onDelete: s[3] || (s[3] = (v) => {
            e.$emit("delete"), n.status = o.states.empty;
          })
        }), null, 16)
      ], true) : createCommentVNode("", true)
    ], 38)
  ], 6);
}
const Fu = /* @__PURE__ */ O(Mu, [["render", Au], ["__scopeId", "data-v-bc0ccd8d"]]), Du = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Fu
}, Symbol.toStringTag, { value: "Module" })), zu = {
  name: "vu-message",
  mixins: [Ae, Te],
  components: { VuIconLink: Tt },
  props: {
    text: {
      type: String,
      default: () => ""
    },
    closable: {
      type: Boolean,
      default: () => true
    },
    color: {
      type: String,
      default: () => "primary"
    },
    animate: {
      type: Boolean,
      default: () => true
    },
    link: {
      type: String,
      required: false
    },
    linkHandler: {
      type: Function,
      required: false,
      default: () => () => {
      }
    },
    timeout: {
      type: Number,
      default: () => 0
    },
    animationDuration: {
      type: Number,
      default: 500
    },
    // eslint-disable-next-line vue/require-default-prop
    target: String
  },
  emits: ["update:show", "click-link"],
  data: () => ({
    activeTimeout: 0,
    in: true,
    _disposed: false
  }),
  computed: {
    colored() {
      return !!this.color;
    },
    classes() {
      return [`alert-${this.color}`, {
        "alert-closable": this.closable
      }];
    }
  },
  watch: {
    show: {
      immediate: true,
      handler() {
        this.setTimeout();
      }
    },
    _dispose(e) {
      e && this.dispose();
    }
  },
  methods: {
    dispose() {
      if (this._disposed = true, !this.animate) {
        this.$emit("update:show", false);
        return;
      }
      window.setTimeout(() => {
        this.$emit("update:show", false);
      }, this.animationDuration);
    },
    setTimeout() {
      this.show && this.timeout && (window.clearTimeout(this.activeTimeout), this.activeTimeout = window.setTimeout(() => {
        this.dispose();
      }, this.timeout));
    }
  }
}, Nu = {
  key: 0,
  class: "icon fonticon"
}, Eu = { class: "alert-message-wrap" }, ju = ["innerHTML"];
function Ru(e, s, t, i, o, n) {
  const r = resolveComponent("VuIconLink");
  return openBlock(), createBlock(Transition, { name: "alert-fade" }, {
    default: withCtx(() => [
      e.show && !e._disposed ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["vu-message alert-has-icon", n.classes])
      }, [
        n.colored ? (openBlock(), createElementBlock("span", Nu)) : createCommentVNode("", true),
        createBaseVNode("span", Eu, [
          renderSlot(e.$slots, "default", {}, () => [
            createBaseVNode("div", { innerHTML: t.text }, null, 8, ju)
          ], true)
        ]),
        t.link ? (openBlock(), createBlock(r, {
          key: 1,
          label: t.link,
          class: "vu-message_link",
          onClick: s[0] || (s[0] = () => {
            e.$emit("click-link", e.linkData), t.linkHandler();
          })
        }, null, 8, ["label"])) : createCommentVNode("", true),
        t.closable ? (openBlock(), createElementBlock("span", {
          key: 2,
          class: "close fonticon fonticon-cancel",
          onClick: s[1] || (s[1] = (...d) => n.dispose && n.dispose(...d))
        })) : createCommentVNode("", true)
      ], 2)) : createCommentVNode("", true)
    ]),
    _: 3
  });
}
const As = /* @__PURE__ */ O(zu, [["render", Ru], ["__scopeId", "data-v-cedd6e06"]]), Uu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: As
}, Symbol.toStringTag, { value: "Module" }));
let Ge = {
  create: () => {
  },
  hide: () => {
  },
  _exists: () => false,
  _register: () => {
  }
};
function Hu(e) {
  const s = reactive([]), t = reactive({});
  Ge = markRaw({
    _messages: t,
    namespaces: s,
    create(o) {
      const { target: n = "main" } = o;
      if (!this._exists(n))
        throw new Error("Target namespace is unknown");
      const r = {
        id: ye(),
        bind: {
          target: n,
          _dispose: false,
          show: true,
          ...o
        },
        dispose() {
          this.bind._dispose = true;
        }
      };
      return this._messages[n].push(reactive(r)), r;
    },
    hide(o) {
      const { target: n = "main" } = o.bind;
      this._messages[n].splice(this._messages[n].indexOf(o), 1);
    },
    _exists(o) {
      return s.includes(o);
    },
    _register(o) {
      s.push(o), this._messages[o] = shallowReactive([]);
    }
  }), e.provide("vuMessageAPI", Ge), e.config.globalProperties.$vuMessage = Ge;
}
const qu = {
  name: "vu-message-container",
  props: {
    namespace: {
      type: String,
      default: "main"
    }
  },
  created() {
    this.api = Ge, this.api._exists(this.namespace) ? this.disabled = true : this.api._register(this.namespace);
  },
  data: () => ({
    api: {},
    disabled: false
  }),
  components: { VuMessage: As }
}, Wu = {
  key: 0,
  class: "alert alert-root",
  style: { visibility: "visible" }
};
function Ku(e, s, t, i, o, n) {
  const r = resolveComponent("VuMessage");
  return e.disabled ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", Wu, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.api._messages[t.namespace], (d) => (openBlock(), createBlock(r, mergeProps(d.bind, {
      key: `${d.id}`,
      "onUpdate:show": (u) => e.api.hide(d)
    }), null, 16, ["onUpdate:show"]))), 128))
  ]));
}
const Gu = /* @__PURE__ */ O(qu, [["render", Ku], ["__scopeId", "data-v-58ddb032"]]), Yu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Gu
}, Symbol.toStringTag, { value: "Module" })), Xu = {
  name: "vu-mobile-dialog",
  emits: ["close", "confirm"],
  components: { VuScroller: Re, VuIconBtn: U },
  props: {
    title: {
      type: String,
      default: ""
    },
    backIcon: {
      type: String,
      default: "close"
    },
    backIconTooltip: {
      type: String,
      default: "Close"
    },
    nextIcon: {
      type: String,
      default: "check"
    },
    nextIconTooltip: {
      type: String,
      default: "OK"
    },
    scrollable: {
      type: Boolean,
      default: true
    },
    customNextIcon: {
      type: Boolean
    },
    customBackIcon: {
      type: Boolean
    },
    nextIconDisabled: {
      type: Boolean
    }
  },
  computed: {
    _backIcon() {
      return this.customBackIcon ? this.backIcon : ["chevron-left", "close"].includes(this.backIcon) ? this.backIcon : "-";
    },
    _icon() {
      return this.customNextIcon ? this.nextIcon : ["chevron-right", "send", "check"].includes(this.nextIcon) ? this.nextIcon : "-";
    },
    backClasses() {
      return [this._backIcon === "chevron-left" ? "chevron" : ""];
    },
    nextClasses() {
      return [this._icon === "chevron-right" ? "chevron" : ""];
    }
  }
}, Ju = { class: "vu-mobile-dialog" }, Qu = { class: "vu-mobile-dialog__header" }, Zu = { class: "vu-mobile-dialog__header__default" }, ed = {
  class: "vu-label-wrap",
  style: { overflow: "hidden" }
};
function td(e, s, t, i, o, n) {
  const r = resolveComponent("VuIconBtn"), d = resolveComponent("VuScroller"), u = resolveDirective("tooltip");
  return openBlock(), createElementBlock("div", Ju, [
    createBaseVNode("div", Qu, [
      renderSlot(e.$slots, "mobile-dialog-header", {}, () => [
        createBaseVNode("div", Zu, [
          withDirectives(createVNode(r, {
            icon: n._backIcon,
            class: normalizeClass([n.backClasses, "vu-mobile-dialog__header_back topbar"]),
            onClick: s[0] || (s[0] = (f) => e.$emit("close"))
          }, null, 8, ["icon", "class"]), [
            [
              u,
              t.backIconTooltip,
              void 0,
              { bottom: true }
            ]
          ]),
          createBaseVNode("div", ed, [
            withDirectives((openBlock(), createElementBlock("label", null, [
              createTextVNode(toDisplayString(t.title), 1)
            ])), [
              [
                u,
                t.title,
                void 0,
                { bottom: true }
              ]
            ])
          ]),
          withDirectives(createVNode(r, {
            icon: n._icon,
            class: normalizeClass([n.nextClasses, "vu-mobile-dialog__header_next topbar"]),
            disabled: t.nextIconDisabled,
            onClick: s[1] || (s[1] = (f) => e.$emit("confirm"))
          }, null, 8, ["icon", "class", "disabled"]), [
            [
              u,
              t.nextIconTooltip,
              void 0,
              { bottom: true }
            ]
          ])
        ])
      ], true)
    ]),
    createBaseVNode("div", {
      class: normalizeClass(["vu-mobile-dialog__content", `vu-mobile-dialog__content--${t.scrollable ? "" : "non-"}scrollable`])
    }, [
      t.scrollable ? (openBlock(), createBlock(d, { key: 0 }, {
        default: withCtx(() => [
          renderSlot(e.$slots, "default", {}, void 0, true)
        ]),
        _: 3
      })) : renderSlot(e.$slots, "default", { key: 1 }, void 0, true)
    ], 2)
  ]);
}
const Fs = /* @__PURE__ */ O(Xu, [["render", td], ["__scopeId", "data-v-e2c44982"]]), sd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Fs
}, Symbol.toStringTag, { value: "Module" })), nd = {
  name: "vu-modal",
  data: () => ({
    model: "",
    mobileWidth: false,
    resizeObs: {},
    pick: ys,
    pickNRename: sl
  }),
  emits: ["close", "cancel", "confirm"],
  mixins: [Ae],
  props: {
    show: {
      type: Boolean,
      required: false,
      default: () => false
    },
    keepRendered: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ""
    },
    message: {
      type: String,
      default: () => ""
    },
    rawContent: {
      type: String,
      default: ""
    },
    keyboard: {
      type: Boolean,
      default: () => true
    },
    showCancelIcon: {
      type: Boolean,
      default: () => true
    },
    showCancelButton: {
      type: Boolean,
      default: () => false
    },
    showFooter: {
      type: Boolean,
      default: () => true
    },
    showInput: {
      type: Boolean,
      default: () => false
    },
    /* input props */
    label: {
      type: String,
      default: () => ""
    },
    helper: {
      type: String,
      default: () => ""
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    rules: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: () => true
    },
    success: {
      type: Boolean,
      default: () => false
    },
    disableKeyboardConfirm: {
      type: Boolean,
      default: false
    },
    /* input props */
    cancelLabel: {
      type: String,
      default: () => "Cancel"
    },
    okLabel: {
      type: String,
      default: () => "OK"
    },
    /* mobile specific props */
    noMobile: {
      type: Boolean
    },
    mobileNextIcon: {
      type: String
    },
    mobileNextIconTooltip: {
      type: String
    },
    mobileCustomNextIcon: {
      type: Boolean
    },
    mobileNextIconDisabled: {
      type: Boolean
    },
    mobileBackIcon: {
      type: String
    },
    mobileBackIconTooltip: {
      type: String
    },
    mobileCustomBackIcon: {
      type: Boolean
    },
    mobileScrollable: {
      type: Boolean
    },
    /* cancel */
    // eslint-disable-next-line vue/prop-name-casing
    _cancel: Boolean
  },
  inject: {
    vuMobileBreakpoint: {
      default: () => "640"
    }
  },
  watch: {
    _cancel(e) {
      e && this.cancel();
    }
  },
  beforeMount() {
    this.noMobile || (this.checkWidth(), window.addEventListener("resize", this.checkWidth));
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkWidth);
  },
  methods: {
    cancel(e = false) {
      this.innerShow = false, this.$emit(e ? "close" : "cancel"), this.showInput && this.clear();
    },
    confirm() {
      this.showInput ? this.$refs.form.validate() && (this.$emit("confirm", this.model), this.innerShow = false, this.clear()) : (this.$emit("confirm", true), this.innerShow = false);
    },
    validate(e) {
      this.$refs.form.validate(e);
    },
    clear() {
      this.model = "";
    },
    checkWidth() {
      window.document.documentElement.clientWidth < this.vuMobileBreakpoint ? this.mobileWidth = true : this.mobileWidth = false;
    }
  },
  components: { VuMobileDialog: Fs, VuInput: Is, VuForm: ks, VuBtn: ae }
}, id = { key: 0 }, ld = ["innerHTML"], od = { key: 1 }, rd = {
  class: "vu-modal modal modal-root",
  style: { display: "block" }
}, ad = { class: "modal-wrap" }, ud = { class: "modal-header" }, dd = { class: "modal-body" }, cd = ["innerHTML"], hd = { key: 1 }, fd = {
  key: 0,
  class: "modal-footer"
}, md = /* @__PURE__ */ createBaseVNode("div", { class: "modal-overlay in" }, null, -1);
function pd(e, s, t, i, o, n) {
  const r = resolveComponent("VuInput"), d = resolveComponent("VuForm"), u = resolveComponent("VuMobileDialog"), f = resolveComponent("VuBtn");
  return t.keepRendered || e.innerShow ? withDirectives((openBlock(), createElementBlock("div", id, [
    !t.noMobile && e.mobileWidth ? (openBlock(), createBlock(u, mergeProps({ key: 0 }, {
      ...e.pick(e.$props, "title"),
      ...e.pickNRename(
        e.$props,
        { key: "mobileBackIcon", newName: "backIcon" },
        { key: "mobileBackIconTooltip", newName: "backIconTooltip" },
        { key: "mobileCustomBackIcon", newName: "customBackIcon" },
        { key: "mobileNextIcon", newName: "nextIcon" },
        { key: "mobileNextIconTooltip", newName: "nextIconTooltip" },
        { key: "mobileNextIconDisabled", newName: "nextIconDisabled" },
        { key: "mobileCustomNextIcon", newName: "customNextIcon" },
        { key: "mobileScrollable", newName: "scrollable" }
      ),
      disabled: e.valid
    }, {
      onClose: s[1] || (s[1] = (c) => n.cancel()),
      onConfirm: s[2] || (s[2] = (c) => n.confirm())
    }), {
      "mobile-dialog-header": withCtx(() => [
        renderSlot(e.$slots, "mobile-header")
      ]),
      default: withCtx(() => [
        renderSlot(e.$slots, "modal-body", {}, () => [
          t.rawContent ? (openBlock(), createElementBlock("div", {
            key: 0,
            innerHTML: t.rawContent
          }, null, 8, ld)) : t.message ? (openBlock(), createElementBlock("p", od, toDisplayString(t.message), 1)) : createCommentVNode("", true),
          t.showInput ? (openBlock(), createBlock(d, {
            key: 2,
            ref: "form"
          }, {
            default: withCtx(() => [
              createVNode(r, {
                modelValue: e.model,
                "onUpdate:modelValue": s[0] || (s[0] = (c) => e.model = c),
                label: t.label,
                required: t.required,
                helper: t.helper,
                success: t.success,
                placeholder: t.placeholder,
                rules: t.rules
              }, null, 8, ["modelValue", "label", "required", "helper", "success", "placeholder", "rules"])
            ]),
            _: 1
          }, 512)) : createCommentVNode("", true)
        ])
      ]),
      _: 3
    }, 16)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      createBaseVNode("div", rd, [
        createBaseVNode("div", ad, [
          createBaseVNode("div", {
            class: "modal-content",
            onKeyup: [
              s[6] || (s[6] = withKeys(() => {
                t.keyboard && (!t.showInput || e.$refs.form.validate()) && !t.disableKeyboardConfirm && n.confirm();
              }, ["enter"])),
              s[7] || (s[7] = withKeys(() => {
                t.keyboard && (t.showCancelButton ? n.cancel() : e.close());
              }, ["escape"]))
            ]
          }, [
            createBaseVNode("div", ud, [
              renderSlot(e.$slots, "modal-header", {}, () => [
                t.showCancelIcon ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  class: "close fonticon fonticon-cancel",
                  title: "",
                  onClick: s[3] || (s[3] = (c) => n.cancel(true))
                })) : createCommentVNode("", true),
                createBaseVNode("h4", null, toDisplayString(t.title), 1)
              ])
            ]),
            createBaseVNode("div", dd, [
              renderSlot(e.$slots, "modal-body", {}, () => [
                t.rawContent ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  innerHTML: t.rawContent
                }, null, 8, cd)) : t.message ? (openBlock(), createElementBlock("p", hd, toDisplayString(t.message), 1)) : createCommentVNode("", true),
                t.showInput ? (openBlock(), createBlock(d, {
                  key: 2,
                  ref: "form"
                }, {
                  default: withCtx(() => [
                    createVNode(r, {
                      modelValue: e.model,
                      "onUpdate:modelValue": s[4] || (s[4] = (c) => e.model = c),
                      label: t.label,
                      required: t.required,
                      helper: t.helper,
                      success: t.success,
                      placeholder: t.placeholder,
                      rules: t.rules
                    }, null, 8, ["modelValue", "label", "required", "helper", "success", "placeholder", "rules"])
                  ]),
                  _: 1
                }, 512)) : createCommentVNode("", true)
              ])
            ]),
            t.showFooter ? (openBlock(), createElementBlock("div", fd, [
              renderSlot(e.$slots, "modal-footer", {}, () => [
                createVNode(f, {
                  color: "primary",
                  onClick: n.confirm
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(t.okLabel), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                t.showCancelButton ? (openBlock(), createBlock(f, {
                  key: 0,
                  color: "default",
                  onClick: s[5] || (s[5] = (c) => n.cancel())
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(t.cancelLabel), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ])
            ])) : createCommentVNode("", true)
          ], 32)
        ])
      ]),
      md
    ], 64))
  ], 512)), [
    [vShow, e.innerShow]
  ]) : createCommentVNode("", true);
}
const At = /* @__PURE__ */ O(nd, [["render", pd]]), gd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: At
}, Symbol.toStringTag, { value: "Module" }));
let ze = {
  show: () => {
  },
  hide: () => {
  },
  alert: () => {
  },
  confirm: () => {
  },
  prompt: () => {
  },
  _modals: shallowReactive([])
};
function vd(e) {
  const s = shallowReactive([]);
  return ze = markRaw({
    _modals: s,
    show(i) {
      return this.hide(), new Promise((o, n) => {
        const r = {
          id: ye(),
          component: At,
          bind: reactive({ ...i, show: true }),
          on: {
            close: () => {
              this.hide(r), n();
            },
            confirm: (d) => {
              this.hide(r), o(d);
            },
            cancel: () => {
              this.hide(r), n();
            }
          }
        };
        this._modals.push(shallowReactive(r));
      });
    },
    hide(i) {
      if (i) {
        const o = this._modals.find((n) => n.id === i.id);
        if (!o)
          return;
        o.bind.show = false, setTimeout(() => {
          const n = this._modals.findIndex((r) => r.id === i.id);
          n > -1 && this._modals.splice(n, 1);
        }, 1e3);
      } else
        this._modals.forEach((o) => {
          o._cancel = true;
        }), this._modals.splice(0, this._modals.length);
    },
    alert(i) {
      return this.show(i);
    },
    confirm(i) {
      return this.show({
        showCancelIcon: true,
        showCancelButton: true,
        ...i
      });
    },
    prompt(i) {
      return this.show({
        showCancelIcon: true,
        showCancelButton: true,
        showInput: true,
        ...i
      });
    }
  }), e.provide("vuModalAPI", ze), e.config.globalProperties.$vuModal = ze, ze;
}
const yd = {
  name: "vu-modal-container",
  components: {
    VuModal: At
  },
  data: () => ({
    // eslint-disable-next-line vue/no-reserved-keys
    _modals: {
      type: Object
    }
  }),
  created() {
    this._modals = ze._modals;
  }
};
function bd(e, s, t, i, o, n) {
  return openBlock(true), createElementBlock(Fragment, null, renderList(e._modals, (r) => (openBlock(), createBlock(resolveDynamicComponent(r.component), mergeProps({
    key: r.id
  }, r.bind, {
    modelValue: r.value,
    "onUpdate:modelValue": (d) => r.value = d
  }, toHandlers(r.on)), null, 16, ["modelValue", "onUpdate:modelValue"]))), 128);
}
const _d = /* @__PURE__ */ O(yd, [["render", bd]]), wd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _d
}, Symbol.toStringTag, { value: "Module" }));
function Xt(e, s) {
  var t;
  e.value > -1 ? e.value -= 1 : e.value = (((t = s.value) == null ? void 0 : t.length) || 0) - 1;
}
function Jt(e, s) {
  var t;
  e.value > (((t = s.value) == null ? void 0 : t.length) || 0) - 2 ? e.value = -1 : e.value += 1;
}
function qe(e, s) {
  const { target: t = false } = s;
  return t instanceof HTMLInputElement ? e && t.value : false;
}
function Qt(e, s) {
  const {
    target: t,
    items: i,
    debug: o = false,
    disabled: n = false
  } = e || {}, {
    direction: r = "vertical",
    discardWhenValue: d = false,
    preserveIndexOnRemoval: u = false
  } = s || {};
  if (!t) {
    o && console.warn("VUEKIT - Warning Keyboard Navigation cannot be applied. Please use onMount hook and check target element is mounted.");
    return;
  }
  const f = r === "vertical", c = ref(-1);
  watch(i, (v, k) => {
    u && v.length < k.length ? c.value === k.length - 1 && (c.value = v.length - 1) : c.value = -1;
  });
  const h2 = Sn(c, { initialValue: -1 });
  return !f && He("ArrowLeft", (v) => {
    n || qe(d, v) || Xt(c, i);
  }, { target: t }), !f && He("ArrowRight", (v) => {
    n || qe(d, v) || Jt(c, i);
  }, { target: t }), f && He("ArrowUp", (v) => {
    n || qe(d, v) || Xt(c, i);
  }, { target: t }), f && He("ArrowDown", (v) => {
    n || qe(d, v) || Jt(c, i);
  }, { target: t }), { currentIndex: c, last: h2 };
}
const kd = {
  name: "vu-multiple-select",
  inject: {
    vuMultipleSelectLabels: {
      default: () => ({
        noResults: "No results."
      })
    },
    vuDebug: {
      default: false
    },
    vuInputComposition: {
      default: false
    }
  },
  mixins: [Q, K, Ie, Z, Ct, ee],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    itemHeight: {
      type: Number,
      default: () => 38
    },
    minSearchLength: {
      type: Number,
      default: () => 0
    },
    shortPlaceholder: {
      type: String,
      required: false,
      default: () => ""
    },
    user: {
      type: Boolean,
      required: false
    },
    userBigBadges: {
      type: Boolean,
      required: false
    },
    maxVisible: {
      type: Number,
      default: () => 5
    },
    maxSelectable: {
      type: Number,
      default: () => 1 / 0
    },
    caseSensitive: {
      type: Boolean,
      default: false
    },
    preserveSearchOnBlur: {
      type: Boolean,
      default: false
    },
    preserveSearchOnItemClick: {
      type: Boolean,
      default: false
    },
    preserveSearchOnItemKeyboard: {
      type: [Boolean, void 0],
      default: void 0
    },
    noLocalFiltering: {
      type: Boolean,
      default: false
    },
    disableUnselectionWithinOptions: {
      type: Boolean,
      default: false
    },
    keepFocusOnInputOnItemClick: {
      type: Boolean,
      default: false
    },
    keepFocusOnInputOnItemKeyboard: {
      type: [Boolean, void 0],
      default: void 0
    }
  },
  expose: ["toggle"],
  emits: ["search", "update:modelValue", "notify:already-selected"],
  data: () => ({
    open: false,
    inputInFocus: false,
    positioned: true,
    intxObs: null,
    search: "",
    keyIndexItems: -1,
    lastItemChange: -1,
    keyIndexBadges: -1,
    lastBadgeChange: -1,
    bottom: 40,
    top: false,
    resizeObs: null,
    uid: be()
  }),
  created() {
    this.resizeObs = new ResizeObserver((e) => {
      this.bottom = e[0].contentRect.height + 4;
    });
  },
  mounted() {
    this.$refs.searchfield && this.resizeObs.observe(this.$refs.searchfield), this.target && (this.intxObs = new IntersectionObserver((t) => {
      this.intxObs.unobserve(this.$refs.dropdown);
      const i = this.target.getBoundingClientRect(), o = this.$refs.dropdown.getBoundingClientRect();
      i.bottom < o.bottom && (this.top = true), this.positioned = true;
    }, {
      root: this.target,
      threshold: 1
    }));
    const e = Qt({
      disabled: this.disabled,
      items: computed(() => this.innerOptions),
      target: this.$refs.input,
      debug: this.vuDebug
    });
    this.lastItemChange = e == null ? void 0 : e.last, this.keyIndexItems = e == null ? void 0 : e.currentIndex;
    const s = Qt({
      disabled: this.disabled,
      items: computed(() => this.modelValue),
      target: this.$refs.input,
      debug: this.vuDebug
    }, {
      direction: "horizontal",
      discardWhenValue: true,
      preserveIndexOnRemoval: true
    });
    this.keyIndexBadges = s == null ? void 0 : s.currentIndex, this.lastBadgeChange = s == null ? void 0 : s.last;
  },
  watch: {
    search(e) {
      this.executeSearch(e);
    }
  },
  computed: {
    searchLengthMet() {
      return this.search.length >= this.minSearchLength;
    },
    innerOptions() {
      return this.searchLengthMet ? this.noLocalFiltering ? this.options : this.caseSensitive ? this.options.filter((e) => e.label.includes(this.search) || e.value.includes(this.search)) : this.options.filter((e) => e.label.toLowerCase().includes(this.search.toLowerCase()) || e.value.toLowerCase().includes(this.search.toLowerCase())) : [];
    },
    innerOptionsLength() {
      return this.innerOptions.length;
    },
    noResults() {
      return this.options && this.innerOptions.length === 0 && this.searchLengthMet;
    },
    values() {
      return (this.value || []).map((e) => e.value);
    },
    dropdownHeight() {
      return this.noResults ? this.$slots.noResults ? "auto" : this.itemHeight : this.innerOptionsLength > this.maxVisible ? this.itemHeight * ((this.innerOptionsLength === this.maxVisible ? 0 : 0.5) + this.maxVisible) : this.itemHeight * this.innerOptionsLength + 1;
    },
    keepFocusKeyboard() {
      return this.keepFocusOnInputOnItemKeyboard !== void 0 ? this.keepFocusOnInputOnItemKeyboard : this.keepFocusOnInputOnItemClick;
    },
    preserveSearchKeyboard() {
      return this.preserveSearchOnItemKeyboard !== void 0 ? this.preserveSearchOnItemKeyboard : this.preserveSearchOnItemClick;
    }
  },
  methods: {
    executeSearch(e) {
      this.$emit("search", e), e && !this.open && this.openAndIntersect();
    },
    toggle(e, { fromOptionsClick: s = false, fromOptionsKeyboard: t = false } = { fromOptionsClick: false, fromOptionsKeyboard: false }) {
      if (e.disabled)
        return;
      const i = this.value || [], o = i.findIndex((n) => n.value === e.value);
      if (this.values.includes(e.value))
        if (this.maxSelectable === 1)
          this.$emit("update:modelValue", []);
        else if ((s || t) && this.disableUnselectionWithinOptions)
          this.$emit("notify:already-selected", e);
        else {
          const n = i.slice();
          n.splice(o, 1), this.$emit("update:modelValue", n);
        }
      else
        this.maxSelectable === 1 ? (this.$emit("update:modelValue", [e]), this.search = "", this.close()) : this.$emit("update:modelValue", i.concat([e]));
      (s || t) && ((s && this.keepFocusOnInputOnItemClick || t && this.keepFocusKeyboard) && this.$refs.input.focus(), (s && !this.preserveSearchOnItemClick || t && !this.preserveSearchKeyboard) && (this.search = ""));
    },
    getOption(e) {
      return this.options.find((s) => s.value === e) || {};
    },
    close() {
      this.open = false, this.top = false, this.preserveSearchOnBlur || (this.search = "");
    },
    async openAndIntersect() {
      if (this.searchLengthMet && !this.open)
        if (this.target && ["scroll", "auto", "visible"].includes(window.getComputedStyle(this.target).overflowY)) {
          const e = this.target.getBoundingClientRect(), s = this.$refs.searchfield.getBoundingClientRect();
          !this.top && (this.maxVisible + 0.5) * this.itemHeight > e.bottom - s.bottom && (this.top = true), this.open = true;
        } else
          this.open = true, this.positioned = false, await new Promise((e) => setTimeout(e, 10)), await this.$nextTick(), this.intxObs.observe(this.$refs.dropdown);
    },
    beforeUnmount() {
      this.intxObs.disconnect(), delete this.intxObs;
    },
    onDelete(e) {
      var s;
      if (this.open && this.lastItemChange > this.lastBadgeChange) {
        if (this.keyIndexItems > -1) {
          const t = this.innerOptions[this.keyIndexItems];
          !(t != null && t.disabled) && this.values.includes(t.value) && (this.toggle(t, { fromOptionsKeyboard: true }), e.preventDefault());
        }
      } else
        this.keyIndexBadges > -1 && !((s = this.value[this.keyIndexBadges]) != null && s.disabled) && this.toggle(this.value[this.keyIndexBadges]);
    },
    onEnter() {
      var e;
      this.open && this.lastItemChange > this.lastBadgeChange && this.keyIndexItems > -1 && !((e = this.value[this.keyIndexBadges]) != null && e.disabled) && this.toggle(this.innerOptions[this.keyIndexItems], { fromOptionsKeyboard: true });
    },
    onInput({ target: e }) {
      this.keyIndexBadges > -1 && (this.keyIndexBadges = -1), this.vuInputComposition || (e.composing = false);
    }
  },
  components: { VuUserPicture: Le, VuBadge: _t, VuIconBtn: U, VuScroller: Re, VuSelectOptions: Pt }
}, Sd = {
  key: 0,
  class: "control-label"
}, Cd = {
  key: 0,
  class: "label-field-required"
}, Id = {
  key: 1,
  style: { "line-height": "30px" }
}, Bd = ["placeholder"], Od = { style: { "padding-top": "15px" } }, Vd = { class: "message" }, $d = { class: "multiple-select__no-results" }, xd = {
  key: 1,
  class: "form-control-helper-text"
};
function Md(e, s, t, i, o, n) {
  const r = resolveComponent("VuUserPicture"), d = resolveComponent("vu-icon-btn"), u = resolveComponent("VuBadge"), f = resolveComponent("VuIconBtn"), c = resolveComponent("VuSelectOptions"), h2 = resolveComponent("vu-spinner"), v = resolveComponent("VuScroller"), k = resolveDirective("click-outside");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-multiple-select form-group", e.classes])
  }, [
    e.label.length ? (openBlock(), createElementBlock("label", Sd, [
      createTextVNode(toDisplayString(e.label), 1),
      e.required ? (openBlock(), createElementBlock("span", Cd, " *")) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    withDirectives((openBlock(), createElementBlock("div", {
      ref: "searchfield",
      class: normalizeClass([
        "select",
        "select-autocomplete",
        {
          "dropdown-visible": e.open,
          "select-disabled": e.disabled,
          "single-select": t.maxSelectable === 1
        }
      ])
    }, [
      createBaseVNode("div", {
        class: normalizeClass(["autocomplete-searchbox", {
          "autocomplete-searchbox-active": e.inputInFocus || e.open,
          disabled: e.disabled,
          "autocomplete-searchbox--user": t.user,
          "autocomplete-searchbox--user-big-badges": t.user && t.userBigBadges
        }]),
        onClick: s[9] || (s[9] = (w) => {
          t.maxSelectable === 1 && n.values.length || (e.$refs.input.focus(), n.openAndIntersect());
        })
      }, [
        t.user ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(e.value, (w, T) => (openBlock(), createElementBlock("div", {
          key: `${e.uid}-tag-${w}`,
          class: normalizeClass(["vu-user-badge", {
            "vu-user-badge--hovered": T === e.keyIndexBadges
          }])
        }, [
          createVNode(r, {
            id: w.value,
            src: w.src,
            size: "tiny"
          }, null, 8, ["id", "src"]),
          createBaseVNode("span", null, toDisplayString(w.label), 1),
          createVNode(d, {
            class: "vu-user-badge__close",
            icon: "close",
            size: "icon-smaller",
            onClick: (D) => n.toggle(w)
          }, null, 8, ["onClick"])
        ], 2))), 128)) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(e.value, (w, T) => (openBlock(), createElementBlock("span", {
          key: `${e.uid}-tag-${w}`,
          onClick: s[1] || (s[1] = (...D) => n.toggle && n.toggle(...D))
        }, [
          renderSlot(e.$slots, "badge", { value: w }, () => [
            t.maxSelectable !== 1 ? (openBlock(), createBlock(u, {
              key: 0,
              value: T === e.keyIndexBadges,
              closable: "",
              onClick: s[0] || (s[0] = withModifiers(() => {
              }, ["stop"])),
              onClose: (D) => n.toggle(w)
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(w.label), 1)
              ]),
              _: 2
            }, 1032, ["value", "onClose"])) : (openBlock(), createElementBlock("span", Id, toDisplayString(w.label), 1))
          ], true)
        ]))), 128)),
        n.values.length < t.maxSelectable ? withDirectives((openBlock(), createElementBlock("input", {
          key: 2,
          "onUpdate:modelValue": s[2] || (s[2] = (w) => e.search = w),
          ref: "input",
          type: "text",
          class: "autocomplete-input",
          placeholder: n.values.length && t.shortPlaceholder ? t.shortPlaceholder : e.placeholder,
          onInput: s[3] || (s[3] = (...w) => n.onInput && n.onInput(...w)),
          onBlur: s[4] || (s[4] = (w) => e.inputInFocus = false),
          onFocus: s[5] || (s[5] = (w) => e.inputInFocus = true),
          onKeydown: s[6] || (s[6] = withKeys((...w) => n.onDelete && n.onDelete(...w), ["delete", "backspace"])),
          onKeyup: s[7] || (s[7] = withKeys((...w) => n.onEnter && n.onEnter(...w), ["enter"])),
          onClick: s[8] || (s[8] = (w) => {
            n.openAndIntersect();
          })
        }, null, 40, Bd)), [
          [vModelText, e.search]
        ]) : createCommentVNode("", true)
      ], 2),
      t.maxSelectable === 1 && !t.user && e.value && e.value.length ? (openBlock(), createBlock(f, {
        key: 0,
        icon: "clear",
        class: "select__clear-icon",
        onClick: s[10] || (s[10] = withModifiers((w) => {
          n.toggle(e.value[0]), this.search = "";
        }, ["stop"]))
      })) : createCommentVNode("", true),
      e.open && n.searchLengthMet ? (openBlock(), createElementBlock("div", {
        key: 1,
        ref: "dropdown",
        class: normalizeClass(["select-dropdown", [{ "select-dropdown--no-results": n.noResults, "select-dropdown--dropup": e.top }, e.contentClass]]),
        style: normalizeStyle([
          `height: ${n.dropdownHeight}${n.dropdownHeight !== "auto" ? "px" : ""}`,
          e.top ? `bottom: ${e.bottom}px` : "",
          e.positioned ? "" : "opacity: 0",
          e.contentStyle
        ])
      }, [
        createVNode(v, { "always-show": "" }, {
          default: withCtx(() => [
            withDirectives(createVNode(c, {
              multiple: "",
              user: t.user,
              selected: e.value,
              options: n.innerOptions,
              "key-index": e.keyIndexItems,
              onClickItem: s[11] || (s[11] = (w) => n.toggle(w, { fromOptionsClick: true }))
            }, {
              default: withCtx(({ item: w }) => [
                renderSlot(e.$slots, "default", { item: w }, void 0, true)
              ]),
              _: 3
            }, 8, ["user", "selected", "options", "key-index"]), [
              [vShow, n.searchLengthMet && !e.loading]
            ]),
            e.loading ? renderSlot(e.$slots, "loading", { key: 0 }, () => [
              createBaseVNode("ul", Od, [
                createBaseVNode("li", Vd, [
                  createVNode(h2, { show: "" })
                ])
              ])
            ], true) : createCommentVNode("", true),
            !e.loading && n.noResults ? renderSlot(e.$slots, "noResults", { key: 1 }, () => [
              createBaseVNode("ul", $d, [
                createBaseVNode("li", null, toDisplayString(n.vuMultipleSelectLabels.noResults), 1)
              ])
            ], true) : createCommentVNode("", true)
          ]),
          _: 3
        })
      ], 6)) : createCommentVNode("", true)
    ], 2)), [
      [k, function() {
        n.close();
      }]
    ]),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.errorBucket, (w, T) => (openBlock(), createElementBlock("span", {
      key: `${T}-error-${w}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, toDisplayString(w), 1))), 128)),
    e.helper.length ? (openBlock(), createElementBlock("span", xd, toDisplayString(e.helper), 1)) : createCommentVNode("", true)
  ], 2);
}
const Pd = /* @__PURE__ */ O(kd, [["render", Md], ["__scopeId", "data-v-b522022a"]]), Ld = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pd
}, Symbol.toStringTag, { value: "Module" })), Td = {
  name: "vu-range",
  mixins: [Q, et, K, Z, ee],
  props: {
    step: {
      type: Number,
      default: 1
    },
    showLabels: {
      type: Boolean,
      default: true
    },
    customLabels: {
      type: Array,
      required: false,
      default: void 0
    }
  },
  emits: ["update:modelValue", "mouseup"],
  data() {
    return {
      lowervalue: 0,
      uppervalue: 1
    };
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.lowervalue = Math.min(...this.value), this.uppervalue = Math.max(...this.value);
      }
    }
  },
  computed: {
    value() {
      return this.modelValue || [];
    },
    minLabel() {
      return this.customLabels && this.customLabels.length ? this.customLabels[0] : this.min;
    },
    maxLabel() {
      return this.customLabels && this.customLabels.length ? this.customLabels[(this.max + this.max % this.step) / this.step - this.min] : this.max;
    },
    lowerLabel() {
      return this.customLabels && this.customLabels.length ? this.customLabels[(this.lowervalue - this.min) / this.step] : this.lowervalue;
    },
    upperLabel() {
      return this.customLabels && this.customLabels.length ? this.customLabels[(this.uppervalue - this.min) / this.step] : this.uppervalue;
    },
    computedStyles() {
      const e = (this.lowervalue - this.min) / (this.max - this.min) * 100;
      return {
        width: `${(this.uppervalue - this.min - (this.lowervalue - this.min)) / (this.max - this.min || 1) * 100}%`,
        left: `${e}%`
      };
    }
  },
  methods: {
    commit() {
      this.disabled || this.$emit("mouseup", [this.lowervalue, this.uppervalue]);
    },
    update(e, s) {
      if (this.disabled)
        return;
      let t, i;
      e === "lower" ? (i = Math.min(s, this.uppervalue), t = Math.max(s, this.uppervalue), i > t && (t = Math.min(t + this.step, this.max))) : (i = Math.min(s, this.lowervalue), t = Math.max(s, this.lowervalue), i > t && (i = Math.max(i - this.step, this.min))), this.lowervalue = i, this.uppervalue = t, this.$emit("update:modelValue", [this.lowervalue, this.uppervalue]);
    }
  }
}, Ad = {
  key: 0,
  class: "control-label"
}, Fd = {
  key: 0,
  class: "label-field-required"
}, Dd = ["disabled", "value", "min", "max", "step"], zd = ["disabled", "value", "min", "max", "step"], Nd = { class: "vu-range__grey-bar" }, Ed = {
  key: 0,
  class: "vu-range__labels-container"
}, jd = { class: "vu-range__left vu-range__left-label" }, Rd = { class: "vu-range__right vu-range__right-label" }, Ud = {
  key: 1,
  class: "form-control-helper-text"
};
function Hd(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["form-group", e.classes])
  }, [
    e.label.length ? (openBlock(), createElementBlock("label", Ad, [
      createTextVNode(toDisplayString(e.label), 1),
      e.required ? (openBlock(), createElementBlock("span", Fd, " *")) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    createBaseVNode("div", {
      class: normalizeClass(["vu-range", { disabled: e.disabled }])
    }, [
      createBaseVNode("div", {
        onMouseup: s[2] || (s[2] = (...r) => n.commit && n.commit(...r)),
        class: "vu-range__inputs-container"
      }, [
        createBaseVNode("input", {
          disabled: e.disabled,
          onInput: s[0] || (s[0] = (r) => n.update("lower", parseFloat(r.target.value))),
          value: o.lowervalue,
          min: e.min,
          max: e.max,
          step: t.step,
          class: "slider vu-range__left",
          type: "range"
        }, null, 40, Dd),
        createBaseVNode("input", {
          disabled: e.disabled,
          onInput: s[1] || (s[1] = (r) => n.update("upper", parseFloat(r.target.value))),
          value: o.uppervalue,
          min: e.min,
          max: e.max,
          step: t.step,
          class: "slider vu-range__right",
          type: "range"
        }, null, 40, zd),
        createBaseVNode("div", Nd, [
          createBaseVNode("div", {
            class: "vu-range__blue-bar",
            style: normalizeStyle(n.computedStyles)
          }, null, 4)
        ])
      ], 32),
      t.showLabels ? (openBlock(), createElementBlock("div", Ed, [
        createBaseVNode("div", jd, toDisplayString(n.minLabel), 1),
        createBaseVNode("div", Rd, toDisplayString(n.maxLabel), 1),
        o.lowervalue !== e.min && o.uppervalue !== o.lowervalue ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "vu-range__lower-label",
          style: normalizeStyle("left: " + (o.lowervalue - e.min) / (e.max - e.min) * 100 + "%")
        }, toDisplayString(n.lowerLabel), 5)) : createCommentVNode("", true),
        o.uppervalue !== e.max ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: "vu-range__upper-label",
          style: normalizeStyle("left: " + (o.uppervalue - e.min) / (e.max - e.min) * 100 + "%")
        }, toDisplayString(n.upperLabel), 5)) : createCommentVNode("", true)
      ])) : createCommentVNode("", true)
    ], 2),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.errorBucket, (r, d) => (openBlock(), createElementBlock("span", {
      key: `${d}-error-${r}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, toDisplayString(r), 1))), 128)),
    e.helper.length ? (openBlock(), createElementBlock("span", Ud, toDisplayString(e.helper), 1)) : createCommentVNode("", true)
  ], 2);
}
const qd = /* @__PURE__ */ O(Td, [["render", Hd], ["__scopeId", "data-v-7de621bd"]]), Wd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qd
}, Symbol.toStringTag, { value: "Module" })), Kd = {
  name: "vu-single-checkbox",
  mixins: [Z, ee, K],
  inheritAttrs: false,
  props: {
    // String for Radio, Boolean for Switch/Default
    modelValue: {
      type: [String, Boolean],
      default: () => ""
    },
    label: {
      type: String,
      default: ""
    },
    // Removes slot and label
    standalone: {
      type: Boolean,
      default: false
    },
    // Optional
    // eslint-disable-next-line vue/require-default-prop
    icon: {
      type: String,
      required: false
    },
    // Exclusive with Switch
    radio: {
      type: Boolean,
      required: false
    },
    // Required by radio.
    // eslint-disable-next-line vue/require-default-prop
    group: {
      type: String,
      required: false
    },
    // Required by radio
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String,
      required: false
    },
    // Excludes radio
    switch: {
      type: Boolean,
      required: false
    },
    // eslint-disable-next-line vue/require-default-prop
    id: {
      type: [String, Number],
      required: false
    }
  },
  emits: ["update:modelValue"],
  data: () => ({ uid: be() }),
  computed: {
    topClasses() {
      return {
        "vu-single-checkbox--switch": this.switch,
        "vu-single-checkbox--standalone": this.standalone,
        "vu-single-checkbox--checkbox": !this.switch && !this.radio,
        "vu-single-checkbox--radio": this.radio,
        "vu-single-checkbox--extra-content": this.hasExtraContent
      };
    },
    internalClasses() {
      return {
        "toggle-icon": this.icon,
        "toggle-switch": this.switch,
        "toggle-primary": !this.switch
      };
    },
    hasExtraContent() {
      return this.$slots.default && !this.standalone;
    }
  },
  methods: {
    input(e) {
      return this.radio ? this.$emit("update:modelValue", e.target.value) : this.$emit("update:modelValue", e.target.checked);
    }
  },
  components: { VuIcon: H }
}, Gd = ["type", "checked", "name", "value", "id", "disabled"], Yd = ["for"], Xd = { class: "vu-single-checkbox__inner-span" }, Jd = {
  key: 0,
  class: "vu-single-checkbox__extra-content"
};
function Qd(e, s, t, i, o, n) {
  const r = resolveComponent("VuIcon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-single-checkbox", n.topClasses])
  }, [
    createBaseVNode("div", {
      class: normalizeClass(["toggle", n.internalClasses])
    }, [
      createBaseVNode("input", mergeProps({
        class: "vu-single-checkbox__input",
        type: t.radio ? "radio" : "checkbox",
        checked: t.radio ? t.group === t.modelValue : t.modelValue
      }, e.$attrs, {
        name: t.radio ? t.group : void 0,
        value: t.radio ? t.value : void 0,
        id: e.$attrs[t.id] || `${e.uid}`,
        disabled: e.disabled,
        onClick: s[0] || (s[0] = (...d) => n.input && n.input(...d))
      }), null, 16, Gd),
      t.standalone ? createCommentVNode("", true) : (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        createBaseVNode("label", {
          class: "control-label vu-single-checkbox__label",
          for: e.$attrs[t.id] || `${e.uid}`
        }, [
          t.icon ? (openBlock(), createBlock(r, {
            key: 0,
            icon: t.icon
          }, null, 8, ["icon"])) : createCommentVNode("", true),
          createBaseVNode("span", Xd, toDisplayString(t.label), 1)
        ], 8, Yd),
        renderSlot(e.$slots, "label-prepend", {}, void 0, true)
      ], 64))
    ], 2),
    n.hasExtraContent ? (openBlock(), createElementBlock("div", Jd, [
      renderSlot(e.$slots, "default", {}, void 0, true)
    ])) : createCommentVNode("", true)
  ], 2);
}
const Zd = /* @__PURE__ */ O(Kd, [["render", Qd], ["__scopeId", "data-v-90216318"]]), ec = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Zd
}, Symbol.toStringTag, { value: "Module" })), tc = {
  name: "vu-slider",
  mixins: [Q, K, Z, ee],
  props: {
    labels: {
      required: false,
      type: Object,
      default: () => ({
        min: "Min",
        max: "Max"
      })
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    },
    step: {
      type: Number,
      default: 1
    },
    stepped: {
      type: Boolean,
      default: false
    },
    showLabels: {
      type: Boolean,
      default: false
    },
    labelsBeneath: {
      type: Boolean,
      default: false
    }
  },
  emits: ["mouseUp", "input"],
  data: () => ({
    labelsWidth: 0,
    innerValue: 0
  }),
  created() {
    this.innerValue = this.value;
  },
  mounted() {
    const { leftLabel: { offsetWidth: e = 0 } = {}, rightLabel: { offsetWidth: s = 0 } = {} } = this.$refs;
    this.labelsWidth = Math.max(e, s);
  },
  computed: {
    steps() {
      return [];
    },
    labelsMargin() {
      return this.labelsBeneath ? "" : `${this.labelsWidth}px`;
    },
    computedStyle() {
      return {
        left: this.labelsMargin,
        right: this.labelsMargin,
        width: `calc(100% - ${2 * this.labelsWidth}px + 14px)`
      };
    },
    innerBlueBarStyle() {
      return {
        // right: `calc(${percent}%${ left ? (` + ${ left }`) : ''})`,
        width: `${(this.innerValue - this.min) / (this.max - this.min) * 100}%`
      };
    }
  },
  methods: {
    commit() {
      this.disabled || this.$emit("mouseUp", this.value);
    },
    update(e) {
      this.disabled || (this.innerValue = e, this.$emit("input", this.innerValue));
    }
  }
}, sc = {
  key: 0,
  class: "control-label"
}, nc = {
  key: 0,
  class: "label-field-required"
}, ic = ["disabled", "value", "min", "max", "step"], lc = {
  key: 0,
  class: "vu-slider__steps"
}, oc = {
  key: 1,
  class: "form-control-helper-text"
};
function rc(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["form-group", e.classes])
  }, [
    e.label.length ? (openBlock(), createElementBlock("label", sc, [
      createTextVNode(toDisplayString(e.label), 1),
      e.required ? (openBlock(), createElementBlock("span", nc, " *")) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    createBaseVNode("div", {
      class: normalizeClass(["vu-slider", { disabled: e.disabled }])
    }, [
      createBaseVNode("div", {
        onMouseup: s[1] || (s[1] = (...r) => n.commit && n.commit(...r)),
        class: "vu-slider__container"
      }, [
        createBaseVNode("div", {
          ref: "leftLabel",
          class: "vu-slider__left vu-slider__label"
        }, toDisplayString(t.showLabels ? t.labels.min : t.min), 513),
        createBaseVNode("div", {
          ref: "rightLabel",
          class: "vu-slider__right vu-slider__label"
        }, toDisplayString(t.showLabels ? t.labels.max : t.max), 513),
        createBaseVNode("input", {
          class: "slider vu-slider__left",
          type: "range",
          disabled: e.disabled,
          value: e.innerValue,
          min: t.min,
          max: t.max,
          step: t.step,
          style: normalizeStyle(t.labelsBeneath ? {} : n.computedStyle),
          onInput: s[0] || (s[0] = (r) => n.update(parseFloat(r.target.value)))
        }, null, 44, ic),
        createBaseVNode("div", {
          class: "vu-slider__grey-bar",
          style: normalizeStyle({ left: n.labelsMargin, right: n.labelsMargin })
        }, [
          createBaseVNode("div", {
            class: "vu-slider__blue-bar vu-slider__blue-bar--left",
            style: normalizeStyle(n.innerBlueBarStyle)
          }, null, 4)
        ], 4)
      ], 32),
      t.stepped ? (openBlock(), createElementBlock("div", lc, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(n.steps, (r, d) => (openBlock(), createElementBlock("div", {
          key: d,
          class: "vu-slider__step",
          style: normalizeStyle(r.style)
        }, null, 4))), 128))
      ])) : createCommentVNode("", true)
    ], 2),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.errorBucket, (r, d) => (openBlock(), createElementBlock("span", {
      key: `${d}-error-${r}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, toDisplayString(r), 1))), 128)),
    e.helper.length ? (openBlock(), createElementBlock("span", oc, toDisplayString(e.helper), 1)) : createCommentVNode("", true)
  ], 2);
}
const ac = /* @__PURE__ */ O(tc, [["render", rc], ["__scopeId", "data-v-9b4ebc74"]]), uc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ac
}, Symbol.toStringTag, { value: "Module" })), dc = {
  name: "vu-textarea",
  mixins: [Q, K, Z, ee],
  props: {
    rows: {
      type: [Number, String],
      default: () => 2
    },
    name: {
      type: [String],
      required: false
    },
    minlength: {
      type: Number,
      required: false
    },
    maxlength: {
      type: Number,
      required: false
    },
    readonly: {
      type: [Boolean, String, void 0],
      required: false,
      default: void 0
    },
    spellcheck: {
      type: [Boolean, String, void 0],
      required: false,
      default: void 0
    },
    wrap: {
      type: String,
      required: false
    },
    autocomplete: {
      type: [Boolean, String, void 0],
      required: false,
      default: void 0
    },
    autocorrect: {
      type: [Boolean, String, void 0],
      required: false,
      default: void 0
    },
    autofocus: {
      type: [Boolean, String, void 0],
      required: false,
      default: void 0
    }
  },
  emits: ["update:modelValue"],
  inject: {
    isIos: {
      from: cs
    }
  }
}, cc = {
  key: 0,
  class: "control-label"
}, hc = {
  key: 0,
  class: "label-field-required"
}, fc = ["value", "placeholder", "disabled", "name", "minlength", "maxlength", "readonly", "spellcheck", "rows", "wrap", "autocomplete", "autocorrect", "autofocus", "required"], mc = {
  key: 1,
  class: "form-control-helper-text"
};
function pc(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["form-group", [e.classes, { ios: n.isIos }]])
  }, [
    e.label.length ? (openBlock(), createElementBlock("label", cc, [
      createTextVNode(toDisplayString(e.label), 1),
      e.required ? (openBlock(), createElementBlock("span", hc, " *")) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    createBaseVNode("textarea", {
      value: e.value,
      placeholder: e.placeholder,
      disabled: e.disabled,
      name: t.name,
      minlength: t.minlength,
      maxlength: t.maxlength,
      readonly: t.readonly,
      spellcheck: t.spellcheck,
      rows: t.rows,
      wrap: t.wrap,
      autocomplete: t.autocomplete,
      autocorrect: t.autocorrect,
      autofocus: t.autofocus,
      required: e.required,
      class: "form-control",
      onInput: s[0] || (s[0] = (r) => e.$emit("update:modelValue", r.target.value))
    }, null, 40, fc),
    (openBlock(true), createElementBlock(Fragment, null, renderList(e.errorBucket, (r, d) => (openBlock(), createElementBlock("p", {
      key: `${d}-error-${r}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, toDisplayString(r), 1))), 128)),
    e.helper.length ? (openBlock(), createElementBlock("span", mc, toDisplayString(e.helper), 1)) : createCommentVNode("", true)
  ], 2);
}
const gc = /* @__PURE__ */ O(dc, [["render", pc], ["__scopeId", "data-v-3d31211b"]]), vc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gc
}, Symbol.toStringTag, { value: "Module" })), yc = { class: "list-item__thumbnail" }, bc = { class: "list-item__body" }, _c = { key: 0 }, wc = ["innerHTML"], kc = {
  key: 0,
  class: "body__description"
}, Sc = {
  key: 0,
  class: "list-item__action-menu"
}, Cc = {
  name: "vu-thumbnail-list-item"
}, Ic = /* @__PURE__ */ defineComponent({
  ...Cc,
  props: {
    icon: { default: "" },
    iconColor: { default: "default" },
    iconSelectedColor: { default: "secondary" },
    title: { default: "" },
    rawTitle: {},
    imgUrl: {},
    unread: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    description: {},
    actions: { default: () => [] },
    iconFill: { type: Boolean },
    value: { default: void 0 },
    lazyImage: { type: Boolean, default: true }
  },
  emits: ["click", "click-action"],
  setup(e, { emit: s }) {
    const t = e, i = s, o = ref(null), n = ref(null), r = ref(false);
    function d() {
      var u;
      (u = o.value) != null && u.scrollIntoViewIfNeeded && o.value.scrollIntoViewIfNeeded({ behavior: "smooth" });
    }
    return Cn(() => t.selected, d), onMounted(() => {
      t.selected && d();
    }), (u, f) => {
      const c = resolveDirective("tooltip");
      return openBlock(), createElementBlock("div", {
        ref_key: "container",
        ref: o,
        class: normalizeClass(["vu-thumbnail-list-item", [{
          "menu-is-open": r.value,
          selected: u.selected,
          "with-unread-content": u.unread
        }]]),
        onClick: f[3] || (f[3] = ({ target: h2 }) => {
          var v, k;
          return !((k = (v = n.value) == null ? void 0 : v.$el) != null && k.contains(h2)) && i("click", t.value);
        })
      }, [
        createBaseVNode("div", yc, [
          renderSlot(u.$slots, "thumbnail", {}, () => [
            u.icon ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["thumbnail__container", [{ "bg-grey-4": u.iconFill }]])
            }, [
              createVNode(H, {
                class: "thumbnail__icon",
                color: u.selected ? t.iconSelectedColor : t.iconColor,
                icon: u.icon
              }, null, 8, ["color", "icon"])
            ], 2)) : u.imgUrl ? (openBlock(), createBlock(Fe, {
              key: 1,
              src: u.imgUrl || "",
              lazy: u.lazyImage
            }, null, 8, ["src", "lazy"])) : createCommentVNode("", true)
          ], true)
        ]),
        createBaseVNode("div", bc, [
          renderSlot(u.$slots, "title", {
            isMenuOpen: r.value,
            listItemRef: o.value
          }, () => [
            u.title ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["body__title", [{
                "font-bold": u.unread,
                "!line-clamp-1": !!u.$slots.description || u.description
              }]])
            }, [
              u.rawTitle ? (openBlock(), createElementBlock("span", {
                key: 1,
                innerHTML: u.rawTitle
              }, null, 8, wc)) : (openBlock(), createElementBlock("span", _c, toDisplayString(u.title), 1))
            ], 2)) : createCommentVNode("", true)
          ], true),
          renderSlot(u.$slots, "description", {}, () => [
            u.description ? (openBlock(), createElementBlock("div", kc, toDisplayString(u.description), 1)) : createCommentVNode("", true)
          ], true)
        ]),
        u.unread || u.actions.length ? (openBlock(), createElementBlock("div", Sc, [
          u.unread ? (openBlock(), createBlock(U, {
            key: 0,
            class: "action-menu__unread-icon",
            "no-active": true,
            "no-hover": "",
            icon: "record"
          })) : createCommentVNode("", true),
          u.actions.length > 1 ? (openBlock(), createBlock(Ce, {
            key: 1,
            ref_key: "actionMenu",
            ref: n,
            show: r.value,
            "onUpdate:show": f[0] || (f[0] = (h2) => r.value = h2),
            items: u.actions,
            side: "bottom-right",
            onClickItem: f[1] || (f[1] = (h2) => i("click-action", h2))
          }, {
            default: withCtx(() => [
              createVNode(U, {
                clickable: "",
                color: u.selected && "secondary" || void 0,
                class: "action-menu__action",
                icon: "chevron-down",
                active: r.value,
                "within-text": false
              }, null, 8, ["color", "active"])
            ]),
            _: 1
          }, 8, ["show", "items"])) : u.actions.length === 1 ? withDirectives((openBlock(), createBlock(U, {
            key: 2,
            ref_key: "actionMenu",
            ref: n,
            clickable: "",
            color: u.selected && "secondary" || void 0,
            class: "action-menu__action",
            icon: u.actions[0].fonticon,
            active: r.value,
            "within-text": false,
            onClick: f[2] || (f[2] = (h2) => i("click-action", u.actions[0]))
          }, null, 8, ["color", "icon", "active"])), [
            [c, u.actions[0].text || u.actions[0].label]
          ]) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
}), Bc = /* @__PURE__ */ O(Ic, [["__scopeId", "data-v-15543e1b"]]), Oc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Bc
}, Symbol.toStringTag, { value: "Module" })), Vc = {
  key: 0,
  class: "control-label"
}, $c = {
  key: 0,
  class: "label-field-required"
}, xc = { key: 1 }, Mc = ["value", "placeholder", "disabled"], Pc = { class: "vu-time-picker__display form-control" }, Lc = { class: "vu-time-picker__body" }, Tc = { class: "vu-time-picker__hours" }, Ac = ["value"], Fc = { class: "vu-time-picker__minutes" }, Dc = ["value"], zc = {
  key: 3,
  class: "form-control vu-time-picker__display",
  disabled: ""
}, Nc = {
  key: 4,
  class: "form-control-helper-text"
}, Ec = {
  name: "vu-time-picker",
  inheritAttrs: false,
  mixins: [Q, Z, K, ee],
  props: {
    useNativeInput: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      minutes: "00",
      hours: "00",
      isPopoverOpen: false
    };
  },
  watch: {
    modelValue(e) {
      const [s, t] = this.splitTime(e);
      this.hours = s, this.minutes = t;
    },
    minutes(e) {
      this.$emit("update:modelValue", `${this.hours}:${e}`);
    },
    hours(e) {
      this.$emit("update:modelValue", `${e}:${this.minutes}`);
    }
  },
  beforeMount() {
    const [e, s] = this.splitTime(this.modelValue);
    this.hours = e, this.minutes = s;
  },
  methods: {
    splitTime(e) {
      return e.split(":");
    },
    formatNumberForTime(e) {
      return e < 10 ? `0${e}` : `${e}`;
    }
  },
  components: { VuPopover: re, VuPopover: re }
}, jc = /* @__PURE__ */ Object.assign(Ec, {
  setup(e) {
    const s = inject("vuInputComposition", false), t = inject(Qe, false);
    return (i, o) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["vu-time-picker form-group", i.classes])
    }, [
      i.label.length ? (openBlock(), createElementBlock("label", Vc, [
        createTextVNode(toDisplayString(i.label) + " ", 1),
        i.required ? (openBlock(), createElementBlock("span", $c, " *")) : createCommentVNode("", true)
      ])) : createCommentVNode("", true),
      e.useNativeInput || unref(t) ? (openBlock(), createElementBlock("div", xc, [
        createBaseVNode("input", mergeProps(i.$attrs, {
          value: i.value,
          placeholder: i.placeholder,
          disabled: i.disabled,
          type: "time",
          class: "vu-time-picker__display-native form-control",
          style: { width: "fit-content" },
          onInput: o[0] || (o[0] = ({ target: n }) => {
            unref(s) || (n.composing = false), i.$emit("update:modelValue", n.value);
          })
        }), null, 16, Mc)
      ])) : i.disabled ? (openBlock(), createElementBlock("div", zc, [
        createBaseVNode("span", null, toDisplayString(i.hours), 1),
        createTextVNode(":"),
        createBaseVNode("span", null, toDisplayString(i.minutes), 1)
      ])) : (openBlock(), createBlock(re, {
        key: 2,
        class: "vu-time-picker__popover",
        style: { width: "fit-content" },
        show: i.isPopoverOpen
      }, {
        body: withCtx(() => [
          createBaseVNode("div", Lc, [
            createBaseVNode("div", Tc, [
              (openBlock(true), createElementBlock(Fragment, null, renderList([...Array(24).keys()], (n) => (openBlock(), createElementBlock("label", {
                key: n,
                class: normalizeClass({ "vu-time-picker__hours--selected": i.hours === i.formatNumberForTime(n) })
              }, [
                createBaseVNode("span", null, toDisplayString(i.formatNumberForTime(n)), 1),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": o[1] || (o[1] = (r) => i.hours = r),
                  type: "radio",
                  name: "hours",
                  value: i.formatNumberForTime(n)
                }, null, 8, Ac), [
                  [vModelRadio, i.hours]
                ])
              ], 2))), 128))
            ]),
            createBaseVNode("div", Fc, [
              (openBlock(true), createElementBlock(Fragment, null, renderList([...Array(60).keys()], (n) => (openBlock(), createElementBlock("label", {
                key: n,
                class: normalizeClass({ "vu-time-picker__minutes--selected": i.minutes === i.formatNumberForTime(n) })
              }, [
                createBaseVNode("span", null, toDisplayString(i.formatNumberForTime(n)), 1),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": o[2] || (o[2] = (r) => i.minutes = r),
                  type: "radio",
                  name: "minutes",
                  value: i.formatNumberForTime(n)
                }, null, 8, Dc), [
                  [vModelRadio, i.minutes]
                ])
              ], 2))), 128))
            ])
          ])
        ]),
        default: withCtx(() => [
          createBaseVNode("div", Pc, [
            createBaseVNode("span", null, toDisplayString(i.hours), 1),
            createTextVNode(":"),
            createBaseVNode("span", null, toDisplayString(i.minutes), 1)
          ])
        ]),
        _: 1
      }, 8, ["show"])),
      (openBlock(true), createElementBlock(Fragment, null, renderList(i.errorBucket, (n, r) => (openBlock(), createElementBlock("span", {
        key: `${r}-error-${n}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, toDisplayString(n), 1))), 128)),
      i.helper.length ? (openBlock(), createElementBlock("span", Nc, toDisplayString(i.helper), 1)) : createCommentVNode("", true)
    ], 2));
  }
}), Rc = /* @__PURE__ */ O(jc, [["__scopeId", "data-v-2ece058d"]]), Uc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Rc
}, Symbol.toStringTag, { value: "Module" }));
function Hc(e, s) {
  let t;
  for (let i = 0; i < s; i++)
    t = (e == null ? void 0 : e.parentElement) || t;
  return t ?? document.documentElement;
}
function qc(e) {
  const {
    enabled: s = true,
    el: t,
    placeholder: i,
    class: o = "",
    ancestor: n = 0
  } = e || {}, r = ref(false), d = ref(), u = ref();
  let f = ref([]), c = ref(/* @__PURE__ */ new WeakMap());
  const h2 = ref(0), v = computed(() => f.value.map((P) => c.value.get(P)).reduce((P, De) => P || De, false)), k = computed(
    () => r.value === false && v.value
  );
  watch(k, (E, P) => {
    n && w();
  }, { flush: "sync" }), watch(k, (E, P) => {
    T(!!n);
  }, { flush: "post" });
  const w = () => {
    if (d.value) {
      const E = toValue$1(i);
      E && d.value.unobserve(E);
    }
  }, T = async (E) => {
    if (d.value) {
      E && await nextTick();
      const P = toValue$1(i);
      P && d.value.observe(P);
    }
  }, D = (E) => {
    let P = E[0].intersectionRatio;
    n ? k.value ? (r.value = P > h2.value, h2.value = P) : r.value = P === 1 : r.value = k.value ? P > 0 : P === 1;
  }, Be = () => {
    if (s) {
      const E = toValue$1(t);
      if (f.value = [], !E)
        return;
      u.value = new IntersectionObserver(
        (De) => {
          De.forEach(({ intersectionRatio: Dt, target: Ue }) => {
            c.value.set(Ue, Dt > 0);
          });
        }
      );
      let { nextElementSibling: P } = n ? Hc(E, n) : E;
      if (n === 0)
        for (; P && (P == null ? void 0 : P.className.indexOf(o)) === -1; )
          f.value.push(P), u.value.observe(P), P = P == null ? void 0 : P.nextElementSibling;
      else if (P)
        for (; P && P.querySelectorAll(`.${o}`).length === 0; )
          f.value.push(P), u.value.observe(P), P = P == null ? void 0 : P.nextElementSibling;
      d.value = new IntersectionObserver(
        D,
        {
          threshold: 1
        }
      ), T(k.value);
    }
  }, G = async () => {
    ne(), Be();
  }, ne = () => {
    u.value && u.value.disconnect(), d.value && d.value.disconnect(), delete u.value, delete d.value;
  };
  return onMounted(() => {
    Be();
  }), onUnmounted(() => {
    ne();
  }), { stick: k, refresh: G };
}
const Ds = (e) => (pushScopeId("data-v-1de1d51d"), e = e(), popScopeId(), e), Wc = /* @__PURE__ */ Ds(() => /* @__PURE__ */ createBaseVNode("hr", null, null, -1)), Kc = { class: "vu-timeline-divider-date__date" }, Gc = /* @__PURE__ */ Ds(() => /* @__PURE__ */ createBaseVNode("hr", null, null, -1)), Yc = {
  name: "vu-timeline-divider"
}, Xc = /* @__PURE__ */ defineComponent({
  ...Yc,
  props: {
    date: {},
    label: {},
    sticky: { type: Boolean },
    forceStick: { type: Boolean }
  },
  setup(e) {
    const s = inject("lang"), t = inject(ri, 0), i = inject(ai, void 0), o = ref(null), n = ref(null), r = e, { stick: d, refresh: u } = qc({ enabled: r.sticky, el: o, placeholder: n, class: "vu-timeline-divider-date", ancestor: t }), f = (c) => {
      const h2 = new Date(c), v = h2.getFullYear(), k = (/* @__PURE__ */ new Date()).getFullYear(), w = v === k ? { weekday: "long", month: "long", day: "numeric" } : {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      };
      return h2.toLocaleDateString(s, w);
    };
    return (c, h2) => (openBlock(), createElementBlock(Fragment, null, [
      createBaseVNode("div", {
        class: normalizeClass(["vu-timeline-divider__placeholder", { "vu-timeline-divider__detached": unref(d) && unref(t), "vu-timeline-divider--hidden": unref(d) && unref(t) }]),
        ref_key: "placeholder",
        ref: n
      }, null, 2),
      (openBlock(), createBlock(Teleport, {
        to: unref(i),
        disabled: !unref(i) || !unref(d)
      }, [
        createBaseVNode("div", {
          class: normalizeClass(["vu-timeline-divider-date", [
            { "vu-timeline-divider-date--top": unref(d) || r.forceStick },
            unref(t) && (unref(d) || r.forceStick) && unref(i) && "absolute" || (unref(d) || r.forceStick) && "sticky"
          ]]),
          ref_key: "el",
          ref: o
        }, [
          Wc,
          createBaseVNode("div", Kc, toDisplayString(c.label || f(c.date)), 1),
          Gc
        ], 2)
      ], 8, ["to", "disabled"]))
    ], 64));
  }
}), Jc = /* @__PURE__ */ O(Xc, [["__scopeId", "data-v-1de1d51d"]]), Qc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Jc
}, Symbol.toStringTag, { value: "Module" })), Zc = (e) => {
  try {
    const { label: s, id: t } = e;
    if (s && t)
      return true;
  } catch {
  }
  return false;
}, eh = {
  name: "vu-tree-view-item",
  mixins: [Ie],
  emits: ["load-complete", "click", "expand", "select"],
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Array,
      default: () => []
    },
    depth: {
      type: Number,
      default: () => 0
    },
    hover: {
      type: Boolean,
      default: false
    },
    siblingsHaveNoType: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      validator: Zc,
      required: true
    },
    main: {
      type: Boolean,
      default: false
    },
    leftPadding: {
      type: Number,
      default: 0
    }
  },
  inject: {
    vuTreeViewLazy: {
      default: false
    },
    vuTreeViewLeftPadBase: {
      default: 38
    },
    vuTreeViewLeftPadFunc: {
      type: Function,
      default: void 0
    },
    vuTreeViewLeftPadReduce: {
      type: Boolean,
      default: false
    },
    vuTreeIcon: {
      type: String,
      default: "expand"
    }
  },
  data: () => ({
    guid: ye
  }),
  watch: {
    item: {
      deep: true,
      handler(e) {
        this.isLoading && this.$emit("load-complete", e);
      }
    }
  },
  created() {
    this.item.expanded && !this.isExpanded && this.$emit("expand", this.item), this.item.selected && !this.isSelected && this.$emit("select", this.item);
  },
  computed: {
    otherSlots() {
      return Object.fromEntries(this.$slots.filter((e) => e.startsWith("item-")));
    },
    showTreeIcon() {
      return (
        // eslint-disable-next-line operator-linebreak
        this.hasItems || this.vuTreeViewLazy && !this.item.leaf && this.item.items === void 0 && !this.isLoading
      );
    },
    hasItems() {
      return this.item.items && this.item.items.length > 0;
    },
    isSelected() {
      return this.selected.includes(this.item);
    },
    isExpanded() {
      return this.expanded.includes(this.item);
    },
    isLoading() {
      return this.vuTreeViewLazy && this.loading.includes(this.item);
    },
    anyChildrenHasIcon() {
      return this.hasItems && this.item.items.some((e) => e.icon !== void 0);
    },
    getTreeIconClass() {
      return this.isExpanded ? `${this.vuTreeIcon}-down` : `${this.vuTreeIcon}-right`;
    },
    calcLeftPadding() {
      return this.vuTreeViewLeftPadFunc ? this.vuTreeViewLeftPadFunc(this.depth, this.leftPadding) : this.depth ? this.vuTreeViewLeftPadReduce ? Math.max(this.leftPadding + this.vuTreeViewLeftPadBase - 6 * this.depth, this.leftPadding + 6) : this.leftPadding + this.vuTreeViewLeftPadBase : 0;
    }
  },
  methods: {
    onClick(e) {
      var t, i;
      [(t = this.$refs.loadingSpinner) == null ? void 0 : t.$el, (i = this.$refs.treeIcon) == null ? void 0 : i.$el].filter((o) => o).every((o) => !o.contains(e.target)) && this.$emit("select", this.item);
    }
  },
  components: { VuIconBtn: U }
}, th = (e) => (pushScopeId("data-v-222dea3e"), e = e(), popScopeId(), e), sh = {
  key: 1,
  class: "vu-tree-view-item__tree-icon-loading",
  ref: "loadingSpinner"
}, nh = /* @__PURE__ */ th(() => /* @__PURE__ */ createBaseVNode("svg", {
  class: "vu-spin",
  viewBox: "25 25 50 50"
}, [
  /* @__PURE__ */ createBaseVNode("circle", {
    class: "path",
    cx: "50",
    cy: "50",
    r: "20",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "5",
    "stroke-miterlimit": "10"
  })
], -1)), ih = {
  key: 2,
  class: "vu-tree-view-item__tree-icon-placeholder"
}, lh = {
  key: 4,
  class: "vu-tree-view-item__type-icon-placeholder"
}, oh = { class: "vu-tree-view-item__label" };
function rh(e, s, t, i, o, n) {
  const r = resolveComponent("VuIconBtn"), d = resolveComponent("VuTreeViewItem", true), u = resolveDirective("tooltip");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", {
      class: normalizeClass(["vu-tree-view-item", {
        "vu-tree-view-item--selected": n.isSelected,
        "vu-tree-view-item--unselected": !n.isSelected,
        "vu-tree-view-item--main": t.main,
        "vu-tree-view-item--child": !t.main,
        "vu-tree-view-item--chevron-icon": n.vuTreeIcon === "chevron"
      }]),
      style: normalizeStyle({
        "padding-left": `${n.calcLeftPadding}px`
      }),
      onClick: s[1] || (s[1] = (...f) => n.onClick && n.onClick(...f))
    }, [
      n.showTreeIcon ? (openBlock(), createBlock(r, {
        key: 0,
        icon: n.getTreeIconClass,
        class: "vu-tree-view-item__tree-icon",
        onClick: s[0] || (s[0] = (f) => e.$emit("expand", t.item)),
        ref: "treeIcon"
      }, null, 8, ["icon"])) : n.isLoading ? (openBlock(), createElementBlock("div", sh, [
        renderSlot(e.$slots, "itemLoading", {}, () => [
          nh
        ], true)
      ], 512)) : (openBlock(), createElementBlock("div", ih)),
      t.item.icon ? (openBlock(), createBlock(r, {
        key: 3,
        class: "vu-tree-view-item__type-icon",
        color: "default-inactive",
        icon: t.item.icon
      }, null, 8, ["icon"])) : t.siblingsHaveNoType ? (openBlock(), createElementBlock("div", lh)) : createCommentVNode("", true),
      renderSlot(e.$slots, "item-" + t.item.type || "default", {}, () => [
        withDirectives((openBlock(), createElementBlock("div", oh, [
          createTextVNode(toDisplayString(t.item.label), 1)
        ])), [
          [
            u,
            t.item.label,
            void 0,
            { ellipsis: true }
          ]
        ])
      ], true)
    ], 6),
    n.hasItems && n.isExpanded ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(t.item.items, (f) => (openBlock(), createBlock(d, {
      key: `${f.id}`,
      item: f,
      depth: t.depth + 1,
      "left-padding": n.calcLeftPadding,
      selected: t.selected,
      loading: t.loading,
      expanded: t.expanded,
      "siblings-have-no-type": n.anyChildrenHasIcon,
      onLoadComplete: s[2] || (s[2] = (c) => e.$emit("load-complete", c)),
      onExpand: s[3] || (s[3] = (c) => e.$emit("expand", c)),
      onSelect: s[4] || (s[4] = (c) => e.$emit("select", c))
    }, null, 8, ["item", "depth", "left-padding", "selected", "loading", "expanded", "siblings-have-no-type"]))), 128)) : createCommentVNode("", true)
  ], 64);
}
const ht = /* @__PURE__ */ O(eh, [["render", rh], ["__scopeId", "data-v-222dea3e"]]), ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ht
}, Symbol.toStringTag, { value: "Module" })), uh = {
  name: "vu-tree-view",
  emits: ["update:selected", "update:expanded", "fetch", "item-click", "update:loading"],
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Array,
      required: false,
      default: void 0
    },
    items: {
      type: Array,
      required: true
    },
    exclusive: {
      type: Boolean,
      default: true
    },
    firstLevelBigger: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    innerLoading: []
  }),
  methods: {
    toggleSelect(e) {
      if (this.selected.includes(e)) {
        const s = this.expanded.slice();
        s.splice(s.indexOf(e), 1), this.$emit("update:selected", s);
      } else
        this.exclusive ? this.$emit("update:selected", [e]) : this.$emit("update:selected", [e].concat(this.expanded || []));
    },
    toggleExpand(e) {
      const s = this.expanded.slice();
      this.expanded.includes(e) ? (s.splice(s.indexOf(e), 1), this.$emit("update:expanded", s)) : e.items === void 0 ? (this.$emit("fetch", e), this.loading === void 0 ? this.innerLoading.push(e) : this.$emit("update:loading", [e].concat(this.loading || []))) : (s.push(e), this.$emit("update:expanded", s));
    },
    onLoad(e) {
      this.loading === void 0 && this.innerLoading.splice(this.innerLoading.indexOf(e)), e.items && e.items.length > 0 && !e.leaf && this.$emit("update:expanded", [e].concat(this.expanded || []));
    }
  },
  components: { VuTreeViewItem: ht, VuScroller: Re, VuTreeViewItem: ht }
}, dh = { class: "vu-tree-view" };
function ch(e, s, t, i, o, n) {
  const r = resolveComponent("VuTreeViewItem"), d = resolveComponent("VuScroller");
  return openBlock(), createElementBlock("div", dh, [
    createVNode(d, null, {
      default: withCtx(() => [
        (openBlock(true), createElementBlock(Fragment, null, renderList(t.items, (u) => (openBlock(), createBlock(r, {
          key: `${u.id}`,
          item: u,
          loading: t.loading || e.innerLoading,
          expanded: t.expanded,
          selected: t.selected,
          main: t.firstLevelBigger,
          onExpand: n.toggleExpand,
          onSelect: n.toggleSelect,
          onLoadComplete: n.onLoad
        }, null, 8, ["item", "loading", "expanded", "selected", "main", "onExpand", "onSelect", "onLoadComplete"]))), 128))
      ]),
      _: 1
    })
  ]);
}
const hh = /* @__PURE__ */ O(uh, [["render", ch]]), fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: hh
}, Symbol.toStringTag, { value: "Module" })), Ee = "__v-click-outside", zs = typeof window < "u", mh = typeof navigator < "u", ph = zs && ("ontouchstart" in window || mh && navigator.msMaxTouchPoints > 0), gh = ph ? ["touchstart"] : ["click"];
function vh(e) {
  const s = typeof e == "function";
  if (!s && typeof e != "object")
    throw new Error("v-click-outside: Binding value must be a function or an object");
  return {
    handler: s ? e : e.handler,
    middleware: e.middleware || ((t) => t),
    events: e.events || gh,
    innerShow: e.innerShow !== false
  };
}
function yh({
  el: e,
  event: s,
  handler: t,
  middleware: i
}) {
  const o = s.path || s.composedPath && s.composedPath(), n = o ? o.indexOf(e) < 0 : !e.contains(s.target);
  s.target !== e && n && i(s) && t(s);
}
function Ns(e, { value: s }) {
  const {
    events: t,
    handler: i,
    middleware: o,
    innerShow: n
  } = vh(s);
  n && (e[Ee] = t.map((r) => ({
    event: r,
    handler: (d) => yh({
      event: d,
      el: e,
      handler: i,
      middleware: o
    })
  })), e[Ee].forEach(({ event: r, handler: d }) => setTimeout(() => {
    e[Ee] && document.documentElement.addEventListener(r, d, false);
  }, 0)));
}
function Es(e) {
  (e[Ee] || []).forEach(({ event: t, handler: i }) => document.documentElement.removeEventListener(t, i, false)), delete e[Ee];
}
function bh(e, { value: s, oldValue: t }) {
  JSON.stringify(s) !== JSON.stringify(t) && (Es(e), Ns(e, { value: s }));
}
const _h = {
  beforeMount: Ns,
  updated: bh,
  beforeUnmount: Es
}, ft = zs ? _h : {}, wh = {
  viewAll: "View all",
  contactsInCommon: "### contact$(s) in common",
  profile: "See full profile",
  message: "Start conversation",
  network: "Add user to my network",
  audio: "Add audio",
  conferencing: "Add video",
  screenshare: "Share screen",
  FR: "France",
  BR: "Brazil",
  CN: "China",
  DE: "Germany",
  ES: "Spain",
  GB: "United-Kingdom",
  HU: "Hungary",
  IT: "Italy",
  JP: "Japan",
  PL: "Poland",
  PT: "Portugal",
  RU: "Russia",
  SE: "Sweden",
  TR: "Turkey"
}, kh = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#73AF00;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>\r
<path style="fill:#FFE15A;" d="M251.41,135.209L65.354,248.46c-5.651,3.439-5.651,11.641,0,15.081L251.41,376.793  c2.819,1.716,6.36,1.716,9.18,0l186.057-113.251c5.651-3.439,5.651-11.641,0-15.081L260.59,135.209  C257.771,133.493,254.229,133.493,251.41,135.209z"/>\r
<circle style="fill:#41479B;" cx="256" cy="256.001" r="70.62"/>\r
<g>\r
	<path style="fill:#F5F5F5;" d="M195.401,219.874c-3.332,5.578-5.905,11.64-7.605,18.077c39.149-2.946,97.062,8.006,133.922,43.773   c2.406-6.141,3.994-12.683,4.59-19.522C288.247,230.169,235.628,218.778,195.401,219.874z"/>\r
	<path style="fill:#F5F5F5;" d="M258.925,280.1l1.88,5.638l5.943,0.046c0.769,0.006,1.088,0.988,0.47,1.445l-4.781,3.531   l1.793,5.666c0.232,0.734-0.604,1.341-1.229,0.893l-4.835-3.456l-4.835,3.456c-0.626,0.448-1.461-0.159-1.229-0.893l1.793-5.666   l-4.781-3.531c-0.619-0.457-0.3-1.439,0.469-1.445l5.943-0.046l1.88-5.638C257.649,279.37,258.681,279.37,258.925,280.1z"/>\r
	<path style="fill:#F5F5F5;" d="M282.024,294.685l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C281.474,294.37,281.919,294.37,282.024,294.685z"/>\r
	<path style="fill:#F5F5F5;" d="M248.938,269.39l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C248.388,269.076,248.833,269.076,248.938,269.39z"/>\r
	<path style="fill:#F5F5F5;" d="M204.13,266.448l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C203.581,266.134,204.025,266.134,204.13,266.448z"/>\r
	<path style="fill:#F5F5F5;" d="M241.614,293.847l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C241.065,293.534,241.51,293.534,241.614,293.847z"/>\r
	<path style="fill:#F5F5F5;" d="M220.99,264.755l0.662,1.984l2.092,0.017c0.27,0.002,0.383,0.348,0.166,0.509l-1.683,1.242   l0.631,1.994c0.082,0.258-0.212,0.472-0.433,0.314l-1.702-1.216l-1.702,1.216c-0.221,0.158-0.514-0.056-0.433-0.314l0.631-1.994   l-1.683-1.242c-0.217-0.161-0.106-0.507,0.166-0.509l2.092-0.017l0.662-1.984C220.541,264.498,220.904,264.498,220.99,264.755z"/>\r
	<path style="fill:#F5F5F5;" d="M283.819,223.794l0.828,2.482l2.616,0.02c0.339,0.002,0.479,0.435,0.206,0.636l-2.104,1.554   l0.789,2.495c0.103,0.323-0.266,0.59-0.541,0.393l-2.129-1.522l-2.129,1.522c-0.276,0.198-0.643-0.071-0.541-0.393l0.789-2.495   l-2.104-1.554c-0.273-0.201-0.132-0.633,0.206-0.636l2.616-0.02l0.828-2.482C283.257,223.472,283.712,223.472,283.819,223.794z"/>\r
	<path style="fill:#F5F5F5;" d="M207.012,252.617l0.662,1.984l2.092,0.017c0.27,0.002,0.383,0.348,0.166,0.509l-1.683,1.242   l0.631,1.994c0.082,0.258-0.212,0.472-0.433,0.314l-1.702-1.216l-1.702,1.216c-0.221,0.158-0.514-0.056-0.433-0.314l0.631-1.994   l-1.683-1.242c-0.217-0.161-0.106-0.506,0.166-0.509l2.092-0.017l0.662-1.984C206.563,252.36,206.926,252.36,207.012,252.617z"/>\r
	<path style="fill:#F5F5F5;" d="M217.112,280.581l1.002,3.006l3.168,0.024c0.41,0.003,0.58,0.526,0.25,0.77l-2.549,1.882l0.956,3.02   c0.124,0.391-0.321,0.715-0.655,0.476l-2.578-1.842l-2.578,1.842c-0.333,0.238-0.779-0.085-0.655-0.476l0.956-3.02l-2.549-1.882   c-0.33-0.244-0.16-0.767,0.25-0.77l3.168-0.024l1.002-3.006C216.433,280.193,216.983,280.193,217.112,280.581z"/>\r
	<path style="fill:#F5F5F5;" d="M294.903,295.315l0.63,1.891l1.993,0.015c0.258,0.002,0.365,0.331,0.158,0.484l-1.603,1.184   l0.601,1.9c0.078,0.246-0.202,0.449-0.413,0.299l-1.621-1.159l-1.622,1.159c-0.21,0.15-0.49-0.053-0.413-0.299l0.601-1.9   l-1.603-1.184c-0.207-0.153-0.1-0.482,0.158-0.484l1.993-0.015l0.63-1.891C294.475,295.07,294.822,295.07,294.903,295.315z"/>\r
	<path style="fill:#F5F5F5;" d="M301.877,280.885l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C301.327,280.57,301.772,280.57,301.877,280.885z"/>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Sh = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>\r
<g>\r
	<path style="fill:#FFE15A;" d="M85.007,140.733l8.416,25.234l26.6,0.206c3.444,0.026,4.872,4.422,2.101,6.467l-21.398,15.801   l8.023,25.362c1.038,3.284-2.7,5.999-5.502,3.997l-21.64-15.469l-21.64,15.468c-2.802,2.003-6.54-0.714-5.502-3.997l8.023-25.362   l-21.398-15.8c-2.771-2.046-1.343-6.441,2.101-6.467l26.6-0.206l8.416-25.234C79.297,137.465,83.918,137.465,85.007,140.733z"/>\r
	<path style="fill:#FFE15A;" d="M181.599,146.951l6.035,8.23l9.739-3.046c1.261-0.394,2.298,1.044,1.526,2.115l-5.962,8.281   l5.906,8.321c0.765,1.077-0.282,2.508-1.54,2.105l-9.719-3.111l-6.089,8.189c-0.788,1.06-2.473,0.506-2.478-0.814l-0.045-10.205   l-9.67-3.261c-1.251-0.423-1.246-2.195,0.009-2.609l9.69-3.196l0.114-10.204C179.129,146.427,180.818,145.886,181.599,146.951z"/>\r
	<path style="fill:#FFE15A;" d="M144.857,122.421l10.145,1.102l4.328-9.241c0.561-1.196,2.321-0.991,2.591,0.302l2.086,9.988   l10.126,1.26c1.311,0.163,1.66,1.901,0.513,2.558l-8.855,5.07l1.931,10.02c0.25,1.298-1.295,2.166-2.274,1.279l-7.559-6.855   l-8.932,4.932c-1.156,0.639-2.461-0.563-1.919-1.768l4.183-9.308l-7.452-6.972C142.805,123.89,143.544,122.279,144.857,122.421z"/>\r
	<path style="fill:#FFE15A;" d="M160.895,221.314l-6.035,8.23l-9.739-3.046c-1.261-0.394-2.298,1.044-1.526,2.115l5.962,8.281   l-5.906,8.321c-0.765,1.077,0.282,2.508,1.54,2.105l9.719-3.111l6.089,8.189c0.788,1.06,2.473,0.506,2.478-0.814l0.045-10.205   l9.67-3.261c1.252-0.423,1.246-2.195-0.009-2.609l-9.69-3.196l-0.114-10.204C163.363,220.791,161.676,220.248,160.895,221.314z"/>\r
	<path style="fill:#FFE15A;" d="M197.635,198.263l-10.145,1.102l-4.328-9.241c-0.561-1.196-2.321-0.991-2.591,0.302l-2.087,9.988   l-10.126,1.26c-1.311,0.163-1.66,1.901-0.513,2.558l8.855,5.07l-1.931,10.02c-0.25,1.298,1.295,2.166,2.274,1.279l7.559-6.855   l8.932,4.932c1.156,0.639,2.461-0.563,1.919-1.768l-4.183-9.308l7.452-6.972C199.689,199.732,198.95,198.121,197.635,198.263z"/>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Ch = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#464655;" d="M512,200.093H0V97.104c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828  L512,200.093L512,200.093z"/>\r
<path style="fill:#FFE15A;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V311.909h512v102.988  C512,419.773,508.047,423.725,503.172,423.725z"/>\r
<rect y="200.091" style="fill:#FF4B55;" width="512" height="111.81"/>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Ih = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#C8414B;" d="M8.828,423.725h494.345c4.875,0,8.828-3.953,8.828-8.828V97.104c0-4.875-3.953-8.828-8.828-8.828  H8.828C3.953,88.277,0,92.229,0,97.104v317.793C0,419.773,3.953,423.725,8.828,423.725z"/>\r
<rect y="158.901" style="fill:#FFD250;" width="512" height="194.21"/>\r
<path style="fill:#C8414B;" d="M216.276,256.001l7.485-33.681c0.69-3.102-1.671-6.044-4.849-6.044h-5.272  c-3.177,0-5.537,2.942-4.849,6.044L216.276,256.001z"/>\r
<rect x="207.45" y="238.341" style="fill:#F5F5F5;" width="17.655" height="75.03"/>\r
<rect x="203.03" y="229.521" style="fill:#FAB446;" width="26.483" height="8.828"/>\r
<g>\r
	<rect x="185.38" y="256.001" style="fill:#C8414B;" width="44.14" height="8.828"/>\r
	<polygon style="fill:#C8414B;" points="229.517,291.311 203.034,282.484 203.034,273.656 229.517,282.484  "/>\r
	<path style="fill:#C8414B;" d="M83.862,256.001l7.485-33.681c0.69-3.102-1.671-6.044-4.849-6.044h-5.272   c-3.177,0-5.537,2.942-4.849,6.044L83.862,256.001z"/>\r
</g>\r
<path style="fill:#F5F5F5;" d="M114.759,229.518c-4.875,0-8.828,3.953-8.828,8.828v57.379c0,10.725,10.01,30.897,44.138,30.897  s44.138-20.171,44.138-30.897v-57.379c0-4.875-3.953-8.828-8.828-8.828H114.759z"/>\r
<g>\r
	<path style="fill:#C8414B;" d="M150.069,273.656h-44.138v-35.31c0-4.875,3.953-8.828,8.828-8.828h35.31V273.656z"/>\r
	<path style="fill:#C8414B;" d="M150.069,273.656h44.138v22.069c0,12.189-9.88,22.069-22.069,22.069l0,0   c-12.189,0-22.069-9.88-22.069-22.069V273.656z"/>\r
</g>\r
<path style="fill:#FAB446;" d="M105.931,273.656h44.138v22.069c0,12.189-9.88,22.069-22.069,22.069l0,0  c-12.189,0-22.069-9.88-22.069-22.069V273.656z"/>\r
<g>\r
	<path style="fill:#C8414B;" d="M141.241,313.281v-39.625h-8.828v43.693C135.697,316.683,138.664,315.229,141.241,313.281z"/>\r
	<path style="fill:#C8414B;" d="M123.586,317.349v-43.693h-8.828v39.625C117.336,315.229,120.303,316.683,123.586,317.349z"/>\r
</g>\r
<rect x="114.76" y="256.001" style="fill:#FFB441;" width="26.483" height="8.828"/>\r
<g>\r
	<rect x="114.76" y="238.341" style="fill:#FAB446;" width="26.483" height="8.828"/>\r
	<rect x="119.17" y="243.591" style="fill:#FAB446;" width="17.655" height="15.992"/>\r
</g>\r
<rect x="75.03" y="238.341" style="fill:#F5F5F5;" width="17.655" height="75.03"/>\r
<g>\r
	<rect x="70.62" y="308.971" style="fill:#FAB446;" width="26.483" height="8.828"/>\r
	<rect x="70.62" y="229.521" style="fill:#FAB446;" width="26.483" height="8.828"/>\r
</g>\r
<rect x="66.21" y="317.791" style="fill:#5064AA;" width="35.31" height="8.828"/>\r
<rect x="207.45" y="308.971" style="fill:#FAB446;" width="26.483" height="8.828"/>\r
<rect x="198.62" y="317.791" style="fill:#5064AA;" width="35.31" height="8.828"/>\r
<rect x="123.59" y="220.691" style="fill:#FAB446;" width="52.966" height="8.828"/>\r
<rect x="145.66" y="194.211" style="fill:#FFB441;" width="8.828" height="26.483"/>\r
<g>\r
	<path style="fill:#F5F5F5;" d="M141.241,207.449c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241C154.483,201.509,148.543,207.449,141.241,207.449z M141.241,189.794   c-2.435,0-4.414,1.978-4.414,4.414c0,2.435,1.978,4.414,4.414,4.414s4.414-1.978,4.414-4.414   C145.655,191.773,143.677,189.794,141.241,189.794z"/>\r
	<path style="fill:#F5F5F5;" d="M158.897,207.449c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241S166.198,207.449,158.897,207.449z M158.897,189.794c-2.435,0-4.414,1.978-4.414,4.414   c0,2.435,1.978,4.414,4.414,4.414c2.435,0,4.414-1.978,4.414-4.414C163.31,191.773,161.332,189.794,158.897,189.794z"/>\r
	<path style="fill:#F5F5F5;" d="M176.552,216.277c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241S183.853,216.277,176.552,216.277z M176.552,198.622c-2.435,0-4.414,1.978-4.414,4.414   c0,2.435,1.978,4.414,4.414,4.414c2.435,0,4.414-1.978,4.414-4.414S178.987,198.622,176.552,198.622z"/>\r
	<path style="fill:#F5F5F5;" d="M123.586,216.277c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241C136.828,210.337,130.888,216.277,123.586,216.277z M123.586,198.622   c-2.435,0-4.414,1.978-4.414,4.414c0,2.435,1.978,4.414,4.414,4.414s4.414-1.979,4.414-4.415   C128,200.6,126.022,198.622,123.586,198.622z"/>\r
</g>\r
<path style="fill:#FAB446;" d="M176.552,291.311v4.414c0,2.434-1.98,4.414-4.414,4.414s-4.414-1.98-4.414-4.414v-4.414H176.552   M185.379,282.484h-26.483v13.241c0,7.302,5.94,13.241,13.241,13.241c7.302,0,13.241-5.94,13.241-13.241v-13.241H185.379z"/>\r
<path style="fill:#FFA0D2;" d="M172.138,264.829L172.138,264.829c-4.875,0-8.828-3.953-8.828-8.828v-8.828  c0-4.875,3.953-8.828,8.828-8.828l0,0c4.875,0,8.828,3.953,8.828,8.828v8.828C180.966,260.876,177.013,264.829,172.138,264.829z"/>\r
<circle style="fill:#5064AA;" cx="150.07" cy="273.651" r="13.241"/>\r
<rect x="145.66" y="176.551" style="fill:#FAB446;" width="8.828" height="26.483"/>\r
<path style="fill:#C8414B;" d="M123.586,220.691l-8.828-8.828l5.171-5.171c7.993-7.993,18.835-12.484,30.14-12.484l0,0  c11.305,0,22.146,4.491,30.14,12.484l5.171,5.171l-8.828,8.828H123.586z"/>\r
<g>\r
	<circle style="fill:#FFD250;" cx="150.07" cy="211.861" r="4.414"/>\r
	<circle style="fill:#FFD250;" cx="132.41" cy="211.861" r="4.414"/>\r
	<circle style="fill:#FFD250;" cx="167.72" cy="211.861" r="4.414"/>\r
</g>\r
<g>\r
	<rect x="70.62" y="256.001" style="fill:#C8414B;" width="44.14" height="8.828"/>\r
	<polygon style="fill:#C8414B;" points="70.621,291.311 97.103,282.484 97.103,273.656 70.621,282.484  "/>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Bh = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">\r
<path style="fill:#41479B;" d="M170.667,423.721H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.1c0-4.875,3.953-8.828,8.828-8.828  h161.839V423.721z"/>\r
<rect x="170.67" y="88.277" style="fill:#F5F5F5;" width="170.67" height="335.45"/>\r
<path style="fill:#FF4B55;" d="M503.172,423.721H341.333V88.273h161.839c4.875,0,8.828,3.953,8.828,8.828v317.793  C512,419.77,508.047,423.721,503.172,423.721z"/>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Oh = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512.002 512.002;" xml:space="preserve">\r
<path style="fill:#41479B;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.772,508.047,423.725,503.172,423.725z"/>\r
<path style="fill:#F5F5F5;" d="M512,97.104c0-4.875-3.953-8.828-8.828-8.828h-39.495l-163.54,107.147V88.276h-88.276v107.147  L48.322,88.276H8.828C3.953,88.276,0,92.229,0,97.104v22.831l140.309,91.927H0v88.276h140.309L0,392.066v22.831  c0,4.875,3.953,8.828,8.828,8.828h39.495l163.54-107.147v107.147h88.276V316.578l163.54,107.147h39.495  c4.875,0,8.828-3.953,8.828-8.828v-22.831l-140.309-91.927H512v-88.276H371.691L512,119.935V97.104z"/>\r
<g>\r
	<polygon style="fill:#FF4B55;" points="512,229.518 282.483,229.518 282.483,88.276 229.517,88.276 229.517,229.518 0,229.518    0,282.483 229.517,282.483 229.517,423.725 282.483,423.725 282.483,282.483 512,282.483  "/>\r
	<path style="fill:#FF4B55;" d="M178.948,300.138L0.25,416.135c0.625,4.263,4.14,7.59,8.577,7.59h12.159l190.39-123.586h-32.428   V300.138z"/>\r
	<path style="fill:#FF4B55;" d="M346.388,300.138H313.96l190.113,123.404c4.431-0.472,7.928-4.09,7.928-8.646v-7.258   L346.388,300.138z"/>\r
	<path style="fill:#FF4B55;" d="M0,106.849l161.779,105.014h32.428L5.143,89.137C2.123,90.54,0,93.555,0,97.104V106.849z"/>\r
	<path style="fill:#FF4B55;" d="M332.566,211.863L511.693,95.586c-0.744-4.122-4.184-7.309-8.521-7.309h-12.647L300.138,211.863   H332.566z"/>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Vh = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#FF4B55;" d="M512,200.093H0V97.104c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828  L512,200.093L512,200.093z"/>\r
<path style="fill:#73AF00;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V311.909h512v102.988  C512,419.773,508.047,423.725,503.172,423.725z"/>\r
<rect y="200.091" style="fill:#F5F5F5;" width="512" height="111.81"/>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, $h = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">\r
<path style="fill:#73AF00;" d="M170.667,423.721H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.1c0-4.875,3.953-8.828,8.828-8.828  h161.839V423.721z"/>\r
<rect x="170.67" y="88.277" style="fill:#F5F5F5;" width="170.67" height="335.45"/>\r
<path style="fill:#FF4B55;" d="M503.172,423.721H341.333V88.273h161.839c4.875,0,8.828,3.953,8.828,8.828v317.793  C512,419.77,508.047,423.721,503.172,423.721z"/>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, xh = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#F5F5F5;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>\r
<circle style="fill:#FF4B55;" cx="256" cy="256.001" r="97.1"/>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Mh = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#FF4B55;" d="M0,256h512v158.897c0,4.875-3.953,8.828-8.828,8.828H8.828c-4.875,0-8.828-3.953-8.828-8.828V256z"/>\r
<path style="fill:#F5F5F5;" d="M512,256H0V97.103c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828L512,256  L512,256z"/>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Ph = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>\r
<path style="fill:#73AF00;" d="M185.379,88.277H8.828C3.953,88.277,0,92.229,0,97.104v317.793c0,4.875,3.953,8.828,8.828,8.828  H185.38V88.277H185.379z"/>\r
<circle style="fill:#FFE15A;" cx="185.45" cy="256.001" r="79.38"/>\r
<path style="fill:#FF4B55;" d="M211.932,229.518v35.31c0,14.603-11.88,26.483-26.483,26.483s-26.483-11.88-26.483-26.483v-35.31  H211.932 M220.759,211.863h-70.621c-4.875,0-8.828,3.953-8.828,8.828v44.138c0,24.376,19.762,44.138,44.138,44.138  s44.138-19.762,44.138-44.138v-44.138C229.587,215.816,225.634,211.863,220.759,211.863L220.759,211.863z"/>\r
<path style="fill:#F5F5F5;" d="M211.932,229.518v35.31c0,14.603-11.88,26.483-26.483,26.483s-26.483-11.88-26.483-26.483v-35.31  H211.932"/>\r
<g>\r
	<circle style="fill:#FFE15A;" cx="150.07" cy="220.691" r="4.414"/>\r
	<circle style="fill:#FFE15A;" cx="220.69" cy="220.691" r="4.414"/>\r
	<circle style="fill:#FFE15A;" cx="150.07" cy="256.001" r="4.414"/>\r
	<circle style="fill:#FFE15A;" cx="220.69" cy="256.001" r="4.414"/>\r
	<circle style="fill:#FFE15A;" cx="185.38" cy="220.691" r="4.414"/>\r
	<circle style="fill:#FFE15A;" cx="211.88" cy="288.551" r="4.414"/>\r
	<circle style="fill:#FFE15A;" cx="159.4" cy="288.551" r="4.414"/>\r
</g>\r
<g>\r
	<path style="fill:#41479B;" d="M191.149,253.763v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602   L191.149,253.763"/>\r
	<path style="fill:#41479B;" d="M191.149,235.741v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602H191.149"/>\r
	<path style="fill:#41479B;" d="M191.149,271.97v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602H191.149"/>\r
	<path style="fill:#41479B;" d="M206.506,253.763v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602   L206.506,253.763"/>\r
	<path style="fill:#41479B;" d="M175.794,253.763v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602   L175.794,253.763"/>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Lh = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#F5F5F5;" d="M512,200.093H0V97.104c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828  L512,200.093L512,200.093z"/>\r
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V311.909h512v102.988  C512,419.773,508.047,423.725,503.172,423.725z"/>\r
<rect y="200.091" style="fill:#41479B;" width="512" height="111.81"/>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Th = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#4173CD;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>\r
<polygon style="fill:#FFE15A;" points="512,229.518 211.862,229.518 211.862,88.277 158.897,88.277 158.897,229.518 0,229.518   0,282.484 158.897,282.484 158.897,423.725 211.862,423.725 211.862,282.484 512,282.484 "/>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Ah = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">\r
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>\r
<g>\r
	<path style="fill:#F5F5F5;" d="M253.474,225.753l13.837,18.101l21.606-7.232c1.208-0.404,2.236,0.962,1.512,2.01l-12.939,18.753   l13.555,18.314c0.758,1.024-0.224,2.423-1.444,2.059l-21.834-6.511l-13.228,18.55c-0.739,1.037-2.375,0.536-2.406-0.737   l-0.555-22.777l-21.73-6.849c-1.215-0.383-1.244-2.092-0.042-2.515l21.491-7.566l-0.202-22.783   C251.083,225.296,252.701,224.741,253.474,225.753z"/>\r
	<path style="fill:#F5F5F5;" d="M176.956,326.662c-38.995,0-70.627-31.633-70.627-70.663c0-38.958,31.633-70.662,70.627-70.662   c14.508,0,27.887,4.462,39.037,12.014c1.707,1.156,3.656-1.087,2.227-2.573c-16.664-17.325-40.248-27.894-66.398-27.001   c-44.926,1.533-82.118,37.553-84.989,82.413c-3.287,51.383,37.399,94.086,88.055,94.086c24.953,0,47.379-10.432,63.393-27.112   c1.415-1.473-0.538-3.683-2.229-2.537C204.89,322.196,191.489,326.662,176.956,326.662z"/>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
<g>\r
</g>\r
</svg>\r
`, Zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BR: kh,
  CN: Sh,
  DE: Ch,
  ES: Ih,
  FR: Bh,
  GB: Oh,
  HU: Vh,
  IT: $h,
  JP: xh,
  PL: Mh,
  PT: Ph,
  RU: Lh,
  SE: Th,
  TR: Ah
}, Symbol.toStringTag, { value: "Module" })), js = (e) => {
  if (e && e.id)
    return true;
}, Fh = (e) => {
  try {
    const { firstName: s } = e;
    if (s)
      return true;
  } catch {
  }
  return false;
}, Dh = (e) => `${e.firstName}${e.lastName ? ` ${e.lastName}` : ""}`, ke = {
  message: {
    name: "message",
    icon: "chat-alt"
  },
  network: {
    name: "network",
    icon: "user-add",
    left: true
  },
  audio: {
    name: "audio",
    icon: "phone"
  },
  conferencing: {
    name: "conferencing",
    icon: "videocamera"
  },
  screenshare: {
    name: "screenshare",
    icon: "monitor"
  }
};
ke.network;
const zh = [ke.message, ke.audio, ke.conferencing, ke.screenshare], Ye = (e) => {
  const s = Object.keys(ke);
  return !(e.length > 0 && e.filter((t) => s.indexOf(t)) === -1);
}, Nh = {
  name: "vu-rich-user-tooltip",
  emits: ["network", "message", "audio", "conferencing", "screenshare", "see-profile"],
  directives: {
    "click-outside": ft
  },
  inject: {
    vuUserLabels: {
      default: () => wh
    },
    vuDebug: {
      default: false
    }
  },
  props: {
    show: {
      type: Boolean,
      required: false
    },
    user: {
      type: Object,
      validator: js,
      required: true
    },
    disabledActions: {
      type: Array,
      validator: Ye,
      required: false,
      default: () => []
    },
    hiddenActions: {
      type: Array,
      validator: Ye,
      required: false,
      default: () => []
    },
    side: {
      type: String,
      default: "bottom"
    },
    // eslint-disable-next-line vue/require-prop-types
    attach: {
      default: false
    },
    activator: {
      type: Object,
      default: void 0
    }
  },
  watch: {
    show(e) {
      this.innerShow = e;
    },
    contacts: {
      immediate: true,
      handler() {
        this.parseContactsInCommonLabel();
      }
    }
  },
  /* eslint-disable no-unused-vars */
  data: () => ({
    overflowHover: false,
    actions: ke,
    RHSactions: zh,
    uuid: ye,
    getFullname: Dh,
    validateName: Fh,
    contactsLabelPart2: "",
    contactsLabelPart1: "",
    visibleAmount: 7
  }),
  /* eslint-enable no-unused-vars */
  computed: {
    hasInfo() {
      return this.user.company || this.user.country;
    },
    hasContacts() {
      return Array.isArray(this.user.contacts) && this.user.contacts.length > 0;
    },
    contacts() {
      return this.hasContacts ? this.user.contacts : [];
    },
    countryImg() {
      return !this.user.countryCode || !Zt[this.user.countryCode.toUpperCase()] ? false : Zt[this.user.countryCode.toUpperCase()];
    },
    countryLabel() {
      return this.user.countryCode && this.vuUserLabels[this.user.countryCode];
    },
    overflows() {
      return this.user.contacts && this.user.contacts.length > 7;
    },
    visibleContacts() {
      return this.hasContacts && this.overflows ? this.contacts.slice(0, this.visibleAmount) : this.contacts;
    },
    overflowContact() {
      return this.hasContacts && this.overflows ? this.contacts[this.visibleAmount] : null;
    },
    numberOfOverflowingContactsCssVariable() {
      return `"${this.contacts.length - this.visibleAmount}"`;
    }
  },
  methods: {
    parseContactsInCommonLabel() {
      if (!this.vuUserLabels.contactsInCommon && this.vuDebug) {
        console.warn("contactsInCommon nls is missing");
        return;
      }
      let { contactsInCommon: e } = this.vuUserLabels;
      const s = e.match(/\$\(.*\)/).length > 0;
      this.contacts.length > 1 && s ? e = e.replace("$(", "").replace(")", "") : e = e.replace(/\$\(.*\)/, ""), e = e.split("###"), this.contactsLabelPart1 = e[0], this.contactsLabelPart2 = e[1];
    },
    isDisabled(e) {
      return this.disabledActions.length > 0 && this.disabledActions.includes(e);
    }
  },
  components: { VuPopover: re, VuUserPicture: Le, VuIconBtn: U }
}, Eh = (e) => (pushScopeId("data-v-8bf3cebb"), e = e(), popScopeId(), e), jh = { class: "rich-user-tooltip__header__wrap-name" }, Rh = /* @__PURE__ */ Eh(() => /* @__PURE__ */ createBaseVNode("div", { class: "rich-user-tooltip__header__topbar" }, null, -1)), Uh = { class: "rich-user-tooltip__avatar-wrap" }, Hh = {
  key: 0,
  class: "rich-user-tooltip__info"
}, qh = {
  key: 0,
  class: "rich-user-tooltip__info__company"
}, Wh = {
  key: 1,
  class: "rich-user-tooltip__info__locale"
}, Kh = ["src"], Gh = {
  key: 1,
  class: "rich-user-tooltip__info__country"
}, Yh = { class: "rich-user-tooltip__contacts__label" }, Xh = { class: "rich-user-tooltip__contacts__list" }, Jh = { class: "rich-user-tooltip__footer" }, Qh = { class: "rich-user-tooltip__footer__left" };
function Zh(e, s, t, i, o, n) {
  const r = resolveComponent("VuUserPicture"), d = resolveComponent("VuIconBtn"), u = resolveComponent("VuPopover"), f = resolveDirective("tooltip");
  return openBlock(), createBlock(u, {
    side: t.side,
    show: t.show,
    arrow: "",
    shift: "",
    positions: ["bottom", "top"],
    attach: "body",
    "content-class": "vu-rich-user-tooltip",
    activator: t.activator
  }, createSlots({
    default: withCtx(() => [
      renderSlot(e.$slots, "default", {}, () => [
        withDirectives(createVNode(r, {
          id: t.user.id,
          clickable: "",
          src: t.user.imgSrc,
          presence: t.user.presence,
          class: "rich-user-tooltip__default-content"
        }, null, 8, ["id", "src", "presence"]), [
          [
            f,
            e.getFullname(t.user),
            void 0,
            { top: true }
          ]
        ])
      ], true)
    ]),
    arrow: withCtx(({ side: c, shift: h2 }) => [
      withDirectives(createBaseVNode("div", {
        class: normalizeClass(["rich-user-tooltip__arrow popover-arrow", `rich-user-tooltip__arrow--${c}`])
      }, null, 2), [
        [vShow, !h2]
      ])
    ]),
    title: withCtx(({ side: c }) => [
      createBaseVNode("div", {
        class: normalizeClass(["rich-user-tooltip__header", `rich-user-tooltip__header--${c}`])
      }, [
        createBaseVNode("div", jh, [
          withDirectives((openBlock(), createElementBlock("label", {
            class: "rich-user-tooltip__header__name",
            onClick: s[0] || (s[0] = (h2) => e.$emit("see-profile", t.user.id))
          }, [
            createTextVNode(toDisplayString(e.getFullname(t.user)), 1)
          ])), [
            [f, e.getFullname(t.user)]
          ])
        ]),
        Rh,
        withDirectives((openBlock(), createElementBlock("div", Uh, [
          createVNode(r, {
            class: "rich-user-tooltip__header__avatar",
            size: "big",
            clickable: true,
            id: t.user && t.user.id,
            gutter: true,
            presence: t.user.presence,
            onClick: s[1] || (s[1] = (h2) => e.$emit("see-profile", t.user.id))
          }, null, 8, ["id", "presence"])
        ])), [
          [
            f,
            e.getFullname(t.user),
            void 0,
            { bottom: true }
          ]
        ])
      ], 2)
    ]),
    _: 2
  }, [
    (n.hasInfo || n.hasContacts, {
      name: "body",
      fn: withCtx(() => [
        n.hasInfo ? (openBlock(), createElementBlock("div", Hh, [
          t.user.company ? (openBlock(), createElementBlock("label", qh, toDisplayString(t.user.company), 1)) : createCommentVNode("", true),
          n.countryImg || n.countryLabel ? (openBlock(), createElementBlock("label", Wh, [
            n.countryImg ? (openBlock(), createElementBlock("img", {
              key: 0,
              class: "rich-user-tooltip__info__flag",
              src: n.countryImg
            }, null, 8, Kh)) : createCommentVNode("", true),
            n.countryLabel ? (openBlock(), createElementBlock("span", Gh, toDisplayString(n.countryLabel), 1)) : createCommentVNode("", true)
          ])) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        renderSlot(e.$slots, "content", {}, void 0, true),
        n.hasContacts ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createBaseVNode("label", Yh, [
            createTextVNode(toDisplayString(e.contactsLabelPart1), 1),
            withDirectives((openBlock(), createElementBlock("span", {
              class: "rich-user-tooltip__contacts__amount",
              onClick: s[2] || (s[2] = (c) => e.$emit("see-profile", t.user.id))
            }, [
              createTextVNode(toDisplayString(n.contacts.length), 1)
            ])), [
              [
                f,
                n.vuUserLabels.profile,
                void 0,
                { bottom: true }
              ]
            ]),
            e.contactsLabelPart2 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(toDisplayString(e.contactsLabelPart2), 1)
            ], 64)) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", Xh, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(n.visibleContacts, (c) => withDirectives((openBlock(), createBlock(r, {
              key: c.id || e.uuid(),
              id: c.id || e.uuid(),
              clickable: true,
              onClick: (h2) => e.$emit("see-profile", c.id)
            }, null, 8, ["id", "onClick"])), [
              [
                f,
                e.getFullname(c),
                void 0,
                { bottom: true }
              ]
            ])), 128)),
            n.overflowContact ? withDirectives((openBlock(), createBlock(r, {
              key: 0,
              class: "rich-user-tooltip__overflow_contact",
              style: normalizeStyle({
                "--numberOfOverflowingContacts": n.numberOfOverflowingContactsCssVariable
              }),
              clickable: true,
              hoverable: "",
              id: n.overflowContact.id || e.uuid(),
              onClick: s[3] || (s[3] = (c) => e.$emit("see-profile", n.overflowContact.id))
            }, null, 8, ["style", "id"])), [
              [
                f,
                n.vuUserLabels.profile,
                void 0,
                { bottom: true }
              ]
            ]) : createCommentVNode("", true)
          ])
        ], 64)) : createCommentVNode("", true),
        createBaseVNode("div", Jh, [
          createBaseVNode("div", Qh, [
            renderSlot(e.$slots, "footer-left", {}, () => [
              t.hiddenActions.length && t.hiddenActions.includes("network") ? createCommentVNode("", true) : withDirectives((openBlock(), createBlock(r, {
                key: 0,
                icon: e.actions.network.icon,
                class: "add-network",
                disabled: t.disabledActions.length > 0 && t.disabledActions.includes("network"),
                onClick: s[4] || (s[4] = (c) => {
                  n.isDisabled("network") || e.$emit("network", t.user.id);
                })
              }, null, 8, ["icon", "disabled"])), [
                [
                  f,
                  n.vuUserLabels.network,
                  void 0,
                  { bottom: true }
                ]
              ])
            ], true)
          ]),
          renderSlot(e.$slots, "footer-right", {}, () => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(e.RHSactions, (c) => (openBlock(), createElementBlock(Fragment, {
              key: c.name
            }, [
              t.hiddenActions.length && t.hiddenActions.includes(c.name) ? createCommentVNode("", true) : withDirectives((openBlock(), createBlock(d, {
                key: 0,
                class: "right-btn",
                icon: c.icon,
                disabled: n.isDisabled(c.name),
                onClick: (h2) => {
                  n.isDisabled(c.name) || e.$emit(c.name, t.user.id);
                }
              }, null, 8, ["icon", "disabled", "onClick"])), [
                [
                  f,
                  n.vuUserLabels[c.name],
                  void 0,
                  { bottom: true }
                ]
              ])
            ], 64))), 128))
          ], true)
        ])
      ]),
      key: "0"
    })
  ]), 1032, ["side", "show", "activator"]);
}
const Rs = /* @__PURE__ */ O(Nh, [["render", Zh], ["__scopeId", "data-v-8bf3cebb"]]), ef = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Rs
}, Symbol.toStringTag, { value: "Module" })), tf = {
  name: "vu-user-name",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    firstName: String,
    // eslint-disable-next-line vue/require-default-prop
    lastName: String,
    toUpper: {
      type: Boolean,
      required: false,
      default: true
    },
    shift: Boolean,
    clickable: Boolean
  },
  emits: ["click"],
  computed: {
    _lastName() {
      return this.toUpper ? this.lastName.toUpperCase() : this.lastName;
    }
  }
};
function sf(e, s, t, i, o, n) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vu-user-name", [
      "vu-user-name--default-color",
      "vu-user-name--default-size",
      { "vu-user-name--with-avatar": t.shift },
      { "vu-user-name--clickable": t.clickable }
    ]])
  }, [
    renderSlot(e.$slots, "default", {}, () => [
      createBaseVNode("span", {
        class: "content",
        onClick: s[0] || (s[0] = (r) => e.$emit("click"))
      }, toDisplayString(t.firstName + " " + n._lastName), 1)
    ], true)
  ], 2);
}
const Us = /* @__PURE__ */ O(tf, [["render", sf], ["__scopeId", "data-v-5bae4c6d"]]), nf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Us
}, Symbol.toStringTag, { value: "Module" })), lf = {
  name: "vu-user",
  emits: ["click-other-user", "click-user"],
  props: {
    user: {
      type: Object,
      required: true,
      validator: js
    },
    disabledActions: {
      type: Array,
      required: false,
      default: () => [],
      validator: Ye
    },
    hiddenActions: {
      type: Array,
      required: false,
      default: () => [],
      validator: Ye
    },
    showPicture: {
      type: Boolean,
      required: false,
      default: true
    },
    showName: {
      type: Boolean,
      required: false,
      default: false
    },
    showUserTooltip: {
      type: Boolean,
      required: false,
      default: true
    },
    clickable: {
      type: Boolean,
      required: false,
      default: true
    },
    pictureBackground: {
      type: String,
      required: false,
      default: "#fff"
    },
    attach: {
      default: () => false,
      validator: St
    }
  },
  computed: {
    listeners() {
      return ce(this.$attrs, true);
    }
  },
  data: () => ({
    getListenersFromAttrs: ce
  }),
  components: { VuRichUserTooltip: Rs, VuUserPicture: Le, VuUserName: Us, VuUserPicture: Le }
}, of = { class: "vu-user" };
function rf(e, s, t, i, o, n) {
  const r = resolveComponent("VuUserPicture"), d = resolveComponent("VuUserName"), u = resolveComponent("VuRichUserTooltip");
  return openBlock(), createElementBlock("div", of, [
    t.showUserTooltip ? (openBlock(), createBlock(u, mergeProps({
      key: 0,
      user: t.user,
      "disabled-actions": t.disabledActions,
      "hidden-actions": t.hiddenActions,
      attach: t.attach
    }, toHandlers(n.listeners.vOn || {})), {
      default: withCtx(() => [
        t.showPicture ? (openBlock(), createBlock(r, {
          key: 0,
          id: t.user.id,
          src: t.user.imgSrc,
          presence: t.user.presence,
          clickable: t.clickable,
          style: normalizeStyle({ background: t.pictureBackground }),
          onClick: s[0] || (s[0] = (f) => e.$emit("click-user", e.value))
        }, null, 8, ["id", "src", "presence", "clickable", "style"])) : createCommentVNode("", true),
        t.showName ? (openBlock(), createBlock(d, {
          key: 1,
          "first-name": t.user.firstName,
          "last-name": t.user.lastName,
          clickable: t.clickable,
          shift: t.showPicture,
          onClick: s[1] || (s[1] = (f) => e.$emit("click-user", f))
        }, {
          default: withCtx(() => [
            renderSlot(e.$slots, "userName", {}, void 0, true)
          ]),
          _: 3
        }, 8, ["first-name", "last-name", "clickable", "shift"])) : createCommentVNode("", true)
      ]),
      _: 3
    }, 16, ["user", "disabled-actions", "hidden-actions", "attach"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      t.showPicture ? (openBlock(), createBlock(r, {
        key: 0,
        id: t.user.id,
        src: t.user.imgSrc,
        presence: t.user.presence,
        clickable: t.clickable,
        style: normalizeStyle({ background: t.pictureBackground }),
        onClick: s[2] || (s[2] = (f) => e.$emit("click-user", f))
      }, null, 8, ["id", "src", "presence", "clickable", "style"])) : createCommentVNode("", true),
      t.showName ? (openBlock(), createBlock(d, {
        key: 1,
        "first-name": t.user.firstName,
        "last-name": t.user.lastName,
        clickable: t.clickable,
        shift: t.showPicture,
        onClick: s[3] || (s[3] = (f) => e.$emit("click-user", f))
      }, {
        default: withCtx(() => [
          renderSlot(e.$slots, "userName", {}, void 0, true)
        ]),
        _: 3
      }, 8, ["first-name", "last-name", "clickable", "shift"])) : createCommentVNode("", true)
    ], 64))
  ]);
}
const af = /* @__PURE__ */ O(lf, [["render", rf], ["__scopeId", "data-v-32241cd5"]]), uf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: af
}, Symbol.toStringTag, { value: "Module" }));
function tt() {
  if (!window)
    return false;
  const e = navigator.userAgent.toLowerCase();
  return !!(/iPhone|iPad/i.test(e) || /safari/.test(e) && !/chrome/.test(e) && ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}
const Ft = ({ userAgent: e }) => e.match(/android/i);
let Hs = null;
function df({ disableTooltipsOnDevices: e }) {
  Hs = e;
}
function qs(e, s, t, i) {
  const o = s.getBoundingClientRect(), {
    left: n,
    right: r,
    top: d,
    shiftX: u,
    offset: f
  } = It(e, o, t.getBoundingClientRect(), i.getBoundingClientRect(), {}, true);
  t.style.top = `${d}px`, t.style.left = `${n}px`;
  const c = t.querySelector(".tooltip-arrow") || { style: {} };
  return u > 0 ? (c.style.right = `${u - 5}px`, c.style.left = "initial") : u < 0 && (c.style.left = `${o.left - n + s.clientWidth / 2}px`, c.style.right = "initial"), true;
}
function Ws(e) {
  switch (true) {
    case e.left:
      return "left";
    case e.right:
      return "right";
    case e.bottom:
      return "bottom";
    default:
      return "top";
  }
}
async function es(e, s) {
  if (!s.value || s.modifiers.ellipsis && e.offsetWidth >= e.scrollWidth)
    return;
  const t = Ws(s.modifiers);
  render(e.tooltip, document.body), e.tooltip.component.props.show = true, e.tooltip.component.props.side = t, await new Promise((i) => setTimeout(i, 1)), qs(t, e, e.tooltip.el, document.body), (Ft(navigator) || tt()) && (e.stopClickOutside = In(e, () => mt(e), { detectIframe: true }));
}
function mt(e) {
  const { tooltip: { component: s } } = e;
  s.props.show = false, (Ft(navigator) || tt()) && e.stopClickOutside && (e.stopClickOutside(), delete e.stopClickOutside);
}
async function cf(e, s, t) {
  var o;
  const { tooltip: i } = e;
  if (i) {
    const { component: n } = i;
    if (i.props.text = s.value, n && (n.props.text = s.value), (o = n == null ? void 0 : n.props) != null && o.show) {
      const r = Ws(s.modifiers);
      await new Promise((d) => setTimeout(d, 1)), qs(r, t.el, i.el, document.body);
    }
  }
}
const rt = {
  setConfig: df,
  mounted(e, s, t) {
    const { modifiers: i } = s, { forceOnDevices: o = false } = i, n = Ft(navigator) || tt();
    if (Hs && !o && n || s.disabled)
      return;
    const r = createVNode({ ...Bt }, {
      type: s.modifiers.popover ? "popover" : "tooltip",
      text: s.value
    });
    e.tooltip = r, s.modifiers.click || n ? e.addEventListener("click", () => {
      var d, u, f;
      (f = (u = (d = e == null ? void 0 : e.tooltip) == null ? void 0 : d.component) == null ? void 0 : u.props) != null && f.show ? mt(e) : es(e, s);
    }) : (e.addEventListener("mouseenter", es.bind(null, e, s, t)), e.addEventListener("mouseleave", mt.bind(null, e, s, t)));
  },
  updated(e, s, t) {
    s.value !== s.oldValue && cf(e, s, t);
  },
  beforeUnmount(e) {
    var s, t, i, o, n;
    if (e.tooltip) {
      const { tooltip: r } = e;
      r && ((t = (s = r == null ? void 0 : r.component) == null ? void 0 : s.el) == null || t.remove(), (n = (o = (i = r == null ? void 0 : r.component) == null ? void 0 : i.vnode) == null ? void 0 : o.el) == null || n.remove());
    }
  }
}, ts = (e, s, t) => {
  const i = createVNode(Lt, { mask: true });
  if (render(i, t.el), e.spinner = i, i && typeof s.value == "string") {
    const { component: o } = i;
    i.props.text = s.value, o && (o.props.text = s.value);
  }
  e.classList.add("masked");
}, ss = (e, s, t) => {
  e.spinner && (render(null, t.el), e.spinner = null, e.classList.remove("masked"));
}, ns = {
  mounted(e, s, t) {
    s.value && ts(e, s, t);
  },
  updated(e, s, t) {
    s.value !== s.oldValue && (s.value ? ts : ss)(e, s, t);
  },
  unmounted(e, s, t) {
    ss(e, s, t);
  }
}, hf = {
  install(e, s = { disableTooltipsOnDevices: true }) {
    e.directive("click-outside", ft), e.directive("mask", ns), rt.setConfig(s), e.directive("tooltip", rt);
  },
  clickOutside: ft,
  tooltip: rt,
  mask: ns
  // denseGroup,
  // denseClass,
};
function ff() {
  return window ? !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) : false;
}
function mf(e, s = {}) {
  const { lang: t = "en", country: i = "US", isMobile: o, isIOS: n, globalRegister: r = true, disableTooltipsOnDevices: d = true } = s;
  if (vd(e), Hu(e), Tl(e), r) {
    const u = /* @__PURE__ */ Object.assign({ "./components/layouts/vu-status-bar.vue": Kn, "./components/layouts/vu-thumbnail.vue": Ki, "./components/layouts/vu-tile.vue": Ei, "./components/vu-accordion.vue": tl, "./components/vu-alert-dialog/vu-alert-dialog-container.vue": zl, "./components/vu-alert-dialog/vu-alert-dialog.vue": ml, "./components/vu-badge.vue": rn, "./components/vu-btn-dropdown.vue": Gl, "./components/vu-btn-group.vue": Zl, "./components/vu-btn.vue": Rl, "./components/vu-carousel-slide.vue": io, "./components/vu-carousel.vue": po, "./components/vu-checkbox.vue": Co, "./components/vu-contextual-dropdown.vue": Vo, "./components/vu-datepicker.vue": jo, "./components/vu-dropdownmenu-items.vue": _i, "./components/vu-dropdownmenu.vue": Si, "./components/vu-facets-bar.vue": Ko, "./components/vu-form.vue": Xo, "./components/vu-grid-view.vue": Zr, "./components/vu-icon-btn.vue": Oi, "./components/vu-icon-link.vue": na, "./components/vu-icon.vue": hn, "./components/vu-image.vue": ti, "./components/vu-input-date.vue": ha, "./components/vu-input-number.vue": Sa, "./components/vu-input.vue": xa, "./components/vu-lazy.vue": Xn, "./components/vu-lightbox/vu-lightbox-bar.vue": Ha, "./components/vu-lightbox/vu-lightbox.vue": tu, "./components/vu-media-upload-droppable.vue": ou, "./components/vu-media-upload-empty.vue": hu, "./components/vu-media-upload-error.vue": gu, "./components/vu-media-upload-loading.vue": Iu, "./components/vu-media-upload-preview.vue": $u, "./components/vu-media-upload.vue": Du, "./components/vu-message/vu-message-container.vue": Yu, "./components/vu-message/vu-message.vue": Uu, "./components/vu-modal/vu-mobile-dialog.vue": sd, "./components/vu-modal/vu-modal-container.vue": wd, "./components/vu-modal/vu-modal.vue": gd, "./components/vu-multiple-select.vue": Ld, "./components/vu-popover.vue": Un, "./components/vu-progress-circular.vue": wu, "./components/vu-range.vue": Wd, "./components/vu-scroller.vue": Cr, "./components/vu-select-options.vue": hr, "./components/vu-select.vue": Ur, "./components/vu-single-checkbox.vue": ec, "./components/vu-slider.vue": uc, "./components/vu-spinner.vue": br, "./components/vu-textarea.vue": vc, "./components/vu-thumbnail-list-item.vue": Oc, "./components/vu-time-picker.vue": Uc, "./components/vu-timeline-divider.vue": Qc, "./components/vu-tooltip.vue": Fn, "./components/vu-tree-view-item.vue": ah, "./components/vu-tree-view.vue": fh, "./components/vu-user/vu-rich-user-tooltip.vue": ef, "./components/vu-user/vu-user-name.vue": nf, "./components/vu-user/vu-user-picture.vue": sr, "./components/vu-user/vu-user.vue": uf });
    for (const f in u) {
      const c = u[f];
      e.component(c.default.name, c.default);
    }
  }
  t && i ? e.provide("lang", `${t}-${i}`) : e.provide("lang", "en-US"), e.provide(Qe, o !== void 0 ? o : ff()), e.provide(cs, n !== void 0 ? n : tt()), e.provide("vuCollectionActions", null), e.provide("vuCollectionLazyImages", true), e.provide("vuTileEmphasizeText", false), e.provide("vuDateFormatWeekday", true), e.provide("vuDateFormatShort", false), e.provide("vuTreeViewLazy", true), e.provide("vuTreeViewIcon", "chevron"), hf.install(e, s);
}
const noNotifications = "No Notifications";
const unreadNotifications = "unread notifications";
const oneUnreadNotification = "unread notification";
const foundNotifications = "notifications found";
const oneFoundNotification = "notification found";
const viewAll = "View All";
const hideAll = "Hide All";
const viewMore = "View more";
const markAllAsRead = "Mark All as Read";
const markAllAsUnread = "Mark All as Unread";
const markAllFilterAsRead = "Mark All Filtered as Read";
const markAllFilterAsUnread = "Mark All Filtered as Unread";
const deleteAll = "Delete All";
const deleteFilteredNotif = "Delete Filtered Notifications";
const deleteSelectedTitle = "Deletion of selected notifications";
const deleteSelectedMsg = "All selected notifications will be deleted. Are you sure?";
const deleteFilteredTitle = "Deletion of filtered notifications";
const deleteFilteredMsg = "All filtered notifications will be deleted. Are you sure?";
const notificationsDisplay = "Notifications Display";
const currentPlatform = "Current Platform";
const allPlatforms = "All Platforms";
const preferencesMenu = "Preferences";
const today = "Today";
const yesterday = "Yesterday";
const notificationDeleted = "Notification will be deleted";
const cancel = "Cancel";
const archiveAlert = "Notice: Archived notifications have been added to the timeline";
const persons = "people";
const Persons = "People";
const actionLabel$1 = "action performed";
const actionFailed = "action failed";
const groupActionLabel = "all actions performed";
const accept = "Accept";
const deny = "Deny";
const openWith = "Open With";
const openInNewTab = "Open in New Tab";
const markAsRead = "Mark as Read";
const markAsUnread = "Mark as Unread";
const markGroupAsRead = "Mark Group as read";
const markGroupAsUnRead = "Mark Group as unread";
const markAsImportant = "Mark as Important";
const removeImportant = "Remove from Important";
const removeGroupImportant = "Remove Group from Important";
const markGroupAsImportant = "Mark Group as Important";
const unsubscribe$1 = "Unsubscribe";
const unsubscribeIndefinitely = "Unsubscribe Indefinitely";
const unsubscribeForHour = "Unsubscribe for 1 Hour";
const deleteGroup = "Delete Group";
const filter$1 = "Filter";
const reset = "Reset";
const close = "Close";
const selectStartDate = "Start date";
const to = "to";
const selectEndDate = "End date";
const searches = "Search notifications";
const read = "Read";
const unread = "Unread";
const starred = "Important";
const unstarred = "Not Important";
const platformsSelection = "Platforms Selection";
const multiSelection = "Multi-selection";
const selected = "selected";
const selectAll = "Select All";
const unselectAll = "Unselect All";
const markSelectedAsRead$1 = "Mark Selected as Read";
const markSelectedAsUnread = "Mark Selected as Unread";
const markSelectedAsStarred$1 = "Mark Selected as Important";
const markSelectedAsUnstarred = "Remove Selected from Important";
const unsubscribeSelected$1 = "Unsubscribe Selected";
const deleteSelected$1 = "Delete Selected";
const deleteAllTitle = "Deletion of all notifications";
const deleteAllMsg = "All notifications will be deleted. Are you sure?";
const settings = "Notifications Settings";
const preferences = "Notifications Preferences";
const globalSetting = "Global Setting";
const forcedPreference = "Preference forced by administrator";
const centerIconText = "Notification Center";
const alertIconText = "Alert";
const mailIconText = "Mail";
const browserIconText = "Browser";
const settingOff = "Off";
const settingOffForAnHour = "Off for 1 Hour";
const minLeft = "min left";
const hourLeft = "hour left";
const centerNotificationTooltipEnabled = "Notification Center notifications enabled";
const alertNotificationTooltipEnabled = "Alert notifications enabled";
const mailNotificationTooltipEnabled = "Mail notifications enabled";
const browserNotificationTooltipEnabled = "Browser notifications enabled";
const alertNotificationTooltipDisabled = "Alert notifications disabled";
const mailNotificationTooltipDisabled = "Mail notifications disabled";
const browserNotificationTooltipDisabled = "Browser notifications disabled";
const overrideByGlobal = "but override by global setting";
const browserSupport = "Notification Support";
const browserNotSupported = "Your browser is not supported. Please use the latest version of Chrome, Firefox, Safari or Edge.";
const notificationPermission = "Notification Permission";
const deniedPermission = "You have denied the permission to show notifications. Please allow the permission to receive notifications or reload the page to apply the changes.";
const notificationPopupActivationTitle = "Notification Activation";
const notificationPopupActivationMsgPopupForBlock = "Browser notifications are blocked for 3DExperience platform. To unblock notifications : click on the icon  place on the left of the URL and turn on browser notifications for 3DExperience platform.";
const browserNotifDeactivateMsgForPopup = "Browser notifications will be de-activated for this service.";
const mailNotifDeactivateMsgForPopup = "Mail notifications will be de-activated for this service.";
const alertNotifDeactivateMsgForPopup = "Alert notifications will be de-activated for this service.";
const notificationPopupDeactivationTitle = "Notification Deactivation";
const confirmButtonLabel = "Confirm";
const dndAlertMsg = "Browser and alert notifications are hidden as your status is DoNotDisturb";
const rollbackPopupTitleFor3DDashboard = "3DNotification: Purged Notifications Rollback";
const rollbackPopupTitleForNotifCenter = "Purged Notification Rollback";
const rollbackPopupMsg = "Purged notifications, older than ninety days, will be rolled back";
const nls = {
  noNotifications,
  unreadNotifications,
  oneUnreadNotification,
  foundNotifications,
  oneFoundNotification,
  viewAll,
  hideAll,
  viewMore,
  markAllAsRead,
  markAllAsUnread,
  markAllFilterAsRead,
  markAllFilterAsUnread,
  deleteAll,
  deleteFilteredNotif,
  deleteSelectedTitle,
  deleteSelectedMsg,
  deleteFilteredTitle,
  deleteFilteredMsg,
  notificationsDisplay,
  currentPlatform,
  allPlatforms,
  preferencesMenu,
  today,
  yesterday,
  notificationDeleted,
  cancel,
  archiveAlert,
  persons,
  Persons,
  actionLabel: actionLabel$1,
  actionFailed,
  groupActionLabel,
  accept,
  deny,
  openWith,
  openInNewTab,
  markAsRead,
  markAsUnread,
  markGroupAsRead,
  markGroupAsUnRead,
  markAsImportant,
  removeImportant,
  removeGroupImportant,
  markGroupAsImportant,
  unsubscribe: unsubscribe$1,
  unsubscribeIndefinitely,
  unsubscribeForHour,
  "delete": "Delete",
  deleteGroup,
  filter: filter$1,
  reset,
  close,
  selectStartDate,
  to,
  selectEndDate,
  searches,
  read,
  unread,
  starred,
  unstarred,
  platformsSelection,
  multiSelection,
  selected,
  selectAll,
  unselectAll,
  markSelectedAsRead: markSelectedAsRead$1,
  markSelectedAsUnread,
  markSelectedAsStarred: markSelectedAsStarred$1,
  markSelectedAsUnstarred,
  unsubscribeSelected: unsubscribeSelected$1,
  deleteSelected: deleteSelected$1,
  deleteAllTitle,
  deleteAllMsg,
  settings,
  preferences,
  globalSetting,
  forcedPreference,
  centerIconText,
  alertIconText,
  mailIconText,
  browserIconText,
  settingOff,
  settingOffForAnHour,
  minLeft,
  hourLeft,
  centerNotificationTooltipEnabled,
  alertNotificationTooltipEnabled,
  mailNotificationTooltipEnabled,
  browserNotificationTooltipEnabled,
  alertNotificationTooltipDisabled,
  mailNotificationTooltipDisabled,
  browserNotificationTooltipDisabled,
  overrideByGlobal,
  browserSupport,
  browserNotSupported,
  notificationPermission,
  deniedPermission,
  notificationPopupActivationTitle,
  notificationPopupActivationMsgPopupForBlock,
  browserNotifDeactivateMsgForPopup,
  mailNotifDeactivateMsgForPopup,
  alertNotifDeactivateMsgForPopup,
  notificationPopupDeactivationTitle,
  confirmButtonLabel,
  dndAlertMsg,
  rollbackPopupTitleFor3DDashboard,
  rollbackPopupTitleForNotifCenter,
  rollbackPopupMsg
};
const DS_BASE_URL = ((_a2 = window.dsDefaultWebappsBaseUrl) == null ? void 0 : _a2.replace("webapps/", "")) || `${window.location.origin}/`;
const DS_WEBAPPS_URL = window.dsDefaultWebappsBaseUrl || `${DS_BASE_URL}webapps/`;
const DS_BASE_URL_IFRAME = (
  //window.dsDashboardWindow?.topPlatformWindow?.dsDefaultWebappsBaseUrl?.replace('webapps/', '') ||
  DS_BASE_URL || `${window.location.origin}/`
);
const DS_WEBAPPS_URL_IFRAME = (
  //window.dsDashboardWindow?.topPlatformWindow?.dsDefaultWebappsBaseUrl ||
  DS_WEBAPPS_URL || `${DS_BASE_URL_IFRAME}webapps/`
);
const AMDLOADER_SCRIPT = "AmdLoader/AmdLoader.js";
let initAsync;
const setupGlobalEnvVar = async () => {
  var _a3;
  const path = JSON.parse(JSON.stringify(DS_WEBAPPS_URL_IFRAME.replace("webapps/", "webapps")));
  const paths = {
    "DS": path,
    // 'DS/UWPClientCode/UWA': 'UWA2/js',
    // 'UWA': 'UWA2/js',
    "vuejs": `${path}/vuejs/2.6.10/vue.min`,
    "vu-kit": `${path}/vuekit/vu-kit.umd`
    // have to call it "vu-kit"
  };
  (_a3 = window.require) == null ? void 0 : _a3.config({ paths });
};
const initRequire = async () => {
  if (initAsync) return;
  await setupGlobalEnvVar();
  const script = document.createElement("script");
  const loadingAsync = new Promise((resolve2, reject) => {
    script.onload = resolve2;
    script.onerror = reject;
  });
  script.src = `${DS_WEBAPPS_URL_IFRAME}${AMDLOADER_SCRIPT}`;
  document.head.appendChild(script);
  await loadingAsync;
};
const requirejs = async (modules) => {
  if (!initAsync) initAsync = initRequire();
  await initAsync;
  return new Promise((resolve2, reject) => {
    window.require(modules, (...m) => resolve2(m), reject);
  });
};
let i18n = ref({});
function loadTranslations(filename = "feed", path = "i18n!DS/NotificationsCenterVue/assets/nls/") {
  return new Promise(async (resolve2) => {
    try {
      const [result] = await requirejs([`${path}${filename}`]);
      i18n = Object.assign(unref(i18n), result);
    } catch (error) {
      console.error(`Error loading nls ${path}${filename}, using local nls.`);
      i18n = Object.assign(unref(i18n), nls);
    }
    resolve2(i18n.value);
  });
}
let promise;
if (!promise)
  promise = loadTranslations();
function useTranslations() {
  const $i18n2 = (key, values = {}) => {
    let value = unref(i18n)[key] || "";
    Object.entries(values).forEach(([key2, val]) => {
      value = value.replace(`{${key2}}`, val);
    });
    return value;
  };
  return { i18n, $i18n: $i18n2, promise };
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const notNullish = (val) => val != null;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
function createFilterWrapper(filter2, fn) {
  function wrapper(...args) {
    return new Promise((resolve2, reject) => {
      Promise.resolve(filter2(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve2).catch(reject);
    });
  }
  return wrapper;
}
const bypassFilter = (invoke2) => {
  return invoke2();
};
function debounceFilter(ms2, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop;
  const _clearTimeout = (timer2) => {
    clearTimeout(timer2);
    lastRejector();
    lastRejector = noop;
  };
  const filter2 = (invoke2) => {
    const duration = toValue(ms2);
    const maxDuration = toValue(options.maxWait);
    if (timer)
      _clearTimeout(timer);
    if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = null;
      }
      return Promise.resolve(invoke2());
    }
    return new Promise((resolve2, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve2;
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer)
            _clearTimeout(timer);
          maxTimer = null;
          resolve2(invoke2());
        }, maxDuration);
      }
      timer = setTimeout(() => {
        if (maxTimer)
          _clearTimeout(maxTimer);
        maxTimer = null;
        resolve2(invoke2());
      }, duration);
    });
  };
  return filter2;
}
function throttleFilter(...args) {
  let lastExec = 0;
  let timer;
  let isLeading = true;
  let lastRejector = noop;
  let lastValue;
  let ms2;
  let trailing;
  let leading;
  let rejectOnCancel;
  if (!isRef(args[0]) && typeof args[0] === "object")
    ({ delay: ms2, trailing = true, leading = true, rejectOnCancel = false } = args[0]);
  else
    [ms2, trailing = true, leading = true, rejectOnCancel = false] = args;
  const clear2 = () => {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
      lastRejector();
      lastRejector = noop;
    }
  };
  const filter2 = (_invoke) => {
    const duration = toValue(ms2);
    const elapsed = Date.now() - lastExec;
    const invoke2 = () => {
      return lastValue = _invoke();
    };
    clear2();
    if (duration <= 0) {
      lastExec = Date.now();
      return invoke2();
    }
    if (elapsed > duration && (leading || !isLeading)) {
      lastExec = Date.now();
      invoke2();
    } else if (trailing) {
      lastValue = new Promise((resolve2, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve2;
        timer = setTimeout(() => {
          lastExec = Date.now();
          isLeading = true;
          resolve2(invoke2());
          clear2();
        }, Math.max(0, duration - elapsed));
      });
    }
    if (!leading && !timer)
      timer = setTimeout(() => isLeading = true, duration);
    isLeading = false;
    return lastValue;
  };
  return filter2;
}
function getLifeCycleTarget(target) {
  return getCurrentInstance();
}
function toRef(...args) {
  if (args.length !== 1)
    return toRef$1(...args);
  const r = args[0];
  return typeof r === "function" ? readonly(customRef(() => ({ get: r, set: noop }))) : ref(r);
}
function useDebounceFn(fn, ms2 = 200, options = {}) {
  return createFilterWrapper(
    debounceFilter(ms2, options),
    fn
  );
}
function useThrottleFn(fn, ms2 = 200, trailing = false, leading = true, rejectOnCancel = false) {
  return createFilterWrapper(
    throttleFilter(ms2, trailing, leading, rejectOnCancel),
    fn
  );
}
function watchWithFilter(source, cb, options = {}) {
  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options;
  return watch(
    source,
    createFilterWrapper(
      eventFilter,
      cb
    ),
    watchOptions
  );
}
function tryOnMounted(fn, sync = true, target) {
  const instance = getLifeCycleTarget();
  if (instance)
    onMounted(fn, target);
  else if (sync)
    fn();
  else
    nextTick(fn);
}
function useIntervalFn(cb, interval = 1e3, options = {}) {
  const {
    immediate = true,
    immediateCallback = false
  } = options;
  let timer = null;
  const isActive = ref(false);
  function clean() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function pause() {
    isActive.value = false;
    clean();
  }
  function resume() {
    const intervalValue = toValue(interval);
    if (intervalValue <= 0)
      return;
    isActive.value = true;
    if (immediateCallback)
      cb();
    clean();
    timer = setInterval(cb, intervalValue);
  }
  if (immediate && isClient)
    resume();
  if (isRef(interval) || typeof interval === "function") {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient)
        resume();
    });
    tryOnScopeDispose(stopWatch);
  }
  tryOnScopeDispose(pause);
  return {
    isActive,
    pause,
    resume
  };
}
function useTimeoutFn(cb, interval, options = {}) {
  const {
    immediate = true
  } = options;
  const isPending = ref(false);
  let timer = null;
  function clear2() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function stop() {
    isPending.value = false;
    clear2();
  }
  function start(...args) {
    clear2();
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      timer = null;
      cb(...args);
    }, toValue(interval));
  }
  if (immediate) {
    isPending.value = true;
    if (isClient)
      start();
  }
  tryOnScopeDispose(stop);
  return {
    isPending: readonly(isPending),
    start,
    stop
  };
}
function watchDebounced(source, cb, options = {}) {
  const {
    debounce = 0,
    maxWait = void 0,
    ...watchOptions
  } = options;
  return watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter: debounceFilter(debounce, { maxWait })
    }
  );
}
function watchOnce(source, cb, options) {
  const stop = watch(source, (...args) => {
    nextTick(() => stop());
    return cb(...args);
  }, options);
  return stop;
}
function unrefElement(elRef) {
  var _a3;
  const plain = toValue(elRef);
  return (_a3 = plain == null ? void 0 : plain.$el) != null ? _a3 : plain;
}
const defaultWindow = isClient ? window : void 0;
function useEventListener(...args) {
  let target;
  let events2;
  let listeners;
  let options;
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events2, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events2, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events2))
    events2 = [events2];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el2, event, listener, options2) => {
    el2.addEventListener(event, listener, options2);
    return () => el2.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el2, options2]) => {
      cleanup();
      if (!el2)
        return;
      const optionsClone = isObject(options2) ? { ...options2 } : options2;
      cleanups.push(
        ...events2.flatMap((event) => {
          return listeners.map((listener) => register(el2, event, listener, optionsClone));
        })
      );
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
function useMounted() {
  const isMounted = ref(false);
  const instance = getCurrentInstance();
  if (instance) {
    onMounted(() => {
      isMounted.value = true;
    }, instance);
  }
  return isMounted;
}
function useSupported(callback) {
  const isMounted = useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useRafFn(fn, options = {}) {
  const {
    immediate = true,
    fpsLimit = void 0,
    window: window2 = defaultWindow
  } = options;
  const isActive = ref(false);
  const intervalLimit = fpsLimit ? 1e3 / fpsLimit : null;
  let previousFrameTimestamp = 0;
  let rafId = null;
  function loop(timestamp2) {
    if (!isActive.value || !window2)
      return;
    if (!previousFrameTimestamp)
      previousFrameTimestamp = timestamp2;
    const delta = timestamp2 - previousFrameTimestamp;
    if (intervalLimit && delta < intervalLimit) {
      rafId = window2.requestAnimationFrame(loop);
      return;
    }
    previousFrameTimestamp = timestamp2;
    fn({ delta, timestamp: timestamp2 });
    rafId = window2.requestAnimationFrame(loop);
  }
  function resume() {
    if (!isActive.value && window2) {
      isActive.value = true;
      previousFrameTimestamp = 0;
      rafId = window2.requestAnimationFrame(loop);
    }
  }
  function pause() {
    isActive.value = false;
    if (rafId != null && window2) {
      window2.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  if (immediate)
    resume();
  tryOnScopeDispose(pause);
  return {
    isActive: readonly(isActive),
    pause,
    resume
  };
}
function useIntersectionObserver(target, callback, options = {}) {
  const {
    root,
    rootMargin = "0px",
    threshold = 0.1,
    window: window2 = defaultWindow,
    immediate = true
  } = options;
  const isSupported = useSupported(() => window2 && "IntersectionObserver" in window2);
  const targets = computed(() => {
    const _target = toValue(target);
    return (Array.isArray(_target) ? _target : [_target]).map(unrefElement).filter(notNullish);
  });
  let cleanup = noop;
  const isActive = ref(immediate);
  const stopWatch = isSupported.value ? watch(
    () => [targets.value, unrefElement(root), isActive.value],
    ([targets2, root2]) => {
      cleanup();
      if (!isActive.value)
        return;
      if (!targets2.length)
        return;
      const observer = new IntersectionObserver(
        callback,
        {
          root: unrefElement(root2),
          rootMargin,
          threshold
        }
      );
      targets2.forEach((el2) => el2 && observer.observe(el2));
      cleanup = () => {
        observer.disconnect();
        cleanup = noop;
      };
    },
    { immediate, flush: "post" }
  ) : noop;
  const stop = () => {
    cleanup();
    stopWatch();
    isActive.value = false;
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    isActive,
    pause() {
      cleanup();
      isActive.value = false;
    },
    resume() {
      isActive.value = true;
    },
    stop
  };
}
function useElementVisibility(element, options = {}) {
  const { window: window2 = defaultWindow, scrollTarget, threshold = 0 } = options;
  const elementIsVisible = ref(false);
  useIntersectionObserver(
    element,
    (intersectionObserverEntries) => {
      let isIntersecting = elementIsVisible.value;
      let latestTime = 0;
      for (const entry of intersectionObserverEntries) {
        if (entry.time >= latestTime) {
          latestTime = entry.time;
          isIntersecting = entry.isIntersecting;
        }
      }
      elementIsVisible.value = isIntersecting;
    },
    {
      root: scrollTarget,
      window: window2,
      threshold
    }
  );
  return elementIsVisible;
}
const ARRIVED_STATE_THRESHOLD_PIXELS = 1;
function useScroll(element, options = {}) {
  const {
    throttle = 0,
    idle = 200,
    onStop = noop,
    onScroll = noop,
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventListenerOptions = {
      capture: false,
      passive: true
    },
    behavior = "auto",
    window: window2 = defaultWindow,
    onError = (e) => {
      console.error(e);
    }
  } = options;
  const internalX = ref(0);
  const internalY = ref(0);
  const x = computed({
    get() {
      return internalX.value;
    },
    set(x2) {
      scrollTo2(x2, void 0);
    }
  });
  const y = computed({
    get() {
      return internalY.value;
    },
    set(y2) {
      scrollTo2(void 0, y2);
    }
  });
  function scrollTo2(_x, _y) {
    var _a3, _b2, _c3, _d3;
    if (!window2)
      return;
    const _element = toValue(element);
    if (!_element)
      return;
    (_c3 = _element instanceof Document ? window2.document.body : _element) == null ? void 0 : _c3.scrollTo({
      top: (_a3 = toValue(_y)) != null ? _a3 : y.value,
      left: (_b2 = toValue(_x)) != null ? _b2 : x.value,
      behavior: toValue(behavior)
    });
    const scrollContainer = ((_d3 = _element == null ? void 0 : _element.document) == null ? void 0 : _d3.documentElement) || (_element == null ? void 0 : _element.documentElement) || _element;
    if (x != null)
      internalX.value = scrollContainer.scrollLeft;
    if (y != null)
      internalY.value = scrollContainer.scrollTop;
  }
  const isScrolling = ref(false);
  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false
  });
  const directions = reactive({
    left: false,
    right: false,
    top: false,
    bottom: false
  });
  const onScrollEnd = (e) => {
    if (!isScrolling.value)
      return;
    isScrolling.value = false;
    directions.left = false;
    directions.right = false;
    directions.top = false;
    directions.bottom = false;
    onStop(e);
  };
  const onScrollEndDebounced = useDebounceFn(onScrollEnd, throttle + idle);
  const setArrivedState = (target) => {
    var _a3;
    if (!window2)
      return;
    const el2 = ((_a3 = target == null ? void 0 : target.document) == null ? void 0 : _a3.documentElement) || (target == null ? void 0 : target.documentElement) || unrefElement(target);
    const { display, flexDirection } = getComputedStyle(el2);
    const scrollLeft = el2.scrollLeft;
    directions.left = scrollLeft < internalX.value;
    directions.right = scrollLeft > internalX.value;
    const left = Math.abs(scrollLeft) <= (offset.left || 0);
    const right = Math.abs(scrollLeft) + el2.clientWidth >= el2.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === "flex" && flexDirection === "row-reverse") {
      arrivedState.left = right;
      arrivedState.right = left;
    } else {
      arrivedState.left = left;
      arrivedState.right = right;
    }
    internalX.value = scrollLeft;
    let scrollTop = el2.scrollTop;
    if (target === window2.document && !scrollTop)
      scrollTop = window2.document.body.scrollTop;
    directions.top = scrollTop < internalY.value;
    directions.bottom = scrollTop > internalY.value;
    const top2 = Math.abs(scrollTop) <= (offset.top || 0);
    const bottom = Math.abs(scrollTop) + el2.clientHeight >= el2.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === "flex" && flexDirection === "column-reverse") {
      arrivedState.top = bottom;
      arrivedState.bottom = top2;
    } else {
      arrivedState.top = top2;
      arrivedState.bottom = bottom;
    }
    internalY.value = scrollTop;
  };
  const onScrollHandler = (e) => {
    var _a3;
    if (!window2)
      return;
    const eventTarget = (_a3 = e.target.documentElement) != null ? _a3 : e.target;
    setArrivedState(eventTarget);
    isScrolling.value = true;
    onScrollEndDebounced(e);
    onScroll(e);
  };
  useEventListener(
    element,
    "scroll",
    throttle ? useThrottleFn(onScrollHandler, throttle, true, false) : onScrollHandler,
    eventListenerOptions
  );
  tryOnMounted(() => {
    try {
      const _element = toValue(element);
      if (!_element)
        return;
      setArrivedState(_element);
    } catch (e) {
      onError(e);
    }
  });
  useEventListener(
    element,
    "scrollend",
    onScrollEnd,
    eventListenerOptions
  );
  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
    measure() {
      const _element = toValue(element);
      if (window2 && _element)
        setArrivedState(_element);
    }
  };
}
function resolveElement(el2) {
  if (typeof Window !== "undefined" && el2 instanceof Window)
    return el2.document.documentElement;
  if (typeof Document !== "undefined" && el2 instanceof Document)
    return el2.documentElement;
  return el2;
}
function useInfiniteScroll(element, onLoadMore, options = {}) {
  var _a3;
  const {
    direction = "bottom",
    interval = 100,
    canLoadMore = () => true
  } = options;
  const state = reactive(useScroll(
    element,
    {
      ...options,
      offset: {
        [direction]: (_a3 = options.distance) != null ? _a3 : 0,
        ...options.offset
      }
    }
  ));
  const promise2 = ref();
  const isLoading = computed(() => !!promise2.value);
  const observedElement = computed(() => {
    return resolveElement(toValue(element));
  });
  const isElementVisible = useElementVisibility(observedElement);
  function checkAndLoad() {
    state.measure();
    if (!observedElement.value || !isElementVisible.value || !canLoadMore(observedElement.value))
      return;
    const { scrollHeight, clientHeight, scrollWidth, clientWidth } = observedElement.value;
    const isNarrower = direction === "bottom" || direction === "top" ? scrollHeight <= clientHeight : scrollWidth <= clientWidth;
    if (state.arrivedState[direction] || isNarrower) {
      if (!promise2.value) {
        promise2.value = Promise.all([
          onLoadMore(state),
          new Promise((resolve2) => setTimeout(resolve2, interval))
        ]).finally(() => {
          promise2.value = null;
          nextTick(() => checkAndLoad());
        });
      }
    }
  }
  watch(
    () => [state.arrivedState[direction], isElementVisible.value],
    checkAndLoad,
    { immediate: true }
  );
  return {
    isLoading
  };
}
function useNow(options = {}) {
  const {
    controls: exposeControls = false,
    interval = "requestAnimationFrame"
  } = options;
  const now = ref(/* @__PURE__ */ new Date());
  const update = () => now.value = /* @__PURE__ */ new Date();
  const controls = interval === "requestAnimationFrame" ? useRafFn(update, { immediate: true }) : useIntervalFn(update, interval, { immediate: true });
  if (exposeControls) {
    return {
      now,
      ...controls
    };
  } else {
    return now;
  }
}
function usePrevious(value, initialValue) {
  const previous = shallowRef(initialValue);
  watch(
    toRef(value),
    (_, oldValue) => {
      previous.value = oldValue;
    },
    { flush: "sync" }
  );
  return readonly(previous);
}
const getPlatformAPI = async () => {
  const [PlatformAPI] = await requirejs(["DS/PlatformAPI/PlatformAPI"]);
  return PlatformAPI;
};
const getI3DXCompassPlatformServices = async () => {
  const [i3DXCompassPlatformServices] = await requirejs(["DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices"]);
  return i3DXCompassPlatformServices;
};
const getTransientWidget = async () => {
  const [TransientWidget] = await requirejs(["DS/TransientWidget/TransientWidget"]);
  return TransientWidget;
};
const getWAFData = async () => {
  const [WAFData] = await requirejs(["DS/WAFData/WAFData"]);
  return WAFData;
};
const getOpenWith = async () => {
  const [OpenWith] = await requirejs(["DS/i3DXCompassPlatformServices/OpenWith"]);
  return OpenWith;
};
const getTrackerAPI = async () => {
  const [TrackerAPI] = await requirejs(["DS/Usage/TrackerAPI"]);
  return TrackerAPI;
};
const getCompassData = async () => {
  const [CompassData] = await requirejs(["DS/i3DXCompass/Data"]);
  return CompassData;
};
const getI18n = async () => {
  const [I18n] = await requirejs(["DS/UWPClientCode/I18n"]);
  return I18n;
};
const { $i18n: $i18n$5 } = useTranslations();
const checkIfIsUrl = (str) => {
  let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(str);
};
const addAndSortNotifsDateDesc = (array, el2) => {
  if (array.find((item) => item.id === el2.id)) return;
  let index = 0;
  for (const item of array) {
    if (el2.date >= item.date) break;
    index++;
  }
  array.splice(index, 0, el2);
};
const addAndSortIdsDesc = (array, id2) => {
  if (array.find((idItem) => idItem === id2)) return;
  let index = 0;
  for (const idItem of array) {
    if (id2 >= idItem && idItem !== -1) break;
    index++;
  }
  array.splice(index, 0, id2);
};
const timeDiffByDays = (date) => {
  const today2 = new Date(Date.now());
  const diff = today2 - date;
  return Math.floor(diff / (1e3 * 60 * 60 * 24));
};
const replaceParenthesisStrong = (input, replaceWith) => {
  if (input.indexOf(`)`) !== -1) {
    const partToReplace = input.slice(0, input.indexOf(`)`) + `)`.length);
    return input.replace(partToReplace, replaceWith);
  } else if (input.indexOf(`</strong>`) !== -1) {
    const partToReplace = input.slice(0, input.indexOf(`</strong>`) + `</strong>`.length);
    return input.replace(partToReplace, replaceWith);
  }
  return input;
};
const getDateMergeFormat = async (date) => {
  if (timeDiffByDays(date) === 0) {
    return $i18n$5("today");
  } else if (timeDiffByDays(date) === 1) {
    return $i18n$5("yesterday");
  } else {
    const I18n = await getI18n();
    return date.toLocaleDateString(I18n.getCurrentLanguage(), {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
};
const getDateSectionFormat = async (date) => {
  if (timeDiffByDays(date) === 0) {
    return $i18n$5("today").toUpperCase();
  } else if (timeDiffByDays(date) === 1) {
    return $i18n$5("yesterday").toUpperCase();
  } else {
    const format = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    const I18n = await getI18n();
    return date.toLocaleDateString(I18n.getCurrentLanguage(), format).toUpperCase();
  }
};
const checkIfIdHasHyphen = (id2) => {
  try {
    if (id2.includes("-")) {
      return {
        id: id2.split("-")[0],
        clusterId: id2.split("-")[1]
      };
    }
    return false;
  } catch (error) {
    return false;
  }
};
const linkIds = (id2, clusterId) => {
  return `${id2}-${clusterId}`;
};
const useAnalyticsStore = /* @__PURE__ */ defineStore("analytics", () => {
  const startTime = ref(0);
  const label = ref("");
  const setStartTime = (time) => {
    startTime.value = time;
  };
  const resetAnalytics = () => {
    startTime.value = 0;
    label.value = "";
  };
  const setLabel = (labelValue) => {
    label.value = labelValue;
  };
  const setAnalytics = (time, labelValue) => {
    setStartTime(time);
    setLabel(labelValue);
  };
  return {
    startTime,
    label,
    // endTime,
    getStartTime: () => startTime.value,
    durationTime: () => {
      return startTime.value === 0 ? -1 : Math.abs(performance.now() - startTime.value);
    },
    getLabel: () => label.value,
    setLabel,
    // setEndTime,
    setStartTime,
    setAnalytics,
    resetAnalytics
  };
});
const useConnectionStore = /* @__PURE__ */ defineStore("connection", () => {
  const socketStatus = ref(null);
  const isSocketConnected = computed(() => socketStatus.value === "connected");
  const isSocketDisconnected = computed(() => socketStatus.value === "disconnected");
  const previousSocketStatus = usePrevious(socketStatus);
  const isPreviousSocketConnected = computed(() => previousSocketStatus.value === "connected");
  const isPreviousSocketDisconnected = computed(() => previousSocketStatus.value === "disconnected");
  const checkingSocketStatus = ref(false);
  const start = ref(null);
  const stop = ref(null);
  const setSocketStatusVariables = ({ _stop, _start }) => {
    stop.value = _stop;
    start.value = _start;
  };
  const setCheckingSocketStatus = (status) => {
    if (typeof status === "boolean") {
      checkingSocketStatus.value = status;
    }
  };
  const needCenterRefresh = ref(false);
  const setNeedCenterRefresh = (status) => {
    if (typeof status === "boolean") {
      needCenterRefresh.value = status;
    }
  };
  const driverSenderQueue = ref([]);
  const addToDriverSenderQueue = (action) => {
    driverSenderQueue.value.push(action);
  };
  const setSocketStatus2 = (status) => {
    const statusMap = ["connected", "disconnected"];
    if (typeof status === "string" && statusMap.includes(status)) {
      socketStatus.value = status;
    }
  };
  const resetSocketStatus = () => {
    socketStatus.value = null;
  };
  return {
    socketStatus,
    previousSocketStatus,
    isSocketConnected,
    isSocketDisconnected,
    isPreviousSocketConnected,
    isPreviousSocketDisconnected,
    checkingSocketStatus,
    driverSenderQueue,
    needCenterRefresh,
    start,
    stop,
    addToDriverSenderQueue,
    setSocketStatus: setSocketStatus2,
    resetSocketStatus,
    setCheckingSocketStatus,
    setNeedCenterRefresh,
    setSocketStatusVariables
  };
});
let Notification$1 = class Notification2 {
  /**
   * Build a notification object.
   * @param {object} notification - A notification object.
   */
  constructor(notification, options, merge = false) {
    for (const [key, value] of Object.entries(notification)) {
      if (key === "CREATION_DATE" || key === "READ_DATE" || key === "ACTION_DATE") {
        this[key] = value !== null ? new Date(value) : null;
      } else this[key] = value;
    }
    this.CLUSTER_ID = options.clusterId || this.CLUSTER_ID;
    const idWithHyphen = checkIfIdHasHyphen(this.ID);
    if (!idWithHyphen) {
      this.NOTIF_ID = JSON.parse(JSON.stringify(this.ID));
      this.ID = linkIds(this.NOTIF_ID, this.CLUSTER_ID);
    } else {
      this.NOTIF_ID = parseInt(idWithHyphen.id);
    }
    this.deleted = false;
    this.deleteTimeoutId = null;
    this.currentTenant = options.currentTenant;
    this.appName = options.appName;
    if (!merge) {
      if (Object.hasOwn(this, "COUNT") && this.COUNT > 1) {
        this.hasMerges = true;
        this.mergesFetched = false;
        this.mergesOpened = false;
        this.mergesRead = this.READ_DATE !== null ? this.COUNT : 0;
      }
    }
  }
  /**
   * Return notification options.
   */
  get getOptions() {
    return this.OPTIONS;
  }
  /**
   * Get the creation date to a format with options.
   * @param {string} local - The local string.
   * @param {object} option - The format option.
   * @returns {string} - The format outcome.
   */
  toLocaleDateString(local = void 0, option = {}) {
    return this.CREATION_DATE.toLocaleDateString(local, option);
  }
  /**
   * Returns the hour and minutes of the notification's creation date.
   * @param {string} format - The format for the date and time. (Optional).
   * @returns {string} The formatted hour and minutes.
   */
  getHourMinutes(format) {
    return new Intl.DateTimeFormat("fr", { hour: "2-digit", minute: "2-digit" }).format(this.CREATION_DATE);
  }
  /**
   * Get the timestamp of the creation date.
   */
  get getCreationDateToTimestamp() {
    return this.CREATION_DATE.getTime();
  }
  /**
   * Return true if icon is a link.
   */
  get isIconLink() {
    if (this.MESSAGE.icon) {
      if (this.MESSAGE.icon.isLink) return true;
    }
    return false;
  }
  /**
   * Todo: this is not reactive yet.
   */
  get imageSrc() {
    if (this.MESSAGE.icon) {
      if (this.MESSAGE.icon.src) this.MESSAGE.icon.src;
    }
    return "./../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png";
  }
  /**
   * Return notification section id.
   */
  get getSection() {
    const date = new Date(this.CREATION_DATE.getTime());
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }
  /**
   * Return true if READ_DATE is null.
   */
  get isRead() {
    return this.READ_DATE !== null;
  }
  /**
   * Return true if ACTION is null.
   */
  get isActioned() {
    return this.ACTION_DATE !== null && this.ACTION_DATE !== "0000-00-00 00:00:00" ? true : false;
  }
  /**
   * Return true if is starred.
   */
  get isStarred() {
    return this.STARRED === 1 || this.STARRED === "1";
  }
  /**
   * Return true if is Count > 1.
   */
  get isGroup() {
    return Object.hasOwn(this, "COUNT") && this.COUNT > 1;
  }
  /**
   * Return true if is Merge.
   */
  get isMerge() {
    return !Object.hasOwn(this, "COUNT");
  }
  /**
   * Performs an action for the notification.
   */
  actionNotification() {
    this.ACTION_DATE = (/* @__PURE__ */ new Date()).toISOString();
  }
};
class Section {
  /**
   * The Section constructor to create a new section with an id.
   * @param {number} id - The id is the notification date timestamp without the time.
   */
  constructor(id2) {
    __publicField(this, "id");
    __publicField(this, "title");
    __publicField(this, "notifs");
    this.notifs = [];
    if (typeof id2 === "number") {
      this.id = id2;
      this.title = ref(" ");
      const date = new Date(id2);
      getDateSectionFormat(date).then((resolvedTitle) => {
        this.title.value = resolvedTitle;
      });
    }
  }
  /**
   * Add an notification to notifs then sort it.
   * @param {object} item - { id, date }.
   */
  add(item) {
    const itemExists = this.notifs.filter((o) => o.id === item.id).length > 0;
    if (!itemExists) {
      addAndSortNotifsDateDesc(this.notifs, item);
    }
  }
  /**
   * Removes a notification with the specified ID from the section.
   * @param {number} id - The ID of the notification to remove.
   */
  remove(id2) {
    this.notifs = this.notifs.filter((o) => o.id !== id2);
  }
}
function useUWA() {
  let UWA2 = window.UWA;
  return {
    UWA: UWA2
  };
}
class Setting {
  /**
   * Constructs a new Setting object.
   * @param {Object} setting - The setting object.
   */
  constructor(setting) {
    for (const [key, value] of Object.entries(setting)) {
      this[key.toLowerCase()] = value;
    }
    this.groupList = [];
  }
  /**
   * Returns whether the setting is a group.
   * @returns {boolean} True if the setting is a group, false otherwise.
   */
  get isGroup() {
    return this.name === "GLOBAL";
  }
  /**
   * Returns whether the setting is read-only.
   * @returns {boolean} True if the setting is read-only, false otherwise.
   */
  get readOnly() {
    return parseInt(!!this.subscribe.readOnly ? this.subscribe.readOnly || 0 : 0) === 1;
  }
  /**
   * Returns whether the notification is enabled.
   *
   * @returns {boolean} True if the notification is enabled, false otherwise.
   */
  get enable() {
    return parseInt(!!this.subscribe.enable ? this.subscribe.enable || 0 : this.subscribe || 0) === 1 && (this.unsubscribe_date === null || new Date(this.unsubscribe_date) < new Date(Date.now()));
  }
  /**
   * Returns the value of notif_by_uiReadOnly.
   * @returns {number} The value of notif_by_uiReadOnly.
   */
  get notif_by_uiReadOnly() {
    return parseInt(!!this.notif_by_ui.readOnly ? this.notif_by_ui.readOnly || 0 : 0);
  }
  /**
   * Returns the value of notif_by_emailReadonly.
   * @returns {number} The value of notif_by_emailReadonly.
   */
  get notif_by_emailReadonly() {
    return parseInt(!!this.notif_by_email.readOnly ? this.notif_by_email.readOnly || 0 : 0);
  }
  /**
   * Returns the value of notif_by_browserReadonly.
   * @returns {number} The value of notif_by_browserReadonly.
   */
  get notif_by_browserReadonly() {
    return parseInt(!!this.notif_by_browser.readOnly ? this.notif_by_browser.readOnly || 0 : 0);
  }
  /**
   * Resets the unsubscription date.
   */
  resetUnsubscriptionDate() {
    this.unsubscribe_date = null;
  }
  /**
   * Checks if the given ID is present in the group list.
   *
   * @param {any} id - The ID to check.
   * @returns {boolean} - Returns true if the ID is present in the group list, otherwise returns false.
   */
  isInGroupList(id2) {
    return this.groupList.includes(id2);
  }
  /**
   * Sets the group list.
   *
   * @param {Array} groupList - The new group list.
   * @returns {void}
   */
  setGroupList(groupList) {
    this.groupList = groupList;
  }
  /**
   * Adds an ID to the group list.
   *
   * @param {any} id - The ID to be added to the group list.
   * @returns {void}
   */
  addIdToGroupList(id2) {
    if (!this.groupList.includes(id2)) this.groupList.push(id2);
  }
}
const useSettingsStore = /* @__PURE__ */ defineStore("settings", () => {
  const settingState = reactive({
    loaded: {
      settings: false
    },
    isLoading: {
      settings: false
    }
  });
  const setSettingLoadState = (key, value) => {
    settingState.loaded[key] = value;
  };
  const setSettingLoadingState = (key, value) => {
    settingState.isLoading[key] = value;
  };
  const centerShow = ref(true);
  const isDND = ref(false);
  const appSettingOpened = ref(false);
  const tenants = reactive({
    tenants: []
  });
  const currentSetting = ref(null);
  const setCurrentSetting = (id2) => {
    currentSetting.value = id2;
  };
  const resetCurrentSetting = () => {
    currentSetting.value = null;
  };
  const resetSettingUnsubDate = (id2) => {
    const s = getSetting(id2);
    if (s) s.unsubscribe_date = null;
  };
  const currentTenant = ref(null);
  const settings2 = reactive(/* @__PURE__ */ new Map());
  const unsubscribe_dateSettingList = ref([]);
  const isInUnsubscribe_dateSettingList = (id2) => {
    return unsubscribe_dateSettingList.value.indexOf(id2) !== -1;
  };
  const addUnsubscribe_dateSetting = (id2) => {
    if (!isInUnsubscribe_dateSettingList(id2)) {
      unsubscribe_dateSettingList.value.push(id2);
    }
  };
  const removeUnsubscribe_dateSetting = (id2) => {
    const index = unsubscribe_dateSettingList.value.indexOf(id2);
    if (index !== -1) {
      unsubscribe_dateSettingList.value.splice(index, 1);
    }
  };
  const settingsList = reactive(/* @__PURE__ */ new Map());
  const listOfService = ref([]);
  const refreshNotificationCenter = ref(false);
  const nameofUpdatedSetting = ref(null);
  const hidePlatformSelection = ref(true);
  const isTenantAgnostic = ref(0);
  const setCenterShow = (value) => {
    centerShow.value = value;
  };
  const setDNDStatus2 = (value) => {
    isDND.value = value.isDND;
  };
  const setAppSettingOpened = (value) => {
    appSettingOpened.value = value;
  };
  const setCurrentTenant = (tenant) => {
    currentTenant.value = tenant;
  };
  const setTenantAgnosticData = (data) => {
    hidePlatformSelection.value = data.hidePlatformSelection;
    isTenantAgnostic.value = data.isTenantAgnostic;
  };
  const setListOfService = (data) => {
    listOfService.value = data.services;
    setCurrentTenant(data.currentTenant);
  };
  const setNameofUpdatedSetting = (data) => {
    nameofUpdatedSetting.value = data.setting;
  };
  const setTenantsData = (data) => {
    tenants.tenants = data;
  };
  const getIndividualSettingIds = (id2) => {
    const setting = getSetting(id2);
    return setting ? setting.groupList : [];
  };
  const getSettingGroup = (setting) => {
    for (const [key, value] of settings2.entries()) {
      if (value.isGroup && value.service === setting.service) {
        return value;
      }
    }
    return null;
  };
  const isSettingGroup = (setting) => {
    const thatSetting = getSetting(setting.id);
    return thatSetting && thatSetting.isGroup;
  };
  const addSettingIdToGroupList = (group, settingId) => {
    group.addIdToGroupList(settingId);
  };
  const getSetting = (id2) => {
    return settings2.get(id2) ?? null;
  };
  const getAllGroupSettings = computed(() => {
    const groupSettings = [];
    settings2.forEach((setting) => {
      if (setting.isGroup) {
        groupSettings.push(setting);
      }
    });
    return groupSettings;
  });
  const getGroupIndividualSettings = (group) => {
    const groupSettings = [];
    group.groupList.forEach((id2) => {
      const setting = getSetting(id2);
      if (setting && !setting.isGroup) {
        groupSettings.push(setting);
      }
    });
    return groupSettings;
  };
  const addSetting = (setting) => {
    const newSetting = new Setting(setting);
    const existingSetting = getSetting(setting.ID);
    if (existingSetting) {
      for (const key in setting) {
        if (key.toLowerCase() !== "servicename" && key.toLowerCase() !== "id" && key.toLowerCase() !== "name") {
          existingSetting[key.toLowerCase()] = setting[key];
        }
      }
    } else {
      settings2.set(newSetting.id, newSetting);
      if (newSetting.unsubscribe_date !== null) {
        addUnsubscribe_dateSetting(newSetting.id);
      }
    }
  };
  const setSettingsData = (data) => {
    for (let i = 0; i < data.settings.length; i++) {
      if (data.settings[i].service !== "X3DNTFC_AP") {
        addSetting(data.settings[i]);
      }
    }
    settings2.forEach((setting) => {
      const group = getSettingGroup(setting);
      if (group) {
        addSettingIdToGroupList(group, setting.id);
      }
    });
  };
  const setSettingData = (data) => {
    addSetting(data);
  };
  return {
    refreshNotificationCenter,
    unsubscribe_dateSettingList,
    listOfService,
    nameofUpdatedSetting,
    tenants,
    settings: settings2,
    settingsList,
    centerShow,
    isDND,
    currentTenant,
    appSettingOpened,
    getAllGroupSettings,
    settingState,
    currentSetting,
    hidePlatformSelection,
    isTenantAgnostic,
    getCenterShow: () => centerShow.value,
    getDNDStatus: () => isDND.value,
    getCurrentTenant: () => currentTenant.value,
    getTenantAgnosticMode: () => platforms.isTenantAgnostic,
    getTenants: () => tenants.tenants,
    getListOfService: () => listOfService.value,
    setCurrentSetting,
    resetCurrentSetting,
    getGroupIndividualSettings,
    getSettingGroup,
    getSetting,
    isSettingGroup,
    getIndividualSettingIds,
    addSettingIdToGroupList,
    addSetting,
    setTenantAgnosticData,
    setSettingLoadState,
    setSettingLoadingState,
    setListOfService,
    setCurrentTenant,
    setTenantsData,
    setNameofUpdatedSetting,
    setSettingsData,
    setSettingData,
    setCenterShow,
    setDNDStatus: setDNDStatus2,
    setAppSettingOpened,
    addUnsubscribe_dateSetting,
    removeUnsubscribe_dateSetting,
    resetSettingUnsubDate
  };
});
function NotificationTrackerUsage() {
  const { UWA: UWA2 } = useUWA();
  const notificationsStore = useNotificationsStore();
  const report = {
    appID: "X3DNTFC_AP"
  };
  const centerActionTracker = () => {
    const openNotifWith = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "openNotifWith";
      report.eventLabel = "Open notification with";
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Open notification with Analytics request failed : ${error}`);
      }
    };
    const openNotifInNewTab = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "openNotifInNewTab";
      report.eventLabel = "Open notification in new tab";
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Open notification in new tab Analytics request failed : ${error}`);
      }
    };
    const notifClick = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "notifClick";
      report.eventLabel = "Click on a notification";
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Notification click Analytics request failed : ${error}`);
      }
    };
    const profileClick = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "profileClick";
      report.eventLabel = "Click on a profile";
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Profile click Analytics request failed : ${error}`);
      }
    };
    const viewAllMergeNotif = async (data = {}) => {
      const { nbMerge, persDim, persVal } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "viewAllMergeNotif";
      report.eventLabel = "View all merge Notifications";
      report.eventValue = nbMerge;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`View all merge Notifications Analytics request failed : ${error}`);
      }
    };
    const hideAllMergeNotif = async (data = {}) => {
      const { nbMerge, persDim, persVal } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "hideAllMergeNotif";
      report.eventLabel = "Hide all merge Notifications";
      report.eventValue = nbMerge;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Hide all merge Notifications Analytics request failed : ${error}`);
      }
    };
    const notificationStar = async (data = {}) => {
      const { persDim, persVal, starred: starred2 } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = starred2 ? "notificationStarred" : "notificationUnstarred";
      report.eventLabel = (starred2 ? "Sta" : "Unsta") + "r a notification";
      report.eventValue = starred2 ? 1 : 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Notification starred Analytics request failed : ${error}`);
      }
    };
    const notificationRead2 = async (data = {}) => {
      const { persDim, persVal, read: read2 } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = read2 ? "notificationRead" : "notificationUnread";
      report.eventLabel = (read2 ? "R" : "Unr") + "ead a notification";
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Notification read Analytics request failed : ${error}`);
      }
    };
    const cancelNotificationDeletion = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "cancelNotificationDeletion";
      report.eventLabel = "Cancel notification deletion";
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Cancel notification deletion Analytics request failed : ${error}`);
      }
    };
    const notificationDelete2 = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "notificationDelete";
      report.eventLabel = "Delete a notification";
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Notification delete Analytics request failed : ${error}`);
      }
    };
    return {
      openNotifWith,
      viewAllMergeNotif,
      hideAllMergeNotif,
      notificationRead: notificationRead2,
      notificationDelete: notificationDelete2,
      notificationStar,
      openNotifInNewTab,
      notifClick,
      profileClick,
      cancelNotificationDeletion
    };
  };
  const multipleSelectionActionTracker = () => {
    const selectionAction = async (data = {}) => {
      const { persDim, persVal, action, length } = data;
      report.eventCategory = "notification.selection";
      report.eventAction = action;
      report.eventLabel = `Multiple selection action: ${action}`;
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Multiple selection action Analytics request failed : ${error}`);
      }
    };
    const enableSelection = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.selection";
      report.eventAction = "enableSelection";
      report.eventLabel = "Enable multiple selection";
      report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Enable multiple selection Analytics request failed : ${error}`);
      }
    };
    const disableSelection = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.selection";
      report.eventAction = "disableSelection";
      report.eventLabel = "Disable multiple selection";
      report.eventValue = 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Disable multiple selection Analytics request failed : ${error}`);
      }
    };
    const readSelectedNotifications = async (data = {}) => {
      const { persDim, persVal, read: read2, length } = data;
      report.eventCategory = "notification.selection";
      report.eventAction = read2 ? "readSelectedNotifications" : "unreadSelectedNotifications";
      report.eventLabel = (read2 ? "R" : "Unr") + "ead selected notification(s)";
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Read/Unred selected notifications Analytics request failed  : ${error}`);
      }
    };
    const deleteSelectedNotifications = async (data = {}) => {
      const { persDim, persVal, length } = data;
      report.eventCategory = "notification.selection";
      report.eventAction = "deleteSelectedNotifications";
      report.eventLabel = "Delete selected notification(s)";
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Delete selected notifications Analytics request failed : ${error}`);
      }
    };
    const starSelectedNotifications = async (data = {}) => {
      const { persDim, persVal, starred: starred2, length } = data;
      report.eventCategory = "notification.selection";
      report.eventAction = starred2 ? "starSelectedNotifications" : "unstarSelectedNotifications";
      report.eventLabel = (starred2 ? "Sta" : "Unsta") + "r selected notification(s)";
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Star/Unstar selected notifications Analytics request failed : ${error}`);
      }
    };
    const unsubscribeSelectedNotifications = async (data = {}) => {
      const { persDim, persVal, length } = data;
      report.eventCategory = "notification.selection";
      report.eventAction = "unsubscribeSelectedNotifications";
      report.eventLabel = "Unsubscribe selected notification(s)";
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Unsubscribe selected notifications Analytics request failed : ${error}`);
      }
    };
    return {
      readSelectedNotifications,
      deleteSelectedNotifications,
      starSelectedNotifications,
      unsubscribeSelectedNotifications,
      enableSelection,
      disableSelection,
      selectionAction
    };
  };
  const settingIconActionTracker = () => {
    const invokenotifSettingView = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsicon.v2";
      report.eventAction = "invokenotifSettingView";
      report.eventLabel = "Open settings view";
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`invokenotifSettingView Analytics request failed : ${error}`);
      }
    };
    const deleteAllNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsicon.v2";
      report.eventAction = "deleteAllNotifications";
      report.eventLabel = "Delete all notifications";
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Delete all notifications Analytics request failed : ${error}`);
      }
    };
    const deleteAllFilteredNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsicon.v2";
      report.eventAction = "deleteAllFilteredNotifications";
      report.eventLabel = "Delete all filtered notifications";
      report.eventValue = notificationsStore.filterNotifIds.length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Delete all filtered notifications Analytics request failed : ${error}`);
      }
    };
    const readAllNotifications2 = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsicon.v2";
      report.eventAction = "readAllNotifications";
      report.eventLabel = "Read all notifications";
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Read all notifications Analytics request failed : ${error}`);
      }
    };
    const unreadAllNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsicon.v2";
      report.eventAction = "unreadAllNotifications";
      report.eventLabel = "Unread all notifications";
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Unread all notifications Analytics request failed : ${error}`);
      }
    };
    const readAllFilteredNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsicon.v2";
      report.eventAction = "readAllFilteredNotifications";
      report.eventLabel = "Read all filtered notifications";
      report.eventValue = notificationsStore.filterTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Read all filtered notifications Analytics request failed : ${error}`);
      }
    };
    const unreadAllFilteredNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsicon.v2";
      report.eventAction = "unreadAllFilteredNotifications";
      report.eventLabel = "Unread all filtered notifications";
      report.eventValue = notificationsStore.filterTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Unread all filtered notifications Analytics request failed : ${error}`);
      }
    };
    const switchTenantNotifications = async (data = {}) => {
      const { persDim, persVal, tenant } = data;
      report.eventCategory = "notification.settingsicon.v2";
      report.eventAction = "switchTenantNotifications";
      report.eventLabel = `Switch to ${tenant === "all" ? "all" : "current (" + tenant + ")"} tenant notifications`;
      report.eventValue = tenant === "all" ? 1 : 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Switch tenant notifications Analytics request failed : ${error}`);
      }
    };
    return {
      invokenotifSettingView,
      deleteAllNotifications,
      deleteAllFilteredNotifications,
      readAllNotifications: readAllNotifications2,
      readAllFilteredNotifications,
      unreadAllNotifications,
      unreadAllFilteredNotifications,
      switchTenantNotifications
    };
  };
  const notificationSettingViewTracker = () => {
    const notifServiceOrSettings = async (data = {}) => {
      const { getSetting } = useSettingsStore();
      const { persVal, setting } = data;
      report.eventCategory = "notification.settingsview.v2";
      report.eventValue = setting.SUBSCRIBE;
      report.persVal = persVal;
      const defautSetting = getSetting(setting.ID);
      if (defautSetting) {
        report.persDim = {
          ppd1: defautSetting.name,
          pd2: defautSetting.servicename,
          pd3: defautSetting.service
        };
        if (defautSetting.subscribe !== setting.SUBSCRIBE) {
          if (setting.SUBSCRIBE === 0) {
            report.eventAction = "disableNotifServiceOrSettings";
            report.eventLabel = "Disable notification service or settings";
          } else {
            report.eventAction = "enableNotifServiceOrSettings";
            report.eventLabel = "Enable notification service or settings";
          }
          try {
            const trackerAPI = await getTrackerAPI();
            trackerAPI.trackPageEvent(report);
          } catch (error) {
            UWA2.log(`Notification service or settings Analytics request failed : ${error}`);
          }
        }
      }
    };
    const unsubscribeNotification = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsview.v2";
      report.eventAction = "unsubscribeNotification";
      report.eventLabel = "Unsubscribe notification";
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Unsubscribe notification Analytics request failed : ${error}`);
      }
    };
    const resetUnsubscribeNotificationDate = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsview.v2";
      report.eventAction = "resetUnsubscribeNotificationDate";
      report.eventLabel = "Reset unsubscribe notification date";
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Reset unsubscribe notification date Analytics request failed : ${error}`);
      }
    };
    const notifAlertSetting = async (data = {}) => {
      const { persVal, setting } = data;
      const { getSetting } = useSettingsStore();
      report.eventCategory = "notification.settingsview.v2";
      report.persVal = persVal;
      const defautSetting = getSetting(setting.ID);
      if (defautSetting) {
        report.persDim = {
          pd1: defautSetting.name,
          pd2: defautSetting.servicename,
          pd3: defautSetting.service
        };
        if (setting.NOTIF_BY_UI === 0 && defautSetting.notif_by_ui !== setting.NOTIF_BY_UI) {
          report.eventAction = "disableNotifAlert";
          report.eventLabel = "Disable notification alert setting";
          report.eventValue = setting.NOTIF_BY_UI;
        } else if (setting.NOTIF_BY_UI === 1 && defautSetting.notif_by_ui !== setting.NOTIF_BY_UI) {
          report.eventAction = "enableNotifAlert";
          report.eventLabel = "Enable notification alert setting";
          report.eventValue = setting.NOTIF_BY_UI;
        }
        if (setting.NOTIF_BY_EMAIL === 0 && defautSetting.notif_by_email !== setting.NOTIF_BY_EMAIL) {
          report.eventAction = "disableNotifMail";
          report.eventLabel = "Disable notification mail setting";
          report.eventValue = setting.NOTIF_BY_EMAIL;
        } else if (setting.NOTIF_BY_EMAIL === 1 && defautSetting.notif_by_email !== setting.NOTIF_BY_EMAIL) {
          report.eventAction = "enableNotifMail";
          report.eventLabel = "Enable notification mail setting";
          report.eventValue = setting.NOTIF_BY_EMAIL;
        }
        if (setting.NOTIF_BY_BROWSER === 0 && defautSetting.notif_by_browser !== setting.NOTIF_BY_BROWSER) {
          report.eventAction = "disableNotifBrowser";
          report.eventLabel = "Disable notification browser setting";
          report.eventValue = setting.NOTIF_BY_BROWSER;
        } else if (setting.NOTIF_BY_BROWSER === 1 && defautSetting.notif_by_browser !== setting.NOTIF_BY_BROWSER) {
          report.eventAction = "enableNotifBrowser";
          report.eventLabel = "Enable notification browser setting";
          report.eventValue = setting.NOTIF_BY_BROWSER;
        }
        try {
          const trackerAPI = await getTrackerAPI();
          trackerAPI.trackPageEvent(report);
        } catch (error) {
          UWA2.log(`Notification alert settings Analytics request failed : ${error}`);
        }
      }
    };
    const serviceSettingsView = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.settingsview.v2";
      report.eventAction = "serviceSettingsView";
      report.eventLabel = "Specific service settings";
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Service settings view Analytics request failed : ${error}`);
      }
    };
    const backtoNotificationSettingsView = async (data = {}) => {
      report.eventCategory = "notification.settingsview.v2";
      report.eventAction = "backtoNotificationSettingsView";
      report.eventLabel = "Backword navigation from service view";
      report.persDim = {
        pd1: "showSettings"
      };
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Back to notification settings view Analytics request failed : ${error}`);
      }
    };
    const backtoNotificationCenterView = async (data = {}) => {
      report.eventCategory = "notification.settingsview.v2";
      report.eventAction = "backtoNotificationCenterView";
      report.eventLabel = "Backword navigation from setting view";
      report.persDim = {
        pd1: "showCenter"
      };
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Back to notification center view Analytics request failed : ${error}`);
      }
    };
    return {
      notifServiceOrSettings,
      unsubscribeNotification,
      resetUnsubscribeNotificationDate,
      notifAlertSetting,
      serviceSettingsView,
      backtoNotificationSettingsView,
      backtoNotificationCenterView
    };
  };
  const notificationFilterViewTracker = () => {
    const clicknotifFilterIconToShow = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.filterview.v2";
      report.eventAction = "clicknotifFilterIconToShow";
      report.eventLabel = "Click on notification filter icon to show filter";
      report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Click on notification filter icon to show filter Analytics request failed : ${error}`);
      }
    };
    const clicknotifFilterIconToHide = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.filterview.v2";
      report.eventAction = "clicknotifFilterIconToHide";
      report.eventLabel = "Click on notification filter icon to hide filter";
      report.eventValue = 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Click on notification filter icon to hide filter Analytics request failed : ${error}`);
      }
    };
    const clickFilterButton = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.filterview.v2";
      report.eventAction = "clickFilterButton";
      report.eventLabel = "Filter button click";
      report.eventValue = notificationsStore.filterTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Click on filter button Analytics request failed : ${error}`);
      }
    };
    const cancelFilterView = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.filterview.v2";
      report.eventAction = "cancelFilterView";
      report.eventLabel = "Filter panel closed";
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Filter panel closed view Analytics request failed : ${error}`);
      }
    };
    const resetFilterFields = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = "notification.filterview.v2";
      report.eventAction = "resetFilterFields";
      report.eventLabel = "Reset filter panel fields";
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Reset filter fields Analytics request failed : ${error}`);
      }
    };
    return {
      clicknotifFilterIconToShow,
      clicknotifFilterIconToHide,
      clickFilterButton,
      cancelFilterView,
      resetFilterFields
    };
  };
  const notificationsLoadTimeTracker = () => {
    const notificationLoaded = async (data = {}) => {
      const { persDim, persVal, time } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "notificationLoaded";
      report.eventLabel = "Loading time in Notification Center in milliseconds";
      report.eventValue = time;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Notifications load time Analytics request failed : ${error}`);
      }
    };
    const notificationFilterLoaded = async (data = {}) => {
      const { persDim, persVal, time } = data;
      report.eventCategory = "notification.center.v2";
      report.eventAction = "notificationFilterLoaded";
      report.eventLabel = "Loading time in Notification center Filter in milliseconds";
      report.eventValue = time;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Notification filter load time Analytics request failed : ${error}`);
      }
    };
    const notificationSettingsLoaded = async (data = {}) => {
      const { persDim, persVal, time } = data;
      report.eventCategory = "notification.settingsview.v2";
      report.eventAction = "notificationSettingsLoaded";
      report.eventLabel = "Loading time of Settings in milliseconds";
      report.eventValue = time;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA2.log(`Notification settings load time Analytics request failed : ${error}`);
      }
    };
    return {
      notificationLoaded,
      notificationFilterLoaded,
      notificationSettingsLoaded
    };
  };
  return {
    centerActionTracker,
    settingIconActionTracker,
    notificationSettingViewTracker,
    notificationFilterViewTracker,
    notificationsLoadTimeTracker,
    multipleSelectionActionTracker
  };
}
const useFilterStore = /* @__PURE__ */ defineStore("filter", () => {
  const notifStore = useNotificationsStore();
  const applied = ref(true);
  const filterNotifId = ref([]);
  const userTenants = ref([]);
  const opened = ref(false);
  const filter2 = reactive({
    first_date: null,
    // Calendar is empty
    last_date: null,
    // Calendar is empty
    searches: [],
    read: false,
    unread: true,
    // Default unread checkbox is checked
    starred: false,
    unstarred: false,
    // TODO federation
    tenants: []
  });
  const isDefaultUnread = () => {
    const noBoxes = filter2.read === false && filter2.unread === true && // Default unread checkbox is checked
    filter2.starred === false && filter2.unstarred === false;
    const noSearches = filter2.searches.length === 0;
    filter2.tenants.length === 0;
    const noDates = filter2.first_date == null && filter2.last_date == null;
    return noBoxes && noSearches && noDates;
  };
  const getFilter = () => {
    const base = {
      ...filter2,
      oldID: notifStore.oldID,
      groupIDs: notifStore.groupIDs,
      archive: notifStore.archive,
      clusterId: notifStore.clusterId
    };
    if (isDefaultUnread()) {
      base.unread = true;
    }
    return base;
  };
  const resetFilter = () => {
    resetFilterFields();
    saveToLocalStorage();
  };
  const loadFilter = () => {
    getFilterInStorage();
  };
  const getFilterInStorage = () => {
    if (localStorage.getItem("notification-center-filter")) {
      const filterStorage = JSON.parse(localStorage.getItem("notification-center-filter"));
      applied.value = true;
      if (filterStorage.first_date) {
        filter2.first_date = new Date(filterStorage.first_date);
      } else {
        filter2.first_date = null;
      }
      if (filterStorage.last_date) {
        filter2.last_date = new Date(filterStorage.last_date);
      } else {
        filter2.last_date = null;
      }
      if (!filter2.last_date && !filter2.first_date && !filter2.read && !filter2.unread && !filter2.starred && !filter2.unstarred) {
        applied.value = false;
      } else {
        applied.value = true;
      }
      filter2.searches = filterStorage.searches;
      filter2.read = filterStorage.read;
      filter2.unread = filterStorage.unread;
      filter2.starred = filterStorage.starred;
      filter2.unstarred = filterStorage.unstarred;
      filter2.tenants = filterStorage.tenants;
    }
  };
  const needToBeSaved = () => {
    return filter2.first_date !== null || filter2.last_date !== null || filter2.searches.length || filter2.read !== false || filter2.unread !== true || filter2.starred !== false || filter2.unstarred !== false || filter2.tenants.length;
  };
  const saveToLocalStorage = async () => {
    applied.value = true;
    localStorage.removeItem("notification-center-filter");
    if (needToBeSaved()) {
      if (filter2.first_date !== null && filter2.first_date !== "") {
        filter2.first_date.setHours(0, 0, 0, 0);
      }
      if (filter2.last_date !== null && filter2.last_date !== "") {
        filter2.last_date.setHours(23, 59, 59, 999);
      }
      localStorage.setItem("notification-center-filter", JSON.stringify(filter2));
      if (!filter2.last_date && !filter2.first_date && !filter2.read && !filter2.unread && !filter2.starred && !filter2.unstarred) {
        applied.value = false;
      } else {
        applied.value = true;
      }
    }
  };
  const setOpened = (o) => {
    opened.value = o;
  };
  const resetFilterFields = () => {
    filter2.first_date = null;
    filter2.last_date = null;
    filter2.searches = [];
    filter2.read = false;
    filter2.unread = true;
    filter2.starred = false;
    filter2.unstarred = false;
    filter2.tenants = [];
    applied.value = true;
  };
  const addSearch = (search) => {
    if (search.value.trim().length) {
      if (!filter2.searches.includes(search.value.trim())) {
        if (filter2.searches.length < 6) {
          filter2.searches.push(search.value.trim());
        }
        search.value = "";
      }
    }
  };
  watch(
    isDefaultUnread,
    (defaultunread) => {
      if (defaultunread) {
        applied.value = true;
      }
    },
    { immediate: true }
  );
  return {
    applied,
    userTenants,
    filterNotifId,
    filter: filter2,
    opened,
    isFilterApplied: () => applied.value || isDefaultUnread(),
    getFilter,
    resetFilter,
    loadFilter,
    setOpened,
    saveToLocalStorage,
    resetFilterFields,
    addSearch
  };
});
const { $i18n: $i18n$4 } = useTranslations();
function usePreferencesManagement() {
  const store = useSettingsStore();
  const notifStore = useNotificationsStore();
  const now = useNow();
  let stopSettingUnsubDateWatcher = null;
  const watchSettingWithUnsubDate = (debounce = 6e4, maxWait = 6e4) => {
    watch(
      () => store.unsubscribe_dateSettingList,
      (list) => {
        if (stopSettingUnsubDateWatcher) stopSettingUnsubDateWatcher();
        if (list.length) {
          stopSettingUnsubDateWatcher = watchDebounced(
            () => now.value,
            (realTimeCurrentDate) => {
              for (let i = 0; i < list.length; i++) {
                const setting = store.getSetting(list[i]);
                if (new Date(setting.unsubscribe_date).getTime() < new Date(realTimeCurrentDate).getTime()) {
                  resetSettingUnsubDate(setting.id);
                }
              }
            },
            { debounce, maxWait }
          );
        }
      },
      { immediate: true, deep: true }
    );
  };
  const resetSettingUnsubDate = (id2) => {
    resetSettingUnsubscriptionDate$1({ id: id2 });
    store.removeUnsubscribe_dateSetting(id2);
  };
  const loadSettings = () => {
    if (!store.settings.size) {
      store.setSettingLoadingState("settings", true);
      getSettings();
    } else {
      store.setSettingLoadState("settings", true);
      store.setSettingLoadingState("settings", false);
    }
  };
  const alertNotice = (title, msg) => {
    ze.show({
      title,
      message: msg,
      noMobile: true
    });
  };
  const messageNotice = (msg, timeout) => {
    try {
      if (notifStore.dispose) {
        if (!notifStore.dispose.bind._dispose) {
          notifStore.dispose.bind.show = false;
        }
        notifStore.dispose.dispose();
      }
    } catch (error) {
      console.log("error trying trying to hide the message", error);
    }
    if (typeof timeout === "number" && typeof msg === "string") {
      notifStore.dispose = Ge.create({ text: msg, timeout });
    } else {
      console.log("Wrong parameters for message");
    }
  };
  const alertConfirmNotice = ({ title, msg, okLabel, cancelLabel }, callback) => {
    ze.confirm({
      title,
      message: msg,
      ...!!okLabel && { okLabel },
      ...!!cancelLabel && { cancelLabel },
      noMobile: true,
      keyboard: false
    }).then(
      () => {
        callback(true);
      },
      () => {
        callback(false);
      }
    );
  };
  const alertPromptNotice = ({ title, msg, okLabel, cancelLabel, placeholder, required }) => {
    return new Promise((resolve2, reject) => {
      ze.prompt({
        title,
        rawContent: msg,
        // for html tags
        okLabel,
        ...!!cancelLabel && { cancelLabel },
        placeholder,
        required,
        keyboard: false,
        noMobile: true
      }).then((onConfirmVal) => {
        resolve2(onConfirmVal);
      }).catch((onCloseVal) => {
        reject(onCloseVal);
      });
    });
  };
  const requestNotificationPermission = () => {
    let granted = false;
    return new Promise((resolve2, reject) => {
      if (!("Notification" in window)) {
        granted = false;
        alertNotice($i18n$4("browserSupport"), $i18n$4("browserNotSupported"));
        resolve2(granted);
      } else if (Notification.permission === "granted") {
        granted = true;
        resolve2(granted);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            granted = true;
          } else {
            granted = false;
            alertNotice($i18n$4("notificationPermission"), $i18n$4("deniedPermission"));
          }
          resolve2(granted);
        });
      } else {
        alertNotice(
          $i18n$4("notificationPopupActivationTitle"),
          $i18n$4("notificationPopupActivationMsgPopupForBlock")
        );
        resolve2(granted);
      }
    });
  };
  const settingUpdate = (setting, attribut) => {
    if (setting && Object.hasOwn(setting, attribut)) {
      const needConfirm = setting[attribut] === 0;
      const needBrowserPermission = attribut === "notif_by_browser" && setting[attribut] === 1;
      if (needBrowserPermission) {
        requestNotificationPermission().then((granted) => {
          if (granted) {
            updateSettings(setting);
          }
        });
      } else if (needConfirm) {
        const message = attribut === "notif_by_browser" ? $i18n$4("browserNotifDeactivateMsgForPopup") : attribut === "notif_by_email" ? $i18n$4("mailNotifDeactivateMsgForPopup") : $i18n$4("alertNotifDeactivateMsgForPopup");
        alertConfirmNotice(
          {
            title: $i18n$4("notificationPopupDeactivationTitle"),
            msg: message,
            okLabel: $i18n$4("confirmButtonLabel"),
            cancelLabel: $i18n$4("cancel")
          },
          (prompt) => {
            if (prompt) {
              updateSettings(setting);
            }
          }
        );
      } else {
        updateSettings(setting);
      }
    }
  };
  return {
    loadSettings,
    settingUpdate,
    alertConfirmNotice,
    messageNotice,
    alertNotice,
    alertPromptNotice,
    resetSettingUnsubDate,
    watchSettingWithUnsubDate
  };
}
const mobileDevice = window.ds && window.ds.env == "MOBILE" || window.top && window.top.ds && window.top.ds.env == "MOBILE";
const { $i18n: $i18n$3 } = useTranslations();
const apps = [];
const myWindowParent = ((_b = window.dsDashboardWindow) == null ? void 0 : _b.parent) || window.parent;
const myWindowTop = ((_c2 = window.dsDashboardWindow) == null ? void 0 : _c2.top) || window.top;
const myTop = ((_d2 = window.dsDashboardWindow) == null ? void 0 : _d2.top) || top;
async function isWebInWinContext() {
  const CompassData = await getCompassData();
  const addinmode = CompassData && CompassData.addinMode && CompassData.addinMode.value || (typeof window.widget !== "undefined" && typeof window.widget.getValue === "function" ? window.widget.getValue("addinmode") : window.addinmode) || "";
  return addinmode === "solidworks" || addinmode === "catiav5" || myWindowParent.document.location.search.includes("addinmode=solidworks") || myWindowParent.document.location.search.includes("addinmode=catiav5");
}
function useNotificationActions() {
  const { UWA: UWA2 } = useUWA();
  const openIconUrl = async (icon) => {
    let imgUrl = icon && decodeURIComponent(icon);
    let loginExists = imgUrl.includes("login/");
    let loginId, baseSwymUrl, baseUrl;
    if (loginExists) {
      try {
        loginId = imgUrl.split("login/")[1].split("/")[0];
      } catch (e) {
        console.error(e);
      }
    }
    if (!loginId) return;
    let login;
    let tenant;
    let matches = window.location.href.match(/https:\/\/([A-z0-9]+)-([A-z0-9]+)-[A-z0-9]+(-|.)/);
    if (matches && matches.length == 4 && (matches[3] == "-" || matches[1] && matches[1].length > 4)) {
      tenant = matches[1];
      tenant = tenant.toUpperCase();
    }
    if (myWindowParent.ds.env === "3DSwym") {
      let notifAvatarSrc = decodeURIComponent(icon);
      let notifIconLogin = notifAvatarSrc.includes("login");
      if (notifIconLogin) {
        login = notifAvatarSrc.split("login/")[1].split("/")[0];
      }
      const i3DXCompassPlatformServices = await getI3DXCompassPlatformServices();
      i3DXCompassPlatformServices.getServiceUrl({
        serviceName: "3DSwym",
        platformId: tenant,
        onComplete: function(dataUrl) {
          if (typeof dataUrl === "object") {
            baseSwymUrl = dataUrl[0].url;
          } else if (typeof dataUrl === "string") {
            baseSwymUrl = dataUrl;
          }
          baseUrl = baseSwymUrl + "/#people:" + login + "/activities";
          myWindowParent.location.href = baseUrl;
        }
      });
    } else {
      let appKey = "X3DPRFL_AP";
      let appTitle = "My Profile";
      let appData = {
        login: loginId,
        url: baseUrl,
        x3dPlatformId: tenant
      };
      const TransientWidget = await getTransientWidget();
      let Transient = window !== myTop && myTop.require ? myWindowTop.require("DS/TransientWidget/TransientWidget") : TransientWidget;
      Transient.showWidget(appKey, appTitle, appData);
    }
  };
  const getLocation = (href) => {
    if (!href) return;
    let match = href.match(/^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7]
    };
  };
  const getServiceForNotification = (urlInfos) => {
    if (!urlInfos) return;
    let regExpMatch;
    if (urlInfos && urlInfos.search) {
      regExpMatch = urlInfos.search.match(/.*&serviceForNotification=([^&]*)/);
    }
    if (regExpMatch && regExpMatch[1]) {
      return regExpMatch[1].toLowerCase();
    }
  };
  const isSameService = async (url1, url2) => {
    return UWA2.Utils.matchUrl(url1, url2);
  };
  const openNotification = async (url2, notifOptions, _openInNewTab = false) => {
    const PlatformAPI = await getPlatformAPI();
    if (!url2)
      return console.error("[NotificationCenter openNotification] No url to navigate.");
    if (_openInNewTab || !notifOptions.platformId) {
      return openInNewTab2(url2);
    }
    let currentPlatformId = notifOptions.currentTenant || PlatformAPI.getTenant();
    if (!currentPlatformId) {
      const getTenant = (href) => {
        const match = href.match(/^([A-z0-9]+)([-]|[.])(.*)$/);
        return match && {
          platformId: match[1]
        };
      };
      const hostInfos = getTenant(myWindowParent.location.host);
      if (hostInfos && hostInfos.platformId) currentPlatformId = hostInfos.platformId;
      else {
        console.warn("[NotificationCenter openNotification] Unknown current tenant.");
        return openInNewTab2(url2);
      }
    }
    let urlInfos = getLocation(url2);
    if (notifOptions.platformId.toLowerCase() === (currentPlatformId == null ? void 0 : currentPlatformId.toLowerCase())) {
      const currentApp2 = notifOptions.appName && notifOptions.appName.toLowerCase();
      const serviceForNotification = getServiceForNotification(urlInfos);
      const sameService = await isSameService(url2, myWindowParent.location);
      if (sameService || serviceForNotification === currentApp2) {
        let isDashboard = currentApp2 === "3ddashboard" || urlInfos.host && urlInfos.host.contains("ifwe") && !urlInfos.host.contains("ifweloop");
        const TransientWidget = await getTransientWidget();
        const Transient = window !== myTop && myTop.require ? myWindowTop.require("DS/TransientWidget/TransientWidget") : TransientWidget;
        let hasTransientApp = Transient.isWidgetOpen();
        let isTransientOpenable = urlInfos && urlInfos.hash && urlInfos.hash.contains("app") || serviceForNotification === currentApp2;
        if (!isDashboard || isDashboard && !hasTransientApp && isTransientOpenable) {
          return openInSameTab(url2, notifOptions, myWindowParent.location.hash);
        }
      } else {
        let isNotifFromSwym = notifOptions.provider == "USASWYM_AP";
        let isMy3DExperience = currentApp2 === "my3dexperience" || urlInfos.host && urlInfos.host.contains("my3dexperience");
        let isNativeApp = mobileDevice || ["localhost", "127.0.0.1", "", "::1"].includes(window.location.hostname);
        if (isNotifFromSwym && (isMy3DExperience || isNativeApp)) {
          return openInSameTab(url2, notifOptions, myWindowParent.location.hash);
        }
      }
    }
    if (notifOptions.provider === "X3DOPMR_AP" && notifOptions.platformId) {
      url2 = url2 + "/content:x3dPlatformId=" + notifOptions.platformId.trim();
    }
    return openInNewTab2(url2);
  };
  const openInSameTab = async (url2, notifOptions, hash) => {
    const PlatformAPI = await getPlatformAPI();
    const urlInfos = getLocation(url2);
    if (urlInfos.hash === hash) {
      if (url2.contains("ifweloop") || url2.contains("innovate") || url2.contains("engineering")) {
        myWindowParent.document.location.href = url2;
      } else {
        PlatformAPI.publish("common.3DNotification.topic", {
          action: "refresh",
          data: {
            url: url2
          }
        });
      }
    } else {
      let platformId = notifOptions.platformId;
      if (notifOptions.provider === "X3DOPMR_AP" && platformId) {
        if (myWindowParent.document.location.hash.contains("app:X3DOPMR_AP")) {
          let urlPlatform = UWA2.Utils.getQueryString(myWindowParent.document.location.hash, "content:x3dPlatformId");
          if (urlPlatform)
            myWindowParent.document.location.hash = myWindowParent.document.location.hash.replace(
              urlPlatform,
              platformId.trim()
            );
          else
            myWindowParent.document.location.hash = myWindowParent.document.location.hash + "/content:x3dPlatformId=" + platformId.trim();
        } else {
          myWindowParent.document.location.hash = urlInfos.hash + "/content:x3dPlatformId=" + platformId.trim();
        }
      } else {
        if (notifOptions.provider == "USASWYM_AP") {
          PlatformAPI.publish("common.3DNotification.topic", {
            action: "refresh",
            data: {
              url: url2
            }
          });
        } else {
          if (urlInfos.hash && urlInfos.hash !== "") myWindowParent.document.location.hash = urlInfos.hash;
          else if (urlInfos.search && urlInfos.search !== "")
            myWindowParent.document.location.hash = `app:${notifOptions.provider}/content:${urlInfos.search}`;
          else myWindowParent.document.location.hash = urlInfos.hash;
        }
      }
    }
  };
  const openInNewTab2 = (url2) => {
    if (!url2) return;
    return window.open(url2, "_blank");
  };
  const updateActionedLabel = async (notification, label, flag) => {
    if (notification.isGroup) {
      label = $i18n$3("groupActionLabel");
    } else if (label && label.toString().indexOf("NLS") != -1) {
      if (label === "NLS.actionLabel") {
        label = $i18n$3("actionLabel");
      } else label = $i18n$3("actionFailed");
    } else if (flag && parseInt(notification.SHARED) === 1) {
      const PlatformAPI = await getPlatformAPI();
      let actor = " (by " + PlatformAPI.getUser().login + ")";
      if (label) label = label + actor;
    } else {
      if (notification.ACTOR_DATA) label = label + " (by " + notification.ACTOR_DATA + ")";
    }
    notification.ACTION = label || $i18n$3("actionLabel");
  };
  const checkAction = (action) => {
    if (action.options && action.options.event && action.options.event.type) return true;
    if (action.type) return true;
    else return false;
  };
  const csrf = async (notification, options, action_label) => {
    const WAFData = await getWAFData();
    if (options && options.csrf) {
      WAFData.authenticatedRequest(options.csrf, {
        method: "GET",
        data: options.params,
        onComplete: function(evt) {
          UWA2.log("Notification csrf Action Completed !");
          let rep;
          try {
            rep = JSON.parse(evt);
          } catch (e) {
            UWA2.log("Notification Csrf Action Error for json parse" + e);
            updateActionedLabel(notification, $i18n$3("actionFailed"), false);
          }
          if (rep) {
            options.headers = { "X-DS-SWYM-CSRFTOKEN": rep.result.ServerToken };
            post(notification, options, action_label);
          }
        }
      });
    } else {
      UWA2.log("Notification Csrf Action Failed some parameters are missing !");
    }
  };
  const post = async (notification, options, action_label) => {
    const WAFData = await getWAFData();
    if (!options || !options.url) {
      return UWA2.log("Notification Post Failed some parameters are missing !");
    }
    WAFData.authenticatedRequest(options.url, {
      method: "POST",
      data: options.params,
      headers: options.headers,
      onComplete: function(res) {
        UWA2.log("Notification Post Action Completed !");
        let temp;
        if (res) {
          try {
            temp = JSON.parse(res);
          } catch (e) {
            UWA2.log("Notification post Action Error for json parse" + e);
            updateActionedLabel(notification, $i18n$3("actionFailed"), false);
          }
        }
        action_label = temp && temp.result && temp.result.success ? action_label || "NLS.actionLabel" : "NLS.actionFailed";
        updateActionedLabel(notification, action_label, false);
        if (!notification.isRead) {
          if (notification.isGroup) {
            notificationRead({
              action: "notificationRead",
              id: notification.ID,
              groupID: notification.GROUPID,
              hiddenMerged: true,
              read: true,
              clusterId: notification.CLUSTER_ID
            });
          } else {
            notificationRead({
              action: "notificationRead",
              id: notification.ID,
              read: true,
              clusterId: notification.CLUSTER_ID
            });
          }
        }
        notificationRead({
          action: "actioned",
          clusterId: notification.CLUSTER_ID,
          params: { isMerge: notification.isMerge, id: notification.ID, actioned: true }
        });
        notificationRead({
          action: "notificationRead",
          updateLabel: "updateLabel",
          clusterId: notification.CLUSTER_ID,
          params: {
            isMerge: notification.isMerge,
            flag: false,
            id: notification.ID,
            label: temp && temp.result && temp.result.success ? "NLS.actionLabel" : "NLS.actionFailed"
          }
        });
      },
      onFailure: function(evt) {
        UWA2.log("Notification Post Action Failed !");
        updateActionedLabel(notification, $i18n$3("actionFailed"), false);
      }
    });
  };
  const getAppInfo = async (appId, platformId) => {
    var _a3, _b2;
    if (!appId || !platformId) return;
    let appInfo = (_a3 = apps[appId]) == null ? void 0 : _a3.platforms[platformId];
    if (appInfo) return appInfo;
    else {
      const i3DXCompassPlatformServices = await getI3DXCompassPlatformServices();
      await new Promise(
        (resolve2, reject) => i3DXCompassPlatformServices.getAppInfo({
          appId,
          onComplete: function(app) {
            UWA2.log(app);
            if (!app) return;
            apps[appId] = {};
            apps[appId].platforms = [];
            if (!app.platforms) return;
            if (app.platforms.length === 0 && app.platformId) {
              apps[appId].platforms[app.platformId] = {
                serviceId: app.serviceId,
                url: app.launchUrl
              };
            } else {
              for (const platform of app.platforms) {
                apps[appId].platforms[platform.id] = {
                  serviceId: app.serviceId,
                  url: platform.launchUrl
                };
              }
            }
            resolve2();
          },
          onError: function(error) {
            reject(error);
          }
        })
      );
    }
    return (_b2 = apps[appId]) == null ? void 0 : _b2.platforms[platformId];
  };
  const activateGetAction = async (notification, eventOptions, _openInNewTab = false, notifOptions) => {
    if (!eventOptions || !eventOptions.url && !eventOptions.uri) return;
    let url2 = eventOptions.url;
    try {
      const addinmode = await isWebInWinContext();
      if (addinmode && !_openInNewTab) {
        let hash = eventOptions.uri.charAt(0) === "/" ? eventOptions.uri.slice(1) : eventOptions.uri;
        if (!hash && url2) {
          const urlInfos2 = getLocation(url2);
          if (urlInfos2.hash && urlInfos2.hash !== "") hash = urlInfos2.hash;
          else if (urlInfos2.search && urlInfos2.search !== "")
            hash = `app:${notification.APPID}/content:${urlInfos2.search}`;
        }
        if (hash && hash !== "") return myWindowParent.document.location.hash = hash;
      }
    } catch (error) {
      console.error(`[NotificationCenter activateGetAction] Failed to get addinmode value: ${error}`);
    }
    const urlInfos = getLocation(url2);
    const isNotifFromSwym = notification.APPID === "USASWYM_AP";
    const isNativeApp = mobileDevice || ["localhost", "127.0.0.1", "", "::1"].includes(window.location.hostname);
    if (isNativeApp) {
      if (isNotifFromSwym && !_openInNewTab) {
        let uri = eventOptions.uri ?? (urlInfos && urlInfos.hash);
        if (uri) {
          url2 = window.location.origin + "/" + uri;
          openNotification(url2, notifOptions, _openInNewTab);
        }
      }
      _openInNewTab = true;
    }
    if (isNotifFromSwym) {
      if (!urlInfos || !urlInfos.host || !urlInfos.host.includes("3dswym") && !urlInfos.host.includes("my3dexperience")) {
        const platformId = notification.PLATFORMID;
        if (!platformId)
          return console.error("[NotificationCenter activateGetAction] Navigation aborted - Missing tenant and url in notification.");
        const appInfo = await getAppInfo(notification.APPID, platformId);
        if (appInfo && appInfo.url) {
          url2 = appInfo.url + eventOptions.uri;
        } else {
          const i3DXCompassPlatformServices = await getI3DXCompassPlatformServices();
          await new Promise((resolve2) => i3DXCompassPlatformServices.getServiceUrl({
            serviceName: "3DSwym",
            platformId,
            onComplete: function(dataUrl) {
              if (typeof dataUrl === "object") url2 = dataUrl[0].url + eventOptions.uri;
              else if (typeof dataUrl === "string") url2 = dataUrl + eventOptions.uri;
              resolve2();
            }
          })).catch((reason) => console.warn(`[NotificationCenter activateGetAction] Failed to get 3DSwym url: ${reason}`));
        }
      }
      if (!url2)
        return console.error("[NotificationCenter activateGetAction] Navigation aborted - Empty url.");
      openNotification(url2, notifOptions, _openInNewTab);
    } else {
      if (!url2) {
        const platformId = notification.PLATFORMID;
        if (!platformId)
          return console.error("[NotificationCenter activateGetAction] Navigation aborted - Missing tenant and url in notification.");
        const appInfo = await getAppInfo(notification.APPID, platformId);
        if (!appInfo || !appInfo.url)
          return console.error("[NotificationCenter activateGetAction] Navigation aborted - Failed to build url.");
        url2 = appInfo.url + eventOptions.uri;
      }
      if (!url2)
        return console.error("[NotificationCenter activateGetAction] Navigation aborted - Empty url.");
      openNotification(url2, notifOptions, _openInNewTab);
    }
    if (!notification.isRead) {
      if (notification.isGroup) {
        notificationRead({
          action: "notificationRead",
          id: notification.ID,
          groupID: notification.GROUPID,
          hiddenMerged: true,
          read: true,
          clusterId: notification.CLUSTER_ID
        });
      } else {
        notificationRead({
          action: "notificationRead",
          id: notification.ID,
          read: true,
          clusterId: notification.CLUSTER_ID
        });
      }
      notificationRead({
        action: "actioned",
        clusterId: notification.CLUSTER_ID,
        params: { id: notification.ID, actioned: true, isMerge: notification.isMerge }
      });
    }
  };
  const activatePostAction = (notification, eventOptions, action_label) => {
    if (!eventOptions || !eventOptions.url) return;
    if (eventOptions.csrf) {
      csrf(
        notification,
        {
          csrf: eventOptions.csrf,
          url: eventOptions.url,
          params: eventOptions.options && eventOptions.options.data ? eventOptions.options.data : void 0,
          headers: eventOptions.options && eventOptions.options.headers ? eventOptions.options.headers : void 0
        },
        action_label
      );
    } else {
      post(
        notification,
        {
          url: eventOptions.url,
          params: eventOptions.options && eventOptions.options.data ? eventOptions.options.data : void 0,
          headers: eventOptions.options && eventOptions.options.headers ? eventOptions.options.headers : void 0
        },
        action_label
      );
    }
  };
  const checkUrlAction = (options) => {
    if (options.event.options && options.event.options.type) return true;
    else return false;
  };
  const activateLinkAction = (notification, notifOptions, _openInNewTab) => {
    if (!checkUrlAction(notifOptions.options)) return;
    let eventOptions = notifOptions.options.event.options;
    let action_label = notifOptions.options.actioned_label;
    eventOptions.appID = notifOptions.provider;
    if (eventOptions.type === "GET") {
      activateGetAction(notification, eventOptions, _openInNewTab, notifOptions);
    } else if (eventOptions.type === "POST") {
      activatePostAction(notification, eventOptions, action_label);
    }
  };
  const linkClickAction = (notification, notifOptions, _openInNewTab) => {
    activateLinkAction(notification, notifOptions, _openInNewTab);
  };
  const callEvent = (notification, options) => {
    options.action["isActioned"] = notification.isActioned;
    if (checkAction(options.action) || options.subAction) {
      if (options.type === "UI" || options.type === "url") {
        url(notification, options.action);
      } else {
        bus(notification, options.action);
      }
    }
  };
  const url = (notification, notifOptions) => {
    if (notifOptions.type === "POST") {
      activatePostAction(notification, notifOptions, notifOptions.actioned_label);
    } else {
      if (!notifOptions || !notifOptions.type || !notifOptions.options) return;
      if (notifOptions.type === "link") {
        let _openInNewTab = false;
        if (notifOptions.appName)
          _openInNewTab = !(notifOptions.appName == "3ddashboard" || notifOptions.appName == "3dswym" || notifOptions.appName == "my3dexperience" || notifOptions.appName == "ifweloop");
        linkClickAction(notification, notifOptions, _openInNewTab);
        return;
      }
      if (notifOptions.type === "button") {
        if (notifOptions.isActioned) return;
        if (notifOptions.options.event.type === "UI" && notifOptions.options.event.options) {
          let options = notifOptions.options.event.options;
          options.attachments.forEach(function(attachment) {
            if (attachment.type === "button") {
              if (attachment.options && attachment.options.event && attachment.options.event.options) {
                attachment.options.event.options.options = {};
                const denyReasons = { value: notifOptions.reason.reason, reference: notifOptions.reason.reference };
                attachment.options.event.options.options.data = [denyReasons];
                !attachment ? activateLinkAction(notification, notifOptions) : activateLinkAction(notification, attachment);
              }
            }
          });
        } else {
          activateLinkAction(notification, notifOptions);
        }
      }
    }
  };
  const getEventOptions = (option) => {
    if (option && option.event && option.event.options) {
      let options = option.event.options;
      if (options.topic && options.data) {
        return {
          topic: options.topic,
          data: options.data
        };
      } else {
        UWA2.log("3DNotification Error eventOptions missing topic or data");
      }
    } else {
      UWA2.log("3DNotification Error eventOptions");
    }
  };
  const bus = (notification, notifOptions) => {
    if (!notifOptions || !notifOptions.type || !notifOptions.options) return;
    let eventOptions = getEventOptions(notifOptions.options);
    if (!eventOptions) return;
    if (notifOptions.type === "link") {
      publish({ topic: eventOptions.topic, data: eventOptions.data });
      if (!notification.isRead) {
        if (notification.isGroup) {
          notificationRead({
            action: "notificationRead",
            id: notification.ID,
            groupID: notification.GROUPID,
            hiddenMerged: true,
            read: true,
            clusterId: notification.CLUSTER_ID
          });
        } else {
          notificationRead({
            action: "notificationRead",
            id: notification.ID,
            read: true,
            clusterId: notification.CLUSTER_ID
          });
        }
      }
    } else if (notifOptions.type === "button") {
      if (eventOptions.data && eventOptions.data.action == "rollback") {
        eventOptions.data.id = notification.ID;
      }
      if (!notification.isActioned) {
        publish({ topic: eventOptions.topic, data: eventOptions.data });
        if (!notification.isRead) {
          if (notification.isGroup) {
            notificationRead({
              action: "notificationRead",
              id: notification.ID,
              groupID: notification.GROUPID,
              hiddenMerged: true,
              read: true,
              clusterId: notification.CLUSTER_ID
            });
          } else {
            notificationRead({
              action: "notificationRead",
              id: notification.ID,
              read: true,
              clusterId: notification.CLUSTER_ID
            });
          }
        }
        notificationRead({
          action: "actioned",
          clusterId: notification.CLUSTER_ID,
          params: { id: notification.ID, actioned: true, isMerge: notification.isMerge }
        });
      }
    }
  };
  const noticationMessageIsLink = (actions) => {
    if (!actions) return false;
    const link = actions.find((action) => action.type === "link");
    return link ? { option: link, isLink: true } : { isLink: false };
  };
  const executeActionSelect = (notification, i) => {
    const { getGroup, getMergeById } = useNotificationsStore();
    const mergesIds = getGroup(notification.GROUPID);
    mergesIds.forEach((m) => {
      const merge = getMergeById(m.id);
      const findAction = merge.MESSAGE.actions[0];
      const action = {
        type: findAction.options.event.type,
        subAction: true,
        action: Array.isArray(findAction.options.event.options) ? findAction.options.event.options[i] : findAction.options.event.options
      };
      if (!merge.isActioned) callEvent(merge, action);
      if (!merge.isRead) {
        notificationRead({
          action: "notificationRead",
          id: merge.ID,
          read: true,
          clusterId: notification.CLUSTER_ID
        });
      }
    });
    updateActionedLabel(notification, "do not matter", false);
    notification.actionNotification();
  };
  const executeDeny = (notification, reason) => {
    const { getGroup, getMergeById } = useNotificationsStore();
    const mergesIds = getGroup(notification.GROUPID);
    mergesIds.forEach((item) => {
      const merge = getMergeById(item.id);
      const findAction = merge.MESSAGE.actions[1];
      const action = {
        type: findAction.options.event.type,
        action: findAction
      };
      action.action["reason"] = reason;
      callEvent(merge, action);
      if (!merge.isRead) {
        notificationRead({
          action: "notificationRead",
          id: merge.ID,
          read: true,
          clusterId: notification.CLUSTER_ID
        });
      }
    });
  };
  const getOpenWithMenu = (notification, openWith2) => {
    let apps2 = [];
    return new Promise(function(resolve2, reject) {
      openWith2.retrieveCompatibleApps(function(appsList) {
        if (!appsList || appsList.length == 0) reject("No compatible apps found");
        else {
          appsList.forEach(function(app) {
            apps2.push({
              text: app.text,
              icon: app.icon,
              fonticon: app.fonticon,
              className: app.className,
              name: "openWithApp-" + app.text,
              handler: function() {
                if (!notification.isRead) {
                  if (notification.isGroup) {
                    notificationRead({
                      action: "notificationRead",
                      id: notification.ID,
                      groupID: notification.GROUPID,
                      hiddenMerged: true,
                      read: true,
                      clusterId: notification.CLUSTER_ID
                    });
                  } else {
                    notificationRead({
                      action: "notificationRead",
                      id: notification.ID,
                      read: true,
                      clusterId: notification.CLUSTER_ID
                    });
                  }
                }
                app.handler();
                const { centerActionTracker } = NotificationTrackerUsage();
                centerActionTracker().openNotifWith({
                  persDim: {
                    pd1: `${app.text}`
                  }
                });
              }
            });
          });
          resolve2(apps2);
        }
      });
    });
  };
  const getCsrfUrl = (options) => {
    const { getListOfService } = useSettingsStore();
    const csrf2 = "/api/index/tk/";
    return getListOfService()[0]["3dswym"] + csrf2;
  };
  const getOpenWithActions = async (notification, options) => {
    try {
      const OpenWith = await getOpenWith();
      let encodedUri = options[0].options.event.options.uri;
      if (encodedUri) {
        let decodedUri = decodeURIComponent(encodedUri).replace(/\+/g, " ");
        let x3dcontentUri = decodedUri.match(/X3DContentId=.*.}/);
        if (x3dcontentUri && x3dcontentUri[0] && x3dcontentUri[0].split("=") && x3dcontentUri[0].split("=")[1]) {
          let content = JSON.parse(x3dcontentUri[0].split("=")[1]);
          UWA2.log("Content:  " + content);
          let openwith = new OpenWith();
          openwith.set3DXContent(content);
          const items = await getOpenWithMenu(notification, openwith);
          const data = {
            text: $i18n$3("openWith"),
            fonticon: "fonticon fonticon-open-menu-dot ",
            items
          };
          return data;
        }
      }
      return null;
    } catch (err) {
      UWA2.log("Warning: Content not received in the uri");
      return null;
    }
  };
  const denyAction = async (notification, options, reasonValues, denyDisabled, actionAfterFetch) => {
    const { alertPromptNotice } = usePreferencesManagement();
    if (options.type !== "url") {
      let reason = "";
      let message = options.action.options.event.options.attachments[0].text;
      const placeholder = options.action.options.event.options.attachments[1].placeholder;
      const okLabel = options.action.options.event.options.attachments[2].options.label;
      const title = options.action.options.event.options.title;
      const reference = options.action.options.event.options.attachments[1].reference;
      if (notification.isGroup) {
        if (message.includes("##MERGE_COUNT##")) message = message.replace("##MERGE_COUNT##", notification.COUNT);
        else {
          const data = options.action.options.event.options.attachments[0].data;
          if (message.indexOf(data.COMMUNITY_TITLE) < message.length - 1) {
            const substr = message.substr(0, message.indexOf(data.COMMUNITY_TITLE) + data.COMMUNITY_TITLE.length);
            message = substr + `, ${notification.COUNT} ${$i18n$3("persons")}`;
          }
        }
      }
      try {
        const onConfirmVal = await alertPromptNotice({
          title,
          msg: message,
          okLabel,
          placeholder,
          required: false
        });
        reason = onConfirmVal;
        reasonValues.value = {
          reason,
          reference
        };
      } catch (onCloseVal) {
        denyDisabled.value = false;
        reason = onCloseVal;
        return;
      }
    }
    denyDisabled.value = true;
    if (notification.isGroup) {
      const { getNotificationById } = useNotificationsStore();
      const { getFilter } = useFilterStore();
      const group = getNotificationById(notification.ID);
      if (!group.mergesFetched) {
        getMerge({
          parentNotif: {
            id: notification.ID,
            groupID: notification.GROUPID,
            clusterId: notification.CLUSTERID,
            archive: notification.ARCHIVE,
            ignoreSearchesForChildren: !!notification.ignoreSearchesForChildren
          },
          filterData: getFilter()
        });
        actionAfterFetch.value = true;
      } else {
        executeDeny(notification, reasonValues);
      }
    } else {
      options.action["reason"] = reasonValues.value;
      callEvent(notification, options);
    }
  };
  const acceptAction = (notification, { options, i }, selectDisabled, actionAfterFetch, iAfterFetch) => {
    selectDisabled.value = true;
    if (notification.isGroup) {
      const { getNotificationById } = useNotificationsStore();
      const { getFilter } = useFilterStore();
      const group = getNotificationById(notification.ID);
      if (!group.mergesFetched) {
        getMerge({
          parentNotif: {
            id: notification.ID,
            groupID: notification.GROUPID,
            clusterId: notification.CLUSTERID,
            archive: notification.ARCHIVE,
            ignoreSearchesForChildren: !!notification.ignoreSearchesForChildren
          },
          filterData: getFilter()
        });
        actionAfterFetch.value = true;
        iAfterFetch.value = i;
      } else {
        executeActionSelect(notification, i);
      }
    } else callEvent(notification, options);
  };
  const NavigateToLink = (notification, action) => {
    const notifOptions = {
      platformId: notification.PLATFORMID,
      currentTenant: notification.currentTenant,
      appName: notification.appName,
      provider: notification.APPID,
      options: action.value.options
    };
    linkClickAction(notification, notifOptions, false);
  };
  return {
    openIconUrl,
    openInNewTab: openInNewTab2,
    openInSameTab,
    openNotification,
    updateActionedLabel,
    activatePostAction,
    callEvent,
    linkClickAction,
    activateLinkAction,
    activateGetAction,
    checkAction,
    checkUrlAction,
    noticationMessageIsLink,
    executeActionSelect,
    executeDeny,
    getOpenWithMenu,
    getOpenWithActions,
    denyAction,
    acceptAction,
    NavigateToLink,
    getCsrfUrl
  };
}
function useNotificationCleaning() {
  const cleanNotificationData = (data) => {
    try {
      const hasCount = Object.hasOwn(data, "COUNT");
      data.TYPE = decodeURIComponent(escape(atob(data.TYPE)));
      data.MESSAGE = decodeURIComponent(escape(atob(data.MESSAGE)));
      if (hasCount) {
        data.MESSAGE = data.MESSAGE.replace("##MERGE_COUNT##", data.COUNT);
      }
      data.MESSAGE = JSON.parse(data.MESSAGE);
      if (hasCount) {
        data.MESSAGE.nls.msg = data.MESSAGE.nls.msg.replace(`(${data.COUNT})`, "");
      }
    } catch (error) {
      console.warn("No panic, it just means that the cleaning may have already been done.");
    }
  };
  return {
    cleanNotificationData
  };
}
const { $i18n: $i18n$2 } = useTranslations();
function useNotificationMenu() {
  const setNotificationRead = (notification) => {
    const data = {
      action: "notificationRead",
      id: notification.ID,
      archive: !!notification.FROM_ARCHIVE,
      read: !notification.isRead,
      clusterId: notification.CLUSTER_ID
    };
    if (notification.isGroup) {
      data["groupID"] = notification.GROUPID;
      data["hiddenMerged"] = true;
    }
    notificationRead(data);
  };
  const setNotificationMenu = async (notification) => {
    const { centerActionTracker, notificationSettingViewTracker } = NotificationTrackerUsage();
    const theCenterActionTracker = centerActionTracker(), settingsViewTracker = notificationSettingViewTracker();
    const { tryNotificationDeletion } = useNotificationManagement();
    const { noticationMessageIsLink, getOpenWithActions } = useNotificationActions();
    const settingStore = useSettingsStore();
    const isLink = noticationMessageIsLink(notification.MESSAGE.actions).isLink;
    let openApps = null;
    openApps = await getOpenWithActions(notification, notification.MESSAGE.actions);
    const menuOptions = [
      ...isLink ? [
        {
          fonticon: "fonticon fonticon-window",
          name: "newTab",
          text: $i18n$2("openInNewTab"),
          handler: (item) => {
            const { noticationMessageIsLink: noticationMessageIsLink2, linkClickAction } = useNotificationActions();
            const { option } = noticationMessageIsLink2(notification.MESSAGE.actions);
            const notifOptions = {
              platformId: notification.PLATFORMID,
              currentTenant: notification.currentTenant,
              appName: notification.appName,
              provider: notification.APPID,
              options: option.options,
              _appID: []
            };
            linkClickAction(notification, notifOptions, true);
            theCenterActionTracker.openNotifInNewTab();
          }
        }
      ] : [],
      ...openApps !== null ? [openApps] : [],
      ...isLink || openApps !== null ? [
        {
          class: "divider"
        }
      ] : [],
      {
        fonticon: notification.isRead ? "fonticon fonticon-bell" : "fonticon fonticon-bell-alt",
        name: "read",
        text: notification.isGroup ? notification.isRead ? $i18n$2("markGroupAsUnRead") : $i18n$2("markGroupAsRead") : notification.isRead ? $i18n$2("markAsUnread") : $i18n$2("markAsRead"),
        handler: (item) => {
          setNotificationRead(notification);
          theCenterActionTracker.notificationRead({ read: !notification.isRead });
        }
      },
      ...!notification.isMerge ? [
        {
          fonticon: "fonticon fonticon-star",
          name: "important",
          text: notification.isGroup ? notification.isStarred ? $i18n$2("removeGroupImportant") : $i18n$2("markGroupAsImportant") : notification.isStarred ? $i18n$2("removeImportant") : $i18n$2("markAsImportant"),
          handler: (item) => {
            const data = {
              action: "notificationRead",
              id: notification.ID,
              archive: !!notification.FROM_ARCHIVE,
              starred: "starred",
              param: notification.isStarred ? 0 : 1,
              clusterId: notification.CLUSTER_ID
            };
            if (notification.isGroup) {
              data["groupID"] = notification.GROUPID;
              data["hiddenMerged"] = true;
            }
            notificationRead(data);
            theCenterActionTracker.notificationStar({ starred: data.param });
          }
        }
      ] : [],
      {
        class: "divider"
      },
      {
        fonticon: "fonticon fonticon-list-delete",
        name: "unsubscribe",
        text: $i18n$2("unsubscribe"),
        items: [
          {
            fonticon: "fonticon fonticon-list-delete",
            text: $i18n$2("unsubscribeForHour"),
            name: "anHour",
            handler: (item) => {
              unsubscribe({
                id: notification.ID,
                subscribe: 0,
                forHour: true
              });
              const setting = settingStore.getSetting(notification.SERVICE_ID);
              settingsViewTracker.unsubscribeNotification({
                persDim: {
                  pd1: setting.name,
                  pd2: setting.servicename,
                  pd3: setting.service,
                  pd4: "for an hour",
                  pd5: "notification menu"
                }
              });
            }
          },
          {
            fonticon: "fonticon fonticon-list-delete",
            text: $i18n$2("unsubscribeIndefinitely"),
            name: "indefinetly",
            handler: (item) => {
              unsubscribe({
                id: notification.ID,
                subscribe: 0
              });
              const setting = settingStore.getSetting(notification.SERVICE_ID);
              settingsViewTracker.unsubscribeNotification({
                persDim: {
                  pd1: setting.name,
                  pd2: setting.servicename,
                  pd3: setting.service,
                  pd4: "indefinitely",
                  pd5: "notification menu"
                }
              });
            }
          }
        ]
      },
      {
        fonticon: "fonticon fonticon-trash",
        text: notification.isGroup ? $i18n$2("deleteGroup") : $i18n$2("delete"),
        name: "delete",
        handler: (item) => {
          tryNotificationDeletion(
            notification.ID,
            notification.isMerge,
            notification.isGroup,
            !!notification.FROM_ARCHIVE,
            false
          );
        }
      }
    ];
    notification.OPTIONS = menuOptions;
  };
  return {
    setNotificationMenu,
    setNotificationRead
  };
}
function useNotificationResolution() {
  const { getListOfService } = useSettingsStore();
  const resolveNotificationIcon = (notification) => {
    const message = notification.MESSAGE;
    if (message.icon) {
      switch (message.icon.type) {
        case "appID":
          getAppInfos({ appID: message.icon.data, notifID: notification.ID, clusterId: notification.CLUSTER_ID });
          message.icon["isLink"] = false;
          break;
        case "login":
        case "url":
          message.icon["src"] = getIconUrl({ icon: message.icon, platformId: notification.PLATFORMID });
          message.icon["isLink"] = true;
          break;
        default:
          message.icon["src"] = "./../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png";
          message.icon["isLink"] = false;
          break;
      }
    } else {
      message["icon"] = {
        src: "./../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png",
        isLink: false
      };
    }
    notification.MESSAGE = message;
  };
  const resolveNotificationAction = (notification) => {
    const message = notification.MESSAGE;
    if (message.actions) {
      for (let i = 0; i < message.actions.length; i++) {
        let action = message.actions[i];
        if (action.options && action.options.event && (action.options.event.type === "url" || action.options.event.type === "UI")) {
          let event = action.options.event;
          if (action.options && action.options.event && action.options.event.type === "UI") {
            let eventUI = action.options.event.options;
            if (eventUI.attachments && eventUI.attachments.length > 0) {
              for (let y = 0; y < eventUI.attachments.length; y++) {
                if (eventUI.attachments[y].type === "button") {
                  event = eventUI.attachments[y].options.event;
                }
              }
            }
          }
          if (event.options && event.options.service && event.options.uri) {
            let url = getServiceUrl({ name: event.options.service, platformId: notification.PLATFORMID });
            event.options.url = url + event.options.uri;
            if (notification.APPID === "USASWYM_AP") {
              event.options.csrf = url + "/api/index/tk/";
            }
          } else if (action.type === "select" && event.options && event.options.length > 0) {
            for (let k = 0; k < event.options.length; k++) {
              let url = getServiceUrl({ name: event.options[k].service, platformId: notification.PLATFORMID });
              event.options[k].url = url + event.options[k].uri;
              if (notification.APPID === "USASWYM_AP") {
                event.options[k].csrf = url + "/api/index/tk/";
              }
            }
          }
        }
      }
    }
    notification.MESSAGE = message;
  };
  const getIconUrl = (data) => {
    let url;
    switch (data.icon.type) {
      case "url":
        if (typeof data.icon.data === "object") {
          if (data.platformId && data.platformId !== "null") {
            url = getServiceUrl({ name: data.icon.data.service, platformId: data.platformId });
          } else {
            if (!data.icon.data.service) {
              if (checkIfIsUrl(data.icon.data)) {
                return data.icon.data;
              } else {
                return "./../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png";
              }
            } else {
              for (let letiable in getListOfService()[0]) {
                if (data.icon.data.service.toLowerCase() === letiable.toLowerCase()) {
                  return getListOfService()[0][letiable] + data.icon.data.uri;
                }
              }
            }
          }
        } else {
          return data.icon.data;
        }
        if (url) return url + data.icon.data.uri;
        return void 0;
      case "login":
        url = getServiceUrl({ name: "3dswym", platformId: data.platformId });
        let swymApi;
        if (url === "/") swymApi = "api/user/getpicture/login/";
        else swymApi = "/api/user/getpicture/login/";
        return url + swymApi + data.icon.data;
      case "app":
        getAppInfos({ id: data.icon.data });
        return void 0;
    }
  };
  const getServiceUrl = (service) => {
    for (let i = 0; i < getListOfService().length; i++) {
      if (service.platformId) {
        if (getListOfService()[i].platformid.toLowerCase() === service.platformId.toLowerCase()) {
          if (getListOfService()[i][service.name.toLowerCase()])
            return getListOfService()[i][service.name.toLowerCase()];
          else {
            if (!getListOfService()[i][service.name.toLowerCase()] && service.name.toLowerCase() === "3ddashboard") {
              for (let j2 = 0; j2 < getListOfService().length; j2++) {
                if (getListOfService()[j2][service.platformId.toLowerCase()])
                  return getListOfService()[j2][service.name.toLowerCase()];
              }
            }
          }
        }
      } else {
        return getListOfService()[i][service.name.toLowerCase()] ? getListOfService()[i][service.name.toLowerCase()] : getListOfService()[i + 1] ? getListOfService()[i + 1][service.name.toLowerCase()] : void 0;
      }
    }
    if (getListOfService().length > 0) {
      return getListOfService()[0][service.name.toLowerCase()];
    }
    return void 0;
  };
  return {
    resolveNotificationAction,
    resolveNotificationIcon,
    getIconUrl,
    getServiceUrl
  };
}
const { $i18n: $i18n$1 } = useTranslations();
function useNotificationManagement() {
  const store = useNotificationsStore();
  const settingStore = useSettingsStore();
  const refreshCenterView2 = (withSettings = true) => {
    const { isFilterApplied, getFilter } = useFilterStore();
    store.resetStates();
    store.setIsLoading(true);
    if (withSettings) getSettings();
    let payload;
    if (isFilterApplied()) {
      payload = getFilter();
    } else {
      payload = { ...getFilter(), unread: true };
      getUnreadTotal();
    }
    filter(payload);
  };
  const refreshWithoutReset = (withSettings = true, groupIdToExclude = null) => {
    const { isFilterApplied, getFilter } = useFilterStore();
    if (withSettings) getSettings();
    let payload;
    if (isFilterApplied()) {
      payload = getFilter();
    } else {
      payload = { ...getFilter(), unread: true };
      getUnreadTotal();
    }
    if (groupIdToExclude) {
      if (payload.groupIDs && payload.groupIDs.length > 0 && payload.groupIDs.includes(groupIdToExclude)) {
        payload.groupIDs = payload.groupIDs.filter((groupId) => groupId !== groupIdToExclude);
      }
      payload.oldID = -1;
      payload.archive = false;
    }
    filter(payload);
  };
  const setNotif = (notif, options) => {
    if (Object.hasOwn(notif, "COUNT") && notif.COUNT > 1) {
      const groupSection = [];
      store.groups.set(notif.GROUPID, groupSection);
    }
    store.notifications.set(notif.ID, notif);
    addNotificationToSection(notif);
  };
  const addHistory = (data) => {
    var _a3, _b2, _c3, _d3, _e, _f;
    const { resolveNotificationAction, resolveNotificationIcon } = useNotificationResolution();
    const { cleanNotificationData } = useNotificationCleaning();
    const { setNotificationMenu } = useNotificationMenu();
    const { hasArchiveNotifications: hasArchiveNotifications2 } = useNotificationManagement();
    const { isFilterApplied } = useFilterStore();
    const { addFilterNotifIds, oldID } = useNotificationsStore();
    const options = {
      appName: data.appName,
      currentTenant: data.currentTenant,
      clusterId: data.clusterId
    };
    let oldId = -1;
    const previousOldID = oldID;
    (_a3 = data.notifications) == null ? void 0 : _a3.forEach((notification) => {
      store.addOldID(notification.ID, notification.CREATION_DATE, data.clusterId);
      cleanNotificationData(notification);
      addNotification2(notification, options);
      const notif = store.getNotificationById(`${notification.ID}-${data.clusterId}`);
      resolveNotificationIcon(notif);
      resolveNotificationAction(notif);
      setNotificationMenu(notif);
      if (notif.COUNT > 1) {
        store.addGroupId(notif.GROUPID);
      }
    });
    if (((_b2 = data.notifications) == null ? void 0 : _b2.length) >= 19)
      oldId = ((_c3 = store.clusterInOldIDs(data.clusterId)) == null ? void 0 : _c3.OLD_ID) ?? oldId;
    else {
      setArchiveState();
    }
    store.setOldID(oldId);
    if (isFilterApplied()) {
      if (data.count) {
        let total;
        if (data.archive && store.loadingMore) {
          total = store.filterTotal + (((_d3 = data.notifications) == null ? void 0 : _d3.length) ?? 0);
        } else {
          total = previousOldID === -1 ? data.count : store.filterTotal;
        }
        store.setFilterTotal(total);
        addFilterNotifIds(
          (_e = data.notifications) == null ? void 0 : _e.map((n) => n.ID),
          data.clusterId,
          data.archive
        );
      }
    } else {
      if (data.archive) store.setUnreadTotal(store.unreadTotal + (((_f = data.notifications) == null ? void 0 : _f.length) ?? 0));
    }
    if (store.isLoading) store.setIsLoading(false);
    if (store.loadingMore) store.setLoadingMore(false);
    if (hasArchiveNotifications2(data.notifications)) setArchiveSectionMessage();
  };
  const setNotifMerges = (data) => {
    const { setNotificationMenu } = useNotificationMenu();
    const { cleanNotificationData } = useNotificationCleaning();
    const { resolveNotificationAction, resolveNotificationIcon } = useNotificationResolution();
    data.id = linkIds(data.id, data.clusterId);
    const main = store.getNotificationById(data.id);
    main.mergesRead = 0;
    const options = {
      appName: data.appName,
      currentTenant: data.currentTenant,
      clusterId: data.clusterId
    };
    data.notifications.forEach((notification) => {
      cleanNotificationData(notification);
      addMerge(notification, options);
      let id2 = checkIfIdHasHyphen(notification.ID);
      if (!id2) {
        id2 = `${notification.ID}-${data.clusterId}`;
      } else id2 = notification.ID;
      const merge = store.getMergeById(id2);
      resolveNotificationIcon(merge);
      resolveNotificationAction(merge);
      setNotificationMenu(merge);
      if (merge.READ_DATE !== null) main.mergesRead += 1;
    });
    if (main.mergesRead === main.COUNT) {
      if (!main.isRead) main.READ_DATE = (/* @__PURE__ */ new Date()).toISOString();
    } else if (main.isRead) {
      main.READ_DATE = null;
    }
    setNotificationMenu(main);
    main.mergesFetched = true;
  };
  const addMerge = (notification, options) => {
    const groupSection = store.groups.get(notification.GROUPID);
    const merge = new Notification$1(notification, options, true);
    if (groupSection !== void 0) {
      const item = {
        id: merge.ID,
        groupID: merge.GROUPID,
        date: merge.getCreationDateToTimestamp
      };
      addAndSortNotifsDateDesc(groupSection, item);
      store.groups.set(merge.GROUPID, groupSection);
      store.merges.set(merge.ID, merge);
    }
  };
  const addNotificationToSection = (notification) => {
    const sectionId = notification.getSection;
    let section = store.sectionList.get(sectionId);
    if (!section) {
      section = new Section(sectionId);
      if (!store.sectionListIds.includes(sectionId)) {
        addAndSortIdsDesc(store.sectionListIds, sectionId);
      }
    }
    const notifItem = {
      id: notification.ID,
      groupID: Object.hasOwn(notification, "GROUPID") ? notification.GROUPID : null,
      date: notification.getCreationDateToTimestamp
    };
    section.add(notifItem);
    if (!store.sectionList.has(sectionId)) store.sectionList.set(sectionId, section);
  };
  const addNotification2 = (notification, options, group = false, oldSectionId, oldNotifId) => {
    let oldSection;
    if (group) {
      store.notifications.delete(oldNotifId);
      oldSection = store.sectionList.get(oldSectionId);
      oldSection.remove(oldNotifId);
      if (oldSection.notifs.length === 0) {
        store.sectionList.delete(oldSectionId);
        store.sectionListIds = store.sectionListIds.filter((item) => item !== oldSectionId);
      }
    }
    const notif = new Notification$1(notification, options);
    const notifToReplace = store.getNotificationById(notif.ID) ?? (notif.GROUPID !== null ? store.getNotificationByGroupId(notif.GROUPID) : null);
    if (notifToReplace && (notifToReplace.getSection !== notif.getSection || notifToReplace.CREATION_DATE !== notif.CREATION_DATE)) {
      deleteNotification2(notifToReplace.ID, false, false);
      setNotif(notif);
    } else if (!notifToReplace) {
      setNotif(notif);
    }
  };
  const canBeAddedToGroup = (notification) => {
    if (notification.GROUPID === null) return false;
    const group = store.getNotificationByGroupId(notification.GROUPID);
    return group !== null;
  };
  const addNotificationToGroup = (notification, merge = false, last = false) => {
    const group = store.getNotificationByGroupId(notification.GROUPID);
    const oldSectionId = group.getSection;
    const oldID = group.ID;
    const options = {
      currentTenant: group.currentTenant,
      appName: group.appName,
      clusterId: group.CLUSTER_ID
    };
    updateGroupNotification(group, notification, merge, last);
    addNotification2(group, options, true, oldSectionId, oldID);
    if (!last) replaceGroupMessage(notification);
    if (notification.APPID === "X3DDRIV_AP") {
      refreshWithoutReset(false);
    }
  };
  const updateGroupNotification = (group, notification, merge = false, last = false) => {
    if (!merge) group.COUNT = group.COUNT + 1;
    else if (last) group.COUNT = 1;
    for (const [key, value] of Object.entries(notification)) {
      if (key === "CREATION_DATE" || key === "READ_DATE" || key === "ACTION_DATE") {
        group[key] = value !== null ? new Date(value) : null;
      } else if (key !== "COUNT") group[key] = value;
    }
  };
  const replaceGroupMessage = (notification) => {
    let newGroup = store.getNotificationById(notification.ID);
    if (!newGroup) newGroup = store.getNotificationByGroupId(notification.GROUPID);
    if (newGroup) {
      let currMsg = newGroup.MESSAGE.nls.msg;
      let newMessage = notification.APPID === "X3DDRIV_AP" ? `<strong>${newGroup.COUNT}</strong>` : `<strong>${newGroup.COUNT} ${$i18n$1("Persons")}</strong>`;
      currMsg = replaceParenthesisStrong(currMsg, newMessage);
      if (newGroup.MESSAGE.nls.data.NOTIFIER_MESSAGE) {
        currMsg = currMsg.replace(`. ${newGroup.MESSAGE.nls.data.NOTIFIER_MESSAGE}`, "");
      }
      newGroup.MESSAGE.nls.msg = currMsg;
    }
  };
  const DeleteNotificationGroup = (id2) => {
  };
  const removeNotification = (id2) => {
    const _isMerge = isMerge(id2);
    if (_isMerge) {
      removeMerge(id2);
    } else {
      deleteNotification2(id2);
    }
  };
  const removeNotificationGroup = (id2) => {
    deleteNotification2(id2);
  };
  const deleteNotification2 = (id2, editTotal = true, fetchMore = true) => {
    const { isFilterApplied } = useFilterStore();
    const notification = store.getNotificationById(id2);
    if (editTotal) {
      if (!notification.isRead && !notification.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal - 1);
      if (isFilterApplied()) store.setFilterTotal(store.filterTotal - 1);
    }
    store.selected.splice(store.selected.indexOf(id2), 1);
    const sectionId = store.getNotificationById(id2).getSection;
    const section = store.sectionList.get(sectionId);
    section == null ? void 0 : section.remove(id2);
    if ((section == null ? void 0 : section.notifs.length) === 0) {
      store.sectionList.delete(section.id);
      store.sectionListIds = store.sectionListIds.filter((item) => item !== section.id);
    }
    store.notifications.delete(id2);
    store.removeFilterNotifId(id2);
    if (isGroup(id2)) {
      const group = store.getNotificationById(id2);
      const merges = store.groups.get(group.GROUPID);
      const idsToDelete = [];
      merges.forEach((item) => {
        idsToDelete.push(item.id);
      });
      idsToDelete.forEach((id3) => {
        store.merges.delete(id3);
      });
      store.groups.delete(group.GROUPID);
    }
    if (store.notifications.size === 0) {
      store.setUnreadTotal(0);
      store.setFilterTotal(0);
    }
    if (fetchMore) fetchMoreNotificationsIfNecessary();
  };
  const mergesNumber = (groupId) => {
    return store.getNotificationByGroupId(groupId).COUNT;
  };
  const removeMerge = (id2) => {
    const { setNotificationMenu } = useNotificationMenu();
    const groupID = store.getMergeById(id2).GROUPID;
    deleteMerge(id2);
    const nbMerges = mergesNumber(groupID);
    if (nbMerges === 1) {
      const lastMerge = store.getMergeByGroupId(groupID);
      addNotificationToGroup(lastMerge, true, true);
      store.groups.delete(groupID);
      store.merges.delete(lastMerge.ID);
      const normalNotif = store.getNotificationByGroupId(groupID);
      setNotificationMenu(normalNotif);
    } else {
      if (isIdMainId(id2)) {
        const nextMerge = store.getMergeByGroupId(groupID);
        addNotificationToGroup(nextMerge, true, false);
        setNotificationMenu(nextMerge);
      } else {
        replaceGroupMessage(store.getNotificationByGroupId(groupID));
      }
    }
  };
  const deleteMerge = (id2) => {
    const merge = store.getMergeById(id2);
    if (merge !== void 0) {
      const groupSection = store.groups.get(merge.GROUPID);
      groupSection.splice(
        groupSection.findIndex((item) => item.id === id2),
        1
      );
      store.groups.set(merge.GROUPID, groupSection);
      store.merges.delete(id2);
    }
    const group = store.getNotificationByGroupId(merge.GROUPID);
    group.COUNT = group.COUNT - 1;
  };
  const isMerge = (id2) => {
    const merge = store.getMergeById(id2);
    return merge !== null && merge.isMerge;
  };
  const isGroup = (id2) => {
    const notif = store.getNotificationById(id2);
    return notif !== null && notif.isGroup;
  };
  const isNotificationGroup = (notification) => {
    return notification.isGroup || Object.hasOwn(notification, "COUNT") && notification.COUNT > 1;
  };
  const isNormalNotification = (id2) => {
    const notif = store.getNotificationById(id2);
    return notif !== null && !notif.isGroup && !notif.isMerge;
  };
  const isIdMainId = (id2) => {
    const notification = store.getNotificationById(id2);
    return notification !== null;
  };
  const mergeIsMain = (id2) => {
    const merge = store.getMergeById(id2);
    return merge !== null && store.notifications.has(merge.ID);
  };
  const mainIsMerge = (id2) => {
    const notif = store.getNotificationById(id2);
    return notif !== null && store.merges.has(notif.ID);
  };
  const tryNotificationDeletion = (id2, merge = false, group = false, archive = false, withCancelation = true) => {
    const { centerActionTracker } = NotificationTrackerUsage();
    const theCenterActionTracker = centerActionTracker();
    let notification;
    if (group || !merge) notification = store.getNotificationById(id2);
    else notification = store.getMergeById(id2);
    if (withCancelation) {
      notification.deleted = true;
      clearTimeout(notification.deleteTimeoutId);
      notification.deleteTimeoutId = setTimeout(() => {
        if (notification.deleted) {
          if (group) {
            notificationDelete({
              id: id2,
              archive,
              clusterId: notification.CLUSTER_ID,
              groupID: notification.GROUPID,
              read: notification.isRead
            });
          } else
            notificationDelete({
              id: id2,
              archive,
              clusterId: notification.CLUSTER_ID,
              read: notification.isRead
            });
          theCenterActionTracker.notificationDelete({
            persDim: {
              pd1: notification.isMerge ? "merge" : notification.isGroup ? "group" : "normal"
            }
          });
        }
        clearTimeout(notification.deleteTimeoutId);
      }, 5e3);
    } else {
      if (group) {
        notificationDelete({
          id: id2,
          groupID: notification.GROUPID,
          read: notification.isRead,
          clusterId: notification.CLUSTER_ID,
          archive
        });
      } else
        notificationDelete({
          id: id2,
          clusterId: notification.CLUSTER_ID,
          read: notification.isRead,
          archive
        });
      theCenterActionTracker.notificationDelete({
        persDim: {
          pd1: notification.isMerge ? "merge" : notification.isGroup ? "group" : "normal",
          pd4: `clusterId=${notification.CLUSTER_ID}`
        }
      });
    }
  };
  const notificationType = (id2) => {
    return isMerge(id2) ? "merge" : isGroup(id2) ? "group" : "normal";
  };
  const setNotificationReadState = (notifData, data) => {
    const { setNotificationMenu } = useNotificationMenu();
    if (data.read !== void 0) {
      if (!Object.hasOwn(notifData, "hasMerges")) {
        notifData.READ_DATE = data.read ? (/* @__PURE__ */ new Date()).toISOString() : null;
        store.setUnreadTotal(data.read ? store.unreadTotal - 1 : store.unreadTotal + 1);
      } else {
        notifData.READ_DATE = notifData.mergesRead === notifData.COUNT ? (/* @__PURE__ */ new Date()).toISOString() : null;
      }
    } else if (data.starred !== void 0) {
      notifData.STARRED = data.param;
    }
    setNotificationMenu(notifData);
  };
  const setMergeReadState = (mergeData, data) => {
    const { setNotificationMenu } = useNotificationMenu();
    const mainNotification = store.getNotificationByGroupId(mergeData.GROUPID);
    if (data.read !== void 0) {
      if (data.read) {
        if (!mergeData.isRead) mainNotification.mergesRead = mainNotification.mergesRead + 1;
      } else {
        if (mergeData.isRead) mainNotification.mergesRead = mainNotification.mergesRead - 1;
      }
      mergeData.READ_DATE = data.read ? (/* @__PURE__ */ new Date()).toISOString() : null;
    }
    setNotificationMenu(mergeData);
    if (mainNotification.mergesRead === mainNotification.COUNT) {
      if (!mainNotification.isRead) {
        mainNotification.READ_DATE = (/* @__PURE__ */ new Date()).toISOString();
        if (!mainNotification.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal - 1);
      }
    } else if (!data.read && mainNotification.isRead) {
      mainNotification.READ_DATE = null;
      if (!mainNotification.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal + 1);
    }
    setNotificationMenu(mainNotification);
  };
  const setGroupReadState = (id2, data) => {
    const { setNotificationMenu } = useNotificationMenu();
    const group = store.getNotificationById(id2);
    if (data.read !== void 0) {
      if (data.read) {
        group.READ_DATE = (/* @__PURE__ */ new Date()).toISOString();
        if (group.mergesFetched) {
          const merges = store.groups.get(group.GROUPID);
          merges.forEach((merge) => {
            const mergeItem = store.getMergeById(merge.id);
            mergeItem.READ_DATE = (/* @__PURE__ */ new Date()).toISOString();
            setNotificationMenu(mergeItem);
          });
        }
        group.mergesRead = group.COUNT;
        if (!group.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal - 1);
      } else {
        group.READ_DATE = null;
        if (group.mergesFetched) {
          const merges = store.groups.get(group.GROUPID);
          merges.forEach((merge) => {
            const mergeItem = store.getMergeById(merge.id);
            mergeItem.READ_DATE = null;
            setNotificationMenu(mergeItem);
          });
        }
        group.mergesRead = 0;
        if (!group.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal + 1);
      }
    } else if (data.starred !== void 0) {
      group.STARRED = data.param;
    }
    setNotificationMenu(group);
  };
  const setAllReadState = (data) => {
    const { setNotificationMenu } = useNotificationMenu();
    const { isFilterApplied } = useFilterStore();
    store.notifications.forEach((notification) => {
      if (data.read) {
        notification.READ_DATE = (/* @__PURE__ */ new Date()).toISOString();
      } else notification.READ_DATE = null;
      if (isGroup(notification.ID)) {
        if (notification.mergesFetched) {
          const merges = store.groups.get(notification.GROUPID);
          merges.forEach((merge) => {
            const mergeItem = store.getMergeById(merge.id);
            if (data.read) mergeItem.READ_DATE = (/* @__PURE__ */ new Date()).toISOString();
            else mergeItem.READ_DATE = null;
            setNotificationMenu(mergeItem);
          });
          notification.mergesRead = notification.COUNT;
        }
      }
      setNotificationMenu(notification);
    });
    if (!isFilterApplied()) {
      if (data.read) store.setUnreadTotal(0);
      else getUnreadTotal();
    }
  };
  const unsubscribeNotification = ({ setting, notifID }) => {
    if (setting.SUBSCRIBE === 0 || setting.UNSUBSCRIBE_DATE !== null) {
      const idsToDelete = [];
      store.notifications.forEach((notification) => {
        if (notification.SERVICE_ID === setting.ID) {
          idsToDelete.push(notification.ID);
        }
      });
      idsToDelete.forEach((id2) => {
        deleteNotification2(id2, true, false);
      });
      if (setting.UNSUBSCRIBE_DATE !== null) {
        settingStore.addUnsubscribe_dateSetting(setting.ID);
      }
    }
  };
  const updateLabel = (params) => {
    const { updateActionedLabel } = useNotificationActions();
    let notification;
    if (params.isMerge) notification = store.getMergeById(params.id);
    else notification = store.getNotificationById(params.id);
    updateActionedLabel(notification, params.label, false);
  };
  const setActioned = (params) => {
    const { updateActionedLabel } = useNotificationActions();
    let notification;
    let group;
    if (params.isMerge) {
      notification = store.getMergeById(params.id);
      group = store.getNotificationByGroupId(notification.GROUPID);
    } else notification = store.getNotificationById(params.id);
    if (!notification.isActioned) notification.actionNotification();
    let allActioned = true;
    if (group) {
      const merges = store.groups.get(group.GROUPID);
      merges.forEach((item) => {
        const merge = store.getMergeById(item.id);
        if (!merge.isActioned) {
          allActioned = false;
          return;
        }
      });
      if (allActioned) {
        updateActionedLabel(group, "do not matter", false);
        group.actionNotification();
      }
    }
  };
  const setArchiveState = () => {
    const { isFilterApplied, getFilter } = useFilterStore();
    if (store.canLoadMoreHistory) {
      store.setCanLoadMoreHistory(false);
      if (!store.canLoadMoreFromArchive) {
        store.setCanLoadMoreFromArchive(true);
        if (store.notifications.size < 40 && !isFilterApplied() || store.notifications.size < 19 && isFilterApplied()) {
          store.setLoadingMore(true);
          ({
            ...isFilterApplied() && {
              ...getFilter()
            },
            ...!isFilterApplied() && {
              type: "all"
            },
            archive: true
          });
        } else {
          store.setOldID(-1);
        }
      }
    } else {
      if (store.canLoadMoreFromArchive) {
        store.setCanLoadMoreFromArchive(false);
      }
    }
  };
  const hasArchiveNotifications = (notifications) => {
    return notifications.some((notification) => notification.FROM_ARCHIVE);
  };
  const setArchiveSectionMessage = () => {
    if (store.canLoadMoreFromArchive) {
      const { messageNotice } = usePreferencesManagement();
      messageNotice($i18n$1("archiveAlert"), 1e4);
    }
  };
  const notificationInFilterRange = (notification, filter2) => {
    const creationDate = new Date(notification.CREATION_DATE);
    let inDateRange = true;
    if (filter2.first_date && filter2.last_date) {
      filter2.first_date.setHours(0, 0, 0, 0);
      filter2.last_date.setHours(23, 59, 59, 999);
      inDateRange = creationDate >= filter2.first_date && creationDate <= filter2.last_date;
    } else if (filter2.first_date) {
      filter2.first_date.setHours(0, 0, 0, 0);
      inDateRange = creationDate >= filter2.first_date;
    } else if (filter2.last_date) {
      filter2.last_date.setHours(23, 59, 59, 999);
      inDateRange = creationDate <= filter2.last_date;
    }
    const inSearchesRange = filter2.searches.length === 0 || filter2.searches.some((search) => {
      return notification.MESSAGE.nls.msg.toLowerCase().includes(search.toLowerCase());
    });
    const inReadRange = filter2.read === true && notification.READ_DATE !== null;
    const inUnreadRange = filter2.unread === true && notification.READ_DATE === null;
    const inStarredRange = filter2.starred === true && notification.STARRED === 1;
    const inUnstarredRange = filter2.unstarred === true && (!notification.STARRED || notification.STARRED === 0);
    const bothReadAndUnread = filter2.read === true && filter2.unread === true || filter2.read === false && filter2.unread === false;
    const bothStarredAndUnstarred = filter2.starred === true && filter2.unstarred === true || filter2.starred === false && filter2.unstarred === false;
    const defaultRange = bothReadAndUnread && bothStarredAndUnstarred;
    const inTenantRange = filter2.tenants.length === 0 || filter2.tenants.some((tenant) => tenant.value === notification.PLATFORMID);
    return inDateRange && inSearchesRange && (defaultRange || (bothReadAndUnread || inReadRange || inUnreadRange) && (bothStarredAndUnstarred || inStarredRange || inUnstarredRange)) && inTenantRange;
  };
  const fetchMoreNotificationsIfNecessary = () => {
    if (store.canLoadMoreHistory || store.canLoadMoreFromArchive) {
      const { isFilterApplied, getFilter } = useFilterStore();
      let hasFetched = false;
      if (isFilterApplied()) {
        if (store.notifications.size < 19) {
          if (store.oldID !== -1) {
            const data = {
              ...getFilter(),
              oldID: store.oldID,
              groupIDs: store.groupIDs,
              ...store.canLoadMoreFromArchive && {
                archive: true
              }
            };
            if (!store.isLoading) store.setLoadingMore(true);
            filter(data);
            hasFetched = true;
          }
        }
      } else {
        if (store.notifications.size < 40) {
          if (store.oldID !== -1) {
            const data = {
              type: "all",
              oldID: store.oldID,
              groupIDs: store.groupIDs,
              ...store.canLoadMoreFromArchive && {
                archive: true
              }
            };
            if (!store.isLoading) store.setLoadingMore(true);
            getHistory(data);
            getUnreadTotal();
            hasFetched = true;
          }
        }
      }
      if (!hasFetched) {
        store.setLoadingMore(false);
        store.setIsLoading(false);
      }
    } else {
      store.setLoadingMore(false);
      store.setIsLoading(false);
    }
  };
  const cancelDeletion = (id2, merge = false) => {
    const { centerActionTracker } = NotificationTrackerUsage();
    let notif;
    if (merge) {
      if (isMerge(id2)) {
        notif = store.getMergeById(id2);
      }
    } else {
      notif = store.getNotificationById(id2);
    }
    if (notif) {
      notif.deleted = false;
      clearTimeout(notif.deleteTimeoutId);
      centerActionTracker().cancelNotificationDeletion({
        persDim: {
          pd1: notif.isMerge ? "merge" : notif.isGroup ? "group" : "normal"
        }
      });
    }
  };
  const loadMoreNotifications = () => {
    if (store.loadingMore || store.isLoading) return;
    if (store.canLoadMoreHistory === true || store.canLoadMoreFromArchive === true) {
      store.setLoadingMore(true);
      let timeout = setTimeout(() => {
        const { isFilterApplied, getFilter } = useFilterStore();
        const data = {
          ...!isFilterApplied() && {
            type: "all"
          },
          ...isFilterApplied() && {
            ...getFilter()
          },
          ...store.oldID !== -1 && {
            oldID: store.oldID
          },
          groupIDs: store.groupIDs,
          ...store.canLoadMoreFromArchive && {
            archive: true
          }
        };
        if (isFilterApplied()) {
          filter(data);
        } else {
          getHistory(data);
        }
        clearTimeout(timeout);
      }, 500);
    }
  };
  const rollbackPopupAction = async (data) => {
    if (Object.keys(data.params).length) {
      const { alertConfirmNotice } = usePreferencesManagement();
      let renderToDoc, title;
      if (data.params.isInNotifCenter) {
        renderToDoc = document.body;
        title = $i18n$1("rollbackPopupTitleForNotifCenter");
      } else {
        renderToDoc = parent.document.body;
        title = $i18n$1("rollbackPopupTitleFor3DDashboard");
      }
      store.setRenderToDoc(renderToDoc);
      alertConfirmNotice({ title, msg: $i18n$1("rollbackPopupMsg") }, (result) => {
        rollbackPopupconfirmation({ file: data.params.file, id: data.params.id, confirmPopupResult: result });
        store.resetRenderToDoc();
      });
    }
  };
  return {
    refreshCenterView: refreshCenterView2,
    addHistory,
    addMerge,
    setNotifMerges,
    updateLabel,
    addNotificationToSection,
    addNotification: addNotification2,
    removeNotification,
    removeMerge,
    isMerge,
    setActioned,
    isGroup,
    isNotificationGroup,
    mergeIsMain,
    mainIsMerge,
    tryNotificationDeletion,
    isNormalNotification,
    notificationType,
    canBeAddedToGroup,
    addNotificationToGroup,
    updateGroupNotification,
    replaceGroupMessage,
    DeleteNotificationGroup,
    deleteNotification: deleteNotification2,
    deleteMerge,
    mergesNumber,
    isIdMainId,
    removeNotificationGroup,
    setNotificationReadState,
    setMergeReadState,
    setGroupReadState,
    setAllReadState,
    unsubscribeNotification,
    setArchiveState,
    setArchiveSectionMessage,
    hasArchiveNotifications,
    notificationInFilterRange,
    fetchMoreNotificationsIfNecessary,
    cancelDeletion,
    loadMoreNotifications,
    refreshWithoutReset,
    rollbackPopupAction
  };
}
const useNotificationsStore = /* @__PURE__ */ defineStore("notifications", () => {
  const clusterId = ref("");
  const setClusterId = (id2) => {
    if (typeof id2 === "string") clusterId.value = id2;
  };
  const isCurrentCluster = (id2) => {
    return clusterId.value === id2;
  };
  const centerFrameOpened = ref(false);
  const setCenterFrameOpened = (opened) => {
    centerFrameOpened.value = opened;
  };
  const isLoading = ref(true);
  const dispose = ref(null);
  const loadingMore = ref(false);
  const filterQuery = ref(false);
  const canLoadMoreHistory = ref(true);
  const renderToDoc = ref(null);
  const hasRenderToDoc = computed(() => renderToDoc.value !== null);
  const setRenderToDoc = (doc2) => {
    renderToDoc.value = doc2;
  };
  const resetRenderToDoc = () => {
    renderToDoc.value = null;
  };
  const canLoadMoreFromArchive = ref(false);
  const unreadTotal = ref(0);
  const setUnreadTotal2 = (nbUnread) => {
    let counter = 0;
    if (typeof nbUnread === "number") {
      counter = nbUnread;
    } else {
      counter = parseInt(nbUnread);
    }
    unreadTotal.value = counter;
  };
  const unreadTotalFederation = ref([]);
  const setUnreadTotalFederation = ({ unread: unread2, clusterId: clusterId2 }) => {
    const find = unreadTotalFederation.value.find((n) => n.clusterId === clusterId2);
    if (!find) unreadTotalFederation.value.push({ unread: unread2, clusterId: clusterId2 });
    else {
      find.unread = unread2;
    }
  };
  const getUnreadTotalFederation = computed(() => {
    return unreadTotalFederation.value.map((n) => n.unread).reduce((a, b) => a + b, 0);
  });
  watch(
    () => getUnreadTotalFederation.value,
    (value) => {
      setUnreadTotal2(value);
    },
    { immediate: true, deep: true }
  );
  const filterTotal = ref(0);
  const oldID = ref(-1);
  const oldIDs = ref([]);
  const clusterInOldIDs = (clusterId2) => {
    return oldIDs.value.find((item) => item.CLUSTER_ID === clusterId2);
  };
  const addOldID = (OLD_ID, CREATION_DATE, CLUSTER_ID) => {
    const old_id_data = clusterInOldIDs(CLUSTER_ID);
    if (!old_id_data) {
      oldIDs.value.push({ OLD_ID, CREATION_DATE, CLUSTER_ID });
    } else {
      if (old_id_data.CREATION_DATE > CREATION_DATE) {
        old_id_data.OLD_ID = OLD_ID;
        old_id_data.CREATION_DATE = CREATION_DATE;
      }
    }
  };
  const groupIDs = ref([]);
  const filterNotifIds = ref([]);
  const notifications = reactive(/* @__PURE__ */ new Map());
  const groups = reactive(/* @__PURE__ */ new Map());
  const merges = reactive(/* @__PURE__ */ new Map());
  const sectionListIds = ref([]);
  const scroller = ref(null);
  const sectionList = reactive(/* @__PURE__ */ new Map());
  const selectionMode = ref(false);
  const selected2 = ref([]);
  const error = ref(false);
  const isEmpty = computed(() => {
    return notifications.size === 0;
  });
  const getNotificationById = (id2) => {
    return notifications.get(id2) ? notifications.get(id2) : null;
  };
  const getNotificationByGroupId = (groupId) => {
    for (let [_, notification] of notifications) {
      if (notification.GROUPID === groupId) {
        return notification;
      }
    }
    return null;
  };
  const getMergeById = (id2) => {
    return merges.get(id2) ? merges.get(id2) : null;
  };
  const getMergeByGroupId = (groupId) => {
    for (let [_, notification] of merges) {
      if (notification.GROUPID === groupId) return notification;
    }
    return null;
  };
  const getAllMergesByGroupId = (groupID) => {
    const merges2 = [];
    for (let [_, merge] of merges2) {
      if (merge.GROUPID === groupID) merges2.push(merge);
    }
    return merges2;
  };
  const addGroupId = (groupId) => {
    if (!groupIDs.value.includes(groupId)) {
      groupIDs.value.push(groupId);
    }
  };
  const setScrollerBody = (el2) => {
    scroller.value = el2;
  };
  const setOldID = (id2) => {
    oldID.value = id2;
  };
  const setFilterQuery = (fetch2) => {
    filterQuery.value = fetch2;
  };
  const setFilterTotal = (count) => {
    if (typeof count === "number") filterTotal.value = count;
  };
  const addFilterNotifIds = (notifIds, clusterId2, archive) => {
    for (let id2 of notifIds) {
      const find = filterNotifIds.value.find((n) => n.id === id2);
      if (!find) filterNotifIds.value.push({ id: id2, archive, clusterId: clusterId2 });
    }
  };
  const removeFilterNotifId = (notifIds) => {
    filterNotifIds.value = filterNotifIds.value.filter((filterId) => !notifIds.includes(filterId.id));
  };
  const setIsLoading = (loading) => {
    isLoading.value = loading;
  };
  const setCanLoadMoreHistory = (load) => {
    canLoadMoreHistory.value = load;
  };
  const setCanLoadMoreFromArchive = (load) => {
    canLoadMoreFromArchive.value = load;
  };
  const setLoadingMore = (load) => {
    loadingMore.value = load;
  };
  const addUnreadTotal = (nbUnread) => {
    unreadTotal.value += nbUnread;
  };
  const isUnreadTotalEmpty = () => {
    return unreadTotal.value === 0;
  };
  const setMerge2 = ({ id: id2, notification, options }) => {
    const { addMerge } = useNotificationManagement();
    addMerge(notification, options);
  };
  const getGroup = (groupId) => {
    return groups.get(groupId) ? groups.get(groupId) : null;
  };
  const setNotification = (notification, options) => {
    const { addNotification: addNotification2 } = useNotificationManagement();
    addNotification2(notification, options);
  };
  const setNotifAppInfos = (data) => {
    const { isMerge, isNormalNotification, isGroup } = useNotificationManagement();
    let notification;
    if (isMerge(data.notifID)) {
      notification = getMergeById(data.notifID);
      notification.MESSAGE.icon["src"] = data.src;
    }
    if (isNormalNotification(data.notifID) || isGroup(data.notifID)) {
      notification = getNotificationById(data.notifID);
      notification.MESSAGE.icon["src"] = data.src;
    }
  };
  const resetStates = (filtered = false) => {
    if (!filtered) {
      oldID.value = -1;
      filterTotal.value = 0;
    } else {
      filterTotal.value = filterTotal.value - filterNotifIds.value.length >= 0 ? filterTotal.value - filterNotifIds.value.length : 0;
    }
    notifications.clear();
    sectionList.clear();
    oldIDs.value.length = 0;
    sectionListIds.value.length = 0;
    unreadTotal.value = 0;
    groupIDs.value.length = 0;
    filterNotifIds.value.length = 0;
    selectionMode.value = false;
    selected2.value.length = 0;
    canLoadMoreHistory.value = true;
    canLoadMoreFromArchive.value = false;
    loadingMore.value = false;
    error.value = false;
    groups.clear();
    merges.clear();
    scroller.value = null;
    filterQuery.value = false;
    dispose.value = null;
    unreadTotalFederation.value.length = 0;
  };
  return {
    // STATE
    notifications,
    sectionList,
    sectionListIds,
    unreadTotal,
    getUnreadTotalFederation,
    filterTotal,
    oldID,
    oldIDs,
    groupIDs,
    filterNotifIds,
    selectionMode,
    selected: selected2,
    canLoadMoreHistory,
    canLoadMoreFromArchive,
    archive: canLoadMoreFromArchive,
    loadingMore,
    isLoading,
    error,
    groups,
    merges,
    scroller,
    filterQuery,
    dispose,
    renderToDoc,
    centerFrameOpened,
    clusterId,
    unreadTotalFederation,
    // COMPUTED GETTERS
    isEmpty,
    hasRenderToDoc,
    // NOT COMPUTED GETTERS
    getNotificationById,
    getNotificationByGroupId,
    getMergeById,
    getMergeByGroupId,
    getAllMergesByGroupId,
    getGroup,
    getSelected: () => selected2.value,
    getGroupIDs: () => groupIDs.value,
    getSectionListIds: () => sectionListIds,
    getSectionList: () => sectionList,
    // ACTIONS
    setClusterId,
    isCurrentCluster,
    setCenterFrameOpened,
    setNotifAppInfos,
    setIsLoading,
    setUnreadTotal: setUnreadTotal2,
    addUnreadTotal,
    setUnreadTotalFederation,
    isUnreadTotalEmpty,
    setNotification,
    setMerge: setMerge2,
    setScrollerBody,
    setLoadingMore,
    setCanLoadMoreHistory,
    setCanLoadMoreFromArchive,
    setOldID,
    addFilterNotifIds,
    removeFilterNotifId,
    resetStates,
    addGroupId,
    setFilterTotal,
    setFilterQuery,
    setRenderToDoc,
    resetRenderToDoc,
    addOldID,
    clusterInOldIDs
  };
});
const channelToServer$1 = "3dnotifinterne";
const clientToServerEvent$1 = "toINTF";
function useConnection() {
  const connectionStore = useConnectionStore();
  const notifStore = useNotificationsStore();
  const setSocketStatusTimeout = (time) => {
    const { stop, start } = useTimeoutFn(() => {
      if (connectionStore.checkingSocketStatus) {
        connectionStore.setCheckingSocketStatus(false);
      }
    }, time);
    connectionStore.setSocketStatusVariables({ _stop: stop, _start: start });
  };
  const timeoutSocketStatusCheck = () => {
    connectionStore.stop();
    connectionStore.start();
  };
  const reliveSocketIfKO = () => {
    watch(
      () => connectionStore.socketStatus,
      (value) => {
        if (connectionStore.isSocketConnected) {
          if (connectionStore.isPreviousSocketDisconnected) {
            if (notifStore.centerFrameOpened) {
              const { refreshWithoutReset } = useNotificationManagement();
              refreshWithoutReset();
            } else connectionStore.setNeedCenterRefresh(true);
          }
          if (connectionStore.driverSenderQueue.length) {
            triggerDriverSenderQueue();
          }
        }
      }
    );
    watch(
      () => notifStore.centerFrameOpened,
      (value) => {
        if (value) {
          if (connectionStore.isSocketDisconnected && !connectionStore.checkingSocketStatus) {
            connectionStore.setCheckingSocketStatus(true);
            timeoutSocketStatusCheck();
            checkSocketStatus();
          }
          if (connectionStore.needCenterRefresh) {
            const { refreshWithoutReset } = useNotificationManagement();
            refreshWithoutReset();
            connectionStore.setNeedCenterRefresh(false);
          }
        }
      }
    );
  };
  const triggerDriverSenderQueue = async () => {
    const PlatformAPI = await getPlatformAPI();
    if (PlatformAPI) {
      const datas = [...connectionStore.driverSenderQueue];
      for (const data of datas) {
        if (connectionStore.isSocketConnected) {
          PlatformAPI.publish(channelToServer$1, { action: clientToServerEvent$1, data });
          connectionStore.driverSenderQueue.shift();
        } else return;
      }
    }
  };
  return {
    reliveSocketIfKO,
    triggerDriverSenderQueue,
    setSocketStatusTimeout,
    timeoutSocketStatusCheck
  };
}
const channelManagerInit = "3dNotifManagerInit";
const channelCenterInit = "3dNotifCenterInit";
const channelToWidget = "3dnotifinterne";
const channelToServer = "3dnotifinterne";
const clientToServerEvent = "toINTF";
const serverToClientEvent = "notification";
const PAPIDriver = {
  /**
   * Generates a TxID.
   * @param {string} action - The event action name to generate the TxID for.
   * @returns A random transaction id for the given action.
   */
  _generateTxID: (action) => "" + Date.now() + "-r" + Math.floor(Math.random() * 1e3) + "-" + (action || "noAction"),
  /**
   * Initializes Center to Manager connection.
   * @param {UWA.Widget} widget - Notifications Center widget.
   */
  init: async function(widget) {
    const PlatformAPI = await getPlatformAPI();
    PlatformAPI.subscribe(channelManagerInit, async function(data) {
      if (data) {
        PlatformAPI.unsubscribe(channelManagerInit);
      } else {
        widget.counterRequest++;
        widget.timerId = window.setTimeout(function() {
          widget.initFlag = true;
          if (widget.counterRequest < widget.maxRequest) PlatformAPI.publish(channelCenterInit, true);
          else window.clearTimeout(widget.timerId);
        }, 2e3);
      }
    });
    PlatformAPI.publish(channelCenterInit, true);
  },
  /**
   * Adds callback to call on reception of event.
   * @param {Function} callback - The function to call on reception of event.
   */
  addCallback: async function(callback) {
    const PlatformAPI = await getPlatformAPI();
    const { clusterId, setClusterId } = useNotificationsStore();
    PlatformAPI.subscribe(channelToWidget, function(response) {
      if (!response) return console.debug("[PAPIDriver addCallback] Missing response");
      if (!response.action || response.action !== serverToClientEvent) {
        if (response.action === clientToServerEvent) return;
        return console.debug(`[PAPIDriver addCallback] Received non-${serverToClientEvent} event`);
      }
      if (!response.data) return console.debug("[PAPIDriver addCallback] Missing response.data");
      response.data.clusterId = response.data.clusterId || response.clusterId;
      if (response.data.clusterId && !clusterId) setClusterId(response.data.clusterId);
      callback(response.data);
    });
  },
  /**
   * Relive the socket if it is disconnected.
   * @param {*} data
   * @returns
   */
  reliveSocket: async function(data) {
    const connectionStore = useConnectionStore();
    const { timeoutSocketStatusCheck } = useConnection();
    if (connectionStore.isSocketDisconnected && !managerEvents[data.action] && !connectionStore.checkingSocketStatus) {
      console.log("[PAPIDriver throttleSocketRelive] Socket is disconnected. Trying to connect...");
      const d = { action: "checkSocketStatus", data: {} };
      const PlatformAPI = await getPlatformAPI();
      connectionStore.setCheckingSocketStatus(true);
      timeoutSocketStatusCheck();
      PlatformAPI.publish(channelToServer, { action: clientToServerEvent, data: d });
      connectionStore.addToDriverSenderQueue(data);
      return;
    }
    if (connectionStore.checkingSocketStatus && !managerEvents[data.action]) {
      connectionStore.addToDriverSenderQueue(data);
      return;
    }
  },
  /**
   * Sends the given data to server.
   * @param {{action: string, data: object}} data - The data to send.
   */
  send: async function(data) {
    if (!data) return;
    this.reliveSocket(data);
    if (data.action) data.TxID = this._generateTxID(data.action);
    const PlatformAPI = await getPlatformAPI();
    PlatformAPI.publish(channelToServer, { action: clientToServerEvent, data });
  }
};
const commonDriver = PAPIDriver;
const setAnalyticsStartTime = () => {
  const { setStartTime } = useAnalyticsStore();
  setStartTime(performance.now());
};
function setFilterOptionsPayload({
  first_date,
  last_date,
  searches: searches2,
  read: read2,
  unread: unread2,
  starred: starred2,
  unstarred: unstarred2,
  tenants,
  oldID,
  archive,
  groupIDs,
  clusterId
}) {
  const tenantsValues = [];
  tenants.forEach((tenant) => {
    tenantsValues.push(tenant.value);
  });
  tenants = tenantsValues;
  const clusters = {};
  clusters[clusterId] = {
    oldId: oldID,
    groupIds: groupIDs,
    archive: archive ?? false,
    tenants: tenants.map((t) => (t == null ? void 0 : t.LABEL) || t)
  };
  const firstDate = first_date ? first_date.toLocaleDateString("en-CA") : null;
  let lastDate = new Date(last_date == null ? void 0 : last_date.valueOf());
  lastDate = lastDate == null ? void 0 : lastDate.setDate((lastDate == null ? void 0 : lastDate.getDate()) + 1);
  lastDate = lastDate ? new Date(lastDate).toLocaleDateString("en-CA") : null;
  return {
    filterOptions: {
      firstDate,
      lastDate,
      searches: searches2,
      read: read2,
      unread: unread2,
      starred: starred2,
      unstarred: unstarred2
    },
    clusters
  };
}
function getUnreadTotal() {
  commonDriver.send({ action: "getUnreadTotal", data: {} });
}
function getTenants() {
  commonDriver.send({ action: "getTenants", data: {} });
}
function resetBadge({ notifCenterOpened: notifCenterOpened2 }) {
  commonDriver.send({ action: "resetBadge", data: { notifCenterOpened: notifCenterOpened2 } });
}
function getHistory({ type, oldID, groupIDs, archive }) {
  setAnalyticsStartTime();
  commonDriver.send({ action: "getHistory", data: { type, oldID, groupIDs, archive } });
}
function notificationRead({
  action,
  id: id2,
  read: read2,
  actioned,
  archive,
  scope,
  filter: filter2,
  notificationID,
  starred: starred2,
  param,
  params,
  updateLabel,
  groupID,
  hiddenMerged,
  clusterId,
  filterData
}) {
  const notifId = checkIfIdHasHyphen(id2);
  if (notifId) {
    id2 = parseInt(notifId.id);
  }
  if (params && !!params.id) {
    const paramId = checkIfIdHasHyphen(params.id);
    if (paramId) {
      params.id = parseInt(paramId.id);
    }
  }
  const { filterOptions, clusters } = filterData ? setFilterOptionsPayload(filterData) : {};
  commonDriver.send({
    action: "notificationRead",
    data: {
      action,
      id: id2,
      read: read2,
      archive,
      scope,
      filter: filter2,
      notificationID,
      actioned,
      starred: starred2,
      param,
      params,
      updateLabel,
      groupID,
      hiddenMerged,
      clusterId,
      filterOptions,
      clusters
    }
  });
}
function deleteAllNotification$1() {
  commonDriver.send({ action: "deleteAllNotification", data: {} });
}
function notificationDelete({ groupID, id: id2, scope, archive, clusterId }) {
  const notifId = checkIfIdHasHyphen(id2);
  if (notifId) {
    id2 = parseInt(notifId.id);
  }
  commonDriver.send({
    action: "notificationDelete",
    data: { id: id2, groupID, scope, archive, clusterId }
  });
}
function getAppInfos({ appID, notifID, clusterId }) {
  const notifId = checkIfIdHasHyphen(notifID);
  if (notifId) {
    notifID = parseInt(notifId.id);
  }
  commonDriver.send({ action: "getAppInfos", data: { appID, notifID, clusterId } });
}
function getServices() {
  commonDriver.send({ action: "getServices", data: {} });
}
function getMerge({ parentNotif, filterData }) {
  const notifId = checkIfIdHasHyphen(parentNotif.id);
  if (notifId) {
    parentNotif.id = parseInt(notifId.id);
  }
  const { filterOptions, clusters } = filterData ? setFilterOptionsPayload(filterData) : {};
  commonDriver.send({ action: "getMerge", data: { parentNotif, filterOptions, clusters } });
}
function unsubscribe({ id: id2, subscribe, forHour }) {
  const notifId = checkIfIdHasHyphen(id2);
  if (notifId) {
    id2 = parseInt(notifId.id);
  }
  commonDriver.send({ action: "unsubscribe", data: { id: id2, subscribe, forHour } });
}
function getTenantAgnosticMode() {
  commonDriver.send({ action: "getTenantAgnosticMode", data: {} });
}
function updateTenantAgnosticMode({ isTenantAgnostic, hidePlatformSelection }) {
  commonDriver.send({ action: "updateTenantAgnosticMode", data: { isTenantAgnostic, hidePlatformSelection } });
}
function publish({ topic, data }) {
  commonDriver.send({ action: "publish", data: { topic, data } });
}
function filter({
  first_date,
  last_date,
  searches: searches2,
  read: read2,
  unread: unread2,
  starred: starred2,
  unstarred: unstarred2,
  tenants,
  oldID,
  archive,
  groupIDs,
  clusterId
}) {
  setAnalyticsStartTime();
  commonDriver.send({
    action: "filter",
    data: setFilterOptionsPayload({
      first_date,
      last_date,
      searches: searches2,
      read: read2,
      unread: unread2,
      starred: starred2,
      unstarred: unstarred2,
      tenants,
      oldID,
      archive,
      groupIDs,
      clusterId
    })
  });
}
function deleteAllFilteredNotification$1({ notificationID, filterData }) {
  const { filterOptions, clusters } = filterData ? setFilterOptionsPayload(filterData) : {};
  commonDriver.send({ action: "deleteAllFilteredNotification", data: { notificationID, filterOptions, clusters } });
}
function updateSettings({ subscribe, id: id2, notif_by_browser, notif_by_email, notif_by_ui, tenantAware }) {
  commonDriver.send({
    action: "updateSettings",
    data: { subscribe, id: id2, notif_by_browser, notif_by_email, notif_by_ui, tenantAware }
  });
}
function resetSettingUnsubscriptionDate$1({ id: id2 }) {
  commonDriver.send({
    action: "resetSettingUnsubscriptionDate",
    data: { id: id2 }
  });
}
function getSettings() {
  commonDriver.send({ action: "getSettings", data: {} });
}
function rollbackPopupconfirmation({ file, id: id2, confirmPopupResult }) {
  commonDriver.send({ action: "rollbackPopupconfirmation", data: { id: id2, file, confirmPopupResult } });
}
function getSocketStatus() {
  commonDriver.send({ action: "getSocketStatus", data: { centerOpened: true } });
}
function checkSocketStatus() {
  commonDriver.send({ action: "checkSocketStatus", data: {} });
}
const managerEvents = {
  getSocketStatus,
  checkSocketStatus,
  getAppInfos,
  getServices,
  publish
};
const _hoisted_1$w = { class: "INTFCenter-zero-notification-container" };
const _hoisted_2$o = { class: "INTFCenter-zero-notification-content" };
const _hoisted_3$f = /* @__PURE__ */ createBaseVNode("span", { class: "fonticon fonticon-bell block INTFCenter-no-notif-icon" }, null, -1);
const _hoisted_4$a = { class: "INTFCenter-no-notif-text" };
const _sfc_main$A = {
  __name: "NoNotification",
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const store = useNotificationsStore();
    onMounted(async () => {
      store.selectionMode = false;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$w, [
        createBaseVNode("div", _hoisted_2$o, [
          _hoisted_3$f,
          createBaseVNode("p", _hoisted_4$a, toDisplayString(unref($i18n2)("noNotifications")), 1)
        ])
      ]);
    };
  }
};
const _hoisted_1$v = ["icon-src"];
const _hoisted_2$n = ["src"];
const _hoisted_3$e = {
  key: 0,
  class: "INTFCenter-Mergecount"
};
const _hoisted_4$9 = /* @__PURE__ */ createBaseVNode("span", { class: "INTFCenter-bodyMergedImg fonticon fonticon-users" }, null, -1);
const _hoisted_5$6 = [
  _hoisted_4$9
];
const _sfc_main$z = {
  __name: "NotificationIcon",
  props: {
    id: String,
    group: {
      type: Boolean,
      default: false
    },
    merge: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "login"
    },
    isLink: {
      type: Boolean,
      default: false
    },
    icon: String
  },
  setup(__props) {
    const tries = ref(0);
    const props = __props;
    const src = ref("");
    const iconUrlBackup = ref("./../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png");
    const goToLink = () => {
      if (props.isLink) {
        const { openIconUrl } = useNotificationActions();
        const { centerActionTracker } = NotificationTrackerUsage();
        openIconUrl(props.icon);
        centerActionTracker().profileClick();
      }
    };
    watch(
      () => props.icon,
      () => {
        src.value = props.icon;
        tries.value = 0;
      }
    );
    const loadDefault = (event) => {
      tries.value += 1;
      if (tries.value > 3) {
        event.target.src = iconUrlBackup.value;
      } else {
        src.value = `${props.icon}?retry=${tries.value}`;
      }
    };
    onBeforeMount(async () => {
      try {
        const WAFData = await getWAFData();
        if (WAFData) {
          src.value = WAFData.proxifyUrl(props.icon, { proxy: "passport" }) || props.icon;
        }
      } catch (error) {
        console.error("Error loading icon", error);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        "icon-src": __props.icon,
        class: normalizeClass([{ "cursor-pointer": __props.isLink }, "INTFCenter-notification-notificon"]),
        onClick: goToLink
      }, [
        createBaseVNode("img", {
          class: normalizeClass([{ "INTFCenter-IconRadius": __props.type === "login" || "url", "INTFCenter-mergeIcon": __props.merge }, "INTFCenter-bodyIcon"]),
          src: src.value.length > 0 ? src.value : iconUrlBackup.value,
          onError: loadDefault
        }, null, 42, _hoisted_2$n),
        __props.group ? (openBlock(), createElementBlock("div", _hoisted_3$e, _hoisted_5$6)) : createCommentVNode("", true)
      ], 10, _hoisted_1$v);
    };
  }
};
const _hoisted_1$u = { class: "INTFCenter-dropdown-menu-div" };
const _hoisted_2$m = /* @__PURE__ */ createBaseVNode("span", { class: "fonticon fonticon-chevron-down INTFCenter-menu-icon" }, null, -1);
const _sfc_main$y = {
  __name: "NotificationMenu",
  props: {
    options: Object,
    isRead: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const store = useNotificationsStore();
    const scroller = computed(() => store.scrollerBody);
    const menuAction = ref(false);
    const selectedAction = ref([]);
    const openMenu = () => {
      menuAction.value = true;
    };
    return (_ctx, _cache) => {
      const _component_vu_btn = resolveComponent("vu-btn");
      const _component_vu_dropdownmenu = resolveComponent("vu-dropdownmenu");
      return openBlock(), createElementBlock("div", _hoisted_1$u, [
        createVNode(_component_vu_dropdownmenu, {
          modelValue: selectedAction.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedAction.value = $event),
          attach: scroller.value,
          items: __props.options,
          position: "bottom-right",
          onClose: _cache[1] || (_cache[1] = ($event) => menuAction.value = false)
        }, {
          default: withCtx(() => [
            createVNode(_component_vu_btn, {
              class: normalizeClass([{
                "INTFCenter-btn-active": menuAction.value,
                "INTFCenter-btn-hover": !menuAction.value,
                "INTFCenter-is-read": __props.isRead
              }, "INTFCenter-btn-transparent INTFCenter-menu-btn"]),
              large: "",
              onClick: openMenu
            }, {
              default: withCtx(() => [
                _hoisted_2$m
              ]),
              _: 1
            }, 8, ["class"])
          ]),
          _: 1
        }, 8, ["modelValue", "attach", "items"])
      ]);
    };
  }
};
const _hoisted_1$t = { class: "INTFCenter-actions-container" };
const _hoisted_2$l = { key: 0 };
const _sfc_main$x = {
  __name: "NotificationActions",
  props: {
    isActioned: {
      type: Boolean,
      default: false
    },
    actionedLabel: {
      type: String,
      default: ""
    },
    actions: Object,
    isRead: {
      type: Boolean,
      default: false
    },
    denyDisabled: {
      type: Boolean,
      default: false
    },
    selectDisabled: {
      type: Boolean,
      default: false
    },
    isSelect: {
      type: Boolean,
      default: false
    },
    isButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ["deny", "accept"],
  setup(__props, { emit: __emit }) {
    const { $i18n: $i18n2 } = useTranslations();
    const emit2 = __emit;
    const props = __props;
    const target = ref(null);
    const requestLabel = computed(() => {
      if (props.actionedLabel && typeof props.actionedLabel === "string") {
        if (props.actionedLabel.indexOf("NLS") === -1) {
          return props.actionedLabel;
        }
        const dotIndex = props.actionedLabel.indexOf(".");
        return $i18n2(props.actionedLabel.substring(dotIndex + 1));
      }
      return $i18n2(actionLabel);
    });
    const acceptLabel = computed(() => {
      var _a3, _b2, _c3, _d3;
      const findOptions = props.isSelect ? (_c3 = (_b2 = (_a3 = props.actions.find((action) => action.type === "select")) == null ? void 0 : _a3.options) == null ? void 0 : _b2.event) == null ? void 0 : _c3.options[0] : (_d3 = props.actions[0]) == null ? void 0 : _d3.options;
      return (findOptions == null ? void 0 : findOptions.label) || $i18n2("accept");
    });
    const denyLabel = computed(() => {
      var _a3, _b2;
      const findOptions = props.isSelect ? (_a3 = props.actions.find((action) => action.type === "button")) == null ? void 0 : _a3.options : (_b2 = props.actions[1]) == null ? void 0 : _b2.options;
      return (findOptions == null ? void 0 : findOptions.label) || $i18n2("deny");
    });
    const options = computed(() => {
      const items = [];
      const findAction = props.actions.find((action) => action.type === "select");
      if (findAction) {
        const length = findAction.options.event.options.length;
        for (let i = 1; i < length; i++) {
          items.push({
            text: findAction.options.event.options[i].label,
            fonticon: "",
            label: findAction.options.event.options[i].label,
            handler: (item) => {
              const action = {
                type: findAction.options.event.type,
                subAction: true,
                action: findAction.options.event.options[i]
              };
              acceptAction({ options: action, i });
            }
          });
        }
      }
      return items;
    });
    const acceptAction = ({ options: options2, i }) => {
      emit2("accept", { options: options2, i });
    };
    const denyAction = () => {
      const findAction = props.isSelect ? props.actions.find((action) => action.type === "button") : props.actions[1];
      if (findAction) {
        const action = {
          type: findAction.options.event.type,
          action: findAction
        };
        emit2("deny", action);
      }
    };
    const btnDrop = () => {
      acceptAction({
        options: {
          type: props.actions[0].options.event.type,
          subAction: true,
          action: props.actions[0].options.event.options[0]
        },
        i: 0
      });
    };
    const btnAccept = () => {
      acceptAction({
        options: {
          type: props.actions[0].options.event.type,
          subAction: false,
          action: props.actions[0].options.event.options
        },
        i: 0
      });
    };
    return (_ctx, _cache) => {
      const _component_vu_btn_dropdown = resolveComponent("vu-btn-dropdown");
      const _component_vu_btn = resolveComponent("vu-btn");
      return openBlock(), createElementBlock("div", _hoisted_1$t, [
        __props.isActioned ? (openBlock(), createElementBlock("div", _hoisted_2$l, [
          createBaseVNode("strong", null, toDisplayString(requestLabel.value), 1)
        ])) : (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(["INTFCenter-notification-request-action", { disabled: __props.selectDisabled || __props.denyDisabled }])
        }, [
          createBaseVNode("div", {
            ref_key: "target",
            ref: target,
            class: "INTFCenter-action-request"
          }, [
            __props.isSelect ? (openBlock(), createBlock(_component_vu_btn_dropdown, {
              key: 0,
              onClick: btnDrop,
              position: "bottom-right",
              responsive: true,
              attach: target.value,
              color: "primary",
              class: "INTFCenter-request-action-btn-vuekit",
              options: options.value
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(acceptLabel.value), 1)
              ]),
              _: 1
            }, 8, ["attach", "options"])) : __props.isButton ? (openBlock(), createBlock(_component_vu_btn, {
              key: 1,
              small: "",
              onClick: btnAccept,
              position: "bottom-right",
              responsive: true,
              attach: target.value,
              color: "primary",
              class: "INTFCenter-request-action-btn-vuekit"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(acceptLabel.value), 1)
              ]),
              _: 1
            }, 8, ["attach"])) : createCommentVNode("", true)
          ], 512),
          createVNode(_component_vu_btn, {
            small: "",
            class: normalizeClass([{ "INTFCenter-is-read": __props.isRead }, "INTFCenter-deny-btn"]),
            onClick: denyAction
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(denyLabel.value), 1)
            ]),
            _: 1
          }, 8, ["class"])
        ], 2))
      ]);
    };
  }
};
const _sfc_main$w = {
  __name: "NotificationDate",
  props: {
    date: String,
    time: String,
    isRead: {
      type: Boolean,
      default: false
    },
    isMerge: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return __props.isMerge ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["font-semibold INTFCenter-color-brown INTFCenter-merge-date-component", { "INTFCenter-is-read": __props.isRead }])
      }, [
        createBaseVNode("span", {
          class: normalizeClass(["fonticon fonticon-clock INTFCenter-merge-time", { "INTFCenter-is-read": __props.isRead }])
        }, null, 2),
        createTextVNode(toDisplayString(__props.date) + " - " + toDisplayString(__props.time), 1)
      ], 2)) : (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass([{ "INTFCenter-is-read": __props.isRead }, "INTFCenter-notif-times text-xs INTFCenter-color-brown"])
      }, toDisplayString(__props.date), 3));
    };
  }
};
const _hoisted_1$s = { class: "INTFCenter-notification-message-container" };
const _hoisted_2$k = { class: "INTFCenter-message-merge-date" };
const _hoisted_3$d = ["innerHTML"];
const _sfc_main$v = {
  __name: "NotificationMessage",
  props: {
    notification: Notification$1,
    isExpanded: {
      type: Boolean,
      default: false
    },
    merge: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const formattedDate = ref("");
    const selectDisabled = ref(false);
    const denyDisabled = ref(false);
    const reasonValues = ref(null);
    const actionAfterFetch = ref(false);
    const iAfterFetch = ref(-1);
    const messageLink = ref("");
    const action = ref(null);
    const isMergesFetched = computed(() => {
      return props.notification.isGroup === true && props.notification.mergesFetched === true;
    });
    watch(isMergesFetched, (newVal) => {
      if (newVal) {
        if (actionAfterFetch.value) {
          if (iAfterFetch.value !== -1) {
            const { executeActionSelect } = useNotificationActions();
            executeActionSelect(props.notification, iAfterFetch.value);
          } else {
            const { executeDeny } = useNotificationActions();
            executeDeny(props.notification, reasonValues.value);
          }
          iAfterFetch.value = -1;
          actionAfterFetch.value = false;
        }
      }
    });
    const isFirstActionSelect = computed(() => {
      var _a3, _b2;
      if (((_b2 = (_a3 = props == null ? void 0 : props.notification) == null ? void 0 : _a3.MESSAGE) == null ? void 0 : _b2.actions) && props.notification.MESSAGE.actions.length > 0) {
        return props.notification.MESSAGE.actions[0].type === "select";
      }
      return false;
    });
    const isFirstActionButton = computed(() => {
      var _a3, _b2;
      if (((_b2 = (_a3 = props == null ? void 0 : props.notification) == null ? void 0 : _a3.MESSAGE) == null ? void 0 : _b2.actions) && props.notification.MESSAGE.actions.length > 0) {
        return props.notification.MESSAGE.actions[0].type === "button";
      }
      return false;
    });
    const fetchMergeDate = async () => {
      let date = new Date(props.notification.CREATION_DATE.getTime());
      date.setHours(0, 0, 0, 0);
      const formatted = await getDateMergeFormat(new Date(date.getTime()));
      formattedDate.value = formatted;
    };
    onMounted(() => {
      fetchMergeDate();
    });
    const navigateToLink = () => {
      if (isMessageLink()) {
        const { NavigateToLink } = useNotificationActions();
        const { centerActionTracker } = NotificationTrackerUsage();
        NavigateToLink(props.notification, action);
        centerActionTracker().notifClick();
      }
    };
    const handleContainerClick = (event) => {
      if (event.target.classList.contains("toggle-link")) {
        event.stopPropagation();
        props.isExpanded = !props.isExpanded;
      } else {
        navigateToLink();
      }
    };
    const formattedMessage = computed(() => {
      const message = props.notification.MESSAGE.nls.msg;
      const maxLength = 256;
      let result = props.isExpanded ? message : message.length > maxLength ? message.slice(0, maxLength) + "..." : message;
      if (message.length > maxLength) {
        result += "<a href='#' class='toggle-link'>" + (props.isExpanded ? " View Less" : " View More") + "</a>";
      }
      return result;
    });
    const isMessageLink = () => {
      const { noticationMessageIsLink } = useNotificationActions();
      const { option, isLink } = noticationMessageIsLink(props.notification.MESSAGE.actions);
      if (isLink) {
        messageLink.value = option.options.event.options.url;
        action.value = option;
        return true;
      }
      return false;
    };
    const _acceptAction = ({ options, i }) => {
      const { acceptAction } = useNotificationActions();
      acceptAction(props.notification, { options, i }, selectDisabled, actionAfterFetch, iAfterFetch);
    };
    const _denyAction = (options) => {
      const { denyAction } = useNotificationActions();
      denyAction(props.notification, options, reasonValues, denyDisabled, actionAfterFetch);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$s, [
        createBaseVNode("div", _hoisted_2$k, [
          createBaseVNode("div", {
            class: normalizeClass(["INTFCenter-color-brown INTFCenter-notification-message", { "cursor-pointer": isMessageLink() }]),
            onClick: handleContainerClick,
            innerHTML: formattedMessage.value
          }, null, 10, _hoisted_3$d),
          __props.merge ? (openBlock(), createBlock(_sfc_main$w, {
            key: 0,
            date: formattedDate.value,
            "is-merge": true,
            "is-read": __props.notification.isRead,
            time: __props.notification.getHourMinutes()
          }, null, 8, ["date", "is-read", "time"])) : createCommentVNode("", true)
        ]),
        isFirstActionSelect.value || isFirstActionButton.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass({ "self-end": !__props.notification.isActioned })
        }, [
          createVNode(_sfc_main$x, {
            "select-disabled": selectDisabled.value,
            "deny-disabled": denyDisabled.value,
            "is-actioned": __props.notification.isActioned,
            "actioned-label": __props.notification.ACTION,
            "is-read": __props.notification.isRead,
            actions: __props.notification.MESSAGE.actions,
            "is-select": isFirstActionSelect.value,
            "is-button": isFirstActionButton.value,
            onAccept: _acceptAction,
            onDeny: _denyAction
          }, null, 8, ["select-disabled", "deny-disabled", "is-actioned", "actioned-label", "is-read", "actions", "is-select", "is-button"])
        ], 2)) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$r = { class: "INTFCenter-notifBody-section" };
const _sfc_main$u = {
  __name: "NotificationBody",
  props: {
    notification: Notification$1,
    // In notification center or outside of it.
    center: {
      type: Boolean,
      default: true
    },
    // Is being shown in merge group
    merge: {
      type: Boolean,
      default: false
    },
    // to show or not show menu button
    menu: { type: Boolean, default: true }
    // whitespace: { type: Boolean, default: false },
  },
  setup(__props) {
    const store = useNotificationsStore();
    const notifBody = ref(null);
    const props = __props;
    const icon = computed(() => {
      var _a3;
      return ((_a3 = props.notification.MESSAGE.icon) == null ? void 0 : _a3.src) ? props.notification.MESSAGE.icon.src : "./../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png";
    });
    onMounted(() => {
      store.setScrollerBody(notifBody.value);
      if (props.notification.isActioned) {
        const { updateActionedLabel } = useNotificationActions();
        updateActionedLabel(props.notification, props.notification.ACTION, false);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "notifBody",
        ref: notifBody,
        class: "INTFCenter-notifBody"
      }, [
        createBaseVNode("div", _hoisted_1$r, [
          createBaseVNode("div", {
            class: normalizeClass([{ "INTFCenter-is-read": __props.notification.isRead }, "INTFCenter-notifBody-container"])
          }, [
            createVNode(_sfc_main$z, {
              id: __props.notification.ID,
              merge: __props.merge,
              "is-link": __props.notification.isIconLink,
              group: __props.notification.isGroup,
              icon: icon.value,
              type: __props.notification.MESSAGE.icon.type
            }, null, 8, ["id", "merge", "is-link", "group", "icon", "type"]),
            createVNode(_sfc_main$v, {
              notification: __props.notification,
              merge: __props.merge
            }, null, 8, ["notification", "merge"])
          ], 2),
          __props.menu ? (openBlock(), createBlock(_sfc_main$y, {
            key: 0,
            "is-read": __props.notification.isRead,
            options: __props.notification.getOptions
          }, null, 8, ["is-read", "options"])) : createCommentVNode("", true)
        ])
      ], 512);
    };
  }
};
const _hoisted_1$q = { class: "INTFCenter-notif-status" };
const _hoisted_2$j = {
  key: 2,
  class: "INTFCenter-notification-important fonticon fonticon-favorite-off"
};
const _hoisted_3$c = {
  key: 3,
  class: "INTFCenter-notification-important fonticon fonticon-favorite-on font-semibold"
};
const _sfc_main$t = {
  __name: "NotificationStatus",
  props: {
    isRead: false,
    isStarred: false,
    notification: Notification$1
  },
  setup(__props) {
    const props = __props;
    const notificationMenu = useNotificationMenu();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$q, [
        __props.isRead && !__props.isStarred ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["INTFCenter-read-unread INTFCenter-notification-read", "cursor-pointer"]),
          onClick: _cache[0] || (_cache[0] = ($event) => unref(notificationMenu).setNotificationRead(props.notification))
        })) : createCommentVNode("", true),
        !__props.isRead && !__props.isStarred ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(["INTFCenter-read-unread INTFCenter-notification-unread", "cursor-pointer"]),
          onClick: _cache[1] || (_cache[1] = ($event) => unref(notificationMenu).setNotificationRead(props.notification))
        })) : createCommentVNode("", true),
        __props.isRead && __props.isStarred ? (openBlock(), createElementBlock("span", _hoisted_2$j)) : createCommentVNode("", true),
        !__props.isRead && __props.isStarred ? (openBlock(), createElementBlock("span", _hoisted_3$c)) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$p = { class: "INTFCenter-notification-is-deleted" };
const _hoisted_2$i = { class: "INTFCenter-deleted-text INTFCenter-color-brown" };
const _hoisted_3$b = /* @__PURE__ */ createBaseVNode("span", { class: "fonticon fonticon-reload" }, null, -1);
const _hoisted_4$8 = { class: "INTFCenter-deletion-msg" };
const _sfc_main$s = {
  __name: "NotificationDeleted",
  props: {
    id: String
  },
  emits: ["cancelDeletion"],
  setup(__props, { emit: __emit }) {
    const { $i18n: $i18n2 } = useTranslations();
    const emit2 = __emit;
    const props = __props;
    const cancelDeletion = () => {
      emit2("cancelDeletion", props.id);
    };
    return (_ctx, _cache) => {
      const _component_vu_btn = resolveComponent("vu-btn");
      return openBlock(), createElementBlock("div", _hoisted_1$p, [
        createBaseVNode("p", _hoisted_2$i, toDisplayString(unref($i18n2)("notificationDeleted")), 1),
        createVNode(_component_vu_btn, {
          color: "primary",
          small: "",
          class: "INTFCenter-cancel-btn",
          onClick: cancelDeletion
        }, {
          default: withCtx(() => [
            _hoisted_3$b,
            createBaseVNode("span", _hoisted_4$8, toDisplayString(unref($i18n2)("cancel")), 1)
          ]),
          _: 1
        })
      ]);
    };
  }
};
const _hoisted_1$o = {
  key: 0,
  class: "INTFCenter-notification-group"
};
const _hoisted_2$h = { class: "INTFCenter-view-merge-div" };
const _hoisted_3$a = { class: "INTFCenter-show-hide-merges" };
const _hoisted_4$7 = {
  key: 0,
  class: "INTFCenter-color-3ds INTFCenter-view-group"
};
const _hoisted_5$5 = {
  key: 1,
  class: "INTFCenter-color-3ds INTFCenter-view-group"
};
const _hoisted_6$5 = {
  key: 0,
  class: "INTFCenter-open-spinner"
};
const _hoisted_7$4 = {
  key: 0,
  class: "INTFCenter-group-div"
};
const _sfc_main$r = {
  __name: "NotificationMergesList",
  props: {
    mainId: String,
    groupId: String,
    isRead: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const { cancelDeletion } = useNotificationManagement();
    const { centerActionTracker } = NotificationTrackerUsage();
    const theCenterActionTracker = centerActionTracker();
    const store = useNotificationsStore();
    const { getFilter } = useFilterStore();
    const components = {
      NotificationBody: _sfc_main$u,
      NotificationDeleted: _sfc_main$s
    };
    const props = __props;
    const opened = ref(false);
    const mergeIndex = ref(0);
    const openRequested = ref(false);
    const getMainNotification = computed(() => {
      return store.getNotificationById(props.mainId);
    });
    const canOpenMerges = computed(() => {
      return getMainNotification.value.mergesFetched === true;
    });
    const allMerges = computed(() => {
      const groupSection = store.groups.get(props.groupId);
      return groupSection;
    });
    const groupMerges = computed(() => {
      return allMerges.value.slice(0, mergeIndex.value + 10);
    });
    watch(canOpenMerges, (newVal) => {
      if (newVal && openRequested.value) {
        opened.value = true;
        openRequested.value = false;
      }
    });
    watch(opened, () => {
      if (!opened.value) {
        mergeIndex.value = 0;
      }
    });
    const getMerges = () => {
      if (!getMainNotification.value.mergesFetched) {
        getMerge({
          parentNotif: {
            id: getMainNotification.value.ID,
            groupID: getMainNotification.value.GROUPID,
            clusterId: getMainNotification.value.CLUSTERID,
            archive: getMainNotification.value.ARCHIVE,
            ignoreSearchesForChildren: !!getMainNotification.value.ignoreSearchesForChildren
          },
          filterData: getFilter()
        });
        openRequested.value = true;
        theCenterActionTracker.viewAllMergeNotif({ nbMerge: getMainNotification.value.COUNT });
      } else {
        opened.value = !opened.value;
        if (opened.value) {
          theCenterActionTracker.viewAllMergeNotif({ nbMerge: getMainNotification.value.COUNT });
        } else {
          theCenterActionTracker.hideAllMergeNotif({ nbMerge: getMainNotification.value.COUNT });
        }
      }
    };
    const seeMoreMerge = () => {
      mergeIndex.value += 10;
    };
    return (_ctx, _cache) => {
      const _component_vu_spinner = resolveComponent("vu-spinner");
      const _component_vu_btn = resolveComponent("vu-btn");
      return getMainNotification.value ? (openBlock(), createElementBlock("div", _hoisted_1$o, [
        createVNode(_component_vu_btn, {
          class: normalizeClass([{ "INTFCenter-is-read": __props.isRead }, "INTFCenter-view-btn"]),
          small: "",
          onClick: getMerges
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_2$h, [
              createBaseVNode("span", {
                class: normalizeClass(["fonticon INTFCenter-color-brown fonticon-expand-right", {
                  "INTFCenter-merges-opened": opened.value,
                  "INTFCenter-merges-closed": !opened.value
                }])
              }, null, 2),
              createBaseVNode("div", _hoisted_3$a, [
                !opened.value ? (openBlock(), createElementBlock("span", _hoisted_4$7, toDisplayString(unref($i18n2)("viewAll")), 1)) : (openBlock(), createElementBlock("span", _hoisted_5$5, toDisplayString(unref($i18n2)("hideAll")), 1))
              ]),
              openRequested.value ? (openBlock(), createElementBlock("span", _hoisted_6$5, [
                createVNode(_component_vu_spinner)
              ])) : createCommentVNode("", true)
            ])
          ]),
          _: 1
        }, 8, ["class"]),
        createVNode(Transition, { name: "merge-list" }, {
          default: withCtx(() => [
            opened.value ? (openBlock(), createElementBlock("div", _hoisted_7$4, [
              createVNode(TransitionGroup, { name: "list" }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(groupMerges.value, (merge) => {
                    return openBlock(), createElementBlock("div", {
                      key: merge.id
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(components[unref(store).getMergeById(merge.id).deleted ? "NotificationDeleted" : "NotificationBody"]), {
                        id: merge.id,
                        key: `${merge.id} - merge`,
                        merge: true,
                        class: "INTFCenter-group-body",
                        notification: unref(store).getMergeById(merge.id),
                        onCancelDeletion: _cache[0] || (_cache[0] = (id2) => unref(cancelDeletion)(id2, true))
                      }, null, 40, ["id", "notification"]))
                    ]);
                  }), 128))
                ]),
                _: 1
              }),
              groupMerges.value.length < allMerges.value.length ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass({ "INTFCenter-is-read": __props.isRead })
              }, [
                createBaseVNode("span", {
                  class: "INTFCenter-color-3ds INTFCenter-view-group cursor-pointer",
                  onClick: seeMoreMerge
                }, toDisplayString(unref($i18n2)("viewMore")), 1)
              ], 2)) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ])) : createCommentVNode("", true);
    };
  }
};
const _hoisted_1$n = /* @__PURE__ */ createBaseVNode("span", { class: "fonticon fonticon-status-ok text-2xl" }, null, -1);
const _hoisted_2$g = [
  _hoisted_1$n
];
const _sfc_main$q = {
  __name: "SelectWrapper",
  props: {
    id: String
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    const props = __props;
    const store = useNotificationsStore();
    const select = ref(false);
    const applySelect = () => {
      if (select.value) {
        select.value = false;
        store.selected.splice(store.selected.indexOf(props.id), 1);
      } else {
        select.value = true;
        if (!store.selected.includes(props.id)) store.selected.push(props.id);
      }
      emit2("select", select.value);
    };
    watch(
      () => store.selected.length,
      (_) => {
        if (store.selected.includes(props.id)) select.value = true;
        else select.value = false;
        emit2("select", select.value);
      }
    );
    onBeforeUnmount(() => {
      emit2("select", false);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["INTFCenter-selected-icon", { "INTFCenter-color-3ds": select.value, "INTFCenter-color-brown": !select.value }]),
        onClick: applySelect
      }, _hoisted_2$g, 2);
    };
  }
};
const _hoisted_1$m = { class: "INTFCenter-notification-item" };
const _hoisted_2$f = { class: "INTFCenter-notif-body-ui" };
const _sfc_main$p = {
  __name: "NotificationItem",
  props: {
    notification: Notification$1
  },
  setup(__props) {
    const store = useNotificationsStore();
    const select = ref(false);
    const props = __props;
    const selectionMode = computed(() => {
      return store.selectionMode === true;
    });
    const selected2 = computed(() => {
      return store.selected.includes(props.notification.ID);
    });
    const applySelect = (value) => {
      select.value = value;
    };
    return (_ctx, _cache) => {
      return __props.notification ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["INTFCenter-notification-item-container", { "INTFCenter-notif-is-selected": selected2.value, "INTFCenter-selection-mode-on": selectionMode.value }])
      }, [
        createVNode(TransitionGroup, { name: "wrapper" }, {
          default: withCtx(() => [
            selectionMode.value ? (openBlock(), createBlock(_sfc_main$q, {
              key: 0,
              id: __props.notification.ID,
              onSelect: applySelect
            }, null, 8, ["id"])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_1$m, [
          createVNode(_sfc_main$w, {
            "is-read": __props.notification.isRead,
            date: __props.notification.getHourMinutes()
          }, null, 8, ["is-read", "date"]),
          createBaseVNode("div", {
            class: normalizeClass(["INTFCenter-notif-body " + __props.notification.APPID])
          }, [
            createBaseVNode("div", _hoisted_2$f, [
              createVNode(_sfc_main$t, {
                "is-read": __props.notification.isRead,
                "is-starred": __props.notification.isStarred,
                notification: __props.notification
              }, null, 8, ["is-read", "is-starred", "notification"]),
              createVNode(_sfc_main$u, {
                class: "INTFCenter-notif-body-component",
                notification: __props.notification
              }, null, 8, ["notification"])
            ]),
            __props.notification.isGroup ? (openBlock(), createBlock(_sfc_main$r, {
              key: 0,
              "main-id": __props.notification.ID,
              "is-read": __props.notification.isRead,
              "group-id": __props.notification.GROUPID
            }, null, 8, ["main-id", "is-read", "group-id"])) : createCommentVNode("", true)
          ], 2)
        ])
      ], 2)) : createCommentVNode("", true);
    };
  }
};
const _hoisted_1$l = {
  key: 0,
  class: "INTFCenter-notif-center-timeline-section"
};
const _hoisted_2$e = { class: "INTFCenter-timeline-section-title INTFCenter-color-brown" };
const _sfc_main$o = {
  __name: "SectionItem",
  props: {
    section: Section
  },
  setup(__props) {
    const { getNotificationById } = useNotificationsStore();
    const { cancelDeletion } = useNotificationManagement();
    const components = {
      NotificationItem: _sfc_main$p,
      NotificationDeleted: _sfc_main$s
    };
    return (_ctx, _cache) => {
      return __props.section ? (openBlock(), createElementBlock("div", _hoisted_1$l, [
        createBaseVNode("div", _hoisted_2$e, toDisplayString(__props.section.title), 1),
        createVNode(TransitionGroup, { name: "list" }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.section.notifs, (item) => {
              return openBlock(), createElementBlock("div", {
                key: item.id,
                class: "INTFCenter-section-notification-container"
              }, [
                createVNode(Transition, { name: "notification" }, {
                  default: withCtx(() => [
                    (openBlock(), createBlock(resolveDynamicComponent(components[unref(getNotificationById)(item.id).deleted ? "NotificationDeleted" : "NotificationItem"]), {
                      id: item.id,
                      key: item.id,
                      notification: unref(getNotificationById)(item.id),
                      onCancelDeletion: _cache[0] || (_cache[0] = (id2) => unref(cancelDeletion)(id2))
                    }, null, 40, ["id", "notification"]))
                  ]),
                  _: 2
                }, 1024)
              ]);
            }), 128))
          ]),
          _: 1
        })
      ])) : createCommentVNode("", true);
    };
  }
};
const _sfc_main$n = {
  __name: "SectionList",
  setup(__props) {
    const store = useNotificationsStore();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(TransitionGroup, { name: "list" }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(store).sectionListIds, (id2) => {
            return openBlock(), createBlock(_sfc_main$o, {
              key: id2,
              section: unref(store).sectionList.get(id2)
            }, null, 8, ["section"]);
          }), 128))
        ]),
        _: 1
      });
    };
  }
};
const { $i18n } = useTranslations();
const markSelectedAsRead = (read2) => {
  const { multipleSelectionActionTracker } = NotificationTrackerUsage();
  const { getSelected, getNotificationById } = useNotificationsStore();
  const selected2 = getSelected();
  let length = 0;
  selected2.forEach((id2) => {
    const notification = getNotificationById(id2);
    if (notification.isRead !== read2) {
      length++;
      const data = {
        action: "notificationRead",
        id: notification.ID,
        clusterId: notification.CLUSTER_ID,
        archive: !!notification.FROM_ARCHIVE,
        read: read2,
        ...notification.isGroup && { groupID: notification.GROUPID, hiddenMerged: true }
      };
      notificationRead(data);
    }
  });
  multipleSelectionActionTracker().readSelectedNotifications({ read: read2, length });
};
const markSelectedAsStarred = (starred2) => {
  const { multipleSelectionActionTracker } = NotificationTrackerUsage();
  const { getSelected, getNotificationById } = useNotificationsStore();
  const selected2 = getSelected();
  let length = 0;
  selected2.forEach((id2) => {
    const notification = getNotificationById(id2);
    if (notification.isStarred !== starred2) {
      length++;
      const data = {
        action: "notificationRead",
        archive: !!notification.FROM_ARCHIVE,
        id: notification.ID,
        starred: "starred",
        param: starred2 ? 1 : 0,
        clusterId: notification.CLUSTER_ID,
        ...notification.isGroup && { groupID: notification.GROUPID, hiddenMerged: true }
      };
      notificationRead(data);
    }
  });
  multipleSelectionActionTracker().starSelectedNotifications({ starred: starred2, length });
};
const unsubscribeSelected = (forHour) => {
  const { multipleSelectionActionTracker } = NotificationTrackerUsage();
  const { getSelected, getNotificationById } = useNotificationsStore();
  const copySelected = [...getSelected()];
  const notifServices = [];
  copySelected.forEach((id2) => {
    const notification = getNotificationById(id2);
    const find = notifServices.find((notif) => notif.SERVICE_ID === notification.SERVICE_ID);
    if (!find) {
      notifServices.push(notification);
    }
  });
  notifServices.forEach((notification) => {
    const data = {
      id: notification.ID,
      subscribe: 0,
      ...forHour === true && { forHour: true }
    };
    unsubscribe(data);
  });
  multipleSelectionActionTracker().unsubscribeSelectedNotifications({ length: copySelected.length });
};
const deleteSelected = () => {
  const { multipleSelectionActionTracker } = NotificationTrackerUsage();
  const { getSelected, getNotificationById } = useNotificationsStore();
  const { tryNotificationDeletion } = useNotificationManagement();
  const { alertConfirmNotice } = usePreferencesManagement();
  alertConfirmNotice(
    {
      title: $i18n("deleteSelectedTitle"),
      msg: $i18n("deleteSelectedMsg")
    },
    (confirmed) => {
      if (confirmed) {
        const copySelected = [...getSelected()];
        copySelected.forEach((id2) => {
          const notification = getNotificationById(id2);
          tryNotificationDeletion(
            notification.ID,
            notification.isMerge,
            notification.isGroup,
            !!notification.FROM_ARCHIVE,
            false
            // do not show the cancelation component
          );
        });
        multipleSelectionActionTracker().deleteSelectedNotifications({ length: copySelected.length });
      }
    }
  );
};
const selectMenuDisabled = (selectAllNotification) => {
  return [
    {
      fonticon: "",
      name: "selectAll",
      text: $i18n("selectAll"),
      handler: (item) => {
        selectAllNotification();
      }
    },
    {
      class: "divider"
    },
    {
      fonticon: "fonticon fonticon-bell-alt",
      name: "read",
      disabled: true,
      text: $i18n("markSelectedAsRead")
    },
    {
      fonticon: "fonticon fonticon-bell",
      name: "read",
      disabled: true,
      text: $i18n("markSelectedAsUnread")
    },
    {
      fonticon: "fonticon fonticon-star",
      name: "important",
      disabled: true,
      text: $i18n("markSelectedAsStarred")
    },
    {
      fonticon: "fonticon fonticon-favorite-off",
      name: "important",
      text: $i18n("markSelectedAsUnstarred"),
      disabled: true
    },
    {
      class: "divider"
    },
    {
      fonticon: "fonticon fonticon-list-delete",
      name: "unsubscribe",
      disabled: true,
      text: $i18n("unsubscribeSelected")
    },
    {
      fonticon: "fonticon fonticon-trash",
      text: $i18n("deleteSelected"),
      disabled: true,
      name: "delete"
    }
  ];
};
const selectMenu = (canSelectMore, allSelected, moreThanOneSelected, selectAll2, unSelectAll, canMarkAsStarredMore, canMarkSelectedAsUnstarred, canMarkAllAsRead, canMarkAllAsUnread) => {
  const { multipleSelectionActionTracker } = NotificationTrackerUsage();
  let menu = [];
  const firstOption = {
    fonticon: "",
    name: "selectAll",
    text: canSelectMore ? $i18n("selectAll") : $i18n("unselectAll"),
    handler: (item) => {
      if (item.text === $i18n("unselectAll")) {
        unSelectAll();
        multipleSelectionActionTracker().selectionAction({ action: "unselectAllNotifications", length: 0 });
        item.text = $i18n("selectAll");
      } else {
        selectAll2();
        item.text = $i18n("unselectAll");
      }
    }
  };
  menu.push(firstOption);
  menu.push({
    class: "divider"
  });
  if (moreThanOneSelected) {
    const restOfMenu = [
      {
        fonticon: "fonticon fonticon-bell-alt",
        name: "read",
        text: $i18n("markSelectedAsRead"),
        disabled: !canMarkAllAsRead.value,
        handler: (item) => {
          markSelectedAsRead(true);
          item.disabled = true;
        }
      },
      {
        fonticon: "fonticon fonticon-bell",
        name: "read",
        text: $i18n("markSelectedAsUnread"),
        disabled: !canMarkAllAsUnread.value,
        handler: (item) => {
          markSelectedAsRead(false);
          item.disabled = true;
        }
      },
      {
        fonticon: "fonticon fonticon-star",
        name: "important",
        text: $i18n("markSelectedAsStarred"),
        disabled: !canMarkAsStarredMore.value,
        handler: (item) => {
          markSelectedAsStarred(true);
          item.disabled = true;
        }
      },
      {
        fonticon: "fonticon fonticon-favorite-off",
        name: "important",
        text: $i18n("markSelectedAsUnstarred"),
        disabled: !canMarkSelectedAsUnstarred.value,
        handler: (item) => {
          markSelectedAsStarred(false);
          item.disabled = true;
        }
      },
      {
        class: "divider"
      },
      {
        fonticon: "fonticon fonticon-list-delete",
        name: "unsubscribe",
        text: $i18n("unsubscribeSelected"),
        items: [
          {
            fonticon: "fonticon fonticon-list-delete",
            text: $i18n("unsubscribeForHour"),
            name: "anHour",
            handler: (item) => {
              unsubscribeSelected(true);
            }
          },
          {
            fonticon: "fonticon fonticon-list-delete",
            text: $i18n("unsubscribeIndefinitely"),
            name: "indefinetly",
            handler: (item) => {
              unsubscribeSelected(false);
            }
          }
        ]
      },
      {
        fonticon: "fonticon fonticon-trash",
        text: $i18n("deleteSelected"),
        name: "delete",
        handler: (item) => {
          deleteSelected();
        }
      }
    ];
    menu = menu.concat(restOfMenu);
  }
  const menuItems = ref(menu);
  return menuItems.value;
};
const readAllNotifications = (read2) => {
  const { settingIconActionTracker } = NotificationTrackerUsage();
  const iconsActionTracker = settingIconActionTracker();
  const { isFilterApplied, getFilter } = useFilterStore();
  const { filterNotifIds } = useNotificationsStore();
  if (isFilterApplied()) {
    notificationRead({
      action: "notificationRead",
      read: read2,
      scope: true,
      filter: true,
      filterData: getFilter(),
      filterNotifIds
    });
    read2 ? iconsActionTracker.readAllFilteredNotifications() : iconsActionTracker.unreadAllFilteredNotifications();
  } else {
    notificationRead({ action: "notificationRead", read: read2, scope: true, filter: false });
    read2 ? iconsActionTracker.readAllNotifications() : iconsActionTracker.unreadAllNotifications();
  }
};
const settingsMenu = () => {
  const { isEmpty } = useNotificationsStore();
  const { isTenantAgnostic, getCurrentTenant, hidePlatformSelection, setCenterShow } = useSettingsStore();
  const { alertConfirmNotice } = usePreferencesManagement();
  const { isFilterApplied } = useFilterStore();
  const { settingIconActionTracker } = NotificationTrackerUsage();
  const iconsActionTracker = settingIconActionTracker();
  const readAll = {
    fonticon: "",
    name: "readAll",
    text: isFilterApplied() ? $i18n("markAllFilterAsRead") : $i18n("markAllAsRead"),
    disabled: isEmpty,
    handler: (item) => {
      readAllNotifications(true);
    }
  };
  const unreadAll = {
    fonticon: "",
    name: "unreadAll",
    text: isFilterApplied() ? $i18n("markAllFilterAsUnread") : $i18n("markAllAsUnread"),
    disabled: isEmpty,
    handler: (item) => {
      readAllNotifications(false);
    }
  };
  const deleteAll2 = {
    fonticon: "",
    name: "deleteAll",
    text: isFilterApplied() ? $i18n("deleteFilteredNotif") : $i18n("deleteAll"),
    disabled: isEmpty,
    handler: (item) => {
      alertConfirmNotice(
        {
          title: isFilterApplied() ? $i18n("deleteFilteredTitle") : $i18n("deleteAllTitle"),
          msg: isFilterApplied() ? $i18n("deleteFilteredMsg") : $i18n("deleteAllMsg"),
          cancelLabel: $i18n("cancel")
        },
        (confirmed) => {
          if (confirmed) {
            if (isFilterApplied()) {
              const { filterNotifIds } = useNotificationsStore();
              const { getFilter } = useFilterStore();
              deleteAllFilteredNotification$1({
                notificationID: filterNotifIds,
                filterData: getFilter()
              });
              iconsActionTracker.deleteAllFilteredNotifications();
            } else {
              deleteAllNotification$1();
              iconsActionTracker.deleteAllNotifications();
            }
          }
        }
      );
    }
  };
  const selectPlatform = {
    fonticon: "",
    name: "tenantAgnosticMode",
    text: $i18n("notificationsDisplay"),
    items: [
      {
        fonticon: "",
        text: $i18n("currentPlatform"),
        name: "currentPlatform",
        selected: !isTenantAgnostic,
        handler: (item) => {
          updateTenantAgnosticMode({
            isTenantAgnostic: 0,
            hidePlatformSelection
          });
          iconsActionTracker.switchTenantNotifications({
            tenant: getCurrentTenant() ?? "current",
            persDim: {
              pd1: getCurrentTenant() ?? "current"
            }
          });
        }
      },
      {
        fonticon: "",
        text: $i18n("allPlatforms"),
        name: "allPlatforms",
        selected: isTenantAgnostic,
        handler: (item) => {
          updateTenantAgnosticMode({
            isTenantAgnostic: 1,
            hidePlatformSelection
          });
          iconsActionTracker.switchTenantNotifications({
            tenant: "all",
            persDim: {
              pd1: "all"
            }
          });
        }
      }
    ]
  };
  const preferences2 = {
    fonticon: "",
    name: "preferences",
    text: $i18n("preferencesMenu"),
    handler: (item) => {
      setCenterShow(false);
      iconsActionTracker.invokenotifSettingView();
    }
  };
  const menu = [
    // actions on all notifications
    readAll,
    unreadAll,
    deleteAll2,
    // platform selection
    ...hidePlatformSelection ? [] : [selectPlatform],
    // preferences
    {
      class: "divider"
    },
    preferences2
  ];
  return menu;
};
const _hoisted_1$k = { class: "INTFCenter-filter-tool" };
const _hoisted_2$d = /* @__PURE__ */ createBaseVNode("span", { class: "fonticon fonticon-filter INTFCenter-toolbar-icon" }, null, -1);
const _sfc_main$m = {
  __name: "Filter",
  setup(__props) {
    const storeFilter = useFilterStore();
    const opened = computed(() => {
      return storeFilter.opened;
    });
    const { $i18n: $i18n2 } = useTranslations();
    const setOpened = () => {
      const { notificationFilterViewTracker } = NotificationTrackerUsage();
      const filterViewTracker = notificationFilterViewTracker();
      if (opened.value) {
        storeFilter.setOpened(false);
        filterViewTracker.clicknotifFilterIconToHide();
      } else {
        storeFilter.setOpened(true);
        filterViewTracker.clicknotifFilterIconToShow();
      }
    };
    return (_ctx, _cache) => {
      const _component_vu_btn = resolveComponent("vu-btn");
      const _directive_tooltip = resolveDirective("tooltip");
      return openBlock(), createElementBlock("div", _hoisted_1$k, [
        withDirectives((openBlock(), createBlock(_component_vu_btn, {
          large: "",
          class: normalizeClass([{
            "INTFCenter-btn-active": opened.value || unref(storeFilter).applied,
            "INTFCenter-btn-hover": !opened.value && !unref(storeFilter).applied
          }, "INTFCenter-btn-transparent INTFCenter-filter-btn"]),
          onClick: setOpened
        }, {
          default: withCtx(() => [
            _hoisted_2$d
          ]),
          _: 1
        }, 8, ["class"])), [
          [
            _directive_tooltip,
            unref($i18n2)("filter"),
            void 0,
            { left: true }
          ]
        ])
      ]);
    };
  }
};
const _hoisted_1$j = { class: "INTFCenter-select-notification" };
const _hoisted_2$c = ["title"];
const _sfc_main$l = {
  __name: "SelectTool",
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const store = useNotificationsStore();
    const activateSelectionMode = () => {
      const { multipleSelectionActionTracker } = NotificationTrackerUsage();
      const selectionModeTracker = multipleSelectionActionTracker();
      store.selectionMode = !store.selectionMode;
      store.selectionMode ? selectionModeTracker.enableSelection() : selectionModeTracker.disableSelection();
    };
    const length = computed(() => {
      return store.selected.length;
    });
    const lengthText = computed(() => {
      return length.value > 99 ? "99+" : length.value;
    });
    return (_ctx, _cache) => {
      const _component_vu_btn = resolveComponent("vu-btn");
      const _directive_tooltip = resolveDirective("tooltip");
      return openBlock(), createElementBlock("div", _hoisted_1$j, [
        withDirectives((openBlock(), createBlock(_component_vu_btn, {
          large: "",
          class: normalizeClass([{ "INTFCenter-btn-active": unref(store).selectionMode, "INTFCenter-btn-hover": !unref(store).selectionMode }, "INTFCenter-btn-transparent"]),
          onClick: activateSelectionMode
        }, {
          default: withCtx(() => [
            createBaseVNode("span", {
              class: normalizeClass(["fonticon INTFCenter-multi-select-icon", {
                "fonticon-select-off ": !unref(store).selectionMode,
                "fonticon-select-on ": unref(store).selectionMode
              }])
            }, null, 2)
          ]),
          _: 1
        }, 8, ["class"])), [
          [
            _directive_tooltip,
            unref($i18n2)("multiSelection"),
            void 0,
            { left: true }
          ]
        ]),
        withDirectives(createBaseVNode("span", {
          class: "text-xs cursor-default INTFCenter-color-3ds INTFCenter-nb-notif-selected",
          title: `${length.value > 99 ? `${length.value} ${unref($i18n2)("selected")}` : ""}`
        }, toDisplayString(lengthText.value), 9, _hoisted_2$c), [
          [vShow, length.value > 0]
        ])
      ]);
    };
  }
};
const _hoisted_1$i = /* @__PURE__ */ createBaseVNode("span", { class: "fonticon fonticon-cog INTFCenter-toolbar-icon" }, null, -1);
const _sfc_main$k = {
  __name: "Setting",
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const store = useNotificationsStore();
    const settingsStore = useSettingsStore();
    const filterStore = useFilterStore();
    const more = ref(false);
    const setting = ref(null);
    const settingModel = ref([]);
    const menu = ref(settingsMenu());
    watch(
      () => [store.isEmpty, filterStore.isFilterApplied(), settingsStore.hidePlatformSelection],
      () => menu.value = settingsMenu()
    );
    return (_ctx, _cache) => {
      const _component_vu_btn = resolveComponent("vu-btn");
      const _component_vu_dropdownmenu = resolveComponent("vu-dropdownmenu");
      const _directive_tooltip = resolveDirective("tooltip");
      return openBlock(), createElementBlock("div", {
        ref_key: "setting",
        ref: setting,
        class: "INTFCenter-setting-div"
      }, [
        createVNode(_component_vu_dropdownmenu, {
          modelValue: settingModel.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => settingModel.value = $event),
          position: "bottom-right",
          items: menu.value,
          onClose: _cache[2] || (_cache[2] = ($event) => more.value = false)
        }, {
          default: withCtx(() => [
            withDirectives((openBlock(), createBlock(_component_vu_btn, {
              large: "",
              class: normalizeClass([{ "INTFCenter-btn-active": more.value, "INTFCenter-btn-hover": !more.value }, "INTFCenter-btn-transparent INTFCenter-setting-btn"]),
              onClick: _cache[0] || (_cache[0] = ($event) => more.value = true)
            }, {
              default: withCtx(() => [
                _hoisted_1$i
              ]),
              _: 1
            }, 8, ["class"])), [
              [
                _directive_tooltip,
                unref($i18n2)("settings"),
                void 0,
                { left: true }
              ]
            ])
          ]),
          _: 1
        }, 8, ["modelValue", "items"])
      ], 512);
    };
  }
};
const _hoisted_1$h = { class: "INTFCenter-notif-center-toolbar INTFCenter-color-brown text-lg" };
const _hoisted_2$b = { class: "INTFCenter-select-wrapper" };
const _sfc_main$j = {
  __name: "Toolbar",
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const { multipleSelectionActionTracker } = NotificationTrackerUsage();
    const store = useNotificationsStore();
    const selectionMode = computed(() => {
      return store.selectionMode === true;
    });
    const hasNotification = computed(() => {
      return store.notifications.size > 0;
    });
    const allSelected = computed(() => {
      return store.notifications.size === store.selected.length;
    });
    const canSelectMore = computed(() => {
      return store.selected.length < store.notifications.size;
    });
    const nothingSelected = computed(() => {
      return store.selected.length === 0;
    });
    const canMarkAsStarredMore = computed(() => {
      for (const key of store.notifications.keys()) {
        if (store.selected.includes(key) && store.notifications.get(key).STARRED == 0) {
          return store.notifications.get(key).STARRED == 0;
        }
      }
      return store.selected.length === -1;
    });
    const canMarkSelectedAsUnstarred = computed(() => {
      for (const key of store.notifications.keys()) {
        if (store.selected.includes(key) && store.notifications.get(key).STARRED == 1) {
          return store.notifications.get(key).STARRED == 1;
        }
      }
      return store.selected.length === -1;
    });
    const canMarkAllAsRead = computed(() => {
      for (const key of store.notifications.keys()) {
        if (store.selected.includes(key) && store.notifications.get(key).READ_DATE === null) {
          return !store.notifications.get(key).READ_DATE;
        }
      }
      return store.selected.length === -1;
    });
    const canMarkAllAsUnread = computed(() => {
      for (const key of store.notifications.keys()) {
        if (store.selected.includes(key) && store.notifications.get(key).READ_DATE !== null) {
          return store.notifications.get(key).READ_DATE ? true : false;
        }
      }
      return store.selected.length === -1;
    });
    const selectAllNotification = () => {
      for (const key of store.notifications.keys()) {
        if (!store.selected.includes(key) && !store.notifications.get(key).deleted) store.selected.push(key);
      }
      multipleSelectionActionTracker().selectionAction({ action: "selectAllNotifications", length: store.selected.length });
    };
    const menu = ref([]);
    const menuDisabled = ref(selectMenuDisabled(selectAllNotification));
    const unselectAllNotification = () => {
      const length = store.selected.length;
      for (let i = 0; i < length; i++) {
        store.selected.pop();
      }
    };
    watch(canSelectMore, (n) => {
      if (menu.value.length > 0) menu.value[0].text = n ? $i18n2("selectAll") : $i18n2("unselectAll");
      if (menuDisabled.value.length > 0) menuDisabled.value[0].text = n ? $i18n2("selectAll") : $i18n2("unselectAll");
    });
    watch(
      () => store.notifications.get(store.selected[0]),
      (n) => {
        if (store.selected.length === 1) {
          menu.value = selectMenu(
            canSelectMore.value,
            allSelected.value,
            false,
            selectAllNotification,
            unselectAllNotification
          ).concat(n.getOptions);
        }
      },
      { deep: true }
    );
    watch(
      () => [store.selected.length, canMarkAsStarredMore, canMarkSelectedAsUnstarred, canMarkAllAsRead, canMarkAllAsUnread],
      async (n) => {
        if (n[0] === 0) {
          menu.value = menuDisabled.value;
        } else {
          if (n[0] === 1) {
            menu.value = selectMenu(
              canSelectMore.value,
              allSelected.value,
              false,
              selectAllNotification,
              unselectAllNotification,
              canMarkAsStarredMore,
              canMarkSelectedAsUnstarred,
              canMarkAllAsRead,
              canMarkAllAsUnread
            ).concat(store.getNotificationById(store.selected[0]).getOptions);
          } else {
            menu.value = selectMenu(
              canSelectMore.value,
              allSelected.value,
              true,
              selectAllNotification,
              unselectAllNotification,
              canMarkAsStarredMore,
              canMarkSelectedAsUnstarred,
              canMarkAllAsRead,
              canMarkAllAsUnread
            );
          }
        }
        await nextTick();
      },
      { deep: true }
    );
    watch(selectionMode, (n, o) => {
      unselectAllNotification();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$h, [
        createBaseVNode("div", _hoisted_2$b, [
          createVNode(TransitionGroup, { name: "select-menu" }, {
            default: withCtx(() => [
              selectionMode.value && hasNotification.value ? (openBlock(), createBlock(_sfc_main$y, {
                key: 0,
                class: "INTFCenter-select-menu INTFCenter-select-menu-notification",
                options: nothingSelected.value ? menuDisabled.value : menu.value
              }, null, 8, ["options"])) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          hasNotification.value ? (openBlock(), createBlock(_sfc_main$l, { key: 0 })) : createCommentVNode("", true)
        ]),
        createVNode(_sfc_main$m),
        createVNode(_sfc_main$k)
      ]);
    };
  }
};
const _hoisted_1$g = { class: "INTFCenter-notif-center-unread-counter" };
const _hoisted_2$a = { key: 0 };
const _hoisted_3$9 = {
  key: 0,
  class: "INTFCenter-color-brown"
};
const _hoisted_4$6 = {
  key: 1,
  class: "INTFCenter-color-brown"
};
const _hoisted_5$4 = { key: 1 };
const _hoisted_6$4 = {
  key: 0,
  class: "INTFCenter-color-3ds"
};
const _hoisted_7$3 = {
  key: 1,
  class: "INTFCenter-color-3ds"
};
const _hoisted_8$3 = { key: 2 };
const _sfc_main$i = {
  __name: "UnreadCounter",
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const store = useNotificationsStore();
    const filterStore = useFilterStore();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$g, [
        !unref(filterStore).applied ? (openBlock(), createElementBlock("div", _hoisted_2$a, [
          unref(store).unreadTotal > 1 ? (openBlock(), createElementBlock("strong", _hoisted_3$9, toDisplayString(unref(store).unreadTotal) + " " + toDisplayString(unref($i18n2)("unreadNotifications")), 1)) : unref(store).unreadTotal === 1 ? (openBlock(), createElementBlock("strong", _hoisted_4$6, toDisplayString(unref(store).unreadTotal) + " " + toDisplayString(unref($i18n2)("oneUnreadNotification")), 1)) : createCommentVNode("", true)
        ])) : (openBlock(), createElementBlock("div", _hoisted_5$4, [
          unref(store).filterTotal ? (openBlock(), createElementBlock("strong", _hoisted_6$4, toDisplayString(unref(store).filterTotal) + " " + toDisplayString(unref($i18n2)("foundNotifications")), 1)) : unref(store).filterTotal === 1 ? (openBlock(), createElementBlock("strong", _hoisted_7$3, toDisplayString(unref(store).filterTotal) + " " + toDisplayString(unref($i18n2)("oneFoundNotification")), 1)) : createCommentVNode("", true)
        ])),
        unref(store).filterTotal === 0 || unref(store).unreadTotal === 0 ? (openBlock(), createElementBlock("div", _hoisted_8$3)) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$f = { class: "INTFCenter-filter-footer" };
const _hoisted_2$9 = { class: "INTFCenter-filter-bottom-container" };
const _hoisted_3$8 = { class: "INTFCenter-bottom-filter" };
const _sfc_main$h = {
  __name: "FilterButtons",
  emits: ["close", "apply", "reset"],
  setup(__props, { emit: __emit }) {
    const { $i18n: $i18n2 } = useTranslations();
    const emit2 = __emit;
    const closeFilter = () => {
      emit2("close");
    };
    const resetFilter = () => {
      emit2("reset");
    };
    const applyFilter = () => {
      emit2("apply");
    };
    return (_ctx, _cache) => {
      const _component_vu_btn = resolveComponent("vu-btn");
      return openBlock(), createElementBlock("div", _hoisted_1$f, [
        createBaseVNode("div", _hoisted_2$9, [
          createBaseVNode("div", _hoisted_3$8, [
            createVNode(_component_vu_btn, {
              color: "primary",
              class: "INTFCenter-filter-btn-filter",
              onClick: applyFilter
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref($i18n2)("filter")), 1)
              ]),
              _: 1
            }),
            createVNode(_component_vu_btn, {
              class: "INTFCenter-filter-btn-reset",
              onClick: resetFilter
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref($i18n2)("reset")), 1)
              ]),
              _: 1
            }),
            createVNode(_component_vu_btn, {
              class: "INTFCenter-filter-btn-close",
              onClick: closeFilter
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref($i18n2)("close")), 1)
              ]),
              _: 1
            })
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$e = { class: "INTFCenter-filter-section" };
const _hoisted_2$8 = { class: "INTFCenter-date-filter-section INTFCenter-start-date" };
const _hoisted_3$7 = { class: "INTFCenter-color-brown text-sm block" };
const _hoisted_4$5 = { class: "INTFCenter-date-filter-section INTFCenter-end-date" };
const _hoisted_5$3 = { class: "INTFCenter-filter-search-section" };
const _hoisted_6$3 = { class: "INTFCenter-badge-searches" };
const _hoisted_7$2 = { class: "INTFCenter-search-input-container" };
const _hoisted_8$2 = { class: "INTFCenter-filter-checkbox INTFCenter-color-brown" };
const _hoisted_9 = { class: "INTFCenter-read-checkbox" };
const _hoisted_10 = { class: "INTFCenter-starred-checkbox" };
const _hoisted_11 = { key: 0 };
const _sfc_main$g = {
  __name: "FilterOptions",
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const store = useFilterStore();
    const settings2 = useSettingsStore();
    const lang = ref("en");
    const search = inject("search");
    const getTenants2 = computed(() => {
      const tenants = [];
      settings2.tenants.tenants.forEach((tenant) => {
        if (!tenant.NAME) return;
        const tenantInfo = {
          value: tenant.PLATFORMID,
          label: tenant.NAME
        };
        tenants.push(tenantInfo);
      });
      return tenants;
    });
    const addSearch = () => {
      const { addSearch: addSearch2 } = useFilterStore();
      addSearch2(search);
    };
    onMounted(async () => {
      const I18n = await getI18n();
      lang.value = I18n.getCurrentLanguage();
    });
    return (_ctx, _cache) => {
      const _component_vu_input_date = resolveComponent("vu-input-date");
      const _component_vu_badge = resolveComponent("vu-badge");
      const _component_vu_input = resolveComponent("vu-input");
      const _component_vu_single_checkbox = resolveComponent("vu-single-checkbox");
      const _component_vu_multiple_select = resolveComponent("vu-multiple-select");
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$e, [
          createBaseVNode("div", _hoisted_2$8, [
            createVNode(_component_vu_input_date, {
              modelValue: unref(store).filter.first_date,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(store).filter.first_date = $event),
              clearable: "true",
              "date-format-locale": lang.value,
              "content-class": "INTFCenter-filter-date INTFCenter-start-date",
              placeholder: "No date selected",
              max: unref(store).filter.last_date ? unref(store).filter.last_date : void 0
            }, null, 8, ["modelValue", "date-format-locale", "max"])
          ]),
          createBaseVNode("span", _hoisted_3$7, toDisplayString(unref($i18n2)("to")), 1),
          createBaseVNode("div", _hoisted_4$5, [
            createVNode(_component_vu_input_date, {
              modelValue: unref(store).filter.last_date,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(store).filter.last_date = $event),
              clearable: "true",
              "date-format-locale": lang.value,
              "content-class": "INTFCenter-filter-date INTFCenter-end-date",
              placeholder: "No date selected",
              min: unref(store).filter.first_date ? unref(store).filter.first_date : void 0,
              max: new Date(Date.now())
            }, null, 8, ["modelValue", "date-format-locale", "min", "max"])
          ])
        ]),
        createBaseVNode("div", _hoisted_5$3, [
          createBaseVNode("div", _hoisted_6$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(store).filter.searches, (text) => {
              return openBlock(), createBlock(_component_vu_badge, {
                key: text,
                selectable: "",
                closable: "",
                color: "default",
                onClose: ($event) => unref(store).filter.searches.splice(unref(store).filter.searches.indexOf(text), 1)
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(text), 1)
                ]),
                _: 2
              }, 1032, ["onClose"]);
            }), 128))
          ]),
          createBaseVNode("div", _hoisted_7$2, [
            createVNode(_component_vu_input, {
              modelValue: unref(search),
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isRef(search) ? search.value = $event : null),
              class: "INTFCenter-filter-input",
              placeholder: unref($i18n2)("searches"),
              onKeyup: withKeys(addSearch, ["enter"])
            }, null, 8, ["modelValue", "placeholder"])
          ])
        ]),
        createBaseVNode("div", _hoisted_8$2, [
          createBaseVNode("div", _hoisted_9, [
            createVNode(_component_vu_single_checkbox, {
              class: "INTFCenter-read-read-checkbox",
              modelValue: unref(store).filter.read,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(store).filter.read = $event),
              label: unref($i18n2)("read")
            }, null, 8, ["modelValue", "label"]),
            createVNode(_component_vu_single_checkbox, {
              class: "INTFCenter-read-unread-checkbox",
              modelValue: unref(store).filter.unread,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(store).filter.unread = $event),
              label: unref($i18n2)("unread")
            }, null, 8, ["modelValue", "label"])
          ]),
          createBaseVNode("div", _hoisted_10, [
            createVNode(_component_vu_single_checkbox, {
              class: "INTFCenter-starred-starred-checkbox",
              modelValue: unref(store).filter.starred,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(store).filter.starred = $event),
              label: unref($i18n2)("starred")
            }, null, 8, ["modelValue", "label"]),
            createVNode(_component_vu_single_checkbox, {
              class: "INTFCenter-starred-unstarred-checkbox",
              modelValue: unref(store).filter.unstarred,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => unref(store).filter.unstarred = $event),
              label: unref($i18n2)("unstarred")
            }, null, 8, ["modelValue", "label"])
          ])
        ]),
        !unref(settings2).hidePlatformSelection && !!unref(settings2).isTenantAgnostic ? (openBlock(), createElementBlock("div", _hoisted_11, [
          createVNode(_component_vu_multiple_select, {
            modelValue: unref(store).filter.tenants,
            "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(store).filter.tenants = $event),
            class: "INTFCenter-filter-platform-section",
            placeholder: unref($i18n2)("platformsSelection"),
            options: getTenants2.value
          }, null, 8, ["modelValue", "placeholder", "options"])
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
};
function useFilterManagement() {
  const store = useFilterStore();
  const notifStore = useNotificationsStore();
  const applyFilter = (search) => {
    if (search.value.trim().length) {
      if (!store.filter.searches.includes(search.value.trim())) {
        if (store.filter.searches.length < 6) {
          store.filter.searches.push(search.value.trim());
        }
        search.value = "";
      }
      return;
    }
    store.saveToLocalStorage();
    notifStore.resetStates();
    notifStore.setIsLoading(true);
    filter(store.getFilter());
    if (!store.filter.unread && !store.filter.read && !store.filter.starred && !store.filter.unstarred && !store.filter.first_date && !store.filter.last_date) {
      getUnreadTotal();
    }
    store.setOpened(false);
    notifStore.setFilterQuery(true);
  };
  const resetFilter = () => {
    store.resetFilter();
    notifStore.resetStates();
    notifStore.setIsLoading(true);
    filter({ ...store.getFilter(), unread: true });
    getUnreadTotal();
    notifStore.setFilterQuery(true);
  };
  return {
    applyFilter,
    resetFilter
  };
}
const _sfc_main$f = {
  __name: "FilterBody",
  setup(__props) {
    const { setOpened } = useFilterStore();
    const { notificationFilterViewTracker } = NotificationTrackerUsage();
    const filterViewTracker = notificationFilterViewTracker();
    const search = ref("");
    provide("search", search);
    const _resetFilter = () => {
      filterViewTracker.resetFilterFields();
      const { resetFilter } = useFilterManagement();
      resetFilter();
    };
    const _applyFilter = () => {
      const { applyFilter } = useFilterManagement();
      applyFilter(search);
      setTimeout(() => {
        filterViewTracker.clickFilterButton();
      }, 5e3);
    };
    const closeFilter = () => {
      filterViewTracker.cancelFilterView();
      setOpened(false);
    };
    return (_ctx, _cache) => {
      const _component_vu_form = resolveComponent("vu-form");
      return openBlock(), createBlock(_component_vu_form, { class: "INTFCenter-filter" }, {
        default: withCtx(() => [
          createVNode(_sfc_main$g),
          createVNode(_sfc_main$h, {
            onClose: closeFilter,
            onReset: _resetFilter,
            onApply: _applyFilter
          })
        ]),
        _: 1
      });
    };
  }
};
const _hoisted_1$d = { class: "INTFCenter-center-header-container" };
const _hoisted_2$7 = { class: "INTFCenter-notif-center-header" };
const _hoisted_3$6 = {
  key: 0,
  class: "INTFCenter-filter-container"
};
const _sfc_main$e = {
  __name: "CenterHeader",
  setup(__props) {
    const storeFilter = useFilterStore();
    const opened = computed(() => {
      return storeFilter.opened;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$d, [
        createBaseVNode("div", _hoisted_2$7, [
          createVNode(_sfc_main$i),
          createVNode(_sfc_main$j)
        ]),
        createVNode(Transition, { name: "filter" }, {
          default: withCtx(() => [
            opened.value ? (openBlock(), createElementBlock("div", _hoisted_3$6, [
              createVNode(_sfc_main$f)
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ]);
    };
  }
};
const _hoisted_1$c = { class: "INTFCenter-notif-center-base-center" };
const _hoisted_2$6 = { class: "INTFCenter-header-container" };
const _hoisted_3$5 = { class: "INTFCenter-main-center-notification" };
const _hoisted_4$4 = { class: "INTFCenter-base-center" };
const _hoisted_5$2 = {
  key: 0,
  class: "INTFCenter-spinner-container"
};
const _hoisted_6$2 = {
  key: 0,
  class: "INTFCenter-center-section"
};
const _sfc_main$d = {
  __name: "BaseCenter",
  setup(__props) {
    const { loadMoreNotifications } = useNotificationManagement();
    const store = useNotificationsStore();
    const scroller = ref(null);
    const loading = computed(() => store.isLoading);
    const filterQuery = computed(() => store.filterQuery);
    const isEmpty = computed(() => store.isEmpty);
    const loadMoreFlag = computed(() => store.loadingMore);
    const { y } = useScroll(scroller, { behavior: "smooth" });
    watch(filterQuery, (newValue) => {
      if (newValue && y.value > 0) {
        const el2 = document.getElementById("INTFCenter-scroller");
        el2.scrollTo({ top: 0, behavior: "smooth" });
        store.setFilterQuery(false);
      }
    });
    useInfiniteScroll(
      scroller,
      () => {
        loadMoreNotifications();
      },
      {
        // check if can load more
        canLoadMore: () => {
          return store.canLoadMoreHistory === true || store.canLoadMoreFromArchive === true;
        },
        // distance from the bottom to trigger the load more
        distance: 50,
        // interval between each load more
        interval: 500
      }
    );
    return (_ctx, _cache) => {
      const _component_vu_spinner = resolveComponent("vu-spinner");
      const _component_vu_scroller = resolveComponent("vu-scroller");
      return openBlock(), createElementBlock("div", _hoisted_1$c, [
        createBaseVNode("div", _hoisted_2$6, [
          createVNode(_sfc_main$e)
        ]),
        createBaseVNode("div", _hoisted_3$5, [
          createBaseVNode("div", _hoisted_4$4, [
            createVNode(_component_vu_scroller, {
              id: "INTFCenter-scroller",
              ref_key: "scroller",
              ref: scroller,
              infinite: loadMoreFlag.value,
              class: normalizeClass(["INTFCenter-center-body", { "INTFCenter-empty-loading": loading.value || isEmpty.value, "INTFCenter-loading-more": loadMoreFlag.value }])
            }, {
              default: withCtx(() => [
                loading.value ? (openBlock(), createElementBlock("div", _hoisted_5$2, [
                  createVNode(_component_vu_spinner)
                ])) : createCommentVNode("", true),
                createVNode(Transition, { name: "center" }, {
                  default: withCtx(() => [
                    !loading.value ? (openBlock(), createElementBlock("div", _hoisted_6$2, [
                      isEmpty.value ? (openBlock(), createBlock(_sfc_main$A, { key: 0 })) : (openBlock(), createBlock(_sfc_main$n, { key: 1 }))
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["infinite", "class"])
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$b = { class: "INTFCenter-preference-appTitle" };
const _sfc_main$c = {
  __name: "AppTitle",
  props: {
    appTitle: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$b, toDisplayString(__props.appTitle), 1);
    };
  }
};
const _hoisted_1$a = { class: "INTFCenter-preference-appStatus" };
const _sfc_main$b = {
  __name: "AppStatus",
  props: {
    setting: {
      type: Setting,
      required: true
    }
  },
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const now = useNow();
    const props = __props;
    const remainingTime = computed(() => {
      const { getSetting } = useSettingsStore();
      const setting = getSetting(props.setting.id);
      const currentTime = new Date(now.value).getTime();
      const unsubTime = new Date(setting.unsubscribe_date).getTime();
      const elapsedMilliseconds = Math.abs(currentTime - unsubTime);
      const elapsedMinutes = Math.round(elapsedMilliseconds / (1e3 * 60));
      return elapsedMinutes > 60 ? 60 : elapsedMinutes;
    });
    const status = computed(() => {
      let status2 = $i18n2("centerIconText");
      if (props.setting.notif_by_ui) status2 += ", " + $i18n2("alertIconText");
      if (props.setting.notif_by_email) status2 += ", " + $i18n2("mailIconText");
      if (props.setting.notif_by_browser) status2 += ", " + $i18n2("browserIconText");
      return status2;
    });
    const statusText = computed(() => {
      return props.setting.subscribe === 1 ? props.setting.unsubscribe_date !== null ? `${$i18n2("settingOffForAnHour")} (${remainingTime.value === 60 ? 1 : remainingTime.value} ${remainingTime.value === 60 ? $i18n2("hourLeft") : $i18n2("minLeft")})` : status.value : $i18n2("settingOff");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$a, toDisplayString(statusText.value), 1);
    };
  }
};
const _hoisted_1$9 = ["src", "alt"];
const _sfc_main$a = {
  __name: "AppIcon",
  props: {
    setting: {
      type: Setting,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass("INTFCenter-appIcon-" + __props.setting.service)
      }, [
        createBaseVNode("img", {
          src: __props.setting.icon,
          alt: __props.setting.name + "icon",
          class: "INTFCenter-appIcon-img"
        }, null, 8, _hoisted_1$9)
      ], 2);
    };
  }
};
const _hoisted_1$8 = { class: "INTFCenter-pref-appname-right" };
const _hoisted_2$5 = /* @__PURE__ */ createBaseVNode("div", { class: "INTFCenter-btn-transparent-default INTFCenter-btn-hover INTFCenter-app-setting-btn" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "fonticon fonticon-chevron-right INTFCenter-back-icon" })
], -1);
const _sfc_main$9 = {
  __name: "GlobalApp",
  props: {
    setting: {
      type: Setting,
      required: true
    }
  },
  emits: ["openAppSetting"],
  setup(__props, { emit: __emit }) {
    const store = useSettingsStore();
    const props = __props;
    const openAppSetting = () => {
      store.setCurrentSetting(props.setting.id);
      store.setAppSettingOpened(true);
      const { notificationSettingViewTracker } = NotificationTrackerUsage();
      notificationSettingViewTracker().serviceSettingsView({
        persDim: {
          pd2: props.setting.servicename,
          pd3: props.setting.service
        }
      });
    };
    return (_ctx, _cache) => {
      return __props.setting ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["INTFCenter-preference-appname", { "INTFCenter-preference-appname-off": !__props.setting.enable }]),
        onClick: openAppSetting
      }, [
        createVNode(_sfc_main$a, { setting: __props.setting }, null, 8, ["setting"]),
        createBaseVNode("div", _hoisted_1$8, [
          createBaseVNode("div", null, [
            createVNode(_sfc_main$c, {
              appTitle: __props.setting.servicename
            }, null, 8, ["appTitle"]),
            createVNode(_sfc_main$b, { setting: __props.setting }, null, 8, ["setting"])
          ]),
          _hoisted_2$5
        ])
      ], 2)) : createCommentVNode("", true);
    };
  }
};
const _hoisted_1$7 = { class: "INTFCenter-preferences INTFCenter-preferences-home" };
const _sfc_main$8 = {
  __name: "PreferencesHome",
  setup(__props) {
    const store = useSettingsStore();
    const scroller = ref(null);
    const globalApp = computed(() => {
      return store.getAllGroupSettings;
    });
    return (_ctx, _cache) => {
      const _component_vu_scroller = resolveComponent("vu-scroller");
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        createVNode(_component_vu_scroller, {
          ref_key: "scroller",
          ref: scroller,
          class: "INTFCenter-preferences-body"
        }, {
          default: withCtx(() => [
            createVNode(TransitionGroup, { name: "list" }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(globalApp.value, (setting) => {
                  return openBlock(), createElementBlock("div", {
                    key: setting.id
                  }, [
                    createVNode(_sfc_main$9, { setting }, null, 8, ["setting"])
                  ]);
                }), 128))
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 512)
      ]);
    };
  }
};
const _hoisted_1$6 = { class: "INTFCenter-appSetting-top" };
const _hoisted_2$4 = { class: "INTFCenter-appSetting-mask" };
const _hoisted_3$4 = { class: "INTFCenter-appSetting-option" };
const _sfc_main$7 = {
  __name: "AppSetting",
  props: {
    setting: {
      type: Setting,
      required: true
    }
  },
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const store = useSettingsStore();
    const showOptions = ref(false);
    const props = __props;
    const enabled = ref(null);
    const globalSettingEnabled = computed(() => {
      const group = store.getSettingGroup(props.setting);
      return group && group.enable;
    });
    const options = ref([
      {
        value: "on"
      }
    ]);
    const toggleOptions = () => {
      if (enabled.value) showOptions.value = !showOptions.value;
    };
    watch(
      () => props.setting.subscribe,
      (value) => {
        if (value) enabled.value = "on";
        else {
          enabled.value = null;
          if (showOptions.value) {
            showOptions.value = false;
          }
        }
      },
      { immediate: true }
    );
    const updateTheSettings = (value) => {
      if (props.setting.readOnly) {
        const { messageNotice } = usePreferencesManagement();
        messageNotice($i18n2("forcedPreference"), 3e3);
        return;
      }
      updateSettings({
        subscribe: value ? 1 : 0,
        id: props.setting.id,
        notif_by_browser: props.setting.notif_by_browser,
        notif_by_email: props.setting.notif_by_email,
        notif_by_ui: props.setting.notif_by_ui
      });
    };
    onMounted(() => {
      enabled.value = props.setting.enable ? "on" : null;
    });
    return (_ctx, _cache) => {
      const _component_vu_checkbox = resolveComponent("vu-checkbox");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["INTFCenter-appSetting-container", { "INTFCenter-preference-appname-off": __props.setting.readOnly || !__props.setting.enable || !globalSettingEnabled.value }])
      }, [
        createBaseVNode("div", _hoisted_1$6, [
          createBaseVNode("div", _hoisted_2$4, [
            createBaseVNode("div", {
              class: "INTFCenter-appSetting-appTitle",
              onClick: toggleOptions
            }, toDisplayString(__props.setting.name), 1)
          ]),
          createBaseVNode("div", _hoisted_3$4, [
            createVNode(_component_vu_checkbox, {
              type: "switch",
              disabled: __props.setting.readOnly,
              options: options.value,
              modelValue: enabled.value,
              "onUpdate:modelValue": [
                _cache[0] || (_cache[0] = ($event) => enabled.value = $event),
                updateTheSettings
              ]
            }, null, 8, ["disabled", "options", "modelValue"])
          ])
        ])
      ], 2);
    };
  }
};
const _hoisted_1$5 = { class: "INTFCenter-preference-applist" };
const _sfc_main$6 = {
  __name: "AppList",
  props: {
    setting: {
      type: Setting,
      required: true
    }
  },
  setup(__props) {
    const store = useSettingsStore();
    const props = __props;
    const openAppSettings = computed(() => {
      return store.getGroupIndividualSettings(props.setting);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(openAppSettings.value, (app) => {
          return openBlock(), createBlock(_sfc_main$7, {
            setting: app,
            key: app.id
          }, null, 8, ["setting"]);
        }), 128))
      ]);
    };
  }
};
const _hoisted_1$4 = { class: "INTFCenter-option-container" };
const _hoisted_2$3 = { class: "INTFCenter-option-list" };
const _hoisted_3$3 = ["title"];
const _hoisted_4$3 = /* @__PURE__ */ createBaseVNode("span", { class: "icon-desktop-center" }, null, -1);
const _hoisted_5$1 = { class: "INTFCenter-desktop-center-intfnotif-on" };
const _hoisted_6$1 = ["title"];
const _hoisted_7$1 = ["title"];
const _hoisted_8$1 = ["title"];
const _sfc_main$5 = {
  __name: "AppOptions",
  props: {
    setting: {
      type: Setting,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    unsubHour: {
      type: Boolean,
      default: false
    },
    enabled: {
      type: Boolean,
      required: true
    }
  },
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const store = useSettingsStore();
    const now = useNow();
    const unsubedOneHour = ref(false);
    const props = __props;
    const remainingTime = computed(() => {
      const setting = store.getSetting(props.setting.id);
      const currentTime = new Date(now.value).getTime();
      const unsubTime = new Date(setting.unsubscribe_date).getTime();
      const elapsedMilliseconds = Math.abs(currentTime - unsubTime);
      const elapsedMinutes = Math.round(elapsedMilliseconds / (1e3 * 60));
      return elapsedMinutes > 60 ? 60 : elapsedMinutes;
    });
    computed(() => {
      return `${$i18n2("unsubscribeForHour")} ${unsubedOneHour.value ? `(` + (remainingTime.value === 60 ? 1 : remainingTime.value) + " " + (remainingTime.value === 60 ? $i18n2("hourLeft") : $i18n2("minLeft")) + ")" : ""}`;
    });
    const globalSetting2 = computed(() => {
      return store.getSettingGroup(props.setting);
    });
    const globalAlertOnSettingOff = computed(() => {
      return globalSetting2.value && !props.setting.isGroup && globalSetting2.value.notif_by_ui === 1;
    });
    const globalMailOnSettingOff = computed(() => {
      return globalSetting2.value && !props.setting.isGroup && globalSetting2.value.notif_by_email === 1;
    });
    const globalBrowserOnSettingOff = computed(() => {
      return globalSetting2.value && !props.setting.isGroup && globalSetting2.value.notif_by_browser === 1;
    });
    watch(
      () => props.setting.unsubscribe_date,
      (value) => {
        if (value !== null) {
          unsubedOneHour.value = true;
        } else {
          unsubedOneHour.value = false;
        }
      }
    );
    const updateSetting = (type) => {
      const readOnly = {
        notif_by_ui: () => props.setting.notif_by_uiReadOnly,
        notif_by_email: () => props.setting.notif_by_emailReadonly,
        notif_by_browser: () => props.setting.notif_by_browserReadonly
      };
      if (props.setting.readOnly || Object.hasOwn(readOnly, type) && readOnly[type]()) {
        const { messageNotice } = usePreferencesManagement();
        messageNotice($i18n2("forcedPreference"), 3e3);
        return;
      } else {
        if (type === "center") {
          return;
        } else {
          const { settingUpdate } = usePreferencesManagement();
          const setting = {
            id: props.setting.id,
            notif_by_browser: type === "notif_by_browser" ? props.setting.notif_by_browser === 1 ? 0 : 1 : props.setting.notif_by_browser,
            notif_by_email: type === "notif_by_email" ? props.setting.notif_by_email === 1 ? 0 : 1 : props.setting.notif_by_email,
            notif_by_ui: type === "notif_by_ui" ? props.setting.notif_by_ui === 1 ? 0 : 1 : props.setting.notif_by_ui
          };
          settingUpdate(setting, type);
        }
      }
    };
    onMounted(() => {
      unsubedOneHour.value = props.setting.unsubscribe_date !== null;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["INTFCenter-option", { "INTFCenter-preference-appname-off": __props.setting.readOnly || !__props.setting.enable }])
      }, [
        createBaseVNode("div", _hoisted_1$4, [
          createBaseVNode("div", _hoisted_2$3, [
            createBaseVNode("div", {
              onClick: _cache[0] || (_cache[0] = ($event) => updateSetting("center")),
              class: "INTFCenter-desktop INTFCenter-option-center INTFCenter-desktop-disabled",
              title: unref($i18n2)("centerNotificationTooltipEnabled")
            }, [
              _hoisted_4$3,
              createBaseVNode("span", _hoisted_5$1, toDisplayString(unref($i18n2)("centerIconText")), 1)
            ], 8, _hoisted_3$3),
            createBaseVNode("div", {
              class: normalizeClass([{
                "INTFCenter-option-list-disabled": __props.setting.notif_by_uiReadOnly || unsubedOneHour.value,
                "INTFCenter-preference-appname-off": globalAlertOnSettingOff.value
              }, "INTFCenter-desktop INTFCenter-option-alert"]),
              onClick: _cache[1] || (_cache[1] = ($event) => updateSetting("notif_by_ui")),
              title: (__props.setting.notif_by_ui === 1 ? unref($i18n2)("alertNotificationTooltipEnabled") : unref($i18n2)("alertNotificationTooltipDisabled")) + (globalAlertOnSettingOff.value ? ", " + unref($i18n2)("overrideByGlobal") : "")
            }, [
              createBaseVNode("span", {
                class: normalizeClass(["icon-desktop-popover", {
                  "INTFCenter-desktop-popover-intfnotif-on": __props.setting.notif_by_ui === 1,
                  "INTFCenter-desktop-popover-intfnotif-off": __props.setting.notif_by_ui === 0
                }])
              }, null, 2),
              createBaseVNode("span", {
                class: normalizeClass({
                  "INTFCenter-desktop-popover-intfnotif-on": __props.setting.notif_by_ui === 1,
                  "INTFCenter-desktop-popover-intfnotif-off": __props.setting.notif_by_ui === 0
                })
              }, toDisplayString(unref($i18n2)("alertIconText")), 3)
            ], 10, _hoisted_6$1),
            createBaseVNode("div", {
              class: normalizeClass([{
                "INTFCenter-option-list-disabled": __props.setting.notif_by_emailReadonly || unsubedOneHour.value,
                "INTFCenter-preference-appname-off": globalMailOnSettingOff.value
              }, "INTFCenter-desktop INTFCenter-option-email"]),
              onClick: _cache[2] || (_cache[2] = ($event) => updateSetting("notif_by_email")),
              title: (__props.setting.notif_by_email === 1 ? unref($i18n2)("mailNotificationTooltipEnabled") : unref($i18n2)("mailNotificationTooltipDisabled")) + (globalMailOnSettingOff.value ? ", " + unref($i18n2)("overrideByGlobal") : "")
            }, [
              createBaseVNode("span", {
                class: normalizeClass(["icon-desktop-email", {
                  "INTFCenter-desktop-email-intfnotif-on": __props.setting.notif_by_email === 1,
                  "INTFCenter-desktop-email-intfnotif-off": __props.setting.notif_by_email === 0
                }])
              }, null, 2),
              createBaseVNode("span", {
                class: normalizeClass({
                  "INTFCenter-desktop-email-intfnotif-on": __props.setting.notif_by_email === 1,
                  "INTFCenter-desktop-email-intfnotif-off": __props.setting.notif_by_email === 0
                })
              }, toDisplayString(unref($i18n2)("mailIconText")), 3)
            ], 10, _hoisted_7$1),
            createBaseVNode("div", {
              class: normalizeClass([{
                "INTFCenter-option-list-disabled": __props.setting.notif_by_browserReadonly || unsubedOneHour.value,
                "INTFCenter-preference-appname-off": globalBrowserOnSettingOff.value
              }, "INTFCenter-desktop INTFCenter-option-browser"]),
              onClick: _cache[3] || (_cache[3] = ($event) => updateSetting("notif_by_browser")),
              title: (__props.setting.notif_by_browser === 1 ? unref($i18n2)("browserNotificationTooltipEnabled") : unref($i18n2)("browserNotificationTooltipDisabled")) + (globalBrowserOnSettingOff.value ? ", " + unref($i18n2)("overrideByGlobal") : "")
            }, [
              createBaseVNode("span", {
                class: normalizeClass(["icon-desktop-empty", {
                  "INTFCenter-desktop-empty-intfnotif-on": __props.setting.notif_by_browser === 1,
                  "INTFCenter-desktop-empty-intfnotif-off": __props.setting.notif_by_browser === 0
                }])
              }, null, 2),
              createBaseVNode("span", {
                class: normalizeClass({
                  "INTFCenter-desktop-empty-intfnotif-on": __props.setting.notif_by_browser === 1,
                  "INTFCenter-desktop-empty-intfnotif-off": __props.setting.notif_by_browser === 0
                })
              }, toDisplayString(unref($i18n2)("browserIconText")), 3)
            ], 10, _hoisted_8$1)
          ])
        ])
      ], 2);
    };
  }
};
const _hoisted_1$3 = {
  key: 0,
  class: "INTCenter-appSettingList"
};
const _sfc_main$4 = {
  __name: "GlobalAppSettingsList",
  props: {
    setting: {
      type: Setting,
      required: true
    },
    enabled: {
      type: Boolean,
      required: true
    }
  },
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    return (_ctx, _cache) => {
      const _component_vu_scroller = resolveComponent("vu-scroller");
      return openBlock(), createBlock(Transition, { name: "center" }, {
        default: withCtx(() => [
          __props.enabled ? (openBlock(), createElementBlock("div", _hoisted_1$3, [
            createVNode(_component_vu_scroller, {
              ref: "scroller",
              class: "INTFCenter-preferences-body"
            }, {
              default: withCtx(() => [
                createVNode(_sfc_main$6, { setting: __props.setting }, null, 8, ["setting"]),
                createVNode(_sfc_main$5, {
                  class: "TEA-global-options",
                  setting: __props.setting,
                  enabled: __props.enabled,
                  title: unref($i18n2)("globalSetting")
                }, null, 8, ["setting", "enabled", "title"])
              ]),
              _: 1
            }, 512)
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const _hoisted_1$2 = {
  key: 0,
  class: "INTFCenter-appList-container INTFCenter-preferences"
};
const _hoisted_2$2 = { class: "INTFCenter-appList-top-setting" };
const _hoisted_3$2 = { class: "INTFCenter-appSetting-mask" };
const _hoisted_4$2 = { class: "INTFCenter-appList-top-option" };
const _sfc_main$3 = {
  __name: "SettingHomeList",
  props: {
    setting: {
      type: Setting,
      required: true
    }
  },
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const enabled = ref(null);
    const showOptions = ref(false);
    const props = __props;
    const options = ref([
      {
        value: "on"
      }
    ]);
    watch(
      () => props.setting.subscribe,
      (value) => {
        if (value) enabled.value = "on";
        else enabled.value = null;
      },
      { immediate: true }
    );
    const toggleOptions = () => {
      if (enabled.value) showOptions.value = !showOptions.value;
    };
    const updateTheSettings = (value) => {
      if (!props.setting.readOnly) {
        updateSettings({
          subscribe: value ? 1 : 0,
          id: props.setting.id,
          notif_by_browser: props.setting.notif_by_browser,
          notif_by_email: props.setting.notif_by_email,
          notif_by_ui: props.setting.notif_by_ui
        });
      } else {
        const { messageNotice } = usePreferencesManagement();
        messageNotice($i18n2("forcedPreference"), 3e3);
      }
    };
    onMounted(() => {
      enabled.value = props.setting.subscribe === 1 ? "on" : null;
    });
    return (_ctx, _cache) => {
      const _component_vu_checkbox = resolveComponent("vu-checkbox");
      return __props.setting ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", {
          class: normalizeClass(["INTFCenter-appList-top", {
            "INTFCenter-preference-appname-off": __props.setting.readOnly || !__props.setting.enable
          }])
        }, [
          createBaseVNode("div", _hoisted_2$2, [
            createBaseVNode("div", _hoisted_3$2, [
              createVNode(_sfc_main$c, {
                appTitle: __props.setting.servicename,
                class: "INTFCenter-appList-title",
                onClick: toggleOptions
              }, null, 8, ["appTitle"])
            ]),
            createBaseVNode("div", _hoisted_4$2, [
              createVNode(_component_vu_checkbox, {
                type: "switch",
                disabled: __props.setting.readOnly,
                options: options.value,
                modelValue: enabled.value,
                "onUpdate:modelValue": [
                  _cache[0] || (_cache[0] = ($event) => enabled.value = $event),
                  updateTheSettings
                ]
              }, null, 8, ["disabled", "options", "modelValue"])
            ])
          ])
        ], 2),
        createVNode(_sfc_main$4, {
          setting: __props.setting,
          enabled: enabled.value !== null
        }, null, 8, ["setting", "enabled"])
      ])) : createCommentVNode("", true);
    };
  }
};
const _sfc_main$2 = {
  __name: "PreferencesSectionItem",
  setup(__props) {
    const components = {
      PreferencesHome: _sfc_main$8,
      SettingHomeList: _sfc_main$3
    };
    const store = useSettingsStore();
    const currentSetting = computed(() => {
      return store.getSetting(store.currentSetting);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: "base-center" }, {
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent(components[unref(store).appSettingOpened ? "SettingHomeList" : "PreferencesHome"]), { setting: currentSetting.value }, null, 8, ["setting"]))
        ]),
        _: 1
      });
    };
  }
};
const _hoisted_1$1 = { class: "INTFCenter-base-preferences" };
const _hoisted_2$1 = { class: "INTFCenter-preferences-title-header" };
const _hoisted_3$1 = /* @__PURE__ */ createBaseVNode("div", { class: "INTFCenter-btn-transparent-default INTFCenter-btn-hover INTFCenter-back-to-center-btn" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "fonticon fonticon-chevron-left INTFCenter-back-icon" })
], -1);
const _hoisted_4$1 = { class: "INTFCenter-preferences-title-title INTFCenter-color-brown" };
const _hoisted_5 = {
  key: 0,
  class: "INTFCenter-preferences-dnd-alert-container"
};
const _hoisted_6 = { class: "INTFCenter-preferences-container" };
const _hoisted_7 = {
  key: 0,
  class: "INTFCenter-spinner-container"
};
const _hoisted_8 = {
  key: 0,
  class: "INTFCenter-preferences"
};
const _sfc_main$1 = {
  __name: "BasePreferences",
  setup(__props) {
    const { $i18n: $i18n2 } = useTranslations();
    const store = useSettingsStore();
    const loading = computed(() => store.settingState.isLoading.settings === true);
    const isDND = computed(() => store.isDND === true);
    const backToCenterOrSetting = () => {
      const { notificationSettingViewTracker } = NotificationTrackerUsage();
      const settingsViewTracker = notificationSettingViewTracker();
      if (store.appSettingOpened) {
        store.setAppSettingOpened(false);
        settingsViewTracker.backtoNotificationSettingsView();
      } else {
        store.setCenterShow(true);
        settingsViewTracker.backtoNotificationCenterView();
      }
    };
    onBeforeMount(() => {
      const { loadSettings } = usePreferencesManagement();
      loadSettings();
    });
    return (_ctx, _cache) => {
      const _component_vu_message = resolveComponent("vu-message");
      const _component_vu_spinner = resolveComponent("vu-spinner");
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("div", {
            onClick: backToCenterOrSetting,
            class: "INTFCenter-preferences-title"
          }, [
            _hoisted_3$1,
            createBaseVNode("div", _hoisted_4$1, toDisplayString(unref($i18n2)("preferences")), 1)
          ])
        ]),
        isDND.value ? (openBlock(), createElementBlock("div", _hoisted_5, [
          createVNode(_component_vu_message, {
            color: "primary",
            show: isDND.value
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref($i18n2)("dndAlertMsg")), 1)
            ]),
            _: 1
          }, 8, ["show"])
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_6, [
          loading.value ? (openBlock(), createElementBlock("div", _hoisted_7, [
            createVNode(_component_vu_spinner)
          ])) : createCommentVNode("", true),
          createVNode(Transition, { name: "setting" }, {
            default: withCtx(() => [
              !loading.value ? (openBlock(), createElementBlock("div", _hoisted_8, [
                createVNode(_sfc_main$2)
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          })
        ])
      ]);
    };
  }
};
const _hoisted_1 = { class: "INTFCenter-app-vue-notif" };
const _hoisted_2 = ["innerHTML"];
const _hoisted_3 = { class: "INTFCenter-message-modal" };
const _hoisted_4 = { class: "INTFCenter-notification-app" };
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const { watchSettingWithUnsubDate } = usePreferencesManagement();
    const { reliveSocketIfKO, setSocketStatusTimeout } = useConnection();
    const { loadFilter } = useFilterStore();
    const store = useNotificationsStore();
    const settingStore = useSettingsStore();
    const components = {
      NotificationCenter: _sfc_main$d,
      PreferencesCenter: _sfc_main$1
    };
    provide("vuDebug");
    const isCenterShown = computed(() => settingStore.centerShow === true);
    const loadData = () => {
      const { isFilterApplied, getFilter } = useFilterStore();
      let payload;
      if (isFilterApplied()) {
        payload = getFilter();
      } else {
        payload = { ...getFilter(), unread: true };
        getUnreadTotal();
      }
      filter(payload);
    };
    onMounted(async () => {
      store.setIsLoading(true);
      loadFilter();
      if (store.clusterId) loadData();
      else watchOnce(() => store.clusterId, loadData);
      watchSettingWithUnsubDate();
      setSocketStatusTimeout(1e4);
      reliveSocketIfKO();
    });
    return (_ctx, _cache) => {
      const _component_vu_modal_container = resolveComponent("vu-modal-container");
      const _component_vu_message_container = resolveComponent("vu-message-container");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(_component_vu_modal_container, null, {
          default: withCtx(() => [
            unref(store).hasRenderToDoc ? (openBlock(), createElementBlock("div", {
              key: 0,
              slot: "modal-body",
              innerHTML: unref(store).renderToDoc
            }, null, 8, _hoisted_2)) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_3, [
          createVNode(_component_vu_message_container)
        ]),
        createBaseVNode("div", _hoisted_4, [
          createVNode(Transition, { name: "base-center" }, {
            default: withCtx(() => [
              (openBlock(), createBlock(resolveDynamicComponent(components[isCenterShown.value ? "NotificationCenter" : "PreferencesCenter"])))
            ]),
            _: 1
          })
        ])
      ]);
    };
  }
};
const eventHandlers = {
  setTenantAgnosticMode,
  deleteAllFilteredNotification,
  addNotification,
  setUnreadTotal,
  setHistory,
  setTenants,
  setDNDStatus,
  refreshForRollback,
  readNotification,
  deleteAllNotification,
  deleteNotification,
  setAppInfos,
  setServices,
  setMerge,
  setSetting,
  setNotifications,
  setSettings,
  setWhoSettings,
  refreshCenterView,
  rollbackPopup,
  resetSettingUnsubscriptionDate,
  setSocketStatus,
  notifCenterOpened,
  // when center is opened
  resetNotifications
  // when center is closed
};
function notifCenterOpened(data) {
  const { setCenterFrameOpened } = useNotificationsStore();
  setCenterFrameOpened(data.centerOpened);
}
function resetNotifications(data) {
  const { setCenterFrameOpened } = useNotificationsStore();
  setCenterFrameOpened(data.centerOpened);
}
function setSocketStatus(data) {
  const { setSocketStatus: setSocketStatus2, setCheckingSocketStatus } = useConnectionStore();
  setSocketStatus2(data.socketStatus);
  setCheckingSocketStatus(false);
  if (data.centerOpened) {
    const { setCenterFrameOpened } = useNotificationsStore();
    setCenterFrameOpened(data.centerOpened);
  }
}
function resetSettingUnsubscriptionDate(data) {
  const { getSetting, removeUnsubscribe_dateSetting } = useSettingsStore();
  useNotificationManagement();
  const setting = getSetting(data.id);
  if (setting) {
    setting.unsubscribe_date = null;
    removeUnsubscribe_dateSetting(setting.id);
    refreshCenterView();
  }
}
function rollbackPopup(data) {
  const { rollbackPopupAction } = useNotificationManagement();
  rollbackPopupAction(data);
}
function refreshCenterView(data) {
  const { refreshCenterView: refreshCenterView2 } = useNotificationManagement();
  refreshCenterView2();
}
function setSettings(data) {
  const { setSettingsData } = useSettingsStore();
  const { setSettingLoadState, setSettingLoadingState } = useSettingsStore();
  const { setClusterId } = useNotificationsStore();
  setClusterId(data.clusterId);
  setSettingsData(data);
  setSettingLoadState("settings", true);
  setSettingLoadingState("settings", false);
}
function setWhoSettings(data) {
}
function setNotifications(data) {
  const { durationTime, resetAnalytics } = useAnalyticsStore();
  const { notificationsLoadTimeTracker } = NotificationTrackerUsage();
  if (durationTime() > 0) {
    notificationsLoadTimeTracker().notificationFilterLoaded({ time: durationTime() });
    resetAnalytics();
  }
  const { addHistory } = useNotificationManagement();
  addHistory(data);
}
function setTenantAgnosticMode(data) {
  const { setTenantAgnosticData, getTenantAgnosticMode: getTenantAgnosticMode2 } = useSettingsStore();
  setTenantAgnosticData(data);
  if (data.update) {
    const { isFilterApplied, getFilter } = useFilterStore();
    const store = useNotificationsStore();
    const { resetStates, setIsLoading } = useNotificationsStore();
    resetStates();
    setIsLoading(true);
    if (isFilterApplied()) {
      getFilter().tenants = [];
      const data2 = {
        ...getFilter(),
        ...!store.canLoadMoreHistory && store.canLoadMoreFromArchive && {
          archive: true
        }
      };
      filter(data2);
    } else {
      getHistory({
        type: "all",
        ...!store.canLoadMoreHistory && store.canLoadMoreFromArchive && {
          archive: true
        }
      });
      getUnreadTotal();
    }
  }
}
function setSetting({ setting, notifID }) {
  const { notificationSettingViewTracker } = NotificationTrackerUsage();
  const settingsViewTracker = notificationSettingViewTracker();
  settingsViewTracker.notifServiceOrSettings({ setting });
  settingsViewTracker.notifAlertSetting({ setting });
  const { unsubscribeNotification } = useNotificationManagement();
  const { setSettingData } = useSettingsStore();
  unsubscribeNotification({ setting, notifID });
  setSettingData(setting);
}
function addNotification(data) {
  const {
    unreadTotal,
    filterTotal,
    setFilterTotal,
    setUnreadTotal: setUnreadTotal2,
    getNotificationById,
    setNotification,
    addFilterNotifIds
  } = useNotificationsStore();
  const { canBeAddedToGroup, notificationInFilterRange, refreshWithoutReset } = useNotificationManagement();
  const { cleanNotificationData } = useNotificationCleaning();
  const { resolveNotificationAction, resolveNotificationIcon } = useNotificationResolution();
  const { setNotificationMenu } = useNotificationMenu();
  const { isFilterApplied, getFilter } = useFilterStore();
  const options = {
    appName: data.appName,
    currentTenant: data.currentTenant
  };
  data.notification["COUNT"] = 1;
  data.notification["ACTION"] = null;
  data.notification["ACTION_DATE"] = null;
  data.notification["ACTOR_DATA"] = null;
  data.clusterId = data.clusterId || data.notification["CLUSTER_ID"];
  cleanNotificationData(data.notification);
  if (isFilterApplied()) {
    if (!notificationInFilterRange(data.notification, getFilter())) return;
  }
  if (canBeAddedToGroup(data.notification)) {
    refreshWithoutReset(false, data.notification.GROUPID);
    return;
  } else {
    setNotification(data.notification, options);
    if (isFilterApplied()) {
      setFilterTotal(filterTotal + 1);
      addFilterNotifIds([data.notification.ID], data.clusterId, false);
    } else setUnreadTotal2(unreadTotal + 1);
    refreshWithoutReset(false, data.notification.GROUPID);
    const id2 = `${data.notification.ID}-${data.clusterId}`;
    const notif = getNotificationById(id2);
    resolveNotificationIcon(notif);
    resolveNotificationAction(notif);
    setNotificationMenu(notif);
  }
}
function setUnreadTotal({ unread: unread2, clusterId }) {
  let counter = 0;
  if (typeof unread2 === "number") {
    counter = unread2;
  } else {
    counter = parseInt(unread2);
  }
  if (typeof counter === "number") {
    const { setUnreadTotal: setUnreadTotal2 } = useNotificationsStore();
    setUnreadTotal2(counter);
  } else throw new Error("[setUnreadTotal] Missing data.unread");
}
function setTenants({ tenants }) {
  const { setTenantsData } = useSettingsStore();
  setTenantsData(tenants);
}
function setHistory(data) {
  const { durationTime, resetAnalytics } = useAnalyticsStore();
  const { notificationsLoadTimeTracker } = NotificationTrackerUsage();
  if (durationTime() > 0) {
    notificationsLoadTimeTracker().notificationLoaded({ time: durationTime() });
    resetAnalytics();
  }
  const { addHistory } = useNotificationManagement();
  addHistory(data);
}
function refreshForRollback(data) {
}
function readOneNotification(data) {
  const { setMergeReadState, setNotificationReadState, setGroupReadState } = useNotificationManagement();
  const { getMergeById, getNotificationById } = useNotificationsStore();
  const { getFilter } = useFilterStore();
  if (data.id) {
    data.id = linkIds(data.id, data.clusterId);
    if (!data.hiddenMerged) {
      let notif = getNotificationById(data.id);
      let merge = getMergeById(data.id);
      if (merge) {
        setMergeReadState(merge, data);
      }
      if (notif) {
        if (notif.isGroup) {
          if (!notif.mergesFetched) {
            getMerge({
              parentNotif: {
                id: notif.ID,
                groupID: notif.GROUPID,
                clusterId: notif.CLUSTERID,
                archive: notif.ARCHIVE,
                ignoreSearchesForChildren: !!notif.ignoreSearchesForChildren
              },
              filterData: getFilter()
            });
          }
        } else setNotificationReadState(notif, data);
      }
    } else {
      setGroupReadState(data.id, data);
    }
  }
}
function readNotification(data) {
  const { setAllReadState } = useNotificationManagement();
  const { updateLabel, setActioned } = useNotificationManagement();
  if (data.id) {
    readOneNotification(data);
  } else if (data.scope) {
    setAllReadState(data);
  } else if (data.updateLabel) {
    data.params.id = linkIds(data.params.id, data.clusterId);
    updateLabel(data.params);
  } else if (data.action === "actioned") {
    data.params.id = linkIds(data.params.id, data.clusterId);
    setActioned(data.params);
  } else if (data.notificationID) {
    data.notificationID.forEach((notif) => {
      if (notif.id) {
        readOneNotification({ ...data, id: notif.id });
      }
    });
  }
}
function deleteNotification(data) {
  const { removeNotification, removeNotificationGroup } = useNotificationManagement();
  data.id = linkIds(data.id, data.clusterId);
  if (!data.groupID) removeNotification(data.id);
  else removeNotificationGroup(data.id);
}
function deleteAllNotification(data) {
  const { resetStates } = useNotificationsStore();
  resetStates();
}
function deleteAllFilteredNotification(data) {
  const { resetStates, setIsLoading } = useNotificationsStore();
  const { fetchMoreNotificationsIfNecessary } = useNotificationManagement();
  resetStates(true);
  setIsLoading(true);
  fetchMoreNotificationsIfNecessary();
}
function setAppInfos(data) {
  const { setNotifAppInfos } = useNotificationsStore();
  data.notifID = linkIds(data.notifID, data.clusterId);
  setNotifAppInfos(data);
}
function setServices(data) {
  const { setListOfService } = useSettingsStore();
  setListOfService(data);
}
function setMerge(data) {
  const { setNotifMerges } = useNotificationManagement();
  setNotifMerges(data);
}
function setDNDStatus(data) {
  const { setDNDStatus: setDNDStatus2 } = useSettingsStore();
  setDNDStatus2(data);
}
function responseHandler(response) {
  if (!eventHandlers[response.action]) return;
  try {
    eventHandlers[response.action](response.data, response.TxID);
  } catch (error) {
    throw new Error(`Error when processing response: ${error}`);
  }
}
async function mount(container, app) {
  requirejs(["css!DS/UIKIT/UIKIT"]);
  const { promise: promise2 } = useTranslations();
  await promise2;
  app.mount(container);
}
function loadApp(app, widget) {
  widget.initFlag = true;
  const div = document.createElement("div");
  div.setAttribute("id", "INTFCenter-app");
  document.body.innerHTML = "";
  document.body.appendChild(div);
  document.documentElement.style.fontSize = "inherit";
  return mount(div, app);
}
async function startWidget(widget, app) {
  widget.onRefresh = function() {
    window.location.reload();
  };
  widget.onLoad = async function() {
    widget.initFlag = false;
    widget.counterRequest = 0;
    widget.maxRequest = 5;
    commonDriver.init(widget);
    commonDriver.addCallback(responseHandler).then(() => initAppData());
    loadApp(app, widget);
  };
  widget.launch();
}
function initAppData() {
  return Promise.allSettled([
    getServices(),
    getSocketStatus(),
    resetBadge({ notifCenterOpened: true }),
    getTenants(),
    getTenantAgnosticMode(),
    getSettings()
  ]);
}
(() => {
  if (window.widget === void 0 || window.widget === null) throw new Error("No widget found");
  const widget = window.widget;
  const app = createApp(_sfc_main);
  app.use(mf, { globalRegister: true });
  app.use(createPinia());
  startWidget(widget, app);
})();
//# sourceMappingURL=NotificationCenterWidget.js.map
