/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTypeLibrary'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTypeLibrary", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVTypeLibrary"], function (require, exports, UIDataGridView, UINLS, UIFontIcon, UIWUXTools, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI data grid view type library.
     * @private
     * @class UIDGVTypeLibrary
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTypeLibrary
     * @extends UIDataGridView
     */
    class UIDGVTypeLibrary extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {UITypeLibraryController} controller - The type library controller.
         */
        constructor(editor, controller) {
            super({
                className: 'sch-datagridview-typelibrary',
                treeDocument: controller.getTreeDocument(),
                autoScroll: false,
                columnDragEnabledFlag: false,
                showCellActivationFlag: false,
                cellActivationFeedback: 'none',
                //showCellPreselectionFlag: false,
                showAlternateBackgroundFlag: false,
                showRowBorderFlag: true,
                cellSelection: 'none',
                rowSelection: 'single',
                treeNodeCellOptions: {
                    expanderStyle: 'triangle'
                },
                defaultColumnDef: {
                    width: 'auto',
                    typeRepresentation: 'string'
                },
                placeholder: '',
                rowsHeader: false,
                columnsHeader: false
            });
            this._editor = editor;
            this._controller = controller;
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
            this._controller = undefined;
            super.remove();
        }
        /**
         * Gets the type library controller.
         * @public
         * @returns {UITypeLibraryController} The type library controller.
         */
        getController() {
            return this._controller;
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
                text: 'Type name',
                visibleFlag: true
            });
            this._defineOccurenceColumn();
            this._defineApplyTypeColumn();
            this._defineDeleteColumn();
        }
        /**
         * The callback on the preselected cell change event.
         * @protected
         * @override
         * @param {IWUXDataGridViewEvent} _event - The data grid view event.
         */
        _onPreselectedCellChange(_event) {
            const graph = this._editor.getViewerController().getCurrentViewer().getMainGraph();
            graph.unhighlightCompatibleDataPorts();
            const cellID = this._dataGridView.getPreselectedCellID();
            const cellInfos = this._dataGridView.getCellInfosAt(String(cellID));
            if (cellInfos.nodeModel && !cellInfos.nodeModel.isRoot()) {
                const occurenceReferences = cellInfos.nodeModel.getAttributeValue('occurenceReferences');
                if (occurenceReferences.length > 0) {
                    graph.highlightUIElementsFromModel(occurenceReferences, ModelEnums.ESeverity.eInfo);
                }
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
         * Initializes the data grid view.
         * @private
         */
        _initialize() {
            const myCustomRep = {
                deleteFunction: {
                    stdTemplate: 'functionIcon',
                    semantics: {
                        icon: UIFontIcon.getWUX3DSIconDefinition('trash')
                    }
                }
            };
            this.getWUXDataGridView().getTypeRepresentationFactory().registerTypeRepresentations(JSON.stringify(myCustomRep));
            this._controller.sortTypes();
        }
        /**
         * Defines the data grid view apply type column.
         * @private
         */
        _defineApplyTypeColumn() {
            this._columns.push({
                dataIndex: 'applyType',
                text: 'Apply type', // columnsHeader disabled
                typeRepresentation: 'functionIcon',
                width: 40,
                minWidth: 40,
                editionPolicy: 'EditionOnOver',
                visibleFlag: true,
                //getCellValueAsStringForFind: () => '',
                getCellSemantics: () => { return { icon: UIFontIcon.getWUX3DSIconDefinition('publish') }; },
                getCellTooltip: cellInfos => {
                    let tooltip;
                    const nodeModel = cellInfos.nodeModel;
                    if (nodeModel !== undefined && nodeModel.getAttributeValue('applyType') !== undefined) {
                        tooltip = UIWUXTools.createTooltip({
                            title: UINLS.get('tooltipTitleApplyType'),
                            shortHelp: UINLS.get('tooltipShortHelpTypeLibraryApplyType'),
                            initialDelay: 500
                        });
                    }
                    return tooltip;
                },
                getCellClassName: cellInfos => {
                    let className = 'sch-dgv-column-applytype';
                    const nodeModel = cellInfos.nodeModel;
                    if (nodeModel !== undefined) {
                        const disabled = nodeModel.getAttributeValue('disabled');
                        className += disabled ? ' disabled' : '';
                    }
                    return className;
                }
            });
        }
        /**
         * Defines the data grid view occurence column.
         * @private
         */
        _defineOccurenceColumn() {
            this._columns.push({
                dataIndex: 'occurenceCount',
                text: 'Occurence count', // columnsHeader disabled
                typeRepresentation: 'string',
                editableFlag: false,
                visibleFlag: true,
                width: 40,
                minWidth: 40,
                getCellValue: cellInfos => {
                    const occurenceCount = cellInfos.nodeModel.getAttributeValue('occurenceCount');
                    return occurenceCount > 0 ? occurenceCount : '';
                },
                getCellClassName: cellInfos => {
                    const occurenceCount = cellInfos.nodeModel.getAttributeValue('occurenceCount');
                    return occurenceCount > 0 ? 'sch-dgv-column-occurencecount' : '';
                },
                getCellTooltip: cellInfos => {
                    let tooltip;
                    if (cellInfos.nodeModel.getAttributeValue('occurenceCount') > 0) {
                        tooltip = UIWUXTools.createTooltip({
                            title: UINLS.get('occurenceCountTypeLibraryTitle'),
                            shortHelp: UINLS.get('occurenceCountTypeLibraryShortHelp'),
                            initialDelay: 500
                        });
                    }
                    return tooltip;
                }
            });
        }
        /**
         * Defines the data grid view delete column.
         * @private
         */
        _defineDeleteColumn() {
            this._columns.push({
                dataIndex: 'deleteType',
                text: 'Delete', // columnsHeader disabled
                typeRepresentation: 'deleteFunction',
                alignment: 'center',
                width: 40,
                minWidth: 40,
                editionPolicy: 'EditionInPlace',
                visibleFlag: true,
                //getCellValueAsStringForFind: () => '',
                getCellTooltip: cellInfos => {
                    let tooltip;
                    const nodeModel = cellInfos.nodeModel;
                    if (nodeModel !== undefined && nodeModel.getAttributeValue('deleteType') !== undefined) {
                        tooltip = UIWUXTools.createTooltip({
                            title: UINLS.get('tooltipTitleRemoveUserType'),
                            shortHelp: UINLS.get('tooltipShortHelpRemoveUserType'),
                            longHelp: UINLS.get('tooltipLongHelpRemoveUserType'),
                            initialDelay: 500
                        });
                    }
                    return tooltip;
                },
                getCellClassName: () => 'sch-dgv-column-delete'
            });
        }
    }
    return UIDGVTypeLibrary;
});
