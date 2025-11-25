/// <amd-module name="DS/XSRServiceHandler/handler/XFormulaService"/>
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
define("DS/XSRServiceHandler/handler/XFormulaService", ["require", "exports", "DS/XSRUtilityCore/service/RequestManager"], function (require, exports, RequestManager_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XFormulaService = void 0;
    var urlbase = "resources/formulatedproduct/v1/";
    //const adminUrlBase: string = "resources/v1/specadmin/Config/AdminConfiguration/";
    var defaultHeaders = (_a = {},
        _a["Content-type" /* HeadersKey.CONTENT_TYPE */] = "application/json",
        _a);
    var XFormulaService = /** @class */ (function (_super) {
        __extends(XFormulaService, _super);
        function XFormulaService() {
            return _super.call(this, "3DSpace" /* Sources.SPACE */) || this;
        }
        //singleton instance creation
        XFormulaService.getInstance = function () {
            if (!XFormulaService.inst) {
                XFormulaService.inst = new XFormulaService();
            }
            return XFormulaService.inst;
        };
        return XFormulaService;
    }(RequestManager_1.RequestManager));
    exports.XFormulaService = XFormulaService;
});

/// <amd-module name="DS/XSRServiceHandler/handler/PnOServiceProvider"/>
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
define("DS/XSRServiceHandler/handler/PnOServiceProvider", ["require", "exports", "DS/XSRUtilityCore/service/RequestManager"], function (require, exports, RequestManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PnOServiceProvider = void 0;
    var pnoURL = "resources/modeler/pno/person";
    var PnOServiceProvider = /** @class */ (function (_super) {
        __extends(PnOServiceProvider, _super);
        function PnOServiceProvider() {
            return _super.call(this, "3DSpace" /* Sources.SPACE */) || this;
        }
        //singleton instance creation
        PnOServiceProvider.getInstance = function () {
            if (!PnOServiceProvider.inst) {
                PnOServiceProvider.inst = new PnOServiceProvider();
            }
            return PnOServiceProvider.inst;
        };
        // moved to SecurityCtxManager to avoid cyclic dependency
        /*public getLoginPersonContext(): Promise<unknown> {
            let timeStampVal = (new Date()).getTime();
            let getSecurityContextURL: string = pnoURL + '?current=true&select=collabspaces&select=preferredcredentials&select=role&timestamp=' + timeStampVal;
    
            let headersOpts: HeadersInit = {};
            headersOpts[HeadersKey.CONTENT_TYPE] = 'application/json';
            return super.setHeaders(headersOpts, false).get(getSecurityContextURL);
        }*/
        PnOServiceProvider.prototype.getPersonInfo = function (personName) {
            var getSecurityContextURL = pnoURL + '/' + personName;
            var headersOpts = {};
            headersOpts["Content-type" /* HeadersKey.CONTENT_TYPE */] = 'application/json';
            return _super.prototype.headers.call(this, headersOpts).get(getSecurityContextURL);
        };
        return PnOServiceProvider;
    }(RequestManager_1.RequestManager));
    exports.PnOServiceProvider = PnOServiceProvider;
});

/// <amd-module name="DS/XSRServiceHandler/handler/XMaterialService"/>
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
define("DS/XSRServiceHandler/handler/XMaterialService", ["require", "exports", "DS/XSRUtilityCore/service/RequestManager"], function (require, exports, RequestManager_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XMaterialService = void 0;
    var urlbase = "resources/v1/dsxmaterial";
    var adminUrlBase = "resources/v1/specadmin/Config/AdminConfiguration/";
    var defaultMatHeaders = (_a = {},
        _a["Content-type" /* HeadersKey.CONTENT_TYPE */] = "application/json",
        _a);
    var XMaterialService = /** @class */ (function (_super) {
        __extends(XMaterialService, _super);
        function XMaterialService() {
            return _super.call(this, "3DSpace" /* Sources.SPACE */) || this;
        }
        //singleton instance creation
        XMaterialService.getInstance = function () {
            if (!XMaterialService.inst) {
                XMaterialService.inst = new XMaterialService();
            }
            return XMaterialService.inst;
        };
        XMaterialService.prototype.getConnectedMaterials = function (parentid) {
            var uri = urlbase + "/" + parentid + "/materials";
            return _super.prototype.headers.call(this, defaultMatHeaders).get(uri);
        };
        XMaterialService.prototype.connectMaterial = function (parentid, data) {
            var uri = urlbase + "/connect/" + parentid;
            return _super.prototype.headers.call(this, defaultMatHeaders).post(uri, data);
        };
        XMaterialService.prototype.disconnectMaterial = function (parentid, data) {
            var uri = urlbase + "/disconnect/" + parentid;
            return _super.prototype.headers.call(this, defaultMatHeaders).post(uri, data);
        };
        XMaterialService.prototype.checkMaterialMismatch = function (parentid) {
            var uri = urlbase + "/validate/" + parentid;
            return _super.prototype.headers.call(this, defaultMatHeaders).get(uri);
        };
        XMaterialService.prototype.releaseBioMaterial = function (bioMat3dxId) {
            var uri = urlbase + "/transition/" + bioMat3dxId;
            var data = { "toState": "Release" };
            return _super.prototype.headers.call(this, defaultMatHeaders).post(uri, data);
        };
        XMaterialService.prototype.getMaterialInfo = function (matIdRev, plmMatId) {
            var uri;
            if (this.is3dxMaterial(matIdRev)) {
                // service for fetchig bio material info with or without plmaterial info
                uri = plmMatId ? urlbase + "/materialrevision/" + matIdRev + "?plmMaterialId=" + plmMatId : urlbase + "/materialrevision/" + matIdRev;
            }
            else {
                uri = urlbase + "/" + matIdRev; // to get PLM material info // yet to implement modeler
            }
            return _super.prototype.headers.call(this, defaultMatHeaders).get(uri);
        };
        XMaterialService.prototype.getMaterialAdminSettings = function () {
            var _this = this;
            var that = this;
            var getAdminFun = function () { return __awaiter(_this, void 0, void 0, function () {
                var serviceURI;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            serviceURI = adminUrlBase + "Material";
                            return [4 /*yield*/, _super.prototype.headers.call(this, defaultMatHeaders).get(serviceURI)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            return new Promise(function (resolve, reject) {
                if (that._materialAdminConfig)
                    resolve(that._materialAdminConfig);
                else {
                    getAdminFun().then(function (r) {
                        var resp = {
                            is3DModelingSupported: r.result.isModelingandSimulationOptional,
                            useMaterialsOnFormula: r.result.isFormulaOptional
                        };
                        that._materialAdminConfig = resp;
                        resolve(resp);
                    }).catch(function (err) {
                        console.log(err);
                        resolve({ is3DModelingSupported: true, useMaterialsOnFormula: false });
                    });
                }
            });
        };
        XMaterialService.prototype.is3dxMaterial = function (id) {
            return id === null || id === void 0 ? void 0 : id.startsWith("i3dx");
        };
        return XMaterialService;
    }(RequestManager_1.RequestManager));
    exports.XMaterialService = XMaterialService;
});

