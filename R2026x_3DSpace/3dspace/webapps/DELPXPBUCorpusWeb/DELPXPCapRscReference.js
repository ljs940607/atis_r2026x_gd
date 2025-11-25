// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPCapRscReference"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusBase"], function (require, exports, DELPXPBUCorpusBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPCapRscReference = void 0;
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPCapRscReference extends DELPXPBUCorpusBase_1.DELPXPBUCorpusBase {
        constructor(iPid, iName) {
            super(iPid);
            this.name = iName;
        }
    }
    exports.DELPXPCapRscReference = DELPXPCapRscReference;
});
