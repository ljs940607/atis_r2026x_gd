/// <amd-module name="DS/DELPXPFoundations/PXPEventTransport"/>
define("DS/DELPXPFoundations/PXPEventTransport", ["require", "exports", "./event/Transport", "./protocol/ProtocolJSONv2"], function (require, exports, Transport_1, ProtocolJSONv2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Protocol = exports.KeySignal = exports.Transport = exports.EventFlag = exports.EventType = exports.EventStatus = exports.HeaderKey = void 0;
    Object.defineProperty(exports, "HeaderKey", { enumerable: true, get: function () { return Transport_1.HeaderKey; } });
    Object.defineProperty(exports, "EventStatus", { enumerable: true, get: function () { return Transport_1.EventStatus; } });
    Object.defineProperty(exports, "EventType", { enumerable: true, get: function () { return Transport_1.EventType; } });
    Object.defineProperty(exports, "EventFlag", { enumerable: true, get: function () { return Transport_1.EventFlag; } });
    Object.defineProperty(exports, "Transport", { enumerable: true, get: function () { return Transport_1.Transport; } });
    Object.defineProperty(exports, "KeySignal", { enumerable: true, get: function () { return Transport_1.KeySignal; } });
    exports.Protocol = {
        JSONv2: ProtocolJSONv2_1.JSONv2.Protocol,
    };
});
