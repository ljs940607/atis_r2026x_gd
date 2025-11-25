/// <amd-module name='DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary'/>
define("DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsLocalTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPEventServices/EPEventTarget", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeCastConfig", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeCastAdvancedConfig", "DS/EPEventServices/EPEvent"], function (require, exports, Enums, LocalTypeLibrary, Events, EventTarget, TypeCastConfig, TypeCastAdvancedConfig, EPEvent) {
    "use strict";
    var globalTypeLibrary = new LocalTypeLibrary();
    var castConfig = {};
    castConfig.objectTypeOptions = {};
    castConfig.objectTypeOptions.allowExtraProperty = true;
    var reservedByName = {};
    var eventTarget = new EventTarget();
    var regExpAlphanumeric = new RegExp(/^[a-z0-9_]+$/i);
    var advancedTypesRegistered = false;
    var TypeLibrary = /** @class */ (function () {
        function TypeLibrary() {
        }
        TypeLibrary.isReservedName = function (iName) {
            return reservedByName.hasOwnProperty(iName);
        };
        TypeLibrary.checkName = function (iGraphContext, iName) {
            if (typeof iName !== 'string') {
                throw new TypeError('iName argument is not a string');
            }
            if (!regExpAlphanumeric.test(iName)) {
                throw new TypeError('iName argument is not alphanumeric');
            }
            if (TypeLibrary.isReservedName(iName)) {
                throw new TypeError(iName + ' is a reserved name');
            }
            if (TypeLibrary.hasType(iGraphContext, iName, Enums.FTypeCategory.fAll)) {
                throw new TypeError(iName + ' is already registered');
            }
        };
        TypeLibrary.checkNames = function (iGraphContext, iEnumTypes, iObjectTypes, iClassTypes, iEventTypes) {
            if (!Array.isArray(iEnumTypes)) {
                throw new TypeError('iEnumTypes argument is not an Array');
            }
            if (!Array.isArray(iObjectTypes)) {
                throw new TypeError('iObjectTypes argument is not an Array');
            }
            if (!Array.isArray(iClassTypes)) {
                throw new TypeError('iClassTypes argument is not an Array');
            }
            if (!Array.isArray(iEventTypes)) {
                throw new TypeError('iEventTypes argument is not an Array');
            }
            for (var et = 0; et < iEnumTypes.length; et++) {
                var enumType = iEnumTypes[et];
                if (!(enumType instanceof Object)) {
                    throw new TypeError('iEnumTypes[' + et + '] argument is not an Object');
                }
                TypeLibrary.checkName(iGraphContext, enumType.name);
            }
            for (var ot = 0; ot < iObjectTypes.length; ot++) {
                var objectType = iObjectTypes[ot];
                if (!(objectType instanceof Object)) {
                    throw new TypeError('iObjectTypes[' + ot + '] argument is not an Object');
                }
                TypeLibrary.checkName(iGraphContext, objectType.name);
            }
            for (var ct = 0; ct < iClassTypes.length; ct++) {
                var classType = iClassTypes[ct];
                if (!(classType instanceof Object)) {
                    throw new TypeError('iClassTypes[' + ct + '] argument is not an Object');
                }
                TypeLibrary.checkName(iGraphContext, classType.name);
            }
            for (var et = 0; et < iEventTypes.length; et++) {
                var eventType = iEventTypes[et];
                if (!(eventType instanceof Object)) {
                    throw new TypeError('iEventTypes[' + et + '] argument is not an Object');
                }
                TypeLibrary.checkName(iGraphContext, eventType.name);
            }
        };
        TypeLibrary.getArrayValueTypeName = function (iName) {
            var typeName;
            if (typeof iName === 'string') {
                var matchResult = iName.match(/^Array<(.*)>$/);
                typeName = matchResult !== null ? matchResult[1] : undefined;
            }
            return typeName;
        };
        TypeLibrary.castValueType = function (iTypeName, iValue) {
            if (iValue !== undefined) {
                var arrayValueTypeName = TypeLibrary.getArrayValueTypeName(iTypeName);
                if (TypeLibrary.hasGlobalType(arrayValueTypeName, Enums.FTypeCategory.fBase | Enums.FTypeCategory.fNumerical)) {
                    iValue = TypeLibrary.castValueType('Array', iValue);
                    if (iValue !== undefined) {
                        for (var i = 0; i < iValue.length; i++) {
                            iValue[i] = TypeLibrary.castValueType(arrayValueTypeName, iValue[i]);
                        }
                    }
                }
                else if (TypeLibrary.hasGlobalType(iTypeName, Enums.FTypeCategory.fBase)) {
                    if (!TypeLibrary.isGlobalValueType(iTypeName, iValue)) {
                        iValue = globalTypeLibrary.basesByName[iTypeName].convert(iValue);
                    }
                }
                else if (TypeLibrary.hasGlobalType(iTypeName, Enums.FTypeCategory.fNumerical)) {
                    if (!TypeLibrary.isGlobalValueType(iTypeName, iValue)) {
                        iValue = globalTypeLibrary.numericalsByName[iTypeName].convert(iValue);
                    }
                }
            }
            return iValue;
        };
        TypeLibrary.isValueType = function (iGraphContext, iTypeName, iValue) {
            var result = false;
            if (iGraphContext !== undefined) {
                result = result || TypeLibrary.isLocalCustomValueType(iGraphContext, iTypeName, iValue);
            }
            result = result || TypeLibrary.isGlobalValueType(iTypeName, iValue);
            return result;
        };
        TypeLibrary.hasType = function (iGraphContext, iName, iTypeCategory) {
            var result = false;
            if (iGraphContext !== undefined) {
                result = result || TypeLibrary.hasLocalCustomType(iGraphContext, iName, iTypeCategory);
            }
            result = result || TypeLibrary.hasGlobalType(iName, iTypeCategory);
            return result;
        };
        TypeLibrary.getTypeCategory = function (iGraphContext, iName) {
            var typeCategory;
            if (iGraphContext !== undefined) {
                typeCategory = typeCategory || TypeLibrary.getLocalCustomTypeCategory(iGraphContext, iName);
            }
            typeCategory = typeCategory || TypeLibrary.getGlobalTypeCategory(iName);
            return typeCategory;
        };
        TypeLibrary.getType = function (iGraphContext, iName) {
            var type;
            if (iGraphContext !== undefined) {
                type = type || TypeLibrary.getLocalCustomType(iGraphContext, iName);
            }
            type = type || TypeLibrary.getGlobalType(iName);
            return type;
        };
        TypeLibrary.getDefaultValue = function (iGraphContext, iTypeName) {
            var type;
            if (iGraphContext !== undefined) {
                type = type || TypeLibrary.getLocalCustomDefaultValue(iGraphContext, iTypeName);
            }
            type = type || TypeLibrary.getGlobalDefaultValue(iTypeName);
            return type;
        };
        TypeLibrary.getTypeNameList = function (iGraphContext, iTypeCategory) {
            var typeNameList = [];
            if (iGraphContext !== undefined) {
                Array.prototype.push.apply(typeNameList, TypeLibrary.getLocalCustomTypeNameList(iGraphContext, iTypeCategory));
            }
            Array.prototype.push.apply(typeNameList, TypeLibrary.getGlobalTypeNameList(iTypeCategory));
            return typeNameList;
        };
        TypeLibrary.getValueFromJSONValue = function (iGraphContext, iJSONValue, iTypeName) {
            var value;
            if (iGraphContext !== undefined && TypeLibrary.hasLocalCustomType(iGraphContext, iTypeName, Enums.FTypeCategory.fAll)) {
                value = TypeLibrary.getLocalCustomValueFromJSONValue(iGraphContext, iJSONValue, iTypeName);
            }
            else {
                value = TypeLibrary.getGlobalValueFromJSONValue(iJSONValue, iTypeName);
            }
            return value;
        };
        TypeLibrary.getJSONValueFromValue = function (iGraphContext, iValue, iTypeName) {
            var jsonValue;
            if (iGraphContext !== undefined && TypeLibrary.hasLocalCustomType(iGraphContext, iTypeName, Enums.FTypeCategory.fAll)) {
                jsonValue = TypeLibrary.getLocalCustomJSONValueFromValue(iGraphContext, iValue, iTypeName);
            }
            else {
                jsonValue = TypeLibrary.getGlobalJSONValueFromValue(iValue, iTypeName);
            }
            return jsonValue;
        };
        TypeLibrary.getCastLevel = function (iGraphContext, iFromTypeName, iToTypeName) {
            var castLevel;
            if (iGraphContext !== undefined && (TypeLibrary.hasLocalCustomType(iGraphContext, iFromTypeName, Enums.FTypeCategory.fAll) ||
                TypeLibrary.hasLocalCustomType(iGraphContext, iToTypeName, Enums.FTypeCategory.fAll))) {
                castLevel = TypeLibrary.getLocalCustomCastLevel(iGraphContext, iFromTypeName, iToTypeName);
            }
            else {
                castLevel = TypeLibrary.getGlobalCastLevel(iFromTypeName, iToTypeName);
            }
            return castLevel;
        };
        // Global
        TypeLibrary.registerGlobalEnumType = function (iName, iEnum) {
            TypeLibrary.checkName(undefined, iName);
            globalTypeLibrary.registerEnumType(iName, iEnum);
            var newEvt = new Events.TypeLibraryRegisterGlobalEvent();
            newEvt.name = iName;
            eventTarget.dispatchEvent(newEvt);
        };
        TypeLibrary.registerGlobalObjectType = function (iName, iObjectDesc) {
            TypeLibrary.checkName(undefined, iName);
            globalTypeLibrary.registerObjectType(iName, iObjectDesc);
            var newEvt = new Events.TypeLibraryRegisterGlobalEvent();
            newEvt.name = iName;
            eventTarget.dispatchEvent(newEvt);
        };
        TypeLibrary.registerGlobalClassType = function (iName, iClassCtor, iClassDesc) {
            TypeLibrary.checkName(undefined, iName);
            globalTypeLibrary.registerClassType(iName, iClassCtor, iClassDesc);
            var newEvt = new Events.TypeLibraryRegisterGlobalEvent();
            newEvt.name = iName;
            eventTarget.dispatchEvent(newEvt);
        };
        TypeLibrary.registerGlobalEventType = function (iName, iEventCtor, iEventDesc, iSendable) {
            TypeLibrary.checkName(undefined, iName);
            globalTypeLibrary.registerEventType(iName, iEventCtor, iEventDesc, iSendable);
            var newEvt = new Events.TypeLibraryRegisterGlobalEvent();
            newEvt.name = iName;
            eventTarget.dispatchEvent(newEvt);
        };
        TypeLibrary.registerGlobalTypes = function (iEnumTypes, iObjectTypes, iClassTypes, iEventTypes) {
            TypeLibrary.checkNames(undefined, iEnumTypes, iObjectTypes, iClassTypes, iEventTypes);
            globalTypeLibrary.registerTypes(iEnumTypes, iObjectTypes, iClassTypes, iEventTypes);
            var types = [];
            Array.prototype.push.apply(types, iEnumTypes);
            Array.prototype.push.apply(types, iObjectTypes);
            Array.prototype.push.apply(types, iClassTypes);
            Array.prototype.push.apply(types, iEventTypes);
            for (var t = 0; t < types.length; t++) {
                var newEvt = new Events.TypeLibraryRegisterGlobalEvent();
                newEvt.name = types[t].name;
                eventTarget.dispatchEvent(newEvt);
            }
        };
        TypeLibrary.isGlobalValueType = function (iTypeName, iValue) {
            return globalTypeLibrary.isValueType(iTypeName, iValue);
        };
        TypeLibrary.hasGlobalType = function (iName, iTypeCategory) {
            return globalTypeLibrary.hasType(iName, iTypeCategory);
        };
        TypeLibrary.getGlobalTypeCategory = function (iName) {
            return globalTypeLibrary.getTypeCategory(iName);
        };
        TypeLibrary.getGlobalType = function (iName) {
            return globalTypeLibrary.getType(iName);
        };
        TypeLibrary.getGlobalTypeNameList = function (iTypeCategory) {
            return globalTypeLibrary.getTypeNameList(iTypeCategory);
        };
        TypeLibrary.getGlobalDefaultValue = function (iTypeName) {
            return globalTypeLibrary.getDefaultValue(iTypeName);
        };
        TypeLibrary.getGlobalValueFromJSONValue = function (iJSONValue, iTypeName) {
            return globalTypeLibrary.getValueFromJSONValue(iJSONValue, iTypeName);
        };
        TypeLibrary.getGlobalJSONValueFromValue = function (iValue, iTypeName) {
            return globalTypeLibrary.getJSONValueFromValue(iValue, iTypeName);
        };
        TypeLibrary.getGlobalCastLevel = function (iFromTypeName, iToTypeName) {
            return globalTypeLibrary.getCastLevel(iFromTypeName, iToTypeName);
        };
        // Local Custom
        TypeLibrary.checkContext = function (iGraphContext) {
            var GraphBlockCtr = TypeLibrary.__GraphBlock;
            if (!(iGraphContext instanceof GraphBlockCtr)) {
                throw new TypeError('iGraphContext argument is not a GraphBlock');
            }
            if (iGraphContext.getGraphContext() !== iGraphContext) {
                throw new TypeError('iGraphContext argument is not a GraphContext');
            }
        };
        TypeLibrary.registerLocalCustomObjectType = function (iGraphContext, iName, iObjectDesc) {
            TypeLibrary.checkContext(iGraphContext);
            TypeLibrary.checkName(iGraphContext, iName);
            iGraphContext.getLocalTypeLibrary().registerObjectType(iName, iObjectDesc);
            var newEvt = new Events.TypeLibraryRegisterLocalCustomEvent();
            newEvt.name = iName;
            newEvt.graphContext = iGraphContext;
            eventTarget.dispatchEvent(newEvt);
        };
        TypeLibrary.updateLocalCustomObjectType = function (iGraphContext, iName, iObjectDesc, iFromJSON) {
            if (iFromJSON === void 0) { iFromJSON = false; }
            TypeLibrary.checkContext(iGraphContext);
            var result = iGraphContext.getLocalTypeLibrary().updateObjectType(iName, iObjectDesc, iFromJSON);
            if (result) {
                var newEvt = new Events.TypeLibraryUpdateLocalCustomEvent();
                newEvt.name = iName;
                newEvt.graphContext = iGraphContext;
                eventTarget.dispatchEvent(newEvt);
            }
        };
        TypeLibrary.unregisterLocalCustomObjectType = function (iGraphContext, iName) {
            TypeLibrary.checkContext(iGraphContext);
            iGraphContext.getLocalTypeLibrary().unregisterObjectType(iName);
            var newEvt = new Events.TypeLibraryUnregisterLocalCustomEvent();
            newEvt.name = iName;
            newEvt.graphContext = iGraphContext;
            eventTarget.dispatchEvent(newEvt);
        };
        TypeLibrary.registerLocalCustomTypes = function (iGraphContext, iObjectTypes, iFromJSON) {
            if (iFromJSON === void 0) { iFromJSON = false; }
            TypeLibrary.checkContext(iGraphContext);
            TypeLibrary.checkNames(iGraphContext, [], iObjectTypes, [], []);
            iGraphContext.getLocalTypeLibrary().registerTypes([], iObjectTypes, [], [], iFromJSON);
            var types = iObjectTypes;
            for (var t = 0; t < types.length; t++) {
                var newEvt = new Events.TypeLibraryRegisterLocalCustomEvent();
                newEvt.name = types[t].name;
                newEvt.graphContext = iGraphContext;
                eventTarget.dispatchEvent(newEvt);
            }
        };
        TypeLibrary.updateLocalCustomTypes = function (iGraphContext, iObjectTypes, iFromJSON) {
            if (iFromJSON === void 0) { iFromJSON = false; }
            TypeLibrary.checkContext(iGraphContext);
            for (var ot = 0; ot < iObjectTypes.length; ot++) {
                var objectType = iObjectTypes[ot];
                TypeLibrary.updateLocalCustomObjectType(iGraphContext, objectType.name, objectType.descriptor, iFromJSON);
            }
        };
        TypeLibrary.unregisterLocalCustomTypes = function (iGraphContext, iObjectNames) {
            TypeLibrary.checkContext(iGraphContext);
            iGraphContext.getLocalTypeLibrary().unregisterTypes(iObjectNames);
            var names = iObjectNames;
            for (var n = 0; n < names.length; n++) {
                var newEvt = new Events.TypeLibraryUnregisterLocalCustomEvent();
                newEvt.name = names[n];
                newEvt.graphContext = iGraphContext;
                eventTarget.dispatchEvent(newEvt);
            }
        };
        TypeLibrary.isLocalCustomValueType = function (iGraphContext, iTypeName, iValue) {
            TypeLibrary.checkContext(iGraphContext);
            return iGraphContext.getLocalTypeLibrary().isValueType(iTypeName, iValue);
        };
        TypeLibrary.hasLocalCustomType = function (iGraphContext, iName, iTypeCategory) {
            TypeLibrary.checkContext(iGraphContext);
            return iGraphContext.getLocalTypeLibrary().hasType(iName, iTypeCategory);
        };
        TypeLibrary.getLocalCustomTypeCategory = function (iGraphContext, iName) {
            TypeLibrary.checkContext(iGraphContext);
            return iGraphContext.getLocalTypeLibrary().getTypeCategory(iName);
        };
        TypeLibrary.getLocalCustomType = function (iGraphContext, iName) {
            TypeLibrary.checkContext(iGraphContext);
            return iGraphContext.getLocalTypeLibrary().getType(iName);
        };
        TypeLibrary.getLocalCustomTypeNameList = function (iGraphContext, iTypeCategory) {
            TypeLibrary.checkContext(iGraphContext);
            return iGraphContext.getLocalTypeLibrary().getTypeNameList(iTypeCategory);
        };
        TypeLibrary.getLocalCustomDefaultValue = function (iGraphContext, iTypeName) {
            TypeLibrary.checkContext(iGraphContext);
            return iGraphContext.getLocalTypeLibrary().getDefaultValue(iTypeName);
        };
        TypeLibrary.getLocalCustomValueFromJSONValue = function (iGraphContext, iJSONValue, iTypeName) {
            TypeLibrary.checkContext(iGraphContext);
            return iGraphContext.getLocalTypeLibrary().getValueFromJSONValue(iJSONValue, iTypeName);
        };
        TypeLibrary.getLocalCustomJSONValueFromValue = function (iGraphContext, iValue, iTypeName) {
            TypeLibrary.checkContext(iGraphContext);
            return iGraphContext.getLocalTypeLibrary().getJSONValueFromValue(iValue, iTypeName);
        };
        TypeLibrary.getLocalCustomCastLevel = function (iGraphContext, iFromTypeName, iToTypeName) {
            TypeLibrary.checkContext(iGraphContext);
            return iGraphContext.getLocalTypeLibrary().getCastLevel(iFromTypeName, iToTypeName);
        };
        TypeLibrary.fromJSONLocalCustom = function (iGraphContext, iJSONLocalCustom) {
            if (iJSONLocalCustom !== undefined) {
                TypeLibrary.checkContext(iGraphContext);
                if (iJSONLocalCustom.objects !== undefined) {
                    var names = TypeLibrary.getLocalCustomTypeNameList(iGraphContext, Enums.FTypeCategory.fObject);
                    var objectsToUnregister = [];
                    for (var o = 0; o < names.length; o++) {
                        var name_1 = names[o];
                        if (!iJSONLocalCustom.objects.hasOwnProperty(name_1)) {
                            objectsToUnregister.push(name_1);
                        }
                    }
                    names = Object.keys(iJSONLocalCustom.objects);
                    var objectsToRegister = [];
                    var objectsToUpdate = [];
                    for (var o = 0; o < names.length; o++) {
                        var name_2 = names[o];
                        var object = { name: name_2, descriptor: iJSONLocalCustom.objects[name_2] };
                        if (TypeLibrary.hasLocalCustomType(iGraphContext, name_2, Enums.FTypeCategory.fObject)) {
                            objectsToUpdate.push(object);
                        }
                        else {
                            objectsToRegister.push(object);
                        }
                    }
                    TypeLibrary.registerLocalCustomTypes(iGraphContext, objectsToRegister, true);
                    TypeLibrary.updateLocalCustomTypes(iGraphContext, objectsToUpdate, true);
                    TypeLibrary.unregisterLocalCustomTypes(iGraphContext, objectsToUnregister);
                }
            }
        };
        TypeLibrary.toJSONLocalCustom = function (iGraphContext, oJSONLocalCustom) {
            TypeLibrary.checkContext(iGraphContext);
            oJSONLocalCustom.objects = iGraphContext.getLocalTypeLibrary().getJSONObjectsByName();
        };
        // Listener
        TypeLibrary.addListener = function (iEventCtor, iListener) {
            eventTarget.addListener(iEventCtor, iListener);
        };
        TypeLibrary.removeListener = function (iEventCtor, iListener) {
            eventTarget.removeListener(iEventCtor, iListener);
        };
        TypeLibrary.allowExtraPropertyOnObjectTypeCast = function () {
            return castConfig.objectTypeOptions.allowExtraProperty;
        };
        TypeLibrary.registerTypeCastConfig = function (iJSONTypeCastConfig) {
            if (iJSONTypeCastConfig.hasOwnProperty('baseType')) {
                var baseTypeConfig = iJSONTypeCastConfig.baseType;
                var fromBaseTypes = Object.keys(baseTypeConfig);
                for (var fbt = 0; fbt < fromBaseTypes.length; fbt++) {
                    var fromBaseType = fromBaseTypes[fbt];
                    var toBaseTypeConfig = baseTypeConfig[fromBaseType];
                    var toBaseTypes = Object.keys(toBaseTypeConfig);
                    for (var tbt = 0; tbt < toBaseTypes.length; tbt++) {
                        var toBaseType = toBaseTypes[tbt];
                        var castLevel = Enums.ECastLevel[(toBaseTypeConfig[toBaseType])];
                        globalTypeLibrary.registerCastLevel(fromBaseType, toBaseType, castLevel);
                    }
                }
            }
            if (iJSONTypeCastConfig.hasOwnProperty('objectTypeOptions')) {
                var objectTypeOptionsConfig = iJSONTypeCastConfig.objectTypeOptions;
                if (objectTypeOptionsConfig.hasOwnProperty('allowExtraProperty')) {
                    castConfig.objectTypeOptions.allowExtraProperty = objectTypeOptionsConfig.allowExtraProperty;
                }
            }
        };
        TypeLibrary.registerAdvancedTypes = function () {
            if (!advancedTypesRegistered) {
                registerAdvancedTypes();
                advancedTypesRegistered = true;
            }
        };
        // DEPRECATED
        // ObjectType
        TypeLibrary.registerObjectType = function (iName, iObjectDesc) {
            TypeLibrary.registerGlobalObjectType(iName, iObjectDesc);
        };
        return TypeLibrary;
    }());
    Object.defineProperty(LocalTypeLibrary.prototype, '__TypeLibrary', { value: TypeLibrary });
    var reserveTypeName = function (iName) {
        reservedByName[iName] = undefined;
    };
    reserveTypeName('Boolean');
    reserveTypeName('boolean');
    reserveTypeName('bool');
    reserveTypeName('Bool');
    reserveTypeName('Double');
    reserveTypeName('double');
    reserveTypeName('float');
    reserveTypeName('Float');
    reserveTypeName('number');
    reserveTypeName('Number');
    reserveTypeName('Integer');
    reserveTypeName('integer');
    reserveTypeName('int');
    reserveTypeName('Int');
    reserveTypeName('int8');
    reserveTypeName('Int8');
    reserveTypeName('int16');
    reserveTypeName('Int16');
    reserveTypeName('int32');
    reserveTypeName('Int32');
    reserveTypeName('int64');
    reserveTypeName('Int64');
    reserveTypeName('uinteger');
    reserveTypeName('UInteger');
    reserveTypeName('uint');
    reserveTypeName('UInt');
    reserveTypeName('uint8');
    reserveTypeName('UInt8');
    reserveTypeName('uint16');
    reserveTypeName('UInt16');
    reserveTypeName('uint32');
    reserveTypeName('UInt32');
    reserveTypeName('uint64');
    reserveTypeName('UInt64');
    reserveTypeName('String');
    reserveTypeName('string');
    reserveTypeName('Object');
    reserveTypeName('object');
    reserveTypeName('Array');
    reserveTypeName('array');
    reserveTypeName('ArrayBuffer');
    reserveTypeName('Buffer');
    reserveTypeName('DataView');
    reserveTypeName('Date');
    reserveTypeName('Error');
    reserveTypeName('error');
    reserveTypeName('EvalError');
    reserveTypeName('Float32Array');
    reserveTypeName('Float64Array');
    reserveTypeName('Function');
    reserveTypeName('function');
    reserveTypeName('Generator');
    reserveTypeName('GeneratorFunction');
    reserveTypeName('Int16Array');
    reserveTypeName('Int32Array');
    reserveTypeName('Int8Array');
    reserveTypeName('InternalError');
    reserveTypeName('Iterator');
    reserveTypeName('Map');
    reserveTypeName('Promise');
    reserveTypeName('Proxy');
    reserveTypeName('RangeError');
    reserveTypeName('ReferenceError');
    reserveTypeName('RegExp');
    reserveTypeName('Set');
    reserveTypeName('SharedArrayBuffer');
    reserveTypeName('Symbol');
    reserveTypeName('SyntaxError');
    reserveTypeName('TypeError');
    reserveTypeName('TypedArray');
    reserveTypeName('URIError');
    reserveTypeName('Uint16Array');
    reserveTypeName('Uint32Array');
    reserveTypeName('Uint8Array');
    reserveTypeName('Uint8ClampedArray');
    reserveTypeName('WeakMap');
    reserveTypeName('WeakSet');
    var registerBaseType = function (iName, iIs, iConvert) {
        globalTypeLibrary.basesByName[iName] = { is: iIs, convert: iConvert };
        var newEvt = new Events.TypeLibraryRegisterGlobalEvent();
        newEvt.name = iName;
        eventTarget.dispatchEvent(newEvt);
    };
    var registerNumericalType = function (iName, iIs, iConvert) {
        globalTypeLibrary.numericalsByName[iName] = { is: iIs, convert: iConvert };
        var newEvt = new Events.TypeLibraryRegisterGlobalEvent();
        newEvt.name = iName;
        eventTarget.dispatchEvent(newEvt);
    };
    var isBoolean = function (iValue) {
        return typeof iValue === 'boolean';
    };
    registerBaseType('Boolean', isBoolean, Boolean);
    var isNumber = function (iValue) {
        return typeof iValue === 'number';
    };
    registerNumericalType('Double', isNumber, Number);
    registerNumericalType('Integer', Number.isInteger, Math.trunc);
    var isString = function (iValue) {
        return typeof iValue === 'string';
    };
    registerBaseType('String', isString, String);
    var isObject = function (iValue) {
        return iValue instanceof Object;
    };
    var convertObject = function ( /*iValue*/) { };
    registerBaseType('Object', isObject, convertObject);
    var convertArray = function ( /*iValue*/) { };
    registerBaseType('Array', Array.isArray, convertArray);
    var isBuffer = function (iValue) {
        return iValue instanceof ArrayBuffer;
    };
    var convertBuffer = function ( /*iValue*/) { };
    registerBaseType('Buffer', isBuffer, convertBuffer);
    TypeLibrary.registerTypeCastConfig(TypeCastConfig);
    TypeLibrary.registerGlobalEventType(EPEvent.prototype.type, EPEvent, {});
    var registerAdvancedTypes = function () {
        registerNumericalType('Float', isNumber, Number);
        var isInt8 = function (iValue) {
            var result = Number.isInteger(iValue);
            result = result && iValue >= -128;
            result = result && iValue <= 127;
            return result;
        };
        var convertInt8 = function (iValue) {
            var value = Math.trunc(iValue);
            if (!isInt8(value)) {
                value = NaN;
            }
            return value;
        };
        registerNumericalType('Int8', isInt8, convertInt8);
        var isInt16 = function (iValue) {
            var result = Number.isInteger(iValue);
            result = result && iValue >= -32768;
            result = result && iValue <= 32767;
            return result;
        };
        var convertInt16 = function (iValue) {
            var value = Math.trunc(iValue);
            if (!isInt16(value)) {
                value = NaN;
            }
            return value;
        };
        registerNumericalType('Int16', isInt16, convertInt16);
        var isInt32 = function (iValue) {
            var result = Number.isInteger(iValue);
            result = result && iValue >= -2147483648;
            result = result && iValue <= 2147483647;
            return result;
        };
        var convertInt32 = function (iValue) {
            var value = Math.trunc(iValue);
            if (!isInt32(value)) {
                value = NaN;
            }
            return value;
        };
        registerNumericalType('Int32', isInt32, convertInt32);
        var isInt64 = function (iValue) {
            var result = Number.isInteger(iValue) || typeof iValue === 'bigint';
            return result;
        };
        registerNumericalType('Int64', isInt64, Math.trunc);
        var isUInt8 = function (iValue) {
            var result = Number.isInteger(iValue);
            result = result && iValue >= 0;
            result = result && iValue <= 255;
            return result;
        };
        var convertUInt8 = function (iValue) {
            var value = Math.trunc(iValue);
            if (!isUInt8(value)) {
                value = NaN;
            }
            return value;
        };
        registerNumericalType('UInt8', isUInt8, convertUInt8);
        var isUInt16 = function (iValue) {
            var result = Number.isInteger(iValue);
            result = result && iValue >= 0;
            result = result && iValue <= 65535;
            return result;
        };
        var convertUInt16 = function (iValue) {
            var value = Math.trunc(iValue);
            if (!isUInt16(value)) {
                value = NaN;
            }
            return value;
        };
        registerNumericalType('UInt16', isUInt16, convertUInt16);
        var isUInt32 = function (iValue) {
            var result = Number.isInteger(iValue);
            result = result && iValue >= 0;
            result = result && iValue <= 4294967295;
            return result;
        };
        var convertUInt32 = function (iValue) {
            var value = Math.trunc(iValue);
            if (!isUInt32(value)) {
                value = NaN;
            }
            return value;
        };
        registerNumericalType('UInt32', isUInt32, convertUInt32);
        var isUInt64 = function (iValue) {
            var result = Number.isInteger(iValue) || typeof iValue === 'bigint';
            result = result && iValue >= 0;
            return result;
        };
        var convertUInt64 = function (iValue) {
            var value = Math.trunc(iValue);
            if (!isUInt64(value)) {
                value = NaN;
            }
            return value;
        };
        registerNumericalType('UInt64', isUInt64, convertUInt64);
        TypeLibrary.registerTypeCastConfig(TypeCastAdvancedConfig);
    };
    return TypeLibrary;
});
