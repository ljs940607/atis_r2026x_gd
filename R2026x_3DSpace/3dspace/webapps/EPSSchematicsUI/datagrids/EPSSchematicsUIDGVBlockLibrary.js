/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVBlockLibrary'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVBlockLibrary", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS"], function (require, exports, UIDataGridView, UIDom, UIFontIcon, UIWUXTools, BlockLibrary, UINLS) {
    "use strict";
    /**
     * This class defines a UI data grid view block library.
     * @private
     * @class UIDGVBlockLibrary
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVBlockLibrary
     * @extends UIDataGridView
     */
    class UIDGVBlockLibrary extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {UIBlockLibraryController} controller - The block library controller.
         * @param {UIBlockLibraryDocView} docView - The block library documentation view.
         */
        constructor(editor, controller, docView) {
            super({
                className: 'sch-datagridview-blocklibrary',
                treeDocument: controller.getTreeDocument(),
                columnDragEnabledFlag: false,
                showCellActivationFlag: false,
                cellActivationFeedback: 'none',
                showAlternateBackgroundFlag: false,
                showRowBorderFlag: true,
                cellSelection: 'none',
                rowSelection: 'single',
                treeNodeCellOptions: {
                    expanderStyle: 'triangle'
                },
                placeholder: UINLS.get('blockLibraryDataGridViewPlaceHolder'),
                rowsHeader: false,
                columnsHeader: false,
                cellDragEnabledFlag: true,
                onDragStartCell: (event, dragInfos) => {
                    const isReadOnly = this._editor.getViewerController().getCurrentViewer().isReadOnly();
                    return UIDGVBlockLibrary._onBlockDragStart(event, dragInfos, isReadOnly);
                },
                onDragOverCell: UIDGVBlockLibrary._onPreventCellDrag,
                onDragEnterCell: UIDGVBlockLibrary._onPreventCellDrag,
                onDragLeaveCell: UIDGVBlockLibrary._onPreventCellDrag,
                onDragEndCell: UIDGVBlockLibrary._onPreventCellDrag,
                onDropCell: UIDGVBlockLibrary._onPreventCellDrag,
                onDragOverBlank: UIDGVBlockLibrary._onPreventCellDrag,
                onDropBlank: UIDGVBlockLibrary._onPreventCellDrag
            });
            this._editor = editor;
            this._controller = controller;
            this._docView = docView;
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
            this._docView = undefined;
            super.remove();
        }
        /**
         * Selects the block with specified Uid.
         * @public
         * @param {string} blockUid - The block Uid.
         */
        selectBlock(blockUid) {
            const block = BlockLibrary.getBlock(blockUid);
            if (block !== undefined) {
                const category = block.getCategory();
                const categoryPaths = category.split('/');
                // Expand the treeView to the last category
                const categoryNode = this._expandToPath(this._controller.getTreeDocument(), categoryPaths);
                if (categoryNode !== undefined) {
                    // Find the block by uid
                    const blockNode = categoryNode.getChildren().find(node => node.getAttributeValue('isBlock') && node.getAttributeValue('value') === blockUid);
                    if (blockNode !== undefined) {
                        this.scrollToNode(blockNode);
                        blockNode.select();
                        this._docView.displayBlockDocumentation(blockUid);
                    }
                }
            }
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
                visibleFlag: true,
                getCellTooltip: cellInfos => {
                    let tooltip;
                    if (cellInfos?.nodeModel) {
                        const isBlock = cellInfos.nodeModel.getAttributeValue('isBlock');
                        if (isBlock) {
                            tooltip = UIWUXTools.createTooltip({
                                title: UINLS.get('addBlockToGraphTitle'),
                                shortHelp: UINLS.get('addBlockToGraphShortHelp'),
                                initialDelay: 500
                            });
                        }
                    }
                    return tooltip;
                }
            });
            this._defineFavoriteColumn();
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
                const isBlock = cellInfos.nodeModel.getAttributeValue('isBlock');
                if (isBlock) {
                    const blockUid = cellInfos.nodeModel.getAttributeValue('value');
                    this._docView.displayBlockDocumentation(blockUid);
                }
                else {
                    const categoryName = cellInfos.nodeModel.getLabel();
                    const fullCategoryName = cellInfos.nodeModel.getAttributeValue('value');
                    this._docView.displayCategoryDocumentation(categoryName, fullCategoryName);
                }
            }
        }
        /**
         * The callback on the cell dblclick event.
         * Handles the expand/collapse of parent node.
         * @protected
         * @override
         * @param {MouseEvent} event - The dblclick mouse event.
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         */
        _onCellDblClick(event, cellInfos) {
            if (cellInfos !== undefined) {
                const isReadOnly = this._editor.getViewerController().getCurrentViewer().isReadOnly();
                if (!isReadOnly) {
                    const isBlock = cellInfos.nodeModel.getAttributeValue('isBlock');
                    if (isBlock) {
                        const blockUid = cellInfos.nodeModel.getAttributeValue('value');
                        const lastOpenedViewer = this._editor.getViewerController().getCurrentViewer();
                        const graph = lastOpenedViewer.getMainGraph();
                        const block = graph.createBlockInMiddle(blockUid);
                        block?.automaticExpandDataPorts();
                    }
                }
            }
            super._onCellDblClick(event, cellInfos);
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
         * Defines the favorite column.
         * @private
         */
        _defineFavoriteColumn() {
            this._columns.push({
                dataIndex: 'favoriteIcon',
                text: 'Favorite', // columnsHeader disabled
                typeRepresentation: 'functionIcon',
                width: 40,
                minWidth: 40,
                editionPolicy: 'EditionOnOver',
                visibleFlag: true,
                getCellSemantics: cellInfos => {
                    const semantics = {};
                    const nodeModel = cellInfos.nodeModel;
                    if (nodeModel !== undefined && nodeModel.getAttributeValue('favoriteIcon') !== undefined) {
                        const isFavorite = nodeModel.getAttributeValue('isFavorite');
                        semantics.icon = UIFontIcon.getWUX3DSIconDefinition(isFavorite ? 'favorite-on' : 'favorite-off');
                    }
                    return semantics;
                },
                getCellTooltip: cellInfos => {
                    let tooltip;
                    const nodeModel = cellInfos.nodeModel;
                    if (nodeModel && nodeModel.getAttributeValue('favoriteIcon') !== undefined) {
                        const isFavorite = nodeModel.getAttributeValue('isFavorite');
                        tooltip = UIWUXTools.createTooltip({
                            title: UINLS.get(isFavorite ? 'removeBlockFromFavoritesTitle' : 'addBlockToFavoritesTitle'),
                            shortHelp: UINLS.get(isFavorite ? 'removeBlockFromFavoritesShortHelp' : 'addBlockToFavoritesShortHelp'),
                            initialDelay: 500
                        });
                    }
                    return tooltip;
                }
            });
        }
        /**
         * Expands the tree document to the provided category path.
         * @private
         * @param {WUXTreeNodeModel|WUXTreeDocument} root - The tree node model to expand.
         * @param {string[]} paths - The category paths.
         * @param {string} [path] - The current category path.
         * @returns {WUXTreeNodeModel} The deeped expanded category tree node model.
         */
        _expandToPath(root, paths, path) {
            if (root !== undefined && paths.length > 0) {
                const children = root.getChildren() || [];
                if (path !== undefined) {
                    path += '/' + paths.shift();
                }
                else {
                    path = paths.shift();
                }
                const child = children.find(node => !node.getAttributeValue('isBlock') && node.getAttributeValue('value') === path);
                if (child !== undefined) {
                    child.expand();
                    root = this._expandToPath(child, paths, path);
                }
            }
            return root;
        }
        /**
         * The callback on the block drag start event.
         * @private
         * @static
         * @param {DragEvet} event - The drag start event.
         * @param {IWUXCellInfos} dragInfos - The drag infos.
         * @param {boolean} isReadOnly - Whether the drag is read-only.
         * @returns {boolean} True to call the default implementation else false.
         */
        static _onBlockDragStart(event, dragInfos, isReadOnly) {
            if (dragInfos && dragInfos.nodeModel) {
                const isBlock = dragInfos.nodeModel.getAttributeValue('isBlock');
                if (isBlock && !isReadOnly) {
                    const blockUid = dragInfos.nodeModel.getAttributeValue('value');
                    const jsonForDrop = '{"uid": "' + blockUid + '" }';
                    event.dataTransfer?.setData('droppedElement', jsonForDrop);
                    const ghost = UIDom.createElement('div', {
                        className: 'sch-dgv-dnd-block',
                        textContent: dragInfos.nodeModel.getLabel(),
                        parent: document.body
                    });
                    const bbox = UIDom.getComputedStyleBBox(ghost);
                    event.dataTransfer?.setDragImage(ghost, bbox.width / 2, bbox.height / 2);
                    setTimeout(() => document.body.removeChild(ghost));
                }
                else {
                    event.preventDefault();
                }
            }
            return false;
        }
        /**
         * THe callback to prevent cell drag event.
         * @private
         * @static
         * @param {DragEvet} event - The drag event.
         * @returns {boolean} True to call the default implementation else false.
         */
        static _onPreventCellDrag(event) {
            event.preventDefault();
            return false;
        }
    }
    return UIDGVBlockLibrary;
});
