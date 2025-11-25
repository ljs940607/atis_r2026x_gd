<%--  AWLArtworkElementReviseDialog.jsp

   Copyright (c) 1999-2020 Dassault Systemes.

  All Rights Reserved.
  This program contains proprietary and trade secret information
  of MatrixOne, Inc.  Copyright notice is precautionary only and
  does not evidence any actual or intended publication of such program
--%>
<%-- Include file for error handling --%>
<%@page import="jakarta.json.JsonArray"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%-- Common Includes --%>
<%@include file = "../productline/emxProductCommonInclude.inc" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file="emxValidationInclude.inc"%>
<%@page import="com.matrixone.apps.productline.*"%>
<%@ page import="com.matrixone.apps.domain.DomainConstants" %>
<%@ page import = "com.matrixone.apps.domain.DomainObject"%>
<%@ page import = "com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@ include file="../common/emxRTE.inc" %>

<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import="com.matrixone.apps.awl.dao.GraphicsElement"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="java.util.Map"%>
<%@page import="matrix.db.JPO"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICore.js"></script> 
<script type="text/javascript" src="../cpd/regioncountry/scripts/tree.js"></script>
<script type="text/javascript" src="../cpd/regioncountry/scripts/eventboundlist.js"></script>

<LINK href="../cpd/regioncountry/scripts/tree.css" rel="stylesheet" type="text/css">
<LINK href="../cpd/regioncountry/scripts/eventboundlist.css" rel="stylesheet" type="text/css">

<%
	//Exception variable is used to check if the dialog is to be closed in case of exception.
boolean bException = false;

String  strType = "";
String language = context.getSession().getLanguage();
String stringResource   = emxGetParameter(request, "StringResourceFileId");
boolean graphic = false;

try{
	//Retrieves objectId to make use for the revise process
	//XSSOK we are reading object information using objectId, this is not passed directly to any page.
	String objectId	= emxGetParameter(request, "objectId");
	boolean isGraphicMaster = ArtworkElementUtil.isMasterGraphicElement(context, objectId);
	if(isGraphicMaster) {
		objectId = ((GraphicsElement)new ArtworkMaster(objectId).getBaseArtworkElement(context)).getGraphicDocument(context).getObjectId(context);
	}
	Map<String, String> contentInfoMap = AWLUtil.getContentInformationForReviseDialog(context, objectId);
	strType = BusinessUtil.getString(contentInfoMap, DomainConstants.SELECT_TYPE);
	String strDisplayType = AWLPropertyUtil.getTypeI18NString(context, strType, false);
	graphic = "Yes".equals(BusinessUtil.getString(contentInfoMap, AWLUtil.IS_GRAPHIC_ELEMENT));
	boolean composite = "Yes".equals(BusinessUtil.getString(contentInfoMap, AWLUtil.IS_COMPOSITE_COPY));
	boolean authorAsApprover = "Yes".equals(BusinessUtil.getString(contentInfoMap, AWLUtil.AUTHOR_AS_APPROVER));
	String baseCopy = BusinessUtil.getString(contentInfoMap, AWLUtil.BASE_COPY);
	String strCopyLanguage = BusinessUtil.getString(contentInfoMap, AWLUtil.COPY_LANGUAGE);
	String strBuildList = BusinessUtil.getString(contentInfoMap, AWLUtil.BUILD_FROM_LIST);

	String encrypt = graphic?"enctype=\"multipart/form-data\"" : "";
	String authoringTemplate = BusinessUtil.getString(contentInfoMap, AWLUtil.AUTHORING_TEMPLATE);
	String approvalTemplate = BusinessUtil.getString(contentInfoMap, AWLUtil.APPROVAL_TEMPLATE);
	String copyElementId = BusinessUtil.getString(contentInfoMap, AWLUtil.COPY_ELEMENT_ID);
	String graphicFeatureType = BusinessUtil.getString(contentInfoMap, AWLUtil.GRAPHIC_MASTER_TYPE);
	String masterId = BusinessUtil.getString(contentInfoMap, AWLUtil.MASTER_ID);
	String baseCopyId = BusinessUtil.getString(contentInfoMap, AWLUtil.BASE_COPY_ID);
	String seperator = BusinessUtil.getString(contentInfoMap, AWLUtil.SEPERATOR);
	String strAuthor = BusinessUtil.getString(contentInfoMap, AWLUtil.AUTHOR_NAME);
	String strApprover = BusinessUtil.getString(contentInfoMap, AWLUtil.APPROVER_NAME);
	String checkboxDisable = BusinessUtil.getString(contentInfoMap, AWLUtil.CHECKBOX_DISABLE);
	String checked = BusinessUtil.getString(contentInfoMap, AWLUtil.CHECKED);
	String strDisableAuthorPerson = BusinessUtil.getString(contentInfoMap, AWLUtil.DISABLE_AUTHOR_PERSON);
	String strDisableAuthorRoute = BusinessUtil.getString(contentInfoMap, AWLUtil.DISABLE_AUTHOR_ROUTE);
	String strDisableApproverPerson = BusinessUtil.getString(contentInfoMap, AWLUtil.DISABLE_APPROVER_PERSON);
	String strDisableApproverRoute = BusinessUtil.getString(contentInfoMap, AWLUtil.DISABLE_APPROVER_ROUTE);
	String currentContent = BusinessUtil.getString(contentInfoMap, AWLUtil.CURRENT_COPY_CONTENT);
	String strBaseCopyContent = BusinessUtil.getString(contentInfoMap, AWLUtil.BASE_COPY_CONTENT);
	String strMasterCopy = BusinessUtil.getString(contentInfoMap, AWLUtil.MASTER_COPY);
	
	String strAuthorDisplay = BusinessUtil.isNotNullOrEmpty(strDisableAuthorPerson) ? "" : strAuthor;
	String strAuthoringRouteDisplay =  BusinessUtil.isNotNullOrEmpty(strDisableAuthorRoute) ? "" : strAuthor;
	String strApproverDisplay =  BusinessUtil.isNotNullOrEmpty(strDisableApproverPerson) ? "" : strApprover;
	String strApproverRouteDisplay =  BusinessUtil.isNotNullOrEmpty(strDisableApproverRoute) ? "" : strApprover;

	if(graphic)
	{
	    Map imageMap = UINavigatorUtil.getImageData(context, pageContext);
	    HashMap requestMap = new HashMap();
	    requestMap.put("objectId",objectId);
	    requestMap.put("ImageData",imageMap);
	    HashMap methodArg = new HashMap();
	    methodArg.put("requestMap",requestMap);
	    String[] methodArgs = JPO.packArgs(methodArg);

	    strBaseCopyContent = (String)JPO.invoke(context, "AWLGraphicsElementUI", null, "getGraphicImageURL", methodArgs, String.class);
	    currentContent= strBaseCopyContent;
	}
	
    String strListSeparator= AWLPropertyUtil.getConfigPropertyString(context,"emxAWL.ListItem.Seperator", AWLConstants.EMPTY_STRING);
    String listSeparator[]=strListSeparator.split("#");
    
    String strSeqNumList ="";
	String strAddInfoList="";
	String strCopyTextList = "";
	MapList hevalue   = new MapList();
	StringBuffer sb = new StringBuffer();
	StringBuffer listItemsequence = new StringBuffer();
    if(composite)
    {
    	ArtworkMaster artworkMaster = new ArtworkMaster(masterId);
    	MapList mList = artworkMaster.related(AWLType.MASTER_LIST_ITEM,AWLRel.SELECTED_LIST_ITEM).id().relAttr(AWLUtil.toArray(AWLAttribute.LIST_ITEM_SEQUENCE,AWLAttribute.ADDITIONAL_INFO)).query(context);
    	Iterator itr = mList.iterator();

    	while(itr.hasNext())
    	{
    		Map mp = (Map)itr.next();
    		String objId =  (String) mp.get(DomainConstants.SELECT_ID);
    		artworkMaster.setId(objId);	
    		String strCopyText =artworkMaster.getLocalCopyText(context,strCopyLanguage,true);
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

    }
    JsonArray array = BusinessUtil.toJSONArray(hevalue);
%>

<script>
//XSSOK authorAsApprover value assigned from logic
var authorAsApprover = "<%=authorAsApprover%>";
	function openSearchDialog(action)
	{
		var field = "TYPES=type_Person:CURRENT=policy_Person.state_Active:";
		var urlParams = "";
		var base = "<%=XSSUtil.encodeForJavaScript(context,baseCopy)%>";
		var hiddenField = "";
		var hiddenFieldOID="";
		switch (action) {
			case "author": {
				field += (base == "Yes")?"USERROLE=role_MasterCopyAuthor,role_VPLMCreator":"USERROLE=role_LocalCopyAuthor,role_VPLMCreator";
				urlParams = "type=PERSON_CHOOSER&field="+field+"&table=AEFPersonChooserDetails&selection=single";
				hiddenField = "hiddenAuthor";
				hiddenFieldOID = "hiddenAuthorOID";
				document.ArtworkElementRevise.authorTemplate.value="";
				enableField("btnAuthorTemplate", false);
				break;
			}
			case "approver": {
	            field += (base == "Yes")?"USERROLE=role_MasterCopyApprover,role_VPLMProjectLeader":"USERROLE=role_LocalCopyApprover,role_VPLMProjectLeader";
	            urlParams = "type=PERSON_CHOOSER&field="+field+"&table=AEFPersonChooserDetails&selection=single";
	            hiddenField = "hiddenApprover";
	            hiddenFieldOID = "hiddenApproverOID";
	            document.ArtworkElementRevise.approverTemplate.value="";
				enableField("btnApproverTemplate", false);
				break;
			}
			case "authorTemplate": {
	            urlParams = "field=TYPES=type_RouteTemplate:ROUTE_BASE_PURPOSE=Review,Standard,Approval&table=AEFGeneralSearchResults&selection=single&form=AWLSearchRouteTemplateForm";
	            hiddenField = "hiddenAuthor";
	            hiddenFieldOID = "hiddenAuthorOID";
	            document.ArtworkElementRevise.author.value="";
				enableField("btnAuthor", false);
				break;
			}
			case "approverTemplate": {
				urlParams = "field=TYPES=type_RouteTemplate:ROUTE_BASE_PURPOSE=Approval&table=AEFGeneralSearchResults&selection=single&form=AWLSearchRouteTemplateForm";
				hiddenField = "hiddenApprover";
				hiddenFieldOID = "hiddenApproverOID";
				document.ArtworkElementRevise.approver.value="";
				enableField("btnApprover", false);
				break;
			}
		}
	
		var href= "../common/emxFullSearch.jsp?"+urlParams+"&formName=ArtworkElementRevise"+
		   "&hideHeader=true&HelpMarker=emxhelpfullsearch&submitURL=../common/AEFSearchUtil.jsp"+
		   "&mode=Chooser&chooserType=FormChooser&fieldNameDisplay="+action+"&fieldNameActual="+hiddenField+"&fieldNameOID="+hiddenFieldOID;
		showChooser(href,null,null);
	}
		function clearAssignment(passedAction)
		{
			
			var passedElement = eval("document.ArtworkElementRevise."+passedAction);
			if (passedElement.value != "")
			{
				passedElement.value = "";
				if(passedAction == "author" || passedAction == "authorTemplate")
				{
					document.ArtworkElementRevise.hiddenAuthor.value = "";
					document.ArtworkElementRevise.hiddenAuthorOID.value = "";
					enableField("btnAuthor", true);
					enableField("btnAuthorTemplate", true);
					if (authorAsApprover == "true") {
						enableField("btnApprover", true);
		                enableField("btnApproverTemplate", true);
					}
				}
				else
				{
					document.ArtworkElementRevise.hiddenApprover.value = "";
					document.ArtworkElementRevise.hiddenApproverOID.value = "";
	                enableField("btnApprover", true);
	                enableField("btnApproverTemplate", true);
				}
				enableField("authorAsApprover", true);

				if (document.ArtworkElementRevise.authorAsApprover.checked) {
					document.ArtworkElementRevise.authorAsApprover.checked = false;
					document.ArtworkElementRevise.hiddenAuthorAsApprover.value = "false";
				}
			}
		}

		function enableField (fieldName, blnEnable) {
			var btnElement = eval("document.ArtworkElementRevise."+fieldName);
			if(btnElement.disabled == blnEnable)
				  btnElement.disabled = !blnEnable;
		}

		function enableDiableCheckBox (clicked) {
			enableField("btnApprover", !clicked);
	        enableField("btnApproverTemplate", !clicked);
	        if (clicked) {
	            document.ArtworkElementRevise.approver.value = "";
	            document.ArtworkElementRevise.approverTemplate.value = "";
	            document.ArtworkElementRevise.hiddenApprover.value = document.ArtworkElementRevise.hiddenAuthor.value;
	            document.ArtworkElementRevise.hiddenApproverOID.value = document.ArtworkElementRevise.hiddenAuthorOID.value;
	            document.ArtworkElementRevise.hiddenAuthorAsApprover.value = "true";
	        } else {
	        	document.ArtworkElementRevise.hiddenAuthorAsApprover.value = "false";
	        }
		}

		function showBuildFromList()
		{
			var url = "../awl/AWLBuildListDialogFS.jsp?fieldNameActual=newCopyText&fieldNameDisplay=newCopyText";
			url += "&fieldListItemName=listItemId&fieldListItemDisplay=listItemId&fieldSeparatorName=listSeparator";
			url += "&baseCopy=<%=XSSUtil.encodeForURL(baseCopy)%>";
			url += "&objectId=<%=XSSUtil.encodeForURL(copyElementId)%>";
		    
			url += "&copyLanguage=<%=XSSUtil.encodeForURL(strCopyLanguage)%>";
			showListDialog(url);
		}
		function disableCopyText()
		{
			var compostieCopy = "<%=XSSUtil.encodeForJavaScript(context, new Boolean(composite).toString())%>";
			var buildList = "<%=XSSUtil.encodeForJavaScript(context,strBuildList)%>";
			if(compostieCopy = "true" && buildList == "Yes")
			{
				document.getElementsByName("newCopyText")[0].disableRTE();
			}			
			document.ArtworkElementRevise.hiddenAuthorAsApprover.value = (authorAsApprover == "true") ? authorAsApprover : "false";
		}
		window.onload = disableCopyText;
	</script>

<%@include file="../emxUICommonHeaderEndInclude.inc"%>
<!-- XSSOK encrypt for file upload page should be multipart this  is coming from logic-->	
<form name="ArtworkElementRevise" method="post" onsubmit="submit()" <%=encrypt%> >

<input type="hidden" name="hiddenAuthor" value="<xss:encodeForHTMLAttribute><%=strAuthor%></xss:encodeForHTMLAttribute>"/>
<input type="hidden" name="hiddenApprover" value="<xss:encodeForHTMLAttribute><%=strApprover%></xss:encodeForHTMLAttribute>"/>
<input type="hidden" name="hiddenAuthorOID" value="<xss:encodeForHTMLAttribute><%=authoringTemplate%></xss:encodeForHTMLAttribute>"/>
<input type="hidden" name="hiddenApproverOID" value="<xss:encodeForHTMLAttribute><%=approvalTemplate%></xss:encodeForHTMLAttribute>"/>
	<input type="hidden" name="objectId" value="<xss:encodeForHTMLAttribute><%=copyElementId%></xss:encodeForHTMLAttribute>">
	<input type="hidden" name="contentId" value="<xss:encodeForHTMLAttribute><%=copyElementId%></xss:encodeForHTMLAttribute>">
	<input type="hidden" name="strFeatureType" value="<xss:encodeForHTMLAttribute><%=graphicFeatureType%></xss:encodeForHTMLAttribute>">
	<input type="hidden" name="isGraphic" value="<xss:encodeForHTMLAttribute><%=graphic%></xss:encodeForHTMLAttribute>">
	<input type="hidden" name="isComposite" value="<xss:encodeForHTMLAttribute><%=composite%></xss:encodeForHTMLAttribute>">
	<input type="hidden" name="masterId" value="<xss:encodeForHTMLAttribute><%=masterId%></xss:encodeForHTMLAttribute>">
	<input type="hidden" name="baseCopy" value="<xss:encodeForHTMLAttribute><%=baseCopy%></xss:encodeForHTMLAttribute>">
	<input type="hidden" name="hiddenAuthorAsApprover" value="<xss:encodeForHTMLAttribute><%=authorAsApprover%></xss:encodeForHTMLAttribute>">
	<input type="hidden" name=listSeperator value="<xss:encodeForHTMLAttribute><%=seperator%></xss:encodeForHTMLAttribute>">
	<input type="hidden" name="listItemSequence" value="<xss:encodeForHTMLAttribute><%=strSeqNumList%></xss:encodeForHTMLAttribute>" />
    <input type="hidden" name="addtionalInfo" value="<xss:encodeForHTMLAttribute><%=strAddInfoList%></xss:encodeForHTMLAttribute>" />
    <input type="hidden" name="hidCopyTextList" value="<xss:encodeForHTMLAttribute><%=strCopyTextList%></xss:encodeForHTMLAttribute>" />
    <input type="hidden" name="masterCopy" value="<xss:encodeForHTMLAttribute><%=strMasterCopy%></xss:encodeForHTMLAttribute>">

	<table border="0" cellpadding="5" cellspacing="2" width="100%">
        <tr>
            <td width="150" nowrap="nowrap" class="label">
                <emxUtil:i18n localize="i18nId">emxFramework.Basic.Type</emxUtil:i18n>
            </td>
        </tr>
        <tr>
            <!-- XSSOK I18N value for Type -->
            <td nowrap="nowrap" class="field"><%=strDisplayType%></td>
        </tr>
        <%
        	if(!graphic)
            {
        %>
		<tr>
			<td width="150" nowrap="nowrap" class="label">
			 <!-- XSSOK I18N Label or Message --> 
			 <%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Table.Language", null)%>
			</td>
		</tr>
		<tr>
			<td nowrap="nowrap" class="field"><xss:encodeForHTML><%=strCopyLanguage%></xss:encodeForHTML></td>
		</tr>
        <%
        	}
            if (!"Yes".equals(baseCopy))
            {
        %>
		<tr>
			<td width="150" nowrap="nowrap" class="label">
				<!-- XSSOK I18N Label or Message -->
				<%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Form.Label.Master.Contnet", null)%>
			</td>
		</tr>
		<tr><%-- Fix IR-286540 --%>
			<!-- XSSOK I18N Label or Message -->
			<td nowrap="nowrap" class="field verbatim"><%=strBaseCopyContent%></td> 
		</tr>
        <%
        	}
            
            if(!new ArtworkMaster(masterId).isStructuredElementRoot(context)){
        %>
		<tr>
			<td width="150" nowrap="nowrap" class="label">
				<!-- XSSOK I18N Label or Message -->
				<%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Form.Label.CurrentContent", null)%>
			</td>
		</tr>
		<tr>
			<!-- XSSOK Copy Text Cannot be encoded -->
			<td nowrap="nowrap" class="field verbatim"><%=currentContent%></td>		
		</tr>
		<%
		}
		if(composite)
		{
		%>
    <tr name="ListSeparatorsLabel" id="ListSeparatorsLabel" >
        <td width="120" nowrap="nowrap" class="labelRequired" id="lListSeparators">
            <!-- XSSOK I18N Label or Message -->
            <%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Label.ListSeparator", null)%>
        </td>
     </tr>
      <tr name="ListSeparators" id ="ListSeparators" >
          <td class="field">                 
              <select style="width:12em" name="listSeparator" >
                  <%
                  	for(int i=0;i<listSeparator.length;i++){
                         String strSelected = "";
                         if(listSeparator[i].equals(seperator))
                         	strSelected = "selected=\"selected\"";
                       %>      
                           <!--XSSOK listSeparator[i] value will be coming from Prop Configuration -->
                           <framework:ifExpr expr="<%=!DomainConstants.EMPTY_STRING.equals(listSeparator[i])%>">
                                    <!--XSSOK strSelected Static Value -->
                                    <option value="<%=listSeparator[i]%>" <%=strSelected%> >
                                    <!--XSSOK listSeparator[i] value will be coming from Prop Configuration -->
                                       <%=listSeparator[i]%>
                                    </option>
                           </framework:ifExpr>
                  
                 <% } %>
              </select>
            </td>
          
      </tr>
		<%
			}
			if(!graphic && !new ArtworkMaster(masterId).isStructuredElementRoot(context))
			{
		%>
		<tr>
			<td width="150" nowrap="nowrap" class="labelRequired">
				<!-- XSSOK I18N Label or Message -->
				<%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Label.NewValue", null)%>
			</td>
		</tr>
		<tr>
		    <td nowrap="nowrap" class="field">
		        <textarea class="rte" name="newCopyText"></textarea>
		    </td>
		</tr>
		<tr>
		    <td nowrap="nowrap" class="field">
		        <!-- XSSOK I18N Label or Message -->
		        <% if(composite) { %>
		            <div id="AddListItemButton">
		                <a href="#top-test"><img name="BuildFrmListImage" src="../awl/images/AWLBuildFromList.gif" border="0" align="middle" TITLE="BuildFrmList" onclick="javascript:showBuildFromList();" />
		                </a>
		            </div>
		            <% } %>
		    </td>
		</tr>
           <%
           } else if (graphic)
		   {
            %>
                <tr>
                    <td width="150" nowrap="nowrap" class="label">
                    <!-- XSSOK I18N Label or Message --> 
                    <%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Form.ReviseOptions", null)%></td>
                </tr>
                <tr>
                    <td class="field">
                    <input type="checkbox" name="reviseWithFiles" value="true" checked="checked" ></input>
                      <!-- XSSOK I18N Label or Message -->
                      <%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Form.ReviseWithFiles", null)%>
                    </td>
                </tr>
				<tr>
					<td width="150" nowrap="nowrap" class="label">
					<!-- XSSOK I18N Label or Message -->
					<%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.CompanyDialog.Image/File", null)%></td>
				</tr>
				<tr>
					<td>
					<input type="file" name="newImage" value="Upload Image" />
					<input type="hidden" name="fileName0" id="fileName0">
					</td>
				</tr>
				<%
					}
				%>
</table>
    <br />
	<table class="list" id="UITable">
		<tr>
		  <th>
		      <!-- XSSOK I18N Label or Message -->
		      <%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Label.Author", null)%>
		  </th>
		</tr>
	 </table>
	 <table>
		<tr>
			<td nowrap="nowrap" class="field">
			     <!-- XSSOK I18N Label or Message -->
			     <b><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Form.Label.Person", null)%></b><br/>
				<input type="text" name="author" value="<xss:encodeForHTMLAttribute><%=strAuthorDisplay%></xss:encodeForHTMLAttribute>" readonly="readonly" />
				<!-- XSSOK strDisableAuthorPerson static value/coming from logic-->
				<input type="button" name="btnAuthor" onClick="javascript:openSearchDialog('author')" <%=strDisableAuthorPerson%> value="..."/>
				<!-- XSSOK I18N Label or Message -->    
				<a href="javascript:clearAssignment('author');" ><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxCommonButton.Clear", null)%></a>
			</td>
		</tr>
		<tr>
			<td nowrap="nowrap" class="field">
			     <!-- XSSOK I18N Label or Message -->
			     <b><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Form.Label.RouteTemplate", null)%></b><br/>
				<input type="text" name="authorTemplate" value="<xss:encodeForHTMLAttribute><%=strAuthoringRouteDisplay%></xss:encodeForHTMLAttribute>" readonly="readonly">
				<!-- XSSOK strDisableAuthorRoute static value/coming from logic-->
				<input type="button" name="btnAuthorTemplate" onClick="javascript:openSearchDialog('authorTemplate')" <%=strDisableAuthorRoute%> value="..."/>
 				<!-- XSSOK I18N Label or Message -->        
				<a href="javascript:clearAssignment('authorTemplate');" ><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxCommonButton.Clear", null)%></a>
			</td>
		</tr>
		</table>
    <br />
	<table class="list" id="UITable">
		<tr>
		  <!-- XSSOK I18N Label or Message --> 
		  <th><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Label.Approver", null)%></th>
		</tr>
	 </table>
	 <table>
		<tr>
			<td nowrap="nowrap" class="field">
			     <!-- XSSOK I18N Label or Message -->
			     <b><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Form.Label.AssignAuthorAsApprover", null)%></b><br/>
			     <!-- XSSOK checkboxDisable and checked are static values-->
				<input type="checkbox" name="authorAsApprover" onClick="enableDiableCheckBox(this.checked);" value="" <%=checkboxDisable%> <%=checked%> />
			</td>
		</tr>
		<tr>
			<td nowrap="nowrap" class="field">
                 <!-- XSSOK I18N Label or Message -->
			     <b><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Form.Label.Person", null)%></b><br/>
				<input type="text" name="approver" value="<xss:encodeForHTMLAttribute><%=strApproverDisplay%></xss:encodeForHTMLAttribute>" readonly="readonly">
				<!-- XSSOK strDisableApproverPerson static value/coming from logic-->
				<input type="button" name="btnApprover" onClick="javascript:openSearchDialog('approver')" <%=strDisableApproverPerson%> value="..."/>
				<!-- XSSOK I18N Label or Message -->
				<a href="javascript:clearAssignment('approver');" ><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxCommonButton.Clear", null)%></a>
			</td>
		</tr>
		<tr>
			<td nowrap="nowrap" class="field">
			     <!-- XSSOK I18N Label or Message -->
			     <b><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Form.Label.RouteTemplate", null)%></b><br/>
				<input type="text" name="approverTemplate" value="<xss:encodeForHTMLAttribute><%=strApproverRouteDisplay%></xss:encodeForHTMLAttribute>" readonly="readonly">
				<!-- XSSOK strDisableApproverRoute static value/coming from logic-->
				<input type="button" name="btnApproverTemplate" onClick="javascript:openSearchDialog('approverTemplate')" <%=strDisableApproverRoute%> value="..."/>
				<!-- XSSOK I18N Label or Message -->       
				<a href="javascript:clearAssignment('approverTemplate');" ><%=AWLPropertyUtil.getI18NString(context, stringResource, "emxCommonButton.Clear", null)%></a>
			</td>
		</tr>
		</table>
  </form>
<%
	}catch(Exception e)
  {
	  session.setAttribute("error.message", e.getMessage());
	    bException = true;
  }
%>
<script language="javascript" src="../common/scripts/emxJSValidationUtil.js"></script>
<script language="javascript" src="../common/scripts/emxUIModal.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>

<script language="javascript" type="text/javaScript">

	var  formName = document.ArtworkElementRevise;
	var isProcessing = false;		
	//XSSOK graphic value is static/value assigned from check not from DB or Request
	 var graphicElement = <%=graphic%>;
	function submit()
	{
		if(isProcessing)
		{
			alert(emxUIConstants.STR_URL_SUBMITTED);
		}
		else
		{
			
			var iValidForm = true;
			//Validation check for  Max Length and Bad characters for field  Description
			   if (iValidForm)
			   {
				//XSSOK I18N Label or Message
				var fieldName = "<%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Label.NewValue", null)%>";
				var field = formName.newCopyText;
				if (field && field.value == "") {
                                    //XSSOK I18N Label or Message
                                    alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.checkEmptyString")%>");
                                    iValidForm = false;
                                }
	                        if(!iValidForm)
	                            return;      
			   }
			   var tempFileName = "";
			   if (graphicElement)
			   	tempFileName = document.ArtworkElementRevise.newImage.value;
			   if (iValidForm && tempFileName != "")
				{
				   var fileSep = "\\";
			        if (isUnix || isMac) {
			                fileSep = "/";
			        }

			        // In Mac, Netscape 7.0 and less, file separator is :
			        // In Mac, Netscape 7.1 and above, file separator is /
			        // basically in Mac / Netscape look for :, if not found look for /
			        if ( isMac && isMinMoz1)
			        {
			          fileSep = ":";
			          slIndex = tempFileName.lastIndexOf(fileSep);
			          if(slIndex == -1)
			          {
			            fileSep = "/";
			          }
			        }
			        slIndex = tempFileName.lastIndexOf(fileSep);
			        tempFileName = tempFileName.substring(slIndex+1,tempFileName.length);		        
			        // File Name can not have special characters
			        var apostrophePosition = tempFileName.indexOf("'");
			        var hashPosition = tempFileName.indexOf("#");
			        var dollarPosition = tempFileName.indexOf("$");
			        var atPosition = tempFileName.indexOf("@");
			        var andPosition = tempFileName.indexOf("&");
			        var percentPosition = tempFileName.indexOf("%");

			        if ( apostrophePosition != -1 || hashPosition != -1 || dollarPosition != -1 || atPosition != -1 || andPosition != -1  || percentPosition != -1){
			        	//XSSOK I18N Label or Message
			        	alert("<%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Alert.InvalidImage", null)%>");		          
			          	document.ArtworkElementRevise.newImage.focus();
			          	return;
			        }   
			        document.ArtworkElementRevise.fileName0.value = tempFileName;		        
			        //Added by Vaibhav on 28 Oct 2010 to validate image upload
			        if(document.ArtworkElementRevise.fileName0.value != "")
			        {
				        
			            var dotIndex = tempFileName.lastIndexOf(".");
			            var fileExtension = tempFileName.substring(dotIndex+1, tempFileName.length);
			            fileExtension = fileExtension.toLowerCase();
			            //alert(fileExtension);
			           
			            if(fileExtension != "gif" && fileExtension != "jpg" && fileExtension != "png" && fileExtension != "giff" && fileExtension != "jpeg" && fileExtension != "3dxml" && fileExtension != "cgr" && fileExtension != "pdf" && fileExtension != "bmp" && fileExtension != "psd" && fileExtension != "ai" && fileExtension != "tif" &&fileExtension != "eps")
			            {
			                //XSSOK I18N Label or Message
			                alert("<%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Alert.uploadAlert", null)%>");
			                document.ArtworkElementRevise.newImage.focus();
			                return;
			            }
			        }
				}
				if (!iValidForm)
				{
					//XSSOK I18N Label or Message
					alert("<%=AWLPropertyUtil.getI18NString(context, stringResource, "emxAWL.Alert.InvalidForm", null)%>");
					return ;
				}
				formName.action="AWLReviseArtworkElement.jsp";
				turnOnProgress();
				isProcessing = true;
				formName.submit();
		}

	    }

	    // (Not used anymore >> for cleanUp)
		
        function closeWindow()
        {
			getTopWindow().closeSlideInDialog();
        }	
        function cancelSlideIn()
        {
			getTopWindow().closeSlideInDialog();
        }	

</script>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
<%
  //In case of exception in dialog the window is to be closed.
	if (bException)
	{
%>
	<script language="javascript" type="text/javaScript">
	  //<![CDATA[
	     //Releasing Mouse Events
	      var frameContent = findFrame(getTopWindow(),"_top");
	      frameContent.document.location.href = frameContent.document.location.href;
	  	//]]>
	</script>
<%
	}
%>
<%@include file = "../emxUICommonEndOfPageInclude.inc"%>
