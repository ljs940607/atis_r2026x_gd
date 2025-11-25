/// <amd-module name='DS/EPSSchematicsPlay/EPSSchematicsPlayDialog'/>
define("DS/EPSSchematicsPlay/EPSSchematicsPlayDialog", ["require", "exports", "DS/EPSSchematicsPlay/EPSLoopManager", "DS/EPInputsServicesWeb/EPInputsServices", "DS/Controls/Button", "DS/Windows/Dialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, EPSLoopManager, EPInputsServices, WUXButton, Dialog, UIDom) {
    "use strict";
    var EPlayState;
    (function (EPlayState) {
        EPlayState[EPlayState["ePlay"] = 0] = "ePlay";
        EPlayState[EPlayState["ePause"] = 1] = "ePause";
        EPlayState[EPlayState["eStop"] = 2] = "eStop";
    })(EPlayState || (EPlayState = {}));
    /**
     * This class defines a Schematics Play Dialog.
     * @class EPSSchematicsPlayDialog
     * @alias module:DS/EPSSchematicsPlay/EPSSchematicsPlayDialog
     * @deprecated Please use "playCommands" option of the Schematics editor!
     * @private
     */
    class EPSSchematicsPlayDialog {
        /**
         * @constructor
         * @param {IPlayDialogOptions} [options] - The play dialog options.
         * @param {WUXImmersiveFrame} [options.immersiveFrame] - The WUX immersive frame.
         * @param {Function} [options.registerTasksCB] - The callback for registering tasks into task player.
         * @param {Function} [options.stopCB] - The callback for stopping the task player.
         */
        constructor(options) {
            this._state = 2 /* EPlayState.eStop */;
            this.options = options || {};
            this._loopManager = new EPSLoopManager();
            this.dialogContainer = UIDom.createElement('div', { className: 'epsPlayDialogContainer' });
            this.playButton = new WUXButton({
                label: '',
                emphasize: 'secondary',
                icon: 'play',
                iconSize: '1x',
                allowUnsafeHTMLLabel: false
            }).inject(this.dialogContainer);
            this.playButton.addEventListener('buttonclick', this._onStart.bind(this));
            this.stopButton = new WUXButton({
                label: '',
                emphasize: 'secondary',
                icon: 'stop',
                iconSize: '1x',
                disabled: true,
                allowUnsafeHTMLLabel: false
            }).inject(this.dialogContainer);
            this.stopButton.addEventListener('buttonclick', this._onStop.bind(this));
            this._dialog = new Dialog({
                title: 'Play Commands',
                immersiveFrame: this.options.immersiveFrame,
                content: this.dialogContainer,
                resizableFlag: false,
                modalFlag: false,
                closeButtonFlag: false,
                position: {
                    my: 'top left',
                    at: 'top left',
                    offsetX: 10,
                    offsetY: 10
                }
            });
        }
        /**
         * Closes the play dialog
         * @private
         */
        _onClose() {
            if (this._dialog !== undefined) {
                this._dialog.close();
                this._dialog = undefined;
            }
            this.options = undefined;
            this._state = undefined;
            this._inputsServices = undefined;
            this._loopManager = undefined;
            this.playButton = undefined;
            this.stopButton = undefined;
            this.dialogContainer = undefined;
        }
        /**
         * The callback on the start button click.
         * It handles the start and the pause of the loop manager.
         * @private
         */
        _onStart() {
            if (this._state === 2 /* EPlayState.eStop */) {
                this._state = 0 /* EPlayState.ePlay */;
                this.stopButton.disabled = false;
                this.playButton.icon = 'pause';
                if (this.options.registerTasksCB !== undefined) {
                    const tasks = this.options.registerTasksCB.call(this);
                    for (let i = 0; i < tasks.length; i++) {
                        this._loopManager.registerTask(tasks[i]);
                    }
                }
                this._loopManager.start();
                this._inputsServices = new EPInputsServices();
                this._inputsServices.enableMouse(document.body);
                this._inputsServices.enableKeyboard(document.body);
            }
            else if (this._state === 0 /* EPlayState.ePlay */) {
                this._state = 1 /* EPlayState.ePause */;
                this.stopButton.disabled = false;
                this.playButton.icon = 'play';
                this._loopManager.pause();
            }
            else if (this._state === 1 /* EPlayState.ePause */) {
                this._state = 0 /* EPlayState.ePlay */;
                this.stopButton.disabled = false;
                this.playButton.icon = 'pause';
                this._loopManager.resume();
            }
        }
        /**
         * The callback on the stop button click.
         * It handles the stop of the loop manager.
         * @private
         */
        _onStop() {
            this.stopButton.disabled = true;
            this._state = 2 /* EPlayState.eStop */;
            this.playButton.icon = 'play';
            this._inputsServices.disableMouse();
            this._inputsServices.disableKeyboard();
            this._inputsServices = undefined;
            this._loopManager.stop();
            if (this.options.stopCB !== undefined) {
                this.options.stopCB.call(this);
            }
        }
    }
    return EPSSchematicsPlayDialog;
});
