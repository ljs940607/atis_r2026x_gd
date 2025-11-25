
import matrix.db.Context;
import com.dassault_systemes.EKLEngine.completion.CompletionJPOEvaluator;


/**
 * ${CLASSNAME}
 */
public final class Config_GetStructConfigAndModelsContent_mxJPO extends CompletionJPOEvaluator {

	/**
	 * Attributes
	 */
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_0__VPMCfgContext_div_VPM = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("VPMCfgContext/VPMCfgContext");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_1__com_dot_dassault_syst = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("com.dassault_systemes.plm.config.entity.completion.ConfigContextCompletion");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_2__Class_div_GenericPLMI = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Class/GenericPLMItem");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_3__Config_GetModelFromxR = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Config_GetModelFromxRevisionContext");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_4__Product_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Product");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_5__Product_AddCriteriaFr = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Product_AddCriteriaFromModel");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_6__Class_div_Product_Con = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("Class/Product Configuration");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_7__NLV_GetItem_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("NLV_GetItem");

	/**
	 * evaluate
	 * @param iContext
	 * @param iPLMIDSet
	 * @param oPLMIDSet
	 */
	public final void evaluate(matrix.db.Context iContext, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet oPLMIDSet)	
			throws Exception {
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetContext = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetModel = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet PLMRouteSetModelContent = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetInputRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetInputGPI = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetContext = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetModel = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetModelxRev = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetModelContent = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetInputProdConf = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetNLVContent = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		PLMIDSetContext.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_0__VPMCfgContext_div_VPM ) );
		PLMIDSetModel.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecuteJavaProcedure( iContext , _STRING_1__com_dot_dassault_syst, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetContext } ) );
		PLMIDSetInputGPI.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_2__Class_div_GenericPLMI ) );
		PLMIDSetModelxRev.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_3__Config_GetModelFromxR, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetInputGPI } ) );
		PLMIDSetModel.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( PLMIDSetModel, PLMIDSetModelxRev ) );
		PLMRouteSetModelContent.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_4__Product_, _STRING_5__Product_AddCriteriaFr, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetModel } ) );
		PLMIDSetModelContent.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetModelContent ) );
		PLMIDSetInputProdConf.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( PLMRouteSetModelContent ), _STRING_6__Class_div_Product_Con ) );
		PLMIDSetNLVContent.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_7__NLV_GetItem_, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetInputProdConf } ) );
		oPLMIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( iPLMIDSet, PLMIDSetModel ), PLMIDSetModelContent ), PLMIDSetNLVContent ) );
	}
}
