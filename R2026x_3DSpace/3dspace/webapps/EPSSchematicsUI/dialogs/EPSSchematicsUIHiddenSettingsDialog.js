/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIHiddenSettingsDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIHiddenSettingsDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBaseDialog", "DS/Controls/ButtonGroup", "DS/Controls/Toggle"], function (require, exports, UIBaseDialog, WUXButtonGroup, WUXToggle) {
    "use strict";
    /**
     * This class defines a UI hidden settings dialog.
     * @private
     * @class UIHiddenSettingsDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIHiddenSettingsDialog
     * @extends UIBaseDialog
     */
    class UIHiddenSettingsDialog extends UIBaseDialog {
        /**
         * @public
         * @constructor
         * @param {ImmersiveFrame} immersiveFrame - The WUX immersive frame.
         * @param {UISessionStorageController} sessionStorageController - The session storage controller.
         */
        constructor(immersiveFrame, sessionStorageController) {
            super({
                title: 'Hidden Settings',
                className: 'sch-hidden-settings-dialog',
                icon: 'cog',
                immersiveFrame: immersiveFrame,
                modalFlag: true
            });
            this._sessionStorageController = sessionStorageController;
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            this._sessionStorageController = undefined;
            super.remove();
        }
        /**
         * Creates the dialog content.
         * @protected
         */
        _onCreateContent() {
            const hiddenSettings = this._sessionStorageController.getHiddenSettingsValue();
            const buttonGroup = new WUXButtonGroup({ type: 'checkbox' });
            Object.keys(hiddenSettings).forEach((settingName, index) => {
                const settingValue = hiddenSettings[settingName];
                const toggle = new WUXToggle({ type: 'switch', label: settingName, checkFlag: settingValue });
                toggle.addEventListener('change', (event) => {
                    this._sessionStorageController.setHiddenSettingValue(settingName, event.dsModel.checkFlag);
                });
                buttonGroup.addChild(toggle, index);
            });
            buttonGroup.inject(this._content);
            this._dialog.position = { my: 'center', at: 'center' };
        }
    }
    return UIHiddenSettingsDialog;
});
