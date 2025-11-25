/* eslint-disable class-methods-use-this */
/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXDataGridView", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeDocument", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDataGridView"], function (require, exports, UIDom, WUXDataGridView, WUXTreeNodeModel, WUXTreeDocument) {
    "use strict";
    /**
     * This class defines the UI data grid view.
     * @private
     * @abstract
     * @class UIDataGridView
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView
     */
    class UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {IWUXDataGridViewOptions} options - The data grid view options.
         */
        constructor(options = {}) {
            this._columns = [];
            this._doScroll = true;
            this._callbacks = [];
            this._options = options;
            this._hasTreeDocument = this._options.treeDocument !== undefined;
            this._options.treeDocument = this._hasTreeDocument ? this._options.treeDocument : new WUXTreeDocument({ useAsyncPreExpand: true });
            this._treeDocument = this._options.treeDocument;
            this._isEditable = this._options.isEditable !== undefined ? this._options.isEditable : true;
            this._onCellClickCB = this._onCellClick.bind(this);
            this._onCellDblClickCB = this._onCellDblClick.bind(this);
            this._onPreselectedCellChangeCB = this._onPreselectedCellChange.bind(this);
            this._onPostUpdateViewCB = this.onPostUpdateView.bind(this);
            this._onTreeDocumentAddChildCB = this._onTreeDocumentAddChild.bind(this);
            this._onTreeDocumentEmptyCB = this._onTreeDocumentEmpty.bind(this);
            this._addChildTokenEvent = this._treeDocument.addEventListener('addChild', this._onTreeDocumentAddChildCB);
            this._emptyTokenEvent = this._treeDocument.addEventListener('empty', this._onTreeDocumentEmptyCB);
            this._defineColumns();
            this._createElement();
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
         */
        remove() {
            if (this._treeDocument !== undefined) {
                this._treeDocument.removeEventListener(this._addChildTokenEvent);
                this._treeDocument.removeEventListener(this._emptyTokenEvent);
                if (!this._hasTreeDocument) {
                    this._treeDocument.removeRoots();
                }
            }
            if (this._dataGridView !== undefined) {
                this._dataGridView.removeEventListener('click', this._onCellClickCB);
                this._dataGridView.removeEventListener('dblclick', this._onCellDblClickCB);
                this._dataGridView.removeEventListener('preselectedCellChange', this._onPreselectedCellChangeCB);
                this._dataGridView.destroy();
            }
            this._element = undefined;
            this._dataGridViewcontainer = undefined;
            this._toolbarContainer = undefined;
            this._options = undefined;
            this._columns = undefined;
            this._dataGridView = undefined;
            this._treeDocument = undefined;
            this._hasTreeDocument = undefined;
            this._isEditable = undefined;
            this._doScroll = undefined;
            this._callbacks = undefined;
            this._onCellClickCB = undefined;
            this._onCellDblClickCB = undefined;
            this._onPreselectedCellChangeCB = undefined;
            this._onPostUpdateViewCB = undefined;
            this._onTreeDocumentAddChildCB = undefined;
            this._onTreeDocumentEmptyCB = undefined;
            this._addChildTokenEvent = undefined;
        }
        /**
         * Gets the data grid view element.
         * @public
         * @returns {HTMLDivElement} The data grid view element.
         */
        getElement() {
            return this._element;
        }
        /**
         * Gets the data grid view tree document.
         * @public
         * @returns {WUXTreeDocument} The data grid view tree document.
         */
        getTreeDocument() {
            return this._treeDocument;
        }
        /**
         * Gets the WUX data grid view.
         * @public
         * @returns {WUXDataGridView} The WUX data grid view.
         */
        getWUXDataGridView() {
            return this._dataGridView;
        }
        /**
         * Gets the WUX data grid view columns.
         * @public
         * @returns {IWUXDataGridViewColumn[]} The WUX data grid view columns.
         */
        getWUXDataGridViewColumns() {
            return this._columns;
        }
        /**
         * The callback on the data grid view post update view.
         * @public
         */
        onPostUpdateView() {
            if (this._options.autoScroll && this._doScroll) {
                this.scrollToBottom();
                this._doScroll = false;
            }
            if (this._callbacks.length > 0) {
                this._callbacks.forEach(callback => callback());
                this._callbacks = [];
            }
        }
        /**
         * Scrolls the data grid view to the bottom.
         * @public
         */
        scrollToBottom() {
            const length = this._dataGridView.model.length;
            if (length > 0) {
                this.scrollToNode(this._dataGridView.model[length - 1]);
            }
        }
        /**
         * Scrolls the view to the provided node.
         * @public
         * @param {WUXTreeNodeModel} nodeModel - The tree node model.
         */
        scrollToNode(nodeModel) {
            if (nodeModel !== undefined) {
                const cellIDs = this._dataGridView.layout.getCellsFromNodeModel(nodeModel);
                this._dataGridView.scrollToCellAt({ cellID: cellIDs[0], animate: false });
            }
        }
        /**
         * Registers an action to perform after the post update view.
         * @public
         * @param {function} callback - The callback to register.
         */
        registerPostUpdateViewAction(callback) {
            this._callbacks.push(callback);
        }
        /**
         * Gets the cell Id from the given node model and column Index.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {number} columnIndex - The column index.
         * @returns {number} The corresponding cell Id.
         */
        getCellIdFromNodeModel(nodeModel, columnIndex) {
            const cellsId = this._dataGridView.layout.getCellsFromNodeModel(nodeModel, true);
            return cellsId[columnIndex];
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
         */
        _defineColumns() {
            this._defineTreeColumn();
        }
        /**
         * Creates the data grid view toolbar.
         * @protected
         */
        _createToolbar() {
            this._toolbarContainer = UIDom.createElement('div', {
                className: 'sch-datagridview-toolbar',
                parent: this._element,
                insertBefore: this._dataGridViewcontainer
            });
        }
        /**
         * The callback on the cell click event.
         * @protected
         * @param {MouseEvent} _event - The mouse event.
         * @param {IWUXCellInfos} _cellInfos - The cell infos.
         */
        _onCellClick(_event, _cellInfos) { }
        /**
         * The callback on the cell dblclick event.
         * Handles the expand/collapse of parent node.
         * @protected
         * @param {MouseEvent} event - The dblclick mouse event.
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         */
        _onCellDblClick(event, cellInfos) {
            if (cellInfos && !cellInfos.isHeader && cellInfos.nodeModel /* && typeof cellInfos.cellModel !== 'object'*/) { // To prevent dblclick on button!
                if (cellInfos.nodeModel.isExpanded()) {
                    cellInfos.nodeModel.collapse();
                }
                else {
                    cellInfos.nodeModel.expand();
                }
            }
            event.stopPropagation();
        }
        /**
         * The callback on the preselected cell change event.
         * @protected
         * @param {IWUXDataGridViewEvent} _event - The data grid view event.
         */
        _onPreselectedCellChange(_event) { }
        /**
         * The callback on the tree document empty event.
         * @private
         */
        _onTreeDocumentEmpty() { }
        /**
         * Adds a tree node model to the data grid view.
         * @protected
         * @param {IWUXTreeNodeModelOptions} options - The structured object representing the tree node model to add.
         * @returns {WUXTreeNodeModel} The created tree node model.
         */
        _addTreeNodeModel(options) {
            const nodeModel = new WUXTreeNodeModel(options);
            this._treeDocument.addRoot(nodeModel);
            return nodeModel;
        }
        /**
         * Merges two data grid view options.
         * @protected
         * @static
         * @param {IWUXDataGridViewOptions} options1 - The base options.
         * @param {IWUXDataGridViewOptions} options2 - The options to add.
         * @returns {IWUXDataGridViewOptions} The merged options.
         */
        static _mergeDataGridViewOptions(options1, options2) {
            Object.keys(options2).forEach(_key => {
                const key = _key;
                let value = options2[key];
                if (key === 'className' && options1.className !== undefined) {
                    value = [options1.className, options2.className].flat();
                }
                options1[key] = value;
            });
            return options1;
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
         * Defines the data grid view tree column.
         * @private
         */
        _defineTreeColumn() {
            this._columns.push({
                dataIndex: 'tree',
                text: 'tree',
                visibleFlag: false
            });
        }
        /**
         * Creates the data grid view element.
         * @private
         */
        _createElement() {
            const className = UIDom.mergeClassName('sch-datagridview', this._options.className);
            this._element = UIDom.createElement('div', { className: className });
            this._dataGridViewcontainer = UIDom.createElement('div', { className: 'sch-datagridview-container', parent: this._element });
            this._options.columns = this._columns;
            this._dataGridView = new WUXDataGridView(this._options).inject(this._dataGridViewcontainer);
            this._dataGridView.onPostUpdateView(this._onPostUpdateViewCB);
            this._dataGridView.addEventListener('click', this._onCellClickCB);
            this._dataGridView.addEventListener('dblclick', this._onCellDblClickCB);
            this._dataGridView.addEventListener('preselectedCellChange', this._onPreselectedCellChangeCB);
            if (this._options.rowsHeader === false) {
                this._dataGridView.layout.rowsHeader = false;
            }
            if (this._options.columnsHeader === false) {
                this._dataGridView.layout.columnsHeader = false;
            }
        }
        /**
         * The callback on the tree document add child event.
         * @private
         */
        _onTreeDocumentAddChild() {
            this._doScroll = true;
        }
    }
    return UIDataGridView;
});
