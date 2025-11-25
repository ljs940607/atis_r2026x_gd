/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVHistory'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVHistory", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools"], function (require, exports, UIDataGridView, UITools) {
    "use strict";
    // TODO: Propagate ctrl+Y and ctrl+Z shortcut when focus is on panel!
    // TODO: Navigation au clavier (fleches, enter key?)
    /**
     * This class defines a UI data grid view history.
     * @private
     * @class UIDGVHistory
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVHistory
     * @extends UIDataGridView
     */
    class UIDGVHistory extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UITypeLibraryController} controller - The type library controller.
         */
        constructor(controller) {
            super({
                className: 'sch-datagridview-history',
                treeDocument: controller.getTreeDocument(),
                autoScroll: true,
                columnDragEnabledFlag: false,
                showCellActivationFlag: false,
                cellActivationFeedback: 'none',
                //showCellPreselectionFlag: false,
                showAlternateBackgroundFlag: false,
                //showRowBorderFlag: true,
                cellSelection: 'none',
                rowSelection: 'single',
                defaultColumnDef: {
                    width: 'auto',
                    typeRepresentation: 'string'
                },
                placeholder: '',
                rowsHeader: false,
                columnsHeader: false,
                getCellTooltip: cellInfos => {
                    let tooltip = this.getWUXDataGridView().getCellDefaultTooltip(cellInfos);
                    if (cellInfos.nodeModel !== undefined) {
                        const date = cellInfos.nodeModel.getAttributeValue('date');
                        tooltip = {
                            shortHelp: 'Goto time: ' + UITools.getFullDateAndTime(new Date(date)),
                            initialDelay: 500,
                            updateModel: false
                        };
                    }
                    return tooltip;
                }
            });
            this._controller = controller;
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
            this._controller = undefined;
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
         * Defines the data grid view columns.
         * @protected
         * @override
         */
        _defineColumns() {
            super._defineColumns();
            this._defineCurrentIconColumn();
            this._defineActionIconColumn();
            this._defineActionNameColumn();
        }
        /**
         * The callback on the cell click event.
         * @protected
         * @override
         * @param {MouseEvent} _event - The mouse event.
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         */
        _onCellClick(_event, cellInfos) {
            if (cellInfos !== undefined) {
                this._controller.setCurrentIndex(cellInfos.rowID);
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
         * Defines the current icon column.
         * @private
         */
        _defineCurrentIconColumn() {
            this._columns.push({
                dataIndex: 'currentIcon',
                text: '',
                visibleFlag: true,
                typeRepresentation: 'icon',
                minWidth: 20,
                width: 20,
                //className: 'sch-dgv-history-active'
                getCellClassName: cellInfos => {
                    return UIDGVHistory._getCellClassNameFromCellInfos(cellInfos, 'sch-dgv-history-currenticon');
                }
            });
        }
        /**
         * Defines the action icon column.
         * @private
         */
        _defineActionIconColumn() {
            this._columns.push({
                dataIndex: 'actionIcon',
                text: '',
                visibleFlag: true,
                typeRepresentation: 'icon',
                minWidth: 25,
                width: 25,
                getCellClassName: cellInfos => {
                    return UIDGVHistory._getCellClassNameFromCellInfos(cellInfos, 'sch-dgv-history-actionicon');
                }
            });
        }
        /**
         * Defines the data grid view action name column.
         * @private
         */
        _defineActionNameColumn() {
            this._columns.push({
                dataIndex: 'actionName',
                text: 'Action',
                sortableFlag: false,
                width: 'auto',
                getCellClassName: cellInfos => {
                    return UIDGVHistory._getCellClassNameFromCellInfos(cellInfos, 'sch-dgv-history-actionname');
                }
            });
        }
        /**
         * Gets the cell class name from the given cell infos.
         * @private
         * @static
         * @param {Object} cellInfos - The cell infos.
         * @param {string} className - The cell class name.
         * @returns {string} The corresponding cell class name.
         */
        static _getCellClassNameFromCellInfos(cellInfos, className) {
            if (cellInfos.nodeModel !== undefined) {
                const isCurrent = cellInfos.nodeModel.getAttributeValue('isCurrent');
                const isDisabled = cellInfos.nodeModel.getAttributeValue('isDisabled');
                className += isCurrent ? ' ' + 'sch-dgv-history-iscurrent' : '';
                className += isDisabled ? ' ' + 'sch-dgv-history-isdisabled' : '';
            }
            return className;
        }
    }
    return UIDGVHistory;
});
