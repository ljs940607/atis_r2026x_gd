/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUIBlockLibraryPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUIBlockLibraryPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUISplittedPanel", "DS/EPSSchematicsUI/panels/views/EPSSchematicsUIBlockLibraryDocView", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVBlockLibrary", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/Controls/ProgressBar", "DS/EPSSchematicsUI/typings/WebUX/controls/EPSWUXComboBox", "DS/Controls/TabBar", "DS/Controls/LineEditor", "DS/Controls/Expander", "DS/Controls/ButtonGroup", "DS/Controls/Button", "DS/EPSSchematicsUI/EPSSchematicsUIEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUIBlockLibraryPanel"], function (require, exports, UISplittedPanel, UIBlockLibraryDocView, UIBlockLibraryController, UIDGVBlockLibrary, UIFontIcon, UICommandType, UIDom, UINLS, UIWUXTools, WUXProgressBar, WUXComboBox, WUXTabBar, WUXLineEditor, WUXExpander, WUXButtonGroup, WUXButton, UIEnums, ModelEnums, TypeLibrary, BlockLibrary) {
    "use strict";
    // TODO: BlockLibrary: Change color of text highlight!
    /**
     * This class defines a UI block library panel.
     * @private
     * @class UIBlockLibraryPanel2
     * @alias module:DS/EPSSchematicsUI/panels/UIBlockLibraryPanel2
     * @extends UISplittedPanel
     */
    class UIBlockLibraryPanel extends UISplittedPanel {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                immersiveFrame: editor.getImmersiveFrame(),
                title: UINLS.get('panelTitleBlockLibrary'),
                width: 500,
                height: 900,
                currentDockArea: editor.getOptions().blockLibraryDockArea,
                className: ['sch-blocklibrary-panel'],
                icon: UIFontIcon.getWUXIconFromCommand(UICommandType.eOpenBlockLibrary),
                stackInWindowGroup: true
            });
            this._isDocumentationLoaded = false;
            this._matchBlock = false;
            this._matchCategory = false;
            this._onSearchLineEditorValueChangeCB = this._onSearchLineEditorValueChange.bind(this);
            this._onSearchComboBoxValueChangeCB = this._onSearchComboBoxValueChange.bind(this);
            this._onButtonGroupEntityValueChangeCB = this._onButtonGroupEntityValueChange.bind(this);
            this._onButtonGroupPortOrPropertyValueChangeCB = this._onButtonGroupPortOrPropertyValueChange.bind(this);
            this._onTabButtonClickCB = this._onTabButtonClick.bind(this);
            this._preventEmptyButtonGroupPropertiesCB = UIBlockLibraryPanel._preventEmptyButtonGroupProperties.bind(this);
            this._editor = editor;
            this._blockLibraryController = new UIBlockLibraryController(this._editor);
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
            this._blockLibraryController.remove();
            this._blockLibraryController = undefined;
            this._matchBlock = undefined;
            this._matchCategory = undefined;
            this._onSearchLineEditorValueChangeCB = undefined;
            this._onSearchComboBoxValueChangeCB = undefined;
            this._onButtonGroupEntityValueChangeCB = undefined;
            this._onButtonGroupPortOrPropertyValueChangeCB = undefined;
            this._onTabButtonClickCB = undefined;
            this._preventEmptyButtonGroupPropertiesCB = undefined;
        }
        /**
         * Gets the block library search line editor.
         * @public
         * @returns {WUXLineEditor} The block library search line editor.
         */
        getSearchLineEditor() {
            return this._searchLineEditor;
        }
        /**
         * Gets the block library search combo box.
         * @public
         * @returns {WUXComboBox} The block library search combo box.
         */
        getSearchComboBox() {
            return this._searchComboBox;
        }
        /**
         * Gets the block library data grid view.
         * @public
         * @returns {UIDGVBlockLibrary} The block library data grid view.
         */
        getBlockLibraryDataGridView() {
            return this._dgvBlockLibrary;
        }
        /**
         * Gets the block library documentation view.
         * @public
         * @returns {UIBlockLibraryDocView} The block library documentation view.
         */
        getBlockLibraryDocumentationView() {
            return this._docView;
        }
        /**
         * Gets the button group entity.
         * @public
         * @returns {WUXButtonGroup} The button group entity.
         */
        getButtonGroupEntity() {
            return this._buttonGroupEntity;
        }
        /**
         * Gets the button group port.
         * @public
         * @returns {WUXButtonGroup} The button group port.
         */
        getButtonGroupPort() {
            return this._buttonGroupPort;
        }
        /**
         * Gets the button group property.
         * @public
         * @returns {WUXButtonGroup} The button group property.
         */
        getButtonGroupProperty() {
            return this._buttonGroupProperty;
        }
        getTabBar() {
            return this._tabBar;
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
            this._removeProgressBar();
            this._clearButtonGroup(this._buttonGroupPort);
            this._clearButtonGroup(this._buttonGroupProperty);
            if (this._docView) {
                this._docView.remove();
                this._docView = undefined;
            }
            if (this._dgvBlockLibrary) {
                this._dgvBlockLibrary.remove();
                this._dgvBlockLibrary = undefined;
            }
            if (this._searchLineEditor) {
                this._searchLineEditor.removeEventListener('uncommittedChange', this._onSearchLineEditorValueChangeCB, false);
                this._searchLineEditor.removeEventListener('change', this._onSearchLineEditorValueChangeCB, false);
                this._searchLineEditor = undefined;
            }
            if (this._searchComboBox) {
                this._searchComboBox.removeEventListener('uncommittedChange', this._onSearchComboBoxValueChangeCB, false);
                this._searchComboBox.removeEventListener('change', this._onSearchComboBoxValueChangeCB, false);
                this._searchComboBox = undefined;
            }
            if (this._buttonGroupEntity) {
                this._buttonGroupEntity.removeEventListener('change', this._onButtonGroupEntityValueChangeCB, false);
                this._buttonGroupEntity = undefined;
            }
            if (this._buttonGroupPort) {
                this._buttonGroupPort.removeEventListener('change', this._onButtonGroupPortOrPropertyValueChangeCB, false);
                this._buttonGroupPort = undefined;
            }
            if (this._buttonGroupProperty) {
                this._buttonGroupProperty.removeEventListener('change', this._onButtonGroupPortOrPropertyValueChangeCB, false);
                this._buttonGroupProperty = undefined;
            }
            if (this._tabBar) {
                this._tabBar.removeEventListener('tabButtonClick', this._onTabButtonClickCB);
                this._tabBar.remove();
                this._tabBar = undefined;
            }
            this._dgvContainer = undefined;
            this._isDocumentationLoaded = false;
            super._onClose();
        }
        /**
         * The callback on the panel open event.
         * @protected
         * @override
         */
        _onOpen() {
            BlockLibrary.loadDocumentation(() => {
                if (!this._isDocumentationLoaded) {
                    this._onDocumentationLoaded();
                }
                super._onOpen();
            });
        }
        /**
         * Creates the panel content.
         * @protected
         */
        _createContent() {
            this._createProgressBar();
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
         * Creates a panel progress bar.
         * @private
         */
        _createProgressBar() {
            if (!this._progressBar) {
                this._progressBar = new WUXProgressBar({
                    infiniteFlag: true,
                    displayStyle: 'lite',
                    shape: 'circular'
                }).inject(this.getContent());
            }
        }
        /**
         * Removes the panel progress bar.
         * @private
         */
        _removeProgressBar() {
            if (this._progressBar) {
                this._progressBar.remove();
                this._progressBar = undefined;
            }
        }
        /**
         * The callback on the documentation loaded event.
         * @private
         */
        _onDocumentationLoaded() {
            this._blockLibraryController.initializeController();
            this._removeProgressBar();
            this._createDockingElement();
            this._createSearchLineEditor();
            this._createSearchComboBox();
            this._createAdvancedSearchExpander();
            this._docView = new UIBlockLibraryDocView(this._editor, this._panelBottomContainer);
            this._createDGVBlockLibrary();
            this._onButtonGroupEntityValueChange();
            this._isDocumentationLoaded = true;
        }
        /**
         * Creates the search line editor.
         * @private
         */
        _createSearchLineEditor() {
            this._searchLineEditor = new WUXLineEditor({
                displayStyle: 'text',
                selectAllOnFocus: true,
                displayClearFieldButtonFlag: true,
                value: ''
            }).inject(this._panelTopContainer);
            this._searchLineEditor.addEventListener('uncommittedChange', this._onSearchLineEditorValueChangeCB, false);
            this._searchLineEditor.addEventListener('change', this._onSearchLineEditorValueChangeCB, false);
        }
        /**
         * The callback on the search line editor value change event.
         * @private
         * @param {WUX.Event} event - The search line editor value change event.
         */
        _onSearchLineEditorValueChange(event) {
            const dsModel = event?.dsModel;
            if (dsModel?.valueToCommit) {
                this._searchDGVBlock(dsModel.valueToCommit);
            }
        }
        /**
         * Creates the search combo box.
         * @private
         */
        _createSearchComboBox() {
            const valueTypeNames = TypeLibrary.getTypeNameList(this._editor.getGraphModel().getGraphContext(), ModelEnums.FTypeCategory.fAll);
            this._searchComboBox = new WUXComboBox({
                elementsList: valueTypeNames,
                currentValue: 'Integer',
                placeholder: UINLS.get('placeholderSelectValueType'),
                enableSearchFlag: true
            }).inject(this._panelTopContainer);
            this._searchComboBox.visibleFlag = false;
            this._searchComboBox.addEventListener('uncommittedChange', this._onSearchComboBoxValueChangeCB, false);
            this._searchComboBox.addEventListener('change', this._onSearchComboBoxValueChangeCB, false);
        }
        /**
         * The callback on the search combo box value change event.
         * @private
         * @param {IWUXControlEvent} event - The search combo box value change event.
         */
        _onSearchComboBoxValueChange(event) {
            this._searchDGVBlock(event.dsModel.value);
        }
        /**
         * Searches blocks into the data grid view.
         * @private
         * @param {string} valueToSearch - The value to search for.
         */
        _searchDGVBlock(valueToSearch) {
            if (valueToSearch !== '') {
                const blockUids = this._searchBlockLibrary(valueToSearch);
                this._blockLibraryController.match(blockUids, this._matchBlock, this._matchCategory);
            }
            else {
                this._blockLibraryController.unmatch();
            }
            const highlight = this._matchBlock || this._matchCategory;
            this._dgvBlockLibrary.getWUXDataGridView().setFindStr(highlight ? valueToSearch : '', false);
        }
        /**
         * Searches the block library for the corresponding blocks.
         * @private
         * @param {string} valueToSearch - The value to search for.
         * @returns {Block[]} The list of blocks.
         */
        _searchBlockLibrary(valueToSearch) {
            let blocks = [];
            this._matchBlock = false;
            this._matchCategory = false;
            if (valueToSearch !== '') {
                const entity = this._buttonGroupEntity.value[0];
                if (entity === UIEnums.EBlockLibraryEntitySearchFilter.eBlock) {
                    blocks = this._searchByBlock(valueToSearch);
                }
                else if (entity === UIEnums.EBlockLibraryEntitySearchFilter.eSetting) {
                    blocks = this._searchBySetting(valueToSearch);
                }
                else if (entity === UIEnums.EBlockLibraryEntitySearchFilter.eDataPort) {
                    blocks = this._searchByDataPort(valueToSearch);
                }
                else if (entity === UIEnums.EBlockLibraryEntitySearchFilter.eControlPort) {
                    blocks = this._searchByControlPort(valueToSearch);
                }
                else if (entity === UIEnums.EBlockLibraryEntitySearchFilter.eEventPort) {
                    blocks = this._searchByEventPort(valueToSearch);
                }
            }
            return blocks;
        }
        /**
         * Searches the block library by block.
         * @private
         * @param {string} valueToSearch - The value to search.
         * @returns {Block[]} The list of found blocks.
         */
        _searchByBlock(valueToSearch) {
            let blocks = [];
            const regExp = new RegExp(valueToSearch, 'i');
            const properties = this._buttonGroupProperty.value;
            let blocks1 = [], blocks2 = [];
            let blocks3 = [], blocks4 = [];
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eName)) {
                this._matchBlock = true;
                blocks1 = BlockLibrary.searchBlockByName(regExp);
            }
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eSummary)) {
                blocks2 = BlockLibrary.searchBlockBySummary(regExp);
            }
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eDescription)) {
                blocks3 = BlockLibrary.searchBlockByDescription(regExp);
            }
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eCategory)) {
                this._matchCategory = true;
                blocks4 = BlockLibrary.searchBlockByCategoryFullName(regExp);
            }
            blocks = [...new Set([...blocks1, ...blocks2, ...blocks3, ...blocks4])]; // Merge arrays without duplicates!
            return blocks;
        }
        /**
         * Searches the block library by setting.
         * @private
         * @param {string} valueToSearch - The value to search.
         * @returns {Block[]} The list of found blocks.
         */
        _searchBySetting(valueToSearch) {
            let blocks = [];
            const regExp = new RegExp(valueToSearch, 'i');
            const properties = this._buttonGroupProperty.value;
            let settings1 = [], settings2 = [], settings3 = [];
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eName)) {
                settings1 = BlockLibrary.searchSettingByName(regExp);
            }
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eDescription)) {
                settings2 = BlockLibrary.searchSettingByDescription(regExp);
            }
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eValueType)) {
                settings3 = BlockLibrary.searchSettingByValueType(RegExp('^' + valueToSearch + '$'));
            }
            const settings = [...new Set([...settings1, ...settings2, ...settings3])]; // Merge arrays without duplicates!
            blocks = settings.map(setting => setting.block);
            return blocks;
        }
        /**
         * Searches the block library by data port.
         * @private
         * @param {string} valueToSearch - The value to search.
         * @returns {Block[]} The list of found blocks.
         */
        _searchByDataPort(valueToSearch) {
            let blocks = [];
            const regExp = new RegExp(valueToSearch, 'i');
            const properties = this._buttonGroupProperty.value;
            let dataPorts1 = [], dataPorts2 = [], dataPorts3 = [];
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eName)) {
                dataPorts1 = BlockLibrary.searchDataPortByName(regExp);
            }
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eDescription)) {
                dataPorts2 = BlockLibrary.searchDataPortByDescription(regExp);
            }
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eValueType)) {
                dataPorts3 = BlockLibrary.searchDataPortByValueType(RegExp('^' + valueToSearch + '$'));
            }
            let dataPorts = [...new Set([...dataPorts1, ...dataPorts2, ...dataPorts3])]; // Merge arrays without duplicates!
            // Filter if only one port type is selected
            if (this._buttonGroupPort.value.length === 1) {
                const isInputPort = this._buttonGroupPort.value[0] === UIEnums.EBlockLibraryPortSearchFilter.eInput;
                const portTypes = isInputPort ? [ModelEnums.EDataPortType.eInput, ModelEnums.EDataPortType.eInputExternal] : [ModelEnums.EDataPortType.eOutput];
                dataPorts = dataPorts.filter(dp => portTypes.includes(dp.getType()));
            }
            blocks = dataPorts.map(dp => dp.block);
            return blocks;
        }
        /**
         * Searches the block library by control port.
         * @private
         * @param {string} valueToSearch - The value to search.
         * @returns {Block[]} The list of found blocks.
         */
        _searchByControlPort(valueToSearch) {
            let blocks = [];
            const regExp = new RegExp(valueToSearch, 'i');
            const properties = this._buttonGroupProperty.value;
            let controlPorts1 = [], controlPorts2 = [];
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eName)) {
                controlPorts1 = BlockLibrary.searchControlPortByName(regExp);
            }
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eDescription)) {
                controlPorts2 = BlockLibrary.searchControlPortByDescription(regExp);
            }
            let controlPorts = [...new Set([...controlPorts1, ...controlPorts2])]; // Merge arrays without duplicates!
            // Only keep control ports
            controlPorts = controlPorts.filter(cp => cp.getType() === ModelEnums.EControlPortType.eInput ||
                cp.getType() === ModelEnums.EControlPortType.eOutput);
            // Filter if only one port type is selected
            if (this._buttonGroupPort.value.length === 1) {
                const isInputPort = this._buttonGroupPort.value[0] === UIEnums.EBlockLibraryPortSearchFilter.eInput;
                const portType = isInputPort ? ModelEnums.EControlPortType.eInput : ModelEnums.EControlPortType.eOutput;
                controlPorts = controlPorts.filter(cp => cp.getType() === portType);
            }
            blocks = controlPorts.map(cp => cp.block);
            return blocks;
        }
        /**
         * Searches the block library by event port.
         * @private
         * @param {string} valueToSearch - The value to search.
         * @returns {Block[]} The list of found blocks.
         */
        _searchByEventPort(valueToSearch) {
            let blocks = [];
            const regExp = new RegExp(valueToSearch, 'i');
            const properties = this._buttonGroupProperty.value;
            let eventPorts1 = [], eventPorts2 = [];
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eName)) {
                eventPorts1 = BlockLibrary.searchControlPortByName(regExp);
            }
            if (properties.includes(UIEnums.EBlockLibraryPropertySearchFilter.eDescription)) {
                eventPorts2 = BlockLibrary.searchControlPortByDescription(regExp);
            }
            // TODO: Handle search event port by event type when supported by model!
            let eventPorts = [...new Set([...eventPorts1, ...eventPorts2])]; // Merge arrays without duplicates!
            // Only keep event ports
            eventPorts = eventPorts.filter(ep => ep.getType() === ModelEnums.EControlPortType.eInputEvent ||
                ep.getType() === ModelEnums.EControlPortType.eOutputEvent);
            // Filter if only one port type is selected
            if (this._buttonGroupPort.value.length === 1) {
                const isInputPort = this._buttonGroupPort.value[0] === UIEnums.EBlockLibraryPortSearchFilter.eInput;
                const portType = isInputPort ? ModelEnums.EControlPortType.eInputEvent : ModelEnums.EControlPortType.eOutputEvent;
                eventPorts = eventPorts.filter(ep => ep.getType() === portType);
            }
            blocks = eventPorts.map(ep => ep.block);
            return blocks;
        }
        /**
         * Creates the data grid view block library.
         * @private
         */
        _createDGVBlockLibrary() {
            this._dgvContainer = UIDom.createElement('div', { className: 'sch-panel-dgv-container', parent: this._panelTopContainer });
            this._tabBar = new WUXTabBar({ displayStyle: 'strip' }).inject(this._dgvContainer);
            this._tabBar.add({
                icon: UIFontIcon.getWUX3DSIconDefinition('library-books'),
                isSelected: true,
                tooltipInfos: UIWUXTools.createTooltip({
                    title: UINLS.get('allBlocksTabTitle'),
                    shortHelp: UINLS.get('allBlocksTabShortHelp'),
                    initialDelay: 500
                })
            });
            this._tabBar.add({
                icon: UIFontIcon.getWUX3DSIconDefinition('favorite-on'),
                isSelected: false,
                tooltipInfos: UIWUXTools.createTooltip({
                    title: UINLS.get('favoriteBlocksTabTitle'),
                    shortHelp: UINLS.get('favoriteBlocksTabShortHelp'),
                    initialDelay: 500
                })
            });
            this._tabBar.addEventListener('tabButtonClick', this._onTabButtonClickCB);
            this._dgvBlockLibrary = new UIDGVBlockLibrary(this._editor, this._blockLibraryController, this._docView);
            this._dgvContainer.appendChild(this._dgvBlockLibrary.getElement());
        }
        /**
         * The callback on the tab button click event.
         * @private
         * @param {IWUXControlEvent} event - The tab bar control button click event.
         */
        _onTabButtonClick(event) {
            const treeDocument = this._dgvBlockLibrary.getTreeDocument();
            const tabValue = event.options?.value;
            if (tabValue === 0) {
                treeDocument.setFilterModel({});
                treeDocument.collapseAll();
            }
            else {
                treeDocument.setFilterModel({
                    isFavorite: {
                        filterId: 'set',
                        filterModel: [true]
                    }
                });
                treeDocument.expandAll();
            }
        }
        /**
         * Creates the advanced search expander.
         * @private
         */
        _createAdvancedSearchExpander() {
            this._advancedSearchContainer = UIDom.createElement('div', {
                className: 'sch-advanced-search-container',
                parent: this._panelTopContainer
            });
            this._advancedSearchContent = UIDom.createElement('div', { className: 'sch-advanced-search-content' });
            this._advancedSearchExpander = new WUXExpander({
                header: UINLS.get('sectionAdvancedSearch'),
                body: this._advancedSearchContent,
                style: 'styled',
                allowUnsafeHTMLHeader: false
            });
            this._advancedSearchExpander.inject(this._advancedSearchContainer);
            // Add entity button group
            this._buttonGroupEntity = new WUXButtonGroup().inject(this._advancedSearchContent);
            this._buttonGroupEntity.addChild(new WUXButton({
                type: 'radio', label: UINLS.get(UIEnums.EBlockLibraryEntitySearchFilter.eBlock), value: UIEnums.EBlockLibraryEntitySearchFilter.eBlock,
                emphasize: 'info', checkFlag: true, allowUnsafeHTMLLabel: false
            }));
            this._buttonGroupEntity.addChild(new WUXButton({
                type: 'radio', label: UINLS.get(UIEnums.EBlockLibraryEntitySearchFilter.eDataPort), value: UIEnums.EBlockLibraryEntitySearchFilter.eDataPort,
                emphasize: 'info', allowUnsafeHTMLLabel: false
            }));
            this._buttonGroupEntity.addChild(new WUXButton({
                type: 'radio', label: UINLS.get(UIEnums.EBlockLibraryEntitySearchFilter.eControlPort), value: UIEnums.EBlockLibraryEntitySearchFilter.eControlPort,
                emphasize: 'info', allowUnsafeHTMLLabel: false
            }));
            this._buttonGroupEntity.addChild(new WUXButton({
                type: 'radio', label: UINLS.get(UIEnums.EBlockLibraryEntitySearchFilter.eEventPort), value: UIEnums.EBlockLibraryEntitySearchFilter.eEventPort,
                emphasize: 'info', allowUnsafeHTMLLabel: false
            }));
            this._buttonGroupEntity.addChild(new WUXButton({
                type: 'radio', label: UINLS.get(UIEnums.EBlockLibraryEntitySearchFilter.eSetting), value: UIEnums.EBlockLibraryEntitySearchFilter.eSetting,
                emphasize: 'info', allowUnsafeHTMLLabel: false
            }));
            this._buttonGroupEntity.addEventListener('change', this._onButtonGroupEntityValueChangeCB, false);
            // Add seperator
            UIDom.createElement('div', { className: 'sch-advanced-search-separator', parent: this._advancedSearchContent });
            // Add port button group
            this._buttonGroupPort = new WUXButtonGroup({ type: 'checkbox' }).inject(this._advancedSearchContent);
            this._buttonGroupPort.visibleFlag = false;
            this._buttonGroupPort.addChild(new WUXButton({
                type: 'check', label: UINLS.get(UIEnums.EBlockLibraryPortSearchFilter.eInput), value: UIEnums.EBlockLibraryPortSearchFilter.eInput,
                emphasize: 'info', checkFlag: true, allowUnsafeHTMLLabel: false
            }));
            this._buttonGroupPort.addChild(new WUXButton({
                type: 'check', label: UINLS.get(UIEnums.EBlockLibraryPortSearchFilter.eOutput), value: UIEnums.EBlockLibraryPortSearchFilter.eOutput,
                emphasize: 'info', checkFlag: true, allowUnsafeHTMLLabel: false
            }));
            this._buttonGroupPort.addEventListener('change', this._onButtonGroupPortOrPropertyValueChangeCB, false);
            for (let i = 0; i < this._buttonGroupPort.getButtonCount(); i++) {
                const button = this._buttonGroupPort.getButton(i);
                button.addEventListener('buttonclick', this._preventEmptyButtonGroupPropertiesCB);
            }
            // Add seperator
            UIDom.createElement('div', { className: 'sch-advanced-search-separator', parent: this._advancedSearchContent });
            // Add property button group
            this._buttonGroupProperty = new WUXButtonGroup({ type: 'checkbox' }).inject(this._advancedSearchContent);
            this._buttonGroupProperty.addEventListener('change', this._onButtonGroupPortOrPropertyValueChangeCB, false);
        }
        /**
         * The callback on the button group entity value change event.
         * @private
         */
        _onButtonGroupEntityValueChange() {
            const entity = this._buttonGroupEntity.value[0];
            if (entity === UIEnums.EBlockLibraryEntitySearchFilter.eBlock) {
                this._buttonGroupPort.visibleFlag = false;
                this._updateButtonGroupProperties([
                    UIEnums.EBlockLibraryPropertySearchFilter.eName,
                    UIEnums.EBlockLibraryPropertySearchFilter.eSummary,
                    UIEnums.EBlockLibraryPropertySearchFilter.eDescription,
                    UIEnums.EBlockLibraryPropertySearchFilter.eCategory
                ]);
            }
            else if (entity === UIEnums.EBlockLibraryEntitySearchFilter.eDataPort) {
                this._buttonGroupPort.visibleFlag = true;
                this._updateButtonGroupProperties([
                    UIEnums.EBlockLibraryPropertySearchFilter.eName,
                    UIEnums.EBlockLibraryPropertySearchFilter.eDescription,
                    UIEnums.EBlockLibraryPropertySearchFilter.eValueType
                ]);
            }
            else if (entity === UIEnums.EBlockLibraryEntitySearchFilter.eControlPort || entity === UIEnums.EBlockLibraryEntitySearchFilter.eEventPort) {
                this._buttonGroupPort.visibleFlag = true;
                this._updateButtonGroupProperties([
                    UIEnums.EBlockLibraryPropertySearchFilter.eName,
                    UIEnums.EBlockLibraryPropertySearchFilter.eDescription
                ]);
            }
            else if (entity === UIEnums.EBlockLibraryEntitySearchFilter.eSetting) {
                this._buttonGroupPort.visibleFlag = false;
                this._updateButtonGroupProperties([
                    UIEnums.EBlockLibraryPropertySearchFilter.eName,
                    UIEnums.EBlockLibraryPropertySearchFilter.eDescription,
                    UIEnums.EBlockLibraryPropertySearchFilter.eValueType
                ]);
            }
            this._updateSearchControlPlaceholder();
            this._searchDGVBlock(this._searchLineEditor.value);
        }
        /**
         * The callback on the button group port or property value change event.
         * @private
         */
        _onButtonGroupPortOrPropertyValueChange() {
            const isValueType = this._buttonGroupProperty.value.includes(UIEnums.EBlockLibraryPropertySearchFilter.eValueType);
            this._searchLineEditor.visibleFlag = !isValueType;
            this._searchComboBox.visibleFlag = isValueType;
            let valueToSearch = isValueType ? this._searchComboBox.value : this._searchLineEditor.value;
            this._updateSearchControlPlaceholder();
            this._searchDGVBlock(valueToSearch);
        }
        /**
         * Clears the given button group children.
         * @private
         * @param {WUXButtonGroup} buttonGroup - The button group to clear.
         */
        _clearButtonGroup(buttonGroup) {
            if (buttonGroup !== undefined) {
                while (buttonGroup.getButtonCount() > 0) {
                    const button = buttonGroup.getButton(0);
                    button.removeEventListener('buttonclick', this._preventEmptyButtonGroupPropertiesCB);
                    buttonGroup.removeChild(button);
                }
            }
        }
        /**
         * Updates the button group properties.
         * @private
         * @param {string[]} properties - The list of properties.
         */
        _updateButtonGroupProperties(properties) {
            this._clearButtonGroup(this._buttonGroupProperty);
            properties.forEach((property, index) => {
                const checkFlag = index === 0 || property === UIEnums.EBlockLibraryPropertySearchFilter.eCategory;
                const button = new WUXButton({
                    type: 'check', emphasize: 'info', label: UINLS.get(property),
                    value: property,
                    checkFlag: checkFlag,
                    allowUnsafeHTMLLabel: false
                });
                button.addEventListener('buttonclick', this._preventEmptyButtonGroupPropertiesCB);
                this._buttonGroupProperty.addChild(button);
            });
        }
        /**
         * Prevents the button group property from being empty.
         * @private
         * @static
         * @param {WUX.Event} event - The WUX event.
         */
        static _preventEmptyButtonGroupProperties(event) {
            const buttonGroup = (event.dsModel?.getContent().getParent()).dsModel;
            if (buttonGroup.value.length === 0) {
                event.dsModel.checkFlag = true;
            }
        }
        /**
         * Updates the search control placeholder.
         * @private
         */
        _updateSearchControlPlaceholder() {
            const entity = this._buttonGroupEntity.value[0];
            const reducer = (acc, value, index) => acc + (index === 0 ? '' : ' | ') + UINLS.get(value);
            const port = this._buttonGroupPort.value.reduce(reducer, '');
            const portName = (entity === UIEnums.EBlockLibraryEntitySearchFilter.eDataPort ||
                entity === UIEnums.EBlockLibraryEntitySearchFilter.eControlPort ||
                entity === UIEnums.EBlockLibraryEntitySearchFilter.eEventPort) ? port + ' > ' : '';
            const property = this._buttonGroupProperty.value.reduce(reducer, '');
            this._searchLineEditor.placeholder = UINLS.get('placeholderSearch') + ': ' + UINLS.get(entity) + ' > ' + portName + property;
        }
    }
    return UIBlockLibraryPanel;
});
