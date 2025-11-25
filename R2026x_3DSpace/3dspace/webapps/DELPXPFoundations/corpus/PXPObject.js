//import { PortableUID } from '../type/PortableUID'
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArrayObjects = exports.SetObjects = exports.BagObjects = exports.PXPObject = void 0;
    /// Base class uses to define 'Corpus'. This class is used by method 'serializeToPXPJSON' to inject factory...
    class PXPObject {
        get className() {
            return this.constructor.name;
        }
        toJSON() {
            return Object.assign({ '@class': this.className }, this);
        }
        static isCompatible(value) {
            if (value && typeof value === 'object' && (value instanceof PXPObject || ('@class' in value && typeof value['@class'] === 'string')))
                return true;
            else
                return false;
        }
        static isPXPObject(value) {
            if (value && typeof value === 'object' && value instanceof PXPObject)
                return true;
            return false;
        }
        static retrieveClass(value) {
            if (value instanceof PXPObject) {
                return value.className;
            }
            else
                return value['@class']; // ClassName or ClassName~<ID> ?
        }
    }
    exports.PXPObject = PXPObject;
    class BagObjects {
        constructor() {
            this._container = new Set();
        }
        get size() {
            return this._container.size;
        }
        clear() {
            this._container.clear();
        }
        push(item) {
            if (!PXPObject.isCompatible(item)) {
                throw new Error("BagObject.push failed ! Object must be contains '@class' property or instance of PXPObject !");
            }
            this._container.add(item);
        }
        [Symbol.iterator]() {
            return this._container[Symbol.iterator]();
        }
        toJSON() {
            let json = {};
            let id = 0;
            for (const item of this._container) {
                if ('@class' in item) {
                    const entries = item['@class'];
                    if (typeof entries === 'string') {
                        // tilde ?
                        const splitClass = entries.split('~', 2);
                        const myClass = splitClass[0] + '~' + ++id; // TODO FH6: Support Grappe !!
                        item['@class'] = myClass; // resync with '@class'...
                        json[myClass] = item;
                    }
                }
            } //endfor
            return json;
        }
        static isCompatible(value) {
            if (value && typeof value === 'object') {
                if (value instanceof BagObjects)
                    return true;
                // compatible ?
                for (const [key, val] of Object.entries(value)) {
                    if (!PXPObject.isCompatible(val))
                        return false;
                } //endfor
                return true;
            }
            return false;
        }
        static isValid(value) {
            if (value && typeof value === 'object' && value instanceof BagObjects)
                return true;
            return false;
        }
    }
    exports.BagObjects = BagObjects;
    class SetObjects {
        constructor() {
            this._container = new Set();
        }
        get size() {
            return this._container.size;
        }
        clear() {
            this._container.clear();
        }
        insert(item) {
            if (!PXPObject.isCompatible(item)) {
                throw new Error("SetObject.insert failed ! Object must be contains '@class' property or instance of PXPObject !");
            }
            this._container.add(item);
        }
        delete(item) {
            return this._container.delete(item);
        }
        //public forEach(callbackfn: (value: PXPObject) => void, thisArg?: any): void {
        //  this._container.forEach( )
        //}
        [Symbol.iterator]() {
            return this._container[Symbol.iterator]();
        }
        toJSON() {
            return Array.from(this._container);
        }
        static isCompatible(value) {
            if (value && typeof value === 'object') {
                if (value instanceof SetObjects)
                    return true;
                if (Array.isArray(value)) {
                    for (const item of value) {
                        if (!PXPObject.isCompatible(item))
                            return false;
                    } //endfor
                    return true;
                }
            }
            return false;
        }
        static isValid(value) {
            if (value && typeof value === 'object' && value instanceof SetObjects)
                return true;
            return false;
        }
    }
    exports.SetObjects = SetObjects;
    class ArrayObjects extends Array {
        static isCompatible(value) {
            if (value && typeof value === 'object') {
                if (value instanceof ArrayObjects)
                    return true;
                if (Array.isArray(value)) {
                    for (const item of value) {
                        if (typeof item === 'string')
                            continue; // TODO FH6: Check link... : <ClassName>~<id>
                        if (!PXPObject.isCompatible(item))
                            return false;
                    } //endfor
                    return true;
                }
            }
            return false;
        }
        static isValid(value) {
            if (value && typeof value === 'object' && value instanceof SetObjects)
                return true;
            return false;
        }
    }
    exports.ArrayObjects = ArrayObjects;
});
