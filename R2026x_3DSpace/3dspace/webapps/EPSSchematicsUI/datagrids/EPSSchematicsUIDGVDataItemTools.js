/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataItemTools'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataItemTools", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTools", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPort", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPort", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsSetting"], function (require, exports, ModelEnums, TypeLibrary, WUXTreeNodeModel, UIDGVTools, UITools, UINLS, ControlPort, EventPort, DataPort, Setting) {
    "use strict";
    /**
     * This class defines the UI data grid view data item tools.
     * @private
     * @class UIDGVDataItemTools
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataItemTools
     */
    class UIDGVDataItemTools {
        static { this._regExpAlphanumeric = new RegExp(/^[a-z0-9_]+$/i); }
        static { this._objectPossibleValues = ['Boolean', 'Double', 'String', 'Object', 'Array<Boolean>', 'Array<Double>', 'Array<String>', 'Array<Object>']; }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                    _   _    _    __  __ _____                                  //
        //                                   | \ | |  / \  |  \/  | ____|                                 //
        //                                   |  \| | / _ \ | |\/| |  _|                                   //
        //                                   | |\  |/ ___ \| |  | | |___                                  //
        //                                   |_| \_/_/   \_\_|  |_|_____|                                 //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // #region Name
        /**
         * Gets the model item cell class name.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @returns {string} The data port default value cell class name.
         */
        static getModelItemCellClassName(cellInfos, dataIndex) {
            let result = '';
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (isSection) {
                    result = 'sch-dgv-node-root';
                    const children = nodeModel.getChildren();
                    if (!children || children.length === 0) {
                        result += ' sch-dgv-node-empty';
                    }
                }
                else if (dataIndex === 'dataPort') {
                    const parentNodeModel = this.getParentDataPortNodeModel(nodeModel);
                    if (parentNodeModel) {
                        const dataPort = parentNodeModel.getAttributeValue('dataPort');
                        const editor = parentNodeModel.getAttributeValue('editor');
                        if (dataPort && editor && UITools.isDataPortDebuggable(editor, dataPort)) {
                            const isSubDataPort = dataPort.dataPort !== undefined;
                            const parentDataPortModel = isSubDataPort ? dataPort.dataPort : dataPort;
                            const traceController = editor.getTraceController();
                            const events = traceController.getEventByDataPortPath(parentDataPortModel.toPath());
                            if (events.length > 0) {
                                const fromDebug = parentNodeModel.getAttributeValue('fromDebug');
                                const event = events[events.length - 1];
                                result = (event.fromDebug || fromDebug) ? 'sch-dgv-debug-value' : 'sch-dgv-play-value';
                            }
                        }
                    }
                }
            }
            return result;
        }
        /**
         * Gets the model item name cell editable state.
         * TODO: This method is not specific to data item but to model item => move it into DGVTools!
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @param {boolean} readOnly - True if read only, false otherwise.
         * @returns {boolean} - The model item name cell editable state.
         */
        static getModelItemNameCellEditableState(cellInfos, dataIndex, readOnly) {
            let result = false;
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel && !readOnly) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (!isSection) {
                    const modelItem = nodeModel.getAttributeValue(dataIndex);
                    if (modelItem) {
                        const editor = nodeModel.getAttributeValue('editor');
                        result = modelItem.isNameSettable() && !editor.getTraceController().getPlayingState();
                    }
                    else { // We assume we are on an object/array property
                        const valueType = nodeModel.getParent().getAttributeValue('valueType');
                        result = UIDGVTools.isGenericObjectType(valueType);
                    }
                }
            }
            return result;
        }
        /**
         * Sets the model item name cell value.
         * TODO: This method is not specific to data item but to model item => move it into DGVTools!
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {string} name - The name.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         */
        static setModelItemNameCellValue(cellInfos, name, dataIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (!isSection) {
                    const modelItem = nodeModel.getAttributeValue(dataIndex);
                    if (modelItem) {
                        const previousName = nodeModel.getLabel();
                        const result = modelItem.setName(name);
                        const newName = result ? name : previousName;
                        nodeModel.setLabel(newName);
                    }
                    else { // We assume we are on an object/array property
                        const previousName = nodeModel.getLabel();
                        const newName = this._regExpAlphanumeric.test(name) ? name : previousName;
                        if (newName !== previousName) {
                            const defaultValue = nodeModel.getParent().getAttributeValue('defaultValue');
                            const isNameFree = !Object.keys(defaultValue).includes(newName);
                            if (isNameFree) {
                                defaultValue[newName] = defaultValue[previousName]; // Update the objet structure
                                delete defaultValue[previousName];
                            }
                            nodeModel.setLabel(isNameFree ? newName : previousName); // Update the displayed name
                            if (isNameFree) {
                                this._updateValueAndPropagateToParent(nodeModel, dataIndex, defaultValue[newName], 'defaultValue'); // Refresh the parents
                            }
                        }
                    }
                }
            }
        }
        // #endregion
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                __     ___    _    _   _ _____   _______   ______  _____                        //
        //                \ \   / / \  | |  | | | | ____| |_   _\ \ / /  _ \| ____|                       //
        //                 \ \ / / _ \ | |  | | | |  _|     | |  \ V /| |_) |  _|                         //
        //                  \ V / ___ \| |__| |_| | |___    | |   | | |  __/| |___                        //
        //                   \_/_/   \_\_____\___/|_____|   |_|   |_| |_|   |_____|                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // #region Value Type
        /**
         * Gets the model item value type cell semantics.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @returns {Object} The model item value type cell semantics.
         */
        static getModelItemValueTypeSemantics(cellInfos, dataIndex) {
            let result = {};
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (!isSection) {
                    const modelItem = nodeModel.getAttributeValue(dataIndex);
                    if (modelItem) {
                        result = this._getValueTypeSemanticsForModelItem(nodeModel, modelItem);
                    }
                    else {
                        result = this._getValueTypeSemanticsForObjectItem(nodeModel, dataIndex);
                    }
                }
            }
            return result;
        }
        /**
         * Gets the data item value type cell semantics.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {DataPort|Setting|ControlPort} dataItem - The data port or setting.
         * @returns {Object} The data item value type cell semantics.
         */
        static _getValueTypeSemanticsForModelItem(nodeModel, dataItem) {
            let result = {};
            if (nodeModel && dataItem) {
                const isEventPort = dataItem instanceof EventPort;
                const isDataPort = dataItem instanceof DataPort;
                const isSetting = dataItem instanceof Setting;
                if (isDataPort || isSetting || isEventPort) {
                    const isSettable = isEventPort ? dataItem.isEventTypeSettable() : dataItem.isValueTypeSettable();
                    if (isSettable) {
                        const editor = nodeModel.getAttributeValue('editor');
                        const possibleValues = isEventPort ? dataItem.getAllowedEventTypes() : dataItem.getAllowedValueTypes();
                        const hasCreateTypeButton = UITools.hasEnumFlag(dataItem.typeCategory, ModelEnums.FTypeCategory.fObject);
                        const graphContext = dataItem.getGraphContext();
                        const valueType = nodeModel.getAttributeValue('valueType'); // EventType creation are not handled here for now!
                        const typeCategory = ModelEnums.FTypeCategory.fAll ^ ModelEnums.FTypeCategory.fArray;
                        const isLocalType = graphContext ? TypeLibrary.hasLocalCustomType(graphContext, valueType, typeCategory) : false;
                        result = {
                            editor: editor,
                            dataPort: isDataPort ? dataItem : undefined,
                            possibleValues: possibleValues,
                            showCreateUserTypeButton: hasCreateTypeButton,
                            showTypeLibraryButton: isLocalType
                        };
                    }
                }
            }
            return result;
        }
        /**
         * Gets the object item value type cell semantics.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @returns {Object} The object item value type cell semantics.
         */
        static _getValueTypeSemanticsForObjectItem(nodeModel, dataIndex) {
            let result = {};
            if (nodeModel) {
                const parentNodeModel = nodeModel.getParent();
                const parentValueType = parentNodeModel.getAttributeValue('valueType');
                const isParentGenericArrayValueType = UIDGVTools.isGenericArrayType(parentValueType);
                const isObjectTypeInHierarchy = this._isObjectTypeInHierarchy(nodeModel, dataIndex);
                if (isParentGenericArrayValueType || isObjectTypeInHierarchy) {
                    const editor = nodeModel.getAttributeValue('editor');
                    result = {
                        editor: editor,
                        dataPort: undefined,
                        possibleValues: UIDGVDataItemTools._objectPossibleValues,
                        showCreateUserTypeButton: false,
                        showTypeLibraryButton: false
                    };
                }
            }
            return result;
        }
        /**
         * Sets the model item value type cell value.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {string} newValueType - The new value type.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index index.
         */
        static setModelItemValueTypeCellValue(cellInfos, newValueType, dataIndex, valueIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const modelItem = nodeModel.getAttributeValue(dataIndex);
                if (modelItem) {
                    const isDataItem = modelItem instanceof DataPort || modelItem instanceof Setting;
                    const isEventPort = modelItem instanceof EventPort;
                    if (isDataItem) {
                        this._setValueTypeCellValueForDataItem(nodeModel, newValueType, modelItem);
                    }
                    else if (isEventPort) {
                        this._setEventTypeCellValueForEventPort(nodeModel, newValueType, modelItem);
                    }
                }
                else {
                    this._setValueTypeCellValueForObjectItem(nodeModel, newValueType, dataIndex, valueIndex);
                }
            }
        }
        /**
         * Sets the event port event type cell value.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {string} newEventType - The new event type.
         * @param {EventPort} eventPort - The event port.
         */
        static _setEventTypeCellValueForEventPort(nodeModel, newEventType, eventPort) {
            if (nodeModel && eventPort && eventPort.isEventTypeSettable()) {
                const previousEventType = nodeModel.getAttributeValue('eventType');
                const result = eventPort.setEventType(newEventType);
                if (result) {
                    const eventType = result ? newEventType : previousEventType;
                    nodeModel.updateOptions({ grid: { eventType: eventType } });
                    nodeModel.removeChildren();
                }
            }
        }
        /**
         * Sets the data item value type cell value.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {string} newValueType - The new value type.
         * @param {DataPort|Setting|ControlPort} dataItem - The data port or setting.
         */
        static _setValueTypeCellValueForDataItem(nodeModel, newValueType, dataItem) {
            if (nodeModel && dataItem && dataItem.isValueTypeSettable()) {
                const previousValueType = nodeModel.getAttributeValue('valueType');
                const result = dataItem.setValueType(newValueType);
                if (result) {
                    const valueType = result ? newValueType : previousValueType;
                    nodeModel.updateOptions({ grid: { valueType: valueType } });
                    nodeModel.removeChildren();
                    // Update expander display
                    const graphContext = nodeModel.getAttributeValue('graphContext');
                    const defaultValue = nodeModel.getAttributeValue('defaultValue');
                    const canExpand = this.canExpand(graphContext, valueType, defaultValue);
                    nodeModel.setHasAsyncChildren(canExpand);
                }
            }
        }
        /**
         * Sets the object item value type cell value.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {string} newValueType - The new value type.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index index.
         */
        static _setValueTypeCellValueForObjectItem(nodeModel, newValueType, dataIndex, valueIndex) {
            if (nodeModel) {
                const previousValueType = nodeModel.getAttributeValue('valueType');
                if (newValueType !== previousValueType) {
                    const graphContext = nodeModel.getAttributeValue('graphContext');
                    const parentDefaultValue = nodeModel.getParent().getAttributeValue(valueIndex);
                    const newDefaultValue = UIDGVTools.getDefaultValueFromValueType(newValueType, graphContext);
                    parentDefaultValue[nodeModel.getLabel()] = newDefaultValue;
                    nodeModel.setAttribute('valueType', newValueType); // Update the displayed value type
                    nodeModel.setAttribute(valueIndex, newDefaultValue);
                    if (nodeModel.hasChildren()) {
                        nodeModel.removeChildren(); // Remove children if the type has changed
                    }
                    this._updateValueAndPropagateToParent(nodeModel, dataIndex, newDefaultValue, valueIndex); // Refresh the parents
                }
            }
        }
        /**
         * Gets the model item value type cell editable state.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @param {boolean} readOnly - True if read only, false otherwise.
         * @param {boolean} isTestDataPort - True if it is a test data port.
         * @returns {boolean} The model item value type cell editable state.
         */
        static getModelItemValueTypeCellEditableState(cellInfos, dataIndex, readOnly, isTestDataPort) {
            let result = false;
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel && !readOnly) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (!isSection) {
                    const dataItem = nodeModel.getAttributeValue(dataIndex);
                    if (dataItem) {
                        if (!isTestDataPort) {
                            const isDataPort = dataItem instanceof DataPort;
                            const isSetting = dataItem instanceof Setting;
                            const isEventPort = dataItem instanceof EventPort;
                            if (isDataPort || isSetting || isEventPort) {
                                const isEditable = isEventPort ? dataItem.isEventTypeSettable() : dataItem.isValueTypeSettable();
                                const editor = nodeModel.getAttributeValue('editor');
                                result = isEditable && !editor.getTraceController().getPlayingState();
                            }
                        }
                    }
                    else { // We assume we are on an object/array property
                        const parentNodeModel = nodeModel.getParent();
                        const parentValueType = parentNodeModel.getAttributeValue('valueType');
                        const graphContext = nodeModel.getAttributeValue('graphContext');
                        const isParentArrayValueType = UIDGVTools.isArrayType(graphContext, parentValueType);
                        const isParentGenericArrayValueType = UIDGVTools.isGenericArrayType(parentValueType);
                        result = (!isParentArrayValueType && this._isObjectTypeInHierarchy(nodeModel, dataIndex) || isParentGenericArrayValueType);
                    }
                }
            }
            return result;
        }
        // #endregion
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //             ____  _____ _____ _   _   _ _   _____  __     ___    _    _   _ _____              //
        //            |  _ \| ____|  ___/ \ | | | | | |_   _| \ \   / / \  | |  | | | | ____|             //
        //            | | | |  _| | |_ / _ \| | | | |   | |    \ \ / / _ \ | |  | | | |  _|               //
        //            | |_| | |___|  _/ ___ \ |_| | |___| |     \ V / ___ \| |__| |_| | |___              //
        //            |____/|_____|_|/_/   \_\___/|_____|_|      \_/_/   \_\_____\___/|_____|             //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // #region Default Value
        /**
         * Gets the data item default value cell editable state.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex| undefined} valueIndex - The column value data index index.
         * @param {boolean} readOnly - True if read only, false otherwise.
         * @returns {boolean} - The data item default value cell editable state.
         */
        static getDataItemDefaultValueCellEditableState(cellInfos, dataIndex, valueIndex, readOnly) {
            let result = false;
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel && !readOnly) {
                const isSection = nodeModel.getAttributeValue('isSection');
                const editor = nodeModel.getAttributeValue('editor');
                if (!isSection && editor) {
                    const dataItem = nodeModel.getAttributeValue(dataIndex);
                    if (dataItem) {
                        result = this._isDataItemDefaultValueEditable(dataItem, editor, valueIndex);
                    }
                    else {
                        result = this._isObjectItemDefaultValueEditable(nodeModel, dataIndex, valueIndex);
                    }
                }
            }
            return result;
        }
        /**
         * Checks whether the data item default value is editable.
         * @private
         * @static
         * @param {DataPort|Setting} dataItem - The data item.
         * @param {UIEditor} editor - The UI editor.
         * @param {TValueDataIndex|undefined} valueIndex - The column value data index index.
         * @returns {boolean} True if the data item default value is editable else false.
         */
        static _isDataItemDefaultValueEditable(dataItem, editor, valueIndex) {
            let result = false;
            if (dataItem && dataItem.block) {
                const isSetting = dataItem instanceof Setting;
                const isDataPort = dataItem instanceof DataPort;
                const isTestValue = valueIndex === 'testValue';
                const isPlaying = editor.getTraceController().getPlayingState();
                const isOutputDataPort = isDataPort && dataItem.getType() === ModelEnums.EDataPortType.eOutput;
                const isLocalDataPort = isDataPort && dataItem.getType() === ModelEnums.EDataPortType.eLocal;
                const valueType = dataItem.getValueType();
                const graphContext = dataItem.block.getGraphContext();
                result = isTestValue || !isOutputDataPort;
                result = result && (isTestValue || isSetting || isLocalDataPort || !UIDGVTools.isReadOnlyRoot(editor, dataItem)); // Check only for data port is not root (CSI specific restriction)!
                result = result && (isSetting ? dataItem.isValueSettable() : (isTestValue ? dataItem.isTestValuesSettable() : dataItem.isDefaultValueSettable()));
                result = result && (!isPlaying || (!isSetting && UITools.isDataPortDebuggable(editor, dataItem)));
                //result = result && (valueType !== 'Buffer' && valueType !== 'Array<Buffer>');
                result = result && !this._isEmptyLocalCustomType(graphContext, valueType);
            }
            return result;
        }
        /**
         * Checks whether the object item default value is editable.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex|undefined} valueIndex - The column value data index index.
         * @returns {boolean} True if the object item default value is editable else false.
         */
        static _isObjectItemDefaultValueEditable(nodeModel, dataIndex, valueIndex) {
            let result = false;
            if (nodeModel) {
                //const isRoot = nodeModel.isRoot();
                const isTestValue = valueIndex === 'testValue';
                const valueType = nodeModel.getAttributeValue('valueType');
                const editor = nodeModel.getAttributeValue('editor');
                const isOutputDataPort = this._hasOutputDataPortInHierarchy(nodeModel);
                //const isGenericObjectType = UIDGVTools.isGenericObjectType(valueType);
                //const isGenericArrayType = UIDGVTools.isGenericArrayType(valueType);
                const graphContext = editor._getViewer().getMainGraph().getModel().getGraphContext();
                const isAnyObjectType = UIDGVTools.isAnyObjectType(graphContext, valueType);
                const isBaseOrEnumFlags = TypeLibrary.hasType(graphContext, valueType, ModelEnums.FTypeCategory.fBase |
                    ModelEnums.FTypeCategory.fNumerical | ModelEnums.FTypeCategory.fEnum);
                const rootDataItem = this._getRootDataItem(nodeModel, dataIndex);
                const isRootDataItemEditable = !rootDataItem || (rootDataItem && this._isDataItemDefaultValueEditable(rootDataItem, editor, valueIndex));
                //result = !isRoot && !isOutputDataPort && isRootDataItemEditable && !isGenericObjectType && !isGenericArrayType && isBaseOrEnumFlags;
                result = isTestValue || !isOutputDataPort;
                result = result && isRootDataItemEditable && (isAnyObjectType || isBaseOrEnumFlags);
            }
            return result;
        }
        /**
         * Gets the root data item.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @returns {DataPort|Setting|undefined} The root data item.
         */
        static _getRootDataItem(nodeModel, dataIndex) {
            let result;
            if (nodeModel) {
                result = nodeModel.getAttributeValue(dataIndex);
                result = result || this._getRootDataItem(nodeModel.getParent(), dataIndex);
            }
            return result;
        }
        /**
         * Gets the data item default value cell semantics.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {UIEditor} editor - The UI editor.
         * @param {TValueDataIndex} valueIndex - The column value data index index.
         * @returns {Object} - The default value cell semantics.
         */
        static getDataItemDefaultValueCellSemantics(cellInfos, editor, valueIndex) {
            let result = {};
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const graphContext = editor.getViewerController().getRootViewer().getMainGraph().getModel().getGraphContext();
                const valueType = nodeModel.getAttributeValue('valueType');
                if (UIDGVTools.isAnyObjectType(graphContext, valueType)) {
                    const name = nodeModel.getLabel();
                    const defaultValue = nodeModel.getAttributeValue(valueIndex);
                    result = {
                        editor: editor,
                        graphContext: graphContext,
                        objectName: name,
                        valueType: valueType,
                        value: defaultValue
                    };
                }
            }
            return result;
        }
        /**
         * Gets the data item default value cell type representation.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @returns {string} - The data item default value cell type representation.
         */
        static getDataItemDefaultValueCellTypeRepresentation(cellInfos, dataIndex) {
            let result = 'string';
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const valueType = nodeModel.getAttributeValue('valueType');
                let hasDataIndex = dataIndex !== undefined; // Only useful if using ObjectEditor tweaker!
                hasDataIndex = false; // We force the display of JSON Tweaker for Object!
                const graphContext = nodeModel.getAttributeValue('graphContext');
                const isGenericObjectType = UIDGVTools.isGenericObjectType(valueType);
                const isGenericArrayType = UIDGVTools.isGenericArrayType(valueType);
                const isAnyObjectType = UIDGVTools.isAnyObjectType(graphContext, valueType);
                const baseAndEnumFlags = ModelEnums.FTypeCategory.fBase | ModelEnums.FTypeCategory.fNumerical | ModelEnums.FTypeCategory.fEnum;
                const isBaseType = !isGenericObjectType && !isGenericArrayType && TypeLibrary.hasType(graphContext, valueType, baseAndEnumFlags);
                result = hasDataIndex || isBaseType ? valueType : isAnyObjectType ? 'JSONString' : result;
            }
            return result;
        }
        /**
         * Gets the data item default value cell value.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data item data index.
         * @param {TValueDataIndex} valueIndex - The column value data index index.
         * @returns {*} The data item default value cell value.
         */
        static getDataItemDefaultValueCellValue(cellInfos, dataIndex, valueIndex) {
            let result = undefined;
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (!isSection) {
                    const dataItem = nodeModel.getAttributeValue(dataIndex);
                    if (dataItem) {
                        const isDataPort = dataItem instanceof DataPort;
                        const isTestValue = valueIndex === 'testValue';
                        const testValue = nodeModel.getAttributeValue('testValue');
                        const defaultValue = isDataPort ? (isTestValue ? testValue : dataItem.getDefaultValue()) : dataItem.getValue();
                        const valueType = nodeModel.getAttributeValue('valueType');
                        const graphContext = nodeModel.getAttributeValue('graphContext');
                        const isDefaultValueValid = TypeLibrary.isValueType(dataItem.getGraphContext(), valueType, defaultValue);
                        const isClassType = UIDGVTools.isClassType(graphContext, valueType);
                        const isEventType = UIDGVTools.isEventType(graphContext, valueType);
                        const isClassOrEventType = isClassType || isEventType;
                        const isEmptyClassOrEventType = isClassOrEventType && this._isEmptyCustomType(graphContext, valueType);
                        result = isDefaultValueValid && (!isClassOrEventType || !isEmptyClassOrEventType) ? defaultValue : undefined;
                        // Display the data port play value
                        let [playResult, playValue] = this._getDataPortPlayValue(nodeModel);
                        result = playResult ? playValue : result;
                    }
                    else { // We assume we are on an object/array property
                        //const valueType = nodeModel.getAttributeValue('valueType') as string;
                        const defaultValue = nodeModel.getAttributeValue(valueIndex);
                        //const isString = typeof defaultValue === 'string';
                        //const graphContext = nodeModel.getAttributeValue('graphContext') as GraphBlock;
                        //const isEnumType = UIDGVTools.isEnumType(graphContext, valueType);
                        //const isBigInt = typeof defaultValue === 'bigint';
                        //const keepDefaultValue = valueType === 'String' || isString || isEnumType || isBigInt;
                        //result = keepDefaultValue ? defaultValue : UITools.safeJSONStringify(defaultValue);
                        result = defaultValue;
                    }
                }
            }
            return result;
        }
        /**
         * Sets the data item default value cell value.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data item data index.
         * @param {*} newValue - The data item new default value (data port), value (setting) or test value (test data port).
         * @param {TValueDataIndex} valueIndex - The column value data index.
         * @param {boolean} [doCollapse=false] - Only usefull when using object editor tweaker to edit value. The value returned by the tweaker must collapse the hierarchy so child node be refreshed!
         * @returns {boolean} True if the value has been set, false otherwise.
         */
        static setDataItemDefaultValueCellValue(cellInfos, dataIndex, newValue, valueIndex, doCollapse = false) {
            let result = false;
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (!isSection) {
                    if (doCollapse) {
                        nodeModel.collapse();
                    }
                    const dataItem = nodeModel.getAttributeValue(dataIndex);
                    if (dataItem) {
                        const isDataPort = dataItem instanceof DataPort;
                        const isTestValue = valueIndex === 'testValue';
                        const isValueSettable = isDataPort ? (isTestValue ? dataItem.isTestValuesSettable() : dataItem.isDefaultValueSettable()) : dataItem.isValueSettable();
                        if (isValueSettable) {
                            const previousValue = nodeModel.getAttributeValue(valueIndex);
                            const editor = nodeModel.getAttributeValue('editor');
                            if (UIDGVTools.isClassOrEventType(dataItem)) {
                                const valueType = dataItem.getValueType();
                                newValue = editor.getTypesCatalog().createClassTypeInstance(valueType, newValue);
                            }
                            // Build the parent data port debug value if debugging a sub data port!
                            if (isDataPort) {
                                const parentDataPort = dataItem.dataPort;
                                const isSubDataPort = parentDataPort !== undefined;
                                const isDebuggable = UITools.isDataPortDebuggable(editor, dataItem);
                                if (isSubDataPort && isDebuggable) {
                                    const traceController = editor.getTraceController();
                                    const traceEvents = traceController.getEventByDataPortPath(parentDataPort.toPath());
                                    if (traceEvents.length > 0) {
                                        const traceEvent = traceEvents[traceEvents.length - 1];
                                        const parentValue = traceEvent.getValue();
                                        parentValue[dataItem.getName()] = newValue;
                                        parentDataPort.setDefaultValue(parentValue);
                                    }
                                }
                            }
                            const setResult = isDataPort ? (isTestValue ? true : dataItem.setDefaultValue(newValue)) : dataItem.setValue(newValue);
                            if (setResult) {
                                const value = setResult ? newValue : previousValue;
                                const fromDebug = editor.getTraceController().getPlayingState();
                                const graphContext = nodeModel.getAttributeValue('graphContext');
                                const valueType = nodeModel.getAttributeValue('valueType');
                                const canExpand = this.canExpand(graphContext, valueType, value);
                                nodeModel.updateOptions({
                                    grid: {
                                        fromDebug: fromDebug,
                                        ...{ [valueIndex]: value }
                                    }
                                });
                                nodeModel.setHasAsyncChildren(canExpand);
                                result = true;
                            }
                        }
                    }
                    else { // We assume we are on an object/array property
                        const previousValue = nodeModel.getAttributeValue(valueIndex);
                        if (newValue !== previousValue) {
                            result = this._updateValueAndPropagateToParent(nodeModel, dataIndex, newValue, valueIndex);
                        }
                    }
                }
            }
            return result;
        }
        // #endregion
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                               _    ____ _____ ___ ___  _   _ ____                              //
        //                              / \  / ___|_   _|_ _/ _ \| \ | / ___|                             //
        //                             / _ \| |     | |  | | | | |  \| \___ \                             //
        //                            / ___ \ |___  | |  | | |_| | |\  |___) |                            //
        //                           /_/   \_\____| |_| |___\___/|_| \_|____/                             //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // #region Actions
        /**
         * Gets the model item section actions cell semantics.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @param {boolean} readOnly - True if read only mode is activated, false otherwise.
         * @returns {IActionsTweakerSemantics} The data item section actions cell semantics.
         */
        static getModelItemSectionActionsCellSemantics(cellInfos, dataIndex, readOnly) {
            let result = {};
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel && !readOnly) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (isSection) {
                    result = this._getSectionActionsCellSemanticsForSection(cellInfos, dataIndex);
                }
                else {
                    const modelItem = nodeModel.getAttributeValue(dataIndex);
                    if (modelItem) {
                        result = this._getSectionActionsCellSemanticsForModelItem(cellInfos, modelItem);
                    }
                }
            }
            return result;
        }
        /**
         * Gets the section actions cell semantics of the section.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @returns {IActionsTweakerSemantics} The section actions cell semantics of the section.
         */
        static _getSectionActionsCellSemanticsForSection(cellInfos, dataIndex) {
            let result = {};
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const block = nodeModel.getAttributeValue('block');
                const isDataPort = dataIndex === 'dataPort';
                const isControlPort = dataIndex === 'controlPort';
                const isSetting = dataIndex === 'setting';
                let displayAddButton = false;
                let tooltipInfos = {};
                if (isDataPort) {
                    const portType = nodeModel.getAttributeValue('portType');
                    displayAddButton = block.isDataPortTypeAddable(portType);
                    tooltipInfos = UIDGVTools.getTooltipInfosFromDataPortType(portType, true);
                }
                else if (isControlPort) {
                    const portType = nodeModel.getAttributeValue('portType');
                    displayAddButton = block.isControlPortTypeAddable(portType);
                    tooltipInfos = UIDGVTools.getTooltipInfosFromControlPortType(portType, true);
                }
                else if (isSetting) {
                    displayAddButton = block.isSettingTypeAddable();
                    tooltipInfos = UIDGVTools.getTooltipInfosFromSetting(true);
                }
                result = {
                    count: 1,
                    addButtonDefinition: {
                        display: displayAddButton,
                        index: 0,
                        disabled: false,
                        tooltipOptions: {
                            title: tooltipInfos.title,
                            shortHelp: tooltipInfos.shortHelp
                        }
                    }
                };
            }
            return result;
        }
        /**
         * Gets the section actions cell semantics for the model item.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {DataPort|Setting|ControlPort} modelItem - The model item.
         * @returns {IActionsTweakerSemantics} The section actions cell semantics for the model item.
         */
        static _getSectionActionsCellSemanticsForModelItem(cellInfos, modelItem) {
            let result = {};
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel && modelItem) {
                let displayRemoveButton = false;
                let tooltipInfos = {};
                if (modelItem instanceof DataPort) {
                    displayRemoveButton = modelItem.block.isDataPortRemovable(modelItem);
                    const portType = nodeModel.getAttributeValue('portType');
                    tooltipInfos = UIDGVTools.getTooltipInfosFromDataPortType(portType, false);
                }
                else if (modelItem instanceof ControlPort) {
                    displayRemoveButton = modelItem.block.isControlPortRemovable(modelItem);
                    const portType = nodeModel.getAttributeValue('portType');
                    tooltipInfos = UIDGVTools.getTooltipInfosFromControlPortType(portType, false);
                }
                else if (modelItem instanceof Setting) {
                    displayRemoveButton = modelItem.block.isSettingRemovable(modelItem);
                    tooltipInfos = UIDGVTools.getTooltipInfosFromSetting(false);
                }
                result = {
                    count: 1,
                    removeButtonDefinition: {
                        display: displayRemoveButton,
                        index: 0,
                        tooltipOptions: {
                            title: tooltipInfos.title,
                            shortHelp: tooltipInfos.shortHelp
                        }
                    }
                };
            }
            return result;
        }
        /**
         * Gets the data item actions cell semantics.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         * @param {boolean} readOnly - True if read only mode is activated, false otherwise.
         * @returns {IActionsTweakerSemantics} The data item actions cell semantics.
         */
        static getDataItemActionsCellSemantics(cellInfos, dataIndex, valueIndex, readOnly) {
            let result = {};
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel && !readOnly) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (!isSection) {
                    const dataItem = nodeModel.getAttributeValue(dataIndex);
                    if (dataItem) {
                        result = this._getActionsCellSemanticsForDataItem(cellInfos, dataItem, valueIndex);
                    }
                    else {
                        result = this._getActionsCellSemanticsForObjectItem(cellInfos, dataIndex, valueIndex);
                    }
                }
            }
            return result;
        }
        /**
         * Gets the actions cell semantics of the data item.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {DataPort|Setting} dataItem - The data port or setting.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         * @returns {IActionsTweakerSemantics} The actions cell semantics of the data item.
         */
        static _getActionsCellSemanticsForDataItem(cellInfos, dataItem, valueIndex) {
            let result = {};
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const editor = nodeModel.getAttributeValue('editor');
                const isDataPort = dataItem instanceof DataPort;
                const isOutputDataPort = isDataPort && dataItem.getType() === ModelEnums.EDataPortType.eOutput;
                const isTestDataPort = valueIndex === 'testValue';
                const isRootDataItemEditable = !isDataPort || (isDataPort && this._isDataItemDefaultValueEditable(dataItem, editor, valueIndex));
                if (isRootDataItemEditable || isTestDataPort) {
                    let displayResetButton = true;
                    let displayUndefinedButton = true;
                    if (isDataPort) {
                        const isSubDataPort = dataItem.dataPort !== undefined;
                        const isInputPortAndNotSubDataPort = !isOutputDataPort && !isSubDataPort;
                        displayResetButton = isInputPortAndNotSubDataPort;
                        displayUndefinedButton = isInputPortAndNotSubDataPort || isTestDataPort;
                    }
                    const isValueSettable = isDataPort ? dataItem.isDefaultValueSettable() : dataItem.isValueSettable();
                    const isPlaying = editor.getTraceController().getPlayingState();
                    const disableResetButton = !dataItem.isOverride() || !isValueSettable || isPlaying;
                    const isTestValue = valueIndex === 'testValue';
                    const testValue = nodeModel.getAttributeValue('testValue');
                    const defaultValue = isDataPort ? (isTestValue ? testValue : dataItem.getDefaultValue()) : dataItem.getValue();
                    const disableUndefinedButton = defaultValue === undefined;
                    const graphContext = nodeModel.getAttributeValue('graphContext');
                    const valueType = nodeModel.getAttributeValue('valueType');
                    const isArrayType = UIDGVTools.isArrayType(graphContext, valueType);
                    const isArrayEmpty = isArrayType && UITools.safeJSONStringify(defaultValue) === '[]';
                    const isGenericObjectType = UIDGVTools.isGenericObjectType(valueType);
                    const displayAddButton = isArrayType || isGenericObjectType;
                    const objectTypeFlags = ModelEnums.FTypeCategory.fObject | ModelEnums.FTypeCategory.fClass |
                        ModelEnums.FTypeCategory.fEvent;
                    const isTypedObjectType = TypeLibrary.hasType(graphContext, valueType, objectTypeFlags);
                    const displayEmptyObjectButton = isGenericObjectType || isTypedObjectType;
                    const isObjectEmpty = displayEmptyObjectButton && UITools.safeJSONStringify(defaultValue) === '{}';
                    result = {
                        count: 4,
                        ...(!isTestValue && {
                            resetButtonDefinition: {
                                display: displayResetButton,
                                index: 0,
                                disabled: disableResetButton
                            }
                        }),
                        undefinedButtonDefinition: {
                            display: displayUndefinedButton,
                            index: 1,
                            disabled: disableUndefinedButton
                        },
                        emptyArrayButtonDefinition: {
                            display: isArrayType,
                            index: 2,
                            disabled: isArrayEmpty
                        },
                        emptyObjectButtonDefinition: {
                            display: displayEmptyObjectButton,
                            index: 2,
                            disabled: isObjectEmpty
                        },
                        addButtonDefinition: {
                            display: displayAddButton,
                            index: 3,
                            tooltipOptions: {
                                title: UINLS.get('addPropertyTitle'),
                                shortHelp: UINLS.get('addPropertyShortHelp')
                            }
                        }
                    };
                }
            }
            return result;
        }
        /**
         * Gets the actions cell semantics of the object item.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         * @returns {IActionsTweakerSemantics} The actions cell semantics of the object item.
         */
        static _getActionsCellSemanticsForObjectItem(cellInfos, dataIndex, valueIndex) {
            let result = {};
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const editor = nodeModel.getAttributeValue('editor');
                const isTestDataPort = valueIndex === 'testValue';
                const rootDataItem = this._getRootDataItem(nodeModel, dataIndex);
                const isRootDataItemEditable = !rootDataItem || (rootDataItem && this._isDataItemDefaultValueEditable(rootDataItem, editor, valueIndex));
                if (isRootDataItemEditable || isTestDataPort) {
                    const isObjectProperty = this._isObjectTypeInHierarchy(nodeModel, dataIndex);
                    const graphContext = nodeModel.getAttributeValue('graphContext');
                    const parentValueType = nodeModel.getParent().getAttributeValue('valueType');
                    const isParentArrayType = UIDGVTools.isArrayType(graphContext, parentValueType);
                    const currentValueType = cellInfos.nodeModel.getAttributeValue('valueType');
                    const isArrayType = UIDGVTools.isArrayType(graphContext, currentValueType);
                    const defaultValue = nodeModel.getAttributeValue(valueIndex);
                    const isArrayEmpty = isArrayType && UITools.safeJSONStringify(defaultValue) === '[]';
                    const isGenericObjectType = UIDGVTools.isGenericObjectType(currentValueType);
                    const displayRemoveButton = isObjectProperty || isParentArrayType;
                    const displayAddButton = isArrayType || isGenericObjectType;
                    const objectTypeFlags = ModelEnums.FTypeCategory.fObject | ModelEnums.FTypeCategory.fClass |
                        ModelEnums.FTypeCategory.fEvent;
                    const isTypedObjectType = TypeLibrary.hasType(graphContext, currentValueType, objectTypeFlags);
                    const displayEmptyObjectButton = isGenericObjectType || isTypedObjectType;
                    const isObjectEmpty = displayEmptyObjectButton && UITools.safeJSONStringify(defaultValue) === '{}';
                    const displayUndefinedButton = !isObjectProperty && !isParentArrayType;
                    const hasDataIndex = dataIndex !== undefined;
                    result = {
                        count: hasDataIndex ? 4 : 3,
                        removeButtonDefinition: {
                            display: displayRemoveButton,
                            index: 0,
                            tooltipOptions: {
                                title: UINLS.get('removePropertyTitle'),
                                shortHelp: UINLS.get('removePropertyShortHelp')
                            }
                        },
                        undefinedButtonDefinition: {
                            display: displayUndefinedButton,
                            index: hasDataIndex ? 1 : 0,
                            disabled: defaultValue === undefined
                        },
                        emptyArrayButtonDefinition: {
                            display: isArrayType,
                            index: hasDataIndex ? 2 : 1,
                            disabled: isArrayEmpty
                        },
                        emptyObjectButtonDefinition: {
                            display: displayEmptyObjectButton,
                            index: hasDataIndex ? 2 : 1,
                            disabled: isObjectEmpty
                        },
                        addButtonDefinition: {
                            display: displayAddButton,
                            index: hasDataIndex ? 3 : 2,
                            tooltipOptions: {
                                title: UINLS.get('addPropertyTitle'),
                                shortHelp: UINLS.get('addPropertyShortHelp')
                            }
                        }
                    };
                }
            }
            return result;
        }
        /**
         * Sets the model item section actions cell value.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @param {string} value - The cell value.
         */
        static setModelItemSectionActionsCellValue(cellInfos, dataIndex, value) {
            if (value) {
                switch (value) {
                    case 'eAddAction': // TODO: Migrate to an enum!
                        this._onModelItemAddAction(cellInfos, dataIndex);
                        break;
                    case 'eRemoveAction':
                        this._onModelItemRemoveAction(cellInfos, dataIndex);
                        break;
                }
            }
        }
        /**
         * The callback on the model item add action.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         */
        static _onModelItemAddAction(cellInfos, dataIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (isSection) {
                    const block = nodeModel.getAttributeValue('block');
                    if (block) {
                        const isDataPort = dataIndex === 'dataPort';
                        const isSetting = dataIndex === 'setting';
                        const isControlPort = dataIndex === 'controlPort';
                        if (isDataPort) {
                            const portType = nodeModel.getAttributeValue('portType');
                            block.createDynamicDataPort(portType);
                        }
                        else if (isControlPort) {
                            const portType = nodeModel.getAttributeValue('portType');
                            block.createDynamicControlPort(portType);
                        }
                        else if (isSetting) {
                            block.createDynamicSetting();
                        }
                    }
                }
            }
        }
        /**
         * The callback on the model item remove action.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         */
        static _onModelItemRemoveAction(cellInfos, dataIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const dataItem = nodeModel.getAttributeValue(dataIndex);
                const block = dataItem.block;
                if (dataItem && block) {
                    if (dataItem instanceof DataPort && block.isDataPortRemovable(dataItem)) {
                        block.removeDataPort(dataItem);
                    }
                    else if (dataItem instanceof Setting && block.isSettingRemovable(dataItem)) {
                        block.removeSetting(dataItem);
                    }
                    else if (dataItem instanceof ControlPort && block.isControlPortRemovable(dataItem)) {
                        block.removeControlPort(dataItem);
                    }
                }
            }
        }
        /**
         * Sets the data item actions cell value.
         * @public
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         * @param {string} value - The cell value.
         */
        static setDataItemActionsCellValue(cellInfos, dataIndex, valueIndex, value) {
            if (value) {
                switch (value) { // TODO: Migrate to an enum!
                    case 'eAddAction':
                        this._onAddAction(cellInfos, dataIndex, valueIndex);
                        break;
                    case 'eRemoveAction':
                        this._onRemoveAction(cellInfos, dataIndex, valueIndex);
                        break;
                    case 'eUndefinedAction':
                        this._onUndefinedAction(cellInfos, dataIndex, valueIndex);
                        break;
                    case 'eResetAction':
                        this._onResetAction(cellInfos, dataIndex);
                        break;
                    case 'eEmptyArrayAction':
                        this._onEmptyArrayAction(cellInfos, dataIndex, valueIndex);
                        break;
                    case 'eEmptyObjectAction':
                        this._onEmptyObjectAction(cellInfos, dataIndex, valueIndex);
                        break;
                }
            }
        }
        /**
         * The callback on the add action.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         */
        static _onAddAction(cellInfos, dataIndex, valueIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const isSection = nodeModel.getAttributeValue('isSection');
                if (!isSection) {
                    const valueType = nodeModel.getAttributeValue('valueType');
                    const graphContext = nodeModel.getAttributeValue('graphContext');
                    const isGenericArrayType = UIDGVTools.isGenericArrayType(valueType);
                    const isTypedArrayType = UIDGVTools.isTypedArrayType(graphContext, valueType);
                    const isGenericObjectType = UIDGVTools.isGenericObjectType(valueType);
                    let propertyName = '', propertyValueType = '', propertyDefaultValue, canExpand = false;
                    let addChildren = false;
                    if (isGenericArrayType) {
                        nodeModel.expand();
                        const children = nodeModel.getChildren() || [];
                        propertyName = String(children.length);
                        propertyValueType = 'Double';
                        propertyDefaultValue = UIDGVTools.getDefaultValueFromValueType(propertyValueType, graphContext);
                        canExpand = false;
                        addChildren = true;
                    }
                    else if (isTypedArrayType) {
                        nodeModel.expand();
                        const children = nodeModel.getChildren() || [];
                        propertyName = String(children.length);
                        propertyValueType = TypeLibrary.getArrayValueTypeName(valueType);
                        propertyDefaultValue = UIDGVTools.getDefaultValueFromValueType(propertyValueType, graphContext);
                        const pIsGenericObjectType = UIDGVTools.isGenericObjectType(propertyValueType);
                        const pIsValued = propertyDefaultValue !== undefined;
                        const pIsTypedObjectType = UIDGVTools.isTypedObjectType(graphContext, propertyValueType);
                        const pIsClassType = UIDGVTools.isClassType(graphContext, propertyValueType);
                        const pIsEventType = UIDGVTools.isEventType(graphContext, propertyValueType);
                        const pIsTypedArrayType = UIDGVTools.isTypedArrayType(graphContext, propertyValueType);
                        canExpand = (pIsGenericObjectType && pIsValued) || pIsTypedObjectType || pIsClassType || pIsEventType || pIsTypedArrayType;
                        addChildren = true;
                    }
                    else if (isGenericObjectType) {
                        nodeModel.expand();
                        propertyName = this._generatePropertyName(nodeModel);
                        propertyValueType = 'Double';
                        propertyDefaultValue = UIDGVTools.getDefaultValueFromValueType(propertyValueType, graphContext);
                        canExpand = false;
                        addChildren = true;
                    }
                    if (addChildren) {
                        const editor = nodeModel.getAttributeValue('editor');
                        const childNodeModel = new WUXTreeNodeModel({
                            label: propertyName,
                            grid: {
                                editor: editor,
                                graphContext: graphContext,
                                valueType: propertyValueType,
                                ...{ [valueIndex]: propertyDefaultValue },
                                actions: {}
                            },
                            children: canExpand ? [] : undefined
                        });
                        nodeModel.addChild(childNodeModel);
                        this._updateValueAndPropagateToParent(childNodeModel, dataIndex, propertyDefaultValue, valueIndex);
                        nodeModel.expand();
                    }
                }
            }
        }
        /**
         * The callback on the remove action.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         */
        static _onRemoveAction(cellInfos, dataIndex, valueIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const dataItem = nodeModel.getAttributeValue(dataIndex);
                if (!dataItem) {
                    const parentNodeModel = nodeModel.getParent();
                    const parentDefaultValue = parentNodeModel.getAttributeValue(valueIndex); // This is a reference on the array/object (no need to update the nodeModel)!
                    // We need to clone the reference of the object/array so the WebUX published property be correctly updated!
                    const clonedParentDefaultValue = Object.assign(Array.isArray(parentDefaultValue) ? [] : {}, parentDefaultValue);
                    const index = nodeModel.getLabel();
                    const isArray = Array.isArray(clonedParentDefaultValue);
                    if (isArray) {
                        clonedParentDefaultValue.splice(Number(index), 1);
                    }
                    else {
                        delete clonedParentDefaultValue[index];
                    }
                    parentNodeModel.removeChild(nodeModel);
                    if (isArray) {
                        const children = parentNodeModel.getChildren() || [];
                        children.forEach((child, i) => child.setLabel(String(i)));
                    }
                    this._updateValueAndPropagateToParent(parentNodeModel, dataIndex, clonedParentDefaultValue, valueIndex);
                }
            }
        }
        /**
         * The callback on the undefined action.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         */
        static _onUndefinedAction(cellInfos, dataIndex, valueIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const dataItem = nodeModel.getAttributeValue(dataIndex);
                if (dataItem) {
                    this._onUndefinedActionForDataItem(nodeModel, dataItem, valueIndex);
                }
                else {
                    this._onUndefinedActionForObjectItem(nodeModel, dataIndex, valueIndex);
                }
            }
        }
        /**
         * The callback on the undefined action for data item.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {DataPort|Setting} dataItem - The data port or setting.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         */
        static _onUndefinedActionForDataItem(nodeModel, dataItem, valueIndex) {
            if (dataItem) {
                const isDataPort = dataItem instanceof DataPort;
                const isTestValue = valueIndex === 'testValue';
                const isValueSettable = isDataPort ? (isTestValue ? dataItem.isTestValuesSettable() : dataItem.isDefaultValueSettable()) : dataItem.isValueSettable();
                if (isValueSettable) {
                    const result = isDataPort ? (isTestValue ? true : dataItem.setDefaultValue(undefined)) : dataItem.setValue(undefined);
                    if (result) {
                        nodeModel.setAttribute(valueIndex, undefined);
                        nodeModel.updateOptions({ grid: { actions: {} } });
                        nodeModel.collapse();
                        this._removeChildrenOfArrayOrGenericObject(nodeModel);
                    }
                }
            }
        }
        /**
         * The callback on the undefined action for object item.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         * @param {boolean} [updateParents=true] - True to also update parent else false.
         */
        static _onUndefinedActionForObjectItem(nodeModel, dataIndex, valueIndex, updateParents = true) {
            if (nodeModel) { // 1- Update children
                const valueType = nodeModel.getAttributeValue('valueType');
                const graphContext = nodeModel.getAttributeValue('graphContext');
                const isGenericObjectType = UIDGVTools.isGenericObjectType(valueType);
                const isTypedArrayType = UIDGVTools.isTypedArrayType(graphContext, valueType);
                if (isGenericObjectType || isTypedArrayType) {
                    nodeModel.removeChildren();
                }
                else {
                    const children = nodeModel.getChildren() || [];
                    children.forEach(child => {
                        const options = {
                            grid: {
                                ...{ [valueIndex]: undefined }
                            }
                        };
                        child.updateOptions(options);
                        this._onUndefinedActionForObjectItem(child, dataIndex, valueIndex, false);
                    });
                }
                if (updateParents) { // 2- Update parents
                    this._updateValueAndPropagateToParent(nodeModel, dataIndex, undefined, valueIndex);
                }
            }
        }
        /**
         * The callback on the reset action.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         */
        static _onResetAction(cellInfos, dataIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const dataItem = nodeModel.getAttributeValue(dataIndex);
                const isDataPort = dataItem instanceof DataPort;
                const result = isDataPort ? dataItem.resetDefaultValue() : dataItem.resetValue();
                if (result) {
                    const defaultValue = isDataPort ? dataItem.getDefaultValue() : dataItem.getValue();
                    nodeModel.setAttribute('defaultValue', defaultValue);
                    nodeModel.collapse();
                    this._removeChildrenOfArrayOrGenericObject(nodeModel);
                }
            }
        }
        /**
         * The callback on the empty array action.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         */
        static _onEmptyArrayAction(cellInfos, dataIndex, valueIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                nodeModel.collapse();
                nodeModel.removeChildren();
                nodeModel.setHasAsyncChildren(false);
                this._updateValueAndPropagateToParent(nodeModel, dataIndex, [], valueIndex);
            }
        }
        /**
         * The callback on the empty object action.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         */
        static _onEmptyObjectAction(cellInfos, dataIndex, valueIndex) {
            const nodeModel = cellInfos?.nodeModel;
            if (nodeModel) {
                const graphContext = nodeModel.getAttributeValue('graphContext');
                const valueType = nodeModel.getAttributeValue('valueType');
                const defaultValue = {};
                const canExpand = this.canExpand(graphContext, valueType, defaultValue);
                nodeModel.collapse();
                nodeModel.removeChildren();
                nodeModel.setHasAsyncChildren(canExpand);
                this._updateValueAndPropagateToParent(nodeModel, dataIndex, defaultValue, valueIndex);
            }
        }
        // #endregion
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                    _____ ___   ___  _     ____                                 //
        //                                   |_   _/ _ \ / _ \| |   / ___|                                //
        //                                     | || | | | | | | |   \___ \                                //
        //                                     | || |_| | |_| | |___ ___) |                               //
        //                                     |_| \___/ \___/|_____|____/                                //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // #region Tools
        /**
         * Gets the parent data port node model.
         * @public
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @returns {WUXTreeNodeModel|undefined} - The parent data port node model.
         */
        static getParentDataPortNodeModel(nodeModel) {
            let result;
            if (nodeModel !== undefined) {
                const dataPort = nodeModel.getAttributeValue('dataPort');
                const isRoot = nodeModel.isRoot();
                result = dataPort ? nodeModel : (!isRoot ? this.getParentDataPortNodeModel(nodeModel.getParent()) : undefined);
            }
            return result;
        }
        /**
         * Removes the children node model of array or generic object.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The WUX tree node model.
         */
        static _removeChildrenOfArrayOrGenericObject(nodeModel) {
            const valueType = nodeModel.getAttributeValue('valueType');
            const graphContext = nodeModel.getAttributeValue('graphContext');
            const isArrayType = UIDGVTools.isArrayType(graphContext, valueType);
            const isGenericObjectType = UIDGVTools.isGenericObjectType(valueType);
            if (isArrayType || isGenericObjectType) {
                nodeModel.removeChildren();
                nodeModel.setHasAsyncChildren(false);
            }
        }
        /**
         * Update the node model default value and propagate the change to the parent node.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {TDataItemDataIndex} dataIndex - The column data item data index.
         * @param {any} value - The data item default value (data port), value (setting) or test value (test data port).
         * @param {TValueDataIndex} valueIndex - The column value data index.
         * @returns {boolean} True if the value has been updated, false otherwise.
         */
        static _updateValueAndPropagateToParent(nodeModel, dataIndex, value, valueIndex) {
            let result = false;
            if (nodeModel !== undefined) {
                /*if (typeof value === 'object') {
                    const clonedValue = Object.assign(Array.isArray(value) ? [] : {}, value);
                    nodeModel.setAttribute(valueIndex, clonedValue);
                    const options = {
                        grid: {
                            actions: {},
                            ...{ [valueIndex]: clonedValue }
                        }
                    };
                    nodeModel.updateOptions(options);
                    //(nodeModel as any).notifyModelUpdate({ actions: {}}, { actions: undefined});
    
                } else {
                    nodeModel.setAttribute(valueIndex, value);
                    const options = {
                        grid: {
                            actions: {},
                            ...{ [valueIndex]: value }
                        }
                    };
                    nodeModel.updateOptions(options);
                    //(nodeModel as any).notifyModelUpdate({ actions: {}}, { actions: undefined});
                    // TODO: nodeModel.notifyModelUpdate();
                    // TODO:  + update ref object et array
    
                    //nodeModel.setAttribute('actions', {}); // Does not update the actions!
                    //nodeModel.updateOptions({ grid: { defaultValue: value, actions: {} } });  // Does not update the default value!
                }*/
                // We need to clone the reference of the object/array so the WebUX published property be correctly updated!
                /*if (typeof value === 'object') {
                    const isArrayBuffer = value instanceof ArrayBuffer;
                    if (!isArrayBuffer) {
                        value = Object.assign(Array.isArray(value) ? [] : {}, value);
                    }
                }*/
                nodeModel.setAttribute(valueIndex, value);
                const options = {
                    grid: {
                        actions: {},
                        ...{ [valueIndex]: value }
                    }
                };
                nodeModel.updateOptions(options);
                let graphContext = nodeModel.getAttributeValue('graphContext');
                const valueType = nodeModel.getAttributeValue('valueType');
                const canExpand = this.canExpand(graphContext, valueType, value);
                nodeModel.setHasAsyncChildren(canExpand);
                const hasDataIndex = dataIndex !== undefined;
                const dataItem = nodeModel.getAttributeValue(dataIndex);
                const isRoot = nodeModel.isRoot();
                const isNotRootDataIndex = hasDataIndex && dataItem === undefined;
                const isNotRootObjectEditor = !hasDataIndex && !isRoot; // Only useful if using ObjectEditor tweaker!
                if (isNotRootDataIndex || isNotRootObjectEditor) {
                    const parentNodeModel = nodeModel.getParent() || undefined;
                    if (parentNodeModel !== undefined) {
                        let [playResult, playValue] = this._getDataPortPlayValue(parentNodeModel);
                        let parentValue = playResult ? playValue : parentNodeModel.getAttributeValue(valueIndex);
                        if (parentValue === undefined) {
                            const parentValueType = parentNodeModel.getAttributeValue('valueType');
                            graphContext = parentNodeModel.getAttributeValue('graphContext');
                            const isArrayType = UIDGVTools.isArrayType(graphContext, parentValueType);
                            parentValue = isArrayType ? [] : {};
                        }
                        const propertyName = nodeModel.getLabel();
                        // We need to clone the reference of the object/array so the WebUX published property be correctly updated!
                        const clonedParentValue = Object.assign(Array.isArray(parentValue) ? [] : {}, parentValue);
                        clonedParentValue[propertyName] = value; // Update the object structure
                        result = this._updateValueAndPropagateToParent(parentNodeModel, dataIndex, clonedParentValue, valueIndex);
                    }
                }
                else if (!isRoot || dataItem !== undefined) {
                    const cellInfos = { nodeModel: nodeModel };
                    result = this.setDataItemDefaultValueCellValue(cellInfos, dataIndex, value, valueIndex);
                }
            }
            return result;
        }
        /**
         * Checks if the provided valueType can be expanded.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @param {any} defaultValue - The default value.
         * @returns {boolean} True if the value type can be expanded else false.
         */
        static canExpand(graphContext, valueType, defaultValue) {
            let result = UIDGVTools.isArrayType(graphContext, valueType) && Array.isArray(defaultValue) && defaultValue.length > 0;
            result = result || UIDGVTools.isGenericObjectType(valueType) && defaultValue !== undefined && Object.keys(defaultValue).length > 0;
            result = result || UIDGVTools.isTypedObjectType(graphContext, valueType) && !this._isEmptyLocalCustomType(graphContext, valueType);
            result = result || UIDGVTools.isClassType(graphContext, valueType) && !this._isEmptyCustomType(graphContext, valueType);
            result = result || UIDGVTools.isEventType(graphContext, valueType) && !this._isEmptyCustomType(graphContext, valueType);
            return result;
        }
        /**
         * Checks if the value type is an empty local custom type.
         * @public
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if the value type is an empty local custom type else false.
         */
        static _isEmptyLocalCustomType(graphContext, valueType) {
            const localCustomType = graphContext ? TypeLibrary.getLocalCustomType(graphContext, valueType) : undefined;
            const result = localCustomType !== undefined && Object.keys(localCustomType).length === 0;
            return result;
        }
        /**
         * Checks whether the specified value type is an empty custom type.
         * @private
         * @static
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueType - The value type.
         * @returns {boolean} True if the value type is an empty custom type else false.
         */
        static _isEmptyCustomType(graphContext, valueType) {
            let result = true;
            const customType = TypeLibrary.getType(graphContext, valueType);
            if (customType) {
                const customTypeCategory = TypeLibrary.getTypeCategory(graphContext, valueType);
                const isClassType = customTypeCategory === ModelEnums.FTypeCategory.fClass;
                const isEventType = customTypeCategory === ModelEnums.FTypeCategory.fEvent;
                const isClassOrEventType = (isClassType || isEventType) && customType.descriptor;
                let customTypeDescriptor = isClassOrEventType ? customType.descriptor : customType;
                result = Object.keys(customTypeDescriptor).length === 0;
            }
            return result;
        }
        /**
         * The callback on the data item pre expand event.
         * @public
         * @static
         * @param {IWUXModelEvent} modelEvent - The data item pre expand event.
         * @param {TValueDataIndex} valueIndex - The column value data index value.
         */
        static onDataItemPreExpand(modelEvent, valueIndex) {
            const nodeModel = modelEvent?.target;
            if (nodeModel) {
                const editor = nodeModel.getAttributeValue('editor');
                const graphContext = nodeModel.getAttributeValue('graphContext');
                UIDGVDataItemTools._createChildrenNodeModel(nodeModel, editor, graphContext, valueIndex);
                nodeModel.preExpandDone();
            }
        }
        /**
         * Creates the children of the node model.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The WUX tree node model.
         * @param {UIEditor} editor - The UI editor.
         * @param {GraphBlock} graphContext - The graph context.
         * @param {TValueDataIndex} valueIndex - The column value data index value.
         */
        static _createChildrenNodeModel(nodeModel, editor, graphContext, valueIndex) {
            if (nodeModel && graphContext) {
                nodeModel.removeChildren();
                const valueType = nodeModel.getAttributeValue('valueType');
                if (UIDGVTools.isAnyObjectType(graphContext, valueType)) {
                    let [playResult, playValue] = this._getDataPortPlayValue(nodeModel);
                    const value = playResult ? playValue : nodeModel.getAttributeValue(valueIndex);
                    const children = this._createChildrenNodeModelFromValueTypeName(editor, graphContext, valueType, value, valueIndex);
                    if (children.length > 0) {
                        nodeModel.addChild(children);
                        children.forEach(child => child.onPreExpand(modelEvents => UIDGVDataItemTools.onDataItemPreExpand(modelEvents, valueIndex)));
                        //nodeModel.expand();
                    }
                }
            }
        }
        /**
         * Gets the data port play value.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The WUX node model.
         * @returns {[boolean, any]} The play result and play value.
         */
        static _getDataPortPlayValue(nodeModel) {
            let result = false;
            let value = undefined;
            if (nodeModel !== undefined) {
                const dataPort = nodeModel.getAttributeValue('dataPort');
                const fromDebug = nodeModel.getAttributeValue('fromDebug');
                const editor = nodeModel.getAttributeValue('editor');
                const traceController = editor.getTraceController();
                const isPlaying = traceController.getPlayingState();
                if (dataPort && isPlaying && !fromDebug) {
                    const isSubDataPort = dataPort.dataPort !== undefined;
                    const parentDataPortModel = isSubDataPort ? dataPort.dataPort : dataPort;
                    const events = traceController.getEventByDataPortPath(parentDataPortModel.toPath());
                    if (events.length > 0) {
                        const event = events[events.length - 1];
                        value = isSubDataPort ? event.getValue()[dataPort.getName()] : event.getValue();
                        result = true;
                    }
                }
            }
            return [result, value];
        }
        /**
         * Creates the children node model from the value type name.
         * @private
         * @static
         * @param {UIEditor} editor - The UI editor.
         * @param {GraphBlock} graphContext - The graph context.
         * @param {string} valueTypeName - The value type name.
         * @param {any} value - The default value or test value.
         * @param {TValueDataIndex} valueIndex - The column value data index value.
         * @returns {WUXTreeNodeModel[]} The children node model.
         */
        static _createChildrenNodeModelFromValueTypeName(editor, graphContext, valueTypeName, value, valueIndex) {
            const children = [];
            const isArrayType = UIDGVTools.isArrayType(graphContext, valueTypeName);
            if (isArrayType) {
                if (Array.isArray(value) && value.length > 0) {
                    const isGenericArrayType = UIDGVTools.isGenericArrayType(valueTypeName);
                    if (isGenericArrayType) {
                        for (let i = 0; i < value.length; i++) {
                            const pValue = value[i];
                            const pValueType = UIDGVTools.getValueTypeNameFromDefaultValue(pValue);
                            const canExpand = this.canExpand(graphContext, pValueType, pValue);
                            children.push(new WUXTreeNodeModel({
                                label: i,
                                grid: {
                                    editor: editor,
                                    graphContext: graphContext,
                                    valueType: pValueType,
                                    ...{ [valueIndex]: pValue },
                                    actions: {}
                                },
                                children: canExpand ? [] : undefined
                            }));
                        }
                    }
                    else {
                        const arrayValueType = TypeLibrary.getArrayValueTypeName(valueTypeName);
                        for (let i = 0; i < value.length; i++) {
                            const pValue = value[i];
                            const canExpand = this.canExpand(graphContext, arrayValueType, pValue);
                            children.push(new WUXTreeNodeModel({
                                label: i,
                                grid: {
                                    editor: editor,
                                    graphContext: graphContext,
                                    valueType: arrayValueType,
                                    ...{ [valueIndex]: pValue },
                                    actions: {}
                                },
                                children: canExpand ? [] : undefined
                            }));
                        }
                    }
                }
            }
            else {
                const isGenericObjectType = UIDGVTools.isGenericObjectType(valueTypeName);
                if (isGenericObjectType && value !== undefined) {
                    Object.keys(value).forEach(propertyName => {
                        const pValue = value[propertyName];
                        if (pValue !== undefined) {
                            const pValueTypeName = UIDGVTools.getValueTypeNameFromDefaultValue(pValue);
                            const canExpand = this.canExpand(graphContext, pValueTypeName, pValue);
                            children.push(new WUXTreeNodeModel({
                                label: propertyName,
                                grid: {
                                    editor: editor,
                                    graphContext: graphContext,
                                    valueType: pValueTypeName,
                                    ...{ [valueIndex]: pValue },
                                    actions: {}
                                },
                                children: canExpand ? [] : undefined
                            }));
                        }
                    });
                }
                else {
                    const isClassType = UIDGVTools.isClassType(graphContext, valueTypeName);
                    const isEventType = UIDGVTools.isEventType(graphContext, valueTypeName);
                    const classOrEventOrObjectType = TypeLibrary.getType(graphContext, valueTypeName);
                    const typeDescriptor = (isClassType || isEventType) ? classOrEventOrObjectType.descriptor : classOrEventOrObjectType;
                    if (typeDescriptor !== undefined) {
                        Object.keys(typeDescriptor).forEach(propertyName => {
                            const pValueTypeName = typeDescriptor[propertyName].type;
                            const pValue = value ? value[propertyName] : undefined;
                            const canExpand = this.canExpand(graphContext, pValueTypeName, pValue);
                            children.push(new WUXTreeNodeModel({
                                label: propertyName,
                                grid: {
                                    editor: editor,
                                    graphContext: graphContext,
                                    valueType: pValueTypeName,
                                    ...{ [valueIndex]: pValue },
                                    actions: {}
                                },
                                children: canExpand ? [] : undefined
                            }));
                        });
                    }
                }
            }
            return children;
        }
        /**
         * Checks whether Object type is present in the node model hierarchy.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         * @returns {boolean} True Object type is present in the node model hierarchy else false.
         */
        static _isObjectTypeInHierarchy(nodeModel, dataIndex) {
            let result = false;
            const parentNodeModel = nodeModel.getParent();
            const valueType = parentNodeModel.getAttributeValue('valueType');
            result = UIDGVTools.isGenericObjectType(valueType);
            const modelItem = parentNodeModel.getAttributeValue(dataIndex);
            const hasDataIndex = dataIndex !== undefined;
            const isNotRootDataIndex = hasDataIndex && modelItem === undefined;
            const isNotRootObjectEditor = !hasDataIndex && !nodeModel.isRoot(); // Only useful if using ObjectEditor tweaker!
            if (!result && (isNotRootDataIndex || isNotRootObjectEditor)) {
                result = this._isObjectTypeInHierarchy(parentNodeModel, dataIndex);
            }
            return result;
        }
        /**
         * Checks whether the provided node model has an output data port in its hierarchy.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @returns {boolean} Whether the node model has an output data port in its hierarchy.
         */
        static _hasOutputDataPortInHierarchy(nodeModel) {
            let result = false;
            if (nodeModel !== undefined && nodeModel !== null) {
                const dataPort = nodeModel.getAttributeValue('dataPort');
                const isDataPort = dataPort instanceof DataPort;
                result = isDataPort && dataPort.getType() === ModelEnums.EDataPortType.eOutput;
                result = result || (!isDataPort && this._hasOutputDataPortInHierarchy(nodeModel.getParent()));
            }
            return result;
        }
        /**
         * Generates a new property name that does not conflict with existing ones.
         * @private
         * @static
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @returns {string} The new property name.
         */
        static _generatePropertyName(nodeModel) {
            let propertyName = '';
            if (nodeModel) {
                const children = nodeModel.getChildren() || [];
                const prefix = 'property';
                let index = 1;
                propertyName = prefix + index;
                const predicate = (child) => child.getLabel() === propertyName;
                while (children.find(predicate) !== undefined) {
                    index++;
                    propertyName = prefix + index;
                }
            }
            return propertyName;
        }
    }
    return UIDGVDataItemTools;
});
