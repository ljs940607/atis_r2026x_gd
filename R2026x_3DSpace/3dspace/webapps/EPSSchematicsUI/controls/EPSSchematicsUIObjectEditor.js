/// <amd-module name='DS/EPSSchematicsUI/controls/EPSSchematicsUIObjectEditor'/>
define("DS/EPSSchematicsUI/controls/EPSSchematicsUIObjectEditor", ["require", "exports", "DS/Controls/Abstract", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/Core/WebUXComponents", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIObjectEditorDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "css!DS/EPSSchematicsUI/css/controls/EPSSchematicsUIObjectEditor"], function (require, exports, WUXAbstract, UIDom, WebUXComponents, UIObjectEditorDialog, UITools) {
    "use strict";
    /**
     * This class defines the UI object editor WUX control.
     * @private
     * @class UIObjectEditor
     * @alias DS/EPSSchematicsUI/controls/EPSSchematicsUIObjectEditor
     * @extends WUXAbstract
     */
    class UIObjectEditor extends WUXAbstract {
        /**
         * @public
         * @constructor
         */
        constructor() {
            super();
        }
        /**
         * @private
         * @override
         * @property {Object} publishedProperties - The default control properties.
         */
        static get publishedProperties() {
            return {
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
                },
                value: {
                    defaultValue: '',
                    type: 'string',
                    category: 'Behavior'
                },
                readOnly: {
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
            if (this._dialog !== undefined) {
                this._dialog.remove();
                this._dialog = undefined;
            }
            return super.remove();
        }
        /**
         * Applies the value property.
         * @public
         * @param {string} _oldValue - The old value property.
         * @param {string} newValue - The new value property.
         */
        _applyValue(_oldValue, newValue) {
            this.value = newValue;
            this._refreshDisplayedValue();
            if (!this._preventTriggeringChangeEvent) {
                this.fire('change');
            }
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
            if (this.isDirty('value')) {
                this._refreshDisplayedValue();
            }
        }
        _refreshDisplayedValue() {
            this.elements.input.value = UITools.buildJSONString(this.value);
        }
        /**
         * Builds the view of the control.
         * @protected
         * @override
         */
        buildView() {
            UIDom.addClassName(this.elements.container, 'sch-controls-objecteditor');
            this.elements.input = UIDom.createElement('input', {
                className: 'sch-controls-objecteditor-input',
                parent: this.elements.container,
                attributes: { type: 'text', spellcheck: false },
                readOnly: true
            });
            this.elements.button = UIDom.createElement('button', {
                className: 'sch-controls-objecteditor-button',
                parent: this.elements.container,
                textContent: '...',
                onclick: () => {
                    this._dialog = new UIObjectEditorDialog(this.editor, this.objectName, this.valueType, this.value, this.readOnly, defaultValue => {
                        if (!this.readOnly) {
                            this.value = defaultValue;
                        }
                    });
                    this._dialog.open();
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
         * Gets the object editor dialog.
         * @public
         * @returns {UIObjectEditorDialog} The object editor dialog.
         */
        getUIDialog() {
            return this._dialog;
        }
    }
    WebUXComponents.addClass(UIObjectEditor, 'UIObjectEditor');
    return UIObjectEditor;
});
