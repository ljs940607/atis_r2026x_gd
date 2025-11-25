/// <amd-module name='DS/EPSSchematicsUI/tweakers/EPSSchematicsUIJSONTweaker'/>
define("DS/EPSSchematicsUI/tweakers/EPSSchematicsUIJSONTweaker", ["require", "exports", "DS/Tweakers/TweakerBase", "DS/Utilities/Utils", "DS/Core/WebUXComponents", "DS/Utilities/Dom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/controls/EPSSchematicsUIJSONViewer", "css!DS/EPSSchematicsUI/css/tweakers/EPSSchematicsUIJSONTweaker"], function (require, exports, WUXTweakerBase, WUXUtils, WebUXComponents, WUXDomUtils, UIDom, UIJSONViewer) {
    "use strict";
    const BaseViewModuleTweakerBase = WUXTweakerBase.prototype.baseViewModule;
    /**
     * This class defines the UI JSON WUX tweaker.
     * @private
     * @class UIJSONTweaker
     * @alias module:DS/EPSSchematicsUI/tweakers/EPSSchematicsUIJSONTweaker
     * @extends WUXTweakerBase
     */
    class UIJSONTweaker extends WUXTweakerBase {
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
                    type: 'object',
                    category: 'Behavior',
                    advancedSetter: false
                },
                valueType: {
                    defaultValue: '',
                    type: 'string',
                    category: 'Behavior',
                    advancedSetter: false
                },
                graphContext: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior',
                    advancedSetter: false
                }
            };
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
            if (this.isDirty('valueType')) {
                this._applyValueType(oldValues.valueType, this.valueType);
            }
            if (this.isDirty('graphContext')) {
                this._applyGraphContext(oldValues.graphContext, this.graphContext);
            }
        }
        _applyValue(oldValue, newValue) {
            if (this.elements._viewModule) {
                this.elements._viewModule.setValue(newValue, oldValue);
            }
            super._applyValue(oldValue, newValue);
        }
        _applyValueType(oldValue, newValue) {
            if (this.elements._viewModule) {
                this.elements._viewModule.setValueType(newValue, oldValue);
            }
        }
        _applyGraphContext(oldValue, newValue) {
            if (this.elements._viewModule) {
                this.elements._viewModule.setGraphContext(newValue, oldValue);
            }
        }
    }
    const BaseViewModuleUIJSONTweaker = function (tweaker, options) {
        BaseViewModuleTweakerBase.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(BaseViewModuleUIJSONTweaker, BaseViewModuleTweakerBase);
    BaseViewModuleUIJSONTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            UIDom.addClassName(this._tweaker.elements.container, 'sch-tweakers-json');
            //this._tweaker.elements.container.textContent = UITools.buildJSONString(this._tweaker.value);
            this._view = new UIJSONViewer();
            this._view.setProperties({
                value: this._tweaker.value,
                valueType: this._tweaker.valueType,
                graphContext: this._tweaker.graphContext,
                readOnly: this._tweaker.readOnly
            });
        }
    };
    BaseViewModuleUIJSONTweaker.prototype.destroy = function () {
        if (this._tweaker.elements.container) {
            UIDom.removeClassName(this._tweaker.elements.container, 'sch-tweakers-json');
            //this._tweaker.elements.container.textContent = '';
        }
        BaseViewModuleTweakerBase.prototype.destroy.call(this);
    };
    BaseViewModuleUIJSONTweaker.prototype.setValue = function (newValue, _oldValue) {
        //this._tweaker.elements.container.textContent = UITools.buildJSONString(newValue);
        this._view.value = newValue;
    };
    BaseViewModuleUIJSONTweaker.prototype.setValueType = function (newValue, _oldValue) {
        this._view.valueType = newValue;
    };
    BaseViewModuleUIJSONTweaker.prototype.setGraphContext = function (newValue, _oldValue) {
        this._view.graphContext = newValue;
    };
    BaseViewModuleUIJSONTweaker.prototype.handleEvents = function () {
        WUXDomUtils.addEventOnElement(this._tweaker, this._view, 'jsonLoad', event => {
            event.stopPropagation();
            WUXDomUtils.pushUserInteractionContext();
            this.setTweakerValue(this._view.jsonFileValue);
            WUXDomUtils.popUserInteractionContext();
        });
    };
    UIJSONTweaker.prototype.baseViewModule = BaseViewModuleUIJSONTweaker;
    UIJSONTweaker.prototype.VIEW_MODULES = {
        edition: { classObject: BaseViewModuleUIJSONTweaker },
        readOnly: { classObject: BaseViewModuleUIJSONTweaker }
    };
    WebUXComponents.addClass(UIJSONTweaker, 'UIJSONTweaker');
    return UIJSONTweaker;
});
