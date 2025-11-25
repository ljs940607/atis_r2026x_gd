define(["require", "exports", "./CorpusManager"], function (require, exports, CorpusManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.enSerializerLevel = void 0;
    exports.reviverFinalizeObject = reviverFinalizeObject;
    exports.reviverArray = reviverArray;
    exports.deserializeFromPXPJSON = deserializeFromPXPJSON;
    exports.serializeToPXPJSON = serializeToPXPJSON;
    var enSerializerLevel;
    (function (enSerializerLevel) {
        /// generate with JSON.Stringify
        enSerializerLevel[enSerializerLevel["StdStringify"] = 0] = "StdStringify";
        // inject PXP information (@class)
        enSerializerLevel[enSerializerLevel["PXP"] = 1] = "PXP";
    })(enSerializerLevel || (exports.enSerializerLevel = enSerializerLevel = {}));
    /// Reviver - Finalize Object
    function reviverFinalizeObject(type, value) {
        if (typeof value === 'object') {
            const newObj = new type();
            Object.assign(newObj, value);
            // @ts-ignore
            delete newObj['@class']; // nettoyage uniquement si PXPObject...
            return newObj;
        }
        throw new Error('deserialize failed (class ' + type.constructor.name + ')');
    }
    /// Reviver - Support Array and nested Array
    function reviverArray(value, transform) {
        return value.map((val) => {
            if (Array.isArray(val)) { // support nested Array
                return reviverArray(val, transform);
            }
            else {
                return transform(val);
            }
        });
    }
    function deserializeFromPXPJSON(type, jsonString, serializerLevel) {
        const streamObj = JSON.parse(jsonString, CorpusManager_1.CorpusManager.globalReviver(serializerLevel));
        return reviverFinalizeObject(type, streamObj);
    }
    class stringifyCtx {
        constructor() {
            this._id = 0;
        }
        get id() {
            return ++this._id;
        }
    }
    function serializeToPXPJSON(instance, serializerLevel = enSerializerLevel.PXP) {
        if (enSerializerLevel.StdStringify == serializerLevel) {
            return JSON.stringify(instance);
        }
        let ctx = new stringifyCtx();
        const streamJSON = JSON.stringify(instance, (key, value) => {
            if (key == '@class') {
                return value + '~' + ctx.id;
            }
            return value;
        });
        return streamJSON;
    }
});
