/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSIExport'/>
define("DS/EPSSchematicsCSI/EPSSchematicsCSIExport", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphContainerBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsContainedGraphBlock", "DS/EPSSchematicsCSI/EPSSchematicsCSIIntrospection", "DS/EPSSchematicsCSI/EPSSchematicsCSITools", "DS/EPSSchematicsCSI/EPSSchematicsCSIGraphBlock", "DS/EPSSchematicsCSI/EPSSchematicsCSIJavaScriptBlock", "DS/EPSSchematicsCSI/EPSSchematicsCSIPythonBlock", "DS/EPSSchematicsCoreLibrary/flow/EPSIfBlock", "DS/EPSSchematicsCoreLibrary/flow/EPSSyncFlowsBlock", "DS/EPSSchematicsCoreLibrary/flow/EPSJoinAllBlock", "DS/EPSSchematicsCoreLibrary/flow/EPSOnlyOneBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSAddBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSDivideBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSIsEqualBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSMultiplyBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSSetValueBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSSubstractBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayConcatBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayFilterBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayGetBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayGetIndexBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayInsertBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayIteratorBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayLengthBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayMapBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayPopBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayPushBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayRemoveBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArraySetBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayShiftBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayUnshiftBlock", "DS/CSICommandBinder/CSICommandBinder"], function (require, exports, Tools, Enums, TypeLibrary, GraphContainerBlock, ContainedGraphBlock, CSIIntrospection, CSITools, CSIGraphBlock, CSIJavaScriptBlock, CSIPythonBlock, IfBlock, SyncFlowsBlock, JoinAllBlock, OnlyOneBlock, AddBlock, DivideBlock, IsEqualBlock, MultiplyBlock, SetValueBlock, SubstractBlock, ArrayConcatBlock, ArrayFilterBlock, ArrayGetBlock, ArrayGetIndexBlock, ArrayInsertBlock, ArrayIteratorBlock, ArrayLengthBlock, ArrayMapBlock, ArrayPopBlock, ArrayPushBlock, ArrayRemoveBlock, ArraySetBlock, ArrayShiftBlock, ArrayUnshiftBlock, CSICommandBinder) {
    "use strict";
    var CSIExport;
    (function (CSIExport) {
        /**
         * Generates a JSON from the graph block.
         * @private
         * @param {GraphBlock} iGraphBlock - The graph block.
         * @param {number} iVersion - The version.
         * @returns {string} The JSON graph block.
         */
        function generateJSON(iGraphBlock, iVersion) {
            return JSON.stringify(generateJSONObject(iGraphBlock, iVersion), undefined, 2);
        }
        CSIExport.generateJSON = generateJSON;
        /**
         * Generates a JSON Object from the graph block.
         * @private
         * @param {GraphBlock} iGraphBlock - The graph block.
         * @param {number} iVersion - The version.
         * @returns {ICSIJSONGraphFunction} The JSON Object graph block.
         */
        function generateJSONObject(iGraphBlock, iVersion) {
            var jsonObject = {};
            CSIExport.mapCSItoSchematics = {};
            CSIExport.mapSchematicsLinks = {};
            jsonObject.desc = iGraphBlock.getDescription() || 'Specify here the description of this function, graph of function(s)';
            jsonObject.grammarVersion = 3;
            jsonObject.implementation = {};
            jsonObject.implementation.name = 'executionGraph';
            jsonObject.implementation.version = iVersion;
            jsonObject.implementation.settings = {};
            csiExportBlock(iGraphBlock, jsonObject.implementation.settings);
            jsonObject.onCall = {
                'in': CSITools.getCSISignatureFromDataPort(iGraphBlock.getDataPortByName('Call')),
                out: CSITools.getCSISignatureFromDataPort(iGraphBlock.getDataPortByName('Success'))
            };
            jsonObject.progress = {
                type: 'CSIExecGraphProgress'
            }; // DEFAULT
            jsonObject.throwError = {
                type: 'CSIExecGraphError'
            }; // DEFAULT
            if (iVersion > 1) {
                var progress = CSITools.getCSISignatureFromDataPort(iGraphBlock.getDataPortByName('Progress'));
                if (Object.keys(progress).length > 0) {
                    jsonObject.progress = progress;
                }
                var throwError = CSITools.getCSISignatureFromDataPort(iGraphBlock.getDataPortByName('Error'));
                if (Object.keys(throwError).length > 0) {
                    jsonObject.throwError = throwError;
                }
            }
            var customImplementations = [];
            var blocksByUid = iGraphBlock.getBlocksByUid();
            if (blocksByUid.hasOwnProperty(CSIJavaScriptBlock.prototype.uid)) {
                customImplementations.push('ecmaScript_v1');
            }
            if (blocksByUid.hasOwnProperty(CSIPythonBlock.prototype.uid)) {
                customImplementations.push('python_v2');
            }
            var types = [];
            Object.keys(iGraphBlock.getObjectsByType()).forEach(function (type) {
                var arrayValueTypeName = TypeLibrary.getArrayValueTypeName(type);
                var typeName = arrayValueTypeName ? arrayValueTypeName : type;
                if (CSIIntrospection.hasType(typeName) && !types.includes(typeName)) {
                    types.push(typeName);
                }
            });
            TypeLibrary.getLocalCustomTypeNameList(iGraphBlock.getGraphContext(), Enums.FTypeCategory.fAll ^ Enums.FTypeCategory.fArray).forEach(function (typeName) {
                var typeDesc = TypeLibrary.getLocalCustomType(iGraphBlock, typeName);
                Object.keys(typeDesc).forEach(function (propertyName) {
                    var propertyType = typeDesc[propertyName].type;
                    if (CSIIntrospection.hasType(propertyType) && !types.includes(propertyType)) {
                        types.push(typeName);
                    }
                });
            });
            jsonObject.implementation.settings.dependencies = {
                customImplementations: customImplementations,
                types: types
            };
            return jsonObject;
        }
        CSIExport.generateJSONObject = generateJSONObject;
        var csiExportDataPort = function (iLocalDataPort, oJSONLocalDataPort) {
            var csiParameters = CSICommandBinder.createParameters();
            var csiName = dataPortToCSIName(iLocalDataPort);
            CSITools.writePropertyParameters(csiName.split('.').pop(), iLocalDataPort.getValueType(), iLocalDataPort.getDefaultValue(), iLocalDataPort.getGraphContext(), csiParameters);
            oJSONLocalDataPort.id = csiName;
            oJSONLocalDataPort.value = csiParameters.exportToString();
        };
        var csiExportNodeIdSelector = function (iNodeIdSelector, oJSONNodeIdSelector) {
            oJSONNodeIdSelector.id = iNodeIdSelector.getName();
            oJSONNodeIdSelector.pool = iNodeIdSelector.getPool();
            var criterion = iNodeIdSelector.getCriterion();
            switch (criterion) {
                case Enums.ECriterion.eIdentifier:
                    {
                        oJSONNodeIdSelector.identifier = iNodeIdSelector.getIdentifier();
                        break;
                    }
                case Enums.ECriterion.eOnlyMyHypervisor:
                    {
                        oJSONNodeIdSelector.onlyMyHypervisor = true;
                        break;
                    }
                case Enums.ECriterion.eNotMyHypervisor:
                    {
                        oJSONNodeIdSelector.notMyHypervisor = true;
                        break;
                    }
                case Enums.ECriterion.ePreferMyHypervisor:
                    {
                        oJSONNodeIdSelector.preferMyHypervisor = true;
                        break;
                    }
            }
            oJSONNodeIdSelector.timeout = iNodeIdSelector.getTimeout();
            if (!iNodeIdSelector.getQueuing()) {
                oJSONNodeIdSelector.noQueuing = true;
            }
            oJSONNodeIdSelector.maxInstanceCount = iNodeIdSelector.getMaxInstanceCount();
            oJSONNodeIdSelector.cmdLine = iNodeIdSelector.getCmdLine();
        };
        var csiExportArrayMapBlock = function (iArrayMapBlock, oJSONGraphBlock) {
            csiExportGraphBlock(iArrayMapBlock.getContainedGraph(), oJSONGraphBlock);
            oJSONGraphBlock.type = 'ArrayMap';
        };
        var csiExportArrayFilterBlock = function (iArrayFilterBlock, oJSONGraphBlock) {
            csiExportGraphBlock(iArrayFilterBlock.getContainedGraph(), oJSONGraphBlock);
            oJSONGraphBlock.type = 'ArrayFilter';
        };
        var csiExportGraphBlock = function (iGraphBlock, oJSONGraphBlock) {
            oJSONGraphBlock.type = 'ExecutionGraph';
            oJSONGraphBlock.implementation.blocks = [];
            var blocks = iGraphBlock.getBlocks();
            for (var b = 0; b < blocks.length; b++) {
                var jsonBlock = {};
                csiExportBlock(blocks[b], jsonBlock);
                oJSONGraphBlock.implementation.blocks.push(jsonBlock);
            }
            oJSONGraphBlock.implementation.controlFlows = [];
            var controlLinks = iGraphBlock.getControlLinks();
            for (var cl = 0; cl < controlLinks.length; cl++) {
                var jsonControlLink = {};
                csiExportControlLink(controlLinks[cl], jsonControlLink);
                oJSONGraphBlock.implementation.controlFlows.push(jsonControlLink);
            }
            oJSONGraphBlock.implementation.dataFlows = [];
            var dataLinks = iGraphBlock.getDataLinks();
            for (var dl = 0; dl < dataLinks.length; dl++) {
                var jsonDataLink = {};
                csiExportDataLink(dataLinks[dl], jsonDataLink);
                oJSONGraphBlock.implementation.dataFlows.push(jsonDataLink);
            }
            var localDataPorts = iGraphBlock.getDataPorts(Enums.EDataPortType.eLocal);
            for (var ldp = 0; ldp < localDataPorts.length; ldp++) {
                var jsonLocalDataPort = {};
                csiExportDataPort(localDataPorts[ldp], jsonLocalDataPort);
                oJSONGraphBlock.implementation.localDataPorts.push(jsonLocalDataPort);
            }
            oJSONGraphBlock.implementation.nodeIdSelectors = [];
            var nodeIdSelectors = iGraphBlock.getNodeIdSelectors();
            for (var nis = 0; nis < nodeIdSelectors.length; nis++) {
                var jsonNodeIdSelector = {};
                csiExportNodeIdSelector(nodeIdSelectors[nis], jsonNodeIdSelector);
                oJSONGraphBlock.implementation.nodeIdSelectors.push(jsonNodeIdSelector);
            }
            if (iGraphBlock instanceof CSIGraphBlock) {
                oJSONGraphBlock.implementation.runtimeSettings = {};
                oJSONGraphBlock.implementation.runtimeSettings.defaultTimeout = iGraphBlock.getSettingByName('defaultTimeout').getValue();
                oJSONGraphBlock.implementation.runtimeSettings.directData = iGraphBlock.getSettingByName('directData').getValue();
                oJSONGraphBlock.implementation.runtimeSettings.progressEvents = iGraphBlock.getSettingByName('progressEvents').getValue();
                oJSONGraphBlock.implementation.runtimeSettings.multipleCall = iGraphBlock.getSettingByName('multipleCall').getValue();
            }
        };
        var csiExportLogicalBlock = function (iBlock, oJSONBlock, iMode, iNbPorts, iDataTypes) {
            oJSONBlock.type = 'Logical';
            oJSONBlock.implementation.mode = iMode;
            if (iNbPorts) {
                oJSONBlock.implementation.nbPorts = iBlock.getControlPorts(Enums.EControlPortType.eInput).length;
            }
            if (iDataTypes) {
                oJSONBlock.implementation.inputDataTypes = [];
                oJSONBlock.implementation.outputDataTypes = [];
                iBlock.getDataPorts().forEach(function (dataPort) {
                    var valueType = dataPort.getValueType();
                    var name = dataPort.getName();
                    var csiName = firstLetterToLowerCase(name);
                    var arrayValueType = TypeLibrary.getArrayValueTypeName(valueType);
                    var csiDataType = arrayValueType ? CSITools.getCSITypeByType(arrayValueType) + '[]' : CSITools.getCSITypeByType(valueType);
                    if (dataPort.getType() === Enums.EDataPortType.eInput) {
                        oJSONBlock.implementation.inputDataTypes.push({ name: csiName, type: csiDataType });
                    }
                    else if (dataPort.getType() === Enums.EDataPortType.eOutput) {
                        oJSONBlock.implementation.outputDataTypes.push({ name: csiName, type: csiDataType });
                    }
                });
            }
        };
        var csiExportJavaScriptBlock = function (iJavaScriptBlock, oJSONJavaScriptBlock) {
            oJSONJavaScriptBlock.type = 'CustomImpl';
            var exportContent = iJavaScriptBlock.exportContent();
            oJSONJavaScriptBlock.implementation.definition = JSON.parse(exportContent);
        };
        var csiExportPythonBlock = function (iPythonBlock, oJSONPythonBlock) {
            oJSONPythonBlock.type = 'CustomImpl';
            var exportContent = iPythonBlock.exportContent();
            oJSONPythonBlock.implementation.definition = JSON.parse(exportContent);
        };
        var csiExportFunctionBlock = function (iFunctionBlock, oJSONFunctionBlock) {
            oJSONFunctionBlock.type = 'Function';
            oJSONFunctionBlock.implementation.pool = iFunctionBlock.getCategory().split('/')[1];
            var nameTab = iFunctionBlock.getName().split('_v');
            if (nameTab.length > 1) {
                oJSONFunctionBlock.implementation.function = nameTab.slice(0, nameTab.length - 1).join('_v');
                oJSONFunctionBlock.implementation.version = Number(nameTab[nameTab.length - 1]);
            }
        };
        var csiExportBlock = function (iBlock, oJSONBlock) {
            oJSONBlock.displayName = iBlock.getName();
            oJSONBlock.id = blockToCSIPath(iBlock);
            oJSONBlock.implementation = {};
            oJSONBlock.implementation.localDataPorts = [];
            if (iBlock.getGraphContext() !== iBlock) {
                var inputDataPorts = iBlock.getDataPorts([Enums.EDataPortType.eInput, Enums.EDataPortType.eInputExternal]);
                for (var idp = 0; idp < inputDataPorts.length; idp++) {
                    var inputDataPort = inputDataPorts[idp];
                    if (inputDataPort.getDefaultValue() !== undefined &&
                        (inputDataPort.isOverride() || !CSIIntrospection.hasBlock(iBlock.getUid()) || CSIIntrospection.hasType(inputDataPort.getValueType()))) {
                        var jsonLocalDataPort = { id: '', value: '' };
                        csiExportDataPort(inputDataPort, jsonLocalDataPort);
                        oJSONBlock.implementation.localDataPorts.push(jsonLocalDataPort);
                    }
                }
            }
            if (iBlock instanceof ArrayMapBlock) {
                csiExportArrayMapBlock(iBlock, oJSONBlock);
            }
            else if (iBlock instanceof ArrayFilterBlock) {
                csiExportArrayFilterBlock(iBlock, oJSONBlock);
            }
            else if (isInstanceOfArray(iBlock) || isInstanceOfCalculator(iBlock)) {
                var csiBlockName = firstLetterToLowerCase(removeSpaces(iBlock.getName()));
                csiExportLogicalBlock(iBlock, oJSONBlock, csiBlockName, false, true);
            }
            else if (iBlock instanceof SyncFlowsBlock) {
                csiExportLogicalBlock(iBlock, oJSONBlock, 'waitAll', true, false);
            }
            else if (iBlock instanceof JoinAllBlock) {
                csiExportLogicalBlock(iBlock, oJSONBlock, 'joinAll', false, false);
            }
            else if (iBlock instanceof OnlyOneBlock) {
                csiExportLogicalBlock(iBlock, oJSONBlock, 'onlyOne', true, true);
            }
            else if (iBlock instanceof IfBlock) {
                csiExportLogicalBlock(iBlock, oJSONBlock, 'ifCondi', false, false);
            }
            else if (iBlock instanceof CSIJavaScriptBlock) {
                csiExportJavaScriptBlock(iBlock, oJSONBlock);
            }
            else if (iBlock instanceof CSIPythonBlock) {
                csiExportPythonBlock(iBlock, oJSONBlock);
            }
            else if (iBlock instanceof CSIGraphBlock) {
                csiExportGraphBlock(iBlock, oJSONBlock);
            }
            else if (CSIIntrospection.hasBlock(iBlock.getUid())) {
                csiExportFunctionBlock(iBlock, oJSONBlock);
            }
            var nodeIdSelector = iBlock.getNodeIdSelector();
            oJSONBlock.implementation.nodeIdSelector = nodeIdSelector === Tools.parentNodeIdSelector ? '_' : nodeIdSelector;
        };
        var addTo = function (map, csiPath, schePath) {
            var element = map[csiPath];
            if (element !== undefined) {
                if (element.indexOf(schePath) === -1) {
                    element.push(schePath);
                }
            }
            else {
                map[csiPath] = [schePath];
            }
        };
        var isInstanceOfArray = function (iBlock) {
            return iBlock instanceof ArrayConcatBlock || iBlock instanceof ArrayGetBlock || iBlock instanceof ArrayGetIndexBlock || iBlock instanceof ArrayInsertBlock ||
                iBlock instanceof ArrayIteratorBlock || iBlock instanceof ArrayLengthBlock || iBlock instanceof ArrayPopBlock || iBlock instanceof ArrayPushBlock ||
                iBlock instanceof ArrayRemoveBlock || iBlock instanceof ArraySetBlock || iBlock instanceof ArrayShiftBlock || iBlock instanceof ArrayUnshiftBlock;
        };
        var isInstanceOfCalculator = function (iBlock) {
            return iBlock instanceof AddBlock || iBlock instanceof DivideBlock || iBlock instanceof IsEqualBlock ||
                iBlock instanceof MultiplyBlock || iBlock instanceof SetValueBlock || iBlock instanceof SubstractBlock;
        };
        var isArrayFilterGraphBlock = function (iBlock) {
            return iBlock instanceof ContainedGraphBlock && iBlock.container instanceof ArrayFilterBlock;
        };
        var removeSpaces = function (iString) {
            return iString.replace(/\s/g, '');
        };
        var firstLetterToLowerCase = function (iString) {
            return iString.charAt(0).toLowerCase() + iString.slice(1);
        };
        var controlPortToCSIPath = function (iControlPort) {
            var csiPath = blockToCSIPath(iControlPort.block);
            var name = iControlPort.getName();
            var csiName = firstLetterToLowerCase(removeSpaces(name));
            if (iControlPort.block instanceof SyncFlowsBlock || iControlPort.block instanceof JoinAllBlock ||
                iControlPort.block instanceof OnlyOneBlock || iControlPort.block instanceof IfBlock ||
                isArrayFilterGraphBlock(iControlPort.block) ||
                isInstanceOfCalculator(iControlPort.block) || isInstanceOfArray(iControlPort.block)) {
                if (iControlPort.getType() === Enums.EControlPortType.eInput) {
                    csiName = 'call.' + csiName;
                }
                if (iControlPort.getType() === Enums.EControlPortType.eOutput) {
                    csiName = 'success.' + csiName;
                }
            }
            else if (name === 'In') {
                csiName = 'call';
            }
            csiPath += '.' + csiName;
            addTo(CSIExport.mapCSItoSchematics, csiPath, iControlPort.toPath());
            return csiPath;
        };
        var dataPortToCSIName = function (iDataPort) {
            var name = iDataPort.getName();
            var csiName;
            if (iDataPort.dataPort === undefined) {
                var block = iDataPort.block;
                if (iDataPort.getType() === Enums.EDataPortType.eLocal) {
                    csiName = 'localData.' + name;
                }
                else if (iDataPort.getType() !== Enums.EDataPortType.eInputExternal && (block instanceof GraphContainerBlock
                    || block instanceof ContainedGraphBlock
                    || block instanceof IfBlock
                    || block instanceof OnlyOneBlock
                    || isInstanceOfCalculator(block)
                    || isInstanceOfArray(block))) {
                    var lowerCaseName = firstLetterToLowerCase(name);
                    if (iDataPort.getType() === Enums.EDataPortType.eInput) {
                        csiName = 'call.' + lowerCaseName;
                    }
                    else if (iDataPort.getType() === Enums.EDataPortType.eOutput
                        && (block instanceof OnlyOneBlock
                            || (block instanceof ArrayFilterBlock && (name === 'State' || name === 'ArrayOut'))
                            || (block instanceof ArrayMapBlock && name === 'State')
                            || isArrayFilterGraphBlock(block)
                            || isInstanceOfCalculator(block)
                            || isInstanceOfArray(block))) {
                        csiName = 'success.' + lowerCaseName;
                    }
                    else {
                        csiName = lowerCaseName + '.' + lowerCaseName;
                    }
                }
                else {
                    csiName = firstLetterToLowerCase(name);
                }
            }
            else {
                csiName = dataPortToCSIName(iDataPort.dataPort) + '.' + name;
            }
            return csiName;
        };
        var dataPortToCSIPath = function (iDataPort) {
            var csiPath = blockToCSIPath(iDataPort.block) + '.' + dataPortToCSIName(iDataPort);
            return csiPath;
        };
        var blockToCSIPath = function (iBlock) {
            var csiPath = iBlock.toPath();
            csiPath = csiPath.replace(Tools.rootPath + '.', '');
            csiPath = csiPath.replace(/\.containedGraph/g, '');
            csiPath = csiPath.replace(/\./g, '/');
            return csiPath;
        };
        var csiExportControlLink = function (iControlLink, oJSONControlLink) {
            oJSONControlLink.from = controlPortToCSIPath(iControlLink.getStartPort());
            oJSONControlLink.to = controlPortToCSIPath(iControlLink.getEndPort());
            addTo(CSIExport.mapSchematicsLinks, oJSONControlLink.from, iControlLink.toPath());
        };
        var csiExportDataLink = function (iDataLink, oJSONDataLink) {
            oJSONDataLink.from = dataPortToCSIPath(iDataLink.getStartPort());
            oJSONDataLink.to = dataPortToCSIPath(iDataLink.getEndPort());
        };
    })(CSIExport || (CSIExport = {}));
    return CSIExport;
});
