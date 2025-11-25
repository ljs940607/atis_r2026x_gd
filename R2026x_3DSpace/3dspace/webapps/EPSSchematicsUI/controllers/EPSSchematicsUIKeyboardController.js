/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUIKeyboardController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUIKeyboardController", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard"], function (require, exports, UIEvents, UIKeyboard) {
    "use strict";
    /**
     * This class defines a keyboard controller.
     * @private
     * @class UIKeyboardController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUIKeyboardController
     */
    class UIKeyboardController {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._isCtrlPressed = false;
            this._onViewerChangeCB = this._onViewerChange.bind(this);
            this._onKeydownCB = this._onKeydown.bind(this);
            this._onKeyupCB = this._onKeyup.bind(this);
            this._onCopyCB = this._onCopy.bind(this);
            this._onPasteCB = this._onPaste.bind(this);
            this._editor = editor;
            this._editor.addListener(UIEvents.UIViewerChangeEvent, this._onViewerChangeCB);
            if (document.body !== undefined && document.body !== null) {
                document.body.addEventListener('copy', this._onCopyCB, false);
                document.body.addEventListener('paste', this._onPasteCB, false);
            }
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
         * Removes the controller.
         * @public
         */
        remove() {
            if (document.body !== undefined && document.body !== null) {
                document.body.removeEventListener('copy', this._onCopyCB, false);
                document.body.removeEventListener('paste', this._onPasteCB, false);
            }
            if (this._editor !== undefined) {
                this._editor.removeListener(UIEvents.UIViewerChangeEvent, this._onViewerChangeCB);
            }
            this._removeKeyboardListeners();
            this._editor = undefined;
            this._viewer = undefined;
            this._onViewerChangeCB = undefined;
            this._onKeydownCB = undefined;
        }
        /**
         * Checks if the control key is pressed.
         * @public
         * @returns {boolean} True if the control key is pressed else false.
         */
        isCtrlKeyPressed() {
            return this._isCtrlPressed;
        }
        /**
         * The callback on the editor copy event.
         * @public
         * @param {ClipboardEvent} event - The copy event.
         */
        _onCopy(event) {
            if (event.clipboardData) {
                const viewer = this._editor.getViewerController().getCurrentViewer();
                if (event.target === document.body || event.target === viewer.getContainer()) {
                    const blocks = viewer.getSelectedBlocks();
                    if (blocks.length) {
                        let savedBlocks = [];
                        blocks.forEach(block => {
                            if (block.getModel().isValid()) {
                                savedBlocks.push(block.save());
                            }
                        });
                        event.clipboardData.setData('application/eps.schematics', JSON.stringify(savedBlocks));
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
        }
        /**
         * The callback on the current viewer keydown event
         * @public
         * @param {ClipboardEvent} event - The keydown event.
         */
        _onPaste(event) {
            if (event.clipboardData) {
                const viewer = this._editor.getViewerController().getCurrentViewer();
                if (event.target === document.body || event.target === viewer.getContainer()) {
                    const data = event.clipboardData.getData('application/eps.schematics');
                    if (data !== undefined && data !== null && data !== '') {
                        const blocks = JSON.parse(data);
                        const graph = viewer.getMainGraph();
                        graph.loadBlocks(blocks);
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
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
         * The callback on the viewer change event.
         * @private
         * @param {UIEvents.UIViewerChangeEvent} event - The viewer change event.
         */
        _onViewerChange(event) {
            const viewer = event.getViewer();
            if (this._viewer !== viewer) {
                this._removeKeyboardListeners();
                this._viewer = viewer;
                this._addKeyboardListeners();
                this._viewer.getContainer().tabIndex = 0;
                this._viewer.getContainer().focus();
            }
        }
        /**
         * Adds the keyboard listeners to the viewer.
         * @private
         */
        _addKeyboardListeners() {
            if (this._viewer !== undefined) {
                this._viewer.getContainer().addEventListener('keydown', this._onKeydownCB, false);
                this._viewer.getContainer().addEventListener('keyup', this._onKeyupCB, false);
            }
        }
        /**
         * Removes the keyboard listeners from the viewer.
         * @private
         */
        _removeKeyboardListeners() {
            if (this._viewer !== undefined && this._viewer.getContainer() !== undefined) {
                this._viewer.getContainer().removeEventListener('keydown', this._onKeydownCB, false);
                this._viewer.getContainer().removeEventListener('keyup', this._onKeyupCB, false);
            }
        }
        /**
         * The callback on the current viewer keydown event
         * @private
         * @param {KeyboardEvent} event - The keydown event.
         */
        _onKeydown(event) {
            if (this._viewer !== undefined) {
                if (this._viewer.getEditionMode() === true) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                else {
                    this._isCtrlPressed = event.metaKey || event.ctrlKey;
                    if (this._isCtrlPressed) {
                        this._onCtrlKeydown(event);
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eBackspace)) {
                        if (this._viewer.getMainGraph().getSmartSearch() === undefined) {
                            event.preventDefault();
                        }
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eDelete)) {
                        this._viewer.deleteSelection();
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowLeft)) {
                        this._viewer.moveSelection(true, false, false, false);
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowUp)) {
                        this._viewer.moveSelection(false, true, false, false);
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowRight)) {
                        this._viewer.moveSelection(false, false, true, false);
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowDown)) {
                        this._viewer.moveSelection(false, false, false, true);
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyT)) {
                        this._viewer.createShortcutFromSelection();
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eF9)) {
                        this._viewer.toggleBreakpointOnSelectedBlocks();
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyC)) {
                        const viewer = this._editor.getViewerController().getCurrentViewer();
                        viewer.centerView();
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyF)) {
                        const viewer = this._editor.getViewerController().getCurrentViewer();
                        viewer.zoomGraphToFitInView();
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eNumpad0)) {
                        const viewer = this._editor.getViewerController().getCurrentViewer();
                        viewer.zoomOneToOne();
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyK)) {
                        this._viewer.getMainGraph().reduceGraphSize();
                    }
                    else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eSpace)) {
                        event.preventDefault();
                        const viewer = this._editor.getViewerController().getCurrentViewer();
                        const stateMachineController = viewer.getStateMachineController();
                        const mousePos = stateMachineController?.getMouseClientPosition();
                        const mouseLeft = mousePos?.clientX || 0;
                        const mouseTop = mousePos?.clientY || 0;
                        const coord = viewer.clientToViewpoint(mouseLeft, mouseTop);
                        this._viewer.createSmartSearch(mouseLeft, mouseTop, coord[0], coord[1]);
                    }
                }
            }
        }
        /**
         * The callback on the current viewer keyup event
         * @private
         * @param {KeyboardEvent} event - The keyup event.
         */
        _onKeyup(event) {
            this._isCtrlPressed = event.metaKey || event.ctrlKey;
            this._refreshPortRerouteHandler();
        }
        /**
         * The callback on the control keydown event.
         * @private
         * @param {KeyboardEvent} event - The keydown event.
         */
        _onCtrlKeydown(event) {
            if (this._viewer !== undefined) {
                const options = this._editor.getOptions();
                let isKeyPressed = false;
                this._viewer.getLabelController().directShowLabels();
                if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyS)) {
                    isKeyPressed = true;
                    const rootViewer = this._editor.getViewerController().getRootViewer();
                    const saveCB = options.onSave || rootViewer.saveFile.bind(rootViewer);
                    saveCB();
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyO)) {
                    isKeyPressed = true;
                    const rootViewer = this._editor.getViewerController().getRootViewer();
                    const openCB = options.onOpen || rootViewer.loadFile.bind(rootViewer);
                    openCB();
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyG)) {
                    isKeyPressed = true;
                    this._viewer.createGraphFromSelection();
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyL)) {
                    isKeyPressed = true;
                    this._viewer.getMainGraph().analyzeGraphLoops();
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyZ)) {
                    isKeyPressed = true;
                    this._editor.getHistoryController().back();
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyY)) {
                    isKeyPressed = true;
                    this._editor.getHistoryController().forward();
                }
                if (isKeyPressed) {
                    event.preventDefault();
                }
                this._refreshPortRerouteHandler();
            }
        }
        /**
         * Refreshes the port reroute handler.
         * @private
         */
        _refreshPortRerouteHandler() {
            const stateMachineController = this._editor.getViewerController().getCurrentViewer().getStateMachineController();
            const port = stateMachineController?.getPortAtPointerPosition();
            if (port) {
                port.getView().handleRerouteHandlerDisplay();
            }
        }
    }
    return UIKeyboardController;
});
