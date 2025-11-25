// Reviver to uses with JSON.Parse
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CorpusManager = exports.enDeSerializerLevel = exports.ReviverPolicies = void 0;
    class ReviverPolicies {
        static supportDate(ctx) {
            if (ctx && 'supportDate' in ctx)
                return ctx.supportDate;
            return true;
        }
        static supportPortableUID(ctx) {
            if (ctx && 'supportPortableUID' in ctx)
                return ctx.supportPortableUID;
            return true;
        }
    }
    exports.ReviverPolicies = ReviverPolicies;
    var enDeSerializerLevel;
    (function (enDeSerializerLevel) {
        /// restore object as JSON.Parse
        enDeSerializerLevel[enDeSerializerLevel["JSON"] = 0] = "JSON";
        // restore object as Javascript datatype (Date)
        enDeSerializerLevel[enDeSerializerLevel["JS"] = 1] = "JS";
        // restore object as PXP datatype (PortableUID)
        enDeSerializerLevel[enDeSerializerLevel["PXP"] = 3] = "PXP";
    })(enDeSerializerLevel || (exports.enDeSerializerLevel = enDeSerializerLevel = {}));
    class ReviverContext {
        constructor(supportLevel) {
            this._deserializeLevel = supportLevel;
        }
        get supportDate() {
            return enDeSerializerLevel.JS == (this._deserializeLevel & enDeSerializerLevel.JS);
        }
        get supportPortableUID() {
            return enDeSerializerLevel.PXP == (this._deserializeLevel & enDeSerializerLevel.PXP);
        }
    }
    class CorpusManager {
        constructor() {
            this._reviverLevel = enDeSerializerLevel.JS;
            this._modelFactory = new Map();
        }
        static getInstance() {
            if (!CorpusManager.instance) {
                CorpusManager.instance = new CorpusManager();
            }
            return CorpusManager.instance;
        }
        /// Registry Reset  --
        static setDefaultDeserializerLevel(level) {
            CorpusManager.getInstance()._reviverLevel = level;
        }
        /// Registry Reset  -- DO NOT USES OUTSIDE ODT...
        static reset() {
            CorpusManager.getInstance()._modelFactory.clear();
        }
        /// Registry FactoryObject
        static registry(className, reviver) {
            //@ts-ignore
            if (typeof reviver.prototype === 'object') { //Assume it's class...
                if (reviver && 'jsonReviver' in reviver && typeof reviver.jsonReviver === 'function') {
                    reviver = reviver.jsonReviver;
                }
                else
                    return;
            }
            if (typeof reviver === 'function') {
                CorpusManager.getInstance()._registry(className, reviver);
            }
        }
        _registry(className, reviver) {
            this._modelFactory.set(className, reviver);
        }
        /// Global Reviver
        static globalReviver(supportType) {
            const ctx = new ReviverContext(supportType || CorpusManager.getInstance()._reviverLevel);
            return function (key, value) {
                // @ts-ignore
                const currentClass = this === null || this === void 0 ? void 0 : this['@class'];
                if (currentClass && currentClass != ctx.currentClassName) {
                    const splitClass = currentClass.split('~', 2);
                    const myClass = splitClass[0];
                    if (splitClass.length > 1) {
                        //with id...
                        //ctx.storeObject( currentClass, this );
                    }
                    //console.log(`Class ${myClass}`);
                    ctx.currentClassName = myClass;
                    ctx.currentReviver = CorpusManager.getInstance()._modelFactory.get(ctx.currentClassName);
                }
                else {
                    ctx.currentClassName = undefined;
                    ctx.currentReviver = undefined;
                }
                if (ctx.currentReviver) {
                    return ctx.currentReviver(key, value, ctx);
                }
                return value;
            };
        }
    }
    exports.CorpusManager = CorpusManager;
});
