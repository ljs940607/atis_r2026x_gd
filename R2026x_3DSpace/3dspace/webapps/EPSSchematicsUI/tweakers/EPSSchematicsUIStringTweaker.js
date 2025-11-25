/// <amd-module name='DS/EPSSchematicsUI/tweakers/EPSSchematicsUIStringTweaker'/>
define("DS/EPSSchematicsUI/tweakers/EPSSchematicsUIStringTweaker", ["require", "exports", "DS/Tweakers/TweakerBase", "DS/Tweakers/StringViewModules", "DS/Utilities/Utils", "DS/Core/WebUXComponents", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/tweakers/EPSSchematicsUIStringTweaker"], function (require, exports, WUXTweakerBase, StringViewModules, WUXUtils, WebUXComponents, UIDom) {
    "use strict";
    const BaseViewModuleTweakerBase = WUXTweakerBase.prototype.baseViewModule;
    /**
     * This class defines the UI string WUX tweaker.
     * @private
     * @class UIStringTweaker
     * @alias module:DS/EPSSchematicsUI/tweakers/EPSSchematicsUIStringTweaker
     * @extends WUXTweakerBase
     */
    class UIStringTweaker extends WUXTweakerBase {
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
                    type: 'string',
                    category: 'Behavior',
                    advancedSetter: false
                }
            };
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
        }
    }
    const ReadOnlyViewModuleStringTweaker = function (tweaker, options) {
        BaseViewModuleTweakerBase.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(ReadOnlyViewModuleStringTweaker, BaseViewModuleTweakerBase);
    ReadOnlyViewModuleStringTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            UIDom.addClassName(this._tweaker.elements.container, ['wux-tweakers-string-label', 'sch-tweakers-string-readonly']);
            let valueToDisplay = this.formatText(this._tweaker.value);
            this._tweaker.elements.container.textContent = valueToDisplay;
        }
    };
    ReadOnlyViewModuleStringTweaker.prototype.destroy = function () {
        if (this._tweaker.elements.container) {
            this._tweaker.elements.container.textContent = '';
            UIDom.removeClassName(this._tweaker.elements.container, ['wux-tweakers-string-label', 'sch-tweakers-string-readonly']);
            UIDom.removeClassName(this._tweaker.elements.container, 'sch-tweakers-string-undefined');
        }
        BaseViewModuleTweakerBase.prototype.destroy.call(this);
    };
    ReadOnlyViewModuleStringTweaker.prototype.setValue = function (newValue, _oldValue) {
        if (this._tweaker.elements.container) {
            let valueToDisplay = this.formatText(newValue);
            this._tweaker.elements.container.textContent = valueToDisplay;
        }
    };
    ReadOnlyViewModuleStringTweaker.prototype.formatText = function (value) {
        let formattedText = '';
        if (value !== undefined) {
            formattedText = this._tweaker.value.toString();
            formattedText = formattedText.replaceAll('\n', '\u21B5'); // Unicode characters for '↵'
            UIDom.removeClassName(this._tweaker.elements.container, 'sch-tweakers-string-undefined');
        }
        else {
            UIDom.addClassName(this._tweaker.elements.container, 'sch-tweakers-string-undefined');
        }
        return formattedText;
    };
    UIStringTweaker.prototype.baseViewModule = StringViewModules.Base;
    UIStringTweaker.prototype.VIEW_MODULES = {
        edition: { classObject: StringViewModules.LineEditorDotsEditor, options: { viewOptions: { displayPopupOnCreation: true } } },
        readOnly: { classObject: ReadOnlyViewModuleStringTweaker }
    };
    WebUXComponents.addClass(UIStringTweaker, 'UIStringTweaker');
    return UIStringTweaker;
});
