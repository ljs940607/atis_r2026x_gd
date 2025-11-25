/// <amd-module name='DS/EPSSchematicsUI/viewers/EPSSchematicsUIGraphFunctionViewer'/>
define("DS/EPSSchematicsUI/viewers/EPSSchematicsUIGraphFunctionViewer", ["require", "exports", "DS/EPSSchematicsUI/viewers/EPSSchematicsUIViewer", "DS/EPSSchematicsCSI/EPSSchematicsCSIGraphBlock", "DS/EPSSchematicsCSI/EPSSchematicsCSIImport"], function (require, exports, UIViewer, CSIGraphBlock, CSIImport) {
    "use strict";
    /**
     * This class defines the graph function viewer.
     * @private
     * @class UIGraphFunctionViewer
     * @alias module:DS/EPSSchematicsUI/viewers/EPSSchematicsUIGraphFunctionViewer
     * @extends UIViewer
     */
    class UIGraphFunctionViewer extends UIViewer {
        /**
         * @public
         * @constructor
         * @param {HTMLElement} container - The HTML parent container that will hold the graph viewer.
         * @param {UIEditor} editor - The editor.
         * @param {UIGraphBlock} graphBlockUI - The graph block UI.
         * @param {CSIGraphFunctionBlock} graphFunctionBlock - The CSI graph function block.
         */
        constructor(container, editor, graphBlockUI, graphFunctionBlock) {
            super(container, editor);
            this._graphBlockUI = graphBlockUI;
            this._graphFunctionBlock = graphFunctionBlock;
            this.setReadOnly(true);
            this._initialize();
        }
        /**
         * Removes the viewer.
         * @public
         * @override
         */
        remove() {
            this._graphBlockUI = undefined;
            this._graphFunctionBlock = undefined;
            super.remove();
        }
        /**
         * Checks if the viewer is valid or if an error has occurred.
         * @public
         * @returns {boolean} True if the viewer is valid, false otherwise.
         */
        isValid() {
            return this._graphFunctionBlock !== undefined;
        }
        /**
         * Initializes the viewer.
         * @private
         */
        _initialize() {
            const jsonFunction = this._graphFunctionBlock.getJSONFunction();
            let hasError = jsonFunction?.implementation?.name !== 'executionGraph';
            if (!hasError) {
                try {
                    let loadJSONFunctionWithoutUI = false;
                    // Check if the ui section is present in the CSI function declaration
                    const schematicsJSONString = jsonFunction?.implementation?.settings?.implementation?.ui;
                    if (schematicsJSONString !== undefined) {
                        const schematicsJSONObject = JSON.parse(schematicsJSONString);
                        const hasModel = schematicsJSONObject.hasOwnProperty('version'); // Check a model section is present
                        if (hasModel) {
                            const result = this.load(schematicsJSONString);
                            if (result === false) {
                                throw new Error('Failed to load the JSON function!');
                            }
                        }
                        else { // If no model is found
                            loadJSONFunctionWithoutUI = true;
                            this._editor.displayNotification({
                                level: 'error',
                                title: 'Invalid JSON format',
                                message: 'The model part is not available in the ui part of the JSON! Trying to load the CSI function instead!'
                            });
                        }
                    }
                    else {
                        loadJSONFunctionWithoutUI = true;
                    }
                    if (loadJSONFunctionWithoutUI === true) {
                        const graphModel = new CSIGraphBlock();
                        CSIImport.buildFromJSONObject(graphModel, jsonFunction);
                        const graphUI = this.createGraph(graphModel);
                        graphUI.setDefaultBlocksPosition();
                    }
                }
                catch (error) {
                    this._graphFunctionBlock = undefined;
                    hasError = true;
                    // Some CSI blocks have been generated outside of the editor and some links
                    // may have been authorized on model side but are not valid on UI side.
                    // eslint-disable-next-line no-console
                    console.error(error);
                }
            }
            if (hasError) {
                this.remove();
            }
            else {
                this._graphBlockUI.setGraphView(this.getMainGraph(), false);
                this.getMainGraph().setBlockView(this._graphBlockUI);
                this.zoomGraphToFitInView();
            }
        }
    }
    return UIGraphFunctionViewer;
});
