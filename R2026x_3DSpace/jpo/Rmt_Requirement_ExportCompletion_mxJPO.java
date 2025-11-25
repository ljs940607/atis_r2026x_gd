
import matrix.db.Context;
import com.dassault_systemes.EKLEngine.completion.CompletionJPOEvaluator;


/**
 * ${CLASSNAME}
 */
public final class Rmt_Requirement_ExportCompletion_mxJPO extends CompletionJPOEvaluator {

	/**
	 * Attributes
	 */
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_0__Class_div_Requirement = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Class/Requirement");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_1__Requirement_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Requirement");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_2__rmt_nav_req_subs_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("rmt_nav_req_subs");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_3__rmt_nav_req_downstrea = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("rmt_nav_req_downstream");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_4__com_dot_dassault_syst = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.parameter_modeler.procedures.PlmParameterProcedure_AllParams");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_5__rmt_nav_req_testcase_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("rmt_nav_req_testcase");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_6__Class_div_Test_Case_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Class/Test Case");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_7__Plc_TestCase_ExportCo = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Plc_TestCase_ExportCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_8__rmt_nav_req_docs_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("rmt_nav_req_docs");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_9__Class_div_DOCUMENTS_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Class/DOCUMENTS");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_10__DocumentCompletion_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DocumentCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_11__com_dot_dassault_sys = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.enovia.versioning.core.completion.NLVCompletion");

	/**
	 * evaluate
	 * @param iContext
	 * @param iPLMIDSet
	 * @param oPLMIDSet
	 */
	public final void evaluate(matrix.db.Context iContext, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet oPLMIDSet)	
			throws Exception {
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsReqs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsSub = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsAllSubReqsAndRels = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsSubReqs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsInputAndSubReq = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsDownstream = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsAllDownstreamReqsAndRels = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsDownstreamReqs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsSubOfDownstream = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsAllSubOfDownstreamReqsAndRels = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsSubOfDownstreamReqs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsAllReqs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsParams = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsTestCases = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsTestCases = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsOnlyTestCases = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsTestCasesAndScope = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet RsDocs = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsDocs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsOnlyDocs = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsDocsAndScope = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet IdsNLVCompletion = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		IdsReqs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_0__Class_div_Requirement ) );
		RsSub.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_1__Requirement_, _STRING_2__rmt_nav_req_subs_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsReqs } ) );
		IdsAllSubReqsAndRels.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsSub ) );
		IdsSubReqs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsAllSubReqsAndRels, _STRING_0__Class_div_Requirement ) );
		IdsInputAndSubReq.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( IdsReqs, IdsSubReqs ) );
		RsDownstream.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_1__Requirement_, _STRING_3__rmt_nav_req_downstrea, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsInputAndSubReq } ) );
		IdsAllDownstreamReqsAndRels.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsDownstream ) );
		IdsDownstreamReqs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsAllDownstreamReqsAndRels, _STRING_0__Class_div_Requirement ) );
		RsSubOfDownstream.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_1__Requirement_, _STRING_2__rmt_nav_req_subs_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsDownstreamReqs } ) );
		IdsAllSubOfDownstreamReqsAndRels.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsSubOfDownstream ) );
		IdsSubOfDownstreamReqs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsAllSubOfDownstreamReqsAndRels, _STRING_0__Class_div_Requirement ) );
		IdsAllReqs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( IdsReqs, IdsSubReqs ), IdsDownstreamReqs ), IdsSubOfDownstreamReqs ) );
		IdsParams.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_4__com_dot_dassault_syst, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsAllReqs } ) );
		RsTestCases.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_1__Requirement_, _STRING_5__rmt_nav_req_testcase_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsAllReqs } ) );
		IdsTestCases.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsTestCases ) );
		IdsOnlyTestCases.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsTestCases, _STRING_6__Class_div_Test_Case_ ) );
		IdsTestCasesAndScope.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_7__Plc_TestCase_ExportCo, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsOnlyTestCases } ) );
		RsDocs.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_1__Requirement_, _STRING_8__rmt_nav_req_docs_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsAllReqs } ) );
		IdsDocs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( RsDocs ) );
		IdsOnlyDocs.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , IdsDocs, _STRING_9__Class_div_DOCUMENTS_ ) );
		IdsDocsAndScope.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_10__DocumentCompletion_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsOnlyDocs } ) );
		IdsNLVCompletion.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_11__com_dot_dassault_sys, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { IdsAllReqs } ) );
		oPLMIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( iPLMIDSet, IdsAllSubReqsAndRels ), IdsAllDownstreamReqsAndRels ), IdsAllSubOfDownstreamReqsAndRels ), IdsParams ), IdsTestCases ), IdsTestCasesAndScope ), IdsDocs ), IdsDocsAndScope ), IdsNLVCompletion ) );
	}
}
