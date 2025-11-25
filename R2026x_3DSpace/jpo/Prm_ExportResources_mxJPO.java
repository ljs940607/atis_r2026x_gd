
import matrix.db.Context;
import com.dassault_systemes.EKLEngine.completion.CompletionJPOEvaluator;


/**
 * ${CLASSNAME}
 */
public final class Prm_ExportResources_mxJPO extends CompletionJPOEvaluator {

	/**
	 * Attributes
	 */
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_0__PLMResourceSetRep_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMResourceSetRep");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_1__prm_navigate_ref_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("prm_navigate_ref");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_2__prm_navigate_repref_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("prm_navigate_repref");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_3__PRODUCTCFG_div_VPMRep = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMRepReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_4__PRODUCTCFG_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_5__ProductCfg_Add3DPartR = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_Add3DPartReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_6__prm_navigate_cbp_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("prm_navigate_cbp");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_7__prm_navigate_doc_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("prm_navigate_doc");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_8__DocumentCompletion_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DocumentCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_9__ENOCLG_LIBRARY_div_EN = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ENOCLG_LIBRARY/ENOCLG_LibraryReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_10__Clg_ExportCatalog_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Clg_ExportCatalog");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_11__ENOCLG_CLASS_div_ENO = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ENOCLG_CLASS/ENOCLG_ClassReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_12__Clg_ExportChapter_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Clg_ExportChapter");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_13__PLMKnowledgeTemplate = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMKnowledgeTemplate/PLMTemplateRepReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_14__Pkt_ExportTemplate_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Pkt_ExportTemplate");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_15__PRODUCTCFG_div_VPMRe = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_16__ProductCfg_AddChildr = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ProductCfg_AddChildrenProduct");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_17__VPMEditor_GetAllRepr = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("VPMEditor_GetAllRepresentations");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_18__PLMKnowHowRuleSet_div_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMKnowHowRuleSet/PLMRuleSet");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_19__Kwe_ExportRuleSet_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Kwe_ExportRuleSet");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_20__PLMKbaAppliComponent = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMKbaAppliComponent/PLMKbaAppliComponent");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_21__Kba_ExportAppComp_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Kba_ExportAppComp");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_22__RFLVPMLogical_div_RF = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("RFLVPMLogical/RFLVPMLogicalReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_23__Logical_ExportRefere = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Logical_ExportReference_Design");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_24__PLMEnsSpecSpecificat = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMEnsSpecSpecification/EnsSpecification");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_25__ESE_SpecExport_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ESE_SpecExport");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_26__PLMEnsSpecTechnoTabl = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMEnsSpecTechnoTable/EnsTechnologicalTable");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_27__ESE_TechnoTableExpor = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("ESE_TechnoTableExport");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_28__PLMKnowHowLibrary_div_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PLMKnowHowLibrary/PLMEKLLibrary");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_29__Kwe_ExportEKLLibrary = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Kwe_ExportEKLLibrary");

	/**
	 * evaluate
	 * @param iContext
	 * @param iPLMIDSet
	 * @param oPLMIDSet
	 */
	public final void evaluate(matrix.db.Context iContext, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet oPLMIDSet)	
			throws Exception {
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsARMpointedCoreRef = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsARMpointedCoreRepRef = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsARMpointedBO = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsARMpointedDocs = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsProductStructure = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet rs3DPartRefs = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsARMpointedCoreRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsARMpointedCoreRepRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsARMpointedBO = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsARMpointedDocs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsDocsAndScope = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsCatalogs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsCatalogsContents = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsChapters = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsChaptersContents = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsTemplates = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsTemplatesStructure = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsProductStructureInputs1 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsProductStructureInputs2 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsProductStructure1 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsProductStructure2 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsRulesets = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsRulesetsContents = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsKComps = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsKCompStructure = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsLogicalPKT1 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsLogicalPKT2 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsEnsSpecs1 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsEnsSpecs2 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsEnsTechTables1 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsEnsTechTables2 = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsEKLLibs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsEKLLibsContents = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet idsInputReps = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		RsARMpointedCoreRef.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_0__PLMResourceSetRep_, _STRING_1__prm_navigate_ref_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { iPLMIDSet } ) );
		IdsARMpointedCoreRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsARMpointedCoreRef ) );
		RsARMpointedCoreRepRef.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_0__PLMResourceSetRep_, _STRING_2__prm_navigate_repref_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { iPLMIDSet } ) );
		IdsARMpointedCoreRepRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsARMpointedCoreRepRef ) );
		idsInputReps.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRepRef, _STRING_3__PRODUCTCFG_div_VPMRep ) );
		rs3DPartRefs.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__PRODUCTCFG_, _STRING_5__ProductCfg_Add3DPartR, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { idsInputReps } ) );
		RsARMpointedBO.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_0__PLMResourceSetRep_, _STRING_6__prm_navigate_cbp_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { iPLMIDSet } ) );
		IdsARMpointedBO.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsARMpointedBO ) );
		RsARMpointedDocs.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_0__PLMResourceSetRep_, _STRING_7__prm_navigate_doc_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { iPLMIDSet } ) );
		IdsARMpointedDocs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsARMpointedDocs ) );
		IdsDocsAndScope.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_8__DocumentCompletion_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsARMpointedDocs } ) );
		IdsCatalogs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRef, _STRING_9__ENOCLG_LIBRARY_div_EN ) );
		IdsCatalogsContents.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_10__Clg_ExportCatalog_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsCatalogs } ) );
		IdsChapters.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRef, _STRING_11__ENOCLG_CLASS_div_ENO ) );
		IdsChaptersContents.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_12__Clg_ExportChapter_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsChapters } ) );
		IdsTemplates.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRepRef, _STRING_13__PLMKnowledgeTemplate ) );
		IdsTemplatesStructure.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_14__Pkt_ExportTemplate_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsTemplates } ) );
		IdsProductStructureInputs1.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRef, _STRING_15__PRODUCTCFG_div_VPMRe ) );
		RsProductStructure.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__PRODUCTCFG_, _STRING_16__ProductCfg_AddChildr, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsProductStructureInputs1 } ) );
		IdsProductStructure1.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsProductStructure ), com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( rs3DPartRefs ) ) );
		IdsProductStructureInputs2.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsProductStructure1, _STRING_15__PRODUCTCFG_div_VPMRe ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsProductStructure1, _STRING_3__PRODUCTCFG_div_VPMRep ) ), com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRepRef, _STRING_3__PRODUCTCFG_div_VPMRep ) ) );
		IdsProductStructure2.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_17__VPMEditor_GetAllRepr, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsProductStructureInputs2 } ) );
		IdsRulesets.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRef, _STRING_18__PLMKnowHowRuleSet_div_ ) );
		IdsRulesetsContents.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_19__Kwe_ExportRuleSet_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsRulesets } ) );
		IdsKComps.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRepRef, _STRING_20__PLMKbaAppliComponent ) );
		IdsKCompStructure.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_21__Kba_ExportAppComp_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsKComps } ) );
		IdsLogicalPKT1.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRef, _STRING_22__RFLVPMLogical_div_RF ) );
		IdsLogicalPKT2.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_23__Logical_ExportRefere, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsLogicalPKT1 } ) );
		IdsEnsSpecs1.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRef, _STRING_24__PLMEnsSpecSpecificat ) );
		IdsEnsSpecs2.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_25__ESE_SpecExport_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsEnsSpecs1 } ) );
		IdsEnsTechTables1.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRef, _STRING_26__PLMEnsSpecTechnoTabl ) );
		IdsEnsTechTables2.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_27__ESE_TechnoTableExpor, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsEnsTechTables1 } ) );
		IdsEKLLibs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsARMpointedCoreRef, _STRING_28__PLMKnowHowLibrary_div_ ) );
		IdsEKLLibsContents.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_29__Kwe_ExportEKLLibrary, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsEKLLibs } ) );
		oPLMIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( iPLMIDSet, IdsARMpointedCoreRef ), IdsARMpointedCoreRepRef ), IdsARMpointedBO ), IdsARMpointedDocs ), IdsDocsAndScope ), IdsCatalogsContents ), IdsChaptersContents ), IdsTemplatesStructure ), IdsProductStructure1 ), IdsProductStructure2 ), IdsRulesetsContents ), IdsKCompStructure ), IdsLogicalPKT2 ), IdsEnsSpecs2 ), IdsEnsTechTables2 ), IdsEKLLibsContents ) );
	}
}
