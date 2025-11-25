
import matrix.db.Context;
import com.dassault_systemes.EKLEngine.completion.CompletionJPOEvaluator;


/**
 * ${CLASSNAME}
 */
public final class VPMEditor_GetAllWithoutRepresentations_mxJPO extends CompletionJPOEvaluator {

	/**
	 * Attributes
	 */
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_0__PRODUCTCFG_div_VPMRef = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_1__PRODUCTCFG_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_2__ProductCfg_AddLPPriva = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_AddLPPrivateRep");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_3__XCADAssembly_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("XCADAssembly");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_4__XcadAssembly_ExpandVP = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("XcadAssembly_ExpandVPMRefToXCADRepRepInst");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_5__ProductCfg_Add3DPartR = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_Add3DPartRepresentation");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_6__PRODUCTCFG_div_VPMRep = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMRepReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_7__com_dot_dassault_syst = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.platform.model.qualification.completion.ProductRepQualifCompletion_getVPMRepQualification");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_8__ProductCfg_AddVPMPort = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_AddVPMPortsAndConnections");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_9__RFLPLMImplementConnec = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("RFLPLMImplementConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_10__RFLPLMImplementConne = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("RFLPLMImplementConnection_AddAllImplementCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_11__MatAppliedExportDesi = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("MatAppliedExportDesign");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_12__CATMCXAssembly_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("CATMCXAssembly");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_13__CATMCXAssembly_AddAl = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("CATMCXAssembly_AddAllAggregatedMCX");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_14__PLMFst_Fasteners_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMFst_Fasteners");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_15__PLMFst_Fasteners_Add = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMFst_Fasteners_AddAllAggregatedCNX");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_16__PLMDocConnection_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMDocConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_17__PLMDocConnection_ret = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMDocConnection_retrieveAllDocuments");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_18__PLMWspSpecFilter_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMWspSpecFilter");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_19__PLMWspSpecFilter_Add = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMWspSpecFilter_AddAllAggregatedSpecPVS");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_20__PLMEnsGrouping_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMEnsGrouping");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_21__PLMEnsGrouping_AddGr = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMEnsGrouping_AddGrouping");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_22__PLMLSRRouteConnectio = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMLSRRouteConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_23__PLMLSRRouteConnectio = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMLSRRouteConnection_AddLsrCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_24__PLMSpacePlanning_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMSpacePlanning");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_25__SPPConnection_addAll = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("SPPConnection_addAllSPPConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_26__PLMStructureDesign_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMStructureDesign");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_27__StrConnection_addAll = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("StrConnection_addAllStrConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_28__PLMPCBLibrary_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMPCBLibrary");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_29__PLMPCBLibrary_addFoo = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMPCBLibrary_addFootprintConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_30__RawMaterialSpecifica = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("RawMaterialSpecification");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_31__RawMat_retrieveAllAp = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("RawMat_retrieveAllAppliedRawMaterial");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_32__EngineeringInstructi = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("EngineeringInstructions");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_33__Instruction_Retrieve = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Instruction_RetrieveInstCnxUnderProduct");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_34__DocumentCompletion_a = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DocumentCompletion_allDocumentCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_35__Config_GetStructConf = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Config_GetStructConfig");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_36__com_dot_dassault_sys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.enovia.xapps.dsbsd.V1.implementations.util.VPMReferenceCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_37__com_dot_dassault_sys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.product.factory.services.ProductPosition.VPMReferenceExtPosCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_38__ElectricalManufactur = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ElectricalManufacturingPreparation");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_39__ElecMfgPreparation_a = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ElecMfgPreparation_addAllRelatedElements");

	/**
	 * evaluate
	 * @param iContext
	 * @param iPLMIDSet
	 * @param oPLMIDSet
	 */
	public final void evaluate(matrix.db.Context iContext, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet oPLMIDSet)	
			throws Exception {
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet1 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet2 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet4 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet5 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet7 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet10 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet11 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet12 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet13 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet14 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet15 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet16 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet17 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet18 = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsInstructionConnections = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsXCADRepRepInst = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsTerminologies = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSet5 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSet7 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSet8 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSet9 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSet_Mat = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetRestrictedRefAndRep = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetRestricted = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsConfig = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsDocument = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsProductExtPos = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsElecMfgPreprationRelation = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsProductQualifConnection = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		PLMIDSetRestricted.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_0__PRODUCTCFG_div_VPMRef ) );
		PLMRouteSet1.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_1__PRODUCTCFG_, _STRING_2__ProductCfg_AddLPPriva, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		rsXCADRepRepInst.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_3__XCADAssembly_, _STRING_4__XcadAssembly_ExpandVP, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet5.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_1__PRODUCTCFG_, _STRING_5__ProductCfg_Add3DPartR, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMIDSet5.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet5 ) );
		PLMIDSetRestrictedRefAndRep.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , PLMIDSet5, _STRING_6__PRODUCTCFG_div_VPMRep ), PLMIDSetRestricted ) );
		idsProductQualifConnection.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_7__com_dot_dassault_syst, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestrictedRefAndRep } ) );
		PLMRouteSet2.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_1__PRODUCTCFG_, _STRING_8__ProductCfg_AddVPMPort, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestrictedRefAndRep } ) );
		PLMRouteSet4.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_9__RFLPLMImplementConnec, _STRING_10__RFLPLMImplementConne, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMIDSet_Mat.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_11__MatAppliedExportDesi, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet10.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_12__CATMCXAssembly_, _STRING_13__CATMCXAssembly_AddAl, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet15.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_14__PLMFst_Fasteners_, _STRING_15__PLMFst_Fasteners_Add, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet11.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_16__PLMDocConnection_, _STRING_17__PLMDocConnection_ret, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet12.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_18__PLMWspSpecFilter_, _STRING_19__PLMWspSpecFilter_Add, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet7.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_20__PLMEnsGrouping_, _STRING_21__PLMEnsGrouping_AddGr, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet13.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_22__PLMLSRRouteConnectio, _STRING_23__PLMLSRRouteConnectio, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet14.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_24__PLMSpacePlanning_, _STRING_25__SPPConnection_addAll, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet16.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_26__PLMStructureDesign_, _STRING_27__StrConnection_addAll, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet17.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_28__PLMPCBLibrary_, _STRING_29__PLMPCBLibrary_addFoo, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		PLMRouteSet18.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_30__RawMaterialSpecifica, _STRING_31__RawMat_retrieveAllAp, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		rsInstructionConnections.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_32__EngineeringInstructi, _STRING_33__Instruction_Retrieve, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		idsDocument.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_34__DocumentCompletion_a, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		idsConfig.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_35__Config_GetStructConf, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { iPLMIDSet } ) );
		idsTerminologies.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_36__com_dot_dassault_sys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		idsProductExtPos.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_37__com_dot_dassault_sys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		rsElecMfgPreprationRelation.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_38__ElectricalManufactur, _STRING_39__ElecMfgPreparation_a, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetRestricted } ) );
		oPLMIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet1 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsXCADRepRepInst ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet2 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet4 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet5 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet10 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet11 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet12 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet7 ) ), PLMIDSet_Mat ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsElecMfgPreprationRelation ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet13 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet14 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet15 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet16 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet17 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet18 ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsInstructionConnections ) ), idsConfig ), idsDocument ), idsTerminologies ), idsProductExtPos ), idsProductQualifConnection ) );
	}
}
