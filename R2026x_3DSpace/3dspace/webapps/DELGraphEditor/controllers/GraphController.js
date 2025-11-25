/// <amd-module name="DS/DELGraphEditor/controllers/GraphController"/>
define("DS/DELGraphEditor/controllers/GraphController", ["require", "exports", "DS/DELGraphEditor/utils/GeometricalComputation", "DS/DELGraphEditor/utils/UxActionsUtils", "DS/DELGraphEditor/utils/StaticAttributes", "DS/DELGraphEditor/utils/TextComputations", "DS/DELGraphModel/model/Link", "DS/DELGraphModel/model/Node"], function (require, exports, GeometricalComputation_1, UxActionsUtils_1, StaticAttributes_1, TextComputations_1, Link_1, Node_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GraphController = void 0;
    class GraphController {
        constructor(relationManager, layoutManager, cudManager, moveActionManager, _transactionManager) {
            this._currentSnapshot = []; // store current snapshot
            this._startLassoPos = { "x": 0, "y": 0 }; // lasso Tool start position
            this._freeSelectingZone = { x: 0, y: 0, w: 0, h: 0 }; // lassO Tool free hand selection zone
            // selection bar drag
            this._selectionBardragStartPt = { x: 0, y: 0 }; // selectbar start drag pos
            this._selectionBarCurrentOffset = { x: 0, y: 0 }; // selectbar current offset
            // grid styles
            this._transVector = [0, 0, 1];
            this._visibleGraphElts = [];
            this._mouseCursor = "default";
            this._gridBoudingBox = { x: 0, y: 0, w: 0, h: 0 };
            this._normalizedSvgBoundingRect = { x: 0, y: 0, w: 0, h: 0 };
            // exportToPdf(e: Event) {
            //     e.preventDefault();
            //     this.deSelectAll();
            //     const prev = this._transVector;
            //     this.fitToWindow(); // reset the transformation
            //     const svgElt = document.activeElement as HTMLElement;
            //     const svgBoundingBox = computeBoundingBoxOfSelection(this._cudManager.getGraphEltsList(), 2 * gridStep, 2 * gridStep);
            //     const svgURI = convertSVGToURiComponent(svgElt, { x: svgBoundingBox.x, y: svgBoundingBox.y, w: Math.max(svgBoundingBox.w, 600), h: Math.max(svgBoundingBox.h, 600) });
            //     saveGraphAsPdf('data:image/svg+xml;charset=utf-8,' + svgURI, Math.max(svgBoundingBox.w, 600), Math.max(svgBoundingBox.h, 600))
            //     this.transVector = prev;
            // }
            this.openFile = async (droppedFile) => {
                if (!droppedFile)
                    return;
                const result = await (0, UxActionsUtils_1.readFile)(droppedFile);
                if (!result)
                    return;
                this.loadData(result);
                this.fitToWindow();
            };
            this.saveGraphicalAttributes = () => {
                const graphElts = this._cudManager.getGraphEltsList();
                const nodes = graphElts.filter((elt) => elt instanceof Node_1.Node);
                nodes.forEach((node) => localStorage.setItem(node.id, JSON.stringify({ ...node.position, w: node.width, h: node.height })));
                const links = graphElts.filter((elt) => elt instanceof Link_1.Link);
                links.forEach((link) => localStorage.setItem(link.id, JSON.stringify(link.wayPoints)));
            };
            this._relationManager = relationManager;
            this._layoutManager = layoutManager;
            this._cudManager = cudManager;
            this._moveActionsManager = moveActionManager;
            this._transactionManager = _transactionManager;
        }
        /****  Pointer/Keyboard Events Handlers *******/
        /**
         * Method to handle the pointer over event
         * @param {Event} e
         * @returns
         */
        handleHoverAction(e) {
            e.preventDefault();
            if (!(e instanceof PointerEvent))
                return;
            const { targetGraphElt, cursor } = this._moveActionsManager.updatePointerOnHover((e.target));
            this.mouseCursor = cursor;
            if (typeof targetGraphElt === "undefined")
                return;
            this._transactionManager.sendSingleAction({ action: "expandHoverAction", actionPayload: [targetGraphElt], visibleElts: this._visibleGraphElts });
        }
        /**
         * Method to handle the pointer out event
         * @param {Event} e
         * @returns
         */
        handleOutAction(e) {
            e.preventDefault();
            const targetId = e.target.id.split('_')[1];
            const targetObject = this._cudManager.getGraphEltById(targetId);
            if (typeof targetObject === "undefined")
                return;
            this._transactionManager.sendSingleAction({ action: "expandOutAction", actionPayload: [targetObject], visibleElts: this._visibleGraphElts });
        }
        /**
         * Method to handle the wheel event
         * @param {Event} e
         * @returns
         */
        handleWheelAction(e) {
            if (!(e instanceof WheelEvent))
                return;
            e.preventDefault();
            if (e.ctrlKey)
                this.transVector = (0, UxActionsUtils_1.handleZoom)({ clientX: e.clientX, clientY: e.clientY, deltaY: e.deltaY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
            else if (e.shiftKey)
                this.transVector = (0, UxActionsUtils_1.handlePan)({ deltaX: e.deltaY, deltaY: e.deltaX }, this._transVector);
            else
                this.transVector = (0, UxActionsUtils_1.handlePan)({ deltaX: e.deltaX, deltaY: e.deltaY }, this._transVector);
        }
        /**
         * Method to start the panning action
         * @param e
         */
        startPan(e) {
            e.preventDefault();
            if ((e instanceof PointerEvent)) {
                this._moveActionsManager.startPan(e.clientX, e.clientY, this._transVector);
                this.deSelectAll();
                this.mouseCursor = "grabbing";
            }
            if (window.TouchEvent && e instanceof TouchEvent) {
                this._moveActionsManager.startPinch({ x: e.touches[0].clientX, y: e.touches[0].clientY }, { x: e.touches[1].clientX, y: e.touches[1].clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
                this.deSelectAll();
            }
        }
        /**
         * Method to execute the panning action
         * @param e
         */
        pan(e) {
            e.preventDefault();
            if (e instanceof PointerEvent)
                this.transVector = this._moveActionsManager.pan(e.clientX, e.clientY, this._transVector);
            if (window.TouchEvent && e instanceof TouchEvent)
                this.transVector = this._moveActionsManager.pinch({ x: e.touches[0].clientX, y: e.touches[0].clientY }, { x: e.touches[1].clientX, y: e.touches[1].clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
        }
        /**
        * Method to end the panning action
        * @param e
        */
        endPan() {
            this._moveActionsManager.endPan();
            this.mouseCursor = "default";
        }
        /**
         * Method to start resizing a node/label
         * @param e
         * @returns
         */
        startResize(e) {
            e.preventDefault();
            if (!(e instanceof PointerEvent))
                return;
            this._moveActionsManager.startResizeAction((e.target));
        }
        /**
         * Method to resize a node/label
         * @param e
         * @returns
         */
        resize(e) {
            e.preventDefault();
            if (!(e instanceof PointerEvent) || !this._moveActionsManager.resizableElement)
                return;
            const [newWidth, newHeight] = (0, TextComputations_1.computeNewDimensionsAfterResizing)(this._moveActionsManager.resizableElement, this._moveActionsManager.horizontalResizeLimit, { x: e.clientX, y: e.clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
            const updatedElts = this._layoutManager.resizeGraphElt(this._moveActionsManager.resizableElement, newWidth, newHeight);
            const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes([...updatedElts, this._moveActionsManager.resizableElement]);
            this._transactionManager.sendSingleAction({ action: "update", actionPayload: [...updatedElts, ...updateLinks], visibleElts: this._visibleGraphElts, externalActionFlag: true });
        }
        /**
         * Method to end the resizing of a node/Label
         */
        endResize() {
            const resizableElt = this._moveActionsManager.endResizeAction();
            this.mouseCursor = "default";
            if (!resizableElt)
                return;
            const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes([resizableElt]);
            this._transactionManager.sendSingleAction({ action: "update", actionPayload: [resizableElt, ...updateLinks], visibleElts: this._visibleGraphElts, listOfarcs: this._layoutManager._listOfIntersectionPoints });
        }
        /**
         * Method to start dragging the selection bar
         * @param e
         * @returns
         */
        startSelectionBarDrag(e) {
            if (!(e instanceof PointerEvent))
                return;
            this._selectionBardragStartPt = { x: e.clientX, y: e.clientY };
        }
        /**
         * Method to drag the selection bar
         * @param e
         * @returns
         */
        dragSelectionBar(e) {
            if (!(e instanceof PointerEvent))
                return;
            const deltaDragOfSelectionBar = { x: e.clientX - this._selectionBardragStartPt.x + this._selectionBarCurrentOffset.x, y: e.clientY - this._selectionBardragStartPt.y + this._selectionBarCurrentOffset.y };
            const selectedElts = this._cudManager.getSelectedElts();
            this._transactionManager.sendSingleAction({ action: "dragSelectioBar", actionPayload: selectedElts, visibleElts: this._visibleGraphElts, deltaOffset: deltaDragOfSelectionBar });
        }
        /**
        * Method to end dragging the selection bar
        * @param e
        * @returns
        */
        endSelectionBarDrag(e) {
            if (!(e instanceof PointerEvent))
                return;
            this._selectionBarCurrentOffset = { x: e.clientX - this._selectionBardragStartPt.x + this._selectionBarCurrentOffset.x, y: e.clientY - this._selectionBardragStartPt.y + this._selectionBarCurrentOffset.y };
            this._selectionBardragStartPt = { x: 0, y: 0 };
        }
        /**
         * Method to start dragging graph elements
         * @param e
         */
        startGraphElementsDrag(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            const targetType = e.target.id.split('_')[0];
            const targetId = (StaticAttributes_1.isMobileDevice && this._transVector[2] < 0.1) ? document.elementFromPoint(e.clientX, e.clientY).id.split('_')[1] : e.target.id.split('_')[1];
            const listOfIdsToBeSelected = this._relationManager.defineIdsOfGraphElementsToSelect(targetId, targetType, e.shiftKey || e.ctrlKey);
            if (listOfIdsToBeSelected.length > 0) {
                const listOfDeselectedElts = this._cudManager.deSelectGraphElementsByIds(listOfIdsToBeSelected);
                const listOfSelectedElts = this._cudManager.selectGraphElementsByIds(listOfIdsToBeSelected);
                const { ancestorsOfEltsTodrag, listOfEltsTodrag } = this._relationManager.defineDraggableElementsFrom(listOfSelectedElts);
                this._selectionBarCurrentOffset = { x: 0, y: 0 };
                this._moveActionsManager.startDragAction({ "x": e.clientX, "y": e.clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
                this._moveActionsManager.listOfAncestorsEltsTodrag = ancestorsOfEltsTodrag;
                this._moveActionsManager.listOfEltsTodrag = listOfEltsTodrag;
                this._transactionManager.start();
                this._transactionManager.register({ action: "deSelect", actionPayload: listOfDeselectedElts, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "select", actionPayload: listOfSelectedElts, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "reorder", actionPayload: listOfEltsTodrag, visibleElts: this._visibleGraphElts });
                this._transactionManager.end();
            }
        }
        /**
         * Method to duplicate graph elements using  (Altkey + drag action)
         * @param e
         * @returns
         */
        duplicateGraphElements(e) {
            if (!(e instanceof PointerEvent))
                return;
            if (e.altKey) {
                const selectedElts = this._cudManager.getSelectedElts();
                const duplicatedElts = this._cudManager.duplicateElts(selectedElts);
                this._layoutManager.addGraphEltsToQuadTree(duplicatedElts);
                this._moveActionsManager.dragMvtDirection = (0, GeometricalComputation_1.defineMvtDirection)(this._moveActionsManager.startDragPos, (0, GeometricalComputation_1.normalizePosition)({ x: e.clientX, y: e.clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]));
                this._moveActionsManager.listOfEltsTodrag = duplicatedElts;
                const bdOfDuplicatedElts = (0, GeometricalComputation_1.computeBoundingBoxOfSelection)(duplicatedElts);
                const mvtBoudingBox = (this._moveActionsManager.dragMvtDirection === "xaxis") ? { x: this._normalizedSvgBoundingRect.x - 10000, y: bdOfDuplicatedElts.y, w: this._normalizedSvgBoundingRect.w + 20000, h: bdOfDuplicatedElts.h } :
                    { x: bdOfDuplicatedElts.x, y: this._normalizedSvgBoundingRect.y - 10000, w: bdOfDuplicatedElts.w, h: this._normalizedSvgBoundingRect.h + 20000 };
                this._transactionManager.start();
                this._transactionManager.register({ action: "deSelect", actionPayload: selectedElts, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "create", actionPayload: duplicatedElts, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "drawBoundingBox", actionPayload: [], visibleElts: this._visibleGraphElts, boundingBox: mvtBoudingBox });
                this._transactionManager.end();
            }
        }
        /**
         * Method to drag graph elements
         * @param e
         * @returns
         */
        dragGraphElements(e) {
            if (!(e instanceof PointerEvent))
                return;
            const draggedElts = this._moveActionsManager.dragGraphElements(e.clientX, e.clientY, this._mouseCursor, [this._gridBoudingBox.x, this._gridBoudingBox.y], this._transVector);
            if (draggedElts.length > 0) {
                const resizedAncestors = this._layoutManager.resizeListOfAncestors(this._moveActionsManager.listOfAncestorsEltsTodrag);
                const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes(this._moveActionsManager.listOfAncestorsEltsTodrag);
                const { visibleElts, invisibleElts } = this.getVisibleAndInvisibleGraphElements();
                this._transactionManager.start();
                this._transactionManager.register({ action: "hide", actionPayload: invisibleElts, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "show", actionPayload: visibleElts, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "drag", actionPayload: draggedElts, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "update", actionPayload: [...resizedAncestors, ...updateLinks], visibleElts: this._visibleGraphElts, externalActionFlag: true });
                this._transactionManager.end();
            }
        }
        /**
         * Method to translare graph elements
         * @param e
         * @returns
         */
        translateGraphElements(e) {
            if (!(e instanceof KeyboardEvent))
                return;
            const selectedElts = this._cudManager.getSelectedElts();
            const [deltaX, deltaY] = (0, GeometricalComputation_1.defineDeltaCoordinatesFromKey)(e.key);
            if (selectedElts.length == 0)
                this.transVector = (0, UxActionsUtils_1.handlePan)({ deltaX: -deltaX, deltaY: -deltaY }, this._transVector);
            else {
                const { ancestorsOfEltsTodrag, listOfEltsTodrag } = this._relationManager.defineDraggableElementsFrom(selectedElts);
                this._moveActionsManager.translateGraphElements(listOfEltsTodrag, deltaX, deltaY);
                const { visibleElts, invisibleElts } = this.getVisibleAndInvisibleGraphElements();
                const resizedAncestors = this._layoutManager.resizeListOfAncestors(ancestorsOfEltsTodrag);
                const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes(ancestorsOfEltsTodrag);
                this._transactionManager.start();
                this._transactionManager.register({ action: "hide", actionPayload: invisibleElts, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "show", actionPayload: visibleElts, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "translate", listOfarcs: this._layoutManager._listOfIntersectionPoints, actionPayload: listOfEltsTodrag, visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "update", actionPayload: [...resizedAncestors, ...updateLinks], visibleElts: this._visibleGraphElts });
                this._transactionManager.end();
            }
        }
        /**
         * Method to drag a detached label element
         * @param e
         * @returns
         */
        dragLabelElement(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            const updatedLabelBox = this._moveActionsManager.dragLabelBox(e.movementX, e.movementY, this._transVector);
            if (!updatedLabelBox)
                return;
            this._transactionManager.sendSingleAction({ action: "update", actionPayload: [updatedLabelBox], visibleElts: this._visibleGraphElts });
        }
        /**
         * Method to drop graph elements
         * @param e
         * @returns
         */
        dropGraphElements() {
            const resizedAncestors = this._layoutManager.resizeListOfAncestors(this._moveActionsManager.listOfAncestorsEltsTodrag);
            const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes(this._moveActionsManager.listOfAncestorsEltsTodrag);
            const updatedElts = this._moveActionsManager.dropGraphElements();
            this._transactionManager.start();
            this._transactionManager.register({ action: "drop", listOfarcs: this._layoutManager._listOfIntersectionPoints, actionPayload: [...resizedAncestors, ...updateLinks, ...updatedElts], visibleElts: this._visibleGraphElts });
            if (["xaxis", "yaxis"].includes(this._moveActionsManager.dragMvtDirection))
                this._transactionManager.register({ action: "eraseBoudingBox", actionPayload: [], visibleElts: this._visibleGraphElts });
            this._transactionManager.end();
            this._moveActionsManager.reset();
            this.mouseCursor = "default";
        }
        /**
         * Method to update the default type of the connection node (to be created when dragging the link from the selection bar)
         * @param e
         * @returns
         */
        updateDefaultConnectionNodeType(e) {
            if (!(e instanceof KeyboardEvent))
                return;
            this._cudManager.updateDefaultConnectionNodeType(e.key);
        }
        /**
         * Method to start the creation a link and connection node by dragging the link from the selection bar.
         */
        startDragToCreateConnection() {
            this._cudManager.startDragToCreateConnection();
        }
        /**
         * Method to drag a link (preview) to create a link and connection node
         * @param e
         * @returns
         */
        dragToCreateConnection(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            const selectedNode = this._cudManager.getSelectedNodes()[0];
            const targetId = !StaticAttributes_1.isMobileDevice ? e.target.id.split('_')[1] : document.elementFromPoint(e.clientX, e.clientY).id.split('_')[1];
            const newConnection = this._cudManager.createConnection(targetId, e.clientX, e.clientY, [this._gridBoudingBox.x, this._gridBoudingBox.y], this._transVector, false);
            if (!newConnection) {
                this.cancelAction();
                return;
            }
            const { link, createdNode } = newConnection;
            this._transactionManager.start();
            if (!createdNode) {
                const wayPt = link.wayPoints[link.wayPoints.length - 1];
                this.mouseCursor = "pointer";
                this._transactionManager.register({ action: "showPreview", actionPayload: [link], floatingConnector: { x: wayPt.x, y: wayPt.y }, visibleElts: this._visibleGraphElts });
            }
            else {
                this.mouseCursor = "custompointer";
                this._transactionManager.register({ action: "showPreview", actionPayload: [link, selectedNode], visibleElts: this._visibleGraphElts });
            }
            this._transactionManager.end();
        }
        /**
         * Method to create a link and connection node
         * @param e
         * @returns
         */
        createConnection(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            this.deSelectAll();
            const targetId = !StaticAttributes_1.isMobileDevice ? e.target.id.split('_')[1] : document.elementFromPoint(e.clientX, e.clientY).id.split('_')[1];
            const newConnection = this._cudManager.createConnection(targetId, e.clientX, e.clientY, [this._gridBoudingBox.x, this._gridBoudingBox.y], this._transVector, true);
            if (!newConnection) {
                this.cancelAction();
                return;
            }
            const { link, createdNode } = newConnection;
            this._transactionManager.start();
            this._layoutManager.addLinkToQuadTree(link);
            this.getVisibleAndInvisibleGraphElements();
            this._transactionManager.register({ action: "hidePreview", actionPayload: [], visibleElts: this._visibleGraphElts });
            this._transactionManager.register({ action: "create", actionPayload: createdNode ? [createdNode, link] : [link], listOfarcs: this._layoutManager._listOfIntersectionPoints, visibleElts: this._visibleGraphElts });
            if (createdNode) {
                this._layoutManager.addNodeToQuadTree(createdNode);
                const listOfAncestors = this._cudManager.getListOfAncestors(createdNode);
                const resizedNodes = this._layoutManager.resizeListOfAncestors(listOfAncestors);
                const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes(listOfAncestors);
                this._transactionManager.register({ action: "update", actionPayload: [...resizedNodes, ...updateLinks], visibleElts: this._visibleGraphElts });
            }
            // to-refactor
            const activeIcon = document.querySelector(".activeIcon");
            activeIcon === null || activeIcon === void 0 ? void 0 : activeIcon.classList.remove("activeIcon");
            this._transactionManager.end();
            this.mouseCursor = "default";
        }
        /**
         * Method to start dragging of connector (link start/endPoint)
         * @param e
         */
        startConnectorDrag(e) {
            e.preventDefault();
            const [_, targetId, wayPt] = e.target.id.split('_');
            this._moveActionsManager.startConnectorDrag(targetId, Number(wayPt));
            this._transactionManager.sendSingleAction({ action: "deactivatePath", actionPayload: [], visibleElts: this._visibleGraphElts });
        }
        /**
         * Method to drag a connector
         * @param e
         * @returns
         */
        dragConnector(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            this.mouseCursor = "pointer";
            const updatedLink = this._moveActionsManager.dragConnector(e.clientX, e.clientY, [this._gridBoudingBox.x, this._gridBoudingBox.y], this._transVector);
            if (!updatedLink)
                return;
            this._transactionManager.sendSingleAction({ action: "drag", actionPayload: [updatedLink], visibleElts: this._visibleGraphElts });
        }
        /**
         * Method to drop a connector
         * @param e
         * @returns
         */
        dropDraggedConnector(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            const targetId = e.target.id.split('_')[1];
            const updatedLink = this._moveActionsManager.dropConnector(targetId);
            if (updatedLink) {
                this.mouseCursor = "default";
                this._transactionManager.start();
                this._transactionManager.register({ action: "activatePath", actionPayload: [], visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "update", listOfarcs: this._layoutManager._listOfIntersectionPoints, actionPayload: [updatedLink], visibleElts: this._visibleGraphElts });
                this._transactionManager.end();
            }
            else {
                this.cancelAction();
            }
        }
        /**
         * Method to cancel the ongoing action
         */
        cancelAction() {
            this.mouseCursor = "default";
            this._moveActionsManager.reset();
            this._cudManager.reset();
            this._layoutManager.reset();
            this._cudManager.createGraph(this._currentSnapshot);
            this._layoutManager.addGraphEltsToQuadTree(this._currentSnapshot);
            this._layoutManager.updateListOfIntersectionsArcs();
            this.getVisibleAndInvisibleGraphElements();
            this._transactionManager.sendSingleAction({ action: "rewrite", listOfarcs: this._layoutManager._listOfIntersectionPoints, actionPayload: this._currentSnapshot, visibleElts: this._visibleGraphElts, externalActionFlag: false });
            const activeIcon = document.querySelector(".activeIcon");
            activeIcon === null || activeIcon === void 0 ? void 0 : activeIcon.classList.remove("activeIcon");
        }
        /**
         * Method to start the free-hand-selection using the lasso tool
         * @param e
         * @returns
         */
        startFreeHandSelection(e) {
            e.preventDefault();
            if (!(e instanceof PointerEvent))
                return;
            this._startLassoPos = (0, GeometricalComputation_1.normalizePosition)({ x: e.clientX, y: e.clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
            this.deSelectAll();
        }
        /**
         * Method to update the free-hand-selection area
         * @param e
         * @returns
         */
        updateFreeHandSelectionArea(e) {
            if (!(e instanceof PointerEvent))
                return;
            const pointerNormalizedCoord = (0, GeometricalComputation_1.normalizePosition)({ x: e.clientX, y: e.clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
            this._freeSelectingZone = (0, GeometricalComputation_1.computeBoundingBoxBetweenTwoPoints)(pointerNormalizedCoord, this._startLassoPos);
            const listOfElementsToBeHighlited = this._layoutManager.findGraphEltsInsideBoundingBoxUsingQuadtree(this._freeSelectingZone);
            this._transactionManager.sendSingleAction({ action: "drawBoundingBox", actionPayload: listOfElementsToBeHighlited, visibleElts: this._visibleGraphElts, boundingBox: this._freeSelectingZone });
        }
        /**
         * Method to end the free-hand-selection action
         * @param e
         */
        endFreeHandSelection() {
            const listOfElementsToBeSelectedIds = this._layoutManager.findGraphEltsInsideBoundingBoxUsingQuadtree(this._freeSelectingZone).map((elt) => elt.id);
            const listOfSelectedElts = this._cudManager.selectGraphElementsByIds(listOfElementsToBeSelectedIds);
            this._transactionManager.start();
            this._transactionManager.register({ action: "eraseBoudingBox", actionPayload: [], visibleElts: this._visibleGraphElts });
            this._transactionManager.register({ action: "select", actionPayload: listOfSelectedElts, visibleElts: this._visibleGraphElts });
            this._transactionManager.end();
            this._freeSelectingZone = { x: 0, y: 0, w: 0, h: 0 }; // reset
            this._startLassoPos = { "x": 0, "y": 0 }; // reset
            const activeIcon = document.querySelector(".activeIcon");
            activeIcon === null || activeIcon === void 0 ? void 0 : activeIcon.classList.remove("activeIcon");
        }
        /**
         * Method to enable the spacing tool mode
         */
        enableSpacingTool() {
            this.mouseCursor = "crosshair";
            this.deSelectAll();
        }
        /**
         * Method to start the spacing action
         * @param e
         * @returns
         */
        startSpacingAction(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            this._moveActionsManager.startGraphElementsSpacing({ x: e.clientX, y: e.clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
            this.mouseCursor = "crosshair";
        }
        /**
         * Method to update the spacing action
         * @param e
         * @returns
         */
        updateSpacingAction(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            if (this._mouseCursor === "crosshair") {
                const startSpacingPos = this._moveActionsManager.pointerSpacingPos;
                const newPointerCursor = (0, UxActionsUtils_1.updateSpacingCursor)(startSpacingPos, { x: e.clientX, y: e.clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
                this.mouseCursor = newPointerCursor;
                if (newPointerCursor !== "crosshair") {
                    const shiftAxis = (newPointerCursor === "col-resize") ? "xaxis" : "yaxis";
                    const { eltsToShift, ancestorsOfEltsToshift, spacingLimitBoundingBox } = this._layoutManager.defineEltsToShift({ x: e.clientX, y: e.clientY }, startSpacingPos, shiftAxis);
                    this._moveActionsManager.setEltsToMoveDuringSpacing(eltsToShift, ancestorsOfEltsToshift, spacingLimitBoundingBox);
                }
                return;
            }
            if (this._mouseCursor === "col-resize")
                this.shiftGraphEltsHorizontally({ x: e.clientX, y: e.clientY });
            if (this._mouseCursor === "row-resize")
                this.shiftGraphEltsVertically({ x: e.clientX, y: e.clientY });
        }
        /**
         * Method to shift the graph elements horizontally
         * @param pointerCoord
         */
        shiftGraphEltsHorizontally(pointerCoord) {
            const relativeCurrentPointerCoord = (0, GeometricalComputation_1.normalizePosition)(pointerCoord, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
            const shiftedElements = this._moveActionsManager.dragAlongXaxisInSpacingToolMode((0, GeometricalComputation_1.convertToGridCoord)(relativeCurrentPointerCoord.x));
            if (shiftedElements.length > 0) {
                const resizedAncestors = this._layoutManager.resizeListOfAncestors(this._moveActionsManager.listOfEltsToShiftAncestors);
                const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes(this._moveActionsManager.listOfEltsToShiftAncestors);
                this._transactionManager.start();
                this._transactionManager.register({ action: "update", listOfarcs: [], actionPayload: [...shiftedElements, ...resizedAncestors, ...updateLinks], visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "drawBoundingBox", actionPayload: [], visibleElts: this._visibleGraphElts, boundingBox: { x: relativeCurrentPointerCoord.x, y: this._normalizedSvgBoundingRect.y, w: 1, h: this._normalizedSvgBoundingRect.h } });
                this._transactionManager.end();
            }
        }
        /**
         * Method to shift the graph elements vertically
         * @param pointerCoord
         */
        shiftGraphEltsVertically(pointerCoord) {
            const relativeCurrentPointerCoord = (0, GeometricalComputation_1.normalizePosition)(pointerCoord, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
            const shiftedElements = this._moveActionsManager.dragAlongYaxisInSpacingToolMode((0, GeometricalComputation_1.convertToGridCoord)(relativeCurrentPointerCoord.y));
            if (shiftedElements.length > 0) {
                const resizedAncestors = this._layoutManager.resizeListOfAncestors(this._moveActionsManager.listOfEltsToShiftAncestors);
                const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes(this._moveActionsManager.listOfEltsToShiftAncestors);
                this._transactionManager.start();
                this._transactionManager.register({ action: "update", listOfarcs: [], actionPayload: [...shiftedElements, ...resizedAncestors, ...updateLinks], visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "drawBoundingBox", actionPayload: [], visibleElts: this._visibleGraphElts, boundingBox: { x: this._normalizedSvgBoundingRect.x, y: relativeCurrentPointerCoord.y, w: this._normalizedSvgBoundingRect.w, h: 1 } });
                this._transactionManager.end();
            }
        }
        /**
         * Method to end an on-going spacing action
         */
        endSpacingAction() {
            this.mouseCursor = "crosshair";
            const listOfDroppedElts = this._moveActionsManager.dropShiftedObjects();
            this._moveActionsManager.pointerSpacingPos = { x: 0, y: 0 };
            this._transactionManager.start();
            this._transactionManager.register({ action: "drop", listOfarcs: this._layoutManager._listOfIntersectionPoints, actionPayload: listOfDroppedElts, visibleElts: this._visibleGraphElts });
            this._transactionManager.register({ action: "eraseBoudingBox", actionPayload: [], visibleElts: this._visibleGraphElts });
            this._transactionManager.end();
        }
        /**
         * Method to disable the spacing tool mode
         */
        disableSpacingTool() {
            this.mouseCursor = "default";
            const activeIcon = document.querySelector(".activeIcon");
            activeIcon === null || activeIcon === void 0 ? void 0 : activeIcon.classList.remove("activeIcon");
        }
        /**
         * Method to select and start dragging a toolbar element
         * @param e
         */
        startToolbarEltDrag(e) {
            if (!(e instanceof CustomEvent))
                return;
            if (e.detail) {
                const toolBarElt = this._cudManager.createNode(true, e.detail.actionTarget === "GroupNode", "", e.detail.actionTarget, "", { "x": -9999, "y": -9999 });
                this._moveActionsManager.startDragElementFromToolBar(toolBarElt);
                this.deSelectAll();
                this._transactionManager.sendSingleAction({ action: "precreate", actionPayload: [toolBarElt], visibleElts: [toolBarElt] });
                this.mouseCursor = "pointer";
            }
        }
        /**
         * Method to drag a toolbar element
         * @param e
         */
        dragToolbarElt(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            const { draggedElt, hoverOverElt, hoverOutElt } = this._moveActionsManager.dragElementFromToolBar(e.clientX, e.clientY, [this._gridBoudingBox.x, this._gridBoudingBox.y], this._transVector);
            this._transactionManager.start();
            this._transactionManager.register({ action: "preDrag", actionPayload: [draggedElt], visibleElts: [draggedElt] });
            if (hoverOverElt)
                this._transactionManager.register({ action: "expandHoverAction", actionPayload: [hoverOverElt], visibleElts: [hoverOverElt] });
            if (hoverOutElt)
                this._transactionManager.register({ action: "expandOutAction", actionPayload: [hoverOutElt], visibleElts: [hoverOutElt] });
            this._transactionManager.end();
        }
        /**
         * Method to drag a toolbar element
         * @param e
         */
        dropToolbarElt(e) {
            if (!(e instanceof PointerEvent))
                return;
            e.preventDefault();
            const pointerNormalizedCoord = (0, GeometricalComputation_1.normalizePosition)({ x: e.clientX, y: e.clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
            const nodeDimension = StaticAttributes_1.nodeDimensionsSet.get(this._moveActionsManager.toolBarElt.type);
            const [nodeWidth, nodeHeight] = nodeDimension ? nodeDimension : [0, 0];
            const newNodePos = { x: (0, GeometricalComputation_1.convertToGridCoord)(pointerNormalizedCoord.x - nodeWidth / 2), y: (0, GeometricalComputation_1.convertToGridCoord)(pointerNormalizedCoord.y - nodeHeight / 2) };
            const newNode = this._cudManager.createNode(false, this._moveActionsManager.toolBarElt.type === "GroupNode", "", this._moveActionsManager.toolBarElt.type, "", newNodePos, this._moveActionsManager.toolBarElt.id);
            const eventTarget = document.elementFromPoint(e.clientX, e.clientY);
            const { deletedLink, createdLink, secondCreatedLink, parentId } = this._cudManager.handleDropOnObject(eventTarget, newNode);
            const createdElts = (createdLink && secondCreatedLink) ? [createdLink, secondCreatedLink, newNode] : [newNode];
            this._layoutManager.addGraphEltsToQuadTree(createdElts);
            newNode.parentId = parentId;
            // update the ancestors size
            const listOfAncestors = this._cudManager.getListOfAncestors(newNode);
            const resizedListOfObjects = this._layoutManager.resizeListOfAncestors(listOfAncestors);
            const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes(listOfAncestors);
            this.getVisibleAndInvisibleGraphElements();
            this._transactionManager.start();
            this._transactionManager.register({ action: "update", actionPayload: [...resizedListOfObjects, ...updateLinks], listOfarcs: this._layoutManager._listOfIntersectionPoints, visibleElts: this._visibleGraphElts });
            this._transactionManager.register({ action: "predelete", actionPayload: [newNode], visibleElts: this._visibleGraphElts });
            this._transactionManager.register({ action: "create", actionPayload: createdElts, visibleElts: this._visibleGraphElts, listOfarcs: this._layoutManager._listOfIntersectionPoints });
            this._transactionManager.end();
            if (deletedLink)
                this.deleteGraphElt(deletedLink.id);
            const activeIcon = document.querySelector(".activeIcon");
            activeIcon === null || activeIcon === void 0 ? void 0 : activeIcon.classList.remove("activeIcon");
        }
        /*****  Getters and setters   *******/
        get mouseCursor() { return this._mouseCursor; }
        set mouseCursor(newCursor) {
            if (this._mouseCursor === newCursor)
                return;
            this._mouseCursor = newCursor;
            this._transactionManager.sendSingleAction({ action: "changeCursor", actionPayload: [], visibleElts: this._visibleGraphElts, mouseCursor: newCursor });
        }
        get transVector() {
            return this._transVector;
        }
        set transVector(newTransVector) {
            if (typeof newTransVector === "undefined" || this._transVector === newTransVector || newTransVector[2] === 0 || isNaN(newTransVector[0]))
                return;
            this._transVector = newTransVector;
            this._selectionBarCurrentOffset = { x: 0, y: 0 };
            const { visibleElts, invisibleElts } = this.getVisibleAndInvisibleGraphElements();
            this._transactionManager.start();
            this._transactionManager.register({ action: "pan", actionPayload: [], visibleElts: this._visibleGraphElts, transformVector: newTransVector });
            this._transactionManager.register({ action: "hide", actionPayload: invisibleElts, visibleElts: this._visibleGraphElts });
            this._transactionManager.register({ action: "show", actionPayload: visibleElts, visibleElts: this._visibleGraphElts });
            this._transactionManager.end();
        }
        get gridBoudingBox() {
            return this._gridBoudingBox;
        }
        set gridBoudingBox(newBoundRect) {
            this._gridBoudingBox = newBoundRect;
            const { visibleElts, invisibleElts } = this.getVisibleAndInvisibleGraphElements();
            this._transactionManager.start();
            this._transactionManager.register({ action: "hide", actionPayload: invisibleElts, visibleElts: this._visibleGraphElts });
            this._transactionManager.register({ action: "show", actionPayload: visibleElts, visibleElts: this._visibleGraphElts });
            this._transactionManager.end();
        }
        get GraphContent() { return this._cudManager.getGraphEltsList(); }
        /*****  Editor Ux Methods [Contextual menu commands]  *******/
        /**
         * Method to copy a graph element
         */
        copyGraphElement() {
            this._cudManager.copyOffset = 2 * StaticAttributes_1.gridStep;
            this._cudManager.clipBoardObjects = this._relationManager.defineElementsToCopy();
        }
        /**
         * Method to cut a graph element
         */
        cutGraphElement() {
            this.copyGraphElement();
            this.deleteGraphElt(); // function to delete selected elements
        }
        /**
         * Method to paste a graph element
         */
        pasteGraphElement() {
            this.deSelectAll();
            const listOfPastedObjects = this._cudManager.pastClipBoardObjects();
            this._layoutManager.addGraphEltsToQuadTree(listOfPastedObjects);
            this.getVisibleAndInvisibleGraphElements();
            this._transactionManager.sendSingleAction({ action: "create", listOfarcs: this._layoutManager._listOfIntersectionPoints, actionPayload: listOfPastedObjects, visibleElts: this._visibleGraphElts });
        }
        /**
         * Method to save the current graph snapshot
         */
        saveCurrentSnapshot() {
            this._currentSnapshot = this._cudManager.saveCurrentSnapshot();
        }
        /**
         * Method to set the focus on the editor
         */
        setFocus() {
            this._transactionManager.sendSingleAction({ action: "focus", actionPayload: [], visibleElts: this._visibleGraphElts });
        }
        /**
         * Method to enable the label authoring mode
         * @returns
         */
        enableLabelAuthoringMode() {
            const updatedElt = this._cudManager.updateGraphElement({ editMode: true });
            if (!(updatedElt))
                return;
            this._transactionManager.sendSingleAction({ action: "update", actionPayload: [updatedElt], visibleElts: this._visibleGraphElts, externalActionFlag: true });
        }
        /**
         * Method to disable the label authoring mode
         * @returns
         */
        disableLabelAuthoringMode() {
            const focusedInput = document === null || document === void 0 ? void 0 : document.activeElement;
            const focusedInputId = focusedInput.id.split('_')[1];
            const innerText = (0, TextComputations_1.getTextFromElement)(focusedInput);
            const updatedElt = this._cudManager.updateGraphElement({ id: focusedInputId, editMode: false, label: innerText });
            if (!(updatedElt))
                return;
            const [labelWidth, labelHeight] = (0, TextComputations_1.computeLabelDimensionsOfGraphElt)(updatedElt);
            const updatedElts = this._layoutManager.resizeGraphElt(updatedElt, labelWidth, labelHeight);
            this._transactionManager.sendSingleAction({ action: "update", actionPayload: updatedElts, visibleElts: this._visibleGraphElts });
        }
        /**
         * Method to get the visible and invisible graph elements
         * @returns graph visible and invisible elements
         */
        getVisibleAndInvisibleGraphElements() {
            this._normalizedSvgBoundingRect = (0, GeometricalComputation_1.normalizeBoudingBox)(this._gridBoudingBox, this._transVector);
            // let start = performance.now();
            const visibleElts = this._layoutManager.findGraphEltsInsideBoundingBox(this._normalizedSvgBoundingRect);
            // const perfoLinear=performance.now()-start;
            // start=performance.now();
            // const visibleElts= this._layoutManager.findGraphEltsInsideBoundingBoxUsingRtree(this._normalizedSvgBoundingRect);
            // const perfoRtree=performance.now()-start;
            // start=performance.now();
            // const visibleElts2 = this._layoutManager.findGraphEltsInsideBoundingBoxUsingQuadtree(this._normalizedSvgBoundingRect);
            // const perfoQuadTree=performance.now()-start;
            // const nbOfElts=visibleElts.length;
            // console.table([
            //     [nbOfElts,"Linear", perfoLinear],
            //     [nbOfElts,"Rtree", perfoRtree],
            //     [nbOfElts,"QuadTree", perfoQuadTree],
            //   ]);
            this._visibleGraphElts = visibleElts;
            const invisibleElts = this._cudManager.getGraphEltsList().filter((graphElt) => !this._visibleGraphElts.includes(graphElt));
            return { visibleElts: visibleElts, invisibleElts: invisibleElts };
        }
        /**
         * Method to adjust the graph dimensions to fit the window dimensions
         */
        fitToWindow() {
            if (this._cudManager.getGraphEltsList().length > 0) {
                const viewPortCenter = [this._gridBoudingBox.x + this._gridBoudingBox.w / 2, this._gridBoudingBox.y + this._gridBoudingBox.h / 2];
                const bdElts = (0, GeometricalComputation_1.computeBoundingBoxOfSelection)(this._cudManager.getGraphEltsList(), 4 * StaticAttributes_1.gridStep, 4 * StaticAttributes_1.gridStep);
                const bdCenter = [bdElts.x + bdElts.w / 2, bdElts.y + bdElts.h / 2];
                const t2 = Math.min(this._gridBoudingBox.w / (bdElts.w), this._gridBoudingBox.h / (bdElts.h), 1);
                const t0 = -((bdElts.x)) * t2;
                const t1 = -((bdElts.y)) * t2;
                const normalizedViewPortCenter = [(viewPortCenter[0] - t0 - this._gridBoudingBox.x) / t2, (viewPortCenter[1] - t1 - this._gridBoudingBox.y) / t2];
                const horizontalOffset = bdCenter[0] - normalizedViewPortCenter[0];
                this.transVector = [t0 - horizontalOffset * t2, t1, t2];
            }
        }
        /**
         * Method to autolayout the graph
         */
        autoLayout() {
            this._layoutManager.autoLayout(this._cudManager.getGraphEltsList());
            this.fitToWindow();
            this.getVisibleAndInvisibleGraphElements();
            this._layoutManager.updateListOfIntersectionsArcs();
            this._transactionManager.sendSingleAction({ action: "rewrite", listOfarcs: this._layoutManager._listOfIntersectionPoints, actionPayload: this._visibleGraphElts, visibleElts: this._visibleGraphElts });
        }
        /**
         * Method to expot the graph to JSON format
         */
        exportToJson() {
            const graphElts = this._cudManager.getGraphEltsList();
            (0, UxActionsUtils_1.saveGraphAsJson)(graphElts);
        }
        /**
         * Method to export the graph and save it as a svg image
         */
        exportToImage() {
            const prev = this._transVector;
            this.deSelectAll();
            this.fitToWindow(); // reset the transformation
            const svgElt = document.activeElement;
            const svgURI = (0, UxActionsUtils_1.convertSVGToURiComponent)(svgElt, { x: this.gridBoudingBox.x, y: this.gridBoudingBox.y, w: Math.max(this.gridBoudingBox.w, 600), h: Math.max(this.gridBoudingBox.h, 600) });
            (0, UxActionsUtils_1.saveGraphAsSVGImage)(svgURI);
            this.transVector = prev;
        }
        /**
         * Method to copy the graph [in png format] in the clipboard
         */
        copyAsImage() {
            const prev = this._transVector;
            this.deSelectAll();
            this.fitToWindow(); // reset the transformation
            const svgElt = document.activeElement;
            const svgURI = (0, UxActionsUtils_1.convertSVGToURiComponent)(svgElt, { x: this.gridBoudingBox.x, y: this.gridBoudingBox.y, w: Math.max(this.gridBoudingBox.w, 600), h: Math.max(this.gridBoudingBox.h, 600) });
            (0, UxActionsUtils_1.convertSVGToPng)(svgURI, { x: this.gridBoudingBox.x, y: this.gridBoudingBox.y, w: Math.max(this.gridBoudingBox.w, 600), h: Math.max(this.gridBoudingBox.h, 600) })
                .then((imgUrl) => (0, UxActionsUtils_1.copyPngToClipBoard)(imgUrl))
                .catch(err => console.error(err));
            this.transVector = prev;
        }
        loadData(diagramContent) {
            // delete the current content
            this._transactionManager.sendSingleAction({ action: "delete", listOfarcs: [], actionPayload: this._cudManager.getGraphEltsList(), visibleElts: this._cudManager.getGraphEltsList() });
            // import new grapph elements
            const graphElts = (0, UxActionsUtils_1.convertJsonObjectToGraphEltsList)(diagramContent);
            this._cudManager.createGraph(graphElts);
            this._layoutManager.reset();
            this._layoutManager.addGraphEltsToQuadTree(graphElts);
            this._layoutManager.updateListOfIntersectionsArcs();
            this.getVisibleAndInvisibleGraphElements();
            this._transactionManager.sendSingleAction({ action: "create", listOfarcs: this._layoutManager._listOfIntersectionPoints, actionPayload: graphElts, visibleElts: this._visibleGraphElts });
        }
        /*****  Graph elements CUD Methods   *******/
        /*****  Graph elements create Methods   *******/
        createNodeElt(e) {
            if (!(e instanceof PointerEvent) && !(e instanceof TouchEvent) && !this._moveActionsManager._isPinching)
                return;
            const clientX = (e instanceof PointerEvent) ? e.clientX : (window.TouchEvent && e instanceof TouchEvent) ? e.touches[0].pageX : 0;
            const clientY = (e instanceof PointerEvent) ? e.clientY : (window.TouchEvent && e instanceof TouchEvent) ? e.touches[0].pageY : 0;
            const targetId = e.target.id.split('_')[1];
            const relativePosition = (0, GeometricalComputation_1.normalizePosition)({ x: clientX, y: clientY }, this._transVector, [this._gridBoudingBox.x, this._gridBoudingBox.y]);
            const xPos = (0, GeometricalComputation_1.convertToGridCoord)(relativePosition.x - StaticAttributes_1.gridStep);
            const yPos = (0, GeometricalComputation_1.convertToGridCoord)(relativePosition.y - StaticAttributes_1.gridStep);
            this.deSelectAll();
            if (targetId) {
                const newNode = this._cudManager.createNode(false, false, targetId, "Node", "", { "x": xPos, "y": yPos });
                const listOfAncestors = this._cudManager.getListOfAncestors(newNode);
                const resizedListOfObjects = this._layoutManager.resizeListOfAncestors(listOfAncestors);
                const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes(listOfAncestors);
                this._layoutManager.addNodeToQuadTree(newNode);
                this.getVisibleAndInvisibleGraphElements();
                this._transactionManager.start();
                this._transactionManager.register({ action: "create", actionPayload: [newNode], visibleElts: this._visibleGraphElts });
                this._transactionManager.register({ action: "update", actionPayload: [...resizedListOfObjects, ...updateLinks], visibleElts: this._visibleGraphElts });
                this._transactionManager.end();
            }
            else {
                const newNode = this._cudManager.createNode(false, false, "", "Node", "", { "x": xPos, "y": yPos });
                this._layoutManager.addNodeToQuadTree(newNode);
                this.getVisibleAndInvisibleGraphElements();
                this._transactionManager.start();
                this._transactionManager.register({ action: "create", actionPayload: [newNode], visibleElts: this._visibleGraphElts });
                this._transactionManager.end();
            }
        }
        createNode(id, label, type, position) {
            if (!this._cudManager.getGraphEltById(id)) {
                const newNode = this._cudManager.createNode(false, false, "", type, label, { "x": 0, "y": 0 }, id);
                newNode.setIsDeselected();
                newNode.moveToPosition(position.x, position.y);
                this._layoutManager.addNodeToQuadTree(newNode);
                this.getVisibleAndInvisibleGraphElements();
                this._transactionManager.sendSingleAction({ action: "create", actionPayload: [newNode], visibleElts: this._visibleGraphElts, externalActionFlag: true });
            }
        }
        createLink(id, type, sourceID, targetID, wayPoints) {
            if (!this._cudManager.getGraphEltById(id)) {
                const newLink = this._cudManager.createLink(type, sourceID, targetID, id);
                newLink.wayPoints = structuredClone(wayPoints);
                this._layoutManager.addLinkToQuadTree(newLink);
                this.getVisibleAndInvisibleGraphElements();
                this._transactionManager.sendSingleAction({ action: "create", actionPayload: [newLink], visibleElts: this._visibleGraphElts, externalActionFlag: true });
            }
        }
        generateMultipleNodes(e) {
            e.preventDefault();
            const listOfNodes = this._cudManager.generateMultipleNodes();
            this.getVisibleAndInvisibleGraphElements();
            this._layoutManager.addGraphEltsToQuadTree(listOfNodes);
            this._transactionManager.sendSingleAction({ action: "create", actionPayload: listOfNodes, visibleElts: this._visibleGraphElts });
        }
        /*****  Graph elements update Methods   *******/
        selectAll() {
            const selectedElts = this._cudManager.selectAll();
            this._transactionManager.sendSingleAction({ action: "select", actionPayload: selectedElts, visibleElts: this._visibleGraphElts });
        }
        deSelectAll() {
            const deselectedElts = this._cudManager.deselectAll();
            this._transactionManager.sendSingleAction({ action: "deSelect", actionPayload: deselectedElts, visibleElts: this._visibleGraphElts });
        }
        updateGraphEltType(e) {
            if (!(e instanceof CustomEvent))
                return;
            const newType = e.detail.actionData;
            this.updateGraphElt({ type: newType });
        }
        updateGraphEltColor(e) {
            if (!(e instanceof CustomEvent))
                return;
            const newColor = e.detail.actionData;
            this.updateGraphElt({ color: newColor });
        }
        updateGraphElt(graphEltsProps, externalActionFlag = false) {
            const { type, data } = graphEltsProps;
            const updatedElt = this._cudManager.updateGraphElement(graphEltsProps);
            if (!(updatedElt))
                return;
            const updateLinks = (type !== updatedElt.type) ? this._moveActionsManager.attachLinksToAnchorsForListOfNodes([updatedElt]) : [];
            this.getVisibleAndInvisibleGraphElements();
            this._layoutManager.updateListOfIntersectionsArcs();
            this._transactionManager.sendSingleAction({ action: "update", actionPayload: [updatedElt, ...updateLinks], visibleElts: [updatedElt, ...updateLinks], listOfarcs: this._layoutManager._listOfIntersectionPoints, externalActionFlag: externalActionFlag });
        }
        updateGraphEltId(oldId, newId) {
            const { oldElt, newElt } = this._cudManager.updateGraphEltId(oldId, newId);
            if (!oldElt || !newElt)
                return;
            this._transactionManager.start();
            this._transactionManager.register({ action: "delete", actionPayload: [oldElt], visibleElts: [oldElt], listOfarcs: this._layoutManager._listOfIntersectionPoints, externalActionFlag: true });
            this._transactionManager.register({ action: "create", actionPayload: [newElt], visibleElts: [newElt], externalActionFlag: true });
            this._transactionManager.end();
        }
        /*****  Graph elements delete Methods   *******/
        deleteGraphElt(id, externalActionFlag = false) {
            const { listOfObjectsToDelete, listOfObjectsToResize } = this._relationManager.defineElementsTodelete(id);
            if (listOfObjectsToDelete.length === 0)
                return;
            this._cudManager.deleteGraphElements(listOfObjectsToDelete);
            this._layoutManager.removeGraphEltsFromQuadTree(listOfObjectsToDelete);
            const resizedListOfObjects = this._layoutManager.resizeListOfAncestors(listOfObjectsToResize);
            const updateLinks = this._moveActionsManager.attachLinksToAnchorsForListOfNodes(listOfObjectsToResize);
            this.getVisibleAndInvisibleGraphElements();
            this._transactionManager.start();
            this._transactionManager.register({ action: "delete", actionPayload: listOfObjectsToDelete, visibleElts: this._visibleGraphElts, listOfarcs: this._layoutManager._listOfIntersectionPoints, externalActionFlag: externalActionFlag });
            this._transactionManager.register({ action: "update", actionPayload: [...resizedListOfObjects, ...updateLinks], visibleElts: this._visibleGraphElts, externalActionFlag: externalActionFlag });
            this._transactionManager.end();
        }
    }
    exports.GraphController = GraphController;
});
