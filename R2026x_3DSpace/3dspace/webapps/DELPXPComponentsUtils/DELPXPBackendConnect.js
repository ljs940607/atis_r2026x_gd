/// <amd-module name="DS/DELPXPComponentsUtils/DELPXPBackendConnect"/>
define("DS/DELPXPComponentsUtils/DELPXPBackendConnect", ["require", "exports", "DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices", "DS/Logger/Logger"], function (require, exports, i3DXCompassServices, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConnectToPXPBackend = ConnectToPXPBackend;
    var _logger = Logger.getLogger('PXP.APP');
    async function retrieveServicesURL(servicesName, platformId, timeout = 5000) {
        const promise = new Promise(function (resolve, reject) {
            // WARNING if you are on ODT this service never responds ! Then I create a TimeoutPromise !
            i3DXCompassServices.getServiceUrl({
                serviceName: servicesName,
                platformId: platformId,
                onComplete: (data) => {
                    if (!data) {
                        reject(new Error("Retrieve PXPBackend connection- not found services '" + servicesName + "' !"));
                        return;
                    }
                    var urlBase;
                    if (Array.isArray(data)) {
                        if (data.length > 1) {
                            var msg = 'Retrieve PXPBackend connection- Multi platform instance found ! (';
                            for (var i = 0; i < data.length; i++) {
                                if (i > 0)
                                    msg += '; ';
                                msg += data[i].platformId;
                            }
                            msg += '). Select a unique tenant !';
                            reject(new Error(msg));
                            return;
                        }
                        urlBase = new URL(data[0].url);
                    }
                    else {
                        urlBase = new URL(data);
                    }
                    resolve(urlBase);
                },
                onFailure: (reason) => {
                    reject(new Error(reason));
                },
            });
        });
        const promiseTimeOut = new Promise((_r, reject) => setTimeout(() => {
            reject(new Error('retrieveServicesURL Timeout'));
        }, timeout));
        return Promise.race([promise, promiseTimeOut]);
    }
    var enProvideUrl;
    (function (enProvideUrl) {
        enProvideUrl[enProvideUrl["error"] = 0] = "error";
        enProvideUrl[enProvideUrl["user"] = 1] = "user";
        enProvideUrl[enProvideUrl["widgetUrl"] = 2] = "widgetUrl";
        enProvideUrl[enProvideUrl["dsregistry"] = 3] = "dsregistry";
    })(enProvideUrl || (enProvideUrl = {}));
    async function ConnectToPXPBackend(params) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            var connection = {};
            if (typeof (params === null || params === void 0 ? void 0 : params.serverUrl) === 'string') {
                connection.provide = enProvideUrl.user;
                connection.hypervisorUrl = new URL(params.serverUrl);
            }
            //@ts-ignore
            let w = (_a = params.widget) !== null && _a !== void 0 ? _a : window.widget;
            if (w === undefined && connection.hypervisorUrl === undefined) {
                reject(new Error("PXPBackend- 'widget' or 'serverUrl' are mandatory"));
            }
            // retrieve platformId
            connection.tenant = (_b = w === null || w === void 0 ? void 0 : w.getValue('x3dPlatformId')) !== null && _b !== void 0 ? _b : 'OnPremise';
            if (connection.hypervisorUrl === undefined) {
                // Check URL if 'hypervisor is passed'
                if (typeof w.uwaUrl === 'string') {
                    try {
                        let url = new URL(w.uwaUrl);
                        // Check PARAMETERS- <server>/widget.html?hypervisor=wss://127.0.0.1:2099/
                        let sparams = url.searchParams;
                        let hypervisorLocal = sparams.get('hypervisor');
                        if (hypervisorLocal != null) {
                            connection.provide = enProvideUrl.widgetUrl;
                            connection.hypervisorUrl = new URL(hypervisorLocal);
                        }
                        else if (connection.tenant === 'OnPremise') {
                            // connection.provide = enProvideUrl.user;
                            // connection.hypervisorUrl = new URL("wss://"+ url.hostname + "/hypervisor");
                            // connection.hypervisorUrl = new URL("wss://"+ url.hostname + "/hypervisor");
                            //@ts-ignore
                            // let w: WidgetType = params.widget ?? window.widget;
                            // if (w === undefined && connection.hypervisorUrl === undefined) {
                            //   reject(new Error("PXPBackend- 'widget' or 'serverUrl' are mandatory"));
                            // }
                            // // retrieve platformId
                            // connection.tenant = w?.getValue('x3dPlatformId') ?? 'OnPremise';
                            let platformId = w === null || w === void 0 ? void 0 : w.getValue('x3dPlatformId');
                            i3DXCompassServices.getServiceUrl({
                                serviceName: "delmiamanufacturingcompute",
                                platformId: platformId,
                                onComplete: function (data) {
                                    if (!data) {
                                        connection.provide = enProvideUrl.user;
                                        connection.hypervisorUrl = new URL("wss://" + url.hostname + "/hypervisor");
                                        _logger.warn('PXPRegistry failed- not found services delmiamanufacturingcompute fallback using hostname !');
                                        //reject(new Error("PXPRegistry failed- not found services delmiamanufacturingcompute  !"))
                                        //return
                                    }
                                    else {
                                        if (Array.isArray(data)) {
                                            connection.hypervisorUrl = data[0].url;
                                        }
                                        else {
                                            //connection.hypervisorUrl = new URL(data);
                                            connection.hypervisorUrl = new URL("/hypervisor", new URL(data));
                                            connection.hypervisorUrl.protocol = "wss:";
                                        }
                                    }
                                }
                            });
                        }
                    }
                    catch (error) {
                        _logger.warn('PXPBackend- UWA URL is invalid ! (' + error + ')');
                        connection.provide = enProvideUrl.error;
                        connection.hypervisorUrl = undefined;
                    }
                }
            }
            resolve(connection);
        })
            .then((connection) => {
            if (connection.tenant !== undefined && connection.provide !== enProvideUrl.user) {
                // if Found, inject Passport URL...
                return retrieveServicesURL('3DPassport', connection.tenant).then((urlPassport) => {
                    if (urlPassport !== undefined) {
                        connection.passportUrl = urlPassport;
                    }
                    return connection;
                })
                    .catch((reason) => {
                    _logger.warn('PXPBackend- Not found PassportUrl (' + reason + ')');
                    return connection;
                });
            }
            else {
                return connection;
            }
        })
            .then((connection) => {
            if (connection.hypervisorUrl === undefined && connection.tenant !== undefined) {
                let serviceName = typeof (params === null || params === void 0 ? void 0 : params.servicesName) === 'string' ? params.servicesName : 'operationsexp';
                return retrieveServicesURL(serviceName, connection.tenant).then((url) => {
                    if (url === undefined) {
                        throw new Error("PXPBackend- Can't not retrieve service '" + serviceName + "'");
                    }
                    //--- Generate Hypervisor URL
                    let urlHypervisor = new URL('/hypervisor', url);
                    urlHypervisor.protocol = 'wss:';
                    connection.hypervisorUrl = urlHypervisor;
                    return connection;
                });
            }
            else
                return connection;
        }).then(connection => {
            var _a;
            if (connection.hypervisorUrl === undefined) {
                throw new Error("PXPBackend- Can't not retrieve hypervisor");
            }
            const Result = {
                hypervisorUrl: connection.hypervisorUrl,
                tenant: (_a = connection.tenant) !== null && _a !== void 0 ? _a : 'OnPremise',
                ...(connection.passportUrl && { passportUrl: connection.passportUrl })
            };
            return Result;
        });
    }
});
