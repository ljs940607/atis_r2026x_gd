define(["require", "exports", "../event/Transport", "../corpus/CorpusManager", "../type/PXPError", "DS/DELPXPFoundations/PXPUtils", "DS/Logger/Logger"], function (require, exports, Transport_1, CorpusManager_1, PXPError_1, Utils, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JSONv2 = void 0;
    var _logger = Logger.getLogger('PXP.SYS');
    class ProtocolJSONv2 {
        constructor() {
            this.isText = true;
        }
        decode(message) {
            // JSON ?
            if (Utils.isString(message)) {
                let input = message.trim();
                if (input[0] === '[' && input[input.length - 1] === ']') {
                    let obj = null;
                    try {
                        // uses Corpus Manager
                        let reviver = CorpusManager_1.CorpusManager.globalReviver();
                        obj = JSON.parse(input, reviver);
                    }
                    catch (e) {
                        _logger.warn("PXPJSONv2-'" + input + "' => Not a valid JSON type ! (" + e + ')');
                        //TODO FH6: Error management !
                        return Transport_1.Transport.createText(message); // envoie comme texte...
                    }
                    if (obj) {
                        // Check is PXPJSONv2
                        if (Array.isArray(obj)) {
                            if (obj.length === 4) {
                                if (obj[0] === 'PXPv2') {
                                    try {
                                        let evt = null;
                                        let contentType = obj[2];
                                        let content = obj[3];
                                        let cType;
                                        let cFlag;
                                        if (!contentType) {
                                            cType = Transport_1.EventType.empty;
                                            cFlag = Transport_1.EventFlag.message;
                                        }
                                        else if (contentType.length === 1) {
                                            cType = contentType[0];
                                            cFlag = Transport_1.EventFlag.message;
                                        }
                                        else if (contentType.length === 2) {
                                            cType = contentType[0];
                                            cFlag = contentType[1];
                                        }
                                        else {
                                            cType = Transport_1.EventType.empty;
                                            cFlag = Transport_1.EventFlag.message;
                                        }
                                        switch (cType) {
                                            case Transport_1.EventType.empty:
                                                evt = new Transport_1.Transport(Transport_1.EventType.empty, null);
                                                break;
                                            case Transport_1.EventType.text:
                                                evt = Transport_1.Transport.createText(content);
                                                break;
                                            case Transport_1.EventType.json:
                                                evt = Transport_1.Transport.createJson(content);
                                                break;
                                            case Transport_1.EventType.error: {
                                                let err = PXPError_1.PXPError.CreateFromJSON(content);
                                                evt = Transport_1.Transport.createError(err);
                                                break;
                                            }
                                            //case PXPEvent.EventType.binary:
                                            //    break;
                                            case Transport_1.EventType.bool:
                                                evt = Transport_1.Transport.createBool(content);
                                                break;
                                            case Transport_1.EventType.object:
                                                evt = Transport_1.Transport.createPXP_Object(content);
                                                break;
                                            case Transport_1.EventType.bagobjects:
                                                evt = Transport_1.Transport.createPXP_BagObjects(content);
                                                break;
                                            case Transport_1.EventType.arrayobjects:
                                                evt = Transport_1.Transport.createPXP_ArrayObjects(content);
                                                break;
                                            case Transport_1.EventType.setobjects:
                                                evt = Transport_1.Transport.createPXP_SetObjects(content);
                                                break;
                                            case Transport_1.EventType.uid:
                                                evt = Transport_1.Transport.createPXP_Uid(content);
                                                break;
                                            case Transport_1.EventType.uint64:
                                                evt = Transport_1.Transport.createUint64(content);
                                                break;
                                            case Transport_1.EventType.int64:
                                                evt = Transport_1.Transport.createInt64(content);
                                                break;
                                            case Transport_1.EventType.double:
                                                evt = Transport_1.Transport.createDouble(content);
                                                break;
                                            case Transport_1.EventType.cmd:
                                                evt = Transport_1.Transport.createInternalCmd(content);
                                                break;
                                            default:
                                                _logger.warn('PXPJSONv2- Unknown type !');
                                                break;
                                        }
                                        if (Utils.isNull(evt))
                                            evt = new Transport_1.Transport(Transport_1.EventType.empty, null);
                                        switch (cFlag) {
                                            case Transport_1.EventFlag.request:
                                                evt.flagAsRequest();
                                                break;
                                            case Transport_1.EventFlag.response:
                                                evt.flagAsResponse();
                                                break;
                                            case Transport_1.EventFlag.message:
                                                break;
                                        }
                                        let oHeader = obj[1];
                                        if (Utils.isObject(oHeader)) {
                                            // headers
                                            evt.withHeaders(oHeader);
                                        }
                                        return evt;
                                    }
                                    catch (e) {
                                        _logger.warn("PXPJSONv2-'" + input + "' => invalid Stream ! (" + e + ')');
                                        //TODO FH6: Error management !
                                        return Transport_1.Transport.createText(message); // envoie comme texte...
                                    }
                                }
                            }
                        }
                    }
                }
                return Transport_1.Transport.createText(message); // envoie comme texte...
            }
            _logger.warn('PXPJSONv2- Not a valid message type ! (not a string)');
            return undefined;
        }
        encode(message) {
            let cType = message.getType();
            if (!message.isSimpleMessage()) {
                cType += message.isRequest() ? Transport_1.EventFlag.request : message.isResponse() ? Transport_1.EventFlag.response : Transport_1.EventFlag.message;
            }
            if (message.hasHeaders()) {
                return JSON.stringify(['PXPv2', message.getHeaders(), cType, message.getContent()]);
            }
            return JSON.stringify(['PXPv2', null, cType, message.getContent()]);
        }
    }
    exports.JSONv2 = {
        Protocol: new ProtocolJSONv2(),
    };
});
