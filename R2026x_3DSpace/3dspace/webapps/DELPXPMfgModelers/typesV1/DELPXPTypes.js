define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CapableResourceLinkType = exports.DelayMode = exports.TimeConstraintsDependencyType = exports.ImplementLinkUsage = exports.AvailabilityMode = exports.ReferencePositionMode = exports.ApplicabilityMode = exports.ProductFlowType = void 0;
    var ProductFlowType;
    (function (ProductFlowType) {
        ProductFlowType[ProductFlowType["ProductFlowType_Good"] = 0] = "ProductFlowType_Good";
        ProductFlowType[ProductFlowType["ProductFlowType_Scrapped"] = 1] = "ProductFlowType_Scrapped";
        ProductFlowType[ProductFlowType["ProductFlowType_Failed"] = 2] = "ProductFlowType_Failed";
    })(ProductFlowType || (exports.ProductFlowType = ProductFlowType = {}));
    var ApplicabilityMode;
    (function (ApplicabilityMode) {
        ApplicabilityMode[ApplicabilityMode["ApplicabilityMode_OperationStep"] = 0] = "ApplicabilityMode_OperationStep";
        ApplicabilityMode[ApplicabilityMode["ApplicabilityMode_OperationHeader"] = 1] = "ApplicabilityMode_OperationHeader";
        ApplicabilityMode[ApplicabilityMode["ApplicabilityMode_Workplan"] = 2] = "ApplicabilityMode_Workplan";
        ApplicabilityMode[ApplicabilityMode["ApplicabilityMode_Undefined"] = 3] = "ApplicabilityMode_Undefined";
    })(ApplicabilityMode || (exports.ApplicabilityMode = ApplicabilityMode = {}));
    var ReferencePositionMode;
    (function (ReferencePositionMode) {
        ReferencePositionMode[ReferencePositionMode["ReferencePositionMode_BuildUp"] = 0] = "ReferencePositionMode_BuildUp";
        ReferencePositionMode[ReferencePositionMode["ReferencePositionMode_Layout"] = 1] = "ReferencePositionMode_Layout";
        ReferencePositionMode[ReferencePositionMode["ReferencePositionMode_ImplementedItem"] = 2] = "ReferencePositionMode_ImplementedItem";
        ReferencePositionMode[ReferencePositionMode["ReferencePositionMode_FromParent"] = 3] = "ReferencePositionMode_FromParent";
        ReferencePositionMode[ReferencePositionMode["ReferencePositionMode_Unknown"] = 4] = "ReferencePositionMode_Unknown";
    })(ReferencePositionMode || (exports.ReferencePositionMode = ReferencePositionMode = {}));
    var AvailabilityMode;
    (function (AvailabilityMode) {
        AvailabilityMode[AvailabilityMode["AvailabilityMode_Reserved"] = 0] = "AvailabilityMode_Reserved";
        AvailabilityMode[AvailabilityMode["AvailabilityMode_Released"] = 1] = "AvailabilityMode_Released";
        AvailabilityMode[AvailabilityMode["AvailabilityMode_StepOnly"] = 2] = "AvailabilityMode_StepOnly";
        AvailabilityMode[AvailabilityMode["AvailabilityMode_Undefined"] = 3] = "AvailabilityMode_Undefined";
    })(AvailabilityMode || (exports.AvailabilityMode = AvailabilityMode = {}));
    var ImplementLinkUsage;
    (function (ImplementLinkUsage) {
        ImplementLinkUsage[ImplementLinkUsage["ImplementLinkUsage_Add"] = 0] = "ImplementLinkUsage_Add";
        ImplementLinkUsage[ImplementLinkUsage["ImplementLinkUsage_Remove"] = 1] = "ImplementLinkUsage_Remove";
        ImplementLinkUsage[ImplementLinkUsage["ImplementLinkUsage_Produce"] = 2] = "ImplementLinkUsage_Produce";
        ImplementLinkUsage[ImplementLinkUsage["ImplementLinkUsage_Handle"] = 3] = "ImplementLinkUsage_Handle";
        ImplementLinkUsage[ImplementLinkUsage["ImplementLinkUsage_Pin"] = 4] = "ImplementLinkUsage_Pin";
        ImplementLinkUsage[ImplementLinkUsage["ImplementLinkUsage_Unpin"] = 5] = "ImplementLinkUsage_Unpin";
        ImplementLinkUsage[ImplementLinkUsage["ImplementLinkUsage_CheckIn"] = 6] = "ImplementLinkUsage_CheckIn";
        ImplementLinkUsage[ImplementLinkUsage["ImplementLinkUsage_CheckOut"] = 7] = "ImplementLinkUsage_CheckOut";
        ImplementLinkUsage[ImplementLinkUsage["ImplementLinkUsage_DressUp"] = 8] = "ImplementLinkUsage_DressUp";
    })(ImplementLinkUsage || (exports.ImplementLinkUsage = ImplementLinkUsage = {}));
    var TimeConstraintsDependencyType;
    (function (TimeConstraintsDependencyType) {
        TimeConstraintsDependencyType[TimeConstraintsDependencyType["TCDependencyType_Unkown"] = 0] = "TCDependencyType_Unkown";
        TimeConstraintsDependencyType[TimeConstraintsDependencyType["TCDependencyType_FinishToStart"] = 1] = "TCDependencyType_FinishToStart";
        TimeConstraintsDependencyType[TimeConstraintsDependencyType["TCDependencyType_StartToStart"] = 2] = "TCDependencyType_StartToStart";
        TimeConstraintsDependencyType[TimeConstraintsDependencyType["TCDependencyType_FinishToFinish"] = 3] = "TCDependencyType_FinishToFinish";
        TimeConstraintsDependencyType[TimeConstraintsDependencyType["TCDependencyType_StartToFinish"] = 4] = "TCDependencyType_StartToFinish";
        TimeConstraintsDependencyType[TimeConstraintsDependencyType["TCDependencyType_PreviousCycle"] = 5] = "TCDependencyType_PreviousCycle";
    })(TimeConstraintsDependencyType || (exports.TimeConstraintsDependencyType = TimeConstraintsDependencyType = {}));
    var DelayMode;
    (function (DelayMode) {
        DelayMode[DelayMode["DelayMode_Unkown"] = 0] = "DelayMode_Unkown";
        DelayMode[DelayMode["DelayMode_minDelay"] = 1] = "DelayMode_minDelay";
        DelayMode[DelayMode["DelayMode_maxDelay"] = 2] = "DelayMode_maxDelay";
        DelayMode[DelayMode["DelayMode_synchro"] = 3] = "DelayMode_synchro";
    })(DelayMode || (exports.DelayMode = DelayMode = {}));
    var CapableResourceLinkType;
    (function (CapableResourceLinkType) {
        CapableResourceLinkType[CapableResourceLinkType["PrimaryCapableRscLink"] = 0] = "PrimaryCapableRscLink";
        CapableResourceLinkType[CapableResourceLinkType["SecondaryCapableRscLink"] = 1] = "SecondaryCapableRscLink";
        CapableResourceLinkType[CapableResourceLinkType["PrimaryCapableRscLinkDetail"] = 2] = "PrimaryCapableRscLinkDetail";
        CapableResourceLinkType[CapableResourceLinkType["SecondaryCapableRscLinkDetail"] = 3] = "SecondaryCapableRscLinkDetail";
    })(CapableResourceLinkType || (exports.CapableResourceLinkType = CapableResourceLinkType = {}));
});
