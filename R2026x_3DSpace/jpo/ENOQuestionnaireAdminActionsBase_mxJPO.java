import java.util.List;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;

public class ENOQuestionnaireAdminActionsBase_mxJPO{

	public   void updateConfigureQuestions(Context context,String[] args) throws Exception
	{
		JPO.invoke( context, "ENOQuestionUI", null, "updateConfigureQuestions", args, null );
	}
	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String resetQuestionResponse(Context context, String[] args) throws Exception
	{
		return JPO.invoke( context, "ENOQuestionUI", null, "resetQuestionResponse", args, String.class);
	}
	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String submitConfiguredResponse(Context context, String[] args) throws Exception
	{
		return JPO.invoke( context, "ENOQuestionUI", null, "submitConfiguredResponse", args, String.class);
	}
	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String deleteQuestions(Context context, String[] args) throws Exception
	{
		return JPO.invoke( context, "ENOQuestionUI", null, "deleteQuestions", args, String.class);
	}

	public void connectRouteTemplateCRToCO(Context context, String args[]) throws Exception {
		JPO.invoke( context, "ENOQuestionTrigger", null, "connectRouteTemplateCRToCO", args, null);
	}

	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String reviseEForm(Context context, String[] args) throws Exception {
		return JPO.invoke( context, "ENOImpactQuestionnaire", null, "reviseEForm", args, String.class);
	}

	@com.matrixone.apps.framework.ui.ProgramCallable
	public List<Map> getCOEForms(Context context, String args[]) throws Exception {
		return JPO.invoke( context, "ENOImpactQuestionnaire", null, "getCOEForms", args, List.class);
	}

	@com.matrixone.apps.framework.ui.PostProcessCallable
	public void createEFormTemplateFromEForm(Context context, String[] args) throws Exception {
		JPO.invoke( context, "ENOImpactQuestionnaire", null, "createEFormTemplateFromEForm", args, null);
	}

	public List<String> getEFormTableAttributeValues(Context context, String[] args) throws Exception {
		return JPO.invoke( context, "ENOImpactQuestionnaire", null, "getEFormTableAttributeValues", args, List.class);
	}

	public void updateEFormAttributes(Context context, String args[]) throws Exception {
		JPO.invoke( context, "ENOImpactQuestionnaire", null, "updateEFormAttributes", args, null);
	}

	public List<String> getOwnerLink(Context context, String args[]) throws Exception {
		return JPO.invoke( context, "ENOImpactQuestionnaire", null, "getOwnerLink", args, List.class);
	}

	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String deleteEForm(Context context, String[] args) throws Exception {
		return JPO.invoke( context, "ENOImpactQuestionnaire", null, "deleteEForm", args, String.class);
	}

	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String deleteEFormTemplates(Context context, String[] args) throws Exception {
		return JPO.invoke( context, "ENOImpactQuestionnaire", null, "deleteEFormTemplates", args, String.class);

	}

	public boolean hideAttributeExtension(Context context, String[] args) throws Exception {
		return JPO.invoke( context, "ENOImpactQuestionnaire", null, "hideAttributeExtension", args, Boolean.class);
	}
	public String getEFormTemplateFormEForm(Context context, String[] args) throws Exception {
		return JPO.invoke( context, "ENOImpactQuestionnaire", null, "getEFormTemplateFormEForm", args, String.class);
	}

	public void updateEFormDescription(Context context, String args[]) throws Exception {
		JPO.invoke( context, "ENOImpactQuestionnaire", null, "updateEFormDescription", args, null);
		
	}

	public void updateEFormRequirement(Context context, String args[]) throws Exception {
		JPO.invoke( context, "ENOImpactQuestionnaire", null, "updateEFormRequirement", args, null);
	}

	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String addEFormAttributes(Context context, String[] args) throws Exception {
		return JPO.invoke( context, "ENOImpactQuestionnaire", null, "addEFormAttributes", args, String.class);
	}
	
	public void updateQuestionText(Context context,String args[])throws Exception {
		JPO.invoke( context, "ENOQuestionUI", null, "updateQuestionText", args, null);
	}

	@com.matrixone.apps.framework.ui.ProgramCallable
	public List<Map> getConfigureQuestions(Context context, String args[]) throws Exception {
		return JPO.invoke( context, "ENOQuestionUI", null, "getConfigureQuestions", args, List.class);
	}

	public void submitConditionalQuestions(Context context, String args[]) throws Exception {
		JPO.invoke( context, "ENOQuestionUI", null, "submitConditionalQuestions", args, null);
	}

	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String assignObjectsToQuestions(Context context, String args[]) throws Exception {
		return JPO.invoke( context, "ENOQuestionUI", null, "assignObjectsToQuestions", args, String.class);
	}
	/**
	 * Temporary addition due to chagesov access issue.
	**/
	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String copyExistingQuestions(Context context, String args[]) throws Exception {
		return JPO.invoke( context, "ENOQuestionUI", null, "copyExistingQuestions", args, String.class);
	}
	/**
	 * Temporary addition due to chagesov access issue.
	**/
	
	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	public String preProcessImportQuestions(Context context, String args[]) throws Exception {
		return JPO.invoke( context, "ENOQuestionUI", null, "preProcessImportQuestions", args, String.class);
	}

	public void actionRemoveQuestionnaireRouteTemplate(Context context, String args[]) throws Exception {
		JPO.invoke( context, "ENOQuestionTrigger", null, "actionRemoveQuestionnaireRouteTemplate", args, null );
	}

	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
    public Map<String,String>  removeReferenceDocuments(Context context, String args[]) throws Exception
    {
    	return JPO.invoke( context, "ENOQuestionUI", null, "removeReferenceDocuments", args, Map.class);
    	
    }
	
		@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	 public Map<String,String> addReferenceDocuments(Context context, String args[]) throws Exception
    {
    	return JPO.invoke( context, "ENOQuestionUI", null, "addReferenceDocuments", args, Map.class);
    	
    }
	@com.dassault_systemes.enovia.questionnaire.ExecuteCallable
	 public String preProcessAddReferenceDocuments(Context context, String args[]) throws Exception
    {
    	return JPO.invoke( context, "ENOQuestionUI", null, "preProcessAddReferenceDocuments", args, String.class);
    	
    }

}
