// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPOperationInstance"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusBase"], function (require, exports, DELPXPBUCorpusBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPOperationInstance = void 0;
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPOperationInstance extends DELPXPBUCorpusBase_1.DELPXPBUCorpusBase {
        constructor(iPid, iName, iIsAggregatingBy, iIsInstanceOf) {
            super(iPid);
            this.isAggregatingBy = "";
            this.isInstanceOf = "";
            this.name = "";
            this.isAggregatingBy = iIsAggregatingBy;
            this.isInstanceOf = iIsInstanceOf;
            this.name = iName;
        }
    }
    exports.DELPXPOperationInstance = DELPXPOperationInstance;
});
