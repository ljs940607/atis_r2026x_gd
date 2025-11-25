/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUITypeLibraryPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUITypeLibraryPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUISplittedPanel", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTypeLibrary", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVCustomType", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUICustomTypeNameDialog", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/Controls/Button", "DS/Controls/Find", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUITypeLibraryPanel"], function (require, exports, UISplittedPanel, UIDom, UIFontIcon, UICommandType, UIDGVTypeLibrary, UIDGVCustomType, UICustomTypeNameDialog, TypeLibrary, Events, ModelEnums, WUXButton, WUXFind, UINLS) {
    "use strict";
    /**
     * This class defines a UI type library panel.
     * @private
     * @class UITypeLibraryPanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUITypeLibraryPanel
     * @extends UISplittedPanel
     */
    class UITypeLibraryPanel extends UISplittedPanel {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                immersiveFrame: editor.getImmersiveFrame(),
                title: UINLS.get('panelTitleTypeLibrary'),
                currentDockArea: editor.getOptions().typeLibraryDockArea,
                width: 420,
                height: 600,
                className: ['sch-typelibrary-panel'],
                icon: UIFontIcon.getWUXIconFromCommand(UICommandType.eOpenTypeLibraryPanel),
                stackInWindowGroup: true
            });
            this._onTypeLibraryUnregisterLocalCustomCB = this._onTypeLibraryUnregisterLocalCustom.bind(this);
            this._typeLibraryController = this._editor.getTypeLibraryController();
            this._treeDocument = this._typeLibraryController.getTreeDocument();
            this._createTypeDialog = new UICustomTypeNameDialog(this._editor, typeName => { this.selectAndEditType(typeName); });
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
         * Removes the panel.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Closes the panel!
            this._createTypeDialog.remove();
            this._typeLibraryController = undefined;
            this._treeDocument = undefined;
            this._createTypeDialog = undefined;
            this._searchControl = undefined;
            this._onTypeLibraryUnregisterLocalCustomCB = undefined;
        }
        /**
         * Selects the provided custom type name.
         * @public
         * @param {string} typeName - The name of the custom type to select.
         */
        selectType(typeName) {
            if (typeName !== undefined && typeName !== '') {
                this.ensureVisible();
                const baseTypeName = TypeLibrary.getArrayValueTypeName(typeName) || typeName;
                const nodeModel = this._typeLibraryController.getTreeNodeModelFromTypeName(baseTypeName, true);
                if (nodeModel !== undefined) {
                    this._selectModelAndUpdateView(nodeModel);
                    this._displayTypeEditor(baseTypeName, false);
                }
            }
        }
        /**
         * Selects and edit the given custom type name.
         * @public
         * @param {string} typeName - The name of the custom type to select and edit.
         */
        selectAndEditType(typeName) {
            if (typeName !== undefined && typeName !== '') {
                this.ensureVisible();
                const nodeModel = this._typeLibraryController.getTreeNodeModelFromTypeName(typeName, false);
                if (nodeModel !== undefined) {
                    this._selectModelAndUpdateView(nodeModel);
                    this._displayTypeEditor(typeName, true);
                }
            }
        }
        /**
         * Opens the create type dialog.
         * @public
         * @param {DataPort} [dataPort] - The data port model to update.
         */
        openCreateTypeDialog(dataPort) {
            this._createTypeDialog.open(dataPort);
        }
        /**
         * Gets the type library data grid view.
         * @public
         * @returns {UIDGVTypeLibrary} The type library data grid view.
         */
        getTypeLibraryDataGridView() {
            return this._dgvTypeLibrary;
        }
        /**
         * Gets the data grid view custom type.
         * @public
         * @returns {UITreeListCustomType|undefined} The data grid view custom type.
         */
        getDataGridViewCustomType() {
            return this._dgvCustomType;
        }
        /**
         * Gets the custom type name dialog.
         * @public
         * @returns {UICustomTypeNameDialog} The custom type name dialog.
         */
        getCustomTypeNameDialog() {
            return this._createTypeDialog;
        }
        /**
         * Gets the create button.
         * @public
         * @returns {WUXButton} The create button.
         */
        getCreateButton() {
            return this._createButton;
        }
        /**
         * Gets the apply button.
         * @public
         * @returns {WUXButton|undefined} The apply button.
         */
        getApplyButton() {
            return this._applyButton;
        }
        /**
         * Gets the edit button.
         * @public
         * @returns {WUXButton|undefined} The edit button.
         */
        getEditButton() {
            return this._editButton;
        }
        /**
         * Gets the WUX find search control.
         * @public
         * @returns {WUXControl} The WUX find search control.
         */
        getSearchControl() {
            return this._searchControl;
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
         * The callback on the panel close event.
         * @protected
         * @override
         */
        _onClose() {
            this._removeTypeEditor();
            TypeLibrary.removeListener(Events.TypeLibraryUnregisterLocalCustomEvent, this._onTypeLibraryUnregisterLocalCustomCB);
            this._treeDocument.getXSO().unsubscribe(this._onChangeEventToken);
            this._onChangeEventToken = undefined;
            if (this._dgvTypeLibrary !== undefined) {
                this._dgvTypeLibrary.remove();
                this._dgvTypeLibrary = undefined;
            }
            if (this._searchControl) {
                this._searchControl.destroy();
                this._searchControl = undefined;
            }
            this._controlsContainer = undefined;
            this._dataGridViewContainer = undefined;
            this._createButton = undefined;
            this._bottomHeader = undefined;
            this._bottomContent = undefined;
            super._onClose();
        }
        /**
         * The callback on the panel open event.
         * @protected
         * @override
         */
        _onOpen() {
            super._onOpen();
            this._typeLibraryController.updateOccurenceCount();
        }
        /**
         * Creates the panel content.
         * @protected
         * @abstract
         */
        _createContent() {
            this._createDockingElement();
            this._createTopContainer();
            this._createBottomContainer();
            TypeLibrary.addListener(Events.TypeLibraryUnregisterLocalCustomEvent, this._onTypeLibraryUnregisterLocalCustomCB);
            this._onChangeEventToken = this._treeDocument.getXSO().onChange(this._onSelectionUpdate.bind(this));
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
         * Creates the top container.
         * @private
         */
        _createTopContainer() {
            this._controlsContainer = UIDom.createElement('div', {
                className: 'sch-panel-controls-container',
                parent: this._panelTopContainer
            });
            this._dataGridViewContainer = UIDom.createElement('div', {
                className: 'sch-panel-dgv-container',
                parent: this._panelTopContainer
            });
            this._dgvTypeLibrary = new UIDGVTypeLibrary(this._editor, this._typeLibraryController);
            this._dataGridViewContainer.appendChild(this._dgvTypeLibrary.getElement());
            this._createButton = new WUXButton({
                label: UINLS.get('shortHelpHistoryCreateCustomType'),
                emphasize: 'primary',
                icon: UIFontIcon.getWUXFAIconDefinition('plus'),
                onClick: () => this.openCreateTypeDialog()
            }).inject(this._controlsContainer);
            const datagridview = this._dgvTypeLibrary.getWUXDataGridView();
            this._searchControl = new WUXFind({
                placeholder: 'Search type',
                displayClose: false,
                displayMatchCaseToggle: false,
                displayNavigationButtons: false,
                relatedWidget: datagridview,
                onFindRequest: () => {
                    const typeName = this._searchControl.findStr;
                    this._searchControl.displayNavigationButtons = typeName !== '';
                    this._searchControl.elements.findEditor.displayClearFieldButtonFlag = typeName !== '';
                    datagridview.showMatchingCellBackgroundFlag = false;
                    datagridview.prepareUpdateView();
                    this._treeDocument.prepareUpdate();
                    this._treeDocument.getFilterManager().setPropertyFilterModel('typeName', {
                        filterId: 'stringRegexp',
                        filterModel: {
                            condition1: { type: 'contains', filter: typeName }
                        }
                    });
                    this._treeDocument.pushUpdate();
                    datagridview.setFindStr(typeName, false);
                    datagridview.pushUpdateView();
                },
                onFindPreviousResult: datagridview.goToPreviousMatchingCell.bind(datagridview),
                onFindNextResult: datagridview.goToNextMatchingCell.bind(datagridview),
                onFindClose: datagridview.closeFind.bind(datagridview)
            }).inject(this._controlsContainer);
        }
        /**
         * Creates the bottom container.
         * @private
         */
        _createBottomContainer() {
            this._bottomHeader = UIDom.createElement('div', {
                className: 'sch-bottom-header',
                textContent: UINLS.get('sectionTypeDocumentation')
            });
            this._panelBottomContainer.appendChild(this._bottomHeader);
            this._bottomContent = UIDom.createElement('div', {
                className: 'sch-bottom-content',
                parent: this._panelBottomContainer
            });
        }
        /**
         * Displays the type editor.
         * @private
         * @param {string} typeName - The name of the type.
         * @param {boolean} [editionEnabled=false] - True to enable the type edition else false.
         */
        _displayTypeEditor(typeName, editionEnabled = false) {
            this._removeTypeEditor();
            this._typeName = typeName;
            this._bottomContentTop = UIDom.createElement('div', {
                className: 'sch-bottom-topcontent',
                parent: this._bottomContent
            });
            this._bottomContentBottom = UIDom.createElement('div', {
                className: 'sch-bottom-bottomcontent',
                parent: this._bottomContent
            });
            this._typeTitle = UIDom.createElement('div', {
                className: 'sch-type-title',
                textContent: 'Type ' + this._typeName
            });
            this._bottomContentTop.appendChild(this._typeTitle);
            this._buttonContainer = UIDom.createElement('div', {
                className: 'sch-panel-button-container',
                parent: this._bottomContentTop
            });
            const graphContext = this._editor._getViewer().getMainGraph().getModel().getGraphContext();
            const isTypeEditable = TypeLibrary.hasLocalCustomType(graphContext, typeName, ModelEnums.FTypeCategory.fAll);
            if (isTypeEditable) {
                if (!editionEnabled) {
                    this._editButton = new WUXButton({
                        label: UINLS.get('shortHelpEditType'),
                        emphasize: 'primary',
                        icon: UIFontIcon.getWUXFAIconDefinition('pencil'),
                        onClick: () => this._displayTypeEditor(this._typeName, true)
                    }).inject(this._buttonContainer);
                }
                else {
                    this._applyButton = new WUXButton({
                        label: UINLS.get('shortHelpApplyType'),
                        emphasize: 'primary',
                        icon: UIFontIcon.getWUXFAIconDefinition('check-circle'),
                        onClick: () => {
                            this._dgvCustomType?.updateTypeLibraryCustomType();
                            this._displayTypeEditor(this._typeName, false);
                            this._editor.getHistoryController().registerEditCustomTypeAction();
                        }
                    }).inject(this._buttonContainer);
                    this._cancelButton = new WUXButton({
                        label: UINLS.get('shortHelpCancelType'),
                        emphasize: 'secondary',
                        icon: UIFontIcon.getWUXFAIconDefinition('times-circle'),
                        onClick: () => this._displayTypeEditor(this._typeName, false)
                    });
                    this._cancelButton.inject(this._buttonContainer);
                }
            }
            const graphModel = this._editor.getGraphModel();
            this._dgvCustomType = new UIDGVCustomType(this._editor, graphModel, typeName, isTypeEditable && editionEnabled);
            this._bottomContentBottom.appendChild(this._dgvCustomType.getElement());
        }
        /**
         * Removes the type editor.
         * @private
         */
        _removeTypeEditor() {
            if (this._bottomContent !== undefined) {
                if (this._dgvCustomType !== undefined) {
                    this._dgvCustomType.remove();
                    this._dgvCustomType = undefined;
                }
                while (this._bottomContent.firstChild) {
                    this._bottomContent.removeChild(this._bottomContent.firstChild);
                }
                this._typeName = undefined;
                this._bottomContentTop = undefined;
                this._bottomContentBottom = undefined;
                this._typeTitle = undefined;
                this._buttonContainer = undefined;
                this._editButton = undefined;
                this._applyButton = undefined;
                this._cancelButton = undefined;
            }
        }
        /**
         * The callback on the type library unregister local custom event.
         * @private
         * @param {Events.TypeLibraryUnregisterLocalCustomEvent} event - The type library unregister local custom event.
         */
        _onTypeLibraryUnregisterLocalCustom() {
            this._removeTypeEditor();
        }
        /**
         * The callback on the tree document selection update event.
         * @private
         */
        _onSelectionUpdate() {
            const selelectedNodeModel = this._treeDocument.getSelectedNodes()[0];
            if (selelectedNodeModel !== undefined && !selelectedNodeModel.isRoot()) {
                const typeName = selelectedNodeModel.getLabel();
                this._displayTypeEditor(typeName, false);
            }
            else {
                this._removeTypeEditor();
            }
        }
        /**
         * Selects the provided node and updates the data grid view.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The tree node model.
         */
        _selectModelAndUpdateView(nodeModel) {
            this._typeLibraryController.getTreeDocument().unselectAll();
            nodeModel.getParent().expand();
            nodeModel.select();
            if (this.isOpen()) {
                this._dgvTypeLibrary.scrollToNode(nodeModel);
            }
            else {
                this.open();
                this._dgvTypeLibrary.registerPostUpdateViewAction(() => this._dgvTypeLibrary.scrollToNode(nodeModel));
            }
        }
    }
    return UITypeLibraryPanel;
});
