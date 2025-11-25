/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUICommandButton'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUICommandButton", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUICommandButton"], function (require, exports, UIDom, UIFontIcon) {
    "use strict";
    /**
     * This class defines a UI command button.
     * @private
     * @class UICommandButton
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUICommandButton
     */
    class UICommandButton {
        /**
         * @public
         * @constructor
         * @param {ICommandButtonOptions} options - The command button options.
         */
        constructor(options) {
            this._onClickCB = this._onClick.bind(this);
            this._disabled = false;
            this._command = options.command;
            this._parent = options.parent;
            this._className = options.className;
            this._callback = options.callback;
            const className = ['sch-command-button'];
            if (typeof this._className === 'string' && this._className !== '') {
                className.push(this._className);
            }
            const iconSpanElt = UIFontIcon.createFontIconFromDefinition(this._command.getIcon());
            this._buttonElt = UIDom.createElement('div', {
                className: className,
                parent: this._parent,
                tooltipInfos: { title: this._command.getTitle(), shortHelp: this._command.getShortHelp() },
                children: iconSpanElt ? [iconSpanElt] : []
            });
            this._buttonElt.addEventListener('click', this._onClickCB, false);
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
         * Removes the command button.
         * @public
         */
        remove() {
            this._buttonElt.removeEventListener('click', this._onClickCB, false);
            this._command = undefined;
            this._parent = undefined;
            this._className = undefined;
            this._callback = undefined;
            this._buttonElt = undefined;
            this._onClickCB = undefined;
            this._disabled = undefined;
        }
        /**
         * Gets the command button element.
         * @public
         * @returns {HTMLDivElement} The command button element.
         */
        getElement() {
            return this._buttonElt;
        }
        /**
         * Gets the command button disabled state.
         * @public
         * @returns {boolean} The command button disabled state.
         */
        getDisabledState() {
            return this._disabled;
        }
        /**
        * Sets the command button disabled state.
        * @param {boolean} disabled - The disabled state.
        * @public
        */
        setDisabledState(disabled) {
            this._disabled = disabled;
            if (disabled) {
                UIDom.addClassName(this._buttonElt, 'disabled');
            }
            else {
                UIDom.removeClassName(this._buttonElt, 'disabled');
            }
        }
        /**
         * Sets the command button short help.
         * @public
         * @param {string} shortHelp - The short help.
         */
        setShortHelp(shortHelp) {
            const wuxButtonElt = this._buttonElt;
            if (wuxButtonElt.tooltipInfos) {
                wuxButtonElt.tooltipInfos.shortHelp = '<b>' + shortHelp + '</b>';
            }
        }
        /**
         * Gets the command button short help.
         * @public
         * @returns {string} The short help.
         */
        getShortHelp() {
            return this._command.getShortHelp();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * The callback on the command button mouse click event.
         * @protected
         * @param {MouseEvent} event - The command button click event.
         */
        _onClick(event) {
            if (!this._disabled) {
                const commandCB = this._command.getCallback();
                if (commandCB !== undefined) {
                    commandCB(event);
                }
                if (this._callback !== undefined) {
                    this._callback();
                }
            }
        }
    }
    return UICommandButton;
});
