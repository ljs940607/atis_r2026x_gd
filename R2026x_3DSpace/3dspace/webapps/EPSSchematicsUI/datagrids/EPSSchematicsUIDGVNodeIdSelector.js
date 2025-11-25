/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVNodeIdSelector'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVNodeIdSelector", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/EPSSchematicsUIEnums", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/Controls/Button", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVNodeIdSelector"], function (require, exports, UIDataGridView, UIDom, UINLS, UIFontIcon, UIEnums, UIWUXTools, WUXButton) {
    "use strict";
    /**
     * This class defines a UI data grid view nodeId selector.
     * @private
     * @class UIDGVNodeIdSelector
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVNodeIdSelector
     * @extends UIDataGridView
     */
    class UIDGVNodeIdSelector extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graphUI - The UI graph.
         */
        constructor(graphUI) {
            super({
                className: 'sch-datagridview-nodeidselector',
                rowsHeader: false,
                columnsHeader: false,
                columnDragEnabledFlag: false,
                showCellActivationFlag: false,
                cellActivationFeedback: 'none',
                showAlternateBackgroundFlag: false,
                showRowBorderFlag: true,
                cellSelection: 'none',
                rowSelection: 'single',
                treeDocument: graphUI.getNodeIdSelectorController().getTreeDocument()
            });
            this._graphUI = graphUI;
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
            if (this._resizeObserver) {
                this._resizeObserver.unobserve(this._scroller);
            }
            this._graphUI = undefined;
            this._addButton = undefined;
            this._scroller = undefined;
            this._resizeObserver = undefined;
            this._currentNodeIdSelectorId = undefined;
            super.remove();
        }
        /**
         * Gets the current nodeId selector Id.
         * @public
         * @returns {string|undefined} The current nodeId selector Id.
         */
        getCurrentNodeIdSelectorId() {
            return this._currentNodeIdSelectorId;
        }
        /**
         * Sets the current nodeId selector Id.
         * @public
         * @param {string|undefined} nodeIdSelectorId - The current nodeId selector Id.
         */
        setCurrentNodeIdSelectorId(nodeIdSelectorId) {
            this._currentNodeIdSelectorId = nodeIdSelectorId;
        }
        /**
         * Gets the add button.
         * @public
         * @returns {WUXButton} The add button.
         */
        getAddButton() {
            return this._addButton;
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
            this._columns.push({
                dataIndex: 'tree',
                text: UINLS.get('treeListColumnName'),
                sortableFlag: true,
                editableFlag: false,
                width: 'auto',
                typeRepresentation: 'string',
                editionPolicy: 'EditionOnOver',
                getCellClassName: cellInfos => {
                    let className = 'sch-dgv-not-editable';
                    if (cellInfos?.nodeModel?.isRoot()) {
                        const nodeIdSelector = cellInfos.nodeModel.getAttributeValue('nodeIdSelector');
                        className = nodeIdSelector?.isNameSettable() ? '' : className;
                    }
                    return className;
                },
                getCellEditableState: cellInfos => {
                    let editableState = false;
                    if (cellInfos?.nodeModel?.isRoot()) {
                        const nodeIdSelector = cellInfos.nodeModel.getAttributeValue('nodeIdSelector');
                        editableState = nodeIdSelector?.isNameSettable() || false;
                    }
                    return editableState;
                },
                setCellValue: (cellInfos, value) => {
                    const nodeIdSelector = cellInfos?.nodeModel?.getAttributeValue('nodeIdSelector');
                    if (nodeIdSelector) {
                        nodeIdSelector.setName(value);
                        this._graphUI.getEditor().getHistoryController().registerEditNodeIdSelectorAction();
                    }
                }
            });
            this._columns.push({
                dataIndex: 'value',
                text: UINLS.get('treeListColumnValue'),
                sortableFlag: true,
                editableFlag: true,
                editionPolicy: 'EditionOnOver',
                alignment: 'near',
                width: 'auto',
                getCellTypeRepresentation: cellInfos => cellInfos?.nodeModel?.getAttributeValue('typeRepresentation') || 'string',
                setCellValue: (cellInfos, value) => {
                    if (cellInfos.nodeModel) {
                        this._setNodeIdSelectorPropertyValue(cellInfos.nodeModel, value);
                    }
                }
            });
            this._columns.push({
                dataIndex: 'actions',
                typeRepresentation: 'DGVActionBar',
                visibleFlag: true,
                editionPolicy: 'EditionInPlace',
                editableFlag: true,
                width: 40,
                minWidth: 40,
                getCellSemantics: (cellInfos) => {
                    let result = {};
                    if (cellInfos?.nodeModel) {
                        const value = cellInfos.nodeModel.getAttributeValue('value');
                        result = {
                            count: 1,
                            undefinedButtonDefinition: {
                                display: true,
                                index: 0,
                                disabled: value === undefined
                            }
                        };
                    }
                    return result;
                },
                setCellValue: (cellInfos, value) => {
                    if (cellInfos?.nodeModel) {
                        if (value === 'eUndefinedAction') {
                            this._setNodeIdSelectorPropertyValue(cellInfos.nodeModel, undefined);
                            cellInfos.nodeModel.updateOptions({ grid: { value: undefined, actions: {} } });
                        }
                    }
                }
            });
            this._columns.push({
                dataIndex: 'count',
                text: '',
                typeRepresentation: 'string',
                editableFlag: false,
                width: 40,
                minWidth: 40,
                getCellTooltip: cellInfos => {
                    let tooltip;
                    if (cellInfos?.nodeModel?.getAttributeValue('count')) {
                        tooltip = UIWUXTools.createTooltip({
                            title: UINLS.get('nodeIdSelectorCountTitle'),
                            shortHelp: UINLS.get('nodeIdSelectorCountShortHelp'),
                            initialDelay: 500
                        });
                    }
                    return tooltip;
                }
            });
            this._columns.push({
                dataIndex: 'deleteNodeIdSelector',
                text: '',
                typeRepresentation: 'functionIcon',
                width: 40,
                minWidth: 40,
                editionPolicy: 'EditionOnOver',
                sortableFlag: false,
                getCellSemantics: () => { return { icon: UIFontIcon.getWUX3DSIconDefinition('trash') }; },
                getCellClassName: () => 'sch-dgv-column-delete',
                getCellTooltip: cellInfos => {
                    let tooltip;
                    if (cellInfos?.nodeModel?.getAttributeValue('deleteNodeIdSelector')) {
                        tooltip = UIWUXTools.createTooltip({
                            title: UINLS.get('tooltipTitleDeleteNodeIdSelector'),
                            shortHelp: UINLS.get('tooltipShortHelpDeleteNodeIdSelector'),
                            initialDelay: 500
                        });
                    }
                    return tooltip;
                }
            });
            this._columns.push({
                dataIndex: 'color',
                text: UINLS.get('treeListColumnColor'),
                typeRepresentation: 'color',
                width: 40,
                minWidth: 40,
                sortableFlag: false,
                editableFlag: true,
                editionPolicy: 'EditionInPlace',
                alignment: 'center',
                getCellClassName: cellInfos => cellInfos?.nodeModel?.getAttributeValue('nodeIdSelector') ? '' : 'sch-dgv-cell-disabled',
                setCellValue: (cellInfos, value) => {
                    if (cellInfos?.nodeModel) {
                        cellInfos.nodeModel.setAttribute('color', value);
                        this._graphUI.getEditor().getNodeIdSelectorsPanel().colorizeBlocks();
                        this._graphUI.getEditor().getHistoryController().registerEditNodeIdSelectorAction();
                    }
                }
            });
            this._columns.push({
                dataIndex: 'applyNodeIdSelector',
                text: UINLS.get('treeListColumnApply'),
                typeRepresentation: 'functionIcon',
                sortableFlag: false,
                width: 40,
                minWidth: 40,
                alignment: 'center',
                editionPolicy: 'EditionOnOver',
                getCellSemantics: () => { return { icon: UIFontIcon.getWUX3DSIconDefinition('brush') }; },
                getCellClassName: () => 'sch-dgv-column-apply',
                getCellTooltip: () => { return { title: UINLS.get('shortHelpApplyNodeIdSelectorToBlock'), shortHelp: UINLS.get('longHelpApplyNodeIdSelectorToBlock'), initialDelay: 500 }; }
            });
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
         * Initializes the data grid view.
         * @private
         */
        _initialize() {
            this._addButton = new WUXButton({
                emphasize: 'primary',
                icon: 'plus',
                tooltipInfos: UIWUXTools.createTooltip({ title: UINLS.get('createNodeIdSelectorTitle'), shortHelp: UINLS.get('createNodeIdSelectorShortHelp'), initialDelay: 500 }),
                onClick: () => {
                    this._graphUI.getModel().createNodeIdSelector();
                    this._graphUI.getEditor().getHistoryController().registerCreateNodeIdSelectorAction();
                    // Expand the last created nodeId selector
                    const roots = this._treeDocument.getRoots();
                    const lastNodeIdSelector = roots[roots.length - 1];
                    lastNodeIdSelector.expand();
                }
            }).inject(this._dataGridView.elements.scrollContainerRel);
            UIDom.addClassName(this._addButton.getContent(), 'sch-datagridview-addbutton');
            this._scroller = this._dataGridView.elements.scroller.getContent();
            this._scroller.addEventListener('scroll', () => this._updateAddButtonPosition());
            this._resizeObserver = new ResizeObserver(() => this._updateAddButtonPosition());
            this._resizeObserver.observe(this._scroller, {});
        }
        /**
         * Updates the add button position.
         * @private
         */
        _updateAddButtonPosition() {
            const isBottomReached = this._scroller.scrollHeight - this._scroller.scrollTop === this._scroller.clientHeight;
            const addOrRemoveClassName = isBottomReached ? UIDom.addClassName : UIDom.removeClassName;
            addOrRemoveClassName(this._addButton.getContent(), 'sch-addbutton-top');
        }
        /**
         * Sets the nodeId selector propery value.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {any} value - The property value to set.
         */
        _setNodeIdSelectorPropertyValue(nodeModel, value) {
            if (nodeModel) {
                const nodeIdSelector = nodeModel.getAttributeValue('nodeIdSelector');
                if (nodeIdSelector) {
                    const id = nodeModel.getAttributeValue('id');
                    if (id === UIEnums.ENodeIdSelectorProperty.ePool) {
                        nodeIdSelector.setPool(value);
                    }
                    else if (id === UIEnums.ENodeIdSelectorProperty.eCriterion) {
                        value = value === -1 ? undefined : value;
                        nodeIdSelector.setCriterion(value);
                    }
                    else if (id === UIEnums.ENodeIdSelectorProperty.eIdentifier) {
                        nodeIdSelector.setIdentifier(value);
                    }
                    else if (id === UIEnums.ENodeIdSelectorProperty.eQueuing) {
                        nodeIdSelector.setQueuing(value);
                    }
                    else if (id === UIEnums.ENodeIdSelectorProperty.eTimeout) {
                        nodeIdSelector.setTimeout(value);
                    }
                    else if (id === UIEnums.ENodeIdSelectorProperty.eMaxInstanceCount) {
                        nodeIdSelector.setMaxInstanceCount(value);
                    }
                    else if (id === UIEnums.ENodeIdSelectorProperty.eCmdLine) {
                        nodeIdSelector.setCmdLine(value);
                    }
                    nodeModel.setAttribute('value', value);
                    this._graphUI.getEditor().getHistoryController().registerEditNodeIdSelectorAction();
                }
            }
        }
    }
    return UIDGVNodeIdSelector;
});
