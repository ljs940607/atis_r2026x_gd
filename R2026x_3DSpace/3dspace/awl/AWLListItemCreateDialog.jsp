<%@ taglib uri="awl-taglib.tld" prefix="awl" %>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../productline/emxProductCommonInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>
<%@include file="emxValidationInclude.inc"%>
<%@include file="../common/emxRTE.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>

<%!String root_dir = "..";%>


<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>


<%@include file = "../components/emxComponentsJavaScript.js"%>
<!-- XSSOK root_dir : Static -->
<script type="text/javascript" src="../components/emxComponentsJSFunctions.js"></script>
<!-- XSSOK root_dir : Static -->
<script type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>
<!-- XSSOK root_dir : Static -->
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<!-- XSSOK root_dir : Static -->
<script type="text/javascript" src="../awl/scripts/AWLCopyElementValidation.js"></script>
<%
String strDesResName = "";
String strDesResId = "";
java.util.List<Map<String, String>> typeList = ArtworkElementUtil.getListItemTypes(context); 
    try {
           String immediateParentId = emxGetParameter(request, "objectId");
%>
<!-- create form -->
<form name="ArtworkMasterCreate" method="post" onsubmit="submitForm(); return false" style="overflow:hidden; ">
	   	
	<input type="hidden" name="txtFeatureOwnerName" size="20" value="<xss:encodeForHTMLAttribute><%=context.getUser()%></xss:encodeForHTMLAttribute>" readonly="readonly"/>	
    
    <div id="masterElementData" style="float:center;">
        <table border="0" cellpadding="5" cellspacing="2" width="100%">
            
           <awl:labelReq localize="i18nId">emxFramework.Basic.Type</awl:labelReq>
            <awl:field>
            		<select name="txtFeatureActualType" onchange="javascript:changeYesNoOption()" style="max-width: 330px;">
            		<%
            			for(Map<String, String> map: typeList)
            		            			{
            		            				String name=map.get("name");
            		            				String displayname=map.get("displayname");
            		            				String disabledStr=(map.get("abstract")).equals("true")?"disabled='disabled'":"";
            		%>
            					<option  style="max-width: 320px;" value="<xss:encodeForHTMLAttribute><%=name%></xss:encodeForHTMLAttribute>" <%=disabledStr%> ><%=displayname%> </option>
            		<%
            			}
            		%>
            		 </select>	
			</awl:field>
            <awl:labelReq localize="i18nId">emxFramework.Attribute.Marketing_Name</awl:labelReq>
			<awl:field><input type="text" name="txtMarketingName" size="20" onBlur="setMarketingNameFlag()" /></awl:field>
            <!--XSSOK language value is coming from request header -->
            <awl:label localize="i18nId" bundle="emxAWLStringResource" language="<%=language%>" >emxAWL.Table.CopyText</awl:label>

            <awl:field>
				<div>
					<textarea cols="25" name="txtFeatureMarketingText" class="rte" rows="6"></textarea>
				</div>				
			</awl:field>
            <!--XSSOK language value is coming from request header -->
            <awl:label localize="i18nId" bundle="emxAWLStringResource" language="<%=language%>" >emxAWL.Attribute.Design_Responsibility</awl:label>
			
			<awl:field>
			        <% String organization = (String)JPO.invoke(context,"AWLObject",null,"getCurrentOrg",null,String.class); %>
					<input type="text" name="txtFeatureDesResp" size="20" readonly="readonly" value="<xss:encodeForHTMLAttribute><%=organization%></xss:encodeForHTMLAttribute>" /> 
			</awl:field>
		</table>


</form>


<%
	} catch (Exception e) {
            emxNavErrorObject.addMessage(e.toString().trim());
            session.setAttribute("error.message", e.toString().trim());
        }
%>

<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script type="text/javaScript">

var  formName = document.ArtworkMasterCreate;
var separator="";
var removeCopyText = "No";
var listCopyItems =[];
var isProcessing = false;		

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
<%
String strURL = "../awl/AWLArtworkElementProcess.jsp?context=createCopyElement";
%> 
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

 </script>
<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
<%@include file="../emxUICommonEndOfPageInclude.inc"%>
   


