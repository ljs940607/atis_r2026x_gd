/// <amd-module name='DS/EPSSchematicsUI/tweakers/EPSSchematicsUIValueTypeComboTweaker'/>
define("DS/EPSSchematicsUI/tweakers/EPSSchematicsUIValueTypeComboTweaker", ["require", "exports", "DS/Tweakers/TweakerBase", "DS/Utilities/Utils", "DS/Utilities/Dom", "DS/Core/WebUXComponents", "DS/EPSSchematicsUI/controls/EPSSchematicsUIValueTypeCombo"], function (require, exports, WUXTweakerBase, WUXUtils, WUXDomUtils, WebUXComponents, UIValueTypeCombo) {
    "use strict";
    /**
     * This class defines the UI value type combobox WUX tweaker.
     * @class UIValueTypeComboTweaker
     * @alias DS/EPSSchematicsUI/tweakers/EPSSchematicsUIValueTypeComboTweaker
     * @extends WUXTweakerBase
     * @private
     */
    class UIValueTypeComboTweaker extends WUXTweakerBase {
        /**
         * @property {Object} publishedProperties - The default control properties.
         * @private
         * @static
         * @override
         */
        static get publishedProperties() {
            return {
                value: {
                    defaultValue: '',
                    type: 'string',
                    advancedSetter: true
                },
                displayStyle: {
                    defaultValue: 'myStyle',
                    type: 'string'
                },
                possibleValues: {
                    defaultValue: [],
                    type: 'array'
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
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
            if (this.isDirty('showTypeLibraryButton')) {
                this._applyShowTypeLibraryButton(oldValues.showTypeLibraryButton, this.showTypeLibraryButton);
            }
        }
        _applyShowTypeLibraryButton(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setShowTypeLibraryButton(newValue, oldValue);
            }
        }
    }
    const BaseViewModuleValueTypeComboTweaker = function (tweaker, options) {
        WUXTweakerBase.prototype.baseViewModule.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(BaseViewModuleValueTypeComboTweaker, WUXTweakerBase.prototype.baseViewModule);
    BaseViewModuleValueTypeComboTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            this._view = new UIValueTypeCombo();
            this._view.getContent().addClassName('sch-tweakers-typecombo');
            this.setValue(this._tweaker.value);
            this._view.possibleValues = this._tweaker.possibleValues;
            this._view.editor = this._tweaker.editor;
            this._view.dataPort = this._tweaker.dataPort;
            this._view.showCreateUserTypeButton = this._tweaker.showCreateUserTypeButton;
            this._view.showTypeLibraryButton = this._tweaker.showTypeLibraryButton;
        }
    };
    BaseViewModuleValueTypeComboTweaker.prototype.setValue = function (newValue /*, oldValue: any*/) {
        this._view.value = newValue;
    };
    BaseViewModuleValueTypeComboTweaker.prototype.setShowTypeLibraryButton = function (newValue /*, oldValue: any*/) {
        this._view.showTypeLibraryButton = newValue;
    };
    BaseViewModuleValueTypeComboTweaker.prototype.handleEvents = function () {
        WUXDomUtils.addEventOnElement(this._tweaker, this._view, 'change', event => {
            event.stopPropagation();
            this.setTweakerValue(this._view.value);
        });
    };
    UIValueTypeComboTweaker.prototype.baseViewModule = BaseViewModuleValueTypeComboTweaker;
    UIValueTypeComboTweaker.prototype.VIEW_MODULES = {
        myStyle: { classObject: BaseViewModuleValueTypeComboTweaker, options: { viewOptions: { displayStyle: 'myStyle' } } }
    };
    WebUXComponents.addClass(UIValueTypeComboTweaker, 'UIValueTypeComboTweaker');
    return UIValueTypeComboTweaker;
});
