/// <amd-module name='DS/EPSSchematicsUI/edges/views/EPSSchematicsUILinkView'/>
define("DS/EPSSchematicsUI/edges/views/EPSSchematicsUILinkView", ["require", "exports", "DS/EPSSchematicsUI/edges/views/EPSSchematicsUIEdgeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIPort", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, UIEdgeView, UIDom, UIPort, EGraphCore) {
    "use strict";
    /**
     * This class defines a UI link view.
     * @private
     * @abstract
     * @class UILinkView
     * @alias module:DS/EPSSchematicsUI/edges/views/EPSSchematicsUILinkView
     */
    class UILinkView extends UIEdgeView {
        /**
         * @public
         * @constructor
         * @param {UILink} link - The UI link.
         * @param {string} className - The name of the CSS class to use for displaying the link.
         */
        constructor(link, className) {
            super(className);
            this._onMouseEnterCB = this._onMouseEnter.bind(this);
            this._onMouseLeaveCB = this._onMouseLeave.bind(this);
            this._link = link;
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
         * Highlights the link's view.
         * @private
         */
        highlight() {
            if (this.structure.root !== undefined && this.structure.root !== null) {
                UIDom.addClassName(this.structure.root, 'sch-link-highlight');
            }
        }
        /**
         * Unhighlights the link's view.
         * @private
         */
        unhighlight() {
            if (this.structure.root !== undefined && this.structure.root !== null) {
                UIDom.removeClassName(this.structure.root, 'sch-link-highlight');
            }
        }
        /**
         * The callback on the validity change event of a link.
         * @public
         */
        onValidityChange() {
            if (this.display.elt.parentElement) {
                if (!this._link.getModel().isValid()) {
                    UIDom.addClassName(this.display.elt.parentElement, 'sch-link-invalid');
                    this.createInvalidPathClone();
                }
                else {
                    UIDom.removeClassName(this.display.elt.parentElement, 'sch-link-invalid');
                    this.removeInvalidPathClone();
                }
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
            if (this.structure.root !== undefined && this.structure.root !== null) {
                this.structure.root.removeEventListener('mouseenter', this._onMouseEnterCB);
                this.structure.root.removeEventListener('mouseleave', this._onMouseLeaveCB);
            }
            this._link = undefined;
            this._invalidPathClone = undefined;
            this._onMouseEnterCB = undefined;
            this._onMouseLeaveCB = undefined;
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
            this.structure.root.addEventListener('mouseenter', this._onMouseEnterCB);
            this.structure.root.addEventListener('mouseleave', this._onMouseLeaveCB);
            this.onValidityChange();
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
            this.syncInvalidPathClone();
            if (EGraphCore.inPathSet(changes, 'selected')) {
                const startPort = this._link.getStartPort();
                if (startPort instanceof UIPort) {
                    const startPortView = startPort.getView();
                    if (elt.isSelected()) {
                        startPortView.showRerouteHandler();
                    }
                    else {
                        startPortView.hideRerouteHandler();
                    }
                }
                const endPort = this._link.getEndPort();
                if (endPort instanceof UIPort) {
                    const endPortView = endPort.getView();
                    if (elt.isSelected()) {
                        endPortView.showRerouteHandler();
                    }
                    else {
                        endPortView.hideRerouteHandler();
                    }
                }
            }
        }
        /**
         * The callback on the link view mouse enter event.
         * @protected
         * @param {MouseEvent} _event - The mouse enter event.
         */
        _onMouseEnter(_event) {
            const startPort = this._link.getStartPort();
            const endPort = this._link.getEndPort();
            if (startPort !== undefined) {
                startPort.highlight();
            }
            if (endPort !== undefined) {
                endPort.highlight();
            }
            this.highlight();
        }
        /**
         * The callback on the link view mouse leave event.
         * @protected
         */
        _onMouseLeave() {
            const startPort = this._link.getStartPort();
            const endPort = this._link.getEndPort();
            startPort.unhighlight();
            endPort.unhighlight();
            this.unhighlight();
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
         * Creates an invalid path clone.
         * @private
         */
        createInvalidPathClone() {
            if (this._invalidPathClone === undefined) {
                this._invalidPathClone = UIDom.createSVGPath({
                    className: 'sch-link-path-invalid',
                    parent: this.structure.root
                });
                this.display.invalidPathClone = this._invalidPathClone;
                this.display.invalidPathClone.grElt = this._link.getDisplay();
                this.display.invalidPathClone.subElt = 'invalidPathClone';
                this.syncInvalidPathClone();
            }
        }
        /**
         * Removes the invalid path clone.
         * @private
         */
        removeInvalidPathClone() {
            if (this._invalidPathClone !== undefined) {
                this.structure.root.removeChild(this._invalidPathClone);
                this._invalidPathClone = undefined;
            }
        }
        /**
         * Synchronizes the invalid path clone.
         * @private
         */
        syncInvalidPathClone() {
            if (this._invalidPathClone !== undefined) {
                const path = this.elts.elt.getAttribute('d');
                if (path !== null && path !== undefined) {
                    this._invalidPathClone.setAttribute('d', path);
                }
            }
        }
    }
    return UILinkView;
});
