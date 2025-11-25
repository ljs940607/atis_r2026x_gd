var kr = Object.defineProperty;
var Ir = (e, t, n) => t in e ? kr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ye = (e, t, n) => Ir(e, typeof t != "symbol" ? t + "" : t, n);
import { ref as b, unref as f, watch as G, toRef as Fe, readonly as Ut, customRef as us, onBeforeUnmount as Ft, getCurrentScope as xn, onScopeDispose as kn, getCurrentInstance as ct, onMounted as Ie, nextTick as ds, isRef as fe, shallowRef as it, watchEffect as jt, computed as A, reactive as ut, openBlock as m, createElementBlock as _, mergeProps as fs, toHandlers as Or, resolveComponent as ne, normalizeClass as q, createVNode as x, normalizeStyle as dt, renderSlot as B, createElementVNode as $, withModifiers as Me, toDisplayString as U, createCommentVNode as k, Fragment as le, renderList as Ye, createBlock as W, Transition as un, withCtx as D, resolveDirective as xe, withDirectives as ae, Teleport as Rr, createTextVNode as Le, vShow as zn, inject as In, defineComponent as ee, useTemplateRef as Ot, TransitionGroup as Dr, mergeModels as Rt, useModel as Bt, onBeforeMount as Nr, defineAsyncComponent as tn, withKeys as Mr } from "DS/SwymVuePublishForm/vue.amd";
import { message as Ve } from "DS/SwymVuePublishForm/VUEKIT.amd";
const dn = b("");
function Lr(e) {
  dn.value = e;
}
function Ur() {
  if (!dn.value)
    throw new Error("Registry URL is not defined");
  return dn.value;
}
const fn = b("");
function pn(e) {
  fn.value = e;
}
function Q() {
  if (!fn.value)
    throw new Error("Platform ID is not defined");
  return fn.value;
}
var Fr = Object.defineProperty, jr = (e, t, n) => t in e ? Fr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, de = (e, t, n) => jr(e, typeof t != "symbol" ? t + "" : t, n);
const Dt = ["trace", "debug", "log", "info", "warn", "error"];
function Br() {
  return typeof window > "u" ? !1 : window.sessionStorage.getItem("DSY_SWYM_DEBUG") || !1;
}
function qr() {
  return typeof window > "u" ? !1 : window.localStorage.getItem("logger-debug") || !1;
}
function Vr() {
  return typeof window > "u" ? !1 : new URL(window.location.href).searchParams.has("debug");
}
function nn(e) {
  return typeof e == "string" ? Dt.includes(e) ? e : e !== "false" : e;
}
function Gn(e) {
  return typeof e == "boolean" ? e ? 0 : Dt.length : Dt.indexOf(e);
}
class Wr {
  constructor() {
    de(this, "logLevelIndex", Gn(!1)), de(this, "_log", (n, ...s) => {
      const r = this._getScope(n), i = this.emojis[n], o = this.styles[n];
      this._shouldLog(n) && console[n](`${i} %c[${r}]`, o, ...s);
    }), de(this, "emojis", {
      trace: "🧵",
      debug: "🛠️",
      log: "📋",
      info: "📢",
      warn: "🚧",
      error: "🔥"
    }), de(this, "styles", {
      trace: "",
      debug: "color: white; background: #3d3d3d;",
      log: "color: black; background: #D5E8F2;",
      info: "color: black; background: #EDF6EB;",
      warn: "background: transparent;",
      error: "background: transparent;"
    }), de(this, "_getScope", (n) => `LOGGER ${n.toUpperCase().padEnd(5, " ")}`), de(this, "log", this._log.bind(this, "log")), de(this, "info", this._log.bind(this, "info")), de(this, "warn", this._log.bind(this, "warn")), de(this, "debug", this._log.bind(this, "debug")), de(this, "error", this._log.bind(this, "error")), de(this, "trace", this._log.bind(this, "trace"));
    const t = nn(Vr()) || nn(qr()) || nn(Br());
    this.logLevelIndex = Gn(t);
  }
  _shouldLog(t) {
    return Dt.indexOf(t) >= this.logLevelIndex;
  }
}
const F = new Wr(), Hr = "AmdLoader/AmdLoader.js", zr = "bust=NO_CACHE_ID";
let gt;
const Yn = [], Qn = [];
async function Gr() {
  const e = { DS: "." };
  let t = { paths: { ...e } }, n = Promise.resolve({});
  for (; Yn.length; )
    n = n.then(Yn.pop());
  try {
    t = await n;
  } catch (s) {
    F.error("[RequireJS] Failed to load config:", s);
  }
  return t.paths = { ...t.paths, ...e }, t.urlArgs || (t.urlArgs = zr), t;
}
async function Yr() {
  let e = Promise.resolve(void 0);
  for (; Qn.length; )
    e = e.then(Qn.pop());
  try {
    await e;
  } catch (t) {
    F.error('[RequireJS] Failed to run "after require setup" hooks:', t);
  }
}
function Qr(e) {
  if (!window.require)
    throw new Error("window.require is not initialiazed");
  window.require.config(e), F.debug("[RequireJS] Set config:", e);
}
async function Xr(e) {
  if (typeof window.require == "function")
    return;
  const t = document.createElement("script"), n = new Promise((s, r) => {
    t.onload = s, t.onerror = r;
  });
  t.src = `${e.baseUrl ?? ""}${Hr}?${e.urlArgs}`, F.debug("[RequireJS] Download AMDLoader script: ", t.src), document.head.appendChild(t), await n;
}
async function Jr() {
  if (gt)
    return gt;
  let e, t;
  gt = new Promise((n, s) => {
    e = n, t = s;
  }), F.debug("[RequireJS] init");
  try {
    const n = await Gr();
    await Xr(n), await Qr(n), await Yr(), e == null || e();
  } catch {
    t == null || t();
  }
  return gt;
}
async function ft(e, t = !1) {
  return await Jr(), new Promise((n, s) => {
    var r, i;
    (i = (r = t && window.top ? window.top : window).require) == null || i.call(
      r,
      e,
      (...o) => n(o),
      s
    );
  });
}
async function pt(e, t = !1) {
  return (await ft([e], t))[0];
}
async function ps(e, t) {
  if (!t)
    return ps(e, Q());
  const n = Ur();
  return await (await pt("DS/i3DXCompassPlatformServices/i3DXCompassRegistryClient")).getServicesByPlatform({
    platforms: Array.isArray(t) ? [...t] : [t],
    services: e,
    config: { url: n }
  });
}
async function hn(e, t) {
  const n = await pt("DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices");
  function s(r) {
    return e ? !!r[e] : !0;
  }
  return new Promise((r, i) => {
    n.getPlatformServices({
      ...t,
      onComplete(o) {
        if (!o)
          return i(new Error("Platform not found"));
        if (Array.isArray(o)) {
          const a = o.filter(s);
          return a.length ? r(a) : i(new Error("Platform not found"));
        }
        return s(o) ? r(o) : i(new Error("Platform not found"));
      },
      onFailure: i
    });
  });
}
async function he(e, t) {
  var n, s, r;
  if (!t)
    return he(e, Q());
  const i = await ps([e], t);
  return i.length && ((r = (s = (n = i[0]) == null ? void 0 : n.services) == null ? void 0 : s.find((o) => o.id.toLowerCase() === e.toLowerCase())) == null ? void 0 : r.url) || "";
}
var M = /* @__PURE__ */ ((e) => (e.AIAI = "AIAssistantInfra", e.ANALYTICS = "3danalytics", e.COMPASS = "3DCompass", e.COMMENT = "3DComment", e.DASHBOARD = "3DDashboard", e.DRIVE = "3DDrive", e.LEAN = "3dlean", e.LLMINFERENCE = "LLMINFERENCE", e.MESSAGING = "3DMessaging", e.ODE = "OfficeDocumentEditor", e.ORGANIZATION = "3DOrganization", e.PASSPORT = "3DPassport", e.RTCOEDIT = "RTCoedit", e.SEARCH = "3DSearch", e.SOCIAL_MEDIA = "SocialMedia", e.SPACE = "3DSpace", e.SWYM = "3DSwym", e.TAGGER = "6WTAG", e.USERS_GROUP = "UsersGroup", e))(M || {});
class Xn extends Error {
  constructor(n, s, r) {
    const i = n.status || n.status === 0 ? n.status : "", o = n.statusText || "", a = `${i} ${o}`.trim(), l = a ? `status code ${a}` : "an unknown error";
    super(`Request failed with ${l}: ${s.method} ${s.url}`);
    ye(this, "response");
    ye(this, "request");
    ye(this, "options");
    this.name = "HTTPError", this.response = n, this.request = s, this.options = r;
  }
}
class hs extends Error {
  constructor(n) {
    super(`Request timed out: ${n.method} ${n.url}`);
    ye(this, "request");
    this.name = "TimeoutError", this.request = n;
  }
}
const nt = (e) => e !== null && typeof e == "object", bt = (...e) => {
  for (const t of e)
    if ((!nt(t) || Array.isArray(t)) && t !== void 0)
      throw new TypeError("The `options` argument must be an object");
  return On({}, ...e);
}, ms = (e = {}, t = {}) => {
  const n = new globalThis.Headers(e), s = t instanceof globalThis.Headers, r = new globalThis.Headers(t);
  for (const [i, o] of r.entries())
    s && o === "undefined" || o === void 0 ? n.delete(i) : n.set(i, o);
  return n;
};
function St(e, t, n) {
  return Object.hasOwn(t, n) && t[n] === void 0 ? [] : On(e[n] ?? [], t[n] ?? []);
}
const ys = (e = {}, t = {}) => ({
  beforeRequest: St(e, t, "beforeRequest"),
  beforeRetry: St(e, t, "beforeRetry"),
  afterResponse: St(e, t, "afterResponse"),
  beforeError: St(e, t, "beforeError")
}), On = (...e) => {
  let t = {}, n = {}, s = {};
  for (const r of e)
    if (Array.isArray(r))
      Array.isArray(t) || (t = []), t = [...t, ...r];
    else if (nt(r)) {
      for (let [i, o] of Object.entries(r))
        nt(o) && i in t && (o = On(t[i], o)), t = { ...t, [i]: o };
      nt(r.hooks) && (s = ys(s, r.hooks), t.hooks = s), nt(r.headers) && (n = ms(n, r.headers), t.headers = n);
    }
  return t;
}, Kr = (() => {
  let e = !1, t = !1;
  const n = typeof globalThis.ReadableStream == "function", s = typeof globalThis.Request == "function";
  if (n && s)
    try {
      t = new globalThis.Request("https://empty.invalid", {
        body: new globalThis.ReadableStream(),
        method: "POST",
        // @ts-expect-error - Types are outdated.
        get duplex() {
          return e = !0, "half";
        }
      }).headers.has("Content-Type");
    } catch (r) {
      if (r instanceof Error && r.message === "unsupported BodyInit type")
        return !1;
      throw r;
    }
  return e && !t;
})(), Zr = typeof globalThis.AbortController == "function", ei = typeof globalThis.ReadableStream == "function", ti = typeof globalThis.FormData == "function", vs = ["get", "post", "put", "patch", "head", "delete"], ni = {
  json: "application/json",
  text: "text/*",
  formData: "multipart/form-data",
  arrayBuffer: "*/*",
  blob: "*/*"
}, sn = 2147483647, ws = Symbol("stop"), si = {
  json: !0,
  parseJson: !0,
  stringifyJson: !0,
  searchParams: !0,
  prefixUrl: !0,
  retry: !0,
  timeout: !0,
  hooks: !0,
  throwHttpErrors: !0,
  onDownloadProgress: !0,
  fetch: !0
}, ri = {
  method: !0,
  headers: !0,
  body: !0,
  mode: !0,
  credentials: !0,
  cache: !0,
  redirect: !0,
  referrer: !0,
  referrerPolicy: !0,
  integrity: !0,
  keepalive: !0,
  signal: !0,
  window: !0,
  dispatcher: !0,
  duplex: !0,
  priority: !0
}, ii = (e) => vs.includes(e) ? e.toUpperCase() : e, oi = ["get", "put", "head", "delete", "options", "trace"], ai = [408, 413, 429, 500, 502, 503, 504], li = [413, 429, 503], Jn = {
  limit: 2,
  methods: oi,
  statusCodes: ai,
  afterStatusCodes: li,
  maxRetryAfter: Number.POSITIVE_INFINITY,
  backoffLimit: Number.POSITIVE_INFINITY,
  delay: (e) => 0.3 * 2 ** (e - 1) * 1e3
}, ci = (e = {}) => {
  if (typeof e == "number")
    return {
      ...Jn,
      limit: e
    };
  if (e.methods && !Array.isArray(e.methods))
    throw new Error("retry.methods must be an array");
  if (e.statusCodes && !Array.isArray(e.statusCodes))
    throw new Error("retry.statusCodes must be an array");
  return {
    ...Jn,
    ...e
  };
};
async function ui(e, t, n, s) {
  return new Promise((r, i) => {
    const o = setTimeout(() => {
      n && n.abort(), i(new hs(e));
    }, s.timeout);
    s.fetch(e, t).then(r).catch(i).then(() => {
      clearTimeout(o);
    });
  });
}
async function di(e, { signal: t }) {
  return new Promise((n, s) => {
    t && (t.throwIfAborted(), t.addEventListener("abort", r, { once: !0 }));
    function r() {
      clearTimeout(i), s(t.reason);
    }
    const i = setTimeout(() => {
      t == null || t.removeEventListener("abort", r), n();
    }, e);
  });
}
const fi = (e, t) => {
  const n = {};
  for (const s in t)
    !(s in ri) && !(s in si) && !(s in e) && (n[s] = t[s]);
  return n;
};
class Nt {
  // eslint-disable-next-line complexity
  constructor(t, n = {}) {
    ye(this, "request");
    ye(this, "abortController");
    ye(this, "_retryCount", 0);
    ye(this, "_input");
    ye(this, "_options");
    var s, r;
    if (this._input = t, this._options = {
      ...n,
      headers: ms(this._input.headers, n.headers),
      hooks: ys({
        beforeRequest: [],
        beforeRetry: [],
        beforeError: [],
        afterResponse: []
      }, n.hooks),
      method: ii(n.method ?? this._input.method),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      prefixUrl: String(n.prefixUrl || ""),
      retry: ci(n.retry),
      throwHttpErrors: n.throwHttpErrors !== !1,
      timeout: n.timeout ?? 1e4,
      fetch: n.fetch ?? globalThis.fetch.bind(globalThis)
    }, typeof this._input != "string" && !(this._input instanceof URL || this._input instanceof globalThis.Request))
      throw new TypeError("`input` must be a string, URL, or Request");
    if (this._options.prefixUrl && typeof this._input == "string") {
      if (this._input.startsWith("/"))
        throw new Error("`input` must not begin with a slash when using `prefixUrl`");
      this._options.prefixUrl.endsWith("/") || (this._options.prefixUrl += "/"), this._input = this._options.prefixUrl + this._input;
    }
    if (Zr) {
      this.abortController = new globalThis.AbortController();
      const i = this._options.signal ?? this._input.signal;
      i != null && i.aborted && this.abortController.abort(i == null ? void 0 : i.reason), i == null || i.addEventListener("abort", () => {
        this.abortController.abort(i.reason);
      }), this._options.signal = this.abortController.signal;
    }
    if (Kr && (this._options.duplex = "half"), this._options.json !== void 0 && (this._options.body = ((r = (s = this._options).stringifyJson) == null ? void 0 : r.call(s, this._options.json)) ?? JSON.stringify(this._options.json), this._options.headers.set("content-type", this._options.headers.get("content-type") ?? "application/json")), this.request = new globalThis.Request(this._input, this._options), this._options.searchParams) {
      const o = "?" + (typeof this._options.searchParams == "string" ? this._options.searchParams.replace(/^\?/, "") : new URLSearchParams(this._options.searchParams).toString()), a = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, o);
      (ti && this._options.body instanceof globalThis.FormData || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers["content-type"]) && this.request.headers.delete("content-type"), this.request = new globalThis.Request(new globalThis.Request(a, { ...this.request }), this._options);
    }
  }
  static create(t, n) {
    const s = new Nt(t, n), r = async () => {
      if (typeof s._options.timeout == "number" && s._options.timeout > sn)
        throw new RangeError(`The \`timeout\` option cannot be greater than ${sn}`);
      await Promise.resolve();
      let a = await s._fetch();
      for (const l of s._options.hooks.afterResponse) {
        const d = await l(s.request, s._options, s._decorateResponse(a.clone()));
        d instanceof globalThis.Response && (a = d);
      }
      if (s._decorateResponse(a), !a.ok && s._options.throwHttpErrors) {
        let l = new Xn(a, s.request, s._options);
        for (const d of s._options.hooks.beforeError)
          l = await d(l);
        throw l;
      }
      if (s._options.onDownloadProgress) {
        if (typeof s._options.onDownloadProgress != "function")
          throw new TypeError("The `onDownloadProgress` option must be a function");
        if (!ei)
          throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");
        return s._stream(a.clone(), s._options.onDownloadProgress);
      }
      return a;
    }, o = s._options.retry.methods.includes(s.request.method.toLowerCase()) ? s._retry(r) : r();
    for (const [a, l] of Object.entries(ni))
      o[a] = async () => {
        s.request.headers.set("accept", s.request.headers.get("accept") || l);
        const d = await o;
        if (a === "json") {
          if (d.status === 204 || (await d.clone().arrayBuffer()).byteLength === 0)
            return "";
          if (n.parseJson)
            return n.parseJson(await d.text());
        }
        return d[a]();
      };
    return o;
  }
  _calculateRetryDelay(t) {
    if (this._retryCount++, this._retryCount > this._options.retry.limit || t instanceof hs)
      throw t;
    if (t instanceof Xn) {
      if (!this._options.retry.statusCodes.includes(t.response.status))
        throw t;
      const s = t.response.headers.get("Retry-After") ?? t.response.headers.get("RateLimit-Reset") ?? t.response.headers.get("X-RateLimit-Reset") ?? t.response.headers.get("X-Rate-Limit-Reset");
      if (s && this._options.retry.afterStatusCodes.includes(t.response.status)) {
        let r = Number(s) * 1e3;
        Number.isNaN(r) ? r = Date.parse(s) - Date.now() : r >= Date.parse("2024-01-01") && (r -= Date.now());
        const i = this._options.retry.maxRetryAfter ?? r;
        return r < i ? r : i;
      }
      if (t.response.status === 413)
        throw t;
    }
    const n = this._options.retry.delay(this._retryCount);
    return Math.min(this._options.retry.backoffLimit, n);
  }
  _decorateResponse(t) {
    return this._options.parseJson && (t.json = async () => this._options.parseJson(await t.text())), t;
  }
  async _retry(t) {
    try {
      return await t();
    } catch (n) {
      const s = Math.min(this._calculateRetryDelay(n), sn);
      if (this._retryCount < 1)
        throw n;
      await di(s, { signal: this._options.signal });
      for (const r of this._options.hooks.beforeRetry)
        if (await r({
          request: this.request,
          options: this._options,
          error: n,
          retryCount: this._retryCount
        }) === ws)
          return;
      return this._retry(t);
    }
  }
  async _fetch() {
    for (const s of this._options.hooks.beforeRequest) {
      const r = await s(this.request, this._options);
      if (r instanceof Request) {
        this.request = r;
        break;
      }
      if (r instanceof Response)
        return r;
    }
    const t = fi(this.request, this._options), n = this.request;
    return this.request = n.clone(), this._options.timeout === !1 ? this._options.fetch(n, t) : ui(n, t, this.abortController, this._options);
  }
  /* istanbul ignore next */
  _stream(t, n) {
    const s = Number(t.headers.get("content-length")) || 0;
    let r = 0;
    return t.status === 204 ? (n && n({ percent: 1, totalBytes: s, transferredBytes: r }, new Uint8Array()), new globalThis.Response(null, {
      status: t.status,
      statusText: t.statusText,
      headers: t.headers
    })) : new globalThis.Response(new globalThis.ReadableStream({
      async start(i) {
        const o = t.body.getReader();
        n && n({ percent: 0, transferredBytes: 0, totalBytes: s }, new Uint8Array());
        async function a() {
          const { done: l, value: d } = await o.read();
          if (l) {
            i.close();
            return;
          }
          if (n) {
            r += d.byteLength;
            const u = s === 0 ? 0 : r / s;
            n({ percent: u, transferredBytes: r, totalBytes: s }, d);
          }
          i.enqueue(d), await a();
        }
        await a();
      }
    }), {
      status: t.status,
      statusText: t.statusText,
      headers: t.headers
    });
  }
}
/*! MIT License © Sindre Sorhus */
const mn = (e) => {
  const t = (n, s) => Nt.create(n, bt(e, s));
  for (const n of vs)
    t[n] = (s, r) => Nt.create(s, bt(e, r, { method: n }));
  return t.create = (n) => mn(bt(n)), t.extend = (n) => (typeof n == "function" && (n = n(e ?? {})), mn(bt(e, n))), t.stop = ws, t;
}, pi = mn();
async function hi(e, { redirectToPassportLogin: t } = { redirectToPassportLogin: !0 }) {
  const n = await he(M.PASSPORT);
  if (window.location.href.startsWith(n))
    return;
  const s = new URL(`${n}/logout`), r = window.location.href;
  if (t) {
    const i = new URL(`${n}/login`);
    i.searchParams.set("service", r), s.searchParams.set("redirect", btoa(i.toString()));
  } else
    s.searchParams.set("service", r);
  window.location.href = s.toString();
}
const mi = [
  "ERROR_ACCESS_FORBIDDEN_LICENSE_EXPIRED",
  "ERROR_ACCESS_FORBIDDEN_LICENSE_FULLY_CONSUMED",
  "ERROR_LICENSING_EXTENSION_KO",
  "ERROR_ACCESS_NO_LICENSE",
  "ERROR_ACCESS_FORBIDDEN_NO_LICENSE"
], yi = "GLOBAL_ERROR_EVENT", vi = "invalid_grant", wi = 400;
function qt(e, t) {
  return async (n, s, r) => {
    if (r.status !== wi)
      return;
    const i = await r.json();
    if (i.error !== vi)
      return;
    const { access_token: o } = await t(i.x3ds_auth_url, {
      handlePassportExpiredError: s.handlePassportExpiredError,
      headers: { "X-Request-Id": "" }
    }).json(), a = new URL(n.url).searchParams;
    return a.set("ticket", o), s.json && delete s.body, e(n.url, { ...s, searchParams: a });
  };
}
const _i = "invalid_client", gi = 401, bi = async (e, t, n) => {
  t.handlePassportExpiredError === !1 || n.status !== gi || (await n.json()).error !== _i || hi();
}, _s = 403, Si = "ERROR_ACCESS_FORBIDDEN_NOT_ACTIVE";
async function gs(e) {
  var t, n;
  let s, r;
  try {
    const { response: i } = e, a = ((t = i.headers.get("content-type")) == null ? void 0 : t.includes("application/json")) ? await i.clone().json() : null;
    s = (n = e.response) == null ? void 0 : n.status, r = a == null ? void 0 : a.errorcode;
  } catch {
  }
  return { errorCode: r, errorStatus: s };
}
const Ai = async (e) => {
  const { errorCode: t, errorStatus: n } = await gs(e);
  if (n !== _s || t !== Si)
    return e;
  const s = window.btoa(window.location.href).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, ""), r = Q(), o = `${await he(M.COMPASS, r)}/resources/AppsMngtSynchro/api/v1?service=3DSWYM&url=${s}&platform=${r}`;
  return window.location.href = o, e;
}, Ci = async (e) => {
  const { errorCode: t, errorStatus: n } = await gs(e);
  return n !== _s || !t || !mi.includes(t) || window.postMessage({
    event: yi,
    payload: { code: t, status: n }
  }), e;
}, He = "X-Request-ID", Ti = (e) => {
  e.headers.has(He) || e.headers.append(He, crypto.randomUUID()), e.headers.get(He) || e.headers.delete(He);
}, bs = (e) => {
  e.headers.has(He) && e.headers.delete(He);
}, be = pi.extend({
  credentials: "include",
  redirect: "error",
  headers: {
    "x-requested-with": "XMLHttpRequest",
    "content-type": "application/json;charset=UTF-8"
  },
  timeout: 25e3,
  hooks: {
    beforeRequest: [Ti],
    afterResponse: [bi]
  }
}), Ue = /* @__PURE__ */ new Map(), Rn = 5e3;
function yn(e, t) {
  return e.then((n) => (t.keepCacheOnSuccess || (t.timeMs ? setTimeout(() => {
    F.debug(`[decorator cache] [${t.key}] cache timeout`), Ue.delete(t.key);
  }, t.timeMs) : (F.debug(`[decorator cache] [${t.key}] cache timeout`), Ue.delete(t.key))), F.debug(`[decorator cache] [${t.key}] promise succeeded`), n)).catch((n) => {
    throw t.keepCacheOnError || (F.debug(`[decorator cache] [${t.key}] promise failed, clean the cache`), Ue.delete(t.key)), n;
  });
}
function ce(e, t, n = Rn) {
  if (!Ue.get(e) || !n) {
    F.debug(`[decorator cache] [${e}] cache missing, create it`);
    const s = yn(t(), { key: e, timeMs: n });
    Ue.set(e, s);
  }
  return F.debug(`[decorator cache] [${e}] cache exists`), Ue.get(e);
}
function Pi(e, t, n = Rn) {
  const s = yn(t(), { key: e, timeMs: n });
  return Ue.set(e, s), yn(s, { key: e, timeMs: n });
}
function Dn(e, t, n = Rn) {
  return Pi(e, () => Promise.resolve(t), n);
}
const Vt = /* @__PURE__ */ new Map();
function rn(e, t) {
  return ce(
    `csrf-${e}`,
    () => t("/api/session/info").json().then((n) => n.csrfToken),
    1
  );
}
async function on(e) {
  return e.status !== 403 ? !1 : (await e.clone().json()).errorcode === "ERROR_ACCESS_FORBIDDEN_CSRF_KO";
}
const Ss = "x-ds-iam-csrftoken";
async function Ei(e, t) {
  return (await t("/api/authenticated/user/fields")).headers.get(Ss);
}
async function $i(e) {
  return e.status !== 403 ? !1 : await e.clone().text() === "The CSRF token cannot be validated";
}
const As = "x-ds-csrftoken";
async function xi(e, t) {
  return (await t("/resources/3ddrive/v1/bos/DSROOT")).headers.get(As);
}
async function ki(e) {
  return e.status === 403;
}
const Wt = {
  [M.PASSPORT]: {
    header: Ss,
    fetch: Ei,
    checkIsCsrfError: $i
  },
  [M.DRIVE]: {
    header: As,
    fetch: xi,
    checkIsCsrfError: ki
  },
  [M.SPACE]: {
    header: "x-ds-csrftoken",
    fetch: void 0,
    checkIsCsrfError: void 0
  },
  [M.SWYM]: {
    header: "x-ds-swym-csrftoken",
    fetch: rn,
    checkIsCsrfError: on
  },
  [M.COMMENT]: {
    header: "x-ds-swym-csrftoken",
    fetch: rn,
    checkIsCsrfError: on
  },
  [M.SEARCH]: {
    header: "x-ds-swym-csrftoken",
    fetch: rn,
    checkIsCsrfError: on
  }
};
function Cs(e, t) {
  Vt.set(e, t || sessionStorage.getItem(`${e}_csrf`) || ""), t && sessionStorage.setItem(`${e}_csrf`, t);
}
function Ts(e) {
  return async (t, n) => {
    const s = Vt.get(e);
    if (!s)
      return;
    const r = Wt[e].header;
    t.headers.set(r, s), n.headers.set(r, s);
  };
}
function Ii(e, t) {
  if (t.status < 300) {
    const n = t.headers.get(Wt[e].header);
    n && Cs(e, n);
  }
}
async function Oi(e, t) {
  var n, s;
  try {
    const r = await ((s = (n = Wt[e]).fetch) == null ? void 0 : s.call(n, e, t));
    r && Cs(e, r);
  } catch (r) {
    F.error(`Failed to fetch CSRF for ${e}`, r);
  }
}
function Nn(e, t) {
  return async (n, s, r) => {
    var i, o;
    if (Ii(e, r), !await ((o = (i = Wt[e]).checkIsCsrfError) == null ? void 0 : o.call(i, r)))
      return;
    await Oi(e, t), s.json && delete s.body;
    const { Preferences: l } = await import("./index-BsVw5Qh_.js"), { CommonRequest: d } = await import("./index-DseAKqIK.js");
    if (l.isNativeApp() && d.checkHasProxyPath(n.url)) {
      const c = new URL(n.url).searchParams.get("url");
      if (c)
        return t(c, s);
    }
    return t(n, s);
  };
}
function Ht(e, t = "") {
  return async (n, s) => {
    const { CommonRequest: r } = await import("./index-DseAKqIK.js"), { Preferences: i } = await import("./index-BsVw5Qh_.js");
    if (r.checkHasProxyPath(n.url))
      return;
    const o = new Request(await he(e) || t).url;
    if (n.url.startsWith(o))
      return i.isNativeApp() ? await r.request(
        n.url,
        { ...s, proxy: "passport" },
        n
      ) : void 0;
    const a = new URL(n.url), l = `${o}${a.pathname}${a.search}`.replace(/([^:]\/)\/+/g, "$1"), d = new Request(l, s);
    return i.isNativeApp() ? await r.request(
      l,
      { ...s, proxy: "passport" },
      d
    ) : d;
  };
}
function Ri(e, t = "i18n!DS/SwymVueComponents/assets/nls/", n) {
  const s = b({}), r = new Promise(async (o) => {
    try {
      const a = await pt(`${t}${e}`);
      s.value = Object.assign(f(s), a);
    } catch {
      F.error(`[TRANSLATION] Error loading nls ${t}${e}`);
    }
    o(s.value);
  });
  function i(o, a = {}) {
    if (!o)
      return "";
    let l = f(s)[o];
    return Object.entries(a).forEach(([d, u]) => {
      l = l == null ? void 0 : l.replace(`{${d}}`, u);
    }), l || o;
  }
  return { i18n: s, $i18n: i, promise: r };
}
const Di = "380px", Ni = "465px", Mi = "640px", Li = "768px", Ui = "1024px", Fi = "1280px", ji = {
  "2xs": "300px",
  xs: Di,
  tiny: Ni,
  sm: Mi,
  md: Li,
  "2md": "960px",
  lg: Ui,
  xl: Fi,
  "2xl": "1536px",
  "3xl": "1920px"
}, Bi = (() => {
  const e = {};
  for (const [t, n] of Object.entries(ji))
    e[t] = Number.parseInt(n, 10);
  return Object.freeze(e);
})();
function qi() {
  var e;
  try {
    return (e = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : e.cookie.split(";").map((t) => t.split("=")).reduce((t, [n, s]) => (t[decodeURIComponent(n == null ? void 0 : n.trim())] = decodeURIComponent(s == null ? void 0 : s.trim()), t), {});
  } catch {
    return {};
  }
}
function Vi() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function Wi() {
  const e = navigator.userAgent.toLowerCase();
  return /iphone|ipad/i.test(e) || /safari/.test(e) && !/chrome/.test(e) && Vi();
}
function Hi() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || Wi();
}
function zi(e) {
  return new DOMParser().parseFromString(e || "", "text/html").documentElement.textContent || "";
}
function Mn(e) {
  return xn() ? (kn(e), !0) : !1;
}
function Ce(e) {
  return typeof e == "function" ? e() : f(e);
}
const Ps = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Gi = (e) => e != null, Es = () => {
};
function Yi(e, t) {
  var n;
  if (typeof e == "number")
    return e + t;
  const s = ((n = e.match(/^-?\d+\.?\d*/)) == null ? void 0 : n[0]) || "", r = e.slice(s.length), i = Number.parseFloat(s) + t;
  return Number.isNaN(i) ? e : i + r;
}
function $s(e) {
  return ct();
}
function Qi(...e) {
  if (e.length !== 1)
    return Fe(...e);
  const t = e[0];
  return typeof t == "function" ? Ut(us(() => ({ get: t, set: Es }))) : b(t);
}
function Xi(e, t) {
  $s() && Ft(e, t);
}
function Ji(e, t = !0, n) {
  $s() ? Ie(e, n) : t ? e() : ds(e);
}
function Ki(e = !1, t = {}) {
  const {
    truthyValue: n = !0,
    falsyValue: s = !1
  } = t, r = fe(e), i = b(e);
  function o(a) {
    if (arguments.length)
      return i.value = a, i.value;
    {
      const l = Ce(n);
      return i.value = i.value === l ? Ce(s) : l, i.value;
    }
  }
  return r ? o : [i, o];
}
function vn(e, t, n) {
  return G(
    e,
    (r, i, o) => {
      r && t(r, i, o);
    },
    {
      ...n,
      once: !1
    }
  );
}
function Zi(e, t, n) {
  let s;
  fe(n) ? s = {
    evaluating: n
  } : s = {};
  const {
    lazy: r = !1,
    evaluating: i = void 0,
    shallow: o = !0,
    onError: a = Es
  } = s, l = b(!r), d = o ? it(t) : b(t);
  let u = 0;
  return jt(async (c) => {
    if (!l.value)
      return;
    u++;
    const h = u;
    let v = !1;
    i && Promise.resolve().then(() => {
      i.value = !0;
    });
    try {
      const y = await e((p) => {
        c(() => {
          i && (i.value = !1), v || p();
        });
      });
      h === u && (d.value = y);
    } catch (y) {
      a(y);
    } finally {
      i && h === u && (i.value = !1), v = !0;
    }
  }), r ? A(() => (l.value = !0, d.value)) : d;
}
const ht = Ps ? window : void 0, eo = Ps ? window.document : void 0;
function De(e) {
  var t;
  const n = Ce(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
function to() {
  const e = b(!1), t = ct();
  return t && Ie(() => {
    e.value = !0;
  }, t), e;
}
function Ln(e) {
  const t = to();
  return A(() => (t.value, !!e()));
}
function no(e, t, n = {}) {
  const { window: s = ht, ...r } = n;
  let i;
  const o = Ln(() => s && "MutationObserver" in s), a = () => {
    i && (i.disconnect(), i = void 0);
  }, l = A(() => {
    const h = Ce(e), v = (Array.isArray(h) ? h : [h]).map(De).filter(Gi);
    return new Set(v);
  }), d = G(
    () => l.value,
    (h) => {
      a(), o.value && h.size && (i = new MutationObserver(t), h.forEach((v) => i.observe(v, r)));
    },
    { immediate: !0, flush: "post" }
  ), u = () => i == null ? void 0 : i.takeRecords(), c = () => {
    d(), a();
  };
  return Mn(c), {
    isSupported: o,
    stop: c,
    takeRecords: u
  };
}
function Ke(e, t = {}) {
  const { window: n = ht } = t, s = Ln(() => n && "matchMedia" in n && typeof n.matchMedia == "function");
  let r;
  const i = b(!1), o = (d) => {
    i.value = d.matches;
  }, a = () => {
    r && ("removeEventListener" in r ? r.removeEventListener("change", o) : r.removeListener(o));
  }, l = jt(() => {
    s.value && (a(), r = n.matchMedia(Ce(e)), "addEventListener" in r ? r.addEventListener("change", o) : r.addListener(o), i.value = r.matches);
  });
  return Mn(() => {
    l(), a(), r = void 0;
  }), i;
}
function so(e, t = {}) {
  function n(u, c) {
    let h = Ce(e[Ce(u)]);
    return c != null && (h = Yi(h, c)), typeof h == "number" && (h = `${h}px`), h;
  }
  const { window: s = ht, strategy: r = "min-width" } = t;
  function i(u) {
    return s ? s.matchMedia(u).matches : !1;
  }
  const o = (u) => Ke(() => `(min-width: ${n(u)})`, t), a = (u) => Ke(() => `(max-width: ${n(u)})`, t), l = Object.keys(e).reduce((u, c) => (Object.defineProperty(u, c, {
    get: () => r === "min-width" ? o(c) : a(c),
    enumerable: !0,
    configurable: !0
  }), u), {});
  function d() {
    const u = Object.keys(e).map((c) => [c, o(c)]);
    return A(() => u.filter(([, c]) => c.value).map(([c]) => c));
  }
  return Object.assign(l, {
    greaterOrEqual: o,
    smallerOrEqual: a,
    greater(u) {
      return Ke(() => `(min-width: ${n(u, 0.1)})`, t);
    },
    smaller(u) {
      return Ke(() => `(max-width: ${n(u, -0.1)})`, t);
    },
    between(u, c) {
      return Ke(() => `(min-width: ${n(u)}) and (max-width: ${n(c, -0.1)})`, t);
    },
    isGreater(u) {
      return i(`(min-width: ${n(u, 0.1)})`);
    },
    isGreaterOrEqual(u) {
      return i(`(min-width: ${n(u)})`);
    },
    isSmaller(u) {
      return i(`(max-width: ${n(u, -0.1)})`);
    },
    isSmallerOrEqual(u) {
      return i(`(max-width: ${n(u)})`);
    },
    isInBetween(u, c) {
      return i(`(min-width: ${n(u)}) and (max-width: ${n(c, -0.1)})`);
    },
    current: d,
    active() {
      const u = d();
      return A(() => u.value.length === 0 ? "" : u.value.at(-1));
    }
  });
}
function ro(e, t, n = {}) {
  const { window: s = ht, ...r } = n;
  let i;
  const o = Ln(() => s && "ResizeObserver" in s), a = () => {
    i && (i.disconnect(), i = void 0);
  }, l = A(() => {
    const c = Ce(e);
    return Array.isArray(c) ? c.map((h) => De(h)) : [De(c)];
  }), d = G(
    l,
    (c) => {
      if (a(), o.value && s) {
        i = new ResizeObserver(t);
        for (const h of c)
          h && i.observe(h, r);
      }
    },
    { immediate: !0, flush: "post" }
  ), u = () => {
    a(), d();
  };
  return Mn(u), {
    isSupported: o,
    stop: u
  };
}
function io(e, t = { width: 0, height: 0 }, n = {}) {
  const { window: s = ht, box: r = "content-box" } = n, i = A(() => {
    var c, h;
    return (h = (c = De(e)) == null ? void 0 : c.namespaceURI) == null ? void 0 : h.includes("svg");
  }), o = b(t.width), a = b(t.height), { stop: l } = ro(
    e,
    ([c]) => {
      const h = r === "border-box" ? c.borderBoxSize : r === "content-box" ? c.contentBoxSize : c.devicePixelContentBoxSize;
      if (s && i.value) {
        const v = De(e);
        if (v) {
          const y = v.getBoundingClientRect();
          o.value = y.width, a.value = y.height;
        }
      } else if (h) {
        const v = Array.isArray(h) ? h : [h];
        o.value = v.reduce((y, { inlineSize: p }) => y + p, 0), a.value = v.reduce((y, { blockSize: p }) => y + p, 0);
      } else
        o.value = c.contentRect.width, a.value = c.contentRect.height;
    },
    n
  );
  Ji(() => {
    const c = De(e);
    c && (o.value = "offsetWidth" in c ? c.offsetWidth : t.width, a.value = "offsetHeight" in c ? c.offsetHeight : t.height);
  });
  const d = G(
    () => De(e),
    (c) => {
      o.value = c ? t.width : 0, a.value = c ? t.height : 0;
    }
  );
  function u() {
    l(), d();
  }
  return {
    width: o,
    height: a,
    stop: u
  };
}
function oo(e = null, t = {}) {
  var n, s, r;
  const {
    document: i = eo,
    restoreOnUnmount: o = (c) => c
  } = t, a = (n = i == null ? void 0 : i.title) != null ? n : "", l = Qi((s = e ?? (i == null ? void 0 : i.title)) != null ? s : null), d = e && typeof e == "function";
  function u(c) {
    if (!("titleTemplate" in t))
      return c;
    const h = t.titleTemplate || "%s";
    return typeof h == "function" ? h(c) : Ce(h).replace(/%s/g, c);
  }
  return G(
    l,
    (c, h) => {
      c !== h && i && (i.title = u(typeof c == "string" ? c : ""));
    },
    { immediate: !0 }
  ), t.observe && !t.titleTemplate && i && !d && no(
    (r = i.head) == null ? void 0 : r.querySelector("title"),
    () => {
      i && i.title !== l.value && (l.value = u(i.title));
    },
    { childList: !0 }
  ), Xi(() => {
    if (o) {
      const c = o(a, l.value || "");
      c != null && i && (i.title = c);
    }
  }), l;
}
const xs = b(""), ao = b("");
oo(xs);
Ut(xs);
Ut(ao);
var Id = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function lo(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Be(e, t) {
  var n, s;
  if (typeof t == "function")
    s = t(e), s !== void 0 && (e = s);
  else if (Array.isArray(t))
    for (n = 0; n < t.length; n++)
      s = t[n](e), s !== void 0 && (e = s);
  return e;
}
function co(e, t) {
  return e[0] === "-" && Array.isArray(t) && /^-\d+$/.test(e) ? t.length + parseInt(e, 10) : e;
}
function uo(e) {
  return /^\d+$/.test(e);
}
function xt(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function st(e) {
  return Object(e) === e;
}
function kt(e) {
  return Object.keys(e).length === 0;
}
var fo = ["__proto__", "prototype", "constructor"], po = function(e) {
  return fo.indexOf(e) === -1;
};
function zt(e, t) {
  e.indexOf("[") >= 0 && (e = e.replace(/\[/g, t).replace(/]/g, ""));
  var n = e.split(t), s = n.filter(po);
  if (s.length !== n.length)
    throw Error("Refusing to update blacklisted property " + e);
  return n;
}
var Kn = Object.prototype.hasOwnProperty;
function R(e, t, n, s) {
  if (!(this instanceof R))
    return new R(e, t, n, s);
  typeof t > "u" && (t = !1), typeof n > "u" && (n = !0), typeof s > "u" && (s = !0), this.separator = e || ".", this.override = t, this.useArray = n, this.useBrackets = s, this.keepArray = !1, this.cleanup = [];
}
var ze = new R(".", !1, !0, !0);
function me(e) {
  return function() {
    return ze[e].apply(ze, arguments);
  };
}
R.prototype._fill = function(e, t, n, s) {
  var r = e.shift();
  if (e.length > 0) {
    if (t[r] = t[r] || (this.useArray && uo(e[0]) ? [] : {}), !st(t[r]))
      if (this.override)
        t[r] = {};
      else {
        if (!(st(n) && kt(n)))
          throw new Error(
            "Trying to redefine `" + r + "` which is a " + typeof t[r]
          );
        return;
      }
    this._fill(e, t[r], n, s);
  } else {
    if (!this.override && st(t[r]) && !kt(t[r])) {
      if (!(st(n) && kt(n)))
        throw new Error("Trying to redefine non-empty obj['" + r + "']");
      return;
    }
    t[r] = Be(n, s);
  }
};
R.prototype.object = function(e, t) {
  var n = this;
  return Object.keys(e).forEach(function(s) {
    var r = t === void 0 ? null : t[s], i = zt(s, n.separator).join(n.separator);
    i.indexOf(n.separator) !== -1 ? (n._fill(i.split(n.separator), e, e[s], r), delete e[s]) : e[s] = Be(e[s], r);
  }), e;
};
R.prototype.str = function(e, t, n, s) {
  var r = zt(e, this.separator).join(this.separator);
  return e.indexOf(this.separator) !== -1 ? this._fill(r.split(this.separator), n, t, s) : n[e] = Be(t, s), n;
};
R.prototype.pick = function(e, t, n, s) {
  var r, i, o, a, l;
  for (i = zt(e, this.separator), r = 0; r < i.length; r++)
    if (a = co(i[r], t), t && typeof t == "object" && a in t) {
      if (r === i.length - 1)
        return n ? (o = t[a], s && Array.isArray(t) ? t.splice(a, 1) : delete t[a], Array.isArray(t) && (l = i.slice(0, -1).join("."), this.cleanup.indexOf(l) === -1 && this.cleanup.push(l)), o) : t[a];
      t = t[a];
    } else
      return;
  return n && Array.isArray(t) && (t = t.filter(function(d) {
    return d !== void 0;
  })), t;
};
R.prototype.delete = function(e, t) {
  return this.remove(e, t, !0);
};
R.prototype.remove = function(e, t, n) {
  var s;
  if (this.cleanup = [], Array.isArray(e)) {
    for (s = 0; s < e.length; s++)
      this.pick(e[s], t, !0, n);
    return n || this._cleanup(t), t;
  } else
    return this.pick(e, t, !0, n);
};
R.prototype._cleanup = function(e) {
  var t, n, s, r;
  if (this.cleanup.length) {
    for (n = 0; n < this.cleanup.length; n++)
      s = this.cleanup[n].split("."), r = s.splice(0, -1).join("."), t = r ? this.pick(r, e) : e, t = t[s[0]].filter(function(i) {
        return i !== void 0;
      }), this.set(this.cleanup[n], t, e);
    this.cleanup = [];
  }
};
R.prototype.del = R.prototype.remove;
R.prototype.move = function(e, t, n, s, r) {
  return typeof s == "function" || Array.isArray(s) ? this.set(t, Be(this.pick(e, n, !0), s), n, r) : (r = s, this.set(t, this.pick(e, n, !0), n, r)), n;
};
R.prototype.transfer = function(e, t, n, s, r, i) {
  return typeof r == "function" || Array.isArray(r) ? this.set(
    t,
    Be(this.pick(e, n, !0), r),
    s,
    i
  ) : (i = r, this.set(t, this.pick(e, n, !0), s, i)), s;
};
R.prototype.copy = function(e, t, n, s, r, i) {
  return typeof r == "function" || Array.isArray(r) ? this.set(
    t,
    Be(
      // clone what is picked
      JSON.parse(JSON.stringify(this.pick(e, n, !1))),
      r
    ),
    s,
    i
  ) : (i = r, this.set(t, this.pick(e, n, !1), s, i)), s;
};
R.prototype.set = function(e, t, n, s) {
  var r, i, o, a;
  if (typeof t > "u")
    return n;
  for (o = zt(e, this.separator), r = 0; r < o.length; r++) {
    if (a = o[r], r === o.length - 1)
      if (s && xt(t) && xt(n[a]))
        for (i in t)
          Kn.call(t, i) && (n[a][i] = t[i]);
      else if (s && Array.isArray(n[a]) && Array.isArray(t))
        for (var l = 0; l < t.length; l++)
          n[o[r]].push(t[l]);
      else
        n[a] = t;
    else // force the value to be an object
    (!Kn.call(n, a) || !xt(n[a]) && !Array.isArray(n[a])) && (/^\d+$/.test(o[r + 1]) ? n[a] = [] : n[a] = {});
    n = n[a];
  }
  return n;
};
R.prototype.transform = function(e, t, n) {
  return t = t || {}, n = n || {}, Object.keys(e).forEach(
    (function(s) {
      this.set(e[s], this.pick(s, t), n);
    }).bind(this)
  ), n;
};
R.prototype.dot = function(e, t, n) {
  t = t || {}, n = n || [];
  var s = Array.isArray(e);
  return Object.keys(e).forEach(
    (function(r) {
      var i = s && this.useBrackets ? "[" + r + "]" : r;
      if (st(e[r]) && (xt(e[r]) && !kt(e[r]) || Array.isArray(e[r]) && !this.keepArray && e[r].length !== 0))
        if (s && this.useBrackets) {
          var o = n[n.length - 1] || "";
          return this.dot(
            e[r],
            t,
            n.slice(0, -1).concat(o + i)
          );
        } else
          return this.dot(e[r], t, n.concat(i));
      else
        s && this.useBrackets ? t[n.join(this.separator).concat("[" + r + "]")] = e[r] : t[n.concat(i).join(this.separator)] = e[r];
    }).bind(this)
  ), t;
};
R.pick = me("pick");
R.move = me("move");
R.transfer = me("transfer");
R.transform = me("transform");
R.copy = me("copy");
R.object = me("object");
R.str = me("str");
R.set = me("set");
R.delete = me("delete");
R.del = R.remove = me("remove");
R.dot = me("dot");
["override", "overwrite"].forEach(function(e) {
  Object.defineProperty(R, e, {
    get: function() {
      return ze.override;
    },
    set: function(t) {
      ze.override = !!t;
    }
  });
});
["useArray", "keepArray", "useBrackets"].forEach(function(e) {
  Object.defineProperty(R, e, {
    get: function() {
      return ze[e];
    },
    set: function(t) {
      ze[e] = t;
    }
  });
});
R._process = Be;
var ho = R;
const Ne = /* @__PURE__ */ lo(ho), mo = [
  ["ds6w:resourceUid", "uid"],
  ["firstName", "first_name"],
  ["lastName", "last_name"],
  ["ut_state", "user_state"]
];
function Un(e = {}) {
  const t = e;
  return mo.forEach(([n, s]) => {
    Ne.move(n, s, e);
  }), t.displayName || (t.displayName = e.first_name && e.last_name ? `${e.first_name} ${e.last_name}` : e.fullName || e.login || e.username || ""), t;
}
var T = /* @__PURE__ */ ((e) => (e.Post = "post", e.Idea = "idea", e.Question = "iquestion", e.Media = "media", e.Conference = "conference", e.Survey = "survey", e.Wedo = "wedo", e.Wiki = "wiki", e.WikiTree = "wikitree", e.DerivedPost = "derivedpost", e.DerivedIdea = "derivedidea", e.Rituals = "conferencetemplate", e.Streaming = "meetingstreaming", e))(T || {}), yo = /* @__PURE__ */ ((e) => (e.POST = "Post", e.MEDIA = "RichMedia", e.QUESTION = "Question", e.WIKI = "WikitreePage", e.IDEA = "Idea", e.COMMUNITY = "Community", e))(yo || {}), It = /* @__PURE__ */ ((e) => (e.Answered = "Answered", e.Validated = "Validated", e.NotAnswered = "Unanswered", e))(It || {}), ve = /* @__PURE__ */ ((e) => (e.Published = "Created", e.Commented = "Commented", e.Answered = "Answered", e.Revised = "Updated", e.Edited = "Edited", e.Ended = "Ended", e.Started = "Started", e.StatusChanged = "Status Changed", e.Validated = "Answer Validated", e))(ve || {});
function vo(e, t = {}) {
  const n = {
    communitypost: T.Post,
    media: T.Media,
    qnaquestion: T.Question,
    qnaanswer: T.Question,
    idea: T.Idea,
    wikitree: T.Wiki,
    wedo: T.Wedo,
    dsxplan: T.Wedo,
    uuid: T.Wedo,
    conference: T.Conference,
    survey: T.Survey
  }, [s] = e.split(":").splice(-2, 1);
  return n[s];
}
function wo(e, t = {}) {
  return {
    post: T.Post,
    media: T.Media,
    question: T.Question,
    iquestion: T.Question,
    ideation: T.Idea,
    idea: T.Idea
  }[e];
}
const _o = [
  ["_community.id", "community_id"],
  // community subject uri for community content
  ["_community.subject6wuri", "community_subject_uri"],
  // community subject uri for conversation content
  ["_community.uri", "community_subject_uri"],
  ["container_uri", "community_subject_uri"],
  ["_community.community_type", "community_type"],
  ["_community.title", "community_title"],
  ["preview_original_width", "preview.width"],
  ["preview_original_height", "preview.height"],
  ["preview_media_processing_version", "preview.processing_version"],
  ["preview_media_processing_status", "preview.status"],
  ["preview_media_type", "preview.type"],
  ["media_type", "preview.type"],
  ["preview_media_file_ext", "preview.media_file_ext"],
  ["preview_fingerprint", "preview.preview_fingerprint"],
  ["thumbnail_subject6wuri", "thumbnail_id"],
  ["thumbnail_id", "preview.subject_uri"],
  ["status.id", "status_id"],
  ["status.color", "status_color"],
  ["status.title", "status_title"]
], go = [
  ["model_id", "id"],
  ["subject6wuri", "subject_uri"],
  ["publish_date", "published_at"],
  ["pubdate", "published_at"],
  ["creation_date", "created_at"],
  ["crdate", "created_at"],
  ["update", "updated_at"],
  ["modification_date", "updated_at"],
  ["moderation_date", "moderated_at"],
  ["body", "description"],
  ["question", "description"],
  ["message", "description"],
  // content from my contributions API
  ["container", "_community"],
  ["thumbnailsInfos", "thumbnails_infos"],
  ["views", "stats_viewed"]
  // API V2
], bo = [
  ["preview_original_width", "width"],
  ["preview_original_height", "height"],
  ["preview_media_processing_version", "processing_version"],
  ["preview_media_processing_status", "status"]
  // content from my contributions API
], So = [
  ["media_type", "type"]
];
function ge(e) {
  return e && !e.includes("T") && !e.endsWith("Z") && !e.startsWith("0000") ? (/* @__PURE__ */ new Date(`${e.split(" ").join("T")}Z`)).toISOString() : e && e.startsWith("0000") ? "" : e ?? "";
}
function Fn(e) {
  return { ...e, result: Ao(e.result) };
}
function Ao(e) {
  var n;
  const t = { ...e };
  return go.forEach(([s, r]) => {
    Ne.move(
      s,
      r,
      t
    );
  }), _o.forEach(([s, r]) => {
    Ne.copy(
      s,
      r,
      t,
      t
    );
  }), t.created_at = ge(t.created_at), t.updated_at = ge(t.updated_at), t.moderated_at = ge(t.moderated_at), t.published_at = ge(t.published_at), t.model = vo(
    t.subject_uri,
    { derived_type: t.derived_type }
  ), t.author && (t.author = Un(e.author)), t.published === void 0 && (t.published = !0), t.publication_state === "DRAFT" && (t.published = !1), t.model === T.Media && (bo.forEach(([s, r]) => {
    Ne.move(
      s,
      r,
      t
    );
  }), So.forEach(([s, r]) => {
    Ne.copy(
      s,
      r,
      t,
      t
    );
  })), ((n = e._community) == null ? void 0 : n.community_type) === "externaldm" && (t.community_type = "dm"), !t.community_subject_uri && t.community_id && (t.community_subject_uri = e.community_id), ["visibility", "published"].forEach((s) => {
    Object.prototype.hasOwnProperty.call(t, s) && typeof t[s] == "string" && (t[s] = Number.parseInt(t[s], 10));
  }), ["published"].forEach((s) => {
    Object.prototype.hasOwnProperty.call(t, s) && (t[s] = !!t[s]);
  }), t;
}
var we = /* @__PURE__ */ ((e) => (e.Published = "swym:eventAction.swym_event_action_publish", e.Commented = "swym:eventAction.swym_event_action_comment", e.Answered = "swym:eventAction.swym_event_action_answer", e.Revised = "swym:eventAction.swym_event_action_edit_wiki", e.Edited = "swym:eventAction.swym_event_action_edit", e.Ended = "swym:eventAction.swym_event_action_survey_closed", e.Started = "swym:eventAction.swym_event_action_survey_opened", e.StatusChanged = "swym:eventAction.swym_event_action_change_status", e.Validated = "swym:eventAction.swym_event_action_validate", e))(we || {});
function Co(e) {
  return {
    [we.Published]: ve.Published,
    [we.Commented]: ve.Commented,
    [we.Answered]: ve.Answered,
    [we.Revised]: ve.Revised,
    [we.Edited]: ve.Edited,
    [we.Ended]: ve.Ended,
    [we.Started]: ve.Started,
    [we.StatusChanged]: ve.StatusChanged,
    [we.Validated]: ve.Validated
  }[e] || e;
}
function jn(e) {
  return e.hits.map((t) => Object.fromEntries(t.metas.map((n) => [n.name, n.value])));
}
const To = (e) => jn(e).map((s) => ({
  id: s.id,
  subject_uri: s.ds6w_58_resourceUid || `${s.ds6w_58_containerUid}:${s.resourceid}`,
  created_at: ge(s.crdate),
  updated_at: ge(s.update)
})), Zn = (e) => {
  const t = jn(e), n = To(e), s = {
    posts: T.Post,
    media: T.Media,
    iquestion: T.Question,
    "iquestion question": T.Question,
    idea: T.Idea
  };
  return t.map((i, o) => {
    const a = s[(i.swym_source || "").toLowerCase()] || T.Post, l = {
      ...n[o],
      description: "",
      community_type: i.community_type,
      moderated_at: "",
      stats_viewed: 0,
      moderation_status: i.moderation_status,
      title: i.title || i.ds6w_58_label,
      // FIXME: Default params
      enhanced_summary: i.enhanced_summary,
      community_id: i.community_id,
      community_subject_uri: i.ds6w_58_containerUid,
      community_title: i.ds6w_58_community,
      conversation_title: i.ds6w_58_datasource,
      preview_fingerprint: i.preview_fingerprint,
      thumbnail_id: i.preview_media_id,
      preview_media_processing_version: Number.parseInt(i.preview_media_processing_version, 10),
      preview_media_processing_status: i.preview_media_processing_status,
      preview_original_width: Number.parseInt(i.preview_original_width, 10),
      preview_original_height: Number.parseInt(i.preview_original_height, 10),
      preview_url: i.preview_url || "",
      model: a,
      published_at: ge(i.pubdate),
      author: {
        uid: "",
        first_name: i.user_firstname,
        last_name: i.user_lastname,
        displayName: `${i.user_firstname} ${i.user_lastname}`,
        login: i.username,
        user_state: i.ut_state
      },
      last_contributed_at: ge(i.ds6w_58_lastcontributed_date),
      last_contributed_event: Co(i.ds6w_58_lastcontributed_event),
      last_contributed_author: {
        uid: "",
        displayName: `${i.ds6w_58_lastcontributed_user_firstname} ${i.ds6w_58_lastcontributed_user_lastname}`,
        last_name: i.ds6w_58_lastcontributed_user_lastname,
        first_name: i.ds6w_58_lastcontributed_user_firstname,
        login: i.ds6w_58_lastcontributed_user_login
      },
      published: i.swym_58_publicationState !== "Draft"
      // maturity: extract.question_type || extract.wedo_status,
    };
    return a === T.Media ? Object.assign(l, Eo(i)) : a === T.Idea ? Object.assign(l, Po(i)) : a === T.Question && Object.assign(l, xo(i)), l;
  });
};
function Po(e) {
  return {
    model: T.Idea,
    status_title: e.status_title,
    status_color: e.ideation_color
  };
}
function Eo(e) {
  return {
    status: e.preview_media_processing_status,
    width: Number.parseInt(e.preview_original_width),
    height: Number.parseInt(e.preview_original_height),
    media_type: e.media_type,
    // TO REFACTOR
    type: e.media_type,
    file_ext: e.preview_media_file_ext
  };
}
const $o = {
  answeredbutnotvalidated: It.Answered,
  validated: It.Validated,
  notanswered: It.NotAnswered
};
function xo(e) {
  return {
    maturity: $o[e.question_type]
  };
}
const ko = [
  ["model_id", "subject_uri"],
  ["community_intranet_access", "access"],
  ["uri", "subject_uri"],
  ["subject6wuri", "subject_uri"]
  // ['communityUri', '_community.id'],
  // ['communityTitle', '_community.title'],
];
function Io(e) {
  if (ko.forEach(([t, n]) => {
    Ne.move(t, n, e);
  }), typeof e.access == "string") {
    switch (e.access) {
      case "Public":
        e.access = 1;
        break;
      case "Private":
        e.access = 0;
        break;
      case "Secret":
        e.access = 4;
        break;
      default:
        e.access = Number.parseInt(e.access);
        break;
    }
    [
      "access",
      "extranet_access",
      "tenant_user_status",
      "user_access",
      "stats_min_acl",
      "post_min_acl",
      "media_min_acl",
      "ideation_min_acl",
      "qna_min_acl",
      "wiki_min_acl",
      "wedo_min_acl",
      "survey_min_acl",
      "conference_min_acl"
    ].forEach((t) => {
      t in e && (e[t] = Number.parseInt(e[t], 10));
    });
  }
  return e.default_type_for_creation && (e.default_type_for_creation = wo(e.default_type_for_creation.toLowerCase())), e;
}
function wn(e) {
  return e.result = Io(e.result), e;
}
const Oo = async (e) => {
  var r;
  const { response: t } = e, s = ((r = t.headers.get("content-type")) == null ? void 0 : r.includes("application/json")) ? await t.clone().json() : null;
  if (s)
    if (s.errorcode) {
      const i = e;
      return i.errorcode = `${s.errorcode}`, i.errorid = `${s.errorid}`, i.errormsg = `${s.errormsg}`, i;
    } else
      e.data = s;
  return e;
}, te = be.extend({
  hooks: {
    beforeRequest: [
      Ts(M.SWYM),
      Ht(M.SWYM)
    ],
    afterResponse: [
      (...e) => Nn(M.SWYM, te)(...e),
      (...e) => qt(te, be)(...e)
    ],
    beforeError: [
      Ai,
      Ci,
      Oo
    ]
  }
});
function Ro() {
  return te.get("/api/communities/lite").json();
}
function ks(e, t = !1) {
  return ce(
    `get-community-${e}-${t}`,
    () => te.post("/api/community/get", { json: { params: { as_admin: !1, id: e, return_6wtags: t } } }).json().then(wn).catch((n) => {
      throw n.data && n.data.result && (n.data = wn(n.data)), n;
    }),
    5e3
  );
}
function Do(e = {
  query: "#all",
  select_predicate: ["title", "id", "resourceid"],
  favorites: "with",
  my_community: !1,
  page: 0,
  limit: 20
}) {
  return te.post("/api/exalead/search", {
    json: {
      params: {
        favorite_communities: e.favorites,
        hidden_communities: e.hidden,
        select_predicate: e.select_predicate,
        start: e.page * e.limit,
        query: e.query || "#all",
        myCommunitiesOnly: e.my_community,
        with_synthesis: !1,
        creation_granted_for: e.creation_granted_for,
        contentType: "community",
        nresults: e.limit,
        anyContentType: e.anyContentType || !1
      }
    }
  }).json().then((t) => jn(t).map((n) => ({
    ...n,
    subject_uri: n.resourceid,
    description: n.community_description,
    owner: {
      first_name: n.user_firstname,
      last_name: n.user_lastname,
      login: n.username,
      user_state: n.ut_state
    }
  })));
}
function No(e) {
  return te.post("/api/v2/ideas", {
    json: {
      container_id: e.communitySubjectUri,
      derived_type_id: e.derivedTypeId,
      title: e.title,
      body: e.message,
      publication_state: e.published ? "PUBLISHED" : "DRAFT"
      // tags6w_actions: params.taggingActions ? tagsForV2APIs(params.taggingActions) : undefined,
    }
  }).json().then((t) => Fn(t)).then((t) => Dn(`idea-${t.result.subject_uri}`, t));
}
function Mo(e) {
  return te.post("/api/v2/posts", {
    json: {
      container_id: e.communitySubjectUri,
      derived_type_id: e.derivedTypeId,
      title: e.title,
      body: e.message,
      publication_state: e.published ? "PUBLISHED" : "DRAFT"
      // tags6w_actions: params.taggingActions ? tagsForV2APIs(params.taggingActions) : undefined,
    }
  }).json().then((t) => Fn(t)).then((t) => Dn(`post-${t.result.subject_uri}`, t));
}
function Lo(e) {
  return te.post("/api/IquestionsQuestions/add", {
    json: {
      params: {
        title: e.title,
        community_id: e.communitySubjectUri,
        question: e.message,
        published: e.published ? 1 : 0
        // ...(params.taggingActions ? { taggingActions6w: params.taggingActions } : undefined),
      }
    }
  }).json().then(Fn).then((t) => Dn(`question-${t.result.subject_uri}`, t));
}
async function Uo(e) {
  const t = e.communitySubjectUri;
  let n;
  switch (e.model) {
    case T.Idea:
      n = await No({
        communitySubjectUri: t,
        ...e.data
      });
      break;
    case T.Question:
      n = await Lo({
        communitySubjectUri: t,
        ...e.data
      });
      break;
    case T.Post:
    default:
      n = await Mo({
        communitySubjectUri: t,
        ...e.data
      });
      break;
  }
  return n;
}
function Is(e) {
  return {
    community_type: "dm",
    is_hidden: e.isHidden,
    id: e == null ? void 0 : e.convId.toString(),
    subject_uri: e.subjectUri,
    updated_at: e.lastModificationDate,
    topic: e.title,
    users: e.members.map((t) => ({
      login: t.login,
      first_name: t.firstName,
      last_name: t.lastName,
      uid: t.uuid,
      displayName: t.full_name || ""
    }))
  };
}
function Fo(e) {
  var t;
  return {
    community_type: "dm",
    is_hidden: e.isHidden,
    id: ((t = e.id) == null ? void 0 : t.toString()) || "",
    subject_uri: e.subjectUri,
    updated_at: e.lastModificationDate,
    created_at: e == null ? void 0 : e.dateCreation,
    topic: e.title,
    users: e.members.map((n) => ({
      login: n.login,
      first_name: n.firstName,
      last_name: n.lastName,
      uid: n.uuid,
      displayName: n.full_name || ""
    }))
  };
}
function jo(e) {
  return {
    id: e.id.toString(),
    name: e.name,
    position: e.readOnly ? e.readOnlyPosition : e.position,
    isFavorite: e.readOnly && e.readOnlyPosition === 1,
    isReadOnly: e.readOnly || !1,
    threads: e.conversations.map((t) => ({
      threadId: t.convId.toString(),
      position: t.position
    }))
  };
}
function Bo() {
  return async (e, t) => {
    const s = `${await he(M.PASSPORT)}/login?service=3DSIM`, { access_token: r } = await be(s, { headers: { "X-Request-Id": "" } }).json(), i = new URL(e.url);
    return i.searchParams.append("ticket", r), new Request(i, { ...t, searchParams: { ...t.searchParams, ticket: r } });
  };
}
const Qe = be.extend({
  credentials: "omit",
  hooks: {
    beforeRequest: [
      bs,
      Ht(M.MESSAGING),
      Bo()
    ],
    afterResponse: [
      (...e) => qt(Qe, be)(...e)
    ]
  }
});
async function qo(e, t) {
  return ce(
    `all-user-conversations-${e}-${t}`,
    () => Qe.get("/conversation/userConversations", {
      searchParams: {
        tenant: t,
        login: e,
        all: !0
      }
    }).json().then((n) => n.userConversations.map((s) => Is(s))),
    5e3
  );
}
async function Vo(e, t) {
  return ce(
    `all-user-sections-${e}-${t}`,
    () => Qe.get("/conversation/userConversations", {
      searchParams: {
        tenant: t,
        login: e,
        all: !0,
        sections: !0
      }
    }).json().then((n) => n.sections.map((s) => jo(s))),
    5e3
  );
}
async function Wo(e, t) {
  return ce(
    `all-fav-conversations-${e}-${t}`,
    () => Qe.get("/conversation/userConversations", {
      searchParams: {
        tenant: t,
        login: e,
        favorite: !0
      }
    }).json().then((n) => n.userConversations),
    5e3
  );
}
async function Ho(e, t, n) {
  return ce(
    `conversation-id-${n}-${t}`,
    () => {
      const s = Os(n);
      return Qe.get("/conversation/userConversations", {
        searchParams: {
          tenant: t,
          login: e,
          convId: s
        }
      }).json().then((r) => Is(r.userConversations[0]));
    },
    1e4
  );
}
async function zo(e, t) {
  const n = await Go();
  return Qe.post("/conversation/create", {
    searchParams: {
      ticket: n
    },
    json: {
      logins: e,
      tenant: t
    }
  }).json().then((s) => Fo(s.conversation));
}
function Os(e) {
  var t;
  return typeof e == "string" && ((t = e.split(":")) == null ? void 0 : t.pop()) || e;
}
async function Go() {
  const t = `${await he(M.PASSPORT)}/login?service=3DSIM`, { access_token: n } = await be(t, { headers: { "X-Request-Id": "" } }).json();
  return n;
}
const Yo = [
  ["subject6wuri", "subject_uri"],
  ["uri", "subject_uri"]
];
function _n(e) {
  return {
    ...e,
    result: Qo(e.result)
  };
}
function Qo(e) {
  Yo.forEach(([n, s]) => {
    Ne.move(n, s, e);
  });
  const t = e;
  return t.users_login = (e.users || []).map(Un).map((n) => n.login), t;
}
function Xo() {
  return te.get("/api/directmessages/lite").json().then((e) => (e.result.forEach((t) => {
    t.users.forEach((n) => Un(n));
  }), e));
}
function Jo(e) {
  return te.get(`/api/directmessages/${e}`, { searchParams: { as_admin: !1, id: e, return_6wtags: !1 } }).json().then(_n).then((t) => t.result);
}
function Ko(e, t) {
  return te.post("/api/directmessages", {
    json: {
      users: e
    }
  }).json().then(_n).then((n) => n.result).catch((n) => {
    if (n.response.status === 409)
      return _n(n.data).result;
    throw new Error(n);
  });
}
function Zo(e) {
  if ("requestIdleCallback" in window) {
    const t = window.requestIdleCallback(e);
    return () => window.cancelIdleCallback(t);
  } else {
    const t = setTimeout(e, 0);
    return () => clearTimeout(t);
  }
}
function ea() {
  return ce(
    "uwp-app-properties",
    async () => te.get("/uwp/api/appProperties").json().then((e) => (Zo(async () => {
      import("./index-BsVw5Qh_.js").then(async ({ Preferences: t, CommonEvents: n }) => {
        t.isNativeApp() && Array.isArray(e) && (e.forEach((i) => {
          i.propertyKey === "com.3ds.wp.passport.cors" && (i.propertyValue = "disabled");
        }), n.emitEventToNativeApp("SwymEvents:notifyUWPAppProperties", e));
        const { requirejs: s } = await import("./index-CW4MmV4o.js"), [r] = await s(["DS/UWPClientCode/PublicAPI"]);
        r.applicationConfigurations = e;
      });
    }), e)).then((e) => Object.fromEntries(e.map((t) => [t.propertyKey, t.propertyValue]))),
    36e5
  );
}
async function ta(e) {
  return (await ea())[e];
}
function gn(e) {
  window.SWYM_URL = e.replace(/\/$/, "");
}
function ke() {
  return window.SWYM_URL;
}
function Bn() {
  var e;
  return ((e = Q()) == null ? void 0 : e.toLowerCase()) === "onpremise";
}
const Rs = /* @__PURE__ */ new Set(), bn = {}, Sn = {}, $e = ut({});
function na(e, t) {
  $e[e] = t !== void 0 ? t : !$e[e];
}
function sa(e) {
  return e && /^true|false$/i.test(e);
}
async function ra(e, t) {
  const n = await ta(t);
  if (sa(n))
    return n !== "false";
  if (n === "enabled")
    return !0;
  if (n === "undefined" || !n)
    return typeof $e[e] == "boolean" ? $e[e] : !1;
  try {
    const { userGroup: s, getCurrentUser: r } = await Promise.resolve().then(() => Gl), i = (await r()).result;
    return s.isMember(i.uid, n);
  } catch {
    return !1;
  }
}
async function ia(e) {
  if (oa(f(e)))
    return $e[e];
  let t = !0, n = !0;
  Rs.add(e), Object.prototype.hasOwnProperty.call(Sn, e) && (t = await ra(e, Sn[e])), Object.prototype.hasOwnProperty.call(bn, e) && (n = !!await he(bn[e]));
  const s = t && n;
  return na(e, s), s;
}
function oa(e) {
  return Object.prototype.hasOwnProperty.call(Sn, e) || Object.prototype.hasOwnProperty.call(bn, e) ? Rs.has(e) : !0;
}
function Gt(e) {
  return ia(f(e)), Object.prototype.hasOwnProperty.call($e, f(e)) || ($e[f(e)] = !0), A(() => $e[f(e)]);
}
const Ds = Gt("conversation.rtc");
async function Ns(e, t, n) {
  return Ds.value ? await Ho(e, t, n) : await Jo(n);
}
async function aa(e, t) {
  return Ds.value ? await zo(e, t) : await Ko(e);
}
const la = so(Bi).smaller("sm"), Ms = {
  props: {
    color: {
      type: String,
      default: () => "default"
    }
  }
}, ca = /^on[^a-z]/, ua = (e) => ca.test(e), da = (e, t) => {
  const n = {};
  for (const s in e)
    ua(s) && (n[t ? s[2].toLowerCase() + s.slice(3) : s] = e[s]);
  return n;
}, ue = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, fa = {
  name: "vu-icon",
  mixins: [Ms],
  data: () => ({
    getListenersFromAttrs: da
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
function pa(e, t, n, s, r, i) {
  return m(), _("span", fs({
    class: ["vu-icon fonticon", [n.withinText ? "fonticon-within-text" : "", `fonticon-${n.icon}`, `${e.color}`]]
  }, Or(e.getListenersFromAttrs(e.$attrs), !0)), null, 16);
}
const Ge = /* @__PURE__ */ ue(fa, [["render", pa], ["__scopeId", "data-v-47557ee2"]]), qn = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, ha = {
  props: {
    active: {
      type: Boolean,
      default: () => !1
    }
  }
}, ma = {
  props: {
    disabled: {
      type: Boolean,
      default: () => !1
    }
  }
}, ya = {
  props: {
    size: {
      type: String,
      default: () => ""
    }
  }
}, va = {
  name: "vu-icon-btn",
  mixins: [ha, ma, Ms, ya],
  components: { VuIcon: Ge },
  props: {
    icon: {
      required: !0,
      type: String
    },
    disableChevronResize: {
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
function wa(e, t, n, s, r, i) {
  const o = ne("VuIcon");
  return m(), _("div", {
    class: q(["vu-icon-btn", [e.color, e.size, { active: e.active && !n.noActive, "no-active": n.noActive, "no-hover": n.noHover, disabled: e.disabled }]]),
    onClickCapture: t[0] || (t[0] = (a) => {
      this.disabled && a.stopPropagation();
    })
  }, [
    x(o, {
      icon: n.icon,
      color: e.color,
      class: q({ "chevron-menu-icon": n.icon === "chevron-down" && n.disableChevronResize, disabled: e.disabled })
    }, null, 8, ["icon", "color", "class"])
  ], 34);
}
const _a = /* @__PURE__ */ ue(va, [["render", wa], ["__scopeId", "data-v-683db7dc"]]);
function ga() {
  return window ? ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (e) => (e ^ (window.crypto || window.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16)) : (void 0)();
}
var es;
(es = qi()) != null && es.swymlang;
const ba = {
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
      e[0].isIntersecting && (this.intersected = !0, this.observer.disconnect(), this.$emit("intersect"));
    }, this.options), this.observer.observe(this.$el)) : (this.intersected = !0, this.$emit("intersect"));
  },
  beforeUnmount() {
    "IntersectionObserver" in window && this.observer && this.observer.disconnect(), delete this.observer;
  }
};
function Sa(e, t, n, s, r, i) {
  return m(), _("div", {
    style: dt(e.intersected ? "" : `min-height: ${n.height}${typeof n.height == "number" && "px" || ""}`)
  }, [
    e.intersected ? B(e.$slots, "default", { key: 0 }) : B(e.$slots, "placeholder", { key: 1 })
  ], 4);
}
const Ls = /* @__PURE__ */ ue(ba, [["render", Sa]]), Us = Symbol("vuDropdownMenuOverlay"), Aa = (e) => {
  const t = typeof e;
  return t === "boolean" || t === "string" ? !0 : e.nodeType === Node.ELEMENT_NODE;
}, Fs = {
  name: "detachable",
  props: {
    attach: {
      default: () => !1,
      validator: Aa
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
      if (this._isDestroyed || this.hasDetached || this.attach === "" || this.attach === !0 || this.attach === "attach") return;
      let e;
      if (this.attach ? typeof this.attach == "string" ? e = document.querySelector(this.attach) : e = this.attach : e = document.body, !e) {
        this.vuDebug && console.warn(`Unable to locate target ${this.attach}`, this);
        return;
      }
      this.vuDebug && e.tagName.toLowerCase() !== "body" && window.getComputedStyle(e).position !== "relative" && console.warn(`target (${e.tagName.toLowerCase()}${e.id && ` #${e.id}`}${e.className && ` .${e.className}`}) element should have a relative position`), this.target = e, this.hasDetached = !0;
    }
  }
}, Vn = {
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
};
function Ca(e) {
  return xn() ? (kn(e), !0) : !1;
}
function ot(e) {
  return typeof e == "function" ? e() : f(e);
}
const Ta = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Pa = Object.prototype.toString, Ea = (e) => Pa.call(e) === "[object Object]", An = () => {
};
function $a(e, t) {
  function n(...s) {
    return new Promise((r, i) => {
      Promise.resolve(e(() => t.apply(this, s), { fn: t, thisArg: this, args: s })).then(r).catch(i);
    });
  }
  return n;
}
function xa(e, t = {}) {
  let n, s, r = An;
  const i = (a) => {
    clearTimeout(a), r(), r = An;
  };
  return (a) => {
    const l = ot(e), d = ot(t.maxWait);
    return n && i(n), l <= 0 || d !== void 0 && d <= 0 ? (s && (i(s), s = null), Promise.resolve(a())) : new Promise((u, c) => {
      r = t.rejectOnCancel ? c : u, d && !s && (s = setTimeout(() => {
        n && i(n), s = null, u(a());
      }, d)), n = setTimeout(() => {
        s && i(s), s = null, u(a());
      }, l);
    });
  };
}
function ts(e, t = 200, n = {}) {
  return $a(
    xa(t, n),
    e
  );
}
function ka(e) {
  var t;
  const n = ot(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Ia = Ta ? window : void 0;
function Oa(...e) {
  let t, n, s, r;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([n, s, r] = e, t = Ia) : [t, n, s, r] = e, !t)
    return An;
  Array.isArray(n) || (n = [n]), Array.isArray(s) || (s = [s]);
  const i = [], o = () => {
    i.forEach((u) => u()), i.length = 0;
  }, a = (u, c, h, v) => (u.addEventListener(c, h, v), () => u.removeEventListener(c, h, v)), l = G(
    () => [ka(t), ot(r)],
    ([u, c]) => {
      if (o(), !u)
        return;
      const h = Ea(c) ? { ...c } : c;
      i.push(
        ...n.flatMap((v) => s.map((y) => a(u, v, y, h)))
      );
    },
    { immediate: !0, flush: "post" }
  ), d = () => {
    l(), o();
  };
  return Ca(d), d;
}
function js(e, t = !0) {
  let n = t;
  return ot(e).forEach((r) => {
    !r.text && !r.label && (!r.class || !r.class.includes("divider")) && (n = !1), r.items && (n = js(r.items, n));
  }), n;
}
b();
const Ra = {
  name: "vu-dropdownmenu-items",
  components: { VuIcon: Ge },
  emits: ["update:responsive", "update:position", "click-item", "update:selected"],
  props: {
    target: {
      type: HTMLElement,
      required: !1
    },
    items: {
      type: Array,
      required: !0,
      validator: js
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
    uuid: ga,
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
    var s;
    if (this.disableResponsive)
      return;
    await this.$nextTick();
    const e = {
      root: this.target,
      threshold: 1
    }, t = ((s = this.target) == null ? void 0 : s.getBoundingClientRect()) || { right: window.right, left: 0 }, n = new IntersectionObserver(async ([r]) => {
      n.unobserve(this.$el);
      const i = r.target.getBoundingClientRect();
      t.right < i.right && !this.left ? (this.left = !0, await this.$nextTick(), n.observe(this.$el)) : t.left > i.left && this.left && (this.$emit("update:responsive", !0), this.$emit("update:position"));
    }, e);
    await this.$nextTick(), n.observe(this.$el);
  },
  methods: {
    toggleSelected(e) {
      const t = this.selected.slice(0);
      return e.selected || this.selected.includes(e) ? t.splice(this.selected.indexOf(e), 1) : t.push(e), t;
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
}, Da = { class: "dropdown-menu-wrap" }, Na = {
  key: 0,
  class: "item item-back"
}, Ma = { class: "item-text" }, La = ["onClick"], Ua = { class: "item-text" }, Fa = ["onClick"], ja = {
  key: 0,
  class: "item-text"
};
function Ba(e, t, n, s, r, i) {
  const o = ne("VuIcon"), a = ne("vu-dropdownmenu-items", !0);
  return m(), _("div", {
    class: q(["dropdown-menu dropdown-menu-root dropdown-root", i.classes]),
    style: dt([{ zIndex: n.zIndex }]),
    ref: "self"
  }, [
    $("ul", Da, [
      n.responsive && e.stack.length ? (m(), _("li", Na, [
        x(o, {
          icon: "left-open",
          class: "back-item",
          onClick: Me(i.onBackItemClick, ["stop"])
        }, null, 8, ["onClick"]),
        $("span", Ma, U(i._parent.text), 1)
      ])) : k("", !0),
      (m(!0), _(le, null, Ye(i._items, (l) => (m(), _(le, null, [
        !l.class || !l.class.includes("header") && !l.class.includes("divider") ? (m(), _("li", {
          key: l.text || l.label,
          class: q(["item", [{
            "item-submenu": l.items,
            selectable: !l.disabled && l.selectable || l.selected || n.selected.includes(l),
            selected: l.selected || n.selected.includes(l),
            hidden: l.hidden,
            disabled: l.disabled,
            "hide-responsive-divider": !n.dividedResponsiveItems
          }, l.class]]),
          onClick: Me((d) => l.items && n.responsive && !n.dividedResponsiveItems ? i.onNextItemClick(l) : i.onItemClick(l), ["stop"])
        }, [
          B(e.$slots, "default", { item: l }, () => [
            l.fonticon ? (m(), W(o, {
              key: 0,
              icon: l.fonticon,
              withinText: !1
            }, null, 8, ["icon"])) : k("", !0),
            $("span", Ua, U(l.text || l.label), 1)
          ], !0),
          l.items ? (m(), _("div", {
            key: 0,
            class: "next-icon",
            onClick: Me((d) => i.onNextItemClick(l), ["stop"])
          }, [
            t[3] || (t[3] = $("span", { class: "divider" }, null, -1)),
            x(o, { icon: "right-open" })
          ], 8, Fa)) : k("", !0),
          !n.responsive && l.items ? (m(), W(a, {
            key: 1,
            target: n.target,
            items: l.items,
            selected: n.selected,
            "z-index": n.zIndex + 1,
            onClickItem: i.onItemClick,
            "onUpdate:selected": t[0] || (t[0] = (d) => e.$emit("update:selected", d)),
            "onUpdate:responsive": t[1] || (t[1] = (d) => e.$emit("update:responsive", d)),
            "onUpdate:position": t[2] || (t[2] = () => {
              var c;
              const { left: d, top: u } = (c = e.$refs.self) == null ? void 0 : c.getBoundingClientRect();
              e.$emit("update:position", { x: d, y: u });
            })
          }, null, 8, ["target", "items", "selected", "z-index", "onClickItem"])) : k("", !0)
        ], 10, La)) : (m(), _("li", {
          key: l.text || l.label || e.uuid(),
          class: q(l.class)
        }, [
          l.class !== "divider" ? (m(), _("span", ja, U(l.text || l.label), 1)) : k("", !0)
        ], 2))
      ], 64))), 256))
    ])
  ], 6);
}
const Bs = /* @__PURE__ */ ue(Ra, [["render", Ba], ["__scopeId", "data-v-242e08d8"]]), qs = ["top", "top-right", "bottom-right", "bottom", "bottom-left", "top-left"], Vs = ({ intersectionRatio: e, elementRect: t, targetRect: n }) => e < 1 && (t.top < n.top || t.bottom > n.bottom), Ws = (e, t, n, s) => {
  if (s.length === 1) {
    const r = s[0];
    return r.includes("top") ? r.replace("top", "bottom") : r.replace("bottom", "top");
  } else s.length > 1 && s.push(...qs);
  return t;
}, qa = function(t, n) {
  let s, r;
  return function(...o) {
    const a = this, l = +/* @__PURE__ */ new Date();
    s && l < s + n ? (clearTimeout(r), r = setTimeout(() => {
      s = l, t.apply(a, o);
    }, n)) : (s = l, t.apply(a, o));
  };
}, Hs = (e, t, n, s = { width: 0, x: 0, y: 0 }, { scrollTop: r = 0, scrollLeft: i = 0 } = {}, o = !1, a = { left: 2, right: 2, top: 0, bottom: 0 }, l = { x: 0, y: 0 }) => {
  let d = t.y - s.y + r + (l.y || 0), u = t.x - s.x + i + (l.x || 0);
  isNaN(t.width) && (t.width = 0), isNaN(t.height) && (t.height = 0), /-right/.test(e) ? u += t.width - n.width : /^(top|bottom)$/.test(e) && (u += t.width / 2 - n.width / 2), /^bottom/.test(e) ? d += t.height : /^(left|right)(-top|-bottom)?$/.test(e) ? (u -= n.width, /^(right|right-\w{3,6})$/.test(e) && (u += t.width + n.width), /(-top|-bottom)/.test(e) ? /-bottom/.test(e) && (d += t.height - n.height) : d += t.height / 2 - n.height / 2) : d -= n.height;
  let c = 0, h = 0;
  const v = t.width / 2;
  if (o) {
    const y = a.left, p = s.width - n.width - a.right, g = Math.max(y, Math.min(u, p));
    c = u - g, u = g;
  }
  return {
    left: u,
    top: d,
    shiftX: c,
    shiftY: h,
    offset: v
  };
}, Va = {
  name: "vu-tooltip",
  mixins: [Vn],
  data: () => ({
    setPosition: Hs
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
}, Wa = ["innerHTML"];
function Ha(e, t, n, s, r, i) {
  return m(), _("div", {
    ref: "content",
    class: q([`${n.side} ${n.type} ${n.type}-root`, { "without-arrow": !n.arrow }, { prerender: n.prerender }])
  }, [
    x(un, {
      name: n.animated ? "fade" : ""
    }, {
      default: D(() => [
        e.show ? (m(), _("div", {
          key: 0,
          class: q([`${n.type}-wrapper`])
        }, [
          B(e.$slots, "arrow", { side: n.side }, () => [
            n.arrow ? (m(), _("div", {
              key: 0,
              class: q(`${n.type}-arrow`)
            }, null, 2)) : k("", !0)
          ], !0),
          B(e.$slots, "title", { side: n.side }, void 0, !0),
          $("div", {
            ref: "body",
            class: q(`${n.type}-body`)
          }, [
            n.text ? (m(), _("span", {
              key: 0,
              innerHTML: n.text
            }, null, 8, Wa)) : B(e.$slots, "default", {
              key: 1,
              side: n.side
            }, void 0, !0)
          ], 2)
        ], 2)) : k("", !0)
      ]),
      _: 3
    }, 8, ["name"])
  ], 2);
}
const za = /* @__PURE__ */ ue(Va, [["render", Ha], ["__scopeId", "data-v-0ffdf690"]]), Ga = ["top", "top-right", "right-bottom", "right", "right-top", "bottom-right", "bottom", "bottom-left", "left-top", "left", "left-bottom", "top-left"], Ya = (e, t, n, s) => {
  const r = n.indexOf(e), i = n[(r + 1) % n.length];
  return s.includes(i) ? t : i;
}, Qa = ({ intersectionRatio: e }) => e < 1, Xa = {
  name: "vu-popover",
  mixins: [Vn, Fs],
  expose: ["updatePosition", "toggle"],
  emits: ["unpositionable"],
  components: { VuTooltip: za },
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
      default: () => Ga
    },
    getNextPosition: {
      type: Function,
      required: !1,
      default: Ya
    },
    checkPosition: {
      type: Function,
      required: !1,
      default: Qa
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
    useDebounceFn: ts,
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
        e ? (this.fadeTimeout && (this.fadeTimeout = void 0), await new Promise((t) => setTimeout(t, 10)), this.positioned = !1, this.open = !0, this.positionAttempts = [], await this.$nextTick(), this.setPositionBound(), this.intersectionObs.observe(this.$refs.tooltip.$el), this.resizeObs || (this.resizeObs = new ResizeObserver(async () => {
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
        this.target && (e && !this.ignoreEscapeKey ? this.keyboardListener = Oa(this.target, "keydown", (t) => {
          t.code === "Escape" && (this.innerShow = !1);
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
    this.setPositionBound = qa(this.setPosition.bind(this), 1);
  },
  async mounted() {
    await this.$nextTick();
    let e = 0;
    const t = 5;
    for (; e < t && this.$refs.activator === void 0 && this.$refs.tooltip === void 0; )
      e++, await this.$nextTick();
    const { target: n, positionAttempts: s } = this;
    this.intersectionObs = new IntersectionObserver(([{ boundingClientRect: r, rootBounds: i, intersectionRatio: o, intersectionRect: a }]) => {
      if (this.$refs.tooltip && this.intersectionObs.unobserve(this.$refs.tooltip.$el), this.checkPosition({ intersectionRatio: o, elementRect: r, targetRect: i, intersectionRect: a, positionAttempts: s })) {
        const l = this.getNextPosition(this.innerSide || this.side, this.side, this.positions, this.positionAttempts);
        if (this.positionAttempts.length > this.positions.length) {
          this.$emit("unpositionable"), this.positioned = !0, this.positionAttempts = [];
          return;
        }
        this.innerSide = l, this.positionAttempts.push(this.innerSide);
      } else
        this.positioned = !0, this.positionAttempts = [], this.resizeObs.observe(this.$refs.tooltip.$el), this.resizeObs.observe(this.target);
    }, { root: n !== document.body ? n : void 0 });
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
      let t = this.$refs.activator.parentElement;
      for (; t && (this.target.contains(t) || t === this.target); ) {
        const { overflow: n } = window.getComputedStyle(t), s = n.split(" ");
        ["auto", "scroll"].some((r) => s.includes(r)) && e.push(t), t = t.parentElement;
      }
      this.scrollableAncestors = e, this.scrollableAncestors.forEach((n) => n.addEventListener("scroll", this.setPositionBound));
    },
    stopScrollListening() {
      this.scrollableAncestors.forEach((e) => e.removeEventListener("scroll", this.setPositionBound));
    },
    updatePosition() {
      var e;
      this.setPositionBound(), this.intersectionObs.observe((e = this.$refs.tooltip) == null ? void 0 : e.$el);
    },
    async setPosition(e) {
      var a;
      e && await this.$nextTick();
      let t = this.$refs.activator.getBoundingClientRect();
      const n = (a = this.$refs.tooltip) == null ? void 0 : a.$el;
      if (!n)
        return;
      let s = n.getBoundingClientRect();
      this.syncWidth && s.width !== t.width && (this.width = t.width, await this.$nextTick(), t = this.$refs.activator.getBoundingClientRect(), s = this.$refs.tooltip.$el.getBoundingClientRect());
      const r = this.target.getBoundingClientRect(), i = this.offsets && this.offsets[this.innerSide || this.side] || {};
      this.positionAttempts.push(this.innerSide || this.side);
      const o = Hs(
        this.innerSide || this.side,
        t,
        s,
        r,
        this.target,
        this.shift,
        { left: 0, right: 0 },
        i
      );
      this.shifted = o.shiftX, n.style.top = `${o.top}px`, n.style.left = `${o.left}px`, this.overlay && (this.$refs.overlay.style.top = `${this.target === document.body ? document.scrollingElement.scrollTop : this.target.scrollTop}px`);
    },
    onClickOutside(e, t = !1) {
      if (this.ignoreClickOutside || !this.innerShow)
        return;
      const { target: n } = e;
      t && e.preventDefault(), !(this.$refs.tooltip && (n === this.$refs.tooltip.$el || this.$refs.tooltip.$el.contains(n))) && (this.innerShow = !1);
    },
    onHover(e) {
      this.debounce(e).then((t) => {
        this.openedByClick || (t === "mouseenter" ? this.innerShow = !0 : (this.innerShow = !1, this.openedByClick = !1));
      }).catch(() => {
      });
    },
    attachHover() {
      this.hover && !this.hoverImmediate ? this.debounce = ts(({ type: e }) => e, this.hoverDelay, { rejectOnCancel: !0 }) : this.debounce = function() {
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
function Ja(e, t, n, s, r, i) {
  const o = ne("VuTooltip"), a = xe("click-outside");
  return m(), _(le, null, [
    ae((m(), _("span", fs({
      ref: "activator",
      class: "vu-popover__activator"
    }, e.$attrs, {
      onClick: t[0] || (t[0] = (l) => n.click && i.onClick(!0)),
      onContextmenu: t[1] || (t[1] = Me(() => {
      }, ["prevent", "stop"])),
      onMouseenter: t[2] || (t[2] = (l) => n.hover && i.onHover(l)),
      onMouseleave: t[3] || (t[3] = (l) => n.hover && i.onHover(l))
    }), [
      B(e.$slots, "default", {}, void 0, !0)
    ], 16)), [
      [a, { handler: i.onClickOutside, innerShow: e.innerShow }]
    ]),
    e.open || n.persistent ? ae((m(), W(Rr, {
      key: 0,
      to: e.target
    }, [
      x(un, {
        name: n.animated ? "fade" : ""
      }, {
        default: D(() => [
          e.innerShow && n.overlay ? (m(), _("div", {
            key: 0,
            ref: "overlay",
            class: "mask popover-mask",
            onWheel: t[4] || (t[4] = Me((...l) => i.onClickOutside && i.onClickOutside(...l), ["prevent"])),
            onTouchstart: t[5] || (t[5] = (l) => i.onClickOutside(l, !0))
          }, null, 544)) : k("", !0)
        ]),
        _: 1
      }, 8, ["name"]),
      x(un, {
        appear: "",
        name: n.animated ? "fade" : ""
      }, {
        default: D(() => [
          ae(x(o, {
            ref: "tooltip",
            arrow: n.arrow,
            prerender: !e.positioned,
            type: n.type,
            show: !0,
            side: e.innerSide || n.side,
            class: q(e.contentClass),
            style: dt([e.width ? `width: ${e.width}px` : {}, e.contentStyle]),
            "onUpdate:show": t[6] || (t[6] = (l) => e.open = !1),
            onMouseenter: t[7] || (t[7] = (l) => n.hover && i.onHover(l)),
            onMouseleave: t[8] || (t[8] = (l) => n.hover && i.onHover(l))
          }, {
            arrow: D(({ side: l }) => [
              B(e.$slots, "arrow", {
                side: e.innerSide || l,
                shift: e.shifted
              }, void 0, !0)
            ]),
            title: D(({ side: l }) => [
              B(e.$slots, "title", {
                side: e.innerSide || l
              }, () => [
                n.title ? (m(), _(le, { key: 0 }, [
                  Le(U(n.title), 1)
                ], 64)) : k("", !0)
              ], !0)
            ]),
            default: D(() => [
              B(e.$slots, "body", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["arrow", "prerender", "type", "side", "class", "style"]), [
            [zn, e.innerShow || e.show]
          ])
        ]),
        _: 3
      }, 8, ["name"])
    ], 8, ["to"])), [
      [zn, e.open]
    ]) : k("", !0)
  ], 64);
}
const zs = /* @__PURE__ */ ue(Xa, [["render", Ja], ["__scopeId", "data-v-bbd834b9"]]);
function Gs(e, t = !0) {
  let n = t;
  return e.forEach((s) => {
    !s.text && !s.label && (!s.class || !s.class.includes("divider")) && (n = !1), s.items && (n = Gs(s.items, n));
  }), n;
}
const Ka = {
  components: { VuDropdownmenuItems: Bs, VuPopover: zs },
  name: "vu-dropdownmenu",
  mixins: [Vn, Fs],
  emits: ["close", "click-item"],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      required: !0,
      validator: Gs
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
      default: () => qs
    },
    getNextPosition: {
      type: Function,
      required: !1,
      default: Ws
    },
    checkPosition: {
      type: Function,
      required: !1,
      default: Vs
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
    }
  },
  watch: {
    async items() {
      this.innerShow && (await this.$nextTick(), this.$refs.popover.updatePosition());
    }
  },
  methods: {
    handleClick(e) {
      e.handler && e.handler(e), this.$emit("click-item", e), this.updateShow(!1);
    },
    updateShow(e) {
      e ? this.isResponsive = !1 : this.closeOnClick && (this.innerShow = !1, this.$emit("close"));
    }
  }
}, Ys = /* @__PURE__ */ Object.assign(Ka, {
  setup(e) {
    const t = In(Us, !1);
    return (n, s) => (m(), W(zs, {
      ref: "popover",
      show: n.innerShow,
      "onUpdate:show": [
        s[1] || (s[1] = (r) => n.innerShow = r),
        n.updateShow
      ],
      shift: e.shift || e.responsive,
      type: "dropdownmenu popover",
      attach: n.target,
      side: e.position,
      overlay: e.overlay || f(t),
      animated: !1,
      "check-position": f(Vs),
      "get-next-position": f(Ws),
      "ignore-click-outside": e.ignoreClickOutside,
      arrow: !1,
      ignoreEscapeKey: e.ignoreEscapeKey
    }, {
      body: D(() => [
        x(Bs, {
          responsive: n.isResponsive,
          "onUpdate:responsive": s[0] || (s[0] = (r) => n.isResponsive = r),
          "divided-responsive-items": e.dividedResponsiveItems,
          target: n.target,
          items: e.items,
          selected: e.value,
          onClickItem: n.handleClick
        }, null, 8, ["responsive", "divided-responsive-items", "target", "items", "selected", "onClickItem"])
      ]),
      default: D(() => [
        B(n.$slots, "default", { active: n.innerShow })
      ]),
      _: 3
    }, 8, ["show", "shift", "attach", "side", "overlay", "check-position", "get-next-position", "ignore-click-outside", "ignoreEscapeKey", "onUpdate:show"]));
  }
});
let At = class K {
  static removeDotSegments(t) {
    const n = [];
    function s(r) {
      r === "/.." ? n.pop() : n.push(r);
    }
    return t.replace(/^(\.\.?(\/|$))+/, "").replace(/\/(\.(\/|$))+/g, "/").replace(/\/\.\.$/, "/../").replace(/\/?[^/]*/g, s), n.join("").replace(/^\//, t.charAt(0) === "/" ? "/" : "");
  }
  /**
   * Build an url from linkHref param in same context than widgetUrl param.
   *
   * @example
   * CommonUtils.Utils.buildUrl("http://example.org/mywidget.html", "/index.html");
   * // will return "http://example.org/index.html"
   *
   * @param {String} url - A full absolute url (e.g "http://example.org")
   * @param {String} href - Another url or simple file path (e.g. "/index.html")
   * @return {String} A new url related to widgetUrl url absolute value.
   *
   * @alias CommonUtils.Utils.buildUrl
   */
  static buildUrl(t, n) {
    const s = window.location && window.location.protocol ? window.location.protocol : "http:";
    if (t = String(t), n = String(n), !K.isAbsoluteUrl(t))
      throw new Error("First argument should be a absolute url.");
    t.substring(0, 2) === "//" && (t = s + t);
    let r, i, o = "";
    const a = String(t).split("://"), l = a[0], d = a[1], u = d.split("/"), c = u[0];
    if (n.substring(0, 2) === "//")
      t = l + ":" + n;
    else if (n.split("://").length > 1)
      t = n;
    else if (n.substring(0, 1) === "/")
      t = l + "://" + c + n;
    else {
      for (r = 1, i = u.length - 1; r < i; r++)
        o += "/" + u[r];
      t = l + "://" + c + K.removeDotSegments(o + "/" + n);
    }
    return t;
  }
  /**
   * Parse an Url to extract uri parts (protocol, domain, ...). The URL should include the protocol (http://).
   *
   * @example
   * CommonUtils.Utils.parseUrl("http://me@example.com:80");
   * // will return {"source":"http://me@example.com:80","protocol":"http","authority":"me@example.com:80","domain":"me@example.com","port":"80",...}
   *
   * @param {String} sourceUri - A valid url (e.g. "http://netvibes.com")
   * @return {Object} Object with following properties: source, protocol, authority, domain, port, path, directoryPath, fileName, query, anchor.
   *
   * @alias CommonUtils.Utils.parseUrl
   */
  static parseUrl(t) {
    const n = ["source", "subprotocol", "protocol", "authority", "user", "password", "domain", "port", "path", "directoryPath", "fileName", "query", "anchor"], s = new RegExp(
      "^(?:(?:(?:([^#.:]+):)?([^#.:]+):)?//)?((?:([^:/]+)(?::([^/]*?))?@)?([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?"
      // anchor
    );
    let r;
    const i = s.exec(t), o = {};
    for (r = 0; r < n.length; r++)
      o[n[r]] = i[r] || "";
    return o.subprotocol && (o.source = o.source.substr(o.subprotocol.length + 1)), o.port || (o.port = o.protocol === "https" ? "443" : "80"), o.directoryPath && o.directoryPath.length > 0 && (o.directoryPath = o.directoryPath.replace(/\/?$/, "/")), o.domain = o.domain.toLocaleLowerCase(), o.protocol = o.protocol.toLocaleLowerCase(), o;
  }
  /**
   * Build an Url to from uri parts (protocol, domain, ...).
   *
   * @example
   * CommonUtils.composeUrl({
   *    protocol: "https",
   *    subprotocol: "feed",
   *    authority: "example.org:8080",
   *    domain: "example.org",
   *    port: "8080",
   *    path: "/mypath/mywidget.html",
   *    directoryPath: "/mypath/",
   *    fileName: "mywidget.html",
   *    query: "lorem=ipsum&hello=world",
   *    anchor: "sit"
   * });
   * // will return "feed:https://example.org:8080/mypath/mywidget.html?lorem=ipsum&hello=world#sit"
   *
   *
   * @param {String} parts - An object with following properties: source, protocol, authority, domain, port, path, directoryPath, fileName, query, anchor
   * @return {String} A valid url (e.g. "http://netvibes.com").
   *
   * @alias CommonUtils.composeUrl
   */
  static composeUrl(t) {
    let n = "";
    return t.protocol && (n = t.protocol + "://", t.subprotocol && (n = t.subprotocol + ":" + n)), t.domain ? (n += t.domain, t.port && (t.protocol !== "http" || parseInt(t.port, 10) !== 80) && (t.protocol !== "https" || parseInt(t.port, 10) !== 443) && (n += ":" + t.port)) : t.authority && (n += t.authority), t.path && (n += t.path), t.query && (n += "?" + t.query), t.anchor && (n += "#" + t.anchor), n;
  }
  /**
   * Compare two url to check if their domain, protocol and port match.
   *
   * @example
   * // Following will return `true`
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', '/mypath/index.html');
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', 'mypath/index.html');
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', 'http://example.com/index.html');
   *
   * // Following will return `false`
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', 'http://example.org/mypath/index.html');
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', 'https://example.com/mypath/index.html');
   *
   * @param {String} originaUrl - First url to compare
   * @param {String} requestUrl - Second url to compare
   * @return {Boolean} `true` if urls match else `false`.
   *
   * @alias CommonUtils.Utils.matchUrl
   */
  static matchUrl(t, n) {
    let s, r, i = !1;
    const o = K.isAbsoluteUrl(t), a = K.isAbsoluteUrl(n);
    return !o && !a ? i = !0 : (o ? a || (n = K.buildUrl(t, n)) : t = K.buildUrl(n, t), s = K.parseUrl(t), r = K.parseUrl(n), i = ["domain", "protocol", "port"].every(function(l) {
      return s[l] === r[l] || // Protocol less match
      l === "protocol" && (s[l] === "" || r[l] === "");
    })), i;
  }
  /**
   * Test if an URL is absolute.
   *
   * @example
   * CommonUtils.Utils.isAbsoluteUrl('http://foo.com');
   * // will return true
   *
   * CommonUtils.Utils.isAbsoluteUrl('/foo');
   * // will return false
   *
   * @param {String} url - the url to check
   * @return {Boolean} `true` if the URL is absolute.
   *
   * @alias CommonUtils.Utils.isAbsoluteUrl
   */
  static isAbsoluteUrl(t) {
    return /^((https?|ftp|file):)?\/\//.test(t);
  }
  /**
   * Encode an Object to a url string.
   *
   * @example
   * CommonUtils.Utils.toQueryString({
   *    example: 1,
   *    array: ['hello', 'world'],
   *    object: {key: 'value'}
   * });
   * // will return "example=1&array[0]=hello&array[1]=world"
   *
   * CommonUtils.Utils.toQueryString({
   *    toQueryString: function () {
   *        return 'hello'
   *    }
   * });
   * // will return "hello"
   *
   * @param {Object} myObject - Object to encode
   * @param {Object} base - Sub object to encode
   * @return {String} Encoded string.
   *
   * @alias CommonUtils.Utils.toQueryString
   */
  static toQueryString(t, n) {
    let s, r, i, o;
    if (K.is(t, "string"))
      o = t;
    else if (K.is(t.toQueryString, "function"))
      o = t.toQueryString();
    else {
      o = [];
      for (s in t)
        t.hasOwnProperty(s) && (r = t[s], n && (s = n + "[" + K.capitalize(s) + "]"), K.is(r) && (K.is(r, "object") || K.is(r, "array") ? i = K.toQueryString(r, s) : K.is(r, "function") || (i = K.encodeUrl(s) + "=" + K.encodeUrl(r))), i && o.push(i), i = void 0);
      o = o.join("&");
    }
    return o;
  }
  static is(t, n) {
    return t && n ? typeof t === n : t ? typeof t < "u" : !1;
  }
  /**
   * Simple encodeURIComponent wrapper to escape "." to "%2e" also.
   *
   * @example
   * CommonUtils.Utils.encodeUrl("hello?/e;&.");
   * // will return "hello%3F%2Fe%3B%26%2e"
   *
   * @param {String} str - String to encode
   * @return {String} Encoded string.
   *
   * @alias CommonUtils.Utils.encodeUrl
   */
  static encodeUrl(t) {
    return encodeURIComponent(t).replace(/\./g, "%2e");
  }
  static capitalize(t, n = "-") {
    const s = t.split(n);
    for (let r = 0; r < s.length; r++)
      s[r] = s[r][0].toUpperCase() + s[r].substr(1);
    return s.join(n);
  }
};
function _e(e, t, n, s) {
  function r(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(u) {
      try {
        d(s.next(u));
      } catch (c) {
        o(c);
      }
    }
    function l(u) {
      try {
        d(s.throw(u));
      } catch (c) {
        o(c);
      }
    }
    function d(u) {
      u.done ? i(u.value) : r(u.value).then(a, l);
    }
    d((s = s.apply(e, t || [])).next());
  });
}
class Za {
  constructor() {
    return this.appSettings = null, this;
  }
  setAppPreferences(t) {
    this.appSettings = t;
  }
  allowODECreationFeature() {
    return this.appSettings && this.appSettings.allowODECreationFeature ? this.appSettings.allowODECreationFeature : !1;
  }
  allowODEViewerFeature() {
    return this.appSettings && this.appSettings.allowODEViewerFeature ? this.appSettings.allowODEViewerFeature : !1;
  }
  allowODECollabFeature() {
    return this.appSettings && this.appSettings.allowODECollabFeature ? this.appSettings.allowODECollabFeature : !1;
  }
  activateNativeWindowBar() {
    return this.appSettings && this.appSettings.activateNativeWindowBar ? this.appSettings.activateNativeWindowBar : !1;
  }
  hasMultiWindowsSupport() {
    return this.appSettings && this.appSettings.hasMultiWindowsSupport ? this.appSettings.hasMultiWindowsSupport : !1;
  }
  disableTopbarLogout() {
    return this.appSettings && this.appSettings.disableTopbarLogout ? this.appSettings.disableTopbarLogout : !1;
  }
}
const el = new Za(), Ct = 5 * 1e3;
class Tt {
  constructor() {
    this.set = (t, n) => new Promise((s, r) => {
      const i = setTimeout(() => {
        n === void 0 ? s(null) : r(n), this.clear(i);
      }, t);
      this.ids.push(i);
    }), this.wrap = (t, n, s) => Promise.race([t, this.set(n, s)]), this.clear = (...t) => {
      this.ids = this.ids.filter((n) => t.includes(n) ? (clearTimeout(n), !1) : !0);
    }, this.ids = [];
  }
}
const Pt = (e, t, n) => new Promise((s, r) => {
  (!window || !window.nsWebViewInterface) && r("No webview interface found!"), window.nsWebViewInterface.emit(e, n), window.nsWebViewInterface.once(t, (i) => {
    s(i);
  });
});
class Ee {
  constructor() {
    return this;
  }
  static emitEventToNativeApp(t, n) {
    try {
      window && window.electron && window.electron.ipcRenderer ? window.electron.ipcRenderer.send(t, n) : window && window.nsWebViewInterface && window.nsWebViewInterface.emit(t, n);
    } catch (s) {
      console.log(`Failed with reason: ${s}`);
    }
  }
  static invokeEventToNativeApp(t, n) {
    return _e(this, void 0, void 0, function* () {
      if (window && window.electron && window.electron.ipcRenderer)
        return yield window.electron.ipcRenderer.invoke(t, n);
      throw new Error("Method not supported!");
    });
  }
  static listenEventFromNativeApp(t, n) {
    try {
      window && window.electron && window.electron.ipcRenderer ? window.electron.ipcRenderer.on(t, (s, r) => n(r)) : window && window.nsWebViewInterface && window.nsWebViewInterface.on(t, (s) => n(s));
    } catch (s) {
      console.log(`Failed with reason: ${s}`);
    }
  }
  static listenOnceEventFromNativeApp(t, n) {
    try {
      window && window.electron && window.electron.ipcRenderer ? window.electron.ipcRenderer.once(t, (s, r) => n(r)) : window && window.nsWebViewInterface && window.nsWebViewInterface.once(t, (s) => n(s));
    } catch (s) {
      console.log(`Failed with reason: ${s}`);
    }
  }
  static getAppPreferences() {
    return _e(this, void 0, void 0, function* () {
      let t = null;
      try {
        if (window && window.electron)
          t = yield window.electron.getAppPreferences();
        else if (window && window.nsWebViewInterface) {
          const n = new Tt();
          try {
            const s = yield n.wrap(Pt("PreferencesReq:getAppPreferences", "PreferencesRes:getAppPreferences", {}), Ct, "Fetch timeout!");
            return Promise.resolve(s);
          } catch (s) {
            return console.log(`Failed with reason: ${s}`), n.clear(...n.ids), Promise.reject(s);
          }
        }
      } catch (n) {
        return Promise.reject(n);
      }
      return Promise.resolve(t);
    });
  }
  // Send request to the native app to get the pairing platform
  static getSelectedPlatform() {
    return _e(this, void 0, void 0, function* () {
      let t = null;
      try {
        if (window && window.electron)
          t = yield window.electron.getPairedPlatform();
        else if (window && window.nsWebViewInterface) {
          const n = new Tt();
          try {
            const s = yield n.wrap(Pt("PreferencesReq:getSelectedPlatform", "PreferencesRes:getSelectedPlatform", {}), Ct, "Fetch timeout!");
            return Promise.resolve(s);
          } catch (s) {
            return console.log(`Failed with reason: ${s}`), n.clear(...n.ids), Promise.reject(s);
          }
        }
      } catch (n) {
        return Promise.reject(n);
      }
      return Promise.resolve(t);
    });
  }
  static getTrackerData() {
    return _e(this, void 0, void 0, function* () {
      let t = {};
      try {
        if (window && window.electron)
          t = yield window.electron.getTrackerData();
        else if (window && window.nsWebViewInterface) {
          const n = new Tt();
          try {
            const s = yield n.wrap(Pt("PreferencesReq:getTrackerData", "PreferencesRes:getTrackerData", {}), Ct, "Fetch timeout!");
            return Promise.resolve(s);
          } catch (s) {
            return console.log(`Failed with reason: ${s}`), n.clear(...n.ids), Promise.reject(s);
          }
        }
      } catch (n) {
        return Promise.reject(n);
      }
      return Promise.resolve(t);
    });
  }
  static getGDPRPreferences() {
    return _e(this, void 0, void 0, function* () {
      let t = {};
      try {
        if (window && window.electron)
          t = yield window.electron.getGDPRPreferences();
        else if (window && window.nsWebViewInterface) {
          const n = new Tt();
          try {
            const s = yield n.wrap(Pt("PreferencesReq:getGDPRPreferences", "PreferencesRes:getGDPRPreferences", {}), Ct, "Fetch timeout!");
            return Promise.resolve(s);
          } catch (s) {
            return console.log(`Failed with reason: ${s}`), n.clear(...n.ids), Promise.reject(s);
          }
        }
      } catch (n) {
        return Promise.reject(n);
      }
      return Promise.resolve(t);
    });
  }
}
class pe {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }
  // set the application dynamic properties, e.g. app version
  static setAppProperties(t) {
    t && (t.appVersion && typeof t.appVersion < "u" && (this._appVersion = t.appVersion), this._appProperties = t);
  }
  static getAppProperties() {
    return this._appProperties;
  }
  // set the app behavior preferences, e.g. swym will check the app native behaviors
  static setAppPreferences(t) {
    el.setAppPreferences(t);
  }
  // check if in native application
  static isNativeApp() {
    return window && typeof window.electron < "u" ? !0 : !!(window && window.nsWebViewInterface);
  }
  static isMobileApp() {
    return window && window.nsWebViewInterface;
  }
  static isDesktopApp() {
    return window && window.electron;
  }
  // check if on same native localhost
  static isNativeSameDomain(t) {
    return window && window.location && window.location.hostname === t.hostname;
  }
  // get custom requirejs configuration for native app
  static getNativeAppRequireConfig() {
    if (this.isNativeApp())
      return window && window.nsWAP && window.nsWAP.appVersion && typeof window.nsWAP.appVersion < "u" && (this._appVersion = window.nsWAP.appVersion), {
        dsEnv: {
          env: "MOBILE"
        },
        proxies: {
          ajax: `${window.location.origin}/_api/proxy/ajax`,
          passport: `${window.location.origin}/_api/proxy/passport`
        },
        requirePaths: {
          WAP: `${window.location.origin}/wap/${this._appVersion}`,
          WAP2: `${window.location.origin}/WapInterface/${this._appVersion}`
        }
      };
  }
  // get the pairing platform from native app
  static getAppPairingPlatform() {
    return _e(this, void 0, void 0, function* () {
      return Ee.getSelectedPlatform();
    });
  }
  static getTrackerData() {
    return _e(this, void 0, void 0, function* () {
      return Ee.getTrackerData();
    });
  }
  static getGDPRPreferences() {
    return _e(this, void 0, void 0, function* () {
      return Ee.getGDPRPreferences();
    });
  }
  // initialize the native app preferences...
  static intializeNativeAppPreferences() {
    return _e(this, void 0, void 0, function* () {
      try {
        const t = yield Ee.getAppPreferences();
        t && (this.setAppProperties(t.appProperties), this.setAppPreferences(t.appFeatureActivation)), console.log("intializeNativeAppPreferences", t);
      } catch (t) {
        console.log("intializeNativeAppPreferences error", t);
      }
      return Promise.resolve();
    });
  }
}
pe._appVersion = "1.0";
class tl {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }
  static emitEventToNativeApp(t, n) {
    Ee.emitEventToNativeApp(t, n);
  }
  static listenEventFromNativeApp(t, n) {
    Ee.listenEventFromNativeApp(t, n);
  }
  static listenOnceEventFromNativeApp(t, n) {
    Ee.listenOnceEventFromNativeApp(t, n);
  }
  static invokeEventToNativeApp(t, n) {
    return Ee.invokeEventToNativeApp(t, n);
  }
}
tl.EVENTS = {
  ON_APP_FOREGROUND: "onAppForeground",
  ON_ENTER_FULLSCREEN: "onEnterFullScreen",
  ON_LEAVE_FULLSCREEN: "onLeaveFullScreen",
  NOTIFY_APP_DOWNLOAD_URL: "SwymEvents:notifyDownloadURL",
  NOTIFY_APP_UPDATE_INSTALL: "SwymEvents:notifyAppUpdateInstall",
  NOTIFY_APP_PWA_UPDATE_WAITING: "SwymEvents:notifyAppUpdatePWAWaiting",
  NOTIFY_REALTIME_MESSAGE: "SwymEvents:notifyRealtimeMessage",
  NOTIFY_APP_SWYM_INIT_END: "onInitializationEnd",
  NOTIFY_APP_UWP_PROPERTIES: "SwymEvents:notifyUWPAppProperties",
  NOTIFY_APP_TOPFRAME_INIT: "SwymEvents:notifyTopFrameInit",
  ON_APP_MULTIWINDOWS: "onAppMultiWindows",
  NOTIFY_MULTIWINDOW_ADD: "multi-window:add",
  NOTIFY_MULTIWINDOW_DELETE: "multi-window:delete",
  NOTIFY_MULTIWINDOW_FOCUS: "multi-window:focus"
};
let Qs = class We {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }
  /**
   * UWA Proxy urls indexed by types.
   */
  static get proxies() {
    const t = pe.getNativeAppRequireConfig();
    if (t && t.proxies)
      return t.proxies;
    const n = window.UWA && window.UWA.hosts || {}, r = n.exposition + "/proxy/", i = n.proxies || {};
    return Object.assign(Object.assign({}, i), {
      ajax: r + "ajax",
      resolve: r + "resolve",
      xml: r + "xml",
      spreadsheet: r + "spreadsheet",
      soap: r + "soap",
      feed: r + "feed",
      icon: r + "icon",
      richIcon: r + "richIcon",
      rss: r + "feed"
      // Deprecated alias support
    });
  }
  static normalizeRequestHeaders(t) {
    const n = {};
    return t.headers.forEach((s, r) => {
      n[r] = s;
    }), n;
  }
  static checkHasProxyPath(t) {
    if (pe.isNativeApp()) {
      const n = pe.getNativeAppRequireConfig();
      if (n && n.proxies) {
        for (const s in n.proxies)
          if (t.startsWith(n.proxies[s]))
            return !0;
      }
    }
    return !1;
  }
  /**
   * This method is used to create a Request that can be proxified to do CORS requests.
   * It supports the 2 proxy options:
   *      - ajax (for non-authenticated request)
   *      - passport (for authenticated request)
   * It allows to create a proxified Request that use these proxies.
   *
   * __Specific proxy options__:
   *
   * You can pass specific options into an object that have the same name than the used proxy
   * to configure proxy behavior, see Proxy Examples bellow for detailed usage.
   *
   * | Proxy       |  Description                                |
   * | ------------| --------------------------------------------|
   * | `ajax`      | cors request without authenticated session  |
   * | `passport`  | authenticated session request               |
   *
   *
   * @param {String}  url - the URL of the data source
   * @param {Object}  options - NormalizedOptions header object
   * @param {String}  [options.method=GET] - GET, POST (in uppercase!)
   * @param {Object}  [options.body={}] - GET or POST params as object
   * @param {String}  [options.proxy=false] - ajax, passport
   * @param {Object}  [options.headers] - Headers object.
   * @param {Request} originRequest - Original request.
   *
   * @return {Request} A request that is proxified or not
   * If the options.proxy is set && the proxification condition is satisfied, a new request will be created with a proxified URL.
   * Otherwise, the original request will be return.
   *
   * @alias CommonRequest.request
   */
  static async request(t, n, s) {
    if (!t)
      throw new Error("Bad or missing url argument.");
    if (!pe.isNativeApp() || At.matchUrl(t, window.location))
      return s;
    n = n || {};
    let r;
    const i = window.location, o = "ajax", a = n;
    a.headers && !a.normalizedHeaders && (a.normalizedHeaders = We.normalizeRequestHeaders(s)), a.proxy ? t = We.proxifyUrl(t, a) : At.matchUrl(t, i) === !1 && We.allowCrossOriginRequest === !1 && (t = We.proxifyUrl(t, Object.assign(Object.assign({}, a), { proxy: o })));
    const l = ["GET", "HEAD"].includes(s.method) ? void 0 : await s.blob();
    return a.body = l, r = new Request(t, a), r;
  }
  /**
   * Proxify an URL using UWA proxy.
   *
   * @param {String} url - url to proxify
   * @param {String} options - some options from <request> options parameter
   * @return {String} full url to proxy with proxified options (header, data) has parameter.
   *
   * @alias CommonRequest.proxifyUrl
   */
  static proxifyUrl(t, n) {
    if (!t)
      throw new Error("Bad or missing url argument.");
    let s;
    const r = [], i = n.proxy, o = At.toQueryString, a = We.proxies;
    if (i && a[i]) {
      if (!pe.isNativeApp() || At.matchUrl(t, window.location) || (s = a[i], t.indexOf(s) === 0))
        return t;
      if (t.startsWith("https://") && t.indexOf(":443") > -1 && (t = t.replace(":443", "")), n.body && n.method && n.method.toUpperCase() === "GET" && (t += (t.indexOf("?") > -1 ? "&" : "?") + o(n.body), console.log("DEBUG test proxification handle get", t)), typeof n.proxy == "object" && r.push(o(n.proxy)), n.normalizedHeaders ? r.push(o(n.normalizedHeaders, "headers")) : n.headers && r.push(o(n.headers, "headers")), n.method && r.push(o({
        method: n.method
      })), r.push(o({
        url: t
      })), t = s + "?" + r.join("&"), t.length > 4096)
        throw console.log("Error proxify url too long", t), new Error("Proxified url is more than 4096 characters, that is the limit for most of the browsers.");
    } else
      throw new Error("Invalid proxy");
    return t;
  }
};
Qs.allowCrossOriginRequest = !1;
function nl(e, t) {
  try {
    return Qs.proxifyUrl(e, { proxy: "passport", ...t });
  } catch (n) {
    return F.error(e, n), e;
  }
}
var oe = /* @__PURE__ */ ((e) => (e.TINY = "tiny", e.SMALL = "small", e.SMALLDIUM = "smalldium", e.SMEDIUM = "smedium", e.MEDIUM = "medium", e.NORMAL = "normal", e.BIG = "big", e.BIGGER = "bigger", e.BLARGE = "blarge", e.LARGE = "large", e))(oe || {});
const sl = {
  key: 1,
  class: "user-picture"
}, rl = ["src"];
oe.MEDIUM;
const il = ["onClick"], ol = { class: "flex flex-col justify-center items-center w-full gap-1" }, al = {
  key: 0,
  class: "text-xs text-grey-6 cursor-pointer leading-tight text-ellipsis max-w-full overflow-hidden text-center line-clamp-1"
}, ll = 2, cl = /* @__PURE__ */ ee({
  __name: "m-icon-list",
  props: {
    icons: {},
    hideText: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    leftAlign: { type: Boolean }
  },
  setup(e) {
    const t = e, n = Fe(t, "icons"), s = A(() => t.compact || la.value), r = Number.MAX_SAFE_INTEGER, i = A(() => s.value ? 38 : 64), { i18n: o } = Ri("core"), a = b(n.value.find((p) => p.active));
    G(() => t.icons, () => {
      a.value = n.value.find((p) => p.active);
    });
    const l = Ot("container"), { width: d } = io(l), u = A(() => {
      if (n.value.length === 1)
        return 1;
      const p = Math.min(n.value.length, Math.floor(d.value / i.value)), g = n.value.length - p;
      let S = p;
      return g && (S = Math.max(0, p - 1)), Math.min(r, S < ll ? 0 : S);
    }), c = A(() => a.value && n.value.indexOf(a.value) >= u.value ? n.value.slice(u.value ? u.value - 1 : 0).filter((g) => a.value !== g) : n.value.slice(u.value)), h = A(() => {
      const p = n.value.slice(0, u.value);
      return a.value && !p.find((g) => {
        var S;
        return g.fonticon === ((S = a.value) == null ? void 0 : S.fonticon);
      }) && (p.pop(), p.push(a.value)), p;
    });
    function v(p) {
      var g, S;
      ((g = a.value) == null ? void 0 : g.fonticon) === p.fonticon ? (p.active = !1, a.value = void 0) : (p.active = !0, a.value = p), (S = p.handler) == null || S.call(p, p);
    }
    const y = A(() => c.value.map((p) => ({
      fonticon: `${p.fonticon} ${p.color}`,
      text: p.text,
      handler() {
        v(p);
      }
    })));
    return (p, g) => {
      const S = xe("tooltip");
      return m(), _("div", {
        ref: "container",
        class: q(["flex flex-row overflow-hidden grow items-center", {
          "justify-end": !p.leftAlign,
          "justify-start": p.leftAlign
        }])
      }, [
        x(Dr, { name: "scale" }, {
          default: D(() => [
            (m(!0), _(le, null, Ye(h.value, (E) => {
              var N;
              return m(), _("div", {
                key: E.fonticon,
                class: q(["!no-underline rounded-full icon-list-item cursor-pointer flex justify-center items-center text-lg", [
                  E.className,
                  {
                    "w-[64px] h-[64px] max-w-[64px] max-h-[64px]": !s.value,
                    "w-[38px] h-[38px] max-w-[38px] max-h-[38px]": s.value,
                    selected: ((N = a.value) == null ? void 0 : N.fonticon) === E.fonticon
                  }
                ]]),
                onClick: (Y) => v(E)
              }, [
                $("div", ol, [
                  ae(x(Ge, {
                    active: a.value ? a.value.fonticon === E.fonticon : !1,
                    color: `rounded-full p-2 transition-all duration-500
            ${a.value ? a.value.fonticon !== E.fonticon ? E.color : `text-white ${E.bgcolor}` : E.color}`,
                    icon: `${E.fonticon} text-lg`
                  }, null, 8, ["active", "color", "icon"]), [
                    [S, p.hideText ? E.text : void 0]
                  ]),
                  p.hideText ? k("", !0) : (m(), _("span", {
                    key: 0,
                    class: q(["text-xs leading-tight text-ellipsis max-w-full overflow-hidden text-center line-clamp-1", `${a.value ? a.value.fonticon !== E.fonticon ? "text-grey-6" : "text-grey-8" : "text-grey-6"}`])
                  }, U(E.text), 3))
                ])
              ], 10, il);
            }), 128))
          ]),
          _: 1
        }),
        y.value.length ? (m(), W(Ys, {
          key: 0,
          items: y.value,
          position: "bottom-right"
        }, {
          default: D(() => [
            $("div", {
              class: q(["flex flex-col justify-center items-center gap-1", {
                "w-[64px]": !s.value,
                "w-[38px]": s.value
              }])
            }, [
              x(Ge, {
                color: "rounded-full p-2 fonticon-clickable",
                icon: "menu-dot text-lg"
              }),
              p.hideText ? k("", !0) : (m(), _("span", al, U(f(o).more), 1))
            ], 2)
          ]),
          _: 1
        }, 8, ["items"])) : k("", !0)
      ], 2);
    };
  }
}), ul = { class: "flex flex-col gap-2.5" }, dl = { class: "flex flex-col grow gap-2" }, fl = /* @__PURE__ */ ee({
  __name: "container-tile-placeholder",
  props: {
    n: {
      type: Number,
      default: 1
    }
  },
  setup(e) {
    const t = crypto.randomUUID();
    function n(s, r) {
      return Math.floor(Math.random() * (r - s + 1) + s);
    }
    return (s, r) => (m(), _("div", ul, [
      (m(!0), _(le, null, Ye(e.n, (i) => (m(), _("div", {
        id: "thread-tile-placeholder",
        key: `placeholder-tile-${f(t)}-${i}`,
        class: "flex items-center gap-2 px-1.5"
      }, [
        r[1] || (r[1] = $("div", {
          class: "h-[38px] w-[50px] rounded",
          "data-placeholder": ""
        }, null, -1)),
        $("div", dl, [
          r[0] || (r[0] = $("div", {
            class: "h-2 grow",
            "data-placeholder": ""
          }, null, -1)),
          $("div", {
            class: "h-2",
            "data-placeholder": "",
            style: dt(`width: ${n(20, 80)}%`)
          }, null, 4)
        ])
      ]))), 128))
    ]));
  }
}), pl = { class: "media-thumbnail-view-container h-full w-[50px]" }, hl = { class: "info-section flex flex-col" }, ml = { key: 0 }, yl = ["innerHTML"], vl = {
  key: 0,
  ref: "actionMenu",
  class: "tile-action-menu"
}, wl = {
  key: 0,
  class: "fonticon fonticon-record"
}, _l = {
  key: 1,
  class: "w-2"
}, gl = /* @__PURE__ */ ee({
  __name: "container-tile",
  props: {
    icon: { default: "" },
    colorIcon: { default: "" },
    name: { default: "" },
    unread: { type: Boolean, default: !1 },
    selected: { type: Boolean, default: !1 },
    dropdownOptions: { default: () => [] },
    transparent: { type: Boolean, default: !1 },
    optionsVisible: { type: Boolean, default: !1 },
    backgroundColor: { type: Boolean, default: !1 },
    displayTitleAsHtml: { type: Boolean }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = e, s = t, r = In(Us), i = Ot("container"), [o, a] = Ki(!1);
    function l() {
      var c, h;
      (h = (c = i.value) == null ? void 0 : c.scrollIntoViewIfNeeded) == null || h.call(c, { behavior: "smooth" });
    }
    vn(() => n.selected, l);
    const d = Ot("actionMenu");
    function u(c) {
      var h;
      (h = d.value) != null && h.contains(c.target) || s("click");
    }
    return Ie(() => {
      n.selected && l();
    }), (c, h) => {
      const v = xe("tooltip");
      return m(), _("div", {
        ref: "container",
        class: q(["thread-view rounded-md", [{
          "menu-is-open": f(o),
          selected: c.selected,
          "with-unread-content font-bold": c.unread,
          "bg-transparent": n.transparent,
          "border-solid border border-grey-4 bg-grey-1": !n.transparent,
          "options-visible": c.optionsVisible
        }]]),
        onClick: u
      }, [
        $("div", pl, [
          x(Ls, { class: "h-full" }, {
            default: D(() => [
              B(c.$slots, "image", {}, () => [
                $("div", {
                  class: q(["h-full flex items-center rounded justify-center", [{ "bg-grey-4": n.backgroundColor }]])
                }, [
                  c.icon ? (m(), W(Ge, {
                    key: 0,
                    class: "text-2xl",
                    color: n.colorIcon,
                    icon: c.icon
                  }, null, 8, ["color", "icon"])) : k("", !0)
                ], 2)
              ], !0)
            ]),
            _: 3
          })
        ]),
        $("div", hl, [
          B(c.$slots, "title", {}, () => [
            c.name ? (m(), _("div", {
              key: 0,
              class: q(["line-clamp-2 title", [{
                "font-bold": c.unread,
                "!line-clamp-1": !!c.$slots.description
              }]])
            }, [
              c.displayTitleAsHtml ? (m(), _("span", {
                key: 1,
                innerHTML: c.name
              }, null, 8, yl)) : (m(), _("span", ml, U(f(zi)(c.name)), 1))
            ], 2)) : k("", !0)
          ], !0),
          B(c.$slots, "description", {}, void 0, !0)
        ]),
        c.unread || c.dropdownOptions.length ? (m(), _("div", vl, [
          c.unread ? (m(), _("span", wl)) : k("", !0),
          !f(Hi)() && c.dropdownOptions.length > 1 ? (m(), W(Ys, {
            key: 1,
            attach: f(r) ? !1 : ".left-panel-container .vu-scroll-container__inner",
            items: c.dropdownOptions,
            position: "bottom-right",
            onClick: f(a),
            onClose: f(a)
          }, {
            default: D(() => h[1] || (h[1] = [
              $("span", { class: "fonticon fonticon-clickable fonticon-chevron-down chevron-menu-icon" }, null, -1)
            ])),
            _: 1
          }, 8, ["attach", "items", "onClick", "onClose"])) : c.dropdownOptions.length === 1 ? ae((m(), _("span", {
            key: 2,
            class: q(`fonticon fonticon-clickable fonticon-${c.dropdownOptions[0].fonticon}`),
            onClick: h[0] || (h[0] = Me((y) => c.dropdownOptions[0].handler && c.dropdownOptions[0].handler(c.dropdownOptions[0]), ["stop"]))
          }, null, 2)), [
            [v, c.dropdownOptions[0].text]
          ]) : k("", !0)
        ], 512)) : (m(), _("span", _l))
      ], 2);
    };
  }
}), Mt = /* @__PURE__ */ qn(gl, [["__scopeId", "data-v-e0ad6f8b"]]), bl = {
  key: 0,
  class: "count-badge"
}, Sl = /* @__PURE__ */ ee({
  __name: "circle-counter",
  props: {
    count: {}
  },
  setup(e) {
    const t = e;
    return (n, s) => n.count ? (m(), _("div", bl, U(t.count < 99 ? t.count : "+99"), 1)) : k("", !0);
  }
}), Al = /* @__PURE__ */ qn(Sl, [["__scopeId", "data-v-79ff29ce"]]), Cl = { class: "threads-section" }, Tl = { class: "flex" }, Pl = { class: "flex gap-2 items-center" }, El = {
  key: 0,
  class: "flex items-center justify-center w-[38px] h-[26px]"
}, $l = {
  key: 1,
  id: "threads-section-body",
  class: "item-list-body grid"
}, xl = {
  key: 0,
  class: "threads-no-result"
}, kl = { class: "drop-zone-placeholder" }, Il = {
  key: 1,
  class: "threads-no-result"
}, Ol = { id: "no-result-message" }, Rl = /* @__PURE__ */ ee({
  __name: "left-panel-section",
  props: /* @__PURE__ */ Rt({
    threadSectionName: {},
    hideSectionHeader: { type: Boolean },
    threads: {},
    loading: { type: Boolean },
    searchedValue: {},
    canDnd: { type: Boolean },
    addYourThreadMessage: { default: "" },
    emptyListMessage: { default: "" },
    noResultMessage: { default: "" },
    hasUnreadThread: { type: Boolean },
    isFilteredUnread: { type: Boolean },
    countUnreadThreadMessage: { default: 0 },
    nbPlaceholderWhileLoading: { default: 3 },
    enableExpandAndCollapse: { type: Boolean },
    isSelected: { type: Boolean }
  }, {
    isExpanded: { default: !0 },
    isExpandedModifiers: {}
  }),
  emits: /* @__PURE__ */ Rt(["addNewThread"], ["update:isExpanded"]),
  setup(e, { emit: t }) {
    const n = e, s = t, r = Bt(e, "isExpanded");
    return (i, o) => (m(), _("div", Cl, [
      i.hideSectionHeader ? k("", !0) : B(i.$slots, "header", { key: 0 }, () => [
        $("div", {
          id: "threads-section-header",
          class: q(["flex justify-between h-[38px] gap-2 items-center", {
            selected: n.isSelected,
            "cursor-pointer": i.enableExpandAndCollapse
          }]),
          onClick: o[0] || (o[0] = (a) => i.enableExpandAndCollapse ? r.value = !r.value : null)
        }, [
          $("div", Tl, [
            i.enableExpandAndCollapse ? (m(), W(_a, {
              key: 0,
              class: "!text-3xs expanded-icon",
              icon: r.value ? "expand-down" : "expand-right"
            }, null, 8, ["icon"])) : k("", !0),
            $("div", Pl, [
              $("h5", {
                id: "title",
                class: q(["text-lg sm:text-md text-grey-8 m-0 line-clamp-1 break-words text-ellipsis", {
                  "pl-1.5": !i.enableExpandAndCollapse
                }])
              }, U(n.threadSectionName), 3),
              B(i.$slots, "postSectionTitle", {}, void 0, !0)
            ])
          ]),
          n.hasUnreadThread || n.isFilteredUnread ? (m(), _("div", El, [
            x(Al, { count: i.countUnreadThreadMessage }, null, 8, ["count"])
          ])) : k("", !0)
        ], 2)
      ], !0),
      r.value ? (m(), _("div", $l, [
        n.loading ? (m(), W(fl, {
          key: 0,
          n: n.nbPlaceholderWhileLoading
        }, null, 8, ["n"])) : (m(!0), _(le, { key: 1 }, Ye(n.threads, (a, l) => (m(), W(Ls, {
          key: a.subject_uri,
          height: "50px",
          style: dt(a.position ? { order: a.position } : {})
        }, {
          default: D(() => [
            B(i.$slots, "threadTile", {
              index: l,
              list: n.threads,
              thread: a
            }, void 0, !0)
          ]),
          _: 2
        }, 1032, ["style"]))), 128)),
        B(i.$slots, "sectionDnd", {}, void 0, !0)
      ])) : k("", !0),
      !n.threads.length && !n.loading && r.value ? (m(), _(le, { key: 2 }, [
        n.searchedValue ? (m(), _("div", xl, [
          o[2] || (o[2] = $("span", { class: "fonticon fonticon-search" }, null, -1)),
          $("span", null, U(n.noResultMessage), 1)
        ])) : B(i.$slots, "more", { key: 1 }, () => [
          n.canDnd ? (m(), _("div", {
            key: 0,
            class: "drop-zone-default !border-grey-4 !text-grey-6 cursor-pointer",
            onClick: o[1] || (o[1] = (a) => s("addNewThread"))
          }, [
            o[3] || (o[3] = $("span", { class: "fonticon fonticon-plus text-xl" }, null, -1)),
            $("span", kl, U(n.addYourThreadMessage), 1)
          ])) : (m(), _("div", Il, [
            o[4] || (o[4] = $("span", { class: "fonticon fonticon-chat mr-1" }, null, -1)),
            $("span", Ol, U(n.emptyListMessage), 1)
          ]))
        ], !0)
      ], 64)) : k("", !0)
    ]));
  }
}), Xs = /* @__PURE__ */ qn(Rl, [["__scopeId", "data-v-960ccda6"]]), Dl = { class: "thread-picker_view-container" }, Nl = { class: "tab-picker-tabs" }, Ml = { class: "tab tab-picker-tabs-navigation" }, Ll = ["onClick"], Ul = /* @__PURE__ */ ee({
  __name: "tab-picker",
  props: /* @__PURE__ */ Rt({
    items: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = Bt(e, "modelValue");
    return (n, s) => (m(), _("div", Dl, [
      $("div", Nl, [
        $("nav", Ml, [
          (m(!0), _(le, null, Ye(n.items, (r) => (m(), _("a", {
            key: r.label,
            class: q(["tab-item", { active: t.value === r }]),
            onClick: (i) => t.value = r
          }, [
            x(Ge, {
              icon: r.fonticon
            }, null, 8, ["icon"]),
            Le(" " + U(r.label), 1)
          ], 10, Ll))), 128))
        ])
      ])
    ]));
  }
}), Fl = { class: "w-full" }, Js = /* @__PURE__ */ ee({
  __name: "destination-tile",
  props: {
    selectedThread: {},
    hideOption: { type: Boolean }
  },
  emits: ["update:selected-thread"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, r) => (m(), _("div", Fl, [
      x(f(Mt), {
        class: "bg-grey-2 border-solid",
        "dropdown-options": [{
          fonticon: "times",
          handler: () => {
            n("update:selected-thread", {});
          }
        }],
        name: s.selectedThread.label,
        "options-visible": !s.hideOption,
        onClick: r[0] || (r[0] = (i) => n("update:selected-thread", {}))
      }, {
        image: D(() => [
          B(s.$slots, "tileImage", { selectedThread: s.selectedThread })
        ]),
        _: 3
      }, 8, ["dropdown-options", "name", "options-visible"])
    ]));
  }
});
function Oe(e, t = "i18n!DS/SwymVuePublishForm/assets/nls/") {
  const n = b({}), s = new Promise(async (i) => {
    try {
      const [o] = await ft([`${t}${e}`]);
      n.value = Object.assign(f(n), o);
    } catch {
    }
    i(n.value);
  });
  function r(i, o = {}) {
    if (!i)
      return "";
    let a = f(n)[i];
    return Object.entries(o).forEach(([l, d]) => {
      a = a == null ? void 0 : a.replace(`{${l}}`, d);
    }), a || i;
  }
  return { i18n: n, $i18n: r, promise: s };
}
const jl = { class: "thread-selector-wrapper grid grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-1 w-full pt-[0.875rem]" }, Bl = { class: "flew flex-cols gap-5" }, ql = { class: "relative search-thread-container" }, Vl = { key: 0 }, Wl = {
  key: 1,
  class: "no-thread-found"
}, Hl = /* @__PURE__ */ ee({
  __name: "threads-section",
  props: /* @__PURE__ */ Rt({
    sectionList: {},
    sourceType: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const { $i18n: t } = Oe("content-type-selector"), n = Bt(e, "modelValue");
    return (s, r) => {
      const i = ne("vu-input"), o = ne("vu-icon"), a = ne("vu-scroller");
      return m(), _("div", jl, [
        $("div", Bl, [
          $("div", ql, [
            x(i, {
              modelValue: n.value,
              "onUpdate:modelValue": r[0] || (r[0] = (l) => n.value = l),
              class: "select-thread-input !pr-10",
              placeholder: s.sourceType === "Community" ? f(t)("placeholderSearchCommunity") : f(t)("placeholderSearchConversation")
            }, null, 8, ["modelValue", "placeholder"]),
            x(o, {
              class: "absolute right-0 top-0 w-9 flex items-center justify-center text-large !text-grey-5",
              icon: "search"
            })
          ])
        ]),
        s.sectionList.length > 0 ? (m(), _("div", Vl, [
          x(a, { class: "thread-list-scroller pt-1" }, {
            default: D(() => [
              (m(!0), _(le, null, Ye(s.sectionList, (l) => (m(), _("div", {
                key: l.id
              }, [
                x(f(Xs), {
                  class: "visible-other-threads-container",
                  "empty-list-message": f(t)("EmptyList"),
                  "has-unread-thread": !1,
                  "is-filtered-unread": !1,
                  "nb-placeholder-while-loading": 3,
                  "no-result-message": f(t)("NoResult"),
                  "thread-section-name": l.isFavorite ? f(t)("Favorites") : l.name,
                  threads: l.threads
                }, {
                  threadTile: D(({ thread: d }) => [
                    B(s.$slots, "sectionThread", {
                      item: l,
                      thread: d
                    }, void 0, !0)
                  ]),
                  _: 2
                }, 1032, ["empty-list-message", "no-result-message", "thread-section-name", "threads"])
              ]))), 128))
            ]),
            _: 3
          })
        ])) : (m(), _("div", Wl, [
          $("span", null, U(s.sourceType === "conversation" ? f(t)("NoConversationFound") : f(t)("NoCommunityFound")), 1)
        ]))
      ]);
    };
  }
}), Ks = /* @__PURE__ */ ue(Hl, [["__scopeId", "data-v-50333166"]]);
function zl(e) {
  var t;
  return {
    id: e.uri,
    category: e.category,
    name: e.name,
    position: e.read_only ? e.read_only_position : e.position,
    isFavorite: e.read_only && e.read_only_position === 0,
    isReadOnly: e.read_only || !1,
    threads: ((t = e.items) == null ? void 0 : t.map((n) => ({
      threadId: Os(n.subject_uri),
      position: n.position
    }))) || []
  };
}
const Cn = be.extend({
  hooks: {
    beforeRequest: [
      Ts(M.COMMENT),
      Ht(M.COMMENT)
    ],
    afterResponse: [
      (...e) => Nn(M.COMMENT, Cn)(...e),
      (...e) => qt(Cn, be)(...e)
    ]
  }
});
function ns(e) {
  return Cn.get(`/api/v2/sections/${e}`).json().then((t) => t.result.map(zl));
}
function Yt() {
  return ce(
    "current-user",
    () => te.get("/api/user/getcurrent").json(),
    6e4
  );
}
function Zs({
  query: e,
  communityUri: t,
  limit: n = 5,
  page: s = 0,
  locale: r = "en"
}) {
  return ce(
    `search-user-${t ? `${t}-` : ""}${e}`,
    () => te.post("/api/user/search", {
      json: {
        params: {
          query: e,
          community_id: t,
          limit: n,
          start: s,
          locale: r
        }
      }
    }).json(),
    // TODO: should parse users results.
    6e4
  );
}
const Gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getCurrentUser: Yt,
  searchUser: Zs
}, Symbol.toStringTag, { value: "Module" })), Et = ut(/* @__PURE__ */ new Map());
function er({ type: e, threadMap: t }) {
  const n = ut(/* @__PURE__ */ new Map());
  function s() {
    Et.clear(), n.clear();
  }
  async function r() {
    var a;
    let o;
    if (e.value === "community")
      o = await ns(e.value);
    else if (e.value === "externaldm") {
      const l = (a = (await Yt()).result) == null ? void 0 : a.login;
      o = await Vo(l, Q());
    } else if (e.value === "dm")
      o = await ns("conversation");
    else
      return [];
    Et.set(e.value, new Map(o.map((l) => [l.id, l])));
  }
  const i = A(() => {
    n.clear();
    const o = Et.get(e.value);
    return o ? [...o.values()].map((a) => ({
      ...a,
      threads: a.threads.map((l) => {
        n.set(l.threadId, l);
        const d = t == null ? void 0 : t.value.get(l.threadId);
        if (d)
          return { ...d, position: l.position };
      }).filter((l) => !!l)
    })).sort((a, l) => a.position > l.position ? 1 : l.position > a.position ? -1 : 0) : [];
  });
  return {
    sections: Et,
    sectionsList: i,
    sectionedThreads: n,
    fetchSections: r,
    resetData: s
  };
}
class V {
  static removeDotSegments(t) {
    var n = [];
    function s(r) {
      r === "/.." ? n.pop() : n.push(r);
    }
    return t.replace(/^(\.\.?(\/|$))+/, "").replace(/\/(\.(\/|$))+/g, "/").replace(/\/\.\.$/, "/../").replace(/\/?[^/]*/g, s), n.join("").replace(/^\//, t.charAt(0) === "/" ? "/" : "");
  }
  /**
   * Build an url from linkHref param in same context than widgetUrl param.
   *
   * @example
   * CommonUtils.Utils.buildUrl("http://example.org/mywidget.html", "/index.html");
   * // will return "http://example.org/index.html"
   *
   * @param {String} url - A full absolute url (e.g "http://example.org")
   * @param {String} href - Another url or simple file path (e.g. "/index.html")
   * @return {String} A new url related to widgetUrl url absolute value.
   *
   * @alias CommonUtils.Utils.buildUrl
   */
  static buildUrl(t, n) {
    var s = window.location && window.location.protocol ? window.location.protocol : "http:";
    if (t = String(t), n = String(n), !V.isAbsoluteUrl(t))
      throw new Error("First argument should be a absolute url.");
    t.substring(0, 2) === "//" && (t = s + t);
    var r, i, o = String(t).split("://"), a = o[0], l = o[1], d = l.split("/"), u = d[0], c = "";
    if (n.substring(0, 2) === "//")
      t = a + ":" + n;
    else if (n.split("://").length > 1)
      t = n;
    else if (n.substring(0, 1) === "/")
      t = a + "://" + u + n;
    else {
      for (r = 1, i = d.length - 1; r < i; r++)
        c += "/" + d[r];
      t = a + "://" + u + V.removeDotSegments(c + "/" + n);
    }
    return t;
  }
  /**
   * Parse an Url to extract uri parts (protocol, domain, ...). The URL should include the protocol (http://).
   *
   * @example
   * CommonUtils.Utils.parseUrl("http://me@example.com:80");
   * // will return {"source":"http://me@example.com:80","protocol":"http","authority":"me@example.com:80","domain":"me@example.com","port":"80",...}
   *
   * @param {String} sourceUri - A valid url (e.g. "http://netvibes.com")
   * @return {Object} Object with following properties: source, protocol, authority, domain, port, path, directoryPath, fileName, query, anchor.
   *
   * @alias CommonUtils.Utils.parseUrl
   */
  static parseUrl(t) {
    var n = ["source", "subprotocol", "protocol", "authority", "user", "password", "domain", "port", "path", "directoryPath", "fileName", "query", "anchor"], s = new RegExp(
      "^(?:(?:(?:([^#.:]+):)?([^#.:]+):)?//)?((?:([^:/]+)(?::([^/]*?))?@)?([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?"
      // anchor
    ), r, i = s.exec(t), o = {};
    for (r = 0; r < n.length; r++)
      o[n[r]] = i[r] || "";
    return o.subprotocol && (o.source = o.source.substr(o.subprotocol.length + 1)), o.port || (o.port = o.protocol === "https" ? "443" : "80"), o.directoryPath && o.directoryPath.length > 0 && (o.directoryPath = o.directoryPath.replace(/\/?$/, "/")), o.domain = o.domain.toLocaleLowerCase(), o.protocol = o.protocol.toLocaleLowerCase(), o;
  }
  /**
   * Build an Url to from uri parts (protocol, domain, ...).
   *
   * @example
   * CommonUtils.composeUrl({
   *    protocol: "https",
   *    subprotocol: "feed",
   *    authority: "example.org:8080",
   *    domain: "example.org",
   *    port: "8080",
   *    path: "/mypath/mywidget.html",
   *    directoryPath: "/mypath/",
   *    fileName: "mywidget.html",
   *    query: "lorem=ipsum&hello=world",
   *    anchor: "sit"
   * });
   * // will return "feed:https://example.org:8080/mypath/mywidget.html?lorem=ipsum&hello=world#sit"
   *
   *
   * @param {String} parts - An object with following properties: source, protocol, authority, domain, port, path, directoryPath, fileName, query, anchor
   * @return {String} A valid url (e.g. "http://netvibes.com").
   *
   * @alias CommonUtils.composeUrl
   */
  static composeUrl(t) {
    var n = "";
    return t.protocol && (n = t.protocol + "://", t.subprotocol && (n = t.subprotocol + ":" + n)), t.domain ? (n += t.domain, t.port && (t.protocol !== "http" || parseInt(t.port, 10) !== 80) && (t.protocol !== "https" || parseInt(t.port, 10) !== 443) && (n += ":" + t.port)) : t.authority && (n += t.authority), t.path && (n += t.path), t.query && (n += "?" + t.query), t.anchor && (n += "#" + t.anchor), n;
  }
  /**
   * Compare two url to check if their domain, protocol and port match.
   *
   * @example
   * // Following will return `true`
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', '/mypath/index.html');
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', 'mypath/index.html');
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', 'http://example.com/index.html');
   *
   * // Following will return `false`
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', 'http://example.org/mypath/index.html');
   * CommonUtils.Utils.matchUrl('http://example.com/mypath/index.html', 'https://example.com/mypath/index.html');
   *
   * @param {String} originaUrl - First url to compare
   * @param {String} requestUrl - Second url to compare
   * @return {Boolean} `true` if urls match else `false`.
   *
   * @alias CommonUtils.Utils.matchUrl
   */
  static matchUrl(t, n) {
    var s, r, i = !1, o = V.isAbsoluteUrl(t), a = V.isAbsoluteUrl(n);
    return !o && !a ? i = !0 : (o ? a || (n = V.buildUrl(t, n)) : t = V.buildUrl(n, t), s = V.parseUrl(t), r = V.parseUrl(n), i = ["domain", "protocol", "port"].every(function(l) {
      return s[l] === r[l] || // Protocol less match
      l === "protocol" && (s[l] === "" || r[l] === "");
    })), i;
  }
  /**
   * Test if an URL is absolute.
   *
   * @example
   * CommonUtils.Utils.isAbsoluteUrl('http://foo.com');
   * // will return true
   *
   * CommonUtils.Utils.isAbsoluteUrl('/foo');
   * // will return false
   *
   * @param {String} url - the url to check
   * @return {Boolean} `true` if the URL is absolute.
   *
   * @alias CommonUtils.Utils.isAbsoluteUrl
   */
  static isAbsoluteUrl(t) {
    var n = /^((https?|ftp|file):)?\/\//;
    return n.test(t);
  }
  /**
   * Encode an Object to a url string.
   *
   * @example
   * CommonUtils.Utils.toQueryString({
   *    example: 1,
   *    array: ['hello', 'world'],
   *    object: {key: 'value'}
   * });
   * // will return "example=1&array[0]=hello&array[1]=world"
   *
   * CommonUtils.Utils.toQueryString({
   *    toQueryString: function () {
   *        return 'hello'
   *    }
   * });
   * // will return "hello"
   *
   * @param {Object} myObject - Object to encode
   * @param {Object} base - Sub object to encode
   * @return {String} Encoded string.
   *
   * @alias CommonUtils.Utils.toQueryString
   */
  static toQueryString(t, n) {
    var s, r, i, o;
    if (V.is(t, "string"))
      o = t;
    else if (V.is(t.toQueryString, "function"))
      o = t.toQueryString();
    else {
      o = [];
      for (s in t)
        t.hasOwnProperty(s) && (r = t[s], n && (s = n + "[" + V.capitalize(s) + "]"), V.is(r) && (V.is(r, "object") || V.is(r, "array") ? i = V.toQueryString(r, s) : V.is(r, "function") || (i = V.encodeUrl(s) + "=" + V.encodeUrl(r))), i && o.push(i), i = void 0);
      o = o.join("&");
    }
    return o;
  }
  static is(t, n) {
    return t && n ? typeof t === n : t ? typeof t < "u" : !1;
  }
  /**
   * Simple encodeURIComponent wrapper to escape "." to "%2e" also.
   *
   * @example
   * CommonUtils.Utils.encodeUrl("hello?/e;&.");
   * // will return "hello%3F%2Fe%3B%26%2e"
   *
   * @param {String} str - String to encode
   * @return {String} Encoded string.
   *
   * @alias CommonUtils.Utils.encodeUrl
   */
  static encodeUrl(t) {
    return encodeURIComponent(t).replace(/\./g, "%2e");
  }
  static capitalize(t, n = "-") {
    const s = t.split(n);
    for (let r = 0; r < s.length; r++)
      s[r] = s[r][0].toUpperCase() + s[r].substr(1);
    return s.join(n);
  }
}
class Pe {
  constructor() {
  }
  /**
   * UWA Proxy urls indexed by types.
   */
  static get proxies() {
    const t = pe.getNativeAppRequireConfig();
    if (t && t.proxies)
      return t.proxies;
    const n = window.UWA && window.UWA.hosts || {}, r = n.exposition + "/proxy/", i = n.proxies || {};
    return Object.assign(Object.assign({}, i), {
      ajax: r + "ajax",
      resolve: r + "resolve",
      xml: r + "xml",
      spreadsheet: r + "spreadsheet",
      soap: r + "soap",
      feed: r + "feed",
      icon: r + "icon",
      richIcon: r + "richIcon",
      rss: r + "feed"
      // Deprecated alias support
    });
  }
  static normalizeRequestHeaders(t) {
    let n = {};
    return t.headers.forEach((s, r) => {
      n[r] = s;
    }), n;
  }
  static checkHasProxyPath(t) {
    if (pe.isNativeApp()) {
      const n = pe.getNativeAppRequireConfig();
      if (n && n.proxies) {
        for (const s in n.proxies)
          if (t.startsWith(n.proxies[s]))
            return !0;
      }
    }
    return !1;
  }
  /**
   * This method is used to create a Request that can be proxified to do CORS requests.
   * It supports the 2 proxy options:
   *      - ajax (for non-authenticated request)
   *      - passport (for authenticated request)
   * It allows to create a proxified Request that use these proxies.
   *
   * __Specific proxy options__:
   *
   * You can pass specific options into an object that have the same name than the used proxy
   * to configure proxy behavior, see Proxy Examples bellow for detailed usage.
   *
   * | Proxy       |  Description                                |
   * | ------------| --------------------------------------------|
   * | `ajax`      | cors request without authenticated session  |
   * | `passport`  | authenticated session request               |
   *
   *
   * @param {String}  url - the URL of the data source
   * @param {Object}  options - NormalizedOptions header object
   * @param {String}  [options.method=GET] - GET, POST (in uppercase!)
   * @param {Object}  [options.body={}] - GET or POST params as object
   * @param {String}  [options.proxy=false] - ajax, passport
   * @param {Object}  [options.headers] - Headers object.
   * @param {Request} originRequest - Original request.
   *
   * @return {Request} A request that is proxified or not
   * If the options.proxy is set && the proxification condition is satisfied, a new request will be created with a proxified URL.
   * Otherwise, the original request will be return.
   *
   * @alias CommonRequest.request
   */
  static request(t, n, s) {
    return _e(this, void 0, void 0, function* () {
      if (!t)
        throw new Error("Bad or missing url argument.");
      if (!pe.isNativeApp() || V.matchUrl(t, window.location))
        return s;
      n = n || {};
      var r, i = window.location, o = "ajax", a = n;
      a.headers && !a.normalizedHeaders && (a.normalizedHeaders = Pe.normalizeRequestHeaders(s)), a.proxy ? t = Pe.proxifyUrl(t, a) : V.matchUrl(t, i) === !1 && Pe.allowCrossOriginRequest === !1 && (t = Pe.proxifyUrl(t, Object.assign(Object.assign({}, a), { proxy: o })));
      const l = ["GET", "HEAD"].includes(s.method) ? void 0 : yield s.blob();
      return a.body = l, r = new Request(t, a), r;
    });
  }
  /**
   * Proxify an URL using UWA proxy.
   *
   * @param {String} url - url to proxify
   * @param {String} options - some options from <request> options parameter
   * @return {String} full url to proxy with proxified options (header, data) has parameter.
   *
   * @alias CommonRequest.proxifyUrl
   */
  static proxifyUrl(t, n) {
    if (!t)
      throw new Error("Bad or missing url argument.");
    var s, r = [], i = n.proxy, o = V.toQueryString, a = Pe.proxies;
    if (i && a[i]) {
      if (!pe.isNativeApp() || V.matchUrl(t, window.location) || (s = a[i], t.indexOf(s) === 0))
        return t;
      if (t.startsWith("https://") && t.indexOf(":443") > -1 && (t = t.replace(":443", "")), n.body && n.method && n.method.toUpperCase() === "GET" && (t += (t.indexOf("?") > -1 ? "&" : "?") + o(n.body), console.log("DEBUG test proxification handle get", t)), typeof n.proxy == "object" && r.push(o(n.proxy)), n.normalizedHeaders ? r.push(o(n.normalizedHeaders, "headers")) : n.headers && r.push(o(n.headers, "headers")), n.method && r.push(o({
        method: n.method
      })), r.push(o({
        url: t
      })), t = s + "?" + r.join("&"), t.length > 4096)
        throw console.log("Error proxify url too long", t), new Error("Proxified url is more than 4096 characters, that is the limit for most of the browsers.");
    } else
      throw new Error("Invalid proxy");
    return t;
  }
}
Pe.allowCrossOriginRequest = !1;
function rt(e, t) {
  try {
    return Pe.proxifyUrl(e, { proxy: "passport", ...t });
  } catch (n) {
    return console.error(e, n), e;
  }
}
const Yl = ["src"], ss = /* @__PURE__ */ ee({
  __name: "media-thumbnail",
  props: {
    id: {},
    model: {},
    size: { default: "s" },
    navigation: { type: Boolean, default: !1 },
    fingerprint: { default: "" }
  },
  setup(e) {
    const t = e;
    function n() {
      const s = t.model;
      let r = `${ke()}/api/media/streammedia/model/${s}/model_id/${t.id}/type/thumb/key/${t.size}_thumb`;
      return t.fingerprint && (r = `${r}/update/${t.fingerprint}`), rt(r);
    }
    return (s, r) => (m(), _("img", {
      class: "max-h-full max-w-full",
      src: n()
    }, null, 8, Yl));
  }
}), tr = 1e3, Ql = "last-conversation-section-id", Xl = "last-community-section-id";
function Jl(e) {
  return xn() ? (kn(e), !0) : !1;
}
function je(e) {
  return typeof e == "function" ? e() : f(e);
}
const Z = je, Kl = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Zl = (e) => typeof e < "u", at = () => {
};
function nr(e, t) {
  function n(...s) {
    return new Promise((r, i) => {
      Promise.resolve(e(() => t.apply(this, s), { fn: t, thisArg: this, args: s })).then(r).catch(i);
    });
  }
  return n;
}
function ec(e, t = {}) {
  let n, s, r = at;
  const i = (a) => {
    clearTimeout(a), r(), r = at;
  };
  return (a) => {
    const l = je(e), d = je(t.maxWait);
    return n && i(n), l <= 0 || d !== void 0 && d <= 0 ? (s && (i(s), s = null), Promise.resolve(a())) : new Promise((u, c) => {
      r = t.rejectOnCancel ? c : u, d && !s && (s = setTimeout(() => {
        n && i(n), s = null, u(a());
      }, d)), n = setTimeout(() => {
        s && i(s), s = null, u(a());
      }, l);
    });
  };
}
function tc(...e) {
  let t = 0, n, s = !0, r = at, i, o, a, l, d;
  !fe(e[0]) && typeof e[0] == "object" ? { delay: o, trailing: a = !0, leading: l = !0, rejectOnCancel: d = !1 } = e[0] : [o, a = !0, l = !0, d = !1] = e;
  const u = () => {
    n && (clearTimeout(n), n = void 0, r(), r = at);
  };
  return (h) => {
    const v = je(o), y = Date.now() - t, p = () => i = h();
    return u(), v <= 0 ? (t = Date.now(), p()) : (y > v && (l || !s) ? (t = Date.now(), p()) : a && (i = new Promise((g, S) => {
      r = d ? S : g, n = setTimeout(() => {
        t = Date.now(), s = !0, g(p()), u();
      }, Math.max(0, v - y));
    })), !l && !n && (n = setTimeout(() => s = !0, v)), s = !1, i);
  };
}
function nc(e, t) {
  var n;
  if (typeof e == "number")
    return e + t;
  const s = ((n = e.match(/^-?\d+\.?\d*/)) == null ? void 0 : n[0]) || "", r = e.slice(s.length), i = Number.parseFloat(s) + t;
  return Number.isNaN(i) ? e : i + r;
}
function sc(e) {
  return ct();
}
function rc(...e) {
  if (e.length !== 1)
    return Fe(...e);
  const t = e[0];
  return typeof t == "function" ? Ut(us(() => ({ get: t, set: at }))) : b(t);
}
const Ze = rc;
function ic(e, t = 200, n = {}) {
  return nr(
    ec(t, n),
    e
  );
}
function oc(e, t = 200, n = {}) {
  const s = b(e.value), r = ic(() => {
    s.value = e.value;
  }, t, n);
  return G(e, () => r()), s;
}
function ac(e, t = 200, n = !1, s = !0, r = !1) {
  return nr(
    tc(t, n, s, r),
    e
  );
}
function lc(e, t = 200, n = !0, s = !0) {
  if (t <= 0)
    return e;
  const r = b(e.value), i = ac(() => {
    r.value = e.value;
  }, t, n, s);
  return G(e, () => i()), r;
}
function sr(e, t) {
  sc() && Ft(e, t);
}
function Od(e = 0, t = {}) {
  let n = f(e);
  const s = b(e), {
    max: r = Number.POSITIVE_INFINITY,
    min: i = Number.NEGATIVE_INFINITY
  } = t, o = (c = 1) => s.value = Math.max(Math.min(r, s.value + c), i), a = (c = 1) => s.value = Math.min(Math.max(i, s.value - c), r), l = () => s.value, d = (c) => s.value = Math.max(i, Math.min(r, c));
  return { count: s, inc: o, dec: a, get: l, set: d, reset: (c = n) => (n = c, d(c)) };
}
function rs(e, t, n) {
  return G(
    e,
    (r, i, o) => {
      r && t(r, i, o);
    },
    {
      ...n,
      once: !1
    }
  );
}
const rr = Kl ? window : void 0;
function cc() {
  const e = b(!1), t = ct();
  return t && Ie(() => {
    e.value = !0;
  }, t), e;
}
function uc(e) {
  const t = cc();
  return A(() => (t.value, !!e()));
}
function et(e, t = {}) {
  const { window: n = rr } = t, s = uc(() => n && "matchMedia" in n && typeof n.matchMedia == "function");
  let r;
  const i = b(!1), o = (d) => {
    i.value = d.matches;
  }, a = () => {
    r && ("removeEventListener" in r ? r.removeEventListener("change", o) : r.removeListener(o));
  }, l = jt(() => {
    s.value && (a(), r = n.matchMedia(je(e)), "addEventListener" in r ? r.addEventListener("change", o) : r.addListener(o), i.value = r.matches);
  });
  return Jl(() => {
    l(), a(), r = void 0;
  }), i;
}
function dc(e, t = {}) {
  function n(u, c) {
    let h = je(e[je(u)]);
    return c != null && (h = nc(h, c)), typeof h == "number" && (h = `${h}px`), h;
  }
  const { window: s = rr, strategy: r = "min-width" } = t;
  function i(u) {
    return s ? s.matchMedia(u).matches : !1;
  }
  const o = (u) => et(() => `(min-width: ${n(u)})`, t), a = (u) => et(() => `(max-width: ${n(u)})`, t), l = Object.keys(e).reduce((u, c) => (Object.defineProperty(u, c, {
    get: () => r === "min-width" ? o(c) : a(c),
    enumerable: !0,
    configurable: !0
  }), u), {});
  function d() {
    const u = Object.keys(e).map((c) => [c, o(c)]);
    return A(() => u.filter(([, c]) => c.value).map(([c]) => c));
  }
  return Object.assign(l, {
    greaterOrEqual: o,
    smallerOrEqual: a,
    greater(u) {
      return et(() => `(min-width: ${n(u, 0.1)})`, t);
    },
    smaller(u) {
      return et(() => `(max-width: ${n(u, -0.1)})`, t);
    },
    between(u, c) {
      return et(() => `(min-width: ${n(u)}) and (max-width: ${n(c, -0.1)})`, t);
    },
    isGreater(u) {
      return i(`(min-width: ${n(u, 0.1)})`);
    },
    isGreaterOrEqual(u) {
      return i(`(min-width: ${n(u)})`);
    },
    isSmaller(u) {
      return i(`(max-width: ${n(u, -0.1)})`);
    },
    isSmallerOrEqual(u) {
      return i(`(max-width: ${n(u)})`);
    },
    isInBetween(u, c) {
      return i(`(min-width: ${n(u)}) and (max-width: ${n(c, -0.1)})`);
    },
    current: d,
    active() {
      const u = d();
      return A(() => u.value.length === 0 ? "" : u.value.at(-1));
    }
  });
}
function fc(e) {
  return JSON.parse(JSON.stringify(e));
}
function Rd(e, t, n, s = {}) {
  var r, i, o;
  const {
    clone: a = !1,
    passive: l = !1,
    eventName: d,
    deep: u = !1,
    defaultValue: c,
    shouldEmit: h
  } = s, v = ct(), y = n || (v == null ? void 0 : v.emit) || ((r = v == null ? void 0 : v.$emit) == null ? void 0 : r.bind(v)) || ((o = (i = v == null ? void 0 : v.proxy) == null ? void 0 : i.$emit) == null ? void 0 : o.bind(v == null ? void 0 : v.proxy));
  let p = d;
  p = p || `update:${t.toString()}`;
  const g = (N) => a ? typeof a == "function" ? a(N) : fc(N) : N, S = () => Zl(e[t]) ? g(e[t]) : c, E = (N) => {
    h ? h(N) && y(p, N) : y(p, N);
  };
  if (l) {
    const N = S(), Y = b(N);
    let H = !1;
    return G(
      () => e[t],
      (I) => {
        H || (H = !0, Y.value = g(I), ds(() => H = !1));
      }
    ), G(
      Y,
      (I) => {
        !H && (I !== e[t] || u) && E(I);
      },
      { deep: u }
    ), Y;
  } else
    return A({
      get() {
        return S();
      },
      set(N) {
        E(N);
      }
    });
}
const pc = { key: 0 }, hc = { key: 1 }, mc = /* @__PURE__ */ ee({
  __name: "community-selector",
  props: {
    selectedCommunity: {},
    selectedTenantId: {},
    hideThreadSelector: { type: Boolean }
  },
  emits: ["update:selected-community"],
  setup(e, { emit: t }) {
    const n = e, s = t, { $i18n: r } = Oe("content-type-selector"), i = b(""), o = b(!1), a = b([]), l = b([]), d = ut(/* @__PURE__ */ new Map()), u = b("community"), c = b(), h = A(() => r("Communities")), v = A(() => {
      const I = [...d.values()];
      return i.value.length ? I.filter((O) => l.value.includes(O.subject_uri)).sort((O, z) => O.title > z.title ? 1 : -1) : I.filter((O) => {
        var z;
        return O.is_hidden === !1 || !((z = c.value) != null && z.has(O.subject_uri));
      }).sort((O, z) => O.title > z.title ? 1 : -1);
    }), y = A(() => new Map(v.value.map((I) => [I.id, I]))), { sectionsList: p, sectionedThreads: g, fetchSections: S, resetData: E } = er({
      type: u,
      threadMap: y
    });
    G(
      () => n.selectedTenantId,
      async () => {
        d.clear(), E(), i.value = "", S().then(H);
      },
      { immediate: !0 }
    );
    const N = A(() => (v.value || []).filter((I) => !g.get(I.id) && !I.is_hidden)), Y = A(() => ({
      name: h.value,
      position: p.value.length + 1,
      id: Xl,
      isExpanded: !0,
      threads: N.value,
      isReadOnly: !0
    }));
    G([p, Y], () => {
      a.value = [...p.value, Y.value], a.value = a.value.filter((I) => I.threads.length > 0);
    }, { immediate: !0 });
    async function H() {
      try {
        o.value = !0, (await Ro()).result.forEach((O) => {
          const z = d.get(O.subject_uri) || {};
          d.set(O.subject_uri, Object.assign(z, O));
        });
      } catch {
      }
      o.value = !1;
    }
    return sr(G(
      oc(i, tr),
      async (I) => {
        if (I.length) {
          const O = await Do({
            favorites: "with",
            hidden: "with",
            query: I,
            my_community: !0,
            select_predicate: void 0,
            page: 0,
            limit: 100
          });
          l.value = O.map((z) => z.subject_uri);
        }
      },
      { immediate: !0 }
    )), (I, O) => {
      const z = xe("mask");
      return !I.selectedCommunity || !I.selectedCommunity.value ? (m(), _("div", pc, [
        ae((m(), W(Ks, {
          modelValue: f(i),
          "onUpdate:modelValue": O[0] || (O[0] = (X) => fe(i) ? i.value = X : null),
          "section-list": f(a),
          "source-type": "Community"
        }, {
          sectionThread: D(({ thread: X }) => [
            (m(), W(f(Mt), {
              key: X.subject_uri,
              class: "border-t border-grey-4 !rounded-none community-tile",
              name: X.title,
              transparent: "",
              onClick: (Te) => s("update:selected-community", {
                value: X.subject_uri,
                label: X.title
              })
            }, {
              image: D(() => [
                x(ss, {
                  id: X.id,
                  class: "rounded",
                  model: "community"
                }, null, 8, ["id"])
              ]),
              _: 2
            }, 1032, ["name", "onClick"]))
          ]),
          _: 1
        }, 8, ["modelValue", "section-list"])), [
          [z, f(o)]
        ])
      ])) : (m(), _("div", hc, [
        x(Js, {
          "hide-option": I.hideThreadSelector,
          "selected-thread": I.selectedCommunity,
          "onUpdate:selectedThread": O[1] || (O[1] = (X) => s("update:selected-community", X))
        }, {
          tileImage: D(({ selectedThread: X }) => [
            x(ss, {
              id: X.id,
              class: "rounded",
              model: "community"
            }, null, 8, ["id"])
          ]),
          _: 1
        }, 8, ["hide-option", "selected-thread"])
      ]));
    };
  }
}), yc = /* @__PURE__ */ ue(mc, [["__scopeId", "data-v-370f38c7"]]), vc = {
  text: "Posts",
  singular: "Post",
  model: T.Post,
  fonticon: "newspaper",
  color: "text-color-post",
  bgcolor: "bg-color-post",
  bordercolor: "border-color-post",
  canDraft: !0,
  canExportAsPdf: !0,
  order: 1,
  autosave: {
    creation: !0,
    edition: !0
  },
  // routes: {
  //   [EContext.COMMUNITY]: { name: 'community-thread_id-index-content_type', params: { content_type: IContentModel.Post } },
  //   [EContext.DM]: { name: 'dm-thread_id-index-content_type', params: { content_type: IContentModel.Post } },
  // },
  backend: {
    is_enabled_token: "post_is_enabled",
    min_acl_token: "post_min_acl",
    default_type_for_creation: "Post"
  }
}, wc = {
  text: "Media",
  singular: "Media",
  model: T.Media,
  fonticon: "picture",
  color: "text-color-media",
  bgcolor: "bg-color-media",
  bordercolor: "border-color-media",
  canDraft: !0,
  order: 2,
  autosave: {},
  // routes: {
  //   [EContext.COMMUNITY]: { name: 'community-thread_id-index-media' },
  //   [EContext.DM]: { name: 'dm-thread_id-index-media' },
  // },
  backend: {
    is_enabled_token: "media_is_enabled",
    min_acl_token: "media_min_acl",
    default_type_for_creation: "Media"
  }
}, _c = {
  text: "Ideas",
  singular: "Idea",
  model: T.Idea,
  fonticon: "lamp",
  color: "text-color-idea",
  bgcolor: "bg-color-idea",
  bordercolor: "border-color-idea",
  canDraft: !0,
  canExportAsPdf: !0,
  order: 3,
  autosave: {
    creation: !0,
    edition: !0
  },
  // routes: {
  //   [EContext.COMMUNITY]: { name: 'community-thread_id-index-idea' },
  // },
  backend: {
    is_enabled_token: "ideation_is_enabled",
    min_acl_token: "ideation_min_acl",
    default_type_for_creation: "Idea"
  }
}, gc = {
  text: "Questions",
  singular: "Question",
  model: T.Question,
  fonticon: "comment-question",
  color: "text-color-question",
  bgcolor: "bg-color-question",
  bordercolor: "border-color-question",
  canDraft: !0,
  canExportAsPdf: !0,
  order: 4,
  autosave: {
    creation: !0,
    edition: !0
  },
  // routes: {
  //   [EContext.COMMUNITY]: { name: 'community-thread_id-index-question' },
  // },
  backend: {
    is_enabled_token: "qna_is_enabled",
    min_acl_token: "qna_min_acl",
    default_type_for_creation: "Question"
  }
}, bc = {
  POST: vc,
  MEDIA: wc,
  IDEA: _c,
  QUESTION: gc
};
function Wn() {
  const { $i18n: e } = Oe("content-types"), t = Object.fromEntries(Object.values(bc).map((s) => [s.singular.toUpperCase(), A(() => ({
    ...s,
    // to: contentRoute,
    // from: _from,
    // selected: route?.path === path,
    text: e(s.text),
    singular: e(s.singular),
    create: e(`create${s.singular}`)
  }))])), n = (s) => Object.values(t).find((r) => r.value.model === s);
  return {
    POST: t.POST,
    MEDIA: t.MEDIA,
    IDEA: t.IDEA,
    QUESTION: t.QUESTION,
    getContentType: n
  };
}
function Sc(e) {
  const t = Wn(), n = A(() => [
    t.POST.value,
    t.MEDIA.value,
    t.IDEA.value,
    t.QUESTION.value
  ]);
  return {
    contents: A(() => {
      const r = Z(e);
      if (!r || !r.user_access)
        return [];
      const i = [...n.value];
      return (!r.qna_is_enabled || r.qna_min_acl > r.user_access) && i.splice(i.indexOf(t.QUESTION.value), 1), (!r.ideation_is_enabled || r.ideation_min_acl > r.user_access) && i.splice(i.indexOf(t.IDEA.value), 1), (!r.post_is_enabled || r.post_min_acl > r.user_access) && i.splice(i.indexOf(t.POST.value), 1), (!Gt("community.creation.media").value || !r.media_is_enabled || r.media_min_acl > r.user_access) && i.splice(i.indexOf(t.MEDIA.value), 1), i.sort(
        (o, a) => o.order === a.order ? 0 : o.order > a.order ? 1 : -1
      );
    }),
    allAvailableContentTypes: n
  };
}
function Ac() {
  const e = Wn();
  return { contents: A(() => [e.POST.value, e.MEDIA.value, e.IDEA.value]) };
}
function Cc() {
  const e = Wn(), t = b(!0), n = A(() => [e.POST.value, e.MEDIA.value]);
  return { contents: A(() => {
    const r = [...n.value];
    return Gt("conversation.creation.post").value || r.splice(r.indexOf(e.POST.value), 1), r.sort((i, o) => i.order === o.order ? 0 : i.order > o.order ? 1 : -1);
  }), isUserAtLeastAuthor: t, allAvailableContentTypes: n };
}
const Tc = { key: 0 }, Pc = { class: "pt-2 mb-0" }, Ec = {
  key: 1,
  class: "flex community-access-error"
}, $c = /* @__PURE__ */ ee({
  __name: "content-type-selector",
  props: {
    threadId: {},
    contentType: {},
    createConvoFlag: { type: Boolean },
    isPersonalSpace: { type: Boolean },
    currentUser: {},
    platformId: {},
    isConversationSelected: { type: Boolean },
    availableContentTypes: {}
  },
  emits: ["update:contentType", "noType"],
  setup(e, { emit: t }) {
    const n = e, s = t, r = b(), i = b(), o = b(!1), a = Ac(), l = Cc(), d = Sc(r);
    Ie(async () => {
      o.value = !0, n.isConversationSelected && !n.createConvoFlag ? i.value = await Ns(n.currentUser, n.platformId, n.threadId) : !n.isConversationSelected && !n.isPersonalSpace && (r.value = (await ks(n.threadId)).result), o.value = !1;
    });
    const u = (y) => n.contentType === y, { $i18n: c } = Oe("content-types"), h = A(() => {
      let y = [];
      return n.isPersonalSpace ? y = a.contents.value : i.value || n.createConvoFlag ? y = l.contents.value : y = d.contents.value, y.length ? y.map((p) => p.singular.includes("_") && p.text.includes("_") ? { ...p, singular: p.singular.split("_")[2], text: p.text.split("_")[2], className: "w-[3em] max-w-[3em]" } : p) : [];
    }), v = A(() => {
      let y = h.value;
      return n.availableContentTypes && n.availableContentTypes.length > 0 && (y = y.filter((p) => {
        var g;
        return (g = n.availableContentTypes) == null ? void 0 : g.includes(p.model);
      })), y.map((p) => ({
        ...p,
        active: u(p.model),
        handler: () => s("update:contentType", p.model)
      }));
    });
    return G(v, () => {
      var y;
      v.value.find((p) => p.model === n.contentType) || s("update:contentType", (y = v.value[0]) == null ? void 0 : y.model);
    }), sr(jt(() => {
      var y, p;
      if (((y = v.value) == null ? void 0 : y.length) === 1) {
        const g = v.value[0];
        s("update:contentType", g.model);
      }
      ((p = v.value) == null ? void 0 : p.length) > 0 ? s("noType", !1) : s("noType", !0);
    })), (y, p) => {
      var E;
      const g = ne("vu-message"), S = xe("mask");
      return ae((m(), _("div", {
        class: q(["content-type-selector-container", {
          "h-10": f(o)
        }])
      }, [
        (E = f(v)) != null && E.length && !f(o) ? (m(), _("div", Tc, [
          $("h5", Pc, U(f(c)("Type")), 1),
          x(f(cl), {
            class: "content-type-selector-icons h-24 gap-2",
            icons: f(v),
            "left-align": ""
          }, null, 8, ["icons"])
        ])) : f(o) ? k("", !0) : (m(), _("div", Ec, [
          x(g, {
            class: "max-w-full",
            closable: !1,
            color: "error",
            icon: "true",
            show: ""
          }, {
            default: D(() => [
              Le(U(f(c)("CannotPublishError")), 1)
            ]),
            _: 1
          })
        ]))
      ], 2)), [
        [S, f(o)]
      ]);
    };
  }
}), xc = /* @__PURE__ */ ue($c, [["__scopeId", "data-v-b8d8a220"]]), kc = "380px", Ic = "465px", Oc = "640px", Rc = "768px", Dc = "1024px", Nc = "1280px", Mc = {
  "2xs": "300px",
  xs: kc,
  tiny: Ic,
  sm: Oc,
  md: Rc,
  "2md": "960px",
  lg: Dc,
  xl: Nc,
  "2xl": "1536px"
}, Lc = (() => {
  const e = {};
  for (const [t, n] of Object.entries(Mc))
    e[t] = Number.parseInt(n, 10);
  return Object.freeze(e);
})(), Uc = ["src"], ir = /* @__PURE__ */ ee({
  __name: "media-user",
  props: {
    login: { default: void 0 },
    hashKey: { default: void 0 },
    hidePresence: { type: Boolean },
    mode: { default: "" },
    fingerprint: { default: void 0 }
  },
  setup(e) {
    const t = e, n = Fe(t, "login"), s = Fe(t, "hashKey"), r = ke(), i = {
      tiny: "tiny",
      medium: "medium",
      compact: "small",
      small: "smedium",
      big: "big",
      "2xl": "bigger",
      "3xl": "blarge",
      "": "medium"
    }, o = {
      tiny: "tiny",
      medium: "medium",
      compact: "small",
      small: "smalldium",
      big: "big",
      "2xl": "bigger",
      "3xl": "blarge",
      "": "medium"
    };
    function a() {
      let y = "/api/user/getpicture/";
      return n.value ? y += `login/${n.value}` : s.value && (y += `hash_key/${s.value}`), t.fingerprint && (y += `/fingerprint/${t.fingerprint}`), rt(`${r}${y}`);
    }
    const l = dc(Lc).smaller("md"), d = A(() => l.value ? o : i), u = b(), c = it(), h = rs(u, async (y) => {
      var p;
      if (t.hidePresence || !n.value)
        return h();
      try {
        const [g, S] = await ft([
          "DS/RTVueUserPresenceAPI/RTVueUserPresenceAPI",
          "vuejs"
        ]), E = S.extend(g);
        c.value = new E({
          propsData: {
            login: n.value,
            tenant: Q(),
            swymUrl: r
          }
        }), c.value.$mount(), (p = y.parentElement) == null || p.replaceChild(c.value.$el, y), c.value.$el.classList.add(d.value[t.mode]);
      } catch {
      }
    }), v = rs(n, (y) => {
      c.value && (c.value.login = y);
    });
    return Ft(() => {
      h(), v(), c.value && c.value.$destroy();
    }), (y, p) => (m(), _("img", {
      ref_key: "elRef",
      ref: u,
      class: "max-w-full max-h-full",
      src: a()
    }, null, 8, Uc));
  }
}), Fc = /* @__PURE__ */ ee({
  __name: "user-picture",
  props: {
    hidePresence: { type: Boolean },
    mode: {},
    userFullName: {},
    disableRichUserTooltip: { type: Boolean },
    disableUserLinkNavigation: { type: Boolean },
    userHashKey: {},
    userLogin: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = In("disableUserTooltipAndLinkNavigation", void 0);
    return (s, r) => s.disableUserLinkNavigation || f(n) ? (m(), W(ir, {
      key: 0,
      class: q(["user-picture w-full h-full rounded-full aspect-square", [s.mode]]),
      fingerprint: s.fingerprint,
      hash_key: s.userHashKey,
      "hide-presence": s.hidePresence,
      login: s.userLogin,
      mode: s.mode
    }, null, 8, ["class", "fingerprint", "hash_key", "hide-presence", "login", "mode"])) : k("", !0);
  }
}), tt = /* @__PURE__ */ ue(Fc, [["__scopeId", "data-v-85f89fd8"]]), jc = {
  key: 0,
  class: "grid grid-cols-2 grid-rows-2 overflow-hidden h-full w-full px-1.5"
}, Bc = { class: "flex justify-center items-center" }, qc = { class: "h-2lg rounded-full self-center" }, Vc = { key: 0 }, Wc = { key: 1 }, Hc = { class: "flex justify-center items-center" }, zc = { class: "h-2lg rounded-full self-center" }, Gc = {
  key: 2,
  class: "flex justify-center items-center"
}, Yc = { class: "h-2lg rounded-full self-center" }, Qc = {
  key: 3,
  class: "flex justify-center items-center"
}, Xc = { class: "h-2lg rounded-full self-center" }, Jc = {
  key: 4,
  class: "flex justify-center items-center"
}, Kc = { class: "h-2lg bg-grey-3 text-grey-7 rounded-full text-3xs overflow-hidden aspect-square flex items-center justify-center font-bold" }, Zc = {
  key: 1,
  class: "flex h-full justify-center"
}, eu = { class: "w-8xl" }, an = /* @__PURE__ */ ee({
  __name: "thread-tile-conversation-thumbnail",
  props: {
    thread: {},
    hidePresence: { type: Boolean },
    currentUser: {}
  },
  setup(e) {
    const t = e, n = A(() => {
      if (t.thread.users.length === 1)
        return t.thread.users;
      const s = t.thread.users.filter((r) => r.login !== t.currentUser);
      return s.length > 4 ? s.slice(0, 3) : s.slice(0, 4);
    });
    return (s, r) => f(n).length > 1 ? (m(), _("div", jc, [
      $("div", Bc, [
        $("div", qc, [
          x(tt, {
            "disable-rich-user-tooltip": "",
            "disable-user-link-navigation": "",
            "hide-presence": s.hidePresence,
            mode: "tiny",
            "user-login": f(n)[0].login
          }, null, 8, ["hide-presence", "user-login"])
        ])
      ]),
      f(n).length === 2 ? (m(), _("div", Vc)) : k("", !0),
      f(n).length === 2 ? (m(), _("div", Wc)) : k("", !0),
      $("div", Hc, [
        $("div", zc, [
          x(tt, {
            "disable-rich-user-tooltip": "",
            "disable-user-link-navigation": "",
            "hide-presence": s.hidePresence,
            mode: "tiny",
            "user-login": f(n)[1].login
          }, null, 8, ["hide-presence", "user-login"])
        ])
      ]),
      f(n)[2] ? (m(), _("div", Gc, [
        $("div", Yc, [
          x(tt, {
            "disable-rich-user-tooltip": "",
            "disable-user-link-navigation": "",
            "hide-presence": s.hidePresence,
            mode: "tiny",
            "user-login": f(n)[2].login
          }, null, 8, ["hide-presence", "user-login"])
        ])
      ])) : k("", !0),
      f(n)[3] ? (m(), _("div", Qc, [
        $("div", Xc, [
          x(tt, {
            "disable-rich-user-tooltip": "",
            "disable-user-link-navigation": "",
            "hide-presence": s.hidePresence,
            mode: "tiny",
            "user-login": f(n)[3].login
          }, null, 8, ["hide-presence", "user-login"])
        ])
      ])) : k("", !0),
      s.thread.users.length > 5 ? (m(), _("div", Jc, [
        $("span", Kc, " +" + U(s.thread.users.length - 4), 1)
      ])) : k("", !0)
    ])) : (m(), _("div", Zc, [
      $("div", eu, [
        x(tt, {
          "disable-rich-user-tooltip": "",
          "disable-user-link-navigation": "",
          "hide-presence": s.hidePresence,
          mode: "medium",
          "user-login": f(n)[0].login
        }, null, 8, ["hide-presence", "user-login"])
      ])
    ]));
  }
}), ie = be.extend({
  hooks: {
    beforeRequest: [
      bs,
      Ht(M.SEARCH)
    ],
    afterResponse: [
      (...e) => Nn(M.SEARCH, ie)(...e),
      (...e) => qt(ie, be)(...e)
    ]
  }
}), tu = 10, nu = 200;
function su({ fetch: e, merge: t, resolve: n, options: s }) {
  let r = [], i;
  const o = async () => {
    if (F.debug(`[decorator mutualizer] process batch request for ${r.length} request`, r), i && clearTimeout(i), i = void 0, !r.length)
      return;
    const a = r.slice();
    r = [];
    const l = await e(t(a.map((d) => d[0])));
    a.forEach((d) => n([l, d]));
  };
  return s != null && s.sendBeforeUnload && window.addEventListener("beforeunload", o), (a) => new Promise((l, d) => {
    s != null && s.sanitizer && (F.debug("[decorator mutualizer] sanitize bucket", r), r = s == null ? void 0 : s.sanitizer(r, [a, l, d])), r.push([a, l, d]), r.length === ((s == null ? void 0 : s.limit) ?? tu) ? o() : i || (i = setTimeout(o, (s == null ? void 0 : s.throttle) ?? nu));
  });
}
function or(e) {
  const t = [];
  return e.results && e.results.forEach((n) => {
    const s = {
      convUri: "",
      type: "",
      label: ""
    };
    n.attributes.forEach((r) => {
      switch (r.name) {
        case "resourceid":
          s.convUri = r.value;
          break;
        case "ds6w:what/ds6w:type":
        case "ds6w:type":
          s.type = r.value;
          break;
        case "ds6w:label":
          s.label = r.value;
          break;
      }
    }), t.push(s);
  }), t;
}
var ar = /* @__PURE__ */ ((e) => (e.DM = "swym:DirectMessage", e.COMMUNITY = "swym:Community", e.PERSONALSPACE = "swym:PersonalSpace", e))(ar || {});
function ln(e, t) {
  const n = [];
  return e.results ? (t ? e.results.forEach((s) => {
    n.push(iu(s.attributes));
  }) : e.results.forEach((s) => {
    n.push(ru(s.attributes));
  }), n) : [];
}
function lr(e) {
  const t = [];
  return e.results ? (e.results.forEach((n) => {
    t.push(ou(n.attributes));
  }), t) : [];
}
function ru(e) {
  const t = {
    resource_id: "",
    type_icon_url: "",
    full_name: "",
    login: "",
    contentType: "",
    source_id: "",
    format: "",
    id: ""
  };
  return e.forEach((n) => {
    switch (n.name) {
      case "resourceid":
        t.resource_id = n.value, t.login = lt(n.value);
        break;
      case "type_icon_url":
        t.type_icon_url = n.value;
        break;
      case "ds6w:label":
        t.full_name = n.value, t.id = `@${n.value}`;
        break;
      case "ds6w:type":
        t.contentType = lt(n.value);
        break;
      case "sourceid":
        t.source_id = n.value, t.format = n.format;
        break;
      case "ds6w:resourceUid":
        t.uid = n.value;
        break;
    }
  }), t;
}
function iu(e) {
  const t = {
    resource_id: "",
    type_icon_url: "",
    full_name: "",
    login: "",
    contentType: "",
    source_id: "",
    format: "",
    id: ""
  };
  return e.forEach((n) => {
    switch (n.name) {
      case "resourceid":
        t.resource_id = n.value, t.login = lt(n.value);
        break;
      case "type_icon_url":
        t.type_icon_url = n.value;
        break;
      case "ds6w:label":
        t.full_name = n.value, t.id = t.contentType === "DirectMessage" ? (t.resource_id || "").split(":")[4] : `@${n.value}`;
        break;
      case "ds6w:type":
        t.contentType = lt(n.value);
        break;
      case "sourceid":
        t.source_id = n.value, t.format = n.format;
        break;
      case "ds6w:resourceUid":
        t.uid = n.value;
        break;
    }
  }), t;
}
function ou(e) {
  const t = {
    resource_id: "",
    type_icon_url: "",
    full_name: "",
    login: "",
    contentType: "",
    source_id: "",
    format: "",
    id: ""
  };
  return e.forEach((n) => {
    switch (n.name) {
      case "resourceid":
        t.resource_id = n.value;
        break;
      case "type_icon_url":
        t.type_icon_url = n.value;
        break;
      case "ds6w:label":
        t.full_name = n.value, t.id = t.contentType === "DirectMessage" ? (t.resource_id || "").split(":")[4] : `@${n.value}`;
        break;
      case "ds6w:type":
        t.contentType = lt(n.value);
        break;
      case "sourceid":
        t.source_id = n.value, t.format = n.format;
        break;
      case "login":
        t.login = n.value;
        break;
      case "ds6w:resourceUid":
        t.uid = n.value;
        break;
    }
  }), t;
}
function lt(e) {
  return e.split(":")[1];
}
function au(e) {
  const t = "swym:DirectMessage", n = "userConversations";
  return [
    `([ds6w:type]:"${t}" AND `,
    (e || "").trim().split(" ").map((s) => `([ds6w:label]:(${s}) OR ${n}: (${s}))`).join(" AND "),
    ")"
  ].join("");
}
async function lu(e) {
  const t = Q(), n = ["swym"];
  Bn() || n.push("3dmessaging");
  const s = await ie.post("/search", {
    json: {
      query: au(e == null ? void 0 : e.text),
      // Get swym/RT conversations with given search text
      select_predicate: ["ds6w:type", "ds6w:label", "resourceid"],
      tenant: t,
      nresults: 100,
      order_field: "ds6w:modified",
      order_by: "desc",
      label: `conversation-search-${(/* @__PURE__ */ new Date()).getTime()}`,
      with_synthesis: !1,
      source: n
    }
  }).json();
  return {
    data: or(s)
  };
}
async function cu(e) {
  const t = Q(), n = ["swym"], s = await ce(
    `search-user-info-login-${e.text}-${e.userLogin}`,
    () => ie.post("/search", {
      json: {
        nresults: 10,
        query: '[ds6w:type]:("pno:Person")',
        source: n,
        specific_source_parameter: {
          swym: {
            // use of Swym be prefix handler to search for user or groups,
            // then search for groups if not found in the user group index
            additional_query: ` AND personOrGroup:(${e.text})`,
            agoraMode: !0
          }
        },
        select_predicate: ["ds6w:label", "ds6w:type", "login"],
        label: `SocialUserMention-${e.userLogin}-${(/* @__PURE__ */ new Date()).getTime()}`,
        locale: "en",
        start: 0,
        with_synthesis: !1,
        with_synthesis_attribute: !1,
        tenant: t
      }
    }).json(),
    2 * 60 * 1e3
    // 2 min
  );
  return {
    total: s.infos.nhits,
    data: lr(s)
  };
}
const Dd = {
  async getUserInfo(e) {
    const t = Q(), n = ["swym"];
    e.usersGroup && n.push("usersgroup");
    const s = await ce(
      `search-user-info-${e.text}-${e.userLogin}`,
      () => ie.post("/search", {
        json: {
          nresults: 20,
          query: '[ds6w:type]:("foaf:Group" OR "pno:Person")',
          source: n,
          // verifier si le service users groups existe
          // .concat(
          //   usersGroupsServiceIsAvailable === true
          //     ? [ 'usersgroup' ]
          //     : []
          // ),
          specific_source_parameter: {
            usersgroup: {
              additional_query: `AND [ds6w:label]:(${e.text.trim()}*)`
            },
            swym: {
              // use of Swym be prefix handler to search for user or groups,
              // then search for groups if not found in the user group index
              additional_query: ` AND personOrGroup:(${e.text})`,
              agoraMode: !0
            }
          },
          select_predicate: ["ds6w:label", "ds6w:type"],
          label: `SocialUserMention-${e.userLogin}-${(/* @__PURE__ */ new Date()).getTime()}`,
          locale: "en",
          start: 0,
          with_synthesis: !1,
          with_synthesis_attribute: !1,
          tenant: t
        }
      }).json(),
      6e4
    );
    return {
      total: s.infos.nhits,
      data: ln(s)
    };
  },
  getUserInfoWithLogin: su({
    fetch: cu,
    merge: (e) => {
      const t = new Set(e.map((s) => s.text)), n = Array.from(t).map((s) => `"${s}"`).join(" OR ");
      return {
        ...e.pop(),
        // useful to keep the limit
        text: n
      };
    },
    resolve([e, [t, n]]) {
      n(e);
    },
    options: {
      throttle: 300,
      limit: 10
    }
  }),
  async getUsersWithResourceId(e) {
    const t = Q(), n = ["swym"];
    e.usersGroup && n.push("usersgroup");
    const s = await ie.post("/search", {
      json: {
        nresults: 20,
        query: '[ds6w:type]:("foaf:Group" OR "pno:Person")',
        source: n,
        order_by: "desc",
        order_field: "relevance",
        specific_source_parameter: {
          usersgroup: {
            additional_query: `AND ([ds6w:label]:(${e.text.trim()}*) OR [ds6w:label]:"${e.text.trim()}")`
          },
          swym: {
            // use of Swym be prefix handler to search for user or groups, then search for groups if not found in the user group index
            additional_query: ` AND personOrGroup:(${e.text})`,
            agoraMode: !0
          }
        },
        select_predicate: ["ds6w:label", "ds6w:type", "ds6w:resourceUid"],
        label: `3DSwym-${e.userLogin}-${(/* @__PURE__ */ new Date()).getTime()}`,
        locale: "en",
        start: 0,
        with_synthesis: !1,
        with_synthesis_attribute: !1,
        tenant: t
      }
    }).json();
    return {
      total: s.infos.nhits,
      data: ln(s)
    };
  },
  async getUsersAndConversations(e) {
    const t = Q(), n = await ie.post("/search", {
      json: {
        query: `([ds6w:type]:"swym:DirectMessage" AND (${e.text}) AND (NOT dm_type:private)) OR ((topicConversations:(${e.text})) AND (dm_type:private)) OR (personOrGroup:(${e.text}))`,
        select_predicate: ["ds6w:type", "ds6w:label", "title", "id", "resourceid"],
        tenant: t,
        nresults: 50,
        reset: !0,
        label: `3DSwym-${e.userLogin}-${(/* @__PURE__ */ new Date()).getTime()}`,
        with_synthesis: !1,
        with_synthesis_attribute: !1,
        source: ["swym"]
      }
    }).json();
    return {
      data: ln(n, !0)
    };
  },
  /** Fedsearch for conversation search in left column */
  async getConversations(e) {
    const t = Q(), n = await ie.post("/search", {
      json: {
        query: `([ds6w:type]:"swym:DirectMessage" AND (${e.text}))`,
        // Get swym/RT conversations with given search text
        select_predicate: ["ds6w:type", "ds6w:label", "resourceid"],
        tenant: t,
        nresults: 30,
        order_by: "desc",
        label: `conversation-search-${(/* @__PURE__ */ new Date()).getTime()}`,
        with_synthesis: !1,
        source: ["swym", "3dmessaging"]
      }
    }).json();
    return {
      data: or(n)
    };
  },
  // A separate method to include 'login' predicate
  async getUsersAndConversationsWithLogin(e) {
    const t = Q(), n = await ie.post("/search", {
      json: {
        query: `([ds6w:type]:"swym:DirectMessage" AND (${e.text}) AND (NOT dm_type:private)) OR ((topicConversations:(${e.text})) AND (dm_type:private)) OR (personOrGroup:(${e.text}))`,
        select_predicate: ["ds6w:type", "ds6w:label", "title", "id", "resourceid", "login"],
        tenant: t,
        nresults: 50,
        reset: !0,
        label: `3DSwym-${e.userLogin}-${(/* @__PURE__ */ new Date()).getTime()}`,
        with_synthesis: !1,
        with_synthesis_attribute: !1,
        source: ["swym"]
      }
    }).json();
    return {
      data: lr(n)
    };
  },
  /**
   * Retrieve media information from fedsearch using idshasMember
   * @param query Containing all ids of media
   * @returns
   */
  async getMediaFromFedSearch(e) {
    const t = Q();
    return (await ie.post("/search", {
      json: {
        with_indexing_date: !0,
        with_synthesis: !0,
        with_nls: !1,
        label: "3DSearch-skd1",
        locale: "en",
        with_synthesis_hierarchical: !0,
        // select_file: [ 'icon', 'thumbnail_2d' ],
        query: e,
        refine: {},
        order_by: "desc",
        order_field: "relevance",
        nresults: 40,
        start: "0",
        source: ["swym", "3dspace", "drive", "dashboard"],
        tenant: t
      }
    }).json()).results;
  },
  async getUserGroup(e) {
    const t = Q(), s = (await ie.post("/search", {
      json: {
        with_synthesis: !1,
        with_nls: !1,
        label: e,
        with_synthesis_hierarchical: !1,
        query: `[ds6w:type]:"foaf:Group" AND [ds6w:label]:"${e}"`,
        source: [
          "usersgroup"
        ],
        tenant: t
      }
    }).json()).results;
    return Array.isArray(s) ? s.some((r) => r && r.attributes && r.attributes.some((i) => i.name === "ds6w:label" && i.value === e)) : !1;
  },
  async isUserGroupMember(e, t) {
    let n = "";
    e.includes("iam") ? n = `<http://iam.3ds.com/${e.split("iam:")[1]}>` : n = `<uuid:${e}>`;
    const s = Q(), i = (await ie.post("/search", {
      json: {
        with_synthesis: !1,
        with_nls: !1,
        label: "3Dswym-usergroup-search-member",
        select_predicate: ["foaf:member"],
        with_synthesis_hierarchical: !1,
        query: `[ds6w:type]:"foaf:Group" AND [ds6w:label]:"${t}"`,
        source: [
          "usersgroup"
        ],
        tenant: s
      }
    }).json()).results;
    return Array.isArray(i) ? i.some((o) => o && o.attributes && o.attributes.some((a) => a.name === "foaf:member" && a.value === n)) : !1;
  },
  async getContentsFromFedSearch(e, t, n = 0) {
    const s = Q();
    return (await ie.post("/search", {
      json: {
        with_synthesis: !1,
        with_nls: !1,
        with_synthesis_hierarchical: !1,
        label: `3DSearch-${e}-${t}`,
        query: `((${t}) AND [ds6w:containerUid]: ("${e}"))`,
        order_by: "desc",
        order_field: "ds6w:created",
        nresults: 50 + n * 50,
        start: 0 + n * 50,
        source: ["swym"],
        tenant: s
      }
    }).json()).results;
  },
  /**
   * Get content information from fedsearch using resourceUid
   *
   * @info Use this when you want to get the type of item
   *
   * @param params subjectUri for search
   * @returns Search results
   */
  async getContentByResource(e) {
    const t = Q();
    return ce(
      `content-type-${e}`,
      () => ie.post("/search", {
        json: {
          with_synthesis: !1,
          with_nls: !1,
          select_predicate: ["ds6w:type"],
          with_synthesis_hierarchical: !1,
          label: `3DSearch-swym-container-type-${e}`,
          query: `[ds6w:resourceUid]: "${e}"`,
          order_by: "desc",
          order_field: "ds6w:created",
          source: ["swym", "3dmessaging"],
          tenant: t
        }
      }).json()
    );
  }
};
function is(e) {
  return new Date(e.updated_at || 0).getTime();
}
function uu(e, t, n, s) {
  const r = Ze(e), i = Ze(s), o = b([]), a = A(() => {
    let p = r.value.slice();
    return Z(n) ? p = p.filter((g) => o.value.includes(g.subject_uri)).sort((g, S) => {
      var I, O;
      const E = g.users.length <= 2, N = S.users.length <= 2;
      if (E < N)
        return 1;
      if (E > N)
        return -1;
      const Y = ((I = o.value) == null ? void 0 : I.indexOf(g.subject_uri)) || 0, H = ((O = o.value) == null ? void 0 : O.indexOf(S.subject_uri)) || 0;
      return Y < H ? -1 : Y === H ? 0 : 1;
    }) : p = p.filter((g) => g.is_hidden === !1).sort((g, S) => {
      const E = is(g), N = is(S);
      return E < N ? 1 : E === N ? 0 : -1;
    }), p;
  });
  G(Ze(n), async (p) => {
    p.length > 0 ? o.value = (await lu({ text: p, userLogin: i.value })).data.filter((g) => g.type === ar.DM).map((g) => g.convUri) : o.value = [];
  }, { immediate: !0 });
  const l = Ze(t), d = A(
    () => a.value.filter((p) => l.value.find((g) => p.subject_uri === g.subjectUri))
  ), u = A(
    () => d.value.length === 0 ? a.value : a.value.filter((p) => {
      var g;
      return !((g = l.value) != null && g.find((S) => p.subject_uri === S.subjectUri));
    })
  );
  function c() {
    const p = a.value.filter((S) => {
      var E;
      return ((E = S.users) == null ? void 0 : E.length) === 2;
    }), g = /* @__PURE__ */ new Set();
    for (const S of p)
      g.add(S.users[0].login), g.add(S.users[1].login);
    return g.add(i.value), [...g];
  }
  const h = b([]);
  function v(p) {
    const g = c();
    return p.filter((S) => !g.includes(S.login));
  }
  async function y(p) {
    try {
      if (p.length > 2) {
        const { result: g } = await Zs({ query: p, limit: 30, page: 0 }), S = v(g);
        h.value = S.map((E) => ({ ...E, subject_uri: E.uid || E.hash_key || E.login }));
      } else
        h.value = [];
    } catch (g) {
      F.error(g);
    }
  }
  return G(Ze(n), y), {
    suggestedUsersOnSearch: h,
    conversationsListFilteredAndSorted: a,
    favoriteConversationsFilteredAndSorted: d,
    notfavoriteConversationsFilteredAndSorted: u
  };
}
const Tn = 1e4, du = 2 ** 31 - 1, os = du, fu = { key: 0 }, pu = { key: 1 }, hu = { key: 0 }, mu = { key: 1 }, yu = { class: "fixed ml-20 top-0 !z-[5000] flex flex-col w-[calc(100%-10px)]" }, vu = { class: "absolute" }, wu = /* @__PURE__ */ ee({
  __name: "conversation-selector",
  props: {
    disabled: { type: Boolean },
    selectedConversation: {},
    platformId: {},
    hideThreadSelector: { type: Boolean }
  },
  emits: ["update:selected-conversation"],
  setup(e, { emit: t }) {
    const n = e, s = t, { $i18n: r } = Oe("content-type-selector"), i = b(""), o = lc(i, tr, !0), a = b(""), l = b([]), d = b([]), u = b(!1), c = Gt("conversation.rtc"), h = b([]);
    async function v() {
      var P;
      u.value = !0, a.value = (P = (await Yt()).result) == null ? void 0 : P.login;
      try {
        c.value ? (l.value = await qo(a.value, n.platformId), d.value = await Wo(a.value, n.platformId)) : l.value = await (await Xo()).result;
      } catch (se) {
        F.log(se);
      }
      u.value = !1;
    }
    const {
      conversationsListFilteredAndSorted: y,
      suggestedUsersOnSearch: p
    } = uu(
      l,
      d,
      o,
      a
    ), g = A(() => new Map(y.value.map((P) => [P.id.toString(), P]))), S = A(() => c.value ? "externaldm" : "dm"), { sectionsList: E, sectionedThreads: N, fetchSections: Y, resetData: H } = er({
      type: S,
      threadMap: g
    });
    Ie(() => {
      v();
    }), G(
      () => n.platformId,
      async () => {
        l.value = [], i.value = "", H(), Promise.all([Y(), v()]);
      },
      { immediate: !0 }
    );
    const I = A(() => (y.value || []).filter((P) => !N.get(P.id.toString()))), O = A(() => r("MyConversations")), z = A(() => ({
      name: O.value,
      position: E.value.length + 1,
      id: Ql,
      threads: I.value,
      isReadOnly: !0
    }));
    G([E, z], () => {
      h.value = [...E.value, z.value], h.value = h.value.filter((P) => P.threads.length > 0);
    }, { immediate: !0 });
    async function X(P) {
      n.disabled || s("update:selected-conversation", P);
    }
    function Te(P) {
      return P != null && P.topic ? P.topic : (((P == null ? void 0 : P.users.length) === 1 ? P == null ? void 0 : P.users : P == null ? void 0 : P.users.filter((Ae) => Ae.login !== a.value)) || []).map((Ae) => `${Ae.first_name} ${Ae.last_name}`).join(", ");
    }
    const Se = b({
      show: void 0,
      color: "error",
      timeout: Tn
    });
    return (P, se) => {
      const Ae = ne("vu-message"), mt = xe("mask");
      return m(), _(le, null, [
        !P.selectedConversation || !P.selectedConversation.value ? (m(), _("div", fu, [
          ae((m(), W(Ks, {
            modelValue: f(i),
            "onUpdate:modelValue": se[0] || (se[0] = (j) => fe(i) ? i.value = j : null),
            "section-list": f(h),
            "selected-thread": P.selectedConversation,
            "source-type": "conversation"
          }, {
            sectionThread: D(({ thread: j }) => [
              x(f(Mt), {
                class: "border-t border-grey-4 !rounded-none fav-conversation-tile",
                name: Te(j),
                transparent: "",
                onClick: (Qt) => X({
                  value: j.subject_uri,
                  label: Te(j),
                  conversation: j
                })
              }, {
                image: D(() => [
                  x(an, {
                    "current-user": f(a),
                    thread: j
                  }, null, 8, ["current-user", "thread"])
                ]),
                _: 2
              }, 1032, ["name", "onClick"])
            ]),
            _: 1
          }, 8, ["modelValue", "section-list", "selected-thread"])), [
            [mt, f(u)]
          ]),
          f(i) && f(p).length ? (m(), W(f(Xs), {
            key: 0,
            class: "suggested-threads-container",
            "thread-section-name": f(r)("SuggestedConversations"),
            threads: f(p)
          }, {
            threadTile: D(({ thread: j }) => [
              x(f(Mt), {
                class: "border-t border-grey-4 !rounded-none",
                name: `${j.first_name} ${j.last_name}`,
                transparent: "",
                onClick: (Qt) => X({
                  value: j.login,
                  label: `${j.first_name} ${j.last_name}`,
                  login: j.login
                })
              }, {
                image: D(() => [
                  x(an, {
                    "current-user": f(a),
                    thread: { users: [j] }
                  }, null, 8, ["current-user", "thread"])
                ]),
                _: 2
              }, 1032, ["name", "onClick"])
            ]),
            _: 1
          }, 8, ["thread-section-name", "threads"])) : k("", !0)
        ])) : (m(), _("div", pu, [
          x(Js, {
            "selected-thread": P.selectedConversation,
            "hide-option": P.hideThreadSelector,
            "onUpdate:selectedThread": X
          }, {
            tileImage: D(({ selectedThread: j }) => [
              j.login ? (m(), _("div", hu, [
                x(ir, {
                  login: j.login
                }, null, 8, ["login"])
              ])) : k("", !0),
              j.conversation ? (m(), _("div", mu, [
                x(an, {
                  "current-user": f(a),
                  "hide-presence": "",
                  thread: j.conversation
                }, null, 8, ["current-user", "thread"])
              ])) : k("", !0)
            ]),
            _: 1
          }, 8, ["selected-thread", "hide-option"])
        ])),
        $("div", yu, [
          $("div", vu, [
            x(Ae, {
              show: f(Se).show,
              "onUpdate:show": se[1] || (se[1] = (j) => f(Se).show = j),
              class: "custom-message",
              color: f(Se).color,
              icon: "true",
              timeout: f(Se).timeout
            }, {
              default: D(() => [
                Le(U(f(r)("ConversationSearchIssue")), 1)
              ]),
              _: 1
            }, 8, ["show", "color", "timeout"])
          ])
        ])
      ], 64);
    };
  }
}), _u = /* @__PURE__ */ ue(wu, [["__scopeId", "data-v-858be260"]]), gu = {
  key: 0,
  class: "platform-selector"
}, bu = { class: "text-grey-7" }, Su = /* @__PURE__ */ ee({
  __name: "m-platform-selector",
  props: {
    platforms: {},
    platformId: {}
  },
  emits: ["update:selected-platformId", "onTenantChangeFailure"],
  setup(e, { emit: t }) {
    const n = e, s = t, { $i18n: r } = Oe("publish-form"), i = b([]), o = b(""), a = b(n.platformId), l = b([]);
    async function d() {
      if (n.platforms)
        n.platforms.forEach((h) => {
          if (!h.id || !h.label || !h.url)
            throw new Error("Each platform must contain the properties id, label and url");
          return n.platforms;
        });
      else
        try {
          const h = await hn(M.SWYM, { platformId: n.platformId, public: !0 });
          l.value.push({
            value: h.platformId,
            label: h.displayName
          });
        } catch (h) {
          F.log(h);
        } finally {
          hn(M.SWYM, { public: !0 }).then((h) => h.map((v) => ({ value: v.platformId, label: v.displayName }))).then((h) => {
            h.forEach((v) => {
              v.value !== n.platformId && l.value.push(v);
            });
          });
        }
    }
    Ie(async () => {
      var h;
      await c(n.platformId || Q(), !0), (h = i.value) == null || h.push(ke()), await d();
    });
    async function u(h, v) {
      var p;
      pn(h), a.value = h;
      const y = await he(M.SWYM, h);
      o.value = y, gn(y), (p = i.value) == null || p.push(y), v || s("update:selected-platformId", h);
    }
    async function c(h, v = !1) {
      var y;
      try {
        await u(h, v);
      } catch (p) {
        F.error(p);
        const g = (y = i.value) == null ? void 0 : y.pop();
        s("onTenantChangeFailure", {
          old: o.value,
          new: g
        });
      }
    }
    return (h, v) => {
      const y = ne("vu-select");
      return l.value && l.value.length > 1 ? (m(), _("div", gu, [
        $("label", bu, U(f(r)("Platform")), 1),
        x(y, {
          modelValue: a.value,
          "onUpdate:modelValue": [
            v[0] || (v[0] = (p) => a.value = p),
            c
          ],
          options: l.value,
          placeholder: f(r)("SelectPlatform")
        }, null, 8, ["modelValue", "options", "placeholder"])
      ])) : k("", !0);
    };
  }
});
var L = /* @__PURE__ */ ((e) => (e.Community = "Community", e.Conversation = "Conversation", e.PersonalSpace = "Personal Space", e))(L || {});
const Au = /* @__PURE__ */ ee({
  __name: "thread-picker",
  props: {
    modelValue: { required: !0 },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e) {
    const { $i18n: t } = Oe("publish-form"), n = ut([
      {
        label: A(() => t("Communities")),
        value: L.Community,
        fonticon: "users-alt"
      },
      {
        label: A(() => t("Conversation")),
        value: L.Conversation,
        fonticon: "chat"
      },
      {
        label: A(() => t("PersonalSpace")),
        value: L.PersonalSpace,
        fonticon: "user-feather"
      }
    ]), s = Bt(e, "modelValue"), r = A({
      get() {
        return n.find((i) => i.value === s.value);
      },
      set(i) {
        s.value = i.value;
      }
    });
    return (i, o) => (m(), W(f(Ul), {
      modelValue: f(r),
      "onUpdate:modelValue": o[0] || (o[0] = (a) => fe(r) ? r.value = a : null),
      items: f(n)
    }, null, 8, ["modelValue", "items"]));
  }
});
function Cu(e) {
  let t = e;
  Bn() && (t.includes("resources/AppsMngtRegistry") ? t = e : t = `${e}/resources/AppsMngtRegistry`.replace(/([^:]\/)\/+/g, "$1")), Lr(t);
}
async function Tu() {
  try {
    const e = await pt("DS/PlatformAPI/PlatformAPI");
    let t = e.getApplicationConfiguration("app.urls.registry");
    return !t && Bn() && (t = e.getApplicationConfiguration("app.urls.myapps")), t ? Cu(t) : F.warn("Fail to fetch Registry URL."), t;
  } catch (e) {
    throw F.error(e), new Error("Fail to fetch AMD module(s).");
  }
}
function Pu(e, t, n) {
  const s = ke(), r = e.result.community_subject_uri, i = e.result.subject_uri;
  let o = "";
  t === L.Conversation ? o = s.concat(`/dm/${r}`) : t === L.Community ? o = s.concat(`/community/${r}`) : t === L.PersonalSpace && (o = s.concat("/me/personal-space"));
  const a = new URL(o);
  return n === T.Media ? a.searchParams.append("media", i) : a.searchParams.append("content", i), a.href;
}
function Eu(e, t) {
  return e != null && e.topic ? e.topic : (((e == null ? void 0 : e.users.length) === 1 ? e == null ? void 0 : e.users : e == null ? void 0 : e.users.filter((s) => s.login !== t)) || []).map((s) => `${s.first_name} ${s.last_name}`).join(", ");
}
function $u({
  base64Image: e,
  title: t
}) {
  let n, s, r;
  if (e instanceof File)
    r = e;
  else if (typeof e == "string") {
    if (n = e.split(","), s = null, n[0] === "data:image/png;base64" ? s = `${t}.png` : n[0] === "data:image/jpeg;base64" ? s = `${t}.jpeg` : n[0] === "data:application/vndopenxmlformats-officedocumentwordprocessingmldocument;base64" ? s = `${t}.docx` : n[0] === "data:image/vnd.openxmlformats-officedocument.presentationml.presentation;base64" ? s = `${t}.pptx` : n[0] === "data:image/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64" && (s = `${t}.xlsx`), s) {
      const i = { type: n[0] };
      i["Content-Transfer-Encoding"] = "base64", r = new Blob([n[1]], i);
    }
  } else e instanceof Blob && (r = e, s = `${t}.jpeg`);
  return { mediaFile: r, fileName: s };
}
var cr = /* @__PURE__ */ ((e) => (e[e.small = 320] = "small", e[e.medium = 640] = "medium", e[e.large = 960] = "large", e[e.M1 = 520] = "M1", e[e.L1 = 960] = "L1", e[e.XL1 = 1920] = "XL1", e[e.XXL1 = 3840] = "XXL1", e))(cr || {});
function as(e, t, n) {
  return e === "processed" && t > 0 && n > 0;
}
function xu(e, t) {
  return Math.max(e, t);
}
function ls(e) {
  return e === 3840 ? "xxl1" : e === 1920 ? "xl1" : e === 960 ? "l1" : "m1";
}
function ku(e, t) {
  const n = xu(e, t);
  return n <= 520 ? ["o1"] : n <= 960 ? ["m1", "o1"] : n <= 1920 ? ["m1", "l1", "o1"] : n <= 3840 ? ["m1", "l1", "xl1", "o1"] : ["m1", "l1", "xl1", "xxl1"];
}
function Iu(e, t, n) {
  const s = ku(e, t);
  return n ? s.includes(ls(n)) ? ls(n) : s.pop() : s.shift();
}
function Ou(e = 320) {
  return e === 640 ? "m" : [
    960,
    1920,
    960,
    520
    /* M1 */
  ].includes(e) ? "l" : "s";
}
function Ru(e, t, n, s, r, i, o = "", a) {
  const l = A(() => as(Z(r), Z(t), Z(n)) ? Iu(Z(t), Z(n), Z(a)) : Ou(Z(a))), d = A(() => {
    const u = Z(o) ? `/update/${Z(o)}` : "", c = `${Z(i)}/api/media/streammedia/id/${Z(e)}/type/`;
    return Z(r) !== "processed" ? rt(`${c}thumb/key/l_thumb${u}`) : as(Z(r), Z(t), Z(n)) ? rt(`${c}picture/key/${Z(l)}${u}`) : rt(`${c}thumb/key/${Z(l)}_thumb${u}`);
  });
  return { config: l, url: d };
}
async function ur(e, t) {
  return { ...e, result: await Du(e.result) };
}
async function Du(e, t) {
  var s, r, i, o, a, l, d, u, c, h, v, y, p, g, S, E, N, Y, H, I;
  const n = {
    id: e.id,
    media_id: e.id,
    title: e.title,
    preview_fingerprint: e.preview_fingerprint,
    preview: {
      subject_uri: e.subject6wuri,
      preview_fingerprint: e.preview_fingerprint,
      width: e.width,
      height: e.height,
      processing_version: e.processing_version,
      status: e.status
    },
    width: e.width,
    height: e.height,
    processing_version: e.processing_version,
    status: e.status,
    preview_media_processing_status: e.preview_media_processing_status || e.status,
    type: e.media_type,
    model: T.Media,
    subject_uri: e.subject6wuri,
    author: e.author,
    stats_viewed: e.stats_viewed,
    community_title: (s = e == null ? void 0 : e._community) == null ? void 0 : s.title,
    community_id: (r = e == null ? void 0 : e._community) == null ? void 0 : r.id,
    community_subject_uri: [...e.subject6wuri.split(":").splice(0, 3), "community", (i = e == null ? void 0 : e._community) == null ? void 0 : i.id].join(":"),
    community_type: (o = e == null ? void 0 : e._community) == null ? void 0 : o.community_type,
    created_at: ge(e.crdate),
    updated_at: ge(e.update),
    download_authorization: e.download_original_file === "1",
    download_original_file_url: (a = e.play) == null ? void 0 : a.download_original_url.transient_url_as_attachment,
    transient_original_file_url: (l = e.play) == null ? void 0 : l.download_original_url.transient_url,
    delete_authorization: (d = e == null ? void 0 : e._acl) == null ? void 0 : d.delete.access,
    forward_authorization: (u = e == null ? void 0 : e._acl) == null ? void 0 : u.forward.access,
    edit_authorization: (c = e == null ? void 0 : e._acl) == null ? void 0 : c.update.access,
    media_file_ext: e == null ? void 0 : e.media_file_ext,
    stream: ((h = e.play) == null ? void 0 : h.av_streams) || ((v = e.play) == null ? void 0 : v["3d_streams"]) || ((y = e.play) == null ? void 0 : y["2d_streams"]) || ((p = e.play) == null ? void 0 : p.doc_streams),
    view_stream: (g = e.play) == null ? void 0 : g.view,
    play: e.play,
    subtitles: (S = e.play) == null ? void 0 : S.subtitles,
    chapters: (E = e.play) == null ? void 0 : E.chapters,
    original_name: e == null ? void 0 : e.orig_name,
    canBeDisplayedODE: !1,
    ratio: e == null ? void 0 : e.ratio,
    size: e == null ? void 0 : e.size,
    related_posts: e == null ? void 0 : e.related_posts,
    wake_up_url: (N = e == null ? void 0 : e.play) == null ? void 0 : N.wake_up_url,
    is_illustration: e == null ? void 0 : e.is_illustration,
    _acl: e == null ? void 0 : e._acl,
    reprocessable: e == null ? void 0 : e.reprocessable,
    published: e.published === "1",
    oldParsing: e,
    // Need it for Story/Sketch/Whiteboard
    description: e == null ? void 0 : e.description,
    enhanced_summary: e == null ? void 0 : e.enhanced_summary,
    thumbnail_time: e != null && e.thumbnail_time ? timeToMilliseconds(e.thumbnail_time) : void 0,
    /* For preview in 3DPlay */
    preview_thumbnails: ((Y = e == null ? void 0 : e.preview) == null ? void 0 : Y.thumbnails) || []
  };
  if (n.community_type === "externaldm" && (n.community_type = "dm"), e.media_file_ext || (n.media_file_ext = (H = e.play) == null ? void 0 : H.original_file_extension), !n.media_file_ext && e.orig_name) {
    const O = e.orig_name && e.orig_name.split(".").pop();
    n.media_file_ext = O;
  }
  return ["docx", "doc", "ppt", "pptx", "xls", "xlsx"].includes(n.media_file_ext) && (n.canBeDisplayedODE = !0), !((I = e.play) != null && I.download_original_url.transient_url) && n.stream && n.stream.forEach((O) => {
    O.transient_url && (n.transient_original_file_url = O.transient_url);
  }), n;
}
const dr = 432e5;
async function Nu(e) {
  const t = new FormData();
  t.append("is_illustration", e.is_illustration ? "true" : "false"), t.append("community_id", e.subject_uri), t.append("title", e.title), t.append(
    "userFile",
    e.file,
    e.title
  ), e.base64 && t.append("base64_encoded", "1"), t.append("published", e.published ? "1" : "0"), e.description && t.append("description", e.description);
  const n = await pt("DS/WAFData/WAFData"), s = await new Promise((r, i) => {
    var a;
    const o = n.authenticatedRequest(`${ke()}/api/media/addmedia`, {
      responseType: "json",
      headers: { "x-ds-swym-csrftoken": Vt.get(M.SWYM) },
      type: "json",
      method: "POST",
      data: t,
      timeout: dr,
      onUploadProgress: (l) => {
        const d = Math.round(l.loaded * 100 / l.total);
        e.onProgress && typeof e.onProgress == "function" && e.onProgress(d);
      },
      onComplete: (l) => {
        var d;
        (d = e.abortSignal) == null || d.removeEventListener("abort", o.cancel), r(l);
      },
      onFailure(l, d) {
        var c;
        const u = new Error(l);
        u.response = d, (c = e.abortSignal) == null || c.removeEventListener("abort", o.cancel), i(u);
      },
      onCancel() {
        var l, d;
        (l = e.abortSignal) == null || l.removeEventListener("abort", o.cancel), i((d = e.abortSignal) == null ? void 0 : d.reason);
      }
    });
    (a = e.abortSignal) == null || a.addEventListener("abort", o.cancel);
  });
  return await ur(s);
}
async function Mu(e) {
  return Nu(e);
}
async function Lu(e) {
  const t = new FormData();
  e.title && t.append("title", e.title), e.description && t.append("description", e.description || ""), e.published !== void 0 && t.append("published", e.published ? "1" : "0"), e.userFile && t.append(
    "userFile",
    e.userFile,
    e.userFile.name
  ), e.authorizeDownload !== void 0 && t.append("download_original_file", e.authorizeDownload ? "1" : "0"), e.thumbnail_time_ms !== void 0 && t.append("thumbnail_time_ms", e.thumbnail_time_ms.toString()), t.append("is_illustration", e.is_illustration ? "true" : "false"), t.append("community_id", e.subject_uri), t.append("id_media", e.id_media);
  const [n] = await ft(["DS/WAFData/WAFData"]), s = await new Promise((r, i) => {
    n.authenticatedRequest(`${ke()}/api/media/editmedia`, {
      responseType: "json",
      headers: { "x-ds-swym-csrftoken": Vt.get(M.SWYM) },
      type: "json",
      method: "POST",
      data: t,
      timeout: dr,
      onComplete: r,
      onFailure(o, a) {
        const l = new Error(o);
        l.response = a, i(l);
      }
    });
  });
  return ur(s);
}
function Uu(e) {
  return e.split(":").pop();
}
const $t = {
  Media: {
    Swym: {
      Content: "/api/media/listallmedia",
      ContentV2: (e) => `/api/v2/communities/${Uu(e)}/media`,
      Duplicate: "/api/media/duplicate"
    },
    Exalead: {
      Content: "/api/exalead/search"
    }
  },
  Post: {
    Exalead: {
      Count: "/api/exalead/searchstats",
      Content: "/api/exalead/whatsnew"
    },
    Swym: {
      Content: "/api/feed/whatsnew",
      ContentV2: (e) => `/api/v2/communities/${e}/posts`
    }
  },
  Conference: {
    Swym: {
      Content: "/api/feed/whatsnew"
    },
    Exalead: {
      Content: "/api/exalead/whatsnew"
    }
  },
  Survey: {
    Swym: {
      Content: "/api/feed/whatsnew"
    },
    Exalead: {
      Content: "/api/exalead/whatsnew"
    }
  },
  Question: {
    Exalead: {
      Count: "/api/exalead/searchstats",
      Content: "/api/exalead/whatsnew"
    },
    Swym: {
      Content: "/api/feed/whatsnew"
    }
  },
  Wiki: {
    Swym: {
      Content: "/api/feed/whatsnew"
    },
    Exalead: {
      Content: "/api/exalead/whatsnew"
    }
  },
  Wedo: {
    Exalead: {
      Count: "/api/exalead/searchstats",
      Content: "/api/exalead/whatsnew"
    },
    Swym: {
      Content: "/api/feed/whatsnew"
    }
  },
  Idea: {
    Exalead: {
      Count: "/api/exalead/searchstats",
      Content: "/api/exalead/whatsnew"
    },
    Swym: {
      Content: "/api/feed/whatsnew",
      ContentV2: (e) => `/api/v2/communities/${e}/ideas`,
      Statuses: (e) => `/api/v2/communities/${e}/ideas/statuses`
    }
  },
  Draft: {
    Exalead: {
      Count: "/api/exalead/searchstats",
      Content: "/api/exalead/search"
    },
    Swym: {
      Content: "/api/v2/user/contributions"
    }
  },
  MeActivity: {
    Exalead: {
      Count: "/api/exalead/searchstats",
      Content: "/api/exalead/search"
    },
    Swym: {
      Content: "/api/v2/user/activity"
    }
  },
  Contribution: {
    Exalead: {
      Count: "/api/exalead/searchstats",
      Content: "/api/exalead/search"
    },
    Swym: {
      Content: "/api/v2/user/contributions"
    }
  },
  Network: {
    Swym: {
      Content: "/api/network/getnetworkactivity"
    }
  },
  ContentReader: {
    Exalead: {
      Count: "/api/exalead/searchstats",
      Content: "/api/exalead/search"
    }
  },
  Rituals: {
    Exalead: {
      Content: "/api/exalead/whatsnew"
    }
  }
};
function Fu() {
  return te.post("/api/personalspace", {
    body: ""
  }).json().then(wn);
}
function cn(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ju() {
  const e = [
    T.Post,
    // IContentModel.DerivedPost,
    T.Media,
    T.Idea,
    // IContentModel.DerivedIdea,
    T.Question
  ], t = {
    [T.Post]: $t.Post.Swym.Content,
    [T.Question]: $t.Question.Swym.Content,
    [T.Media]: $t.Media.Swym.Content,
    [T.Idea]: $t.Idea.Swym.Content
    // [IContentModel.DerivedIdea]: API.Idea.Swym.ContentV2,
    // [IContentModel.DerivedPost]: API.Post.Swym.ContentV2,
  }, n = [T.DerivedPost, T.DerivedIdea];
  return e.reduce((r, i) => (r[i] = Bu({
    contentType: i,
    api: t[i],
    openApi: n.includes(i)
  }), r), {});
}
function Bu({ contentType: e, api: t, openApi: n }) {
  return {
    async count(s) {
      return {
        total: (await te.post(cn(t, s.community_id), {
          json: {
            params: {
              ...e ? { content_type: [e] } : {},
              ...s
            }
          }
        }).json()).nmatch,
        data: []
      };
    },
    async getAll(s) {
      if (n) {
        const i = await te.get(cn(t, s.community_id), {
          searchParams: {
            ...s.derivedTypeId ? { derived_type_id: s.derivedTypeId } : {},
            page: s.page.toString(),
            limit: s.limit.toString()
          }
        }).json();
        return {
          total: Number.parseInt(i.nb_result || "0") || 0,
          data: Zn(i).result
        };
      }
      const r = await te.post(cn(t, s.community_id), {
        json: {
          params: {
            ...e ? { content_type: e } : {},
            ...s
          }
        }
      }).json();
      return {
        total: Number.parseInt(r.nb_result || "0") || 0,
        data: Zn(r).result
      };
    }
  };
}
ju();
function qu(e) {
  const t = e.indexOf("@");
  return e.indexOf(" ") === -1 && /^[^a-z]*$/.test(e) ? t > -1 ? e : `@${e}` : `@${e.substring(t + 1).split(" ").filter((r) => r).map((r) => r[0]).map((r) => r.toUpperCase()).join("")}`;
}
var Pn = /* @__PURE__ */ ((e) => (e.WIDGET = "widget", e.EXTERNAL = "external", e.INTERNAL = "internal", e.YOUTUBE = "youtube", e))(Pn || {}), Vu = /* @__PURE__ */ ((e) => (e.THUMBNAIL = "thumbnail", e.TILE = "tile", e.TITLE = "title", e.LINK = "link", e))(Vu || {});
function Wu(e) {
  const t = document.createElement("div");
  return t.innerHTML = e, t;
}
function Lt(e, t) {
  for (; e.childNodes.length > 0; )
    t.appendChild(e.childNodes[0]);
}
function Hu(e) {
  var n;
  let t;
  return e.tagName === "IMG" ? t = e.getAttribute("data-media-id") : t = (n = e.querySelector("img")) == null ? void 0 : n.getAttribute("data-media-id"), t && t !== "undefined" ? t : "";
}
function zu(e) {
  return e.classList.contains("image_resized") ? "small" : "large";
}
function Gu(e) {
  return e.classList.contains("image-style-align-center") ? "center" : e.classList.contains("image-style-align-left") ? "left" : e.classList.contains("image-style-align-right") ? "right" : e.tagName === "IMG" ? "inline" : "center";
}
function Yu(e, t) {
  const n = document.createElement("div");
  n.className = "responsive-table";
  const s = e.getElementsByTagName("table")[0];
  t.width ? s.style.width = t.width : s.style.width || (s.style.width = "100%");
  const r = e.querySelector(":scope > figcaption");
  if (r) {
    const i = document.createElement("caption");
    i.innerHTML = r.innerHTML, r.remove(), s.prepend(i);
  }
  return s.setAttribute("align", e.style.float || "center"), Lt(e, n), n;
}
function Qu(e, t, n, s) {
  var l;
  const r = document.createElement("figure"), i = document.createElement("a"), o = document.createElement("img");
  o.setAttribute("src", ""), t && o.setAttribute("data-media-id", t), !t && e.getAttribute("src") && o.setAttribute("src", e.getAttribute("src"));
  const a = (l = e.querySelector(":scope > a")) == null ? void 0 : l.getAttribute("href");
  if (a && i.setAttribute("href", a), (e.getAttribute("data-content-thumbnail") || e.querySelector("img[data-content-thumbnail]")) && o.setAttribute("data-content-thumbnail", "true"), e.querySelector("figcaption"))
    return r.setAttribute("data-position", s), r.setAttribute("data-size", n), a ? (i.appendChild(o), r.appendChild(i)) : r.appendChild(o), r.appendChild(e.querySelector("figcaption")), r;
  {
    o.setAttribute("data-position", s), o.setAttribute("data-size", n);
    let d = o;
    return a && (i.append(o), d = i), d;
  }
}
function Xu(e) {
  const t = document.createElement("span");
  return t.className = `marker ${e.className}`, Lt(e, t), t;
}
function Ju(e) {
  const t = document.createElement("pre"), n = e.querySelector("code");
  return Lt(n || e, t), t;
}
function Ku(e) {
  const t = document.createElement("a");
  t.classList.add("sum-tag-link", "sm-link"), t.setAttribute("data-login", e.dataset.login), t.setAttribute("data-content-type", e.dataset.contentType), t.setAttribute("data-type", e.dataset.type);
  const n = e.dataset.fullName, s = e.dataset.originalText;
  return t.innerHTML = qu(n || s || e.innerHTML), t;
}
function Zu(e) {
  const t = document.createElement("a");
  return t.classList.add("sum-tag-link", "sm-link"), t.setAttribute("data-users-group-uri", e.dataset.usersGroupUri), t.setAttribute("data-content-type", e.dataset.contentType), t.setAttribute("data-type", e.dataset.type), t.innerHTML = e.innerHTML, t;
}
function ed(e) {
  const t = document.createElement("a");
  return t.classList.add("s6m-tag-link", "sm-link"), t.setAttribute("data-predicate", e.dataset.predicate), t.setAttribute("data-tag-value", e.dataset.tagValue), t.setAttribute("data-type", e.dataset.type), t.setAttribute("contenteditable", "false"), t.innerHTML = e.innerHTML, t;
}
function td(e) {
  const t = e.style;
  return e.replaceWith(Yu(e, t));
}
function cs(e) {
  const t = zu(e), n = Gu(e), s = Hu(e);
  return e.replaceWith(Qu(
    e,
    s.split(":").pop(),
    t,
    n
  ));
}
function nd(e) {
  e.replaceWith(Xu(e));
}
function sd(e) {
  e.replaceWith(Ju(e));
}
function rd(e) {
  e.replaceWith(Ku(e));
}
function id(e) {
  e.replaceWith(Zu(e));
}
function od(e) {
  e.replaceWith(ed(e));
}
function ad(e) {
  try {
    const t = e.getAttribute("data-metas"), n = t ? JSON.parse(t) : void 0, s = e.getAttribute("data-url"), r = e.getAttribute("data-prefs"), o = e.className.includes("title-preview"), a = e.querySelector(".external-preview-link-image"), l = a && a.src || (n == null ? void 0 : n.image) || "", d = e.querySelector(o ? ".external-preview-link-text" : ".external-preview-link-heading"), u = d && d.textContent || "", c = e.querySelector(".external-preview-link-description"), h = c && c.textContent || (n == null ? void 0 : n.description) || "", v = l.includes("thumb-link"), y = e.querySelector(".external-preview-link-content");
    y == null || y.remove();
    const p = document.createElement("a");
    return p.classList.add("preview-link"), o && p.classList.add("title-preview"), p.href = s, p.setAttribute("data-title", u), p.setAttribute("data-desc", h), p.setAttribute("data-img", v ? "" : l), p.setAttribute("data-prefs", r), p.innerHTML = "&nbsp;", e.replaceWith(p);
  } catch {
    F.error("Incorrect metadata");
  }
}
function ld(e) {
  const t = e.getAttribute("data-url") || "#", n = document.createElement("a");
  return n.classList.add("preview-link"), n.href = t, n.innerHTML = "&nbsp;", e.replaceWith(n);
}
function cd(e) {
  const t = e.querySelector(".preference-container") || e, n = t == null ? void 0 : t.getAttribute("data-prefs"), s = t == null ? void 0 : t.getAttribute("data-source");
  if ((t == null ? void 0 : t.getAttribute("data-type")) === Pn.WIDGET) {
    const i = document.createElement("a");
    return i.classList.add("preview-link"), i.setAttribute("data-prefs", n), i.setAttribute("data-source", s), i.setAttribute("data-type", Pn.WIDGET), e.replaceWith(i);
  }
}
function ud(e) {
  e.tagName === "FIGURE" && e.className === "table" && td(e), e.tagName === "FIGURE" && e.className !== "table" && cs(e), e.tagName === "IMG" && cs(e), e.tagName === "MARK" && nd(e), e.tagName === "PRE" && sd(e), e.tagName === "SPAN" && e.hasAttribute(
    "data-login"
    /* DatasetProp */
  ) && rd(e), e.tagName === "SPAN" && e.hasAttribute(
    "data-users-group-uri"
    /* DatasetProp */
  ) && id(e), e.tagName === "SPAN" && e.hasAttribute(
    "data-predicate"
    /* DatasetProp */
  ) && od(e), e.tagName === "DIV" && e.className.includes(
    "external-preview-link"
    /* ClassName */
  ) && ad(e), e.tagName === "IFRAME" && e.className.includes(
    "youtube-preview-link"
    /* ClassName */
  ) && ld(e), e.tagName === "DIV" && e.className.includes(
    "widget-preview-container"
    /* ClassName */
  ) && cd(e);
}
function dd(e) {
  const t = Wu(e);
  return t.querySelectorAll(`
    pre, 
    figure, 
    img, 
    mark, 
    div.external-preview-link, 
    div.internal-preview-link, 
    iframe.youtube-preview-link,
    div.widget-preview-container,
    span[data-login],
    span[data-users-group-uri],
    span.s6m-tag-link.sm-link[data-predicate],
    a[data-type]
  `).forEach(ud), t;
}
function fd(e) {
  return dd(e).innerHTML;
}
function pd(e) {
  return { reversedHtml: A(() => fd(e.value)) };
}
const hd = 255, md = "Cancel share";
var En = /* @__PURE__ */ ((e) => (e.JSNOTIF_NOTIF_TYPE = "jsnotif", e.JSEVENT_NOTIF_TYPE = "jsevent", e.DSCEF = "dscef", e))(En || {}), $n = /* @__PURE__ */ ((e) => (e.PLATFORM_CHANGE_AUTOMATIC = "automatic", e.PLATFORM_CHANGE_MANUAL = "manual", e))($n || {});
const yd = {
  key: 0,
  class: "pfc_pfc-main"
}, vd = { class: "py-2" }, wd = { key: 4 }, _d = { key: 0 }, gd = { class: "description-container" }, bd = { class: "heading text-black" }, Sd = {
  key: 1,
  class: "flex gap-1 items-baseline"
}, Ad = { class: "text-grey-6 mt-1" }, Cd = { class: "base64-image-container" }, Td = ["src"], Pd = { class: "publish-form-footer" }, Ed = /* @__PURE__ */ ee({
  __name: "publish-form",
  props: {
    mode: { default: "automatic" },
    notifType: {},
    platformId: {},
    platformChange: {},
    forcePlatform: { type: Boolean, default: !1 },
    platforms: {},
    title: {},
    description: {},
    contentTitle: {},
    contentDescription: {},
    availableContentTypes: {},
    hideThreadDataSelectors: { type: Boolean, default: !1 },
    allowDraft: { type: Boolean, default: !0 },
    threadType: { default: "community" },
    threadId: {},
    base64image: {},
    base64imageExtension: { default: "jpg" },
    forceThreadId: { type: Boolean },
    onCancel: {},
    onContentCreated: {}
  },
  emits: ["cancelShare", "startUpload", "contentCreatedSuccess", "tenantChangeFailure", "platformChange", "update:notifType-value"],
  setup(e, { expose: t, emit: n }) {
    const s = e, r = n, i = b({ label: "", value: "" }), o = b(L.Community), a = A(() => i.value.value), l = b(T.Post), d = b(null), u = b(s.title || ""), c = b(s.contentTitle || ""), h = b(s.contentDescription || ""), v = b(s.description || ""), y = b(s.platformId || ""), p = b(!1), g = b(!1), S = b(!0), E = b(), N = b(s.platformChange), Y = b(ke()), H = b(!1), I = b(s.mode), O = b(!1), z = b(""), X = b(s.base64image), Te = b(), Se = b("true"), { $i18n: P } = Oe("publish-form");
    let se = "";
    Nr(async () => {
      if (s.platformId) {
        pn(s.platformId);
        const w = await he(M.SWYM, s.platformId);
        gn(w);
      } else if (window.widget) {
        const w = await hn(M.SWYM);
        pn(w[0].platformId);
        const C = await he(M.SWYM, w[0].platformId);
        gn(C);
      }
    });
    const Ae = it(), mt = it();
    Ie(async () => {
      var w;
      window.setTopView = function(C) {
        Ae.value = tn(async () => ({
          template: `<div>${C}</div>`
        }));
      }, window.setBottomView = function(C) {
        mt.value = tn(async () => ({
          template: `<div>${C}</div>`
        }));
      }, g.value = !0, Tu(), y.value = Q(), z.value = (w = (await Yt()).result) == null ? void 0 : w.login, await wr(), g.value = !1;
    });
    const j = tn(() => import("./ckeditor-wrapper-jRGigJpY.js"));
    function Qt(w) {
      c.value = w;
    }
    function fr(w) {
      h.value = w;
    }
    function pr(w) {
      X.value = w;
    }
    function hr(w) {
      u.value = w;
    }
    function mr(w) {
      v.value = w;
    }
    function yr(w) {
      return w === "titleInput" ? c.value : h.value;
    }
    function vr(w) {
      const C = document.querySelector(".pfc_pfc-main");
      return C == null ? void 0 : C.querySelector(w);
    }
    t({
      setContentTitle: Qt,
      setContentDescription: fr,
      setBase64image: pr,
      setImageTitle: hr,
      setMediadescription: mr,
      getValue: yr,
      getElement: vr
    });
    async function wr() {
      if (s.forcePlatform && s.platformId === void 0)
        throw new Error("If the platform list option is set to true, a platformId option must be provided.");
      if (s.hideThreadDataSelectors && s.threadType && !s.threadId)
        throw new Error(
          "If hideThreadDataSelectors is set to true, a threadType and a threadId option must be provided"
        );
      if (s.mode === "base64" && (I.value = "automatic", console.warn("PublishFormView: base64 mode is deprecated, please don't define it or use 'automatic' instead")), s.notifType ? E.value = s.notifType : s.mode === "catia" ? E.value = En.DSCEF : E.value = En.JSEVENT_NOTIF_TYPE, r("update:notifType-value", E.value), s.mode === "catia" ? N.value = $n.PLATFORM_CHANGE_MANUAL : N.value = $n.PLATFORM_CHANGE_AUTOMATIC, X.value && !s.title)
        throw new Error("PublishFormView: title must be defined if base64image is set");
      if (s.hideThreadDataSelectors && !s.threadType && !s.threadId)
        throw new Error("If HideThreadDataSelector is true, Threadtype and ThreadId must be provided.");
      if (s.platforms && s.platforms.forEach((w) => {
        if (!w.value || !w.label)
          throw new Error("Each platform must contain the properties value and label");
      }), s.threadId)
        try {
          const w = await ks(s.threadId);
          w && (i.value.value = w.result.subject_uri, i.value.label = w.result.title);
        } catch {
          const w = await Ns(z.value, y.value, s.threadId);
          if (w)
            i.value.value = w.subject_uri, i.value.label = Eu(w, z.value), i.value.conversation = w;
          else
            throw new Error("thread id not found");
        }
      s.availableContentTypes && (typeof s.availableContentTypes == "string" ? Te.value = s.availableContentTypes.split(",") : Te.value = s.availableContentTypes, l.value = Te.value.at(0)), s.threadType === "community" ? o.value = L.Community : s.threadType === "dm" ? o.value = L.Conversation : o.value = L.PersonalSpace;
    }
    async function _r(w) {
      i.value.value = "", y.value = w, Y.value = ke(), r("platformChange", JSON.stringify({
        platform_instance: Y.value
      }));
    }
    function gr(w) {
      r("tenantChangeFailure", w);
    }
    function yt() {
      c.value = "", h.value = "";
    }
    function br(w) {
      i.value.value = "", yt(), w === L.PersonalSpace && Cr(), Re(!0);
    }
    function Re(w) {
      S.value = w;
    }
    function Sr(w) {
      w.value || yt(), i.value = w, a.value ? Re(!i.value) : Re(!!i.value);
    }
    async function Ar(w) {
      w.value || yt(), i.value = w, a.value ? Re(!i.value) : Re(!!i.value), p.value = !!(w.value && !w.conversation);
    }
    async function Cr() {
      try {
        const w = await Fu();
        i.value.value = w.result.subject_uri, i.value.label = w.result.title, Re(!1);
      } catch (w) {
        F.error(w), Ve.create({
          text: P("personalSpaceError"),
          color: "error"
        });
      }
    }
    const { reversedHtml: Xt } = pd(h);
    function Tr(w) {
      l.value = w;
    }
    function Pr(w) {
      Re(w);
    }
    async function Er(w, C) {
      const J = {
        base64Image: w,
        title: s.title,
        extension: s.base64imageExtension
      }, qe = $u(J);
      u.value = qe.fileName || "";
      const Jt = await Mu({
        subject_uri: i.value.value,
        file: qe.mediaFile,
        title: u.value,
        is_illustration: !0,
        published: !C,
        base64: !0,
        description: v.value
      }), { id: _t, width: Kt, height: Xe, processing_version: Zt, status: en, preview_fingerprint: Je } = Jt.result, { url: re } = Ru(
        _t,
        Kt,
        Xe,
        Zt,
        en,
        Y.value,
        Je,
        cr.L1
      );
      return { srcUrl: re.value, mediaId: _t };
    }
    function Hn(w) {
      var C, J;
      if (H.value = w.isSaveDraft, se = Xt.value, (J = (C = d.value) == null ? void 0 : C.validate) != null && J.call(C))
        $r(w.isSaveDraft);
      else
        return Ve.create({
          text: P("TitleIsEmpty"),
          color: "error",
          timeout: os
        });
    }
    async function $r(w) {
      if (O.value = !0, p.value && z.value) {
        const C = [a.value, z.value];
        try {
          const J = await aa(C, y.value);
          i.value.value = J.subject_uri;
        } catch (J) {
          return F.log(J), Ve.create({
            text: P("CreateConversationFailed"),
            color: "error",
            timeout: os
          });
        }
      }
      if (I.value !== "automatic")
        r("startUpload", JSON.stringify({
          platform_instance: Y.value,
          platformId: y.value.toLowerCase(),
          // added 24x GA
          community_id: i.value.value,
          isDraft: w,
          // new 21x FD07
          platformUrl: Y.value,
          // new 21x FD07
          threadId: i.value.value,
          // new 21x FD07
          threadTitle: i.value.label,
          // new 23x FD04
          threadType: s.threadType,
          // new 23x FD04
          contentType: l.value
          // new 21x FD07
        }));
      else if (X.value && s.base64imageExtension && I.value === "automatic") {
        const { srcUrl: C, mediaId: J } = await Er(X.value, w);
        se += `<p><img data-media-id="${J}" src="${C}"}></p>`, l.value === T.Media ? await wt(J) : await wt();
      } else
        await wt();
    }
    function vt(w) {
      return o.value === L.PersonalSpace ? P("PersonalSpace") : o.value === L.Conversation ? i.value.label : w;
    }
    async function wt(w) {
      try {
        let C, J;
        switch (o.value) {
          case L.Conversation:
            J = "dm";
            break;
          case L.PersonalSpace:
            J = "personalspace";
            break;
          default:
            J = "community";
        }
        if (w && l.value === T.Media)
          se = Xt.value, C = await Lu({
            id_media: w || "",
            title: c.value,
            is_illustration: !Se.value,
            published: !H.value,
            subject_uri: i.value.value,
            description: se
          });
        else {
          const qe = {
            message: se,
            title: c.value,
            published: !H.value
          };
          C = await Uo({
            model: l.value,
            communitySubjectUri: i.value.value,
            data: qe
          });
        }
        I.value !== "automatic" ? r("contentCreatedSuccess", JSON.stringify({
          success: !0,
          containerId: C.result.community_id,
          containerType: J,
          contentSubjectURI: C.result.community_subject_uri,
          contentId: C.result.id,
          contentUrl: Pu(C, o.value, l.value)
        })) : s.onContentCreated ? (Ve.create({
          text: H.value ? P("Adraftofyourcontentwascreated", {
            communityTitle: vt(C.result.community_title)
          }) : P("Yourcontenthasbeenpublishedin", {
            communityTitle: vt(C.result.community_title)
          }),
          color: "success",
          timeout: Tn
        }), s.onContentCreated()) : Ve.create({
          text: H.value ? P("Adraftofyourcontentwascreated", {
            communityTitle: vt(C.result.community_title)
          }) : P("Yourcontenthasbeenpublishedin", {
            communityTitle: vt(C.result.community_title)
          }),
          color: "success",
          timeout: Tn
        });
      } catch {
        I.value !== "automatic" ? r("contentCreatedSuccess", JSON.stringify({
          success: !1,
          message: P("Errorcannotsaveyourcontent")
        })) : Ve.create({ text: P("Errorcannotsaveyourcontent"), color: "error" });
      }
      O.value = !1;
    }
    window.createContent = async function(w) {
      se = Xt.value, se = `${se}<p><img data-source="swym" data-media-id="${w}" width="320"></p>`, await wt(w);
    }, window.resetForm = yt;
    function xr() {
      var w;
      (w = s.onCancel) == null || w.call(s), r("cancelShare", md);
    }
    return (w, C) => {
      const J = ne("vu-input"), qe = ne("vu-checkbox"), Jt = ne("vu-icon"), _t = ne("vu-form"), Kt = ne("vu-scroller"), Xe = ne("vu-btn"), Zt = ne("vu-message-container"), en = xe("tooltip"), Je = xe("mask");
      return m(), _(le, null, [
        f(g) ? k("", !0) : ae((m(), _("div", yd, [
          B(w.$slots, "topView", {}, () => [
            x(f(Ae))
          ], !0),
          x(Kt, { class: "px-3" }, {
            default: D(() => [
              w.forcePlatform ? k("", !0) : (m(), W(Su, {
                key: 0,
                "platform-id": f(y),
                platforms: w.platforms,
                onOnTenantChangeFailure: gr,
                "onUpdate:selectedPlatformId": _r
              }, null, 8, ["platform-id", "platforms"])),
              $("h5", vd, U(f(P)("Destination")), 1),
              !f(i).value || f(o) === f(L).PersonalSpace ? (m(), W(Au, {
                key: 1,
                modelValue: f(o),
                "onUpdate:modelValue": [
                  C[0] || (C[0] = (re) => fe(o) ? o.value = re : null),
                  C[1] || (C[1] = (re) => br(re))
                ]
              }, null, 8, ["modelValue"])) : k("", !0),
              f(o) === f(L).Community ? (m(), W(yc, {
                key: 2,
                "hide-thread-selector": w.hideThreadDataSelectors,
                "selected-community": f(i),
                "selected-tenant-id": f(y),
                "onUpdate:selectedCommunity": Sr
              }, null, 8, ["hide-thread-selector", "selected-community", "selected-tenant-id"])) : k("", !0),
              f(o) === f(L).Conversation ? (m(), W(_u, {
                key: 3,
                "hide-thread-selector": w.hideThreadDataSelectors,
                "platform-id": f(y),
                "selected-conversation": f(i),
                "onUpdate:selectedConversation": Ar
              }, null, 8, ["hide-thread-selector", "platform-id", "selected-conversation"])) : k("", !0),
              f(a) || f(o) === f(L).PersonalSpace ? (m(), _("div", wd, [
                x(xc, {
                  "content-type": f(l),
                  "onUpdate:contentType": [
                    C[2] || (C[2] = (re) => fe(l) ? l.value = re : null),
                    Tr
                  ],
                  "available-content-types": f(Te),
                  "create-convo-flag": f(p),
                  "current-user": f(z),
                  "is-conversation-selected": f(o) === f(L).Conversation,
                  "is-personal-space": f(o) === f(L).PersonalSpace,
                  "platform-id": f(y),
                  "thread-id": f(a),
                  onNoType: Pr
                }, null, 8, ["content-type", "available-content-types", "create-convo-flag", "current-user", "is-conversation-selected", "is-personal-space", "platform-id", "thread-id"])
              ])) : k("", !0),
              !f(S) && (f(a) || f(o) === f(L).PersonalSpace) ? (m(), W(_t, {
                key: 5,
                ref_key: "creationForm",
                ref: d,
                onKeyup: C[6] || (C[6] = Mr(Me(() => {
                }, ["stop"]), ["enter"]))
              }, {
                default: D(() => [
                  f(a) || f(o) === f(L).PersonalSpace ? (m(), _("div", _d, [
                    x(J, {
                      modelValue: f(c),
                      "onUpdate:modelValue": C[3] || (C[3] = (re) => fe(c) ? c.value = re : null),
                      label: f(P)("Title"),
                      maxlength: f(hd),
                      required: ""
                    }, null, 8, ["modelValue", "label", "maxlength"]),
                    $("div", gd, [
                      $("label", bd, U(f(P)("Description")), 1),
                      x(f(j), {
                        modelValue: f(h),
                        "onUpdate:modelValue": C[4] || (C[4] = (re) => fe(h) ? h.value = re : null),
                        "community-uri": f(a),
                        "max-line": 6,
                        "min-line": 4,
                        mode: "SIMPLE",
                        outlined: ""
                      }, null, 8, ["modelValue", "community-uri"])
                    ])
                  ])) : k("", !0),
                  f(o) === f(L).Community && f(l) === f(T).Media ? (m(), _("div", Sd, [
                    x(qe, {
                      modelValue: f(Se),
                      "onUpdate:modelValue": C[5] || (C[5] = (re) => fe(Se) ? Se.value = re : null),
                      options: [{ label: f(P)("DisplayOnFeed"), value: "true" }]
                    }, null, 8, ["modelValue", "options"]),
                    ae(x(Jt, {
                      class: "fonticon-clickable",
                      color: "",
                      icon: "help-circled"
                    }, null, 512), [
                      [
                        en,
                        f(P)("IfSelectedTheMediaWillBeDisplayedOnTheWhatsNew", { 0: "<b>", 1: "</b>" }),
                        void 0,
                        { top: !0 }
                      ]
                    ])
                  ])) : k("", !0),
                  $("p", Ad, U(f(P)("PublishNote")), 1)
                ]),
                _: 1
              }, 512)) : k("", !0),
              $("div", Cd, [
                w.base64image ? (m(), _("img", {
                  key: 0,
                  src: w.base64image,
                  width: "100%"
                }, null, 8, Td)) : k("", !0)
              ]),
              B(w.$slots, "footer", {}, () => [
                x(f(mt))
              ], !0)
            ]),
            _: 3
          }),
          $("div", Pd, [
            ae((m(), W(Xe, {
              class: "bg-blue-2 publish-btn",
              color: "primary",
              disabled: f(S),
              onClick: C[7] || (C[7] = () => Hn({ isSaveDraft: !1 }))
            }, {
              default: D(() => [
                Le(U(f(P)("Publish")), 1)
              ]),
              _: 1
            }, 8, ["disabled"])), [
              [Je, f(O) && !f(H)]
            ]),
            ae((m(), W(Xe, {
              class: "save-as-draft-btn",
              disabled: f(S),
              onClick: C[8] || (C[8] = () => Hn({ isSaveDraft: !0 }))
            }, {
              default: D(() => [
                Le(U(f(P)("SaveDraft")), 1)
              ]),
              _: 1
            }, 8, ["disabled"])), [
              [Je, f(O) && f(H)]
            ]),
            x(Xe, {
              onClick: C[9] || (C[9] = (re) => xr())
            }, {
              default: D(() => [
                Le(U(f(P)("Cancel")), 1)
              ]),
              _: 1
            })
          ])
        ])), [
          [Je, f(O)]
        ]),
        x(Zt, { class: "!z-[5000]" })
      ], 64);
    };
  }
}), Nd = /* @__PURE__ */ ue(Ed, [["__scopeId", "data-v-0bbb4dcb"]]);
export {
  Ze as $,
  el as A,
  Id as B,
  tl as C,
  Gt as D,
  Oe as E,
  te as F,
  yi as G,
  F as H,
  T as I,
  Os as J,
  su as K,
  Zn as L,
  $t as M,
  ke as N,
  vo as O,
  pe as P,
  yo as Q,
  rt as R,
  M as S,
  zi as T,
  Vu as U,
  Yt as V,
  Q as W,
  He as X,
  Ns as Y,
  Dd as Z,
  qu as _,
  Qs as a,
  ac as a0,
  Od as a1,
  tr as a2,
  Rd as a3,
  ue as a4,
  Nd as a5,
  Ue as b,
  Vt as c,
  mi as d,
  Ti as e,
  ce as f,
  be as g,
  hn as h,
  he as i,
  ps as j,
  Nn as k,
  Ai as l,
  Ci as m,
  Cs as n,
  hi as o,
  Pi as p,
  bi as q,
  bs as r,
  ft as s,
  pt as t,
  Ht as u,
  qt as v,
  Ts as w,
  Dn as x,
  Ri as y,
  lo as z
};
//# sourceMappingURL=publish-form-vue-D_6ZLo1R.js.map
