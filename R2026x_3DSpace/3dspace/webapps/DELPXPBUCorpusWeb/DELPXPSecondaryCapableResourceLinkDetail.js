// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPSecondaryCapableResourceLinkDetail"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLinkDetail"], function (require, exports, DELPXPCapableResourceLinkDetail_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPSecondaryCapableResourceLinkDetail = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPSecondaryCapableResourceLinkDetail
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPSecondaryCapableResourceLinkDetail} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPSecondaryCapableResourceLinkDetail extends DELPXPCapableResourceLinkDetail_1.DELPXPCapableResourceLinkDetail {
        constructor(iPID) {
            super(iPID);
        }
        ;
        setFrom(iFrom) {
            super.setFrom(iFrom);
        }
        ;
        setTo(iTo) {
            super.setTo(iTo);
        }
        ;
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
        setAvailabilityMode(iAvailabilityMode) {
            super.setAvailabilityMode(iAvailabilityMode);
        }
        ;
        setIsPositioningPID(iIsPositioning) {
            super.setIsPositioningPID(iIsPositioning);
        }
        ;
    }
    exports.DELPXPSecondaryCapableResourceLinkDetail = DELPXPSecondaryCapableResourceLinkDetail;
});
