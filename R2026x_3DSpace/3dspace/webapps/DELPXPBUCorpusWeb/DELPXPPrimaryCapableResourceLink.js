// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPPrimaryCapableResourceLink"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLink"], function (require, exports, DELPXPCapableResourceLink_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPPrimaryCapableResourceLink = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPPrimaryCapableResourceLink
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPPrimaryCapableResourceLink} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPPrimaryCapableResourceLink extends DELPXPCapableResourceLink_1.DELPXPCapableResourceLink {
        constructor(iPID) {
            super(iPID);
            this.transformationBuildUpPos = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
        }
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
        setIsPositioningPID(iIsPositioning) {
            super.setIsPositioningPID(iIsPositioning);
        }
        ;
        setIsReserved(iIsReserved) {
            super.setIsReserved(iIsReserved);
        }
        ;
        setBuildUpPosition(iBuildUpPosition) {
            this.transformationBuildUpPos = iBuildUpPosition;
        }
        ;
    }
    exports.DELPXPPrimaryCapableResourceLink = DELPXPPrimaryCapableResourceLink;
});
