define(["require", "exports", "DS/Logger/Logger", "../protocol/ProtocolJSONv2", "./BusType", "../ws/ClientPXPEvent"], function (require, exports, Logger, ProtocolJSONv2_1, BusType_1, ClientPXPEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EndpointClientCnxHttp = void 0;
    let _logger = Logger.getLogger('PXP.SYS');
    /*
    export function CheckServerHttp(bus: BusSession, timeout: number): Promise<ResultError> {
      const promise = new Promise<ResultError>((resolve, reject) => {
        let config: EKType.NodeOptionsUrl = {
          hypervisorUrl: bus.serverUrl.toString(),
          pool: 'CheckClient',
          onError: (msg: string) => {
            _logger.info('EK-CheckServer: '+ config.hypervisorUrl + ' - Error: '+ msg );
            reject(MakeResult.fail(new PXPError(msg)))
          },
          canDisconnectFromHypervisor: false,
          onHypervisorConnect: () => {
            _logger.info('EK-CheckServer: '+ config.hypervisorUrl + ' - Hypervisor connect');
            if (onHypervisorChange) onHypervisorChange(enConnectionStatus.connected)
            resolve(MakeResult.OK)
          },
          onHypervisorDisconnect: () => {
            _logger.debug('EK-CheckServer: '+ config.hypervisorUrl + ' - Hypervisor disconnect');
            if (onHypervisorChange) onHypervisorChange(enConnectionStatus.disconnected)
            reject(MakeResult.fail(new PXPError("Hypervisor disconnect")))
          },
        }
        const clientNode = new EK.Node(config)
        clientNode.stop();
      })
      const promiseTimeOut = new Promise<ResultError>((_r, reject) =>
        setTimeout(() => {
          reject(MakeResult.fail(new PXPError('CheckServer failed- The server did not respond (timeout)')))
        }, timeout),
      )
      return Promise.race<ResultError>([promise, promiseTimeOut])
    }
    */
    class EndpointClientCnxHttp {
        constructor(bus) {
            this._protocol = ProtocolJSONv2_1.JSONv2.Protocol;
            this._ws = null;
            this.clientName = bus.clientName;
            this._serverUrl = bus.serverUrl;
        }
        connect({ address, onMessage, onConnectionChange, connectTimeout, reconnectPolicies, reconnectTimeout, onAuthentication }) {
            const onlyNetwork = false;
            const timeoutConnection = connectTimeout;
            this._onMessageCB = onMessage;
            this._onConnectionChangeCB = onConnectionChange;
            let urlToConnect = new URL('/endpoints/connect/' + address.endpoint, this._serverUrl);
            let handlers = {
                onMessage: this._onMessage.bind(this),
                onError: this._onError.bind(this),
                onClose: this._onClose.bind(this),
            };
            if (this._onConnectionChangeCB) {
                this._onConnectionChangeCB(BusType_1.enConnectionStatus.pending);
            }
            return (0, ClientPXPEvent_1.ConnectToWS_PXPEvent)(urlToConnect, handlers).then((ws) => {
                this._ws = ws;
                if (this._onConnectionChangeCB) {
                    this._onConnectionChangeCB(BusType_1.enConnectionStatus.connected);
                }
            });
        }
        _onClose(reason) {
            if (this._onConnectionChangeCB) {
                this._onConnectionChangeCB(BusType_1.enConnectionStatus.disconnected);
            }
        }
        _onMessage(msg, origin) {
            if (this._onMessageCB) {
                this._onMessageCB(msg);
            }
        }
        _onError(error, origin) {
            _logger.error('HttpEndpoint Error: ' + error);
        }
        disconnect() {
            return new Promise((resolve, reject) => {
                if (this._ws) {
                    this._ws.close();
                }
                resolve();
            });
        }
        send(message) {
            if (this._ws) {
                return this._ws.send(message);
            }
            return false;
        }
    }
    exports.EndpointClientCnxHttp = EndpointClientCnxHttp;
});
