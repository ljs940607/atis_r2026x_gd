/**
 * Class representing all the selection parameters to use the Buildup solver
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPBuildUpSelection = void 0;
    class DELPXPBuildUpSelection {
        /** constructor of the class, takes 4 parameters
         * @selectedOperations,
         * @workplanPID,
         * @scopedItemPID,
         * @name,
        */
        constructor(selectedOperations, workplanPID, scopedItemPID, name, version) {
            /** this parameter is the workplan ref PID*/
            this._workplanPID = "";
            /** this parameter is the scoped item ref pid*/
            this._scopedItemPID = "";
            /** this is the name of the workplan*/
            this._name = "";
            /** this is the selection mode, 'Execution' exists but is not available.*/
            this._selectionMode = "Selection";
            /** the parameter used to initialize the difference operator, for the first selection, do we compute the difference with all the objects visible or hidden. All visible by default */
            this._initDiffOperatorAllVisible = true;
            this._version = "1.0";
            this._selectedOperations = selectedOperations;
            this._workplanPID = workplanPID;
            this._scopedItemPID = scopedItemPID;
            this._name = name;
            if (typeof version !== 'undefined')
                this._version = version;
        }
        // public setSelectionMode(iSelectionMode : string){
        //     this._selectionMode = iSelectionMode;
        // }
        setDiffOpInitAllVisible(iInitAllVisible) {
            this._initDiffOperatorAllVisible = iInitAllVisible;
        }
        _getSelectedOperations() {
            return this._selectedOperations;
        }
        _getWorkplanPID() {
            return this._workplanPID;
        }
        _getScopedItemPID() {
            return this._scopedItemPID;
        }
        getInitDiffOpAllVisibile() {
            return this._initDiffOperatorAllVisible;
        }
        getSelectedOperations() {
            return this._selectedOperations;
        }
        getWorkplanPID() {
            return this._workplanPID;
        }
        getScopedItemPID() {
            return this._scopedItemPID;
        }
        getName() {
            return this._name;
        }
        getSelectionMode() {
            return this._selectionMode;
        }
        getVersion() {
            return this._version;
        }
    }
    exports.DELPXPBuildUpSelection = DELPXPBuildUpSelection;
});
