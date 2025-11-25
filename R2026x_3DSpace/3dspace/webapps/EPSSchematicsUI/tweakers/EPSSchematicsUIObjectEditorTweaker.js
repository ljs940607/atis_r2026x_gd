/// <amd-module name='DS/EPSSchematicsUI/tweakers/EPSSchematicsUIObjectEditorTweaker'/>
define("DS/EPSSchematicsUI/tweakers/EPSSchematicsUIObjectEditorTweaker", ["require", "exports", "DS/Tweakers/TweakerBase", "DS/Utilities/Utils", "DS/Utilities/Dom", "DS/Core/WebUXComponents", "DS/EPSSchematicsUI/controls/EPSSchematicsUIObjectEditor", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/tweakers/EPSSchematicsUIObjectEditorTweaker"], function (require, exports, WUXTweakerBase, WUXUtils, WUXDomUtils, WebUXComponents, UIObjectEditor, UIDom) {
    "use strict";
    const BaseViewModuleTweakerBase = WUXTweakerBase.prototype.baseViewModule;
    /**
     * This class defines the UI object editor WUX tweaker.
     * @private
     * @class UIObjectEditorTweaker
     * @alias module:DS/EPSSchematicsUI/tweakers/EPSSchematicsUIObjectEditorTweaker
     * @extends WUXTweakerBase
     */
    class UIObjectEditorTweaker extends WUXTweakerBase {
        /**
         * @private
         * @static
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
                displayStyle: {
                    defaultValue: 'edition',
                    type: 'string'
                },
                editor: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                objectName: {
                    defaultValue: '',
                    type: 'string',
                    category: 'Behavior'
                },
                valueType: {
                    defaultValue: '',
                    type: 'string',
                    category: 'Behavior'
                }
            };
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
            if (this.isDirty('valueType')) {
                this._applyValueType(oldValues.valueType, this.valueType);
            }
            if (this.isDirty('objectName')) {
                this._applyObjectName(oldValues.objectName, this.objectName);
            }
            /*if (this.isDirty('value')) {
                this._applyValue(oldValues.value, this.value);
            }
            if (this.isDirty('valueType')) {
                this._applyValueType(oldValues.valueType, this.valueType);
            }
            if (this.isDirty('objectName')) {
                this._applyObjectName(oldValues.objectName, this.objectName);
            }
            super._applyProperties(oldValues);*/
        }
        /*public _applyValue(oldValue: any, newValue?: any): void {
            if (this.elements._viewModule) {
                this.elements._viewModule.setValue(newValue, oldValue);
            }
            super._applyValue(oldValue, newValue);
        }*/
        _applyValueType(oldValue, newValue) {
            if (this.elements._viewModule) {
                this.elements._viewModule.setValueType(newValue, oldValue);
            }
        }
        _applyObjectName(oldValue, newValue) {
            if (this.elements._viewModule) {
                this.elements._viewModule.setObjectName(newValue, oldValue);
            }
        }
    }
    const BaseViewModuleObjectEditorTweaker = function (tweaker, options) {
        BaseViewModuleTweakerBase.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(BaseViewModuleObjectEditorTweaker, BaseViewModuleTweakerBase);
    BaseViewModuleObjectEditorTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            UIDom.addClassName(this._tweaker.elements.container, 'sch-tweakers-object-editor');
            this._view = new UIObjectEditor();
            this._view.setProperties({
                editor: this._tweaker.editor,
                objectName: this._tweaker.objectName,
                valueType: this._tweaker.valueType,
                value: this._tweaker.value,
                readOnly: false
            });
        }
    };
    BaseViewModuleObjectEditorTweaker.prototype.destroy = function () {
        if (this._tweaker.elements.container) {
            UIDom.removeClassName(this._tweaker.elements.container, 'sch-tweakers-object-editor');
        }
        BaseViewModuleTweakerBase.prototype.destroy.call(this);
    };
    BaseViewModuleObjectEditorTweaker.prototype.setValue = function (newValue, _oldValue) {
        this._view.value = newValue;
    };
    BaseViewModuleObjectEditorTweaker.prototype.setValueType = function (newValue, _oldValue) {
        this._view.valueType = newValue;
    };
    BaseViewModuleObjectEditorTweaker.prototype.setObjectName = function (newValue, _oldValue) {
        this._view.objectName = newValue;
    };
    BaseViewModuleObjectEditorTweaker.prototype.handleEvents = function () {
        WUXDomUtils.addEventOnElement(this._tweaker, this._view, 'change', event => {
            event.stopPropagation();
            this.setTweakerValue(this._view.value);
        });
    };
    UIObjectEditorTweaker.prototype.baseViewModule = BaseViewModuleObjectEditorTweaker;
    const ReadOnlyViewModuleObjectEditorTweaker = function (tweaker, options) {
        this._objectEditor = undefined;
        BaseViewModuleTweakerBase.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(ReadOnlyViewModuleObjectEditorTweaker, BaseViewModuleTweakerBase);
    ReadOnlyViewModuleObjectEditorTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            UIDom.addClassName(this._tweaker.elements.container, 'wux-tweakers-string-label');
            //this._tweaker.elements.container.textContent = JSON.stringify(this._tweaker.value);
            this._objectEditor = new UIObjectEditor();
            this._objectEditor.setProperties({
                editor: this._tweaker.editor,
                objectName: this._tweaker.objectName,
                valueType: this._tweaker.valueType,
                value: this._tweaker.value,
                readOnly: true
            });
            this._tweaker.elements.container.appendChild(this._objectEditor.getContent());
        }
    };
    ReadOnlyViewModuleObjectEditorTweaker.prototype.destroy = function () {
        if (this._tweaker.elements.container) {
            UIDom.removeClassName(this._tweaker.elements.container, 'wux-tweakers-string-label');
            this._tweaker.elements.container.removeChild(this._objectEditor.getContent());
            this._objectEditor = undefined;
        }
        BaseViewModuleTweakerBase.prototype.destroy.call(this);
    };
    ReadOnlyViewModuleObjectEditorTweaker.prototype.setValue = function (newValue, _oldValue) {
        if (this._tweaker.elements.container) {
            //this._tweaker.elements.container.textContent = newValue !== undefined ? JSON.stringify(newValue) : undefined;
            this._objectEditor.value = newValue;
        }
    };
    ReadOnlyViewModuleObjectEditorTweaker.prototype.setValueType = function (newValue, _oldValue) {
        if (this._tweaker.elements.container) {
            this._objectEditor.valueType = newValue;
        }
    };
    ReadOnlyViewModuleObjectEditorTweaker.prototype.setObjectName = function (newValue, _oldValue) {
        if (this._tweaker.elements.container) {
            this._objectEditor.objectName = newValue;
        }
    };
    UIObjectEditorTweaker.prototype.VIEW_MODULES = {
        edition: { classObject: BaseViewModuleObjectEditorTweaker, options: { viewOptions: { displayStyle: 'edition' } } },
        readOnly: { classObject: ReadOnlyViewModuleObjectEditorTweaker }
    };
    WebUXComponents.addClass(UIObjectEditorTweaker, 'UIObjectEditorTweaker');
    return UIObjectEditorTweaker;
});
