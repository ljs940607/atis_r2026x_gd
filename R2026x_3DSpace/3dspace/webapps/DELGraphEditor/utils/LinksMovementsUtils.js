/// <amd-module name="DS/DELGraphEditor/utils/LinksMovementsUtils"/>
define("DS/DELGraphEditor/utils/LinksMovementsUtils", ["require", "exports", "DS/DELGraphEditor/utils/GeometricalComputation", "DS/DELGraphEditor/utils/StaticAttributes"], function (require, exports, GeometricalComputation_1, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateLinkPath = exports.getMidPathPoint = exports.generatePathdata = exports.defineTargetNodePosition = exports.defineAttachmentSideFromPointerPosition = exports.defineConnectorsAttachmentSides = exports.attachLinksToNode = exports.moveEndSegmentAlongYaxis = exports.moveEndSegmentAlongXaxis = exports.moveLinkAlongYaxis = exports.moveLinkAlongXaxis = exports.getOppositeSide = void 0;
    /**
     * Function to get the oppposite attachment side
     * @param {attachmentSideType} direction
     * @returns
     */
    const getOppositeSide = (direction) => {
        if (direction === "East")
            return "West";
        if (direction === "West")
            return "East";
        if (direction === "North")
            return "South";
        if (direction === "South")
            return "North";
        return "Center";
    };
    exports.getOppositeSide = getOppositeSide;
    /**
     * Function to drag/move a link along x-axis
     * @param link
     * @param sourceNode
     * @param targetNode
     * @param wayPointIndex
     * @param pointerPos
     * @returns
     */
    const moveLinkAlongXaxis = (link, sourceNode, targetNode, wayPointIndex, pointerPos) => {
        if (pointerPos.x === link.wayPoints[wayPointIndex].x && pointerPos.x === link.wayPoints[wayPointIndex + 1].x)
            return wayPointIndex;
        link.wayPoints[wayPointIndex].x = (0, GeometricalComputation_1.convertToGridCoord)(pointerPos.x);
        link.wayPoints[wayPointIndex + 1].x = (0, GeometricalComputation_1.convertToGridCoord)(pointerPos.x);
        const returnedIndex = (0, exports.moveEndSegmentAlongXaxis)(wayPointIndex, [0, 1], link, sourceNode, "sourceSide");
        (0, exports.moveEndSegmentAlongXaxis)(wayPointIndex, [link.wayPoints.length - 1, link.wayPoints.length - 2], link, targetNode, "targetSide");
        link.simplfyPath(); // path simplification
        if (link.wayPoints.length === 2 && link.wayPoints[0].x !== link.wayPoints[1].x) {
            if (link.wayPoints[0].x < targetNode.anchors["East"].x && link.wayPoints[0].x > targetNode.anchors["West"].x)
                link.wayPoints[1].x = link.wayPoints[0].x;
            else if (link.wayPoints[1].x < sourceNode.anchors["East"].x && link.wayPoints[1].x > sourceNode.anchors["West"].x)
                link.wayPoints[0].x = link.wayPoints[1].x;
            else
                link.updateWayPoint();
        }
        return returnedIndex;
    };
    exports.moveLinkAlongXaxis = moveLinkAlongXaxis;
    const moveLinkAlongYaxis = (link, sourceNode, targetNode, wayPointIndex, pointerPos) => {
        if (pointerPos.y === link.wayPoints[wayPointIndex].y && pointerPos.y === link.wayPoints[wayPointIndex + 1].y)
            return wayPointIndex;
        link.wayPoints[wayPointIndex].y = (0, GeometricalComputation_1.convertToGridCoord)(pointerPos.y);
        link.wayPoints[wayPointIndex + 1].y = (0, GeometricalComputation_1.convertToGridCoord)(pointerPos.y);
        const returnedIndex = (0, exports.moveEndSegmentAlongYaxis)(wayPointIndex, [0, 1], link, sourceNode, "sourceSide");
        (0, exports.moveEndSegmentAlongYaxis)(wayPointIndex, [link.wayPoints.length - 1, link.wayPoints.length - 2], link, targetNode, "targetSide");
        link.simplfyPath(); // path simplification
        if (link.wayPoints.length === 2 && link.wayPoints[0].y !== link.wayPoints[1].y) {
            if (link.wayPoints[0].y < targetNode.anchors["South"].y && link.wayPoints[0].y > targetNode.anchors["North"].y)
                link.wayPoints[1].y = link.wayPoints[0].y;
            else if (link.wayPoints[1].y < sourceNode.anchors["South"].y && link.wayPoints[1].y > sourceNode.anchors["North"].y)
                link.wayPoints[0].y = link.wayPoints[1].y;
            else
                link.updateWayPoint();
        }
        return returnedIndex;
    };
    exports.moveLinkAlongYaxis = moveLinkAlongYaxis;
    /**
     * Function to move the end segment of link along x-axis
     * @param startWayPt
     * @param segment
     * @param link
     * @param node
     * @param attachedSide
     * @returns
     */
    const moveEndSegmentAlongXaxis = (startWayPt, segment, link, node, attachedSide) => {
        let returnedIndex = startWayPt;
        node.updateAnchors();
        const insertionIndex = segment[0] === 0 ? segment[1] : segment[0];
        // fast movement
        if (link.wayPoints[segment[0]].x > link.wayPoints[segment[1]].x && link[attachedSide] === "East") {
            if (link.wayPoints[segment[1]].x > node.anchors["West"].x && link.wayPoints.length > 2) {
                if (segment[0] === 0) {
                    link.wayPoints.shift();
                    returnedIndex = segment[0];
                }
                else {
                    link.wayPoints.pop();
                    segment = [segment[0] - 1, segment[1] - 1];
                }
                if (link.wayPoints[segment[0]].y < link.wayPoints[segment[1]].y)
                    link[attachedSide] = "South";
                else if (link.wayPoints[segment[0]].y > link.wayPoints[segment[1]].y)
                    link[attachedSide] = "North";
                link.wayPoints[segment[0]].y = node.anchors[link[attachedSide]].y;
            }
            else {
                link[attachedSide] = "West";
                link.wayPoints[segment[0]] = node.anchors["West"];
            }
        }
        else if (link.wayPoints[segment[1]].x > link.wayPoints[segment[0]].x && link[attachedSide] === "West") {
            if (link.wayPoints[segment[1]].x > node.anchors["East"].x && link.wayPoints.length > 2) {
                if (segment[0] === 0) {
                    link.wayPoints.shift();
                    returnedIndex = segment[0];
                }
                else {
                    link.wayPoints.pop();
                    segment = [segment[0] - 1, segment[1] - 1];
                }
                if (link.wayPoints[segment[0]].y < link.wayPoints[segment[1]].y)
                    link[attachedSide] = "South";
                else if (link.wayPoints[segment[0]].y > link.wayPoints[segment[1]].y)
                    link[attachedSide] = "North";
                link.wayPoints[segment[0]].y = node.anchors[link[attachedSide]].y;
            }
            else {
                link[attachedSide] = "East";
                link.wayPoints[segment[0]] = node.anchors["East"];
            }
        }
        else if ((node.anchors["West"].x) > link.wayPoints[segment[0]].x) {
            link.wayPoints[segment[0]] = node.anchors["West"];
            link.addWayPoint(insertionIndex, Object.assign({}, { "x": node.anchors["West"].x - StaticAttributes_1.gridStep, "y": node.anchors["West"].y }));
            link[attachedSide] = "West";
            if (segment[0] === 0)
                returnedIndex = segment[1];
            else
                segment = [segment[0] + 1, segment[1] + 1];
        }
        else if ((node.anchors["East"].x) < link.wayPoints[segment[0]].x) {
            link.wayPoints[segment[0]] = node.anchors["East"];
            link.addWayPoint(insertionIndex, Object.assign({}, { "x": node.anchors["East"].x + StaticAttributes_1.gridStep, "y": node.anchors["East"].y }));
            link[attachedSide] = "East";
            if (segment[0] === 0)
                returnedIndex = segment[1];
            else
                segment = [segment[0] + 1, segment[1] + 1];
        }
        else {
            if (link.wayPoints[segment[0]].x == link.wayPoints[segment[1]].x && link.wayPoints[segment[0]].y == link.wayPoints[segment[1]].y && link.wayPoints.length > 2) {
                if (segment[0] === 0) {
                    link.wayPoints.shift();
                    returnedIndex = segment[0];
                }
                else {
                    link.wayPoints.pop();
                    segment = [segment[0] - 1, segment[1] - 1];
                }
            }
            if (link.wayPoints[segment[0]].y < link.wayPoints[segment[1]].y) {
                if (link.wayPoints[segment[1]].y > node.anchors["South"].y)
                    link[attachedSide] = "South";
            }
            else if (link.wayPoints[segment[0]].y > link.wayPoints[segment[1]].y) {
                if (link.wayPoints[segment[1]].y < node.anchors["North"].y)
                    link[attachedSide] = "North";
            }
            link.wayPoints[segment[0]].y = node.anchors[link[attachedSide]].y;
            if ((node.anchors["West"].x) === link.wayPoints[segment[0]].x && ["North", "South"].includes(link[attachedSide]))
                link.wayPoints[segment[0]].x += StaticAttributes_1.gridStep;
            if ((node.anchors["East"].x) === link.wayPoints[segment[0]].x && ["North", "South"].includes(link[attachedSide]))
                link.wayPoints[segment[0]].x -= StaticAttributes_1.gridStep;
        }
        return returnedIndex;
    };
    exports.moveEndSegmentAlongXaxis = moveEndSegmentAlongXaxis;
    /**
     * Function to move the end segment of link along y-axis
     * @param startWayPt
     * @param segment
     * @param link
     * @param node
     * @param attachedSide
     * @returns
     */
    const moveEndSegmentAlongYaxis = (startWayPt, segment, link, node, attachedSide) => {
        let returnedIndex = startWayPt;
        node.updateAnchors();
        const insertionIndex = segment[0] === 0 ? segment[1] : segment[0];
        // fast movement
        if (link.wayPoints[segment[0]].y > link.wayPoints[segment[1]].y && link[attachedSide] === "South") {
            if (link.wayPoints[segment[1]].y > node.anchors["North"].y && link.wayPoints.length > 2) {
                if (segment[0] === 0) {
                    link.wayPoints.shift();
                    returnedIndex = segment[0];
                }
                else {
                    link.wayPoints.pop();
                    segment = [segment[0] - 1, segment[1] - 1];
                }
                if (link.wayPoints[segment[0]].x < link.wayPoints[segment[1]].x)
                    link[attachedSide] = "East";
                else if (link.wayPoints[segment[0]].x > link.wayPoints[segment[1]].x)
                    link[attachedSide] = "West";
                link.wayPoints[segment[0]].x = node.anchors[link[attachedSide]].x;
            }
            else {
                link[attachedSide] = "North";
                link.wayPoints[segment[0]] = node.anchors["North"];
            }
        }
        else if (link.wayPoints[segment[1]].y > link.wayPoints[segment[0]].y && link[attachedSide] === "North") {
            if (link.wayPoints[segment[1]].y > node.anchors["South"].y && link.wayPoints.length > 2) {
                if (segment[0] === 0) {
                    link.wayPoints.shift();
                    returnedIndex = segment[0];
                }
                else {
                    link.wayPoints.pop();
                    segment = [segment[0] - 1, segment[1] - 1];
                }
                if (link.wayPoints[segment[0]].x < link.wayPoints[segment[1]].x)
                    link[attachedSide] = "East";
                else if (link.wayPoints[segment[0]].x > link.wayPoints[segment[1]].x)
                    link[attachedSide] = "West";
                link.wayPoints[segment[0]].x = node.anchors[link[attachedSide]].x;
            }
            else {
                link[attachedSide] = "South";
                link.wayPoints[segment[0]] = node.anchors["South"];
            }
        }
        else if ((node.anchors["North"].y) > link.wayPoints[segment[0]].y) {
            link.wayPoints[segment[0]] = node.anchors["North"];
            link.addWayPoint(insertionIndex, Object.assign({}, { "y": node.anchors["North"].y - StaticAttributes_1.gridStep, "x": node.anchors["North"].x }));
            link[attachedSide] = "North";
            if (segment[0] === 0)
                returnedIndex = segment[1];
            else
                segment = [segment[0] + 1, segment[1] + 1];
        }
        else if ((node.anchors["South"].y) < link.wayPoints[segment[0]].y) {
            link.wayPoints[segment[0]] = node.anchors["South"];
            link.addWayPoint(insertionIndex, Object.assign({}, { "y": node.anchors["South"].y + StaticAttributes_1.gridStep, "x": node.anchors["South"].x }));
            link[attachedSide] = "South";
            if (segment[0] === 0)
                returnedIndex = segment[1];
            else
                segment = [segment[0] + 1, segment[1] + 1];
        }
        else {
            if (link.wayPoints[segment[0]].y == link.wayPoints[segment[1]].y && link.wayPoints[segment[0]].x == link.wayPoints[segment[1]].x && link.wayPoints.length > 2) {
                if (segment[0] === 0) {
                    link.wayPoints.shift();
                    returnedIndex = segment[0];
                }
                else {
                    link.wayPoints.pop();
                    segment = [segment[0] - 1, segment[1] - 1];
                }
            }
            if (link.wayPoints[segment[0]].x < link.wayPoints[segment[1]].x) {
                if (link.wayPoints[segment[1]].x >= node.anchors["East"].x)
                    link[attachedSide] = "East";
            }
            else if (link.wayPoints[segment[0]].x > link.wayPoints[segment[1]].x) {
                if (link.wayPoints[segment[1]].x <= node.anchors["West"].x)
                    link[attachedSide] = "West";
            }
            link.wayPoints[segment[0]].x = node.anchors[link[attachedSide]].x;
            if ((node.anchors["North"].y) === link.wayPoints[segment[0]].y && ["West", "East"].includes(link[attachedSide]))
                link.wayPoints[segment[0]].y += StaticAttributes_1.gridStep;
            if ((node.anchors["South"].y) === link.wayPoints[segment[0]].y && ["West", "East"].includes(link[attachedSide]))
                link.wayPoints[segment[0]].y -= StaticAttributes_1.gridStep;
        }
        return returnedIndex;
    };
    exports.moveEndSegmentAlongYaxis = moveEndSegmentAlongYaxis;
    /**
     * Function to keep links attached their sources/targets
     * @param node
     * @param linksList
     * @param attachedSide
     * @returns
     */
    const attachLinksToNode = (node, linksList, attachedSide) => {
        linksList.forEach((link) => {
            let segment = attachedSide === "sourceSide" ? [0, 1] : [link.wayPoints.length - 1, link.wayPoints.length - 2];
            if (["North", "South"].includes(link[attachedSide])) {
                link.wayPoints[segment[0]].y = node.anchors[link[attachedSide]].y;
                if (link.wayPoints[segment[0]].y > link.wayPoints[segment[1]].y && link[attachedSide] === "South") {
                    if (link.wayPoints[segment[1]].y > node.anchors["North"].y) {
                        if (link.wayPoints.length > 2) {
                            if (segment[0] === 0) {
                                link.wayPoints.shift();
                            }
                            else {
                                link.wayPoints.pop();
                                segment = [segment[0] - 1, segment[1] - 1];
                            }
                        }
                        if (link.wayPoints[segment[0]].x < link.wayPoints[segment[1]].x)
                            link[attachedSide] = "East";
                        else if ((link.wayPoints[segment[0]].x > link.wayPoints[segment[1]].x))
                            link[attachedSide] = "West";
                        link.wayPoints[segment[0]].x = node.anchors[link[attachedSide]].x;
                    }
                    else {
                        link[attachedSide] = "North";
                        link.wayPoints[segment[0]] = node.anchors["North"];
                    }
                }
                else if (link.wayPoints[segment[1]].y > link.wayPoints[segment[0]].y && link[attachedSide] === "North") {
                    if (link.wayPoints[segment[1]].y > node.anchors["South"].y) {
                        if (link.wayPoints.length > 2) {
                            if (segment[0] === 0) {
                                link.wayPoints.shift();
                            }
                            else {
                                link.wayPoints.pop();
                                segment = [segment[0] - 1, segment[1] - 1];
                            }
                        }
                        if (link.wayPoints[segment[0]].x < link.wayPoints[segment[1]].x)
                            link[attachedSide] = "East";
                        else if ((link.wayPoints[segment[0]].x > link.wayPoints[segment[1]].x))
                            link[attachedSide] = "West";
                        link.wayPoints[segment[0]].x = node.anchors[link[attachedSide]].x;
                    }
                    else {
                        link[attachedSide] = "South";
                        link.wayPoints[segment[0]] = node.anchors["South"];
                    }
                }
                if (link.wayPoints[1].x >= node.anchors["East"].x) {
                    link.wayPoints[segment[0]].x = node.anchors["East"].x - StaticAttributes_1.gridStep;
                    link.updateWayPoint();
                }
                if (link.wayPoints[1].x <= node.anchors["West"].x) {
                    link.wayPoints[segment[0]].x = node.anchors["West"].x + StaticAttributes_1.gridStep;
                    link.updateWayPoint();
                }
            }
            if (["West", "East"].includes(link[attachedSide])) {
                link.wayPoints[segment[0]].x = node.anchors[link[attachedSide]].x;
                if (link.wayPoints[segment[0]].x > link.wayPoints[segment[1]].x && link[attachedSide] === "East") {
                    if (link.wayPoints[segment[1]].x > node.anchors["West"].x) {
                        if (link.wayPoints.length > 2) {
                            if (segment[0] === 0) {
                                link.wayPoints.shift();
                            }
                            else {
                                link.wayPoints.pop();
                                segment = [segment[0] - 1, segment[1] - 1];
                            }
                        }
                        if (link.wayPoints[segment[0]].y < link.wayPoints[segment[1]].y)
                            link[attachedSide] = "South";
                        else if (link.wayPoints[segment[0]].y > link.wayPoints[segment[1]].y)
                            link[attachedSide] = "North";
                        link.wayPoints[segment[0]].y = node.anchors[link[attachedSide]].y;
                    }
                    else {
                        link[attachedSide] = "West";
                        link.wayPoints[segment[0]] = node.anchors["West"];
                    }
                }
                else if (link.wayPoints[segment[1]].x > link.wayPoints[segment[0]].x && link[attachedSide] === "West") {
                    if (link.wayPoints[segment[1]].x > node.anchors["East"].x) {
                        if (link.wayPoints.length > 2) {
                            if (segment[0] === 0) {
                                link.wayPoints.shift();
                            }
                            else {
                                link.wayPoints.pop();
                                segment = [segment[0] - 1, segment[1] - 1];
                            }
                        }
                        if (link.wayPoints[segment[0]].y < link.wayPoints[segment[1]].y)
                            link[attachedSide] = "South";
                        else if (link.wayPoints[segment[0]].y > link.wayPoints[segment[1]].y)
                            link[attachedSide] = "North";
                        link.wayPoints[segment[0]].y = node.anchors[link[attachedSide]].y;
                    }
                    else {
                        link[attachedSide] = "East";
                        link.wayPoints[segment[0]] = node.anchors["East"];
                    }
                }
                if (link.wayPoints[1].y >= node.anchors["South"].y) {
                    link.wayPoints[segment[0]].y = node.anchors["South"].y - StaticAttributes_1.gridStep;
                    link.updateWayPoint();
                }
                if (link.wayPoints[1].y <= node.anchors["North"].y) {
                    link.wayPoints[segment[0]].y = node.anchors["North"].y + StaticAttributes_1.gridStep;
                    link.updateWayPoint();
                }
            }
            link.simplfyPath();
            link.dragShadowElt();
        });
    };
    exports.attachLinksToNode = attachLinksToNode;
    /**
     * compute links attachment Sides for In and Out links (transition node case)
     * @param sourceNode
     * @param targetNode
     * @returns
     */
    const defineConnectorsAttachmentSides = (sourceNode, targetNode) => {
        // self transition special case
        if (sourceNode.id !== targetNode.id) {
            if (targetNode.anchors["West"].x > sourceNode.anchors["East"].x) {
                return ["East", "West"];
            }
            else if (targetNode.anchors["East"].x < sourceNode.anchors["West"].x) {
                return ["West", "East"];
            }
            else {
                if (targetNode.anchors["South"].y < sourceNode.anchors["North"].y)
                    return ["North", "South"];
                else
                    return ["South", "North"];
            }
        }
        else {
            return ["East", "South"];
        }
    };
    exports.defineConnectorsAttachmentSides = defineConnectorsAttachmentSides;
    /**
     * Function to define the attachment side from a position
     * @param targetNode
     * @param dropPos
     * @returns
     */
    const defineAttachmentSideFromPointerPosition = (targetNode, dropPos, currentAttachmentSide) => {
        let attachmentSidesLits = ["North", "South", "West", "East"];
        let targetSideIndex = -1;
        let anchorsxPosList = [targetNode.anchors["West"], targetNode.anchors["East"]];
        let anchorsyPosList = [targetNode.anchors["North"], targetNode.anchors["South"]];
        anchorsxPosList.forEach((value, index) => {
            if (targetSideIndex === -1 && Math.abs(value.x - dropPos.x) <= StaticAttributes_1.gridStep / 2)
                targetSideIndex = index + 2;
        });
        anchorsyPosList.forEach((value, index) => {
            if (targetSideIndex === -1 && Math.abs(value.y - dropPos.y) <= StaticAttributes_1.gridStep / 2)
                targetSideIndex = index;
        });
        return targetSideIndex === -1 ? currentAttachmentSide : attachmentSidesLits[targetSideIndex];
    };
    exports.defineAttachmentSideFromPointerPosition = defineAttachmentSideFromPointerPosition;
    /**
     * Function to define target node from mouse position
     * @param sourceNode
     * @param position
     * @returns
     */
    const defineTargetNodePosition = (sourceNode, position, targteType) => {
        const nodeDimension = StaticAttributes_1.nodeDimensionsSet.get(targteType); // default node for automatic creation
        const [nodeWidth, nodeHeight] = nodeDimension ? nodeDimension : [0, 0];
        if (position.x > sourceNode.anchors["East"].x)
            return { "x": position.x, "y": position.y - nodeHeight / 2 };
        else if (position.x < sourceNode.anchors["West"].x)
            return { "x": position.x - nodeWidth, "y": position.y - nodeHeight / 2 };
        else if (position.y < sourceNode.anchors["North"].y)
            return { "x": position.x - nodeWidth / 2, "y": position.y - nodeHeight };
        else if (position.y > sourceNode.anchors["South"].y)
            return { "x": position.x - nodeWidth / 2, "y": position.y };
        return position;
    };
    exports.defineTargetNodePosition = defineTargetNodePosition;
    /**
     * Method to compute the path that links the way points
     * @param listOfwayPoints the list of wayPoints
     * @returns path value string "M..,..L..,..."
     */
    const generatePathdata = (listOfwayPoints) => {
        if (listOfwayPoints[0] && listOfwayPoints[1]) {
            let pathData = `M${listOfwayPoints[0].x},${listOfwayPoints[0].y}`;
            let curveradius = 10;
            let prevWayPoint;
            let nextWayPoint;
            for (let i = 1; i < listOfwayPoints.length - 1; i++) {
                prevWayPoint = Object.assign({}, listOfwayPoints[i - 1]);
                nextWayPoint = Object.assign({}, listOfwayPoints[i + 1]);
                // 1st case
                if (prevWayPoint.x < listOfwayPoints[i].x) {
                    pathData += `L${listOfwayPoints[i].x - curveradius},${listOfwayPoints[i].y}`;
                    if (nextWayPoint.y < listOfwayPoints[i].y) {
                        pathData += `A${curveradius},${curveradius},0,0,0,${listOfwayPoints[i].x},${listOfwayPoints[i].y - curveradius}`;
                    }
                    if (nextWayPoint.y > listOfwayPoints[i].y) {
                        pathData += `A${curveradius},${curveradius},0,0,1,${listOfwayPoints[i].x},${listOfwayPoints[i].y + curveradius}`;
                    }
                }
                // 2nd case
                if (prevWayPoint.x > listOfwayPoints[i].x) {
                    pathData += `L${listOfwayPoints[i].x + curveradius},${listOfwayPoints[i].y}`;
                    if (nextWayPoint.y < listOfwayPoints[i].y) {
                        pathData += `A${curveradius},${curveradius},0,0,1,${listOfwayPoints[i].x},${listOfwayPoints[i].y - curveradius}`;
                    }
                    if (nextWayPoint.y > listOfwayPoints[i].y) {
                        pathData += `A${curveradius},${curveradius},0,0,0,${listOfwayPoints[i].x},${listOfwayPoints[i].y + curveradius}`;
                    }
                }
                // 3rd case
                if (prevWayPoint.y < listOfwayPoints[i].y) {
                    pathData += `L${listOfwayPoints[i].x},${listOfwayPoints[i].y - curveradius}`;
                    if (nextWayPoint.x < listOfwayPoints[i].x) {
                        pathData += `A${curveradius},${curveradius},0,0,1,${listOfwayPoints[i].x - curveradius},${listOfwayPoints[i].y}`;
                    }
                    if (nextWayPoint.x > listOfwayPoints[i].x) {
                        pathData += `A${curveradius},${curveradius},0,0,0,${listOfwayPoints[i].x + curveradius},${listOfwayPoints[i].y}`;
                    }
                }
                // 4th case
                if (prevWayPoint.y > listOfwayPoints[i].y) {
                    pathData += `L${listOfwayPoints[i].x},${listOfwayPoints[i].y + curveradius}`;
                    if (nextWayPoint.x < listOfwayPoints[i].x) {
                        pathData += `A${curveradius},${curveradius},0,0,0,${listOfwayPoints[i].x - curveradius},${listOfwayPoints[i].y}`;
                    }
                    if (nextWayPoint.x > listOfwayPoints[i].x) {
                        pathData += `A${curveradius},${curveradius},0,0,1,${listOfwayPoints[i].x + curveradius},${listOfwayPoints[i].y}`;
                    }
                }
            }
            pathData += `L${listOfwayPoints[listOfwayPoints.length - 1].x},${listOfwayPoints[listOfwayPoints.length - 1].y}`;
            return pathData;
        }
        else {
            return "";
        }
    };
    exports.generatePathdata = generatePathdata;
    /**
     * method to compuet the midPoint of a path
     * @param listOfwayPoints
     * @returns
     */
    const getMidPathPoint = (listOfwayPoints) => {
        let midPoint = { x: 0, y: 0 };
        let maxSegmentDistance = 0;
        listOfwayPoints.forEach((wayPt, index) => {
            if (index !== listOfwayPoints.length - 1) {
                let nextWayPt = listOfwayPoints[index + 1];
                let currentDistance = (0, GeometricalComputation_1.computeEuclidianDistance)(wayPt, nextWayPt);
                if (currentDistance > maxSegmentDistance) {
                    midPoint = { x: (wayPt.x + nextWayPt.x) / 2, y: (wayPt.y + nextWayPt.y) / 2 };
                    maxSegmentDistance = currentDistance;
                }
            }
        });
        return midPoint;
    };
    exports.getMidPathPoint = getMidPathPoint;
    // /**
    //  * Function to define midWayPoints between two points (following manahattan edge-routing)
    //  * @param startWayPt 
    //  * @param endWayPy 
    //  * @param sourceSide 
    //  * @param targetSide 
    //  */
    // export const midWayPointsDefinition = (startWayPt:position, endWayPt:position, sourceSide: string, targetSide: string): Array<position> => {
    //     console.log(startWayPt,endWayPt,sourceSide,targetSide);
    //     let listOfmidWayPts: Array<{ "x": number, "y": number }> = [];
    //     const attachementSidesOffset: Map<string, { "xoffset": number, "yoffset": number }> = new Map([
    //         ["North", { "xoffset": 0, "yoffset": - gridStep }],
    //         ["West", { "xoffset": - gridStep, "yoffset": 0 }],
    //         ["South", { "xoffset": 0, "yoffset": gridStep }],
    //         ["East", { "xoffset": gridStep, "yoffset": 0 }]
    //     ]);
    //     // vector, firstPt, secondPt, length, direction
    //     let startOffset = attachementSidesOffset.get(sourceSide);
    //     let xstartOffset = typeof startOffset?.xoffset !== "undefined" ? startOffset.xoffset : 0;
    //     let ystartOffset = typeof startOffset?.yoffset !== "undefined" ? startOffset.yoffset : 0;
    //     let endOffset = attachementSidesOffset.get(targetSide);
    //     let xendOffset = typeof endOffset?.xoffset !== "undefined" ? endOffset.xoffset : 0;
    //     let yendOffset = typeof endOffset?.yoffset !== "undefined" ? endOffset.yoffset : 0;
    //     let startVector: vectorObject = {
    //         "startPt": startWayPt,
    //         "endPt": { "x": startWayPt.x + xstartOffset, "y": startWayPt.y + ystartOffset },
    //         "length": gridStep,
    //         "direction": sourceSide
    //     };
    //     let endVector: vectorObject = {
    //         "startPt": { "x": endWayPt.x + xendOffset, "y": endWayPt.y + yendOffset },
    //         "endPt": endWayPt,
    //         "length": gridStep,
    //         "direction": targetSide
    //     };
    //     // parallel vectors
    //     if (startVector.direction === endVector.direction || startVector.direction == getOppositeSide((endVector.direction) as attachmentSideType)) {
    //         // aligned vectors
    //         if (startVector.startPt.y === endVector.startPt.y) listOfmidWayPts = [startVector.endPt, { ...startVector.endPt, "y": startVector.endPt.y + gridStep }, { ...endVector.startPt, "y": endVector.startPt.y + gridStep }, endVector.startPt];
    //         if (startVector.startPt.x === endVector.startPt.x) listOfmidWayPts = [startVector.endPt, { ...startVector.endPt, "x": startVector.endPt.x - gridStep }, { ...endVector.startPt, "x": endVector.startPt.x - gridStep }, endVector.startPt];
    //         // non-aligned vectors
    //         if (startVector.direction === endVector.direction) {
    //             if (endVector.direction == "West") listOfmidWayPts = [{ ...startVector.endPt, "x": Math.min(startVector.endPt.x, endVector.startPt.x) }, { ...endVector.startPt, "x": Math.min(startVector.endPt.x, endVector.startPt.x) }];
    //             else if (endVector.direction == "East") listOfmidWayPts = [{ ...startVector.endPt, "x": Math.max(startVector.endPt.x, endVector.startPt.x) }, { ...endVector.startPt, "x": Math.max(startVector.endPt.x, endVector.startPt.x) }];
    //             else if (endVector.direction == "North") listOfmidWayPts = [{ ...startVector.endPt, "y": Math.min(startVector.endPt.y, endVector.startPt.y) }, { ...endVector.startPt, "y": Math.min(startVector.endPt.y, endVector.startPt.y) }];
    //             else if (endVector.direction == "South") listOfmidWayPts = [{ ...startVector.endPt, "y": Math.max(startVector.endPt.y, endVector.startPt.y) }, { ...endVector.startPt, "y": Math.max(startVector.endPt.y, endVector.startPt.y) }]
    //         } else {
    //             if (["West", "East"].includes(endVector.direction)) listOfmidWayPts = [{ ...startVector.endPt, "x": convertToGridCoord((startVector.endPt.x + endVector.startPt.x) / 2) }, { ...endVector.startPt, "x": convertToGridCoord((startVector.endPt.x + endVector.startPt.x) / 2) }];
    //             else if (["North", "South"].includes(endVector.direction)) listOfmidWayPts = [{ ...startVector.endPt, "y": convertToGridCoord((startVector.endPt.y + endVector.startPt.y) / 2) }, { ...endVector.startPt, "y": convertToGridCoord((startVector.endPt.y + endVector.startPt.y) / 2) }];
    //         }
    //     } else {
    //         // orthogonal vectors (same direction: North <> West)
    //         if (["West", "East"].includes(endVector.direction)) {
    //             if (!checkPointInSegmentHorizontally(endVector.startPt, [endVector.endPt, startVector.endPt])) listOfmidWayPts = [startVector.endPt, { "x": startVector.endPt.x, "y": endVector.startPt.y }, endVector.startPt];
    //             else listOfmidWayPts = [startVector.endPt, { "x": endVector.startPt.x, "y": startVector.endPt.y }, endVector.startPt];
    //         }
    //         else {
    //             if (!checkPointInSegmentVertically(endVector.startPt, [endVector.endPt, startVector.endPt])) listOfmidWayPts = [startVector.endPt, { "x": endVector.startPt.x, "y": startVector.endPt.y }, endVector.startPt];
    //             else listOfmidWayPts = [startVector.endPt, { "x": endVector.startPt.x, "y": startVector.endPt.y }, endVector.startPt];
    //         }
    //     }
    //     return listOfmidWayPts;
    // }
    const updateLinkPath = (link, sourceNode, targetNode, sourceNodeNotMoved, targetNodeNodeMoved, delta) => {
        if (delta.x === 0 && delta.y === 0)
            return;
        targetNode.updateAnchors(); // optimize this 
        sourceNode.updateAnchors(); // optimize this 
        // first case
        if (sourceNodeNotMoved && targetNodeNodeMoved) {
            link.wayPoints.map((wayPoint) => {
                wayPoint.x += delta.x;
                wayPoint.y += delta.y;
            });
            return;
        }
        // second case
        if (sourceNodeNotMoved && !targetNodeNodeMoved) {
            if (targetNode) {
                const movedWayPt = 0;
                const nextWayPt = 1;
                const origina = sourceNode.anchors[link.sourceSide];
                const originb = targetNode.anchors[link.targetSide];
                let removeflag = true;
                // first setp
                if (link.wayPoints[movedWayPt]) {
                    link.wayPoints[movedWayPt].x += delta.x;
                    link.wayPoints[movedWayPt].y += delta.y;
                }
                // second step
                if (["North", "South"].includes(link.sourceSide)) {
                    link.wayPoints[nextWayPt].x = link.wayPoints[movedWayPt].x;
                    if (link.sourceSide == "North") {
                        if (origina.y <= (originb.y + 2 * StaticAttributes_1.gridStep)) {
                            link.wayPoints[nextWayPt].y = sourceNode.anchors[link.sourceSide].y - 2 * StaticAttributes_1.gridStep;
                            removeflag = false; // flag to keep the wayPts
                        }
                    }
                    if (link.sourceSide == "South") {
                        if (origina.y >= (originb.y - 2 * StaticAttributes_1.gridStep)) {
                            link.wayPoints[nextWayPt].y = sourceNode.anchors[link.sourceSide].y + 2 * StaticAttributes_1.gridStep;
                            removeflag = false; // flag to keep the wayPts
                        }
                    }
                    if (link.wayPoints.length > 2)
                        link.wayPoints[nextWayPt + 1].y = link.wayPoints[nextWayPt].y;
                }
                else if (["West", "East"].includes(link.sourceSide)) {
                    link.wayPoints[nextWayPt].y = link.wayPoints[movedWayPt].y;
                    if (link.sourceSide == "East") {
                        if (origina.x >= (originb.x - 2 * StaticAttributes_1.gridStep)) {
                            link.wayPoints[nextWayPt].x = sourceNode.anchors[link.sourceSide].x + 2 * StaticAttributes_1.gridStep;
                            removeflag = false; //flag to keep the wayPts
                        }
                    }
                    if (link.sourceSide == "West") {
                        if (origina.x <= (originb.x + 2 * StaticAttributes_1.gridStep)) {
                            link.wayPoints[nextWayPt].x = sourceNode.anchors[link.sourceSide].x - 2 * StaticAttributes_1.gridStep;
                            removeflag = false; // flag to keep the wayPts
                        }
                    }
                    if (link.wayPoints.length > 2)
                        link.wayPoints[nextWayPt + 1].x = link.wayPoints[nextWayPt].x;
                }
                // third step
                if (link.wayPoints[link.wayPoints.length - 1].x === link.wayPoints[link.wayPoints.length - 2].x) {
                    (0, exports.moveEndSegmentAlongXaxis)(link.wayPoints.length - 1, [link.wayPoints.length - 1, link.wayPoints.length - 2], link, targetNode, "targetSide");
                    if (link.wayPoints.length === 2 && link.wayPoints[0].y < link.wayPoints[1].y && link.sourceSide === "North" && link.targetSide === "South") {
                        link.sourceSide = "South";
                        link.wayPoints[0].y = sourceNode.anchors["South"].y;
                        link.targetSide = "North";
                        link.wayPoints[1].y = targetNode.anchors["North"].y;
                    }
                    if (link.wayPoints.length === 2 && link.wayPoints[0].y > link.wayPoints[1].y && link.sourceSide === "South" && link.targetSide === "North") {
                        link.sourceSide = "North";
                        link.wayPoints[0].y = sourceNode.anchors["North"].y;
                        link.targetSide = "South";
                        link.wayPoints[1].y = targetNode.anchors["South"].y;
                    }
                    if (link.wayPoints.length === 2 && link.wayPoints[0].x !== link.wayPoints[1].x) {
                        if (link.wayPoints[0].x < targetNode.anchors["East"].x && link.wayPoints[0].x > targetNode.anchors["West"].x)
                            link.wayPoints[1].x = link.wayPoints[0].x;
                        else if (link.wayPoints[1].x < sourceNode.anchors["East"].x && link.wayPoints[1].x > sourceNode.anchors["West"].x)
                            link.wayPoints[0].x = link.wayPoints[1].x;
                        else {
                            link.updateWayPoint();
                        }
                    }
                }
                else if (link.wayPoints[link.wayPoints.length - 1].y === link.wayPoints[link.wayPoints.length - 2].y) {
                    (0, exports.moveEndSegmentAlongYaxis)(link.wayPoints.length - 1, [link.wayPoints.length - 1, link.wayPoints.length - 2], link, targetNode, "targetSide");
                    if (link.wayPoints.length === 2 && link.wayPoints[0].x < link.wayPoints[1].x && link.sourceSide === "West" && link.targetSide === "East") {
                        link.sourceSide = "East";
                        link.wayPoints[0].x = sourceNode.anchors["East"].x;
                        link.targetSide = "West";
                        link.wayPoints[1].x = targetNode.anchors["West"].x;
                    }
                    if (link.wayPoints.length === 2 && link.wayPoints[0].x > link.wayPoints[1].x && link.sourceSide === "East" && link.targetSide === "West") {
                        link.sourceSide = "West";
                        link.wayPoints[0].x = sourceNode.anchors["West"].x;
                        link.targetSide = "East";
                        link.wayPoints[1].x = targetNode.anchors["East"].x;
                    }
                    if (link.wayPoints.length === 2 && link.wayPoints[0].y !== link.wayPoints[1].y) {
                        if (link.wayPoints[0].y < targetNode.anchors["South"].y && link.wayPoints[0].y > targetNode.anchors["North"].y)
                            link.wayPoints[1].y = link.wayPoints[0].y;
                        else if (link.wayPoints[1].y < sourceNode.anchors["South"].y && link.wayPoints[1].y > sourceNode.anchors["North"].y)
                            link.wayPoints[0].y = link.wayPoints[1].y;
                        else {
                            link.updateWayPoint(); // we can do better
                        }
                    }
                }
                if (removeflag) {
                    link.removeDupWayPoints();
                }
                link.simplfyPath();
            }
            return;
        }
        // third case
        if (targetNodeNodeMoved && !sourceNodeNotMoved) {
            if (sourceNode) {
                const movedWayPt = link.wayPoints.length - 1;
                const nextWayPt = link.wayPoints.length - 2;
                const origina = targetNode.anchors[link.targetSide];
                const originb = sourceNode.anchors[link.sourceSide];
                let removeflag = true;
                //  first step
                link.wayPoints[movedWayPt].x += delta.x;
                link.wayPoints[movedWayPt].y += delta.y;
                // second step
                if (["North", "South"].includes(link.targetSide)) {
                    link.wayPoints[nextWayPt].x = link.wayPoints[movedWayPt].x;
                    if (link.targetSide == "North") {
                        if (origina.y <= (originb.y + 2 * StaticAttributes_1.gridStep)) {
                            link.wayPoints[nextWayPt].y = targetNode.anchors[link.targetSide].y - 2 * StaticAttributes_1.gridStep;
                            removeflag = false;
                        }
                    }
                    if (link.targetSide == "South") {
                        if (origina.y >= (originb.y - 2 * StaticAttributes_1.gridStep)) {
                            link.wayPoints[nextWayPt].y = targetNode.anchors[link.targetSide].y + 2 * StaticAttributes_1.gridStep;
                            removeflag = false;
                        }
                    }
                    if (link.wayPoints.length > 2)
                        link.wayPoints[nextWayPt - 1].y = link.wayPoints[nextWayPt].y;
                }
                else {
                    link.wayPoints[nextWayPt].y = link.wayPoints[movedWayPt].y;
                    if (link.targetSide == "East") {
                        if (origina.x >= (originb.x - 2 * StaticAttributes_1.gridStep)) {
                            link.wayPoints[nextWayPt].x = targetNode.anchors[link.targetSide].x + 2 * StaticAttributes_1.gridStep;
                            removeflag = false;
                        }
                    }
                    if (link.targetSide == "West") {
                        if (origina.x <= (originb.x + 2 * StaticAttributes_1.gridStep)) {
                            link.wayPoints[nextWayPt].x = targetNode.anchors[link.targetSide].x - 2 * StaticAttributes_1.gridStep;
                            removeflag = false;
                        }
                    }
                    if (link.wayPoints.length > 2)
                        link.wayPoints[nextWayPt - 1].x = link.wayPoints[nextWayPt].x;
                }
                //  third step
                if (link.wayPoints[0].x === link.wayPoints[1].x) {
                    (0, exports.moveEndSegmentAlongXaxis)(0, [0, 1], link, sourceNode, "sourceSide");
                    if (link.wayPoints.length === 2 && link.wayPoints[0].y < link.wayPoints[1].y && link.sourceSide === "North" && link.targetSide === "South") {
                        link.sourceSide = "South";
                        link.wayPoints[0].y = sourceNode.anchors["South"].y;
                        link.targetSide = "North";
                        link.wayPoints[1].y = targetNode.anchors["North"].y;
                    }
                    if (link.wayPoints.length === 2 && link.wayPoints[0].y > link.wayPoints[1].y && link.sourceSide === "South" && link.targetSide === "North") {
                        link.sourceSide = "North";
                        link.wayPoints[0].y = sourceNode.anchors["North"].y;
                        link.targetSide = "South";
                        link.wayPoints[1].y = targetNode.anchors["South"].y;
                    }
                    if (link.wayPoints.length === 2 && link.wayPoints[0].x !== link.wayPoints[1].x) {
                        if (link.wayPoints[0].x < targetNode.anchors["East"].x && link.wayPoints[0].x > targetNode.anchors["West"].x)
                            link.wayPoints[1].x = link.wayPoints[0].x;
                        else if (link.wayPoints[1].x < sourceNode.anchors["East"].x && link.wayPoints[1].x > sourceNode.anchors["West"].x)
                            link.wayPoints[0].x = link.wayPoints[1].x;
                        else {
                            // if ((sourceNode.anchors["East"].x) === link.wayPoints[1].x && ["North","South"].includes(link.sourceSide)) link.wayPoints[0].x += 2*gridStep;
                            // if ((sourceNode.anchors["West"].x) === link.wayPoints[1].x  && ["North","South"].includes(link.sourceSide)) link.wayPoints[0].x -= 2*gridStep;
                            link.updateWayPoint();
                        }
                    }
                }
                else {
                    (0, exports.moveEndSegmentAlongYaxis)(0, [0, 1], link, sourceNode, "sourceSide");
                    if (link.wayPoints.length === 2 && link.wayPoints[0].x < link.wayPoints[1].x && link.sourceSide === "West" && link.targetSide === "East") {
                        link.sourceSide = "East";
                        link.wayPoints[0].x = sourceNode.anchors["East"].x;
                        link.targetSide = "West";
                        link.wayPoints[1].x = targetNode.anchors["West"].x;
                    }
                    if (link.wayPoints.length === 2 && link.wayPoints[0].x > link.wayPoints[1].x && link.sourceSide === "East" && link.targetSide === "West") {
                        link.sourceSide = "West";
                        link.wayPoints[0].x = sourceNode.anchors["West"].x;
                        link.targetSide = "East";
                        link.wayPoints[1].x = targetNode.anchors["East"].x;
                    }
                    if (link.wayPoints.length === 2 && link.wayPoints[0].y !== link.wayPoints[1].y) {
                        if (link.wayPoints[0].y < targetNode.anchors["South"].y && link.wayPoints[0].y > targetNode.anchors["North"].y)
                            link.wayPoints[1].y = link.wayPoints[0].y;
                        else if (link.wayPoints[1].y < sourceNode.anchors["South"].y && link.wayPoints[1].y > sourceNode.anchors["North"].y)
                            link.wayPoints[0].y = link.wayPoints[1].y;
                        else {
                            // if ((sourceNode.anchors["North"].y) === link.wayPoints[1].y) link.wayPoints[0].y += gridStep;
                            // if ((sourceNode.anchors["South"].y) === link.wayPoints[1].y) link.wayPoints[0].y -= gridStep;
                            link.updateWayPoint();
                        }
                    }
                }
                if (removeflag) {
                    link.removeDupWayPoints();
                }
                link.simplfyPath();
            }
            return;
        }
    };
    exports.updateLinkPath = updateLinkPath;
});
