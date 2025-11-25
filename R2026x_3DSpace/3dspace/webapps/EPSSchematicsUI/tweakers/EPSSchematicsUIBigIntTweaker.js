/// <amd-module name='DS/EPSSchematicsUI/tweakers/EPSSchematicsUIBigIntTweaker'/>
define("DS/EPSSchematicsUI/tweakers/EPSSchematicsUIBigIntTweaker", ["require", "exports", "DS/Tweakers/TweakerBase", "DS/Utilities/Utils", "DS/Core/WebUXComponents", "DS/Utilities/Dom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/controls/EPSSchematicsUIBigIntSpinBox", "css!DS/EPSSchematicsUI/css/tweakers/EPSSchematicsUIBigIntTweaker"], function (require, exports, WUXTweakerBase, WUXUtils, WebUXComponents, WUXDomUtils, UIDom, UIBigIntSpinBox) {
    "use strict";
    const BaseViewModuleTweakerBase = WUXTweakerBase.prototype.baseViewModule;
    /**
     * This class defines the UI BigInt WUX tweaker.
     * @private
     * @class UIBigIntTweaker
     * @alias module:DS/EPSSchematicsUI/tweakers/EPSSchematicsUIBigIntTweaker
     * @extends WUXTweakerBase
     */
    class UIBigIntTweaker extends WUXTweakerBase {
        /**
         * @property {Object} publishedProperties - The default control properties.
         * @private
         * @static
         * @override
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
            if (this.isDirty('stepValue')) {
                this._applyStepValue(oldValues.stepValue, this.stepValue);
            }
            if (this.isDirty('minValue')) {
                this._applyMinValue(oldValues.minValue);
            }
            if (this.isDirty('maxValue')) {
                this._applyMaxValue(oldValues.maxValue);
            }
            super._applyProperties(oldValues);
        }
        _applyStepValue(_oldValue, newValue) {
            this.stepValue = BigInt(newValue);
        }
        _applyMinValue(_oldValue) {
            this.minValue = BigInt(this._properties.minValue?.value);
        }
        _applyMaxValue(_oldValue) {
            this.maxValue = BigInt(this._properties.maxValue?.value);
        }
    }
    const BaseViewModuleBigIntTweaker = function (tweaker, options) {
        BaseViewModuleTweakerBase.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(BaseViewModuleBigIntTweaker, BaseViewModuleTweakerBase);
    BaseViewModuleBigIntTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            UIDom.addClassName(this._tweaker.elements.container, ['sch-tweakers-bigint', 'wux-tweakers-domleaf']);
            this._view = new UIBigIntSpinBox();
            this._view.setProperties({
                value: this._tweaker.value,
                stepValue: this._tweaker.stepValue,
                minValue: this._tweaker.minValue,
                maxValue: this._tweaker.maxValue
            });
        }
    };
    BaseViewModuleBigIntTweaker.prototype.destroy = function () {
        if (this._tweaker.elements.container) {
            UIDom.removeClassName(this._tweaker.elements.container, ['sch-tweakers-bigint', 'wux-tweakers-domleaf']);
        }
        BaseViewModuleTweakerBase.prototype.destroy.call(this);
    };
    BaseViewModuleBigIntTweaker.prototype.setValue = function (newValue, _oldValue) {
        this._view.value = newValue;
    };
    BaseViewModuleBigIntTweaker.prototype.handleEvents = function () {
        WUXDomUtils.addEventOnElement(this._tweaker, this._view, 'change', event => {
            event.stopPropagation();
            this.setTweakerValue(this._view.value);
        });
        /*WUXDomUtils.addEventOnElement(this._tweaker, this._view, 'focus', event => {
            event.stopPropagation();
        });*/
    };
    UIBigIntTweaker.prototype.baseViewModule = BaseViewModuleBigIntTweaker;
    const ReadOnlyViewModuleBigIntTweaker = function (tweaker, options) {
        BaseViewModuleTweakerBase.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(ReadOnlyViewModuleBigIntTweaker, BaseViewModuleTweakerBase);
    ReadOnlyViewModuleBigIntTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            UIDom.addClassName(this._tweaker.elements.container, ['sch-tweakers-bigint', 'sch-tweakers-bigint-readonly', 'wux-tweakers-domleaf']);
            const isBigInt = typeof this._tweaker.value === 'bigint';
            const valueToDisplay = isBigInt ? this._tweaker.value.toString() : '';
            this._tweaker.elements.container.textContent = valueToDisplay;
        }
    };
    ReadOnlyViewModuleBigIntTweaker.prototype.destroy = function () {
        if (this._tweaker.elements.container) {
            UIDom.removeClassName(this._tweaker.elements.container, ['sch-tweakers-bigint', 'sch-tweakers-bigint-readonly', 'wux-tweakers-domleaf']);
            this._tweaker.elements.container.textContent = '';
        }
        BaseViewModuleTweakerBase.prototype.destroy.call(this);
    };
    ReadOnlyViewModuleBigIntTweaker.prototype.setValue = function (newValue, _oldValue) {
        if (this._tweaker.elements.container) {
            const isBigInt = typeof newValue === 'bigint' || typeof newValue === 'number';
            const valueToDisplay = isBigInt ? newValue.toString() : '';
            this._tweaker.elements.container.textContent = valueToDisplay;
        }
    };
    UIBigIntTweaker.prototype.VIEW_MODULES = {
        edition: { classObject: BaseViewModuleBigIntTweaker },
        readOnly: { classObject: ReadOnlyViewModuleBigIntTweaker }
    };
    WebUXComponents.addClass(UIBigIntTweaker, 'UIBigIntTweaker');
    return UIBigIntTweaker;
});
