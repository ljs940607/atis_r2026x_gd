<%@page import="com.matrixone.apps.awl.dao.CopyElement"%>
<%@ taglib uri="awl-taglib.tld" prefix="awl" %>

<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="jakarta.json.JsonArray"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>
<%@page import="java.util.Enumeration"%>
<%@page import="matrix.db.Policy"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<%@page import="matrix.db.Context"%>
<%@page import="java.util.*"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.domain.util.MapList"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import="com.matrixone.apps.domain.util.PropertyUtil"%>

<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../productline/emxProductCommonInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>
<%@include file="emxValidationInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@include file="../common/emxRTE.inc" %>

<script type="text/javascript" src="../components/emxComponentsJSFunctions.js"></script>
<script type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>
<script type="text/javascript" src="../awl/scripts/AWLCopyElementValidation.js"></script>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<%@include file = "../components/emxComponentsJavaScript.js"%>


<%
	try {
String browserLang = request.getHeader("Accept-Language");
String strListSeparator = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.ListItem.Seperator", AWLConstants.EMPTY_STRING);
String listSeparator[] = strListSeparator.split("#");

String eligibleType=  AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.compositeMasterCopy.EligibleTypes", AWLConstants.EMPTY_STRING);
eligibleType = PropertyUtil.getSchemaProperty(context, eligibleType);

String confirmResponsibleOrg=AWLPropertyUtil.getI18NString(context, "emxAWL.ResponsibleOrganization.ConfirmMessage");
String objectId = emxGetParameter(request,"objectId");
String contextMode = emxGetParameter(request,"context");
String openerFrame = emxGetParameter(request,"openerFrame");

String i18NBuildListYES = AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource", "emxFramework.Range.Build_List.Yes", null);
String i18NBuildListNO = AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource", "emxFramework.Range.Build_List.No", null);

StringList objSelect = new StringList(DomainConstants.SELECT_NAME);
objSelect.addElement(DomainConstants.SELECT_TYPE);
objSelect.addElement(DomainConstants.SELECT_POLICY);
objSelect.addElement(DomainConstants.SELECT_VAULT);
objSelect.addElement(AWLAttribute.MARKETING_NAME.getSel(context));
objSelect.addElement(AWLAttribute.BUILD_LIST.getSel(context));
objSelect.addElement(AWLAttribute.SEPARATOR.getSel(context));
Map mpFeature = BusinessUtil.getInfo(context,objectId,objSelect);

ArtworkMaster artworkMaster = new ArtworkMaster(objectId);
String copyId = artworkMaster.getBaseArtworkElement(context).getId(context);
Map atribMap	= UIRTEUtil.getAttributeDate(context, copyId , AWLAttribute.COPY_TEXT.get(context));  
String copyText = (String)atribMap.get("attributeValue");
MapList mCopyText = artworkMaster.related(AWLType.ARTWORK_ELEMENT,AWLRel.ARTWORK_ELEMENT_CONTENT).attr(AWLAttribute.COPY_TEXT).query(context);
MapList mList = artworkMaster.related(AWLType.MASTER_LIST_ITEM,AWLRel.SELECTED_LIST_ITEM).id().relAttr(AWLUtil.toArray(AWLAttribute.LIST_ITEM_SEQUENCE,AWLAttribute.ADDITIONAL_INFO)).query(context);
MapList mListCopyText = artworkMaster.related(AWLUtil.toArray(AWLType.MASTER_ARTWORK_ELEMENT,AWLType.ARTWORK_ELEMENT),AWLUtil.toArray(AWLRel.SELECTED_LIST_ITEM,AWLRel.ARTWORK_ELEMENT_CONTENT)).attr(AWLAttribute.COPY_TEXT).query(context);


String strBuildLisFrom = (String) mpFeature.get(AWLAttribute.BUILD_LIST.getSel(context));
String selectedListSeparator = (String) mpFeature.get(AWLAttribute.SEPARATOR.getSel(context));
String strUserVaultDisplay =(String)mpFeature.get(DomainConstants.SELECT_VAULT);
String strDesResId = "";
String strDesResName = "";
String strUserVault = (String)mpFeature.get(DomainConstants.SELECT_VAULT);
String policy = (String)mpFeature.get(DomainConstants.SELECT_POLICY);
 

MapList hevalue   = new MapList();
StringBuffer sb = new StringBuffer();
StringBuffer listItemsequence = new StringBuffer();
Iterator itr = mList.iterator();
String strSeqNumList ="";
String strAddInfoList="";
String strCopyTextList = "";

while(itr.hasNext())
{
	Map mp = (Map)itr.next();
	String objId =  (String) mp.get(DomainConstants.SELECT_ID);
	artworkMaster.setId(objId);	
	String strCopyId = artworkMaster.getBaseArtworkElement(context).getId(context);
	CopyElement ce = new CopyElement(strCopyId);
	String strCopyText = ce.getCopyText(context, true);
	String strSeqNum = (String) mp.get(AWLAttribute.LIST_ITEM_SEQUENCE.getSel(context)); 
	String strAddInfo = (String) mp.get(AWLAttribute.ADDITIONAL_INFO.getSel(context)); 
	
	if(!objId.equals("")){
		Map sample = new HashMap();
		sample.put("id", objId);
		sample.put("copyText",strCopyText);
		sample.put("sequence",strSeqNum);
		sample.put("AddInfo",strAddInfo);
		hevalue.add(sample);
		sb.append(strAddInfo);
		String strlistSeq = strSeqNum+"|"+objId+"|"+strAddInfo;
		strSeqNumList += strlistSeq;
		strAddInfoList += strAddInfo;
		strCopyTextList += strCopyText;
		listItemsequence.append(strSeqNum+"|"+objId+"|"+strAddInfo);
		if(itr.hasNext())
		{
	sb.append(",");
	listItemsequence.append(",");
	strSeqNumList += ",";
	        strAddInfoList += "|";
	        strCopyTextList += "|";
		}
	}
	
}

String checked = "Yes".equalsIgnoreCase(strBuildLisFrom) ? "checked" :"";
String notchecked = "No".equalsIgnoreCase(strBuildLisFrom) ? "checked" :"";
JsonArray array = BusinessUtil.toJSONArray(hevalue);
%>

<form name="ArtworkMasterCreate" method="post" onsubmit="submitForm(); return false" 
	style="overflow:hidden; ">
	
	<div id="masterElementData" style="float:center;">
		<table border="0" cellpadding="5" cellspacing="2" width="100%">
			
		 <input type="hidden" name="listItemSequence" value="<xss:encodeForHTMLAttribute><%=strSeqNumList%></xss:encodeForHTMLAttribute>" />
         <input type="hidden" name="addtionalInfo" value="<xss:encodeForHTMLAttribute><%=strAddInfoList%></xss:encodeForHTMLAttribute>" />
         <input type="hidden" name="OldtxtMarketingName" value = "<xss:encodeForHTMLAttribute><%=mpFeature.get(AWLAttribute.MARKETING_NAME.getSel(context))%></xss:encodeForHTMLAttribute>" />
         <input type="hidden" name="OldBuildFrmListItem" value = "<xss:encodeForHTMLAttribute><%=mpFeature.get(AWLAttribute.BUILD_LIST.getSel(context))%></xss:encodeForHTMLAttribute>" />
         <input type="hidden" name="txtFeaturePolicy" value="<xss:encodeForHTMLAttribute><%=policy%></xss:encodeForHTMLAttribute>" />
         <input type="hidden" name="txtFeatureVaultDisplay" size="20" value="<xss:encodeForHTMLAttribute><%=strUserVaultDisplay%></xss:encodeForHTMLAttribute>" readonly="readonly" />
         <input type="hidden" name="txtFeatureVault" value="<xss:encodeForHTMLAttribute><%=strUserVault%></xss:encodeForHTMLAttribute>" size=15 />
	 <input type="hidden" name="hidCopyTextList" value="<xss:encodeForHTMLAttribute><%=strCopyTextList%></xss:encodeForHTMLAttribute>" />
         
         
         		
			<awl:label localize="i18nId">emxFramework.Basic.Name</awl:label>
			
			<awl:field><%= XSSUtil.encodeForHTML(context, (String)mpFeature.get(DomainConstants.SELECT_NAME)) %></awl:field>
				
			<awl:labelReq  localize="i18nId">emxFramework.Basic.Type</awl:labelReq>
			
			<!--XSSOK I18N value for Type-->
			<awl:field><%=AWLPropertyUtil.getTypeI18NString(context, (String)mpFeature.get(DomainConstants.SELECT_TYPE), false) %></awl:field>
			
			<awl:label  localize="i18nId">emxFramework.Attribute.Marketing_Name</awl:label>	
			
			<awl:field>
				<input type="text" name="txtMarketingName" size="20" onBlur="setMarketingNameFlag()" value="<xss:encodeForHTMLAttribute><%=mpFeature.get(AWLAttribute.MARKETING_NAME.getSel(context))%></xss:encodeForHTMLAttribute>" />
			</awl:field>	

			<!--XSSOK browserLang is coming from Request Header-->            
			<awl:labelReq id="BuildFrmListLabel" localize="i18nId" bundle="emxAWLStringResource" language="<%=browserLang%>" > 
				emxAWL.Label.BuildFromList
			</awl:labelReq>
					
			<awl:field name="BuildFrmListOption" id="BuildFrmListOption" >
				<!-- XSSOK checked, i18NBuildListYES : checked is coming from logic, i18NBuildListYES is an RES - I18 value -->
				<input type="radio" name="BuildFrmListItem" value="Yes" onClick ="changeVisibilityForYes()" onChange="checkAcessForYesOnBuildFromList()" <%=checked%>> <%=i18NBuildListYES%>
                </input>
				<!-- XSSOK notchecked,  i18NBuildListNO : notchecked is coming from logic, i18NBuildListNO is an RES - I18 value-->
				<input type="radio" name="BuildFrmListItem" value="No" onClick ="changeVisibilityForNo()" onChange="checkAcessForYesOnBuildFromList()" <%=notchecked%>> <%=i18NBuildListNO%>
                </input>
			</awl:field>             

			<awl:labelReq name="ListSeparatorsLabel" id="ListSeparatorsLabel"  localize="i18nId" bundle="emxAWLStringResource" 
					language="<%=XSSUtil.encodeForHTML(context,browserLang)%>" >emxAWL.Label.ListSeparator</awl:labelReq>

			<awl:field name="ListSeparators" id="ListSeparators" >
				<select style="width:12em" name="listSeparator" onchange="changeCopyText(this);">                 
				    <%
                 				    	String EMPTY_STRING = "";
                 				                     				                     				                     				                     				                     				                     				    				
                 				                     				                     				                     				                     				                     				                     				    				  for(String separator :listSeparator){
                 				                     				                     				                     				                     				                     				                     				    					if (!separator.equals(EMPTY_STRING)){
                 				    %>	
							
								<option value="<xss:encodeForHTMLAttribute><%=separator%></xss:encodeForHTMLAttribute>" 
								
								<%if(separator.equals(selectedListSeparator)) {%> selected="true" <%}%>><xss:encodeForHTML><%=separator%></xss:encodeForHTML></option>
					<%
						}
																											}
					%>
		  		</select>
			</awl:field>
			
			

			<awl:label localize="i18nId" bundle="emxAWLStringResource" language="<%=XSSUtil.encodeForHTML(context,browserLang)%>" >emxAWL.Table.CopyText</awl:label>
		
      
       		<awl:field>
				<div>
					<textarea cols="25" name="txtFeatureMarketingText" class="rte" rows="6"><%=XSSUtil.encodeForHTML(context,copyText)%></textarea>
				</div>
				<div id="AddListItemButton" name ="AddListItemButton" style="display:none;">
				<!-- XSSOK copyId : local variable/DB Value - OID or REL ID -->
					<a href="#top-test"><img name="BuildFrmListImage"  src="../awl/images/AWLBuildFromList.gif" border="0" align="middle" TITLE="BuildFrmList" onclick="javascript:showListDialog('../awl/AWLBuildListDialogFS.jsp?&fieldNameActual=txtFeatureMarketingText&fieldNameDisplay=txtFeatureMarketingText&fieldListItemName=listItemId&fieldListItemDisplay=listItemId&fieldSeparatorName=listSeparator&objectId=<%=copyId%>');"/></a>
				</div>
			</awl:field>
    		<awl:label localize="i18nId" bundle="emxAWLStringResource" language="<%=XSSUtil.encodeForHTML(context,browserLang)%>" >emxFramework.Basic.Policy</awl:label>
    		<!-- XSSOK policy : DB Schema policy variable -->
    		<awl:field><%=policy%></awl:field>
			<!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
     		<awl:labelReq localize="i18nId" bundle="emxAWLStringResource" language="<%=XSSUtil.encodeForHTML(context,browserLang)%>" >
     		emxAWL.Attribute.Design_Responsibility
     		</awl:labelReq>
      
      		<awl:field>
      			<input type="text" name="txtFeatureDesResp" size="20" value="<xss:encodeForHTMLAttribute><%=strDesResName%></xss:encodeForHTMLAttribute>" readonly="readonly" />
      			<input class="button" type="button" name="btnFeatureDesignResponsibility" size="200" value="..." alt="" onClick="javascript:showDesignResponsibilitySelector();">
      			<input type="hidden" name="txtFeatureDesignResponsibility" value="<xss:encodeForHTMLAttribute><%=strDesResId%></xss:encodeForHTMLAttribute>" />
      			<a name="ancClear" href="#ancClear" class="dialogClear" onclick="javascript:doValidateClear();"> 
      			<emxUtil:i18n localize="i18nId">emxProduct.Button.Clear</emxUtil:i18n> 
      			</a>
      		</awl:field>
      
		     <awl:label localize="i18nId">emxFramework.Basic.Vault</awl:label>  
			 <!-- XSSOK strUserVaultDisplay : local variable/DB Schema - Vault -->
		     <awl:field><%=strUserVaultDisplay%></awl:field>
		  </table>
    </form>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script type="text/javaScript">
var strFeatureBuildListValue = "<xss:encodeForJavaScript><%=strBuildLisFrom%></xss:encodeForJavaScript>";
var removeCopyText = "No";
var isProcessing = false;	

if(strFeatureBuildListValue=="Yes")
    {
	 window.onload=changeVisibilityForYes; 
    }
else{
        window.onload=changeVisibilityForNo;                  
    }    

var  formName = document.ArtworkMasterCreate;
<%String strURL = "../awl/AWLArtworkElementProcess.jsp?mode=editCompositeCopyElementAction&objectId="+objectId+"&openerFrame="+openerFrame+"&context="+contextMode;%>

function submitForm()
{
	submit();
} 

function submit()
{

	if(isProcessing)
	{
	 	alert(emxUIConstants.STR_URL_SUBMITTED);
	}
	else
	{
		formName.action= "<xss:encodeForJavaScript><%=strURL%></xss:encodeForJavaScript>";
		validateFeature();
		formName.target = "jpcharfooter";
		turnOnProgress();
		isProcessing = true;
		formName.submit();
		return;
	}
}
function validateFeature()
{
  var iValidForm = true; 

	 if (iValidForm)
	 {
		//XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
		var fieldName = "<%=AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource", "emxFramework.Attribute.Marketing_Name", null)%> ";
		var field = formName.txtMarketingName;
		iValidForm = basicValidation(formName,field,fieldName,true,true,false,false,false,false,false);
		if(iValidForm)
	    {
	        iValidForm = singleSpecCharValidation(field);
	    }        
	
	 }
	
	if (iValidForm)
	 {
	   //XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
	   var fieldName = "<%=AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource", "emxFramework.Attribute.Marketing_Text", null)%>";
	   var field = formName.txtFeatureMarketingText;
	   iValidForm = basicValidation(formName,field,fieldName,false,false,false,false,false,false,checkBadChars);
	 }
    if (!iValidForm)
	 {
		 return ;
	 }
}

//close button
function closeWindow()
{
	getTopWindow().closeSlideInDialog();
}
</script>

<%
    } catch (Exception e) {
            emxNavErrorObject.addMessage(e.toString().trim());
            session.setAttribute("error.message", e.toString().trim());
            e.printStackTrace();
        }
%>
<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
<%@include file="../emxUICommonEndOfPageInclude.inc"%>
   


