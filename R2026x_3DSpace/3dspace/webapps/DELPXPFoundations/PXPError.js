/// <amd-module name="DS/DELPXPFoundations/PXPError"/>
define("DS/DELPXPFoundations/PXPError", ["require", "exports", "./type/PXPError"], function (require, exports, PXPError_1) {
    "use strict";
    //@ts-ignore -- Compatible Old 'PXPError'
    PXPError_1.PXPError.enTypeError = PXPError_1.enTypeError;
    //@ts-ignore -- Compatible Old 'PXPError'
    PXPError_1.PXPError.stdCode = PXPError_1.StdCode;
    return PXPError_1.PXPError;
});
