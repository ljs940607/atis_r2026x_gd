<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.domain.util.EnoviaBrowserUtility.Browsers"%>
<%@ taglib uri="awl-taglib.tld" prefix="awl" %>

<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../productline/emxProductCommonInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@include file="emxValidationInclude.inc"%>


<%@page import="matrix.db.Context"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>

<script language="javascript" type="text/javascript" src="../components/emxComponentsJSFunctions.js"></script>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkPackage"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkContent"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.domain.util.ContextUtil"%>
<%@page import = "java.util.StringTokenizer"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil,com.matrixone.apps.awl.enumeration.AWLType"%>
<%@ page import="java.text.MessageFormat" %>

<%
        boolean isIE = EnoviaBrowserUtility.is(request,Browsers.IE);
        String sCommand = (String) emxGetParameter(request, "cmd");
        String domainObjectID = emxGetParameter(request, "objectId");
        String strPostProcessURL = "../awl/AWLArtworkPackageCancellation.jsp?cmd=cancelPostProcess&objectId="+domainObjectID;
        boolean isErrorMsg=false;
        if(sCommand.equals("cancel") && BusinessUtil.isNotNullOrEmpty(domainObjectID) && BusinessUtil.isKindOf(context, domainObjectID, AWLType.ARTWORK_PACKAGE.get(context)))
        {
                ArtworkPackage artworkPackage= new ArtworkPackage(domainObjectID);
                if(artworkPackage.canMoveToCancelState(context))
                {
                try
                {                
                    //Get data to show POA Delete/Obsolete Confirmation Page
                    List<String[]> listOfPOADetails= artworkPackage.getPOAConfirmationPageData(context);
                    String preliminaryPOAState=AWLState.PRELIMINARY.get(context, AWLPolicy.POA);
                                
                    // K3D - HF-200840V6R2013x 27/11/12  Start
                    String sSubHeadingKey = "emxAWL.SubHeading.POADeleteConfirmation";
                    String policyPOA = AWLPolicy.POA.get(context);                  
		        	String message = AWLPropertyUtil.getI18NString(context, sSubHeadingKey);
		        	String obsoleteState = AWLState.OBSOLETE.get(context, AWLPolicy.POA.get(context));
		        	String i18NObsolete  = AWLPropertyUtil.getStateI18NString(context, policyPOA, obsoleteState);	        	
					String sSubHeading = MessageFormat.format(message, i18NObsolete);
                    if(sSubHeading == null) {
                        sSubHeading = "";
                    }
                    // K3D - HF-200840V6R2013x 27/11/12  End
                    // k3d - HF-203452V6R2013x 20/12/12 - Start
                    String stateTranslated = null;
                    // k3d - HF-203452V6R2013x 20/12/12 - End
%>
                    <!-- K3D - 27/11/12  Start-->
                    <style>
                         #alert_img{
                            text-align: right ;
                            width:23px;
                            vertical-align: top;
                            padding:2px;
                         }
                         #subHeader{
                            padding: 2px 5px;
                            font-family:Verdana,Arial,Helvetica,sans-serif;
                            color: #003366;
                            text-decoration: underline;
                         }
                    </style>
                    <!-- K3D - 27/11/12  End-->
                    <!-- create form -->
                    <form name="POAConfirmationPage" method="post" action="submit(); return false" >
                        <div id="elementData">
                        <!-- K3D - HF-200840V6R2013x 27/11/12  Related to Sub heading Issue Start-->
                        <table cellpadding="5" cellspacing="2" width="100%">
                            <tr>
                                <td colspan="1" id="alert_img" >
                                   <img border="0" alt="Alert" src="../common/images/iconSmallStatusAlert.gif">
                                </td>
                                  <td colspan="3" >
                                     <!-- XSSOK sSubHeading : Local variable coming from Res Bundle-I18N -->
                                     <span class ="pageSubTitle"><h3 id="subHeader"><%=sSubHeading%></h3></span>
                                     <br/>
                                </td>
                            </tr>
                        </table>
                        <!-- K3D - HF-200840V6R2013x 27/11/12  End--> 
                        <table class="list" cellpadding="5" cellspacing="2" width="100%" >
                        <%
                            if(listOfPOADetails.size()==0) 
			    {
			 %>
			      <tr>
			        <td colspan="4" class="heading1">
			            <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->                                                                  
			            <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.NoPOAPresent")%>
			        </td>
			      </tr>
			<%
			    }
			    else
			    {
			%>
			      <tr>
			         <th width="120" nowrap="nowrap" class="sorted">
			            <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
			            <%=AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Name")%>
			         </th>
			         <th width="120" nowrap="nowrap" class="sorted">
			            <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
			            <%=AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Description")%>
			         </th>
			         <th width="120" nowrap="nowrap" class="sorted">
			            <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
			            <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Label.ProductName")%>
			         </th>
			         <th width="120" nowrap="nowrap" class="sorted">
			            <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
			            <%=AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.State")%>
			         </th>
			      </tr>
			<%
			      // K3D 28/11/12 - Start
			      int iCount = 0;
			      String[] ArrEvenOdd = {"even","odd"};
			      // K3D 28/11/12 - End

			      for(String[] poaDetails: listOfPOADetails) 
			      { 
			           String name = poaDetails[0]; 
			           String description = poaDetails[1]; 
			           String productName = poaDetails[2];
			           String state = poaDetails[3]; 
			           // k3d - HF-203452V6R2013x 20/12/12 - Start 
			           stateTranslated =AWLPropertyUtil.getStateI18NString(context,AWLPolicy.POA.get(context),state); 
			           // k3d - HF-203452V6R2013x 20/12/12 - End
			%>		   
			           <!-- XSSOK ArrEvenOdd : Elements are retrieved from String array based on some logic  -->
			           <tr class="<%=ArrEvenOdd[(iCount++ % 2)]%>">
			            <!-- XSSOK name : ENCODED IN THE PROGRAM  -->
			           	<td width="25%" style="white-space: nowrap" > <%=name%> </td>
                        <!-- XSSOK description : ENCODED IN THE PROGRAM  -->
                        <td width="25%" style="white-space: nowrap" > <%=description%> </td>
                        <!-- XSSOK productName : ENCODED IN THE PROGRAM  -->
	                    <td width="25%" style="white-space: nowrap" > <%=productName%> </td>
			<%
	                                if(preliminaryPOAState.equals(state)) 
					{
			%>
	                                    <!-- // k3d - HF-203452V6R2013x 20/12/12 - Changed  "state" to "stateTranslated"-->
	                                    <!-- XSSOK stateTranslated : Local variable coming from Res Bundle-I18N  -->
	                                    <td width="25%" style="white-space: nowrap;color:#f23433;" class="labelRequired" > <%=stateTranslated%> </td>
			<%
	                                }
	                                else
	                                {
			%>
	                                    <!-- // k3d - HF-203452V6R2013x 20/12/12 - Changed  "state" to "stateTranslated"-->
	                                    <!-- XSSOK stateTranslated : Local variable coming from Res Bundle-I18N  -->
	                                    <td width="25%" style="white-space: nowrap" > <%=stateTranslated%> </td>
			<%
	                                }
			%>
			           </tr>
			<%
			      }
                                                                                                                                                                                                                                                          }
			 %>
                        </table>
                     </div>
                   </form>
	<%
                     strPostProcessURL = "../awl/AWLArtworkPackageCancellation.jsp?cmd=cancelPostProcess&objectId="+domainObjectID;
               }
               catch(Exception ex)
               {
                     ex.printStackTrace();
                    if( ( ex.toString()!=null ) && (ex.toString().trim()).length()>0 )
                             emxNavErrorObject.addMessage(ex.toString().trim());
               }
          }
        }
        else if(sCommand.equals("cancelPostProcess"))
        {
             ArtworkPackage artworkPackage= new ArtworkPackage(domainObjectID);
             try
             {
                 ContextUtil.startTransaction(context, true);
                 artworkPackage.cancel(context, null, null);
                 ContextUtil.commitTransaction(context);
             }
             catch(Exception ex)
             {
                 isErrorMsg=true;
                 ex.printStackTrace();
                 ContextUtil.abortTransaction(context);
                 if( ( ex.toString()!=null ) && (ex.toString().trim()).length()>0 )
			emxNavErrorObject.addMessage(ex.toString().trim());
	%>       <script language="Javascript">
                     alert("<xss:encodeForJavaScript> <%= ex.toString().trim()%> </xss:encodeForJavaScript>");
                     getTopWindow().closeWindow();
                </script>
         <%
             }
 %>
        <script language="javascript" type="text/javaScript">
<%
        if(sCommand.equals("cancelPostProcess")) 
        {
%>
             parent.getTopWindow().getWindowOpener().location.reload(true);
<%
        } 
        if(!isErrorMsg)         
	{

%>
            parent.closeWindow();
                                  
<%
	}
%>
        </script><%
                         
      }
      else if(sCommand.equals("poaObsolete"))
      {
%>        
           <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> 
<%
           String[] arrTableRowIds = emxGetParameterValues(request, "emxTableRowId");
		   String refreshmode = emxGetParameter(request, "refreshmode");
           if(arrTableRowIds[0].endsWith("|0"))
           {
%>
                  
                  <script language="javascript" type="text/javaScript">
                         // XSSOK I18N label or message
                         alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.CannotPerform")%>");
                         parent.closeWindow();
                  </script>
            <%
                    return;
            }
            ContextUtil.startTransaction(context, true);
            boolean canCommit = true;
            for(int i=0;i<arrTableRowIds.length;i++)
            {
                 if(arrTableRowIds[i].indexOf("|") > 0)
                 {
                      StringTokenizer strTokenizer = new StringTokenizer(arrTableRowIds[i] , "|");
                      String artworkAssemblyRelID= strTokenizer.nextToken();
                      String poaObjectID = strTokenizer.nextToken();
                      String artworkPackageID = strTokenizer.nextToken();
                      POA poaObject = new POA(poaObjectID);
                      ArtworkPackage artworkPackage=new ArtworkPackage(artworkPackageID);
                      if(poaObject.canMoveToObsoleteState(context))
                      {                    	 
                         try
                         {
                              poaObject.obsolete(context);
                         }
                         catch(Exception ex)
                         {
                             ex.printStackTrace();
                             ContextUtil.abortTransaction(context);
                             if( ( ex.toString()!=null ) && (ex.toString().trim()).length()>0 )
                                      emxNavErrorObject.addMessage(ex.toString().trim());
							%> 
                            	<script language="Javascript">
                                	alert("<xss:encodeForJavaScript> <%= ex.toString().trim()%> </xss:encodeForJavaScript>");
                                </script>
                           	<%
                           	canCommit = false;
                           	break;
                         }
                      }
                      else
                      {
                          //Alert message saying Complete or Cancelled Artwork Package not allowed to obsolete POA.
       					   %>
                           <script language="Javascript">
                                 //XSSOK I18N label or message
                                 alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.POAObsoleteNotAllowed")%>");
                           </script>
       					  <%    
                      }
                 }
                 //Currently single row selection
                 break;
            }//end of for
            
            if(canCommit) {
            	ContextUtil.commitTransaction(context);
            	
            	if("poaObsolete".equalsIgnoreCase(refreshmode) && !isIE)
                {
               	 %>
                   	<script language="javascript" type="text/javaScript">
                       	var contentFrameObj = getTopWindow().findFrame(getTopWindow(),"detailsDisplay");
                       	getTopWindow().closeSlideInDialog();
                   		contentFrameObj.location.href=contentFrameObj.location.href;
                     	</script>
                    <%
                }
                else
                {
               	 %>
                   	<script language="javascript" type="text/javaScript">
                       	window.parent.location.href = window.parent.location.href;
                     	</script>
                    <%
                }
            } else {
            	ContextUtil.abortTransaction(context);
            }
            	
            		
      } //end of poaObsolete
        
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
