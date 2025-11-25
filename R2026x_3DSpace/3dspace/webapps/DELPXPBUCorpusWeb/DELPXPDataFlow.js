// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPDataFlow"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPConstraint", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusEnums"], function (require, exports, DELPXPConstraint_1, DELPXPBUCorpusEnums) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPDataFlow = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPDataFlow
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPDataFlow} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPDataFlow extends DELPXPConstraint_1.DELPXPConstraint {
        constructor(iPID, iProductFlowType) {
            super(iPID);
            this.from = "";
            this.to = "";
            this.productFlowType = DELPXPBUCorpusEnums.ProductFlowType;
            this.productFlowType = iProductFlowType;
        }
    }
    exports.DELPXPDataFlow = DELPXPDataFlow;
});
