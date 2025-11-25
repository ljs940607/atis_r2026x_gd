/// <amd-module name="DS/DELGraphEditor/utils/UxActionsUtils"/>
define("DS/DELGraphEditor/utils/UxActionsUtils", ["require", "exports", "DS/DELGraphEditor/utils/GeometricalComputation", "DS/DELGraphEditor/types/DELGraphEditortypes", "DS/DELGraphModel/model/Link", "DS/DELGraphModel/model/Node", "DS/DELGraphEditor/utils/StaticAttributes"], function (require, exports, GeometricalComputation_1, DELGraphEditortypes_1, Link_1, Node_1, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sleep = exports.readFile = exports.saveGraphAsJson = exports.convertJsonObjectToGraphEltsList = exports.convertGraphEltsListToJsonObject = exports.copyPngToClipBoard = exports.convertSVGToPng = exports.saveGraphAsPdf = exports.saveGraphAsSVGImage = exports.convertSVGToURiComponent = exports.handlePan = exports.handleZoom = exports.updateSpacingCursor = exports.updateCursorOnLink = exports.updateCursorOnNode = exports.sanitizeId = exports.generateUniqueId = void 0;
    /**
     * Function to generate a unique id
     * @returns string id
     */
    const generateUniqueId = () => {
        return Math.floor(Math.random() * 90).toString() + new Date().getMilliseconds();
    };
    exports.generateUniqueId = generateUniqueId;
    /**
     * Function to sanitize the id (remove special characters {_,-,*,/...})
     * @returns string id
     */
    const sanitizeId = (id) => {
        if (!id)
            return "";
        return id.replace(/[^a-zA-Z0-9]/g, '');
    };
    exports.sanitizeId = sanitizeId;
    /**
     * Function to update the mouseCursor when hovering over a node
     * @param targetType  targetElt type
     * @returns newcursor
     */
    const updateCursorOnNode = (targetType) => {
        if (targetType === "resizeAnchor")
            return "nwse-resize";
        else
            return "move";
    };
    exports.updateCursorOnNode = updateCursorOnNode;
    /**
     * Function to update the mouseCursor when hovering over a link
     * @param targetType the target type
     * @param firstWayPt the first way Point in the hovered segment
     * @param secondWayPt the second way Point in the hovered segment
     * @returns
     */
    const updateCursorOnLink = (targetType, firstWayPt, secondWayPt) => {
        if (targetType === "resizeAnchor")
            return "nwse-resize";
        if (targetType === "segmentOutline") {
            if (firstWayPt && secondWayPt && firstWayPt.x === secondWayPt.x)
                return "ew-resize";
            if (firstWayPt && secondWayPt && firstWayPt.y === secondWayPt.y)
                return "ns-resize";
        }
        return "default";
    };
    exports.updateCursorOnLink = updateCursorOnLink;
    /**
     * Function to update the cursor when creating/deleting the space [spacing movement]
     * @param startPointCoord
     * @param currentPointerCoord
     * @param transformVector
     * @param offset
     * @returns
     */
    const updateSpacingCursor = (startPointCoord, currentPointerCoord, transformVector, offset) => {
        const relativeCurrentPointerCoord = (0, GeometricalComputation_1.normalizePosition)(currentPointerCoord, transformVector, offset);
        const diffX = Math.abs(startPointCoord.x - relativeCurrentPointerCoord.x);
        const diffY = Math.abs(startPointCoord.y - relativeCurrentPointerCoord.y);
        const diffMin = Math.min(diffX, diffY);
        if (diffX === diffMin)
            return "row-resize";
        else
            return "col-resize";
    };
    exports.updateSpacingCursor = updateSpacingCursor;
    /**
     * Function to compute the new value of the transformation vector after a zoom (in/out)
     * @param pointerCoord the pointer coordinates
     * @param transformVector the Vector of the applied transformation (translation,scale)
     * @param offset the  grid left and top offset with respect to the current window
     * @returns the computed transformation Vector
     */
    const handleZoom = (wheelCoord, transformVector, offset) => {
        const zoomIntensity = 0.05;
        const relativeMousePosx = (0, GeometricalComputation_1.convertToRelativeCoord)(wheelCoord.clientX, offset[0]);
        const relativeMousePosy = (0, GeometricalComputation_1.convertToRelativeCoord)(wheelCoord.clientY, offset[1]);
        const wheel = wheelCoord.deltaY < 0 ? 1 : -1; // normalize
        let newscale = Math.exp(wheel * zoomIntensity) * transformVector[2];
        newscale = Math.min(Math.max(0.01, newscale), 4); // set scale limits
        const scaleChange = newscale / transformVector[2];
        const tr0 = relativeMousePosx - (relativeMousePosx - transformVector[0]) * scaleChange;
        const tr1 = relativeMousePosy - (relativeMousePosy - transformVector[1]) * scaleChange;
        return [tr0, tr1, newscale];
    };
    exports.handleZoom = handleZoom;
    /**
     * Function to compute the new value of the transformation vector after vertical pan (using wheel)
     * @param pointerDeltaCoord the pointer delta coordinates
     * @param transformVector the Vector of the applied transformation (translation,scale)
     * @returns the computed transformation Vector
     */
    const handlePan = (pointerDeltaCoord, transformVector) => {
        return [transformVector[0] - pointerDeltaCoord.deltaX, transformVector[1] - pointerDeltaCoord.deltaY, transformVector[2]];
    };
    exports.handlePan = handlePan;
    /**
     * Function to convert a svg component to an uri (for svg,pdf export purposes)
     * @param svgBoundingBox
     * @returns encoded svg uri
     */
    const convertSVGToURiComponent = (svgElt, svgBoundingBox, keepBackground = true) => {
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElt);
        svgString = `<?xml version="1.0" encoding="utf-8"?>\n` + svgString;
        svgString = svgString.replace(`width="100%" height="100%"`, `viewBox="${svgBoundingBox.x} ${svgBoundingBox.y} ${svgBoundingBox.w} ${svgBoundingBox.h}"`);
        if (!keepBackground)
            svgString = svgString.replace(`fill="url('#grid-pattern')"`, `fill='transparent'`);
        return encodeURIComponent(svgString);
    };
    exports.convertSVGToURiComponent = convertSVGToURiComponent;
    /**
     * Function to save a svg
     * @param svgURI the encoded svg uri
     */
    const saveGraphAsSVGImage = (svgURI) => {
        const a = document.createElement("a");
        a.href = 'data:image/svg+xml;charset=utf-8,' + svgURI;
        a.download = "Image.svg";
        a.click();
    };
    exports.saveGraphAsSVGImage = saveGraphAsSVGImage;
    /**
     * Function to save a pdf
     * @param pdfData the pdf blob data
     */
    const saveGraphAsPdf = async (imgData, width, height) => {
        //     const printWin = window.open("", "", 'width=800,height=600');
        //     if (!printWin) return;
        //     //size:${(width / height) > 1 ? "landscape" : "portrait"}
        //     // console.log(width,height);
        //     // const scalew=(width>2480)?(width+25)/2480:1;
        //     // const scaleh=(height>2480)?(height+25)/3508:1;
        //     const windwoCss = `
        //     <style>@media print {
        //      @page {
        //         size:auto;
        //         margin-left:0mm;
        //         margin-right: 0mm;
        //         margin-top: 0mm;
        //         margin-bottom: 0mm;
        //       }
        //     div{
        //         width:100%;
        //         height:100%;
        //         overflow: hidden;
        //     }
        //     img{
        //         width:${width}px;
        //         height:${height}px;
        //         object-fit:contain
        //     }
        // }
        //     }</style>
        //     `;
        //     const windowContent = windwoCss + `
        //          <div style=""> 
        //           <img src=${imgData}>
        //          </div>
        //     `;
        //     const elt = document.createElement("div");
        //     elt.innerHTML = windowContent;
        //     printWin.document.open();
        //     await printWin.document.write(elt.outerHTML);
        //     printWin.document.close();
        //     printWin.focus();
        //     printWin.print();
        //     printWin.close();
    };
    exports.saveGraphAsPdf = saveGraphAsPdf;
    /**
     * Function to convert a svg to png file
     * @param svgURI
     * @param svgBoundingBox
     * @returns
     */
    const convertSVGToPng = (svgURI, svgBoundingBox) => new Promise((resolve, reject) => {
        const svgDataBase64 = btoa(decodeURIComponent(svgURI)); // convert svg to Base64
        const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`;
        const image = new Image();
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = svgBoundingBox.w;
        canvas.height = svgBoundingBox.h;
        image.addEventListener('load', () => {
            context === null || context === void 0 ? void 0 : context.drawImage(image, svgBoundingBox.x, svgBoundingBox.y, svgBoundingBox.w, svgBoundingBox.h);
            resolve(canvas.toDataURL('image/png'));
        });
        image.addEventListener('error', (error) => {
            reject(error);
        });
        image.setAttribute("src", svgDataUrl); // triggers the load event
    });
    exports.convertSVGToPng = convertSVGToPng;
    /**
     * Function to copy a png image to clipboard
     * @param dataUrl
     * @returns
     */
    const copyPngToClipBoard = async (dataUrl) => {
        if (!dataUrl)
            return;
        const data = await fetch(dataUrl);
        const blob = await data.blob();
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            console.log("Graph copied to clipboard");
        }
        catch (error) {
            console.log("error", error);
        }
    };
    exports.copyPngToClipBoard = copyPngToClipBoard;
    /**
     * Function to convert a list of graph elements to Json Object
     * @param listOfgraphElts
     * @returns
     */
    const convertGraphEltsListToJsonObject = (listOfgraphElts) => {
        const objectId = new Date().getMilliseconds(); // use UWA.getUID()
        const diagramObjectContent = [];
        const modelObjectContent = [];
        for (let graphElt of listOfgraphElts) {
            if (graphElt instanceof Node_1.Node) {
                modelObjectContent.push({
                    "id": objectId + graphElt.id,
                    "type": graphElt.type,
                    "label": graphElt.label,
                    "parentID": (graphElt instanceof Node_1.Node && graphElt.parentId) ? (objectId + graphElt.parentId) : "",
                    "data": graphElt.data
                });
                diagramObjectContent.push({
                    "id": objectId + graphElt.id + "_graphical",
                    "modelElt": objectId + graphElt.id,
                    "position": graphElt.position,
                    "width": graphElt.width,
                    "height": graphElt.height,
                    "color": graphElt.color,
                });
            }
            if (graphElt instanceof Link_1.Link) {
                modelObjectContent.push({
                    "id": objectId + graphElt.id,
                    "type": graphElt.type,
                    "label": graphElt.label,
                    "sourceID": objectId + graphElt.sourceID,
                    "targetID": objectId + graphElt.targetID
                });
                diagramObjectContent.push({
                    "id": objectId + graphElt.id + "_graphical",
                    "width": graphElt.width,
                    "height": graphElt.height,
                    "labelOffset": graphElt.labelOffset,
                    "modelElt": objectId + graphElt.id,
                    "sourceSide": graphElt.sourceSide,
                    "targetSide": graphElt.targetSide,
                    "wayPoints": graphElt.wayPoints,
                    "color": graphElt.color,
                });
            }
        }
        return {
            id: objectId.toString(),
            schema: "2.0",
            date: new Date().toDateString(),
            name: `diagram_${objectId}`,
            model: modelObjectContent,
            diagram: diagramObjectContent
        };
    };
    exports.convertGraphEltsListToJsonObject = convertGraphEltsListToJsonObject;
    /**
     * Function to convert a Json Object to a list of graph elements
     * @param JSONObject
     * @returns
     */
    const convertJsonObjectToGraphEltsList = (JSONObject) => {
        const modelList = JSONObject.model;
        if (typeof modelList === "undefined")
            return [];
        const diagramList = JSONObject.diagram;
        const graphEltsList = [];
        for (let j = 0; j < modelList.length; j++) {
            const diagramElt = typeof diagramList !== "undefined" && diagramList !== null ? diagramList.find((elt) => elt.modelElt === modelList[j].id) : undefined;
            if (StaticAttributes_1.nodeTypes.includes(modelList[j].type)) { // fill node props
                if (typeof diagramElt !== "undefined" && ((0, DELGraphEditortypes_1.isNodeModelSchema)(modelList[j]))) {
                    let { id, type, label, parentID, data } = modelList[j];
                    id = (0, exports.sanitizeId)(id);
                    parentID = (0, exports.sanitizeId)(parentID);
                    const { position, width, height, color } = diagramElt;
                    const nodeInstance = new Node_1.Node(id, type, label, position, width, height);
                    nodeInstance.color = color;
                    nodeInstance.parentId = parentID;
                    if (data)
                        nodeInstance.data = data;
                    graphEltsList.push(nodeInstance);
                }
                else {
                    let { id, type, label, parentID, data } = modelList[j];
                    id = (0, exports.sanitizeId)(id);
                    parentID = (0, exports.sanitizeId)(parentID);
                    const dimension = StaticAttributes_1.nodeDimensionsSet.get(type);
                    const [width, height] = dimension ? dimension : [0, 0];
                    const nodeInstance = new Node_1.Node(id, type, label, { x: 0, y: 0 }, width, height);
                    nodeInstance.parentId = parentID;
                    if (data)
                        nodeInstance.data = data;
                    graphEltsList.push(nodeInstance);
                }
            }
            if (StaticAttributes_1.linkTypes.includes(modelList[j].type)) { // fill link props
                if (typeof diagramElt !== "undefined") {
                    let { id, type, label, sourceID, targetID } = modelList[j];
                    id = (0, exports.sanitizeId)(id);
                    sourceID = (0, exports.sanitizeId)(sourceID);
                    targetID = (0, exports.sanitizeId)(targetID);
                    const { width, height, sourceSide, targetSide, color, wayPoints, labelOffset } = diagramElt;
                    const sourceNode = modelList.find((elt) => StaticAttributes_1.nodeTypes.includes(elt.type) && (0, exports.sanitizeId)(elt.id) === sourceID);
                    const targetNode = modelList.find((elt) => StaticAttributes_1.nodeTypes.includes(elt.type) && (0, exports.sanitizeId)(elt.id) === targetID);
                    if (typeof sourceNode !== "undefined" && typeof targetNode !== "undefined") {
                        const linkInstance = new Link_1.Link(id, type, label, sourceID, targetID);
                        if (labelOffset) {
                            linkInstance.labelOffset = labelOffset;
                            linkInstance.updatePosition();
                        }
                        linkInstance.wayPoints = wayPoints ? structuredClone(wayPoints) : [{ x: 0, y: 0 }, { x: StaticAttributes_1.gridStep, y: 0 }];
                        linkInstance.shadowEltWayPoints = wayPoints ? structuredClone(wayPoints) : [{ x: 0, y: 0 }, { x: StaticAttributes_1.gridStep, y: 0 }];
                        if (width)
                            linkInstance.width = width;
                        if (height)
                            linkInstance.height = height;
                        if (sourceSide)
                            linkInstance.sourceSide = sourceSide;
                        if (targetSide)
                            linkInstance.targetSide = targetSide;
                        if (color)
                            linkInstance.color = color;
                        graphEltsList.push(linkInstance);
                    }
                    else {
                        console.error(`Error: sourceNode/targetNode are not found for ${id}`);
                    }
                }
                else {
                    let { id, type, label, sourceID, targetID } = modelList[j];
                    id = (0, exports.sanitizeId)(id);
                    sourceID = (0, exports.sanitizeId)(sourceID);
                    targetID = (0, exports.sanitizeId)(targetID);
                    const sourceNode = modelList.find((elt) => StaticAttributes_1.nodeTypes.includes(elt.type) && (0, exports.sanitizeId)(elt.id) === sourceID);
                    const targetNode = modelList.find((elt) => StaticAttributes_1.nodeTypes.includes(elt.type) && (0, exports.sanitizeId)(elt.id) === targetID);
                    if (typeof sourceNode !== "undefined" && typeof targetNode !== "undefined") {
                        const linkInstance = new Link_1.Link(id, type, label, sourceID, targetID);
                        [linkInstance.sourceSide, linkInstance.targetSide] = ["East", "West"];
                        linkInstance.wayPoints = [{ x: 0, y: 0 }, { x: StaticAttributes_1.gridStep, y: 0 }];
                        graphEltsList.push(linkInstance);
                    }
                    else {
                        console.error(`Error: sourceNode/targetNode are not found for ${id}`);
                    }
                }
            }
        }
        return graphEltsList;
    };
    exports.convertJsonObjectToGraphEltsList = convertJsonObjectToGraphEltsList;
    /**
     * Function to save a graph as json file
     * @param listOfgraphElts list of graph elements
     */
    const saveGraphAsJson = (listOfgraphElts) => {
        const jsonGraph = (0, exports.convertGraphEltsListToJsonObject)(listOfgraphElts);
        const blob = new Blob([JSON.stringify(jsonGraph)], {
            type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute('href', encodeURI(url));
        link.setAttribute('download', `${jsonGraph.name}.json`);
        link.click();
        // clean up
        window.URL.revokeObjectURL(url);
    };
    exports.saveGraphAsJson = saveGraphAsJson;
    /**
     * Function to read file
     * @param file
     * @returns
     */
    const readFile = (file) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = (readerEvent) => {
                if (readerEvent.target) {
                    resolve(JSON.parse(reader.result));
                }
            };
            reader.onerror = () => {
                reject('error');
            };
            reader.readAsText(file);
        });
    };
    exports.readFile = readFile;
    const sleep = (duration = 100) => {
        return new Promise(resolve => setTimeout(resolve, duration));
    };
    exports.sleep = sleep;
});
