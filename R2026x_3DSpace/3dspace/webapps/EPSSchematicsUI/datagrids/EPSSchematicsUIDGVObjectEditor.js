/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVObjectEditor'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVObjectEditor", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataItemTools", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVObjectEditor"], function (require, exports, UIDataGridView, UINLS, WUXTreeNodeModel, UIDGVDataItemTools, Tools) {
    "use strict";
    const iconWidth = 26;
    /**
     * This class defines a UI data grid view object editor.
     * @private
     * @class UIDGVObjectEditor
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVObjectEditor
     * @extends UIDataGridView
     */
    class UIDGVObjectEditor extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {string} name - The name of the value to edit.
         * @param {string} valueType - The value type.
         * @param {any} defaultValue - The default value.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(editor, name, valueType, defaultValue, readOnly) {
            super({
                className: 'sch-datagridview-objecteditor',
                autoScroll: false,
                columnDragEnabledFlag: false,
                showCellActivationFlag: false,
                cellActivationFeedback: 'none',
                //showCellPreselectionFlag: false,
                showAlternateBackgroundFlag: false,
                showRowBorderFlag: true,
                cellSelection: 'none',
                rowSelection: 'single',
                defaultColumnDef: {
                    width: 'auto',
                    typeRepresentation: 'string'
                },
                treeNodeCellOptions: {
                    expanderStyle: 'triangle'
                },
                placeholder: '',
                rowsHeader: false,
                columnsHeader: true
            });
            this._editor = editor;
            this._name = name;
            this._valueType = valueType;
            this._defaultValue = Tools.copyValue(defaultValue);
            this._readOnly = readOnly;
            this._graphContext = this._editor._getViewer().getMainGraph().getModel().getGraphContext();
            this._initialize();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the data grid view.
         * @public
         * @override
         */
        remove() {
            this._editor = undefined;
            this._name = undefined;
            this._valueType = undefined;
            this._defaultValue = undefined;
            this._readOnly = undefined;
            this._graphContext = undefined;
            super.remove();
        }
        /**
         * Gets the name of the value.
         * @public
         * @returns {string} The name of the value.
         */
        getName() {
            return this._name;
        }
        /**
         * Gets the value type.
         * @public
         * @returns {string} The value type.
         */
        getValueType() {
            return this._valueType;
        }
        /**
         * Gets the default value.
         * @public
         * @returns {any} The default value.
         */
        getDefaultValue() {
            const root = this._treeDocument.getRoots()[0];
            const defaultValue = root.getAttributeValue('defaultValue');
            return Tools.copyValue(defaultValue);
        }
        /**
         * Gets the read only state.
         * @public
         * @returns {boolean} The read only state.
         */
        getReadOnlyState() {
            return this._readOnly;
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
         * Defines the data grid view columns.
         * @protected
         * @override
         */
        _defineColumns() {
            this._defineNameColumn();
            this._defineValueTypeColumn();
            this._defineDefaultValueColumn();
            this._defineActionsColumn();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Defines the data grid view name column.
         * @protected
         */
        _defineNameColumn() {
            this._columns.push({
                dataIndex: 'tree',
                text: UINLS.get('treeListColumnName'),
                typeRepresentation: 'string',
                visibleFlag: true,
                sortableFlag: true,
                editionPolicy: 'EditionOnOver',
                getCellEditableState: cellInfos => UIDGVDataItemTools.getModelItemNameCellEditableState(cellInfos, undefined, this._readOnly),
                setCellValue: (cellInfos, newName) => UIDGVDataItemTools.setModelItemNameCellValue(cellInfos, newName, undefined)
            });
        }
        /**
         * Defines the data grid view value type column.
         * @private
         */
        _defineValueTypeColumn() {
            this._columns.push({
                dataIndex: 'valueType',
                text: UINLS.get('treeListColumnValueType'),
                typeRepresentation: 'valueTypeCombo',
                editionPolicy: 'EditionOnOver',
                visibleFlag: true,
                sortableFlag: true,
                getCellEditableState: cellInfos => UIDGVDataItemTools.getModelItemValueTypeCellEditableState(cellInfos, undefined, this._readOnly, false),
                getCellSemantics: cellInfos => UIDGVDataItemTools.getModelItemValueTypeSemantics(cellInfos, undefined),
                setCellValue: (cellInfos, newValueType) => UIDGVDataItemTools.setModelItemValueTypeCellValue(cellInfos, newValueType, undefined, 'defaultValue')
            });
        }
        /**
         * Defines the data grid view default value column.
         * @private
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
                getCellEditableState: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellEditableState(cellInfos, undefined, undefined, this._readOnly),
                getCellTypeRepresentation: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellTypeRepresentation(cellInfos, undefined),
                getCellValue: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellValue(cellInfos, undefined, 'defaultValue'),
                setCellValue: (cellInfos, newDefaultValue) => UIDGVDataItemTools.setDataItemDefaultValueCellValue(cellInfos, undefined, newDefaultValue, 'defaultValue')
            });
        }
        /**
         * Defines the data grid view actions column.
         * @private
         * @TODO: Return to undefined on a string? (Can't make difference between the display of undefined vs "")
         * @TODO: May be is string is not undefined, use css before/after to display quotes?
         */
        _defineActionsColumn() {
            const width = 3 * iconWidth;
            this._columns.push({
                dataIndex: 'actions',
                text: UINLS.get('columnHeaderActions'),
                typeRepresentation: 'DGVActionBar',
                visibleFlag: true,
                editionPolicy: 'EditionInPlace',
                editableFlag: true,
                width: width,
                minWidth: width,
                getCellSemantics: cellInfos => UIDGVDataItemTools.getDataItemActionsCellSemantics(cellInfos, undefined, 'defaultValue', this._readOnly),
                setCellValue: (cellInfos, value) => UIDGVDataItemTools.setDataItemActionsCellValue(cellInfos, undefined, 'defaultValue', value)
            });
        }
        /**
         * Initializes the data grid view.
         * @private
         */
        _initialize() {
            this._treeDocument.removeRoots();
            const canExpand = UIDGVDataItemTools.canExpand(this._graphContext, this._valueType, this._defaultValue);
            const rootNodeMode = new WUXTreeNodeModel({
                label: this._name,
                grid: {
                    isObjectEditor: true,
                    editor: this._editor,
                    graphContext: this._graphContext,
                    valueType: this._valueType,
                    defaultValue: this._defaultValue,
                    actions: {}
                },
                children: canExpand ? [] : undefined
            });
            this._treeDocument.addRoot(rootNodeMode);
            rootNodeMode.onPreExpand(modelEvents => UIDGVDataItemTools.onDataItemPreExpand(modelEvents, 'defaultValue'));
            rootNodeMode.expand();
        }
    }
    return UIDGVObjectEditor;
});
