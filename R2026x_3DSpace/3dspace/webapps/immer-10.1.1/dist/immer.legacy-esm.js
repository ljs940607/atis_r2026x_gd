
    define( function(require, exports, module) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPatches = exports.Immer = void 0;
exports.castDraft = castDraft;
exports.castImmutable = castImmutable;
exports.createDraft = void 0;
exports.current = current;
exports.enableMapSet = enableMapSet;
exports.enablePatches = enablePatches;
exports.finishDraft = void 0;
exports.freeze = freeze;
exports.immerable = void 0;
exports.isDraft = isDraft;
exports.isDraftable = isDraftable;
exports.nothing = void 0;
exports.original = original;
exports.setUseStrictShallowCopy = exports.setAutoFreeze = exports.produceWithPatches = exports.produce = void 0;
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf2(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf2(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf2(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf2(t) { return _getPrototypeOf2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf2(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = function __defNormalProp(obj, key, value) {
  return key in obj ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: value
  }) : obj[key] = value;
};
var __spreadValues = function __spreadValues(a, b) {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols) {
    var _iterator = _createForOfIteratorHelper(__getOwnPropSymbols(b)),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var prop = _step.value;
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return a;
};

// src/utils/env.ts
var NOTHING = exports.nothing = Symbol["for"]("immer-nothing");
var DRAFTABLE = exports.immerable = Symbol["for"]("immer-draftable");
var DRAFT_STATE = Symbol["for"]("immer-state");

// src/utils/errors.ts
var errors = (window.$DRWAF_DEBUG ? "development" : "production") !== "production" ? [
// All error codes, starting by 0:
function (plugin) {
  return "The plugin for '".concat(plugin, "' has not been loaded into Immer. To enable the plugin, import and call `enable").concat(plugin, "()` when initializing your application.");
}, function (thing) {
  return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '".concat(thing, "'");
}, "This object has been frozen and should not be mutated", function (data) {
  return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
}, "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.", "Immer forbids circular references", "The first or second argument to `produce` must be a function", "The third argument to `produce` must be a function or undefined", "First argument to `createDraft` must be a plain object, an array, or an immerable object", "First argument to `finishDraft` must be a draft returned by `createDraft`", function (thing) {
  return "'current' expects a draft, got: ".concat(thing);
}, "Object.defineProperty() cannot be used on an Immer draft", "Object.setPrototypeOf() cannot be used on an Immer draft", "Immer only supports deleting array indices", "Immer only supports setting array indices and the 'length' property", function (thing) {
  return "'original' expects a draft, got: ".concat(thing);
}
// Note: if more errors are added, the errorOffset in Patches.ts should be increased
// See Patches.ts for additional errors
] : [];
function die(error) {
  if ((window.$DRWAF_DEBUG ? "development" : "production") !== "production") {
    var e = errors[error];
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    var msg = typeof e === "function" ? e.apply(null, args) : e;
    throw new Error("[Immer] ".concat(msg));
  }
  throw new Error("[Immer] minified error nr: ".concat(error, ". Full error at: https://bit.ly/3cXEKWf"));
}

// src/utils/common.ts
var _getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
  var _a;
  if (!value) return false;
  return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_a = value.constructor) == null ? void 0 : _a[DRAFTABLE]) || isMap(value) || isSet(value);
}
var objectCtorString = Object.prototype.constructor.toString();
function isPlainObject(value) {
  if (!value || _typeof(value) !== "object") return false;
  var proto = _getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  var Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  if (Ctor === Object) return true;
  return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
}
function original(value) {
  if (!isDraft(value)) die(15, value);
  return value[DRAFT_STATE].base_;
}
function each(obj, iter) {
  if (getArchtype(obj) === 0 /* Object */) {
    Reflect.ownKeys(obj).forEach(function (key) {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach(function (entry, index) {
      return iter(index, entry, obj);
    });
  }
}
function getArchtype(thing) {
  var state = thing[DRAFT_STATE];
  return state ? state.type_ : Array.isArray(thing) ? 1 /* Array */ : isMap(thing) ? 2 /* Map */ : isSet(thing) ? 3 /* Set */ : 0 /* Object */;
}
function has(thing, prop) {
  return getArchtype(thing) === 2 /* Map */ ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
}
function get(thing, prop) {
  return getArchtype(thing) === 2 /* Map */ ? thing.get(prop) : thing[prop];
}
function set(thing, propOrOldValue, value) {
  var t = getArchtype(thing);
  if (t === 2 /* Map */) thing.set(propOrOldValue, value);else if (t === 3 /* Set */) {
    thing.add(value);
  } else thing[propOrOldValue] = value;
}
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
function isMap(target) {
  return target instanceof Map;
}
function isSet(target) {
  return target instanceof Set;
}
function latest(state) {
  return state.copy_ || state.base_;
}
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (Array.isArray(base)) return Array.prototype.slice.call(base);
  var isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    var descriptors = Object.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    var keys = Reflect.ownKeys(descriptors);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var desc = descriptors[key];
      if (desc.writable === false) {
        desc.writable = true;
        desc.configurable = true;
      }
      if (desc.get || desc.set) descriptors[key] = {
        configurable: true,
        writable: true,
        // could live with !!desc.set as well here...
        enumerable: desc.enumerable,
        value: base[key]
      };
    }
    return Object.create(_getPrototypeOf(base), descriptors);
  } else {
    var proto = _getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return __spreadValues({}, base);
    }
    var obj = Object.create(proto);
    return Object.assign(obj, base);
  }
}
function freeze(obj) {
  var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj)) return obj;
  if (getArchtype(obj) > 1) {
    obj.set = obj.add = obj.clear = obj["delete"] = dontMutateFrozenCollections;
  }
  Object.freeze(obj);
  if (deep) Object.entries(obj).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    return freeze(value, true);
  });
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
function isFrozen(obj) {
  return Object.isFrozen(obj);
}

// src/utils/plugins.ts
var plugins = {};
function getPlugin(pluginKey) {
  var plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}
function loadPlugin(pluginKey, implementation) {
  if (!plugins[pluginKey]) plugins[pluginKey] = implementation;
}

// src/core/scope.ts
var currentScope;
function getCurrentScope() {
  return currentScope;
}
function createScope(parent_, immer_) {
  return {
    drafts_: [],
    parent_: parent_,
    immer_: immer_,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: true,
    unfinalizedDrafts_: 0
  };
}
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    getPlugin("Patches");
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
function enterScope(immer2) {
  return currentScope = createScope(currentScope, immer2);
}
function revokeDraft(draft) {
  var state = draft[DRAFT_STATE];
  if (state.type_ === 0 /* Object */ || state.type_ === 1 /* Array */) state.revoke_();else state.revoked_ = true;
}

// src/core/finalize.ts
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  var baseDraft = scope.drafts_[0];
  var isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
      if (!scope.parent_) maybeFreeze(scope, result);
    }
    if (scope.patches_) {
      getPlugin("Patches").generateReplacementPatches_(baseDraft[DRAFT_STATE].base_, result, scope.patches_, scope.inversePatches_);
    }
  } else {
    result = finalize(scope, baseDraft, []);
  }
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value, path) {
  if (isFrozen(value)) return value;
  var state = value[DRAFT_STATE];
  if (!state) {
    each(value, function (key, childValue) {
      return finalizeProperty(rootScope, state, value, key, childValue, path);
    });
    return value;
  }
  if (state.scope_ !== rootScope) return value;
  if (!state.modified_) {
    maybeFreeze(rootScope, state.base_, true);
    return state.base_;
  }
  if (!state.finalized_) {
    state.finalized_ = true;
    state.scope_.unfinalizedDrafts_--;
    var result = state.copy_;
    var resultEach = result;
    var isSet2 = false;
    if (state.type_ === 3 /* Set */) {
      resultEach = new Set(result);
      result.clear();
      isSet2 = true;
    }
    each(resultEach, function (key, childValue) {
      return finalizeProperty(rootScope, state, result, key, childValue, path, isSet2);
    });
    maybeFreeze(rootScope, result, false);
    if (path && rootScope.patches_) {
      getPlugin("Patches").generatePatches_(state, path, rootScope.patches_, rootScope.inversePatches_);
    }
  }
  return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
  if ((window.$DRWAF_DEBUG ? "development" : "production") !== "production" && childValue === targetObject) die(5);
  if (isDraft(childValue)) {
    var path = rootPath && parentState && parentState.type_ !== 3 /* Set */ &&
    // Set objects are atomic since they have no keys.
    !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
    var res = finalize(rootScope, childValue, path);
    set(targetObject, prop, res);
    if (isDraft(res)) {
      rootScope.canAutoFreeze_ = false;
    } else return;
  } else if (targetIsSet) {
    targetObject.add(childValue);
  }
  if (isDraftable(childValue) && !isFrozen(childValue)) {
    if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
      return;
    }
    finalize(rootScope, childValue);
    if ((!parentState || !parentState.scope_.parent_) && _typeof(prop) !== "symbol" && Object.prototype.propertyIsEnumerable.call(targetObject, prop)) maybeFreeze(rootScope, childValue);
  }
}
function maybeFreeze(scope, value) {
  var deep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}

// src/core/proxy.ts
function createProxyProxy(base, parent) {
  var isArray = Array.isArray(base);
  var state = {
    type_: isArray ? 1 /* Array */ : 0 /* Object */,

    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false
  };
  var target = state;
  var traps = objectTraps;
  if (isArray) {
    target = [state];
    traps = arrayTraps;
  }
  var _Proxy$revocable = Proxy.revocable(target, traps),
    revoke = _Proxy$revocable.revoke,
    proxy = _Proxy$revocable.proxy;
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return proxy;
}
var objectTraps = {
  get: function get(state, prop) {
    if (prop === DRAFT_STATE) return state;
    var source = latest(state);
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop);
    }
    var value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      return state.copy_[prop] = createProxy(value, state);
    }
    return value;
  },
  has: function has(state, prop) {
    return prop in latest(state);
  },
  ownKeys: function ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set: function set(state, prop, value) {
    var desc = getDescriptorFromProto(latest(state), prop);
    if (desc == null ? void 0 : desc.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      var current2 = peek(latest(state), prop);
      var currentState = current2 == null ? void 0 : current2[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_[prop] = false;
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop))) return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && (
    // special case: handle new props with value 'undefined'
    value !== void 0 || prop in state.copy_) ||
    // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop])) return true;
    state.copy_[prop] = value;
    state.assigned_[prop] = true;
    return true;
  },
  deleteProperty: function deleteProperty(state, prop) {
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_[prop] = false;
      prepareCopy(state);
      markChanged(state);
    } else {
      delete state.assigned_[prop];
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(state, prop) {
    var owner = latest(state);
    var desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc) return desc;
    return {
      writable: true,
      configurable: state.type_ !== 1 /* Array */ || prop !== "length",
      enumerable: desc.enumerable,
      value: owner[prop]
    };
  },
  defineProperty: function defineProperty() {
    die(11);
  },
  getPrototypeOf: function getPrototypeOf(state) {
    return _getPrototypeOf(state.base_);
  },
  setPrototypeOf: function setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
each(objectTraps, function (key, fn) {
  arrayTraps[key] = function () {
    arguments[0] = arguments[0][0];
    return fn.apply(this, arguments);
  };
});
arrayTraps.deleteProperty = function (state, prop) {
  if ((window.$DRWAF_DEBUG ? "development" : "production") !== "production" && isNaN(parseInt(prop))) die(13);
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function (state, prop, value) {
  if ((window.$DRWAF_DEBUG ? "development" : "production") !== "production" && prop !== "length" && isNaN(parseInt(prop))) die(14);
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  var state = draft[DRAFT_STATE];
  var source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  var _a;
  var desc = getDescriptorFromProto(source, prop);
  return desc ? "value" in desc ? desc.value :
  // This is a very special case, if the prop is a getter defined by the
  // prototype, we should invoke it with the draft as context!
  (_a = desc.get) == null ? void 0 : _a.call(state.draft_) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source)) return void 0;
  var proto = _getPrototypeOf(source);
  while (proto) {
    var desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc) return desc;
    proto = _getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.copy_ = shallowCopy(state.base_, state.scope_.immer_.useStrictShallowCopy_);
  }
}

// src/core/immerClass.ts
var Immer2 = exports.Immer = /*#__PURE__*/function () {
  function Immer2(config) {
    var _this = this;
    _classCallCheck(this, Immer2);
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    /**
     * The `produce` function takes a value and a "recipe function" (whose
     * return value often depends on the base state). The recipe function is
     * free to mutate its first argument however it wants. All mutations are
     * only ever applied to a __copy__ of the base state.
     *
     * Pass only a function to create a "curried producer" which relieves you
     * from passing the recipe function every time.
     *
     * Only plain objects and arrays are made mutable. All other objects are
     * considered uncopyable.
     *
     * Note: This function is __bound__ to its `Immer` instance.
     *
     * @param {any} base - the initial state
     * @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
     * @param {Function} patchListener - optional function that will be called with all the patches produced here
     * @returns {any} a new state, or the initial state if nothing was modified
     */
    this.produce = function (base, recipe, patchListener) {
      if (typeof base === "function" && typeof recipe !== "function") {
        var defaultBase = recipe;
        recipe = base;
        var self = _this;
        return function curriedProduce() {
          var _this2 = this;
          var base2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultBase;
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }
          return self.produce(base2, function (draft) {
            var _recipe;
            return (_recipe = recipe).call.apply(_recipe, [_this2, draft].concat(args));
          });
        };
      }
      if (typeof recipe !== "function") die(6);
      if (patchListener !== void 0 && typeof patchListener !== "function") die(7);
      var result;
      if (isDraftable(base)) {
        var scope = enterScope(_this);
        var proxy = createProxy(base, void 0);
        var hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError) revokeScope(scope);else leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || _typeof(base) !== "object") {
        result = recipe(base);
        if (result === void 0) result = base;
        if (result === NOTHING) result = void 0;
        if (_this.autoFreeze_) freeze(result, true);
        if (patchListener) {
          var p = [];
          var ip = [];
          getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
          patchListener(p, ip);
        }
        return result;
      } else die(1, base);
    };
    this.produceWithPatches = function (base, recipe) {
      if (typeof base === "function") {
        return function (state) {
          for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
          }
          return _this.produceWithPatches(state, function (draft) {
            return base.apply(void 0, [draft].concat(args));
          });
        };
      }
      var patches, inversePatches;
      var result = _this.produce(base, recipe, function (p, ip) {
        patches = p;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (typeof (config == null ? void 0 : config.autoFreeze) === "boolean") this.setAutoFreeze(config.autoFreeze);
    if (typeof (config == null ? void 0 : config.useStrictShallowCopy) === "boolean") this.setUseStrictShallowCopy(config.useStrictShallowCopy);
  }
  return _createClass(Immer2, [{
    key: "createDraft",
    value: function createDraft(base) {
      if (!isDraftable(base)) die(8);
      if (isDraft(base)) base = current(base);
      var scope = enterScope(this);
      var proxy = createProxy(base, void 0);
      proxy[DRAFT_STATE].isManual_ = true;
      leaveScope(scope);
      return proxy;
    }
  }, {
    key: "finishDraft",
    value: function finishDraft(draft, patchListener) {
      var state = draft && draft[DRAFT_STATE];
      if (!state || !state.isManual_) die(9);
      var scope = state.scope_;
      usePatchesInScope(scope, patchListener);
      return processResult(void 0, scope);
    }
    /**
     * Pass true to automatically freeze all copies created by Immer.
     *
     * By default, auto-freezing is enabled.
     */
  }, {
    key: "setAutoFreeze",
    value: function setAutoFreeze(value) {
      this.autoFreeze_ = value;
    }
    /**
     * Pass true to enable strict shallow copy.
     *
     * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
     */
  }, {
    key: "setUseStrictShallowCopy",
    value: function setUseStrictShallowCopy(value) {
      this.useStrictShallowCopy_ = value;
    }
  }, {
    key: "applyPatches",
    value: function applyPatches(base, patches) {
      var i;
      for (i = patches.length - 1; i >= 0; i--) {
        var patch = patches[i];
        if (patch.path.length === 0 && patch.op === "replace") {
          base = patch.value;
          break;
        }
      }
      if (i > -1) {
        patches = patches.slice(i + 1);
      }
      var applyPatchesImpl = getPlugin("Patches").applyPatches_;
      if (isDraft(base)) {
        return applyPatchesImpl(base, patches);
      }
      return this.produce(base, function (draft) {
        return applyPatchesImpl(draft, patches);
      });
    }
  }]);
}();
function createProxy(value, parent) {
  var draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
  var scope = parent ? parent.scope_ : getCurrentScope();
  scope.drafts_.push(draft);
  return draft;
}

// src/core/current.ts
function current(value) {
  if (!isDraft(value)) die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value)) return value;
  var state = value[DRAFT_STATE];
  var copy;
  if (state) {
    if (!state.modified_) return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
  } else {
    copy = shallowCopy(value, true);
  }
  each(copy, function (key, childValue) {
    set(copy, key, currentImpl(childValue));
  });
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}

// src/plugins/patches.ts
function enablePatches() {
  var errorOffset = 16;
  if ((window.$DRWAF_DEBUG ? "development" : "production") !== "production") {
    errors.push('Sets cannot have "replace" patches.', function (op) {
      return "Unsupported patch operation: " + op;
    }, function (path) {
      return "Cannot apply patch, path doesn't resolve: " + path;
    }, "Patching reserved attributes like __proto__, prototype and constructor is not allowed");
  }
  var REPLACE = "replace";
  var ADD = "add";
  var REMOVE = "remove";
  function generatePatches_(state, basePath, patches, inversePatches) {
    switch (state.type_) {
      case 0 /* Object */:
      case 2 /* Map */:
        return generatePatchesFromAssigned(state, basePath, patches, inversePatches);
      case 1 /* Array */:
        return generateArrayPatches(state, basePath, patches, inversePatches);
      case 3 /* Set */:
        return generateSetPatches(state, basePath, patches, inversePatches);
    }
  }
  function generateArrayPatches(state, basePath, patches, inversePatches) {
    var base_ = state.base_,
      assigned_ = state.assigned_;
    var copy_ = state.copy_;
    if (copy_.length < base_.length) {
      ;
      var _ref3 = [copy_, base_];
      base_ = _ref3[0];
      copy_ = _ref3[1];
      var _ref4 = [inversePatches, patches];
      patches = _ref4[0];
      inversePatches = _ref4[1];
    }
    for (var i = 0; i < base_.length; i++) {
      if (assigned_[i] && copy_[i] !== base_[i]) {
        var path = basePath.concat([i]);
        patches.push({
          op: REPLACE,
          path: path,
          // Need to maybe clone it, as it can in fact be the original value
          // due to the base/copy inversion at the start of this function
          value: clonePatchValueIfNeeded(copy_[i])
        });
        inversePatches.push({
          op: REPLACE,
          path: path,
          value: clonePatchValueIfNeeded(base_[i])
        });
      }
    }
    for (var _i = base_.length; _i < copy_.length; _i++) {
      var _path = basePath.concat([_i]);
      patches.push({
        op: ADD,
        path: _path,
        // Need to maybe clone it, as it can in fact be the original value
        // due to the base/copy inversion at the start of this function
        value: clonePatchValueIfNeeded(copy_[_i])
      });
    }
    for (var _i2 = copy_.length - 1; base_.length <= _i2; --_i2) {
      var _path2 = basePath.concat([_i2]);
      inversePatches.push({
        op: REMOVE,
        path: _path2
      });
    }
  }
  function generatePatchesFromAssigned(state, basePath, patches, inversePatches) {
    var base_ = state.base_,
      copy_ = state.copy_;
    each(state.assigned_, function (key, assignedValue) {
      var origValue = get(base_, key);
      var value = get(copy_, key);
      var op = !assignedValue ? REMOVE : has(base_, key) ? REPLACE : ADD;
      if (origValue === value && op === REPLACE) return;
      var path = basePath.concat(key);
      patches.push(op === REMOVE ? {
        op: op,
        path: path
      } : {
        op: op,
        path: path,
        value: value
      });
      inversePatches.push(op === ADD ? {
        op: REMOVE,
        path: path
      } : op === REMOVE ? {
        op: ADD,
        path: path,
        value: clonePatchValueIfNeeded(origValue)
      } : {
        op: REPLACE,
        path: path,
        value: clonePatchValueIfNeeded(origValue)
      });
    });
  }
  function generateSetPatches(state, basePath, patches, inversePatches) {
    var base_ = state.base_,
      copy_ = state.copy_;
    var i = 0;
    base_.forEach(function (value) {
      if (!copy_.has(value)) {
        var path = basePath.concat([i]);
        patches.push({
          op: REMOVE,
          path: path,
          value: value
        });
        inversePatches.unshift({
          op: ADD,
          path: path,
          value: value
        });
      }
      i++;
    });
    i = 0;
    copy_.forEach(function (value) {
      if (!base_.has(value)) {
        var path = basePath.concat([i]);
        patches.push({
          op: ADD,
          path: path,
          value: value
        });
        inversePatches.unshift({
          op: REMOVE,
          path: path,
          value: value
        });
      }
      i++;
    });
  }
  function generateReplacementPatches_(baseValue, replacement, patches, inversePatches) {
    patches.push({
      op: REPLACE,
      path: [],
      value: replacement === NOTHING ? void 0 : replacement
    });
    inversePatches.push({
      op: REPLACE,
      path: [],
      value: baseValue
    });
  }
  function applyPatches_(draft, patches) {
    patches.forEach(function (patch) {
      var path = patch.path,
        op = patch.op;
      var base = draft;
      for (var i = 0; i < path.length - 1; i++) {
        var parentType = getArchtype(base);
        var p = path[i];
        if (typeof p !== "string" && typeof p !== "number") {
          p = "" + p;
        }
        if ((parentType === 0 /* Object */ || parentType === 1 /* Array */) && (p === "__proto__" || p === "constructor")) die(errorOffset + 3);
        if (typeof base === "function" && p === "prototype") die(errorOffset + 3);
        base = get(base, p);
        if (_typeof(base) !== "object") die(errorOffset + 2, path.join("/"));
      }
      var type = getArchtype(base);
      var value = deepClonePatchValue(patch.value);
      var key = path[path.length - 1];
      switch (op) {
        case REPLACE:
          switch (type) {
            case 2 /* Map */:
              return base.set(key, value);
            case 3 /* Set */:
              die(errorOffset);
            default:
              return base[key] = value;
          }
        case ADD:
          switch (type) {
            case 1 /* Array */:
              return key === "-" ? base.push(value) : base.splice(key, 0, value);
            case 2 /* Map */:
              return base.set(key, value);
            case 3 /* Set */:
              return base.add(value);
            default:
              return base[key] = value;
          }
        case REMOVE:
          switch (type) {
            case 1 /* Array */:
              return base.splice(key, 1);
            case 2 /* Map */:
              return base["delete"](key);
            case 3 /* Set */:
              return base["delete"](patch.value);
            default:
              return delete base[key];
          }
        default:
          die(errorOffset + 1, op);
      }
    });
    return draft;
  }
  function deepClonePatchValue(obj) {
    if (!isDraftable(obj)) return obj;
    if (Array.isArray(obj)) return obj.map(deepClonePatchValue);
    if (isMap(obj)) return new Map(Array.from(obj.entries()).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        k = _ref6[0],
        v = _ref6[1];
      return [k, deepClonePatchValue(v)];
    }));
    if (isSet(obj)) return new Set(Array.from(obj).map(deepClonePatchValue));
    var cloned = Object.create(_getPrototypeOf(obj));
    for (var key in obj) cloned[key] = deepClonePatchValue(obj[key]);
    if (has(obj, DRAFTABLE)) cloned[DRAFTABLE] = obj[DRAFTABLE];
    return cloned;
  }
  function clonePatchValueIfNeeded(obj) {
    if (isDraft(obj)) {
      return deepClonePatchValue(obj);
    } else return obj;
  }
  loadPlugin("Patches", {
    applyPatches_: applyPatches_,
    generatePatches_: generatePatches_,
    generateReplacementPatches_: generateReplacementPatches_
  });
}

// src/plugins/mapset.ts
function enableMapSet() {
  var DraftMap = /*#__PURE__*/function (_Map, _ref7) {
    function DraftMap(target, parent) {
      var _this3;
      _classCallCheck(this, DraftMap);
      _this3 = _callSuper(this, DraftMap);
      _this3[DRAFT_STATE] = {
        type_: 2 /* Map */,
        parent_: parent,
        scope_: parent ? parent.scope_ : getCurrentScope(),
        modified_: false,
        finalized_: false,
        copy_: void 0,
        assigned_: void 0,
        base_: target,
        draft_: _this3,
        isManual_: false,
        revoked_: false
      };
      return _this3;
    }
    _inherits(DraftMap, _Map);
    return _createClass(DraftMap, [{
      key: "size",
      get: function get() {
        return latest(this[DRAFT_STATE]).size;
      }
    }, {
      key: "has",
      value: function has(key) {
        return latest(this[DRAFT_STATE]).has(key);
      }
    }, {
      key: "set",
      value: function set(key, value) {
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (!latest(state).has(key) || latest(state).get(key) !== value) {
          prepareMapCopy(state);
          markChanged(state);
          state.assigned_.set(key, true);
          state.copy_.set(key, value);
          state.assigned_.set(key, true);
        }
        return this;
      }
    }, {
      key: "delete",
      value: function _delete(key) {
        if (!this.has(key)) {
          return false;
        }
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        prepareMapCopy(state);
        markChanged(state);
        if (state.base_.has(key)) {
          state.assigned_.set(key, false);
        } else {
          state.assigned_["delete"](key);
        }
        state.copy_["delete"](key);
        return true;
      }
    }, {
      key: "clear",
      value: function clear() {
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (latest(state).size) {
          prepareMapCopy(state);
          markChanged(state);
          state.assigned_ = /* @__PURE__ */new Map();
          each(state.base_, function (key) {
            state.assigned_.set(key, false);
          });
          state.copy_.clear();
        }
      }
    }, {
      key: "forEach",
      value: function forEach(cb, thisArg) {
        var _this4 = this;
        var state = this[DRAFT_STATE];
        latest(state).forEach(function (_value, key, _map) {
          cb.call(thisArg, _this4.get(key), key, _this4);
        });
      }
    }, {
      key: "get",
      value: function get(key) {
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        var value = latest(state).get(key);
        if (state.finalized_ || !isDraftable(value)) {
          return value;
        }
        if (value !== state.base_.get(key)) {
          return value;
        }
        var draft = createProxy(value, state);
        prepareMapCopy(state);
        state.copy_.set(key, draft);
        return draft;
      }
    }, {
      key: "keys",
      value: function keys() {
        return latest(this[DRAFT_STATE]).keys();
      }
    }, {
      key: "values",
      value: function values() {
        var _this5 = this;
        var iterator = this.keys();
        return _defineProperty(_defineProperty({}, Symbol.iterator, function () {
          return _this5.values();
        }), "next", function next() {
          var r = iterator.next();
          if (r.done) return r;
          var value = _this5.get(r.value);
          return {
            done: false,
            value: value
          };
        });
      }
    }, {
      key: "entries",
      value: function entries() {
        var _this6 = this;
        var iterator = this.keys();
        return _defineProperty(_defineProperty({}, Symbol.iterator, function () {
          return _this6.entries();
        }), "next", function next() {
          var r = iterator.next();
          if (r.done) return r;
          var value = _this6.get(r.value);
          return {
            done: false,
            value: [r.value, value]
          };
        });
      }
    }, {
      key: _ref7,
      value: function value() {
        return this.entries();
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(Map), (DRAFT_STATE, Symbol.iterator));
  function proxyMap_(target, parent) {
    return new DraftMap(target, parent);
  }
  function prepareMapCopy(state) {
    if (!state.copy_) {
      state.assigned_ = /* @__PURE__ */new Map();
      state.copy_ = new Map(state.base_);
    }
  }
  var DraftSet = /*#__PURE__*/function (_Set, _ref10) {
    function DraftSet(target, parent) {
      var _this7;
      _classCallCheck(this, DraftSet);
      _this7 = _callSuper(this, DraftSet);
      _this7[DRAFT_STATE] = {
        type_: 3 /* Set */,
        parent_: parent,
        scope_: parent ? parent.scope_ : getCurrentScope(),
        modified_: false,
        finalized_: false,
        copy_: void 0,
        base_: target,
        draft_: _this7,
        drafts_: /* @__PURE__ */new Map(),
        revoked_: false,
        isManual_: false
      };
      return _this7;
    }
    _inherits(DraftSet, _Set);
    return _createClass(DraftSet, [{
      key: "size",
      get: function get() {
        return latest(this[DRAFT_STATE]).size;
      }
    }, {
      key: "has",
      value: function has(value) {
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (!state.copy_) {
          return state.base_.has(value);
        }
        if (state.copy_.has(value)) return true;
        if (state.drafts_.has(value) && state.copy_.has(state.drafts_.get(value))) return true;
        return false;
      }
    }, {
      key: "add",
      value: function add(value) {
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (!this.has(value)) {
          prepareSetCopy(state);
          markChanged(state);
          state.copy_.add(value);
        }
        return this;
      }
    }, {
      key: "delete",
      value: function _delete(value) {
        if (!this.has(value)) {
          return false;
        }
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        prepareSetCopy(state);
        markChanged(state);
        return state.copy_["delete"](value) || (state.drafts_.has(value) ? state.copy_["delete"](state.drafts_.get(value)) : (/* istanbul ignore next */
        false));
      }
    }, {
      key: "clear",
      value: function clear() {
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (latest(state).size) {
          prepareSetCopy(state);
          markChanged(state);
          state.copy_.clear();
        }
      }
    }, {
      key: "values",
      value: function values() {
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        prepareSetCopy(state);
        return state.copy_.values();
      }
    }, {
      key: "entries",
      value: function entries() {
        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        prepareSetCopy(state);
        return state.copy_.entries();
      }
    }, {
      key: "keys",
      value: function keys() {
        return this.values();
      }
    }, {
      key: _ref10,
      value: function value() {
        return this.values();
      }
    }, {
      key: "forEach",
      value: function forEach(cb, thisArg) {
        var iterator = this.values();
        var result = iterator.next();
        while (!result.done) {
          cb.call(thisArg, result.value, result.value, this);
          result = iterator.next();
        }
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(Set), (DRAFT_STATE, Symbol.iterator));
  function proxySet_(target, parent) {
    return new DraftSet(target, parent);
  }
  function prepareSetCopy(state) {
    if (!state.copy_) {
      state.copy_ = /* @__PURE__ */new Set();
      state.base_.forEach(function (value) {
        if (isDraftable(value)) {
          var draft = createProxy(value, state);
          state.drafts_.set(value, draft);
          state.copy_.add(draft);
        } else {
          state.copy_.add(value);
        }
      });
    }
  }
  function assertUnrevoked(state) {
    if (state.revoked_) die(3, JSON.stringify(latest(state)));
  }
  loadPlugin("MapSet", {
    proxyMap_: proxyMap_,
    proxySet_: proxySet_
  });
}

// src/immer.ts
var immer = new Immer2();
var produce = exports.produce = immer.produce;
var produceWithPatches = exports.produceWithPatches = immer.produceWithPatches.bind(immer);
var setAutoFreeze = exports.setAutoFreeze = immer.setAutoFreeze.bind(immer);
var setUseStrictShallowCopy = exports.setUseStrictShallowCopy = immer.setUseStrictShallowCopy.bind(immer);
var applyPatches = exports.applyPatches = immer.applyPatches.bind(immer);
var createDraft = exports.createDraft = immer.createDraft.bind(immer);
var finishDraft = exports.finishDraft = immer.finishDraft.bind(immer);
function castDraft(value) {
  return value;
}
function castImmutable(value) {
  return value;
}
    });
  