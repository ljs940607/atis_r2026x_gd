/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUISessionStorageController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUISessionStorageController", ["require", "exports", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIAbstractStorageController"], function (require, exports, UIAbstractStorageController) {
    "use strict";
    /**
     * This class defines the UI session storage controller.
     * @private
     * @class UISessionStorageController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUISessionStorageController
     * @extends UIAbstractStorageController
     */
    class UISessionStorageController extends UIAbstractStorageController {
        /**
         * @public
         * @constructor
         * @param {IAbstractStorageControllerOptions} [options] - The storage controller options.
         */
        constructor(options) {
            super(options || {
                applicationName: UISessionStorageController._getApplicationName(),
                storageContainer: window.sessionStorage,
                defaultStorage: {
                    hiddenSettings: {
                        exportJSBlock: false
                    }
                },
                onError: () => { throw new Error('Error while writing to session storage!'); }
            });
        }
        /**
         * Gets the hidden settings value.
         * @public
         * @returns {IHiddenSettingsSessionStorage} The hidden settings
         */
        getHiddenSettingsValue() {
            return this._currentStorage.hiddenSettings;
        }
        /**
         * Gets the value of the provided hidden setting name.
         * @public
         * @param {string} settingName - The name of the hidden setting.
         * @returns {boolean} The value of the hidden setting.
         */
        getHiddenSettingValue(settingName) {
            return this._currentStorage.hiddenSettings[settingName];
        }
        /**
         * Sets the value of the provided hidden setting name.
         * @public
         * @param {string} settingName - The name of the hidden setting.
         * @param {boolean} value - The value of the hidden setting.
         */
        setHiddenSettingValue(settingName, value) {
            this._currentStorage.hiddenSettings[settingName] = value;
            this._writeStorage();
        }
    }
    return UISessionStorageController;
});
