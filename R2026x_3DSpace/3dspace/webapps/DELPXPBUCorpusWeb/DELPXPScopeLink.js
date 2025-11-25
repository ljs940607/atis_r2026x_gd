// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPScopeLink"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPConstraint"], function (require, exports, DELPXPConstraint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPScopeLink = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPScopeLink
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPScopeLink} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPScopeLink extends DELPXPConstraint_1.DELPXPConstraint {
        constructor(iPID) {
            super(iPID);
            this.from = "";
            this.to = "";
        }
    }
    exports.DELPXPScopeLink = DELPXPScopeLink;
});
