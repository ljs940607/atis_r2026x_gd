
import matrix.db.Context;
import com.dassault_systemes.EKLEngine.completion.CompletionJPOEvaluator;


/**
 * ${CLASSNAME}
 */
public final class VPMEditor_GetAllRepresentations_mxJPO extends CompletionJPOEvaluator {

	/**
	 * Attributes
	 */
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_0__PRODUCTCFG_div_VPMRef = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_1__PRODUCTCFG_div_VPMRep = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMRepReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_2__XCAD_CompleteItems_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("XCAD_CompleteItems");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_3__XCAD_CompleteNonPS_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("XCAD_CompleteNonPS");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_4__PRODUCTCFG_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_5__ProductCfg_ExpandVPMR = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_ExpandVPMRefToVPMRep");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_6__ProductCfg_ExpandVPMR = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_ExpandVPMRefToPRepVPMPortAppCnx");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_7__XCADAssembly_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("XCADAssembly");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_8__XcadAssembly_ExpandVP = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("XcadAssembly_ExpandVPMRefToXCADRepRepInst");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_9__MatAppliedExportDesig = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("MatAppliedExportDesign");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_10__RawMaterialSpecifica = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("RawMaterialSpecification");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_11__RawMat_retrieveAllAp = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("RawMat_retrieveAllAppliedRawMaterial");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_12__EngineeringInstructi = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("EngineeringInstructions");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_13__Instruction_Retrieve = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Instruction_RetrieveInstCnxUnderProduct");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_14__DIFModeler_GetAttach = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DIFModeler_GetAttachedPresentations");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_15__PLMDocConnection_div_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMDocConnection/PLMDocConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_16__PLMDocConnection_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMDocConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_17__PLMDocConnection_Nav = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMDocConnection_NavDocCnxToDoc");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_18__CATMCXAssembly_div_C = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("CATMCXAssembly/CATMCXMechanicalConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_19__CATMCXMechanicalConn = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("CATMCXMechanicalConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_20__CATMCXAssembly_NavMC = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("CATMCXAssembly_NavMCXToDoc");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_21__com_dot_dassault_sys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.platform.model.qualification.completion.ProductRepQualifCompletion_getVPMRepQualification");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_22__ProductCfg_AddVPMPor = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_AddVPMPorts");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_23__PLMKnowledgewareDisc = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMKnowledgewareDiscipline");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_24__KwaDiscipline_AddPoi = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("KwaDiscipline_AddPointedDesignTable");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_25__ProductCfg_NavVPMRep = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_NavVPMRepToFemAndRenderingDoc");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_26__PLMKnowHowRuleSet_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMKnowHowRuleSet");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_27__kwe_navigate_ruleset = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("kwe_navigate_ruleset");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_28__PLMKnowHowRuleSet_div_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMKnowHowRuleSet/PLMRuleSet");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_29__kwe_expand_rules_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("kwe_expand_rules");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_30__KWA_NavVPMRepToARMRe = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("KWA_NavVPMRepToARMRefAndRep");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_31__ProductCfg_Add3DPart = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_Add3DPartRepresentation");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_32__DocumentCompletion_a = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DocumentCompletion_allDocumentCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_33__ComposedRepCompletio = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ComposedRepCompletion_getAllComposedReps");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_34__ComposedRepCompletio = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ComposedRepCompletion_getComposerRef");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_35__Config_GetStructConf = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Config_GetStructConfig");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_36__PLMSpacePlanning_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMSpacePlanning");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_37__SPPConnection_addAll = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("SPPConnection_addAllSPPConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_38__PLMStructureDesign_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMStructureDesign");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_39__StrConnection_addAll = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("StrConnection_addAllStrConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_40__PLMPCBLibrary_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMPCBLibrary");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_41__PLMPCBLibrary_addFoo = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMPCBLibrary_addFootprintConnection");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_42__ElectricalManufactur = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ElectricalManufacturingPreparation");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_43__ElecMfgPreparation_a = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ElecMfgPreparation_addAllRelatedElements");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_44__com_dot_dassault_sys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.enovia.xapps.dsbsd.V1.implementations.util.VPMReferenceCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_45__com_dot_dassault_sys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.product.factory.services.ProductPosition.VPMReferenceExtPosCompletion");

	/**
	 * evaluate
	 * @param iContext
	 * @param iPLMIDSet
	 * @param oPLMIDSet
	 */
	public final void evaluate(matrix.db.Context iContext, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet oPLMIDSet)	
			throws Exception {
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsTmpRepRepInst = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsTmpPortsCnxPRep = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsTmpPortsCnxPRepARM = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsDocs = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsMCXDocs = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsPortsOnReps = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsPortsOnRepsARM = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsDesignTable = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsFemRendering = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsTmpRulesets = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsRuleEntities = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsTmpARMRefAndRep = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsARM3DPartRepRef = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsXCADRepRepInst = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsSPPConnection = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsFootPrintConnection = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsElecMfgPreprationRelation = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsStrConnection = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSet_Mat = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rsInstructionConnections = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsInputRefs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsInputReps = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsRepRepInst = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsPortsCnxPRep = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsPortsCnxPRepARM = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsMat = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsRawMat = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsLayout = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsTmpDocCnx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsTmpDocMcx = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsTmpAllReps = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsTmpRulesets = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsARMRefAndRep = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsTmpARMRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsConfig = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsDocument = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsComposedRep = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsComposerRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsXCADComposition = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsXCADDependencies = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsTerminologies = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsProductExtPos = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsProductQualifConnection = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		idsInputRefs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_0__PRODUCTCFG_div_VPMRef ) );
		idsInputReps.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_1__PRODUCTCFG_div_VPMRep ) );
		idsXCADComposition.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_2__XCAD_CompleteItems_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsInputRefs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( idsInputRefs, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , idsXCADComposition, _STRING_0__PRODUCTCFG_div_VPMRef ) ) );
		idsXCADDependencies.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_3__XCAD_CompleteNonPS_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsInputRefs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( idsInputRefs, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , idsXCADDependencies, _STRING_0__PRODUCTCFG_div_VPMRef ) ) );
		rsTmpRepRepInst.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__PRODUCTCFG_, _STRING_5__ProductCfg_ExpandVPMR, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsRepRepInst.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsTmpRepRepInst ) );
		rsTmpPortsCnxPRep.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__PRODUCTCFG_, _STRING_6__ProductCfg_ExpandVPMR, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsPortsCnxPRep.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsTmpPortsCnxPRep ) );
		rsXCADRepRepInst.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_7__XCADAssembly_, _STRING_8__XcadAssembly_ExpandVP, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsMat.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_9__MatAppliedExportDesig, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		PLMRouteSet_Mat.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_10__RawMaterialSpecifica, _STRING_11__RawMat_retrieveAllAp, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsRawMat.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSet_Mat ) );
		rsInstructionConnections.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_12__EngineeringInstructi, _STRING_13__Instruction_Retrieve, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsLayout.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_14__DIFModeler_GetAttach, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsTmpDocCnx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , idsPortsCnxPRep, _STRING_15__PLMDocConnection_div_ ) );
		rsDocs.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_16__PLMDocConnection_, _STRING_17__PLMDocConnection_Nav, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpDocCnx } ) );
		idsTmpDocMcx.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , idsPortsCnxPRep, _STRING_18__CATMCXAssembly_div_C ) );
		rsMCXDocs.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_19__CATMCXMechanicalConn, _STRING_20__CATMCXAssembly_NavMC, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpDocMcx } ) );
		idsTmpAllReps.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( idsInputReps, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , idsRepRepInst, _STRING_1__PRODUCTCFG_div_VPMRep ) ) );
		idsProductQualifConnection.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_21__com_dot_dassault_sys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpAllReps } ) );
		rsPortsOnReps.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__PRODUCTCFG_, _STRING_22__ProductCfg_AddVPMPor, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpAllReps } ) );
		rsDesignTable.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_23__PLMKnowledgewareDisc, _STRING_24__KwaDiscipline_AddPoi, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpAllReps } ) );
		rsFemRendering.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__PRODUCTCFG_, _STRING_25__ProductCfg_NavVPMRep, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpAllReps } ) );
		rsTmpRulesets.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_26__PLMKnowHowRuleSet_, _STRING_27__kwe_navigate_ruleset, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpAllReps } ) );
		idsTmpRulesets.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsTmpRulesets ), _STRING_28__PLMKnowHowRuleSet_div_ ) );
		rsRuleEntities.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_26__PLMKnowHowRuleSet_, _STRING_29__kwe_expand_rules_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpRulesets } ) );
		rsTmpARMRefAndRep.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_23__PLMKnowledgewareDisc, _STRING_30__KWA_NavVPMRepToARMRe, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpAllReps } ) );
		idsARMRefAndRep.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsTmpARMRefAndRep ) );
		idsTmpARMRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , idsARMRefAndRep, _STRING_0__PRODUCTCFG_div_VPMRef ) );
		rsARM3DPartRepRef.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__PRODUCTCFG_, _STRING_31__ProductCfg_Add3DPart, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpARMRef } ) );
		rsTmpPortsCnxPRepARM.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__PRODUCTCFG_, _STRING_6__ProductCfg_ExpandVPMR, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsTmpARMRef } ) );
		idsPortsCnxPRepARM.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsTmpPortsCnxPRepARM ) );
		rsPortsOnRepsARM.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__PRODUCTCFG_, _STRING_22__ProductCfg_AddVPMPor, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsARM3DPartRepRef ), _STRING_1__PRODUCTCFG_div_VPMRep ) } ) );
		idsDocument.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_32__DocumentCompletion_a, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsComposedRep.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_33__ComposedRepCompletio, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsComposerRef.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_34__ComposedRepCompletio, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputReps } ) );
		idsConfig.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_35__Config_GetStructConf, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { iPLMIDSet } ) );
		rsSPPConnection.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_36__PLMSpacePlanning_, _STRING_37__SPPConnection_addAll, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		rsStrConnection.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_38__PLMStructureDesign_, _STRING_39__StrConnection_addAll, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		rsFootPrintConnection.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_40__PLMPCBLibrary_, _STRING_41__PLMPCBLibrary_addFoo, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		rsElecMfgPreprationRelation.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_42__ElectricalManufactur, _STRING_43__ElecMfgPreparation_a, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsTerminologies.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_44__com_dot_dassault_sys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		idsProductExtPos.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_45__com_dot_dassault_sys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputRefs } ) );
		oPLMIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( iPLMIDSet, idsRepRepInst ), idsPortsCnxPRep ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsXCADRepRepInst ) ), idsMat ), idsRawMat ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsInstructionConnections ) ), idsLayout ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsDocs ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsMCXDocs ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsPortsOnReps ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsDesignTable ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsFemRendering ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsRuleEntities ) ), idsARMRefAndRep ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsARM3DPartRepRef ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsSPPConnection ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsStrConnection ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsFootPrintConnection ) ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsElecMfgPreprationRelation ) ), idsConfig ), idsXCADDependencies ), idsXCADComposition ), idsDocument ), idsComposedRep ), idsComposerRef ), idsPortsCnxPRepARM ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rsPortsOnRepsARM ) ), idsTerminologies ), idsProductExtPos ), idsProductQualifConnection ) );
	}
}
