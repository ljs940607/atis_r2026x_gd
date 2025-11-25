/// <amd-module name='DS/EPSSchematicsUI/controls/EPSSchematicsUIBigIntSpinBox'/>
define("DS/EPSSchematicsUI/controls/EPSSchematicsUIBigIntSpinBox", ["require", "exports", "DS/Controls/Abstract", "DS/Core/WebUXComponents", "DS/Utilities/Dom", "DS/Controls/LineEditor", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/controls/EPSSchematicsUIBigIntSpinBox"], function (require, exports, WUXAbstract, WebUXComponents, WUXDomUtils, WUXLineEditor, UIDom) {
    "use strict";
    /**
     * This class defines the UI BigInt spin box WUX control.
     * @private
     * @class UIBigIntSpinBox
     * @alias module:DS/EPSSchematicsUI/controls/EPSSchematicsUIBigIntSpinBox
     * @extends WUXAbstract
     */
    class UIBigIntSpinBox extends WUXAbstract {
        /**
         * @public
         * @constructor
         */
        constructor(...args) {
            super(...args);
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
                    type: 'number',
                    category: 'Behavior',
                    advancedSetter: false
                },
                stepValue: {
                    defaultValue: BigInt(1),
                    type: 'number',
                    category: 'Behavior'
                },
                minValue: {
                    defaultValue: undefined,
                    type: 'number',
                    category: 'Behavior'
                },
                maxValue: {
                    defaultValue: undefined,
                    type: 'number',
                    category: 'Behavior'
                }
            };
        }
        _applyProperties(oldValues) {
            if (this.isDirty('value')) {
                this._applyValue(oldValues.value, this.value);
            }
            if (this.isDirty('stepValue')) {
                this._applyStepValue(oldValues.stepValue, this.stepValue);
            }
            if (this.isDirty('minValue')) {
                this._applyMinValue(oldValues.minValue, this.minValue);
            }
            if (this.isDirty('maxValue')) {
                this._applyMaxValue(oldValues.maxValue, this.maxValue);
            }
            super._applyProperties(oldValues);
        }
        _applyValue(_oldValue, newValue) {
            this.value = newValue;
            this._updateView();
            if (!this._preventTriggeringChangeEvent) {
                this.fire('change');
            }
        }
        _applyStepValue(_oldValue, newValue) {
            this.stepValue = newValue;
        }
        _applyMinValue(_oldValue, newValue) {
            this.minValue = newValue;
        }
        _applyMaxValue(_oldValue, newValue) {
            this.maxValue = newValue;
        }
        _updateView() {
            const display = this.value !== undefined ? String(this.value) : '';
            this.elements.lineEditor.value = display;
        }
        /**
         * Builds the view of the control.
         * @protected
         * @override
         */
        buildView() {
            this._preventTriggeringChangeEvent = true; // Prevent fire change event during the control build
            UIDom.addClassName(this.elements.container, 'sch-controls-bigint-spinbox');
            this.elements.leftContainer = UIDom.createElement('div', {
                className: 'sch-controls-bigint-spinbox-left-container',
                parent: this.elements.container
            });
            this.elements.rightContainer = UIDom.createElement('div', {
                className: 'sch-controls-bigint-spinbox-right-container',
                parent: this.elements.container
            });
            this.elements.lineEditor = new WUXLineEditor({
                placeholder: '',
                value: undefined,
                selectAllOnFocus: true
            });
            this.elements.leftContainer.appendChild(this.elements.lineEditor.getContent());
            this.elements.upButton = UIDom.createElement('button', {
                className: ['sch-controls-button', 'sch-up-button', 'wux-ui-3ds', 'wux-ui-3ds-1x', 'wux-ui-3ds-expand-up'],
                parent: this.elements.rightContainer,
                attributes: {
                    tabindex: -1,
                    name: 'Button',
                    type: 'button'
                }
            });
            this.elements.downButton = UIDom.createElement('button', {
                className: ['sch-controls-button', 'sch-down-button', 'wux-ui-3ds', 'wux-ui-3ds-1x', 'wux-ui-3ds-expand-down'],
                parent: this.elements.rightContainer,
                attributes: {
                    tabindex: -1,
                    name: 'Button',
                    type: 'button'
                }
            });
        }
        /**
         * The callback on the control post build view.
         * @public
         * @override
         */
        _postBuildView() {
            this._preventTriggeringChangeEvent = false; // Restore the change event dispatching
        }
        /**
         * Handles the control events.
         * @public
         * @override
         */
        handleEvents() {
            super.handleEvents();
            // TODO: Handle auto incrementing value when maintening click on button!
            WUXDomUtils.addEventOnElement(this, this.elements.upButton, 'click', () => {
                let value = this.value;
                value = value !== undefined ? value : BigInt(0); // Initialize to 0 if undefined
                value = value + this.stepValue; // Increase by given step value
                value = value > this.maxValue ? this.maxValue : value; // Crop to given max value
                this.value = value;
            });
            WUXDomUtils.addEventOnElement(this, this.elements.downButton, 'click', () => {
                let value = this.value;
                value = value !== undefined ? value : BigInt(0); // Initialize to 0 if undefined
                value = value - this.stepValue; // Decrease by given step value
                value = value < this.minValue ? this.minValue : value; // Crop to given min value
                this.value = value;
            });
            WUXDomUtils.addEventOnElement(this, this.elements.lineEditor.getContent(), 'blur', event => {
                event.stopPropagation();
                const value = this.elements.lineEditor.value;
                const reg = new RegExp(/^(\+?-?)[0-9]+$/);
                if (reg.test(value)) {
                    this.value = BigInt(value);
                }
            });
            WUXDomUtils.addEventOnElement(this, this.elements.lineEditor.getContent(), 'copy', this._onCopy.bind(this));
            WUXDomUtils.addEventOnElement(this, this.elements.lineEditor.getContent(), 'paste', this._onPaste.bind(this));
        }
        /**
         * The callback on the control copy event.
         * @public
         * @param {ClipboardEvent} event - The copy event.
         */
        // eslint-disable-next-line class-methods-use-this
        _onCopy(event) {
            if (event && event.clipboardData && event.target) {
                const inputElt = event.target;
                const stringValue = inputElt.value.substring(inputElt.selectionStart || 0, inputElt.selectionEnd || undefined);
                event.clipboardData.setData('text/plain', stringValue);
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
            if (event && event.clipboardData) {
                const data = event.clipboardData.getData('text/plain');
                this.elements.lineEditor.value = data;
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }
    WebUXComponents.addClass(UIBigIntSpinBox, 'UIBigIntSpinBox');
    return UIBigIntSpinBox;
});
