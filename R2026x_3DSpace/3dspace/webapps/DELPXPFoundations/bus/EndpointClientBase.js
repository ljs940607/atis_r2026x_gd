define(["require", "exports", "DS/Logger/Logger", "../event/Transport", "DS/DELPXPFoundations/PXPUtils", "./BusType", "./RequestHandler"], function (require, exports, Logger, Transport_1, Utils, BusType_1, RequestHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CreateEndpointClientBase = CreateEndpointClientBase;
    const _logger = Logger.getLogger('PXP.SYS');
    /// tranform MessageType to a Transport Message
    function createBaseMessage(content) {
        if (content == null) {
            return Transport_1.Transport.create(null);
        }
        if (content instanceof Transport_1.Transport) {
            return content;
        }
        return Transport_1.Transport.create(content);
    }
    /// check uri syntax
    function isUri(uri) {
        if (Utils.isString(uri))
            return uri.length > 2 && uri[0] === '/';
        return false;
    }
    function CreateEndpointClientBase(bus, address, options) {
        return new EndpointClientBase(bus, address, options);
    }
    class EndpointClientBase {
        constructor(bus, address, options) {
            var _a, _b, _c, _d;
            this.clientVersion = 200; // 2.00
            this.connectTimeout = 60;
            this.reconnectTimeout = 60;
            this.autoReconnectPolicies = BusType_1.enReconnectPolicies.onlyNetwork;
            /// uses to store the topics to which you are subscribed (contains the number of subscriptions).
            this._topics = new Map(); // Topics / Counter
            // uses to stores number of subscription to signal, if 0 no subscription.
            this._signal = 0;
            /// uses to stores request/response
            this._requestMap = new Map(); // CorrelationID / RequestHandler;
            this._onChangeRegistered = [];
            this._onInterceptSendMessage = [];
            this._onInterceptReceptMessage = [];
            this._onMessageRegistered = [];
            this._onError = [];
            this.serverUrl = bus.serverUrl instanceof URL ? bus.serverUrl : new URL(bus.serverUrl);
            this.clientName = (_a = options === null || options === void 0 ? void 0 : options.clientName) !== null && _a !== void 0 ? _a : bus.clientName;
            this.endpointAddress = address;
            this._impl = bus.createEndpointClientCnx();
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
        }
        _doOnError(messageError) {
            _logger.error("Client '" + this.clientName + "': " + messageError);
            this._onError.forEach((f) => {
                f(messageError);
            });
        }
        _doOnMessage(message) {
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
        _doOnInterceptReceptMessage(message) {
            return this._onInterceptReceptMessage.some((f) => BusType_1.enInterceptResult.Intercept == f(message)) ? BusType_1.enInterceptResult.Intercept : BusType_1.enInterceptResult.Continue;
        }
        _doOnInterceptSendMessage(message) {
            return this._onInterceptSendMessage.some((f) => BusType_1.enInterceptResult.Intercept == f(message)) ? BusType_1.enInterceptResult.Intercept : BusType_1.enInterceptResult.Continue;
        }
        //-------------------------
        //--- CONNECTION CHANGE
        //-------------------------
        _doHandleConnectionChange(status) {
            this.connectionStatus = status;
            this._onChangeRegistered.forEach((f) => f(status));
        }
        //-------------------------
        //--- RECEPT MESSAGE
        //-------------------------
        _doHandleMessage(message) {
            // INTERCEPT
            if (this._doOnInterceptReceptMessage(message) == BusType_1.enInterceptResult.Intercept) {
                _logger.warn('Message ' + message + ' blocked by receptMessage interceptor');
                return;
            }
            // RESPONSE
            if (message.isResponse()) {
                if (this._handleResponse(message))
                    return;
            }
            // REQUEST
            else if (message.isRequest()) {
                //if (this._handleRequest(message, origin)) return;
            }
            else {
                // SIMPLE MESSAGE
                this._doOnMessage(message);
                return;
            }
            // INVALID MESSAGE
            _logger.warn('HandlerMessage: Not supported message !');
        }
        _handleResponse(message) {
            let correlationID = message.getCorrelationID();
            if (correlationID === undefined)
                return false;
            let requestHandler = this._requestMap.get(correlationID);
            if (requestHandler === undefined)
                return false;
            let success = requestHandler.onCheckSuccess ? requestHandler.onCheckSuccess(message) : message instanceof Transport_1.Transport;
            if (success && requestHandler.onSuccess) {
                requestHandler.onSuccess(message);
            }
            else if (!success && requestHandler.onFail) {
                requestHandler.onFail(message);
            }
            else if (requestHandler.onResponse) {
                requestHandler.onResponse(message);
            }
            // cleanup
            if (message.getStatus() !== Transport_1.EventStatus.Continue) {
                this._requestMap.delete(correlationID);
            }
            return true;
        }
        //-----------------------
        //--- SEND  MESSAGE
        //-----------------------
        send(message, policies) {
            let msg = createBaseMessage(message);
            try {
                if (BusType_1.enInterceptResult.Intercept == this._doOnInterceptReceptMessage(msg)) {
                    _logger.warn('send failed: Message ' + msg + ' blocked by sendMessage interceptor');
                    return false; //OR TRUE ?
                }
                let sendMode = policies !== null && policies !== void 0 ? policies : BusType_1.enMessagePolicies.sendOnlyServer;
                if (BusType_1.enMessagePolicies.sendOnlyLocal == (sendMode & BusType_1.enMessagePolicies.sendOnlyLocal)) {
                    this._doOnMessage(msg);
                }
                if (BusType_1.enMessagePolicies.sendOnlyServer == (sendMode & BusType_1.enMessagePolicies.sendOnlyServer)) {
                    return this._impl.send(msg);
                }
                return true;
            }
            catch (err) {
                _logger.error('failed to send message: ' + err);
            }
            return false;
        }
        async publish(message, policies) {
            return new Promise((resolve, reject) => {
                let msg = createBaseMessage(message);
                try {
                    if (BusType_1.enInterceptResult.Intercept == this._doOnInterceptReceptMessage(msg)) {
                        _logger.warn('publish failed: Message ' + msg + ' blocked by sendMessage interceptor');
                        reject('Message ' + msg + ' intercepted !');
                        return;
                    }
                    if (this._impl.send(msg)) {
                        resolve();
                        return;
                    }
                    reject("failed to publish message '" + message + "' (encoding error).");
                }
                catch (err) {
                    reject("failed to publish message '" + message + "':" + err);
                }
            });
        }
        sendRequest(parameters) {
            if (!isUri(parameters.uri))
                throw new Error('sendRequest syntax error: uri is not valid. (\'{uri="/myUri"}\'');
            if (Utils.isUndefined(parameters.onResponse) && (Utils.isUndefined(parameters.onSuccess) || Utils.isUndefined(parameters.onFail)))
                throw new Error('sendRequest syntax error: no valid callback combination. if onResponse is omitted, onSuccess and onFail must both be set.');
            try {
                let myMsg = createBaseMessage(parameters.msg);
                let cid = myMsg.withHeader(Transport_1.HeaderKey.URI, parameters.uri).withCorrelationID().flagAsRequest().getCorrelationID();
                if (BusType_1.enInterceptResult.Intercept == this._doOnInterceptSendMessage(myMsg)) {
                    _logger.warn('sendrequest(' + myMsg.getUri() + ') failed: blocked by sendMessage interceptor');
                    return false; //OR TRUE ?
                }
                // store response callback
                let handler = (0, RequestHandler_1.CreateRequestHandler)(parameters);
                this._requestMap.set(cid, handler);
                if (this._impl.send(myMsg)) {
                    return true;
                }
                else {
                    _logger.log('sendRequest(' + myMsg.getUri() + ') failed: send message error');
                    return false;
                }
            }
            catch (err) {
                if (parameters.uri)
                    _logger.error('sendRequest(' + parameters.uri + ') failed:' + err);
                return false;
            }
        }
        async request(uri, message, errorPolicies) {
            if (!isUri(uri))
                throw new Error("request syntax error: uri is not valid -- Uses request('/myUri', message?)");
            return new Promise((resolve, reject) => {
                try {
                    let myMsg = createBaseMessage(message);
                    let cid = myMsg.withHeader(Transport_1.HeaderKey.URI, uri).withCorrelationID().flagAsRequest().getCorrelationID();
                    if (BusType_1.enInterceptResult.Intercept == this._doOnInterceptSendMessage(myMsg)) {
                        return reject(new Error('request("' + uri + '") failed: blocked by sendMessage interceptor'));
                    }
                    let handler = (0, RequestHandler_1.CreateRequestHandlerPromise)(resolve, reject, errorPolicies);
                    this._requestMap.set(cid, handler);
                    if (!this._impl.send(myMsg)) {
                        reject(new Error('request("' + uri + '") failed: send message error'));
                    }
                }
                catch (err) {
                    reject(new Error('request("' + uri + '") failed: ' + err));
                }
            });
        }
        async bufferedRequest(uri, message, onMessage) {
            if (!isUri(uri))
                throw new Error("request syntax error: uri is not valid -- Uses bufferedRequest('/myUri', message?)");
            return new Promise((resolve, reject) => {
                try {
                    let myMsg = createBaseMessage(message);
                    let cid = myMsg.withHeader(Transport_1.HeaderKey.URI, uri).withCorrelationID().flagAsRequest().getCorrelationID();
                    if (BusType_1.enInterceptResult.Intercept == this._doOnInterceptSendMessage(myMsg)) {
                        return reject(new Error('bufferedrequest("' + uri + '") failed: blocked by sendMessage interceptor'));
                    }
                    let handler = (0, RequestHandler_1.CreateBufferedRequestHandlerPromise)(resolve, reject, onMessage);
                    this._requestMap.set(cid, handler);
                    if (!this._impl.send(myMsg)) {
                        reject(new Error('bufferedrequest("' + uri + '") failed: send message error'));
                    }
                }
                catch (err) {
                    reject(new Error('bufferedrequest("' + uri + '") failed: ' + err));
                }
            });
        }
        async subscribeTopics(topic, force) {
            let counter = this._topics.get(topic);
            if (counter !== undefined) {
                this._topics.set(topic, ++counter);
                if (force !== true)
                    return;
            }
            else {
                this._topics.set(topic, 1);
            }
            if (this.isConnected()) {
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
                if (counter > 0 && force !== true)
                    return;
            }
            if (this.isConnected()) {
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
            if (this.isConnected()) {
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
            if (this.isConnected()) {
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
            return new Promise((resolve, reject) => {
                var _a;
                if (((_a = this.endpointAddress) === null || _a === void 0 ? void 0 : _a.endpoint) == null)
                    throw new Error('no address defined');
                if (id && this.endpointAddress.identifier !== id)
                    throw new Error('Already connected. You must disconnected endpoint before change identifier.');
                this._impl
                    .connect({
                    address: this.endpointAddress,
                    onMessage: this._doHandleMessage.bind(this),
                    onConnectionChange: this._doHandleConnectionChange.bind(this),
                    connectTimeout: this.connectTimeout,
                    reconnectPolicies: this.autoReconnectPolicies,
                    reconnectTimeout: this.reconnectTimeout,
                    onAuthentication: this._onAuthentication,
                })
                    .then(() => {
                    var _a, _b;
                    //this.connectionStatus = enConnectionStatus.connected
                    _logger.info("Client '" +
                        this.clientName +
                        "': connection etablish with server '" +
                        (((_a = this.endpointAddress) === null || _a === void 0 ? void 0 : _a.identifier) ? this.endpointAddress.endpoint + '|' + this.endpointAddress.identifier : (_b = this.endpointAddress) === null || _b === void 0 ? void 0 : _b.endpoint) +
                        "'.");
                    // send Hello steps... TODO FH6
                    return this._helloConnect();
                })
                    .then(() => {
                    // subscribe Topics & Signal...
                    this._topics.forEach((v, topic) => {
                        for (let i = 0; i < v; ++i)
                            this._subscribeTopics(topic);
                    });
                    resolve();
                })
                    .catch((reason) => {
                    var _a, _b;
                    //this.connectionStatus = enConnectionStatus.disconnected
                    _logger.error("Client '" +
                        this.clientName +
                        "': connection FAILED with node '" +
                        (((_a = this.endpointAddress) === null || _a === void 0 ? void 0 : _a.identifier) ? this.endpointAddress.endpoint + '|' + this.endpointAddress.identifier : (_b = this.endpointAddress) === null || _b === void 0 ? void 0 : _b.endpoint) +
                        "'.");
                    reject(reason);
                });
            });
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
                    //this._ready = true
                    return;
                }
                throw new Error('invalid response: [' + response.getStatus() + ']- ' + response.getContent()); //TODO ERROR
            });
        }
        disconnect() {
            //TODO PROMISE
            this._impl.disconnect();
        }
    }
});
