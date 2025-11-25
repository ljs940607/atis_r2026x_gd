define(["require", "exports", "../event/Transport", "./BusType"], function (require, exports, Transport_1, BusType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CreateRequestHandlerPromise = CreateRequestHandlerPromise;
    exports.CreateBufferedRequestHandlerPromise = CreateBufferedRequestHandlerPromise;
    exports.CreateRequestHandler = CreateRequestHandler;
    function MessageAsError(msg) {
        if (msg && msg instanceof Transport_1.Transport) {
            if (msg.isError()) {
                return new Error(msg.asError().toString());
            }
            else if (msg.isStatusError()) {
                return new Error('Status: ' + msg.getStatus());
            }
        }
        return new Error('undefined error');
    }
    // handler for 'request'
    class RequestHandlerPromiseImpl {
        constructor(resolve, reject, errorPolicies) {
            this.resolve = resolve;
            this.reject = reject;
            this._response_cpt = 0;
            if (errorPolicies == undefined) {
                errorPolicies = BusType_1.enErrorPolicies.catchMessageError;
            }
            switch (errorPolicies) {
                case BusType_1.enErrorPolicies.asFetch:
                    this._onCheckSuccess = (msg) => msg instanceof Transport_1.Transport;
                    break;
                case BusType_1.enErrorPolicies.catchMessageErrorStatus:
                    this._onCheckSuccess = (msg) => !msg.isStatusError();
                    break;
                case BusType_1.enErrorPolicies.catchAll:
                    this._onCheckSuccess = (msg) => !(msg.isStatusError() || msg.isError());
                    break;
                default:
                case BusType_1.enErrorPolicies.catchMessageError:
                    this._onCheckSuccess = (msg) => !msg.isError();
                    break;
            }
        }
        onSuccess(msg) {
            if (++this._response_cpt == 1) {
                if (Transport_1.EventStatus.Continue == msg.getStatus()) {
                    this.reject(new Error('request(' + msg.getUri() + ") failed: API 'request' does not support 'continue' type messages, uses API 'requestAsBuffered'"), msg);
                }
                else
                    this.resolve(msg);
            }
            //else if (this.onContinue !== undefined) this.onContinue(msg)
        }
        onFail(msg) {
            if (++this._response_cpt == 1) {
                this.reject(MessageAsError(msg), msg);
            }
            //else if (this.onContinue !== undefined) this.onContinue(msg)
        }
        onCheckSuccess(message) {
            return this._onCheckSuccess(message);
        }
    }
    function CreateRequestHandlerPromise(resolve, reject, errorPolicies) {
        return new RequestHandlerPromiseImpl(resolve, reject, errorPolicies);
    }
    //  handler for 'bufferedrequest'
    class BufferedRequestHandlerPromiseImpl {
        constructor(resolve, reject, onMessage) {
            this.resolve = resolve;
            this.reject = reject;
            this.onMessage = onMessage;
            this._bufferMsg = [];
        }
        onSuccess(msg) {
            if (this.onMessage)
                this.onMessage(msg);
            this._bufferMsg.push(msg);
            if (Transport_1.EventStatus.Continue === msg.getStatus())
                return;
            this.resolve(this._bufferMsg);
        }
        onFail(msg) {
            this.reject(MessageAsError(msg), msg);
        }
        onCheckSuccess(message) {
            return message instanceof Transport_1.Transport;
        }
    }
    function CreateBufferedRequestHandlerPromise(resolve, reject, onMessage) {
        return new BufferedRequestHandlerPromiseImpl(resolve, reject, onMessage);
    }
    // handler for 'sendRequest'
    class RequestHandlerCallback {
        constructor(options) {
            this._onCheckSuccess = (msg) => {
                return !msg.isError();
            };
            if (options.onSuccess)
                this._onSuccess = options.onSuccess;
            else
                this._onSuccess = options.onResponse;
            if (options.onFail)
                this._onFail = options.onFail;
            else
                this._onFail = options.onResponse;
            if (options.onCheckSuccess)
                this._onCheckSuccess = options.onCheckSuccess;
        }
        onSuccess(msg) {
            this._onSuccess(msg);
        }
        onFail(msg) {
            this._onFail(msg);
        }
        onCheckSuccess(message) {
            return this._onCheckSuccess(message);
        }
    }
    function CreateRequestHandler(options) {
        return new RequestHandlerCallback(options);
    }
});
