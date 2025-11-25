/* eslint-disable no-unused-vars */
/// <amd-module name='DS/EPSSchematicsUI/EPSSchematicsUIEnums'/>
define("DS/EPSSchematicsUI/EPSSchematicsUIEnums", ["require", "exports"], function (require, exports) {
    "use strict";
    var UIEnums;
    (function (UIEnums) {
        /**
         * Enumeration defining the available shortcut types.
         * @private
         */
        let EShortcutType;
        (function (EShortcutType) {
            EShortcutType[EShortcutType["eStartPort"] = 0] = "eStartPort";
            EShortcutType[EShortcutType["eEndPort"] = 1] = "eEndPort";
        })(EShortcutType = UIEnums.EShortcutType || (UIEnums.EShortcutType = {}));
        /**
         * Enumeration flags defining the available graph toolbar button.
         * @protected
         */
        let FGraphToolbarButton;
        (function (FGraphToolbarButton) {
            FGraphToolbarButton[FGraphToolbarButton["fNone"] = 0] = "fNone";
            FGraphToolbarButton[FGraphToolbarButton["fLoad"] = 1] = "fLoad";
            FGraphToolbarButton[FGraphToolbarButton["fSave"] = 2] = "fSave";
            FGraphToolbarButton[FGraphToolbarButton["fClear"] = 4] = "fClear";
            FGraphToolbarButton[FGraphToolbarButton["fGraphAnalyzer"] = 8] = "fGraphAnalyzer";
            FGraphToolbarButton[FGraphToolbarButton["fDataLinkMinimizer"] = 16] = "fDataLinkMinimizer";
            FGraphToolbarButton[FGraphToolbarButton["fContrast"] = 32] = "fContrast";
            FGraphToolbarButton[FGraphToolbarButton["fNodeIdSelectors"] = 64] = "fNodeIdSelectors";
            FGraphToolbarButton[FGraphToolbarButton["fCreateComment"] = 128] = "fCreateComment";
            FGraphToolbarButton[FGraphToolbarButton["fEditorSettings"] = 256] = "fEditorSettings";
            FGraphToolbarButton[FGraphToolbarButton["fAllButton"] = 511] = "fAllButton";
        })(FGraphToolbarButton = UIEnums.FGraphToolbarButton || (UIEnums.FGraphToolbarButton = {}));
        /**
         * Enumeration defining the label display speed.
         * @private
         */
        let ELabelDisplaySpeed;
        (function (ELabelDisplaySpeed) {
            ELabelDisplaySpeed[ELabelDisplaySpeed["eDirect"] = 0] = "eDirect";
            ELabelDisplaySpeed[ELabelDisplaySpeed["eFast"] = 1] = "eFast";
            ELabelDisplaySpeed[ELabelDisplaySpeed["eSlow"] = 2] = "eSlow";
        })(ELabelDisplaySpeed = UIEnums.ELabelDisplaySpeed || (UIEnums.ELabelDisplaySpeed = {}));
        /**
         * Enumeration defining the different view mode.
         * @private
         */
        let EViewMode;
        (function (EViewMode) {
            EViewMode["eEdit"] = "edit";
            EViewMode["ePlay"] = "play";
            EViewMode["eDebug"] = "debug";
        })(EViewMode = UIEnums.EViewMode || (UIEnums.EViewMode = {}));
        /**
         * Enumeration defining the block library entity search filter.
         * @private
         */
        let EBlockLibraryEntitySearchFilter;
        (function (EBlockLibraryEntitySearchFilter) {
            EBlockLibraryEntitySearchFilter["eBlock"] = "categoryBlock";
            EBlockLibraryEntitySearchFilter["eDataPort"] = "categoryDataPort";
            EBlockLibraryEntitySearchFilter["eControlPort"] = "categoryControlPort";
            EBlockLibraryEntitySearchFilter["eEventPort"] = "categoryEventPort";
            EBlockLibraryEntitySearchFilter["eSetting"] = "categorySetting";
        })(EBlockLibraryEntitySearchFilter = UIEnums.EBlockLibraryEntitySearchFilter || (UIEnums.EBlockLibraryEntitySearchFilter = {}));
        /**
         * Enumeration defining the block library port search filter.
         * @private
         */
        let EBlockLibraryPortSearchFilter;
        (function (EBlockLibraryPortSearchFilter) {
            EBlockLibraryPortSearchFilter["eInput"] = "sectionInput";
            EBlockLibraryPortSearchFilter["eOutput"] = "sectionOutput";
        })(EBlockLibraryPortSearchFilter = UIEnums.EBlockLibraryPortSearchFilter || (UIEnums.EBlockLibraryPortSearchFilter = {}));
        /**
         * Enumeration defining the block library property search filter.
         * @private
         */
        let EBlockLibraryPropertySearchFilter;
        (function (EBlockLibraryPropertySearchFilter) {
            EBlockLibraryPropertySearchFilter["eName"] = "treeListColumnName";
            EBlockLibraryPropertySearchFilter["eSummary"] = "sectionSummary";
            EBlockLibraryPropertySearchFilter["eDescription"] = "sectionDescription";
            EBlockLibraryPropertySearchFilter["eCategory"] = "sectionCategory";
            EBlockLibraryPropertySearchFilter["eValueType"] = "treeListColumnValueType";
        })(EBlockLibraryPropertySearchFilter = UIEnums.EBlockLibraryPropertySearchFilter || (UIEnums.EBlockLibraryPropertySearchFilter = {}));
        /**
         * Enumeration defining the nodeId selector property.
         * @private
         */
        let ENodeIdSelectorProperty;
        (function (ENodeIdSelectorProperty) {
            ENodeIdSelectorProperty["ePool"] = "pool";
            ENodeIdSelectorProperty["eCriterion"] = "criterion";
            ENodeIdSelectorProperty["eIdentifier"] = "identifier";
            ENodeIdSelectorProperty["eQueuing"] = "queuing";
            ENodeIdSelectorProperty["eTimeout"] = "timeout";
            ENodeIdSelectorProperty["eMaxInstanceCount"] = "maxInstanceCount";
            ENodeIdSelectorProperty["eCmdLine"] = "cmdLine";
        })(ENodeIdSelectorProperty = UIEnums.ENodeIdSelectorProperty || (UIEnums.ENodeIdSelectorProperty = {}));
        /**
         * Enumeration defining the message origin.
         * @private
         */
        let EMessageOrigin;
        (function (EMessageOrigin) {
            EMessageOrigin[EMessageOrigin["eApplication"] = 0] = "eApplication";
            EMessageOrigin[EMessageOrigin["eUser"] = 1] = "eUser";
        })(EMessageOrigin = UIEnums.EMessageOrigin || (UIEnums.EMessageOrigin = {}));
    })(UIEnums || (UIEnums = {}));
    return UIEnums;
});
