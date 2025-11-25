import { openBlock as l, createElementBlock as u, normalizeClass as k, resolveComponent as O, resolveDirective as _e, withDirectives as H, createCommentVNode as p, renderSlot as C, createTextVNode as X, toDisplayString as w, createBlock as S, mergeProps as te, toHandlers as ot, ref as T, readonly as zn, watch as le, getCurrentScope as fo, onScopeDispose as po, unref as q, toRef as mo, customRef as vo, onMounted as $t, nextTick as Gt, getCurrentInstance as Us, shallowRef as Ws, computed as Y, defineComponent as Ae, watchEffect as jt, createVNode as x, Transition as It, withCtx as M, createElementVNode as g, Fragment as V, withModifiers as re, Teleport as En, normalizeStyle as K, vShow as Ve, renderList as j, pushScopeId as et, popScopeId as tt, createStaticVNode as go, inject as Te, resolveDynamicComponent as Wt, shallowReactive as mt, markRaw as Nn, reactive as pt, isRef as yo, h as je, vModelSelect as ks, vModelText as bo, normalizeProps as qe, guardReactiveProps as Xe, withKeys as Ct, mergeModels as Bt, useModel as nn, TransitionGroup as _o, useSlots as wo, onBeforeMount as ko, createSlots as qs, vModelRadio as Ss, toValue as _n, onUnmounted as So, render as Rn } from "vue";
const xt = {
  props: {
    color: {
      type: String,
      default: () => "default"
    }
  }
}, Oe = {
  props: {
    disabled: {
      type: Boolean,
      default: () => !1
    }
  }
}, A = (e, n) => {
  const t = e.__vccOpts || e;
  for (const [i, o] of n)
    t[i] = o;
  return t;
}, Io = {
  name: "vu-divider",
  props: {
    vertical: {
      type: Boolean
    }
  }
};
function Co(e, n, t, i, o, s) {
  return l(), u("hr", {
    class: k(["vu-divider", { vertical: t.vertical }])
  }, null, 2);
}
const Ks = /* @__PURE__ */ A(Io, [["render", Co], ["__scopeId", "data-v-35db60fe"]]), Bo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ks
}, Symbol.toStringTag, { value: "Module" })), Oo = {
  name: "vu-badge",
  mixins: [xt, Oe],
  emits: ["close", "selected", "update:modelValue"],
  components: { VuDivider: Ks },
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
    rounded: {
      type: Boolean
    },
    alternate: {
      type: Boolean
    },
    badge2: {
      type: String,
      default: () => ""
    },
    badge3: {
      type: String,
      default: () => ""
    },
    icon: {
      type: String,
      default: () => ""
    },
    selectable: {
      type: Boolean,
      default: () => !1
    },
    selected: {
      type: Boolean,
      default: () => !1
    },
    togglable: {
      type: Boolean,
      default: () => !0
    },
    closable: {
      type: Boolean,
      default: () => !1
    }
  },
  data() {
    return {
      isSelected: !1
    };
  },
  computed: {
    classes() {
      return [
        "vu-badge",
        `badge-root badge badge-${this.color}`,
        {
          "badge-alternate": this.alternate,
          rounded: this.rounded,
          "badge-closable": this.closable,
          "badge-selectable": this.selectable,
          disabled: this.disabled,
          "badge-selected": this.isSelected || this.selected || this.value,
          "badge-icon": this.icon
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
      this.selectable && this.value === void 0 && this.togglable && (this.isSelected = !1);
    },
    selectBadge() {
      this.selectable && (this.value === void 0 && (this.isSelected = this.togglable ? !this.isSelected : !0), this.$emit("selected", this.isSelected), this.$emit("update:modelValue", this.isSelected));
    }
  }
}, $o = {
  key: 1,
  class: "badge-content"
}, xo = {
  key: 5,
  class: "badge-content"
};
function To(e, n, t, i, o, s) {
  const a = O("VuDivider"), d = _e("click-outside");
  return H((l(), u("span", {
    class: k(s.classes),
    onClick: n[1] || (n[1] = (c) => s.selectBadge(c))
  }, [
    t.icon ? (l(), u("span", {
      key: 0,
      class: k(s.iconClasses)
    }, null, 2)) : p("", !0),
    s.showContent ? (l(), u("span", $o, [
      C(e.$slots, "default", {}, () => [
        X(w(t.text), 1)
      ], !0)
    ])) : p("", !0),
    t.badge2 ? (l(), S(a, {
      key: 2,
      vertical: ""
    })) : p("", !0),
    t.badge2 ? (l(), u("span", {
      key: 3,
      class: k(["badge-content", { "badge-center": t.badge3 }])
    }, w(t.badge2), 3)) : p("", !0),
    t.badge3 ? (l(), S(a, {
      key: 4,
      vertical: ""
    })) : p("", !0),
    t.badge3 ? (l(), u("span", xo, w(t.badge3), 1)) : p("", !0),
    t.closable ? (l(), u("span", {
      key: 6,
      class: "fonticon fonticon-cancel",
      onClick: n[0] || (n[0] = (c) => e.$emit("close"))
    })) : p("", !0)
  ], 2)), [
    [d, s.onClickOutside]
  ]);
}
const Hn = /* @__PURE__ */ A(Oo, [["render", To], ["__scopeId", "data-v-d0431d52"]]), Vo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Hn
}, Symbol.toStringTag, { value: "Module" })), Gs = {
  props: {
    size: {
      type: String,
      default: () => ""
    }
  }
}, Mo = /^on[^a-z]/, Po = (e) => Mo.test(e), Ze = (e, n) => {
  const t = {};
  for (const i in e)
    Po(i) && (t[n ? i[2].toLowerCase() + i.slice(3) : i] = e[i]);
  return t;
}, Lo = {
  name: "vu-icon",
  mixins: [xt, Gs],
  data: () => ({
    getListenersFromAttrs: Ze
  }),
  props: {
    icon: {
      required: !0,
      type: String
    },
    withinText: {
      default: !0,
      type: Boolean
    }
  }
};
function Do(e, n, t, i, o, s) {
  return l(), u("span", te({
    class: ["vu-icon fonticon", [t.withinText ? "fonticon-within-text" : "", `fonticon-${t.icon}`, `${e.color}`, `${e.size}`]]
  }, ot(e.getListenersFromAttrs(e.$attrs), !0)), null, 16);
}
const pe = /* @__PURE__ */ A(Lo, [["render", Do], ["__scopeId", "data-v-887cd079"]]), Ao = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pe
}, Symbol.toStringTag, { value: "Module" }));
function Fo(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ys = { exports: {} }, ge = Ys.exports = {}, Ue, We;
function Bn() {
  throw new Error("setTimeout has not been defined");
}
function On() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Ue = setTimeout : Ue = Bn;
  } catch {
    Ue = Bn;
  }
  try {
    typeof clearTimeout == "function" ? We = clearTimeout : We = On;
  } catch {
    We = On;
  }
})();
function Xs(e) {
  if (Ue === setTimeout)
    return setTimeout(e, 0);
  if ((Ue === Bn || !Ue) && setTimeout)
    return Ue = setTimeout, setTimeout(e, 0);
  try {
    return Ue(e, 0);
  } catch {
    try {
      return Ue.call(null, e, 0);
    } catch {
      return Ue.call(this, e, 0);
    }
  }
}
function zo(e) {
  if (We === clearTimeout)
    return clearTimeout(e);
  if ((We === On || !We) && clearTimeout)
    return We = clearTimeout, clearTimeout(e);
  try {
    return We(e);
  } catch {
    try {
      return We.call(null, e);
    } catch {
      return We.call(this, e);
    }
  }
}
var Je = [], St = !1, ht, tn = -1;
function Eo() {
  !St || !ht || (St = !1, ht.length ? Je = ht.concat(Je) : tn = -1, Je.length && Js());
}
function Js() {
  if (!St) {
    var e = Xs(Eo);
    St = !0;
    for (var n = Je.length; n; ) {
      for (ht = Je, Je = []; ++tn < n; )
        ht && ht[tn].run();
      tn = -1, n = Je.length;
    }
    ht = null, St = !1, zo(e);
  }
}
ge.nextTick = function(e) {
  var n = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var t = 1; t < arguments.length; t++)
      n[t - 1] = arguments[t];
  Je.push(new Zs(e, n)), Je.length === 1 && !St && Xs(Js);
};
function Zs(e, n) {
  this.fun = e, this.array = n;
}
Zs.prototype.run = function() {
  this.fun.apply(null, this.array);
};
ge.title = "browser";
ge.browser = !0;
ge.env = {};
ge.argv = [];
ge.version = "";
ge.versions = {};
function nt() {
}
ge.on = nt;
ge.addListener = nt;
ge.once = nt;
ge.off = nt;
ge.removeListener = nt;
ge.removeAllListeners = nt;
ge.emit = nt;
ge.prependListener = nt;
ge.prependOnceListener = nt;
ge.listeners = function(e) {
  return [];
};
ge.binding = function(e) {
  throw new Error("process.binding is not supported");
};
ge.cwd = function() {
  return "/";
};
ge.chdir = function(e) {
  throw new Error("process.chdir is not supported");
};
ge.umask = function() {
  return 0;
};
var No = Ys.exports;
const Ro = /* @__PURE__ */ Fo(No);
function lt(e) {
  return fo() ? (po(e), !0) : !1;
}
function Ho(e, n) {
  if (typeof Symbol < "u") {
    const t = { ...e };
    return Object.defineProperty(t, Symbol.iterator, {
      enumerable: !1,
      value() {
        let i = 0;
        return {
          next: () => ({
            value: n[i++],
            done: i > n.length
          })
        };
      }
    }), t;
  } else
    return Object.assign([...n], e);
}
function ie(e) {
  return typeof e == "function" ? e() : q(e);
}
const rn = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const jo = Object.prototype.toString, Qs = (e) => jo.call(e) === "[object Object]", Uo = () => +Date.now(), Be = () => {
}, qt = /* @__PURE__ */ Wo();
function Wo() {
  var e, n;
  return rn && ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || ((n = window == null ? void 0 : window.navigator) == null ? void 0 : n.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function jn(e, n) {
  function t(...i) {
    return new Promise((o, s) => {
      Promise.resolve(e(() => n.apply(this, i), { fn: n, thisArg: this, args: i })).then(o).catch(s);
    });
  }
  return t;
}
const qo = (e) => e();
function Ko(e, n = {}) {
  let t, i, o = Be;
  const s = (d) => {
    clearTimeout(d), o(), o = Be;
  };
  return (d) => {
    const c = ie(e), r = ie(n.maxWait);
    return t && s(t), c <= 0 || r !== void 0 && r <= 0 ? (i && (s(i), i = null), Promise.resolve(d())) : new Promise((h, f) => {
      o = n.rejectOnCancel ? f : h, r && !i && (i = setTimeout(() => {
        t && s(t), i = null, h(d());
      }, r)), t = setTimeout(() => {
        i && s(i), i = null, h(d());
      }, c);
    });
  };
}
function ei(e, n = !0, t = !0, i = !1) {
  let o = 0, s, a = !0, d = Be, c;
  const r = () => {
    s && (clearTimeout(s), s = void 0, d(), d = Be);
  };
  return (f) => {
    const y = ie(e), b = Date.now() - o, _ = () => c = f();
    return r(), y <= 0 ? (o = Date.now(), _()) : (b > y && (t || !a) ? (o = Date.now(), _()) : n && (c = new Promise((z, B) => {
      d = i ? B : z, s = setTimeout(() => {
        o = Date.now(), a = !0, z(_()), r();
      }, Math.max(0, y - b));
    })), !t && !s && (s = setTimeout(() => a = !0, y)), a = !1, c);
  };
}
const Go = {
  mounted: "mounted",
  updated: "updated",
  unmounted: "unmounted"
};
function Yo(e) {
  const n = /* @__PURE__ */ Object.create(null);
  return (t) => n[t] || (n[t] = e(t));
}
const Xo = /-(\w)/g, Jo = Yo((e) => e.replace(Xo, (n, t) => t ? t.toUpperCase() : ""));
function Zo(e) {
  return e || Us();
}
function Un(...e) {
  if (e.length !== 1)
    return mo(...e);
  const n = e[0];
  return typeof n == "function" ? zn(vo(() => ({ get: n, set: Be }))) : T(n);
}
function $n(e, n = 200, t = {}) {
  return jn(
    Ko(n, t),
    e
  );
}
function Qo(e, n = 200, t = !1, i = !0, o = !1) {
  return jn(
    ei(n, t, i, o),
    e
  );
}
function el(e, n, t = {}) {
  const {
    eventFilter: i = qo,
    ...o
  } = t;
  return le(
    e,
    jn(
      i,
      n
    ),
    o
  );
}
function un(e, n = !0, t) {
  Zo() ? $t(e, t) : n ? e() : Gt(e);
}
function tl(e, n = {}) {
  var t;
  const i = T((t = n.initialValue) != null ? t : null);
  return le(
    e,
    () => i.value = Uo(),
    n
  ), i;
}
function nl(e, n, t = {}) {
  const {
    immediate: i = !0
  } = t, o = T(!1);
  let s = null;
  function a() {
    s && (clearTimeout(s), s = null);
  }
  function d() {
    o.value = !1, a();
  }
  function c(...r) {
    a(), o.value = !0, s = setTimeout(() => {
      o.value = !1, s = null, e(...r);
    }, ie(n));
  }
  return i && (o.value = !0, rn && c()), lt(d), {
    isPending: zn(o),
    start: c,
    stop: d
  };
}
function xn(e, n, t = {}) {
  const {
    throttle: i = 0,
    trailing: o = !0,
    leading: s = !0,
    ...a
  } = t;
  return el(
    e,
    n,
    {
      ...a,
      eventFilter: ei(i, o, s)
    }
  );
}
function Tn(e, n, t) {
  return le(
    e,
    (i, o, s) => {
      i && n(i, o, s);
    },
    t
  );
}
function sn(e = {}) {
  const {
    inheritAttrs: n = !0
  } = e, t = Ws(), i = /* @__PURE__ */ Ae({
    setup(s, { slots: a }) {
      return () => {
        t.value = a.default;
      };
    }
  }), o = /* @__PURE__ */ Ae({
    inheritAttrs: n,
    setup(s, { attrs: a, slots: d }) {
      return () => {
        var c;
        if (!t.value && Ro.env.NODE_ENV !== "production")
          throw new Error("[VueUse] Failed to find the definition of reusable template");
        const r = (c = t.value) == null ? void 0 : c.call(t, { ...sl(a), $slots: d });
        return n && (r == null ? void 0 : r.length) === 1 ? r[0] : r;
      };
    }
  });
  return Ho(
    { define: i, reuse: o },
    [i, o]
  );
}
function sl(e) {
  const n = {};
  for (const t in e)
    n[Jo(t)] = e[t];
  return n;
}
function be(e) {
  var n;
  const t = ie(e);
  return (n = t == null ? void 0 : t.$el) != null ? n : t;
}
const st = rn ? window : void 0;
function fe(...e) {
  let n, t, i, o;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([t, i, o] = e, n = st) : [n, t, i, o] = e, !n)
    return Be;
  Array.isArray(t) || (t = [t]), Array.isArray(i) || (i = [i]);
  const s = [], a = () => {
    s.forEach((h) => h()), s.length = 0;
  }, d = (h, f, y, b) => (h.addEventListener(f, y, b), () => h.removeEventListener(f, y, b)), c = le(
    () => [be(n), ie(o)],
    ([h, f]) => {
      if (a(), !h)
        return;
      const y = Qs(f) ? { ...f } : f;
      s.push(
        ...t.flatMap((b) => i.map((_) => d(h, b, _, y)))
      );
    },
    { immediate: !0, flush: "post" }
  ), r = () => {
    c(), a();
  };
  return lt(r), r;
}
let Is = !1;
function il(e, n, t = {}) {
  const { window: i = st, ignore: o = [], capture: s = !0, detectIframe: a = !1 } = t;
  if (!i)
    return Be;
  qt && !Is && (Is = !0, Array.from(i.document.body.children).forEach((y) => y.addEventListener("click", Be)), i.document.documentElement.addEventListener("click", Be));
  let d = !0;
  const c = (y) => o.some((b) => {
    if (typeof b == "string")
      return Array.from(i.document.querySelectorAll(b)).some((_) => _ === y.target || y.composedPath().includes(_));
    {
      const _ = be(b);
      return _ && (y.target === _ || y.composedPath().includes(_));
    }
  }), h = [
    fe(i, "click", (y) => {
      const b = be(e);
      if (!(!b || b === y.target || y.composedPath().includes(b))) {
        if (y.detail === 0 && (d = !c(y)), !d) {
          d = !0;
          return;
        }
        n(y);
      }
    }, { passive: !0, capture: s }),
    fe(i, "pointerdown", (y) => {
      const b = be(e);
      d = !c(y) && !!(b && !y.composedPath().includes(b));
    }, { passive: !0 }),
    a && fe(i, "blur", (y) => {
      setTimeout(() => {
        var b;
        const _ = be(e);
        ((b = i.document.activeElement) == null ? void 0 : b.tagName) === "IFRAME" && !(_ != null && _.contains(i.document.activeElement)) && n(y);
      }, 0);
    })
  ].filter(Boolean);
  return () => h.forEach((y) => y());
}
function ol(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (n) => n.key === e : Array.isArray(e) ? (n) => e.includes(n.key) : () => !0;
}
function Vn(...e) {
  let n, t, i = {};
  e.length === 3 ? (n = e[0], t = e[1], i = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (n = !0, t = e[0], i = e[1]) : (n = e[0], t = e[1]) : (n = !0, t = e[0]);
  const {
    target: o = st,
    eventName: s = "keydown",
    passive: a = !1,
    dedupe: d = !1
  } = i, c = ol(n);
  return fe(o, s, (h) => {
    h.repeat && ie(d) || c(h) && t(h);
  }, a);
}
function Cs(e, n, t = {}) {
  return Vn(e, n, { ...t, eventName: "keydown" });
}
function ll() {
  const e = T(!1);
  return Us() && $t(() => {
    e.value = !0;
  }), e;
}
function Wn(e) {
  const n = ll();
  return Y(() => (n.value, !!e()));
}
function al(e, n = {}) {
  const { window: t = st } = n, i = Wn(() => t && "matchMedia" in t && typeof t.matchMedia == "function");
  let o;
  const s = T(!1), a = (r) => {
    s.value = r.matches;
  }, d = () => {
    o && ("removeEventListener" in o ? o.removeEventListener("change", a) : o.removeListener(a));
  }, c = jt(() => {
    i.value && (d(), o = t.matchMedia(ie(e)), "addEventListener" in o ? o.addEventListener("change", a) : o.addListener(a), s.value = o.matches);
  });
  return lt(() => {
    c(), d(), o = void 0;
  }), s;
}
function rl(e, n, t = {}) {
  const { window: i = st, ...o } = t;
  let s;
  const a = Wn(() => i && "MutationObserver" in i), d = () => {
    s && (s.disconnect(), s = void 0);
  }, c = le(
    () => be(e),
    (f) => {
      d(), a.value && i && f && (s = new MutationObserver(n), s.observe(f, o));
    },
    { immediate: !0 }
  ), r = () => s == null ? void 0 : s.takeRecords(), h = () => {
    d(), c();
  };
  return lt(h), {
    isSupported: a,
    stop: h,
    takeRecords: r
  };
}
function qn(e, n, t = {}) {
  const { window: i = st, ...o } = t;
  let s;
  const a = Wn(() => i && "ResizeObserver" in i), d = () => {
    s && (s.disconnect(), s = void 0);
  }, c = Y(() => Array.isArray(e) ? e.map((f) => be(f)) : [be(e)]), r = le(
    c,
    (f) => {
      if (d(), a.value && i) {
        s = new ResizeObserver(n);
        for (const y of f)
          y && s.observe(y, o);
      }
    },
    { immediate: !0, flush: "post", deep: !0 }
  ), h = () => {
    d(), r();
  };
  return lt(h), {
    isSupported: a,
    stop: h
  };
}
function on(e, n = {}) {
  const {
    reset: t = !0,
    windowResize: i = !0,
    windowScroll: o = !0,
    immediate: s = !0
  } = n, a = T(0), d = T(0), c = T(0), r = T(0), h = T(0), f = T(0), y = T(0), b = T(0);
  function _() {
    const z = be(e);
    if (!z) {
      t && (a.value = 0, d.value = 0, c.value = 0, r.value = 0, h.value = 0, f.value = 0, y.value = 0, b.value = 0);
      return;
    }
    const B = z.getBoundingClientRect();
    a.value = B.height, d.value = B.bottom, c.value = B.left, r.value = B.right, h.value = B.top, f.value = B.width, y.value = B.x, b.value = B.y;
  }
  return qn(e, _), le(() => be(e), (z) => !z && _()), rl(e, _, {
    attributeFilter: ["style", "class"]
  }), o && fe("scroll", _, { capture: !0, passive: !0 }), i && fe("resize", _, { passive: !0 }), un(() => {
    s && _();
  }), {
    height: a,
    bottom: d,
    left: c,
    right: r,
    top: h,
    width: f,
    x: y,
    y: b,
    update: _
  };
}
function ti(e, n = { width: 0, height: 0 }, t = {}) {
  const { window: i = st, box: o = "content-box" } = t, s = Y(() => {
    var f, y;
    return (y = (f = be(e)) == null ? void 0 : f.namespaceURI) == null ? void 0 : y.includes("svg");
  }), a = T(n.width), d = T(n.height), { stop: c } = qn(
    e,
    ([f]) => {
      const y = o === "border-box" ? f.borderBoxSize : o === "content-box" ? f.contentBoxSize : f.devicePixelContentBoxSize;
      if (i && s.value) {
        const b = be(e);
        if (b) {
          const _ = i.getComputedStyle(b);
          a.value = Number.parseFloat(_.width), d.value = Number.parseFloat(_.height);
        }
      } else if (y) {
        const b = Array.isArray(y) ? y : [y];
        a.value = b.reduce((_, { inlineSize: z }) => _ + z, 0), d.value = b.reduce((_, { blockSize: z }) => _ + z, 0);
      } else
        a.value = f.contentRect.width, d.value = f.contentRect.height;
    },
    t
  );
  un(() => {
    const f = be(e);
    f && (a.value = "offsetWidth" in f ? f.offsetWidth : n.width, d.value = "offsetHeight" in f ? f.offsetHeight : n.height);
  });
  const r = le(
    () => be(e),
    (f) => {
      a.value = f ? n.width : 0, d.value = f ? n.height : 0;
    }
  );
  function h() {
    c(), r();
  }
  return {
    width: a,
    height: d,
    stop: h
  };
}
function wn(e) {
  return typeof Window < "u" && e instanceof Window ? e.document.documentElement : typeof Document < "u" && e instanceof Document ? e.documentElement : e;
}
const ul = {
  page: (e) => [e.pageX, e.pageY],
  client: (e) => [e.clientX, e.clientY],
  screen: (e) => [e.screenX, e.screenY],
  movement: (e) => e instanceof Touch ? null : [e.movementX, e.movementY]
};
function ni(e = {}) {
  const {
    type: n = "page",
    touch: t = !0,
    resetOnTouchEnds: i = !1,
    initialValue: o = { x: 0, y: 0 },
    window: s = st,
    target: a = s,
    scroll: d = !0,
    eventFilter: c
  } = e;
  let r = null;
  const h = T(o.x), f = T(o.y), y = T(null), b = typeof n == "function" ? n : ul[n], _ = (L) => {
    const P = b(L);
    r = L, P && ([h.value, f.value] = P, y.value = "mouse");
  }, z = (L) => {
    if (L.touches.length > 0) {
      const P = b(L.touches[0]);
      P && ([h.value, f.value] = P, y.value = "touch");
    }
  }, B = () => {
    if (!r || !s)
      return;
    const L = b(r);
    r instanceof MouseEvent && L && (h.value = L[0] + s.scrollX, f.value = L[1] + s.scrollY);
  }, G = () => {
    h.value = o.x, f.value = o.y;
  }, Q = c ? (L) => c(() => _(L), {}) : (L) => _(L), de = c ? (L) => c(() => z(L), {}) : (L) => z(L), J = c ? () => c(() => B(), {}) : () => B();
  if (a) {
    const L = { passive: !0 };
    fe(a, ["mousemove", "dragover"], Q, L), t && n !== "movement" && (fe(a, ["touchstart", "touchmove"], de, L), i && fe(a, "touchend", G, L)), d && n === "page" && fe(s, "scroll", J, { passive: !0 });
  }
  return {
    x: h,
    y: f,
    sourceType: y
  };
}
function dl(e, n) {
  const t = Ws(n);
  return le(
    Un(e),
    (i, o) => {
      t.value = o;
    },
    { flush: "sync" }
  ), zn(t);
}
function si(e) {
  const n = window.getComputedStyle(e);
  if (n.overflowX === "scroll" || n.overflowY === "scroll" || n.overflowX === "auto" && e.clientWidth < e.scrollWidth || n.overflowY === "auto" && e.clientHeight < e.scrollHeight)
    return !0;
  {
    const t = e.parentNode;
    return !t || t.tagName === "BODY" ? !1 : si(t);
  }
}
function cl(e) {
  const n = e || window.event, t = n.target;
  return si(t) ? !1 : n.touches.length > 1 ? !0 : (n.preventDefault && n.preventDefault(), !1);
}
const Zt = /* @__PURE__ */ new WeakMap();
function hl(e, n = !1) {
  const t = T(n);
  let i = null, o;
  le(Un(e), (d) => {
    const c = wn(ie(d));
    if (c) {
      const r = c;
      Zt.get(r) || Zt.set(r, o), t.value && (r.style.overflow = "hidden");
    }
  }, {
    immediate: !0
  });
  const s = () => {
    const d = wn(ie(e));
    !d || t.value || (qt && (i = fe(
      d,
      "touchmove",
      (c) => {
        cl(c);
      },
      { passive: !1 }
    )), d.style.overflow = "hidden", t.value = !0);
  }, a = () => {
    var d;
    const c = wn(ie(e));
    !c || !t.value || (qt && (i == null || i()), c.style.overflow = (d = Zt.get(c)) != null ? d : "", Zt.delete(c), t.value = !1);
  };
  return lt(a), Y({
    get() {
      return t.value;
    },
    set(d) {
      d ? s() : a();
    }
  });
}
function fl(e = {}) {
  const {
    window: n = st,
    initialWidth: t = Number.POSITIVE_INFINITY,
    initialHeight: i = Number.POSITIVE_INFINITY,
    listenOrientation: o = !0,
    includeScrollbar: s = !0
  } = e, a = T(t), d = T(i), c = () => {
    n && (s ? (a.value = n.innerWidth, d.value = n.innerHeight) : (a.value = n.document.documentElement.clientWidth, d.value = n.document.documentElement.clientHeight));
  };
  if (c(), un(c), fe("resize", c, { passive: !0 }), o) {
    const r = al("(orientation: portrait)");
    le(r, () => c());
  }
  return { width: a, height: d };
}
const Tt = {
  props: {
    show: { type: [Boolean, Object], default: !1 }
  },
  emits: ["update:show"],
  data() {
    return {
      innerShow: !1
    };
  },
  watch: {
    show: {
      immediate: !0,
      handler(e) {
        this.innerShow = !!e;
      }
    },
    innerShow(e) {
      !!e !== this.show && this.$emit("update:show", e);
    }
  }
}, Kn = (e) => {
  const n = typeof e;
  return n === "boolean" || n === "string" ? !0 : e.nodeType === Node.ELEMENT_NODE;
}, Gn = {
  name: "detachable",
  props: {
    attach: {
      default: () => !1,
      validator: Kn
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
    hasDetached: !1,
    // the final value of renderTo
    target: null
  }),
  inject: {
    vuDebug: {
      default: !0
    }
  },
  watch: {
    attach() {
      this.hasDetached = !1, this.initDetach();
    }
  },
  mounted() {
    this.initDetach();
  },
  methods: {
    initDetach() {
      if (this._isDestroyed || this.hasDetached || this.attach === "" || this.attach === !0 || this.attach === "attach")
        return;
      let e;
      if (this.attach ? typeof this.attach == "string" ? e = document.querySelector(this.attach) : e = this.attach : e = document.body, !e) {
        this.vuDebug && console.warn(`Unable to locate target ${this.attach}`, this);
        return;
      }
      this.vuDebug && e.tagName.toLowerCase() !== "body" && window.getComputedStyle(e).position !== "relative" && console.warn(`target (${e.tagName.toLowerCase()}${e.id && ` #${e.id}`}${e.className && ` .${e.className}`}) element should have a relative position`), this.target = e, this.hasDetached = !0;
    }
  }
}, Mn = function(n, t) {
  let i, o;
  return function(...a) {
    const d = this, c = +/* @__PURE__ */ new Date();
    i && c < i + t ? (clearTimeout(o), o = setTimeout(() => {
      i = c, n.apply(d, a);
    }, t)) : (i = c, n.apply(d, a));
  };
}, Yn = (e, n, t, i = { width: 0, x: 0, y: 0 }, { scrollTop: o = 0, scrollLeft: s = 0 } = {}, a = !1, d = { left: 2, right: 2, top: 0, bottom: 0 }, c = { x: 0, y: 0 }) => {
  let r = n.y - i.y + o + (c.y || 0), h = n.x - i.x + s + (c.x || 0);
  isNaN(n.width) && (n.width = 0), isNaN(n.height) && (n.height = 0), /-right/.test(e) ? h += n.width - t.width : /^(top|bottom)$/.test(e) && (h += n.width / 2 - t.width / 2), /^bottom/.test(e) ? r += n.height : /^(left|right)(-top|-bottom)?$/.test(e) ? (h -= t.width, /^(right|right-\w{3,6})$/.test(e) && (h += n.width + t.width), /(-top|-bottom)/.test(e) ? /-bottom/.test(e) && (r += n.height - t.height) : r += n.height / 2 - t.height / 2) : r -= t.height;
  let f = 0, y = 0;
  const b = n.width / 2;
  if (a) {
    const _ = d.left, z = i.width - t.width - d.right, B = Math.max(_, Math.min(h, z));
    f = h - B, h = B;
  }
  return {
    left: h,
    top: r,
    shiftX: f,
    shiftY: y,
    offset: b
  };
}, pl = {
  name: "vu-tooltip",
  mixins: [Tt],
  data: () => ({
    setPosition: Yn
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
      default: !0
    },
    text: {
      type: String,
      default: () => ""
    },
    animated: {
      type: Boolean,
      default: !0
    },
    contentClass: {
      type: String,
      required: !1,
      default: ""
    },
    prerender: {
      type: Boolean,
      required: !1
    }
  }
}, ml = ["innerHTML"];
function vl(e, n, t, i, o, s) {
  return l(), u("div", {
    ref: "content",
    class: k([`${t.side} ${t.type} ${t.type}-root`, { "without-arrow": !t.arrow }, { prerender: t.prerender }, t.contentClass])
  }, [
    x(It, {
      name: t.animated ? "fade" : ""
    }, {
      default: M(() => [
        e.show ? (l(), u("div", {
          key: 0,
          class: k([`${t.type}-wrapper`])
        }, [
          C(e.$slots, "arrow", { side: t.side }, () => [
            t.arrow ? (l(), u("div", {
              key: 0,
              class: k(`${t.type}-arrow`)
            }, null, 2)) : p("", !0)
          ], !0),
          C(e.$slots, "title", { side: t.side }, void 0, !0),
          g("div", {
            ref: "body",
            class: k(`${t.type}-body`)
          }, [
            t.text ? (l(), u("span", {
              key: 0,
              innerHTML: t.text
            }, null, 8, ml)) : C(e.$slots, "default", {
              key: 1,
              side: t.side
            }, void 0, !0)
          ], 2)
        ], 2)) : p("", !0)
      ]),
      _: 3
    }, 8, ["name"])
  ], 2);
}
const Xn = /* @__PURE__ */ A(pl, [["render", vl], ["__scopeId", "data-v-e6942483"]]), gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xn
}, Symbol.toStringTag, { value: "Module" })), yl = ["top", "top-right", "right-bottom", "right", "right-top", "bottom-right", "bottom", "bottom-left", "left-top", "left", "left-bottom", "top-left"], bl = (e, n, t, i) => {
  const o = t.indexOf(e), s = t[(o + 1) % t.length];
  return i.includes(s) ? n : s;
}, _l = ({ intersectionRatio: e }) => e < 1, wl = {
  name: "vu-popover",
  mixins: [Tt, Gn],
  expose: ["updatePosition", "toggle"],
  emits: ["unpositionable"],
  components: { VuTooltip: Xn },
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
      default: !1
    },
    shift: {
      type: Boolean,
      default: !1
    },
    offsets: {
      type: Object,
      default: void 0
    },
    animated: {
      type: Boolean,
      default: !0
    },
    overlay: {
      type: Boolean,
      default: !1
    },
    click: {
      type: Boolean,
      default: !0
    },
    hover: {
      type: Boolean,
      default: !1
    },
    hoverImmediate: {
      type: Boolean,
      default: !1
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
      default: !1
    },
    positions: {
      type: Array,
      required: !1,
      default: () => yl
    },
    getNextPosition: {
      type: Function,
      required: !1,
      default: bl
    },
    checkPosition: {
      type: Function,
      required: !1,
      default: _l
    },
    syncWidth: {
      type: Boolean,
      default: !1
    },
    ignoreEscapeKey: {
      type: Boolean,
      default: !1
    },
    ignoreClickOutside: {
      type: Boolean,
      default: !1
    }
  },
  data: () => ({
    open: !1,
    width: 0,
    resizeObs: null,
    debounce() {
    },
    useDebounceFn: $n,
    intersectionObs: null,
    setPositionBound: null,
    shifted: !1,
    positioned: !1,
    fadeTimeout: void 0,
    positionAttempts: [],
    scrollableAncestors: [],
    // put in positionable
    innerSide: "",
    keyboardListener() {
    }
  }),
  watch: {
    innerShow: {
      immediate: !0,
      async handler(e) {
        e ? (this.fadeTimeout && (this.fadeTimeout = void 0), await new Promise((n) => setTimeout(n, 10)), this.positioned = !1, this.open = !0, this.positionAttempts = [], await this.$nextTick(), this.setPositionBound(), this.intersectionObs.observe(this.$refs.tooltip.$el), this.resizeObs || (this.resizeObs = new ResizeObserver(async () => {
          this.setPositionBound(!0);
        })), this.listenScrolls()) : (this.$refs.tooltip && (this.intersectionObs.unobserve(this.$refs.tooltip.$el), this.resizeObs.disconnect()), this.stopScrollListening(), this.animated ? this.fadeTimeout = setTimeout(() => {
          this.open = !1;
        }, 500) : this.open = !1);
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
        this.target && (e && !this.ignoreEscapeKey ? this.keyboardListener = fe(this.target, "keydown", (n) => {
          n.code === "Escape" && (this.innerShow = !1);
        }) : this.keyboardListener());
      }
    },
    hover: {
      immediate: !0,
      handler() {
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
    this.setPositionBound = Mn(this.setPosition.bind(this), 1);
  },
  async mounted() {
    await this.$nextTick();
    let e = 0;
    const n = 5;
    for (; e < n && this.$refs.activator === void 0 && this.$refs.tooltip === void 0; )
      e++, await this.$nextTick();
    const { target: t, positionAttempts: i } = this;
    this.intersectionObs = new IntersectionObserver(([{ boundingClientRect: o, rootBounds: s, intersectionRatio: a, intersectionRect: d }]) => {
      if (this.$refs.tooltip && this.intersectionObs.unobserve(this.$refs.tooltip.$el), this.checkPosition({ intersectionRatio: a, elementRect: o, targetRect: s, intersectionRect: d, positionAttempts: i })) {
        const c = this.getNextPosition(this.innerSide || this.side, this.side, this.positions, this.positionAttempts);
        if (this.positionAttempts.length > this.positions.length) {
          this.$emit("unpositionable"), this.positioned = !0, this.positionAttempts = [];
          return;
        }
        this.innerSide = c, this.positionAttempts.push(this.innerSide);
      } else
        this.positioned = !0, this.positionAttempts = [], this.resizeObs.observe(this.$refs.tooltip.$el), this.resizeObs.observe(this.target);
    }, { root: t !== document.body ? t : document });
  },
  beforeUnmount() {
    try {
      this.innerShow = !1, this.stopScrollListening(), this.intersectionObs.disconnect(), this.resizeObs.disconnect();
    } catch {
    }
  },
  methods: {
    listenScrolls() {
      const e = [];
      let n = this.$refs.activator.parentElement;
      for (; n && (this.target.contains(n) || n === this.target); ) {
        const { overflow: t } = window.getComputedStyle(n), i = t.split(" ");
        ["auto", "scroll"].some((o) => i.includes(o)) && e.push(n), n = n.parentElement;
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
      let n = this.$refs.activator.getBoundingClientRect();
      const t = (d = this.$refs.tooltip) == null ? void 0 : d.$el;
      if (!t)
        return;
      let i = t.getBoundingClientRect();
      this.syncWidth && i.width !== n.width && (this.width = n.width, await this.$nextTick(), n = this.$refs.activator.getBoundingClientRect(), i = this.$refs.tooltip.$el.getBoundingClientRect());
      const o = this.target.getBoundingClientRect(), s = this.offsets && this.offsets[this.innerSide || this.side] || {};
      this.positionAttempts.push(this.innerSide || this.side);
      const a = Yn(
        this.innerSide || this.side,
        n,
        i,
        o,
        this.target,
        this.shift,
        { left: 0, right: 0 },
        s
      );
      this.shifted = a.shiftX, t.style.top = `${a.top}px`, t.style.left = `${a.left}px`, this.overlay && (this.$refs.overlay.style.top = `${this.target === document.body ? document.scrollingElement.scrollTop : this.target.scrollTop}px`);
    },
    onClickOutside(e, n = !1) {
      if (this.ignoreClickOutside || !this.innerShow)
        return;
      const { target: t } = e;
      n && e.preventDefault(), !(this.$refs.tooltip && (t === this.$refs.tooltip.$el || this.$refs.tooltip.$el.contains(t))) && (this.innerShow = !1);
    },
    onHover(e) {
      this.debounce(e).then((n) => {
        this.openedByClick || (n === "mouseenter" ? this.innerShow = !0 : (this.innerShow = !1, this.openedByClick = !1));
      }).catch(() => {
      });
    },
    attachHover() {
      this.hover && !this.hoverImmediate ? this.debounce = $n(({ type: e }) => e, this.hoverDelay, { rejectOnCancel: !0 }) : this.debounce = function() {
      };
    },
    onClick() {
      this.toggle(), this.hover && this.innerShow ? this.openedByClick = !0 : this.openedByClick = !1;
    },
    toggle(e = void 0) {
      e !== void 0 ? this.innerShow = e : this.innerShow = !this.innerShow;
    }
  }
};
function kl(e, n, t, i, o, s) {
  const a = O("VuTooltip"), d = _e("click-outside");
  return l(), u(V, null, [
    H((l(), u("span", te({
      ref: "activator",
      class: "vu-popover__activator"
    }, e.$attrs, {
      onClick: n[0] || (n[0] = (c) => t.click && s.onClick(!0)),
      onContextmenu: n[1] || (n[1] = re(() => {
      }, ["prevent", "stop"])),
      onMouseenter: n[2] || (n[2] = (c) => t.hover && s.onHover(c)),
      onMouseleave: n[3] || (n[3] = (c) => t.hover && s.onHover(c))
    }), [
      C(e.$slots, "default", {}, void 0, !0)
    ], 16)), [
      [d, { handler: s.onClickOutside, innerShow: e.innerShow }]
    ]),
    e.open || t.persistent ? H((l(), S(En, {
      key: 0,
      to: e.target
    }, [
      x(It, {
        name: t.animated ? "fade" : ""
      }, {
        default: M(() => [
          e.innerShow && t.overlay ? (l(), u("div", {
            key: 0,
            ref: "overlay",
            class: "mask popover-mask",
            onWheel: n[4] || (n[4] = re((...c) => s.onClickOutside && s.onClickOutside(...c), ["prevent"])),
            onTouchstart: n[5] || (n[5] = (c) => s.onClickOutside(c, !0))
          }, null, 544)) : p("", !0)
        ]),
        _: 1
      }, 8, ["name"]),
      x(It, {
        appear: "",
        name: t.animated ? "fade" : ""
      }, {
        default: M(() => [
          H(x(a, {
            ref: "tooltip",
            arrow: t.arrow,
            prerender: !e.positioned,
            type: t.type,
            show: !0,
            side: e.innerSide || t.side,
            class: k(e.contentClass),
            style: K([e.width ? `width: ${e.width}px` : {}, e.contentStyle]),
            "onUpdate:show": n[6] || (n[6] = (c) => e.open = !1),
            onMouseenter: n[7] || (n[7] = (c) => t.hover && s.onHover(c)),
            onMouseleave: n[8] || (n[8] = (c) => t.hover && s.onHover(c))
          }, {
            arrow: M(({ side: c }) => [
              C(e.$slots, "arrow", {
                side: e.innerSide || c,
                shift: e.shifted
              }, void 0, !0)
            ]),
            title: M(({ side: c }) => [
              C(e.$slots, "title", {
                side: e.innerSide || c
              }, () => [
                t.title ? (l(), u(V, { key: 0 }, [
                  X(w(t.title), 1)
                ], 64)) : p("", !0)
              ], !0)
            ]),
            default: M(() => [
              C(e.$slots, "body", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["arrow", "prerender", "type", "side", "class", "style"]), [
            [Ve, e.innerShow || e.show]
          ])
        ]),
        _: 3
      }, 8, ["name"])
    ], 8, ["to"])), [
      [Ve, e.open]
    ]) : p("", !0)
  ], 64);
}
const Ke = /* @__PURE__ */ A(wl, [["render", kl], ["__scopeId", "data-v-d46bd11b"]]), Sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ke
}, Symbol.toStringTag, { value: "Module" })), Il = {
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
      overflows: !1,
      ellipsis: !1,
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
      immediate: !0,
      // eslint-disable-next-line object-shorthand, func-names
      handler: function(e) {
        this.visibleAmount = e.length, this.ellipsis = !1, this.overflows = !1, this.$el && this.$nextTick(() => this.watchSize());
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
      this.intObs.disconnect(), this.ellipsis = !0;
      const e = this.$refs.inner.querySelectorAll(".vu-badge");
      await this.$nextTick(), e.forEach((n) => {
        this.intObs2.observe(n);
      });
    },
    intersects2(e) {
      const n = e.filter((i) => i.intersectionRatio < 1);
      let { length: t } = n;
      if (t) {
        const i = this.$refs.inner.getBoundingClientRect(), { right: o } = i, s = n.shift();
        s && o - s.target.getBoundingClientRect().left - 22 < 0 && (t += 1), this.visibleAmount -= t, this.overflows = !0;
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
  components: { VuBadge: Hn, VuPopover: Ke, VuIcon: pe }
}, Cl = {
  class: "status-bar__inner",
  ref: "inner"
};
function Bl(e, n, t, i, o, s) {
  const a = O("VuBadge"), d = O("VuIcon"), c = O("VuPopover"), r = _e("tooltip");
  return l(), u("div", {
    class: k(["vu-status-bar", { "status-bar--constrained": t.constrained }]),
    ref: "container"
  }, [
    g("div", Cl, [
      (l(!0), u(V, null, j(s.visibleItems, (h) => H((l(), S(a, {
        key: h.id,
        icon: h.icon,
        text: h.text || h.amount && s.units(h.amount) || "",
        color: h.color || "copy-grey",
        value: h.value,
        togglable: !1,
        style: K([h.amount && h.icon ? "min-width: 45px" : ""])
      }, null, 8, ["icon", "text", "color", "value", "style"])), [
        [
          r,
          h.tooltip || h.text || h.amount || "",
          void 0,
          { hover: !0 }
        ]
      ])), 128)),
      o.overflows ? (l(), S(c, {
        key: 0,
        type: "tooltip",
        "content-class": "vu-status-bar",
        shift: "",
        arrow: ""
      }, {
        default: M(() => [
          x(d, {
            icon: "menu-dot",
            style: { transform: "rotate(90deg)" }
          })
        ]),
        body: M(() => [
          (l(!0), u(V, null, j(s.hiddenItems, (h) => (l(), S(a, {
            key: h.id,
            icon: h.icon,
            text: h.text || `${h.amount}` || "",
            color: h.color || "copy-grey",
            value: h.value,
            togglable: !1
          }, null, 8, ["icon", "text", "color", "value"]))), 128))
        ]),
        _: 1
      })) : p("", !0)
    ], 512)
  ], 2);
}
const Jn = /* @__PURE__ */ A(Il, [["render", Bl], ["__scopeId", "data-v-5fdbcbd9"]]), Ol = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Jn
}, Symbol.toStringTag, { value: "Module" })), $l = {
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
    intersected: !1
  }),
  mounted() {
    "IntersectionObserver" in window ? (this.observer = new IntersectionObserver((e) => {
      const n = e == null ? void 0 : e.pop();
      n != null && n.isIntersecting && (this.intersected = !0, this.observer.disconnect(), this.$emit("intersect"));
    }, this.options), this.observer.observe(this.$el)) : (this.intersected = !0, this.$emit("intersect"));
  },
  beforeUnmount() {
    "IntersectionObserver" in window && this.observer && this.observer.disconnect(), delete this.observer;
  }
};
function xl(e, n, t, i, o, s) {
  return l(), u("div", {
    style: K(e.intersected ? "" : `min-height: ${t.height}${typeof t.height == "number" && "px" || ""}`)
  }, [
    e.intersected ? C(e.$slots, "default", { key: 0 }) : C(e.$slots, "placeholder", { key: 1 })
  ], 4);
}
const Zn = /* @__PURE__ */ A($l, [["render", xl]]), Tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Zn
}, Symbol.toStringTag, { value: "Module" })), Vl = {
  name: "vu-image",
  components: { VuLazy: Zn },
  props: {
    lazy: {
      type: Boolean,
      required: !1
    },
    src: {
      type: [URL, String],
      required: !0
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
    isLoading: !0,
    hasError: !1
  }),
  inject: {
    vuDebug: {
      default: !1
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
      this.image = e, this.isLoading = !0, e.onload = () => {
        e.decode ? e.decode().catch((n) => {
          this.vuDebug && console.warn(
            `Failed to decode image, trying to render anyway

src: ${this.src}` + (n.message ? `
Original error: ${n.message}` : ""),
            this
          );
        }).then(this.onLoad) : this.onLoad();
      }, e.onerror = this.onError, e.src = this.src, this.aspectRatio || this.pollForSize(e);
    },
    pollForSize(e, n = 100) {
      const t = () => {
        const { naturalHeight: i, naturalWidth: o } = e;
        i || o ? (this.naturalWidth = o, this.calculatedAspectRatio = o / i, this.image = null) : !e.complete && this.isLoading && !this.hasError && n != null && setTimeout(t, n);
      };
      t();
    },
    onLoad() {
      this.isLoading = !1, this.$emit("load", this.src);
    },
    onError() {
      this.hasError = !0, this.$emit("error", this.src);
    }
  }
}, Ml = (e) => (et("data-v-2025e901"), e = e(), tt(), e), Pl = /* @__PURE__ */ Ml(() => /* @__PURE__ */ g("div", { class: "vu-image__fill" }, null, -1));
function Ll(e, n, t, i, o, s) {
  const a = O("VuLazy");
  return l(), u("div", {
    class: "vu-image",
    style: K(s.imageStyle)
  }, [
    g("div", {
      class: "vu-image__sizer",
      style: K(s.imageSizerStyle)
    }, null, 4),
    t.lazy ? (l(), S(a, {
      key: 0,
      height: t.height || t.maxHeight || t.minHeight || 10,
      onIntersect: n[0] || (n[0] = (d) => s.loadImage())
    }, {
      default: M(() => [
        g("div", {
          class: k(["vu-image__image", s.imageClasses]),
          style: K([[e.isLoading ? "" : { backgroundImage: `url(${t.src})` }], { "background-position": "center center" }])
        }, null, 6)
      ]),
      _: 1
    }, 8, ["height"])) : (l(), u("div", {
      key: 1,
      class: k(["vu-image__image", s.imageClasses]),
      style: K([[e.isLoading ? "" : { backgroundImage: `url(${t.src})` }], { "background-position": "center center" }])
    }, null, 6)),
    Pl,
    C(e.$slots, "default", {}, void 0, !0)
  ], 4);
}
const at = /* @__PURE__ */ A(Vl, [["render", Ll], ["__scopeId", "data-v-2025e901"]]), Dl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: at
}, Symbol.toStringTag, { value: "Module" })), Yt = Symbol("vuIsMobileOrTablet"), Qn = Symbol("vuIsIOS"), es = Symbol("vuMessageNoProgress"), ii = Symbol("vuAlertDialogConfirmButtonLabel"), oi = Symbol("vuAlertDialogCloseButtonLabel"), li = Symbol("vuAlertDialogRiskyButtonLabel"), ai = Symbol("vuAlertDialogCloseButtonAltLabel"), ri = Symbol("vuDropdownMenuOverlay"), ui = Symbol("vuTimelineDividerAncestorDepth"), di = Symbol("vuTimelineDividerStickyContainer"), ci = Symbol("vuThumbnailListItemActionsActiveClass"), ts = Symbol("vuHasWUX"), Zv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AlertDialogCloseButtonAltLabelKey: ai,
  AlertDialogCloseButtonLabelKey: oi,
  AlertDialogConfirmButtonLabelKey: ii,
  AlertDialogRiskyButtonLabelKey: li,
  DropdownMenuOverlayKey: ri,
  HasWUXKey: ts,
  IsIOSKey: Qn,
  IsMobileOrTabletKey: Yt,
  MessageNoProgressKey: es,
  ThumbnailListItemActionsActiveClassKey: ci,
  TimelineDividerAncestorKey: ui,
  TimelineDividerStickyContainerKey: di
}, Symbol.toStringTag, { value: "Module" }));
function Ge() {
  return window ? ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (e) => (e ^ (window.crypto || window.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16)) : (void 0)();
}
function ns(e, n = !0) {
  let t = n;
  return ie(e).forEach((o) => {
    !o.text && !o.label && (!o.class || !o.class.includes("divider")) && (t = !1), o.items && (t = ns(o.items, t));
  }), t;
}
T();
const Al = {
  name: "vu-dropdownmenu-items",
  components: { VuIcon: pe, VuImage: at },
  emits: ["update:responsive", "update:position", "click-item", "update:selected"],
  props: {
    target: {
      type: Object,
      required: !1
    },
    items: {
      type: Array,
      required: !0,
      validator: ns
    },
    selected: {
      type: Array,
      required: !0
    },
    zIndex: {
      type: Number,
      default: 1e3
    },
    responsive: {
      type: Boolean,
      default: !1
    },
    dividedResponsiveItems: {
      type: Boolean,
      default: !1
    },
    disableResponsive: {
      type: Boolean,
      default: !1
    }
  },
  data: () => ({
    stack: [],
    left: !1,
    uuid: Ge,
    root: !1,
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
    }, n = ((i = this.target) == null ? void 0 : i.getBoundingClientRect()) || { right: window.right, left: 0 }, t = new IntersectionObserver(async ([o]) => {
      t.unobserve(this.$el);
      const s = o.target.getBoundingClientRect();
      n.right < s.right && !this.left ? (this.left = !0, await this.$nextTick(), t.observe(this.$el)) : n.left > s.left && this.left && (this.$emit("update:responsive", !0), this.$emit("update:position"));
    }, e);
    await this.$nextTick(), t.observe(this.$el);
  },
  methods: {
    toggleSelected(e) {
      const n = this.selected.slice(0);
      return e.selected || this.selected.includes(e) ? n.splice(this.selected.indexOf(e), 1) : n.push(e), n;
    },
    onItemClick(e) {
      e.disabled || ((e.selectable || e.selected || this.selected.includes(e)) && this.$emit("update:selected", this.toggleSelected(e)), this.$emit("click-item", e));
    },
    onNextItemClick(e) {
      this.responsive && this.stack.push(e.items);
    },
    onBackItemClick() {
      this.stack.pop();
    }
  }
}, Fl = (e) => (et("data-v-4db8f571"), e = e(), tt(), e), zl = { class: "dropdown-menu-wrap" }, El = {
  key: 0,
  class: "item item-back"
}, Nl = { class: "item-text" }, Rl = ["onClick"], Hl = {
  key: 1,
  class: "p-[5px] w-[44px] float-left h-full"
}, jl = { class: "item-text" }, Ul = ["onClick"], Wl = /* @__PURE__ */ Fl(() => /* @__PURE__ */ g("span", { class: "divider" }, null, -1)), ql = {
  key: 0,
  class: "item-text"
};
function Kl(e, n, t, i, o, s) {
  const a = O("VuIcon"), d = O("VuImage"), c = O("vu-dropdownmenu-items", !0);
  return l(), u("div", {
    class: k(["dropdown-menu dropdown-menu-root dropdown-root", s.classes]),
    style: K([{ zIndex: t.zIndex }]),
    ref: "self"
  }, [
    g("ul", zl, [
      t.responsive && e.stack.length ? (l(), u("li", El, [
        x(a, {
          icon: "left-open",
          class: "back-item",
          onClick: re(s.onBackItemClick, ["stop"])
        }, null, 8, ["onClick"]),
        g("span", Nl, w(s._parent.text), 1)
      ])) : p("", !0),
      (l(!0), u(V, null, j(s._items, (r) => (l(), u(V, null, [
        !r.class || !r.class.includes("header") && !r.class.includes("divider") ? (l(), u("li", {
          key: r.text || r.label,
          class: k(["item", [{
            "item-submenu": r.items,
            selectable: !r.disabled && r.selectable || r.selected || t.selected.includes(r),
            selected: r.selected || t.selected.includes(r),
            hidden: r.hidden,
            disabled: r.disabled,
            "hide-responsive-divider": !t.dividedResponsiveItems
          }, r.class]]),
          onClick: re((h) => r.items && t.responsive && !t.dividedResponsiveItems ? s.onNextItemClick(r) : s.onItemClick(r), ["stop"])
        }, [
          C(e.$slots, "default", { item: r }, () => [
            r.fonticon ? (l(), S(a, {
              key: 0,
              icon: r.fonticon,
              withinText: !1
            }, null, 8, ["icon"])) : r.imageSource ? (l(), u("div", Hl, [
              x(d, {
                src: r.imageSource,
                aspectRatio: "1",
                width: "34"
              }, null, 8, ["src"])
            ])) : p("", !0),
            g("span", jl, w(r.text || r.label), 1)
          ], !0),
          r.items ? (l(), u("div", {
            key: 0,
            class: "next-icon",
            onClick: re((h) => s.onNextItemClick(r), ["stop"])
          }, [
            Wl,
            x(a, { icon: "right-open" })
          ], 8, Ul)) : p("", !0),
          !t.responsive && r.items ? (l(), S(c, {
            key: 1,
            target: t.target,
            items: r.items,
            selected: t.selected,
            "z-index": t.zIndex + 1,
            onClickItem: s.onItemClick,
            "onUpdate:selected": n[0] || (n[0] = (h) => e.$emit("update:selected", h)),
            "onUpdate:responsive": n[1] || (n[1] = (h) => e.$emit("update:responsive", h)),
            "onUpdate:position": n[2] || (n[2] = () => {
              var y;
              const { left: h, top: f } = (y = e.$refs.self) == null ? void 0 : y.getBoundingClientRect();
              e.$emit("update:position", { x: h, y: f });
            })
          }, null, 8, ["target", "items", "selected", "z-index", "onClickItem"])) : p("", !0)
        ], 10, Rl)) : (l(), u("li", {
          key: r.text || r.label || e.uuid(),
          class: k(r.class)
        }, [
          r.class !== "divider" ? (l(), u("span", ql, w(r.text || r.label), 1)) : p("", !0)
        ], 2))
      ], 64))), 256))
    ])
  ], 6);
}
const dn = /* @__PURE__ */ A(Al, [["render", Kl], ["__scopeId", "data-v-4db8f571"]]), Gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dn
}, Symbol.toStringTag, { value: "Module" }));
function Yl() {
  return window ? navigator.userAgent.toLowerCase().indexOf("firefox") >= 0 : !1;
}
const Xl = {
  name: "vu-spinner",
  props: {
    mask: {
      type: Boolean,
      default: () => !1
    },
    text: {
      type: String,
      default: () => ""
    }
  }
}, Jl = { class: "mask-wrapper" }, Zl = { class: "mask-content" }, Ql = /* @__PURE__ */ go('<div class="spinner spinning fade in"><span class="spinner-bar"></span><span class="spinner-bar spinner-bar1"></span><span class="spinner-bar spinner-bar2"></span><span class="spinner-bar spinner-bar3"></span></div>', 1), ea = {
  key: 0,
  class: "text"
};
function ta(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k({ mask: t.mask })
  }, [
    g("div", Jl, [
      g("div", Zl, [
        Ql,
        t.text.length ? (l(), u("span", ea, w(t.text), 1)) : p("", !0)
      ])
    ])
  ], 2);
}
const ss = /* @__PURE__ */ A(Xl, [["render", ta]]), na = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ss
}, Symbol.toStringTag, { value: "Module" })), sa = {
  name: "vu-scroller",
  exposes: ["stopLoading", "stopLoadingBefore"],
  props: {
    lock: {
      type: Boolean,
      default: !1
    },
    reverse: {
      type: Boolean,
      default: !1
    },
    infinite: {
      type: Boolean,
      default: !1
    },
    showLoading: {
      type: Boolean,
      default: !1
    },
    // alias for infinite
    dataAfter: {
      type: Boolean,
      default: !1
    },
    dataBefore: {
      type: Boolean,
      default: !1
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
      default: !1
    },
    alwaysShow: {
      type: Boolean,
      default: !1
    },
    // Allows to configure timeout for innerScroll to happen.
    // The new content needs to be rerender to not endlessly loop on the intersection.
    updateSleep: {
      type: Number,
      default: 15
    },
    noIntersectionRoot: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["loading-before", "loading", "mounted"],
  data() {
    return {
      lazyKeyIndex: 0,
      lazyKeyIndex2: 0,
      wait: !1,
      waitBefore: !1,
      firefox: !1,
      isLocked: void 0
    };
  },
  inject: {
    noCss: {
      default: !0,
      from: ts
    }
  },
  computed: {
    rootMargin() {
      return Array(4).fill(`${this.infiniteMargin}px`).join(" ");
    },
    options() {
      const e = {}, { rootMargin: n } = this;
      return this.noIntersectionRoot || (e.root = this.$refs["scroll-container"]), {
        ...e,
        rootMargin: n
      };
    }
  },
  mounted() {
    this.firefox = Yl(), this.$emit("mounted"), this.lockHandler(this.lock);
  },
  methods: {
    stopLoading(e) {
      e ? (this.lazyKeyIndex2 += 1, this.sleep()) : (this.lazyKeyIndex += 1, this.sleep());
    },
    async sleep() {
      this.wait = !0, this.waitBefore = !0, await setTimeout(() => {
      }, this.updateSleep), this.wait = !1, this.waitBefore = !1;
    },
    lockHandler(e) {
      this.isLocked === void 0 && (this.isLocked = hl(this.$refs["scroll-container"])), this.isLocked = e;
    }
  },
  watch: {
    lock: {
      handler: function(e) {
        this.lockHandler(e);
      }
    }
  },
  components: { VuSpinner: ss, VuLazy: Zn }
}, ia = { class: "vu-scroll-container__inner" };
function oa(e, n, t, i, o, s) {
  const a = O("VuSpinner"), d = O("VuLazy");
  return l(), u("div", {
    ref: "scroll-container",
    class: k(["vu-scroll-container", [{
      "vu-scroll-container--reverse": t.reverse,
      "vu-scroll-container--horizontal": t.horizontal,
      "vu-scroll-container--always-show": t.alwaysShow,
      "vu-scroll-container--classic": !s.noCss,
      firefox: o.firefox
    }]])
  }, [
    g("div", ia, [
      t.dataBefore && !o.waitBefore ? (l(), S(d, {
        key: `lazy-key-${o.lazyKeyIndex2}`,
        onIntersect: n[0] || (n[0] = (c) => {
          e.$emit("loading-before"), e.$emit("loading", !0);
        }),
        options: s.options,
        height: t.infiniteBeforeHeight || t.infiniteHeight,
        class: "vu-scroll__lazy vu-scroll__lazy-top"
      }, {
        default: M(() => [
          C(e.$slots, "loadingBefore", {}, () => [
            x(a, { text: t.loadingText }, null, 8, ["text"])
          ], !0)
        ]),
        _: 3
      }, 8, ["options", "height"])) : p("", !0),
      C(e.$slots, "default", {}, void 0, !0),
      (t.infinite || t.dataAfter) && !o.wait ? (l(), S(d, {
        key: `lazy-key-${o.lazyKeyIndex}`,
        onIntersect: n[1] || (n[1] = (c) => e.$emit("loading")),
        options: s.options,
        height: t.infiniteHeight,
        style: { "min-width": "30px" },
        class: "vu-scroll__lazy vu-scroll__lazy-bottom"
      }, {
        default: M(() => [
          C(e.$slots, "loading", {}, () => [
            x(a, { text: t.loadingText }, null, 8, ["text"])
          ], !0)
        ]),
        _: 3
      }, 8, ["options", "height"])) : t.showLoading ? C(e.$slots, "loading", { key: 2 }, () => [
        x(a, { text: t.loadingText }, null, 8, ["text"])
      ], !0) : p("", !0)
    ])
  ], 2);
}
const Qe = /* @__PURE__ */ A(sa, [["render", oa], ["__scopeId", "data-v-3c3e6fb1"]]), la = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Qe
}, Symbol.toStringTag, { value: "Module" }));
T();
const aa = {
  name: "vu-dropdownmenu-items-scrollable",
  components: { VuIcon: pe, VuImage: at, VuScroller: Qe },
  expose: ["checkHeight"],
  emits: ["update:responsive", "update:position", "click-item", "update:selected"],
  props: {
    target: {
      type: Object,
      required: !1
    },
    items: {
      type: Array,
      required: !0,
      validator: ns
    },
    selected: {
      type: Array,
      required: !0
    },
    zIndex: {
      type: Number,
      default: 1e3
    },
    itemHeight: {
      type: Number,
      default: 45
    },
    scrollable: {
      type: Boolean,
      default: !1
    },
    maxItemsBeforeScroll: {
      type: Number,
      default: 7
    }
  },
  data: () => ({
    uuid: Ge,
    root: !1,
    height: void 0,
    scrolling: !1
  }),
  watch: {
    scrollable(e) {
      var n;
      e && ((n = this.items) != null && n.length) ? this.checkHeight() : this.scrolling = !1;
    },
    items() {
      this.scrollable && this.checkHeight();
    }
  },
  async mounted() {
    await this.$nextTick(), this.scrollable && this.items && this.checkHeight();
  },
  methods: {
    toggleSelected(e) {
      const n = this.selected.slice(0);
      return e.selected || this.selected.includes(e) ? n.splice(this.selected.indexOf(e), 1) : n.push(e), n;
    },
    onItemClick(e) {
      e.disabled || ((e.selectable || e.selected || this.selected.includes(e)) && this.$emit("update:selected", this.toggleSelected(e)), this.$emit("click-item", e));
    },
    async checkHeight() {
      if (this.scrollable) {
        this.scrolling = !0, await this.$nextTick();
        const { offsetHeight: e } = this.$refs.items, { offsetHeight: n } = this.$el;
        this.scrolling = e > n;
      } else
        this.scrolling = !1;
    }
  }
}, ra = {
  class: "dropdown-menu-wrap",
  ref: "items"
}, ua = ["onClick"], da = {
  key: 1,
  class: "p-[5px] w-[44px] float-left h-full"
}, ca = { class: "item-text" }, ha = {
  key: 0,
  class: "item-text"
};
function fa(e, n, t, i, o, s) {
  const a = O("VuIcon"), d = O("VuImage"), c = O("VuScroller");
  return l(), u("div", {
    class: "dropdown-menu dropdown-menu-root dropdown-root",
    style: K([{ zIndex: t.zIndex }]),
    ref: "self"
  }, [
    x(c, {
      style: K([
        t.scrollable ? {
          maxHeight: `${t.itemHeight * t.maxItemsBeforeScroll - 1}px`
        } : "",
        e.scrolling ? "" : {
          "overflow-y": "hidden"
        }
      ])
    }, {
      default: M(() => [
        g("ul", ra, [
          (l(!0), u(V, null, j(t.items, (r) => (l(), u(V, null, [
            !r.class || !r.class.includes("header") && !r.class.includes("divider") ? (l(), u("li", {
              key: r.text || r.label,
              class: k(["item", [{
                selectable: !r.disabled && r.selectable || r.selected || t.selected.includes(r),
                selected: r.selected || t.selected.includes(r),
                hidden: r.hidden,
                disabled: r.disabled
              }, r.class]]),
              onClick: re((h) => s.onItemClick(r), ["stop"])
            }, [
              C(e.$slots, "default", { item: r }, () => [
                r.fonticon ? (l(), S(a, {
                  key: 0,
                  icon: r.fonticon,
                  withinText: !1
                }, null, 8, ["icon"])) : r.imageSource ? (l(), u("div", da, [
                  x(d, {
                    src: r.imageSource,
                    aspectRatio: "1",
                    width: "34"
                  }, null, 8, ["src"])
                ])) : p("", !0),
                g("span", ca, w(r.text || r.label), 1)
              ], !0)
            ], 10, ua)) : (l(), u("li", {
              key: r.text || r.label || e.uuid(),
              class: k(r.class)
            }, [
              r.class !== "divider" ? (l(), u("span", ha, w(r.text || r.label), 1)) : p("", !0)
            ], 2))
          ], 64))), 256))
        ], 512)
      ]),
      _: 3
    }, 8, ["style"])
  ], 4);
}
const hi = /* @__PURE__ */ A(aa, [["render", fa], ["__scopeId", "data-v-fc92511a"]]), pa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: hi
}, Symbol.toStringTag, { value: "Module" })), fi = ["top", "top-right", "bottom-right", "bottom", "bottom-left", "top-left"], pi = ({ intersectionRatio: e, elementRect: n, targetRect: t }) => e < 1 && (n.top < t.top || n.bottom > t.bottom), mi = (e, n, t, i) => {
  if (i.length === 1) {
    const o = i[0];
    return o.includes("top") ? o.replace("top", "bottom") : o.replace("bottom", "top");
  } else
    i.length > 1 && i.push(...fi);
  return n;
};
function vi(e, n = !0) {
  let t = n;
  return e.forEach((i) => {
    !i.text && !i.label && (!i.class || !i.class.includes("divider")) && (t = !1), i.items && (t = vi(i.items, t));
  }), t;
}
const ma = {
  components: { VuDropdownmenuItems: dn, VuPopover: Ke },
  name: "vu-dropdownmenu",
  mixins: [Tt, Gn],
  emits: ["open", "close", "click-item", "update:modelValue"],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      required: !0,
      validator: vi
    },
    dividedResponsiveItems: {
      type: Boolean,
      default: !1
    },
    position: {
      type: String,
      required: !1,
      default: "bottom-left"
    },
    arrow: {
      type: Boolean,
      default: !1
    },
    overlay: {
      type: Boolean,
      default: !1
    },
    zIndex: {
      type: Number,
      default: () => 1e3
    },
    responsive: {
      type: Boolean,
      default: !1
    },
    shift: {
      type: Boolean,
      default: !1
    },
    closeOnClick: {
      type: Boolean,
      default: !0
    },
    positions: {
      type: Array,
      required: !1,
      default: () => fi
    },
    getNextPosition: {
      type: Function,
      required: !1,
      default: mi
    },
    checkPosition: {
      type: Function,
      required: !1,
      default: pi
    },
    ignoreEscapeKey: {
      type: Boolean,
      default: !1
    },
    ignoreClickOutside: {
      type: Boolean,
      default: !1
    },
    contentClass: {
      type: String
    },
    scrollable: {
      type: Boolean,
      default: !1
    },
    itemHeight: {
      type: Number,
      default: 45
    },
    maxItemsBeforeScroll: {
      type: Number,
      default: 7
    }
  },
  data: () => ({
    innerResponsive: !1
  }),
  computed: {
    isResponsive: {
      get() {
        return this.innerResponsive || this.responsive;
      },
      set(e) {
        this.innerResponsive = e;
      }
    },
    hasNotSubMenus() {
      var e;
      return !((e = this.items) != null && e.some(({ items: n }) => n !== void 0));
    },
    isScrollable() {
      return this.hasNotSubMenus && this.scrollable;
    }
  },
  watch: {
    async items() {
      var e;
      this.innerShow && (await this.$nextTick(), this.isScrollable && ((e = this.$refs.dropdownItems) == null || e.checkHeight()), this.$refs.popover.updatePosition());
    }
  },
  methods: {
    handleClick(e) {
      e.disabled || (e.handler && e.handler(e), this.$emit("click-item", e), this.updateShow(!1));
    },
    updateShow(e) {
      e ? (this.isResponsive = !1, this.$emit("open")) : this.closeOnClick && (this.innerShow = !1, this.$emit("close"));
    }
  }
}, rt = /* @__PURE__ */ Object.assign(ma, {
  setup(e) {
    const n = Te(ri, !1);
    return (t, i) => (l(), S(Ke, {
      ref: "popover",
      show: t.innerShow,
      "onUpdate:show": [
        i[3] || (i[3] = (o) => t.innerShow = o),
        t.updateShow
      ],
      shift: e.shift || e.responsive,
      type: "dropdownmenu popover",
      attach: t.target,
      side: e.position,
      overlay: e.overlay || q(n),
      animated: !1,
      "check-position": q(pi),
      "get-next-position": q(mi),
      contentClass: e.contentClass,
      "ignore-click-outside": e.ignoreClickOutside,
      arrow: !1,
      ignoreEscapeKey: e.ignoreEscapeKey
    }, {
      body: M(() => [
        t.isScrollable ? (l(), S(hi, {
          key: 0,
          scrollable: !0,
          target: t.target,
          items: e.items,
          selected: e.value,
          onClickItem: t.handleClick,
          "onUpdate:selected": i[0] || (i[0] = (o) => t.$emit("update:modelValue", o))
        }, null, 8, ["target", "items", "selected", "onClickItem"])) : (l(), S(dn, {
          key: 1,
          responsive: t.isResponsive,
          "onUpdate:responsive": i[1] || (i[1] = (o) => t.isResponsive = o),
          "divided-responsive-items": e.dividedResponsiveItems,
          target: t.target,
          items: e.items,
          selected: e.value,
          onClickItem: t.handleClick,
          "onUpdate:selected": i[2] || (i[2] = (o) => t.$emit("update:modelValue", o))
        }, null, 8, ["responsive", "divided-responsive-items", "target", "items", "selected", "onClickItem"]))
      ]),
      default: M(() => [
        C(t.$slots, "default", { active: t.innerShow })
      ]),
      _: 3
    }, 8, ["show", "shift", "attach", "side", "overlay", "check-position", "get-next-position", "contentClass", "ignore-click-outside", "ignoreEscapeKey", "onUpdate:show"]));
  }
}), va = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: rt
}, Symbol.toStringTag, { value: "Module" })), is = {
  props: {
    active: {
      type: Boolean,
      default: () => !1
    }
  }
}, ga = {
  name: "vu-icon-btn",
  mixins: [is, Oe, xt, Gs],
  components: { VuIcon: pe },
  props: {
    icon: {
      required: !0,
      type: String
    },
    disableChevronResize: {
      default: !1,
      type: Boolean
    },
    hover: {
      default: !1,
      type: Boolean
    },
    noActive: {
      default: !1,
      type: Boolean
    },
    noHover: {
      default: !1,
      type: Boolean
    }
  }
};
function ya(e, n, t, i, o, s) {
  const a = O("VuIcon");
  return l(), u("div", {
    class: k(["vu-icon-btn", [e.color, e.size, {
      active: e.active && !t.noActive,
      "no-active": t.noActive,
      hovered: !t.noHover && t.hover,
      "no-hover": t.noHover,
      disabled: e.disabled
    }]]),
    onClickCapture: n[0] || (n[0] = (d) => {
      e.disabled && d.stopPropagation();
    })
  }, [
    x(a, {
      icon: t.icon,
      color: e.color,
      class: k({ "chevron-menu-icon": t.icon === "chevron-down" && t.disableChevronResize, disabled: e.disabled })
    }, null, 8, ["icon", "color", "class"])
  ], 34);
}
const ue = /* @__PURE__ */ A(ga, [["render", ya], ["__scopeId", "data-v-c774dbe5"]]), ba = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ue
}, Symbol.toStringTag, { value: "Module" })), _a = {
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
      started: !1
    };
  },
  mounted() {
  },
  watch: {},
  methods: {},
  components: { VuImage: at, VuIcon: pe, VuIcon: pe, VuDropdownmenu: rt, VuStatusBar: Jn, VuIconBtn: ue }
}, wa = { class: "tile-wrap" }, ka = {
  key: 0,
  class: "tile__thumb"
}, Sa = {
  key: 1,
  class: "tile__image"
}, Ia = { class: "tile__title" }, Ca = { class: "inner" }, Ba = {
  key: 0,
  class: "tile__meta"
}, Oa = { class: "inner" }, $a = {
  key: 1,
  class: "tile__text"
}, xa = { class: "inner" }, Ta = {
  key: 2,
  class: "tile__action-icon"
};
function Va(e, n, t, i, o, s) {
  const a = O("VuImage"), d = O("VuIcon"), c = O("vuIconBtn"), r = O("VuDropdownmenu"), h = O("VuIconBtn"), f = O("VuStatusBar");
  return l(), u("div", {
    class: k(["vu-tile", s.classes])
  }, [
    g("div", wa, [
      t.active ? (l(), u("div", ka)) : p("", !0),
      t.src ? (l(), u("div", Sa, [
        x(a, {
          src: t.src,
          width: "80",
          height: "60",
          contain: "",
          "aspect-ratio": "1",
          lazy: s.vuCollectionLazyImages
        }, null, 8, ["src", "lazy"]),
        t.src && (t.selectable || t.selected) ? (l(), S(d, {
          key: 0,
          icon: "check",
          class: "tile__check"
        })) : p("", !0)
      ])) : p("", !0),
      g("div", {
        class: k(["tile__content", s.contentClasses])
      }, [
        g("div", Ia, [
          t.type ? (l(), S(d, {
            key: 0,
            icon: t.type
          }, null, 8, ["icon"])) : p("", !0),
          g("span", Ca, w(t.title), 1)
        ]),
        s.meta ? (l(), u("div", Ba, [
          g("span", Oa, w(s.meta), 1)
        ])) : p("", !0),
        t.text ? (l(), u("div", $a, [
          g("span", xa, w(t.text), 1)
        ])) : p("", !0)
      ], 2),
      s._actions ? (l(), u("div", Ta, [
        s._actions.length > 1 ? (l(), S(r, {
          key: 0,
          items: s._actions,
          onClickItem: n[0] || (n[0] = (y) => e.$emit("click-action", { item: y, id: t.id }))
        }, {
          default: M((y) => [
            x(c, {
              icon: "chevron-down",
              class: k(y)
            }, null, 8, ["class"])
          ]),
          _: 1
        }, 8, ["items"])) : (l(), S(h, {
          key: 1,
          icon: s._actions[0].fonticon,
          onClick: n[1] || (n[1] = (y) => e.$emit("click-action", { item: y, id: t.id }))
        }, null, 8, ["icon"]))
      ])) : p("", !0)
    ]),
    t.hideStatusBar ? p("", !0) : (l(), S(f, {
      key: 0,
      status: t.status
    }, null, 8, ["status"]))
  ], 2);
}
const gi = /* @__PURE__ */ A(_a, [["render", Va], ["__scopeId", "data-v-f0868abb"]]), Ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gi
}, Symbol.toStringTag, { value: "Module" })), Pa = {
  name: "vu-thumbnail",
  inject: ["vuCollectionLazyImages"],
  props: {
    /* eslint-disable vue/require-default-prop */
    id: {
      type: String,
      required: !0
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
    getListenersFromAttrs: Ze
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
  components: { VuImage: at, VuIcon: pe, VuTile: gi, VuStatusBar: Jn }
}, La = {
  class: "thumbnail-wrap",
  style: { position: "relative" }
}, Da = {
  key: 0,
  class: "thumbnail__thumb"
}, Aa = { class: "thumbnail__content" };
function Fa(e, n, t, i, o, s) {
  const a = O("VuImage"), d = O("VuIcon"), c = O("VuTile"), r = O("VuStatusBar");
  return l(), u("div", {
    class: k(["vu-thumbnail item", s.classes])
  }, [
    g("div", La, [
      x(a, {
        src: t.src,
        lazy: s.vuCollectionLazyImages,
        "aspect-ratio": "200/150",
        contain: ""
      }, null, 8, ["src", "lazy"]),
      t.active ? (l(), u("div", Da)) : p("", !0),
      t.selectable || t.selected ? (l(), S(d, {
        key: 1,
        icon: "check",
        class: "thumbnail__check"
      })) : p("", !0),
      x(c, {
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
      g("div", Aa, w(t.text), 1),
      t.hideStatusBar ? p("", !0) : (l(), S(r, {
        key: 2,
        status: t.status
      }, null, 8, ["status"]))
    ])
  ], 2);
}
const za = /* @__PURE__ */ A(Pa, [["render", Fa], ["__scopeId", "data-v-a149de4c"]]), Ea = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: za
}, Symbol.toStringTag, { value: "Module" })), vt = {
  props: {
    loading: {
      type: Boolean,
      default: () => !1
    }
  }
}, Na = {
  name: "vu-accordion",
  mixins: [vt],
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
      default: () => !1
    },
    filled: {
      type: Boolean,
      default: () => !1
    },
    divided: {
      type: Boolean,
      default: () => !1
    },
    outlined: {
      type: Boolean,
      default: () => !1
    },
    separated: {
      type: Boolean,
      default: () => !1
    },
    animated: {
      type: Boolean,
      default: () => !1
    },
    exclusive: {
      type: Boolean,
      default: () => !1
    },
    keepRendered: {
      type: Boolean,
      default: () => !1
    }
  },
  emits: ["update:modelValue"],
  data: () => ({
    guid: Ge
  }),
  created() {
    if (this.open && !this.exclusive) {
      let e = this.items;
      const n = [];
      for (; e; )
        n.push(e--);
      this.$emit("update:modelValue", n);
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
        const n = this.value.slice();
        n.splice(n.indexOf(e), 1), this.$emit("update:modelValue", n);
      } else
        this.exclusive ? this.$emit("update:modelValue", [e]) : this.$emit("update:modelValue", [e].concat(this.value || []));
    }
  }
}, Ra = { class: "accordion-container" }, Ha = ["onClick"], ja = /* @__PURE__ */ g("i", { class: "caret-left" }, null, -1), Ua = {
  key: 0,
  class: "content-wrapper"
};
function Wa(e, n, t, i, o, s) {
  const a = _e("mask");
  return H((l(), u("div", Ra, [
    g("div", {
      class: k(["accordion accordion-root", {
        filled: t.filled,
        "filled-separate": t.separated,
        divided: t.divided,
        styled: t.outlined,
        animated: t.animated
      }])
    }, [
      (l(!0), u(V, null, j(t.items, (d) => (l(), u("div", {
        key: `${e.guid}-accordion-${d}`,
        class: k(["accordion-item", { active: s.value.includes(d) }])
      }, [
        g("div", {
          onClick: (c) => s.toggle(d),
          class: "accordion-title"
        }, [
          ja,
          C(e.$slots, "title-" + d)
        ], 8, Ha),
        t.keepRendered || s.value.includes(d) ? H((l(), u("div", Ua, [
          g("div", {
            class: k(["content", { "accordion-animated-content": t.animated }])
          }, [
            C(e.$slots, "item-" + d)
          ], 2)
        ], 512)), [
          [Ve, s.value.includes(d)]
        ]) : p("", !0)
      ], 2))), 128))
    ], 2)
  ])), [
    [a, e.loading]
  ]);
}
const qa = /* @__PURE__ */ A(Na, [["render", Wa]]), Ka = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qa
}, Symbol.toStringTag, { value: "Module" })), os = (e, ...n) => Object.fromEntries(
  n.filter((t) => t in e).map((t) => [t, e[t]])
), Ga = (e, ...n) => Object.fromEntries(
  n.filter(({ key: t }) => t in e).map(({ key: t, newName: i = t }) => [i, e[t]])
), Ya = (e) => (et("data-v-9c530f03"), e = e(), tt(), e), Xa = { class: "vu-alert-dialog vu-alert-dialog-root" }, Ja = { class: "vu-alert-dialog-content" }, Za = /* @__PURE__ */ Ya(() => /* @__PURE__ */ g("hr", null, null, -1)), Qa = [
  Za
], er = { class: "vu-alert-dialog-body" }, tr = ["src"], nr = {
  key: 3,
  class: "vu-alert-dialog-title"
}, sr = {
  key: 4,
  class: "vu-alert-dialog-text"
}, ir = { class: "vu-alert-dialog-buttons" }, or = {
  name: "vu-alert-dialog"
}, lr = /* @__PURE__ */ Ae({
  ...or,
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
  setup(e, { emit: n }) {
    const t = e, i = n, o = Y(() => os(t, "height", "maxHeight", "maxWidth", "minHeight", "minWidth", "width", "contain", "aspectRatio")), s = Te(ii, "Confirm"), a = Te(oi, "Close"), d = Te(ai, "Cancel"), c = Te(li, "Proceed");
    return (r, h) => {
      const f = O("vu-icon"), y = O("vu-btn");
      return l(), u("div", Xa, [
        x(It, { name: "fade" }, {
          default: M(() => [
            !r.noOverlay && !(r.animate && !r._show) ? (l(), u("div", {
              key: 0,
              class: "vu-overlay",
              onClick: h[0] || (h[0] = (b) => r.emitCancelOnClickOutside ? i("cancel") : i("close"))
            })) : p("", !0)
          ]),
          _: 1
        }),
        g("div", {
          class: k(["vu-alert-dialog-wrap", { "vu-alert-dialog--disposed": r.animate && !r._show }])
        }, [
          g("div", Ja, [
            g("div", {
              class: "vu-alert-dialog-drag-handle",
              onClick: h[1] || (h[1] = (b) => r.emitCancelOnClickOutside ? i("cancel") : i("close"))
            }, Qa),
            g("div", er, [
              C(r.$slots, "alert-content", {}, () => [
                r.img || r.src ? (l(), S(at, te({
                  key: 0,
                  class: "vu-alert-dialog-image"
                }, o.value, {
                  src: r.img || r.src
                }), null, 16, ["src"])) : r.svgUrl ? (l(), u("img", {
                  key: 1,
                  src: r.svgUrl,
                  style: { height: "120px !important" }
                }, null, 8, tr)) : r.icon || r.svg ? (l(), u("div", {
                  key: 2,
                  class: k(["vu-alert-dialog-icon-wrap", [{ "vu-alert-dialog-icon-circle": r.iconCircle }, r.iconColor ? `vu-alert-dialog-icon-${r.iconColor}` : ""]])
                }, [
                  r.svg ? (l(), S(Wt(r.svg), { key: 1 })) : (l(), S(f, {
                    key: 0,
                    icon: r.icon,
                    "within-text": !1
                  }, null, 8, ["icon"]))
                ], 2)) : p("", !0),
                r.title ? (l(), u("div", nr, w(r.title), 1)) : p("", !0),
                r.text ? (l(), u("div", sr, w(r.text), 1)) : p("", !0)
              ], !0),
              C(r.$slots, "alert-buttons", {}, () => [
                g("div", ir, [
                  r.showConfirmButton ? (l(), S(y, {
                    key: 0,
                    color: "primary",
                    onClick: h[2] || (h[2] = (b) => i("confirm"))
                  }, {
                    default: M(() => [
                      X(w(r.confirmButtonLabel || q(s)), 1)
                    ]),
                    _: 1
                  })) : p("", !0),
                  r.showRiskyButton ? (l(), S(y, {
                    key: 1,
                    color: "error",
                    onClick: h[3] || (h[3] = (b) => i("confirm"))
                  }, {
                    default: M(() => [
                      X(w(r.riskyButtonLabel || q(c)), 1)
                    ]),
                    _: 1
                  })) : p("", !0),
                  r.showCloseButton ? (l(), S(y, {
                    key: 2,
                    onClick: h[4] || (h[4] = (b) => r.emitCancelOnCloseButtonClick ? i("cancel") : i("close"))
                  }, {
                    default: M(() => [
                      X(w(r.closeButtonLabel || r.showRiskyButton && q(d) || q(a)), 1)
                    ]),
                    _: 1
                  })) : p("", !0)
                ])
              ], !0)
            ])
          ])
        ], 2)
      ]);
    };
  }
}), ls = /* @__PURE__ */ A(lr, [["__scopeId", "data-v-9c530f03"]]), ar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ls
}, Symbol.toStringTag, { value: "Module" })), rr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 128"
}, ur = /* @__PURE__ */ g("path", { d: "M125.26 34.87 93.13 2.74C91.42 1.03 89.15 0 86.73 0H41.28c-2.42 0-4.69 1.03-6.4 2.74L2.74 34.87C1.03 36.58 0 38.85 0 41.27v45.45c0 2.42 1.03 4.69 2.74 6.4l32.13 32.13c1.71 1.71 3.98 2.74 6.4 2.74h45.45c2.42 0 4.69-1.03 6.4-2.74l32.13-32.13c1.71-1.71 2.74-3.98 2.74-6.4V41.27c0-2.42-1.03-4.69-2.74-6.4Zm-24.3 49.37-16.72 16.72L64 80.58l-20.24 20.38-16.72-16.72L47.42 64 27.04 43.76l16.72-16.72L64 47.42l20.24-20.38 16.72 16.72L80.58 64z" }, null, -1), dr = [
  ur
];
function cr(e, n) {
  return l(), u("svg", rr, [...dr]);
}
const hr = { render: cr }, fr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 128"
}, pr = /* @__PURE__ */ g("path", { d: "M64 0C28.65 0 0 28.65 0 64s28.65 64 64 64 64-28.65 64-64S99.35 0 64 0m9.14 109.71H54.85V47.02h18.29zM64 36.57c-5.05 0-9.14-4.09-9.14-9.14s4.09-9.14 9.14-9.14 9.14 4.09 9.14 9.14-4.09 9.14-9.14 9.14" }, null, -1), mr = [
  pr
];
function vr(e, n) {
  return l(), u("svg", fr, [...mr]);
}
const gr = { render: vr }, yr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 128"
}, br = /* @__PURE__ */ g("path", { d: "M64 0C28.65 0 0 28.65 0 64s28.65 64 64 64 64-28.65 64-64S99.35 0 64 0m9.14 111.02H54.85V92.73h18.29zm13.33-43.89c-5.83 4.34-12.1 7.15-13.32 15.15H54.86c.81-11.79 6.46-17.35 11.89-21.55 5.29-4.2 9.8-7.31 9.8-14.63 0-8.27-4.31-12.15-11.49-12.15-9.76 0-13.84 8.01-13.98 17.63H31.23c.41-19.38 13.12-33.57 32.91-33.57 25.62 0 33.7 15.82 33.7 26.25 0 13.15-5.53 18.38-11.36 22.86Z" }, null, -1), _r = [
  br
];
function wr(e, n) {
  return l(), u("svg", yr, [..._r]);
}
const kr = { render: wr }, Sr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 112.85"
}, Ir = /* @__PURE__ */ g("path", { d: "M128 105.8c0-1.18-.26-2.39-.91-3.53L70.14 3.53C68.78 1.18 66.38 0 64 0s-4.78 1.17-6.14 3.53L.91 102.27c-.66 1.14-.91 2.35-.91 3.53 0 3.69 2.93 7.05 7.05 7.05h113.89c4.12 0 7.05-3.36 7.05-7.05Zm-54.86-7.84c0 1.44-1.17 2.61-2.61 2.61H57.47c-1.44 0-2.61-1.17-2.61-2.61V84.9c0-1.44 1.17-2.61 2.61-2.61h13.06c1.44 0 2.61 1.17 2.61 2.61zm-1.3-26.12H56.17l-1.31-37.88c0-3.61 2.92-6.53 6.53-6.53h5.22c3.61 0 6.53 2.92 6.53 6.53l-1.31 37.88Z" }, null, -1), Cr = [
  Ir
];
function Br(e, n) {
  return l(), u("svg", Sr, [...Cr]);
}
const Bs = { render: Br };
let yi = {
  show: () => new Promise((e) => e),
  hide: () => {
  },
  information: () => new Promise((e) => e),
  confirm: () => new Promise((e) => e),
  warning: () => new Promise((e) => e),
  confirmWithRisk: () => new Promise((e) => e),
  error: () => new Promise((e) => e),
  _alerts: mt([])
};
function Or(e) {
  const n = mt([]), t = Nn({
    _alerts: n,
    show(i) {
      return this.hide(), new Promise((o, s) => {
        const a = {
          id: Ge(),
          component: ls,
          bind: pt({
            height: 120,
            ...i,
            contain: !0,
            _show: !0
          }),
          on: {
            close: () => {
              this.hide(a), o();
            },
            confirm: () => {
              this.hide(a), o();
            },
            cancel: () => {
              this.hide(a), s();
            }
          }
        };
        this._alerts.push(mt(a));
      });
    },
    hide(i) {
      if (i) {
        const o = this._alerts.find((s) => s.id === i.id);
        if (!o)
          return;
        o.bind._show = !1, setTimeout(() => {
          const s = this._alerts.findIndex((a) => a.id === i.id);
          s > -1 && this._alerts.splice(s, 1);
        }, o.bind.animationDuration);
      } else
        this._alerts.forEach((o) => {
          o._show = !1;
        }), this._alerts.splice(0, this._alerts.length);
    },
    information(i) {
      return this.show({
        showCloseButton: !0,
        iconColor: "cyan",
        iconCircle: !0,
        icon: "info",
        svg: gr,
        animate: !0,
        animationDuration: 300,
        ...i
      });
    },
    confirm(i) {
      return this.show({
        showCloseButton: !0,
        showConfirmButton: !0,
        iconColor: "cyan",
        iconCircle: !0,
        icon: "help",
        svg: kr,
        animate: !0,
        animationDuration: 300,
        ...i,
        emitCancelOnClickOutside: !0,
        emitCancelOnCloseButtonClick: !0
      });
    },
    warning(i) {
      return this.show({
        iconColor: "orange",
        icon: "attention",
        svg: Bs,
        iconCircle: !0,
        showCloseButton: !0,
        animate: !0,
        animationDuration: 300,
        ...i
      });
    },
    confirmWithRisk(i) {
      return this.show({
        iconColor: "orange",
        icon: "attention",
        svg: Bs,
        iconCircle: !0,
        showRiskyButton: !0,
        showCloseButton: !0,
        animate: !0,
        animationDuration: 300,
        ...i,
        emitCancelOnClickOutside: !0,
        emitCancelOnCloseButtonClick: !0
      });
    },
    error(i) {
      return this.show({
        iconColor: "red",
        iconCircle: !0,
        icon: "error",
        svg: hr,
        showCloseButton: !0,
        animate: !0,
        animationDuration: 300,
        ...i
      });
    }
  });
  return yi = t, e.provide("vuAlertDialogAPI", t), e.config.globalProperties.$vuAlertDialog = t, t;
}
const $r = {
  name: "vu-alert-dialog-container",
  components: {
    VuAlertDialog: ls
  },
  data: () => ({
    _alerts: {
      type: Object
    }
  }),
  created() {
    this._alerts = yi._alerts;
  }
};
function xr(e, n, t, i, o, s) {
  return l(!0), u(V, null, j(e._alerts, (a) => (l(), S(Wt(a.component), te({
    key: a.id
  }, a.bind, {
    modelValue: a.value,
    "onUpdate:modelValue": (d) => a.value = d
  }, ot(a.on)), null, 16, ["modelValue", "onUpdate:modelValue"]))), 128);
}
const Tr = /* @__PURE__ */ A($r, [["render", xr]]), Vr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tr
}, Symbol.toStringTag, { value: "Module" })), Fe = {
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
}, Mr = {
  name: "vu-btn",
  mixins: [vt, is, xt, Fe, Oe],
  props: {
    large: {
      type: Boolean,
      default: () => !1
    },
    small: {
      type: Boolean,
      default: () => !1
    },
    block: {
      type: Boolean,
      default: () => !1
    },
    icon: {
      type: String,
      required: !1
    }
  },
  data: () => ({
    getListenersFromAttrs: Ze
    // tooltip: {},
  }),
  components: { VuIcon: pe },
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
}, Pr = ["disabled"];
function Lr(e, n, t, i, o, s) {
  const a = O("VuIcon"), d = _e("mask");
  return H((l(), u("button", te({
    type: "button",
    disabled: e.disabled
  }, ot(e.getListenersFromAttrs(e.$attrs), !0), { class: s.classes }), [
    t.icon ? (l(), S(a, {
      key: 0,
      icon: t.icon,
      color: "inherit"
    }, null, 8, ["icon"])) : p("", !0),
    C(e.$slots, "default", {}, void 0, !0)
  ], 16, Pr)), [
    [d, e.loading]
  ]);
}
const Ye = /* @__PURE__ */ A(Mr, [["render", Lr], ["__scopeId", "data-v-e776bbe0"]]), Dr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ye
}, Symbol.toStringTag, { value: "Module" })), Ar = { class: "vu-btn-dropdown flex flex-nowrap" }, Fr = {
  key: 1,
  class: "caret text-grey-7"
}, zr = {
  name: "vu-btn-dropdown",
  components: { VuDropdownMenu: rt, VuBtn: Ye, VuIcon: pe, VuIconBtn: ue }
}, Er = /* @__PURE__ */ Ae({
  ...zr,
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
  setup(e, { emit: n }) {
    const t = e, i = n;
    return (o, s) => (l(), u("div", Ar, [
      x(Ye, {
        icon: t.icon,
        color: t.color,
        class: "flex-basis-auto",
        style: K(t.options && "border-top-right-radius:0;border-bottom-right-radius:0"),
        onClick: s[0] || (s[0] = (a) => i("click", a))
      }, {
        default: M(() => [
          C(o.$slots, "default", {}, () => [
            X(w(o.label), 1)
          ], !0)
        ]),
        _: 3
      }, 8, ["icon", "color", "style"]),
      t.options ? (l(), S(rt, te({ key: 0 }, { ...t, items: o.options }, {
        class: "flex-basis-[38px] ml-[2px]",
        style: { display: "flex" },
        onClickItem: s[1] || (s[1] = (a) => i("click-item", a))
      }), {
        default: M(({ active: a }) => [
          x(Ye, {
            color: o.color,
            class: "dropdown_btn",
            active: a
          }, {
            default: M(() => [
              o.chevronDown ? (l(), S(pe, {
                key: 0,
                icon: "chevron-down"
              })) : (l(), u("span", Fr))
            ]),
            _: 2
          }, 1032, ["color", "active"])
        ]),
        _: 1
      }, 16)) : p("", !0)
    ]));
  }
}), Nr = /* @__PURE__ */ A(Er, [["__scopeId", "data-v-ba275fde"]]), Rr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nr
}, Symbol.toStringTag, { value: "Module" })), Hr = {
  name: "vu-btn-grp",
  mixins: [vt],
  props: {
    color: {
      type: String,
      default: () => "default"
    }
  }
}, jr = { class: "btn-grp" };
function Ur(e, n, t, i, o, s) {
  const a = _e("mask");
  return H((l(), u("div", jr, [
    C(e.$slots, "default")
  ])), [
    [a, e.loading]
  ]);
}
const Wr = /* @__PURE__ */ A(Hr, [["render", Ur]]), qr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Wr
}, Symbol.toStringTag, { value: "Module" })), Kr = {
  name: "vu-carousel-slide",
  props: { title: { type: String, default: "" } },
  emits: ["slideclick", "slide-click"],
  data() {
    return {
      width: null,
      id: "",
      carousel: void 0,
      guid: Ge
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
      const { currentPage: e = 0, breakpointSlidesPerPage: n, children: t } = this.carousel, i = [], o = t.filter(
        (a) => a.$el && a.$el.className.indexOf("vu-slide") >= 0
      ).map((a) => a._uid || a.id);
      let s = 0;
      for (; s < n; ) {
        const a = o[e * n + s];
        i.push(a), s++;
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
      return e % 2 === 0 || !this.isActive ? !1 : this.activeSlides.indexOf(this._uid) === Math.floor(e / 2);
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
      const n = this.carousel.isTouch && e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].clientX : e.clientX, t = this.carousel.dragStartX - n;
      (this.carousel.minSwipeDistance === 0 || Math.abs(t) < this.carousel.minSwipeDistance) && (this.$emit("slideclick", { ...e.currentTarget.dataset }), this.$emit("slide-click", { ...e.currentTarget.dataset }));
    }
  }
}, Gr = ["aria-hidden"];
function Yr(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k(["vu-slide", {
      "vu-slide-active": s.isActive,
      "vu-slide-center": s.isCenter,
      "vu-slide-adjustableHeight": s.isAdjustableHeight
    }]),
    tabindex: "-1",
    "aria-hidden": !s.isActive,
    role: "tabpanel"
  }, [
    C(e.$slots, "default")
  ], 10, Gr);
}
const Xr = /* @__PURE__ */ A(Kr, [["render", Yr]]), Jr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xr
}, Symbol.toStringTag, { value: "Module" })), Zr = {
  props: {
    /**
     * Flag to enable autoplay
     */
    autoplay: {
      type: Boolean,
      default: !1
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
      default: !0
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
}, Qr = (e, n, t) => {
  let i;
  return () => {
    const s = () => {
      i = null, t || e.apply(void 0);
    }, a = t && !i;
    clearTimeout(i), i = setTimeout(s, n), a && e.apply(void 0);
  };
}, kn = {
  onwebkittransitionend: "webkitTransitionEnd",
  onmoztransitionend: "transitionend",
  onotransitionend: "oTransitionEnd otransitionend",
  ontransitionend: "transitionend"
}, Os = () => {
  const e = Object.keys(kn).find((n) => n in window);
  return e ? kn[e] : kn.ontransitionend;
}, eu = {
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
      dragging: !1,
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
  mixins: [Zr],
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
      default: !1
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
      default: !1
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
      default: !1
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
      default: !0
    },
    /**
       * Flag to toggle touch dragging
       */
    touchDrag: {
      type: Boolean,
      default: !0
    },
    /**
       * Flag to render pagination component
       */
    pagination: {
      type: Boolean,
      default: !0
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
      default: !1
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
      e === !1 ? this.pauseAutoplay() : this.restartAutoplay();
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
      const e = this.perPageCustom, n = this.browserWidth, i = e.sort(
        (s, a) => s[0] > a[0] ? -1 : 1
      ).filter((s) => n >= s[0]);
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
      const e = this.carouselWidth - this.spacePadding * 2, n = this.currentPerPage;
      return e / n;
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
      const e = `${this.speed / 1e3}s`, n = `${e} ${this.easing} transform`;
      return this.adjustableHeight ? `${n}, height ${e} ${this.adjustableHeightEasing || this.easing}` : n;
    },
    padding() {
      const e = this.spacePadding;
      return e > 0 ? e : !1;
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
      this.dragging = !0, setTimeout(() => {
        this.dragging = !1;
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
        let n = {
          attributes: !0,
          data: !0
        };
        if (this.adjustableHeight && (n = {
          ...n,
          childList: !0,
          subtree: !0,
          characterData: !0
        }), this.mutationObserver = new e(() => {
          this.$nextTick(() => {
            this.computeCarouselWidth(), this.computeCarouselHeight();
          });
        }), this.$parent.$el) {
          const t = this.$el.getElementsByClassName(
            "vu-carousel-inner"
          );
          for (let i = 0; i < t.length; i++)
            this.mutationObserver.observe(t[i], n);
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
      for (let n = 0; n < e.length; n++)
        e[n].clientWidth > 0 && (this.carouselWidth = e[n].clientWidth || 0);
      return this.carouselWidth;
    },
    /**
       * Get the maximum height of the carousel active slides
       * @return {String} The carousel height
       */
    getCarouselHeight() {
      if (!this.adjustableHeight)
        return "auto";
      const e = this.currentPerPage * (this.currentPage + 1) - 1, n = [...Array(this.currentPerPage)].map((t, i) => this.getSlide(e + i)).reduce(
        (t, i) => Math.max(t, i && i.$el.clientHeight || 0),
        0
      );
      return this.currentHeight = n === 0 ? "auto" : `${n}px`, this.currentHeight;
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
    goToPage(e, n) {
      e >= 0 && e <= this.pageCount && (this.offset = this.scrollPerPage ? Math.min(this.slideWidth * this.currentPerPage * e, this.maxOffset) : this.slideWidth * e, this.autoplay && !this.autoplayHoverPause && this.restartAutoplay(), this.currentPage = e, n === "pagination" && (this.pauseAutoplay(), this.$emit("pagination-click", e)));
    },
    /**
       * Trigger actions when mouse is pressed
       * @param  {Object} e The event object
       */
    /* istanbul ignore next */
    onStart(e) {
      e.button !== 2 && (document.addEventListener(this.isTouch ? "touchend" : "mouseup", this.onEnd, !0), document.addEventListener(this.isTouch ? "touchmove" : "mousemove", this.onDrag, !0), this.startTime = e.timeStamp, this.dragging = !0, this.dragStartX = this.isTouch ? e.touches[0].clientX : e.clientX, this.dragStartY = this.isTouch ? e.touches[0].clientY : e.clientY);
    },
    /**
       * Trigger actions when mouse is released
       * @param  {Object} e The event object
       */
    onEnd(e) {
      this.autoplay && !this.autoplayHoverPause && this.restartAutoplay(), this.pauseAutoplay();
      const n = this.isTouch ? e.changedTouches[0].clientX : e.clientX, t = this.dragStartX - n;
      if (this.dragMomentum = t / (e.timeStamp - this.startTime), this.minSwipeDistance !== 0 && Math.abs(t) >= this.minSwipeDistance) {
        const i = this.scrollPerPage ? this.slideWidth * this.currentPerPage : this.slideWidth;
        this.dragOffset += Math.sign(t) * (i / 2);
      }
      this.offset += this.dragOffset, this.dragOffset = 0, this.dragging = !1, this.render(), document.removeEventListener(this.isTouch ? "touchend" : "mouseup", this.onEnd, !0), document.removeEventListener(this.isTouch ? "touchmove" : "mousemove", this.onDrag, !0);
    },
    /**
       * Trigger actions when mouse is pressed and then moved (mouse drag)
       * @param  {Object} e The event object
       */
    onDrag(e) {
      const n = this.isTouch ? e.touches[0].clientX : e.clientX, t = this.isTouch ? e.touches[0].clientY : e.clientY, i = this.dragStartX - n, o = this.dragStartY - t;
      if (this.isTouch && Math.abs(i) < Math.abs(o))
        return;
      e.stopImmediatePropagation(), this.dragOffset = i;
      const s = this.offset + this.dragOffset;
      s < 0 ? this.dragOffset = -Math.sqrt(-this.resistanceCoef * this.dragOffset) : s > this.maxOffset && (this.dragOffset = Math.sqrt(this.resistanceCoef * this.dragOffset));
    },
    onResize() {
      this.computeCarouselWidth(), this.computeCarouselHeight(), this.dragging = !0, this.render(), setTimeout(() => {
        this.dragging = !1;
      }, this.refreshRate);
    },
    render() {
      this.offset += Math.max(-this.currentPerPage + 1, Math.min(
        Math.round(this.dragMomentum),
        this.currentPerPage - 1
      )) * this.slideWidth;
      const e = this.scrollPerPage ? this.slideWidth * this.currentPerPage : this.slideWidth, n = e * Math.floor(this.slideCount / (this.currentPerPage - 1)), t = n + this.slideWidth * (this.slideCount % this.currentPerPage);
      this.offset > (n + t) / 2 ? this.offset = t : this.offset = e * Math.round(this.offset / e), this.offset = Math.max(0, Math.min(this.offset, this.maxOffset)), this.currentPage = this.scrollPerPage ? Math.round(this.offset / this.slideWidth / this.currentPerPage) : Math.round(this.offset / this.slideWidth);
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
      Qr(this.onResize, this.refreshRate)
    ), (this.isTouch && this.touchDrag || this.mouseDrag) && this.$refs["vu-carousel-wrapper"].addEventListener(
      this.isTouch ? "touchstart" : "mousedown",
      this.onStart
    ), this.attachMutationObserver(), this.computeCarouselWidth(), this.computeCarouselHeight(), this.transitionstart = Os(), this.$refs["vu-carousel-inner"].addEventListener(this.transitionstart, this.handleTransitionStart), this.transitionend = Os(), this.$refs["vu-carousel-inner"].addEventListener(this.transitionend, this.handleTransitionEnd), this.$emit("mounted"), this.autoplayDirection === "backward" && this.goToLastSlide();
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
}, tu = { class: "vu-carousel" }, nu = {
  class: "vu-carousel-wrapper",
  ref: "vu-carousel-wrapper"
}, su = {
  key: 0,
  class: "carousel-indicators"
}, iu = ["onClick"];
function ou(e, n, t, i, o, s) {
  return l(), u("div", tu, [
    g("div", nu, [
      g("div", {
        ref: "vu-carousel-inner",
        class: k([
          "vu-carousel-inner",
          { "vu-carousel-inner--center": s.isCenterModeEnabled }
        ]),
        style: K({
          transform: `translate(${s.currentOffset}px, 0)`,
          transition: o.dragging ? "none" : s.transitionStyle,
          "ms-flex-preferred-size": `${s.slideWidth}px`,
          "webkit-flex-basis": `${s.slideWidth}px`,
          "flex-basis": `${s.slideWidth}px`,
          visibility: s.slideWidth ? "visible" : "hidden",
          height: `${o.currentHeight}`,
          "padding-left": `${s.padding}px`,
          "padding-right": `${s.padding}px`
        })
      }, [
        C(e.$slots, "default")
      ], 6)
    ], 512),
    t.pagination && s.pageCount > 1 ? (l(), u("ol", su, [
      (l(!0), u(V, null, j(s.pageCount, (a, d) => (l(), u("li", {
        key: `carousel-pagination_${d}`,
        class: k(["indicator", { active: d === o.currentPage }]),
        onClick: (c) => s.goToPage(d, "pagination")
      }, null, 10, iu))), 128))
    ])) : p("", !0)
  ]);
}
const lu = /* @__PURE__ */ A(eu, [["render", ou]]), au = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: lu
}, Symbol.toStringTag, { value: "Module" })), ze = {
  exposes: ["validate"],
  props: {
    rules: {
      type: [Array],
      default: () => [() => !0]
    },
    required: {
      type: Boolean,
      default: () => !1
    },
    success: {
      type: Boolean,
      default: () => !1
    },
    lazyValidation: {
      type: Boolean,
      default: () => !1
    }
  },
  data: () => ({
    errorBucket: [],
    valid: !0,
    localRules: []
  }),
  inject: {
    vuDebug: {
      default: !1
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
        return !0;
      switch (typeof this.value) {
        case "string":
        case "array":
        case "number":
        case "date":
          return this.value.length !== 0;
        default:
          return !0;
      }
    }
  },
  methods: {
    validate(e, n) {
      const t = [];
      let i = 0;
      const o = e || this.value, s = [...this.localRules, ...this.rules];
      for (let a = 0; a < s.length; a++) {
        const d = s[a], c = typeof d == "function" ? d(o) : d;
        typeof c == "string" ? (t.push(c), i += 1) : typeof c == "boolean" && !c ? i += 1 : typeof c != "boolean" && this.vuDebug && console.error(`Rules should return a string or boolean, received '${typeof c}' instead`, this);
      }
      return n || (this.errorBucket = t), this.valid = i === 0 && this.isValid, this.valid;
    }
  }
}, ru = {
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
      return this.inputs.map((n) => n.validate(void 0, e)).reduce((n, t) => n && t, !0);
    }
  }
}, Ee = {
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
}, $s = [...Array(256).keys()].map((e) => e.toString(16).padStart(2, "0")), gt = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128, [...e.entries()].map(([n, t]) => [4, 6, 8, 10].includes(n) ? `-${$s[t]}` : $s[t]).join("");
}, uu = {
  name: "vu-checkbox",
  mixins: [Fe, ze, Ee, Oe],
  emits: ["update:modelValue"],
  inheritAttrs: !1,
  props: {
    dense: {
      type: Boolean,
      default: () => !1
    },
    switch: {
      type: Boolean,
      required: !1
    },
    type: {
      type: String,
      default: () => "checkbox"
    }
  },
  data: () => ({ uid: gt() }),
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
        const n = JSON.parse(JSON.stringify(this.value));
        return n.splice(this.value.indexOf(e.target.value), 1), this.$emit("update:modelValue", n);
      }
      return this.$emit("update:modelValue", e.target.checked ? e.target.value : null);
    },
    isChecked(e) {
      return Array.isArray(this.value) ? this.value.includes(e) : this.type === "radio" ? this.value === e : !!this.value;
    }
  }
}, du = {
  key: 0,
  class: "control-label"
}, cu = {
  key: 0,
  class: "label-field-required"
}, hu = ["type", "id", "value", "disabled", "checked"], fu = ["innerHTML", "for"], pu = {
  key: 1,
  class: "form-control-helper-text"
};
function mu(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k(["form-group", { dense: t.dense }])
  }, [
    e.label.length ? (l(), u("label", du, [
      X(w(e.label), 1),
      e.required ? (l(), u("span", cu, " *")) : p("", !0)
    ])) : p("", !0),
    (l(!0), u(V, null, j(e.options, (a, d) => (l(), u("div", {
      key: `${e.uid}-${a.value}-${d}`,
      class: k(["toggle", s.internalClasses])
    }, [
      (l(), u("input", {
        type: t.type === "radio" ? "radio" : "checkbox",
        id: `${e.uid}-${a.value}-${d}`,
        value: a.value,
        disabled: e.disabled || a.disabled,
        checked: s.isChecked(a.value),
        key: s.isChecked(a.value),
        onClick: n[0] || (n[0] = re((...c) => s.input && s.input(...c), ["prevent"]))
      }, null, 8, hu)),
      g("label", {
        class: "control-label",
        innerHTML: a.label,
        for: `${e.uid}-${a.value}-${d}`
      }, null, 8, fu),
      C(e.$slots, "prepend-icon", { item: a }, void 0, !0)
    ], 2))), 128)),
    (l(!0), u(V, null, j(e.errorBucket, (a, d) => (l(), u("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, w(a), 1))), 128)),
    e.helper.length ? (l(), u("span", pu, w(e.helper), 1)) : p("", !0)
  ], 2);
}
const bi = /* @__PURE__ */ A(uu, [["render", mu], ["__scopeId", "data-v-d2a89048"]]), vu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: bi
}, Symbol.toStringTag, { value: "Module" }));
function gu(e, n = {}) {
  const {
    onVisibleChange: t = Be,
    onShow: i = Be,
    onHide: o = Be,
    attach: s,
    target: a
  } = n, d = Y(() => be(e)), c = Y(() => be(s)), r = Y(() => be(a)), h = T(!0), f = T(!1), y = T({ x: 0, y: 0 }), b = () => setTimeout(() => f.value = !0, 10), _ = () => {
    const W = !f.value;
    f.value = !1, W && o();
  }, z = ti(d, { width: 0, height: 0 }, { box: "border-box" }), B = on(c), G = Y(() => s !== document.body), Q = fl({
    includeScrollbar: !1
  }), de = Y(() => Math.max(B.top.value, 0)), J = Y(() => Math.min(B.right.value, Q.width.value)), L = Y(() => {
    let [W, ee, ce, we] = [
      `${y.value.x}px`,
      `${y.value.y}px`,
      null,
      null
    ];
    const Se = y.value.x + z.width.value > J.value, Me = y.value.y + z.height.value > Q.height.value;
    if (Se && (W = `${B.right.value - (G.value ? 0 : y.value.x) - z.width.value}px`), Me)
      if (B.height.value - y.value.y > 0) {
        const Re = Q.height.value - y.value.y;
        y.value.y - de.value < Re ? [ee, we] = [`${de.value}px`, null] : [ee, we] = [null, `${Q.height.value - Q.height.value}px`];
      } else
        [ee, we] = [null, `${Q.height.value - y.value.y}px`];
    return {
      left: W,
      top: ee,
      right: ce,
      bottom: we
    };
  });
  function P() {
    var ce;
    const W = [];
    let ee = (ce = ie(r)) == null ? void 0 : ce.parentElement;
    for (; ee; ) {
      const { overflow: we } = window.getComputedStyle(ee), Se = we.split(" ");
      ["auto", "scroll"].some((Me) => Se.includes(Me)) && W.push(ee), ee = ee.parentElement;
    }
    return W;
  }
  le(h, _), le(f, t);
  const F = [jt(
    () => {
      const W = d.value;
      if (W) {
        W.style.position = "fixed", W.style.visibility = f.value ? "visible" : "hidden";
        for (const [ee, ce] of Object.entries(L.value))
          W.style.setProperty(ee, ce);
      }
    },
    { flush: "post" }
  )], se = [], R = [], oe = () => {
    h.value = !1, Gt(() => {
      F.concat(se, R).forEach((W) => W());
    });
  }, he = (W) => {
    i(), !(!h.value || W != null && W._prevent) && (W.preventDefault(), y.value = {
      x: W.clientX,
      y: W.clientY
    }, b(), W._prevent = !0);
  }, Ie = jt(() => {
    if (se.forEach((W) => W()), se.splice(0, se.length), f.value && (se.push(
      fe("scroll", _),
      fe("click", _),
      fe("contextmenu", _, { capture: !0 })
    ), ie(c) && se.push(fe(ie(c), "scroll", _)), ie(r))) {
      const W = P();
      se.push(...W.map((ee) => fe(ee, "scroll", _)));
    }
  }), E = jt(() => {
    R.forEach((W) => W()), R.splice(0, R.length), r ? R.push(fe(ie(r) || document.body, "contextmenu", he)) : R.push(fe("contextmenu", he));
  });
  return F.push(Ie, E), {
    visible: f,
    position: y,
    enabled: h,
    hide: _,
    show: b,
    stop: oe
  };
}
const yu = {
  name: "vu-contextual-dropdown"
}, bu = /* @__PURE__ */ Ae({
  ...yu,
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
      required: !0
    },
    /**
     * In responsive-mode, separates sub-menu open icon with item text.
     * Useful when an item with a sub-menu is selectable.
     */
    dividedResponsiveItems: {
      type: Boolean,
      default: !1
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
      default: !0
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
  setup(e, { expose: n, emit: t }) {
    const i = e, o = t, s = T(!1), a = T(), d = Y(() => be(i.target)), c = Y(() => be(i.attach)), r = Y(() => (c == null ? void 0 : c.value) || document.body);
    function h() {
      s.value = !1;
    }
    function f() {
      o("close", void 0);
    }
    const { position: y, visible: b, show: _, hide: z, stop: B } = gu(a, {
      attach: r,
      target: d,
      onShow: h,
      onHide: f
    });
    function G(Q) {
      Q.handler && Q.handler(Q), o("click-item", Q), i.closeOnClick && (z(), s.value = !1);
    }
    return n({
      show: _,
      hide: z,
      stop: B
    }), (Q, de) => (l(), S(En, {
      to: r.value,
      disabled: !r.value
    }, [
      q(b) ? (l(), S(dn, te({
        key: 0,
        ref_key: "menu",
        ref: a,
        responsive: s.value,
        "onUpdate:responsive": de[0] || (de[0] = (J) => s.value = J),
        position: q(y),
        "onUpdate:position": de[1] || (de[1] = (J) => yo(y) ? y.value = J : null),
        "divided-responsive-items": e.dividedResponsiveItems
      }, {
        items: e.items,
        zIndex: e.zIndex
      }, {
        target: r.value,
        selected: e.value,
        onClickItem: G
      }), null, 16, ["responsive", "position", "divided-responsive-items", "target", "selected"])) : p("", !0)
    ], 8, ["to", "disabled"]));
  }
}), _u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: bu
}, Symbol.toStringTag, { value: "Module" })), as = (e) => e instanceof Date && !Number.isNaN(e.getTime()), wu = (e) => e % 4 === 0 && e % 100 !== 0 || e % 400 === 0, ku = (e, n) => [31, wu(e) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][n], xs = (e, n) => e.getTime() === n.getTime(), Su = (e) => {
  let n;
  if (as(e))
    n = e;
  else if (e && typeof e == "string")
    try {
      n = new Date(Date.parse(e));
    } catch {
    }
  return n;
}, cn = {
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
    getListenersFromAttrs: Ze
  }),
  watch: {
    min: {
      handler(e) {
        this.checkBoundary(e, "min");
      },
      immediate: !0
    },
    max: {
      handler(e) {
        this.checkBoundary(e, "max");
      },
      immediate: !0
    }
  },
  methods: {
    setBoundary(e, n) {
      return [
        n === "min" ? this.value[0] < e : this.value[0] > e,
        n === "min" ? this.value[1] < e : this.value[1] > e
      ].map((i, o) => i ? e : this.value[o]);
    },
    anyOutOfRange(e, n) {
      return this.value.some((t) => n === "min" ? t < e : t > e);
    },
    checkBoundary(e, n) {
      if (!this.value)
        return;
      const t = this.getListenersFromAttrs(this.$attrs)["boundary-change"] ? "boundary-change" : "update:modelValue";
      (Array.isArray(this.value) && this.anyOutOfRange(e, n) || ["min"].includes(n) && this.value < e || ["max"].includes(n) && this.value > e) && (as(e) ? this.$emit(t, t === "update:modelValue" ? new Date(e) : { boundary: n, value: new Date(e) }) : this.$emit(t, t === "update:modelValue" ? this.setBoundary(e, n) : { boundary: n, value: e }));
    }
  }
}, Iu = {
  name: "vu-datepicker-table-date",
  mixins: [cn],
  emits: ["select"],
  props: {
    date: {
      type: Date
    },
    year: {
      type: Number,
      required: !0
    },
    month: {
      type: Number,
      required: !0
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
      required: !1
    },
    isRTL: {
      type: Boolean,
      required: !1
    },
    // i18n
    weekdaysLabels: {
      type: Array,
      required: !0
    },
    weekdaysShortLabels: {
      type: Array,
      required: !0
    }
  },
  methods: {
    renderTable(e) {
      return je("table", {
        class: "datepicker-table",
        attrs: { cellspacing: "0", cellpadding: "0" }
      }, [
        this.renderHead(),
        this.renderBody(e)
      ]);
    },
    renderHead() {
      const e = [];
      for (let n = 0; n < 7; n++) {
        const t = je("th", {
          attrs: { scope: "col", cellspacing: "0", cellpadding: "0" }
        }, [
          je("abbr", {
            attrs: {
              title: this.renderDayName(n)
            }
          }, this.renderDayName(n, !0))
        ]);
        e.push(t);
      }
      return je("thead", {}, e);
    },
    renderBody(e) {
      return je("tbody", {}, e);
    },
    renderWeek(e, n, t) {
      const i = new Date(t, 0, 1), o = Math.ceil(((new Date(t, n, e) - i) / 864e5 + i.getDay() + 1) / 7), s = `datepicker${this.week}`;
      return je("td", { class: s }, o);
    },
    renderDayName(e, n) {
      let t = e + this.firstDay;
      for (; t >= 7; )
        t -= 7;
      return n ? this.weekdaysShortLabels[t] : this.weekdaysLabels[t];
    },
    renderDay(e, n, t, i, o, s, a) {
      const d = [];
      return a ? je("td", { class: "is-empty" }) : (s && d.push("is-disabled"), o && d.push("is-today"), i && d.push("is-selected"), je("td", {
        class: d.join(" "),
        attrs: {
          "data-day": e
        }
      }, [
        je("button", {
          class: "datepicker-button datepicker-name",
          type: "button",
          "data-year": t,
          "data-month": n,
          "data-day": e,
          onClick: this.onSelect
        }, e)
      ]));
    },
    renderRow(e) {
      return je("tr", {}, e);
    },
    onSelect(e) {
      const n = e.target.getAttribute("data-year"), t = e.target.getAttribute("data-month"), i = e.target.getAttribute("data-day");
      this.$emit("select", new Date(n, t, i));
    }
  },
  render() {
    const e = /* @__PURE__ */ new Date();
    e.setHours(0, 0, 0, 0);
    const n = ku(this.year, this.month);
    let t = new Date(this.year, this.month, 1).getDay();
    const i = [];
    let o = [], s, a;
    for (this.firstDay > 0 && (t -= this.firstDay, t < 0 && (t += 7)), s = n + t, a = s; a > 7; )
      a -= 7;
    s += 7 - a;
    for (let d = 0, c = 0; d < s; d++) {
      const r = new Date(this.year, this.month, 1 + (d - t)), h = Date.parse(this.min), f = Date.parse(this.max), y = h && r < h || f && r > f || this.unselectableDaysOfWeek && this.unselectableDaysOfWeek.indexOf(r.getDay()) > -1, b = as(this.date) ? xs(r, this.date) : !1, _ = xs(r, e), z = d < t || d >= n + t;
      o.push(this.renderDay(1 + (d - t), this.month, this.year, b, _, y, z)), ++c === 7 && (this.showWeekNumber && o.unshift(this.renderWeek(d - t, this.month, this.year)), i.push(this.renderRow(o, this.isRTL)), o = [], c = 0);
    }
    return this.renderTable(i);
  }
}, Cu = {
  name: "vu-datepicker",
  mixins: [Tt, cn],
  components: {
    "vu-datepicker-table-date": Iu
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
      required: !1
    },
    isRTL: {
      type: Boolean,
      required: !1
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
      return this.monthsLabels.map((e, n) => {
        const t = this.year === this.minYear && n < this.minMonth || this.year === this.maxYear && n > this.maxMonth;
        return {
          value: n,
          label: e,
          disabled: t
        };
      });
    },
    selectableYears() {
      const e = Math.max(this.year - this.yearRange, this.minYear), n = Math.min(this.year + 1 + this.yearRange, this.maxYear + 1);
      return Array(n - e).fill({}).map((i, o) => ({ value: e + o }));
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
      const e = Su(this.date) || /* @__PURE__ */ new Date();
      this.month = e.getMonth(), this.year = e.getFullYear();
    },
    onSelect(e) {
      this.month = e.getMonth(), this.year = e.getFullYear(), this.date = e;
    }
  }
}, Bu = { class: "datepicker-calendar" }, Ou = { class: "datepicker-title" }, $u = { class: "datepicker-label" }, xu = ["disabled", "value"], Tu = { class: "datepicker-label" }, Vu = ["disabled", "value"];
function Mu(e, n, t, i, o, s) {
  const a = O("vu-datepicker-table-date");
  return e.innerShow ? (l(), u("div", {
    key: 0,
    class: k(["datepicker datepicker-root", t.className])
  }, [
    g("div", Bu, [
      g("div", Ou, [
        g("div", $u, [
          X(w(s.currentMonth) + " ", 1),
          H(g("select", {
            class: "datepicker-select datepicker-select-month",
            "onUpdate:modelValue": n[0] || (n[0] = (d) => e.month = d)
          }, [
            (l(!0), u(V, null, j(s.selectableMonths, (d) => (l(), u("option", {
              key: d.value,
              disabled: d.disabled,
              value: d.value
            }, w(d.label), 9, xu))), 128))
          ], 512), [
            [ks, e.month]
          ])
        ]),
        g("div", Tu, [
          X(w(e.year) + " ", 1),
          H(g("select", {
            class: "datepicker-select datepicker-select-year",
            "onUpdate:modelValue": n[1] || (n[1] = (d) => e.year = d)
          }, [
            (l(!0), u(V, null, j(s.selectableYears, (d) => (l(), u("option", {
              key: d.value,
              disabled: d.disabled,
              value: d.value
            }, w(d.value), 9, Vu))), 128))
          ], 512), [
            [ks, e.year]
          ])
        ]),
        g("button", {
          class: k(["datepicker-prev", { "is-disabled": !s.hasPrevMonth }]),
          type: "button",
          onClick: n[2] || (n[2] = (d) => s.hasPrevMonth && e.month--)
        }, w(t.previousMonthLabel), 3),
        g("button", {
          class: k(["datepicker-next", { "is-disabled": !s.hasNextMonth }]),
          type: "button",
          onClick: n[3] || (n[3] = (d) => s.hasNextMonth && e.month++)
        }, w(t.nextMonthLabel), 3)
      ]),
      x(a, {
        date: s.date,
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
        onSelect: n[4] || (n[4] = (d) => s.onSelect(d))
      }, null, 8, ["date", "year", "month", "min", "max", "first-day", "unselectable-days-of-week", "months-labels", "show-week-number", "is-r-t-l", "weekdays-labels", "weekdays-short-labels"])
    ])
  ], 2)) : p("", !0);
}
const _i = /* @__PURE__ */ A(Cu, [["render", Mu]]), Pu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _i
}, Symbol.toStringTag, { value: "Module" })), Lu = { class: "text-[0.92857em] line-height-[1.15385]" }, Du = {
  name: "vu-dropzone"
}, Au = /* @__PURE__ */ Ae({
  ...Du,
  props: {
    icon: { default: "drag-drop" },
    color: { default: "grey-light" },
    label: {},
    noHover: { type: Boolean },
    dashed: { type: Boolean, default: !1 },
    centered: { type: Boolean, default: !1 },
    addHoverClass: { type: Boolean, default: !0 },
    hoverClassName: {}
  },
  emits: ["drop", "dragover", "dragleave"],
  setup(e, { emit: n }) {
    const t = e, i = n, o = T(!1), s = T(), a = Y(() => {
      var c;
      return (c = s.value) != null && c.clientHeight ? s.value.clientHeight % 4 : 0;
    }), d = Y(() => Number(a == null ? void 0 : a.value) !== Number.NaN && a.value / 2 || 0);
    return le(() => t.noHover, (c) => {
      c && (o.value = !1);
    }), (c, r) => (l(), u("div", {
      ref_key: "container",
      ref: s,
      class: k(["vu-dropzone animated fade-in", [
        c.color && `vu-dropzone--${c.color}`,
        c.addHoverClass && o.value && c.hoverClassName,
        { "vu-dropzone--centered": c.centered },
        { "vu-dropzone--hover": o.value && !c.noHover },
        { "no-hover": c.noHover },
        "relative"
      ]]),
      onDragover: r[0] || (r[0] = (h) => {
        (c.addHoverClass || !c.noHover) && (o.value = !0), i("dragover", h);
      }),
      onDragleave: r[1] || (r[1] = (h) => {
        const f = h == null ? void 0 : h.relatedTarget;
        s.value !== f && !s.value.contains(f) && ((c.addHoverClass || !c.noHover) && (o.value = !1), i("dragleave", h));
      }),
      onDrop: r[2] || (r[2] = (h) => {
        i("drop", h), o.value = !1;
      })
    }, [
      C(c.$slots, "default", {}, () => [
        x(pe, {
          class: k(["flex-grow-0 flex-basis-[38px]", {
            "font-size-[1.28571em]": c.centered,
            "font-size-[2em]": !c.centered
          }]),
          icon: c.icon,
          withinText: !1
        }, null, 8, ["class", "icon"]),
        g("span", Lu, w(c.label), 1)
      ], !0),
      g("div", {
        class: k([
          {
            "vu-dropzone--dashed": c.dashed
          },
          "absolute top-0 bottom-0 left-0 right-0"
        ]),
        style: K(d.value && `margin-top:${d.value}px;margin-bottom:${d.value}px` || "")
      }, null, 6)
    ], 34));
  }
}), kt = /* @__PURE__ */ A(Au, [["__scopeId", "data-v-848ee1db"]]), Fu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: kt
}, Symbol.toStringTag, { value: "Module" })), zu = {
  name: "vu-facets-bar",
  emits: ["update:modelValue"],
  components: { VuDropdownMenu: rt, VuIconBtn: ue, VuPopover: Ke, VuBtn: Ye, VuIcon: pe },
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
    uuidv4: gt,
    throttle: Mn,
    hideLabels: !1,
    forceOverflow: !1,
    showFromIndex: 0,
    hiddenFacets: 0,
    intersectionObserver: void 0,
    iconsIntersectionObserver: void 0,
    resizeObserver: void 0,
    onResizeThrottled: null,
    paddingForLongestFacet: 0
  }),
  mounted() {
    this.intersectionObserver = new IntersectionObserver(this.onLabelIntersects, {
      root: this.$refs.container,
      threshold: 1
    }), this.labelIntersectionObserver = new IntersectionObserver(this.onPaddingIntersects, {
      root: this.$refs.container
    }), this.iconsIntersectionObserver = new IntersectionObserver(this.onIconIntersects, {
      root: this.$refs.container,
      threshold: [0, 1],
      rootMargin: "0px -32px 0px 0px"
    }), this.onResizeThrottled = Mn(this.onResize.bind(this), 200), this.resizeObserver = new ResizeObserver(this.onResizeThrottled), this.intersectionObserver.observe(this.$refs.inner), this.resizeObserver.observe(this.$refs.container);
  },
  beforeUnmount() {
    this.intersectionObserver && this.intersectionObserver.disconnect(), this.labelIntersectionObserver && this.iconsIntersectionObserver.disconnect(), this.iconsIntersectionObserver && this.iconsIntersectionObserver.disconnect(), this.resizeObserver && this.resizeObserver.disconnect(), delete this.intersectionObserver, delete this.iconsIntersectionObserver;
  },
  computed: {
    visibleItems() {
      return this.hiddenFacets ? this.items.slice(this.showFromIndex, this.showFromIndex + this.visibleFacets) : this.items;
    },
    overflowMenuItems() {
      return this.items.map((e) => ({ ...e, fonticon: e.icon, item: e, selected: this.modelValue === e }));
    },
    visibleFacets() {
      return this.items.length - this.hiddenFacets;
    }
  },
  watch: {
    modelValue(e) {
      (this.hiddenFacets || this.forceOverflow) && this.showActiveFacet(e);
    },
    items(e, n) {
      ((e == null ? void 0 : e.length) !== (n == null ? void 0 : n.length) || e.some((t, i) => t.text !== n[i].text)) && this.onResize();
    }
  },
  methods: {
    // First check if all label display is possible
    async onLabelIntersects(e) {
      var n, t;
      this.intersectionObserver.unobserve(this.$refs.inner), ((n = e == null ? void 0 : e[0]) == null ? void 0 : n.intersectionRatio) < 1 && !this.hideLabels && (this.calcPaddingForLongestFacet(), this.hideLabels = !0, await this.$nextTick(), (t = this.$refs) != null && t.labelPadding && this.labelIntersectionObserver.observe(this.$refs.labelPadding));
    },
    // Then check if the longest label will not lead to overflow
    async onPaddingIntersects(e) {
      const n = this.$refs.labelPadding;
      e != null && e[0] && !this.forceOverflow && e[0] && (this.labelIntersectionObserver.unobserve(n), e[0].intersectionRatio < 1 && (this.forceOverflow = !0, this.paddingForLongestFacet = 0, await this.$nextTick(), this.$refs.facets.map(({ $el: i }) => i).forEach((i) => this.iconsIntersectionObserver.observe(i))));
    },
    // Finally check if all icons fit
    async onIconIntersects(e) {
      if (e != null && e.length) {
        const n = this.$refs.facets.map(({ $el: i }) => i), t = e.filter(({ target: i }) => i.parentNode).filter((i) => i.intersectionRatio < 1);
        this.hiddenFacets += t.length, n.forEach((i) => {
          try {
            this.iconsIntersectionObserver.unobserve(i);
          } catch {
          }
        });
      }
    },
    onResize() {
      this.showFromIndex = 0, this.hiddenFacets = 0, this.hideLabels = !1, this.forceOverflow = !1, this.paddingForLongestFacet = 0, this.intersectionObserver.observe(this.$refs.inner);
    },
    calcPaddingForLongestFacet() {
      const e = this.$refs.facets.map(({ $el: i }) => i), n = e.reduce((i, o) => Math.max(o.clientWidth, i), 0), t = e.find((i) => i.classList.contains("facet--selected"));
      this.paddingForLongestFacet = n - t.clientWidth + 38;
    },
    showActiveFacet(e) {
      const n = this.items.indexOf(e);
      let t = n;
      n > this.visibleFacets - 1 && (t = n - this.visibleFacets + 2), this.showFromIndex = Math.min(t, this.items.length - this.visibleFacets);
    }
  }
}, Eu = {
  class: "vu-facets-bar",
  ref: "container"
}, Nu = {
  class: "facets-bar__inner",
  ref: "inner"
};
function Ru(e, n, t, i, o, s) {
  const a = O("VuIcon"), d = O("VuPopover"), c = O("VuBtn"), r = O("VuIconBtn"), h = O("VuDropdownMenu");
  return l(), u("div", Eu, [
    g("div", Nu, [
      (l(!0), u(V, null, j(s.visibleItems, (f) => (l(), S(c, {
        key: `${e.uuidv4()}`,
        ref_for: !0,
        ref: "facets",
        class: k([
          "facet",
          {
            default: f !== t.modelValue,
            "facet--selected": f === t.modelValue,
            "facet--unselected": f !== t.modelValue
          }
        ]),
        style: K(e.hiddenFacets ? "max-width: calc(100% - 38px)" : ""),
        onClick: (y) => e.$emit("update:modelValue", f)
      }, {
        default: M(() => [
          (!e.hideLabels || f === t.modelValue) && !e.forceOverflow ? (l(), u(V, { key: 0 }, [
            f.icon ? (l(), S(a, {
              key: 0,
              icon: f.icon,
              active: f === t.modelValue
            }, null, 8, ["icon", "active"])) : p("", !0),
            g("span", null, w(f.text), 1)
          ], 64)) : (l(), S(d, {
            key: 1,
            type: "tooltip",
            hover: "",
            arrow: ""
          }, {
            default: M(() => [
              f.icon ? (l(), S(a, {
                key: 0,
                icon: f.icon
              }, null, 8, ["icon"])) : p("", !0)
            ]),
            body: M(() => [
              X(w(f.text), 1)
            ]),
            _: 2
          }, 1024))
        ]),
        _: 2
      }, 1032, ["class", "style", "onClick"]))), 128)),
      e.hiddenFacets || e.forceOverflow ? (l(), S(h, {
        key: 0,
        shift: !0,
        class: "vu-facets-bar__dropdownmenu",
        items: s.overflowMenuItems,
        model: t.modelValue,
        "onUpdate:modelValue": n[0] || (n[0] = (f) => e.$emit("update:modelValue", f.item)),
        onClickItem: n[1] || (n[1] = (f) => e.$emit("update:modelValue", f.item))
      }, {
        default: M(() => [
          x(r, { icon: "menu-dot" })
        ]),
        _: 1
      }, 8, ["items", "model"])) : p("", !0),
      !e.hiddenFacets && e.hideLabels && !e.forceOverflow ? (l(), u("span", {
        key: 1,
        style: K([[{ width: `${e.paddingForLongestFacet}px` }], { display: "inline-block", height: "10px" }]),
        ref: "labelPadding"
      }, null, 4)) : p("", !0)
    ], 512)
  ], 512);
}
const Hu = /* @__PURE__ */ A(zu, [["render", Ru], ["__scopeId", "data-v-53e487be"]]), ju = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Hu
}, Symbol.toStringTag, { value: "Module" })), Uu = {
  name: "vu-form",
  mixins: [ru]
};
function Wu(e, n, t, i, o, s) {
  return l(), u("form", {
    novalidate: "novalidate",
    class: "form form-root",
    onSubmit: re(() => {
    }, ["prevent"])
  }, [
    C(e.$slots, "default")
  ], 32);
}
const wi = /* @__PURE__ */ A(Uu, [["render", Wu]]), qu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: wi
}, Symbol.toStringTag, { value: "Module" })), Ku = {
  props: {
    elevated: {
      type: Boolean,
      default: !1
    }
  }
}, ki = {
  props: {
    clearable: {
      type: Boolean,
      default: () => !1
    }
  }
}, Sn = {
  offline: "status-empty",
  online: "status-ok",
  busy: "status-noway",
  away: "status-clock"
}, Gu = {
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
      default: !0
    },
    clickable: {
      type: Boolean,
      default: !1
    },
    gutter: {
      type: Boolean,
      default: !1
    },
    hoverable: {
      type: Boolean,
      default: !1
    },
    inheritBackground: {
      type: Boolean,
      default: !0
    },
    // eslint-disable-next-line vue/require-default-prop
    presence: {
      type: String,
      required: !1,
      validator: (e) => e ? Sn[e] !== void 0 : !0
    },
    src: {
      type: String,
      required: !1,
      default: void 0
    },
    id: {
      type: String,
      required: !1,
      default: void 0
    }
  },
  data: () => ({
    presenceStates: Sn,
    hovered: !1
  }),
  watch: {
    hoverable: {
      // eslint-disable-next-line object-shorthand, func-names
      handler: function(e) {
        !e && this.hovered && (this.hovered = !1);
      }
    }
  },
  computed: {
    fonticon() {
      return this.presence && Sn[this.presence];
    },
    _src() {
      return this.vuUserPictureSrcUrl && this.id && !this.src ? `${this.vuUserPictureSrcUrl}/${this.id}` : this.src;
    }
  }
}, Yu = {
  key: 0,
  class: "vu-user-picture__hover-mask"
}, Xu = {
  key: 1,
  class: "vu-presence"
};
function Ju(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k(["vu-user-picture", [t.size ? `vu-user-picture--${t.size}` : "", {
      "vu-user-picture--gutter": t.gutter,
      "vu-user-picture--circle": t.circle,
      "vu-user-picture--clickable": t.clickable,
      "vu-user-picture--bg-inherit": t.inheritBackground
    }]]),
    onMouseover: n[0] || (n[0] = () => {
      t.hoverable && (e.hovered = !0);
    }),
    onMouseleave: n[1] || (n[1] = () => {
      t.hoverable && (e.hovered = !1);
    })
  }, [
    g("div", {
      class: "vu-user-picture-wrap",
      style: K([t.presence ? { background: "inherit" } : ""])
    }, [
      g("div", {
        class: "vu-user-picture__image",
        style: K({ "background-image": `url(${s._src})` })
      }, null, 4),
      e.hovered ? (l(), u("div", Yu)) : p("", !0),
      t.size !== "tiny" ? (l(), u("div", Xu, [
        g("div", {
          class: k(`vu-presence__indicator vu-presence__indicator--${t.presence}`)
        }, null, 2)
      ])) : p("", !0)
    ], 4)
  ], 34);
}
const Ot = /* @__PURE__ */ A(Gu, [["render", Ju], ["__scopeId", "data-v-24c158c9"]]), Zu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ot
}, Symbol.toStringTag, { value: "Module" })), Qu = {
  name: "vu-select-options",
  props: {
    options: {
      type: Array,
      required: !0
    },
    multiple: {
      type: Boolean,
      required: !1
    },
    user: {
      type: Boolean,
      required: !1
    },
    selected: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    keyIndex: {
      type: Number,
      default: () => -1
    },
    forceHasIcon: {
      type: Boolean
    },
    searchField: {
      type: Boolean
    }
  },
  expose: ["focus", "liRefs"],
  emits: ["click-item", "select-keydown", "change"],
  data: () => ({
    uid: gt,
    liRefs: {}
  }),
  computed: {
    anyHasIcon() {
      return this.forceHasIcon || this.options.some((e) => e.icon || e.fonticon);
    }
  },
  methods: {
    focus() {
      var e;
      (e = this.$refs.nativeSelect) == null || e.focus();
    }
  },
  components: { VuIcon: pe, VuIconBtn: ue, VuUserPicture: Ot }
}, ed = ["label", "selected"], td = ["value", "selected", "disabled"], nd = { class: "option__text" }, sd = ["disabled", "onMouseenter", "onMouseleave", "onClick"], id = {
  key: 0,
  class: "flex"
}, od = { class: "option__text" }, ld = { class: "option__text" };
function ad(e, n, t, i, o, s) {
  const a = O("VuUserPicture"), d = O("VuIcon"), c = O("VuIconBtn"), r = _e("tooltip");
  return l(), u("ul", {
    class: k(["vu-select-options", { "select-options--multiple": t.multiple, "select-options--single": !t.multiple, "select-options--user": t.user, "options--has-icon": s.anyHasIcon }])
  }, [
    g("select", {
      ref: "nativeSelect",
      class: "select-hidden",
      onKeydown: n[0] || (n[0] = (h) => e.$emit("select-keydown", h)),
      onChange: n[1] || (n[1] = () => {
        const h = e.$refs.nativeSelect.value;
        h === "__placeholder__" ? e.$emit("change", void 0) : e.$emit("change", h);
      })
    }, [
      g("option", {
        value: "__placeholder__",
        label: t.placeholder,
        selected: t.selected[0] === void 0 || t.selected === ""
      }, null, 8, ed),
      (l(!0), u(V, null, j(t.options, (h) => (l(), u("option", {
        key: `${e.uid}-${h.value || h.label}`,
        value: h.value || h.label,
        selected: h.selected || t.selected.includes(h),
        disabled: h.disabled
      }, w(h.label), 9, td))), 128))
    ], 544),
    !t.multiple && t.placeholder ? (l(), u("li", {
      key: 0,
      class: k([{ "option--selected": t.selected[0].value === void 0 }, "option__placeholder"]),
      onClick: n[2] || (n[2] = (h) => e.$emit("click-item", { value: "" }))
    }, [
      g("span", nd, w(t.placeholder), 1)
    ], 2)) : p("", !0),
    (l(!0), u(V, null, j(t.options, (h, f, y) => (l(), u("li", {
      key: `${h.id || e.uid()}`,
      ref_for: !0,
      ref: (b) => {
        e.liRefs[h.value] = b;
      },
      class: k({
        "option--selected": h.selected || t.selected.includes(h),
        "option--keyboard": f === t.keyIndex,
        "option--hovered": y,
        "option--no-icon": s.anyHasIcon && !(h.icon || h.fonticon)
      }),
      disabled: h.disabled,
      onMouseenter: (b) => y = !0,
      onMouseleave: (b) => y = !1,
      onClick: (b) => !h.disabled && e.$emit("click-item", h)
    }, [
      t.user ? (l(), u("div", id, [
        x(a, {
          id: h.value,
          class: "pt-6px",
          size: "small",
          src: h.src
        }, null, 8, ["id", "src"]),
        g("span", od, w(h.text || h.label), 1)
      ])) : C(e.$slots, "default", {
        key: 1,
        item: h
      }, () => [
        h.fonticon || h.icon ? (l(), S(d, {
          key: 0,
          icon: h.fonticon || h.icon,
          color: y && "secondary" || "",
          size: "button"
        }, null, 8, ["icon", "color"])) : p("", !0),
        g("span", ld, w(h.text || h.label), 1),
        h.action ? H((l(), S(c, {
          key: 1,
          icon: h.action,
          color: y && "secondary"
        }, null, 8, ["icon", "color"])), [
          [r, h.actionTooltip]
        ]) : p("", !0)
      ], !0)
    ], 42, sd))), 128))
  ], 2);
}
const rs = /* @__PURE__ */ A(Qu, [["render", ad], ["__scopeId", "data-v-fdedf0d1"]]), rd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: rs
}, Symbol.toStringTag, { value: "Module" })), ud = {
  name: "vu-select",
  inheritAttrs: !1,
  mixins: [Fe, ki, Oe, ze, Ee],
  props: {
    autocomplete: {
      type: Boolean,
      default: () => !1
    },
    hidePlaceholderOption: {
      type: Boolean,
      default: () => !1
    },
    grouped: {
      type: Boolean,
      default: () => !1
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
      default: () => !0,
      validator: Kn
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
      from: Yt
    }
  },
  data: () => ({
    open: !1,
    focused: !1,
    search: "",
    uid: gt()
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
      return (this.autocomplete && this.search ? this.options : this.innerOptions).filter((n) => !n.disabled);
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
      return this.attach === !1 || this.attach !== "" && typeof this.attach == "string";
    },
    groupedOptions() {
      return this.grouped ? this.options.reduce((e, n) => (e[n.group] || (e[n.group] = []), e[n.group].push(n), e), {}) : null;
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
          this.open = !1, this.stop(e);
          break;
        case "ArrowUp":
          this.browse(void 0, e);
          break;
        case "ArrowDown":
          this.open ? this.browse(!0, e) : (this.open = !0, this.stop(e));
          break;
      }
    },
    focus() {
      var e, n;
      this.focused = !0, !(this.autocomplete || this.isIos) && (this.willDetach ? setTimeout(() => {
        var t, i;
        (i = (t = this.$refs) == null ? void 0 : t.selectOptions) == null || i.focus();
      }, 50) : (n = (e = this.$refs) == null ? void 0 : e.nativeSelect) == null || n.focus());
    },
    blur() {
      this.focused = !1;
    },
    async browse(e, n) {
      this.grouped || (!e && this.selected === this.firstEnabledOption ? (this.value = this.hidePlaceholderOption ? this.lastEnabledOption.value : void 0, this.stop(n), this.scrollIntoView()) : e && this.selected === this.lastEnabledOption ? (this.value = this.hidePlaceholderOption ? this.firstEnabledOption.value : void 0, this.stop(n), this.scrollIntoView()) : this.modelValue || (this.value = e ? this.firstEnabledOption.value : this.lastEnabledOption.value, this.stop(n), this.scrollIntoView()));
    },
    scrollIntoView() {
      this.$nextTick(() => {
        var t;
        const e = this.$refs && this.$refs.dropdown;
        let n;
        if (e && (n = (t = this.$refs) == null ? void 0 : t.dropdown.querySelector("ul li.result-option-selected")), n) {
          const i = n.offsetTop + n.clientHeight;
          (i > e.scrollTop + e.clientHeight || i < e.scrollTop) && this.$refs.dropdown.scrollTo({ top: n.offsetTop });
        }
      });
    }
  },
  components: { VuIconBtn: ue, VuPopover: Ke, VuSelectOptions: rs, VuScroller: Qe }
}, dd = {
  key: 0,
  class: "control-label"
}, cd = {
  key: 0,
  class: "label-field-required"
}, hd = ["disabled", "placeholder"], fd = {
  key: 2,
  class: "select-handle"
}, pd = ["disabled"], md = ["label"], vd = ["value", "selected", "disabled"], gd = {
  key: 4,
  class: "select-handle"
}, yd = {
  key: 5,
  class: "select-choices form-control"
}, bd = { class: "select-choice" }, _d = { class: "select-results" }, wd = ["onClick"], kd = { class: "result-group-label" }, Sd = { class: "result-group-sub" }, Id = ["onClick"], Cd = {
  key: 1,
  class: "form-control-helper-text"
};
function Bd(e, n, t, i, o, s) {
  const a = O("VuIconBtn"), d = O("VuSelectOptions"), c = O("VuScroller"), r = O("VuPopover"), h = _e("click-outside");
  return l(), u("div", {
    class: k(["form-group", e.classes])
  }, [
    e.label.length ? (l(), u("label", dd, [
      X(w(e.label), 1),
      e.required ? (l(), u("span", cd, " *")) : p("", !0)
    ])) : p("", !0),
    H((l(), u("div", {
      onClick: n[10] || (n[10] = (f) => {
        e.open = !e.open && !e.disabled, e.search = e.value && s.selected.label || e.value;
      }),
      class: k([
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
      t.autocomplete ? H((l(), u("input", {
        key: 0,
        ref: "innerInput",
        disabled: e.disabled,
        placeholder: s.selected.label,
        class: "form-control",
        "onUpdate:modelValue": n[0] || (n[0] = (f) => e.search = f)
      }, null, 8, hd)), [
        [bo, e.search]
      ]) : p("", !0),
      e.value && (t.autocomplete || e.clearable) ? (l(), S(a, {
        key: 1,
        icon: "clear",
        class: k(["select__clear-icon", { "select--has-handle": t.autocomplete }]),
        onClick: n[1] || (n[1] = (f) => {
          var y, b;
          e.$emit("update:modelValue", ""), (b = (y = e.$refs) == null ? void 0 : y.innerInput) == null || b.focus(), e.search = "";
        })
      }, null, 8, ["class"])) : p("", !0),
      t.autocomplete ? p("", !0) : (l(), u("div", fd)),
      !t.autocomplete && !s.willDetach ? (l(), u("select", {
        key: 3,
        class: "form-control select-hidden",
        disabled: e.disabled,
        ref: "nativeSelect",
        onFocus: n[2] || (n[2] = (f) => e.focused = !0),
        onBlur: n[3] || (n[3] = (f) => s.blur()),
        onChange: n[4] || (n[4] = () => {
          const f = e.$refs.nativeSelect.value;
          f === "__placeholder__" ? e.value = void 0 : e.value = f, s.scrollIntoView();
        }),
        onKeydown: n[5] || (n[5] = (f) => s.innerSelectKeydown(f))
      }, [
        g("option", {
          value: "__placeholder__",
          label: e.placeholder
        }, null, 8, md),
        (l(!0), u(V, null, j(s.innerOptions, (f) => (l(), u("option", {
          key: `${e.uid}-${f.value || f.label}`,
          value: f.value || f.label,
          selected: f.value === e.value,
          disabled: f.disabled
        }, w(f.label), 9, vd))), 128))
      ], 40, pd)) : p("", !0),
      t.autocomplete ? p("", !0) : (l(), u("div", gd)),
      t.autocomplete ? p("", !0) : (l(), u("ul", yd, [
        g("li", bd, w(s.selected.label), 1)
      ])),
      t.attach && e.open ? (l(), u("div", {
        key: 6,
        class: "select-dropdown",
        ref: "dropdown",
        style: K(`height: ${38 * (s.innerOptions.length + (!t.autocomplete && !t.hidePlaceholderOption ? 1 : 0))}px; max-height: ${38 * (s.internMaxVisible + 1)}px;`)
      }, [
        g("ul", _d, [
          !t.autocomplete && !t.hidePlaceholderOption ? (l(), u("li", {
            key: 0,
            class: k(["result-option result-option-placeholder", { "result-option-selected": !e.modelValue }]),
            onClick: n[6] || (n[6] = (f) => {
              e.$emit("update:modelValue", ""), e.search = "";
            })
          }, w(e.placeholder), 3)) : p("", !0),
          t.grouped ? (l(!0), u(V, { key: 2 }, j(s.groupedOptions, (f, y) => (l(), u("li", {
            key: `${e.uid}-${f.group}`,
            class: "result-group"
          }, [
            g("span", kd, w(y), 1),
            g("ul", Sd, [
              (l(!0), u(V, null, j(f, (b) => (l(), u("li", {
                key: `${e.uid}-${b.value}`,
                class: k([{
                  "result-option-disabled": b.disabled,
                  "result-option-selected": b.value === e.value
                }, "result-option"]),
                onClick: (_) => b.disabled ? null : e.$emit("update:modelValue", b.value)
              }, w(b.label), 11, Id))), 128))
            ])
          ]))), 128)) : (l(!0), u(V, { key: 1 }, j(s.innerOptions, (f) => (l(), u("li", {
            key: `${e.uid}-${f.value || f.label}`,
            class: k([{
              "result-option-disabled": f.disabled,
              "result-option-selected": f.value === e.value
            }, "result-option"]),
            onClick: (y) => {
              f.disabled || e.$emit("update:modelValue", f.value), e.search = f.label;
            }
          }, w(f.label), 11, wd))), 128))
        ])
      ], 4)) : s.willDetach && e.open ? (l(), S(r, {
        key: 7,
        attach: t.attach,
        type: "vu-select-dropdown",
        show: e.open,
        positions: ["bottom-left", "top-left"],
        side: "bottom-left",
        "sync-width": !0,
        animated: !1,
        "content-class": t.contentClass,
        offsets: { "bottom-left": { y: 3 }, "top-left": { y: -43 } },
        "content-style": [{ zIndex: t.dropdownZIndex }, "position: absolute;", t.contentStyle],
        "onUpdate:show": n[9] || (n[9] = (f) => {
          e.open = f;
        })
      }, {
        body: M(() => [
          x(c, { "always-show": "" }, {
            default: M(() => [
              x(d, te({ ref: "selectOptions" }, { options: s.innerOptions, selected: [s.selected], placeholder: e.placeholder }, {
                onChange: n[7] || (n[7] = (f) => e.value = f),
                onSelectKeydown: s.innerSelectKeydown,
                onClickItem: n[8] || (n[8] = (f) => {
                  this.focus(), e.$emit("update:modelValue", f.value);
                })
              }), null, 16, ["onSelectKeydown"])
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["attach", "show", "content-class", "content-style"])) : p("", !0)
    ], 2)), [
      [h, {
        events: ["click", "contextmenu"],
        handler: function() {
          e.open = !1, e.search = e.value && s.selected.label || e.value;
        }
      }]
    ]),
    (l(!0), u(V, null, j(e.errorBucket, (f, y) => (l(), u("span", {
      key: `${y}-error-${f}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, w(f), 1))), 128)),
    e.helper.length ? (l(), u("span", Cd, w(e.helper), 1)) : p("", !0)
  ], 2);
}
const Si = /* @__PURE__ */ A(ud, [["render", Bd], ["__scopeId", "data-v-36b5e6a1"]]), Od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Si
}, Symbol.toStringTag, { value: "Module" })), $d = {
  name: "vu-grid-view",
  mixins: [vt, Ku],
  props: {
    modelValue: {
      type: [Object, Array],
      default: () => []
    },
    items: {
      type: Array,
      required: !0
    },
    headers: {
      type: Array,
      required: !0
    },
    dense: {
      type: Boolean,
      default: !1
    },
    rich: {
      type: Boolean,
      default: !0
    },
    selectable: {
      type: Boolean,
      default: !1
    },
    allSelectable: {
      type: Boolean,
      default: !0
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
      default: !1
    },
    hideRowsPerPageSelect: {
      type: Boolean,
      default: !1
    },
    whiteBackground: {
      type: Boolean,
      default: !1
    },
    sort: {
      type: Function,
      default(e, n) {
        return this.isAscending ? e[this.sortKey] < n[this.sortKey] ? -1 : e[this.sortKey] > n[this.sortKey] ? 1 : 0 : e[this.sortKey] > n[this.sortKey] ? -1 : e[this.sortKey] < n[this.sortKey] ? 1 : 0;
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
      selectedCellProperty: "",
      size: null
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
    },
    containerHeight() {
      return (this.dense ? 24 : 38) + (this.dense ? 24 : 38) * (this.sortedItems.length < this.rowsPerPage ? this.sortedItems.length : this.rowsPerPage);
    },
    value: {
      get() {
        return this.modelValue;
      },
      set(e) {
        this.$emit("update:modelValue", e);
      }
    },
    isNarrow() {
      var e;
      return ((e = this.size) == null ? void 0 : e.width) < 420;
    },
    isTiny() {
      var e;
      return ((e = this.size) == null ? void 0 : e.width) < 250;
    }
  },
  mounted() {
    this.size = ti(this.$refs.container);
  },
  methods: {
    isEqual(e, n) {
      return e === n;
    },
    selectAll() {
      this.value.length === this.items.length ? this.value = [] : this.value = [...this.items];
    },
    selectItem(e) {
      const n = this.value.includes(e), t = [...this.value];
      if (n) {
        const i = t.indexOf(e);
        this.value.splice(i, 1);
      } else
        this.value.push(e);
    },
    updateRows(e) {
      this.$emit("update:rowsPerPage", e);
    },
    sortBy(e) {
      this.sortKey === e ? this.isAscending = !this.isAscending : (this.sortKey = e, this.isAscending = !0);
    },
    pageUp() {
      this.startRow += this.rowsPerPage, this.$emit("pageUp");
    },
    pageDown() {
      this.startRow -= this.rowsPerPage, this.$emit("pageDown");
    }
  },
  components: { VuCheckbox: bi, VuIconBtn: ue, VuSelect: Si, VuBtn: Ye }
}, Ii = (e) => (et("data-v-c31a0621"), e = e(), tt(), e), xd = {
  key: 0,
  class: "grid-view__table__header-intersection"
}, Td = { class: "grid-view__table__body" }, Vd = ["onClick"], Md = {
  key: 0,
  class: "grid-view__table__row__header"
}, Pd = ["onClick"], Ld = { style: { "margin-right": "5px" } }, Dd = /* @__PURE__ */ Ii(() => /* @__PURE__ */ g("span", { class: "icon-left fonticon fonticon-chevron-left" }, null, -1)), Ad = { class: "inner-text" }, Fd = { class: "inner-text" }, zd = /* @__PURE__ */ Ii(() => /* @__PURE__ */ g("span", { class: "icon-left fonticon fonticon-chevron-right" }, null, -1));
function Ed(e, n, t, i, o, s) {
  const a = O("VuCheckbox"), d = O("VuIconBtn"), c = O("VuSelect"), r = O("VuBtn"), h = _e("tooltip"), f = _e("mask");
  return H((l(), u("div", {
    ref: "container",
    class: k(["vu-grid-view", [{ elevated: e.elevated, "vu-grid-view--rich": t.rich }]])
  }, [
    g("div", {
      class: "grid-view__container",
      style: K(`height: ${s.containerHeight}px;`)
    }, [
      g("table", {
        class: k(["grid-view__table", [
          { dense: t.dense, "grid-view__table--has-selection": s.hasSelected }
        ]])
      }, [
        g("thead", null, [
          g("tr", null, [
            t.selectable ? (l(), u("th", xd, [
              t.allSelectable ? (l(), S(a, {
                key: 0,
                dense: "",
                class: "grid-view__table__checkbox",
                "model-value": s.value.length === t.items.length && t.items.length,
                options: [{}],
                "onUpdate:modelValue": s.selectAll
              }, null, 8, ["model-value", "onUpdate:modelValue"])) : p("", !0)
            ])) : p("", !0),
            (l(!0), u(V, null, j(t.headers, (y, b) => (l(), u("th", {
              key: `header_${y.property}_${b}`
            }, [
              H((l(), u("span", null, [
                X(w(y.label), 1)
              ])), [
                [
                  h,
                  y.label,
                  void 0,
                  {
                    ellipsis: !0,
                    bottom: !0
                  }
                ]
              ]),
              y.sortable !== !1 ? (l(), S(d, {
                key: 0,
                class: "icon-smaller",
                icon: y.property === o.sortKey && o.isAscending ? "expand-up" : "expand-down",
                active: y.property === o.sortKey,
                onClick: (_) => s.sortBy(y.property)
              }, null, 8, ["icon", "active", "onClick"])) : p("", !0)
            ]))), 128))
          ])
        ]),
        g("tbody", Td, [
          (l(!0), u(V, null, j(s.sortedItems, (y, b) => (l(), u("tr", {
            key: `line_${b}`,
            class: k({ dense: t.dense, selected: s.value.includes(y) }),
            onClick: (_) => s.selectItem(y)
          }, [
            t.selectable ? (l(), u("td", Md, [
              x(a, {
                dense: "",
                class: "grid-view__table__body__checkbox",
                "model-value": s.value.includes(y),
                options: [{}],
                "onUpdate:modelValue": (_) => s.selectItem(y)
              }, null, 8, ["model-value", "onUpdate:modelValue"])
            ])) : p("", !0),
            (l(!0), u(V, null, j(t.headers, (_) => (l(), u("td", {
              key: `${_.property}_${y[_.property]}`,
              class: k([
                s.isEqual(y, o.selectedCellItem) && s.isEqual(_.property, o.selectedCellProperty) ? "selected" : ""
              ]),
              onClick: () => {
                o.selectedCellItem = y, o.selectedCellProperty = _.property, e.$emit("cellClick", { item: y, header: _, property: e.property });
              }
            }, [
              C(e.$slots, _.property, qe(Xe(y)), () => [
                X(w(y[_.property]), 1)
              ], !0)
            ], 10, Pd))), 128))
          ], 10, Vd))), 128))
        ])
      ], 2)
    ], 4),
    g("div", {
      class: k(["grid-view__pagination", { "grid-view__pagination--top": t.topPagination, "is-narrow": s.isNarrow }])
    }, [
      C(e.$slots, "pagination", {}, () => [
        t.hideRowsPerPageSelect ? p("", !0) : H((l(), S(c, {
          key: 0,
          options: t.itemPerPageOptions.map((y) => ({ value: y, label: y })),
          "hide-placeholder-option": !0,
          "model-value": t.rowsPerPage,
          "onUpdate:modelValue": s.updateRows
        }, null, 8, ["options", "model-value", "onUpdate:modelValue"])), [
          [Ve, !s.isTiny]
        ]),
        g("div", Ld, w(o.startRow + 1) + "-" + w(s.itemMax) + " / " + w(t.serverItemsLength || t.items.length), 1),
        x(r, {
          disabled: o.startRow === 0,
          class: "pagination-previous-button",
          onClick: s.pageDown
        }, {
          default: M(() => [
            Dd,
            g("span", Ad, w(t.labels.previousLabel), 1)
          ]),
          _: 1
        }, 8, ["disabled", "onClick"]),
        x(r, {
          disabled: o.startRow + t.rowsPerPage >= (t.serverItemsLength || t.items.length),
          class: "pagination-next-button",
          onClick: s.pageUp
        }, {
          default: M(() => [
            g("span", Fd, w(t.labels.nextLabel), 1),
            zd
          ]),
          _: 1
        }, 8, ["disabled", "onClick"])
      ], !0)
    ], 2)
  ], 2)), [
    [f, e.loading]
  ]);
}
const Nd = /* @__PURE__ */ A($d, [["render", Ed], ["__scopeId", "data-v-c31a0621"]]), Rd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nd
}, Symbol.toStringTag, { value: "Module" })), Hd = {
  name: "vu-icon-link",
  components: { VuIcon: pe },
  mixins: [is],
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
    pressed: !1
  })
}, jd = { class: "icon-link__link" };
function Ud(e, n, t, i, o, s) {
  const a = O("VuIcon");
  return l(), u("a", {
    class: k(["vu-icon-link", { active: e.active }])
  }, [
    t.icon ? (l(), S(a, {
      key: 0,
      icon: t.icon,
      active: e.active
    }, null, 8, ["icon", "active"])) : (l(), u(V, { key: 1 }, [
      X(" ")
    ], 64)),
    g("span", jd, [
      C(e.$slots, "default", {}, () => [
        X(w(t.label), 1)
      ], !0)
    ])
  ], 2);
}
const us = /* @__PURE__ */ A(Hd, [["render", Ud], ["__scopeId", "data-v-0b39185d"]]), Wd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: us
}, Symbol.toStringTag, { value: "Module" })), qd = {
  name: "vu-input-date",
  mixins: [Fe, cn, ki, ze, Ee, Oe],
  emits: ["update:modelValue"],
  components: { VuDatepicker: _i },
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
      default: () => !0
    },
    previousMonthLabel: {
      type: String,
      required: !1,
      default: void 0
    },
    nextMonthLabel: {
      type: String,
      required: !1,
      default: void 0
    },
    monthsLabels: {
      type: Array,
      required: !1,
      default: () => {
      }
    },
    weekdaysLabels: {
      type: Array,
      required: !1,
      default: () => {
      }
    },
    weekdaysShortLabels: {
      type: Array,
      required: !1,
      default: () => {
      }
    },
    showWeekNumber: {
      type: Boolean,
      required: !1
    },
    isRTL: {
      type: Boolean,
      required: !1
    }
  },
  data: () => ({
    open: !1,
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
      immediate: !0,
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
      this.date = e, this.hideOnSelect && (this.open = !1);
    }
  }
}, Kd = {
  key: 0,
  class: "control-label"
}, Gd = {
  key: 0,
  class: "label-field-required"
}, Yd = {
  ref: "activator",
  class: "input-date"
}, Xd = ["value", "placeholder", "disabled"], Jd = {
  key: 1,
  class: "form-control-helper-text"
};
function Zd(e, n, t, i, o, s) {
  const a = O("VuDatepicker"), d = _e("click-outside");
  return l(), u("div", {
    class: k(["form-group", e.classes])
  }, [
    e.label.length ? (l(), u("label", Kd, [
      X(w(e.label), 1),
      e.required ? (l(), u("span", Gd, " * ")) : p("", !0)
    ])) : p("", !0),
    H((l(), u("div", Yd, [
      g("input", {
        ref: "input",
        value: e.stringifedValue,
        placeholder: t.placeholder,
        disabled: e.disabled,
        readonly: "",
        type: "text",
        class: k(["form-control input-date", { filled: !s.isEmpty }]),
        onClick: n[0] || (n[0] = (c) => {
          e.open = !0;
        })
      }, null, 10, Xd),
      e.clearable ? (l(), u("span", {
        key: 0,
        class: "input-date-reset fonticon fonticon-clear",
        onClick: n[1] || (n[1] = (c) => s.click())
      })) : p("", !0),
      x(a, {
        style: K([{ position: "absolute", top: "38px" }, t.contentStyle]),
        class: k(t.contentClass),
        modelValue: e.value,
        "onUpdate:modelValue": [
          n[2] || (n[2] = (c) => e.value = c),
          s.handleSelect
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
        onBoundaryChange: n[3] || (n[3] = (c) => s.date = c.value)
      }, null, 8, ["style", "class", "modelValue", "show", "min", "max", "unselectable-days-of-week", "year-range", "first-day", "show-week-number", "is-r-t-l", "previous-month-label", "next-month-label", "months-labels", "weekdays-labels", "weekdays-short-labels", "onUpdate:modelValue"])
    ])), [
      [d, function() {
        e.open = !1;
      }]
    ]),
    (l(!0), u(V, null, j(e.errorBucket, (c, r) => (l(), u("span", {
      key: `${r}-error-${c}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, w(c), 1))), 128)),
    e.helper.length ? (l(), u("span", Jd, w(e.helper), 1)) : p("", !0)
  ], 2);
}
const Qd = /* @__PURE__ */ A(qd, [["render", Zd], ["__scopeId", "data-v-dd785764"]]), ec = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Qd
}, Symbol.toStringTag, { value: "Module" })), tc = {
  name: "vu-input-number",
  inheritAttrs: !1,
  mixins: [Fe, ze, Ee, Oe],
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
      default: !0
    }
  },
  emits: ["update:modelValue"],
  methods: {
    input(e, n) {
      if (n && e === "" && this.value !== "") {
        this.$refs.input.value = this.value;
        return;
      }
      if (e === "" && n === "-" || n === "." || n === ",")
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
      const n = parseFloat(e);
      return n > this.max ? this.max : n < this.min ? this.min : n;
    },
    fixed(e) {
      return Math.round(e * 10 ** this.decimal) / 10 ** this.decimal;
    }
  }
}, nc = {
  key: 0,
  class: "control-label"
}, sc = {
  key: 0,
  class: "label-field-required"
}, ic = { class: "input-number" }, oc = ["disabled"], lc = ["value", "placeholder", "disabled", "min", "max", "step"], ac = ["disabled"], rc = {
  key: 1,
  class: "form-control-helper-text"
};
function uc(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k(["vu-number form-group", { ...e.classes, "vu-number--no-buttons": !t.showButtons }])
  }, [
    e.label.length ? (l(), u("label", nc, [
      X(w(e.label), 1),
      e.required ? (l(), u("span", sc, " *")) : p("", !0)
    ])) : p("", !0),
    g("div", ic, [
      t.showButtons ? (l(), u("button", {
        key: 0,
        type: "button",
        disabled: e.disabled,
        class: "input-number-button input-number-button-left btn btn-default",
        onClick: n[0] || (n[0] = (...a) => s.decrement && s.decrement(...a))
      }, null, 8, oc)) : p("", !0),
      g("input", te(e.$attrs, {
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
          n[1] || (n[1] = Ct((...a) => s.increment && s.increment(...a), ["up"])),
          n[2] || (n[2] = Ct((...a) => s.decrement && s.decrement(...a), ["down"]))
        ],
        onInput: n[3] || (n[3] = (a) => s.input(a.target.value, a.data))
      }), null, 16, lc),
      t.showButtons ? (l(), u("button", {
        key: 1,
        type: "button",
        disabled: e.disabled,
        class: "input-number-button input-number-button-right btn btn-default",
        onClick: n[4] || (n[4] = (...a) => s.increment && s.increment(...a))
      }, null, 8, ac)) : p("", !0)
    ]),
    (l(!0), u(V, null, j(e.errorBucket, (a, d) => (l(), u("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, w(a), 1))), 128)),
    e.helper.length ? (l(), u("span", rc, w(e.helper), 1)) : p("", !0)
  ], 2);
}
const dc = /* @__PURE__ */ A(tc, [["render", uc], ["__scopeId", "data-v-0671176e"]]), cc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dc
}, Symbol.toStringTag, { value: "Module" })), hc = {
  name: "vu-input",
  inheritAttrs: !1,
  inject: {
    vuInputComposition: {
      default: !1
    }
  },
  expose: ["validate", "focus"],
  mixins: [Fe, ze, Oe, Ee],
  emits: ["update:modelValue"],
  methods: {
    focus() {
      var e, n;
      (n = (e = this.$refs) == null ? void 0 : e.input) == null || n.focus();
    }
  }
}, fc = {
  key: 0,
  class: "control-label"
}, pc = {
  key: 0,
  class: "label-field-required"
}, mc = ["value", "placeholder", "disabled", "type"], vc = {
  key: 1,
  class: "form-control-helper-text"
};
function gc(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k(["form-group", e.classes])
  }, [
    e.label.length ? (l(), u("label", fc, [
      X(w(e.label), 1),
      e.required ? (l(), u("span", pc, " *")) : p("", !0)
    ])) : p("", !0),
    g("input", te(e.$attrs, {
      ref: "input",
      value: e.value,
      placeholder: e.placeholder,
      disabled: e.disabled,
      type: e.type,
      class: "form-control",
      onInput: n[0] || (n[0] = ({ target: a }) => {
        s.vuInputComposition || (a.composing = !1), e.$emit("update:modelValue", a.value);
      })
    }), null, 16, mc),
    (l(!0), u(V, null, j(e.errorBucket, (a, d) => (l(), u("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, w(a), 1))), 128)),
    e.helper.length ? (l(), u("span", vc, w(e.helper), 1)) : p("", !0)
  ], 2);
}
const Ci = /* @__PURE__ */ A(hc, [["render", gc], ["__scopeId", "data-v-8920c09a"]]), yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ci
}, Symbol.toStringTag, { value: "Module" })), dt = (e) => typeof e != "string" ? "" : e.charAt(0).toUpperCase() + e.slice(1), bc = {
  name: "vu-lightbox-bar",
  emits: ["close", "click-comment", "click-download", "click-information", "click-share", "media-type-drag-start", "media-type-drag", "media-type-drag-end", "click-compass"],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    showCloseIcon: { default: () => !0 },
    // eslint-disable-next-line vue/require-prop-types
    showCompass: { default: () => !0 },
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
      default: () => !1
    },
    widget: {
      type: Boolean,
      default: () => !1
    },
    moreActionsLabel: {
      type: String,
      default: () => "More"
    },
    disableCompass: {
      type: Boolean,
      required: !0
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
    getListenersFromAttrs: Ze,
    capitalize: dt,
    uid: gt()
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
        const n = { ...e };
        return delete n.close, n;
      }
      return e;
    },
    _dropdownMenuItems() {
      if (this.responsive) {
        const e = this._items.filter(({ nonResponsive: n, hidden: t }) => !n && !t);
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
    actionClick(e, n = "primary-action") {
      e.disabled || (e.handler && e.handler(e), this.$emit(`click-${e.name.toLowerCase()}`, e, { type: n }));
    },
    actionsMergeSubs(e, n) {
      const t = n.filter(({ name: s }) => e.find(({ name: a }) => s === a)), i = n.filter(({ name: s }) => !t.find(({ name: a }) => s === a));
      e.forEach(({ name: s, items: a }) => {
        const d = t.find(({ name: c }) => c === s);
        if (d) {
          const { items: c } = d;
          c && (Array.isArray(a) || (a = []), a.push(...c));
        }
      });
      let o = [...e, ...i];
      return o = o.map((s) => {
        if (s.text === void 0) {
          const a = this.capitalize(s.name);
          s.text = a;
        }
        return s;
      }), o;
    },
    selectedItemsArray(e) {
      return this.customItems ? this.getSelectedItems(e) : [];
    },
    getSelectedItems(e) {
      let n = [];
      return Array.isArray(e) && e.forEach((t) => {
        if (t.items) {
          const i = this.getSelectedItems(t);
          n = [n, ...i];
        }
      }), n.filter((t) => t.selected);
    }
  },
  components: { VuIconBtn: ue, VuDropdownMenu: rt }
}, Bi = (e) => (et("data-v-14413ab3"), e = e(), tt(), e), _c = { class: "lightbox-bar__left" }, wc = /* @__PURE__ */ Bi(() => /* @__PURE__ */ g("div", { class: "lightbox-bar__compass-active" }, null, -1)), kc = [
  wc
], Sc = { class: "lightbox-bar-menu-item lightbox-bar-menu-item--no-cursor" }, Ic = ["draggable"], Cc = { class: "lightbox-bar__title" }, Bc = { class: "lightbox-bar__right" }, Oc = { class: "lightbox-bar__menu" }, $c = {
  key: 2,
  class: "lightbox-bar__divider"
}, xc = /* @__PURE__ */ Bi(() => /* @__PURE__ */ g("hr", { class: "divider divider--vertical" }, null, -1)), Tc = [
  xc
];
function Vc(e, n, t, i, o, s) {
  const a = O("VuIconBtn"), d = O("VuDropdownMenu"), c = _e("tooltip");
  return l(), u("div", {
    class: k(["vu-lightbox-bar", {
      "lightbox-bar--responsive": t.responsive,
      "lightbox-bar--widget-header": t.widget
    }])
  }, [
    g("div", _c, [
      t.showCompass && !t.widget ? (l(), u("div", {
        key: 0,
        class: k(["lightbox-bar__compass", { "lightbox-bar__compass--disabled": t.disableCompass }]),
        onClick: n[0] || (n[0] = (r) => e.$emit("click-compass"))
      }, kc, 2)) : p("", !0),
      C(e.$slots, "lightbox-bar__object-type", {}, () => [
        g("div", Sc, [
          g("div", {
            class: "lightbox-bar__media-type",
            style: K({ "background-color": t.type.backgroundColor }),
            onDragstart: n[1] || (n[1] = (r) => e.$emit("media-type-drag-start", r)),
            onDrag: n[2] || (n[2] = (r) => e.$emit("media-type-drag", r)),
            onDragend: n[3] || (n[3] = (r) => e.$emit("media-type-drag-end", r)),
            draggable: s.hasDragEvent ? "true" : "false"
          }, [
            g("span", {
              class: k(`fonticon fonticon-${t.type.icon}`)
            }, null, 2)
          ], 44, Ic)
        ])
      ], !0),
      g("div", Cc, [
        C(e.$slots, "lightbox-bar__title", {}, () => [
          g("span", null, w(t.label), 1)
        ], !0)
      ])
    ]),
    g("div", Bc, [
      g("div", Oc, [
        t.responsive ? p("", !0) : (l(!0), u(V, { key: 0 }, j(s._items, (r, h) => (l(), u(V, {
          key: `${e.uid}-${h}-rm`
        }, [
          r.items && !r.hidden ? (l(), S(d, te({
            "v-model": s.selectedItemsArray(s._items),
            key: `lightbox-dropdownmenu_${e.uid}-${h}`,
            items: r.items,
            shift: !0,
            disabled: r.disabled
          }, { overlay: t.dropdownOverlay }, { class: "lightbox-bar-dropdown-wrap" }, ot(s.dropdownMenuListeners)), {
            default: M(({ active: f }) => [
              H(x(a, {
                icon: s.icon(r),
                active: r.selected || f,
                disabled: r.disabled,
                color: t.widget ? "default" : "secondary",
                class: "lightbox-bar-menu-item",
                onClick: () => s.actionClick(r)
              }, null, 8, ["icon", "active", "disabled", "color", "onClick"]), [
                [
                  c,
                  `${r.label || e.capitalize(r.name)}`,
                  void 0,
                  {
                    body: !0,
                    bottom: !0
                  }
                ]
              ])
            ]),
            _: 2
          }, 1040, ["v-model", "items", "disabled"])) : r.hidden ? p("", !0) : H((l(), S(a, {
            key: 1,
            icon: s.icon(r),
            active: r.selected,
            disabled: r.disabled,
            color: t.widget ? "default" : "secondary",
            class: "lightbox-bar-menu-item",
            onClick: () => s.actionClick(r)
          }, null, 8, ["icon", "active", "disabled", "color", "onClick"])), [
            [
              c,
              `${r.label || e.capitalize(r.name)}`,
              void 0,
              {
                body: !0,
                bottom: !0
              }
            ]
          ])
        ], 64))), 128)),
        s._dropdownMenuItems.length > 0 ? (l(), S(d, te({
          key: 1,
          "v-model": s.selectedItemsArray(s._dropdownMenuItems),
          class: "lightbox-bar-dropdown-wrap",
          "prevent-dropup": !0,
          items: s._dropdownMenuItems,
          position: "bottom-left",
          shift: !0
        }, { overlay: t.dropdownOverlay }, ot(s.dropdownMenuListeners)), {
          default: M(({ active: r }) => [
            H(x(a, {
              icon: s.menuIcon,
              active: r,
              color: t.widget ? "default" : "secondary",
              class: k(["lightbox-bar-menu-item", t.responsive ? "" : "chevron-menu-icon"])
            }, null, 8, ["icon", "active", "color", "class"]), [
              [
                c,
                `${t.moreActionsLabel}`,
                void 0,
                {
                  body: !0,
                  bottom: !0
                }
              ]
            ])
          ]),
          _: 1
        }, 16, ["v-model", "items"])) : p("", !0),
        C(e.$slots, "lightbox-bar__special-actions", {}, void 0, !0),
        s.hasLeftToDividerContent && s.hasRightToDividerContent ? (l(), u("div", $c, Tc)) : p("", !0),
        (l(!0), u(V, null, j(t.rightItems, (r, h) => (l(), u(V, null, [
          r.hidden ? p("", !0) : H((l(), S(a, {
            key: `${e.uid}-sa-${h}`,
            class: "lightbox-bar-menu-item",
            color: t.widget ? "default" : "secondary",
            icon: s.icon(r),
            active: r.selected,
            disabled: r.disabled,
            onClick: (f) => s.actionClick(r, "side-action")
          }, null, 8, ["color", "icon", "active", "disabled", "onClick"])), [
            [
              c,
              `${r.label || e.capitalize(r.name)}`,
              void 0,
              {
                body: !0,
                bottom: !0
              }
            ]
          ])
        ], 64))), 256)),
        t.showCloseIcon ? H((l(), S(a, {
          key: 3,
          class: "lightbox-bar-menu-item",
          color: t.widget ? "default" : "secondary",
          icon: "close",
          onClick: n[4] || (n[4] = (r) => e.$emit("close", !1))
        }, null, 8, ["color"])), [
          [
            c,
            t.closeLabel,
            void 0,
            {
              body: !0,
              bottom: !0
            }
          ]
        ]) : p("", !0)
      ])
    ])
  ], 2);
}
const Oi = /* @__PURE__ */ A(bc, [["render", Vc], ["__scopeId", "data-v-14413ab3"]]), Mc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Oi
}, Symbol.toStringTag, { value: "Module" })), Pc = { class: "relative full-width h-100%" }, Lc = {
  key: 2,
  class: "panel__header"
}, Dc = { class: "panel__title__text" }, Ac = {
  name: "vu-side-panel"
}, $i = /* @__PURE__ */ Ae({
  ...Ac,
  props: /* @__PURE__ */ Bt({
    side: { default: "left" },
    topbar: { type: Boolean },
    animated: { type: Boolean, default: !0 },
    closeIcon: { type: Boolean, default: !0 },
    closeIconClasses: {},
    closeIconTooltip: {},
    pinIcon: { type: Boolean },
    pinIconClasses: {},
    pinIconTooltip: {},
    pinOnScroll: { type: [Boolean, String] },
    pinOnClick: { type: [Boolean, String], default: !0 },
    pinOnContextmenu: { type: [Boolean, String] },
    transient: { type: [Boolean, String] },
    transientTarget: {},
    title: {},
    panelTitleClasses: {},
    smallCloseIcon: { type: Boolean },
    showEdit: { type: Boolean }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ Bt(["panel-edit"], ["update:modelValue"]),
  setup(e, { expose: n, emit: t }) {
    const i = e, o = t, s = nn(e, "modelValue"), a = T(!1), d = Y(() => be(i.transientTarget)), c = Y(() => `slide-in-${i.side}`), r = Y(() => `slide-out-${i.side}`), h = function() {
    };
    let f = h;
    jt(() => {
      f(), i.transient ? f = fe(d.value, "mouseenter", () => a.value = !0) : f = h;
    }), le(s, (B) => {
      B && (a.value = !1);
    });
    function y() {
      a.value = !0;
    }
    function b() {
      a.value = !1;
    }
    function _() {
      s.value = !1;
    }
    function z() {
      s.value = !0;
    }
    return n({ close: _, open: z, showTransient: y, hideTransient: b }), (B, G) => {
      const Q = _e("tooltip");
      return l(), S(It, {
        appear: "",
        "enter-active-class": c.value,
        "leave-active-class": r.value
      }, {
        default: M(() => [
          H(g("aside", {
            class: k(["vu-side-panel animated bottom-0 absolute", [
              {
                "vu-side-panel--topbar": B.topbar,
                "top-0": !B.topbar
              },
              `${B.side}-0`,
              `vu-side-panel--${B.side}`
            ]]),
            onMouseleave: G[3] || (G[3] = () => {
              s.value || (a.value = !1);
            }),
            onClick: G[4] || (G[4] = () => {
              B.pinOnClick && !s.value && (s.value = !0);
            }),
            onContextmenu: G[5] || (G[5] = () => {
              B.pinOnContextmenu && !s.value && (s.value = !0);
            }),
            onScroll: G[6] || (G[6] = () => {
              B.pinOnScroll && !s.value && (s.value = !0);
            })
          }, [
            g("div", Pc, [
              B.pinIcon && !s.value && a.value ? H((l(), S(ue, {
                key: 0,
                icon: "pin",
                class: k(["absolute! top-2px", [B.pinIconClasses]]),
                onClick: G[0] || (G[0] = () => {
                  s.value = !0, a.value = !1;
                })
              }, null, 8, ["class"])), [
                [
                  Q,
                  B.pinIconTooltip,
                  void 0,
                  { bottom: !0 }
                ]
              ]) : p("", !0),
              B.closeIcon && s.value ? H((l(), S(ue, {
                key: 1,
                icon: "close",
                class: k(["absolute! top-2px right-0", [B.closeIconClasses, { "font-size-[13px]!": B.smallCloseIcon }]]),
                onClick: G[1] || (G[1] = () => {
                  s.value = !1, a.value = !1;
                })
              }, null, 8, ["class"])), [
                [
                  Q,
                  B.closeIconTooltip,
                  void 0,
                  { bottom: !0 }
                ]
              ]) : p("", !0),
              B.title ? (l(), u("div", Lc, [
                g("span", {
                  class: k([
                    "panel__title",
                    [{
                      "mr-38px": B.closeIcon && s.value && !B.closeIconClasses,
                      "ml-28px": B.pinIcon && a.value && !B.pinIconClasses
                    }, B.panelTitleClasses]
                  ])
                }, [
                  C(B.$slots, "title", {}, () => [
                    g("span", Dc, w(B.title), 1)
                  ]),
                  C(B.$slots, "title_icons", {}, () => [
                    B.showEdit ? (l(), S(ue, {
                      key: 0,
                      class: "panel__edit__icon",
                      icon: "pencil",
                      onClick: G[2] || (G[2] = (de) => o("panel-edit"))
                    })) : p("", !0)
                  ])
                ], 2)
              ])) : p("", !0),
              C(B.$slots, "default")
            ])
          ], 34), [
            [Ve, a.value || s.value]
          ])
        ]),
        _: 3
      }, 8, ["enter-active-class", "leave-active-class"]);
    };
  }
}), Fc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $i
}, Symbol.toStringTag, { value: "Module" })), Ts = [
  {
    name: "previous",
    fonticon: "chevron-left",
    selected: !1,
    disabled: !1,
    hidden: !1
  },
  {
    name: "next",
    fonticon: "chevron-right",
    selected: !1,
    disabled: !1,
    hidden: !1
  }
], Vs = [
  {
    name: "comment",
    fonticon: "topbar-comment",
    disabled: !1,
    hidden: !1
  },
  {
    name: "share",
    fonticon: "share-alt",
    disabled: !1,
    hidden: !1
  },
  {
    name: "download",
    fonticon: "download",
    disabled: !1,
    hidden: !1
  },
  {
    name: "information",
    fonticon: "topbar-info",
    disabled: !1,
    hidden: !1
  }
], Ms = {
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
}, zc = {
  name: "vu-lightbox",
  components: { VuLightboxBar: Oi, VuIconBtn: ue, VuIconBtn: ue, VuSidePanel: $i },
  data() {
    return {
      panelStates: [],
      panelsRefs: {},
      openCompass: !1,
      compassAlreadyOpened: !1,
      compassPath: "webapps/i3DXCompassStandalone/i3DXCompassStandalone.html",
      resizeObserver: null,
      transforms: {
        responsive: !1,
        left: {},
        center: {},
        right: {}
      },
      capitalize: dt,
      customItems: [],
      getListenersFromAttrs: Ze,
      uid: crypto.randomUUID(),
      inAnimate: !1,
      outAnimate: !1,
      rightPanelResizeObserver: null
    };
  },
  emits: ["close", "click-comment", "click-information", "click-share", "click-download", "media-type-drag-start", "media-type-drag", "media-type-drag-end", "click-compass"],
  props: {
    /* eslint-disable vue/prop-name-casing, style/quote-props */
    title: {
      type: String,
      default: () => ""
    },
    animatedPanels: {
      type: Boolean,
      default: !0
    },
    userId: {
      type: String,
      required: !1
    },
    panels: {
      type: Array,
      required: !1,
      default: () => [{}]
    },
    widget: {
      type: Boolean,
      default: () => !1
    },
    objectType: {
      type: [String, Object],
      default: () => "picture",
      validator: (e) => !!Ms[e] || e && e.icon && e.backgroundColor
    },
    primaryActions: {
      type: [Array, String],
      default: () => Vs
    },
    customActions: {
      type: Boolean,
      default: () => !1
    },
    menuActions: {
      type: Array,
      required: !1,
      default: () => []
    },
    sideActions: {
      type: Array,
      default: () => Ts
    },
    customSideActions: {
      type: Boolean,
      default: () => !1
    },
    noObjectType: {
      type: Boolean,
      default: () => !1
    },
    disableCompass: {
      type: Boolean,
      default: () => !1
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
      default: () => !1
    },
    fasterAnimation: {
      type: Boolean,
      default: () => !1
    },
    hideCloseIcon: {
      type: Boolean,
      default: () => !1
    },
    dropdownOverlay: Boolean,
    onClose: Function,
    "onClick-comment": Function,
    "onClick-download": Function,
    "onClick-information": Function,
    "onClose-panel-information": Function,
    "onClose-panel-comment": Function,
    "onClick-share": Function,
    "onMedia-type-drag-start": Function,
    "onMedia-type-drag": Function,
    "onMedia-type-drag-end": Function
  },
  created() {
    this.panels.find(({ show: e }) => e !== void 0) || (this.panelStates = this.panels.map((e) => ({ ...e, show: !1 })));
  },
  computed: {
    typeInfo() {
      return typeof this.objectType == "object" ? this.objectType : Ms[this.objectType];
    },
    compassIframeUrl() {
      return `${this.serviceUrl || ""}/${this.compassPath}${this.userId ? `#userId:${this.userId}` : ""}`;
    },
    listeners() {
      return Ze(this.$attrs, !0);
    },
    listenersFromProps() {
      return this.getListenersFromAttrs(this.$props, !0);
    },
    _panels() {
      return this.panelStates.length > 0 ? this.panelStates : this.panels;
    },
    shownRightPanel() {
      return this._panels.find(({ show: e }) => typeof e == "object" ? e.value === !0 : e);
    },
    noCompass() {
      return this.widget;
    },
    _primaryActions() {
      const e = this.primaryActions, n = Vs;
      if (this.widget) {
        const t = e.find(({ name: o }) => o === "information"), i = e.find(({ name: o }) => o === "comment");
        t && !t.fonticon && (n.find(({ name: o }) => o === "information").fonticon = "info"), i && !i.fonticon && (n.find(({ name: o }) => o === "comment").fonticon = "comment");
      }
      return this.actionsMerge(e, n, this.customActions);
    },
    _sideActions() {
      return this.actionsMerge(this.sideActions, Ts, this.customSideActions);
    }
  },
  mounted() {
    this.onResize();
    const e = new ResizeObserver(() => {
      (!this.animatedPanels || !this.shownRightPanel || this.transforms.responsive) && this.onResize();
    });
    e.observe(this.$refs.lightbox), this.resizeObserver = e, this.shownRightPanel && this.updateRightPanelsObservers(this.shownRightPanel);
    const n = this;
    !this.noCompass && window && window.require && window.require(["DS/UWPClientCode/Data/Utils", "DS/UWPClientCode/PublicAPI"], (t, i) => {
      this.getCompassUrl = () => {
        t.getServiceUrl({
          serviceName: "3DCompass",
          onComplete: (o) => {
            n.serviceUrl = o;
          },
          onFailure: () => {
            UWA && UWA.debug && console.error("Lightbox Compass failed to retrieve 3DCompass service url");
          },
          scope: n
        });
      }, this.userId ? this.getCompassUrl() : i.getCurrentUser().then(
        ({ login: o }) => {
          n.userId = o, this.getCompassUrl();
        },
        () => this.getCompassUrl()
      );
    });
  },
  watch: {
    openCompass() {
      this.onResize();
    },
    shownRightPanel(e) {
      this.updateRightPanelsObservers(e);
    },
    outAnimate(e) {
      e && this.onResize(), e && setTimeout(() => {
        this.outAnimate = !1;
      }, 500);
    }
  },
  methods: {
    addCustomAction(e) {
      const n = this.customItems.find(({ name: t }) => t === e.name);
      n ? this.customItems[this.customItems.indexOf(n)] = e : this.customItems.push(e);
    },
    clearCustomActions() {
      this.customItems = [];
    },
    showPanel(e, n = !0) {
      if (!this.panelStates.length)
        return;
      n && this.hideAllPanels(e, !1);
      const t = this.panelStates.find(({ name: i }) => e === i);
      this.showRightPanel || (this.inAnimate = !0), t.show = !0;
    },
    hidePanel(e) {
      if (!this.panelStates.length)
        return;
      const n = this.panelStates.find(({ name: t }) => e === t);
      n.show = !1;
    },
    hideAllPanels(e = "", n = !0) {
      this.panelStates.length && (this.panelStates.filter(({ name: t }) => t !== e).forEach((t) => {
        t.show = !1;
      }), n && (this.outAnimate = !0));
    },
    actionsMerge(e, n, t) {
      let i = e;
      return t || (i = e.slice(0, n.length).filter(({ name: o }) => n.find(({ name: s }) => o === s)), i = i.map((o) => ({
        // If component user messes up order \o/
        ...n.find(({ name: s }) => o.name === s),
        ...o
      }))), i = i.map((o) => {
        if (o.text === void 0) {
          const s = this.capitalize(o.name);
          o.text = s;
        }
        return o;
      }), i;
    },
    onResize(e) {
      const { clientWidth: n } = this.$refs.lightbox;
      let t;
      if (n > 639) {
        const i = Math.min(n * 0.125 + 240, 480);
        t = {
          responsive: !1,
          left: {
            width: `${i}px`
          },
          center: {
            "margin-left": this.openCompass ? `${i}px` : 0,
            "margin-right": this.animatedPanels && e ? `${(e == null ? void 0 : e.clientWidth) || 0}px` : this.shownRightPanel ? `${i}px` : 0
          },
          right: {
            width: `${i}px`
          }
        };
      } else
        t = { responsive: !0, center: {}, right: {} };
      this.transforms = t;
    },
    updateRightPanelsObservers(e) {
      if (this.rightPanelResizeObserver && (this.rightPanelResizeObserver.stop(), delete this.rightPanelResizeObserver), e) {
        const n = this.panelsRefs[e == null ? void 0 : e.name];
        this.rightPanelResizeObserver = qn(n, () => {
          this.onResize(n.$el);
        });
      } else
        this.onResize();
    }
  },
  beforeUnmount() {
    this.resizeObserver && this.resizeObserver.disconnect(), delete this.resizeObserver;
  }
}, Ec = (e) => (et("data-v-70d4f63e"), e = e(), tt(), e), Nc = ["data-id"], Rc = /* @__PURE__ */ Ec(() => /* @__PURE__ */ g("div", { class: "lightbox__overlay" }, null, -1)), Hc = ["src"], jc = {
  key: 0,
  class: "panel__header"
}, Uc = { class: "panel__title" }, Wc = { class: "panel__title__text" };
function qc(e, n, t, i, o, s) {
  const a = O("VuLightboxBar"), d = O("VuIconBtn");
  return l(), u("div", null, [
    C(e.$slots, "lightbox-activator", {}, void 0, !0),
    g("div", {
      ref: "lightbox",
      class: k(["vu-lightbox", {
        "lightbox--responsive": o.transforms.responsive,
        "lightbox--widget-header": t.widget,
        "vu-lightbox--appear-faster": !t.widget && !t.noAnimation && t.fasterAnimation,
        "vu-lightbox--appear-fast": !t.widget && !t.noAnimation && !t.fasterAnimation,
        "overflow-hidden": t.animatedPanels
      }]),
      style: K({
        zIndex: t.zIndex
      }),
      "data-id": o.uid
    }, [
      x(a, te({
        label: t.title,
        "show-compass": !s.noCompass,
        class: { "lightbox-bar--compass-open": o.openCompass },
        type: s.typeInfo,
        items: s._primaryActions,
        "sub-items": t.menuActions,
        "right-items": s._sideActions,
        responsive: o.transforms.responsive,
        "show-close-icon": !t.hideCloseIcon
      }, { disableCompass: t.disableCompass, customItems: o.customItems, dropdownOverlay: t.dropdownOverlay, widget: t.widget, moreActionsLabel: t.moreActionsLabel, closeLabel: t.closeLabel }, ot({ ...s.listeners, ...s.listenersFromProps }), {
        onClickCompass: n[0] || (n[0] = () => {
          t.disableCompass || (o.openCompass = !o.openCompass, o.compassAlreadyOpened = !0), e.$emit("click-compass", o.openCompass);
        })
      }), {
        "lightbox-bar__object-type": M((c) => [
          C(e.$slots, "lightbox-bar__object-type", qe(Xe(c)), void 0, !0)
        ]),
        "lightbox-bar__title": M((c) => [
          C(e.$slots, "lightbox-bar__title", qe(Xe(c)), void 0, !0)
        ]),
        "lightbox-bar__special-actions": M(() => [
          C(e.$slots, "lightbox-bar__special-actions", {}, void 0, !0)
        ]),
        _: 3
      }, 16, ["label", "show-compass", "class", "type", "items", "sub-items", "right-items", "responsive", "show-close-icon"]),
      Rc,
      g("div", {
        ref: "content",
        class: "lightbox__content",
        style: K(o.transforms.center || {})
      }, [
        C(e.$slots, "lightbox-content", {}, void 0, !0)
      ], 4),
      !s.noCompass && o.compassAlreadyOpened ? H((l(), S(Wt(t.animatedPanels ? "vu-side-panel" : "div"), {
        key: 0,
        modelValue: o.openCompass,
        side: e.left,
        class: k(t.animatedPanels ? "" : "column"),
        topbar: !0,
        animate: !0,
        style: K(o.transforms.left || {})
      }, {
        default: M(() => [
          g("iframe", {
            class: "compass",
            src: s.compassIframeUrl
          }, null, 8, Hc),
          o.transforms.responsive ? (l(), S(d, {
            key: 0,
            icon: "close",
            style: { position: "absolute", right: "0", top: "0", zindex: "21" },
            onClick: n[1] || (n[1] = (c) => o.openCompass = !1)
          })) : p("", !0)
        ]),
        _: 1
      }, 8, ["modelValue", "side", "class", "style"])), [
        [Ve, o.openCompass]
      ]) : p("", !0),
      (l(!0), u(V, null, j(s._panels, ({ name: c, show: r, showClose: h = !1, showEdit: f, classes: y = [], title: b }, _) => H((l(), S(Wt(t.animatedPanels ? "vu-side-panel" : "div"), te({
        key: `${o.uid}-${_}`,
        modelValue: typeof r == "object" ? r.value : r,
        class: ["vu-panel", [
          ...y,
          {
            "panel--responsive": o.transforms.responsive,
            "slide-in-right": o.inAnimate,
            "slide-out-right": o.outAnimate
          },
          c,
          t.animatedPanels ? "full-height flex-col side-panel--column" : ["column", "lightbox__panel", "lightbox__panel--right"]
        ]],
        animate: !0,
        side: "right",
        ref_for: !0,
        ref: (z) => {
          c && (o.panelsRefs[c] = z);
        },
        style: [
          t.animatedPanels ? "" : o.transforms.right
        ]
      }, t.animatedPanels ? {
        smallCloseIcon: !0,
        title: b,
        showEdit: f,
        showClose: h,
        topbar: !o.transforms.responsive,
        vOnPanelEdit: () => e.$emit(`panel-edit-${c}`)
      } : {}, {
        "onUpdate:modelValue": (z) => {
          z || e.$emit(`close-panel-${c}`);
        }
      }), {
        default: M(() => [
          !t.animatedPanels && b ? (l(), u("div", jc, [
            g("span", Uc, [
              g("span", Wc, w(b), 1),
              f ? (l(), S(d, {
                key: 0,
                class: "panel__edit__icon",
                icon: "pencil",
                onClick: (z) => e.$emit(`panel-edit-${c}`)
              }, null, 8, ["onClick"])) : p("", !0)
            ]),
            h ? (l(), S(d, {
              key: 0,
              class: "panel__close_icon",
              icon: "close",
              onClick: (z) => e.$emit(`close-panel-${c}`)
            }, null, 8, ["onClick"])) : p("", !0)
          ])) : !t.animatedPanels && (o.transforms.responsive || h) ? (l(), S(d, {
            key: 1,
            class: "panel__close_icon",
            icon: "close",
            onClick: (z) => e.$emit(`close-panel-${c}`)
          }, null, 8, ["onClick"])) : p("", !0),
          g("div", {
            class: k([`vu-dynamic-panel-wrap-${c}`, "panel__content"])
          }, [
            C(e.$slots, `lightbox-panel-${c}`, {}, void 0, !0)
          ], 2)
        ]),
        _: 2
      }, 1040, ["modelValue", "class", "style", "onUpdate:modelValue"])), [
        [Ve, t.animatedPanels ? !0 : typeof r == "object" ? r.value : r]
      ])), 128))
    ], 14, Nc)
  ]);
}
const Kc = /* @__PURE__ */ A(zc, [["render", qc], ["__scopeId", "data-v-70d4f63e"]]), Gc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Kc
}, Symbol.toStringTag, { value: "Module" })), Yc = {
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
  components: { VuIcon: pe }
}, Xc = { class: "vu-media-upload-droppable__icon" }, Jc = { class: "vu-media-upload-droppable__label" };
function Zc(e, n, t, i, o, s) {
  const a = O("VuIcon");
  return l(), u("div", {
    class: k(["vu-media-upload-droppable", s.classes]),
    onDrop: n[0] || (n[0] = re((d) => e.$emit("drop", d), ["prevent", "stop"]))
  }, [
    C(e.$slots, "drop-main", {}, () => [
      g("div", Xc, [
        x(a, {
          icon: "up",
          color: "none"
        })
      ])
    ]),
    C(e.$slots, "drop-alt", {}, () => [
      g("span", Jc, w(s.vuMediaUploadDropText), 1)
    ])
  ], 34);
}
const xi = /* @__PURE__ */ A(Yc, [["render", Zc]]), Qc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xi
}, Symbol.toStringTag, { value: "Module" })), eh = {
  name: "vu-media-upload-empty",
  components: { VuIcon: pe, VuBtn: Ye, VuIconLink: us },
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
}, th = { class: "vu-media-upload-empty" }, nh = { class: "vu-media-upload-empty__OR" }, sh = { key: 1 };
function ih(e, n, t, i, o, s) {
  const a = O("VuIcon"), d = O("VuBtn"), c = O("VuIconLink");
  return l(), u("div", th, [
    x(a, { icon: "drag-drop" }),
    t.rich ? (l(), u(V, { key: 0 }, [
      g("span", null, w(s.vuMediaUploadPlaceholderLong), 1),
      g("span", nh, w(s.vuMediaUploadOR), 1),
      x(d, {
        onClick: n[0] || (n[0] = (r) => e.$emit("browse")),
        color: "primary"
      }, {
        default: M(() => [
          X(w(s.vuMediaUploadBrowse), 1)
        ]),
        _: 1
      })
    ], 64)) : (l(), u("div", sh, [
      X(w(s.vuMediaUploadPlaceholder), 1),
      x(c, {
        onClick: n[1] || (n[1] = (r) => e.$emit("browse"))
      }, {
        default: M(() => [
          X(w(s.vuMediaUploadBrowse), 1)
        ]),
        _: 1
      })
    ]))
  ]);
}
const Ti = /* @__PURE__ */ A(eh, [["render", ih], ["__scopeId", "data-v-e72d88bf"]]), oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ti
}, Symbol.toStringTag, { value: "Module" })), lh = {
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
  components: { VuIconBtn: ue, VuBtn: Ye }
}, ah = { class: "vu-media-upload-error" };
function rh(e, n, t, i, o, s) {
  const a = O("VuIconBtn"), d = O("VuBtn");
  return l(), u("div", ah, [
    x(a, {
      icon: t.icon,
      class: "vu-media-upload-error__icon"
    }, null, 8, ["icon"]),
    (l(!0), u(V, null, j(t.errorBucket, (c, r) => (l(), u("span", {
      class: "vu-media-upload-error__error_label",
      key: r
    }, w(c), 1))), 128)),
    x(d, {
      onClick: n[0] || (n[0] = (c) => e.$emit("retry")),
      class: "vu-media-upload-error__retry",
      small: ""
    }, {
      default: M(() => [
        X(w(s.vuMediaUploadRetry), 1)
      ]),
      _: 1
    })
  ]);
}
const Vi = /* @__PURE__ */ A(lh, [["render", rh], ["__scopeId", "data-v-1ea45111"]]), uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Vi
}, Symbol.toStringTag, { value: "Module" })), dh = {
  name: "vu-progress-circular",
  mixins: [xt],
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
      default: !1,
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
      required: !1,
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
      this.completedView = !1;
      const n = Math.abs(this.progressAngle - e);
      Math.round(this.progressAngle) < Math.round(e) ? n <= this.speedModifier ? this.progressAngle = e : this.progressAngle += this.speedModifier : Math.round(this.progressAngle) > Math.round(e) ? n <= this.speedModifier ? this.progressAngle = e : this.progressAngle -= this.speedModifier : (clearInterval(this.intervalId), this.value >= this.total && (this.completedView = !0));
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
}, ch = { class: "vu-progress-circular" }, hh = { class: "vu-progress-circular__content" };
function fh(e, n, t, i, o, s) {
  return l(), u("div", ch, [
    g("div", {
      class: k(["vu-progress-circular__circle", t.hexColor ? "" : `vu-progress-circular--${t.color}`]),
      style: K({
        background: `conic-gradient( currentcolor ${o.progressAngle}deg, ${t.unfilledColor} ${o.progressAngle}deg)`,
        width: s.radiusPx,
        height: s.radiusPx,
        color: t.hexColor !== void 0 && t.hexColor,
        "-webkit-mask": `radial-gradient(${t.radius * (2 / 5)}px, #0000 98%, #000)`
      })
    }, [
      s.renderHatch ? (l(), u("div", {
        key: 0,
        class: k(["vu-progress-circular__hatch-container", { "vu-progress-circular__hatch-clip": o.progressAngle < 180 }])
      }, [
        g("div", {
          class: "vu-progress-circular__hatch",
          style: K(`transform: rotate(${o.progressAngle}deg)`)
        }, null, 4)
      ], 2)) : p("", !0)
    ], 6),
    g("div", hh, [
      o.completedView && this.$slots.complete ? C(e.$slots, "complete", { key: 0 }, void 0, !0) : C(e.$slots, "default", { key: 1 }, () => [
        x(It, {
          name: "fade",
          mode: "out-in"
        }, {
          default: M(() => [
            g("div", {
              key: "uncomplete-view",
              style: K({ fontSize: `${t.radius / 5}px` })
            }, w(Math.round(o.progressAngle / 360 * 100)) + "% ", 5)
          ]),
          _: 1
        })
      ], !0)
    ])
  ]);
}
const Mi = /* @__PURE__ */ A(dh, [["render", fh], ["__scopeId", "data-v-2cca5b59"]]), ph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Mi
}, Symbol.toStringTag, { value: "Module" })), mh = {
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
  components: { VuProgressCircular: Mi, VuBtn: Ye }
}, vh = { class: "vu-media-upload-loading" };
function gh(e, n, t, i, o, s) {
  const a = O("VuProgressCircular"), d = O("VuBtn");
  return l(), u("div", vh, [
    x(a, { value: t.progress }, null, 8, ["value"]),
    x(d, {
      color: "default",
      onClick: n[0] || (n[0] = (c) => e.$emit("upload-abort")),
      small: "",
      class: "vu-media-upload-loading__abort"
    }, {
      default: M(() => [
        X(w(s.vuMediaUploadAbortButton), 1)
      ]),
      _: 1
    })
  ]);
}
const Pi = /* @__PURE__ */ A(mh, [["render", gh], ["__scopeId", "data-v-65c4aae6"]]), yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pi
}, Symbol.toStringTag, { value: "Module" })), bh = {
  name: "vu-media-upload-preview",
  computed: {
    videoSizer() {
      var i;
      const [e, n] = (i = this.displayRatio) == null ? void 0 : i.replace(",", "").split("/"), t = Number(e) / Number(n);
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
      required: !0
    },
    isVideo: {
      type: Boolean
    },
    videoControls: {
      type: Boolean,
      required: !1
    },
    displayRatio: {
      type: String,
      default: () => "16 / 9"
    }
  },
  emits: ["delete"],
  components: { VuImage: at, VuIconBtn: ue }
}, _h = ["src", "controls"];
function wh(e, n, t, i, o, s) {
  const a = O("VuIconBtn"), d = O("VuImage"), c = O("vu-spinner");
  return l(), u(V, null, [
    t.isVideo ? (l(), u("div", {
      key: 0,
      class: "vu-media-upload-preview__video-container",
      style: K(s.videoSizer)
    }, [
      g("video", {
        class: "vu-media-upload-preview",
        src: t.src,
        controls: t.videoControls
      }, null, 8, _h)
    ], 4)) : t.isVideo ? e.loading ? (l(), S(c, { key: 2 })) : p("", !0) : (l(), S(d, {
      key: 1,
      class: "vu-media-upload-preview",
      "aspect-ratio": t.displayRatio,
      src: t.src,
      contain: "",
      style: { height: "100%" }
    }, {
      default: M(() => [
        g("div", {
          class: "vu-media-upload-preview__delete-icon",
          onClick: n[0] || (n[0] = (r) => e.$emit("delete"))
        }, [
          x(a, { icon: t.deleteIcon }, null, 8, ["icon"])
        ])
      ]),
      _: 1
    }, 8, ["aspect-ratio", "src"])),
    t.isVideo ? (l(), u("div", {
      key: 3,
      class: "vu-media-upload-preview__delete-icon",
      onClick: n[1] || (n[1] = (r) => e.$emit("delete"))
    }, [
      x(a, { icon: t.deleteIcon }, null, 8, ["icon"])
    ])) : p("", !0)
  ], 64);
}
const Li = /* @__PURE__ */ A(bh, [["render", wh], ["__scopeId", "data-v-d9cd5744"]]), kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Li
}, Symbol.toStringTag, { value: "Module" })), Sh = {
  empty: "empty",
  loading: "loading",
  error: "error",
  complete: "complete"
}, Ih = {
  name: "vu-media-upload",
  mixins: [Fe, Oe, vt, ze, Ee],
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
      default: !1
    },
    videoControls: {
      type: Boolean,
      default: !0
    },
    uploadProgress: {
      type: Number,
      required: !1,
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
      required: !1
    },
    noDragNDrop: {
      type: Boolean,
      required: !1
    },
    acceptVideo: Boolean,
    acceptImage: {
      type: Boolean,
      default: !0
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
      states: Sh,
      innerState: "empty",
      innerVideo: !1,
      allowDrop: !1,
      dragged: !1,
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
      this.noDragNDrop || this.state !== this.states.complete && (this.state === this.states.loading && !this.allowLoadingDrop || this.state === this.states.error && !this.allowErrorDrop || (this.allowDrop = !0, this.dragged = !0));
    },
    dragLeave(e) {
      e.currentTarget.contains(e.relatedTarget) || (this.dragged = !1, this.allowDrop = !1);
    },
    onFileDrop(e) {
      this.dragged = !1, this.allowDrop = !1, this.status = this.states.loading, this.selectFiles(e.dataTransfer.files);
    },
    checkFileSize({ size: e }) {
      return this.fileMaxSize && e / 1024 / 1024 >= this.fileMaxSize ? this.vuMediaUploadSizeExcess : !0;
    },
    /* 3 checks disablable with skipTypeCheck */
    checkImgType({ type: e }) {
      if (this.acceptImage) {
        const n = /image\/(jpg|jpeg|png|webp)$/i.test(e);
        if (n && (this.innerVideo = !1), !this.acceptVideo)
          return n || this.vuMediaUploadShouldBeImage;
      }
      return !0;
    },
    checkVideoType({ type: e }) {
      if (this.acceptVideo) {
        const n = /video\/(mp4|avi)$/i.test(e);
        if (this.innerVideo = n, !this.acceptImage)
          return n || this.vuMediaUploadShouldBeVideo;
      }
      return !0;
    },
    checkVideoAndImgType({ type: e }) {
      return this.acceptVideo && this.acceptImage ? /video\/(mp4|avi)$/i.test(e) && /image\/(jpg|jpeg|png|webp)$/i.test(e) || this.vuMediaUploadTypeUnexpected : !0;
    },
    onRetry() {
      this.errorBucket = [], this.status = this.states.empty, this.$emit("retry", this.$refs["upload-input"].value);
    }
  },
  components: { VuIcon: pe, VuMediaUploadDroppable: xi, VuMediaUploadLoading: Pi, VuMediaUploadError: Vi, VuMediaUploadEmpty: Ti, VuMediaUploadPreview: Li }
}, Ch = {
  key: 0,
  class: "control-label"
}, Bh = {
  key: 0,
  class: "label-field-required"
}, Oh = ["multiple"];
function $h(e, n, t, i, o, s) {
  const a = O("VuIcon"), d = O("VuMediaUploadDroppable"), c = O("VuMediaUploadEmpty"), r = O("VuMediaUploadLoading"), h = O("VuMediaUploadError"), f = O("vuMediaUploadPreview");
  return l(), u("div", {
    class: k(["vu-media-upload", [{ "has-error": o.error, "vu-media-upload--border": !s.hasLabel, "vu-media-upload--inner-flex": s.hasLabel }]]),
    style: K(s.hasLabel ? {} : s.wrapStyle)
  }, [
    s.hasLabel ? (l(), u("label", Ch, [
      t.icon ? (l(), S(a, {
        key: 0,
        icon: t.icon
      }, null, 8, ["icon"])) : p("", !0),
      C(e.$slots, "label", {}, () => [
        X(w(e.label), 1),
        e.required ? (l(), u("span", Bh, " *")) : p("", !0)
      ], !0)
    ])) : p("", !0),
    g("input", {
      ref: "upload-input",
      type: "file",
      name: "upload",
      style: { display: "none" },
      onChange: n[0] || (n[0] = (y) => s.selectFiles(e.$refs["upload-input"].files)),
      multiple: t.multiple
    }, null, 40, Oh),
    g("div", {
      class: k(["vu-media-upload__inner", { "vu-media-upload--border": s.hasLabel, "full-height": !s.hasLabel }]),
      ref: "inner",
      style: K(s.hasLabel ? s.wrapStyle : ""),
      onDragover: n[4] || (n[4] = re((y) => s.dragOver(), ["prevent"])),
      onDragenter: n[5] || (n[5] = re((y) => s.dragOver(), ["prevent"])),
      onDragleave: n[6] || (n[6] = (...y) => s.dragLeave && s.dragLeave(...y)),
      onDragend: n[7] || (n[7] = (...y) => s.dragLeave && s.dragLeave(...y))
    }, [
      o.dragged ? (l(), S(d, {
        key: 0,
        "valid-drop": o.allowDrop,
        onDrop: s.onFileDrop
      }, {
        "drop-icon": M(() => [
          C(e.$slots, "drop-icon", {}, void 0, !0)
        ]),
        "drop-label": M(() => [
          C(e.$slots, "drop-label", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["valid-drop", "onDrop"])) : p("", !0),
      s.status === o.states.empty ? C(e.$slots, "empty", {
        key: 1,
        input: e.$refs["upload-input"]
      }, () => [
        x(c, {
          onBrowse: n[1] || (n[1] = (y) => {
            e.$refs["upload-input"].value = "", e.$refs["upload-input"].click();
          })
        })
      ], !0) : s.status === o.states.loading ? C(e.$slots, "loading", { key: 2 }, () => [
        x(r, {
          progress: t.uploadProgress,
          onUploadAbort: n[2] || (n[2] = (y) => e.$emit("upload-abort"))
        }, null, 8, ["progress"])
      ], !0) : s.status === o.states.error ? C(e.$slots, "error", { key: 3 }, () => [
        x(h, te({ onRetry: s.onRetry }, { errorBucket: e.errorBucket }), null, 16, ["onRetry"])
      ], !0) : s.status === o.states.complete ? C(e.$slots, "preview", { key: 4 }, () => [
        x(f, te(s.preview, {
          onDelete: n[3] || (n[3] = (y) => {
            e.$emit("delete"), s.status = o.states.empty;
          })
        }), null, 16)
      ], !0) : p("", !0)
    ], 38)
  ], 6);
}
const xh = /* @__PURE__ */ A(Ih, [["render", $h], ["__scopeId", "data-v-b2db812d"]]), Th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xh
}, Symbol.toStringTag, { value: "Module" }));
var Pn = /* @__PURE__ */ ((e) => (e[e.TIMEOUT = 0] = "TIMEOUT", e[e.CLOSE = 1] = "CLOSE", e[e.PROGRAMMATICALLY = 2] = "PROGRAMMATICALLY", e))(Pn || {});
let ct = {
  create: () => {
  },
  hide: () => {
  },
  _exists: () => !1,
  _register: () => {
  },
  _installed: !1
};
Object.defineProperty(ct, "_installed", {
  value: !1,
  writable: !1
});
function Vh(e, n) {
  const t = pt([]), i = pt({}), o = e.runWithContext(() => Te("vuDebug", { default: !1 }));
  if (n && ct._installed) {
    o && console.warn("VUEKIT - Message API install was called more than once. Using namespace on message container will help.");
    return;
  }
  ct._installed && o && console.warn("VUEKIT - Message API mutliple installation might affect other default container namespaces.");
  const s = Nn({
    _messages: i,
    namespaces: t,
    _installed: !0,
    create(a, d) {
      const { target: c = "main" } = a;
      if (!this._exists(c))
        throw new Error("Target namespace is unknown");
      const r = pt({
        id: crypto.randomUUID(),
        bind: {
          target: c,
          ...a,
          disposed: !1
        },
        onDispose: d,
        dispose(h) {
          s.hide(
            r,
            h ?? 2
            /* PROGRAMMATICALLY */
          );
        }
      });
      return this._messages[c].push(r), r;
    },
    hide(a, d) {
      var h;
      if (!a)
        return;
      const { target: c = "main" } = a.bind, r = this._messages[c].findIndex((f) => f.id === a.id);
      if (r !== -1) {
        const f = this._messages[c][r];
        this._messages[c].splice(r, 1), f.bind.disposed = !0, (h = f.onDispose) == null || h.call(f, d);
      }
    },
    _exists(a) {
      return t.includes(a);
    },
    _register(a) {
      t.push(a), this._messages[a] = mt([]);
    }
  });
  ct = s, e.provide("vuMessageAPI", ct), e.config.globalProperties.$vuMessage = ct;
}
const Mh = {
  name: "vu-message",
  mixins: [Tt, xt],
  components: { VuIconLink: us },
  props: {
    text: {
      type: String,
      default: () => ""
    },
    closable: {
      type: Boolean,
      default: () => !0
    },
    color: {
      type: String,
      default: () => "primary"
    },
    animate: {
      type: Boolean,
      default: () => !0
    },
    showProgress: {
      type: Boolean,
      default: () => !1
    },
    link: {
      type: String,
      required: !1
    },
    linkHandler: {
      type: Function,
      required: !1,
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
    target: String
  },
  emits: ["update:show", "click-link"],
  data: () => ({
    DISPOSE_REASON: Pn,
    activeTimeout: 0,
    activeTimer: 0,
    in: !0,
    timerStart: 0,
    timer: 0
  }),
  inject: {
    noProgress: {
      from: es
    }
  },
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
    timeout() {
      this.setTimeout();
    },
    text() {
      this.setTimeout();
    },
    show(e) {
      e && this.setTimeout();
    }
  },
  beforeUnmount() {
    window.clearInterval(this.activeTimer), window.clearTimeout(this.activeTimeout);
  },
  mounted() {
    this.setTimeout();
  },
  methods: {
    dispose(e) {
      this.$emit("update:show", !1, e);
    },
    clearTimers() {
      window.clearInterval(this.activeTimer), window.clearTimeout(this.activeTimeout), this.timerStart = 0, this.timer = 0;
    },
    setTimeout() {
      this.clearTimers(), this.show && this.timeout && (this.timerStart = Date.now(), this.activeTimeout = window.setTimeout(() => {
        this.dispose(Pn.TIMEOUT);
      }, this.timeout + 100), this.showProgress && (this.activeTimer = window.setInterval(() => {
        this.timer = Date.now() - this.timerStart;
      }, 1e3 / 30)));
    }
  }
}, Ph = {
  key: 0,
  class: "icon fonticon"
}, Lh = { class: "alert-message-wrap" }, Dh = ["innerHTML"], Ah = ["max", "value"];
function Fh(e, n, t, i, o, s) {
  const a = O("VuIconLink");
  return e.show ? (l(), u("div", {
    key: 0,
    class: k(["vu-message relative alert-has-icon", s.classes])
  }, [
    s.colored ? (l(), u("span", Ph)) : p("", !0),
    g("span", Lh, [
      C(e.$slots, "default", {}, () => [
        g("div", { innerHTML: t.text }, null, 8, Dh)
      ], !0)
    ]),
    t.link ? (l(), S(a, {
      key: 1,
      label: t.link,
      class: "vu-message_link",
      onClick: n[0] || (n[0] = () => {
        e.$emit("click-link", e.linkData), t.linkHandler();
      })
    }, null, 8, ["label"])) : p("", !0),
    t.closable ? (l(), u("span", {
      key: 2,
      class: "close fonticon fonticon-cancel",
      onClick: n[1] || (n[1] = (d) => s.dispose(e.DISPOSE_REASON.CLOSE))
    })) : p("", !0),
    t.showProgress && t.timeout && !s.noProgress ? (l(), u("progress", {
      key: 3,
      class: k(`progress animated bottom-0 absolute h-1! progress-${t.color}`),
      max: t.timeout,
      value: Math.min(e.timer, t.timeout)
    }, null, 10, Ah)) : p("", !0)
  ], 2)) : p("", !0);
}
const Di = /* @__PURE__ */ A(Mh, [["render", Fh], ["__scopeId", "data-v-b7445009"]]), zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Di
}, Symbol.toStringTag, { value: "Module" })), Eh = {
  name: "vu-message-container",
  props: {
    namespace: {
      type: String,
      default: "main"
    }
  },
  created() {
    this.api = ct, this.api._exists(this.namespace) ? this.disabled = !0 : this.api._register(this.namespace);
  },
  data: () => ({
    api: {},
    disabled: !1
  }),
  components: { VuMessage: Di }
}, Nh = {
  key: 0,
  class: "alert alert-root",
  style: { visibility: "visible" }
};
function Rh(e, n, t, i, o, s) {
  const a = O("VuMessage");
  return e.disabled ? p("", !0) : (l(), u("div", Nh, [
    x(_o, { name: "fade" }, {
      default: M(() => {
        var d;
        return [
          (l(!0), u(V, null, j((d = e.api._messages) == null ? void 0 : d[t.namespace], (c) => (l(), S(a, te(c.bind, {
            show: "",
            key: `${c.id}`,
            "onUpdate:show": (r, h) => e.api.hide(c, h)
          }), null, 16, ["onUpdate:show"]))), 128))
        ];
      }),
      _: 1
    })
  ]));
}
const Hh = /* @__PURE__ */ A(Eh, [["render", Rh], ["__scopeId", "data-v-ca849454"]]), jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Hh
}, Symbol.toStringTag, { value: "Module" })), Uh = {
  name: "vu-mobile-dialog",
  emits: ["close", "confirm"],
  components: { VuScroller: Qe, VuIconBtn: ue },
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
      default: !0
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
}, Wh = { class: "vu-mobile-dialog" }, qh = { class: "vu-mobile-dialog__header" }, Kh = { class: "vu-mobile-dialog__header__default" }, Gh = {
  class: "vu-label-wrap",
  style: { overflow: "hidden" }
};
function Yh(e, n, t, i, o, s) {
  const a = O("VuIconBtn"), d = O("VuScroller"), c = _e("tooltip");
  return l(), u("div", Wh, [
    g("div", qh, [
      C(e.$slots, "mobile-dialog-header", {}, () => [
        g("div", Kh, [
          H(x(a, {
            icon: s._backIcon,
            class: k([s.backClasses, "vu-mobile-dialog__header_back topbar"]),
            onClick: n[0] || (n[0] = (r) => e.$emit("close"))
          }, null, 8, ["icon", "class"]), [
            [
              c,
              t.backIconTooltip,
              void 0,
              { bottom: !0 }
            ]
          ]),
          g("div", Gh, [
            H((l(), u("label", null, [
              X(w(t.title), 1)
            ])), [
              [
                c,
                t.title,
                void 0,
                { bottom: !0 }
              ]
            ])
          ]),
          H(x(a, {
            icon: s._icon,
            class: k([s.nextClasses, "vu-mobile-dialog__header_next topbar"]),
            disabled: t.nextIconDisabled,
            onClick: n[1] || (n[1] = (r) => e.$emit("confirm"))
          }, null, 8, ["icon", "class", "disabled"]), [
            [
              c,
              t.nextIconTooltip,
              void 0,
              { bottom: !0 }
            ]
          ])
        ])
      ], !0)
    ]),
    g("div", {
      class: k(["vu-mobile-dialog__content", `vu-mobile-dialog__content--${t.scrollable ? "" : "non-"}scrollable`])
    }, [
      t.scrollable ? (l(), S(d, { key: 0 }, {
        default: M(() => [
          C(e.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      })) : C(e.$slots, "default", { key: 1 }, void 0, !0)
    ], 2)
  ]);
}
const Ai = /* @__PURE__ */ A(Uh, [["render", Yh], ["__scopeId", "data-v-37f003ee"]]), Xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ai
}, Symbol.toStringTag, { value: "Module" })), Jh = {
  name: "vu-modal",
  data: () => ({
    model: "",
    mobileWidth: !1,
    resizeObs: {},
    pick: os,
    pickNRename: Ga
  }),
  emits: ["close", "cancel", "confirm"],
  mixins: [Tt],
  props: {
    show: {
      type: Boolean,
      required: !1,
      default: () => !1
    },
    keepRendered: {
      type: Boolean,
      default: () => !1
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
      default: () => !0
    },
    showCancelIcon: {
      type: Boolean,
      default: () => !0
    },
    showCancelButton: {
      type: Boolean,
      default: () => !1
    },
    showFooter: {
      type: Boolean,
      default: () => !0
    },
    showInput: {
      type: Boolean,
      default: () => !1
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
      default: () => !0
    },
    success: {
      type: Boolean,
      default: () => !1
    },
    disableKeyboardConfirm: {
      type: Boolean,
      default: !1
    },
    autofocus: {
      type: Boolean,
      required: !1
    },
    autofocusRef: {
      type: Object,
      required: !1
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
    formRef: {
      type: Object,
      required: !1
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
    },
    show: {
      immediate: !0,
      handler(e) {
        this.innerShow = !!e;
      }
    }
  },
  beforeMount() {
    this.noMobile || (this.checkWidth(), window.addEventListener("resize", this.checkWidth));
  },
  mounted() {
    this.show && this.setFocus();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkWidth);
  },
  updated() {
    this.show && this.setFocus();
  },
  methods: {
    cancel(e = !1, n = !1) {
      this.innerShow = !1, e ? this.$emit(e ? "close" : "cancel") : this.$emit(n && this.showCancelButton ? "cancel" : "close"), this.showInput && this.clear();
    },
    confirm() {
      !this.showInput && !this.formRef ? (this.$emit("confirm", !0), this.innerShow = !1) : this.validate() && (this.$emit("confirm", this.model), this.innerShow = !1, this.clear());
    },
    validate(e) {
      var n;
      return typeof ((n = this.formRef) == null ? void 0 : n.validate) == "function" ? this.formRef.validate() : this.$refs.form.validate(e);
    },
    clear() {
      this.model = "";
    },
    checkWidth() {
      window.document.documentElement.clientWidth < this.vuMobileBreakpoint ? this.mobileWidth = !0 : this.mobileWidth = !1;
    },
    setFocus() {
      var e;
      if (this.autofocus || this.autofocusRef) {
        const n = (e = this.$refs) == null ? void 0 : e.input;
        this.autofocusRef ? this.autofocusRef.focus() : n && n.focus();
      }
    }
  },
  components: { VuMobileDialog: Ai, VuInput: Ci, VuForm: wi, VuBtn: Ye }
}, Zh = { key: 0 }, Qh = ["innerHTML"], ef = { key: 1 }, tf = {
  class: "vu-modal modal modal-root",
  style: { display: "block" }
}, nf = { class: "modal-wrap" }, sf = { class: "modal-header" }, of = { class: "modal-body" }, lf = ["innerHTML"], af = { key: 1 }, rf = {
  key: 0,
  class: "modal-footer"
}, uf = /* @__PURE__ */ g("div", { class: "modal-overlay in" }, null, -1);
function df(e, n, t, i, o, s) {
  const a = O("VuInput"), d = O("VuForm"), c = O("VuMobileDialog"), r = O("VuBtn");
  return t.keepRendered || e.innerShow ? H((l(), u("div", Zh, [
    !t.noMobile && e.mobileWidth ? (l(), S(c, te({ key: 0 }, {
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
      onClose: n[1] || (n[1] = (h) => s.cancel()),
      onConfirm: n[2] || (n[2] = (h) => s.confirm())
    }), {
      "mobile-dialog-header": M(() => [
        C(e.$slots, "mobile-header")
      ]),
      default: M(() => [
        C(e.$slots, "modal-body", {}, () => [
          t.rawContent ? (l(), u("div", {
            key: 0,
            innerHTML: t.rawContent
          }, null, 8, Qh)) : t.message ? (l(), u("p", ef, w(t.message), 1)) : p("", !0),
          t.showInput ? (l(), S(d, {
            key: 2,
            ref: "form"
          }, {
            default: M(() => [
              x(a, {
                modelValue: e.model,
                "onUpdate:modelValue": n[0] || (n[0] = (h) => e.model = h),
                ref: "input",
                label: t.label,
                required: t.required,
                helper: t.helper,
                success: t.success,
                placeholder: t.placeholder,
                rules: t.rules
              }, null, 8, ["modelValue", "label", "required", "helper", "success", "placeholder", "rules"])
            ]),
            _: 1
          }, 512)) : p("", !0)
        ])
      ]),
      _: 3
    }, 16)) : (l(), u(V, { key: 1 }, [
      g("div", tf, [
        g("div", nf, [
          g("div", {
            class: "modal-content",
            onKeyup: [
              n[6] || (n[6] = Ct(() => {
                t.keyboard && !t.disableKeyboardConfirm && s.confirm();
              }, ["enter"])),
              n[7] || (n[7] = Ct(() => {
                t.keyboard && s.cancel();
              }, ["escape"]))
            ]
          }, [
            g("div", sf, [
              C(e.$slots, "modal-header", {}, () => [
                t.showCancelIcon ? (l(), u("span", {
                  key: 0,
                  class: "close fonticon fonticon-cancel",
                  title: "",
                  onClick: n[3] || (n[3] = (h) => s.cancel(!0))
                })) : p("", !0),
                g("h4", null, w(t.title), 1)
              ])
            ]),
            g("div", of, [
              C(e.$slots, "modal-body", {}, () => [
                t.rawContent ? (l(), u("div", {
                  key: 0,
                  innerHTML: t.rawContent
                }, null, 8, lf)) : t.message ? (l(), u("p", af, w(t.message), 1)) : p("", !0),
                t.showInput ? (l(), S(d, {
                  key: 2,
                  ref: "form"
                }, {
                  default: M(() => [
                    x(a, {
                      modelValue: e.model,
                      "onUpdate:modelValue": n[4] || (n[4] = (h) => e.model = h),
                      ref: "input",
                      label: t.label,
                      required: t.required,
                      helper: t.helper,
                      success: t.success,
                      placeholder: t.placeholder,
                      rules: t.rules
                    }, null, 8, ["modelValue", "label", "required", "helper", "success", "placeholder", "rules"])
                  ]),
                  _: 1
                }, 512)) : p("", !0)
              ])
            ]),
            t.showFooter ? (l(), u("div", rf, [
              C(e.$slots, "modal-footer", {}, () => [
                x(r, {
                  color: "primary",
                  onClick: s.confirm
                }, {
                  default: M(() => [
                    X(w(t.okLabel), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                t.showCancelButton ? (l(), S(r, {
                  key: 0,
                  color: "default",
                  onClick: n[5] || (n[5] = (h) => s.cancel())
                }, {
                  default: M(() => [
                    X(w(t.cancelLabel), 1)
                  ]),
                  _: 1
                })) : p("", !0)
              ])
            ])) : p("", !0)
          ], 32)
        ])
      ]),
      uf
    ], 64))
  ], 512)), [
    [Ve, e.innerShow]
  ]) : p("", !0);
}
const ds = /* @__PURE__ */ A(Jh, [["render", df]]), cf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ds
}, Symbol.toStringTag, { value: "Module" }));
let Ht = {
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
  _modals: mt([])
};
function hf(e) {
  const n = mt([]);
  return Ht = Nn({
    _modals: n,
    show(i) {
      return this.hide(), new Promise((o, s) => {
        const a = {
          id: Ge(),
          component: ds,
          bind: pt({ ...i, show: !0 }),
          on: {
            close: () => {
              this.hide(a), s();
            },
            confirm: (d) => {
              this.hide(a), o(d);
            },
            cancel: () => {
              this.hide(a), s();
            }
          }
        };
        this._modals.push(mt(a));
      });
    },
    hide(i) {
      if (i) {
        const o = this._modals.find((s) => s.id === i.id);
        if (!o)
          return;
        o.bind.show = !1, setTimeout(() => {
          const s = this._modals.findIndex((a) => a.id === i.id);
          s > -1 && this._modals.splice(s, 1);
        }, 1e3);
      } else
        this._modals.forEach((o) => {
          o._cancel = !0;
        }), this._modals.splice(0, this._modals.length);
    },
    alert(i) {
      return this.show(i);
    },
    confirm(i) {
      return this.show({
        showCancelIcon: !0,
        showCancelButton: !0,
        ...i
      });
    },
    prompt(i) {
      return this.show({
        showCancelIcon: !0,
        showCancelButton: !0,
        showInput: !0,
        ...i
      });
    }
  }), e.provide("vuModalAPI", Ht), e.config.globalProperties.$vuModal = Ht, Ht;
}
const ff = {
  name: "vu-modal-container",
  components: {
    VuModal: ds
  },
  data: () => ({
    // eslint-disable-next-line vue/no-reserved-keys
    _modals: {
      type: Object
    }
  }),
  created() {
    this._modals = Ht._modals;
  }
};
function pf(e, n, t, i, o, s) {
  return l(!0), u(V, null, j(e._modals, (a) => (l(), S(Wt(a.component), te({
    key: a.id
  }, a.bind, {
    modelValue: a.value,
    "onUpdate:modelValue": (d) => a.value = d
  }, ot(a.on)), null, 16, ["modelValue", "onUpdate:modelValue"]))), 128);
}
const mf = /* @__PURE__ */ A(ff, [["render", pf]]), vf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: mf
}, Symbol.toStringTag, { value: "Module" }));
function Ps(e, n) {
  var t;
  e.value > -1 ? e.value -= 1 : e.value = (((t = n.value) == null ? void 0 : t.length) || 0) - 1;
}
function Ls(e, n) {
  var t;
  e.value > (((t = n.value) == null ? void 0 : t.length) || 0) - 2 ? e.value = -1 : e.value += 1;
}
function Qt(e, n, t, i, o) {
  const { target: s = !1 } = t;
  if (s instanceof HTMLInputElement) {
    const { selectionStart: a } = s;
    return e && s.value || n && a !== 0;
  }
  return !1;
}
function Ds(e, n) {
  const {
    target: t,
    items: i,
    debug: o = !1,
    disabled: s = !1
  } = e || {}, {
    direction: a = "vertical",
    discardWhenValue: d = !1,
    discardWhenCaretInBetween: c = !1,
    preserveIndexOnRemoval: r = !1
  } = n || {};
  if (!t) {
    o && console.warn("VUEKIT - Warning Keyboard Navigation cannot be applied. Please use onMount hook and check target element is mounted.");
    return;
  }
  const h = a === "vertical", f = T(-1);
  le(i, (b, _) => {
    r && (b == null ? void 0 : b.length) < (_ == null ? void 0 : _.length) ? f.value === _.length - 1 && (f.value = b.length - 1) : f.value = -1;
  });
  const y = tl(f, { initialValue: -1 });
  return !h && Cs("ArrowLeft", (b) => {
    s || Qt(d, c, b) || Ps(f, i);
  }, { target: t, dedupe: !0 }), !h && Cs("ArrowRight", (b) => {
    if (!(s || Qt(d, c, b))) {
      if (c)
        if (f.value !== -1)
          b.preventDefault();
        else
          return;
      Ls(f, i);
    }
  }, { target: t, dedupe: !0 }), h && Vn("ArrowUp", (b) => {
    s || Qt(d, c, b) || Ps(f, i);
  }, { target: t }), h && Vn("ArrowDown", (b) => {
    s || Qt(d, c, b) || Ls(f, i);
  }, { target: t }), { currentIndex: f, last: y };
}
const gf = {
  name: "vu-multiple-select",
  inject: {
    vuMultipleSelectLabels: {
      default: () => ({
        noResults: "No results."
      })
    },
    vuDebug: {
      default: !1
    },
    vuInputComposition: {
      default: !1
    }
  },
  mixins: [Fe, Oe, vt, ze, Gn, Ee],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    search: {
      type: String,
      default: () => null
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
      required: !1,
      default: () => ""
    },
    user: {
      type: [Boolean, String],
      required: !1
    },
    searchField: {
      type: [Boolean, String],
      required: !1
    },
    searchIcon: {
      type: String,
      required: !1,
      default: () => "search"
    },
    customBadgeGroups: {
      type: [void 0, Object],
      default: () => {
      }
    },
    userBigBadges: {
      type: [Boolean, String],
      required: !1
    },
    maxVisible: {
      type: Number,
      default: () => 5
    },
    maxSelectable: {
      type: Number,
      default: () => Number.POSITIVE_INFINITY
    },
    caseSensitive: {
      type: [Boolean, String],
      default: !1
    },
    preserveSearchOnBlur: {
      type: [Boolean, String],
      default: !1
    },
    preserveSearchOnItemClick: {
      type: [Boolean, String],
      default: !1
    },
    preserveSearchOnItemKeyboard: {
      type: [Boolean, void 0],
      default: void 0
    },
    noLocalFiltering: {
      type: Boolean,
      default: !1
    },
    disableUnselectionWithinOptions: {
      type: Boolean,
      default: !1
    },
    keepFocusOnInputOnItemClick: {
      type: Boolean,
      default: !1
    },
    showClearIconWhenText: {
      type: [Boolean, String],
      default: !1
    },
    keepFocusOnInputOnItemKeyboard: {
      type: [Boolean, void 0],
      default: void 0
    },
    rounded: {
      type: [Boolean, String],
      default: !1
    },
    singleLine: {
      type: [Boolean, String],
      default: !1
    },
    minInputWidth: {
      type: [Boolean, Number],
      default: 200
    },
    roundedBadges: {
      default: !1
    },
    alternateBadges: {
      default: !1
    },
    badgesColor: {
      required: !1,
      default: () => {
      }
    },
    hideNoResults: {
      required: !1,
      type: [Boolean, String]
    },
    ignoreEscapeKey: {
      type: [Boolean, String],
      default: !1
    },
    allowKeyboardBadgesNavWhenText: {
      type: [Boolean, String],
      default: !1
    },
    openDropdownOnFocus: {
      type: [Boolean, String],
      default: !0
    }
  },
  expose: ["focus", "toggle", "close"],
  emits: ["search", "update:modelValue", "notify:already-selected", "update:search"],
  data: () => ({
    open: !1,
    pick: os,
    inputInFocus: !1,
    positioned: !0,
    intxObs: null,
    localSearch: "",
    keyIndexItems: -1,
    lastItemChange: -1,
    keyIndexBadges: -1,
    lastBadgeChange: -1,
    bottom: 40,
    top: !1,
    resizeObs: null,
    uid: gt(),
    scrollbarVisible: !1,
    badgesRefs: {},
    inputWidth: null,
    minimizeInput: !1,
    stopInputMinWidth: () => {
    }
  }),
  created() {
    this.resizeObs = new ResizeObserver((e) => {
      this.bottom = e[0].contentRect.height + 4;
    });
  },
  mounted() {
    this.$refs.searchfield && this.resizeObs.observe(this.$refs.searchfield);
    const { width: e, left: n } = on(this.$refs.searchbox), { left: t } = on(this.$refs.input), i = Y(() => this.hasClearIcon);
    this.minInputWidth !== !1 && (this.stopInputMinWidth = xn([i, t], ([a]) => {
      const d = t.value - n.value;
      let c = e.value - d - ((a || this.searchField) && 38 || 0) - 1;
      c < this.minInputWidth && (c = e - 4), this.inputWidth = c, this.minimizeInput = !1;
    }, { throttle: 10 })), this.target && (this.intxObs = new IntersectionObserver(() => {
      this.intxObs.unobserve(this.$refs.dropdown);
      const a = this.target.getBoundingClientRect(), d = this.$refs.dropdown.getBoundingClientRect();
      a.bottom < d.bottom && (this.top = !0), this.positioned = !0;
    }, {
      root: this.target,
      threshold: 1
    }));
    const o = Ds({
      disabled: this.disabled,
      items: Y(() => this.innerOptions),
      target: this.$refs.input,
      debug: this.vuDebug
    });
    this.lastItemChange = o == null ? void 0 : o.last, this.keyIndexItems = o == null ? void 0 : o.currentIndex;
    const s = Ds({
      disabled: this.disabled,
      items: Y(() => {
        var a;
        return this.searchField ? ((a = this.customBadgeGroups) == null ? void 0 : a.length) && this.customBadgeGroups || this.badgeGroups : this.modelValue;
      }),
      target: this.$refs.input,
      debug: this.vuDebug
    }, {
      direction: "horizontal",
      discardWhenValue: !this.allowKeyboardBadgesNavWhenText,
      discardWhenCaretInBetween: !0,
      preserveIndexOnRemoval: !0
    });
    this.keyIndexBadges = s == null ? void 0 : s.currentIndex, this.lastBadgeChange = s == null ? void 0 : s.last;
  },
  watch: {
    getSearch(e) {
      this.executeSearch(e);
    },
    keyIndexItems(e) {
      var s, a, d, c;
      const n = ((a = (s = this.$refs) == null ? void 0 : s.selectOptions) == null ? void 0 : a.liRefs) || [], t = ((d = this.innerOptions[e]) == null ? void 0 : d.value) || -1, i = n[t], o = (c = this.$refs.scroller) == null ? void 0 : c.$el;
      if (o)
        if (i) {
          const r = i.offsetTop + i.clientHeight;
          (r > o.scrollTop + o.clientHeight || r < o.scrollTop) && (o == null || o.scrollTo({ top: i.offsetTop }));
        } else
          t === -1 && o.scrollTo({ top: 0 });
    },
    open: {
      handler(e) {
        var n;
        e && !this.ignoreEscapeKey ? this.keyboardListener = fe((n = this.$refs) == null ? void 0 : n.input, "keyup", (t) => {
          t.code === "Escape" && (this.close(), t.preventDefault(), t.stopPropagation(), this.keyIndexItems = -1);
        }) : this.keyboardListener();
      }
    },
    isActive(e) {
      !e && this.singleLine && this.scrollbarVisible && this.$refs && this.$refs.searchfield && this.$refs.autocomplete.scrollTo({ left: 0, behavior: "instant" });
    },
    keyIndexBadges(e) {
      var n;
      if (this.singleLine && this.scrollbarVisible && e >= -1)
        if (e === -1) {
          const { offsetLeft: t } = (n = this.$refs) == null ? void 0 : n.input;
          this.$refs.autocomplete.scrollTo({ left: t, behavior: "instant" });
        } else {
          const t = this.keyboardNavigationItems[e], i = this.badgesRefs[typeof t == "string" ? t : t.value], { scrollLeft: o } = i;
          this.$refs.autocomplete.scrollTo({ left: o, behavior: "smooth" });
        }
    },
    modelLength: {
      // eslint-disable-next-line object-shorthand
      handler: function() {
        this.minInputWidth !== !1 && (this.minimizeInput = !0, this.inputWidth = !1);
      },
      immediate: !0
    },
    minInputWidth(e) {
      e === !1 && (this.stopInputMinWidth(), this.minimizeInput = !1, this.inputWidth = !1);
    }
  },
  computed: {
    hasClearIcon() {
      var e;
      return this.maxSelectable === 1 && !this.user && ((e = this.value) == null ? void 0 : e.length) || this.showClearIconWhenText && this.search !== "";
    },
    getSearch() {
      return this.search !== null ? this.search : this.localSearch;
    },
    searchLengthMet() {
      return this.getSearch.length >= this.minSearchLength;
    },
    innerOptions() {
      return this.searchLengthMet ? this.noLocalFiltering ? this.options : this.caseSensitive ? this.options.filter((e) => e.label.includes(this.getSearch) || e.value.includes(this.getSearch)) : this.options.filter((e) => e.label.toLowerCase().includes(this.getSearch.toLowerCase()) || e.value.toLowerCase().includes(this.getSearch.toLowerCase())) : [];
    },
    keyboardNavigationItems() {
      var e;
      return this.searchField ? ((e = this.customBadgeGroups) == null ? void 0 : e.length) && this.customBadgeGroups || this.badgeGroups : this.modelValue;
    },
    innerOptionsLength() {
      return this.innerOptions.length;
    },
    noResults() {
      return this.options && this.innerOptions.length === 0 && this.searchLengthMet && !this.$slots.optionsHeader;
    },
    values() {
      return (this.value || []).map((e) => e.value);
    },
    dropdownHeight() {
      return this.$slots.optionsHeader ? "auto" : this.noResults ? this.$slots.noResults || this.hideNoResults ? "auto" : this.itemHeight : this.innerOptionsLength > this.maxVisible ? this.itemHeight * ((this.innerOptionsLength === this.maxVisible ? 0 : 0.5) + this.maxVisible) : this.itemHeight * this.innerOptionsLength;
    },
    hideOverflow() {
      return this.itemHeight * this.innerOptionsLength === this.dropdownHeight;
    },
    isActive() {
      return this.inputInFocus || this.open;
    },
    keepFocusKeyboard() {
      return this.keepFocusOnInputOnItemKeyboard !== void 0 ? this.keepFocusOnInputOnItemKeyboard : this.keepFocusOnInputOnItemClick;
    },
    preserveSearchKeyboard() {
      return this.preserveSearchOnItemKeyboard !== void 0 ? this.preserveSearchOnItemKeyboard : this.preserveSearchOnItemClick;
    },
    badgeGroups() {
    },
    modelLength() {
      var e;
      return (e = this.modelValue) == null ? void 0 : e.length;
    }
  },
  methods: {
    checkScrollbar() {
      var t;
      const { scrollHeight: e = 0, clientHeight: n = 0 } = (t = this.$refs) == null ? void 0 : t.searchfield;
      this.scrollbarVisible = e > n;
    },
    executeSearch(e) {
      this.$emit("search", e), e && !this.open && this.openAndIntersect();
    },
    toggle(e, { fromOptionsClick: n = !1, fromOptionsKeyboard: t = !1 } = { fromOptionsClick: !1, fromOptionsKeyboard: !1 }) {
      if (this.disabled || e.disabled)
        return;
      const i = this.value || [];
      let o = i.findIndex((s) => s.value === e.value);
      if (this.values.includes(e.value))
        if (this.maxSelectable === 1)
          this.$emit("update:modelValue", []);
        else if ((n || t) && this.disableUnselectionWithinOptions)
          this.$emit("notify:already-selected", e);
        else {
          const s = i.slice();
          if (this.badgeGroups) {
            const { valueValue: a } = e;
            s.splice(i.findIndex(({ value: d }) => d === a), 1), o = i.findIndex((d) => d.value === e.value);
          }
          s.splice(o, 1), this.$emit("update:modelValue", s);
        }
      else
        this.maxSelectable === 1 ? (this.$emit("update:modelValue", [e]), this.$emit("update:search", ""), this.localSearch = "", this.close()) : this.$emit("update:modelValue", i.concat([e]));
      (n || t) && ((n && this.keepFocusOnInputOnItemClick || t && this.keepFocusKeyboard) && this.$refs.input.focus(), (n && !this.preserveSearchOnItemClick || t && !this.preserveSearchKeyboard) && (this.$emit("update:search", ""), this.localSearch = ""));
    },
    getOption(e) {
      return this.options.find((n) => n.value === e) || {};
    },
    close() {
      this.open = !1, this.top = !1, this.positioned = !0, this.inputInFocus = !1, this.preserveSearchOnBlur || this.$emit("update:search", "");
    },
    async openAndIntersect() {
      if (this.searchLengthMet && !this.open && !this.disabled)
        if (this.target && ["scroll", "auto", "visible"].includes(window.getComputedStyle(this.target).overflowY)) {
          const e = this.target.getBoundingClientRect(), n = this.$refs.searchfield.getBoundingClientRect();
          !this.top && (this.maxVisible + 0.5) * this.itemHeight > e.bottom - n.bottom && (this.top = !0), this.open = !0;
        } else
          this.open = !0, this.positioned = !1, await new Promise((e) => setTimeout(e, 10)), await this.$nextTick(), this.intxObs.observe(this.$refs.dropdown);
    },
    beforeUnmount() {
      this.intxObs.disconnect(), delete this.intxObs;
    },
    onDelete(e) {
      var n;
      if (this.open && this.lastItemChange > this.lastBadgeChange) {
        if (this.keyIndexItems > -1) {
          const t = this.innerOptions[this.keyIndexItems];
          !(t != null && t.disabled) && this.values.includes(t.value) && (this.toggle(t, { fromOptionsKeyboard: !0 }), e.preventDefault());
        }
      } else
        this.keyIndexBadges > -1 && !((n = this.value[this.keyIndexBadges]) != null && n.disabled) && this.toggle(this.keyboardNavigationItems[this.keyIndexBadges]);
    },
    onEnter() {
      var e;
      this.open && this.lastItemChange > this.lastBadgeChange && this.keyIndexItems > -1 ? !((e = this.value[this.keyIndexBadges]) != null && e.disabled) && this.toggle(this.innerOptions[this.keyIndexItems], { fromOptionsKeyboard: !0 }) : this.open || (this.open = !0);
    },
    onInput(e) {
      const { target: n } = e;
      this.keyIndexBadges > -1 && (this.keyIndexBadges = -1), this.vuInputComposition || (n.composing = !1), this.$emit("update:search", n.value), this.localSearch = n.value;
    },
    focus() {
      var e, n;
      (n = (e = this.$refs) == null ? void 0 : e.input) == null || n.focus(), this.openDropdownOnFocus && this.openAndIntersect();
    }
  },
  components: { VuUserPicture: Ot, VuBadge: Hn, VuIconBtn: ue, VuScroller: Qe, VuSelectOptions: rs }
}, yf = {
  key: 0,
  class: "control-label"
}, bf = {
  key: 0,
  class: "label-field-required"
}, _f = {
  key: 1,
  style: { "line-height": "30px" }
}, wf = ["value", "disabled", "placeholder"], kf = { style: { "padding-top": "15px" } }, Sf = { class: "message" }, If = {
  key: 0,
  class: "multiple-select__no-results"
}, Cf = {
  key: 1,
  class: "form-control-helper-text"
};
function Bf(e, n, t, i, o, s) {
  const a = O("VuUserPicture"), d = O("VuIconBtn"), c = O("VuBadge"), r = O("VuSelectOptions"), h = O("vu-spinner"), f = O("VuScroller"), y = _e("click-outside");
  return l(), u("div", {
    class: k(["vu-multiple-select form-group", [
      e.classes,
      {
        "vu-multiple-select--rounded": t.rounded,
        "vu-multiple-select--single-line": t.singleLine,
        "vu-multiple-select--searchIcon": t.searchField
      }
    ]])
  }, [
    e.label.length ? (l(), u("label", yf, [
      X(w(e.label), 1),
      e.required ? (l(), u("span", bf, " *")) : p("", !0)
    ])) : p("", !0),
    H((l(), u("div", {
      ref: "searchfield",
      class: k(["select select-autocomplete", [{
        "dropdown-visible": e.open,
        "select-disabled": e.disabled,
        "single-select": t.maxSelectable === 1,
        "has-clear-icon": s.hasClearIcon,
        "has-search-icon": !s.hasClearIcon && t.searchField,
        "select--single-line": t.singleLine && s.isActive
      }]])
    }, [
      g("div", {
        ref: "searchbox",
        class: k(["autocomplete-searchbox", {
          "autocomplete-searchbox-active": s.isActive,
          disabled: e.disabled,
          "autocomplete-searchbox--user": t.user,
          "autocomplete-searchbox--user-big-badges": t.user && t.userBigBadges
        }]),
        onClick: n[9] || (n[9] = (b) => {
          t.maxSelectable === 1 && s.values.length || e.$refs.input.focus(), s.openAndIntersect(), s.checkScrollbar();
        })
      }, [
        t.user ? (l(!0), u(V, { key: 0 }, j(e.value, (b, _) => (l(), u("div", {
          key: `${e.uid}-tag-${b}`,
          class: k(["vu-user-badge", {
            "vu-user-badge--hovered": _ === e.keyIndexBadges
          }])
        }, [
          x(a, {
            id: b.value,
            src: b.src,
            size: "tiny"
          }, null, 8, ["id", "src"]),
          g("span", null, w(b.label), 1),
          x(d, {
            class: "vu-user-badge__close",
            icon: "close",
            size: "icon-smaller",
            onClick: (z) => s.toggle(b)
          }, null, 8, ["onClick"])
        ], 2))), 128)) : (l(!0), u(V, { key: 1 }, j(s.badgeGroups || t.customBadgeGroups || e.value, (b, _) => (l(), u("span", {
          key: `${e.uid}-tag-${typeof b == "string" ? b : b.value}`,
          ref_for: !0,
          ref: (z) => e.badgesRefs[typeof b == "string" ? b : b.value] = z,
          onClick: n[1] || (n[1] = (...z) => s.toggle && s.toggle(...z))
        }, [
          C(e.$slots, "badge", { value: b }, () => [
            t.maxSelectable !== 1 ? (l(), S(c, te({ key: 0 }, e.pick(b, ["disabled", "icon", "selectable", "selected", "togglable"]), {
              badge2: b.valueLabel,
              value: _ === e.keyIndexBadges,
              closable: "",
              icon: b.icon,
              rounded: b.rounded || t.roundedBadges,
              alternate: b.alternate || t.alternateBadges,
              color: b.badgeClass || t.badgesColor,
              text: t.searchField ? "" : b.label || b.text,
              onClick: n[0] || (n[0] = re(() => {
              }, ["stop"])),
              onClose: (z) => s.toggle(b)
            }), null, 16, ["badge2", "value", "icon", "rounded", "alternate", "color", "text", "onClose"])) : (l(), u("span", _f, w(b.label), 1))
          ], !0)
        ]))), 128)),
        s.values.length < t.maxSelectable ? (l(), u("input", {
          key: 2,
          value: s.getSearch,
          ref: "input",
          type: "text",
          class: k(["autocomplete-input", [e.minimizeInput && "minimized", t.minInputWidth === !1 && "var"]]),
          disabled: e.disabled,
          style: K([e.inputWidth && { width: `${e.inputWidth}px` }]),
          placeholder: s.values.length && t.shortPlaceholder ? t.shortPlaceholder : e.placeholder,
          onInput: n[2] || (n[2] = (...b) => s.onInput && s.onInput(...b)),
          onBlur: n[3] || (n[3] = () => {
            t.searchField || e.open || (e.inputInFocus = !1);
          }),
          onFocus: n[4] || (n[4] = (b) => e.inputInFocus = !0),
          onKeydown: n[5] || (n[5] = Ct((...b) => s.onDelete && s.onDelete(...b), ["delete", "backspace"])),
          onKeyup: n[6] || (n[6] = Ct(re((...b) => s.onEnter && s.onEnter(...b), ["stop"]), ["enter"])),
          onClick: n[7] || (n[7] = (b) => {
            s.openAndIntersect();
          })
        }, null, 46, wf)) : p("", !0),
        !s.hasClearIcon && t.searchField ? (l(), S(d, {
          key: 3,
          icon: t.searchIcon,
          class: "absolute! top-0 right-0 multiple-select__search-icon",
          onClick: n[8] || (n[8] = re((b) => s.executeSearch(), ["stop"]))
        }, null, 8, ["icon"])) : p("", !0)
      ], 2),
      s.hasClearIcon ? (l(), S(d, {
        key: 0,
        icon: "clear",
        class: "select__clear-icon",
        onClick: n[10] || (n[10] = re((b) => {
          t.searchField ? e.$emit("update:modelValue", []) : s.toggle(e.value[0]), e.$emit("update:search", "");
        }, ["stop"]))
      })) : p("", !0),
      e.open && s.searchLengthMet ? (l(), u("div", {
        key: 1,
        ref: "dropdown",
        class: k(["select-dropdown", [{ "select-dropdown--no-results": !t.hideNoResults && s.noResults, "select-dropdown--dropup": e.top, "rounded-lg": t.rounded }, e.contentClass]]),
        style: K([
          `height: ${s.dropdownHeight}${s.dropdownHeight !== "auto" ? "px" : ""}`,
          e.top ? `bottom: ${e.bottom}px` : "",
          e.positioned ? "" : "opacity: 0",
          e.contentStyle
        ])
      }, [
        x(f, {
          ref: "scroller",
          class: k({ "hide-scroller": s.hideOverflow }),
          "always-show": ""
        }, {
          default: M(() => {
            var b;
            return [
              C(e.$slots, "optionsHeader", {}, void 0, !0),
              H(x(r, {
                ref: "selectOptions",
                multiple: "",
                user: t.user || t.searchField && ((b = s.innerOptions) == null ? void 0 : b.some(({ login: _, userImgUrl: z }) => _ || z)),
                selected: e.value,
                options: s.innerOptions,
                "key-index": e.keyIndexItems,
                onClickItem: n[11] || (n[11] = (_) => s.toggle(_, { fromOptionsClick: !0 }))
              }, {
                default: M(({ item: _ }) => [
                  C(e.$slots, "default", { item: _ }, void 0, !0)
                ]),
                _: 3
              }, 8, ["user", "selected", "options", "key-index"]), [
                [Ve, s.searchLengthMet && !e.loading]
              ]),
              e.loading ? C(e.$slots, "loading", { key: 0 }, () => [
                g("ul", kf, [
                  g("li", Sf, [
                    x(h, { show: "" })
                  ])
                ])
              ], !0) : p("", !0),
              !e.loading && s.noResults ? C(e.$slots, "noResults", { key: 1 }, () => [
                t.hideNoResults ? p("", !0) : (l(), u("ul", If, [
                  g("li", null, w(s.vuMultipleSelectLabels.noResults), 1)
                ]))
              ], !0) : p("", !0)
            ];
          }),
          _: 3
        }, 8, ["class"])
      ], 6)) : p("", !0)
    ], 2)), [
      [y, function() {
        s.close();
      }]
    ]),
    (l(!0), u(V, null, j(e.errorBucket, (b, _) => (l(), u("span", {
      key: `${_}-error-${b}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, w(b), 1))), 128)),
    e.helper.length ? (l(), u("span", Cf, w(e.helper), 1)) : p("", !0)
  ], 2);
}
const Of = /* @__PURE__ */ A(gf, [["render", Bf], ["__scopeId", "data-v-46c2ad90"]]), $f = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Of
}, Symbol.toStringTag, { value: "Module" })), xf = {
  name: "vu-range",
  mixins: [Fe, cn, Oe, ze, Ee],
  props: {
    step: {
      type: Number,
      default: 1
    },
    showLabels: {
      type: Boolean,
      default: !0
    },
    customLabels: {
      type: Array,
      required: !1,
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
      immediate: !0,
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
    update(e, n) {
      if (this.disabled)
        return;
      let t, i;
      e === "lower" ? (i = Math.min(n, this.uppervalue), t = Math.max(n, this.uppervalue), i > t && (t = Math.min(t + this.step, this.max))) : (i = Math.min(n, this.lowervalue), t = Math.max(n, this.lowervalue), i > t && (i = Math.max(i - this.step, this.min))), this.lowervalue = i, this.uppervalue = t, this.$emit("update:modelValue", [this.lowervalue, this.uppervalue]);
    }
  }
}, Tf = {
  key: 0,
  class: "control-label"
}, Vf = {
  key: 0,
  class: "label-field-required"
}, Mf = ["disabled", "value", "min", "max", "step"], Pf = ["disabled", "value", "min", "max", "step"], Lf = { class: "vu-range__grey-bar" }, Df = {
  key: 0,
  class: "vu-range__labels-container"
}, Af = { class: "vu-range__left vu-range__left-label" }, Ff = { class: "vu-range__right vu-range__right-label" }, zf = {
  key: 1,
  class: "form-control-helper-text"
};
function Ef(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k(["form-group", e.classes])
  }, [
    e.label.length ? (l(), u("label", Tf, [
      X(w(e.label), 1),
      e.required ? (l(), u("span", Vf, " *")) : p("", !0)
    ])) : p("", !0),
    g("div", {
      class: k(["vu-range", { disabled: e.disabled }])
    }, [
      g("div", {
        onMouseup: n[2] || (n[2] = (...a) => s.commit && s.commit(...a)),
        class: "vu-range__inputs-container"
      }, [
        g("input", {
          disabled: e.disabled,
          onInput: n[0] || (n[0] = (a) => s.update("lower", parseFloat(a.target.value))),
          value: o.lowervalue,
          min: e.min,
          max: e.max,
          step: t.step,
          class: "slider vu-range__left",
          type: "range"
        }, null, 40, Mf),
        g("input", {
          disabled: e.disabled,
          onInput: n[1] || (n[1] = (a) => s.update("upper", parseFloat(a.target.value))),
          value: o.uppervalue,
          min: e.min,
          max: e.max,
          step: t.step,
          class: "slider vu-range__right",
          type: "range"
        }, null, 40, Pf),
        g("div", Lf, [
          g("div", {
            class: "vu-range__blue-bar",
            style: K(s.computedStyles)
          }, null, 4)
        ])
      ], 32),
      t.showLabels ? (l(), u("div", Df, [
        g("div", Af, w(s.minLabel), 1),
        g("div", Ff, w(s.maxLabel), 1),
        o.lowervalue !== e.min && o.uppervalue !== o.lowervalue ? (l(), u("div", {
          key: 0,
          class: "vu-range__lower-label",
          style: K("left: " + (o.lowervalue - e.min) / (e.max - e.min) * 100 + "%")
        }, w(s.lowerLabel), 5)) : p("", !0),
        o.uppervalue !== e.max ? (l(), u("div", {
          key: 1,
          class: "vu-range__upper-label",
          style: K("left: " + (o.uppervalue - e.min) / (e.max - e.min) * 100 + "%")
        }, w(s.upperLabel), 5)) : p("", !0)
      ])) : p("", !0)
    ], 2),
    (l(!0), u(V, null, j(e.errorBucket, (a, d) => (l(), u("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, w(a), 1))), 128)),
    e.helper.length ? (l(), u("span", zf, w(e.helper), 1)) : p("", !0)
  ], 2);
}
const Nf = /* @__PURE__ */ A(xf, [["render", Ef], ["__scopeId", "data-v-b2d8ce26"]]), Rf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nf
}, Symbol.toStringTag, { value: "Module" }));
function Fi() {
  return window ? !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) : !1;
}
const Hf = ["draggable"], jf = {
  key: 0,
  class: "section-header_indicator"
}, Uf = {
  name: "vu-section-header"
}, Wf = /* @__PURE__ */ Ae({
  ...Uf,
  props: /* @__PURE__ */ Bt({
    name: {},
    title: {},
    actions: {},
    dragged: { type: Boolean },
    dashed: { type: Boolean },
    draggable: { type: Boolean },
    sticked: { type: Boolean },
    disabled: { type: Boolean },
    noMargin: { type: Boolean },
    tabbed: { type: Boolean },
    selected: { type: Boolean },
    expandable: { type: Boolean },
    expanded: { type: Boolean },
    focused: { type: Boolean },
    reorderable: { type: Boolean },
    indicator: {}
  }, {
    expanded: { type: Boolean, default: !0 },
    expandedModifiers: {}
  }),
  emits: /* @__PURE__ */ Bt(["click", "click-title", "click-expander", "click-action", "dragstart", "dragleave", "dragover", "dragend"], ["update:expanded"]),
  setup(e, { emit: n }) {
    const t = e, i = n, o = nn(e, "expanded"), s = T(!1), a = T(!1), d = T(!1), c = Fi(), r = Te(Yt, c), h = Y(() => t.expanded !== void 0 ? t.expanded : o.value);
    function f() {
      o.value = !o.value;
    }
    function y(b, _ = !1) {
      const { target: z = {}, relatedTarget: B = {} } = b, { previousSibling: G, nextSibling: Q } = z;
      _ && B === G || B === Q || (a.value = !1);
    }
    return (b, _) => {
      const z = _e("tooltip");
      return l(), u("div", {
        class: k(["section-header", {
          "section-header--expandable": t.expandable,
          "section-header--active": t.selected,
          "section-header--focused": t.focused,
          "section-header--hover": s.value || a.value || d.value,
          "section-header--sticky": t.sticked,
          "section-header--reorder": t.reorderable,
          "section-header--disabled": t.disabled,
          "section-header--dashed": t.dashed,
          "is-target": t.noMargin,
          "section-header--dragged": t.dragged
        }]),
        draggable: t.draggable,
        onDragstart: _[8] || (_[8] = (B) => i("dragstart", B)),
        onDragleave: _[9] || (_[9] = (B) => i("dragleave", B)),
        onDragover: _[10] || (_[10] = (B) => i("dragover", B)),
        onDragend: _[11] || (_[11] = (B) => i("dragend", B)),
        onMouseenter: _[12] || (_[12] = (B) => s.value = !0),
        onMouseleave: _[13] || (_[13] = (B) => s.value = !1)
      }, [
        t.tabbed ? (l(), u("div", {
          key: 0,
          class: "section-header_tab",
          onMouseenter: _[0] || (_[0] = (B) => a.value = !0),
          onMouseleave: y
        }, null, 32)) : p("", !0),
        t.expandable ? (l(), u("div", {
          key: 1,
          class: k(["section-header_expander justify-center h-full", {
            "section-header_expander--open": h.value,
            "section-header_expander--hover": a.value
          }]),
          onClick: _[1] || (_[1] = (B) => {
            t.expandable && f(), i("click", B), i("click-expander", B);
          }),
          onMouseenter: _[2] || (_[2] = (B) => a.value = !0),
          onMouseleave: y
        }, [
          x(pe, {
            icon: "expand-right",
            class: "block vertical-middle h-full cursor-pointer",
            style: { "line-height": "38px", "font-size": "8px" },
            "within-text": !1
          })
        ], 34)) : p("", !0),
        g("h5", {
          class: "section-header_title flex flex-grow",
          onClick: _[3] || (_[3] = (B) => {
            t.expandable && f(), i("click", B), i("click-title", B);
          }),
          onMouseenter: _[4] || (_[4] = (B) => a.value = !0),
          onMouseleave: _[5] || (_[5] = (B) => y(B, !0))
        }, w(t.title), 33),
        t.reorderable ? p("", !0) : (l(), u(V, { key: 2 }, [
          t.actions ? (l(!0), u(V, { key: 0 }, j(t.actions, ({ icon: B, type: G, contentClass: Q, position: de, items: J, tooltip: L }, P) => (l(), u(V, { key: P }, [
            G !== "dropdownmenu" ? H((l(), S(ue, {
              key: 0,
              class: "flex-grow-0 flex-basis-[38px]",
              icon: B,
              color: "default-lean",
              onClick: (Z) => {
                var F;
                return i("click-action", (F = t.actions) == null ? void 0 : F[P]);
              }
            }, null, 8, ["icon", "onClick"])), [
              [Ve, !t.reorderable && q(r)],
              [z, L]
            ]) : (l(), S(rt, {
              key: 1,
              items: J,
              "content-class": Q,
              position: de,
              class: "flex-grow-0 flex-basis-38px",
              onOpen: _[6] || (_[6] = (Z) => d.value = !0),
              onClose: _[7] || (_[7] = (Z) => d.value = !1),
              onClickItem: (Z) => {
                i(
                  "click-action",
                  // @ts-expect-error props. required
                  t.actions[P],
                  Z
                );
              }
            }, {
              default: M(({ active: Z }) => [
                H(x(ue, te(
                  { icon: "chevron-down" },
                  t.selected && !t.expanded ? {
                    noActive: !0,
                    noHover: !0,
                    color: "secondary"
                  } : {
                    color: "default-lean"
                  },
                  { active: Z }
                ), null, 16, ["active"]), [
                  [Ve, !t.reorderable && (s.value || q(r)) || Z]
                ])
              ]),
              _: 2
            }, 1032, ["items", "content-class", "position", "onClickItem"]))
          ], 64))), 128)) : p("", !0)
        ], 64)),
        t.indicator ? C(b.$slots, "indicator", { key: 3 }, () => [
          t.indicator && !q(r) && !t.reorderable ? (l(), u("div", jf, [
            g("span", null, w(t.indicator), 1)
          ])) : p("", !0)
        ], !0) : p("", !0),
        t.reorderable ? C(b.$slots, "default", { key: 4 }, () => [
          t.reorderable ? (l(), S(ue, {
            key: 0,
            class: "flex section-header_reorder-handle",
            icon: "drag-grip",
            color: "default-lean",
            hover: s.value || a.value,
            noHover: t.focused
          }, null, 8, ["hover", "noHover"])) : p("", !0)
        ], !0) : p("", !0)
      ], 42, Hf);
    };
  }
}), zi = /* @__PURE__ */ A(Wf, [["__scopeId", "data-v-54b23a8a"]]), qf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: zi
}, Symbol.toStringTag, { value: "Module" })), Kf = {
  name: "vu-single-checkbox",
  mixins: [ze, Ee, Oe],
  inheritAttrs: !1,
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
      default: !1
    },
    // Optional
    // eslint-disable-next-line vue/require-default-prop
    icon: {
      type: String,
      required: !1
    },
    // Exclusive with Switch
    radio: {
      type: Boolean,
      required: !1
    },
    // Required by radio.
    // eslint-disable-next-line vue/require-default-prop
    group: {
      type: String,
      required: !1
    },
    // Required by radio
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String,
      required: !1
    },
    // Excludes radio
    switch: {
      type: Boolean,
      required: !1
    },
    // eslint-disable-next-line vue/require-default-prop
    id: {
      type: [String, Number],
      required: !1
    }
  },
  emits: ["update:modelValue"],
  data: () => ({ uid: gt() }),
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
  components: { VuIcon: pe }
}, Gf = ["type", "checked", "name", "value", "id", "disabled"], Yf = ["for"], Xf = { class: "vu-single-checkbox__inner-span" }, Jf = {
  key: 0,
  class: "vu-single-checkbox__extra-content"
};
function Zf(e, n, t, i, o, s) {
  const a = O("VuIcon");
  return l(), u("div", {
    class: k(["vu-single-checkbox", s.topClasses])
  }, [
    g("div", {
      class: k(["toggle", s.internalClasses])
    }, [
      g("input", te({
        class: "vu-single-checkbox__input",
        type: t.radio ? "radio" : "checkbox",
        checked: t.radio ? t.group === t.modelValue : t.modelValue
      }, e.$attrs, {
        name: t.radio ? t.group : void 0,
        value: t.radio ? t.value : void 0,
        id: e.$attrs[t.id] || `${e.uid}`,
        disabled: e.disabled,
        onClick: n[0] || (n[0] = (...d) => s.input && s.input(...d))
      }), null, 16, Gf),
      t.standalone ? p("", !0) : (l(), u(V, { key: 0 }, [
        g("label", {
          class: "control-label vu-single-checkbox__label",
          for: e.$attrs[t.id] || `${e.uid}`
        }, [
          t.icon ? (l(), S(a, {
            key: 0,
            icon: t.icon
          }, null, 8, ["icon"])) : p("", !0),
          g("span", Xf, w(t.label), 1)
        ], 8, Yf),
        C(e.$slots, "label-prepend", {}, void 0, !0)
      ], 64))
    ], 2),
    s.hasExtraContent ? (l(), u("div", Jf, [
      C(e.$slots, "default", {}, void 0, !0)
    ])) : p("", !0)
  ], 2);
}
const Qf = /* @__PURE__ */ A(Kf, [["render", Zf], ["__scopeId", "data-v-dd48d93f"]]), ep = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Qf
}, Symbol.toStringTag, { value: "Module" })), tp = {
  name: "vu-slider",
  mixins: [Fe, Oe, ze, Ee],
  props: {
    labels: {
      required: !1,
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
      default: !1
    },
    showLabels: {
      type: Boolean,
      default: !1
    },
    labelsBeneath: {
      type: Boolean,
      default: !1
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
    const { leftLabel: { offsetWidth: e = 0 } = {}, rightLabel: { offsetWidth: n = 0 } = {} } = this.$refs;
    this.labelsWidth = Math.max(e, n);
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
}, np = {
  key: 0,
  class: "control-label"
}, sp = {
  key: 0,
  class: "label-field-required"
}, ip = ["disabled", "value", "min", "max", "step"], op = {
  key: 0,
  class: "vu-slider__steps"
}, lp = {
  key: 1,
  class: "form-control-helper-text"
};
function ap(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k(["form-group", e.classes])
  }, [
    e.label.length ? (l(), u("label", np, [
      X(w(e.label), 1),
      e.required ? (l(), u("span", sp, " *")) : p("", !0)
    ])) : p("", !0),
    g("div", {
      class: k(["vu-slider", { disabled: e.disabled }])
    }, [
      g("div", {
        onMouseup: n[1] || (n[1] = (...a) => s.commit && s.commit(...a)),
        class: "vu-slider__container"
      }, [
        g("div", {
          ref: "leftLabel",
          class: "vu-slider__left vu-slider__label"
        }, w(t.showLabels ? t.labels.min : t.min), 513),
        g("div", {
          ref: "rightLabel",
          class: "vu-slider__right vu-slider__label"
        }, w(t.showLabels ? t.labels.max : t.max), 513),
        g("input", {
          class: "slider vu-slider__left",
          type: "range",
          disabled: e.disabled,
          value: e.innerValue,
          min: t.min,
          max: t.max,
          step: t.step,
          style: K(t.labelsBeneath ? {} : s.computedStyle),
          onInput: n[0] || (n[0] = (a) => s.update(parseFloat(a.target.value)))
        }, null, 44, ip),
        g("div", {
          class: "vu-slider__grey-bar",
          style: K({ left: s.labelsMargin, right: s.labelsMargin })
        }, [
          g("div", {
            class: "vu-slider__blue-bar vu-slider__blue-bar--left",
            style: K(s.innerBlueBarStyle)
          }, null, 4)
        ], 4)
      ], 32),
      t.stepped ? (l(), u("div", op, [
        (l(!0), u(V, null, j(s.steps, (a, d) => (l(), u("div", {
          key: d,
          class: "vu-slider__step",
          style: K(a.style)
        }, null, 4))), 128))
      ])) : p("", !0)
    ], 2),
    (l(!0), u(V, null, j(e.errorBucket, (a, d) => (l(), u("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, w(a), 1))), 128)),
    e.helper.length ? (l(), u("span", lp, w(e.helper), 1)) : p("", !0)
  ], 2);
}
const rp = /* @__PURE__ */ A(tp, [["render", ap], ["__scopeId", "data-v-c2dadf12"]]), up = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: rp
}, Symbol.toStringTag, { value: "Module" })), dp = {
  name: "vu-textarea",
  mixins: [Fe, Oe, ze, Ee],
  expose: "focus",
  props: {
    rows: {
      type: [Number, String],
      default: () => 2
    },
    name: {
      type: [String],
      required: !1
    },
    minlength: {
      type: Number,
      required: !1
    },
    maxlength: {
      type: Number,
      required: !1
    },
    readonly: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    },
    spellcheck: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    },
    wrap: {
      type: String,
      required: !1
    },
    autocomplete: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    },
    autocorrect: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    },
    autofocus: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    }
  },
  emits: ["update:modelValue"],
  inject: {
    isIos: {
      from: Qn
    }
  },
  methods: {
    focus() {
      var e, n;
      (n = (e = this.$refs) == null ? void 0 : e.textarea) == null || n.focus();
    }
  }
}, cp = {
  key: 0,
  class: "control-label"
}, hp = {
  key: 0,
  class: "label-field-required"
}, fp = ["value", "placeholder", "disabled", "name", "minlength", "maxlength", "readonly", "spellcheck", "rows", "wrap", "autocomplete", "autocorrect", "autofocus", "required"], pp = {
  key: 1,
  class: "form-control-helper-text"
};
function mp(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k(["form-group", [e.classes, { ios: s.isIos }]])
  }, [
    e.label.length ? (l(), u("label", cp, [
      X(w(e.label), 1),
      e.required ? (l(), u("span", hp, " *")) : p("", !0)
    ])) : p("", !0),
    g("textarea", {
      ref: "textarea",
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
      onInput: n[0] || (n[0] = (a) => e.$emit("update:modelValue", a.target.value))
    }, null, 40, fp),
    (l(!0), u(V, null, j(e.errorBucket, (a, d) => (l(), u("p", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, w(a), 1))), 128)),
    e.helper.length ? (l(), u("span", pp, w(e.helper), 1)) : p("", !0)
  ], 2);
}
const vp = /* @__PURE__ */ A(dp, [["render", mp], ["__scopeId", "data-v-f44c94fb"]]), gp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: vp
}, Symbol.toStringTag, { value: "Module" })), yp = { class: "list-item__thumbnail relative" }, bp = {
  key: 0,
  class: "absolute w-full h-full top-0"
}, _p = { class: "list-item__body" }, wp = { key: 0 }, kp = ["innerHTML"], Sp = {
  key: 0,
  class: "body__description"
}, Ip = {
  key: 0,
  class: "list-item__action-menu"
}, Cp = {
  name: "vu-thumbnail-list-item"
}, Bp = /* @__PURE__ */ Ae({
  ...Cp,
  props: {
    icon: { default: "" },
    iconColor: { default: "default" },
    iconSelectedColor: { default: "secondary" },
    scrollIntoView: { type: Boolean, default: !0 },
    forceScrollIntoView: { type: Boolean },
    title: { default: "" },
    rawTitle: {},
    imgUrl: {},
    unread: { type: Boolean, default: !1 },
    selected: { type: Boolean, default: !1 },
    description: {},
    actions: { default: () => [] },
    iconFill: { type: Boolean, default: !1 },
    value: { default: void 0 },
    lazyImage: { type: Boolean, default: !0 },
    actionsContentClass: {}
  },
  emits: ["click", "click-action", "actions-close", "actions-open"],
  setup(e, { emit: n }) {
    const t = e, i = n, o = Te(ci, "active"), s = T(null), a = T(null), d = T(null), c = T(!1);
    function r() {
      var f;
      s.value && ((f = s.value) != null && f.scrollIntoViewIfNeeded ? s.value.scrollIntoViewIfNeeded({ behavior: "smooth" }) : s.value.scrollIntoView({ block: "nearest" }));
    }
    Tn(() => t.selected, () => {
      t.scrollIntoView && r();
    }), Tn(() => t.forceScrollIntoView, r);
    function h({ target: f }) {
      var y, b, _, z;
      !((b = (y = a.value) == null ? void 0 : y.$el) != null && b.contains(f)) && !((z = (_ = d.value) == null ? void 0 : _.$el) != null && z.contains(f)) && i("click", t.value);
    }
    return $t(() => {
      (t.selected && t.scrollIntoView || t.forceScrollIntoView) && r();
    }), (f, y) => {
      const b = _e("tooltip");
      return l(), u("div", {
        ref_key: "container",
        ref: s,
        class: k(["vu-thumbnail-list-item", [{
          "menu-is-open": c.value,
          selected: f.selected,
          "with-unread-content": f.unread
        }]]),
        onClick: h
      }, [
        g("div", yp, [
          C(f.$slots, "thumbnail", {}, () => [
            f.icon ? (l(), u("div", {
              key: 0,
              class: k(["thumbnail__container", [{ "bg-grey-0": f.iconFill }]])
            }, [
              x(pe, {
                class: "thumbnail__icon",
                color: f.selected ? t.iconSelectedColor : t.iconColor,
                icon: f.icon
              }, null, 8, ["color", "icon"])
            ], 2)) : f.imgUrl ? (l(), S(at, {
              key: 1,
              src: f.imgUrl || "",
              lazy: f.lazyImage
            }, null, 8, ["src", "lazy"])) : p("", !0)
          ], !0),
          f.$slots.thumbnail__extra ? (l(), u("div", bp, [
            C(f.$slots, "thumbnail__extra", {}, void 0, !0)
          ])) : p("", !0)
        ]),
        g("div", _p, [
          C(f.$slots, "title", {
            isMenuOpen: c.value,
            listItemRef: s.value
          }, () => [
            f.title ? (l(), u("div", {
              key: 0,
              class: k(["body__title", [{
                "font-bold": f.unread,
                "!line-clamp-1": !!f.$slots.description || f.description
              }]])
            }, [
              f.rawTitle ? (l(), u("span", {
                key: 1,
                innerHTML: f.rawTitle
              }, null, 8, kp)) : (l(), u("span", wp, w(f.title), 1))
            ], 2)) : p("", !0)
          ], !0),
          C(f.$slots, "description", {}, () => [
            f.description ? (l(), u("div", Sp, w(f.description), 1)) : p("", !0)
          ], !0)
        ]),
        f.unread || f.actions.length ? (l(), u("div", Ip, [
          f.unread ? (l(), S(ue, {
            key: 0,
            class: "action-menu__unread-icon",
            "no-active": !0,
            "no-hover": "",
            icon: "record"
          })) : p("", !0),
          f.actions.length > 1 ? (l(), S(rt, {
            key: 1,
            ref_key: "actionMenu",
            ref: a,
            show: c.value,
            "onUpdate:show": y[0] || (y[0] = (_) => c.value = _),
            items: f.actions,
            side: "bottom-right",
            contentClass: f.actionsContentClass,
            onClickItem: y[1] || (y[1] = (_) => i("click-action", _)),
            onClose: y[2] || (y[2] = (_) => i("actions-close")),
            onOpen: y[3] || (y[3] = (_) => i("actions-open"))
          }, {
            default: M(() => [
              x(ue, {
                clickable: "",
                ref_key: "actionMenuActivator",
                ref: d,
                color: f.selected && "white" || "default-lean",
                class: k(["action-menu__action", c.value && q(o)]),
                icon: "chevron-down",
                active: c.value,
                "within-text": !1
              }, null, 8, ["color", "class", "active"])
            ]),
            _: 1
          }, 8, ["show", "items", "contentClass"])) : f.actions.length === 1 ? H((l(), S(ue, {
            key: 2,
            ref_key: "actionMenu",
            ref: a,
            clickable: "",
            color: f.selected && "white" || void 0,
            class: "action-menu__action",
            icon: f.actions[0].fonticon,
            active: c.value,
            "within-text": !1,
            onClick: y[4] || (y[4] = (_) => i("click-action", f.actions[0]))
          }, null, 8, ["color", "icon", "active"])), [
            [b, f.actions[0].text || f.actions[0].label]
          ]) : p("", !0)
        ])) : p("", !0),
        C(f.$slots, "hidden-content", {}, void 0, !0)
      ], 2);
    };
  }
}), cs = /* @__PURE__ */ A(Bp, [["__scopeId", "data-v-8917c06d"]]), Op = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cs
}, Symbol.toStringTag, { value: "Module" })), $p = ["name"], xp = { class: "section-header_title flex" }, Tp = ["onClick"], Vp = ["data-key"], Mp = ["data-key"], Pp = ["data-key"], Lp = {
  key: 0,
  class: "h-2px mt-2px border-drag-dash-5 border-blue-3 full-width"
}, Dp = ["data-key"], Ap = { key: 0 }, Fp = ["name"], zp = { class: "section-header_title flex" }, Ep = ["onClick"], Np = {
  name: "vu-thumbnail-grid"
}, Rp = /* @__PURE__ */ Ae({
  ...Np,
  props: {
    items: {},
    sections: {},
    pinSection: {},
    pinHeaders: { default: !0 },
    draggable: { default: !0 },
    labels: { default: () => ({
      dragHereToReorder: "Drag here to reorder"
    }) },
    dragBrowserShadow: {},
    dragShadowZIndex: { default: 1100 }
  },
  emits: ["click-header-action"],
  setup(e, { expose: n, emit: t }) {
    const i = e, o = t, s = T(null), a = (R) => {
      if (console.log(R), R === void 0)
        debugger;
      if (R === window)
        debugger;
    }, d = T(), c = T(), r = T(), h = T(), f = T(), y = T({ x: 0, y: 0 }), b = T(), { x: _, y: z } = ni(), B = Y(() => i.sections.map(({ name: R }) => i.items.filter(({ sectionId: oe }) => oe === R).length).reduce((R, oe) => oe > R ? oe : R)), G = Y(() => i.sections.filter(({ name: R }) => i.pinSection === R).pop()), Q = Y(() => G.value ? i.sections.filter((R) => R !== G.value) : i.sections);
    async function de(R, oe, he) {
      var we, Se;
      await Gt(), r.value = !0, h.value = { id: he.id };
      const { top: Ie, bottom: E, left: W, width: ee, height: ce } = (we = R == null ? void 0 : R.target) == null ? void 0 : we.getBoundingClientRect();
      y.value.x = -(_.value - W), y.value.y = 2, b.value = ee, (Se = i.dragBrowserShadow) != null && Se.value || R.dataTransfer.setDragImage(new Image(), 0, 0);
    }
    const J = Y(() => {
      var he, Ie, E, W, ee;
      if (!r.value && ((he = f.value) == null ? void 0 : he.length) === 0)
        return;
      const R = z.value + ((E = (Ie = d.value) == null ? void 0 : Ie.$el) == null ? void 0 : E.scrollTop), oe = (W = f.value) == null ? void 0 : W.map(({ offsetTop: ce }) => ce).reduce((ce, we) => Math.abs(we - R) < Math.abs(ce - R) ? we : ce, 0);
      return (ee = f.value) == null ? void 0 : ee.filter((ce) => ce.offsetTop === oe)[0];
    });
    function L(R) {
      r.value = !1, h.value = void 0, y.value = { x: 0, y: 0 }, b.value = 0;
    }
    n(
      { log: a }
    );
    const [P, Z] = sn(), [F, se] = sn();
    return $t(() => {
      c.value = !0;
    }), (R, oe) => {
      const he = O("vu-icon-btn"), Ie = _e("tooltip");
      return l(), u(V, null, [
        x(q(F), null, {
          default: M(({ item: E }) => [
            C(R.$slots, "section-header", { item: E }, () => [
              g("div", {
                class: "section-header",
                name: E.name
              }, [
                g("h5", xp, w(E.title), 1),
                g("a", {
                  class: "section-header_link flex cursor-pointer",
                  onClick: (W) => R.emits("click-header-link", W, E, E.linkTarget)
                }, w(E.link), 9, Tp),
                E.actions ? (l(!0), u(V, { key: 0 }, j(E.actions, ({ icon: W, tooltip: ee }) => H((l(), S(he, {
                  key: q(Ge)(),
                  icon: W,
                  onClick: (ce) => o("click-header-action", ce, E, W)
                }, null, 8, ["icon", "onClick"])), [
                  [Ie, ee]
                ])), 128)) : p("", !0)
              ], 8, $p)
            ], !0)
          ]),
          _: 3
        }),
        x(q(P), null, {
          default: M(({ item: E, index: W, items: ee }) => {
            var ce, we, Se, Me, Re, yt;
            return [
              g("div", {
                style: K({ "grid-column": W + 1, "grid-row": 1 })
              }, [
                R.pinHeaders ? p("", !0) : (l(), S(q(se), {
                  key: 0,
                  section: E
                }, null, 8, ["section"]))
              ], 4),
              r.value ? (l(), u("div", {
                key: 0,
                ref_key: "dragTargets",
                ref: f,
                "data-key": `__drag-header-${E.name}`,
                style: K({ "grid-column": W, "grid-row": 1 })
              }, null, 12, Vp)) : p("", !0),
              C(R.$slots, `section-drag-header-${E.name}`, qe(Xe({ section: E })), void 0, !0),
              E.reorderable && r.value ? (l(), u("div", {
                key: 1,
                ref_key: "dragTargets",
                ref: f,
                "data-key": `__first-${E.name}`
              }, null, 8, Mp)) : p("", !0),
              r.value ? C(R.$slots, "item-drop-placeholder", te({
                key: 2,
                dragData: h.value,
                show: ((Se = (we = (ce = J.value) == null ? void 0 : ce.attributes) == null ? void 0 : we["data-key"]) == null ? void 0 : Se.value) === `__first-${E.name}`
              }, { section: E }), () => {
                var Ce, me, xe;
                return [
                  ((xe = (me = (Ce = J.value) == null ? void 0 : Ce.attributes) == null ? void 0 : me["data-key"]) == null ? void 0 : xe.value) === `__first-${E.name}` ? (l(), u("div", {
                    key: 0,
                    class: "h-2px mt-2px border-drag-dash-5 border-blue-3 full-width",
                    style: K({ "grid-column": W, "grid-row": 1 })
                  }, null, 4)) : p("", !0)
                ];
              }, !0) : p("", !0),
              (l(!0), u(V, null, j(ee.filter((Ce) => Ce.sectionId === E.name), (Ce, me) => {
                var xe, bt, Vt, Xt;
                return l(), u(V, {
                  key: Ce.id
                }, [
                  x(cs, te({ ...Ce }, {
                    draggable: i.draggable,
                    onDragstart: (Pe) => de(Pe, E, Ce),
                    onDragend: oe[0] || (oe[0] = (Pe) => L()),
                    style: [{ "grid-column": W, "grid-row": me + 2 }, Ce.id === ((xe = h.value) == null ? void 0 : xe.id) && "opacity: 0.6"]
                  }), null, 16, ["draggable", "onDragstart", "style"]),
                  E.reorderable && r.value && Ce.id !== h.value.id ? (l(), u("div", {
                    key: 0,
                    ref_for: !0,
                    ref_key: "dragTargets",
                    ref: f,
                    "data-key": Ce.id
                  }, null, 8, Pp)) : p("", !0),
                  r.value ? C(R.$slots, "item-drop-placeholder", {
                    key: 1,
                    dragData: h.value,
                    show: ((Xt = (Vt = (bt = J.value) == null ? void 0 : bt.attributes) == null ? void 0 : Vt["data-key"]) == null ? void 0 : Xt.value) === Ce.id
                  }, () => {
                    var Pe, ut, Mt;
                    return [
                      ((Mt = (ut = (Pe = J.value) == null ? void 0 : Pe.attributes) == null ? void 0 : ut["data-key"]) == null ? void 0 : Mt.value) === Ce.id ? (l(), u("div", Lp)) : p("", !0)
                    ];
                  }, !0) : p("", !0)
                ], 64);
              }), 128)),
              r.value ? (l(), u("div", {
                key: 3,
                ref_key: "dragTargets",
                ref: f,
                "data-key": `__drag-footer-${E.name}`
              }, null, 8, Dp)) : p("", !0),
              C(R.$slots, `section-drag-footer-${E.name}`, qe(Xe({
                show: ((yt = (Re = (Me = J.value) == null ? void 0 : Me.attributes) == null ? void 0 : Re["data-key"]) == null ? void 0 : yt.value) === `drag-footer-${E.name}`,
                section: E,
                dragging: r.value,
                dragData: h.value
              })), void 0, !0),
              C(R.$slots, `section-footer-${E.name}`, {}, void 0, !0)
            ];
          }),
          _: 3
        }),
        g("div", {
          ref_key: "container",
          ref: s,
          class: "vu-thumbnail-list flex items-stretch full-width h-full flex-nowrap'"
        }, [
          R.pinSection ? (l(), u("div", Ap, [
            x(Qe, null, {
              default: M(() => [
                x(q(se), { item: G.value }, null, 8, ["item"]),
                x(q(Z), {
                  item: G.value,
                  index: 1,
                  items: R.items
                }, null, 8, ["item", "items"])
              ]),
              _: 1
            })
          ])) : p("", !0),
          g("div", null, [
            R.pinHeaders ? (l(), u("div", {
              key: 0,
              class: "grid",
              style: K({ "grid-template-columns": `repeat(${Q.value.length}, minmax(0, 1fr))` })
            }, [
              (l(!0), u(V, null, j(Q.value, (E, W) => C(R.$slots, "section-header", {
                key: E.name,
                section: E
              }, () => [
                g("div", {
                  class: "section-header",
                  name: E.name
                }, [
                  g("h5", zp, w(E.title), 1),
                  g("a", {
                    class: "section-header_link flex cursor-pointer",
                    onClick: (ee) => R.emits("click-header-link", ee, E, E.linkTarget)
                  }, w(E.link), 9, Ep),
                  E.actions ? (l(!0), u(V, { key: 0 }, j(E.actions, ({ icon: ee, tooltip: ce }) => H((l(), S(he, {
                    key: q(Ge)(),
                    icon: ee,
                    onClick: (we) => o("click-header-action", we, E, ee)
                  }, null, 8, ["icon", "onClick"])), [
                    [Ie, ce]
                  ])), 128)) : p("", !0)
                ], 8, Fp)
              ], !0)), 128))
            ], 4)) : p("", !0),
            x(Qe, {
              ref_key: "scroller",
              ref: d,
              class: k(["flex-grow", R.pinSection && "flex"])
            }, {
              default: M(() => [
                g("div", {
                  class: "vu=thumbnail-list__inner grid grid-gap-col-2",
                  style: K({
                    "grid-template-columns": `repeat(${Q.value.length}minmax(0, 1fr))`,
                    "grid-template-rows": `repeat(${B.value.value + 1}, minmax(0, 1fr))`
                  })
                }, [
                  (l(!0), u(V, null, j(Q.value, (E, W) => (l(), S(q(Z), {
                    key: E.name,
                    item: E,
                    index: W,
                    items: R.items
                  }, null, 8, ["item", "index", "items"]))), 128))
                ], 4)
              ]),
              _: 1
            }, 8, ["class"])
          ])
        ], 512)
      ], 64);
    };
  }
}), Hp = /* @__PURE__ */ A(Rp, [["__scopeId", "data-v-bf34cd6c"]]), jp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Hp
}, Symbol.toStringTag, { value: "Module" }));
function Up(e) {
  var n;
  const t = ie(e);
  return (n = t == null ? void 0 : t.$el) != null ? n : t;
}
const Ei = rn ? window : void 0;
function Ln(...e) {
  let n, t, i, o;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([t, i, o] = e, n = Ei) : [n, t, i, o] = e, !n)
    return Be;
  Array.isArray(t) || (t = [t]), Array.isArray(i) || (i = [i]);
  const s = [], a = () => {
    s.forEach((h) => h()), s.length = 0;
  }, d = (h, f, y, b) => (h.addEventListener(f, y, b), () => h.removeEventListener(f, y, b)), c = le(
    () => [Up(n), ie(o)],
    ([h, f]) => {
      if (a(), !h)
        return;
      const y = Qs(f) ? { ...f } : f;
      s.push(
        ...t.flatMap((b) => i.map((_) => d(h, b, _, y)))
      );
    },
    { immediate: !0, flush: "post" }
  ), r = () => {
    c(), a();
  };
  return lt(r), r;
}
const As = 1;
function Fs(e, n = {}) {
  const {
    throttle: t = 0,
    idle: i = 200,
    onStop: o = Be,
    onScroll: s = Be,
    offset: a = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventListenerOptions: d = {
      capture: !1,
      passive: !0
    },
    behavior: c = "auto",
    window: r = Ei
  } = n, h = T(0), f = T(0), y = Y({
    get() {
      return h.value;
    },
    set(P) {
      _(P, void 0);
    }
  }), b = Y({
    get() {
      return f.value;
    },
    set(P) {
      _(void 0, P);
    }
  });
  function _(P, Z) {
    var F, se, R;
    if (!r)
      return;
    const oe = ie(e);
    oe && ((R = oe instanceof Document ? r.document.body : oe) == null || R.scrollTo({
      top: (F = ie(Z)) != null ? F : b.value,
      left: (se = ie(P)) != null ? se : y.value,
      behavior: ie(c)
    }));
  }
  const z = T(!1), B = pt({
    left: !0,
    right: !1,
    top: !0,
    bottom: !1
  }), G = pt({
    left: !1,
    right: !1,
    top: !1,
    bottom: !1
  }), Q = (P) => {
    z.value && (z.value = !1, G.left = !1, G.right = !1, G.top = !1, G.bottom = !1, o(P));
  }, de = $n(Q, t + i), J = (P) => {
    var Z;
    if (!r)
      return;
    const F = P.document ? P.document.documentElement : (Z = P.documentElement) != null ? Z : P, { display: se, flexDirection: R } = getComputedStyle(F), oe = F.scrollLeft;
    G.left = oe < h.value, G.right = oe > h.value;
    const he = Math.abs(oe) <= 0 + (a.left || 0), Ie = Math.abs(oe) + F.clientWidth >= F.scrollWidth - (a.right || 0) - As;
    se === "flex" && R === "row-reverse" ? (B.left = Ie, B.right = he) : (B.left = he, B.right = Ie), h.value = oe;
    let E = F.scrollTop;
    P === r.document && !E && (E = r.document.body.scrollTop), G.top = E < f.value, G.bottom = E > f.value;
    const W = Math.abs(E) <= 0 + (a.top || 0), ee = Math.abs(E) + F.clientHeight >= F.scrollHeight - (a.bottom || 0) - As;
    se === "flex" && R === "column-reverse" ? (B.top = ee, B.bottom = W) : (B.top = W, B.bottom = ee), f.value = E;
  }, L = (P) => {
    var Z;
    if (!r)
      return;
    const F = (Z = P.target.documentElement) != null ? Z : P.target;
    J(F), z.value = !0, de(P), s(P);
  };
  return Ln(
    e,
    "scroll",
    t ? Qo(L, t, !0, !1) : L,
    d
  ), un(() => {
    const P = ie(e);
    P && J(P);
  }), Ln(
    e,
    "scrollend",
    Q,
    d
  ), {
    x: y,
    y: b,
    isScrolling: z,
    arrivedState: B,
    directions: G,
    measure() {
      const P = ie(e);
      r && P && J(P);
    }
  };
}
function In(e) {
  return typeof Window < "u" && e instanceof Window ? e.document.documentElement : typeof Document < "u" && e instanceof Document ? e.documentElement : e;
}
const Wp = {
  [Go.mounted](e, n) {
    if (typeof n.value == "function") {
      const t = n.value, i = Fs(e, {
        onScroll() {
          t(i);
        },
        onStop() {
          t(i);
        }
      });
    } else {
      const [t, i] = n.value, o = Fs(e, {
        ...i,
        onScroll(s) {
          var a;
          (a = i.onScroll) == null || a.call(i, s), t(o);
        },
        onStop(s) {
          var a;
          (a = i.onStop) == null || a.call(i, s), t(o);
        }
      });
    }
  }
};
function Ni(e) {
  const n = window.getComputedStyle(e);
  if (n.overflowX === "scroll" || n.overflowY === "scroll" || n.overflowX === "auto" && e.clientWidth < e.scrollWidth || n.overflowY === "auto" && e.clientHeight < e.scrollHeight)
    return !0;
  {
    const t = e.parentNode;
    return !t || t.tagName === "BODY" ? !1 : Ni(t);
  }
}
function qp(e) {
  const n = e || window.event, t = n.target;
  return Ni(t) ? !1 : n.touches.length > 1 ? !0 : (n.preventDefault && n.preventDefault(), !1);
}
const en = /* @__PURE__ */ new WeakMap();
function Kp(e, n = !1) {
  const t = T(n);
  let i = null, o;
  le(Un(e), (d) => {
    const c = In(ie(d));
    if (c) {
      const r = c;
      en.get(r) || en.set(r, o), t.value && (r.style.overflow = "hidden");
    }
  }, {
    immediate: !0
  });
  const s = () => {
    const d = In(ie(e));
    !d || t.value || (qt && (i = Ln(
      d,
      "touchmove",
      (c) => {
        qp(c);
      },
      { passive: !1 }
    )), d.style.overflow = "hidden", t.value = !0);
  }, a = () => {
    var d;
    const c = In(ie(e));
    !c || !t.value || (qt && (i == null || i()), c.style.overflow = (d = en.get(c)) != null ? d : "", en.delete(c), t.value = !1);
  };
  return lt(a), Y({
    get() {
      return t.value;
    },
    set(d) {
      d ? s() : a();
    }
  });
}
function Gp() {
  let e = !1;
  const n = T(!1);
  return (t, i) => {
    if (n.value = i.value, e)
      return;
    e = !0;
    const o = Kp(t, i.value);
    le(n, (s) => o.value = s);
  };
}
Gp();
function Yp(e, n) {
  const t = e.findIndex((i) => !n(i));
  return t >= 0 ? e.slice(0, t) : e;
}
function Xp(e, n) {
  const t = e.toReversed(), i = t.findIndex((o) => !n(o));
  return i >= 0 ? t.slice(0, i).reverse() : e;
}
const Jp = ["data-number", "data-id"], Zp = {
  key: 1,
  class: "v-spacer"
}, Qp = {
  key: 0,
  class: "h-drag-dash-2 blue-2 flex flex-grow w-full"
}, em = ["data-key"], tm = {
  key: 0,
  class: "h-drag-dash-2 blue-2 flex flex-grow w-full"
}, nm = ["data-id"], sm = ["data-id"], im = {
  key: 1,
  class: "h-drag-dash-2 item-drop blue-2 flex flex-grow w-full"
}, om = ["data-id"], lm = ["data-id"], am = {
  name: "vu-thumbnail-list"
}, rm = /* @__PURE__ */ Ae({
  ...am,
  props: /* @__PURE__ */ Bt({
    items: {},
    sections: {},
    selectedSections: {},
    labels: {},
    draggable: { type: Boolean, default: !0 },
    reorderableSections: { type: Boolean, default: !1 },
    stickyHeaders: { type: Boolean },
    expandableHeaders: { type: Boolean, default: !0 },
    itemHeight: { default: 44 },
    headerItemHeight: { default: 44 },
    dropZoneHeight: { default: 60 },
    dropZoneMargin: { default: 10 },
    dragOffset: { type: [Function, Boolean], default: !0 },
    restoreCollapsedOnReorderExit: { type: Boolean, default: !0 },
    options: { default: () => ({
      thumbnailDropMinDistance: 80,
      thumbnailFullscreenDropMinDistance: 220,
      sectionDropMinDistance: 80
    }) },
    showDelete: { default: [] },
    showDeleteOnAll: { type: Boolean, default: !1 },
    fullscreen: { type: Boolean, default: !1 },
    showEmptySectionDrop: { type: Boolean },
    showEmptySectionDropExcept: { default: [] },
    showItemDropzone: { type: Boolean },
    scrollToFirst: { type: Boolean }
  }, {
    modelValue: {
      default: []
    },
    modelModifiers: {},
    dragData: {
      default: {}
    },
    dragDataModifiers: {}
  }),
  emits: /* @__PURE__ */ Bt(["click-header-action", "drag-start-item", "drag-start", "drag-cancel", "drop-section", "drop-item", "drop-item-remove", "section-actions-menu-open", "section-actions-menu-close", "section-collapse", "section-expand", "item-click", "item-click-action", "item-actions-menu-open", "item-actions-menu-close", "item-mouseenter", "item-mouseleave", "item-contextmenu", "item-thumbnail-doubleclick"], ["update:modelValue", "update:dragData"]),
  setup(e, { expose: n, emit: t }) {
    let i;
    ((m) => {
      m[m.USER = 0] = "USER", m[m.PROGRAMMATICALLY = 1] = "PROGRAMMATICALLY";
    })(i || (i = {}));
    const o = e, s = t, a = "ANY", d = T({
      moveHere: "Move here",
      moveSectionHere: "Move here",
      removeFrom: "Remove"
    }), c = wo(), r = nn(e, "modelValue"), h = nn(e, "dragData"), f = T(null), y = T({}), b = T({}), _ = T([]), z = T([]), B = T(), { top: G, left: Q } = on(B), de = T(!1);
    function J(m) {
      const { isScrolling: I } = m;
      de.value = I.value;
    }
    const L = Y(() => {
      var m;
      return ((m = o.sections) == null ? void 0 : m.map(({ name: I }) => I)) || {};
    }), P = T(!1), Z = T(!1), F = T({}), se = T(), { x: R, y: oe } = ni({ scroll: !1 }), he = T(), Ie = T();
    function E(m) {
      var U, ne, D;
      const I = m.target.cloneNode(!0);
      I.classList += " dragged", I.classList.remove("selected"), (U = I.classList) != null && U.contains("section-header") && I.classList.remove(".section-header--dragged");
      const { width: v, left: $ } = m.target.getBoundingClientRect();
      I.style.width = `${v}px`, I.style.opacity = "0.6", I.style.position = "absolute", I.style.left = "-5000px", I.style.top = "-1000px", I.style.zIndex = "10000", vs.value = I, document.body.appendChild(I);
      let N = 0;
      typeof o.dragOffset == "function" ? N = o.dragOffset(m) : o.dragOffset === !0 && (N = (m == null ? void 0 : m.clientX) - $, (ne = m.dataTransfer) == null || ne.setDragImage(I, N, 0)), (D = m.dataTransfer) == null || D.setData("text/plain", " ");
    }
    function W(m) {
      m != null && m.dataTransfer && (m.dataTransfer.dropEffect = "none"), m.preventDefault(), m.stopPropagation();
    }
    function ee(m) {
      m != null && m.dataTransfer && (m.dataTransfer.dropEffect = "move"), m.preventDefault();
    }
    function ce(m, I, v) {
      o.draggable && (P.value = !0, F.value = { id: I.id, section: v, thumbnail: I }, m.dataTransfer.effectAllowed = "move", m.dataTransfer.dropEffect = "move", E(m), s("drag-start"), s("drag-start-item", F.value));
    }
    function we(m, I) {
      Z.value = !0, F.value = { section: I, thumbnail: void 0 }, m.dataTransfer.effectAllowed = "move", m.dataTransfer.dropEffect = "move", E(m), s("drag-start");
    }
    const Se = T(!1);
    function Me(m, I) {
      var v, $, N, U;
      if (P.value) {
        if (I && !(!I.accept || ((v = I == null ? void 0 : I.accept) == null ? void 0 : v.includes(a)) || ((N = ($ = F.value) == null ? void 0 : $.thumbnail) == null ? void 0 : N.type) && ((U = I.accept) == null ? void 0 : U.includes(F.value.thumbnail.type)))) {
          m != null && m.dataTransfer && (m.dataTransfer.dropEffect = "none");
          return;
        }
        Se.value = !0, m != null && m.dataTransfer && (m.dataTransfer.dropEffect = "move");
      }
    }
    function Re(m) {
      Se.value = !1, he.value && (m != null && m.dataTransfer) && (m.dataTransfer.dropEffect = "move");
    }
    function yt({ x: m, y: I }, v, $ = Number.POSITIVE_INFINITY, N = "y") {
      const { key: U, id: ne } = (v == null ? void 0 : v.map((D) => {
        var Ft, ke, $e, Ne;
        D = (D == null ? void 0 : D.$el) || D;
        const { offsetLeft: ae, offsetHeight: ve, offsetTop: ye, attributes: { "data-id": Le, "data-key": it, clientWidth: yn } = {} } = D;
        let Lt = ye, Dt = ae;
        (ke = (Ft = D == null ? void 0 : D.parentElement) == null ? void 0 : Ft.classList) != null && ke.contains("vu-thumbnail-list-item") && (Dt += D.parentElement.offsetLeft, Lt += D.parentElement.offsetTop);
        let wt;
        const Jt = (Ne = ($e = B.value) == null ? void 0 : $e.$el) == null ? void 0 : Ne.scrollTop, At = Lt - Jt;
        switch (N) {
          case "y":
            wt = Math.abs(At - I);
            break;
          case "both":
            wt = Math.sqrt((At - I) ** 2 + (Dt - m) ** 2);
        }
        return {
          distance: wt,
          key: it == null ? void 0 : it.value,
          id: Le == null ? void 0 : Le.value
        };
      }).filter(({ distance: D }) => D < $).reduce((D, ae) => ae.distance < D.distance ? ae : D, { distance: Number.POSITIVE_INFINITY, key: void 0, id: void 0 })) || {};
      return U || ne ? v == null ? void 0 : v.find((D) => {
        D = (D == null ? void 0 : D.$el) || D;
        const { attributes: ae } = D, { "data-key": ve = { value: "_noValue" }, "data-id": ye = { value: "_noId" } } = ae;
        return U === (ve == null ? void 0 : ve.value) || ne === (ye == null ? void 0 : ye.value);
      }) : void 0;
    }
    xn([P, se, oe, R, Se], () => {
      if (!P.value) {
        he.value = void 0;
        return;
      }
      if (de.value)
        return;
      if (Se.value) {
        he.value = void 0;
        return;
      }
      const m = oe.value - G.value, I = R.value - Q.value;
      he.value = yt({ y: m, x: I }, se.value, Ce.value, o.fullscreen ? "both" : "y");
    }, { throttle: 120 }), xn([Z, se, oe], () => {
      if (!Z.value) {
        Ie.value = void 0;
        return;
      }
      if (de.value)
        return;
      const m = oe.value - G.value;
      Ie.value = yt({ x: 0, y: m }, se.value, o.options.sectionDropMinDistance);
    }, { throttle: 120 });
    const Ce = Y(() => o.fullscreen ? o.options.thumbnailFullscreenDropMinDistance : o.options.thumbnailDropMinDistance), me = Y(() => {
      var v, $, N, U, ne, D;
      const m = (N = ($ = (v = he.value) == null ? void 0 : v.attributes) == null ? void 0 : $["data-id"]) == null ? void 0 : N.value, I = (D = (ne = (U = he.value) == null ? void 0 : U.attributes) == null ? void 0 : ne["data-number"]) == null ? void 0 : D.value;
      return m && (I ? Number(m) : m) || void 0;
    }), xe = Y(() => {
      var m, I, v;
      return (v = (I = (m = Ie.value) == null ? void 0 : m.attributes) == null ? void 0 : I["data-key"]) == null ? void 0 : v.value;
    }), bt = Y(() => {
      var m;
      return (m = o.sections) == null ? void 0 : m.filter(({ reorderable: I }) => I === !1);
    }), Vt = Y(() => Yp(o.sections, ({ reorderable: m }) => m === !1)), Xt = Y(() => Xp(o.sections, ({ reorderable: m }) => m === !1)), Pe = T();
    le(me, (m, I) => {
      var $;
      if (I === m)
        return;
      const v = ($ = m == null ? void 0 : m.toString().match(/(__collapsed-)(\w+)/)) == null ? void 0 : $[2];
      if (v) {
        const N = o.sections.find(({ name: U }) => U === v);
        _.value.includes(N) && (Pe.value = N, co());
      } else
        Pe.value = void 0, ho();
    });
    const ut = Y(() => {
      var m;
      if (P.value)
        return (m = o.items) == null ? void 0 : m.filter((I) => I.sectionId === F.value.thumbnail.sectionId);
    }), Mt = Y(() => {
      var m, I;
      return ((I = ut == null ? void 0 : ut.value) == null ? void 0 : I.indexOf((m = F.value) == null ? void 0 : m.thumbnail)) - 1 || 0;
    });
    function Pt(m) {
      var I;
      if (Mt.value !== -1)
        return ((I = ut.value) == null ? void 0 : I.indexOf(m)) === Mt.value;
    }
    function Qi(m) {
      return o.items.findLast((v) => m.sectionId === v.sectionId) === m;
    }
    function fs(m) {
      var I;
      if (Vt.value.includes(m) && ((I = Vt.value.slice(-1)) == null ? void 0 : I[0]) !== m)
        return !1;
      if (!Xt.value.includes(m))
        return !0;
    }
    function eo(m) {
      const I = xe.value;
      if (!I)
        return;
      const v = [...o.sections], $ = v.findIndex(({ name: U }) => U === I);
      return v.findIndex(({ name: U }) => U === m) === $ + 1;
    }
    function ps(m) {
      var N, U, ne, D, ae, ve, ye, Le;
      P.value = !1;
      const I = ((ne = (U = (N = m == null ? void 0 : m.target) == null ? void 0 : N.attributes) == null ? void 0 : U["data-id"]) == null ? void 0 : ne.value) || ((ye = (ve = (ae = (D = m == null ? void 0 : m.target) == null ? void 0 : D.parentElement) == null ? void 0 : ae.attributes) == null ? void 0 : ve["data-id"]) == null ? void 0 : ye.value);
      if (!I) {
        F.value = void 0;
        return;
      }
      const v = I.split("__remove-from-").pop(), $ = o.items.find(({ sectionId: it }) => it === name);
      s("drop-item-remove", m, {
        item: (Le = F.value) == null ? void 0 : Le.thumbnail,
        section: $,
        sectionId: v
      }), F.value = void 0;
    }
    function to() {
      io.value = void 0, ms.value = void 0, P.value = !1, Z.value = !1, F.value = void 0, vs.value = void 0, Se.value = !1, s("drag-cancel");
    }
    function hn(m) {
      var N, U, ne;
      let I = me.value;
      if (!P.value)
        return;
      if (((N = F.value) == null ? void 0 : N.id) === I || !I) {
        to();
        return;
      }
      I.toString().startsWith("__collapsed-") && (I = I.replace("__collapsed-", "__first-"));
      const v = o.items.find(({ id: D }) => D === I);
      P.value = !1, Se.value = !1;
      let $;
      if (v)
        $ = {
          item: v,
          index: ((U = o.items) == null ? void 0 : U.indexOf(v)) + 1
        };
      else {
        const D = I.split("__first-")[1];
        $ = {
          index: o.items.findIndex(({ sectionId: ve }) => ve === name) + 1 || 0,
          name: D
        };
      }
      s("drop-item", m, {
        // The item after which the element must be placed.
        // If empty, will be first element of section
        from: (ne = F.value) == null ? void 0 : ne.thumbnail,
        to: $
      }), F.value = void 0;
    }
    function no(m) {
      var $, N, U, ne, D, ae, ve, ye;
      P.value = !1, Se.value = !1;
      const I = ((U = (N = ($ = m == null ? void 0 : m.target) == null ? void 0 : $.attributes) == null ? void 0 : N["data-id"]) == null ? void 0 : U.value) || ((ve = (ae = (D = (ne = m == null ? void 0 : m.target) == null ? void 0 : ne.parentElement) == null ? void 0 : D.attributes) == null ? void 0 : ae["data-id"]) == null ? void 0 : ve.value);
      if (!I) {
        F.value = void 0;
        return;
      }
      const v = I.split("__empty-section-").pop();
      s(
        "drop-item",
        m,
        {
          from: (ye = F.value) == null ? void 0 : ye.thumbnail,
          to: {
            index: 0,
            name: v
          }
        }
      ), F.value = void 0;
    }
    function so(m) {
      var v, $;
      const I = xe.value;
      if (Z.value = !1, I) {
        const N = (v = o.sections) == null ? void 0 : v.findIndex(({ name: ne }) => ne === I), U = N !== -1 ? o.sections[N] : void 0;
        s("drop-section", m, {
          from: ($ = F.value) == null ? void 0 : $.section,
          // The item after which the element must be placed.
          // If empty, will be first element.
          to: {
            section: U,
            index: N
          }
        });
      }
      F.value = void 0;
    }
    const io = T(), ms = T(), vs = T();
    ko(() => {
      h.value = {
        dragData: F,
        dropThumbnailElement: he,
        dropSectionElement: Ie,
        dropThumbnailId: me,
        dropSectionId: xe
      };
    });
    const fn = T();
    T(), n({
      expandHeader: mn,
      expand: vn,
      collapse: bs
    });
    const [oo, gs] = sn(), [lo, ao] = sn();
    $t(() => {
      pn.value = !0, o.sections.map((m) => fs(m));
    });
    const He = Y(() => ({
      ...d.value,
      ...o.labels
    })), pn = T(!1);
    le(pn, () => {
      setTimeout(() => {
        pn.value = !1;
      }, 1);
    });
    function mn(m, { smooth: I = !0 } = {}) {
      const $ = y.value[m].offsetTop;
      let N;
      I && (N = { behavior: "smooth" }), B.value.$el.scrollTo({ top: $, ...N });
    }
    function ys(m) {
      o.reorderableSections || (_.value.includes(m) ? _.value.includes(m) && (vn(m.name, !0), o.stickyHeaders && mn(m.name)) : bs(m.name, !0));
    }
    function vn(m, I = !1) {
      if (o.reorderableSections)
        return;
      const v = o.sections.find(({ name: U }) => U === m);
      if (!v)
        return;
      const N = Object.entries(_.value).findIndex(([U, ne]) => ne.name === v.name);
      if (N !== -1) {
        _.value.splice(N, 1);
        const { name: U } = v;
        s(
          "section-expand",
          v,
          U,
          I ? 0 : 1
          /* PROGRAMMATICALLY */
        );
      }
    }
    function bs(m, I = !1) {
      const v = o.sections.find(({ name: ne }) => ne === m);
      if (!v || Object.entries(_.value).findIndex(([ne, D]) => D.name === v.name) !== -1)
        return;
      o.stickyHeaders && (b.value[m] = !1), _.value.push(v);
      const { name: U } = v;
      s(
        "section-collapse",
        v,
        U,
        I ? 0 : 1
        /* PROGRAMMATICALLY */
      );
    }
    le(() => o.reorderableSections, (m) => {
      o.restoreCollapsedOnReorderExit && (m ? z.value = [..._.value] : _.value = z.value), m && _.value.splice(0, (_ == null ? void 0 : _.value.length) || 0, ...o.sections);
    }, { immediate: !0 });
    const _t = dl(L);
    function _s(m) {
      const I = m.map(($) => o.sections.find(({ name: N }) => N === $)), v = I.filter(({ collapsed: $ }) => $ === !0);
      o.reorderableSections ? (o.restoreCollapsedOnReorderExit && v.length && z.value.push(...v), _.value.push(...I)) : _.value.push(...v);
    }
    le(() => o.sections, () => {
      var I;
      const m = (I = o.sections) == null ? void 0 : I.map(({ name: v }) => v);
      _s(m);
    }, { immediate: !0, once: !0 }), le([() => o.sections.length], () => {
      const m = o.sections, I = (m == null ? void 0 : m.map(({ name: U }) => U)) || [], v = _t != null && _t.value ? Array.from(_t == null ? void 0 : _t.value) : [], $ = v == null ? void 0 : v.filter((U) => !(I != null && I.includes(U))), N = I == null ? void 0 : I.filter((U) => !(v != null && v.includes(U)));
      $.map((U) => {
        o.restoreCollapsedOnReorderExit && delete z.value[U];
      }), N != null && N.length && _s(N);
    }, { deep: !0 });
    const gn = Y(() => {
      var m;
      return !o.selectedSections || ((m = o.selectedSections) == null ? void 0 : m.length) === 0;
    }), ro = Y(() => {
      var m, I;
      if (o.scrollToFirst)
        return (I = (m = o == null ? void 0 : o.sections) == null ? void 0 : m.map(({ name: v }) => {
          var N;
          const $ = (N = o == null ? void 0 : o.items) == null ? void 0 : N.findIndex(({ sectionId: U }) => U === v);
          return [v, $ > -1 ? $ : void 0];
        }).find(([, v]) => v > -1)) == null ? void 0 : I.map((v) => o.items[v]).pop();
    });
    Tn(() => o.selectedSections, () => {
      var m;
      if (!gn.value && ((m = o.selectedSections) != null && m[0])) {
        const I = () => {
          var $, N;
          let v = (N = ($ = y == null ? void 0 : y.value) == null ? void 0 : $[o.selectedSections[0].name]) == null ? void 0 : N.$el;
          return v = (v == null ? void 0 : v.nextElementSibling) || v, v ? (v != null && v.scrollIntoViewIfNeeded ? v.scrollIntoViewIfNeeded() : v.scrollIntoView({
            block: "nearest"
          }), !0) : !1;
        };
        I() || Gt(I);
      }
    }, { immediate: !0 });
    function uo(m) {
      return o.items.find(({ sectionId: I }) => I === m);
    }
    const { start: co, stop: ho, isPending: ws } = nl(() => {
      var m;
      (m = Pe.value) != null && m.name && (vn(Pe.value.name), Pe.value = void 0);
    }, 1e3);
    return (m, I) => (l(), u(V, null, [
      x(q(oo), null, {
        default: M(({ item: v }) => [
          (l(!0), u(V, null, j(m.items.filter(($) => $.sectionId === v.name), ($) => {
            var N, U, ne;
            return l(), u(V, {
              key: $.id
            }, [
              H(x(cs, te({ class: "relative" }, {
                ...$,
                selected: r.value.includes($),
                scrollIntoView: gn.value,
                forceScrollIntoView: m.scrollToFirst && $ === ro.value || $.forceScrollIntoView && !gn.value
              }, {
                draggable: o.draggable,
                class: {
                  "max-w-[280px]": m.fullscreen,
                  "m-t-[2px]": m.fullscreen,
                  dragging: P.value
                },
                style: [
                  $.id === ((N = F.value) == null ? void 0 : N.id) && "opacity: 0.6",
                  !m.fullscreen && Qi($) && "margin-bottom: 2px",
                  !m.fullscreen && me.value === $.id && "margin-bottom: 0"
                ],
                onClick: (D) => s("item-click", D, $),
                onClickAction: (D) => s("item-click-action", D, $.value),
                onDragstart: (D) => ce(D, $, v),
                onDragover: (D) => {
                  var ae;
                  P.value && me.value === $.id && $.id === ((ae = F.value) == null ? void 0 : ae.id) || !v.reorderableItems ? W(D) : P.value && !fn.value && me.value && ee(D);
                },
                onActionsOpen: (D) => s("item-actions-menu-open", $),
                onActionsClose: (D) => s("item-actions-menu-close", $),
                onMouseenter: (D) => s("item-mouseenter", D, $),
                onMouseleave: (D) => s("item-mouseleave", D, $),
                onContextmenu: (D) => s("item-contextmenu", D, $)
              }), qs({
                "hidden-content": M(() => {
                  var D, ae, ve, ye;
                  return [
                    v.reorderableItems && P.value && !Pt($) && !_.value.includes(v) && (!v.accept || (D = v == null ? void 0 : v.accept) != null && D.includes(a) || (ve = (ae = F.value) == null ? void 0 : ae.thumbnail) != null && ve.type && ((ye = v.accept) != null && ye.includes(F.value.thumbnail.type))) ? (l(), u("div", {
                      key: 0,
                      ref_for: !0,
                      ref_key: "dragTargets",
                      ref: se,
                      class: "drag-target absolute w-[1px] h-[1px] top-[50%] left-[50%]",
                      style: K(o.fullscreen && "left:100%; right:0;"),
                      "data-number": typeof $.id == "number" || "",
                      "data-id": $.id
                    }, null, 12, Jp)) : p("", !0)
                  ];
                }),
                _: 2
              }, [
                $.extraThumbnailIcon ? {
                  name: "thumbnail__extra",
                  fn: M(() => [
                    x(q(ao), qe(Xe({ extraIcon: $.extraThumbnailIcon, thumbnail: $, section: v })), null, 16)
                  ]),
                  key: "0"
                } : void 0
              ]), 1040, ["draggable", "class", "style", "onClick", "onClickAction", "onDragstart", "onDragover", "onActionsOpen", "onActionsClose", "onMouseenter", "onMouseleave", "onContextmenu"]), [
                [Ve, !((U = _.value) != null && U.includes(v))]
              ]),
              C(m.$slots, "item-drop-zone", te({
                dragData: F.value,
                show: me.value && me.value === $.id && me.value !== ((ne = F.value) == null ? void 0 : ne.id)
              }, { section: v, thumbnail: $, fullscreen: m.fullscreen }), () => {
                var D, ae, ve, ye, Le;
                return [
                  m.fullscreen && !_.value.includes(v) ? (l(), u(V, { key: 0 }, [
                    v.reorderableItems && P.value && !Pt($) && $.id !== ((D = F.value) == null ? void 0 : D.id) ? (l(), u("div", {
                      key: 0,
                      class: k(["v-drag-dash-2 blue-2 flex-basis-[2px] flex-grow-0 flex-shrink-0 h-[50px] self-stretch", {
                        invisible: me.value !== $.id,
                        "mt-[2px]": m.fullscreen
                      }])
                    }, null, 2)) : v.reorderableItems && P.value && (!Pt($) || $.id !== ((ae = F.value) == null ? void 0 : ae.id)) ? (l(), u("div", Zp)) : p("", !0)
                  ], 64)) : !m.fullscreen && m.showItemDropzone && me.value === $.id && !Pt($) ? (l(), S(kt, {
                    key: 1,
                    icon: "drag-drop",
                    dashed: "",
                    centered: "",
                    color: "blue",
                    "no-hover": "",
                    label: ((ve = He.value) == null ? void 0 : ve[`moveTo${q(dt)(v.name)}`]) || ((ye = He.value) == null ? void 0 : ye.moveHere),
                    onDrop: hn,
                    onDragover: Me,
                    onDragleave: Re
                  }, null, 8, ["label"])) : !m.fullscreen && !m.showItemDropzone && me.value === $.id && !Pt($) && !q(ws) ? (l(), u("div", {
                    key: 2,
                    class: k(["h-drag-dash-2 blue-2 flex flex-grow w-full", { invisible: $.id === ((Le = F.value) == null ? void 0 : Le.id) }])
                  }, null, 2)) : p("", !0)
                ];
              }, !0)
            ], 64);
          }), 128))
        ]),
        _: 3
      }),
      x(q(lo), null, {
        default: M(({ extraIcon: v, thumbnail: $, section: N }) => [
          x(pe, {
            icon: v,
            onClick: I[0] || (I[0] = re(() => {
            }, ["stop"])),
            onDblclick: (U) => s("item-thumbnail-doubleclick", v, $, N),
            style: { "z-index": "20", "font-size": "130%", "line-height": "40px", "vertical-align": "middle", height: "100%", width: "100%", margin: "0" }
          }, null, 8, ["icon", "onDblclick"])
        ]),
        _: 1
      }),
      g("div", te({
        ref_key: "container",
        ref: f,
        class: ["vu-thumbnail-list", { fullscreen: m.fullscreen }],
        onDragend: I[2] || (I[2] = (v) => {
          P.value ? hn(v) : Z.value && so(v);
        })
      }, m.$attrs), [
        H((l(), S(Qe, {
          ref_key: "scroller",
          ref: B
        }, {
          default: M(() => [
            (l(!0), u(V, null, j(m.sections, (v, $) => {
              var N, U, ne, D, ae, ve, ye, Le, it, yn, Lt, Dt, wt, Jt, At, Ft;
              return l(), u(V, {
                key: v.name
              }, [
                C(m.$slots, "section-header", { section: v }, () => {
                  var ke, $e, Ne, zt, Et, Nt, Rt;
                  return [
                    Z.value && $ === 0 && v.reorderable !== !1 ? (l(), u("div", {
                      key: 0,
                      ref_for: !0,
                      ref_key: "dragTargets",
                      ref: se,
                      class: "drag-section",
                      "data-key": "__first"
                    }, null, 512)) : p("", !0),
                    $ === 0 ? C(m.$slots, "section-drop-placeholder", {
                      key: 1,
                      dragData: F.value,
                      show: xe.value === "__first",
                      vBind: { section: v }
                    }, () => [
                      xe.value === "__first" ? (l(), u("div", Qp)) : p("", !0)
                    ], !0) : p("", !0),
                    x(zi, te({
                      ref_for: !0,
                      ref: (De) => y.value[v.name] = De,
                      name: v.name,
                      class: "section-header"
                    }, {
                      expandable: m.expandableHeaders,
                      expanded: !((ke = _.value) != null && ke.includes(v)),
                      tabbed: !m.reorderableSections && (($e = _.value) == null ? void 0 : $e.includes(v)) && r.value.some(({ sectionId: De }) => De === v.name),
                      title: v.title,
                      actions: v.actions,
                      indicator: v.indicator,
                      sticked: m.stickyHeaders,
                      reorderable: m.reorderableSections && !bt.value.includes(v),
                      disabled: m.reorderableSections && (((Ne = bt.value) == null ? void 0 : Ne.includes(v)) || Z.value && v.name === ((Et = (zt = F.value) == null ? void 0 : zt.section) == null ? void 0 : Et.name)),
                      dragged: Z.value && v.name === ((Rt = (Nt = F.value) == null ? void 0 : Nt.section) == null ? void 0 : Rt.name),
                      draggable: m.reorderableSections && !bt.value.includes(v),
                      dashed: Pe.value === v,
                      focused: ms.value === v
                    }, {
                      onDragover: re(() => {
                      }, ["prevent"]),
                      class: {
                        reorderable: m.reorderableSections,
                        "lesser-margin": Z.value && eo(v.name)
                      },
                      onClickExpander: (De) => ys(v),
                      onClickTitle: (De) => m.expandableHeaders ? ys(v) : m.stickyHeaders && mn(v.name),
                      onDragstart: (De) => we(De, v),
                      onMouseenter: (De) => fn.value = v,
                      onMouseleave: I[1] || (I[1] = (De) => fn.value = void 0)
                    }), null, 16, ["name", "class", "onClickExpander", "onClickTitle", "onDragstart", "onMouseenter"]),
                    Z.value && fs(v) ? (l(), u("div", {
                      key: 2,
                      ref_for: !0,
                      ref_key: "dragTargets",
                      ref: se,
                      class: "drag-section",
                      "data-key": v.name
                    }, null, 8, em)) : p("", !0),
                    C(m.$slots, "section-drop-placeholder", {
                      dragData: F.value,
                      show: Z.value && xe.value === v.name,
                      vBind: { section: v }
                    }, () => [
                      xe.value === v.name ? (l(), u("div", tm)) : p("", !0)
                    ], !0)
                  ];
                }, !0),
                P.value && _.value.includes(v) && !m.reorderableSections ? (l(), u("div", {
                  key: 0,
                  ref_for: !0,
                  ref_key: "dragTargets",
                  ref: se,
                  "data-id": `__collapsed-${v.name}`
                }, null, 8, nm)) : p("", !0),
                C(m.$slots, `item-drop-zone-empty-section-${v.name}`, qe(Xe({ section: v })), () => {
                  var ke, $e, Ne, zt, Et, Nt, Rt, De;
                  return [
                    !o.reorderableSections && o.showEmptySectionDrop && !((ke = m.showEmptySectionDropExcept) != null && ke.includes(v.name)) && !(($e = _.value) != null && $e.includes(v)) && !m.items.filter(({ sectionId: bn }) => bn === v.name).length ? (l(), S(kt, {
                      key: 0,
                      class: k([{ "w-[280px]": m.fullscreen }, "empty-dropzone"]),
                      ref_for: !0,
                      ref_key: "dragTargets",
                      ref: se,
                      icon: "drag-drop",
                      dashed: "",
                      centered: "",
                      color: "grey-light",
                      hoverClassName: "vu-dropzone--blue",
                      "no-hover": "",
                      "add-hover-class": !v.accept || ((Ne = v == null ? void 0 : v.accept) == null ? void 0 : Ne[0]) === a || P.value && ((Nt = v.accept) == null ? void 0 : Nt.includes((Et = (zt = F.value) == null ? void 0 : zt.thumbnail) == null ? void 0 : Et.type)),
                      "data-id": `__empty-section-${v.name}`,
                      label: ((Rt = He.value) == null ? void 0 : Rt[`moveToEmpty${q(dt)(v.name)}`]) || ((De = He.value) == null ? void 0 : De.moveHere),
                      onDrop: no,
                      onDragover: re((bn) => Me(bn, v), ["prevent", "stop"]),
                      onDragleave: re(Re, ["prevent", "stop"])
                    }, null, 8, ["class", "add-hover-class", "data-id", "label", "onDragover"])) : p("", !0)
                  ];
                }, !0),
                (!o.showEmptySectionDrop || o.showEmptySectionDrop && !((N = m.showEmptySectionDropExcept) != null && N.includes(v.name)) && m.items.filter(({ sectionId: ke }) => ke === v.name).length) && (!v.accept || ((U = v == null ? void 0 : v.accept) == null ? void 0 : U[0]) === a || (D = (ne = F.value) == null ? void 0 : ne.thumbnail) != null && D.type && ((ae = v.accept) != null && ae.includes(F.value.thumbnail.type))) && (v.reorderableItems || v.droppable) && P.value && F.value.thumbnail !== uo(v.name) && !_.value.includes(v) ? (l(), u(V, { key: 1 }, [
                  o.fullscreen ? p("", !0) : (l(), u("div", {
                    key: 0,
                    ref_for: !0,
                    ref_key: "dragTargets",
                    ref: se,
                    class: "drag-target",
                    "data-id": `__first-${v.name}`
                  }, null, 8, sm))
                ], 64)) : p("", !0),
                C(m.$slots, "item-drop-zone", te({ dragData: F.value }, { section: v }, {
                  show: P.value && me.value === `__first-${v.name}`,
                  vBind: { section: v }
                }), () => {
                  var ke, $e;
                  return [
                    !o.fullscreen && m.showItemDropzone && P.value && me.value === `__first-${v.name}` && !_.value.includes(v) ? (l(), S(kt, {
                      key: 0,
                      icon: "drag-drop",
                      dashed: "",
                      centered: "",
                      "no-hover": "",
                      color: "blue",
                      label: ((ke = He.value) == null ? void 0 : ke[`moveTo${q(dt)(v.name)}`]) || (($e = He.value) == null ? void 0 : $e.moveHere),
                      onDragover: re(Me, ["prevent"]),
                      onDragleave: re(Re, ["prevent"]),
                      onDrop: hn
                    }, null, 8, ["label"])) : !o.fullscreen && !m.showItemDropzone && P.value && me.value === `__first-${v.name}` && !_.value.includes(v) && !q(ws) ? (l(), u("div", im)) : p("", !0)
                  ];
                }, !0),
                m.fullscreen ? (l(), u("div", {
                  key: 2,
                  class: k(["flex flex-row flex-wrap gap-y-[6px] gap-x-[10px] m-l-[12px]", { "gap-x-[4px]": P.value && v.reorderableItems }])
                }, [
                  P.value && (v.reorderableItems || v.droppable) && (!v.accept || ((ve = v == null ? void 0 : v.accept) == null ? void 0 : ve[0]) === a || P.value && ((it = v.accept) != null && it.includes((Le = (ye = F.value) == null ? void 0 : ye.thumbnail) == null ? void 0 : Le.type))) && !_.value.includes(v) && (!o.showEmptySectionDrop || o.showEmptySectionDrop && !((yn = m.showEmptySectionDropExcept) != null && yn.includes(v.name)) && m.items.filter(({ sectionId: ke }) => ke === v.name).length) ? (l(), u("div", {
                    key: 0,
                    class: k(["mx-[1px] m-t-[2px] v-drag-dash-2 blue-2 flex-basis-[2px] flex-grow-0 flex-shrink-0 h-[50px] absolute left-[4px] self-stretch", {
                      invisible: !P.value || me.value !== `__first-${v.name}`
                    }]),
                    ref_for: !0,
                    ref_key: "dragTargets",
                    ref: se,
                    "data-id": `__first-${v.name}`
                  }, null, 10, om)) : p("", !0),
                  x(q(gs), qe(Xe({ item: v })), null, 16),
                  P.value && v.reorderableItems && F.value.section === v && (m.showDeleteOnAll || (Lt = m.showDelete) != null && Lt.includes(v.name)) ? (l(), S(kt, {
                    key: 1,
                    class: k(m.fullscreen && "m-y-0 w-[280px]"),
                    color: "red",
                    icon: "trash",
                    dashed: "",
                    centered: "",
                    noHover: !P.value,
                    "data-id": `__remove-from-${v.name}`,
                    label: ((Dt = He.value) == null ? void 0 : Dt[`removeFrom${q(dt)(v.name)}`]) || ((wt = He.value) == null ? void 0 : wt.removeFrom),
                    onDrop: ps,
                    onDragover: re(Me, ["prevent", "stop"]),
                    onDragleave: re(Re, ["prevent", "stop"])
                  }, null, 8, ["class", "noHover", "data-id", "label"])) : p("", !0)
                ], 2)) : (l(), S(q(gs), qe(te({ key: 3 }, { item: v })), null, 16)),
                q(c)[`item-drop-zone-section-footer-${v.name}`] && P.value ? (l(), u("div", {
                  key: 4,
                  ref_for: !0,
                  ref_key: "dragTargets",
                  ref: se,
                  "data-id": `__item-section-footer-${v.name}`
                }, null, 8, lm)) : p("", !0),
                C(m.$slots, `item-drop-zone-section-footer-${v.name}`, qe(Xe({
                  show: ((Ft = (At = (Jt = he.value) == null ? void 0 : Jt.attributes) == null ? void 0 : At["data-id"]) == null ? void 0 : Ft.value) === `drag-footer-${v.name}`,
                  section: v,
                  dragging: P.value,
                  dragData: F.value
                })), () => {
                  var ke, $e, Ne;
                  return [
                    P.value && !m.fullscreen && F.value.section === v && (m.showDeleteOnAll || (ke = m.showDelete) != null && ke.includes(v.name)) ? (l(), S(kt, {
                      key: 0,
                      color: "red",
                      icon: "trash",
                      dashed: "",
                      centered: "",
                      noHover: !P.value,
                      "data-id": `__remove-from-${v.name}`,
                      label: (($e = He.value) == null ? void 0 : $e[`removeFrom${q(dt)(v.name)}`]) || ((Ne = He.value) == null ? void 0 : Ne.removeFrom),
                      onDrop: ps,
                      onDragover: re(Me, ["prevent", "stop"]),
                      onDragleave: re(Re, ["prevent", "stop"])
                    }, null, 8, ["noHover", "data-id", "label"])) : p("", !0)
                  ];
                }, !0),
                C(m.$slots, `section-footer-${v.name}`, {}, void 0, !0)
              ], 64);
            }), 128))
          ]),
          _: 3
        })), [
          [q(Wp), [J, { throttle: 50 }]]
        ])
      ], 16)
    ], 64));
  }
}), um = /* @__PURE__ */ A(rm, [["__scopeId", "data-v-a1bc2e49"]]), dm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: um
}, Symbol.toStringTag, { value: "Module" })), cm = {
  key: 0,
  class: "control-label"
}, hm = {
  key: 0,
  class: "label-field-required"
}, fm = { key: 1 }, pm = ["value", "placeholder", "disabled"], mm = { class: "vu-time-picker__display form-control" }, vm = { class: "vu-time-picker__body" }, gm = { class: "vu-time-picker__hours" }, ym = ["value"], bm = { class: "vu-time-picker__minutes" }, _m = ["value"], wm = {
  key: 3,
  class: "form-control vu-time-picker__display",
  disabled: ""
}, km = {
  key: 4,
  class: "form-control-helper-text"
}, Sm = {
  name: "vu-time-picker",
  inheritAttrs: !1,
  mixins: [Fe, ze, Oe, Ee],
  props: {
    useNativeInput: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      minutes: "00",
      hours: "00",
      isPopoverOpen: !1
    };
  },
  watch: {
    modelValue(e) {
      const [n, t] = this.splitTime(e);
      this.hours = n, this.minutes = t;
    },
    minutes(e) {
      this.$emit("update:modelValue", `${this.hours}:${e}`);
    },
    hours(e) {
      this.$emit("update:modelValue", `${e}:${this.minutes}`);
    }
  },
  beforeMount() {
    const [e, n] = this.splitTime(this.modelValue);
    this.hours = e, this.minutes = n;
  },
  methods: {
    splitTime(e) {
      return e.split(":");
    },
    formatNumberForTime(e) {
      return e < 10 ? `0${e}` : `${e}`;
    }
  },
  components: { VuPopover: Ke, VuPopover: Ke }
}, Im = /* @__PURE__ */ Object.assign(Sm, {
  setup(e) {
    const n = Te("vuInputComposition", !1), t = Te(Yt, !1);
    return (i, o) => (l(), u("div", {
      class: k(["vu-time-picker form-group", i.classes])
    }, [
      i.label.length ? (l(), u("label", cm, [
        X(w(i.label) + " ", 1),
        i.required ? (l(), u("span", hm, " *")) : p("", !0)
      ])) : p("", !0),
      e.useNativeInput || q(t) ? (l(), u("div", fm, [
        g("input", te(i.$attrs, {
          value: i.value,
          placeholder: i.placeholder,
          disabled: i.disabled,
          type: "time",
          class: "vu-time-picker__display-native form-control",
          style: { width: "fit-content" },
          onInput: o[0] || (o[0] = ({ target: s }) => {
            q(n) || (s.composing = !1), i.$emit("update:modelValue", s.value);
          })
        }), null, 16, pm)
      ])) : i.disabled ? (l(), u("div", wm, [
        g("span", null, w(i.hours), 1),
        X(":"),
        g("span", null, w(i.minutes), 1)
      ])) : (l(), S(Ke, {
        key: 2,
        class: "vu-time-picker__popover",
        style: { width: "fit-content" },
        show: i.isPopoverOpen
      }, {
        body: M(() => [
          g("div", vm, [
            g("div", gm, [
              (l(!0), u(V, null, j([...Array(24).keys()], (s) => (l(), u("label", {
                key: s,
                class: k({ "vu-time-picker__hours--selected": i.hours === i.formatNumberForTime(s) })
              }, [
                g("span", null, w(i.formatNumberForTime(s)), 1),
                H(g("input", {
                  "onUpdate:modelValue": o[1] || (o[1] = (a) => i.hours = a),
                  type: "radio",
                  name: "hours",
                  value: i.formatNumberForTime(s)
                }, null, 8, ym), [
                  [Ss, i.hours]
                ])
              ], 2))), 128))
            ]),
            g("div", bm, [
              (l(!0), u(V, null, j([...Array(60).keys()], (s) => (l(), u("label", {
                key: s,
                class: k({ "vu-time-picker__minutes--selected": i.minutes === i.formatNumberForTime(s) })
              }, [
                g("span", null, w(i.formatNumberForTime(s)), 1),
                H(g("input", {
                  "onUpdate:modelValue": o[2] || (o[2] = (a) => i.minutes = a),
                  type: "radio",
                  name: "minutes",
                  value: i.formatNumberForTime(s)
                }, null, 8, _m), [
                  [Ss, i.minutes]
                ])
              ], 2))), 128))
            ])
          ])
        ]),
        default: M(() => [
          g("div", mm, [
            g("span", null, w(i.hours), 1),
            X(":"),
            g("span", null, w(i.minutes), 1)
          ])
        ]),
        _: 1
      }, 8, ["show"])),
      (l(!0), u(V, null, j(i.errorBucket, (s, a) => (l(), u("span", {
        key: `${a}-error-${s}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, w(s), 1))), 128)),
      i.helper.length ? (l(), u("span", km, w(i.helper), 1)) : p("", !0)
    ], 2));
  }
}), Cm = /* @__PURE__ */ A(Im, [["__scopeId", "data-v-cf359eaf"]]), Bm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cm
}, Symbol.toStringTag, { value: "Module" }));
function Om(e, n) {
  let t;
  for (let i = 0; i < n; i++)
    t = (e == null ? void 0 : e.parentElement) || t;
  return t ?? document.documentElement;
}
function $m(e) {
  const {
    enabled: n = !0,
    el: t,
    placeholder: i,
    class: o = "",
    ancestor: s = 0
  } = e || {}, a = T(!1), d = T(), c = T();
  let r = T([]), h = T(/* @__PURE__ */ new WeakMap());
  const f = T(0), y = Y(() => r.value.map((L) => h.value.get(L)).reduce((L, P) => L || P, !1)), b = Y(
    () => a.value === !1 && y.value
  );
  le(b, (J, L) => {
    s && _();
  }, { flush: "sync" }), le(b, (J, L) => {
    z(!!s);
  }, { flush: "post" });
  const _ = () => {
    if (d.value) {
      const J = _n(i);
      J && d.value.unobserve(J);
    }
  }, z = async (J) => {
    if (d.value) {
      J && await Gt();
      const L = _n(i);
      L && d.value.observe(L);
    }
  }, B = (J) => {
    let L = J[0].intersectionRatio;
    s ? b.value ? (a.value = L > f.value, f.value = L) : a.value = L === 1 : a.value = b.value ? L > 0 : L === 1;
  }, G = () => {
    if (n) {
      const J = _n(t);
      if (r.value = [], !J)
        return;
      c.value = new IntersectionObserver(
        (P) => {
          P.forEach(({ intersectionRatio: Z, target: F }) => {
            h.value.set(F, Z > 0);
          });
        }
      );
      let { nextElementSibling: L } = s ? Om(J, s) : J;
      if (s === 0)
        for (; L && (L == null ? void 0 : L.className.indexOf(o)) === -1; )
          r.value.push(L), c.value.observe(L), L = L == null ? void 0 : L.nextElementSibling;
      else if (L)
        for (; L && L.querySelectorAll(`.${o}`).length === 0; )
          r.value.push(L), c.value.observe(L), L = L == null ? void 0 : L.nextElementSibling;
      d.value = new IntersectionObserver(
        B,
        {
          threshold: 1
        }
      ), z(b.value);
    }
  }, Q = async () => {
    de(), G();
  }, de = () => {
    c.value && c.value.disconnect(), d.value && d.value.disconnect(), delete c.value, delete d.value;
  };
  return $t(() => {
    G();
  }), So(() => {
    de();
  }), { stick: b, refresh: Q };
}
const Ri = (e) => (et("data-v-885f595d"), e = e(), tt(), e), xm = /* @__PURE__ */ Ri(() => /* @__PURE__ */ g("hr", null, null, -1)), Tm = { class: "vu-timeline-divider-date__date" }, Vm = /* @__PURE__ */ Ri(() => /* @__PURE__ */ g("hr", null, null, -1)), Mm = {
  name: "vu-timeline-divider"
}, Pm = /* @__PURE__ */ Ae({
  ...Mm,
  props: {
    date: {},
    label: {},
    sticky: { type: Boolean },
    forceStick: { type: Boolean }
  },
  setup(e) {
    const n = Te("lang"), t = Te(ui, 0), i = Te(di, void 0), o = T(null), s = T(null), a = e, { stick: d, refresh: c } = $m({ enabled: a.sticky, el: o, placeholder: s, class: "vu-timeline-divider-date", ancestor: t }), r = (h) => {
      const f = new Date(h), y = f.getFullYear(), b = (/* @__PURE__ */ new Date()).getFullYear(), _ = y === b ? { weekday: "long", month: "long", day: "numeric" } : {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      };
      return f.toLocaleDateString(n, _);
    };
    return (h, f) => (l(), u(V, null, [
      g("div", {
        class: k(["vu-timeline-divider__placeholder", { "vu-timeline-divider__detached": q(d) && q(t), "vu-timeline-divider--hidden": q(d) && q(t) }]),
        ref_key: "placeholder",
        ref: s
      }, null, 2),
      (l(), S(En, {
        to: q(i),
        disabled: !q(i) || !q(d)
      }, [
        g("div", {
          class: k(["vu-timeline-divider-date", [
            { "vu-timeline-divider-date--top": q(d) || a.forceStick },
            q(t) && (q(d) || a.forceStick) && q(i) && "absolute" || (q(d) || a.forceStick) && "sticky"
          ]]),
          ref_key: "el",
          ref: o
        }, [
          xm,
          g("div", Tm, w(h.label || r(h.date)), 1),
          Vm
        ], 2)
      ], 8, ["to", "disabled"]))
    ], 64));
  }
}), Lm = /* @__PURE__ */ A(Pm, [["__scopeId", "data-v-885f595d"]]), Dm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Lm
}, Symbol.toStringTag, { value: "Module" })), Am = (e) => {
  try {
    const { label: n, id: t } = e;
    if (n && t)
      return !0;
  } catch {
  }
  return !1;
}, Fm = {
  name: "vu-tree-view-item",
  mixins: [vt],
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
      default: !1
    },
    siblingsHaveNoType: {
      type: Boolean,
      default: !1
    },
    item: {
      type: Object,
      validator: Am,
      required: !0
    },
    main: {
      type: Boolean,
      default: !1
    },
    leftPadding: {
      type: Number,
      default: 0
    }
  },
  inject: {
    vuTreeViewLazy: {
      default: !1
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
      default: !1
    },
    vuTreeIcon: {
      type: String,
      default: "expand"
    }
  },
  data: () => ({
    guid: Ge
  }),
  watch: {
    item: {
      deep: !0,
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
  components: { VuIconBtn: ue }
}, zm = (e) => (et("data-v-a2b9f9ba"), e = e(), tt(), e), Em = {
  key: 1,
  class: "vu-tree-view-item__tree-icon-loading",
  ref: "loadingSpinner"
}, Nm = /* @__PURE__ */ zm(() => /* @__PURE__ */ g("svg", {
  class: "vu-spin",
  viewBox: "25 25 50 50"
}, [
  /* @__PURE__ */ g("circle", {
    class: "path",
    cx: "50",
    cy: "50",
    r: "20",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "5",
    "stroke-miterlimit": "10"
  })
], -1)), Rm = {
  key: 2,
  class: "vu-tree-view-item__tree-icon-placeholder"
}, Hm = {
  key: 4,
  class: "vu-tree-view-item__type-icon-placeholder"
}, jm = { class: "vu-tree-view-item__label" };
function Um(e, n, t, i, o, s) {
  const a = O("VuIconBtn"), d = O("VuTreeViewItem", !0), c = _e("tooltip");
  return l(), u(V, null, [
    g("div", {
      class: k(["vu-tree-view-item", {
        "vu-tree-view-item--selected": s.isSelected,
        "vu-tree-view-item--unselected": !s.isSelected,
        "vu-tree-view-item--main": t.main,
        "vu-tree-view-item--child": !t.main,
        "vu-tree-view-item--chevron-icon": s.vuTreeIcon === "chevron"
      }]),
      style: K({
        "padding-left": `${s.calcLeftPadding}px`
      }),
      onClick: n[1] || (n[1] = (...r) => s.onClick && s.onClick(...r))
    }, [
      s.showTreeIcon ? (l(), S(a, {
        key: 0,
        icon: s.getTreeIconClass,
        class: "vu-tree-view-item__tree-icon",
        onClick: n[0] || (n[0] = (r) => e.$emit("expand", t.item)),
        ref: "treeIcon"
      }, null, 8, ["icon"])) : s.isLoading ? (l(), u("div", Em, [
        C(e.$slots, "itemLoading", {}, () => [
          Nm
        ], !0)
      ], 512)) : (l(), u("div", Rm)),
      t.item.icon ? (l(), S(a, {
        key: 3,
        class: "vu-tree-view-item__type-icon",
        color: "default-inactive",
        icon: t.item.icon
      }, null, 8, ["icon"])) : t.siblingsHaveNoType ? (l(), u("div", Hm)) : p("", !0),
      C(e.$slots, "item-" + t.item.type || "default", {}, () => [
        H((l(), u("div", jm, [
          X(w(t.item.label), 1)
        ])), [
          [
            c,
            t.item.label,
            void 0,
            { ellipsis: !0 }
          ]
        ])
      ], !0)
    ], 6),
    s.hasItems && s.isExpanded ? (l(!0), u(V, { key: 0 }, j(t.item.items, (r) => (l(), S(d, {
      key: `${r.id}`,
      item: r,
      depth: t.depth + 1,
      "left-padding": s.calcLeftPadding,
      selected: t.selected,
      loading: t.loading,
      expanded: t.expanded,
      "siblings-have-no-type": s.anyChildrenHasIcon,
      onLoadComplete: n[2] || (n[2] = (h) => e.$emit("load-complete", h)),
      onExpand: n[3] || (n[3] = (h) => e.$emit("expand", h)),
      onSelect: n[4] || (n[4] = (h) => e.$emit("select", h))
    }, null, 8, ["item", "depth", "left-padding", "selected", "loading", "expanded", "siblings-have-no-type"]))), 128)) : p("", !0)
  ], 64);
}
const Dn = /* @__PURE__ */ A(Fm, [["render", Um], ["__scopeId", "data-v-a2b9f9ba"]]), Wm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dn
}, Symbol.toStringTag, { value: "Module" })), qm = {
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
      required: !1,
      default: void 0
    },
    items: {
      type: Array,
      required: !0
    },
    exclusive: {
      type: Boolean,
      default: !0
    },
    firstLevelBigger: {
      type: Boolean,
      default: !1
    }
  },
  data: () => ({
    innerLoading: []
  }),
  methods: {
    toggleSelect(e) {
      if (this.selected.includes(e)) {
        const n = this.expanded.slice();
        n.splice(n.indexOf(e), 1), this.$emit("update:selected", n);
      } else
        this.exclusive ? this.$emit("update:selected", [e]) : this.$emit("update:selected", [e].concat(this.expanded || []));
    },
    toggleExpand(e) {
      const n = this.expanded.slice();
      this.expanded.includes(e) ? (n.splice(n.indexOf(e), 1), this.$emit("update:expanded", n)) : e.items === void 0 ? (this.$emit("fetch", e), this.loading === void 0 ? this.innerLoading.push(e) : this.$emit("update:loading", [e].concat(this.loading || []))) : (n.push(e), this.$emit("update:expanded", n));
    },
    onLoad(e) {
      this.loading === void 0 && this.innerLoading.splice(this.innerLoading.indexOf(e)), e.items && e.items.length > 0 && !e.leaf && this.$emit("update:expanded", [e].concat(this.expanded || []));
    }
  },
  components: { VuTreeViewItem: Dn, VuScroller: Qe, VuTreeViewItem: Dn }
}, Km = { class: "vu-tree-view" };
function Gm(e, n, t, i, o, s) {
  const a = O("VuTreeViewItem"), d = O("VuScroller");
  return l(), u("div", Km, [
    x(d, null, {
      default: M(() => [
        (l(!0), u(V, null, j(t.items, (c) => (l(), S(a, {
          key: `${c.id}`,
          item: c,
          loading: t.loading || e.innerLoading,
          expanded: t.expanded,
          selected: t.selected,
          main: t.firstLevelBigger,
          onExpand: s.toggleExpand,
          onSelect: s.toggleSelect,
          onLoadComplete: s.onLoad
        }, null, 8, ["item", "loading", "expanded", "selected", "main", "onExpand", "onSelect", "onLoadComplete"]))), 128))
      ]),
      _: 1
    })
  ]);
}
const Ym = /* @__PURE__ */ A(qm, [["render", Gm]]), Xm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ym
}, Symbol.toStringTag, { value: "Module" })), Ut = "__v-click-outside", Hi = typeof window < "u", Jm = typeof navigator < "u", Zm = Hi && ("ontouchstart" in window || Jm && navigator.msMaxTouchPoints > 0), Qm = Zm ? ["touchstart"] : ["click", "contextmenu"];
function ev(e) {
  const n = typeof e == "function";
  if (!n && typeof e != "object")
    throw new Error("v-click-outside: Binding value must be a function or an object");
  return {
    handler: n ? e : e.handler,
    middleware: e.middleware || ((t) => t),
    events: e.events || Qm,
    innerShow: e.innerShow !== !1
  };
}
function tv({
  el: e,
  event: n,
  handler: t,
  middleware: i
}) {
  const o = n.path || n.composedPath && n.composedPath(), s = o ? !o.includes(e) : !e.contains(n.target);
  n.target !== e && s && i(n) && t(n);
}
function ji(e, { value: n }) {
  const {
    events: t,
    handler: i,
    middleware: o,
    innerShow: s
  } = ev(n);
  s && (e[Ut] = t.map((a) => ({
    event: a,
    handler: (d) => tv({
      event: d,
      el: e,
      handler: i,
      middleware: o
    })
  })), e[Ut].forEach(({ event: a, handler: d }) => setTimeout(() => {
    e[Ut] && document.documentElement.addEventListener(a, d, !1);
  }, 0)));
}
function Ui(e) {
  (e[Ut] || []).forEach(({ event: t, handler: i }) => document.documentElement.removeEventListener(t, i, !1)), delete e[Ut];
}
function nv(e, { value: n, oldValue: t }) {
  JSON.stringify(n) !== JSON.stringify(t) && (Ui(e), ji(e, { value: n }));
}
const sv = {
  beforeMount: ji,
  updated: nv,
  beforeUnmount: Ui
}, An = Hi ? sv : {}, iv = {
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
}, ov = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#73AF00;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<path style="fill:#FFE15A;" d="M251.41,135.209L65.354,248.46c-5.651,3.439-5.651,11.641,0,15.081L251.41,376.793  c2.819,1.716,6.36,1.716,9.18,0l186.057-113.251c5.651-3.439,5.651-11.641,0-15.081L260.59,135.209  C257.771,133.493,254.229,133.493,251.41,135.209z"/>
<circle style="fill:#41479B;" cx="256" cy="256.001" r="70.62"/>
<g>
	<path style="fill:#F5F5F5;" d="M195.401,219.874c-3.332,5.578-5.905,11.64-7.605,18.077c39.149-2.946,97.062,8.006,133.922,43.773   c2.406-6.141,3.994-12.683,4.59-19.522C288.247,230.169,235.628,218.778,195.401,219.874z"/>
	<path style="fill:#F5F5F5;" d="M258.925,280.1l1.88,5.638l5.943,0.046c0.769,0.006,1.088,0.988,0.47,1.445l-4.781,3.531   l1.793,5.666c0.232,0.734-0.604,1.341-1.229,0.893l-4.835-3.456l-4.835,3.456c-0.626,0.448-1.461-0.159-1.229-0.893l1.793-5.666   l-4.781-3.531c-0.619-0.457-0.3-1.439,0.469-1.445l5.943-0.046l1.88-5.638C257.649,279.37,258.681,279.37,258.925,280.1z"/>
	<path style="fill:#F5F5F5;" d="M282.024,294.685l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C281.474,294.37,281.919,294.37,282.024,294.685z"/>
	<path style="fill:#F5F5F5;" d="M248.938,269.39l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C248.388,269.076,248.833,269.076,248.938,269.39z"/>
	<path style="fill:#F5F5F5;" d="M204.13,266.448l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C203.581,266.134,204.025,266.134,204.13,266.448z"/>
	<path style="fill:#F5F5F5;" d="M241.614,293.847l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C241.065,293.534,241.51,293.534,241.614,293.847z"/>
	<path style="fill:#F5F5F5;" d="M220.99,264.755l0.662,1.984l2.092,0.017c0.27,0.002,0.383,0.348,0.166,0.509l-1.683,1.242   l0.631,1.994c0.082,0.258-0.212,0.472-0.433,0.314l-1.702-1.216l-1.702,1.216c-0.221,0.158-0.514-0.056-0.433-0.314l0.631-1.994   l-1.683-1.242c-0.217-0.161-0.106-0.507,0.166-0.509l2.092-0.017l0.662-1.984C220.541,264.498,220.904,264.498,220.99,264.755z"/>
	<path style="fill:#F5F5F5;" d="M283.819,223.794l0.828,2.482l2.616,0.02c0.339,0.002,0.479,0.435,0.206,0.636l-2.104,1.554   l0.789,2.495c0.103,0.323-0.266,0.59-0.541,0.393l-2.129-1.522l-2.129,1.522c-0.276,0.198-0.643-0.071-0.541-0.393l0.789-2.495   l-2.104-1.554c-0.273-0.201-0.132-0.633,0.206-0.636l2.616-0.02l0.828-2.482C283.257,223.472,283.712,223.472,283.819,223.794z"/>
	<path style="fill:#F5F5F5;" d="M207.012,252.617l0.662,1.984l2.092,0.017c0.27,0.002,0.383,0.348,0.166,0.509l-1.683,1.242   l0.631,1.994c0.082,0.258-0.212,0.472-0.433,0.314l-1.702-1.216l-1.702,1.216c-0.221,0.158-0.514-0.056-0.433-0.314l0.631-1.994   l-1.683-1.242c-0.217-0.161-0.106-0.506,0.166-0.509l2.092-0.017l0.662-1.984C206.563,252.36,206.926,252.36,207.012,252.617z"/>
	<path style="fill:#F5F5F5;" d="M217.112,280.581l1.002,3.006l3.168,0.024c0.41,0.003,0.58,0.526,0.25,0.77l-2.549,1.882l0.956,3.02   c0.124,0.391-0.321,0.715-0.655,0.476l-2.578-1.842l-2.578,1.842c-0.333,0.238-0.779-0.085-0.655-0.476l0.956-3.02l-2.549-1.882   c-0.33-0.244-0.16-0.767,0.25-0.77l3.168-0.024l1.002-3.006C216.433,280.193,216.983,280.193,217.112,280.581z"/>
	<path style="fill:#F5F5F5;" d="M294.903,295.315l0.63,1.891l1.993,0.015c0.258,0.002,0.365,0.331,0.158,0.484l-1.603,1.184   l0.601,1.9c0.078,0.246-0.202,0.449-0.413,0.299l-1.621-1.159l-1.622,1.159c-0.21,0.15-0.49-0.053-0.413-0.299l0.601-1.9   l-1.603-1.184c-0.207-0.153-0.1-0.482,0.158-0.484l1.993-0.015l0.63-1.891C294.475,295.07,294.822,295.07,294.903,295.315z"/>
	<path style="fill:#F5F5F5;" d="M301.877,280.885l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C301.327,280.57,301.772,280.57,301.877,280.885z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, lv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<g>
	<path style="fill:#FFE15A;" d="M85.007,140.733l8.416,25.234l26.6,0.206c3.444,0.026,4.872,4.422,2.101,6.467l-21.398,15.801   l8.023,25.362c1.038,3.284-2.7,5.999-5.502,3.997l-21.64-15.469l-21.64,15.468c-2.802,2.003-6.54-0.714-5.502-3.997l8.023-25.362   l-21.398-15.8c-2.771-2.046-1.343-6.441,2.101-6.467l26.6-0.206l8.416-25.234C79.297,137.465,83.918,137.465,85.007,140.733z"/>
	<path style="fill:#FFE15A;" d="M181.599,146.951l6.035,8.23l9.739-3.046c1.261-0.394,2.298,1.044,1.526,2.115l-5.962,8.281   l5.906,8.321c0.765,1.077-0.282,2.508-1.54,2.105l-9.719-3.111l-6.089,8.189c-0.788,1.06-2.473,0.506-2.478-0.814l-0.045-10.205   l-9.67-3.261c-1.251-0.423-1.246-2.195,0.009-2.609l9.69-3.196l0.114-10.204C179.129,146.427,180.818,145.886,181.599,146.951z"/>
	<path style="fill:#FFE15A;" d="M144.857,122.421l10.145,1.102l4.328-9.241c0.561-1.196,2.321-0.991,2.591,0.302l2.086,9.988   l10.126,1.26c1.311,0.163,1.66,1.901,0.513,2.558l-8.855,5.07l1.931,10.02c0.25,1.298-1.295,2.166-2.274,1.279l-7.559-6.855   l-8.932,4.932c-1.156,0.639-2.461-0.563-1.919-1.768l4.183-9.308l-7.452-6.972C142.805,123.89,143.544,122.279,144.857,122.421z"/>
	<path style="fill:#FFE15A;" d="M160.895,221.314l-6.035,8.23l-9.739-3.046c-1.261-0.394-2.298,1.044-1.526,2.115l5.962,8.281   l-5.906,8.321c-0.765,1.077,0.282,2.508,1.54,2.105l9.719-3.111l6.089,8.189c0.788,1.06,2.473,0.506,2.478-0.814l0.045-10.205   l9.67-3.261c1.252-0.423,1.246-2.195-0.009-2.609l-9.69-3.196l-0.114-10.204C163.363,220.791,161.676,220.248,160.895,221.314z"/>
	<path style="fill:#FFE15A;" d="M197.635,198.263l-10.145,1.102l-4.328-9.241c-0.561-1.196-2.321-0.991-2.591,0.302l-2.087,9.988   l-10.126,1.26c-1.311,0.163-1.66,1.901-0.513,2.558l8.855,5.07l-1.931,10.02c-0.25,1.298,1.295,2.166,2.274,1.279l7.559-6.855   l8.932,4.932c1.156,0.639,2.461-0.563,1.919-1.768l-4.183-9.308l7.452-6.972C199.689,199.732,198.95,198.121,197.635,198.263z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, av = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#464655;" d="M512,200.093H0V97.104c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828  L512,200.093L512,200.093z"/>
<path style="fill:#FFE15A;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V311.909h512v102.988  C512,419.773,508.047,423.725,503.172,423.725z"/>
<rect y="200.091" style="fill:#FF4B55;" width="512" height="111.81"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, rv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#C8414B;" d="M8.828,423.725h494.345c4.875,0,8.828-3.953,8.828-8.828V97.104c0-4.875-3.953-8.828-8.828-8.828  H8.828C3.953,88.277,0,92.229,0,97.104v317.793C0,419.773,3.953,423.725,8.828,423.725z"/>
<rect y="158.901" style="fill:#FFD250;" width="512" height="194.21"/>
<path style="fill:#C8414B;" d="M216.276,256.001l7.485-33.681c0.69-3.102-1.671-6.044-4.849-6.044h-5.272  c-3.177,0-5.537,2.942-4.849,6.044L216.276,256.001z"/>
<rect x="207.45" y="238.341" style="fill:#F5F5F5;" width="17.655" height="75.03"/>
<rect x="203.03" y="229.521" style="fill:#FAB446;" width="26.483" height="8.828"/>
<g>
	<rect x="185.38" y="256.001" style="fill:#C8414B;" width="44.14" height="8.828"/>
	<polygon style="fill:#C8414B;" points="229.517,291.311 203.034,282.484 203.034,273.656 229.517,282.484  "/>
	<path style="fill:#C8414B;" d="M83.862,256.001l7.485-33.681c0.69-3.102-1.671-6.044-4.849-6.044h-5.272   c-3.177,0-5.537,2.942-4.849,6.044L83.862,256.001z"/>
</g>
<path style="fill:#F5F5F5;" d="M114.759,229.518c-4.875,0-8.828,3.953-8.828,8.828v57.379c0,10.725,10.01,30.897,44.138,30.897  s44.138-20.171,44.138-30.897v-57.379c0-4.875-3.953-8.828-8.828-8.828H114.759z"/>
<g>
	<path style="fill:#C8414B;" d="M150.069,273.656h-44.138v-35.31c0-4.875,3.953-8.828,8.828-8.828h35.31V273.656z"/>
	<path style="fill:#C8414B;" d="M150.069,273.656h44.138v22.069c0,12.189-9.88,22.069-22.069,22.069l0,0   c-12.189,0-22.069-9.88-22.069-22.069V273.656z"/>
</g>
<path style="fill:#FAB446;" d="M105.931,273.656h44.138v22.069c0,12.189-9.88,22.069-22.069,22.069l0,0  c-12.189,0-22.069-9.88-22.069-22.069V273.656z"/>
<g>
	<path style="fill:#C8414B;" d="M141.241,313.281v-39.625h-8.828v43.693C135.697,316.683,138.664,315.229,141.241,313.281z"/>
	<path style="fill:#C8414B;" d="M123.586,317.349v-43.693h-8.828v39.625C117.336,315.229,120.303,316.683,123.586,317.349z"/>
</g>
<rect x="114.76" y="256.001" style="fill:#FFB441;" width="26.483" height="8.828"/>
<g>
	<rect x="114.76" y="238.341" style="fill:#FAB446;" width="26.483" height="8.828"/>
	<rect x="119.17" y="243.591" style="fill:#FAB446;" width="17.655" height="15.992"/>
</g>
<rect x="75.03" y="238.341" style="fill:#F5F5F5;" width="17.655" height="75.03"/>
<g>
	<rect x="70.62" y="308.971" style="fill:#FAB446;" width="26.483" height="8.828"/>
	<rect x="70.62" y="229.521" style="fill:#FAB446;" width="26.483" height="8.828"/>
</g>
<rect x="66.21" y="317.791" style="fill:#5064AA;" width="35.31" height="8.828"/>
<rect x="207.45" y="308.971" style="fill:#FAB446;" width="26.483" height="8.828"/>
<rect x="198.62" y="317.791" style="fill:#5064AA;" width="35.31" height="8.828"/>
<rect x="123.59" y="220.691" style="fill:#FAB446;" width="52.966" height="8.828"/>
<rect x="145.66" y="194.211" style="fill:#FFB441;" width="8.828" height="26.483"/>
<g>
	<path style="fill:#F5F5F5;" d="M141.241,207.449c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241C154.483,201.509,148.543,207.449,141.241,207.449z M141.241,189.794   c-2.435,0-4.414,1.978-4.414,4.414c0,2.435,1.978,4.414,4.414,4.414s4.414-1.978,4.414-4.414   C145.655,191.773,143.677,189.794,141.241,189.794z"/>
	<path style="fill:#F5F5F5;" d="M158.897,207.449c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241S166.198,207.449,158.897,207.449z M158.897,189.794c-2.435,0-4.414,1.978-4.414,4.414   c0,2.435,1.978,4.414,4.414,4.414c2.435,0,4.414-1.978,4.414-4.414C163.31,191.773,161.332,189.794,158.897,189.794z"/>
	<path style="fill:#F5F5F5;" d="M176.552,216.277c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241S183.853,216.277,176.552,216.277z M176.552,198.622c-2.435,0-4.414,1.978-4.414,4.414   c0,2.435,1.978,4.414,4.414,4.414c2.435,0,4.414-1.978,4.414-4.414S178.987,198.622,176.552,198.622z"/>
	<path style="fill:#F5F5F5;" d="M123.586,216.277c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241C136.828,210.337,130.888,216.277,123.586,216.277z M123.586,198.622   c-2.435,0-4.414,1.978-4.414,4.414c0,2.435,1.978,4.414,4.414,4.414s4.414-1.979,4.414-4.415   C128,200.6,126.022,198.622,123.586,198.622z"/>
</g>
<path style="fill:#FAB446;" d="M176.552,291.311v4.414c0,2.434-1.98,4.414-4.414,4.414s-4.414-1.98-4.414-4.414v-4.414H176.552   M185.379,282.484h-26.483v13.241c0,7.302,5.94,13.241,13.241,13.241c7.302,0,13.241-5.94,13.241-13.241v-13.241H185.379z"/>
<path style="fill:#FFA0D2;" d="M172.138,264.829L172.138,264.829c-4.875,0-8.828-3.953-8.828-8.828v-8.828  c0-4.875,3.953-8.828,8.828-8.828l0,0c4.875,0,8.828,3.953,8.828,8.828v8.828C180.966,260.876,177.013,264.829,172.138,264.829z"/>
<circle style="fill:#5064AA;" cx="150.07" cy="273.651" r="13.241"/>
<rect x="145.66" y="176.551" style="fill:#FAB446;" width="8.828" height="26.483"/>
<path style="fill:#C8414B;" d="M123.586,220.691l-8.828-8.828l5.171-5.171c7.993-7.993,18.835-12.484,30.14-12.484l0,0  c11.305,0,22.146,4.491,30.14,12.484l5.171,5.171l-8.828,8.828H123.586z"/>
<g>
	<circle style="fill:#FFD250;" cx="150.07" cy="211.861" r="4.414"/>
	<circle style="fill:#FFD250;" cx="132.41" cy="211.861" r="4.414"/>
	<circle style="fill:#FFD250;" cx="167.72" cy="211.861" r="4.414"/>
</g>
<g>
	<rect x="70.62" y="256.001" style="fill:#C8414B;" width="44.14" height="8.828"/>
	<polygon style="fill:#C8414B;" points="70.621,291.311 97.103,282.484 97.103,273.656 70.621,282.484  "/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, uv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<path style="fill:#41479B;" d="M170.667,423.721H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.1c0-4.875,3.953-8.828,8.828-8.828  h161.839V423.721z"/>
<rect x="170.67" y="88.277" style="fill:#F5F5F5;" width="170.67" height="335.45"/>
<path style="fill:#FF4B55;" d="M503.172,423.721H341.333V88.273h161.839c4.875,0,8.828,3.953,8.828,8.828v317.793  C512,419.77,508.047,423.721,503.172,423.721z"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, dv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512.002 512.002;" xml:space="preserve">
<path style="fill:#41479B;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.772,508.047,423.725,503.172,423.725z"/>
<path style="fill:#F5F5F5;" d="M512,97.104c0-4.875-3.953-8.828-8.828-8.828h-39.495l-163.54,107.147V88.276h-88.276v107.147  L48.322,88.276H8.828C3.953,88.276,0,92.229,0,97.104v22.831l140.309,91.927H0v88.276h140.309L0,392.066v22.831  c0,4.875,3.953,8.828,8.828,8.828h39.495l163.54-107.147v107.147h88.276V316.578l163.54,107.147h39.495  c4.875,0,8.828-3.953,8.828-8.828v-22.831l-140.309-91.927H512v-88.276H371.691L512,119.935V97.104z"/>
<g>
	<polygon style="fill:#FF4B55;" points="512,229.518 282.483,229.518 282.483,88.276 229.517,88.276 229.517,229.518 0,229.518    0,282.483 229.517,282.483 229.517,423.725 282.483,423.725 282.483,282.483 512,282.483  "/>
	<path style="fill:#FF4B55;" d="M178.948,300.138L0.25,416.135c0.625,4.263,4.14,7.59,8.577,7.59h12.159l190.39-123.586h-32.428   V300.138z"/>
	<path style="fill:#FF4B55;" d="M346.388,300.138H313.96l190.113,123.404c4.431-0.472,7.928-4.09,7.928-8.646v-7.258   L346.388,300.138z"/>
	<path style="fill:#FF4B55;" d="M0,106.849l161.779,105.014h32.428L5.143,89.137C2.123,90.54,0,93.555,0,97.104V106.849z"/>
	<path style="fill:#FF4B55;" d="M332.566,211.863L511.693,95.586c-0.744-4.122-4.184-7.309-8.521-7.309h-12.647L300.138,211.863   H332.566z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, cv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M512,200.093H0V97.104c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828  L512,200.093L512,200.093z"/>
<path style="fill:#73AF00;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V311.909h512v102.988  C512,419.773,508.047,423.725,503.172,423.725z"/>
<rect y="200.091" style="fill:#F5F5F5;" width="512" height="111.81"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, hv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<path style="fill:#73AF00;" d="M170.667,423.721H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.1c0-4.875,3.953-8.828,8.828-8.828  h161.839V423.721z"/>
<rect x="170.67" y="88.277" style="fill:#F5F5F5;" width="170.67" height="335.45"/>
<path style="fill:#FF4B55;" d="M503.172,423.721H341.333V88.273h161.839c4.875,0,8.828,3.953,8.828,8.828v317.793  C512,419.77,508.047,423.721,503.172,423.721z"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, fv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#F5F5F5;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<circle style="fill:#FF4B55;" cx="256" cy="256.001" r="97.1"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, pv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M0,256h512v158.897c0,4.875-3.953,8.828-8.828,8.828H8.828c-4.875,0-8.828-3.953-8.828-8.828V256z"/>
<path style="fill:#F5F5F5;" d="M512,256H0V97.103c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828L512,256  L512,256z"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, mv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<path style="fill:#73AF00;" d="M185.379,88.277H8.828C3.953,88.277,0,92.229,0,97.104v317.793c0,4.875,3.953,8.828,8.828,8.828  H185.38V88.277H185.379z"/>
<circle style="fill:#FFE15A;" cx="185.45" cy="256.001" r="79.38"/>
<path style="fill:#FF4B55;" d="M211.932,229.518v35.31c0,14.603-11.88,26.483-26.483,26.483s-26.483-11.88-26.483-26.483v-35.31  H211.932 M220.759,211.863h-70.621c-4.875,0-8.828,3.953-8.828,8.828v44.138c0,24.376,19.762,44.138,44.138,44.138  s44.138-19.762,44.138-44.138v-44.138C229.587,215.816,225.634,211.863,220.759,211.863L220.759,211.863z"/>
<path style="fill:#F5F5F5;" d="M211.932,229.518v35.31c0,14.603-11.88,26.483-26.483,26.483s-26.483-11.88-26.483-26.483v-35.31  H211.932"/>
<g>
	<circle style="fill:#FFE15A;" cx="150.07" cy="220.691" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="220.69" cy="220.691" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="150.07" cy="256.001" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="220.69" cy="256.001" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="185.38" cy="220.691" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="211.88" cy="288.551" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="159.4" cy="288.551" r="4.414"/>
</g>
<g>
	<path style="fill:#41479B;" d="M191.149,253.763v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602   L191.149,253.763"/>
	<path style="fill:#41479B;" d="M191.149,235.741v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602H191.149"/>
	<path style="fill:#41479B;" d="M191.149,271.97v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602H191.149"/>
	<path style="fill:#41479B;" d="M206.506,253.763v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602   L206.506,253.763"/>
	<path style="fill:#41479B;" d="M175.794,253.763v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602   L175.794,253.763"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, vv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#F5F5F5;" d="M512,200.093H0V97.104c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828  L512,200.093L512,200.093z"/>
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V311.909h512v102.988  C512,419.773,508.047,423.725,503.172,423.725z"/>
<rect y="200.091" style="fill:#41479B;" width="512" height="111.81"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, gv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#4173CD;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<polygon style="fill:#FFE15A;" points="512,229.518 211.862,229.518 211.862,88.277 158.897,88.277 158.897,229.518 0,229.518   0,282.484 158.897,282.484 158.897,423.725 211.862,423.725 211.862,282.484 512,282.484 "/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, yv = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<g>
	<path style="fill:#F5F5F5;" d="M253.474,225.753l13.837,18.101l21.606-7.232c1.208-0.404,2.236,0.962,1.512,2.01l-12.939,18.753   l13.555,18.314c0.758,1.024-0.224,2.423-1.444,2.059l-21.834-6.511l-13.228,18.55c-0.739,1.037-2.375,0.536-2.406-0.737   l-0.555-22.777l-21.73-6.849c-1.215-0.383-1.244-2.092-0.042-2.515l21.491-7.566l-0.202-22.783   C251.083,225.296,252.701,224.741,253.474,225.753z"/>
	<path style="fill:#F5F5F5;" d="M176.956,326.662c-38.995,0-70.627-31.633-70.627-70.663c0-38.958,31.633-70.662,70.627-70.662   c14.508,0,27.887,4.462,39.037,12.014c1.707,1.156,3.656-1.087,2.227-2.573c-16.664-17.325-40.248-27.894-66.398-27.001   c-44.926,1.533-82.118,37.553-84.989,82.413c-3.287,51.383,37.399,94.086,88.055,94.086c24.953,0,47.379-10.432,63.393-27.112   c1.415-1.473-0.538-3.683-2.229-2.537C204.89,322.196,191.489,326.662,176.956,326.662z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, zs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BR: ov,
  CN: lv,
  DE: av,
  ES: rv,
  FR: uv,
  GB: dv,
  HU: cv,
  IT: hv,
  JP: fv,
  PL: pv,
  PT: mv,
  RU: vv,
  SE: gv,
  TR: yv
}, Symbol.toStringTag, { value: "Module" })), Wi = (e) => {
  if (e && e.id)
    return !0;
}, bv = (e) => {
  try {
    const { firstName: n } = e;
    if (n)
      return !0;
  } catch {
  }
  return !1;
}, _v = (e) => `${e.firstName}${e.lastName ? ` ${e.lastName}` : ""}`, ft = {
  message: {
    name: "message",
    icon: "chat-alt"
  },
  network: {
    name: "network",
    icon: "user-add",
    left: !0
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
ft.network;
const wv = [ft.message, ft.audio, ft.conferencing, ft.screenshare], ln = (e) => {
  const n = Object.keys(ft);
  return !(e.length > 0 && e.filter((t) => n.indexOf(t)) === -1);
}, kv = {
  name: "vu-rich-user-tooltip",
  emits: ["network", "message", "audio", "conferencing", "screenshare", "see-profile"],
  directives: {
    "click-outside": An
  },
  inject: {
    vuUserLabels: {
      default: () => iv
    },
    vuDebug: {
      default: !1
    }
  },
  props: {
    show: {
      type: Boolean,
      required: !1
    },
    user: {
      type: Object,
      validator: Wi,
      required: !0
    },
    disabledActions: {
      type: Array,
      validator: ln,
      required: !1,
      default: () => []
    },
    hiddenActions: {
      type: Array,
      validator: ln,
      required: !1,
      default: () => []
    },
    side: {
      type: String,
      default: "bottom"
    },
    // eslint-disable-next-line vue/require-prop-types
    attach: {
      default: !1
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
      immediate: !0,
      handler() {
        this.parseContactsInCommonLabel();
      }
    }
  },
  /* eslint-disable no-unused-vars */
  data: () => ({
    overflowHover: !1,
    actions: ft,
    RHSactions: wv,
    uuid: Ge,
    getFullname: _v,
    validateName: bv,
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
      return !this.user.countryCode || !zs[this.user.countryCode.toUpperCase()] ? !1 : zs[this.user.countryCode.toUpperCase()];
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
      const n = e.match(/\$\(.*\)/).length > 0;
      this.contacts.length > 1 && n ? e = e.replace("$(", "").replace(")", "") : e = e.replace(/\$\(.*\)/, ""), e = e.split("###"), this.contactsLabelPart1 = e[0], this.contactsLabelPart2 = e[1];
    },
    isDisabled(e) {
      return this.disabledActions.length > 0 && this.disabledActions.includes(e);
    }
  },
  components: { VuPopover: Ke, VuUserPicture: Ot, VuIconBtn: ue }
}, Sv = (e) => (et("data-v-8d121700"), e = e(), tt(), e), Iv = { class: "rich-user-tooltip__header__wrap-name" }, Cv = /* @__PURE__ */ Sv(() => /* @__PURE__ */ g("div", { class: "rich-user-tooltip__header__topbar" }, null, -1)), Bv = { class: "rich-user-tooltip__avatar-wrap" }, Ov = {
  key: 0,
  class: "rich-user-tooltip__info"
}, $v = {
  key: 0,
  class: "rich-user-tooltip__info__company"
}, xv = {
  key: 1,
  class: "rich-user-tooltip__info__locale"
}, Tv = ["src"], Vv = {
  key: 1,
  class: "rich-user-tooltip__info__country"
}, Mv = { class: "rich-user-tooltip__contacts__label" }, Pv = { class: "rich-user-tooltip__contacts__list" }, Lv = { class: "rich-user-tooltip__footer" }, Dv = { class: "rich-user-tooltip__footer__left" };
function Av(e, n, t, i, o, s) {
  const a = O("VuUserPicture"), d = O("VuIconBtn"), c = O("VuPopover"), r = _e("tooltip");
  return l(), S(c, {
    side: t.side,
    show: t.show,
    arrow: "",
    shift: "",
    positions: ["bottom", "top"],
    attach: "body",
    "content-class": "vu-rich-user-tooltip",
    activator: t.activator
  }, qs({
    default: M(() => [
      C(e.$slots, "default", {}, () => [
        H(x(a, {
          id: t.user.id,
          clickable: "",
          src: t.user.imgSrc,
          presence: t.user.presence,
          class: "rich-user-tooltip__default-content"
        }, null, 8, ["id", "src", "presence"]), [
          [
            r,
            e.getFullname(t.user),
            void 0,
            { top: !0 }
          ]
        ])
      ], !0)
    ]),
    arrow: M(({ side: h, shift: f }) => [
      H(g("div", {
        class: k(["rich-user-tooltip__arrow popover-arrow", `rich-user-tooltip__arrow--${h}`])
      }, null, 2), [
        [Ve, !f]
      ])
    ]),
    title: M(({ side: h }) => [
      g("div", {
        class: k(["rich-user-tooltip__header", `rich-user-tooltip__header--${h}`])
      }, [
        g("div", Iv, [
          H((l(), u("label", {
            class: "rich-user-tooltip__header__name",
            onClick: n[0] || (n[0] = (f) => e.$emit("see-profile", t.user.id))
          }, [
            X(w(e.getFullname(t.user)), 1)
          ])), [
            [r, e.getFullname(t.user)]
          ])
        ]),
        Cv,
        H((l(), u("div", Bv, [
          x(a, {
            class: "rich-user-tooltip__header__avatar",
            size: "big",
            clickable: !0,
            id: t.user && t.user.id,
            gutter: !0,
            presence: t.user.presence,
            onClick: n[1] || (n[1] = (f) => e.$emit("see-profile", t.user.id))
          }, null, 8, ["id", "presence"])
        ])), [
          [
            r,
            e.getFullname(t.user),
            void 0,
            { bottom: !0 }
          ]
        ])
      ], 2)
    ]),
    _: 2
  }, [
    (s.hasInfo || s.hasContacts, {
      name: "body",
      fn: M(() => [
        s.hasInfo ? (l(), u("div", Ov, [
          t.user.company ? (l(), u("label", $v, w(t.user.company), 1)) : p("", !0),
          s.countryImg || s.countryLabel ? (l(), u("label", xv, [
            s.countryImg ? (l(), u("img", {
              key: 0,
              class: "rich-user-tooltip__info__flag",
              src: s.countryImg
            }, null, 8, Tv)) : p("", !0),
            s.countryLabel ? (l(), u("span", Vv, w(s.countryLabel), 1)) : p("", !0)
          ])) : p("", !0)
        ])) : p("", !0),
        C(e.$slots, "content", {}, void 0, !0),
        s.hasContacts ? (l(), u(V, { key: 1 }, [
          g("label", Mv, [
            X(w(e.contactsLabelPart1), 1),
            H((l(), u("span", {
              class: "rich-user-tooltip__contacts__amount",
              onClick: n[2] || (n[2] = (h) => e.$emit("see-profile", t.user.id))
            }, [
              X(w(s.contacts.length), 1)
            ])), [
              [
                r,
                s.vuUserLabels.profile,
                void 0,
                { bottom: !0 }
              ]
            ]),
            e.contactsLabelPart2 ? (l(), u(V, { key: 0 }, [
              X(w(e.contactsLabelPart2), 1)
            ], 64)) : p("", !0)
          ]),
          g("div", Pv, [
            (l(!0), u(V, null, j(s.visibleContacts, (h) => H((l(), S(a, {
              key: h.id || e.uuid(),
              id: h.id || e.uuid(),
              clickable: !0,
              onClick: (f) => e.$emit("see-profile", h.id)
            }, null, 8, ["id", "onClick"])), [
              [
                r,
                e.getFullname(h),
                void 0,
                { bottom: !0 }
              ]
            ])), 128)),
            s.overflowContact ? H((l(), S(a, {
              key: 0,
              class: "rich-user-tooltip__overflow_contact",
              style: K({
                "--numberOfOverflowingContacts": s.numberOfOverflowingContactsCssVariable
              }),
              clickable: !0,
              hoverable: "",
              id: s.overflowContact.id || e.uuid(),
              onClick: n[3] || (n[3] = (h) => e.$emit("see-profile", s.overflowContact.id))
            }, null, 8, ["style", "id"])), [
              [
                r,
                s.vuUserLabels.profile,
                void 0,
                { bottom: !0 }
              ]
            ]) : p("", !0)
          ])
        ], 64)) : p("", !0),
        g("div", Lv, [
          g("div", Dv, [
            C(e.$slots, "footer-left", {}, () => [
              t.hiddenActions.length && t.hiddenActions.includes("network") ? p("", !0) : H((l(), S(a, {
                key: 0,
                icon: e.actions.network.icon,
                class: "add-network",
                disabled: t.disabledActions.length > 0 && t.disabledActions.includes("network"),
                onClick: n[4] || (n[4] = (h) => {
                  s.isDisabled("network") || e.$emit("network", t.user.id);
                })
              }, null, 8, ["icon", "disabled"])), [
                [
                  r,
                  s.vuUserLabels.network,
                  void 0,
                  { bottom: !0 }
                ]
              ])
            ], !0)
          ]),
          C(e.$slots, "footer-right", {}, () => [
            (l(!0), u(V, null, j(e.RHSactions, (h) => (l(), u(V, {
              key: h.name
            }, [
              t.hiddenActions.length && t.hiddenActions.includes(h.name) ? p("", !0) : H((l(), S(d, {
                key: 0,
                class: "right-btn",
                icon: h.icon,
                disabled: s.isDisabled(h.name),
                onClick: (f) => {
                  s.isDisabled(h.name) || e.$emit(h.name, t.user.id);
                }
              }, null, 8, ["icon", "disabled", "onClick"])), [
                [
                  r,
                  s.vuUserLabels[h.name],
                  void 0,
                  { bottom: !0 }
                ]
              ])
            ], 64))), 128))
          ], !0)
        ])
      ]),
      key: "0"
    })
  ]), 1032, ["side", "show", "activator"]);
}
const qi = /* @__PURE__ */ A(kv, [["render", Av], ["__scopeId", "data-v-8d121700"]]), Fv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qi
}, Symbol.toStringTag, { value: "Module" })), zv = {
  name: "vu-user-name",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    firstName: String,
    // eslint-disable-next-line vue/require-default-prop
    lastName: String,
    toUpper: {
      type: Boolean,
      required: !1,
      default: !0
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
function Ev(e, n, t, i, o, s) {
  return l(), u("div", {
    class: k(["vu-user-name", [
      "vu-user-name--default-color",
      "vu-user-name--default-size",
      { "vu-user-name--with-avatar": t.shift },
      { "vu-user-name--clickable": t.clickable }
    ]])
  }, [
    C(e.$slots, "default", {}, () => [
      g("span", {
        class: "content",
        onClick: n[0] || (n[0] = (a) => e.$emit("click"))
      }, w(t.firstName + " " + s._lastName), 1)
    ], !0)
  ], 2);
}
const Ki = /* @__PURE__ */ A(zv, [["render", Ev], ["__scopeId", "data-v-7c3b1fc7"]]), Nv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ki
}, Symbol.toStringTag, { value: "Module" })), Rv = {
  name: "vu-user",
  emits: ["click-other-user", "click-user"],
  props: {
    user: {
      type: Object,
      required: !0,
      validator: Wi
    },
    disabledActions: {
      type: Array,
      required: !1,
      default: () => [],
      validator: ln
    },
    hiddenActions: {
      type: Array,
      required: !1,
      default: () => [],
      validator: ln
    },
    showPicture: {
      type: Boolean,
      required: !1,
      default: !0
    },
    showName: {
      type: Boolean,
      required: !1,
      default: !1
    },
    showUserTooltip: {
      type: Boolean,
      required: !1,
      default: !0
    },
    clickable: {
      type: Boolean,
      required: !1,
      default: !0
    },
    pictureBackground: {
      type: String,
      required: !1,
      default: "#fff"
    },
    attach: {
      default: () => !1,
      validator: Kn
    }
  },
  computed: {
    listeners() {
      return Ze(this.$attrs, !0);
    }
  },
  data: () => ({
    getListenersFromAttrs: Ze
  }),
  components: { VuRichUserTooltip: qi, VuUserPicture: Ot, VuUserName: Ki, VuUserPicture: Ot }
}, Hv = { class: "vu-user" };
function jv(e, n, t, i, o, s) {
  const a = O("VuUserPicture"), d = O("VuUserName"), c = O("VuRichUserTooltip");
  return l(), u("div", Hv, [
    t.showUserTooltip ? (l(), S(c, te({
      key: 0,
      user: t.user,
      "disabled-actions": t.disabledActions,
      "hidden-actions": t.hiddenActions,
      attach: t.attach
    }, ot(s.listeners.vOn || {})), {
      default: M(() => [
        t.showPicture ? (l(), S(a, {
          key: 0,
          id: t.user.id,
          src: t.user.imgSrc,
          presence: t.user.presence,
          clickable: t.clickable,
          style: K({ background: t.pictureBackground }),
          onClick: n[0] || (n[0] = (r) => e.$emit("click-user", e.value))
        }, null, 8, ["id", "src", "presence", "clickable", "style"])) : p("", !0),
        t.showName ? (l(), S(d, {
          key: 1,
          "first-name": t.user.firstName,
          "last-name": t.user.lastName,
          clickable: t.clickable,
          shift: t.showPicture,
          onClick: n[1] || (n[1] = (r) => e.$emit("click-user", r))
        }, {
          default: M(() => [
            C(e.$slots, "userName", {}, void 0, !0)
          ]),
          _: 3
        }, 8, ["first-name", "last-name", "clickable", "shift"])) : p("", !0)
      ]),
      _: 3
    }, 16, ["user", "disabled-actions", "hidden-actions", "attach"])) : (l(), u(V, { key: 1 }, [
      t.showPicture ? (l(), S(a, {
        key: 0,
        id: t.user.id,
        src: t.user.imgSrc,
        presence: t.user.presence,
        clickable: t.clickable,
        style: K({ background: t.pictureBackground }),
        onClick: n[2] || (n[2] = (r) => e.$emit("click-user", r))
      }, null, 8, ["id", "src", "presence", "clickable", "style"])) : p("", !0),
      t.showName ? (l(), S(d, {
        key: 1,
        "first-name": t.user.firstName,
        "last-name": t.user.lastName,
        clickable: t.clickable,
        shift: t.showPicture,
        onClick: n[3] || (n[3] = (r) => e.$emit("click-user", r))
      }, {
        default: M(() => [
          C(e.$slots, "userName", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["first-name", "last-name", "clickable", "shift"])) : p("", !0)
    ], 64))
  ]);
}
const Uv = /* @__PURE__ */ A(Rv, [["render", jv], ["__scopeId", "data-v-4a92d15b"]]), Wv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Uv
}, Symbol.toStringTag, { value: "Module" }));
function Kt() {
  if (!window)
    return !1;
  const e = navigator.userAgent.toLowerCase();
  return !!(/iPhone|iPad/i.test(e) || /safari/.test(e) && !/chrome/.test(e) && ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}
const an = ({ userAgent: e }) => e.match(/android/i);
let Gi = null, hs = null;
function qv({ disableTooltipsOnDevices: e, deferTooltips: n }) {
  Gi = e, hs = n;
}
function Yi(e, n, t, i) {
  const o = n.getBoundingClientRect(), {
    left: s,
    top: a,
    shiftX: d
  } = Yn(e, o, t.getBoundingClientRect(), i.getBoundingClientRect(), {}, !0);
  t.style.top = `${a}px`, t.style.left = `${s}px`;
  const c = t.querySelector(".tooltip-arrow") || { style: {} };
  return d > 0 ? (c.style.right = `${d - 5}px`, c.style.left = "initial") : d < 0 && (c.style.left = `${o.left - s + n.clientWidth / 2}px`, c.style.right = "initial"), !0;
}
function Xi(e) {
  switch (!0) {
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
function Ji(e, n, t) {
  const { text: i = "" } = t || {}, o = x({ ...Xn }, {
    type: n ? "popover" : "tooltip",
    text: typeof t == "string" ? t : i
  });
  e.tooltip = o, hs && (e.deferedTooltip = !0);
}
async function Es(e, n = {}) {
  const { value: t, modifiers: i } = n;
  if (i.ellipsis && e.offsetWidth >= e.scrollWidth)
    return;
  const { attach: o = document.body } = t, s = Xi(i), { tooltip: { component: a = !1 } = {} } = e;
  a || Ji(e, i.popover, t), Rn(e.tooltip, o), e.tooltip.component.props.show = !0, e.tooltip.component.props.side = s, await new Promise((d) => setTimeout(d, 1)), Yi(s, e, e.tooltip.el, o), (an(navigator) || Kt()) && (e.stopClickOutside = il(e, () => Fn(e), { detectIframe: !0 }));
}
function Fn(e) {
  const { tooltip: n } = e, { component: t } = n || {};
  !n || !t || (t.props.show = !1, (an(navigator) || Kt()) && e.stopClickOutside && (e.stopClickOutside(), delete e.stopClickOutside), Zi(e));
}
async function Kv(e, n, t) {
  var d;
  const { tooltip: i } = e, { modifiers: o, value: s = {} } = n, { text: a } = s;
  if (i) {
    const { component: c } = i, r = typeof s == "string" ? s : a;
    if (i.props.text = r, c && (c.props.text = r), (d = c == null ? void 0 : c.props) != null && d.show) {
      const h = Xi(o);
      await new Promise((f) => setTimeout(f, 1)), Yi(h, t.el, i.el, document.body);
    }
  }
}
function Zi(e) {
  var n, t, i, o, s;
  if (e.tooltip) {
    const { tooltip: a } = e;
    a && ((t = (n = a == null ? void 0 : a.component) == null ? void 0 : n.el) == null || t.remove(), (s = (o = (i = a == null ? void 0 : a.component) == null ? void 0 : i.vnode) == null ? void 0 : o.el) == null || s.remove()), delete e.tooltip;
  }
}
function Ns(e, n, t) {
  n.modifiers.click || t ? (e.clickListener = () => {
    var i, o, s;
    (s = (o = (i = e == null ? void 0 : e.tooltip) == null ? void 0 : i.component) == null ? void 0 : o.props) != null && s.show ? Fn(e) : Es(e, n);
  }, e.addEventListener("click", e.clickListener)) : (e.showListener = Es.bind(null, e, n), e.addEventListener("mouseenter", e.showListener), e.hideListener = Fn.bind(null, e), e.addEventListener("mouseleave", e.hideListener));
}
function Gv(e) {
  e.clickListener && e.removeEventListener("click", e.clickListener), e.showListener && e.removeEventListener("mouseenter", e.showListener), e.hideListener && e.removeEventListener("mouseleave", e.hideListener);
}
const Cn = {
  setConfig: qv,
  mounted(e, n) {
    const { modifiers: t, value: i } = n, { forceOnDevices: o = !1, popover: s = !1 } = t, a = an(navigator) || Kt();
    Gi && !o && a || n.disabled || (!hs && i ? Ji(e, s, i) : e.deferedTooltip = !0, i && Ns(e, n, a));
  },
  updated(e, n, t) {
    const i = typeof n.value == "function", o = typeof n.oldValue == "function", s = i ? n.value() : n.value, a = o ? n.oldValue() : n.oldValue;
    if (s !== a && (Kv(e, n, t), Gv(e), s)) {
      const d = an(navigator) || Kt();
      Ns(e, n, d);
    }
  },
  beforeUnmount: Zi
}, Rs = (e, n, t) => {
  const i = x(ss, { mask: !0 });
  if (Rn(i, t.el), e.spinner = i, i && typeof n.value == "string") {
    const { component: o } = i;
    i.props.text = n.value, o && (o.props.text = n.value);
  }
  e.classList.add("masked");
}, Hs = (e, n, t) => {
  e.spinner && (Rn(null, t.el), e.spinner = null, e.classList.remove("masked"));
}, js = {
  mounted(e, n, t) {
    n.value && Rs(e, n, t);
  },
  updated(e, n, t) {
    n.value !== n.oldValue && (n.value ? Rs : Hs)(e, n, t);
  },
  unmounted(e, n, t) {
    Hs(e, n, t);
  }
}, Yv = {
  install(e, n = { disableTooltipsOnDevices: !0 }) {
    e.directive("click-outside", An), e.directive("mask", js), Cn.setConfig(n), e.directive("tooltip", Cn);
  },
  clickOutside: An,
  tooltip: Cn,
  mask: js
};
function Xv(e, n = {}) {
  const {
    lang: t = "en",
    country: i = "US",
    isMobile: o,
    isIOS: s,
    globalRegister: a = !0,
    disableVuMessageProgressBar: d,
    sharedMessageContainer: c = !0
  } = n;
  if (hf(e), Vh(e, c), Or(e), a) {
    const r = /* @__PURE__ */ Object.assign({ "./components/layouts/vu-status-bar.vue": Ol, "./components/layouts/vu-thumbnail.vue": Ea, "./components/layouts/vu-tile.vue": Ma, "./components/vu-accordion.vue": Ka, "./components/vu-alert-dialog/vu-alert-dialog-container.vue": Vr, "./components/vu-alert-dialog/vu-alert-dialog.vue": ar, "./components/vu-badge.vue": Vo, "./components/vu-btn-dropdown.vue": Rr, "./components/vu-btn-group.vue": qr, "./components/vu-btn.vue": Dr, "./components/vu-carousel-slide.vue": Jr, "./components/vu-carousel.vue": au, "./components/vu-checkbox.vue": vu, "./components/vu-contextual-dropdown.vue": _u, "./components/vu-datepicker.vue": Pu, "./components/vu-divider.vue": Bo, "./components/vu-dropdown/vu-dropdownmenu-items-scrollable.vue": pa, "./components/vu-dropdownmenu-items.vue": Gl, "./components/vu-dropdownmenu.vue": va, "./components/vu-dropzone.vue": Fu, "./components/vu-facets-bar.vue": ju, "./components/vu-form.vue": qu, "./components/vu-grid-view.vue": Rd, "./components/vu-icon-btn.vue": ba, "./components/vu-icon-link.vue": Wd, "./components/vu-icon.vue": Ao, "./components/vu-image.vue": Dl, "./components/vu-input-date.vue": ec, "./components/vu-input-number.vue": cc, "./components/vu-input.vue": yc, "./components/vu-lazy.vue": Tl, "./components/vu-lightbox/vu-lightbox-bar.vue": Mc, "./components/vu-lightbox/vu-lightbox.vue": Gc, "./components/vu-media-upload-droppable.vue": Qc, "./components/vu-media-upload-empty.vue": oh, "./components/vu-media-upload-error.vue": uh, "./components/vu-media-upload-loading.vue": yh, "./components/vu-media-upload-preview.vue": kh, "./components/vu-media-upload.vue": Th, "./components/vu-message/vu-message-container.vue": jh, "./components/vu-message/vu-message.vue": zh, "./components/vu-modal/vu-mobile-dialog.vue": Xh, "./components/vu-modal/vu-modal-container.vue": vf, "./components/vu-modal/vu-modal.vue": cf, "./components/vu-multiple-select.vue": $f, "./components/vu-popover.vue": Sl, "./components/vu-progress-circular.vue": ph, "./components/vu-range.vue": Rf, "./components/vu-scroller.vue": la, "./components/vu-section-header.vue": qf, "./components/vu-select-options.vue": rd, "./components/vu-select.vue": Od, "./components/vu-side-panel.vue": Fc, "./components/vu-single-checkbox.vue": ep, "./components/vu-slider.vue": up, "./components/vu-spinner.vue": na, "./components/vu-textarea.vue": gp, "./components/vu-thumbnail-grid.vue": jp, "./components/vu-thumbnail-list-item.vue": Op, "./components/vu-thumbnail-list.vue": dm, "./components/vu-time-picker.vue": Bm, "./components/vu-timeline-divider.vue": Dm, "./components/vu-tooltip.vue": gl, "./components/vu-tree-view-item.vue": Wm, "./components/vu-tree-view.vue": Xm, "./components/vu-user/vu-rich-user-tooltip.vue": Fv, "./components/vu-user/vu-user-name.vue": Nv, "./components/vu-user/vu-user-picture.vue": Zu, "./components/vu-user/vu-user.vue": Wv });
    for (const h in r) {
      const f = r[h];
      e.component(f.default.name, f.default);
    }
  }
  t && i ? e.provide("lang", `${t}-${i}`) : e.provide("lang", "en-US"), e.provide(Yt, o !== void 0 ? o : Fi()), e.provide(Qn, s !== void 0 ? s : Kt()), e.provide("vuCollectionActions", null), e.provide("vuCollectionLazyImages", !0), e.provide("vuTileEmphasizeText", !1), e.provide("vuDateFormatWeekday", !0), e.provide("vuDateFormatShort", !1), e.provide("vuTreeViewLazy", !0), e.provide("vuTreeViewIcon", "chevron"), e.provide(ts, !0), e.provide(es, d), Yv.install(e, n);
}
const Qv = { install: Xv };
export {
  yi as alertDialog,
  Xv as default,
  Xv as install,
  ct as message,
  Ht as modal,
  Qv as plugin,
  Zv as provideKeys
};
