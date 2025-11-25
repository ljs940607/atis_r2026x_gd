/// <amd-module name='DS/EPSSchematicsUI/tweakers/EPSSchematicsUIDGVActionBarTweaker'/>
define("DS/EPSSchematicsUI/tweakers/EPSSchematicsUIDGVActionBarTweaker", ["require", "exports", "DS/Tweakers/TweakerBase", "DS/Core/WebUXComponents", "DS/Utilities/Utils", "DS/Utilities/Dom", "DS/EPSSchematicsUI/controls/EPSSchematicsUIDGVActionBar"], function (require, exports, WUXTweakerBase, WebUXComponents, WUXUtils, WUXDomUtils, UIDGVActionBar) {
    "use strict";
    /**
     * This class defines the UI data grid view action bar WUX tweaker.
     * @private
     * @class UIDGVActionBarTweaker
     * @alias DS/EPSSchematicsUI/tweakers/EPSSchematicsUIDGVActionBarTweaker
     * @extends WUXTweakerBase
     */
    class UIDGVActionBarTweaker extends WUXTweakerBase {
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
                    category: 'Behavior'
                },
                displayStyle: {
                    defaultValue: 'myStyle',
                    type: 'string'
                },
                count: {
                    defaultValue: undefined,
                    type: 'number',
                    category: 'Behavior'
                },
                addButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                removeButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                resetButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                undefinedButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                emptyArrayButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                emptyObjectButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                }
            };
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
            if (this.isDirty('count')) {
                this._applyCount(oldValues.count, this.count);
            }
            if (this.isDirty('addButtonDefinition')) {
                this._applyAddButtonDefinition(oldValues.addButtonDefinition, this.addButtonDefinition);
            }
            if (this.isDirty('removeButtonDefinition')) {
                this._applyRemoveButtonDefinition(oldValues.removeButtonDefinition, this.removeButtonDefinition);
            }
            if (this.isDirty('resetButtonDefinition')) {
                this._applyResetButtonDefinition(oldValues.resetButtonDefinition, this.resetButtonDefinition);
            }
            if (this.isDirty('undefinedButtonDefinition')) {
                this._applyUndefinedButtonDefinition(oldValues.undefinedButtonDefinition, this.undefinedButtonDefinition);
            }
            if (this.isDirty('emptyArrayButtonDefinition')) {
                this._applyEmptyArrayButtonDefinition(oldValues.emptyArrayButtonDefinition, this.emptyArrayButtonDefinition);
            }
            if (this.isDirty('emptyObjectButtonDefinition')) {
                this._applyEmptyObjectButtonDefinition(oldValues.emptyObjectButtonDefinition, this.emptyObjectButtonDefinition);
            }
        }
        _applyCount(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setCount(newValue, oldValue);
            }
        }
        _applyAddButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setAddButtonDefinition(newValue, oldValue);
            }
        }
        _applyRemoveButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setRemoveButtonDefinition(newValue, oldValue);
            }
        }
        _applyResetButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setResetButtonDefinition(newValue, oldValue);
            }
        }
        _applyUndefinedButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setUndefinedButtonDefinition(newValue, oldValue);
            }
        }
        _applyEmptyArrayButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setEmptyArrayButtonDefinition(newValue, oldValue);
            }
        }
        _applyEmptyObjectButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setEmptyObjectButtonDefinition(newValue, oldValue);
            }
        }
    }
    const BaseViewModuleDGVActionBarTweaker = function (tweaker, options) {
        WUXTweakerBase.prototype.baseViewModule.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(BaseViewModuleDGVActionBarTweaker, WUXTweakerBase.prototype.baseViewModule);
    BaseViewModuleDGVActionBarTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            this._view = new UIDGVActionBar();
            this._view.setProperties({
                count: this._tweaker.count,
                addButtonDefinition: this._tweaker.addButtonDefinition,
                removeButtonDefinition: this._tweaker.removeButtonDefinition,
                resetButtonDefinition: this._tweaker.resetButtonDefinition,
                undefinedButtonDefinition: this._tweaker.undefinedButtonDefinition,
                emptyArrayButtonDefinition: this._tweaker.emptyArrayButtonDefinition,
                emptyObjectButtonDefinition: this._tweaker.emptyObjectButtonDefinition
            });
        }
    };
    BaseViewModuleDGVActionBarTweaker.prototype.setValue = function (newValue, _oldValue) {
        this._view.value = newValue;
    };
    BaseViewModuleDGVActionBarTweaker.prototype.setCount = function (newValue, _oldValue) {
        this._view.count = newValue;
    };
    BaseViewModuleDGVActionBarTweaker.prototype.setAddButtonDefinition = function (newValue, _oldValue) {
        this._view.addButtonDefinition = newValue;
    };
    BaseViewModuleDGVActionBarTweaker.prototype.setRemoveButtonDefinition = function (newValue, _oldValue) {
        this._view.removeButtonDefinition = newValue;
    };
    BaseViewModuleDGVActionBarTweaker.prototype.setResetButtonDefinition = function (newValue, _oldValue) {
        this._view.resetButtonDefinition = newValue;
    };
    BaseViewModuleDGVActionBarTweaker.prototype.setUndefinedButtonDefinition = function (newValue, _oldValue) {
        this._view.undefinedButtonDefinition = newValue;
    };
    BaseViewModuleDGVActionBarTweaker.prototype.setEmptyArrayButtonDefinition = function (newValue, _oldValue) {
        this._view.emptyArrayButtonDefinition = newValue;
    };
    BaseViewModuleDGVActionBarTweaker.prototype.setEmptyObjectButtonDefinition = function (newValue, _oldValue) {
        this._view.emptyObjectButtonDefinition = newValue;
    };
    BaseViewModuleDGVActionBarTweaker.prototype.handleEvents = function () {
        WUXDomUtils.addEventOnElement(this._tweaker, this._view, 'change', event => {
            event.stopPropagation();
            this.setTweakerValue(this._view.value);
        });
    };
    UIDGVActionBarTweaker.prototype.baseViewModule = BaseViewModuleDGVActionBarTweaker;
    UIDGVActionBarTweaker.prototype.VIEW_MODULES = {
        myStyle: { classObject: BaseViewModuleDGVActionBarTweaker, options: { viewOptions: { displayStyle: 'myStyle' } } }
    };
    WebUXComponents.addClass(UIDGVActionBarTweaker, 'UIDGVActionBarTweaker');
    return UIDGVActionBarTweaker;
});
