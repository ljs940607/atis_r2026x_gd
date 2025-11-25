// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLinkDetail"/>
define(["require", "exports", "DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLink", "DS/DELPXPBUCorpusWeb/DELPXPBUCorpusEnums"], function (require, exports, DELPXPCapableResourceLink_1, DELPXPBUCorpusEnums) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPCapableResourceLinkDetail = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLinkDetail
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPCapableResourceLinkDetail} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPCapableResourceLinkDetail extends DELPXPCapableResourceLink_1.DELPXPCapableResourceLink {
        constructor(iPID) {
            super(iPID);
            this.availabilityMode = DELPXPBUCorpusEnums.AvailabilityMode;
        }
        setAvailabilityMode(iAvailabilityMode) {
            this.availabilityMode = iAvailabilityMode;
        }
    }
    exports.DELPXPCapableResourceLinkDetail = DELPXPCapableResourceLinkDetail;
});
