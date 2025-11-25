// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPMfgItemReference"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusBase"], function (require, exports, DELPXPBUCorpusBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPMfgItemReference = void 0;
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPMfgItemReference extends DELPXPBUCorpusBase_1.DELPXPBUCorpusBase {
        constructor(iPid, iName) {
            super(iPid);
            this.name = iName;
        }
    }
    exports.DELPXPMfgItemReference = DELPXPMfgItemReference;
});
