/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSITools'/>
define("DS/EPSSchematicsCSI/EPSSchematicsCSITools", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/CSICommandBinder/CSICommandBinder", "DS/EPSSchematicsCSI/EPSSchematicsCSIIntrospection"], function (require, exports, TypeLibrary, Enums, CSICommandBinder, CSIIntrospection) {
    "use strict";
    var CSITools;
    (function (CSITools) {
        /* eslint-disable dot-notation */
        var csiTypesByType = {};
        csiTypesByType['String'] = 'string';
        csiTypesByType['Boolean'] = 'bool';
        csiTypesByType['Integer'] = 'int32';
        csiTypesByType['Int8'] = 'int8';
        csiTypesByType['UInt8'] = 'uint8';
        csiTypesByType['Int16'] = 'int16';
        csiTypesByType['UInt16'] = 'uint16';
        csiTypesByType['Int32'] = 'int32';
        csiTypesByType['UInt32'] = 'uint32';
        csiTypesByType['Int64'] = 'int64';
        csiTypesByType['UInt64'] = 'uint64';
        csiTypesByType['Float'] = 'float';
        csiTypesByType['Double'] = 'double';
        csiTypesByType['Buffer'] = 'buffer';
        /* eslint-enable dot-notation */
        var isStringEnumType = function (iEnumType) {
            var result = Object.keys(iEnumType).every(function (key) { return typeof iEnumType[key] === 'string'; });
            return result;
        };
        /**
         * Gets the CSI type by type.
         * @public
         * @param {string} iTypeName - The type name.
         * @returns {string} The CSI type.
         */
        function getCSITypeByType(iTypeName) {
            var csiType = 'Parameters';
            if (CSIIntrospection.hasType(iTypeName)) {
                csiType = iTypeName;
            }
            else if (csiTypesByType.hasOwnProperty(iTypeName)) {
                csiType = csiTypesByType[iTypeName];
            }
            else if (TypeLibrary.hasGlobalType(iTypeName, Enums.FTypeCategory.fEnum)) {
                var EnumType = TypeLibrary.getGlobalType(iTypeName);
                if (isStringEnumType(EnumType)) {
                    csiType = 'string';
                }
                else {
                    csiType = 'int32';
                }
            }
            return csiType;
        }
        CSITools.getCSITypeByType = getCSITypeByType;
        /* eslint-disable dot-notation */
        var typesByCSIType = {};
        typesByCSIType['string'] = 'String';
        typesByCSIType['bool'] = 'Boolean';
        typesByCSIType['int8'] = 'Int8';
        typesByCSIType['uint8'] = 'UInt8';
        typesByCSIType['int16'] = 'Int16';
        typesByCSIType['uint16'] = 'UInt16';
        typesByCSIType['int32'] = 'Int32';
        typesByCSIType['uint32'] = 'UInt32';
        typesByCSIType['int64'] = 'Int64';
        typesByCSIType['uint64'] = 'UInt64';
        typesByCSIType['float'] = 'Float';
        typesByCSIType['double'] = 'Double';
        typesByCSIType['buffer'] = 'Buffer';
        typesByCSIType['Parameters'] = 'Object';
        /* eslint-enable dot-notation */
        /**
         * Gets the type by CSI type.
         * @public
         * @param {string} iCSITypeName - The CSI type name.
         * @returns {string} The type.
         */
        function getTypeByCSIType(iCSITypeName) {
            var type = iCSITypeName;
            if (typesByCSIType.hasOwnProperty(iCSITypeName)) {
                type = typesByCSIType[iCSITypeName];
            }
            return type;
        }
        CSITools.getTypeByCSIType = getTypeByCSIType;
        /* eslint-disable dot-notation */
        var csiWriteMethodsByType = {};
        csiWriteMethodsByType['String'] = 'writeString';
        csiWriteMethodsByType['Boolean'] = 'writeBool';
        csiWriteMethodsByType['Integer'] = 'writeInt32';
        csiWriteMethodsByType['Int8'] = 'writeInt8';
        csiWriteMethodsByType['UInt8'] = 'writeUint8';
        csiWriteMethodsByType['Int16'] = 'writeInt16';
        csiWriteMethodsByType['UInt16'] = 'writeUint16';
        csiWriteMethodsByType['Int32'] = 'writeInt32';
        csiWriteMethodsByType['UInt32'] = 'writeUint32';
        csiWriteMethodsByType['Int64'] = 'writeInt64';
        csiWriteMethodsByType['UInt64'] = 'writeUint64';
        csiWriteMethodsByType['Float'] = 'writeFloat';
        csiWriteMethodsByType['Double'] = 'writeDouble';
        csiWriteMethodsByType['Buffer'] = 'writeBuffer';
        csiWriteMethodsByType['Array<String>'] = 'writeStringArray';
        csiWriteMethodsByType['Array<Boolean>'] = 'writeBoolArray';
        csiWriteMethodsByType['Array<Integer>'] = 'writeInt32Array';
        csiWriteMethodsByType['Array<Int8>'] = 'writeInt8Array';
        csiWriteMethodsByType['Array<UInt8>'] = 'writeUint8Array';
        csiWriteMethodsByType['Array<Int16>'] = 'writeInt16Array';
        csiWriteMethodsByType['Array<UInt16>'] = 'writeUint16Array';
        csiWriteMethodsByType['Array<Int32>'] = 'writeInt32Array';
        csiWriteMethodsByType['Array<UInt32>'] = 'writeUint32Array';
        csiWriteMethodsByType['Array<Int64>'] = 'writeInt64Array';
        csiWriteMethodsByType['Array<UInt64>'] = 'writeUint64Array';
        csiWriteMethodsByType['Array<Float>'] = 'writeFloatArray';
        csiWriteMethodsByType['Array<Double>'] = 'writeDoubleArray';
        /* eslint-enable dot-notation */
        /**
         * Gets the CSI parameters.
         * @public
         * @param {string} iTypeName - The type name.
         * @param {IParametersObject} iValue - The value of the parameters.
         * @param {GraphBlock} [iGraphContext] - The graph context.
         * @returns {CSICommandBinder.Parameters} The CSI parameters.
         */
        function getParameters(iTypeName, iValue, iGraphContext) {
            var csiParameters;
            if (iValue instanceof Object && iValue.__parameters__ !== undefined) {
                csiParameters = iValue.__parameters__;
            }
            else if (iValue !== undefined) {
                csiParameters = CSITools.createParameters(iTypeName, iValue, iGraphContext);
            }
            return csiParameters;
        }
        CSITools.getParameters = getParameters;
        /**
         * Writes property parameters.
         * @public
         * @param {string} iProperty - The property name.
         * @param {string} iTypeName - The type name.
         * @param {any} iValue - The value of the parameters.
         * @param {GraphBlock} iGraphContext - The graph context.
         * @param {CSICommandBinder.Parameters} oCSIParameters - The CSI parameters.
         * @returns {boolean} True if the property has been correctly written to the parameters.
         */
        function writePropertyParameters(iProperty, iTypeName, iValue, iGraphContext, oCSIParameters) {
            var result = iValue !== undefined;
            result = result && iTypeName !== undefined;
            if (result) {
                var csiWriteMethod = csiWriteMethodsByType[iTypeName];
                if (csiWriteMethod !== undefined) {
                    oCSIParameters[csiWriteMethod](iProperty, iValue);
                }
                else {
                    var arrayValueTypeName = TypeLibrary.getArrayValueTypeName(iTypeName);
                    if (arrayValueTypeName !== undefined) {
                        if (TypeLibrary.hasType(iGraphContext, arrayValueTypeName, Enums.FTypeCategory.fEnum)) {
                            var ArrayEnumType = TypeLibrary.getType(iGraphContext, arrayValueTypeName);
                            if (isStringEnumType(ArrayEnumType)) {
                                oCSIParameters.writeStringArray(iProperty, iValue);
                            }
                            else {
                                oCSIParameters.writeInt32Array(iProperty, iValue);
                            }
                        }
                        else {
                            var csiParametersArray = [];
                            for (var i = 0; i < iValue.length; i++) {
                                csiParametersArray.push(CSITools.getParameters(arrayValueTypeName, iValue[i], iGraphContext));
                            }
                            oCSIParameters.writeParametersArray(iProperty, CSITools.getCSITypeByType(arrayValueTypeName), csiParametersArray);
                        }
                    }
                    else {
                        if (TypeLibrary.hasType(iGraphContext, iTypeName, Enums.FTypeCategory.fEnum)) {
                            var EnumType = TypeLibrary.getType(iGraphContext, iTypeName);
                            if (isStringEnumType(EnumType)) {
                                oCSIParameters.writeString(iProperty, iValue);
                            }
                            else {
                                oCSIParameters.writeInt32(iProperty, iValue);
                            }
                        }
                        else {
                            oCSIParameters.writeParameters(iProperty, CSITools.getCSITypeByType(iTypeName), CSITools.getParameters(iTypeName, iValue, iGraphContext));
                        }
                    }
                }
            }
            return result;
        }
        CSITools.writePropertyParameters = writePropertyParameters;
        /**
         * Gets the type name from the value.
         * @public
         * @param {any} iValue - The value to get the type name from.
         * @returns {string} The type name from the value.
         */
        function getTypeNameFromValue(iValue) {
            var typeofValue = typeof iValue;
            var typeName;
            switch (typeofValue) {
                case 'boolean': {
                    typeName = 'Boolean';
                    break;
                }
                case 'string': {
                    typeName = 'String';
                    break;
                }
                case 'number': {
                    typeName = 'Double';
                    break;
                }
                case 'object': {
                    if (Array.isArray(iValue)) {
                        var firstElementValue = iValue[0];
                        var typeofArrayValue = typeof firstElementValue;
                        switch (typeofArrayValue) {
                            case 'boolean': {
                                typeName = 'Array<Boolean>';
                                break;
                            }
                            case 'string': {
                                typeName = 'Array<String>';
                                break;
                            }
                            case 'number': {
                                typeName = 'Array<Double>';
                                break;
                            }
                            case 'object': {
                                if (!Array.isArray(firstElementValue)) {
                                    typeName = 'Array<Object>';
                                }
                                break;
                            }
                        }
                    }
                    else {
                        typeName = 'Object';
                    }
                    break;
                }
            }
            return typeName;
        }
        CSITools.getTypeNameFromValue = getTypeNameFromValue;
        /**
         * Creates a CSI parameters.
         * @public
         * @param {string} iTypeName - The type name.
         * @param {Object} iValue - The value of the parameters.
         * @param {GraphBlock} [iGraphContext] - The graph context.
         * @returns {CSICommandBinder.Parameters} The CSI parameters.
         */
        function createParameters(iTypeName, iValue, iGraphContext) {
            var csiParameters = CSICommandBinder.createParameters();
            csiParameters.declareAsObject(CSITools.getCSITypeByType(iTypeName));
            if (iTypeName === 'Object' || !TypeLibrary.hasType(iGraphContext, iTypeName, Enums.FTypeCategory.fAll)) {
                var keys = Object.keys(iValue);
                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    var value = iValue[key];
                    var typeName = CSITools.getTypeNameFromValue(value);
                    CSITools.writePropertyParameters(key, typeName, value, iGraphContext, csiParameters);
                }
            }
            else {
                var Type = TypeLibrary.getType(iGraphContext, iTypeName);
                var keys = Object.keys(Type);
                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    var value = iValue[key];
                    var typeName = Type[key].type;
                    CSITools.writePropertyParameters(key, typeName, value, iGraphContext, csiParameters);
                }
            }
            return csiParameters;
        }
        CSITools.createParameters = createParameters;
        /* eslint-disable dot-notation */
        var csiReadMethodsByCSIType = {};
        csiReadMethodsByCSIType['string'] = 'readString';
        csiReadMethodsByCSIType['bool'] = 'readBool';
        csiReadMethodsByCSIType['int8'] = 'readIn8';
        csiReadMethodsByCSIType['uint8'] = 'readUint8';
        csiReadMethodsByCSIType['int16'] = 'readInt16';
        csiReadMethodsByCSIType['uint16'] = 'readUint16';
        csiReadMethodsByCSIType['int32'] = 'readInt32';
        csiReadMethodsByCSIType['uint32'] = 'readUint32';
        csiReadMethodsByCSIType['int64'] = 'readInt64';
        csiReadMethodsByCSIType['uint64'] = 'readUin64';
        csiReadMethodsByCSIType['float'] = 'readFloat';
        csiReadMethodsByCSIType['double'] = 'readDouble';
        csiReadMethodsByCSIType['buffer'] = 'readBuffer';
        csiReadMethodsByCSIType['string[]'] = 'readStringArray';
        csiReadMethodsByCSIType['bool[]'] = 'readBoolArray';
        csiReadMethodsByCSIType['int8[]'] = 'readInt8Array';
        csiReadMethodsByCSIType['uint8[]'] = 'readUint8Array';
        csiReadMethodsByCSIType['int16[]'] = 'readInt16Array';
        csiReadMethodsByCSIType['uint16[]'] = 'readUint16Array';
        csiReadMethodsByCSIType['int32[]'] = 'readInt32Array';
        csiReadMethodsByCSIType['uint32[]'] = 'readUint32Array';
        csiReadMethodsByCSIType['int64[]'] = 'readInt64Array';
        csiReadMethodsByCSIType['uint64[]'] = 'readUin64Array';
        csiReadMethodsByCSIType['float[]'] = 'readFloatArray';
        csiReadMethodsByCSIType['double[]'] = 'readDoubleArray';
        /* eslint-enable dot-notation */
        var readPropertyParameters = function (iName) {
            var value;
            var type = this.exists(iName);
            var csiReadMethod = csiReadMethodsByCSIType[type];
            if (csiReadMethod !== undefined) {
                value = this[csiReadMethod](iName);
                if (ArrayBuffer.isView(value)) {
                    value = Array.from(value);
                }
            }
            else {
                if (type.indexOf('[]') === -1) {
                    value = this.readParameters(iName, type);
                    if (value !== undefined) {
                        value = CSITools.createProxyParameters(value);
                    }
                }
                else {
                    value = this.readParametersArray(iName, type.replace('[]', ''));
                    if (Array.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            value[i] = CSITools.createProxyParameters(value[i]);
                        }
                    }
                }
            }
            return value;
        };
        var proxyHandler = {
            get: function (iParameters, iProperty) {
                var value;
                if (iParameters.propertyMap_.hasOwnProperty(iProperty)) {
                    value = readPropertyParameters.call(iParameters, iProperty);
                }
                else if (iProperty === '__parameters__') {
                    value = iParameters;
                }
                else {
                    value = Object.prototype[iProperty];
                }
                return value;
            },
            set: function () {
                return false;
            },
            getPrototypeOf: function () {
                return Object.prototype;
            },
            getOwnPropertyDescriptor: function (iParameters, iProperty) {
                var descriptor;
                if (iParameters.propertyMap_.hasOwnProperty(iProperty)) {
                    descriptor = { enumerable: true, configurable: true };
                }
                return descriptor;
            },
            ownKeys: function (iParameters) {
                return Object.keys(iParameters.propertyMap_);
            },
            has: function (iParameters, iProperty) {
                return iParameters.propertyMap_.hasOwnProperty(iProperty);
            }
        };
        /**
         * Creates the proxy parameters.
         * @public
         * @param {CSICommandBinder.Parameters} iCSIParameters - The CSI parameters.
         * @returns {CSICommandBinder.Parameters} The created proxy parameters.
         */
        function createProxyParameters(iCSIParameters) {
            return new Proxy(iCSIParameters, proxyHandler);
        }
        CSITools.createProxyParameters = createProxyParameters;
        var parametersSuffix = '_Parameters';
        var getSubTypeName = function (iParentTypeName, iLabel, iSuffix) {
            var subTypeName = iParentTypeName;
            if (subTypeName.endsWith(parametersSuffix)) {
                subTypeName = subTypeName.slice(0, -parametersSuffix.length);
            }
            subTypeName += '_' + iLabel + iSuffix;
            return subTypeName;
        };
        var isNumericalType = function (iCSIType) {
            var result = iCSIType === 'int8' || iCSIType === 'uint8' || iCSIType === 'int16' || iCSIType === 'uint16' || iCSIType === 'int32'
                || iCSIType === 'uint32' || iCSIType === 'int64' || iCSIType === 'uint64' || iCSIType === 'float' || iCSIType === 'double';
            return result;
        };
        var getCSIPropertyDesc = function (iCSIProperty, iParentTypeName, iObjectTypes, iEnumTypes, iInvalidDefaultValues) {
            var csiPropertyDesc = {};
            if (iCSIProperty.parameters !== undefined || iCSIProperty.parametersArray !== undefined) {
                csiPropertyDesc.type = getSubTypeName(iParentTypeName, iCSIProperty.label, parametersSuffix);
                iObjectTypes.push({
                    name: csiPropertyDesc.type,
                    descriptor: CSITools.getCSITypeDescriptor(iCSIProperty.parameters || iCSIProperty.parametersArray, csiPropertyDesc.type, iObjectTypes, iEnumTypes, iInvalidDefaultValues)
                });
            }
            else {
                var csiType = iCSIProperty.basic || iCSIProperty.basicArray || iCSIProperty.type || iCSIProperty.typeArray;
                if (iEnumTypes !== undefined && csiType === 'string' && Array.isArray(iCSIProperty.enum)) {
                    csiPropertyDesc.type = getSubTypeName(iParentTypeName, iCSIProperty.label, '_Enum');
                    var EnumType_1 = {};
                    iCSIProperty.enum.forEach(function (enumValue) { EnumType_1[enumValue] = enumValue; });
                    iEnumTypes.push({
                        name: csiPropertyDesc.type,
                        'enum': EnumType_1
                    });
                }
                else {
                    csiPropertyDesc.type = CSITools.getTypeByCSIType(csiType);
                }
            }
            if (iCSIProperty.basicArray !== undefined || iCSIProperty.typeArray !== undefined || iCSIProperty.parametersArray !== undefined) {
                csiPropertyDesc.type = 'Array<' + csiPropertyDesc.type + '>';
            }
            csiPropertyDesc.defaultValue = undefined;
            csiPropertyDesc.mandatory = true;
            if (iCSIProperty.optional !== undefined) {
                var isInvalidDefaultValue = false;
                var defaultValue = iCSIProperty.optional.default_value;
                if (csiPropertyDesc.type === 'Buffer') {
                    csiPropertyDesc.defaultValue = undefined;
                }
                else if (typeof defaultValue === 'string' && iCSIProperty.basic !== 'string') {
                    if (isNumericalType(iCSIProperty.basic)) {
                        csiPropertyDesc.defaultValue = Number(defaultValue);
                    }
                    else {
                        try {
                            csiPropertyDesc.defaultValue = JSON.parse(defaultValue);
                        }
                        catch (iError) {
                            isInvalidDefaultValue = true;
                        }
                    }
                }
                else {
                    csiPropertyDesc.defaultValue = defaultValue;
                }
                csiPropertyDesc.mandatory = !iCSIProperty.optional.isOptional && csiPropertyDesc.defaultValue === undefined;
                var isGlobalType = TypeLibrary.hasGlobalType(csiPropertyDesc.type, Enums.FTypeCategory.fAll);
                var isGlobalValueType = TypeLibrary.isGlobalValueType(csiPropertyDesc.type, csiPropertyDesc.defaultValue);
                isInvalidDefaultValue = isInvalidDefaultValue || (isGlobalType && !isGlobalValueType);
                if (isInvalidDefaultValue) {
                    csiPropertyDesc.defaultValue = undefined;
                    if (Array.isArray(iInvalidDefaultValues)) {
                        iInvalidDefaultValues.push({
                            type: iParentTypeName,
                            error: 'label ' + iCSIProperty.label + ' contains an invalid default value which is : "' + defaultValue + '"'
                        });
                    }
                }
            }
            return csiPropertyDesc;
        };
        /**
         * Gets the CSI type decriptor.
         * @public
         * @param {ICSIJSONProperty[]} iCSIPropertyDefinitions - The list of CSI property definitions.
         * @param {string} iParentTypeName - The name of the parent type.
         * @param {IObjectTypeName[]} iObjectTypes - The object types.
         * @param {IEnumTypeName[]} [iEnumTypes] - The enumeration types.
         * @param {ICSIInvalidDefaultValue[]} [iInvalidDefaultValues] - The invalid default values.
         * @returns {IObjectType} The CSI type descriptor.
         */
        function getCSITypeDescriptor(iCSIPropertyDefinitions, iParentTypeName, iObjectTypes, iEnumTypes, iInvalidDefaultValues) {
            var descriptor = {};
            for (var p = 0; p < iCSIPropertyDefinitions.length; p++) {
                var csiProperty = iCSIPropertyDefinitions[p];
                descriptor[csiProperty.label] = getCSIPropertyDesc(csiProperty, iParentTypeName, iObjectTypes, iEnumTypes, iInvalidDefaultValues);
            }
            return descriptor;
        }
        CSITools.getCSITypeDescriptor = getCSITypeDescriptor;
        var getCSIPropertyFromTypeProperty = function (iPropertyName, iProperty, iGraphContext, iPortType) {
            var csiProperty = {
                label: iPropertyName
            };
            var arrayValueType = TypeLibrary.getArrayValueTypeName(iProperty.type);
            if (arrayValueType !== undefined) {
                if (CSIIntrospection.hasType(arrayValueType)) {
                    csiProperty.typeArray = arrayValueType;
                }
                else if (arrayValueType === 'Object') {
                    csiProperty.typeArray = 'Parameters';
                }
                else if (TypeLibrary.hasType(iGraphContext, arrayValueType, Enums.FTypeCategory.fObject)) {
                    csiProperty.parametersArray = getCSIPropertyListFromType(arrayValueType, iGraphContext, iPortType);
                }
                else if (TypeLibrary.hasType(iGraphContext, arrayValueType, Enums.FTypeCategory.fEnum)) {
                    var ArrayEnumType_1 = TypeLibrary.getType(iGraphContext, arrayValueType);
                    if (isStringEnumType(ArrayEnumType_1)) {
                        csiProperty.basicArray = 'string';
                        csiProperty.enum = Object.keys(ArrayEnumType_1).map(function (key) { return ArrayEnumType_1[key]; });
                    }
                    else {
                        csiProperty.basicArray = 'int32';
                    }
                }
                else {
                    csiProperty.basicArray = CSITools.getCSITypeByType(arrayValueType);
                }
            }
            else {
                if (CSIIntrospection.hasType(iProperty.type)) {
                    csiProperty.type = iProperty.type;
                }
                else if (iProperty.type === 'Object') {
                    csiProperty.type = 'Parameters';
                }
                else if (TypeLibrary.hasType(iGraphContext, iProperty.type, Enums.FTypeCategory.fObject)) {
                    csiProperty.parameters = getCSIPropertyListFromType(iProperty.type, iGraphContext, iPortType);
                }
                else if (TypeLibrary.hasType(iGraphContext, iProperty.type, Enums.FTypeCategory.fEnum)) {
                    var EnumType_2 = TypeLibrary.getType(iGraphContext, iProperty.type);
                    if (isStringEnumType(EnumType_2)) {
                        csiProperty.basic = 'string';
                        csiProperty.enum = Object.keys(EnumType_2).map(function (key) { return EnumType_2[key]; });
                    }
                    else {
                        csiProperty.basic = 'int32';
                    }
                }
                else {
                    csiProperty.basic = CSITools.getCSITypeByType(iProperty.type);
                }
            }
            if (iPortType !== Enums.EDataPortType.eOutput && iProperty.defaultValue !== undefined) {
                csiProperty.optional = {};
                csiProperty.optional.default_value = TypeLibrary.getJSONValueFromValue(iGraphContext, iProperty.defaultValue, iProperty.type);
                if (typeof csiProperty.optional.default_value !== 'string') {
                    csiProperty.optional.default_value = JSON.stringify(csiProperty.optional.default_value);
                }
            }
            else if (!iProperty.mandatory) {
                csiProperty.optional = {};
                csiProperty.optional.isOptional = true;
            }
            return csiProperty;
        };
        var getCSIPropertyListFromType = function (iTypeName, iGraphContext, iPortType) {
            var csiPropertyList = [];
            var descriptor = TypeLibrary.getType(iGraphContext, iTypeName);
            var keys = Object.keys(descriptor);
            for (var k = 0; k < keys.length; k++) {
                var key = keys[k];
                var csiProperty = getCSIPropertyFromTypeProperty(key, descriptor[key], iGraphContext, iPortType);
                csiPropertyList.push(csiProperty);
            }
            return csiPropertyList;
        };
        var getCSISignatureFromType = function (iTypeName, iGraphContext, iPortType) {
            var csiSignature = {};
            if (CSIIntrospection.hasType(iTypeName)) {
                csiSignature.type = iTypeName;
            }
            else if (TypeLibrary.hasType(iGraphContext, iTypeName, Enums.FTypeCategory.fObject)) {
                csiSignature.parameters = getCSIPropertyListFromType(iTypeName, iGraphContext, iPortType);
                if (csiSignature.parameters.length === 0) {
                    delete csiSignature.parameters;
                }
            }
            else {
                csiSignature.type = 'Parameters';
            }
            return csiSignature;
        };
        /**
         * Gets the CSI signature from data port.
         * @public
         * @param {DataPort} iDataPort - The data port.
         * @returns {ICSIJSONSignature} The CSI signature.
         */
        function getCSISignatureFromDataPort(iDataPort) {
            var typeName = iDataPort.getValueType();
            var portType = iDataPort.getType();
            var graphContext = iDataPort.getGraphContext();
            var csiSignature = getCSISignatureFromType(typeName, graphContext, portType);
            return csiSignature;
        }
        CSITools.getCSISignatureFromDataPort = getCSISignatureFromDataPort;
        /**
         * Creates the CSI graph block from blocks.
         * @public
         * @param {Block[]} iBlocks - The list of blocks.
         * @returns {CSIGraphBlock} The CSI graph block.
         */
        function createCSIGraphBlockFromBlocks(iBlocks) {
            var BlockCtr = require('DS/EPSSchematicsModelWeb/EPSSchematicsBlock');
            var CSIGraphBlockCtr = require('DS/EPSSchematicsCSI/EPSSchematicsCSIGraphBlock');
            if (!Array.isArray(iBlocks)) {
                throw new TypeError('iBlocks argument is not an Array');
            }
            if (iBlocks.length === 0) {
                throw new TypeError('iBlocks argument is an empty Array');
            }
            var parentGraph;
            for (var b = 0; b < iBlocks.length; b++) {
                var block = iBlocks[b];
                if (!(block instanceof BlockCtr)) {
                    throw new TypeError('iBlocks[' + b + '] argument is not a Block');
                }
                if (block.graph === undefined || (parentGraph !== undefined && block.graph !== parentGraph)) {
                    throw new TypeError('iBlocks[' + b + '] argument is not in the parent Graph');
                }
                parentGraph = block.graph;
            }
            var graphBlock = parentGraph.createBlock(CSIGraphBlockCtr.prototype.uid);
            var dataPortsToLink = [];
            var dataLinksToAdd = [];
            var controlPortsToLink = [];
            var controlLinksToAdd = [];
            for (var b = 0; b < iBlocks.length; b++) {
                var block = iBlocks[b];
                var dataPorts = block.getDataPorts();
                for (var dp = 0; dp < dataPorts.length; dp++) {
                    var dataPort = dataPorts[dp];
                    var dataLinks = dataPort.getDataLinks(parentGraph);
                    var subDataPorts = dataPort.getDataPorts();
                    for (var sdp = 0; sdp < subDataPorts.length; sdp++) {
                        dataLinks = dataLinks.concat(subDataPorts[sdp].getDataLinks(parentGraph));
                    }
                    for (var dl = 0; dl < dataLinks.length; dl++) {
                        var dataLink = dataLinks[dl];
                        if (dataLinksToAdd.indexOf(dataLink) === -1) {
                            dataPortsToLink.push({
                                startPort: dataLink.getStartPort(),
                                endPort: dataLink.getEndPort()
                            });
                            dataLinksToAdd.push(dataLink);
                        }
                    }
                }
                var controlPorts = block.getControlPorts();
                for (var cp = 0; cp < controlPorts.length; cp++) {
                    var controlPort = controlPorts[cp];
                    var controlLinks = controlPort.getControlLinks(parentGraph);
                    for (var cl = 0; cl < controlLinks.length; cl++) {
                        var controlLink = controlLinks[cl];
                        if (controlLinksToAdd.indexOf(controlLink) === -1) {
                            controlPortsToLink.push({
                                startPort: controlLink.getStartPort(),
                                endPort: controlLink.getEndPort(),
                                waitCount: controlLink.getWaitCount()
                            });
                            controlLinksToAdd.push(controlLink);
                        }
                    }
                }
                var nodeIdSelectorName = block.getNodeIdSelector();
                var nodeIdSelector = parentGraph.getNodeIdSelectorByName(nodeIdSelectorName);
                if (nodeIdSelector !== undefined && !graphBlock.hasNodeIdSelectorName(nodeIdSelectorName)) {
                    var jsonNodeIdSelector = {};
                    nodeIdSelector.toJSON(jsonNodeIdSelector);
                    nodeIdSelector = graphBlock.createNodeIdSelector();
                    nodeIdSelector.fromJSON(jsonNodeIdSelector);
                }
                parentGraph.removeBlock(block);
                graphBlock.addBlock(block);
                block.setNodeIdSelector(nodeIdSelectorName);
            }
            for (var dptl = 0; dptl < dataPortsToLink.length; dptl++) {
                var dataPortToLink = dataPortsToLink[dptl];
                var startPort = dataPortToLink.startPort;
                var endPort = dataPortToLink.endPort;
                if (startPort.block.graph === graphBlock && endPort.block.graph === graphBlock) {
                    graphBlock.createDataLink(startPort, endPort);
                }
            }
            for (var cptl = 0; cptl < controlPortsToLink.length; cptl++) {
                var controlPortToLink = controlPortsToLink[cptl];
                var startPort = controlPortToLink.startPort;
                var endPort = controlPortToLink.endPort;
                if (startPort.block.graph === graphBlock && endPort.block.graph === graphBlock) {
                    var link = graphBlock.createControlLink(startPort, endPort);
                    link.setWaitCount(controlPortToLink.waitCount);
                }
            }
            return graphBlock;
        }
        CSITools.createCSIGraphBlockFromBlocks = createCSIGraphBlockFromBlocks;
        var _toPascalCase = function (iString) {
            var pascalCaseString = iString.replace(/[^a-zA-Z0-9]+(.)/g, function (_match, char) { return char.toUpperCase(); });
            return pascalCaseString;
        };
        var _isUpperCase = function (iString) {
            var result = iString === iString.toUpperCase();
            result = result && iString !== iString.toLowerCase();
            return result;
        };
        var _toCamelCase = function (iString) {
            var pascalCaseString = _toPascalCase(iString);
            var i = 0;
            while (_isUpperCase(pascalCaseString[i])) {
                i++;
            }
            var camelCaseString = pascalCaseString.substring(0, Math.max(1, i - 1)).toLowerCase() + pascalCaseString.substring(Math.max(1, i - 1));
            return camelCaseString;
        };
        /**
         * Gets the function file name from the given block name.
         * @private
         * @param {string} blockName - The block name.
         * @returns {string} The function file name.
         */
        function exportFileName(blockName) {
            var functionName = blockName.replace(/_v[0-9]+$/, '');
            var matchFunctionVersion = blockName.match(/_v[0-9]+$/);
            var functionVersion = matchFunctionVersion !== null ? matchFunctionVersion[0] : '_v1';
            var functionCamelCaseName = _toCamelCase(functionName);
            var functionFileName = functionCamelCaseName + functionVersion + '.json';
            return functionFileName;
        }
        CSITools.exportFileName = exportFileName;
    })(CSITools || (CSITools = {}));
    return CSITools;
});
