/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractTestDataPort'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractTestDataPort", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataItemTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS"], function (require, exports, UIDGVAbstractDataItem, UIDGVDataItemTools, UINLS) {
    "use strict";
    /**
     * This class defines the UI data grid view abstract test data port.
     * This is the base class for test data ports.
     * @private
     * @abstract
     * @class UIDGVAbstractTestDataPort
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractTestDataPort
     * @extends UIDGVAbstractDataItem
     */
    class UIDGVAbstractTestDataPort extends UIDGVAbstractDataItem {
        /**
         * @public
         * @constructor
         * @param {IWUXDataGridViewOptions} options - The data grid view options.
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         * @param {TDataItemDataIndex} dataIndex - The column data index.
         */
        constructor(options, editor, blockModel, readOnly, dataIndex) {
            const mergedOptions = UIDGVAbstractTestDataPort._mergeDataGridViewOptions({
                className: 'sch-datagridview-iotest'
            }, options);
            super(mergedOptions, editor, blockModel, readOnly, dataIndex, 'testValue');
            this._dataPorts = [];
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
            this._dataPorts = undefined;
            super.remove();
        }
        /**
         * Applies the test values defines on the data grid view to the model.
         * @public
         */
        applyTestValues() {
            this._treeDocument.getRoots().forEach(root => {
                const testValue = root.getAttributeValue('testValue');
                const dataPort = root.getAttributeValue('dataPort');
                dataPort.setTestValues([testValue]); // We only support one test value per data port in UI!
            });
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
            this._defineTestValueColumn();
            this._defineActionsColumn();
        }
        /**
         * Defines the data grid view test value column.
         * @protected
         */
        _defineTestValueColumn() {
            this._columns.push({
                dataIndex: 'testValue',
                text: UINLS.get('treeListColumnTestValue'),
                typeRepresentation: 'string',
                editionPolicy: 'EditionOnOver',
                alignment: 'near',
                visibleFlag: true,
                sortableFlag: true,
                resizableFlag: false,
                getCellClassName: cellInfos => UIDGVDataItemTools.getModelItemCellClassName(cellInfos, this._dataIndex),
                getCellTypeRepresentation: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellTypeRepresentation(cellInfos, this._dataIndex),
                getCellSemantics: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellSemantics(cellInfos, this._editor, 'testValue'),
                getCellEditableState: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellEditableState(cellInfos, this._dataIndex, 'testValue', this._readOnly),
                getCellValue: cellInfos => UIDGVDataItemTools.getDataItemDefaultValueCellValue(cellInfos, this._dataIndex, 'testValue'),
                setCellValue: (cellInfos, newDefaultValue) => UIDGVDataItemTools.setDataItemDefaultValueCellValue(cellInfos, this._dataIndex, newDefaultValue, 'testValue', true)
            });
        }
        /**
         * Initializes the data grid view.
         * @protected
         */
        _initialize() {
            this._dataPorts.forEach(dp => this._createDataPortNodeModel(dp));
            const roots = this._treeDocument.getRoots();
            if (roots.length === 1) {
                roots[0].expand();
            }
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
         * Creates a data port node model.
         * @private
         * @param {DataPort} dataPort - The data port model.
         * @returns {WUXTreeNodeModel|undefined} The created data node model.
         */
        _createDataPortNodeModel(dataPort) {
            let nodeModel = this._createDataItemNodeModel(dataPort, 'testValue', false);
            if (nodeModel !== undefined) {
                this._treeDocument.addRoot(nodeModel);
            }
            return nodeModel;
        }
    }
    return UIDGVAbstractTestDataPort;
});
