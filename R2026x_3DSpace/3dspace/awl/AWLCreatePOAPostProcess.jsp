<%@page import="com.matrixone.apps.awl.dao.LocalLanguage"%>
<%@page import="com.matrixone.apps.awl.util.Pair"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../components/emxComponentsTreeUtilInclude.inc" %>
<%@include file = "../components/emxComponentsUtil.inc" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkPackage"%>
<%@page import="com.matrixone.apps.awl.GeneratePOA"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.cpd.dao.Country"%>
<%@page import="com.matrixone.apps.cpd.dao.Language"%>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct"%>
<%@page import="com.matrixone.apps.cpd.dao.CPDCache" %>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkException"%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>
<%@page import="jakarta.json.JsonArray"%>
<%@page import="jakarta.json.JsonObject"%>
<%@page import="jakarta.json.Json"%>
<%@page import="jakarta.json.JsonReader"%>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map.Entry" %>

<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<%
	try {
		String emxSuiteDirectory = emxGetParameter(request, "emxSuiteDirectory");
    	String browserLang = request.getHeader("Accept-Language");
      	
    	String[] arrArtWorkChoose = request.getParameterValues("ArtworkPackageType");
        ArtworkPackage doArtworkPackage = null;
        String artworkPackageTitle = null;
        String apDescription =  null;
        
    	String[] artworkUsage = request.getParameterValues("artworkUsageSelection");
        
        String countryIds = request.getParameter("h_SelectedCountries");
        String selectedLanguageList = request.getParameter("h_SelectedLanguages");
        String addElement = request.getParameter("addAllElementsToPOA"); 
        boolean addAllElements = "All".equals(addElement); 
        
        String prdIDList = request.getParameter("prdIDList");           
        String[] cpgProductIDArray = BusinessUtil.toStringArray(FrameworkUtil.split(prdIDList, "|"));	
        
        
        //Fetching all the Request Parameters related to "Enterprise Change Management".
        String changeTemplateId = emxGetParameter(request, "chooseTemplateNameOID");
        String changeOrderId = emxGetParameter(request, "changeOrderNameOID");        
        boolean isSeparateChangeActionRequired =  BusinessUtil.isNullOrEmpty(emxGetParameter(request, "createChangePOAForChangeAction")) ? false : true ;
        
        	
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
        
        HashMap<String, String> selectedLanguagesWithSeq = new  HashMap<String, String>();
	    List<LocalLanguage> selectecLanguageList = new ArrayList<LocalLanguage>();
	    if(BusinessUtil.isNotNullOrEmpty(selectedLanguageList)) {
	    	 List<Pair<LocalLanguage, Integer>> langaugesBySeq = new ArrayList<Pair<LocalLanguage, Integer>>();
		     selectedLanguageList = AWLUtil.strcat("[", selectedLanguageList, "]");	
		     JsonReader jsonReader = Json.createReader(new StringReader(selectedLanguageList));
			 JsonArray jsonLangArray = jsonReader.readArray();
		     for(int i=0; i<jsonLangArray.size(); i++){
				 JsonObject jsonObj = jsonLangArray.getJsonObject(i);
				 langaugesBySeq.add(new Pair<LocalLanguage, Integer> (context, 
						 new LocalLanguage(jsonObj.getString("id")), Integer.parseInt(jsonObj.getString("seq"))));
			 }
		     
			 /*Collections.sort(selectecLanguageList, new Comparator<Pair<LocalLanguage, Integer>>() {
					public int compare(Pair<LocalLanguage, Integer> o1, Pair<LocalLanguage, Integer> o2) {
						return (o1.getSecond(null)).compareTo(o2.getSecond(null));
					}
			 });*/
			 
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
        
		String poaPurpose = emxGetParameter(request, "isCustomizedPOA");
     	boolean isCustomizedPOA  = BusinessUtil.isNotNullOrEmpty(poaPurpose) && "true".equalsIgnoreCase(poaPurpose);
		 GeneratePOA generatePOA = new GeneratePOA();
		 generatePOA.setCustomizedPOA(isCustomizedPOA);
		 List<POA> newlyCreatedPOA = null;
		 if(doArtworkPackage != null) 
			 newlyCreatedPOA = generatePOA.createPOAs(context, cpgProductIDArray, artworkUsage, 
		 			                        selectecCountryList, selectecLanguageList,
		 			                        doArtworkPackage,
		 			                        changeTemplateId, changeOrderId, isSeparateChangeActionRequired, addAllElements);
		 else 
			 newlyCreatedPOA = generatePOA.createPOAs(context, cpgProductIDArray, artworkUsage, 
	                        selectecCountryList, selectecLanguageList,
	                        artworkPackageTitle, apDescription,
	                        changeTemplateId, changeOrderId, isSeparateChangeActionRequired, addAllElements);
		 
		 
		 StringList poasCreated = new StringList(newlyCreatedPOA.size());
		 for(POA poa : newlyCreatedPOA) {
			 poasCreated.add(poa.getId(context));
		 }
%>     
		<script language="javascript" type="text/javaScript"> 
		var isCustomizedPOA=<%=isCustomizedPOA%>;
		var functionalityName="";
		if(isCustomizedPOA == true){
			functionalityName="AWLCustomizePOAEdit";
		}else{
			functionalityName="AWLPOAEdit";	
		}
			//XSSOK :Business logic for isCustomizedPOA
		var poaEditURL="../awl/AWLPOAEdit.jsp?functionality="+functionalityName+"&suiteKey=AWL&poaIds=<%=XSSUtil.encodeForURL(context,FrameworkUtil.join(poasCreated, "|"))%>&isCustomizedPOA="+isCustomizedPOA;
		getTopWindow().showModalDialog(poaEditURL,600,400,true,'Large');
		getTopWindow().closeSlideInDialog();
		getTopWindow().findFrame(getTopWindow(), "detailsDisplay").location.reload();
			
          </script>

    <%
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
