//import i3DXCompassPlatformServices = require('DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices') // et non i3DXCompassServices !! TODO: A RETESTER !
define(["require", "exports", "DS/Logger/Logger", "DS/DELPXPFoundations/PXPRegistry", "DS/DELPXPFoundations/PXPPassport"], function (require, exports, Logger, PXPRegistry_1, PXPPassport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConnectToPXPBackend = ConnectToPXPBackend;
    var _logger = Logger.getLogger('PXP.SYS');
    async function ConnectToPXPBackend(params) {
        var _a;
        const PXP = globalThis.PXP || {};
        //@ts-ignore
        const w = (_a = params.widget) !== null && _a !== void 0 ? _a : globalThis.widget;
        // If 'widget.id' is a string, I consider the widget to be embedded in the dashboard
        const isServer = w && typeof w.id === 'string';
        let currentUrlParams = undefined; // To analyze html page parameters
        return new Promise(async (resolve, reject) => {
            var _a, _b, _c, _d, _e, _f, _g;
            var connection = {};
            // retrieve 'Informations'
            // - check url parameters...
            // - check options parameters...
            // - retrieve information from 3DRegistry
            // URL Parameters...
            const currentUrl = isServer ? w.uwaUrl : globalThis.location.href;
            if (typeof currentUrl === 'string') {
                try {
                    let url = new URL(currentUrl);
                    // Check PARAMETERS- <server>/widget.html?hypervisor=wss://127.0.0.1:2099/
                    currentUrlParams = url.searchParams;
                }
                catch (error) {
                    reject(new Error('PXPBackend- widget URL is invalid ! (' + error + ')'));
                }
            }
            // retrieve 'hypervisorUrl' -- PARAMETERS- <server>/widget.html?hypervisor=wss://127.0.0.1:2099/
            let hypervisorLocal = (_b = (_a = currentUrlParams === null || currentUrlParams === void 0 ? void 0 : currentUrlParams.get('hypervisor')) !== null && _a !== void 0 ? _a : params === null || params === void 0 ? void 0 : params.hypervisorUrl) !== null && _b !== void 0 ? _b : params === null || params === void 0 ? void 0 : params.serverUrl;
            if (hypervisorLocal) {
                try {
                    connection.hypervisorUrl = new URL(hypervisorLocal);
                }
                catch (error) {
                    reject(new Error('PXPBackend- invalid Hypervisor URL (' + hypervisorLocal + ' failed: ' + error + ')'));
                }
            }
            if (isServer) {
                // tenant: Widget
                connection.tenant = (_c = w === null || w === void 0 ? void 0 : w.getValue('x3dPlatformId')) !== null && _c !== void 0 ? _c : 'OnPremise';
                // registry: NATIVE
                connection.registryAPI = (0, PXPRegistry_1.createRegistryClient)();
                // passport: NATIVE
            }
            else {
                // tenant: Url OR options
                connection.tenant = (_e = (_d = currentUrlParams === null || currentUrlParams === void 0 ? void 0 : currentUrlParams.get('tenant')) !== null && _d !== void 0 ? _d : params === null || params === void 0 ? void 0 : params.tenant) !== null && _e !== void 0 ? _e : 'OnPremise';
                // registry: Url OR options
                let registryUrl = (_g = (_f = currentUrlParams === null || currentUrlParams === void 0 ? void 0 : currentUrlParams.get('registry')) !== null && _f !== void 0 ? _f : params === null || params === void 0 ? void 0 : params.registry) !== null && _g !== void 0 ? _g : currentUrlParams === null || currentUrlParams === void 0 ? void 0 : currentUrlParams.get('cluster');
                if (registryUrl) {
                    connection.registryAPI = (0, PXPRegistry_1.createRegistryClient)(registryUrl);
                }
                // passport: Url OR options OR Registry
                const passport = currentUrlParams === null || currentUrlParams === void 0 ? void 0 : currentUrlParams.get('passport');
                if (passport) {
                    try {
                        connection.passportUrl = passport ? new URL(passport) : undefined;
                    }
                    catch (error) {
                        throw new Error('PXPBackend- invalid Passport URL (' + passport + ' failed: ' + error + ')');
                    }
                }
            }
            resolve(connection);
        })
            .then((connection) => {
            if (connection.passportUrl === undefined && connection.tenant && connection.registryAPI) {
                // if Found, inject Passport URL...
                return connection.registryAPI.getService('3DPassport', connection.tenant).then((urlPassport) => {
                    connection.passportUrl = urlPassport;
                    return connection;
                });
            }
            return connection;
        })
            .then((connection) => {
            if (connection.passportUrl instanceof URL) {
                const api = (0, PXPPassport_1.createPassportHTTP)(connection.passportUrl);
                // Check authenticated...
                api.isAuthenticated().then((isAuth) => {
                    if (!isAuth) {
                        const user = currentUrlParams === null || currentUrlParams === void 0 ? void 0 : currentUrlParams.get('user');
                        const password = currentUrlParams === null || currentUrlParams === void 0 ? void 0 : currentUrlParams.get('password');
                        if (user && password) {
                            api.login(user, password).then(() => {
                                // login...
                                _logger.debug("PXPBackend- Login User '" + user + "'");
                                PXP.user = user;
                            });
                        }
                        else {
                            // Redirect to 3DPassport Login...
                            window.location.href = connection.passportUrl + '/login?service=' + encodeURI(window.location.href);
                        }
                    }
                    else {
                        if (PXP.debug) {
                            _logger.debug("PXPBackend- Already authenticated...");
                        }
                    }
                });
            }
            return connection;
        })
            .then((connection) => {
            if (connection.hypervisorUrl === undefined && connection.tenant && connection.registryAPI) {
                let serviceName = typeof (params === null || params === void 0 ? void 0 : params.servicesName) === 'string' ? params.servicesName : 'operationsexp';
                return connection.registryAPI.getService(serviceName, connection.tenant).then((url) => {
                    if (url === undefined) {
                        throw new Error("PXPBackend- Can't not retrieve service '" + serviceName + "'");
                    }
                    //--- Generate Hypervisor URL
                    try {
                        let urlHypervisor = new URL('/hypervisor', url);
                        urlHypervisor.protocol = 'wss:';
                        connection.hypervisorUrl = urlHypervisor;
                        return connection;
                    }
                    catch (error) {
                        throw new Error("PXPBackend- Can't not reconstruct HypervisorURL from service '" + serviceName + "'");
                    }
                });
            }
            else
                return connection;
        })
            .then((connection) => {
            var _a;
            if (connection.hypervisorUrl === undefined) {
                throw new Error("PXPBackend- Can't not retrieve hypervisor");
            }
            const Result = {
                hypervisorUrl: connection.hypervisorUrl,
                tenant: (_a = connection.tenant) !== null && _a !== void 0 ? _a : 'OnPremise',
                ...(connection.registryAPI && { registry: connection.registryAPI }),
                ...(connection.passportUrl && { passportUrl: connection.passportUrl }),
            };
            return Result;
        });
    }
});
