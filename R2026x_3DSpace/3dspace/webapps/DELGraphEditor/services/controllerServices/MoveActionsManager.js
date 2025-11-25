/// <amd-module name="DS/DELGraphEditor/services/controllerServices/MoveActionsManager"/>
define("DS/DELGraphEditor/services/controllerServices/MoveActionsManager", ["require", "exports", "DS/DELGraphModel/model/Link", "DS/DELGraphModel/model/Node", "DS/DELGraphEditor/utils/LinksMovementsUtils", "DS/DELGraphEditor/utils/GeometricalComputation", "DS/DELGraphEditor/utils/StaticAttributes", "DS/DELGraphEditor/utils/UxActionsUtils", "DS/DELGraphEditor/utils/TextComputations"], function (require, exports, Link_1, Node_1, LinksMovementsUtils_1, GeometricalComputation_1, StaticAttributes_1, UxActionsUtils_1, TextComputations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MoveActionsManager = void 0;
    class MoveActionsManager {
        constructor(graphModel) {
            //pinch mvt
            this._isPinching = false;
            this._initialPinchingDistance = 0;
            this._initialPinchingMidPt = { x: 0, y: 0 };
            this._baseScale = 1;
            this.initiTV = [0, 0, 0];
            // resize movement
            this._resizableElement = null;
            this._horizontalResizeLimit = StaticAttributes_1.gridStep;
            // drag&drop a grid element(s)
            this._selectedObjects = [];
            this._listOfEltsTodrag = [];
            this._ancestorsOfEltsTodrag = [];
            this._startDragPos = { "x": 0, "y": 0 };
            this._dragMvtDirection = "xyaxis";
            this._wayPtIndex = 0;
            // drag&drop an element from toolBar
            this._toolBarElt = {};
            this._hoverOverEltDuringToolbarDrag = null;
            // drag a connector (link endPoint)
            this._draggedConnector = null;
            // Spacing Tool transactional attributes
            this._pointerSpacingPos = { "x": 0, "y": 0 };
            this._listOfEltsToShift = [];
            this._listOfEltsToShiftAncestors = [];
            this._spacingLimitElt = [0, 0, 0, 0];
            // pan movement
            this._startPanning = { "x": 0, "y": 0 };
            this._graphModel = graphModel;
        }
        //drag&drop movement
        get listOfEltsTodrag() { return this._listOfEltsTodrag; }
        ;
        get listOfAncestorsEltsTodrag() { return this._ancestorsOfEltsTodrag; }
        ;
        get startDragPos() { return this._startDragPos; }
        set startDragPos(pos) { this._startDragPos = pos; }
        get dragMvtDirection() { return this._dragMvtDirection; }
        set dragMvtDirection(direction) { this._dragMvtDirection = direction; }
        set listOfEltsTodrag(graphElts) { this._listOfEltsTodrag = graphElts; }
        ;
        set listOfAncestorsEltsTodrag(ancestorsList) { this._ancestorsOfEltsTodrag = ancestorsList; }
        ;
        // getters and setters for state variables
        set toolBarElt(node) { this._toolBarElt = node; }
        ;
        set wayPtIndex(value) { this._wayPtIndex = value; }
        ;
        // resize
        get resizableElement() { return this._resizableElement; }
        ;
        get horizontalResizeLimit() { return this._horizontalResizeLimit; }
        ;
        // toolBar elets
        get toolBarElt() { return this._toolBarElt; }
        ;
        // spacing
        get pointerSpacingPos() { return this._pointerSpacingPos; }
        ;
        set pointerSpacingPos(pos) { this._pointerSpacingPos = Object.assign({}, pos); }
        ;
        get listOfEltsToShiftAncestors() { return this._listOfEltsToShiftAncestors; }
        ;
        /** hover action*/
        updatePointerOnHover(targetElt) {
            const [targetType, targetId, wayPtIndex] = targetElt.id.split('_');
            const targetObject = this._graphModel.getEltById(targetId);
            if (wayPtIndex)
                this.wayPtIndex = Number(wayPtIndex);
            let newCursor = "default";
            if (targetObject instanceof Node_1.Node)
                newCursor = (0, UxActionsUtils_1.updateCursorOnNode)(targetType);
            if (targetObject instanceof Link_1.Link)
                newCursor = (0, UxActionsUtils_1.updateCursorOnLink)(targetType, targetObject.wayPoints[Number(wayPtIndex)], targetObject.wayPoints[Number(wayPtIndex) + 1]);
            return { targetGraphElt: targetObject, cursor: newCursor };
        }
        /** Pan movement */
        startPan(clientX, clientY, transVector) {
            this._startPanning = { "x": (clientX - transVector[0]), "y": (clientY - transVector[1]) };
        }
        pan(clientX, clientY, transVector) {
            return this._isPinching ? transVector : [(clientX - this._startPanning.x), (clientY - this._startPanning.y), transVector[2]];
        }
        startPinch(firstFingerPos, secondFingerPos, transVector, offset) {
            if (!this._isPinching) {
                this._isPinching = true;
                this.initiTV = transVector;
                this._baseScale = transVector[2];
                this._initialPinchingDistance = Math.hypot(secondFingerPos.x - firstFingerPos.x, secondFingerPos.y - firstFingerPos.y);
                this._initialPinchingMidPt = { x: ((firstFingerPos.x + secondFingerPos.x) / 2) - offset[0], y: ((firstFingerPos.y + secondFingerPos.y) / 2) - offset[1] };
            }
        }
        pinch(firstFingerPos, secondFingerPos, transVector, offset) {
            if (this._initialPinchingDistance === 0)
                return transVector;
            const newDistance = Math.hypot(secondFingerPos.x - firstFingerPos.x, secondFingerPos.y - firstFingerPos.y);
            const midPt = { x: ((firstFingerPos.x + secondFingerPos.x) / 2) - offset[0], y: ((firstFingerPos.y + secondFingerPos.y) / 2) - offset[1] };
            const scaleFactor = (newDistance / this._initialPinchingDistance);
            const newscale = Math.min(Math.max(0.1, (scaleFactor) * this._baseScale), 4);
            ; // set scale limits;
            const scaleChange = newscale / transVector[2];
            const t0 = midPt.x - (this._initialPinchingMidPt.x - transVector[0]) * scaleChange;
            const t1 = midPt.y - (this._initialPinchingMidPt.y - transVector[1]) * scaleChange;
            this._initialPinchingMidPt = midPt;
            return [t0, t1, newscale];
        }
        endPan() {
            if (this._isPinching) {
                this._isPinching = false;
                this._initialPinchingDistance = 0;
            }
        }
        /** drag&drop movement using the pointer  */
        startDragAction(startPosition, transVector, svgLeftTop) {
            // reset
            this._selectedObjects = [];
            this._listOfEltsTodrag = [];
            this._ancestorsOfEltsTodrag = [];
            this._startDragPos = (0, GeometricalComputation_1.normalizePosition)({ "x": startPosition.x, "y": startPosition.y }, transVector, svgLeftTop);
            this._dragMvtDirection = "xyaxis";
        }
        dragGraphElements(xPos, yPos, mouseCursor, svgLeftTop, transVector) {
            if (this._isPinching)
                return [];
            let delta = { "x": 0, "y": 0 };
            const nodeList = this._listOfEltsTodrag.filter((elt) => elt instanceof Node_1.Node);
            const linkList = this._listOfEltsTodrag.filter((elt) => elt instanceof Link_1.Link);
            nodeList.forEach((currentSelectedObject) => {
                /**  first case: the dragged object is a stateElt */
                if (!currentSelectedObject.editMode) {
                    // drag the selected graphElt
                    if (!currentSelectedObject.isDragged)
                        currentSelectedObject.setIsDragged();
                    const startDragPos = Object.assign({}, currentSelectedObject.position);
                    // delta movement
                    const normalizedCoord = (0, GeometricalComputation_1.normalizePosition)({ x: xPos, y: yPos }, transVector, svgLeftTop);
                    const offset = { x: this._startDragPos.x - currentSelectedObject.shadowEltPosition.x, y: this._startDragPos.y - currentSelectedObject.shadowEltPosition.y };
                    if (this._dragMvtDirection === "yaxis")
                        currentSelectedObject.moveToPosition(startDragPos.x, normalizedCoord.y - offset.y);
                    else if (this._dragMvtDirection === "xaxis")
                        currentSelectedObject.moveToPosition(normalizedCoord.x - offset.x, startDragPos.y);
                    else
                        currentSelectedObject.moveToPosition(normalizedCoord.x - offset.x, normalizedCoord.y - offset.y);
                    if (delta.x === 0 && delta.y === 0)
                        delta = { "x": currentSelectedObject.position.x - startDragPos.x, "y": currentSelectedObject.position.y - startDragPos.y };
                }
            });
            linkList.forEach((currentSelectedObject) => {
                /**  second case: the dragged object is a link  */
                if (this._listOfEltsTodrag.length === 1) {
                    currentSelectedObject.setIsDragged();
                    const offset = { "x": (xPos - svgLeftTop[0] - transVector[0]) / transVector[2], "y": (yPos - svgLeftTop[1] - transVector[1]) / transVector[2] };
                    const sourceNode = this._graphModel.getSource(currentSelectedObject);
                    const targetNode = this._graphModel.getTarget(currentSelectedObject);
                    // --- along x-axis
                    if (sourceNode && targetNode && mouseCursor === "ew-resize" && currentSelectedObject.wayPoints[Number(this._wayPtIndex)] && currentSelectedObject.wayPoints[Number(this._wayPtIndex + 1)]) {
                        const newWayPt = (0, LinksMovementsUtils_1.moveLinkAlongXaxis)(currentSelectedObject, sourceNode, targetNode, this._wayPtIndex, offset);
                        this.wayPtIndex = newWayPt;
                    }
                    // --- along y-axis
                    if (sourceNode && targetNode && mouseCursor === "ns-resize" && currentSelectedObject.wayPoints[Number(this._wayPtIndex)] && currentSelectedObject.wayPoints[Number(this._wayPtIndex + 1)]) {
                        const newWayPt = (0, LinksMovementsUtils_1.moveLinkAlongYaxis)(currentSelectedObject, sourceNode, targetNode, this._wayPtIndex, offset);
                        this.wayPtIndex = newWayPt;
                    }
                }
                else {
                    currentSelectedObject.setIsDragged();
                    const sourceNode = this._graphModel.getEltById(currentSelectedObject.sourceID);
                    const targetNode = this._graphModel.getEltById(currentSelectedObject.targetID);
                    if (!(sourceNode instanceof Node_1.Node) || !(targetNode instanceof Node_1.Node))
                        return;
                    const isSourceNodeMoved = this._listOfEltsTodrag.includes(sourceNode);
                    const isTargetNodeMoved = this._listOfEltsTodrag.includes(targetNode);
                    (0, LinksMovementsUtils_1.updateLinkPath)(currentSelectedObject, sourceNode, targetNode, isSourceNodeMoved, isTargetNodeMoved, delta);
                }
            });
            return this._listOfEltsTodrag;
        }
        translateGraphElements(listOfEltsToTranslate, deltaX, deltaY) {
            listOfEltsToTranslate.forEach((currentSelectedObject) => {
                if (currentSelectedObject instanceof Node_1.Node) {
                    currentSelectedObject.setPos(deltaX, deltaY);
                }
                if (currentSelectedObject instanceof Link_1.Link) {
                    const sourceNode = this._graphModel.getEltById(currentSelectedObject.sourceID);
                    const targetNode = this._graphModel.getEltById(currentSelectedObject.targetID);
                    if (!(sourceNode instanceof Node_1.Node) || !(targetNode instanceof Node_1.Node))
                        return;
                    const isSourceNodeMoved = listOfEltsToTranslate.includes(sourceNode);
                    const isTargetNodeMoved = listOfEltsToTranslate.includes(targetNode);
                    (0, LinksMovementsUtils_1.updateLinkPath)(currentSelectedObject, sourceNode, targetNode, isSourceNodeMoved, isTargetNodeMoved, { "x": deltaX, "y": deltaY });
                    currentSelectedObject.dragShadowElt();
                }
            });
        }
        dropGraphElements() {
            this._listOfEltsTodrag.forEach((currentSelectedObject) => {
                // first case: the selected object is a node
                if (currentSelectedObject instanceof Node_1.Node) {
                    const ancestorsNodeList = this._graphModel.getAncestors(currentSelectedObject);
                    const selectionGuard = ancestorsNodeList.length === 0 || !ancestorsNodeList.some((ancestor) => ancestor.isSelected);
                    // check if the object is dragged
                    if (currentSelectedObject.isDragged) {
                        currentSelectedObject.setIsNotDragged();
                        currentSelectedObject.dragShadowElt();
                    }
                    if (selectionGuard)
                        currentSelectedObject.setIsSelected();
                }
                // second case: the selected object is a Link 
                if (currentSelectedObject instanceof Link_1.Link) {
                    if (currentSelectedObject.isDragged) {
                        currentSelectedObject.setIsNotDragged();
                        currentSelectedObject.dragShadowElt();
                        if (currentSelectedObject.wayPoints.length > 2) {
                            currentSelectedObject.removeDupWayPoints();
                            currentSelectedObject.simplfyPath();
                        }
                    }
                    if (this._listOfEltsTodrag.length === 1)
                        currentSelectedObject.setIsSelected();
                    else {
                        const sourceNode = this._graphModel.getSource(currentSelectedObject);
                        const targetNode = this._graphModel.getTarget(currentSelectedObject);
                        if (sourceNode.isSelected && targetNode.isSelected && sourceNode.id !== targetNode.id)
                            currentSelectedObject.setIsSelected();
                    }
                }
            });
            if (this._isPinching) {
                this._isPinching = false;
                this._initialPinchingDistance = 0;
            }
            return this._listOfEltsTodrag;
        }
        /** connectors drag */
        startConnectorDrag(targetId, endPt) {
            this._draggedConnector = { id: targetId, index: endPt };
        }
        dragConnector(clientX, clientY, svgLeftTop, transVector) {
            let updatedLink = null;
            // pointer coordinates
            const xPos = (clientX - transVector[0] - svgLeftTop[0]) / transVector[2];
            const yPos = (clientY - transVector[1] - svgLeftTop[1]) / transVector[2];
            const xcoord = (0, GeometricalComputation_1.convertToGridCoord)(xPos);
            const ycoord = (0, GeometricalComputation_1.convertToGridCoord)(yPos);
            if (this._draggedConnector !== null) {
                const graphElt = this._graphModel.getEltById(this._draggedConnector.id);
                if (graphElt instanceof Link_1.Link) {
                    updatedLink = graphElt;
                    // next index defintion
                    const currenIndex = (this._draggedConnector.index === 0) ? 0 : (updatedLink.wayPoints.length - 1);
                    const nextIndex = (this._draggedConnector.index === 0) ? 1 : (updatedLink.wayPoints.length - 2);
                    // horizontally or vertically
                    if (updatedLink.wayPoints[currenIndex].x === updatedLink.wayPoints[nextIndex].x) {
                        updatedLink.wayPoints[currenIndex] = { "x": xcoord, "y": ycoord };
                        // path reconstruction
                        if (updatedLink.wayPoints.length > 2) {
                            updatedLink.wayPoints[nextIndex].x = xcoord;
                            updatedLink.simplfyPath();
                        }
                        else {
                            updatedLink.wayPoints = [updatedLink.wayPoints[0], { "x": updatedLink.wayPoints[0].x, "y": (0, GeometricalComputation_1.convertToGridCoord)((updatedLink.wayPoints[0].y + updatedLink.wayPoints[1].y) / 2) }, { "x": updatedLink.wayPoints[1].x, "y": (0, GeometricalComputation_1.convertToGridCoord)((updatedLink.wayPoints[0].y + updatedLink.wayPoints[1].y) / 2) }, updatedLink.wayPoints[1]];
                        }
                    }
                    else {
                        updatedLink.wayPoints[currenIndex] = { "x": xcoord, "y": ycoord };
                        // path reconstruction
                        if (updatedLink.wayPoints.length > 2) {
                            updatedLink.wayPoints[nextIndex].y = ycoord;
                            updatedLink.simplfyPath();
                        }
                        else {
                            updatedLink.wayPoints = [updatedLink.wayPoints[0], { "x": (0, GeometricalComputation_1.convertToGridCoord)((updatedLink.wayPoints[0].x + updatedLink.wayPoints[1].x) / 2), "y": updatedLink.wayPoints[0].y }, { "x": (0, GeometricalComputation_1.convertToGridCoord)((updatedLink.wayPoints[0].x + updatedLink.wayPoints[1].x) / 2), "y": updatedLink.wayPoints[1].y }, updatedLink.wayPoints[1]];
                        }
                    }
                }
            }
            return updatedLink;
        }
        dropConnector(targetId) {
            let updatedLink = null;
            if (typeof targetId !== "undefined" && this._draggedConnector) {
                const targetElt = this._graphModel.getEltById(targetId);
                if (typeof targetElt !== "undefined" && targetElt instanceof Node_1.Node) {
                    const element = this._graphModel.getEltById(this._draggedConnector.id);
                    if (element instanceof Link_1.Link) {
                        updatedLink = element;
                        // 1st case: drag sourceConnector
                        if (this._draggedConnector.index === 0) {
                            updatedLink.sourceID = targetElt.id;
                            // update sourceSide
                            if (updatedLink.wayPoints[0].x === updatedLink.wayPoints[1].x) {
                                if (updatedLink.wayPoints[0].y < updatedLink.wayPoints[1].y)
                                    updatedLink.sourceSide = "South";
                                else
                                    updatedLink.sourceSide = "North";
                                updatedLink.wayPoints[0].y = targetElt.anchors[updatedLink.sourceSide].y;
                            }
                            else {
                                if (updatedLink.wayPoints[0].x < updatedLink.wayPoints[1].x)
                                    updatedLink.sourceSide = "East";
                                else
                                    updatedLink.sourceSide = "West";
                                updatedLink.wayPoints[0].x = targetElt.anchors[updatedLink.sourceSide].x;
                            }
                            // 1st case: drag targetConnector
                        }
                        else {
                            updatedLink.targetID = targetElt.id;
                            // update targetside
                            if (updatedLink.wayPoints[updatedLink.wayPoints.length - 1].x === updatedLink.wayPoints[updatedLink.wayPoints.length - 1 - 1].x) {
                                if (updatedLink.wayPoints[updatedLink.wayPoints.length - 1].y < updatedLink.wayPoints[updatedLink.wayPoints.length - 1 - 1].y)
                                    updatedLink.sourceSide = "South";
                                else
                                    updatedLink.sourceSide = "North";
                                updatedLink.wayPoints[updatedLink.wayPoints.length - 1].y = targetElt.anchors[updatedLink.sourceSide].y;
                            }
                            else {
                                if (updatedLink.wayPoints[updatedLink.wayPoints.length - 1].x < updatedLink.wayPoints[updatedLink.wayPoints.length - 1 - 1].x)
                                    updatedLink.sourceSide = "East";
                                else
                                    updatedLink.sourceSide = "West";
                                updatedLink.wayPoints[updatedLink.wayPoints.length - 1].x = targetElt.anchors[updatedLink.sourceSide].x;
                            }
                        }
                        updatedLink.simplfyPath();
                        updatedLink.dragShadowElt();
                        // reset state
                        this._draggedConnector = null;
                    }
                }
            }
            return updatedLink;
        }
        /** drag&drop from toolBar */
        startDragElementFromToolBar(toolBarElt) {
            this._toolBarElt = toolBarElt;
            this._toolBarElt.setIsDragged();
        }
        dragElementFromToolBar(clientX, clientY, svgLeftTop, transVector) {
            // grid coordinates transformation
            const nodeDimension = StaticAttributes_1.nodeDimensionsSet.get(this._toolBarElt.type);
            const [nodeWidth, nodeHeight] = nodeDimension ? nodeDimension : [0, 0];
            const xcoord = (0, GeometricalComputation_1.convertToGridCoord)((clientX - transVector[0] - svgLeftTop[0]) / transVector[2]) - nodeWidth / 2;
            const ycoord = (0, GeometricalComputation_1.convertToGridCoord)((clientY - transVector[1] - svgLeftTop[1]) / transVector[2]) - nodeHeight / 2;
            this._toolBarElt.moveToPosition(xcoord, ycoord);
            // mimic hoverOver/hoverOut effect
            const possibleTarget = document.elementFromPoint(clientX, clientY).id.split("_")[1];
            const hoverOverElt = this._graphModel.getEltById(possibleTarget);
            if (this._hoverOverEltDuringToolbarDrag && hoverOverElt && hoverOverElt.id === this._hoverOverEltDuringToolbarDrag.id)
                return { draggedElt: this._toolBarElt, hoverOverElt: null, hoverOutElt: null };
            const hoverOutElt = this._hoverOverEltDuringToolbarDrag;
            this._hoverOverEltDuringToolbarDrag = hoverOverElt;
            return { draggedElt: this._toolBarElt, hoverOverElt: this._hoverOverEltDuringToolbarDrag, hoverOutElt: hoverOutElt };
        }
        /** drag text/label box */
        dragLabelBox(movementX, movementY, transVector) {
            const selectedElts = this._graphModel.getSelectedElts();
            const draggablityGuard = selectedElts.length === 1 && (selectedElts[0] instanceof Link_1.Link || (selectedElts[0] instanceof Node_1.Node && ["Initial", "Choice", "Final"].includes(selectedElts[0].type)));
            let updatedElt = null;
            if (draggablityGuard) {
                // to: refactor e.movementX,e.movementY are not supported by saffari
                const xPos = (movementX) / transVector[2];
                const yPos = (movementY) / transVector[2];
                selectedElts[0].updateLabelOffset(xPos, yPos);
                updatedElt = selectedElts[0];
            }
            return updatedElt;
        }
        /** spacing movement */
        startGraphElementsSpacing(pointerCoord, transVector, svgLeftTop) {
            this._pointerSpacingPos = (0, GeometricalComputation_1.normalizePosition)(pointerCoord, transVector, svgLeftTop);
        }
        setEltsToMoveDuringSpacing(eltsToShift, ancestorsOfEltsToshift, spacingLimitBoundingBox) {
            this._listOfEltsToShift = eltsToShift;
            this._listOfEltsToShiftAncestors = ancestorsOfEltsToshift.filter((ancestor) => !eltsToShift.includes(ancestor));
            this._spacingLimitElt = spacingLimitBoundingBox;
            this._pointerSpacingPos = { x: (0, GeometricalComputation_1.convertToGridCoord)(this._pointerSpacingPos.x), y: (0, GeometricalComputation_1.convertToGridCoord)(this._pointerSpacingPos.y) };
        }
        endGraphElementsSpacing() {
            this._spacingLimitElt = [0, 0, 0, 0];
            this._pointerSpacingPos = { "x": 0, "y": 0 };
        }
        /** utils methods > movement algorithms */
        dragAlongXaxisInSpacingToolMode(xcoord) {
            const dx = xcoord - this._pointerSpacingPos.x;
            const shiftGuard = dx > 0 || this._listOfEltsToShift.every((elt) => ((this._spacingLimitElt[0] + this._spacingLimitElt[2]) < elt.position.x + dx));
            if (shiftGuard) {
                let returnedList = [];
                for (const object of this._listOfEltsToShift) {
                    if (!object.isDragged)
                        object.setIsDragged();
                    object.shiftToRight(dx, false);
                    // special case: object is a node
                    if (object instanceof Node_1.Node) {
                        const InLinksList = this._graphModel.getInLinkList(object);
                        // attachInLinksToAnchors(object, InLinksList);
                        InLinksList.forEach((link) => {
                            if (!returnedList.includes(link)) {
                                link.setIsDragged();
                                const sourceObject = this._graphModel.getSource(link);
                                const sourceNodeShifted = this._listOfEltsToShift.includes(sourceObject);
                                (0, LinksMovementsUtils_1.updateLinkPath)(link, sourceObject, object, sourceNodeShifted, true, { "x": dx, "y": 0 });
                                returnedList.push(link);
                            }
                        });
                        const OutLinksList = this._graphModel.getOutLinkList(object);
                        // attachOutLinksToAnchors(object,OutLinksList);
                        // returnedList=[...returnedList,...InLinksList,...OutLinksList];
                        OutLinksList.forEach((link) => {
                            if (!returnedList.includes(link)) {
                                link.setIsDragged();
                                const targetObject = this._graphModel.getTarget(link);
                                const targetNodeShifted = this._listOfEltsToShift.includes(targetObject);
                                (0, LinksMovementsUtils_1.updateLinkPath)(link, object, targetObject, true, targetNodeShifted, { "x": dx, "y": 0 });
                                returnedList.push(link);
                            }
                        });
                    }
                }
                returnedList = returnedList.filter((elt, index) => returnedList.indexOf(elt) === index);
                this._pointerSpacingPos.x = (0, GeometricalComputation_1.convertToGridCoord)(xcoord);
                return [...this._listOfEltsToShift, ...returnedList];
            }
            return [];
        }
        dragAlongYaxisInSpacingToolMode(ycoord) {
            const dy = ycoord - this._pointerSpacingPos.y;
            const shiftGuard = dy > 0 || this._listOfEltsToShift.every((elt) => ((this._spacingLimitElt[1] + this._spacingLimitElt[3]) < elt.position.y + dy));
            if (shiftGuard) {
                let returnedList = [];
                for (const object of this._listOfEltsToShift) {
                    if (!object.isDragged)
                        object.setIsDragged();
                    object.shiftToBottom(dy, false);
                    if (object instanceof Node_1.Node) {
                        const InLinksList = this._graphModel.getInLinkList(object);
                        // attachInLinksToAnchors(object,InLinksList);
                        InLinksList.forEach((link) => {
                            if (!returnedList.includes(link)) {
                                link.setIsDragged();
                                const sourceObject = this._graphModel.getSource(link);
                                const sourceNodeShifted = this._listOfEltsToShift.includes(sourceObject);
                                (0, LinksMovementsUtils_1.updateLinkPath)(link, sourceObject, object, sourceNodeShifted, true, { "x": 0, "y": dy });
                                returnedList.push(link);
                            }
                        });
                        const OutLinksList = this._graphModel.getOutLinkList(object);
                        // attachOutLinksToAnchors(object,OutLinksList);
                        // returnedList=[...returnedList,...InLinksList,...OutLinksList];
                        OutLinksList.forEach((link) => {
                            if (!returnedList.includes(link)) {
                                link.setIsDragged();
                                const targetObject = this._graphModel.getTarget(link);
                                const targetNodeShifted = this._listOfEltsToShift.includes(targetObject);
                                (0, LinksMovementsUtils_1.updateLinkPath)(link, object, targetObject, true, targetNodeShifted, { "x": 0, "y": dy });
                                returnedList.push(link);
                            }
                        });
                    }
                }
                returnedList = returnedList.filter((elt, index) => returnedList.indexOf(elt) === index);
                this._pointerSpacingPos.y = ycoord;
                return [...this._listOfEltsToShift, ...returnedList];
            }
            return [];
        }
        dropShiftedObjects() {
            const relatedLinks = [];
            this._listOfEltsToShift.map((object) => {
                object.setIsNotDragged();
                object.dragShadowElt();
                if (object instanceof Node_1.Node) {
                    const inLinksList = this._graphModel.getInLinkList(object);
                    inLinksList.forEach((link) => {
                        link.setIsNotDragged();
                        link.dragShadowElt();
                        relatedLinks.push(link);
                    });
                    const outLinksList = this._graphModel.getOutLinkList(object);
                    outLinksList.forEach((link) => {
                        link.setIsNotDragged();
                        link.dragShadowElt();
                        relatedLinks.push(link);
                    });
                }
            });
            let dropedObjects = [...this._listOfEltsToShift, ...relatedLinks];
            dropedObjects = dropedObjects.filter((value, index) => dropedObjects.indexOf(value) === index);
            // reset
            this._listOfEltsToShift = [];
            this._listOfEltsToShiftAncestors = [];
            return dropedObjects;
        }
        /** resize actions */
        startResizeAction(eventTarget) {
            const targetId = eventTarget.id.split('_')[1];
            if (!this._graphModel.has(targetId))
                return;
            const targetElt = this._graphModel.getEltById(targetId);
            this._resizableElement = targetElt;
            const labelWidth = (0, TextComputations_1.computeTextLongestWordLength)(this._resizableElement.label); // to define word wrapping limit
            this._horizontalResizeLimit = (["Node", "GroupNode"].includes(this._resizableElement.type)) ? Math.min(4 * StaticAttributes_1.gridStep, Math.max((0, GeometricalComputation_1.convertToGridCoord)(labelWidth), 2 * StaticAttributes_1.gridStep)) : labelWidth; // Math.min(4*gridStep,...) for word-wrap flexibility 
        }
        endResizeAction() {
            const returnedElt = this._resizableElement;
            returnedElt === null || returnedElt === void 0 ? void 0 : returnedElt.dragShadowElt();
            this._resizableElement = null;
            this._horizontalResizeLimit = StaticAttributes_1.gridStep;
            return returnedElt;
        }
        attachLinksToAnchors(graphElt) {
            if (!(graphElt instanceof Node_1.Node))
                return [];
            const inLinksList = this._graphModel.getInLinkList(graphElt);
            (0, LinksMovementsUtils_1.attachLinksToNode)(graphElt, inLinksList, "targetSide");
            const outLinksList = this._graphModel.getOutLinkList(graphElt);
            (0, LinksMovementsUtils_1.attachLinksToNode)(graphElt, outLinksList, "sourceSide");
            return [...inLinksList, ...outLinksList];
        }
        attachLinksToAnchorsForListOfNodes(nodes) {
            let updatedLinks = [];
            nodes.forEach((graphElt) => updatedLinks = [...updatedLinks, ...this.attachLinksToAnchors(graphElt)]);
            return updatedLinks.filter((link, index) => updatedLinks.indexOf(link) === index);
        }
        reset() {
            // reset all state variables
            this._selectedObjects = [];
            this._listOfEltsTodrag = [];
            this._ancestorsOfEltsTodrag = [];
            this._startDragPos = { x: 0, y: 0 };
            // spacing
            this._pointerSpacingPos = { x: 0, y: 0 };
            this._listOfEltsToShift = [];
            this._listOfEltsToShiftAncestors = [];
            this._spacingLimitElt = [0, 0, 0, 0];
            // toolBar action
            this._toolBarElt = {}; // use null type instead of type assertion
            //dragged connector
            this._draggedConnector = null;
            // resize action
            this._resizableElement = null;
            this._horizontalResizeLimit = StaticAttributes_1.gridStep;
        }
    }
    exports.MoveActionsManager = MoveActionsManager;
    exports.default = MoveActionsManager;
});
