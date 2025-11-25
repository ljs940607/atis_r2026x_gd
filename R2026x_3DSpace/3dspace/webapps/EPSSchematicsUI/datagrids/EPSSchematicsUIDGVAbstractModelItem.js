/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractModelItem'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractModelItem", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataItemTools", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVAbstractModelItem"], function (require, exports, UIDataGridView, UINLS, UIDGVDataItemTools, WUXTreeNodeModel) {
    "use strict";
    /**
     * This class defines the UI data grid view abstract model item.
     * This is the base class for control port, data port and settings DGV.
     * @private
     * @abstract
     * @class UIDGVAbstractModelItem
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractModelItem
     * @extends UIDataGridView
     */
    class UIDGVAbstractModelItem extends UIDataGridView {
        static { this._iconWidth = 26; }
        /**
         * @public
         * @constructor
         * @param {IWUXDataGridViewOptions} options - The data grid view options.
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         * @param {TModelItemDataIndex} dataIndex - The column data index.
         */
        constructor(options, editor, blockModel, readOnly, dataIndex) {
            const mergedOptions = UIDataGridView._mergeDataGridViewOptions({
                className: 'sch-datagridview-abstract-model-item',
                autoScroll: false,
                columnDragEnabledFlag: false,
                showCellActivationFlag: false,
                cellActivationFeedback: 'none',
                showAlternateBackgroundFlag: false,
                showRowBorderFlag: true,
                showColumnBorderFlag: false,
                cellSelection: 'none',
                rowSelection: 'single',
                placeholder: '',
                rowsHeader: false,
                columnsHeader: true,
                //cellPreselectionFeedback: 'row',
                treeNodeCellOptions: {
                    //buildLinks: true,
                    expanderStyle: 'triangle'
                },
                onContextualEvent: () => []
            }, options);
            super(mergedOptions);
            this._editor = editor;
            this._blockModel = blockModel;
            this._readOnly = readOnly;
            this._dataIndex = dataIndex;
            this._graphContext = this._editor._getViewer().getMainGraph().getModel().getGraphContext();
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
            super.remove(); // Parent class removes the tree document and triggers some callbacks!
            this._editor = undefined;
            this._blockModel = undefined;
            this._readOnly = undefined;
            this._dataIndex = undefined;
            this._graphContext = undefined;
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
                getCellClassName: cellInfos => UIDGVDataItemTools.getModelItemCellClassName(cellInfos, this._dataIndex),
                getCellEditableState: cellInfos => UIDGVDataItemTools.getModelItemNameCellEditableState(cellInfos, this._dataIndex, this._readOnly),
                setCellValue: (cellInfos, newName) => UIDGVDataItemTools.setModelItemNameCellValue(cellInfos, newName, this._dataIndex)
            });
        }
        /**
         * Defines the data grid view section actions column.
         * @protected
         */
        _defineSectionActionsColumn() {
            this._columns.push({
                dataIndex: 'sectionActions',
                typeRepresentation: 'DGVActionBar',
                visibleFlag: true,
                editionPolicy: 'EditionInPlace',
                editableFlag: true,
                sortableFlag: false,
                width: UIDGVAbstractModelItem._iconWidth,
                minWidth: UIDGVAbstractModelItem._iconWidth,
                resizableFlag: false,
                pinned: 'right',
                getCellClassName: cellInfos => UIDGVDataItemTools.getModelItemCellClassName(cellInfos, this._dataIndex),
                getCellSemantics: cellInfos => UIDGVDataItemTools.getModelItemSectionActionsCellSemantics(cellInfos, this._dataIndex, this._readOnly),
                setCellValue: (cellInfos, value) => UIDGVDataItemTools.setModelItemSectionActionsCellValue(cellInfos, this._dataIndex, value)
            });
        }
        /**
         * Creates a section node model and adds it to the tree document.
         * @private
         * @param {ModelEnums.EDataPortType|ModelEnums.EControlPortType} [portType] - The data or control port type.
         * @returns {WUXTreeNodeModel} The created section node model.
         */
        _createSectionNodeModel(portType) {
            const nodeModel = new WUXTreeNodeModel({
                grid: {
                    isSection: true,
                    block: this._blockModel,
                    ...(portType !== undefined && { portType: portType }),
                    actions: {},
                    sectionActions: {}
                }
            });
            this._treeDocument.addRoot(nodeModel);
            return nodeModel;
        }
    }
    return UIDGVAbstractModelItem;
});
