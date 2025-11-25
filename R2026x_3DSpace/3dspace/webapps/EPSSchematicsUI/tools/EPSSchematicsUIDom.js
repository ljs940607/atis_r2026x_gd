/// <amd-module name='DS/EPSSchematicsUI/tools/EPSSchematicsUIDom'/>
define("DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphUtils", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools"], function (require, exports, EgraphUtils, UIWUXTools, UITools) {
    "use strict";
    class UIDom {
        /**
         * @member {string} The standard SVG namespace.
         */
        static { this.svgNS = 'http://www.w3.org/2000/svg'; }
        /**
         * Adds the given className to the provided element.
         * @public
         * @static
         * @param {Element|SVGElement|undefined} element - The Element or SVG Element.
         * @param {string|Array<string>} className - The className or list of className to add.
         */
        static addClassName(element, className) {
            if (element !== undefined && className !== undefined && className !== '') {
                let list = Array.isArray(className) ? this.flatDeep(className) : [className];
                list = list.filter(name => name !== undefined && name !== '');
                list.forEach(name => EgraphUtils.classListAdd(element, name));
            }
        }
        /**
         * Removes the given className from the provided element.
         * @public
         * @static
         * @param {Element|SVGElement|undefined} element - The Element or SVG Element.
         * @param {string|Array<string>} className - The className or list of className to remove.
         */
        static removeClassName(element, className) {
            if (element !== undefined && className !== undefined && className !== '') {
                const list = Array.isArray(className) ? className : [className];
                list.forEach(name => EgraphUtils.classListRemove(element, name));
            }
        }
        /**
         * Toggles the given className from the provided element.
         * @public
         * @static
         * @param {Element|SVGElement|undefined} element - The Element or SVG Element.
         * @param {string|Array<string>} className - The className or list of className.
         */
        static toggleClassName(element, className) {
            if (element !== undefined && className !== undefined && className !== '') {
                const list = Array.isArray(className) ? className : [className];
                list.forEach(name => {
                    const fct = this.hasClassName(element, name) ? this.removeClassName : this.addClassName;
                    fct(element, name);
                });
            }
        }
        /**
         * Checks if the provided element has the given className.
         * @public
         * @static
         * @param {Element|SVGElement|undefined} element - The Element or SVG Element.
         * @param {string|Array<string>} className - The className or list of className.
         * @returns {boolean} True if the element has the className else false.
         */
        static hasClassName(element, className) {
            let result = false;
            if (element !== undefined) {
                const list = Array.isArray(className) ? className : [className];
                for (let l = 0; l < list.length; l++) {
                    result = EgraphUtils.classListContains(element, list[l]);
                    if (!result) {
                        break;
                    }
                }
            }
            return result;
        }
        /**
         * Merges multiple className into one array.
         * @public
         * @static
         * @param {string|Array<string>} className1 - The className or list of className.
         * @param {string|Array<string>} [className2] - The className or list of className.
         * @returns {Array<string>} The merged className.
         */
        static mergeClassName(className1, className2 = []) {
            let className = this.flatDeep([className1, className2]);
            return className;
        }
        /**
         * Clears the className of the provided element.
         * @public
         * @static
         * @param {Element|SVGElement} element - The Element or SVG Element.
         */
        static clearClassName(element) {
            if (element) {
                element.setAttribute('class', '');
            }
        }
        /**
         * Deep flats the provided array.
         * TODO: Array.flat not available in TS2.5!
         * @private
         * @static
         * @param {Array<*>} arr - The array to flat.
         * @returns {Array<*>} The flatten array.
         */
        static flatDeep(arr) {
            return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val), []);
        }
        /**
         * Gets the element bounding box including its margin, padding and border.
         * @public
         * @static
         * @param {Element} element - The element.
         * @returns {IDOMRect} The element computed style bounding box.
         */
        static getComputedStyleBBox(element) {
            let bbox = { width: 0, height: 0 };
            if (element instanceof HTMLElement) {
                const style = window.getComputedStyle(element);
                let eltWidth = parseFloat(style.width);
                if (element.textContent !== null && element.textContent !== undefined && element.textContent !== '') {
                    eltWidth = UIDom.computeTextWidth(element.textContent, this.getFontFromStyle(style));
                }
                const eltMarginWidth = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
                const eltPaddingWidth = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
                const eltBorderWidth = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
                const eltMinWidth = parseFloat(style.minWidth);
                bbox.width = eltWidth + eltMarginWidth + eltPaddingWidth + eltBorderWidth;
                bbox.width = eltMinWidth > 0 && bbox.width < eltMinWidth ? eltMinWidth : bbox.width;
                const eltHeight = parseFloat(style.height);
                const eltMarginHeight = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
                const eltPaddingHeight = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
                const eltBorderHeight = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
                const eltMinHeight = parseFloat(style.minHeight);
                bbox.height = eltHeight + eltMarginHeight + eltPaddingHeight + eltBorderHeight;
                bbox.height = eltMinHeight > 0 && bbox.height < eltMinHeight ? eltMinHeight : bbox.height;
            }
            return bbox;
        }
        /**
         * Gets the font declaration from the diven CSS style declaration.
         * This is a workaround for Firefox only regression that causes style.font to be empty! (Chrome supports it!)
         * @private
         * @param {CSSStyleDeclaration} style - The CSS style declaration.
         * @returns {string} The font declaration.
         */
        static getFontFromStyle(style) {
            const fontStyle = style.getPropertyValue('font-style');
            const fontVariant = style.getPropertyValue('font-variant');
            const fontWeight = style.getPropertyValue('font-weight');
            const fontSize = style.getPropertyValue('font-size');
            const fontFamily = style.getPropertyValue('font-family');
            const font = (fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily).replace(new RegExp(' +', 'g'), ' ').trim();
            return font;
        }
        /**
         * Computes the text width.
         * @public
         * @static
         * @param {string} text - The text.
         * @param {string} font - The font.
         * @returns {number} The text width.
         */
        static computeTextWidth(text, font) {
            let width = NaN;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
                context.font = font;
                width = context.measureText(text).width;
            }
            return width;
        }
        /**
         * Gets the html element borders width.
         * @public
         * @static
         * @param {HTMLElement} element - The html element.
         * @returns {IDOMRect} The html element computed style border width.
         */
        static getComputedStyleBorderWidth(element) {
            let border = { left: 0, right: 0, top: 0, bottom: 0 };
            if (element instanceof HTMLElement) {
                const style = window.getComputedStyle(element);
                border.left = parseFloat(style.borderLeftWidth);
                border.right = parseFloat(style.borderRightWidth);
                border.top = parseFloat(style.borderTopWidth);
                border.bottom = parseFloat(style.borderBottomWidth);
            }
            return border;
        }
        /**
         * Gets the computed style of the element.
         * @public
         * @static
         * @param {Element} element - The element to get the style from.
         * @param {string} styleName - The name of the style to get.
         * @returns {string} The computed style.
         */
        static getComputedStyle(element, styleName) {
            let style = '';
            if (element instanceof Element) {
                const dashed = UITools.camelCaseToDashed(styleName);
                style = window.getComputedStyle(element).getPropertyValue(dashed);
            }
            return style;
        }
        /**
         * Gets the html element minimum dimension.
         * @public
         * @static
         * @param {HTMLElement} element - The html element.
         * @returns {IDOMRect} The html element computed style minimum dimension.
         */
        static getComputedStyleMinDimension(element) {
            let minDimension = { width: 0, height: 0 };
            if (element instanceof HTMLElement) {
                const style = window.getComputedStyle(element);
                minDimension.width = parseFloat(style.minWidth);
                minDimension.height = parseFloat(style.minHeight);
            }
            return minDimension;
        }
        /**
         * Creates a new DOM element.
         * @public
         * @static
         * @param {string} tagName - The element tag name.
         * @param {IDomOptions} [options] - The creation options.
         * @returns {Element} The created DOM element.
         */
        static createElement(tagName, options) {
            const element = document.createElement(tagName);
            return this.applyOptions(element, options);
        }
        /**
         * Creates an SVG circle.
         * @public
         * @static
         * @param {ISVGCircleOptions} [options] - The creation options.
         * @returns {SVGCircleElement} The SVG circle.
         */
        static createSVGCircle(options) {
            const element = document.createElementNS(this.svgNS, 'circle');
            return this.applyOptions(element, options);
        }
        /**
         * Creates an SVG element.
         * @public
         * @static
         * @param {IDomOptions} [options] - The creation options.
         * @returns {SVGSVGElement} The SVG element.
         */
        static createSVGElement(options) {
            const element = document.createElementNS(this.svgNS, 'svg');
            return this.applyOptions(element, options);
        }
        /**
         * Creates an SVG group.
         * @public
         * @static
         * @param {IDomOptions} [options] - The creation options.
         * @returns {SVGGElement} The SVG group.
         */
        static createSVGGroup(options) {
            const element = document.createElementNS(this.svgNS, 'g');
            return this.applyOptions(element, options);
        }
        /**
         * Creates an SVG line.
         * @public
         * @static
         * @param {ISVGLineOptions} [options] - The creation options.
         * @returns {SVGLineElement} The SVG line.
         */
        static createSVGLine(options) {
            const element = document.createElementNS(this.svgNS, 'line');
            return this.applyOptions(element, options);
        }
        /**
         * Creates an SVG path.
         * @public
         * @static
         * @param {ISVGPathOptions} [options] - The creation options.
         * @returns {SVGPathElement} The SVG path.
         */
        static createSVGPath(options) {
            const element = document.createElementNS(this.svgNS, 'path');
            return this.applyOptions(element, options);
        }
        /**
         * Creates an SVG polygon.
         * @public
         * @static
         * @param {ISVGPolygonOptions} [options] - The creation options.
         * @returns {SVGPolygonElement} The SVG polygon.
         */
        static createSVGPolygon(options) {
            const element = document.createElementNS(this.svgNS, 'polygon');
            return this.applyOptions(element, options);
        }
        /**
         * Creates an SVG rectangle.
         * @public
         * @static
         * @param {ISVGRectOptions} [options] - The creation options.
         * @returns {SVGRectElement} The SVG rectangle.
         */
        static createSVGRect(options) {
            const element = document.createElementNS(this.svgNS, 'rect');
            return this.applyOptions(element, options);
        }
        /**
         * Creates an SVG text.
         * @public
         * @static
         * @param {IDomOptions} [options] - The creation options.
         * @returns {SVGTextElement} The SVG text.
         */
        static createSVGText(options) {
            const element = document.createElementNS(this.svgNS, 'text');
            return this.applyOptions(element, options);
        }
        /**
         * Creates an SVG tspan element.
         * @public
         * @static
         * @param {ISVGTSpanOptions} [options] - The creation options.
         * @returns {SVGTSpanElement} The SVG tspan element.
         */
        static createSVGTSpan(options) {
            const element = document.createElementNS(this.svgNS, 'tspan');
            return this.applyOptions(element, options);
        }
        /**
         * Transforms the provided SVG shape.
         * @public
         * @static
         * @param {SVGGraphicsElement} shape - The SVG shape element.
         * @param {number} x - The x translate value.
         * @param {number} y - The y translate value.
         * @param {number} r - The r rotate value.
         */
        static transformSVGShape(shape, x = 0, y = 0, r = 0) {
            const svg = this.createSVGElement();
            let matrix = shape.getCTM();
            if (matrix === undefined || matrix === null) {
                matrix = svg.createSVGMatrix();
            }
            matrix = matrix.translate(x, y).rotate(r);
            const transform = svg.createSVGTransformFromMatrix(matrix);
            shape.transform.baseVal.appendItem(transform);
        }
        /**
         * Renders an offscreen SVG element in order to compute its bounding box and
         * get its rendered width and height.
         * @public
         * @static
         * @param {SVGElement} svgElt - The SVG Element to render.
         * @param {Array.<string>} [parentClassNames] - A list of parent classNames to add.
         * @returns {Object} The bounding box of the SVG Element.
         */
        static renderedSVGBBox(svgElt, parentClassNames) {
            let bbox = { width: 0, height: 0 };
            if (svgElt !== undefined) {
                let parent;
                const svgClone = svgElt.cloneNode(true);
                if (Array.isArray(parentClassNames)) {
                    for (let c = 0; c < parentClassNames.length; c++) {
                        const g = UIDom.createSVGGroup({ className: parentClassNames[c] });
                        if (parent !== undefined) {
                            parent.appendChild(g);
                        }
                        else {
                            parent = g;
                        }
                        if (c === parentClassNames.length - 1) {
                            g.appendChild(svgClone);
                        }
                    }
                }
                parent = parent || svgClone;
                svgClone.setAttribute('style', 'display:inline-block');
                svgClone.setAttribute('style', 'visibility:hidden');
                const svg = UIDom.createSVGElement();
                svg.appendChild(parent);
                document.body.appendChild(svg);
                const bCBox = svgClone.getBoundingClientRect();
                document.body.removeChild(svg);
                svg.removeChild(parent);
                bbox.width = bCBox.width;
                bbox.height = bCBox.height;
            }
            return bbox;
        }
        /**
         * Loads the CSS file with the specified path.
         * @public
         * @static
         * @param {string} path - The CSS file path to load.
         * @param {function} [callback] - The callback of the resource loaded event.
         */
        static loadCSS(path, callback) {
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = path;
            if (callback !== undefined && callback !== null) {
                link.onload = (e) => callback(e);
            }
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        /**
         * Loads the JS file with the specified path.
         * @public
         * @static
         * @param {string} path - The JS file path to load.
         * @param {function} callback - The callback of the resource loaded event.
         */
        static loadJS(path, callback) {
            let script = document.createElement('script');
            script.type = 'text/JavaScript';
            script.src = path;
            if (callback !== undefined && callback !== null) {
                script.onload = (e) => callback(e);
            }
            document.getElementsByTagName('head')[0].appendChild(script);
        }
        /**
         * Applies the provided options to the given element.
         * @public
         * @static
         * @param {IWUXElement} element - The element.
         * @param {IDomOptions} [options] - The creation options.
         * @returns {Element} The element.
         */
        static applyOptions(element, options) {
            if (element !== undefined && options !== undefined) {
                if (options.className !== undefined) {
                    this.addClassName(element, options.className);
                }
                if (options.children !== undefined) {
                    options.children.forEach(child => element.appendChild(child));
                }
                if (options.textContent !== undefined) {
                    element.textContent = options.textContent;
                }
                if (options.attributes !== undefined) {
                    for (const aProp in options.attributes) {
                        if (options.attributes.hasOwnProperty(aProp)) {
                            element.setAttribute(aProp, String(options.attributes[aProp]));
                        }
                    }
                }
                if (options.readOnly !== undefined && element instanceof HTMLInputElement) {
                    element.readOnly = options.readOnly;
                }
                if (options.style !== undefined && element instanceof HTMLElement) {
                    for (const sProp in options.style) {
                        if (options.style.hasOwnProperty(sProp)) {
                            const value = options.style[sProp];
                            element.style.setProperty(sProp, value);
                        }
                    }
                }
                if (options.tooltipInfos !== undefined) {
                    element.tooltipInfos = UIWUXTools.createTooltip(options.tooltipInfos);
                }
                if (options.innerHTML !== undefined) {
                    element.innerHTML = options.innerHTML;
                }
                if (options.onclick !== undefined && element instanceof HTMLElement) {
                    //element.onclick = (e) => options.onclick(e);
                    element.onclick = options.onclick;
                }
                if (element instanceof HTMLElement || element instanceof SVGElement) {
                    element.onanimationend = options.onanimationend || null;
                }
                if (options.parent !== undefined) {
                    if (options.insertBefore !== undefined) {
                        options.parent.insertBefore(element, options.insertBefore);
                    }
                    else {
                        options.parent.appendChild(element);
                    }
                }
            }
            return element;
        }
        /**
         * Computes the distance of an element from the mouse.
         * @protected
         * @param {Element} element - The element to compute the distance from.
         * @param {number} mouseLeft - The left position of the mouse.
         * @param {number} mouseTop - The top position of the mouse.
         * @returns {number} The distance between the mouse cursor and the element.
         */
        static computeDistanceFromMouse(element, mouseLeft, mouseTop) {
            let distance = 0;
            let distLeft = 0;
            let distTop = 0;
            const elementBbox = element.getBoundingClientRect();
            const left = elementBbox.left;
            const top = elementBbox.top;
            const width = elementBbox.width;
            const height = elementBbox.height;
            if (mouseLeft <= left) {
                distLeft = left - mouseLeft;
            }
            else if (mouseLeft >= (left + width)) {
                distLeft = mouseLeft - (left + width);
            }
            if (mouseTop >= (top + height)) {
                distTop = mouseTop - (top + height);
            }
            else if (mouseTop <= top) {
                distTop = top - mouseTop;
            }
            distance = Math.sqrt((distLeft * distLeft) + (distTop * distTop));
            return distance;
        }
    }
    return UIDom;
});
