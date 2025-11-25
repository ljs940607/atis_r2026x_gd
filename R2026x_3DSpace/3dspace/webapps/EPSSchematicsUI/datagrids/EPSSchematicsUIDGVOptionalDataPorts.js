/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOptionalDataPorts'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOptionalDataPorts", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UIDataGridView, WUXTreeNodeModel, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI data grid view optional data ports.
     * @private
     * @class UIDGVOptionalDataPorts
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOptionalDataPorts
     * @extends UIDataGridView
     */
    class UIDGVOptionalDataPorts extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIBlock} blockUI - The UI block.
         */
        constructor(blockUI) {
            super({
                className: 'sch-dgv-optionaldataports',
                rowsHeader: false,
                columnsHeader: false,
                columnDragEnabledFlag: false,
                showCellActivationFlag: false,
                cellActivationFeedback: 'none',
                showAlternateBackgroundFlag: false,
                showRowBorderFlag: false,
                cellSelection: 'none',
                rowSelection: 'single'
            });
            this._blockUI = blockUI;
            this._generateTreeDocument();
        }
        /**
         * Removes the data grid view.
         * @public
         * @override
         */
        remove() {
            this._blockUI = undefined;
            super.remove();
        }
        /**
         * Defines the data grid view columns.
         * @protected
         * @override
         */
        _defineColumns() {
            this._columns.push({
                dataIndex: 'tree',
                visibleFlag: true,
                sortableFlag: false,
                editableFlag: false,
                typeRepresentation: 'string'
            });
            this._columns.push({
                dataIndex: 'type',
                sortableFlag: false,
                editableFlag: false,
                typeRepresentation: 'string'
            });
            this._columns.push({
                dataIndex: 'isVisible',
                sortableFlag: false,
                editableFlag: true,
                typeRepresentation: 'independantBoolean',
                editionPolicy: 'EditionInPlace',
                width: 20,
                setCellValue: (cellInfos, value) => {
                    cellInfos.nodeModel.setAttribute('isVisible', value);
                    const dataPortUI = cellInfos.nodeModel.getAttributeValue('dataPortUI');
                    dataPortUI.setExposedState(value);
                    const hc = dataPortUI.getEditor().getHistoryController();
                    const registerFct = value ? hc.registerShowOptionalDataPortAction.bind(hc) : hc.registerHideOptionalDataPortAction.bind(hc);
                    registerFct.call(hc);
                }
            });
        }
        /**
         * Generates the tree document.
         * @private
         */
        _generateTreeDocument() {
            const uiDataPorts = this._blockUI.getUIDataPorts(ModelEnums.EDataPortType.eInputExternal, false, true);
            const optionalUIDataPorts = uiDataPorts.filter(dp => dp.getModel().isOptional());
            optionalUIDataPorts.forEach(dp => {
                const rootNode = new WUXTreeNodeModel({
                    label: dp.getModel().getName(),
                    grid: {
                        dataPortUI: dp,
                        type: dp.getModel().getValueType(),
                        isVisible: dp.isExposed()
                    }
                });
                this._treeDocument.addRoot(rootNode);
            });
        }
    }
    return UIDGVOptionalDataPorts;
});
