<%@page import="com.matrixone.apps.awl.util.AWLPreferences"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.dao.CopyElement"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="jakarta.json.JsonObject"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../common/scripts/jquery-ui.js"></script>
<script type="text/javascript" src="../common/scripts/emxUITooltips.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIModal.js"></script>
<script type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>

<link rel="stylesheet" href="connector/styles/AWLArtworkFileUpload.css">

<%!

	private static final String EMXCREATE_JSP = "emxCreate.jsp";
	private static final String EMXAWLCOMMONFS_JSP = "emxAWLCommonFS.jsp";

	@SuppressWarnings("unchecked")
	public static Map<String, String> getArtworkElementInfoMapForGS1(String rowId) throws FrameworkException {
		Map<String, String> artworkElementInfoMap = new HashMap<String, String>();
		if(BusinessUtil.isNotNullOrEmpty(rowId)){
			StringList keyValueList = FrameworkUtil.split(rowId, "|");
			String receivedJSON = XSSUtil.decodeFromURL((String)keyValueList.get(0));
			JsonObject myJson =  BusinessUtil.toJSONObject(receivedJSON);
			artworkElementInfoMap = BusinessUtil.toMap(myJson);
		}
		return artworkElementInfoMap;
	}
	
	public static boolean canAdd(Map<String, String> artworkElementInfoMap) {
		return AWLConstants.RANGE_FALSE.equalsIgnoreCase(BusinessUtil.getString(artworkElementInfoMap,"canAdd"));
	}
	
	public static boolean isGraphic(Map<String, String> artworkElementInfoMap) {
		return AWLConstants.RANGE_TRUE.equalsIgnoreCase(BusinessUtil.getString(artworkElementInfoMap,"isGraphic"));
	}
	
	private Map<String, String> getCommonURLParamMap(Map<String, String> artworkElementInfoMap) {
		Map<String, String> commonURLParameters = new HashMap<String, String>();
		commonURLParameters.put(AWLConstants.RESPONSE_SEQUENCE, BusinessUtil.getString(artworkElementInfoMap,"artworkInsSequence"));
		commonURLParameters.put("submitAction", "refreshCaller");
		commonURLParameters.put("suiteKey", "AWL");
		commonURLParameters.put("openerFrame", "AWLArtworkResponseRoundTripSummary");
		commonURLParameters.put(AWLConstants.SELECTED_POA_ID, BusinessUtil.getString(artworkElementInfoMap,"poaId"));
		commonURLParameters.put(AWLConstants.PARENT_OID, BusinessUtil.getString(artworkElementInfoMap,"poaId"));
		commonURLParameters.put(AWLConstants.OBJECT_ID, BusinessUtil.getString(artworkElementInfoMap,"poaId"));
		commonURLParameters.put(AWLConstants.GS1_RESPONSE_ELEMENTKEY, BusinessUtil.getString(artworkElementInfoMap,"gs1ResponseElementKey"));
		commonURLParameters.put(AWLConstants.SELECTED_LANGUAGE, BusinessUtil.getString(artworkElementInfoMap,"artworkLanguage"));
		return commonURLParameters;
	}
	
	private Map<String, String> getCommonCopyElementURLParamMap(Map<String, String> artworkElementInfoMap) {
		Map<String, String> urlParameterMap = getCommonURLParamMap(artworkElementInfoMap);
		urlParameterMap.put("policy", "policy_ArtworkElementContent");
		urlParameterMap.put("nameField", "autoName");
		urlParameterMap.put("type", BusinessUtil.getString(artworkElementInfoMap,"type"));
		urlParameterMap.put("createJPO", "AWLCopyElementUI:createMasterCopyElementForGS1");
		urlParameterMap.put("form", "AWLPOAResponseNewMasterCopyElementCreate");
		urlParameterMap.put(AWLConstants.PLACE_OF_ORG_NAME, BusinessUtil.getString(artworkElementInfoMap,AWLConstants.PLACE_OF_ORG_NAME));
		urlParameterMap.put(AWLConstants.PLACE_OF_ORG_OID, BusinessUtil.getString(artworkElementInfoMap,AWLConstants.PLACE_OF_ORG_OID));
		urlParameterMap.put(AWLConstants.USE_INSTANCESEQ_FROM_RES, AWLConstants.RANGE_TRUE);
		urlParameterMap.put(AWLConstants.IS_TRANSLATE, AWLConstants.RANGE_YES);
		urlParameterMap.put(AWLConstants.IS_INLINE_COPY, AWLConstants.RANGE_NO);
		return urlParameterMap;
	}
	
	private Map<String, String> getStructureURLParamMap(Context context, Map<String, String> artworkElementInfoMap, Boolean useInstanceSeqFromRes) {
		Map<String, String> urlParameterMap = getCommonCopyElementURLParamMap(artworkElementInfoMap);
		try{
			String systemBaseLang = AWLPreferences.getPreferedBaseLanguage(context);
			boolean isLCLangMatchPrefBaseLang = systemBaseLang.equals(BusinessUtil.getString(artworkElementInfoMap,"artworkLanguage"));
			urlParameterMap.put(AWLConstants.IS_LCLANG_MATCH_PREF_BASELANG, isLCLangMatchPrefBaseLang+"");
			urlParameterMap.put("isStructure", AWLConstants.RANGE_TRUE);
			urlParameterMap.put("postProcessJPO", "AWLCopyElementUI:poaSyncAddStructureElementPostProcess");
			if(!useInstanceSeqFromRes) {
				urlParameterMap.put(AWLConstants.USE_INSTANCESEQ_FROM_RES,AWLConstants.RANGE_FALSE);
			}
			
		} catch(Exception ex) {
			ex.printStackTrace();
		}
		return urlParameterMap;
	}
	
	private Map<String, String> getTranslateElementURLParamMap(Context context, Map<String, String> artworkElementInfoMap, Boolean useInstanceSeqFromRes) {
		Map<String, String> urlParameterMap = getCommonCopyElementURLParamMap(artworkElementInfoMap);
		try{
			String systemBaseLang = AWLPreferences.getPreferedBaseLanguage(context);
			boolean isLCLangMatchPrefBaseLang = systemBaseLang.equals(BusinessUtil.getString(artworkElementInfoMap,"artworkLanguage"));
			urlParameterMap.put("preProcessJavaScript",isLCLangMatchPrefBaseLang?"makeReadOnlyMasterCopyField":"makeReadOnlyMasterCopyField:makeReadOnlyLocalCopyField");
			urlParameterMap.put(AWLConstants.IS_LCLANG_MATCH_PREF_BASELANG, isLCLangMatchPrefBaseLang+"");
			if(!useInstanceSeqFromRes) {
				urlParameterMap.put(AWLConstants.USE_INSTANCESEQ_FROM_RES,AWLConstants.RANGE_FALSE);
			}
			
		} catch(Exception ex) {
			ex.printStackTrace();
		}
		return urlParameterMap;
	}
	
	private Map<String, String> getNoTranslateElementURLParamMap(Context context, Map<String, String> artworkElementInfoMap, Boolean useInstanceSeqFromRes) {
		Map<String, String> urlParameterMap = getCommonCopyElementURLParamMap(artworkElementInfoMap);
		urlParameterMap.put("preProcessJavaScript","makeReadOnlyMasterCopyField");
		urlParameterMap.put(AWLConstants.IS_TRANSLATE,AWLConstants.RANGE_NO);
		urlParameterMap.put(AWLConstants.IS_LCLANG_MATCH_PREF_BASELANG, AWLConstants.RANGE_TRUE);
		if(!useInstanceSeqFromRes) {
			urlParameterMap.put(AWLConstants.USE_INSTANCESEQ_FROM_RES,AWLConstants.RANGE_FALSE);
		}
		return urlParameterMap;
	}
	
	private Map<String, String> getInlineElementURLParamMap(Context context, Map<String, String> artworkElementInfoMap, Boolean useInstanceSeqFromRes) {
		Map<String, String> urlParameterMap = getCommonCopyElementURLParamMap(artworkElementInfoMap);
		urlParameterMap.remove(AWLConstants.SELECTED_LANGUAGE);
		urlParameterMap.put("form","AWLPOAResponseNewMasterCopyElementCreate");
		urlParameterMap.put("preProcessJavaScript","changeWidthOfLang:makeReadOnlyLocalCopyField");
		urlParameterMap.put(AWLConstants.RESPONSE_LANG,BusinessUtil.getString(artworkElementInfoMap,AWLConstants.RESPONSE_LANG));
		urlParameterMap.put(AWLConstants.IS_INLINE_COPY, AWLConstants.RANGE_YES);
		urlParameterMap.put(AWLConstants.IS_LCLANG_MATCH_PREF_BASELANG, AWLConstants.RANGE_FALSE);
		if(!useInstanceSeqFromRes) {
			urlParameterMap.put(AWLConstants.USE_INSTANCESEQ_FROM_RES,AWLConstants.RANGE_FALSE);
		}
		return urlParameterMap;
	}
	
	private Map<String, String> getLocalCopyElementURLParamMap(Context context, Map<String, String> artworkElementInfoMap) {
		Map<String, String> urlParameterMap = getCommonCopyElementURLParamMap(artworkElementInfoMap);
		urlParameterMap.put(AWLConstants.PARENT_OID, BusinessUtil.getString(artworkElementInfoMap,"artworkMasterId"));
		urlParameterMap.put(AWLConstants.OBJECT_ID, BusinessUtil.getString(artworkElementInfoMap,"artworkMasterId"));
		urlParameterMap.put("createJPO", "AWLCopyElementUI:createLocalCopyElementForGS1");
		urlParameterMap.put("form", "AWLPOAResponseNewCopyElementCreate");
		urlParameterMap.put("preProcessJavaScript", "makeReadOnlyLocalCopyField");
		return urlParameterMap;
	}
	
	private Map<String, String> getGraphicURLParameters(Map<String, String> artworkElementInfoMap,Boolean useInstanceSeqFromRes) {
		Map<String, String> urlParameterMap = getCommonURLParamMap(artworkElementInfoMap);
		urlParameterMap.put("functionality", "ImageElementCreateFSInstance");
		urlParameterMap.put("uiType", "structureBrowser");
		urlParameterMap.put("context", "createImageElement");
		urlParameterMap.put("graphicType", BusinessUtil.getString(artworkElementInfoMap,"type"));
		urlParameterMap.put("instanceSequenceNumber", BusinessUtil.getString(artworkElementInfoMap,"artworkInsSequence"));
		if(!useInstanceSeqFromRes) {
			urlParameterMap.put(AWLConstants.USE_INSTANCESEQ_FROM_RES,AWLConstants.RANGE_FALSE);
		}
		return urlParameterMap;
	}
	
	private String getURL(Context context, String urlType, Map<String, String> urlParametersMap) {
		StringBuilder strURL = new StringBuilder(100);
		urlType = EMXAWLCOMMONFS_JSP.equals(urlType)?"../awl/emxAWLCommonFS.jsp?":"../common/emxCreate.jsp?";
		strURL.append(urlType);
		for (Map.Entry<String, String> entry : urlParametersMap.entrySet())
		{
			strURL.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
		}
		return strURL.deleteCharAt(strURL.length()-1).toString();
	}
	

%>

<%
String rowId = emxGetParameter(request,"emxTableRowId");
String mode = emxGetParameter(request,"mode");

if("add".equals(mode)) {
	Map<String, String> artworkElementInfoMap = getArtworkElementInfoMapForGS1(rowId);
	//Boolean canAddBoolean = (Boolean)
	if(canAdd(artworkElementInfoMap)){
		%>
		<script language="Javascript">
			alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Error.InvalidOperation")%>");
		</script>
		<%
	} else {
		
		String artworkId = BusinessUtil.getString(artworkElementInfoMap,"artworkId");
		String strResponseSequence = BusinessUtil.getString(artworkElementInfoMap,"artworkInsSequence");
		String strLocaleSequence = BusinessUtil.getString(artworkElementInfoMap,"artworkLocaleSequence");
		String strResponseLanguage = BusinessUtil.getString(artworkElementInfoMap,"artworkLanguage");
		boolean isStructure = AWLConstants.RANGE_TRUE.equalsIgnoreCase(BusinessUtil.getString(artworkElementInfoMap,"isStructure"));
		
		String inlineLocaleSeq = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.POAExport.Inline.LocaleSequence");
		String noTransateLocaleSeq = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.POAExport.NoTranslate.LocaleSequence");
		
		String poaId = emxGetParameter(request,"objectId");
		String orgMasterTypeName = PropertyUtil.getSchemaProperty(context,MqlUtil.mqlCommand(context, "print type $1 select $2 dump", BusinessUtil.getString(artworkElementInfoMap,"TypeActual"),"property[MasterArtworkElementType].value"));
		POA poaObject = new POA(poaId);
		String placeOfId = poaObject.getPlaceOfOriginId(context);
		DomainObject dobj = DomainObject.newInstance(context,placeOfId);
		String canModifyAccessOnOrigin = dobj.getInfo(context, AWLConstants.SELECT_MODIFY_ACCESS);
		
		artworkElementInfoMap.put("poaId", poaId);
		artworkElementInfoMap.put(AWLConstants.PLACE_OF_ORG_OID, placeOfId);
		artworkElementInfoMap.put("type", orgMasterTypeName);
		artworkElementInfoMap.put(AWLConstants.RESPONSE_LANG, FrameworkUtil.join(poaObject.getLanguageNames(context), ","));
		
		if("FALSE".equalsIgnoreCase(canModifyAccessOnOrigin)) {
			%>
			<script language="Javascript">
			// XSSOK
				alert("<%=XSSUtil.encodeForJavaScript(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Message.NoAccessToCreateMasterElement"))%>");
			</script>
			<%
			return;
		}
		
		if(isGraphic(artworkElementInfoMap)) {
			// Case nextInSequence : New Graphic Element , when isChangedByRecipient is true  For Syncing the Graphic Element, there is no need to set the instance sequence.
			boolean useInstanceSequenceFromGS1 = true;
			if(BusinessUtil.isNotNullOrEmpty(artworkId)){
				strResponseSequence = "";
				useInstanceSequenceFromGS1 = false;
			}
			artworkElementInfoMap.put("artworkInsSequence",strResponseSequence);
			String strURL = getURL(context, EMXAWLCOMMONFS_JSP, getGraphicURLParameters(artworkElementInfoMap,useInstanceSequenceFromGS1));
			
			%>
			<script>
			getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, strURL)%>", true);
			</script>
		<%
	}
	else {
		//New Element to be created, POA has element with this type-instance seq-locale and creating new element with new instance seq
		if(BusinessUtil.isNotNullOrEmpty(artworkId))
		{
			artworkElementInfoMap.put("objectId",poaId);
			String strURL = isStructure ? getURL(context, EMXCREATE_JSP, getStructureURLParamMap(context, artworkElementInfoMap, false)) 
					:inlineLocaleSeq.equals(strLocaleSequence) ? getURL(context, EMXCREATE_JSP, getInlineElementURLParamMap(context, artworkElementInfoMap, false))
					: noTransateLocaleSeq.equals(strLocaleSequence)? getURL(context, EMXCREATE_JSP, getNoTranslateElementURLParamMap(context, artworkElementInfoMap, false))
					: getURL(context, EMXCREATE_JSP, getTranslateElementURLParamMap(context, artworkElementInfoMap, false));
			%>
			<script>
			// XSSOK 
				getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, strURL)%>", true);
			</script>	
		<%
		} 
		else 
		{ 
			//New Element - creation
			String inline_Select = AWLAttribute.INLINE_TRANSLATION.getSel(context);	
			String trans_Select = AWLAttribute.TRANSLATE.getSel(context);	
			StringList busSelects = BusinessUtil.toStringList("type","name","id",inline_Select,trans_Select);
			StringList relSelects = new StringList(AWLAttribute.INSTANCE_SEQUENCE.getSel(context));
			
			String busWhereCondition = AWLUtil.strcat("type==","\"",orgMasterTypeName,"\"");
			String relWhereCondition = AWLUtil.strcat(AWLAttribute.INSTANCE_SEQUENCE.getSel(context),"==",strResponseSequence);
				
			// Verify the master copy elements present with same instance in POA
		    MapList masterCopyList = poaObject.related(AWLType.MASTER_ARTWORK_ELEMENT, AWLRel.POA_ARTWORK_MASTER).sel(busSelects).where(busWhereCondition).relSe(relSelects).relWhere(relWhereCondition).query(context);
				
			//Create Artwork Master and LC 	
			if(BusinessUtil.isNullOrEmpty(masterCopyList)){
				String strURL = isStructure?getURL(context, EMXCREATE_JSP, getStructureURLParamMap(context, artworkElementInfoMap, true)):inlineLocaleSeq.equals(strLocaleSequence)?
									getURL(context, EMXCREATE_JSP, getInlineElementURLParamMap(context, artworkElementInfoMap, true)):
									noTransateLocaleSeq.equals(strLocaleSequence)?
									getURL(context, EMXCREATE_JSP, getNoTranslateElementURLParamMap(context, artworkElementInfoMap, true)):
									getURL(context, EMXCREATE_JSP, getTranslateElementURLParamMap(context, artworkElementInfoMap, true));
					%>
					<script>
						getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, strURL.toString())%>", true);
					</script>	
				<%
			} else {
				// Already Master is present. Verify what type of element user wants to create. 
				Map masterDetails = (Map)masterCopyList.get(0);
				String transValue =  (String)masterDetails.get(trans_Select);
				String inlineValue =  (String)masterDetails.get(inline_Select);
				String strURL = null;
				// Master is Translate element
				if(AWLConstants.RANGE_YES.equalsIgnoreCase(transValue) && AWLConstants.RANGE_NO.equalsIgnoreCase(inlineValue)) {
					// User wants to create new inline copy element
					if(inlineLocaleSeq.equals(strLocaleSequence)) {
						strURL = getURL(context, EMXCREATE_JSP, getInlineElementURLParamMap(context, artworkElementInfoMap, false));
						%>
						<script>
							getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, strURL)%>", true);
						</script>	
					<%
					} else if(noTransateLocaleSeq.equals(strLocaleSequence)){
						// User wants to create No Translate Element
						strURL = getURL(context, EMXCREATE_JSP, getNoTranslateElementURLParamMap(context, artworkElementInfoMap, false));
						%>
						<script>
							getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, strURL)%>", true);
						</script>	
					<%
					} else {
					  	// Process for only local copy creation
						Map artworkMasterMap = (Map) masterCopyList.get(0);
						String artworkMasterId = (String) artworkMasterMap.get("id");
					  	artworkElementInfoMap.put("artworkMasterId", artworkMasterId);
					  	
						ArtworkMaster artworkMaster = new ArtworkMaster(artworkMasterId); 
						String artworkElementDisplayName = artworkMaster.getDisplayName(context);
						
						busWhereCondition = AWLUtil.strcat(AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context), "==","\"",strResponseLanguage,"\" && islast == \"TRUE\"");
						MapList localCopyList = artworkMaster.related(AWLType.ARTWORK_ELEMENT, AWLRel.ARTWORK_ELEMENT_CONTENT).to().id().attr(AWLAttribute.COPY_TEXT_LANGUAGE).where(busWhereCondition).query(context); 
						
						if(BusinessUtil.isNullOrEmpty(localCopyList)) {
							//Master doesn't have LC with this language
							// process for creation
							strURL = getURL(context, EMXCREATE_JSP, getLocalCopyElementURLParamMap(context, artworkElementInfoMap));
							%>
						<script>
							getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, strURL.toString())%>", true);
						</script>	
					<%} else {
						//Master has LC with this language
						//Need to confirm from the user whether he wants to use the existing LC or Create new MC and LC
						String createNewMasterURL = strURL = getURL(context, EMXCREATE_JSP, getTranslateElementURLParamMap(context, artworkElementInfoMap, false));
						
						String copyElementId = (String)((Map)localCopyList.get(0)).get("id");
						StringBuilder useExistingMaster = new StringBuilder(100);
						useExistingMaster.append("../awl/AWLArtworkFileResponseCreateActionsIntermediate.jsp?mode=onConfirmSubmit&")
											.append("selectedPOAId=").append(poaId).append("&")
											.append("gs1ResponseElementKey=").append(BusinessUtil.getString(artworkElementInfoMap,"gs1ResponseElementKey")).append("&")
											.append("MasterCopyText=").append("&")
											.append("selectedLanguage=").append(strResponseLanguage).append("&")
											.append("copyElementId=").append(copyElementId).append("&")
											.append("artworkMasterId=").append(artworkMasterId);
							 				
						String confirmMsg = AWLPropertyUtil.getI18NString(context, "emxAWL.Confirm.ToCreateNewOrUseExistingElement");
						String i18nTypeName = AWLPropertyUtil.getTypeI18NString(context, orgMasterTypeName, false);
						if("FALSE".equalsIgnoreCase(canModifyAccessOnOrigin)) {
							confirmMsg = AWLPropertyUtil.getI18NString(context, "emxAWL.Confirm.ToCancelOrUseExistingElement");
							confirmMsg = confirmMsg.replace("{0}", AWLUtil.strcat(i18nTypeName,"(",artworkElementDisplayName,")"));
							confirmMsg = confirmMsg.replace("{1}", strResponseLanguage);
						%>
							<script>
								var msg = confirm("<%=XSSUtil.encodeForJavaScript(context, confirmMsg)%>");
								if(msg) {
									document.location.href = "<%=XSSUtil.encodeURLForServer(context,useExistingMaster.toString())%>";
								}
				     		</script>
						<% } else { 
								confirmMsg =confirmMsg.replace("{0}", AWLUtil.strcat(i18nTypeName,"(",artworkElementDisplayName,")"));
								confirmMsg =confirmMsg.replace("{1}", strResponseLanguage);
							%>
							<script>
								var msg = confirm("<%=XSSUtil.encodeForJavaScript(context, confirmMsg)%>");
								if(msg) {
									document.location.href = "<%=XSSUtil.encodeURLForServer(context,useExistingMaster.toString())%>";
								}else{
									getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, createNewMasterURL.toString())%>", true);
								}
					     	</script>
						<% }
						}
					}
				}else {
					// Current Master is either No-Translate or Inline Element
					strURL = inlineLocaleSeq.equals(strLocaleSequence)?
								getURL(context, EMXCREATE_JSP, getInlineElementURLParamMap(context, artworkElementInfoMap, false)):
								noTransateLocaleSeq.equals(strLocaleSequence)?
								getURL(context, EMXCREATE_JSP, getNoTranslateElementURLParamMap(context, artworkElementInfoMap, false)):
								getURL(context, EMXCREATE_JSP, getTranslateElementURLParamMap(context, artworkElementInfoMap, false));
						%>
						<script>
							getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, strURL.toString())%>", true);
						</script>	
					<%
				}
			}
		  }
		}
	}
} else if("onConfirmSubmit".equals(mode)) {
    String poaId =  request.getParameter(AWLConstants.SELECTED_POA_ID);
    String copyElementId =  request.getParameter("copyElementId");
    String artworkMasterId =  request.getParameter("artworkMasterId");
    String strMarketingText =  XSSUtil.decodeFromURL(request.getParameter("MasterCopyText"));
    String strLanguage =  request.getParameter(AWLConstants.SELECTED_LANGUAGE);
    
	String gs1ResponseElementKey =  request.getParameter(AWLConstants.GS1_RESPONSE_ELEMENTKEY);
    
    Map poaInfoMap = new HashMap();
    Map requestMap = new HashMap();
    requestMap.put(AWLConstants.SELECTED_POA_ID, poaId);
    requestMap.put(AWLConstants.GS1_RESPONSE_ELEMENTKEY, gs1ResponseElementKey);
    poaInfoMap.put(AWLConstants.requestMap, requestMap);
    String responseText = (String) JPO.invoke(context, "AWLPOAUI", null, "getCopyTextFromGS1", JPO.packArgs (poaInfoMap), String.class);
    
	new POA(poaId).addLocalCopiesToPOA(context, new ArtworkMaster(artworkMasterId), new StringList(strLanguage));
	new CopyElement(copyElementId).setCopyText(context, responseText);
	%> <script> refreshTableFrame("AWLArtworkResponseRoundTripSummary"); </script> <%
}
	
%> 
