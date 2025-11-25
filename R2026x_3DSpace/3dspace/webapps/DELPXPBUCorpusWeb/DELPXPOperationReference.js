// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPOperationReference"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusBase"], function (require, exports, DELPXPBUCorpusBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPOperationReference = void 0;
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPOperationReference extends DELPXPBUCorpusBase_1.DELPXPBUCorpusBase {
        constructor(iPid, iName) {
            super(iPid, "", "Manufacturing", "DELPXPCorpusMfgOpVersion");
            this.duration = 0;
            this.name = iName;
        }
    }
    exports.DELPXPOperationReference = DELPXPOperationReference;
});
