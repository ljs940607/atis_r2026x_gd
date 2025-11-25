/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUIPlayPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUIPlayPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/Controls/Button", "DS/Controls/Expander", "DS/Controls/Toggle", "DS/CoreBase/WebUXGlobalEnums", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUIPlayPanel"], function (require, exports, UIPanel, UIDom, UIFontIcon, UIWUXTools, UIKeyboard, UIEvents, EventServices, ExecutionEvents, WUXButton, WUXExpander, WUXToggle, WebUXGlobalEnums_1) {
    "use strict";
    /**
     * This class defines a UI play panel.
     * @private
     * @class UIPlayPanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUIPlayPanel
     * @extends UIPanel
     */
    class UIPlayPanel extends UIPanel {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                immersiveFrame: editor.getImmersiveFrame(),
                title: 'Play commands',
                maximizeButtonFlag: false,
                closeButtonFlag: false,
                currentDockArea: editor.getOptions().playCommands?.dockArea || WebUXGlobalEnums_1.WUXDockAreaEnum.RightDockArea,
                horizontallyStretchableFlag: false,
                verticallyStretchableFlag: false,
                className: ['sch-play-panel'],
                icon: UIFontIcon.getWUXFAIconDefinition('play'),
                width: 184, // TODO: migrate to container for buttons with flexbox
                height: -1,
                position: {
                    my: 'top right',
                    at: 'top right',
                    of: editor.getImmersiveFrame(),
                    offsetX: -5,
                    offsetY: 5
                }
            });
            this._onStartButtonClickCB = this._onStartButtonClick.bind(this);
            this._onStopButtonClickCB = this._onStopButtonClick.bind(this);
            this._onBreakAllContinueClickCB = this._onBreakAllContinueClick.bind(this);
            this._onStepOverButtonClickCB = this._onStepOverButtonClick.bind(this);
            this._onStepIntoButtonClickCB = this._onStepIntoButtonClick.bind(this);
            this._onStepOutButtonClickCB = this._onStepOutButtonClick.bind(this);
            this._onDebugBreakCB = this._onDebugBreak.bind(this);
            this._onDebugUnbreakCB = this._onDebugUnbreak.bind(this);
            this._keydownCB = this._onKeydown.bind(this);
            this._onViewerChangeCB = this._onViewerChange.bind(this);
            this._editor = editor;
            this._callbacks = this._editor.getOptions().playCommands?.callbacks || {};
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
         * Removes the panel.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Closes the panel!
            this._unregisterEventListeners();
            this._editor = undefined;
            this._callbacks = undefined;
            this._debugContent = undefined;
            this._startButton = undefined;
            this._stopButton = undefined;
            this._debugExpander = undefined;
            this._breakOnStartToggle = undefined;
            this._breakAllContinueButton = undefined;
            this._stepOverButton = undefined;
            this._onStartButtonClickCB = undefined;
            this._onStopButtonClickCB = undefined;
            this._onBreakAllContinueClickCB = undefined;
            this._onStepOverButtonClickCB = undefined;
            this._onStepIntoButtonClickCB = undefined;
            this._onStepOutButtonClickCB = undefined;
            this._onDebugBreakCB = undefined;
            this._onDebugUnbreakCB = undefined;
            this._keydownCB = undefined;
        }
        /**
         * The callback on the breakpoints change state.
         * @public
         * @param {Object[]} breakpoints - The list of breakpoints.
         */
        onBreakpointsChange(breakpoints) {
            if (this._callbacks.onBreakpointsChange !== undefined) {
                this._callbacks.onBreakpointsChange(breakpoints);
            }
        }
        /**
         * Gets the debug expander.
         * @public
         * @returns {WUXExpander} The debug expander.
         */
        getDebugExpander() {
            return this._debugExpander;
        }
        /**
         * Gets the break on start toggle.
         * @public
         * @returns {WUXToggle} The break on start toggle.
         */
        getBreakOnStartToggle() {
            return this._breakOnStartToggle;
        }
        /**
         * Gets the start button.
         * @public
         * @returns {WUXButton} The start button.
         */
        getStartButton() {
            return this._startButton;
        }
        /**
         * Gets the stop button.
         * @public
         * @returns {WUXButton} The start button.
         */
        getStopButton() {
            return this._stopButton;
        }
        /**
         * Gets the step over button.
         * @public
         * @returns {WUXButton} The step over button.
         */
        getStepOverButton() {
            return this._stepOverButton;
        }
        /**
         * Gets the step into button.
         * @public
         * @returns {WUXButton} The step into button.
         */
        getStepIntoButton() {
            return this._stepIntoButton;
        }
        /**
         * Gets the step out button.
         * @public
         * @returns {WUXButton} The step out button.
         */
        getStepOutButton() {
            return this._stepOutButton;
        }
        /**
         * Gets the break all continue button.
         * @public
         * @returns {WUXButton} The break all continue button.
         */
        getBreakAllContinueButton() {
            return this._breakAllContinueButton;
        }
        /**
         * Gets the debug commands expander visible flag.
         * @public
         * @returns {boolean} The visible flag.
         */
        getDebugCommandsVisibleFlag() {
            return this._debugExpander.visibleFlag;
        }
        /**
         * Sets the debug commands expander visible flag.
         * @public
         * @param {boolean} visibleFlag - The visible flag.
         */
        setDebugCommandsVisibleFlag(visibleFlag) {
            this._debugExpander.visibleFlag = visibleFlag;
            this._debugExpander.expand();
        }
        /**
         * Gets the break on start toggle checked state.
         * @public
         * @returns {boolean} True if the break on start toggle is checked else false.
         */
        getBreakOnStartToggleCheckedState() {
            return this._breakOnStartToggle.checkFlag;
        }
        /**
         * Stops the play.
         * @public
         */
        stop() {
            this._unregisterEventListeners();
            this._switchToContinueButton();
            this._startButton.disabled = false;
            this._stopButton.disabled = true;
            this._breakAllContinueButton.disabled = true;
            this._stepOverButton.disabled = true;
            this._stepIntoButton.disabled = true;
            this._stepOutButton.disabled = true;
            this._breakOnStartToggle.disabled = false;
            if (this._callbacks.onStop !== undefined) {
                this._callbacks.onStop();
            }
            this._editor.getDebugController().clear();
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
         * The callback on the panel close event.
         * @protected
         * @override
         */
        _onClose() {
            if (this._startButton !== undefined) {
                this._startButton.removeEventListener('buttonclick', this._onStartButtonClickCB);
            }
            if (this._stopButton !== undefined) {
                this._stopButton.removeEventListener('buttonclick', this._onStopButtonClickCB);
            }
            if (this._breakAllContinueButton !== undefined) {
                this._stopButton.removeEventListener('buttonclick', this._onBreakAllContinueClickCB);
            }
            if (this._stepOverButton !== undefined) {
                this._stepOverButton.removeEventListener('buttonclick', this._onStepOverButtonClickCB);
            }
            if (this._stepIntoButton !== undefined) {
                this._stepIntoButton.removeEventListener('buttonclick', this._onStepIntoButtonClickCB);
            }
            if (this._stepOutButton !== undefined) {
                this._stepOutButton.removeEventListener('buttonclick', this._onStepOutButtonClickCB);
            }
            this._startButton = undefined;
            this._stopButton = undefined;
            this._debugExpander = undefined;
            this._debugContent = undefined;
            this._breakOnStartToggle = undefined;
            this._breakAllContinueButton = undefined;
            this._stepOverButton = undefined;
            this._stepIntoButton = undefined;
            this._stepOutButton = undefined;
            super._onClose();
        }
        /**
         * Creates the panel content.
         * @protected
         */
        _createContent() {
            this._createBaseCommands();
            this._createDebugExpander();
        }
        /**
         * Creates the base commands.
         * @protected
         */
        _createBaseCommands() {
            this._startButton = new WUXButton({
                label: '',
                emphasize: 'primary',
                icon: 'play',
                iconSize: '1x',
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Play' }),
                allowUnsafeHTMLLabel: false
            }).inject(this.getContent());
            this._startButton.addEventListener('buttonclick', this._onStartButtonClickCB);
            this._stopButton = new WUXButton({
                label: '',
                emphasize: 'secondary',
                icon: 'stop',
                iconSize: '1x',
                disabled: true,
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Stop' }),
                allowUnsafeHTMLLabel: false
            }).inject(this.getContent());
            this._stopButton.addEventListener('buttonclick', this._onStopButtonClickCB);
        }
        /**
         * Creates the debug expander.
         * @protected
         */
        _createDebugExpander() {
            this._debugContent = UIDom.createElement('div');
            this._debugExpander = new WUXExpander({
                header: 'Debug commands',
                body: this._debugContent,
                style: 'styled'
            }).inject(this.getContent());
            this._breakOnStartToggle = new WUXToggle({
                type: 'switch',
                label: 'Break on start'
            }).inject(this._debugContent);
            this._breakAllContinueButton = new WUXButton({
                label: '',
                emphasize: 'primary',
                icon: UIFontIcon.getWUX3DSIconDefinition('resume'),
                iconSize: '1x',
                disabled: true,
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Continue (F8)' }),
                checkFlag: true,
                allowUnsafeHTMLLabel: false
            }).inject(this._debugContent);
            this._breakAllContinueButton.addEventListener('buttonclick', this._onBreakAllContinueClickCB);
            this._stepOverButton = new WUXButton({
                label: '',
                emphasize: 'primary',
                icon: UIFontIcon.getWUXFAIconDefinition('sch-step-over'),
                iconSize: '1x',
                disabled: true,
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Step Over (F10)' }),
                allowUnsafeHTMLLabel: false
            }).inject(this._debugContent);
            this._stepOverButton.addEventListener('buttonclick', this._onStepOverButtonClickCB);
            this._stepIntoButton = new WUXButton({
                label: '',
                emphasize: 'primary',
                icon: UIFontIcon.getWUX3DSIconDefinition('dataflow-input'),
                iconSize: '1x',
                disabled: true,
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Step Into (F11)' }),
                allowUnsafeHTMLLabel: false
            }).inject(this._debugContent);
            this._stepIntoButton.addEventListener('buttonclick', this._onStepIntoButtonClickCB);
            this._stepOutButton = new WUXButton({
                label: '',
                emphasize: 'primary',
                icon: UIFontIcon.getWUX3DSIconDefinition('dataflow-output'),
                iconSize: '1x',
                disabled: true,
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Step Out (Shift + F11)' }),
                allowUnsafeHTMLLabel: false
            }).inject(this._debugContent);
            this._stepOutButton.addEventListener('buttonclick', this._onStepOutButtonClickCB);
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
         * Switches the button to display the continue command.
         * @private
         */
        _switchToContinueButton() {
            this._breakAllContinueButton.icon = UIFontIcon.getWUX3DSIconDefinition('resume');
            this._breakAllContinueButton.tooltipInfos = UIWUXTools.createTooltip({ shortHelp: 'Continue (F8)' });
            this._breakAllContinueButton.checkFlag = true;
        }
        /**
         * Switches the button to display the break all command.
         * @private
         */
        _switchToBreakAllButton() {
            this._breakAllContinueButton.icon = 'pause';
            this._breakAllContinueButton.tooltipInfos = UIWUXTools.createTooltip({ shortHelp: 'Break all (F8)' });
            this._breakAllContinueButton.checkFlag = false;
        }
        /**
         * Switches the buttons to display commands necessary on break status.
         * @private
         * @param {Block} block - The block model selected by the debug cursor.
         */
        _switchToBreakStatus(block) {
            this._switchToContinueButton();
            this._stepOverButton.disabled = false;
            this._stepIntoButton.disabled = !block.handleStepInto();
            this._stepOutButton.disabled = false;
        }
        /**
         * Switches the buttons to display commands necessary on unbreak status.
         * @private
         */
        _switchToUnbreakStatus() {
            this._switchToBreakAllButton();
            this._stepOverButton.disabled = true;
            this._stepIntoButton.disabled = true;
            this._stepOutButton.disabled = true;
        }
        /**
         * Registers event listeners for debug and keyboard events.
         * @private
         */
        _registerEventListeners() {
            this._editor.addListener(UIEvents.UIViewerChangeEvent, this._onViewerChangeCB);
            EventServices.addListener(ExecutionEvents.DebugBreakEvent, this._onDebugBreakCB);
            EventServices.addListener(ExecutionEvents.DebugUnbreakEvent, this._onDebugUnbreakCB);
            document.body.addEventListener('keydown', this._keydownCB, false);
        }
        /**
         * Unregisters event listeners for debug and keyboard events.
         * @private
         */
        _unregisterEventListeners() {
            this._editor.removeListener(UIEvents.UIViewerChangeEvent, this._onViewerChangeCB);
            EventServices.removeListener(ExecutionEvents.DebugBreakEvent, this._onDebugBreakCB);
            EventServices.removeListener(ExecutionEvents.DebugUnbreakEvent, this._onDebugUnbreakCB);
            document.body.removeEventListener('keydown', this._keydownCB, false);
        }
        /**
         * The callback on keydown event
         * @private
         * @param {KeyboardEvent} event - The keydown event.
         */
        _onKeydown(event) {
            if (UIKeyboard.isKeyPressed(event, UIKeyboard.eF10)) {
                if (!this._stepOverButton.disabled) {
                    this._onStepOverButtonClick();
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eF11)) {
                if (event.shiftKey) {
                    if (!this._stepOutButton.disabled) {
                        this._onStepOutButtonClick();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
                else {
                    if (!this._stepIntoButton.disabled) {
                        this._onStepIntoButtonClick();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eF8)) {
                if (!this._breakAllContinueButton.disabled) {
                    this._onBreakAllContinueClick();
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
        /**
         * The callback on the start button click event.
         * @private
         */
        _onStartButtonClick() {
            this._registerEventListeners();
            this._switchToBreakAllButton();
            this._startButton.disabled = true;
            this._stopButton.disabled = false;
            this._breakAllContinueButton.disabled = false;
            this._stepOverButton.disabled = true;
            this._stepIntoButton.disabled = true;
            this._stepOutButton.disabled = true;
            this._breakOnStartToggle.disabled = true;
            if (this._callbacks.onStart !== undefined) {
                this._callbacks.onStart();
            }
        }
        /**
         * The callback on the stop button click event.
         * @private
         */
        _onStopButtonClick() {
            this.stop();
        }
        /**
         * The callback on the breakAll continue button click event.
         * @private
         */
        _onBreakAllContinueClick() {
            if (this._breakAllContinueButton.checkFlag) {
                if (this._callbacks.onContinue !== undefined) {
                    this._editor.getDebugController().onContinue();
                    this._callbacks.onContinue();
                }
                this._switchToBreakAllButton();
            }
            else {
                if (this._callbacks.onBreakAll !== undefined) {
                    this._editor.getDebugController().onBreakAll();
                    this._callbacks.onBreakAll();
                }
                this._switchToContinueButton();
            }
        }
        /**
         * The callback on the step over button click event.
         * @private
         */
        _onStepOverButtonClick() {
            if (this._callbacks.onStepOver !== undefined) {
                const contextPath = this._editor.getViewerController().getCurrentViewer().getMainGraph().getModel().toPath();
                this._editor.getDebugController().onStepOver(contextPath);
                this._callbacks.onStepOver(contextPath);
            }
        }
        /**
         * The callback on the step into button click event.
         * @private
         */
        _onStepIntoButtonClick() {
            if (this._callbacks.onStepInto !== undefined) {
                const contextPath = this._editor.getViewerController().getCurrentViewer().getMainGraph().getModel().toPath();
                this._editor.getDebugController().onStepInto(contextPath);
                this._callbacks.onStepInto(contextPath);
            }
        }
        /**
         * The callback on the step out button click event.
         * @private
         */
        _onStepOutButtonClick() {
            if (this._callbacks.onStepOut !== undefined) {
                const contextPath = this._editor.getViewerController().getCurrentViewer().getMainGraph().getModel().toPath();
                this._editor.getDebugController().onStepOut(contextPath);
                this._callbacks.onStepOut(contextPath);
            }
        }
        /**
         * The callback on the viewer change event.
         * @private
         * @param {UIEvents.UIViewerChangeEvent} event - The viewer change event.
         */
        _onViewerChange(event) {
            const viewer = event.getViewer();
            const contextPath = viewer.getMainGraph().getModel().toPath();
            const debugController = this._editor.getDebugController();
            const debugCursor = debugController.getDebugCursorByGraphContext(contextPath);
            if (debugCursor === undefined) {
                this._switchToUnbreakStatus();
            }
            else {
                const blockModel = debugCursor.getBlock().getModel();
                this._switchToBreakStatus(blockModel);
            }
        }
        /**
         * The callback on the debug break event.
         * @private
         * @param {ExecutionEvents.DebugBreakEvent} event - The debug break event.
         */
        _onDebugBreak(event) {
            const path = event.getPath();
            const parentPath = path.split('.').slice(0, -1).join('.');
            const contextPath = this._editor.getViewerController().getCurrentViewer().getMainGraph().getModel().toPath();
            if (contextPath === parentPath) {
                const blockModel = this._editor.getGraphModel().getObjectFromPath(path);
                this._switchToBreakStatus(blockModel);
            }
        }
        /**
         * The callback on the debug unbreak event.
         * @private
         * @param {ExecutionEvents.DebugUnbreakEvent} event - The debug unbreak event.
         */
        _onDebugUnbreak(event) {
            const path = event.getPath();
            const parentPath = path.split('.').slice(0, -1).join('.');
            const contextPath = this._editor.getViewerController().getCurrentViewer().getMainGraph().getModel().toPath();
            if (contextPath === parentPath) {
                this._switchToUnbreakStatus();
            }
        }
    }
    return UIPlayPanel;
});
