define("DS/SwymVuePublishForm/PublishFormVueUWAView", [
  // Vue
  // 'DS/SwymVuePublishForm/vue.amd',
  "DS/SwymVuePublishForm/vue.amd",
  // Vuekit
  // 'DS/vuekit3/VUEKIT.umd',
  "DS/SwymVuePublishForm/VUEKIT.amd",
  // UWA View
  "UWA/Class/View",
  // Publish Form
  "DS/SwymVuePublishForm/PublishFormVue.amd",
  "css!DS/SwymVuePublishForm/VUEKIT",
  "css!DS/UIKIT/UIKIT",
  "css!DS/SwymVuePublishForm/style"
], (i, a, r, p) => r.extend({
  tagName: "div",
  className: "publish-form-vue-uwa-view",
  /** @private */
  _app: void 0,
  /** @private */
  _appInstance: void 0,
  setup(e) {
    this._parent.call(this, e);
    const { events: t, ...s } = e;
    this._props = s;
  },
  /**
   * Render the view.
   */
  render() {
    const e = this, { createApp: t } = i, s = this._props, o = t(p, {
      ...s,
      ...e._getEmitsListeners(s)
    });
    o.use(a, { disableTooltipsOnDevices: !0, globalRegister: !0 }), e._app = o;
    const n = o.mount(e.container);
    return e._appInstance = n, e;
  },
  _getEmitsListeners(e) {
    const t = this, s = t.dispatchEvent.bind(t);
    return {
      onCancelShare(n) {
        s("CancelShare", n);
      },
      onContentCreatedSuccess(n) {
        s("ContentCreated", n);
      },
      onPlatformChange(n) {
        s("PlatformChange", n);
      },
      onStartUpload(n) {
        s("StartUpload", n);
      },
      onTenantChangeFailure(n) {
        s("TenantChangeFailure", n);
      }
    };
  },
  onRefresh() {
    var t, s;
    const e = this;
    (t = e._app) == null || t.unmount(), (s = e._app) == null || s.mount(e.container);
  },
  setContentTitle(e) {
    var t;
    if (e)
      (t = this._appInstance) == null || t.setContentTitle(e);
    else
      throw console.error("PublishFormView: No title param set"), new Error("PublishFormView: No title param set");
  },
  setContentDescription(e) {
    if (e)
      this._appInstance.setContentDescription(e);
    else
      throw console.error("PublishFormView: No description param set"), new Error("PublishFormView: No description param set");
  },
  setBase64image(e) {
    if (e)
      this._appInstance.setBase64image(e);
    else
      throw console.error("PublishFormView: No base64image param set"), new Error("PublishFormView: No base64image param set");
  },
  setImageTitle(e) {
    if (e)
      this._appInstance.setImageTitle(e);
    else
      throw console.error("PublishFormView: No title param set"), new Error("PublishFormView: No title param set");
    console.warn("PublishFormView: setImageTitle is deprecated, please use title param in the constructor");
  },
  setImageDescription(e) {
    e && this._appInstance.setImageDescription(e), console.warn("PublishFormView: setImageDescription is deprecated, please use description param in the constructor");
  },
  setCreateContent(e) {
    window.createContent && window.createContent(e);
  },
  createContent(e) {
    window.createContent && window.createContent(e);
  },
  setBottomView(e) {
    window.setBottomView && window.setBottomView(e);
  },
  setTopView(e) {
    window.setTopView && window.setTopView(e);
  },
  /**
   * Set the title of the view.
   * @param title - The title to set.
   */
  setTitle(e) {
    e && this._appInstance.setTitle(e);
  },
  /**
   * Destroy the view.
   */
  destroy(...e) {
    const t = this;
    t._app && t._app.unmount(), t._app = void 0, t._appInstance = void 0, t._parent(...e);
  }
}));
//# sourceMappingURL=PublishFormVueUWAView.es.js.map
