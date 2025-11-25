define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PortableUID = void 0;
    class PortableUID {
        constructor(className, id) {
            if (className) {
                if (typeof className !== 'string') {
                    throw TypeError('className must be a string');
                }
                if (id) {
                    if (typeof id === 'number') {
                        this.className = className;
                        this.id = id;
                    }
                    else
                        throw TypeError('id must be a number');
                }
                else {
                    let p = PortableUID.CreateFromString(className);
                    this.className = p.className;
                    this.id = p.id;
                }
            }
            else {
                this.className = '';
                this.id = -1;
            }
        }
        toString() {
            let sID;
            if (this.id != -1) {
                sID = '';
                const StrID = this.id.toString(16).split('').reverse();
                let iStrID = 0;
                for (let i = 0; i < 17; ++i) {
                    if (i == 8) {
                        sID += '-';
                        continue;
                    }
                    if (iStrID < StrID.length) {
                        sID += StrID[iStrID];
                    }
                    else {
                        sID += '0';
                    }
                    ++iStrID;
                } //endfor
            }
            else {
                sID = 'ffffffff-ffffffff';
            }
            return this.className + '#' + sID;
        }
        toJSON() {
            return this.toString();
        }
        [Symbol.toPrimitive](hint) {
            if (hint === 'number') {
                return this.id;
            }
            return this.toString();
        }
        static CreateFromString(str) {
            if (str) {
                const decomposeStr = str.split('#', 2);
                if (2 == decomposeStr.length) {
                    const className = decomposeStr[0];
                    const rawId = decomposeStr[1];
                    if (className.length > 0 && 17 == rawId.length && '-' == rawId[8]) {
                        const sNumberId = rawId.split('-', 2).join('').split('').reverse().join('');
                        if (!sNumberId.startsWith('ffffffffffffffff')) {
                            const numberId = Number.parseInt(sNumberId, 16);
                            if (!isNaN(numberId))
                                return new PortableUID(className, numberId);
                        }
                    }
                }
            }
            return PortableUID.Undefined();
        }
        static Undefined() {
            if (!PortableUID._undefined) {
                PortableUID._undefined = Object.freeze(new PortableUID());
            }
            return PortableUID._undefined;
        }
        isDefined() {
            return this.id !== PortableUID._undefined.id || this.className !== PortableUID._undefined.className;
        }
        static isValid(value) {
            if (value && typeof value === 'object' && value instanceof PortableUID)
                return true;
            return false;
        }
    }
    exports.PortableUID = PortableUID;
});
