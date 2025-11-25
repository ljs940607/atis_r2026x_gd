define(["require", "exports", "./BusSessionEK", "./BusSessionEKLegacy", "./BusSessionHttp"], function (require, exports, BusSessionEK_1, BusSessionEKLegacy_1, BusSessionHttp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BusContainer = void 0;
    class BusContainer {
        constructor() {
            this._mapSession = new Map();
        }
        static getInstance() {
            if (!BusContainer.instance) {
                BusContainer.instance = new BusContainer();
            }
            return BusContainer.instance;
        }
        retrieve(key) {
            return this._mapSession.get(key);
        }
        async retrieveOrConnect(key, options) {
            let bus;
            if (options && options.newClient === true) {
                bus = undefined;
            }
            else {
                bus = this.retrieve(key);
            }
            if (bus == undefined) {
                if ((options === null || options === void 0 ? void 0 : options.busType) == 'HTTP') {
                    return (0, BusSessionHttp_1.CreateBusSessionHttp)(key, options).then((busSession) => {
                        this._mapSession.set(key, busSession);
                        return busSession;
                    });
                }
                else if ((options === null || options === void 0 ? void 0 : options.busType) == 'EK') {
                    return (0, BusSessionEK_1.CreateBusSessionEK)(key, options).then((busSession) => {
                        this._mapSession.set(key, busSession);
                        return busSession;
                    });
                }
                else
                    return (0, BusSessionEKLegacy_1.CreateBusSessionEKLegacy)(key, options).then((busSession) => {
                        this._mapSession.set(key, busSession);
                        return busSession;
                    });
            }
            else {
                return new Promise((resolve) => {
                    resolve(bus);
                });
            }
        }
        disconnect(key) {
            this._mapSession.delete(key);
        }
    }
    exports.BusContainer = BusContainer;
});
