// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLink"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPConstraint", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusEnums"], function (require, exports, DELPXPConstraint_1, DELPXPBUCorpusEnums) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPCapableResourceLink = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLink
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLink} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPCapableResourceLink extends DELPXPConstraint_1.DELPXPConstraint {
        constructor(iPID) {
            super(iPID);
            this.from = "";
            this.to = "";
            this.applicabilityMode = DELPXPBUCorpusEnums.ApplicabilityMode;
            this.referencePositionMode = DELPXPBUCorpusEnums.ReferencePositionMode;
            this.transformationRscPos = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
            this.isPositionningPID = "";
            this.isReserved = false;
        }
        setFrom(iFrom) {
            this.from = iFrom;
        }
        setTo(iTo) {
            this.to = iTo;
        }
        setApplicabilityMode(iApplicabilityMode) {
            this.applicabilityMode = iApplicabilityMode;
        }
        ;
        setReferencePositionMode(iRefPosMode) {
            this.referencePositionMode = iRefPosMode;
        }
        ;
        setTransfoRscPosition(iTransfoRscPos) {
            this.transformationRscPos = iTransfoRscPos;
        }
        ;
        setIsPositioningPID(iIsPositioning) {
            this.isPositionningPID = iIsPositioning;
        }
        ;
        setIsReserved(iIsReserved) {
            this.isReserved = iIsReserved;
        }
        ;
    }
    exports.DELPXPCapableResourceLink = DELPXPCapableResourceLink;
});
