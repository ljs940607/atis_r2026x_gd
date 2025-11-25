/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractModelItem", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataItemTools", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsSetting", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVAbstractDataItem"], function (require, exports, UIDGVAbstractModelItem, UINLS, UIDGVDataItemTools, UIDGVTools, UIEvents, DataPort, ModelEnums, Setting, WUXTreeNodeModel) {
    "use strict";
    /**
     * This class defines the UI data grid view abstract data item.
     * This is the base class for data port and settings DGV.
     * @private
     * @abstract
     * @class UIDGVAbstractDataItem
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem
     * @extends UIDGVAbstractModelItem
     */
    class UIDGVAbstractDataItem extends UIDGVAbstractModelItem {
        /**
         * @public
         * @constructor
         * @param {IWUXDataGridViewOptions} options - The data grid view options.
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         * @param {TValueDataIndex} valueIndex - The column value data index.
         */
        constructor(options, editor, blockModel, readOnly, dataIndex, valueIndex) {
            const mergedOptions = UIDGVAbstractDataItem._mergeDataGridViewOptions({ className: 'sch-datagridview-abstract-data-item' }, options);
            super(mergedOptions, editor, blockModel, readOnly, dataIndex);
            this._valueIndex = valueIndex;
            // Update Default value column title
            if (dataIndex === 'dataPort' && this._editor.getTraceController().getPlayingState()) {
                const defaultValueColumn = this._dataGridView.columns.find(column => column.dataIndex === 'defaultValue');
                if (defaultValueColumn) {
                    defaultValueColumn.text = UINLS.get('treeListColumnPlayValue');
                }
            }
        }
        /**
         * Removes the data grid view.
         * @public
         * @override
         */
        remove() {
            this._dataIndex = undefined;
            this._valueIndex = undefined;
            super.remove();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Defines the data grid view value type column.
         * @protected
         */
        _defineValueTypeColumn() {
            this._columns.push({
                dataIndex: 'valueType',
                text: UINLS.get('treeListColumnValueType'),
                typeRepresentation: 'valueTypeCombo',
                editionPolicy: 'EditionOnOver',
                visibleFlag: true,
                sortableFlag: true,
                getCellClassName: cellInfos => UIDGVDataItemTools.getModelItemCellClassName(cellInfos, this._dataIndex),
                getCellSemantics: cellInfos => UIDGVDataItemTools.getModelItemValueTypeSemantics(cellInfos, this._dataIndex),
                getCellEditableState: cellInfos => UIDGVDataItemTools.getModelItemValueTypeCellEditableState(cellInfos, this._dataIndex, this._readOnly, this._valueIndex === 'testValue'),
                setCellValue: (cellInfos, newValueType) => UIDGVDataItemTools.setModelItemValueTypeCellValue(cellInfos, newValueType, this._dataIndex, this._valueIndex)
            });
        }
        /**
         * Defines the data grid view default value column.
         * @protected
         */
        _defineDefaultValueColumn() {
            this._columns.push({
                dataIndex: 'defaultValue',
                text: UINLS.get('treeListColumnDefaultValue'),
                typeRepresentation: 'string',
                editionPolicy: 'EditionOnOver',
                alignment: 'near',
                visibleFlag: true,
                sortableFlag: true,
                resizableFlag: false,
                getCellClassName: cellInfos => UIDGVDataItemTools.getModelItemCellClassName(cellInfos, this._dataIndex),
                getCellTypeRepresentation: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellTypeRepresentation(cellInfos, this._dataIndex),
                getCellSemantics: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellSemantics(cellInfos, this._editor, 'defaultValue'),
                getCellEditableState: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellEditableState(cellInfos, this._dataIndex, 'defaultValue', this._readOnly),
                getCellValue: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellValue(cellInfos, this._dataIndex, 'defaultValue'),
                setCellValue: (cellInfos, newDefaultValue) => UIDGVDataItemTools.setDataItemDefaultValueCellValue(cellInfos, this._dataIndex, newDefaultValue, 'defaultValue', true)
            });
        }
        /**
         * Defines the data grid view actions column.
         * @protected
         */
        _defineActionsColumn() {
            const width = 4 * UIDGVAbstractDataItem._iconWidth;
            this._columns.push({
                dataIndex: 'actions',
                text: UINLS.get('columnHeaderActions'),
                typeRepresentation: 'DGVActionBar',
                visibleFlag: true,
                editionPolicy: 'EditionInPlace',
                editableFlag: true,
                resizableFlag: false,
                sortableFlag: false,
                width: width,
                minWidth: width,
                getCellClassName: cellInfos => UIDGVDataItemTools.getModelItemCellClassName(cellInfos, this._dataIndex),
                getCellSemantics: cellInfos => UIDGVDataItemTools.getDataItemActionsCellSemantics(cellInfos, this._dataIndex, this._valueIndex, this._readOnly),
                setCellValue: (cellInfos, value) => UIDGVDataItemTools.setDataItemActionsCellValue(cellInfos, this._dataIndex, this._valueIndex, value)
            });
        }
        /**
         * Creates a data item node model.
         * @protected
         * @param {DataPort|Setting} dataItem - The data item.
         * @param {TValueDataIndex} valueDataIndex - The column value data index value.
         * @param {boolean} hasSectionActions - Whether to create the section actions.
         * @returns {WUXTreeNodeModel} The created node model.
         */
        _createDataItemNodeModel(dataItem, valueDataIndex, hasSectionActions) {
            let nodeModel;
            if (dataItem !== undefined) {
                const isDataPort = dataItem instanceof DataPort;
                const isSetting = dataItem instanceof Setting;
                const valueType = dataItem.getValueType();
                const isTestValue = valueDataIndex === 'testValue';
                const value = isDataPort ? (isTestValue ? dataItem.getTestValues()[0] : dataItem.getDefaultValue()) : dataItem.getValue();
                const canExpand = UIDGVDataItemTools.canExpand(this._graphContext, valueType, value);
                const options = {
                    label: dataItem.getName(),
                    grid: {
                        editor: this._editor,
                        graphContext: this._graphContext,
                        ...(isDataPort && { dataPort: dataItem }),
                        ...(isDataPort && { portType: dataItem.getType() }),
                        ...(isSetting && { setting: dataItem }),
                        valueType: valueType,
                        ...{ [valueDataIndex]: value },
                        fromDebug: false,
                        actions: {},
                        ...(hasSectionActions && { sectionActions: {} })
                    },
                    children: canExpand ? [] : undefined
                };
                nodeModel = new WUXTreeNodeModel(options);
                nodeModel.onPreExpand(modelEvent => UIDGVDataItemTools.onDataItemPreExpand(modelEvent, valueDataIndex));
                // Send an event to expand the height of the dialog (only useful for single data port dialog)
                nodeModel.onPreExpand(_modelEvent => {
                    const expandEvent = new UIEvents.UIDialogExpandEvent(); // Send a dialog close event
                    this._editor.dispatchEvent(expandEvent);
                });
            }
            return nodeModel;
        }
        /**
         * Renames the CSI default value data grid view column.
         * @public
         * @static
         * @param {UIEditor} editor - The UI editor.
         * @param {DataPort} dataPort - The data port model.
         * @returns {boolean} True if the column has been renamed else false.
         */
        _renameCSIDefaultValueDGVColumn(editor, dataPort) {
            let result = editor !== undefined && dataPort !== undefined;
            result = result && (dataPort.getType() === ModelEnums.EDataPortType.eInput || dataPort.getType() === ModelEnums.EDataPortType.eInputExternal);
            result = result && UIDGVTools.isReadOnlyRoot(editor, dataPort);
            if (result) {
                const defaultValueColumn = this._dataGridView.columns.find(column => column.dataIndex === 'defaultValue');
                defaultValueColumn.text = UINLS.get('treeListColumnCSIDefaultValue');
            }
            return result;
        }
        /**
         * Hides the default value and actions columns for output data port type or sub data port.
         * @protected
         * @param {EDataPortType|undefined} dataPortType - The data port type.
         * @param {boolean} isSubDataPort - Whether this is a sub data port.
         */
        _hideColumnsForOutputDataPortTypeOrSubDataPort(dataPortType, isSubDataPort) {
            const hideDefaultValueColumn = dataPortType === ModelEnums.EDataPortType.eOutput;
            const hideActionsColumn = hideDefaultValueColumn || isSubDataPort; // Can't reset value on sub data port!
            this._dataGridView.layout.setColumnVisibleFlag('defaultValue', !hideDefaultValueColumn);
            this._dataGridView.layout.setColumnVisibleFlag('actions', !hideActionsColumn);
        }
        /**
         * The callback on the model data item default value change event.
         * @protected
         * @static
         * @param {DataPort} dataPort - The data port.
         * @param {WUXTreeNodeModel|undefined} nodeModel - The node model.
         */
        static _onDataItemDefaultValueChange(dataPort, nodeModel) {
            if (dataPort && nodeModel) {
                const valueType = dataPort.getValueType();
                nodeModel.setAttribute('valueType', valueType);
                const defaultValue = dataPort.getDefaultValue();
                nodeModel.setAttribute('defaultValue', defaultValue);
                nodeModel.updateOptions({ grid: { actions: {} } });
            }
        }
        /**
         * The callback on the model data port override change event.
         * @protected
         * @static
         * @param {WUXTreeNodeModel|undefined} nodeModel - The node model.
         */
        static _onDataItemOverrideChange(nodeModel) {
            if (nodeModel) {
                nodeModel.updateOptions({ grid: { actions: {} } });
            }
        }
    }
    return UIDGVAbstractDataItem;
});
