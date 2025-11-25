<%--
  enoQuestionnaireSubmit.jsp
  Copyright (c) 1993-2021 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>

 
<%-- Common Includes --%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../common/emxCompCommonUtilAppInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.domain.util.i18nNow"%>
<%@page import="com.matrixone.apps.domain.util.PersonUtil"%>
<%@page import="matrix.db.Context"%> 
<%@page import="com.matrixone.apps.domain.util.EnoviaResourceBundle"%>

<script language="javascript" src="../common/scripts/emxUICore.js"></script>
<script language="javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="javascript" src="../common/scripts/emxUIUtility.js"></script>
    
    
<%
   boolean bIsError = false;
   try
   {
      String strMode = emxGetParameter(request,"mode");
      String strObjId = emxGetParameter(request, "objectId");  
      String strRowId[] = emxGetParameterValues(request, "emxTableRowId");

      if (strRowId == null)
      {   
%>
<script language="javascript" type="text/javaScript">
   alert("<emxUtil:i18n localize='i18nId'>emxFramework.IconMail.FindResults.AlertMsg1</emxUtil:i18n>");
</script>
<%
      }

      else
      {
         if (strMode.equalsIgnoreCase("chooser"))
         {
            String fieldNameHidden = emxGetParameter(request, "fieldNameHidden");
            String fieldNameDisplay = emxGetParameter(request, "fieldNameDisplay");
			String strShowRevision = emxGetParameter(request,"ShowRevision");

            String selObjId = ""; 
            String selObjName = ""; 
			String strObjname = "";
			
			StringBuilder sbObjId = new StringBuilder();
			StringBuilder sbObjName = new StringBuilder();
           	
			for (int i = 0; i < strRowId.length; i++)
			{
				String strTableRowId = strRowId[i];
				StringList objectIdList = FrameworkUtil.split(strTableRowId, "|");
				
				if (objectIdList.size() == 3)
				{
					strTableRowId = (String) objectIdList.get(0);

				} else if(objectIdList.size() == 4)
				{
					strTableRowId = (String) objectIdList.get(1);
				}
				
				DomainObject domObj = DomainObject.newInstance(context, strTableRowId);
				Map objMap = new HashMap();
				
				StringList selectList = new StringList();
				selectList.addElement(DomainConstants.SELECT_TYPE);
				selectList.addElement(DomainConstants.SELECT_NAME);
				selectList.addElement(DomainConstants.SELECT_REVISION);
				selectList.addElement(DomainConstants.SELECT_PHYSICAL_ID);
				
				objMap = domObj.getInfo(context, selectList);
				
				String thisType = (String)objMap.get(DomainConstants.SELECT_TYPE);       			
				String thisPhysicalId = (String)objMap.get(DomainConstants.SELECT_PHYSICAL_ID);       			
				
				if(thisType.equalsIgnoreCase("Person"))
				{
					strObjname = PersonUtil.getFullName(context, (String)objMap.get(DomainConstants.SELECT_NAME));
				} else 
				{		
					if (((strShowRevision != null) && (!strShowRevision.equalsIgnoreCase("")) && !("null".equalsIgnoreCase(strShowRevision))) && (strShowRevision.equalsIgnoreCase("true")))
					{
						//This is to get obj name & rev.
						strObjname = FrameworkUtil.getObjectNameWithRevision(context, strTableRowId);
					} else
					{
						//This has to be read from the bean method.
						strObjname = FrameworkUtil.getObjectName(context, strTableRowId);
					}
				}
				if ("".equals(selObjName) || "null".equals(selObjName))
				{
					selObjName = strObjname;
					selObjId = thisPhysicalId;
				} else
				{
					selObjName = selObjName + "," + strObjname;
					selObjId = selObjId + "," + thisPhysicalId;
				}
			}
%>
<script language="javascript" type="text/javaScript">
var win = getTopWindow().getWindowOpener() ? getTopWindow().getWindowOpener() : parent;
   if(win.emxEditableTable)
   {
            var formName="<xss:encodeForJavaScript><%=emxGetParameter(request, "formName")%></xss:encodeForJavaScript>";
            var vfieldNameHidden  = win.document.forms[formName].elements["<xss:encodeForJavaScript><%=fieldNameHidden%></xss:encodeForJavaScript>"];
            var vfieldNameDisplay = win.document.forms[formName].elements["<xss:encodeForJavaScript><%=fieldNameDisplay%></xss:encodeForJavaScript>"];
            vfieldNameHidden.value ="<xss:encodeForJavaScript><%=selObjId%></xss:encodeForJavaScript>" ;
            vfieldNameDisplay.value ="<xss:encodeForJavaScript><%=selObjName%></xss:encodeForJavaScript>" ;
   }
   else
   {
            var vfieldNameDisplay = win.document.getElementsByTagName("<xss:encodeForJavaScript><%=fieldNameDisplay%></xss:encodeForJavaScript>");
			vfieldNameDisplay[1].id ="<xss:encodeForJavaScript><%=selObjId%></xss:encodeForJavaScript>" ;
            vfieldNameDisplay[1].value ="<xss:encodeForJavaScript><%=selObjName%></xss:encodeForJavaScript>" ;
	        vfieldNameDisplay[1].disabled = "disabled";
   }
</script>
<%
         }
        	 
      }
      
   }
   catch (Exception e)
   {
      bIsError = true;
      session.setAttribute("error.message", "" + e);
   }// End of main Try-catch 
%>

<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
<script language="javascript" type="text/javaScript">
	if(getTopWindow().getWindowOpener() && getTopWindow().getWindowOpener().getTopWindow() != getTopWindow())
		window.getTopWindow().closeWindow();
</script>

