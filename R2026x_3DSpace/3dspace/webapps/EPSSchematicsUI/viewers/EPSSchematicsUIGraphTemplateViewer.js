/// <amd-module name='DS/EPSSchematicsUI/viewers/EPSSchematicsUIGraphTemplateViewer'/>
define("DS/EPSSchematicsUI/viewers/EPSSchematicsUIGraphTemplateViewer", ["require", "exports", "DS/EPSSchematicsUI/viewers/EPSSchematicsUIViewer", "DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateLibrary"], function (require, exports, UIViewer, UITemplateLibrary) {
    "use strict";
    // TODO: Display template name inside viewer!
    /**
     * This class defines the graph template viewer.
     * @private
     * @class UIGraphTemplateViewer
     * @alias module:DS/EPSSchematicsUI/viewers/EPSSchematicsUIGraphTemplateViewer
     * @extends UIViewer
     */
    class UIGraphTemplateViewer extends UIViewer {
        /**
         * @public
         * @constructor
         * @param {HTMLElement} container - The HTML parent container that will hold the graph viewer.
         * @param {UIEditor} editor - The editor.
         * @param {string} templateUid - The template uid.
         * @param {boolean} isLocalTemplate - True for a local template else false.
         * @param {UIGraph} graphContext - The graph context.
         */
        constructor(container, editor, templateUid, isLocalTemplate, graphContext) {
            super(container, editor);
            this._templateUid = templateUid;
            this._isLocalTemplate = isLocalTemplate;
            this._graphContext = graphContext;
            this._templateLibrary = this._isLocalTemplate ? this._graphContext.getLocalTemplateLibrary() : UITemplateLibrary;
            this._initialize();
        }
        /**
         * Removes the viewer.
         * @public
         * @override
         */
        remove() {
            const graphBlockModel = this.getMainGraph().getModel();
            const jsonGraph = this.save();
            this._templateLibrary.updateGraph(this._templateUid, graphBlockModel, jsonGraph.ui);
            super.remove();
        }
        /**
         * Initializes the viewer.
         * @private
         */
        _initialize() {
            const graph = this._templateLibrary.getGraph(this._templateUid);
            this.createGraph(graph.model, graph.ui);
            this.getMainGraph().setGraphContext(this._graphContext);
            this.zoomGraphToFitInView();
        }
    }
    return UIGraphTemplateViewer;
});
