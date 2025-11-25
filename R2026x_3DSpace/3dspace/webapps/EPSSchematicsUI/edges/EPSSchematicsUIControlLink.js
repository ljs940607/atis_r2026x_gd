/// <amd-module name='DS/EPSSchematicsUI/edges/EPSSchematicsUIControlLink'/>
define("DS/EPSSchematicsUI/edges/EPSSchematicsUIControlLink", ["require", "exports", "DS/EPSSchematicsUI/edges/EPSSchematicsUILink", "DS/EPSSchematicsUI/edges/views/EPSSchematicsUIControlLinkView", "DS/EPSSchematicsUI/geometries/EPSSchematicsUIControlLinkGeometry", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents"], function (require, exports, UILink, UIControlLinkView, UIControlLinkGeometry, UICommand, UICommandType, Events) {
    "use strict";
    /**
     * This class defines a UI Control Link.
     * @private
     * @class UIControlLink
     * @alias module:DS/EPSSchematicsUI/edges/EPSSchematicsUIControlLink
     * @extends UILink
     */
    class UIControlLink extends UILink {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The UI Graph that owns this link.
         * @param {ControlLink} model - The control link model.
         */
        constructor(graph, model) {
            super(graph, model);
            this._onWaitCountChangeCB = this._onWaitCountChange.bind(this);
            this.setView(this.createView());
            this._display.set('geometry', new UIControlLinkGeometry({
                nbStairs: 1,
                reshapable: true,
                splittable: true
            }));
            this._model.addListener(Events.ControlLinkWaitCountChangeEvent, this._onWaitCountChangeCB);
            this._model.addListener(Events.ControlLinkValidityChangeEvent, this._onValidityChangeCB);
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
         * Removes the link.
         * @public
         * @override
         */
        remove() {
            this._model.removeListener(Events.ControlLinkWaitCountChangeEvent, this._onWaitCountChangeCB);
            this._model.removeListener(Events.ControlLinkValidityChangeEvent, this._onValidityChangeCB);
            this._onWaitCountChangeCB = undefined;
            super.remove();
        }
        /**
         * Creates the control link view.
         * @public
         * @returns {UIControlLinkView} The control link view.
         */
        createView() {
            return new UIControlLinkView(this);
        }
        /**
         * Gets the link view.
         * @public
         * @override
         * @returns {UIControlLinkView} The link view.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the link model.
         * @public
         * @returns {ControlLink} The link model.
         */
        getModel() {
            return this._model;
        }
        /**
         * Projects the specified JSON object to the link.
         * @public
         * @param {IJSONControlLinkUI} iJSONLink - The JSON object representing the link.
         */
        fromJSON(iJSONLink) {
            if (iJSONLink !== undefined && iJSONLink.path !== undefined) {
                this._display.reshaped = true;
                this._display.splitted = true;
                this._display.set('path', iJSONLink.path);
            }
        }
        /**
         * Projects the link to the specified JSON object.
         * @public
         * @param {IJSONControlLinkUI} oJSONLink - The JSON object representing the link.
         */
        toJSON(oJSONLink) {
            if (this._display.reshaped === true || this._display.splitted === true) {
                oJSONLink.path = this._display.path;
            }
        }
        /**
         * Gets the link start port.
         * @public
         * @returns {UIControlPort} The link start port.
         */
        getStartPort() {
            return this._startPort;
        }
        /**
         * Sets the link start port.
         * @public
         * @param {UIControlPort} startPort - The link start port.
         */
        setStartPort(startPort) {
            this._startPort = startPort;
        }
        /**
         * Gets the link end port.
         * @public
         * @returns {UIControlPort} The link end port.
         */
        getEndPort() {
            return this._endPort;
        }
        /**
         * Sets the link end port.
         * @public
         * @param {UIControlPort} endPort - The link end port.
         */
        setEndPort(endPort) {
            this._endPort = endPort;
        }
        /**
         * Sets the number of frames to wait between each link's execution.
         * @public
         * @param {number} frames - The number of frames to wait.
         * @returns {boolean} True if the wait count has been set else false.
         */
        setWaitCount(frames) {
            return this._model.setWaitCount(frames);
        }
        /**
         * Toggles the wait count of the control link.
         * @public
         */
        toggleWaitCount() {
            this.setWaitCount(this._model.getWaitCount() > 0 ? 0 : 1);
        }
        /**
         * Gets the control link bounding box.
         * @public
         * @param {boolean} fixedPath - True to limit the bounding box to fixed paths segment only else false.
         * @returns {EGraphUtils.BoundingRect} The control link bounding box.
         */
        getBoundingBox(fixedPath) {
            return this._display.geometry.getBoundingBox(this._display, fixedPath);
        }
        /**
         * Gets the list of available commands.
         * @public
         * @override
         * @returns {Array<UICommand>} The list of available commands.
         */
        getCommands() {
            const commands = super.getCommands();
            if (this._graph.getEditor().getOptions().enableFramebreaks) {
                const viewer = this._graph.getViewer();
                const isReadOnly = viewer.isReadOnly();
                if (!isReadOnly) {
                    commands.unshift(new UICommand(UICommandType.eToggleFrameBreak, this.toggleWaitCount.bind(this)));
                }
            }
            return commands;
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
         * The callback on the control link wait count change event.
         * @private
         */
        _onWaitCountChange() {
            this.getView().onWaitCountChange();
            this.getParentGraph().onModelChange();
            this.getParentGraph().analyze();
        }
    }
    return UIControlLink;
});
