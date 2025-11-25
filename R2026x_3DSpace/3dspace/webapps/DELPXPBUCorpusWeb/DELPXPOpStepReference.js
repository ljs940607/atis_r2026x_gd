// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPOpStepReference"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPOperationReference"], function (require, exports, DELPXPOperationReference_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPOpStepReference = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPOpStepReference
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPOpStepReference} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPOpStepReference extends DELPXPOperationReference_1.DELPXPOperationReference {
        constructor(iPid, iName) {
            super(iPid, iName);
        }
    }
    exports.DELPXPOpStepReference = DELPXPOpStepReference;
});
