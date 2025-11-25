/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractControlPort'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractControlPort", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractModelItem", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataItemTools", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPort", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS"], function (require, exports, UIDGVAbstractModelItem, UIDGVDataItemTools, EventPort, WUXTreeNodeModel, UINLS) {
    "use strict";
    /**
     * This class defines the UI datagridview abstract control port.
     * This is the base class for control ports and single control port DGV.
     * @private
     * @abstract
     * @class UIDGVAbstractControlPort
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractControlPort
     * @extends UIDGVAbstractModelItem
     */
    class UIDGVAbstractControlPort extends UIDGVAbstractModelItem {
        /**
         * @public
         * @constructor
         * @param {IWUXDataGridViewOptions} options - The data grid view options.
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(options, editor, blockModel, readOnly) {
            const mergedOptions = UIDGVAbstractControlPort._mergeDataGridViewOptions({ className: 'sch-datagridview-abstract-control-item' }, options);
            super(mergedOptions, editor, blockModel, readOnly, 'controlPort');
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
        _defineEventTypeColumn() {
            this._columns.push({
                dataIndex: 'eventType',
                text: UINLS.get('treeListColomnEventType'),
                typeRepresentation: 'valueTypeCombo',
                editionPolicy: 'EditionOnOver',
                visibleFlag: true,
                sortableFlag: true,
                getCellClassName: cellInfos => UIDGVDataItemTools.getModelItemCellClassName(cellInfos, this._dataIndex),
                getCellSemantics: cellInfos => UIDGVDataItemTools.getModelItemValueTypeSemantics(cellInfos, this._dataIndex),
                getCellEditableState: cellInfos => UIDGVDataItemTools.getModelItemValueTypeCellEditableState(cellInfos, this._dataIndex, this._readOnly, false),
                setCellValue: (cellInfos, newValueType) => UIDGVDataItemTools.setModelItemValueTypeCellValue(cellInfos, newValueType, this._dataIndex, 'defaultValue')
            });
        }
        /**
         * Creates a control port node model.
         * @protected
         * @param {ControlPort} controlPort - The control port.
         * @param {boolean} hasSectionActions - Whether to create the section actions.
         * @returns {WUXTreeNodeModel|undefined} The created node model.
         */
        _createControlPortNodeModel(controlPort, hasSectionActions) {
            let nodeModel;
            if (controlPort !== undefined) {
                const portType = controlPort.getType();
                const isEventPort = controlPort instanceof EventPort;
                nodeModel = new WUXTreeNodeModel({
                    label: controlPort.getName(),
                    grid: {
                        editor: this._editor,
                        graphContext: this._graphContext,
                        controlPort: controlPort,
                        portType: portType,
                        actions: {},
                        ...(isEventPort && { eventType: controlPort.getEventType() }),
                        ...(hasSectionActions && { sectionActions: {} })
                    }
                });
            }
            return nodeModel;
        }
    }
    return UIDGVAbstractControlPort;
});
