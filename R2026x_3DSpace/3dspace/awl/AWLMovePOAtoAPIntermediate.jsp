<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="java.util.List"%>
<%@page import="java.util.HashMap"%>
<script src="../common/scripts/emxUICore.js"></script>
<script src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>

<%
try
{
     String artworkPackageId = emxGetParameter(request,"objectId");
     String artworkPackageState = BusinessUtil.getInfo(context, artworkPackageId, DomainConstants.SELECT_CURRENT);
     boolean isArtworkPackageInWIPstate = AWLState.WORK_IN_PROCESS.get(context, AWLPolicy.ARTWORK_PACKAGE).equals(artworkPackageState);
 
     String[] emxtableRowId = emxGetParameterValues(request, "emxTableRowId");
     String[] poaObjectIds = AWLUIUtil.getObjIdsFromRowIds(emxtableRowId);
     StringList currentState = BusinessUtil.getInfo(context, BusinessUtil.toStringList(poaObjectIds), DomainConstants.SELECT_CURRENT); 
     String selectedPOAs    = FrameworkUtil.join(poaObjectIds, ",");
 
     StringList excludePOAStates = new StringList();
     excludePOAStates.add(AWLState.RELEASE.get(context, AWLPolicy.POA.get(context)));
     excludePOAStates.add(AWLState.OBSOLETE.get(context, AWLPolicy.POA.get(context)));
	 
     String strAlertMessage = "";
     for(String poaState : (List<String>)currentState) 
     {
	    if(excludePOAStates.contains(poaState)) 
	    {
		    strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.MovePOA.POAInStateReleaseObsolete");
%> 

            <script language="javascript" type="text/javaScript">
		        //XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N
                alert("<%=strAlertMessage%>");
            </script>
<%
            return;
	  }//end If 
    }//end for Loop
         
    if(!isArtworkPackageInWIPstate)
    {
         String sURL = AWLUtil.strcat("../common/emxForm.jsp?mode=edit&formHeader=emxAWL.Label.AWLMovePOAtoArtworkPackage&form=AWLMovePOAtoArtworkPackageForm&HelpMarker=emxhelpviewPOA&preProcessJavaScript=movePOAPreProcess&postProcessURL=../awl/AWLMovePOAtoAPProcess.jsp","&suiteKey=","AWL","&StringResourceFileId=emxAWLStringResource","&objectId=",artworkPackageId,"&selectedPOA=",selectedPOAs);
         %> 
         <script language="Javascript">  
                getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>", "true");
         </script>
         <%
    }
    else
    {
         String sURL = AWLUtil.strcat("../common/emxFullSearch.jsp?field=TYPES=type_ArtworkPackage:CURRENT=policy_ArtworkPackage.state_WorkInProcess&table=AEFGeneralSearchResults&selection=single&formName=AWLMovePOAtoArtworkPackageForm&hideHeader=true&HelpMarker=emxhelpviewPOA&excludeOIDprogram= AWLArtworkPackageUI:excludeSourceArtworkPackageInMovePOA&submitURL=../awl/AWLMovePOAtoAPProcess.jsp?suiteKey=","AWL","&selectedPOA=",selectedPOAs,"&objectId=",artworkPackageId); 
	     %>
	     <script language="Javascript">        
	     	  showNonModalDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>",300,300,true,'',"Large");
         </script>
	     <%
         }
	}catch(Exception e)
    {
        e.printStackTrace();
        if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", e.toString());
        }
    }
%>


