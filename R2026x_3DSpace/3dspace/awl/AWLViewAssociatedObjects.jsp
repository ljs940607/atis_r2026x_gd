
<%--
   AWLViewCountries.jsp
   Displays Countries assigned to CPG Products
   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
   Author: VD8
--%>

<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>

<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>

<link href="../common/styles/emxUIDefault.css" rel="stylesheet" type="text/css">
<link href="../common/styles/emxUIList.css" rel="stylesheet" type="text/css">

<html>
<body>
	<%

	String queryForJPO = emxGetParameter(request, "queryForJPO");
	StringList objectNames = new StringList();
	
	
	if("true".equalsIgnoreCase(queryForJPO))
	{
		String argNames = emxGetParameter(request, "argNames");
		String program = emxGetParameter(request, "program");
		String method = emxGetParameter(request, "method");
		
		Map infromationMap = new HashMap();
		String[] argNameArr = argNames.split(",");
		for(String argName : argNameArr) {
			infromationMap.put(argName, emxGetParameter(request, argName));	
		}
		objectNames = (StringList) JPO.invoke(context, program, null, method, JPO.packArgs(infromationMap) , StringList.class);
	}
	else
	{
		String objectId = emxGetParameter(request, "objectId");
		String relationshipName = PropertyUtil.getSchemaProperty(context, emxGetParameter(request, "rel_Name"));
		boolean fromSide = "true".equalsIgnoreCase(emxGetParameter(request, "fromSide"));
		boolean toSort = "true".equalsIgnoreCase(emxGetParameter(request, "sort"));
		String toBeFetchedtype = PropertyUtil.getSchemaProperty(context, emxGetParameter(request, "toBeFetchedtype"));
		
		DomainObject dobj = new DomainObject(objectId);
		
		StringList busSel = BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_ID, DomainConstants.SELECT_CURRENT);
		StringList relSel = BusinessUtil.toStringList(DomainRelationship.SELECT_ID);
		MapList infoList = dobj.getRelatedObjects(context, //context the eMatrix Context object
												relationshipName,//relationshipPattern - pattern to match relationships 
												toBeFetchedtype, //typePattern - pattern to match types
												busSel, //objectSelects the eMatrix StringList object that holds the list of select statement pertaining to Business Obejcts.
												relSel, //relationshipSelects the eMatrix StringList object that holds the list of select statement pertaining to Relationships.
												fromSide, //getTo - get To relationships
												!fromSide, //getFrom - get From relationships
												(short)1, //recurseToLevel - the number of levels to expand, 0 equals expand all.
												DomainConstants.EMPTY_STRING, //objectWhere - where clause to apply to objects, can be empty ""
												DomainConstants.EMPTY_STRING, //relationshipWhere - where clause to apply to relationship, can be empty ""
												0); //limit The max number of Objects to get in the exapnd. 0 to return all the data available. */
														
		if(toSort)
		{
			infoList.sort(DomainConstants.SELECT_NAME, "ascending", "String");
		}
												
		objectNames = BusinessUtil.toStringList(infoList, DomainConstants.SELECT_NAME);
	}
	
	   out.println("<table class=\"list\">");
	   if(objectNames.size() > 0) 
	   {
	     for(int i=0; i<objectNames.size(); i++) {
			boolean odd = ((i % 2) != 0);                    
	       	out.println("<tr class=\"" + (odd ? "odd" : "even") + "\"><td>" + objectNames.get(i) + "</td></tr>");
	    	}
	   } 
	   else 
	   {
	%>
	      <tr>
	        <td align="center" colspan="13" class="error">
	        <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N  -->
	              <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.NoObjectsAssigned")%>
	        </td>
	      </tr>
      	<%          
      }
        out.println("</table>");
	%>
	<script language="javascript" type="text/javaScript">
        
        function submit()
        {
            getTopWindow().closeSlideInDialog();
        }
        function cancelSlideIn()
        {
            getTopWindow().closeSlideInDialog();
        }
    </script>
	<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>

</body>
</html>
