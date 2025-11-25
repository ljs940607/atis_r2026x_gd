/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDebugConsole'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDebugConsole", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "DS/EPSSchematicsUI/components/EPSSchematicsUIValueEvaluator", "DS/EPSSchematicsUI/components/EPSSchematicsUIBasicEvaluator", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVDebugConsole"], function (require, exports, UIDataGridView, UIValueEvaluator, UIBasicEvaluator, ModelEnums, UIWUXTools, UIDom) {
    "use strict";
    /**
     * This class defines the UI data grid view debug console.
     * @private
     * @class UIDGVDebugConsole
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDebugConsole
     * @extends UIDataGridView
     */
    class UIDGVDebugConsole extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIDebugConsoleController} controller - The debug console controller.
         */
        constructor(controller) {
            super({
                className: 'sch-datagridview-debugconsole',
                treeDocument: controller.getTreeDocument(),
                autoScroll: true,
                columnDragEnabledFlag: false,
                showAlternateBackgroundFlag: false,
                showCellActivationFlag: false,
                showCellPreselectionFlag: false,
                cellSelection: 'none',
                rowSelection: 'single',
                //showRowBorderFlag: true,
                cellActivationFeedback: 'none',
                defaultColumnDef: {
                    width: 'auto',
                    typeRepresentation: 'string'
                },
                placeholder: '',
                rowsHeader: false,
                columnsHeader: false
            });
            this._valueEvaluatorMap = new Map();
            this._updateContent();
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
            if (this._valueEvaluatorMap !== undefined) {
                this._valueEvaluatorMap.clear();
                this._valueEvaluatorMap = undefined;
            }
            super.remove();
        }
        /**
         * Get the value evaluator map.
         * @public
         * @returns {Map<WUXTreeNodeModel, UIValueEvaluator>} The value evaluator map.
         */
        getValueEvaluatorMap() {
            return this._valueEvaluatorMap;
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
         * The callback on the tree document empty event.
         * @protected
         * @override
         */
        _onTreeDocumentEmpty() {
            this._valueEvaluatorMap.clear();
            super._onTreeDocumentEmpty();
        }
        /**
         * Defines the data grid view columns.
         * @protected
         * @override
         */
        _defineColumns() {
            super._defineColumns();
            this._defineOriginColumn();
            this._defineSeverityColumn();
            this._defineTimestampColumn();
            this._defineMessageColumn();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        _defineOriginColumn() {
            this._columns.push({
                dataIndex: 'originIcon',
                text: 'Origin',
                sortableFlag: false,
                typeRepresentation: 'icon',
                minWidth: 30,
                width: 30,
                getCellClassName: cellInfos => {
                    const severity = cellInfos.nodeModel.getAttributeValue('severity');
                    return 'sch-dgv-column-origin' + ' ' + UIDGVDebugConsole._getCellClassNameFromSeverity(severity);
                },
                getCellTooltip: cellInfos => {
                    return { shortHelp: cellInfos.nodeModel.getAttributeValue('originText') };
                }
            });
        }
        /**
         * Defines the data grid view severity column.
         * @private
         */
        _defineSeverityColumn() {
            this._columns.push({
                dataIndex: 'severityIcon',
                text: 'Severity',
                sortableFlag: false,
                typeRepresentation: 'icon',
                minWidth: 30,
                width: 30,
                getCellClassName: cellInfos => {
                    let className = 'sch-dgv-column-severity';
                    if (cellInfos.nodeModel !== undefined) {
                        const severity = cellInfos.nodeModel.getAttributeValue('severity');
                        className += ' ' + UIDGVDebugConsole._getCellClassNameFromSeverity(severity);
                    }
                    return className;
                },
                getCellTooltip: cellInfos => {
                    return { shortHelp: cellInfos.nodeModel.getAttributeValue('severityText') };
                }
            });
        }
        /**
         * Defines the data grid view timestamp column.
         * @private
         */
        _defineTimestampColumn() {
            this._columns.push({
                dataIndex: 'fullTime',
                text: 'Timestamp',
                sortableFlag: false,
                width: 80,
                getCellClassName: cellInfos => {
                    const severity = cellInfos.nodeModel.getAttributeValue('severity');
                    return 'sch-dgv-column-timestamp' + ' ' + UIDGVDebugConsole._getCellClassNameFromSeverity(severity);
                },
                getCellTooltip: cellInfos => {
                    const fullDate = cellInfos.nodeModel.getAttributeValue('fullDate');
                    const fullTime = cellInfos.nodeModel.getAttributeValue('fullTime');
                    return { shortHelp: fullDate + ' ' + fullTime };
                }
            });
        }
        /**
         * Defines the data grid view timestamp column.
         * @private
         */
        _defineMessageColumn() {
            this._columns.push({
                dataIndex: 'message',
                text: 'Message',
                sortableFlag: false,
                allowUnsafeHTMLContent: false,
                autoRowHeightFlag: true,
                typeRepresentation: 'textBlock',
                onCellRequest: this._onMessageCellRequest.bind(this),
                getCellClassName: cellInfos => {
                    const severity = cellInfos.nodeModel.getAttributeValue('severity');
                    return 'sch-dgv-column-message' + ' ' + UIDGVDebugConsole._getCellClassNameFromSeverity(severity);
                }
            });
        }
        /**
         * Gets the cell class name from the given severity.
         * @private
         * @param {ESeverity} severity - The severity.
         * @returns {string} The cell class name corresponding to the given severity.
         */
        static _getCellClassNameFromSeverity(severity) {
            let cellClassName = '';
            if (severity === ModelEnums.ESeverity.eInfo) {
                cellClassName = 'sch-severity-level-info';
            }
            else if (severity === ModelEnums.ESeverity.eDebug) {
                cellClassName = 'sch-severity-level-debug';
            }
            else if (severity === ModelEnums.ESeverity.eWarning) {
                cellClassName = 'sch-severity-level-warning';
            }
            else if (severity === ModelEnums.ESeverity.eError) {
                cellClassName = 'sch-severity-level-error';
            }
            else if (severity === ModelEnums.ESeverity.eSuccess) {
                cellClassName = 'sch-severity-level-success';
            }
            return cellClassName;
        }
        /**
         * Updates the data grid view content.
         * @private
         */
        _updateContent() {
            const dataGridView = this.getWUXDataGridView();
            dataGridView.registerReusableCellContent({
                id: 'reusableCellMessage',
                buildContent: () => UIDom.createElement('div', { className: 'sch-dgv-reusable' })
            });
            // Bug fix for the non resized cell height issue
            dataGridView.onReady(() => {
                dataGridView.layout.resetRowHeights();
                this.scrollToBottom();
            });
            // Prevent default data grid copy/paste behavior!
            dataGridView.setUseClipboardFlag(false);
            //dataGridView.layout.getRowHeightFunction = this.getRowHeightFunction.bind(this);
        }
        /*private _getRowHeightFunction(rowID: number): number {
            let height;
            const nodeModel = this.treeDocument.getNthRoot(rowID);
            const valueEvaluator = this.valueEvaluatorMap.get(nodeModel);
            if (valueEvaluator !== undefined) {
                height = valueEvaluator.getObjectExpandedHeight();
            } else {
                height = this.dataGridView.layout.getRowHeightFromCellContents(rowID);
            }
            return height;
        }*/
        /**
         * The callback on the message cell request.
         * @private
         * @param {IWUXCellInfos} cellInfos - The data grid view cell infos.
         */
        _onMessageCellRequest(cellInfos) {
            const cellView = cellInfos.cellView;
            const message = cellInfos.nodeModel.getAttributeValue('message');
            const dataGridView = this.getWUXDataGridView();
            if (typeof message === 'string') {
                dataGridView.defaultOnCellRequest(cellInfos);
            }
            else {
                let evaluatorElt;
                if (typeof message === 'boolean') {
                    evaluatorElt = UIBasicEvaluator.getInlineBooleanValueElement(message);
                }
                else if (typeof message === 'number') {
                    evaluatorElt = UIBasicEvaluator.getInlineNumberValueElement(message);
                }
                else if (typeof message === 'bigint') {
                    evaluatorElt = UIBasicEvaluator.getInlineBigIntValueElement(message);
                }
                else if (typeof message === 'object' || message === undefined) {
                    let valueEvaluator = this._valueEvaluatorMap.get(cellInfos.nodeModel);
                    if (valueEvaluator === undefined) {
                        valueEvaluator = new UIValueEvaluator(message, {
                            onExpand: () => dataGridView.layout.resetRowHeight(cellInfos.rowID),
                            onCollapse: () => dataGridView.layout.resetRowHeight(cellInfos.rowID)
                        });
                        this._valueEvaluatorMap.set(cellInfos.nodeModel, valueEvaluator);
                    }
                    evaluatorElt = valueEvaluator.getElement();
                }
                if (evaluatorElt !== undefined) {
                    const cellContent = dataGridView.reuseCellContent('reusableCellMessage');
                    cellContent.tooltipInfos = UIWUXTools.createTooltip({ shortHelp: '' });
                    if (cellContent.firstChild) {
                        cellContent.replaceChild(evaluatorElt, cellContent.firstChild);
                    }
                    else {
                        cellContent.appendChild(evaluatorElt);
                    }
                    cellView._setReusableContent(cellContent);
                }
            }
        }
    }
    return UIDGVDebugConsole;
});
