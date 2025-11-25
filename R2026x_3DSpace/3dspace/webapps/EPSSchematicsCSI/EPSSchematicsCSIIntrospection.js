/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSIIntrospection'/>
define("DS/EPSSchematicsCSI/EPSSchematicsCSIIntrospection", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/CSICommandBinder/CSICommandBinder"], function (require, exports, TypeLibrary, BlockLibrary, Enums, CSICommandBinder) {
    "use strict";
    var CSITools; // Break circular dependency!
    var typesByName = {};
    var functionsByUid = {};
    var CSIIntrospection;
    (function (CSIIntrospection) {
        /**
         * Registers introspection content: CSIType and CSIFunction
         * @public
         * @param {TCSIArguments} iArguments - The register arguments.
         */
        function registerContent(iArguments) {
            require(['DS/EPSSchematicsCSI/EPSSchematicsCSITools'], function (iCSITools) {
                CSITools = iCSITools; // Break circular dependency!
                TypeLibrary.registerAdvancedTypes();
                var generatedContent = {
                    typeCodeList: [],
                    typeRequireIdList: [],
                    categoryDocCodeList: [],
                    categoryDocRequireIdList: [],
                    categoryCodeList: [],
                    categoryRequireIdList: [],
                    blockDocCodeList: [],
                    blockDocRequireIdList: [],
                    blockCodeList: [],
                    blockRequireIdList: []
                };
                var onLoadDocumentation = function () {
                    if (iArguments.onSuccess !== undefined) {
                        iArguments.onSuccess(generatedContent);
                    }
                };
                var onRegisterFunctions = function () {
                    BlockLibrary.loadDocumentation(onLoadDocumentation);
                };
                var onRegisterTypes = function () {
                    registerFunctions(iArguments, onRegisterFunctions, generatedContent);
                };
                registerTypes(iArguments, onRegisterTypes, generatedContent);
            });
        }
        CSIIntrospection.registerContent = registerContent;
        /**
         * Checks whether the instrospection has the given type.
         * @public
         * @param {string} iName - The name of the type.
         * @returns {boolean} Whether the instrospection has the given type.
         */
        function hasType(iName) {
            return typesByName.hasOwnProperty(iName);
        }
        CSIIntrospection.hasType = hasType;
        /**
         * Checks whether the instrospection has the given block.
         * @public
         * @param {string} iUid - The block Uid.
         * @returns {boolean} Whether the instrospection has the given block.
         */
        function hasBlock(iUid) {
            return functionsByUid.hasOwnProperty(iUid);
        }
        CSIIntrospection.hasBlock = hasBlock;
        /**
         * Gets the function.
         * @public
         * @param {string} iUid - The Uid.
         * @returns {ICSIJSONFunction} The function.
         */
        function getFunction(iUid) {
            return JSON.parse(JSON.stringify(functionsByUid[iUid]));
        }
        CSIIntrospection.getFunction = getFunction;
        /**
         * Gets the function implementation name.
         * @public
         * @param {string} iUid - The Uid.
         * @returns {string} The function implementation name.
         */
        function getFunctionImplementationName(iUid) {
            var implementationName;
            if (functionsByUid.hasOwnProperty(iUid)) {
                implementationName = functionsByUid[iUid].implementation.name;
            }
            return implementationName;
        }
        CSIIntrospection.getFunctionImplementationName = getFunctionImplementationName;
        /**
         * Gets the function pool.
         * @public
         * @param {string} iUid - The Uid.
         * @returns {string} The function pool.
         */
        function getFunctionPool(iUid) {
            var pool;
            if (functionsByUid.hasOwnProperty(iUid)) {
                pool = functionsByUid[iUid].pool;
            }
            return pool;
        }
        CSIIntrospection.getFunctionPool = getFunctionPool;
        var registerTypes = function (iArguments, iOnRegisterTypes, generatedContent) {
            if (iArguments.types !== undefined) {
                onGetTypesSuccess(iArguments, iOnRegisterTypes, generatedContent, iArguments.types);
            }
            else {
                var csiParameters = CSICommandBinder.createParameters();
                if (iArguments.pools !== undefined) {
                    csiParameters.writeStringArray('pools', iArguments.pools);
                }
                iArguments.node.call({
                    destinationNodeId: iArguments.nodeId,
                    name: iArguments.memoization ? 'csiMemoizeGetTypes' : 'csiGetTypes',
                    version: 3,
                    parameters: csiParameters,
                    onSuccess: onGetTypesSuccess.bind(undefined, iArguments, iOnRegisterTypes, generatedContent),
                    onError: onGetTypesError.bind(undefined, iArguments)
                });
            }
        };
        var registerFunctions = function (iArguments, iOnRegisterFunctions, generatedContent) {
            if (iArguments.functions !== undefined) {
                onGetFunctionsSuccess(iArguments, iOnRegisterFunctions, generatedContent, iArguments.functions);
            }
            else {
                var csiParameters = CSICommandBinder.createParameters();
                if (iArguments.pools !== undefined) {
                    csiParameters.writeStringArray('pools', iArguments.pools);
                }
                iArguments.node.call({
                    destinationNodeId: iArguments.nodeId,
                    name: iArguments.memoization ? 'csiMemoizeGetFunctions' : 'csiGetFunctions',
                    version: 3,
                    parameters: csiParameters,
                    onSuccess: onGetFunctionsSuccess.bind(undefined, iArguments, iOnRegisterFunctions, generatedContent),
                    onError: onGetFunctionsError.bind(undefined, iArguments)
                });
            }
        };
        var lf = '\n';
        var ht = '\t';
        var regExpAlphanumeric = new RegExp(/^[a-z0-9_]+$/i);
        var csiTypesRequireId = 'DS/SchematicsCSIIntrospection/SchematicsCSITypes';
        var onGetTypesSuccess = function (iArguments, iOnRegisterTypes, iGeneratedContent, iCSITypes) {
            var csiTypes;
            if (iCSITypes instanceof CSICommandBinder.Parameters) {
                var csiParametersJSObject = iCSITypes.toJSObject();
                csiTypes = csiParametersJSObject.types;
                if (iArguments.onWarning !== undefined && csiParametersJSObject.errors !== undefined && csiParametersJSObject.errors.length !== 0) {
                    iArguments.onWarning('CSIIntrospection errors:\n' + csiParametersJSObject.errors);
                }
            }
            else {
                csiTypes = iCSITypes;
            }
            defineCSITypes(iArguments, csiTypes, iGeneratedContent);
            require(iGeneratedContent.typeRequireIdList, function () {
                iOnRegisterTypes();
            });
        };
        var onGetTypesError = function (iArguments, iCSIParameters) {
            if (iArguments.onError !== undefined) {
                iArguments.onError(iCSIParameters.readString('error'));
            }
        };
        var defineCSITypes = function (iArguments, iCSITypes, iGeneratedContent) {
            var csiTypesCode = generateCSITypesCode(iArguments, iCSITypes);
            //eslint-disable-next-line no-eval
            eval(csiTypesCode);
            iGeneratedContent.typeCodeList.push(csiTypesCode);
            iGeneratedContent.typeRequireIdList.push(csiTypesRequireId);
        };
        var hasCSITypeName = function (iCSITypeName, iCSITypes) {
            var result = iCSITypeName === 'Parameters';
            result = result || iCSITypes.find(function (csiType) { return csiType.name === iCSITypeName; }) !== undefined;
            return result;
        };
        var checkCSIPropertyValidity = function (iCSIProperty, iDependencies, iCSITypes) {
            var error;
            if (!regExpAlphanumeric.test(iCSIProperty.label)) {
                error = 'label "' + iCSIProperty.label + '" is not alphanumeric';
            }
            else if (iCSIProperty.parameters !== undefined || iCSIProperty.parametersArray !== undefined) {
                error = checkCSITypeDefinitionValidity(iCSIProperty.parameters || iCSIProperty.parametersArray, iDependencies, iCSITypes);
            }
            else if (iCSIProperty.type !== undefined || iCSIProperty.typeArray !== undefined) {
                var csiTypeName = iCSIProperty.type || iCSIProperty.typeArray;
                if (iCSITypes !== undefined && !hasCSITypeName(csiTypeName, iCSITypes)) {
                    error = 'label "' + iCSIProperty.label + '" is referencing a type which does not exist';
                }
                else {
                    iDependencies.push(csiTypeName);
                }
            }
            else if (iCSIProperty.file !== undefined) {
                error = 'label "' + iCSIProperty.label + '" is using file type which is not supported';
            }
            else if (iCSIProperty.basic === undefined && iCSIProperty.basicArray === undefined) {
                error = 'label "' + iCSIProperty.label + '" is missing a type which is not supported';
            }
            return error;
        };
        var checkCSITypeDefinitionValidity = function (iCSIPropertyDefinitions, iDependencies, iCSITypes) {
            var error;
            for (var p = 0; p < iCSIPropertyDefinitions.length && error === undefined; p++) {
                error = checkCSIPropertyValidity(iCSIPropertyDefinitions[p], iDependencies, iCSITypes);
            }
            return error;
        };
        var checkCSITypeValidity = function (iCSIType, iDependencies, iCSITypes) {
            var error;
            var name = iCSIType.name;
            if (TypeLibrary.isReservedName(name)) {
                error = 'type name "' + name + '" is a reserved name';
            }
            else if (TypeLibrary.hasGlobalType(name, Enums.FTypeCategory.fAll)) {
                error = 'type name "' + name + '" is already registered';
            }
            else if (!regExpAlphanumeric.test(name)) {
                error = 'type name "' + name + '" is not alphanumeric';
            }
            else {
                error = checkCSITypeDefinitionValidity(iCSIType.definition, iDependencies, iCSITypes);
            }
            return error;
        };
        var checkCSITypeDependencies = function (iCSIType, iCSITypesByDependency, iValidCSITypes, iInvalidCSITypes, iArguments) {
            var dependentCSITypes = iCSITypesByDependency[iCSIType.name];
            if (Array.isArray(dependentCSITypes)) {
                for (var dt = 0; dt < dependentCSITypes.length; dt++) {
                    var dependentCSIType = dependentCSITypes[dt];
                    if (iInvalidCSITypes.indexOf(dependentCSIType) === -1) {
                        iInvalidCSITypes.push(dependentCSIType);
                        if (iArguments.onWarning !== undefined) {
                            iArguments.onWarning('CSIType ' + dependentCSIType.name + ' introspection error: dependency on CSIType "' + iCSIType.name + '" which contains errors');
                        }
                        var index = iValidCSITypes.indexOf(dependentCSIType);
                        iValidCSITypes.splice(index, 1);
                    }
                }
            }
        };
        var generateCSITypesCode = function (iArguments, iCSITypes) {
            var csiTypesByDependency = {};
            var validCSITypes = [];
            var invalidCSITypes = [];
            for (var t = 0; t < iCSITypes.length; t++) {
                var csiType = iCSITypes[t];
                var dependencies = [];
                var error = checkCSITypeValidity(csiType, dependencies, iCSITypes);
                if (error !== undefined) {
                    if (iArguments.onWarning !== undefined) {
                        iArguments.onWarning('CSIType ' + csiType.name + ' introspection error: ' + error);
                    }
                    invalidCSITypes.push(csiType);
                }
                else {
                    validCSITypes.push(csiType);
                    for (var d = 0; d < dependencies.length; d++) {
                        var dependency = dependencies[d];
                        if (csiTypesByDependency[dependency] === undefined) {
                            csiTypesByDependency[dependency] = [];
                        }
                        csiTypesByDependency[dependency].push(csiType);
                    }
                }
            }
            for (var it = 0; it < invalidCSITypes.length; it++) {
                var csiType = invalidCSITypes[it];
                checkCSITypeDependencies(csiType, csiTypesByDependency, validCSITypes, invalidCSITypes, iArguments);
            }
            var objectTypes = [];
            var enumTypes = [];
            var invalidDefaultValues = [];
            for (var vt = 0; vt < validCSITypes.length; vt++) {
                var csiType = validCSITypes[vt];
                var objectType = {};
                objectType.name = csiType.name;
                objectType.descriptor = CSITools.getCSITypeDescriptor(csiType.definition, csiType.name, objectTypes, enumTypes, invalidDefaultValues);
                objectTypes.push(objectType);
                typesByName[csiType.name] = undefined;
            }
            if (iArguments.onWarning !== undefined) {
                invalidDefaultValues.forEach(function (invalidDefaultValue) {
                    iArguments.onWarning('CSIType ' + invalidDefaultValue.type + ' introspection error: ' + invalidDefaultValue.error);
                });
            }
            var typesCode = '';
            typesCode += 'define(\'' + csiTypesRequireId + '\', [' + lf;
            typesCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary\'' + lf;
            typesCode += '], function (TypeLibrary) {' + lf;
            typesCode += ht + '\'use strict\';' + lf;
            typesCode += lf;
            typesCode += ht + 'var enumTypes = ' + JSON.stringify(enumTypes, undefined, ht).replace(/^/gm, ht).trim() + ';' + lf;
            typesCode += ht + 'var objectTypes = ' + JSON.stringify(objectTypes, undefined, ht).replace(/^/gm, ht).trim() + ';' + lf;
            typesCode += ht + 'TypeLibrary.registerGlobalTypes(enumTypes, objectTypes, [], []);' + lf;
            typesCode += lf;
            typesCode += ht + 'return null;' + lf;
            typesCode += '});' + lf;
            typesCode += '//# sourceURL=' + csiTypesRequireId + lf;
            return typesCode;
        };
        var onGetFunctionsSuccess = function (iArguments, iOnRegisterFunctions, iGeneratedContent, iCSIParameters) {
            var csiFunctions = iCSIParameters;
            if (iCSIParameters.toJSObject !== undefined) {
                csiFunctions = iCSIParameters.toJSObject().functions;
            }
            var csiPools = [];
            for (var f = 0; f < csiFunctions.length; f++) {
                var csiFunction = csiFunctions[f];
                var csiPool = csiFunction.pool;
                if (csiPools.indexOf(csiPool) === -1) {
                    csiPools.push(csiPool);
                    defineCSIPoolCategory(iArguments, csiPool, iGeneratedContent);
                }
                defineCSIFunctionBlock(iArguments, csiFunction, iGeneratedContent);
            }
            require(iGeneratedContent.blockRequireIdList, function () {
                iOnRegisterFunctions();
            });
        };
        var onGetFunctionsError = function (iArguments, iCSIParameters) {
            if (iArguments.onError !== undefined) {
                iArguments.onError(iCSIParameters.readString('error'));
            }
        };
        var checkCSIPoolValidity = function (iCSIPool) {
            var error;
            if (!regExpAlphanumeric.test(iCSIPool.replace(/\./g, '_'))) {
                error = 'pool name "' + iCSIPool + '" is not alphanumeric';
            }
            return error;
        };
        var defineCSIPoolCategory = function (iArguments, iCSIPool, iGeneratedContent) {
            var error = checkCSIPoolValidity(iCSIPool);
            if (error !== undefined) {
                if (iArguments.onWarning !== undefined) {
                    iArguments.onWarning('CSIPool ' + iCSIPool + ' introspection error: ' + error);
                }
            }
            else {
                var csiPoolCategoryDocCode = generateCSIPoolCategoryDocCode(iCSIPool);
                //eslint-disable-next-line no-eval
                eval(csiPoolCategoryDocCode);
                iGeneratedContent.categoryDocCodeList.push(csiPoolCategoryDocCode);
                iGeneratedContent.categoryDocRequireIdList.push(getCSIPoolCategoryDocRequireId(iCSIPool));
                var csiPoolCategoryCode = generateCSIPoolCategoryCode(iCSIPool);
                //eslint-disable-next-line no-eval
                eval(csiPoolCategoryCode);
                iGeneratedContent.categoryCodeList.push(csiPoolCategoryCode);
                iGeneratedContent.categoryRequireIdList.push(getCSIPoolCategoryRequireId(iCSIPool));
            }
        };
        var getCSIPoolCategoryVarName = function (iCSIPool) {
            return iCSIPool.replace(/\./g, '_') + 'Category';
        };
        var getCSIPoolCategoryRequireId = function (iCSIPool) {
            return 'DS/' + iCSIPool + '/' + iCSIPool + 'Category';
        };
        var getCSIPoolCategoryDocVarName = function (iCSIPool) {
            return getCSIPoolCategoryVarName(iCSIPool) + 'Doc';
        };
        var getCSIPoolCategoryDocRequireId = function (iCSIPool) {
            return getCSIPoolCategoryRequireId(iCSIPool) + 'Doc';
        };
        var generateCSIPoolCategoryDocCode = function (iCSIPool) {
            var categoryDocVarName = getCSIPoolCategoryDocVarName(iCSIPool);
            var categoryDocRequireId = getCSIPoolCategoryDocRequireId(iCSIPool);
            var categoryDocObject = {};
            categoryDocObject.version = '1.0.0';
            categoryDocObject.description = 'The <code>' + iCSIPool + '</code> category corresponds to the CSI pool of the same name and regroups all its CSI function blocks.';
            categoryDocObject.icon = {
                name: 'object-related',
                fontFamily: 'eFont3DS'
            };
            var categoryDocJSON = JSON.stringify(categoryDocObject, undefined, ht);
            categoryDocJSON = categoryDocJSON.replace(/^/gm, ht).trim();
            categoryDocJSON = categoryDocJSON.trim();
            var categoryDocCode = 'define(\'' + categoryDocRequireId + '\', [], function () {' + lf;
            categoryDocCode += ht + '\'use strict\';' + lf;
            categoryDocCode += lf;
            categoryDocCode += ht + 'var ' + categoryDocVarName + ' = ' + categoryDocJSON + ';' + lf;
            categoryDocCode += lf;
            categoryDocCode += ht + 'return ' + categoryDocVarName + ';' + lf;
            categoryDocCode += '});' + lf;
            categoryDocCode += '//# sourceURL=' + categoryDocRequireId + lf;
            return categoryDocCode;
        };
        var generateCSIPoolCategoryCode = function (iCSIPool) {
            var category = iCSIPool;
            var categoryVarName = getCSIPoolCategoryVarName(iCSIPool);
            var categoryRequireId = getCSIPoolCategoryRequireId(iCSIPool);
            var categoryDocRequireId = getCSIPoolCategoryDocRequireId(iCSIPool);
            var categoryCode = 'define(\'' + categoryRequireId + '\', [' + lf;
            categoryCode += ht + '\'DS/EPSSchematicsCSI/EPSSchematicsCSICategory\',' + lf;
            categoryCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary\'' + lf;
            categoryCode += '], function (CSICategory, BlockLibrary) {' + lf;
            categoryCode += ht + '\'use strict\';' + lf;
            categoryCode += lf;
            categoryCode += ht + 'var ' + categoryVarName + ' = CSICategory + \'/' + category + '\';' + lf;
            categoryCode += lf;
            categoryCode += ht + 'BlockLibrary.registerCategory(' + categoryVarName + ', \'' + categoryDocRequireId + '\');' + lf;
            categoryCode += lf;
            categoryCode += ht + 'return ' + categoryVarName + ';' + lf;
            categoryCode += '});' + lf;
            categoryCode += '//# sourceURL=' + categoryRequireId + lf;
            return categoryCode;
        };
        var checkCSIFunctionValidity = function (iCSIFunction, iDependencies) {
            var error = checkCSIPoolValidity(iCSIFunction.pool);
            if (error === undefined) {
                if (!regExpAlphanumeric.test(iCSIFunction.name)) {
                    error = 'function name "' + iCSIFunction.name + '" is not alphanumeric';
                }
                else {
                    if (iCSIFunction.onCall.in.parameters !== undefined) {
                        error = checkCSITypeDefinitionValidity(iCSIFunction.onCall.in.parameters, iDependencies);
                    }
                    else if (iCSIFunction.onCall.in.type !== undefined) {
                        iDependencies.push(iCSIFunction.onCall.in.type);
                    }
                    else if (iCSIFunction.onCall.in.file !== undefined) {
                        error = 'onCall.in definition is using file type which is not supported';
                    }
                    if (error === undefined) {
                        if (iCSIFunction.onCall.out.parameters !== undefined) {
                            error = checkCSITypeDefinitionValidity(iCSIFunction.onCall.out.parameters, iDependencies);
                        }
                        else if (iCSIFunction.onCall.out.type !== undefined) {
                            iDependencies.push(iCSIFunction.onCall.out.type);
                        }
                        else if (iCSIFunction.onCall.out.file !== undefined) {
                            error = 'onCall.out definition is using file type which is not supported';
                        }
                    }
                    if (error === undefined && iCSIFunction.progress !== undefined) {
                        if (iCSIFunction.progress.parameters !== undefined) {
                            error = checkCSITypeDefinitionValidity(iCSIFunction.progress.parameters, iDependencies);
                        }
                        else if (iCSIFunction.progress.type !== undefined) {
                            iDependencies.push(iCSIFunction.progress.type);
                        }
                        else if (iCSIFunction.progress.file !== undefined) {
                            error = 'progress definition is using file type which is not supported';
                        }
                    }
                    if (error === undefined && iCSIFunction.throwError !== undefined) {
                        if (iCSIFunction.throwError.parameters !== undefined) {
                            error = checkCSITypeDefinitionValidity(iCSIFunction.throwError.parameters, iDependencies);
                        }
                        else if (iCSIFunction.throwError.type !== undefined) {
                            iDependencies.push(iCSIFunction.throwError.type);
                        }
                        else if (iCSIFunction.throwError.file !== undefined) {
                            error = 'throwError definition is using file type which is not supported';
                        }
                    }
                }
            }
            return error;
        };
        var checkCSIFunctionDependencies = function (iDependencies) {
            var error;
            for (var d = 0; d < iDependencies.length && error === undefined; d++) {
                var dependency = iDependencies[d];
                if (dependency !== 'Parameters' && !TypeLibrary.hasGlobalType(dependency, Enums.FTypeCategory.fObject)) {
                    error = 'dependency on CSIType "' + dependency + '" which contains errors';
                }
            }
            return error;
        };
        var defineCSIFunctionBlock = function (iArguments, iCSIFunction, iGeneratedContent) {
            var dependencies = [];
            var error = checkCSIFunctionValidity(iCSIFunction, dependencies);
            if (error === undefined) {
                error = checkCSIFunctionDependencies(dependencies);
            }
            if (error !== undefined) {
                if (iArguments.onWarning !== undefined) {
                    iArguments.onWarning('CSIFunction ' + iCSIFunction.pool + '/' + iCSIFunction.name + '_v' + iCSIFunction.version + ' introspection error: ' + error);
                }
            }
            else {
                var csiFunctionBlockDocCode = generateCSIFunctionBlockDocCode(iCSIFunction);
                //eslint-disable-next-line no-eval
                eval(csiFunctionBlockDocCode);
                iGeneratedContent.blockDocCodeList.push(csiFunctionBlockDocCode);
                iGeneratedContent.blockDocRequireIdList.push(getCSIFunctionBlockDocRequireId(iCSIFunction));
                var csiFunctionBlockCode = generateCSIFunctionBlockCode(iArguments, iCSIFunction);
                //eslint-disable-next-line no-eval
                eval(csiFunctionBlockCode);
                iGeneratedContent.blockCodeList.push(csiFunctionBlockCode);
                iGeneratedContent.blockRequireIdList.push(getCSIFunctionBlockRequireId(iCSIFunction));
                functionsByUid[getCSIFunctionBlockUid(iCSIFunction)] = iCSIFunction;
            }
        };
        var getCSIFunctionBlockName = function (iCSIFunction) {
            return iCSIFunction.name + '_v' + iCSIFunction.version;
        };
        var getCSIFunctionBlockUid = function (iCSIFunction) {
            return iCSIFunction.pool + '/' + getCSIFunctionBlockName(iCSIFunction);
        };
        var getCSIFunctionBlockVarName = function (iCSIFunction) {
            return getCSIFunctionBlockName(iCSIFunction) + 'Block';
        };
        var getCSIFunctionBlockDocVarName = function (iCSIFunction) {
            return getCSIFunctionBlockVarName(iCSIFunction) + 'Doc';
        };
        var getCSIFunctionBlockRequireId = function (iCSIFunction) {
            return 'DS/' + iCSIFunction.pool + '/' + getCSIFunctionBlockVarName(iCSIFunction);
        };
        var getCSIFunctionBlockDocRequireId = function (iCSIFunction) {
            return getCSIFunctionBlockRequireId(iCSIFunction) + 'Doc';
        };
        var generateCSIFunctionBlockDocCode = function (iCSIFunction) {
            var blockDocVarName = getCSIFunctionBlockDocVarName(iCSIFunction);
            var blockDocRequireId = getCSIFunctionBlockDocRequireId(iCSIFunction);
            var blockDocObject = {};
            blockDocObject.version = '1.0.0';
            blockDocObject.summary = 'Executes the <code>' + iCSIFunction.name + '</code> CSI function (version: <code>' + iCSIFunction.version + '</code>, pool: <code>' + iCSIFunction.pool + '</code>).';
            if (typeof iCSIFunction.desc === 'string' && iCSIFunction.desc.length !== 0) {
                blockDocObject.summary += '<br>' + iCSIFunction.desc.charAt(0).toUpperCase() + iCSIFunction.desc.slice(1);
                blockDocObject.description = 'The purpose of the function executed by this block is:<br>' + iCSIFunction.desc.charAt(0).toUpperCase() + iCSIFunction.desc.slice(1);
                if (iCSIFunction.desc.slice(-1) !== '.') {
                    blockDocObject.summary += '.';
                    blockDocObject.description += '.';
                }
            }
            blockDocObject.controlPorts = {};
            blockDocObject.controlPorts.Call = 'triggers the block and calls the function.';
            blockDocObject.controlPorts.Success = 'is activated when the function returns a successful result.';
            if (iCSIFunction.progress !== undefined) {
                blockDocObject.controlPorts.Progress = 'is activated when the function returns a intermediate result.';
            }
            if (iCSIFunction.throwError !== undefined) {
                blockDocObject.controlPorts.Error = 'is activated when the function returns an error.';
            }
            //blockDocObject.controlPorts.Interrupt = 'interrupts the function.';
            blockDocObject.dataPorts = {};
            if (iCSIFunction.onCall.in.parameters !== undefined || iCSIFunction.onCall.in.type !== undefined) {
                blockDocObject.dataPorts.Call = 'is used as input data when the function is called.';
                if (typeof iCSIFunction.onCall.in.desc === 'string' && iCSIFunction.onCall.in.desc.length !== 0) {
                    blockDocObject.dataPorts.Call += ' ' + iCSIFunction.onCall.in.desc.charAt(0).toUpperCase() + iCSIFunction.onCall.in.desc.slice(1);
                    if (iCSIFunction.onCall.in.desc.slice(-1) !== '.') {
                        blockDocObject.dataPorts.Call += '.';
                    }
                }
            }
            blockDocObject.dataPorts.NodeIdSelector = 'is used to override the node id selector when the function is called.';
            if (iCSIFunction.onCall.out.parameters !== undefined || iCSIFunction.onCall.out.type !== undefined) {
                blockDocObject.dataPorts.Success = 'receives the successful data when <code>Success</code> control port is activated.';
                if (typeof iCSIFunction.onCall.out.desc === 'string' && iCSIFunction.onCall.out.desc.length !== 0) {
                    blockDocObject.dataPorts.Success += ' ' + iCSIFunction.onCall.out.desc.charAt(0).toUpperCase() + iCSIFunction.onCall.out.desc.slice(1);
                    if (iCSIFunction.onCall.out.desc.slice(-1) !== '.') {
                        blockDocObject.dataPorts.Success += '.';
                    }
                }
            }
            if (iCSIFunction.progress !== undefined && (iCSIFunction.progress.parameters !== undefined ||
                iCSIFunction.progress.type !== undefined)) {
                blockDocObject.dataPorts.Progress = 'receives the intermediate data when <code>Progress</code> control port is activated.';
                if (typeof iCSIFunction.progress.desc === 'string' && iCSIFunction.progress.desc.length !== 0) {
                    blockDocObject.dataPorts.Progress += ' ' + iCSIFunction.progress.desc.charAt(0).toUpperCase() + iCSIFunction.progress.desc.slice(1);
                    if (iCSIFunction.progress.desc.slice(-1) !== '.') {
                        blockDocObject.dataPorts.Progress += '.';
                    }
                }
            }
            if (iCSIFunction.throwError !== undefined && (iCSIFunction.throwError.parameters !== undefined ||
                iCSIFunction.throwError.type !== undefined)) {
                blockDocObject.dataPorts.Error = 'receives the error data when <code>Error</code> control port  is activated.';
                if (typeof iCSIFunction.throwError.desc === 'string' && iCSIFunction.throwError.desc.length !== 0) {
                    blockDocObject.dataPorts.Error += ' ' + iCSIFunction.throwError.desc.charAt(0).toUpperCase() + iCSIFunction.throwError.desc.slice(1);
                    if (iCSIFunction.throwError.desc.slice(-1) !== '.') {
                        blockDocObject.dataPorts.Error += '.';
                    }
                }
            }
            var webapp = window.location.pathname.slice(1);
            blockDocObject.example = {
                webapp: webapp,
                content: getCSIFunctionBlockUid(iCSIFunction)
            };
            var blockDocJSON = JSON.stringify(blockDocObject, undefined, ht);
            blockDocJSON = blockDocJSON.replace(/^/gm, ht).trim();
            blockDocJSON = blockDocJSON.trim();
            var blockDocCode = 'define(\'' + blockDocRequireId + '\', [], function () {' + lf;
            blockDocCode += ht + '\'use strict\';' + lf;
            blockDocCode += lf;
            blockDocCode += ht + 'var ' + blockDocVarName + ' = ' + blockDocJSON + ';' + lf;
            blockDocCode += lf;
            blockDocCode += ht + 'return ' + blockDocVarName + ';' + lf;
            blockDocCode += '});' + lf;
            blockDocCode += '//# sourceURL=' + blockDocRequireId + lf;
            return blockDocCode;
        };
        // eslint-disable-next-line complexity
        var generateCSIFunctionBlockCode = function (iArguments, iCSIFunction) {
            var _a, _b;
            var categoryVarName = getCSIPoolCategoryVarName(iCSIFunction.pool);
            var categoryRequireId = getCSIPoolCategoryRequireId(iCSIFunction.pool);
            var blockName = getCSIFunctionBlockName(iCSIFunction);
            var blockUid = getCSIFunctionBlockUid(iCSIFunction);
            var blockVarName = getCSIFunctionBlockVarName(iCSIFunction);
            var blockRequireId = getCSIFunctionBlockRequireId(iCSIFunction);
            var blockDocRequireId = getCSIFunctionBlockDocRequireId(iCSIFunction);
            var blockPool = iCSIFunction.pool.replace(/\./g, '_'); // to avoid non alphanumeric
            var callType, successType, progressType, errorType;
            var objectTypes = [];
            var enumTypes = [];
            var invalidDefaultValues = [];
            if (iCSIFunction.onCall.in.parameters !== undefined) {
                callType = {};
                callType.name = blockPool + '_' + blockName + '_Call_Parameters';
                callType.descriptor = CSITools.getCSITypeDescriptor(iCSIFunction.onCall.in.parameters, callType.name, objectTypes, enumTypes, invalidDefaultValues);
                objectTypes.push(callType);
                if (iArguments.onWarning !== undefined) {
                    invalidDefaultValues.forEach(function (invalidDefaultValue) {
                        iArguments.onWarning('CSIFunction ' + iCSIFunction.pool + '/' + iCSIFunction.name + '_v' + iCSIFunction.version + ' onCall.in introspection error: Type ' + invalidDefaultValue.type + ' ' + invalidDefaultValue.error);
                    });
                }
            }
            if (iCSIFunction.onCall.out.parameters !== undefined) {
                successType = {};
                successType.name = blockPool + '_' + blockName + '_Success_Parameters';
                successType.descriptor = CSITools.getCSITypeDescriptor(iCSIFunction.onCall.out.parameters, successType.name, objectTypes, enumTypes);
                objectTypes.push(successType);
            }
            if (iCSIFunction.progress !== undefined && iCSIFunction.progress.parameters !== undefined) {
                progressType = {};
                progressType.name = blockPool + '_' + blockName + '_Progress_Parameters';
                progressType.descriptor = CSITools.getCSITypeDescriptor(iCSIFunction.progress.parameters, progressType.name, objectTypes, enumTypes);
                objectTypes.push(progressType);
            }
            if (iCSIFunction.throwError !== undefined && iCSIFunction.throwError.parameters !== undefined) {
                errorType = {};
                errorType.name = blockPool + '_' + blockName + '_Error_Parameters';
                errorType.descriptor = CSITools.getCSITypeDescriptor(iCSIFunction.throwError.parameters, errorType.name, objectTypes, enumTypes);
                objectTypes.push(errorType);
            }
            var parentBlockPath, parentBlockClass;
            if (typeof ((_a = iCSIFunction.implementation.settings) === null || _a === void 0 ? void 0 : _a.script) === 'string') {
                parentBlockPath = 'DS/EPSSchematicsCSI/EPSSchematicsCSIScriptFunctionBlock';
                parentBlockClass = 'CSIScriptFunctionBlock';
            }
            else if (((_b = iCSIFunction.implementation.settings) === null || _b === void 0 ? void 0 : _b.type) === 'ExecutionGraph') {
                parentBlockPath = 'DS/EPSSchematicsCSI/EPSSchematicsCSIGraphFunctionBlock';
                parentBlockClass = 'CSIGraphFunctionBlock';
            }
            else {
                parentBlockPath = 'DS/EPSSchematicsCSI/EPSSchematicsCSIFunctionBlock';
                parentBlockClass = 'CSIFunctionBlock';
            }
            var blockCode = 'define(\'' + blockRequireId + '\', [' + lf;
            blockCode += ht + '\'' + categoryRequireId + '\',' + lf;
            blockCode += ht + '\'' + parentBlockPath + '\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsCSI/EPSSchematicsCSITools\',' + lf;
            blockCode += ht + '\'DS/ExperienceKernel/ExperienceKernel\'' + lf;
            blockCode += '], function (' + categoryVarName + ', ' + parentBlockClass + ', BlockLibrary, TypeLibrary, ControlPortDefinitions, DataPortDefinitions, Enums, CSITools, EK) {' + lf;
            blockCode += ht + '\'use strict\';' + lf;
            if (objectTypes.length !== 0) {
                blockCode += lf;
                blockCode += ht + 'var enumTypes = ' + JSON.stringify(enumTypes, undefined, ht).replace(/^/gm, ht).trim() + ';' + lf;
                blockCode += ht + 'var objectTypes = ' + JSON.stringify(objectTypes, undefined, ht).replace(/^/gm, ht).trim() + ';' + lf;
                blockCode += ht + 'TypeLibrary.registerGlobalTypes(enumTypes, objectTypes, [], []);' + lf;
            }
            blockCode += lf;
            blockCode += ht + 'var ' + blockVarName + ' = function () {' + lf;
            blockCode += ht + ht + parentBlockClass + '.call(this);' + lf;
            blockCode += lf;
            blockCode += ht + ht + 'this.createControlPort(new ControlPortDefinitions.Input(\'Call\'));' + lf;
            blockCode += ht + ht + 'this.createControlPort(new ControlPortDefinitions.Output(\'Success\'));' + lf;
            if (iCSIFunction.progress !== undefined) {
                blockCode += ht + ht + 'this.createControlPort(new ControlPortDefinitions.Output(\'Progress\'));' + lf;
            }
            if (iCSIFunction.throwError !== undefined) {
                blockCode += ht + ht + 'this.createControlPort(new ControlPortDefinitions.Output(\'Error\'));' + lf;
            }
            //blockCode += ht + ht + 'this.createControlPort(new ControlPortDefinitions.Input(\'Interrupt\'));' + lf;
            blockCode += lf;
            if (iCSIFunction.onCall.in.parameters !== undefined) {
                blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.InputBasic(\'Call\', \'' + callType.name + '\'));' + lf;
            }
            else if (iCSIFunction.onCall.in.type !== undefined) {
                blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.InputBasic(\'Call\', \'' + CSITools.getTypeByCSIType(iCSIFunction.onCall.in.type) + '\'));' + lf;
            }
            if (iCSIFunction.onCall.out.parameters !== undefined) {
                blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.OutputBasic(\'Success\', \'' + successType.name + '\'));' + lf;
            }
            else if (iCSIFunction.onCall.out.type !== undefined) {
                blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.OutputBasic(\'Success\', \'' + CSITools.getTypeByCSIType(iCSIFunction.onCall.out.type) + '\'));' + lf;
            }
            if (iCSIFunction.progress !== undefined) {
                if (iCSIFunction.progress.parameters !== undefined) {
                    blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.OutputBasic(\'Progress\', \'' + progressType.name + '\'));' + lf;
                }
                else if (iCSIFunction.progress.type !== undefined) {
                    blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.OutputBasic(\'Progress\', \'' + CSITools.getTypeByCSIType(iCSIFunction.progress.type) + '\'));' + lf;
                }
            }
            if (iCSIFunction.throwError !== undefined) {
                if (iCSIFunction.throwError.parameters !== undefined) {
                    blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.OutputBasic(\'Error\', \'' + errorType.name + '\'));' + lf;
                }
                else if (iCSIFunction.throwError.type !== undefined) {
                    blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.OutputBasic(\'Error\', \'' + CSITools.getTypeByCSIType(iCSIFunction.throwError.type) + '\'));' + lf;
                }
            }
            blockCode += ht + ht + 'const nodeIdSelectorType = TypeLibrary.hasGlobalType(\'CSIExecGraphNodeIdSelector\', Enums.FTypeCategory.fObject) ? \'CSIExecGraphNodeIdSelector\' : \'Object\';' + lf;
            blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.InputExternalBasic(\'NodeIdSelector\', nodeIdSelectorType, undefined, true));' + lf;
            blockCode += ht + ht + 'this.activateNodeIdSelector();' + lf;
            blockCode += lf;
            blockCode += ht + ht + 'this.setJSONFunction(' + JSON.stringify(iCSIFunction, undefined, ht).replace(/^/gm, ht + ht).trim() + ');' + lf;
            blockCode += ht + '};' + lf;
            blockCode += lf;
            blockCode += ht + blockVarName + '.prototype = Object.create(' + parentBlockClass + '.prototype);' + lf;
            blockCode += ht + blockVarName + '.prototype.constructor = ' + blockVarName + ';' + lf;
            blockCode += lf;
            blockCode += ht + blockVarName + '.prototype.uid = \'' + blockUid + '\';' + lf;
            blockCode += ht + blockVarName + '.prototype.name = \'' + blockName + '\';' + lf;
            blockCode += ht + blockVarName + '.prototype.category = ' + categoryVarName + ';' + lf;
            blockCode += ht + blockVarName + '.prototype.documentation = \'' + blockDocRequireId + '\';' + lf;
            blockCode += lf;
            blockCode += ht + 'BlockLibrary.registerBlock(' + blockVarName + ');' + lf;
            blockCode += lf;
            blockCode += ht + 'return ' + blockVarName + ';' + lf;
            blockCode += '});' + lf;
            blockCode += '//# sourceURL=' + blockRequireId + lf;
            return blockCode;
        };
    })(CSIIntrospection || (CSIIntrospection = {}));
    return CSIIntrospection;
});
