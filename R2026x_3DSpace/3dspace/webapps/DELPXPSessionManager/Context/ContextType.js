define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RequestType = void 0;
    var RequestType;
    (function (RequestType) {
        RequestType[RequestType["RequestType_Command"] = 0] = "RequestType_Command";
        RequestType[RequestType["RequestType_Read"] = 1] = "RequestType_Read";
        RequestType[RequestType["RequestType_Query"] = 2] = "RequestType_Query";
        RequestType[RequestType["RequestType_Default"] = 3] = "RequestType_Default";
    })(RequestType || (exports.RequestType = RequestType = {}));
});
