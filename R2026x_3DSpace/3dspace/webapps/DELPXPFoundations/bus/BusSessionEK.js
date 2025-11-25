define(["require", "exports", "DS/DELPXPFoundations/PXPUtils", "./BusType", "./EndpointClientBase", "./EndpointClientCnxEK", "../auth/Auth"], function (require, exports, Utils, BusType_1, EndpointClientBase_1, EndpointClientCnxEK_1, Auth_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CreateBusSessionEK = CreateBusSessionEK;
    //var _logger = Logger.getLogger('PXP.SYS')
    function CreateBusSessionEK(busName, options) {
        const promise = BusSessionEK.Create(busName, options);
        if (options.features && BusType_1.enFeaturesBusOptions.enCheckServerOnCreate == (options.features & BusType_1.enFeaturesBusOptions.enCheckServerOnCreate)) {
            return promise.then((bus) => {
                return bus.CheckServer().then((res) => {
                    return bus;
                });
            });
        }
        else
            return promise;
    }
    class BusSessionEK {
        static Create(busName, options) {
            return new Promise((resolve, reject) => {
                try {
                    let bus = new BusSessionEK(busName, options);
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
            this.type = 'EK';
            this._checkBusStatus = 'not_verified';
            this.serverUrl = options.serverUrl instanceof URL ? options.serverUrl : new URL(options.serverUrl);
            this.clientName = (_a = options.clientName) !== null && _a !== void 0 ? _a : busName;
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
        serverBusStatus() {
            return this._checkBusStatus;
        }
        // uses to update '_checkBusStatus' - 
        _updateCheckOnConnectionChange(status) {
            switch (status) {
                case BusType_1.enConnectionStatus.connected:
                    this._checkBusStatus = 'verified';
                    break;
            }
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
            // attach to update 'verified'...
            if (this._checkBusStatus != 'verified') {
                endpointClient.attachOnConnectionChange(this._updateCheckOnConnectionChange.bind(this));
            }
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
            //endpointClient.attachOnConnectionChange((status: enConnectionStatus) => {
            //  switch (status) {
            //    case enConnectionStatus.connected:
            //      this._checkBusStatus = enConnectionBusStatus.connected
            //      break
            //    case enConnectionStatus.disconnected:
            //      this._checkBusStatus = enConnectionBusStatus.no_connected
            //      break
            //  }
            //});
            return endpointClient;
        }
        async ConnectToEndpoint(endpointAddress, options) {
            const endpointClient = this.CreateEndpoint(endpointAddress, options);
            return endpointClient.connect().then(() => {
                //this._checkBusStatus = 'verified'
                return endpointClient;
            });
        }
        isConnected() {
            return this.connectionBusStatus() === BusType_1.enConnectionBusStatus.connected;
        }
        /** Check Server
         * @param timeout Timeout by defaut 1 min (60000ms)
         * @returns Promise with { ok= true } if server responds.
         */
        async CheckServer(timeout = 60000) {
            let onConnectionChange = (status) => {
                if (BusType_1.enConnectionStatus.connected === status) {
                    this._checkBusStatus = 'verified';
                }
                if (this._onHypervisorConnectionChange)
                    this._onHypervisorConnectionChange(status);
            };
            return (0, EndpointClientCnxEK_1.CheckServerEK)(this, timeout, onConnectionChange);
        }
        createEndpointClientCnx() {
            return new EndpointClientCnxEK_1.EndpointClientCnxEK(this);
        }
    }
});
