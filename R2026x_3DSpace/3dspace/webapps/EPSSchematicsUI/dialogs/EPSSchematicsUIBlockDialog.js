/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBlockDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBlockDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUITemporaryModelDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/Controls/Tab", "DS/Controls/LineEditor", "DS/Controls/Button", "DS/EPSSchematicsUI/typings/WebUX/controls/EPSWUXComboBox", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVControlPorts", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataPorts", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSettings", "DS/CoreBase/WebUXGlobalEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIBlockDialog"], function (require, exports, UITemporaryModelDialog, UIDom, UIFontIcon, UITools, UIWUXTools, UINLS, WUXTab, WUXLineEditor, WUXButton, WUXComboBox, Events, UIDGVControlPorts, UIDGVDataPorts, UIDGVSettings, WebUXGlobalEnums_1, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI block dialog.
     * @private
     * @class UIBlockDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBlockDialog
     * @extends UITemporaryModelDialog
     */
    class UIBlockDialog extends UITemporaryModelDialog {
        /**
         * @public
         * @constructor
         * @param {UIBlock} block - The UI block.
         * @param {IWUXDialogOptions} [options] - The dialog options.
         */
        constructor(block, options) {
            super(block.getEditor(), block, UITools.mergeObjectConcatArray({
                className: ['sch-block-dialog'],
                immersiveFrame: block.getEditor().getImmersiveFrame(),
                width: 700, minWidth: 400, height: 500,
                icon: 'cog'
            }, (options || {})));
            this._updateControlPortsTabLabelCB = this._updateControlPortsTabLabel.bind(this);
            this._updateDataPortsTabLabelCB = this._updateDataPortsTabLabel.bind(this);
            this._updateSettingsTabLabelCB = this._updateSettingsTabLabel.bind(this);
            this._block = block;
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
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Closes the dialog!
            this._block = undefined;
            this._blockNameLineEditor = undefined;
            this._blockDescriptionLineEditor = undefined;
            this._nodeIdSelectorComboBox = undefined;
            this._nodeIdSelectorUndefinedButton = undefined;
            this._tab = undefined;
            this._controlPortsTab = undefined;
            this._dataPortsTab = undefined;
            this._settingsTab = undefined;
            this._dgvControlPorts = undefined;
            this._dgvDataPorts = undefined;
            this._dgvSettings = undefined;
            this._updateControlPortsTabLabelCB = undefined;
            this._updateDataPortsTabLabelCB = undefined;
            this._updateSettingsTabLabelCB = undefined;
        }
        /**
         * Gets the WUX tab.
         * @public
         * @returns {WUXTab} The WUX tab.
         */
        getTab() {
            return this._tab;
        }
        /**
         * Gets the data grid view data port.
         * @public
         * @returns {UIDGVDataPorts} The data grid view data port.
         */
        getDataGridViewDataPorts() {
            return this._dgvDataPorts;
        }
        /**
         * Gets the data grid view control ports.
         * @public
         * @returns {UIDGVControlPorts} The data grid view control ports.
         */
        getDataGridViewControlPorts() {
            return this._dgvControlPorts;
        }
        /**
         * Gets the data grid view settings.
         * @public
         * @returns {UIDGVSettings} The data grid view settings.
         */
        getDataGridViewSettings() {
            return this._dgvSettings;
        }
        /**
         * Gets the nodeId selector comobobox.
         * @public
         * @returns {WUXComboBox|undefined} The nodeId selector comobobox.
         */
        getNodeIdSelectorCombobox() {
            return this._nodeIdSelectorComboBox;
        }
        /**
         * Gets the nodeId selector undefined button.
         * @public
         * @returns {WUXButton|undefined} The nodeId selector undefined button.
         */
        getNodeIdSelectorUndefinedButton() {
            return this._nodeIdSelectorUndefinedButton;
        }
        /**
         * Gets the block name WUX line editor.
         * @public
         * @returns {WUXLineEditor|undefined} The block name WUX line editor.
         */
        getBlockNameLineEditor() {
            return this._blockNameLineEditor;
        }
        /**
         * Gets the block description WUX line editor.
         * @public
         * @returns {WUXLineEditor|undefined} The block description WUX line editor.
         */
        getBlockDescriptionLineEditor() {
            return this._blockDescriptionLineEditor;
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
         * Computes the dialog title.
         * @protected
         * @returns {string} The dialog title.
         */
        _computeTitle() {
            return UINLS.get('dialogTitleBlockConfiguration', { blockName: this._block.getModel().getName() });
        }
        /**
         * The callback on the dialog close event.
         * @protected
         * @override
         */
        _onClose() {
            this._blockNameLineEditor = undefined;
            this._blockDescriptionLineEditor = undefined;
            this._nodeIdSelectorComboBox = undefined;
            this._tab = undefined;
            this._controlPortsTab = undefined;
            this._dataPortsTab = undefined;
            this._settingsTab = undefined;
            if (this._dgvControlPorts) {
                this._dgvControlPorts.remove();
                this._dgvControlPorts = undefined;
            }
            if (this._dgvDataPorts) {
                this._dgvDataPorts.remove();
                this._dgvDataPorts = undefined;
            }
            if (this._dgvSettings) {
                this._dgvSettings.remove();
                this._dgvSettings = undefined;
            }
            if (this._tmpModel) {
                this._tmpModel.removeListener(Events.ControlPortAddEvent, this._updateControlPortsTabLabelCB);
                this._tmpModel.removeListener(Events.ControlPortRemoveEvent, this._updateControlPortsTabLabelCB);
                this._tmpModel.removeListener(Events.DataPortAddEvent, this._updateDataPortsTabLabelCB);
                this._tmpModel.removeListener(Events.DataPortRemoveEvent, this._updateDataPortsTabLabelCB);
                this._tmpModel.removeListener(Events.SettingAddEvent, this._updateSettingsTabLabelCB);
                this._tmpModel.removeListener(Events.SettingRemoveEvent, this._updateSettingsTabLabelCB);
            }
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            this._dialog.title = this._computeTitle();
            this._createNameLineEditor();
            this._createDescriptionLineEditor();
            this._createNodeIdSelectorComboBox();
            this._createTab();
            this._tmpModel.addListener(Events.ControlPortAddEvent, this._updateControlPortsTabLabelCB);
            this._tmpModel.addListener(Events.ControlPortRemoveEvent, this._updateControlPortsTabLabelCB);
            this._tmpModel.addListener(Events.DataPortAddEvent, this._updateDataPortsTabLabelCB);
            this._tmpModel.addListener(Events.DataPortRemoveEvent, this._updateDataPortsTabLabelCB);
            this._tmpModel.addListener(Events.SettingAddEvent, this._updateSettingsTabLabelCB);
            this._tmpModel.addListener(Events.SettingRemoveEvent, this._updateSettingsTabLabelCB);
            const isReadOnly = this._block.getViewer().isReadOnly();
            this._dialog.icon = isReadOnly ? {
                iconName: 'lock',
                fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome
            } : '';
            // Display debug icon
            const isDebuggable = UITools.isBlockDataPortDebuggable(this._editor, this._block.getModel());
            this._dialog.icon = isDebuggable ? 'bug' : this._dialog.icon;
            const titleBar = this._dialog.getTitleBar();
            UIDom.addClassName(titleBar, isDebuggable ? 'sch-windows-dialog-debug' : '');
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            if (UITools.isBlockDataPortDebuggable(this._editor, this._block.getModel())) {
                const options = this._editor.getOptions();
                if (options?.playCommands?.callbacks?.onBreakBlockDataChange) {
                    const fromDebugByDataPortPath = new Map();
                    this._dgvDataPorts.getTreeDocument().getRoots()[0].getChildren().forEach(root => {
                        const dataPort = root.getAttributeValue('dataPort');
                        const fromDebug = root.getAttributeValue('fromDebug');
                        fromDebugByDataPortPath.set(dataPort.toPath(), fromDebug);
                    });
                    const dataPorts = this._tmpModel.getDataPorts([ModelEnums.EDataPortType.eInput, ModelEnums.EDataPortType.eInputExternal]);
                    const breakBlockData = UITools.getBreakBlockData(this._editor, dataPorts, fromDebugByDataPortPath);
                    options.playCommands.callbacks.onBreakBlockDataChange(breakBlockData);
                }
                super._onOk();
            }
            else {
                super._onOk();
                const isReadOnly = this._block.getViewer().isReadOnly();
                if (!isReadOnly) {
                    this._editor.getHistoryController().registerEditAction(this._block);
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
         * Creates the block name line editor.
         * @private
         */
        _createNameLineEditor() {
            if (this._tmpModel.isNameSettable()) {
                const isReadOnly = this._block.getViewer().isReadOnly();
                const blockNameLabel = UIDom.createElement('label', {
                    className: 'sch-label-property',
                    parent: this._content,
                    children: [UIDom.createElement('span', { textContent: UINLS.get('labelBlockName') })]
                });
                this._blockNameLineEditor = new WUXLineEditor({
                    placeholder: UINLS.get('placeholderEnterValidBlockName'),
                    requiredFlag: true,
                    pattern: '',
                    value: this._tmpModel.getName(),
                    disabled: isReadOnly
                }).inject(blockNameLabel);
                this._blockNameLineEditor.addEventListener('change', (event) => {
                    const name = event.dsModel.value.trim();
                    if (this._blockNameLineEditor) {
                        this._blockNameLineEditor.value = name;
                    }
                    if (name !== '') {
                        this._tmpModel.setName(name);
                    }
                });
            }
        }
        /**
         * Creates the block description line editor.
         * @private
         */
        _createDescriptionLineEditor() {
            if (this._tmpModel.isDescriptionSettable()) {
                const isReadOnly = this._block.getViewer().isReadOnly();
                const blockDescriptionLabel = UIDom.createElement('label', {
                    className: 'sch-label-property',
                    parent: this._content,
                    children: [UIDom.createElement('span', { textContent: UINLS.get('labelBlockDescription') })]
                });
                this._blockDescriptionLineEditor = new WUXLineEditor({
                    placeholder: UINLS.get('placeholderEnterBlockDescription'),
                    requiredFlag: false,
                    pattern: '',
                    value: this._tmpModel.getDescription(),
                    disabled: isReadOnly
                }).inject(blockDescriptionLabel);
                this._blockDescriptionLineEditor.addEventListener('change', (event) => {
                    const description = event.dsModel.value.trim();
                    if (this._blockDescriptionLineEditor) {
                        this._blockDescriptionLineEditor.value = description;
                    }
                    if (description !== '') {
                        this._tmpModel.setDescription(description);
                    }
                });
            }
        }
        /**
         * Creates the nodeId selector combobox.
         * @private
         */
        _createNodeIdSelectorComboBox() {
            if (this._tmpModel.isNodeIdSelectorSettable()) {
                const container = UIDom.createElement('div', {
                    className: 'sch-nodeid-container',
                    parent: this._content
                });
                const nodeIdSelectorLabel = UIDom.createElement('label', {
                    className: 'sch-label-property',
                    parent: container,
                    children: [UIDom.createElement('span', { textContent: UINLS.get('categoryNodeIdSelector') })]
                });
                const nodeIdSelectorList = this._tmpModel.getAllowedNodeIdSelectors();
                const nodeIdSelector = this._tmpModel.getNodeIdSelector();
                const isReadOnly = this._block.getViewer().isReadOnly();
                this._nodeIdSelectorComboBox = new WUXComboBox({
                    elementsList: UITools.getWUXComboListFromArray(nodeIdSelectorList, 'object-related'),
                    placeholder: UINLS.get('placeholderSelectNodeIdSelector'),
                    reachablePlaceholderFlag: true,
                    currentValue: nodeIdSelector,
                    enableSearchFlag: false,
                    disabled: isReadOnly
                }).inject(nodeIdSelectorLabel);
                this._nodeIdSelectorComboBox.addEventListener('change', (event) => {
                    if (event.dsModel) {
                        const value = event.dsModel.value;
                        this._tmpModel.setNodeIdSelector(value);
                        if (this._nodeIdSelectorUndefinedButton) {
                            this._nodeIdSelectorUndefinedButton.disabled = value === undefined;
                        }
                    }
                });
                this._nodeIdSelectorUndefinedButton = new WUXButton({
                    icon: UIFontIcon.getWUX3DSIconDefinition('math-null-sign'),
                    tooltipInfos: UIWUXTools.createTooltip({
                        title: UINLS.get('setDefaultValueToUndefinedTitle'),
                        shortHelp: UINLS.get('setDefaultValueToUndefinedShortHelp'),
                        initialDelay: 200
                    }),
                    disabled: nodeIdSelector === undefined || isReadOnly,
                    onClick: () => {
                        if (this._nodeIdSelectorComboBox) {
                            this._nodeIdSelectorComboBox.value = undefined;
                        }
                        this._tmpModel.setNodeIdSelector(undefined);
                        if (this._nodeIdSelectorUndefinedButton) {
                            this._nodeIdSelectorUndefinedButton.disabled = true;
                        }
                    }
                }).inject(container);
            }
        }
        /**
         * Creates the tab dialog.
         * @private
         */
        _createTab() {
            const isReadOnly = this._block.getViewer().isReadOnly();
            this._tab = new WUXTab({
                reorderFlag: false,
                showComboBoxFlag: true,
                pinFlag: false,
                editableFlag: true,
                multiSelFlag: true,
                displayStyle: 'strip',
                allowUnsafeHTMLOnTabButton: false
            }).inject(this._content);
            this._controlPortsTab = UIDom.createElement('div', { className: 'sch-controls-tab' });
            this._tab.add({
                index: 0,
                label: UINLS.get('categoryControlPorts'),
                isSelected: true,
                content: this._controlPortsTab,
                icon: UIFontIcon.getWUX3DSIconDefinition('parameter-mapping')
            });
            this._dgvControlPorts = new UIDGVControlPorts(this._editor, this._tmpModel, isReadOnly);
            this._controlPortsTab.appendChild(this._dgvControlPorts.getElement());
            this._updateControlPortsTabLabel();
            this._dataPortsTab = UIDom.createElement('div', { className: 'sch-controls-tab' });
            this._tab.add({
                index: 1,
                label: UINLS.get('categoryDataPorts'),
                isSelected: false,
                content: this._dataPortsTab,
                icon: UIFontIcon.getWUX3DSIconDefinition('flow-tree')
            });
            this._dgvDataPorts = new UIDGVDataPorts(this._editor, this._tmpModel, isReadOnly);
            this._dataPortsTab.appendChild(this._dgvDataPorts.getElement());
            this._updateDataPortsTabLabel();
            this._settingsTab = UIDom.createElement('div', { className: 'sch-controls-tab' });
            this._tab.add({
                index: 2,
                label: UINLS.get('categorySettings'),
                isSelected: false,
                content: this._settingsTab,
                icon: UIFontIcon.getWUXFAIconDefinition('cogs')
            });
            this._dgvSettings = new UIDGVSettings(this._editor, this._tmpModel, isReadOnly);
            this._settingsTab.appendChild(this._dgvSettings.getElement());
            this._updateSettingsTabLabel();
            this._tab.tabBar.centeredFlag = false;
        }
        /**
         * Updates the control ports count in the tab label.
         * @private
         */
        _updateControlPortsTabLabel() {
            const count = this._tmpModel.getControlPorts().length;
            this._tab.tabBar.updateTab(0, { label: UINLS.get('categoryControlPorts') + ' (' + count + ')' });
        }
        /**
         * Updates the data ports count in the tab label.
         * @private
         */
        _updateDataPortsTabLabel() {
            const count = this._tmpModel.getDataPorts().length;
            this._tab.tabBar.updateTab(1, { label: UINLS.get('categoryDataPorts') + ' (' + count + ')' });
        }
        /**
         * Updates the settings count in the tab label.
         * @private
         */
        _updateSettingsTabLabel() {
            const count = this._tmpModel.getSettings().length;
            this._tab.tabBar.updateTab(2, { label: UINLS.get('categorySettings') + ' (' + count + ')' });
        }
    }
    return UIBlockDialog;
});
