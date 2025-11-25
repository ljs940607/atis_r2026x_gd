<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../components/emxComponentsTreeUtilInclude.inc" %>
<%@include file = "../components/emxComponentsUtil.inc" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.awl.dao.LocalLanguage"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkPackage"%>

<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.Pair"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>

<%@page import="com.matrixone.apps.awl.GeneratePOA"%>

<%@page import="com.matrixone.apps.cpd.dao.Country"%>
<%@page import="com.matrixone.apps.cpd.dao.Language"%>
<%@page import="com.matrixone.apps.cpd.dao.CPDCache" %>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.domain.util.MessageUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>  
<%@page import="com.matrixone.apps.domain.util.MqlUtil"%>
<%@page import="matrix.db.Context"%>

<%@page import="jakarta.json.JsonArray"%>
<%@page import="jakarta.json.JsonObject"%>
<%@page import="jakarta.json.Json"%>
<%@page import="jakarta.json.JsonReader"%>


<%@ page import="java.util.List" %>
<%@ page import="java.util.Set" %>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>

<%
	try {
		String emxSuiteDirectory = emxGetParameter(request, "emxSuiteDirectory");
        String changeTemplateId = emxGetParameter(request, "chooseTemplateNameOID");
        String changeOrderId = emxGetParameter(request, "changeOrderNameOID");
        String submitAction = request.getParameter("SubmitAction");
		String functionality = request.getParameter("functionality");
      	String[] arrArtWorkChoose = request.getParameterValues("ArtworkPackageType");
        String[] artworkUsage = request.getParameterValues("artworkUsageSelection");
        String countryIds = request.getParameter("h_SelectedCountries");
        String selectedLanguageList = request.getParameter("h_SelectedLanguages");
        String addElement = request.getParameter("addAllElementsToPOA"); 
        String strSelectedPOAs = emxGetParameter(request, "selectedPOAs");
        StringList poaIdList = FrameworkUtil.split(strSelectedPOAs, ",");
		boolean isMultiplePOAAction = (poaIdList.size()>1)?true:false;
		GeneratePOA generatePOA = new GeneratePOA();
		List<POA> newlyCreatedPOA = null;
		StringList poasCreated = new StringList();
		String sourcePOAId = "";
		String newPlaceOfOriginOID = request.getParameter("PlaceOfOriginOID");
		String newPlaceOfOriginName = request.getParameter("PlaceOfOriginDisplay");
		StringList sourceLanguageIds = new StringList();
		StringList sourceCountryIds = new StringList();
		StringList destinationCountryIds = new StringList();
		List<LocalLanguage> destLocalLangList = new ArrayList<LocalLanguage>();
		List<Country> destLocalCountryList = new ArrayList<Country>();
		StringList commonCountries = new StringList();
		StringList commonLanguages = new StringList();	
		boolean isProduct = false;
		
		String typeOfPOA = POA.standardOrCustomOrMixed(context, StringList.create(strSelectedPOAs));
		boolean isCustomizedPOA = AWLConstants.RANGE_POABASIS_MARKETING_CUSTOMIZATION.equalsIgnoreCase(typeOfPOA) || "Mixed".equalsIgnoreCase(typeOfPOA);
		if("CopyPOA".equalsIgnoreCase(functionality)){
			if(BusinessUtil.isNotNullOrEmpty(newPlaceOfOriginOID)){
				isProduct = BusinessUtil.isKindOf(context, newPlaceOfOriginOID, AWLType.CPG_PRODUCT.get(context));
			}			
			if(isProduct){
				boolean isCommonCountryPresent = false;
				boolean isCommonLanguagePresent = false; 
				boolean isExtraCountriesPresent = false;	
			JsonReader jsonReader = Json.createReader(new StringReader(AWLUtil.strcat("[",selectedLanguageList,"]")));
			JsonArray jsonSelectedLanguagesArray = jsonReader.readArray();
			for(int i=0;i<jsonSelectedLanguagesArray.size();i++){
				JsonObject jsObj = jsonSelectedLanguagesArray.getJsonObject(i);
				sourceLanguageIds.add(jsObj.getString("id"));
				}
			jsonReader = Json.createReader(new StringReader(AWLUtil.strcat("[",countryIds,"]")));
			JsonArray jsonSelectedCountriesArray = jsonReader.readArray();
			for(int i=0;i<jsonSelectedCountriesArray.size();i++){
				JsonObject jsObj = jsonSelectedCountriesArray.getJsonObject(i);
				sourceCountryIds.add(jsObj.getString("id"));
				}
			
			//Country and Language Selectors
			String languageNameSelector = AWLUtil.strcat("from[",AWLRel.CANDIDATE_MARKETS.get(context),"].to.from[",AWLRel.LANGUAGE_USED.get(context),"].to.name");
			String countryNameSelector = AWLUtil.strcat("from[",AWLRel.CANDIDATE_MARKETS.get(context),"].to.name");
			String languageIDSelector = AWLUtil.strcat("from[",AWLRel.CANDIDATE_MARKETS.get(context),"].to.from[",AWLRel.LANGUAGE_USED.get(context),"].to.id");
			String countryIDSelector = AWLUtil.strcat("from[",AWLRel.CANDIDATE_MARKETS.get(context),"].to.id");
			
			DomainObject prod = new DomainObject(newPlaceOfOriginOID); 
			 destinationCountryIds = prod.getInfoList(context, countryIDSelector);
			 
			 for(String countryId : (List<String>)destinationCountryIds){
				 if(sourceCountryIds.contains(countryId)){
					 Country destCountry = new Country(countryId);  // Building a List of Common Lanugages and Countries
					List<Language> langs =  destCountry.getLanguages(context);
					for(Language lang : (List<Language>) langs){
						String langId = lang.getId(context);
						if(sourceLanguageIds.contains(langId)){
							destLocalLangList.add(new LocalLanguage(langId));
							commonLanguages.add(lang.getName());
						}
					}		
				 destLocalCountryList.add(destCountry);
				 commonCountries.add(destCountry.getName());
				 isCommonCountryPresent=true;
				 }
			 }
			 for(String countryId : (List<String>)sourceCountryIds){ // Checking if some countries are not present in Destination 
				 if(!destinationCountryIds.contains(countryId)){
					 isExtraCountriesPresent = true;
				 }
			 }			 		
			 destLocalLangList = AWLUtil.removeDuplicates(context, destLocalLangList); 
			 commonLanguages = AWLUtil.removeDuplicates(context, commonLanguages);
		
			 if(!isCommonCountryPresent && !destinationCountryIds.isEmpty()){
			String message = MessageUtil.getMessage(context, null, "emxAwl.CopyPOA.NoCommonCountries", BusinessUtil.toStringArray(new StringList(newPlaceOfOriginName)), null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE); 
			throw new FrameworkException(message); 
			 }
			 if(isExtraCountriesPresent && !destinationCountryIds.isEmpty()){
				String [] subArgs = {newPlaceOfOriginName,FrameworkUtil.join(commonCountries,":"),FrameworkUtil.join(commonLanguages,":") };
				String message = MessageUtil.getMessage(context, null, "emxAwl.CopyPOA.PartialCountries", subArgs, null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE);

		%>	
  			<script language="javascript" type="text/javaScript"> 
  			alert("<%=message%>");
			</script> 
		<%
			 }
			}
		}

		if(!isMultiplePOAAction){
			sourcePOAId = (String)poaIdList.get(0);
		}
        
        boolean addAllElements = "All".equals(addElement);
        boolean isSeparateChangeActionRequired =  BusinessUtil.isNullOrEmpty(emxGetParameter(request, 
        		"createChangePOAForChangeAction")) ? false : true ;
        
        ArtworkPackage doArtworkPackage = null;
        String artworkPackageTitle = null;
        String apDescription =  null;
        String copyPOASuccessMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.CopyPOASuccess");
        String evolutionPOASuccessMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.EvolutionPOASuccess");
        String successMessage = "";
        	
        if(("useExisting").equalsIgnoreCase(arrArtWorkChoose[0]))
        {
           String artworkPackageId = emxGetParameter(request, "ArtworkChangeSelectedOID");
           doArtworkPackage = (ArtworkPackage)DomainObject.newInstance(context, artworkPackageId, "AWL");          
        }
        else
        {
        	artworkPackageTitle = emxGetParameter(request, "artworkPackageTitle");
            apDescription =  emxGetParameter(request, "artworkPackageDescription");
        }    	
        
        if(!isMultiplePOAAction)
        {
         //Single POA Process
         POA sourcePOA = new POA(sourcePOAId);
         HashMap<String, String> selectedLanguagesWithSeq = new  HashMap<String, String>();
	     List<LocalLanguage> selectecLanguageList = new ArrayList<LocalLanguage>();
	     if(BusinessUtil.isNotNullOrEmpty(selectedLanguageList)) {
	    	 List<Pair<LocalLanguage, Integer>> langaugesBySeq = new ArrayList<Pair<LocalLanguage, Integer>>();
		     selectedLanguageList = AWLUtil.strcat("[", selectedLanguageList, "]");	
		     JsonReader jsonReader = Json.createReader(new StringReader(selectedLanguageList));
		     JsonArray jsonLangArray = jsonReader.readArray();
		     for(int i=0; i<jsonLangArray.size(); i++){
				 JsonObject jsonObj = jsonLangArray.getJsonObject(i);
				 int seqNo = 0;
				 try{
				 	seqNo = jsonObj.getInt("seq");
				 }catch(Exception ex){
					 seqNo = Integer.parseInt(jsonObj.getString("seq"));
				 }
				 langaugesBySeq.add(new Pair<LocalLanguage, Integer> (context, 
						 new LocalLanguage(jsonObj.getString("id")), seqNo));
			 }
			 
			 for(Pair<LocalLanguage, Integer> pair : langaugesBySeq) {
				 selectecLanguageList.add(pair.getFirst(context));
			 }
		}
					 
         List<Country> selectecCountryList = new ArrayList<Country>();
		 if(BusinessUtil.isNotNullOrEmpty(countryIds)) {
		      countryIds = AWLUtil.strcat("[", countryIds, "]");
		      JsonReader jsonReader = Json.createReader(new StringReader(countryIds));
			  JsonArray jsonLangArray = jsonReader.readArray();
			  for(int i=0; i<jsonLangArray.size(); i++){
				 JsonObject jsonObj = jsonLangArray.getJsonObject(i);
				 selectecCountryList.add(CPDCache.getCountry(jsonObj.getString("id")));
			  }
		}
        
		 boolean createNewArtworkPackage = (doArtworkPackage == null);
		 
		if(doArtworkPackage != null) {
				if("CopyPOA".equalsIgnoreCase(functionality) && isProduct && destinationCountryIds.isEmpty())
			 	newlyCreatedPOA = generatePOA.createPOACopy(context, newPlaceOfOriginOID, sourcePOA,  
			 			selectecCountryList, selectecLanguageList, artworkUsage, artworkPackageTitle, apDescription,
						doArtworkPackage, addAllElements, createNewArtworkPackage, changeTemplateId, changeOrderId, isSeparateChangeActionRequired);
				else if("CopyPOA".equalsIgnoreCase(functionality) && isProduct)
				 	newlyCreatedPOA = generatePOA.createPOACopy(context,newPlaceOfOriginOID, sourcePOA,  
				 			destLocalCountryList, destLocalLangList, artworkUsage, artworkPackageTitle, apDescription,
							doArtworkPackage,addAllElements,createNewArtworkPackage,changeTemplateId, changeOrderId, isSeparateChangeActionRequired);
				 else if("CopyPOA".equalsIgnoreCase(functionality))
					 newlyCreatedPOA = generatePOA.createPOACopy(context,newPlaceOfOriginOID, sourcePOA,  
							 selectecCountryList, selectecLanguageList, artworkUsage, artworkPackageTitle, apDescription,
								doArtworkPackage,addAllElements,createNewArtworkPackage,changeTemplateId, changeOrderId, isSeparateChangeActionRequired);
			else if("CreateEvolution".equalsIgnoreCase(functionality))
				newlyCreatedPOA = generatePOA.createEvolution(context, sourcePOA, selectecCountryList, selectecLanguageList, 
											artworkUsage, doArtworkPackage, changeTemplateId, changeOrderId, 
											isSeparateChangeActionRequired);
		 } else
		 { 
			 if("CopyPOA".equalsIgnoreCase(functionality) && isProduct && destinationCountryIds.isEmpty())
			 	newlyCreatedPOA = generatePOA.createPOACopy(context,newPlaceOfOriginOID, sourcePOA,  
			 			selectecCountryList, selectecLanguageList, artworkUsage, artworkPackageTitle, apDescription,null,
			 				addAllElements,createNewArtworkPackage, changeTemplateId, changeOrderId, isSeparateChangeActionRequired);
			 else if("CopyPOA".equalsIgnoreCase(functionality) && isProduct)
			 	newlyCreatedPOA = generatePOA.createPOACopy(context,newPlaceOfOriginOID, sourcePOA,  
			 			destLocalCountryList, destLocalLangList, artworkUsage, artworkPackageTitle, apDescription,null,
			 				addAllElements,createNewArtworkPackage, changeTemplateId, changeOrderId, isSeparateChangeActionRequired);
			 else if("CopyPOA".equalsIgnoreCase(functionality))
				 newlyCreatedPOA = generatePOA.createPOACopy(context,newPlaceOfOriginOID, sourcePOA,  
						 selectecCountryList, selectecLanguageList, artworkUsage, artworkPackageTitle, apDescription,null,
						 addAllElements,createNewArtworkPackage,changeTemplateId, changeOrderId, isSeparateChangeActionRequired );
			 else if("CreateEvolution".equalsIgnoreCase(functionality))
				newlyCreatedPOA = generatePOA.createEvolution(context, sourcePOA,  
	                        selectecCountryList, selectecLanguageList, artworkUsage, artworkPackageTitle, apDescription,
	                        changeTemplateId, changeOrderId, isSeparateChangeActionRequired);
		 }
		
		for(POA poa : newlyCreatedPOA) {
			 poasCreated.add(poa.getId(context));
		 }
		
		successMessage = ("CopyPOA".equalsIgnoreCase(functionality))?AWLUtil.strcat(copyPOASuccessMessage, "\\n", sourcePOA.getName(context)):AWLUtil.strcat(evolutionPOASuccessMessage, "\\n",sourcePOA.getName(context) );
        }else{
        	
        	//multi POA Process
        	StringList poaNames = BusinessUtil.getInfo(context,poaIdList , DomainConstants.SELECT_NAME);
        	
        	if("CreateEvolution".equalsIgnoreCase(functionality)){
        		if(doArtworkPackage != null) {
    				newlyCreatedPOA = generatePOA.createEvolutions(context, poaIdList, doArtworkPackage, changeTemplateId, changeOrderId, 
    											isSeparateChangeActionRequired);
    		 } else
    		 { 
    				newlyCreatedPOA = generatePOA.createEvolutions(context, poaIdList, artworkPackageTitle, apDescription,
    	                        changeTemplateId, changeOrderId, isSeparateChangeActionRequired);
    		 }
        	}
        	for(POA poa : newlyCreatedPOA) {
   			 poasCreated.add(poa.getId(context));
   		      }
        	
        	String nameMessage = FrameworkUtil.join(poaNames, "\\n");		
        	successMessage = ("CopyPOA".equalsIgnoreCase(functionality))?AWLUtil.strcat(copyPOASuccessMessage, "\\n",nameMessage ):AWLUtil.strcat(evolutionPOASuccessMessage, "\\n",nameMessage );
        	
        	
        }
        poasCreated.add(sourcePOAId);
        if("Submit".equalsIgnoreCase(submitAction)) {
%> 

		<script language="javascript" type="text/javaScript"> 
			//XSSOK i18N
			alert("<%=successMessage%>"); 
			var isCustomizedPOA=<%=isCustomizedPOA%>;
			var functionalityName = isCustomizedPOA? "AWLCustomizePOAEdit": "AWLPOAEdit";
			var poaEditURL="../awl/AWLPOAEdit.jsp?functionality="+functionalityName+"&suiteKey=AWL&poaIds=<%=XSSUtil.encodeForURL(context,FrameworkUtil.join(poasCreated, "|"))%>&isCustomizedPOA="+isCustomizedPOA;
			getTopWindow().showModalDialog(poaEditURL,600,400,true,'Large');
			turnOffProgress();
			getTopWindow().closeSlideInDialog();
			getTopWindow().findFrame(getTopWindow(), "detailsDisplay").location.reload();
        </script>

    <% } else {
  %>		
  <script language="javascript" type="text/javaScript"> 
		//XSSOK i18N
		alert("<%=successMessage%>"); 
		turnOffProgress();
		var isCustomizedPOA=<%=isCustomizedPOA%>;
		var functionalityName = isCustomizedPOA? "AWLCustomizePOAEdit": "AWLPOAEdit";
		var poaEditURL="../awl/AWLPOAEdit.jsp?functionality="+functionalityName+"&suiteKey=AWL&poaIds=<%=XSSUtil.encodeForURL(context,FrameworkUtil.join(poasCreated, "|"))%>&isCustomizedPOA="+isCustomizedPOA;
		getTopWindow().showModalDialog(poaEditURL,600,400,true,'Large'); // To show newly created POA
		var contentFrame  =  getTopWindow().findFrame(getTopWindow(),"slideInFrame");
		contentFrame.location.href =  contentFrame.location.href;// To refresh the slide-in
		getTopWindow().findFrame(getTopWindow(), "detailsDisplay").location.reload();
		
        </script>
    	
<%		}
     }catch(Exception e)
     {    
          String alertMsg = e.getMessage(); 
     %> 
          <script language="javascript" type="text/javaScript"> 
          alert("<xss:encodeForJavaScript><%=alertMsg%></xss:encodeForJavaScript>");
          getTopWindow().closeSlideInDialog();
          </script>
          
     <% } %>
    
    <%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
