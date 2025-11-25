define(["require", "exports", "./BusType", "DS/Logger/Logger"], function (require, exports, BusType_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDisconnectedEndpointClient = useDisconnectedEndpointClient;
    var _logger = Logger.getLogger('PXP.SYS');
    function useDisconnectedEndpointClient(serverURL) {
        return new EndpointClientDisconnectedImpl(serverURL);
    }
    class EndpointClientDisconnectedImpl {
        constructor(serverURL) {
            this.clientVersion = 0; // 2.00
            this.connectTimeout = 0;
            this.reconnectTimeout = 0;
            this.autoReconnectPolicies = BusType_1.enReconnectPolicies.no;
            this.serverUrl = serverURL || new URL('http://fakeserver.com/');
            this.clientName = 'Disconnected';
            this.connectionStatus = BusType_1.enConnectionStatus.disconnected;
        }
        send(message) {
            _logger.debug("BusDisconnected.send(" + message + ")");
            return false;
        }
        async publish(message) {
            _logger.debug("BusDisconnected.publish(" + message + ")");
            throw new Error('Endpoint disconnected');
        }
        sendRequest(parameters) {
            _logger.debug("BusDisconnected.sendRequest(" + parameters.uri + ")");
            return false;
        }
        async request(uri, message) {
            _logger.debug("BusDisconnected.request(" + uri + ")");
            throw new Error('Endpoint disconnected');
        }
        async bufferedRequest(uri, message, onMessage) {
            _logger.debug("BusDisconnected.bufferedRequest(" + uri + ")");
            throw new Error('Endpoint disconnected');
        }
        async subscribeTopics(topic, force) {
            _logger.debug("BusDisconnected.subscribeTopics(" + topic + ")");
            throw new Error('Endpoint disconnected');
        }
        async unsubscribeTopics(topic, force) {
            _logger.debug("BusDisconnected.unsubscribeTopics(" + topic + ")");
            throw new Error('Endpoint disconnected');
        }
        async subscribeSignal(force) {
            _logger.debug("BusDisconnected.subscribeSignal()");
            throw new Error('Endpoint disconnected');
        }
        async unsubscribeSignal(force) {
            _logger.debug("BusDisconnected.unsubscribeSignal()");
            throw new Error('Endpoint disconnected');
        }
        attachOnMessage(onMessage, onAcceptFilter, key, info) { }
        detachOnMessage(itemToRemove) { }
        detachAllOnMessage() { }
        attachOnError(onError) { }
        detachOnError(onError) { }
        detachAllOnError() { }
        attachOnInterceptReceptMessage(onMessageHandler) { }
        detachOnInterceptReceptMessage(onMessageHandler) { }
        detachAllOnInterceptReceptMessage() { }
        attachOnInterceptSendMessage(onMessageHandler) { }
        detachOnInterceptSendMessage(onMessageHandler) { }
        detachAllOnInterceptSendMessage() { }
        attachOnConnectionChange(onChange) { }
        detachOnConnectionChange(onChange) { }
        detachAllOnConnectionChange() { }
        isConnected() {
            return false;
        }
        async _createNodeClient(onHypervisorConnectionChange) {
            throw new Error('Fake Endpoint');
        }
        async connect() {
            throw new Error('Fake Endpoint');
        }
        disconnect() { }
    }
});
