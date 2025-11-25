/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTools'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTools", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS"], function (require, exports, ModelEnums, Tools, TypeLibrary, UITools, UINLS) {
    "use strict";
    /**
     * This class defines the UI data grid view tools.
     * @private
     * @class UIDGVTools
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTools
     */
    class UIDGVTools {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //             ____  _____ _____ _   _   _ _   _____  __     ___    _    _   _ _____              //
        //            |  _ \| ____|  ___/ \ | | | | | |_   _| \ \   / / \  | |  | | | | ____|             //
        //            | | | |  _| | |_ / _ \| | | | |   | |    \ \ / / _ \ | |  | | | |  _|               //
        //            | |_| | |___|  _/ ___ \ |_| | |___| |     \ V / ___ \| |__| |_| | |___              //
        //            |____/|_____|_|/_/   \_\___/|_____|_|      \_/_/   \_\_____\___/|_____|             //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the data item default value cell semantics.
         * @public
         * @static
         * @param {UIEditor} editor - The UI editor.
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {string} [valueTypeDataIndex='valueType'] - The value type data index.
         * @param {string} [defaultValueDataIndex='defaultValue'] - The default value data index.
         * @returns {Object} - The default value cell semantics.
         */
        static getDataItemDefaultValueCellSemantics(editor, cellInfos, valueTypeDataIndex = 'valueType', defaultValueDataIndex = 'defaultValue') {
            let result = {};
            if (cellInfos?.nodeModel) {
                const graphContext = editor.getViewerController().getRootViewer().getMainGraph().getModel().getGraphContext();
                const valueType = cellInfos.nodeModel.getAttributeValue(valueTypeDataIndex);
                if (this.isAnyObjectType(graphContext, valueType)) {
                    const name = cellInfos.nodeModel.getLabel();
                    const defaultValue = cellInfos.nodeModel.getAttributeValue(defaultValueDataIndex);
                    result = {
                        editor: editor,
                        objectName: name,
                        valueType: valueType,
                        value: defaultValue
                    };
                }
            }
            return result;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                    _____ ___   ___  _     ____                                 //
        //                                   |_   _/ _ \ / _ \| |   / ___|                                //
        //                                     | || | | | | | | |   \___ \                                //
        //                                     | || |_| | |_| | |___ ___) |                               //
        //                                     |_| \___/ \___/|_____|____/                                //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Check if the data port is a read only root input data port.
         * This is a CSI specific implementation!
         * @public
         * @static
         * @param {UIEditor} editor - The UI editor.
         * @param {DataPort} dataPort - The data port model.
         * @returns {boolean} True if the data port is a read only root else false.
         */
        static isReadOnlyRoot(editor, dataPort) {
            const isRootInput = dataPort?.block.toPath() === Tools.rootPath && (dataPort.getType() === ModelEnums.EDataPortType.eInput && dataPort.getType() === ModelEnums.EDataPortType.eInputExternal);
            return !editor?.getOptions().rootInputDataDefaultValueSettable && isRootInput;
        }
        /**
         * Checks if the given value type is an any object type.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is an any object type, false otherwise.
         */
        static isAnyObjectType(graphContext, valueType) {
            return this.isGenericObjectType(valueType) || this.isTypedObjectType(graphContext, valueType) ||
                this.isArrayType(graphContext, valueType) || this.isClassType(graphContext, valueType) ||
                this.isEventType(graphContext, valueType);
        }
        /**
         * Checks if the given value type is a generic object type.
         * @public
         * @static
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is a generic object type, false otherwise.
         */
        static isGenericObjectType(valueType) {
            return valueType === 'Object';
        }
        /**
         * Checks if the given value type is a typed object type.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is a typed object type, false otherwise.
         */
        static isTypedObjectType(graphContext, valueType) {
            return TypeLibrary.hasType(graphContext, valueType, ModelEnums.FTypeCategory.fObject);
        }
        /**
         * Checks if the given value type is an array type.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is an array type, false otherwise.
         */
        static isArrayType(graphContext, valueType) {
            return this.isGenericArrayType(valueType) || this.isTypedArrayType(graphContext, valueType);
        }
        /**
         * Checks if the given value type is a typed array type.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is a typed array type, false otherwise.
         */
        static isTypedArrayType(graphContext, valueType) {
            return TypeLibrary.hasType(graphContext, valueType, ModelEnums.FTypeCategory.fArray);
        }
        /**
         * Checks if the given value type is a generic array type.
         * @public
         * @static
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is a generic array type, false otherwise.
         */
        static isGenericArrayType(valueType) {
            return valueType === 'Array';
        }
        /**
         * Checks if the given value type is a class type.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is a class type, false otherwise.
         */
        static isClassType(graphContext, valueType) {
            return TypeLibrary.hasType(graphContext, valueType, ModelEnums.FTypeCategory.fClass);
        }
        /**
         * Checks if the given value type is an event type.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is an event type, false otherwise.
         */
        static isEventType(graphContext, valueType) {
            return TypeLibrary.hasType(graphContext, valueType, ModelEnums.FTypeCategory.fEvent);
        }
        /**
         * Checks if the given value type is a base type.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is a base type, false otherwise.
         */
        static isBaseType(graphContext, valueType) {
            return TypeLibrary.hasType(graphContext, valueType, ModelEnums.FTypeCategory.fBase | ModelEnums.FTypeCategory.fNumerical);
        }
        /**
         * Checks if the given value type is an enum type.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if it is an enum type, false otherwise.
         */
        static isEnumType(graphContext, valueType) {
            return TypeLibrary.hasType(graphContext, valueType, ModelEnums.FTypeCategory.fEnum);
        }
        /**
         * Checks if the data port or setting value type is a class or event type.
         * @public
         * @static
         * @param {DataPort|Setting} dataItem - The data port or setting to check.
         * @returns {boolean} True if the data port value type is a class or event type else false.
         */
        static isClassOrEventType(dataItem) {
            const graphContext = dataItem.getGraphContext();
            const valueType = dataItem.getValueType();
            const typeCategory = ModelEnums.FTypeCategory.fClass | ModelEnums.FTypeCategory.fEvent;
            let result = TypeLibrary.hasType(graphContext, valueType, typeCategory);
            result = result || TypeLibrary.hasType(graphContext, TypeLibrary.getArrayValueTypeName(valueType), typeCategory);
            return result;
        }
        /**
         * Gets the tooltip infos from the data port type.
         * @private
         * @static
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         * @param {boolean} doCreate - True for create action, false for remove action.
         * @returns {IWUXTooltipModel} The tooltip infos.
         */
        static getTooltipInfosFromDataPortType(portType, doCreate) {
            const tooltipInfos = {};
            if (portType === ModelEnums.EDataPortType.eInput) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createInputDataPortTitle' : 'removeInputDataPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createInputDataPortShortHelp' : 'removeInputDataPortShortHelp');
            }
            else if (portType === ModelEnums.EDataPortType.eInputExternal) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createInputExternalDataPortTitle' : 'removeInputExternalDataPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createInputExternalDataPortShortHelp' : 'removeInputExternalDataPortShortHelp');
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createOutputDataPortTitle' : 'removeOutputDataPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createOutputDataPortShortHelp' : 'removeOutputDataPortShortHelp');
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createLocalDataPortTitle' : 'removeLocalDataPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createLocalDataPortShortHelp' : 'removeLocalDataPortShortHelp');
            }
            return tooltipInfos;
        }
        /**
         * Gets the tooltip infos from the control port type.
         * @private
         * @static
         * @param {ModelEnums.EControlPortType} portType - The control port type.
         * @param {boolean} doCreate - True for create action, false for remove action.
         * @returns {IWUXTooltipModel} The tooltip infos.
         */
        static getTooltipInfosFromControlPortType(portType, doCreate) {
            const tooltipInfos = {};
            if (portType === ModelEnums.EControlPortType.eInput) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createInputControlPortTitle' : 'removeInputControlPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createInputControlPortShortHelp' : 'removeInputControlPortShortHelp');
            }
            else if (portType === ModelEnums.EControlPortType.eOutput) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createOutputControlPortTitle' : 'removeOutputControlPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createOutputControlPortShortHelp' : 'removeOutputControlPortShortHelp');
            }
            else if (portType === ModelEnums.EControlPortType.eInputEvent) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createInputEventPortTitle' : 'removeInputEventPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createInputEventPortShortHelp' : 'removeInputEventPortShortHelp');
            }
            else if (portType === ModelEnums.EControlPortType.eOutputEvent) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createOutputEventPortTitle' : 'removeOutputEventPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createOutputEventPortShortHelp' : 'removeOutputEventPortShortHelp');
            }
            return tooltipInfos;
        }
        /**
         * Gets the tooltip infos from the setting.
         * @private
         * @static
         * @param {boolean} doCreate - True for create action, false for remove action.
         * @returns {IWUXTooltipModel} The tooltip infos.
         */
        static getTooltipInfosFromSetting(doCreate) {
            const tooltipInfos = {};
            tooltipInfos.title = UINLS.get(doCreate ? 'createSettingTitle' : 'removeSettingTitle');
            tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createSettingShortHelp' : 'removeSettingShortHelp');
            return tooltipInfos;
        }
        /**
         * Gets the value type name from the provided default value.
         * @public
         * @static
         * @param {any} defaultValue - The default value.
         * @returns {string} The value type name.
         */
        static getValueTypeNameFromDefaultValue(defaultValue) {
            let valueTypeName = '';
            if (defaultValue !== undefined) {
                if (typeof defaultValue === 'string') {
                    valueTypeName = 'String';
                }
                else if (typeof defaultValue === 'number') {
                    valueTypeName = 'Double';
                }
                else if (typeof defaultValue === 'boolean') {
                    valueTypeName = 'Boolean';
                }
                else if (typeof defaultValue === 'object') {
                    if (Array.isArray(defaultValue)) {
                        if (defaultValue.length === 0) {
                            valueTypeName = 'Array<Double>';
                        }
                        else {
                            // We don't want to support array of array (not compatible with CSI parameters)!
                            const subValueTypeName = this.getValueTypeNameFromDefaultValue(defaultValue[0]);
                            if (!subValueTypeName.startsWith('Array<')) {
                                valueTypeName = 'Array<' + subValueTypeName + '>';
                            }
                        }
                    }
                    else {
                        valueTypeName = 'Object';
                    }
                }
            }
            return valueTypeName;
        }
        /**
         * Gets the default value from the given value type.
         * @private
         * @static
         * @TODO: Mutualiser les default value des Objet avec le model!
         * @param {string} valueType - The value type.
         * @param {GraphBlock} graphContext - The graph context.
         * @returns {unknown} The default value.
         */
        static getDefaultValueFromValueType(valueType, graphContext) {
            let result = undefined;
            const typeCategory = TypeLibrary.getTypeCategory(graphContext, valueType);
            if (valueType === 'String') {
                result = String();
            }
            else if (valueType === 'Boolean') {
                result = Boolean();
            }
            else if (valueType === 'Object') {
                result = {};
            }
            else if (valueType === 'Buffer') {
                result = new ArrayBuffer(0);
            }
            else if (valueType === 'Array' || UITools.hasEnumFlag(typeCategory, ModelEnums.FTypeCategory.fArray)) {
                result = [];
            }
            else if (UITools.hasEnumFlag(typeCategory, ModelEnums.FTypeCategory.fNumerical)) {
                if (TypeLibrary.isValueType(graphContext, valueType, BigInt(0))) {
                    result = BigInt(0);
                }
                else {
                    result = Number();
                }
            }
            else if (UITools.hasEnumFlag(typeCategory, ModelEnums.FTypeCategory.fObject) ||
                UITools.hasEnumFlag(typeCategory, ModelEnums.FTypeCategory.fClass) ||
                UITools.hasEnumFlag(typeCategory, ModelEnums.FTypeCategory.fEvent)) {
                result = TypeLibrary.getDefaultValue(graphContext, valueType);
            }
            return result;
        }
    }
    return UIDGVTools;
});
