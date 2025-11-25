/// <amd-module name="DS/DELSwimLaneChart_v2/utils/LayoutUtils"/>
define("DS/DELSwimLaneChart_v2/utils/LayoutUtils", ["require", "exports", "DS/DELSwimLaneChart_v2/utils/StaticAttributes"], function (require, exports, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyStyle = exports.checkRectangleIntersection = exports.convertImageToBase64 = exports.convertHtmlToImg = exports.saveGraphAsSVGImage = exports.handleZoom = exports.convertToGridCoord = exports.normalizePosition = void 0;
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
    const convertToGridCoord = (coord) => {
        return Math.round(coord / StaticAttributes_1.gridStep) * StaticAttributes_1.gridStep;
    };
    exports.convertToGridCoord = convertToGridCoord;
    /**
     * Function to compute the new value of the transformation vector after a zoom (in/out)
     * @param pointerCoord the pointer coordinates
     * @param transformVector the Vector of the applied transformation (translation,scale)
     * @param offset the  grid left and top offset with respect to the current window
     * @returns the computed transformation Vector
     */
    const handleZoom = (wheelCoord, transformVector, offset) => {
        const zoomIntensity = 0.05;
        const relativeMousePosx = wheelCoord.clientX - offset[0];
        const relativeMousePosy = wheelCoord.clientY - offset[1];
        const wheel = wheelCoord.deltaY < 0 ? 1 : -1; // normalize
        let newscale = Math.exp(wheel * zoomIntensity) * transformVector[2];
        newscale = Math.min(Math.max(1, newscale), 8); // set scale limits
        const scaleChange = newscale / transformVector[2];
        const tr0 = relativeMousePosx - (relativeMousePosx - transformVector[0]) * scaleChange;
        const tr1 = relativeMousePosy - (relativeMousePosy - transformVector[1]) * scaleChange;
        return [tr0, tr1, newscale];
    };
    exports.handleZoom = handleZoom;
    /**
    * Function to save a svg
    * @param svgURI the encoded svg uri
    */
    const saveGraphAsSVGImage = (svgURI) => {
        const a = document.createElement("a");
        a.href = 'data:image/svg+xml;charset=utf-8,' + svgURI;
        a.download = "SwimlaneChart.svg";
        a.click();
        return a.href;
    };
    exports.saveGraphAsSVGImage = saveGraphAsSVGImage;
    /**
    * Function to convert an html element to image
    * @param svgURI
    * @param svgBoundingBox
    * @returns
    */
    const convertHtmlToImg = (HTMLElement, svgBoundingBox) => new Promise((resolve, reject) => {
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgElement.setAttribute("viewBox", `${svgBoundingBox.x} ${svgBoundingBox.y} ${svgBoundingBox.w} ${svgBoundingBox.h}`);
        svgElement.setAttribute('width', svgBoundingBox.w + "");
        svgElement.setAttribute('height', svgBoundingBox.h + "");
        // Use innerHTML to set the SVG content
        svgElement.innerHTML = HTMLElement;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        canvas.width = svgBoundingBox.w;
        canvas.height = svgBoundingBox.h;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'use-credentials';
        img.onload = () => {
            // ctx?.scale(1,1);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png', 1));
        };
        img.onerror = () => {
            reject();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    });
    exports.convertHtmlToImg = convertHtmlToImg;
    const convertImageToBase64 = (imageElement, svgBoundingBox) => {
        const canvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = svgBoundingBox.w * dpr;
        canvas.height = svgBoundingBox.h * dpr;
        const ctx = canvas.getContext('2d');
        imageElement.crossOrigin = 'use-credentials';
        ctx === null || ctx === void 0 ? void 0 : ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(imageElement, 0, 0, svgBoundingBox.w, svgBoundingBox.h);
        try {
            const base64String = canvas.toDataURL("image/png");
            return base64String;
        }
        catch (error) {
            console.error("CORS restrictions prevent canvas extraction", error);
            return "";
        }
    };
    exports.convertImageToBase64 = convertImageToBase64;
    /**
     * Function to check intersection between two rectangles
     * @param firstRectdimensions
     * @param secondRectdimensions
     * @returns
     */
    const checkRectangleIntersection = (firstRectdimensions, secondRectdimensions) => {
        const [x1, y1, w1, h1] = [firstRectdimensions.x, firstRectdimensions.y, firstRectdimensions.w, firstRectdimensions.h];
        const [x2, y2, w2, h2] = [secondRectdimensions.x, secondRectdimensions.y, secondRectdimensions.w, secondRectdimensions.h];
        return !((x1 + w1 < x2 || (y1 > y2 + h2 || y1 + h1 < y2)) || (x2 + w2 < x1 || (y2 > y1 + h1 || y2 + h2 < y1)) || (y1 + h1 < y2 || (x2 > x1 + w1 || x2 + w2 < x1)) || (y2 + h2 < y1 || (x1 > x2 + w2 || x1 + w1 < x2)));
    };
    exports.checkRectangleIntersection = checkRectangleIntersection;
    const applyStyle = (el) => {
        // const defaultValues=["unset","none","auto","normal","0px","0%","read-only"];
        // const mostUsedProps = [ "Display", "Position", "Margin", "fill","Padding", "Width", "Height", "Background", "Border", "Box-sizing", "Text-align", "Font-family", "Font-size", "Color", "Overflow", "Flexbox", "Grid", "Z-index", "Opacity", "Transform", "Transition"];
        const element = document.getElementById(el.id);
        if (!element)
            return;
        const childElements = el.querySelectorAll("*");
        const orChildElements = element.querySelectorAll("*");
        for (let i = 0; i < childElements.length; i++) {
            if (!orChildElements[i])
                continue;
            const computedStyles = getComputedStyle(orChildElements[i]);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            for (const property of computedStyles) {
                const computedStyle = computedStyles.getPropertyValue(property);
                if (childElements[i] && orChildElements[i])
                    childElements[i].style[property] = computedStyle;
            }
        }
    };
    exports.applyStyle = applyStyle;
});
