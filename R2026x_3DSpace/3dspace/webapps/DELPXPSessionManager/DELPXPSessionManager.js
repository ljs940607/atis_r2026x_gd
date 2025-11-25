/// <amd-module name="DS/DELPXPSessionManager/DELPXPSessionManager"/>
define("DS/DELPXPSessionManager/DELPXPSessionManager", ["require", "exports", "DS/DELPXPFoundations/PXPUtils"], function (require, exports, PXPUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createPXPSession = createPXPSession;
    function createPXPSession() {
        const sessionID = (0, PXPUtils_1.generateGUID)().toString();
        return sessionID.toString();
    }
});
