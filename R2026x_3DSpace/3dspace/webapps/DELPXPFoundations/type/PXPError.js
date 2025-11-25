define(["require", "exports", "DS/Logger/Logger"], function (require, exports, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PXPError = exports.enTypeError = exports.StdCode = void 0;
    var _logger = Logger.getLogger('PXP.SYS');
    /**
     * Standard "Foundations" Code -- must be synchronized with DELPXPFoundationsErrorCode - Here only "Classic Error"
     * @readonly
     * @enum {number}
     */
    var StdCode;
    (function (StdCode) {
        StdCode[StdCode["NoError"] = 0] = "NoError";
        StdCode[StdCode["NoCodeError"] = 1] = "NoCodeError";
        StdCode[StdCode["GenericError"] = 2] = "GenericError";
        StdCode[StdCode["MemoryBadAlloc"] = 3] = "MemoryBadAlloc";
        StdCode[StdCode["InvalidArgument"] = 4] = "InvalidArgument";
        StdCode[StdCode["OutofRange"] = 5] = "OutofRange";
        StdCode[StdCode["NotImlplemented"] = 6] = "NotImlplemented";
        StdCode[StdCode["PXPErrorFromJVariant"] = 10] = "PXPErrorFromJVariant";
        StdCode[StdCode["TransportStreamError"] = 11] = "TransportStreamError";
        StdCode[StdCode["WebsocketError"] = 20] = "WebsocketError";
    })(StdCode || (exports.StdCode = StdCode = {}));
    /**
     * Typology of errors (code, hresult, exception, http, user).
     * Must be synchronized with DELPXPFoundations/DELPXPError.h/enum enTypeError.
     * @readonly
     * @enum {char}
     */
    var enTypeError;
    (function (enTypeError) {
        enTypeError["code"] = "C";
        enTypeError["hresult"] = "X";
        enTypeError["errno"] = "E";
        enTypeError["exception"] = "R";
        enTypeError["http"] = "H";
        enTypeError["user"] = "U";
        enTypeError["not_error"] = ".";
        enTypeError["native"] = "N";
    })(enTypeError || (exports.enTypeError = enTypeError = {}));
    class PXPError extends Error {
        constructor(message, code = StdCode.NoCodeError, type = enTypeError.code, domain = 'JSError', source = null) {
            super(message);
            // ResultError compliant
            this.ok = false;
            this.error = this;
            // set error name as constructor name, make it not enumerable to keep native Error behavior
            Object.defineProperty(this, 'name', {
                value: new.target.name,
                enumerable: false,
                configurable: true,
            });
            this.code = code;
            this.type = type;
            this.domain = domain;
            this.source = source;
            this.errorCode = this.code;
            this.errorType = this.type;
            this.errorMessage = this.message;
            this.errorDomain = this.domain;
            this.errorSource = this.source;
        }
        /**
         * @deprecated Using error.code
         */
        getCode() {
            return this.code;
        }
        /**
         * @deprecated Using error.type
         */
        getType() {
            return this.type;
        }
        /**
         * @deprecated Using error.message
         */
        getMessage() {
            return this.message;
        }
        /**
         * @deprecated Using error.domain
         */
        getDomain() {
            return this.domain;
        }
        hasSourceError() {
            return this.source != null;
        }
        getSourceError() {
            return this.source;
        }
        getCodeAsString() {
            switch (this.type) {
                // Display code as number
                case enTypeError.http:
                    return '' + this.type + this.code.toString(10);
                case enTypeError.code:
                case enTypeError.exception:
                case enTypeError.user:
                case enTypeError.hresult:
                case enTypeError.native:
                case enTypeError.errno:
                case enTypeError.not_error:
                    if (0 === this.code) {
                        return 'OK';
                    }
                    else if (1 === this.code) {
                        return 'KO';
                    }
                    return '' + this.type + this.code.toString(16).toUpperCase();
            }
        }
        toString() {
            let ret;
            if (0 == this.domain.length)
                ret = '[' + this.getCodeAsString() + '] ';
            else
                ret = '[' + this.domain + '/' + this.getCodeAsString() + '] ';
            ret += this.message;
            if (this.source instanceof PXPError) {
                ret += ' -> ' + this.source.toString();
            }
            return ret;
        }
        /**
         * Returns native Error
         * @deprecated No conversion need!
         */
        toNativeError() {
            //return new Error(this.toString())
            return this;
        }
        toJSON() {
            let obj = {
                code: '' + this.getCodeAsString(),
                message: this.message,
                domain: this.domain,
            };
            if (this.source instanceof PXPError) {
                obj.source = this.source.toJSON();
            }
            return obj;
        }
        static CreateFromError(error) {
            if (error instanceof PXPError)
                return error;
            return new PXPError(error.message, StdCode.GenericError, enTypeError.native, error.name);
        }
        static CreateFromJSON(json) {
            let stream = null;
            if (typeof json === 'string') {
                // if it's a string, parse it first
                try {
                    let s = JSON.parse(json);
                    if (PXPError.isCompatible(s)) {
                        stream = s;
                    }
                    _logger.debug('PXPError.CreateFromJSON: not compatible json >>' + json);
                }
                catch (err) {
                    // invalid stream...
                    _logger.debug('PXPError.CreateFromJSON: invalid json >>' + json);
                }
            }
            else {
                stream = json;
            }
            if (stream !== null) {
                let codeAsString = stream.code; // PXPErrorFromJVariant
                let msg = stream.message || '';
                let domain = stream.domain || '';
                let eType;
                let cType = codeAsString[0];
                let code = NaN;
                if (codeAsString === 'OK') {
                    eType = enTypeError.not_error;
                    code = 0;
                }
                else if (codeAsString === 'KO') {
                    eType = enTypeError.code;
                    code = 1;
                }
                else {
                    switch (cType) {
                        case 'H': //enTypeError.http:
                            eType = enTypeError.http;
                            code = Number.parseInt(codeAsString.substring(1), 10);
                            break;
                        case 'C':
                            eType = enTypeError.code;
                            code = Number.parseInt(codeAsString.substring(1), 16);
                            break;
                        case 'R':
                            eType = enTypeError.exception;
                            code = Number.parseInt(codeAsString.substring(1), 16);
                            break;
                        case 'U':
                            eType = enTypeError.user;
                            code = Number.parseInt(codeAsString.substring(1), 16);
                            break;
                        case 'X':
                            eType = enTypeError.hresult;
                            code = Number.parseInt(codeAsString.substring(1), 16);
                            break;
                        case 'N':
                            eType = enTypeError.native;
                            code = Number.parseInt(codeAsString.substring(1), 16);
                            break;
                        case 'E':
                            eType = enTypeError.errno;
                            code = Number.parseInt(codeAsString.substring(1), 16);
                            break;
                        case '.':
                            eType = enTypeError.errno;
                            code = Number.parseInt(codeAsString.substring(1), 16);
                            break;
                        default:
                            eType = null;
                            break;
                    } //endswitch
                }
                let sourceError = null;
                if (stream.source) {
                    sourceError = PXPError.CreateFromJSON(stream.source);
                }
                if (!isNaN(code) && eType != null) {
                    return new PXPError(msg, code, eType, domain, sourceError);
                }
            }
            return new PXPError('invalid stream PXPError', StdCode.PXPErrorFromJVariant, enTypeError.code, 'Foundations'); // PXPErrorFromJVariant
        }
        static isCompatible(stream) {
            if (stream &&
                typeof stream === 'object' &&
                'code' in stream &&
                typeof stream.code === 'string' &&
                'message' in stream &&
                typeof stream.message === 'string'
            //&& 'domain' in stream &&              // Domain is optional
            //typeof stream.domain === 'string'
            )
                return true;
            else
                return false;
        }
    }
    exports.PXPError = PXPError;
});
