/// <amd-module name='DS/EPSSchematicsUI/geometries/EPSSchematicsUIControlLinkGeometry'/>
define("DS/EPSSchematicsUI/geometries/EPSSchematicsUIControlLinkGeometry", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/tools/EPSSchematicsUIMath", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphControlPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphEventPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, EGraphCore, UIBlock, UIMath, UIGraphControlPort, UIGraphEventPort, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI control link geometry.
     * @private
     * @class UIControlLinkGeometry
     * @alias module:DS/EPSSchematicsUI/geometries/EPSSchematicsUIControlLinkGeometry
     * @extends EGraphCore.StairGeometry
     */
    class UIControlLinkGeometry extends EGraphCore.StairGeometry {
        static { this.K_BLOCKPORTMINSEGLENGTH = 5; }
        static { this.K_GRAPHPORTMINSEGLENGTH = 10; }
        static { this.K_MINBLOCKTOLINKGAPX = 20; }
        static { this.K_MINBLOCKTOLINKGAPY = 30; }
        /**
         * @public
         * @constructor
         * @param {EGraphCore.IStairGeometryOptions} options - The stair geometry options.
         */
        constructor(options) {
            super(options);
        }
        /**
         * The callback on the control link geometry update.
         * @public
         * @param {EGraphCore.Edge} edge - The edge to update.
         */
        onupdate(edge) {
            const block1 = edge.cl1.c.data.uiElement.getParent();
            const block2 = edge.cl2.c.data.uiElement.getParent();
            const areBlocks = block1 instanceof UIBlock && block2 instanceof UIBlock;
            if (!edge.reshaped && !edge.splitted) {
                this.updateAutomaticPath(edge);
            }
            else if (areBlocks && block1.isSelected() && block2.isSelected()) {
                this.updateStaticPath(edge);
            }
            else {
                this.updateManualPath(edge);
            }
        }
        /**
         * Updates the control link path geometry with static pattern.
         * @private
         * @param {EGraphCore.Edge} edge - The edge to update.
         */
        // eslint-disable-next-line class-methods-use-this
        updateStaticPath(edge) {
            const newPath = edge.path.slice();
            const start = { x: edge.cl1.c.aleft, y: edge.cl1.c.atop };
            const end = { x: edge.cl2.c.aleft, y: edge.cl2.c.atop };
            const diffX = start.x - newPath[1];
            const diffY = start.y - newPath[2];
            // Set start and end points to respective port position
            newPath[1] = start.x;
            newPath[2] = start.y;
            newPath[newPath.length - 2] = end.x;
            newPath[newPath.length - 1] = end.y;
            // Update the other points
            for (let i = 3; i < newPath.length - 3; i += 3) {
                newPath[i + 1] += diffX;
                newPath[i + 2] += diffY;
            }
            edge.set('path', newPath);
        }
        /**
         * Updates the control link path geometry with manual pattern.
         * @private
         * @param {EGraphCore.Edge} edge - The edge to update.
         */
        updateManualPath(edge) {
            let newPath = edge.path.slice();
            const start = { x: edge.cl1.c.aleft, y: edge.cl1.c.atop };
            const end = { x: edge.cl2.c.aleft, y: edge.cl2.c.atop };
            const totalPoints = newPath.length / 3;
            // Set start and end points to respective port position
            newPath[1] = start.x;
            newPath[2] = start.y;
            newPath[newPath.length - 2] = end.x;
            newPath[newPath.length - 1] = end.y;
            if (totalPoints >= 4) {
                // Add an horizontal constraint on the start+1 and end-1 points
                newPath[5] = start.y;
                newPath[newPath.length - 4] = end.y;
                // Add a vertical contraint on the start+1 and start+2 points
                const limitStartX = UIMath.snapValue(start.x + UIControlLinkGeometry.K_BLOCKPORTMINSEGLENGTH);
                if (limitStartX > newPath[4]) {
                    newPath[4] = limitStartX;
                    newPath[7] = limitStartX;
                }
                // Add a vertical constraint on the end-1 and end-2 path and split the path if needed
                const limitEndX = UIMath.snapValue(end.x - UIControlLinkGeometry.K_BLOCKPORTMINSEGLENGTH);
                if (limitEndX < newPath[newPath.length - 5]) {
                    newPath[newPath.length - 5] = limitEndX;
                    if (newPath.length === 12 && limitStartX > limitEndX) {
                        newPath = this.getSplittedMiddlePath(newPath);
                    }
                    else {
                        newPath[newPath.length - 8] = limitEndX;
                    }
                }
            }
            edge.set('path', newPath);
            // Refine path only for paths having more than 3 segments (min 5 points)
            if (totalPoints >= 5) {
                edge.reshapeInProgress = true;
                this.refinePath(edge);
            }
        }
        /**
         * Updates the control link path geometry with automatic pattern.
         * @private
         * @param {EGraphCore.Edge} edge - The edge to update.
         */
        updateAutomaticPath(edge) {
            let newPath = [];
            const portC1 = edge.cl1.c.data.uiElement;
            const c1 = {
                port: portC1,
                block: portC1.getParent(),
                type: portC1.getModel().getType(),
                left: edge.cl1.c.aleft,
                top: edge.cl1.c.atop
            };
            const portC2 = edge.cl2.c.data.uiElement;
            const c2 = {
                port: portC2,
                block: portC2.getParent(),
                type: portC2.getModel().getType(),
                left: edge.cl2.c.aleft,
                top: edge.cl2.c.atop
            };
            // Manage graph port by reversing their types
            if (c1.port instanceof UIGraphEventPort) {
                c1.type = (c1.type === ModelEnums.EControlPortType.eInputEvent) ? ModelEnums.EControlPortType.eOutput : ModelEnums.EControlPortType.eInput;
            }
            else if (c1.port instanceof UIGraphControlPort) {
                c1.type = (c1.type === ModelEnums.EControlPortType.eInput) ? ModelEnums.EControlPortType.eOutput : ModelEnums.EControlPortType.eInput;
            }
            if (c2.port instanceof UIGraphEventPort) {
                c2.type = (c2.type === ModelEnums.EControlPortType.eInputEvent) ? ModelEnums.EControlPortType.eOutput : ModelEnums.EControlPortType.eInput;
            }
            else if (c2.port instanceof UIGraphControlPort) {
                c2.type = (c2.type === ModelEnums.EControlPortType.eInput) ? ModelEnums.EControlPortType.eOutput : ModelEnums.EControlPortType.eInput;
            }
            const segLength = UIControlLinkGeometry.K_BLOCKPORTMINSEGLENGTH;
            const output = c1.type === ModelEnums.EControlPortType.eOutput || c1.type === ModelEnums.EControlPortType.eOutputEvent;
            const isGraphPorts = c1.port instanceof UIGraphControlPort || c2.port instanceof UIGraphControlPort;
            if (c1.block === c2.block && c1.block !== undefined && !(c1.port instanceof UIGraphControlPort)) {
                newPath = this.computeLoopLinkPath(c1, c2);
            }
            else if (!isGraphPorts && ((output && (c2.left - segLength < c1.left + segLength)) || (!output && (c1.left - segLength < c2.left + segLength)))) {
                newPath = this.computeReverseLinkPath(c1, c2);
            }
            else {
                newPath = this.computeNormalLinkPath(c1, c2);
            }
            edge.set('path', newPath);
        }
        /**
         * Computes the path of the normal control link.
         * @private
         * @param {IConnectorSpec} c1 - The first connector.
         * @param {IConnectorSpec} c2 - The second connector.
         * @returns {Array<number>} The computed path.
         */
        // eslint-disable-next-line class-methods-use-this
        computeNormalLinkPath(c1, c2) {
            const output = (c1.type === ModelEnums.EControlPortType.eOutput);
            const destX = output ? c2.left - c1.left : c1.left - c2.left;
            const middleX = UIMath.snapValue(c1.left + (output ? (destX / 2) : -(destX / 2)));
            const path = [
                0 /* EGraphCore.PathCmd.M */, c1.left, c1.top,
                1 /* EGraphCore.PathCmd.L */, middleX, c1.top,
                1 /* EGraphCore.PathCmd.L */, middleX, c2.top,
                1 /* EGraphCore.PathCmd.L */, c2.left, c2.top
            ];
            return path;
        }
        /**
         * Computes the path of the reverse control link.
         * @private
         * @param {IConnectorSpec} c1 - The first connector.
         * @param {IConnectorSpec} c2 - The second connector.
         * @returns {Array<number>} The computed path.
         */
        // eslint-disable-next-line class-methods-use-this
        computeReverseLinkPath(c1, c2) {
            const b1Pos = c1.block.getPosition();
            const b2Pos = c2.block.getPosition();
            const x1max = b1Pos.left + c1.block.getWidth();
            const y1min = b1Pos.top;
            const y1max = b1Pos.top + c1.block.getHeight();
            const x2max = b2Pos.left + c2.block.getWidth();
            const y2min = b2Pos.top;
            const y2max = b2Pos.top + c2.block.getHeight();
            const gap = UIControlLinkGeometry.K_MINBLOCKTOLINKGAPY * 2;
            let middleY;
            const output = (c1.type === ModelEnums.EControlPortType.eOutput);
            let left1 = UIMath.snapValue(c1.left + UIControlLinkGeometry.K_BLOCKPORTMINSEGLENGTH * (output ? 1 : -1));
            const left2 = UIMath.snapValue(c2.left + UIControlLinkGeometry.K_BLOCKPORTMINSEGLENGTH * (output ? -1 : 1));
            // Manage block vertical avoidance
            if (y1min < y2min && y1max + gap <= y2min) {
                middleY = UIMath.snapValue(y1max + (y2min - y1max) / 2);
            }
            else if (y2max + gap <= y1min) {
                middleY = UIMath.snapValue(y2max + (y1min - y2max) / 2);
            }
            else {
                middleY = (y1max < y2max ? y2max : y1max) + UIControlLinkGeometry.K_MINBLOCKTOLINKGAPY;
                // Manage block horizontal avoidance
                if (output && x1max < x2max) {
                    left1 = x2max + UIControlLinkGeometry.K_MINBLOCKTOLINKGAPX;
                }
            }
            const path = [
                0 /* EGraphCore.PathCmd.M */, c1.left, c1.top,
                1 /* EGraphCore.PathCmd.L */, left1, c1.top,
                1 /* EGraphCore.PathCmd.L */, left1, middleY,
                1 /* EGraphCore.PathCmd.L */, left2, middleY,
                1 /* EGraphCore.PathCmd.L */, left2, c2.top,
                1 /* EGraphCore.PathCmd.L */, c2.left, c2.top
            ];
            return path;
        }
        /**
         * Computes the path of the looping control link.
         * @private
         * @param {IConnectorSpec} c1 - The first connector.
         * @param {IConnectorSpec} c2 - The second connector.
         * @returns {Array<number>} The computed path.
         */
        // eslint-disable-next-line class-methods-use-this
        computeLoopLinkPath(c1, c2) {
            const blockHeight = c1.block.getHeight();
            const blockPos = c1.block.getPosition();
            const linkPosY = UIMath.snapValue(blockPos.top + blockHeight - c1.top + UIControlLinkGeometry.K_MINBLOCKTOLINKGAPY);
            const output = (c1.type === ModelEnums.EControlPortType.eOutput);
            const left1 = UIMath.snapValue(c1.left + UIControlLinkGeometry.K_BLOCKPORTMINSEGLENGTH * (output ? 1 : -1));
            const left2 = UIMath.snapValue(c2.left + UIControlLinkGeometry.K_BLOCKPORTMINSEGLENGTH * (output ? -1 : 1));
            const path = [
                0 /* EGraphCore.PathCmd.M */, c1.left, c1.top,
                1 /* EGraphCore.PathCmd.L */, left1, c1.top,
                1 /* EGraphCore.PathCmd.L */, left1, c1.top + linkPosY,
                1 /* EGraphCore.PathCmd.L */, left2, c1.top + linkPosY,
                1 /* EGraphCore.PathCmd.L */, left2, c2.top,
                1 /* EGraphCore.PathCmd.L */, c2.left, c2.top
            ];
            return path;
        }
        /**
         * Splits the provided path in the middle.
         * @private
         * @param {Array<number>} path - The path to split.
         * @returns {Array<number>} The splitted path.
         */
        // eslint-disable-next-line class-methods-use-this
        getSplittedMiddlePath(path) {
            const newPath = path.slice();
            const totalPoints = newPath.length / 3;
            const middleIndex = (totalPoints / 2) * 3;
            const p1x = newPath[middleIndex - 2];
            const p1y = newPath[middleIndex - 1];
            const p2x = newPath[middleIndex + 1];
            const p2y = newPath[middleIndex + 2];
            const middleY = UIMath.snapValue(p1y + (p2y - p1y) / 2);
            newPath.splice(middleIndex, 0, 1 /* EGraphCore.PathCmd.L */, p1x, middleY, 1 /* EGraphCore.PathCmd.L */, p2x, middleY);
            return newPath;
        }
        /**
         * Overrides the edge reshape path function.
         * @override
         * @protected
         * @param {EGraphCore.Edge} edge - The edge.
         * @param {EGraphCore.IPickedSegmentOptions} pickedSegmentOptions - The picked segment options.
         * @param {Array<number>} reshapePosition - The reshape position.
         */
        // eslint-disable-next-line class-methods-use-this
        reshapePath(edge, pickedSegmentOptions, reshapePosition) {
            // TODO: Check if we can call directly the parent class function!
            /*const graph = edge.data.uiElement.graph;
            const verticalMove = pickedSegmentOptions.direction && pickedSegmentOptions.direction[1] === 0;
            const paddingLeft = 30;
            const paddingRight = 30;
            const graphMin = verticalMove ? graph.getTop() + graph.getPaddingTop() : graph.getLeft() + paddingLeft;
            const graphMax = verticalMove ? graph.getTop() + graph.getHeight() - graph.getPaddingBottom() : graph.getLeft() + graph.getWidth() - paddingRight;
            EgraphCore.StairGeometry.prototype.reshapePath.call(this, edge, pickedSegmentOptions, reshapePosition, graphMin, graphMax, function (path1, path2) {
                path1 = UIMath.snapValue(path1);
                path2 = UIMath.snapValue(path2);
            });*/
            if (edge && pickedSegmentOptions && reshapePosition) {
                const margin = UIControlLinkGeometry.K_GRAPHPORTMINSEGLENGTH;
                const verticalMove = pickedSegmentOptions.direction && pickedSegmentOptions.direction[1] === 0;
                const newPath = edge.path.slice(0);
                const index = pickedSegmentOptions.index;
                const graph = edge.data.uiElement.getGraph();
                const paddingLeft = 30;
                const paddingRight = 30;
                const graphMin = verticalMove ? graph.getTop() + graph.getPaddingTop() : graph.getLeft() + paddingLeft;
                const graphMax = verticalMove ? graph.getTop() + graph.getHeight() - graph.getPaddingBottom() : graph.getLeft() + graph.getWidth() - paddingRight;
                const min = index === 6 ? (verticalMove ? newPath[2] : newPath[1]) + margin : graphMin;
                const max = index === newPath.length - 6 ? (verticalMove ? newPath[newPath.length - 1] : newPath[newPath.length - 2]) - margin : graphMax;
                if (verticalMove) {
                    if (reshapePosition[1] < min) {
                        newPath[index + 2] = UIMath.snapValue(min);
                        newPath[index - 1] = UIMath.snapValue(min);
                    }
                    else if (reshapePosition[1] > max) {
                        newPath[index + 2] = UIMath.snapValue(max);
                        newPath[index - 1] = UIMath.snapValue(max);
                    }
                    else {
                        newPath[index + 2] = UIMath.snapValue(reshapePosition[1]);
                        newPath[index - 1] = UIMath.snapValue(reshapePosition[1]);
                    }
                }
                else {
                    if (reshapePosition[0] < min) {
                        newPath[index + 1] = UIMath.snapValue(min);
                        newPath[index - 2] = UIMath.snapValue(min);
                    }
                    else if (reshapePosition[0] > max) {
                        newPath[index + 1] = UIMath.snapValue(max);
                        newPath[index - 2] = UIMath.snapValue(max);
                    }
                    else {
                        newPath[index + 1] = UIMath.snapValue(reshapePosition[0]);
                        newPath[index - 2] = UIMath.snapValue(reshapePosition[0]);
                    }
                }
                edge.gr.withLockedUpdate(function setPath() {
                    edge.set('path', newPath);
                    edge.reshaped = true;
                    edge.reshapeInProgress = true;
                });
            }
        }
        /**
         * Splits the given edge path.
         * @protected
         * @override
         * @param {EGraphCore.Edge} edge - The edge to split.
         * @param {EGraphCore.IPickedSegmentOptions} pickedSegmentOptions - The picked segment options.
         * @param {[number, number]} splitPosition - The split position.
         */
        splitPath(edge, pickedSegmentOptions, splitPosition) {
            const controlLink = edge.data.uiElement;
            const isReadOnly = controlLink.getGraph().getViewer().isReadOnly();
            if (!isReadOnly) {
                splitPosition[0] = UIMath.snapValue(splitPosition[0]);
                splitPosition[1] = UIMath.snapValue(splitPosition[1]);
                super.splitPath(edge, pickedSegmentOptions, splitPosition);
            }
        }
        /**
         * Checks whether or not the provided position is on the provided segment.
         * @private
         * @param {number} x - The x position.
         * @param {number} y - The y position.
         * @param {number} x1 - The first point x position of the segment.
         * @param {number} y1 - The first point y position of the segment.
         * @param {number} x2 - The last point x position of the segment.
         * @param {number} y2 - The last point y position of the segment.
         * @returns {boolean} True if the point is on the given segment else false.
         */
        // eslint-disable-next-line class-methods-use-this
        isOnSegment(x, y, x1, y1, x2, y2) {
            const margin = 5;
            let dx1 = x - x1;
            let dy1 = y - y1;
            const dx2 = x2 - x1;
            const dy2 = y2 - y1;
            if (Math.abs(dx1) < margin) {
                dx1 = 0;
            }
            if (Math.abs(dy1) < margin) {
                dy1 = 0;
            }
            const cross = dx1 * dy2 - dy1 * dx2;
            let result = false;
            // The point lies on the line if and only if cross is equal to zero.
            if (cross === 0) {
                // Now we have to check whether the point lies between the original points.
                // This can be easily done by comparing the x coordinates, if the line
                // is "more horizontal than vertical", or y coordinates otherwise!
                if (Math.abs(dx2) >= Math.abs(dy2)) {
                    result = dx2 > 0 ? x1 <= x && x <= x2 : x2 <= x && x <= x1;
                }
                else {
                    result = dy2 > 0 ? y1 <= y && y <= y2 : y2 <= y && y <= y1;
                }
            }
            return result;
        }
        /**
         * Checks if the given point is on a vertical or horizontal segment.
         * @public
         * @param {EGraphCore.Edge} edge - The edge.
         * @param {number} x - The x position on the segment.
         * @param {number} y - The y position on the segment.
         * @returns {boolean|undefined} True if the segment is vertical else false or undefined if the point is not on segment.
         */
        isSegmentVertical(edge, x, y) {
            let isVertical;
            const path = edge.path;
            for (let i = 3; i < path.length - 6; i += 3) {
                const x1 = path[i + 1];
                const y1 = path[i + 2];
                const x2 = path[i + 4];
                const y2 = path[i + 5];
                const result = this.isOnSegment(x, y, x1, y1, x2, y2);
                if (result) {
                    isVertical = x1 === x2;
                    break;
                }
            }
            return isVertical;
        }
        /**
         * Overrides the retrieving of the picked segment options function.
         * @private
         * @override
         * @param {EGraphCore.Edge} edge - The edge.
         * @param {Array<number>} graphPos - The picked graph position.
         * @returns {EGraphCore.IPickedSegmentOptions} The picked segment options.
         */
        getPickedSegmentOptions(edge, graphPos) {
            let options = { index: -1, direction: [0, 0] };
            if (edge && graphPos) {
                let lastX = edge.path[1];
                let lastY = edge.path[2];
                for (let idx = 3; idx < edge.path.length; idx += 3) {
                    const curX = edge.path[idx + 1];
                    const curY = edge.path[idx + 2];
                    if (this.isOnSegment(graphPos[0], graphPos[1], lastX, lastY, curX, curY)) {
                        options = { index: idx, direction: [edge.path[idx + 1] - lastX, edge.path[idx + 2] - lastY] };
                        break;
                    }
                    lastX = curX;
                    lastY = curY;
                }
            }
            return options;
        }
        /**
         * Gets the control link geometry bounding box.
         * @public
         * @param {EGraphCore.Edge} edge - The edge.
         * @param {boolean} fixedPath - True to limit the bounding box to fixed paths segment only else false.
         * @returns {EGraphUtils.BoundingRect} The control link bounding box.
         */
        // eslint-disable-next-line class-methods-use-this
        getBoundingBox(edge, fixedPath) {
            let xmin, ymin, xmax, ymax;
            const start = fixedPath ? 3 : 0;
            const stop = fixedPath ? edge.path.length - 3 : edge.path.length;
            xmin = xmax = edge.path[start + 1];
            ymin = ymax = edge.path[start + 2];
            for (let i = start; i < stop; i += 3) {
                const x = edge.path[i + 1];
                const y = edge.path[i + 2];
                xmin = UIMath.getMin(x, xmin);
                xmax = UIMath.getMax(x, xmax);
                ymin = UIMath.getMin(y, ymin);
                ymax = UIMath.getMax(y, ymax);
            }
            return { xmin: xmin + UIControlLinkGeometry.K_MINBLOCKTOLINKGAPX, ymin: ymin, xmax: xmax - UIControlLinkGeometry.K_MINBLOCKTOLINKGAPX, ymax: ymax };
        }
    }
    return UIControlLinkGeometry;
});
