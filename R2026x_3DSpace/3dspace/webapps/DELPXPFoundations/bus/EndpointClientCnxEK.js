define(["require", "exports", "../type/PXPResult", "../type/PXPError", "DS/ExperienceKernel/ExperienceKernel", "DS/Logger/Logger", "../protocol/ProtocolJSONv2", "./BusType"], function (require, exports, PXPResult_1, PXPError_1, EK, Logger, ProtocolJSONv2_1, BusType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EndpointClientCnxEK = void 0;
    exports.CheckServerEK = CheckServerEK;
    let _logger = Logger.getLogger('PXP.SYS');
    function CheckServerEK(bus, timeout, onHypervisorChange) {
        const promise = new Promise((resolve, reject) => {
            let config = {
                hypervisorUrl: bus.serverUrl.toString(),
                pool: 'CheckClient',
                onError: (msg) => {
                    _logger.info('EK-CheckServer: ' + config.hypervisorUrl + ' - Error: ' + msg);
                    reject(PXPResult_1.MakeResult.fail(new PXPError_1.PXPError(msg)));
                },
                canDisconnectFromHypervisor: false,
                onHypervisorConnect: () => {
                    _logger.info('EK-CheckServer: ' + config.hypervisorUrl + ' - Hypervisor connect');
                    if (onHypervisorChange)
                        onHypervisorChange(BusType_1.enConnectionStatus.connected);
                    resolve(PXPResult_1.MakeResult.OK);
                },
                onHypervisorDisconnect: () => {
                    _logger.debug('EK-CheckServer: ' + config.hypervisorUrl + ' - Hypervisor disconnect');
                    if (onHypervisorChange)
                        onHypervisorChange(BusType_1.enConnectionStatus.disconnected);
                    reject(PXPResult_1.MakeResult.fail(new PXPError_1.PXPError('Hypervisor disconnect')));
                },
            };
            const clientNode = new EK.Node(config);
            clientNode.stop();
        });
        const promiseTimeOut = new Promise((_r, reject) => setTimeout(() => {
            reject(PXPResult_1.MakeResult.fail(new PXPError_1.PXPError('CheckServer failed- The server did not respond (timeout)')));
        }, timeout));
        return Promise.race([promise, promiseTimeOut]);
    }
    class EndpointClientCnxEK {
        constructor(bus) {
            this._protocol = ProtocolJSONv2_1.JSONv2.Protocol;
            this._node = null;
            this._nodeId = null;
            this.clientName = bus.clientName;
            this.serverUrl = bus.serverUrl;
        }
        _onText(input, origin) {
            if (!this._protocol.isText) {
                _logger.warn("Protocol is 'binary' but recept message as 'text'");
            }
            // DECODE
            let message = this._protocol.decode(input);
            if (message !== undefined) {
                this._onMessage(message);
                return true;
            }
            return false;
        }
        _onBinary(input, origin) {
            // Unsupported...
            return false;
        }
        _onMessage(msg) {
            if (this._onMessageCB) {
                this._onMessageCB(msg);
            }
        }
        _onEKConnectionChange(from, pool) {
            if (this._onConnectionChangeCB) {
                let status = from.getStatus();
                switch (status) {
                    case EK.Status.connected: {
                        this._onConnectionChangeCB(BusType_1.enConnectionStatus.connected);
                        break;
                    }
                    case EK.Status.pending: {
                        this._onConnectionChangeCB(BusType_1.enConnectionStatus.pending);
                        break;
                    }
                    case EK.Status.disconnected: {
                        this._onConnectionChangeCB(BusType_1.enConnectionStatus.disconnected);
                        break;
                    }
                }
            }
        }
        connect({ address, onMessage, onConnectionChange, connectTimeout, reconnectPolicies, reconnectTimeout, onAuthentication }) {
            const onlyNetwork = false;
            const timeoutConnection = connectTimeout;
            this._onMessageCB = onMessage;
            this._onConnectionChangeCB = onConnectionChange;
            let onChangeAtStart;
            return new Promise((resolve, reject) => {
                let nodeId;
                if (this._node != null) {
                    reject(new Error("Endpoint Client '" +
                        this.clientName +
                        "'@'" +
                        (address.identifier ? address.endpoint + '|' + address.identifier : address.endpoint) +
                        "' already connected !"));
                }
                let _firstConnect = true;
                let config = {
                    hypervisorUrl: this.serverUrl.toString(),
                    pool: this.clientName,
                    onText: this._onText.bind(this),
                    onBinary: this._onBinary.bind(this),
                    onError: (error) => {
                        if (error.startsWith("Can't connect to the Hypervisor") && _firstConnect) {
                            reject(new Error("Endpoint Client '" + this.clientName + "' - failed to connect (server do not respond at " + this.serverUrl + ').'));
                        }
                        else {
                            _logger.warn("Endpoint Client '" + this.clientName + "': " + error);
                        }
                    },
                    ...(onAuthentication && {
                        authentication: (credentials, onSuccess, onError) => {
                            _logger.info("Endpoint Client '" + this.clientName + "'- authentication '" + credentials.forWho + "' -- PassportURL: " + credentials.passportURL);
                            this._passportUrl = credentials.passportURL; //save URL provide by EK...
                            if (onAuthentication)
                                onAuthentication(credentials, onSuccess, onError);
                        },
                    }),
                    //...(handlers.onDisconnect && { onDisconnect: handlers.onDisconnect }),
                    //...(!canDisconnectFromHypervisor && {
                    //  canDisconnectFromHypervisor: canDisconnectFromHypervisor,
                    //  onHypervisorConnect: this._bindHypervisorConnect.bind(this),
                    //  onHypervisorDisconnect: this._bindHypervisorDisconnect.bind(this),
                    //}),
                };
                this._node = new EK.Node(config);
                let nodePool = this._node.connect(address.endpoint);
                let criterion;
                if (address.identifier == null) {
                    criterion = EK.Criterion.timeout(timeoutConnection);
                }
                else {
                    criterion = EK.Criterion.identifier(address.identifier).withTimeout(timeoutConnection);
                }
                if (onlyNetwork)
                    criterion.withoutProcessCreation();
                nodeId = nodePool.select(criterion);
                onChangeAtStart = (from, pool) => {
                    let status = from.getStatus();
                    switch (status) {
                        case EK.Status.connected: {
                            if (_firstConnect) {
                                _logger.debug("Node '" + this.clientName + "'@'" + pool + "'- started !");
                                resolve(nodeId);
                                _firstConnect = false;
                            }
                            else {
                                _logger.info("Node '" + this.clientName + "'@'" + pool + "'- Connected");
                            }
                            break;
                        }
                        case EK.Status.pending: {
                            _logger.info("Node '" + this.clientName + "'@'" + pool + "'- status change: pending");
                            break;
                        }
                        case EK.Status.disconnected: {
                            if (_firstConnect) {
                                _logger.info("Node '" + this.clientName + "'@'" + pool + "'- Timeout");
                                // call connection status => disconnected
                                if (this._onConnectionChangeCB) {
                                    this._onConnectionChangeCB(BusType_1.enConnectionStatus.disconnected);
                                }
                                reject(new Error("Endpoint Client '" +
                                    this.clientName +
                                    "'@'" +
                                    (address.identifier ? address.endpoint + '|' + address.identifier : address.endpoint) +
                                    "': failed to connect. (timeout)"));
                            }
                            else {
                                _logger.info("Node '" + this.clientName + "'@'" + pool + "'- Disconnected");
                            }
                            break;
                        }
                    }
                };
                nodeId.onStatusChange(onChangeAtStart);
            })
                .then((nodeId) => {
                this._nodeId = nodeId;
                // call connection status => Connected
                if (this._onConnectionChangeCB)
                    this._onConnectionChangeCB(BusType_1.enConnectionStatus.connected);
                //@ts-ignore - EK Missing signature on 'NodeId'
                nodeId.unregisterStatusChange(onChangeAtStart);
                return nodeId;
            })
                .then((nodeId) => {
                nodeId.onStatusChange(this._onEKConnectionChange.bind(this));
            });
        }
        disconnect() {
            return new Promise((resolve, reject) => {
                if (this._nodeId && EK.Status.disconnected != this._nodeId.getStatus()) {
                    this._nodeId.close(); //TODO FH6 or resolve sur le onConnectionChange ?
                    resolve();
                }
                else {
                    resolve();
                }
            });
        }
        send(message) {
            if (this._node != null) {
                let stringify = this._protocol.encode(message);
                if (stringify !== undefined && this._nodeId) {
                    this._node.sendText(this._nodeId, stringify);
                    return true;
                }
            }
            return false;
        }
    }
    exports.EndpointClientCnxEK = EndpointClientCnxEK;
});
