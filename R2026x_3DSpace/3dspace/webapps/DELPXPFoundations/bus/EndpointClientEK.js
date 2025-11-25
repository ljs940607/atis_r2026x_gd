define(["require", "exports", "DS/Logger/Logger", "../type/PXPError", "../event/Transport", "./BusType", "./ClientNodeEK"], function (require, exports, Logger, PXPError_1, Transport_1, BusType_1, ClientNodeEK_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CreateEndpointClientEK = CreateEndpointClientEK;
    var _logger = Logger.getLogger('PXP.SYS');
    function CreateEndpointClientEK(busInfo, address, options) {
        return EndpointClientEKImpl.Create(busInfo, address, options);
    }
    class EndpointClientEKImpl {
        static Create(busSession, address, options) {
            return new EndpointClientEKImpl(busSession, address, options);
        }
        constructor(busSession, address, options) {
            var _a, _b, _c, _d;
            this.clientVersion = 200; // 2.00
            this.connectTimeout = 60;
            this.reconnectTimeout = 60;
            this.autoReconnectPolicies = BusType_1.enReconnectPolicies.onlyNetwork;
            this._nodeClient = null;
            this._signal = 0;
            this._onChangeRegistered = [];
            this._onInterceptSendMessage = [];
            this._onInterceptReceptMessage = [];
            this._onMessageRegistered = [];
            this._onError = [];
            this._stop = false;
            this._ready = false; // TODO FH6... Ready when Validate OK...
            this.serverUrl = busSession.serverUrl instanceof URL ? busSession.serverUrl : new URL(busSession.serverUrl);
            this.clientName = (_a = options === null || options === void 0 ? void 0 : options.clientName) !== null && _a !== void 0 ? _a : busSession.clientName;
            this.endpointAddress = address;
            if (options) {
                this.autoReconnectPolicies = (_b = options.reconnectPolicies) !== null && _b !== void 0 ? _b : BusType_1.enReconnectPolicies.onlyNetwork;
                this.reconnectTimeout = (_c = options.reconnectTimeout) !== null && _c !== void 0 ? _c : 60;
                this.connectTimeout = (_d = options.connectTimeout) !== null && _d !== void 0 ? _d : 60;
                if (options.onChange) {
                    this._onChangeRegistered.push(options.onChange);
                }
                if (options.onError) {
                    this._onError.push(options.onError);
                }
                if (options.onMessage) {
                    this.attachOnMessage(options.onMessage);
                }
                if (options.authentication) {
                    this._onAuthentication = options.authentication;
                }
            }
            this.connectionStatus = BusType_1.enConnectionStatus.no_connected;
            this._nodeId = null;
            this._topics = new Map();
            // onConnection change when connection is etablish... (not uses for first connection !)
            // using variable because nodId.onChange uses callback to remove...
            this._onEKChange = (from, pool) => {
                let status = from.getStatus();
                this.connectionStatus = status;
                switch (status) {
                    case BusType_1.enConnectionStatus.connected:
                        _logger.info("EnpointClient '" + pool + "'- connected");
                        this._onChangeRegistered.forEach((f) => f(BusType_1.enConnectionStatus.connected));
                        break;
                    case BusType_1.enConnectionStatus.pending:
                        _logger.info("EnpointClient '" + pool + "'- pending");
                        this._onChangeRegistered.forEach((f) => f(BusType_1.enConnectionStatus.pending));
                        break;
                    case BusType_1.enConnectionStatus.disconnected:
                        this._onChangeRegistered.forEach((f) => f(BusType_1.enConnectionStatus.disconnected));
                        if (BusType_1.enReconnectPolicies.no !== this.autoReconnectPolicies && !this._stop && this._ready) {
                            if (navigator.onLine) { // two stragegies: browser offline OR not.
                                _logger.info("EnpointClient '" + pool + "'- disconnected - Try to reconnect...");
                                setTimeout(() => this._reconnect());
                            }
                            else {
                                _logger.info("EnpointClient '" + pool + "'- disconnected - Browser Offline...");
                                setTimeout(() => this._reconnectOffLine());
                            }
                        }
                        else {
                            _logger.info("EnpointClient '" + pool + "'- disconnected");
                        }
                        break;
                }
            };
        }
        async _createNodeClient(onHypervisorConnectionChange) {
            return new Promise((resolve, reject) => {
                // Two modes: if 'callback' onHypervisorConnect is defined the server is validated, otherwise the server is configured (but not check !)
                let handlers = {
                    onError: (msg) => {
                        if (this.connectionStatus === BusType_1.enConnectionStatus.no_connected)
                            reject(new PXPError_1.PXPError(msg));
                    },
                    ...(onHypervisorConnectionChange && {
                        onHypervisorConnect: () => {
                            resolve();
                            onHypervisorConnectionChange(BusType_1.enConnectionStatus.connected);
                        },
                    }),
                    ...(onHypervisorConnectionChange && {
                        onHypervisorDisconnect: () => {
                            onHypervisorConnectionChange(BusType_1.enConnectionStatus.disconnected);
                        },
                    }),
                    onMessage: this._bindOnMessage.bind(this),
                    onInterceptReceptMessage: this._bindOnInterceptReceptMessage.bind(this),
                    onInterceptSendMessage: this._bindOnInterceptSendMessage.bind(this),
                    ...(this._onAuthentication && { onAuth: this._onAuthentication.bind(this) }),
                };
                this._nodeClient = new ClientNodeEK_1.ClientNodeBase(this.clientName, this.serverUrl, handlers);
                if (!onHypervisorConnectionChange)
                    setTimeout(() => resolve());
            }).then(() => {
                var _a;
                (_a = this._nodeClient) === null || _a === void 0 ? void 0 : _a.assignOnError(this._bindOnError.bind(this));
                return;
            });
        }
        _bindOnError(messageError) {
            _logger.error("Client '" + this.clientName + "': " + messageError);
            this._onError.forEach((f) => {
                f(messageError);
            });
        }
        //private _bindOnHypervisorConnect() {
        //  _logger.error("Client '" + this.clientName + "': Hypervisor connect")
        //}
        //private _bindOnHypervisorDisconnect() {
        //  _logger.error("Client '" + this.clientName + "': Hypervisor disconnect")
        //}
        _bindOnMessage(message) {
            this._onMessageRegistered.forEach((record) => {
                if (record.onAcceptFilter) {
                    if (record.onAcceptFilter(message))
                        record.onMessage(message);
                }
                else {
                    record.onMessage(message);
                }
            });
        }
        _bindOnInterceptReceptMessage(message) {
            return this._onInterceptReceptMessage.some((f) => BusType_1.enInterceptResult.Intercept == f(message)) ? BusType_1.enInterceptResult.Intercept : BusType_1.enInterceptResult.Continue;
        }
        _bindOnInterceptSendMessage(message) {
            return this._onInterceptSendMessage.some((f) => BusType_1.enInterceptResult.Intercept == f(message)) ? BusType_1.enInterceptResult.Intercept : BusType_1.enInterceptResult.Continue;
        }
        send(message, policies) {
            if (this._nodeClient == null)
                return false; //throw new Error("no client");
            let sendMode = policies !== null && policies !== void 0 ? policies : BusType_1.enMessagePolicies.sendOnlyServer;
            if (BusType_1.enMessagePolicies.sendOnlyLocal == (sendMode & BusType_1.enMessagePolicies.sendOnlyLocal)) {
                this._nodeClient.directSend(message);
            }
            if (BusType_1.enMessagePolicies.sendOnlyServer == (sendMode & BusType_1.enMessagePolicies.sendOnlyServer)) {
                if (this._nodeId == null)
                    return false; //throw new Error("no connection");
                return this._nodeClient.send(this._nodeId, message);
            }
            return true;
        }
        async publish(message, policies) {
            if (this._nodeClient == null)
                throw new Error('no client');
            if (this._nodeId == null)
                throw new Error('no connection');
            return this._nodeClient.publish(this._nodeId, message);
        }
        sendRequest(parameters) {
            if (this._nodeClient == null)
                return false; //throw new Error("no client");
            if (this._nodeId == null)
                return false; //throw new Error("no connection");
            return this._nodeClient.sendRequest(this._nodeId, parameters);
        }
        async request(uri, message, errorPolicies) {
            if (this._nodeClient == null)
                throw new Error('no client');
            if (this._nodeId == null)
                throw new Error('no connection');
            return this._nodeClient.request(this._nodeId, uri, message, errorPolicies);
        }
        async bufferedRequest(uri, message, onMessage) {
            if (this._nodeClient == null)
                throw new Error('no client');
            if (this._nodeId == null)
                throw new Error('no connection');
            return this._nodeClient.bufferedRequest(this._nodeId, uri, message, onMessage);
        }
        async subscribeTopics(topic, force) {
            let counter = this._topics.get(topic);
            if (counter !== undefined) {
                this._topics.set(topic, ++counter);
                if (force !== true)
                    return;
            }
            if (this._nodeId == null) {
                // not connected...
                this._topics.set(topic, 1);
            }
            else {
                // connected
                await this._subscribeTopics(topic);
            }
        }
        async _subscribeTopics(topic) {
            return this.request('/pxpsrv/v1/topics/subscribe/' + topic)
                .then((res) => {
                this._topics.set(topic, 1);
            })
                .catch((reason) => {
                _logger.error("Client '" + this.clientName + "': subscribe topic '" + topic + "' failed.");
            });
        }
        async unsubscribeTopics(topic, force) {
            let counter = this._topics.get(topic);
            if (counter === undefined) {
                if (force !== true)
                    return;
            }
            else {
                this._topics.set(topic, --counter);
                if (counter === 0)
                    this._topics.delete(topic);
            }
            if (this._nodeId != null) {
                await this._unsubscribeTopics(topic);
            }
        }
        async _unsubscribeTopics(topic) {
            return this.request('/pxpsrv/v1/topics/unsubscribe/' + topic)
                .then((res) => {
                this._topics.delete(topic);
            })
                .catch((reason) => {
                _logger.error("Client '" + this.clientName + "': unsubscribe topic '" + topic + "' failed.");
            });
        }
        async subscribeSignal(force) {
            ++this._signal;
            if (this._signal > 1 && force !== true)
                return;
            if (this._nodeId != null) {
                await this._subscribeSignal();
            }
        }
        async _subscribeSignal() {
            return this.request('/pxpsrv/v1/signal/on')
                .then((res) => {
                this._topics.set(Transport_1.KeySignal, 1);
            })
                .catch((reason) => {
                _logger.error("Client '" + this.clientName + "': subscribe signal failed.");
            });
        }
        async unsubscribeSignal(force) {
            if (this._signal > 0)
                --this._signal;
            if (this._signal > 0 && force !== true)
                return;
            if (this._nodeId != null) {
                await this._unsubscribeSignal();
            }
        }
        _unsubscribeSignal() {
            return this.request('/pxpsrv/v1/signal/off')
                .then((res) => {
                this._signal = 0;
            })
                .catch((reason) => {
                _logger.error("Client '" + this.clientName + "': unsubscribe signal failed.");
            });
        }
        attachOnMessage(onMessage, onAcceptFilter, key, info) {
            if (typeof onMessage === 'function')
                this._onMessageRegistered.push({
                    onMessage: onMessage,
                    ...(key && { key: key }),
                    ...(typeof onAcceptFilter === 'function' && { onAcceptFilter: onAcceptFilter }),
                    ...(info && { info: info }),
                });
        }
        detachOnMessage(itemToRemove) {
            if (typeof itemToRemove === 'string') {
                this._onMessageRegistered = this._onMessageRegistered.filter((record) => record.key !== itemToRemove);
            }
            else {
                this._onMessageRegistered = this._onMessageRegistered.filter((record) => record.onMessage !== itemToRemove);
            }
        }
        detachAllOnMessage() {
            this._onMessageRegistered = [];
        }
        attachOnInterceptReceptMessage(onMessageHandler) {
            this._onInterceptReceptMessage.push(onMessageHandler);
        }
        detachOnInterceptReceptMessage(onMessageHandler) {
            if (typeof onMessageHandler === 'function')
                this._onInterceptReceptMessage = this._onInterceptReceptMessage.filter(function (callback) {
                    return callback !== onMessageHandler;
                });
        }
        detachAllOnInterceptReceptMessage() {
            this._onInterceptReceptMessage = [];
        }
        attachOnInterceptSendMessage(onMessageHandler) {
            this._onInterceptSendMessage.push(onMessageHandler);
        }
        detachOnInterceptSendMessage(onMessageHandler) {
            if (typeof onMessageHandler === 'function')
                this._onInterceptSendMessage = this._onInterceptSendMessage.filter(function (callback) {
                    return callback !== onMessageHandler;
                });
        }
        detachAllOnInterceptSendMessage() {
            this._onInterceptSendMessage = [];
        }
        attachOnError(onError) {
            if (typeof onError === 'function')
                this._onError.push(onError);
        }
        detachOnError(onError) {
            if (typeof onError === 'function')
                this._onError = this._onError.filter(function (callback) {
                    return callback !== onError;
                });
        }
        detachAllOnError() {
            this._onError = [];
        }
        attachOnConnectionChange(onChange) {
            if (typeof onChange === 'function')
                this._onChangeRegistered.push(onChange);
        }
        detachOnConnectionChange(onChange) {
            if (typeof onChange === 'function')
                this._onChangeRegistered = this._onChangeRegistered.filter(function (callback) {
                    return callback !== onChange;
                });
        }
        detachAllOnConnectionChange() {
            this._onChangeRegistered = [];
        }
        isConnected() {
            return this.connectionStatus == BusType_1.enConnectionStatus.connected;
        }
        async connect(id) {
            if (this._nodeClient == null) {
                return this._createNodeClient().then(() => {
                    return this._connect(id);
                });
            }
            else {
                return this._connect(id);
            }
        }
        async _connect(id) {
            return new Promise((resolve, reject) => {
                var _a;
                if (this._nodeClient == null)
                    throw new Error('no client');
                if (((_a = this.endpointAddress) === null || _a === void 0 ? void 0 : _a.endpoint) == null)
                    throw new Error('no address defined');
                //@ts-ignore - FIX EK- 'NodeId' - missing 'isConnected()'
                if (this._nodeId && this._nodeId.isConnected()) {
                    if (id && this.endpointAddress.identifier !== id)
                        throw new Error('Already connected. You must disconnected endpoint before change identifier.');
                    resolve();
                    return;
                }
                // connect...
                this._nodeClient
                    .connect(this.endpointAddress, this.connectTimeout)
                    .then((nodeId) => {
                    var _a, _b;
                    this._nodeId = nodeId;
                    this.connectionStatus = BusType_1.enConnectionStatus.connected;
                    _logger.info("Client '" +
                        this.clientName +
                        "': connection etablish with node '" +
                        (((_a = this.endpointAddress) === null || _a === void 0 ? void 0 : _a.identifier) ? this.endpointAddress.endpoint + '|' + this.endpointAddress.identifier : (_b = this.endpointAddress) === null || _b === void 0 ? void 0 : _b.endpoint) +
                        "'.");
                    this._onChangeRegistered.forEach((f) => f(BusType_1.enConnectionStatus.connected));
                    this._registeredOnChange();
                    // send Hello steps... TODO FH6
                    this._helloConnect();
                    // subscribe Topics & Signal...
                    this._topics.forEach((v, topic) => {
                        for (let i = 0; i < v; ++i)
                            this._subscribeTopics(topic);
                    });
                    resolve();
                })
                    .catch((reason) => {
                    var _a, _b;
                    //@ts-ignore - FIX EK- 'NodeId' - missing 'isConnected()'
                    this.connectionStatus = this._nodeId && this._nodeId.isConnected() ? BusType_1.enConnectionStatus.connected : BusType_1.enConnectionStatus.disconnected;
                    _logger.error("Client '" +
                        this.clientName +
                        "': connection FAILED with node '" +
                        (((_a = this.endpointAddress) === null || _a === void 0 ? void 0 : _a.identifier) ? this.endpointAddress.endpoint + '|' + this.endpointAddress.identifier : (_b = this.endpointAddress) === null || _b === void 0 ? void 0 : _b.endpoint) +
                        "'.");
                    reject(reason);
                });
            });
        }
        _registeredOnChange() {
            var _a;
            (_a = this._nodeId) === null || _a === void 0 ? void 0 : _a.onStatusChange(this._onEKChange);
        }
        _unregisteredOnChange() {
            var _a;
            //@ts-ignore - EK Missing signature on 'NodeId'
            (_a = this._nodeId) === null || _a === void 0 ? void 0 : _a.unregisterStatusChange(this._onEKChange);
        }
        _reconnect() {
            if (this._nodeClient == null)
                throw new Error('no client');
            if (this.endpointAddress == null)
                throw new Error('no address defined');
            //@ts-ignore - FIX EK- 'NodeId' - missing 'isConnected()'
            if (this._nodeId.isConnected()) {
                return;
            }
            this._unregisteredOnChange();
            this._nodeClient.connect(this.endpointAddress, this.reconnectTimeout, BusType_1.enReconnectPolicies.all != this.autoReconnectPolicies).then((nodeId) => {
                this._nodeId = nodeId;
                this._onChangeRegistered.forEach((f) => f(BusType_1.enConnectionStatus.connected));
                this._registeredOnChange(); // reinject handler...
                //TODO FH6: Subscribe Topics & Signal... (if necessary... mode )
            });
        }
        _reconnectOffLine() {
            // Try to reconnect when the browser is back online...
            window.addEventListener("online", this._reconnectOnLine.bind(this));
        }
        _reconnectOnLine(e) {
            var _a;
            // Try to reconnect when the browser is back online... (call by event 'online')
            window.removeEventListener("online", this._reconnectOnLine);
            _logger.info("Browser is back onLine - Try to reconnect to node " + ((_a = this.endpointAddress) === null || _a === void 0 ? void 0 : _a.endpoint));
            this._reconnect();
        }
        async _helloConnect() {
            // hello
            let event = new Transport_1.Transport(Transport_1.EventType.empty, null).withHeaders({
                clientName: this.clientName,
                clientType: 'ts',
                clientVersion: this.clientVersion,
            });
            //if (false) {
            //  p = generateTGT().then((tgt) => {
            //    event.withHeaders({ 'tgt': tgt });
            //    return Promise.resolve();
            //  });
            //} else {
            //  p = Promise.resolve();
            //}
            return this.request('/pxpsrv/v1/hello', event).then((response) => {
                if (!response.isStatusError()) {
                    _logger.info('webclient identified as ' + response.getContent() + ' by server...');
                    this._ready = true;
                    return;
                }
                throw new Error('invalid response: [' + response.getStatus() + ']- ' + response.getContent()); //TODO ERROR
            });
        }
        disconnect() {
            if (this._nodeClient == null)
                return;
            if (this._nodeId == null)
                return;
            this._stop = true;
            this._ready = false;
            this._nodeId.close();
        }
    }
});
