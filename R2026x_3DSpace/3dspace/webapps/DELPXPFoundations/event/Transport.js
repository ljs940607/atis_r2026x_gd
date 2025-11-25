define(["require", "exports", "../type/PXPError", "../type/PortableUID", "../corpus/PXPObject", "../corpus/CorpusManager", "DS/DELPXPFoundations/PXPUtils", "DS/Logger/Logger"], function (require, exports, PXPError_1, PortableUID_1, PXPObject_1, CorpusManager_1, Utils, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transport = exports.EventFlag = exports.EventType = exports.EventStatus = exports.HeaderKey = exports.KeySignal = void 0;
    var _logger = Logger.getLogger('PXP.SYS');
    exports.KeySignal = '#PXPSignal';
    var HeaderKey;
    (function (HeaderKey) {
        HeaderKey["URI"] = "#URI";
        HeaderKey["CorrelationID"] = "#CID";
        HeaderKey["MessageID"] = "#MID";
        HeaderKey["Status"] = "#STS";
        HeaderKey["Topics"] = "#TPC";
        HeaderKey["ContentType"] = "#TYP";
    })(HeaderKey || (exports.HeaderKey = HeaderKey = {}));
    var EventStatus;
    (function (EventStatus) {
        EventStatus[EventStatus["Undefined"] = 0] = "Undefined";
        EventStatus[EventStatus["Continue"] = 100] = "Continue";
        EventStatus[EventStatus["Ok"] = 200] = "Ok";
        EventStatus[EventStatus["OK_Created"] = 201] = "OK_Created";
        EventStatus[EventStatus["Created"] = 201] = "Created";
        EventStatus[EventStatus["Ok_Accepted"] = 202] = "Ok_Accepted";
        EventStatus[EventStatus["Accepted"] = 202] = "Accepted";
        EventStatus[EventStatus["Ok_NoContent"] = 204] = "Ok_NoContent";
        EventStatus[EventStatus["NoContent"] = 204] = "NoContent";
        EventStatus[EventStatus["Ok_ResetContent"] = 205] = "Ok_ResetContent";
        EventStatus[EventStatus["OK_PartialContent"] = 206] = "OK_PartialContent";
        EventStatus[EventStatus["PartialContent"] = 206] = "PartialContent";
        EventStatus[EventStatus["BadRequest"] = 400] = "BadRequest";
        EventStatus[EventStatus["UnAuthorized"] = 401] = "UnAuthorized";
        EventStatus[EventStatus["Forbidden"] = 403] = "Forbidden";
        EventStatus[EventStatus["NotFound"] = 404] = "NotFound";
        EventStatus[EventStatus["MethodNotAllowed"] = 405] = "MethodNotAllowed";
        EventStatus[EventStatus["TimeOut"] = 408] = "TimeOut";
        EventStatus[EventStatus["UriTooLong"] = 414] = "UriTooLong";
        EventStatus[EventStatus["TooManyRequest"] = 429] = "TooManyRequest";
        EventStatus[EventStatus["ServerError"] = 500] = "ServerError";
        EventStatus[EventStatus["NotImplemented"] = 501] = "NotImplemented";
        EventStatus[EventStatus["Unavailable"] = 503] = "Unavailable";
    })(EventStatus || (exports.EventStatus = EventStatus = {}));
    var EventType;
    (function (EventType) {
        EventType["empty"] = "0";
        EventType["text"] = "T";
        EventType["json"] = "J";
        EventType["error"] = "!";
        //binary: 'B',
        EventType["bool"] = "L";
        EventType["object"] = "O";
        EventType["bagobjects"] = "G";
        EventType["setobjects"] = "S";
        EventType["arrayobjects"] = "A";
        EventType["uid"] = "X";
        EventType["uint64"] = "U";
        EventType["int64"] = "I";
        EventType["double"] = "F";
        EventType["cmd"] = "#";
    })(EventType || (exports.EventType = EventType = {}));
    var EventFlag;
    (function (EventFlag) {
        EventFlag["message"] = "-";
        EventFlag["request"] = ">";
        EventFlag["response"] = "<";
    })(EventFlag || (exports.EventFlag = EventFlag = {}));
    //function warningNotVALID() {
    //  _logger.warn('======= PXP.Transport =========  INVALID CONTENT !')
    //}
    function warningObsolete() {
        _logger.warn('======= PXP.Transport =========  OBSOLETE CONTENT !');
    }
    function warningNotBAGNOTOBJECT() {
        _logger.warn('======= PXP.Transport =========  BAD TYPE - NOT a OBJECT, it is a BAG !');
    }
    function fixLegacyBag(content) {
        if (content && typeof content === 'object') {
            // fix if not compatible...
            for (const [key, val] of Object.entries(content)) {
                if (val && typeof val === 'object') {
                    if (PXPObject_1.PXPObject.isCompatible(val))
                        continue;
                    content[key]['@class'] = key;
                }
            } //endfor
        }
        return content;
    }
    // function fixLegacyObject(content: any): any {
    //   if (content && typeof content === 'object') {
    //     if (Object.keys(content).length == 1) {
    //       for (const [key, val] of Object.entries(content)) {
    //         content = val
    //         content['@class'] = key
    //       } //endfor
    //     }
    //   }
    //   return content
    // }
    class Transport {
        constructor(type = EventType.empty, content = null, headers = null) {
            this.flag = EventFlag.message;
            switch (type) {
                case EventType.empty: {
                    this.type = EventType.empty;
                    this.content = null;
                    break;
                }
                case EventType.text: {
                    if (Utils.isString(content)) {
                        this.type = EventType.text;
                        this.content = content;
                    }
                    else {
                        throw new Error('failed to construct Transport(text, content): invalid content !');
                    }
                    break;
                }
                case EventType.json: {
                    if (content && (typeof content === 'string' || typeof content === 'object')) {
                        this.type = EventType.json;
                        this.content = content;
                    }
                    else {
                        throw new Error('failed to construct Transport(json, content): invalid content !');
                    }
                    break;
                }
                case EventType.error: {
                    this.type = EventType.error;
                    if (content instanceof PXPError_1.PXPError) {
                        this.content = content;
                    }
                    else if (typeof content === 'string') {
                        this.content = new PXPError_1.PXPError(content, PXPError_1.StdCode.NoCodeError, PXPError_1.enTypeError.user);
                    }
                    else if (typeof content === 'object' && PXPError_1.PXPError.isCompatible(content)) {
                        this.content = PXPError_1.PXPError.CreateFromJSON(content);
                    }
                    else {
                        throw new Error('failed to construct Transport(error, content): invalid content !');
                    }
                    break;
                }
                //case PXPEvent.EventType.binary:
                //    this.type = PXPEvent.EventType.empty;
                //    break;
                case EventType.bool: {
                    this.type = EventType.bool;
                    if (Utils.isBool(content)) {
                        this.content = content ? true : false;
                    }
                    else
                        throw new Error('failed to construct Transport(bool, content): invalid content !');
                    break;
                }
                case EventType.object: {
                    // transform to object if string...
                    if (Utils.isString(content)) {
                        try {
                            let obj;
                            let reviver = CorpusManager_1.CorpusManager.globalReviver();
                            obj = JSON.parse(content, reviver);
                            content = obj;
                        }
                        catch (error) {
                            //...
                        }
                    }
                    if (PXPObject_1.PXPObject.isCompatible(content)) {
                        this.type = EventType.object;
                        this.content = content;
                        break;
                    }
                    // ! LEGACY SUPPORT ! -- Object == Bag
                    if (!PXPObject_1.BagObjects.isCompatible(content)) {
                        content = fixLegacyBag(content);
                    }
                    if (PXPObject_1.BagObjects.isCompatible(content)) {
                        warningNotBAGNOTOBJECT();
                        this.type = EventType.bagobjects;
                        this.content = content;
                        break;
                    } //END - ! LEGACY SUPPORT !
                    else {
                        throw new Error('failed to construct Transport(object, content): invalid content!');
                    }
                }
                case EventType.bagobjects: {
                    if (!PXPObject_1.BagObjects.isCompatible(content)) {
                        // try to fix...
                        content = fixLegacyBag(content);
                        if (!PXPObject_1.BagObjects.isCompatible(content)) {
                            throw new Error('failed to construct Transport(bagobject, content): invalid content !');
                        }
                        else {
                            warningObsolete();
                        }
                    }
                    this.type = EventType.bagobjects;
                    this.content = content;
                    break;
                }
                case EventType.arrayobjects: {
                    if (!PXPObject_1.ArrayObjects.isCompatible(content)) {
                        throw new Error('failed to construct Transport(arrayobject, content): invalid content !');
                    }
                    this.type = EventType.arrayobjects;
                    this.content = content;
                    break;
                }
                case EventType.setobjects: {
                    if (!PXPObject_1.SetObjects.isCompatible(content)) {
                        throw new Error('failed to construct Transport(setobject, content): invalid content !');
                    }
                    this.type = EventType.setobjects;
                    this.content = content;
                    break;
                }
                case EventType.uid: {
                    if (!PortableUID_1.PortableUID.isValid(content)) {
                        throw new Error('failed to construct Transport(uid, content): invalid content !');
                    }
                    this.type = EventType.uid;
                    this.content = content; // PortableUID
                    break;
                }
                case EventType.uint64: {
                    if (!Utils.isUint64(content)) {
                        throw new Error('failed to construct Transport(uint, content): invalid content !');
                    }
                    this.type = EventType.uint64;
                    this.content = content;
                    break;
                }
                case EventType.int64: {
                    if (!Utils.isInt64(content)) {
                        throw new Error('failed to construct Transport(int, content): invalid content !');
                    }
                    this.type = EventType.int64;
                    this.content = content;
                    break;
                }
                case EventType.double: {
                    if (!Utils.isDouble(content)) {
                        throw new Error('failed to construct Transport(double, content): invalid content !');
                    }
                    this.type = EventType.double;
                    this.content = content;
                    break;
                }
                case EventType.cmd: {
                    if (!Utils.isUint64(content)) {
                        throw new Error('failed to construct Transport(cmd, content): invalid content !');
                    }
                    this.type = EventType.cmd;
                    this.content = content;
                    break;
                }
                default: {
                    this.type = EventType.empty;
                    this.content = null;
                    _logger.warn('Transport- Unknown type !');
                    break;
                }
            }
            if (headers instanceof Object) {
                this.headers = headers;
            }
            else {
                this.headers = {};
            }
        }
        /**
         * Returns the message content as a string.
         *
         * @returns {string} message content
         */
        toString() {
            return '' + (Utils.isObject(this.content) || Array.isArray(this.content) ? JSON.stringify(this.content) : this.content);
        }
        /**
         * returns true, if the message has no content.
         *
         * @returns {boolean} true, if empty message
         */
        isEmpty() {
            return this.type === EventType.empty;
        }
        /**
         * returns true, if the message contains text
         *
         * @returns {boolean} true, if text message
         */
        isText() {
            return this.type === EventType.text;
        }
        /**
         * returns the message content as text. (All types returns text !)
         */
        asText() {
            switch (this.type) {
                case EventType.empty:
                    return '';
                case EventType.text:
                    if (typeof this.content === 'string')
                        return this.content;
                    return '' + this.content;
                case EventType.cmd:
                case EventType.bool:
                case EventType.int64:
                case EventType.uint64:
                case EventType.double:
                case EventType.uid:
                case EventType.error:
                    return '' + this.content;
                case EventType.json:
                case EventType.object:
                case EventType.bagobjects:
                case EventType.arrayobjects:
                case EventType.setobjects:
                    if (this.content && typeof this.content === 'object')
                        return JSON.stringify(this.content);
            }
            return '';
        }
        /**
         * returns true, if the message contains number (uint or int).
         *
         * @returns {boolean} true, if number message
         */
        isNumber() {
            return this.type === EventType.uint64 || this.type === EventType.int64 || this.type === EventType.double;
        }
        /**
         * returns the message content as number.
         */
        asNumber() {
            switch (this.type) {
                case EventType.int64:
                case EventType.uint64:
                case EventType.double:
                    if (typeof this.content === 'number')
                        return this.content;
                default:
                    return Number.NaN;
            }
        }
        /**
         * returns true, if the message contains boolean.
         *
         * @returns {boolean} true, if boolean message
         */
        isBool() {
            return this.type === EventType.bool;
        }
        /**
         * returns the message content as boolean.
         * if the content is not an bool returns false.
         */
        asBool() {
            switch (this.type) {
                case EventType.bool: {
                    if (this.content === true)
                        return true;
                    if (this.content === false)
                        return false;
                    if (this.content instanceof Boolean) {
                        return this.content.valueOf();
                    }
                    break;
                }
                case EventType.int64:
                case EventType.uint64:
                    if (typeof this.content === 'number')
                        return this.content != 0;
            }
            return false;
        }
        /**
         * returns true, if the message contains a json object.
         *
         * @returns {boolean} true, if json message
         */
        isJson(strict = true) {
            if (strict)
                return this.type === EventType.json;
            switch (this.type) {
                case EventType.json:
                case EventType.error:
                case EventType.object:
                case EventType.bagobjects:
                case EventType.setobjects:
                case EventType.arrayobjects:
                    return true;
            }
            return false;
        }
        /**
         * returns the message content as json object.
         */
        asJson() {
            switch (this.type) {
                case EventType.json: {
                    if (this.content && typeof this.content === 'object')
                        return this.content;
                    break;
                }
                case EventType.error: {
                    if (this.content instanceof PXPError_1.PXPError)
                        return this.content.toJSON();
                    else if (PXPError_1.PXPError.isCompatible(this.content))
                        return this.content;
                    break;
                }
                case EventType.object: {
                    if (this.content instanceof PXPObject_1.PXPObject)
                        return this.content.toJSON();
                    else if (PXPObject_1.PXPObject.isCompatible(this.content))
                        return this.content;
                    break;
                }
                case EventType.bagobjects: {
                    if (this.content instanceof PXPObject_1.BagObjects)
                        return this.content.toJSON();
                    else if (PXPObject_1.BagObjects.isCompatible(this.content))
                        return this.content;
                    break;
                }
                case EventType.arrayobjects: {
                    if (PXPObject_1.ArrayObjects.isCompatible(this.content))
                        return this.content;
                    break;
                }
                case EventType.setobjects: {
                    if (this.content instanceof PXPObject_1.SetObjects)
                        return this.content.toJSON();
                    else if (PXPObject_1.SetObjects.isCompatible(this.content))
                        return this.content;
                    break;
                }
            }
            return {};
        }
        /**
         * returns true, if the message contains a PXPObject.
         *
         * @returns {boolean} true, if message contains PXPObject.
         */
        isPXP_Object() {
            return this.type === EventType.object;
        }
        /**
         * returns the message content as PXPObject. returns null, if content is not compliant.
         */
        asPXP_Object() {
            switch (this.type) {
                case EventType.object: {
                    if (PXPObject_1.PXPObject.isCompatible(this.content)) {
                        return this.content;
                    }
                    break;
                }
            }
            return null;
        }
        /**
         * returns true, if the message contains a BagObjects.
         *
         * @returns {boolean} true, if message contains BagObjects.
         */
        isPXP_BagObjects() {
            return this.type === EventType.bagobjects;
        }
        /**
         * returns the message content as BagObject compatible object. returns null, if content is not compliant.
         */
        asPXP_BagObjects() {
            switch (this.type) {
                case EventType.object: {
                    if (PXPObject_1.PXPObject.isCompatible(this.content)) {
                        if (this.content instanceof PXPObject_1.PXPObject) {
                            let key = this.content.className;
                            return { key: this.content.toJSON() };
                        }
                        else {
                            let key = this.content['@class'];
                            return { key: this.content };
                        }
                    }
                    break;
                }
                case EventType.bagobjects: {
                    if (this.content instanceof PXPObject_1.BagObjects) {
                        return this.content;
                    }
                    else if (PXPObject_1.BagObjects.isCompatible(this.content))
                        return this.content;
                    break;
                }
            }
            return null;
        }
        /**
         * returns true, if the message contains a ArrayObjects.
         *
         * @returns {boolean} true, if message contains ArrayObjects.
         */
        isPXP_ArrayObjects() {
            return this.type === EventType.arrayobjects;
        }
        /**
         * returns true, if the message contains a SetObjects.
         *
         * @returns {boolean} true, if message contains SetObjects.
         */
        isPXP_SetObjects() {
            return this.type === EventType.setobjects;
        }
        /**
         * returns true, if the message contains a PXPobject compatible container (PXPObject, BagObjects, SetObjects, ArrayObjects).
         *
         * @returns {boolean} true, if message contains PXPobject compatible container.
         */
        isPXP_ObjectContainer() {
            switch (this.type) {
                case EventType.object:
                case EventType.bagobjects:
                case EventType.setobjects:
                case EventType.arrayobjects:
                    return true;
            }
            return false;
        }
        /**
         * returns true, if the message contains a PXPobject compatible container (PXPObject, BagObjects, SetObjects, ArrayObjects).
         *
         * @returns a iterable object of PXPObjectCompatible. If not compatible returns a empty container.
         */
        asPXP_ObjectContainer() {
            switch (this.type) {
                case EventType.object: {
                    if (PXPObject_1.PXPObject.isCompatible(this.content)) {
                        let ret = [];
                        ret.push(this.content);
                        return ret;
                    }
                    break;
                }
                case EventType.bagobjects: {
                    if (this.content instanceof PXPObject_1.BagObjects) {
                        return this.content;
                    }
                    else if (PXPObject_1.BagObjects.isCompatible(this.content)) {
                        let ret = [];
                        for (const item of Object.values(this.content)) {
                            ret.push(item);
                        } //endfor
                        return ret;
                    }
                    break;
                }
                case EventType.setobjects: {
                    if (PXPObject_1.SetObjects.isCompatible(this.content)) {
                        return this.content;
                    }
                    break;
                }
                case EventType.arrayobjects: {
                    if (PXPObject_1.ArrayObjects.isCompatible(this.content)) {
                        return this.content;
                    }
                    break;
                }
            }
            return [];
        }
        /**
         * returns true, if the message contains a PortableUID [PXP backend ID]
         *
         * @returns {boolean} true, if message contains PortableUID.
         */
        isPXP_Uid() {
            return this.type === EventType.uid;
        }
        /**
         * returns the message content as PortableUID [PXP backend ID]
         */
        asPXP_Uid() {
            if (EventType.uid === this.type) {
                if (this.content instanceof PortableUID_1.PortableUID) {
                    return this.content;
                }
                else if (typeof this.content === 'string')
                    return PortableUID_1.PortableUID.CreateFromString(this.content);
            }
            return PortableUID_1.PortableUID.Undefined();
        }
        /**
         * returns true, if the message contains a internalcmd [RESERVED].
         *
         * @returns {boolean} true, if internalCommand message.
         */
        isInternalCmd() {
            return this.type === EventType.cmd;
        }
        /**
         * returns the message content as internal command [RESERVED].
         */
        asInternalCmd() {
            if (EventType.cmd === this.type) {
                if (typeof this.content === 'number')
                    return this.content;
            }
            return null;
        }
        /**
         * returns true, if the message represents a error.
         *
         * @returns {boolean} true, if message contains PXPError.
         */
        isError() {
            return this.type === EventType.error;
        }
        /**
         * returns the message content as internal command.
         */
        asError() {
            if (EventType.error === this.type) {
                if (this.content instanceof PXPError_1.PXPError) {
                    return this.content;
                }
                else if (typeof this.content === 'object' && PXPError_1.PXPError.isCompatible(this.content)) {
                    return PXPError_1.PXPError.CreateFromJSON(this.content);
                }
            }
            return new PXPError_1.PXPError('EventTransport does not contain error as content', 418, PXPError_1.enTypeError.code, 'FoundationsWeb'); //TODO FH6: EventTransportNotErrorContent
        }
        /**
         * returns true, if the message is a simple message (not a request, not a response).
         *
         * @returns {boolean} true, if a simple message.
         */
        isSimpleMessage() {
            return this.flag === EventFlag.message;
        }
        /**
         * returns true, if the message is a request.
         *
         * @returns {boolean} true, if a request message.
         */
        isRequest() {
            return this.flag === EventFlag.request;
        }
        /**
         * returns true, if the message is a response.
         *
         * @returns {boolean} true, if a response message.
         */
        isResponse() {
            return this.flag === EventFlag.response;
        }
        /**
         * Tag this message as a request. [INTERNAL USES]
         */
        flagAsRequest() {
            this.flag = EventFlag.request;
            return this;
        }
        /**
         * Tag this message as a response. [INTERNAL USES]
         */
        flagAsResponse() {
            this.flag = EventFlag.response;
            return this;
        }
        /**
         * creates a transport object that represents a text message.
         *
         * @param {string} content - text.
         * @return {Transport} A new Transport.
         */
        static createText(content) {
            return new Transport(EventType.text, content);
        }
        /**
         * creates a transport object that represents a boolean message.
         *
         * @param {boolean} content - bool.
         * @return {Transport} A new Transport.
         */
        static createBool(content) {
            return new Transport(EventType.bool, content);
        }
        /**
         * creates a transport object that represents a json message.
         *
         * @param {any} content - string json or javascript objet.
         * @return {Transport} A new Transport.
         */
        static createJson(content) {
            return new Transport(EventType.json, content);
        }
        static createError(content) {
            return new Transport(EventType.error, content);
        }
        /**
         * creates a transport object that represents a PXPObject message. [To uses with PXP backend]
         *
         * @param {any} content - PXPObject or json compatible PXPObject
         * @return {Transport} A new Transport.
         */
        static createPXP_Object(content) {
            let obj;
            if (Utils.isString(content)) {
                let reviver = CorpusManager_1.CorpusManager.globalReviver();
                obj = JSON.parse(content, reviver);
            }
            else
                obj = content;
            return new Transport(EventType.object, obj);
        }
        /**
         * creates a transport object that represents a BagObject message. [To uses with PXP backend]
         *
         * @param {any} content - BagObject or json compatible BagObject.
         * @return {Transport} A new Transport.
         */
        static createPXP_BagObjects(content) {
            let obj;
            if (Utils.isString(content)) {
                let reviver = CorpusManager_1.CorpusManager.globalReviver();
                obj = JSON.parse(content, reviver);
            }
            else
                obj = content;
            return new Transport(EventType.bagobjects, obj);
        }
        /**
         * creates a transport object that represents a ArrayObject message. [To uses with PXP backend]
         *
         * @param {any} content - ArrayObject or json compatible ArrayObject.
         * @return {Transport} A new Transport.
         */
        static createPXP_ArrayObjects(content) {
            return new Transport(EventType.arrayobjects, content);
        }
        /**
         * creates a transport object that represents a SetObject message. [To uses with PXP backend]
         *
         * @param {any} content - SetObject or json compatible SetObject
         * @return {Transport} A new Transport.
         */
        static createPXP_SetObjects(content) {
            return new Transport(EventType.setobjects, content);
        }
        /**
         * creates a transport object that represents a PortableUID message. (Format: <ClassName>#uid ) [INTERNAL USES]
         *
         * @param {string|PortableUID} content - UID.
         * @return {Transport} A new Transport.
         */
        static createPXP_Uid(content) {
            let contentUid;
            if (Utils.isString(content)) {
                contentUid = PortableUID_1.PortableUID.CreateFromString(content);
            }
            else
                contentUid = content;
            return new Transport(EventType.uid, contentUid);
        }
        /**
         * creates a transport object that represents a positive number.
         *
         * @param {Integer} content - Number.
         * @return {Transport} A new Transport.
         */
        static createUint64(content) {
            return new Transport(EventType.uint64, content);
        }
        /**
         * creates a transport object that represents a number.
         *
         * @param {Integer} content - Number.
         * @return {Transport} A new Transport.
         */
        static createInt64(content) {
            return new Transport(EventType.int64, content);
        }
        /**
         * creates a transport object that represents a positive number.
         *
         * @param {Double} content - Number.
         * @return {Transport} A new Transport.
         */
        static createDouble(content) {
            return new Transport(EventType.double, content);
        }
        /**
         * creates a transport object that represents a internal commmand. [RESERVED]
         *
         * @param {Integer} content - Internal Command
         * @return {Transport} A new Transport.
         */
        static createInternalCmd(content) {
            return new Transport(EventType.cmd, content);
        }
        /**
         * creates a transport object with a JS Object { type: PXPType, content: ..., headers: { key: value, ... }}
         *
         * @param {object} object - JS Object
         * @return {Transport} A new Transport.
         */
        static createFromObject(message) {
            return new Transport(message.type, message.content, message.headers);
        }
        /**
         * creates a transport object. Depending on the content, the most suitable type will be used.
         *
         * @param {any} content - message content
         * @return {Transport} A new Transport.
         */
        static create(content) {
            if (Utils.isValid(content)) {
                if (Utils.isUint64(content)) {
                    return Transport.createUint64(Number(content));
                }
                if (Utils.isInt64(content)) {
                    return Transport.createInt64(Number(content));
                }
                if (Utils.isDouble(content)) {
                    return Transport.createDouble(Number(content));
                }
                if (Utils.isString(content)) {
                    return Transport.createText('' + content);
                }
                if (Utils.isBool(content)) {
                    return Transport.createBool(content);
                }
                if (Utils.isObject(content)) {
                    return Transport.createJson('' + JSON.stringify(content));
                }
                return Transport.createText('' + content);
            }
            return new Transport(EventType.empty, null);
        }
        /**
         * returns 'EventType' of this message.
         *
         * @return {EventType} Type of message content.
         */
        getType() {
            return this.type;
        }
        /**
         * returns 'content' of this message.
         *
         * @return {any} message content.
         */
        getContent() {
            return this.content;
        }
        /**
         * returns 'headers' of this message.
         *
         * @return {IHeaderAccessor} message headers.
         */
        getHeaders() {
            //return Object.fromEntries(this._headers.entries());
            return this.headers;
        }
        /**
         * Check if 'headers' is empty.
         *
         * @return {bool} returns true if message headers have information, else 'false'.
         */
        hasHeaders() {
            //return this._headers.size > 0;
            return Object.entries(this.headers).length > 0;
        }
        /**
         * Check if 'headers' has key.
         *
         * @return {bool} returns true if key exist.
         */
        hasHeader(key) {
            return this.headers.hasOwnProperty(key);
            //return Object.hasOwn(this.headers, key); // es2022
            //return this._headers.has(key); // version map
        }
        /**
         * Check if 'headers' has key.
         *
         * @return {bool} returns true if key exist.
         */
        getHeader(key) {
            //@ts-ignore
            return this.headers[key];
            //return this._headers.get(key); // version map
        }
        /**
         * Update headers.
         *
         * @param {string} key
         * @param {string} value
         * @return {object} This Object
         */
        withHeader(key, value) {
            //@ts-ignore
            this.headers[key] = value;
            //this._headers.set(key, value); // version map
            return this;
        }
        /**
         * Update headers.
         *
         * @param {object} headers
         * @return {object} This Object
         */
        withHeaders(headers) {
            for (const [key, value] of Object.entries(headers)) {
                //@ts-ignore
                this.headers[key] = value;
                //this._headers.set(key, value); // version map
            }
            return this;
        }
        /**
         * Check if message has a CorrelationID.
         *
         * @return {bool} returns true if message headers contains 'CorrelationID', else 'false'.
         */
        hasCorrelationID() {
            return this.headers.hasOwnProperty(HeaderKey.CorrelationID);
            //return this._headers.has(HeaderKey.CorrelationID);
        }
        /**
         * add a 'CorrelationID'.
         *
         * @param {string} correlationID - stores the 'correlationID', if this value is undefined, the 'CorrelationID' is auto generated. It's the better solution !
         * @return {object} This Object
         */
        withCorrelationID(correlationID) {
            if (Utils.isEmpty(correlationID))
                correlationID = Utils.UUIDv4();
            //@ts-ignore
            this.headers[HeaderKey.CorrelationID] = correlationID;
            //this._headers.set(HeaderKey.CorrelationID, correlationID as string);
            return this;
        }
        /**
         * add a 'CorrelationID'.
         * @deprecated Replace by withCorrelationID !
         *
         * @param {string} correlationID - stores the 'correlationID', if this value is undefined, the 'CorrelationID' is auto generated. It's the better solution !
         * @return {string} returns correlationID.
         */
        addCorrelationID(correlationID) {
            return this.withCorrelationID(correlationID).getCorrelationID();
        }
        /**
         * returns current 'CorrelationID'.
         *
         * @return { string } correlationID - if 'Correlation' does not exist returns undefined.
         */
        getCorrelationID() {
            //@ts-ignore
            return this.headers[HeaderKey.CorrelationID];
            //return this._headers.get(HeaderKey.CorrelationID);
        }
        /**
         * Check if message has a MessageID.
         *
         * @return {bool} returns true if message headers contains 'MessageID', else 'false'.
         */
        hasMessageID() {
            return this.headers.hasOwnProperty(HeaderKey.MessageID);
        }
        /**
         * add a 'MessageID'.
         *
         * @param {string} messageID - stores the 'messageID', if this value is undefined, the 'MessageID' is auto generated. It's the better solution !
         * @return {object} This Object
         */
        withMessageID(messageID) {
            if (Utils.isEmpty(messageID))
                messageID = Utils.UUIDv4();
            this.headers[HeaderKey.MessageID] = messageID;
            return this;
        }
        /**
         * add a 'MessageID'.
         * @deprecated Replace by withMessageID !
         *
         * @param {string} messageID - stores the 'messageID', if this value is undefined, the 'MessageID' is auto generated. It's the better solution !
         * @return { string } messageID
         */
        addMessageID(messageID) {
            return this.withMessageID(messageID).getMessageID();
        }
        /**
         * returns current 'MessageID'.
         *
         * @return { string } messageID - if 'messageID' does not exist returns undefined.
         */
        getMessageID() {
            return this.headers[HeaderKey.MessageID];
        }
        /**
         * returns current 'Uri'.
         *
         * @return { string } Uri - if 'Uri' does not exist returns undefined.
         */
        getUri() {
            return this.headers[HeaderKey.URI];
        }
        /**
         * Check if message has a ContentType information
         *
         * @return {boolean} returns true if message headers contains 'ContentType', else 'false'.
         */
        hasContentType() {
            return this.headers.hasOwnProperty(HeaderKey.ContentType);
        }
        /**
         * add a 'ContentType'.
         *
         * @param {string} contentType - stores 'ContentType' information -- It's an specific entry to qualified the message
         * @return {this} This Object
         */
        withContentType(contentType) {
            this.headers[HeaderKey.ContentType] = contentType;
            return this;
        }
        /**
         * add a 'ContentType'.
         * @deprecated Replace by withContentType !
         *
         * @param {string} contentType - stores 'ContentType' information -- It's an specific entry to qualified the message
         * @return {string} returns contentType
         */
        addContentType(contentType) {
            return this.withContentType(contentType).getContentType();
        }
        /**
         * returns current 'ContentType'.
         *
         * @return {string} ContentType - if 'ContentType' does not exist returns undefined.
         */
        getContentType() {
            return this.headers[HeaderKey.ContentType];
        }
        /**
         * sets the 'Status' Header.
         *
         * @param {int} status - stores 'status' information
         * @return {this} This Object
         */
        withStatus(status) {
            this.headers[HeaderKey.Status] = status.toString();
            return this;
        }
        /**
         * sets the 'Status' Header.
         * @deprecated Replace by withStatus !
         *
         * @param {int} status - stores 'status' information
         */
        setStatus(status) {
            return this.withStatus(status).getStatus().toString();
        }
        /**
         * returns current 'Status' (asNumber).
         *
         * @return {int} Status - if 'Status' does not exist returns PXPEvent.EventStatus.Undefined.
         */
        getStatus() {
            var status = this.headers[HeaderKey.Status];
            if (!Utils.isNill(status)) {
                var vStatus = parseInt(status);
                if (!isNaN(vStatus))
                    return vStatus;
                return EventStatus.Undefined;
            }
            return EventStatus.Ok;
        }
        /**
         *
         * @returns {bool} Status - return false if Status is error (err >400), and return true otherwise (if status ok or status missing)
         */
        isStatusError() {
            let status = this.getStatus();
            if (status === EventStatus.Undefined)
                return false;
            return status >= 400;
        }
        /**
         * returns topics origin.
         *
         * @return {string} Topics - if 'Topics' does not exist returns undefined.
         */
        getTopic() {
            return this.headers[HeaderKey.Topics];
            //return this._headers.get(HeaderKey.Topics);
        }
        /**
         * sets topics Target. When you send a message with a topic information, the server/gateway publish these message on this topic.
         *
         * @param {string} topic - destination topic where to send the message
         * @return {object} This Object
         */
        toTopic(topic) {
            this.headers[HeaderKey.Topics] = topic;
            //this._headers.set(HeaderKey.Topics, topic);
            return this;
        }
        /**
         *
         * @returns {boolean} returns true if a signal message.
         */
        isTopicSignal() {
            return this.getTopic() === exports.KeySignal;
        }
    }
    exports.Transport = Transport;
    Transport.DisplayType = function (type) {
        switch (type) {
            case EventType.empty:
                return 'empty';
            case EventType.text:
                return 'text';
            case EventType.bool:
                return 'bool';
            case EventType.uint64:
                return 'uint';
            case EventType.int64:
                return 'int';
            case EventType.double:
                return 'double';
            case EventType.json:
                return 'json';
            case EventType.error:
                return 'PXP.error';
            //case PXPEvent.EventType.binary:
            //    return "binary";
            case EventType.object:
                return 'PXP.object';
            case EventType.bagobjects:
                return 'PXP.bagobjects';
            case EventType.setobjects:
                return 'PXP.setobjects';
            case EventType.arrayobjects:
                return 'PXP.arrayobjects';
            case EventType.uid:
                return 'PXP.uid';
            case EventType.cmd:
                return 'PXP.command';
            default:
                return 'unknown';
        }
    };
});
