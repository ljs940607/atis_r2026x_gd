
import matrix.db.Context;
import com.dassault_systemes.EKLEngine.completion.CompletionJPOEvaluator;


/**
 * ${CLASSNAME}
 */
public final class AnalyticsCaseExport_mxJPO extends CompletionJPOEvaluator {

	/**
	 * Attributes
	 */
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_0__AnalyticsCaseExpand_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("AnalyticsCaseExpand");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_1__SimulationTemplateExp = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("SimulationTemplateExport");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_2__Class_div_Simulation_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Class/Simulation Template");

	/**
	 * evaluate
	 * @param iContext
	 * @param iPLMIDSet
	 * @param oPLMIDSet
	 */
	public final void evaluate(matrix.db.Context iContext, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet oPLMIDSet)	
			throws Exception {
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet AnalyticsRelationContentRoute = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet AnalyticsRelationContentSet = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet SimulationTemplateContentSet = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		AnalyticsRelationContentRoute.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_0__AnalyticsCaseExpand_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { iPLMIDSet } ) );
		AnalyticsRelationContentSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( AnalyticsRelationContentRoute ) );
		SimulationTemplateContentSet.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_1__SimulationTemplateExp, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , AnalyticsRelationContentSet, _STRING_2__Class_div_Simulation_ ) } ) );
		oPLMIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( AnalyticsRelationContentSet, SimulationTemplateContentSet ) );
	}
}
