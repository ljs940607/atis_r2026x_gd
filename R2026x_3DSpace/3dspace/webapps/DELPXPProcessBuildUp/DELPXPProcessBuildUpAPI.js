/// <amd-module name="DS/DELPXPProcessBuildUp/DELPXPProcessBuildUpAPI"/>
define("DS/DELPXPProcessBuildUp/DELPXPProcessBuildUpAPI", ["require", "exports", "./buildupV1/ProcessBuildUpGateway", "./connectV1/ContextBuildUpImpl", "./buildupV1/DELPXPBuildUpEnums", "./buildupV1/DELPXPBuildUpParams", "./buildupV1/DELPXPBuildUpSelection"], function (require, exports, ProcessBuildUpGateway_1, ContextBuildUpImpl_1, DELPXPBuildUpEnums_1, DELPXPBuildUpParams_1, DELPXPBuildUpSelection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPBuildUpSelection = exports.DELPXPBuildUpParams = exports.SelectionMode = void 0;
    exports.connectProcessBuildUp = connectProcessBuildUp;
    exports.GetProcessBuildUpAPI = GetProcessBuildUpAPI;
    /**
     * async function returning a promise of type IPXPContext
     * @param iIdentifier, unique identifier for each session, for the current user, a different user with the same identifier will not get the same session.
     * @param iConnectionInfo , ...
     * @returns Promise<IPXPContext>
     */
    function connectProcessBuildUp(iIdentifier, iConnectionInfo) {
        return (0, ContextBuildUpImpl_1.connectProcessBuildUpAPI)(iIdentifier, iConnectionInfo);
    }
    ;
    /**
     * async function returning a IProcessBuildUp
     * @param iPXPContext, to provide to the service all the necessary infos to do communications
     * @returns IProcessBuildUp
     */
    function GetProcessBuildUpAPI(iPXPContext) {
        return new ProcessBuildUpGateway_1.ProcessBuildUpGateway(iPXPContext);
    }
    Object.defineProperty(exports, "SelectionMode", { enumerable: true, get: function () { return DELPXPBuildUpEnums_1.SelectionMode; } });
    Object.defineProperty(exports, "DELPXPBuildUpParams", { enumerable: true, get: function () { return DELPXPBuildUpParams_1.DELPXPBuildUpParams; } });
    Object.defineProperty(exports, "DELPXPBuildUpSelection", { enumerable: true, get: function () { return DELPXPBuildUpSelection_1.DELPXPBuildUpSelection; } });
});
