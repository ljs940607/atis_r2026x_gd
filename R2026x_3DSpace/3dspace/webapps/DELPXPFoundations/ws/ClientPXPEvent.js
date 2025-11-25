// Usage:
//    import { ConnectPXPEvent } from 'DELPXPFoundation'
//    ConnectPXPEvent("ws:\localhost:8085\ws").then( (ws: WebClient ) { })
define(["require", "exports", "../type/PXPError", "../protocol/ProtocolJSONv2", "DS/Logger/Logger"], function (require, exports, PXPError_1, ProtocolJSONv2_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wsStatus = exports.wsCloseReason = void 0;
    exports.ConnectToWS_PXPEvent = ConnectToWS_PXPEvent;
    var _logger = Logger.getLogger('PXP.WS');
    var wsCloseReason;
    (function (wsCloseReason) {
        // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
        wsCloseReason[wsCloseReason["Normal"] = 1000] = "Normal";
        wsCloseReason[wsCloseReason["GoingAway"] = 1001] = "GoingAway";
        wsCloseReason[wsCloseReason["ProtocolError"] = 1002] = "ProtocolError";
        wsCloseReason[wsCloseReason["UnsupportedData"] = 1003] = "UnsupportedData";
        wsCloseReason[wsCloseReason["Reserved1004"] = 1004] = "Reserved1004";
        wsCloseReason[wsCloseReason["NoStatus"] = 1005] = "NoStatus";
        wsCloseReason[wsCloseReason["AbnormalClosure"] = 1006] = "AbnormalClosure";
        wsCloseReason[wsCloseReason["InvalidFramePayloadData"] = 1007] = "InvalidFramePayloadData";
        wsCloseReason[wsCloseReason["PolicyViolation"] = 1008] = "PolicyViolation";
        wsCloseReason[wsCloseReason["MessageTooBig"] = 1009] = "MessageTooBig";
        wsCloseReason[wsCloseReason["MandatoryExtension"] = 1010] = "MandatoryExtension";
        wsCloseReason[wsCloseReason["InternalError"] = 1011] = "InternalError";
        wsCloseReason[wsCloseReason["ServiceRestart"] = 1012] = "ServiceRestart";
        wsCloseReason[wsCloseReason["TryAgainLater"] = 1013] = "TryAgainLater";
        wsCloseReason[wsCloseReason["BadGateway"] = 1014] = "BadGateway";
        wsCloseReason[wsCloseReason["TLShandshake"] = 1015] = "TLShandshake";
    })(wsCloseReason || (exports.wsCloseReason = wsCloseReason = {}));
    var wsStatus;
    (function (wsStatus) {
        wsStatus[wsStatus["CONNECTING"] = 0] = "CONNECTING";
        wsStatus[wsStatus["OPEN"] = 1] = "OPEN";
        wsStatus[wsStatus["CLOSING"] = 2] = "CLOSING";
        wsStatus[wsStatus["CLOSED"] = 3] = "CLOSED";
    })(wsStatus || (exports.wsStatus = wsStatus = {}));
    function ConnectToWS_PXPEvent(url, handlers) {
        const wsClient = new ClientPXPEvent(url, handlers);
        return wsClient.connect();
    }
    class ClientPXPEvent {
        constructor(url, handlers) {
            this.url = url;
            this._eventprotocol = ProtocolJSONv2_1.JSONv2.Protocol;
            if (handlers === null || handlers === void 0 ? void 0 : handlers.onMessage) {
                const callbackMessage = handlers.onMessage;
                this._onMessage = (data) => {
                    if (typeof data === 'string') {
                        const msg = this._eventprotocol.decode(data);
                        if (msg) {
                            callbackMessage(msg, this);
                            return;
                        }
                    }
                    _logger.debug('WS.PXPEvent- invalid message: ' + data);
                };
            }
            if (handlers === null || handlers === void 0 ? void 0 : handlers.onError) {
                const callbackOnError = handlers.onError;
                this._onError = (evt) => {
                    const errorText = '' + evt;
                    callbackOnError(new PXPError_1.PXPError(errorText, PXPError_1.StdCode.WebsocketError, PXPError_1.enTypeError.code, 'Websocket'), this);
                };
            }
            else {
                this._onError = (evt) => {
                    _logger.error('WS.PXPEvent- websocket error: ' + evt);
                };
            }
            if (handlers === null || handlers === void 0 ? void 0 : handlers.onClose) {
                const callbackOnClose = handlers.onClose;
                this._onClose = (evt) => {
                    callbackOnClose(evt.code);
                };
            }
            else {
                this._onClose = (evt) => {
                    _logger.debug('WS.PXPEvent- websocket closed: ' + evt.code);
                };
            }
        }
        connect() {
            return new Promise((resolve, reject) => {
                if (!this._ws) {
                    try {
                        this._ws = new WebSocket(this.url, ['v1.pxpevent.ds']);
                        this._ws.onopen = (event) => {
                            resolve(this);
                            if (this._ws)
                                this._postConnect(this._ws);
                        };
                        this._ws.onerror = (event) => {
                            if (event.type == "error") {
                                reject(new Error("failed to connect at '" + this.url + "'"));
                            }
                            if (this._ws)
                                this._postConnect(this._ws);
                        };
                        this._ws.onclose = (event) => {
                            this._onClose(event);
                        };
                        this._ws.onmessage = (evt) => {
                            if (evt && evt.data && this._onMessage) {
                                this._onMessage(evt.data);
                            }
                        };
                    }
                    catch (err) {
                        _logger.error('WS.PXPEvent- websocket connect failed: ' + err);
                    }
                }
            });
        }
        close(code) {
            if (this._ws) {
                this._ws.close(code);
            }
        }
        _postConnect(ws) {
            ws.onopen = null;
            ws.onerror = this._onError;
        }
        status() {
            if (this._ws)
                return this._ws.readyState;
            return wsStatus.CLOSED;
        }
        isConnected() {
            return this.status() === wsStatus.OPEN;
        }
        send(message) {
            if (this._ws) {
                const json = this._eventprotocol.encode(message);
                if (json) {
                    this._ws.send(json);
                    return true;
                }
            }
            return false;
        }
    }
});
