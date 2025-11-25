/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBaseDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBaseDialog", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/Windows/Dialog", "DS/Controls/Button", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIBaseDialog"], function (require, exports, UIDom, Dialog, WUXButton) {
    "use strict";
    /**
     * This class defines a UI base dialog.
     * @private
     * @abstract
     * @class UIValidationDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBaseDialog
     */
    class UIBaseDialog {
        /**
         * @public
         * @constructor
         * @param {IWUXDialogOptions} options - The dialog options.
         */
        constructor(options) {
            this._openState = false;
            this._options = options;
            this._options.buttons = options.buttons || {};
            this._options.buttonsDefinition = options.buttonsDefinition || {};
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the dialog.
         * @public
         */
        remove() {
            this.close();
            this._dialog = undefined;
            this._options = undefined;
            this._openState = undefined;
            this._content = undefined;
        }
        /**
         * Opens the dialog.
         * @public
         */
        open() {
            if (!this._openState) {
                this._createDialog();
                this._openState = true;
            }
        }
        /**
         * Closes the dialog.
         * @public
         */
        close() {
            if (this._openState) {
                this._dialog.close();
            }
        }
        /**
         * Gets the dialog open state.
         * @public
         * @returns {boolean} The dialog open state.
         */
        isOpen() {
            return this._openState;
        }
        /**
         * Gets the WUX dialog.
         * @public
         * @returns {Dialog} The WUX dialog.
         */
        getDialog() {
            return this._dialog;
        }
        /**
         * Gets the dialog content.
         * @public
         * @returns {HTMLDivElement} The dialog content.
         */
        getContent() {
            return this._content;
        }
        /**
         * Gets the dialog options.
         * @public
         * @returns {IWUXDialogOptions} The dialog options.
         */
        getOptions() {
            return this._options;
        }
        /**
         * Sets the visible flag of the dialog.
         * @public
         * @param {boolean} visibleFlag - The visible flag.
         */
        setVisibleFlag(visibleFlag) {
            this._dialog.visibleFlag = visibleFlag;
        }
        /**
         * The callback on the dialog close event.
         * @protected
         * @param {*} [args] - The optionnal arguments.
         */
        _onClose(args) {
            if (typeof this._options.onClose === 'function') {
                this._options.onClose.call(this, args);
            }
            this._dialog = undefined;
            this._content = undefined;
            this._openState = false;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * The callback on the title bar dblclick event.
         * @private
         */
        _onTitleBarDblclick() {
            if (this._dialog.allowMaximizeFlag) {
                this._dialog.maximizedFlag = !this._dialog.maximizedFlag;
            }
        }
        /**
         * Creates the dialog.
         * @private
         */
        _createDialog() {
            this._content = UIDom.createElement('div', { className: 'sch-dialog-content' });
            this._options.content = this._content;
            this._generateButtons();
            this._dialog = new Dialog(this._options);
            this._onCreateContent();
            const optCN = this._options.className;
            const className = optCN ? (Array.isArray(optCN) ? optCN : [optCN]) : [];
            className.unshift('sch-windows-dialog');
            UIDom.addClassName(this._dialog.elements.container, className);
            this._dialog.addEventListener('close', this._onClose.bind(this), false);
            this._dialog.getTitleBar().addEventListener('dblclick', this._onTitleBarDblclick.bind(this), false);
            // Set the focus on the dialog so key events be propagated on this context
            const content = this._dialog.getContent();
            content.tabIndex = -1;
            content.focus();
        }
        /**
         * Generates the WUX buttons.
         * We have to regenerate buttons as WUX messed up each button when the dialog is destoyed!
         * @private
         */
        _generateButtons() {
            const buttonsDefinition = this._options.buttonsDefinition;
            const buttons = this._options.buttons;
            if (buttons && buttonsDefinition) {
                const buttonsName = Object.keys(buttonsDefinition);
                buttonsName.forEach(buttonName => {
                    buttons[buttonName] = new WUXButton(buttonsDefinition[buttonName]);
                });
            }
        }
    }
    return UIBaseDialog;
});
