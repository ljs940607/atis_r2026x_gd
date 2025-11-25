define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPOperationReference"], function (require, exports, DELPXPOperationReference_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPOpHeaderReference = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPOpHeaderReference
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPOpHeaderReference} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPOpHeaderReference extends DELPXPOperationReference_1.DELPXPOperationReference {
        constructor(iPid, iName) {
            super(iPid, iName);
        }
    }
    exports.DELPXPOpHeaderReference = DELPXPOpHeaderReference;
});
