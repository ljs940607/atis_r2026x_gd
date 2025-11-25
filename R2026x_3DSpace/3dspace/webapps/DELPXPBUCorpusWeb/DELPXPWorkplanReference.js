define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPOperationReference"], function (require, exports, DELPXPOperationReference_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPWorkplanReference = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPWorkplanReference
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPWorkplanReference} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPWorkplanReference extends DELPXPOperationReference_1.DELPXPOperationReference {
        constructor(iPid, iName) {
            super(iPid, iName);
        }
    }
    exports.DELPXPWorkplanReference = DELPXPWorkplanReference;
});
