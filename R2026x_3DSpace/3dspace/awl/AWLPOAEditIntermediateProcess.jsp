<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
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
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.dao.CopyList"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<script src="../common/scripts/emxUICore.js"></script>
<script src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<%
    StringList selects=new StringList();
    selects.add(DomainConstants.SELECT_ID);
    selects.add(AWLConstants.SELECT_MODIFY_ACCESS);  
    selects.add(DomainConstants.SELECT_CURRENT);
   
    String[] strTableRowIds = emxGetParameterValues(request,"emxTableRowId");
    String[] obejctIds = AWLUIUtil.getObjIdsFromRowIds(strTableRowIds);
    StringList selectedObj = BusinessUtil.toStringList(obejctIds);
    String functionality = emxGetParameter(request,"functionality");
    boolean isNotNullOrEmpty = BusinessUtil.isNotNullOrEmpty(selectedObj);
    boolean isPOA = POA.isKindOfPOA(context, selectedObj); 
    boolean isCopyList = CopyList.isKindOfCopyList(context, selectedObj);
    
    String strAlertMessage="";
    //if object is selected but is not of poa  so the following logic is to display correct alert message 
    if(isNotNullOrEmpty && !isPOA)
    {
    	//if poa edit functionality is selected
    	if("EditPOA".equalsIgnoreCase(functionality))
    	{
        
  //start Preprocess If selected Object is not kind of POA stop the operation and show alert message         
%>
        <script language="javascript" type="text/javaScript">
        //XSSOK I18N label or message    
          alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.selectPOA")%>");
        </script>
<%
       		 //end if 
    //preprocess further to check whether POAs can be edited or not
    	}
    }
  //if object is selected but is not of copylist so the following logic is to display correct alert message
    if(isNotNullOrEmpty && !isCopyList)
 {
    	if("EditCopyList".equalsIgnoreCase(functionality))
    	{
   	 		//if copylist edit functionality is selected
    	      
    	  //start Preprocess If selected Object is not kind of CopyList stop the operation and show alert message         
    	%>
    	        <script language="javascript" type="text/javaScript">
    	        //XSSOK I18N label or message    
    	          alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.selectCopyList")%>");
    	        </script>
    	<%
    	}
    }
    //end if 
    //preprocess further to check whether CopyLists can be edited or not
    if(isNotNullOrEmpty && (isCopyList || isPOA))
    {

		MapList editableObjMapList = BusinessUtil.getInfo(context, selectedObj, selects);
		StringList editObjList = new StringList();
		StringList nonEditableObjList = new StringList();
		StringList combinedObjList = new StringList();
		String DRAFT = AWLState.DRAFT.get(context, AWLPolicy.POA);
		for (Object obj : editableObjMapList) 
		{
			Map map = (Map) obj;
			String access = (String) map.get(AWLConstants.SELECT_MODIFY_ACCESS);
			String objId = (String) map.get(DomainConstants.SELECT_ID);
			String current = (String) map.get(DomainConstants.SELECT_CURRENT);
			boolean hasAccessToModify = AWLConstants.RANGE_TRUE.equalsIgnoreCase(access);
			hasAccessToModify = isPOA ? hasAccessToModify && DRAFT.equals(current) : hasAccessToModify;
			if ( hasAccessToModify)
        {
            editObjList.add(objId);
        }else{
        	nonEditableObjList.add(objId);
        }
    }

    selectedObj.removeAll(editObjList);
		combinedObjList.addAll(editObjList);
		combinedObjList.addAll(nonEditableObjList); // This List will contain both Editable and Non-Editable POA/CL
    %>
<%--     //selectedObj has noneditable POAs or copylists ( POAs or copylists in Non-preliminary state)
    if (BusinessUtil.isNotNullOrEmpty(selectedObj)) 
    {
        StringList missingList = new StringList();
        StringList objNames = BusinessUtil.getInfo(context,
                selectedObj, DomainConstants.SELECT_NAME);

        for (int i = 0; i < objNames.size(); i++) {

            missingList.add(objNames.get(i));

        }

        if (BusinessUtil.isNotNullOrEmpty(missingList)) 
        {
            String nameMessage = FrameworkUtil.join(missingList, ", ");
            String key = isPOA ? "emxAWL.Alert.POANoModifyAccess" : "emxAWL.Alert.CopyListNoModifyAccess";
            strAlertMessage = AWLPropertyUtil.getI18NString(context, key);
            strAlertMessage = AWLUtil.strcat(strAlertMessage, "\t", nameMessage);
        }
%>

           <script language="javascript" type="text/javaScript"> 
            //XSSOK i18N label            
             alert("<%=strAlertMessage%>"); 
            </script>
     }
        else
         --%>
  <%      	if(functionality.equalsIgnoreCase("EditPOA"))
        	{

        	String typeOfPOA = POA.standardOrCustomOrMixed(context, combinedObjList);
        	if("Mixed".equalsIgnoreCase(typeOfPOA)){
        		%>
        		<script language="javascript" type="text/javaScript">
    	        //XSSOK I18N label or message    
    	          alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.InvalidPOACombination")%>");
    	        </script>
				<%return; 
        	}
        %>
        	<script language="javascript" type="text/javaScript"> 
   		 	 var functionalityName="AWLPOAEdit";
   			 var isCustom = false
   		 <%
        	if(AWLConstants.RANGE_POABASIS_MARKETING_CUSTOMIZATION.equalsIgnoreCase(typeOfPOA)){
       	%>
                        functionalityName ="AWLCustomizePOAEdit";
                		isCustom = true;
		<%  } %>
           var poaEditURL="../awl/AWLPOAEdit.jsp?functionality="+functionalityName+"&suiteKey=AWL&HelpMarker=emxhelpeditpoa&poaIds=<%=XSSUtil.encodeForURL(context,FrameworkUtil.join(combinedObjList, "|"))%>&isCustomizedPOA="+isCustom+"&maxAllowedActions=10";
            showModalDialog(poaEditURL,600,400,true,'Large');          
            </script>
       <%   }
        	else{
        		%>
        		<script language="javascript" type="text/javaScript">               
                var poaEditURL="../awl/AWLPOAEdit.jsp?functionality=CopyListEdit&suiteKey=AWL&HelpMarker=emxhelpeditpoa&copyListId=<%=XSSUtil.encodeForURL(context,FrameworkUtil.join(combinedObjList, "|"))%>&type=CopyList";
              showModalDialog(poaEditURL,600,400,true,'Large');          
              </script>
       <%   
        	}
       
        
       }          
    //end main if
        %>
            
