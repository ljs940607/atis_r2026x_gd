<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../components/emxComponentsUtil.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="java.util.List"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.domain.util.mxType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<script src="../common/scripts/emxUICore.js"></script>
<script src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<%
 
	
	String strObjectID = "";
	String	strURL = " ";
	String strMode = emxGetParameter(request,"mode");
	if("Create".equals(strMode))
	{
		
     try
	{	
	String strObjIdContext = emxGetParameter(request, "objectId");
	
	String[] strTableRowIds = emxGetParameterValues(request, "emxTableRowId");
	String strAWLArtworkElementCheckAlert = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.CannotPerform");
	List<String> selectedIdList = AWLUtil.getSelectedIDs(request);
	if(BusinessUtil.isNotNullOrEmpty(selectedIdList))
	{
       strObjectID = selectedIdList.get(0);
	}
	else{
	    strObjectID = strObjIdContext;
	}
	
    DomainObject domObjForType =  new DomainObject(strObjectID);
    String txtType = domObjForType.getInfo(context,DomainConstants.SELECT_TYPE);
    
    if((mxType.isOfParentType(context, txtType, AWLType.PRODUCT_LINE.get(context)))||(mxType.isOfParentType(context, txtType, AWLType.CPG_PRODUCT.get(context))))
    {
		
			strURL = AWLUtil.strcat("../common/emxCreate.jsp?objectId=",strObjectID,
            	    "&form=type_MasterCopyElement&policy=policy_ArtworkElementContent&createJPO=AWLCopyElementUI:createMasterCopyElement&nameField=autoName&submitAction=doNothing&preProcessJavaScript=addNewAC:checkAcessForYesOnBuildFromList&type=type_TargetMarketMasterCopy&showApply=true&postProcessURL=../awl/AWLArtworkMasterCreateInterMediateProcess.jsp?mode=TabRefresh","&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&SuiteDirectory=AWL");
		
    }
    else  	
    {
%>
		<script language="javascript" type="text/javaScript">
		// XSSOK strAWLArtworkElementCheckAlert : Res Bundle-I18N
		alert("<%=strAWLArtworkElementCheckAlert%>");
		getTopWindow().closeSlideInDialog();
		</script>
<%
	return;
    }
    %>
	<body>
     <form name="ArtworkMasterCreate" method="post">
                <script language="Javascript">
                     getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, strURL)%>", true);
                </script>
     </form>
     </body>
<%

    }catch(Exception e)
   {
	session.setAttribute("error.message", e.getMessage());
   }
}  
	else if("TabRefresh".equals(strMode))
	{
 %>
        <script language="Javascript">
        //Todo need to handle refresh in case of artwork element create in product context
        var frameContent = findFrame(getTopWindow(),"AWLProductLineArtworkElements");
        if (frameContent != null )
        {
        	frameContent.document.location.href = frameContent.document.location.href;
        } else
        {
          parent.document.location.href = parent.document.location.href;
        } 
        </script>
   <%     
      }
   %>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
