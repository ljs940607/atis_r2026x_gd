
import matrix.db.Context;
import com.dassault_systemes.EKLEngine.completion.CompletionJPOEvaluator;


/**
 * ${CLASSNAME}
 */
public final class StandardProcess_ExportAsDesign_mxJPO extends CompletionJPOEvaluator {

	/**
	 * Attributes
	 */
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_0__DELStandardProcess_div_ = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DELStandardProcess/DELStandardProcessReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_1__DocumentCompletion_al = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("DocumentCompletion_allDocumentCompletion");

	/**
	 * evaluate
	 * @param iContext
	 * @param iPLMIDSet
	 * @param oPLMIDSet
	 */
	public final void evaluate(matrix.db.Context iContext, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet oPLMIDSet)	
			throws Exception {
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetStandardProcessRef = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetDocuments = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		PLMIDSetStandardProcessRef.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , iPLMIDSet, _STRING_0__DELStandardProcess_div_ ) );
		PLMIDSetDocuments.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_1__DocumentCompletion_al, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { PLMIDSetStandardProcessRef } ) );
		oPLMIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( PLMIDSetStandardProcessRef, PLMIDSetDocuments ) );
	}
}
