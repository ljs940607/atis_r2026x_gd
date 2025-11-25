/// <amd-module name='DS/EPSSchematicsUI/controls/EPSSchematicsUIValueTypeCombo'/>
define("DS/EPSSchematicsUI/controls/EPSSchematicsUIValueTypeCombo", ["require", "exports", "DS/Controls/Abstract", "DS/Utilities/Dom", "DS/Core/WebUXComponents", "DS/Controls/Button", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedValueTypeList", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/controls/EPSSchematicsUIValueTypeCombo"], function (require, exports, WUXAbstract, WUXDomUtils, WebUXComponents, WUXButton, UIDom, UIFontIcon, UIKeyboard, UIEvents, UIVirtualizedValueTypeList, UINLS) {
    "use strict";
    /**
     * This class defines the UI value type combobox WUX control.
     * @private
     * @class UIValueTypeCombo
     * @alias DS/EPSSchematicsUI/controls/EPSSchematicsUIValueTypeCombo
     * @extends WUXAbstract
     */
    class UIValueTypeCombo extends WUXAbstract {
        constructor() {
            super(...arguments);
            this.onWindowMousedownCB = this.onWindowMousedown.bind(this);
            this._readyState = true;
        }
        /**
         * @private
         * @override
         * @property {Object} publishedProperties - The default control properties.
         */
        static get publishedProperties() {
            return {
                value: {
                    defaultValue: '',
                    type: 'string',
                    category: 'Behavior'
                },
                possibleValues: {
                    defaultValue: [],
                    type: 'array',
                    category: 'Model'
                },
                editor: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                dataPort: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                showCreateUserTypeButton: {
                    defaultValue: false,
                    type: 'boolean',
                    category: 'Behavior'
                },
                showTypeLibraryButton: {
                    defaultValue: false,
                    type: 'boolean',
                    category: 'Behavior'
                }
            };
        }
        /**
         * Removes the control.
         * @public
         * @override
         * @returns {IWUXControlAbstract} The removed control.
         */
        remove() {
            this.removeList();
            return super.remove();
        }
        /**
         * Applies the value property.
         * @public
         * @param {string} _oldValue - The old value property.
         * @param {string} newValue - The new value property.
         */
        _applyValue(_oldValue, newValue) {
            this.elements.searchInput.value = newValue;
            if (!this.preventTriggeringChangeEvent) {
                this.fire('change');
            }
        }
        /**
         * Applies the show type library button property.
         * @public
         * @param {boolean} _oldValue - The old value property.
         * @param {boolean} _newValue - The new value property.
         */
        _applyShowTypeLibraryButton(_oldValue, _newValue) {
            if (this.showTypeLibraryButton) {
                this.elements.typeLibraryButton = UIDom.createElement('button', {
                    className: ['sch-controls-valuetypecombo-button', 'sch-controls-valuetypecombo-button-typelibrary'],
                    parent: this.elements.container,
                    insertBefore: this.elements.button,
                    tooltipInfos: {
                        title: UINLS.get('openTypeLibraryTitle'),
                        shortHelp: UINLS.get('openTypeLibraryShortHelp'),
                        initialDelay: 500
                    },
                    children: [UIFontIcon.create3DSFontIcon('text')],
                    attributes: { type: 'button' },
                    onclick: (event) => {
                        const typeLibraryPanel = this.editor.getTypeLibraryPanel();
                        typeLibraryPanel.selectType(this.value);
                        const closeEvent = new UIEvents.UIDialogCloseEvent(); // Send a dialog close event
                        this.editor.dispatchEvent(closeEvent);
                        event.stopPropagation();
                    }
                });
            }
            else if (this.elements.typeLibraryButton) {
                this.elements.container.removeChild(this.elements.typeLibraryButton);
                this.elements.typeLibraryButton = undefined;
            }
        }
        /**
         * Builds the view of the control.
         * @protected
         * @override
         */
        buildView() {
            this.preventTriggeringChangeEvent = true; // Prevent fire change event during the control build
            UIDom.addClassName(this.elements.container, 'sch-controls-valuetypecombo');
            this.elements.searchInput = UIDom.createElement('input', {
                className: 'sch-controls-valuetypecombo-input',
                parent: this.elements.container,
                attributes: { type: 'text', spellcheck: false }
            });
            this.elements.button = UIDom.createElement('button', {
                className: ['sch-controls-valuetypecombo-button', 'sch-controls-valuetypecombo-button-expand'],
                parent: this.elements.container,
                children: [UIFontIcon.create3DSFontIcon('expand-down')]
            });
            this.elements.searchInput.value = this.value;
        }
        /**
         * The callback on the control post build view.
         * @public
         * @override
         */
        _postBuildView() {
            this.preventTriggeringChangeEvent = false; // Restore the change event dispatching
        }
        /**
         * Handles the control events.
         * @public
         * @override
         */
        handleEvents() {
            WUXDomUtils.addEventOnElement(this, this.elements.button, 'click', () => {
                if (this._searchList) {
                    this.removeList();
                }
                else {
                    this.createList(this.value);
                }
                this.elements.searchInput.focus();
                this.elements.searchInput.select();
            });
            WUXDomUtils.addEventOnElement(this, this.elements.searchInput, 'blur', () => {
                const isIncluded = this.possibleValues.includes(this._currentSearchValue);
                const isDifferent = this.value !== this._currentSearchValue;
                if (isIncluded && isDifferent) {
                    this.value = this._currentSearchValue;
                }
                window.getSelection()?.removeAllRanges();
            });
            WUXDomUtils.addEventOnElement(this, this.elements.searchInput, 'keydown', ((event) => {
                if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowUp)) {
                    if (this._searchList) {
                        this._searchList.selectPreviousListItem();
                    }
                    else {
                        this._searchList = this.createList(this.value);
                        this._searchList.selectLastListItem();
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowDown)) {
                    if (this._searchList) {
                        this._searchList.selectNextListItem();
                    }
                    else {
                        this._searchList = this.createList(this.value);
                        this._searchList.selectFirstListItem();
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eHome)) {
                    if (this._searchList) {
                        this._searchList.selectFirstListItem();
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEnd)) {
                    if (this._searchList) {
                        this._searchList.selectLastListItem();
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.ePageUp)) {
                    if (this._searchList) {
                        this._searchList.selectPreviousPageListItem();
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.ePageDown)) {
                    if (this._searchList) {
                        this._searchList.selectNextPageListItem();
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEscape)) {
                    this.elements.searchInput.value = this.value;
                    this.removeList();
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEnter)) {
                    this.pick();
                }
                event.stopPropagation();
            }));
            WUXDomUtils.addEventOnElement(this, this.elements.searchInput, 'input', async () => {
                return new Promise(resolve => {
                    this._readyState = false;
                    this._currentSearchValue = this.elements.searchInput.value;
                    clearTimeout(this._timeoutId);
                    this._timeoutId = setTimeout(() => {
                        this.removeList();
                        this.createList(this.elements.searchInput.value);
                        this._readyState = true;
                        resolve();
                    }, 100);
                });
            });
        }
        /**
         * Creates the search list view of the comboBox, based on the filter given as parameter.
         * The list view is an absolute div appended on the body's page.
         * @private
         * @param {string} filter - The string used to filter the result list.
         * @returns {UIVirtualizedValueTypeList} The created list.
         */
        createList(filter) {
            this.elements.searchListContainer = UIDom.createElement('div', {
                className: 'sch-controls-valuetypecombo-list-container'
            });
            const valueTypeData = this.possibleValues.map(valueType => ({ name: valueType }));
            this._searchList = new UIVirtualizedValueTypeList({
                parent: this.elements.searchListContainer,
                data: valueTypeData,
                onPick: () => this.pick()
            });
            this._searchList.filterData(filter);
            this._searchList.selectFirstListItem();
            if (this.showCreateUserTypeButton) {
                this.elements.createTypeContainer = UIDom.createElement('div', {
                    className: 'sch-controls-valuetypecombo-createtype-container',
                    parent: this.elements.searchListContainer
                });
                this.elements.createTypeButton = new WUXButton({
                    label: UINLS.get('shortHelpHistoryCreateCustomType'),
                    emphasize: 'primary',
                    icon: UIFontIcon.getWUXFAIconDefinition('plus'),
                    onClick: () => {
                        this.removeList();
                        const typeLibraryPanel = this.editor.getTypeLibraryPanel();
                        const event = new UIEvents.UIDialogCloseEvent(); // Send a dialog close event
                        this.editor.dispatchEvent(event);
                        typeLibraryPanel.open();
                        typeLibraryPanel.openCreateTypeDialog(this.dataPort);
                    }
                }).inject(this.elements.createTypeContainer);
            }
            WUXDomUtils.addEventOnElement(this, window, 'mousedown', this.onWindowMousedownCB, true);
            const bbox = this.elements.container.getBoundingClientRect();
            this.elements.searchListContainer.style.left = bbox.left + 'px';
            this.elements.searchListContainer.style.top = bbox.top + bbox.height + 'px';
            this.elements.searchListContainer.style.width = bbox.width + 'px';
            document.body.appendChild(this.elements.searchListContainer);
            return this._searchList;
        }
        /**
         * Removes the search list.
         * @private
         */
        removeList() {
            if (this.elements.searchListContainer !== undefined) {
                if (this._searchList) {
                    this._searchList.remove();
                    this._searchList = undefined;
                }
                WUXDomUtils.removeEventOnElement(this, window, 'mousedown', this.onWindowMousedownCB, true);
                document.body.removeChild(this.elements.searchListContainer);
                this.elements.searchListContainer = undefined;
            }
        }
        /**
         * Picks the active item on the list and removes the list.
         * @private
         */
        pick() {
            if (this._searchList) {
                const data = this._searchList.getSelectedListItem();
                if (data?.name) {
                    this.elements.searchInput.focus();
                    this.removeList();
                    this.value = data.name;
                    this.elements.searchInput.value = this.value;
                }
            }
        }
        /**
         * The callback on the window mouse down event.
         * Ignores interaction with comboBox (input and button).
         * Check if an element is clicked or if search list must be closed.
         * @private
         * @param {MouseEvent} event - The window mouse down event.
         */
        onWindowMousedown(event) {
            clearTimeout(this._timeoutId);
            const target = event.target;
            let isOutside = target !== this.elements.searchInput;
            isOutside = isOutside && target !== this.elements.button;
            isOutside = isOutside && !this._searchList.isChildOfList(target);
            isOutside = isOutside && (this.elements.createTypeButton ? target !== this.elements.createTypeButton.getContent() : true);
            if (isOutside) {
                if (this._searchList) {
                    const data = this._searchList.getSelectedListItem();
                    if (data.name) {
                        const isEqual = this.elements.searchInput.value.toLowerCase() === data.name.toLowerCase();
                        this.value = isEqual ? data.name : this.value;
                        this.elements.searchInput.value = this.value;
                    }
                }
                this.removeList();
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                      ___  ____ _____                                           //
        //                                     / _ \|  _ \_   _|                                          //
        //                                    | | | | | | || |                                            //
        //                                    | |_| | |_| || |                                            //
        //                                     \___/|____/ |_|                                            //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the search list for ODT.
         * @private
         * @ignore
         * @returns {UIVirtualizedValueTypeList} The search list.
         */
        _getSearchListForODT() {
            return this._searchList;
        }
        /**
         * Gets the search input ready state for ODT.
         * @private
         * @ignore
         * @returns {boolean} Whether the search input is ready.
         */
        _getReadyStateForODT() {
            return this._readyState;
        }
    }
    WebUXComponents.addClass(UIValueTypeCombo, 'UIValueTypeCombo');
    return UIValueTypeCombo;
});
