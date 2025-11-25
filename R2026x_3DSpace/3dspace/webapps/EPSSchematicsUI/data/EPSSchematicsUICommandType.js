/// <amd-module name='DS/EPSSchematicsUI/data/EPSSchematicsUICommandType'/>
define("DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", ["require", "exports", "text!DS/EPSSchematicsUI/assets/EPSSchematicsUICommands.json"], function (require, exports, UICommandTypeJSON) {
    "use strict";
    const JSONCommandType = JSON.parse(UICommandTypeJSON);
    /**
     * This class defines the UI command type.
     * @class UICommandType
     * @alias module:DS/EPSSchematicsUI/data/EPSSchematicsUICommandType
     * @private
     */
    class UICommandType {
        static { this.eEditExpandState = new UICommandType(JSONCommandType.eEditExpandState); }
        static { this.eFlattenGraph = new UICommandType(JSONCommandType.eFlattenGraph); }
        static { this.eRemove = new UICommandType(JSONCommandType.eRemove); }
        static { this.eEditTemplate = new UICommandType(JSONCommandType.eEditTemplate); }
        static { this.eOpen = new UICommandType(JSONCommandType.eOpen); }
        static { this.eToggleFrameBreak = new UICommandType(JSONCommandType.eToggleFrameBreak); }
        static { this.eCreateLocalTemplate = new UICommandType(JSONCommandType.eCreateLocalTemplate); }
        static { this.eCreateGlobalTemplate = new UICommandType(JSONCommandType.eCreateGlobalTemplate); }
        static { this.eConvertLocalToGlobalTemplate = new UICommandType(JSONCommandType.eConvertLocalToGlobalTemplate); }
        static { this.eUntemplate = new UICommandType(JSONCommandType.eUntemplate); }
        static { this.eCreateGraphFromSelection = new UICommandType(JSONCommandType.eCreateGraphFromSelection); }
        static { this.eCreateCSIGraphFromSelection = new UICommandType(JSONCommandType.eCreateCSIGraphFromSelection); }
        static { this.eEdit = new UICommandType(JSONCommandType.eEdit); }
        static { this.eDebug = new UICommandType(JSONCommandType.eDebug); }
        static { this.eOpenBlockDocumentation = new UICommandType(JSONCommandType.eOpenBlockDocumentation); }
        static { this.eOpenTypeDescription = new UICommandType(JSONCommandType.eOpenTypeDescription); }
        static { this.eHideProperty = new UICommandType(JSONCommandType.eHideProperty); }
        static { this.eOpenBlockLibrary = new UICommandType(JSONCommandType.eOpenBlockLibrary); }
        static { this.eOpenTypeLibraryPanel = new UICommandType(JSONCommandType.eOpenTypeLibraryPanel); }
        static { this.eDebugConsole = new UICommandType(JSONCommandType.eDebugConsole); }
        static { this.eOpenHistoryPanel = new UICommandType(JSONCommandType.eOpenHistoryPanel); }
        static { this.eOpenGraphConfiguration = new UICommandType(JSONCommandType.eOpenGraphConfiguration); }
        static { this.eOpenFile = new UICommandType(JSONCommandType.eOpenFile); }
        static { this.eSaveFile = new UICommandType(JSONCommandType.eSaveFile); }
        static { this.eClearGraph = new UICommandType(JSONCommandType.eClearGraph); }
        static { this.eOpenNodeIdSelectorsPanel = new UICommandType(JSONCommandType.eOpenNodeIdSelectorsPanel); }
        static { this.eGraphAnalyzer = new UICommandType(JSONCommandType.eGraphAnalyzer); }
        static { this.eMinimizeDataLinks = new UICommandType(JSONCommandType.eMinimizeDataLinks); }
        static { this.eSwitchContrast = new UICommandType(JSONCommandType.eSwitchContrast); }
        static { this.eOpenEditorSettings = new UICommandType(JSONCommandType.eOpenEditorSettings); }
        static { this.eToolbarExpander = new UICommandType(JSONCommandType.eToolbarExpander); }
        static { this.eCreateComment = new UICommandType(JSONCommandType.eCreateComment); }
        static { this.eExportBlock = new UICommandType(JSONCommandType.eExportBlock); }
        static { this.eShowBlockPredecessors = new UICommandType(JSONCommandType.eShowBlockPredecessors); }
        static { this.eEditOptionalDataPorts = new UICommandType(JSONCommandType.eEditOptionalDataPorts); }
        static { this.eHideOptionalDataPort = new UICommandType(JSONCommandType.eHideOptionalDataPort); }
        static { this.eAddDataPortToWatch = new UICommandType(JSONCommandType.eAddDataPortToWatch); }
        /**
         * @constructor
         * @private
         * @param {ICommandTypeDefinition} commandType - The command type.
         */
        constructor(commandType) {
            this._commandType = commandType;
            this.title = this._commandType.title;
            this.shortHelp = this._commandType.shortHelp;
            this.icon = this._commandType.icon;
            this.shortcut = this._commandType.shortcut;
        }
    }
    return UICommandType;
});
