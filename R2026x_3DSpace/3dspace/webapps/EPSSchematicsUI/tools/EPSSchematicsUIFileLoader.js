/// <amd-module name='DS/EPSSchematicsUI/tools/EPSSchematicsUIFileLoader'/>
define("DS/EPSSchematicsUI/tools/EPSSchematicsUIFileLoader", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, UIDom) {
    "use strict";
    /**
     * A file loader class allowing to load files.
     * @private
     * @class UIFileLoader
     * @alias module:DS/EPSSchematicsUI/tools/EPSSchematicsUIFileLoader
     */
    class UIFileLoader {
        /**
         * @public
         * @constructor
         */
        constructor() {
            this._onFileChangeCB = this._onFileChange.bind(this);
            this._inputElement = UIDom.createElement('input', {
                attributes: { type: 'file', accept: '.json' },
                style: { display: 'none' }
            });
            this._inputElement.addEventListener('change', this._onFileChangeCB, false);
        }
        /**
         * Removes the file loader.
         * @public
         */
        remove() {
            this._inputElement.removeEventListener('change', this._onFileChangeCB, false);
            this._inputElement = undefined;
            this._onFileChangeCB = undefined;
            this._onFileLoadCB = undefined;
        }
        /**
         * Gets the file loader input element.
         * @public
         * @returns {HTMLInputElement} The file loader input element.
         */
        getInput() {
            return this._inputElement;
        }
        /**
         * Sets the file loader input element.
         * @public
         * @param {HTMLInputElement} input - The file loader input element.
         */
        setInput(input) {
            this._inputElement = input;
        }
        /**
         * Loads a file.
         * @public
         * @param {TFileReaderArgs} callback - The callback function.
         */
        loadFile(callback) {
            this._inputElement.value = '';
            this._onFileLoadCB = callback;
            document.body.appendChild(this._inputElement);
            this._inputElement.click();
            document.body.removeChild(this._inputElement);
        }
        /**
         * The callback on the file change event.
         * @public
         * @param {Event} event - The file change event.
         */
        _onFileChange(event) {
            const file = event.target?.files?.[0];
            if (file !== null && file !== undefined) {
                const hasName = typeof file.name === 'string';
                const fileName = hasName ? file.name.split('.json')[0] : '';
                const reader = new FileReader();
                reader.onload = this._onReaderLoad.bind(this, fileName);
                reader.readAsText(file);
            }
        }
        /**
         * The callback on the reader load event.
         * @public
         * @param {string} fileName - The file name.
         * @param {Event} event - The reader load event.
         */
        _onReaderLoad(fileName, event) {
            const result = event.target.result;
            if (result !== undefined && this._onFileLoadCB !== undefined) {
                this._onFileLoadCB(fileName, result);
            }
            this._onFileLoadCB = undefined;
        }
    }
    return UIFileLoader;
});
