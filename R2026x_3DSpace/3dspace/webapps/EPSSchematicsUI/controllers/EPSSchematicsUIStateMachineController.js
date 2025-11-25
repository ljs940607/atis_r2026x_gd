/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUIStateMachineController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUIStateMachineController", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphIact", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphViews", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIControlPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphControlPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestSubDataPort", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataDrawer", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIShortcut", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIComment", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIPersistentLabel", "DS/EPSSchematicsUI/edges/EPSSchematicsUILink", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/interactions/EPSSchematicsUIGraphBorderMoveDrag", "DS/EPSSchematicsUI/interactions/EPSSchematicsUIGraphControlPortMoveDrag", "DS/EPSSchematicsUI/interactions/EPSSchematicsUIControlLinkRerouteDrag", "DS/EPSSchematicsUI/interactions/EPSSchematicsUIControlLinkConnectDrag", "DS/EPSSchematicsUI/interactions/EPSSchematicsUINodeBorderMoveDrag", "DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataPortShortcutDrag", "DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataLinkRerouteDrag", "DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataLinkConnectDrag", "DS/EPSSchematicsUI/interactions/EPSSchematicsUINodeMoveDrag", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsControlLink", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPort", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPort", "DS/EPSSchematicsUI/typings/WebUX/menu/EPSWUXMenu", "css!DS/EPSSchematicsUI/css/controllers/EPSSchematicsUIStateMachineController"], function (require, exports, EGraphIact, EGraphViews, UIPort, UIControlPort, UIDataPort, UIGraphControlPort, UIGraphTestDataPort, UIGraphTestSubDataPort, UINode, UIBlock, UIGraphDataDrawer, UIShortcut, UIComment, UIPersistentLabel, UILink, UIDom, UIGraphBorderMoveDrag, UIGraphControlPortMoveDrag, UIControlLinkRerouteDrag, UIControlLinkConnectDrag, UINodeBorderMoveDrag, UIDataPortShortcutDrag, UIDataLinkRerouteDrag, UIDataLinkConnectDrag, UINodeMoveDrag, UINLS, ControlLink, ControlPort, DataPort, WUXMenu) {
    "use strict";
    /**
     * This class defines the state machine controller.
     * @private
     * @class UIStateMachineController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUIStateMachineController
     */
    class UIStateMachineController {
        /**
         * @public
         * @constructor
         * @param {UIViewer} viewer - The graph viewer.
         */
        constructor(viewer) {
            this._clientPosition = { clientX: 0, clientY: 0 };
            this._doubleLeftClick = false;
            this._onMouseupCB = this._onMouseup.bind(this);
            this._viewer = viewer;
            this._container = viewer.getContainer();
            this._labelController = viewer.getLabelController();
            this._nodeIdSelectorsPanel = viewer.getEditor().getNodeIdSelectorsPanel();
            this._rootState = new UIGraphRootState(viewer);
            this._stateMachine = new EGraphIact.StateMachine(viewer.getDisplay(), undefined, this._rootState, viewer.getView());
            this._stateMachine.enddrag = this._enddrag.bind(this);
            this._stateMachine.rootState.onmousedown = this._onmousedown.bind(this);
            this._stateMachine.rootState.onmousemove = this._onmousemove.bind(this);
            this._container.addEventListener('mouseup', this._onMouseupCB, true);
            // Enable reroute of edges
            this._stateMachine.setEdgeRerouteOptions({
                active: true,
                modifier: 1 /* EGraphIact.Modifiers.CTRL */,
                alwaysRerouteSelection: false
            });
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
            this._container.removeEventListener('mouseup', this._onMouseupCB, true);
            this._stateMachine.domRoot.removeEventListener('mousedown', this._stateMachine.boundMouseDownHandler);
            this._stateMachine.domRoot.removeEventListener('mouseup', this._stateMachine.boundMouseUpHandler);
            this._stateMachine.domRoot.removeEventListener('contextmenu', this._stateMachine.boundCtxMenuHandler);
            this._stateMachine.domRoot.removeEventListener('mousemove', this._stateMachine.boundMouseMoveHandler);
            this._stateMachine.domRoot.removeEventListener(document.body.onwheel !== undefined ? 'wheel' : 'mousewheel', this._stateMachine.boundMouseWheelHandler);
            this._stateMachine.domRoot.removeEventListener('touchstart', this._stateMachine.boundTouchStartHandler);
            this._stateMachine.domRoot.removeEventListener('dragstart', this._stateMachine.boundDragStartHandler);
            this._stateMachine.domRoot.removeEventListener('dragenter', this._stateMachine.boundDragEnterHandler);
            this._stateMachine.domRoot.removeEventListener('dragexit', this._stateMachine.boundDragExitHandler);
            this._stateMachine.domRoot.removeEventListener('dragleave', this._stateMachine.boundDragLeaveHandler);
            this._stateMachine.domRoot.removeEventListener('dragover', this._stateMachine.boundDragOverHandler);
            this._stateMachine.domRoot.removeEventListener('drop', this._stateMachine.boundDropHandler);
            window.removeEventListener('mousedown', this._stateMachine.boundMouseDownHandler);
            window.removeEventListener('mouseup', this._stateMachine.boundMouseUpHandler);
            window.removeEventListener('contextmenu', this._stateMachine.boundCtxMenuHandler);
            window.removeEventListener('mousemove', this._stateMachine.boundMouseMoveHandler);
            this._viewer = undefined;
            this._container = undefined;
            this._labelController = undefined;
            this._rootState = undefined;
            this._stateMachine = undefined;
            this._nodeIdSelectorsPanel = undefined;
            this._clientPosition = undefined;
            this._doubleLeftClick = undefined;
            this._onMouseupCB = undefined;
        }
        /**
         * Gets the port at pointer position.
         * @public
         * @returns {UIPort|undefined} The port at pointer position.
         */
        getPortAtPointerPosition() {
            let port = undefined;
            const element = this._getGraphElementAtPointerPosition();
            if (element && element.type === 3 /* EGraphCore.Type.CONNECTOR */ && element.data.uiElement instanceof UIPort) {
                port = element.data.uiElement;
            }
            return port;
        }
        /**
         * Gets the mouse client position.
         * @public
         * @returns {IClientPosition} The mouse client position.
         */
        getMouseClientPosition() {
            return this._clientPosition;
        }
        /**
         * Gets the EGraph state machine.
         * @public
         * @returns {EGraphIact.StateMachine} The EGraph state machine.
         */
        getStateMachine() {
            return this._stateMachine;
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
         * The callback on the mouse down event.
         * @private
         * @param {EGraphIact.StateMachine} _sm - The state machine.
         * @param {EGraphIact.IEventData} data - The data information.
         * @returns {EGraphIact.StateResult} The state result.
         */
        _onmousedown(_sm, data) {
            const element = data.grElt;
            this._labelController.clearAllLabels();
            this._viewer.getContextualBarController().clearCommands();
            let result = { consume: true };
            if (data.inside) {
                // Unfocus unwanted div and focus main viewer
                window.getSelection()?.removeAllRanges();
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                this._container.focus();
                if (data.button === 4 /* EGraphIact.Buttons.MIDDLE */) {
                    this._nodeIdSelectorsPanel.disablePaintMode();
                    result = this._graphPanning();
                }
                else if (data.button === 1 /* EGraphIact.Buttons.LEFT */) {
                    const mainGraph = this._viewer.getMainGraph();
                    this._doubleLeftClick = data.detail >= 2;
                    mainGraph.removeSmartSearch();
                    mainGraph.hideAllBlocksHalo();
                    if (element !== undefined && element !== null) {
                        element.data = (element.data !== undefined && element.data !== null) ? element.data : {};
                        const uiElement = data.grElt.data.uiElement;
                        if (!(uiElement instanceof UIBlock)) {
                            this._nodeIdSelectorsPanel.disablePaintMode();
                        }
                        if (data.modifiers === 2 /* EGraphIact.Modifiers.SHIFT */) {
                            result = this._handleSelectionClick(data);
                        }
                        else if (element.type === 2 /* EGraphCore.Type.GROUP */) {
                            this._viewer.clearSelection();
                            result = this._handleGroupClick(data);
                        }
                        else if (element.type === 3 /* EGraphCore.Type.CONNECTOR */) {
                            result = this._handleConnectorClick(data);
                        }
                        else if (element.type === 1 /* EGraphCore.Type.NODE */) {
                            result = this._handleNodeClick(data);
                        }
                        else if (element.type === 4 /* EGraphCore.Type.EDGE */) {
                            this._viewer.replaceSelection(element);
                            result = this._handleEdgeClick(data);
                        }
                    }
                    else {
                        this._nodeIdSelectorsPanel.disablePaintMode();
                        result = this._createRectangleSelection(data);
                    }
                }
                else if (data.button === 2 /* EGraphIact.Buttons.RIGHT */) {
                    if (element === undefined || element.type === 2 /* EGraphCore.Type.GROUP */) {
                        this._displayContextualMenu(data);
                    }
                }
            }
            return result;
        }
        /**
         * The callback on the mouse move event.
         * @private
         * @param {EGraphIact.StateMachine} _sm - The state machine.
         * @param {EGraphIact.IEventData} data - The data information.
         */
        _onmousemove(_sm, data) {
            this._clientPosition.clientX = data?.clientPos !== undefined ? data.clientPos[0] : 0;
            this._clientPosition.clientY = data?.clientPos !== undefined ? data.clientPos[1] : 0;
            if (data.grElt !== undefined && data.grElt !== null) {
                const uiElement = data.grElt.data.uiElement;
                const isCtrlPressed = data.modifiers === 1 /* EGraphIact.Modifiers.CTRL */;
                this._labelController.displayLabel(uiElement, isCtrlPressed, data.subElt);
            }
            else {
                //this.labelController.clearAllLabels(); // TODO: remove this line for test data port labels!!
            }
        }
        /**
         * The callback on the mouse up event.
         * We only gets the client position on mouse up for rectangular selection drag.
         * Otherwise it will display the contextual menu after dragging a block!
         * @private
         * @param {Event} event - The mouse up event.
         */
        _onMouseup(event) {
            if (this._stateMachine.drag instanceof EGraphIact.RectSelectionDrag) {
                this._clientPosition.clientX = event.clientX;
                this._clientPosition.clientY = event.clientY;
            }
        }
        /**
         * Gets the graph element at pointer position.
         * @public
         * @returns {EGraphCore.Selectable} The graph element at pointer position.
         */
        _getGraphElementAtPointerPosition() {
            const data = this._stateMachine.buildEventDataFromMouseEvent(this._clientPosition);
            const element = data.grElt !== undefined && data.grElt !== null ? data.grElt : undefined;
            return element;
        }
        /**
         * The callback on the state machine end drag event.
         * @private
         * @param {boolean} cancel - True to cancel the drag else false to confirm it.
         */
        _enddrag(cancel) {
            if (this._stateMachine.drag && this._stateMachine.drag.onend) {
                this._stateMachine.drag.onend(Boolean(cancel));
            }
            this._stateMachine.drag = null;
            if (cancel) {
                this._viewer.getContextualBarController().hideContextualBar();
            }
            else if (this._stateMachine.latestMouseEvent) {
                if (this._clientPosition.clientX === this._stateMachine.latestMouseEvent.clientX &&
                    this._clientPosition.clientY === this._stateMachine.latestMouseEvent.clientY) {
                    const pickInfo = this._stateMachine.pick.pick(this._clientPosition.clientX, this._clientPosition.clientY, this._stateMachine.domRoot);
                    const pickElt = pickInfo.grElt || undefined;
                    if (pickElt !== undefined && pickElt.data !== undefined && pickElt.data.uiElement !== undefined) {
                        const uiElement = pickElt.data.uiElement;
                        if (uiElement instanceof UIPort || uiElement instanceof UILink || uiElement instanceof UIBlock || uiElement instanceof UIComment) {
                            this._viewer.getContextualBarController().displayContextualBar(this._clientPosition.clientX, this._clientPosition.clientY);
                        }
                    }
                }
            }
        }
        /**
         * Handles the selection of elements in the graph.
         * @private
         * @param {EGraphIact.IEventData} data - The data information.
         * @returns {EGraphIact.StateResult} The state result.
         */
        _handleSelectionClick(data) {
            const element = data.grElt;
            if (element.data.graph !== undefined) {
                return this._createRectangleSelection(data);
            }
            else if (this._viewer.isSelected(element)) {
                this._viewer.removeFromSelection(element);
            }
            else {
                this._viewer.addToSelection(element);
            }
            return { consume: true };
        }
        /**
         * Handles the group mouse done event.
         * @private
         * @param {EGraphIact.IEventData} data - The data information.
         * @returns {EGraphIact.StateResult} The state result.
         */
        _handleGroupClick(data) {
            let result = { consume: false, state: EGraphIact.EndDragOnLeftState };
            const isReadOnly = this._viewer.isReadOnly();
            if (!isReadOnly) {
                const element = data.grElt;
                const graph = this._viewer.getMainGraph();
                result.consume = true;
                if (this._doubleLeftClick) {
                    this._viewer.createSmartSearch(data.clientPos[0], data.clientPos[1], data.graphPos[0], data.graphPos[1]);
                }
                else if (graph.getView().isBorder(data.dom)) {
                    this._stateMachine.startdrag(new UIGraphBorderMoveDrag(data.dom, element));
                }
                else {
                    result = this._createRectangleSelection(data);
                }
            }
            return result;
        }
        /**
         * Handles the edge mouse done event.
         * @private
         * @param {EGraphIact.IEventData} data - The data information.
         * @returns {EGraphIact.StateResult} The state result.
         */
        _handleEdgeClick(data) {
            const link = data.grElt.data.uiElement;
            if (link !== undefined) {
                this._viewer.getContextualBarController().displayContextualBar(this._clientPosition.clientX, this._clientPosition.clientY);
                if (link.getModel() instanceof ControlLink) {
                    const isReadOnly = this._viewer.isReadOnly();
                    if (!isReadOnly) {
                        this._stateMachine.startdrag(new EGraphIact.EdgeReshapingDrag(this._stateMachine.graph, data.grElt));
                    }
                }
            }
            return { consume: true, state: EGraphIact.EndDragOnLeftState };
        }
        /**
         * Handles the node mouse done event.
         * @private
         * @param {EGraphIact.IEventData} data - The data information.
         * @returns {EGraphIact.StateResult} The state result.
         */
        _handleNodeClick(data) {
            let stateResult = EGraphIact.EndDragOnLeftState;
            let consume = true;
            const grElement = data.grElt;
            const uiElement = data.grElt.data.uiElement;
            const subElement = data.subElt;
            const isReadOnly = this._viewer.isReadOnly();
            if (uiElement !== undefined) {
                if (uiElement instanceof UIBlock) {
                    const blockView = uiElement.getView();
                    if (blockView.isConfigurationIcon(subElement)) {
                        this._viewer.replaceSelection(grElement);
                        uiElement.openConfigurationDialog();
                        stateResult = null;
                    }
                    else if (blockView.isInfoIcon(subElement)) {
                        this._viewer.replaceSelection(grElement);
                        uiElement.onInfoIconClick();
                        stateResult = null;
                    }
                    else if (blockView.isCategoryIcon(subElement)) {
                        this._viewer.replaceSelection(grElement);
                        uiElement.onCategoryIconClick();
                        stateResult = null;
                    }
                    else if (blockView.isBreakpointIcon(subElement)) {
                        uiElement.onBreakpointIconClick();
                        stateResult = null;
                    }
                    else if (blockView.isBlockContainer(subElement)) {
                        if (this._doubleLeftClick) {
                            this._viewer.replaceSelection(grElement);
                            uiElement.onBlockDblClick();
                            stateResult = null;
                        }
                        else {
                            if (this._nodeIdSelectorsPanel.isPaintModeEnabled()) {
                                const result = this._nodeIdSelectorsPanel.setBlockNodeIdSelector(uiElement);
                                if (result) {
                                    this._viewer.getEditor().getHistoryController().registerEditAction(uiElement);
                                }
                            }
                            else {
                                this._viewer.replaceSelection(grElement);
                                if (!isReadOnly) {
                                    this._stateMachine.startdrag(this._rootState.newDragForElement(this._stateMachine.graph, grElement, subElement));
                                }
                            }
                        }
                    }
                }
                else if (uiElement instanceof UIGraphDataDrawer) {
                    uiElement.onNodeClick(subElement);
                }
                else if (uiElement instanceof UIShortcut) {
                    this._viewer.replaceSelection(grElement);
                    if (!isReadOnly) {
                        this._stateMachine.startdrag(this._rootState.newDragForElement(this._stateMachine.graph, grElement, subElement));
                    }
                }
                else if (uiElement instanceof UIComment || uiElement instanceof UIPersistentLabel) {
                    let doReplaceSelection = true;
                    if (uiElement.getView().isNodeBorderElement(data.dom) && !isReadOnly) {
                        this._stateMachine.startdrag(new UINodeBorderMoveDrag(data.dom, uiElement));
                        stateResult = EGraphIact.EndDragOnLeftState;
                    }
                    else if (uiElement.getView().isNodeDraggableElement(data.dom) && !isReadOnly) {
                        this._stateMachine.startdrag(this._rootState.newDragForElement(this._stateMachine.graph, grElement, subElement));
                    }
                    else if (uiElement instanceof UIPersistentLabel && (uiElement.getView().isUnpinIconElement(data.dom) || uiElement.getView().isEvaluator(data.dom))) {
                        doReplaceSelection = false;
                    }
                    else {
                        consume = false;
                    }
                    if (doReplaceSelection) {
                        this._viewer.replaceSelection(grElement);
                    }
                }
            }
            return { consume: consume, state: stateResult };
        }
        /**
         * Handles the connector mouse done event.
         * @private
         * @param {EGraphIact.IEventData} data - The data information.
         * @returns {EGraphIact.StateResult} The state result.
         */
        _handleConnectorClick(data) {
            const element = data.grElt;
            const port = element.data.uiElement;
            const ctrlPressed = (data.modifiers === 1 /* EGraphIact.Modifiers.CTRL */);
            const altPressed = (data.modifiers === 4 /* EGraphIact.Modifiers.ALT */);
            const isReadOnly = this._viewer.isReadOnly();
            if (port !== undefined) {
                const portModel = port.getModel();
                if (portModel instanceof ControlPort) {
                    if (port instanceof UIGraphControlPort && port.getView().isHandler(data.dom)) {
                        if (this._doubleLeftClick) {
                            port.openDialog();
                        }
                        else {
                            this._viewer.replaceSelection(element);
                            if (!isReadOnly) {
                                this._stateMachine.startdrag(new UIGraphControlPortMoveDrag(element.data.uiElement));
                            }
                        }
                    }
                    else if (port instanceof UIControlPort && this._doubleLeftClick) {
                        port.openDialog();
                    }
                    else {
                        const edgesToReroute = this._getEdgesToReroute(element, ctrlPressed);
                        if (edgesToReroute.length > 0) {
                            if (!isReadOnly) {
                                this._stateMachine.startdrag(new UIControlLinkRerouteDrag(this._stateMachine.graph, element, { id: 'reroot', edgesToReroute: edgesToReroute }));
                            }
                        }
                        else {
                            this._viewer.replaceSelection(element);
                            if (!isReadOnly) {
                                this._stateMachine.startdrag(new UIControlLinkConnectDrag(this._stateMachine.graph, element));
                            }
                        }
                    }
                }
                else if (portModel instanceof DataPort) {
                    if (this._doubleLeftClick && port instanceof UIDataPort) {
                        if (port instanceof UIGraphTestDataPort || port instanceof UIGraphTestSubDataPort) {
                            port.onConnectorDoubleClick();
                        }
                        else {
                            port.openDialog();
                        }
                    }
                    else if (altPressed) {
                        if (!isReadOnly) {
                            this._stateMachine.startdrag(new UIDataPortShortcutDrag(port));
                        }
                    }
                    else {
                        const edgesToReroute = this._getEdgesToReroute(element, ctrlPressed);
                        if (edgesToReroute.length > 0) {
                            if (!isReadOnly) {
                                this._stateMachine.startdrag(new UIDataLinkRerouteDrag(this._stateMachine.graph, element, { id: 'reroot', edgesToReroute: edgesToReroute }));
                            }
                        }
                        else {
                            this._viewer.replaceSelection(element);
                            if (!isReadOnly) {
                                this._stateMachine.startdrag(new UIDataLinkConnectDrag(this._stateMachine.graph, element));
                            }
                        }
                    }
                }
            }
            return { consume: true, state: EGraphIact.EndDragOnLeftState };
        }
        /**
         * Pans the graph in its viewer.
         * @private
         * @returns {EGraphIact.StateResult} The state result.
         */
        _graphPanning() {
            this._viewer.getContextualBarController().clearCommands();
            UIDom.addClassName(document.body, 'sch-graph-panning');
            //document.body.style.cursor = '-webkit-grab';
            this._stateMachine.startdrag(new EGraphIact.ViewpointMoveDrag(this._stateMachine.graphView));
            const stateResult = {
                consume: true,
                state: {
                    onmouseup: () => {
                        this._stateMachine.enddrag(false);
                        UIDom.removeClassName(document.body, 'sch-graph-panning');
                        //document.body.style.cursor = 'default';
                        return { consume: true, state: undefined };
                    }
                }
            };
            return stateResult;
        }
        /**
         * Creates a rectangular selection in the graph.
         * @private
         * @param {EGraphIact.IEventData} data - The data information.
         * @returns {EGraphIact.StateResult} The state result.
         */
        _createRectangleSelection(data) {
            const overlay = new EGraphViews.RectangleOverlay(this._stateMachine.graphView, {
                background: { className: 'sch-graph-selection-background' },
                rectangle: { className: 'sch-graph-selection-rectangle' }
            });
            const pickOptions = {
                overlapping: true,
                nodes: true,
                connectors: true,
                edges: true
            };
            const selectionMode = (data.modifiers === 2 /* EGraphIact.Modifiers.SHIFT */) ? 1 /* EGraphCore.SelectionMode.ADD */ : 0 /* EGraphCore.SelectionMode.REPLACE */;
            const clientPosition = this._clientPosition;
            const applyCB = function () {
                const grView = this.grView;
                const viewer = grView.gr.data.uiElement;
                const pickedElements = grView.rectanglePick(this.x1, this.y1, this.x2, this.y2, this.pickOpts);
                if (this.selectionMode === 0 /* EGraphCore.SelectionMode.REPLACE */) {
                    viewer.updateSelection(pickedElements, this.selectionMode);
                    viewer.getContextualBarController().displayContextualBar(clientPosition.clientX, clientPosition.clientY);
                }
                else {
                    pickedElements.forEach(pickedElement => {
                        if (pickedElement.isSelected()) {
                            viewer.removeFromSelection(pickedElement);
                        }
                        else {
                            viewer.addToSelection(pickedElement);
                        }
                    });
                }
            };
            const rectDrag = new EGraphIact.RectSelectionDrag(this._stateMachine.graphView, data.graphPos[0], data.graphPos[1], overlay, pickOptions, selectionMode, applyCB);
            this._stateMachine.startdrag(rectDrag);
            return { consume: false, state: EGraphIact.EndDragOnLeftState };
        }
        /**
         * Gets the list of edges to reroute.
         * @private
         * @param {EGraphCore.Connector} connector - The connector element.
         * @param {boolean} ctrlPressed - True if control key is pressed else false.
         * @returns {EGraphCore.Edge[]} The list of edges to reroute.
         */
        _getEdgesToReroute(connector, ctrlPressed) {
            let edges = [];
            if (this._stateMachine.edgeRerouteOptions.active) {
                const selectedEdges = [];
                const allEdges = [];
                for (let edge = connector.children.first; edge; edge = edge.next) {
                    allEdges.push(edge.ref);
                    if (edge.ref.selected) {
                        selectedEdges.push(edge.ref);
                    }
                }
                edges = ctrlPressed ? allEdges : selectedEdges;
            }
            return edges;
        }
        /**
         * Displays the contextual menu.
         * @private
         * @param {EGraphIact.IEventData} data - The data information.
         */
        _displayContextualMenu(data) {
            const mouseLeft = data.clientPos[0];
            const mouseTop = data.clientPos[1];
            const graphLeft = data.graphPos[0];
            const graphTop = data.graphPos[1];
            const isReadOnly = this._viewer.isReadOnly();
            const stateMenu = isReadOnly ? 'disabled' : 'enabled';
            WUXMenu.show([{
                    type: 'TitleItem',
                    title: UINLS.get('contextMenuGraphTitle')
                }, {
                    type: 'PushItem',
                    title: UINLS.get('contextMenuAddBlockTitle'),
                    accelerator: 'Space | DblClick',
                    fonticon: { content: 'wux-ui-3ds wux-ui-3ds-search-add' },
                    action: { callback: () => this._viewer.createSmartSearch(mouseLeft, mouseTop, graphLeft, graphTop) },
                    state: stateMenu
                }, {
                    type: 'TitleItem',
                    title: UINLS.get('contextMenuGraphViewTitle')
                }, {
                    type: 'PushItem',
                    title: UINLS.get('contextMenuCenterGraphViewTitle'),
                    accelerator: 'C',
                    fonticon: { content: 'wux-ui-3ds wux-ui-3ds-group' },
                    action: { callback: () => this._viewer.centerView() }
                }, {
                    type: 'PushItem',
                    title: UINLS.get('contextMenuFitGraphInViewTitle'),
                    accelerator: 'F',
                    fonticon: { content: 'wux-ui-3ds wux-ui-3ds-resize-fullscreen' },
                    action: { callback: () => this._viewer.zoomGraphToFitInView() }
                }, {
                    type: 'PushItem',
                    title: UINLS.get('contextMenuZoomGraphOneToOneTitle'),
                    accelerator: 'Numpad0',
                    fonticon: { content: 'wux-ui-3ds wux-ui-3ds-zoom-selected' },
                    action: { callback: () => this._viewer.zoomOneToOne() }
                }, {
                    type: 'PushItem',
                    title: UINLS.get('contextMenuCropGraphTitle'),
                    accelerator: 'K',
                    fonticon: { content: 'wux-ui-3ds wux-ui-3ds-resize-fullscreen-off' },
                    action: { callback: () => this._viewer.getMainGraph().reduceGraphSize() },
                    state: stateMenu
                }], {
                position: { x: mouseLeft + 1, y: mouseTop + 1 }
            }, {
                onShow: () => document.body.querySelector('.wux-menu-mouse')?.classList.add('sch-graph-menu')
            });
        }
    }
    /**
     * This class defines the graph root state.
     * @private
     * @class UIGraphRootState
     * @extends EGraphIact.DefaultRootState
     */
    class UIGraphRootState extends EGraphIact.DefaultRootState {
        /**
         * @public
         * @constructor
         * @param {UIViewer} viewer - The viewer.
         */
        constructor(viewer) {
            super();
            this._viewer = viewer;
        }
        /**
         * The callback on the mouse wheel event.
         * @protected
         * @override
         * @param {EGraphIact.StateMachine} sm - The state machine.
         * @param {EGraphIact.IEventData} data - The data information.
         * @returns {EGraphIact.StateResult} The state result.
         */
        onwheel(sm, data) {
            this._viewer.getContextualBarController().clearCommands();
            let consume = false;
            const isPersistentLabel = data?.grElt?.data?.uiElement instanceof UIPersistentLabel;
            if (!isPersistentLabel) {
                const halfWidth = sm.graphView.domRoot.clientWidth / 2;
                const halfHeight = sm.graphView.domRoot.clientHeight / 2;
                const isCtrlPressed = data.modifiers & 2 /* EGraphIact.Modifiers.SHIFT */;
                const domRootBBox = sm.domRoot.getBoundingClientRect();
                const posx = isCtrlPressed ? halfWidth : data.clientPos[0] - domRootBBox.left;
                const posy = isCtrlPressed ? halfHeight : data.clientPos[1] - domRootBBox.top;
                const scaleMin = sm.graphView.gr.zoomOpts.min;
                const scaleMax = sm.graphView.gr.zoomOpts.max;
                sm.graphView.zoominc(0.5 * data.wheelDelta, posx, posy, [scaleMin, scaleMax, 0.25]);
                consume = true;
                // TODO: edges picking areas
                // iacts.js exports.DefaultRootState.prototype.onwheel
                // Apply scale factor here on edges picking areas
                // sm.graph.updateEdgesPickingAreasSize(vpt[2]);
            }
            return { consume: consume };
        }
        /**
         * The callback on the graph element drag event.
         * @public
         * @override
         * @param {EGraphCore.EGraph} gr - The graph.
         * @param {EGraphCore.Selectable} elt - The dragged element.
         * @param {Element} [subElt] - The optional sub element of the element to drag.
         * @returns {EGraphIact.SinglePtDrag|null} The drag constraint.
         */
        // eslint-disable-next-line class-methods-use-this
        newDragForElement(gr, elt, subElt) {
            let result = null;
            if (elt.type !== 2 /* EGraphCore.Type.GROUP */) {
                if (elt.type === 1 /* EGraphCore.Type.NODE */) {
                    const uiElement = elt.data.uiElement;
                    if (uiElement instanceof UINode && uiElement.isDraggable()) {
                        result = new UINodeMoveDrag(gr);
                    }
                }
                else {
                    result = super.newDragForElement(gr, elt, subElt);
                }
            }
            return result;
        }
    }
    return UIStateMachineController;
});
