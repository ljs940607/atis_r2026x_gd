// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPMfgItemInstance"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusBase"], function (require, exports, DELPXPBUCorpusBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPMfgItemInstance = void 0;
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPMfgItemInstance extends DELPXPBUCorpusBase_1.DELPXPBUCorpusBase {
        constructor(iPid, iName, iIsAggregatingBy, iIsInstanceOf, iTransformation) {
            super(iPid);
            this.transformation = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
            this.isAggregatingBy = iIsAggregatingBy;
            this.isInstanceOf = iIsInstanceOf;
            if (iTransformation !== undefined)
                this.transformation = iTransformation;
            this.name = iName;
        }
    }
    exports.DELPXPMfgItemInstance = DELPXPMfgItemInstance;
});
