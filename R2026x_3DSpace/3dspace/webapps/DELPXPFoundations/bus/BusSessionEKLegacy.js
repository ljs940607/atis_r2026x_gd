define(["require", "exports", "DS/DELPXPFoundations/PXPUtils", "../type/PXPResult", "./BusType", "./EndpointClientEK", "../auth/Auth"], function (require, exports, Utils, PXPResult_1, BusType_1, EndpointClientEK_1, Auth_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CreateBusSessionEKLegacy = CreateBusSessionEKLegacy;
    exports.CreateBusSession = CreateBusSession;
    //var _logger = Logger.getLogger('PXP.SYS')
    function CreateBusSessionEKLegacy(busName, options) {
        const promise = BusSessionEKLegacy.Create(busName, options);
        if (options.features &&
            BusType_1.enFeaturesBusOptions.enCheckHypervisorConnectionOnCreate == (options.features & BusType_1.enFeaturesBusOptions.enCheckHypervisorConnectionOnCreate)) {
            return promise.then((bus) => {
                return bus.checkHypervisorConnection().then(() => {
                    return bus;
                });
            });
        }
        else
            return promise;
    }
    function CreateBusSession(busName, options) {
        return CreateBusSessionEKLegacy(busName, options);
    }
    class BusSessionEKLegacy {
        static Create(busName, options) {
            return new Promise((resolve, reject) => {
                try {
                    let bus = new BusSessionEKLegacy(busName, options);
                    resolve(bus);
                }
                catch (error) {
                    //TODO FH6...
                    reject(error);
                }
            });
        }
        //private _protocol: IProtocol = JSONv2.Protocol;
        constructor(busName, options) {
            var _a;
            this.type = 'EK.legacy';
            this.serverUrl = options.serverUrl instanceof URL ? options.serverUrl : new URL(options.serverUrl);
            this.clientName = (_a = options.clientName) !== null && _a !== void 0 ? _a : busName;
            this._connectionBusStatus = BusType_1.enConnectionBusStatus.no_connected;
            this._onAuthentication = options.authentication || Auth_1.Auth.Default;
            this._onInterceptSendMessage = options.onInterceptSendMessage; // Intercept message before send
            this._onInterceptReceptMessage = options.onInterceptReceptMessage; // Intercept message before recept
            this._onMessageHandler = options.onMessage; // Global message reception...
            this._onObsoleteStatusChange = options.onStatusChange;
            if (options.onHypervisorConnectionChange || options.onStatusChange) {
                this._onHypervisorConnectionChange =
                    options.onHypervisorConnectionChange !== undefined
                        ? options.onHypervisorConnectionChange
                        : (status) => {
                            switch (status) {
                                case BusType_1.enConnectionStatus.connected:
                                    if (options.onStatusChange)
                                        options.onStatusChange('hypervisor', BusType_1.enObsoleteBusStatus.Connected);
                                    break;
                                case BusType_1.enConnectionStatus.disconnected:
                                    if (options.onStatusChange)
                                        options.onStatusChange('hypervisor', BusType_1.enObsoleteBusStatus.Disconnected);
                                    break;
                            }
                        };
            }
            //this._protocol = options.protocol;
        }
        connectionBusStatus() {
            return this._connectionBusStatus;
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
            let endpointClient = (0, EndpointClientEK_1.CreateEndpointClientEK)({ serverUrl: this.serverUrl, clientName: this.clientName }, address, defOptions);
            // attach callback 'global'
            if (this._onInterceptReceptMessage)
                endpointClient.attachOnInterceptReceptMessage(this._onInterceptReceptMessage.bind(this));
            if (this._onInterceptSendMessage)
                endpointClient.attachOnInterceptSendMessage(this._onInterceptSendMessage.bind(this));
            if (this._onMessageHandler)
                endpointClient.attachOnMessage(this._onMessageHandler.bind(this));
            if (this._onObsoleteStatusChange)
                endpointClient.attachOnConnectionChange((status) => {
                    switch (status) {
                        case BusType_1.enConnectionStatus.connected:
                            if (this._onObsoleteStatusChange)
                                this._onObsoleteStatusChange(address.endpoint, BusType_1.enObsoleteBusStatus.Connected);
                            break;
                        case BusType_1.enConnectionStatus.disconnected:
                            if (this._onObsoleteStatusChange)
                                this._onObsoleteStatusChange(address.endpoint, BusType_1.enObsoleteBusStatus.Disconnected, address.identifier || undefined);
                            break;
                    }
                });
            endpointClient.attachOnConnectionChange((status) => {
                switch (status) {
                    case BusType_1.enConnectionStatus.connected:
                        this._connectionBusStatus = BusType_1.enConnectionBusStatus.connected;
                        break;
                    case BusType_1.enConnectionStatus.disconnected:
                        this._connectionBusStatus = BusType_1.enConnectionBusStatus.no_connected;
                        break;
                }
            });
            return endpointClient;
        }
        async ConnectToEndpoint(endpointAddress, options) {
            let endpointClient = this.CreateEndpoint(endpointAddress, options);
            return endpointClient
                ._createNodeClient(this._onHypervisorConnectionChange)
                .then(() => {
                this._connectionBusStatus = BusType_1.enConnectionBusStatus.connected; //TODO FH6: Renommage connected => ready
                let doConnect = (options === null || options === void 0 ? void 0 : options.autoConnectPolicies) === undefined ? true : options.autoConnectPolicies === BusType_1.enAutoConnectPolicies.atCreate;
                if (doConnect) {
                    return endpointClient.connect().then(() => {
                        //_logger.debug("Connection OK");
                        return endpointClient;
                    });
                }
                else {
                    // not connected...
                    return endpointClient;
                }
            })
                .catch((error) => {
                this._connectionBusStatus = BusType_1.enConnectionBusStatus.connection_failed;
                throw error;
            });
        }
        /**
         * Update server status.
         * @deprecated uses CheckServer()
         * @returns a promise
         */
        async checkHypervisorConnection() {
            return this.CheckServer()
                .then((result) => {
                if (PXPResult_1.CheckResult.isSuccess(result)) {
                    this._connectionBusStatus = BusType_1.enConnectionBusStatus.connected;
                    return;
                }
                else {
                    this._connectionBusStatus = BusType_1.enConnectionBusStatus.connection_failed;
                    throw PXPResult_1.CheckResult.getError(result);
                }
            });
        }
        isConnected() {
            return this._connectionBusStatus === BusType_1.enConnectionBusStatus.connected;
        }
        serverBusStatus() {
            switch (this._connectionBusStatus) {
                case BusType_1.enConnectionBusStatus.connected:
                    return 'verified';
                case BusType_1.enConnectionBusStatus.connection_failed:
                    return 'invalid';
                case BusType_1.enConnectionBusStatus.no_connected:
                default:
                    return 'not_verified';
            }
        }
        async CheckServer() {
            let endpointClient = (0, EndpointClientEK_1.CreateEndpointClientEK)({
                serverUrl: this.serverUrl,
                clientName: 'CheckHypervisor',
            });
            const onHypervisorChange = this._onHypervisorConnectionChange ? this._onHypervisorConnectionChange : (status) => { };
            return endpointClient
                ._createNodeClient(onHypervisorChange)
                .then(() => {
                // ok
                return PXPResult_1.MakeResult.OK;
            })
                .catch((error) => {
                return PXPResult_1.MakeResult.fail(error);
            });
        }
        createEndpointClientCnx() {
            throw new Error('Method not implemented.');
        }
    }
});
