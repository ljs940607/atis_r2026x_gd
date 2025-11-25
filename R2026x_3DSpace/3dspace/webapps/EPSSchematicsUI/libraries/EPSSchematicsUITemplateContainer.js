/// <amd-module name='DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateContainer'/>
define("DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateContainer", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This class defines the UI template container.
     * @private
     * @class UITemplateContainer
     * @alias module:DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateContainer
     */
    class UITemplateContainer {
        constructor() {
            this._jsonGraphByUid = {};
            this._jsonScriptByUid = {};
        }
        /**
         * Registers a UI json object graph block into the template container.
         * @public
         * @param {string} uid - The graph block uid.
         * @param {IJSONGraphUI} jsonObjectGraph - The json object UI graph block.
         */
        registerUIJSONObjectGraph(uid, jsonObjectGraph) {
            this._jsonGraphByUid[uid] = JSON.stringify(jsonObjectGraph);
        }
        /**
         * Registers a UI json object script block into the template container.
         * @public
         * @param {string} uid - The script block uid.
         * @param {IJSONScriptBlockUI} [jsonObjectScript] - The json object UI script block.
         */
        registerUIJSONObjectScript(uid, jsonObjectScript) {
            this._jsonScriptByUid[uid] = JSON.stringify(jsonObjectScript);
        }
        /**
         * Unregisters the graph block template corresponding to the provided uid.
         * @public
         * @param {string} uid - The graph block template uid.
         */
        unregisterGraphBlockTemplate(uid) {
            delete this._jsonGraphByUid[uid];
        }
        /**
         * Unregisters the script block template corresponding to the provided uid.
         * @public
         * @param {string} uid - The script block template uid.
         */
        unregisterScriptBlockTemplate(uid) {
            delete this._jsonScriptByUid[uid];
        }
        /**
         * Gets the UI json object graph from the template container.
         * @public
         * @param {string} uid - The graph block uid.
         * @returns {IJSONGraphUI|undefined} The UI json object graph.
         */
        getUIJSONObjectGraph(uid) {
            const graph = this._jsonGraphByUid[uid];
            return graph !== undefined ? JSON.parse(graph) : undefined;
        }
        /**
         * Gets the UI json object script from the template container.
         * @public
         * @param {string} uid - The script block uid.
         * @returns {IJSONScriptBlockUI|undefined} The UI json object script.
         */
        getUIJSONObjectScript(uid) {
            const script = this._jsonScriptByUid[uid];
            return script !== undefined ? JSON.parse(script) : undefined;
        }
        /**
         * Gets all UI json templates.
         * @public
         * @param {IJSONUITemplates} oJSONTemplates - The UI json templates.
         */
        getUITemplates(oJSONTemplates) {
            oJSONTemplates.graphs = {};
            oJSONTemplates.scripts = {};
            const graphUids = Object.keys(this._jsonGraphByUid);
            graphUids.forEach(graphUid => {
                const jsonGraph = this.getUIJSONObjectGraph(graphUid);
                if (jsonGraph) {
                    oJSONTemplates.graphs[graphUid] = jsonGraph;
                }
            });
            const scriptUids = Object.keys(this._jsonScriptByUid);
            scriptUids.forEach(scriptUid => {
                const jsonScript = this.getUIJSONObjectScript(scriptUid);
                if (jsonScript) {
                    oJSONTemplates.scripts[scriptUid] = jsonScript;
                }
            });
        }
        /**
         * Sets all UI json templates.
         * @public
         * @param {IJSONUITemplates} iJSONTemplates - The UI json templates
         */
        setUITemplates(iJSONTemplates) {
            if (iJSONTemplates !== undefined) {
                this._jsonGraphByUid = {};
                const graphUids = Object.keys(iJSONTemplates.graphs);
                graphUids.forEach(graphUid => this.registerUIJSONObjectGraph(graphUid, iJSONTemplates.graphs[graphUid]));
                const scriptUids = Object.keys(iJSONTemplates.scripts);
                scriptUids.forEach(scriptUid => this.registerUIJSONObjectScript(scriptUid, iJSONTemplates.scripts[scriptUid]));
            }
        }
    }
    return UITemplateContainer;
});
