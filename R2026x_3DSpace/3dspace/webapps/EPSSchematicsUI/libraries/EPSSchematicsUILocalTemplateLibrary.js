/// <amd-module name='DS/EPSSchematicsUI/libraries/EPSSchematicsUILocalTemplateLibrary'/>
define("DS/EPSSchematicsUI/libraries/EPSSchematicsUILocalTemplateLibrary", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsTemplateLibrary", "DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateContainer"], function (require, exports, TemplateLibrary, UITemplateContainer) {
    "use strict";
    /**
     * This class defines the UI local template library.
     * @private
     * @class UILocalTemplateLibrary
     * @alias module:DS/EPSSchematicsUI/libraries/EPSSchematicsUILocalTemplateLibrary
     */
    class UILocalTemplateLibrary {
        /**
         * @public
         * @constructor
         * @param {GraphBlock} graphContext - The graph context model.
         */
        constructor(graphContext) {
            this._templateContainer = new UITemplateContainer();
            this._graphContext = graphContext;
        }
        /**
         * Gets the template container.
         * @public
         * @returns {UITemplateContainer} The template container.
         */
        getTemplateContainer() {
            return this._templateContainer;
        }
        /**
         * Gets the list of graph block uid from the template library.
         * The list can be scoped by specifying a graph block name.
         * @public
         * @param {string} [name] - The graph block name.
         * @returns {string[]} The list of graph block uid.
         */
        getGraphUidList(name) {
            return TemplateLibrary.getLocalGraphUidList(this._graphContext, name);
        }
        /**
         * Gets the list of script block uid from the template library.
         * The list can be scoped by specifying a script block name.
         * @public
         * @param {string} [name] - The script block name.
         * @returns {string[]} The list of script block uid.
         */
        getScriptUidList(name) {
            return TemplateLibrary.getLocalScriptUidList(this._graphContext, name);
        }
        /**
         * Gets the graph block name from the template library
         * corresponding to the specified uid.
         * @public
         * @param {string} uid - The graph block uid.
         * @returns {string} The graph block name.
         */
        getNameByUid(uid) {
            return TemplateLibrary.getLocalNameByUid(this._graphContext, uid);
        }
        /**
         * Registers a UI graph block on the template library.
         * @public
         * @param {UIGraphBlock} graphBlockUI - The UI graph block to register.
         * @param {string} [uid] - The uid of the template
         */
        registerGraph(graphBlockUI, uid) {
            uid = TemplateLibrary.registerLocalGraph(this._graphContext, graphBlockUI.getModel(), uid);
            const jsonGraphBlockUI = graphBlockUI.getJSONGraphBlockUI();
            if (jsonGraphBlockUI) {
                this._templateContainer.registerUIJSONObjectGraph(uid, jsonGraphBlockUI);
            }
        }
        /**
         * Registers a UI script block on the template library.
         * @public
         * @param {UIScriptBlock} scriptBlockUI - The UI script block.
         * @param {string} [uid] - The uid of the template
         */
        registerScript(scriptBlockUI, uid) {
            uid = TemplateLibrary.registerLocalScript(this._graphContext, scriptBlockUI.getModel(), uid);
            this._templateContainer.registerUIJSONObjectScript(uid);
        }
        /**
         * Gets the graph corresponding to the provided uid from the template library.
         * @public
         * @param {string} uid - The graph block uid.
         * @returns {IJSONGraphBlockTemplate} The object graph instance model and json ui.
         */
        getGraph(uid) {
            return {
                model: TemplateLibrary.getLocalGraph(this._graphContext, uid),
                ui: this._templateContainer.getUIJSONObjectGraph(uid)
            };
        }
        /**
         * Gets the script corresponding to the provided uid from the template library.
         * @public
         * @param {string} uid - The script block uid.
         * @returns {IJSONScriptBlockTemplate} The object script instance model and json ui.
         */
        getScript(uid) {
            return {
                model: TemplateLibrary.getLocalScript(this._graphContext, uid),
                ui: this._templateContainer.getUIJSONObjectScript(uid)
            };
        }
        /**
         * Updates the registered graph corresponding to the provided uid into the template library.
         * @public
         * @param {string} uid - The graph block uid.
         * @param {GraphBlock} graphBlockModel - The graph block model.
         * @param {IJSONGraphUI} jsonObjectGraphUI - The json object graph UI.
         */
        updateGraph(uid, graphBlockModel, jsonObjectGraphUI) {
            TemplateLibrary.updateLocalGraph(this._graphContext, uid, graphBlockModel);
            this._templateContainer.registerUIJSONObjectGraph(uid, jsonObjectGraphUI);
        }
        /**
         * Updates the registered script corresponding to the provided uid into the template library.
         * @public
         * @param {string} uid - The script block uid.
         * @param {ScriptBlock} scriptBlockModel - The script block model.
         * @param {IJSONScriptBlockUI|undefined} jsonObjectScriptUI - the json object script UI.
         */
        updateScript(uid, scriptBlockModel, jsonObjectScriptUI) {
            TemplateLibrary.updateLocalScript(this._graphContext, uid, scriptBlockModel);
            this._templateContainer.registerUIJSONObjectScript(uid, jsonObjectScriptUI);
        }
        /**
         * Converts the template library to JSON.
         * @public
         * @param {IJSONGraphWithUI} oJSONTemplateLibrary - The converted JSON template library.
         */
        toJSON(oJSONTemplateLibrary) {
            oJSONTemplateLibrary.templates = {
                model: { graphs: {}, scripts: {} },
                ui: { graphs: {}, scripts: {} }
            };
            this._graphContext.localTemplateLibrary.toJSON(oJSONTemplateLibrary.templates.model);
            this._templateContainer.getUITemplates(oJSONTemplateLibrary.templates.ui);
        }
        /**
         * Loads the template library from JSON.
         * @public
         * @param {IJSONGraphWithUI} iJSONTemplateLibrary - The JSON template library.
         */
        fromJSON(iJSONTemplateLibrary) {
            if (iJSONTemplateLibrary.templates !== undefined) {
                this._graphContext.localTemplateLibrary.fromJSON(iJSONTemplateLibrary.templates.model);
                this._templateContainer.setUITemplates(iJSONTemplateLibrary.templates.ui);
            }
        }
    }
    return UILocalTemplateLibrary;
});
