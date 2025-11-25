define(["require", "exports", "DS/DELPXPFoundations/PXPUtils", "../type/PXPResult", "../type/PXPError", "./BusType", "../auth/Auth", "./EndpointClientBase", "./EndpointClientCnxHttp"], function (require, exports, Utils, PXPResult_1, PXPError_1, BusType_1, Auth_1, EndpointClientBase_1, EndpointClientCnxHttp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CreateBusSessionHttp = CreateBusSessionHttp;
    //var _logger = Logger.getLogger('PXP.SYS')
    function CreateBusSessionHttp(busName, options) {
        const promise = BusSessionHttp.Create(busName, options);
        if (options.features && BusType_1.enFeaturesBusOptions.enCheckServerOnCreate == (options.features & BusType_1.enFeaturesBusOptions.enCheckServerOnCreate)) {
            return promise.then((bus) => {
                return bus.CheckServer().then((result) => {
                    if (PXPResult_1.CheckResult.isSuccess(result)) {
                        return bus;
                    }
                    else {
                        throw PXPResult_1.CheckResult.getError(result);
                    }
                });
            });
        }
        else
            return promise;
    }
    class BusSessionHttp {
        static Create(busName, options) {
            return new Promise((resolve, reject) => {
                try {
                    let bus = new BusSessionHttp(busName, options);
                    resolve(bus);
                }
                catch (error) {
                    //TODO FH6...
                    reject(error);
                }
            });
        }
        constructor(busName, options) {
            var _a;
            this.type = 'HTTP';
            this._checkBusStatus = 'not_verified';
            this.serverUrl = options.serverUrl instanceof URL ? options.serverUrl : new URL(options.serverUrl);
            this.clientName = (_a = options.clientName) !== null && _a !== void 0 ? _a : busName;
            this._onAuthentication = options.authentication || Auth_1.Auth.Default;
        }
        CreateEndpoint(endpointAddress, options) {
            let address;
            if (Utils.isString(endpointAddress)) {
                let s = endpointAddress.split('|', 2);
                address = { endpoint: s[0], identifier: s.length > 1 ? s[1] : null };
            }
            else {
                address = endpointAddress;
            }
            let defOptions = {
                ...options,
            };
            if (defOptions.authentication === undefined) {
                defOptions.authentication = this._onAuthentication;
            }
            let endpointClient = (0, EndpointClientBase_1.CreateEndpointClientBase)(this, address, defOptions);
            //endpointClient.attachOnConnectionChange((status: enConnectionStatus) => {
            //  switch (status) {
            //    case enConnectionStatus.connected:
            //      this._connectionBusStatus = enConnectionBusStatus.connected
            //      break
            //    case enConnectionStatus.disconnected:
            //      this._connectionBusStatus = enConnectionBusStatus.no_connected
            //      break
            //  }
            //});
            return endpointClient;
        }
        async ConnectToEndpoint(endpointAddress, options) {
            const endpointClient = this.CreateEndpoint(endpointAddress, options);
            return endpointClient
                .connect()
                .then(() => {
                this._checkBusStatus = 'verified';
                return endpointClient;
            })
                .catch((err) => {
                if (this._checkBusStatus === 'not_verified')
                    this._checkBusStatus = 'invalid';
                throw err;
            });
        }
        serverBusStatus() {
            return this._checkBusStatus;
        }
        async CheckServer() {
            // adjust URL if 'ws' or 'wss'
            if (!this.serverUrl) {
                return PXPResult_1.MakeResult.fail(new PXPError_1.PXPError('Failed to connect to server (url undefined)'));
            }
            let baseURL = this.serverUrl;
            switch (baseURL.protocol) {
                case 'ws:':
                    baseURL.protocol = 'http:';
                    break;
                case 'wss:':
                    baseURL.protocol = 'https:';
                    break;
                case 'http:':
                case 'https:':
                    break;
                default:
                    return PXPResult_1.MakeResult.fail(new PXPError_1.PXPError('Failed to connect to server (unsupported protocol)'));
            } //endswitch
            let checkURL = new URL('/endpoints/pingcheck', baseURL);
            return fetch(checkURL, { cache: 'no-cache', mode: 'cors', headers: { Accept: 'application/json' } })
                .then((response) => {
                if (!response.ok) {
                    this._checkBusStatus = 'invalid';
                    return PXPResult_1.MakeResult.fail(new PXPError_1.PXPError('Failed to connect to server (invalid status:' + response.statusText)); //TODO FH6: Message
                }
                return response.json();
            })
                .then((json) => {
                this._checkBusStatus = 'verified';
                return PXPResult_1.MakeResult.OK;
            })
                .catch((error) => {
                this._checkBusStatus = 'invalid';
                return PXPResult_1.MakeResult.fail(new PXPError_1.PXPError('Failed to connect to server (' + error + ')'));
            });
        }
        connectionBusStatus() {
            switch (this._checkBusStatus) {
                case 'invalid':
                    return BusType_1.enConnectionBusStatus.connection_failed;
                case 'not_verified':
                    return BusType_1.enConnectionBusStatus.no_connected;
                case 'verified':
                    return BusType_1.enConnectionBusStatus.connected;
            }
        }
        isConnected() {
            return this.connectionBusStatus() === BusType_1.enConnectionBusStatus.connected;
        }
        createEndpointClientCnx() {
            return new EndpointClientCnxHttp_1.EndpointClientCnxHttp(this);
        }
    }
});
