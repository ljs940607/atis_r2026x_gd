/// <amd-module name='DS/EPSSchematicsUI/controls/EPSSchematicsUIJSONViewer'/>
define("DS/EPSSchematicsUI/controls/EPSSchematicsUIJSONViewer", ["require", "exports", "DS/Controls/Abstract", "DS/Core/WebUXComponents", "DS/Core/TooltipModel", "DS/Controls/LineEditor", "DS/Controls/Button", "DS/Utilities/Dom", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFileSaver", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFileLoader", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/typings/WebUX/menu/EPSWUXMenu", "DS/CoreBase/WebUXGlobalEnums", "css!DS/EPSSchematicsUI/css/controls/EPSSchematicsUIJSONViewer"], function (require, exports, WUXAbstract, WebUXComponents, WUXTooltipModel, WUXLineEditor, WUXButton, WUXDomUtils, TypeLibrary, UIDom, UITools, UIFontIcon, UIWUXTools, UIFileSaver, UIFileLoader, UINLS, WUXMenu, WebUXGlobalEnums_1) {
    "use strict";
    /**
     * This class defines the UI JSON viewer WUX control.
     * @private
     * @class UIJSONViewer
     * @alias module:DS/EPSSchematicsUI/controls/EPSSchematicsUIJSONViewer
     * @extends WUXAbstract
     */
    class UIJSONViewer extends WUXAbstract {
        constructor() {
            super(...arguments);
            this._jsonFileSaver = new UIFileSaver();
            this._jsonFileLoader = new UIFileLoader();
        }
        /**
         * @private
         * @override
         * @property {Object} publishedProperties - The default control properties.
         */
        static get publishedProperties() {
            return {
                value: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior',
                    advancedSetter: false
                },
                valueType: {
                    defaultValue: '',
                    type: 'string',
                    category: 'Behavior'
                },
                jsonFileValue: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior',
                    advancedSetter: false
                },
                graphContext: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior',
                    advancedSetter: false
                },
                readOnly: {
                    defaultValue: false,
                    type: 'boolean',
                    category: 'Behavior',
                    advancedSetter: false
                }
            };
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
            if (this.isDirty('value')) {
                this._updateView();
            }
            if (this.isDirty('readOnly')) {
                this._applyReadOnly(oldValues.readOnly, this.readOnly);
            }
        }
        _applyValue(_oldValue, newValue) {
            this.value = newValue;
            this._updateView();
            if (!this._preventTriggeringChangeEvent) {
                this.fire('change');
            }
        }
        _applyValueType(_oldValue, newValue) {
            this.valueType = newValue;
        }
        _applyGraphContext(_oldValue, newValue) {
            this.graphContext = newValue;
        }
        _applyJsonFileValue(_oldValue, newValue) {
            this.jsonFileValue = newValue;
            this._updateView();
            if (!this._preventTriggeringChangeEvent) {
                this.fire('jsonLoad');
            }
        }
        _applyReadOnly(_oldValue, newValue) {
            this.readOnly = newValue;
        }
        _applyTooltipInfos() {
            if (!this.tooltipInfos && this._properties.tooltipInfos) {
                this._properties.tooltipInfos.value = this._defaultTooltipModel;
            }
            super._applyTooltipInfos();
        }
        _updateView() {
            if (this.elements.lineEditor) {
                this.elements.lineEditor.value = UITools.buildJSONString(this.value);
            }
        }
        /**
         * Builds the view of the control.
         * @protected
         * @override
         */
        buildView() {
            this._preventTriggeringChangeEvent = true; // Prevent fire change event during the control build
            UIDom.addClassName(this.elements.container, 'sch-controls-jsonviewer');
            this.elements.lineEditor = new WUXLineEditor({ placeholder: '', value: undefined });
            this.elements.container.appendChild(this.elements.lineEditor.getContent());
            this.elements.lineEditor.elements.inputField.setAttribute('readonly', 'readonly'); // readonly to prevent manual edition
            this.elements.button = new WUXButton({
                showLabelFlag: false,
                icon: { iconName: 'menu', iconSize: '1x', fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS },
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Open object menu' })
            });
            UIDom.addClassName(this.elements.button.elements.container, 'sch-controls-jsonviewer-button');
            this.elements.button.elements.container.setAttribute('tabindex', -1); // to prevent focus while using tab key
            this.elements.container.appendChild(this.elements.button.getContent());
            this.elements.button.getContent().addEventListener('click', async (event) => {
                const isFirefox = navigator.userAgent.includes('Firefox');
                let isClipboardReadAllowed = isFirefox;
                let isClipboardWriteAllowed = isFirefox;
                if (!isFirefox) {
                    try {
                        const clipboardReadStatus = await navigator.permissions.query({ name: 'clipboard-read' });
                        isClipboardReadAllowed = clipboardReadStatus.state !== 'denied';
                        const clipboardWriteStatus = await navigator.permissions.query({ name: 'clipboard-write' });
                        isClipboardWriteAllowed = clipboardWriteStatus.state !== 'denied';
                    }
                    catch (error) {
                        // eslint-disable-next-line no-console
                        console.log('Copy and paste feature are not supported in this browser!');
                    }
                }
                const isValued = UIJSONViewer._isValued(this.value);
                WUXMenu.show([{
                        type: 'PushItem',
                        title: 'Load from JSON file',
                        fonticon: { content: 'wux-ui-3ds wux-ui-3ds-export' },
                        state: this.readOnly ? 'disabled' : 'enabled',
                        action: { callback: () => this._loadFromJSONFile() }
                    }, {
                        type: 'PushItem',
                        title: 'Save to JSON file',
                        fonticon: { content: 'wux-ui-3ds wux-ui-3ds-import' },
                        state: isValued ? 'enabled' : 'disabled',
                        action: { callback: () => this._saveToJSONFile() }
                    }, {
                        type: 'PushItem',
                        title: 'Copy JSON to clipboard',
                        fonticon: { content: 'wux-ui-3ds wux-ui-3ds-copy' },
                        state: isValued && isClipboardWriteAllowed ? 'enabled' : 'disabled',
                        action: { callback: () => this._copyToClipboard() }
                    }, {
                        type: 'PushItem',
                        title: 'Paste JSON from clipboard',
                        fonticon: { content: 'wux-ui-fa wux-ui-fa-clipboard' },
                        state: isClipboardReadAllowed && !this.readOnly ? 'enabled' : 'disabled',
                        action: { callback: () => this._pasteFromClipboard() }
                    }], {
                    position: { x: event.clientX + 1, y: event.clientY + 1 }
                }, {
                    onShow: () => document.body.querySelector('.wux-menu-mouse')?.classList.add('sch-controls-jsonviewer-menu')
                });
            });
            this._updateView();
            this._updateInputTooltip();
        }
        /**
         * Handles the control events.
         * @public
         * @override
         */
        handleEvents() {
            super.handleEvents();
            WUXDomUtils.addEventOnElement(this, this.elements.lineEditor.getContent(), 'copy', this._onCopy.bind(this));
            WUXDomUtils.addEventOnElement(this, this.elements.lineEditor.getContent(), 'paste', this._onPaste.bind(this));
        }
        /**
         * The callback on the control post build view.
         * @public
         * @override
         */
        _postBuildView() {
            this._preventTriggeringChangeEvent = false; // Restore the change event dispatching
        }
        _updateInputTooltip() {
            if (!this._defaultTooltipModel) {
                this._defaultTooltipModel = new WUXTooltipModel();
            }
            this._defaultTooltipModel.shortHelp = UINLS.get('expandToEditObjectTooltipShortHelp');
            this._defaultTooltipModel.initialDelay = 500;
        }
        /**
         * The callback on the control copy event.
         * @public
         * @param {ClipboardEvent} event - The copy event.
         */
        _onCopy(event) {
            const isValued = UIJSONViewer._isValued(this.value);
            if (isValued && event && event.clipboardData) {
                const jsonString = this._stringifyValue();
                event.clipboardData.setData('text/plain', jsonString);
                this._displayMessage('JSON Object copied!', false);
            }
            event.preventDefault();
            event.stopPropagation();
        }
        /**
         * The callback on the control paste event.
         * @public
         * @param {ClipboardEvent} event - The paste event.
         */
        _onPaste(event) {
            if (!this.readOnly && event.clipboardData) {
                const data = event.clipboardData.getData('text/plain');
                this._safeJSONParse(data);
            }
            event.preventDefault();
            event.stopPropagation();
        }
        _saveToJSONFile() {
            if (UIJSONViewer._isValued(this.value)) {
                const jsonString = this._stringifyValue();
                this._jsonFileSaver.saveTextFile(jsonString, 'objectValue.json');
            }
        }
        _loadFromJSONFile() {
            this._jsonFileLoader.loadFile((_fileName, result) => {
                this._safeJSONParse(result);
            });
        }
        async _pasteFromClipboard() {
            try {
                const text = await navigator.clipboard.readText();
                this._safeJSONParse(text);
            }
            catch (err) {
                this._displayMessage('Failed to paste JSON object', true);
            }
        }
        async _copyToClipboard() {
            try {
                const jsonString = this._stringifyValue();
                await navigator.clipboard.writeText(jsonString);
                this._displayMessage('JSON object copied', false);
            }
            catch (error) {
                this._displayMessage('Failed to copy JSON object', true);
            }
        }
        _safeJSONParse(jsonString) {
            let displayError = false;
            try {
                const jsonObject = JSON.parse(jsonString);
                if (typeof jsonObject === 'object') {
                    this.jsonFileValue = TypeLibrary.getValueFromJSONValue(this.graphContext, jsonObject, this.valueType);
                    this._displayMessage('JSON object loaded', false);
                }
                else {
                    displayError = true;
                }
            }
            catch (error) {
                displayError = true;
            }
            if (displayError) {
                this._displayMessage('Invalid JSON object', true);
            }
        }
        _stringifyValue() {
            const jsonValue = TypeLibrary.getJSONValueFromValue(this.graphContext, this.value, this.valueType);
            return JSON.stringify(jsonValue, undefined, 2);
        }
        static _isValued(value) {
            return typeof value === 'object' && Object.keys(value).length > 0;
        }
        _displayMessage(message, isError) {
            if (this.elements.message) {
                this.elements.container.removeChild(this.elements.message);
                this.elements.message = undefined;
            }
            this.elements.message = UIDom.createElement('div', {
                className: ['sch-controls-jsonviewer-message', isError ? 'error' : 'success'],
                parent: this.elements.container,
                children: [
                    UIFontIcon.create3DSFontIcon(isError ? 'status-ko' : 'status-ok'),
                    UIDom.createElement('div', { textContent: message })
                ]
            });
        }
        _getJSONFileSaver() {
            return this._jsonFileSaver;
        }
        _getJSONFileLoader() {
            return this._jsonFileLoader;
        }
    }
    WebUXComponents.addClass(UIJSONViewer, 'UIJSONViewer');
    return UIJSONViewer;
});
