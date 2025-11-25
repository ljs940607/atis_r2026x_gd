
import matrix.db.Context;
import com.dassault_systemes.EKLEngine.completion.CompletionJPOEvaluator;


/**
 * ${CLASSNAME}
 */
public final class Process_TSO_References_mxJPO extends CompletionJPOEvaluator {

	/**
	 * Attributes
	 */
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_0__DELLmiProductionSyste = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionSystemPPR/DELLmiPPRSystemReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_1__DELLmiProductionOpera = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionOperationPPR/DELLmiOperationPPRInstance");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_2__DELLmiProductionOpera = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionOperationPPR/DELLmiOperationPPRReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_3__DELLmiProductionSyste = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionSystemAbstract/DELLmiAbstractProductionEntity");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_4__PLMCORE_div_PLMCoreRe = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMCORE/PLMCoreReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_5__DELLmiWorkOrder_div_D = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiWorkOrder/DELLmiWorkOrderReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_6__DELLmiProductionExecH = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionExecHeaderOperation/DELLmiExecHeaderOperationReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_7__DELLmiProductionPlan_div_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionPlan/DELLmiProductionPlanReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_8__com_dot_dassault_syst = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.platform.model.process.procedures.ProcedureCalls_GetResourceParameterPlansAndParameters");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_9__DELLmiProductionSyste = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionSystemAbstract");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_10__ENOPsm_ProductionSys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ENOPsm_ProductionSystem_addAllPortsRepInstAndCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_11__all_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("all");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_12__DELLmiProductionSyst = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionSystemIOPort/DELLmiProdSystemIOPort");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_13__DELLmiProductionCand = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionCandidateResCnx/DELLmiCandidateResourcesCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_14__DELLmiProductionTime = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionTimeConstraintCnx/DELLmiTimeConstraintCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_15__DELLmiProductionMate = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionMaterialPathCnx1/DELLmiMaterialPathCnxCust");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_16__DELLmiProductionSyst = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionSystemIOCnx/DELLmiProductionSystemIOCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_17__DELAsmAssemblyModelC = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELAsmAssemblyModelCnx/DELAsmProcessCanUseCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_18__DELLmiProductionSyst = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiProductionSystemOutputCnxAbstract/DELLmiProductionSystemOutputCnxAbstract");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_19__PLMRequirementSpecif = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMRequirementSpecifyHowToCnxAbstract/PLMReqSpecifyHowToCnxAbstract");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_20__RFLPLMImplementConne = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("RFLPLMImplementConnection/RFLPLMImplementConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_21__PLMHistorizationCnx_div_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMHistorizationCnx/PLMHistoLinkCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_22__DELAsmAssemblyModelC = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELAsmAssemblyModelCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_23__DELAsmAssemblyModelC = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELAsmAssemblyModelCnx_addAllDocuments");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_24__ENOPsm_CandidateReso = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ENOPsm_CandidateResourceCnx_addAllDocuments");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_25__Class_div_DOCUMENTS_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Class/DOCUMENTS");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_26__DocumentCompletion_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DocumentCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_27__PLMDocConnection_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMDocConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_28__PLMDocConnection_ret = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMDocConnection_retrieveAllConnections");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_29__DELPPRContextModel_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELPPRContextModel");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_30__ENOPsm_ProductionSys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ENOPsm_ProductionSystem_addOutputEntitiesWithoutCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_31__PRODUCTCFG_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_32__ProductCfg_AddChildr = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_AddChildrenProduct");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_33__PRODUCTCFG_div_VPMRe = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_34__VPMEditor_GetAllRepr = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("VPMEditor_GetAllRepresentations");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_35__PRODUCTCFG_div_VPMRe = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMRepReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_36__VPMEditor_TSO_VPMRef = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("VPMEditor_TSO_VPMReferenceVPMRepReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_37__PRODUCTCFG_div_VPMIn = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMInstance");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_38__PRODUCTCFG_div_VPMRe = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMRepInstance");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_39__VPMEditor_TSO_VPMIns = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("VPMEditor_TSO_VPMInstance");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_40__ENOPsm_ProductionSys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ENOPsm_ProductionSystem_addSerializedFromRelation");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_41__ENOPsm_WorkOrder_add = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ENOPsm_WorkOrder_addWhereResourceRelation");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_42__ENOPsm_WorkOrder_add = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ENOPsm_WorkOrder_addWhoResourceRelation");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_43__com_dot_dassault_sys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.platform.model.process.procedures.ProcedureCalls_ExecutionTimeCst");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_44__DELLmiQtyControlProc = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELLmiQtyControlProcess/DELLmiQtyControlProcessReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_45__com_dot_dassault_sys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.platform.model.process.procedures.ProcedureCalls_GetTriggerSpecCnx");

	/**
	 * evaluate
	 * @param iContext
	 * @param iPLMIDSet
	 * @param oPLMIDSet
	 */
	public final void evaluate(matrix.db.Context iContext, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet oPLMIDSet)	
			throws Exception {
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetPortsAndCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetCapableDocuments = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetCandidateDocuments = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetAttachedDocCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetProducts = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetSerial = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetWhereResource = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetWhoResource = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetOutputs = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetSystemRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetOpInst = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetAllRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetSystemRefOpInst = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDAllRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetPortsAndCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetIOPorts = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetCandidateCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetTimeCstCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetFlowCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetIOCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetCapableCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetCapableDocuments = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetImplementedCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetOutputCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetHowToCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetCandidateDocuments = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetAttachedDocCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetProducts = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetProductStructure = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetProductRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetProductRefrep = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetTSORef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetProductInst = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetTSOInst = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDWOAndExecHeaderOpRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDExecRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDExecOp = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSerial = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDWhereResource = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDWhoResource = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDTCRel = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetOutputs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetHistoRefCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDWorkOrder = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetHeaderAndWO = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDAllDoc = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDDocsAndScope = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetOpRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDParamPlan = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetQtyControlProcessRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetTriggerSpecCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		PLMIDSetSystemRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_0__DELLmiProductionSyste ) );
		PLMIDSetOpInst.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_1__DELLmiProductionOpera ) );
		PLMIDSetOpRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_2__DELLmiProductionOpera ) );
		PLMIDSetAllRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_3__DELLmiProductionSyste ) );
		PLMIDSetSystemRefOpInst.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( PLMIDSetSystemRef, PLMIDSetOpInst ) );
		PLMIDAllRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_4__PLMCORE_div_PLMCoreRe ) );
		PLMIDWOAndExecHeaderOpRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_5__DELLmiWorkOrder_div_D ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_6__DELLmiProductionExecH ) ) );
		PLMIDExecRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_7__DELLmiProductionPlan_div_ ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_5__DELLmiWorkOrder_div_D ) ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_6__DELLmiProductionExecH ) ) );
		PLMIDExecOp.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_6__DELLmiProductionExecH ) );
		PLMIDWorkOrder.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_5__DELLmiWorkOrder_div_D ) );
		PLMIDSetHeaderAndWO.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( PLMIDExecOp, PLMIDWorkOrder ) );
		PLMIDParamPlan.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_8__com_dot_dassault_syst, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetOpRef } ) );
		PLMRouteSetPortsAndCnx.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_9__DELLmiProductionSyste, _STRING_10__ENOPsm_ProductionSys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetAllRef } ) );
		PLMIDSetPortsAndCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetPortsAndCnx, _STRING_11__all_ ) );
		PLMIDSetIOPorts.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_12__DELLmiProductionSyst ) );
		PLMIDSetCandidateCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_13__DELLmiProductionCand ) );
		PLMIDSetTimeCstCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_14__DELLmiProductionTime ) );
		PLMIDSetFlowCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_15__DELLmiProductionMate ) );
		PLMIDSetIOCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_16__DELLmiProductionSyst ) );
		PLMIDSetCapableCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_17__DELAsmAssemblyModelC ) );
		PLMIDSetOutputCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_18__DELLmiProductionSyst ) );
		PLMIDSetHowToCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_19__PLMRequirementSpecif ) );
		PLMIDSetImplementedCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_20__RFLPLMImplementConne ) );
		PLMIDSetHistoRefCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetPortsAndCnx, _STRING_21__PLMHistorizationCnx_div_ ) );
		PLMRouteSetCapableDocuments.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_22__DELAsmAssemblyModelC, _STRING_23__DELAsmAssemblyModelC, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetCapableCnx } ) );
		PLMIDSetCapableDocuments.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetCapableDocuments, _STRING_11__all_ ) );
		PLMRouteSetCandidateDocuments.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_9__DELLmiProductionSyste, _STRING_24__ENOPsm_CandidateReso, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetCandidateCnx } ) );
		PLMIDSetCandidateDocuments.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetCandidateDocuments, _STRING_11__all_ ) );
		PLMIDAllDoc.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetCapableDocuments, _STRING_25__Class_div_DOCUMENTS_ ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetCandidateDocuments, _STRING_25__Class_div_DOCUMENTS_ ) ) );
		PLMIDDocsAndScope.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_26__DocumentCompletion_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDAllDoc } ) );
		PLMRouteSetAttachedDocCnx.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_27__PLMDocConnection_, _STRING_28__PLMDocConnection_ret, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDAllRef } ) );
		PLMIDSetAttachedDocCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetAttachedDocCnx, _STRING_11__all_ ) );
		PLMRouteSetOutputs.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_29__DELPPRContextModel_, _STRING_30__ENOPsm_ProductionSys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetOutputCnx } ) );
		PLMIDSetOutputs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetOutputs, _STRING_11__all_ ) );
		PLMRouteSetProducts.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_31__PRODUCTCFG_, _STRING_32__ProductCfg_AddChildr, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetOutputs, _STRING_33__PRODUCTCFG_div_VPMRe ) } ) );
		PLMIDSetProducts.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetProducts, _STRING_11__all_ ) );
		PLMIDSetProductRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetProducts, _STRING_33__PRODUCTCFG_div_VPMRe ) );
		PLMIDSetProductStructure.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_34__VPMEditor_GetAllRepr, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetProductRef } ) );
		PLMIDSetProductRefrep.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetProducts, _STRING_33__PRODUCTCFG_div_VPMRe ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetProductStructure, _STRING_33__PRODUCTCFG_div_VPMRe ) ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetProductStructure, _STRING_35__PRODUCTCFG_div_VPMRe ) ) );
		PLMIDSetTSORef.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_36__VPMEditor_TSO_VPMRef, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetProductRefrep } ) );
		PLMIDSetProductInst.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetProducts, _STRING_37__PRODUCTCFG_div_VPMIn ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetProductStructure, _STRING_37__PRODUCTCFG_div_VPMIn ) ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetProductStructure, _STRING_38__PRODUCTCFG_div_VPMRe ) ) );
		PLMIDSetTSOInst.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_39__VPMEditor_TSO_VPMIns, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetProductInst } ) );
		PLMRouteSetSerial.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_9__DELLmiProductionSyste, _STRING_40__ENOPsm_ProductionSys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDWOAndExecHeaderOpRef } ) );
		PLMIDSerial.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetSerial ) );
		PLMRouteSetWhereResource.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_9__DELLmiProductionSyste, _STRING_41__ENOPsm_WorkOrder_add, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDExecRef } ) );
		PLMIDWhereResource.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetWhereResource ) );
		PLMRouteSetWhoResource.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_9__DELLmiProductionSyste, _STRING_42__ENOPsm_WorkOrder_add, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDExecOp } ) );
		PLMIDWhoResource.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetWhoResource ) );
		PLMIDTCRel.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_43__com_dot_dassault_sys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetHeaderAndWO } ) );
		PLMIDSetQtyControlProcessRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSetSystemRef, _STRING_44__DELLmiQtyControlProc ) );
		PLMIDSetTriggerSpecCnx.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_45__com_dot_dassault_sys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetQtyControlProcessRef } ) );
		oPLMIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( iPLMIDSet, PLMIDSetIOPorts ), PLMIDSetCapableCnx ), PLMIDSetCapableDocuments ), PLMIDSetCandidateCnx ), PLMIDSetCandidateDocuments ), PLMIDSetTimeCstCnx ), PLMIDSetFlowCnx ), PLMIDSetIOCnx ), PLMIDSetOutputCnx ), PLMIDSetHowToCnx ), PLMIDSetImplementedCnx ), PLMIDSetAttachedDocCnx ), PLMIDSetOutputs ), PLMIDSetProductRefrep ), PLMIDSetTSORef ), PLMIDSetProductInst ), PLMIDSetTSOInst ), PLMIDSerial ), PLMIDWhereResource ), PLMIDWhoResource ), PLMIDTCRel ), PLMIDSetHistoRefCnx ), PLMIDParamPlan ), PLMIDSetTriggerSpecCnx ) );
	}
}
