// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPSecondaryCapableResourceLink"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLink"], function (require, exports, DELPXPCapableResourceLink_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPSecondaryCapableResourceLink = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPSecondaryCapableResourceLink
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPSecondaryCapableResourceLink} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPSecondaryCapableResourceLink extends DELPXPCapableResourceLink_1.DELPXPCapableResourceLink {
        constructor(iPID) {
            super(iPID);
        }
        setFrom(iFrom) {
            super.setFrom(iFrom);
        }
        setTo(iTo) {
            super.setTo(iTo);
        }
        setApplicabilityMode(iApplicabilityMode) {
            super.setApplicabilityMode(iApplicabilityMode);
        }
        ;
        setReferencePositionMode(iRefPosMode) {
            super.setReferencePositionMode(iRefPosMode);
        }
        ;
        setTransfoRscPosition(iTransfoRscPos) {
            super.setTransfoRscPosition(iTransfoRscPos);
        }
        ;
        setIsPositioningPID(iIsPositioning) {
            super.setIsPositioningPID(iIsPositioning);
        }
        ;
    }
    exports.DELPXPSecondaryCapableResourceLink = DELPXPSecondaryCapableResourceLink;
});
