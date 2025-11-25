/// <amd-module name="DS/DELGraphEditor/utils/GeometricalComputation"/>
define("DS/DELGraphEditor/utils/GeometricalComputation", ["require", "exports", "DS/DELGraphModel/model/Node", "DS/DELGraphModel/model/Link", "DS/DELGraphEditor/utils/StaticAttributes"], function (require, exports, Node_1, Link_1, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findLinkEntryAndExitSide = exports.findDropArea = exports.computeEuclidianDistance = exports.checkPointInSegmentVertically = exports.checkPointInSegmentHorizontally = exports.checkDimensionParity = exports.defineDeltaCoordinatesFromKey = exports.normalizeBoudingBox = exports.normalizePosition = exports.convertToRelativeCoord = exports.convertToGridCoord = exports.checkRectangleInclusiveIntersection = exports.checkRectangleExeclusiveIntersection = exports.checkRectangleIntersection = exports.computeBoundingBoxBetweenTwoPoints = exports.computeBoundingBoxOfLink = exports.computeBoundingBoxOfNode = exports.computeBoundingBoxOfElt = exports.computeBoundingBoxOfSelection = exports.defineMvtDirection = void 0;
    /**
     * Function to define the movement direction (horizontal/vertical) from the previous position  and the next position
     * @param prevPointerPos
     * @param nextPointerPos
     * @returns
     */
    const defineMvtDirection = (prevPointerPos, nextPointerPos) => {
        const deltaX = Math.abs(prevPointerPos.x - nextPointerPos.x);
        const deltaY = Math.abs(prevPointerPos.y - nextPointerPos.y);
        if (Math.min(deltaX, deltaY) === deltaX)
            return "yaxis";
        if (Math.min(deltaX, deltaY) === deltaY)
            return "xaxis";
        return "xyaxis";
    };
    exports.defineMvtDirection = defineMvtDirection;
    /**
     * Function to compute the boundingBox of a selection of graph elements
     * @param currentListOfShapes
     * @param offsetx
     * @param offsety
     * @returns
     */
    const computeBoundingBoxOfSelection = (currentListOfShapes, offsetx = 0, offsety = 0) => {
        let minleft = Number.MAX_VALUE;
        let minTop = Number.MAX_VALUE;
        let maxBottom = -Number.MAX_VALUE;
        let maxRight = -Number.MAX_VALUE;
        currentListOfShapes.forEach((graphElt) => {
            if (graphElt instanceof Node_1.Node) {
                minleft = Math.min(minleft, graphElt.position.x);
                minTop = Math.min(minTop, graphElt.position.y);
                maxRight = Math.max(maxRight, graphElt.position.x + graphElt.width);
                maxBottom = Math.max(maxBottom, graphElt.position.y + graphElt.height);
            }
            if (graphElt instanceof Link_1.Link) {
                let dimensionArray = (0, exports.computeBoundingBoxOfLink)(graphElt);
                minleft = Math.min(minleft, dimensionArray.x); // if ,graphElt.position.x!==0
                minTop = Math.min(minTop, dimensionArray.y); //if ,graphElt.position.y!==0
                maxRight = Math.max(maxRight, dimensionArray.w + dimensionArray.x); // graphElt.position.x+graphElt.width
                maxBottom = Math.max(maxBottom, dimensionArray.h + dimensionArray.y); // ,graphElt.position.y+graphElt.height
            }
        });
        minleft -= offsetx;
        minTop -= offsety;
        maxRight += offsetx;
        maxBottom += offsety;
        return { x: minleft, y: minTop, w: maxRight - minleft, h: maxBottom - minTop };
    };
    exports.computeBoundingBoxOfSelection = computeBoundingBoxOfSelection;
    /**
     * Function to compute the bounding box of a graph element
     * @param elt
     * @returns
     */
    const computeBoundingBoxOfElt = (elt) => {
        if (elt instanceof Node_1.Node)
            return (0, exports.computeBoundingBoxOfNode)(elt);
        else if (elt instanceof Link_1.Link)
            return (0, exports.computeBoundingBoxOfLink)(elt);
        else
            return { x: 0, y: 0, w: 0, h: 0 };
    };
    exports.computeBoundingBoxOfElt = computeBoundingBoxOfElt;
    /**
     * Function to compute the bounding box of node
     * @param node
     * @returns {boundingBoxType}
     */
    const computeBoundingBoxOfNode = (node) => {
        if (typeof node === "undefined")
            return { x: 0, y: 0, w: 0, h: 0 };
        else
            return { x: node.position.x, y: node.position.y, w: node.width, h: node.height };
    };
    exports.computeBoundingBoxOfNode = computeBoundingBoxOfNode;
    /**
     * Function to compute the bounding box of link
     * @param link
     * @returns
     */
    const computeBoundingBoxOfLink = (link) => {
        let listOfwayPoints_x = link.wayPoints.map((point) => point.x);
        let listOfwayPoints_y = link.wayPoints.map((point) => point.y);
        let left = Math.min(...listOfwayPoints_x); // min
        let top = Math.min(...listOfwayPoints_y);
        let right = Math.max(...listOfwayPoints_x); // max
        let bottom = Math.max(...listOfwayPoints_y);
        return { x: left, y: top, w: right - left, h: bottom - top };
    };
    exports.computeBoundingBoxOfLink = computeBoundingBoxOfLink;
    /**
     * Function to compute the bounsing box between two points
     * @param {position} startPos  the first point
     * @param {position} endPos the second point
     * @returns
     */
    const computeBoundingBoxBetweenTwoPoints = (startPos, endPos) => {
        const left = Math.min(startPos.x, endPos.x);
        const top = Math.min(startPos.y, endPos.y);
        const right = Math.max(startPos.x, endPos.x);
        const bottom = Math.max(startPos.y, endPos.y);
        return { x: left, y: top, w: right - left, h: bottom - top };
    };
    exports.computeBoundingBoxBetweenTwoPoints = computeBoundingBoxBetweenTwoPoints;
    /**
     * Function to check intersection between two rectangles
     * @param firstRectdimensions
     * @param secondRectdimensions
     * @returns
     */
    const checkRectangleIntersection = (firstRectdimensions, secondRectdimensions) => {
        let [x1, y1, w1, h1] = [firstRectdimensions.x, firstRectdimensions.y, firstRectdimensions.w, firstRectdimensions.h];
        let [x2, y2, w2, h2] = [secondRectdimensions.x, secondRectdimensions.y, secondRectdimensions.w, secondRectdimensions.h];
        return !((x1 + w1 < x2 || (y1 > y2 + h2 || y1 + h1 < y2)) || (x2 + w2 < x1 || (y2 > y1 + h1 || y2 + h2 < y1)) || (y1 + h1 < y2 || (x2 > x1 + w1 || x2 + w2 < x1)) || (y2 + h2 < y1 || (x1 > x2 + w2 || x1 + w1 < x2)));
    };
    exports.checkRectangleIntersection = checkRectangleIntersection;
    /**
     * Function to check excelusive intersection between two rectangles (one shouldn't be fully included in the second)
     * @param firstRectdimensions
     * @param secondRectdimensions
     * @returns
     */
    const checkRectangleExeclusiveIntersection = (firstRectdimensions, secondRectdimensions) => {
        let [x1, y1, w1, h1] = [firstRectdimensions.x, firstRectdimensions.y, firstRectdimensions.w, firstRectdimensions.h];
        let [x2, y2, w2, h2] = [secondRectdimensions.x, secondRectdimensions.y, secondRectdimensions.w, secondRectdimensions.h];
        return !((x1 + w1 < x2 || (y1 > y2 + h2 || y1 + h1 < y2)) || (x2 + w2 < x1 || (y2 > y1 + h1 || y2 + h2 < y1)) || (y1 + h1 < y2 || (x2 > x1 + w1 || x2 + w2 < x1)) || (y2 + h2 < y1 || (x1 > x2 + w2 || x1 + w1 < x2))) && !(x1 <= x2 && w1 + x1 >= x2 + w2 && y1 <= y2 && y1 + h1 >= y2 + h2);
    };
    exports.checkRectangleExeclusiveIntersection = checkRectangleExeclusiveIntersection;
    /**
     * Function to check inclusive intersection between two rectangles (we can have one rectangle fully included in the second)
     * @param firstRectdimensions
     * @param secondRectdimensions
     * @returns
     */
    const checkRectangleInclusiveIntersection = (firstRectdimensions, secondRectdimensions) => {
        let [x1, y1, w1, h1] = [firstRectdimensions.x, firstRectdimensions.y, firstRectdimensions.w, firstRectdimensions.h];
        let [x2, y2, w2, h2] = [secondRectdimensions.x, secondRectdimensions.y, secondRectdimensions.w, secondRectdimensions.h];
        return (x1 >= x2 && y1 >= y2 && (x1 + w1) <= (x2 + w2) && (y1 + h1) <= (y2 + h2)) ? true : false;
    };
    exports.checkRectangleInclusiveIntersection = checkRectangleInclusiveIntersection;
    /**
     * Function to convert a coordinate/dimension (x,y, width, height, ..) to grid coordinates
     * @param {number} coord
     * @returns
     */
    const convertToGridCoord = (coord) => {
        return Math.round(coord / StaticAttributes_1.gridStep) * StaticAttributes_1.gridStep;
    };
    exports.convertToGridCoord = convertToGridCoord;
    /**
     * Function to convert a coordinate (x,y) to screen relative coordinate (usefult to handle the zoom action)
     * @param {number} coord
     * @param {number} offset the screen offset
     * @returns
     */
    const convertToRelativeCoord = (coord, offset) => {
        return coord - offset;
    };
    exports.convertToRelativeCoord = convertToRelativeCoord;
    /**
     * Function to normalize a position
     * @param {number} coord
     * @param {number} offset the screen offset
     * @returns
     */
    const normalizePosition = (pointerCoord, transformVector, offset) => {
        return { x: (pointerCoord.x - transformVector[0] - offset[0]) / transformVector[2], y: (pointerCoord.y - transformVector[1] - offset[1]) / transformVector[2] };
    };
    exports.normalizePosition = normalizePosition;
    /**
     * Function to normalize a bounding box
     * @param bd
     * @param transformVector
     * @returns normalized bounding box
     */
    const normalizeBoudingBox = (bd, transformVector) => {
        const topLeftCorner = (0, exports.normalizePosition)({ x: bd.x, y: bd.y }, transformVector, [bd.x, bd.y]);
        const topRightCorner = (0, exports.normalizePosition)({ x: bd.x + bd.w, y: bd.y }, transformVector, [bd.x, bd.y]);
        const bottomLeftCorner = (0, exports.normalizePosition)({ x: bd.x, y: bd.y + bd.h }, transformVector, [bd.x, bd.y]);
        return { x: topLeftCorner.x, y: topLeftCorner.y, w: topRightCorner.x - topLeftCorner.x, h: bottomLeftCorner.y - topLeftCorner.y };
    };
    exports.normalizeBoudingBox = normalizeBoudingBox;
    /**
     * Function to return the grid step corresponding to a movement using an arrow key
     * @param {string} key arraow key
     * @returns [deltax,deltay]
     */
    const defineDeltaCoordinatesFromKey = (key) => {
        if (key === "ArrowLeft")
            return [-StaticAttributes_1.gridStep, 0];
        if (key === "ArrowUp")
            return [0, -StaticAttributes_1.gridStep];
        if (key === "ArrowRight")
            return [StaticAttributes_1.gridStep, 0];
        if (key === "ArrowDown")
            return [0, StaticAttributes_1.gridStep];
        else
            return [0, 0];
    };
    exports.defineDeltaCoordinatesFromKey = defineDeltaCoordinatesFromKey;
    /**
     * Function to check the parity of a dimension (width,height)
     * @param dimension
     * @returns
     */
    const checkDimensionParity = (dimension) => {
        return (dimension / StaticAttributes_1.gridStep % 2) === 0;
    };
    exports.checkDimensionParity = checkDimensionParity;
    /**
     * Function to check if a x coordinate point belongs to horizontal segment
     * @param point
     * @param segment
     * @returns
     */
    const checkPointInSegmentHorizontally = (point, segment) => {
        return ((segment[0].x - point.x) * (segment[1].x - point.x) < 0);
    };
    exports.checkPointInSegmentHorizontally = checkPointInSegmentHorizontally;
    /**
     * Function to check if a y coordinate point belongs to vertical segment
     * @param point
     * @param segment
     * @returns
     */
    const checkPointInSegmentVertically = (point, segment) => {
        return ((segment[0].y - point.y) * (segment[1].y - point.y) < 0);
    };
    exports.checkPointInSegmentVertically = checkPointInSegmentVertically;
    /**
     * Function to compute the euclidian distance between two points
     * @param startPt
     * @param endPt
     * @returns
     */
    const computeEuclidianDistance = (startPt, endPt) => {
        let diffx = endPt.x - startPt.x;
        let diffy = endPt.y - startPt.y;
        return Math.sqrt(Math.pow(diffx, 2) + Math.pow(diffy, 2));
    };
    exports.computeEuclidianDistance = computeEuclidianDistance;
    /**
     * Find the segment index that conatins a node dropping area
     * @param droppedNode
     * @param wayPoints
     * @param dropPos
     * @returns
     */
    const findDropArea = (droppedNode, wayPoints, dropPos) => {
        const [nodeWidth, nodeHeight] = [droppedNode.width, droppedNode.height];
        const xdistanceLimit = nodeWidth / 2;
        const ydistanceLimit = nodeHeight / 2;
        let dropAreaIndex = -1;
        wayPoints.forEach((pt, index) => {
            if (index !== wayPoints.length - 1) {
                if (pt.x === wayPoints[index + 1].x && Math.abs(dropPos.x - pt.x) < xdistanceLimit && (pt.y - dropPos.y) * (wayPoints[index + 1].y - dropPos.y) < 0)
                    dropAreaIndex = index;
                if (pt.y === wayPoints[index + 1].y && Math.abs(dropPos.y - pt.y) < ydistanceLimit && (pt.x - dropPos.x) * (wayPoints[index + 1].x - dropPos.x) < 0)
                    dropAreaIndex = index;
            }
        });
        return dropAreaIndex;
    };
    exports.findDropArea = findDropArea;
    /**
     * Function to find the entry and the exit side for a link with respect to a node (link>Entry:West>node>Exit:East>link)
     * @param firstWayPt
     * @param endWatPt
     * @returns
     */
    const findLinkEntryAndExitSide = (firstWayPt, endWatPt) => {
        if (firstWayPt.x === endWatPt.x && firstWayPt.y < endWatPt.y)
            return ["North", "South"];
        if (firstWayPt.x === endWatPt.x && firstWayPt.y > endWatPt.y)
            return ["South", "North"];
        if (firstWayPt.y === endWatPt.y && firstWayPt.x < endWatPt.x)
            return ["West", "East"];
        if (firstWayPt.y === endWatPt.y && firstWayPt.x > endWatPt.x)
            return ["East", "West"];
        return ["Center", "Center"];
    };
    exports.findLinkEntryAndExitSide = findLinkEntryAndExitSide;
});
// export const computeShapeEdges = (boundingBox: { x: number, y: number, w: number, h: number }): [position, position, position, position] => {
//     return [
//         { x: boundingBox.x, y: boundingBox.y },
//         { x: boundingBox.x + boundingBox.w, y: boundingBox.y },
//         { x: boundingBox.x, y: boundingBox.y + boundingBox.h },
//         { x: boundingBox.x + boundingBox.w, y: boundingBox.y + boundingBox.h },
//     ]
// }
// export const checkPointIsEqualToEdge = (point: position, boundingBox: { x: number, y: number, w: number, h: number }): boolean => {
//     const graphEltsEdges = computeShapeEdges(boundingBox);
//     return graphEltsEdges.some((value: position) => {
//         return value.x === point.x && value.y === point.y
//     });
// }
// export const computeBoundingBoxOfWayOts = (listOfwayPoints: position[]): boundingBoxType => {
//     let listOfwayPoints_x: number[] = listOfwayPoints.map((point: position) => point.x);
//     let listOfwayPoints_y: number[] = listOfwayPoints.map((point: position) => point.y);
//     let left = Math.min(...listOfwayPoints_x); // min
//     let top = Math.min(...listOfwayPoints_y);
//     let right = Math.max(...listOfwayPoints_x); // max
//     let bottom = Math.max(...listOfwayPoints_y);
//     return { x: left, y: top, w: right, h: bottom };
// }
// export const sortListOfGraphObjectsWithinXAxis = (graphObjectsCopy: GraphElt[]) => {
//     graphObjectsCopy.sort((graphObject: GraphElt, nextGraphObject: GraphElt) => {
//         const boundingBoxCurrentElt = (graphObject instanceof Link) ? computeBoundingBoxOfLink(graphObject) : { x: graphObject.position.x, y: graphObject.position.y, w: graphObject.position.x + graphObject.width, h: graphObject.position.y + graphObject.height };
//         const boundingBoxNextElt = (nextGraphObject instanceof Link) ? computeBoundingBoxOfLink(nextGraphObject) : { x: nextGraphObject.position.x, y: nextGraphObject.position.y, w: nextGraphObject.position.x + nextGraphObject.width, h: nextGraphObject.position.y + nextGraphObject.height };
//         return (boundingBoxCurrentElt.x) - (boundingBoxNextElt.x);
//     })
//     return graphObjectsCopy;
// }
// export const sortListOfGraphObjectsWithinYAxis = (graphObjectsCopy: GraphElt[]) => {
//     graphObjectsCopy.sort((graphObject: GraphElt, nextGraphObject: GraphElt) => {
//         const boundingBoxCurrentElt = (graphObject instanceof Link) ? computeBoundingBoxOfLink(graphObject) : { x: graphObject.position.x, y: graphObject.position.y, w: graphObject.position.x + graphObject.width, h: graphObject.position.y + graphObject.height };
//         const boundingBoxNextElt = (nextGraphObject instanceof Link) ? computeBoundingBoxOfLink(nextGraphObject) : { x: nextGraphObject.position.x, y: nextGraphObject.position.y, w: nextGraphObject.position.x + nextGraphObject.width, h: nextGraphObject.position.y + nextGraphObject.height };
//         return (boundingBoxCurrentElt.y) - (boundingBoxNextElt.y);
//     })
//     return graphObjectsCopy;
// }
