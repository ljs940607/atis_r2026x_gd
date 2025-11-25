/// <amd-module name="DS/DELGraphModel/model/Link"/>
define("DS/DELGraphModel/model/Link", ["require", "exports", "DS/DELGraphModel/model/GraphElt", "DS/DELGraphModel/utils/GeometricalComputation"], function (require, exports, GraphElt_1, GeometricalComputation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Link = void 0;
    class Link extends GraphElt_1.GraphElt {
        constructor(id, type, label, sourceID, targetID) {
            super(id, type, label);
            this.color = "grey";
            this.isSelected = false;
            this.isDragged = false;
            this.editMode = false;
            this.sourceSide = 'Center';
            this.targetSide = 'Center';
            this._wayPoints = [];
            this._shadowEltWayPoints = [];
            this.labelOffset = { left: 0, top: 0 };
            this.id = id;
            this.type = type;
            this.label = label;
            this.sourceID = sourceID;
            this.targetID = targetID;
            this.width = Math.max(4 * GeometricalComputation_1.gridStep, (0, GeometricalComputation_1.computeStringLength)(label));
            this.height = GeometricalComputation_1.gridStep / 2;
        }
        get wayPoints() {
            return this._wayPoints;
        }
        get shadowEltWayPoints() {
            return this._shadowEltWayPoints;
        }
        set wayPoints(listOfPts) {
            this._wayPoints = listOfPts;
            this.updatePosition();
        }
        set shadowEltWayPoints(listOfPts) {
            this._shadowEltWayPoints = listOfPts;
        }
        // default wayPt by sides
        updateWayPoint() {
            if (this._wayPoints.length === 2) {
                if (this._wayPoints[0].x !== this._wayPoints[this._wayPoints.length - 1].x && this._wayPoints[0].y !== this._wayPoints[this._wayPoints.length - 1].y) {
                    let listOfwayPts = (0, GeometricalComputation_1.midWayPointsDefinition)(this._wayPoints[0], this._wayPoints[this._wayPoints.length - 1], this.sourceSide, this.targetSide);
                    this._wayPoints = [this._wayPoints[0], ...listOfwayPts, this._wayPoints[this._wayPoints.length - 1]];
                    if (this._wayPoints.length > 2) {
                        this.simplfyPath();
                        this.removeDupWayPoints();
                    }
                }
                // this.computeBendPts();
                this.updatePosition();
            }
        }
        addWayPoint(index, point) {
            if (point) {
                this._wayPoints.splice(index, 0, Object.assign({}, point));
                this.updatePosition();
            }
        }
        ;
        update_wayPointsList(index, point) {
            if (point) {
                this._wayPoints[index] = Object.assign({}, point);
            }
            this.updatePosition();
        }
        simplfyPath() {
            if (this._wayPoints.length > 2) {
                // path simplification
                let simplifiedListOf_wayPoints = [this._wayPoints[0]];
                for (let i = 1; i < this._wayPoints.length - 1; i++) {
                    let prevWayPt = this._wayPoints[i - 1];
                    let currentWayPt = this._wayPoints[i];
                    let nextWayPt = this._wayPoints[i + 1];
                    if ((currentWayPt.x !== prevWayPt.x && currentWayPt.x === nextWayPt.x) || (currentWayPt.x === prevWayPt.x && currentWayPt.x !== nextWayPt.x)) {
                        if (currentWayPt.x === nextWayPt.x)
                            currentWayPt.y = prevWayPt.y;
                        if (currentWayPt.x === prevWayPt.x)
                            currentWayPt.y = nextWayPt.y;
                        simplifiedListOf_wayPoints.push(currentWayPt);
                    }
                    else if ((currentWayPt.y !== prevWayPt.y && currentWayPt.y === nextWayPt.y) || (currentWayPt.y === prevWayPt.y && currentWayPt.y !== nextWayPt.y)) {
                        if (currentWayPt.y === nextWayPt.y)
                            currentWayPt.x = prevWayPt.x;
                        if (currentWayPt.y === prevWayPt.y)
                            currentWayPt.x = nextWayPt.x;
                        simplifiedListOf_wayPoints.push(currentWayPt);
                    }
                }
                simplifiedListOf_wayPoints.push(this._wayPoints[this._wayPoints.length - 1]);
                this._wayPoints = structuredClone(simplifiedListOf_wayPoints);
                this.updatePosition();
            }
        }
        reverseSimplfyPath() {
            if (this._wayPoints.length > 2) {
                // path simplification
                let simplifiedListOf_wayPoints = [this._wayPoints[this._wayPoints.length - 1]];
                for (let i = this._wayPoints.length - 2; i > 0; i--) {
                    let prevWayPt = this._wayPoints[i + 1];
                    let currentWayPt = this._wayPoints[i];
                    let nextWayPt = this._wayPoints[i - 1];
                    if ((currentWayPt.x !== prevWayPt.x && currentWayPt.x === nextWayPt.x) || (currentWayPt.x === prevWayPt.x && currentWayPt.x !== nextWayPt.x)) {
                        if (currentWayPt.x === nextWayPt.x)
                            currentWayPt.y = prevWayPt.y;
                        if (currentWayPt.x === prevWayPt.x)
                            currentWayPt.y = nextWayPt.y;
                        simplifiedListOf_wayPoints.push(currentWayPt);
                    }
                    else if ((currentWayPt.y !== prevWayPt.y && currentWayPt.y === nextWayPt.y) || (currentWayPt.y === prevWayPt.y && currentWayPt.y !== nextWayPt.y)) {
                        if (currentWayPt.y === nextWayPt.y)
                            currentWayPt.x = prevWayPt.x;
                        if (currentWayPt.y === prevWayPt.y)
                            currentWayPt.x = nextWayPt.x;
                        simplifiedListOf_wayPoints.push(currentWayPt);
                    }
                }
                simplifiedListOf_wayPoints.push(this._wayPoints[0]);
                simplifiedListOf_wayPoints = simplifiedListOf_wayPoints.reverse();
                this._wayPoints = structuredClone(simplifiedListOf_wayPoints);
                this.updatePosition();
            }
        }
        removeDupWayPoints() {
            if (this._wayPoints.length > 2) {
                let currentWayPotList = structuredClone(this._wayPoints);
                currentWayPotList = currentWayPotList.filter((point, id, a) => {
                    let currentId = a.findIndex((point2) => point.x === point2.x && point.y === point2.y);
                    return id === currentId || Math.abs(currentId - id) % 4 == 0;
                });
                // avoid simplification to one wayPoint
                if (currentWayPotList.length === 1)
                    currentWayPotList = [currentWayPotList[0], currentWayPotList[0]];
                // self transition case
                if (currentWayPotList.length === 2 && this.sourceID === this.targetID) {
                    if (["North", "South"].includes(this.sourceSide)) {
                        let offsetSign = (this.sourceSide === "South") ? 1 : -1;
                        currentWayPotList = [{ x: currentWayPotList[0].x + GeometricalComputation_1.gridStep, y: currentWayPotList[0].y },
                            { x: currentWayPotList[0].x - GeometricalComputation_1.gridStep, y: currentWayPotList[0].y + offsetSign * GeometricalComputation_1.gridStep },
                            { x: currentWayPotList[0].x + GeometricalComputation_1.gridStep, y: currentWayPotList[0].y + offsetSign * GeometricalComputation_1.gridStep },
                            { x: currentWayPotList[0].x + GeometricalComputation_1.gridStep, y: currentWayPotList[0].y }];
                    }
                    else {
                        let offsetSign = (this.sourceSide === "East") ? 1 : -1;
                        currentWayPotList = [{ x: currentWayPotList[0].x, y: currentWayPotList[0].y - GeometricalComputation_1.gridStep },
                            { x: currentWayPotList[0].x + offsetSign * GeometricalComputation_1.gridStep, y: currentWayPotList[0].y - GeometricalComputation_1.gridStep },
                            { x: currentWayPotList[0].x + offsetSign * GeometricalComputation_1.gridStep, y: currentWayPotList[0].y + GeometricalComputation_1.gridStep },
                            { x: currentWayPotList[0].x, y: currentWayPotList[0].y + GeometricalComputation_1.gridStep }];
                    }
                }
                this._wayPoints = structuredClone(currentWayPotList);
                this.updatePosition();
            }
        }
        computeBendPts() {
            let [xstartStep, ystartStep, xendStep, yendStep] = [0, 0, 0, 0];
            if (this.sourceSide == "West")
                [xstartStep, ystartStep] = [-GeometricalComputation_1.gridStep, 0];
            if (this.sourceSide == "East")
                [xstartStep, ystartStep] = [GeometricalComputation_1.gridStep, 0];
            if (this.sourceSide == "North")
                [xstartStep, ystartStep] = [0, -GeometricalComputation_1.gridStep];
            if (this.sourceSide == "South")
                [xstartStep, ystartStep] = [0, GeometricalComputation_1.gridStep];
            if (this.targetSide == "West")
                [xendStep, yendStep] = [-GeometricalComputation_1.gridStep, 0];
            if (this.targetSide == "East")
                [xendStep, yendStep] = [GeometricalComputation_1.gridStep, 0];
            if (this.targetSide == "North")
                [xendStep, yendStep] = [0, -GeometricalComputation_1.gridStep];
            if (this.targetSide == "South")
                [xendStep, yendStep] = [0, GeometricalComputation_1.gridStep];
            // possible new wayPts
            let firstMidPt = { "x": this._wayPoints[0].x + xstartStep, "y": this._wayPoints[0].y + ystartStep };
            let secondMidPt = { "x": this._wayPoints[this._wayPoints.length - 1].x + xendStep, "y": this._wayPoints[this._wayPoints.length - 1].y + yendStep };
            if (this._wayPoints.length > 4) {
                this.update_wayPointsList(1, firstMidPt);
                this.update_wayPointsList(this._wayPoints.length - 1, secondMidPt);
            }
            else {
                let copyWy = [this._wayPoints[0], this._wayPoints[this._wayPoints.length - 1]];
                this._wayPoints = [...copyWy];
                this.addWayPoint(1, firstMidPt);
                this.addWayPoint(this._wayPoints.length - 1, secondMidPt);
            }
            this.updatePosition();
        }
        setSourceSide(side) {
            this.sourceSide = side;
        }
        setTargetSide(side) {
            this.targetSide = side;
        }
        dragShadowElt() {
            this.shadowEltWayPoints = [...structuredClone(this._wayPoints)];
        }
        shiftToLeft(dx) {
            this._wayPoints = this._wayPoints.map((wayPoint) => wayPoint = Object.assign({}, { "x": wayPoint.x - dx, "y": wayPoint.y }));
            if (!this.isDragged)
                this.dragShadowElt();
            this.updatePosition();
        }
        shiftToRight(dx) {
            this._wayPoints = this._wayPoints.map((wayPoint) => wayPoint = Object.assign({}, { "x": wayPoint.x + dx, "y": wayPoint.y }));
            if (!this.isDragged)
                this.dragShadowElt();
            this.updatePosition();
        }
        shiftToBottom(dy) {
            this._wayPoints = this._wayPoints.map((wayPoint) => wayPoint = Object.assign({}, { "x": wayPoint.x, "y": wayPoint.y + dy }));
            if (!this.isDragged)
                this.dragShadowElt();
            this.updatePosition();
        }
        shiftToTop(dy) {
            this._wayPoints = this._wayPoints.map((wayPoint) => wayPoint = Object.assign({}, { "x": wayPoint.x, "y": wayPoint.y - dy }));
            if (!this.isDragged)
                this.dragShadowElt();
            this.updatePosition();
        }
        updateLabelOffset(dhorizontal, dvertical) {
            this.labelOffset = Object.assign({}, { left: this.labelOffset.left + dhorizontal, top: this.labelOffset.top + dvertical });
            this.updatePosition();
        }
        updatePosition() {
            const midPathPt = (0, GeometricalComputation_1.getMidPathPoint)(this._wayPoints);
            this.position = Object.assign({}, { x: midPathPt.x + this.labelOffset.left, y: midPathPt.y + this.labelOffset.top });
        }
    }
    exports.Link = Link;
});
