/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphControlPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphControlPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIControlPort", "DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphControlPortBorderCstr", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphControlPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIMath", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, UIControlPort, UIGraphControlPortBorderCstr, UIGraphControlPortView, UIMath, EGraphCore) {
    "use strict";
    /**
     * This class defines a UI graph control port.
     * @private
     * @class UIGraphControlPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphControlPort
     * @extends UIControlPort
     */
    class UIGraphControlPort extends UIControlPort {
        /**
         * @public
         * @constructor
         * @param {UIGraph} parent - The parent UI graph that owns this UI graph port.
         * @param {ControlPort} model - The control port model.
         * @param {number} offset - The position of the control port.
         */
        constructor(parent, model, offset) {
            super(parent, model);
            const validOffset = this.computeValidOffset(offset);
            const start = this.isStartPort();
            this._setBorderConstraint({
                cstr: new UIGraphControlPortBorderCstr(this),
                offset: validOffset,
                attach: start ? EGraphCore.BorderCstr.LEFT : EGraphCore.BorderCstr.RIGHT,
                aoffx: start ? -UIGraphControlPortView.kPortHeight / 2 : UIGraphControlPortView.kPortHeight / 2,
                aoffy: start ? UIGraphControlPortView.kPortLeftOffset - 1 : UIGraphControlPortView.kPortLeftOffset
            });
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
         * Removes the port.
         * @public
         * @override
         */
        remove() {
            super.remove();
        }
        /**
         * Gets the view of the of.
         * @public
         * @override
         * @returns {UIGraphControlPortView} The view of the port.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the parent of the port.
         * @public
         * @override
         * @returns {UIGraph} The parent of the port.
         */
        getParent() {
            return this._parent;
        }
        /**
         * Gets the parent graph of the port.
         * @public
         * @returns {UIGraph} The parent graph of the port.
         */
        getParentGraph() {
            return this._parent;
        }
        /**
         * Computes a valid port's offset included between a minimum
         * and a maximum limit and snapped to the graph's grid.
         * @public
         * @param {number} offset - The given port's offset position.
         * @returns {number} A valid port's offset position.
         */
        computeValidOffset(offset) {
            const graph = this.getParentGraph();
            /*const topLimit = graph.paddingTop + UIGraphControlPortView.kPortHeight;
            const bottomLimit = graph.getHeight() - graph.paddingBottom - UIGraphControlPortView.kPortHeight;
            if (offset < topLimit) {
                offset = topLimit;
            } else if (offset > bottomLimit) {
                offset = bottomLimit;
            }*/
            return graph.getEditor().getOptions().gridSnapping ? UIMath.snapValue(offset) : offset;
        }
        /**
         * Loads the port from the provided JSON port model.
         * @public
         * @override
         * @param {IJSONGraphControlPortUI} iJSONGraphControlPort - The JSON graph control port model.
         */
        fromJSON(iJSONGraphControlPort) {
            if (iJSONGraphControlPort?.offset) {
                this.setOffset(iJSONGraphControlPort.offset);
            }
        }
        /**
         * Saves the port to the provided JSON port model.
         * @public
         * @override
         * @param {IJSONGraphControlPortUI} oJSONGraphControlPort - The JSON graph control port model.
         */
        toJSON(oJSONGraphControlPort) {
            oJSONGraphControlPort.offset = this._display.offset;
        }
        /**
         * Sets the port's offset position.
         * @public
         * @override
         * @param {number} offset - The port's offset position.
         */
        setOffset(offset) {
            const validOffset = this.computeValidOffset(offset);
            super.setOffset(validOffset);
            this.getParentGraph().onUIChange();
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
         * Creates the view of the connector.
         * @protected
         * @override
         * @returns {UIGraphControlPortView} The view of the connector.
         */
        _createView() {
            return new UIGraphControlPortView(this);
        }
        /**
         * The callback on the control port name change event.
         * @protected
         * @override
         * @param {ControlPortNameChangeEvent} event - The control port name change event.
         */
        _onControlPortNameChange(event) {
            this.getView().updatePortName(event.getName());
            super._onControlPortNameChange(event);
        }
    }
    return UIGraphControlPort;
});
