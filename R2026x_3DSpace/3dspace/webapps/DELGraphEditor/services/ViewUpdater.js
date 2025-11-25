/// <amd-module name="DS/DELGraphEditor/services/ViewUpdater"/>
define("DS/DELGraphEditor/services/ViewUpdater", ["require", "exports", "DS/DELGraphEditor/components/DELSVGComponents", "DS/DELGraphModel/model/Link", "DS/DELGraphModel/model/Node", "DS/DELGraphEditor/utils/StaticAttributes"], function (require, exports, DELSVGComponents_1, Link_1, Node_1, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewUpdater = void 0;
    const domSizeThreshold = 1500;
    class ViewUpdater {
        constructor(cudManager, editorOptions) {
            this._transVector = [0, 0, 1];
            this._cudManager = cudManager;
            this._componentId = editorOptions.parentId ? editorOptions.parentId.replace(" ", "").replace("#", "").replace(".", "") + document.getElementsByTagName("graph-component").length : "" + document.getElementsByTagName("graph-component").length;
            this._transactionManagerCallback = {
                onGraphModelChange: async (listOfTransactions) => {
                    let listOfCreatedElts = [];
                    let listOfUpdatedElts = [];
                    let listOfDeletedElts = [];
                    // update the view
                    listOfTransactions.forEach((transaction) => {
                        const { action, actionPayload, listOfarcs, mouseCursor, transformVector, boundingBox, externalActionFlag } = transaction;
                        if (action === "rewrite")
                            this.reRender(actionPayload);
                        else if (action === "pan" && transformVector)
                            this.updateViewTransformationVector(this._componentId, transformVector);
                        else if (action === "changeCursor" && mouseCursor)
                            this.updateViewPointer(mouseCursor);
                        else if (action === "drawBoundingBox" && boundingBox) {
                            (0, DELSVGComponents_1.drawFreeSelectionZone)(this._componentId, boundingBox, true);
                            (0, DELSVGComponents_1.highlightElements)(actionPayload);
                        }
                        else if (action === "eraseBoudingBox")
                            this.cleanToolsShapersLayer();
                        else if (action === "focus")
                            this.focus();
                        else {
                            this.incrementalRender(transaction);
                        }
                        // draw intersection arcs
                        if (typeof listOfarcs !== "undefined") {
                            (0, DELSVGComponents_1.drawOrthogonalIntersectionArcs)(this._componentId, listOfarcs);
                        }
                        const listOfElts = actionPayload.filter((elt) => typeof elt !== "undefined" && !elt.isDragged);
                        if (["expandHoverAction", "expandOutAction"].includes(action) && listOfElts.length > 0 && typeof externalActionFlag === "undefined") {
                            if ((action === "expandHoverAction") && editorOptions.onGraphEltsHighlightAction)
                                editorOptions.onGraphEltsHighlightAction(listOfElts);
                            if ((action === "expandOutAction") && editorOptions.onGraphEltsUnHighlightAction)
                                editorOptions.onGraphEltsUnHighlightAction(listOfElts);
                        }
                        if (["create", "update", "delete", "rewrite", "select", "deSelect", "drop"].includes(action) && listOfElts.length > 0 && (!externalActionFlag)) {
                            if ((action === "create") && editorOptions.onGraphEltsCreation)
                                listOfCreatedElts = [...listOfCreatedElts, ...listOfElts];
                            else if ((action === "select") && editorOptions.onGraphEltsSelection)
                                return editorOptions.onGraphEltsSelection(listOfElts);
                            else if ((action === "deSelect") && editorOptions.onGraphEltsDeSelection)
                                return editorOptions.onGraphEltsDeSelection(listOfElts);
                            else if ((action === "update" || action === "drop") && editorOptions.onGraphEltsUpdate)
                                listOfUpdatedElts = [...listOfUpdatedElts, ...listOfElts];
                            else if ((action === "delete") && editorOptions.onGraphEltsDeletion)
                                listOfDeletedElts = [...listOfDeletedElts, ...listOfElts];
                            else if (editorOptions.onGraphModelChange)
                                return editorOptions.onGraphModelChange(this._cudManager.getGraphEltsList()); // replace actionPayload with the new Model
                        }
                    });
                    if (listOfDeletedElts.length > 0 && editorOptions.onGraphEltsDeletion)
                        editorOptions.onGraphEltsDeletion(listOfDeletedElts);
                    if (listOfCreatedElts.length > 0 && editorOptions.onGraphEltsCreation)
                        editorOptions.onGraphEltsCreation(listOfCreatedElts);
                    if (listOfUpdatedElts.length > 0 && editorOptions.onGraphEltsUpdate)
                        editorOptions.onGraphEltsUpdate(listOfUpdatedElts);
                }
            };
        }
        ;
        get transactionManagerCallback() { return this._transactionManagerCallback; }
        ;
        firstRender(graphComponent, graphEltsMap, transformVector, mousecursor) {
            if (transformVector && mousecursor) {
                if (Number.isNaN(transformVector[0]))
                    transformVector[0] = 0;
                if (Number.isNaN(transformVector[1]))
                    transformVector[1] = 0;
                if (Number.isNaN(transformVector[2]))
                    transformVector[2] = 1;
                graphComponent.innerHTML = (0, DELSVGComponents_1.getGridSVGTemplate)(this._componentId, mousecursor, transformVector, StaticAttributes_1.svgStaticPos, StaticAttributes_1.svgWidth, StaticAttributes_1.svgHeight);
                if (graphEltsMap.length > 0) {
                    const graphEltsGroup = document.getElementById(`graphElts-layer_${this._componentId}`);
                    const graphEltsGroupSize = graphEltsGroup ? graphEltsGroup.children.length : 0;
                    graphEltsMap.forEach((graphElt) => {
                        if (graphElt instanceof Node_1.Node) {
                            const nodeElement = (0, DELSVGComponents_1.createGraphNode)(this._componentId, graphElt.id, graphElt.status, graphElt.type, graphElt.label, graphElt.editMode, graphElt.position.x, graphElt.position.y, graphElt.isSelected, graphElt.isDragged, graphElt.width, graphElt.height, graphElt.color, graphElt.labelOffset.left, graphElt.labelOffset.top, graphElt.data, graphEltsGroupSize < domSizeThreshold);
                            graphEltsGroup === null || graphEltsGroup === void 0 ? void 0 : graphEltsGroup.appendChild(nodeElement);
                        }
                        if (graphElt instanceof Link_1.Link) {
                            const connectionElement = (0, DELSVGComponents_1.createGraphLink)(this._componentId, graphElt.id, graphElt.status, graphElt.label, graphElt.width, graphElt.height, graphElt.labelOffset.left, graphElt.labelOffset.top, graphElt.editMode, graphElt.wayPoints, graphElt.color, graphElt.type, graphElt.isSelected, graphElt.isDragged, 6, graphEltsGroupSize < domSizeThreshold);
                            graphEltsGroup === null || graphEltsGroup === void 0 ? void 0 : graphEltsGroup.appendChild(connectionElement);
                        }
                    });
                }
            }
        }
        incrementalRender(transaction) {
            const { action, actionPayload, visibleElts, floatingConnector, listOfMarkers, listOfQuads, deltaOffset } = transaction;
            const listOfEltsToRender = !["show", "hide", "showPreview", "hidePreview", "preDrag", "delete"].includes(transaction.action) ? actionPayload.filter((elt) => visibleElts.includes(elt)) : actionPayload;
            if (listOfEltsToRender) {
                const ghostsGroup = document.getElementById(`ghosts-layer_${this._componentId}`);
                const graphEltsGroup = document.getElementById(`graphElts-layer_${this._componentId}`);
                const graphEltsGroupSize = graphEltsGroup ? graphEltsGroup.children.length : 0;
                const previewGroup = document.getElementById(`preview-layer_${this._componentId}`);
                const graphEltCreationGuard = ["precreate", "create", "show"].includes(action);
                const graphEltDeletionGuard = ["delete", "predelete", "hide"].includes(action);
                const graphEltUpdateGuard = ["select", "deSelect", "reorder", "updateModel", "update", "preupdate"].includes(action);
                const graphEltDropGuard = ["drop"].includes(action);
                const graphEltTranslateGuard = ["translate"].includes(action);
                const graphEltDragGuard = ["drag", "preDrag"].includes(action);
                const ghostShapeCreationGuard = ["drag"].includes(action) && !(ghostsGroup === null || ghostsGroup === void 0 ? void 0 : ghostsGroup.hasChildNodes());
                const ghostShapeDeletionGuard = ["drop", "translate", "cancel"].includes(action) && (ghostsGroup === null || ghostsGroup === void 0 ? void 0 : ghostsGroup.hasChildNodes());
                const previewShapeCreationGuard = ["showPreview"].includes(action);
                const previewShapeDeletionGuard = ["showPreview", "hidePreview"].includes(action);
                const contextToolbarGuard = action !== "preDrag" && listOfEltsToRender.length > 0 && listOfEltsToRender.filter((graphElt) => (typeof graphElt !== "undefined") && graphElt.isSelected && graphElt.status === "ready-to-use").length === 1;
                if (action === "drawQuadTree" && listOfMarkers && listOfQuads) {
                    (0, DELSVGComponents_1.drawQuadTree)(this._componentId, listOfMarkers, listOfQuads);
                }
                if (action === "hideQuadTree" && previewGroup) {
                    previewGroup.innerHTML = ``;
                }
                /**** temporary actions **/
                if (action === "deactivatePath") {
                    const segmentOutlineList = document.querySelectorAll(".connector-group");
                    segmentOutlineList.forEach((elt) => elt.style.pointerEvents = "none");
                }
                if (action === "activatePath") {
                    const segmentOutlineList = document.querySelectorAll(".connector-group");
                    segmentOutlineList.forEach((elt) => elt.style.pointerEvents = "all");
                }
                // show/hide contextToolbar
                if (!["expandHoverAction", "expandOutAction"].includes(action)) {
                    if (contextToolbarGuard) {
                        const graphElt = listOfEltsToRender.filter((graphElt) => graphElt.isSelected)[0];
                        if (typeof graphElt !== "undefined") {
                            if (action === "dragSelectioBar" && deltaOffset)
                                (0, DELSVGComponents_1.updateSelectiobBarPos)(this._componentId, deltaOffset);
                            else {
                                const selectionBarPos = (graphElt instanceof Link_1.Link) ? { "x": graphElt.wayPoints[graphElt.wayPoints.length - 1].x, "y": graphElt.wayPoints[graphElt.wayPoints.length - 1].y } : (graphElt instanceof Node_1.Node) ? { "x": graphElt.anchors["East"].x, "y": graphElt.anchors["Center"].y } : { "x": 0, "y": 0 };
                                (0, DELSVGComponents_1.showSelectionBar)(this._componentId, selectionBarPos, graphElt.color, graphElt.type);
                            }
                        }
                    }
                    else {
                        (0, DELSVGComponents_1.hideSelectionBar)(this._componentId);
                    }
                }
                // clean preview Layer
                if (previewShapeDeletionGuard && previewGroup) {
                    previewGroup.innerHTML = ``;
                }
                if (ghostShapeDeletionGuard && (ghostsGroup === null || ghostsGroup === void 0 ? void 0 : ghostsGroup.hasChildNodes())) {
                    ghostsGroup.innerHTML = ``;
                }
                // update graph nodes and links 
                listOfEltsToRender.forEach((graphElt) => {
                    if (typeof graphElt !== "undefined") {
                        if (graphElt instanceof Node_1.Node) {
                            if (graphEltCreationGuard) {
                                const nodeElementDomElt = document.getElementById("nodeElement_" + graphElt.id);
                                if (nodeElementDomElt)
                                    return;
                                const nodeElement = (0, DELSVGComponents_1.createGraphNode)(this._componentId, graphElt.id, graphElt.status, graphElt.type, graphElt.label, graphElt.editMode, graphElt.position.x, graphElt.position.y, graphElt.isSelected, graphElt.isDragged, graphElt.width, graphElt.height, graphElt.color, graphElt.labelOffset.left, graphElt.labelOffset.top, graphElt.data, graphEltsGroupSize < domSizeThreshold);
                                graphEltsGroup === null || graphEltsGroup === void 0 ? void 0 : graphEltsGroup.appendChild(nodeElement);
                            }
                            if (graphEltDeletionGuard) {
                                const nodeElementDomElt = document.getElementById("nodeElement_" + graphElt.id);
                                nodeElementDomElt === null || nodeElementDomElt === void 0 ? void 0 : nodeElementDomElt.remove();
                            }
                            // graphElt.isDragged => avoid ghost creation when stretching a state 
                            if (ghostShapeCreationGuard && graphElt.isDragged) {
                                const nodeElementDomElt = document.getElementById("nodeElement_" + graphElt.id);
                                const clone = nodeElementDomElt === null || nodeElementDomElt === void 0 ? void 0 : nodeElementDomElt.cloneNode(true);
                                if (clone) {
                                    const stateCloneOutline = clone === null || clone === void 0 ? void 0 : clone.querySelector(".outline");
                                    stateCloneOutline === null || stateCloneOutline === void 0 ? void 0 : stateCloneOutline.setAttribute("stroke", "transparent");
                                    clone.id = "ghost_" + graphElt.id;
                                    ghostsGroup === null || ghostsGroup === void 0 ? void 0 : ghostsGroup.appendChild(clone);
                                }
                            }
                            if (graphEltUpdateGuard || graphEltDragGuard || graphEltDropGuard || graphEltTranslateGuard) {
                                const updatedStateGroup = (0, DELSVGComponents_1.updateGraphNode)(this._componentId, graphElt.id, graphElt.status, graphElt.type, graphElt.label, graphElt.editMode, graphElt.position.x, graphElt.position.y, graphElt.isSelected, graphElt.isDragged, graphElt.width, graphElt.height, graphElt.color, graphElt.labelOffset.left, graphElt.labelOffset.top, graphElt.data, graphEltsGroupSize < domSizeThreshold);
                                // insertbefore : null insert at the end of dom  to layer
                                if (updatedStateGroup && (action === "select" || action === "reorder"))
                                    graphEltsGroup === null || graphEltsGroup === void 0 ? void 0 : graphEltsGroup.insertBefore(updatedStateGroup, null);
                                if (graphEltDragGuard) {
                                    updatedStateGroup === null || updatedStateGroup === void 0 ? void 0 : updatedStateGroup.classList.add("ondrag");
                                }
                                if (graphEltDropGuard || graphEltTranslateGuard) {
                                    updatedStateGroup === null || updatedStateGroup === void 0 ? void 0 : updatedStateGroup.classList.remove("ondrag");
                                }
                            }
                            if (previewShapeCreationGuard) {
                                const nodeElement = (0, DELSVGComponents_1.createGraphNode)(this._componentId, graphElt.id, graphElt.status, graphElt.type, graphElt.label, graphElt.editMode, graphElt.position.x, graphElt.position.y, graphElt.isSelected, graphElt.isDragged, graphElt.width, graphElt.height, graphElt.color, graphElt.labelOffset.left, graphElt.labelOffset.top, graphElt.data, graphEltsGroupSize < domSizeThreshold);
                                previewGroup === null || previewGroup === void 0 ? void 0 : previewGroup.appendChild(nodeElement);
                            }
                            if (action === "expandHoverAction" && !graphElt.isSelected) {
                                const nodeBody = graphElt.type === "GroupNode" ? document.getElementById("bodyGroupNode_" + graphElt.id) : document.getElementById("bodyNode_" + graphElt.id);
                                if (!(nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.contains("node-hovered")))
                                    nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.add("node-hovered");
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", "var(--ds-blue)");
                            }
                            if (action === "expandHoverAction" && !graphElt.isSelected) {
                                const nodeBody = graphElt.type === "GroupNode" ? document.getElementById("bodyGroupNode_" + graphElt.id) : document.getElementById("bodyNode_" + graphElt.id);
                                if (!(nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.contains("node-hovered")))
                                    nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.add("node-hovered");
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", "var(--ds-blue)");
                            }
                            if (action === "highlightCurrentSteps") {
                                const nodeBody = graphElt.type === "GroupNode" ? document.getElementById("bodyGroupNode_" + graphElt.id) : document.getElementById("bodyNode_" + graphElt.id);
                                if (!(nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.contains("node-highlighted")))
                                    nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.add("node-highlighted");
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "var(--darkred)");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "var(--darkred)");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", "var(--darkred)");
                            }
                            if (action === "highlightPreviousSteps") {
                                const nodeBody = graphElt.type === "GroupNode" ? document.getElementById("bodyGroupNode_" + graphElt.id) : document.getElementById("bodyNode_" + graphElt.id);
                                if (nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.contains("node-highlighted"))
                                    nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.remove("node-highlighted");
                                if (!(nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.contains("node-prev-highlighted")))
                                    nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.add("node-prev-highlighted");
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", "var(--darkgreen)");
                            }
                            if (action === "unhighlightSteps") {
                                const nodeBody = graphElt.type === "GroupNode" ? document.getElementById("bodyGroupNode_" + graphElt.id) : document.getElementById("bodyNode_" + graphElt.id);
                                if (nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.contains("node-prev-highlighted"))
                                    nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.remove("node-prev-highlighted");
                                if (nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.contains("node-highlighted"))
                                    nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.remove("node-highlighted");
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "transparent");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "transparent");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                            }
                            if (action === "expandOutAction" && !graphElt.isSelected) {
                                const nodeBody = graphElt.type === "GroupNode" ? document.getElementById("bodyGroupNode_" + graphElt.id) : document.getElementById("bodyNode_" + graphElt.id);
                                if (nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.contains("node-hovered"))
                                    nodeBody === null || nodeBody === void 0 ? void 0 : nodeBody.classList.remove("node-hovered");
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "transparent");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "transparent");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                            }
                        }
                        if (graphElt instanceof Link_1.Link) {
                            if (graphEltCreationGuard) {
                                const connectionElementDomElt = document.getElementById("connectionElement_" + graphElt.id);
                                if (connectionElementDomElt)
                                    return;
                                const connectionElement = (0, DELSVGComponents_1.createGraphLink)(this._componentId, graphElt.id, graphElt.status, graphElt.label, graphElt.width, graphElt.height, graphElt.labelOffset.left, graphElt.labelOffset.top, graphElt.editMode, graphElt.wayPoints, graphElt.color, graphElt.type, graphElt.isSelected, graphElt.isDragged, 6, graphEltsGroupSize < domSizeThreshold);
                                graphEltsGroup === null || graphEltsGroup === void 0 ? void 0 : graphEltsGroup.insertBefore(connectionElement, null);
                            }
                            if (graphEltDeletionGuard) {
                                const connectionElementDomElt = document.getElementById("connectionElement_" + graphElt.id);
                                connectionElementDomElt === null || connectionElementDomElt === void 0 ? void 0 : connectionElementDomElt.remove();
                            }
                            if (graphEltUpdateGuard || graphEltDragGuard || graphEltDropGuard || graphEltTranslateGuard) {
                                const updateLinkGroup = (0, DELSVGComponents_1.updateGraphLink)(this._componentId, graphElt.id, graphElt.status, graphElt.label, graphElt.width, graphElt.height, graphElt.labelOffset.left, graphElt.labelOffset.top, graphElt.editMode, graphElt.wayPoints, graphElt.color, graphElt.type, graphElt.isSelected, graphElt.isDragged, 6, graphEltsGroupSize < domSizeThreshold);
                                if (updateLinkGroup && (action === "select" || action === "reorder")) {
                                    graphEltsGroup === null || graphEltsGroup === void 0 ? void 0 : graphEltsGroup.insertBefore(updateLinkGroup, null);
                                }
                            }
                            if (ghostShapeCreationGuard && graphElt.isDragged) {
                                const connectionElementGhost = (0, DELSVGComponents_1.createGraphLink)(this._componentId, "ghost_" + graphElt.id, graphElt.status, graphElt.label, graphElt.width, graphElt.height, graphElt.labelOffset.left, graphElt.labelOffset.top, false, graphElt.shadowEltWayPoints, graphElt.color, graphElt.type, false, false, 6, graphEltsGroupSize < domSizeThreshold);
                                ghostsGroup === null || ghostsGroup === void 0 ? void 0 : ghostsGroup.prepend(connectionElementGhost);
                            }
                            if (previewShapeCreationGuard) {
                                const connectionElementGhost = (0, DELSVGComponents_1.createGraphLink)(this._componentId, "ghost_" + graphElt.id, graphElt.status, graphElt.label, graphElt.width, graphElt.height, graphElt.labelOffset.left, graphElt.labelOffset.top, false, graphElt.shadowEltWayPoints, graphElt.color, graphElt.type, false, false, 6, graphEltsGroupSize < domSizeThreshold);
                                previewGroup === null || previewGroup === void 0 ? void 0 : previewGroup.appendChild(connectionElementGhost);
                            }
                            if (action === "expandHoverAction" && !graphElt.isSelected && graphElt.status === "ready-to-use") {
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "var(--COLOR_COPY_GRAY)");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", "var(--ds-blue)");
                                if (StaticAttributes_1.isMobileDevice)
                                    pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("marker-end", ``);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("marker-end", `url(#highlightedarrowHead_${this._componentId})`);
                            }
                            if (action === "highlightCurrentSteps" && !graphElt.isSelected && graphElt.status === "ready-to-use") {
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "var(--darkyellow)");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "var(--darkyellow)");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", "var(--darkyellow)");
                            }
                            if (action === "highlightPreviousSteps" && !graphElt.isSelected && graphElt.status === "ready-to-use") {
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "var(--darkgreen)");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "var(--darkgreen)");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", "var(--darkgreen)");
                            }
                            if ((action === "expandOutAction" || action === "unhighlightSteps") && !graphElt.isSelected && graphElt.status === "ready-to-use") {
                                const backgroundDragabbleLabel = document.getElementById("backgroundDragabbleLabel_" + graphElt.id);
                                backgroundDragabbleLabel === null || backgroundDragabbleLabel === void 0 ? void 0 : backgroundDragabbleLabel.setAttribute("stroke", "transparent");
                                const anchorLink = document.getElementById("anchorDragabbleLabel_" + graphElt.id);
                                anchorLink === null || anchorLink === void 0 ? void 0 : anchorLink.setAttribute("stroke", "transparent");
                                const pathLink = document.getElementById("pathFlow_" + graphElt.id);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("stroke", `var(--dark${graphElt.color})`);
                                pathLink === null || pathLink === void 0 ? void 0 : pathLink.setAttribute("marker-end", `url(#${graphElt.color}_arrowHead_${this._componentId})`);
                            }
                        }
                    }
                });
                // add floating connector
                if (previewShapeCreationGuard && previewGroup && floatingConnector) {
                    const floatingConnectorElt = (0, DELSVGComponents_1.drawFloatingConnector)(floatingConnector);
                    previewGroup.appendChild(floatingConnectorElt);
                }
            }
            this.switchFocus(action);
        }
        reRender(actionPayload) {
            // remove snaplines, freehandSelection zones if exist
            (0, DELSVGComponents_1.cleanToolsShapersLayer)(this._componentId);
            // clean ghosts layer
            const ghostsGroup = document.getElementById(`ghosts-layer_${this._componentId}`);
            if (ghostsGroup === null || ghostsGroup === void 0 ? void 0 : ghostsGroup.hasChildNodes())
                ghostsGroup.innerHTML = ``;
            // clean preview layer
            const previewGroup = document.getElementById(`preview-layer_${this._componentId}`);
            if (previewGroup === null || previewGroup === void 0 ? void 0 : previewGroup.hasChildNodes())
                previewGroup.innerHTML = ``;
            if (actionPayload) {
                const selectedElts = actionPayload.filter((graphElt) => graphElt.isSelected && graphElt.status === "ready-to-use");
                const graphEltsGroup = document.getElementById(`graphElts-layer_${this._componentId}`);
                const graphEltsGroupSize = graphEltsGroup ? graphEltsGroup.children.length : 0;
                if (graphEltsGroup)
                    graphEltsGroup.innerHTML = "";
                actionPayload.map((graphElt) => {
                    if (graphElt instanceof Node_1.Node) {
                        const nodeElement = (0, DELSVGComponents_1.createGraphNode)(this._componentId, graphElt.id, graphElt.status, graphElt.type, graphElt.label, graphElt.editMode, graphElt.position.x, graphElt.position.y, graphElt.isSelected, graphElt.isDragged, graphElt.width, graphElt.height, graphElt.color, graphElt.labelOffset.left, graphElt.labelOffset.top, graphElt.data, graphEltsGroupSize < domSizeThreshold);
                        graphEltsGroup === null || graphEltsGroup === void 0 ? void 0 : graphEltsGroup.appendChild(nodeElement);
                    }
                    if (graphElt instanceof Link_1.Link) {
                        const connectionElement = (0, DELSVGComponents_1.createGraphLink)(this._componentId, graphElt.id, graphElt.status, graphElt.label, graphElt.width, graphElt.height, graphElt.labelOffset.left, graphElt.labelOffset.top, graphElt.editMode, graphElt.wayPoints, graphElt.color, graphElt.type, graphElt.isSelected, graphElt.isDragged, 6, graphEltsGroupSize < domSizeThreshold);
                        graphEltsGroup === null || graphEltsGroup === void 0 ? void 0 : graphEltsGroup.appendChild(connectionElement);
                    }
                });
                // show/hide contextToolbar
                if (selectedElts.length === 1) {
                    const graphElt = actionPayload.filter((graphElt) => graphElt.isSelected)[0];
                    if (typeof graphElt !== "undefined") {
                        const selectionBarPos = (graphElt instanceof Link_1.Link) ? { "x": graphElt.wayPoints[graphElt.wayPoints.length - 1].x, "y": graphElt.wayPoints[graphElt.wayPoints.length - 1].y } : (graphElt instanceof Node_1.Node) ? { "x": graphElt.anchors["East"].x, "y": graphElt.anchors["Center"].y } : { "x": 0, "y": 0 };
                        (0, DELSVGComponents_1.showSelectionBar)(this._componentId, selectionBarPos, graphElt.color, graphElt.type);
                    }
                }
                else {
                    (0, DELSVGComponents_1.hideSelectionBar)(this._componentId);
                }
            }
        }
        updateViewPointer(newPointer) {
            const svgLayer = document.getElementById(`svg-Layer_${this._componentId}`);
            // if(newPointer ==="custompointer") svgLayer.style.cursor = "url(https://webui.dsone.3ds.com/DSFiddle/R426/win_b64/webapps/WebUIPortal/assets/I_Pan.png),auto";
            // if(newPointer ==="custompointer") svgLayer.style.cursor = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpCNEZERDA3QkYyNzZFMjExOTJENUUyNUNDNTMzMjQ5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNzhGNEE1NjhDMzUxMUUyOEI5NTk3NzM2M0U0RUU1QSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNzhGNEE1NThDMzUxMUUyOEI5NTk3NzM2M0U0RUU1QSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRjExNkI5QUZCNzZFMjExOTJENUUyNUNDNTMzMjQ5NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNEZERDA3QkYyNzZFMjExOTJENUUyNUNDNTMzMjQ5NiIvPiA8L3JkZjpEZXNjcmlwdGlv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),auto";
            if (newPointer === "custompointer")
                svgLayer.style.cursor = "url(../DELGraphEditor/assets/icons/cursor-create.png),auto";
            else
                svgLayer.style.cursor = newPointer;
        }
        updateViewTransformationVector(componentId, newTransformVector) {
            this._transVector = newTransformVector;
            const graphEltsGroup = document.getElementById(`graphElts-layer_${this._componentId}`);
            const graphEltsGroupSize = graphEltsGroup === null || graphEltsGroup === void 0 ? void 0 : graphEltsGroup.children.length;
            if (graphEltsGroupSize && graphEltsGroupSize >= domSizeThreshold) {
                const graphEltDetailsElts = document.querySelectorAll(".graphEltDetails");
                for (let i = 0; i < graphEltDetailsElts.length; i++) {
                    graphEltDetailsElts[i].remove();
                }
            }
            // elements impacted by Zoom&Pan
            const gridLayer = document.getElementById(`grid-layer_${this._componentId}`);
            const gridContentLayer = document.getElementById(`grid-content-layer_${this._componentId}`);
            const contextSideBar = document.getElementById(`wux-context-tool-bar_${componentId}`);
            // svg Elements
            gridLayer === null || gridLayer === void 0 ? void 0 : gridLayer.setAttribute("transform", `translate(${newTransformVector[0]},${newTransformVector[1]}) scale(${newTransformVector[2]})`);
            gridContentLayer === null || gridContentLayer === void 0 ? void 0 : gridContentLayer.setAttribute("transform", `translate(${newTransformVector[0]},${newTransformVector[1]}) scale(${newTransformVector[2]})`);
            // custom elements
            contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("transmatrix", JSON.stringify(newTransformVector));
        }
        cleanToolsShapersLayer() {
            (0, DELSVGComponents_1.cleanToolsShapersLayer)(this._componentId);
        }
        switchFocus(actionType) {
            var _a, _b;
            if (["expandHoverAction", "expandOutAction"].includes(actionType))
                return;
            const svgElt = document.getElementById(`svg-Layer_${this._componentId}`);
            const eltsToCompare = ["select"].includes(actionType) ? ["DIV", "TEXTAREA"] : ["BODY"];
            if (svgElt && (((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.tagName) && eltsToCompare.includes((_b = document.activeElement) === null || _b === void 0 ? void 0 : _b.tagName)) && document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
                svgElt.focus();
            }
        }
        focus() {
            const svgElt = document.getElementById(`svg-Layer_${this._componentId}`);
            if (svgElt && document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
                svgElt.focus();
            }
        }
        checkOverlapping(pos) {
            const relativePos = { x: pos.x * this._transVector[2] + this._transVector[0] + StaticAttributes_1.gridStep, y: pos.y * this._transVector[2] + this._transVector[1] + StaticAttributes_1.gridStep };
            const overlappingElt = document.elementsFromPoint(relativePos.x, relativePos.y).filter((elt) => elt.tagName === "rect");
            if (overlappingElt.length > 2)
                return true;
            return false;
        }
        getGridSVGElt() {
            return document.getElementById(`svg-Layer_${this._componentId}`);
        }
    }
    exports.ViewUpdater = ViewUpdater;
});
