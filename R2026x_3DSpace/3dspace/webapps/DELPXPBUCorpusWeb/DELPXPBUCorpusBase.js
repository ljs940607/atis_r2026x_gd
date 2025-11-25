// /// <amd-module name="DS/DELPXPBUCorpusWeb/DELPXPBUCorpusBase"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPBUCorpusBase = void 0;
    // /**
    //  * @module DS/DELPXPBUCorpusWeb/DELPXPBUCorpusBase
    //  * 
    //  * @returns {DS/DELPXPBUCorpusWeb/DELPXPBUCorpusBase} 
    //  */
    //import foundations = require('DS/DELPXPFoundations');
    //import eventTransport = require('DS/DELPXPFoundationsWeb/PXPEventTransport');
    class DELPXPBUCorpusBase {
        //private _className:string;
        constructor(iPid, iVersion, iDomain, iObjectType) {
            this.domain = "";
            this.version = "";
            this.objectType = "";
            this.pid = iPid;
            if (iDomain !== undefined)
                this.domain = iDomain;
            if (iObjectType !== undefined)
                this.objectType = iObjectType;
            if (iVersion !== undefined)
                this.version = iVersion;
        }
        getDomain() { return this.domain; }
        ;
        getVersion() { return this.version; }
        ;
        getObjType() { return this.objectType; }
        ;
    }
    exports.DELPXPBUCorpusBase = DELPXPBUCorpusBase;
});
