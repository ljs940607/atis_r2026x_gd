/// <amd-module name="DS/DELGraphModel/utils/GeometricalComputation"/>
define("DS/DELGraphModel/utils/GeometricalComputation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.midWayPointsDefinition = exports.computeStringLength = exports.checkPointInSegmentVertically = exports.checkPointInSegmentHorizontally = exports.getMidPathPoint = exports.getOppositeSide = exports.checkPointIsEqualToEdge = exports.computeShapeEdges = exports.computeEuclidianDistance = exports.checkDimensionParity = exports.convertToGridCoord = exports.gridStep = void 0;
    // grid-step
    exports.gridStep = 24;
    const convertToGridCoord = (coord) => {
        return Math.round(coord / exports.gridStep) * exports.gridStep;
    };
    exports.convertToGridCoord = convertToGridCoord;
    const checkDimensionParity = (dimension) => {
        return (dimension / exports.gridStep % 2) === 0;
    };
    exports.checkDimensionParity = checkDimensionParity;
    const computeEuclidianDistance = (startPt, endPt) => {
        let diffx = endPt.x - startPt.x;
        let diffy = endPt.y - startPt.y;
        return Math.sqrt(Math.pow(diffx, 2) + Math.pow(diffy, 2));
    };
    exports.computeEuclidianDistance = computeEuclidianDistance;
    const computeShapeEdges = (boundingBox) => {
        return [
            { x: boundingBox.x, y: boundingBox.y },
            { x: boundingBox.x + boundingBox.w, y: boundingBox.y },
            { x: boundingBox.x, y: boundingBox.y + boundingBox.h },
            { x: boundingBox.x + boundingBox.w, y: boundingBox.y + boundingBox.h },
        ];
    };
    exports.computeShapeEdges = computeShapeEdges;
    const checkPointIsEqualToEdge = (point, boundingBox) => {
        const graphEltsEdges = (0, exports.computeShapeEdges)(boundingBox);
        return graphEltsEdges.some((value) => {
            return value.x === point.x && value.y === point.y;
        });
    };
    exports.checkPointIsEqualToEdge = checkPointIsEqualToEdge;
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
                let currentDistance = (0, exports.computeEuclidianDistance)(wayPt, nextWayPt);
                if (currentDistance > maxSegmentDistance) {
                    midPoint = { x: (wayPt.x + nextWayPt.x) / 2, y: (wayPt.y + nextWayPt.y) / 2 };
                    maxSegmentDistance = currentDistance;
                }
            }
        });
        return midPoint;
    };
    exports.getMidPathPoint = getMidPathPoint;
    const checkPointInSegmentHorizontally = (point, segment) => {
        return ((segment[0].x - point.x) * (segment[1].x - point.x) < 0);
    };
    exports.checkPointInSegmentHorizontally = checkPointInSegmentHorizontally;
    const checkPointInSegmentVertically = (point, segment) => {
        return ((segment[0].y - point.y) * (segment[1].y - point.y) < 0);
    };
    exports.checkPointInSegmentVertically = checkPointInSegmentVertically;
    const computeStringLength = (str, fontSize = "16px", padding = "8px") => {
        const paragraph = document.createElement("span");
        paragraph.style.fontFamily = "Arial";
        paragraph.style.fontSize = fontSize;
        paragraph.style.padding = padding;
        paragraph.style.whiteSpace = "nowrap";
        paragraph.textContent = str;
        document.body.appendChild(paragraph);
        const stringLength = paragraph.offsetWidth;
        document.body.removeChild(paragraph);
        return stringLength;
    };
    exports.computeStringLength = computeStringLength;
    /**
     * algo to define midWayPoints between two points (following manahattan edge-routing)
     * @param startWayPt
     * @param endWayPy
     * @param sourceSide
     * @param targetSide
     */
    const midWayPointsDefinition = (startWayPt, endWayPt, sourceSide, targetSide) => {
        let listOfmidWayPts = [];
        const attachementSidesOffset = new Map([
            ["North", { "xoffset": 0, "yoffset": -exports.gridStep }],
            ["West", { "xoffset": -exports.gridStep, "yoffset": 0 }],
            ["South", { "xoffset": 0, "yoffset": exports.gridStep }],
            ["East", { "xoffset": exports.gridStep, "yoffset": 0 }]
        ]);
        // vector, firstPt, secondPt, length, direction
        let startOffset = attachementSidesOffset.get(sourceSide);
        let xstartOffset = typeof (startOffset === null || startOffset === void 0 ? void 0 : startOffset.xoffset) !== "undefined" ? startOffset.xoffset : 0;
        let ystartOffset = typeof (startOffset === null || startOffset === void 0 ? void 0 : startOffset.yoffset) !== "undefined" ? startOffset.yoffset : 0;
        let endOffset = attachementSidesOffset.get(targetSide);
        let xendOffset = typeof (endOffset === null || endOffset === void 0 ? void 0 : endOffset.xoffset) !== "undefined" ? endOffset.xoffset : 0;
        let yendOffset = typeof (endOffset === null || endOffset === void 0 ? void 0 : endOffset.yoffset) !== "undefined" ? endOffset.yoffset : 0;
        let startVector = {
            "startPt": startWayPt,
            "endPt": { "x": startWayPt.x + xstartOffset, "y": startWayPt.y + ystartOffset },
            "length": exports.gridStep,
            "direction": sourceSide
        };
        let endVector = {
            "startPt": { "x": endWayPt.x + xendOffset, "y": endWayPt.y + yendOffset },
            "endPt": endWayPt,
            "length": exports.gridStep,
            "direction": targetSide
        };
        // parallel vectors
        if (startVector.direction === endVector.direction || startVector.direction == (0, exports.getOppositeSide)((endVector.direction))) {
            // aligned vectors
            if (startVector.startPt.y === endVector.startPt.y)
                listOfmidWayPts = [startVector.endPt, { ...startVector.endPt, "y": startVector.endPt.y + exports.gridStep }, { ...endVector.startPt, "y": endVector.startPt.y + exports.gridStep }, endVector.startPt];
            if (startVector.startPt.x === endVector.startPt.x)
                listOfmidWayPts = [startVector.endPt, { ...startVector.endPt, "x": startVector.endPt.x - exports.gridStep }, { ...endVector.startPt, "x": endVector.startPt.x - exports.gridStep }, endVector.startPt];
            // non-aligned vectors
            if (startVector.direction === endVector.direction) {
                if (endVector.direction == "West")
                    listOfmidWayPts = [{ ...startVector.endPt, "x": Math.min(startVector.endPt.x, endVector.startPt.x) }, { ...endVector.startPt, "x": Math.min(startVector.endPt.x, endVector.startPt.x) }];
                else if (endVector.direction == "East")
                    listOfmidWayPts = [{ ...startVector.endPt, "x": Math.max(startVector.endPt.x, endVector.startPt.x) }, { ...endVector.startPt, "x": Math.max(startVector.endPt.x, endVector.startPt.x) }];
                else if (endVector.direction == "North")
                    listOfmidWayPts = [{ ...startVector.endPt, "y": Math.min(startVector.endPt.y, endVector.startPt.y) }, { ...endVector.startPt, "y": Math.min(startVector.endPt.y, endVector.startPt.y) }];
                else if (endVector.direction == "South")
                    listOfmidWayPts = [{ ...startVector.endPt, "y": Math.max(startVector.endPt.y, endVector.startPt.y) }, { ...endVector.startPt, "y": Math.max(startVector.endPt.y, endVector.startPt.y) }];
            }
            else {
                if (["West", "East"].includes(endVector.direction))
                    listOfmidWayPts = [{ ...startVector.endPt, "x": (0, exports.convertToGridCoord)((startVector.endPt.x + endVector.startPt.x) / 2) }, { ...endVector.startPt, "x": (0, exports.convertToGridCoord)((startVector.endPt.x + endVector.startPt.x) / 2) }];
                else if (["North", "South"].includes(endVector.direction))
                    listOfmidWayPts = [{ ...startVector.endPt, "y": (0, exports.convertToGridCoord)((startVector.endPt.y + endVector.startPt.y) / 2) }, { ...endVector.startPt, "y": (0, exports.convertToGridCoord)((startVector.endPt.y + endVector.startPt.y) / 2) }];
            }
        }
        else {
            // orthogonal vectors (same direction: North <> West)
            if (["West", "East"].includes(endVector.direction)) {
                if (!(0, exports.checkPointInSegmentHorizontally)(endVector.startPt, [endVector.endPt, startVector.endPt]))
                    listOfmidWayPts = [startVector.endPt, { "x": startVector.endPt.x, "y": endVector.startPt.y }, endVector.startPt];
                else
                    listOfmidWayPts = [startVector.endPt, { "x": endVector.startPt.x, "y": startVector.endPt.y }, endVector.startPt];
            }
            else {
                if (!(0, exports.checkPointInSegmentVertically)(endVector.startPt, [endVector.endPt, startVector.endPt]))
                    listOfmidWayPts = [startVector.endPt, { "x": endVector.startPt.x, "y": startVector.endPt.y }, endVector.startPt];
                else
                    listOfmidWayPts = [startVector.endPt, { "x": endVector.startPt.x, "y": startVector.endPt.y }, endVector.startPt];
            }
        }
        return listOfmidWayPts;
    };
    exports.midWayPointsDefinition = midWayPointsDefinition;
});
