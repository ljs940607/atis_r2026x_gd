/// <amd-module name="DS/XSRUtilityCore/mask/XSRMask"/>
define("DS/XSRUtilityCore/mask/XSRMask", ["require", "exports", "DS/Controls/Loader", "DS/Controls/ModalContainer"], function (require, exports, WUXLoader, WUXModalContainer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XSRMask = void 0;
    var XSRMask = /** @class */ (function () {
        function XSRMask() {
        }
        XSRMask.mask = function (element, message) {
            if (message === void 0) { message = ''; }
            try {
                if (document.getElementsByClassName("wux-controls-modalContainer").length === 0) {
                    this.loader = new WUXLoader();
                    WUXModalContainer.createModal(element, this.loader.getContent());
                    this.loader.on(message || "Loading...");
                    this.loader.visibleFlag = true;
                }
                return this.loader;
            }
            catch (error) {
                console.warn('Failed to display loader', error);
            }
        };
        XSRMask.unmask = function (element, message) {
            var _a;
            if (message === void 0) { message = ''; }
            if ((_a = this === null || this === void 0 ? void 0 : this.loader) === null || _a === void 0 ? void 0 : _a.visibleFlag) {
                this.loader.off(message || "Loading...");
                WUXModalContainer.removeModal(element);
            }
        };
        return XSRMask;
    }());
    exports.XSRMask = XSRMask;
});

/// <amd-module name="DS/XSRUtilityCore/util/Constants"/>
define("DS/XSRUtilityCore/util/Constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sources = exports.Constants = void 0;
    var Constants;
    (function (Constants) {
        Constants["TYPE_VPMREFERENCE"] = "VPMReference";
        Constants["TYPE_RAW_MATERIAL"] = "Raw_Material";
        Constants["TYPE_DOCUMENTS"] = "Documents";
        Constants["TYPE_FORMULATED_PRODUCT"] = "Formulated_Product";
        Constants["TYPE_TECHNICALSPECIFICATION"] = "Technical Specification";
        Constants["TYPE_TESTMETHODSPECIFICATION"] = "Test Method Specification";
        Constants["TYPE_DRAWING"] = "Drawing";
        Constants["TYPE_PRODDUCTSPECTYPE"] = "ProductSpecificationType";
        Constants["TYPE_PERFORMANCESPEC"] = "PerformanceSpec";
        Constants["TYPE_PERFORMANCECHAR"] = "PerformanceChar";
    })(Constants || (exports.Constants = Constants = {}));
    var Sources;
    (function (Sources) {
        Sources["SPACE"] = "3DSpace";
        Sources["SEARCH"] = "3DSearch";
        Sources["COMPASS"] = "3DCompass";
        Sources["SOURCING"] = "sourcing";
    })(Sources || (exports.Sources = Sources = {}));
});

/// <amd-module name="DS/XSRUtilityCore/viewmanager/XSRViewGenerator"/>
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("DS/XSRUtilityCore/viewmanager/XSRViewGenerator", ["require", "exports", "UWA/Core"], function (require, exports, UWA) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XSRViewGenerator = void 0;
    var XSRViewGenerator = /** @class */ (function () {
        function XSRViewGenerator() {
        }
        XSRViewGenerator.render = function (node, parent) {
            var element;
            var idMap = {};
            switch (node.type) {
                case 'div':
                case 'span':
                case 'p':
                    element = UWA.createElement(node.type, node.options);
                    break;
                case 'button':
                    //element = new WUXButton(node.options);
                    break;
                case 'lineeditor':
                    //element = new LineEditor(node.options);
                    break;
            }
            if (node.key)
                idMap[node.key] = element;
            if (parent && element)
                element.inject(parent);
            if (node.children) {
                for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var childIdMap = XSRViewGenerator.render(child, element);
                    idMap = __assign(__assign({}, idMap), childIdMap);
                }
            }
            return idMap;
        };
        return XSRViewGenerator;
    }());
    exports.XSRViewGenerator = XSRViewGenerator;
});

/// <amd-module name="DS/XSRUtilityCore/util/WidgetDataHandler"/>
define("DS/XSRUtilityCore/util/WidgetDataHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WidgetDataHandler = exports.DataKeys = void 0;
    var DataKeys;
    (function (DataKeys) {
        DataKeys["CURRENT_SECURITYCTX"] = "Current_security_credentials";
    })(DataKeys || (exports.DataKeys = DataKeys = {}));
    ;
    var WidgetDataHandler = /** @class */ (function () {
        function WidgetDataHandler() {
        }
        WidgetDataHandler.set = function (key, value) {
            widget.setValue(key, value);
        };
        WidgetDataHandler.get = function (key) {
            return widget.getValue(key);
        };
        return WidgetDataHandler;
    }());
    exports.WidgetDataHandler = WidgetDataHandler;
});

/// <amd-module name="DS/XSRUtilityCore/service/CSRFTokenManager"/>
define("DS/XSRUtilityCore/service/CSRFTokenManager", ["require", "exports"], function (require, exports) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSRFTokenManager = void 0;
    var CSRFTokenManager = /** @class */ (function () {
        function CSRFTokenManager() {
        }
        CSRFTokenManager.get = function (source) {
            var _a, _b;
            return (_b = (_a = CSRFTokenManager._csrfToken) === null || _a === void 0 ? void 0 : _a[source]) !== null && _b !== void 0 ? _b : undefined;
        };
        CSRFTokenManager.set = function (src, token) {
            CSRFTokenManager._csrfToken[src] = token;
        };
        CSRFTokenManager._csrfToken = (_a = {},
            _a["3DSpace" /* Sources.SPACE */] = undefined,
            _a["3DSearch" /* Sources.SEARCH */] = undefined,
            _a["3DCompass" /* Sources.COMPASS */] = undefined,
            _a["sourcing" /* Sources.SOURCING */] = undefined,
            _a);
        return CSRFTokenManager;
    }());
    exports.CSRFTokenManager = CSRFTokenManager;
});

/// <amd-module name="DS/XSRUtilityCore/util/PromiseStateTracker"/>
define("DS/XSRUtilityCore/util/PromiseStateTracker", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackPromiseState = void 0;
    var TrackPromiseState = function (promise) {
        var state = "pending";
        var wrappedPromise = promise
            .then(function (res) {
            state = "fulfilled";
            return res;
        })
            .catch(function (err) {
            state = "rejected";
            throw err;
        });
        return {
            promise: wrappedPromise,
            getState: function () { return state; },
            isPending: function () { return state === "pending"; }
        };
    };
    exports.TrackPromiseState = TrackPromiseState;
});

/// <amd-module name="DS/XSRUtilityCore/events/XSREvents"/>
define("DS/XSRUtilityCore/events/XSREvents", ["require", "exports", "DS/CoreEvents/ModelEvents"], function (require, exports, ModelEvents) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XSREvents = void 0;
    var XSREvents = /** @class */ (function () {
        function XSREvents() {
            this.eventsToken = {};
            this.xsrEvents = new ModelEvents();
        }
        XSREvents.prototype.publish = function (eventdata) {
            this.xsrEvents.publish(eventdata);
        };
        XSREvents.prototype.subscribe = function (eventName, func) {
            var tokenNumber = this.xsrEvents.subscribe(eventName, func);
            //store token on the instance for further use
            this.eventsToken[eventName.event] = tokenNumber;
            return tokenNumber;
        };
        XSREvents.prototype.unsubscribeAll = function () {
            for (var _i = 0, _a = Object.keys(this.eventsToken); _i < _a.length; _i++) {
                var key = _a[_i];
                this.xsrEvents.unsubscribe(this.eventsToken[key]);
                delete this.eventsToken[key];
            }
        };
        XSREvents.prototype.unsubscribe = function (iEventToken) {
            this.xsrEvents.unsubscribe(iEventToken);
            for (var _i = 0, _a = Object.keys(this.eventsToken); _i < _a.length; _i++) {
                var iEvent = _a[_i];
                if (this.eventsToken[iEvent] === iEventToken) {
                    delete this.eventsToken[iEvent];
                }
            }
        };
        XSREvents.prototype.unsubscribeList = function (iTokenArr) {
            var _this = this;
            iTokenArr === null || iTokenArr === void 0 ? void 0 : iTokenArr.forEach(function (token) { return _this.unsubscribe(token); });
        };
        XSREvents.prototype.getEventByName = function (iName) {
            var _a, _b;
            return (_b = (_a = this.eventsToken) === null || _a === void 0 ? void 0 : _a[iName]) !== null && _b !== void 0 ? _b : "";
        };
        return XSREvents;
    }());
    exports.XSREvents = XSREvents;
});

/// <amd-module name="DS/XSRUtilityCore/platform/PlatformDataProvider"/>
define("DS/XSRUtilityCore/platform/PlatformDataProvider", ["require", "exports", "DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices"], function (require, exports, i3DXCompassPlatformServices) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlatformDataProvider = void 0;
    var PlatformDataProvider = /** @class */ (function () {
        function PlatformDataProvider() {
        }
        // to be called in securityCtxManager only on widget load - start
        PlatformDataProvider.getPlatformInfo = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                i3DXCompassPlatformServices.getPlatformServices({
                    onComplete: function (respServices) {
                        var services = respServices;
                        var platforms = services === null || services === void 0 ? void 0 : services.reduce(function (platformObj, p) {
                            platformObj[p.platformId] = p;
                            return platformObj;
                        }, {});
                        if (Object.keys(platforms).length <= 0)
                            return reject("cannot retrieve platform data");
                        that._platforms = platforms;
                        resolve(true);
                    },
                    onFailure: reject
                });
            });
        };
        // to be called in securityCtxManager only on widget load - end
        PlatformDataProvider.getServiceURL = function (serviceId, tenant) {
            var _a, _b, _c;
            tenant = tenant !== null && tenant !== void 0 ? tenant : this.getPlatformId(); // get tenant if argument is undefined
            var url = (_c = (_b = (_a = this._platforms) === null || _a === void 0 ? void 0 : _a[tenant]) === null || _b === void 0 ? void 0 : _b[serviceId]) !== null && _c !== void 0 ? _c : null;
            return new ServiceURL(url);
        };
        // to show in preferences
        PlatformDataProvider.getTenants = function () {
            var _this = this;
            var tList = [];
            Object.keys(this._platforms).forEach(function (tenantInfo) {
                tList.push({
                    displayName: _this._platforms[tenantInfo].platformId,
                    name: _this._platforms[tenantInfo].displayName
                });
            });
            return tList;
        };
        PlatformDataProvider.getPlatformId = function () {
            var _a;
            try {
                return (_a = widget === null || widget === void 0 ? void 0 : widget.getValue('x3dPlatformId')) !== null && _a !== void 0 ? _a : PlatformDataProvider.OnPremise;
            }
            catch (ex) {
                return PlatformDataProvider.OnPremise; //odt case
            }
        };
        PlatformDataProvider.isCloud = function () {
            return PlatformDataProvider.getPlatformId() !== PlatformDataProvider.OnPremise ? true : false;
        };
        PlatformDataProvider.OnPremise = 'OnPremise';
        return PlatformDataProvider;
    }());
    exports.PlatformDataProvider = PlatformDataProvider;
    // Class to represent and build URLs
    var ServiceURL = /** @class */ (function () {
        function ServiceURL(url) {
            this.url = url;
        }
        ServiceURL.prototype.appendURI = function (uri) {
            if (!this.url.endsWith('/') && !uri.startsWith('/')) {
                this.url += '/';
            }
            this.url += uri;
            return this;
        };
        ServiceURL.prototype.toString = function () {
            return this.url;
        };
        ServiceURL.prototype.getURL = function () {
            return this.url;
        };
        return ServiceURL;
    }());
});

/// <amd-module name="DS/XSRUtilityCore/type/AppMeditor"/>
define("DS/XSRUtilityCore/type/AppMeditor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppMeditorStore = exports.MEDIATORS = exports.BASIC_EVENT_LIST = void 0;
    var BASIC_EVENT_LIST;
    (function (BASIC_EVENT_LIST) {
        BASIC_EVENT_LIST["XSR_RIGHT_PANEL_OPENED"] = "xsr-right-panel-opened";
        BASIC_EVENT_LIST["XSR_LEFT_PANEL_OPENED"] = "xsr-left-panel-opened";
        BASIC_EVENT_LIST["XSR_RIGHT_PANEL_CLOSED"] = "xsr-right-panel-closed";
        BASIC_EVENT_LIST["XSR_LEFT_PANEL_CLOSED"] = "xsr-left-panel-closed";
        BASIC_EVENT_LIST["XSR_WELCOMEPANEL_CMD_ACTION_SELECTED"] = "xsr-welcomepanel-cmd-action-selected";
    })(BASIC_EVENT_LIST || (exports.BASIC_EVENT_LIST = BASIC_EVENT_LIST = {}));
    var MEDIATORS;
    (function (MEDIATORS) {
        MEDIATORS["BASIC_EVENTS"] = "basicEvents";
        MEDIATORS["TRIPTYCH_MANAGER"] = "triptychManager";
        MEDIATORS["WELCOMEPANEL_MANAGER"] = "welcomePanelManager";
    })(MEDIATORS || (exports.MEDIATORS = MEDIATORS = {}));
    var AppMeditorStore = /** @class */ (function () {
        function AppMeditorStore() {
        }
        AppMeditorStore.set = function (key, val) {
            this.mediator[key] = val;
        };
        AppMeditorStore.get = function (key) {
            return this.mediator[key];
        };
        AppMeditorStore.mediator = {};
        return AppMeditorStore;
    }());
    exports.AppMeditorStore = AppMeditorStore;
});

/// <amd-module name="DS/XSRUtilityCore/component/welcomepanel/XSRWelcomePanel"/>
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("DS/XSRUtilityCore/component/welcomepanel/XSRWelcomePanel", ["require", "exports", "DS/ENOXWelcomePanel/js/ENOXWelcomePanel", "DS/XSRUtilityCore/events/XSREvents", "DS/XSRUtilityCore/type/AppMeditor"], function (require, exports, ENOXWelcomePanel, XSREvents_1, AppMeditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XSRWelcomePanel = void 0;
    var WelcomePanelEvents;
    (function (WelcomePanelEvents) {
        WelcomePanelEvents["WELCOMEPANEL_EVENT_Toggle"] = "welcome-panel-toggle";
        WelcomePanelEvents["WELCOMEPANEL_EVENT_ActionSelected"] = "welcome-panel-action-selected";
        WelcomePanelEvents["WELCOMEPANEL_EVENT_COLLAPSE"] = "welcome-panel-collapse";
        WelcomePanelEvents["WELCOMEPANEL_EVENT_EXPAND"] = "welcome-panel-expand";
        WelcomePanelEvents["WELCOMEPANEL_EVENT_SELECT_ACTION"] = "welcome-panel-select-action";
        WelcomePanelEvents["WELCOMEPANEL_EVENT_UNSELECT_ACTION"] = "welcome-panel-unselect-action";
    })(WelcomePanelEvents || (WelcomePanelEvents = {}));
    var XSRWelcomePanel = /** @class */ (function () {
        function XSRWelcomePanel(wPanelOptions) {
            this.wEvent = new XSREvents_1.XSREvents();
            var opts = __assign(__assign({}, wPanelOptions), { modelEvents: this.wEvent });
            this.wPanel = new ENOXWelcomePanel(opts);
            this.subscribeEvents();
        }
        XSRWelcomePanel.prototype.render = function () {
            this.wPanel.render();
        };
        XSRWelcomePanel.prototype.expand = function () {
            this.wPanel.show();
        };
        XSRWelcomePanel.prototype.collapse = function () {
            this.wPanel.hide();
        };
        XSRWelcomePanel.prototype.highlightCmd = function (cmdId) {
            this.wPanel.selectAction(cmdId);
        };
        XSRWelcomePanel.prototype.subscribeEvents = function () {
            var basicEvents = AppMeditor_1.AppMeditorStore.get(AppMeditor_1.MEDIATORS.BASIC_EVENTS);
            this.wPanelEvents.push(this.wEvent.subscribe({ event: WelcomePanelEvents.WELCOMEPANEL_EVENT_ActionSelected }, function (data) {
                if (data.id)
                    basicEvents.publish({ event: AppMeditor_1.BASIC_EVENT_LIST.XSR_WELCOMEPANEL_CMD_ACTION_SELECTED, data: data.id });
            }));
        };
        return XSRWelcomePanel;
    }());
    exports.XSRWelcomePanel = XSRWelcomePanel;
});

/// <amd-module name="DS/XSRUtilityCore/platform/CSRFTokenGenerator"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("DS/XSRUtilityCore/platform/CSRFTokenGenerator", ["require", "exports", "DS/WAFData/WAFData", "DS/XSRUtilityCore/platform/PlatformDataProvider", "DS/XSRUtilityCore/service/CSRFTokenManager"], function (require, exports, WAFData, PlatformDataProvider_1, CSRFTokenManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSRFTokenGenerator = void 0;
    var spaceCsrfURI = "/resources/v1/application/E6WFoundation/CSRF";
    var sourcingCsrfURI = "/resources/v1/application/CSRF";
    var CSRFTokenGenerator = /** @class */ (function () {
        function CSRFTokenGenerator() {
        }
        CSRFTokenGenerator.getCSRFToken = function (source) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceURI, response, token, error_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            serviceURI = this.getServiceURI(source);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    var iConfig = {
                                        "method": "GET",
                                        "headers": { 'Content-type': 'application/json' },
                                        "data": undefined,
                                        "onComplete": resolve,
                                        "onFailure": reject
                                    };
                                    WAFData.authenticatedRequest(serviceURI, iConfig);
                                })];
                        case 2:
                            response = _c.sent();
                            response = typeof response === "string" ? JSON.parse(response) : response;
                            token = (_b = (_a = response === null || response === void 0 ? void 0 : response.csrf) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : undefined;
                            CSRFTokenManager_1.CSRFTokenManager.set(source, token);
                            return [2 /*return*/, token];
                        case 3:
                            error_1 = _c.sent();
                            console.error(error_1);
                            throw new Error("Error getting CSRF token! Please contact your system administrator");
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CSRFTokenGenerator.getServiceURI = function (source) {
            switch (source) {
                case "3DSpace" /* Sources.SPACE */:
                    return PlatformDataProvider_1.PlatformDataProvider.getServiceURL("3DSpace" /* Sources.SPACE */).appendURI(spaceCsrfURI).toString();
                case "sourcing" /* Sources.SOURCING */:
                    return PlatformDataProvider_1.PlatformDataProvider.getServiceURL("sourcing" /* Sources.SOURCING */).appendURI(sourcingCsrfURI).toString();
                default:
                    throw new Error("The given source missing in CSRFTokenGenerator");
            }
        };
        return CSRFTokenGenerator;
    }());
    exports.CSRFTokenGenerator = CSRFTokenGenerator;
});

/// <amd-module name="DS/XSRUtilityCore/service/SecurityCtxManager"/>
define("DS/XSRUtilityCore/service/SecurityCtxManager", ["require", "exports", "DS/XSRUtilityCore/util/WidgetDataHandler", "DS/WAFData/WAFData", "DS/XSRUtilityCore/platform/PlatformDataProvider"], function (require, exports, WidgetDataHandler_1, WAFData, PlatformDataProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SecurityCtxManager = void 0;
    var CREDENTIALS_SEPARATOR = ' \u25CF ';
    var SecurityCtxManager = /** @class */ (function () {
        function SecurityCtxManager() {
            this.availableSCForUser = []; // list of applicable security context for login user
        }
        //singleton instance creation
        SecurityCtxManager.getInstance = function () {
            if (SecurityCtxManager.inst === null) {
                SecurityCtxManager.inst = new SecurityCtxManager();
            }
            return SecurityCtxManager.inst;
        };
        //call only on widget load
        SecurityCtxManager.prototype.load = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                PlatformDataProvider_1.PlatformDataProvider.getPlatformInfo().then(function () {
                    that.getLoginPersonContext().then(function (resp) {
                        that.computeCredentialList(resp);
                        resolve(true);
                    }).catch(function (err) {
                        console.log(err);
                        reject("Initalizing Security context failed! Please contact your system administrator");
                    });
                }).catch(function () {
                    reject("Unable to load platform services! Please contact your system administrator");
                });
            });
        };
        SecurityCtxManager.prototype.computeCredentialList = function (resp) {
            var _a, _b, _c;
            var preferredCredJson = resp === null || resp === void 0 ? void 0 : resp.preferredcredentials;
            if (((_a = preferredCredJson === null || preferredCredJson === void 0 ? void 0 : preferredCredJson.collabspace) === null || _a === void 0 ? void 0 : _a.name) && ((_b = preferredCredJson === null || preferredCredJson === void 0 ? void 0 : preferredCredJson.role) === null || _b === void 0 ? void 0 : _b.name) && ((_c = preferredCredJson === null || preferredCredJson === void 0 ? void 0 : preferredCredJson.organization) === null || _c === void 0 ? void 0 : _c.name)) {
                SecurityCtxManager.defaultPreferredSC = [
                    preferredCredJson.collabspace.name,
                    preferredCredJson.role.name,
                    preferredCredJson.organization.name
                ].join(".");
            }
            var TheCollabSpacesArray = resp === null || resp === void 0 ? void 0 : resp.collabspaces;
            if ((TheCollabSpacesArray === null || TheCollabSpacesArray === void 0 ? void 0 : TheCollabSpacesArray.length) > 0) {
                // check if multiorgaization
                var bMultiOrgnizationPresent = false;
                var currOrgName = void 0;
                for (var i = 0; i < TheCollabSpacesArray.length; i++) {
                    var TheCurrentCSJson = TheCollabSpacesArray[i];
                    var TheCouples = TheCurrentCSJson.couples || [];
                    for (var j = 0; j < TheCouples.length; j++) {
                        var couple = TheCouples[j];
                        if (currOrgName === undefined)
                            currOrgName = couple.organization.name;
                        if (currOrgName !== couple.organization.name) {
                            bMultiOrgnizationPresent = true;
                            break;
                        }
                    }
                    if (bMultiOrgnizationPresent)
                        break; // optimization
                }
                for (var i = 0; i < TheCollabSpacesArray.length; i++) {
                    var TheCurrentCSJson = TheCollabSpacesArray[i];
                    var _d = TheCurrentCSJson.name, collabName = _d.name, collabTitle = _d.title;
                    var TheCouples = TheCurrentCSJson.couples;
                    for (var j = 0; j < TheCouples.length; j++) {
                        var TheCurrentCoupleJson = TheCouples[j];
                        var organization = TheCurrentCoupleJson.organization, role = TheCurrentCoupleJson.role;
                        var orgName = organization.name, orgTitle = organization.title;
                        var roleName = role.name, roleNls = role.nls;
                        var SCCurrent = "".concat(roleName, ".").concat(orgName, ".").concat(collabName);
                        var SCCurrent_NLS = bMultiOrgnizationPresent ? collabTitle + CREDENTIALS_SEPARATOR + orgTitle + CREDENTIALS_SEPARATOR + roleNls : collabTitle + CREDENTIALS_SEPARATOR + roleNls;
                        this.availableSCForUser.push({ value: SCCurrent, label: SCCurrent_NLS, collabSpaceTitle: collabTitle });
                    }
                }
                this.availableSCForUser.sort(function (a, b) {
                    if (a.label < b.label)
                        return -1;
                    else if (a.label > b.label)
                        return 1;
                    return 0;
                });
            }
        };
        //WAFData call added  here to remove cyclic dependency from RequestManager -> this file -> PnoServiceProvider -> RequestManager
        SecurityCtxManager.prototype.getLoginPersonContext = function () {
            var timeStampVal = (new Date()).getTime();
            var getSecurityContextURL = '/resources/modeler/pno/person?current=true&select=collabspaces&select=preferredcredentials&timestamp=' + timeStampVal + '&tenant=' + PlatformDataProvider_1.PlatformDataProvider.getPlatformId();
            ;
            var uri = PlatformDataProvider_1.PlatformDataProvider.getServiceURL("3DSpace" /* Sources.SPACE */).appendURI(getSecurityContextURL).toString();
            var headersOpts = {};
            headersOpts['Content-type'] = 'application/json';
            return new Promise(function (resolve, reject) {
                var iConfig = {
                    "method": "GET",
                    "headers": headersOpts,
                    "data": undefined,
                    "onComplete": resolve,
                    "onFailure": reject
                };
                WAFData.authenticatedRequest(uri, iConfig);
            });
        };
        // perferance will invoke to show the list of secuirty classes 
        SecurityCtxManager.prototype.getSCListForPreferences = function () {
            return this.availableSCForUser;
        };
        SecurityCtxManager.getSecurityCtxOnWidget = function () {
            var _a;
            return (_a = WidgetDataHandler_1.WidgetDataHandler.get("Current_security_credentials" /* DataKeys.CURRENT_SECURITYCTX */)) !== null && _a !== void 0 ? _a : SecurityCtxManager.defaultPreferredSC;
        };
        SecurityCtxManager.inst = null;
        return SecurityCtxManager;
    }());
    exports.SecurityCtxManager = SecurityCtxManager;
});

/// <amd-module name="DS/XSRUtilityCore/handler/XSRWidgetPreferences"/>
define("DS/XSRUtilityCore/handler/XSRWidgetPreferences", ["require", "exports", "DS/XSRUtilityCore/platform/PlatformDataProvider", "DS/XSRUtilityCore/service/SecurityCtxManager", "i18n!DS/XSRUtilityCore/assets/nls/XSRCommonVocab"], function (require, exports, PlatformDataProvider_1, SecurityCtxManager_1, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XSRWidgetPreferences = void 0;
    var XSRWidgetPreferences = /** @class */ (function () {
        function XSRWidgetPreferences() {
            this.showPreferences();
        }
        //singleton instance creation
        XSRWidgetPreferences.instantiate = function () {
            if (!XSRWidgetPreferences.inst) {
                XSRWidgetPreferences.inst = new XSRWidgetPreferences();
            }
            return XSRWidgetPreferences.inst;
        };
        XSRWidgetPreferences.prototype.showPreferences = function () {
            var _a, _b;
            // security context List 
            var securityCtxPref = widget.hasPreference("Current_security_credentials") || widget.hasPreference("pad_security_ctx");
            var cadAuthoringPref = widget.hasPreference("CADAuthoring");
            var wrkUnderChangePref = widget.hasPreference("WorkUnderChange");
            var intervalswitchpreference = widget.hasPreference("Intervalswitchpreference");
            if (!securityCtxPref)
                this.addSecurityContextPreference();
            if (PlatformDataProvider_1.PlatformDataProvider.isCloud())
                this.addPlatformPreference();
            if (!cadAuthoringPref)
                this.add({ name: "CADAuthoring", label: NLS.pref_CADAuthoring, defaultValue: (_a = widget.getValue("CADAuthoring")) !== null && _a !== void 0 ? _a : false, type: "boolean" });
            if (!wrkUnderChangePref)
                this.add({ name: "WorkUnderChange", label: NLS.pref_showWorkUnder, defaultValue: (_b = widget.getValue("WorkUnderChange")) !== null && _b !== void 0 ? _b : true, type: "boolean" });
            if (!intervalswitchpreference)
                this.addIndexInterval();
        };
        XSRWidgetPreferences.prototype.addSecurityContextPreference = function () {
            var scList = SecurityCtxManager_1.SecurityCtxManager.getInstance().getSCListForPreferences();
            this.add({
                name: "Current_security_credentials",
                defaultValue: SecurityCtxManager_1.SecurityCtxManager.getSecurityCtxOnWidget(),
                type: 'list',
                label: NLS.pref_securityCtx,
                options: scList
            });
        };
        XSRWidgetPreferences.prototype.addPlatformPreference = function () {
            var tenantList = PlatformDataProvider_1.PlatformDataProvider.getTenants();
            var preferredPlatformId = PlatformDataProvider_1.PlatformDataProvider.getPlatformId();
            this.add({
                name: "x3dPlatformId",
                defaultValue: preferredPlatformId,
                type: 'list',
                label: NLS.pref_3DEXPERIENCEPlatform,
                options: tenantList.map(function (platform) {
                    return {
                        label: platform.displayName,
                        value: platform.name
                    };
                }),
                onchange: "onPlatformIdChange",
                disabled: tenantList.length < 2,
            });
        };
        XSRWidgetPreferences.prototype.addIndexInterval = function () {
            var intervalSwitch = [{
                    label: NLS.range_zeroMin,
                    value: '0',
                }, {
                    label: NLS.range_oneMin,
                    value: '60',
                }, {
                    label: NLS.range_threeMin,
                    value: '180',
                }, {
                    label: NLS.range_fiveMin,
                    value: '300',
                }, {
                    label: NLS.range_tenMin,
                    value: '600',
                }];
            this.add({ name: "intervalswitchpreference", label: NLS.pref_autoSwitchMode, defaultValue: '180', type: "list", options: intervalSwitch });
        };
        XSRWidgetPreferences.prototype.add = function (opts) {
            widget.addPreference(opts);
        };
        XSRWidgetPreferences.prototype.remove = function (name) {
            if (widget.hasPreference(name)) {
                var prefs = widget.getPreferences();
                for (var i = 0; i < prefs.length; i++) {
                    if (name === prefs[i].name) {
                        //take out the prefernce if name matches
                        widget.preferences.splice(i, 1);
                        break;
                    }
                }
            }
        };
        return XSRWidgetPreferences;
    }());
    exports.XSRWidgetPreferences = XSRWidgetPreferences;
});

/// <amd-module name="DS/XSRUtilityCore/service/RequestManager"/>
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("DS/XSRUtilityCore/service/RequestManager", ["require", "exports", "DS/XSRUtilityCore/platform/PlatformDataProvider", "DS/XSRUtilityCore/service/SecurityCtxManager", "DS/WAFData/WAFData", "DS/XSRUtilityCore/service/CSRFTokenManager"], function (require, exports, PlatformDataProvider_1, SecurityCtxManager_1, WAFData, CSRFTokenManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RequestManager = exports.HeadersKey = void 0;
    // Default headers
    var defaultHeaders = {
        "Content-Type": "text/html"
    };
    var HeadersKey;
    (function (HeadersKey) {
        HeadersKey["CONTENT_TYPE"] = "Content-type";
        HeadersKey["SECURITYCONTEXT"] = "SecurityContext";
        HeadersKey["ACCEPT_LANGUAGE"] = "Accept-Language";
        HeadersKey["X_Requested_With"] = "X-Requested-With";
        HeadersKey["X_Request"] = "X-Request";
        HeadersKey["ENO_CSRF_TOKEN"] = "ENO_CSRF_TOKEN";
        HeadersKey["DS_Change_Authoring_Context"] = "DS-Change-Authoring-Context";
    })(HeadersKey || (exports.HeadersKey = HeadersKey = {}));
    ;
    var RequestManager = /** @class */ (function () {
        function RequestManager(source) {
            this.source = source;
            this._tenant = PlatformDataProvider_1.PlatformDataProvider.getPlatformId();
            this._serviceURI = source ? PlatformDataProvider_1.PlatformDataProvider.getServiceURL(source, this._tenant).getURL() : undefined;
            if (!this._serviceURI)
                throw Error("Unable to initialize request. Service not found on given source");
        }
        RequestManager.prototype.headers = function (headers, withSecurityContext, withCSRFToken) {
            var _a, _b, _c;
            var _d;
            if (withSecurityContext === void 0) { withSecurityContext = true; }
            if (withCSRFToken === void 0) { withCSRFToken = true; }
            this._headers = headers !== null && headers !== void 0 ? headers : defaultHeaders;
            this._headers = __assign(__assign(__assign(__assign({}, this._headers), (_a = {}, _a["Accept-Language" /* HeadersKey.ACCEPT_LANGUAGE */] = (_d = widget === null || widget === void 0 ? void 0 : widget.lang) !== null && _d !== void 0 ? _d : "en", _a)), (withCSRFToken ? (_b = {},
                _b["ENO_CSRF_TOKEN" /* HeadersKey.ENO_CSRF_TOKEN */] = CSRFTokenManager_1.CSRFTokenManager.get(this.source),
                _b["X-Request" /* HeadersKey.X_Request */] = CSRFTokenManager_1.CSRFTokenManager.get(this.source),
                _b["X-Requested-With" /* HeadersKey.X_Requested_With */] = "csrf protection",
                _b) : {})), (withSecurityContext ? (_c = {}, _c["SecurityContext" /* HeadersKey.SECURITYCONTEXT */] = SecurityCtxManager_1.SecurityCtxManager.getSecurityCtxOnWidget(), _c) : {}));
            return this;
        };
        RequestManager.prototype.get = function (uri) {
            return this.sendRequest(uri, "GET");
        };
        RequestManager.prototype.delete = function (uri) {
            return this.sendRequest(uri, "DELETE");
        };
        RequestManager.prototype.post = function (uri, payload) {
            return this.sendRequest(uri, "POST", payload);
        };
        RequestManager.prototype.put = function (uri, payload) {
            return this.sendRequest(uri, "PUT", payload);
        };
        RequestManager.prototype.patch = function (uri, payload) {
            return this.sendRequest(uri, "PATCH", payload);
        };
        RequestManager.prototype.sendRequest = function (endpoint, method, payload) {
            var that = this;
            if (!endpoint.includes("tenant="))
                endpoint += endpoint.includes("?") ? "&tenant=".concat(this._tenant) : "?tenant=".concat(this._tenant);
            // Build full URL using PlatformDataProvider and append URI
            var fullUrl = PlatformDataProvider_1.PlatformDataProvider.getServiceURL(this.source, this._tenant).appendURI(endpoint).toString();
            return new Promise(function (resolve, reject) {
                var _a;
                var iConfig = {
                    "method": method,
                    "headers": (_a = that._headers) !== null && _a !== void 0 ? _a : defaultHeaders,
                    "data": payload ? JSON.stringify(payload) : undefined,
                    "onComplete": resolve,
                    "onFailure": reject
                };
                WAFData.authenticatedRequest(fullUrl, iConfig);
            });
        };
        return RequestManager;
    }());
    exports.RequestManager = RequestManager;
});

/// <amd-module name="DS/XSRUtilityCore/handler/XSRTypeManager"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("DS/XSRUtilityCore/handler/XSRTypeManager", ["require", "exports", "DS/XSRUtilityCore/service/RequestManager", "DS/XSRUtilityCore/util/PromiseStateTracker"], function (require, exports, RequestManager_1, PromiseStateTracker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XSRTypeManager = void 0;
    var url = "/resources/v1/modeler/specmanagement/types";
    var XSRTypeManager = /** @class */ (function (_super) {
        __extends(XSRTypeManager, _super);
        function XSRTypeManager() {
            var _this = _super.call(this, "3DSpace" /* Sources.SPACE */) || this;
            _this.concatTypeMeta = [];
            _this.initialized();
            return _this;
        }
        //singleton instance creation
        XSRTypeManager.instantiate = function () {
            if (!XSRTypeManager.inst) {
                XSRTypeManager.inst = new XSRTypeManager();
            }
            return XSRTypeManager.inst;
        };
        XSRTypeManager.prototype.initialized = function () {
            var productTypes = [
                {
                    requestData: [{ name: "VPMReference" /* Constants.TYPE_VPMREFERENCE */, includesubtypes: false, includespecializedtypes: true },
                        { name: "ProductSpecificationType" /* Constants.TYPE_PRODDUCTSPECTYPE */, includesubtypes: true, includespecializedtypes: true }],
                    list: XSRTypeManager.physicalProductDBTypeList
                },
                {
                    requestData: [{ name: "Raw_Material" /* Constants.TYPE_RAW_MATERIAL */, includesubtypes: true, includespecializedtypes: true }],
                    list: XSRTypeManager.rawMaterialDBTypeList
                },
                {
                    requestData: [{ name: "Formulated_Product" /* Constants.TYPE_FORMULATED_PRODUCT */, includesubtypes: true, includespecializedtypes: true }],
                    list: XSRTypeManager.formulatedProductDBTypeList
                },
                {
                    requestData: [{ name: "Documents" /* Constants.TYPE_DOCUMENTS */, includesubtypes: false, includespecializedtypes: true },
                        { name: "Technical Specification" /* Constants.TYPE_TECHNICALSPECIFICATION */, includesubtypes: true, includespecializedtypes: true },
                        { name: "Test Method Specification" /* Constants.TYPE_TESTMETHODSPECIFICATION */, includesubtypes: true, includespecializedtypes: true }],
                    list: XSRTypeManager.documentDBTypeList
                },
                {
                    requestData: [{ name: "Drawing" /* Constants.TYPE_DRAWING */, includesubtypes: false, includespecializedtypes: true }],
                    list: XSRTypeManager.drawingDBTypeList
                },
                /*{
                    requestData: [{ name: Constants.TYPE_PERFORMANCESPEC, includesubtypes: false, includespecializedtypes: true }],
                    list: XSRTypeManager.performanceSpecDBTypeList
                },
                {
                    requestData: [{ name: Constants.TYPE_PERFORMANCECHAR, includesubtypes: true, includespecializedtypes: true }],
                    list: XSRTypeManager.performanceCharDBTypeList
                }*/
            ];
            var that = this;
            // Process each product type and fetch subtypes
            productTypes.forEach(function (_a) {
                var requestData = _a.requestData, list = _a.list;
                that.getSubtypes(requestData).promise.then(function (resp) {
                    var _a;
                    // event - loaded
                    var typeArr = (_a = resp === null || resp === void 0 ? void 0 : resp.result) !== null && _a !== void 0 ? _a : [];
                    that.concatTypeMeta = that.concatTypeMeta.concat(typeArr); // Update concatTypeMeta
                    typeArr.forEach(function (t) { return list.push(t.type); }); // Add each type to the corresponding list
                });
            });
        };
        //if required to call this method outside this class, will make it public
        XSRTypeManager.prototype.getSubtypes = function (reqbody) {
            var headersOpts = {};
            headersOpts["Content-type" /* HeadersKey.CONTENT_TYPE */] = 'application/json';
            return (0, PromiseStateTracker_1.TrackPromiseState)(_super.prototype.headers.call(this, headersOpts).post(url, reqbody));
        };
        XSRTypeManager.isPhysicalProduct = function (type) {
            //if(this.physicalprodPromise?.isPending()) throw event
            return XSRTypeManager.physicalProductDBTypeList.indexOf(type) >= 0;
        };
        XSRTypeManager.isRawMaterial = function (type) {
            return XSRTypeManager.rawMaterialDBTypeList.indexOf(type) >= 0;
        };
        XSRTypeManager.isDocument = function (type) {
            return XSRTypeManager.documentDBTypeList.indexOf(type) >= 0;
        };
        XSRTypeManager.isFormulatedProduct = function (type) {
            return XSRTypeManager.formulatedProductDBTypeList.indexOf(type) >= 0;
        };
        XSRTypeManager.isDrawing = function (type) {
            return XSRTypeManager.drawingDBTypeList.indexOf(type) >= 0;
        };
        XSRTypeManager.isPerformanceSpec = function (type) {
            return XSRTypeManager.performanceSpecDBTypeList.indexOf(type) >= 0;
        };
        XSRTypeManager.isPerformanceChar = function (type) {
            return XSRTypeManager.performanceCharDBTypeList.indexOf(type) >= 0;
        };
        XSRTypeManager.physicalProductDBTypeList = [];
        XSRTypeManager.rawMaterialDBTypeList = [];
        XSRTypeManager.documentDBTypeList = [];
        XSRTypeManager.formulatedProductDBTypeList = [];
        XSRTypeManager.drawingDBTypeList = [];
        XSRTypeManager.performanceSpecDBTypeList = [];
        XSRTypeManager.performanceCharDBTypeList = [];
        return XSRTypeManager;
    }(RequestManager_1.RequestManager));
    exports.XSRTypeManager = XSRTypeManager;
});

/// <amd-module name="DS/XSRUtilityCore/handler/XSRAdminConfigManager"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("DS/XSRUtilityCore/handler/XSRAdminConfigManager", ["require", "exports", "DS/XSRUtilityCore/service/RequestManager"], function (require, exports, RequestManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProductCommandSetting = void 0;
    var getProductCommandSetting = function () {
        return AdminConfigManager.instantiate().getConfigurations("ProductSpecification");
    };
    exports.getProductCommandSetting = getProductCommandSetting;
    var AdminConfigManager = /** @class */ (function (_super) {
        __extends(AdminConfigManager, _super);
        function AdminConfigManager() {
            var _this = _super.call(this, "3DSpace" /* Sources.SPACE */) || this;
            _this.uri = "/resources/v1/specadmin/Config/AdminConfiguration/";
            return _this;
        }
        AdminConfigManager.instantiate = function () {
            if (!AdminConfigManager.inst) {
                AdminConfigManager.inst = new AdminConfigManager();
            }
            return AdminConfigManager.inst;
        };
        AdminConfigManager.prototype.getConfigurations = function (fetaureName) {
            var headersOpts = {};
            headersOpts["Content-type" /* HeadersKey.CONTENT_TYPE */] = 'application/json';
            return _super.prototype.headers.call(this, headersOpts).get(this.uri + fetaureName);
        };
        return AdminConfigManager;
    }(RequestManager_1.RequestManager));
});

/// <amd-module name="DS/XSRUtilityCore/triptych/XSRTriptych"/>
define("DS/XSRUtilityCore/triptych/XSRTriptych", ["require", "exports", "DS/XSRUtilityCore/events/XSREvents", "DS/ENOXTriptych/js/ENOXTriptych"], function (require, exports, XSREvents_1, ENOXTriptych) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XSRTriptych = void 0;
    var XSRTriptych = /** @class */ (function () {
        function XSRTriptych(container) {
            this.container = container;
            this.mTriptych = new ENOXTriptych();
            this.tryptchEvent = new XSREvents_1.XSREvents();
        }
        XSRTriptych.prototype.initialize = function (iLeft, iMiddle, iRight) {
            var triptychOptions = {
                modelEvents: this.tryptchEvent,
                container: this.container,
                withtransition: true,
                left: {
                    resizable: false,
                    minwidth: 300
                },
                right: {
                    resizable: true,
                    minWidth: 300,
                    originalState: 'close',
                    withClose: true,
                    overMobile: true
                }
            };
            this.mTriptych.init(triptychOptions, iLeft, iMiddle, iRight);
        };
        XSRTriptych.prototype.destroy = function () {
            this.mTriptych.destroy();
        };
        return XSRTriptych;
    }());
    exports.XSRTriptych = XSRTriptych;
});

/// <amd-module name="DS/XSRUtilityCore/triptych/ENOXTriptychManager"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("DS/XSRUtilityCore/triptych/ENOXTriptychManager", ["require", "exports", "DS/XSRUtilityCore/triptych/XSRTriptych", "DS/XSRUtilityCore/type/AppMeditor"], function (require, exports, XSRTriptych_1, AppMeditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ENOXTriptychManager = void 0;
    var triptychEvents;
    (function (triptychEvents) {
        //events
        triptychEvents["EVENT_TRIPTYCH_RESIZE"] = "resizing-triptych-container";
        triptychEvents["TRIPTYCH_EVENT_SetSize"] = "triptych-set-size";
        triptychEvents["TRIPTYCH_EVENT_ShowPanel"] = "triptych-show-panel";
        triptychEvents["TRIPTYCH_SET_CONTENT"] = "triptych-set-content";
        triptychEvents["TRIPTYCH_EVENT_HidePanel"] = "triptych-hide-panel";
        triptychEvents["TRIPTYCH_ADD_CHECK_BEFORE_CLOSE"] = "triptych-add-check-before-close";
        triptychEvents["TRIPTYCH_REMOVE_CHECK_BEFORE_CLOSE"] = "triptych-remove-check-before-close";
        triptychEvents["EVENT_TRIPTYCH_PANEL_VISIBLE"] = "triptych-panel-visible";
        triptychEvents["EVENT_TRIPTYCH_PANEL_HIDDEN"] = "triptych-panel-hidden";
        triptychEvents["EVENT_TRIPTYCH_TOGGLE_PANEL"] = "triptych-toggle-panel";
    })(triptychEvents || (triptychEvents = {}));
    var TRIPTYCH_SIDE_Left = "left";
    var TRIPTYCH_SIDE_Right = "right";
    var TRIPTYCH_SIDE_Middle = "middle";
    var ENOXTriptychManager = /** @class */ (function (_super) {
        __extends(ENOXTriptychManager, _super);
        function ENOXTriptychManager(container) {
            return _super.call(this, container) || this;
        }
        ENOXTriptychManager.prototype.render = function (iLeft, iMiddle, iRight) {
            _super.prototype.initialize.call(this, iLeft, iMiddle, iRight);
            this.prepareEvents();
        };
        ENOXTriptychManager.prototype.prepareEvents = function () {
            var basicEvents = AppMeditor_1.AppMeditorStore.get(AppMeditor_1.MEDIATORS.BASIC_EVENTS);
            this.triptychEventList.push(this.tryptchEvent.subscribe({ event: triptychEvents.EVENT_TRIPTYCH_PANEL_VISIBLE }, function (side) {
                if (side === TRIPTYCH_SIDE_Right) {
                    basicEvents.publish({ event: AppMeditor_1.BASIC_EVENT_LIST.XSR_RIGHT_PANEL_OPENED });
                }
                else if (side === TRIPTYCH_SIDE_Left) {
                    basicEvents.publish({ event: AppMeditor_1.BASIC_EVENT_LIST.XSR_LEFT_PANEL_OPENED });
                }
            }));
            this.triptychEventList.push(this.tryptchEvent.subscribe({ event: triptychEvents.EVENT_TRIPTYCH_PANEL_HIDDEN }, function (side) {
                if (side === TRIPTYCH_SIDE_Right) {
                    basicEvents.publish({ event: AppMeditor_1.BASIC_EVENT_LIST.XSR_RIGHT_PANEL_CLOSED });
                }
                else if (side === TRIPTYCH_SIDE_Left) {
                    basicEvents.publish({ event: AppMeditor_1.BASIC_EVENT_LIST.XSR_LEFT_PANEL_CLOSED });
                }
            }));
            /*this.triptychEvents.push(triEvent.subscribe({event: triptychEvents.EVENT_TRIPTYCH_RESIZE }, function (data: number) {
            if (data < 550) {
                triEvent.publish({
                    event: triptychEvents.TRIPTYCH_EVENT_HidePanel,
                    data: TRIPTYCH_SIDE_Left
                });

            } else {
                if (!isMultiGridVisible && !isItemOpened) {
                    triEvent.publish({
                        event: triptychEvents.TRIPTYCH_EVENT_ShowPanel,
                        data: TRIPTYCH_SIDE_Left
                    });
                }
            }

            }));*/
        };
        ENOXTriptychManager.prototype.hideLeftPanel = function () {
            this.tryptchEvent.publish({ event: triptychEvents.TRIPTYCH_EVENT_HidePanel, data: TRIPTYCH_SIDE_Left });
        };
        ENOXTriptychManager.prototype.showLeftPanel = function () {
            this.tryptchEvent.publish({ event: triptychEvents.TRIPTYCH_EVENT_ShowPanel, data: TRIPTYCH_SIDE_Left });
        };
        ENOXTriptychManager.prototype.hideRightPanel = function () {
            this.tryptchEvent.publish({ event: triptychEvents.TRIPTYCH_EVENT_HidePanel, data: TRIPTYCH_SIDE_Right });
        };
        ENOXTriptychManager.prototype.showRightPanel = function () {
            this.tryptchEvent.publish({ event: triptychEvents.TRIPTYCH_EVENT_ShowPanel, data: TRIPTYCH_SIDE_Right });
        };
        ENOXTriptychManager.prototype.collapseLeftPanel = function () {
            widget.body.getSize().width > 550 ? this.tryptchEvent.publish({ event: triptychEvents.TRIPTYCH_EVENT_SetSize, data: { side: TRIPTYCH_SIDE_Left, size: 40 } }) :
                this.tryptchEvent.publish({ event: triptychEvents.TRIPTYCH_EVENT_HidePanel, data: TRIPTYCH_SIDE_Left });
        };
        ENOXTriptychManager.prototype.expandLeftPanel = function () {
            this.tryptchEvent.publish({ event: triptychEvents.TRIPTYCH_EVENT_ShowPanel, data: TRIPTYCH_SIDE_Left });
        };
        ENOXTriptychManager.prototype.addCheckBeforeClose = function (side, callback) {
            this.tryptchEvent.publish({ event: triptychEvents.TRIPTYCH_ADD_CHECK_BEFORE_CLOSE,
                data: {
                    side: side,
                    callback: callback
                }
            });
        };
        ENOXTriptychManager.prototype.removeCheckBeforeClose = function (iSide) {
            this.tryptchEvent.publish({ event: triptychEvents.TRIPTYCH_REMOVE_CHECK_BEFORE_CLOSE, data: { side: iSide } });
        };
        ENOXTriptychManager.prototype.destroy = function () {
            this.tryptchEvent.unsubscribeList(this.triptychEventList);
            _super.prototype.destroy.call(this);
        };
        return ENOXTriptychManager;
    }(XSRTriptych_1.XSRTriptych));
    exports.ENOXTriptychManager = ENOXTriptychManager;
});

