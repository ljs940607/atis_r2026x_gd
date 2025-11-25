/// <amd-module name="DS/DELPXPProcessConstraintSolver/DELPXPProcessConstraintSolverAPI"/>
define("DS/DELPXPProcessConstraintSolver/DELPXPProcessConstraintSolverAPI", ["require", "exports", "./constraintSolver/ProcessConstraintSolverGateway", "./connect/ContextProcessConstraintSolverImpl", "./constraintSolver/DELPXPProcessConstraintSolverParams"], function (require, exports, ProcessConstraintSolverGateway_1, ContextProcessConstraintSolverImpl_1, DELPXPProcessConstraintSolverParams_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPConstraintSolverParams = void 0;
    exports.connectProcessConstraintSolver = connectProcessConstraintSolver;
    exports.GetProcessConstraintSolverAPI = GetProcessConstraintSolverAPI;
    /**
     * async function returning a promise of type IPXPContext
     * @param iIdentifier, unique identifier for each session, for the current user, a different user with the same identifier will not get the same session.
     * @param iConnectionInfo , ...
     * @returns Promise<IPXPContext>
     */
    function connectProcessConstraintSolver(iIdentifier, iConnectionInfo) {
        return (0, ContextProcessConstraintSolverImpl_1.connectProcessConstraintSolverAPI)(iIdentifier, iConnectionInfo);
    }
    ;
    /**
     * async function returning a IProcessConstraintSolver
     * @param iPXPContext, to provide to the service all the necessary infos to do communications
     * @returns IProcessConstraintSolver
     */
    function GetProcessConstraintSolverAPI(iPXPContext) {
        return new ProcessConstraintSolverGateway_1.ProcessConstraintSolverGateway(iPXPContext);
    }
    Object.defineProperty(exports, "DELPXPConstraintSolverParams", { enumerable: true, get: function () { return DELPXPProcessConstraintSolverParams_1.DELPXPConstraintSolverParams; } });
});
