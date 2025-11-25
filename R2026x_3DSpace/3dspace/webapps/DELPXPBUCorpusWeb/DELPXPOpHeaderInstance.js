// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPOpHeaderInstance"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPOperationInstance"], function (require, exports, DELPXPOperationInstance_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPOpHeaderInstance = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPOpHeaderInstance
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPOpHeaderInstance} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPOpHeaderInstance extends DELPXPOperationInstance_1.DELPXPOperationInstance {
        constructor(iPid, iName, iIsAggregatingBy, iIsInstanceOf) {
            super(iPid, iName, iIsAggregatingBy, iIsInstanceOf);
        }
        ;
    }
    exports.DELPXPOpHeaderInstance = DELPXPOpHeaderInstance;
});
