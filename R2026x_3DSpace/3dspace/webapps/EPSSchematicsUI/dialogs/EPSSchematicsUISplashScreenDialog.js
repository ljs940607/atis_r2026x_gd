/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUISplashScreenDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUISplashScreenDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/Controls/Toggle", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUISplashScreenDialog"], function (require, exports, UIValidationDialog, UIDom, UINLS, WUXToggle) {
    "use strict";
    /**
     * This class defines a splash screen dialog.
     * @private
     * @class UISplashScreenDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUISplashScreenDialog
     * @extends UIValidationDialog
     */
    class UISplashScreenDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                title: 'Execution Graph Release Notes',
                className: 'sch-dialog-splashscreen',
                immersiveFrame: editor.getImmersiveFrame(),
                allowMaximizeFlag: false,
                maximizeButtonFlag: false,
                closeButtonFlag: false,
                resizableFlag: true,
                icon: 'info',
                width: 800, minWidth: 800, height: 400, minHeight: 400
            });
            this._options.buttonsDefinition = {
                Ok: {
                    label: UINLS.get('buttonOK'),
                    onClick: this._onOk.bind(this)
                }
            };
        }
        /**
         * Creates the dialog content.
         * A webapp version number as been setup in the local storage so when a new
         * release note is published we can compare this version number and force the display
         * of the new splash screen!
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            const dialogContent = this.getContent();
            UIDom.createElement('div', {
                parent: dialogContent,
                innerHTML: `
                <h2>New Execution Graph Version</h2>
                <hr>
                <p>
                    A new version of Execution Graph has been released.<br/>
                    This second version (<i>version 2</i>) is now the default version for every new graph.<br/>
                    The behavior of progresses and errors of the graph (including subgraphs) has changed compared to the previous version.<br/>
                    For more information, please read the <a href="https://executionfw.dsone.3ds.com/docs/graph/getting_started/#difference-between-versions" target="_blank">Execution Graph Documentation</a>.
                </p>
                <h3>Migration</h3>
                <p>
                    Each graph saves the version in its JSON file. Thus every previous saved graph are in version 1.<br/>
                    You can migrate your graph version 1 to version 2 by switching the <strong>Graph Version 2</strong> option in the editor settings.<br/>
                    Please note that this will change the behavior of the graph regarding to the progress and error management.<br/>
                    It will be up to you to manage the impact by migrating the users already calling your graph.
                </p>
                <p>
                    To handle a smoother migration, please create a new version of the CSI Graph function while keeping the previous one available. (myGraphFunction_v1 &#129030; myGraphFunction_v2)<br/>
                    The users of your graph function will then be able to migrate to that new version as they want.
                </p>
            `.replace(/\s{2,}/g, ' ').trim()
            });
            this._toggle = new WUXToggle({ type: 'checkbox', label: 'Show release notes next time', checkFlag: true });
            this._toggle.addEventListener('change', (_event) => {
                this._editor.getLocalStorageController().setShowSplashScreen(this._toggle.checkFlag);
            });
            const footer = this._dialog.getContent().querySelector('.wux-windows-dialog-footer');
            if (footer) {
                footer.insertBefore(this._toggle.getContent(), footer.firstChild);
            }
        }
        /**
         * Gets the show splash screen toggle.
         * @private
         * @ignore
         * @returns {WUXToggle} The show splash screen toggle.
         */
        _getToggle() {
            return this._toggle;
        }
    }
    return UISplashScreenDialog;
});
