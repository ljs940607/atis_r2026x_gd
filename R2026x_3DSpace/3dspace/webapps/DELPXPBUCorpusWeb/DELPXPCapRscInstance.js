// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPCapRscInstance"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusBase"], function (require, exports, DELPXPBUCorpusBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPCapRscInstance = void 0;
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPCapRscInstance extends DELPXPBUCorpusBase_1.DELPXPBUCorpusBase {
        constructor(iPid, iName, iIsAggregatingBy, iIsInstanceOf) {
            super(iPid);
            this.isAggregatingBy = iIsAggregatingBy;
            this.isInstanceOf = iIsInstanceOf;
            this.name = iName;
        }
    }
    exports.DELPXPCapRscInstance = DELPXPCapRscInstance;
});
