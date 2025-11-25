// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPImplementLink"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPConstraint", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusEnums"], function (require, exports, DELPXPConstraint_1, DELPXPBUCorpusEnums) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPImplementLink = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPImplementLink
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPImplementLink} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPImplementLink extends DELPXPConstraint_1.DELPXPConstraint {
        constructor(iPID, iImplementLinkType) {
            super(iPID);
            this.from = "";
            this.to = "";
            this.implementLinkType = DELPXPBUCorpusEnums.ImplementLinkUsage;
            if (iImplementLinkType !== undefined)
                this.implementLinkType = iImplementLinkType;
        }
    }
    exports.DELPXPImplementLink = DELPXPImplementLink;
});
