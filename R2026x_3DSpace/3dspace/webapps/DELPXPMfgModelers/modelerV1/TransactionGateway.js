define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TransactionGateway = void 0;
    class TransactionGateway {
        constructor() {
            this._createdObjs = { ImplementLink: [], OperationReference: [], OperationInstance: [], MfgItemReference: [], MfgItemInstance: [], CapableRscReference: [], CapableRscInstance: [], TimeConstraint: [], CapableResourceLink: [], CapableResourceLinkDetail: [], ScopeLink: [], CapableRscStructureLink: [], ProcessReference: [] };
            this._updatedObjs = { ImplementLink: [], OperationReference: [], OperationInstance: [], MfgItemReference: [], MfgItemInstance: [], CapableRscReference: [], CapableRscInstance: [], TimeConstraint: [], CapableResourceLink: [], CapableResourceLinkDetail: [], ScopeLink: [], CapableRscStructureLink: [], ProcessReference: [] };
            this._deletedPIDs = { implementLinks: [], operationRef: [], operationInst: [], mfgItemRef: [], mfgItemInst: [], capRscRef: [], capRscInst: [], timeConstraint: [], capableResourceLink: [], capableResourceLinkDetail: [], processRef: [], scopeLink: [], capRscStructLink: [] };
        }
        ;
        getUpdatedObj() { return this._updatedObjs; }
        ;
        getCreatedObjs() { return this._createdObjs; }
        ;
        getDeletedObj() { return this._deletedPIDs; }
        ;
        createProcessReference(iProcessReference) {
            // this._createdObjs.push(iProcessReference);
        }
        createOperationReference(iOperationReferece) {
            this._createdObjs.OperationReference.push(iOperationReferece);
        }
        createOperationInstance(iOperationInstance) {
            this._createdObjs.OperationInstance.push(iOperationInstance);
        }
        createMfgItemReference(iMfgItemReference) {
            this._createdObjs.MfgItemReference.push(iMfgItemReference);
        }
        createMfgItemInstance(iMfgItemInstance) {
            this._createdObjs.MfgItemInstance.push(iMfgItemInstance);
        }
        createCapRscRef(iCapableRscRef) {
            this._createdObjs.CapableRscReference.push(iCapableRscRef);
        }
        createCapRscInst(iCapableRscInst) {
            this._createdObjs.CapableRscInstance.push(iCapableRscInst);
        }
        createScopeLink(iScopeLink) {
            this._createdObjs.ScopeLink.push(iScopeLink);
        }
        createCapableRscStructureLink(iCapableRscStructLink) {
            this._createdObjs.CapableRscStructureLink.push(iCapableRscStructLink);
        }
        createTimeConstraint(iTimeConstraint) {
            this._createdObjs.TimeConstraint.push(iTimeConstraint);
        }
        createImplementLink(iImplementLink) {
            this._createdObjs.ImplementLink.push(iImplementLink);
        }
        createCapableResourceLink(iCapableRscLink) {
            this._createdObjs.CapableResourceLink.push(iCapableRscLink);
        }
        createCapableResourceLinkDetail(iCapableRscLinkDetail) {
            this._createdObjs.CapableResourceLinkDetail.push(iCapableRscLinkDetail);
        }
        //////////////UpdateMethods//////////
        updateProcessReference(iProcessReference) {
            //this._updatedObjs.push(iProcessReference);
        }
        updateOperationReference(iOperationReferece) {
            this._updatedObjs.OperationReference.push(iOperationReferece);
        }
        updateOperationInstance(iOperationInstance) {
            this._updatedObjs.OperationInstance.push(iOperationInstance);
        }
        updateMfgItemReference(iMfgItemReference) {
            this._updatedObjs.MfgItemReference.push(iMfgItemReference);
        }
        updateMfgItemInstance(iMfgItemInstance) {
            this._updatedObjs.MfgItemInstance.push(iMfgItemInstance);
        }
        updateCapRscRef(iCapableRscRef) {
            this._updatedObjs.CapableRscReference.push(iCapableRscRef);
        }
        updateCapRscInst(iCapableRscInst) {
            this._updatedObjs.CapableRscInstance.push(iCapableRscInst);
        }
        updateScopeLink(iScopeLink) {
            this._updatedObjs.ScopeLink.push(iScopeLink);
        }
        updateCapableRscStructureLink(iCapableRscStructLink) {
            this._updatedObjs.CapableRscStructureLink.push(iCapableRscStructLink);
        }
        updateTimeConstraint(iTimeConstraint) {
            this._updatedObjs.TimeConstraint.push(iTimeConstraint);
        }
        updateImplementLink(iImplementLink) {
            this._updatedObjs.ImplementLink.push(iImplementLink);
        }
        updateCapableResourceLink(iCapableRscLink) {
            this._updatedObjs.CapableResourceLink.push(iCapableRscLink);
        }
        updateCapableResourceLinkDetail(iCapableRscLinkDetail) { this._updatedObjs.CapableResourceLinkDetail.push(iCapableRscLinkDetail); }
        //////////////DeleteMethods//////////
        deleteProcessReference(iProcessRefPID) {
            //this._deletedPIDs.push(iImplementLinkPID);
        }
        deleteOperationReference(iOperationReferencePID) {
            this._deletedPIDs.operationRef.push(iOperationReferencePID);
        }
        deleteOperationInstance(iOperationInstancePID) {
            this._deletedPIDs.operationInst.push(iOperationInstancePID);
        }
        deleteMfgItemReference(iMfgItemReferencePID) {
            this._deletedPIDs.mfgItemRef.push(iMfgItemReferencePID);
        }
        deleteMfgItemInstance(iMfgItemInstancePID) {
            this._deletedPIDs.mfgItemInst.push(iMfgItemInstancePID);
        }
        deleteCapRscRef(iCapRscRefPID) {
            this._deletedPIDs.capRscRef.push(iCapRscRefPID);
        }
        deleteCapRscInst(iCapRscInstPID) {
            this._deletedPIDs.capRscInst.push(iCapRscInstPID);
        }
        deleteScopeLink(iScopeLinkPID) {
            this._deletedPIDs.scopeLink.push(iScopeLinkPID);
        }
        deleteCapableRscStructureLink(iCapableRscStructureLinkPID) {
            //this._deletedPIDs.push(iCapableRscStructureLinkPID);
        }
        deleteTimeConstraint(iTimeconstraintPID) {
            this._deletedPIDs.timeConstraint.push(iTimeconstraintPID);
        }
        deleteImplementLink(iImplementLinkPID) {
            this._deletedPIDs.implementLinks.push(iImplementLinkPID);
        }
        deleteCapableResourceLink(iCapableRscLinkPID) {
            this._deletedPIDs.capableResourceLink.push(iCapableRscLinkPID);
        }
        deleteCapableResourceLinkDetail(iCapableRscLinkDetailPID) {
            this._deletedPIDs.capableResourceLinkDetail.push(iCapableRscLinkDetailPID);
        }
    }
    exports.TransactionGateway = TransactionGateway;
});
