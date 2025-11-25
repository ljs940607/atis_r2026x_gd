// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPTimeConstraint"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPConstraint"], function (require, exports, DELPXPConstraint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPTimeConstraint = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPTimeConstraint
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPTimeConstraint} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPTimeConstraint extends DELPXPConstraint_1.DELPXPConstraint {
        constructor(iPID) {
            super(iPID);
            this.from = "";
            this.to = "";
        }
    }
    exports.DELPXPTimeConstraint = DELPXPTimeConstraint;
});
