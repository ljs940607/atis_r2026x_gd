
    define( function(require, exports, module) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPatches = exports.Immer = void 0;
exports.castDraft = tr;
exports.castImmutable = rr;
exports.createDraft = void 0;
exports.current = fe;
exports.enableMapSet = Ae;
exports.enablePatches = Te;
exports.finishDraft = void 0;
exports.freeze = H;
exports.immerable = void 0;
exports.isDraft = O;
exports.isDraftable = I;
exports.nothing = void 0;
exports.original = Se;
exports.setUseStrictShallowCopy = exports.setAutoFreeze = exports.produceWithPatches = exports.produce = void 0;
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var R = exports.nothing = Symbol["for"]("immer-nothing"),
  z = exports.immerable = Symbol["for"]("immer-draftable"),
  u = Symbol["for"]("immer-state");
function h(e) {
  throw new Error("[Immer] minified error nr: ".concat(e, ". Full error at: https://bit.ly/3cXEKWf"));
}
var N = Object.getPrototypeOf;
function O(e) {
  return !!e && !!e[u];
}
function I(e) {
  var _e$constructor;
  return e ? ue(e) || Array.isArray(e) || !!e[z] || !!((_e$constructor = e.constructor) !== null && _e$constructor !== void 0 && _e$constructor[z]) || v(e) || k(e) : !1;
}
var me = Object.prototype.constructor.toString();
function ue(e) {
  if (!e || _typeof(e) != "object") return !1;
  var t = N(e);
  if (t === null) return !0;
  var r = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return r === Object ? !0 : typeof r == "function" && Function.toString.call(r) === me;
}
function Se(e) {
  return O(e) || h(15, e), e[u].t;
}
function _(e, t) {
  j(e) === 0 ? Reflect.ownKeys(e).forEach(function (r) {
    t(r, e[r], e);
  }) : e.forEach(function (r, n) {
    return t(n, r, e);
  });
}
function j(e) {
  var t = e[u];
  return t ? t.o : Array.isArray(e) ? 1 : v(e) ? 2 : k(e) ? 3 : 0;
}
function C(e, t) {
  return j(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function J(e, t) {
  return j(e) === 2 ? e.get(t) : e[t];
}
function X(e, t, r) {
  var n = j(e);
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r;
}
function ye(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function v(e) {
  return e instanceof Map;
}
function k(e) {
  return e instanceof Set;
}
function T(e) {
  return e.e || e.t;
}
function L(e, t) {
  if (v(e)) return new Map(e);
  if (k(e)) return new Set(e);
  if (Array.isArray(e)) return Array.prototype.slice.call(e);
  var r = ue(e);
  if (t === !0 || t === "class_only" && !r) {
    var n = Object.getOwnPropertyDescriptors(e);
    delete n[u];
    var i = Reflect.ownKeys(n);
    for (var f = 0; f < i.length; f++) {
      var l = i[f],
        c = n[l];
      c.writable === !1 && (c.writable = !0, c.configurable = !0), (c.get || c.set) && (n[l] = {
        configurable: !0,
        writable: !0,
        enumerable: c.enumerable,
        value: e[l]
      });
    }
    return Object.create(N(e), n);
  } else {
    var _n = N(e);
    if (_n !== null && r) return _objectSpread({}, e);
    var _i = Object.create(_n);
    return Object.assign(_i, e);
  }
}
function H(e) {
  var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;
  return $(e) || O(e) || !I(e) || (j(e) > 1 && (e.set = e.add = e.clear = e["delete"] = Pe), Object.freeze(e), t && Object.entries(e).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      r = _ref2[0],
      n = _ref2[1];
    return H(n, !0);
  })), e;
}
function Pe() {
  h(2);
}
function $(e) {
  return Object.isFrozen(e);
}
var re = {};
function w(e) {
  var t = re[e];
  return t || h(0, e), t;
}
function Q(e, t) {
  re[e] || (re[e] = t);
}
var U;
function K() {
  return U;
}
function xe(e, t) {
  return {
    a: [],
    i: e,
    p: t,
    P: !0,
    d: 0
  };
}
function ne(e, t) {
  t && (w("Patches"), e.f = [], e.h = [], e.b = t);
}
function V(e) {
  Y(e), e.a.forEach(ge), e.a = null;
}
function Y(e) {
  e === U && (U = e.i);
}
function ae(e) {
  return U = xe(U, e);
}
function ge(e) {
  var t = e[u];
  t.o === 0 || t.o === 1 ? t.x() : t.m = !0;
}
function oe(e, t) {
  t.d = t.a.length;
  var r = t.a[0];
  return e !== void 0 && e !== r ? (r[u].s && (V(t), h(4)), I(e) && (e = Z(t, e), t.i || ee(t, e)), t.f && w("Patches").T(r[u].t, e, t.f, t.h)) : e = Z(t, r, []), V(t), t.f && t.b(t.f, t.h), e !== R ? e : void 0;
}
function Z(e, t, r) {
  if ($(t)) return t;
  var n = t[u];
  if (!n) return _(t, function (i, f) {
    return le(e, n, t, i, f, r);
  }), t;
  if (n.n !== e) return t;
  if (!n.s) return ee(e, n.t, !0), n.t;
  if (!n.c) {
    n.c = !0, n.n.d--;
    var i = n.e,
      f = i,
      l = !1;
    n.o === 3 && (f = new Set(i), i.clear(), l = !0), _(f, function (c, b) {
      return le(e, n, i, c, b, r, l);
    }), ee(e, i, !1), r && e.f && w("Patches").g(n, r, e.f, e.h);
  }
  return n.e;
}
function le(e, t, r, n, i, f, l) {
  if (O(i)) {
    var c = f && t && t.o !== 3 && !C(t.r, n) ? f.concat(n) : void 0,
      b = Z(e, i, c);
    if (X(r, n, b), O(b)) e.P = !1;else return;
  } else l && r.add(i);
  if (I(i) && !$(i)) {
    if (!e.p.y && e.d < 1) return;
    Z(e, i), (!t || !t.n.i) && _typeof(n) != "symbol" && Object.prototype.propertyIsEnumerable.call(r, n) && ee(e, i);
  }
}
function ee(e, t) {
  var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !1;
  !e.i && e.p.y && e.P && H(t, r);
}
function pe(e, t) {
  var r = Array.isArray(e),
    n = {
      o: r ? 1 : 0,
      n: t ? t.n : K(),
      s: !1,
      c: !1,
      r: {},
      i: t,
      t: e,
      u: null,
      e: null,
      x: null,
      l: !1
    },
    i = n,
    f = ce;
  r && (i = [n], f = q);
  var _Proxy$revocable = Proxy.revocable(i, f),
    l = _Proxy$revocable.revoke,
    c = _Proxy$revocable.proxy;
  return n.u = c, n.x = l, c;
}
var ce = {
    get: function get(e, t) {
      if (t === u) return e;
      var r = T(e);
      if (!C(r, t)) return be(e, r, t);
      var n = r[t];
      return e.c || !I(n) ? n : n === ie(e.t, t) ? (se(e), e.e[t] = B(n, e)) : n;
    },
    has: function has(e, t) {
      return t in T(e);
    },
    ownKeys: function ownKeys(e) {
      return Reflect.ownKeys(T(e));
    },
    set: function set(e, t, r) {
      var n = de(T(e), t);
      if (n !== null && n !== void 0 && n.set) return n.set.call(e.u, r), !0;
      if (!e.s) {
        var i = ie(T(e), t),
          f = i === null || i === void 0 ? void 0 : i[u];
        if (f && f.t === r) return e.e[t] = r, e.r[t] = !1, !0;
        if (ye(r, i) && (r !== void 0 || C(e.t, t))) return !0;
        se(e), E(e);
      }
      return e.e[t] === r && (r !== void 0 || t in e.e) || Number.isNaN(r) && Number.isNaN(e.e[t]) || (e.e[t] = r, e.r[t] = !0), !0;
    },
    deleteProperty: function deleteProperty(e, t) {
      return ie(e.t, t) !== void 0 || t in e.t ? (e.r[t] = !1, se(e), E(e)) : delete e.r[t], e.e && delete e.e[t], !0;
    },
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(e, t) {
      var r = T(e),
        n = Reflect.getOwnPropertyDescriptor(r, t);
      return n && {
        writable: !0,
        configurable: e.o !== 1 || t !== "length",
        enumerable: n.enumerable,
        value: r[t]
      };
    },
    defineProperty: function defineProperty() {
      h(11);
    },
    getPrototypeOf: function getPrototypeOf(e) {
      return N(e.t);
    },
    setPrototypeOf: function setPrototypeOf() {
      h(12);
    }
  },
  q = {};
_(ce, function (e, t) {
  q[e] = function () {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
});
q.deleteProperty = function (e, t) {
  return q.set.call(this, e, t, void 0);
};
q.set = function (e, t, r) {
  return ce.set.call(this, e[0], t, r, e[0]);
};
function ie(e, t) {
  var r = e[u];
  return (r ? T(r) : e)[t];
}
function be(e, t, r) {
  var _n$get;
  var n = de(t, r);
  return n ? "value" in n ? n.value : (_n$get = n.get) === null || _n$get === void 0 ? void 0 : _n$get.call(e.u) : void 0;
}
function de(e, t) {
  if (!(t in e)) return;
  var r = N(e);
  for (; r;) {
    var n = Object.getOwnPropertyDescriptor(r, t);
    if (n) return n;
    r = N(r);
  }
}
function E(e) {
  e.s || (e.s = !0, e.i && E(e.i));
}
function se(e) {
  e.e || (e.e = L(e.t, e.n.p.S));
}
var te = exports.Immer = /*#__PURE__*/function () {
  function te(t) {
    var _this = this;
    _classCallCheck(this, te);
    this.y = !0;
    this.S = !1;
    this.produce = function (t, r, n) {
      if (typeof t == "function" && typeof r != "function") {
        var f = r;
        r = t;
        var l = _this;
        return function () {
          var _this2 = this;
          var b = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : f;
          for (var _len = arguments.length, a = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            a[_key - 1] = arguments[_key];
          }
          return l.produce(b, function (o) {
            var _r;
            return (_r = r).call.apply(_r, [_this2, o].concat(a));
          });
        };
      }
      typeof r != "function" && h(6), n !== void 0 && typeof n != "function" && h(7);
      var i;
      if (I(t)) {
        var _f = ae(_this),
          _l = B(t, void 0),
          c = !0;
        try {
          i = r(_l), c = !1;
        } finally {
          c ? V(_f) : Y(_f);
        }
        return ne(_f, n), oe(i, _f);
      } else if (!t || _typeof(t) != "object") {
        if (i = r(t), i === void 0 && (i = t), i === R && (i = void 0), _this.y && H(i, !0), n) {
          var _f2 = [],
            _l2 = [];
          w("Patches").T(t, i, _f2, _l2), n(_f2, _l2);
        }
        return i;
      } else h(1, t);
    };
    this.produceWithPatches = function (t, r) {
      if (typeof t == "function") return function (l) {
        for (var _len2 = arguments.length, c = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          c[_key2 - 1] = arguments[_key2];
        }
        return _this.produceWithPatches(l, function (b) {
          return t.apply(void 0, [b].concat(c));
        });
      };
      var n, i;
      return [_this.produce(t, r, function (l, c) {
        n = l, i = c;
      }), n, i];
    };
    typeof (t === null || t === void 0 ? void 0 : t.autoFreeze) == "boolean" && this.setAutoFreeze(t.autoFreeze), typeof (t === null || t === void 0 ? void 0 : t.useStrictShallowCopy) == "boolean" && this.setUseStrictShallowCopy(t.useStrictShallowCopy);
  }
  return _createClass(te, [{
    key: "createDraft",
    value: function createDraft(t) {
      I(t) || h(8), O(t) && (t = fe(t));
      var r = ae(this),
        n = B(t, void 0);
      return n[u].l = !0, Y(r), n;
    }
  }, {
    key: "finishDraft",
    value: function finishDraft(t, r) {
      var n = t && t[u];
      (!n || !n.l) && h(9);
      var i = n.n;
      return ne(i, r), oe(void 0, i);
    }
  }, {
    key: "setAutoFreeze",
    value: function setAutoFreeze(t) {
      this.y = t;
    }
  }, {
    key: "setUseStrictShallowCopy",
    value: function setUseStrictShallowCopy(t) {
      this.S = t;
    }
  }, {
    key: "applyPatches",
    value: function applyPatches(t, r) {
      var n;
      for (n = r.length - 1; n >= 0; n--) {
        var f = r[n];
        if (f.path.length === 0 && f.op === "replace") {
          t = f.value;
          break;
        }
      }
      n > -1 && (r = r.slice(n + 1));
      var i = w("Patches").A;
      return O(t) ? i(t, r) : this.produce(t, function (f) {
        return i(f, r);
      });
    }
  }]);
}();
function B(e, t) {
  var r = v(e) ? w("MapSet").I(e, t) : k(e) ? w("MapSet").D(e, t) : pe(e, t);
  return (t ? t.n : K()).a.push(r), r;
}
function fe(e) {
  return O(e) || h(10, e), he(e);
}
function he(e) {
  if (!I(e) || $(e)) return e;
  var t = e[u],
    r;
  if (t) {
    if (!t.s) return t.t;
    t.c = !0, r = L(e, t.n.p.S);
  } else r = L(e, !0);
  return _(r, function (n, i) {
    X(r, n, he(i));
  }), t && (t.c = !1), r;
}
function Te() {
  var t = "replace",
    r = "add",
    n = "remove";
  function i(s, S, m, x) {
    switch (s.o) {
      case 0:
      case 2:
        return l(s, S, m, x);
      case 1:
        return f(s, S, m, x);
      case 3:
        return c(s, S, m, x);
    }
  }
  function f(s, S, m, x) {
    var _ref3, _ref4;
    var A = s.t,
      P = s.r,
      g = s.e;
    g.length < A.length && (_ref3 = [g, A], A = _ref3[0], g = _ref3[1], _ref4 = [x, m], m = _ref4[0], x = _ref4[1]);
    for (var y = 0; y < A.length; y++) if (P[y] && g[y] !== A[y]) {
      var d = S.concat([y]);
      m.push({
        op: t,
        path: d,
        value: p(g[y])
      }), x.push({
        op: t,
        path: d,
        value: p(A[y])
      });
    }
    for (var _y = A.length; _y < g.length; _y++) {
      var _d = S.concat([_y]);
      m.push({
        op: r,
        path: _d,
        value: p(g[_y])
      });
    }
    for (var _y2 = g.length - 1; A.length <= _y2; --_y2) {
      var _d2 = S.concat([_y2]);
      x.push({
        op: n,
        path: _d2
      });
    }
  }
  function l(s, S, m, x) {
    var A = s.t,
      P = s.e;
    _(s.r, function (g, y) {
      var d = J(A, g),
        W = J(P, g),
        F = y ? C(A, g) ? t : r : n;
      if (d === W && F === t) return;
      var D = S.concat(g);
      m.push(F === n ? {
        op: F,
        path: D
      } : {
        op: F,
        path: D,
        value: W
      }), x.push(F === r ? {
        op: n,
        path: D
      } : F === n ? {
        op: r,
        path: D,
        value: p(d)
      } : {
        op: t,
        path: D,
        value: p(d)
      });
    });
  }
  function c(s, S, m, x) {
    var A = s.t,
      P = s.e,
      g = 0;
    A.forEach(function (y) {
      if (!P.has(y)) {
        var d = S.concat([g]);
        m.push({
          op: n,
          path: d,
          value: y
        }), x.unshift({
          op: r,
          path: d,
          value: y
        });
      }
      g++;
    }), g = 0, P.forEach(function (y) {
      if (!A.has(y)) {
        var d = S.concat([g]);
        m.push({
          op: r,
          path: d,
          value: y
        }), x.unshift({
          op: n,
          path: d,
          value: y
        });
      }
      g++;
    });
  }
  function b(s, S, m, x) {
    m.push({
      op: t,
      path: [],
      value: S === R ? void 0 : S
    }), x.push({
      op: t,
      path: [],
      value: s
    });
  }
  function a(s, S) {
    return S.forEach(function (m) {
      var x = m.path,
        A = m.op,
        P = s;
      for (var W = 0; W < x.length - 1; W++) {
        var F = j(P),
          D = x[W];
        typeof D != "string" && typeof D != "number" && (D = "" + D), (F === 0 || F === 1) && (D === "__proto__" || D === "constructor") && h(16 + 3), typeof P == "function" && D === "prototype" && h(16 + 3), P = J(P, D), _typeof(P) != "object" && h(16 + 2, x.join("/"));
      }
      var g = j(P),
        y = o(m.value),
        d = x[x.length - 1];
      switch (A) {
        case t:
          switch (g) {
            case 2:
              return P.set(d, y);
            case 3:
              h(16);
            default:
              return P[d] = y;
          }
        case r:
          switch (g) {
            case 1:
              return d === "-" ? P.push(y) : P.splice(d, 0, y);
            case 2:
              return P.set(d, y);
            case 3:
              return P.add(y);
            default:
              return P[d] = y;
          }
        case n:
          switch (g) {
            case 1:
              return P.splice(d, 1);
            case 2:
              return P["delete"](d);
            case 3:
              return P["delete"](m.value);
            default:
              return delete P[d];
          }
        default:
          h(16 + 1, A);
      }
    }), s;
  }
  function o(s) {
    if (!I(s)) return s;
    if (Array.isArray(s)) return s.map(o);
    if (v(s)) return new Map(Array.from(s.entries()).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        m = _ref6[0],
        x = _ref6[1];
      return [m, o(x)];
    }));
    if (k(s)) return new Set(Array.from(s).map(o));
    var S = Object.create(N(s));
    for (var m in s) S[m] = o(s[m]);
    return C(s, z) && (S[z] = s[z]), S;
  }
  function p(s) {
    return O(s) ? o(s) : s;
  }
  Q("Patches", {
    A: a,
    g: i,
    T: b
  });
}
function Ae() {
  var e = /*#__PURE__*/function (_Map, _ref7) {
    function e(a, o) {
      var _this3;
      _classCallCheck(this, e);
      _this3 = _callSuper(this, e);
      _this3[u] = {
        o: 2,
        i: o,
        n: o ? o.n : K(),
        s: !1,
        c: !1,
        e: void 0,
        r: void 0,
        t: a,
        u: _this3,
        l: !1,
        m: !1
      };
      return _this3;
    }
    _inherits(e, _Map);
    return _createClass(e, [{
      key: "size",
      get: function get() {
        return T(this[u]).size;
      }
    }, {
      key: "has",
      value: function has(a) {
        return T(this[u]).has(a);
      }
    }, {
      key: "set",
      value: function set(a, o) {
        var p = this[u];
        return l(p), (!T(p).has(a) || T(p).get(a) !== o) && (r(p), E(p), p.r.set(a, !0), p.e.set(a, o), p.r.set(a, !0)), this;
      }
    }, {
      key: "delete",
      value: function _delete(a) {
        if (!this.has(a)) return !1;
        var o = this[u];
        return l(o), r(o), E(o), o.t.has(a) ? o.r.set(a, !1) : o.r["delete"](a), o.e["delete"](a), !0;
      }
    }, {
      key: "clear",
      value: function clear() {
        var a = this[u];
        l(a), T(a).size && (r(a), E(a), a.r = new Map(), _(a.t, function (o) {
          a.r.set(o, !1);
        }), a.e.clear());
      }
    }, {
      key: "forEach",
      value: function forEach(a, o) {
        var _this4 = this;
        var p = this[u];
        T(p).forEach(function (s, S, m) {
          a.call(o, _this4.get(S), S, _this4);
        });
      }
    }, {
      key: "get",
      value: function get(a) {
        var o = this[u];
        l(o);
        var p = T(o).get(a);
        if (o.c || !I(p) || p !== o.t.get(a)) return p;
        var s = B(p, o);
        return r(o), o.e.set(a, s), s;
      }
    }, {
      key: "keys",
      value: function keys() {
        return T(this[u]).keys();
      }
    }, {
      key: "values",
      value: function values() {
        var _this5 = this;
        var a = this.keys();
        return _defineProperty(_defineProperty({}, Symbol.iterator, function () {
          return _this5.values();
        }), "next", function next() {
          var o = a.next();
          return o.done ? o : {
            done: !1,
            value: _this5.get(o.value)
          };
        });
      }
    }, {
      key: "entries",
      value: function entries() {
        var _this6 = this;
        var a = this.keys();
        return _defineProperty(_defineProperty({}, Symbol.iterator, function () {
          return _this6.entries();
        }), "next", function next() {
          var o = a.next();
          if (o.done) return o;
          var p = _this6.get(o.value);
          return {
            done: !1,
            value: [o.value, p]
          };
        });
      }
    }, {
      key: _ref7,
      value: function value() {
        return this.entries();
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(Map), (u, Symbol.iterator));
  function t(c, b) {
    return new e(c, b);
  }
  function r(c) {
    c.e || (c.r = new Map(), c.e = new Map(c.t));
  }
  var n = /*#__PURE__*/function (_Set, _ref10) {
    function n(a, o) {
      var _this7;
      _classCallCheck(this, n);
      _this7 = _callSuper(this, n);
      _this7[u] = {
        o: 3,
        i: o,
        n: o ? o.n : K(),
        s: !1,
        c: !1,
        e: void 0,
        t: a,
        u: _this7,
        a: new Map(),
        m: !1,
        l: !1
      };
      return _this7;
    }
    _inherits(n, _Set);
    return _createClass(n, [{
      key: "size",
      get: function get() {
        return T(this[u]).size;
      }
    }, {
      key: "has",
      value: function has(a) {
        var o = this[u];
        return l(o), o.e ? !!(o.e.has(a) || o.a.has(a) && o.e.has(o.a.get(a))) : o.t.has(a);
      }
    }, {
      key: "add",
      value: function add(a) {
        var o = this[u];
        return l(o), this.has(a) || (f(o), E(o), o.e.add(a)), this;
      }
    }, {
      key: "delete",
      value: function _delete(a) {
        if (!this.has(a)) return !1;
        var o = this[u];
        return l(o), f(o), E(o), o.e["delete"](a) || (o.a.has(a) ? o.e["delete"](o.a.get(a)) : !1);
      }
    }, {
      key: "clear",
      value: function clear() {
        var a = this[u];
        l(a), T(a).size && (f(a), E(a), a.e.clear());
      }
    }, {
      key: "values",
      value: function values() {
        var a = this[u];
        return l(a), f(a), a.e.values();
      }
    }, {
      key: "entries",
      value: function entries() {
        var a = this[u];
        return l(a), f(a), a.e.entries();
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
      value: function forEach(a, o) {
        var p = this.values(),
          s = p.next();
        for (; !s.done;) a.call(o, s.value, s.value, this), s = p.next();
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(Set), (u, Symbol.iterator));
  function i(c, b) {
    return new n(c, b);
  }
  function f(c) {
    c.e || (c.e = new Set(), c.t.forEach(function (b) {
      if (I(b)) {
        var a = B(b, c);
        c.a.set(b, a), c.e.add(a);
      } else c.e.add(b);
    }));
  }
  function l(c) {
    c.m && h(3, JSON.stringify(T(c)));
  }
  Q("MapSet", {
    I: t,
    D: i
  });
}
var M = new te(),
  qt = exports.produce = M.produce,
  Jt = exports.produceWithPatches = M.produceWithPatches.bind(M),
  Xt = exports.setAutoFreeze = M.setAutoFreeze.bind(M),
  Qt = exports.setUseStrictShallowCopy = M.setUseStrictShallowCopy.bind(M),
  Yt = exports.applyPatches = M.applyPatches.bind(M),
  Zt = exports.createDraft = M.createDraft.bind(M),
  er = exports.finishDraft = M.finishDraft.bind(M);
function tr(e) {
  return e;
}
function rr(e) {
  return e;
}
    });
  