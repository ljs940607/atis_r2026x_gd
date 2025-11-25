// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPPrimaryCapableResourceLinkDetail"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLinkDetail"], function (require, exports, DELPXPCapableResourceLinkDetail_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPPrimaryCapableResourceLinkDetail = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPPrimaryCapableResourceLinkDetail
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPPrimaryCapableResourceLinkDetail} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPPrimaryCapableResourceLinkDetail extends DELPXPCapableResourceLinkDetail_1.DELPXPCapableResourceLinkDetail {
        constructor(iPID) {
            super(iPID);
            this.transformationBuildUpPos = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
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
        setBuildUpPosition(iBuildUpPosition) {
            this.transformationBuildUpPos = iBuildUpPosition;
        }
        ;
        setIsPositioningPID(iIsPositioning) {
            super.setIsPositioningPID(iIsPositioning);
        }
        ;
    }
    exports.DELPXPPrimaryCapableResourceLinkDetail = DELPXPPrimaryCapableResourceLinkDetail;
});
