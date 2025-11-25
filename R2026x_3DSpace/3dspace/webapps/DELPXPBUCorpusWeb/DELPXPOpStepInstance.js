define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPOperationInstance"], function (require, exports, DELPXPOperationInstance_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPOpStepInstance = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPOpStepInstance
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPOpStepInstance} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPOpStepInstance extends DELPXPOperationInstance_1.DELPXPOperationInstance {
        constructor(iPid, iName, iIsAggregatingBy, iIsInstanceOf) {
            super(iPid, iName, iIsAggregatingBy, iIsInstanceOf);
        }
        ;
    }
    exports.DELPXPOpStepInstance = DELPXPOpStepInstance;
});
