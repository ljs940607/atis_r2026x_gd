/// <amd-module name='DS/EPSSchematicsUI/edges/views/EPSSchematicsUIControlLinkView'/>
define("DS/EPSSchematicsUI/edges/views/EPSSchematicsUIControlLinkView", ["require", "exports", "DS/EPSSchematicsUI/edges/views/EPSSchematicsUILinkView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/edges/EPSSchematicsUIControlLink"], function (require, exports, UILinkView, UIDom) {
    "use strict";
    /**
     * This class defines a UI control link view.
     * @private
     * @class UIControlLinkView
     * @alias module:DS/EPSSchematicsUI/edges/views/EPSSchematicsUIControlLinkView
     * @extends UILinkView
     */
    class UIControlLinkView extends UILinkView {
        /**
         * @public
         * @constructor
         * @param {UIControlLink} link - The UI control link.
         */
        constructor(link) {
            super(link, 'sch-control-link-path');
            this._onMouseMoveCB = this._onMouseMove.bind(this);
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
         * The callback on the control link wait count change event.
         * @public
         */
        onWaitCountChange() {
            this._updateFramesBreakDisplay();
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
            if (this.structure.root !== undefined && this.structure.root !== null) {
                this.structure.root.removeEventListener('mousemove', this._onMouseMoveCB);
            }
            this._waitCount = undefined;
            this._onMouseMoveCB = undefined;
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
            UIDom.addClassName(this.structure.root, 'sch-control-link');
            this._updateFramesBreakDisplay();
            this.structure.root.addEventListener('mousemove', this._onMouseMoveCB);
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
            this._updateFramesBreakPosition();
        }
        /**
         * The callback on the link view mouse enter event.
         * @protected
         * @override
         * @param {MouseEvent} event - The mouse enter event.
         */
        _onMouseEnter(event) {
            super._onMouseEnter(event);
            this._updateCursor(event.clientX, event.clientY);
        }
        /**
         * The callback on the link view mouse leave event.
         * @protected
         * @override
         */
        _onMouseLeave() {
            super._onMouseLeave();
            this._clearCursor();
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
         * The callback on the link view mouse move event.
         * @private
         * @param {MouseEvent} event - The mouse move event.
         */
        _onMouseMove(event) {
            this._updateCursor(event.clientX, event.clientY);
        }
        /**
         * Updates the mouse cursor on the link view.
         * @private
         * @param {number} clientX - The mouse x position.
         * @param {number} clientY - The mouse y position.
         */
        _updateCursor(clientX, clientY) {
            this._clearCursor();
            const mousePos = this._link.getParentGraph().getViewer().clientToViewpoint(clientX, clientY);
            const isVertical = this._link.getDisplay().geometry.isSegmentVertical(this._link.getDisplay(), mousePos[0], mousePos[1]);
            const isReadOnly = this._link.getGraph().getViewer().isReadOnly();
            if (isVertical !== undefined && !isReadOnly) {
                UIDom.addClassName(this.structure.root, isVertical ? 'vertical' : 'horizontal');
            }
        }
        /**
         * Clears the mouse cursor from the link view.
         * @private
         */
        _clearCursor() {
            UIDom.removeClassName(this.structure.root, ['vertical', 'horizontal']);
        }
        /**
         * Updates the frames break position to be centered on the link's path.
         * @private
         */
        _updateFramesBreakPosition() {
            if (this._waitCount !== undefined) {
                const elt = this._link.getDisplay();
                const middle = parseInt(String(elt.path.length / 2));
                const startPoint = { left: elt.path[middle - 2], top: elt.path[middle - 1] };
                const endPoint = { left: elt.path[middle + 1], top: elt.path[middle + 2] };
                const fbLeft = startPoint.left + ((endPoint.left - startPoint.left) / 2);
                const fbTop = startPoint.top + ((endPoint.top - startPoint.top) / 2);
                const transform = this._waitCount.transform.baseVal.getItem(0);
                transform.matrix.e = fbLeft;
                transform.matrix.f = fbTop;
            }
        }
        /**
         * Updates the UI Control Link display of the framesBreak.
         * @private
         */
        _updateFramesBreakDisplay() {
            const options = this._link.getParentGraph().getEditor().getOptions();
            if (options.enableFramebreaks) {
                const enableWaitCount = this._link.getModel().getWaitCount() > 0;
                if (this._waitCount !== undefined && !enableWaitCount) {
                    this._waitCount.parentNode?.removeChild(this._waitCount);
                    this._waitCount = undefined;
                }
                else if (enableWaitCount) {
                    const circle = UIDom.createSVGCircle({
                        className: 'sch-control-link-circle',
                        attributes: { cx: 0, cy: 0, r: 8 }
                    });
                    const line1 = UIDom.createSVGLine({
                        className: 'sch-control-link-line',
                        attributes: { x1: 0, y1: 0, x2: 0, y2: -7 }
                    });
                    const line2 = UIDom.createSVGLine({
                        className: 'sch-control-link-line',
                        attributes: { x1: 0, y1: 0, x2: 4, y2: 5 }
                    });
                    this._waitCount = UIDom.createSVGGroup({
                        className: 'sch-control-link-waitcount',
                        parent: this.structure.root,
                        children: [circle, line1, line2],
                        attributes: { transform: 'matrix(1 0 0 1 0 0)' }
                    });
                    this.display.waitCount = this._waitCount;
                    this.display.waitCount.grElt = this._link.getDisplay();
                    this.display.waitCount.subElt = 'waitCount';
                    this._updateFramesBreakPosition();
                }
            }
        }
    }
    return UIControlLinkView;
});
