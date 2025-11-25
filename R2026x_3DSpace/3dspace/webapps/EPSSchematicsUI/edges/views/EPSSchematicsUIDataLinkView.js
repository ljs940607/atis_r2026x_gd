/// <amd-module name='DS/EPSSchematicsUI/edges/views/EPSSchematicsUIDataLinkView'/>
define("DS/EPSSchematicsUI/edges/views/EPSSchematicsUIDataLinkView", ["require", "exports", "DS/EPSSchematicsUI/edges/views/EPSSchematicsUILinkView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/geometries/EPSSchematicsUIDataLinkGeometry", "DS/EPSSchematicsUI/data/EPSSchematicsUIShapes", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "css!DS/EPSSchematicsUI/css/edges/EPSSchematicsUIDataLink"], function (require, exports, UILinkView, UIDom, UIDataLinkGeometry, UIShapes, UINLS, ModelEnums, TypeLibrary) {
    "use strict";
    /**
     * This class defines a UI data link view.
     * @private
     * @class UIDataLinkView
     * @alias module:DS/EPSSchematicsUI/edges/views/EPSSchematicsUIDataLinkView
     * @extends UILinkView
     */
    class UIDataLinkView extends UILinkView {
        /**
         * @public
         * @constructor
         * @param {UIDataLink} link - The UI data link instance.
         * @param {boolean} [forceMaximizedState=false] - True if the data link must be maximized.
         */
        constructor(link, forceMaximizedState = false) {
            super(link, 'sch-data-link-path');
            this._isMinimizedLinkCreated = false;
            this._forceMaximizedState = forceMaximizedState;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the center position of the link view element.
         * @public
         * @returns {IDomPosition} The left and top center position of the link view element.
         */
        getCenterPosition() {
            const elt = this._link.getDisplay();
            let sx, sy, tx, ty, dx, dy, cx, cy;
            sx = elt.cl1.c.aleft;
            sy = elt.cl1.c.atop;
            tx = elt.cl2.c.aleft;
            ty = elt.cl2.c.atop;
            dx = Math.abs(tx - sx);
            dy = Math.abs(ty - sy);
            cx = (sx < tx) ? sx + (dx / 2) : tx + (dx / 2);
            cy = (sy < ty) ? sy + (dy / 2) : ty + (dy / 2);
            return { left: cx, top: cy };
        }
        /**
         * The callback on the cast level change event of a data link.
         * @public
         */
        onCastLevelChange() {
            this._updateCastLevelDisplay();
            this._updateMinimizedCastLevelIcon();
        }
        /**
         * Updates the minimized link state.
         * @public
         * @param {boolean} minimizedState - The minimized state.
         */
        updateMinimizedLinkState(minimizedState) {
            if (minimizedState) {
                this._createMinimizedLink();
                this._updateMinimizedCastLevelIcon();
                this._updateMinimizedLinkPosition();
            }
            else {
                this._removeMinimizedLink();
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the link view.
         * @protected
         * @override
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view that called this callback.
         */
        ondestroyDisplay(elt, grView) {
            this._removeMinimizedLink();
            this._forceMaximizedState = undefined;
            this._castLevel = undefined;
            this._dottedPathClone = undefined;
            this._isMinimizedLinkCreated = false;
            this._topMinimizedLink = undefined;
            this._bottomMinimizedLink = undefined;
            this._minimizedCastLevelIcon = undefined;
            super.ondestroyDisplay(elt, grView);
        }
        /**
         * Creates the link view.
         * @protected
         * @override
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view that called this callback.
         */
        oncreateDisplay(elt, grView) {
            super.oncreateDisplay(elt, grView);
            UIDom.addClassName(this.structure.root, 'sch-data-link');
            this.updateMinimizedLinkState(!this._forceMaximizedState);
            this._updateCastLevelDisplay();
            this._createDottedPathClone();
        }
        /**
         * The callback to apply modified properties to the display.
         * @protected
         * @override
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.PathSetTrie} changes - Set of paths of modified properties.
         * @param {EGraphCore.GraphView} grView - The graph view that called this callback.
         */
        onmodifyDisplay(elt, changes, grView) {
            super.onmodifyDisplay(elt, changes, grView);
            this._updateCastLevelPosition();
            this._updateMinimizedLinkPosition();
            this._syncDottedPathClone();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Creates the minimized link.
         * @private
         */
        _createMinimizedLink() {
            if (this._isMinimizedLinkCreated === false) {
                const topLine = UIDom.createSVGLine({ attributes: { x1: 0, y1: 0, x2: 0, y2: UIDataLinkGeometry.K_MINIMIZEDLINKLENGTH } });
                const topCircle = UIDom.createSVGCircle({ attributes: { cx: 0, cy: UIDataLinkGeometry.K_MINIMIZEDLINKLENGTH + 1, r: 1 } });
                this._topMinimizedLink = UIDom.createSVGGroup({
                    className: 'sch-data-link-minimizedpath',
                    attributes: { transform: 'matrix(1 0 0 1 0 0)' },
                    parent: this.structure.root,
                    children: [topLine, topCircle]
                });
                this.display.topMinimizedLink = this._topMinimizedLink;
                this.display.topMinimizedLink.grElt = this._link.getDisplay();
                this.display.topMinimizedLink.subElt = 'topMinimizedLink';
                const bottomLine = UIDom.createSVGLine({ attributes: { x1: 0, y1: 0, x2: 0, y2: -UIDataLinkGeometry.K_MINIMIZEDLINKLENGTH } });
                this._bottomMinimizedLink = UIDom.createSVGGroup({
                    className: 'sch-data-link-minimizedpath',
                    attributes: { transform: 'matrix(1 0 0 1 0 0)' },
                    parent: this.structure.root,
                    children: [bottomLine]
                });
                this.display.bottomMinimizedLink = this._bottomMinimizedLink;
                this.display.bottomMinimizedLink.grElt = this._link.getDisplay();
                this.display.bottomMinimizedLink.subElt = 'bottomMinimizedLink';
            }
            this._isMinimizedLinkCreated = true;
            UIDom.addClassName(this.structure.root, 'minimized');
        }
        /**
         * Removes the minimized link.
         * @private
         */
        _removeMinimizedLink() {
            if (this._isMinimizedLinkCreated === true) {
                if (this._topMinimizedLink !== undefined) {
                    this.structure.root.removeChild(this._topMinimizedLink);
                    this._topMinimizedLink = undefined;
                    this.display.topMinimizedLink = undefined;
                }
                if (this._bottomMinimizedLink !== undefined) {
                    this.structure.root.removeChild(this._bottomMinimizedLink);
                    this._bottomMinimizedLink = undefined;
                    this._minimizedCastLevelIcon = undefined;
                    this.display.bottomMinimizedLink = undefined;
                }
            }
            this._isMinimizedLinkCreated = false;
            UIDom.removeClassName(this.structure.root, 'minimized');
        }
        /**
         * Updates the minimized cast level icon.
         * @private
         */
        _updateMinimizedCastLevelIcon() {
            if (this._isMinimizedLinkCreated === true) {
                if (this._minimizedCastLevelIcon !== undefined) {
                    this._bottomMinimizedLink?.removeChild(this._minimizedCastLevelIcon);
                }
                this._minimizedCastLevelIcon = UIDom.createSVGCircle({ attributes: { cx: 0, cy: -UIDataLinkGeometry.K_MINIMIZEDLINKLENGTH - 1, r: 1 } });
                const castLevel = this._getCastLevel();
                if (castLevel !== ModelEnums.ECastLevel.eNoCast) {
                    if (castLevel === ModelEnums.ECastLevel.eLossless) {
                        this._minimizedCastLevelIcon = UIDom.createSVGRect({
                            attributes: { x: -1, y: -12, width: 2, height: 2 }
                        });
                    }
                    else if (castLevel === ModelEnums.ECastLevel.eLossy || castLevel === ModelEnums.ECastLevel.eUnsafe) {
                        this._minimizedCastLevelIcon = UIDom.createSVGRect({
                            attributes: { x: -1, y: -12, width: 2, height: 2 },
                            style: { fill: 'white' }
                        });
                    }
                    else if (castLevel === undefined) {
                        this._minimizedCastLevelIcon = UIDom.createSVGPath({
                            attributes: {
                                d: UIShapes.minimizedCastLevelCrossPathPoints,
                                transform: 'translate(-1.5,-12)'
                            }
                        });
                    }
                }
                this._bottomMinimizedLink?.appendChild(this._minimizedCastLevelIcon);
            }
        }
        /**
         * Updates the minimized link position.
         * @private
         */
        _updateMinimizedLinkPosition() {
            if (this._isMinimizedLinkCreated === true) {
                if (this._topMinimizedLink) {
                    const startPos = this._getPositionAtLength(0);
                    const topTransform = this._topMinimizedLink.transform.baseVal.getItem(0);
                    topTransform.matrix.e = startPos.left;
                    topTransform.matrix.f = startPos.top;
                }
                if (this._bottomMinimizedLink) {
                    const length = this._getLinkLength();
                    const endPos = this._getPositionAtLength(length);
                    const bottomTransform = this._bottomMinimizedLink.transform.baseVal.getItem(0);
                    bottomTransform.matrix.e = endPos.left;
                    bottomTransform.matrix.f = endPos.top;
                }
            }
        }
        /**
         * Updates the cast level position to be centered on the link's path.
         * @private
         */
        _updateCastLevelPosition() {
            if (this._castLevel !== undefined) {
                //const center = this.getCenterPosition(this.link.display);
                const length = this._getLinkLength();
                const center = this._getPositionAtLength(length - 20);
                const transform = this._castLevel.transform.baseVal.getItem(0);
                transform.matrix.e = center.left;
                transform.matrix.f = center.top;
            }
        }
        /**
         * Creates the clone dotted path display.
         * @private
         */
        _createDottedPathClone() {
            if (this._dottedPathClone === undefined) {
                this._dottedPathClone = UIDom.createSVGPath({
                    className: 'sch-data-link-dottedpath',
                    parent: this.structure.root
                });
                this.display.dottedPathClone = this._dottedPathClone;
                this.display.dottedPathClone.grElt = this._link.getDisplay();
                this.display.dottedPathClone.subElt = 'dottedPathClone';
            }
        }
        /**
         * Synchronizes the dotted path clone.
         * @private
         */
        _syncDottedPathClone() {
            if (this._dottedPathClone !== undefined) {
                const attribute = this.getPath().getAttribute('d');
                if (attribute) {
                    this._dottedPathClone.setAttribute('d', attribute);
                }
            }
        }
        /**
         * Updates the display of the link cast level.
         * @private
         */
        _updateCastLevelDisplay() {
            // Remove the previous cast level
            if (this._castLevel !== undefined) {
                this._castLevel.parentNode?.removeChild(this._castLevel);
                this._castLevel = undefined;
            }
            const castLevel = this._getCastLevel();
            if (castLevel !== ModelEnums.ECastLevel.eNoCast) {
                // Create the castLevel background
                const background = UIDom.createSVGPath({
                    className: 'sch-data-link-castlevelbackground',
                    attributes: { d: UIShapes.castLevelBackgroundPathPoints }
                });
                // Create the castLevel icon
                let iconPoints = '';
                let shortHelp = '';
                if (castLevel === ModelEnums.ECastLevel.eLossless) {
                    iconPoints = UIShapes.castLevelLossLessPathPoints;
                    shortHelp = UINLS.get('shortHelpCastLevelLossless');
                }
                else if (castLevel === ModelEnums.ECastLevel.eLossy) {
                    iconPoints = UIShapes.castLevelLossyPathPoints;
                    shortHelp = UINLS.get('shortHelpCastLevelLossy');
                }
                else if (castLevel === ModelEnums.ECastLevel.eUnsafe) {
                    iconPoints = UIShapes.castLevelLossyPathPoints;
                    shortHelp = UINLS.get('shortHelpCastLevelUnsafe');
                }
                else if (castLevel === undefined) {
                    iconPoints = UIShapes.castLevelInvalidPathPoints;
                    shortHelp = UINLS.get('shortHelpCastLevelInvalid');
                }
                const icon = UIDom.createSVGPath({
                    className: 'sch-data-link-castlevelicon',
                    attributes: { d: iconPoints }
                });
                // Create the castLevel element
                this._castLevel = UIDom.createSVGGroup({
                    className: 'sch-data-link-castlevel',
                    attributes: { transform: 'matrix(1 0 0 1 0 0) scale(0.1)' },
                    parent: this.structure.root,
                    children: [background, icon],
                    tooltipInfos: { shortHelp: shortHelp }
                });
                this.display.castLevel = this._castLevel;
                this.display.castLevel.grElt = this._link.getDisplay();
                this.display.castLevel.subElt = 'castLevel';
                this._updateCastLevelPosition();
            }
        }
        /**
         * Gets the link cast level.
         * @private
         * @returns {ECastLevel} The link cast level.
         */
        _getCastLevel() {
            const port1 = this._link.getDisplay().cl1.c.data.uiElement;
            const port2 = this._link.getDisplay().cl2.c.data.uiElement;
            return TypeLibrary.getCastLevel(this._link.getModel().getGraphContext(), port1.getModel().getValueType(), port2.getModel().getValueType());
        }
        /**
         * Gets the length of the link.
         * @private
         * @returns {number} The length of the link.
         */
        _getLinkLength() {
            return Math.floor(this.getPath().getTotalLength());
        }
        /**
         * Gets the position of the point at the specified link's length.
         * @private
         * @param {number} length - The length of the link where to get the point.
         * @returns {IDomPosition} The position on the link at the specified length.
         */
        _getPositionAtLength(length) {
            const position = { left: 0, top: 0 };
            if (this._getLinkLength() > 0) {
                const point = this.getPath().getPointAtLength(length);
                position.left = point.x;
                position.top = point.y;
            }
            return position;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                      ___  ____ _____                                           //
        //                                     / _ \|  _ \_   _|                                          //
        //                                    | | | | | | || |                                            //
        //                                    | |_| | |_| || |                                            //
        //                                     \___/|____/ |_|                                            //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the dotted path clone.
         * @private
         * @ignore
         * @returns {SVGPathElement|undefined} The dotted path clone.
         */
        _getDottedPathClone() {
            return this._dottedPathClone;
        }
        /**
         * Gets the view minimized link state.
         * @private
         * @ignore
         * @returns {boolean} True if the view display a minimized link else false.
         */
        _getMinimizedLinkState() {
            return this._isMinimizedLinkCreated;
        }
        /**
         * Gets the cast level element.
         * @private
         * @ignore
         * @returns {SVGGElement|undefined} The cast level element.
         */
        _getCastLevelElement() {
            return this._castLevel;
        }
        /**
         * Gets the minimized cast level icon element.
         * @private
         * @ignore
         * @returns {SVGElement|undefined} The minimized cast level icon element.
         */
        _getMinimizedCastLevelIconElement() {
            return this._minimizedCastLevelIcon;
        }
        /**
         * Gets the top minimized link element.
         * @private
         * @ignore
         * @returns {SVGElement|undefined} The top minimized link element.
         */
        _getTopMinimizedLinkElement() {
            return this._topMinimizedLink;
        }
        /**
         * Gets the bottom minimized link element.
         * @private
         * @ignore
         * @returns {SVGElement|undefined} The bottom minimized link element.
         */
        _getBottomMinimizedLinkElement() {
            return this._bottomMinimizedLink;
        }
    }
    return UIDataLinkView;
});
