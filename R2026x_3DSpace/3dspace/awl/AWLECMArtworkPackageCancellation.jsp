<%--  
	Copyright (c) 1992-2020 Dassault Systemes.
	All Rights Reserved.
	This program contains proprietary and trade secret information of MatrixOne,Inc.
	Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
--%>

<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../productline/emxProductCommonInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>
<%@include file="emxValidationInclude.inc"%>
<%@include file="../components/emxComponentsTreeUtilInclude.inc"%>

<%@page import="matrix.db.Context"%>
<%@page import="java.util.List"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkPackage"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkFile"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>

<script language="javascript" type="text/javascript">

function displayChangeTemplateChooser()  {
		showModalDialog('../common/emxFullSearch.jsp?field=TYPES=type_ChangeTemplate:CURRENT=policy_ChangeTemplate.state_Active&selection=single&table=ECMChangeTemplateSearchSummary&submitAction=refreshCaller&fieldNameActual=ChangeTemplateOID&fieldNameDisplay=ChangeTemplate&includeOIDprogram=enoECMChangeTemplate:getUsageTemplates&mode=chooser&chooserType=FormChooser&submitURL=../awl/AWLECMArtworkPackageCancelCTSearchUtil.jsp',750,650);
}

function displayChangeOrderChooser(){
	var changeTemplateOID 	= document.getElementById('ChangeTemplateOID').value;
	var URL;
	if( changeTemplateOID== "" || changeTemplateOID == "" ){
		 URL="../common/emxFullSearch.jsp?field=TYPES=type_ChangeOrder:CURRENT=policy_FasttrackChange.state_Prepare&showInitialResults=true&table=AEFGeneralSearchResults&selection=single&fieldNameActual=ChangeOrderOID&fieldNameDisplay=ChangeOrder&mode=chooser&chooserType=FormChooser&submitURL=../productline/SearchUtil.jsp";
	}else{
		 URL="../common/emxFullSearch.jsp?field=CO_CHANGEORDER="+changeTemplateOID+":TYPES=type_ChangeOrder:CURRENT=policy_FasttrackChange.state_Prepare";
         URL += "&showInitialResults=true&table=AEFGeneralSearchResults&selection=single&fieldNameActual=ChangeOrderOID&fieldNameDisplay=ChangeOrder&mode=chooser&chooserType=FormChooser&submitURL=../productline/SearchUtil.jsp";
	}
	
	showModalDialog(URL,750,650);
}

</script>
<%
	String sCommand = (String) emxGetParameter(request, "cmd");
	String artworkPackageId = emxGetParameter(request, "objectId");
    String suiteKey = emxGetParameter(request, "suiteKey");
    String strPostProcessURL = new String();
    String actionURL =new String();
    String createNewChangeOrder  = AWLPropertyUtil.getI18NString(context, "emxAWL.CreatePOA.CreateNewChangeOrder");    
    String artworkFilemessage= AWLPropertyUtil.getI18NString(context,"emxAWL.ECM.ArtworkFileSetForRevise");
    String changeFieldsNotEmpty= AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.ChangeTemplateChangeOrder.Empty");
	String nonReleasePOAHeading = AWLPropertyUtil.getI18NString(context, "emxAWL.ECM.NonReleasePOAObsoleteMessage");
	String noPOAPresent = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.NoPOAPresent");
	String releasePOASelectCAMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ECM.ReleasePOASelectCAMessage");
	String labelChangeTemplate = AWLPropertyUtil.getI18NString(context, "emxAWL.Form.Label.ChangeTemplate");
	String labelChangeOrder = AWLPropertyUtil.getI18NString(context, "emxAWL.Form.Label.ChangeOrder");
	String labelName = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Name");
	String labelDescription = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Description");
	String labelState = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.State");
	String labelProductName = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.ProductName");
	
    boolean doValidate = false;
    if(sCommand.equals("cancel") && BusinessUtil.isNotNullOrEmpty(artworkPackageId))
    {
       	ArtworkPackage artworkPackage= new ArtworkPackage(artworkPackageId);
       	boolean blockAction = false;
        	
        List<POA> listOfPOA = artworkPackage.getPOAs(context);
		for(POA poa : listOfPOA)
		{  
			ArtworkFile artworkFile = poa.getArtworkFile(context);
			if(artworkFile.isCAConnectedForRevise(context))
			{
				blockAction = true;
				break;
			}
		}
       	if(blockAction)
       	{
      	       %>
			<script language="javascript" type="text/javascript">
					// XSSOK  unKnownError : Res Bundle-I18N
             	    alert("<%=XSSUtil.encodeForJavaScript(context, artworkFilemessage)%>");
             	    parent.closeWindow();
             	    </script>
			<% 
     	          return;
       	}else{
        	
        	try
            {		
        	    //Get data to show POA Delete/Obsolete Confirmation Page
		        	List<String[]> listOfPOADetails= artworkPackage.getPOAConfirmationPageData(context);
		        	  for(String[] poaEachDetails: listOfPOADetails)
		              	{		
		                 
		                  String changeActionConnectedValid=poaEachDetails[4];
		                  String currentState=poaEachDetails[3];
		                  
	                		if( currentState.equalsIgnoreCase(AWLState.RELEASE.get(context, AWLPolicy.POA.get(context)))&& changeActionConnectedValid.equalsIgnoreCase(AWLConstants.RANGE_NO)){
	                			doValidate= true;
	                	 		break;
	                		 }
		              	}	
		        	 
		        	 
		        	String releasePOAState=AWLState.RELEASE.get(context, AWLPolicy.POA);
		        	StringList states=new StringList();
		        	 for(String[] poaDetails: listOfPOADetails)
 					 {
		        		 String currentstate = poaDetails[3];
		        		 states.add(currentstate);
		        	 }
		        	 boolean artpackcontainsReleaseStatePOA=false;
		        	 if(states.contains(releasePOAState)){
		        		 artpackcontainsReleaseStatePOA=true;
		        	 }
		        	 
		        	 StringList poastateList=new StringList();
		        	 poastateList.add(AWLState.DRAFT.get(context, AWLPolicy.POA.get(context)));
		        	 poastateList.add(AWLState.PRELIMINARY.get(context, AWLPolicy.POA.get(context)));
		        	 poastateList.add(AWLState.ARTWORK_IN_PROCESS.get(context, AWLPolicy.POA.get(context)));
		        	 poastateList.add(AWLState.REVIEW.get(context, AWLPolicy.POA.get(context)));
		        	 poastateList.add(AWLState.APPROVED.get(context, AWLPolicy.POA.get(context)));
		        	 
		        	 boolean artpackcontainsNonReleaseStatePOA=false;
		        	 if(BusinessUtil.matchingAnyValue(states, poastateList)){
		        		 artpackcontainsNonReleaseStatePOA=true;
		        	 }
		        	        	
		        			        	
	                String stateTranslated = null;
	
%>
<style>
#alert_img {
	text-align: right;
	width: 23px;
	vertical-align: top;
	padding: 2px;
}

#subHeader {
	padding: 2px 5px;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	color: #003366;
	text-decoration: underline;
}
</style>

<form name="POAConfirmationPage" method="post"
	action="submit(); return false">
	<div id="elementData">

		   <table class="list" cellpadding="5" cellspacing="2" width="100%">
		   <%
           if(listOfPOADetails.size()==0) 
		   {
		   %>
			<tr>
				<!-- XSSOK noPOAPresent : Local variable coming from Res Bundle-I18N  -->
				<td colspan="4" class="heading1"> <%=noPOAPresent%> </td>
			</tr>
		   </table>
		   <%
		   }
           else
           {
          	 if(artpackcontainsNonReleaseStatePOA)
          	 { 
        	  	 %>
				<table cellpadding="5" cellspacing="2" width="100%">
				<tr>
					<td colspan="1" id="alert_img"><img border="0" alt="Alert" src="../common/images/iconSmallStatusAlert.gif"></td>
					<td colspan="3">
						<span class="pageSubTitle">
						     <!-- XSSOK nonReleasePOAHeading : Local variable coming from Res Bundle-I18N  -->						     
							<h3 id="subHeader"><%=XSSUtil.encodeForHTML(context, nonReleasePOAHeading)%></h3>
						</span>
					</td>
				</tr> </br> </br>
				<%
		 	} 
		 	%>
			</tr>
		</table>
		<%
		//XSSOK doValidate : boolean variable
		if(artpackcontainsReleaseStatePOA && doValidate){ %>
		<table cellpadding="5" cellspacing="2" width="100%">
			<tr>
				<td colspan="1" id="alert_img"><img border="0" alt="Alert" src="../common/images/iconSmallStatusAlert.gif"></td>
				<td colspan="3">
					<span class="pageSubTitle">
					    <!-- XSSOK releasePOASelectCAMessage : Local variable coming from Res Bundle-I18N  -->	
						<h3 id="subHeader"><%=XSSUtil.encodeForHTML(context, releasePOASelectCAMessage)%></h3>
					</span>
				</td>
			</tr>
			</br>
			</br>

		</table>
		</br> </br>
		<tr>
            
             <!-- XSSOK : Local variable coming from Res Bundle-I18N  --> 
			<td nowrap="nowrap" class="labelRequired"><%=XSSUtil.encodeForHTML(context, labelChangeTemplate)%>
			</td>
			<td nowrap="nowrap" class="inputField"><input type="text"
				id="ChangeTemplate" name="ChangeTemplate" size="20"
				readonly="readonly" value="" /> <input type="button" name=""
				value="..." onclick="javascript:displayChangeTemplateChooser();" />
				<input type="hidden" id="ChangeTemplateOID" name="ChangeTemplateOID"
				value="" /></td>
		</tr>

		<tr>
		     <!-- XSSOK : Local variable coming from Res Bundle-I18N  -->
			<td nowrap="nowrap" class="labelRequired"><%=XSSUtil.encodeForHTML(context, labelChangeOrder)	%></td>
			<td nowrap="nowrap" class="field">
			<input type="text" name="ChangeOrder" size="20" readonly="readonly"> 
			<input type="hidden" name="ChangeOrderOID" id="ChangeOrderOID" value=""> 
			<input type="button" name="" value="..." id = "popupco" disabled = "disabled" onclick = "javascript:displayChangeOrderChooser();" /></td>
		</tr>
		<%
		     }
             int iCount = 0;
             String[] ArrEvenOdd = {"even","odd"};
             for(String[] poaDetails: listOfPOADetails)
             {		
                 String name = poaDetails[0];
                 String description = poaDetails[1];
                 String productName = poaDetails[2];;
                 String state = poaDetails[3];
                 String changeActionConnected=poaDetails[4];
                 // XSSOK : Local variable coming from Res Bundle-I18N  
                 stateTranslated = AWLPropertyUtil.getStateI18NString(context, AWLPolicy.POA.get(context), state);
      %>
		<!-- //XSSOK I18N label or message	 -->
		<table class="list" cellpadding="5" cellspacing="2" width="100%">
			<tr>
			     <!-- XSSOK labelName : Local variable coming from Res Bundle-I18N  -->
				<th width="120" nowrap="nowrap" class="sorted"><%=XSSUtil.encodeForHTML(context, labelName)%> </th>
				 <!-- XSSOK labelDescription : Local variable coming from Res Bundle-I18N  -->
				<th width="120" nowrap="nowrap" class="sorted"><%=XSSUtil.encodeForHTML(context, labelDescription)%> </th>
				 <!-- XSSOK labelProductName : Local variable coming from Res Bundle-I18N  -->
				<th width="120" nowrap="nowrap" class="sorted"><%=XSSUtil.encodeForHTML(context, labelProductName)%> </th>
				 <!-- XSSOK labelState : Local variable coming from Res Bundle-I18N  -->
				<th width="120" nowrap="nowrap" class="sorted"><%=XSSUtil.encodeForHTML(context, labelState)%> </th>
			</tr>
			<tr class="<%=ArrEvenOdd[(iCount++ % 2)]%>">
				<td width="25%" style="white-space: nowrap"><%=XSSUtil.encodeForHTML(context, name)%></td>
				<td width="25%" style="white-space: nowrap"><%=XSSUtil.encodeForHTML(context, description)%></td>
				<td width="25%" style="white-space: nowrap"><%=XSSUtil.encodeForHTML(context, productName)%></td>
				<%
	            if(changeActionConnected.equals(AWLConstants.RANGE_YES)) {
					%>
					<!-- XSSOK stateTranslated : Local variable coming from Res Bundle-I18N  -->
					<td width="25%" style="white-space: nowrap; color: #f23433;" class="labelRequired"><%=XSSUtil.encodeForHTML(context, stateTranslated)%></td>
					<%
	            }
	            else {
					%>
					<td width="25%" style="white-space: nowrap">
						<!-- // k3d - HF-203452V6R2013x 20/12/12 - Changed  "state" to "stateTranslated"-->
						<!-- XSSOK stateTranslated : Local variable coming from Res Bundle-I18N  -->
						<%=XSSUtil.encodeForHTML(context, stateTranslated)%>
					</td>
					<%    
				}
				%>
			</tr>
			<% 
		   }
			   }//end else
       	%>
		</table>
	</div>
</form>
<%
	 strPostProcessURL = "../awl/AWLECMArtworkPackageCancellation.jsp?cmd=cancelPostProcess&objectId="+ XSSUtil.encodeForURL(context, artworkPackageId);
    }
	catch(Exception ex)
	{
		ex.printStackTrace();
		if( ( ex.toString()!=null ) && (ex.toString().trim()).length()> 0 )
				emxNavErrorObject.addMessage(ex.toString().trim());
		%>
		<script language="Javascript">
        	alert("<xss:encodeForJavaScript> <%= ex.toString().trim()%> </xss:encodeForJavaScript>");
            parent.closeWindow();
		</script>
		<%
	 }
           
    } //end else of apcontinue
    } //end command
    
   
    
    else if(sCommand.equals("cancelPostProcess"))
    {
			
	  try
		{
	  		ArtworkPackage artworkPackage= new ArtworkPackage(artworkPackageId);
			String changeTemplateId = emxGetParameter(request, "ChangeTemplateOID");
			String changeOrderId = emxGetParameter(request, "ChangeOrderOID");
			artworkPackage.cancel( context, changeTemplateId, changeOrderId	);
		}
	  catch( Exception ex )
	  {
					//isErrorMsg=true;
				    ex.printStackTrace();
					ContextUtil.abortTransaction(context);
					if( ( ex.toString()!=null )
							&& (ex.toString().trim()).length()>0 )
						emxNavErrorObject.addMessage(ex.toString().trim());
	%>
	<script language="Javascript">
		alert("<xss:encodeForJavaScript> <%= ex.toString().trim()%> </xss:encodeForJavaScript>");
        parent.closeWindow();
	</script>
	<%
	}
   	actionURL  =  "../common/emxTree.jsp?AppendParameters=true&objectId=" + XSSUtil.encodeForURL(context, artworkPackageId) + "&emxSuiteDirectory"+ XSSUtil.encodeForURL(context,suiteKey);
  }
    
 %>

<%
if(sCommand.equals("cancelPostProcess")) 
{
%>
     
     <script language="Javascript">
   // Reload Artwork Package Tree and close window
      loadTreeNode("<%=XSSUtil.encodeForJavaScript(context, artworkPackageId)%>", null, null, "<%=XSSUtil.encodeForJavaScript(context, suiteKey)%>", true, "<%=XSSUtil.encodeForJavaScript(context, actionURL)%>");
      parent.closeWindow();
      </script>
      <%
     
}
%>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script type="text/javaScript">

var isProcessing = false;                
function submit()
{
	
        if(isProcessing)
        {
            alert(emxUIConstants.STR_URL_SUBMITTED);
        }
         
        else
        {
        	//XSSOK
        	if (<%=doValidate%>)
            { 
    	      	var changeTemplate 	= document.getElementById('ChangeTemplate').value;
    	      	var changeOrder = document.getElementById('ChangeOrderOID').value;
    	      	if( changeOrder == "" || changeTemplate == "")
    	      	{
    	      		    //XSSOK I18N label or message
    	     	    	alert("<%=XSSUtil.encodeForJavaScript(context, changeFieldsNotEmpty)%>");
    	     	    	return;
    	     	}  
           	}
	        turnOnProgress();
	        isProcessing = true;
	        var formName=document.POAConfirmationPage;
	        formName.action = "<%=XSSUtil.encodeURLForServer(context, strPostProcessURL)%>";
	        formName.submit();
        }
	
}
//close button
function closeWindow()
{
        parent.closeWindow();
   
}
</script>
<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
<%@include file="../emxUICommonEndOfPageInclude.inc"%>

