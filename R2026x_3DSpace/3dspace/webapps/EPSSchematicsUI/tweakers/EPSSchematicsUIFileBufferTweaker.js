/// <amd-module name='DS/EPSSchematicsUI/tweakers/EPSSchematicsUIFileBufferTweaker'/>
define("DS/EPSSchematicsUI/tweakers/EPSSchematicsUIFileBufferTweaker", ["require", "exports", "DS/Tweakers/TweakerBase", "DS/Core/WebUXComponents", "DS/Utilities/Utils", "DS/Utilities/Dom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/controls/EPSSchematicsUIFileBufferEditor", "css!DS/EPSSchematicsUI/css/tweakers/EPSSchematicsUIFileBufferTweaker"], function (require, exports, WUXTweakerBase, WebUXComponents, WUXUtils, WUXDomUtils, UIDom, UITools, UIFileBufferEditor) {
    "use strict";
    const BaseViewModuleTweakerBase = WUXTweakerBase.prototype.baseViewModule;
    /**
     * This class defines the UI FileBuffer WUX tweaker.
     * @private
     * @class UIFileBufferTweaker
     * @alias module:DS/EPSSchematicsUI/tweakers/EPSSchematicsUIFileBufferTweaker
     * @extends WUXTweakerBase
     */
    class UIFileBufferTweaker extends WUXTweakerBase {
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
                    type: 'ArrayBuffer',
                    category: 'Behavior',
                    advancedSetter: false
                }
            };
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
        }
    }
    const BaseViewModuleFileBufferTweaker = function (tweaker, options) {
        BaseViewModuleTweakerBase.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(BaseViewModuleFileBufferTweaker, BaseViewModuleTweakerBase);
    BaseViewModuleFileBufferTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            UIDom.addClassName(this._tweaker.elements.container, 'sch-tweakers-filebuffer');
            this._view = new UIFileBufferEditor();
            this._view.setProperties({
                value: this._tweaker.value
            });
        }
    };
    BaseViewModuleFileBufferTweaker.prototype.destroy = function () {
        if (this._tweaker.elements.container) {
            UIDom.removeClassName(this._tweaker.elements.container, 'sch-tweakers-filebuffer');
        }
        BaseViewModuleTweakerBase.prototype.destroy.call(this);
    };
    BaseViewModuleFileBufferTweaker.prototype.setValue = function (newValue, _oldValue) {
        this._view.value = newValue;
    };
    BaseViewModuleFileBufferTweaker.prototype.handleEvents = function () {
        WUXDomUtils.addEventOnElement(this._tweaker, this._view, 'change', event => {
            event.stopPropagation();
            WUXDomUtils.pushUserInteractionContext();
            this.setTweakerValue(this._view.value);
            WUXDomUtils.popUserInteractionContext();
        });
    };
    UIFileBufferTweaker.prototype.baseViewModule = BaseViewModuleFileBufferTweaker;
    const ReadOnlyViewModuleFileBufferTweaker = function (tweaker, options) {
        BaseViewModuleTweakerBase.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(ReadOnlyViewModuleFileBufferTweaker, BaseViewModuleTweakerBase);
    ReadOnlyViewModuleFileBufferTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            UIDom.addClassName(this._tweaker.elements.container, ['sch-tweakers-filebuffer', 'sch-tweakers-filebuffer-readonly']);
            const valueToDisplay = UITools.buildJSONString(this._tweaker.value);
            this._tweaker.elements.container.textContent = valueToDisplay;
        }
    };
    ReadOnlyViewModuleFileBufferTweaker.prototype.destroy = function () {
        if (this._tweaker.elements.container) {
            UIDom.removeClassName(this._tweaker.elements.container, ['sch-tweakers-filebuffer', 'sch-tweakers-filebuffer-readonly']);
            this._tweaker.elements.container.textContent = '';
        }
        BaseViewModuleTweakerBase.prototype.destroy.call(this);
    };
    ReadOnlyViewModuleFileBufferTweaker.prototype.setValue = function (newValue, _oldValue) {
        if (this._tweaker.elements.container) {
            const valueToDisplay = UITools.buildJSONString(newValue);
            this._tweaker.elements.container.textContent = valueToDisplay;
        }
    };
    UIFileBufferTweaker.prototype.VIEW_MODULES = {
        edition: { classObject: BaseViewModuleFileBufferTweaker },
        readOnly: { classObject: ReadOnlyViewModuleFileBufferTweaker }
    };
    WebUXComponents.addClass(UIFileBufferTweaker, 'UIFileBufferTweaker');
    return UIFileBufferTweaker;
});
