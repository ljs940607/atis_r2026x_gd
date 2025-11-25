/// <amd-module name="DS/DELPXPMfgModelers/DELPXPMfgModelersAPI"/>
define("DS/DELPXPMfgModelers/DELPXPMfgModelersAPI", ["require", "exports", "./modelerV1/MfgModelersGateway"], function (require, exports, MfgModelersGateway_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetMfgModelers = GetMfgModelers;
    /**
     * async function returning a IMfgModelers
     * @param iPXPContext, to provide to the service all the necessary infos to do communications
     * @returns IMfgModelers
     */
    function GetMfgModelers(iISession) {
        return new MfgModelersGateway_1.MfgModelersGateway(iISession);
    }
});
